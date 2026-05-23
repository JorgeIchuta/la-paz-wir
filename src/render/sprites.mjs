export function createSpriteRenderer({ ctx, assets, spriteFrames, player, clamp }) {
  function drawCharacterSprite(kind, x, footY, height, dir) {
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

  return {
    drawCharacterSprite,
    spriteKindForEnemy,
    spriteHeightForEnemy,
  };
}
