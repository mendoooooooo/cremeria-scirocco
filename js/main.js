/* Cremeria Scirocco — interazioni del sito.
   Tutte le animazioni usano solo transform e opacity. */
(function () {
  "use strict";
  var doc = document.documentElement;
  var IOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  requestAnimationFrame(function () { doc.classList.add("is-loaded"); document.body.classList.add("is-loaded"); });

  /* ---------- header: sfondo allo scroll, si nasconde scendendo ---------- */
  var header = $(".site-header");
  var toTop = $(".to-top");
  var ring = toTop && toTop.querySelector(".ring circle");
  var quickbar = $(".quickbar");
  var lastY = 0, ticking = false;
  var RING = 2 * Math.PI * 27;
  if (ring) { ring.style.strokeDasharray = RING; ring.style.strokeDashoffset = RING; }
  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - innerHeight;
    if (header) {
      header.classList.toggle("is-scrolled", y > 30);
      // iPhone/iPad: appena si scorre, Safari porta la pagina un po' sotto la barra di stato;
      // l'header scende di qualche pixel così logo e pulsanti restano alla stessa altezza
      // Safari nasconde le sue barre quando si scorre verso il basso e le fa ricomparire
      // scorrendo verso l'alto: lo spazio extra serve solo nel primo caso
      if (IOS) {
        if (y <= 4 || y < lastY - 2) doc.classList.remove("ios-scrolled");
        else if (y > lastY + 2) doc.classList.add("ios-scrolled");
      }
    }
    if (toTop) {
      toTop.classList.toggle("is-visible", y > 700);
      if (ring) ring.style.strokeDashoffset = RING * (1 - Math.min(1, y / Math.max(1, max)));
    }
    if (quickbar) quickbar.classList.toggle("is-visible", y > 260);
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- barra di scorrimento del sito (sopra i contenuti, solo con il mouse) ---------- */
  if (fine) (function () {
    doc.classList.add("custom-scroll");
    var bar = document.createElement("div");
    bar.className = "page-scroll"; bar.setAttribute("aria-hidden", "true");
    bar.innerHTML = '<div class="page-scroll-thumb"></div>';
    document.body.appendChild(bar);
    var thumb = bar.firstChild, hideT = 0, dragging = false, startY = 0, startScroll = 0, th = 0, raf = 0;
    function layout() {
      raf = 0;
      var sh = document.documentElement.scrollHeight, vh = innerHeight;
      if (sh <= vh + 2) { bar.style.display = "none"; return; }
      bar.style.display = "";
      th = Math.max(48, vh * vh / sh);
      var y = (vh - th) * (window.scrollY / (sh - vh));
      thumb.style.height = th + "px";
      thumb.style.transform = "translate3d(0," + y.toFixed(1) + "px,0)";
    }
    function show() {
      bar.classList.add("is-active");
      clearTimeout(hideT);
      hideT = setTimeout(function () { if (!dragging && !bar.matches(":hover")) bar.classList.remove("is-active"); }, 1200);
    }
    window.addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(layout); show(); }, { passive: true });
    window.addEventListener("resize", layout);
    if ("ResizeObserver" in window) new ResizeObserver(function () { if (!raf) raf = requestAnimationFrame(layout); }).observe(document.body);
    bar.addEventListener("pointerenter", function () { bar.classList.add("is-active"); });
    bar.addEventListener("pointerleave", show);
    thumb.addEventListener("pointerdown", function (e) {
      e.preventDefault(); dragging = true; startY = e.clientY; startScroll = window.scrollY;
      thumb.setPointerCapture(e.pointerId); bar.classList.add("is-dragging");
    });
    thumb.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var sh = document.documentElement.scrollHeight, vh = innerHeight;
      window.scrollTo(0, startScroll + (e.clientY - startY) * (sh - vh) / (vh - th));
    });
    thumb.addEventListener("pointerup", function () { dragging = false; bar.classList.remove("is-dragging"); show(); });
    bar.addEventListener("pointerdown", function (e) {
      if (e.target !== bar) return;
      var sh = document.documentElement.scrollHeight, vh = innerHeight;
      window.scrollTo({ top: (e.clientY / vh) * (sh - vh), behavior: reduce ? "auto" : "smooth" });
    });
    layout();
  })();

  /* ---------- menu mobile ---------- */
  var toggle = $(".menu-toggle"), mm = $("#mobile-menu");
  function setMenu(open) {
    doc.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open);
    var en = doc.lang === "en";
    toggle.setAttribute("aria-label", open ? (en ? "Close menu" : "Chiudi il menu") : (en ? "Open menu" : "Apri il menu"));
    mm.setAttribute("aria-hidden", !open);
    if (open) { header.classList.remove("is-hidden"); var f = mm.querySelector("a"); f && setTimeout(function () { f.focus(); }, 300); }
  }
  if (toggle && mm) {
    toggle.addEventListener("click", function () { setMenu(!doc.classList.contains("menu-open")); });
    mm.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && doc.classList.contains("menu-open")) { setMenu(false); toggle.focus(); } });
    window.addEventListener("resize", function () { if (innerWidth >= 1100 && doc.classList.contains("menu-open")) setMenu(false); });
  }

  /* ---------- titoli: parole che salgono ---------- */
  $$("[data-split]").forEach(function (el) {
    var i = 0;
    function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            var o = document.createElement("span"); o.className = "split-word";
            var inner = document.createElement("span"); inner.textContent = w; inner.style.setProperty("--i", i++);
            o.appendChild(inner); frag.appendChild(o);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    }
    el.setAttribute("aria-label", el.textContent.trim());
    walk(el);
    $$(".split-word", el).forEach(function (s) { s.setAttribute("aria-hidden", "true"); });
    if (!el.classList.contains("reveal") && !el.closest(".reveal")) el.classList.add("reveal-split");
  });

  /* ---------- reveal allo scroll ---------- */
  var revealEls = $$(".reveal, .reveal-split");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else revealEls.forEach(function (el) { el.classList.add("is-in"); });

  /* ---------- orari: "aperto ora" ---------- */
  // orari e avvisi possono arrivare dal foglio Google della gelateria (js/foglio.js)
  var ORARI = window.SCIROCCO_ORARI || [];
  var AVVISI = [];
  var EN = doc.lang === "en";
  var NOMI = EN ? ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] : ["domenica", "lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato"];
  function isoDay(n) { return n.getFullYear() + "-" + String(n.getMonth() + 1).padStart(2, "0") + "-" + String(n.getDate()).padStart(2, "0"); }
  function romeNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
      var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
      var d = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(o.weekday);
      return { d: d, m: (+o.hour % 24) * 60 + +o.minute, ymd: o.year + "-" + o.month + "-" + o.day };
    } catch (e) { var n = new Date(); return { d: n.getDay(), m: n.getHours() * 60 + n.getMinutes(), ymd: isoDay(n) }; }
  }
  function addDays(ymd, i) { var p = ymd.split("-"); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + i)).toISOString().slice(0, 10); }
  // chiusura straordinaria (ferie, festività) che copre quel giorno, se c'è
  function chiusura(ymd) {
    for (var i = 0; i < AVVISI.length; i++) {
      var a = AVVISI[i];
      if (a.chiuso && (a.dal || a.al) && (!a.dal || a.dal <= ymd) && (!a.al || ymd <= a.al)) return a;
    }
    return null;
  }
  function toMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function fmt(t) {
    if (!EN) return t.replace(":00", "");
    var h = +t.split(":")[0], m = t.split(":")[1];
    return (h % 12 || 12) + (m !== "00" ? ":" + m : "") + (h < 12 ? " am" : " pm");
  }
  function status() {
    var now = romeNow();
    var today = ORARI.filter(function (o) { return o.d === now.d; })[0];
    if (today && today.open && !chiusura(now.ymd)) {
      var a = toMin(today.open), c = toMin(today.close);
      if (now.m >= a && now.m < c) return EN
        ? { open: true, text: "Open now · closes at " + fmt(today.close), short: "Open now, until " + fmt(today.close) }
        : { open: true, text: "Aperto ora · chiude alle " + fmt(today.close), short: "Aperto ora, fino alle " + fmt(today.close) };
      if (now.m < a) return EN
        ? { open: false, text: "Closed · opens today at " + fmt(today.open), short: "Opens today at " + fmt(today.open) }
        : { open: false, text: "Chiuso · apre oggi alle " + fmt(today.open), short: "Apre oggi alle " + fmt(today.open) };
    }
    for (var i = 1; i <= 90; i++) {
      var dd = (now.d + i) % 7, ymd = addDays(now.ymd, i);
      if (chiusura(ymd)) continue;
      var nx = ORARI.filter(function (o) { return o.d === dd && o.open; })[0];
      if (nx) {
        var quando = i === 1 ? (EN ? "tomorrow" : "domani") : i < 7 ? (EN ? "on " : "") + NOMI[dd]
          : (EN ? "on " : "il ") + new Date(ymd + "T12:00:00").toLocaleDateString(EN ? "en-GB" : "it-IT", { day: "numeric", month: "long" });
        return EN
          ? { open: false, text: "Closed · opens " + quando + " at " + fmt(nx.open), short: "Opens " + quando + " at " + fmt(nx.open) }
          : { open: false, text: "Chiuso · apre " + quando + " alle " + fmt(nx.open), short: "Apre " + quando + " alle " + fmt(nx.open) };
      }
    }
    return { open: false, text: EN ? "Closed" : "Chiuso", short: EN ? "Closed" : "Chiuso" };
  }
  function paintStatus() {
    if (!ORARI.length) return;
    var s = status();
    $$("[data-open-status]").forEach(function (el) {
      el.classList.toggle("is-closed", !s.open);
      var dot = el.querySelector(".open-dot"); if (dot) dot.classList.toggle("is-closed", !s.open);
      var t = el.querySelector("span:last-child"); if (t) t.textContent = s.text;
    });
    $$("[data-open-short]").forEach(function (el) { el.textContent = s.short; });
    var d = romeNow().d;
    $$("[data-hours] tr").forEach(function (tr) { tr.classList.toggle("is-today", +tr.getAttribute("data-day") === d); });
  }
  paintStatus();
  setInterval(paintStatus, 60000);

  // tabella orari e riga del footer, ridisegnate se gli orari arrivano dal foglio
  function paintHours() {
    $$("[data-hours] tr").forEach(function (tr) {
      var o = ORARI.filter(function (x) { return x.d === +tr.getAttribute("data-day"); })[0];
      var td = tr.children[1];
      if (!o || !td) return;
      td.classList.toggle("closed", !o.open);
      td.textContent = o.open ? o.open.replace(":00", "") + "–" + o.close.replace(":00", "") : (EN ? "Closed" : "Chiuso");
    });
    var chiusi = ORARI.filter(function (o) { return !o.open; }).map(function (o) { return o.d; });
    var art = function (d) { return d === 0 ? "la " : "il "; };
    var txt = !chiusi.length ? (EN ? "Open every day" : "Orari: tutti i giorni")
      : chiusi.length === 1 ? (EN ? "Open every day except " + NOMI[chiusi[0]] : "Orari: tutti i giorni tranne " + art(chiusi[0]) + NOMI[chiusi[0]])
      : (EN ? "Closed on " : "Orari: chiuso ") + chiusi.map(function (d) { return NOMI[d]; }).join(EN ? " and " : " e ");
    $$("[data-orari-breve]").forEach(function (el) { el.textContent = txt; });
  }

  // striscia avvisi sotto l'header: compare 10 giorni prima della data "Dal" e sparisce dopo "Al"
  function paintAvvisi() {
    var old = $(".avviso-bar"); if (old) old.remove();
    var ymd = romeNow().ymd;
    var list = AVVISI.filter(function (a) {
      return a.msg && (!a.al || ymd <= a.al) && (!a.dal || addDays(a.dal, -10) <= ymd);
    });
    doc.classList.toggle("has-avviso", list.length > 0);
    if (!list.length) return;
    var bar = document.createElement("div");
    bar.className = "avviso-bar";
    bar.setAttribute("role", "status");
    list.forEach(function (a) {
      var p = document.createElement("p");
      p.textContent = EN && a.msgEn ? a.msgEn : a.msg;
      bar.appendChild(p);
    });
    var main = $("#main");
    if (main) main.parentNode.insertBefore(bar, main);
  }

  // gusti iconici della home: la colonna "Iconico" del foglio decide quali card mostrare.
  // Le card originali (titolo, testo, etichetta, ordine, traduzione) restano quelle del sito;
  // un gusto spuntato senza card originale viene aggiunto in fondo con i testi del foglio.
  var flavorGrid = $(".flavor-grid");
  var lastIconici = "";
  function normName(s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim(); }
  function paintIconici(list) {
    if (!flavorGrid || !list || !list.length) return;
    var key = JSON.stringify(list);
    if (key === lastIconici) return;
    lastIconici = key;
    var scelti = list.map(function (g) { return normName(g.nome); });
    var originali = $$(".flavor[data-gusto]", flavorGrid);
    var presenti = originali.map(function (c) { return normName(c.getAttribute("data-gusto")); });
    originali.forEach(function (c, k) { c.hidden = scelti.indexOf(presenti[k]) === -1; });
    $$(".flavor--foglio", flavorGrid).forEach(function (c) { flavorGrid.removeChild(c); });
    var TIPO = EN ? { uova: "Egg-based cream", latte: "Cream", sorbetto: "No milk · no eggs" } : { uova: "Crema all’uovo", latte: "Crema", sorbetto: "Senza latte · senza uova" };
    list.filter(function (g) { return presenti.indexOf(normName(g.nome)) === -1; }).forEach(function (g, i) {
      var en = EN ? g.en || {} : {};
      var tag = (EN && en.tag) || g.tag || TIPO[g.tipo] || "";
      var card = document.createElement("article");
      card.className = "flavor flavor--foglio tilt reveal";
      card.style.setProperty("--c", g.colore);
      card.style.setProperty("--d", (i % 3) * 0.08 + "s");
      var scoop = document.createElement("div"); scoop.className = "scoop"; scoop.setAttribute("aria-hidden", "true");
      var h = document.createElement("h3"); h.textContent = (EN && en.nome) || g.nome;
      var p = document.createElement("p"); p.textContent = (EN && en.desc) || g.desc;
      var t = document.createElement("span"); t.className = "tag" + (/premi|award|miglior|best/i.test(g.tag || "") ? " tag--premio" : ""); t.textContent = tag;
      card.appendChild(scoop); card.appendChild(h); card.appendChild(p);
      if (tag) card.appendChild(t);
      flavorGrid.appendChild(card);
      if (typeof io !== "undefined" && io) io.observe(card); else card.classList.add("is-in");
      addTilt(card);
    });
  }

  function usaFoglio(data) {
    if (!data) return;
    paintIconici(data.iconici);
    if (data.orari && data.orari.length) { ORARI = data.orari; window.SCIROCCO_ORARI = ORARI; paintHours(); }
    AVVISI = data.avvisi || [];
    paintStatus(); paintAvvisi();
  }
  var FOGLIO = window.SciroccoFoglio;
  if (FOGLIO && FOGLIO.attivo) { usaFoglio(FOGLIO.data); FOGLIO.on(usaFoglio); }

  /* ---------- accordion (FAQ e "come è fatto") ---------- */
  $$("[data-accordion]").forEach(function (group) {
    group.addEventListener("click", function (e) {
      var btn = e.target.closest("button[aria-expanded]");
      if (!btn || !group.contains(btn)) return;
      var open = btn.getAttribute("aria-expanded") === "true";
      $$("button[aria-expanded]", group).forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
      btn.setAttribute("aria-expanded", String(!open));
    });
  });

  /* ---------- carosello recensioni ---------- */
  $$("[data-carousel]").forEach(function (root) {
    var viewport = $(".carousel-viewport", root), track = $(".carousel-track", root);
    var slides = $$(".review", track), dotsWrap = $(".dots", root);
    var prev = $("[data-prev]", root), next = $("[data-next]", root);
    var index = 0, perView = 1, pages = 1, timer = null, paused = false, inView = !("IntersectionObserver" in window);
    var DELAY = 3500;
    var bar = $(".c-progress .bar i", root), num = $(".c-progress .num", root);
    root.style.setProperty("--autoplay", DELAY + "ms");

    function measure() {
      var w = innerWidth;
      perView = w >= 900 ? 3 : w >= 600 ? 2 : 1;
      pages = Math.max(1, slides.length - perView + 1);
      if (dotsWrap) dotsWrap.innerHTML = "";
      for (var i = 0; dotsWrap && i < pages; i++) {
        var b = document.createElement("button");
        b.type = "button"; b.setAttribute("aria-label", (EN ? "Go to review " : "Vai alla recensione ") + (i + 1));
        (function (n) { b.addEventListener("click", function () { go(n); restart(); }); })(i);
        dotsWrap.appendChild(b);
      }
      go(Math.min(index, pages - 1), true);
    }
    function offsetFor(i) { return slides[i] ? slides[i].offsetLeft - slides[0].offsetLeft : 0; }
    function go(i, instant) {
      index = (i + pages) % pages;
      track.classList.toggle("is-animating", !instant);
      track.style.transform = "translate3d(" + -offsetFor(index) + "px,0,0)";
      if (dotsWrap) $$("button", dotsWrap).forEach(function (d, n) { d.setAttribute("aria-current", n === index ? "true" : "false"); });
      if (bar) bar.style.setProperty("--p", ((index + 1) / pages).toFixed(3));
      if (num) num.textContent = (index + 1) + " / " + pages;
      // fa ripartire il riempimento del pallino attivo
      root.classList.toggle("is-playing", false); void root.offsetWidth; if (timer) root.classList.toggle("is-playing", true);
      slides.forEach(function (s, n) {
        var vis = n >= index && n < index + perView;
        s.setAttribute("aria-hidden", vis ? "false" : "true");
        s.style.opacity = vis ? "1" : ".45";
      });
    }
    function restart() {
      clearInterval(timer); timer = null;
      root.classList.toggle("is-playing", false);
      if (reduce || paused) return;
      timer = setInterval(function () { if (!paused && inView && !document.hidden) go(index + 1); }, DELAY);
      void root.offsetWidth; root.classList.toggle("is-playing", true);
    }
    function setPaused(v) { paused = v; restart(); }
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { var was = inView; inView = en[0].isIntersecting; if (inView && !was) restart(); }, { threshold: .25 }).observe(root);
    if (prev) prev.addEventListener("click", function () { go(index - 1); restart(); });
    if (next) next.addEventListener("click", function () { go(index + 1); restart(); });
    // pausa solo con la tastiera dentro il carosello (il mouse sopra non lo ferma)
    root.addEventListener("focusin", function (e) { if (e.target.matches && e.target.matches(":focus-visible")) setPaused(true); });
    root.addEventListener("focusout", function () { if (paused) setPaused(false); });
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { go(index + 1); restart(); }
      if (e.key === "ArrowLeft") { go(index - 1); restart(); }
    });

    // swipe / drag
    var startX = 0, startY = 0, dx = 0, dragging = false, locked = null, base = 0;
    viewport.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      dragging = true; locked = null; startX = e.clientX; startY = e.clientY; dx = 0;
      base = -offsetFor(index); track.classList.remove("is-animating");
    });
    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      dx = e.clientX - startX;
      var dy = e.clientY - startY;
      if (locked === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (locked === "x") {
        viewport.classList.add("is-dragging");
        track.style.transform = "translate3d(" + (base + dx) + "px,0,0)";
      }
    }, { passive: true });
    function end() {
      if (!dragging) return;
      dragging = false; viewport.classList.remove("is-dragging");
      if (locked === "x" && Math.abs(dx) > 35) go(index + (dx < 0 ? 1 : -1)); else go(index);
      restart();
    }
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    viewport.addEventListener("click", function (e) { if (Math.abs(dx) > 6) e.preventDefault(); }, true);

    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(measure, 150); });
    measure(); restart();
  });

  /* ---------- binario premi: frecce + drag ---------- */
  $$("[data-rail]").forEach(function (rail) {
    var wrap = rail.parentNode;
    var prev = $("[data-rail-prev]", wrap), next = $("[data-rail-next]", wrap);
    function step() { var c = rail.querySelector(".award"); return c ? c.offsetWidth + 18 : 300; }
    function upd() {
      if (rail.classList.contains("is-flowing")) return;
      if (prev) prev.disabled = rail.scrollLeft < 8;
      if (next) next.disabled = rail.scrollLeft > rail.scrollWidth - rail.clientWidth - 8;
    }
    prev && prev.addEventListener("click", function () { rail.scrollBy({ left: -step() * 2, behavior: reduce ? "auto" : "smooth" }); });
    next && next.addEventListener("click", function () { rail.scrollBy({ left: step() * 2, behavior: reduce ? "auto" : "smooth" }); });
    rail.addEventListener("scroll", function () { requestAnimationFrame(upd); }, { passive: true });
    upd();
    // nastro continuo: scorre lento e senza pause, all'infinito (le card sono duplicate)
    if (!reduce) {
      var originals = $$(".award", rail);
      originals.forEach(function (card) {
        var cl = card.cloneNode(true);
        cl.setAttribute("aria-hidden", "true");
        $$("button, a", cl).forEach(function (x) { x.tabIndex = -1; });
        rail.appendChild(cl);
      });
      rail.classList.add("is-flowing");
      var SPEED = 40; // pixel al secondo
      var pos = rail.scrollLeft, hold = false, seen = false, resumeAt = 0, lastT = 0, selfScroll = false;
      function half() { return rail.scrollWidth / 2; }
      function pauseFor(ms) { resumeAt = Math.max(resumeAt, performance.now() + ms); }
      var tx0 = 0, ty0 = 0;
      rail.addEventListener("touchstart", function (e) { tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY; }, { passive: true });
      rail.addEventListener("touchmove", function (e) { var dx = Math.abs(e.touches[0].clientX - tx0), dy = Math.abs(e.touches[0].clientY - ty0); if (dx > dy && dx > 6) hold = true; }, { passive: true }); // il dito in verticale (scorrere la pagina) non lo ferma
      rail.addEventListener("touchend", function () { hold = false; }, { passive: true });
      rail.addEventListener("touchcancel", function () { hold = false; }, { passive: true });
      rail.addEventListener("wheel", function (e) { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) pauseFor(180); }, { passive: true }); // solo lo scorrimento orizzontale lo ferma, e riparte subito
      // si ferma solo se ci si arriva con la tastiera (Tab), non dopo un clic o la chiusura del premio aperto
      var kbd = false;
      document.addEventListener("keydown", function (e) { if (e.key === "Tab") kbd = true; });
      document.addEventListener("pointerdown", function () { kbd = false; }, true);
      rail.addEventListener("focusin", function () { hold = kbd; });
      rail.addEventListener("focusout", function () { hold = false; });
      [prev, next].forEach(function (x) { if (x) x.addEventListener("click", function () { pauseFor(1400); }); });
      rail.addEventListener("scroll", function () {
        if (selfScroll) { selfScroll = false; return; }
        pos = rail.scrollLeft; // l'utente ha scorso: riparto da lì
        if (pos >= half()) { pos -= half(); selfScroll = true; rail.scrollLeft = pos; }
      }, { passive: true });
      if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { seen = en[0].isIntersecting; }).observe(rail); else seen = true;
      (function tick(t) {
        var dt = lastT ? Math.min(64, t - lastT) : 16; lastT = t;
        if (seen && !hold && !document.hidden && t > resumeAt && !rail.classList.contains("is-dragging")) {
          pos += SPEED * dt / 1000;
          if (pos >= half()) pos -= half();
          selfScroll = true; rail.scrollLeft = pos;
        }
        requestAnimationFrame(tick);
      })(performance.now());
    }
    if (fine) {
      var down = false, sx = 0, sl = 0, moved = false;
      rail.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; });
      window.addEventListener("pointermove", function (e) { if (!down) return; var d = e.clientX - sx; if (Math.abs(d) > 5) { moved = true; rail.classList.add("is-dragging"); } rail.scrollLeft = sl - d; });
      window.addEventListener("pointerup", function () { down = false; rail.classList.remove("is-dragging"); });
      rail.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
    }
  });

  /* ---------- lightbox ---------- */
  var lb = $(".lightbox");
  if (lb) {
    var lbImg = $("img", lb), lbCap = $(".lightbox-caption", lb), lbClose = $(".lightbox-close", lb), lastFocus = null;
    function openLb(src, cap) {
      lastFocus = document.activeElement;
      var webp = src.replace(/\.(jpg|png)$/, ".webp");
      lbImg.src = webp; lbImg.onerror = function () { lbImg.onerror = null; lbImg.src = src; };
      lbImg.alt = cap || ""; lbCap.textContent = cap || "";
      lb.classList.add("is-open"); lbClose.focus();
      document.body.style.overflow = "hidden";
    }
    function closeLb() { lb.classList.remove("is-open"); document.body.style.overflow = ""; lastFocus && lastFocus.focus(); }
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-lightbox]");
      if (t) { e.preventDefault(); openLb(t.getAttribute("data-lightbox"), t.getAttribute("data-caption")); }
    });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.closest(".lightbox-close")) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "Tab") { e.preventDefault(); lbClose.focus(); }
    });
  }

  /* ---------- mappa: si carica da sola quando ci si avvicina ---------- */
  function loadMap(wrap) {
    if (wrap.querySelector("iframe")) return;
    var f = document.createElement("iframe");
    f.src = wrap.getAttribute("data-map"); f.title = "Mappa: Cremeria Scirocco, via Barelli 1/c Bologna";
    f.referrerPolicy = "no-referrer-when-downgrade"; f.setAttribute("allowfullscreen", "");
    f.addEventListener("load", function () { wrap.classList.add("is-ready"); });
    wrap.appendChild(f);
  }
  $$("[data-map-auto]").forEach(function (wrap) {
    if ("IntersectionObserver" in window) {
      var mo = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { loadMap(wrap); mo.disconnect(); } }, { rootMargin: "400px 0px" });
      mo.observe(wrap);
    } else loadMap(wrap);
  });
  $$("[data-load-map]").forEach(function (b) {
    b.addEventListener("click", function () {
      var wrap = b.closest("[data-map]");
      var f = document.createElement("iframe");
      f.src = wrap.getAttribute("data-map"); f.title = "Mappa: Cremeria Scirocco, via Barelli 1/c Bologna";
      f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade";
      wrap.appendChild(f);
      f.addEventListener("load", function () { var ph = $(".map-placeholder", wrap); ph && ph.remove(); });
    });
  });

  /* ---------- iframe gusti live ---------- */
  var liveLoad = $("[data-live-loading]");
  if (liveLoad) {
    var fr = liveLoad.parentNode.querySelector("iframe");
    fr.addEventListener("load", function () { liveLoad.classList.add("is-done"); });
    setTimeout(function () { liveLoad.classList.add("is-done"); }, 8000);
  }

  /* ---------- scelta a schede (radio) ---------- */
  $$(".choice-group").forEach(function (g) {
    g.addEventListener("change", function () { var w = g.closest(".field"); if (w) w.classList.remove("has-error"); });
  });

  /* ---------- contatore persone ---------- */
  $$(".stepper").forEach(function (st) {
    var inp = st.querySelector("input"), min = +inp.min || 1, max = +inp.max || 500;
    function set(v) { v = Math.max(min, Math.min(max, v)); inp.value = v; st.querySelector("[data-dec]").disabled = v <= min; }
    st.querySelector("[data-dec]").addEventListener("click", function () { set((+inp.value || min) - 1); });
    st.querySelector("[data-inc]").addEventListener("click", function () { set((+inp.value || min - 1) + 1); });
    inp.addEventListener("change", function () { if (inp.value) set(+inp.value); });
    st.querySelector("[data-dec]").disabled = true;
  });

  /* ---------- calendario personalizzato ---------- */
  $$("[data-datepicker]").forEach(function (dp) {
    var btn = dp.querySelector(".dp-trigger"), label = dp.querySelector(".dp-value"), hidden = dp.querySelector("input[type=hidden]");
    var pop = dp.querySelector(".dp-pop"), title = dp.querySelector(".dp-title"), gridEl = dp.querySelector(".dp-grid");
    var MESI = EN ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      : ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
    var GG = NOMI;
    if (EN) { var wk = dp.querySelectorAll(".dp-week span"); "MTWTFSS".split("").forEach(function (l, n) { if (wk[n]) wk[n].textContent = l; }); }
    function closedDays() { return ORARI.filter(function (o) { return !o.open; }).map(function (o) { return o.d; }); }
    function shut(d) { return closedDays().indexOf(d.getDay()) > -1 || !!chiusura(iso(d)); }
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var view = new Date(today.getFullYear(), today.getMonth(), 1), selected = null, focusDate = new Date(today);
    function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
    function same(a, b) { return a && b && a.getTime() === b.getTime(); }
    function disabled(d) { return d < today || shut(d); }
    function render() {
      title.textContent = MESI[view.getMonth()] + " " + view.getFullYear();
      dp.querySelector("[data-dp-prev]").disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
      var first = new Date(view), offset = (first.getDay() + 6) % 7, days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      var html = "";
      for (var i = 0; i < offset; i++) html += '<span class="dp-empty"></span>';
      for (var dd = 1; dd <= days; dd++) {
        var d = new Date(view.getFullYear(), view.getMonth(), dd), dis = disabled(d);
        var cls = "dp-day" + (same(d, today) ? " is-today" : "") + (same(d, selected) ? " is-sel" : "") + (shut(d) && d >= today ? " is-closed" : "");
        html += '<button type="button" class="' + cls + '" data-d="' + iso(d) + '"' + (dis ? " disabled" : "") +
          ' tabindex="' + (same(d, focusDate) ? 0 : -1) + '" aria-pressed="' + same(d, selected) + '" aria-label="' + GG[d.getDay()] + " " + dd + " " + MESI[d.getMonth()] + (dis && d >= today ? (EN ? ", closed" : ", chiuso") : "") + '">' + dd + "</button>";
      }
      gridEl.innerHTML = html;
    }
    function open() {
      focusDate = selected ? new Date(selected) : new Date(today);
      while (disabled(focusDate)) focusDate.setDate(focusDate.getDate() + 1);
      view = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
      render(); dp.classList.add("is-open"); btn.setAttribute("aria-expanded", "true");
      var f = gridEl.querySelector('[tabindex="0"]'); if (f) f.focus();
      document.addEventListener("pointerdown", outside);
    }
    function close(focusBtn) { dp.classList.remove("is-open"); btn.setAttribute("aria-expanded", "false"); document.removeEventListener("pointerdown", outside); if (focusBtn) btn.focus(); }
    function outside(e) { if (!dp.contains(e.target)) close(false); }
    function pick(d) {
      selected = d; hidden.value = iso(d);
      label.textContent = GG[d.getDay()] + " " + d.getDate() + " " + MESI[d.getMonth()];
      dp.classList.add("has-value"); close(true);
    }
    btn.addEventListener("click", function () { dp.classList.contains("is-open") ? close(true) : open(); });
    dp.querySelector("[data-dp-prev]").addEventListener("click", function () { view.setMonth(view.getMonth() - 1); render(); });
    dp.querySelector("[data-dp-next]").addEventListener("click", function () { view.setMonth(view.getMonth() + 1); render(); });
    dp.querySelector("[data-dp-clear]").addEventListener("click", function () { selected = null; hidden.value = ""; label.textContent = EN ? "Choose a day" : "Scegli un giorno"; dp.classList.remove("has-value"); close(true); });
    gridEl.addEventListener("click", function (e) { var b = e.target.closest(".dp-day"); if (b && !b.disabled) { var p = b.getAttribute("data-d").split("-"); pick(new Date(+p[0], +p[1] - 1, +p[2])); } });
    pop.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); close(true); return; }
      var b = e.target.closest(".dp-day"); if (!b) return;
      var mv = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      if (mv) {
        e.preventDefault();
        var p = b.getAttribute("data-d").split("-"), d = new Date(+p[0], +p[1] - 1, +p[2] + mv);
        if (d < today) return;
        focusDate = d; view = new Date(d.getFullYear(), d.getMonth(), 1); render();
        var f = gridEl.querySelector('[data-d="' + iso(d) + '"]'); if (f) { f.tabIndex = 0; f.focus(); }
      }
    });
  });

  /* ---------- form: validazione + conferma ---------- */
  $$("form[data-validate]").forEach(function (form) {
    function check(field) {
      var wrap = field.closest(".field");
      var ok = field.checkValidity();
      if (field.type === "radio") { var grp = form.querySelectorAll('input[name="' + field.name + '"]'); ok = Array.prototype.some.call(grp, function (r) { return r.checked; }); }
      if (wrap) wrap.classList.toggle("has-error", !ok);
      field.setAttribute("aria-invalid", ok ? "false" : "true");
      var err = wrap && wrap.querySelector(".err");
      if (err) { if (!err.id) err.id = field.id + "-err"; field.setAttribute("aria-describedby", err.id); }
      return ok;
    }
    $$("input, select, textarea", form).forEach(function (f) {
      f.addEventListener("blur", function () { if (f.value || f.type === "checkbox") check(f); });
      f.addEventListener("input", function () { var w = f.closest(".field"); if (w && w.classList.contains("has-error")) check(f); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = $$("input, select, textarea", form).filter(function (f) { return f.name; });
      var seenR = {};
      var bad = fields.filter(function (f) { if (f.type === "radio") { if (seenR[f.name]) return false; seenR[f.name] = 1; } return !check(f); });
      if (form.classList.contains("newsletter")) {
        var msg = $(".form-msg", form), em = $("input[type=email]", form);
        if (!em.checkValidity()) { msg.style.color = "#F2A9C6"; msg.textContent = "Scrivi un’email valida."; em.focus(); return; }
        var body = "Vorrei iscrivermi alla newsletter della Cremeria Scirocco con questa email: " + em.value;
        window.location.href = "mailto:info@cremeriascirocco.it?subject=" + encodeURIComponent("Iscrizione newsletter") + "&body=" + encodeURIComponent(body);
        msg.style.color = ""; msg.textContent = "Grazie! Invia l’email che si è aperta per completare l’iscrizione.";
        form.reset();
        return;
      }
      if (bad.length) { bad[0].focus(); return; }
      var btn = form.querySelector("button[type=submit]");
      btn.classList.add("is-loading");
      var d = {}; fields.forEach(function (f) { if (f.type === "radio") { if (f.checked) d[f.name] = f.value; } else d[f.name] = f.type === "checkbox" ? f.checked : f.value; });
      if (d.data) { var lbl = form.querySelector(".dp-value"); d.data = lbl ? lbl.textContent : d.data; }
      var text = "Richiesta: " + d.tipo + "\n\nNome: " + d.nome + "\nTelefono: " + d.telefono + "\nEmail: " + d.email +
        (d.data ? "\nPer il: " + d.data : "") + (d.persone ? "\nPersone: " + d.persone : "") + (EN ? "\nLingua: inglese (richiesta dal sito in inglese)" : "") + "\n\n" + d.messaggio;
      setTimeout(function () {
        window.location.href = "mailto:info@cremeriascirocco.it?subject=" + encodeURIComponent("Richiesta dal sito: " + d.tipo) + "&body=" + encodeURIComponent(text);
        btn.classList.remove("is-loading");
        form.style.display = "none";
        var ok = form.parentNode.querySelector(".form-success");
        if (ok) { ok.classList.add("is-visible"); ok.setAttribute("tabindex", "-1"); ok.focus(); }
      }, 600);
    });
  });

  /* ---------- da qui in poi: effetti col mouse (solo puntatore fine) ---------- */
  if (reduce) return;

  // parallax leggero
  var par = $$(".parallax");
  if (par.length) {
    var pt = false;
    function para() {
      par.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var c = r.top + r.height / 2 - innerHeight / 2;
        el.style.transform = "translate3d(0," + (c * parseFloat(el.getAttribute("data-speed") || 0)).toFixed(1) + "px,0)";
      });
      pt = false;
    }
    window.addEventListener("scroll", function () { if (!pt) { pt = true; requestAnimationFrame(para); } }, { passive: true });
    para();
  }

  // profondità degli ingredienti: mouse su desktop, scroll su touch
  $$("[data-depth]").forEach(function (box) {
    var layers = $$(".layer", box);
    function apply(x, y) {
      layers.forEach(function (l) {
        var z = +l.getAttribute("data-z") || 10;
        l.style.transform = "translate3d(" + (x * z).toFixed(1) + "px," + (y * z).toFixed(1) + "px,0) rotate(" + (x * z * 0.12).toFixed(2) + "deg)";
      });
    }
    if (fine) {
      // segue il mouse ovunque nella finestra, appena la sezione è visibile
      var visible = false, mx = innerWidth / 2, my = innerHeight / 2, raf = 0;
      function update() {
        raf = 0;
        if (!visible) return;
        var r = box.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var x = Math.max(-1, Math.min(1, (mx - cx) / (innerWidth / 2)));
        var y = Math.max(-1, Math.min(1, (my - cy) / (innerHeight / 2)));
        apply(x * 0.6, y * 0.6);
      }
      window.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        mx = e.clientX; my = e.clientY;
        if (!raf) raf = requestAnimationFrame(update);
      }, { passive: true });
      window.addEventListener("scroll", function () { if (visible && !raf) raf = requestAnimationFrame(update); }, { passive: true });
      if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) update(); }).observe(box); else visible = true;
    } else {
      window.addEventListener("scroll", function () {
        requestAnimationFrame(function () {
          var r = box.getBoundingClientRect();
          var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
          apply(p * 0.3, p * 0.6);
        });
      }, { passive: true });
    }
  });

  if (!fine) return;
  doc.classList.add("has-mouse");

  // tilt 3D con riflesso
  $$(".tilt").forEach(addTilt);
  function addTilt(card) {
    if (!fine || card.hasAttribute("data-tilt-on")) return;
    card.setAttribute("data-tilt-on", "");
    var raf = null;
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        card.style.transition = "transform .15s linear";
        card.style.transform = "perspective(900px) rotateX(" + ((0.5 - py) * 9).toFixed(2) + "deg) rotateY(" + ((px - 0.5) * 11).toFixed(2) + "deg) translateY(-4px)";
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
      });
    });
    card.addEventListener("pointerleave", function () {
      if (raf) cancelAnimationFrame(raf);
      card.style.transition = "";
      card.style.transform = "";
    });
  }

  // pulsanti magnetici + luce sul pulsante
  $$(".magnetic, .btn").forEach(function (btn) {
    var mag = btn.classList.contains("magnetic");
    btn.addEventListener("pointermove", function (e) {
      var r = btn.getBoundingClientRect();
      var x = e.clientX - r.left, y = e.clientY - r.top;
      btn.style.setProperty("--mx", x + "px"); btn.style.setProperty("--my", y + "px");
      if (mag) btn.style.transform = "translate3d(" + ((x - r.width / 2) * 0.22).toFixed(1) + "px," + ((y - r.height / 2) * 0.32).toFixed(1) + "px,0)";
    });
    if (mag) btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
  });

  // cursore personalizzato + alone
  var dot = $(".cursor-dot"), glow = $(".cursor-glow");
  if (dot && glow) {
    var mx = innerWidth / 2, my = innerHeight / 2, gx = mx, gy = my, dx2 = mx, dy2 = my;
    window.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") { mx = e.clientX; my = e.clientY; } }, { passive: true });
    (function loop() {
      dx2 += (mx - dx2) * 0.35; dy2 += (my - dy2) * 0.35;
      gx += (mx - gx) * 0.08; gy += (my - gy) * 0.08;
      dot.style.transform = "translate3d(" + dx2.toFixed(1) + "px," + dy2.toFixed(1) + "px,0)";
      glow.style.transform = "translate3d(" + gx.toFixed(1) + "px," + gy.toFixed(1) + "px,0)";
      requestAnimationFrame(loop);
    })();
    document.addEventListener("pointerover", function (e) {
      dot.classList.toggle("is-hover", !!e.target.closest("a, button, [data-lightbox], input, select, textarea, label"));
    });
    document.addEventListener("pointerleave", function () { dot.style.opacity = "0"; glow.style.opacity = "0"; });
    document.addEventListener("pointerenter", function () { dot.style.opacity = ""; glow.style.opacity = ""; });
  }
})();
