# Sprint R3 - Module Entrypoint

Fecha: 2026-05-23

## Objetivo

Permitir que el proyecto arranque desde `src/main.mjs` sin depender de `game.js` ni de `dev-server.js`.

## Estado Actual

`index.html` carga:

```html
<script type="module" src="src/main.mjs"></script>
```

`src/main.mjs` decide el runtime:

```js
const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";

if (isBrowser) {
  await import("./game-app.mjs");
} else {
  await import("./server/dev-server.mjs");
}
```

Esto permite:

- navegador: `index.html` carga `src/main.mjs`, y este carga `src/game-app.mjs`
- Node: `node src/main.mjs` levanta `src/server/dev-server.mjs`
- legacy: `dev-server.js` queda como wrapper hacia `src/server/dev-server.mjs`

## Dependencias Permitidas

La direccion correcta ahora es:

```text
index.html -> src/main.mjs -> src/game-app.mjs
node src/main.mjs -> src/server/dev-server.mjs
dev-server.js -> src/server/dev-server.mjs
```

Los archivos reestructurados no deben importar `../game.js` ni `../dev-server.js`.

`game.js` puede seguir existiendo temporalmente como archivo legacy, pero no es el entrypoint oficial del juego migrado.

## Validacion

- `node --check ./src/main.mjs`
- `node --check ./src/game-app.mjs`
- `node --check ./src/server/dev-server.mjs`
- `node --check ./dev-server.js`
- servidor local responde `200`
- navegador carga `src/main.mjs` como JavaScript
