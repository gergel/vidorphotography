# Service Modal képek

Ide kell feltölteni a **Services** szekció **Details** gombjára felugró modalhoz a képeket.

Minden szolgáltatáshoz **4–6 képet** tölts fel a megfelelő almappába, majd vedd ki a kommentet az elérési utakról az `index.html`-ben a `SERVICES` objektumban.

## Mappastruktúra

```
images/services/
├── wedding/         ← esküvő service képek
├── event/           ← event service képek
├── gastro/          ← gastro service képek
├── portraits/       ← portré service képek
├── concert/         ← koncert service képek
└── documentary/     ← dokumentumfilm service képek
```

## Ajánlott fájlnév-konvenció

```
images/services/wedding/wedding-01.jpg
images/services/wedding/wedding-02.jpg
...
images/services/gastro/gastro-01.jpg
...
```

## Képek hozzáadása az index.html-hez

Nyisd meg az `index.html` fájlt, keresd meg a `SERVICES` objektumot (a JS szekció elején), és vedd ki a kommentet a megfelelő elérési utaknál:

```js
wedding: {
  // ...
  images: [
    'images/services/wedding/wedding-01.jpg',
    'images/services/wedding/wedding-02.jpg',
    'images/services/wedding/wedding-03.jpg',
    'images/services/wedding/wedding-04.jpg',
    'images/services/wedding/wedding-05.jpg',
    'images/services/wedding/wedding-06.jpg',
  ]
},
```

## Tippek

- **Felbontás**: legalább 1200×900 px, ajánlott 1600×1200 px
- **Formátum**: JPG vagy WebP (kisebb fájlméret)
- **Arány**: 4:3 (landscape) ajánlott — a képek automatikusan középre igazítva jelennek meg (`object-fit: cover`)
- Maximum **6 kép** jelenik meg per service
