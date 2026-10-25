import React from 'react';
import numerics from '../data/numerics.json';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, size, stroke} from '../design/tokens';
import {eisNorm, isEisensteinPrime, isPrimary, LatticeField} from './LatticeField';

// Chapter 4, the copies. Two computed pictures.
//
// PrimeAnnulus: the Eisenstein lattice for a picture-sized Y, with every
// primary prime p of norm Y/2 < N(p) <= Y marked. Each prime ideal prime to 3
// has exactly one primary generator, so the marked points are the J prime
// ideals the spend uses (none of them lies above 2 or 3, so none is in S).
//
// CopyScatter: scripts/compute_data.py, N4. For primary primes of norm 7 to 43
// and D = 2000 to 20000, the number of terms of A_1(D) that p divides, against
// D/N(p). Those are the only terms where A_{p^6}(D) differs from A_1(D), since
// chi_n(p^6) = 1 when p does not divide n. Computed directly from the terms of
// A_1(D); at this scale p^6 is far outside the family's rows.

export const ANNULUS_Y = 400;
export const ANNULUS = (() => {
	const R = Math.ceil(Math.sqrt(ANNULUS_Y) * 1.3) + 2;
	const inner: [number, number][] = [];
	const ring: [number, number][] = [];
	for (let a = -R; a <= R; a++)
		for (let b = -R; b <= R; b++) {
			const N = eisNorm(a, b);
			if (N === 0 || N > ANNULUS_Y || !isEisensteinPrime(a, b) || !isPrimary([a, b])) continue;
			(N > ANNULUS_Y / 2 ? ring : inner).push([a, b]);
		}
	return {J: ring.length, inner: inner.length, ring};
})();
// 16 split primes 200 < q <= 400 give two prime ideals each, and 17^2 = 289 one.
if (ANNULUS.J !== 33) throw new Error(`annulus count changed: ${ANNULUS.J}`);

type AnnulusProps = {
	cx: number;
	cy: number;
	unit: number;
	p?: number; // lattice inked in, outward from the centre
	primes?: number; // primary primes of norm <= Y lit
	annulus?: number; // the two circles N = Y/2 and N = Y, and the primes inside Y/2 dimmed
	pulse?: number; // the ring's primes enlarged, when they are counted
	opacity?: number;
};

export const PrimeAnnulus: React.FC<AnnulusProps> = ({cx, cy, unit, p = 1, primes = 0, annulus = 0, pulse = 0, opacity = 1}) => {
	const radius = Math.sqrt(ANNULUS_Y) + 0.8;
	return (
		<LatticeField
			cx={cx}
			cy={cy}
			unit={unit}
			radius={radius}
			opacity={opacity}
			under={
				<g opacity={annulus}>
					{[ANNULUS_Y / 2, ANNULUS_Y].map((N) => (
						<circle key={N} cx={cx} cy={cy} r={unit * Math.sqrt(N)} fill="none" stroke={alpha('pencil', 0.75)} strokeWidth={stroke.line} strokeDasharray="6 9" />
					))}
				</g>
			}
			style={({a, b, N, dist}) => {
				const appear = Math.max(0, Math.min(1, p * (radius + 2) - dist));
				const prime = N > 0 && N <= ANNULUS_Y && isEisensteinPrime(a, b) && isPrimary([a, b]);
				if (prime && primes > 0) {
					const inRing = N > ANNULUS_Y / 2;
					const lit = Math.max(0, Math.min(1, primes * (radius + 1.5) - dist));
					const keep = inRing ? 1 : 1 - 0.8 * annulus;
					return {r: 3 + (3 + (inRing ? 1.5 * pulse : 0)) * lit, fill: color.viridian, opacity: Math.max(appear, lit) * keep};
				}
				return {r: 2.2, fill: alpha('pencil', 0.5), opacity: appear};
			}}
		/>
	);
};

type Copy = {norm: number; p: number[]; diff: number; terms: number; D_over_N: number};
type CopiesData = {norms: number[]; by_D: {D: number; A1: number; terms: number; copies: Copy[]}[]};
export const COPIES = numerics.copies as unknown as CopiesData;

export const COPY_POINTS = COPIES.by_D.flatMap((r) => r.copies.map((c) => ({D: r.D, ...c}))).sort((a, b) => a.D_over_N - b.D_over_N);
// The line through the origin that fits best: terms = slope · D/N(p).
export const COPY_SLOPE = COPY_POINTS.reduce((s, c) => s + c.D_over_N * c.terms, 0) / COPY_POINTS.reduce((s, c) => s + c.D_over_N ** 2, 0);
if (COPY_POINTS.length !== 24) throw new Error('expected 6 primes at 4 values of D');
// The captions say "proportional": every case within 20% of the line.
if (COPY_POINTS.some((c) => Math.abs(c.terms - COPY_SLOPE * c.D_over_N) > 0.2 * c.terms)) throw new Error('differing terms no longer proportional to D/N(p)');
// The caption quotes one case: D = 20000, N(p) = 7.
export const COPY_EXAMPLE = COPY_POINTS.find((c) => c.D === 20000 && c.norm === 7)!;
if (COPY_EXAMPLE.terms !== 1056 || Math.abs(COPY_EXAMPLE.diff + 45.66) > 0.01) throw new Error('caption example changed');

type ScatterProps = {
	x: number; // origin, bottom-left
	y: number;
	w: number;
	h: number;
	p?: number; // axes
	points?: number; // 0..1, points inked in order of D/N(p)
	line?: number;
};

const X_MAX = 3000;
const Y_MAX = 1200;

export const CopyScatter: React.FC<ScatterProps> = ({x, y, w, h, p = 1, points = 0, line = 0}) => {
	const sx = (v: number) => x + (v / X_MAX) * w;
	const sy = (v: number) => y - (v / Y_MAX) * h;
	const n = COPY_POINTS.length * points;
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={p}>
					<line x1={x} x2={x + w} y1={y} y2={y} stroke={color.pencil} strokeWidth={stroke.line} />
					<line x1={x} x2={x} y1={y} y2={y - h} stroke={color.pencil} strokeWidth={stroke.line} />
					{[1000, 2000, 3000].map((v) => (
						<line key={v} x1={sx(v)} x2={sx(v)} y1={y} y2={y + 10} stroke={color.pencil} strokeWidth={stroke.hair} />
					))}
					{[500, 1000].map((v) => (
						<line key={v} x1={x - 10} x2={x + w} y1={sy(v)} y2={sy(v)} stroke={alpha('pencil', 0.25)} strokeWidth={stroke.hair} />
					))}
				</g>
				<line
					x1={x}
					y1={y}
					x2={sx(X_MAX * line)}
					y2={sy(COPY_SLOPE * X_MAX * line)}
					stroke={alpha('ink', 0.7)}
					strokeWidth={stroke.line}
					strokeDasharray="7 8"
					opacity={line > 0 ? 1 : 0}
				/>
				{COPY_POINTS.map((c, i) => {
					const o = Math.max(0, Math.min(1, n - i));
					if (o <= 0) return null;
					return <circle key={i} cx={sx(c.D_over_N)} cy={sy(c.terms)} r={4 + 3 * o} fill={color.vermilion} opacity={o} />;
				})}
			</svg>
			{[1000, 2000, 3000].map((v) => (
				<At key={v} x={sx(v) - 50} y={y + 14} w={100} style={{textAlign: 'center', opacity: p}}>
					<Tex px={size.small} ink="pencil" display={false} tex={`${v}`} />
				</At>
			))}
			{[500, 1000].map((v) => (
				<At key={v} x={x - 92} y={sy(v) - 18} w={76} style={{textAlign: 'right', opacity: p}}>
					<Tex px={size.small} ink="pencil" display={false} tex={`${v}`} />
				</At>
			))}
		</>
	);
};
