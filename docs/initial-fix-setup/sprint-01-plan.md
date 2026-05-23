# Sprint 01 - Ordenar La Base Jugable

Fecha: 2026-05-23

## Objetivo Del Sprint

Convertir el prototipo actual en una base mantenible para producir una demo 2D arcade profesional. El sprint no busca rehacer el juego completo ni migrarlo todavia a Phaser. Busca separar responsabilidades, documentar contratos de gameplay y preparar el terreno para agregar oro, XP, tienda, upgrades y mas armas en sprints siguientes.

## Estado Actual Del Codigo

El juego ya funciona como prototipo en `canvas`, con una cantidad importante de gameplay dentro de `game.js`.

Puntos relevantes:

- Estado global principal en `game.js:44`.
- Definicion de niveles en `game.js:128`.
- Reset e inicio de partida en `game.js:242`.
- Loop de update en `game.js:299`.
- Ataque principal en `game.js:385`.
- Sistema de oleadas en `game.js:428`.
- Encuentro final y jefe en `game.js:532`.
- IA/enemigos en `game.js:578`.
- HUD en `game.js:850`.
- Game over/victoria en `game.js:856`.
- Render principal en `game.js:865`.

Problema central: `game.js` contiene input, estado, gameplay, render, datos, colisiones, oleadas, efectos, UI y carga de assets. Esto hace dificil agregar features sin crear bugs colaterales.

## Alcance Del Sprint 1

### Incluido

- Crear una estructura modular inicial en `src/` sin cambiar todavia el comportamiento jugable.
- Separar data editable de niveles, enemigos, armas base y pickups.
- Definir contratos simples para entidades: player, enemy, projectile, object, pickup.
- Crear un asset manifest inicial.
- Usar modulos `.mjs` para codigo nuevo, evitando cambiar `dev-server.js` y el prototipo CommonJS actual.
- Documentar el loop de juego y los sistemas existentes.
- Preparar backlog tecnico para migrar luego a Phaser 3 o mantener canvas modular.
- Agregar una verificacion minima de sintaxis/arranque.
- Mantener `game.js` funcionando durante todo el sprint.

### No Incluido

- No migrar completo a Phaser 3 en este sprint.
- No agregar tienda completa.
- No agregar XP completo.
- No agregar oro persistente completo.
- No rehacer todos los sprites.
- No cambiar drasticamente el gameplay.
- No integrar fisicas avanzadas todavia.

## Resultado Esperado

Al final del Sprint 1, el proyecto deberia tener:

- Prototipo actual todavia jugable.
- Estructura `src/` creada y lista.
- Datos de gameplay identificados y preparados para extraerse.
- Plan claro para separar sistemas sin big bang rewrite.
- Criterios de aceptacion para no romper el juego.
- Base tecnica lista para Sprint 2: economia, XP, tienda y armas.

## Enfoque Tecnico

### Decision Recomendada

Mantener el prototipo canvas como baseline y hacer una modularizacion incremental. La migracion a Phaser 3 queda como decision de Sprint 2 o Sprint 3, cuando el equipo tenga claro si quiere velocidad de produccion con motor 2D o control completo con canvas propio.

La recomendacion profesional sigue siendo Phaser 3 para la demo final, pero no conviene hacer la migracion sin antes separar conceptos y datos. Si se migra ahora, se arrastra el desorden a otro framework.

### Principio De Trabajo

Cada cambio debe cumplir:

- El juego sigue arrancando.
- El ataque sigue funcionando.
- Las oleadas siguen apareciendo.
- Las tiendas siguen pudiendo salvarse o danarse.
- El jefe final sigue apareciendo.
- El HUD sigue actualizando puntos, energia y negocios.

## Historias De Sprint

### S01-01 - Baseline Tecnico

Como developer, quiero documentar que existe hoy en el prototipo para saber que no se debe romper.

Criterios:

- Existe una lista de sistemas actuales.
- Existe una lista de riesgos actuales.
- Existe checklist manual de smoke test.

### S01-02 - Estructura Inicial De Codigo

Como developer, quiero crear una estructura `src/` para separar responsabilidades sin reescribir todo de golpe.

Criterios:

- Existe estructura propuesta de carpetas.
- Cada carpeta tiene responsabilidad clara.
- No se elimina `game.js` durante este sprint.

### S01-03 - Data-Driven Gameplay

Como designer/developer, quiero mover niveles, enemigos, armas y pickups hacia data editable para balancear sin tocar logica central.

Criterios:

- Existe contrato documentado para `level`, `enemy`, `weapon`, `pickup`.
- Se identifica que datos actuales vienen de `game.js`.
- Se define formato inicial JS/JSON.

### S01-04 - Asset Manifest

Como developer, quiero un manifest de assets para dejar de cargar imagenes sueltas desde muchos lugares.

Criterios:

- Existe lista de assets actuales.
- Existe naming convention.
- Existe plan para separar spritesheets y backgrounds por tipo.

### S01-05 - Smoke Test Manual

Como developer, quiero una prueba manual corta para validar que el prototipo sigue vivo despues de cambios.

Criterios:

- El servidor local arranca.
- El canvas aparece.
- El jugador se mueve, salta y ataca.
- Un enemigo puede recibir dano.
- Una tienda puede salvarse.
- El HUD cambia.
- El game over/victoria no rompe la pantalla.

## Definition Of Done Del Sprint

- Documentos de Sprint 1 completos en `docs/initial-fix-setup/`.
- `node --check ./game.js` pasa.
- El prototipo se puede levantar con `node dev-server.js`.
- Existe plan de carpetas `src/`.
- Existe backlog priorizado para ejecutar los cambios.
- No se introducen dependencias sin decidir stack.

## Riesgos

- Intentar migrar a Phaser y redisenar gameplay al mismo tiempo.
- Agregar oro/XP/armas antes de tener data clara.
- Romper el prototipo jugable actual por modularizar demasiado rapido.
- Mantener `game.js` como archivo unico por varios sprints mas.
- Confundir satira social con ataque directo a grupos reales.

## Recomendacion Para Sprint 2

Una vez cerrado Sprint 1, Sprint 2 deberia implementar:

- Oro temporal por tiendas protegidas y enemigos vencidos.
- XP simple por objetivos.
- Pantalla de upgrade entre oleadas o checkpoint.
- Primer set de armas: chicote, honda, escudo improvisado.
- Guardado local minimo con `localStorage`.
