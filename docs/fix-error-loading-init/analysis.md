# Analisis del render inicial antes de cargar assets

## Contexto

En la captura revisada, el juego muestra por unos instantes un fondo pixelado/procedural con casas, cielo azul y un personaje dibujado con bloques antes de que aparezcan las imagenes finales del nivel. Ese contenido no viene de una imagen rota del navegador: es el fallback interno del renderer del juego.

## Causa principal

El juego empieza a dibujar el canvas aunque las imagenes criticas todavia no terminaron de cargar.

Flujo actual:

1. `src/app/create-game.mjs` crea imagenes con `new Image()` y asigna `image.src`, pero no espera a que terminen de cargar.
2. `createGame()` arma el renderer inmediatamente.
3. Al final de `createGame()`, se ejecuta `draw();` aunque los assets pueden seguir descargandose.
4. Cuando el usuario presiona `Jugar`, `src/game-app.mjs` llama `game.reset()` y `loop.start()` de inmediato.
5. `resetGame()` oculta el overlay con `gameUi.hideOverlay()`, dejando visible el canvas.
6. Si el background o los sprites aun no estan listos, el renderer usa fallbacks procedurales.

Referencias:

- `src/app/create-game.mjs:95`: `loadImage(src)` solo crea la imagen y asigna `src`.
- `src/app/create-game.mjs:214`: se reemplazan assets con `createAssetsFromManifest(assetManifest)` sin esperar su carga.
- `src/app/create-game.mjs:390`: `resetGame()` oculta el overlay.
- `src/app/create-game.mjs:651`: `draw();` dibuja una primera pantalla aunque los assets no esten listos.
- `src/game-app.mjs:26-27`: despues del click se ejecutan `game.reset()` y `loop.start()` inmediatamente.

## Por que aparece ese fondo

En `src/render/backgrounds.mjs`, el renderer revisa si el background real esta listo:

```js
if (bg.complete && bg.naturalWidth > 0) {
  ctx.drawImage(...)
  return;
}
```

Si no esta listo, dibuja un fondo alternativo:

- cielo con gradiente,
- nubes,
- Illimani,
- laderas con casas pixeladas,
- teleferico,
- cables/postes.

Referencias:

- `src/render/backgrounds.mjs:11`: condicion para usar la imagen real.
- `src/render/backgrounds.mjs:27-31`: llamadas al fallback procedural.
- `src/render/backgrounds.mjs:82`: `drawHillside()` dibuja las casas pixeladas visibles en la captura.

## Por que aparece ese personaje

El jugador tambien tiene fallback. `src/render/actors-render.mjs` intenta primero dibujar el sprite real:

```js
if (drawCharacterSprite("hero", ...)) {
  return;
}
```

Si `drawCharacterSprite()` devuelve `false` porque los sprites no estan listos, el codigo dibuja un personaje con rectangulos mediante `px(...)`.

Referencias:

- `src/render/actors-render.mjs:28`: intento de dibujar el sprite real del heroe.
- `src/render/actors-render.mjs:33-73`: fallback pixelado del heroe.
- `src/render/sprites.mjs:82-84`: una imagen se considera lista solo si `complete` y `naturalWidth > 0`.

## Observaciones adicionales

- Hay dos rutas de carga de imagenes en `create-game.mjs`: primero se define un objeto `assets` manualmente y luego se hace `Object.assign(assets, createAssetsFromManifest(assetManifest))`. Esto duplica el inicio de carga de varios assets y puede aumentar la variabilidad del primer render.
- El CSS oculta canvas/HUD/controles mientras `.game-panel` no tiene `.is-playing`, pero al presionar `Jugar` se agrega `.is-playing` antes de confirmar que las imagenes criticas estan listas.
- El problema se nota mas en movil, red lenta, cache frio o GitHub Pages, porque los PNG grandes pueden tardar mas que el primer frame del loop.

## Recomendacion principal

Agregar una compuerta de carga para assets visuales criticos antes de ocultar el overlay y antes de iniciar el loop.

Assets criticos minimos:

- background del nivel 1,
- sprite idle/base del heroe o `characterSheet`,
- `heroWalk`,
- `heroAttack`.

Implementacion recomendada:

1. Cambiar el loader para exponer una promesa por imagen o una funcion `waitForImage(image)`.
2. Crear `preloadCriticalAssets(assets)` que espere `image.decode()` cuando este disponible, con fallback a eventos `load/error`.
3. Hacer que `createGame()` exponga `ready` o `waitUntilReady()`.
4. En `src/game-app.mjs`, al click de `Jugar`, deshabilitar temporalmente el boton o mantener el overlay visible hasta que `await game.waitUntilReady()` termine.
5. Solo despues ejecutar `game.reset()` y `loop.start()`.

Ejemplo de forma esperada:

```js
browser.startButton.addEventListener("click", async () => {
  browser.startButton.disabled = true;
  await game.waitUntilReady();
  browser.gamePanel.classList.add("is-playing");
  game.reset();
  loop.start();
  browser.startButton.disabled = false;
});
```

El detalle importante es que `.is-playing`, `hideOverlay()` y `loop.start()` no deberian ocurrir antes de que el background real y el sprite del jugador esten listos.

## Alternativas

### Opcion A: mantener overlay hasta que cargue

Es la solucion mas segura y con menor impacto. El jugador sigue viendo la pantalla inicial actual mientras se precargan las imagenes; cuando estan listas, entra directo al juego real sin mostrar fallbacks.

Ventajas:

- No elimina codigo de fallback util para errores reales.
- Reduce el cambio en gameplay.
- Evita frames visualmente incorrectos.

Riesgo:

- Si un asset falla, hay que decidir si se permite jugar con fallback o se muestra error.

### Opcion B: precargar antes de habilitar el boton Jugar

Al cargar la pagina, se inicia la precarga; el boton `Jugar` queda deshabilitado hasta terminar.

Ventajas:

- El click de `Jugar` responde sin espera.
- Mejor experiencia si la pantalla inicial se mantiene unos segundos.

Riesgo:

- Necesita un estado visual de boton deshabilitado/listo.

### Opcion C: eliminar fallbacks procedurales de produccion

Se puede quitar el dibujo procedural y dejar que el canvas espere o quede vacio si no hay imagen.

Ventajas:

- Nunca se veria el arte temporal.

Riesgo:

- Si falla un asset, el juego queda con pantalla incompleta o negra.
- Se pierde una herramienta util para desarrollo.

## Recomendacion final

Usar la opcion A primero: mantener el overlay visible y no iniciar el loop hasta que los assets criticos esten cargados. Despues, si se quiere pulir mas, se puede combinar con la opcion B para precargar desde que abre la pagina.

No recomiendo eliminar todos los fallbacks como primer paso. Es mejor conservarlos para desarrollo o para fallos excepcionales, pero impedir que aparezcan durante la carga normal.

