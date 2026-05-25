export function createObjectSystem({
  state,
  player,
  rectsOverlap,
  playerBox,
  objectBox,
  showMessage,
  finishFoodBreak,
  burst,
}) {
  function buildLevelObjects(level) {
    if (level.tiledMap) {
      return buildTiledObjects(level);
    }

    const objects = [];
    const baseObjects = level.objects.map((obj) => alignObjectToGround(obj, level.ground));
    const repeat = level.objectRepeat || 3100;

    for (let offset = 0; offset < level.width - 900; offset += repeat) {
      baseObjects.forEach((obj) => {
        const x = obj.x + offset;
        if (x > level.width - 900) return;
        objects.push({ ...obj, x });
      });
    }

    objects.push(alignObjectToGround({ type: "mask", x: level.width - 1700, y: level.ground - 56, w: 34, h: 34, hp: 1, picked: false }, level.ground));
    return objects;
  }

  function buildTiledObjects(level) {
    const tiledObjects = [
      ...level.tiledMap.objects.interactables,
      ...level.tiledMap.objects.pickups,
    ];
    return tiledObjects.map((obj) => prepareTiledObject(obj, level));
  }

  function prepareTiledObject(obj, level) {
    const positioned = normalizeTiledObjectPosition(obj, level);
    const prepared = {
      ...positioned,
      hp: obj.hp ?? defaultHpForType(obj.type),
    };
    if (prepared.type === "shop") prepared.saved = false;
    if (prepared.type === "mask") prepared.picked = false;
    return prepared;
  }

  function normalizeTiledObjectPosition(obj, level) {
    const bottom = obj.y + obj.h / 2;
    if (bottom <= level.ground + 80) return { ...obj };

    const referenceGround = level.tiledReferenceGroundY || level.backgroundGroundY || level.tiledMap.height;
    const scaleY = level.ground / referenceGround;
    const scaledHeight = obj.h * scaleY;
    const scaledBottom = bottom * scaleY;

    return {
      ...obj,
      y: scaledBottom - scaledHeight / 2,
      h: scaledHeight,
    };
  }

  function defaultHpForType(type) {
    if (type === "shop") return 100;
    if (type === "barricade" || type === "rubble") return 2;
    return 1;
  }

  function alignObjectToGround(obj, ground) {
    const aligned = { ...obj };
    if (aligned.type === "shop") {
      aligned.y = ground - 46;
      return aligned;
    }
    if (aligned.type === "mask") {
      aligned.y = ground - 20;
      return aligned;
    }
    aligned.y = ground - aligned.h / 2;
    return aligned;
  }

  function updateObjects(dt = 1 / 60) {
    state.objects.forEach((obj) => {
      if (obj.type === "food-helper") {
        obj.life -= dt;
        if (rectsOverlap(playerBox(), objectBox(obj))) {
          obj.hp = 0;
          state.energy = Math.min(100, state.energy + obj.heal);
          state.score += 80;
          showMessage("Vida curada. Viene una nueva oleada. Vamos vamos tu puedes.", 5.4);
          finishFoodBreak(obj.waveId);
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
        state.energy = Math.min(100, state.energy + 10);
        state.score += 120;
        burst(obj.x, obj.y, "#87b667");
        return;
      }

      if (obj.type !== "shop" || obj.saved || obj.hp <= 0) return;
      if (Math.abs(player.x - obj.x) < 56) {
        obj.saved = true;
        state.saved += 1;
        state.energy = Math.min(100, state.energy + 12);
        state.score += 100;
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
