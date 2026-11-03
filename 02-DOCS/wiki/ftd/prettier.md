---
author: Rafael Williams
branch: chore/prettier
status: in-progress
---
# Prettier

## Intent

Implantar la parte de formato del principio 5: el código está formateado con Prettier. Hoy
Prettier no está instalado, hay dos configuraciones (`package.json` y `.prettierrc.json`) y los 32
ficheros de `src` difieren del formato.

## Scope

- Dentro:
  - Instalar `prettier` con versión exacta.
  - Una sola configuración: la de `package.json`, que es la que Prettier resuelve hoy
    (`--find-config-path` → `package.json`). Borrar `.prettierrc.json`, que se ignora.
  - `prettier --write` sobre `src/**/*.{ts,html,css}`.
  - Script `format`/`format:check` y paso en CI.
  - `.git-blame-ignore-revs` con el commit de formato.
- Fuera: docs, workflows y JSON de configuración. Ningún cambio de comportamiento.

## Checklist

- [x] Prettier instalado y una sola config — prueba: `--find-config-path` y `git status`.
- [x] `src` formateado — prueba: `prettier --check` exit 0.
- [x] Sin cambios de comportamiento — prueba: `ng lint`, `ng build`, `ng test --watch=false`; diff `-w` sin cambios de lógica.
- [ ] Paso en CI — prueba: run del PR en verde.
- [x] `rsc risk` + revisión según tier.

## Evidence

- Configuración: antes del cambio, `prettier --find-config-path` devolvía `package.json`, así que
  `.prettierrc.json` se ignoraba. Antes de formatear, 32 de los 32 ficheros de `src` diferían.
- `endOfLine: auto`: el repo tiene `core.autocrlf=true`. Una sonda CRLF dentro de `src` pasa con
  la config del proyecto; la sonda se borró después.
- Tras formatear: `format:check` exit 0, `ng lint` limpio, `ng test` 117/117.
- Equivalencia compilada (build de producción de `master` 16f9d07 frente a la rama):
  - `styles-*.css` byte-idéntico.
  - El `main-*.js` formateado difiere en 3 líneas: `" Ship to "` → `" Ship to"`,
    `" Delivery Address "` → `" Delivery Address"` y `" Options "` → `" Options"`. Son espacios
    finales en un flex item de `.section-title` (`display:flex; gap`), que no se renderizan.
- `rsc risk`: tier 2 (billing, ci, customer-data, orders).
- Revisión con 3 refuters, 0 hallazgos:
  - Corrección: sin choques con `.editorconfig` ni ESLint; glob portable entre Windows y Linux.
    Pregunta: `.git-blame-ignore-revs` requiere mergear con merge commit (lo que el repo ya
    hace); con squash o rebase cambia el SHA.
  - Seguridad: solo prettier, de registry.npmjs.org, sin scripts de instalación.
  - Tests: el gate falla con comillas dobles, mala indentación, HTML y CSS (exit 1) y pasa al
    restaurar. Todo CRLF da exit 0; mezcla de CRLF y LF da exit 1. 117/117 desde la copia.

## Next

Push y PR (mergear con merge commit, no squash).
