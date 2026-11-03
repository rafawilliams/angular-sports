---
author: Rafael Williams
branch: chore/remove-duplicate-components
status: in-progress
---
# Eliminar componentes duplicados y conectar el CSS huérfano

## Intent

Cumplir el principio 8 (un juego de ficheros por componente). La actualización de Angular dejó
stubs de scaffold sin usar junto a los componentes reales. Además, `checkout.component.css` y
`place-order.component.css` tienen estilos que no se aplican porque ningún `styleUrls` los
referencia.

## Scope

- Dentro:
  - Borrar 17 stubs que nadie importa: `{cart-summary,checkout,place-order,product-list,thank-you}.{ts,html,css}`,
    `services/{cart,product}.ts` y `app.component.html` (`app.ts` usa `app.html`).
  - Conectar `styleUrls` en `CheckoutComponent` y `PlaceOrderComponent`, por decisión del propietario.
- Fuera: Prettier y rediseños.

## Checklist

- [x] Stubs borrados sin referencias — prueba: grep de imports/templateUrl y `ng build`.
- [x] CSS conectado — prueba: capturas antes/después de `/placeorder` y `/checkout`.
- [x] Sin regresiones — prueba: `ng lint`, `ng build`, `ng test --watch=false`.
- [x] `rsc risk` + revisión según tier.
- [ ] CI del PR en verde.

## Evidence

- Stubs: clases vacías, `<p>x works!</p>`, CSS de 0 bytes. El grep de imports, `templateUrl`,
  `styleUrl` y `app.component.html` en `src` no encuentra referencias (solo la cadena de ruta
  `/checkout` en un test).
- Capturas en Chrome 1280×900, servidor de desarrollo:
  - Antes: `/placeorder` en una columna plana y sin estilo; aviso de carrito vacío a todo el ancho.
  - Después: tarjeta centrada con secciones numeradas, City/State en dos columnas; carrito vacío
    centrado con icono.
- `ng build --configuration production`: sin avisos de budget (CSS de place-order ≈ 3,1 kB minificado).
- `ng lint` limpio; `ng test --watch=false` 117/117.
- `rsc risk`: tier 2 (billing, orders, customer-data).
- Revisión con 3 refuters:
  - Corrección: 0 hallazgos (sin referencias colgantes ni choques de nombres; el CSS solo usa
    selectores de clase, así que la encapsulación no deja reglas muertas).
  - Seguridad: 0 hallazgos (sin `url()`/`@import`; el `opacity:0` es el patrón de checkbox
    personalizado).
  - Tests: el borrado se reprodujo desde `npm ci` sin cache. 1 should-fix: el foco de teclado del
    checkbox de gift-wrap era invisible (el input con `opacity:0` y el `outline: none` global de
    `styles.css:82`). Se añadió `.custom-checkbox input:focus-visible~.checkmark` y 2 tests:
    - Mutante sin `styleUrls`: 2 failed | 115 passed.
    - Mutante sin la regla de foco: 1 failed | 116 passed.
    - En Chrome, al llegar con Tab el checkbox muestra borde índigo con halo, y al salir con
      Shift+Tab lo pierde.

## Next

Commit, push y PR.
