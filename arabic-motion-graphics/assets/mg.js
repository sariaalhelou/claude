/*
 * mg.js — tiny runtime for seekable motion graphics.
 *
 * The page plays normally when opened in a browser (live preview). When the
 * renderer (scripts/render.mjs) drives it, it calls window.__mgSeek(t) for
 * every frame, which freezes all CSS animations at time t and runs every
 * MG.onFrame callback with t — so output is frame-exact and deterministic.
 *
 * Rule of thumb: animate with CSS @keyframes + animation-delay whenever you
 * can; use MG.onFrame only for things CSS can't do (counters, charts drawn
 * from data, canvas, typewriter by word).
 */
(function () {
  const frameFns = [];
  let rendering = false;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = {
    linear: (x) => x,
    outCubic: (x) => 1 - Math.pow(1 - x, 3),
    inCubic: (x) => x * x * x,
    inOutCubic: (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    outExpo: (x) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
    inExpo: (x) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10)),
    outBack: (x) => 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2),
  };

  // progress of t inside [start, start+dur], eased, clamped to 0..1
  function progress(t, start, dur, e = ease.outCubic) {
    return e(clamp((t - start) / dur));
  }
  const lerp = (a, b, p) => a + (b - a) * p;

  function seek(t) {
    for (const a of document.getAnimations()) {
      a.pause();
      a.currentTime = t * 1000;
    }
    for (const fn of frameFns) fn(t);
  }

  function onFrame(fn) {
    frameFns.push(fn);
    if (!rendering) fn(0);
  }

  /*
   * Wrap each WORD of an element in <span class="w" style="--i:n">.
   * Never split Arabic into letters: separate spans break the joining
   * between letters and the word falls apart into isolated glyphs.
   */
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`)
      .join(" ");
    return words.length;
  }

  // Eastern Arabic digits (٠١٢٣) or Western, with thousands separators.
  function formatNumber(n, { arabicDigits = false, decimals = 0 } = {}) {
    return n.toLocaleString(arabicDigits ? "ar-EG" : "en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  // Animate an element's text from `from` to `to` between start and start+dur.
  function counter(el, { from = 0, to, start, dur = 1.2, prefix = "", suffix = "", ...fmt }) {
    onFrame((t) => {
      const v = lerp(from, to, progress(t, start, dur, ease.outExpo));
      el.textContent = prefix + formatNumber(v, fmt) + suffix;
    });
  }

  window.__mgSeek = (t) => {
    rendering = true;
    seek(t);
  };

  // Live preview: drive onFrame callbacks in real time, loop at the end.
  function live() {
    const dur = parseFloat(document.body.dataset.duration || "10");
    const t0 = performance.now();
    function tick(now) {
      if (rendering) return;
      const t = ((now - t0) / 1000) % dur;
      for (const fn of frameFns) fn(t);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  window.addEventListener("load", () => {
    if (new URLSearchParams(location.search).has("guides")) document.body.classList.add("guides");
    if (!navigator.webdriver) live();
  });

  window.MG = { onFrame, progress, lerp, clamp, ease, splitWords, formatNumber, counter, seek };
})();
