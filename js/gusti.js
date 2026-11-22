/* Menu dei gusti: card, filtri per tipo, esclusione allergeni, ricerca.
   I dati sono in js/gusti-data.js. Le card si riordinano con animazione FLIP (solo transform/opacity). */
(function () {
  "use strict";
  var EN = document.documentElement.lang === "en";
  var GUSTI = (window.SCIROCCO_GUSTI || []).map(function (g) {
    if (!EN) return g;
    var t = (window.SCIROCCO_GUSTI_EN || {})[g.nome] || {};
    // in inglese tengo anche il nome italiano nella ricerca
    return Object.assign({}, g, { nome: t.nome || g.nome, desc: t.desc || g.desc, tag: t.tag || g.tag, it: g.nome });
  });
  var ALG_EN = { latticini: "dairy", uova: "eggs", "frutta a guscio": "nuts", solfiti: "sulphites" };
  var grid = document.querySelector("[data-g-grid]");
  if (!grid) return;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var TIPI = {
    uova: { label: EN ? "Egg-based cream" : "Crema all’uovo", c: "#E9B949" },
    latte: { label: EN ? "Egg-free cream" : "Crema senza uova", c: "#ABC96B" },
    sorbetto: { label: EN ? "Sorbet · no milk or eggs" : "Sorbetto · senza latte né uova", c: "#3D8FD1" },
  };
  var ICON = {
    latticini: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2h6M10 2v3l-3 4v11a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9l-3-4V2"/><path d="M7 13h10"/></svg>',
    uova: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3c3.5 0 6.5 5.5 6.5 10a6.5 6.5 0 0 1-13 0C5.5 8.5 8.5 3 12 3z"/></svg>',
    "frutta a guscio": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 10h14a7 7 0 0 1-14 0z"/><path d="M4 10c0-3 3.5-5 8-5s8 2 8 5M12 5V2.5"/></svg>',
    solfiti: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2h8l-.5 7a3.5 3.5 0 0 1-7 0z"/><path d="M12 12.5V20M8.5 21h7"/></svg>',
    free: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function light(hex) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    return (r * 299 + g * 587 + b * 114) / 1000 > 200;
  }

  /* data aggiornamento e totale */
  var d = window.SCIROCCO_AGGIORNATO ? new Date(window.SCIROCCO_AGGIORNATO + "T12:00:00") : null;
  document.querySelectorAll("[data-g-date]").forEach(function (el) {
    el.textContent = d ? d.toLocaleDateString(EN ? "en-GB" : "it-IT", { day: "numeric", month: "long", year: "numeric" }) : "";
  });
  document.querySelectorAll("[data-g-total]").forEach(function (el) { el.textContent = GUSTI.length; });
  ["tutti", "uova", "latte", "sorbetto"].forEach(function (t) {
    var el = document.querySelector('[data-count="' + t + '"]');
    if (el) el.textContent = t === "tutti" ? GUSTI.length : GUSTI.filter(function (g) { return g.tipo === t; }).length;
  });

  /* vetrina nell'hero: una pallina per ogni gusto */
  var vet = document.querySelector("[data-vetrina]");
  if (vet) {
    vet.innerHTML = GUSTI.map(function (g, i) {
      return '<span class="v-scoop' + (light(g.colore) ? " is-light" : "") + '" style="--c:' + g.colore + ";--i:" + i + '"><i></i><b>' + esc(g.nome) + "</b></span>";
    }).join("");
    if (fine && !reduce) {
      var hero = vet.closest(".page-hero");
      hero.addEventListener("pointermove", function (e) {
        var r = vet.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        vet.style.transform = "perspective(900px) rotateY(" + (x * 10).toFixed(2) + "deg) rotateX(" + (-y * 8).toFixed(2) + "deg)";
      });
      hero.addEventListener("pointerleave", function () { vet.style.transform = ""; });
    }
  }

  /* card */
  grid.innerHTML = GUSTI.map(function (g, i) {
    var t = TIPI[g.tipo] || TIPI.latte;
    var alg = g.allergeni.length
      ? g.allergeni.map(function (a) { return '<li class="g-alg">' + (ICON[a] || "") + esc(EN ? (ALG_EN[a] || a) : a) + "</li>"; }).join("")
      : '<li class="g-alg g-alg--free">' + ICON.free + (EN ? "No allergens" : "Nessun allergene") + "</li>";
    return '<article class="g-card" data-i="' + i + '" style="--c:' + g.colore + ";--t:" + t.c + '">' +
      '<div class="g-scoop' + (light(g.colore) ? " is-light" : "") + '" aria-hidden="true"><i></i></div>' +
      '<div class="g-body">' +
      '<p class="g-type"><span></span>' + t.label + "</p>" +
      "<h3>" + esc(g.nome) + "</h3>" +
      (g.tag ? '<span class="g-tag">' + esc(g.tag) + "</span>" : "") +
      "<p class=\"g-desc\">" + esc(g.desc) + "</p>" +
      '<ul class="g-algs" aria-label="Allergeni">' + alg + "</ul>" +
      "</div></article>";
  }).join("");
  var cards = Array.prototype.slice.call(grid.children);

  // comparsa a cascata
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) {
          var idx = cards.indexOf(e.target);
          e.target.style.transitionDelay = (idx % 3) * 70 + "ms";
          e.target.classList.add("is-in");
          setTimeout(function () { e.target.style.transitionDelay = ""; }, 900);
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px" });
    cards.forEach(function (c) { io.observe(c); });
  } else cards.forEach(function (c) { c.classList.add("is-in"); });

  // tilt leggero
  if (fine && !reduce) {
    cards.forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--rx", ((0.5 - py) * 6).toFixed(2) + "deg");
        card.style.setProperty("--ry", ((px - 0.5) * 8).toFixed(2) + "deg");
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      });
      card.addEventListener("pointerleave", function () { card.style.removeProperty("--rx"); card.style.removeProperty("--ry"); });
    });
  }

  /* filtri */
  var state = { tipo: "tutti", excl: [], q: "" };
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".g-tab"));
  var ind = document.querySelector(".g-tabs-ind");
  var pills = Array.prototype.slice.call(document.querySelectorAll(".g-pill"));
  var search = document.querySelector("[data-g-search]");
  var status = document.querySelector("[data-g-status]");
  var empty = document.querySelector("[data-g-empty]");

  function moveInd() {
    var a = tabs.filter(function (t) { return t.getAttribute("aria-pressed") === "true"; })[0];
    if (!a || !ind) return;
    ind.style.width = a.offsetWidth + "px";
    ind.style.transform = "translateX(" + a.offsetLeft + "px)";
  }
  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function match(g) {
    if (state.tipo !== "tutti" && g.tipo !== state.tipo) return false;
    for (var i = 0; i < state.excl.length; i++) if (g.allergeni.indexOf(state.excl[i]) > -1) return false;
    if (state.q) { var q = norm(state.q); if (norm(g.nome + " " + (g.it || "") + " " + g.desc).indexOf(q) === -1) return false; }
    return true;
  }
  function apply() {
    // FLIP: memorizza le posizioni prima
    var first = cards.map(function (c) { return c.hidden ? null : c.getBoundingClientRect(); });
    var shown = 0;
    cards.forEach(function (c) {
      var ok = match(GUSTI[+c.getAttribute("data-i")]);
      if (ok) shown++;
      if (!ok && !c.hidden) { c.hidden = true; }
      else if (ok && c.hidden) { c.hidden = false; c.classList.add("is-entering"); }
    });
    if (!reduce) {
      cards.forEach(function (c, i) {
        if (c.hidden) return;
        var last = c.getBoundingClientRect();
        if (c.classList.contains("is-entering")) {
          c.style.transition = "none"; c.style.opacity = "0"; c.style.transform = "scale(.92)";
          requestAnimationFrame(function () { requestAnimationFrame(function () {
            c.style.transition = ""; c.style.opacity = ""; c.style.transform = ""; c.classList.remove("is-entering");
          }); });
          return;
        }
        var f = first[i]; if (!f) return;
        var dx = f.left - last.left, dy = f.top - last.top;
        if (!dx && !dy) return;
        c.style.transition = "none";
        c.style.transform = "translate(" + dx + "px," + dy + "px)";
        requestAnimationFrame(function () { requestAnimationFrame(function () { c.style.transition = ""; c.style.transform = ""; }); });
      });
    } else cards.forEach(function (c) { c.classList.remove("is-entering"); });
    empty.hidden = shown > 0;
    status.textContent = EN ? (shown === GUSTI.length ? GUSTI.length + " flavours on display" : shown + " of " + GUSTI.length + " flavours") : (shown === GUSTI.length ? GUSTI.length + " gusti in vetrina" : shown + " " + (shown === 1 ? "gusto" : "gusti") + " su " + GUSTI.length);
  }

  // dopo un cambio di filtro riporta con dolcezza all'inizio dei gusti (se ci si era spostati più in basso)
  var menuTop = document.querySelector("#menu");
  function toMenu() {
    if (!menuTop) return;
    var header = document.querySelector(".site-header");
    var off = (header ? header.offsetHeight : 0) + 12;
    // la barra dei filtri sporge sopra la sezione (margine negativo): la includo nel calcolo
    var bar = menuTop.querySelector(".g-toolbar");
    var lift = bar ? Math.max(0, -parseFloat(getComputedStyle(bar).marginTop) || 0) : 0;
    var target = menuTop.getBoundingClientRect().top + window.scrollY - lift - off;
    if (Math.abs(window.scrollY - target) > 40) window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) { x.setAttribute("aria-pressed", x === t ? "true" : "false"); });
      state.tipo = t.getAttribute("data-tipo");
      moveInd(); apply(); toMenu();
    });
  });
  pills.forEach(function (p) {
    p.addEventListener("click", function () {
      var on = p.getAttribute("aria-pressed") !== "true";
      p.setAttribute("aria-pressed", on ? "true" : "false");
      var a = p.getAttribute("data-excl");
      state.excl = on ? state.excl.concat(a) : state.excl.filter(function (x) { return x !== a; });
      apply(); toMenu();
    });
  });
  var st;
  search.addEventListener("input", function () { clearTimeout(st); st = setTimeout(function () { state.q = search.value.trim(); apply(); }, 120); });
  document.querySelector("[data-g-reset]").addEventListener("click", function () {
    state = { tipo: "tutti", excl: [], q: "" };
    tabs.forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-tipo") === "tutti" ? "true" : "false"); });
    pills.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
    search.value = ""; moveInd(); apply(); toMenu();
  });
  window.addEventListener("resize", moveInd);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInd);
  moveInd(); apply();
})();
