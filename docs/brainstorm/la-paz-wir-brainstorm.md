# La Paz Wir - Brainstorm De Juego Y Tecnologia

Fecha: 2026-05-23

## Estado Actual Del Proyecto

El proyecto ya es un prototipo jugable en navegador, hecho con HTML, CSS y JavaScript puro sobre `canvas`. No usa dependencias externas ni build step. Se levanta con `node dev-server.js` y corre en `http://127.0.0.1:5173/`.

Archivos principales:

- `index.html`: estructura de pantalla, HUD, overlay inicial y controles tactiles.
- `styles.css`: layout responsive tipo mobile vertical, HUD, overlay y botones.
- `game.js`: todo el juego en un solo archivo: estado, input, loop, render, colisiones, oleadas, enemigos, proyectiles, objetos y HUD.
- `assets/`: fondos y sprites ya generados.
- `docs/`: roadmap, guia de produccion, plan de tileset y personajes.

Lo que ya existe en gameplay:

- Movimiento lateral, salto, camara y ataque principal con chicote/garrote.
- Puntaje por tiempo, golpes, enemigos vencidos, oleadas y ayuda recogida.
- Energia del jugador.
- Tiendas/puestos que pueden ser protegidos o danados.
- Enemigos con roles: bloqueador que lanza piedras, saqueador que ataca tiendas, mallku ficticio rapido y minero jefe.
- Proyectiles: piedras, dinamita y gas.
- Mascara contra gas como pickup.
- Senora/helper que cura al jugador.
- Apoyo policial en el encuentro final.
- Final de nivel condicionado por derrotar al jefe y llegar al final.

Deuda tecnica principal:

- `game.js` esta demasiado grande y mezcla responsabilidades.
- No hay `src/` modular todavia.
- No hay motor formal de escenas, animaciones, assets, audio o fisicas.
- Las oleadas se generan en codigo, no desde data editable.
- No hay sistema de inventario, oro, tienda, niveles del jugador ni guardado.
- El estilo visual apunta a pixel art, pero todavia mezcla sprites, fallback procedural y fondos grandes.
- Falta menu, pausa, game over/victoria mas trabajados, audio y feedback fuerte de arcade.

## Lectura Del Concepto

El juego puede ser una alegoria arcade de Bolivia: bloqueos, paros, marchas, enfrentamientos, desabastecimiento, dano economico y division social. La idea tiene fuerza si el jugador no se vuelve "un bando politico", sino alguien atrapado en el caos intentando avanzar, sobrevivir, proteger negocios, ayudar civiles y llegar a una salida.

Recomendacion narrativa: mantener facciones ficticias, nombres inventados, humor negro suave y estetica caricaturesca. Evitar logos reales, partidos reales, lideres reales y violencia sangrienta. Eso permite tocar una situacion reconocible sin convertir el juego en propaganda directa.

Pilares propuestos:

- **Caos urbano legible**: el jugador entiende piedras, barricadas, humo, tiendas danadas, escasez y oleadas.
- **Arcade rapido**: inspirado en la energia de Metal Slug, pero sin copiar sprites, armas, personajes ni mapas.
- **Proteccion civil**: no solo golpear enemigos; tambien proteger puestos, rescatar civiles, abrir rutas y conseguir suministros.
- **Decisiones bajo presion**: avanzar, defender tienda, recoger comida, romper barricada o guardar energia.
- **Satira boliviana ficticia**: minibuses, teleferico, Illimani, mercados, calaminas, laderas, dinamita, bloqueos y folklore urbano.

## Direccion De Gameplay

### Loop Principal

1. El jugador entra a una zona bloqueada.
2. Avanza entre barricadas, piedras, humo y saqueos.
3. Protege tiendas o civiles para ganar reputacion, oro y comida.
4. Derrota oleadas cortas.
5. Compra/mejora armas en checkpoints.
6. Llega a un jefe de zona.
7. Desbloquea nueva ruta, distrito o nivel.

### Como Ganar Puntos

- Sobrevivir tiempo sin recibir dano.
- Derrotar enemigos sin romper objetos civiles.
- Proteger tiendas hasta que pase la oleada.
- Rescatar civiles o vendedores atrapados.
- Romper barricadas que bloquean el paso.
- Completar combos sin recibir dano.
- Neutralizar proyectiles con ataque en timing correcto.
- Terminar el nivel con tiendas vivas.
- Recoger suministros raros: comida, botiquin, mascara, repuestos.

### Como Subir De Nivel

Usar experiencia por acciones utiles:

- `+XP` por enemigos vencidos.
- `+XP` por tiendas protegidas.
- `+XP` por completar objetivos de zona.
- `+XP` por terminar sin morir.
- Penalizacion suave si se destruyen demasiados puestos o civiles huyen.

Cada nivel del jugador puede dar una eleccion:

- Mas vida maxima.
- Menor cooldown de ataque.
- Mas dano con arma cuerpo a cuerpo.
- Mejor resistencia a gas/piedras.
- Mas oro ganado.
- Mayor alcance de recogida.

### Oro Y Economia

El oro no deberia caer solo de enemigos. Es mas interesante si viene de agradecimiento y objetivos:

- Comerciantes salvados pagan monedas.
- Civiles rescatados dan propinas o items.
- Cajas contienen recursos, pero romper propiedad baja reputacion.
- Bonus por terminar nivel con pocos danos.
- Jefes sueltan piezas especiales para armas.

Usos del oro:

- Comprar armas.
- Reparar armadura/chaleco.
- Comprar botiquines, comida, mascara, casco.
- Mejorar dano, alcance, cadencia o resistencia.
- Desbloquear skins/personalizacion.

### Armas Y Upgrades

Armas iniciales:

- Chicote/garrote: corto alcance, rapido, empuja.
- Honda: ataque a distancia simple, limitada por municion.
- Escudo improvisado: bloquea piedras, baja movilidad.
- Petardo no letal: controla grupos, cooldown largo.

Armas desbloqueables:

- Honda mejorada: mas velocidad y rebote.
- Escudo de calamina: bloquea proyectiles frontales.
- Megafono: aturde enemigos en cono, ideal para control.
- Mochila de agua: limpia humo/gas pequeno o apaga fuego.
- Charango sonico ficticio: ataque especial de area, tono comico arcade.

Mejoras:

- Dano.
- Alcance.
- Knockback.
- Cooldown.
- Probabilidad de stun.
- Municion maxima.
- Resistencia al gas.

### Vida, Dano Y Curacion

El jugador pierde vida por:

- Piedras.
- Contacto con enemigos.
- Chicote enemigo.
- Dinamita.
- Gas.
- Quedar atrapado entre barricadas y oleadas.

El jugador gana vida por:

- Comida de vendedoras.
- Botiquines.
- Checkpoints.
- Bonus por proteger tiendas.
- Upgrade de regeneracion lenta fuera de combate.

### Personalizacion

Personalizacion sin complicar el gameplay:

- Ropa: chamarra, poncho, casco, gorra, mascara.
- Paletas regionales ficticias.
- Mochilas y accesorios.
- Emotes de victoria.
- Skins desbloqueadas por logros, no solo por oro.

Stats visibles por equipo:

- Vida.
- Resistencia.
- Velocidad.
- Dano.
- Control de masas.

### Condicion De Victoria

Para una demo:

- Llegar al final del bloqueo.
- Derrotar al jefe de la zona.
- Proteger al menos cierta cantidad de negocios.
- Salir con vida.

Para campana:

- Completar varios distritos.
- Reducir el "indice de caos" de la ciudad.
- Abrir rutas de abastecimiento.
- Enfrentar un jefe final simbolico: "La Gran Tranca", una mezcla ficticia de burocracia, bloqueo y conflicto.

Final ideal: no "matar al otro bando", sino restaurar paso, comida, transporte y calma por un rato. Eso le da identidad propia y evita que el juego sea solo pelea.

## Estilos Visuales Posibles

### Pixel Art Arcade

El camino mas natural para el proyecto actual. Encaja con Metal Slug, canvas 2D, sprites y humor visual.

Pros:

- Rapido de producir para demo.
- Funciona muy bien en mobile.
- Facil de leer en pantallas pequenas.
- Compatible con Phaser o PixiJS.

Contras:

- Necesita consistencia fuerte de paleta, resolucion y animaciones.

### Low Poly 3D

Buen estilo si se decide migrar a 3D o hacer escenas especiales.

Uso:

- La Paz estilizada con laderas, minibuses, teleferico y barricadas.
- Personajes simples con animaciones claras.
- Camara lateral 2.5D o isometrica.

Libreria clave: Three.js.

### Voxel

Podria funcionar para una version mas juguetona, tipo ciudad armada con bloques.

Uso:

- Mapas destructibles simples.
- Vehiculos, puestos y barricadas modulares.

Riesgo:

- Puede sentirse menos "Metal Slug" y mas sandbox.

### Cel-Shaded / Flat-Shading

Buena opcion para 3D profesional sin textura pesada.

Uso:

- Personajes 3D con contornos.
- Efectos de humo, gas y explosiones estilizadas.
- Camara 2.5D.

### Isometric 2.5D

Interesante si el objetivo cambia a tactico/estrategico.

Uso:

- Controlar rutas, bloqueos, suministros y grupos.
- Menos accion arcade, mas estrategia urbana.

Para el proyecto actual, recomendacion: seguir con **pixel art arcade 2D** para la demo y dejar **Three.js low-poly/cel-shaded** como posible evolucion futura o pantalla especial.

## Librerias JavaScript Recomendadas

### Opcion Recomendada Para Demo Profesional: Phaser 3

Phaser 3 es la recomendacion principal si se quiere pasar de prototipo a juego 2D serio.

Usos:

- Escenas: boot, menu, nivel, tienda, game over.
- Sprite animations.
- Tilemaps.
- Arcade Physics.
- Input teclado/touch/gamepad.
- Camara, shake, parallax.
- Particulas.
- Audio.

Ideal para:

- Beat 'em up lateral.
- Endless runner.
- Niveles con tilemaps.
- Mobile web.

### PixiJS

PixiJS es excelente si quieres control visual/render profesional, pero trae menos gameplay listo que Phaser.

Usos:

- Render 2D rapido WebGL.
- Sprites, filtros, particulas.
- UI custom.

Ideal si:

- Queremos escribir nuestro propio motor de gameplay.
- Priorizamos render, efectos y control fino.

### Three.js

Usar si el juego migra a 3D, 2.5D o fondos 3D.

Conceptos clave:

- `Scene`
- `PerspectiveCamera`
- `WebGLRenderer`
- `BufferGeometry`
- `InstancedBufferGeometry`
- `InstancedMesh`
- `ShaderMaterial`
- `MeshStandardMaterial`
- `DirectionalLight`
- `AnimationMixer`
- `Quaternion`
- `Vector3`

Ejemplos de uso:

- Cientos de piedras, hojas, escombros, carteles o soldados con `InstancedMesh`.
- Campo procedural 3D usando `InstancedBufferGeometry`.
- Shaders de viento para banderas, humo o pasto.
- Camara 2.5D con ciudad low-poly al fondo.

### Matter.js

Fisica 2D general. Bueno para colisiones, cuerpos, rebotes, empujes y objetos dinamicos.

Uso:

- Piedras con rebote.
- Barricadas que caen.
- Cajas empujables.
- Escombros.

### Planck.js

Alternativa moderna estilo Box2D para fisica 2D.

Uso:

- Si se necesita fisica 2D mas estable que arcade physics.

### Cannon-es

Fisica 3D ligera para Three.js.

Uso:

- Objetos low-poly que caen.
- Vehiculos simples.
- Barricadas 3D.

### Rapier

Fisica moderna y rapida, 2D/3D, basada en Rust/WASM.

Uso:

- Si el proyecto se vuelve mas ambicioso y necesita rendimiento.

### Ammo.js

Fisica 3D potente basada en Bullet.

Uso:

- Simulaciones 3D mas complejas.

Riesgo:

- Mas pesada y compleja para una demo web casual.

### Tiled + Export JSON

Herramienta clave para mapas 2D.

Uso:

- Crear niveles con tiles.
- Capas de fondo, objetos, colisiones y spawns.
- Exportar `level-01.json`.

### Aseprite

No es libreria JS, pero es muy importante para produccion pixel art.

Uso:

- Spritesheets.
- Animaciones.
- Tags por animacion.
- Export JSON para frames.

### Howler.js

Audio simple y confiable.

Uso:

- Musica.
- Golpes.
- Piedras.
- Dinamita.
- UI.
- Loops ambientales.

### GSAP

Animaciones de UI, menus, transiciones, pantallas de victoria/derrota.

No usar para mover gameplay principal; usarlo para interfaz y polish.

## Recomendacion De Stack

### Ruta 1: Demo 2D Profesional

Recomendada.

- Vite
- TypeScript
- Phaser 3
- Tiled
- Aseprite
- Howler.js si no se usa audio nativo de Phaser

Estructura:

```text
src/
  main.ts
  game/
    config.ts
    scenes/
      BootScene.ts
      PreloadScene.ts
      MenuScene.ts
      LevelScene.ts
      ShopScene.ts
      GameOverScene.ts
    systems/
      CombatSystem.ts
      WaveSystem.ts
      EconomySystem.ts
      UpgradeSystem.ts
      SaveSystem.ts
    entities/
      Player.ts
      Enemy.ts
      Projectile.ts
      Pickup.ts
      Shop.ts
    data/
      levels/
        level-01.ts
      enemies.ts
      weapons.ts
      upgrades.ts
      dialogs.ts
assets/
  maps/
  sprites/
  tilesets/
  audio/
  ui/
docs/
  brainstorm/
```

### Ruta 2: Mantener Canvas Propio

Valida si quieres aprender y controlar todo, pero menos productiva.

Necesario:

- Separar `game.js` en modulos.
- Crear asset loader.
- Crear animation system.
- Crear scene manager.
- Crear collision system.
- Crear data-driven levels.

### Ruta 3: 2.5D Con Three.js

No recomendada para primera demo, pero potente para evolucion.

- Vite
- TypeScript
- Three.js
- Rapier o Cannon-es
- Blender para modelos low-poly

## Estructura Recomendada Del Juego

### Sistemas

- `GameState`: vida, oro, XP, nivel, inventario.
- `InputSystem`: teclado, touch, gamepad.
- `CombatSystem`: golpes, dano, knockback, invulnerabilidad.
- `WaveSystem`: oleadas por zona y dificultad.
- `EconomySystem`: oro, tienda, recompensas.
- `UpgradeSystem`: mejoras permanentes y temporales.
- `ObjectiveSystem`: proteger tiendas, rescatar civiles, abrir ruta.
- `SaveSystem`: progreso local con `localStorage`.
- `AudioSystem`: musica, SFX, volumen.
- `UISystem`: HUD, pausa, tienda, victoria.

### Data Primero

Evitar hardcodear todo en funciones. Mejor:

```js
export const weapons = {
  chicote: { damage: 1, cooldown: 0.52, knockback: 260, range: 68 },
  honda: { damage: 1, cooldown: 0.8, ammoCost: 1, speed: 420 },
};
```

```js
export const level01 = {
  name: "Calle Pacena",
  objective: "Abrir paso y proteger 3 tiendas",
  waves: [
    { atX: 600, enemies: ["blocker", "blocker"] },
    { atX: 1200, enemies: ["looter", "blocker", "looter"] },
  ],
};
```

## Ideas De Niveles

### Nivel 1: Calle Pacena

Objetivo: aprender movimiento, ataque, proteger tiendas.

Jefe: dirigente ficticio con megafono que llama oleadas.

### Nivel 2: Estacion Teleferico

Objetivo: abrir paso entre barricadas y humo.

Mecanica nueva: mascara contra gas y plataformas.

### Nivel 3: Mercado Cercado

Objetivo: proteger puestos y recuperar suministros.

Mecanica nueva: saqueadores priorizan tiendas, civiles corren.

### Nivel 4: Carretera Bloqueada

Objetivo: escoltar un minibus/ambulancia.

Mecanica nueva: avance forzado tipo endless runner lento.

### Nivel 5: La Gran Tranca

Objetivo: jefe final simbolico.

Mecanica: oleadas mixtas, humo, barricadas moviles, decisiones de ruta.

## Ideas De Enemigos Ficticios

- Bloqueador: lanza piedra, mantiene distancia.
- Saqueador: ataca tiendas, ignora al jugador si puede.
- Mallku ficticio: rapido, chicote, melee peligroso.
- Minero jefe: dinamita y gas.
- Motorizado: pasa rapido y obliga a saltar/esquivar.
- Burocrata urbano: pone sellos/barreras temporales.
- Rumorista: aumenta caos si no lo interrumpes.

## Riesgos De Diseno

- Si el juego se vuelve demasiado politico, divide al publico antes de que juegue.
- Si todos los enemigos representan personas reales, puede sentirse agresivo o injusto.
- Si solo se gana golpeando, se pierde la alegoria social.
- Si se agregan demasiadas mecanicas pronto, el prototipo se vuelve inmanejable.
- Si se migra a 3D antes de cerrar el loop divertido, se retrasa la demo.

## Siguiente Plan Pragmatico

1. Mantener el prototipo actual como referencia jugable.
2. Crear rama o carpeta `src/` con Vite + Phaser 3 + TypeScript.
3. Migrar primero: player, camara, enemigo blocker, tienda, una oleada.
4. Integrar un tilemap simple hecho en Tiled.
5. Agregar oro, XP y una tienda basica entre zonas.
6. Agregar audio y particulas.
7. Rehacer HUD: vida, oro, XP, arma actual, tiendas protegidas.
8. Crear una demo de 3 a 5 minutos con inicio, pausa, victoria y derrota.

## Recomendacion Final

La mejor direccion es **2D pixel art arcade con Phaser 3**, inspirado en la energia de Metal Slug pero con identidad boliviana propia: La Paz, teleferico, mercados, bloqueos, humo, minibuses, laderas y humor satirico. Three.js, voxel o low-poly pueden ser muy atractivos, pero para este proyecto conviene primero cerrar una demo 2D profesional, modular y divertida.

