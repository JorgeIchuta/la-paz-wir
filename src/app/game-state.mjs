export function createWorldState() {
  return {
    width: 30000,
    ground: 590,
    cameraX: 0,
  };
}

export function createPlayerState() {
  return {
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
}

export function createInitialState() {
  return {
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
    levelIndex: 0,
  };
}

export function resetRuntimeState({
  state,
  player,
  world,
  level,
  objects,
  waves,
  tuning,
}) {
  state.running = true;
  state.lastTime = performance.now();
  state.score = 0;
  state.energy = tuning?.startingEnergy ?? 100;
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
  state.gasClouds = [];
  state.objects = objects;
  state.waves = waves;
  state.hitArcs = [];
  state.particles = [];
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
}
