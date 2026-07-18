from collections import deque
from pathlib import Path
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "public" / "images"
FILES = [
    "girl-normal.png",
    "girl-stage-1.png",
    "girl-stage-2.png",
    "girl-stage-3.png",
    "girl-stage-4.png",
    "girl-stage-5.png",
]


def is_bg_candidate(pixel, strict=False):
    r, g, b, _ = pixel
    high = 246 if strict else 232
    chroma = 22 if strict else 34
    return min(r, g, b) >= high and (max(r, g, b) - min(r, g, b)) <= chroma


def transparent_name(name):
    return name.replace(".png", "-transparent.png")


def remove_background(path):
    image = Image.open(path).convert("RGBA")
    width, height = image.size
    pixels = image.load()
    visited = set()
    queue = deque()

    def enqueue(x, y):
        if (x, y) not in visited and is_bg_candidate(pixels[x, y], strict=True):
            visited.add((x, y))
            queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited and is_bg_candidate(pixels[nx, ny]):
                visited.add((nx, ny))
                queue.append((nx, ny))

    soft_bg = set(visited)
    for _ in range(3):
        additions = set()
        for x, y in soft_bg:
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in soft_bg and is_bg_candidate(pixels[nx, ny]):
                    additions.add((nx, ny))
        soft_bg.update(additions)

    output = Image.new("RGBA", image.size)
    out = output.load()
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            if (x, y) in soft_bg:
                out[x, y] = (r, g, b, 0)
            else:
                out[x, y] = (r, g, b, a)

    target = path.with_name(transparent_name(path.name))
    output.save(target, "PNG")
    return target


def main():
    for name in FILES:
        target = remove_background(IMAGE_DIR / name)
        print(target.relative_to(ROOT))


if __name__ == "__main__":
    main()
