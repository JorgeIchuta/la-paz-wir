export function createCombatSystem({
  state,
  player,
  input,
  rectsOverlap,
  enemyBox,
  objectBox,
  burst,
}) {
  function maybeAttack() {
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

  function hitPlayer(damage, knockback) {
    if (player.invincible > 0) return;
    state.energy -= damage;
    player.invincible = 0.7;
    player.vx = knockback;
    burst(player.x, player.y, "#d94f35");
  }

  return {
    maybeAttack,
    hitPlayer,
  };
}

