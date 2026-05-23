# Sprint R2 - HUD Render Extraction Notes

Fecha: 2026-05-23

## Objetivo

Extraer dibujo HUD no-DOM desde `game.js` sin cambiar estilo visual ni textos.

## Alcance

Mover:

- `drawCooldown`
- `drawStatus`
- `drawMessage`
- `wrapText`

## Reglas

- Mantener barra de cooldown en `(246, 58, 112, 10)`.
- Mantener status box en `(30, 58, 150, 20)`.
- Mantener prioridad de texto: wave, final, mascara.
- Mantener mensaje en `(28, 92, canvas.width - 56, 56)`.
- Mantener tipografia `12px Arial`.
- No cambiar estado de gameplay.

## Validacion Manual

- Cooldown de ataque se dibuja.
- Timer/status se dibuja.
- Mensajes temporales se dibujan.
- Texto envuelve lineas dentro del panel.

