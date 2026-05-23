# Sprint R1 - Combat Extraction Notes

Fecha: 2026-05-23

## Objetivo

Extraer el combate existente a `src/gameplay/combat.mjs` sin cambiar feel, dano, cooldowns, hitboxes ni puntaje.

## Alcance

Mover:

- `maybeAttack`
- `hitPlayer`
- hitbox del ataque principal
- dano a enemigos
- dano a objetos rompibles
- knockback del ataque
- score por golpe, objeto y enemigo derrotado

## Reglas

- Mantener `attackCooldown = 0.52`.
- Mantener `attackTimer = 0.28`.
- Mantener hitbox `{ x: player.x + player.dir * 68, y: player.y - 18, w: 128, h: 62 }`.
- Mantener dano del ataque en `1`.
- Mantener knockback enemigo `player.dir * 260` y `vy = -120`.
- Mantener score: enemigo golpeado `20`, objeto golpeado `12`, enemigo derrotado `45`.
- Mantener `hitPlayer` con invulnerabilidad `0.7`.

## Validacion Manual

- El chicote/ataque conecta con blocker.
- El ataque empuja enemigos.
- El ataque rompe barricadas/cajas.
- El puntaje sube al golpear.
- El enemigo derrotado desaparece.
- El jugador pierde energia al recibir dano.
- El jugador recibe knockback.
