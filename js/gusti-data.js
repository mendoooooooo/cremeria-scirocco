/* Gusti in vetrina alla Cremeria Scirocco.
   Per aggiornare il menu basta modificare questa lista e la data qui sotto.
   tipo: "uova" = crema con latte e uova · "latte" = crema con latte, senza uova · "sorbetto" = senza latte e senza uova
   allergeni: "latticini", "uova", "frutta a guscio", "solfiti" (lista vuota = nessun allergene)
   colore: colore della pallina nella card
   tag: etichetta facoltativa (es. "Premiato", "Gastronomico", "Novità") */
window.SCIROCCO_AGGIORNATO = "2026-11-20";
window.SCIROCCO_GUSTI = [
  { nome: "Cioccolato", tipo: "uova", allergeni: ["latticini", "uova"], colore: "#5A3420", desc: "Una miscela di cioccolati Valrhona: rotonda, non troppo fondente, con finale lungo e pulito." },
  { nome: "Cioccolato al Rum", tipo: "uova", allergeni: ["latticini", "solfiti", "uova"], colore: "#3E2216", desc: "Cioccolato Valrhona e rum giamaicano invecchiato 7 anni: profondo, caldo, avvolgente." },
  { nome: "Crema Classica", tipo: "uova", allergeni: ["latticini", "uova"], colore: "#F3D98B", desc: "Crema pasticcera setosa con vaniglia del Madagascar e una punta di limone grattugiato." },
  { nome: "Mascarpone Classico", tipo: "uova", allergeni: ["latticini", "uova"], colore: "#F6EBD3", desc: "Una crema di mascarpone all’uovo, con scaglie di cioccolato fondente." },
  { nome: "Panettone da grandi", tipo: "uova", allergeni: ["frutta a guscio", "latticini", "uova"], colore: "#E8C27A", desc: "Mascarpone e panettone si fondono in una crema golosa, con una carezza di rum invecchiato." },
  { nome: "Zabajone", tipo: "uova", allergeni: ["latticini", "uova"], colore: "#E9B949", desc: "Zabajone classico con Marsala invecchiato oltre 20 anni: un “tuffo” nei ricordi, con finale caldo.", tag: "Classico di casa" },
  { nome: "Zucca e Cannella", tipo: "uova", allergeni: ["latticini", "uova"], colore: "#E39A45", desc: "Zucca cotta al forno e un mix di spezie: dolcezza naturale, cannella in primo piano." },
  { nome: "Bacione", tipo: "latte", allergeni: ["frutta a guscio", "latticini"], colore: "#7B4B2E", desc: "Un “bacio” rivisitato: cacao, pistacchio e granella di nocciola e pistacchio." },
  { nome: "Caramello Salato", tipo: "latte", allergeni: ["latticini"], colore: "#C98A45", desc: "Caramello morbido, vaniglia e sale: dolce-sapido in perfetto equilibrio." },
  { nome: "Il latte della nonna", tipo: "latte", allergeni: ["latticini"], colore: "#FBF5EE", desc: "Gelato al latte profumato alla vaniglia, cremoso e avvolgente come un ricordo d’infanzia." },
  { nome: "Mandorle al Gorgonzola", tipo: "latte", allergeni: ["frutta a guscio", "latticini"], colore: "#D9CBA0", desc: "Un gelato insolito: la mandorla amara e dolce si lega perfettamente al Gorgonzola. Miglior gusto gastronomico 2018 per la guida Gambero Rosso.", tag: "Premiato" },
  { nome: "Marrone Balogio", tipo: "latte", allergeni: ["latticini"], colore: "#8C5B3C", desc: "Marroni Balogio lavorati in gelato: sapore autentico di castagna, senza eccessi." },
  { nome: "Nocciola", tipo: "latte", allergeni: ["frutta a guscio", "latticini"], colore: "#B98552", desc: "Nocciola trilobata dell’Alta Langa: tostatura elegante, gusto pieno e persistente." },
  { nome: "Pistacchio", tipo: "latte", allergeni: ["frutta a guscio", "latticini"], colore: "#ABC96B", desc: "Pistacchio siciliano di Raffadali: verde vero, sapore lungo, zero compromessi." },
  { nome: "Stracciatella", tipo: "latte", allergeni: ["latticini"], colore: "#F4EEE6", desc: "Fior di panna con copertura fondente e un tocco di anice Varnelli: sorprendente e pulita." },
  { nome: "Violet", tipo: "latte", allergeni: ["latticini"], colore: "#8E4C82", desc: "Cassis, latte fresco e percoche semicandite. Profondo, fruttato, elegante." },
  { nome: "Blu", tipo: "sorbetto", allergeni: ["frutta a guscio"], colore: "#3D8FD1", desc: "Sorbetto fresco e vibrante: bergamotto, limone e arancio con anacardi e mandorla amara. Un tocco di spirulina blu lo rende unico." },
  { nome: "Essenza di Cioccolato", tipo: "sorbetto", allergeni: [], colore: "#2E1A12", desc: "Sorbetto al cioccolato: massa di cacao 100%, acqua e zuccheri. Intensità pura." },
  { nome: "Mango", tipo: "sorbetto", allergeni: [], colore: "#F4B533", desc: "Sorbetto con oltre il 50% di mango Alphonso: tropicale, succoso, luminoso." },
];

/* Versione inglese (pagina en/gusti.html). Chiave = nome italiano del gusto.
   Se un gusto nuovo non è qui, sul sito inglese compare con nome e descrizione in italiano. */
window.SCIROCCO_GUSTI_EN = {
  "Cioccolato": { nome: "Chocolate", desc: "A blend of Valrhona chocolates: round, not too dark, with a long, clean finish." },
  "Cioccolato al Rum": { nome: "Chocolate & Rum", desc: "Valrhona chocolate and 7-year-old Jamaican rum: deep, warm, enveloping." },
  "Crema Classica": { nome: "Classic Custard", desc: "Silky custard with Madagascar vanilla and a hint of grated lemon." },
  "Mascarpone Classico": { nome: "Classic Mascarpone", desc: "An egg-based mascarpone cream with dark chocolate flakes." },
  "Panettone da grandi": { nome: "Grown-up Panettone", desc: "Mascarpone and panettone melt into a rich cream, with a touch of aged rum." },
  "Zabajone": { nome: "Zabaglione", desc: "Classic zabaglione with Marsala aged over 20 years: a trip down memory lane, with a warm finish.", tag: "House classic" },
  "Zucca e Cannella": { nome: "Pumpkin & Cinnamon", desc: "Oven-baked pumpkin and a blend of spices: natural sweetness, cinnamon up front." },
  "Bacione": { nome: "Bacione", desc: "A “kiss” reinvented: cocoa, pistachio and chopped hazelnuts and pistachios." },
  "Caramello Salato": { nome: "Salted Caramel", desc: "Soft caramel, vanilla and salt: sweet and savoury in perfect balance." },
  "Il latte della nonna": { nome: "Grandma’s Milk", desc: "Vanilla-scented milk gelato, creamy and comforting like a childhood memory." },
  "Mandorle al Gorgonzola": { nome: "Almonds & Gorgonzola", desc: "An unusual gelato: bitter and sweet almond blend perfectly with Gorgonzola. Best savoury flavour 2018 in the Gambero Rosso guide.", tag: "Award-winning" },
  "Marrone Balogio": { nome: "Balogio Chestnut", desc: "Balogio chestnuts turned into gelato: true chestnut flavour, nothing overdone." },
  "Nocciola": { nome: "Hazelnut", desc: "Tonda Gentile hazelnut from Alta Langa: elegant roast, full and lasting flavour." },
  "Pistacchio": { nome: "Pistachio", desc: "Sicilian pistachio from Raffadali: truly green, long-lasting flavour, zero compromises." },
  "Stracciatella": { nome: "Stracciatella", desc: "Fior di latte cream with dark chocolate and a touch of Varnelli aniseed: surprising and clean." },
  "Violet": { nome: "Violet", desc: "Blackcurrant, fresh milk and candied peaches. Deep, fruity, elegant." },
  "Blu": { nome: "Blu", desc: "A fresh, vibrant sorbet: bergamot, lemon and orange with cashews and bitter almond. A touch of blue spirulina makes it unique." },
  "Essenza di Cioccolato": { nome: "Chocolate Essence", desc: "Chocolate sorbet: 100% cocoa mass, water and sugars. Pure intensity." },
  "Mango": { nome: "Mango", desc: "Sorbet with over 50% Alphonso mango: tropical, juicy, bright." },
};
