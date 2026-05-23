# La Paz Wir - Plan de Tileset

## Objetivo

Pasar del prototipo dibujado con `canvas` a un juego con assets pixel art reales, inspirado en la energia de juegos arcade noventeros y en una version ficticia de La Paz, Bolivia.

## Resolucion Base

- Tile base: `32x32 px`
- Personajes: entre `48x64 px` y `64x80 px`
- Jefe minero: entre `96x96 px` y `128x128 px`
- Fondo por capas: imagenes anchas repetibles o segmentos de `1024x512 px`
- Escala en juego: `2x` o `3x`, con `image-rendering: pixelated`

## Capas Del Escenario

1. `sky_illimani.png`
   - Cielo azul
   - Nubes pixel art
   - Illimani grande al fondo

2. `hillside_houses.png`
   - Casas apiladas en ladera
   - Ladrillo naranja, fachadas verdes/amarillas, ventanas oscuras
   - Profundidad parallax lenta

3. `street_buildings.png`
   - Fachadas cercanas
   - Tiendas, puertas metalicas, carteles, balcones
   - Postes y cables

4. `foreground_street.png`
   - Piso, acera, piedras, grietas, basura, bordes
   - Elementos que pasan delante del jugador si hace falta

## Tileset Principal

Archivo sugerido: `assets/tilesets/la-paz-street-tiles.png`

Contenido:

- Acera piedra: centro, borde superior, borde inferior, esquina
- Asfalto: limpio, agrietado, con linea amarilla, manchado
- Muro de ladrillo: limpio, roto, con ventana, con cartel
- Puerta metalica: azul, verde, oxidada
- Techo de calamina
- Escaleras urbanas
- Barricadas
- Cajas de mercado
- Puesto callejero
- Poste electrico
- Cables
- Minibus blanco/azul decorativo

## Sprites Jugables

Carpeta: `assets/sprites/`

### Heroe

Archivo: `hero.png`

Animaciones:

- `idle`: 4 frames
- `walk`: 6 frames
- `jump`: 2 frames
- `attack_garrote`: 4 frames
- `hurt`: 2 frames

### Bloqueador

Archivo: `blocker.png`

Animaciones:

- `idle`: 4 frames
- `walk`: 6 frames
- `throw_stone`: 4 frames
- `hurt`: 2 frames

### Saqueador

Archivo: `looter.png`

Animaciones:

- `walk`: 6 frames
- `attack_shop`: 4 frames
- `carry_box`: 4 frames
- `hurt`: 2 frames

### Mallku Ficticio

Archivo: `mallku.png`

Animaciones:

- `walk`: 6 frames
- `whip_attack`: 5 frames
- `hurt`: 2 frames

### Jefe Minero

Archivo: `miner_boss.png`

Animaciones:

- `idle`: 4 frames
- `walk`: 6 frames
- `throw_dynamite`: 5 frames
- `rage`: 4 frames
- `hurt`: 2 frames

## Efectos

Archivo: `assets/sprites/effects.png`

- Piedra girando: 4 frames
- Dinamita: 4 frames
- Explosion pequena: 6 frames
- Explosion grande: 8 frames
- Impacto de garrote: 5 frames
- Polvo al correr: 4 frames

## Reglas De Arte

- Pixel art con bordes oscuros.
- Paleta con cielo azul, ladrillo naranja, verdes envejecidos, amarillos de mercado y sombras azuladas.
- Nada de logos reales ni textos politicos reales.
- Personajes ficticios y caricaturescos.
- Violencia no sangrienta, tipo arcade.

## Integracion Tecnica

1. Crear los PNG en `assets/`.
2. Cargar imagenes con `new Image()`.
3. Reemplazar funciones `drawPlayer`, `drawEnemy`, `drawObject` y `drawBackground`.
4. Crear un sistema simple de animaciones por frames.
5. Mantener los rectangulos de colision actuales hasta que el gameplay este estable.

## Primer Asset A Crear

Prioridad recomendada:

1. `sky_illimani.png`
2. `hillside_houses.png`
3. `street_buildings.png`
4. `hero.png`
5. `blocker.png`

