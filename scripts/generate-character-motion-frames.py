from pathlib import Path
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "public" / "images"
STAGES = [1, 2, 3, 4, 5]


EYES = {
    1: ((420, 560), (590, 560)),
    2: ((420, 560), (590, 560)),
    3: ((420, 555), (592, 555)),
    4: ((420, 555), (592, 555)),
    5: ((420, 545), (592, 545)),
}


def skin_like(pixel):
    r, g, b, a = pixel
    return a > 10 and r > 185 and g > 120 and b > 90 and r >= g >= b * 0.72


def make_blink(stage):
    path = IMAGE_DIR / f"girl-stage-{stage}-transparent.png"
    image = Image.open(path).convert("RGBA")
    draw = ImageDraw.Draw(image, "RGBA")
    for cx, cy in EYES[stage]:
        draw.ellipse((cx - 58, cy - 42, cx + 58, cy + 42), fill=(255, 224, 205, 205))
        draw.arc((cx - 42, cy - 10, cx + 42, cy + 32), 188, 352, fill=(62, 39, 60, 235), width=8)
        draw.arc((cx - 36, cy - 7, cx + 36, cy + 28), 190, 350, fill=(255, 230, 220, 100), width=3)
    image.save(IMAGE_DIR / f"girl-stage-{stage}-blink.png")


def make_wave(stage):
    path = IMAGE_DIR / f"girl-stage-{stage}-transparent.png"
    base = Image.open(path).convert("RGBA")
    width, height = base.size
    pixels = base.load()

    crop_box = (int(width * 0.56), int(height * 0.48), int(width * 0.86), int(height * 0.72))
    crop = base.crop(crop_box)
    mask = Image.new("L", crop.size, 0)
    mask_pixels = mask.load()
    crop_pixels = crop.load()

    for y in range(crop.height):
        for x in range(crop.width):
            if skin_like(crop_pixels[x, y]):
                mask_pixels[x, y] = 255

    skin_patch = Image.new("RGBA", crop.size, (0, 0, 0, 0))
    skin_patch.paste(crop, (0, 0), mask)

    draw = ImageDraw.Draw(base, "RGBA")
    for y in range(crop_box[1], crop_box[3]):
        for x in range(crop_box[0], crop_box[2]):
            if skin_like(pixels[x, y]):
                pixels[x, y] = (0, 0, 0, 0)

    rotated = skin_patch.rotate(-22, resample=Image.Resampling.BICUBIC, expand=True)
    paste_x = crop_box[0] + 22
    paste_y = crop_box[1] - 52
    base.alpha_composite(rotated, (paste_x, paste_y))

    # Small baked-in motion marks belong to the frame image, not DOM overlays.
    draw.arc((paste_x + rotated.width - 70, paste_y + 8, paste_x + rotated.width - 8, paste_y + 70), 205, 288, fill=(167, 139, 250, 160), width=5)
    draw.arc((paste_x + rotated.width - 48, paste_y + 26, paste_x + rotated.width + 4, paste_y + 82), 205, 288, fill=(142, 221, 211, 130), width=4)
    base.save(IMAGE_DIR / f"girl-stage-{stage}-wave.png")


def main():
    for stage in STAGES:
        make_blink(stage)
        make_wave(stage)
        print(f"public/images/girl-stage-{stage}-blink.png")
        print(f"public/images/girl-stage-{stage}-wave.png")


if __name__ == "__main__":
    main()
