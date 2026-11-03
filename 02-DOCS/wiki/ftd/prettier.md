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

- [ ] Prettier instalado y una sola config — prueba: `--find-config-path` y `git status`.
- [ ] `src` formateado — prueba: `prettier --check` exit 0.
- [ ] Sin cambios de comportamiento — prueba: `ng lint`, `ng build`, `ng test --watch=false`; diff `-w` sin cambios de lógica.
- [ ] Paso en CI — prueba: run del PR en verde.
- [ ] `rsc risk` + revisión según tier.

## Evidence

## Next

`prettier --write`.
