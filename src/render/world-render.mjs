export function createWorldRenderer({ ctx, canvas, world, px }) {
  function drawStreet() {
    px(0, world.ground - 10, world.width, 10, "rgba(0, 0, 0, 0.32)");
    px(0, world.ground, world.width, canvas.height - world.ground, "rgba(20, 20, 19, 0.18)");

    for (let x = 0; x < world.width; x += 180) {
      px(x + 30, world.ground + 30, 70, 5, "rgba(231, 194, 90, 0.42)");
    }
  }

  function drawForeground() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.22)";
    ctx.fillRect(0, 642, canvas.width, 48);
  }

  return {
    drawStreet,
    drawForeground,
  };
}
