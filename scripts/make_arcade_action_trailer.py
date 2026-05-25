from __future__ import annotations

import math
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "output" / "videos"
FRAME_DIR = OUT_DIR / "frames_arcade_action_trailer"
OUT_FILE = OUT_DIR / "la-paz-wir-arcade-action-trailer-15s.mp4"

WIDTH = 1280
HEIGHT = 720
FPS = 30
DURATION = 15
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


def character_source_frames() -> dict[str, Image.Image]:
    sheet = chroma_alpha(load_image("assets/sprites/characters-source-green.png"))
    frames = {
        "hero": (35, 170, 330, 520),
        "blocker": (382, 188, 355, 500),
        "looter": (748, 206, 320, 482),
        "mallku": (1068, 70, 405, 620),
        "miner": (1488, 38, 450, 655),
    }
    return {name: sheet.crop((x, y, x + w, y + h)) for name, (x, y, w, h) in frames.items()}


def cover_crop(image: Image.Image, t: float, scene_start: float, scene_len: float, start: float, end: float) -> Image.Image:
    scale = max(WIDTH / image.width, HEIGHT / image.height)
    scaled = image.resize((math.ceil(image.width * scale), math.ceil(image.height * scale)), Image.Resampling.BICUBIC)
    max_x = max(0, scaled.width - WIDTH)
    progress = min(1, max(0, (t - scene_start) / scene_len))
    x = int(max_x * (start + (end - start) * progress))
    y = max(0, (scaled.height - HEIGHT) // 2)
    return scaled.crop((x, y, x + WIDTH, y + HEIGHT))


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    font_path = Path("C:/Windows/Fonts/arialbd.ttf")
    return ImageFont.truetype(str(font_path), size=size) if font_path.exists() else ImageFont.load_default()


def text(draw: ImageDraw.ImageDraw, value: str, x: int, y: int, size: int, fill: str) -> None:
    f = font(size)
    draw.text((x + 4, y + 4), value, font=f, fill=(0, 0, 0, 210))
    draw.text((x, y), value, font=f, fill=fill)


def center_text(draw: ImageDraw.ImageDraw, value: str, y: int, size: int, fill: str) -> None:
    f = font(size)
    box = draw.textbbox((0, 0), value, font=f)
    x = (WIDTH - (box[2] - box[0])) // 2
    draw.text((x + 5, y + 5), value, font=f, fill=(0, 0, 0, 220))
    draw.text((x, y), value, font=f, fill=fill)


def paste_character(frame: Image.Image, sprite: Image.Image, x: int, ground_y: int, scale: float, t: float, flip: bool = False) -> None:
    char = sprite.transpose(Image.Transpose.FLIP_LEFT_RIGHT) if flip else sprite
    w = int(char.width * scale)
    h = int(char.height * scale)
    char = char.resize((w, h), Image.Resampling.NEAREST)
    bob = int(math.sin(t * 16) * 5)
    lean = math.sin(t * 11) * 2.0
    char = char.rotate(lean, resample=Image.Resampling.NEAREST, expand=True)
    frame.alpha_composite(char, (x - char.width // 2, ground_y - char.height + bob))


def rubble(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float = 1.0) -> None:
    w = int(165 * scale)
    draw.rectangle((x - w // 2, y - 12, x + w // 2, y - 5), fill=(0, 0, 0, 110))
    blocks = [(-76, -32, -38, -9), (-35, -43, 18, -8), (25, -31, 65, -7), (64, -39, 94, -10)]
    colors = [(73, 69, 63), (116, 105, 91), (43, 56, 64), (150, 88, 44)]
    for color, (x1, y1, x2, y2) in zip(colors, blocks):
        draw.rectangle((x + int(x1 * scale), y + int(y1 * scale), x + int(x2 * scale), y + int(y2 * scale)), fill=color, outline=(24, 22, 20))


def barricade(draw: ImageDraw.ImageDraw, x: int, y: int, scale: float = 1.0) -> None:
    w = int(150 * scale)
    h = int(52 * scale)
    draw.rectangle((x - w // 2, y - h, x + w // 2, y - 8), fill=(70, 64, 56), outline=(24, 21, 18), width=3)
    draw.rectangle((x - w // 2 + 12, y - h + 13, x + w // 2 - 12, y - h + 24), fill=(218, 92, 42))
    draw.rectangle((x - w // 2 + 12, y - h + 32, x + w // 2 - 12, y - h + 42), fill=(241, 196, 73))


def explosion(draw: ImageDraw.ImageDraw, x: int, y: int, t: float, start: float) -> None:
    age = t - start
    if age < 0 or age > 0.7:
        return
    r = int(18 + age * 150)
    alpha = int(220 * (1 - age / 0.7))
    draw.ellipse((x - r, y - r, x + r, y + r), fill=(241, 115, 38, alpha))
    draw.ellipse((x - r // 2, y - r // 2, x + r // 2, y + r // 2), fill=(255, 219, 86, min(255, alpha + 20)))
    for i in range(8):
        angle = i * math.pi / 4 + age * 4
        sx = x + int(math.cos(angle) * r * 0.8)
        sy = y + int(math.sin(angle) * r * 0.55)
        draw.rectangle((sx - 5, sy - 5, sx + 5, sy + 5), fill=(35, 35, 35, alpha))


def projectile(draw: ImageDraw.ImageDraw, x: int, y: int) -> None:
    draw.ellipse((x - 8, y - 8, x + 8, y + 8), fill=(238, 216, 150), outline=(50, 43, 32))
    draw.line((x + 8, y, x + 46, y + 8), fill=(255, 240, 170), width=3)


def arcade_hud(draw: ImageDraw.ImageDraw, t: float, scene: int) -> None:
    draw.rectangle((0, 0, WIDTH, 58), fill=(12, 13, 12, 210))
    text(draw, "LA PAZ WIR", 28, 12, 28, "#f7c84f")
    text(draw, f"SCORE {int(2380 + t * 175):06d}", 250, 14, 24, "#ffffff")
    text(draw, "ENERGIA", 520, 14, 22, "#ffffff")
    draw.rectangle((635, 20, 835, 36), outline=(255, 255, 255), width=2)
    draw.rectangle((638, 23, int(638 + 190 * (0.95 - 0.02 * scene)), 33), fill=(112, 207, 118))
    text(draw, "ARMA: CHICOTE", 895, 14, 22, "#ffffff")


def scanlines(draw: ImageDraw.ImageDraw) -> None:
    for y in range(0, HEIGHT, 4):
        draw.line((0, y, WIDTH, y), fill=(0, 0, 0, 34))


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    if FRAME_DIR.exists():
        shutil.rmtree(FRAME_DIR)
    FRAME_DIR.mkdir(parents=True)

    senkata = load_image("assets/backgrounds/zone-01-senkata-disturbios-commercial-gate-v1.png")
    teleferico = load_image("assets/backgrounds/la-paz-teleferico-map-extended-aligned.png")
    city = load_image("assets/backgrounds/avenida-6-marzo-comercial.png")
    chars = character_source_frames()

    for frame_no in range(TOTAL_FRAMES):
        t = frame_no / FPS
        if t < 5:
            scene = 0
            bg = cover_crop(senkata, t, 0, 5, 0.05, 0.72)
        elif t < 10:
            scene = 1
            bg = cover_crop(city, t, 5, 5, 0.0, 0.88)
        else:
            scene = 2
            bg = cover_crop(teleferico, t, 10, 5, 0.12, 0.78)

        frame = bg.convert("RGBA")
        overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay, "RGBA")
        draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(0, 0, 0, 26))
        ground = 632

        if scene == 0:
            hero_x = 160 + int(t * 120)
            rubble(draw, 450, ground)
            barricade(draw, 740, ground)
            paste_character(frame, chars["hero"], hero_x, ground, 0.21, t)
            paste_character(frame, chars["blocker"], 930 - int(t * 28), ground, 0.19, t, True)
            if t > 1.4:
                paste_character(frame, chars["looter"], 1140 - int((t - 1.4) * 70), ground, 0.2, t, True)
            projectile(draw, 685 + int(t * 95), ground - 165)
            explosion(draw, 760, ground - 65, t, 3.1)
            center_text(draw, "DISTRITO COMERCIAL SENKATA", 92, 48, "#ffffff")
        elif scene == 1:
            st = t - 5
            hero_x = 150 + int(st * 115)
            rubble(draw, 360, ground)
            rubble(draw, 610, ground, 0.8)
            barricade(draw, 870, ground)
            paste_character(frame, chars["hero"], hero_x, ground, 0.21, t)
            paste_character(frame, chars["mallku"], 910 - int(st * 35), ground, 0.18, t, True)
            paste_character(frame, chars["blocker"], 1120 - int(st * 58), ground, 0.19, t, True)
            explosion(draw, 610, ground - 72, t, 7.4)
            center_text(draw, "ABRE PASO ENTRE BARRICADAS", 92, 48, "#f7c84f")
        else:
            st = t - 10
            hero_x = 150 + int(st * 100)
            barricade(draw, 520, ground)
            rubble(draw, 680, ground)
            paste_character(frame, chars["hero"], hero_x, ground, 0.21, t)
            paste_character(frame, chars["miner"], 1040 - int(st * 15), ground, 0.18, t, True)
            paste_character(frame, chars["mallku"], 865 - int(st * 45), ground, 0.18, t, True)
            explosion(draw, 825, ground - 90, t, 12.3)
            if st > 3.0:
                center_text(draw, "SOBREVIVE AL BLOQUEO", 290, 72, "#ffffff")
                center_text(draw, "DEMO EN DESARROLLO", 382, 38, "#f7c84f")
            else:
                center_text(draw, "JEFE DE ZONA", 92, 54, "#ffffff")

        arcade_hud(draw, t, scene)
        scanlines(draw)

        for cut in (5, 10):
            if abs(t - cut) < 0.22:
                alpha = int(255 * (1 - abs(t - cut) / 0.22))
                draw.rectangle((0, 0, WIDTH, HEIGHT), fill=(255, 244, 200, max(0, min(210, alpha))))

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
