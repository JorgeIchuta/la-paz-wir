export function createCombatSystem({
  state,
  player,
  input,
  rectsOverlap,
  enemyBox,
  objectBox,
  burst,
  weaponConfig,
  playerTuning,
  enemyConfig,
}) {
  function maybeAttack() {
    if (!input.attack || player.attackCooldown > 0) return;
    const weapon = weaponConfig();
    player.attackCooldown = weapon.cooldown;
    player.attackTimer = weapon.activeTime;

    // The melee hitbox is intentionally offset forward from the actor center to match the whip arc.
    const hit = {
      x: player.dir > 0 ? player.x + 14 : player.x - weapon.range - 14,
      y: player.y - 18,
      w: weapon.range,
      h: weapon.height,
    };
    state.hitArcs.push({ x: player.x, y: player.y - 18, dir: player.dir, life: weapon.activeTime, type: "whip" });

    state.enemies.forEach((enemy) => {
      if (!rectsOverlap(hit, enemyBox(enemy))) return;
      enemy.hp -= weapon.damage;
      enemy.vx = player.dir * weapon.knockback;
      enemy.vy = -120;
      burst(enemy.x, enemy.y, "#f5c84f");
    });

    state.objects.forEach((obj) => {
      if (obj.hp <= 0 || obj.type === "shop") return;
      if (!rectsOverlap(hit, objectBox(obj))) return;
      obj.hp -= weapon.damage;
      if (obj.hp <= 0) state.score += objectScore(obj);
      burst(obj.x, obj.y, "#d9863a");
    });

    state.enemies = state.enemies.filter((enemy) => {
      if (enemy.hp > 0) return true;
      state.score += enemyConfig(enemy.type)?.score ?? 5;
      burst(enemy.x, enemy.y, "#7bc878");
      return false;
    });
  }

  function objectScore(obj) {
    if (obj.type === "barricade") return 2;
    if (obj.type === "crate") return 1;
    return 0;
  }

  function hitPlayer(damage, knockback) {
    if (player.invincible > 0) return;
    state.energy -= damage;
    player.invincible = playerTuning.invincibleSeconds;
    player.vx = knockback;
    burst(player.x, player.y, "#d94f35");
  }

  return {
    maybeAttack,
    hitPlayer,
  };
}
