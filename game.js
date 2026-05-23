const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const scoreEl = document.querySelector("#score");
const energyEl = document.querySelector("#energy");
const shopsEl = document.querySelector("#shops");
const overlay = document.querySelector("#overlay");
const startButton = document.querySelector("#startButton");
let gameUi = null;

const input = {
  left: false,
  right: false,
  jump: false,
  attack: false,
};

const world = {
  width: 30000,
  ground: 590,
  cameraX: 0,
};

let assets = {
  streetBackground: loadImage("assets/backgrounds/la-paz-playable-map-long.png"),
  telefericoBackground: loadImage("assets/backgrounds/la-paz-teleferico-map-extended-aligned.png"),
  pacenaKiosk: loadImage("assets/sprites/kiosco-paceno-game.png"),
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

const state = {
  running: false,
  lastTime: 0,
  score: 0,
  energy: 100,
  saved: 0,
  elapsed: 0,
  waveIndex: 0,
  activeWave: null,
  wavePause: 0,
  waveGroup: 0,
  nextWaveX: 560,
  lastSupportMinute: -1,
  messageText: "",
  messageTimer: 0,
  finalStarted: false,
  policeArrived: false,
  maskPicked: false,
  bossSpawned: false,
  waves: [],
  enemies: [],
  allies: [],
  projectiles: [],
  gasClouds: [],
  objects: [],
  hitArcs: [],
  particles: [],
  cableOffset: 0,
  levelIndex: 1,
};

const player = {
  x: 90,
  y: 520,
  w: 28,
  h: 50,
  vx: 0,
  vy: 0,
  dir: 1,
  grounded: false,
  attackCooldown: 0,
  attackTimer: 0,
  invincible: 0,
  gasTick: 0,
};

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

let levels = [
  {
    id: "street",
    name: "Calle Pacena",
    background: assets.streetBackground,
    width: 30000,
    ground: 590,
    finishText: "Llegaste al final de la calle",
    objects: [
      { type: "barricade", x: 480, y: 552, w: 78, h: 42, hp: 2 },
      { type: "shop", x: 760, y: 522, w: 70, h: 70, hp: 100, saved: false },
      { type: "crate", x: 1050, y: 560, w: 44, h: 30, hp: 1 },
      { type: "barricade", x: 1320, y: 552, w: 88, h: 42, hp: 2 },
      { type: "shop", x: 1650, y: 522, w: 70, h: 70, hp: 100, saved: false },
      { type: "crate", x: 1960, y: 560, w: 44, h: 30, hp: 1 },
      { type: "barricade", x: 2250, y: 552, w: 90, h: 42, hp: 3 },
      { type: "shop", x: 2580, y: 522, w: 70, h: 70, hp: 100, saved: false },
    ],
  },
  {
    id: "teleferico",
    name: "Estacion Teleferico",
    background: assets.telefericoBackground,
    width: 30500,
    ground: 592,
    finishText: "Llegaste al final de la estacion",
    objects: [
      { type: "crate", x: 430, y: 562, w: 46, h: 30, hp: 1 },
      { type: "barricade", x: 720, y: 554, w: 84, h: 40, hp: 2 },
      { type: "shop", x: 1020, y: 522, w: 74, h: 70, hp: 100, saved: false },
      { type: "crate", x: 1325, y: 562, w: 46, h: 30, hp: 1 },
      { type: "barricade", x: 1620, y: 554, w: 92, h: 40, hp: 2 },
      { type: "shop", x: 1980, y: 522, w: 74, h: 70, hp: 100, saved: false },
      { type: "crate", x: 2310, y: 562, w: 48, h: 30, hp: 1 },
      { type: "barricade", x: 2680, y: 554, w: 98, h: 40, hp: 3 },
      { type: "shop", x: 3000, y: 522, w: 74, h: 70, hp: 100, saved: false },
    ],
  },
];

let enemyConfigs = null;
let coreMath = null;
let particlePool = null;
let projectilePool = null;
let projectileSystem = null;
let combatSystem = null;
let waveSystem = null;
let rawLevelDefinitions = null;

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

import("./src/data/levels.mjs")
  .then(({ levelDefinitions }) => {
    applyLevelDefinitions(levelDefinitions);
  })
  .catch((error) => {
    console.warn("Using fallback level data.", error);
  });

function applyEnemyDefinitions(enemyDefinitions) {
  if (!enemyDefinitions || typeof enemyDefinitions !== "object") return;
  enemyConfigs = enemyDefinitions;
}

function enemyConfig(type) {
  return enemyConfigs && enemyConfigs[type] ? enemyConfigs[type] : null;
}

import("./src/data/enemies.mjs")
  .then(({ enemyDefinitions }) => {
    applyEnemyDefinitions(enemyDefinitions);
  })
  .catch((error) => {
    console.warn("Using fallback enemy data.", error);
  });

import("./src/core/math.mjs")
  .then((mathModule) => {
    coreMath = mathModule;
  })
  .catch((error) => {
    console.warn("Using fallback math helpers.", error);
  });

import("./src/core/object-pool.mjs")
  .then(({ ObjectPool }) => {
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
  })
  .catch((error) => {
    console.warn("Using fallback pooled allocation.", error);
  });

import("./src/ui/game-ui.mjs")
  .then(({ createGameUi }) => {
    gameUi = createGameUi({ scoreEl, energyEl, shopsEl, overlay, startButton });
  })
  .catch((error) => {
    console.warn("Using fallback UI helpers.", error);
  });

Promise.all([
  import("./src/data/assets.mjs"),
  import("./src/core/asset-loader.mjs"),
])
  .then(([{ assetManifest }, { createAssetsFromManifest }]) => {
    assets = createAssetsFromManifest(assetManifest);
    attachCharacterSheet(assets.characterSheet);
    if (rawLevelDefinitions) {
      applyLevelDefinitions(rawLevelDefinitions);
    }
  })
  .catch((error) => {
    console.warn("Using fallback asset loading.", error);
  });

import("./src/gameplay/projectiles.mjs")
  .then(({ createProjectileSystem }) => {
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
  })
  .catch((error) => {
    console.warn("Using fallback projectile system.", error);
  });

import("./src/gameplay/combat.mjs")
  .then(({ createCombatSystem }) => {
    combatSystem = createCombatSystem({
      state,
      player,
      input,
      rectsOverlap,
      enemyBox,
      objectBox,
      burst,
    });
  })
  .catch((error) => {
    console.warn("Using fallback combat system.", error);
  });

import("./src/gameplay/waves.mjs")
  .then(({ createWaveSystem }) => {
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
  })
  .catch((error) => {
    console.warn("Using fallback wave system.", error);
  });

function currentLevel() {
  return levels[state.levelIndex];
}

function buildLevelObjects(level) {
  const objects = [];
  const baseObjects = level.objects.map((obj) => ({ ...obj }));
  const repeat = level.objectRepeat || 3100;

  for (let offset = 0; offset < level.width - 900; offset += repeat) {
    baseObjects.forEach((obj) => {
      const x = obj.x + offset;
      if (x > level.width - 900) return;
      objects.push({ ...obj, x });
    });
  }

  objects.push({ type: "mask", x: level.width - 1700, y: level.ground - 56, w: 34, h: 34, hp: 1, picked: false });
  return objects;
}

function makeWaves(level) {
  if (waveSystem) return waveSystem.makeWaves(level);
  return [];
}

function waveEnemies(index) {
  if (waveSystem) return waveSystem.waveEnemies(index);
  if (index === 0) {
    return ["blocker", "blocker", "blocker", "blocker", "blocker", "blocker", "blocker", "blocker", "blocker", "blocker"];
  }
  if (index === 1) {
    return ["blocker", "looter", "blocker", "looter", "blocker", "looter", "blocker", "looter", "blocker", "looter"];
  }
  return ["mallku", "mallku", "mallku", "mallku", "mallku", "mallku", "blocker", "looter", "mallku", "mallku"];
}

function bindFallbackHold(buttonId, key) {
  const button = document.querySelector(buttonId);
  const on = (event) => {
    event.preventDefault();
    input[key] = true;
  };
  const off = (event) => {
    event.preventDefault();
    input[key] = false;
  };
  button.addEventListener("pointerdown", on);
  button.addEventListener("pointerup", off);
  button.addEventListener("pointercancel", off);
  button.addEventListener("pointerleave", off);
}

function bindFallbackInput() {
  bindFallbackHold("#leftButton", "left");
  bindFallbackHold("#rightButton", "right");
  bindFallbackHold("#jumpButton", "jump");
  bindFallbackHold("#attackButton", "attack");

  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key === "arrowleft" || key === "a") input.left = true;
    if (key === "arrowright" || key === "d") input.right = true;
    if (key === "arrowup" || key === "w" || key === " ") input.jump = true;
    if (key === "j" || key === "k") input.attack = true;
  });

  window.addEventListener("keyup", (event) => {
    const key = event.key.toLowerCase();
    if (key === "arrowleft" || key === "a") input.left = false;
    if (key === "arrowright" || key === "d") input.right = false;
    if (key === "arrowup" || key === "w" || key === " ") input.jump = false;
    if (key === "j" || key === "k") input.attack = false;
  });
}

import("./src/core/input.mjs")
  .then(({ bindGameInput }) => {
    bindGameInput({ input });
  })
  .catch((error) => {
    console.warn("Using fallback input bindings.", error);
    bindFallbackInput();
  });

startButton.addEventListener("click", resetGame);

function resetGame() {
  const level = currentLevel();
  state.running = true;
  state.lastTime = performance.now();
  state.score = 0;
  state.energy = 100;
  state.saved = 0;
  state.elapsed = 0;
  state.waveIndex = 0;
  state.activeWave = null;
  state.wavePause = 0;
  state.waveGroup = 0;
  state.nextWaveX = 620;
  state.lastSupportMinute = -1;
  state.messageText = "";
  state.messageTimer = 0;
  state.finalStarted = false;
  state.policeArrived = false;
  state.maskPicked = false;
  state.bossSpawned = false;
  state.enemies = [];
  state.allies = [];
  state.projectiles = [];
  if (projectilePool) projectilePool.syncFrom(state.projectiles);
  state.gasClouds = [];
  state.objects = buildLevelObjects(level);
  state.waves = makeWaves(level);
  state.hitArcs = [];
  state.particles = [];
  if (particlePool) particlePool.syncFrom(state.particles);
  state.cableOffset = 0;
  world.width = level.width;
  world.ground = level.ground;
  world.cameraX = 0;

  player.x = 90;
  player.y = 520;
  player.vx = 0;
  player.vy = 0;
  player.dir = 1;
  player.grounded = false;
  player.attackCooldown = 0;
  player.attackTimer = 0;
  player.invincible = 0;
  player.gasTick = 0;

  if (gameUi) gameUi.hideOverlay();
  else overlay.classList.add("is-hidden");
  requestAnimationFrame(loop);
}

function loop(time) {
  if (!state.running) return;
  const dt = Math.min((time - state.lastTime) / 1000, 0.033);
  state.lastTime = time;
  update(dt);
  draw();
  requestAnimationFrame(loop);
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

  updatePlayer(dt);
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

function updatePlayer(dt) {
  const accel = 1700;
  const friction = player.grounded ? 0.78 : 0.94;
  const maxSpeed = 205;

  if (input.left) {
    player.vx -= accel * dt;
    player.dir = -1;
  }
  if (input.right) {
    player.vx += accel * dt;
    player.dir = 1;
  }

  player.vx *= friction;
  player.vx = clamp(player.vx, -maxSpeed, maxSpeed);

  if (input.jump && player.grounded) {
    player.vy = -520;
    player.grounded = false;
  }

  player.vy += 1200 * dt;
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  player.x = clamp(player.x, 40, world.width - 60);
  const gateX = currentGateX();
  if (gateX && player.x > gateX) {
    player.x = gateX;
    player.vx = Math.min(0, player.vx);
  }

  if (player.y + player.h / 2 >= world.ground) {
    player.y = world.ground - player.h / 2;
    player.vy = 0;
    player.grounded = true;
  }

  state.objects.forEach((obj) => {
    if (obj.hp <= 0 || obj.type === "shop" || obj.type === "mask" || obj.type === "food-helper") return;
    if (!rectsOverlap(playerBox(), objectBox(obj))) return;
    if (player.y < obj.y - obj.h / 2 && player.vy >= 0) {
      player.y = obj.y - obj.h / 2 - player.h / 2;
      player.vy = 0;
      player.grounded = true;
    } else {
      player.x -= Math.sign(player.vx || player.dir) * 12;
      player.vx *= -0.2;
    }
  });
}

function maybeAttack() {
  if (combatSystem) return combatSystem.maybeAttack();
  if (!input.attack || player.attackCooldown > 0) return;
  player.attackCooldown = 0.52;
  player.attackTimer = 0.28;

  const hit = {
    x: player.x + player.dir * 68,
    y: player.y - 18,
    w: 128,
    h: 62,
  };
  state.hitArcs.push({ x: player.x, y: player.y - 18, dir: player.dir, life: 0.22, type: "whip" });

  state.enemies.forEach((enemy) => {
    if (!rectsOverlap(hit, enemyBox(enemy))) return;
    enemy.hp -= 1;
    enemy.vx = player.dir * 260;
    enemy.vy = -120;
    state.score += 20;
    burst(enemy.x, enemy.y, "#f5c84f");
  });

  state.objects.forEach((obj) => {
    if (obj.hp <= 0 || obj.type === "shop") return;
    if (!rectsOverlap(hit, objectBox(obj))) return;
    obj.hp -= 1;
    state.score += 12;
    burst(obj.x, obj.y, "#d9863a");
  });

  state.enemies = state.enemies.filter((enemy) => {
    if (enemy.hp > 0) return true;
    state.score += 45;
    burst(enemy.x, enemy.y, "#7bc878");
    return false;
  });
}

function currentGateX() {
  if (state.finalStarted && state.enemies.some((enemy) => enemy.type === "miner")) return world.width - 1880;
  return null;
}

function updateWaves() {
  if (waveSystem) return waveSystem.updateWaves();
  if (state.finalStarted || state.wavePause > 0) return;
  if (state.elapsed < 4) return;
  if (hasFoodHelper()) return;
  if (state.activeWave) {
    const alive = state.enemies.some((enemy) => enemy.waveId === state.activeWave.id);
    if (!alive) {
      if (state.activeWave.queue.length > 0) {
        spawnWaveGroup(state.activeWave);
        state.score += 70;
      } else {
        state.activeWave.cleared = true;
        state.activeWave = null;
        state.wavePause = 1.1;
        state.nextWaveX = player.x + 720;
        state.score += 150;
        burst(player.x + 36, player.y - 20, "#7bc878");
      }
    }
    return;
  }

  if (state.elapsed >= 180) return;
  if (player.x < state.nextWaveX) return;
  const phaseIndex = Math.min(2, Math.floor(state.elapsed / 60));
  const wave = {
    id: `wave-${state.waveIndex}`,
    x: player.x + 260,
    released: true,
    cleared: false,
    phase: phaseIndex,
    queue: waveEnemies(phaseIndex),
    waitingForFood: false,
  };
  wave.released = true;
  state.activeWave = wave;
  spawnWaveGroup(wave);
  state.waveIndex += 1;
}

function updateSupportMoment() {
  if (waveSystem) return waveSystem.updateSupportMoment();
  if (state.finalStarted || state.elapsed < 45) return;
  const minute = Math.floor(state.elapsed / 60);
  const second = Math.floor(state.elapsed % 60);
  if (second < 52 || state.lastSupportMinute === minute || hasFoodHelper()) return;
  if (state.activeWave || state.enemies.some((enemy) => enemy.waveId)) return;
  state.lastSupportMinute = minute;
  spawnFoodHelper();
  showMessage("La señora te trajo comida. Vamos vamos tu puedes.");
}

function hasFoodHelper() {
  if (waveSystem) return waveSystem.hasFoodHelper();
  return state.objects.some((obj) => obj.type === "food-helper" && obj.hp > 0);
}

function showMessage(text, duration = 4.2) {
  state.messageText = text;
  state.messageTimer = duration;
}

function spawnWaveGroup(wave) {
  if (waveSystem) return waveSystem.spawnWaveGroup(wave);
  const count = Math.min(4, wave.queue.length);
  const group = wave.queue.splice(0, count);
  state.waveGroup += 1;
  group.forEach((type, index) => {
    const offsets = [-180, 105, 245, 360];
    spawnWaveEnemy(type, player.x + offsets[index], wave.id);
  });
}

function spawnFoodHelper() {
  if (waveSystem) return waveSystem.spawnFoodHelper();
  const x = clamp(player.x + player.dir * 82, world.cameraX + 56, world.cameraX + canvas.width - 56);
  state.objects.push({
    type: "food-helper",
    x,
    y: world.ground - 44,
    w: 42,
    h: 74,
    hp: 1,
    life: 18,
    heal: 22,
    waveId: state.activeWave ? state.activeWave.id : null,
  });
  burst(x, world.ground - 64, "#f1c84f");
}

function spawnWaveEnemy(type, x, waveId) {
  if (waveSystem) return waveSystem.spawnWaveEnemy(type, x, waveId);
  const progress = player.x / world.width;
  const config = enemyConfig(type);
  const earlyHp = config ? config.baseHp : type === "mallku" ? 3 : 1;
  const lateHp = config ? config.lateHp : type === "mallku" ? 3 : 2;
  const hp = progress > 0.45 ? lateHp : earlyHp;
  state.enemies.push({
    type,
    waveId,
    x: clamp(x, 90, world.width - 90),
    y: world.ground - 24,
    w: config ? config.width : type === "mallku" ? 32 : 28,
    h: config ? config.height : type === "mallku" ? 52 : 48,
    vx: 0,
    vy: 0,
    hp,
    maxHp: hp,
    speed: enemySpeed(type, progress),
    attackTimer: 0.25 + Math.random() * 0.5,
  });
}

function updateFinalEncounter() {
  if (state.finalStarted || state.elapsed < 180) return;
  state.finalStarted = true;
  state.bossSpawned = true;
  state.activeWave = null;
  state.enemies = state.enemies.filter((enemy) => !enemy.waveId);
  const baseX = player.x + 430;
  const minerConfig = enemyConfig("miner");
  for (let i = 0; i < 3; i += 1) {
    const finalBoss = i === 2;
    state.enemies.push({
      type: "miner",
      finalBoss,
      policeTarget: i < 2,
      x: baseX + i * 105,
      y: world.ground - 36,
      w: minerConfig?.width ?? 46,
      h: minerConfig?.height ?? 72,
      vx: 0,
      vy: 0,
      hp: finalBoss ? minerConfig?.finalBossHp ?? 16 : minerConfig?.baseHp ?? 10,
      maxHp: finalBoss ? minerConfig?.finalBossHp ?? 16 : minerConfig?.baseHp ?? 10,
      speed: finalBoss ? minerConfig?.finalBossSpeed ?? 56 : minerConfig?.baseSpeed ?? 46,
      attackTimer: 0.7 + i * 0.35,
    });
  }

  state.policeArrived = true;
  for (let i = 0; i < 2; i += 1) {
    state.allies.push({
      type: "police",
      x: player.x - 180 - i * 54,
      y: world.ground - 24,
      w: 28,
      h: 50,
      vx: 0,
      speed: 132,
      attackTimer: 0.2 + i * 0.35,
    });
  }
}

function enemySpeed(type, progress) {
  const config = enemyConfig(type);
  if (config) return config.baseSpeed + progress * config.speedScale;
  if (type === "looter") return 78 + progress * 36;
  if (type === "mallku") return 98 + progress * 34;
  return 48 + progress * 28;
}

function updateEnemies(dt) {
  state.enemies.forEach((enemy) => {
    const target = chooseEnemyTarget(enemy);
    const dx = target.x - enemy.x;
    const dir = Math.sign(dx) || 1;
    enemy.vx += dir * enemy.speed * dt * 5;
    enemy.vx = clamp(enemy.vx, -enemy.speed, enemy.speed);
    enemy.vy += 1120 * dt;
    enemy.x += enemy.vx * dt;
    enemy.y += enemy.vy * dt;
    enemy.attackTimer = Math.max(0, enemy.attackTimer - dt);

    if (enemy.y + enemy.h / 2 >= world.ground) {
      enemy.y = world.ground - enemy.h / 2;
      enemy.vy = 0;
    }

    if (enemy.type === "blocker") {
      updateBlocker(enemy, dx);
    }

    if (enemy.type === "miner") {
      updateMiner(enemy, dx);
    }

    state.objects.forEach((obj) => {
      if (obj.hp <= 0 || obj.type !== "shop") return;
      if (enemy.type === "blocker" || enemy.type === "miner") return;
      if (Math.abs(enemy.x - obj.x) < 44 && enemy.attackTimer <= 0) {
        const config = enemyConfig(enemy.type);
        obj.hp -= config?.shopDamage ?? (enemy.type === "looter" ? 24 : 10);
        enemy.attackTimer = config?.shopAttackCooldown ?? (enemy.type === "looter" ? 0.55 : 0.8);
        burst(obj.x, obj.y - 8, "#d94f35");
      }
    });

    if (rectsOverlap(playerBox(), enemyBox(enemy)) && player.invincible <= 0) {
      const damage = enemyConfig(enemy.type)?.contactDamage ?? (enemy.type === "mallku" ? 16 : 10);
      hitPlayer(damage, dir * 180);
    }

    if (enemy.type === "mallku" && Math.abs(player.x - enemy.x) < 58 && Math.abs(player.y - enemy.y) < 48 && enemy.attackTimer <= 0) {
      const attack = enemyConfig(enemy.type)?.attack;
      hitPlayer(attack?.damage ?? 18, dir * (attack?.knockback ?? 240));
      enemy.attackTimer = attack?.cooldown ?? 1.05;
    }
  });

  state.enemies = state.enemies.filter((enemy) => {
    if (enemy.waveId || enemy.type === "miner") return true;
    return enemy.x > world.cameraX - 180 && enemy.x < world.cameraX + canvas.width + 220;
  });
}

function updateAllies(dt) {
  state.allies.forEach((ally) => {
    const target = state.enemies.find((enemy) => enemy.policeTarget);
    if (!target) {
      ally.vx *= 0.75;
      return;
    }

    const dx = target.x - ally.x;
    const dir = Math.sign(dx) || 1;
    ally.vx += dir * ally.speed * dt * 6;
    ally.vx = clamp(ally.vx, -ally.speed, ally.speed);
    ally.x += ally.vx * dt;
    ally.attackTimer = Math.max(0, ally.attackTimer - dt);

    if (Math.abs(dx) < 46 && ally.attackTimer <= 0) {
      target.hp -= 2;
      target.vx = dir * 130;
      ally.attackTimer = 0.55;
      burst(target.x, target.y - 20, "#5ba4d8");
    }
  });

  state.enemies = state.enemies.filter((enemy) => {
    if (enemy.hp > 0) return true;
    state.score += enemy.type === "miner" ? 260 : 45;
    burst(enemy.x, enemy.y, enemy.type === "miner" ? "#f1c84f" : "#7bc878");
    return false;
  });
}

function chooseEnemyTarget(enemy) {
  if (enemy.type !== "looter") return player;
  let target = player;
  let best = Infinity;
  state.objects.forEach((obj) => {
    if (obj.type !== "shop" || obj.hp <= 0 || obj.saved) return;
    const distance = Math.abs(enemy.x - obj.x);
    if (distance < best) {
      best = distance;
      target = obj;
    }
  });
  return target;
}

function updateBlocker(enemy, dx) {
  const attack = enemyConfig(enemy.type)?.attack;
  const distance = Math.abs(dx);
  if (distance < (attack?.retreatRange ?? 150)) enemy.vx *= -0.45;
  if (distance < (attack?.range ?? 330) && enemy.attackTimer <= 0) {
    throwProjectile(enemy, attack?.projectile ?? "stone");
    enemy.attackTimer = attack?.cooldown ?? 1.35;
  }
}

function updateMiner(enemy, dx) {
  const attack = enemyConfig(enemy.type)?.attack;
  const distance = Math.abs(dx);
  if (distance < 190) enemy.vx *= -0.35;
  if (distance < (attack?.range ?? 430) && enemy.attackTimer <= 0) {
    throwProjectile(enemy, enemy.finalBoss ? attack?.finalBossProjectile ?? "gas" : attack?.projectile ?? "dynamite");
    enemy.attackTimer = enemy.finalBoss ? 1.45 : 1.75;
  }
}

function throwProjectile(enemy, type) {
  if (projectileSystem) return projectileSystem.throwProjectile(enemy, type);
  const dir = Math.sign(player.x - enemy.x) || 1;
  const speed = type === "dynamite" || type === "gas" ? 190 : 260;
  const projectile = {
    type,
    x: enemy.x + dir * 18,
    y: enemy.y - enemy.h / 2 + 12,
    vx: dir * speed,
    vy: type === "dynamite" || type === "gas" ? -270 : -150,
    r: type === "dynamite" || type === "gas" ? 10 : 7,
    life: type === "dynamite" || type === "gas" ? 2.2 : 1.7,
    damage: type === "dynamite" ? 22 : type === "gas" ? 7 : 11,
  };
  if (projectilePool) {
    projectilePool.acquire(projectile);
  } else {
    state.projectiles.push(projectile);
  }
}

function updateProjectiles(dt) {
  if (projectileSystem) return projectileSystem.updateProjectiles(dt);
  state.projectiles.forEach((projectile) => {
    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.vy += (projectile.type === "dynamite" || projectile.type === "gas" ? 620 : 430) * dt;
    projectile.life -= dt;

    if (projectile.type === "stone" && circleRect(projectile, playerBox())) {
      hitPlayer(projectile.damage, Math.sign(projectile.vx) * 160);
      projectile.life = 0;
      burst(projectile.x, projectile.y, "#b9b3a1");
    }

    if ((projectile.type === "dynamite" || projectile.type === "gas") && (projectile.y + projectile.r >= world.ground || projectile.life <= 0)) {
      if (projectile.type === "gas") releaseGas(projectile);
      else explode(projectile);
      projectile.life = 0;
    }
  });

  const shouldRemoveProjectile = (projectile) => {
    return projectile.life <= 0 || projectile.x <= world.cameraX - 140 || projectile.x >= world.cameraX + canvas.width + 180;
  };
  if (projectilePool) {
    projectilePool.releaseWhere(shouldRemoveProjectile);
  } else {
    state.projectiles = state.projectiles.filter((projectile) => !shouldRemoveProjectile(projectile));
  }
}

function releaseGas(projectile) {
  if (projectileSystem) return projectileSystem.releaseGas(projectile);
  burst(projectile.x, projectile.y - 12, "#8fb46a");
  state.gasClouds.push({
    x: projectile.x,
    y: world.ground - 56,
    r: 86,
    life: 4.4,
    damage: projectile.damage,
  });
}

function updateGasClouds(dt) {
  if (projectileSystem) return projectileSystem.updateGasClouds(dt);
  state.gasClouds.forEach((cloud) => {
    cloud.life -= dt;
    cloud.r = Math.min(118, cloud.r + dt * 10);
    if (player.gasTick <= 0 && Math.hypot(player.x - cloud.x, player.y - cloud.y) < cloud.r) {
      const damage = state.maskPicked ? Math.ceil(cloud.damage * 0.45) : cloud.damage;
      hitPlayer(damage, Math.sign(player.x - cloud.x || 1) * 90);
      player.gasTick = state.maskPicked ? 0.9 : 0.55;
    }
  });
  state.gasClouds = state.gasClouds.filter((cloud) => cloud.life > 0);
}

function explode(projectile) {
  if (projectileSystem) return projectileSystem.explode(projectile);
  const radius = 72;
  burst(projectile.x, projectile.y, "#f18b32");
  burst(projectile.x, projectile.y - 8, "#f1d25b");
  if (Math.hypot(player.x - projectile.x, player.y - projectile.y) < radius) {
    hitPlayer(projectile.damage, Math.sign(player.x - projectile.x || 1) * 230);
  }
  state.objects.forEach((obj) => {
    if (obj.type !== "shop" || obj.hp <= 0) return;
    if (Math.abs(obj.x - projectile.x) < radius) {
      obj.hp -= 18;
    }
  });
}

function hitPlayer(damage, knockback) {
  if (combatSystem) return combatSystem.hitPlayer(damage, knockback);
  if (player.invincible > 0) return;
  state.energy -= damage;
  player.invincible = 0.7;
  player.vx = knockback;
  burst(player.x, player.y, "#d94f35");
}

function updateObjects(dt = 1 / 60) {
  state.objects.forEach((obj) => {
    if (obj.type === "food-helper") {
      obj.life -= dt;
      if (rectsOverlap(playerBox(), objectBox(obj))) {
        obj.hp = 0;
        state.energy = Math.min(100, state.energy + obj.heal);
        state.score += 80;
        showMessage("Vida curada. Viene una nueva oleada. Vamos vamos tu puedes.", 5.4);
        finishFoodBreak(obj.waveId);
        burst(obj.x, obj.y - 20, "#f1c84f");
      }
      if (obj.life <= 0) {
        obj.hp = 0;
        showMessage("Viene una nueva oleada.", 3.2);
        finishFoodBreak(obj.waveId);
      }
      return;
    }

    if (obj.type === "mask" && !obj.picked && rectsOverlap(playerBox(), objectBox(obj))) {
      obj.picked = true;
      obj.hp = 0;
      state.maskPicked = true;
      state.energy = Math.min(100, state.energy + 10);
      state.score += 120;
      burst(obj.x, obj.y, "#87b667");
      return;
    }

    if (obj.type !== "shop" || obj.saved || obj.hp <= 0) return;
    if (Math.abs(player.x - obj.x) < 56) {
      obj.saved = true;
      state.saved += 1;
      state.energy = Math.min(100, state.energy + 12);
      state.score += 100;
      burst(obj.x, obj.y - 20, "#7bc878");
    }
  });
  state.objects = state.objects.filter((obj) => obj.hp > 0 || obj.type === "shop");
}

function finishFoodBreak(waveId) {
  if (waveSystem) return waveSystem.finishFoodBreak(waveId);
  if (!state.activeWave || state.activeWave.id !== waveId || !state.activeWave.waitingForFood) return;
  state.activeWave.waitingForFood = false;
  if (state.activeWave.queue.length > 0) {
    spawnWaveGroup(state.activeWave);
  }
}

function updateEffects(dt) {
  state.hitArcs.forEach((arc) => {
    arc.life -= dt;
  });
  state.particles.forEach((p) => {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 460 * dt;
    p.life -= dt;
  });
  state.hitArcs = state.hitArcs.filter((arc) => arc.life > 0);
  if (particlePool) {
    particlePool.releaseWhere((p) => p.life <= 0);
  } else {
    state.particles = state.particles.filter((p) => p.life > 0);
  }
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  drawBackground();
  drawWorld();
  drawEffects();
  drawPlayer();
  drawForeground();
  drawCooldown();
  drawStatus();
  drawMessage();
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

function drawBackground() {
  const bg = currentLevel().background;
  if (bg.complete && bg.naturalWidth > 0) {
    const sourceHeight = bg.naturalHeight;
    const sourceWidth = Math.min(bg.naturalWidth, canvas.width * (sourceHeight / canvas.height));
    const maxScroll = Math.max(1, world.width - canvas.width);
    const sourceX = (bg.naturalWidth - sourceWidth) * (world.cameraX / maxScroll);
    ctx.drawImage(bg, sourceX, 0, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    return;
  }

  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#1e73d8");
  sky.addColorStop(0.45, "#4d9be4");
  sky.addColorStop(1, "#7eb6d8");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawClouds();
  drawIllimani();
  drawHillside(0.16, 248, "#9f5a37", "#d4864d");
  drawHillside(0.3, 330, "#874b31", "#c37142");
  drawTeleferico();
  drawPowerLines();
}

function drawBackgroundSetDressing() {
  ctx.save();
  ctx.translate(-world.cameraX, 0);
  const start = Math.floor(world.cameraX / 900) * 900 - 900;
  const end = world.cameraX + canvas.width + 900;

  for (let x = start; x < end; x += 900) {
    const zone = Math.floor(x / 900);
    const variant = Math.abs(zone) % 4;
    if (variant === 0) {
      drawMarketStall(x + 90, world.ground - 102);
      drawMinibus(x + 530, world.ground - 72);
      drawStreetPost(x + 770, world.ground - 238);
    } else if (variant === 1) {
      drawWallMural(x + 80, world.ground - 152);
      drawMarketStall(x + 470, world.ground - 100);
      drawStreetPost(x + 705, world.ground - 238);
    } else if (variant === 2) {
      drawMinibus(x + 120, world.ground - 72);
      drawStepsFacade(x + 460, world.ground - 172);
      drawStreetPost(x + 820, world.ground - 238);
    } else {
      drawCableStation(x + 70, world.ground - 190);
      drawMarketStall(x + 610, world.ground - 102);
      drawMinibus(x + 760, world.ground - 72);
    }
  }

  ctx.restore();
}

function drawLongLandscapeDetails() {
  ctx.save();
  ctx.translate(-world.cameraX * 0.34, 0);
  const parallaxX = world.cameraX * 0.34;
  const start = Math.floor(parallaxX / 520) * 520 - 520;
  const end = parallaxX + canvas.width + 520;

  for (let x = start; x < end; x += 520) {
    const zone = Math.floor(x / 520);
    const baseY = 378 + (Math.abs(zone) % 3) * 16;
    drawDistantBlock(x + 30, baseY, zone);
  }

  ctx.restore();
}

function drawDistantBlock(x, y, zone) {
  const palettes = [
    ["#6f4734", "#b36a41", "#d9a45b"],
    ["#4f5f68", "#7a8b8e", "#d6c078"],
    ["#5a4438", "#9f5a37", "#6da48f"],
    ["#653f56", "#b05f64", "#d8a84f"],
  ];
  const palette = palettes[Math.abs(zone) % palettes.length];
  for (let i = 0; i < 7; i += 1) {
    const h = 36 + ((zone + i * 3) % 5) * 9;
    const w = 42 + ((zone + i) % 3) * 12;
    const bx = x + i * 62;
    px(bx, y - h, w, h, "#221815");
    px(bx + 3, y - h + 3, w - 6, h - 6, palette[i % palette.length]);
    px(bx + 10, y - h + 13, 8, 7, "#213443");
    px(bx + 26, y - h + 21, 9, 7, "#e0b458");
  }
}

function drawStreetPost(x, y) {
  px(x, y, 12, 238, "#211815");
  px(x + 3, y + 4, 6, 230, "#5a3a24");
  px(x - 22, y + 48, 58, 7, "#211815");
  px(x - 12, y + 74, 42, 6, "#211815");
  px(x + 16, y + 90, 19, 24, "#343a42");
}

function drawWallMural(x, y) {
  px(x - 8, y + 130, 270, 8, "rgba(0, 0, 0, 0.28)");
  px(x, y, 250, 132, "#1b1715");
  px(x + 5, y + 5, 240, 122, "#7f5030");
  px(x + 20, y + 18, 68, 50, "#2367a8");
  px(x + 92, y + 18, 62, 50, "#d94f35");
  px(x + 158, y + 18, 64, 50, "#e0b458");
  px(x + 24, y + 80, 198, 12, "#151515");
  px(x + 38, y + 99, 34, 22, "#253848");
  px(x + 94, y + 99, 34, 22, "#253848");
  px(x + 152, y + 99, 34, 22, "#253848");
}

function drawStepsFacade(x, y) {
  px(x - 10, y + 150, 286, 9, "rgba(0, 0, 0, 0.28)");
  px(x, y, 268, 150, "#161311");
  px(x + 5, y + 5, 258, 140, "#5d493d");
  for (let i = 0; i < 7; i += 1) {
    px(x + 16 + i * 32, y + 118 - i * 12, 58, 9, "#2a211d");
    px(x + 20 + i * 32, y + 112 - i * 12, 50, 7, "#b28a58");
  }
  px(x + 22, y + 23, 50, 35, "#263847");
  px(x + 96, y + 27, 54, 31, "#7aa08f");
  px(x + 176, y + 22, 48, 36, "#263847");
}

function drawCableStation(x, y) {
  px(x - 12, y + 168, 330, 9, "rgba(0, 0, 0, 0.28)");
  px(x, y + 45, 300, 120, "#161616");
  px(x + 8, y + 53, 284, 104, "#384553");
  px(x + 24, y + 67, 78, 44, "#203242");
  px(x + 116, y + 67, 78, 44, "#203242");
  px(x + 208, y + 67, 58, 44, "#203242");
  px(x + 12, y + 36, 280, 16, "#d94f35");
  px(x + 42, y + 15, 34, 26, "#f1c84f");
  px(x + 218, y + 14, 34, 27, "#2367a8");
  px(x + 128, y + 119, 44, 38, "#171717");
}

function drawIllimani() {
  const baseX = 260 - world.cameraX * 0.06;
  ctx.fillStyle = "#6b6d7c";
  ctx.beginPath();
  ctx.moveTo(baseX - 260, 300);
  ctx.lineTo(baseX - 72, 72);
  ctx.lineTo(baseX + 172, 300);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#edf4f7";
  ctx.beginPath();
  ctx.moveTo(baseX - 245, 300);
  ctx.lineTo(baseX - 72, 72);
  ctx.lineTo(baseX + 148, 300);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#b7c6d8";
  ctx.beginPath();
  ctx.moveTo(baseX - 71, 72);
  ctx.lineTo(baseX - 26, 300);
  ctx.lineTo(baseX + 48, 300);
  ctx.lineTo(baseX + 8, 154);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 9; i += 1) {
    const ridgeX = baseX - 178 + i * 34;
    ctx.beginPath();
    ctx.moveTo(ridgeX, 282);
    ctx.lineTo(baseX - 72 + i * 8, 92 + i * 7);
    ctx.lineTo(ridgeX + 10, 284);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = "#5e4f55";
  ctx.beginPath();
  ctx.moveTo(baseX - 260, 300);
  ctx.lineTo(baseX - 160, 230);
  ctx.lineTo(baseX - 68, 300);
  ctx.closePath();
  ctx.fill();
}

function drawHillside(rate, yBase, dark, light) {
  const start = -((world.cameraX * rate) % 44) - 44;
  const palette = [dark, light, "#b86a3f", "#d6a05b", "#6da48f", "#d2c16f"];
  for (let row = 0; row < 6; row += 1) {
    for (let x = start - row * 18; x < canvas.width + 80; x += 39) {
      const y = yBase - row * 24 + Math.sin((x + world.cameraX * rate) * 0.03 + row) * 13;
      const colorIndex = Math.abs(Math.floor((x + row * 47 + world.cameraX * rate) / 39)) % palette.length;
      px(x, y, 34, 25, "#3e2d25");
      px(x + 2, y + 2, 30, 21, palette[colorIndex]);
      px(x + 6, y + 7, 6, 6, "#243847");
      px(x + 19, y + 10, 7, 6, "#e0b458");
      if ((colorIndex + row) % 3 === 0) px(x + 2, y - 3, 30, 5, "#776454");
    }
  }
}

function drawClouds() {
  drawCloud(42 - world.cameraX * 0.03, 54, 1);
  drawCloud(265 - world.cameraX * 0.02, 38, 0.85);
  drawCloud(500 - world.cameraX * 0.025, 86, 0.75);
}

function drawCloud(x, y, scale) {
  const sx = ((x % 560) + 560) % 560 - 90;
  px(sx, y + 18 * scale, 96 * scale, 8 * scale, "rgba(255, 255, 255, 0.72)");
  px(sx + 8 * scale, y + 10 * scale, 26 * scale, 15 * scale, "#f4f8fb");
  px(sx + 28 * scale, y, 34 * scale, 25 * scale, "#ffffff");
  px(sx + 58 * scale, y + 8 * scale, 30 * scale, 17 * scale, "#edf3f8");
}

function drawTeleferico() {
  const y = 128;
  ctx.strokeStyle = "rgba(245, 225, 180, 0.72)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-20, y);
  ctx.lineTo(canvas.width + 20, y + 34);
  ctx.stroke();

  for (let i = 0; i < 4; i += 1) {
    const x = ((i * 150 + state.cableOffset - world.cameraX * 0.12) % 620) - 110;
    const cabinY = y + 8 + x * 0.05;
    ctx.fillStyle = i % 2 === 0 ? "#d94f35" : "#f1c84f";
    ctx.fillRect(x, cabinY, 28, 20);
    ctx.fillStyle = "#263447";
    ctx.fillRect(x + 5, cabinY + 5, 18, 8);
  }
}

function drawPowerLines() {
  const offset = -(world.cameraX * 0.18) % 260;
  ctx.strokeStyle = "#171717";
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.moveTo(-30, 70 + i * 28);
    ctx.quadraticCurveTo(180, 118 + i * 18, 430, 50 + i * 26);
    ctx.stroke();
  }

  for (let x = offset - 80; x < canvas.width + 120; x += 260) {
    px(x, 28, 17, 238, "#211815");
    px(x + 3, 32, 8, 230, "#5a3a24");
    px(x - 20, 76, 56, 7, "#211815");
    px(x - 12, 102, 40, 6, "#211815");
    px(x + 17, 118, 18, 24, "#343a42");
  }
}

function drawWorld() {
  ctx.save();
  ctx.translate(-world.cameraX, 0);

  drawStreet();
  state.objects.forEach(drawObject);
  state.gasClouds.forEach(drawGasCloud);
  state.projectiles.forEach(drawProjectile);
  state.enemies.forEach(drawEnemy);
  state.allies.forEach(drawAlly);

  ctx.restore();
}

function drawStreet() {
  px(0, world.ground - 10, world.width, 10, "rgba(0, 0, 0, 0.32)");
  px(0, world.ground, world.width, canvas.height - world.ground, "rgba(20, 20, 19, 0.18)");

  for (let x = 0; x < world.width; x += 180) {
    px(x + 30, world.ground + 30, 70, 5, "rgba(231, 194, 90, 0.42)");
  }
}

function drawMinibus(x, y) {
  px(x - 8, y + 31, 126, 10, "rgba(0, 0, 0, 0.34)");
  px(x, y, 112, 42, "#141414");
  px(x + 5, y + 5, 101, 31, "#f0eee4");
  px(x + 4, y + 28, 104, 10, "#2468bc");
  px(x + 12, y + 9, 20, 15, "#203242");
  px(x + 38, y + 9, 20, 15, "#203242");
  px(x + 64, y + 9, 20, 15, "#203242");
  px(x + 88, y + 11, 13, 13, "#203242");
  px(x + 9, y + 36, 17, 17, "#111");
  px(x + 82, y + 36, 17, 17, "#111");
  px(x + 13, y + 40, 9, 9, "#555");
  px(x + 86, y + 40, 9, 9, "#555");
  px(x + 108, y + 20, 8, 11, "#d8b24d");
}

function drawMarketStall(x, y) {
  px(x - 10, y + 47, 104, 8, "rgba(0, 0, 0, 0.34)");
  px(x - 4, y + 17, 86, 34, "#51321f");
  px(x, y + 21, 78, 27, "#7a4d2c");
  px(x - 10, y - 1, 102, 18, "#181512");
  for (let i = 0; i < 7; i += 1) {
    const color = ["#efc04f", "#c6382f", "#2f72aa", "#f0eee1"][i % 4];
    px(x - 8 + i * 15, y, 12, 16, color);
    px(x - 8 + i * 15, y + 13, 12, 4, "#181512");
  }
  px(x + 4, y + 24, 18, 12, "#e0b458");
  px(x + 27, y + 24, 20, 12, "#d94f35");
  px(x + 52, y + 23, 18, 13, "#5a9d55");
  px(x + 9, y + 27, 5, 5, "#f0d06a");
  px(x + 33, y + 27, 5, 5, "#f07145");
  px(x + 58, y + 27, 5, 5, "#84c66f");
  drawWovenBanner(x + 73, y + 18);
}

function drawWovenBanner(x, y) {
  px(x, y, 28, 38, "#243544");
  px(x + 3, y + 4, 22, 30, "#d36d39");
  px(x + 8, y + 9, 12, 8, "#2367a8");
  px(x + 6, y + 21, 17, 6, "#e2bd4e");
  px(x + 10, y + 29, 9, 5, "#5a9d55");
}

function drawPacenaShop(obj) {
  if (assets.pacenaKiosk.complete && assets.pacenaKiosk.naturalWidth > 0) {
    const width = 116;
    const height = 99;
    ctx.globalAlpha = obj.hp > 0 ? 1 : 0.35;
    ctx.drawImage(assets.pacenaKiosk, obj.x - width / 2, obj.y - 53, width, height);
    px(obj.x - 30, obj.y + 44, 60, 5, "#111");
    px(obj.x - 30, obj.y + 44, 60 * Math.max(0, obj.hp / 100), 5, "#71c879");
    ctx.globalAlpha = 1;
    return;
  }

  const x = obj.x - 42;
  const y = obj.y - 46;
  const saved = obj.saved;
  const wall = saved ? "#3f7356" : "#315c68";
  const trim = saved ? "#65a572" : "#4b8191";

  ctx.globalAlpha = obj.hp > 0 ? 1 : 0.35;
  px(x - 7, y + 9, 98, 79, "#151515");
  px(x - 3, y + 12, 90, 70, wall);
  px(x + 3, y + 17, 78, 14, trim);
  px(x + 9, y + 35, 24, 27, "#171717");
  px(x + 13, y + 39, 16, 22, "#ead9b6");
  px(x + 48, y + 36, 25, 18, "#171717");
  px(x + 51, y + 39, 19, 12, "#1f3545");

  px(x - 12, y - 2, 104, 16, "#191512");
  for (let i = 0; i < 7; i += 1) {
    const color = ["#efbd4f", "#d94f35", "#2367a8", "#f0eee1"][i % 4];
    px(x - 9 + i * 15, y, 12, 13, color);
  }

  px(x - 10, y + 53, 102, 22, "#4d2f1e");
  px(x - 5, y + 57, 21, 13, "#d9863a");
  px(x + 20, y + 57, 22, 13, "#d94f35");
  px(x + 47, y + 57, 20, 13, "#66a84f");
  px(x + 71, y + 56, 14, 14, "#e0b458");
  px(x + 1, y + 60, 5, 5, "#f1c84f");
  px(x + 27, y + 60, 5, 5, "#f06f3e");
  px(x + 53, y + 60, 5, 5, "#8fd06d");

  drawWovenBanner(x - 15, y + 33);
  px(obj.x - 30, obj.y + 44, 60, 5, "#111");
  px(obj.x - 30, obj.y + 44, 60 * Math.max(0, obj.hp / 100), 5, "#71c879");
  ctx.globalAlpha = 1;
}

function drawCharacterSprite(kind, x, footY, height, dir, moving = false) {
  const attackSheet = assets.attackSheets && assets.attackSheets[kind];
  if (kind === "hero" && player.attackTimer > 0 && attackSheet && attackSheet.complete && attackSheet.naturalWidth > 0) {
    const frameCount = 4;
    const frameW = attackSheet.naturalWidth / frameCount;
    const frameH = attackSheet.naturalHeight;
    const progress = 1 - player.attackTimer / 0.28;
    const frameIndex = clamp(Math.floor(progress * frameCount), 0, frameCount - 1);
    const width = height * (frameW / frameH);
    ctx.save();
    ctx.translate(x, footY);
    ctx.scale(dir, 1);
    ctx.drawImage(attackSheet, frameIndex * frameW, 0, frameW, frameH, -width / 2, -height, width, height);
    ctx.restore();
    return true;
  }

  if (!assets.characterCanvas) return false;
  const frame = spriteFrames[kind];
  if (!frame) return false;
  const width = height * (frame.w / frame.h);
  ctx.save();
  ctx.translate(x, footY);
  ctx.scale(dir, 1);
  ctx.drawImage(
    assets.characterCanvas,
    frame.x,
    frame.y,
    frame.w,
    frame.h,
    -width / 2,
    -height,
    width,
    height
  );
  ctx.restore();
  return true;
}

function spriteKindForEnemy(enemy) {
  if (enemy.type === "miner") return "miner";
  if (enemy.type === "mallku") return "mallku";
  if (enemy.type === "looter") return "looter";
  return "blocker";
}

function spriteHeightForEnemy(enemy) {
  if (enemy.type === "miner") return 138;
  if (enemy.type === "mallku") return 112;
  return 92;
}

function drawObject(obj) {
  if (obj.hp <= 0) return;
  if (obj.type === "barricade") {
    px(obj.x - obj.w / 2 - 4, obj.y - obj.h / 2 + 4, obj.w + 8, obj.h, "#191919");
    px(obj.x - obj.w / 2, obj.y - obj.h / 2, obj.w, obj.h, "#513729");
    px(obj.x - obj.w / 2 + 7, obj.y - 12, obj.w - 14, 8, "#d95d37");
    px(obj.x - obj.w / 2 + 12, obj.y + 6, obj.w - 24, 7, "#f1c451");
    px(obj.x - obj.w / 2 + 5, obj.y + 17, 15, 8, "#7f5030");
    strokePx(obj.x - obj.w / 2, obj.y - obj.h / 2, obj.w, obj.h, "#221812");
  }
  if (obj.type === "crate") {
    px(obj.x - obj.w / 2, obj.y - obj.h / 2, obj.w, obj.h, "#2b1b12");
    px(obj.x - obj.w / 2 + 3, obj.y - obj.h / 2 + 3, obj.w - 6, obj.h - 6, "#80512c");
    strokePx(obj.x - obj.w / 2 + 7, obj.y - obj.h / 2 + 7, obj.w - 14, obj.h - 14, "#3c2418");
  }
  if (obj.type === "shop") {
    drawPacenaShop(obj);
  }
  if (obj.type === "mask") {
    drawGasMask(obj.x, obj.y);
  }
  if (obj.type === "food-helper") {
    drawFoodHelper(obj);
  }
}

function drawFoodHelper(obj) {
  if (drawCharacterSprite("foodHelper", obj.x, obj.y + 40, 118, 1, true)) {
    return;
  }

  if (assets.foodHelper.complete && assets.foodHelper.naturalWidth > 0) {
    const height = 118;
    const width = height * (assets.foodHelper.naturalWidth / assets.foodHelper.naturalHeight);
    ctx.drawImage(assets.foodHelper, obj.x - width / 2, obj.y + 40 - height, width, height);
    return;
  }

  const x = obj.x;
  const footY = obj.y + 39;
  px(x - 31, footY - 4, 67, 9, "rgba(0, 0, 0, 0.38)");
  px(x - 24, footY - 105, 48, 16, "#141414");
  px(x - 18, footY - 111, 36, 15, "#141414");
  px(x - 14, footY - 108, 28, 10, "#5a2c24");
  px(x - 9, footY - 105, 18, 5, "#8f4b3c");
  px(x - 16, footY - 93, 32, 29, "#141414");
  px(x - 11, footY - 90, 22, 22, "#bd855f");
  px(x + 2, footY - 84, 8, 5, "#f0d0a1");
  px(x - 25, footY - 69, 50, 38, "#141414");
  px(x - 20, footY - 65, 40, 32, "#245f91");
  px(x - 15, footY - 60, 30, 9, "#5aa0ba");
  px(x - 18, footY - 49, 36, 7, "#e0b458");
  px(x - 34, footY - 34, 68, 36, "#141414");
  px(x - 29, footY - 31, 58, 29, "#8f2f53");
  px(x - 24, footY - 25, 48, 6, "#d98d42");
  px(x - 27, footY - 15, 54, 5, "#2367a8");
  px(x - 21, footY - 3, 15, 12, "#151515");
  px(x + 6, footY - 3, 15, 12, "#151515");
  px(x - 31, footY - 58, 13, 28, "#141414");
  px(x - 28, footY - 55, 8, 23, "#bd855f");
  px(x + 18, footY - 57, 13, 28, "#141414");
  px(x + 20, footY - 54, 8, 23, "#bd855f");
  px(x - 47, footY - 48, 31, 18, "#141414");
  px(x - 43, footY - 45, 23, 12, "#f1c84f");
  px(x - 39, footY - 52, 15, 8, "#8b5b31");
  px(x - 35, footY - 56, 9, 5, "#fff0c2");
  px(x - 8, footY - 82, 4, 4, "#151515");
  px(x + 4, footY - 82, 4, 4, "#151515");
  px(x - 5, footY - 75, 10, 3, "#7a382a");
}

function drawEnemy(enemy) {
  const dir = player.x > enemy.x ? 1 : -1;
  const moving = Math.abs(enemy.vx) > 6;
  if (drawCharacterSprite(spriteKindForEnemy(enemy), enemy.x, enemy.y + enemy.h / 2 + 1, spriteHeightForEnemy(enemy), dir, moving)) {
    drawEnemyHealthWorld(enemy);
    return;
  }

  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  ctx.scale(dir, 1);
  const bodyColor = {
    blocker: "#b74335",
    looter: "#3c6c74",
    mallku: "#6f3b8f",
    miner: "#574335",
  }[enemy.type] || "#b74335";

  const big = enemy.type === "miner";
  px(big ? -26 : -17, big ? 36 : 24, big ? 52 : 36, 8, "rgba(0, 0, 0, 0.35)");
  px(big ? -24 : -15, big ? -31 : -20, big ? 48 : 30, big ? 55 : 39, "#141414");
  px(big ? -20 : -12, big ? -27 : -17, big ? 40 : 24, big ? 48 : 33, bodyColor);
  px(big ? -14 : -10, big ? -23 : -14, big ? 28 : 20, 7, lighten(bodyColor));
  px(big ? -14 : -11, big ? -58 : -42, big ? 28 : 22, big ? 24 : 19, "#141414");
  px(big ? -11 : -9, big ? -55 : -39, big ? 22 : 18, big ? 19 : 15, "#c9966b");
  px(2, big ? -49 : -35, big ? 10 : 8, 4, "#f0e1bc");
  px(big ? -18 : -12, big ? 21 : 16, big ? 13 : 10, big ? 22 : 17, "#151515");
  px(big ? 5 : 3, big ? 21 : 16, big ? 14 : 10, big ? 22 : 17, "#151515");

  if (enemy.type === "blocker") {
    px(17, -19, 13, 12, "#6d6a61");
    px(19, -21, 8, 5, "#aaa392");
  }

  if (enemy.type === "looter") {
    px(12, -8, 22, 20, "#151515");
    px(15, -6, 16, 16, "#e8d2a2");
    px(19, -2, 8, 4, "#b88446");
  }

  if (enemy.type === "mallku") {
    ctx.strokeStyle = "#e0c25b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(10, -10);
    ctx.quadraticCurveTo(36, -26, 42, 2);
    ctx.stroke();
    px(-18, -31, 36, 6, "#e0c25b");
  }

  if (enemy.type === "miner") {
    px(-21, -67, 42, 10, "#151515");
    px(-17, -64, 34, 7, "#d8b34a");
    px(19, -16, 20, 9, "#d94f35");
    px(35, -14, 7, 5, "#f2c14e");
  }

  drawEnemyHealth(enemy);
  ctx.restore();
}

function drawAlly(ally) {
  const dir = state.enemies.find((enemy) => enemy.policeTarget && enemy.x > ally.x) ? 1 : -1;
  if (assets.policeAlly.complete && assets.policeAlly.naturalWidth > 0) {
    const height = 118;
    const width = height * (assets.policeAlly.naturalWidth / assets.policeAlly.naturalHeight);
    ctx.save();
    ctx.translate(ally.x, ally.y + ally.h / 2 + 1);
    ctx.scale(dir, 1);
    ctx.drawImage(assets.policeAlly, -width / 2, -height, width, height);
    ctx.restore();
    return;
  }
  ctx.save();
  ctx.translate(ally.x, ally.y);
  ctx.scale(dir, 1);
  px(-17, 24, 38, 8, "rgba(0, 0, 0, 0.34)");
  px(-14, -39, 28, 13, "#151515");
  px(-12, -37, 24, 8, "#274f7f");
  px(-10, -29, 20, 18, "#c9966b");
  px(2, -24, 8, 4, "#f0e1bc");
  px(-15, -12, 30, 35, "#172435");
  px(-12, -9, 24, 28, "#2f72aa");
  px(-12, -5, 24, 5, "#f0eee1");
  px(-17, -3, 8, 20, "#c9966b");
  px(10, -2, 9, 19, "#c9966b");
  px(-11, 22, 9, 19, "#151515");
  px(3, 22, 10, 19, "#151515");
  if (ally.attackTimer > 0.35) px(12, -8, 34, 6, "#2b1b12");
  ctx.restore();
}

function drawGasMask(x, y) {
  px(x - 18, y + 20, 36, 6, "rgba(0, 0, 0, 0.3)");
  px(x - 15, y - 16, 30, 25, "#1b241c");
  px(x - 11, y - 12, 9, 9, "#9ec5aa");
  px(x + 2, y - 12, 9, 9, "#9ec5aa");
  px(x - 5, y - 2, 10, 13, "#4e5d4d");
  px(x - 8, y + 9, 16, 7, "#252f27");
  px(x - 19, y - 4, 7, 15, "#263428");
  px(x + 12, y - 4, 7, 15, "#263428");
}

function drawEnemyHealthWorld(enemy) {
  if (enemy.type !== "miner" && enemy.hp <= 1) return;
  const width = enemy.type === "miner" ? 72 : 36;
  const maxHp = enemy.type === "miner" ? 12 : enemy.type === "mallku" ? 3 : 2;
  const y = enemy.y - spriteHeightForEnemy(enemy) + 8;
  px(enemy.x - width / 2, y, width, 6, "#181818");
  px(enemy.x - width / 2, y, width * Math.max(0, enemy.hp / maxHp), 6, enemy.type === "miner" ? "#d94f35" : "#f1c84f");
}

function lighten(color) {
  const map = {
    "#b74335": "#df6655",
    "#3c6c74": "#5e9aa3",
    "#6f3b8f": "#9b62bf",
    "#574335": "#7b604c",
  };
  return map[color] || color;
}

function drawEnemyHealth(enemy) {
  if (enemy.type !== "miner" && enemy.hp <= 1) return;
  const width = enemy.type === "miner" ? 54 : 28;
  const maxHp = enemy.type === "miner" ? 12 : enemy.type === "mallku" ? 3 : 2;
  ctx.fillStyle = "#181818";
  ctx.fillRect(-width / 2, enemy.type === "miner" ? -78 : -51, width, 5);
  ctx.fillStyle = enemy.type === "miner" ? "#d94f35" : "#f1c84f";
  ctx.fillRect(-width / 2, enemy.type === "miner" ? -78 : -51, width * Math.max(0, enemy.hp / maxHp), 5);
}

function drawProjectile(projectile) {
  if (projectile.type === "stone") {
    px(projectile.x - 8, projectile.y - 6, 14, 12, "#3e3b35");
    px(projectile.x - 5, projectile.y - 8, 10, 8, "#8b877b");
    px(projectile.x - 2, projectile.y - 7, 5, 3, "#b9b3a1");
    return;
  }

  ctx.save();
  ctx.translate(projectile.x, projectile.y);
  ctx.rotate(projectile.x * 0.08);
  px(-12, -6, 24, 12, "#151515");
  px(-9, -4, 18, 8, projectile.type === "gas" ? "#6c8f4d" : "#c4382b");
  px(7, -2, 8, 4, projectile.type === "gas" ? "#b8d17a" : "#f1c84f");
  ctx.restore();
}

function drawGasCloud(cloud) {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(0.42, cloud.life / 8));
  ctx.fillStyle = "#8fb46a";
  for (let i = 0; i < 7; i += 1) {
    const angle = i * 1.7 + cloud.life;
    const x = cloud.x + Math.cos(angle) * cloud.r * 0.28;
    const y = cloud.y + Math.sin(angle) * cloud.r * 0.16;
    ctx.beginPath();
    ctx.arc(x, y, cloud.r * (0.28 + (i % 3) * 0.04), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawPlayer() {
  const flicker = player.invincible > 0 && Math.floor(player.invincible * 20) % 2 === 0;
  if (flicker) return;

  const screenX = player.x - world.cameraX;
  const footY = player.y + player.h / 2 + 4;
  const moving = Math.abs(player.vx) > 8 && player.grounded;
  if (drawCharacterSprite("hero", screenX, footY, 104, player.dir, moving)) {
    if (state.maskPicked) {
      ctx.save();
      ctx.translate(screenX, player.y - 36);
      ctx.scale(player.dir, 1);
      px(-7, -7, 14, 10, "#1b241c");
      px(-5, -5, 4, 4, "#9ec5aa");
      px(1, -5, 4, 4, "#9ec5aa");
      px(-3, 2, 6, 8, "#4e5d4d");
      ctx.restore();
    }
    return;
  }

  ctx.save();
  ctx.translate(screenX, player.y);
  ctx.scale(player.dir, 1);
  px(-18, 24, 38, 8, "rgba(0, 0, 0, 0.38)");
  px(-17, -46, 34, 10, "#151515");
  px(-14, -43, 28, 8, "#e2b941");
  px(-11, -36, 22, 8, "#151515");
  px(-10, -34, 20, 18, "#c98d64");
  px(3, -29, 8, 4, "#f1d4a6");
  if (state.maskPicked) {
    px(-9, -33, 18, 11, "#1b241c");
    px(-7, -31, 5, 5, "#9ec5aa");
    px(2, -31, 5, 5, "#9ec5aa");
    px(-4, -23, 8, 7, "#4e5d4d");
  }
  px(-17, -19, 34, 40, "#101317");
  px(-13, -16, 26, 34, "#2f74a8");
  px(-10, -13, 20, 8, "#4a96c6");
  px(-18, -6, 9, 20, "#c98d64");
  px(10, -5, 10, 19, "#c98d64");
  px(-13, 20, 10, 20, "#151515");
  px(4, 20, 10, 20, "#151515");
  px(-16, 37, 14, 6, "#5b3a26");
  px(2, 37, 16, 6, "#5b3a26");

  if (player.attackTimer > 0) {
    ctx.strokeStyle = "#24170e";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(12, -8);
    ctx.quadraticCurveTo(48, -36, 82, -18);
    ctx.stroke();
    ctx.strokeStyle = "#8b5b31";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(12, -8);
    ctx.quadraticCurveTo(48, -36, 82, -18);
    ctx.stroke();
  } else {
    px(12, -5, 31, 7, "#3a2417");
    px(15, -7, 25, 4, "#8b5b31");
  }
  ctx.restore();
}

function drawEffects() {
  ctx.save();
  ctx.translate(-world.cameraX, 0);
  state.hitArcs.forEach((arc) => {
    const alpha = arc.life * 6;
    if (arc.type === "whip") {
      ctx.save();
      ctx.translate(arc.x, arc.y);
      ctx.scale(arc.dir, 1);
      ctx.strokeStyle = `rgba(31, 20, 12, ${alpha})`;
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(16, -4);
      ctx.quadraticCurveTo(78, -54, 136, -8);
      ctx.stroke();
      ctx.strokeStyle = `rgba(247, 200, 79, ${alpha})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(16, -4);
      ctx.quadraticCurveTo(78, -54, 136, -8);
      ctx.stroke();
      ctx.restore();
      return;
    }
    ctx.strokeStyle = `rgba(31, 20, 12, ${alpha})`;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(arc.x, arc.y, 38, -0.85, 0.85);
    ctx.stroke();
    ctx.strokeStyle = `rgba(247, 200, 79, ${alpha})`;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(arc.x, arc.y, 36, -0.85, 0.85);
    ctx.stroke();
  });
  state.particles.forEach((p) => {
    ctx.globalAlpha = Math.max(0, p.life * 3);
    px(p.x, p.y, 5, 5, p.color);
  });
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawForeground() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
  ctx.fillRect(0, 642, canvas.width, 48);
}

function drawCooldown() {
  const pct = 1 - player.attackCooldown / 0.52;
  ctx.fillStyle = "rgba(0, 0, 0, 0.44)";
  ctx.fillRect(246, 58, 112, 10);
  ctx.fillStyle = player.attackCooldown <= 0 ? "#f7c84f" : "#9b6b3f";
  ctx.fillRect(246, 58, 112 * clamp(pct, 0, 1), 10);
}

function drawStatus() {
  const minutes = Math.floor(state.elapsed / 60);
  const seconds = String(Math.floor(state.elapsed % 60)).padStart(2, "0");
  let text = `${minutes}:${seconds}`;
  if (state.activeWave) text = waveStatusText();
  if (state.finalStarted) text = state.enemies.some((enemy) => enemy.policeTarget) ? "Policia en apoyo" : "Ultimo minero: gas";
  if (state.maskPicked && !state.finalStarted) text = "Mascara equipada";

  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(30, 58, 150, 20);
  ctx.fillStyle = state.maskPicked ? "#b8d17a" : "#f3efe6";
  ctx.font = "12px Arial";
  ctx.fillText(text, 39, 73);
}

function drawMessage() {
  if (state.messageTimer <= 0 || !state.messageText) return;
  ctx.save();
  const alpha = Math.min(1, state.messageTimer / 0.35);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(15, 15, 14, 0.78)";
  ctx.fillRect(28, 92, canvas.width - 56, 56);
  ctx.strokeStyle = "rgba(247, 200, 79, 0.82)";
  ctx.lineWidth = 2;
  ctx.strokeRect(28, 92, canvas.width - 56, 56);
  ctx.fillStyle = "#fff4df";
  ctx.font = "12px Arial";
  wrapText(state.messageText, 42, 113, canvas.width - 84, 17);
  ctx.restore();
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  });
  if (line) ctx.fillText(line, x, y);
}

function waveStatusText() {
  if (!state.activeWave) return "";
  if (state.activeWave.phase === 0) return "Min 1: bloqueadores";
  if (state.activeWave.phase === 1) return "Min 2: saqueadores";
  return "Min 3: mallkus";
}

function playerBox() {
  return {
    x: player.x - player.w / 2,
    y: player.y - player.h / 2,
    w: player.w,
    h: player.h,
  };
}

function enemyBox(enemy) {
  return {
    x: enemy.x - enemy.w / 2,
    y: enemy.y - enemy.h / 2,
    w: enemy.w,
    h: enemy.h,
  };
}

function objectBox(obj) {
  return {
    x: obj.x - obj.w / 2,
    y: obj.y - obj.h / 2,
    w: obj.w,
    h: obj.h,
  };
}

function rectsOverlap(a, b) {
  if (coreMath) return coreMath.rectsOverlap(a, b);
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function circleRect(circle, rect) {
  if (coreMath) return coreMath.circleRect(circle, rect);
  const nearestX = clamp(circle.x, rect.x, rect.x + rect.w);
  const nearestY = clamp(circle.y, rect.y, rect.y + rect.h);
  return Math.hypot(circle.x - nearestX, circle.y - nearestY) <= circle.r;
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
  if (coreMath) return coreMath.clamp(value, min, max);
  return Math.max(min, Math.min(max, value));
}

draw();
