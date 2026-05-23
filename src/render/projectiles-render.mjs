export function createProjectilesRenderer({ ctx, px }) {
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

  return {
    drawProjectile,
    drawGasCloud,
  };
}
