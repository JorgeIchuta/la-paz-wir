// Positive values draw sprites lower without changing physics, collisions, or enemy AI.
export const renderTuning = {
  actorSpriteHeights: {
    hero: 104,
    blocker: 92,
    looter: 92,
    mallku: 118,
    miner: 132,
    minerScout: 120,
    police: 112,
    foodHelper: 118,
  },
  actorFootOffsets: {
    hero: 25,
    blocker: 25,
    looter: 25,
    mallku: 25,
    miner: 25,
    minerScout: 25,
    police: 25,
    foodHelper: 25,
  },
  objectFootOffsets: {
    barricade: 30,
    crate: 30,
    mask: 0,
    shop: 0,
    foodHelper: 50,
  },
  objectAnchorOffsets: {
    foodHelper: 25,
  },
  effectOffsets: {
    whip: {
      y: 25,
    },
  },
};
