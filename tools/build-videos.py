#!/usr/bin/env python3
"""Mozgó képsorok (videóloopok) készítése a saját fotókból.

Használat (a repository gyökeréből):
    pip install pillow imageio-ffmpeg
    python3 tools/build-videos.py            # minden loop
    python3 tools/build-videos.py hero-reel  # csak a megadott(ak)

A receptek a tools/videos.json fájlban vannak. Minden loop egy vagy több „snittből” áll:
egy saját fotó, amelyen lassú, szubpixel-pontos kameramozgás fut (nagyítás + pásztázás),
a snittek között vágás vagy áttűnés. A loop vége az elejébe tér vissza, így végtelenítve
sincs ugrás. Nincs mesterséges (MI-) tartalom: csak a meglévő képek mozognak.

Kimenet: public/videos/<id>.mp4 (H.264), <id>.webm (VP9) és <id>-poster.webp.
Ha egyszer valódi felvétel készül, ugyanezzel a névvel egyszerűen felülírható.
"""
from __future__ import annotations

import json
import math
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageOps

try:
    import imageio_ffmpeg
except ImportError:  # pragma: no cover
    sys.exit("Hiányzik: pip install imageio-ffmpeg")

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "public" / "images"
OUT = ROOT / "public" / "videos"
RECIPES = ROOT / "tools" / "videos.json"
FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()


def ease(t: float, kind: str = "inout") -> float:
    t = min(max(t, 0.0), 1.0)
    if kind == "linear":
        return t
    if kind == "out":
        return 1 - (1 - t) ** 3
    # sima be- és kilassulás (cosinus), a loop-illesztéshez ideális
    return 0.5 - 0.5 * math.cos(math.pi * t)


def load_source(path: str, out_w: int, out_h: int, max_zoom: float) -> Image.Image:
    """A forrást a szükséges felbontásra előméretezzük (gyorsabb és éles marad)."""
    with Image.open(IMAGES / path) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        need = max(out_w / im.width, out_h / im.height) * max_zoom * 1.15
        if need < 1:
            im = im.resize((max(1, round(im.width * need)), max(1, round(im.height * need))), Image.LANCZOS)
        return im.copy()


def frame(src: Image.Image, out_w: int, out_h: int, zoom: float, cx: float, cy: float) -> Image.Image:
    """Kivágás: zoom=1 → a teljes kitöltő (cover) nézet; cx/cy a kivágás közepe 0–1 között."""
    base = max(out_w / src.width, out_h / src.height)  # cover-lépték
    scale = base * zoom
    vw, vh = out_w / scale, out_h / scale  # a látható terület a forrás pixeleiben
    cx = min(max(cx * src.width, vw / 2), src.width - vw / 2)
    cy = min(max(cy * src.height, vh / 2), src.height - vh / 2)
    x0, y0 = cx - vw / 2, cy - vh / 2
    # affin transzformáció: szubpixel-pontos, így nincs „remegés” a lassú mozgásban
    return src.transform((out_w, out_h), Image.AFFINE, (1 / scale, 0, x0, 0, 1 / scale, y0), resample=Image.BICUBIC)


def render(recipe: dict) -> None:
    rid = recipe["id"]
    w, h = recipe["size"]
    fps = recipe.get("fps", 30)
    fade = recipe.get("crossfade", 0.0)
    shots = recipe["shots"]
    max_zoom = max(max(s["from"][0], s["to"][0]) for s in shots)
    sources = {s["image"]: None for s in shots}
    for p in sources:
        sources[p] = load_source(p, w, h, max_zoom)

    def shot_frame(s: dict, t: float) -> Image.Image:
        if s.get("pingpong"):  # oda-vissza mozgás: egysnittes, varratmentes loophoz
            t = 1 - abs(2 * t - 1)
        k = ease(t, s.get("ease", "inout"))
        z = s["from"][0] + (s["to"][0] - s["from"][0]) * k
        x = s["from"][1] + (s["to"][1] - s["from"][1]) * k
        y = s["from"][2] + (s["to"][2] - s["from"][2]) * k
        return frame(sources[s["image"]], w, h, z, x, y)

    # idővonal: minden snitt a saját hosszában fut; áttűnésnél a következő a „fade” idő alatt keveredik be.
    # Az utolsó snitt az elsőbe tűnik át, így a loop zárt.
    durations = [s["duration"] for s in shots]
    total = sum(durations)
    n_frames = round(total * fps)
    OUT.mkdir(parents=True, exist_ok=True)
    tmp_mp4 = OUT / f"{rid}.tmp.mp4"
    cmd = [
        FFMPEG, "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}", "-r", str(fps), "-i", "-",
        "-an", "-c:v", "libx264", "-preset", "slow", "-crf", str(recipe.get("crf", 26)),
        "-pix_fmt", "yuv420p", "-profile:v", "high", "-movflags", "+faststart",
        "-g", str(fps * 2), str(tmp_mp4),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    starts = [sum(durations[:i]) for i in range(len(shots))]
    poster = None
    for f in range(n_frames):
        t = f / fps
        i = max(j for j in range(len(shots)) if starts[j] <= t + 1e-9)
        local = (t - starts[i]) / durations[i]
        img = shot_frame(shots[i], local)
        # áttűnés a következő snittbe (az utolsó után az első jön → zárt loop)
        remain = starts[i] + durations[i] - t
        if fade > 0 and len(shots) > 1 and remain < fade:
            nxt = (i + 1) % len(shots)
            a = 1 - remain / fade
            img = Image.blend(img, shot_frame(shots[nxt], 0.0), ease(a))
        if f == 0:
            poster = img.copy()
        proc.stdin.write(img.tobytes())
    proc.stdin.close()
    if proc.wait() != 0:
        raise SystemExit(f"ffmpeg hiba: {rid}")
    tmp_mp4.replace(OUT / f"{rid}.mp4")
    # VP9 WebM ugyanabból (kisebb, a modern böngészők ezt választják)
    subprocess.run([
        FFMPEG, "-y", "-loglevel", "error", "-i", str(OUT / f"{rid}.mp4"), "-an",
        "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", str(recipe.get("crf_webm", 38)),
        "-row-mt", "1", "-deadline", "good", "-cpu-used", "4", str(OUT / f"{rid}.webm"),
    ], check=True)
    poster.save(OUT / f"{rid}-poster.webp", "WEBP", quality=78, method=6)
    mb = (OUT / f"{rid}.mp4").stat().st_size / 1e6
    wb = (OUT / f"{rid}.webm").stat().st_size / 1e6
    print(f"  {rid}: {w}x{h} {total:.1f}s  mp4 {mb:.2f} MB  webm {wb:.2f} MB")


def main() -> None:
    recipes = json.loads(RECIPES.read_text(encoding="utf-8"))
    wanted = set(sys.argv[1:])
    for r in recipes:
        if not wanted or r["id"] in wanted:
            render(r)
    # kis manifest a komponenseknek (méret + poszter)
    manifest = {
        r["id"]: {"w": r["size"][0], "h": r["size"][1], "mp4": f"/videos/{r['id']}.mp4",
                  "webm": f"/videos/{r['id']}.webm", "poster": f"/videos/{r['id']}-poster.webp"}
        for r in recipes
    }
    (ROOT / "lib" / "video-manifest.json").write_text(json.dumps(manifest, indent=1) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
