# Vidor Photography — landing oldal

Statikus, egyoldalas portfólió (HTML + CSS + JavaScript, keretrendszer nélkül).
GitHub Pages-kompatibilis, minden hivatkozás relatív.

## Felépítés

```
index.html                  az oldal szerkezete és a magyar alapszöveg
assets/css/style.css        megjelenés (sötét színrendszer, DM Sans, térközök a :root változókban)
assets/js/content.js        SZERKESZTHETŐ: galériák képei, sorrend, képleírások, Vimeo-filmek
assets/js/i18n.js           SZERKESZTHETŐ: minden szöveg magyarul és angolul, kulcsokkal
assets/js/main.js           működés (nyelvváltás, menü, galéria, videó, űrlap)
assets/js/image-manifest.js automatikusan generált képméret-lista (ne szerkeszd kézzel)
tools/build-images.py       optimalizált WebP-változatok készítése
images/<mappa>/…            eredeti képek (ezekhez a szkript nem nyúl)
images/web/…                optimalizált változatok (480, 960, 1600, 2400 px széles WebP)
```

## Helyi előnézet

```bash
python3 -m http.server 8000
# majd böngészőben: http://localhost:8000
```

## Képek cseréje, hozzáadása

1. Másold az eredeti fotót a megfelelő mappába:
   `images/eskuvo/`, `images/portraits/`, `images/gastro/`, `images/koncert/`, `images/event/`
   (pl. `images/eskuvo/eskuvo-09.jpg`).
2. Készítsd el a webes változatokat:
   ```bash
   pip install pillow
   python3 tools/build-images.py
   ```
3. Vedd fel a képet az `assets/js/content.js` megfelelő galériájába egy új sorral
   (a sorrend a lista sorrendje):
   ```js
   { src: 'images/eskuvo/eskuvo-09.jpg', alt: { hu: 'Rövid leírás', en: 'Short description' } },
   ```
4. A galéria törléséhez elég üresre állítani az `images` listát; üres galériát az oldal
   nem mutat kattinthatóként (a hozzá tartozó borító is eltűnik).

**Főoldali borítók** („Válogatott munkák”): az `index.html` `works__grid` részében az
`<img>` `src`/`srcset` útvonalát kell átírni a `images/web/...` változatokra
(`-480.webp`, `-960.webp`, `-1600.webp`), a `width`/`height` értéket az eredeti kép
méretére, az `alt` szöveget pedig az `i18n.js`-ben (`works.*.alt`).

**Nyitókép**: `index.html` → `hero__media` kép + a `<head>`-ben lévő `preload` sor.
A kivágást a `style.css` `.hero` szabályában lévő `--hero-x` / `--hero-y` állítja (mobilra
külön blokk). Asztali nézetben a `main.js` `fitHero()` függvénye finomhangolja a függőleges
kivágást, hogy az előadó (`HERO_SUBJECT_BOTTOM`: a kép magasságának ~59%-áig) mindig a
szöveg fölött maradjon. Más nyitókép esetén ezt az értéket az új kép fő témájához kell igazítani.

**Borítóarányok**: a „Válogatott munkák” borítói 4:3-as vágásban jelennek meg, az utolsó
(teljes szélességű) 21:9-ben. Fekvő képet válassz borítónak, hogy ne vágjon arcot.

**Megosztási kép** (Facebook/Messenger előnézet): `tools/build-images.py` `OG_SOURCE`
értéke; a szkript elkészíti az `images/web/og-image.jpg` fájlt.

## Videók cseréje

- `assets/js/content.js` → `films`: a `vimeo` mező a Vimeo-link végén lévő szám.
- Borítókép, cím és hossz: `index.html` „Filmek” szekció (`data-film="kulcs"`).
- A videó csak kattintásra töltődik be, a párbeszédablak bezárásakor leáll.

## Szövegek cseréje

Minden látható szöveg az `assets/js/i18n.js`-ben van, magyarul (`hu`) és angolul (`en`),
azonos kulccsal. Az `index.html`-ben lévő magyar szöveg csak kezdőérték (JavaScript
nélkül ez látszik), ezért ha egy szöveget módosítasz, írd át mindkét helyen.
A választott nyelvet az oldal a böngészőben megjegyzi.

## Kapcsolati űrlap (FormSubmit)

- Végpont: `https://formsubmit.co/ajax/vidor.gergely@gmail.com` (`main.js` → `FORM_ENDPOINT`).
- Sikert csak akkor jelez, ha a FormSubmit válaszában `success: "true"` szerepel.
  Hiba esetén a beírt szöveg megmarad, és megjelenik a közvetlen e-mail-cím.
- **Aktiválás:** a FormSubmit minden új domainről érkező első beküldéskor aktiváló
  e-mailt küld a címre. Élesítés után (és ha előnézeti domainen teszteled, ott is)
  küldj egy próbaüzenetet, majd kattints az „Activate Form” linkre a
  vidor.gergely@gmail.com postafiókban. Amíg ez nem történik meg, az oldal hibát jelez
  (nem mutat hamis sikert).
- Ajánlott: aktiválás után a FormSubmit által küldött véletlen azonosítóra cserélni
  az e-mail-címet a végpontban, így a cím nem látszik a forráskódban.
