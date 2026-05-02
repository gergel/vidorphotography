# Portfolio képek

Ide kell feltölteni a portfolio képeket. A fájlneveknek pontosan egyezniük kell!

## Fotók (cover képek a portfolio tile-okhoz)

| Fájlnév | Portfolio tile |
|---|---|
| `gastro.jpg` | Gastro Photography |
| `portraits.jpg` | Portraits Photography |
| `event.jpg` | Event Photography |
| `eskuvo.jpg` | Esküvő Photography |
| `koncert.jpg` | Koncert Photography |

## Videó thumbnail képek (opcionális — ha van borítókép a videóhoz)

| Fájlnév | Portfolio tile |
|---|---|
| `dokumentumfilm.jpg` | Dokumentumfilm videó |
| `visual-storytelling.jpg` | Visual Storytelling videó |
| `weddings-video.jpg` | Weddings videó |

## Videó linkek módosítása

Az `index.html` fájlban keresd meg ezt a részt és cseréld le a `VIDEO_ID_X` részeket a valódi YouTube videó azonosítóra:

```html
<!-- VIDEO 1 -->
<a href="https://www.youtube.com/watch?v=VIDEO_ID_1" ...>
<!-- VIDEO 2 -->
<a href="https://www.youtube.com/watch?v=VIDEO_ID_2" ...>
<!-- VIDEO 3 -->
<a href="https://www.youtube.com/watch?v=VIDEO_ID_3" ...>
```

A YouTube videó azonosítója (VIDEO_ID) az URL-ben a `?v=` után található, pl.:
`https://www.youtube.com/watch?v=`**dQw4w9WgXcQ** → azonosító: `dQw4w9WgXcQ`

## Tippek

- Ajánlott képméret: minimum 800×600 px, lehetőleg 1200×900 px vagy nagyobb
- Formátum: JPG vagy WebP ajánlott (kisebb fájlméret)
- A képek automatikusan középre igazítva és kitöltő módban (`cover`) jelennek meg
