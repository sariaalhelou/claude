# Techniques and gotchas

## How the timeline works
- `render.mjs` loads the page, waits for fonts, then for each frame calls
  `window.__mgSeek(t)` (from `mg.js`): every CSS animation is paused and set to
  `currentTime = t`, and every `MG.onFrame(fn)` callback runs with `t`.
- Therefore **every `animation-delay` is a global time** in seconds from the start of
  the video. Write `animation: rise-in .6s var(--ease-out) 3.4s both` to start at 3.4 s.
- Opening `index.html` in a browser plays it in real time (looping) for preview;
  `?guides` shows the safe zone.
- Duration and size come from `<body data-duration="15" data-width="1080" data-height="1920">`.

## Scenes
```html
<section class="scene" style="--in:3s; --out:7s"> … </section>
```
The scene is `visibility:hidden` outside its window (hard cut). For a soft exit,
animate the content's exit just before `--out` (e.g. `fade-out .35s 6.65s forwards`).
The last scene omits `--out`.

## Multiple animations on one element
```css
.card { animation: rise-in .6s var(--ease-out) 3.2s both,
                   fade-out .35s var(--ease-in) 6.6s forwards; }
```
- Entrance: `both` (hidden before it starts). Exit: `forwards` only — with `both` its
  first keyframe (opacity:1) would apply from t=0 and override the entrance.
- Later animations in the list win when they animate the same property.
- An inline `style="animation:…"` replaces the whole stylesheet `animation` list,
  so repeat the entrance there if you add an exit inline.
- Two animations both using `transform` overwrite each other — put the second one on
  a wrapper element (e.g. float on the image, pop-in on its container).
- Use `calc(var(--t0) + var(--i) * var(--stagger))` for staggered delays.

## Stock keyframes in stage.css
`fade-in/out, rise-in, slide-in/out (RTL), pop-in, blur-in, wipe-in/out (mask from
the right), grow-x (set transform-origin:right for RTL), grow-y, float, spin`.

## JS-driven animation (mg.js)
```js
MG.splitWords(el)                         // words → <span class="w" style="--i:n">
MG.counter(el, { from: 0, to: 179, start: 11.4, dur: 1.2, arabicDigits: true, suffix: "٪" })
MG.onFrame((t) => {                       // anything else, as a pure function of t
  const p = MG.progress(t, 5, 1.5, MG.ease.outExpo);   // 0→1 between 5 s and 6.5 s
  ring.style.strokeDashoffset = MG.lerp(600, 0, p);
});
```
Must be a pure function of `t` — no `setTimeout`, `setInterval`, `Date.now()`,
`Math.random()` at render time (seed randomness once at load if needed), and no
CSS `transition`s (they don't seek). Otherwise frames differ between preview and render.

## SVG line drawing
```css
path.draw { stroke-dasharray: 1000; stroke-dashoffset: 1000;
            animation: draw 1.2s var(--ease-out) 2s forwards; }
@keyframes draw { to { stroke-dashoffset: 0 } }
```
(set 1000 ≥ path length; `pathLength="1000"` on the path makes it exact).

## Images and video in the page
- Images: put files in the project folder, reference relatively (`product.png`).
  Prefer transparent PNG/WebP for products, SVG for logos.
- Background footage: `<video src="bg.mp4" muted>` does not seek reliably. Extract
  frames instead: `ffmpeg -i bg.mp4 -vf fps=30 bg/%04d.jpg` and swap an `<img>` src
  in `MG.onFrame` (`Math.floor(t*30)+1`), or composite afterwards with ffmpeg.
- Heavy `filter: blur()` on large layers slows rendering; blur small elements or bake
  blurred backgrounds into an image.

## Audio
`--audio music.mp3` muxes a track (fade-in 0.3 s, fade-out over the last 1.5 s,
trimmed to the video). Only use music the user supplies or has rights to. For a
voice-over, ask for the recording and time scenes to it (`ffprobe` for its duration).
Reels are mostly watched muted, so the video must work without sound.

## Other formats
Set `data-width` / `data-height` on `<body>` and override the stage size:
`html, body { width:1080px; height:1080px }` for 1:1 (no Reels safe zone needed,
keep 72 px margins), `1920×1080` for 16:9. Recheck layouts with stills — they are
designed for 9:16.

## Troubleshooting
| Symptom | Cause |
|---|---|
| Letters disconnected | per-letter spans or letter-spacing |
| Element visible at t=0 before its entrance | entrance lacks `both`, or an exit uses `both` |
| Element never appears | exit with `both` overriding; or inline `animation` replaced the entrance |
| Preview fine, render wrong | time-dependent JS not in `MG.onFrame`, or CSS transitions |
| "fonts used but not loaded" | family name/weight not in fonts.css |
| Tops of letters cut off | clip/overflow without vertical slack, line-height too small |
