export function createBackgroundRenderer({
  ctx,
  canvas,
  state,
  world,
  currentLevel,
  px,
}) {
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
        px(x + 22, y + 12, 6, 5, "#e0b458");
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

  return {
    drawBackground,
  };
}

