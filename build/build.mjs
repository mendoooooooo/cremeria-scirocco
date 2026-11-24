// Genera le pagine HTML statiche con header/footer condivisi.
// Uso: node build/build.mjs   (dalla cartella del progetto)
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { INFO, ORARI, PRODOTTI, RECENSIONI, PREMI, FOGLIO } from "./data.mjs";
import { emit } from "./i18n.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.cremeriascirocco.it/";
// versione dei file CSS/JS: cambia a ogni build, così i browser scaricano sempre quelli aggiornati
const V = Date.now().toString(36);

/* ---------------- icone ---------------- */
const I = {
  arrow: '<svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  arrowL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  chev: '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="M22 7l-10 6L2 7"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M12 7v5l3 2"/></svg>',
  cone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 11l5 11 5-11"/><path d="M6.5 11a5.5 5.5 0 1 1 11 0z"/><path d="M9 14.5l5-1.5M10.5 18l3-1"/></svg>',
  cake: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M4 21v-8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8"/><path d="M4 16c2 1.3 3.3 1.3 4.7 0s2.7-1.3 4 0 2.7 1.3 4 0 2-1.3 3.3 0M12 11V7"/><path d="M12 7c-1-1-1-2.5 0-4 1 1.5 1 3 0 4z"/></svg>',
  drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3h8l-1 6H9z"/><path d="M6 9h12l-2 12H8z"/><path d="M9 14h6"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>',
  google: '<svg class="g-logo" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>',
  miniCone: '<svg viewBox="0 0 14 22" fill="currentColor" aria-hidden="true"><circle cx="7" cy="6" r="5.5"/><path d="M2 9h10l-5 12.5z" opacity=".75"/></svg>',
};
const ALG = {
  latticini: '<svg class="alg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2h6M10 2v3l-3 4v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9l-3-4V2"/><path d="M7 13h10"/></svg>',
  uova: '<svg class="alg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3c3.5 0 6.5 5.5 6.5 10a6.5 6.5 0 0 1-13 0C5.5 8.5 8.5 3 12 3z"/></svg>',
  "frutta a guscio": '<svg class="alg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 10h14a7 7 0 0 1-14 0z"/><path d="M4 10c0-3 3.5-5 8-5s8 2 8 5M12 5V2.5"/></svg>',
  solfiti: '<svg class="alg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2h8l-.5 7a3.5 3.5 0 0 1-7 0z"/><path d="M12 12.5V20M8.5 21h7"/></svg>',
};
const stars = (n) => `<span class="stars" aria-label="${n} stelle su 5">${[1, 2, 3, 4, 5].map((i) => I.star.replace("<svg", `<svg class="${i <= n ? "" : "off"}"`)).join("")}</span>`;
const pic = (name, alt, { w, h, cls = "", eager = false, sizes = "100vw", png = false } = {}) =>
  `<picture><source srcset="img/${name}.webp" type="image/webp"><img src="img/${name}.${png ? "png" : "jpg"}" alt="${alt}"${w ? ` width="${w}" height="${h}"` : ""}${cls ? ` class="${cls}"` : ""} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" sizes="${sizes}"></picture>`;

const SIZES = {
  "torta-mango": [1800, 1200], "torta-cioccolato": [1800, 1200], "bicchierino-fragola": [1100, 1650], "bicchierino-mango": [1100, 1650],
  "cono-malaga": [800, 1121], "andrea-mara-banco": [1000, 1401], "andrea-mara": [1100, 1550], "stecco-pistacchio": [1400, 1867],
  tesorini: [1400, 933], "stecco-largo": [1495, 1052], "bicchierino-mango-largo": [1495, 1052], monoporzione: [828, 1027], pozzetti: [1400, 751], "banner-tiramisu": [1600, 600], "banner-cioccolato": [1600, 600],
  "banner-bicchieri": [1600, 600], "banner-mango": [1600, 600],
};
const P = (name, alt, opt = {}) => { const s = SIZES[name] || []; return pic(name, alt, { w: s[0], h: s[1], ...opt }); };

/* ---------------- layout ---------------- */
const NAV = [
  { href: "index.html", label: "Home", id: "home" },
  { href: "gusti.html", label: "Gusti di oggi", id: "gusti" },
  { href: "prodotti.html", label: "Prodotti", id: "prodotti", sub: true },
  { href: "chi-siamo.html", label: "Chi siamo", id: "chi-siamo" },
  { href: "lavora-con-noi.html", label: "Lavora con noi", id: "lavora" },
  { href: "contatti.html", label: "Contatti", id: "contatti" },
];

function head({ title, desc, page, img = "torta-mango" }) {
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#052A4D">
<link rel="canonical" href="${SITE}${page === "home" ? "" : page + ".html"}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Cremeria Scirocco">
<meta property="og:locale" content="it_IT">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${SITE}img/${img}.jpg">
<meta name="twitter:card" content="summary_large_image">
__HREFLANG__
<link rel="icon" href="img/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..600,0..100,0..1;1,9..144,300..600,0..100,0..1&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css?v=${V}">
</head>`;
}

function header(page) {
  const sub = PRODOTTI.map((p) => `<li><a href="${p.slug}.html"><i class="sub-dot" style="--c:${p.color}"></i><span>${p.nome}<small>${p.chip}</small></span></a></li>`).join("");
  const items = NAV.map((n) =>
    n.sub
      ? `<li class="has-sub"><a href="${n.href}"${page === n.id || PRODOTTI.some((p) => p.slug === page) ? ' aria-current="page"' : ""}>${n.label}${I.chev}</a><ul class="submenu">${sub}</ul></li>`
      : `<li><a href="${n.href}"${page === n.id ? ' aria-current="page"' : ""}>${n.label}</a></li>`
  ).join("");
  const mm = NAV.map((n) =>
    n.sub
      ? `<li><a href="${n.href}">${n.label}${I.arrow}</a><div class="mm-sub">${PRODOTTI.map((p) => `<a href="${p.slug}.html">${p.nome}</a>`).join("")}</div></li>`
      : `<li><a href="${n.href}"${page === n.id ? ' aria-current="page"' : ""}>${n.label}${I.arrow}</a></li>`
  ).join("");
  return `
<a class="skip-link" href="#main">Vai al contenuto</a>
<header class="site-header${page === "home" ? "" : " is-solid"}" id="top">
  <div class="container header-inner">
    <a class="brand" href="index.html" aria-label="Cremeria Scirocco, torna alla home">
      <img src="img/logo-andrea-bandiera.png" alt="Andrea Bandiera" width="161" height="46">
      <span class="brand-text"><b>Cremeria Scirocco</b><small>Gelateria · Bologna</small></span>
    </a>
    <nav class="main-nav" aria-label="Menu principale"><ul>${items}</ul></nav>
    <div class="lang-switch" role="group" aria-label="Lingua"><a href="__HREF_IT__" lang="it" hreflang="it"__CUR_IT__>IT</a><a href="__HREF_EN__" lang="en" hreflang="en"__CUR_EN__>EN</a></div>
    <a class="btn btn--small header-cta magnetic" href="contatti.html#torta"><span>Ordina una torta</span>${I.arrow}</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Apri il menu"><span></span><span></span><span></span></button>
  </div>
</header>
<div class="mobile-menu" id="mobile-menu" aria-hidden="true">
  <nav aria-label="Menu mobile"><ul>${mm}</ul></nav>
  <div class="mm-contact">
    <a class="btn" href="tel:${INFO.tel.replace(/\s/g, "")}">${I.phone}<span>Chiama ${INFO.telLabel}</span></a>
    <span>${INFO.indirizzo}</span>
  </div>
</div>`;
}

function footer() {
  const orari = ORARI.map((o) => `<li>${o.label.slice(0, 3)} · ${o.open ? `${o.open}–${o.close}` : "chiuso"}</li>`).join("");
  return `
<footer class="site-footer">
  <div class="container">
    <div class="footer-big" aria-hidden="true">Cremeria Scirocco</div>
    <div class="footer-grid">
      <div>
        <div class="footer-logo"><img src="img/logo-andrea-bandiera.png" alt="Andrea Bandiera" width="196" height="56" loading="lazy"></div>
        <p>Gelateria artigianale creativa dal 2005. Laboratorio a vista in via Barelli, a Bologna. Tre Coni Gambero Rosso.</p>
        <div class="socials">
          <a href="${INFO.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${I.ig}</a>
          <a href="${INFO.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${I.fb}</a>
          <a href="${INFO.twitter}" target="_blank" rel="noopener" aria-label="X (Twitter)">${I.x}</a>
        </div>
      </div>
      <div>
        <h3>Prodotti</h3>
        <ul>${PRODOTTI.map((p) => `<li><a href="${p.slug}.html">${p.nome}</a></li>`).join("")}<li><a href="gusti.html">Gusti di oggi</a></li></ul>
      </div>
      <div>
        <h3>Scirocco</h3>
        <ul>
          <li><a href="chi-siamo.html">Chi siamo</a></li>
          <li><a href="contatti.html">Contatti e ordini</a></li>
          <li><a href="lavora-con-noi.html">Lavora con noi</a></li>
          <li><a href="${INFO.ingredienti}" target="_blank" rel="noopener">Lista ingredienti e allergeni</a></li>
        </ul>
        <h3 style="margin-top:28px">Per professionisti</h3>
        <ul>
          <li><a href="${INFO.corsi}" target="_blank" rel="noopener">Corsi di Andrea Bandiera</a></li>
          <li><a href="${INFO.software}" target="_blank" rel="noopener">Software per gelatieri</a></li>
        </ul>
      </div>
      <div>
        <h3>Vieni a trovarci</h3>
        <ul>
          <li><a href="${INFO.directions}" target="_blank" rel="noopener">${INFO.indirizzo}</a></li>
          <li><a href="tel:${INFO.tel.replace(/\s/g, "")}">Tel. ${INFO.telLabel}</a></li>
          <li><a href="tel:${INFO.cell.replace(/\s/g, "")}">Cell. ${INFO.cellLabel}</a></li>
          <li><a href="mailto:${INFO.email}">${INFO.email}</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} Cremeria Scirocco di Andrea Bandiera · Bologna</span>
      <span data-orari-breve>Orari: ${ORARI.filter((o) => o.open).length === 6 ? "tutti i giorni tranne il mercoledì" : ""}</span>
    </div>
  </div>
</footer>
<nav class="quickbar" aria-label="Azioni rapide">
  <a href="tel:${INFO.tel.replace(/\s/g, "")}">${I.phone}<span>Chiama</span></a>
  <a href="${INFO.directions}" target="_blank" rel="noopener">${I.pin}<span>Indicazioni</span></a>
  <a href="gusti.html">${I.cone}<span>Gusti di oggi</span></a>
</nav>
<button class="to-top" type="button" aria-label="Torna su"><svg class="ring" viewBox="0 0 58 58" aria-hidden="true"><circle cx="29" cy="29" r="27"/></svg>${I.up}</button>
<div class="lightbox" role="dialog" aria-modal="true" aria-label="Immagine ingrandita"><button class="lightbox-close" type="button" aria-label="Chiudi">${I.close}</button><img src="" alt=""><p class="lightbox-caption"></p></div>
<div class="cursor-glow" aria-hidden="true"></div><div class="cursor-dot" aria-hidden="true"></div>
<script>window.SCIROCCO_ORARI=${JSON.stringify(ORARI.map(({ d, open, close }) => ({ d, open, close })))};window.SCIROCCO_FOGLIO=${JSON.stringify(FOGLIO)};</script>
<script src="js/foglio.js?v=${V}" defer></script>
<script src="js/main.js?v=${V}" defer></script>`;
}

const schema = `<script type="application/ld+json">${JSON.stringify({
  "@context": "https://schema.org", "@type": "IceCreamShop", name: "Cremeria Scirocco", image: SITE + "img/torta-mango.jpg",
  url: SITE, telephone: INFO.tel, email: INFO.email, priceRange: "€€",
  address: { "@type": "PostalAddress", streetAddress: "Via Agostino Barelli 1/c", addressLocality: "Bologna", postalCode: "40138", addressCountry: "IT" },
  geo: { "@type": "GeoCoordinates", latitude: 44.4952804, longitude: 11.4009997 },
  aggregateRating: { "@type": "AggregateRating", ratingValue: INFO.rating, reviewCount: INFO.reviewsCount },
  openingHoursSpecification: ORARI.filter((o) => o.open).map((o) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][o.d], opens: o.open, closes: o.close })),
  sameAs: [INFO.facebook, INFO.instagram],
})}</script>`;

function page({ file, title, desc, id, body, img, extraScripts = "" }) {
  const html = `${head({ title, desc, page: id, img })}
<body data-page="${id}">
${header(id)}
<main id="main">
${body}
</main>
${footer()}
${extraScripts}
</body>
</html>
`;
  emit(ROOT, file, html);
  console.log("✓", file);
}

/* ---------------- blocchi riutilizzabili ---------------- */
const hoursTable = () => `<table class="hours" data-hours><caption class="sr-only">Orari di apertura</caption><tbody>${ORARI.map((o) => `<tr data-day="${o.d}"><td>${o.label}</td><td${o.open ? "" : ' class="closed"'}>${o.open ? `${o.open.replace(":00", "")}–${o.close.replace(":00", "")}` : "Chiuso"}</td></tr>`).join("")}</tbody></table>`;

const visitSection = () => `
<section class="section visit on-dark" id="visita" aria-labelledby="visita-t">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow eyebrow--light">Vieni a trovarci</span>
      <h2 class="h2" id="visita-t" data-split>Via Barelli 1/c, <em class="accent">Bologna</em></h2>
      <p class="lead" style="color:rgba(251,245,238,.75)">Fuori dal centro storico, con parcheggio facile. Il laboratorio è a vista: puoi guardare come nasce il tuo gelato e farci tutte le domande che vuoi.</p>
    </div>
    <div class="visit-grid">
      <div class="visit-card reveal reveal--left">
        <p class="status-pill" data-open-status><span class="open-dot"></span><span>Orari</span></p>
        ${hoursTable()}
        <div class="contact-row">
          <a href="tel:${INFO.tel.replace(/\s/g, "")}">${I.phone}<span>Chiama</span></a>
          <a href="${INFO.directions}" target="_blank" rel="noopener">${I.pin}<span>Indicazioni</span></a>
          <a href="mailto:${INFO.email}">${I.mail}<span>Scrivici</span></a>
        </div>
        <div class="contact-lines">
          <span>Tel. <a href="tel:${INFO.tel.replace(/\s/g, "")}">${INFO.telLabel}</a> · Cell. <a href="tel:${INFO.cell.replace(/\s/g, "")}">${INFO.cellLabel}</a></span>
          <span><a href="mailto:${INFO.email}">${INFO.email}</a></span>
        </div>
      </div>
      <div class="map-wrap reveal reveal--right" data-map="${INFO.mapEmbed}" data-map-auto>
        <div class="map-placeholder">
          <span class="map-pin">${I.pin}</span>
          <p>Carico la mappa…</p>
          <a class="link-arrow" style="color:var(--verde)" href="${INFO.directions}" target="_blank" rel="noopener">Apri in Google Maps ${I.arrow}</a>
        </div>
      </div>
    </div>
  </div>
</section>`;

const reviewsSection = () => {
  const colors = ["#AD1F5F", "#084177", "#6E8A35", "#8A6F86", "#C0703A"];
  const cards = RECENSIONI.map((r, i) => `<article class="review" aria-roledescription="slide" aria-label="${i + 1} di ${RECENSIONI.length}">
      <span class="q" aria-hidden="true">“</span>
      <p>${r.t}</p>
      <footer><span class="avatar" style="--c:${colors[i % colors.length]}" aria-hidden="true" data-i="${r.n.trim()[0].toUpperCase()}"></span><span><b>${r.n}</b><small>${r.d === "dal sito" ? "Testimonianza" : `${I.google}Google · ${r.d}`}</small></span>${stars(r.s)}</footer>
    </article>`).join("");
  return `
<section class="section reviews" id="recensioni" aria-labelledby="rec-t">
  <div class="container">
    <div class="reviews-head">
      <div class="section-head reveal" style="margin:0">
        <span class="eyebrow">Recensioni</span>
        <h2 class="h2" id="rec-t" data-split>Chi assaggia, <em class="accent">ritorna</em></h2>
      </div>
      <div class="rating-box reveal reveal--right">
        <span class="big">${String(INFO.rating).replace(".", ",")}</span>
        <div class="meta">${stars(5)}<span><b>${INFO.reviewsCount.toLocaleString("it-IT")} recensioni</b> su ${I.google}Google</span></div>
      </div>
    </div>
    <div class="carousel reveal" data-carousel aria-roledescription="carosello" aria-label="Recensioni dei clienti">
      <div class="carousel-viewport"><div class="carousel-track">${cards}</div></div>
      <div class="carousel-controls">
        <div class="c-progress" aria-hidden="true"><span class="bar"><i></i></span><span class="num"></span></div>
      </div>
    </div>
    <p class="reviews-note" data-only-en>Recensioni in lingua originale</p>
    <div class="reviews-cta reveal" style="margin-top:28px">
      <a class="btn magnetic" href="${INFO.review}" target="_blank" rel="noopener">${I.star}<span>Lascia <span class="hide-sm">una </span>recensione</span></a>
      <a class="btn btn--ghost" href="${INFO.reviewsAll}" target="_blank" rel="noopener"><span>Leggi tutte<span class="hide-sm"> su Google</span></span>${I.arrow}</a>
    </div>
  </div>
</section>`;
};

const otherProducts = (except) => `
<section class="section--tight" style="background:var(--crema-2)">
  <div class="container">
    <h2 class="h3 reveal" style="margin-bottom:24px">Scopri anche</h2>
    <div class="other-products">${PRODOTTI.filter((p) => p.slug !== except).map((p, i) => `<a class="reveal" style="--d:${i * 0.05}s" href="${p.slug}.html"><i class="op-dot" style="--c:${p.color}"></i><span>${p.nome}</span>${I.arrow}</a>`).join("")}${except === "gusti" ? "" : `<a class="reveal" href="gusti.html"><i class="op-dot" style="--c:var(--verde)"></i><span>Gusti di oggi</span>${I.arrow}</a>`}</div>
  </div>
</section>`;

const pageHero = ({ crumb, title, lead, img, alt, actions = "" }) => `
<section class="page-hero">
  <div class="container page-hero-grid">
    <div>
      <nav class="breadcrumb" aria-label="Percorso"><a href="index.html">Home</a><span aria-hidden="true">/</span>${crumb}</nav>
      <h1 class="hero-fade" style="opacity:1;transform:none">${title}</h1>
      <p class="lead">${lead}</p>
      ${actions}
    </div>
    ${img ? `<div class="page-hero-img reveal reveal--scale">${P(img, alt, { eager: true, sizes: "(min-width: 900px) 45vw, 100vw" })}</div>` : ""}
  </div>
</section>`;

const asideOrder = (title = "Vuoi ordinare?", text = "Chiamaci o scrivici: ti aiutiamo a scegliere gusti e quantità.") => `
<aside class="aside-card reveal">
  <h3>${title}</h3>
  <p>${text}</p>
  <p class="status-pill" data-open-status style="background:var(--verde-chiaro);color:var(--verde-scuro)"><span class="open-dot"></span><span>Orari</span></p>
  <a class="btn" href="tel:${INFO.tel.replace(/\s/g, "")}">${I.phone}<span>${INFO.telLabel}</span></a>
  <a class="btn btn--ghost" href="contatti.html#torta"><span>Scrivici</span>${I.arrow}</a>
</aside>`;

/* ======================================================
   HOME
   ====================================================== */
const flavors = [
  ["Mandorle al Gorgonzola", "Mandorla amara e dolce che si lega al Gorgonzola. Il gusto che spiazza (quasi) tutti.", "#C9B27A", "Miglior gusto gastronomico 2018", true],
  ["Il mio pesto", "Pinoli, mandorle, pistacchio, scorza di limone, basilico, extravergine e sale.", "#8DB04A", "Gastronomico"],
  ["Pistacchio di Raffadali", "Pistacchio siciliano: verde vero, sapore lungo, zero compromessi.", "#ABC96B", "Crema"],
  ["Zabajone", "Zabajone classico con Marsala invecchiato oltre 20 anni: un tuffo nei ricordi.", "#E9C46A", "Classico di casa"],
  ["Nocciola Alta Langa", "Nocciola trilobata dell’Alta Langa: tostatura elegante, gusto pieno e persistente.", "#B98552", "Crema"],
  ["Blu", "Sorbetto con bergamotto, limone, arancio, anacardi e mandorla amara. Un tocco di spirulina blu.", "#3D8FD1", "Senza latte · senza uova"],
];
const flavorCards = flavors.map(([n, d, c, t, hot], i) => `<article class="flavor tilt reveal" style="--c:${c};--d:${(i % 3) * 0.08}s"><div class="scoop" aria-hidden="true"></div><h3>${n}</h3><p>${d}</p><span class="tag${hot ? " tag--premio" : ""}">${t}</span></article>`).join("");

const productCards = PRODOTTI.map((p, i) => `<a class="product-card tilt reveal" style="--d:${(i % 3) * 0.08}s" href="${p.slug}.html">
  <div class="pc-img">${P(p.img, "", { sizes: "(min-width: 900px) 33vw, 100vw" })}</div>
  <span class="pc-chip">${p.chip}</span>
  <div class="pc-body"><h3>${p.nome}</h3><p>${p.breve}</p><span class="pc-more">Scopri ${I.arrow}</span></div>
</a>`).join("");

const craft = [
  ["Senza grassi idrogenati", "Non usiamo grassi idrogenati, che a basso costo danno solidità e lunga durata al prodotto a scapito della salute di chi lo mangia."],
  ["Bilanciamento", "Ogni ricetta è bilanciata tra zuccheri, grassi e proteine: è la chimica degli alimenti che Andrea studia da quasi vent’anni."],
  ["Ingredienti naturali", "Latte crudo da una stalla a 10 km, panna di una cooperativa locale, uova fresche pastorizzate da noi, vaniglia Bourbon del Madagascar."],
  ["Frutta, oltre il 50%", "Tutti i gelati alla frutta sono sorbetti: frutta, acqua minerale, zuccheri e pochi grammi di addensanti naturali. Nient’altro, e senza latticini."],
  ["Coloranti naturali", "Nessun colorante di sintesi: il colore del gelato è quello degli ingredienti."],
  ["Aromi naturali", "Niente aromi artificiali né emulsionanti di sintesi. Come addensanti solo farina di carrube e xantano."],
];
const craftItems = craft.map(([t, d], i) => `<div class="craft-item"><button type="button" aria-expanded="${i === 0}" aria-controls="cr-${i}" id="crb-${i}">${t}<span class="plus">${I.plus}</span></button><div class="acc-panel" id="cr-${i}" role="region" aria-labelledby="crb-${i}"><div><p>${d}</p></div></div></div>`).join("");

const premiCards = PREMI.map(([f, t, s]) => `<figure class="award"><button type="button" data-lightbox="img/premi/${f}.jpg" data-caption="${s} · Gambero Rosso" aria-label="Ingrandisci: ${s}">${pic("premi/" + f, `${s} Gambero Rosso, Cremeria Scirocco`, { sizes: "320px" })}</button><figcaption class="year"><b>${f.slice(0, 4)}</b><span>${t}</span></figcaption></figure>`).join("");

const faqs = [
  ["Avete gusti senza lattosio o vegani?", "Sì. Tutta la linea dei sorbetti è senza latte e senza lattosio, e a rotazione ci sono anche creme vegane, come pistacchio o nocciola, fatte con acqua o latti vegetali come quello d’avena."],
  ["Le torte sono senza glutine?", "Le torte gelato hanno un sottile strato di Pan di Spagna senza glutine, prodotto da noi. Se hai un’allergia, chiedici prima: ti diciamo esattamente cosa c’è in ogni torta."],
  ["Si può ordinare una torta gelato?", "Certo: le facciamo su ordinazione per compleanni, battesimi, matrimoni, anniversari o una cena con amici. Di solito due gusti a scelta su due strati. Chiamaci o scrivici dalla pagina contatti."],
  ["Posso avere un gusto su misura per una cena?", "Sì, realizziamo gusti personalizzati, anche gastronomici, per pranzi e cene a partire da 3 kg."],
  ["Dove trovo ingredienti e allergeni?", `Ogni gusto ha la sua scheda con ingredienti e allergeni, sempre aggiornata: <a href="${INFO.ingredienti}" target="_blank" rel="noopener">consulta la lista ingredienti</a>. Nella pagina Gusti di oggi vedi anche le icone degli allergeni.`],
  ["Quando siete aperti?", "Tutti i giorni tranne il mercoledì: dal lunedì al venerdì 12–20, sabato e domenica 10–20."],
];
const faqItems = faqs.map(([q, a], i) => `<div class="faq-item reveal" style="--d:${i * 0.05}s"><button type="button" aria-expanded="false" aria-controls="faq-${i}" id="faqb-${i}">${q}<span class="plus">${I.plus}</span></button><div class="acc-panel" id="faq-${i}" role="region" aria-labelledby="faqb-${i}"><div><p>${a}</p></div></div></div>`).join("");

const faqSchema = `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })) })}</script>`;

const marqueeItems = Array.from({ length: 2 }, () => ["Tre Coni Gambero Rosso", "Dal 2017 al 2027", "Miglior gelato gastronomico 2018", "Laboratorio a vista", "Latte a km 0", "Frutta oltre il 50%"].map((t) => `<span class="marquee-item"><span class="cones">${I.miniCone}${I.miniCone}${I.miniCone}</span>${t}</span>`).join("")).join("");

page({
  file: "index.html",
  id: "home",
  title: "Cremeria Scirocco · Gelateria artigianale a Bologna, Tre Coni Gambero Rosso",
  desc: "Gelato artigianale creativo di Andrea Bandiera a Bologna: creme, sorbetti, gusti gastronomici, torte gelato e granite. Tre Coni Gambero Rosso. Via Barelli 1/c.",
  body: `
<section class="hero on-dark" aria-labelledby="hero-t">
  <div class="container hero-grid">
    <div class="hero-copy">
      <a class="hero-award hero-fade" href="#premi">${pic("premi/etichetta-tre-coni", "", { sizes: "34px", eager: true })}<span><b>Tre Coni Gambero Rosso</b> · dal 2017 al 2027</span></a>
      <h1 class="display" id="hero-t"><span class="line"><span>Il gelato che</span></span><span class="line"><span><em class="accent">ti sorprende</em>,</span></span><span class="line"><span>dal 2005.</span></span></h1>
      <p class="lead hero-fade">Creme con latte a km 0, sorbetti con oltre il 50% di frutta e gusti gastronomici che non hai mai assaggiato. Tutto fatto da noi, nel laboratorio a vista di via Barelli a Bologna.</p>
      <div class="hero-actions hero-fade">
        <a class="btn magnetic" href="gusti.html">${I.cone}<span>I gusti di oggi</span></a>
        <a class="btn btn--ghost magnetic" href="#visita"><span>Vieni a trovarci</span>${I.arrow}</a>
      </div>
    </div>
    <div class="hero-stage" aria-hidden="true">
      <div class="hero-fallback">${pic("cono-malaga", "", { png: true, eager: true, sizes: "40vw" })}</div>
      <canvas id="hero-canvas"></canvas>
      <span class="hero-hint"><i></i> Muovi il mouse</span>
    </div>
  </div>
  <div class="hero-strip">
    <div class="container">
      <span data-open-status><span class="open-dot"></span><span>Orari</span></span>
      <span>${I.pin.replace("<svg", '<svg style="width:16px;height:16px;display:inline;vertical-align:-3px;margin-right:6px"')}<b>Via Barelli 1/c</b>, Bologna</span>
      <span>${stars(5).replace('class="stars"', 'class="stars" style="vertical-align:-3px;margin-right:6px"')}<b>${String(INFO.rating).replace(".", ",")}</b> · ${INFO.reviewsCount.toLocaleString("it-IT")} recensioni Google</span>
    </div>
  </div>
</section>

<nav class="shortcuts" aria-label="Vai a">
  <div class="container"><ul>
    <li><a href="gusti.html" class="reveal" style="--d:.05s"><span class="ico" style="--c:var(--verde-chiaro)">${I.cone}</span><span>Gusti di oggi<small>Menu e allergeni</small></span></a></li>
    <li><a href="torte-semifreddi.html" class="reveal" style="--d:.1s"><span class="ico" style="--c:var(--magenta-chiaro)">${I.cake}</span><span>Torte gelato<small>Su ordinazione</small></span></a></li>
    <li><a href="granite.html" class="reveal" style="--d:.15s"><span class="ico" style="--c:#DCE6F2">${I.drop}</span><span>Granite<small>Siciliane</small></span></a></li>
    <li><a href="#visita" class="reveal" style="--d:.2s"><span class="ico" style="--c:var(--crema-2)">${I.clock}</span><span>Orari e mappa<small data-open-short>Via Barelli 1/c</small></span></a></li>
  </ul></div>
</nav>

<section class="section" id="storia" aria-labelledby="storia-t">
  <div class="container intro-grid">
    <div class="intro-media reveal reveal--left">
      <div class="ph-main parallax" data-speed="-0.04">${P("andrea-mara-banco", "Andrea Bandiera e Mara al banco della Cremeria Scirocco", { sizes: "(min-width: 900px) 40vw, 100vw" })}</div>
      <div class="ph-float parallax" data-speed="0.06">${P("bicchierino-fragola", "Semifreddo in bicchierino con fragole", { sizes: "20vw" })}</div>
      <div class="intro-stamp" aria-hidden="true"><svg viewBox="0 0 100 100"><defs><path id="circ" d="M50 50m-40 0a40 40 0 1 1 80 0a40 40 0 1 1-80 0"/></defs><text font-size="8.6" letter-spacing="2.4" fill="#052A4D" font-weight="600"><textPath href="#circ">LABORATORIO A VISTA · BOLOGNA ·</textPath></text></svg><span><b>2005</b></span></div>
    </div>
    <div>
      <span class="eyebrow reveal">La nostra storia</span>
      <h2 class="h2 reveal" id="storia-t" data-split>Da un viaggio in Sicilia a un <em class="accent">laboratorio</em> a Bologna</h2>
      <p class="lead reveal">La Cremeria Scirocco nasce nella primavera del 2004 da un’idea di Andrea Bandiera, durante un viaggio in Sicilia tra granite e gelato siciliano. Il laboratorio di via Barelli apre il 18 marzo 2005. Le idee di base sono semplici:</p>
      <div class="values">
        <div class="value reveal" style="--d:.05s"><span class="num">01</span><div><h3>Tradizione</h3><p>I gusti ruotano con le stagioni e con le richieste dei clienti, per dare il massimo della freschezza e della qualità.</p></div></div>
        <div class="value reveal" style="--d:.1s"><span class="num">02</span><div><h3>Qualità</h3><p>Niente conservanti, coloranti, aromi artificiali o grassi idrogenati. Tutti i gelati alla frutta sono senza latticini.</p></div></div>
        <div class="value reveal" style="--d:.15s"><span class="num">03</span><div><h3>Cordialità</h3><p>Gelato, semifreddi e sorbetti nascono in un laboratorio completamente a vista. Saremo lieti di rispondere a tutte le tue domande.</p></div></div>
      </div>
      <blockquote class="quote reveal">“Se tu hai un’idea, ed io ho un’idea, e ce le scambiamo, allora abbiamo entrambi due idee.”<cite>George Bernard Shaw · il motto della Cremeria</cite></blockquote>
      <p style="margin-top:28px" class="reveal"><a class="link-arrow" href="chi-siamo.html">Conosci Andrea e Mara ${I.arrow}</a></p>
    </div>
  </div>
</section>

<div class="marquee" aria-label="Riconoscimenti"><div class="marquee-track">${marqueeItems}</div></div>

<section class="section flavors on-dark" id="gusti" aria-labelledby="gusti-t">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow eyebrow--light">Gusti iconici</span>
      <h2 class="h2" id="gusti-t" data-split>Classici perfetti e <em class="accent">salati coraggiosi</em></h2>
      <p class="lead">Al banco trovi creme, sorbetti e due o tre gusti gastronomici a rotazione. Questi sono quelli di cui i clienti parlano di più.</p>
    </div>
    <div class="flavor-grid">${flavorCards}</div>
    <div class="flavors-cta reveal">
      <a class="btn btn--verde magnetic" href="gusti.html">${I.cone}<span>Vedi i gusti disponibili oggi</span></a>
      <a class="link-arrow" style="color:var(--verde)" href="${INFO.ingredienti}" target="_blank" rel="noopener">Ingredienti e allergeni ${I.arrow}</a>
    </div>
  </div>
</section>

<section class="section" id="prodotti" aria-labelledby="prod-t">
  <div class="container">
    <div class="section-head reveal">
      <span class="eyebrow">I nostri prodotti</span>
      <h2 class="h2" id="prod-t" data-split>Non solo coni: <em class="accent">pasticceria gelata</em></h2>
      <p class="lead">Tutto nasce dal nostro gelato: torte, semifreddi in bicchiere di vetro riutilizzabile, stecchi ricoperti di cioccolato Valrhona, granite e ghiaccioli.</p>
    </div>
    <div class="products-grid">${productCards}</div>
  </div>
</section>

<section class="section craft" id="come-e-fatto" aria-labelledby="craft-t">
  <div class="container craft-grid">
    <div class="craft-visual reveal reveal--scale" data-depth aria-hidden="true">
      <div class="plate"></div>
      <div class="layer l-latte" data-z="18">${pic("ing-latte", "", { png: true, sizes: "90px" })}</div>
      <div class="layer l-cono" data-z="12">${pic("cono-malaga", "", { png: true, sizes: "260px" })}</div>
      <div class="layer l-vaniglia" data-z="40">${pic("ing-vaniglia", "", { png: true, sizes: "220px" })}</div>
      <div class="layer l-fragola" data-z="55">${pic("ing-fragola", "", { png: true, sizes: "180px" })}</div>
      <div class="layer l-limone" data-z="30">${pic("ing-limone", "", { sizes: "140px" })}</div>
    </div>
    <div>
      <div class="section-head reveal" style="margin-bottom:28px">
        <span class="eyebrow">Come è fatto</span>
        <h2 class="h2" id="craft-t" data-split>Ingredienti veri, <em class="accent">nient’altro</em></h2>
        <p class="lead">Latte, panna e uova li pastorizziamo noi, con un pastorizzatore Carpigiani di ultima generazione. Il resto lo scegliamo da piccoli produttori della zona.</p>
      </div>
      <div class="craft-list reveal" data-accordion>${craftItems}</div>
    </div>
  </div>
</section>

<section class="section awards" id="premi" aria-labelledby="premi-t">
  <div class="container">
    <div class="awards-top">
      <div class="section-head reveal" style="margin:0">
        <span class="eyebrow">I nostri premi</span>
        <h2 class="h2" id="premi-t" data-split>Tre Coni, <em class="accent">un anno dopo l’altro</em></h2>
        <p class="lead">Il massimo riconoscimento della guida Gelaterie d’Italia del Gambero Rosso. Più il premio speciale per il miglior gelato gastronomico, nel 2018.</p>
      </div>
      <div class="awards-badge reveal reveal--right">
        ${pic("premi/etichetta-tre-coni", "Etichetta Tre Coni Gambero Rosso", { sizes: "112px" })}
        <div><b data-count="11">11</b><span>riconoscimenti del<br>Gambero Rosso dal 2017</span></div>
      </div>
    </div>
    <div class="award-rail reveal" data-rail tabindex="0" aria-label="Premi Gambero Rosso, scorri orizzontalmente">${premiCards}</div>
  </div>
</section>

${reviewsSection()}

<section class="section--tight" aria-labelledby="torte-t" style="padding-top:clamp(52px,6.5vw,96px)">
  <div class="container">
    <div class="cake-cta reveal reveal--scale">
      <div class="cake-cta-grid">
        <div class="cc-copy">
          <span class="eyebrow">Su ordinazione</span>
          <h2 class="h2" id="torte-t">La tua festa merita una <em style="font-style:italic">torta gelato</em></h2>
          <p>Fatte interamente da noi con il nostro gelato, su un sottile Pan di Spagna senza glutine. Due gusti a scelta, confezionate per il trasporto.</p>
          <ul class="cc-list"><li>Compleanni</li><li>Battesimi</li><li>Matrimoni</li><li>Anniversari</li><li>Cene con amici</li></ul>
          <div class="hero-actions">
            <a class="btn magnetic" href="contatti.html#torta"><span>Richiedi <span class="hide-sm">la tua </span>torta</span>${I.arrow}</a>
            <a class="btn btn--ghost" href="tel:${INFO.tel.replace(/\s/g, "")}">${I.phone}<span>Chiama</span></a>
          </div>
        </div>
        <div class="cc-img">${P("torta-mango", "Torta semifreddo al mango con cuore di cioccolato", { sizes: "(min-width: 900px) 45vw, 100vw" })}</div>
      </div>
    </div>
  </div>
</section>

<section class="section" id="faq" aria-labelledby="faq-t">
  <div class="container faq-grid">
    <div class="section-head reveal">
      <span class="eyebrow">Domande frequenti</span>
      <h2 class="h2" id="faq-t" data-split>Prima di <em class="accent">venire</em></h2>
      <p class="lead faq-call">Non trovi la risposta? Chiama <a href="tel:${INFO.tel.replace(/\s/g, "")}">${INFO.telLabel}</a></p>
    </div>
    <div class="faq-list" data-accordion>${faqItems}</div>
  </div>
</section>

${visitSection()}
`,
  extraScripts: `${schema}\n${faqSchema}\n<script src="js/hero3d.js?v=${V}" defer></script>`,
});

/* ======================================================
   GUSTI DI OGGI
   ====================================================== */
page({
  file: "gusti.html",
  id: "gusti",
  title: "Gusti di oggi · Cremeria Scirocco Bologna",
  desc: "Il menu dei gusti di gelato in vetrina alla Cremeria Scirocco di Bologna: creme, sorbetti senza latte e gusti gastronomici, con filtri per allergeni.",
  body: `
<section class="page-hero gusti-hero">
  <div class="container page-hero-grid">
    <div>
      <nav class="breadcrumb" aria-label="Percorso"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>Gusti di oggi</span></nav>
      <h1>Il banco <em class="accent">di oggi</em></h1>
      <p class="lead"><b data-g-total>19</b> gusti in vetrina, tra creme e sorbetti. Filtra per tipo o escludi gli allergeni: trovi subito quello che fa per te.</p>
      <div class="hero-actions"><a class="btn magnetic" href="#menu">${I.cone}<span>Sfoglia il menu</span></a><a class="btn btn--ghost" href="tel:${INFO.tel.replace(/\s/g, "")}">${I.phone}<span>C’è il mio gusto?</span></a></div>
    </div>
    <div class="vetrina" aria-hidden="true" data-vetrina></div>
  </div>
</section>

<section class="section--tight gusti-menu" id="menu" aria-labelledby="menu-t">
  <div class="container">
    <h2 class="sr-only" id="menu-t">Menu dei gusti</h2>
    <div class="g-toolbar" data-g-toolbar>
      <div class="g-tabs" role="group" aria-label="Tipo di gusto">
        <span class="g-tabs-ind" aria-hidden="true"></span>
        <button type="button" class="g-tab" data-tipo="tutti" aria-pressed="true">Tutti <small data-count="tutti"></small></button>
        <button type="button" class="g-tab" data-tipo="uova" aria-pressed="false">Creme all’uovo <small data-count="uova"></small></button>
        <button type="button" class="g-tab" data-tipo="latte" aria-pressed="false">Creme senza uova <small data-count="latte"></small></button>
        <button type="button" class="g-tab" data-tipo="sorbetto" aria-pressed="false">Sorbetti <small data-count="sorbetto"></small></button>
      </div>
      <div class="g-row2">
        <div class="g-excl" role="group" aria-label="Escludi allergeni">
          <span class="g-excl-label">Senza:</span>
          <button type="button" class="g-pill" data-excl="latticini" aria-pressed="false">${ALG.latticini}latte</button>
          <button type="button" class="g-pill" data-excl="uova" aria-pressed="false">${ALG.uova}uova</button>
          <button type="button" class="g-pill" data-excl="frutta a guscio" aria-pressed="false">${ALG["frutta a guscio"]}frutta a guscio</button>
          <button type="button" class="g-pill" data-excl="solfiti" aria-pressed="false">${ALG.solfiti}solfiti</button>
        </div>
        <label class="g-search"><span class="sr-only">Cerca un gusto</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input type="search" placeholder="Cerca: pistacchio, rum…" data-g-search autocomplete="off"></label>
      </div>
    </div>
    <p class="g-status" role="status" aria-live="polite" data-g-status></p>
    <div class="g-grid" data-g-grid></div>
    <div class="g-empty" data-g-empty hidden>
      <p class="h3">Nessun gusto con questi filtri</p>
      <p>Prova a togliere un filtro, oppure chiamaci: spesso abbiamo alternative in laboratorio.</p>
      <button type="button" class="btn btn--ghost btn--small" data-g-reset><span>Azzera i filtri</span></button>
    </div>
    <div class="g-foot">
      <p><b>Aggiornato il <span data-g-date></span>.</b> I gusti ruotano spesso con le stagioni: se cerchi un gusto in particolare, chiamaci al <a href="tel:${INFO.tel.replace(/\s/g, "")}">${INFO.telLabel}</a>.</p>
      <p>Allergeni indicati per ogni gusto. Per la scheda completa degli ingredienti: <a href="${INFO.ingredienti}" target="_blank" rel="noopener">lista ingredienti e allergeni</a>. Se hai un’allergia, chiedi sempre al banco prima di ordinare.</p>
    </div>
  </div>
</section>
${otherProducts("gusti")}
`,
  extraScripts: `<script src="js/gusti-data.js?v=${V}"></script>
<script src="js/gusti.js?v=${V}" defer></script>`,
});

/* ======================================================
   PRODOTTI (indice)
   ====================================================== */
page({
  file: "prodotti.html",
  id: "prodotti",
  title: "Prodotti · Gelato, torte, granite e monoporzioni | Cremeria Scirocco",
  desc: "Gelato classico e gastronomico, torte e semifreddi su ordinazione, monoporzioni, granite siciliane e ghiaccioli artigianali della Cremeria Scirocco a Bologna.",
  body: `
${pageHero({ crumb: "<span>Prodotti</span>", title: 'Assapora il <em class="accent">nostro gelato</em>', lead: "I prodotti che facciamo, tutti a partire dal nostro gelato. I gusti ruotano con la stagione e con le richieste dei clienti: è così che garantiamo freschezza e qualità.", img: "torta-cioccolato", alt: "Torta semifreddo al cioccolato" })}
<section class="section">
  <div class="container"><div class="products-grid">${productCards}</div></div>
</section>
<section class="section--tight" style="background:var(--crema-2)">
  <div class="container prose-grid">
    <div class="prose reveal">
      <span class="eyebrow">Siamo diversi</span>
      <h2>Prova prima, poi scegli la torta</h2>
      <p>Produciamo semifreddi in monoporzione, in contenitori di vetro riciclabile o riutilizzabile. I sapori sono gli stessi delle torte semifreddo: così puoi assaggiare prima di ordinare la torta per la tua festa.</p>
      <a class="link-arrow" href="monoporzioni.html">Scopri le monoporzioni ${I.arrow}</a>
    </div>
    ${asideOrder()}
  </div>
</section>
${visitSection()}
`,
});

/* ======================================================
   PAGINE PRODOTTO
   ====================================================== */
const prodPage = (slug, { lead, body, gallery = [], aside }) => {
  const p = PRODOTTI.find((x) => x.slug === slug);
  const gal = gallery.length ? `<div class="gallery">${gallery.map(([img, alt]) => `<button type="button" data-lightbox="img/${img}.jpg" data-caption="${alt}" aria-label="Ingrandisci: ${alt}">${P(img, alt, { sizes: "25vw" })}</button>`).join("")}</div>` : "";
  page({
    file: `${slug}.html`,
    id: slug,
    img: p.img,
    title: `${p.nome} · Cremeria Scirocco Bologna`,
    desc: p.breve,
    body: `
${pageHero({ crumb: `<a href="prodotti.html">Prodotti</a><span aria-hidden="true">/</span><span>${p.nome}</span>`, title: p.titolo, lead, img: p.img, alt: p.nome })}
<section class="section">
  <div class="container prose-grid">
    <div class="prose reveal">${body}${gal}</div>
    ${aside || asideOrder()}
  </div>
</section>
${otherProducts(slug)}
`,
  });
};

prodPage("gelato-classico", {
  lead: "La semplicità degli ingredienti: latte a km 0, panna fresca, uova fresche e frutta vera. Niente basi pronte, niente scorciatoie.",
  body: `
<h2>La semplicità degli ingredienti</h2>
<p>Quando il periodo dell’anno è favorevole usiamo il <strong>latte crudo di una piccola fattoria vicino al negozio</strong> (latte a km 0), che adotta standard rigorosi di allevamento e mungitura. Nel resto dell’anno usiamo comunque latte e panna di alta qualità.</p>
<p>Latte, panna e uova vengono poi <strong>pastorizzati internamente da noi</strong> in un pastorizzatore Carpigiani di ultima generazione.</p>
<h3>Gli ingredienti che usiamo sono esclusivamente</h3>
<ul class="check-list">
  <li>Latte intero (nel caso delle creme)</li><li>Panna fresca</li><li>Uova fresche</li><li>Zuccheri</li>
  <li>Bacca di vaniglia Bourbon del Madagascar</li><li>Acqua minerale naturale a basso contenuto di sodio (per tutti i sorbetti)</li>
  <li>Come unici addensanti: farina di carrube e xantano</li>
</ul>
<h3>Cosa non usiamo</h3>
<ul class="check-list no-list">
  <li><span><strong>Grassi idrogenati</strong>, che a basso costo danno solidità e lunga durata al prodotto a scapito della salute del consumatore.</span></li>
  <li><span><strong>Emulsionanti di sintesi</strong> (mono e digliceridi), di solito usati per sopperire alla mancanza di ingredienti nobili.</span></li>
  <li>Coloranti di sintesi</li><li>Aromi artificiali</li>
</ul>
<h2>I gelati alla frutta</h2>
<p>Per tutti i gelati alla frutta scegliamo la <strong>tecnica a sorbetto</strong>: solo frutta, acqua minerale naturale, zuccheri e pochi grammi per kg di addensanti naturali. Nient’altro.</p>
<p>Con un’alta percentuale di frutta (<strong>oltre il 50%</strong>), senza latte né altri grassi animali, senza coloranti né aromatizzanti, il nostro gelato esalta l’aroma della frutta e va bene per chi è intollerante al lattosio, per vegetariani e vegani e per chi sceglie un’alimentazione con pochi grassi.</p>
<p><a class="link-arrow" href="gusti.html">Guarda i gusti disponibili oggi ${I.arrow}</a></p>`,
  gallery: [["bicchierino-mango", "Semifreddo al mango in bicchiere"], ["bicchierino-fragola", "Semifreddo alle fragole"], ["pozzetti", "I pozzetti del banco"], ["torta-cioccolato", "Torta al cioccolato"]],
});

prodPage("gelato-gastronomico", {
  lead: "Il gusto di sperimentare. Con i gusti gastronomici, ribattezzati «salati», ti mostriamo che il gelato ha un ruolo non solo a fine pasto, ma anche durante.",
  body: `
<h2>Il gusto di sperimentare</h2>
<p>In Cremeria Scirocco amiamo ricercare continuamente. Gioca in cucina con i nostri gusti salati e offri ai tuoi ospiti piatti raffinati e insoliti.</p>
<p>Tutto è nato circa dieci anni fa, dal confronto con alcuni chef che hanno aiutato Andrea a crescere e ad affinare la sua capacità di abbinamento.</p>
<h3>Alcuni gusti che abbiamo creato</h3>
<div class="chips">
  <span class="chip chip--hot">Mandorle al Gorgonzola · premiato</span><span class="chip">Pecorino DOP e miele</span><span class="chip">Zucca e pepe nero</span>
  <span class="chip">Tonno e cipolla caramellata ai chiodi di garofano</span><span class="chip">Ricotta e capperi</span><span class="chip">Gorgonzola e noci</span>
  <span class="chip">Parmigiano e fichi secchi</span><span class="chip">Ricotta e mortadella</span><span class="chip">Cipolla</span><span class="chip">Il mio pesto</span>
</div>
<p>Le <strong>Mandorle al Gorgonzola</strong> sono state premiate dalla guida del Gambero Rosso nel 2018 come <strong>miglior gusto gastronomico</strong>.</p>
<p>A rotazione trovi 2 o 3 gusti salati al banco. Per pranzi e cene realizziamo anche <strong>gusti su misura</strong>, a partire da 3 kg.</p>`,
  gallery: [["premi/2018-gastronomico", "Premio miglior gelato gastronomico 2018"]],
  aside: asideOrder("Un gusto su misura?", "Per pranzi e cene creiamo gusti gastronomici personalizzati, a partire da 3 kg. Raccontaci il tuo menù."),
});

prodPage("torte-semifreddi", {
  lead: "Tutte le nostre torte sono fatte interamente da noi, solo con il nostro gelato e con le decorazioni più adatte e moderne.",
  body: `
<h2>Una torta per ogni ricorrenza</h2>
<p>Facciamo torte su ordinazione per battesimi, matrimoni, compleanni, anniversari o semplicemente una cena con amici.</p>
<ul class="check-list">
  <li>Un sottile strato di <strong>Pan di Spagna senza glutine</strong>, prodotto da noi</li>
  <li>Bagnato con sciroppo di zucchero, oppure con una soluzione alcolica per i più golosi</li>
  <li>Di solito <strong>due gusti di gelato a tua scelta</strong>, su due strati sovrapposti</li>
  <li>Confezionate con un sottile foglio di acetato, per arrivare intatte a destinazione</li>
</ul>
<p>Tra i semifreddi c’è anche il <strong>tiramisù</strong>, con il caffè della torrefazione Lelli Caffè.</p>
<p>Vuoi assaggiare prima di scegliere? Le <a href="monoporzioni.html">monoporzioni in bicchiere</a> hanno gli stessi sapori delle torte.</p>
<p><a class="btn magnetic" href="contatti.html#torta"><span>Richiedi la tua torta</span>${I.arrow}</a></p>`,
  gallery: [["torta-mango", "Torta semifreddo al mango"], ["torta-cioccolato", "Torta semifreddo al cioccolato"], ["banner-tiramisu", "Semifreddo al tiramisù"], ["banner-cioccolato", "Torta glassata al cioccolato"]],
  aside: asideOrder("Ordina la tua torta", "Chiamaci o compila il modulo: ti aiutiamo a scegliere gusti e dimensioni."),
});

prodPage("monoporzioni", {
  lead: "I nostri «stecchi»… e non solo. Piccole dosi di gelato pensate per togliersi la voglia senza esagerare.",
  body: `
<h2>I Brevi</h2>
<p>I <strong>Brevi</strong> sono stecchi di gelato entrati di recente nella gamma della Cremeria. Si chiamano così perché servono a togliere la voglia del momento senza esagerare. La copertura è di cioccolato <strong>Valrhona al 61%</strong>. Ci sono 3 gusti a base latte e 3 gusti senza lattosio.</p>
<h2>Tesorini e Lacrime</h2>
<p>Per un fine serata originale prova i <strong>Tesorini</strong>: un biscotto di pasta bretone (simile a una frolla salata) che racchiude un gelato al pistacchio, alla nocciola o alla crema, il tutto coperto di cioccolato Valrhona al 61%.</p>
<p>Le <strong>Lacrime</strong> sono dei «mezzi tesorini» venduti in sacchetti da 6, con un ingrediente in più:</p>
<ul class="check-list">
  <li>Lacrime al pistacchio, con salsa di nocciole e mandorle e rum agricolo invecchiato</li>
  <li>Lacrime di zabajone, con salsa di zabajone al porto bianco invecchiato</li>
  <li>Lacrime di cioccolato al rum, con salsa di arancio e mandorla e rum agricolo invecchiato</li>
</ul>
<h2>I bicchierini</h2>
<p>Sono fatti con gli stessi ingredienti delle torte semifreddo, così puoi provare il gusto della torta. Il contenitore è di <strong>vetro riciclabile o riutilizzabile</strong>.</p>`,
  gallery: [["tesorini", "Tesorini ricoperti di cioccolato"], ["stecco-pistacchio", "Stecco ricoperto con granella di pistacchio"], ["monoporzione", "Monoporzione in bicchiere"], ["bicchierino-mango", "Bicchierino al mango"]],
});

prodPage("granite", {
  lead: "Tra gli articoli più richiesti in Cremeria Scirocco. Una granita che rispetta la tradizione siciliana, nata da un viaggio in Sicilia.",
  body: `
<h2>Come in Sicilia</h2>
<p>Non usiamo sciroppi di frutta aromatizzati, ma <strong>tanta frutta fresca, oltre il 50%</strong>, acqua minerale naturale a basso tenore di sodio e zuccheri. Nessun segreto per un gusto di granita che rispetta le tradizioni siciliane.</p>
<p>Puoi assaggiarle con o senza una <strong>panna montata speciale</strong>, montata naturalmente senza aria insufflata. E sono perfette con la nostra brioche.</p>
<h3>La «Sciroccata»</h3>
<p>Per i più golosi: <strong>granita + pallina di gelato + panna montata</strong> sopra.</p>`,
  gallery: [["bicchierino-fragola", "Bicchiere con fragole fresche"], ["banner-bicchieri", "I nostri bicchieri"]],
});

prodPage("ghiaccioli", {
  lead: "Richiestissimi in estate, ma non solo. Frutta fresca oltre il 50% e zuccheri: nessun segreto per un ghiacciolo classico.",
  body: `
<h2>Tanti gusti, a rotazione</h2>
<p>Non usiamo sciroppi di frutta aromatizzati, ma frutta fresca (<strong>oltre il 50%</strong>), acqua minerale naturale a basso tenore di sodio e zuccheri.</p>
<h3>I più richiesti</h3>
<div class="chips"><span class="chip">Fragola</span><span class="chip">Limone</span><span class="chip">Lampone</span><span class="chip">Cacao</span><span class="chip">Lime e zenzero</span><span class="chip">Menta bianca</span><span class="chip">Anice</span><span class="chip">Yogurt e fragola</span></div>
<p>Potresti non trovare tutti i gusti elencati, perché li facciamo ruotare.</p>`,
  gallery: [["stecco-pistacchio", "Stecco artigianale"]],
});

/* ======================================================
   CHI SIAMO
   ====================================================== */
const qa = [
  ["Com’è nata l’idea?", "Da una crisi lavorativa: sono stato un informatico per 16 anni, finché nel 2004 ho sentito l’esigenza di cambiare vita, cercando nuovi stimoli ed esperienze in grado di coinvolgermi. Sono sempre stato appassionato di cucina, soprattutto di pasticceria, e ho deciso di intraprendere la strada della gelateria."],
  ["Qual è stato il punto di svolta?", "All’inizio partivo, come la maggior parte dei gelatieri, da basi pronte e semilavorati. Dopo qualche mese mi sono reso conto che nel mio lavoro non c’era nulla di artigianale. Così mi sono messo a studiare la chimica degli alimenti e a cercare le materie prime migliori."],
  ["E oggi?", "Solo materie prime di qualità. Latte crudo dalla stalla di un contadino a 10 chilometri dalla gelateria, la panna di una cooperativa locale, e per tutto il resto piccoli produttori della zona."],
  ["Quando è arrivato il gelato gastronomico?", "Circa 10 anni fa. Ho iniziato a confrontarmi con degli chef che mi hanno aiutato a crescere e ad affinare la mia capacità di abbinamento. Oggi i clienti mi chiedono gusti su misura per pranzi e cene, da 3 kg in su."],
  ["E per chi ha intolleranze?", "Tutta la linea dei sorbetti è senza lattosio, e a rotazione ci sono creme vegane, come pistacchio o nocciola, fatte con acqua o con latti vegetali come quello d’avena."],
  ["Progetti per il futuro?", "Sto tornando al mondo dell’informatica: ho creato delle applicazioni per aiutare i gelatieri nel loro lavoro, dal bilanciamento dei gusti allo stoccaggio, ai libri di ricette."],
];
page({
  file: "chi-siamo.html",
  id: "chi-siamo",
  img: "andrea-mara",
  title: "Chi siamo · Andrea Bandiera e Mara | Cremeria Scirocco",
  desc: "La storia di Andrea Bandiera, da informatico a maestro gelatiere Tre Coni, e della Cremeria Scirocco di Bologna, aperta nel 2005 con Mara.",
  body: `
<section class="page-hero chi-hero">
  <div class="container chi-grid">
    <div class="chi-text">
      <nav class="breadcrumb" aria-label="Percorso"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>Chi siamo</span></nav>
      <h1>Benvenuti alla <em class="accent">Cremeria Scirocco</em></h1>
      <p class="lead">Mara, Andrea e il nostro team sono pronti ad accogliervi. Dietro ogni gusto c’è una storia: questa è la nostra, raccontata da Andrea.</p>
    </div>
    <div class="page-hero-img chi-img reveal reveal--scale">${P("andrea-mara-banco", "Andrea Bandiera e Mara al banco", { eager: true, sizes: "(min-width: 900px) 45vw, 100vw" })}</div>
    <div class="chi-actions">
      <a class="btn magnetic" href="#storia"><span>La <span class="hide-sm">nostra </span>storia</span></a>
      <a class="btn btn--verde magnetic" href="#team"><span>Scopri i corsi</span></a>
      <a class="btn btn--ghost magnetic" href="#team"><span>Lavora con noi</span></a>
    </div>
  </div>
</section>
<section class="section" id="storia">
  <div class="container">
    <div class="section-head reveal"><span class="eyebrow">Intervista ad Andrea</span><h2 class="h2" data-split>Da informatico a <em class="accent">gelatiere</em></h2></div>
    <div class="team-grid">${qa.map(([q, a], i) => `<article class="qa reveal" style="--d:${(i % 2) * 0.08}s"><h3>${q}</h3><p>${a}</p></article>`).join("")}</div>
  </div>
</section>
<section class="section--tight" id="team" style="background:var(--crema-2)">
  <div class="container intro-grid">
    <div class="intro-media reveal reveal--left"><div class="ph-main">${P("andrea-mara", "Andrea e Mara sorridenti in laboratorio", { sizes: "(min-width: 900px) 40vw, 100vw" })}</div></div>
    <div class="prose reveal">
      <span class="eyebrow">Il team</span>
      <h2>Cordialità, prima di tutto</h2>
      <p>Tutte le lavorazioni, dal gelato ai semifreddi ai sorbetti, avvengono in un laboratorio completamente a vista. Puoi osservare ogni passaggio: saremo felici di rispondere alle tue domande e di farti assaggiare i gusti più particolari.</p>
      <p>Andrea tiene anche corsi per professionisti e offre consulenze private.</p>
      <div class="hero-actions"><a class="btn magnetic" href="${INFO.corsi}" target="_blank" rel="noopener"><span>Sfoglia i corsi</span>${I.arrow}</a><a class="btn btn--ghost" href="lavora-con-noi.html"><span>Lavora con noi</span></a></div>
    </div>
  </div>
</section>
${reviewsSection()}
${visitSection()}
`,
});

/* ======================================================
   CONTATTI
   ====================================================== */
page({
  file: "contatti.html",
  id: "contatti",
  title: "Contatti e ordini · Cremeria Scirocco Bologna",
  desc: "Chiama, scrivi o vieni in via Barelli 1/c a Bologna. Ordina la tua torta gelato o un gusto su misura. Aperti tutti i giorni tranne il mercoledì.",
  body: `
${pageHero({ crumb: "<span>Contatti</span>", title: 'Parliamone <em class="accent">davanti a un gelato</em>', lead: "Per una torta, un gusto su misura o una semplice domanda: chiamaci, scrivici o passa a trovarci.", actions: `<div class="hero-actions"><a class="btn magnetic" href="tel:${INFO.tel.replace(/\s/g, "")}">${I.phone}<span>${INFO.telLabel}</span></a><a class="btn btn--ghost" href="#torta"><span>Scrivici</span>${I.arrow}</a></div>` })}
<section class="section" id="torta">
  <div class="container prose-grid">
    <div class="form-card form-enter">
      <h2 class="h3">Richiedi una torta o un gusto su misura</h2>
      <p style="color:var(--testo-2)">Ti rispondiamo il prima possibile. Per richieste urgenti chiamaci.</p>
      <form class="form" data-validate data-contact novalidate>
        <div class="form-row">
          <div class="field"><label for="f-nome">Nome e cognome</label><input id="f-nome" name="nome" required autocomplete="name"><span class="err">Scrivi il tuo nome.</span></div>
          <div class="field"><label for="f-tel">Telefono</label><input id="f-tel" name="telefono" type="tel" required autocomplete="tel" pattern="[0-9 +()\\-]{6,}"><span class="err">Scrivi un numero valido.</span></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" required autocomplete="email"><span class="err">Scrivi un’email valida.</span></div>
        </div>
        <div class="field">
          <span class="label" id="tipo-l">Cosa ti serve?</span>
          <div class="choice-group" role="radiogroup" aria-labelledby="tipo-l">
            <label class="choice"><input type="radio" name="tipo" value="Torta gelato" required><span class="choice-box">${I.cake}<b>Torta gelato</b><small>Per feste e ricorrenze</small></span></label>
            <label class="choice"><input type="radio" name="tipo" value="Gusto su misura per una cena"><span class="choice-box">${I.cone}<b>Gusto su misura</b><small>Da 3 kg, anche salato</small></span></label>
            <label class="choice"><input type="radio" name="tipo" value="Monoporzioni o vaschette"><span class="choice-box">${I.drop}<b>Monoporzioni</b><small>Bicchierini, stecchi, vaschette</small></span></label>
            <label class="choice"><input type="radio" name="tipo" value="Altra domanda"><span class="choice-box">${I.mail}<b>Altra domanda</b><small>Info, allergie, altro</small></span></label>
          </div>
          <span class="err">Scegli un’opzione.</span>
        </div>
        <div class="form-row">
          <div class="field">
            <span class="label" id="data-l">Per quando? <span class="opt">(facoltativo)</span></span>
            <div class="datepicker" data-datepicker>
              <button type="button" class="dp-trigger" aria-haspopup="dialog" aria-expanded="false" aria-labelledby="data-l data-v">${I.cal}<span class="dp-value" id="data-v">Scegli un giorno</span>${I.chev}</button>
              <input type="hidden" name="data">
              <div class="dp-pop" role="dialog" aria-label="Scegli la data">
                <div class="dp-head"><button type="button" class="dp-nav" data-dp-prev aria-label="Mese precedente">${I.arrowL}</button><b class="dp-title" aria-live="polite"></b><button type="button" class="dp-nav" data-dp-next aria-label="Mese successivo">${I.arrow}</button></div>
                <div class="dp-week" aria-hidden="true"><span>L</span><span>M</span><span>M</span><span>G</span><span>V</span><span>S</span><span>D</span></div>
                <div class="dp-grid"></div>
                <div class="dp-foot"><span><i class="dp-key"></i>Mercoledì chiuso</span><button type="button" class="dp-clear" data-dp-clear>Cancella</button></div>
              </div>
            </div>
          </div>
          <div class="field">
            <label for="f-pers">Persone <span class="opt">(facoltativo)</span></label>
            <div class="stepper"><button type="button" data-dec aria-label="Una persona in meno">−</button><input id="f-pers" name="persone" type="number" min="1" max="500" inputmode="numeric" placeholder="—"><button type="button" data-inc aria-label="Una persona in più">+</button></div>
          </div>
        </div>
        <div class="field"><label for="f-msg">Messaggio</label><textarea id="f-msg" name="messaggio" required minlength="10" placeholder="Gusti preferiti, allergie, occasione…"></textarea><span class="err">Scrivi almeno qualche parola (10 caratteri).</span></div>
        <div class="field"><label class="check"><input type="checkbox" name="privacy" required><span class="check-box" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span><span>Ho letto e accetto l’<a href="https://www.cremeriascirocco.it/wordpress/privacy_policy_scirocco.html" target="_blank" rel="noopener">informativa privacy</a>.</span></label><span class="err">Serve il consenso per risponderti.</span></div>
        <div><button class="btn magnetic" type="submit"><span>Invia richiesta</span>${I.arrow}</button></div>
      </form>
      <div class="form-success" role="status" aria-live="polite">
        <div class="ok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>
        <h3 class="h3">Grazie, richiesta pronta!</h3>
        <p>Si è aperto il tuo programma di posta con il messaggio già scritto: premi «Invia» per mandarcelo. Se preferisci, chiamaci al <a href="tel:${INFO.tel.replace(/\s/g, "")}">${INFO.telLabel}</a>.</p>
      </div>
    </div>
    <aside class="aside-card reveal">
      <h3>Contatti diretti</h3>
      <p class="status-pill" data-open-status style="background:var(--verde-chiaro);color:var(--verde-scuro)"><span class="open-dot"></span><span>Orari</span></p>
      <ul class="check-list" style="margin-top:0">
        <li><span>Tel. <a href="tel:${INFO.tel.replace(/\s/g, "")}">${INFO.telLabel}</a></span></li>
        <li><span>Cell. <a href="tel:${INFO.cell.replace(/\s/g, "")}">${INFO.cellLabel}</a></span></li>
        <li><span><a href="mailto:${INFO.email}">${INFO.email}</a></span></li>
        <li><span>${INFO.indirizzo}</span></li>
      </ul>
      <a class="btn" href="${INFO.directions}" target="_blank" rel="noopener">${I.pin}<span>Indicazioni</span></a>
    </aside>
  </div>
</section>
${visitSection()}
${reviewsSection()}
`,
  extraScripts: schema,
});

/* ======================================================
   LAVORA CON NOI
   ====================================================== */
page({
  file: "lavora-con-noi.html",
  id: "lavora",
  title: "Lavora con noi · Cremeria Scirocco Bologna",
  desc: "Vuoi entrare nel team della Cremeria Scirocco? Cerchiamo persone pronte a imparare e crescere: venditori e customer care, assistenti di produzione.",
  body: `
${pageHero({ crumb: "<span>Lavora con noi</span>", title: 'Vuoi entrare nel <em class="accent">nostro team</em>?', lead: "Se sei pronto a dare il meglio di te, a imparare e a crescere professionalmente ogni giorno di più, continua a leggere: forse cerchiamo proprio te.", img: "andrea-mara", alt: "Andrea e Mara in laboratorio" })}
<section class="section">
  <div class="container prose-grid">
    <div class="prose reveal">
      <span class="eyebrow">Prima conosciamoci</span>
      <h2>Una gelateria creativa artigianale</h2>
      <p>Il nostro lavoro è semplice: creiamo gusti di gelato, pasticceria gelata e tanti altri prodotti per i nostri clienti golosi. Cerchiamo di farlo come lo faresti tu per te stesso.</p>
      <p>Ogni cliente, al telefono o davanti a noi, deve essere sorpreso dall’attenzione che mettiamo negli ingredienti e nel prodotto. Se condividi la nostra idea e cerchi un’azienda in cui metterti in gioco e imparare, ecco le figure che compongono il team.</p>
      <div class="role-grid" style="margin-top:2rem">
        <article class="role"><h3>Venditori / Customer care</h3><p>Dopo una formazione da parte dell’azienda, rispondono alle richieste dei clienti con l’obiettivo di aumentarne la soddisfazione. Non sono cassieri: il loro obiettivo è vendere e prendersi cura del cliente.</p><ul class="check-list"><li>Trasformare i clienti occasionali in clienti fidelizzati</li><li>Mantenere alta la soddisfazione</li><li>Proporre prodotti in abbinamento (up-selling e cross-selling)</li></ul></article>
        <article class="role"><h3>Assistente / Responsabile di produzione</h3><p>Si confronta direttamente con i titolari sui risultati ottenuti e lavora per migliorarli: procedure, tempi di lavoro, estetica dei prodotti.</p><ul class="check-list"><li>Produrre gelato, pasticceria e altro</li><li>Ottimizzare i cicli produttivi</li><li>Proporre nuove soluzioni insieme ai venditori e ai titolari</li></ul></article>
      </div>
      <p style="margin-top:2rem">Dietro le quinte ci sono i titolari, che si occupano di amministrazione, marketing, acquisti e fornitori, e soprattutto della creazione di nuove ricette e nuovi prodotti.</p>
    </div>
    <aside class="aside-card reveal">
      <h3>Candidati</h3>
      <p>Mandaci una email con il tuo curriculum e due righe su di te: per quale ruolo ti proponi e perché.</p>
      <a class="btn" href="mailto:${INFO.email}?subject=Candidatura%20-%20Lavora%20con%20noi">${I.mail}<span>Invia la candidatura</span></a>
      <a class="btn btn--ghost" href="tel:${INFO.tel.replace(/\s/g, "")}"><span>Chiama</span></a>
    </aside>
  </div>
</section>
`,
});

/* ======================================================
   404
   ====================================================== */
emit(ROOT, "404.html", `${head({ title: "Pagina non trovata · Cremeria Scirocco", desc: "La pagina che cerchi non esiste.", page: "404" })}
<body data-page="404">
${header("404")}
<main id="main" class="notfound on-dark">
  <div>
    <p class="eyebrow eyebrow--light" style="justify-content:center">Errore 404</p>
    <h1><span class="melt">4</span><em class="accent">0</em><span class="melt">4</span></h1>
    <p class="lead" style="color:rgba(251,245,238,.8);margin:12px auto 32px">Questa pagina si è sciolta. Ma il gelato ti aspetta ancora.</p>
    <div class="hero-actions" style="justify-content:center"><a class="btn magnetic" href="index.html"><span>Torna alla home</span>${I.arrow}</a><a class="btn btn--ghost" href="gusti.html">${I.cone}<span>Gusti di oggi</span></a></div>
  </div>
</main>
${footer()}
</body>
</html>
`);
console.log("✓ 404.html");
