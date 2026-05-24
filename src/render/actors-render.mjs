export function createActorsRenderer({
  ctx,
  state,
  player,
  world,
  assets,
  px,
  drawCharacterSprite,
  spriteKindForEnemy,
  spriteHeightForEnemy,
  renderTuning,
}) {
  function footOffset(kind) {
    return renderTuning?.actorFootOffsets?.[kind] ?? 0;
  }

  function spriteHeight(kind, fallback) {
    return renderTuning?.actorSpriteHeights?.[kind] ?? fallback;
  }

  function drawPlayer() {
    const flicker = player.invincible > 0 && Math.floor(player.invincible * 20) % 2 === 0;
    if (flicker) return;

    const screenX = player.x - world.cameraX;
    const footY = player.y + player.h / 2 + 4 + footOffset("hero");
    const moving = Math.abs(player.vx) > 8 && player.grounded;
    if (drawCharacterSprite("hero", screenX, footY, spriteHeight("hero", 104), player.dir, moving)) {
      if (state.maskPicked) drawEquippedMask(screenX, player.y - 36, player.dir);
      return;
    }

    ctx.save();
    ctx.translate(screenX, player.y + footOffset("hero"));
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

  function drawEnemy(enemy) {
    const dir = player.x > enemy.x ? 1 : -1;
    const moving = Math.abs(enemy.vx) > 6;
    const kind = spriteKindForEnemy(enemy);
    const offset = footOffset(kind);
    if (drawCharacterSprite(kind, enemy.x, enemy.y + enemy.h / 2 + 1 + offset, spriteHeightForEnemy(enemy), dir, moving)) {
      drawEnemyHealthWorld(enemy);
      return;
    }

    ctx.save();
    ctx.translate(enemy.x, enemy.y + offset);
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
    const offset = footOffset("police");
    if (assets.policeAlly.complete && assets.policeAlly.naturalWidth > 0) {
      const height = spriteHeight("police", 118);
      const width = height * (assets.policeAlly.naturalWidth / assets.policeAlly.naturalHeight);
      ctx.save();
      ctx.translate(ally.x, ally.y + ally.h / 2 + 1 + offset);
      ctx.scale(dir, 1);
      ctx.drawImage(assets.policeAlly, -width / 2, -height, width, height);
      ctx.restore();
      return;
    }
    ctx.save();
    ctx.translate(ally.x, ally.y + offset);
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

  function drawEnemyHealthWorld(enemy) {
    if (enemy.type !== "miner" && enemy.hp <= 1) return;
    const kind = spriteKindForEnemy(enemy);
    const offset = footOffset(kind);
    const width = enemy.type === "miner" ? 72 : 36;
    const maxHp = enemy.type === "miner" ? 12 : enemy.type === "mallku" ? 3 : 2;
    const y = enemy.y + offset - spriteHeightForEnemy(enemy) + 8;
    px(enemy.x - width / 2, y, width, 6, "#181818");
    px(enemy.x - width / 2, y, width * Math.max(0, enemy.hp / maxHp), 6, enemy.type === "miner" ? "#d94f35" : "#f1c84f");
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

  function drawEquippedMask(x, y, dir) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(dir, 1);
    px(-7, -7, 14, 10, "#1b241c");
    px(-5, -5, 4, 4, "#9ec5aa");
    px(1, -5, 4, 4, "#9ec5aa");
    px(-3, 2, 6, 8, "#4e5d4d");
    ctx.restore();
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

  return {
    drawPlayer,
    drawEnemy,
    drawAlly,
  };
}
