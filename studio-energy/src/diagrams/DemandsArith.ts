// Exact arithmetic for chapter 3 (Two demands): the sextic symbol chi_n(u) =
// (u/n)_6 for squarefree primary n, as in the October manuscript, §2.2: for a
// prime p, the sixth root of unity congruent to u^{(N(p)-1)/6} modulo p (zero
// when p | u), extended multiplicatively in n. Split primes use EisArith's
// symbol; inert primes q = 2 mod 3 are done here in O/(q), a field of q^2
// elements. A value is k (the unit zeta_6^k, zeta_6 = 1 + omega) or null (0).

import {conj, divides, type Eis, mobiusIdeal, mul, norm, primeOfNorm, sexticSymbol, UNITS} from './EisArith.ts';

const isPrime = (n: number) => {
	if (n < 2) return false;
	for (let k = 2; k * k <= n; k++) if (n % k === 0) return false;
	return true;
};

const mod = (x: number, m: number) => ((x % m) + m) % m;

// (u / q)_6 for an inert rational prime q = 2 mod 3, q >= 5.
const inertSymbol = (u: Eis, q: number): number | null => {
	const red = ([a, b]: Eis): Eis => [mod(a, q), mod(b, q)];
	if (red(u)[0] === 0 && red(u)[1] === 0) return null;
	let r: Eis = [1, 0];
	let x = red(u);
	for (let e = (q * q - 1) / 6; e > 0; e >>= 1) {
		if (e & 1) r = red(mul(r, x));
		x = red(mul(x, x));
	}
	const k = UNITS.map(red).findIndex(([a, b]) => a === r[0] && b === r[1]);
	if (k < 0) throw new Error(`power residue mod ${q} is not a unit`);
	return k;
};

// The prime ideals dividing a squarefree n prime to 6: each as a generator and
// whether it is inert (generator a rational prime).
export type PrimeIdeal = {gen: Eis; inert: boolean};

export const primeIdeals = (n: Eis): PrimeIdeal[] => {
	let N = norm(n);
	const out: PrimeIdeal[] = [];
	for (let l = 5; l <= N; l++) {
		if (N % l !== 0 || !isPrime(l)) continue;
		while (N % l === 0) N /= l;
		if (l % 3 === 2) out.push({gen: [l, 0], inert: true});
		else {
			const pi = primeOfNorm(l);
			for (const g of [pi, conj(pi)]) if (divides(g, n)) out.push({gen: g, inert: false});
		}
	}
	return out;
};

// chi_n(u) = (u/n)_6.
export const chi = (u: Eis, n: Eis): number | null => {
	let k = 0;
	for (const {gen, inert} of primeIdeals(n)) {
		const s = inert ? inertSymbol(u, gen[0]) : sexticSymbol(u, gen);
		if (s === null) return null;
		k += s;
	}
	return k % 6;
};

// The terms of A_1(D) for the window (1, 2]: one primary generator per ideal,
// prime to 2 and 3, squarefree, D < N(n) <= 2D. Sorted by norm.
export const isPrimaryEis = ([a, b]: Eis) => mod(a, 3) === 1 && mod(b, 3) === 0;

export const termsOf = (D: number): Eis[] => {
	const R = Math.ceil(Math.sqrt((8 * D) / 3)) + 2;
	const out: Eis[] = [];
	for (let a = -R; a <= R; a++)
		for (let b = -R; b <= R; b++) {
			const N = norm([a, b]);
			if (N <= D || N > 2 * D || N % 2 === 0 || !isPrimaryEis([a, b])) continue;
			if (mobiusIdeal([a, b]) === 0) continue;
			out.push([a, b]);
		}
	return out.sort((x, y) => norm(x) - norm(y) || x[0] - y[0] || x[1] - y[1]);
};

// Checks before anything is drawn: the symbol is multiplicative in u, a sixth
// power is a sixth power residue, and the inert case agrees with Euler's
// criterion in the subfield (for rational u, (u/q)_6 = 1 since u^{q-1} = 1).
{
	const n: Eis = [-2, -3]; // primary, norm 7
	if (norm(n) !== 7 || !isPrimaryEis(n)) throw new Error('-2 - 3 omega should be primary of norm 7');
	for (const [u, v] of [
		[[2, 0], [4, 1]],
		[[5, 2], [1, 4]],
	] as [Eis, Eis][]) {
		const a = chi(u, n);
		const b = chi(v, n);
		const ab = chi(mul(u, v), n);
		if (a === null || b === null || ab !== (a + b) % 6) throw new Error('chi is not multiplicative');
	}
	if (chi([2, 0], [-5, 0]) !== 0 || chi([7, 0], [-11, 0]) !== 0) throw new Error('rational u should be a sixth power mod an inert q');
	const p: Eis = [1, -3]; // primary, norm 13
	let p6: Eis = [1, 0];
	for (let i = 0; i < 6; i++) p6 = mul(p6, p);
	for (const m of termsOf(100)) {
		const s = chi(p6, m);
		if (s !== (divides(p, m) ? null : 0)) throw new Error('chi_n(p^6) should be 1 unless p | n');
	}
}
