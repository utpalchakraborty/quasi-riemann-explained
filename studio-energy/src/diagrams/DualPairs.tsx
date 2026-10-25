import React, {useMemo} from 'react';
import {alpha, color, stroke} from '../design/tokens';
import {residues, type Eis} from './DualArith';
import {latticePoints} from './LatticeField';

// Chapter 5, expanding the squares.
//
// PairGrid: the cross terms of |sum_n a_n chi_n(u)|^2 as a grid of pairs of
// columns (n, m), the diagonal n = m shaded. Schematic: the grid is small.
//
// PhaseTicks: for one pair, the product chi_n(u) conj(chi_m(u)) at every row u
// of a disk, drawn as a tick at that sixth root of unity's angle, computed
// exactly (DualArith) for the primary primes n = -2 - 3·omega (norm 7) and
// m = 1 - 3·omega (norm 13). Rows divisible by n or m give 0, drawn as a ring.

export const PAIR_N: Eis = [-2, -3];
export const PAIR_M: Eis = [1, -3];

type GridProps = {
	x: number;
	y: number;
	cell: number;
	k: number; // columns shown
	p?: number;
	diag?: number;
	lit?: {i: number; j: number; p: number};
};

export const PairGrid: React.FC<GridProps> = ({x, y, cell, k, p = 1, diag = 0, lit}) => (
	<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: p}}>
		{Array.from({length: k}, (_, i) => (
			<rect key={`d${i}`} x={x + i * cell} y={y + i * cell} width={cell} height={cell} fill={alpha('ink', 0.14 * diag)} />
		))}
		{Array.from({length: k + 1}, (_, i) => (
			<React.Fragment key={i}>
				<line x1={x} x2={x + k * cell} y1={y + i * cell} y2={y + i * cell} stroke={alpha('pencil', i === 0 || i === k ? 0.8 : 0.35)} strokeWidth={stroke.hair} />
				<line x1={x + i * cell} x2={x + i * cell} y1={y} y2={y + k * cell} stroke={alpha('pencil', i === 0 || i === k ? 0.8 : 0.35)} strokeWidth={stroke.hair} />
			</React.Fragment>
		))}
		{lit && lit.p > 0 && <rect x={x + lit.j * cell} y={y + lit.i * cell} width={cell} height={cell} fill={alpha('viridian', 0.25 * lit.p)} stroke={color.viridian} strokeWidth={stroke.bold} opacity={lit.p} />}
	</svg>
);

type TickProps = {
	cx: number;
	cy: number;
	unit: number;
	radius: number;
	p?: number; // ticks inked outward from the centre
	len?: number;
	opacity?: number;
};

export const PhaseTicks: React.FC<TickProps> = ({cx, cy, unit, radius, p = 1, len = 13, opacity = 1}) => {
	const pts = useMemo(() => {
		const rn = residues(PAIR_N);
		const rm = residues(PAIR_M);
		return latticePoints(radius)
			.filter((u) => u.N > 0)
			.map((u) => {
				const kn = rn.chi([u.a, u.b]);
				const km = rm.chi([u.a, u.b]);
				return {x: u.x, y: u.y, d: u.dist, k: kn === null || km === null ? null : (((kn - km) % 6) + 6) % 6};
			});
	}, [radius]);
	if (opacity <= 0) return null;
	const limit = p * (radius + 1.5);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity}}>
			{pts.map((u, i) => {
				const a = Math.max(0, Math.min(1, limit - u.d));
				if (a <= 0) return null;
				const sx = cx + unit * u.x;
				const sy = cy - unit * u.y;
				if (u.k === null) return <circle key={i} cx={sx} cy={sy} r={5} fill={color.ground} stroke={color.pencil} strokeWidth={stroke.hair} opacity={a} />;
				const t = (Math.PI * u.k) / 3;
				return <line key={i} x1={sx} y1={sy} x2={sx + len * a * Math.cos(t)} y2={sy - len * a * Math.sin(t)} stroke={color.viridian} strokeWidth={stroke.line} strokeLinecap="round" />;
			})}
		</svg>
	);
};
