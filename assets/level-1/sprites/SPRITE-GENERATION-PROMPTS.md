# Level 1 Sprite Generation Prompts

Use these prompts to generate high-quality sprite sheets for `Calle Pacena`.

Generate one character at a time. Do not ask for all characters in one image. One image per character gives better anatomy, cleaner silhouettes, and more usable game-ready sprite sheets.

## Shared Requirements

Use these requirements for every character prompt:

```text
Create a high-quality 2D arcade pixel-art sprite sheet for a side-scrolling beat-em-up game.

Sprite sheet: 4 horizontal walk-cycle frames in one row. Same character, same scale, same proportions, consistent pose progression. Each frame must show the full body from head to boots. Feet aligned on the same baseline.

Style: premium hand-painted pixel art, 1990s arcade game quality, crisp black outline, detailed clothing folds, strong silhouette, high contrast, readable face, polished game-ready sprite, similar fidelity to Metal Slug-inspired arcade sprites but original design.

Canvas: wide transparent PNG or flat #00ff00 chroma-key background, no scenery, no ground, no cast shadow, no text, no watermark.

Constraints: no cropped limbs, no duplicated body parts, no broken anatomy, no blurry edges, no realistic painting, no vector style, no 3D render, no huge empty padding.
```

Recommended target sizes after cleanup:

```text
Hero walk:       612x198 total, 4 frames
Hero attack:     612x198 total, 4 frames
Normal enemies:  around 660x198 total, 4 frames
Mallku enemy:    around 616x198 total, 4 frames
Miner boss:      around 756x238 total, 4 frames
Helper:          around 688x238 total, 4 frames
Police ally:     around 144x198 single sprite, or 576x198 if animated
Shop:            around 256x218 single object sprite
```

Recommended workflow:

1. Generate one sprite sheet on `#00ff00`.
2. Remove chroma key to transparency.
3. Crop and resize to the target sheet dimensions.
4. Clean edges and animation frames in Aseprite, LibreSprite, or another pixel editor.
5. Export PNG into `assets/level-1/sprites`.
6. Wire the final file in `src/data/assets.mjs`.

## Hero Walk

Output filename:

```text
hero-walk.png
```

Prompt:

```text
Create a high-quality 2D arcade pixel-art sprite sheet for a side-scrolling beat-em-up game.

Subject: fictional Bolivian street hero character, full body, side-view 3/4 profile, readable at small game size. He is a young urban defender with a determined face, visible eyes and eyebrows, blue knitted chullo or beanie with white Andean pattern, dark blue sleeveless jacket over a cream long-sleeve shirt, patched blue jeans, brown boots, fingerless gloves, and a small woven aguayo cloth or sling bag. He carries a short wooden baton/chicote handle at his side, but he is not attacking in this sheet.

Sprite sheet: 4 horizontal walk-cycle frames in one row. Same character, same scale, same proportions, consistent walking pose progression. Each frame must show the full body from head to boots. Feet aligned on the same baseline.

Style: premium hand-painted pixel art, 1990s arcade game quality, crisp black outline, detailed clothing folds, strong silhouette, high contrast, readable face, polished game-ready sprite, original design.

Canvas: wide transparent PNG or flat #00ff00 chroma-key background. No scenery, no ground, no cast shadow, no text, no watermark.

Constraints: no cropped limbs, no duplicated body parts, no broken anatomy, no blurry edges, no realistic painting, no vector style, no 3D render, no huge empty padding.
```

## Hero Chicote Attack

Output filename:

```text
hero-chicote-attack.png
```

Prompt:

```text
Create a high-quality 2D arcade pixel-art attack sprite sheet for a side-scrolling beat-em-up game.

Subject: the same fictional Bolivian street hero character from the walk cycle, full body, side-view 3/4 profile. He wears a blue knitted chullo or beanie, dark blue sleeveless jacket, cream long-sleeve shirt, patched jeans, brown boots, fingerless gloves, and a woven sling bag. He attacks with a flexible chicote/whip-like rope weapon, shown in a clear sweeping arc.

Sprite sheet: 4 horizontal attack frames in one row. Same character, same scale, same proportions. Frame 1 wind-up, frame 2 swing start, frame 3 full extension with visible whip arc, frame 4 recovery. Each frame must show full body from head to boots. Feet aligned on the same baseline.

Style: premium hand-painted pixel art, 1990s arcade action game quality, crisp black outline, dynamic pose, readable weapon arc, high contrast, polished game-ready sprite, original design.

Canvas: wide transparent PNG or flat #00ff00 chroma-key background. No scenery, no ground, no cast shadow, no text, no watermark.

Constraints: no cropped whip, no cropped limbs, no duplicated body parts, no broken anatomy, no blurry edges, no realistic painting, no vector style, no 3D render, no huge empty padding.
```

## Blocker Enemy

Output filename:

```text
blocker-walk.png
```

Prompt:

```text
Create a high-quality 2D arcade pixel-art sprite sheet for a side-scrolling beat-em-up game.

Subject: fictional Bolivian urban blocker enemy, full body, side-view 3/4 profile, readable at small game size. He wears a dark construction helmet or hard cap, red scarf covering the lower face, intense visible eyes, worn red sweater, dark utility vest, grey work pants with knee patches, brown boots, fingerless gloves, and a small backpack. He carries a stone in one hand ready to throw.

Sprite sheet: 4 horizontal walk-cycle frames in one row. Same character, same scale, same proportions, consistent pose progression. Each frame must show the full body from head to boots. Feet aligned on the same baseline.

Style: premium hand-painted pixel art, 1990s arcade game quality, crisp black outline, detailed clothing folds, strong silhouette, high contrast, readable face, polished game-ready sprite, original design.

Canvas: wide transparent PNG or flat #00ff00 chroma-key background. No scenery, no ground, no cast shadow, no text, no watermark.

Constraints: no cropped limbs, no duplicated body parts, no broken anatomy, no blurry edges, no realistic painting, no vector style, no 3D render, no huge empty padding.
```

## Looter Enemy

Output filename:

```text
looter-walk.png
```

Prompt:

```text
Create a high-quality 2D arcade pixel-art sprite sheet for a side-scrolling beat-em-up game.

Subject: a fictional Bolivian urban looter/thief enemy character, full body, side-view 3/4 profile, readable at small game size. He wears a dark helmet or beanie, red face covering over nose and mouth, intense visible eyes, worn red jacket, dark vest, grey patched pants, brown boots, fingerless gloves, and a small backpack/sack. He holds a stolen bundle or small crate in one hand.

Sprite sheet: 4 horizontal walk-cycle frames in one row. Same character, same scale, same proportions, consistent pose progression. Each frame must show the full body from head to boots. Feet aligned on the same baseline.

Style: premium hand-painted pixel art, 1990s arcade game quality, crisp black outline, detailed clothing folds, strong silhouette, high contrast, readable face, polished game-ready sprite, similar fidelity to Metal Slug-inspired arcade sprites but original design.

Canvas: wide transparent PNG or flat #00ff00 chroma-key background, no scenery, no ground, no cast shadow, no text, no watermark.

Constraints: no cropped limbs, no duplicated body parts, no broken anatomy, no blurry edges, no realistic painting, no vector style, no 3D render, no huge empty padding.
```

## Mallku Enemy

Output filename:

```text
mallku-walk.png
```

Prompt:

```text
Create a high-quality 2D arcade pixel-art sprite sheet for a side-scrolling beat-em-up game.

Subject: fictional Bolivian mallku-style melee enemy, full body, side-view 3/4 profile, readable at small game size. He wears a dark brimmed hat with a colorful woven band, purple poncho with orange Andean geometric trim, dark pants, sandals or rugged shoes, fingerless gloves, and a cloth mask covering the lower face. His visible eyes are intense and expressive. He carries a flexible chicote/whip held high, giving him a dangerous melee silhouette.

Sprite sheet: 4 horizontal walk-cycle frames in one row. Same character, same scale, same proportions, consistent pose progression. Each frame must show the full body from head to boots or sandals. Feet aligned on the same baseline.

Style: premium hand-painted pixel art, 1990s arcade game quality, crisp black outline, detailed poncho folds and woven trim, strong silhouette, high contrast, readable face, polished game-ready sprite, original design.

Canvas: wide transparent PNG or flat #00ff00 chroma-key background. No scenery, no ground, no cast shadow, no text, no watermark.

Constraints: no cropped whip, no cropped limbs, no duplicated body parts, no broken anatomy, no blurry edges, no realistic painting, no vector style, no 3D render, no huge empty padding.
```

## Miner Boss

Output filename:

```text
miner-walk.png
```

Prompt:

```text
Create a high-quality 2D arcade pixel-art boss sprite sheet for a side-scrolling beat-em-up game.

Subject: fictional Bolivian miner boss enemy, large full-body character, side-view 3/4 profile, readable at small game size but bigger than normal enemies. He wears a brown mining helmet with headlamp, rugged tan mining jacket, red scarf, heavy gloves, utility belt, dark reinforced pants, knee pads, and heavy work boots. He has a stern face with visible eyes and mustache. He holds a lit dynamite stick in one hand and carries a wooden supply crate or mining pack on his back.

Sprite sheet: 4 horizontal walk-cycle frames in one row. Same character, same scale, same proportions, heavy boss-like walking pose progression. Each frame must show the full body from helmet to boots. Feet aligned on the same baseline.

Style: premium hand-painted pixel art, 1990s arcade boss sprite quality, crisp black outline, detailed rugged clothing, strong bulky silhouette, high contrast, readable face, polished game-ready sprite, original design.

Canvas: wide transparent PNG or flat #00ff00 chroma-key background. No scenery, no ground, no cast shadow, no text, no watermark.

Constraints: no cropped dynamite flame, no cropped limbs, no duplicated body parts, no broken anatomy, no blurry edges, no realistic painting, no vector style, no 3D render, no huge empty padding.
```

## Food Helper

Output filename:

```text
senora-pollera-helper-detailed-walk.png
```

Prompt:

```text
Create a high-quality 2D arcade pixel-art helper NPC sprite sheet for a side-scrolling beat-em-up game.

Subject: fictional Bolivian market helper woman, full body, side-view 3/4 profile, readable at small game size. She wears a bowler hat, braided dark hair, warm expressive face, colorful shawl, blue blouse, layered pollera skirt with magenta and orange details, black shoes, and carries a small food basket or wrapped meal. She should look friendly and helpful, not like an enemy.

Sprite sheet: 4 horizontal walk-cycle frames in one row. Same character, same scale, same proportions, gentle walking pose progression. Each frame must show the full body from hat to shoes. Feet aligned on the same baseline.

Style: premium hand-painted pixel art, 1990s arcade game quality, crisp black outline, detailed clothing folds, colorful woven fabric, strong silhouette, high contrast, readable face, polished game-ready sprite, original design.

Canvas: wide transparent PNG or flat #00ff00 chroma-key background. No scenery, no ground, no cast shadow, no text, no watermark.

Constraints: no cropped limbs, no duplicated body parts, no broken anatomy, no blurry edges, no realistic painting, no vector style, no 3D render, no huge empty padding.
```

## Food Helper Single Pose

Output filename:

```text
senora-pollera-helper.png
```

Prompt:

```text
Create a high-quality 2D arcade pixel-art single character sprite for a side-scrolling beat-em-up game.

Subject: fictional Bolivian market helper woman, full body, side-view 3/4 profile. She wears a bowler hat, braided dark hair, friendly expressive face, colorful shawl, blue blouse, layered pollera skirt, black shoes, and carries a small food basket or wrapped meal. She should look friendly and helpful.

Composition: one full-body character centered, feet visible, no cropping.

Style: premium hand-painted pixel art, 1990s arcade game quality, crisp black outline, readable face, colorful clothing, polished game-ready sprite, original design.

Background: perfectly flat #00ff00 chroma-key background for removal. Do not use green in the character.

Avoid: text, watermark, scenery, shadows, blur, 3D render, vector art, broken anatomy.
```

## Police Ally

Output filename:

```text
police-ally.png
```

Prompt:

```text
Create a high-quality 2D arcade pixel-art single character sprite for a side-scrolling beat-em-up game.

Subject: fictional police ally NPC, full body, side-view 3/4 profile, readable at small game size. He wears a blue police cap, blue uniform jacket, dark pants, black boots, utility belt, gloves, and has a clear determined face. He should look like an ally support character, not the main hero and not a boss.

Composition: one full-body character centered, feet visible, no cropping.

Style: premium hand-painted pixel art, 1990s arcade game quality, crisp black outline, detailed uniform, strong silhouette, readable face, polished game-ready sprite, original design.

Background: perfectly flat #00ff00 chroma-key background for removal. Do not use green in the character.

Avoid: text, watermark, scenery, shadows, blur, 3D render, vector art, broken anatomy.
```

## Paceno Shop Object

Output filename:

```text
kiosco-paceno-game.png
```

Prompt:

```text
Create a high-quality 2D arcade pixel-art shop object for a side-scrolling beat-em-up game.

Subject: fictional La Paz market kiosk / small street shop, front-facing with slight 3/4 depth, game-ready object sprite. It has a turquoise worn wall, colorful striped awning, corrugated metal roof, fruit crates, soda bottles, hanging snack bags, woven aguayo cloth patterns, a small shutter door, and visible weathered details. The shop should be readable at small size and usable as an interactable protectable object.

Composition: one complete shop object centered, full object visible, no cropping. Keep clear silhouette and generous padding.

Style: premium hand-painted pixel art, 1990s arcade environment object quality, crisp black outline, detailed but readable, colorful Bolivian market feel, polished game-ready sprite, original design.

Background: perfectly flat #00ff00 chroma-key background for removal. Do not use green in the shop.

Avoid: text, watermark, scenery, ground plane, cast shadow, blur, 3D render, vector art, broken perspective.
```

## Props And Pickups Sheet

Output filename:

```text
props-pickups.png
```

Prompt:

```text
Create a high-quality 2D arcade pixel-art prop and pickup sprite sheet for a side-scrolling beat-em-up game.

Subject: small game props and pickups in one clean sheet: wooden barricade, wooden crate, gas mask pickup, thrown stone, dynamite stick with small fuse, coin, food bundle, ammo bundle, small health kit, and small bottle pickup. Each item should be a separate readable pixel-art object with crisp outline and no overlap.

Sprite sheet: items arranged in a clean grid with consistent padding. Each object fully visible and isolated. No labels.

Style: premium hand-painted pixel art, 1990s arcade game quality, crisp black outline, high contrast, readable at small size, polished game-ready props, original designs.

Canvas: transparent PNG or flat #00ff00 chroma-key background. No scenery, no ground, no cast shadow, no text, no watermark.

Constraints: no cropped objects, no blurry edges, no realistic painting, no vector style, no 3D render, no huge empty padding.
```

