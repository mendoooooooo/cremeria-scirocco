# Cremeria Scirocco — Restyling del sito web

Proposta di restyling del sito della **Cremeria Scirocco**, gelateria artigianale creativa di Andrea Bandiera a Bologna (via Barelli 1/c), premiata con i **Tre Coni del Gambero Rosso**.

Il progetto ripensa il sito attuale ([cremeriascirocco.it](https://www.cremeriascirocco.it/wordpress/)) con un design moderno e mobile-first, mantenendo l'identità visiva originale (verde e magenta del logo, blu e beige), i contenuti e le fotografie della Cremeria.

> **Nota:** si tratta di una proposta realizzata di propria iniziativa e non del sito ufficiale. Testi, fotografie, logo e marchi appartengono alla Cremeria Scirocco e ai rispettivi titolari.

---

## Funzionalità principali

| Area | Cosa offre |
|---|---|
| **Hero 3D** | Cono gelato in Three.js che segue il mouse; su mobile ruota da solo. Se il 3D non è supportato compare una foto. |
| **Gusti di oggi** | Menu dei gusti in vetrina con filtri per tipo (creme all'uovo, creme senza uova, sorbetti), esclusione degli allergeni e ricerca. |
| **Prodotti** | Una pagina per ogni linea: gelato classico, gastronomico, torte e semifreddi, monoporzioni, granite, ghiaccioli. |
| **Premi** | Nastro a scorrimento continuo con tutti i riconoscimenti Gambero Rosso, con ingrandimento delle immagini. |
| **Recensioni** | Carosello automatico di recensioni reali da Google (4,6 ★ su 1.488), scorrimento con il dito e link "Lascia una recensione". |
| **Orari e mappa** | Indicatore "aperto ora" basato sull'ora di Roma, tabella orari, mappa che si carica da sola e contatti in un tocco. |
| **Contatti e ordini** | Modulo per torte e gusti su misura con validazione, calendario personalizzato (mercoledì chiuso) e conferma. |
| **Foglio Google** | Gusti in vetrina, gusti iconici della home, orari e avvisi (ferie, chiusure) si aggiornano da un foglio Google, senza toccare il codice. |
| **Bilingue** | Versione italiana e inglese (`/en/`), con selettore IT/EN nell'header e tag `hreflang` per i motori di ricerca. |
| **SEO** | Meta tag e anteprime social per ogni pagina, dati strutturati `IceCreamShop` e `FAQPage` (JSON-LD). |

## Design e accessibilità

- **Colori originali** come variabili CSS: verde `#ABC96B`, magenta `#AD1F5F`, blu `#084177`, beige `#E7CCB6`.
- **Tipografia:** Fraunces per i titoli, Work Sans per i testi (Google Fonts).
- **Animazioni** solo su `transform` e `opacity` per restare fluide: entrata delle sezioni allo scroll, card con inclinazione 3D, pulsanti magnetici, ingredienti in profondità che seguono il mouse.
- **Accessibilità:** contrasti AA, navigazione da tastiera con focus visibile, testi alternativi, target touch di almeno 44 px. Con `prefers-reduced-motion` attivo, animazioni e 3D si disattivano.
- **Responsive** da 360 px a schermi grandi, senza scorrimento orizzontale; barra di azioni rapide su mobile.

## Tecnologie

Sito statico in **HTML, CSS e JavaScript** senza framework e senza dipendenze da installare.

- [Three.js r128](https://threejs.org/) (da CDN, caricato solo se serve) per la scena 3D
- **Node.js** solo per generare le pagine (`build/`)
- **Python + Pillow** solo per ottimizzare le immagini (`build_img.py`)

## Struttura del progetto

```
cremeria-scirocco/
├── index.html, gusti.html, prodotti.html, …   pagine italiane (generate)
├── en/                                          pagine inglesi (generate)
├── css/style.css                                stili e variabili di colore
├── js/
│   ├── main.js                                  interazioni, caroselli, orari, form, calendario
│   ├── hero3d.js                                scena 3D dell'hero
│   ├── gusti.js                                 menu dei gusti con filtri
│   ├── foglio.js                                lettura del foglio Google (gusti, orari, avvisi)
│   └── gusti-data.js                            gusti di riserva se il foglio non è collegato (IT + EN)
├── img/                                         immagini ottimizzate (WebP + JPG/PNG)
├── build/
│   ├── build.mjs                                genera tutte le pagine
│   ├── data.mjs                                 contatti, orari, prodotti, recensioni, premi
│   ├── i18n.mjs                                 crea la versione inglese
│   ├── en-dict.mjs                              dizionario italiano → inglese
│   └── i18n-extract.mjs                         elenca i testi da tradurre
└── build_img.py                                 conversione e ottimizzazione delle immagini
```

## Anteprima in locale

Il sito è statico: basta un qualsiasi server web locale. Dalla cartella del progetto:

```bash
python -m http.server 5191
```

Poi apri <http://localhost:5191>. La versione inglese è su <http://localhost:5191/en/>.

## Come aggiornare i contenuti

### Gusti, orari e avvisi: dal foglio Google
La gelateria aggiorna questi contenuti da un foglio Google con quattro schede:

| Scheda | Cosa controlla sul sito |
|---|---|
| **Gusti** | `In vetrina` = gusti della pagina "Gusti di oggi"; `Iconico` = card "Gusti iconici" della home. Nome, tipo, descrizione, allergeni, etichetta, colore e testi in inglese. |
| **Orari** | Apertura e chiusura di ogni giorno: tabella orari, "aperto ora", footer e giorni prenotabili nel modulo. |
| **Avvisi** | Messaggi con date `Dal`/`Al`: striscia sotto l'header (da 10 giorni prima). Con `Chiuso` spuntato, il sito segna la gelateria chiusa in quei giorni. |
| **Come si usa** | Istruzioni per chi aggiorna il foglio. |

Ogni scheda è pubblicata sul web come CSV (*File → Condividi → Pubblica sul web*) e i tre link sono in `FOGLIO`, dentro `build/data.mjs`. Le modifiche compaiono sul sito entro circa 5 minuti, il tempo di aggiornamento di Google.

- **Se il foglio non risponde** il sito usa gli ultimi dati validi salvati nel browser, oppure quelli di riserva: `js/gusti-data.js` per i gusti e `ORARI` in `build/data.mjs`.
- **Non rinominare le intestazioni** delle colonne: il sito le usa per leggere i dati. Le colonne in più vengono ignorate.
- **Colonna Colore:** uno script del foglio (*Estensioni → Apps Script*) colora la cella in base al codice scritto, con testo bianco o nero in automatico.

Senza link in `FOGLIO`, i gusti si modificano in `js/gusti-data.js` (con la data `SCIROCCO_AGGIORNATO` e le traduzioni in `SCIROCCO_GUSTI_EN`).

### Orari, contatti, prodotti, recensioni
Modifica `build/data.mjs`, poi rigenera le pagine:

```bash
node build/build.mjs
```

Il comando scrive le pagine italiane e quelle inglesi, ed elenca alla fine gli eventuali testi non ancora tradotti.

### Testi e traduzioni
I testi delle pagine stanno in `build/build.mjs`. Dopo una modifica aggiungi la traduzione in `build/en-dict.mjs` e rigenera le pagine. Le recensioni restano volutamente nella lingua originale.

### Immagini
Le immagini in `img/` sono già ottimizzate. Per rigenerarle dagli originali (non inclusi nel repository) serve `python build_img.py <cartella_immagini_migliorate>`.

## Pubblicazione

La cartella del progetto si può pubblicare così com'è su qualunque hosting statico (GitHub Pages, Netlify, Vercel o un hosting tradizionale). Prima di andare online conviene:

- aggiornare l'indirizzo del sito in `build/build.mjs` e `build/i18n.mjs` (costante `SITE`) e rigenerare le pagine;
- collegare il modulo contatti a un servizio di invio email (oggi apre il programma di posta dell'utente con il messaggio già scritto);
- far rileggere la traduzione inglese da un madrelingua.

## Fonti dei contenuti

- Testi, prodotti e fotografie: sito attuale della Cremeria Scirocco.
- Orari, valutazione media e recensioni: scheda Google Maps della Cremeria (novembre 2026).
- Riconoscimenti: guida *Gelaterie d'Italia* del Gambero Rosso.

---

Restyling a cura di **Mirko Menditto**, sviluppatore web.
