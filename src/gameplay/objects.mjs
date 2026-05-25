export function createObjectSystem({
  state,
  player,
  rectsOverlap,
  playerBox,
  objectBox,
  showMessage,
  finishFoodBreak,
  burst,
  playerTuning,
  audio,
}) {
  const maxEnergy = playerTuning?.maxEnergy ?? 100;

  function buildLevelObjects(level) {
    const objects = [];
    const baseObjects = level.objects.map((obj) => ({ ...obj }));
    const repeat = level.objectRepeat || 3100;

    if (!level.objectRepeat) {
      objects.push(...baseObjects);
      objects.push({ type: "mask", x: level.gasMaskX ?? level.width - 1700, y: level.ground - 56, w: 34, h: 34, hp: 1, picked: false });
      return objects;
    }

    for (let offset = 0; offset < level.width - 900; offset += repeat) {
      baseObjects.forEach((obj) => {
        const x = obj.x + offset;
        if (x > level.width - 900) return;
        objects.push({ ...obj, x });
      });
    }

    objects.push({ type: "mask", x: level.gasMaskX ?? level.width - 1700, y: level.ground - 56, w: 34, h: 34, hp: 1, picked: false });
    return objects;
  }

  function updateObjects(dt = 1 / 60) {
    state.objects.forEach((obj) => {
      if (obj.type === "food-helper") {
        obj.life -= dt;
        if (rectsOverlap(playerBox(), objectBox(obj))) {
          obj.hp = 0;
          state.energy = maxEnergy;
          state.score += 3;
          showMessage("Vida curada. Viene una nueva oleada. Vamos vamos tu puedes.", 5.4);
          finishFoodBreak(obj.waveId);
          audio?.playSfx("pickup", { volume: 0.82 });
          burst(obj.x, obj.y - 20, "#f1c84f");
        }
        if (obj.life <= 0) {
          obj.hp = 0;
          showMessage("Viene una nueva oleada.", 3.2);
          finishFoodBreak(obj.waveId);
        }
        return;
      }

      if (obj.type === "mask" && !obj.picked && rectsOverlap(playerBox(), objectBox(obj))) {
        obj.picked = true;
        obj.hp = 0;
        state.maskPicked = true;
        state.energy = Math.min(maxEnergy, state.energy + 10);
        state.score += 3;
        audio?.playSfx("pickup", { volume: 0.78 });
        burst(obj.x, obj.y, "#87b667");
        return;
      }

      if (obj.type !== "shop" || obj.saved || obj.hp <= 0) return;
      if (Math.abs(player.x - obj.x) < 56) {
        obj.saved = true;
        state.saved += 1;
        state.energy = Math.min(maxEnergy, state.energy + 12);
        state.score += 4;
        audio?.playSfx("pickup", { volume: 0.7 });
        burst(obj.x, obj.y - 20, "#7bc878");
      }
    });
    state.objects = state.objects.filter((obj) => obj.hp > 0 || obj.type === "shop");
  }

  return {
    buildLevelObjects,
    updateObjects,
  };
}
