export function createEffectsSystem({ state, particlePool }) {
  function update(dt) {
    state.hitArcs.forEach((arc) => {
      arc.life -= dt;
    });
    state.hitArcs = state.hitArcs.filter((arc) => arc.life > 0);

    state.particles.forEach((particle) => {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 480 * dt;
      particle.life -= dt;
    });

    if (particlePool()) {
      particlePool().releaseWhere((particle) => particle.life <= 0);
    } else {
      state.particles = state.particles.filter((particle) => particle.life > 0);
    }
  }

  return { update };
}
