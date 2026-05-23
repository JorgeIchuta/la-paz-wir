# Sprint R1 - Waves Extraction Notes

Fecha: 2026-05-23

## Objetivo

Extraer oleadas existentes a `src/gameplay/waves.mjs` sin cambiar ritmo, spawns, fases ni recompensas.

## Alcance

Mover:

- `makeWaves`
- `waveEnemies`
- `updateWaves`
- `updateSupportMoment`
- `hasFoodHelper`
- `spawnWaveGroup`
- `spawnFoodHelper`
- `spawnWaveEnemy`
- `finishFoodBreak`

## Reglas

- Mantener inicio de oleadas despues de `state.elapsed >= 4`.
- Mantener corte de oleadas al iniciar final encounter.
- Mantener fases por minuto: `Math.min(2, Math.floor(state.elapsed / 60))`.
- Mantener offsets `[-180, 105, 245, 360]`.
- Mantener maximo de grupo `4`.
- Mantener helper de comida desde segundo `52` de cada minuto, despues de `45s`.
- Mantener vida, heal y duracion del helper.
- Mantener score por grupo liberado `70` y wave cleared `150`.

## Validacion Manual

- Aparece primera oleada despues de avanzar/tiempo.
- Al limpiar un grupo aparece el siguiente si queda queue.
- Al limpiar toda la oleada sube score.
- El helper de comida aparece cuando no hay wave activa.
- Recoger helper cura y muestra mensaje.
- El final encounter sigue cancelando oleadas.

