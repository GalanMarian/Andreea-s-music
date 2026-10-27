# Andreea Rotariu Music Hub

Fișe muzicale interactive pentru copii de 3–8 ani. Notele Do-Re-Mi au fiecare culoarea lor, iar fiecare notă are un personaj.

**Cinci lumi:** 1. Cățeii salvatori · 2. Prințesele la modă · 3. Dinozaurii · 4. Extratereștrii din spațiu · 5. Unicornii.
Fiecare lume are personajele, culorile, fundalul, instrumentul și recompensele ei. Culorile notelor sunt aceleași peste tot (Do roșu, Re portocaliu, Mi galben, Fa verde, Sol turcoaz, La albastru, Si mov, Do' roz).

**Trei vârste:**

| Vârsta | Ce face |
| --- | --- |
| 3–4 ani | Do, Mi, Sol; cântece scurte; două variante de răspuns; numele notelor la vedere |
| 5–6 ani | toate cele 8 note, pe culori; trei variante de răspuns |
| 7–8 ani | citește partitura fără culori; patru variante; fișe „scrie notele” și „desenează notele” |

**Cele 7 fișe din aplicație:** personajele · pianul (cu cântece de urmat) · cine stă pe portativ · sus sau jos · colorează notele · compune · fișe PDF.

## Fișe de colorat (PDF)

- În aplicație, fila **Fișe PDF**: apeși pe o fișă și o colorezi pe ecran, apoi **Exportă PDF** (în fereastra de tipărire: *Salvează ca PDF*).
- Gata făcute, în [`pdf/`](pdf/): câte un PDF pe lume și vârstă (`catei-mic.pdf`, `printese-mijlociu.pdf`, `spatiu-mare.pdf` ...). Fiecare are diplomă, 8 portrete cu nota de scris, pagini de colorat notele și pagini „unește”.

Pentru a le regenera după o modificare: `./scripts/fa-pdf.sh` (are nevoie de Google Chrome).

## Cum se deschide

Fără instalare: deschide `index.html` în browser. Sunetul pornește după prima atingere.

Arată bine pe telefon, tabletă și laptop. Publicat pe un server (de exemplu GitHub Pages), se poate pune pe ecranul telefonului („Adaugă pe ecranul principal”) și merge și fără internet după prima deschidere.

Link direct spre o lume și o vârstă: `index.html?tema=dinozauri&varsta=mic#pian`
(teme: `catei`, `printese`, `dinozauri`, `spatiu`, `unicorni`; vârste: `mic`, `mijlociu`, `mare`).

## Structură

```
index.html
css/app.css        stilurile, inclusiv paginile A4 și tipărirea
js/core.js         note, culori, sunet, portativ, cântece, vârste
js/themes.js       cele 5 lumi și desenele personajelor (color + contur de colorat)
js/games.js        jocurile
js/sheets.js       fișele A4, colorarea pe ecran, exportul PDF
js/app.js          ecranul de start, filele, recompensele
scripts/fa-pdf.sh  generează pdf/
```

Personajele sunt desenate original pentru acest proiect. Cântecele sunt melodii populare, libere de drepturi.
