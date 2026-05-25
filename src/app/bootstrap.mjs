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
  const timeValueEl = document.querySelector("#timeValue");
  const attackCooldownBarEl = document.querySelector("#attackCooldownBar");
  const overlay = document.querySelector("#overlay");
  const startButton = document.querySelector("#startButton");
  const muteButton = document.querySelector("#muteButton");
  const musicVolumeEl = document.querySelector("#musicVolume");
  const sfxVolumeEl = document.querySelector("#sfxVolume");

  const required = {
    scoreEl,
    lifeBarEl,
    lifeValueEl,
    timeValueEl,
    attackCooldownBarEl,
    overlay,
    startButton,
    muteButton,
    musicVolumeEl,
    sfxVolumeEl,
  };
  Object.entries(required).forEach(([name, element]) => {
    if (!element) throw new Error(`Required game UI element ${name} was not found.`);
  });

  return {
    canvas,
    ctx,
    gamePanel,
    scoreEl,
    lifeBarEl,
    lifeValueEl,
    timeValueEl,
    attackCooldownBarEl,
    overlay,
    startButton,
    muteButton,
    musicVolumeEl,
    sfxVolumeEl,
  };
}
