/* Artego runtime: injects the logo into every slide, numbers slides, ?guides overlay.
 * The renderer (scripts/render.mjs) picks the logo color per slide from the photo
 * behind it (data-logo="auto", the default) and adds a halo when contrast is low. */
(function () {
  const LOGOS = {
    brown: "brand/logo-brown.svg",       // espresso on light photos (default)
    white: "brand/logo-white.svg",       // on dark / busy photos
    original: "brand/logo-original.svg", // black + beige, only on plain light backgrounds
  };
  window.ARTEGO_LOGOS = LOGOS;

  function setup() {
    if (/[?&]guides/.test(location.search)) document.body.classList.add("guides");
    document.querySelectorAll(".slide").forEach((s, i) => {
      s.dataset.index = String(i + 1);
      if (!s.querySelector(".logo-wrap")) {
        const w = document.createElement("div");
        w.className = "logo-wrap";
        const img = document.createElement("img");
        img.alt = "ARTEGO";
        w.appendChild(img);
        s.appendChild(w);
      }
      if (s.dataset.calm && !s.querySelector("img.photo")) {
        const [l, r, b] = s.dataset.calm.split(",").map(Number);
        const w = document.createElement("div");
        w.className = "wire";
        w.innerHTML = `<div class="wire-calm" style="left:${l}px;width:${r - l}px;height:${b}px"></div>`;
        s.prepend(w);
      }
      const mode = s.dataset.logo || document.body.dataset.logo || "auto";
      const img = s.querySelector(".logo-wrap img");
      img.src = LOGOS[mode === "auto" ? "brown" : mode] || LOGOS.brown;
    });
  }

  window.ARTEGO = {
    setLogo(i, mode, halo, dark) {
      const s = document.querySelectorAll(".slide")[i];
      const w = s.querySelector(".logo-wrap");
      w.querySelector("img").src = LOGOS[mode];
      w.classList.toggle("halo", !!halo);
      w.classList.toggle("dark", !!dark);
    },
  };

  const ready = Promise.all([
    document.fonts.ready,
    new Promise((r) => (document.readyState === "complete" ? r() : addEventListener("load", r))),
  ]).then(() => Promise.all([...document.images].map((im) => im.decode().catch(() => {}))));

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", setup);
  else setup();
  window.__artegoReady = ready.then(() => true);
})();
