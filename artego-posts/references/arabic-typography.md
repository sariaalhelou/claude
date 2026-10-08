# Arabic typography

Arabic is connected and right-to-left; letters change shape with their neighbours.

- **Never split a word into separate elements** (per-letter `<span>`s break the joining:
  كلمة → ك ل م ة). Style whole words (`<span class="b">5 علامات</span>`).
- **No letter-spacing** on Arabic (it breaks joins and ligatures like لا). Letter-spacing is
  only for the Latin tagline (`.en-tag`). For emphasis use weight (800) or the brand
  colors; the approved posts sometimes stretch a word with tatweel (بنفسـك) — only if the
  user's text has it.
- `<html lang="ar" dir="rtl">` (layouts already set it). Center or right-align as the layout does.
- Latin inside Arabic lines (Artego, phone numbers, emails, www): wrap in `<bdi>` so
  punctuation doesn't jump: `لهذا صُممت تجربة <bdi>Artego</bdi>.` Phone numbers in `.contact`
  are already LTR.
- Arabic punctuation: ، ؛ ؟ and the ellipsis "..." as the user wrote it.
- Western digits (1 2 3, 10%, 01–05), as in all approved posts. If the user's text uses ١٢٣,
  keep it and ask once whether to convert.
- Leave vertical room: Arabic has tall ascenders and deep descenders (ي ن ع ق). Line-height
  ≥ 1.2 for headlines, ≥ 1.45 for body; pills/boxes need extra bottom padding (the layouts
  have it) — check in the PNG that no dot or tail is clipped.
- Break lines **by meaning**, with `<br>`, not by width: "هل تدير مشروعك / بنفسك؟".
  A headline that runs edge to edge looks cramped — keep air on both sides.
- Keep the user's spelling, diacritics (صمّم, صُممت), hamzas and dialect exactly.
