# Render

Dibujo del juego: fondos, sprites, efectos, particulas y orden de capas.

Regla: render recibe estado ya calculado. No debe decidir dano, puntaje, IA ni progreso.

Modulos actuales:

- `backgrounds.mjs`: fondo de nivel, cielo procedural y parallax basico.
- `effects.mjs`: dibujo de arcos de golpe y particulas.
- `hud-render.mjs`: HUD canvas, cooldown, estado y mensajes.

