export function createObjectsRenderer({ ctx, assets, px, strokePx, drawCharacterSprite }) {
  function drawObject(obj) {
    if (obj.hp <= 0) return;
    if (obj.type === "barricade") {
      px(obj.x - obj.w / 2 - 4, obj.y - obj.h / 2 + 4, obj.w + 8, obj.h, "#191919");
      px(obj.x - obj.w / 2, obj.y - obj.h / 2, obj.w, obj.h, "#513729");
      px(obj.x - obj.w / 2 + 7, obj.y - 12, obj.w - 14, 8, "#d95d37");
      px(obj.x - obj.w / 2 + 12, obj.y + 6, obj.w - 24, 7, "#f1c451");
      px(obj.x - obj.w / 2 + 5, obj.y + 17, 15, 8, "#7f5030");
      strokePx(obj.x - obj.w / 2, obj.y - obj.h / 2, obj.w, obj.h, "#221812");
    }
    if (obj.type === "crate") {
      px(obj.x - obj.w / 2, obj.y - obj.h / 2, obj.w, obj.h, "#2b1b12");
      px(obj.x - obj.w / 2 + 3, obj.y - obj.h / 2 + 3, obj.w - 6, obj.h - 6, "#80512c");
      strokePx(obj.x - obj.w / 2 + 7, obj.y - obj.h / 2 + 7, obj.w - 14, obj.h - 14, "#3c2418");
    }
    if (obj.type === "mask") drawGasMask(obj.x, obj.y);
    if (obj.type === "food-helper") drawFoodHelper(obj);
  }

  function drawFoodHelper(obj) {
    if (drawCharacterSprite("foodHelper", obj.x, obj.y + 40, 118, 1, true)) return;

    if (assets.foodHelper.complete && assets.foodHelper.naturalWidth > 0) {
      const height = 118;
      const width = height * (assets.foodHelper.naturalWidth / assets.foodHelper.naturalHeight);
      ctx.drawImage(assets.foodHelper, obj.x - width / 2, obj.y + 40 - height, width, height);
      return;
    }

    const x = obj.x;
    const footY = obj.y + 39;
    px(x - 31, footY - 4, 67, 9, "rgba(0, 0, 0, 0.38)");
    px(x - 24, footY - 105, 48, 16, "#141414");
    px(x - 18, footY - 111, 36, 15, "#141414");
    px(x - 14, footY - 108, 28, 10, "#5a2c24");
    px(x - 9, footY - 105, 18, 5, "#8f4b3c");
    px(x - 16, footY - 93, 32, 29, "#141414");
    px(x - 11, footY - 90, 22, 22, "#bd855f");
    px(x + 2, footY - 84, 8, 5, "#f0d0a1");
    px(x - 25, footY - 69, 50, 38, "#141414");
    px(x - 20, footY - 65, 40, 32, "#245f91");
    px(x - 15, footY - 60, 30, 9, "#5aa0ba");
    px(x - 18, footY - 49, 36, 7, "#e0b458");
    px(x - 34, footY - 34, 68, 36, "#141414");
    px(x - 29, footY - 31, 58, 29, "#8f2f53");
    px(x - 24, footY - 25, 48, 6, "#d98d42");
    px(x - 27, footY - 15, 54, 5, "#2367a8");
    px(x - 21, footY - 3, 15, 12, "#151515");
    px(x + 6, footY - 3, 15, 12, "#151515");
    px(x - 31, footY - 58, 13, 28, "#141414");
    px(x - 28, footY - 55, 8, 23, "#bd855f");
    px(x + 18, footY - 57, 13, 28, "#141414");
    px(x + 20, footY - 54, 8, 23, "#bd855f");
    px(x - 47, footY - 48, 31, 18, "#141414");
    px(x - 43, footY - 45, 23, 12, "#f1c84f");
    px(x - 39, footY - 52, 15, 8, "#8b5b31");
    px(x - 35, footY - 56, 9, 5, "#fff0c2");
    px(x - 8, footY - 82, 4, 4, "#151515");
    px(x + 4, footY - 82, 4, 4, "#151515");
    px(x - 5, footY - 75, 10, 3, "#7a382a");
  }

  function drawGasMask(x, y) {
    px(x - 18, y + 20, 36, 6, "rgba(0, 0, 0, 0.3)");
    px(x - 15, y - 16, 30, 25, "#1b241c");
    px(x - 11, y - 12, 9, 9, "#9ec5aa");
    px(x + 2, y - 12, 9, 9, "#9ec5aa");
    px(x - 5, y - 2, 10, 13, "#4e5d4d");
    px(x - 8, y + 9, 16, 7, "#252f27");
    px(x - 19, y - 4, 7, 15, "#263428");
    px(x + 12, y - 4, 7, 15, "#263428");
  }

  return { drawObject };
}
