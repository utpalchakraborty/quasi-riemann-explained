import React from 'react';
import {seeded} from '../design/scene';
import {alpha, color, Ink, stroke} from '../design/tokens';

// The family A_u(D) as bars of size |A_u(D)|, one per row u, beside the
// energy meter: a single column built from the squares |A_u(D)|^2, stacked
// row by row, under the budget line. Schematic: sizes are illustrative, drawn
// so that their mean square is exactly one typical size squared.

export const familySizes = (rows: number, salt = 5): number[] => {
	const raw = Array.from({length: rows}, (_, i) => Math.sqrt(-Math.log(1 - 0.96 * seeded(i, salt))));
	const ms = raw.reduce((s, v) => s + v * v, 0) / rows;
	return raw.map((v) => v / Math.sqrt(ms));
};

type BarsProps = {
	x: number;
	y: number; // baseline
	w: number;
	unit: number; // pixels for the typical size
	sizes: number[];
	p?: number; // reveal, left to right
	ink?: (i: number) => Ink | null; // per-row ink, default pencil
	axis?: number;
};

export const EnergyBars: React.FC<BarsProps> = ({x, y, w, unit, sizes, p = 1, ink, axis = 1}) => {
	const rows = sizes.length;
	const bw = w / rows;
	const bx = (i: number) => x + i * bw + bw * 0.18;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<line x1={x} x2={x + w} y1={y} y2={y} stroke={alpha('pencil', 0.7)} strokeWidth={stroke.line} opacity={axis} />
			{sizes.map((s, i) => {
				const op = Math.max(0, Math.min(1, p * rows - i));
				if (op <= 0) return null;
				const k = ink?.(i) ?? null;
				const height = Math.max(2, unit * s);
				return (
					<rect
						key={i}
						x={bx(i)}
						y={y - height}
						width={bw * 0.64}
						height={height}
						rx={Math.min(3, bw * 0.2)}
						fill={k ? color[k] : alpha('pencil', 0.55)}
						opacity={op}
					/>
				);
			})}
		</svg>
	);
};

type MeterProps = {
	x: number;
	y: number; // baseline
	w: number;
	h: number; // height of the budget line above the baseline
	squares: number[]; // |A_u|^2 in typical units, stacked bottom up
	budget: number; // in the same units
	filled?: number; // rows stacked so far (fractional)
	budgetP?: number;
	ink?: (i: number) => Ink | null;
};

export const EnergyMeter: React.FC<MeterProps> = ({x, y, w, h, squares, budget, filled = squares.length, budgetP = 1, ink}) => {
	const scale = h / budget;
	let base = y;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<line x1={x - 14} x2={x + w + 14} y1={y} y2={y} stroke={alpha('pencil', 0.7)} strokeWidth={stroke.line} />
			{squares.map((q, i) => {
				const part = Math.max(0, Math.min(1, filled - i));
				if (part <= 0) return null;
				const height = q * scale * part;
				base -= height;
				const k = ink?.(i) ?? null;
				return (
					<rect
						key={i}
						x={x}
						y={base}
						width={w}
						height={height}
						fill={k ? color[k] : alpha('ink', i % 2 ? 0.62 : 0.8)}
					/>
				);
			})}
			<line x1={x - 22} x2={x + w + 22} y1={y - h} y2={y - h} stroke={color.ink} strokeWidth={stroke.line} strokeDasharray="10 8" opacity={budgetP} />
		</svg>
	);
};
