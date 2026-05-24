import {
  circleRect as geometryCircleRect,
  clamp as geometryClamp,
  enemyBox as geometryEnemyBox,
  objectBox as geometryObjectBox,
  playerBox as geometryPlayerBox,
  rectsOverlap as geometryRectsOverlap,
} from "../core/geometry.mjs";
import { bindGameInput } from "../core/input.mjs";
import { ObjectPool } from "../core/object-pool.mjs";
import { assetManifest } from "../data/assets.mjs";
import { enemyDefinitions } from "../data/enemies.mjs";
import { levelDefinitions } from "../data/levels.mjs";
import { playerTuning } from "../data/player-tuning.mjs";
import { renderTuning } from "../data/render-tuning.mjs";
import { weaponDefinitions } from "../data/weapons.mjs";
import { createAssetsFromManifest } from "../core/asset-loader.mjs";
import { createCombatSystem } from "../gameplay/combat.mjs";
import { createEffectsSystem } from "../gameplay/effects.mjs";
import { createEnemiesRuntime } from "../gameplay/enemies-runtime.mjs";
import { createObjectSystem } from "../gameplay/objects.mjs";
import { createPlayerSystem } from "../gameplay/player.mjs";
import { createProjectileSystem } from "../gameplay/projectiles.mjs";
import { createWaveSystem } from "../gameplay/waves.mjs";
import { createBackgroundRenderer } from "../render/backgrounds.mjs";
import { createEffectsRenderer } from "../render/effects.mjs";
import { createHudRenderer } from "../render/hud-render.mjs";
import { createRenderer } from "../render/renderer.mjs";
import { createGameUi } from "../ui/game-ui.mjs";
import {
  createInitialState,
  createPlayerState,
  createWorldState,
  resetRuntimeState,
} from "./game-state.mjs";

export async function createGame(browser) {
const { canvas, ctx, scoreEl, energyEl, shopsEl, overlay, startButton } = browser;
let gameUi = null;

const input = {
  left: false,
  right: false,
  jump: false,
  attack: false,
};

const world = createWorldState();

let assets = {
  streetBackground: loadImage("assets/level-1/background/background-la-paz-teleferico-map-extended-aligned.png"),
  telefericoBackground: loadImage("assets/backgrounds/la-paz-teleferico-map-extended-aligned.png"),
  characterSheet: loadImage("assets/sprites/characters-source-green.png"),
  foodHelper: loadImage("assets/sprites/senora-pollera-helper.png"),
  policeAlly: loadImage("assets/sprites/police-ally.png"),
  walkSheets: {
    hero: loadImage("assets/sprites/hero-walk.png"),
    blocker: loadImage("assets/sprites/blocker-walk.png"),
    looter: loadImage("assets/sprites/looter-walk.png"),
    mallku: loadImage("assets/sprites/mallku-walk.png"),
    miner: loadImage("assets/sprites/miner-walk.png"),
    foodHelper: loadImage("assets/sprites/senora-pollera-helper-detailed-walk.png"),
  },
  attackSheets: {
    hero: loadImage("assets/sprites/hero-chicote-attack.png"),
  },
  characterCanvas: null,
};

const state = createInitialState();
const player = createPlayerState();

function loadImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

function attachCharacterSheet(image) {
  if (!image) return;
  const applyCharacterSheet = () => {
    assets.characterCanvas = makeChromaTransparent(image);
  };
  if (image.complete && image.naturalWidth > 0) {
    applyCharacterSheet();
    return;
  }
  image.addEventListener("load", applyCharacterSheet, { once: true });
}

attachCharacterSheet(assets.characterSheet);

const spriteFrames = {
  hero: { x: 35, y: 170, w: 330, h: 520 },
  blocker: { x: 382, y: 188, w: 355, h: 500 },
  looter: { x: 748, y: 206, w: 320, h: 482 },
  mallku: { x: 1068, y: 70, w: 405, h: 620 },
  miner: { x: 1488, y: 38, w: 450, h: 655 },
};

function makeChromaTransparent(image) {
  const offscreen = document.createElement("canvas");
  offscreen.width = image.naturalWidth;
  offscreen.height = image.naturalHeight;
  const offscreenCtx = offscreen.getContext("2d");
  offscreenCtx.drawImage(image, 0, 0);
  const imageData = offscreenCtx.getImageData(0, 0, offscreen.width, offscreen.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (g > 155 && r < 95 && b < 95) {
      data[i + 3] = 0;
    }
  }
  offscreenCtx.putImageData(imageData, 0, 0);
  return offscreen;
}

let levels = [];

let enemyConfigs = null;
let particlePool = null;
let projectilePool = null;
let projectileSystem = null;
let combatSystem = null;
let waveSystem = null;
let objectSystem = null;
let enemiesRuntime = null;
let effectsSystem = null;
let effectsRenderer = null;
let hudRenderer = null;
let backgroundRenderer = null;
let rawLevelDefinitions = null;
const renderer = createRenderer({
  ctx,
  canvas,
  state,
  player,
  world,
  assets,
  spriteFrames,
  clamp,
  renderTuning,
  getBackgroundRenderer: () => backgroundRenderer,
  getEffectsRenderer: () => effectsRenderer,
  getHudRenderer: () => hudRenderer,
});

const playerSystem = createPlayerSystem({
  state,
  player,
  world,
  input,
  clamp,
  rectsOverlap,
  playerBox,
  objectBox,
  currentGateX,
  tuning: playerTuning,
});

function resolveLevelBackground(background) {
  if (background === "street") return assets.streetBackground;
  if (background === "teleferico") return assets.telefericoBackground;
  return background;
}

function hydrateLevelDefinition(level) {
  return {
    ...level,
    background: resolveLevelBackground(level.background),
    objects: level.objects.map((obj) => ({ ...obj })),
  };
}

function applyLevelDefinitions(levelDefinitions) {
  if (!Array.isArray(levelDefinitions) || levelDefinitions.length === 0) return;
  rawLevelDefinitions = levelDefinitions;
  levels = levelDefinitions.map(hydrateLevelDefinition);
  state.levelIndex = clamp(state.levelIndex, 0, levels.length - 1);
}

function applyEnemyDefinitions(enemyDefinitions) {
  if (!enemyDefinitions || typeof enemyDefinitions !== "object") return;
  enemyConfigs = enemyDefinitions;
}

function enemyConfig(type) {
  return enemyConfigs && enemyConfigs[type] ? enemyConfigs[type] : null;
}

Object.assign(assets, createAssetsFromManifest(assetManifest));
attachCharacterSheet(assets.characterSheet);
applyLevelDefinitions(levelDefinitions);
applyEnemyDefinitions(enemyDefinitions);

particlePool = new ObjectPool(
  () => ({ x: 0, y: 0, vx: 0, vy: 0, life: 0, color: "#ffffff" }),
  (particle, config) => {
    particle.x = config.x;
    particle.y = config.y;
    particle.vx = config.vx;
    particle.vy = config.vy;
    particle.life = config.life;
    particle.color = config.color;
  },
  120
);
particlePool.syncFrom(state.particles);

projectilePool = new ObjectPool(
  () => ({ type: "", x: 0, y: 0, vx: 0, vy: 0, r: 0, damage: 0, life: 0 }),
  (projectile, config) => {
    projectile.type = config.type;
    projectile.x = config.x;
    projectile.y = config.y;
    projectile.vx = config.vx;
    projectile.vy = config.vy;
    projectile.r = config.r;
    projectile.damage = config.damage;
    projectile.life = config.life;
  },
  32
);
projectilePool.syncFrom(state.projectiles);

gameUi = createGameUi({ scoreEl, energyEl, shopsEl, overlay, startButton });

projectileSystem = createProjectileSystem({
  state,
  player,
  world,
  canvas,
  projectilePool: () => projectilePool,
  circleRect,
  playerBox,
  hitPlayer,
  burst,
});

combatSystem = createCombatSystem({
  state,
  player,
  input,
  rectsOverlap,
  enemyBox,
  objectBox,
  burst,
  weaponConfig: () => weaponDefinitions.whip,
  playerTuning,
});

waveSystem = createWaveSystem({
  state,
  player,
  world,
  canvas,
  clamp,
  burst,
  showMessage,
  enemyConfig,
  enemySpeed,
});

objectSystem = createObjectSystem({
  state,
  player,
  rectsOverlap,
  playerBox,
  objectBox,
  showMessage,
  finishFoodBreak,
  burst,
});

enemiesRuntime = createEnemiesRuntime({
  state,
  player,
  world,
  canvas,
  clamp,
  rectsOverlap,
  playerBox,
  enemyBox,
  enemyConfig,
  throwProjectile,
  hitPlayer,
  burst,
  currentLevel,
});

effectsSystem = createEffectsSystem({
  state,
  particlePool: () => particlePool,
});

effectsRenderer = createEffectsRenderer({
  ctx,
  state,
  world,
  px,
});

hudRenderer = createHudRenderer({
  ctx,
  canvas,
  state,
  player,
  clamp,
  waveStatusText,
});

backgroundRenderer = createBackgroundRenderer({
  ctx,
  canvas,
  state,
  world,
  currentLevel,
  px,
});

bindGameInput({ input });
function currentLevel() {
  return levels[state.levelIndex];
}

function buildLevelObjects(level) {
  return objectSystem.buildLevelObjects(level);
}

function makeWaves(level) {
  return waveSystem.makeWaves(level);
}

function waveEnemies(index) {
  return waveSystem.waveEnemies(index);
}

function resetGame() {
  const level = currentLevel();
  resetRuntimeState({
    state,
    player,
    world,
    level,
    objects: buildLevelObjects(level),
    waves: makeWaves(level),
    tuning: playerTuning,
  });
  if (projectilePool) projectilePool.syncFrom(state.projectiles);
  if (particlePool) particlePool.syncFrom(state.particles);

  if (gameUi) gameUi.hideOverlay();
  else overlay.classList.add("is-hidden");
}

function update(dt) {
  state.elapsed += dt;
  state.score += dt * 3;
  state.cableOffset += dt * 28;
  state.wavePause = Math.max(0, state.wavePause - dt);
  state.messageTimer = Math.max(0, state.messageTimer - dt);
  player.attackCooldown = Math.max(0, player.attackCooldown - dt);
  player.attackTimer = Math.max(0, player.attackTimer - dt);
  player.invincible = Math.max(0, player.invincible - dt);
  player.gasTick = Math.max(0, player.gasTick - dt);

  playerSystem.update(dt);
  maybeAttack();
  updateSupportMoment();
  updateWaves();
  updateFinalEncounter();
  updateEnemies(dt);
  updateAllies(dt);
  updateProjectiles(dt);
  updateGasClouds(dt);
  updateObjects(dt);
  updateEffects(dt);
  updateCamera();
  updateHud();

  if (state.energy <= 0) {
    endGame("Te quedaste sin energia");
  }

  if (player.x > world.width - 170 && state.finalStarted && !state.enemies.some((enemy) => enemy.type === "miner")) {
    endGame(currentLevel().finishText);
  }
}

function maybeAttack() {
  combatSystem.maybeAttack();
}

function currentGateX() {
  const waveGateX = waveSystem ? waveSystem.currentGateX() : null;
  const bossGateX = enemiesRuntime ? enemiesRuntime.currentGateX() : null;
  if (waveGateX && bossGateX) return Math.min(waveGateX, bossGateX);
  if (waveGateX) return waveGateX;
  if (bossGateX) return bossGateX;
  if (state.finalStarted && state.enemies.some((enemy) => enemy.type === "miner")) return world.width - 1880;
  return null;
}

function updateWaves() {
  waveSystem.updateWaves();
}

function updateSupportMoment() {
  waveSystem.updateSupportMoment();
}

function hasFoodHelper() {
  return waveSystem.hasFoodHelper();
}

function showMessage(text, duration = 4.2) {
  state.messageText = text;
  state.messageTimer = duration;
}

function spawnWaveGroup(wave) {
  waveSystem.spawnWaveGroup(wave);
}

function spawnFoodHelper() {
  waveSystem.spawnFoodHelper();
}

function spawnWaveEnemy(type, x, waveId) {
  waveSystem.spawnWaveEnemy(type, x, waveId);
}

function updateFinalEncounter() {
  enemiesRuntime.updateFinalEncounter();
}

function enemySpeed(type, progress) {
  return enemiesRuntime ? enemiesRuntime.enemySpeed(type, progress) : 48 + progress * 28;
}

function updateEnemies(dt) {
  enemiesRuntime.updateEnemies(dt);
}

function updateAllies(dt) {
  enemiesRuntime.updateAllies(dt);
}

function chooseEnemyTarget(enemy) {
  return enemiesRuntime.chooseEnemyTarget(enemy);
}

function updateBlocker(enemy, dx) {
  enemiesRuntime.updateBlocker(enemy, dx);
}

function updateMiner(enemy, dx) {
  enemiesRuntime.updateMiner(enemy, dx);
}

function throwProjectile(enemy, type) {
  projectileSystem.throwProjectile(enemy, type);
}

function updateProjectiles(dt) {
  projectileSystem.updateProjectiles(dt);
}

function releaseGas(projectile) {
  projectileSystem.releaseGas(projectile);
}

function updateGasClouds(dt) {
  projectileSystem.updateGasClouds(dt);
}

function explode(projectile) {
  projectileSystem.explode(projectile);
}

function hitPlayer(damage, knockback) {
  combatSystem.hitPlayer(damage, knockback);
}

function updateObjects(dt = 1 / 60) {
  objectSystem.updateObjects(dt);
}

function finishFoodBreak(waveId) {
  waveSystem.finishFoodBreak(waveId);
}

function updateEffects(dt) {
  effectsSystem.update(dt);
}

function updateCamera() {
  const target = player.x - 130;
  world.cameraX += (target - world.cameraX) * 0.12;
  world.cameraX = clamp(world.cameraX, 0, world.width - canvas.width);
}

function updateHud() {
  if (gameUi) {
    gameUi.updateHud(state);
    return;
  }
  scoreEl.textContent = Math.floor(state.score);
  energyEl.textContent = Math.max(0, Math.floor(state.energy));
  shopsEl.textContent = state.saved;
}

function endGame(message) {
  state.running = false;
  const totalShops = state.objects.filter((obj) => obj.type === "shop").length;
  if (gameUi) {
    gameUi.showEndScreen({
      title: message,
      mapName: currentLevel().name,
      score: state.score,
      saved: state.saved,
      totalShops,
    });
    return;
  }
  overlay.classList.remove("is-hidden");
  overlay.querySelector("h1").textContent = message;
  overlay.querySelector("p").textContent = `Mapa: ${currentLevel().name}. Puntos: ${Math.floor(state.score)}. Negocios protegidos: ${state.saved}/${totalShops}.`;
  startButton.textContent = "Reintentar";
}

function draw() {
  renderer.draw();
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
function waveStatusText() {
  if (!state.activeWave) return "";
  if (state.activeWave.id) return state.activeWave.id.replaceAll("-", " ");
  if (state.activeWave.phase === 0) return "Min 1: bloqueadores";
  if (state.activeWave.phase === 1) return "Min 2: saqueadores";
  return "Min 3: mallkus";
}

function playerBox() {
  return geometryPlayerBox(player);
}

function enemyBox(enemy) {
  return geometryEnemyBox(enemy);
}

function objectBox(obj) {
  return geometryObjectBox(obj);
}

function rectsOverlap(a, b) {
  return geometryRectsOverlap(a, b);
}

function circleRect(circle, rect) {
  return geometryCircleRect(circle, rect);
}

function burst(x, y, color) {
  for (let i = 0; i < 10; i += 1) {
    const particle = {
      x,
      y,
      vx: (Math.random() - 0.5) * 170,
      vy: -Math.random() * 190,
      life: 0.34,
      color,
    };
    if (particlePool) {
      particlePool.acquire(particle);
    } else {
      state.particles.push(particle);
    }
  }
}

function clamp(value, min, max) {
  return geometryClamp(value, min, max);
}

draw();

return {
  reset: resetGame,
  update,
  draw,
  isRunning: () => state.running,
};
}
