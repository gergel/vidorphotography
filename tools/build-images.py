#!/usr/bin/env python3
"""Optimalizált webes képváltozatok készítése.

Használat (a repository gyökeréből):
    pip install pillow
    python3 tools/build-images.py

Mit csinál?
- Végigmegy az eredeti képeken (images/<mappa>/*.jpg|png, images/*.jpg, headline.jpg).
- Mindegyikből WebP változatokat készít több szélességben ide: images/web/...
  Az eredeti fájlokhoz nem nyúl.
- Legenerálja az assets/js/image-manifest.js fájlt (képméretek, elérhető szélességek),
  amit az oldal a srcset és a képarányok beállításához használ.
- Elkészíti a közösségi megosztási képet: images/web/og-image.jpg (1200×630).

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
OUT = ROOT / "images" / "web"
MANIFEST = ROOT / "assets" / "js" / "image-manifest.js"

# Ezekben a mappákban lévő képekből készülnek webes változatok.
SOURCE_DIRS = ["hero", "eskuvo", "event", "koncert", "portraits", "gastro", "film", "about"]
# Egyedi fájlok (borítók, portré).
SOURCE_FILES = [
    "headline.jpg",
    "images/koncert.jpg",
    "images/gastro.jpg",
    "images/about-photo.jpg",
    "images/dokumentumfilm.jpg",
    "images/visual-storytelling.jpg",
    "images/weddings-video.jpg",
]
WIDTHS = [480, 960, 1600, 2400]
QUALITY = 80

# Megosztási kép: forrás és a kivágás vízszintes/függőleges fókuszpontja (0–1).
OG_SOURCE = "images/hero/eskuvo-mezo.jpg"
OG_FOCUS = (0.5, 0.5)


def out_base(src: Path) -> Path:
    rel = src.relative_to(ROOT)
    parts = rel.parts[1:] if rel.parts[0] == "images" else rel.parts
    return OUT.joinpath(*parts).with_suffix("")


def collect() -> list[Path]:
    files: list[Path] = []
    for d in SOURCE_DIRS:
        folder = ROOT / "images" / d
        if folder.is_dir():
            files += sorted(p for p in folder.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"})
    files += [ROOT / f for f in SOURCE_FILES if (ROOT / f).exists()]
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
    return {"w": w, "h": h, "sizes": widths, "base": str(base.relative_to(ROOT)).replace("\\", "/")}


def build_og() -> None:
    src = ROOT / OG_SOURCE
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
        key = str(src.relative_to(ROOT)).replace("\\", "/")
        meta[key] = build(src)
    build_og()
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(
        "/* Automatikusan generálva: python3 tools/build-images.py — ne szerkeszd kézzel. */\n"
        "window.VP_IMAGES = " + json.dumps(meta, ensure_ascii=False, indent=1) + ";\n",
        encoding="utf-8",
    )
    print(f"{len(meta)} kép, manifest: {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
