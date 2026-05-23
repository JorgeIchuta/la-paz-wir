# Phase G1 - Geometry Extraction

Fecha: 2026-05-23

## Objetivo

Extraer helpers puros de geometria desde `src/game-app.mjs` hacia `src/core/geometry.mjs` sin cambiar comportamiento visible del juego.

## Implementado

Se creo `src/core/geometry.mjs` con:

- `centeredBox(entity)`
- `playerBox(player)`
- `enemyBox(enemy)`
- `objectBox(obj)`
- re-export de `clamp`
- re-export de `rectsOverlap`
- re-export de `circleRect`

`src/game-app.mjs` ahora importa estos helpers desde `./core/geometry.mjs`.

## Decision Tecnica

Se mantuvieron adapters pequenos en `src/game-app.mjs`:

- `playerBox()`
- `enemyBox(enemy)`
- `objectBox(obj)`
- `rectsOverlap(a, b)`
- `circleRect(circle, rect)`
- `clamp(value, min, max)`

Esto evita reescribir todos los sistemas existentes en la misma fase. Los sistemas `gameplay/*` ya reciben estas funciones por dependency injection, asi que la siguiente fase puede cambiar contratos sin tocar reglas de juego.

## Riesgo

Bajo.

No se modificaron:

- movimiento
- render
- assets
- oleadas
- damage
- UI
- servidor

## Validacion Requerida

- `node --check ./src/core/geometry.mjs`
- `node --check ./src/game-app.mjs`
- `node --check ./src/main.mjs`
- smoke HTTP con `node src/main.mjs`
- prueba manual: iniciar, moverse, saltar y atacar

## Siguiente Paso

Fase G2: extraer estado inicial/reset hacia `src/app/game-state.mjs`.
