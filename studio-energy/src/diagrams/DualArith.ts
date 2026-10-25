// Arithmetic for chapter 5, computed exactly. Conventions are the October
// manuscript's (§2.2, §2.3), the same as scripts/compute_data.py: an element
// a + b·omega of O = Z[omega] is the pair [a, b]; a primary prime pi of prime
// norm q = 1 mod 3 has residue field O/(pi) = Z/q, with omega sent to the r
// for which a + b·r = 0 and r^2 + r + 1 = 0 mod q. The sextic symbol chi_pi(u)
// is the sixth root of unity congruent to u^{(q-1)/6} mod pi, written here as
// the exponent k of zeta_6 = 1 + omega = e^{i pi/3} (null when pi divides u).
// e(z) = exp(4 pi i Im z / sqrt 3), so e(x/pi) = exp(-2 pi i x b / q) for
// rational x, and gamma_j(pi) = q^{-1/2} sum_{x mod pi} chi_pi(x)^j e(x/pi).

export type Eis = [number, number];
export type C = [number, number]; // a complex number, [re, im]

export const eisNorm = ([a, b]: Eis): number => a * a - a * b + b * b;
const mod = (x: number, m: number) => ((x % m) + m) % m;
const powmod = (b: number, e: number, m: number) => {
	let r = 1;
	let x = mod(b, m);
	for (let k = e; k > 0; k = Math.floor(k / 2)) {
		if (k % 2 === 1) r = (r * x) % m;
		x = (x * x) % m;
	}
	return r;
};

export const cmul = ([a, b]: C, [c, d]: C): C => [a * c - b * d, a * d + b * c];
export const conj = ([a, b]: C): C => [a, -b];
export const cis = (t: number): C => [Math.cos(t), Math.sin(t)];
export const cabs = ([a, b]: C): number => Math.hypot(a, b);
export const carg = ([a, b]: C): number => Math.atan2(b, a);
// The complex number a + b·omega.
export const toC = ([a, b]: Eis): C => [a - b / 2, (b * Math.sqrt(3)) / 2];

export type Residues = {q: number; b: number; chi: (u: Eis) => number | null};

export const residues = (pi: Eis): Residues => {
	const q = eisNorm(pi);
	if (q % 3 !== 1) throw new Error(`residues: ${q} is not a split prime norm`);
	const [a, b] = pi;
	let r = -1;
	for (let t = 0; t < q; t++) if (mod(a + b * t, q) === 0 && mod(t * t + t + 1, q) === 0) r = t;
	if (r < 0) throw new Error('residues: no image for omega');
	const index = new Map<number, number>();
	for (let k = 0, v = 1; k < 6; k++, v = (v * (1 + r)) % q) index.set(v, k);
	const chi = ([c, d]: Eis): number | null => {
		const x = mod(c + d * r, q);
		if (x === 0) return null;
		const k = index.get(powmod(x, (q - 1) / 6, q));
		if (k === undefined) throw new Error('residues: power is not a sixth root of unity');
		return k;
	};
	return {q, b, chi};
};

// gamma_j(pi) as a walk: partial sums over x = 1, ..., q - 1, normalized by sqrt(q).
export const gaussWalk = (pi: Eis, j: number): C[] => {
	const R = residues(pi);
	const pts: C[] = [[0, 0]];
	for (let x = 1; x < R.q; x++) {
		const k = R.chi([x, 0])!;
		const [px, py] = pts[pts.length - 1];
		const [dx, dy] = cis((2 * Math.PI * j * k) / 6 - (2 * Math.PI * x * R.b) / R.q);
		pts.push([px + dx / Math.sqrt(R.q), py + dy / Math.sqrt(R.q)]);
	}
	return pts;
};
export const gamma = (pi: Eis, j: number): C => {
	const w = gaussWalk(pi, j);
	return w[w.length - 1];
};

// The two sides of the identity of Lemma 4.1, at a primary prime pi (mu = -1):
// mu(pi) gamma_{-1}(pi) and chi_pi(-1) G(pi)^{-1} conj(alpha(pi)) gamma_2(pi),
// with alpha(pi) = pi/|pi| and G(pi) = conj(chi_pi(4)) gamma_3(pi). Also the
// unit factor chi_pi(-1) G(pi)^{-1} conj(alpha(pi)) by itself.
export const identitySides = (pi: Eis): {lhs: C; rhs: C; factor: C; g2: C} => {
	const R = residues(pi);
	const sign = cis((Math.PI * R.chi([-1, 0])!) / 3);
	const chi4 = cis((Math.PI * R.chi([4, 0])!) / 3);
	const G = cmul(conj(chi4), gamma(pi, 3));
	const z = toC(pi);
	const alpha: C = [z[0] / cabs(z), z[1] / cabs(z)];
	// |G| = 1, so G^{-1} is its conjugate
	const factor = cmul(cmul(sign, conj(G)), conj(alpha));
	const g2 = gamma(pi, 2);
	const gm1 = gamma(pi, -1);
	return {lhs: [-gm1[0], -gm1[1]], rhs: cmul(factor, g2), factor, g2};
};

// The quadratic Gauss sum (x/m) e^{2 pi i x/m} over x = 1, ..., m - 1, normalized,
// for an odd prime m; its square is the sign (-1/m).
export const quadraticWalk = (m: number): C[] => {
	const pts: C[] = [[0, 0]];
	for (let x = 1; x < m; x++) {
		const s = powmod(x, (m - 1) / 2, m) === 1 ? 1 : -1;
		const [px, py] = pts[pts.length - 1];
		const [dx, dy] = cis((2 * Math.PI * x) / m);
		pts.push([px + (s * dx) / Math.sqrt(m), py + (s * dy) / Math.sqrt(m)]);
	}
	return pts;
};
