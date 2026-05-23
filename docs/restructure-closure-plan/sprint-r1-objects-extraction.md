# Sprint R1 - Objects Extraction Notes

Fecha: 2026-05-23

## Objetivo

Extraer manejo de objetos de mundo sin cambiar gameplay: tiendas, helper de comida, mascara, barricadas, cajas y construccion de objetos del nivel.

## Alcance

Mover:

- `buildLevelObjects`
- `updateObjects`

Mantener en `game.js` por ahora:

- `objectBox`, porque tambien lo usan combate y colisiones de jugador.
- `finishFoodBreak`, porque ahora vive detras de `waves.mjs`.

## Reglas

- Mantener repeticion de objetos `level.objectRepeat || 3100`.
- Mantener mascara en `level.width - 1700`.
- Mantener helper: `heal`, `life`, score y mensajes.
- Mantener tienda salvada a distancia `56`.
- Mantener energia por tienda salvada `+12`.
- Mantener score por tienda salvada `+100`.
- Mantener filtro final: objetos con `hp > 0` o tipo `shop`.

## Validacion Manual

- Barricadas/cajas siguen colisionando y rompiendose.
- Helper cura y desaparece.
- Helper expira y dispara el mensaje de oleada.
- Mascara se recoge y activa resistencia a gas.
- Tiendas se salvan al acercarse.
- Tiendas destruidas siguen visibles con estado danado.

