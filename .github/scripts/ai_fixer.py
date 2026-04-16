"""
ai_fixer.py — Analiza errores de tests con Claude API y aplica los fixes automáticamente.

Flujo:
  1. Lee test_output.txt generado por el workflow
  2. Recolecta los archivos fuente relevantes del proyecto
  3. Envía el contexto a Claude con prompt caching
  4. Parsea la respuesta y sobreescribe los archivos modificados
"""

import os
import re
import sys
from pathlib import Path

import anthropic

# ---------------------------------------------------------------------------
# Configuración
# ---------------------------------------------------------------------------

MODEL = "claude-sonnet-4-6"
MAX_TOKENS = 8192

# Extensiones y directorios que se incluyen como contexto
SOURCE_EXTENSIONS = {".ts", ".html", ".css", ".json"}
SOURCE_DIRS = ["src/app"]
EXCLUDE_PATTERNS = [".spec.ts", "node_modules", ".git", "dist", "out-tsc"]

# Límite de tamaño por archivo para no saturar el contexto (bytes)
MAX_FILE_SIZE = 50_000


# ---------------------------------------------------------------------------
# Recolección de archivos
# ---------------------------------------------------------------------------

def should_include(path: Path) -> bool:
    path_str = str(path)
    if any(pattern in path_str for pattern in EXCLUDE_PATTERNS):
        return False
    if path.suffix not in SOURCE_EXTENSIONS:
        return False
    if path.stat().st_size > MAX_FILE_SIZE:
        return False
    return True


def get_relevant_files() -> dict[str, str]:
    """Devuelve un dict {ruta_relativa: contenido} de los archivos fuente."""
    root = Path(".")
    files: dict[str, str] = {}

    for source_dir in SOURCE_DIRS:
        for path in (root / source_dir).rglob("*"):
            if path.is_file() and should_include(path):
                rel = path.relative_to(root).as_posix()
                try:
                    files[rel] = path.read_text(encoding="utf-8")
                except Exception as exc:
                    print(f"[WARN] No se pudo leer {rel}: {exc}", file=sys.stderr)

    # Incluir package.json para tener contexto de versiones
    pkg = root / "package.json"
    if pkg.exists():
        files["package.json"] = pkg.read_text(encoding="utf-8")

    return files


def build_files_block(files: dict[str, str]) -> str:
    parts = []
    for rel, content in files.items():
        parts.append(f"### {rel}\n```\n{content}\n```")
    return "\n\n".join(parts)


# ---------------------------------------------------------------------------
# Parseo de la respuesta de Claude
# ---------------------------------------------------------------------------

def parse_fixes(response_text: str) -> dict[str, str]:
    """
    Extrae los archivos modificados de la respuesta de Claude.

    Formato esperado en la respuesta:
        ### FILE: src/app/foo/bar.ts
        ```typescript
        // contenido completo
        ```
    """
    fixes: dict[str, str] = {}

    # Patrón: ### FILE: <ruta>\n```<lang>\n<contenido>\n```
    pattern = re.compile(
        r"###\s+FILE:\s+(?P<path>[^\n]+)\n```[^\n]*\n(?P<content>.*?)```",
        re.DOTALL,
    )

    for match in pattern.finditer(response_text):
        file_path = match.group("path").strip()
        content = match.group("content")
        fixes[file_path] = content

    if not fixes:
        print("[WARN] Claude no devolvió ningún bloque ### FILE: en su respuesta.")
        print("[INFO] Respuesta completa:\n", response_text[:2000])

    return fixes


def apply_fixes(fixes: dict[str, str]) -> None:
    """Sobreescribe los archivos con el contenido propuesto por Claude."""
    if not fixes:
        print("[INFO] No hay fixes que aplicar.")
        return

    for file_path, content in fixes.items():
        path = Path(file_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        print(f"[FIX] Aplicado: {file_path}")


# ---------------------------------------------------------------------------
# Llamada a Claude con prompt caching
# ---------------------------------------------------------------------------

def fix_with_ai() -> None:
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("[ERROR] ANTHROPIC_API_KEY no está definida.", file=sys.stderr)
        sys.exit(1)

    # 1. Leer errores de tests
    test_output_path = Path("test_output.txt")
    if not test_output_path.exists():
        print("[ERROR] test_output.txt no encontrado.", file=sys.stderr)
        sys.exit(1)

    test_errors = test_output_path.read_text(encoding="utf-8")
    print(f"[INFO] test_output.txt leído ({len(test_errors)} chars)")

    # 2. Recolectar archivos fuente
    source_files = get_relevant_files()
    print(f"[INFO] {len(source_files)} archivo(s) recolectado(s) como contexto")
    files_block = build_files_block(source_files)

    # 3. Llamar a Claude con prompt caching en el bloque de archivos
    client = anthropic.Anthropic(api_key=api_key)

    system_prompt = (
        "Eres un experto en Angular y TypeScript. "
        "Cuando identifiques un problema en el código, devuelves ÚNICAMENTE los archivos "
        "que necesitan modificación usando este formato exacto para cada archivo:\n\n"
        "### FILE: <ruta/relativa/al/archivo>\n"
        "```<extensión>\n"
        "<contenido completo del archivo corregido>\n"
        "```\n\n"
        "No incluyas explicaciones fuera de los bloques de código. "
        "Si un archivo no necesita cambios, no lo incluyas en la respuesta."
    )

    user_message = (
        f"Los siguientes tests fallaron tras una actualización de dependencias (Dependabot PR).\n\n"
        f"## Errores de tests\n```\n{test_errors[:8000]}\n```\n\n"
        f"## Archivos fuente del proyecto\n\n{files_block}"
    )

    print("[INFO] Enviando contexto a Claude...")

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=[
                {
                    "type": "text",
                    "text": system_prompt,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": user_message,
                            "cache_control": {"type": "ephemeral"},
                        }
                    ],
                }
            ],
        )
    except anthropic.APIError as exc:
        print(f"[ERROR] Fallo en la API de Anthropic: {exc}", file=sys.stderr)
        sys.exit(1)

    ai_response = response.content[0].text
    print(f"[INFO] Respuesta recibida ({len(ai_response)} chars). "
          f"Tokens usados — entrada: {response.usage.input_tokens}, "
          f"salida: {response.usage.output_tokens}")

    # 4. Parsear y aplicar fixes
    fixes = parse_fixes(ai_response)
    apply_fixes(fixes)

    if fixes:
        print(f"[OK] {len(fixes)} archivo(s) modificado(s) por Claude.")
    else:
        print("[WARN] Claude no propuso ningún cambio de archivo.")
        sys.exit(1)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    fix_with_ai()
