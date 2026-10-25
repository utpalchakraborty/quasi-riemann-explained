import React from 'react';
import numerics from '../data/numerics.json';
import {alpha, stroke} from '../design/tokens';
import {useHatch} from './Area';
import {EnergyRect} from './Energy';

// The recursion as nested energy rectangles sharing a diagonal: every level
// keeps the ratio H/X, so each is a similar copy of the last, anchored at the
// same bottom-left corner. The row exponents are upper bounds, computed in
// scripts/compute_data.py (N8) from H' << D^{-2θ} H, starting at H ≍ D^{1-θ}:
// 1 - θ - 2θj until it reaches 0, where the row parameter is at most 1 and the
// level is counted. The drawn contraction is schematic: the true shrink is at
// least D^{2θ} per level and depends on b.

export const SCHEDULE = numerics.schedule as {theta: number; row_exponents: number[]};
export const LEVELS = SCHEDULE.row_exponents;
{
	const t = SCHEDULE.theta;
	const ok = LEVELS.every((e, j) => (j < LEVELS.length - 1 ? Math.abs(e - (1 - t - 2 * t * j)) < 1e-6 : e === 0)) && LEVELS[LEVELS.length - 2] - 2 * t <= 0;
	if (!ok) throw new Error('numerics.schedule no longer matches 1 - θ - 2θj, ending at 0');
}

const RHO = 0.64; // schematic contraction per level, for the picture only

export const levelSize = (w: number, h: number, j: number): {w: number; h: number} => ({w: w * RHO ** j, h: h * RHO ** j});

type Props = {
	x: number; // the shared bottom-left corner
	y: number;
	w: number; // outer rectangle: columns
	h: number; // outer rectangle: rows
	shown: number[]; // per level, 0..1
	lit?: number[]; // per level, 0..1
	diag?: number;
	counted?: number; // the last level hatched: counting
};

export const RecLadder: React.FC<Props> = ({x, y, w, h, shown, lit = [], diag = 0, counted = 0}) => {
	const hatch = useHatch('ink', 'medium', 0.8);
	const last = LEVELS.length - 1;
	const reach = w * 1.06;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<defs>{hatch.defs}</defs>
			<line x1={x} y1={y} x2={x + reach * diag} y2={y - reach * (h / w) * diag} stroke={alpha('pencil', 0.8)} strokeWidth={stroke.hair} strokeDasharray="6 8" />
			{LEVELS.map((_, j) => {
				const p = shown[j] ?? 0;
				if (p <= 0) return null;
				const s = levelSize(w, h, j);
				const l = lit[j] ?? 0;
				return (
					<g key={j}>
						{j === last && counted > 0 && <rect x={x} y={y - s.h} width={s.w} height={s.h} fill={`url(#${hatch.id})`} opacity={counted} />}
						<EnergyRect x={x} y={y} w={s.w} h={s.h} p={p} ink={l > 0.5 ? 'ink' : j === 0 ? 'ink' : 'pencil'} width={l > 0.5 ? stroke.bold : stroke.line} fill={j === 0 ? 0.6 : 0} />
					</g>
				);
			})}
		</svg>
	);
};
