# Game App Refactor Analysis

Fecha: 2026-05-23

## Contexto

`src/game-app.mjs` tiene aproximadamente 2142 lineas. Esto no significa que la migracion haya fallado; significa que la primera etapa resolvio otra prioridad: que el proyecto corra desde `src/main.mjs` sin depender de `game.js` ni de `dev-server.js`.

La etapa anterior movio datos, helpers, input, UI, gameplay parcial, render parcial y servidor. Lo que todavia queda en `game-app.mjs` es el monolito operativo: inicializacion del DOM/canvas, estado mutable central, loop, reglas no extraidas, render legacy, colisiones y orquestacion.

## Diagnostico Tecnico

### Responsabilidades mezcladas en `game-app.mjs`

Actualmente el archivo hace demasiadas cosas:

- Bootstrap de navegador: seleccion de canvas, HUD, overlay y boton de inicio.
- Asset loading legacy: imagenes base, sprites, chroma key y asignacion de assets.
- Estado global: `state`, `world`, `player`, `input`, pools y sistemas.
- Composition root: carga dinamica de modulos nuevos y fallbacks.
- Game loop: `resetGame`, `loop`, `update`, `draw`.
- Gameplay runtime: jugador, enemigos, aliados, proyectiles, gases, objetos y encuentro final.
- Render legacy: fondos, decoracion, mundo, sprites, objetos, jugador, cooldown, estado, mensajes.
- Geometria y colisiones: cajas, rectangulos, circulos y helpers de clamp/burst.

Esto viola principalmente SRP de SOLID: una razon de cambio en render, gameplay, estado, input o assets puede tocar el mismo archivo.

### Lo que ya esta bien encaminado

Ya existen modulos separados:

- `src/data/*`: definiciones de assets, enemigos, niveles, armas, pickups y scoring.
- `src/core/*`: math, object pool, input y asset loader.
- `src/gameplay/*`: combat, enemies runtime, objects, projectiles y waves.
- `src/render/*`: backgrounds, effects y HUD canvas.
- `src/ui/game-ui.mjs`: HUD DOM y overlay.
- `src/server/dev-server.mjs`: servidor local ESM.

La arquitectura ya tiene carpetas correctas. El problema es que `game-app.mjs` todavia concentra la composicion y mucho codigo legacy no extraido.

## Principios Para El Refactor

### SOLID aplicado a este juego

- Single Responsibility: cada modulo debe tener una razon clara de cambio.
- Open/Closed: agregar un enemigo, arma o pickup debe ser data-driven cuando sea razonable.
- Liskov: entidades runtime deben compartir contratos simples sin depender de clases pesadas todavia.
- Interface Segregation: render, gameplay y UI no deben recibir objetos gigantes si solo usan una parte.
- Dependency Inversion: `game-app.mjs` debe ensamblar sistemas, no contener reglas ni dibujo detallado.

### DRY aplicado con cuidado

Evitar duplicacion real, no crear abstracciones prematuras. Si dos funciones se parecen pero representan conceptos distintos de gameplay, mantenerlas separadas hasta que el patron sea estable.

### YAGNI

No introducir TypeScript, ECS, Phaser, build system o clases profundas en este refactor. Primero cerrar una modularizacion ESM estable y verificable.

### KISS

Preferir factories simples:

```js
export function createPlayerSystem(deps) {
  return { reset, update, box };
}
```

Por ahora es mejor que una jerarquia de clases.

## Arquitectura Objetivo

```text
src/
  main.mjs
  game-app.mjs                 composition root pequeno
  app/
    bootstrap.mjs              DOM, canvas, UI roots
    create-game.mjs            ensambla sistemas
    game-loop.mjs              requestAnimationFrame, dt, pause/resume
    game-state.mjs             createInitialState/reset runtime
  core/
    geometry.mjs               boxes, overlaps, circleRect
    math.mjs
    object-pool.mjs
    asset-loader.mjs
    input.mjs
  gameplay/
    player.mjs                 movimiento, salto, ataque cooldown
    final-encounter.mjs        boss/final logic
    allies.mjs                 helpers y policia aliado
    hazards.mjs                gases/explosiones si aplica
    combat.mjs
    enemies-runtime.mjs
    objects.mjs
    projectiles.mjs
    waves.mjs
  render/
    renderer.mjs               orden de dibujo
    world-render.mjs           calle, mundo, foreground
    sprites.mjs                drawCharacterSprite y sprite mapping
    objects-render.mjs
    actors-render.mjs          player, enemies, allies
    projectiles-render.mjs
    backgrounds.mjs
    effects.mjs
    hud-render.mjs
  data/
    assets.mjs
    enemies.mjs
    levels.mjs
```

## Contratos Recomendados

### Composition root

`src/game-app.mjs` deberia quedar con esta forma:

```js
import { bootstrapBrowserGame } from "./app/bootstrap.mjs";
import { createGame } from "./app/create-game.mjs";
import { createGameLoop } from "./app/game-loop.mjs";

const browser = bootstrapBrowserGame();
const game = await createGame(browser);
const loop = createGameLoop({ update: game.update, draw: game.draw });

browser.startButton.addEventListener("click", () => {
  game.reset();
  loop.start();
});
```

Meta: menos de 100-150 lineas.

### Game state

`game-state.mjs` debe crear objetos nuevos o resetear explicitamente:

```js
export function createInitialState() {}
export function resetRuntimeState(state, level) {}
export function createPlayerState() {}
export function createWorldState() {}
```

No debe tocar canvas ni render.

### Geometry

Mover desde `game-app.mjs`:

- `playerBox`
- `enemyBox`
- `objectBox`
- `rectsOverlap`
- `circleRect`
- helpers similares

Destino: `src/core/geometry.mjs`.

### Renderer

`src/render/renderer.mjs` solo debe ordenar:

```js
export function createRenderer(deps) {
  return {
    draw() {
      background.draw();
      world.draw();
      objects.draw();
      actors.draw();
      projectiles.draw();
      effects.draw();
      hud.draw();
    },
  };
}
```

No debe actualizar estado ni resolver reglas de gameplay.

## Plan De Refactor Por Fases

### Fase G1 - Contratos y geometria

Objetivo: extraer helpers puros sin riesgo visual.

Mover:

- `clamp` si no esta completamente cubierto por `core/math.mjs`.
- `playerBox`, `enemyBox`, `objectBox`.
- `rectsOverlap`, `circleRect`.
- funciones pequenas puras que no dependan de DOM/canvas.

Validacion:

- `node --check ./src/core/geometry.mjs`
- `node --check ./src/game-app.mjs`
- smoke HTTP.

Riesgo: bajo.

### Fase G2 - Game state y reset

Objetivo: separar definicion/reset de estado.

Crear:

- `src/app/game-state.mjs`

Mover:

- shape de `state`
- shape de `player`
- shape de `world`
- partes puras de `resetGame`

Mantener en `game-app.mjs` temporalmente:

- llamadas a sistemas existentes
- listeners DOM
- start button

Validacion:

- reset no debe perder score, energia, objetos, waves, pools ni assets.
- smoke manual: iniciar juego, moverse, atacar y avanzar una oleada.

Riesgo: medio, porque reset toca casi todo.

### Fase G3 - Player system

Objetivo: aislar movimiento, salto, ataque cooldown y caja del jugador.

Crear:

- `src/gameplay/player.mjs`

Mover:

- `updatePlayer`
- `maybeAttack` si no pertenece a `combat.mjs`
- parte de `hitPlayer` o contrato de damage al jugador

Regla:

- `player.mjs` no dibuja.
- `player.mjs` no lee DOM.

Validacion:

- movimiento izquierda/derecha
- salto
- ataque
- knockback
- cooldown

Riesgo: medio.

### Fase G4 - Runtime systems restantes

Objetivo: sacar reglas de enemigos/aliados/final que aun vivan en el monolito.

Crear o completar:

- `src/gameplay/allies.mjs`
- `src/gameplay/final-encounter.mjs`
- `src/gameplay/hazards.mjs`

Mover:

- `updateAllies`
- `chooseEnemyTarget`
- `updateFinalEncounter`
- `updateGasClouds`
- `releaseGas`
- `explode`

Regla:

- cada sistema expone `update(dt)` y funciones explicitas, no estado oculto.

Riesgo: medio-alto por interacciones entre enemigos, aliados y final.

### Fase G5 - Render legacy restante

Objetivo: que `game-app.mjs` deje de contener funciones `draw*`.

Crear:

- `src/render/renderer.mjs`
- `src/render/world-render.mjs`
- `src/render/sprites.mjs`
- `src/render/actors-render.mjs`
- `src/render/objects-render.mjs`
- `src/render/projectiles-render.mjs`

Mover:

- `draw`
- `drawWorld`
- `drawStreet`
- `drawCharacterSprite`
- `drawPlayer`
- `drawEnemy`
- `drawAlly`
- `drawObject`
- `drawProjectile`
- `drawGasCloud`
- helpers visuales como `lighten`, `wrapText` si siguen siendo canvas render.

Regla:

- render recibe snapshots/refs y dibuja.
- render no cambia gameplay.

Riesgo: medio, principalmente visual.

### Fase G6 - App orchestration

Objetivo: convertir `game-app.mjs` en composition root.

Crear:

- `src/app/bootstrap.mjs`
- `src/app/create-game.mjs`
- `src/app/game-loop.mjs`

Mover:

- seleccion DOM/canvas
- carga de assets y modulos
- `loop`
- `update`
- `draw`
- `endGame`
- `showMessage`

Meta final:

- `src/game-app.mjs`: menos de 150 lineas.
- cada modulo: idealmente menos de 400 lineas.
- sistemas complejos permitidos hasta 600 lineas si tienen cohesion clara.

Riesgo: medio-alto, porque cambia la composicion.

## Orden Recomendado

No empezar por render. El orden mas seguro es:

1. `core/geometry.mjs`
2. `app/game-state.mjs`
3. `gameplay/player.mjs`
4. `gameplay/allies.mjs` y `gameplay/final-encounter.mjs`
5. `render/sprites.mjs` y `render/actors-render.mjs`
6. `render/renderer.mjs`
7. `app/create-game.mjs` y `app/game-loop.mjs`

Este orden reduce riesgo porque primero extrae codigo puro, luego estado, luego gameplay y al final orquestacion.

## Reglas De Implementacion

- Un modulo por fase, no varias extracciones grandes al mismo tiempo.
- Mantener fallback temporal solo si reduce riesgo.
- No cambiar comportamiento visible durante refactor.
- No introducir dependencias externas todavia.
- No mezclar refactor con features nuevas como tienda, oro, XP o armas.
- Validar siempre con `node --check` y smoke HTTP.
- Si se cambia render, hacer smoke visual manual.
- Si se cambia gameplay, probar inicio, movimiento, salto, ataque, dano, oleadas y final.

## Definition Of Done

La refactorizacion se considera cerrada cuando:

- `src/game-app.mjs` solo ensambla dependencias y arranca el juego.
- No quedan funciones `draw*` en `src/game-app.mjs`.
- No quedan funciones `update*` de sistemas concretos en `src/game-app.mjs`.
- Estado inicial y reset viven en `src/app/game-state.mjs`.
- Colisiones y geometry viven en `src/core/geometry.mjs`.
- El juego corre con `node src/main.mjs`.
- `dev-server.js` sigue funcionando solo como wrapper legacy.
- Los sprints futuros pueden agregar MVP 2 niveles, armas, oro, XP y tienda sin tocar un monolito.

## Siguiente Paso Recomendado

Comenzar con Fase G1: `src/core/geometry.mjs`.

Es la fase con menor riesgo y mejor retorno inmediato, porque elimina helpers compartidos del monolito y prepara contratos limpios para player, enemigos, objetos, proyectiles y combat.
