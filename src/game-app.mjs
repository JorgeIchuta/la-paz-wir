import { bootstrapBrowserGame } from "./app/bootstrap.mjs";
import { createGame } from "./app/create-game.mjs";
import { createGameLoop } from "./app/game-loop.mjs";

const browser = bootstrapBrowserGame();
const game = await createGame(browser);
const loop = createGameLoop({
  update: game.update,
  draw: game.draw,
  isRunning: game.isRunning,
});

browser.startButton.addEventListener("click", () => {
  browser.gamePanel.classList.add("is-playing");
  game.reset();
  loop.start();
});
