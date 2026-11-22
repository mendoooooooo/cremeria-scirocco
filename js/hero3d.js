/* Hero 3D: un cono gelato (pistacchio + lampone) con granella che galleggia.
   Segue il mouse su desktop; su touch ruota da solo. Three.js si carica solo se
   c'è WebGL e l'utente non ha chiesto di ridurre le animazioni: altrimenti resta
   la foto del cono (fallback). */
(function () {
  "use strict";
  var canvas = document.getElementById("hero-canvas");
  if (!canvas) return;
  // la foto di riserva compare solo se il 3D non può partire o non parte entro 4 secondi
  function fallback() { if (!canvas.parentNode.classList.contains("has-3d")) canvas.parentNode.classList.add("no-3d"); }
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return fallback();
  try {
    var t = document.createElement("canvas");
    if (!(t.getContext("webgl2") || t.getContext("webgl"))) return fallback();
  } catch (e) { return fallback(); }
  setTimeout(fallback, 4000);

  function load() {
    var s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    s.async = true;
    s.onload = init;
    s.onerror = fallback;
    document.head.appendChild(s);
  }
  // non blocca il primo caricamento della pagina
  if ("requestIdleCallback" in window) requestIdleCallback(load, { timeout: 1200 }); else setTimeout(load, 300);

  function init() {
    var THREE = window.THREE;
    if (!THREE) return;
    var stage = canvas.parentNode;
    var small = window.innerWidth < 900;
    var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.6 : 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setClearColor(0x000000, 0);

    function col(h) { return new THREE.Color(h).convertSRGBToLinear(); }
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0.4, 13);

    /* luci: crema dall'alto, rim magenta e verde (colori del brand) */
    scene.add(new THREE.HemisphereLight(0xfff4e6, 0x0a2f55, 0.55));
    var key = new THREE.DirectionalLight(0xfff1dc, 1.25); key.position.set(-4, 6, 6); scene.add(key);
    var rimM = new THREE.PointLight(0xad1f5f, 2.2, 30); rimM.position.set(5, 1, -3); scene.add(rimM);
    var rimG = new THREE.PointLight(0xabc96b, 1.6, 30); rimG.position.set(-6, -2, 1); scene.add(rimG);
    var fill = new THREE.DirectionalLight(0xffffff, 0.35); fill.position.set(3, -2, 5); scene.add(fill);

    /* rumore 3D leggero per le palline */
    function hash(x, y, z) { var h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return h - Math.floor(h); }
    function noise(x, y, z) {
      var ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
      var fx = x - ix, fy = y - iy, fz = z - iz;
      var u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
      function l(a, b, t2) { return a + (b - a) * t2; }
      return l(
        l(l(hash(ix, iy, iz), hash(ix + 1, iy, iz), u), l(hash(ix, iy + 1, iz), hash(ix + 1, iy + 1, iz), u), v),
        l(l(hash(ix, iy, iz + 1), hash(ix + 1, iy, iz + 1), u), l(hash(ix, iy + 1, iz + 1), hash(ix + 1, iy + 1, iz + 1), u), v), w) * 2 - 1;
    }

    function scoopGeometry(r, seed) {
      var g = new THREE.SphereGeometry(r, small ? 72 : 112, small ? 48 : 80);
      var p = g.attributes.position, v = new THREE.Vector3();
      for (var i = 0; i < p.count; i++) {
        v.fromBufferAttribute(p, i);
        var n = v.clone().normalize();
        var d = noise(n.x * 2.2 + seed, n.y * 2.2, n.z * 2.2) * 0.07 + noise(n.x * 6 + seed, n.y * 6, n.z * 6) * 0.02;
        // "gonna" ondulata alla base della pallina, come quando si fa col porzionatore
        if (n.y < -0.15) {
          var ang = Math.atan2(n.z, n.x);
          var k = Math.min(1, (-0.15 - n.y) * 3);
          d += (Math.sin(ang * 9 + seed) * 0.06 + 0.05) * k;
        }
        v.copy(n).multiplyScalar(r * (1 + d));
        if (v.y < -r * 0.55) v.y = -r * 0.55 + (v.y + r * 0.55) * 0.25; // base schiacciata
        p.setXYZ(i, v.x, v.y, v.z);
      }
      g.computeVertexNormals();
      return g;
    }

    /* texture del cono a cialda */
    function waffle() {
      var c = document.createElement("canvas"); c.width = c.height = 512;
      var x = c.getContext("2d");
      var grd = x.createLinearGradient(0, 0, 0, 512); grd.addColorStop(0, "#E2AE68"); grd.addColorStop(1, "#C98A45");
      x.fillStyle = grd; x.fillRect(0, 0, 512, 512);
      x.strokeStyle = "rgba(120,66,20,.55)"; x.lineWidth = 7;
      for (var i = -512; i < 1024; i += 46) {
        x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 512, 512); x.stroke();
        x.beginPath(); x.moveTo(i, 512); x.lineTo(i + 512, 0); x.stroke();
      }
      x.strokeStyle = "rgba(255,226,170,.35)"; x.lineWidth = 2;
      for (var j = -512; j < 1024; j += 46) { x.beginPath(); x.moveTo(j + 4, 0); x.lineTo(j + 516, 512); x.stroke(); }
      var tex = new THREE.CanvasTexture(c);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(3, 2);
      tex.encoding = THREE.sRGBEncoding;
      return tex;
    }
    var wtex = waffle();

    var group = new THREE.Group();
    scene.add(group);

    // cono
    var coneMat = new THREE.MeshStandardMaterial({ map: wtex, bumpMap: wtex, bumpScale: 0.06, roughness: 0.75, metalness: 0 });
    var cone = new THREE.Mesh(new THREE.ConeGeometry(1.12, 3.3, 64, 1, true), coneMat);
    cone.rotation.x = Math.PI; cone.position.y = -1.75;
    group.add(cone);
    var rim = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.1, 16, 64), new THREE.MeshStandardMaterial({ color: col(0xd59a52), roughness: 0.7 }));
    rim.rotation.x = Math.PI / 2; rim.position.y = -0.1;
    group.add(rim);

    function cream(color, sheen) {
      var m = new THREE.MeshPhysicalMaterial({ color: col(color), roughness: 0.48, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.5 });
      if (m.sheen !== undefined && sheen) m.sheen = col(sheen);
      return m;
    }
    // pallina pistacchio (verde del logo) e pallina lampone (magenta del brand)
    var s1 = new THREE.Mesh(scoopGeometry(1.25, 1.3), cream(0x9cbf55, 0xd8ecb0));
    s1.position.y = 0.55;
    group.add(s1);
    var s2 = new THREE.Mesh(scoopGeometry(1.08, 7.1), cream(0xc8336f, 0xff9cc4));
    s2.position.set(0.12, 2.05, 0.05); s2.rotation.z = -0.12;
    group.add(s2);

    // placchetta di cioccolato con il cuore verde, come sulle torte della Cremeria
    var plaqueMat = new THREE.MeshStandardMaterial({ color: col(0x3b2116), roughness: 0.3, metalness: 0.1 });
    var plaque = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.95, 0.07), plaqueMat);
    plaque.position.set(0.55, 3.05, 0.3); plaque.rotation.set(-0.25, 0.4, 0.55);
    group.add(plaque);
    var heartShape = new THREE.Shape();
    heartShape.moveTo(0, -0.22);
    heartShape.bezierCurveTo(-0.32, 0.02, -0.18, 0.28, 0, 0.12);
    heartShape.bezierCurveTo(0.18, 0.28, 0.32, 0.02, 0, -0.22);
    var heart = new THREE.Mesh(new THREE.ShapeGeometry(heartShape, 16), new THREE.MeshStandardMaterial({ color: col(0xabc96b), roughness: 0.4 }));
    heart.position.set(0, 0, 0.04);
    plaque.add(heart);

    // granella: pistacchio, nocciola, cioccolato
    var COUNT = small ? 34 : 64;
    var chipGeo = new THREE.DodecahedronGeometry(0.11, 0);
    var chips = [];
    var palette = [0xabc96b, 0x8db04a, 0xb98552, 0x5a3420, 0xf3e3cc, 0xad1f5f];
    var mats = palette.map(function (c) { return new THREE.MeshStandardMaterial({ color: col(c), roughness: 0.6, flatShading: true }); });
    for (var i = 0; i < COUNT; i++) {
      var m = new THREE.Mesh(chipGeo, mats[i % mats.length]);
      var a = Math.random() * Math.PI * 2, rad = 2.6 + Math.random() * 2.4, y = -3 + Math.random() * 7;
      m.userData = { a: a, r: rad, y: y, sp: (0.08 + Math.random() * 0.18) * (Math.random() < 0.5 ? -1 : 1), bob: Math.random() * 6, rs: Math.random() * 2 };
      m.scale.setScalar(0.6 + Math.random() * 1.3);
      scene.add(m); chips.push(m);
    }

    // ombra morbida
    var sc = document.createElement("canvas"); sc.width = sc.height = 128;
    var sx = sc.getContext("2d"); var rg = sx.createRadialGradient(64, 64, 0, 64, 64, 64);
    rg.addColorStop(0, "rgba(0,0,0,.45)"); rg.addColorStop(1, "rgba(0,0,0,0)"); sx.fillStyle = rg; sx.fillRect(0, 0, 128, 128);
    var shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -3.35;
    scene.add(shadow);

    group.position.y = 0.05;
    group.rotation.z = 0.12;

    /* dimensioni */
    function resize() {
      var w = stage.clientWidth, h = stage.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w / h < 0.9 ? 15.5 : (h < 420 ? 15 : 13);
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener("resize", resize);

    /* input */
    var tx = 0, ty = 0, cx = 0, cy = 0;
    if (fine) {
      window.addEventListener("pointermove", function (e) {
        tx = (e.clientX / window.innerWidth) * 2 - 1;
        ty = (e.clientY / window.innerHeight) * 2 - 1;
      }, { passive: true });
    }

    /* entrata: il cono sale e si gira */
    var start = performance.now();
    var visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) loop(); }, { threshold: 0 }).observe(stage);
    }
    var running = false;
    function ease(t2) { return 1 - Math.pow(1 - t2, 4); }

    function frame(now) {
      var t2 = (now - start) / 1000;
      var intro = ease(Math.min(1, t2 / 1.6));
      if (!fine) { tx = Math.sin(t2 * 0.5) * 0.5; ty = Math.sin(t2 * 0.35) * 0.25; }
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;

      group.rotation.y = t2 * 0.25 + cx * 0.9 + (1 - intro) * -2.2;
      group.rotation.x = cy * 0.25;
      group.position.y = 0.05 + Math.sin(t2 * 1.1) * 0.12 + (1 - intro) * -3;
      group.scale.setScalar(0.66 + intro * 0.2); // dimensione finale 0.86: il cono sta tutto nel riquadro
      shadow.material.opacity = 0.5 + Math.sin(t2 * 1.1) * 0.12;
      s2.rotation.y = Math.sin(t2 * 0.8) * 0.15;
      plaque.rotation.y = 0.4 + Math.sin(t2 * 1.4) * 0.12;

      for (var i = 0; i < chips.length; i++) {
        var c = chips[i], u = c.userData;
        var ang = u.a + t2 * u.sp + cx * 0.4;
        c.position.set(Math.cos(ang) * u.r, u.y + Math.sin(t2 * 0.9 + u.bob) * 0.25 - cy * 0.5, Math.sin(ang) * u.r * 0.6 - 0.5);
        c.rotation.x = t2 * u.rs; c.rotation.y = t2 * u.rs * 0.7;
        c.scale.setScalar(c.scale.x);
      }
      renderer.render(scene, camera);
    }
    var first = true;
    function loop() {
      if (running) return;
      running = true;
      (function tick(now) {
        if (!visible || document.hidden) { running = false; return; }
        frame(now);
        if (first) { first = false; stage.classList.add("has-3d"); }
        requestAnimationFrame(tick);
      })(performance.now());
    }
    document.addEventListener("visibilitychange", function () { if (!document.hidden) loop(); });
    loop();
  }
})();
