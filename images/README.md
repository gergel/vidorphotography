# Portfolio képek

Ide kell feltölteni a portfolio képeket. A fájlneveknek pontosan egyezniük kell!

## Cover képek (a portfolio tile-ok háttere)

| Fájlnév | Portfolio tile |
|---|---|
| `gastro.jpg` | Gastro Photography (cover) |
| `portraits.jpg` | Portraits Photography (cover) |
| `event.jpg` | Event Photography (cover) |
| `eskuvo.jpg` | Esküvő Photography (cover) |
| `koncert.jpg` | Koncert Photography (cover) |

## Galéria képek (felugró galéria ablakhoz)

Minden kategóriához külön almappa van. A képeket töltsd fel a megfelelő mappába, majd add hozzá az elérési útjukat az `index.html`-ben a `GALLERIES` objektumhoz.

### Mappastruktúra

```
images/
├── gastro/         ← gastro galéria képek
├── portraits/      ← portré galéria képek
├── event/          ← esemény galéria képek
├── eskuvo/         ← esküvő galéria képek
└── koncert/        ← koncert galéria képek
```

### Ajánlott fájlnév-konvenció

```
images/gastro/gastro-01.jpg
images/gastro/gastro-02.jpg
images/portraits/portraits-01.jpg
...
```

### Képek hozzáadása az index.html-hez

Nyisd meg az `index.html` fájlt, keresd meg a `GALLERIES` objektumot (kb. a JS szekció elején), és add hozzá a képeket:

```js
gastro: {
  title: 'Gastro',
  images: [
    'images/gastro/gastro-01.jpg',
    'images/gastro/gastro-02.jpg',
    'images/gastro/gastro-03.jpg',
  ]
},
```

## Videó thumbnail képek (opcionális)

| Fájlnév | Portfolio tile |
|---|---|
| `dokumentumfilm.jpg` | Dokumentumfilm videó |
| `visual-storytelling.jpg` | Visual Storytelling videó |
| `weddings-video.jpg` | Weddings videó |

## Tippek

- **Cover képek**: legalább 800×600 px, ajánlott 1200×800 px
- **Galéria képek**: legalább 1200×800 px, ajánlott 1920×1280 px vagy nagyobb
- **Formátum**: JPG vagy WebP ajánlott (kisebb fájlméret)
- A képek automatikusan középre igazítva jelennek meg (`object-fit: cover`)
