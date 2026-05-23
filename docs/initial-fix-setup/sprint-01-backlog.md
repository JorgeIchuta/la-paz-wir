# Sprint 01 - Backlog Priorizado

## Prioridad P0 - Mantener El Prototipo Vivo

### S1-001 - Crear Smoke Test Manual

Objetivo: tener una lista minima de verificacion antes y despues de tocar codigo.

Tareas:

- Documentar pasos para correr `node dev-server.js`.
- Verificar inicio de partida.
- Verificar movimiento, salto y ataque.
- Verificar dano a enemigos.
- Verificar salvar tienda.
- Verificar HUD.
- Verificar derrota por energia.

Criterio de aceptacion:

- Existe checklist en `sprint-01-qa-checklist.md`.

### S1-002 - Verificar Sintaxis Actual

Objetivo: asegurar que el baseline no tiene errores sintacticos.

Tareas:

- Ejecutar `node --check ./game.js`.
- Registrar resultado.

Criterio de aceptacion:

- El comando pasa sin errores.

## Prioridad P1 - Separar Conceptos Sin Reescribir

### S1-003 - Crear Estructura `src/`

Objetivo: preparar la modularizacion incremental.

Estructura objetivo:

```text
src/
  core/
  data/
  gameplay/
  render/
  ui/
```

Criterio de aceptacion:

- Carpetas creadas.
- Cada carpeta tiene archivo `README.md` o modulo inicial explicando responsabilidad.
- `game.js` sigue siendo el entrypoint activo.

### S1-004 - Extraer Data De Enemigos

Objetivo: que estadisticas de enemigos no vivan enterradas dentro de funciones.

Datos actuales a extraer:

- `blocker`: vida, velocidad, dano, proyectil piedra.
- `looter`: vida, velocidad, dano a tienda.
- `mallku`: vida, velocidad, ataque melee.
- `miner`: vida, velocidad, dinamita/gas.

Criterio de aceptacion:

- Existe `src/data/enemies.mjs`.
- El formato permite balancear HP, speed, damage, cooldown y score.

### S1-005 - Extraer Data De Nivel

Objetivo: separar configuracion de nivel, objetos, tiendas, pickups y boss trigger.

Datos actuales a extraer:

- Nombre del nivel.
- Background.
- Width.
- Ground.
- Objects.
- Finish text.
- Boss trigger por tiempo o posicion.

Criterio de aceptacion:

- Existe `src/data/levels.mjs`.
- La estructura permite varios niveles.

### S1-006 - Definir Data De Armas Base

Objetivo: preparar Sprint 2 para oro, tienda y upgrades.

Armas iniciales:

- `whip`: arma actual, melee, cooldown corto.
- `sling`: honda, proyectil simple.
- `shield`: defensa frontal, baja velocidad.

Criterio de aceptacion:

- Existe `src/data/weapons.mjs`.
- Cada arma define damage, cooldown, range, knockback, cost y upgrade path.

### S1-007 - Definir Pickups Y Recompensas

Objetivo: dejar listo oro/XP/vida sin implementarlo completo.

Pickups:

- Food.
- Gas mask.
- Coin.
- First aid.
- Ammo.

Criterio de aceptacion:

- Existe `src/data/pickups.mjs`.
- Cada pickup tiene type, value, duration opcional y score reward.

## Prioridad P2 - Preparar Sistemas

### S1-008 - Documentar Game Loop

Objetivo: entender el orden actual de update/render antes de mover codigo.

Orden actual:

- Update time/state.
- Update player.
- Attack.
- Support moment.
- Waves.
- Final encounter.
- Enemies/allies.
- Projectiles/gas.
- Objects/effects.
- Camera/HUD.
- Draw.

Criterio de aceptacion:

- Existe documentacion en `sprint-01-architecture.md`.

### S1-009 - Definir Contratos De Entidades

Objetivo: evitar que cada sistema invente campos distintos.

Entidades:

- Player.
- Enemy.
- Projectile.
- WorldObject.
- Pickup.
- Effect.

Criterio de aceptacion:

- Contratos documentados con campos minimos.

### S1-010 - Asset Manifest

Objetivo: unificar carga de assets.

Assets actuales:

- Backgrounds.
- Sprites de personajes.
- Kiosco.
- Helper.
- Police ally.

Criterio de aceptacion:

- Existe propuesta de `src/data/assets.mjs`.
- Naming convention documentada.

### S1-011 - Estrategia De Render Performance

Objetivo: preparar el juego para muchos sprites repetidos sin lag perceptible.

Tareas:

- Definir limites iniciales de entidades visibles.
- Definir object pools para proyectiles, particulas y efectos.
- Definir orden de capas de render.
- Definir cache de imagenes/spritesheets.
- Documentar cuando usar canvas 2D, PixiJS, Phaser o Three.js.

Criterio de aceptacion:

- Existe `sprint-01-render-performance.md`.
- El plan cubre enemigos, piedras, humo, particulas, pickups y fondos.
- Hay una equivalencia clara con `InstancedBufferGeometry` para 2D.

## Prioridad P3 - Decision De Motor

### S1-012 - Decision Record: Canvas Modular Vs Phaser 3

Objetivo: tomar una decision tecnica consciente.

Opciones:

- Mantener canvas modular para control total.
- Migrar a Phaser 3 para acelerar produccion 2D.

Criterio de aceptacion:

- Existe ADR simple con decision recomendada, tradeoffs y condiciones para cambiarla.

## Fuera De Sprint

- Implementar tienda completa.
- Implementar XP persistente.
- Implementar oro persistente.
- Crear nuevos sprites finales.
- Integrar Three.js.
- Integrar fisicas avanzadas.
- Publicar build.
