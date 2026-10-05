# Brand identity — Tartip (ترتيب)

Source: the Tartip brand guide (دليل الهوية البصرية). Everything here is already
wired into `assets/brand.css` and `assets/brand/`; follow it in every video.

## Who
Tartip is a digital-marketing agency. Content is mostly practical marketing tips,
service promotion, and results/case studies for small businesses.
- Instagram: `tartipagency` · Phone (only when a contact line is asked for): +90 505 983 33 48

## Colors — the only approved palette
| Name | Hex | Use |
|---|---|---|
| Brand Gradient | Signal Blue → Growth Cyan, 135° (`--brand-gradient`) | badges, buttons, hero shapes, gradient headlines |
| Growth Cyan | #17C3B2 (`--brand-secondary`) | accents, highlights, the "tip" in the logo, 3rd step |
| Signal Blue | #2F6FED (`--brand-primary`) | key numbers, bars, 2nd step |
| Royal Blue | #224087 (`--brand-dark`) | navy backgrounds, headline text on light, 1st step |
| Ice | #EEF2FC (`--brand-light`) | light backgrounds |
Plus white for cards and text on navy. No other hues (no reds, yellows, greens) —
if something needs "warning" or "old price" styling use muted/strike-through, not red.

Two themes, matching the brand's reel covers:
- **Navy** (default): Royal Blue background, white text, gradient headline from white → light blue → cyan.
- **Light**: `<body class="theme-light">`, Ice background, Royal Blue text, gradient headline navy → blue → cyan.
Alternate them between videos for variety; within a video stay in one theme
(a full-screen gradient or light card can be used as a scene accent).

## Typography
- Arabic: **Tajawal** for everything (headlines 800–900, body 400–500, labels 700).
- Latin (handle, English words, the brand name in Latin): **Space Grotesk**.
- Digits: **Eastern Arabic** (١٢٣) in Arabic copy, as in the brand templates.
  Latin-only lines (handle, phone) keep Western digits.

## Logo
Files in `assets/brand/` (copied into every project):
- `logo-dark-bg.png` — white "Tar" + gradient "tip", for navy/gradient backgrounds
- `logo-light-bg.png` — navy "Tar" + gradient "tip", for Ice/white backgrounds
- `icon.svg` — app icon (gradient square, three white bars); `icon-mono.svg` — the
  three bars in `currentColor` (use for small marks, favicon-like details)

Rules from the guide:
- Clear space on every side ≥ the height of the "T"; no text or elements inside it.
- **Never** rotate it, stretch/squash it, recolor it outside the palette, or place
  it on unapproved colors / low-contrast backgrounds. Animate the logo only with
  opacity, uniform scale, blur, masks/wipes or position — no rotation, skew or color shifts.
- Typical placements: top-right corner of a cover (≈ 90–110 px tall), centered on the
  end card (≈ 120–160 px tall), small in a footer (≈ 70–84 px).

## Signature elements (components in brand.css)
- `.brand-badge` — gradient pill with an emoji, e.g. "💡 نصيحة تسويقية" (top of tip videos).
- `.brand-gradient-text` — gradient headline; usually on the key phrase only
  (e.g. "٣ خطوات تحوّل" in gradient, the rest in solid color).
- `.brand-card` + `.brand-num` — white rounded cards with numbered circles (navy, blue, cyan).
- `.brand-stripes` — three diagonal rounded stripes, low-contrast, bottom-left.
- `.brand-glow` — soft radial glow in a top corner.
- `.brand-handle` — Instagram icon + `tartipagency`.
- Typical layout (from the reel cover): logo top-right, badge top-left, small kicker
  line above a 2-line headline, one-line subtitle, then cards; stripes and a footer
  (handle + logo) at the bottom.

## Voice
- Friendly, practical, confident — an expert friend giving actionable advice.
- Light colloquial (white dialect, Levantine/Gulf-friendly): "اعرف مين اللي بيحتاج
  منتجك"، "مش مع الكم فقط"، "إيش الخطوة الجاية". Mix with simple MSA for headlines.
  Keep one register per video.
- Favorite structures: "٣ خطوات…"، "نصيحة تسويقية"، numbered tips with a bold
  lead phrase + an em-dash explanation (**حدد جمهورك بدقة** — اعرف مين…).
- Typical CTAs: "تابعنا لنصائح أكثر"، "احفظ الفيديو"، "تواصل معنا"، "الرابط في البايو".

## Motion personality
Clean, confident, modern: smooth expo-out entrances, short exits, small overshoot
only on badges/buttons/numbers, gradient sweeps and wipes from the right, cards
sliding in from the right one after another. No shakes, glitches or playful bounces
on body text.
