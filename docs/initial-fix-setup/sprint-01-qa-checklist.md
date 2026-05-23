# Sprint 01 - QA Checklist

## Smoke Test Local

### Arranque

- [ ] Ejecutar `node dev-server.js`.
- [ ] Abrir `http://127.0.0.1:5173/`.
- [ ] Ver pantalla inicial con titulo `La Paz Wir`.
- [ ] Presionar `Jugar`.
- [ ] Confirmar que el overlay desaparece.

### Input

- [ ] Flecha izquierda o `A` mueve al jugador a la izquierda.
- [ ] Flecha derecha o `D` mueve al jugador a la derecha.
- [ ] Flecha arriba o `W` hace saltar.
- [ ] `J` o boton de ataque ejecuta ataque.
- [ ] Botones tactiles responden en viewport mobile.

### Gameplay

- [ ] El jugador puede avanzar por el escenario.
- [ ] La camara sigue al jugador.
- [ ] Aparecen oleadas despues de avanzar/tiempo.
- [ ] El ataque puede golpear enemigos.
- [ ] Los enemigos pueden danar al jugador.
- [ ] Los proyectiles pueden danar al jugador.
- [ ] Las tiendas pueden salvarse al acercarse.
- [ ] Los saqueadores pueden danar tiendas.
- [ ] La mascara se puede recoger cerca del final.
- [ ] El helper de comida puede curar al jugador.
- [ ] El encuentro final aparece.

### HUD

- [ ] Puntos aumenta.
- [ ] Energia baja al recibir dano.
- [ ] Negocios aumenta al proteger tiendas.
- [ ] Cooldown visual de ataque aparece.
- [ ] Mensajes temporales aparecen cuando corresponde.

### Finales

- [ ] Si energia llega a 0, aparece pantalla de derrota.
- [ ] Si se derrota el jefe y se llega al final, aparece pantalla de victoria.
- [ ] Boton `Reintentar` reinicia la partida.

## Verificacion Tecnica

- [ ] `node --check ./game.js` pasa.
- [ ] No hay errores en consola del navegador durante una partida corta.
- [ ] No se agregaron dependencias innecesarias.
- [ ] El proyecto sigue funcionando sin build step.

## Riesgos A Observar

- Enemigos spawnean fuera de pantalla y no vuelven.
- El jugador queda bloqueado por objetos.
- La camara deja de seguir al jugador.
- El jefe aparece encima del jugador.
- La energia baja demasiado rapido por gas/proyectiles.
- Los botones tactiles tapan informacion importante.

