import React from 'react';
import {seeded} from '../design/scene';
import {Ink} from '../design/tokens';
import {Square, useHatch} from './Area';

// The transfer estimate's row ranges, drawn on one remainder rectangle whose
// width is the column scale L_b. Schematic sizes, exact relations: the
// original mean square is X wide and H tall, a remainder has L_b = X / N(b)^3,
// and the row side then runs
//   H  ->  L_b^2 / H        (first Poisson summation, in h)
//      ->  Y = X L_b / H    (enlarged: legal because every term is a square)
//      ->  H' = L_b^2 / Y = H L_b / X   (second Poisson summation, in y),
// which leaves (H', L_b) similar to (H, X). October manuscript, §2.5.

export const TRANSFER = (() => {
	const X = 600; // px: the original column scale
	const H = 360; // px: the original row scale
	const s = 0.3; // 1 / N(b)^3, schematic
	const Lb = X * s;
	const R1 = (Lb * Lb) / H;
	const Y = (X * Lb) / H;
	const Hp = (Lb * Lb) / Y;
	const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
	// a remainder exists only when N(b) > H_c, i.e. L_b < H^2 / X
	if (!(s < (H / X) ** 2)) throw new Error('TRANSFER: no remainder at this N(b)');
	if (!near(Hp, (H * Lb) / X) || !near(Hp / Lb, H / X) || !(Y >= R1) || !(Y <= H))
		throw new Error('TRANSFER: the drawn row ranges no longer satisfy the transfer relations');
	return {X, H, s, Lb, R1, Y, Hp};
})();

export const ROW_BAND = 30; // px per drawn row of the remainder

type RowSquaresProps = {
	x: number; // left edge of the rectangle
	y: number; // its bottom
	rows: number; // how many bands to draw
	from?: number; // first band drawn (bands below are skipped)
	p?: number;
	ink?: Ink;
	density?: 'light' | 'medium' | 'dense';
};

// One square per row band: the term |M(y)|^2 of that row, drawn as area.
export const RowSquares: React.FC<RowSquaresProps> = ({x, y, rows, from = 0, p = 1, ink = 'ink', density = 'medium'}) => {
	const hatch = useHatch(ink, density, 0.85);
	if (p <= 0) return null;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<defs>{hatch.defs}</defs>
			{Array.from({length: rows - from}, (_, k) => {
				const i = from + k;
				const side = 9 + 15 * seeded(i, 17);
				const top = y - (i + 1) * ROW_BAND + (ROW_BAND - side) / 2;
				const q = Math.max(0, Math.min(1, p * (rows - from) - k));
				return <Square key={i} x={x + 10} y={top} side={side} ink={ink} fill={`url(#${hatch.id})`} p={q} width={1.5} />;
			})}
		</svg>
	);
};
