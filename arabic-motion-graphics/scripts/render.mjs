#!/usr/bin/env node
/*
 * Render a seekable HTML motion-graphics page to MP4 (or still PNGs).
 *
 *   node render.mjs scene.html                      -> scene.mp4
 *   node render.mjs scene.html --out reel.mp4 --fps 30
 *   node render.mjs scene.html --stills 0.5,3,7.2   -> scene-still-3.0.png ...
 *   node render.mjs scene.html --sheet              -> also scene-sheet.jpg (contact sheet)
 *   node render.mjs scene.html --audio music.mp3    -> muxes audio, fades it out at the end
 *
 * Duration and size come from <body data-duration="15" data-width="1080" data-height="1920">
 * unless overridden with --duration / --width / --height.
 */
import { createRequire } from "node:module";
import { spawn, execFileSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
function loadPlaywright() {
  for (const p of ["playwright", "/opt/node22/lib/node_modules/playwright"]) {
    try { return require(p); } catch {}
  }
  try {
    const root = execFileSync("npm", ["root", "-g"]).toString().trim();
    return require(path.join(root, "playwright"));
  } catch {}
  console.error("playwright not found. Install it with: npm i -g playwright");
  process.exit(1);
}

const args = process.argv.slice(2);
if (!args.length || args[0].startsWith("--")) {
  console.error("usage: render.mjs <page.html> [--out f.mp4] [--fps 30] [--stills t1,t2] [--sheet] [--audio f] [--duration s]");
  process.exit(1);
}
const input = path.resolve(args[0]);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? def : args[i + 1];
};
const flag = (name) => args.includes(`--${name}`);
const base = input.replace(/\.html?$/, "");

const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const probe = await browser.newPage();
await probe.goto(pathToFileURL(input).href);
const meta = await probe.evaluate(() => ({
  duration: parseFloat(document.body.dataset.duration || "0"),
  width: parseInt(document.body.dataset.width || "1080"),
  height: parseInt(document.body.dataset.height || "1920"),
}));
await probe.close();

const fps = parseFloat(opt("fps", "30"));
const duration = parseFloat(opt("duration", meta.duration || "10"));
const width = parseInt(opt("width", meta.width));
const height = parseInt(opt("height", meta.height));

const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(e.message));
page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
await page.goto(pathToFileURL(input).href);
await page.evaluate(() => document.fonts.ready);
const hasSeek = await page.evaluate(() => typeof window.__mgSeek === "function");
if (!hasSeek) console.warn("warning: page does not load mg.js — CSS animations are seeked directly");

async function seek(t) {
  await page.evaluate((t) => {
    if (window.__mgSeek) return window.__mgSeek(t);
    for (const a of document.getAnimations()) { a.pause(); a.currentTime = t * 1000; }
  }, t);
}

// Load every declared face, then report families used on the page that never
// loaded (a silent fallback turns Arabic into a generic system font).
const missing = await page.evaluate(async () => {
  await Promise.allSettled([...document.fonts].map((f) => f.load()));
  const loaded = new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family.replace(/["']/g, "")));
  const used = new Set();
  for (const el of document.querySelectorAll("body, body *")) {
    used.add(getComputedStyle(el).fontFamily.split(",")[0].replace(/["']/g, "").trim());
  }
  return [...used].filter((f) => !loaded.has(f) && !/^(serif|sans-serif|monospace|system-ui|inherit)$/.test(f));
});
if (missing.length) console.warn("warning: fonts used but not loaded:", missing.join(", "));

const stills = opt("stills");
if (stills) {
  for (const t of stills.split(",").map(Number)) {
    await seek(t);
    const out = `${base}-still-${t.toFixed(1)}.png`;
    await page.screenshot({ path: out });
    console.log(out);
  }
} else {
  const out = path.resolve(opt("out", `${base}.mp4`));
  const total = Math.round(duration * fps);
  const audio = opt("audio");
  const ffArgs = ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-i", "-"];
  if (audio) ffArgs.push("-i", path.resolve(audio));
  ffArgs.push("-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", String(fps));
  if (audio) {
    const fadeStart = Math.max(0, duration - 1.5);
    ffArgs.push("-af", `afade=t=in:d=0.3,afade=t=out:st=${fadeStart}:d=1.5`, "-c:a", "aac", "-b:a", "192k", "-shortest", "-map", "0:v", "-map", "1:a");
  }
  ffArgs.push("-movflags", "+faststart", out);
  const ff = spawn("ffmpeg", ffArgs, { stdio: ["pipe", "inherit", "inherit"] });
  const started = Date.now();
  for (let i = 0; i < total; i++) {
    await seek(i / fps);
    const buf = await page.screenshot({ type: "jpeg", quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (i % fps === 0) process.stdout.write(`\rframe ${i}/${total}`);
  }
  ff.stdin.end();
  await new Promise((r, j) => ff.on("close", (c) => (c === 0 ? r() : j(new Error("ffmpeg exit " + c)))));
  console.log(`\r${out}  (${total} frames, ${duration}s @ ${fps}fps, ${width}x${height}, ${((Date.now() - started) / 1000).toFixed(0)}s)`);

  if (flag("sheet")) {
    const sheet = `${base}-sheet.jpg`;
    const n = 12;
    const step = duration / n;
    execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", out, "-vf",
      `fps=1/${step},scale=360:-1,tile=6x2:padding=8:color=gray`, "-frames:v", "1", sheet]);
    console.log(sheet);
  }
}
if (consoleErrors.length) console.warn("page errors:\n  " + consoleErrors.join("\n  "));
await browser.close();
