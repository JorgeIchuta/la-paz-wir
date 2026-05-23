export function createGameLoop({ update, draw, isRunning }) {
  let frameId = 0;
  let lastTime = 0;

  function tick(time) {
    if (!isRunning()) {
      frameId = 0;
      return;
    }

    const dt = lastTime > 0 ? Math.min((time - lastTime) / 1000, 0.033) : 0;
    lastTime = time;
    update(dt);
    draw();
    frameId = requestAnimationFrame(tick);
  }

  function start() {
    stop();
    lastTime = performance.now();
    frameId = requestAnimationFrame(tick);
  }

  function stop() {
    if (!frameId) return;
    cancelAnimationFrame(frameId);
    frameId = 0;
  }

  return { start, stop };
}