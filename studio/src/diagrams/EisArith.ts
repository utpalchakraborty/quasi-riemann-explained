// Arithmetic in the Eisenstein integers O = Z[omega], omega = e^{2 pi i/3},
// computed exactly for the chapter's figures. An element a + b·omega is the
// pair [a, b]; omega^2 = -1 - omega.

export type Eis = [number, number];

export const norm = ([a, b]: Eis): number => a * a - a * b + b * b;
export const mul = ([a, b]: Eis, [c, d]: Eis): Eis => [a * c - b * d, a * d + b * c - b * d];
export const conj = ([a, b]: Eis): Eis => [a - b, -b];

// d | x in O, and the quotient when it does.
export const quotient = (x: Eis, d: Eis): Eis | null => {
	const n = norm(d);
	const [p, q] = mul(x, conj(d));
	return p % n === 0 && q % n === 0 ? [p / n, q / n] : null;
};
export const divides = (d: Eis, x: Eis): boolean => quotient(x, d) !== null;

const isPrime = (n: number) => {
	if (n < 2) return false;
	for (let k = 2; k * k <= n; k++) if (n % k === 0) return false;
	return true;
};

// One generator a + b·omega (a > b >= 1, smallest b) of a prime of norm p = 1 mod 3.
export const primeOfNorm = (p: number): Eis => {
	for (let b = 1; b < 40; b++) for (let a = b + 1; a < 60; a++) if (norm([a, b]) === p) return [a, b];
	throw new Error(`no Eisenstein prime of norm ${p}`);
};

// The ideal Möbius function mu((x)), from the factorization of the norm:
// 3 ramifies as (1 - omega)^2, p = 2 mod 3 stays prime with norm p^2,
// p = 1 mod 3 splits as pi·conj(pi).
export const mobiusIdeal = (x: Eis): number => {
	let N = norm(x);
	if (N === 0) return 0;
	let k = 0;
	for (let p = 2; p <= N; p++) {
		if (N % p !== 0 || !isPrime(p)) continue;
		let e = 0;
		while (N % p === 0) {
			N /= p;
			e++;
		}
		if (p === 3) {
			if (e >= 2) return 0;
			k += 1;
		} else if (p % 3 === 2) {
			if (e >= 4) return 0;
			k += 1;
		} else {
			for (const pi of [primeOfNorm(p), conj(primeOfNorm(p))]) {
				let v = 0;
				let y: Eis | null = x;
				while ((y = quotient(y, pi)) !== null) {
					v++;
					if (v >= 2) return 0;
				}
				k += v;
			}
		}
	}
	return k % 2 ? -1 : 1;
};

// The six units as powers of zeta_6 = 1 + omega; their TeX names.
const ZETA6: Eis = [1, 1];
export const UNITS: Eis[] = Array.from({length: 6}, (_, k) => {
	let u: Eis = [1, 0];
	for (let i = 0; i < k; i++) u = mul(u, ZETA6);
	return u;
});
export const ROOT_TEX = ['1', '-\\omega^{2}', '\\omega', '-1', '\\omega^{2}', '-\\omega'];

const powmod = (b: number, e: number, m: number) => {
	let r = 1;
	let x = ((b % m) + m) % m;
	for (let k = e; k > 0; k >>= 1) {
		if (k & 1) r = (r * x) % m;
		x = (x * x) % m;
	}
	return r;
};

// The sextic residue symbol (u / pi)_6 for a prime pi of prime norm p = 1 mod 3:
// the unit congruent to u^{(p-1)/6} modulo pi, returned as k with the unit
// zeta_6^k, or null when pi divides u (the symbol is 0).
export const sexticSymbol = (u: Eis, pi: Eis): number | null => {
	const p = norm(pi);
	if (!isPrime(p) || p % 3 !== 1) throw new Error('sexticSymbol needs a split prime');
	if (divides(pi, u)) return null;
	// O / pi is Z / p, with omega sent to the r for which pi divides omega - r.
	let r = -1;
	for (let c = 0; c < p; c++) if (divides(pi, [-c, 1])) r = c;
	if (r < 0) throw new Error('no image of omega mod pi');
	const red = ([a, b]: Eis) => (((a + b * r) % p) + p) % p;
	const images = UNITS.map(red);
	if (new Set(images).size !== 6) throw new Error('units not distinct mod pi');
	const k = images.indexOf(powmod(red(u), (p - 1) / 6, p));
	if (k < 0) throw new Error('power residue is not a unit');
	return k;
};

// The worked example of the chapter: pi = 3 + omega, of norm 7. Check that
// pi divides omega - 4, so omega = 4 (mod pi), before anything is drawn.
export const PI7: Eis = [3, 1];
if (norm(PI7) !== 7 || !divides(PI7, [-4, 1])) throw new Error('3 + omega should have norm 7 and divide omega - 4');
