# Sprint 1 - Plan Para Cerrar Reestructuracion

Fecha: 2026-05-23

## Objetivo

Cerrar Sprint 1 con una base modular suficiente para que Sprint 2 pueda agregar oro, XP, armas y tienda sin seguir agrandando `game.js`.

## Criterio De Cierre

Sprint 1 puede considerarse cerrado cuando:

- Data principal vive en `src/data/*.mjs`.
- Helpers core viven en `src/core/*.mjs`.
- UI basica vive en `src/ui/*.mjs`.
- Input vive en `src/core/input.mjs`.
- Assets tienen manifest y loader inicial.
- Particulas usan object pool.
- `game.js` sigue funcionando como entrypoint legacy.
- `node --check` pasa en `game.js` y todos los `.mjs`.
- El servidor local responde y sirve `.mjs` como JavaScript.

## Que Queda Fuera De Sprint 1

No bloquear el cierre de Sprint 1 por:

- Extraer todo render.
- Extraer todo combat.
- Extraer todo projectiles.
- Crear `src/main.mjs`.
- Cambiar `index.html` a `type="module"`.
- Migrar a Phaser/TypeScript.

Esas tareas pertenecen a Sprint 2 o Sprint 3 cuando el prototipo modular tenga mas cobertura.

## Orden Restante Recomendado

1. [x] Marcar input como conectado y validado.
2. [x] Crear asset loader inicial.
3. [x] Conectar asset manifest con fallback.
4. [x] Conectar object pool a proyectiles si no cambia gameplay.
5. [ ] Ejecutar smoke test manual completo.
6. [ ] Cerrar Sprint 1 con un resumen tecnico.
