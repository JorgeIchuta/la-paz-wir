# Sprint R2 - Effects Render Extraction Notes

Fecha: 2026-05-23

## Objetivo

Extraer solo el dibujo de efectos visuales: arcos de golpe y particulas. No mover update de particulas todavia.

## Alcance

Mover:

- `drawEffects`
- trazo del chicote
- trazo generico de hit arc
- dibujo de particulas

Mantener en `game.js`:

- `updateEffects`
- `burst`
- object pools
- estado de particulas

## Reglas

- Mantener `ctx.translate(-world.cameraX, 0)`.
- Mantener colores y grosores.
- Mantener formula `alpha = arc.life * 6`.
- Mantener particulas `5x5`.
- Mantener `ctx.globalAlpha = 1` al terminar.

## Validacion Manual

- El golpe del jugador muestra arco.
- Particulas aparecen al golpear enemigo/objeto.
- Particulas desaparecen.
- No queda alpha global afectando otros dibujos.

## Estado De Implementacion

- [x] Crear `src/render/effects.mjs`.
- [x] Conectar `effects.mjs` con wrapper y fallback seguro en `game.js`.
- [x] Validar sintaxis de `game.js`.
- [x] Validar sintaxis de `effects.mjs`.
