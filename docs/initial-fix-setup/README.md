# Initial Fix Setup

Esta carpeta contiene el planeamiento base para ordenar `La Paz Wir` antes de agregar sistemas grandes como oro, tienda, upgrades, mas armas, guardado o una migracion completa a Phaser.

## Documentos

- `sprint-01-plan.md`: objetivo, alcance, entregables, riesgos y criterios de aceptacion del Sprint 1.
- `sprint-01-backlog.md`: backlog priorizado con historias, tareas tecnicas y definicion de terminado.
- `sprint-01-architecture.md`: arquitectura objetivo para separar el prototipo actual sin reescribir todo de golpe.
- `sprint-01-render-performance.md`: estrategia para que sprites repetidos, humo, piedras, enemigos y particulas no generen delay visual.
- `sprint-01-validation.md`: checklist de QA, pruebas manuales y validaciones tecnicas.

## Principio Del Sprint 1

El objetivo no es hacer mas features todavia. El objetivo es que el proyecto pueda recibir features sin que `game.js` siga creciendo como un archivo unico. Primero se estabiliza la base, despues se agregan oro, tienda, XP, armas y niveles.

El sprint tambien define bases de rendimiento: asset manifest, sprite batching conceptual, object pooling, limites de entidades visibles, particulas controladas y separacion entre update/render.
