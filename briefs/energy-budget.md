# The Energy Budget — brief for a dedicated explainer film

Status: outline for production. Written 2026-10-25 against the two manuscripts and the second-edition film (*The Fixed Frontier*, `v2/`). The film itself is to be built by Opus 5.5 with its own mood board and a Remotion project. Nothing here is a script; chapter cards give beats, the sentence each chapter must land, what is on screen, and the sources to cite.

Working title: **The Energy Budget**. Subtitle: *How the quasi-Riemann proof pays for cancellation*. Alternatives: *Add Up the Squares*; *Paid in Squares*; *A Budget for Cancellation*.

Target length: 20:00 (19:30–20:30 acceptable). 1920 × 1080, 30 fps, ElevenLabs Sarah (Eleven v4), same loudness as `v2/edition.json`.

---

## 1. Why this film exists

*The Fixed Frontier* explains the whole argument in four moves. It gives the energy budget 52 seconds (chapter 4), the spend 115 seconds (chapter 5) and the engine that proves the budget about four minutes (chapters 7–9). Viewers can follow the moves, but the budget itself stays a black box: a sum of squares that is "about what random signs would give". The idea is not a common mathematical concept outside analytic number theory, yet it is the one thing the October proof rests on. The October manuscript says so in its outline: "Therefore it remains to establish" the mean-square estimate, and five of its seven sections do exactly that.

This film takes the single concept and gives it twenty minutes. It answers three questions, in order:

1. **What it means.** What an energy is, why squares, what a budget promises and what it does not.
2. **How it is created.** How a budget for a family no one can compute is proved: by transforming the energy rather than computing it, until a known inequality pays it.
3. **How it helps.** How a statement about thousands of sums is spent on the one sum that matters, and why the answer is eleven twelfths.

**The sentence the viewer should be able to say afterwards:** *An energy budget is a provable promise about the total size of a family of sums. The proof earns it by moving the energy through Fourier and theta transformations until a quadratic large sieve can pay for it, and spends it by planting copies of the one sum it needs inside the family.*

### Audience and prerequisites

Same audience as v2: mathematically curious, not specialists; comfortable with a sum, a square and an exponent; not expected to know a character or a Gauss sum. Assume they may have seen v2 but do not require it. Prerequisites from v2 are recapped in one or two sentences each, with an on-screen pointer ("*The Fixed Frontier*, chapter 3") rather than a re-explanation:

- the Möbius function and the Mertens function (v2 ch. 2);
- the Eisenstein integers, the six units, the sextic twist χₙ(u) (v2 ch. 3);
- the target sum A₁(D) and why cancellation in it rules out zeros (v2 ch. 2 and 6).

### What the film must not do

- It must not re-tell the whole proof. Zeros, the contradiction, Dirichlet L-functions and consequences stay in v2. One line each where needed.
- It must not pretend to test the manuscripts. Every computed figure is at a scale where the claim cannot be checked; the film says so. The disclaimer from v2 ("This film explains the manuscripts' arguments; it does not verify them") appears in the open and the close.
- It must not invent numbers. Every number on screen comes from the LaTeX sources in `/Users/utpalrohan/math/preprints/The-Quasi-Riemann-Hypothesis-*/build/` or from a computation in the repository.

---

## 2. The concept on one page (for the builder, not the viewer)

Notation is the October manuscript's. K = ℚ(√−3), 𝒪 = ℤ[ω], N = norm, ν a finite-order Hecke character (ν trivial is allowed), S a finite set of primes containing those above 2 and 3 and the conductor of ν, W a smooth compactly supported window, μ the ideal Möbius function.

**Target** (§2.1, §3): A₁(D) = Σₙ μ(n) ν(n) W(N(n)/D), over ideals prime to S. About D terms. Wanted: A₁(D) ≪ D^{1−δ+ε}. By the Mellin argument of §3, this forces L_K(s, ν) ≠ 0 for Re s > 1 − δ.

**Family** (§2.2, eq. 2.2): A_u(D) = Σₙ μ(n) ν(n) χₙ(u) W(N(n)/D), with χₙ(u) = (u/n)₆ the sextic residue symbol (zero when (u, n) ≠ 1; χ₁ ≡ 1). The member u = 1 is the target. *Rows* are the outer variable u ∈ 𝒪 with 0 < N(u) ≤ H; *columns* are the inner variable n. These are the paper's own words.

**The budget** (Proposition 3.1, label `thm:ms`): for fixed 0 < ϑ ≤ 1/10 and every ε > 0,

```latex
\sum_{0<N(u)\le H}|A_u(D)|^2 \ll_{\nu,S,I,\vartheta,\varepsilon}
\Big(\max_{j\le k}\|W^{(j)}\|_\infty\Big)^2 D^{2+\vartheta+\varepsilon},
\qquad H = D^{1+\vartheta}.
```

In the outline's shorthand: energy ≪ D^{1+ε} H. About H rows, so a typical row has energy about D and size about √D: square-root cancellation on average, in the L² sense (§2.2). The paper calls this the *mean-square estimate*; its LaTeX labels the object `eq:energy` and `eq:intro-energy-target`, and the September manuscript titles sections "unmarked row energy" and "The reflected energy bound". "Energy budget" is the film's phrase for the mean-square estimate and should be introduced as such, once.

**The spend** (§3, proof of Theorem 1.1): for a primary prime p with Y/2 < N(p) ≤ Y, χₙ(p⁶) = 𝟙_{p∤n}, so A_{p⁶}(D) = A₁(D) + O_W(D/Y). Landau's prime ideal theorem gives J ≍ Y/log Y such primes; take Y = H^{1/6} so their sixth powers are rows. Then

```latex
|A_1(D)|^2 \le \frac{2}{J}\sum_{p}|A_{p^6}(D)|^2 + O_W\!\Big(\frac{D^2}{Y^2}\Big)
\ll D^{2+\vartheta+\varepsilon}/Y + D^2/Y^2
= D^{11/6+5\vartheta/6+\varepsilon} + D^{5/3-\vartheta/3},
```

so A₁(D) ≪ D^{11/12 + 5ϑ/12 + ε}, and ϑ is then taken small.

**The engine** (§2.3–2.5; §4–7; Appendix A):

1. Expand the square and apply Poisson summation in the row u. Dual rows h with N(h) ≪ 𝓗 ≍ D²/H = D^{1−ϑ}. The Fourier transforms of the sextic characters are Gauss sums γⱼ(n). The Hasse–Heath-Brown identity μ(n)γ₋₁(n) = χₙ(−1) G(n)⁻¹ ᾱ(n) γ₂(n) absorbs the Möbius sign into a *cubic* Gauss sum. New family B_h(X) = Σ*ₙ ᾱ(n)γ₂(n) ξ(n) χₙ(h) U(N(n)/X). Schematically Σ_u|A_u|² ≲ DH + (H/D)Σ_{N(h)≪𝓗}|B_h(D)|², so the new target is Σ_h|B_h(D)|² ≲ D², i.e. E(𝓗, X) := X⁻¹Σ_h|B_h(X)|² ≲ X at X = D.
2. Cubic Gauss sums are Fourier coefficients of Kubota's cubic theta function (Patterson: c_θ(nb³) = 3^{5/2}|b| \overline{χₙ(λ)²} γ₂(n), λ = 1 + 2ω). Complete the sum to all indices nb³ (T_h(X)); the theta transformation turns the long column sum into a short dual sum (N(m) ≪ N(h)²/X) and the twist into χ_h³, which is quadratic because χ_p⁻¹χ_p⁻² = χ_p⁻³ = χ_p³. The quadratic large sieve of Goldmakher–Louvel (Lemma `lem:quadratic`) then gives the completed bound (Proposition `prop:R`): Σ_{N(k)≪𝓗}|T(X;k,f)|² ≪ D^ε(𝓗 + 𝓗²N(f)/X). The general higher-order sieve carries an extra (ML)^{2/3} term that would break the count.
3. Completion borrowed the cube terms. Möbius inversion returns them: P_h(X) = Σ_d μ(d)w_h(d)N(d)⁻¹ T_h(X/N(d)³). Small d (N(d) ≤ H_c, H_c³ = min(X, X²/𝓗²)) are within budget by Cauchy–Schwarz. Large d leave remainders E(𝓗, L_b), L_b = X/N(b)³: same rows, shorter columns. The *transfer estimate* (Proposition `prop:transfer`, §7) applies Poisson twice more, after enlarging the intermediate row range to Y = XL_b/𝓗 (legal because every term is nonnegative), and returns a mean square of the same kind at scales (𝓗/N(b)³, X/N(b)³): both shrink, ratio fixed. Because N(b) > H_c, the rows shrink by at least D^{2ϑ} per step. After O_ϑ(1) steps the row parameter is at most 1 and counting finishes (§5, "admissible exponent" method of Heath-Brown). The full argument carries f-twists χₙ(f)⁴ in the family 𝓔(𝓗, X, F) and proves 𝓔 ≪ D^ε XF under the positive gap 𝓗 ≤ XF·D^{−κ} (Proposition `prop:canonical`).

**Why ϑ > 0.** It makes the dual rows shorter than the columns (the positive gap) and makes the recursion shrink. It costs 5ϑ/12 in the exponent, so it is kept small, never zero.

**The September route** uses the same idea at larger scale: "reflected energy" and "row energy" bound mean squares of completed theta rows; two moment bounds for Dirichlet polynomials, each proved by its own recursion, limit the number of rows on which a zero detector fires. A budget spent by *counting outliers* rather than by extracting copies.

---

## 3. Spine, metaphor and visual grammar

### The spine

Three acts, matching the three questions. Act I (chapters 1–3) builds the concept with no new machinery. Act II (chapter 4) spends the budget, so the viewer sees the payoff before the hard part. Act III (chapters 5–7) proves the budget. Chapter 8 and the close pay the bill: what ϑ and ε cost, and what the idea looks like in the September paper.

Putting the spend before the proof is deliberate: viewers should know exactly what the budget buys before they are asked to follow three Poisson summations.

### The running metaphor: energy is area

Every member of a family is drawn as a **square whose side is its size** |A_u(D)|. The energy of the family is the **total area** of its squares. The budget is a **frame** of area D·H: H unit squares of side √D. Square-root cancellation on average means the squares fit the frame. Spending the budget is moving squares out of the frame; the one property used is that area is never negative, so what is left over is at most the whole.

This is exact, not decorative: energy = sum of squares = sum of areas. It gives the film one picture that works in every chapter:

- Chapter 1: random walks as squares; the frame of area N.
- Chapter 2: the family's squares; the frame D·H; the typical square √D × √D.
- Chapter 4: J gilt squares (copies) lifted out of the frame; the error as an ember sliver on each; the division as sharing the frame among J; the square root as going from area back to side.
- Chapters 5–7: the **energy rectangle** of rows × columns (already in `studio/src/diagrams/Energy.tsx`): rows H tall, columns D wide. Poisson summation *reflects* the row dimension through the column scale (H·𝓗 = D²). The recursion nests similar rectangles sharing a diagonal, each a factor N(b)³ smaller.

### The secondary device: the ledger

A budget is an account. The film keeps a ruled ledger that returns at the end of each chapter: a budget line, what has been spent, what is owed. Debts (the cube terms, error terms, overspend) are ember; payments (the sieve bound, the counting endpoint) are paper; the target is gilt. The ledger is lines and alignment only: this satisfies the house rule of no boxes, cards or panels.

### Inherit from the Fixed Frontier system

Keep the cyanotype field, the inks and their roles, the type (Bodoni / Plex / KaTeX), the 128 px margins, the bottom band, the three figure tags (computed / schematic / claim), the `Cite` convention, and `lint:design`. Roles unchanged: **gilt** = the target and the claim; **verdigris** = arithmetic (primes, characters, Gauss sums, Möbius signs); **ember** = obstruction, debt, error; **paper** = geometry and primary ink; **mist** = axes and captions. Do not add a fourth accent for "energy"; energy is paper-outlined area with hatch fill, so density of hatching, not a new colour, carries magnitude.

The mood board decides the rest (section 6).

---

## 4. Structure and timing

| # | Chapter | Start | Length | Words | Question |
|---|---|---|---|---|---|
| — | Cold open: a thousand coins | 0:00 | 1:30 | ~200 | hook |
| 1 | What energy means | 1:30 | 2:30 | ~370 | means |
| 2 | Why a family, and the shape of a budget | 4:00 | 2:30 | ~370 | means |
| 3 | Two demands | 6:30 | 2:00 | ~300 | means |
| 4 | Spending it | 8:30 | 2:00 | ~300 | helps |
| 5 | Proving it, I: the dual side | 10:30 | 2:30 | ~370 | created |
| 6 | Proving it, II: the theta function pays | 13:00 | 2:30 | ~370 | created |
| 7 | Proving it, III: the debt and the recursion | 15:30 | 2:30 | ~370 | created |
| 8 | The price of the budget | 18:00 | 1:00 | ~150 | created |
| — | Close | 19:00 | 1:00 | ~150 | — |

Total 20:00, about 2,950 narration words. v2 ran at roughly 150 words per minute including chapter cards and dissolves; keep the same pace. Chapter cards (3.2 s) between numbered chapters, a title card after the cold open, an end card.

Act boundaries: Act I = chapters 1–3; Act II = chapter 4; Act III = chapters 5–8.

---

## 5. Chapter cards

Each card: beat, narration arc (beats to hit, not sentences to read), the sentence to land, what is on screen with its tag, the equations in paper notation, the source line, pitfalls.

### Cold open — A thousand coins (0:00–1:30)

**Beat.** An energy budget is a law about all the walks at once, not about any one of them.

**Arc.** Flip a coin a thousand times; +1 for heads, −1 for tails; add. The total wanders. You cannot say what it will be. Square it. Run the walk again, hundreds of times, and average the squares: the average settles at the number of steps. That is a budget: it says nothing about one walk and everything about all of them together. The manuscripts' proof rests on one estimate of this kind, for a family of sums that nobody can compute, and the next twenty minutes are about that estimate. Disclaimer line. Title.

**Land.** "A fact about none of them, and a fact about all of them."

**On screen.** One random ±1 walk drawing on (computed, seeded). Its final value becomes a square of that side. Many walks, many squares, stacked into a frame; the frame's area is N. Histogram of the squares with mean marked (computed). Title card.

**Equations.** E|ε₁ + ⋯ + ε_N|² = N for independent signs; displayed as `\mathbb{E}\,|S_N|^2 = N`.

**Source.** Classical.

**Pitfalls.** The sample mean is close to N, not equal; say "settles at", not "is exactly".

### Chapter 1 — What energy means (1:30–4:00)

**Beat.** Energy is a sum of squares; squares forget signs and add over independent pieces; the random benchmark is square-root cancellation.

**Arc.**
- Why squares and not absolute values: squares are smooth, and they add over perpendicular pieces (Pythagoras). A function's energy equals the energy of its Fourier coefficients (Parseval). Physicists call ∫|f|² the energy of a signal; the word stuck.
- Expand the square of a sum of N terms: N diagonal terms, each a size squared, and N² − N cross terms. All the cancellation lives in the cross terms. For random signs the cross terms average to zero: energy N, typical size √N. Name it: square-root cancellation, the benchmark for every sum in this film.
- Arithmetic is not random, but it can look it: the Mertens function (reuse v2's computed data to 1200), its square against x. No picture proves anything; the picture shows what a budget would look like if it held.
- A family: many sums, add all their squares, and a *budget* is an upper bound for that total. What the papers call it: "mean square"; where the word "energy" appears in their text and labels; "energy budget" is this film's name for the estimate.

**Land.** "An energy is a sum of squares. A budget is a promise about the sum."

**On screen.** A bar of height |a| turning into a square of side |a| (the grammar is taught here). A right triangle with squares on its sides (Pythagoras, schematic). The N × N grid of the expanded square with the diagonal lit and the off-diagonal fading (schematic). Random-walk energies (computed). Mertens M(x) and M(x)² against x (computed, from `numerics.json`).

**Equations.** `|\sum_n a_n|^2 = \sum_n |a_n|^2 + \sum_{n\ne m} a_n\overline{a_m}`; Parseval in one line; `M(x) = \sum_{n\le x}\mu(n)`.

**Source.** Classical; October manuscript, §2.2 (the phrase "square-root cancellation on average"); September manuscript, section titles for "row energy" and "reflected energy".

**Pitfalls.** Do not say M(x) ≪ √x is known; it is equivalent to the Riemann hypothesis (Littlewood 1912, cited in §2.1). Say the picture is suggestive, as v2 does.

### Chapter 2 — Why a family, and the shape of a budget (4:00–6:30)

**Beat.** A bound for one sum is hard; a budget for an orthogonal family is cheap; a budget has a characteristic shape, rows plus columns.

**Arc.**
- Recall the target A₁(D): Möbius signs over Eisenstein ideals of norm about D, about D terms. Wanted: much smaller than D. One line on why (cancellation forbids zeros; pointer to v2 ch. 2 and 6).
- Why one sum is hard: you must control its own cross terms, and nothing helps you. Why a family is easier: expand the squares, swap the order of summation, and if the members are orthogonal to each other, the family kills the cross terms for you. Rows and columns, the paper's words.
- The shape of a budget: energy ≤ (rows + columns) × coefficient mass, up to tiny losses. The classical instance is the large sieve. Show why rows + columns cannot be beaten: a column vector concentrated on one term costs the number of rows; a row with a trivial character costs the number of columns. So a budget of this shape is as good as a budget gets.
- The paper's family: twist the target by χₙ(u); rows u of norm up to H = D^{1+ϑ}; columns n of norm about D. Proposition 3.1 on screen, in full. About H rows, so a typical row has energy about D: square-root cancellation on average. And what it does not say: nothing about any one row.

**Land.** "A budget is cheaper than a bound. You pay for it with orthogonality, and you get it for the whole family at once."

**On screen.** The target as a single tall bar whose size is unknown (gilt, dashed top). The family as a field of squares; if the small-scale computation (section 5, N3) is done, these are real values of |A_u(D)| at D ≈ 2000 (computed); otherwise schematic. The energy rectangle: rows H high, columns D wide, labelled with the paper's words. The rows + columns law with its two sharpness examples (schematic). Proposition 3.1 with `Cite`.

**Equations.** The family `A_u(D)=\sum_{(n,S)=1}\mu(n)\nu(n)\chi_n(u)W(N(n)/D)`; the budget `\sum_{0<N(u)\le H}|A_u(D)|^2 \ll D^{1+\varepsilon}H`, `H=D^{1+\vartheta}`; the large-sieve shape `\sum_{\text{rows}}\Big|\sum_{\text{cols}}\beta_n\phi_r(n)\Big|^2 \ll (M+L)(ML)^{\varepsilon}\sum|\beta_n|^2`.

**Source.** October manuscript, §2.2 and Proposition 3.1; classical (large sieve: Iwaniec–Kowalski, *Analytic Number Theory*, ch. 7, cited as IK04 in the paper).

**Pitfalls.** Rows are elements u ∈ 𝒪, not ideals; columns are ideals prime to S represented by primary generators. The implied constant depends on ν, S, the support of W, ϑ, ε and derivatives of W; never say "D times H exactly". ϑ is fixed in (0, 1/10].

### Chapter 3 — Two demands (6:30–8:30)

**Beat.** To prove a budget the family must be diverse; to use it the family must be repetitive. The sextic twist does both, and the sixth power sets the exponent.

**Arc.**
- The tension, stated plainly. Orthogonality is what makes a budget provable; it needs the members to differ. Usefulness needs the target to reappear many times; it needs members to agree.
- The sextic symbol resolves it. For fixed n, u ↦ χₙ(u) is a character, so different columns are orthogonal as u runs: diverse. For u = p⁶, χₙ(p⁶) = 1 unless p divides n: at sixth-power rows the twist disappears and the member is nearly the target: repetitive. Same symbol, both properties.
- The price of repetition: copies live only at sixth powers, so of H rows only about Y = H^{1/6} primes supply copies. The ladder: if the twist had order k, copies would sit at k-th powers, Y = H^{1/k}, and the same spend would give exponent ½(1 + (1 + ϑ)(1 − 1/k)). At k = 6 that is 11/12 + 5ϑ/12. A thought experiment, not a claim: at the bottom of the ladder, with no twist at all, every row would be the target, and a budget of the same shape would give the Riemann hypothesis for this L-function. But that family has no orthogonality, and nobody can prove its budget. The sixth power is where provable meets useful: the cubic theta function and sextic reciprocity are what the engine knows how to pay for.

**Land.** "Diverse enough to prove, repetitive enough to spend. The sixth power is where the two meet."

**On screen.** Two columns of squares: a diverse family (sizes vary, orthogonal arrows) and a repetitive one (all gilt copies). The phase wheel (reuse `PhaseWheel`) for χₙ(u) collapsing to 1 at u = p⁶. Rows highlighted at sixth powers among all rows (schematic; at real scale the sixth-power rows are far out, see pitfalls). The exponent ladder as a dial over k = 1…6…∞ with 11/12 at k = 6 (schematic arithmetic; tag schematic; `Cite` only for k = 6).

**Equations.** `\chi_n(p^6)=\mathbb{1}_{p\nmid n}`; `Y = H^{1/6}`; the ladder `\tfrac12\big(1+(1+\vartheta)(1-\tfrac1k)\big)`.

**Source.** October manuscript, §2.2, eqs. (2.3)–(2.5) (verify numbers), §3. The ladder for k ≠ 6 is the film's arithmetic, not a manuscript claim; label it so.

**Pitfalls.** The thought experiment must be marked as one. Do not imply a lower-order twist would be easy or that anyone has tried it.

### Chapter 4 — Spending it (8:30–10:30)

**Beat.** Positivity lets you drop what you do not need; arithmetic makes what is left a copy of the target; dividing and taking a root gives eleven twelfths. A budget can also be spent by counting outliers.

**Arc.**
- The copies: for a prime p of norm about Y, A_{p⁶}(D) differs from the target only on the terms p divides, about D/Y of them. Their sixth powers must be rows, so Y = H^{1/6}. About Y/log Y of them (Landau's prime ideal theorem).
- The spend, on the ledger: the target squared is at most twice the average copy squared plus the error squared; the copies' energy is at most the whole budget because squares are nonnegative (this is the one property of energy you use when spending); divide by J; put in Y and H; take the square root. 11/12 + 5ϑ/12 + ε. Then choose ϑ small.
- The second way to spend a budget: if the total is at most B, at most B/T² rows can exceed T. That is how zero-density estimates work, and how the September manuscript uses its moment bounds: its zero detector attaches a large Dirichlet polynomial to every bad row, and the moment bound limits how many bad rows there can be. One sentence; the film returns to it in chapter 8.

**Land.** "You may drop any part of an energy, because every part is a square. What you keep is the target, many times over."

**On screen.** The frame D·H with J gilt squares (the copies) each with an ember sliver (the error D/Y) lifted out; the rest of the family dimmed; the frame shared J ways; the square root as the side of the resulting square (reuse and extend `BudgetSplit`). Then the exponent arithmetic laid out as a short column of lines with the parts lit as spoken. Second panel: a threshold line T across the family and at most B/T² squares above it (schematic).

**Equations.** Exactly the chain in §3: `|A_1(D)-A_{p^6}(D)|\ll_W D/Y`; `J\asymp Y/\log Y`; `|A_1(D)|^2\le\frac2J\sum_p|A_{p^6}(D)|^2+O_W(D^2/Y^2)`; `\ll D^{2+\vartheta+\varepsilon}/Y+D^2/Y^2=D^{11/6+5\vartheta/6+\varepsilon}+D^{5/3-\vartheta/3}`; `A_1(D)\ll D^{11/12+5\vartheta/12+\varepsilon}`. Chebyshev: `\#\{u:|A_u|\ge T\}\le B/T^2`.

**Source.** October manuscript, §3 (proof of Theorem 1.1 from Proposition 3.1; eq. `eq:prime-extract`); September manuscript, proof overview ("The refined second stage") and the sections "The inverse moment with prime factors" and "Prime amplitudes and refined row counts" (verify section numbers).

**Pitfalls.** The factor 2 and the error term come from |a|² ≤ 2|b|² + 2|a − b|²; show them, do not hide them. The exponent of the error term, 5/3 − ϑ/3, is smaller than 11/6 + 5ϑ/6; say that it is, do not skip it.

### Chapter 5 — Proving it, I: the dual side (10:30–13:00)

**Beat.** You never compute the energy; you transform it. Fourier transforms preserve energy and scramble values, so an energy can be carried to a side where the rows are short and the coefficients have a theory.

**Arc.**
- The method, stated before the mechanics. Plancherel: a transform keeps the energy and changes everything else. That is why the proof works with energies and not with individual sums.
- Expand the square: pairs of columns n, n′, and inside, a sum over rows u of χₙ(u) times the conjugate of χₙ′(u) over a lattice region. Poisson summation turns a sum over positions u into a sum over frequencies h, and the row range flips: H rows become 𝓗 ≍ D²/H = D^{1−ϑ} dual rows. The product of the two row lengths is always D². Now there are fewer rows than columns.
- The transform of a character is a Gauss sum. The Hasse–Heath-Brown identity: the Möbius sign times a sextic Gauss sum equals, up to fixed factors, a cubic Gauss sum. The Möbius function has been absorbed. (Classical cousin: the square of a quadratic Gauss sum is a sign.)
- The new family B_h(X): cubic Gauss sum coefficients, twist χₙ(h), columns n squarefree of norm about X. The comparison, schematically: the original energy is at most DH plus (H/D) times the energy of the new family over the dual rows. The new target: energy of B over 𝓗 rows at most D², i.e. E(𝓗, D) ≲ D.

**Land.** "Poisson summation does not shrink the energy. It moves it to a side where the rows are short and the coefficients are Gauss sums, which have a theory."

**On screen.** The energy rectangle reflecting its row dimension through the column scale: tall (H above D) becomes short (D²/H), with H·𝓗 = D² written on the diagonal (schematic). The expanded-square grid resummed row-wise. The Gauss-sum walk (reuse `GaussWalk`) for γ₋₁ and γ₂ at a few primary primes (computed). The identity with parts lit as spoken (`Tex` with `light`).

**Equations.** `\gamma_j(n)=N(n)^{-1/2}\sum_{x\bmod n}\chi_n(x)^j e(x/n)`; `\mu(n)\gamma_{-1}(n)=\chi_n(-1)G(n)^{-1}\overline{\alpha(n)}\gamma_2(n)`; `B_h(X)=\sum^*_n\overline{\alpha(n)}\gamma_2(n)\xi(n)\chi_n(h)U(N(n)/X)`; `\sum_{0<N(u)\le H}|A_u(D)|^2\precbd DH+\frac HD\sum_{0<N(h)\ll\mathcal H}|B_h(D)|^2`, `\mathcal H\asymp D^2/H`.

**Source.** October manuscript, §2.3 and §4; Appendix A ("Reciprocity and Gauss sums", label `app:gauss-identities`); Hasse 1950, Heath-Brown 2000 as cited there.

**Pitfalls.** Plancherel preserves energy exactly for the Fourier transform; Poisson summation here is a comparison with diagonal and zero-frequency terms and smooth weights, so say "schematically" and tag the comparison schematic. The dual sums carry ray-class characters ξ and a finite set of twists that the outline suppresses; say "up to fixed twists" once.

### Chapter 6 — Proving it, II: the theta function pays (13:00–15:30)

**Beat.** The theta function trades a long sum for a short one and turns a sixth-order twist into a quadratic one; quadratic is what the sharpest sieve can price. The rows + columns law from chapter 2 returns and pays the bill.

**Arc.**
- Cubic Gauss sums are not random: they are Fourier coefficients of Kubota's cubic theta function, an automorphic form on hyperbolic three-space; Patterson's formula gives the coefficient at nb³. Symmetry gives a transformation law.
- The transformation law wants every index nb³, and B_h has only the squarefree n. So complete: T_h(X) includes all of them. Rows unchanged.
- Apply the transformation: a long sum over n of norm about X becomes a short dual sum over m of norm about N(h)²/X. At each prime dividing h the twist exponents add: −1 from the Fourier side, −2 from the theta side, −3 in all, and a sixth-order phase to the third power is ±1. Quadratic.
- The quadratic large sieve (Goldmakher–Louvel, after Heath-Brown): rows plus columns, up to tiny losses. The completed mean square comes in at 𝓗 + 𝓗²N(f)/X, which at the basic scales is within budget.
- Why quadratic matters: the general sieve for higher-order characters carries an extra term, (ML) to the two thirds. At the scales in play that term exceeds rows plus columns by a power of D, and the count fails. Show the exponents.

**Land.** "A sixth-order twist, cubed, is a sign. Signs are what the sharpest sieve can price."

**On screen.** The upper half-space (reuse `UpperHalfSpace`) with the theta function's cusp; the lattice of indices with squarefree n filled in by cubes nb³ (completion, schematic); the twist exponents on the phase wheel: −1, −2, −3 ≡ 3 (schematic); the sieve inequality with (M + L) lit and, beneath it, the higher-order version with (ML)^{2/3} struck through; the exponent comparison 1 − ϑ against 4/3 − 2ϑ at the basic scales (schematic arithmetic from §2.4; tag schematic).

**Equations.** `c_\theta(nb^3)=3^{5/2}|b|\,\overline{\chi_n(\lambda)^2}\,\gamma_2(n)`; `\chi_p^{-1}\chi_p^{-2}=\chi_p^{-3}=\chi_p^{3}`; the quadratic large sieve `\sum^*_{N(k)\le\mathcal H}\Big|\sum_n\beta(n)\chi_k(n)^3\Big|^2\ll(\mathcal HU)^{\varepsilon}(\mathcal H+U)\sum|\beta(n)|^2`; the completed bound `\sum_{0<N(k)\ll\mathcal H}|T(X;k,f)|^2\ll D^{\varepsilon}\|W\|^2\Big(\mathcal H+\frac{\mathcal H^2N(f)}{X}\Big)`.

**Source.** October manuscript, §2.4, Proposition `prop:R` (§5, "The completed mean-square estimate"), §6 and Lemma `lem:quadratic`; Kubota 1969, Patterson 1977, Heath-Brown–Patterson 1979, Dunn–Radziwiłł 2024, Goldmakher–Louvel 2013, Blomer–Goldmakher–Louvel 2014, Heath-Brown 1995, all as cited in the manuscript's bibliography.

**Pitfalls.** The theta function lives on hyperbolic three-space, not the upper half-plane. The extra term is (ML)^{2/3}, M and L together; v2's narration "M times L to the two thirds" was ambiguous when spoken, so phrase it "M L together, to the two thirds". The completed bound has 𝓗²N(f)/X, not 𝓗²/X, in its precise form; the outline form drops f. The exponent comparison uses the basic scales of §2.5 (X ≍ D, 𝓗 ≍ D^{1−ϑ}); present it as "at the basic scales, schematically".

### Chapter 7 — Proving it, III: the debt and the recursion (15:30–18:00)

**Beat.** Completion borrowed terms that must be returned. Returning them leaves smaller energies of the same kind; two more Poisson summations shrink the rows; a bounded number of instalments pays everything.

**Arc.**
- The debt: T_h has the cube terms, B_h does not, and they cannot simply be dropped, because contributions from different cubes can cancel. Möbius inversion returns them exactly: P_h is a weighted sum of T_h at column scales X/N(d)³.
- Small d: Cauchy–Schwarz plus the completed bound; within budget up to the cutoff H_c, which at the basic scales is D^{2ϑ/3}. Here is ϑ at work for the first time.
- Large d: group and bound by the worst case; what remains is an energy of the same kind at a shorter column scale L_b = X/N(b)³, but with the full row range, and the required bound is still X. Not yet progress: the rows have not shrunk.
- The transfer: expand and apply Poisson in h; the new rows y have norm up to L_b²/𝓗. Now enlarge that row range to Y = XL_b/𝓗, which is allowed because every term is a square (positivity again); apply Poisson once more, and the rows come back shorter: 𝓗′ = 𝓗L_b/X. The coefficients return to cubic Gauss sums. Both scales have shrunk by N(b)³ and their ratio is unchanged.
- The recursion: the normalized energy at one level is at most one plus the normalized energy at the next. Because N(b) exceeds the cutoff, each level shrinks the rows by at least D^{2ϑ}. After a bounded number of levels, depending only on ϑ, the row parameter is at most one and plain counting gives the bound. Unwind. The full argument carries f-twists, common factors and dyadic ranges through every step (Proposition `prop:canonical` and its positive gap). Heath-Brown's admissible-exponent method.

**Land.** "The proof never pays the energy outright. It pays a bounded number of instalments, each at a smaller scale, and the last one is small enough to count."

**On screen.** The ledger: "T_h = P_h + cube terms" as two lines, then the inversion as the reverse entry. Nested similar energy rectangles sharing a diagonal (reuse `EnergyRect`), each a factor N(b)³ smaller, rows annotated 𝓗, 𝓗D^{−2ϑ}, 𝓗D^{−4ϑ}, … down to 1 (schematic; derived from the inequality 𝓗′ ≪ D^{−2ϑ}𝓗, so "at most" these). The enlargement step drawn as the row range widening before it narrows (schematic). A running total line that ends at a bounded constant.

**Equations.** `P_h(X)=\sum_{d}\frac{\mu(d)w_h(d)}{N(d)}T_h\Big(\frac{X}{N(d)^3}\Big)`; `H_c=\min\{X^{1/3},(X/\mathcal H)^{2/3}\}`; `E(\mathcal H,X)\precbd X+\sup_b E(\mathcal H,L_b)`, `L_b=X/N(b)^3`; `E(\mathcal H,L_b)\precbd X+\frac{X}{L_b}E'\Big(\frac{\mathcal HL_b}{X},L_b\Big)`; `(\mathcal H',X')=\Big(\frac{\mathcal H}{N(b)^3},\frac{X}{N(b)^3}\Big)`, `\frac{\mathcal H'}{X'}=\frac{\mathcal H}{X}`; `\mathcal H'\ll D^{-2\vartheta}\mathcal H`; `\frac{E(\mathcal H,X)}{X}\precbd 1+\sup\frac{E'(\mathcal H',X')}{X'}`.

**Source.** October manuscript, §2.5; §5 ("Cube inversion and the remaining sums", "The transfer estimate", "Proof of Proposition 5.1"); §7 ("Proof of the transfer proposition"); Heath-Brown 1995, Lemma 8 and §8, as cited.

**Pitfalls.** The shrink D^{−2ϑ} per step is an upper bound ("at least a factor D^{2ϑ}"), not the exact schedule; do not state a specific number of steps unless derived on screen from the inequality and tagged schematic. The enlargement is legitimate only because the terms are nonnegative; say it, because it is the same positivity used to spend the budget in chapter 4, and that echo is the film's point. The endpoint is "row parameter at most 1", not "rows run out".

### Chapter 8 — The price of the budget (18:00–19:00)

**Beat.** ϑ is fuel, ε is friction, and the same idea runs the September route at a larger scale.

**Arc.**
- ϑ > 0 does two jobs: it makes the dual rows shorter than the columns (the positive gap in Proposition `prop:canonical`) and it makes the recursion shrink. It costs 5ϑ/12 in the exponent, so it is kept small and never zero.
- ε: every sieve costs (ML)^ε; a bounded number of steps costs a bounded number of ε's; that is why the final statement is 11/12 + ε for every ε.
- The September manuscript: the same idea at larger scale. "Reflected energy" and "row energy" bound completed theta rows; two moment bounds for Dirichlet polynomials, each by its own recursion, limit how many rows a zero detector can flag. A budget spent by counting outliers, as in chapter 4, with several accounts open at once.

**Land.** "Keep ϑ positive and small, pay ε a bounded number of times, and the ledger closes."

**On screen.** The exponent 11/12 + 5ϑ/12 as ϑ moves across (0, 1/10] (computed from the formula; tag claim with `Cite` §3). The ledger closing. One frame of the September structure: rows, a detector, a moment bound, a count (schematic; `Cite` the proof overview).

**Source.** October manuscript, §2.2, §2.5, Proposition `prop:canonical`; September manuscript, §1 proof overview ("The balanced first stage", "The refined second stage").

### Close (19:00–20:00)

Three lines, over the energy-is-area picture reassembling: an energy is a sum of squares; it is provable because transforms preserve it and one inequality prices it; it is useful because arithmetic plants copies of the target inside it. The disclaimer. End card with the two manuscripts and the pointer to *The Fixed Frontier*.

---

## 6. Numerics and figures

Every number on screen is either in the manuscripts or computed by code in the repository, as in v2 (`studio/scripts/compute_data.py` → `src/data/numerics.json`). New computations, in priority order:

**N1. Random sign walks** (cold open, ch. 1). 400 seeded walks of 1000 steps; final values, squares, running mean of squares against N. Trivial. Tag computed.

**N2. Mertens energy** (ch. 1). Reuse `numerics.json` keys `mobius` and `mertens` (to 1200); add M(x)². Tag computed.

**N3. The family at small scale** (ch. 2, optional but recommended; the one expensive item). Implement ℤ[ω] arithmetic: enumerate primary n = a + bω with N(n) ≤ 2D; factor; μ(n); primary primes p; the sextic symbol χ_p(u) = u^{(N(p)−1)/6} mod p in 𝒪/(p) (𝔽_p for split p ≡ 1 mod 3, 𝔽_{p²} for inert p ≡ 2 mod 3), extended multiplicatively to squarefree n; rows u ∈ 𝒪 with 0 < N(u) ≤ H = D^{1.1}; ν trivial; S = primes above 2 and 3; a smooth bump W supported in [1/2, 2]. Then A_u(D) for every row, |A_u|², the total against D·H, and the row u = 1. Feasible at D ≈ 2000 (about 15,000 rows, about 500 primes, under ten million symbol evaluations; vectorize the row sums). Tag computed. **Caveat the film must state:** at this scale the sixth-power rows are not inside the family, because Y = H^{1/6} ≈ 4 and no admissible prime has norm ≤ 4; copies first appear inside the family when H ≥ 7⁶. So the family picture shows shape (no row dominates; sizes look random), not the copies, and not a test of the claim. Do not fake copies into this picture.

**N4. The copies directly** (ch. 3–4). A_{p⁶}(D) − A₁(D) for p of norm 7, 13, 19, 31, 37, 43 at D from 2000 to 20000: computed exactly from the terms p divides, without the whole family. Shows the error D/Y against the target. Tag computed.

**N5. Gauss sums** (ch. 5). γ₋₁(n), γ₂(n) at a few primary primes, as walks (reuse `GaussWalk` if it already computes them). Tag computed.

**N6. Exponent arithmetic** (ch. 3, 8). 11/12 + 5ϑ/12 across ϑ ∈ (0, 1/10]; the k-ladder ½(1 + (1 + ϑ)(1 − 1/k)). Tag: claim for k = 6 with `Cite`; schematic for the rest, labelled "the film's arithmetic".

**N7. Sieve exponents** (ch. 6). 1 − ϑ against 4/3 − 2ϑ at the basic scales. Tag schematic.

**N8. Recursion schedule** (ch. 7). Row exponents 1 − ϑ − 2ϑj until ≤ 0, for a displayed ϑ. Tag schematic; label "at most".

Everything else (frames, rectangles, ledgers, phase wheels) is schematic and tagged.

---

## 7. Mood board brief

The mood board is the law for this film as it was for v2 (`studio/AUTHORING.md`, `studio/moodboard/moodboard.html`). Build a new one, published as its own artifact, that:

- **Inherits** the cyanotype field, the eight inks and their roles, the type system, the sizes, the motion vocabulary (beat = 12 frames; expose / draw / settle / cut), the margins, the bottom band, the three figure tags and the `Cite` rule, and `lint:design`.
- **Adds one motif:** the ledger. Ruled columns, running totals, aligned figures, the surveyor's area table. Lines and alignment only; no boxes. Decide the rule weights and the column rhythm, and whether figures in the ledger are set in Plex tabular numerals or in `Tex`.
- **Defines the energy grammar:** a square of side |a| as the unit; hatch fill for area (density, not colour, carries magnitude); the frame for a budget; the energy rectangle (rows × columns) and its reflection; the nested rectangles of the recursion with a shared diagonal. Specify stroke weights for square outlines versus frames versus the budget line.
- **Does not** add an accent colour. Gilt remains the target and the claim; ember the debt; verdigris the arithmetic.

**Frames to render for the board** (from the film's own components, as v2 did): title card; "energy is area" (random walks as squares, the frame of area N); the rows + columns law; the family field at small scale (N3, computed); the Poisson reflection of the energy rectangle; the theta reflection on the upper half-space; the ledger of the recursion; the exponent dial; the end card. Each with the rule it demonstrates in its caption.

**Audio.** Same narrator for series continuity. If music is used, keep it below the narration and absent under equations, as v2.

---

## 8. Narration guidance

- Voice and register as v2: declarative, concrete, one idea per sentence, the fractions spoken ("eleven twelfths", "five theta over twelve"), no "we", no "obviously", no "simply".
- Define on first use: energy, budget, row, column, orthogonal, square-root cancellation, dual, Gauss sum, theta function, large sieve, completion, transfer, positive gap. Each gets one spoken sentence and one on-screen line.
- Name the papers as v2 does: "the October manuscript", "the September manuscript". Attribute: "the paper calls this the mean-square estimate".
- The word "budget" is a metaphor; say once in chapter 1 that it is the film's word, and thereafter use it freely.
- Spoken forms to fix in `spoken()`: 𝓗 "script H"; ϑ "theta"; χₙ(u) "chi n of u"; γ₂ "gamma two"; L_b "L sub b"; (ML)^{2/3} "M L together, to the two thirds"; H_c "H sub c"; E(𝓗, X) "the energy at script H and X".
- Echoes to plant deliberately: positivity (used to spend in ch. 4, used to enlarge in ch. 7); rows + columns (introduced in ch. 2, paid in ch. 6); "a fact about none of them, a fact about all of them" (open and close).
- Keep the disclaimer sentence verbatim from v2 in the open and the close.

---

## 9. Accuracy guardrails

Claims that are easy to get wrong; check each against the LaTeX before it reaches the narration or the screen.

1. The budget is Σ_{0<N(u)≤H}|A_u(D)|² ≪ D^{1+ε}H = D^{2+ϑ+ε}, with implied constants depending on ν, S, the support of W, ϑ, ε and on finitely many derivatives of W (Proposition 3.1). Never "D times H exactly".
2. Rows: elements u ∈ 𝒪, 0 < N(u) ≤ H. Columns: ideals prime to S via primary generators. ϑ fixed in (0, 1/10].
3. Copies: χₙ(p⁶) = 𝟙_{p∤n}; |A₁ − A_{p⁶}| ≪_W D/Y; J ≍ Y/log Y by Landau's prime ideal theorem; Y = H^{1/6}. The spend chain exactly as in §3 (`eq:prime-extract`).
4. Terminology: the papers say "mean square"; "energy" appears in the September section titles and the October LaTeX labels; "energy budget" is the film's phrase.
5. Dual rows 𝓗 ≍ D²/H; at H = D^{1+ϑ}, 𝓗 ≍ D^{1−ϑ}. The Poisson comparison is schematic (diagonal, zero frequency, smooth weights, fixed twists suppressed).
6. The Gauss identity: μ(n)γ₋₁(n) = χₙ(−1)G(n)⁻¹ ᾱ(n) γ₂(n), α(n) = n/|n|, G(n) = \overline{χₙ(4)}γ₃(n), for squarefree primary n away from excluded primes (Appendix A).
7. Kubota's cubic theta function lives on hyperbolic three-space and is a residue of a cubic metaplectic Eisenstein series; Patterson's coefficient formula as in §2.4; completion to nb³ follows Dunn–Radziwiłł.
8. The twist: χ_p⁻¹χ_p⁻² = χ_p⁻³ = χ_p³, quadratic. The quadratic large sieve: (𝓗 + U)(𝓗U)^ε Σ|β|² (Goldmakher–Louvel Theorem 1.1, Lemma `lem:quadratic`). The higher-order sieve's extra term is (ML)^{2/3} (Blomer–Goldmakher–Louvel Theorem 1.3).
9. The completed bound: 𝓗 + 𝓗²N(f)/X, up to D^ε and derivatives of W (Proposition `prop:R`).
10. Cube inversion, the cutoff H_c³ = min(X, X²/𝓗²), the remainder at L_b = X/N(b)³ with rows unchanged, the enlargement to Y = XL_b/𝓗 justified by nonnegativity, 𝓗′ = 𝓗L_b/X, the shrink 𝓗′ ≪ D^{−2ϑ}𝓗, O_ϑ(1) steps, endpoint "row parameter at most 1, counting" (§2.5, §5, §7).
11. The full family 𝓔(𝓗, X, F) carries f-twists χₙ(f)⁴ and the normalization 1/(XF); Proposition `prop:canonical` needs the positive gap 𝓗 ≤ XF·D^{−κ}. The sketch suppresses this; the film may too, once it has said so.
12. Do not claim the budget or 11/12 is sharp for the method. The September route reaches 7/8 by different means and is a coda here, not a chapter.
13. Classical facts (Parseval, Rayleigh's energy theorem, Plancherel, Linnik–Bombieri–Montgomery large sieve, Chebyshev's inequality, Pythagoras) are not in the manuscripts' bibliographies. Cite "Classical" on screen as v2 does, and verify any date against Iwaniec–Kowalski or Montgomery–Vaughan before narrating it. Prefer no dates to wrong dates.
14. Section and result numbers in this brief are inferred from the order of the LaTeX; the labels are exact. Likely numbering, to confirm against `paper2.pdf`: Prop 3.1 = `thm:ms`; Prop 4.4 = `prop:poisson-reduction`; Prop 5.1 = `prop:canonical`; Prop 5.2 = `prop:R`; Lemma 5.3 = `lem:cube-reduction`; Prop 5.4 = `prop:transfer`; Prop 6.2 = `lem:reflection`; Lemma 6.5 = `lem:quadratic`; Appendix A = `sec:arithmetic`. Confirm each before it appears in a `Cite`.

---

## 10. Production notes

- **Where the code goes.** Recommended: the film is a second composition in `studio/`, reusing `src/design/*` and `src/diagrams/*` untouched. Add `src/energy/` with its own `script.ts`, scenes, and a film component; parametrize `timeline.ts` and `cues.tsx` by a film object so both films share one clock implementation; register `Energy` in `Root.tsx`. `AUTHORING.md` forbids editing the shared files for v2 scenes; this is a deliberate refactor, so note it in the report and keep `Film` rendering byte-identical (re-render a contact sheet of v2 to confirm). Fallback if the refactor is unwelcome: copy `studio/` to `studio-energy/` minus scenes and narration.
- **Outputs.** Publish to `energy/` beside `v2/`: `The-Energy-Budget.mp4`, `poster.jpg`, `transcript.txt`, `subtitles.srt`, `subtitles.vtt`, `chapters.json`, `edition.json`, `index.html` (same player as v2 with the chapter guide and "Source:" lines). Add the film to the root `README.md` and cross-link from `v2/index.html`.
- **Checks** as in `AUTHORING.md`: `npx tsc --noEmit`, `node scripts/lint-design.mjs`, contact sheets for every scene at 0.1 / 0.4 / 0.7 / 0.95, transcript diff against ElevenLabs timestamps, loudness as `v2/edition.json`.
- **Chapters file.** Same schema as `v2/chapters.json`; ids: `open`, `energy`, `family`, `demands`, `spend`, `dual`, `theta`, `recursion`, `price`, `close`.

---

## 11. Open decisions

1. **Title.** Recommended *The Energy Budget*; alternatives in the header.
2. **The small-scale family computation (N3).** Recommended yes; it is the only computed figure that shows a real family, and the film is honest about its limits. Skip it only if the ℤ[ω] implementation stalls; then chapter 2 uses a schematic field as v2 did.
3. **The September coda.** Recommended as written: one minute inside chapter 8 and chapter 4. Expanding it to a full chapter would push past 21 minutes and would need the reflected-energy sections of the September paper in detail.
4. **Prerequisite recaps.** Recommended one or two sentences each with on-screen pointers to v2, not re-explanations.
5. **Narrator.** Recommended the same Sarah voice for series continuity.
