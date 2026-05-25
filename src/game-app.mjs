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

const initialOverlayTitle = browser.overlay.querySelector("h1").textContent;
const initialOverlayText = browser.overlay.querySelector("p").textContent;
let startPending = false;

browser.startButton.addEventListener("click", async () => {
  if (startPending) return;
  startPending = true;
  setStartLoading();

  const audioUnlock = audio.unlock().catch((error) => {
    console.error(error);
    return false;
  });
  try {
    await game.waitUntilReady();
    audioUnlock.then((unlocked) => {
      if (!unlocked) return;
      audio.stopMusic();
      audio.stopAmbience();
      audio.playMusic("level1");
      audio.playAmbience("city");
    });

    browser.gamePanel.classList.add("is-playing");
    resetStartButton();
    game.reset();
    loop.start();
  } catch (error) {
    console.error(error);
    setStartError();
  } finally {
    startPending = false;
  }
});

function bindAudioControls() {
  const settings = audio.getSettings();
  browser.musicVolumeEl.value = String(Math.round(settings.musicVolume * 100));
  browser.sfxVolumeEl.value = String(Math.round(settings.sfxVolume * 100));
  updateMuteButton(settings.muted);
  lockRangeKeyboardAdjustment(browser.musicVolumeEl);
  lockRangeKeyboardAdjustment(browser.sfxVolumeEl);

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

function setStartLoading() {
  browser.gamePanel.classList.add("is-loading");
  browser.overlay.querySelector("h1").textContent = initialOverlayTitle;
  browser.overlay.querySelector("p").textContent = "Cargando imagenes del juego...";
  browser.startButton.textContent = "Cargando...";
  browser.startButton.disabled = true;
  browser.startButton.setAttribute("aria-busy", "true");
}

function setStartError() {
  browser.gamePanel.classList.remove("is-loading");
  browser.overlay.querySelector("h1").textContent = "No se pudo cargar";
  browser.overlay.querySelector("p").textContent = "Revisa la conexion y vuelve a intentar.";
  browser.startButton.textContent = "Reintentar";
  browser.startButton.disabled = false;
  browser.startButton.removeAttribute("aria-busy");
}

function resetStartButton() {
  browser.gamePanel.classList.remove("is-loading");
  browser.overlay.querySelector("h1").textContent = initialOverlayTitle;
  browser.overlay.querySelector("p").textContent = initialOverlayText;
  browser.startButton.textContent = "Jugar";
  browser.startButton.disabled = false;
  browser.startButton.removeAttribute("aria-busy");
}

function lockRangeKeyboardAdjustment(rangeEl) {
  const blockedKeys = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]);
  rangeEl.addEventListener("keydown", (event) => {
    if (!blockedKeys.has(event.key)) return;
    event.preventDefault();
  });
}
