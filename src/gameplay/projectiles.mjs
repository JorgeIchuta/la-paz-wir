export function createProjectileSystem({
  state,
  player,
  world,
  canvas,
  projectilePool,
  circleRect,
  playerBox,
  hitPlayer,
  burst,
}) {
  function throwProjectile(enemy, type) {
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
    if (projectilePool()) {
      projectilePool().acquire(projectile);
    } else {
      state.projectiles.push(projectile);
    }
  }

  function updateProjectiles(dt) {
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
    if (projectilePool()) {
      projectilePool().releaseWhere(shouldRemoveProjectile);
    } else {
      state.projectiles = state.projectiles.filter((projectile) => !shouldRemoveProjectile(projectile));
    }
  }

  function releaseGas(projectile) {
    burst(projectile.x, projectile.y - 12, "#8fb46a");
    // Gas is capped because each cloud checks player overlap every frame.
    if (state.gasClouds.length >= 4) state.gasClouds.shift();
    state.gasClouds.push({
      x: projectile.x,
      y: world.ground - 56,
      r: 86,
      life: 4.4,
      damage: projectile.damage,
    });
  }

  function updateGasClouds(dt) {
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

  return {
    throwProjectile,
    updateProjectiles,
    releaseGas,
    updateGasClouds,
    explode,
  };
}
