# Audio Implementation Plan

## Objetivo

Agregar audio al juego de forma controlada, ligera y fácil de mantener.

El audio debe mejorar la sensación arcade sin afectar el rendimiento del navegador. La implementación debe estar centralizada para evitar llamadas sueltas a `new Audio()` en muchos archivos.

## Tipos De Audio

### Musica de fondo

Uso recomendado:

- Loop continuo durante el nivel.
- Volumen bajo, por ejemplo `0.20` a `0.30`.
- Puede cambiar por nivel o cuando aparece un boss.

Ejemplos:

- Tema principal del nivel 1.
- Tema de boss.
- Tema de victoria o derrota.

### Efectos de sonido

Uso recomendado:

- Sonidos cortos y claros.
- Deben sentirse responsivos.
- Deben tener volumen moderado para no saturar.

SFX iniciales recomendados:

- `whip`: cuando el jugador usa el chicote.
- `hit`: cuando el chicote golpea un enemigo.
- `enemy-defeat`: cuando un enemigo muere.
- `player-hit`: cuando el jugador recibe dano.
- `pickup`: cuando el jugador recoge comida, mascara u otro objeto.
- `wave-start`: cuando empieza una oleada.
- `victory`: al completar el nivel.
- `defeat`: cuando el jugador pierde.

### Ambiente

Uso recomendado:

- Loop separado de la musica.
- Volumen muy bajo.
- Sirve para dar vida al mapa sin competir con la musica.

Ejemplos:

- Ciudad lejana.
- Viento.
- Teleferico.
- Multitud distante.
- Ruido urbano.

## Estructura Recomendada

```text
assets/audio/
  music/
    level-1-theme.mp3
    boss-theme.mp3
  ambience/
    city-loop.mp3
  sfx/
    whip.wav
    hit.wav
    enemy-defeat.wav
    player-hit.wav
    pickup.wav
    wave-start.wav
    victory.wav
    defeat.wav
```

## Modulo Recomendado

Crear un modulo central:

```text
src/audio/audio-manager.mjs
```

Responsabilidades:

- Cargar sonidos.
- Reproducir musica.
- Reproducir SFX.
- Controlar volumen global.
- Controlar volumen de musica.
- Controlar volumen de efectos.
- Pausar/reanudar audio.
- Mutear audio.
- Evitar que el mismo SFX se dispare demasiadas veces por frame.

API sugerida:

```js
audio.unlock();
audio.playMusic("level1");
audio.stopMusic();
audio.playAmbience("city");
audio.stopAmbience();
audio.playSfx("whip");
audio.playSfx("hit");
audio.playSfx("enemyDefeat");
audio.setMasterVolume(0.8);
audio.setMusicVolume(0.25);
audio.setSfxVolume(0.75);
audio.setMuted(true);
```

## Restriccion Importante Del Navegador

Los navegadores bloquean audio automatico.

El audio debe inicializarse despues de una accion del usuario. En este juego, el mejor lugar es el boton `Jugar`.

Ejemplo:

```js
browser.startButton.addEventListener("click", () => {
  audio.unlock();
  audio.playMusic("level1");
  audio.playAmbience("city");
  game.reset();
  loop.start();
});
```

## Donde Conectar Sonidos

### Inicio de partida

Archivo probable:

```text
src/game-app.mjs
```

Acciones:

- Desbloquear audio.
- Iniciar musica del nivel.
- Iniciar ambiente.

### Ataque del jugador

Archivo probable:

```text
src/gameplay/combat.mjs
```

Accion:

- Reproducir `whip` cuando empieza el ataque.

### Golpe a enemigo

Archivo probable:

```text
src/gameplay/combat.mjs
```

Accion:

- Reproducir `hit` cuando el ataque conecta.

### Enemigo derrotado

Archivos probables:

```text
src/gameplay/combat.mjs
src/gameplay/enemies-runtime.mjs
```

Accion:

- Reproducir `enemy-defeat`.

### Jugador recibe dano

Archivo probable:

```text
src/gameplay/combat.mjs
```

Accion:

- Reproducir `player-hit`.

### Pickup / comida / mascara

Archivo probable:

```text
src/gameplay/objects.mjs
```

Accion:

- Reproducir `pickup`.

### Inicio de oleada

Archivo probable:

```text
src/gameplay/waves.mjs
```

Accion:

- Reproducir `wave-start`.

### Victoria o derrota

Archivo probable:

```text
src/app/create-game.mjs
```

Acciones:

- Detener musica/ambiente.
- Reproducir `victory` o `defeat`.

## Formatos Recomendados

### Musica

Usar:

- `.mp3`
- `.ogg`

Recomendacion:

- Mantener archivos comprimidos.
- Evitar loops demasiado largos.
- Probar que el loop no tenga silencio al inicio/final.

### SFX

Usar:

- `.wav`
- `.ogg`

Recomendacion:

- Sonidos cortos.
- Volumen normalizado.
- Evitar archivos pesados.

## Rendimiento

Buenas practicas:

- Precargar sonidos al iniciar.
- Reutilizar buffers si se usa Web Audio API.
- Evitar crear objetos `Audio` nuevos cada frame.
- Limitar sonidos repetidos con cooldown pequeno.
- Separar volumen de musica y SFX.
- Permitir mute global.

Ejemplo de cooldown para SFX:

```js
const sfxCooldowns = {
  hit: 0.04,
  playerHit: 0.12,
};
```

Esto evita que muchos impactos simultaneos saturen el audio.

## Plan De Implementacion

### Paso 1

Crear estructura:

```text
assets/audio/
assets/audio/music/
assets/audio/ambience/
assets/audio/sfx/
```

### Paso 2

Crear:

```text
src/audio/audio-manager.mjs
```

### Paso 3

Agregar tres SFX iniciales:

- Chicote.
- Golpe.
- Jugador recibe dano.

### Paso 4

Inicializar audio en el boton `Jugar`.

### Paso 5

Conectar SFX en combate.

### Paso 6

Agregar musica y ambiente del nivel.

### Paso 7

Agregar control de mute/volumen si la UI lo necesita.

## Recomendacion General

No agregar audio directamente con `new Audio()` en cada archivo.

La mejor ruta es un `AudioManager` centralizado. Eso permite controlar volumen, mute, loops, cooldowns de SFX y rendimiento desde un solo lugar.

Para el primer sprint de audio, empezar pequeno:

- `whip`
- `hit`
- `player-hit`

Luego agregar:

- musica de nivel
- ambiente
- sonidos de victoria/derrota
- inicio de oleada

