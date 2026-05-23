# La Paz Wir - Guia De Produccion

## Vision Del Juego

`La Paz Wir` debe ser un juego 2D de accion lateral tipo arcade run-and-gun/beat-em-up. La meta visual es pixel art detallado, con identidad de La Paz, Bolivia: Illimani, laderas con casas, minibuses, mercados, tiendas, cables, postes, escaleras y calles urbanas.

El prototipo actual sirve para probar ideas, pero el juego final debe ensamblarse por partes: mapas, tiles, personajes, animaciones, efectos, mecanicas, niveles y UI.

## Principios

- Primero que el juego se lea bien; despues se agrega detalle.
- Los personajes deben verse claros sobre fondos muy detallados.
- El fondo no debe competir con enemigos, proyectiles ni botones.
- Cada asset debe tener un uso: fondo, colision, personaje, efecto o UI.
- El arte debe ser propio, ficticio y no sangriento.
- El estilo puede inspirarse en arcade noventero, pero sin copiar sprites de otros juegos.

## Estructura Recomendada Del Proyecto

```text
la-paz-wir/
  index.html
  styles.css
  game.js
  src/
    core/
      game-loop.js
      input.js
      camera.js
      assets.js
    gameplay/
      player.js
      enemies.js
      projectiles.js
      combat.js
      collisions.js
      levels.js
    render/
      renderer.js
      sprites.js
      parallax.js
      ui.js
    data/
      level-01.js
      enemies.js
      sprites.js
  assets/
    backgrounds/
      level-01/
        sky-illimani.png
        hillside-houses.png
        mid-buildings.png
        street-base.png
        foreground.png
    tilesets/
      la-paz-street-tiles.png
    sprites/
      hero.png
      blocker.png
      looter.png
      mallku.png
      miner-boss.png
      effects.png
    ui/
      buttons.png
      hud.png
    audio/
      hit.wav
      jump.wav
      explosion.wav
      music-level-01.mp3
  docs/
    production-guide.md
    roadmap.md
    tileset-plan.md
    characters.md
```

El prototipo todavia puede vivir en `game.js`, pero cuando el juego crezca conviene separar el codigo en `src/`.

## Orden Correcto De Produccion

### 1. Definir El Nivel Base

Antes de hacer muchos personajes, se define el primer nivel:

- Tema: calle urbana de La Paz.
- Duracion: 2 a 3 minutos.
- Camara: lateral con avance horizontal.
- Suelo principal: una linea clara de caminata.
- Obstaculos: barricadas, cajas, puestos, minibuses.
- Objetivos: avanzar, sobrevivir, proteger tiendas.
- Jefe final: minero con dinamita.

Entregable:

```text
assets/backgrounds/level-01/concept-flat.png
docs/level-01-layout.md
```

### 2. Separar El Mapa En Capas

No usar una sola imagen final para todo. Hay que separar:

```text
sky-illimani.png       -> cielo, nubes, montana
hillside-houses.png    -> casas lejanas en ladera
mid-buildings.png      -> edificios medios
street-base.png        -> calle jugable y fachadas cercanas
foreground.png         -> objetos delante del jugador
collision-map.json     -> rectangulos de colision
```

Esto permite:

- Parallax.
- Colisiones limpias.
- Mejor rendimiento.
- Cambiar objetos sin rehacer todo el fondo.

### 3. Crear El Tileset

El tileset permite construir mas mapas con el mismo estilo.

Prioridad del tileset:

1. Piso/acera.
2. Ladrillo.
3. Puertas metalicas.
4. Ventanas.
5. Escaleras.
6. Cajas.
7. Barricadas.
8. Postes y cables.
9. Tiendas y puestos.
10. Minibus decorativo.

Archivo:

```text
assets/tilesets/la-paz-street-tiles.png
```

Formato recomendado:

- Tile: `32x32`.
- Objetos grandes pueden ocupar varios tiles.
- Mantener una paleta coherente.
- Bordes oscuros y sombras consistentes.

### 4. Crear Personajes Base

Primero se hacen las poses base, sin animar:

```text
hero.png
blocker.png
looter.png
mallku.png
miner-boss.png
```

Cada personaje debe tener:

- Silueta clara.
- Color propio.
- Arma/objeto visible.
- Tamano consistente.
- Buen contraste contra el fondo.

Escalas recomendadas:

```text
Heroe: 72-96 px de alto
Enemigos normales: 72-96 px de alto
Mallku: 90-110 px de alto
Jefe minero: 128-160 px de alto
```

### 5. Animar Personajes

No animar todo al principio. Primero solo lo minimo jugable:

Heroe:

```text
idle: 4 frames
walk: 6 frames
jump: 2 frames
attack_garrote: 4 frames
hurt: 2 frames
```

Bloqueador:

```text
walk: 6 frames
throw_stone: 4 frames
hurt: 2 frames
```

Saqueador:

```text
walk: 6 frames
attack_shop: 4 frames
hurt: 2 frames
```

Mallku:

```text
walk: 6 frames
whip_attack: 5 frames
hurt: 2 frames
```

Minero jefe:

```text
idle: 4 frames
walk: 6 frames
throw_dynamite: 5 frames
hurt: 2 frames
rage: 4 frames
```

### 6. Crear Efectos

Los efectos hacen que el juego se sienta bien.

Prioridad:

```text
hit_garrote.png
stone_projectile.png
dynamite.png
small_explosion.png
big_explosion.png
dust_run.png
shop_damage.png
```

Cada efecto debe tener pocos frames, pero buen impacto.

### 7. Ensamblar El Nivel

Cuando hay fondo, tiles y personajes:

1. Cargar assets.
2. Dibujar capas de fondo.
3. Dibujar mapa jugable.
4. Dibujar objetos con colision.
5. Dibujar jugador.
6. Dibujar enemigos.
7. Dibujar proyectiles.
8. Dibujar efectos.
9. Dibujar UI.

Orden visual:

```text
sky
hillside
mid buildings
street base
shops/objects
player/enemies/projectiles
effects
foreground
HUD
```

## Mecanicas Principales

### Movimiento

- Caminar izquierda/derecha.
- Saltar.
- Pequena inercia, pero controles responsivos.
- El jugador debe poder cancelar movimiento con ataque.

### Combate Del Heroe

Ataque principal:

- Garrote corto.
- Golpe frontal.
- Empuja enemigos.
- Cooldown rapido.

Futuro ataque especial:

- Golpe fuerte al suelo.
- Onda corta.
- Consume energia o tiene cooldown largo.

### Enemigos

Bloqueador:

- Mantiene distancia.
- Lanza piedras.
- Se aleja si el jugador se acerca mucho.

Saqueador:

- Ignora un poco al jugador.
- Busca tiendas.
- Hace dano a puestos.
- Obliga al jugador a defender zonas.

Mallku ficticio:

- Rapido.
- Ataque cercano con chicote.
- Mas peligroso que enemigo normal.

Jefe minero:

- Mucha vida.
- Lanza dinamita en arco.
- La dinamita explota al tocar suelo.
- Puede tener fase 2 con lanzamientos mas rapidos.

### Objetivos De Nivel

Un nivel no debe ser solo caminar y pegar. Debe tener pequenas metas:

- Llegar al final.
- Proteger 3 tiendas.
- Derrotar al jefe.
- Evitar perder toda la energia.

### Dificultad

La dificultad debe subir por zonas:

```text
Zona 1: aprender movimiento y golpe
Zona 2: aparecen bloqueadores
Zona 3: saqueadores atacan tiendas
Zona 4: aparece mallku
Zona 5: jefe minero
```

## Calidad Visual

Checklist visual:

- El jugador se distingue siempre del fondo.
- Los enemigos tienen colores distintos.
- Los proyectiles se ven claramente.
- Las tiendas importantes tienen indicadores de vida.
- El jefe es claramente mas grande.
- El fondo es detallado, pero la zona jugable esta limpia.
- No hay textos pequenos ilegibles dentro del juego.

## Calidad De Gameplay

Checklist jugable:

- El salto responde al instante.
- El golpe conecta donde visualmente parece conectar.
- Si el jugador recibe dano, se entiende por que.
- Los proyectiles tienen trayectoria clara.
- Las tiendas no mueren demasiado rapido.
- El jefe tiene patrones aprendibles.
- El jugador puede ganar sin depender de suerte.

## Flujo De Trabajo Recomendado

Para cada feature:

1. Hacer version simple.
2. Probar que sea divertida.
3. Agregar arte temporal.
4. Ajustar hitboxes.
5. Reemplazar por arte final.
6. Agregar sonido/efectos.
7. Probar en celular.

No conviene hacer arte final antes de saber que la mecanica funciona.

## Versiones Del Juego

### Prototipo 0.1

- Un nivel.
- Un fondo plano.
- Heroe.
- Tres enemigos.
- Jefe minero.
- Sin menu avanzado.

### Vertical Slice 0.2

- Mapa por capas.
- Sprites animados.
- Sonidos basicos.
- UI pulida.
- Jefe con patron claro.

### Demo 0.3

- Menu inicial.
- Pantalla de seleccion de nivel.
- 2 niveles.
- Sistema de puntuacion.
- Guardar record local.

### Mobile 0.4

- Controles tactiles pulidos.
- Ajuste de pantalla.
- Pausa.
- Rendimiento optimizado.

### Monetizacion 0.5

Solo despues de que el juego sea divertido:

- Revivir con anuncio.
- Doble monedas con anuncio.
- Skins desbloqueables.
- Nada de anuncios cada pocos segundos.

## Reglas Para No Perder Calidad

- No mezclar estilos de assets.
- No usar fondos generados con diferente perspectiva.
- No agregar personajes que no tengan animaciones minimas.
- No llenar la pantalla de enemigos si no se entiende el combate.
- No tapar al jugador con UI.
- No poner anuncios antes de tener retencion.

## Siguiente Paso Recomendado

El siguiente paso real es crear `level-01` por capas:

```text
assets/backgrounds/level-01/sky-illimani.png
assets/backgrounds/level-01/hillside-houses.png
assets/backgrounds/level-01/mid-buildings.png
assets/backgrounds/level-01/street-base.png
assets/backgrounds/level-01/foreground.png
```

Despues se crea `hero.png` con animaciones basicas y se reemplaza el personaje actual.

