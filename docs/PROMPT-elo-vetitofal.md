# Prompt — „ÉLŐ VETÍTŐFAL” weboldal (VIDOR Photo & Film)

> Ezt a promptot bármely fejlesztő (vagy AI-asszisztens) megkaphatja: ebből a
> `docs/VIDOR-design-terv-elo-vetitofal.pdf` látványterv szerinti oldal elkészíthető.

## Feladat
Építsd újra Vidor Gergely (VIDOR Photo & Film, budapesti fotós és operatőr) egyoldalas
portfólióját a meglévő **Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + Framer Motion**
projektben, **csak magyarul**. Koncepció: az oldal egy sötét **vetítőterem**. A falán
különböző méretű, folyamatosan mozgó csempékben futnak a munkái. Görgetés közben a terem
fénye a műfaj színére vált. Minden mozog és reagál, de gyors és akadálymentes marad.

## Kötelező szabályok
- Csak a saját fotók (`public/images/…`) és az azokból készült loopok. Nincs stock, nincs MI-kép.
- Ne találj ki ügyfelet, díjat, véleményt, számot, árat vagy határidőt. Csak a `lib/content.ts` szövegei.
- **Szöveg soha nem kerül közvetlenül videóra vagy fotóra.** Tömör színes csempére vagy sötét
  sávra kerül. Kis, sötét hátterű címke-chip megengedett.
- Maradjon meg: galériák (natív `<dialog>`), 3 Vimeo-film (csak kattintásra, modalban),
  kapcsolati űrlap (`/api/contact` → Resend, 501 esetén FormSubmit), SEO, Railway (`npm run build` / `npm start`).
- Hamis „sikeres küldés” nincs. Hibánál a beírt szöveg megmarad.
- Az éles oldal nem cserélődik automatikusan: fejlesztés a munkaágon, előnézet után merge.

## Design tokenek
| Token | Érték | Szerep |
|---|---|---|
| night | `#0B0A12` | alap háttér |
| night-2 / night-3 | `#13111C` / `#1C1927` | panelek |
| text / muted | `#F4F1EA` / `#B3AEC0` | szöveg |
| sun | `#FFB547` | **Esküvő**, fő akció (CTA) |
| dusk | `#FF5FA2` | **Koncert** |
| violet | `#9B7BFF` | **Portré** |
| ember | `#FF7A45` | **Gasztro** |
| teal | `#2EE6C8` | **Rendezvény** |

- A színes felületeken mindig sötét (`night`) betű áll, a kontraszt minden színen ≥ 6:1.
- Betűk (next/font, latin-ext): **Bricolage Grotesque** 800/600 (címek), **Inter** 400/500/600 (szöveg),
  **JetBrains Mono** 500 (nagybetűs címkék, timecode: `ESKÜVŐ · 00:08`).
- Csempék: 6 px-es lekerekítés, 10 px fekete rés. Mozgásgörbe: `cubic-bezier(0.23,1,0.32,1)`.
  Csak transform, opacity és clip-path animálódik.
- **Fényszivárgás:** fix, nagy, puha radiális fény a tartalom mögött. A színe a képernyőn lévő
  szekció (vagy a rámutatott csempe) műfajszínére vált, 600 ms áttűnéssel. Tisztán CSS, nincs WebGL.

## Szekciók
1. **Fejléc:** VIDOR / PHOTO & FILM logó; menü: Munkák, Filmek, Szolgáltatások, Rólam.
   Két gomb: „Mozgás” szüneteltetés (minden videót és animációt megállít, WCAG 2.2.2) és
   „Ajánlatkérés →” (naparany). Mobilon teljes képernyős menü, minden érintési cél ≥ 44 px.
2. **Nyitóoldal — élő fal (100svh):** aszimmetrikus rács, benne:
   - nagy Esküvő-loop, Koncert-loop, álló Portré-loop és Gasztro-loop;
   - Rendezvény-csempe és Filmek-csempe (lejátszás ikonnal, a filmekhez görget);
   - címsor-csempe tömör naparany alapon: „Fotók és filmek. Saját látásmóddal.” + „Munkáim ↓”.
   - Belépő: a csempék letterbox-sávok közül nyílnak, 80 ms-os lépcsővel.
   - Egér: csempénként ±2–6 px-es térhatás (nem az egész oldal dől).
   - Rámutatás: enyhe nagyítás, műfajszínű keret, a többi csempe halványul, a fény színe vált.
     Kattintásra a galéria nyílik.
   - Mobilon: címsor-csempe felül, 1 nagy és 2 kis csempe.
3. **Műfaj-szalag:** óriási futó felirat (ESKÜVŐ · KONCERT · PORTRÉ · GASZTRO · RENDEZVÉNY).
   A sebessége a görgetés tempójától függ (felső határral). Minden szó valódi link a galériához.
   Rámutatáskor a szó műfajszínt kap, és kis előnézet követi a kurzort.
4. **Munkák — élő mozaik:** szűrő-chipek (Mind / Esküvő / Koncert / Portré / Gasztro / Rendezvény).
   Szűréskor a csempék animáltan rendeződnek át (layout-animáció). Cím, leírás és fotószám
   tömör sávon a kép alatt. Rámutatásra indul a loop. Kattintásra a galéria nyílik.
5. **Mozisáv:** görgetésre egy 16:9-es kártya széltől szélig érő, 21:9-es sávvá nyílik
   (≤ 1,5 képernyőnyi görgetés). Alatta, a fekete sávon, az idézet szavanként kivilágosodik:
   „Nem csupán azt keresem, ami történik. Azt keresem, ami megmarad belőle.”
6. **Filmek — vetítőtekercs:** vízszintesen húzható filmszalag perforációval. Rajta a 3 film
   kártyája (poszter, cím, mondat, timecode-os hossz). Előző/következő gomb és számláló.
   A lejátszógomb „mágnesesen” (≤ 40 px) követi a kurzort. Kattintásra modalban nyílik a
   Vimeo-lejátszó, bezáráskor leáll. Billentyűzet: ←/→, Enter, Esc. Mobilon húzás, scroll-snap.
7. **Szolgáltatások:** 4 óriásbetűs sor (01–04). Rámutatáskor a sor műfajszínnel töltődik ki, és
   a kurzor mellett kis loop-ablak lebeg. Az „Ezt kérem →” a Kapcsolathoz görget, és előre
   kiválasztja a műfajt. Mobilon a sorok lenyílók.
8. **Rólam és szemlélet:**
   - Rólam: lassan közelítő portré-loop mellett a bemutatkozás és a „Budapest · 2015 óta” jelvény.
   - Szemlélet: vágóprogram-idővonal. Klipek: 01 Kapcsolódás, 02 Alkotás, 03 Átadás.
     A piros lejátszófej görgetésre halad, az aktív klip mondata tömör panelen jelenik meg.
9. **Kapcsolat:** nagy színes panel („Mesélj a történetedről.”), amelynek színe és kis loopja a
   kiválasztott műfaj-chipet követi. Mezők: Név, E-mail, műfaj-chipek, Üzenet;
   gomb: „Üzenet küldése →”. Állapotok: Küldés… / siker (csak valódi siker után) / hiba (a szöveg megmarad).
10. **Lábléc:** óriási „VIDOR” felirat, a betűiben loop fut. Alatta e-mail, telefon, Instagram
    és „Vissza a tetejére ↑”.

## Videók (loopok)
- `tools/videos.json` + `python3 tools/build-videos.py`: saját fotókból lassú kameramozgás
  (nagyítás, pásztázás) és áttűnés. Kimenet: `public/videos/<id>.mp4` + `.webm` + `-poster.webp`.
- Loopok: `hero-eskuvo`, `hero-koncert`, `hero-portre`, `hero-gasztro`, `hero-rendezveny`,
  `mozisav`, `rolam`, valamint `lablec` (a lábléc felirata mögé).
- Egy loop 0,3–1,5 MB. Valódi klip később ugyanazzal a fájlnévvel felülírható.

## Teljesítmény és akadálymentesség
- **Videókeret:** egyszerre legfeljebb 4 videó fut asztali gépen, 2 mobilon.
  Adatkímélő módban, lassú netnél, csökkentett mozgásnál vagy a „Mozgás” gombbal szüneteltetve 0.
  Ami kikerül a képből, megáll. A rejtett lapon is minden megáll.
- Az első kép előre töltött poszter (LCP), így nincs üres csempe.
- `prefers-reduced-motion`: nincs loop, parallax vagy szalagmozgás, csak áttűnés.
  A mozisáv és az idézet végállapotban jelenik meg.
- Teljes billentyűzetes használat, látható fókusz, valódi `<a>`/`<button>` elemek.
- Tiltólista: elmosás videón, az egész oldalt döntő 3D, hosszú, beragadó görgetés.
- Ellenőrzés 390 / 768 / 1440 px-en; nincs vízszintes görgetés.
