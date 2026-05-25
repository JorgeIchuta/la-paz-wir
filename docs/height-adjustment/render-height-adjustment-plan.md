# Render Height Adjustment Plan

## Estado de implementacion

Implementado en codigo el 2026-05-25.

## Objetivo

Permitir ajustar la altura visual de todos los actores, efectos de ataque y objetos sin cambiar fisica, colisiones, IA ni posiciones de gameplay.

El ajuste debe vivir en `src/data/render-tuning.mjs` y los renderers deben leerlo. Evitar mover `player.y`, `enemy.y`, `obj.y` o las hitboxes para resolver problemas visuales.

## Estado actual

### Jugador y enemigos

Archivo: `src/data/render-tuning.mjs`

Actualmente ya existen:

```js
actorSpriteHeights
actorFootOffsets
```

Los usa `src/render/actors-render.mjs` para:

- `hero`
- `blocker`
- `looter`
- `mallku`
- `miner`
- `minerScout`
- `police`

Tambien los usa `src/render/objects-render.mjs` para:

- `foodHelper`

Un valor positivo en `actorFootOffsets` dibuja el sprite mas abajo.

### Food helper

Archivos:

- `src/data/render-tuning.mjs`
- `src/render/objects-render.mjs`
- `src/data/assets.mjs`

Assets relacionados:

```js
foodHelper: "assets/sprites/senora-pollera-helper.png"
foodHelperWalk: "assets/sprites/senora-pollera-helper-detailed-walk.png"
```

El helper ya usa:

```js
renderTuning.actorFootOffsets.foodHelper
renderTuning.actorSpriteHeights.foodHelper
```

Pero `src/render/objects-render.mjs` tambien tiene un ajuste fijo:

```js
obj.y + 40 + offset
obj.y + 39 + offset
```

Ese `40` / `39` deberia moverse a `renderTuning`, porque hoy no queda claro si el ajuste final viene del offset global o del magic number local.

### Latigo / chicote

Archivos:

- `src/gameplay/combat.mjs`
- `src/render/effects.mjs`
- `src/render/renderer.mjs`
- `src/app/create-game.mjs`

El click del boton:

```html
<button id="attackButton" type="button" aria-label="Usar chicote">&#9673;</button>
```

solo activa `input.attack` en `src/core/input.mjs`. El dibujo del latigo no ocurre en el boton.

El ataque se dispara en `src/gameplay/combat.mjs`:

```js
state.hitArcs.push({ x: player.x, y: player.y - 18, dir: player.dir, life: weapon.activeTime, type: "whip" });
```

Y se dibuja en `src/render/effects.mjs`:

```js
ctx.translate(arc.x, arc.y);
ctx.quadraticCurveTo(78, -54, 136, -8);
```

Problema: el jugador fue bajado visualmente con `actorFootOffsets.hero = 25`, pero el arco del latigo no usa ese offset. Por eso el latigo puede quedar visualmente mas alto que el sprite.

## Cambios recomendados

### 1. Extender `renderTuning`

Archivo: `src/data/render-tuning.mjs`

Agregar secciones explicitas para objetos y efectos:

```js
export const renderTuning = {
  actorSpriteHeights: {
    hero: 104,
    blocker: 92,
    looter: 92,
    mallku: 118,
    miner: 132,
    minerScout: 120,
    police: 112,
    foodHelper: 118,
  },

  actorFootOffsets: {
    hero: 25,
    blocker: 25,
    looter: 25,
    mallku: 25,
    miner: 25,
    minerScout: 25,
    police: 25,
    foodHelper: 25,
  },

  objectFootOffsets: {
    barricade: 0,
    crate: 0,
    mask: 0,
    shop: 0,
    foodHelper: 25,
  },

  objectAnchorOffsets: {
    foodHelper: 40,
  },

  effectOffsets: {
    whip: {
      y: 25,
    },
  },
};
```

La regla debe ser:

- Valores positivos bajan visualmente.
- Valores negativos suben visualmente.
- No cambian colisiones.

### 2. Mover el ajuste fijo del food helper a `renderTuning`

Archivo: `src/render/objects-render.mjs`

Cambiar el render de `food-helper` para que use:

```js
const offset = objectFootOffset("foodHelper");
const anchor = objectAnchorOffset("foodHelper");
const footY = obj.y + anchor + offset;
```

Y reemplazar los actuales:

```js
obj.y + 40 + offset
obj.y + 39 + offset
```

Por el nuevo `footY`.

Esto deja el helper ajustable desde `src/data/render-tuning.mjs`.

### 3. Hacer ajustables todos los objetos

Archivo: `src/render/objects-render.mjs`

Agregar helpers similares a:

```js
function objectFootOffset(kind) {
  return renderTuning?.objectFootOffsets?.[kind] ?? 0;
}

function objectAnchorOffset(kind) {
  return renderTuning?.objectAnchorOffsets?.[kind] ?? 0;
}
```

Luego aplicar esos offsets en cada rama:

- `barricade`
- `crate`
- `mask`
- `food-helper`
- cualquier `shop` si se renderiza aqui o se agrega despues

Esto cumple la regla de que todos los objetos puedan reajustar su altura.

### 4. Bajar el latigo desde el renderer de efectos

Archivo: `src/render/effects.mjs`

El renderer de efectos debe recibir `renderTuning`:

```js
export function createEffectsRenderer({ ctx, state, world, px, renderTuning }) {
```

Y aplicar el offset al dibujar el whip:

```js
const whipYOffset = renderTuning?.effectOffsets?.whip?.y ?? 0;
ctx.translate(arc.x, arc.y + whipYOffset);
```

No mover el `hitArc.y` en `src/gameplay/combat.mjs` si el cambio es solo visual. Ese archivo tambien define el hitbox real del ataque:

```js
const hit = {
  y: player.y - 18,
  h: weapon.height,
};
```

Si se cambia ahi, ya no seria solo visual: tambien cambia donde pega el ataque.

### 5. Pasar `renderTuning` al effects renderer

Archivo: `src/app/create-game.mjs`

Actualmente:

```js
effectsRenderer = createEffectsRenderer({
  ctx,
  state,
  world,
  px,
});
```

Debe pasar:

```js
effectsRenderer = createEffectsRenderer({
  ctx,
  state,
  world,
  px,
  renderTuning,
});
```

## Donde ajustar despues

Una vez implementados los cambios:

- Para bajar/subir el jugador: `renderTuning.actorFootOffsets.hero`
- Para bajar/subir el latigo visual: `renderTuning.effectOffsets.whip.y`
- Para bajar/subir el food helper: `renderTuning.objectFootOffsets.foodHelper`
- Para cambiar el alto del food helper: `renderTuning.actorSpriteHeights.foodHelper`
- Para corregir el punto base especial del food helper: `renderTuning.objectAnchorOffsets.foodHelper`
- Para bajar/subir barricadas, cajas, mascara u otros objetos: `renderTuning.objectFootOffsets.<tipo>`

## Nota importante

El valor actual `actorFootOffsets.hero = 25` solo baja el sprite del jugador. El ataque visual del latigo y algunos objetos no quedan automaticamente alineados si no leen el mismo sistema de tuning.

Por eso el siguiente paso tecnico recomendado es centralizar todos los offsets visuales en `src/data/render-tuning.mjs`.
