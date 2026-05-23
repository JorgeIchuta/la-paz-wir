export function createHudRenderer({
  ctx,
  canvas,
  state,
  player,
  clamp,
  waveStatusText,
}) {
  function drawCooldown() {
    const pct = 1 - player.attackCooldown / 0.52;
    ctx.fillStyle = "rgba(0, 0, 0, 0.44)";
    ctx.fillRect(246, 58, 112, 10);
    ctx.fillStyle = player.attackCooldown <= 0 ? "#f7c84f" : "#9b6b3f";
    ctx.fillRect(246, 58, 112 * clamp(pct, 0, 1), 10);
  }

  function drawStatus() {
    const minutes = Math.floor(state.elapsed / 60);
    const seconds = String(Math.floor(state.elapsed % 60)).padStart(2, "0");
    let text = `${minutes}:${seconds}`;
    if (state.activeWave) text = waveStatusText();
    if (state.finalStarted) text = state.enemies.some((enemy) => enemy.policeTarget) ? "Policia en apoyo" : "Ultimo minero: gas";
    if (state.maskPicked && !state.finalStarted) text = "Mascara equipada";

    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.fillRect(30, 58, 150, 20);
    ctx.fillStyle = state.maskPicked ? "#b8d17a" : "#f3efe6";
    ctx.font = "12px Arial";
    ctx.fillText(text, 39, 73);
  }

  function drawMessage() {
    if (state.messageTimer <= 0 || !state.messageText) return;
    ctx.save();
    const alpha = Math.min(1, state.messageTimer / 0.35);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(15, 15, 14, 0.78)";
    ctx.fillRect(28, 92, canvas.width - 56, 56);
    ctx.strokeStyle = "rgba(247, 200, 79, 0.82)";
    ctx.lineWidth = 2;
    ctx.strokeRect(28, 92, canvas.width - 56, 56);
    ctx.fillStyle = "#fff4df";
    ctx.font = "12px Arial";
    wrapText(state.messageText, 42, 113, canvas.width - 56, 18);
    ctx.restore();
  }

  function wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        line = word;
        y += lineHeight;
      } else {
        line = test;
      }
    });
    if (line) ctx.fillText(line, x, y);
  }

  return {
    drawCooldown,
    drawStatus,
    drawMessage,
    wrapText,
  };
}

