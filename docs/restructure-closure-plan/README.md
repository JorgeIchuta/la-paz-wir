# Restructure Closure Plan

Fecha: 2026-05-23

## Proposito

Este plan define lo que falta para que `La Paz Wir` deje de depender de `game.js` como monolito y pueda correr desde una estructura modular real en `src/`.

## Estado Actual

El juego todavia inicia desde:

```html
<script src="game.js"></script>
```

Pero `game.js` ya consume modulos nuevos:

- `src/data/levels.mjs`
- `src/data/enemies.mjs`
- `src/data/assets.mjs`
- `src/core/asset-loader.mjs`
- `src/core/input.mjs`
- `src/core/math.mjs`
- `src/core/object-pool.mjs`
- `src/ui/game-ui.mjs`

Esto significa que la reestructuracion esta en fase parcial funcional, no completa.

## Sprints Propuestos

- Sprint R1: extraer gameplay seguro.
- Sprint R2: extraer render seguro.
- Sprint R3: crear `src/main.mjs` y cambiar entrypoint.
- Sprint R4: limpieza del legacy `game.js` y QA.
- Sprint R5: decision TypeScript/Phaser.

## Regla Principal

Cada sprint debe cerrar con:

- `node --check ./game.js`
- `node --check` de modulos `.mjs` tocados
- servidor local respondiendo
- smoke test manual
- fallback o rollback claro

