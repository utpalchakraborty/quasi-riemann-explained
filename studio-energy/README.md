# Studio: source for The Energy Budget

A Remotion project that renders the energy-budget explainer, published at `../energy/`. It is a sibling of `../studio/` (The Fixed Frontier): same engine and type, its own palette and scenes. The structure follows `../briefs/energy-budget.md`.

- `src/narration/script.ts`: the narration, passage by passage, with the sources it was checked against.
- `src/design/tokens.ts`: the mood board as code (inks, type, sizes, strokes, hatching, motion). `npm run lint:design` rejects anything else.
- `src/diagrams/`: figures. `Area.tsx` holds the energy grammar (squares, frames, hatching, pouring), `Ledger.tsx` the ledger, `FamilyField.tsx` the computed family.
- `src/scenes/`: one file per chapter; scenes animate on narration cues (`src/cues.tsx`).
- `src/data/`: computed numerics (`scripts/compute_data.py`) and word timings (`scripts/timing.mjs`).
- `moodboard/`: the mood board page and its sample frames.
- `AUTHORING.md`: the rules every scene follows.

## Rebuild

```
npm install
uv run --with numpy python scripts/compute_data.py     # numerics
node scripts/narrate.mjs                               # ElevenLabs takes (cached; needs ELEVENLABS_ENV_FILE)
node scripts/timing.mjs                                # word timings
npx remotion studio                                    # preview
node scripts/contact.mjs --all                         # review stills
node scripts/finish.mjs                                # render, master audio, package ../energy/
```
