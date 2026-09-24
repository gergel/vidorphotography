/*
 * VIDOR PHOTOGRAPHY — SZERKESZTHETŐ TARTALOM
 * ------------------------------------------------------------------
 * Itt vannak a galériák és a filmek. A sorrend a tömbök sorrendje.
 *
 * Kép hozzáadása egy galériához:
 *   1. Másold az eredeti képet a megfelelő mappába, pl. images/eskuvo/eskuvo-09.jpg
 *   2. Futtasd: python3 tools/build-images.py   (elkészülnek a webes változatok)
 *   3. Vedd fel az alábbi listába egy új sorral: { src: '...', alt: { hu: '...', en: '...' } }
 *
 * Az "alt" a kép rövid leírása (képernyőolvasóknak és ha a kép nem tölt be).
 * Üres galériát az oldal nem mutat kattinthatóként.
 *
 * A főoldali borítóképeket és címeket az index.html "Válogatott munkák"
 * része tartalmazza (data-gallery="kulcs" köti össze őket az itteni galériával).
 */
window.VP_CONTENT = {
  galleries: {
    eskuvo: {
      title: { hu: 'Esküvő', en: 'Weddings' },
      note: { hu: 'Válogatás több esküvőből', en: 'A selection from several weddings' },
      images: [
        { src: 'images/eskuvo/eskuvo-01.jpg', alt: { hu: 'Csókolózó jegyespár esti fényfüzérek alatt, szálló szirmokkal', en: 'Couple kissing under string lights at night, with petals in the air' } },
        { src: 'images/eskuvo/eskuvo-02.jpg', alt: { hu: 'Ifjú pár a szertartás után, a vendégek szirmokat dobnak', en: 'Newlyweds after the ceremony as guests throw petals' } },
        { src: 'images/eskuvo/eskuvo-03.jpg', alt: { hu: 'Templomi esküvő, a pár az oltár előtt, a vendégek a padsorokban', en: 'Church wedding with the couple at the altar and guests in the pews' } },
        { src: 'images/eskuvo/eskuvo-04.jpg', alt: { hu: 'Egymás kezét fogó menyasszony és vőlegény közelről', en: 'Close-up of the bride and groom holding hands' } },
        { src: 'images/eskuvo/eskuvo-05.jpg', alt: { hu: 'Jegygyűrűk nyitott dobozban, fehér kavicsokon', en: 'Wedding rings in an open box resting on white pebbles' } },
        { src: 'images/eskuvo/eskuvo-06.jpg', alt: { hu: 'Ifjú pár sétál egy vidéki úton naplementében', en: 'Newlyweds walking down a country road at sunset' } },
        { src: 'images/eskuvo/eskuvo-07.jpg', alt: { hu: 'Ifjú pár kilép a templom kapuján', en: 'Newlyweds stepping out through the church door' } },
        { src: 'images/eskuvo/eskuvo-08.jpg', alt: { hu: 'A menyasszony és a vőlegény keze az autóban', en: 'The bride’s and groom’s hands inside the car' } }
      ]
    },
    portre: {
      title: { hu: 'Portré', en: 'Portraits' },
      note: { hu: 'Egyéni portrék', en: 'Individual portraits' },
      images: [
        { src: 'images/portraits/portre-01.jpg', alt: { hu: 'Szakállas, tetovált férfi összefont karral, sötét háttér előtt', en: 'Bearded, tattooed man with folded arms against a dark background' } },
        { src: 'images/portraits/portre-02.jpg', alt: { hu: 'Nő bőrkabátban és piros maszkban, sötét háttér előtt', en: 'Woman in a leather jacket and red mask against a dark background' } },
        { src: 'images/portraits/portre-03.jpg', alt: { hu: 'Öltönyös férfi ül egy irodában, mögötte neonfelirat', en: 'Man in a suit seated in an office with a neon sign behind him' } },
        { src: 'images/portraits/portre-04.jpg', alt: { hu: 'Szakállas férfi sétál egy belvárosi utcán', en: 'Bearded man walking down a city street' } },
        { src: 'images/portraits/portre-05.jpg', alt: { hu: 'Nő ül egy sziklán viharos égbolt alatt', en: 'Woman sitting on a rock under a stormy sky' } },
        { src: 'images/portraits/portre-06.jpg', alt: { hu: 'Nő nyújtás közben egy világos stúdióban', en: 'Woman stretching in a bright studio' } }
      ]
    },
    gastro: {
      title: { hu: 'Gasztro', en: 'Food & drink' },
      note: { hu: 'Ételek, italok, helyek', en: 'Food, drinks and venues' },
      images: [
        { src: 'images/gastro.jpg', alt: { hu: 'Kéz nyúl egy pohár fehérborért, mellette sonkás-sajtos tál', en: 'A hand reaching for a glass of white wine beside a charcuterie plate' } },
        { src: 'images/gastro/gastro-02.jpg', alt: { hu: 'Tálalt főétel terített asztalon, vörösborral', en: 'Plated main course on a set table with red wine' } },
        { src: 'images/gastro/gastro-03.jpg', alt: { hu: 'Espresso martini koktélpohárban, márványháttér előtt', en: 'Espresso martini in a cocktail glass against marble' } },
        { src: 'images/gastro/gastro-04.jpg', alt: { hu: 'Forró csokoládé fatálcán, fenyőtobozokkal, felülnézetből', en: 'Hot chocolate on a wooden tray with pine cones, from above' } },
        { src: 'images/gastro/gastro-05.jpg', alt: { hu: 'Fehérbor és hidegtál gyertyafényben', en: 'White wine and a cold platter by candlelight' } },
        { src: 'images/gastro/gastro-06.jpg', alt: { hu: 'Leves fatálcán, fahéjjal és fenyőtobozokkal', en: 'Soup on a wooden tray with cinnamon and pine cones' } },
        { src: 'images/gastro/gastro-07.jpg', alt: { hu: 'Steak zöldségekkel fehér tányéron', en: 'Steak with vegetables on a white plate' } }
      ]
    },
    koncert: {
      title: { hu: 'Koncert', en: 'Concerts' },
      note: { hu: 'Koncertek és fesztiválok', en: 'Concerts and festivals' },
      images: [
        { src: 'images/koncert/koncert-03.jpg', alt: { hu: 'Előadó sziluettje füstben és reflektorfényben a közönség felett', en: 'Performer silhouetted in smoke and spotlights above the crowd' } },
        { src: 'images/koncert/koncert-01.jpg', alt: { hu: 'Előadó mikrofonnal a színpadon, mögötte a fesztivál közönsége', en: 'Performer with a microphone on stage, festival crowd behind' } },
        { src: 'images/koncert.jpg', alt: { hu: 'Esti fesztiválkoncert, óriáskerék és tömeg viharos ég alatt', en: 'Evening festival concert with a Ferris wheel and crowd under a stormy sky' } },
        { src: 'images/koncert/koncert-04.jpg', alt: { hu: 'Óriáskerék és felemelt kezű közönség szürkületben', en: 'Ferris wheel and a crowd with raised hands at dusk' } },
        { src: 'images/koncert/koncert-02.jpg', alt: { hu: 'Rapper a közönség fölött, zöld színpadfények előtt', en: 'Rapper above the crowd in front of green stage lights' } },
        { src: 'images/koncert/koncert-05.jpg', alt: { hu: 'Fiatal nő a fesztiválon lemenő napfényben', en: 'Young woman at a festival in low evening sun' } },
        { src: 'images/koncert/koncert-06.jpg', alt: { hu: 'Színpad és hatalmas tömeg éjszaka, a színpad mögül', en: 'Stage and a huge crowd at night, seen from behind the stage' } },
        { src: 'images/koncert/koncert-07.jpg', alt: { hu: 'Énekes kék fényben, két kézzel fogja a mikrofont', en: 'Singer in blue light holding the microphone with both hands' } }
      ]
    },
    rendezveny: {
      title: { hu: 'Rendezvény', en: 'Events' },
      note: { hu: 'Válogatás több rendezvényről', en: 'A selection from several events' },
      images: [
        { src: 'images/event/rendezveny-01.jpg', alt: { hu: 'Díszvacsora egy historikus belső térben, felülnézetből', en: 'Gala dinner in a historic interior, seen from above' } },
        { src: 'images/event/rendezveny-02.jpg', alt: { hu: 'Pincér bort tölt egy vendégnek egy vacsorán', en: 'Waiter pouring wine for a guest at a dinner' } },
        { src: 'images/event/rendezveny-03.jpg', alt: { hu: 'Két vendég koccint egy étteremben', en: 'Two guests raising their glasses in a restaurant' } },
        { src: 'images/event/rendezveny-04.jpg', alt: { hu: 'Két séf egy tányér étellel', en: 'Two chefs holding a plated dish' } },
        { src: 'images/event/rendezveny-05.jpg', alt: { hu: 'Vendégek beszélgetnek egy lila fényben úszó teremben', en: 'Guests talking in a room lit in purple' } },
        { src: 'images/event/rendezveny-06.jpg', alt: { hu: 'Két nevető lány ül a füvön egy sporteseményen', en: 'Two laughing girls sitting on the grass at a sports event' } },
        { src: 'images/event/rendezveny-07.jpg', alt: { hu: 'Csapattagok pacsiznak egy sportnapon', en: 'Team members high-fiving at a sports day' } }
      ]
    }
  },

  /*
   * Filmek: a kulcs (pl. "dokumentumfilm") köti össze az index.html
   * "Filmek" szekciójában lévő borítóval (data-film="kulcs").
   * vimeo: a Vimeo-link végén lévő szám (https://vimeo.com/1188963244 → '1188963244').
   */
  films: {
    dokumentumfilm: {
      vimeo: '1188963244',
      title: { hu: 'Dokumentumfilm', en: 'Documentary' }
    },
    storytelling: {
      vimeo: '1188963168',
      title: { hu: 'Visual Storytelling', en: 'Visual Storytelling' }
    },
    eskuvoi: {
      vimeo: '1188707738',
      title: { hu: 'Esküvői film', en: 'Wedding film' }
    }
  }
};
