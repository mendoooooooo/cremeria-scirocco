/* Collegamento al foglio Google della gelateria.
   La gelateria aggiorna gusti in vetrina, orari e avvisi da un foglio Google
   pubblicato sul web come CSV (una scheda = un link, vedi SCIROCCO_FOGLIO in build/data.mjs).
   - Se il foglio non risponde o è scritto male, il sito usa gli ultimi dati validi
     salvati nel browser, oppure quelli scritti nel sito (js/gusti-data.js e orari).
   - Gli altri script leggono i dati con SciroccoFoglio.pronto() e SciroccoFoglio.on(). */
(function () {
  "use strict";
  var CFG = window.SCIROCCO_FOGLIO || {};
  var KEY = "scirocco-foglio-v1";
  var subs = [], waiters = [];
  var api = window.SciroccoFoglio = {
    attivo: !!(CFG.gusti || CFG.orari || CFG.avvisi),
    data: null,
    caricato: false,
    on: function (fn) { subs.push(fn); },
    // chiama fn con i dati appena disponibili: subito se ci sono già (cache), altrimenti
    // aspetta il foglio al massimo ms millisecondi
    pronto: function (fn, ms) {
      if (!api.attivo || api.caricato || api.data) { fn(api.data); return; }
      var done = false;
      var go = function () { if (!done) { done = true; fn(api.data); } };
      waiters.push(go);
      setTimeout(go, ms || 1500);
    },
  };
  if (!api.attivo) return;

  try { var c = JSON.parse(localStorage.getItem(KEY)); if (c && typeof c === "object") api.data = c; } catch (e) {}

  /* ---------- lettura CSV ---------- */
  function csv(text) {
    var rows = [], row = [], f = "", q = false;
    text = String(text).replace(/^﻿/, "");
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (q) {
        if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
        else f += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(f); f = ""; }
      else if (ch === "\n") { row.push(f); rows.push(row); row = []; f = ""; }
      else if (ch !== "\r") f += ch;
    }
    if (f || row.length) { row.push(f); rows.push(row); }
    return rows;
  }
  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9#]+/g, " ").trim();
  }
  // righe come oggetti con le intestazioni normalizzate ("In vetrina" -> "in vetrina")
  function table(text) {
    if (!text || /^\s*</.test(text)) return null; // pagina HTML = foglio non pubblicato
    var rows = csv(text).filter(function (r) { return r.some(function (x) { return x.trim(); }); });
    if (!rows.length) return null;
    var h = rows[0].map(norm);
    return rows.slice(1).map(function (r) {
      var o = {};
      h.forEach(function (k, i) { if (k) o[k] = (r[i] || "").trim(); });
      return o;
    });
  }
  function col(o, names) {
    for (var i = 0; i < names.length; i++) if (o[names[i]] != null && o[names[i]] !== "") return o[names[i]];
    return "";
  }
  function si(v) { return /^(true|vero|si|x|1|ok|yes)$/.test(norm(v)); }

  /* ---------- gusti ---------- */
  var PALETTE = {
    uova: ["#F3D98B", "#E9B949", "#E8C27A", "#E39A45", "#F6EBD3"],
    latte: ["#C98A45", "#B98552", "#D9CBA0", "#8C5B3C", "#F4EEE6", "#ABC96B"],
    sorbetto: ["#F4B533", "#E8607A", "#9CC46A", "#3D8FD1", "#E2553F"],
  };
  function tipo(v) {
    var t = norm(v);
    if (t.indexOf("sorb") > -1) return "sorbetto";
    if (t.indexOf("senza uov") > -1) return "latte";
    if (t.indexOf("uov") > -1) return "uova";
    return "latte";
  }
  function allergeni(v) {
    var t = norm(v);
    if (!t || /^(nessun|no|niente)/.test(t)) return [];
    var out = [];
    String(v).split(/[,;\/+]|\s+e\s+/i).forEach(function (p) {
      var a = norm(p);
      if (!a) return;
      if (/latt|formagg/.test(a)) a = "latticini";
      else if (/^uov/.test(a)) a = "uova";
      else if (/guscio|secca|noc|mandorl|pistacch|anacard/.test(a)) a = "frutta a guscio";
      else if (/solfit|solforos/.test(a)) a = "solfiti";
      if (out.indexOf(a) === -1) out.push(a);
    });
    return out;
  }
  function colore(v, nome, t) {
    var m = String(v || "").trim().match(/^#?([0-9a-f]{6})$/i);
    if (m) return "#" + m[1].toUpperCase();
    var p = PALETTE[t], h = 0;
    for (var i = 0; i < nome.length; i++) h = (h * 31 + nome.charCodeAt(i)) >>> 0;
    return p[h % p.length];
  }
  function riga(r) {
    var tp = tipo(r.tipo);
    var g = { nome: r.gusto, tipo: tp, allergeni: allergeni(r.allergeni), colore: colore(r.colore, r.gusto, tp), desc: col(r, ["descrizione"]) };
    if (r.etichetta) g.tag = r.etichetta;
    var en = { nome: col(r, ["nome inglese"]), desc: col(r, ["descrizione inglese"]), tag: col(r, ["etichetta inglese"]) };
    if (en.nome || en.desc || en.tag) g.en = en;
    return g;
  }
  // gusti in vetrina oggi (pagina "Gusti di oggi")
  function gusti(t) {
    if (!t || !t.length || !("gusto" in t[0])) return null;
    return t.filter(function (r) { return r.gusto && si(col(r, ["in vetrina", "in vetrina oggi", "oggi"])); }).map(riga);
  }
  // gusti iconici della home: colonna "Iconico" (indipendente da "In vetrina").
  // Se la colonna non c'è o nessun gusto è spuntato, la home tiene i suoi gusti iconici.
  function iconici(t) {
    if (!t || !t.length || !("gusto" in t[0])) return null;
    var k = ["iconico", "iconici", "gusto iconico"].filter(function (x) { return x in t[0]; })[0];
    if (!k) return null;
    var list = t.filter(function (r) { return r.gusto && si(r[k]); }).map(riga);
    return list.length ? list : null;
  }

  /* ---------- orari ---------- */
  var GIORNI = { lun: 1, mar: 2, mer: 3, gio: 4, ven: 5, sab: 6, dom: 0 };
  function ora(v) {
    var s = String(v || "").trim();
    var m = s.match(/^(\d{1,2})(?:\s*[:.]\s*(\d{2}))?/);
    if (!m || /chius/i.test(s)) return null;
    var h = +m[1];
    if (h > 24) return null;
    return (h < 10 ? "0" : "") + h + ":" + (m[2] || "00");
  }
  function orari(t) {
    if (!t || !t.length || !("giorno" in t[0])) return null;
    var base = (window.SCIROCCO_ORARI || []).map(function (o) { return { d: o.d, open: o.open, close: o.close }; });
    var trovati = 0;
    t.forEach(function (r) {
      var d = GIORNI[norm(r.giorno).slice(0, 3)];
      if (d == null) return;
      var open = ora(r.apertura), close = ora(r.chiusura);
      var o = base.filter(function (x) { return x.d === d; })[0];
      if (!o) { o = { d: d }; base.push(o); }
      o.open = open && close ? open : null;
      o.close = open && close ? close : null;
      trovati++;
    });
    return trovati ? base : null;
  }

  /* ---------- avvisi ---------- */
  function data(v) {
    var s = String(v || "").trim(), m;
    if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return m[1] + "-" + pad(m[2]) + "-" + pad(m[3]);
    if ((m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})/))) {
      var y = m[3].length === 2 ? "20" + m[3] : m[3];
      return y + "-" + pad(m[2]) + "-" + pad(m[1]);
    }
    return "";
  }
  function pad(n) { n = String(+n); return n.length < 2 ? "0" + n : n; }
  function avvisi(t) {
    if (!t || !t.length || !("messaggio" in t[0])) return null;
    return t.map(function (r) {
      return { dal: data(r.dal), al: data(r.al), msg: r.messaggio, msgEn: col(r, ["messaggio inglese"]), chiuso: si(r.chiuso) };
    }).filter(function (a) { return a.msg || a.chiuso; });
  }

  /* ---------- download ---------- */
  function get(url) {
    if (!url) return Promise.resolve(null);
    var ctl = window.AbortController ? new AbortController() : null;
    var to = setTimeout(function () { if (ctl) ctl.abort(); }, 8000);
    var u = url + (url.indexOf("?") > -1 ? "&" : "?") + "t=" + Math.floor(Date.now() / 60000);
    return fetch(u, { cache: "no-store", signal: ctl ? ctl.signal : undefined })
      .then(function (r) { clearTimeout(to); if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(table)
      .catch(function () { return null; });
  }

  Promise.all([get(CFG.gusti), get(CFG.orari), get(CFG.avvisi)]).then(function (r) {
    var old = api.data || {};
    var nuovo = { gusti: gusti(r[0]), iconici: iconici(r[0]), orari: orari(r[1]), avvisi: avvisi(r[2]) };
    // se una scheda non risponde, tengo i suoi ultimi dati validi
    if (nuovo.gusti) nuovo.agg = Date.now();
    else ["gusti", "iconici", "agg"].forEach(function (k) { if (old[k] != null) nuovo[k] = old[k]; });
    ["orari", "avvisi"].forEach(function (k) { if (nuovo[k] == null && old[k] != null) nuovo[k] = old[k]; });
    var changed = JSON.stringify([nuovo.gusti, nuovo.iconici, nuovo.orari, nuovo.avvisi]) !== JSON.stringify([old.gusti, old.iconici, old.orari, old.avvisi]);
    api.data = nuovo;
    api.caricato = true;
    try { localStorage.setItem(KEY, JSON.stringify(nuovo)); } catch (e) {}
    var w = waiters; waiters = [];
    w.forEach(function (fn) { fn(); });
    if (changed) subs.forEach(function (fn) { try { fn(nuovo); } catch (e) {} });
  });
})();
