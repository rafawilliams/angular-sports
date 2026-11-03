---
type: constitution
title: angular-sports — Constitution
description: Los principios no negociables que obedece cada fase rsc-sdd.
tags: [sdd, constitution]
timestamp: 2026-11-03T09:30:00Z
topic: sdd
version: v1.0.1
---

# angular-sports — Constitution

> Version: v1.0.1 · Ratified: 2026-11-03 · Last amended: 2026-11-03
> Objetivo: mantener actualizada y segura una app Angular de deportes (tienda: catálogo, carrito,
> checkout, pedido). Software · alcance small. Este archivo ratifica principios; la mecánica vive
> en la configuración del repo y en `02-DOCS/wiki/stack/*` cuando exista.

## 1. Stack canon

1. TypeScript sobre Angular 22 (standalone, `@angular/build:application`). Cambiar de framework
   o de builder es una enmienda MAJOR.
2. La versión de TypeScript es la que acepta el peer range de `@angular/build`; ningún paquete
   se sube a una versión que rompa un peer de Angular (`npm install` sin `--force` ni
   `--legacy-peer-deps` debe funcionar).
3. Gestor de paquetes: npm. Un único `package-lock.json`, commiteado; CI instala con `npm ci`.
4. Tests con Vitest + jsdom vía `ng test`. Cambiar de runner es una enmienda MINOR.

## 2. Quality bar

5. El código está formateado con Prettier (config en `package.json` / `.prettierrc.json`) y pasa
   **angular-eslint** sin errores. *(Pendiente de implantar: instalar angular-eslint y sustituir
   el `.eslintrc.js` genérico actual.)*
6. Tipos estrictos: `strict`, `strictTemplates`, `strictInjectionParameters` y
   `strictInputAccessModifiers` permanecen activos en `tsconfig.json`; `ng build` pasa sin
   errores. No se añade `any` nuevo sin justificarlo en el PR.
7. `ng test` pasa en verde. Todo cambio de comportamiento incluye un test que falla sin el
   cambio. No hay umbral de cobertura.

## 3. Conventions

8. Un componente = una carpeta en `src/app/components/<nombre>/` con un único juego
   `.ts/.html/.css/.spec.ts`; los servicios viven en `src/app/services/`. No se crean ficheros
   duplicados del mismo componente.
9. Las URLs de backend no se hardcodean en componentes; se centralizan en un servicio o en la
   configuración de la app.
10. Commits en formato gitmoji + Conventional Commits: `✨ feat(scope): asunto`. Enforced por
    `.rsc/gitmoji-guard.mjs`.

## 4. Branching & shipping

11. Todo cambio va en una rama desde `master` y entra por pull request. No hay pushes directos a
    `master`. Enforced por `.rsc/branch-guard.mjs` para el agente.
12. Un PR solo se mergea con CI verde: `npm ci`, `ng build` y `ng test`. *(Pendiente de
    implantar: añadir el workflow de CI.)*
13. **La autoría git es del humano.** Sin `Co-Authored-By` de una IA ni pie "generated with" en
    commits ni en PRs. Enforced en la fase `ship`.
14. Los PRs de Dependabot se mergean solo si pasan el principio 12; una actualización MAJOR de
    `typescript`, `@angular/*` o del test runner se revisa a mano.

## 5. Security & privacy floor

15. Nunca se commitea un secreto. Los secretos se cargan desde `01-TOOLS/<proveedor>/.env`
    (gitignored).
16. `npm audit --omit=dev` no reporta vulnerabilidades high ni critical en `master`.
17. Los datos del checkout (nombre, dirección) no se escriben en consola, `localStorage` ni logs,
    y solo se envían al endpoint de pedidos.

## 6. UX / accessibility floor

18. Mínimo WCAG 2.2 AA: el flujo completo catálogo → carrito → checkout → pedido es operable con
    teclado, con foco visible y con cada campo de formulario asociado a su etiqueta.

## 7. Performance budgets

19. Los budgets de producción de `angular.json` son la barrera: bundle inicial ≤ 500 kB (aviso) /
    1 MB (error); estilos por componente ≤ 4 kB / 8 kB. Subirlos es una enmienda MINOR.

## 8. Knowledge & decisions

20. Toda decisión significativa se añade a `02-DOCS/wiki/harness/decisions.md` (fecha, opciones,
    porqué). Esta constitución es el registro de decisiones de mayor rango.

## Definition of Done (the merge bar `verify` runs against)

Un cambio solo se entrega cuando se cumple TODO:

- [ ] `npm install` / `npm ci` resuelve sin flags de peer (principios 2-3).
- [ ] Prettier + angular-eslint limpios (principio 5).
- [ ] `ng build` (producción) pasa sin errores ni budgets en error (principios 6, 19).
- [ ] `ng test` en verde; el cambio de comportamiento trae su test (principio 7).
- [ ] Estructura y convención de commits respetadas (principios 8-10).
- [ ] En rama, vía PR con CI verde, autoría humana (principios 11-13).
- [ ] Sin secretos; sin high/critical en `npm audit --omit=dev`; datos de checkout no filtrados
      (principios 15-17).
- [ ] Flujo de compra operable con teclado si el cambio toca UI (principio 18).
- [ ] Decisiones significativas registradas (principio 20).

## Amendment log (append-only)

| Date | Version | Change | Why |
|------|---------|--------|-----|
| 2026-11-03 | draft | Borrador generado por `rsc onboard`. | El suelo SDD necesita una constitución; ratificarla es tarea de la fase `constitution`. |
| 2026-11-03 | v1.0.0 | Ratificada la constitución inicial: 20 principios. Pendientes de implantar: 5 (angular-eslint), 12 (workflow de CI); 2 incumplido hoy por `typescript@7`. | Arranque del proyecto bajo rsc; ratificada tal cual por el propietario. |
| 2026-11-03 | v1.0.1 | Nota de estado: el principio 2 se cumple desde `353d972` (`typescript ~6.0.3`). Sin cambio de principios. | Corrige la nota «incumplido hoy» de v1.0.0, señalada en la revisión de tier 2. |
