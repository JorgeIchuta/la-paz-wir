# Restructure Closure Plan

Fecha: 2026-05-23

## Proposito

Este plan registra el cierre de la migracion para que `La Paz Wir` pueda correr desde una estructura modular real en `src/`.

## Estado Actual

El navegador carga:

```html
<script type="module" src="src/main.mjs"></script>
```

El comando oficial local es:

```bash
node src/main.mjs
```

La direccion de dependencias queda asi:

```text
index.html -> src/main.mjs -> src/game-app.mjs
node src/main.mjs -> src/server/dev-server.mjs
dev-server.js -> src/server/dev-server.mjs
```

Los archivos reestructurados dentro de `src/` no dependen de `game.js` ni de `dev-server.js`.

## Sprints Ejecutados

- Sprint R1: extraccion segura de gameplay.
- Sprint R2: extraccion segura de render.
- Sprint R3: entrypoint modular con `src/main.mjs`, `src/game-app.mjs` y servidor ESM en `src/server/dev-server.mjs`.

## Regla Principal

Cada cambio debe cerrar con:

- `node --check ./src/main.mjs`
- `node --check ./src/game-app.mjs`
- `node --check` de modulos `.mjs` tocados
- servidor local respondiendo
- smoke test manual
- fallback o rollback claro
