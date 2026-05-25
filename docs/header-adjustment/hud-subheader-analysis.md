# Header Adjustment Analysis

## Current State

The top HUD currently has two different rendering systems:

- The main header is HTML/CSS in `index.html` and `styles.css`.
- The timer and whip cooldown are drawn directly inside the canvas in `src/render/hud-render.mjs`.

This split is why the timer and yellow cooldown bar do not visually belong to the same header block as `Puntos` and `Vida`. They are positioned manually with canvas coordinates:

```js
ctx.fillRect(246, 58, 112, 10); // whip cooldown
ctx.fillRect(30, 58, 150, 20);  // timer / wave status
```

That works technically, but it is not ideal for a polished HUD because:

- It is not responsive to HTML layout changes.
- It can overlap canvas gameplay content.
- It does not naturally inherit the header background.
- It is harder to style consistently with the life bar.
- It mixes UI state rendering with gameplay canvas rendering.

## Recommended Direction

Move the timer and whip cooldown from canvas rendering into the HTML HUD.

The header should have two layers:

1. Main HUD row:
   - `Puntos`
   - `Vida` progress bar

2. Subheader row:
   - Time / active encounter status
   - Chicote cooldown progress bar

Recommended layout:

```html
<div class="hud">
  <div class="hud-main">
    <div class="hud-score">...</div>
    <div class="hud-life">...</div>
  </div>

  <div class="hud-subheader">
    <div class="hud-time">
      <span class="hud-label">Tiempo</span>
      <strong id="timeValue">0:00</strong>
    </div>

    <div class="hud-cooldown">
      <span class="hud-label">Chicote</span>
      <div class="cooldown-meter">
        <div id="attackCooldownBar" class="cooldown-meter-fill"></div>
      </div>
    </div>
  </div>
</div>
```

This makes the HUD easier to maintain because all player-facing header UI lives in HTML/CSS.

## Visual Recommendation

The subheader should sit directly below the current points/life header and use the same translucent background:

```css
background: rgba(17, 18, 16, 0.84);
backdrop-filter: blur(8px);
```

The subheader should be compact, because mobile vertical space is limited:

- Height around `28px` to `34px`.
- Small uppercase labels.
- Time on the left.
- Cooldown bar on the right.
- Cooldown fill should use the same yellow tone currently used in canvas: `#f7c84f`.
- Empty cooldown background should be dark brown/black, not bright.

The canvas should start visually below the HUD, or the HUD should remain absolute with enough opacity to stay readable. Since this is an arcade-style mobile canvas game, keeping the HUD absolute is acceptable, but all HUD elements should be in one HTML block.

## Data Flow Recommendation

The game loop should update the HTML HUD through `createGameUi.updateHud()`.

Recommended state passed into UI:

```js
gameUi.updateHud({
  score: state.score,
  energy: state.energy,
  maxEnergy: state.maxEnergy,
  elapsed: state.elapsed,
  activeWave: state.activeWave,
  finalStarted: state.finalStarted,
  maskPicked: state.maskPicked,
  attackCooldown: player.attackCooldown,
  attackCooldownMax: weaponDefinitions.whip.cooldown,
});
```

The UI layer should calculate:

- Time text from `elapsed`.
- Cooldown percent from `attackCooldown / attackCooldownMax`.
- Life percent from `energy / maxEnergy`.

This keeps rendering logic outside the gameplay loop while keeping gameplay data as the source of truth.

## Implementation Steps

1. Add HTML nodes for:
   - `#timeValue`
   - `#attackCooldownBar`

2. Update `styles.css`:
   - Convert `.hud` to a vertical container.
   - Add `.hud-main` for points/life.
   - Add `.hud-subheader` for timer/cooldown.
   - Style `.cooldown-meter` and `.cooldown-meter-fill`.

3. Update `src/app/bootstrap.mjs`:
   - Query `timeValueEl`.
   - Query `attackCooldownBarEl`.
   - Include them in required UI elements.

4. Update `src/ui/game-ui.mjs`:
   - Add `updateTimeHud()`.
   - Add `updateAttackCooldownHud()`.
   - Keep `updateLifeHud()` as the health-specific logic.

5. Update `src/app/create-game.mjs`:
   - Pass `player.attackCooldown` and `weaponDefinitions.whip.cooldown` into `gameUi.updateHud()`.

6. Remove canvas rendering for:
   - `hudRenderer.drawCooldown()`
   - `hudRenderer.drawStatus()`

7. Keep canvas rendering for temporary messages:
   - `hudRenderer.drawMessage()`

Messages are gameplay overlays and can remain in canvas for now.

## Score Behavior

Right now score increases passively over time:

```js
state.score += dt * 3;
```

That means the player gains points just by surviving or waiting. For this type of side-scrolling beat-em-up, that is not ideal unless the design explicitly rewards survival time.

Current score sources include:

- Passive time score: `+3 per second`
- Enemy hit: `+20`
- Object hit: `+12`
- Enemy defeated: `+45`, `+120`, or `+260` depending on enemy type

## Score Recommendation

Remove passive time score for Level 1.

The player should gain points from meaningful actions:

- Defeat blocker: `+50`
- Defeat looter: `+60`
- Defeat mallku: `+90`
- Defeat miner scout: `+120`
- Defeat miner boss: `+300`
- Destroy crate: `+10`
- Destroy barricade: `+20`
- Finish encounter without dying: `+100`
- Finish level: `+500`

Avoid giving points on every hit unless there is a combo system. If every hit gives points, players can farm high-HP enemies by not finishing them quickly. For now, points should primarily be awarded on enemy defeat.

## Optional Combo Direction

Later, scoring can become more arcade-like:

- Add combo multiplier.
- Increase combo when defeating enemies quickly.
- Reset combo if player gets hit.
- Show `x2`, `x3`, `x4` near the header.

That should be a later sprint. For now, simple defeat-based scoring is cleaner and easier to balance.

## Recommendation Summary

Move timer and chicote cooldown into HTML below the main HUD.

Keep:

- Main row: `Puntos` and `Vida`.
- Sub row: `Tiempo` and `Chicote`.
- Life bar in green/yellow/orange/red.
- Cooldown bar in yellow.
- Canvas only for gameplay, actors, effects, projectiles, and temporary messages.

Change scoring so points increase mainly when the player defeats enemies or clears meaningful objectives, not simply because time passes.
