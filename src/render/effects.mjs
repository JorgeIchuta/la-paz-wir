export function createEffectsRenderer({ ctx, state, world, px }) {
  function drawEffects() {
    ctx.save();
    ctx.translate(-world.cameraX, 0);
    state.hitArcs.forEach((arc) => {
      const alpha = arc.life * 6;
      if (arc.type === "whip") {
        ctx.save();
        ctx.translate(arc.x, arc.y);
        ctx.scale(arc.dir, 1);
        ctx.strokeStyle = `rgba(31, 20, 12, ${alpha})`;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(16, -4);
        ctx.quadraticCurveTo(78, -54, 136, -8);
        ctx.stroke();
        ctx.strokeStyle = `rgba(247, 200, 79, ${alpha})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(16, -4);
        ctx.quadraticCurveTo(78, -54, 136, -8);
        ctx.stroke();
        ctx.restore();
        return;
      }
      ctx.strokeStyle = `rgba(31, 20, 12, ${alpha})`;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(arc.x, arc.y, 38, -0.85, 0.85);
      ctx.stroke();
      ctx.strokeStyle = `rgba(247, 200, 79, ${alpha})`;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(arc.x, arc.y, 36, -0.85, 0.85);
      ctx.stroke();
    });
    state.particles.forEach((p) => {
      ctx.globalAlpha = Math.max(0, p.life * 3);
      px(p.x, p.y, 5, 5, p.color);
    });
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  return {
    drawEffects,
  };
}

