# Sprint 01 - Arquitectura Propuesta

## Contexto

`La Paz Wir` ya tiene gameplay real, pero su arquitectura actual es monolitica. El objetivo del Sprint 1 es separar conceptos sin perder velocidad ni romper el prototipo.

## Arquitectura Actual

```text
index.html
  -> game.js
       input
       state
       levels
       player
       enemies
       projectiles
       objects
       waves
       boss encounter
       render
       HUD
       effects
```

Ventaja:

- Simple de correr.
- No requiere build.
- Bueno para prototipo rapido.

Problema:

- Cada feature nueva toca `game.js`.
- Balance y logica estan mezclados.
- No hay contratos claros entre sistemas.
- Dificil probar cambios pequenos.
- Dificil migrar a Phaser si todo sigue acoplado.

## Arquitectura Objetivo Incremental

```text
src/
  core/
    game-loop.mjs
    input.mjs
    camera.mjs
    math.mjs
  data/
    assets.mjs
    levels.mjs
    enemies.mjs
    weapons.mjs
    pickups.mjs
    scoring.mjs
  gameplay/
    player.mjs
    enemy-ai.mjs
    combat.mjs
    projectiles.mjs
    waves.mjs
    objects.mjs
    economy.mjs
    progression.mjs
  render/
    renderer.mjs
    sprites.mjs
    effects.mjs
    backgrounds.mjs
  ui/
    hud.mjs
    overlay.mjs
    controls.mjs
```

## Responsabilidades

### `core/`

Codigo generico del juego.

- Game loop.
- Input.
- Camara.
- Helpers matematicos.
- Estado basico de escena.

### `data/`

Configuracion editable.

- Niveles.
- Enemigos.
- Armas.
- Pickups.
- Scoring.
- Assets.

Regla: nada en `data/` deberia modificar estado por si mismo.

### `gameplay/`

Reglas de juego.

- Movimiento del jugador.
- Ataques.
- IA.
- Oleadas.
- Proyectiles.
- Colisiones.
- Economia futura.
- Progresion futura.

### `render/`

Dibujo y visuales.

- Fondos.
- Sprites.
- Particulas.
- Efectos.
- Orden de capas.

Regla: render no decide gameplay.

### `ui/`

Interfaz.

- HUD.
- Overlay.
- Botones tactiles.
- Pausa futura.
- Pantalla de victoria/derrota.

## Contratos De Data

### Enemy Definition

```js
export const enemies = {
  blocker: {
    maxHp: 1,
    speed: 48,
    contactDamage: 10,
    score: 45,
    attack: {
      type: "projectile",
      projectile: "stone",
      cooldown: 1.35,
      range: 330
    }
  }
};
```

### Weapon Definition

```js
export const weapons = {
  whip: {
    label: "Chicote",
    damage: 1,
    cooldown: 0.52,
    range: 128,
    knockback: 260,
    cost: 0,
    upgrades: ["whip-range-1", "whip-damage-1"]
  }
};
```

### Pickup Definition

```js
export const pickups = {
  food: {
    label: "Comida",
    effect: "heal",
    value: 22,
    score: 80
  },
  gasMask: {
    label: "Mascara",
    effect: "gas-resistance",
    value: 0.55,
    score: 120
  }
};
```

### Level Definition

```js
export const levels = [
  {
    id: "teleferico",
    name: "Estacion Teleferico",
    background: "telefericoBackground",
    width: 30500,
    ground: 592,
    finishText: "Llegaste al final de la estacion",
    boss: {
      trigger: "time",
      atSeconds: 180,
      type: "miner"
    },
    objects: []
  }
];
```

## Orden De Modularizacion

1. Crear `src/data/` y copiar data sin conectarla todavia.
2. Crear `src/core/math.mjs` con `clamp`, overlap y helpers.
3. Crear `src/data/assets.mjs` con manifest.
4. Extraer niveles.
5. Extraer enemigos.
6. Extraer armas/pickups aunque todavia no se usen completo.
7. Conectar de a una pieza al `game.js` actual.
8. Cuando el prototipo sea estable, decidir Phaser 3.

## Decision Tecnica Recomendada

Para Sprint 1:

- Mantener canvas.
- Modularizar conceptos.
- No instalar dependencias.

Para Sprint 2:

- Decidir entre seguir canvas modular o crear version Phaser 3.
- Si se elige Phaser, migrar solo una vertical slice: player, blocker, tienda, una oleada.

## Criterio De Calidad

Un modulo nuevo es aceptable si:

- Tiene una responsabilidad clara.
- No depende del DOM salvo `ui/` o entrypoint.
- No lee assets directamente salvo asset loader.
- No cambia estado global sin recibirlo por parametro o contrato claro.
- Puede ser reemplazado por Phaser mas adelante con poco dolor.
