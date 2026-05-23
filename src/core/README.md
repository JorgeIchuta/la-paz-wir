# Core

Utilidades genericas del juego: loop, input, camara, matematicas, asset loading, object pools y helpers puros.

Regla: mantener dependencias minimas y evitar referencias directas a gameplay especifico.

Modulos actuales:

- `asset-loader.mjs`: crea imagenes desde el manifest de assets.
- `input.mjs`: teclado y controles tactiles.
- `math.mjs`: helpers puros de colision y clamp.
- `object-pool.mjs`: reciclaje de objetos para reducir allocs.
