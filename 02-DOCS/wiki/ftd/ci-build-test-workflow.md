---
author: Rafael Williams
branch: ci/build-test-workflow
status: in-progress
---
# Workflow de CI: build + test en cada PR

## Intent

Implantar el principio 12 de la constitución: un PR solo se mergea con CI verde (`npm ci`,
`ng build`, `ng test`). Hoy ningún workflow compila ni prueba los PRs de personas, y el job de
tests existente solo corre para Dependabot. Así llegó `typescript@7` a `master`.

## Scope

- Dentro: `.github/workflows/ci.yml`, que corre en `pull_request` y `push` a `master` con
  `npm ci`, `ng build`, `ng test --watch=false` y `npm audit --omit=dev --audit-level=high`
  (principio 16). Permisos mínimos (`contents: read`).
- Fuera: marcar el check como requerido en la protección de rama de GitHub (es configuración del
  repo, la hace el propietario); angular-eslint (principio 5); los workflows de vulnerabilidades.

## Checklist

- [x] `ci.yml` escrito — prueba: el YAML parsea y los comandos son los de `package.json`.
- [x] Los pasos pasan en local — prueba: `npm ci`, `ng build`, `ng test --watch=false` y `npm audit --omit=dev --audit-level=high` con exit 0.
- [x] `rsc risk` + revisión según tier — prueba: tier y resultado registrados.
- [x] El workflow corre en verde en GitHub — prueba: run del PR en estado success.

## Evidence

- YAML: `yaml.safe_load` y `js-yaml` parsean `ci.yml` (6 pasos).
- Local, Node 22.23.4: `npm ci` exit 0; `ng build` «Application bundle generation complete»;
  `ng test --watch=false` «Test Files 8 passed (8) · Tests 90 passed (90)»;
  `npm audit --omit=dev --audit-level=high` «found 0 vulnerabilities», exit 0.
- `rsc risk`: tier 2 (clase `ci`), 3 revisores, aprobación humana obligatoria.
- Revisión tier 2 (3 refuters, contexto fresco): 0 bloqueantes, 0 should-fix.
  - Tests: mutantes en una copia `git archive`. Romper un `toBe` en `cart.service.spec.ts` hace
    que `ng test` salga con 1 (4 fallos). Un `{{ nonexistent.foo }}` en el template de
    product-list hace que `ng build` salga con 1 (TS2339). No hay `|| true` ni
    `continue-on-error`.
  - Nit (seguridad + tests): `cancel-in-progress` cancelaba runs de push a master → ahora solo en
    PRs.
  - Aceptados sin cambio: tags `@v7` (convención del repo; fijar por SHA sería para todos los
    workflows), `npm ci --ignore-scripts` (sin probar), run duplicado en PRs de Dependabot con
    auto-fix.

- GitHub (PR #90, run 41612736696): `build-test` pass en 26 s. Node 22.23.4 de la cache del runner;
  `npm ci` 285 paquetes; build OK; «Test Files 8 passed (8)»; «found 0 vulnerabilities».

## Next

Commit, push y PR. Después, que el propietario marque `CI / build-test` como check requerido en
la protección de `master`.
