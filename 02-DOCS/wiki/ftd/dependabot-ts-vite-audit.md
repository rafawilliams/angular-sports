---
author: Rafael Williams
branch: chore/dependabot-ts-vite-audit
status: in-progress
---
# Dependabot sin majors de TypeScript + vite parcheado

## Intent

- Principio 14: que Dependabot no proponga majors de `typescript`. `typescript@7` rompió
  `master` porque `@angular/build` solo acepta `>=6.0 <6.1`.
- Principio 16, ampliado a desarrollo: quitar la vulnerabilidad high de `vite` 8.3.0–8.3.2
  (launch-editor y fs.allow del dev server). `@angular/build@22.2.4` fija `vite` 8.3.0 y
  `22.2.5` trae `vite` 8.3.5 con el mismo peer de TypeScript.

## Scope

- Dentro: `ignore` de `version-update:semver-major` para `typescript` en `.github/dependabot.yml`;
  `@angular/build` y `@angular/cli` a `^22.2.5` (patch).
- Fuera: la vulnerabilidad moderate de `minimatch` vía eslint. `npm audit fix --force` bajaría
  `typescript-eslint` a 8.14.0, que rompe la configuración. Queda registrada para cuando
  eslint publique una versión con el arreglo.

## Checklist

- [x] `dependabot.yml` ignora majors de typescript — prueba: YAML válido y regla en el bloque npm.
- [x] `vite` ≥ 8.3.3 — prueba: `npm ls vite` y `npm audit` sin high.
- [x] Sin regresiones — prueba: `format:check`, `ng lint`, `ng build`, `ng test --watch=false`.
- [x] `rsc risk` + revisión según tier.
- [ ] CI del PR en verde.

## Evidence

- `dependabot.yml`: `yaml.safe_load` OK. La regla `ignore` está en el bloque npm, con
  `update-types: ["version-update:semver-major"]`. No hay forma de ejecutar Dependabot en local:
  el efecto real se verá en su próxima ejecución en GitHub.
- Actualización: `npm install` de subconjuntos de `@angular/*` daba ERESOLVE, porque los
  paquetes del framework exigen versiones exactas entre sí y no se pueden subir de uno en uno.
  El estado previo, todo en 22.2.3 con build/cli en 22.2.4, era válido; no había nada roto.
  `ng update @angular/core@22.2.4 @angular/cli@22.2.5` los sube juntos. Es higiene de patch y el
  único camino a `vite` 8.3.5, porque `@angular/build@22.2.4` fija `vite` 8.3.0.
- Lockfile: 33 paquetes cambian de versión, todos patches (Angular, vite 8.3.5, rolldown
  1.2.15, postcss, nanoid). Se añaden 9 opcionales de WASM (`@oxc-parser/binding-wasm32-wasi`,
  que exige `@emnapi/*@2.0.0-alpha.3` desde upstream) y no se quita ninguno. Todo viene de
  registry.npmjs.org y no entra ningún script de instalación nuevo.
- Audit completo (`npm audit`), medido con `npm ci` limpio antes y después:
  - Antes: 1 low, 18 moderate y 1 high (`vite` 8.3.0–8.3.2).
  - Después: 0 low, 18 moderate y 0 high.
  - El paso de CI `npm audit --omit=dev --audit-level=high` daba 0 ya antes, porque vite es de
    desarrollo, así que no demuestra este arreglo.
- Pendiente: las 18 moderate son una sola cadena, `minimatch <11.0.1`, que llega vía
  eslint/typescript-eslint/angular-eslint. `npm audit fix --force` bajaría `typescript-eslint` a
  8.14.0.
- Desde `npm ci` limpio, todos los pasos del CI salen con exit 0: format:check, lint, build
  (341.9 kB), test 117/117 y audit --omit=dev. `npm ls --all` no muestra peers inválidos.
- `rsc risk`: tier 2 (supply-chain).
- Revisión con 3 refuters, 0 bloqueantes:
  - Nit de corrección: la alineación es higiene y no una reparación; corregido arriba.
  - Seguridad: 0 hallazgos.
  - Nit de tests: el audit del CI no demuestra el arreglo de vite; aclarado arriba.

## Next

Push y PR.
