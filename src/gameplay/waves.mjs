export function createWaveSystem({
  state,
  player,
  world,
  canvas,
  clamp,
  burst,
  showMessage,
  enemyConfig,
  enemySpeed,
  audio,
}) {
  function makeWaves(level) {
    if (!Array.isArray(level?.encounters)) return [];
    return level.encounters.map((encounter) => ({
      ...encounter,
      groups: encounter.groups.map((group) => [...group]),
      nextGroup: 0,
      cleared: false,
      started: false,
    }));
  }

  function waveEnemies(index) {
    if (index === 0) {
      return ["blocker", "blocker", "blocker", "blocker", "blocker", "blocker", "blocker", "blocker", "blocker", "blocker"];
    }
    if (index === 1) {
      return ["blocker", "looter", "blocker", "looter", "blocker", "looter", "blocker", "looter", "blocker", "looter"];
    }
    return ["mallku", "mallku", "mallku", "mallku", "mallku", "mallku", "blocker", "looter", "mallku", "mallku"];
  }

  function updateWaves() {
    if (state.finalStarted || state.wavePause > 0) return;
    if (hasFoodHelper()) return;
    if (state.activeWave) {
      const alive = state.enemies.some((enemy) => enemy.waveId === state.activeWave.id);
      if (!alive) {
        if (hasMoreGroups(state.activeWave)) {
          spawnWaveGroup(state.activeWave);
        } else {
          state.activeWave.cleared = true;
          state.activeWave = null;
          state.wavePause = 1.1;
          state.nextWaveX = player.x + 720;
          state.score += 5;
          burst(player.x + 36, player.y - 20, "#7bc878");
        }
      }
      return;
    }

    const encounter = nextReadyEncounter();
    if (encounter) {
      // Encounters advance by position so Level 1 pacing stays deterministic across player skill levels.
      encounter.started = true;
      state.activeWave = encounter;
      spawnWaveGroup(encounter);
      state.waveIndex += 1;
      return;
    }

    if (state.elapsed < 4) return;
    if (state.waves.length > 0) return;

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
      groups: null,
      nextGroup: 0,
      waitingForFood: false,
    };
    wave.released = true;
    state.activeWave = wave;
    spawnWaveGroup(wave);
    state.waveIndex += 1;
  }

  function nextReadyEncounter() {
    const triggerLead = 320;
    return state.waves.find((wave) => !wave.started && !wave.cleared && player.x >= wave.triggerX - (wave.triggerLead ?? triggerLead));
  }

  function hasMoreGroups(wave) {
    if (Array.isArray(wave.groups)) return wave.nextGroup < wave.groups.length;
    return wave.queue.length > 0;
  }

  function updateSupportMoment() {
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
    return state.objects.some((obj) => obj.type === "food-helper" && obj.hp > 0);
  }

  function spawnWaveGroup(wave) {
    const group = nextSpawnGroup(wave);
    if (group.length === 0) return;
    state.waveGroup += 1;
    audio?.playSfx("waveStart", { volume: 0.5 });
    group.forEach((type, index) => {
      const offsets = wave.spawnOffsets ?? (Array.isArray(wave.groups) ? [220, 360, 500, 640] : [-180, 105, 245, 360]);
      spawnWaveEnemy(type, player.x + offsets[index], wave.id);
    });
  }

  function nextSpawnGroup(wave) {
    if (Array.isArray(wave.groups)) {
      const group = wave.groups[wave.nextGroup] || [];
      wave.nextGroup += 1;
      return group;
    }
    const count = Math.min(4, wave.queue.length);
    return wave.queue.splice(0, count);
  }

  function spawnFoodHelper() {
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

  function finishFoodBreak(waveId) {
    if (!state.activeWave || state.activeWave.id !== waveId || !state.activeWave.waitingForFood) return;
    state.activeWave.waitingForFood = false;
    if (hasMoreGroups(state.activeWave)) {
      spawnWaveGroup(state.activeWave);
    }
  }

  function currentGateX() {
    if (!state.activeWave?.gate) return null;
    return state.activeWave.triggerX + (state.activeWave.gateOffset ?? 620);
  }

  return {
    makeWaves,
    waveEnemies,
    updateWaves,
    updateSupportMoment,
    hasFoodHelper,
    spawnWaveGroup,
    spawnFoodHelper,
    spawnWaveEnemy,
    finishFoodBreak,
    currentGateX,
  };
}
