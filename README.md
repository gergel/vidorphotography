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
app/layout.tsx            betűtípus (Inter), SEO és Open Graph
app/page.tsx              a szekciók sorrendje
app/globals.css           Tailwind + design tokenek (színek, betűk, görbék)
app/api/contact/route.ts  kapcsolati űrlap szerveroldala (Resend)
components/               Header, HeroSequence, WorksRail (+Intro), CinemaBand, FilmReel, Services,
                          About, Contact (+ContactForm), Footer, GalleryDialog/GalleryHost,
                          LoopVideo (videókeret), ScrollWords (görgetésre kivilágosodó szöveg)
lib/site.tsx              közös állapot: mozgás szüneteltetése, űrlap-műfaj, galéria
lib/video-budget.ts       egyszerre legfeljebb 4 (mobilon 2) loop fut
public/videos/            loopok (MP4 + WebM + poszter) — tools/build-videos.py készíti
docs/                     design terv (PDF) és a prompt, ami alapján az oldal készült
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

**Mozgó loopok** (`public/videos/`): a saját fotókból készülnek lassú kameramozgással és áttűnéssel.
Receptek: `tools/videos.json`; újragenerálás: `pip install pillow imageio-ffmpeg`, majd
`python3 tools/build-videos.py` (vagy csak egy: `python3 tools/build-videos.py hero-koncert`).
Ha valódi klip készül (5–10 mp, némán is jól működő), ugyanazzal a névvel felülírható
(`hero-koncert.mp4`, `hero-koncert.webm`, `hero-koncert-poster.webp`) — a design nem változik.

## Kapcsolati űrlap

1. A böngésző a `/api/contact` végpontra küld.
2. Ha a szerveren van `RESEND_API_KEY`, a Resend küldi a levelet (válaszcím: a látogató e-mailje).
3. Ha nincs kulcs, a végpont 501-et ad, és a böngésző a korábbi, már aktivált **FormSubmit**
   szolgáltatáson keresztül küld (`formsubmit.co/ajax/vidor.gergely@gmail.com`). Új domainen a
   FormSubmit az első beküldés után aktiváló e-mailt küld — az abban lévő linkre kattintani kell.

Sikert csak a szolgáltatás tényleges sikeres válasza után jelez; hibánál a beírt szöveg megmarad,
és megjelenik a közvetlen e-mail-cím.

## Mozgás

Letisztult, görgetésre épülő oldal (lásd `docs/PROMPT-elo-vetitofal.md`, 2. változat). Fekete-fehér felület,
a színt a képek adják. Görgetés közben:
- a nyitó teljes képernyős videó a falon lévő helyére zsugorodik, és köré kirajzolódik a videófal;
- a nagy mondatok szavanként kivilágosodnak;
- a munkák vízszintesen úsznak át;
- a mozisáv szélesre nyílik;
- a szemlélet lépései váltják egymást.

Egyszerre legfeljebb 4 videó fut (mobilon 2), ami nem látszik, megáll. A fejléc „Mozgás” gombja mindent
megállít (a választást megjegyzi). Csökkentett mozgásnál nincs rögzített jelenet és nincs videó,
csak állókép és áttűnés. Mobilon a rögzített jelenetek helyett egyszerű, húzható sorok vannak.
