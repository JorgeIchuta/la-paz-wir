export function loadImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}

export function waitForImage(image) {
  if (isReadyImage(image)) return Promise.resolve(image);

  const src = image?.currentSrc || image?.src || "unknown image";
  return new Promise((resolve, reject) => {
    if (!image) {
      reject(new Error("Image was not provided."));
      return;
    }

    const onLoad = () => {
      cleanup();
      if (isReadyImage(image)) {
        resolve(image);
        return;
      }
      reject(new Error(`Image loaded without dimensions: ${src}`));
    };
    const onError = () => {
      cleanup();
      reject(new Error(`Image failed to load: ${src}`));
    };
    const cleanup = () => {
      image.removeEventListener("load", onLoad);
      image.removeEventListener("error", onError);
    };

    image.addEventListener("load", onLoad, { once: true });
    image.addEventListener("error", onError, { once: true });

    if (image.complete && !isReadyImage(image)) {
      onError();
    }
  });
}

export function waitForImages(value) {
  const images = collectImages(value);
  return Promise.all(images.map(waitForImage));
}

export function createAssetsFromManifest(manifest) {
  return {
    level1Background: loadImage(manifest.backgrounds.level1),
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

function collectImages(value, images = [], seen = new Set()) {
  if (!value || seen.has(value)) return images;
  if (isImageLike(value)) {
    images.push(value);
    return images;
  }
  if (typeof value !== "object") return images;

  seen.add(value);
  Object.values(value).forEach((entry) => collectImages(entry, images, seen));
  return images;
}

function isImageLike(value) {
  return value && typeof value === "object" && "src" in value && "complete" in value && "naturalWidth" in value;
}

function isReadyImage(image) {
  return image && image.complete && image.naturalWidth > 0;
}
