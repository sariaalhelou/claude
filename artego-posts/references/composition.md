# Composition — balancing text and design

Format: Instagram portrait **4:5 = 1080×1350 px**. Instagram's grid preview crops to the
center 1080×1080 (top/bottom ~135 px hidden) — keep the headline's first line below y≈140
on covers so it shows in the grid.

## The balance rule
The room is the hero; the text is a calm caption on it.
- **Text block**: ~25–40% of the slide height, normally the **top** of the frame (the
  approved posts all do this), over the calm part of the photo (wall, ceiling, window light).
- **Design zone**: the remaining 55–70% shows furniture, materials, light — uncovered.
  Never put text on the hero piece (sofa, kitchen island, feature wall, the key/sample being
  talked about).
- **Logo zone**: bottom ~230 px center (`?guides` shows it hatched). No text there.
- **Safe area**: x 60 → 1020, y ≥ 50 (render.mjs warns outside it). Keep ~80 px side
  margins for text blocks (`.zone` already does).
- Light a path for reading: use a scrim, never a solid box. `scrim top` (cream gradient)
  is the default; raise `--a` (opacity) or `--h` (height) until text reads; for a dark
  photo use white text (`.title.light`, `.sub.light`) with a `scrim bottom`-style darkening
  at the top instead, or pick a lighter crop.

## One text block — and size the photo to the text BEFORE generating it
Lesson from the first offer post: scattering text into 3 zones (top + a side column + above
the logo) to fit a long text broke Artego's look and covered the furniture. Rules:
- Keep **one centered text block** at the top (plus, at most, one small element like the
  offer tag or a contact chip). No side columns, no text over furniture.
- Count the text before writing the image prompt. Rough budget per 4:5 slide: kicker +
  2-line headline + 1–2 short lines + one tag/chip. More than that → **carousel** (split by
  meaning) — propose it to the user rather than shrinking or scattering text.
- Then write the prompt for that budget: say how much of the frame must be empty
  (e.g. "the upper 45% is an empty plain wall and ceiling"), keep the furniture in the lower
  half, symmetric/centered composition, and nothing at bottom-center (logo).

## Layouts (`assets/layouts/`)
| Layout | Use for | Structure |
|---|---|---|
| `single` | a brand promise, service statement, one idea | headline (+ subtitle) (+ services / Latin tagline) at top; room below |
| `list` | "N points / steps / mistakes" in one image | kicker → headline → divider → accent line → small line → 3–6 glass rows → closing line; photo with a calm center wall and decor on both sides |
| `offer` | discount / limited offer | offer line → headline → subtitle → services; red tag mid-frame on a calm area; room below |
| `carousel` | 3–10 slides | cover → point slides → closing |

### Carousel structure (as in Artego's approved carousel)
1. **Cover**: walnut headline (question / hook, 2 lines) + translucent `band` with the
   promise line (bold number + regular text) + white `pill` with the topic (e.g. "تصميم
   داخلي") + `swipe` hint at the right edge (circle arrow + "اسحب").
2. **Point slides**: `num-title` "01 | title" at top (number, thin bar, title), body 2–3
   lines under it, centered; the rest is the room.
3. **Closing**: brand line ("لهذا صُممت تجربة Artego.") / walnut pill with services /
   short stacked lines / contact chip with the phone — **only what the user's text contains**.
- The whole carousel uses **one visual world**: the same apartment from different angles
  and distances (wide → medium → detail), same light and palette. Change the angle per slide so
  it doesn't look repeated, and match the photo to the point (point about lighting → shot
  where lighting is visible).
- Same text position on every point slide (top 70 px) so swiping feels steady.
- Optional seamless panorama: one wide image spread over N slides
  (`<img class="photo pano" style="--n:5;--i:0">`, i = 0,1,2… from the left). Instagram
  always brings the next slide in from the right, so the panorama reads left → right.

## Sizes
- Headline 80–100 px (2 lines max on covers; break by meaning with `<br>`).
- Body ≥ 40 px (44 on point slides), max ~3 lines; 30–34 px only for very small labels.
- Line-height: headlines 1.2–1.25; body 1.45–1.55.
- One headline per slide. If the user's text for a slide is long, ask before shrinking
  below 40 px or splitting it across two slides.

## Tuning in HTML (no new styles needed)
- Photo crop: `style="--pos: 50% 70%; --zoom: 1.08"` on `img.photo`.
- Text position: `.zone.top` with `--top`; sizes with `--fs` on any text class.
- Scrim: `<div class="scrim top" style="--h:44%; --a:.9">`, `scrim top warm`,
  `scrim full` (whole-frame veil, light), `scrim bottom` (dark, for white text/logo).
- Logo: `--logo-w`, `--logo-bottom` on the slide; `data-logo="brown|white|original"` to force.
- A slide without a photo (rare, e.g. plain cream quote card): add class `no-photo`.
