# Sprint 1 - Resumen De Cierre Tecnico

Fecha: 2026-05-23

## Estado

Sprint 1 deja el prototipo funcionando y empieza a romper el monolito `game.js` sin una reescritura grande.

## Modulos Ya Creados

```text
src/core/
  asset-loader.mjs
  input.mjs
  math.mjs
  object-pool.mjs

src/data/
  assets.mjs
  enemies.mjs
  levels.mjs
  pickups.mjs
  scoring.mjs
  weapons.mjs

src/ui/
  game-ui.mjs
```

## Conectado A `game.js`

- Levels desde `src/data/levels.mjs`.
- Enemies desde `src/data/enemies.mjs`.
- Math helpers desde `src/core/math.mjs`.
- Asset manifest/loader desde `src/data/assets.mjs` y `src/core/asset-loader.mjs`.
- Input desde `src/core/input.mjs`.
- UI desde `src/ui/game-ui.mjs`.
- Object pools desde `src/core/object-pool.mjs`.
- Pool aplicado a particulas.
- Pool aplicado a proyectiles.

Todo esta conectado con `import()` dinamico y fallback seguro.

## Validacion Tecnica

- `node --check ./game.js` pasa.
- `node --check` de modulos `.mjs` principales pasa.
- Servidor local responde HTTP 200.
- `.mjs` se sirve como `text/javascript`.

## Que Sigue En Sprint 2

Sprint 2 ya puede enfocarse en features de progresion sin seguir agrandando tanto `game.js`:

- Oro temporal.
- XP simple.
- Pickups reales desde `src/data/pickups.mjs`.
- Armas desde `src/data/weapons.mjs`.
- UI minima de tienda/checkpoint.
- Guardado local simple.

## Que Queda Para Sprint 3

Sprint 3 debe decidir si se migra a:

```text
Vite + TypeScript + Phaser 3
```

No conviene hacer esa migracion hasta que Sprint 2 confirme que el loop de oro/XP/armas funciona.
