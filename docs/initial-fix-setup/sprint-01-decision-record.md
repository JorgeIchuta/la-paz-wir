# ADR 001 - Sprint 01 Technical Direction

Fecha: 2026-05-23

## Decision

Para Sprint 1 se mantiene el juego en `canvas` y JavaScript puro, con modularizacion incremental. No se migra todavia a Phaser 3.

## Motivo

El prototipo actual ya tiene gameplay suficiente para servir como baseline. Migrar inmediatamente a Phaser 3 puede ser correcto mas adelante, pero en este momento el mayor riesgo no es el motor: es el acoplamiento de reglas, data, render y estado dentro de `game.js`.

Antes de migrar, conviene separar:

- Data de niveles.
- Data de enemigos.
- Data de armas.
- Pickups/recompensas.
- Contratos de entidades.
- Smoke tests manuales.

## Alternativas Consideradas

### Migrar Ya A Phaser 3

Pros:

- Escenas, tilemaps, camaras, animaciones y particulas listas.
- Mejor ruta para una demo 2D profesional.
- Facilita mobile y audio.

Contras:

- Riesgo de copiar el mismo desorden dentro de Phaser.
- Sprint 1 se volveria una reescritura grande.
- Puede romper la jugabilidad que ya existe.

### Mantener Canvas Sin Modularizar

Pros:

- Cero friccion inicial.
- Se puede seguir agregando features rapido.

Contras:

- `game.js` seguira creciendo.
- Oro, XP, tienda y armas seran mas dificiles de balancear.
- Cada cambio tendra mas riesgo.

## Resultado

Sprint 1 prepara la base. Sprint 2 puede tomar una decision informada:

- Si se necesita avanzar rapido hacia demo: migrar vertical slice a Phaser 3.
- Si se prioriza control total y aprendizaje: seguir con canvas modular.

## Condiciones Para Cambiar La Decision

Migrar a Phaser 3 en Sprint 2 si:

- Se confirma que habra tilemaps con Tiled.
- Se necesitan animaciones por spritesheet pronto.
- Se quiere audio, particulas y escenas profesionales rapido.
- El prototipo modular ya tiene data separada.

Mantener canvas si:

- Se quiere una demo pequena sin build.
- El equipo prefiere control bajo nivel.
- No habra tilemaps complejos todavia.

