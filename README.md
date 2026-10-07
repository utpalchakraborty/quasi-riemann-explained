# Quasi Riemann — a guide to the argument

[Watch the film and read along](https://utpalchakraborty.github.io/quasi-riemann-explained/)

A 17 minute 22 second animated explainer, narrated by ElevenLabs Sarah, with 12 chapters, English captions, a transcript, and equations. The film is 1920 × 1080 at 30 fps.

The film explains the claimed arguments in two OpenAI mathematics manuscripts. It is not an independent verification of their proofs.

## Files

- `index.html`: video player, chapter navigation, transcript, and equations.
- `Quasi-Riemann-Explained-Sarah.mp4`: the complete film.
- `subtitles.srt`: English captions.
- `transcript.txt`: plain-text transcript.
- `chapters.json`: chapter timings.
- `assets/`: equation images.
- `evidence/06_exponent-03.png`: video poster.

## Sources and production

- [October 5 manuscript](https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/preprints/The-Quasi-Riemann-Hypothesis-October-5-2026/paper2.pdf)
- [September 30 manuscript](https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/preprints/The-Quasi-Riemann-Hypothesis-September-30-2026/paper.pdf)
- Animation workflow: [Math-To-Manim](https://github.com/HarleyCoops/Math-To-Manim), with locally authored scenes.
- Narration: ElevenLabs Sarah, Eleven v4. Captions use provider speech timestamps.

## Hosting

GitHub Pages serves the static files from the root of the `main` branch. The MP4 is approximately 45.5 MiB and is stored in ordinary Git. No build step or Git LFS is needed.
