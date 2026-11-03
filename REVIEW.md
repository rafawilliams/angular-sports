# REVIEW.md — angular-sports

Léelo antes de revisar cualquier diff. Reglas completas: `02-DOCS/wiki/sdd/constitution.md`.

## El resumen empieza con un recuento

Primera línea: `N hallazgos: X bloqueantes, Y nits`. Después, el detalle.

## Qué es un fallo aquí

- Una actualización de dependencias que rompe un peer de Angular, o que solo instala con
  `--force` / `--legacy-peer-deps` (principio 2).
- Un cambio en el flujo carrito → checkout → pedido que deja un total, una cantidad o un pedido
  incorrecto, o que permite enviar el formulario de checkout inválido.
- Datos personales del checkout escritos en consola, `localStorage` o logs (principio 17).
- Debilitar `strict`/`strictTemplates`, añadir `any` sin justificar, o desactivar un test para
  dejar la suite en verde (principios 6-7).
- Un cambio de comportamiento sin test que falle sin él (principio 7).
- URLs de backend hardcodeadas en un componente (principio 9).
- Un componente duplicado (dos juegos de ficheros para el mismo componente) (principio 8).
- Un control del flujo de compra que no se puede usar con teclado o un input sin etiqueta
  (principio 18).

## Rutas que no se revisan

- `dist/`, `.angular/`, `node_modules/`, `legacy/`
- `package-lock.json` (solo se comprueba que cambia junto con `package.json`)
- `.rsc/`, `.claude/skills/`, `.github/rsc/`, `.github/prompts/`, `.github/agents/` (los gestiona rsc)

## Límite de nits

Como máximo **3** nits por revisión; el resto se descarta.

## Rutas que siempre requieren a una persona

- `src/app/components/checkout/`, `src/app/components/place-order/`, `src/app/services/`
  (pedidos y datos del cliente)
- `.github/workflows/`, `.github/dependabot.yml` (CI y cadena de suministro)
- Subidas MAJOR en `package.json`

Esta lista solo informa. Para que `rsc risk` la aplique tiene que estar también en
`.rsc/sello-config.json` → `risk.raise`.
