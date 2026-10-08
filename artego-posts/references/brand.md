# Artego brand (from Artego's brand strategy + their approved posts)

**ARTEGO — Creative Decoration.** Luxury interior design, execution, furnishing and full
project management (Saudi market; site artego-me.com, Instagram artego.me).

**Contact number for posts: `00966508510024`** (confirmed by the user — use this one on closing
slides / contact chips, written exactly like this; not the business-card number). The account
should feel like a **trusted reference in luxury interior design**, led by an experienced
designer — not a sales catalogue.

## Personality
Elegant · Timeless · Minimal · Professional · Calm.
Every visual should feel quiet and expensive: lots of air, few elements, soft light.

## Copy tone (the user writes it; you only lay it out)
Short, refined, calm, story-like, far from hard selling. That's why the user's text is used
as given: don't add sales words, exclamation marks, emojis or CTAs.

## Content pillars (helps choose the photo)
| Pillar | Goal | Typical visual |
|---|---|---|
| المشاريع — Projects | quality of execution, the story of each project | finished rooms, wide + detail shots |
| الخبرة — Expertise | trust, professionalism | tips/lists over calm rooms; detail close-ups |
| خلف الكواليس — Behind the scenes | the process and care for detail | desk with plans, marble/wood/fabric samples, swatches, site |
| الإلهام — Inspiration | taste and style | styled corners, materials, light |

Project posts tell a story (need → challenge → thinking → why these materials → result),
so carousels often move from sketch/plan to the finished room.
A recurring series **"دقيقة تصميم"** (one design idea per post) may come; keep its slides
visually identical across posts (same layout, same title position) so it's recognisable.

## Colors (sampled from approved posts — use only these)
| Token | Hex | Use |
|---|---|---|
| `--espresso` | `#5E2D0A` | main headline on single/offer posts, brown logo |
| `--walnut` | `#5A4022` | carousel headlines, pills, numbered titles |
| `--copper` | `#A0623F` | kicker line above a title, accent line (e.g. "5 نقاط أساسية"), divider |
| `--rust` | `#9A4628` | list numbers 01 02 03 |
| `--charcoal` | `#3A3836` | body text, subtitles, services line |
| `--linen` / `--cream` / `--sand` | `#F6F1EA` / `#EFE6DA` / `#E2D2C1` | scrims, glass rows, plain backgrounds |
| `--gold` | `#E0C29E` | the beige of the original logo |
| `--offer` | `#E31E24` | **only** the "لفترة محدودة" style time-limited tag |

White is used for the logo and text only on darker photos. No other colors, no gradients on
text, no colored boxes besides the ones in the layouts (white pill, walnut pill, glass rows,
translucent band, red offer tag).

## Typography
| Role | Font | Weight | Size (px @1080) |
|---|---|---|---|
| Headline | Tajawal | 800 | 80–100 (92 default) |
| Kicker (line above headline) | Tajawal | 400 | 64–76, copper |
| Accent line ("5 نقاط أساسية") | Tajawal | 700 | 60–70, copper |
| Numbered slide title ("01 \| وقتك لا يسمح") | Tajawal | 800 | 60–68, walnut |
| Subtitle / body | Tajawal | 400–500 | 40–50 |
| Services line (تصميم داخلي • تنفيذ • …) | Tajawal | 400 | 34–38, copper dots |
| Latin tagline (DESIGN • EXECUTION • DELIVERY) | Open Sans | 400 | 32–36, espresso, slight tracking |
| List numbers 01–05 | Playfair Display | 400 | 56–64, rust |

**Tajawal is Artego's Arabic font (chosen by the user — it replaced Baloo Bhaijaan 2, which the early posts used).** Don't substitute it. Weights available: 300 400 500 700 800 900 (no 600).

## Logo
- Files: `assets/brand/logo-brown.svg` (default on light photos), `logo-white.svg` (on dark
  or warm-dark photos), `logo-original.svg` (black + beige — only on plain light
  backgrounds), all vector, extracted from `ARTEGO_Final_Logo.pdf`.
- Always on every slide, **bottom-center**, 176 px wide by default (140 min — e.g. dense list
  posts; up to 200 on a closing slide). Bottom margin 36–50 px.
- Must be clearly readable: keep a calm area of the photo under it (floor, rug, table top,
  plain wall). **White or brown — whichever is clearer on that photo** (user's rule: the only
  thing that matters is that the logo is clearly visible). `render.mjs` picks the one with the
  higher contrast automatically; leave `data-logo` unset unless the user asks for a color.
- **No halo, glow or shadow behind the logo** (user's rule). If render.mjs warns about low
  contrast, switch color, move the crop, or ask for a photo with a calmer bottom center.
- Never: stretch, rotate, recolor beyond the files, add shadows/outlines/glow, put it in a
  box, place it in a corner, or let text/furniture-cutouts overlap it.

## Don'ts
- No text generated inside the photo (AI text is wrong and off-brand).
- No emojis, stickers, icons packs, arrows (other than the cover's swipe hint), badges
  (other than the offer tag), heavy shadows, outlines, neon or saturated colors.
- No dark, cold, cluttered or cheap-looking interiors; no people's faces (the brand works
  without showing faces); no visible competitor brands.
- No more than 3 text levels per slide (e.g. kicker + headline + body).
