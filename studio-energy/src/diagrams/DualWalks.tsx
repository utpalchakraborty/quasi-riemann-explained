import React from 'react';
import numerics from '../data/numerics.json';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, Ink, size, stroke} from '../design/tokens';
import {carg, type C, cmul, identitySides, quadraticWalk, type Eis} from './DualArith';

// Chapter 5, Gauss sums as walks on the complex plane, every one normalized so
// that it ends on the unit circle: |gamma_j(n)| = 1.
//
// The sextic and cubic walks gamma_{-1} and gamma_2 at the primary prime of
// norm 13 come from scripts/compute_data.py (N5, numerics.gauss.walks). The
// identity of Lemma 4.1, mu(n) gamma_{-1}(n) = chi_n(-1) G(n)^{-1}
// conj(alpha(n)) gamma_2(n), is computed again here (DualArith) at the 22
// primary primes the script checked, and the two computations must agree.
// The quadratic walk is (x/13) e^{2 pi i x/13} over x = 1..12, over sqrt(13).

type WalkData = {p: number[]; j: number; end: number[]; path: number[][]};
type CheckData = {q: number; p: number[]; abs: number[]; identity_error: number};
const G = numerics.gauss as unknown as {checks: CheckData[]; walks: Record<string, WalkData>; identity_holds: boolean};

// The narration: "Checked here at twenty-two primes, the two sides agree to
// fourteen decimal places."
if (G.checks.length !== 22) throw new Error('expected the identity checked at 22 primes');
if (!G.identity_holds) throw new Error('the Gauss-sum identity failed in compute_data.py');
export const GAUSS_MAX_ERROR = Math.max(...G.checks.map((c) => c.identity_error));
if (!(GAUSS_MAX_ERROR < 1e-14)) throw new Error('the two sides no longer agree to fourteen decimal places');

const path = (key: string): C[] => G.walks[key].path.slice(1).map(([a, b]) => [a, b]);
export const W13 = {pi: G.walks['13:-1'].p as Eis, gm1: path('13:-1'), g2: path('13:2')};
export const W31 = {pi: G.walks['31:-1'].p as Eis, gm1: path('31:-1'), g2: path('31:2')};
export const QUAD13 = quadraticWalk(13);

// The identity at the norm-13 prime: the cubic sum's end, turned by a unit
// factor, lands on minus the sextic sum's end.
export const ID13 = identitySides(W13.pi);
const end = (w: C[]) => w[w.length - 1];
const near = (a: C, b: C, tol: number) => Math.hypot(a[0] - b[0], a[1] - b[1]) < tol;
if (!near(ID13.lhs, [-end(W13.gm1)[0], -end(W13.gm1)[1]], 1e-12) || !near(ID13.g2, end(W13.g2), 1e-12)) throw new Error('DualArith and compute_data.py disagree at norm 13');
export const TURN13 = (() => {
	let t = carg(ID13.lhs) - carg(ID13.g2);
	if (t > Math.PI) t -= 2 * Math.PI;
	if (t < -Math.PI) t += 2 * Math.PI;
	return t;
})();

// Both sides at all 22 primes, computed here, agreeing with the script.
export const CHECKS = G.checks.map((c) => ({q: c.q, ...identitySides(c.p as Eis)}));
if (CHECKS.some((c) => !near(c.lhs, c.rhs, 1e-12))) throw new Error('the identity fails in DualArith');
if (!near(cmul(ID13.factor, ID13.g2), ID13.rhs, 1e-15)) throw new Error('factor bookkeeping');

export type WalkSpec = {pts: C[]; p: number; ink?: Ink; opacity?: number; width?: number; dash?: string; dots?: boolean};
export type Mark = {z: C; p: number; kind?: 'filled' | 'hollow'; ink?: Ink; r?: number};

type Props = {
	cx: number;
	cy: number;
	R: number; // pixels per unit
	axes?: number;
	circle?: number;
	walks?: WalkSpec[];
	marks?: Mark[];
	segments?: {a: C; b: C; p: number; ink?: Ink; dash?: string}[];
	arc?: {from: number; to: number; p: number; ink?: Ink}; // along the unit circle, angles in radians
};

const partial = (w: C[], t: number): C[] => {
	const n = (w.length - 1) * Math.max(0, Math.min(1, t));
	const whole = Math.floor(n);
	const out = w.slice(0, whole + 1);
	if (whole < w.length - 1 && n > whole) {
		const [x0, y0] = w[whole];
		const [x1, y1] = w[whole + 1];
		out.push([x0 + (x1 - x0) * (n - whole), y0 + (y1 - y0) * (n - whole)]);
	}
	return out;
};

export const WalkPlane: React.FC<Props> = ({cx, cy, R, axes = 1, circle = 1, walks = [], marks = [], segments = [], arc}) => {
	const X = (z: C) => cx + R * z[0];
	const Y = (z: C) => cy - R * z[1];
	const d = (pts: C[]) => pts.map((z, i) => `${i ? 'L' : 'M'}${X(z).toFixed(1)},${Y(z).toFixed(1)}`).join('');
	const arcPath = arc
		? Array.from({length: 41}, (_, i) => {
				const t = arc.from + ((arc.to - arc.from) * i * arc.p) / 40;
				return `${i ? 'L' : 'M'}${(cx + R * Math.cos(t)).toFixed(1)},${(cy - R * Math.sin(t)).toFixed(1)}`;
			}).join('')
		: '';
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={axes}>
					<line x1={cx - R * 1.35} x2={cx + R * 1.35} y1={cy} y2={cy} stroke={alpha('pencil', 0.7)} strokeWidth={stroke.hair} />
					<line x1={cx} x2={cx} y1={cy + R * 1.2} y2={cy - R * 1.35} stroke={alpha('pencil', 0.7)} strokeWidth={stroke.hair} />
					<line x1={cx + R} x2={cx + R} y1={cy - 7} y2={cy + 7} stroke={color.pencil} strokeWidth={stroke.line} />
				</g>
				<circle cx={cx} cy={cy} r={R} fill="none" stroke={alpha('pencil', 0.75)} strokeWidth={stroke.line} strokeDasharray="5 9" opacity={circle} />
				{segments.map((s, i) => (
					<line key={i} x1={X(s.a)} y1={Y(s.a)} x2={X(s.a) + (X(s.b) - X(s.a)) * s.p} y2={Y(s.a) + (Y(s.b) - Y(s.a)) * s.p} stroke={color[s.ink ?? 'pencil']} strokeWidth={stroke.line} strokeDasharray={s.dash ?? '6 6'} opacity={s.p > 0 ? 1 : 0} />
				))}
				{walks.map((w, i) => {
					if (w.p <= 0 || (w.opacity ?? 1) <= 0) return null;
					const pts = partial(w.pts, w.p);
					const k = w.ink ?? 'viridian';
					return (
						<g key={i} opacity={w.opacity ?? 1}>
							<path d={d(pts)} fill="none" stroke={color[k]} strokeWidth={w.width ?? stroke.bold} strokeLinejoin="round" strokeDasharray={w.dash} />
							{w.dots !== false && pts.slice(1, -1).map((z, j) => <circle key={j} cx={X(z)} cy={Y(z)} r={3.5} fill={color[k]} />)}
						</g>
					);
				})}
				{arc && arc.p > 0 && <path d={arcPath} fill="none" stroke={color[arc.ink ?? 'ink']} strokeWidth={stroke.bold} />}
				{marks.map((m, i) => {
					if (m.p <= 0) return null;
					const k = color[m.ink ?? 'viridian'];
					return m.kind === 'hollow' ? (
						<circle key={i} cx={X(m.z)} cy={Y(m.z)} r={(m.r ?? 11) * Math.min(1, 0.5 + m.p)} fill="none" stroke={k} strokeWidth={stroke.line} opacity={m.p} />
					) : (
						<circle key={i} cx={X(m.z)} cy={Y(m.z)} r={(m.r ?? 7) * Math.min(1, 0.5 + m.p)} fill={k} opacity={m.p} />
					);
				})}
			</svg>
			<At x={cx + R - 20} y={cy + 10} w={40} style={{textAlign: 'center', opacity: axes}}>
				<Tex px={size.small} ink="pencil" display={false} tex={'1'} />
			</At>
			<At x={cx - 34} y={cy + 6} w={28} style={{textAlign: 'right', opacity: axes}}>
				<Tex px={size.small} ink="pencil" display={false} tex={'0'} />
			</At>
		</>
	);
};

export const walkEnd = end;
