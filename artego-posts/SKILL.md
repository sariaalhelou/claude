---
name: artego-posts
description: Design Artego's Instagram images and carousels (4:5, 1080x1350 PNG) — realistic interior-design photography with Artego's Arabic typography and logo laid over it in code (HTML/CSS → Playwright PNG). Artego (ARTEGO — Creative Decoration, آرتيغو / ارتيجو) is a Tartip client in luxury interior design, execution and furnishing. Use this skill whenever the user asks for an Artego post, image, design, carousel, كاروسيل, بوست, منشور, تصميم, صورة, سلايدات, عرض/خصم, or any Instagram visual for Artego — even if they only give an idea and a few lines of text. Not for videos/reels.
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
| `scripts/render.mjs <dir>/index.html` | Exports `export/slide-01.png …` + `sheet.jpg`; `--only 1,3`, `--out dir`, `--no-sheet`. Prints `WARN` lines |
| `assets/layouts/` | `single` (text top, room below), `list` (headline + numbered glass rows), `offer` (offer line + red time-limited tag), `carousel` (cover → points → closing) |
| `assets/artego.css` | Stage 1080×1350, brand colors, type scale, scrims, band, pill, list rows, swipe hint, contact chip, logo |
| `assets/artego.js` | Adds the logo to every slide, `?guides` overlay (safe area + logo zone) |
| `assets/brand/` | Logo as vector SVG: `logo-brown` (default), `logo-white`, `logo-original` (black+beige), `logo-espresso-gold` |
| `assets/fonts/` | Baloo Bhaijaan 2 (Artego's Arabic font, 400–800), Open Sans (Latin), Playfair Display (01 02 numbers) |
| `references/brand.md` | **Read for every post** — personality, colors, fonts, logo rules, don'ts |
| `references/composition.md` | **Read for every post** — text/design balance, zones, sizes, each layout, carousel structure |
| `references/imagery.md` | **Read whenever you generate or choose photos** — photo style, prompt recipe, carousel consistency, AI-artifact checks |
| `references/arabic-typography.md` | Arabic shaping & line-breaking rules |

## Workflow

### 1. Brief
Collect idea, text, format, photos. Read `references/brand.md` and `references/composition.md`.

### 2. Plan the slides (short, in your head or in one message if not obvious)
- Split the text: single post = one message; carousel = cover (hook) → one point per slide →
  closing (brand line / contact, only if the user's text has it). ≤ 10 slides.
- Pick the layout per slide from the content: a question/hook → cover; numbered points →
  point slides or a `list` post; services/brand promise → `single`; discount → `offer`.
- For **each slide, decide the photo**: which room, what furniture/material is visible, and
  how it relates to the text (lighting text → a room where the lighting is the hero; materials →
  close-up of marble, wood and fabric samples; planning → desk with plans and samples).
  Also decide where the calm area for text sits (top, by default) and keep a calm patch at
  bottom-center for the logo.

### 3. Photos
- **User photos first.** Check size (≥ 1080×1350 after cropping) and quality; choose the crop
  (`--pos`, `--zoom`) so the design stays the hero and the top has room for text.
- **Otherwise generate** with the image-generation tool available in the session (e.g.
  Higgsfield `generate_image`), 4:5, photoreal, **no text in the image** — follow the prompt
  recipe in `references/imagery.md`. For a carousel, create the first image, then generate the
  others with it as a reference so it's one coherent space. Look at every result; regenerate
  anything with warped furniture, gibberish text on books/signs, or a busy top area.
- If no generation tool or credits are available and the user has no photos, say so and ask
  for photos — never fill a slide with a flat color or a stock-looking placeholder instead.

Save photos to `<post-dir>/photos/` (`01.jpg`, `02.jpg` …).

### 4. Build
```bash
node <skill>/scripts/new_post.mjs <post-dir> <layout>
```
Edit `index.html`: put the user's text in, set each slide's photo and crop, duplicate/remove
`<section class="slide">` blocks as needed (the carousel layout has a cover, one point slide
to duplicate, and a closing slide). Keep the brand classes; adjust sizes with the CSS
variables (`--fs`, `--top`, `--h`, `--a`) rather than inventing new colors or fonts.
Open with `?guides` in a browser to see the safe area and the logo zone.

### 5. Render and look
```bash
node <skill>/scripts/render.mjs <post-dir>/index.html
```
- Every `WARN` is an error: text outside the safe area, text over the logo zone, missing
  font/photo, low-res photo, very busy background under the logo. Fix and re-render.
- **Read every PNG** (and `sheet.jpg` for carousels). Check: Arabic letters joined and nothing
  clipped; text readable on the photo (raise the scrim `--a`/`--h` or move the crop if not);
  the furniture/design clearly visible — text never covers the hero piece; the logo crisp and
  clearly legible; the carousel looks like one series.

### 6. Deliver
Send the PNGs (in order) and the contact sheet. Mention any decision you made (photo
concept per slide, a crop, a line break), and anything the user should confirm (e.g. a phone
number or offer detail they gave). Keep the post folder — edits are cheap re-renders.

## Quality bar
- **Balance**: the design is the hero. Text block ≈ 25–40% of the slide (max ~45% for a
  list post), the rest is the room; the hero furniture/detail is never covered.
- **Logo on every slide**, bottom-center, ≥ 140 px wide (176 px default), clearly legible —
  brown on light photos, white on dark ones (render.mjs decides and adds a halo when needed).
  Never stretched, recolored outside the provided files, rotated, or effects added.
- Brand font only (Baloo Bhaijaan 2); headline 80–100 px, body ≥ 40 px, nothing under 30 px.
- Colors from `brand.md` only. Red appears **only** as the time-limited offer tag.
- Western digits (1 2 3, 10%), Arabic punctuation (، ؟), text right-aligned or centered as in
  the layouts; lines broken by meaning.
- Calm, elegant, minimal: no stickers, emojis, drop-shadows on text, gradients on text,
  neon, clip-art icons or crowded layouts.
- Photos look like professional interior photography: natural light, neutral palette
  (cream, beige, warm wood, travertine, olive greens), clean composition, no visible AI errors.
