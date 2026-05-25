import { bootstrapBrowserGame } from "./app/bootstrap.mjs";
import { createGame } from "./app/create-game.mjs";
import { createGameLoop } from "./app/game-loop.mjs";
import { createAudioManager } from "./audio/audio-manager.mjs";

const browser = bootstrapBrowserGame();
const audio = createAudioManager();
audio.preloadAll();
const game = await createGame(browser, { audio });
const loop = createGameLoop({
  update: game.update,
  draw: game.draw,
  isRunning: game.isRunning,
});

bindAudioControls();

browser.startButton.addEventListener("click", () => {
  browser.gamePanel.classList.add("is-playing");
  audio.unlock().then(() => {
    audio.stopMusic();
    audio.stopAmbience();
    audio.playMusic("level1");
    audio.playAmbience("city");
  });
  game.reset();
  loop.start();
});

function bindAudioControls() {
  const settings = audio.getSettings();
  browser.musicVolumeEl.value = String(Math.round(settings.musicVolume * 100));
  browser.sfxVolumeEl.value = String(Math.round(settings.sfxVolume * 100));
  updateMuteButton(settings.muted);

  browser.muteButton.addEventListener("click", () => {
    const nextMuted = !audio.getSettings().muted;
    audio.setMuted(nextMuted);
    updateMuteButton(nextMuted);
  });

  browser.musicVolumeEl.addEventListener("input", () => {
    audio.setMusicVolume(Number(browser.musicVolumeEl.value) / 100);
  });

  browser.sfxVolumeEl.addEventListener("input", () => {
    audio.setSfxVolume(Number(browser.sfxVolumeEl.value) / 100);
  });
}

function updateMuteButton(muted) {
  browser.muteButton.textContent = muted ? "Audio off" : "Audio";
  browser.muteButton.setAttribute("aria-pressed", String(muted));
}
