// Arithmetic computed for the closing chapters (back, consequences). Every
// number these scenes show comes from here; each claim the narration makes is
// asserted, so a wrong value fails the render instead of reaching the screen.
// Values are computed lazily, once, by the scenes that need them.

const once = <T>(fn: () => T): (() => T) => {
	let v: T | undefined;
	return () => (v === undefined ? (v = fn()) : v);
};

const check = (ok: boolean, what: string) => {
	if (!ok) throw new Error(`frontierData: ${what}`);
};

// All products stay below 2^53 for moduli under 10^7, so plain numbers are exact.
export const powMod = (b: number, e: number, m: number): number => {
	let r = 1;
	b %= m;
	while (e > 0) {
		if (e & 1) r = (r * b) % m;
		b = (b * b) % m;
		e = Math.floor(e / 2);
	}
	return r;
};

const sieve = (n: number): Uint8Array => {
	const s = new Uint8Array(n + 1).fill(1);
	s[0] = 0;
	s[1] = 0;
	for (let i = 2; i * i <= n; i++) if (s[i]) for (let k = i * i; k <= n; k += i) s[k] = 0;
	return s;
};

// Euler's criterion: a^((p-1)/2) is 1 for a nonzero square modulo an odd prime p.
export const isSquareMod = (a: number, p: number): boolean => powMod(a, (p - 1) / 2, p) === 1;

export const leastNonResidue = (p: number): number => {
	let n = 2;
	while (isSquareMod(n, p)) n++;
	return n;
};

// Squares among 1..n modulo p.
export const residueRow = (p: number, n: number): boolean[] => Array.from({length: n}, (_, i) => isSquareMod(i + 1, p));

// The worst least non-residue among odd primes below a million, and every prime attaining it.
export const nonResidueRecord = once(() => {
	const N = 1_000_000;
	const s = sieve(N);
	let worst = 0;
	let at: number[] = [];
	for (let p = 3; p < N; p += 2) {
		if (!s[p]) continue;
		const n = leastNonResidue(p);
		if (n > worst) {
			worst = n;
			at = [p];
		} else if (n === worst) at.push(p);
	}
	check(worst === 43 && at[0] === 366791, `worst least non-residue below 10^6 is ${worst} at ${at}`);
	check(leastNonResidue(366791) === 43, 'n(366791) = 43');
	return {worst, at};
});

// Tonelli–Shanks: a square root of a modulo p, given a non-residue z.
export const tonelliShanks = (a: number, p: number, z: number): number => {
	let q = p - 1;
	let e = 0;
	while (q % 2 === 0) {
		q /= 2;
		e++;
	}
	let m = e;
	let c = powMod(z, q, p);
	let t = powMod(a, q, p);
	let r = powMod(a, (q + 1) / 2, p);
	while (t !== 1) {
		let i = 0;
		let tt = t;
		while (tt !== 1) {
			tt = (tt * tt) % p;
			i++;
		}
		const b = powMod(c, 2 ** (m - i - 1), p);
		m = i;
		c = (b * b) % p;
		t = (t * c) % p;
		r = (r * b) % p;
	}
	return r;
};

export const squareRootExample = once(() => {
	const p = 366791;
	const z = leastNonResidue(p);
	const a = 2;
	const r0 = tonelliShanks(a, p, z);
	const r = Math.min(r0, p - r0);
	check((r * r) % p === a, 'Tonelli–Shanks root');
	return {p, z, a, r};
});

// The strong (Miller) test of n to base a.
export const strongProbablePrime = (n: number, a: number): boolean => {
	let d = n - 1;
	let s = 0;
	while (d % 2 === 0) {
		d /= 2;
		s++;
	}
	let x = powMod(a, d, n);
	if (x === 1 || x === n - 1) return true;
	for (let i = 1; i < s; i++) {
		x = (x * x) % n;
		if (x === n - 1) return true;
	}
	return false;
};

// The smallest composite that the strong test to base 2 lets through.
export const millerExample = once(() => {
	const s = sieve(5000);
	let n = 9;
	while (s[n] || !strongProbablePrime(n, 2)) n += 2;
	let f = 3;
	while (n % f) f += 2;
	check(!strongProbablePrime(n, 3), 'base 3 exposes it');
	let d = n - 1;
	let s2 = 0;
	while (d % 2 === 0) {
		d /= 2;
		s2++;
	}
	return {n, factors: [f, n / f] as [number, number], d, s: s2, liar: 2, liarPow: powMod(2, d, n), witness: 3, witnessPow: powMod(3, d, n)};
});

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

// n is idoneal when every genus of primitive forms of discriminant -4n is a
// single class, i.e. every class has order at most two. A reduced form
// (a, b, c), |b| <= a <= c, has order at most two exactly when b = 0, b = a or a = c.
export const isIdoneal = (n: number): boolean => {
	const D = -4 * n;
	for (let a = 1; 3 * a * a <= -D; a++)
		for (let b = -a + 1; b <= a; b++) {
			if ((b * b - D) % (4 * a)) continue;
			const c = (b * b - D) / (4 * a);
			if (c < a || (b < 0 && a === c)) continue;
			if (gcd(gcd(a, b), c) !== 1) continue;
			if (!(b === 0 || b === a || a === c)) return false;
		}
	return true;
};

export const IDONEAL_LIMIT = 2000;
export const idoneal = once(() => {
	const list = Array.from({length: IDONEAL_LIMIT - 1}, (_, i) => i + 1).filter(isIdoneal);
	check(list.length === 65, `found ${list.length} idoneal numbers below ${IDONEAL_LIMIT}`);
	return list;
});

// Primes in the two classes modulo 4 up to X, against the main term
// (1/phi(4)) * integral_2^x dt / log t, sampled every STEP.
export const COUNT_X = 100_000;
const STEP = 500;
export const primeCounts = once(() => {
	const s = sieve(COUNT_X);
	const xs: number[] = [];
	const one: number[] = [];
	const three: number[] = [];
	const main: number[] = [];
	let c1 = 0;
	let c3 = 0;
	let li = 0;
	// Simpson's rule on each unit interval [t, t + 1] of 1/log t.
	const g = (t: number) => 1 / Math.log(t);
	for (let x = 2; x <= COUNT_X; x++) {
		if (x > 2) li += (g(x - 1) + 4 * g(x - 0.5) + g(x)) / 6;
		if (s[x] && x % 4 === 1) c1++;
		if (s[x] && x % 4 === 3) c3++;
		if (x % STEP === 0) {
			xs.push(x);
			one.push(c1);
			three.push(c3);
			main.push(li / 2);
		}
	}
	check(c1 + c3 + 1 === s.reduce((a, v) => a + v, 0), 'every odd prime is 1 or 3 mod 4');
	return {xs, one, three, main, final: {one: c1, three: c3, main: li / 2}};
});
