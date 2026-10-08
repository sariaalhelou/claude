# Imagery — realistic photos that carry the design

Artego posts are photo-led: real-looking, high-end interior photography. The photo must
(1) show the design/furniture beautifully, (2) leave a calm area for the text (top by
default), (3) leave a calm patch bottom-center for the logo, and (4) relate to the text.

## Sources, in order
1. **The user's / Artego's own project photos** — always preferred (real work builds trust).
   Check resolution (≥ 1080×1350 after crop; render.mjs warns), straight verticals, light.
   If a good photo lacks room for text at the top, extend it (outpainting, e.g. Higgsfield
   `outpaint_image` / FLUX outpaint, `expand_top`) rather than covering the design.
2. **Generated photos** with the image tool in the session (e.g. Higgsfield `generate_image`).
   Use a photoreal model that supports **4:5** and **reference images** — check with
   `models_explore` (`recommend`, then `get` for aspect ratios and media roles). Good fits at
   the time of writing: `nano_banana_2_1`, `flux_3_image`, `gpt_image_2_5`. Ask for 2k
   resolution when available. Preflight cost with `get_cost: true` when credits are tight, and
   tell the user if there are no credits instead of silently skipping images.
3. No tool / no credits / no photos → ask the user for photos. Don't use flat backgrounds
   or random stock as a substitute.

## Artego photo style (brand strategy: natural lighting, neutral colors, clean composition, cinematic)
- Warm natural daylight from large windows, soft shadows, golden-hour warmth; recessed
  warm LED lines in shelves and ceilings.
- Palette: cream, ivory, beige, sand, greige, warm oak/walnut wood, travertine and beige
  marble, bouclé and linen, brushed brass/gold accents, olive greens (olive trees, dried
  branches), terracotta touches.
- Pieces: curved bouclé sofas, round travertine/oak coffee tables, vertical wood slats
  (fluted panels), arches and niches, sheer curtains, ceramic vases, stacked books, soft rugs.
- Composition: eye-level or slightly elevated, straight verticals, symmetrical or calm
  rule-of-thirds, uncluttered, depth with soft foreground blur (plants) when it helps.
- Signature concepts from approved posts — use them when they fit the message:
  - **sketch → reality**: architectural pencil drawing/blueprint turning into the finished
    photoreal room (paper page-curl, or half wireframe half real) — for planning/execution/"from
    idea to result" messages.
  - **the key**: a golden ornate key in front of a finished villa/room — for turnkey delivery.
  - **material flat-lay / design desk**: marble, wood and fabric samples, swatches, plans,
    pencils — for materials, behind-the-scenes, decisions.
- Never: people's faces (hands of a designer at a desk are fine), dark or cold interiors,
  clutter, kitsch, logos/brands, readable text on books, signs or screens.

## Prompt recipe
Write prompts in English. Structure:

```
[shot type + subject that matches the slide's message], [key furniture/materials],
[light], [palette], [composition + where the empty space is], [camera/quality], [negatives]
```

Always include:
- `vertical 4:5 composition` (and pass aspect ratio 4:5)
- `the upper third of the frame is a calm, softly lit, uncluttered area (plain wall / ceiling /
  sheer curtains) with nothing important in it` — the text goes there
- `calm, uncluttered floor or table-top area at the bottom center` — the logo goes there
- `no text, no letters, no logos, no watermark, books with blank spines`
- `photorealistic interior photography, natural daylight, shot on a full-frame camera, 24–35mm,
  high dynamic range, sharp details, straight verticals`

Example (living room, point "the details are many"):
```
Photorealistic luxury living room interior, cream curved bouclé sofa, round travertine coffee
table with a ceramic bowl and a small olive branch, fluted warm-oak wall panels with hidden warm
LED strips, sheer linen curtains, soft late-afternoon daylight, warm neutral palette of ivory,
beige, oak and olive green, eye-level vertical 4:5 composition, the upper third is a calm softly
lit plain wall with nothing in it, calm rug area at the bottom center, interior design magazine
photography, full-frame camera 28mm, straight verticals, high detail, no text, no letters, no
logos, no watermark, books with blank spines, no people
```

Example (materials / behind the scenes):
```
Top-down-angled close-up of an interior designer's desk: beige and white marble samples, oak
veneer swatches, linen and bouclé fabric samples, a printed floor plan with pencil lines, brass
pen, a ceramic cup with pencils, soft natural window light from the left, warm neutral palette,
vertical 4:5 composition, the upper third is a calm out-of-focus cream wall, calm table surface
at the bottom center, editorial product photography, shallow depth of field, no text or numbers
readable on the plan, no logos, no people's faces
```

## Carousel consistency
- Generate the **cover image first** and approve it visually. Then generate each next slide
  with that image as a **reference** (`medias: [{ value: <job_id>, role: "image_references" }]`
  or the role the model lists) and a prompt like: `same apartment, same furniture, materials
  and light as the reference, new camera angle: [wide view of the dining area / close-up of the
  coffee table / the reading corner]`, plus the usual empty-space and no-text lines.
- Vary distance and angle (wide → medium → detail) slide to slide; keep palette and light the same.
- Use `generate_image_batch` for several independent slide images at once, then `jobs_wait`.
- Panorama option: generate one wide image (e.g. 21:9 or by outpainting sideways) and spread it
  with `.photo.pano` — check that seams don't cut a piece of furniture in half at a slide edge.

## Checking a generated photo (look at it every time)
Reject and regenerate if you see: warped or melting furniture, extra/missing legs, impossible
geometry, crooked verticals, garbled text on books/screens/signs, distorted plants, plastic-looking
surfaces, oversaturated color, a busy area exactly where the text or logo goes, or anything that
contradicts the slide's message. Fix small problems with crop/zoom (`--pos`, `--zoom`) first;
upscale (e.g. `upscale_image`) if the file is under 1080×1350.

## Saving
Download results into `<post-dir>/photos/01.jpg, 02.jpg …` (one per slide, or the same file
reused with different crops). Keep the generation job IDs in a comment in `index.html` so a slide
can be regenerated or used as a reference later.
