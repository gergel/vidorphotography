# VIDOR Photo & Film — portfólió weboldal

Vidor Gergely fotós és operatőr egyoldalas portfóliója.
**Next.js 16 (App Router) + Tailwind CSS 4 + Framer Motion**, magyar nyelven.

## Indítás

```bash
npm install
npm run dev        # fejlesztés: http://localhost:3000
npm run build      # éles build
npm start          # éles szerver (a PORT környezeti változót használja)
```

Node.js 20.9 vagy újabb kell.

### Telepítés (Railway)

A Railway a `package.json` alapján Next.js alkalmazásként ismeri fel a projektet:
build parancs `npm run build`, indítás `npm start`. Külön konfiguráció nem kell.
Környezeti változók (Railway → Variables), mind opcionális:

| Változó | Mire való |
| --- | --- |
| `RESEND_API_KEY` | Ha be van állítva, az űrlap a Resenden keresztül küld. |
| `CONTACT_TO` | Címzett (alapértelmezés: vidor.gergely@gmail.com). |
| `CONTACT_FROM` | Feladó, pl. `VIDOR <hello@vidorphotography.com>` — ellenőrzött Resend-domain kell hozzá. Alapértelmezés: `onboarding@resend.dev` (ez csak a Resend-fiók saját e-mail-címére tud küldeni). |

## Felépítés

```
app/layout.tsx            betűtípusok (Cormorant Garamond, Inter), SEO és Open Graph
app/page.tsx              a szekciók sorrendje
app/globals.css           Tailwind + design tokenek (színek, betűk, görbék)
app/api/contact/route.ts  kapcsolati űrlap szerveroldala (Resend)
components/               Header, Hero, Works (+GalleryDialog), Statement, Films,
                          ServicesApproach, About, Contact (+ContactForm), Footer, Reveal
lib/content.ts            SZERKESZTHETŐ: galériák, munkák, filmek, szolgáltatások, videók
lib/image-manifest.json   automatikusan generált képméretek (ne szerkeszd kézzel)
public/images/…           eredeti képek + public/images/web/ optimalizált változatok
tools/build-images.py     webes képváltozatok és manifest készítése
```

## Tartalom cseréje

Minden szerkeszthető tartalom a `lib/content.ts`-ben van.

**Kép hozzáadása egy galériához**
1. Másold az eredeti fotót a `public/images/<mappa>/` alá (pl. `public/images/eskuvo/eskuvo-09.jpg`).
2. `pip install pillow` (egyszer), majd `npm run images` — elkészülnek a webes változatok.
3. A `GALLERIES` megfelelő listájába vegyél fel egy sort: `{ src: '/images/eskuvo/eskuvo-09.jpg', alt: 'Rövid leírás' }`.

**Főoldali munkák** (`WORKS`): borítókép (`cover`), cím, rövid leírás, kivágás
(`position`, CSS object-position) és elrendezés (`wide` 800×610, `tall` 468×620,
`landscape` 800×500). A sorrend a rács sorrendje.

**Filmek** (`FILMS`): cím, leírás, Vimeo-azonosító (a vimeo.com/… link végén lévő szám),
borítókép, játékidő. A videó csak kattintásra töltődik be, bezáráskor leáll.

**Háttérvideók** (`VIDEOS`): tedd az MP4-et a `public/videos/` mappába, és írd be az útvonalát:
- `hero`: 15–30 mp-es showreel (H.264, 1080p, max. 10–15 MB). Csak 768 px felett és teljes
  mozgás-beállításnál játszódik le; mobilon a statikus nyitókép marad.
- `statement`: lassú, atmoszférikus B-roll az idézetes sávhoz; csak a szekció közelébe érve töltődik be.
Amíg az érték `null`, a statikus képek látszanak.

## Kapcsolati űrlap

1. A böngésző a `/api/contact` végpontra küld.
2. Ha a szerveren van `RESEND_API_KEY`, a Resend küldi a levelet (válaszcím: a látogató e-mailje).
3. Ha nincs kulcs, a végpont 501-et ad, és a böngésző a korábbi, már aktivált **FormSubmit**
   szolgáltatáson keresztül küld (`formsubmit.co/ajax/vidor.gergely@gmail.com`). Új domainen a
   FormSubmit az első beküldés után aktiváló e-mailt küld — az abban lévő linkre kattintani kell.

Sikert csak a szolgáltatás tényleges sikeres válasza után jelez; hibánál a beírt szöveg megmarad,
és megjelenik a közvetlen e-mail-cím.

## Mozgás

Framer Motion: hero-belépő, görgetéses megjelenés (egyszer, lépcsőzve), a munkák képeinek enyhe
beállása, parallax az idézetes sávon, hover-nagyítás (csak egérrel), animált mobilmenü, a galéria
és a videó ablakának áttűnése. A „csökkentett mozgás” rendszerbeállításnál csak az áttűnések maradnak.
