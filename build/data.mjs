// Dati del sito: contenuti presi dal sito originale cremeriascirocco.it
// e informazioni verificate dalla scheda Google Maps (novembre 2026).

export const INFO = {
  nome: "Cremeria Scirocco",
  claim: "Gelateria artigianale creativa",
  indirizzo: "Via Agostino Barelli 1/c, 40138 Bologna",
  tel: "+39 051 19615315",
  telLabel: "051 196 15315",
  cell: "+39 345 313 2947",
  cellLabel: "345 313 2947",
  email: "info@cremeriascirocco.it",
  maps: "https://www.google.com/maps/place/?q=place_id:ChIJUyD_a2UrfkcR1rRUwzv2Ek8",
  directions: "https://www.google.com/maps/dir/?api=1&destination=Cremeria+Scirocco%2C+Via+Agostino+Barelli+1c%2C+Bologna&destination_place_id=ChIJUyD_a2UrfkcR1rRUwzv2Ek8",
  review: "https://search.google.com/local/writereview?placeid=ChIJUyD_a2UrfkcR1rRUwzv2Ek8",
  reviewsAll: "https://www.google.com/maps/place/Cremeria+Scirocco/@44.4952804,11.4009997,17z/data=!4m8!3m7!1s0x477e2b656bff2053:0x4f12f63bc354b4d6!8m2!3d44.4952804!4d11.4009997!9m1!1b1!16s%2Fg%2F1tf_g7mr",
  mapEmbed: "https://maps.google.com/maps?q=Cremeria%20Scirocco%2C%20Via%20Agostino%20Barelli%201c%2C%2040138%20Bologna&z=16&hl=it&output=embed",
  facebook: "https://www.facebook.com/cremeriascirocco",
  instagram: "https://www.instagram.com/cremeriascirocco/",
  twitter: "https://twitter.com/GelatoScirocco",
  ingredienti: "https://gest.cooki.it/public/cremeria_scirocco",
  gustiLive: "https://www.cremeriascirocco.it/gusti-di-gelato/",
  corsi: "https://www.andreabandiera.it/",
  software: "https://www.readytgo.com/",
  rating: 4.6,
  reviewsCount: 1488,
};

// Orari: Google Maps + post del titolare (nov 2026). Sabato e domenica dalle 10.
// 0 = domenica
export const ORARI = [
  { d: 1, label: "Lunedì", open: "12:00", close: "20:00" },
  { d: 2, label: "Martedì", open: "12:00", close: "20:00" },
  { d: 3, label: "Mercoledì", open: null, close: null },
  { d: 4, label: "Giovedì", open: "12:00", close: "20:00" },
  { d: 5, label: "Venerdì", open: "12:00", close: "20:00" },
  { d: 6, label: "Sabato", open: "10:00", close: "20:00" },
  { d: 0, label: "Domenica", open: "10:00", close: "20:00" },
];

export const PRODOTTI = [
  {
    slug: "gelato-classico",
    nome: "Gelato classico",
    titolo: "Gusti del gelato <em class=\"accent\">classico</em>",
    breve: "Creme e sorbetti con latte a km 0, vaniglia Bourbon e oltre il 50% di frutta.",
    img: "bicchierino-mango-largo",
    chip: "Il cuore del banco",
    color: "#ABC96B",
  },
  {
    slug: "gelato-gastronomico",
    nome: "Gelato gastronomico",
    titolo: "Il gelato <em class=\"accent\">salato</em>",
    breve: "Mandorle al Gorgonzola, Pecorino e miele, Parmigiano e fichi: il gelato entra nel menù.",
    img: "torta-cioccolato",
    chip: "Premiato Gambero Rosso",
    color: "#AD1F5F",
  },
  {
    slug: "torte-semifreddi",
    nome: "Torte e semifreddi",
    titolo: "Torte e <em class=\"accent\">semifreddi</em>",
    breve: "Torte gelato su ordinazione per compleanni, battesimi, matrimoni e cene con amici.",
    img: "torta-mango",
    chip: "Su ordinazione",
    color: "#E7CCB6",
  },
  {
    slug: "monoporzioni",
    nome: "Le monoporzioni",
    titolo: "Le nostre <em class=\"accent\">monoporzioni</em>",
    breve: "Brevi, Tesorini, Lacrime e bicchierini: il fine serata in formato mignon.",
    img: "tesorini",
    chip: "Fine serata",
    color: "#A794A4",
  },
  {
    slug: "granite",
    nome: "Granite siciliane",
    titolo: "Granite <em class=\"accent\">siciliane</em>",
    breve: "Frutta fresca oltre il 50%, niente sciroppi. Da provare la «Sciroccata».",
    img: "bicchierino-fragola",
    chip: "Le più richieste",
    color: "#F28CA8",
  },
  {
    slug: "ghiaccioli",
    nome: "Ghiaccioli artigianali",
    titolo: "Ghiaccioli <em class=\"accent\">artigianali</em>",
    breve: "Fragola, lime e zenzero, menta bianca, yogurt e fragola: a rotazione.",
    img: "stecco-largo",
    chip: "Estate (e non solo)",
    color: "#084177",
  },
];

// Recensioni reali da Google Maps (testo originale, a volte accorciato con «…»)
// e due testimonianze presenti sul sito originale.
export const RECENSIONI = [
  { n: "Elena Catto", s: 5, d: "2 mesi fa", t: "Una gelateria egregia, ingredienti di qualità, sapori intensi, e una gamma di gusti per ogni palato: amanti della tradizione troverete malaga e zabaione eccezionali, ma anche voi sperimentatori sarete sorpresi da gusti salati inediti. Nota di merito per la brioche, imperdibile" },
  { n: "Giada Montori", s: 5, d: "una settimana fa", t: "Gelateria ottima, molto probabilmente la mia preferita di Bologna, offre una selezione di gusti classici ma anche specialità originali, coraggiose ed interessantissime! Il personale è sempre gentile e disponibile ad ascoltare richieste o pareri sui gusti più particolari." },
  { n: "raffo", s: 5, d: "4 mesi fa", t: "Questa gelateria è stata una piacevolissima scoperta! Ho preso crema classica e “il mio pesto” (pesto di basilico con pinoli). La crema classica era piena di gusto, si notavano i punti neri della vaniglia. Il mio pesto è un gusto azzeccatissimo: profuma di basilico e sembra effettivamente di mangiare il pesto, declinato in un gusto di gelato e quindi dolce e cremoso." },
  { n: "Monica Bagnoli", s: 5, d: "4 mesi fa", t: "Gelateria artigianale ECCEZIONALE. L'ho conosciuta nel 2014 e ancora oggi non sono riuscita a trovarne una migliore. Il proprietario Andrea molto preparato, gentile, sempre impegnato nella ricerca di materie prime di qualità e a sperimentare con ingredienti freschi e naturali." },
  { n: "Isabel Badodi", s: 5, d: "un anno fa", t: "Ho conosciuto la gelateria grazie alla Gelato Week e PER FORTUNA! Ingredienti di altissima qualità e gusti anche molto particolari come ad esempio tahina o babaganoush… Oltre alla bontà del gelato, consigliato per la loro gentilezza e simpatia rara." },
  { n: "emanuela mantovani", s: 5, d: "4 mesi fa", t: "Una delle migliori gelaterie della zona! Si sente subito che il gelato è artigianale e fatto con ingredienti di alta qualità. I gusti cremosi (soprattutto il pistacchio) sono spettacolari e non troppo dolci, mentre la frutta è freschissima e leggera." },
  { n: "Carmine Pignata", s: 5, d: "3 mesi fa", t: "Gelateria eccezionale! Prodotti artigianali freschi e di altissima qualità. Il ragazzo al bancone è stato gentilissimo a illustrarmi e consigliarmi i vari gusti e abbinamenti. Alla fine ho preso lo scirocco: crema di zabaglione con pezzi di torta tenerina. Lo consiglio a tutti!" },
  { n: "Lorenzo Casalanguida", s: 5, d: "1 mese fa", t: "Il gelato migliore di Bologna! Un posto unico, di altissima qualità e professionalità, che si riflette nei proprietari: persone squisite." },
  { n: "Marco Pace", s: 5, d: "4 mesi fa", t: "Senza dubbio, una delle migliori gelaterie di Bologna. Oltre ai gusti classici vi sono anche una serie di incredibili sperimentazioni di gusti davvero originali e indescrivibilmente buoni. Voto 5 stelle solo perché 6 non si può." },
  { n: "Mara Matrone", s: 5, d: "un anno fa", t: "Dietro cose belle ci sono belle persone. Un gelato davvero delizioso, dove l’ingrediente segreto non è solo l’amore per il proprio lavoro, ma anche la voglia di sperimentare con gli ingredienti e di stupire il palato. Ci sono gusti anche senza lattosio, che si difendono molto bene dagli altri più tradizionali! Vale la pena arrivarci di proposito." },
  { n: "Sabrina", s: 5, d: "dal sito", t: "Sorbetti sorprendenti, e per me sono un metro di valutazione fondamentale. Gelati con il giusto sapore e una gran bella struttura. Molta moltissima ricerca, tecnica da vendere, passione e grande serietà. Servizio super cordiale. Tanto, ma tanto bravi!" },
  { n: "Julia Roversi", s: 4, d: "2 mesi fa", t: "Ottimo gelato, ma non per tutti: gusti ricercati e materie prime di qualità indiscutibile. Prezzo alto che, a mio avviso, lo rendono un gelato da degustare." },
];

export const PREMI = [
  ["2027", "Tre Coni", "Gelaterie d'Italia 2027"],
  ["2025", "Tre Coni", "Gelaterie d'Italia 2025"],
  ["2024", "Tre Coni", "Gelaterie d'Italia 2024"],
  ["2023", "Tre Coni", "Gelaterie d'Italia 2023"],
  ["2022", "Tre Coni", "Gelaterie d'Italia 2022"],
  ["2021", "Tre Coni", "Gelaterie d'Italia 2021"],
  ["2020", "Tre Coni", "Gelaterie d'Italia 2020"],
  ["2019", "Tre Coni", "Gelaterie d'Italia 2019"],
  ["2018-gastronomico", "Miglior gelato gastronomico", "Premio speciale 2018"],
  ["2018", "Tre Coni", "Gelaterie d'Italia 2018"],
  ["2017", "Tre Coni", "Gelaterie d'Italia 2017"],
];
