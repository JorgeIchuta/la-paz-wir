# Sprint R1 - Enemies Runtime Extraction Notes

Fecha: 2026-05-23

## Objetivo

Extraer la logica runtime de enemigos y aliados sin cambiar IA, balance ni encuentro final.

## Alcance

Mover:

- `currentGateX`
- `updateFinalEncounter`
- `enemySpeed`
- `updateEnemies`
- `updateAllies`
- `chooseEnemyTarget`
- `updateBlocker`
- `updateMiner`

## Reglas

- Mantener final encounter en `elapsed >= 180`.
- Mantener gate final en `world.width - 1880`.
- Mantener spawn de mineros: `player.x + 430`, offsets `i * 105`.
- Mantener 2 policias aliados.
- Mantener velocidades, HP y cooldowns existentes.
- Mantener looter apuntando a tiendas vivas no salvadas.
- Mantener blocker retrocediendo y lanzando piedra.
- Mantener miner con dinamita/gas.
- Mantener score por minero `260` y enemigo normal `45`.

## Validacion Manual

- Bloqueador persigue/retrocede y lanza piedra.
- Saqueador prioriza tiendas.
- Mallku hace contacto y ataque cercano.
- Minero lanza dinamita.
- Boss final lanza gas.
- Policias atacan objetivos marcados.
- Final encounter cancela oleadas.
- Al derrotar mineros sube score correcto.

