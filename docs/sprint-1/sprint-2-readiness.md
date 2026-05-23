# Sprint 2 - Preparacion Desde Sprint 1

Fecha: 2026-05-23

## Cuando Iniciar Sprint 2

Sprint 2 debe empezar solo cuando Sprint 1 tenga:

- `levels.mjs` conectado y validado.
- `enemies.mjs` conectado y validado.
- `math.mjs` conectado y validado.
- Smoke test manual pasando.
- Prototipo jugable sin errores de consola.

## Objetivo Probable Del Sprint 2

Agregar progresion jugable sin romper la base:

- Oro temporal.
- XP simple.
- Pickups reales.
- Primera tienda/checkpoint.
- Primeras armas adicionales: honda y escudo de calamina.
- Guardado local minimo.

## Reglas Para Sprint 2

- No agregar oro, XP y tienda en el mismo commit.
- Primero implementar data y UI minima.
- Despues conectar recompensas.
- Despues conectar compra/mejora.
- Validar smoke test despues de cada feature.

## Stack Futuro

Si Sprint 2 confirma que el juego necesita tilemaps, escenas, animaciones y particulas mas profesionales, Sprint 3 deberia migrar a:

```text
Vite + TypeScript + Phaser 3
```

No migrar antes de cerrar una vertical slice estable en el prototipo actual.

