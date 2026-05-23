# Gameplay

Reglas especificas del juego: jugador, enemigos, combate, oleadas, proyectiles, objetos, economia y progresion.

Regla: gameplay puede cambiar estado de juego, pero no debe dibujar directamente ni manipular el DOM.

Modulos actuales:

- `combat.mjs`: ataque principal y dano al jugador.
- `enemies-runtime.mjs`: IA de enemigos, aliados y encuentro final.
- `objects.mjs`: objetos de nivel, helper, mascara y tiendas.
- `projectiles.mjs`: piedras, dinamita, gas y explosiones.
- `waves.mjs`: oleadas, fases, spawns y helper de comida.
