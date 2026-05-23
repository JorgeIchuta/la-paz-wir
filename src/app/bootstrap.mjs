export function bootstrapBrowserGame() {
  const canvas = document.querySelector("#game");
  if (!canvas) {
    throw new Error("Game canvas #game was not found.");
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D canvas context is not available.");
  }

  const scoreEl = document.querySelector("#score");
  const energyEl = document.querySelector("#energy");
  const shopsEl = document.querySelector("#shops");
  const overlay = document.querySelector("#overlay");
  const startButton = document.querySelector("#startButton");

  const required = { scoreEl, energyEl, shopsEl, overlay, startButton };
  Object.entries(required).forEach(([name, element]) => {
    if (!element) throw new Error(`Required game UI element ${name} was not found.`);
  });

  return { canvas, ctx, scoreEl, energyEl, shopsEl, overlay, startButton };
}