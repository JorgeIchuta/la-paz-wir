import { createActorsRenderer } from "./actors-render.mjs";
import { createObjectsRenderer } from "./objects-render.mjs";
import { createProjectilesRenderer } from "./projectiles-render.mjs";
import { createSpriteRenderer } from "./sprites.mjs";
import { createWorldRenderer } from "./world-render.mjs";

export function createRenderer({
  ctx,
  canvas,
  state,
  player,
  world,
  assets,
  spriteFrames,
  clamp,
  renderTuning,
  getBackgroundRenderer,
  getEffectsRenderer,
  getHudRenderer,
}) {
  const drawApi = { px, strokePx };
  const sprites = createSpriteRenderer({
    ctx,
    assets,
    spriteFrames,
    player,
    clamp,
  });
  const worldRenderer = createWorldRenderer({
    ctx,
    canvas,
    world,
    px,
  });
  const objects = createObjectsRenderer({
    ctx,
    assets,
    ...drawApi,
    drawCharacterSprite: sprites.drawCharacterSprite,
    renderTuning,
  });
  const projectiles = createProjectilesRenderer({
    ctx,
    px,
  });
  const actors = createActorsRenderer({
    ctx,
    state,
    player,
    world,
    assets,
    px,
    drawCharacterSprite: sprites.drawCharacterSprite,
    spriteKindForEnemy: sprites.spriteKindForEnemy,
    spriteHeightForEnemy: sprites.spriteHeightForEnemy,
    renderTuning,
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    getBackgroundRenderer().drawBackground();
    drawWorld();
    getEffectsRenderer().drawEffects();
    actors.drawPlayer();
    worldRenderer.drawForeground();
    getHudRenderer().drawCooldown();
    getHudRenderer().drawStatus();
    getHudRenderer().drawMessage();
  }

  function drawWorld() {
    ctx.save();
    ctx.translate(-world.cameraX, 0);

    worldRenderer.drawStreet();
    state.objects.forEach(objects.drawObject);
    state.gasClouds.forEach(projectiles.drawGasCloud);
    state.projectiles.forEach(projectiles.drawProjectile);
    state.enemies.forEach(actors.drawEnemy);
    state.allies.forEach(actors.drawAlly);

    ctx.restore();
  }

  function px(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function strokePx(x, y, w, h, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  return { draw };
}
