export function createEnemiesRuntime({
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
}) {
  function currentGateX() {
    if (state.finalStarted && state.enemies.some((enemy) => enemy.type === "miner")) {
      return currentLevel()?.bossGateX ?? world.width - 1880;
    }
    return null;
  }

  function updateFinalEncounter() {
    if (state.finalStarted) return;
    const level = currentLevel();
    const reachedBossByPosition = Number.isFinite(level?.bossTriggerX) && player.x >= level.bossTriggerX;
    const reachedBossByTime = !Number.isFinite(level?.bossTriggerX) && state.elapsed >= (level?.bossTriggerSeconds ?? 180);
    // Position-based boss starts make authored levels reliable, while the old time trigger remains a fallback.
    if (!reachedBossByPosition && !reachedBossByTime) return;
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
      if (enemy.type === "miner" || enemy.type === "minerScout") {
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

  return {
    currentGateX,
    updateFinalEncounter,
    enemySpeed,
    updateEnemies,
    updateAllies,
    chooseEnemyTarget,
    updateBlocker,
    updateMiner,
  };
}
