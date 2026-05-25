export function createGameUi({ scoreEl, lifeBarEl, lifeValueEl, overlay, startButton }) {
  function updateHud({ score, energy, maxEnergy }) {
    scoreEl.textContent = Math.floor(score);
    updateLifeHud(energy, maxEnergy);
  }

  function updateLifeHud(energy, maxEnergy) {
    const current = Math.max(0, Math.floor(energy));
    const max = Math.max(1, Math.floor(maxEnergy || 100));
    const pct = Math.max(0, Math.min(1, current / max));
    lifeValueEl.textContent = `${current}/${max}`;
    lifeBarEl.style.width = `${Math.round(pct * 100)}%`;
    lifeBarEl.style.backgroundColor = lifeColor(pct);
    lifeBarEl.parentElement.setAttribute("aria-valuemax", String(max));
    lifeBarEl.parentElement.setAttribute("aria-valuenow", String(current));
  }

  function lifeColor(pct) {
    if (pct > 0.6) return blendColor("#f1c84f", "#49c65a", (pct - 0.6) / 0.4);
    if (pct > 0.3) return blendColor("#e8782e", "#f1c84f", (pct - 0.3) / 0.3);
    if (pct > 0.15) return blendColor("#d94f35", "#e8782e", (pct - 0.15) / 0.15);
    return "#d94f35";
  }

  function blendColor(from, to, amount) {
    const t = Math.max(0, Math.min(1, amount));
    const a = hexToRgb(from);
    const b = hexToRgb(to);
    return `rgb(${Math.round(a.r + (b.r - a.r) * t)}, ${Math.round(a.g + (b.g - a.g) * t)}, ${Math.round(a.b + (b.b - a.b) * t)})`;
  }

  function hexToRgb(hex) {
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    };
  }

  function hideOverlay() {
    overlay.classList.add("is-hidden");
  }

  function showEndScreen({ title, mapName, score }) {
    overlay.classList.remove("is-hidden");
    overlay.querySelector("h1").textContent = title;
    overlay.querySelector("p").textContent = `Mapa: ${mapName}. Puntos: ${Math.floor(score)}.`;
    startButton.textContent = "Reintentar";
  }

  return {
    updateHud,
    hideOverlay,
    showEndScreen,
  };
}
