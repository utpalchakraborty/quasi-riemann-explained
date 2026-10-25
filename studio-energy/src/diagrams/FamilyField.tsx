import React, {useMemo} from 'react';
import numerics from '../data/numerics.json';
import {alpha, color, Ink, stroke} from '../design/tokens';

// The family A_u(D) itself, computed (scripts/compute_data.py, N3): D = 2000,
// theta = 0.1, every row u in Z[omega] with 0 < N(u) <= H = D^1.1, nu trivial,
// columns the squarefree primary n prime to 6 in the window's support. Each row
// is drawn at its lattice position as a square of side proportional to
// |A_u(D)|, so the picture's ink is the family's energy, to scale.

type FamilyData = {
	D: number;
	H: number;
	rows: number;
	columns: number;
	energy: number;
	DH: number;
	energy_over_random: number;
	column_mass: number;
	rms: number;
	A1: number;
	max_row: {a: number; b: number; size: number};
	max_over_rms: number;
	copies_inside: boolean;
	Y: number;
	grid_a: number[];
	grid_b: number[];
	grid_size: number[];
};

export const FAMILY = numerics.family as unknown as FamilyData;

// The figures the narration states, asserted so a recomputation that changes
// them fails the render instead of contradicting the voice.
if (FAMILY.rows !== 15528 || FAMILY.columns !== 847) throw new Error('family size changed: update family-8');
if (FAMILY.max_over_rms < 2.6 || FAMILY.max_over_rms > 3.4) throw new Error('largest row is no longer about three times typical');
if (Math.abs(FAMILY.energy_over_random - 1) > 0.05) throw new Error('family energy no longer within 5% of random signs');
if (FAMILY.copies_inside) throw new Error('copies now inside the family: the caveat in family-9 is wrong');

const SQ3 = Math.sqrt(3) / 2;
// u = a + b·omega, omega = -1/2 + i·sqrt(3)/2; screen y runs down.
export const latticeXY = (a: number, b: number): [number, number] => [a - b / 2, -b * SQ3];

export type FieldProps = {
	cx: number;
	cy: number;
	unit: number; // pixels per lattice unit
	radius?: number; // show rows with |u| <= radius (lattice units); default: all
	reveal?: number; // 0..1, rows appear outward from the center
	side?: number; // pixels per unit of |A_u(D)|
	ink?: Ink;
	target?: number; // light the row u = 1 in cobalt, 0..1
	dots?: number; // faint lattice points under the squares, 0..1
	hollow?: boolean; // outlines instead of filled squares
	opacity?: number;
};

export const FamilyField: React.FC<FieldProps> = ({cx, cy, unit, radius, reveal = 1, side, ink = 'ink', target = 0, dots = 0, hollow = false, opacity = 1}) => {
	const R = radius ?? Math.sqrt(FAMILY.H);
	const s = side ?? (unit * 0.92) / FAMILY.max_row.size;
	const rows = useMemo(() => {
		const out: {x: number; y: number; d: number; size: number; one: boolean}[] = [];
		for (let i = 0; i < FAMILY.grid_a.length; i++) {
			const a = FAMILY.grid_a[i];
			const b = FAMILY.grid_b[i];
			const [lx, ly] = latticeXY(a, b);
			const d = Math.hypot(lx, ly);
			if (d > R) continue;
			out.push({x: cx + lx * unit, y: cy + ly * unit, d, size: FAMILY.grid_size[i], one: a === 1 && b === 0});
		}
		return out;
	}, [cx, cy, unit, R]);
	if (opacity <= 0) return null;
	const limit = reveal * (R + 1);
	let path = '';
	let dotPath = '';
	let one: (typeof rows)[number] | null = null;
	for (const r of rows) {
		if (r.d > limit) continue;
		if (r.one) one = r;
		const k = Math.max(0.6, r.size * s);
		path += `M${(r.x - k / 2).toFixed(1)} ${(r.y - k / 2).toFixed(1)}h${k.toFixed(1)}v${k.toFixed(1)}h${(-k).toFixed(1)}z`;
		if (dots > 0) dotPath += `M${r.x.toFixed(1)} ${r.y.toFixed(1)}h0.01`;
	}
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity}}>
			{dots > 0 && <path d={dotPath} stroke={alpha('pencil', 0.5 * dots)} strokeWidth={3} strokeLinecap="round" />}
			<path d={path} fill={hollow ? 'none' : alpha(ink, 0.82)} stroke={hollow ? color[ink] : 'none'} strokeWidth={hollow ? stroke.hair : 0} />
			{one && target > 0 && (
				<g opacity={target}>
					<rect
						x={one.x - (one.size * s) / 2}
						y={one.y - (one.size * s) / 2}
						width={one.size * s}
						height={one.size * s}
						fill={color.cobalt}
					/>
					<circle cx={one.x} cy={one.y} r={unit * 0.9} fill="none" stroke={color.cobalt} strokeWidth={stroke.line} />
				</g>
			)}
		</svg>
	);
};
