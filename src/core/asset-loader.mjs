export function loadImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

export function createAssetsFromManifest(manifest) {
  return {
    streetBackground: loadImage(manifest.backgrounds.street),
    telefericoBackground: loadImage(manifest.backgrounds.teleferico),
    characterSheet: loadImage(manifest.sprites.characterSheet),
    foodHelper: loadImage(manifest.sprites.foodHelper),
    policeAlly: loadImage(manifest.sprites.policeAlly),
    walkSheets: {
      hero: loadImage(manifest.sprites.heroWalk),
      blocker: loadImage(manifest.sprites.blockerWalk),
      looter: loadImage(manifest.sprites.looterWalk),
      mallku: loadImage(manifest.sprites.mallkuWalk),
      miner: loadImage(manifest.sprites.minerWalk),
      foodHelper: loadImage(manifest.sprites.foodHelperWalk),
    },
    attackSheets: {
      hero: loadImage(manifest.sprites.heroAttack),
    },
    characterCanvas: null,
  };
}
