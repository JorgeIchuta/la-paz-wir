export async function loadTiledMap(src) {
  const response = await fetch(src);
  if (!response.ok) {
    throw new Error(`No se pudo cargar el mapa Tiled: ${src}`);
  }

  const map = await response.json();
  return normalizeTiledMap(map);
}

export function normalizeTiledMap(map) {
  return {
    width: map.width * map.tilewidth,
    height: map.height * map.tileheight,
    tileWidth: map.tilewidth,
    tileHeight: map.tileheight,
    layers: map.layers || [],
    objects: {
      collision: readObjectLayer(map, "collision"),
      interactables: readObjectLayer(map, "interactables"),
      enemies: readObjectLayer(map, "enemies"),
      pickups: readObjectLayer(map, "pickups"),
    },
  };
}

export function readObjectLayer(map, layerName) {
  const layer = (map.layers || []).find((entry) => entry.name === layerName);
  if (!layer || layer.type !== "objectgroup") return [];
  return (layer.objects || [])
    .filter((object) => object.visible !== false)
    .map(normalizeTiledObject);
}

export function normalizeTiledObject(object) {
  const props = readProperties(object.properties);
  const width = object.width || props.w || 0;
  const height = object.height || props.h || 0;

  return {
    id: object.id,
    name: object.name || "",
    type: object.type || props.type || "",
    x: object.x + width / 2,
    y: object.y + height / 2,
    w: width,
    h: height,
    rotation: object.rotation || 0,
    ...props,
  };
}

export function readProperties(properties = []) {
  return properties.reduce((result, property) => {
    result[property.name] = property.value;
    return result;
  }, {});
}
