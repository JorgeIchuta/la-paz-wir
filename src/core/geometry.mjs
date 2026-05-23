import { circleRect, clamp, rectsOverlap } from "./math.mjs";

export { circleRect, clamp, rectsOverlap };

export function centeredBox(entity) {
  return {
    x: entity.x - entity.w / 2,
    y: entity.y - entity.h / 2,
    w: entity.w,
    h: entity.h,
  };
}

export function playerBox(player) {
  return centeredBox(player);
}

export function enemyBox(enemy) {
  return centeredBox(enemy);
}

export function objectBox(obj) {
  return centeredBox(obj);
}
