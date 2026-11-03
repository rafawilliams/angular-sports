---
author: Rafael Williams
branch: chore/rsc-harness-typescript
status: in-progress
---
# Instalar rsc-harness y restaurar TypeScript compatible con Angular

## Intent

Versionar la instalación de rsc-harness (plan `eeeb8cad…041e`) y la constitución v1.0.0, y
devolver `master` al principio 2: Dependabot subió `typescript` a `~7.0.2`, fuera del peer
`>=6.0 <6.1` de `@angular/build@22.2.4`, y `npm install` falla con ERESOLVE.

## Scope

- Dentro: commit del harness + docs; `typescript` → `~6.0.3`; lockfile regenerado; build y tests.
- Fuera: workflow de CI (principio 12), angular-eslint (principio 5), ignore de Dependabot para
  majors de typescript. Van en PRs aparte.

## Checklist

- [ ] Commit del harness y la constitución — prueba: `git log` muestra el commit, árbol limpio de esos paths.
- [ ] `typescript` a `~6.0.3` — prueba: `npm install` sin `--force` termina sin ERESOLVE.
- [ ] `ng build` (producción) pasa — prueba: salida del build sin errores.
- [ ] `ng test` pasa — prueba: resumen de Vitest en verde.
- [ ] `rsc risk` + revisión según tier — prueba: tier registrado y resultado de la revisión.
- [ ] Push y PR abierto — prueba: URL del PR.

## Evidence

## Next

Commit del harness.
