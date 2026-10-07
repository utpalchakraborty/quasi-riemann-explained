# Quasi Riemann — a guide to the argument

[Watch the film and read along](https://utpalchakraborty.github.io/quasi-riemann-explained/)

An 18 minute 49 second animated explainer, narrated by ElevenLabs Sarah, with a dark theme, 13 chapters, English captions, a transcript, and equations. The film is 1920 × 1080 at 30 fps.

The latest edition opens with an 87-second, two-slide proof roadmap: the central cancellation-to-zero-free-region argument, followed by the strategy behind the 11/12 exponent. All 12 original chapters and their narration are preserved.

The film explains the claimed arguments in two OpenAI mathematics manuscripts. It is not an independent verification of their proofs.

## Files

- `index.html`: video player, chapter navigation, transcript, and equations.
- `Quasi-Riemann-Explained-Sarah.mp4`: the complete dark edition; the original public video URL is retained.
- `subtitles.srt`: English captions.
- `transcript.txt`: plain-text transcript.
- `chapters.json`: chapter timings.
- `assets/`: equation images.
- `evidence/00_roadmap-02.png`: video poster showing the new proof roadmap.
- `edition.json`: edition metadata, video properties, and SHA-256.

## Sources and production

- [October 5 manuscript](https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/preprints/The-Quasi-Riemann-Hypothesis-October-5-2026/paper2.pdf)
- [September 30 manuscript](https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/preprints/The-Quasi-Riemann-Hypothesis-September-30-2026/paper.pdf)
- Animation workflow: [Math-To-Manim](https://github.com/HarleyCoops/Math-To-Manim), with locally authored scenes.
- Narration: ElevenLabs Sarah, Eleven v4. Captions use provider speech timestamps.

## Hosting

GitHub Pages serves the static files from the root of the `main` branch. The MP4 is approximately 49.1 MiB and is stored in ordinary Git. No build step or Git LFS is needed. The player and data download links include an edition identifier to avoid reusing cached files from the previous edition.
