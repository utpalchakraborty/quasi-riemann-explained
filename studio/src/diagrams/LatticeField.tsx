import React, {useMemo} from 'react';
import {eisNorm, eisPoint, isEisensteinPrime} from './Lattice';

// The Eisenstein lattice with a per-point style, for figures that need to
// mark particular elements (terms of a sum, multiples of a prime, primes by
// norm). Arithmetic is exact: elements a + b·omega are pairs [a, b].

export type E = [number, number];

export const eMul = ([a, b]: E, [c, d]: E): E => [a * c - b * d, a * d + b * c - b * d];
export const eConj = ([a, b]: E): E => [a - b, -b];
export const eDivides = (d: E, x: E): boolean => {
	const n = eisNorm(d[0], d[1]);
	const [p, q] = eMul(x, eConj(d));
	return p % n === 0 && q % n === 0;
};
// Primary in the manuscripts' sense: congruent to 1 modulo 3.
export const isPrimary = ([a, b]: E): boolean => ((a % 3) + 3) % 3 === 1 && ((b % 3) + 3) % 3 === 0;
export {eisNorm, isEisensteinPrime};

export type PointStyle = {r: number; fill?: string; stroke?: string; sw?: number; opacity?: number} | null;

export type LatticePoint = {a: number; b: number; x: number; y: number; dist: number; N: number};

export const latticePoints = (radius: number): LatticePoint[] => {
	const pts: LatticePoint[] = [];
	const R = Math.ceil(radius * 1.3);
	for (let a = -R; a <= R; a++)
		for (let b = -R; b <= R; b++) {
			const [x, y] = eisPoint(a, b);
			const dist = Math.hypot(x, y);
			if (dist <= radius) pts.push({a, b, x, y, dist, N: eisNorm(a, b)});
		}
	return pts;
};

export const LatticeField: React.FC<{
	cx: number;
	cy: number;
	unit: number;
	radius: number;
	style: (pt: LatticePoint) => PointStyle;
	under?: React.ReactNode; // svg drawn beneath the points
	over?: React.ReactNode; // svg drawn above the points
	opacity?: number;
}> = ({cx, cy, unit, radius, style, under, over, opacity = 1}) => {
	const pts = useMemo(() => latticePoints(radius), [radius]);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity}}>
			{under}
			{pts.map((pt) => {
				const s = style(pt);
				if (!s || (s.opacity ?? 1) <= 0) return null;
				return (
					<circle
						key={`${pt.a},${pt.b}`}
						cx={cx + unit * pt.x}
						cy={cy - unit * pt.y}
						r={s.r}
						fill={s.fill ?? 'none'}
						stroke={s.stroke}
						strokeWidth={s.sw}
						opacity={s.opacity ?? 1}
					/>
				);
			})}
			{over}
		</svg>
	);
};

// Screen position of a + b·omega.
export const latticeXY = (cx: number, cy: number, unit: number, [a, b]: E): [number, number] => {
	const [x, y] = eisPoint(a, b);
	return [cx + unit * x, cy - unit * y];
};
