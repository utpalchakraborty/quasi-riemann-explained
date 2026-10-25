# Authoring scenes for The Energy Budget

The film is a Remotion project, the second in the series after *The Fixed
Frontier* (`../studio/`). Its structure comes from `../briefs/energy-budget.md`;
read the card for your chapter there before you start. Narration is final:
`src/narration/script.ts` holds every passage, `public/narration/*.mp3` the
ElevenLabs takes, and `src/data/timing.json` the time of every spoken word.
Scenes illustrate the narration; they never change it.

## How a scene works

- A scene is a React component registered by its scene id (from `script.ts`)
  in the `scenes` object of its chapter file, `src/scenes/<chapter>.tsx`.
- The scene's length is set by its narration. Inside a scene, `useCues()`
  gives `frame` (current frame in the scene), `frames` (scene length),
  `start(passageId)`, `end(passageId)` and `cue(passageId, phrase)`, which is
  the frame where that phrase is spoken. Cue every reveal to a phrase; never
  to a hard-coded time. A phrase that is not in the passage throws, by design.
  Phrases are matched word by word, ignoring case and punctuation.
- Motion helpers are in `src/design/motion.ts`: `progress(frame, start, dur?, ease?)`
  returns 0→1, `window(frame, start, end)` rises then falls, `exposeStyle(p)`
  is the film's reveal ("inked in"). Durations are multiples of `beat` (12 frames).
- The page (background, grain, vignette) and the dissolves between scenes are
  drawn by `Film.tsx`. A scene draws only its content, on a transparent layer.

## The mood board is the law

Read `moodboard/moodboard.html` (published at
https://claude.ai/artifact/H5rcM1AKfMCjKKTfhTZLPG) and look at the frames in
`moodboard/frames/`. In code:

- Colors only from `color` / `alpha()` in `src/design/tokens.ts`. The film is
  dark ink on buff paper. Roles never change: **cobalt** = the target A₁(D), the
  claim, the budget line; **viridian** = arithmetic (primes, characters, Gauss
  sums, Möbius signs, phases); **vermilion** = debt and obstruction (error
  terms, borrowed cube terms, overspend); **ink** = primary ink and geometry,
  the squares of an energy; **pencil** = axes, ledger rules, captions. Never use
  cobalt to decorate. `ground`/`groundDeep`/`groundLift` are paper, for fills
  that must hide what is under them (a hollow dot is `fill={color.ground}`).
- Type only through `Display` (Bodoni: titles, big numbers), `Text` (Plex:
  everything read), `Tex` (all mathematics), `Fraction` (11/12 when shown large),
  `MixedLine` (Plex words with inline math). Sizes from `size`. No plain-text
  math like `D^(5/6)` or `A_u(D)` anywhere; use `Tex` or `MixedLine`.
- `Tex` macros: `\target{}` (cobalt), `\arith{}` (viridian), `\debt{}`
  (vermilion), `\aside{}` (pencil), `\N`, `\Re`, `\OO`, `\nn`, `\pp`, `\cH`.
  Tag parts with `\htmlClass{name}{...}` and light them with the `light` prop
  or fade them with `show`, cued to the narration.
- Layout: 128 px margins. One title per scene via `SceneTitle` (top-left, y≈84).
  The bottom band (y > 960) is reserved for `SceneLocator` (left; every scene
  in a numbered chapter renders it) and `Cite` (right). Nothing else goes there.
- No boxes, cards, rounded panels, drop shadows or icons. Structure comes from
  rules, alignment, frames (which always mean a budget) and hatching (which
  always means area).
- Every figure that is not exact says what it is with `Tag`:
  `computed` (from real numbers), `schematic` (illustrative), `claim`
  (a manuscript claim). Every statement attributed to a manuscript gets a
  `Cite` with paper and place, e.g. "October manuscript, Proposition 3.1".
- `node scripts/lint-design.mjs` must pass.

## The energy grammar (src/diagrams/Area.tsx and friends)

Energy is area. A number of size s is a `Square` of side s; an energy is the
total area of its squares; a budget is a `Frame` (bold outline) they must fit
inside. Hatching (`useHatch(ink, 'light' | 'medium' | 'dense')`) fills area;
density, never a new colour, carries magnitude. Stroke weights in order:
ledger rule `stroke.hair`, square outline `stroke.line`, frame `stroke.bold`,
budget line `stroke.budget`.

Shared pieces, ready to use:

- `Area.tsx`: `Square`, `Frame`, `useHatch`, `shelfPack` (lay squares out in
  rows), `AreaColumn` (squares "poured" area for area into a budget frame).
- `Ledger.tsx`: the ledger motif. Rows of `{label: Part[], amount?: TeX,
  note?: words, kind: 'entry'|'budget'|'debt'|'payment'|'total'|'note', p,
  strike, light}`. Totals get the double rule; debts are vermilion.
- `FamilyField.tsx`: the real family A_u(D) at D = 2000 (15,528 rows, 847
  columns), every row a square of side |A_u(D)| on its lattice point; `FAMILY`
  has the summary numbers. `WalkPlot.tsx`: the computed ±1 walks; `WALKS`.
- `ExponentDial.tsx`: e(k) = ½(1 + (1+ϑ)(1 − 1/k)) on a half-circle dial.
- From the first film (recoloured): `Energy.tsx` (`EnergyRect`: rows × columns
  rectangle anchored bottom-left; `Bracket`; `BraceFade`), `EnergyBars`,
  `BudgetSplit`, `Family`, `GaussWalk`, `IndexRow` (squarefree indices and the
  inserted cubes), `Lattice`, `LatticeField`, `EisArith`, `MobiusWalk`
  (computed Mertens to 1200), `NormAnnulus`, `NormLadder`, `PhaseWheel`,
  `RootWheel`, `PoissonDisks`, `SievePlot`, `SignMarks`, `Signs`,
  `ThetaSlider`, `UpperHalfSpace`, `WaveSizes`, `MixedLine`.
  Read a file's header comment before using it.

Do not edit shared files (`src/design/*`, the diagrams listed above,
`timeline.ts`, `cues.tsx`, `Film.tsx`, `Root.tsx`, `narration/*`,
`scenes/index.ts`, `moodboard/*`, `data/*`). New diagrams go in new files in
`src/diagrams/`, named for your chapter (e.g. `SpendLedger.tsx`). If a shared
component needs a change, make a local variant and say so in your report.

## Numbers

Every number shown comes from the manuscripts (LaTeX sources in
`/Users/utpalrohan/math/preprints/The-Quasi-Riemann-Hypothesis-*/build/*.tex`)
or is computed in code you can point to: `src/data/numerics.json` (written by
`scripts/compute_data.py`; keys `walks`, `mobius`, `mertens`, `family`,
`copies`, `gauss`, `exponents`, `sieve`, `schedule`) or a computation inside
your diagram file. Do not type values from memory. When the narration states
a computed number, assert it in code so a change fails the render.

## Citations (checked against the LaTeX)

October manuscript numbering: §2.1–§2.5 are Steps 1–5 of the outline. §3
holds Proposition 3.1 (the mean-square estimate, `thm:ms`) and the proof of
Theorem 1.1 from it (equation (3.2) is the extraction, `eq:prime-extract`).
§4 Poisson summation (Lemma 4.1 arithmetic identities, Proposition 4.5 the
reduction to the dual mean square). §5 iteration: Proposition 5.1 (the
canonical bound, positive gap (5.1)), Proposition 5.2 (completed mean square,
`prop:R`), Lemma 5.3 (cube reduction), Proposition 5.4 (transfer); §5.5 the
proof of Proposition 5.1; §5.6 the exponent 11/12. §6 the completed estimate:
§6.1 theta realization, §6.2 the theta transformation (Proposition 6.2),
§6.3 the quadratic large sieve (Lemma 6.5). §7 the transfer proof (§7.1 first
Poisson, §7.2 second Poisson). Appendix A: arithmetic identities (A.1
reciprocity and Gauss sums). Equations in §2: (2.2) the family, (2.3) the
budget, (2.4) A_{p⁶} = A₁ + O(D/Y), (2.5) the extraction, (2.6) γⱼ, (2.7) B_h,
(2.8) the Poisson comparison, (2.9) the dual target, (2.10) Patterson's
coefficients, (2.12) T_h, (2.13) the dual theta sum, (2.14) χ⁻¹χ⁻² = χ³,
(2.15) the completed bound, (2.16) cube completion, (2.18) cube inversion,
(2.20) short cubes, (2.21) the cutoff H_c, (2.22) long cubes, (2.23) the
energy target. Cite a section or proposition when unsure of an equation number.

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
look at. Dark ink on light paper: anything translucent reads lighter, not
darker, so faint marks need more opacity than they did on the blue field.
