# Sprint 01 - Render Performance Y Sprites Repetidos

## Por Que Esto Importa

El juego apunta a una experiencia arcade con muchas entidades repetidas: enemigos, piedras, humo, particulas, monedas, pickups, tiendas, barricadas y detalles urbanos. Si cada elemento se crea/destruye sin control o se dibuja sin orden, el juego puede sentirse lento en celulares.

En Three.js, el concepto clave para muchos objetos repetidos es `InstancedBufferGeometry` o `InstancedMesh`: una geometria base repetida cientos o miles de veces con datos por instancia. En un juego 2D con canvas/Phaser/PixiJS, el equivalente conceptual es:

- Spritesheets en vez de imagenes sueltas.
- Batching de sprites.
- Object pools.
- Reutilizar objetos en memoria.
- Dibujar por capas y tipo.
- Limitar entidades activas fuera de camara.
- Usar particulas con presupuesto fijo.

## Estado Actual

El prototipo actual ya filtra algunas entidades fuera de pantalla y usa imagenes cargadas una vez con `new Image()`. Eso es bueno para un prototipo, pero falta una estrategia formal.

Riesgos actuales:

- `game.js` mezcla render y gameplay.
- Particulas y efectos se crean con objetos nuevos.
- Proyectiles, gas y enemigos no tienen object pool.
- Los fondos grandes se dibujan como imagenes anchas.
- Todavia no hay spritesheets normalizados por animacion.
- No hay limites documentados por tipo de entidad.

## Presupuesto Inicial De Entidades

Para Sprint 1 y Sprint 2, mantener estos limites:

```text
Enemigos vivos visibles:       8-12
Proyectiles visibles:          20
Particulas visibles:           120
Gas/humo clouds:               4
Pickups visibles:              12
Tiendas/objetos interactivos:  20 por zona cercana
Capas de fondo:                4-6
```

Si se superan esos valores, el sistema debe reciclar, pausar spawn o eliminar lo mas viejo fuera de camara.

## Estrategia En Canvas 2D

### 1. Spritesheets

Usar una imagen grande por categoria:

```text
assets/sprites/characters.png
assets/sprites/effects.png
assets/sprites/projectiles.png
assets/sprites/pickups.png
assets/ui/hud.png
```

Ventaja:

- Menos cambios de imagen durante draw.
- Mejor cache.
- Animaciones mas ordenadas.

### 2. Object Pooling

No crear/destruir proyectiles y particulas constantemente. Reutilizar objetos.

Aplicar a:

- Piedras.
- Dinamita.
- Gas clouds.
- Hit sparks.
- Polvo.
- Monedas.
- Numeros flotantes.

Contrato sugerido:

```js
pool.spawn(type, x, y, config);
pool.release(entity);
pool.update(dt);
pool.draw(ctx);
```

### 3. Culling Por Camara

No actualizar ni dibujar entidades lejos de la camara salvo que sean gameplay critico.

Regla:

```text
activeRange = cameraX - 220 .. cameraX + canvas.width + 260
```

Enemigos de boss y objetivos importantes pueden ignorar esta regla.

### 4. Render Por Capas

Orden estable:

```text
background sky
background parallax
street/base
shops/objects
pickups
projectiles behind characters
player/enemies/allies
projectiles/effects front
foreground
HUD
```

Esto evita saltos visuales y reduce decisiones dentro de cada draw.

### 5. Presupuesto De Particulas

Cada golpe no debe crear particulas ilimitadas. Usar presupuesto fijo.

Recomendacion:

- Golpe normal: 6-10 particulas.
- Explosion pequena: 18-28.
- Explosion grande: 40 max.
- Humo/gas: sprites animados o particulas lentas con limite bajo.

## Estrategia En Phaser 3

Si Sprint 2 migra a Phaser 3, usar:

- `Phaser.GameObjects.Group` para enemigos y pickups.
- `Phaser.Physics.Arcade.Group` para proyectiles.
- `ParticleEmitter` con `maxParticles`.
- `Tilemap` para escenarios.
- `Camera` con bounds y deadzone.
- Spritesheets/atlases con animaciones.

Equivalente practico a instancing:

- Grupos reciclables.
- Texture atlas.
- Batching interno de WebGL.
- Tilemap layers.

## Estrategia En PixiJS

Si se prioriza render profesional:

- `ParticleContainer` para particulas simples.
- `Spritesheet` y texture atlas.
- `Container` por capa.
- Reusar `Sprite` en pools.

PixiJS es muy fuerte para render, pero no trae gameplay tan listo como Phaser.

## Estrategia En Three.js

Usar Three.js solo si se decide 2.5D/3D.

Conceptos:

- `InstancedMesh`: repetir barricadas, piedras, hojas, escombros.
- `InstancedBufferGeometry`: repetir pasto, humo estilizado, multitudes decorativas.
- `ShaderMaterial`: viento, humo, brillo, distorsion.
- `BufferGeometry`: geometria custom.

No recomendado para Sprint 1 porque el juego actual es 2D canvas y ya tiene prototipo funcional.

## Decision Para Sprint 1

Para este sprint:

- Documentar limites.
- Crear estructura para pools.
- Crear asset manifest.
- Preparar spritesheets.
- Mantener canvas funcionando.

No implementar todavia:

- WebGL custom.
- Three.js.
- Fisicas pesadas.
- Miles de entidades.

## Definition Of Done De Performance

- Hay limites de entidades por tipo.
- Hay plan de object pools.
- Hay orden de render documentado.
- Hay convencion de spritesheets/atlases.
- Hay decision clara de cuando usar Phaser/Pixi/Three.
- El prototipo sigue pasando smoke test.

## Estado De Implementacion

- [x] Helper base `src/core/object-pool.mjs`.
- [x] Pool conectado a particulas con fallback seguro.
- [x] Pool conectado a proyectiles con fallback seguro.
- [ ] Limite duro de particulas visibles.
- [ ] Presupuesto visual ajustable desde data.
