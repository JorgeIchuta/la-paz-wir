# Sprint R3 - Module Entrypoint

Fecha: 2026-05-23

## Objetivo

Permitir que el proyecto arranque desde `src/main.mjs` sin cambiar todavia toda la arquitectura interna.

## Estado Actual

`index.html` carga:

```html
<script type="module" src="src/main.mjs"></script>
```

`src/main.mjs` importa el entrypoint legacy:

```js
import "../game.js";
```

Esto permite que el navegador arranque desde `src/` mientras `game.js` sigue funcionando como puente durante la migracion.

## Por Que Es Un Puente

`game.js` todavia contiene render, draw order y parte de la logica legacy. No debe eliminarse hasta que R2 complete:

- `world.mjs`
- `sprites.mjs`
- `renderer.mjs`

## Validacion

- `node --check ./src/main.mjs`
- `node --check ./game.js`
- servidor local responde `200`
- navegador carga `src/main.mjs` como JavaScript
