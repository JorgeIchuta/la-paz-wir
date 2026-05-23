# Sprint 1 - Guia De Implementacion Ordenada

Fecha: 2026-05-23

## Objetivo

Iniciar la implementacion del Sprint 1 sin romper el prototipo jugable actual. El principio es incremental: primero se crea estructura y data, despues se conecta una pieza a la vez.

## Regla Principal

`game.js` sigue siendo el juego activo durante Sprint 1. Ningun cambio debe impedir que el prototipo corra con:

```powershell
node dev-server.js
```

## Orden De Implementacion

### Paso 1 - Crear Estructura Base

Crear:

```text
src/
  core/
  data/
  gameplay/
  render/
  ui/
```

Cada carpeta debe tener responsabilidad clara. No se conecta todo de inmediato.

### Paso 2 - Extraer Data Sin Conectar

Crear primero archivos de data:

```text
src/data/assets.mjs
src/data/enemies.mjs
src/data/levels.mjs
src/data/weapons.mjs
src/data/pickups.mjs
src/data/scoring.mjs
```

Estos archivos documentan el contrato futuro y preparan balance. En esta etapa pueden existir sin ser usados por `game.js`.

### Paso 3 - Crear Helpers Puros

Crear:

```text
src/core/math.mjs
```

Debe contener funciones puras:

- `clamp`
- `rectsOverlap`
- `circleRect`
- helpers de distancia

### Paso 4 - Conectar Una Pieza A La Vez

Orden recomendado:

1. Conectar `src/data/levels.mjs`.
2. Validar smoke test.
3. Conectar `src/data/enemies.mjs`.
4. Validar smoke test.
5. Conectar `src/core/math.mjs`.
6. Validar smoke test.

No conectar armas, pickups ni economia hasta Sprint 2, salvo que el juego ya este estable.

## Definition Of Done De Cada Cambio

- `node --check ./game.js` pasa.
- El juego abre en navegador.
- El boton `Jugar` inicia partida.
- El jugador se mueve, salta y ataca.
- El HUD actualiza puntos y energia.
- No hay errores nuevos en consola.

## Politica De Riesgo

Si un cambio rompe el prototipo:

1. Identificar el archivo exacto.
2. Reducir el cambio.
3. Revertir solo la parte rota.
4. Volver a validar.

No hacer reescrituras grandes en Sprint 1.

## Skills

No se necesita instalar un skill externo para esta fase. Si luego se decide migrar a Phaser 3, buscar un skill especifico de Phaser/game-dev puede ayudar, pero debe verificarse antes de instalarlo.

## Resultado Esperado De Esta Primera Implementacion

Al terminar este bloque inicial debe existir:

- `docs/sprint-1/implementation-start.md`
- Estructura `src/`
- Data base de assets, enemigos, niveles, armas, pickups y scoring
- Helpers puros iniciales
- `game.js` sin romper

## Estado De Implementacion

- [x] Crear estructura `src/`.
- [x] Crear data base en `src/data/*.mjs`.
- [x] Crear helpers puros en `src/core/math.mjs`.
- [x] Conectar `src/data/levels.mjs` con fallback seguro en `game.js`.
- [x] Conectar `src/data/enemies.mjs` con fallback seguro en `game.js`.
- [x] Conectar `src/core/math.mjs` con fallback seguro en `game.js`.
- [x] Crear helper base `src/core/object-pool.mjs`.
- [x] Conectar object pool a particulas con fallback seguro en `game.js`.
- [x] Conectar `src/ui/game-ui.mjs` con fallback seguro en `game.js`.
- [x] Extraer input a `src/core/input.mjs` y conectarlo con fallback seguro.
- [x] Crear `src/core/asset-loader.mjs` y conectarlo con fallback seguro.
- [x] Conectar object pool a proyectiles con fallback seguro.

## Nota Tecnica

`game.js` sigue siendo un script clasico. Por eso los modulos nuevos usan `.mjs` y se conectan con `import()` dinamico. Esto evita cambiar `index.html` a `type="module"` antes de estar listos.
