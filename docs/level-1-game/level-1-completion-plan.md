# Level 1 Completion Plan - Calle Pacena

Date: 2026-05-24

## Point Of View

The next goal should not be "more content everywhere." The next goal should be one complete, readable, fun, replayable first level. The current project already has enough pieces to make that happen: player movement, melee combat, waves, shops, barricades, pickups, enemies, projectiles, gas, helper food, allies, boss logic, backgrounds, sprites, HUD, and object pools.

The best next step is to turn Level 1 into a polished 3 to 5 minute vertical slice. After that, new weapons, players, effects, enemies, and maps will have a stable gameplay frame to plug into.

## Current State Observations

- The codebase is now modular under `src/`, not a single `game.js` prototype anymore.
- `src/data/levels.mjs` defines two levels: `street` and `teleferico`.
- `street / Calle Pacena` is the real first-level candidate.
- `src/app/game-state.mjs` currently starts with `levelIndex: 1`, which means the game starts on `teleferico`. For Level 1 work, this should become `levelIndex: 0`.
- Player movement values are hardcoded in `src/gameplay/player.mjs`.
- Weapon data exists in `src/data/weapons.mjs`, but the combat system still hardcodes whip cooldown, range, damage, active time, and knockback.
- Enemy stats are data-driven in `src/data/enemies.mjs`, but wave composition is still hardcoded in `src/gameplay/waves.mjs`.
- Level objects are repeated mechanically across the full level width, which creates play space quickly but can feel flat.
- Boss trigger is time-based at 180 seconds, while the final encounter gate is also time-based in runtime code.
- Performance work has started: object pools are connected to particles and projectiles.

## Recommendation

Finish Level 1 in this order:

1. Fix the playable baseline.
2. Tune the core feel.
3. Make the level data-driven.
4. Add 2 to 3 meaningful obstacle types.
5. Improve feedback and readability.
6. Add one secondary weapon only after the basic combat loop feels good.
7. Add victory, defeat, pause, and restart polish.

Do not add many players, many weapons, or several new enemy families yet. That will make the project bigger without making the first level better. A complete first level needs clarity, pacing, feedback, and fair difficulty more than it needs a large feature list.

## Target Level 1 Experience

Working title: `Calle Pacena`

Duration: 3 to 5 minutes.

Player fantasy: "Open the route, protect small shops, survive waves, and break through the final bloqueo."

Win condition:

- Defeat the final miner boss group.
- Reach the end gate alive.
- Protect at least 2 shops.

Lose condition:

- Energy reaches 0.
- Optional later: too many shops destroyed.

Recommended first-level objective text:

```text
Abre paso, protege los negocios y llega al final de la calle.
```

## Core Tuning Recommendations

These are starting values, not permanent values. Tune by playtesting in 10 minute passes.

### Player Movement

Current values in `src/gameplay/player.mjs`:

```js
accel = 1700
friction = 0.78 grounded / 0.94 air
maxSpeed = 205
jumpVelocity = -520
gravity = 1200
```

Recommended Level 1 pass:

```js
accel = 1850
groundFriction = 0.80
airFriction = 0.955
maxSpeed = 225
jumpVelocity = -555
gravity = 1280
```

Reasoning:

- Slightly faster horizontal movement makes a 30000px map less exhausting.
- Slightly higher jump gives room for barricades, crates, and projectile dodging.
- Slightly higher gravity keeps the jump from feeling floaty.
- Air friction should be loose enough to adjust landing, but not so loose that the player slides forever.

### Combat Feel

Current whip data in `src/data/weapons.mjs` is:

```js
damage: 1
cooldown: 0.52
activeTime: 0.28
range: 128
height: 62
knockback: 260
```

Recommended Level 1 pass:

```js
damage: 1
cooldown: 0.46
activeTime: 0.22
range: 118
height: 66
knockback: 290
```

Reasoning:

- A faster cooldown makes the first weapon feel more responsive.
- A slightly shorter range reduces "invisible reach."
- More knockback gives crowd control and clearer hit confirmation.
- Combat should use `weaponDefinitions.whip` instead of hardcoded values in `combat.mjs`.

### Player Durability

Current energy starts at 100.

Recommended Level 1 damage targets:

```text
stone: 8-10
contact blocker/looter: 8
mallku contact: 12-14
mallku melee: 16
dynamite: 18-20
gas tick without mask: 5
gas tick with mask: 2
food heal: 24
shop save heal: 8
```

Reasoning:

- The player should survive several mistakes.
- Dynamite should be scary but not randomly run-ending.
- Gas should pressure movement, not feel like instant failure.
- Healing should reward interacting with level objectives.

## Level 1 Pacing

Replace purely time-driven waves with level-position beats. Time can still be used as a backup, but the player should feel that progress through the street creates encounters.

Recommended Level 1 structure:

```text
0-300px       Start, no enemies, movement warmup
480px         Barricade tutorial
760px         Shop 1 protection tutorial
1100px        First 2 blockers
1600px        Shop 2 plus looter
2300px        Barricade plus mixed wave
3200px        Food helper moment
4200px        Gas mask pickup preview
5200px        Mallku introduced alone
6500px        Mixed wave: blocker + looter + mallku
7800px        Short breather, pickups, shop
9000px        Boss arena gate
9500px        Miner boss group
10200px       Finish stretch
```

For now, Level 1 does not need to use the full 30000px width. A shorter, denser level will be more fun. Recommended first target:

```js
width: 11000
bossTriggerX: 9000
```

Keep the long background; just clamp the playable finish earlier.

## Data-Driven Level Design

The level should own its waves, spawns, pickups, and set pieces. This makes tuning faster and avoids editing runtime systems for every gameplay change.

Recommended shape for `src/data/levels.mjs`:

```js
{
  id: "street",
  name: "Calle Pacena",
  width: 11000,
  ground: 590,
  bossTriggerX: 9000,
  requiredSavedShops: 2,
  objects: [...],
  pickups: [...],
  encounters: [
    {
      id: "first-blockers",
      triggerX: 1100,
      gate: true,
      groups: [
        ["blocker", "blocker"],
      ],
    },
    {
      id: "shop-pressure",
      triggerX: 1600,
      gate: true,
      groups: [
        ["looter"],
        ["blocker", "looter"],
      ],
    },
  ],
}
```

This is the single most important architecture step for making Level 1 enjoyable.

## Obstacles To Add Next

Add obstacles that create decisions, not just decoration.

### 1. Low Barricade

Purpose: teaches attack and jump.

Behavior:

- Blocks walking.
- Can be jumped over if low.
- Can be destroyed with 2 to 3 hits.
- Creates small dust particles when hit.

### 2. Burning Tire / Smoke Patch

Purpose: creates positioning challenge.

Behavior:

- Small area hazard.
- Deals low damage over time.
- Can be temporarily cleared by future water item.
- Uses a strict cap: 3 active smoke patches visible.

### 3. Rolling Tire Or Motorizado Pass

Purpose: adds a dodge moment without adding a full enemy AI.

Behavior:

- Moves horizontally.
- Can be jumped over.
- Damages player on contact.
- Despawns off camera.
- Appears once before boss, not constantly.

Do not add moving platforms yet. They will cost more time than they add to this first level.

## Weapons Roadmap

Add only one new weapon for Level 1: `honda`.

Why:

- It already exists in `src/data/weapons.mjs`.
- It gives the player an answer to stone throwers.
- It introduces ammo pickups without needing a full shop system.

Level 1 weapon plan:

```text
Start: chicote only
Mid-level pickup: honda with 6 ammo
Ammo pickups: small, limited, placed before blocker-heavy waves
Boss: honda helps but is not required
```

Do not add shield, megaphone, petardo, charango, multiple player characters, or upgrades before the first level is complete. Those are Sprint 2 or Sprint 3 features.

## Enemy Recommendations

Use the current enemy set, but make each one teach a clear behavior.

### Blocker

Role: ranged pressure.

Recommended Level 1:

- Appears first.
- Low HP.
- Telegraph stone throw with a short windup.
- Stone damage reduced slightly.

### Looter

Role: objective pressure.

Recommended Level 1:

- Introduce next to a shop.
- Make them visibly prefer shops.
- Give the player a message when a shop is under attack.

### Mallku

Role: melee threat.

Recommended Level 1:

- Introduce alone.
- Use sparingly.
- Do not spawn many mallkus in the first level. The current wave set can create too many.

### Miner Boss

Role: final test.

Recommended Level 1:

- One main boss plus one support enemy is enough.
- Dynamite first, gas second phase.
- Police allies can appear as a cinematic assist, but the player should still need to participate.

## Feedback And Game Feel

This is where the game will start feeling enjoyable.

Must-have Level 1 polish:

- Camera shake on dynamite and boss hits.
- Short hit pause on successful melee hit.
- Stronger hit sparks.
- Enemy defeat pop.
- Shop saved pop.
- Player hurt flash.
- Low energy warning.
- Boss health bar.
- Objective text in HUD.
- Clear victory screen with score, shops saved, time, and grade.

Optional if time allows:

- Combo counter.
- Floating score text.
- Screen edge warning for incoming projectile.
- Simple music loop and 6 to 8 sound effects.

## Visual Asset Priorities

Use the assets already present before generating many new ones.

Highest priority:

- Make hero walk, idle, jump, attack, and hurt states readable.
- Make blocker, looter, mallku, miner silhouettes distinct.
- Create small sprites for stone, dynamite, gas, coin, ammo, food, mask.
- Make barricades visually distinct from shops.

Do not chase a large tileset yet. The current background art can carry the first demo if gameplay objects are readable.

## Technical Implementation Order

### Step 1 - Correct Level 1 Boot

- Set default `levelIndex` to `0`.
- Confirm the start button launches `Calle Pacena`.
- Keep `teleferico` as a later level, not the current default.

### Step 2 - Create Tuning Data

Add a small player tuning module, for example:

```text
src/data/player-tuning.mjs
```

Move these values there:

- acceleration
- max speed
- jump velocity
- gravity
- friction
- invincibility seconds
- starting energy

### Step 3 - Connect Weapon Data To Combat

Update `combat.mjs` to use `weaponDefinitions.whip`.

This makes weapon tuning real instead of duplicated between data and runtime code.

### Step 4 - Move Waves Into Level Data

Replace `waveEnemies(index)` hardcoding with `level.encounters`.

This is required before adding more obstacles and set pieces.

### Step 5 - Shorten And Densify Level 1

Set `street.width` around `11000`.

Place objects manually for the first pass instead of relying only on `objectRepeat`.

### Step 6 - Add Honda Pickup And Ammo

Implement the smallest possible version:

- state has `weapon`, `ammo`
- attack button uses honda only when selected
- add simple switch control later if needed
- pickup grants honda plus ammo

If weapon switching feels like too much, make honda a temporary ammo weapon: while ammo > 0, alternate attack fires honda; otherwise use chicote.

### Step 7 - Boss Gate And Victory

Trigger boss by position, not only by elapsed time.

Recommended:

```text
When player reaches bossTriggerX:
  close gate
  clear active waves
  spawn boss group
  show boss bar
When boss defeated:
  open gate
  allow finish
```

## Definition Of Done For Level 1

Level 1 is done when:

- Game starts on `Calle Pacena`.
- A new player can understand the objective in 5 seconds.
- The first 30 seconds teach movement, attack, and shop protection.
- There are 4 to 6 authored encounters.
- There are 2 to 3 obstacle types.
- There is at least one meaningful pickup.
- There is one boss encounter.
- Victory and defeat screens work.
- The level takes 3 to 5 minutes.
- The player can win without perfect play.
- The game still runs smoothly on a mid-range phone.

## What I Would Do Next

My recommended next sprint:

1. Fix default level to `street`.
2. Add `player-tuning.mjs`.
3. Make combat consume `weaponDefinitions.whip`.
4. Convert Level 1 waves to `encounters` in `levels.mjs`.
5. Shorten Level 1 to about `11000px`.
6. Hand-place the first 10 to 12 objects.
7. Add boss trigger by `x`, not time.
8. Add boss health bar and stronger hit feedback.
9. Playtest and tune movement/combat before adding more content.

After that, add `honda` and ammo. Then add smoke/tire hazards. Then add audio. That order gives the fastest path to a playable and enjoyable first level.

