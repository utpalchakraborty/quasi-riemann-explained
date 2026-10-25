import React from 'react';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, size, stroke} from '../design/tokens';

// Gauss sums drawn as walks of unit steps in the complex plane, computed here.
//
// Quadratic: sum over x = 1..12 of (x/13) e^{2 pi i x/13}. Since 13 = 1 mod 4
// the walk ends at sqrt(13) on the real axis, and its square over 13 is the
// sign (-1/13) = +1.
//
// Cubic: the sum over x mod pi of chi_pi(x)^2 e(x/pi) for the primary prime
// pi = 1 - 3·omega of norm 13, the unnormalized gamma_2(pi). Here chi_pi(x) is
// the sextic residue symbol, the sixth root of unity congruent to x^{(13-1)/6}
// mod pi, and e(z) = exp(4 pi i Im(z)/sqrt 3), so e(x/pi) = exp(-2 pi i x b/13)
// for pi = a + b·omega and rational x. It ends on the circle |z| = sqrt(13).

const P = 13;
const powmod = (b: number, e: number, m: number) => {
	let r = 1;
	let x = ((b % m) + m) % m;
	for (let k = e; k > 0; k >>= 1) {
		if (k & 1) r = (r * x) % m;
		x = (x * x) % m;
	}
	return r;
};
const legendre = (x: number) => {
	const r = powmod(x, (P - 1) / 2, P);
	return r === 1 ? 1 : r === 0 ? 0 : -1;
};

type Pt = [number, number];
const walk = (step: (x: number) => Pt): Pt[] => {
	const pts: Pt[] = [[0, 0]];
	for (let x = 1; x < P; x++) {
		const [dx, dy] = step(x);
		const [px, py] = pts[pts.length - 1];
		pts.push([px + dx, py + dy]);
	}
	return pts;
};

export const QUAD_WALK = walk((x) => {
	const s = legendre(x);
	return [s * Math.cos((2 * Math.PI * x) / P), s * Math.sin((2 * Math.PI * x) / P)];
});

// pi = a + b·omega = 1 - 3·omega, primary (a = 1 mod 3, b = 0 mod 3), norm 13.
export const CUBIC_PI = {a: 1, b: -3};
export const CUBIC_WALK = (() => {
	const {a, b} = CUBIC_PI;
	let r = -1; // the image of omega in O/(pi) = Z/13: a + b·r = 0 and r^2 + r + 1 = 0
	for (let t = 0; t < P; t++) if ((((a + b * t) % P) + P) % P === 0 && (t * t + t + 1) % P === 0) r = t;
	if (r < 0) throw new Error('no residue for omega');
	const zeta = (1 + r) % P; // zeta_6 = 1 + omega
	const index: Record<number, number> = {};
	for (let k = 0, v = 1; k < 6; k++, v = (v * zeta) % P) index[v] = k;
	return walk((x) => {
		const k = index[powmod(x, (P - 1) / 6, P)]; // chi_pi(x) = zeta_6^k
		const ang = (2 * Math.PI * 2 * k) / 6 - (2 * Math.PI * x * b) / P; // chi^2 · e(x/pi)
		return [Math.cos(ang), Math.sin(ang)];
	});
})();

const end = (w: Pt[]) => w[w.length - 1];
// Checks that the walks are what the captions say.
const ROOT = Math.sqrt(P);
if (Math.abs(end(QUAD_WALK)[0] - ROOT) > 1e-9 || Math.abs(end(QUAD_WALK)[1]) > 1e-9) throw new Error('quadratic Gauss sum is not sqrt(13)');
if (Math.abs(Math.hypot(...end(CUBIC_WALK)) - ROOT) > 1e-9) throw new Error('cubic Gauss sum does not have modulus sqrt(13)');
export const CUBIC_ARG = Math.atan2(end(CUBIC_WALK)[1], end(CUBIC_WALK)[0]);

type Props = {
	ox: number;
	oy: number;
	scale: number;
	axes?: number;
	quad?: number; // 0..1, steps drawn
	quadDim?: number;
	cubic?: number;
	circle?: number;
	rootLabel?: number;
};

const path = (w: Pt[], t: number, ox: number, oy: number, s: number) => {
	const n = (w.length - 1) * t;
	const whole = Math.floor(n);
	const pts = w.slice(0, whole + 1).map(([x, y]) => [ox + s * x, oy - s * y]);
	if (whole < w.length - 1 && n > whole) {
		const [x0, y0] = w[whole];
		const [x1, y1] = w[whole + 1];
		const f = n - whole;
		pts.push([ox + s * (x0 + (x1 - x0) * f), oy - s * (y0 + (y1 - y0) * f)]);
	}
	return {d: pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(''), pts, whole};
};

export const GaussWalk: React.FC<Props> = ({ox, oy, scale, axes = 1, quad = 0, quadDim = 0, cubic = 0, circle = 0, rootLabel = 0}) => {
	const q = path(QUAD_WALK, quad, ox, oy, scale);
	const c = path(CUBIC_WALK, cubic, ox, oy, scale);
	const arc = Array.from({length: 61}, (_, i) => {
		const th = ((-8 + (68 * i) / 60) * Math.PI) / 180;
		return `${i ? 'L' : 'M'}${(ox + scale * ROOT * Math.cos(th)).toFixed(1)},${(oy - scale * ROOT * Math.sin(th)).toFixed(1)}`;
	}).join('');
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={axes}>
					<line x1={ox - 40} x2={ox + scale * 4.1} y1={oy} y2={oy} stroke={color.pencil} strokeWidth={stroke.line} />
					<line x1={ox} x2={ox} y1={oy + 50} y2={oy - scale * 4.6} stroke={alpha('pencil', 0.6)} strokeWidth={stroke.hair} />
					{[1, 2, 3].map((v) => (
						<line key={v} x1={ox + scale * v} x2={ox + scale * v} y1={oy - 6} y2={oy + 6} stroke={alpha('pencil', 0.7)} strokeWidth={stroke.hair} />
					))}
				</g>
				<path d={arc} fill="none" stroke={alpha('pencil', 0.7)} strokeWidth={stroke.line} strokeDasharray="6 9" opacity={circle} />
				<g opacity={1 - 0.7 * quadDim}>
					<path d={q.d} fill="none" stroke={color.viridian} strokeWidth={stroke.bold} strokeLinejoin="round" />
					{q.pts.slice(1, q.whole + 1).map(([x, y], i) => (
						<circle key={i} cx={x} cy={y} r={i === QUAD_WALK.length - 2 ? 9 : 4.5} fill={color.viridian} />
					))}
				</g>
				<g>
					<path d={c.d} fill="none" stroke={color.viridian} strokeWidth={stroke.bold} strokeLinejoin="round" opacity={cubic > 0 ? 1 : 0} />
					{c.pts.slice(1, c.whole + 1).map(([x, y], i) => (
						<circle key={i} cx={x} cy={y} r={i === CUBIC_WALK.length - 2 ? 9 : 4.5} fill={color.viridian} />
					))}
				</g>
				<line x1={ox + scale * ROOT} x2={ox + scale * ROOT} y1={oy - 10} y2={oy + 10} stroke={color.ink} strokeWidth={stroke.line} opacity={rootLabel} />
			</svg>
			<At x={ox + scale * ROOT - 60} y={oy + 16} w={120} style={{textAlign: 'center', opacity: rootLabel}}>
				<Tex px={size.label} display={false} tex={'\\sqrt{13}'} />
			</At>
			<At x={ox - 52} y={oy + 12} w={40} style={{textAlign: 'right', opacity: axes}}>
				<Tex px={size.label} ink="pencil" display={false} tex={'0'} />
			</At>
		</>
	);
};
