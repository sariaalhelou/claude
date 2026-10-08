---
name: artego-posts
description: Design Artego's Instagram images and carousels (4:5, 1080x1350 PNG) — realistic interior-design photography with Artego's Arabic typography and logo laid over it in code (HTML/CSS → Playwright PNG). Artego (ARTEGO — Creative Decoration, آرتيغو / ارتيجو) is a Tartip client in luxury interior design, execution and furnishing. Use this skill whenever the user asks for an Artego post, image, design, carousel, كاروسيل, بوست, منشور, تصميم, صورة, سلايدات, عرض/خصم, or any Instagram visual for Artego — even if they only give an idea and a few lines of text. Also use it when the user asks for an image prompt (برومت) for Gemini or another image tool for an Artego post. Not for videos/reels.
---

# Artego Posts

Make Artego's Instagram posts and carousels: a **real-looking interior photograph** (the
design and furniture are the star) with **Artego's Arabic text and logo** set on top in
code. Each post is one HTML page; every `<section class="slide">` in it becomes one
1080×1350 PNG. `scripts/render.mjs` exports the PNGs, checks the text, and picks the
logo color from the photo so the logo is always clear.

**Why code for the text:** image models can't write correct Arabic or reproduce the logo.
So the photo is generated (or supplied) **without any text**, and every letter and the logo
are added here, pixel-exact, in the brand font.

## How the user works with you

The user (Tartip, Artego's agency) gives for each post:
1. **the idea and the details / full text** — use the text **word for word**. Never write,
   add, shorten or "improve" copy: no extra hooks, CTAs, captions, hashtags or labels. If
   something seems missing (e.g. a carousel has no closing line), ask — don't invent.
   Splitting the text across slides and breaking lines is your job; rewording is not.
2. **the format**: single post or carousel (and how many slides if they say).
3. **photos, if they have them** (Artego's real project photos are always preferred).
   Otherwise you generate realistic photos (see `references/imagery.md`).

If the idea and text are clear, don't ask questions — build. Ask only when text is
missing/ambiguous, or when a decision is genuinely theirs (e.g. which project photos to use).

## Files in this skill

| Path | What it is |
|---|---|
| `scripts/new_post.mjs <dir> <layout>` | Creates a post folder: layout → `index.html` + css/js, fonts, logos, `photos/` |
| `scripts/render.mjs <dir>/index.html` | Exports `export/slide-01.png …` + `sheet.jpg`; `--only 1,3`, `--out dir`, `--no-sheet`, `--boxes` (every text line's box). Prints `WARN` lines, incl. text outside the slide's `data-calm` area |
| `scripts/fit_photo.py <in> <out>` | Fits a photo to 1080×1350 (cover, Lanczos) and prints scale + crop offset to convert measured areas to post px |
| `assets/layouts/` | `single` (text top, room below), `list` (headline + numbered glass rows), `offer` (offer line + red time-limited tag), `carousel` (cover → points → closing) |
| `assets/artego.css` | Stage 1080×1350, brand colors, type scale, scrims, band, pill, list rows, swipe hint, contact chip, logo |
| `assets/artego.js` | Adds the logo to every slide, `?guides` overlay (safe area + logo zone) |
| `assets/brand/` | Logo as vector SVG: `logo-brown` (default), `logo-white`, `logo-original` (black+beige), `logo-espresso-gold` |
| `assets/fonts/` | Tajawal (Artego's Arabic font, user-chosen; 300–900), Open Sans (Latin), Playfair Display (01 02 numbers) |
| `references/brand.md` | **Read for every post** — personality, colors, fonts, logo rules, don'ts |
| `references/composition.md` | **Read for every post** — text/design balance, zones, sizes, each layout, carousel structure |
| `references/imagery.md` | **Read whenever you generate or choose photos** — photo style, prompt recipe, carousel consistency, AI-artifact checks |
| `references/arabic-typography.md` | Arabic shaping & line-breaking rules |

## Workflow — text first, then the photo made for it

The order matters (learned on the first posts): **lay out the text first, then make or pick
the photo for that layout, then fit the text to the real photo.** Scattering text to fit a
random photo looks wrong.

### 1. Brief
Collect idea, text, format, photos. Read `references/brand.md` and `references/composition.md`.
"العنوان" / "الفكرة" in a brief is the post's internal title/idea — put on the image only what
is under the copy/details ("الكوبي" / "التفاصيل"), and ask if unsure.

### 2. Decide the format from the amount of text
Count the text against the budget in `composition.md` (one centered text block per slide):
- fits one slide → `single`, `offer` or `list` (a headline + up to ~6 short items fits a `list`);
- more than that → **carousel** (cover → one point per slide → closing). Say so to the user
  with the split before anything is generated — never shrink below 34 px or scatter text.

### 3. Lay out the text on a wireframe (before any photo exists)
```bash
node <skill>/scripts/new_post.mjs <post-dir> <layout>
```
Put the user's text in, word for word. Give each slide `data-calm="l,r,b"` (the area the
photo must keep plain: x l→r, top → y b) and keep the text block inside it (narrow `.zone`
with `left/right` when needed). Render: a slide with `data-calm` and no photo becomes a
**wireframe** — cream = must be a plain wall/ceiling, hatched = decor. Use `--boxes` to read
exact text positions. This gives the numbers for the prompt.

### 4. The photo — written for the wireframe
- **User/Artego photos** first (check size, crop with `--pos`/`--zoom`).
- **The user generates it** (Gemini etc.; the usual case without credits): write the prompt with
  `references/imagery.md` → "Prompts for the user's image tool". State the calm area in
  percentages of the frame taken from the wireframe (e.g. "the middle 62% of the width, from the
  top to 80% of the height, is one completely plain wall"), where the decor goes, a calm bottom
  center for the logo, no text. Send the wireframe PNG with the prompt and a short checklist of
  what to verify before sending the image back. One prompt per slide for carousels (first image
  = reference for the rest).
- **You generate it** when an image tool with credits is in the session (e.g. Higgsfield
  `generate_image`, 4:5) — same prompt rules; look at every result and regenerate bad ones.
- No tool, no credits, no photos → give the user the prompt; never use flat color or random stock.

### 5. Fit the text to the real photo
```bash
python3 <skill>/scripts/fit_photo.py <photo> <post-dir>/photos/01.jpg
```
Look at the photo and measure its real calm area (convert with the printed scale/offset),
update `data-calm`, and adjust the text block to sit inside it — usually narrower margins and
slightly smaller sizes (with Tajawal on a ~590 px wall: kicker ~42, headline ~64, closing line ~36 on two lines, rows ~40). Keep the
logo bottom-center on a calm patch (rug/floor), 150–176 px.

### 6. Render and look
```bash
node <skill>/scripts/render.mjs <post-dir>/index.html --boxes
```
- Every `WARN` is an error (text outside the safe area or the calm area, over the logo zone,
  missing font/photo, low-res photo, busy background under the logo). Fix and re-render.
- **Read every PNG** (and `sheet.jpg`): letters joined, nothing clipped, text readable, the
  furniture uncovered, the logo crisp, the carousel one series.

### 7. Deliver
Send the PNGs in order (+ contact sheet). Report briefly: where the text sits relative to the
photo (with the measured numbers), any size change, and anything to confirm (text not used,
emoji replaced by the brand phone icon, low-res source). Keep the post folder.

## Quality bar
- **Balance**: the design is the hero. Text block ≈ 25–40% of the slide (max ~45% for a
  list post), the rest is the room; the hero furniture/detail is never covered.
- **Logo on every slide**, bottom-center, ≥ 140 px wide (176 px default), clearly legible —
  brown on light photos, white on dark ones (render.mjs decides; the user may force white). No halo or shadow behind it.
  Never stretched, recolored outside the provided files, rotated, or effects added.
- Brand font only (Tajawal); headline 80–100 px, body ≥ 40 px, nothing under 30 px.
- Colors from `brand.md` only. Red appears **only** as the time-limited offer tag.
- Western digits (1 2 3, 10%), Arabic punctuation (، ؟), text right-aligned or centered as in
  the layouts; lines broken by meaning.
- Calm, elegant, minimal: no stickers, emojis, drop-shadows on text, gradients on text,
  neon, clip-art icons or crowded layouts.
- Photos look like professional interior photography: natural light, neutral palette
  (cream, beige, warm wood, travertine, olive greens), clean composition, no visible AI errors.
