# Arabic typography on screen

Arabic is a connected, right-to-left script whose letters change shape with their
neighbours. Most "broken Arabic" in motion graphics comes from effects designed for
Latin text. These rules exist to avoid that.

## Never split words into letters
Wrapping each letter in its own `<span>` breaks the joining: the browser shapes each
span on its own, so كلمة renders as ك ل م ة. Animate **whole words** (`MG.splitWords`)
or reveal a whole line with a mask (`wipe-in`, `clip-path`) for a "typing" / letter-by-
letter feeling. If a true per-letter effect is required, render the word whole and
animate a mask or gradient across it.

## No letter-spacing
`letter-spacing` on Arabic inserts gaps between joined letters and disables the
font's ligatures (لا, الله). Keep it at 0. To stretch a word for emphasis, use the
tatweel/kashida character `ـ` sparingly (جـمـيـل) — or simply a bigger weight.

## Direction and alignment
- `<html lang="ar" dir="rtl">` (templates already do this). Text aligns right.
- Latin handles, URLs, prices with Latin currency, English brand names: wrap in
  `<bdi>` (or `.ltr`) so they don't jumble punctuation: `<bdi>@brand</bdi>`.
- Mixed numbers + Arabic in one line are fine; ranges (١٨–٢٤) read right to left.
- Punctuation: use Arabic ، ؛ ؟ — not , ; ?

## Glyph height — leave room
Arabic has tall ascenders (ا ل ك, hamza, shadda, dots) and deep descenders (ي ن ع ق).
- `line-height` ≥ 1.35 for display text, 1.5–1.7 for body.
- Anything that clips (masks, `overflow:hidden`, `clip-path`) needs vertical slack —
  the stage keyframes use `inset(-20% …)` for that reason.
- Highlight boxes behind a word must cover the full glyph height (top of alef to the
  bottom of ي); check them in a still, they're the most common clipping bug.

## Digits
Choose once per video and stay consistent (see `--digits` in brand.css):
- Eastern Arabic ٠١٢٣٤٥٦٧٨٩ — common in Gulf/Egypt marketing, feels native.
- Western 0123456789 — common in Maghreb, tech, prices next to Latin.
`MG.formatNumber(n, { arabicDigits: true, decimals: 1 })` produces either form with
the right separators (٥٫٤ / 5.4). Animated counters use the same option.

## Fonts (bundled in `assets/fonts`, all OFL)
| Font | Weights | Character | Use for |
|---|---|---|---|
| Cairo | 400 700 900 | modern, geometric, very legible | default display & numbers |
| Tajawal | 400 700 900 | clean, friendly | default body |
| Almarai | 400 700 800 | rounded, Saudi-modern | body, friendly brands |
| IBM Plex Sans Arabic | 400 700 | corporate, technical | explainers, B2B |
| Noto Kufi Arabic | 400 700 900 | Kufi, structured | headlines, formal |
| Changa | 400 700 800 | condensed, sporty | punchy headlines |
| Reem Kufi | 400 700 | geometric Kufi, elegant | logos, luxury |
| Lalezar | 400 (heavy) | bold display, playful | big hooks, sales |

One display + one body font per video. Only weights listed are available — a missing
weight falls back to faux-bold. The renderer warns when a font fails to load; a
fallback system font makes the whole video look cheap, so fix it before delivering.
A brand font not in this list: put its .ttf/.woff2 in `assets/fonts/` and add an
`@font-face` line to `assets/fonts/fonts.css`.

## Copywriting for the screen
- Short words, short lines: 2–4 words per line, ≤ 3 lines per card.
- Prefer Modern Standard Arabic unless brand.md sets a dialect (Gulf, Egyptian,
  Levantine…); never mix dialects in one video.
- Break lines by meaning, not by width — control breaks with `<br>` in headlines.
- Diacritics (tashkeel) only where they prevent misreading (تُنسى) — they add height
  and noise at small sizes.
