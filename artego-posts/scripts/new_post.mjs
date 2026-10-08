#!/usr/bin/env node
/*
 * Create an Artego post folder from a layout.
 *   node new_post.mjs <post-dir> <layout>
 * layouts: single | list | offer | carousel
 * Result: <post-dir>/index.html + artego.css/js + fonts/ + brand/ + photos/ (put the photos here).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SKILL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [dir, layout = "single"] = process.argv.slice(2);
const ldir = path.join(SKILL, "assets", "layouts");
const layouts = fs.readdirSync(ldir).map((f) => f.replace(".html", ""));
if (!dir || !layouts.includes(layout)) {
  console.error(`usage: new_post.mjs <post-dir> <layout>   (layouts: ${layouts.join(", ")})`);
  process.exit(1);
}
const out = path.resolve(dir);
if (fs.existsSync(path.join(out, "index.html"))) {
  console.error(`${path.join(out, "index.html")} exists, not overwriting`);
  process.exit(1);
}
fs.mkdirSync(path.join(out, "photos"), { recursive: true });
for (const sub of ["fonts", "brand"]) fs.cpSync(path.join(SKILL, "assets", sub), path.join(out, sub), { recursive: true });
for (const f of ["artego.css", "artego.js"]) fs.copyFileSync(path.join(SKILL, "assets", f), path.join(out, f));
fs.copyFileSync(path.join(ldir, `${layout}.html`), path.join(out, "index.html"));
console.log(`created ${path.join(out, "index.html")} from ${layout} — put photos in ${path.join(out, "photos")}`);
