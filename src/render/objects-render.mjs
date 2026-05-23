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
    if (obj.type === "shop") drawPacenaShop(obj);
    if (obj.type === "mask") drawGasMask(obj.x, obj.y);
    if (obj.type === "food-helper") drawFoodHelper(obj);
  }

  function drawPacenaShop(obj) {
    if (assets.pacenaKiosk.complete && assets.pacenaKiosk.naturalWidth > 0) {
      const width = 116;
      const height = 99;
      ctx.globalAlpha = obj.hp > 0 ? 1 : 0.35;
      ctx.drawImage(assets.pacenaKiosk, obj.x - width / 2, obj.y - 53, width, height);
      px(obj.x - 30, obj.y + 44, 60, 5, "#111");
      px(obj.x - 30, obj.y + 44, 60 * Math.max(0, obj.hp / 100), 5, "#71c879");
      ctx.globalAlpha = 1;
      return;
    }

    const x = obj.x - 42;
    const y = obj.y - 46;
    const saved = obj.saved;
    const wall = saved ? "#3f7356" : "#315c68";
    const trim = saved ? "#65a572" : "#4b8191";

    ctx.globalAlpha = obj.hp > 0 ? 1 : 0.35;
    px(x - 7, y + 9, 98, 79, "#151515");
    px(x - 3, y + 12, 90, 70, wall);
    px(x + 3, y + 17, 78, 14, trim);
    px(x + 9, y + 35, 24, 27, "#171717");
    px(x + 13, y + 39, 16, 22, "#ead9b6");
    px(x + 48, y + 36, 25, 18, "#171717");
    px(x + 51, y + 39, 19, 12, "#1f3545");

    px(x - 12, y - 2, 104, 16, "#191512");
    for (let i = 0; i < 7; i += 1) {
      const color = ["#efbd4f", "#d94f35", "#2367a8", "#f0eee1"][i % 4];
      px(x - 9 + i * 15, y, 12, 13, color);
    }

    px(x - 10, y + 53, 102, 22, "#4d2f1e");
    px(x - 5, y + 57, 21, 13, "#d9863a");
    px(x + 20, y + 57, 22, 13, "#d94f35");
    px(x + 47, y + 57, 20, 13, "#66a84f");
    px(x + 71, y + 56, 14, 14, "#e0b458");
    px(x + 1, y + 60, 5, 5, "#f1c84f");
    px(x + 27, y + 60, 5, 5, "#f06f3e");
    px(x + 53, y + 60, 5, 5, "#8fd06d");

    drawWovenBanner(x - 15, y + 33);
    px(obj.x - 30, obj.y + 44, 60, 5, "#111");
    px(obj.x - 30, obj.y + 44, 60 * Math.max(0, obj.hp / 100), 5, "#71c879");
    ctx.globalAlpha = 1;
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

  function drawWovenBanner(x, y) {
    px(x, y, 28, 38, "#243544");
    px(x + 3, y + 4, 22, 30, "#d36d39");
    px(x + 8, y + 9, 12, 8, "#2367a8");
    px(x + 6, y + 21, 17, 6, "#e2bd4e");
    px(x + 10, y + 29, 9, 5, "#5a9d55");
  }

  return { drawObject };
}
