# La Paz Wir - Personajes

## Asset Actual

Archivo fuente:

`assets/sprites/characters-source-green.png`

Este archivo contiene la primera hoja de personajes generada en pixel art. El fondo verde se elimina en tiempo de ejecucion desde `game.js`, usando chroma-key en un canvas auxiliar.

## Personajes En La Hoja

1. Heroe ciudadano
   - Arma: garrote
   - Uso actual: jugador principal

2. Bloqueador ficticio
   - Arma: piedra
   - Uso actual: enemigo que lanza proyectiles

3. Saqueador ficticio
   - Objeto: caja
   - Uso actual: enemigo que prioriza tiendas

4. Mallku ficticio
   - Arma: chicote
   - Uso actual: enemigo rapido de ataque cercano

5. Minero jefe
   - Arma: dinamita
   - Uso actual: jefe final del nivel

## Pendiente Para Calidad Final

- Separar cada personaje en su propio archivo PNG.
- Crear animaciones por frames:
  - idle
  - caminar
  - saltar
  - atacar
  - recibir golpe
- Ajustar hitboxes despues de tener las animaciones finales.
- Crear sprites separados de piedra, dinamita, explosion e impacto.

