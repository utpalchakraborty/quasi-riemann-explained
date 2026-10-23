// The film's narration. Each passage is one ElevenLabs request; each scene
// is one visual composition. `text` is what captions and the transcript show;
// the spoken form is derived by `spoken()` (pronunciation fixes, one word for
// one word, so caption words and timestamp words stay aligned).
//
// Sources: October = "The Quasi-Riemann Hypothesis", 5 Oct 2026 (Re s > 11/12);
// September = "The Quasi-Riemann Hypothesis: A Zero-Free Half-Plane Re(s) > 7/8",
// 30 Sep 2026. Every factual sentence below was checked against them.

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

export const CHAPTERS: Chapter[] = [
	{
		id: 'open',
		index: '',
		title: 'A border that shrinks',
		scenes: [
			{
				id: 'open-riemann',
				passages: [
					{
						id: 'open-1',
						dir: 'thoughtful',
						text: 'In 1859, Bernhard Riemann wrote an eight-page paper that tied the prime numbers to the zeros of a single function, the zeta function. The zeros that matter lie in a narrow strip of the complex plane, between zero and one. Riemann guessed that all of them sit on one line, the line one half. That guess is still open.',
					},
					{
						id: 'open-2',
						text: 'Computers have since located more than ten trillion of these zeros. Every one of them lies exactly on that line.',
					},
				],
			},
			{
				id: 'open-border',
				passages: [
					{
						id: 'open-3',
						dir: 'curious',
						text: 'But checking zeros proves nothing about all of them. What mathematicians can prove is more modest: a region near the right edge of the strip where no zero can be. In 1896 that region was only the edge itself, the line sigma equals one, and that was enough to prove the prime number theorem.',
					},
					{
						id: 'open-4',
						text: 'Three years later, de la Vallée Poussin widened it into a sliver. The trouble is the shape of the sliver. As you climb to greater heights, it gets thinner, and it thins toward nothing. The best version we have, from Vinogradov and Korobov in 1958, still does.',
					},
				],
			},
			{
				id: 'open-claim',
				passages: [
					{
						id: 'open-5',
						dir: 'thoughtful',
						text: 'For a hundred and sixty-seven years, no one could prove that any fixed vertical line, short of one, keeps every zero away. That statement is called a quasi-Riemann hypothesis.',
					},
					{
						id: 'open-6',
						dir: 'confident',
						text: 'In the autumn of 2026, OpenAI released two manuscripts that claim to prove it. The first, dated September thirtieth, claims that no zero lies to the right of seven eighths. The second, five days later, isolates a simpler proof of a weaker line, eleven twelfths. Both lines hold at every height, and for every Dirichlet L-function, not only zeta.',
					},
					{
						id: 'open-7',
						text: 'This film explains how the arguments work. It does not certify that they are correct. That is the work of careful readers, and it takes time.',
					},
				],
			},
		],
	},
	{
		id: 'moves',
		index: '',
		title: 'The proof in four moves',
		scenes: [
			{
				id: 'moves-map',
				passages: [
					{
						id: 'moves-1',
						dir: 'curious',
						text: 'Here is the whole argument on one map. We will follow the eleven twelfths proof, because it is the cleanest, and then see what the seven eighths proof adds. There are four moves, and an engine underneath.',
					},
				],
			},
			{
				id: 'moves-1',
				passages: [
					{
						id: 'moves-2',
						text: 'Move one turns a question about zeros into a question about cancellation. Take one over the L-function. Its series is built from Möbius signs: plus one, minus one, or zero. If those signs cancel strongly enough, one over L stays finite and smooth in a wider region. But a zero of L would make one over L blow up. So enough cancellation means no zeros.',
					},
				],
			},
			{
				id: 'moves-2',
				passages: [
					{
						id: 'moves-3',
						text: 'Move two hides the target sum inside a family. The proof moves to a number system with six-fold symmetry and gives the sum a twist, a phase that depends on a new parameter, u. Our sum is the member with u equal to one. The family as a whole obeys an energy budget: add up the squares of all its members, and the total is about what random signs would give.',
					},
				],
			},
			{
				id: 'moves-3',
				passages: [
					{
						id: 'moves-4',
						text: 'Move three makes copies. When u is the sixth power of a prime, the twist almost disappears, and that member of the family nearly equals the target. There are many such primes, so the target appears many times inside the budget.',
					},
				],
			},
			{
				id: 'moves-4',
				passages: [
					{
						id: 'moves-5',
						dir: 'confident',
						text: 'Move four is arithmetic. If the target were large, every copy would be large, and together they would overspend the budget. Count the copies, divide the budget among them, and take a square root. The target can be no bigger than about D to the eleven twelfths. Feed that into move one, and no zero survives to the right of eleven twelfths.',
					},
				],
			},
			{
				id: 'moves-engine',
				passages: [
					{
						id: 'moves-6',
						text: 'Everything rests on the energy budget, and that is the hard part. It comes from an engine: Poisson summation, which trades positions for frequencies; cubic Gauss sums; a theta function from the theory of automorphic forms; a large sieve for quadratic characters; and a recursion that shrinks the problem until it is small enough to count.',
					},
					{
						id: 'moves-7',
						text: 'The September manuscript reaches seven eighths by a second route, which begins where this one ends. Now, the pieces, one at a time.',
					},
				],
			},
		],
	},
	{
		id: 'primes',
		index: '1',
		title: 'Why zeros know about primes',
		scenes: [
			{
				id: 'primes-euler',
				passages: [
					{
						id: 'primes-1',
						dir: 'curious',
						text: 'First, why should zeros know anything about primes? For sigma greater than one, zeta of s is a sum over all whole numbers, and also a product over all primes. Expand the product and every whole number appears exactly once, because every whole number factors into primes in exactly one way.',
					},
					{
						id: 'primes-2',
						text: 'That identity, Euler’s product, is the bridge. The zeros of zeta control how the primes are spread out, and how far the zeros keep from the line sigma equals one controls how accurately we can count them.',
					},
				],
			},
			{
				id: 'primes-characters',
				passages: [
					{
						id: 'primes-3',
						text: 'Dirichlet’s L-functions do the same for primes in arithmetic progressions. A character, like this one modulo four, weights each number by plus one, minus one, or zero according to its remainder. The manuscripts claim their line for every one of these functions at once, the same line whatever the modulus.',
					},
				],
			},
		],
	},
	{
		id: 'cancel',
		index: '2',
		title: 'From zeros to cancellation',
		scenes: [
			{
				id: 'cancel-mobius',
				passages: [
					{
						id: 'cancel-1',
						text: 'The Möbius function, mu, supplies the signs in one over zeta. It is zero when the number is divisible by a square bigger than one. Otherwise it is minus one, raised to the number of prime factors. Six gets plus one, thirty gets minus one, and twelve gets zero.',
					},
				],
			},
			{
				id: 'cancel-walk',
				passages: [
					{
						id: 'cancel-2',
						text: 'Add the signs up and you get the Mertens function, M of x. Here it is, computed up to twelve hundred. Across twelve hundred terms, the total never strays more than fifteen from zero.',
					},
					{
						id: 'cancel-3',
						text: 'A bound like x to the alpha, with alpha less than one, is what cancellation means in numbers. No picture can prove one.',
					},
				],
			},
			{
				id: 'cancel-bridge',
				passages: [
					{
						id: 'cancel-4',
						dir: 'thoughtful',
						text: 'Here is the bridge. Partial summation writes one over zeta as an integral of M of x against a power of x. If M of x grows no faster than x to the alpha, the integral converges whenever sigma exceeds alpha, so one over zeta is holomorphic there. It has no poles at all.',
					},
					{
						id: 'cancel-5',
						dir: 'confident',
						text: 'A zero of zeta at rho would be a pole of one over zeta. It cannot be both. That is the whole idea. The rest of the proof is about earning the cancellation.',
					},
				],
			},
		],
	},
	{
		id: 'eisenstein',
		index: '3',
		title: 'The Eisenstein world',
		scenes: [
			{
				id: 'eis-lattice',
				passages: [
					{
						id: 'eis-1',
						text: 'The proof does not attack zeta directly. It moves to a richer number system, the Eisenstein integers: numbers a plus b omega, where omega is a complex cube root of one. They form a triangular lattice, and they have six units, the six sixth roots of one.',
					},
					{
						id: 'eis-2',
						text: 'Every Dirichlet L-function reappears here as a factor of an L-function of this field. So a line proved here comes back down to zeta and all its relatives.',
					},
				],
			},
			{
				id: 'eis-target',
				passages: [
					{
						id: 'eis-3',
						text: 'In this world, the target is a smooth sum, A one of D: Möbius values, weighted by a fixed character nu, over ideals of norm about D. It has about D terms. The goal is to show that it is much smaller than D.',
					},
				],
			},
			{
				id: 'eis-family',
				passages: [
					{
						id: 'eis-4',
						dir: 'curious',
						text: 'Now the twist. Six-fold symmetry brings sextic residue symbols: for each n, a phase, chi n of u, that is always a sixth root of one, or zero. Insert it, and the single sum becomes a family, A u, one member for each u. Set u equal to one and every phase is one. That member is our target.',
					},
				],
			},
		],
	},
	{
		id: 'budget',
		index: '4',
		title: 'An energy budget',
		scenes: [
			{
				id: 'budget-ms',
				passages: [
					{
						id: 'budget-1',
						text: 'The central estimate of the October paper is about the whole family. Add up the squared sizes of A u, for every u with norm up to H. The total is at most about D times H, where H is a little bigger than D: D to the one plus theta, with theta small and positive.',
					},
					{
						id: 'budget-2',
						text: 'There are about H members, so a typical member has size about the square root of D. That is square-root cancellation, on average.',
					},
				],
			},
			{
				id: 'budget-outlier',
				passages: [
					{
						id: 'budget-3',
						dir: 'thoughtful',
						text: 'But an average says nothing about any single member. One huge sum can hide among many small ones, and the budget allows it. The member we care about, u equal to one, is a single row. To pin it down, we need the target to show up many times.',
					},
				],
			},
		],
	},
	{
		id: 'eleven',
		index: '5',
		title: 'Where eleven twelfths comes from',
		scenes: [
			{
				id: 'eleven-sixth',
				passages: [
					{
						id: 'eleven-1',
						text: 'Here is how. Take a prime p of the lattice, and set u equal to p to the sixth. A sixth-order phase raised to the sixth power is one. So the phase is one for every n, except the n that p divides, where it is zero.',
					},
					{
						id: 'eleven-2',
						text: 'The sixth-power row is the target, minus the terms divisible by p. If p has norm about Y, there are only about D over Y of those.',
					},
				],
			},
			{
				id: 'eleven-count',
				passages: [
					{
						id: 'eleven-3',
						text: 'How many copies are there? One for each prime with norm up to Y: about Y over log Y of them, by the prime ideal theorem. Their sixth powers have norm up to Y to the sixth, and to stay inside the family that must be at most H. So Y is H to the one sixth.',
					},
				],
			},
			{
				id: 'eleven-spend',
				passages: [
					{
						id: 'eleven-4',
						text: 'Now spend the budget. Each copy is the target, up to an error of about D over Y. So the copies together cost about Y over log Y times the target squared, and that cannot exceed D times H. Divide, and the target squared is at most D times H over Y, plus the error squared.',
					},
				],
			},
			{
				id: 'eleven-root',
				passages: [
					{
						id: 'eleven-5',
						dir: 'confident',
						text: 'Put in Y equals H to the one sixth, and H equals D to the one plus theta. D times H to the five sixths is D to the eleven sixths, plus five theta over six. Take the square root... eleven twelfths, plus five theta over twelve. The error term gives only about D to the five sixths, which is smaller.',
					},
					{
						id: 'eleven-6',
						text: 'Theta can be as small as we like, but it has to stay positive, because the engine needs it. So the target is at most D to the eleven twelfths plus epsilon, for every epsilon. That is the cancellation. Now we turn it into a statement about zeros.',
					},
				],
			},
		],
	},
	{
		id: 'contradiction',
		index: '6',
		title: 'The contradiction',
		scenes: [
			{
				id: 'contra-mellin',
				passages: [
					{
						id: 'contra-1',
						text: 'The sums are smooth, so the right tool is the Mellin transform: integrate A one of D against D to the minus s. The bound we just proved makes this integral converge for every s with real part above eleven twelfths, so the transform is holomorphic there.',
					},
					{
						id: 'contra-2',
						text: 'Where the real part exceeds one, you can compute it term by term. The answer is the Mellin transform of the window, W hat of s, divided by the L-function. Multiply through: L times the transform equals W hat, and that identity carries over to the whole half-plane beyond eleven twelfths.',
					},
				],
			},
			{
				id: 'contra-window',
				passages: [
					{
						id: 'contra-3',
						dir: 'thoughtful',
						text: 'Now suppose L had a zero, rho, beyond eleven twelfths. The proof aims the window at it: W of y is y to the minus rho, times a smooth bump, phi, that is never negative. Then W hat at rho is the integral of phi of y over y, a positive number.',
					},
					{
						id: 'contra-4',
						dir: 'excited',
						text: 'At rho, the left side is zero times something finite, which is zero. The right side is positive. Zero equals a positive number! So no such zero exists.',
					},
				],
			},
		],
	},
	{
		id: 'poisson',
		index: '7',
		title: 'The engine: Poisson and Gauss',
		scenes: [
			{
				id: 'poisson-swap',
				passages: [
					{
						id: 'poisson-1',
						text: 'Everything so far assumed the energy budget. Now for the engine that proves it. Expand the squares and apply Poisson summation in the row variable u. Poisson summation trades a sum over positions for a sum over frequencies. A long sum over u becomes a short sum over a new variable, h, with about D squared over H terms: D to the one minus theta.',
					},
				],
			},
			{
				id: 'poisson-gauss',
				passages: [
					{
						id: 'poisson-2',
						text: 'The Fourier transforms of the sextic phases are Gauss sums, and here the arithmetic helps. For ordinary integers, the square of a Gauss sum is just a sign. The paper uses a sextic relative of that identity, which goes back to Hasse and Heath-Brown.',
					},
					{
						id: 'poisson-3',
						text: 'It lets the Möbius values absorb a Gauss sum, and what is left are cubic Gauss sums. The problem becomes the energy of new sums, B h of X, built from cubic Gauss sums and twisted by phases in h.',
					},
				],
			},
		],
	},
	{
		id: 'theta',
		index: '8',
		title: 'The engine: a cubic theta function',
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
						text: 'To use it, the paper completes the sum. Alongside each square-free index n, it includes n times b cubed, for every b, which are exactly the terms the theta function contains. The transformation then turns a long sum over n into a short dual sum.',
					},
				],
			},
			{
				id: 'theta-quadratic',
				passages: [
					{
						id: 'theta-3',
						dir: 'curious',
						text: 'And the phases change character. At each prime dividing h, the Fourier side contributes chi to the minus one, and the theta side contributes chi to the minus two. Together that is chi to the minus three, which equals chi cubed. And the cube of a sixth-order phase is just plus or minus one. It is quadratic.',
					},
				],
			},
			{
				id: 'theta-sieve',
				passages: [
					{
						id: 'theta-4',
						text: 'That matters, because quadratic characters have the sharpest large sieve. For a family with M rows and L columns, it bounds the energy by M plus L, up to tiny losses. The general bound for higher-order characters carries an extra term, M times L to the two thirds, which would break the count. With the quadratic sieve, the completed sums come in on budget.',
					},
				],
			},
		],
	},
	{
		id: 'recursion',
		index: '9',
		title: 'The engine: a shrinking recursion',
		scenes: [
			{
				id: 'rec-debt',
				passages: [
					{
						id: 'rec-1',
						text: 'But completion borrowed something. The cube terms were never in the original sum. Möbius inversion takes them back out, and for small b that is harmless. For large b, it leaves remainders: energies of the same kind, at a smaller column scale, X over the norm of b cubed, but still over the full range of rows. That is not progress yet.',
					},
				],
			},
			{
				id: 'rec-shrink',
				passages: [
					{
						id: 'rec-2',
						text: 'So the paper applies Poisson summation twice more, after deliberately widening an intermediate sum, which is allowed because every term in it is non-negative. The result is the same kind of estimate, with both scales divided by the norm of b cubed. Rows and columns shrink together, and their ratio never changes.',
					},
					{
						id: 'rec-3',
						dir: 'confident',
						text: 'And the shrinking is real. Each step shrinks the row range by a factor of at least D to the two theta. Because theta is positive, a bounded number of steps brings every branch down to a size where simple counting is enough. That is why theta could be small, but never zero.',
					},
					{
						id: 'rec-4',
						text: 'The full proof carries extra twists, common factors, and changing weights through every step. But this is its skeleton, and it closes. The energy budget is proved, and eleven twelfths follows.',
					},
				],
			},
		],
	},
	{
		id: 'seven',
		index: '10',
		title: 'The second route, to seven eighths',
		scenes: [
			{
				id: 'seven-principle',
				passages: [
					{
						id: 'seven-1',
						text: 'The September manuscript goes further, with a different engine built around one principle. Let beta star be the largest real part of any zero, across all the Hecke L-functions of this field, or the supremum, if no zero attains it. Suppose beta star is bigger than a proposed line, sigma zero.',
					},
					{
						id: 'seven-2',
						text: 'For each target, the paper builds a sum that it can bound in two ways. Reflection, from the cubic theta transformation, bounds it directly. Poisson summation compares it with a signal that contains one over the target L-function. If both bounds hold, with margins that do not depend on the target, the reciprocal continues a fixed distance to the left of beta star.',
					},
					{
						id: 'seven-3',
						dir: 'confident',
						text: 'But by the definition of a supremum, some zero lies in that strip, and its reciprocal would have a pole there. Contradiction. So beta star is at most sigma zero.',
					},
				],
			},
			{
				id: 'seven-bootstrap',
				passages: [
					{
						id: 'seven-4',
						text: 'Part one of the paper runs this machine at eleven twelfths. Part two starts from that result, so it may assume that no zero lies beyond eleven twelfths, and it pushes further. It rebuilds the sum with compensating prime factors, uses two unequal averaging scales, and adds moment bounds for two kinds of Dirichlet polynomials, each proved by its own recursion.',
					},
					{
						id: 'seven-5',
						dir: 'thoughtful',
						text: 'The signal’s exponent moves from s minus two thirds to s minus eleven sixteenths, and the margins close at seven eighths. The stronger result is a bootstrap: the first line is the foothold for the second.',
					},
				],
			},
		],
	},
	{
		id: 'back',
		index: '11',
		title: 'Back to the primes',
		scenes: [
			{
				id: 'back-transfer',
				passages: [
					{
						id: 'back-1',
						text: 'Why does a theorem about this six-fold world settle questions about ordinary primes? Lift a Dirichlet character, chi, to the Eisenstein field through the norm. Its L-function splits into two ordinary ones: L of chi, and L of chi times the character modulo three. A zero of either factor would be a zero of the product. So the line transfers to every Dirichlet L-function, including zeta itself.',
					},
				],
			},
			{
				id: 'back-count',
				passages: [
					{
						id: 'back-2',
						text: 'Zeros control prime counts through the explicit formula, where a zero, rho, contributes a wave of size about x to the real part of rho. Keep every real part at most eleven twelfths, and the error in counting primes up to x, in any progression, is at most a constant times x to the eleven twelfths, times log x.',
					},
					{
						id: 'back-3',
						text: 'That holds for every modulus up to x, and the constant is absolute and effective: it could, in principle, be computed. For large moduli, that error can be bigger than the count itself, so this is not the last word on progressions. It also rules out Landau–Siegel zeros, the exceptional zeros that have shadowed the subject for nearly a century.',
					},
				],
			},
		],
	},
	{
		id: 'consequences',
		index: '12',
		title: 'What changes',
		scenes: [
			{
				id: 'cons-nonresidue',
				passages: [
					{
						id: 'cons-1',
						dir: 'curious',
						text: 'Some consequences are easy to state. Pick an odd prime, p. Half of the nonzero numbers modulo p are perfect squares, and half are not. How far must you search to find one that is not?',
					},
					{
						id: 'cons-2',
						text: 'Usually, not far. Among all the primes below a million, the worst case is first met at 366,791, where the first non-square is 43. Vinogradov conjectured that you never need to go beyond p to the epsilon. The September manuscript states that a fixed zero-free line gives much more: the first non-square is at most a fixed power of log p.',
					},
				],
			},
			{
				id: 'cons-list',
				passages: [
					{
						id: 'cons-3',
						text: 'That makes the search fast, so square roots modulo a prime can be found by a deterministic algorithm in polynomial time, with no coin flips. Miller’s primality test becomes deterministic and unconditional. And Euler’s list of sixty-five idoneal numbers, an open question since the eighteenth century, would be confirmed complete.',
					},
				],
			},
		],
	},
	{
		id: 'ahead',
		index: '',
		title: 'The ground still unsurveyed',
		scenes: [
			{
				id: 'ahead-map',
				passages: [
					{
						id: 'ahead-1',
						dir: 'thoughtful',
						text: 'Step back to the map. A century and a half of proven regions, every one thinning toward the edge. If these manuscripts are right, there is now a line that does not move: seven eighths, at every height, for every character.',
					},
					{
						id: 'ahead-2',
						text: 'And the line one half is still far away. Between seven eighths and one half lies the rest of the Riemann hypothesis, and much of what we believe about the primes but cannot prove. The manuscripts say so themselves.',
					},
				],
			},
			{
				id: 'ahead-close',
				passages: [
					{
						id: 'ahead-3',
						dir: 'thoughtful',
						text: 'Results like this are checked the way mathematics always checks them: line by line, by people who read slowly. If this line holds, it is one of the great advances in the history of the subject. A border that holds, after a hundred and sixty-seven years of borders that shrank. And beyond it, the ground is still unsurveyed.',
					},
				],
			},
		],
	},
];

// Pronunciation: one written word to one spoken word, so captions and
// timestamps keep the same word count.
const SAY: [RegExp, string][] = [
	[/\bchi\b/g, 'kai'],
	[/\bmu\b/g, 'mew'],
	[/\bnu\b/g, 'new'],
	[/\bphi\b/g, 'fye'],
];

export const spoken = (text: string): string => SAY.reduce((t, [re, s]) => t.replace(re, s), text);

export const allPassages = (): (Passage & {scene: string; chapter: string})[] =>
	CHAPTERS.flatMap((c) => c.scenes.flatMap((s) => s.passages.map((p) => ({...p, scene: s.id, chapter: c.id}))));
