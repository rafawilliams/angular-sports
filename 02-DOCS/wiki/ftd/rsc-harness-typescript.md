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

- [x] Commit del harness y la constitución — prueba: `git log` muestra el commit, árbol limpio de esos paths.
- [x] `typescript` a `~6.0.3` — prueba: `npm install` sin `--force` termina sin ERESOLVE.
- [x] `ng build` (producción) pasa — prueba: salida del build sin errores.
- [x] `ng test` pasa — prueba: resumen de Vitest en verde.
- [x] `rsc risk` + revisión según tier — prueba: tier registrado y resultado de la revisión.
- [ ] Push y PR abierto — prueba: URL del PR.

## Evidence

- Commit `75b5bf0` `🔧 chore(harness): instalar rsc-harness y ratificar constitución v1.0.0`.
- `npm install`: «added 2 packages, removed 16 packages, changed 43 packages», sin ERESOLVE.
  `npm ls`: typescript@6.0.3 deduped bajo @angular/build, @angular/cli y @angular/compiler-cli.
  El lockfile solo elimina `@typescript/typescript-*` (binarios nativos de TS 7) y la copia anidada
  de `@schematics/angular`.
- Entorno: Node local v22.14.0 < mínimo de Angular 22.2 (22.22.3). Instalado y activado Node
  22.23.4 con nvm (decidido por el propietario); después, 0 avisos EBADENGINE.
- `ng build`: «Application bundle generation complete», inicial 339.12 kB (budget de aviso 500 kB).
- `ng test --watch=false`: Vitest 5.0.5, «Test Files 8 passed (8) · Tests 90 passed (90)».
- `npm audit --omit=dev`: «found 0 vulnerabilities» (principio 16). `npm audit` completo: 1 high en
  `vite` 8.3.0–8.3.2 vía `launch-editor` (dev, fuera de alcance).
- `rsc risk`: tier 2 (clases harness y secrets por `.claude/*`, `CLAUDE.md` y
  `01-TOOLS/_TEMPLATE/.env.example`, todos generados por el instalador), 3 revisores, aprobación
  humana obligatoria. `package.json` / lockfile: clase default.
- Revisión tier 2 (3 refuters, contexto fresco): 0 bloqueantes.
  - Corrección: 1 nit (log de la constitución desfasado) → entrada v1.0.1.
  - Seguridad: 2 should-fix (allow de `git push`/`gh pr create` commiteado; knowledge-sync
    subiendo docs al remoto público) → `rsc git-permissions off`, `rsc knowledge-sync off`, rama
    remota `rsc/knowledge` borrada. 1 nit (auto-update sin preguntar) → `.rsc/.no-auto-update`.
  - Tests: 0 hallazgos. `npm ci` limpio desde `git archive HEAD`, `tsc -v` 6.0.3, 90/90, sin
    `.skip`/`.only`, `tsc -p tsconfig.spec.json --noEmit` OK.

## Next

Push de la rama y PR; el merge lo aprueba el propietario (tier 2).
