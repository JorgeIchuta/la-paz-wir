export function createHudRenderer({
  ctx,
  canvas,
  state,
}) {
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
    drawMessage,
    wrapText,
  };
}

