export function createGameUi({ scoreEl, energyEl, shopsEl, overlay, startButton }) {
  function updateHud({ score, energy, saved }) {
    scoreEl.textContent = Math.floor(score);
    energyEl.textContent = Math.max(0, Math.floor(energy));
    shopsEl.textContent = saved;
  }

  function hideOverlay() {
    overlay.classList.add("is-hidden");
  }

  function showEndScreen({ title, mapName, score, saved, totalShops }) {
    overlay.classList.remove("is-hidden");
    overlay.querySelector("h1").textContent = title;
    overlay.querySelector("p").textContent = `Mapa: ${mapName}. Puntos: ${Math.floor(score)}. Negocios protegidos: ${saved}/${totalShops}.`;
    startButton.textContent = "Reintentar";
  }

  return {
    updateHud,
    hideOverlay,
    showEndScreen,
  };
}

