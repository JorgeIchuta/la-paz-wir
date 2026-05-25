export function bootstrapBrowserGame() {
  const canvas = document.querySelector("#game");
  const gamePanel = document.querySelector(".game-panel");
  if (!canvas) {
    throw new Error("Game canvas #game was not found.");
  }
  if (!gamePanel) {
    throw new Error("Game panel .game-panel was not found.");
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("2D canvas context is not available.");
  }

  const scoreEl = document.querySelector("#score");
  const lifeBarEl = document.querySelector("#lifeBar");
  const lifeValueEl = document.querySelector("#lifeValue");
  const overlay = document.querySelector("#overlay");
  const startButton = document.querySelector("#startButton");

  const required = { scoreEl, lifeBarEl, lifeValueEl, overlay, startButton };
  Object.entries(required).forEach(([name, element]) => {
    if (!element) throw new Error(`Required game UI element ${name} was not found.`);
  });

  return { canvas, ctx, gamePanel, scoreEl, lifeBarEl, lifeValueEl, overlay, startButton };
}
