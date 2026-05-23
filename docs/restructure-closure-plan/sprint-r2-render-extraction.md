# Sprint R2 - Render Extraction

Fecha: 2026-05-23

## Objetivo

Mover dibujo fuera de `game.js` sin cambiar gameplay ni estilo visual. Sprint R2 no cambia assets, colores, hitboxes ni comportamiento.

## Archivos Objetivo

```text
src/render/
  effects.mjs
  hud-render.mjs
  backgrounds.mjs
  world.mjs
  sprites.mjs
  renderer.mjs
```

## Orden Recomendado

### 1. `effects.mjs`

Mover:

- `drawEffects`
- dibujo de hit arcs
- dibujo de particulas

Riesgo:

- Bajo. Solo renderiza datos ya calculados.

### 2. `hud-render.mjs`

Mover:

- `drawCooldown`
- `drawStatus`
- `drawMessage`

Riesgo:

- Bajo-medio. Toca informacion visible del jugador, pero no gameplay.

### 3. `backgrounds.mjs`

Mover:

- `drawBackground`
- `drawClouds`
- `drawIllimani`
- `drawHillside`
- `drawTeleferico`
- `drawPowerLines`

Riesgo:

- Medio. Mucho codigo visual, pero sin reglas de juego.

### 4. `world.mjs`

Mover:

- `drawWorld`
- `drawStreet`
- objetos decorativos
- proyectiles/gas/object draw order

Riesgo:

- Alto-medio por orden visual.

### 5. `sprites.mjs`

Mover:

- `drawCharacterSprite`
- `drawPlayer`
- `drawEnemy`
- `drawAlly`
- health bars

Riesgo:

- Alto porque afecta lectura visual de player/enemigos.

### 6. `renderer.mjs`

Mover:

- orquestacion de `draw`
- orden final de capas

Riesgo:

- Alto. Debe ir al final.

## Definition Of Done

- `game.js` conserva wrappers con fallback.
- Cada modulo render recibe dependencias inyectadas.
- Ningun modulo render cambia estado de gameplay.
- `node --check` pasa.
- El servidor sirve modulos `.mjs`.
- Smoke test visual basico pasa.

## Estado De Implementacion

- [x] Crear `src/render/effects.mjs`.
- [x] Conectar `effects.mjs` con wrapper y fallback seguro en `game.js`.
- [x] Validar `node --check ./game.js`.
- [x] Validar `node --check ./src/render/effects.mjs`.
- [x] Crear `src/render/hud-render.mjs`.
- [x] Conectar `hud-render.mjs` con wrapper y fallback seguro en `game.js`.
- [x] Validar `node --check ./src/render/hud-render.mjs`.
- [x] Crear `src/render/backgrounds.mjs`.
- [x] Conectar `backgrounds.mjs` con wrapper y fallback seguro en `game.js`.
- [x] Validar `node --check ./src/render/backgrounds.mjs`.
- [ ] Extraer `world.mjs`.
- [ ] Extraer `sprites.mjs`.
- [ ] Extraer `renderer.mjs`.
