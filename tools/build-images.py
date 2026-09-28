#!/usr/bin/env python3
"""Optimalizált webes képváltozatok készítése.

Használat (a repository gyökeréből):
    pip install pillow
    python3 tools/build-images.py

Mit csinál?
- Végigmegy az eredeti képeken (public/images/<mappa>/*.jpg|png, public/images/*.jpg).
- Mindegyikből WebP változatokat készít több szélességben ide: public/images/web/...
  Az eredeti fájlokhoz nem nyúl. (A Next.js <Image> ezekből a változatokból
  optimalizál tovább a böngészőnek megfelelő méretre és formátumra.)
- Legenerálja a lib/image-manifest.json fájlt (képméretek, elérhető szélességek).
- Elkészíti a közösségi megosztási képet: public/images/web/og-image.jpg (1200×630).

Csak a hiányzó vagy elavult változatokat generálja újra, így bátran futtatható többször.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:  # pragma: no cover
    sys.exit("Hiányzik a Pillow: pip install pillow")

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "public" / "images"
OUT = IMAGES / "web"
MANIFEST = ROOT / "lib" / "image-manifest.json"

# Ezekben a mappákban lévő képekből készülnek webes változatok.
SOURCE_DIRS = ["hero", "eskuvo", "event", "koncert", "portraits", "gastro", "film", "about"]
# Egyedi fájlok (borítók, portré).
SOURCE_FILES = [
    "headline.jpg",
    "koncert.jpg",
    "gastro.jpg",
    "about-photo.jpg",
    "dokumentumfilm.jpg",
    "visual-storytelling.jpg",
    "weddings-video.jpg",
]
WIDTHS = [480, 960, 1600, 2400]
QUALITY = 80

# Megosztási kép: forrás és a kivágás vízszintes/függőleges fókuszpontja (0–1).
OG_SOURCE = "hero/eskuvo-mezo.jpg"
OG_FOCUS = (0.5, 0.5)


def out_base(src: Path) -> Path:
    return OUT.joinpath(src.relative_to(IMAGES)).with_suffix("")


def url(path: Path) -> str:
    return "/" + str(path.relative_to(ROOT / "public")).replace("\\", "/")


def collect() -> list[Path]:
    files: list[Path] = []
    for d in SOURCE_DIRS:
        folder = IMAGES / d
        if folder.is_dir():
            files += sorted(p for p in folder.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"})
    files += [IMAGES / f for f in SOURCE_FILES if (IMAGES / f).exists()]
    return files


def build(src: Path) -> dict:
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        w, h = im.size
        widths = [x for x in WIDTHS if x <= w] or [w]
        base = out_base(src)
        base.parent.mkdir(parents=True, exist_ok=True)
        for tw in widths:
            dst = base.parent / f"{base.name}-{tw}.webp"
            if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
                continue
            th = round(h * tw / w)
            im.resize((tw, th), Image.LANCZOS).save(dst, "WEBP", quality=QUALITY, method=6)
            print("  ", dst.relative_to(ROOT))
    return {"w": w, "h": h, "sizes": widths, "base": url(base)}


def build_og() -> None:
    src = IMAGES / OG_SOURCE
    dst = OUT / "og-image.jpg"
    if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
        return
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        im = ImageOps.fit(im, (1200, 630), Image.LANCZOS, centering=OG_FOCUS)
        im.save(dst, "JPEG", quality=84, optimize=True, progressive=True)
    print("  ", dst.relative_to(ROOT))


def main() -> None:
    meta = {}
    for src in collect():
        key = url(src)
        meta[key] = build(src)
    build_og()
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(meta, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"{len(meta)} kép, manifest: {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
