---
author: Rafael Williams
branch: chore/angular-eslint
status: in-progress
---
# angular-eslint

## Intent

Implantar la parte de lint del principio 5: el código pasa angular-eslint sin errores. Hoy hay
un `.eslintrc.js` genérico (env node/jest, sin TS ni Angular) y ESLint no está instalado, así que
no se ejecuta nada.

## Scope

- Dentro: `ng add angular-eslint` (flat config, target `lint`), borrar `.eslintrc.js`, dejar
  `ng lint` en 0 errores (corrigiendo el código o con justificación por regla) y añadir el paso
  `ng lint` al CI.
- Fuera: Prettier (no está instalado y `package.json` y `.prettierrc.json` tienen dos configs
  distintas; va en otro PR) y cambios de comportamiento en la app.

## Checklist

- [x] angular-eslint instalado — prueba: `npx ng lint` se ejecuta.
- [x] `.eslintrc.js` eliminado — prueba: `git status`.
- [x] `ng lint` sin errores — prueba: exit 0.
- [x] Sin regresiones — prueba: `ng build` y `ng test --watch=false` en verde.
- [ ] Paso `ng lint` en `ci.yml` — prueba: run del PR en verde.
- [x] `rsc risk` + revisión según tier.

## Evidence

- `ng add angular-eslint@22`: crea `eslint.config.js`, el target `lint` y el script `npm run lint`;
  devDeps eslint ^10.12.0, @eslint/js, angular-eslint 22.6.0 y typescript-eslint 8.71.0.
- Primer `ng lint`: 31 errores (15 prefer-control-flow, 6 label-has-associated-control,
  6 no-explicit-any, 2 no-empty-function, 1 no-unused-vars, 1 prefer-inject).
  - Decisión del propietario: arreglarlo todo en esta rama.
  - Control-flow e inject: schematics oficiales `@angular/core:control-flow` y `@angular/core:inject`.
  - A mano: `for`/`id` en los 6 labels de place-order; `Order.products: CartLine[]`;
    `sendOrder(): Observable<unknown>`; `orderError`/`error: { message?: string } | null`.
- Final: «All files pass linting», exit 0; `ng build` OK (334 kB); `ng test` 115/115.
- `rsc risk`: tier 2 (billing, orders, customer-data, ci).
- Revisión con 3 refuters:
  - Corrección: 0 hallazgos (estructura del formulario y `[disabled]` intactos, sin ciclo de imports).
  - Seguridad: 0 hallazgos (lockfile solo de registry.npmjs.org, sin cambios en prod, audit en 0).
  - Tests: 2 should-fix. Sobrevivían mutantes en el `for`/`id` de los labels, en los mensajes de
    validación por campo y en el candado de `!submitted`. Se añadieron 25 tests en
    `place-order.component.spec.ts`. Los 4 mutantes que sobrevivían ahora fallan
    (1 failed | 114 passed cada uno).
  - Nit sin cambio: la indentación del template de place-order queda para el PR de Prettier.

## Next

Commit, push y PR; comprobar el paso Lint en el run de CI.
