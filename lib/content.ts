/*
 * VIDOR PHOTO & FILM — SZERKESZTHETŐ TARTALOM
 * ------------------------------------------------------------------
 * Galériák, főoldali munkák, filmek, szolgáltatások és videóhátterek.
 *
 * Kép hozzáadása egy galériához:
 *   1. Az eredeti fájl menjen a public/images/<mappa>/ alá.
 *   2. Futtasd: npm run images   (elkészülnek a webes változatok és a manifest)
 *   3. Vegyél fel egy új sort a galéria images listájába (a sorrend = megjelenési sorrend).
 *
 * Mozgó loopok: lásd lent a GENRES / LoopId részt és a tools/videos.json-t.
 */

export type GalleryImage = { src: string; alt: string };
export type Gallery = { title: string; note: string; images: GalleryImage[] };

export const GALLERIES = {
  eskuvo: {
    title: "Esküvő",
    note: "Válogatás több esküvőből",
    images: [
      { src: "/images/eskuvo/eskuvo-01.jpg", alt: "Csókolózó jegyespár esti fényfüzérek alatt, szálló szirmokkal" },
      { src: "/images/eskuvo/eskuvo-02.jpg", alt: "Ifjú pár a szertartás után, a vendégek szirmokat dobnak" },
      { src: "/images/eskuvo/eskuvo-03.jpg", alt: "Templomi esküvő, a pár az oltár előtt, a vendégek a padsorokban" },
      { src: "/images/eskuvo/eskuvo-04.jpg", alt: "Egymás kezét fogó menyasszony és vőlegény közelről" },
      { src: "/images/eskuvo/eskuvo-05.jpg", alt: "Jegygyűrűk nyitott dobozban, fehér kavicsokon" },
      { src: "/images/eskuvo/eskuvo-06.jpg", alt: "Ifjú pár sétál egy vidéki úton naplementében" },
      { src: "/images/eskuvo/eskuvo-07.jpg", alt: "Ifjú pár kilép a templom kapuján" },
      { src: "/images/eskuvo/eskuvo-08.jpg", alt: "A menyasszony és a vőlegény keze az autóban" }
    ],
  },
  portre: {
    title: "Portré",
    note: "Egyéni portrék",
    images: [
      { src: "/images/portraits/portre-03.jpg", alt: "Öltönyös férfi ül egy irodában, mögötte neonfelirat" },
      { src: "/images/portraits/portre-01.jpg", alt: "Szakállas, tetovált férfi összefont karral, sötét háttér előtt" },
      { src: "/images/portraits/portre-02.jpg", alt: "Nő bőrkabátban és piros maszkban, sötét háttér előtt" },
      { src: "/images/portraits/portre-04.jpg", alt: "Szakállas férfi sétál egy belvárosi utcán" },
      { src: "/images/portraits/portre-05.jpg", alt: "Nő ül egy sziklán viharos égbolt alatt" },
      { src: "/images/portraits/portre-06.jpg", alt: "Nő nyújtás közben egy világos stúdióban" }
    ],
  },
  gastro: {
    title: "Gasztro",
    note: "Ételek, italok, helyek",
    images: [
      { src: "/images/gastro.jpg", alt: "Kéz nyúl egy pohár fehérborért, mellette sonkás-sajtos tál" },
      { src: "/images/gastro/gastro-06.jpg", alt: "Leves fatálcán, fahéjjal és fenyőtobozokkal" },
      { src: "/images/gastro/gastro-04.jpg", alt: "Forró csokoládé fatálcán, fenyőtobozokkal, felülnézetből" },
      { src: "/images/gastro/gastro-02.jpg", alt: "Tálalt főétel terített asztalon, vörösborral" },
      { src: "/images/gastro/gastro-03.jpg", alt: "Espresso martini koktélpohárban, márványháttér előtt" },
      { src: "/images/gastro/gastro-05.jpg", alt: "Fehérbor és hidegtál gyertyafényben" },
      { src: "/images/gastro/gastro-07.jpg", alt: "Steak zöldségekkel fehér tányéron" }
    ],
  },
  koncert: {
    title: "Koncert",
    note: "Koncertek és fesztiválok",
    images: [
      { src: "/images/koncert/koncert-02.jpg", alt: "Rapper a közönség fölött, zöld színpadfények előtt" },
      { src: "/images/koncert/koncert-03.jpg", alt: "Előadó sziluettje füstben és reflektorfényben a közönség felett" },
      { src: "/images/koncert/koncert-01.jpg", alt: "Előadó mikrofonnal a színpadon, mögötte a fesztivál közönsége" },
      { src: "/images/koncert.jpg", alt: "Esti fesztiválkoncert, óriáskerék és tömeg viharos ég alatt" },
      { src: "/images/koncert/koncert-04.jpg", alt: "Óriáskerék és felemelt kezű közönség szürkületben" },
      { src: "/images/koncert/koncert-05.jpg", alt: "Fiatal nő a fesztiválon lemenő napfényben" },
      { src: "/images/koncert/koncert-06.jpg", alt: "Színpad és hatalmas tömeg éjszaka, a színpad mögül" },
      { src: "/images/koncert/koncert-07.jpg", alt: "Énekes kék fényben, két kézzel fogja a mikrofont" }
    ],
  },
  rendezveny: {
    title: "Rendezvény",
    note: "Válogatás több rendezvényről",
    images: [
      { src: "/images/event/rendezveny-01.jpg", alt: "Díszvacsora egy historikus belső térben, felülnézetből" },
      { src: "/images/event/rendezveny-02.jpg", alt: "Pincér bort tölt egy vendégnek egy vacsorán" },
      { src: "/images/event/rendezveny-03.jpg", alt: "Két vendég koccint egy étteremben" },
      { src: "/images/event/rendezveny-04.jpg", alt: "Két séf egy tányér étellel" },
      { src: "/images/event/rendezveny-05.jpg", alt: "Vendégek beszélgetnek egy lila fényben úszó teremben" },
      { src: "/images/event/rendezveny-06.jpg", alt: "Két nevető lány ül a füvön egy sporteseményen" },
      { src: "/images/event/rendezveny-07.jpg", alt: "Csapattagok pacsiznak egy sportnapon" }
    ],
  },
} satisfies Record<string, Gallery>;

export type GalleryKey = keyof typeof GALLERIES;

/** Háttérvideók. MP4 (H.264), 1080p, 10–15 MB. null = statikus kép. */
export const VIDEOS: { hero: string | null; statement: string | null } = {
  hero: null, // pl. '/videos/showreel.mp4' — 15–30 mp-es showreel
  statement: null, // pl. '/videos/b-roll.mp4' — lassú, atmoszférikus B-roll
};

/** Válogatott munkák — a rács sorrendje és képarányai a designt követik. */
export type Work = {
  gallery: GalleryKey;
  title: string;
  description: string;
  cover: string;
  alt: string;
  /** a kép kivágása (CSS object-position) */
  position?: string;
  layout: 'wide' | 'tall' | 'landscape';
};

export const WORKS: Work[] = [
  { gallery: 'portre', title: 'Portré', description: 'Személyes történetek, őszintén', cover: '/images/portraits/portre-03.jpg', alt: 'Öltönyös férfi mosolyogva ül egy irodában, mögötte neonfelirat', position: '45% 50%', layout: 'wide' },
  { gallery: 'koncert', title: 'Koncert & Esemény', description: 'Energia, hangulat, pillanatok', cover: '/images/koncert/koncert-02.jpg', alt: 'Rapper mikrofonnal a közönség fölött, zöld színpadfények előtt', position: '45% 40%', layout: 'tall' },
  { gallery: 'gastro', title: 'Gasztro & Étterem', description: 'Ízek, textúrák, hangulat', cover: '/images/gastro.jpg', alt: 'Kéz nyúl egy pohár fehérborért, mellette sonkás-sajtos tál', position: '40% 60%', layout: 'tall' },
  { gallery: 'eskuvo', title: 'Esküvő', description: 'Szeretet és pillanatok', cover: '/images/eskuvo/eskuvo-01.jpg', alt: 'Csókolózó ifjú pár esti fényfüzérek alatt, szálló szirmokkal', position: '50% 45%', layout: 'landscape' },
  { gallery: 'rendezveny', title: 'Rendezvény', description: 'Közösség és elegancia', cover: '/images/event/rendezveny-01.jpg', alt: 'Díszvacsora egy historikus belső térben, felülnézetből', position: '52% 50%', layout: 'tall' },
];

/** Filmek — Vimeo-azonosító: a vimeo.com/… link végén lévő szám. */
export type Film = { key: string; title: string; description: string; vimeo: string; cover: string; position?: string; duration: string };

export const FILMS: Film[] = [
  { key: 'dokumentumfilm', title: 'Dokumentumfilm', description: 'Valós történetek, közelről.', vimeo: '1188963244', cover: '/images/film/dokumentumfilm-borito.jpg', position: '55% 40%', duration: '22:16' },
  { key: 'feri', title: 'Feri – 3 generáció', description: 'Három generáció, egy történet.', vimeo: '1188963168', cover: '/images/visual-storytelling.jpg', position: '48% 50%', duration: '4:02' },
  { key: 'eskuvoi', title: 'Esküvői film', description: 'A napotok, mozgó emlékként.', vimeo: '1188707738', cover: '/images/weddings-video.jpg', position: '52% 40%', duration: '3:36' },
];

export const SERVICES = [
  { title: 'Portré & Editorial', text: 'Személyes és professzionális portrék, editorial fotózás.' },
  { title: 'Esküvő', text: 'Teljes napos történetmesélés fotón és filmen.' },
  { title: 'Esemény & Koncert', text: 'Fesztiválok, koncertek, céges és magán események.' },
  { title: 'Gasztro & Étterem', text: 'Ételek, italok, éttermi hangulat és brandépítés.' },
];

export const CONTACT = {
  email: 'vidor.gergely@gmail.com',
  phone: '+36 20 560 9623',
  phoneHref: 'tel:+36205609623',
  city: 'Budapest',
  instagram: 'https://www.instagram.com/vidorphotography1/',
};

export const SITE = {
  url: 'https://www.vidorphotography.com',
  name: 'VIDOR Photo & Film',
};

/* ------------------------------------------------------------------
 * ÉLŐ VETÍTŐFAL — műfajok, színek és mozgó loopok
 * A loopok a saját fotókból készülnek: tools/videos.json + python3 tools/build-videos.py.
 * Valódi klip ugyanazzal a fájlnévvel (public/videos/<id>.mp4/.webm) felülírható.
 * ------------------------------------------------------------------ */
export type LoopId = 'hero-eskuvo' | 'hero-koncert' | 'hero-portre' | 'hero-gasztro' | 'hero-rendezveny' | 'mozisav' | 'rolam' | 'lablec';

export type Genre = {
  key: GalleryKey;
  label: string; // rövid név (chip, szalag)
  color: string; // műfajszín (CSS változó)
  loop: LoopId;
  /** a kapcsolati űrlap „Miben gondolkodsz?” értéke */
  inquiry: string;
};

export const GENRES: Genre[] = [
  { key: 'eskuvo', label: 'Esküvő', color: 'var(--color-sun)', loop: 'hero-eskuvo', inquiry: 'Esküvő' },
  { key: 'koncert', label: 'Koncert', color: 'var(--color-dusk)', loop: 'hero-koncert', inquiry: 'Koncert' },
  { key: 'portre', label: 'Portré', color: 'var(--color-violet)', loop: 'hero-portre', inquiry: 'Portré' },
  { key: 'gastro', label: 'Gasztro', color: 'var(--color-ember)', loop: 'hero-gasztro', inquiry: 'Gasztro' },
  { key: 'rendezveny', label: 'Rendezvény', color: 'var(--color-teal)', loop: 'hero-rendezveny', inquiry: 'Rendezvény' },
];
export const GENRE = Object.fromEntries(GENRES.map((g) => [g.key, g])) as Record<GalleryKey, Genre>;

/** Kapcsolati űrlap műfaj-chipjei (a „Film” saját, világos színt kap). */
export const INQUIRIES = [
  ...GENRES.map((g) => ({ value: g.inquiry, color: g.color, loop: g.loop as LoopId })),
  { value: 'Film', color: 'var(--color-cream)', loop: 'mozisav' as LoopId },
];

/** Szolgáltatás → műfaj (szín, loop, előre kiválasztott chip). */
export const SERVICE_GENRE: Record<string, GalleryKey> = {
  'Portré & Editorial': 'portre',
  'Esküvő': 'eskuvo',
  'Esemény & Koncert': 'koncert',
  'Gasztro & Étterem': 'gastro',
};

export const QUOTE = 'Nem csupán azt keresem, ami történik. Azt keresem, ami megmarad belőle.';

export const APPROACH = {
  title: 'Figyelek. Kapcsolódom. Nem rendezek túl.',
  steps: [
    { n: '01', title: 'Kapcsolódás', text: 'A közös munka beszélgetéssel kezdődik. Megismerem a történetet és a közeget.', image: '/images/about/kamera-reszlet.jpg' },
    { n: '02', title: 'Alkotás', text: 'Teret hagyok annak, ami természetesen történik.', image: '/images/about/forgatas-tengerpart.jpg' },
    { n: '03', title: 'Átadás', text: 'A végeredmény letisztult, személyes és időtálló.', image: '/images/about-photo.jpg' },
  ],
};
