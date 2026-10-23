# Studio: source for The Fixed Frontier (v2)

A Remotion project that renders the second edition of the explainer, published at `../v2/`.

- `src/narration/script.ts`: the narration, passage by passage, with the sources it was checked against.
- `src/design/tokens.ts`: the mood board as code (inks, type, sizes, motion). `npm run lint:design` rejects anything else.
- `src/diagrams/`: reusable figures (strip map, contour survey, 3D landscape, proof map, lattice, Möbius walk…).
- `src/scenes/`: one file per chapter; scenes animate on narration cues (`src/cues.tsx`).
- `src/data/`: computed numerics (`scripts/compute_data.py`) and word timings (`scripts/timing.mjs`).
- `moodboard/`: the mood board page and its sample frames.
- `AUTHORING.md`: the rules every scene follows.

## Rebuild

```
npm install
uv run --with mpmath python scripts/compute_data.py   # numerics
node scripts/narrate.mjs                              # ElevenLabs takes (cached; needs ELEVENLABS_ENV_FILE)
node scripts/timing.mjs                               # word timings
npx remotion studio                                   # preview
node scripts/contact.mjs --all                        # review stills
node scripts/finish.mjs                               # render, master audio, package ../v2/
```
