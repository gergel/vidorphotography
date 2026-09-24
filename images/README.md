# Képek

- `images/<mappa>/…` — **eredeti** képek (a szkript nem módosítja őket):
  `eskuvo/`, `portraits/`, `gastro/`, `koncert/`, `event/` (rendezvény), `film/` (videóborító),
  valamint a gyökérben lévő borítók (`koncert.jpg`, `gastro.jpg`, `about-photo.jpg`,
  `dokumentumfilm.jpg`, `visual-storytelling.jpg`, `weddings-video.jpg`) és a repository
  gyökerében lévő `headline.jpg` (Rólam szekció).
- `images/web/…` — optimalizált WebP-változatok, a `python3 tools/build-images.py`
  generálja. Ne szerkeszd kézzel.
- `images/services/` — a korábbi oldal „Details” ablakához tartozó képek másolatai.
  Az új oldal nem használja őket; megőrzésük csak archív célú.

Képek hozzáadásának menete: lásd a repository gyökerében lévő `README.md`-t.

Az `eskuvo/`, `portraits/`, `event/`, `gastro/gastro-02…07`, `koncert/koncert-03…07` és
`film/dokumentumfilm-borito.jpg` fájlok a korábbi vidorphotography.com oldalról
származnak (az ott tárolt legnagyobb, max. 2400 px széles változat). Ha megvannak az
eredeti, nagyobb felbontású fájlok, azonos néven cserélhetők, majd futtasd újra a szkriptet.
