# Sprint 3 - Preparacion Desde Sprint 1

Fecha: 2026-05-23

## Proposito

Este documento define cuando tiene sentido iniciar Sprint 3 y migrar a una base mas profesional con Vite, TypeScript y Phaser 3. No debe ejecutarse antes de cerrar Sprint 1 y Sprint 2 con una vertical slice estable.

## Condiciones Para Iniciar Sprint 3

Sprint 3 solo deberia empezar cuando:

- `game.js` ya este reducido o tenga sistemas extraidos con fallbacks.
- Data principal este fuera del monolito: niveles, enemigos, armas, pickups y scoring.
- UI basica este separada en `src/ui`.
- Helpers core esten separados en `src/core`.
- El prototipo tenga smoke test manual estable.
- Sprint 2 haya probado oro, XP, pickups y armas sin romper gameplay.

## Objetivo Recomendado De Sprint 3

Crear una vertical slice en:

```text
Vite + TypeScript + Phaser 3
```

Alcance minimo:

- Boot/preload scene.
- Level scene.
- Player con movimiento basico.
- Un enemigo blocker.
- Una tienda protegible.
- Un pickup.
- HUD simple.
- Una oleada pequena.

## Que No Debe Hacer Sprint 3

- No migrar todo el juego completo de una vez.
- No rehacer arte final mientras se migra engine.
- No meter todas las armas, XP y tienda al mismo tiempo.
- No borrar el prototipo canvas hasta que Phaser iguale la vertical slice.

## Estrategia De Migracion

1. Mantener canvas como referencia funcional.
2. Crear proyecto Vite/TS/Phaser en paralelo.
3. Reutilizar `src/data/*.mjs` como fuente conceptual.
4. Migrar una sola escena jugable.
5. Comparar sensacion de controles, camara y combate.
6. Decidir si Phaser reemplaza el prototipo o si canvas sigue.

## Decision Gate

Al final de Sprint 3 decidir:

- Continuar con Phaser como engine principal.
- Mantener canvas modular.
- Postergar migracion y seguir fortaleciendo gameplay.

