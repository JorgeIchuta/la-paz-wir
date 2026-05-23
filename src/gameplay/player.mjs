export function createPlayerSystem({
  state,
  player,
  world,
  input,
  clamp,
  rectsOverlap,
  playerBox,
  objectBox,
  currentGateX,
}) {
  function update(dt) {
    const accel = 1700;
    const friction = player.grounded ? 0.78 : 0.94;
    const maxSpeed = 205;

    if (input.left) {
      player.vx -= accel * dt;
      player.dir = -1;
    }
    if (input.right) {
      player.vx += accel * dt;
      player.dir = 1;
    }

    player.vx *= friction;
    player.vx = clamp(player.vx, -maxSpeed, maxSpeed);

    if (input.jump && player.grounded) {
      player.vy = -520;
      player.grounded = false;
    }

    player.vy += 1200 * dt;
    player.x += player.vx * dt;
    player.y += player.vy * dt;
    player.x = clamp(player.x, 40, world.width - 60);

    const gateX = currentGateX();
    if (gateX && player.x > gateX) {
      player.x = gateX;
      player.vx = Math.min(0, player.vx);
    }

    if (player.y + player.h / 2 >= world.ground) {
      player.y = world.ground - player.h / 2;
      player.vy = 0;
      player.grounded = true;
    }

    state.objects.forEach((obj) => {
      if (obj.hp <= 0 || obj.type === "shop" || obj.type === "mask" || obj.type === "food-helper") return;
      if (!rectsOverlap(playerBox(), objectBox(obj))) return;
      if (player.y < obj.y - obj.h / 2 && player.vy >= 0) {
        player.y = obj.y - obj.h / 2 - player.h / 2;
        player.vy = 0;
        player.grounded = true;
      } else {
        player.x -= Math.sign(player.vx || player.dir) * 12;
        player.vx *= -0.2;
      }
    });
  }

  return { update };
}
