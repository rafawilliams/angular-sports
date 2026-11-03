---
author: Rafael Williams
branch: ci/remove-ai-workflows-weekly-audit
status: in-progress
---
# Quitar los workflows de auto-fix con IA y auditar master cada semana

## Intent

La revisión de `.github/workflows` encontró que los 3 workflows de Dependabot no aportan y hacen
daño:

- `ai-fix-vulnerabilities.yml` commitea `test_output.txt` en todos los PRs de Dependabot (#95 y
  #96), con el mensaje «fix: AI-generated fixes for test failures» aunque los tests pasen.
- Su paso de IA nunca corre: `npm test | tee` sin `pipefail` siempre da éxito. Si corriera,
  fallaría (no instala `anthropic`), y `ai_fixer.py` escribe en cualquier ruta que devuelva el modelo.
- En `auto-fix-vulnerabilities.yml` el auto-merge se salta cuando los tests pasan y solo se
  activaría con un test inestable. Además haría squash-merge sin revisión, en contra del
  principio 14 y de `REVIEW.md`.
- `notify-failures.yml` solo escucha a `auto-fix`.

La detección de vulnerabilidades la hace GitHub (Dependabot alerts y security updates, ambos
activos), no estos workflows. El hueco real es otro: el CI solo audita en PR o push, así que una
vulnerabilidad publicada en una semana sin cambios no lo pone en rojo.

## Scope

- Dentro: borrar `ai-fix-vulnerabilities.yml`, `auto-fix-vulnerabilities.yml`,
  `notify-failures.yml` y `.github/scripts/ai_fixer.py`. Añadir a `ci.yml` una ejecución semanal
  (`schedule`) y manual (`workflow_dispatch`).
- Fuera:
  - Los secretos `PAT_TOKEN` y `ANTHROPIC_API_KEY` de GitHub: borrarlos es cosa del propietario.
  - Limpiar los PRs #95 y #96 (`@dependabot recreate` tras el merge).
  - Notificaciones, push protection y CodeQL: son ajustes de GitHub.

## Checklist

- [x] Workflows y script borrados sin referencias — prueba: grep en el repo.
- [x] `ci.yml` con `schedule` + `workflow_dispatch` — prueba: YAML válido.
- [ ] CI en verde en el PR — prueba: run del PR.
- [x] `rsc risk` + revisión según tier.

## Evidence

- Antes de borrar:
  - PRs #95 y #96 con el commit «fix: AI-generated fixes for test failures», que solo añade
    `test_output.txt`. En #96 ese fichero muestra 117/117 en verde.
  - Primer run de auto-fix en #96: `test: success`, `auto-fix: skipped`, `auto-merge: skipped`.
- Grep: fuera de este documento no hay referencias a los ficheros borrados ni a
  `PAT_TOKEN`/`ANTHROPIC_API_KEY`. No hay protección de rama (404) ni rulesets (`[]`), así que
  ningún check obligatorio dependía de ellos.
- `ci.yml`: los triggers son `pull_request`, `push`, `schedule` (`0 7 * * 1`, lunes 07:00 UTC) y
  `workflow_dispatch`. Los runs semanal y manual no se cancelan (`cancel-in-progress` solo vale
  en PRs) y hacen checkout de `master`.
- El audit puede fallar: en un proyecto aparte con `minimist@1.2.0` como dependencia de
  producción, `npm audit --omit=dev --audit-level=high` da 1 critical y exit 1. Como dependencia
  de desarrollo da exit 0.
- La detección no depende de lo borrado: Dependabot alerts activas (204), security updates
  activas y secret scanning activo.
- `rsc risk`: tier 2 (ci). Revisión con 3 refuters, 0 bloqueantes.
- Notas:
  - GitHub desactiva los workflows programados tras 60 días sin actividad en repos públicos.
    La actividad de Dependabot lo mantiene vivo; si el repo se queda quieto, el run semanal se
    para sin avisar.
  - El email por fallo llega a quien modificó por última vez el cron, según sus ajustes de
    notificaciones de Actions.
  - Para probarlo sin esperar al lunes: `gh workflow run CI --ref master`.
- Pendiente del propietario: borrar los secretos huérfanos `PAT_TOKEN` y `ANTHROPIC_API_KEY`
  (Actions y Dependabot), o rotarlos si se quedan, y pedir `@dependabot recreate` en #95 y #96.

## Next

Push y PR.
