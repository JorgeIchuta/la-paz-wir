# Sprint R1 - Gameplay Extraction

## Objetivo

Mover reglas de gameplay fuera de `game.js` sin cambiar comportamiento. Este sprint no agrega oro, XP, tienda ni armas nuevas. Solo extrae sistemas existentes.

## Archivos Objetivo

```text
src/gameplay/
  combat.mjs
  projectiles.mjs
  waves.mjs
  objects.mjs
  enemies-runtime.mjs
```

## Orden Recomendado

### 1. `projectiles.mjs`

Mover:

- `throwProjectile`
- `updateProjectiles`
- `releaseGas`
- `updateGasClouds`
- `explode`

Riesgo:

- Alto-medio, porque toca dano, gas, explosiones y unidades.

Mitigacion:

- Extraer primero funciones puras.
- Mantener wrappers en `game.js`.
- No cambiar formulas de dano ni trayectorias.

### 2. `combat.mjs`

Mover:

- `maybeAttack`
- `hitPlayer`
- hitbox de ataque
- knockback

Riesgo:

- Alto, porque afecta feel del combate.

Mitigacion:

- Mantener cooldowns iguales.
- Mantener hitbox igual.
- Validar ataque contra blocker, mallku y miner.

### 3. `waves.mjs`

Mover:

- `makeWaves`
- `waveEnemies`
- `updateWaves`
- `spawnWaveGroup`
- `spawnWaveEnemy`
- `updateSupportMoment`
- `spawnFoodHelper`
- `finishFoodBreak`

Riesgo:

- Medio. Puede afectar ritmo de juego.

Mitigacion:

- Conservar timers.
- Conservar offsets de spawn.
- Validar min 1, min 2, min 3 y final.

### 4. `objects.mjs`

Mover:

- `buildLevelObjects`
- `updateObjects`
- object interactions

Riesgo:

- Medio, afecta tiendas, mascara, helper y barricadas.

Mitigacion:

- Validar tienda salvada.
- Validar helper.
- Validar mascara.
- Validar barricada/caja.

### 5. `enemies-runtime.mjs`

Mover:

- `enemySpeed`
- `updateEnemies`
- `updateAllies`
- `chooseEnemyTarget`
- `updateBlocker`
- `updateMiner`
- `updateFinalEncounter`

Riesgo:

- Alto. Es el nucleo de IA.

Mitigacion:

- Dejarlo al final del sprint.
- Extraer con wrappers.
- No cambiar balance.

## Definition Of Done

- `game.js` conserva wrappers pequenos.
- Los sistemas gameplay viven en `src/gameplay`.
- No se cambia comportamiento intencionalmente.
- Smoke test pasa.

## Estado De Implementacion

- [x] Crear `src/gameplay/projectiles.mjs`.
- [x] Conectar `projectiles.mjs` con wrappers y fallback seguro en `game.js`.
- [x] Validar `node --check ./game.js`.
- [x] Validar `node --check ./src/gameplay/projectiles.mjs`.
- [x] Crear `src/gameplay/combat.mjs`.
- [x] Conectar `combat.mjs` con wrappers y fallback seguro en `game.js`.
- [x] Validar `node --check ./src/gameplay/combat.mjs`.
- [x] Crear `src/gameplay/waves.mjs`.
- [x] Conectar `waves.mjs` con wrappers y fallback seguro en `game.js`.
- [x] Validar `node --check ./src/gameplay/waves.mjs`.
- [x] Crear `src/gameplay/objects.mjs`.
- [x] Conectar `objects.mjs` con wrappers y fallback seguro en `game.js`.
- [x] Validar `node --check ./src/gameplay/objects.mjs`.
- [x] Crear `src/gameplay/enemies-runtime.mjs`.
- [x] Conectar `enemies-runtime.mjs` con wrappers y fallback seguro en `game.js`.
- [x] Validar `node --check ./src/gameplay/enemies-runtime.mjs`.
