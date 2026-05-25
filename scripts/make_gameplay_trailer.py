from __future__ import annotations

import math
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "output" / "videos"
FRAME_DIR = OUT_DIR / "frames_gameplay_trailer"
OUT_FILE = OUT_DIR / "la-paz-wir-gameplay-trailer-12s.mp4"

WIDTH = 1280
HEIGHT = 720
FPS = 30
DURATION = 12
TOTAL_FRAMES = FPS * DURATION


def load_image(path: str) -> Image.Image:
    return Image.open(ROOT / path).convert("RGBA")


def chroma_alpha(image: Image.Image) -> Image.Image:
    src = image.convert("RGBA")
    px = src.load()
    for y in range(src.height):
        for x in range(src.width):
            r, g, b, a = px[x, y]
            if a == 0 or (r < 14 and g < 14 and b < 14) or (g > 130 and r < 90 and b < 95):
                px[x, y] = (r, g, b, 0)
    return src


def sprite_frames(path: str, count: int = 4) -> list[Image.Image]:
    sheet = chroma_alpha(load_image(path))
    frame_w = sheet.width // count
    return [sheet.crop((i * frame_w, 0, (i + 1) * frame_w, sheet.height)) for i in range(count)]


def character_source_frames() -> dict[str, Image.Image]:
    sheet = chroma_alpha(load_image("assets/sprites/characters-source-green.png"))
    frames = {
        "hero": (35, 170, 330, 520),
        "blocker": (382, 188, 355, 500),
        "looter": (748, 206, 320, 482),
        "mallku": (1068, 70, 405, 620),
        "miner": (1488, 38, 450, 655),
    }
    return {
        name: sheet.crop((x, y, x + w, y + h))
        for name, (x, y, w, h) in frames.items()
    }


def cover_crop(image: Image.Image, t: float, scene: int) -> Image.Image:
    scale = max(WIDTH / image.width, HEIGHT / image.height)
    scaled = image.resize((math.ceil(image.width * scale), math.ceil(image.height * scale)), Image.Resampling.BICUBIC)
    max_x = max(0, scaled.width - WIDTH)
    if scene == 0:
        x = int(max_x * min(1, t / 6))
    else:
        x = int(max_x * (0.18 + 0.62 * min(1, (t - 6) / 6)))
    y = max(0, (scaled.height - HEIGHT) // 2)
    return scaled.crop((x, y, x + WIDTH, y + HEIGHT))


def paste_sprite(frame: Image.Image, frames: list[Image.Image], x: int, ground_y: int, scale: float, t: float, flip: bool = False) -> None:
    sprite = frames[int(t * 8) % len(frames)]
    if flip:
        sprite = sprite.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    w = int(sprite.width * scale)
    h = int(sprite.height * scale)
    sprite = sprite.resize((w, h), Image.Resampling.NEAREST)
    bob = int(math.sin(t * 14) * 3)
    frame.alpha_composite(sprite, (x - w // 2, ground_y - h + bob))


def paste_character(frame: Image.Image, sprite: Image.Image, x: int, ground_y: int, scale: float, t: float, flip: bool = False) -> None:
    if flip:
        sprite = sprite.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
    w = int(sprite.width * scale)
    h = int(sprite.height * scale)
    sprite = sprite.resize((w, h), Image.Resampling.NEAREST)
    bob = int(math.sin(t * 10) * 5)
    lean = math.sin(t * 8) * 1.5
    sprite = sprite.rotate(lean, resample=Image.Resampling.NEAREST, expand=True)
    frame.alpha_composite(sprite, (x - sprite.width // 2, ground_y - sprite.height + bob))


def draw_text(draw: ImageDraw.ImageDraw, text: str, xy: tuple[int, int], size: int, fill: str) -> None:
    font_path = Path("C:/Windows/Fonts/arialbd.ttf")
    font = ImageFont.truetype(str(font_path), size=size) if font_path.exists() else ImageFont.load_default()
    x, y = xy
    draw.text((x + 3, y + 3), text, font=font, fill=(0, 0, 0, 190))
    draw.text((x, y), text, font=font, fill=fill)


def draw_rubble(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    draw.rectangle((x - 70, y - 12, x + 70, y - 5), fill=(0, 0, 0, 95))
    colors = [(82, 76, 68), (119, 109, 93), (48, 58, 65), (142, 86, 46)]
    pieces = [(-62, -25, -28, -8), (-30, -34, 12, -7), (14, -24, 48, -6), (45, -31, 70, -8)]
    for i, (x1, y1, x2, y2) in enumerate(pieces):
        draw.rectangle((x + x1, y + y1, x + x2, y + y2), fill=colors[i], outline=(29, 26, 23))


def draw_barricade(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    draw.rectangle((x - 70, y - 48, x + 70, y - 8), fill=(72, 65, 56), outline=(25, 22, 19), width=3)
    draw.rectangle((x - 62, y - 36, x + 62, y - 25), fill=(214, 93, 47))
    draw.rectangle((x - 62, y - 20, x + 62, y - 11), fill=(238, 191, 69))


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if FRAME_DIR.exists():
        shutil.rmtree(FRAME_DIR)
    FRAME_DIR.mkdir(parents=True)

    senkata = load_image("assets/backgrounds/zone-01-senkata-disturbios-commercial-gate-v1.png")
    teleferico = load_image("assets/backgrounds/la-paz-teleferico-map-extended-aligned.png")
    characters = character_source_frames()

    for frame_no in range(TOTAL_FRAMES):
        t = frame_no / FPS
        scene = 0 if t < 6 else 1
        bg = cover_crop(senkata if scene == 0 else teleferico, t, scene)
        frame = bg.convert("RGBA")
        overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        ground = 625
        draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(0, 0, 0, 34))

        if scene == 0:
            hero_x = int(180 + 68 * t)
            draw_rubble(draw, 500, ground)
            draw_barricade(draw, 820, ground)
            paste_character(frame, characters["hero"], hero_x, ground, 0.2, t)
            paste_character(frame, characters["blocker"], int(990 - 24 * t), ground, 0.19, t, flip=True)
            if t > 2.3:
                paste_character(frame, characters["looter"], int(1190 - 45 * (t - 2.3)), ground, 0.2, t, flip=True)
            draw_text(draw, "LA PAZ WIR", (54, 46), 58, "#ffffff")
            draw_text(draw, "Senkata en conflicto", (56, 115), 34, "#f7c84f")
        else:
            st = t - 6
            hero_x = int(160 + 84 * st)
            draw_rubble(draw, 430, ground)
            draw_barricade(draw, 720, ground)
            paste_character(frame, characters["hero"], hero_x, ground, 0.2, t)
            paste_character(frame, characters["mallku"], int(880 - 36 * st), ground, 0.18, t, flip=True)
            if st > 2:
                paste_character(frame, characters["miner"], 1070, ground, 0.18, t, flip=True)
            draw_text(draw, "Nuevas zonas", (54, 46), 52, "#ffffff")
            draw_text(draw, "enemigos, barricadas y caos urbano", (56, 112), 32, "#f7c84f")
            if st > 4:
                draw_text(draw, "PROXIMAMENTE", (WIDTH // 2 - 245, HEIGHT - 135), 64, "#ffffff")

        if 5.72 < t < 6.28:
            alpha = int(255 * (1 - abs(t - 6) / 0.28))
            draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(0, 0, 0, max(0, min(255, alpha))))

        frame.alpha_composite(overlay)
        frame.convert("RGB").save(FRAME_DIR / f"frame_{frame_no:04d}.jpg", quality=92)

    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        candidates = list(Path.home().glob("AppData/Local/Microsoft/WinGet/Packages/**/ffmpeg.exe"))
        if candidates:
            ffmpeg = str(candidates[0])
    if not ffmpeg:
        raise RuntimeError("No se encontro ffmpeg")

    subprocess.run(
        [
            ffmpeg,
            "-y",
            "-framerate",
            str(FPS),
            "-i",
            str(FRAME_DIR / "frame_%04d.jpg"),
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-r",
            str(FPS),
            str(OUT_FILE),
        ],
        check=True,
    )
    print(OUT_FILE)


if __name__ == "__main__":
    main()
