# Authoring scenes for The Fixed Frontier

The film is a Remotion project. Narration is final: `src/narration/script.ts`
holds every passage, `public/narration/*.mp3` the ElevenLabs takes, and
`src/data/timing.json` the time of every spoken word. Scenes illustrate the
narration; they never change it.

## How a scene works

- A scene is a React component registered by its scene id (from `script.ts`)
  in the `scenes` object of its chapter file, `src/scenes/<chapter>.tsx`.
- The scene's length is set by its narration. Inside a scene, `useCues()`
  gives `frame` (current frame in the scene), `frames` (scene length),
  `start(passageId)`, `end(passageId)` and `cue(passageId, phrase)`, which is
  the frame where that phrase is spoken. Cue every reveal to a phrase; never
  to a hard-coded time. A phrase that is not in the passage throws, by design.
  Phrases are matched word by word, ignoring case and punctuation
  (`'six-fold symmetry'` matches "six-fold symmetry,").
- Motion helpers are in `src/design/motion.ts`: `progress(frame, start, dur?, ease?)`
  returns 0→1, `window(frame, start, end)` rises then falls, `exposeStyle(p)`
  is the film's reveal. Durations are multiples of `beat` (12 frames).
- The field (background, grain, vignette) and the dissolves between scenes are
  drawn by `Film.tsx`. A scene draws only its content, on a transparent layer.

## The mood board is the law

Read `moodboard/moodboard.html` (published at
https://claude.ai/artifact/9417qmhoj2G9TfLoKFrBFs). In code:

- Colors only from `color` / `alpha()` in `src/design/tokens.ts`. Roles never
  change: **gilt** = the frontier, the claim, the target sum; **verdigris** =
  arithmetic (primes, characters, Möbius signs, computed arithmetic data);
  **ember** = obstruction (poles, contradictions, error terms, debts);
  **paper** = primary ink; **mist** = secondary ink. Never use gilt to decorate.
- Type only through `Display` (Bodoni: titles, big numbers), `Text` (Plex:
  everything read), `Tex` (all mathematics), `Fraction` (the story's
  fractions 11/12, 7/8, 1/2 when shown large). Sizes from `size`.
  No plain-text exponents like `D^(5/6)` anywhere; use `Tex`.
- `Tex` macros: `\gilt{}`, `\verd{}`, `\ember{}`, `\mist{}`, `\N`, `\Re`, `\OO`,
  `\nn`, `\pp`, `\cH`. Tag parts with `\htmlClass{name}{...}` and light them
  with the `light` prop, cued to the narration.
- Layout: 128 px margins. One title per scene via `SceneTitle` (top-left).
  The bottom band (y > 960) is reserved for `SceneLocator` (left; every scene
  in a numbered chapter renders it) and `Cite` (right). Nothing else goes there.
- No boxes, cards, rounded panels, drop shadows or icons. Structure comes from
  lines, stations, rules, hatching and alignment.
- Every figure that is not exact says what it is with `Tag`:
  `computed` (from real numbers), `schematic` (illustrative), `claim`
  (a manuscript claim). Every statement attributed to a manuscript gets a
  `Cite` with paper and place, e.g. "October manuscript, Proposition 3.1".
- Hatching marks zero-free territory: mist hatch = proven classically,
  gilt hatch = claimed by the manuscripts.
- `npm run lint:design` must pass (`node scripts/lint-design.mjs`).

## Reuse before inventing

Existing pieces: `StripMap` (the critical strip map), `Topo` (contours of
log|ζ|), `ProofMap`, `Signs` (Möbius marks), `PhaseWheel` (sixth roots),
`Family` (schematic bars for the family of sums), `Lattice` (Eisenstein
integers), `MobiusWalk` (Mertens function), plus `SceneTitle`, `Callout`, `At`,
`seeded` in `src/design/scene.tsx`. Look at `src/scenes/open.tsx` and
`src/scenes/moves.tsx` for the house style.

Do not edit shared files (`src/design/*`, existing `src/diagrams/*`,
`timeline.ts`, `cues.tsx`, `Film.tsx`, `narration/*`, `scenes/index.ts`). If you
need a new diagram, add a new file in `src/diagrams/` named for your chapter
(for example `GaussWalk.tsx`). If a shared component needs a change, make a
local variant and say so in your report.

## Accuracy

- Every number shown comes from the manuscripts (LaTeX sources in
  `/Users/utpalrohan/math/preprints/The-Quasi-Riemann-Hypothesis-*/build/*.tex`)
  or is computed in code you can point to (`src/data/numerics.json`, or a
  computation inside your diagram file). Do not type values from memory.
- Schematic pictures are tagged schematic. Hypothetical zeros (for example in
  a proof by contradiction) are drawn in ember and labelled as supposed.
- Use the notation of the papers: `A_u(D)`, `\chi_{\nn}(u)`, `H=D^{1+\vartheta}`,
  `\cH`, `B_h(X)`, `T_h(X)`, `P_h(X)`, `\beta_*`, `\sigma_0`, `C(s)`.

## Checking your work

```
npx tsc --noEmit
node scripts/lint-design.mjs
node scripts/contact.mjs --out out/contact-<you> <scene ids...>
node scripts/contact.mjs --out out/contact-<you> --at <scene>:0.1,0.4,0.7,0.95
```

Look at every sheet (Read the jpg). Check: nothing overlaps; nothing crosses the
margins or the bottom band; text is legible at 1080p; each reveal happens on
the word that names it; the frame is never empty for more than about a second
at the start of a scene; the last third of each scene still has something to
look at.
