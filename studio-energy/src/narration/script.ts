// The film's narration. Each passage is one ElevenLabs request; each scene
// is one visual composition. `text` is what captions and the transcript show;
// the spoken form is derived by `spoken()` (pronunciation fixes, one word for
// one word, so caption words and timestamp words stay aligned).
//
// Sources: October = "The Quasi-Riemann Hypothesis", 5 Oct 2026 (Re s > 11/12);
// September = "The Quasi-Riemann Hypothesis: A Zero-Free Half-Plane Re(s) > 7/8",
// 30 Sep 2026. Every factual sentence below was checked against their LaTeX
// sources; numbers about the computed family come from src/data/numerics.json
// and are asserted in the scenes that show them.

export type Passage = {
	id: string;
	text: string;
	dir?: string; // ElevenLabs v4 delivery tag, e.g. 'thoughtful'
};

export type Scene = {
	id: string;
	passages: Passage[];
};

export type Chapter = {
	id: string;
	index: string; // shown in the locator
	title: string;
	scenes: Scene[];
};

// The disclaimer, verbatim from The Fixed Frontier (its passage open-7).
const DISCLAIMER = 'This film explains how the arguments work. It does not certify that they are correct. That is the work of careful readers, and it takes time.';

export const CHAPTERS: Chapter[] = [
	{
		id: 'open',
		index: '',
		title: 'A thousand coins',
		scenes: [
			{
				id: 'open-walk',
				passages: [
					{
						id: 'open-1',
						dir: 'curious',
						text: 'Flip a coin a thousand times. Count plus one for heads and minus one for tails, and keep a running total. The total wanders. This walk ends at four. The next ends at twenty, and the one after that at minus thirty-two. Before the first flip, nobody can say where a walk will finish.',
					},
				],
			},
			{
				id: 'open-squares',
				passages: [
					{
						id: 'open-2',
						text: 'So ask a different question. Square each final total, so the sign no longer matters, and average the squares over many walks. After a handful of walks the average jumps around. After four thousand, it has settled near one thousand: the number of steps.',
					},
					{
						id: 'open-3',
						dir: 'thoughtful',
						text: 'That is a fact about none of the walks, and a fact about all of them. It does not say where any single walk ends. It says how much room the walks take up together.',
					},
				],
			},
			{
				id: 'open-claim',
				passages: [
					{
						id: 'open-4',
						text: 'The October quasi-Riemann manuscript rests on one estimate of this kind, for a family of sums that nobody can compute one at a time. Spending it takes one paragraph. Proving it takes most of the paper. This film is about that estimate: what it means, how it is spent, and how it is earned.',
					},
					{id: 'open-5', text: DISCLAIMER},
				],
			},
		],
	},
	{
		id: 'energy',
		index: '1',
		title: 'What energy means',
		scenes: [
			{
				id: 'energy-squares',
				passages: [
					{
						id: 'energy-1',
						text: 'Start with the word. An energy, in this film, is a sum of squares. Take a list of numbers, square each one, and add. A square is never negative, so it forgets the sign and keeps only the size. Draw each number as a square whose side is its size, and the energy is the total area.',
					},
				],
			},
			{
				id: 'energy-why',
				passages: [
					{
						id: 'energy-2',
						text: 'Why squares, and not plain sizes? Because squares add up over perpendicular pieces. That is Pythagoras: the square on the long side equals the two squares on the short sides. Fourier analysis obeys the same law. Split a signal into waves, and its energy equals the total energy of the waves. That is Parseval’s identity, and it is why physicists call the integral of a signal squared its energy. The word stuck.',
					},
				],
			},
			{
				id: 'energy-grid',
				passages: [
					{
						id: 'energy-3',
						text: 'Now square a sum of N terms. The square spreads into a grid of N squared products. The N products on the diagonal are the terms squared, and they are never negative. All the cancellation lives off the diagonal, in the cross terms, where a plus can meet a minus.',
					},
					{
						id: 'energy-4',
						text: 'For random signs, the cross terms average out to nothing. Only the diagonal survives, so the energy is about N, and a typical sum has size about the square root of N. That is square-root cancellation, the benchmark for every sum in this film.',
					},
				],
			},
			{
				id: 'energy-mertens',
				passages: [
					{
						id: 'energy-5',
						text: 'Arithmetic is not random, but it can look it. Here is the Mertens function, the running total of Möbius signs, computed to twelve hundred, and its square beside the line y equals x. A picture proves nothing. A bound of x to the one half plus epsilon for this function is equivalent to the Riemann hypothesis.',
					},
				],
			},
			{
				id: 'energy-budget',
				passages: [
					{
						id: 'energy-6',
						text: 'Now take a whole family of sums and add the squares of all of them. An upper bound for that total is what this film calls an energy budget. The manuscripts call it a mean-square estimate, and the word energy appears in their labels and section titles. A budget says nothing about any one member. An energy is a sum of squares. A budget is a promise about the sum.',
					},
				],
			},
		],
	},
	{
		id: 'family',
		index: '2',
		title: 'Why a family',
		scenes: [
			{
				id: 'family-target',
				passages: [
					{
						id: 'family-1',
						text: 'The sum the October proof needs is called A one of D. It adds Möbius values, weighted by a fixed character, nu, over the ideals of the Eisenstein integers with norm about D. It has about D terms. The goal is to show that it is much smaller than D, because enough cancellation in it rules out zeros of an L-function. The Fixed Frontier explains why, in its chapters two and six.',
					},
				],
			},
			{
				id: 'family-table',
				passages: [
					{
						id: 'family-2',
						text: 'One sum on its own is hard, because nothing controls its cross terms. A family is easier. Lay it out as a table: each row is one member of the family, and each column is one term. The paper uses exactly these words, rows and columns.',
					},
					{
						id: 'family-3',
						text: 'Square every row and add. Swap the order of summation, and each cross term pairs two columns, averaged over all the rows. If different columns are orthogonal, like perpendicular directions, that average is small. The family cancels the cross terms for you.',
					},
				],
			},
			{
				id: 'family-shape',
				passages: [
					{
						id: 'family-4',
						text: 'This gives budgets a characteristic shape. The energy is at most the number of rows plus the number of columns, times the energy of the coefficients, up to tiny losses. The classical example is the large sieve.',
					},
					{
						id: 'family-5',
						text: 'And rows plus columns cannot be beaten. Put all the weight on one column, and every row sees it: the energy is the number of rows. Let one row be blind to the differences between columns, and that row alone collects them all: the energy is the number of columns. A budget of this shape is as good as a budget gets.',
					},
				],
			},
			{
				id: 'family-ms',
				passages: [
					{
						id: 'family-6',
						text: 'The paper’s family twists the target by a sextic phase, chi n of u. The rows are Eisenstein integers u with norm up to H, where H is D to the one plus theta, a little more than D. The columns are the ideals n with norm about D. Proposition 3.1 says that the energy of all the rows together is at most about D times H.',
					},
					{
						id: 'family-7',
						text: 'There are about H rows, so a typical row has energy about D and size about the square root of D. That is square-root cancellation, on average. A budget is cheaper than a bound. You pay for it with orthogonality, and you get it for the whole family at once.',
					},
				],
			},
			{
				id: 'family-field',
				passages: [
					{
						id: 'family-8',
						text: 'Here is a real family, computed at a small scale: D equal to two thousand, with 15,528 rows and 847 columns. Each square is one row. No row stands out: the largest is about three times the typical size. And the total comes within five percent of what random signs would give.',
					},
					{
						id: 'family-9',
						dir: 'thoughtful',
						text: 'At a scale this small, that tests nothing about the paper’s claim. It shows only what a budget looks like when it holds.',
					},
				],
			},
		],
	},
	{
		id: 'demands',
		index: '3',
		title: 'Two demands',
		scenes: [
			{
				id: 'demands-tension',
				passages: [
					{
						id: 'demands-1',
						text: 'A family has two jobs, and they pull in opposite directions. To prove a budget, the members must differ: orthogonality is what pays for it. To use a budget on one sum, that sum must appear in the family many times: the members must agree.',
					},
				],
			},
			{
				id: 'demands-sextic',
				passages: [
					{
						id: 'demands-2',
						text: 'The sextic phase does both. Fix a column n and let u run. Chi n of u is a sixth root of one, or zero, and it changes with u. Different columns change differently, so they are orthogonal. That is diversity.',
					},
					{
						id: 'demands-3',
						text: 'Now set u equal to p to the sixth, for a prime p. A sixth root of one, raised to the sixth power, is one. So every phase becomes one, except on the terms that p divides, where it is zero. If p has norm about Y, that row is the target minus about D over Y terms. That is repetition.',
					},
				],
			},
			{
				id: 'demands-ladder',
				passages: [
					{
						id: 'demands-4',
						text: 'The price of repetition is rarity. Copies sit only at sixth powers. For p to the sixth to be a row, the norm of p can be at most H to the one sixth. Call that Y. So the family holds about Y copies of the target, up to a logarithm, not H of them.',
					},
					{
						id: 'demands-5',
						text: 'Here is some of this film’s own arithmetic, not a claim from the paper. If the twist had order k instead of six, the copies would sit at p to the k, and the same spending would give the exponent on the dial. At k equal to six, it is eleven twelfths, plus five theta over twelve. Lower orders give more copies and smaller exponents.',
					},
					{
						id: 'demands-6',
						dir: 'thoughtful',
						text: 'At the bottom of the dial, with no twist at all, every row would be nearly the target, and a budget of the same shape would give the Riemann hypothesis for this L-function. But that family has no orthogonality, and nobody can prove its budget. The sixth power is where provable meets useful: diverse enough to prove, repetitive enough to spend.',
					},
				],
			},
		],
	},
	{
		id: 'spend',
		index: '4',
		title: 'Spending it',
		scenes: [
			{
				id: 'spend-copies',
				passages: [
					{
						id: 'spend-1',
						text: 'Here is how the budget is spent. Take every primary prime p with norm between Y over two and Y. Landau’s prime ideal theorem says there are about Y over log Y of them. Call that number J. Their sixth powers are distinct rows, and each of those rows is the target, up to an error of about D over Y.',
					},
				],
			},
			{
				id: 'spend-drop',
				passages: [
					{
						id: 'spend-2',
						text: 'The budget covers every row. Keep only the J copies and drop the rest. That is allowed because every row contributes a square, and squares are never negative, so what is left is at most the whole. You may drop any part of an energy, because every part is a square. What you keep is the target, many times over.',
					},
				],
			},
			{
				id: 'spend-chain',
				passages: [
					{
						id: 'spend-3',
						text: 'For each copy, the target squared is at most twice the copy squared, plus twice the error squared. Average over the J copies. The target squared is at most two over J times the energy of the copies, plus the error squared. And the energy of the copies is at most the budget.',
					},
					{
						id: 'spend-4',
						dir: 'confident',
						text: 'Put in the numbers. The budget is D to the two plus theta. Dividing by J removes a factor of about Y, the sixth root of H. What remains is D to the eleven sixths, plus five theta over six. The error term is D to the five thirds, minus theta over three, which is smaller. Take the square root: eleven twelfths, plus five theta over twelve. Then let theta be small.',
					},
				],
			},
			{
				id: 'spend-outliers',
				passages: [
					{
						id: 'spend-5',
						text: 'There is a second way to spend a budget. If the total is at most B, then at most B over T squared rows can exceed T, because each of them alone uses T squared. Counting outliers this way is how zero-density estimates work, and it is how the September manuscript spends its own estimates, as the last chapter shows.',
					},
				],
			},
		],
	},
	{
		id: 'dual',
		index: '5',
		title: 'Proving it, I: the dual side',
		scenes: [
			{
				id: 'dual-method',
				passages: [
					{
						id: 'dual-1',
						text: 'Now the hard part: earning the budget. Nobody can compute these sums one by one, so the proof never does. It transforms the energy instead. A Fourier transform keeps the total energy and scrambles everything else. That is Plancherel’s theorem, and it is why the proof works with energies rather than with single sums.',
					},
				],
			},
			{
				id: 'dual-poisson',
				passages: [
					{
						id: 'dual-2',
						text: 'Expand the squares. Each cross term pairs two columns, n and m, and sums the product of their phases over all the rows u in a disk. Poisson summation rewrites a sum over positions as a sum over frequencies. The sum over u becomes a sum over a new variable, h, the dual row.',
					},
					{
						id: 'dual-3',
						text: 'And the row range flips. H rows become about D squared over H dual rows. Call that number script H. With H equal to D to the one plus theta, script H is D to the one minus theta. The two row ranges always multiply to D squared. Now there are fewer rows than columns.',
					},
				],
			},
			{
				id: 'dual-gauss',
				passages: [
					{
						id: 'dual-4',
						text: 'The Fourier transform of a sextic phase is a Gauss sum: roots of one, weighted by waves, added up. For ordinary integers there is a classical identity: the square of a quadratic Gauss sum is just a sign. The paper uses a sextic relative of it, after Hasse and Heath-Brown.',
					},
					{
						id: 'dual-5',
						text: 'It says that the Möbius value times a sextic Gauss sum equals a cubic Gauss sum, up to factors of size one. The Möbius function has been absorbed. Checked here at twenty-two primes, the two sides agree to fourteen decimal places. What is left is a new family, B h of X: cubic Gauss sums as coefficients, twisted by phases in h, up to fixed twists that the outline suppresses.',
					},
				],
			},
			{
				id: 'dual-target',
				passages: [
					{
						id: 'dual-6',
						text: 'Schematically, the original energy is at most D times H, plus H over D times the energy of the new family over the dual rows. So the budget now asks for this: the energy of B, over script H rows, at most about D squared. Poisson summation does not shrink the energy. It moves it to a side where the rows are short and the coefficients are Gauss sums, which have a theory.',
					},
				],
			},
		],
	},
	{
		id: 'theta',
		index: '6',
		title: 'Proving it, II: the theta function pays',
		scenes: [
			{
				id: 'theta-kubota',
				passages: [
					{
						id: 'theta-1',
						text: 'Cubic Gauss sums are not random. Kubota and Patterson showed that they are the Fourier coefficients of a cubic theta function, an automorphic form on three-dimensional hyperbolic space. Automorphic forms have symmetry, and symmetry gives a transformation law.',
					},
					{
						id: 'theta-2',
						text: 'The law wants every index the theta function contains: each square-free n, and also n times b cubed, for every b. The family B h has only the square-free indices. So the proof completes the sum, adding the cube terms, to make a new sum, T h of X. The rows are unchanged. The cube terms are borrowed, and chapter seven pays them back.',
					},
				],
			},
			{
				id: 'theta-quadratic',
				passages: [
					{
						id: 'theta-3',
						text: 'Then the transformation acts. A long sum over n, with norm about X, becomes a shorter dual sum over a new variable, m. And the twist changes character. At each prime dividing h, the Fourier side contributed chi to the minus one, and the theta side contributes chi to the minus two.',
					},
					{
						id: 'theta-4',
						dir: 'curious',
						text: 'Together that is chi to the minus three, which equals chi cubed. And a sixth root of one, cubed, is plus or minus one. The twist is now quadratic. A sixth-order twist, cubed, is a sign, and signs are what the sharpest sieve can price.',
					},
				],
			},
			{
				id: 'theta-sieve',
				passages: [
					{
						id: 'theta-5',
						text: 'Goldmakher and Louvel’s quadratic large sieve, building on Heath-Brown, gives rows plus columns, up to tiny losses: the shape from chapter two, now paying the bill. The completed energy comes in at script H, plus script H squared over X. At the basic scales, that is within budget.',
					},
				],
			},
			{
				id: 'theta-why',
				passages: [
					{
						id: 'theta-6',
						text: 'Why insist on quadratic? For a family with M rows and L columns, the general sieve for higher-order characters carries an extra term: M L together, to the two thirds. Here the rows are D to the one minus theta, and the dual columns are D to the one minus two theta. Rows plus columns is about D to the one minus theta. The extra term is D to the four thirds, minus two theta, larger by a power of D. With it, the count would fail.',
					},
				],
			},
		],
	},
	{
		id: 'recursion',
		index: '7',
		title: 'Proving it, III: the debt and the recursion',
		scenes: [
			{
				id: 'rec-debt',
				passages: [
					{
						id: 'rec-1',
						text: 'Completion borrowed the cube terms, and they must be returned. They cannot simply be dropped, because contributions from different cubes can cancel. Möbius inversion returns them exactly: the sum the proof needs is a weighted sum of completed sums, at the smaller column scales X over the norm of d, cubed.',
					},
				],
			},
			{
				id: 'rec-split',
				passages: [
					{
						id: 'rec-2',
						text: 'For small d, Cauchy–Schwarz and the completed bound pay directly, up to a cutoff, H sub c. At the basic scales, the cutoff is D to the two theta over three. Here theta earns its keep for the first time.',
					},
					{
						id: 'rec-3',
						text: 'Large d leave remainders: energies of the same kind, at a shorter column scale, L sub b, equal to X over the norm of b, cubed. But the rows have not shrunk, and the bound still required is X. That is not progress yet.',
					},
				],
			},
			{
				id: 'rec-transfer',
				passages: [
					{
						id: 'rec-4',
						text: 'So the proof applies Poisson summation twice more. The first, in h, produces new rows, y, with norm up to L sub b squared over script H. Then it deliberately enlarges that row range, which is allowed because every term is a square, and squares are never negative. It is the same positivity that let the budget be spent.',
					},
					{
						id: 'rec-5',
						text: 'The second Poisson summation brings the rows back shorter, and the coefficients return to cubic Gauss sums. Both scales have shrunk by the norm of b cubed, and their ratio is unchanged. This is the transfer estimate.',
					},
				],
			},
			{
				id: 'rec-ladder',
				passages: [
					{
						id: 'rec-6',
						text: 'Now the bound runs as a recursion. The energy at one level, measured against its column scale, is at most one plus the same measure one level down. Because the norm of b exceeds the cutoff, each level shrinks the rows by at least a factor of D to the two theta. After a bounded number of levels, depending only on theta, the row parameter is at most one, and plain counting finishes the job.',
					},
					{
						id: 'rec-7',
						dir: 'confident',
						text: 'The full proof carries extra twists, common factors, and dyadic ranges through every step, by Heath-Brown’s admissible-exponent method. But the skeleton is this. The proof never pays the energy outright. It pays a bounded number of instalments, each at a smaller scale, and the last one is small enough to count.',
					},
				],
			},
		],
	},
	{
		id: 'price',
		index: '8',
		title: 'The price of the budget',
		scenes: [
			{
				id: 'price-theta',
				passages: [
					{
						id: 'price-1',
						text: 'Every step had a price. Theta is the fuel. It makes the dual rows shorter than the columns, the positive gap that the iteration needs, and it makes the recursion shrink. It costs five theta over twelve in the exponent, so it is kept small, but never zero. Epsilon is the friction: every sieve loses a tiny power, and a bounded number of steps loses a bounded number of them.',
					},
				],
			},
			{
				id: 'price-september',
				passages: [
					{
						id: 'price-2',
						text: 'The September manuscript runs the same idea at a larger scale. Its reflected-energy bounds control completed theta rows, and two moment bounds, each proved by its own recursion, limit how many rows a zero detector can flag. A budget spent by counting outliers, with several accounts open at once. Keep theta positive and small, pay epsilon a bounded number of times, and the ledger closes.',
					},
				],
			},
		],
	},
	{
		id: 'close',
		index: '',
		title: 'The ledger closes',
		scenes: [
			{
				id: 'close-ledger',
				passages: [
					{
						id: 'close-1',
						dir: 'thoughtful',
						text: 'So, an energy budget. An energy is a sum of squares, and a budget is a promise about the total: a fact about none of the members, and a fact about all of them.',
					},
					{
						id: 'close-2',
						text: 'It can be proved, because transforms preserve energy and one sharp inequality prices it. It is useful, because arithmetic plants copies of the target inside the family. And it is spent by the one rule every square obeys: no part of it is ever negative.',
					},
					{id: 'close-3', text: DISCLAIMER},
				],
			},
		],
	},
];

// Pronunciation: one written word to one spoken word, so captions and
// timestamps keep the same word count.
const SAY: [RegExp, string][] = [
	[/\bChi\b/g, 'Kai'],
	[/\bchi\b/g, 'kai'],
	[/\bmu\b/g, 'mew'],
	[/\bnu\b/g, 'new'],
	[/\b15,528\b/g, 'fifteen-thousand-five-hundred-twenty-eight'],
	[/\b847\b/g, 'eight-hundred-forty-seven'],
	[/\b3\.1\b/g, 'three-point-one'],
];

export const spoken = (text: string): string => SAY.reduce((t, [re, s]) => t.replace(re, s), text);

export const allPassages = (): (Passage & {scene: string; chapter: string})[] =>
	CHAPTERS.flatMap((c) => c.scenes.flatMap((s) => s.passages.map((p) => ({...p, scene: s.id, chapter: c.id}))));
