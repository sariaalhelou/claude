# Motion design for Reels

## Reading time
Viewers must finish reading before a card leaves. Hold each text card for at least
**0.4 s × words + 1 s** after its last word lands (a 6-word headline ≈ 3.4 s). Big
numbers and logos: ≥ 1.5 s still. When the copy doesn't fit the duration, cut copy
before speeding up the motion.

## Timing building blocks
| Move | Duration | Easing |
|---|---|---|
| Entrance (rise, slide, pop) | 0.5–0.8 s | `--ease-out` (expo out) — fast start, soft landing |
| Exit | 0.3–0.45 s | `--ease-in` — exits are quicker than entrances |
| Word stagger | 60–100 ms (`--stagger`) | — |
| Scene-to-scene gap | 0–0.15 s | overlap the next entrance with the exit when possible |
| Counters | 1–1.5 s | expo out (built into `MG.counter`) |
| Ambient (float, drift, slow zoom) | 3–6 s loops | ease-in-out |

Linear easing only for continuous motion (spinning, scrolling tickers).
`--ease-pop` (overshoot) for playful elements: prices, badges, buttons, logos — not
for body text.

## Direction
Arabic reads right → left, so motion that "progresses" should too: enter from the
right (`slide-in` moves +x → 0), wipes reveal from the right edge, bars and lines
grow from the right, timelines advance leftward. Vertical motion (rise-in) is
direction-neutral and the safest default for text.

## Reels structure (15 s default)
1. **Hook 0–3 s** — a question, a bold number, or a pain point. On screen by 0.3 s.
2. **Body 3–11 s** — 2–3 scenes, one idea each.
3. **Payoff / CTA 11–15 s** — offer, logo, handle, "الرابط في البايو". Hold it.
Loopable endings help: last frame visually close to the first one.

## Safe zone (1080×1920)
Instagram overlays the top ~220 px, the bottom ~420 px and the right ~150 px of the
lower half (like/comment/share). Keep text and logos inside `.safe`
(top 220, bottom 420, sides 72). Backgrounds and decoration can bleed everywhere.
For RTL text this matters doubly: right-aligned text in the lower half collides with
the button column — keep lower-half text centered or within the safe box.

## Recipes by video type

**Product ad** (`product-ad`, 15 s): hook (pain/question) → product reveal (blur-in,
float, accent ring, name) → 3 benefits (icon cards sliding in, 0.45 s apart) → price
(old price struck through, new price counts down, pop) + CTA button pulsing.
Product photos: transparent PNG, centered, large (≥ 60% width), a soft shadow or
colored glow behind to separate it from the background.

**Kinetic typography** (`kinetic-text`, 10–15 s): one sentence per card, words rise
in staggered, one highlighted keyword per card (marker swipe behind it), cards exit
sideways; ends on logo + handle. Vary the entrance per card so it doesn't feel looped,
but keep the same easing.

**Explainer / infographic** (`explainer`, 15–25 s): question → hero number (counter)
→ chart (bars grow, values fade in after) → steps (numbered circles, connector line
draws) → takeaway box + source line. Data in the `DATA` object; always show a source
for real statistics, and never invent statistics — use the user's numbers or mark
them as examples.

**Logo intro / sting** (`logo-intro`, 4–7 s): shapes in brand colors converge →
impact burst → logo pops in → light sweep → name wipes in from the right → tagline.
Hold the final frame ≥ 2 s. Keep it short: it precedes other content.

## Polish checklist
- Background never flat-static: slow gradient drift, floating orbs, subtle grain.
- Consistent corner radius and stroke width throughout.
- No more than 3 colors on screen at once (from the brand palette).
- Every element has an exit or is covered by the next scene — nothing just vanishes
  on the scene cut unless it's intentional (hard cuts on the beat are fine).
