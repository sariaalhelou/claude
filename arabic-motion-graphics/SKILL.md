---
name: arabic-motion-graphics
description: Produce Arabic motion-graphics videos (MP4) in code — HTML/CSS animation rendered frame-by-frame with Playwright + ffmpeg — for Instagram Reels (1080x1920). Covers product ads, kinetic typography / animated text, explainer & infographic videos, and logo intros, with correct RTL Arabic text, bundled Arabic fonts and the user's brand identity. Use this skill whenever the user asks for a video, reel, ريلز, موشن غرافيك, motion graphics, فيديو إعلاني, فيديو متحرك, نص متحرك, إنفوجرافيك متحرك, انترو, مقدمة شعار, animated text or any animated/video content in Arabic — even if they don't say "motion graphics" or only describe the message they want to get across.
---

# Arabic Motion Graphics

Make short, branded, Arabic motion-graphics videos entirely in code. Each video is
one HTML page whose CSS animations sit on a single global timeline; `scripts/render.mjs`
freezes that timeline at every frame, screenshots it and encodes an H.264 MP4.
Because it is code, Arabic text shapes correctly, the brand is exact, and any detail
can be changed and re-rendered in a minute.

Default target: **Instagram Reels — 1080×1920, 30 fps, 8–20 s**. No AI video generation;
everything on screen is drawn with HTML/CSS/SVG (plus images the user supplies).

## Files in this skill

| Path | What it is |
|---|---|
| `scripts/new_project.sh <dir> <template>` | Creates a project folder: template → `index.html`, plus fonts, `mg.js`, `stage.css`, `brand.css`, brand assets |
| `scripts/render.mjs <page.html>` | Renders: `--stills 1,4.5` (PNG frames), default MP4, `--sheet` contact sheet, `--audio f.mp3` |
| `assets/templates/` | `kinetic-text` (12s), `product-ad` (15s), `explainer` (18s), `logo-intro` (6s), `blank` |
| `assets/brand.css` | Brand colors, fonts, easing as CSS variables — every template reads only these |
| `assets/brand/` | The user's logo and other brand files; copied into every new project |
| `assets/stage.css` | 1080×1920 stage, Reels safe zone, scene windows, reusable keyframes |
| `assets/mg.js` | Runtime: `splitWords`, `counter`, `onFrame`, easing, `formatNumber` |
| `assets/fonts/` | Cairo, Tajawal, Almarai, IBM Plex Sans Arabic, Noto Kufi Arabic, Changa, Reem Kufi, Lalezar |
| `references/arabic-typography.md` | **Read before writing any Arabic on screen** — shaping, fonts, digits, bidi |
| `references/motion-design.md` | Timing, reading speed, easing, Reels structure, per-video-type recipes |
| `references/techniques.md` | How the timeline works, CSS/JS patterns, gotchas, images/video/audio |
| `references/brand.md` | The user's identity and tone of voice — follow it in every video |

## Workflow

### 1. Brief
Pull out of the request: the single message, the video type, the audience, the
call to action, any copy/numbers/product images, and the duration (default 15 s).
Read `references/brand.md` for the brand. When details are missing, choose sensible
defaults and state them in one line rather than interrogating the user — a first
cut they can react to is faster than a questionnaire. Ask only when something truly
can't be guessed (e.g. the price in an offer).

### 2. Storyboard
Write a short scene list before any code: time window, on-screen text (final Arabic
copy), and the motion for each scene. Check every text card against the reading-time
rule in `references/motion-design.md` (≈ 0.4 s per word + 1 s). Show it to the user
for videos longer than ~20 s or when the copy is your invention; otherwise proceed.

```
0.0–3.0  Hook     "تعبت من القهوة الباردة؟"   words rise in, staggered
3.0–7.0  Product  product.png + name           blur-in, float, ring
...
```

### 3. Build
```bash
bash <skill>/scripts/new_project.sh ./videos/<name> <template>
```
Pick the closest template and adapt it — they already encode the safe zone, the RTL
motion direction and timing that reads well. Edit `index.html`: copy, scene windows
(`--in` / `--out`), delays, and swap placeholders (`product.png`, `logo.png`) for the
user's files. Keep colors and fonts as `var(--brand-*)` so the brand stays consistent.
Read `references/techniques.md` before writing new animation code.

### 4. Check stills, then render
Render stills at the busiest moment of every scene and **look at them** (Read the PNGs):
```bash
node <skill>/scripts/render.mjs videos/<name>/index.html --stills 1.5,5,9,13
```
Check: text fully inside the safe zone (add `?guides` in a browser to see it), no
clipped glyph tops/dots, letters joined, nothing overlapping, the render printed no
font or page-error warnings. Fix and re-check. Then render the video and its sheet:
```bash
node <skill>/scripts/render.mjs videos/<name>/index.html --sheet [--audio music.mp3]
```
Read the `-sheet.jpg` to confirm the flow (12 evenly spaced frames). ~30–60 s render
time per 15 s video.

### 5. Deliver
Send the MP4 to the user (use SendUserFile if available, otherwise give the path),
with one line on the structure and an offer of quick variations: different hook,
another color scheme, 1:1 or 16:9 cut, longer/shorter. Keep the project folder —
edits are cheap re-renders.

## Quality bar

The video must survive a phone screen and a 1-second attention span:
- A hook on screen within the first 0.5 s, readable with sound off.
- One idea per scene; at most ~8 words on screen at once (headline ≤ 6).
- Headline text ≥ 90 px, body ≥ 48 px; strong contrast against the background.
- Motion flows right → left (the Arabic reading direction): entrances from the
  right, progress bars and wipes fill from the right.
- Something is always moving subtly (float, slow zoom, background drift) — a fully
  static frame reads as a frozen video.
- The last 2–3 s hold the CTA / logo still enough to read.
