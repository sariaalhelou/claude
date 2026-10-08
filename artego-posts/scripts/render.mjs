#!/usr/bin/env node
/*
 * Export an Artego post / carousel page to Instagram PNGs (1080×1350, 4:5).
 *
 *   node render.mjs post/index.html                 -> post/export/slide-01.png … + sheet.jpg
 *   node render.mjs post/index.html --only 1,3      -> only those slides
 *   node render.mjs post/index.html --out dir       -> other output folder
 *   node render.mjs post/index.html --no-sheet      -> skip the contact sheet
 *   node render.mjs post/index.html --boxes         -> print every text line's box (x1-x2, y1-y2)
 *
 * <section class="slide" data-calm="244,835,1090"> = the photo's calm area (x from 244 to 835,
 * from the top down to y 1090, in 1080×1350 px). Every text line must fall inside it (WARN otherwise).
 * A slide with data-calm and no photo renders as a wireframe (calm column + hatched decor zones),
 * to show the user where text will sit before they generate the image.
 *
 * Every <section class="slide"> becomes one PNG. Before exporting, the script:
 *   - checks fonts and photos loaded (photo resolution too: blurry photos are flagged),
 *   - flags text outside the safe area, text clipped/overflowing, text over the logo zone,
 *   - picks the logo color per slide from the photo behind it (data-logo="auto") and adds a
 *     NO halo/shadow behind it (user's rule) — when contrast is low it warns instead, so the
 *     photo/crop or the logo color is fixed rather than masked.
 * Warnings print as "WARN slide N: …" — treat them as errors and fix before delivering.
 */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
function loadPlaywright() {
  try { return require("playwright"); } catch {}
  try {
    const root = execSync("npm root -g", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    return require(path.join(root, "playwright"));
  } catch {}
  console.error("playwright not found. Install it with: npm i -g playwright && npx playwright install chromium");
  process.exit(1);
}

const args = process.argv.slice(2);
if (!args.length || args[0].startsWith("--")) {
  console.error("usage: render.mjs <page.html> [--out dir] [--only 1,3] [--no-sheet]");
  process.exit(1);
}
const page = path.resolve(args[0]);
const opt = (k) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : null; };
const outDir = path.resolve(opt("--out") || path.join(path.dirname(page), "export"));
const only = opt("--only") ? opt("--only").split(",").map(Number) : null;
const noSheet = args.includes("--no-sheet");
const showBoxes = args.includes("--boxes");
fs.mkdirSync(outDir, { recursive: true });

const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const warnings = [];
const warn = (s, m) => { const line = `WARN slide ${s}: ${m}`; warnings.push(line); console.warn(line); };
p.on("pageerror", (e) => warnings.push(`WARN page: ${e.message}`) && console.warn(`WARN page error: ${e.message}`));
p.on("requestfailed", (r) => { const l = `WARN missing file: ${decodeURIComponent(r.url())}`; warnings.push(l); console.warn(l); });

await p.goto(pathToFileURL(page).href + "?export");
await p.evaluate(() => document.body.classList.add("export"));
await p.evaluate(() => window.__artegoReady || document.fonts.ready);
await p.waitForTimeout(150);

// ---------- fonts ----------
const fontIssues = await p.evaluate(() => {
  const bad = new Set();
  for (const el of document.querySelectorAll(".slide *")) {
    if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el);
    const fam = cs.fontFamily.split(",")[0].trim();
    const spec = `${cs.fontWeight} 40px ${fam}`;
    if (!document.fonts.check(spec, el.textContent.trim().slice(0, 8))) bad.add(spec);
  }
  return [...bad];
});
for (const f of fontIssues) warn("*", `font not loaded: ${f} (falls back to a system font)`);

// ---------- per-slide checks ----------
const report = await p.evaluate(() => {
  const SAFE = { l: 60, r: 1020, t: 50 };
  const out = [];
  document.querySelectorAll(".slide").forEach((s, i) => {
    const sr = s.getBoundingClientRect();
    const items = [];
    const logo = s.querySelector(".logo-wrap").getBoundingClientRect();
    const lz = { l: logo.left - sr.left - 30, r: logo.right - sr.left + 30, t: logo.top - sr.top - 24, b: logo.bottom - sr.top };
    const calm = s.dataset.calm ? s.dataset.calm.split(",").map(Number) : null;
    const boxes = [];
    for (const el of s.querySelectorAll("*")) {
      if (el.closest(".logo-wrap, .edge-ok")) continue;
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!hasText) continue;
      const range = document.createRange();
      range.selectNodeContents(el);
      for (const r of range.getClientRects()) {
        const x1 = r.left - sr.left, x2 = r.right - sr.left, y1 = r.top - sr.top, y2 = r.bottom - sr.top;
        const txt = el.textContent.trim().slice(0, 30);
        if (x1 < SAFE.l - 1 || x2 > SAFE.r + 1 || y1 < SAFE.t) items.push(`text outside the safe area: "${txt}" (x ${x1 | 0}→${x2 | 0}, y ${y1 | 0})`);
        if (x2 > lz.l && x1 < lz.r && y2 > lz.t && y1 < lz.b) items.push(`text overlaps the logo zone: "${txt}"`);
        if (calm && (x1 < calm[0] - 1 || x2 > calm[1] + 1 || y2 > calm[2] + 1)) items.push(`text outside the photo's calm area ${calm.join(",")}: "${txt}" (x ${x1 | 0}→${x2 | 0}, y ${y1 | 0}→${y2 | 0})`);
        boxes.push(`  ${x1 | 0}-${x2 | 0}  y ${y1 | 0}-${y2 | 0}  "${txt}"`);
      }
      if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== "visible") items.push(`text clipped: "${el.textContent.trim().slice(0, 30)}"`);
    }
    const photos = [...s.querySelectorAll("img.photo")].map((im) => {
      const n = +getComputedStyle(im).getPropertyValue("--n") || 1;
      return { src: im.getAttribute("src"), w: im.naturalWidth, h: im.naturalHeight, n };
    });
    if (!photos.length && !s.classList.contains("no-photo") && !calm) items.push("no photo on this slide (Artego posts are photo-led; add class no-photo if intended)");
    for (const ph of photos) {
      if (!ph.w) items.push(`photo did not load: ${ph.src}`);
      else if (ph.w < 1080 * ph.n * 0.85 || ph.h < 1350 * 0.85) items.push(`photo is low-res (${ph.w}×${ph.h}) — will look soft; ask for a larger file or upscale it`);
    }
    out.push({ i, items, logo: { x: logo.left - sr.left, y: logo.top - sr.top, w: logo.width, h: logo.height }, mode: s.dataset.logo || document.body.dataset.logo || "auto", boxes: [...new Set(boxes)] });
  });
  return out;
});

// ---------- logo color + contrast ----------
const slides = await p.$$(".slide");
const lum = (hex) => {
  const c = hex.match(/\w\w/g).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const INK = { brown: lum("5E2D0A"), white: 1, original: lum("000000") };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

for (const r of report) {
  const s = slides[r.i];
  await s.evaluate((el) => (el.querySelector(".logo-wrap").style.visibility = "hidden"));
  await s.scrollIntoViewIfNeeded();
  const box = await s.boundingBox();
  const pad = 10;
  const clip = { x: box.x + r.logo.x - pad, y: box.y + r.logo.y - pad, width: r.logo.w + 2 * pad, height: r.logo.h + 2 * pad };
  const shot = (await p.screenshot({ clip })).toString("base64");
  await s.evaluate((el) => (el.querySelector(".logo-wrap").style.visibility = ""));
  // background luminance stats under the logo (mean + the 10% darkest / lightest)
  const st = await p.evaluate(async (b64) => {
    const im = new Image(); im.src = "data:image/png;base64," + b64; await im.decode();
    const c = document.createElement("canvas"); c.width = im.width; c.height = im.height;
    const g = c.getContext("2d"); g.drawImage(im, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data; const L = [];
    const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    for (let k = 0; k < d.length; k += 16) L.push(0.2126 * lin(d[k]) + 0.7152 * lin(d[k + 1]) + 0.0722 * lin(d[k + 2]));
    L.sort((a, b) => a - b);
    return { mean: L.reduce((a, b) => a + b, 0) / L.length, lo: L[Math.floor(L.length * 0.1)], hi: L[Math.floor(L.length * 0.9)] };
  }, shot);
  let mode = r.mode;
  if (mode === "auto") mode = ratio(INK.brown, st.mean) >= ratio(INK.white, st.mean) ? "brown" : "white";
  // worst case: the part of the background closest to the ink color
  const worst = mode === "white" ? ratio(INK.white, st.hi) : ratio(INK[mode], st.lo);
  // user's rule: never a halo/shadow behind the logo — fix the photo/crop or the color instead
  await p.evaluate(([i, m]) => window.ARTEGO.setLogo(i, m, false, false), [r.i, mode]);
  console.log(`slide ${r.i + 1}: logo ${mode} (contrast ≥ ${worst.toFixed(1)}:1)`);
  if (worst < 3) {
    const other = mode === "white" ? "brown" : "white";
    const alt = other === "white" ? ratio(INK.white, st.hi) : ratio(INK.brown, st.lo);
    r.items.push(`logo ${mode} has low contrast (${worst.toFixed(1)}:1; ${other} would be ${alt.toFixed(1)}:1) — ${alt > worst ? `use data-logo="${other}", or ` : ""}move/crop the photo so a calmer area sits under the logo`);
  }
  for (const m of r.items) warn(r.i + 1, m);
  if (showBoxes) console.log(`slide ${r.i + 1} text lines (x1-x2, y1-y2):\n${r.boxes.join("\n")}`);
}
await p.waitForTimeout(100);
await p.evaluate(() => Promise.all([...document.images].map((im) => im.decode().catch(() => {}))));

// ---------- export ----------
const files = [];
for (let i = 0; i < slides.length; i++) {
  if (only && !only.includes(i + 1)) continue;
  const f = path.join(outDir, `slide-${String(i + 1).padStart(2, "0")}.png`);
  await slides[i].screenshot({ path: f });
  files.push(f);
}
console.log(`exported ${files.length} PNG (1080×1350) → ${outDir}`);

// ---------- contact sheet (how the carousel reads in order) ----------
if (!noSheet && files.length > 1) {
  const sp = await ctx.newPage();
  const cols = Math.min(files.length, 5), tw = 324, th = 405, gap = 12;
  const rows = Math.ceil(files.length / cols);
  const imgs = files.map((f) => `<img src="data:image/png;base64,${fs.readFileSync(f).toString("base64")}">`).join("");
  await sp.setViewportSize({ width: cols * tw + (cols + 1) * gap, height: rows * th + (rows + 1) * gap });
  await sp.setContent(`<body style="margin:0;background:#2b2622;display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:${gap}px;padding:${gap}px;direction:ltr">${imgs.replace(/<img /g, `<img style="width:${tw}px;height:${th}px" `)}</body>`);
  await sp.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
  await sp.screenshot({ path: path.join(outDir, "sheet.jpg"), type: "jpeg", quality: 88 });
  console.log(`contact sheet (slide 1 at the left — Instagram always swipes to the next image on the right) → ${path.join(outDir, "sheet.jpg")}`);
}
await browser.close();
if (warnings.length) { console.warn(`\n${warnings.length} warning(s) — fix them before delivering.`); process.exitCode = 2; }
