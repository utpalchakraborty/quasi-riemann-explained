import React from 'react';
import {lerp} from '../design/motion';
import {alpha, color, ease, stroke} from '../design/tokens';
import {Frame, Square, useHatch} from './Area';

// Chapter 4, the second way to spend: counting outliers (Chebyshev). A family
// of squares on a baseline, a threshold T, and a budget frame of area B. Each
// row above T contains a T-by-T square; those squares fit inside the frame,
// so there are at most B/T^2 of them. Schematic: sizes are illustrative; the
// frame is drawn with area exactly 9 T^2, at least the family's total area.

export const OUT_T = 96;
const SIDES = [44, 61, 37, 113, 52, 70, 31, 59, 65, 105, 41, 68, 48, 120, 57, 63];
const GAP = 12;
export const OUT_CELLS = 3; // the frame is OUT_CELLS T wide and OUT_CELLS T tall
const B = (OUT_CELLS * OUT_T) ** 2;
const TOTAL = SIDES.reduce((s, x) => s + x * x, 0);
const OUTLIERS = SIDES.map((s, i) => ({s, i})).filter((r) => r.s > OUT_T);
if (TOTAL > B) throw new Error('the frame must hold the whole family');
if (OUTLIERS.length > B / OUT_T ** 2) throw new Error('Chebyshev violated in the schematic');
export const OUT_COUNT = OUTLIERS.length;
export const OUT_W = SIDES.reduce((s, x) => s + x, 0) + GAP * (SIDES.length - 1);

type Props = {
	x: number; // left end of the baseline
	y: number; // baseline
	fx: number; // the frame's left edge; it stands on the same baseline
	p?: number; // squares inked in
	frameP?: number;
	line?: number; // the threshold drawn across
	flag?: number; // rows above T lit
	carve?: number; // their T-by-T squares hatched
	move?: number; // those squares carried into the frame
	grid?: number; // the frame's cells, room for B/T^2
};

export const OutlierRow: React.FC<Props> = ({x, y, fx, p = 1, frameP = 0, line = 0, flag = 0, carve = 0, move = 0, grid = 0}) => {
	const verm = useHatch('vermilion', 'medium', 0.9);
	const side = OUT_CELLS * OUT_T;
	const top = y - side;
	const t = ease.inOut(Math.max(0, Math.min(1, move)));
	const xs: number[] = [];
	SIDES.reduce((acc, s) => {
		xs.push(acc);
		return acc + s + GAP;
	}, x);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<defs>{verm.defs}</defs>
			<line x1={x - 20} x2={x + OUT_W + 20} y1={y} y2={y} stroke={alpha('pencil', 0.8)} strokeWidth={stroke.line} opacity={p > 0 ? 1 : 0} />
			{SIDES.map((s, i) => {
				const over = s > OUT_T;
				const a = Math.max(0, Math.min(1, p * (SIDES.length + 4) - i));
				return <Square key={i} x={xs[i]} y={y - s} side={s} ink={over && flag > 0 ? 'vermilion' : 'ink'} width={over ? stroke.line + flag * 1.5 : stroke.line} p={a} />;
			})}
			{/* the threshold */}
			<line x1={x - 20} x2={lerp(x - 20, fx + side + 30, line)} y1={y - OUT_T} y2={y - OUT_T} stroke={color.ink} strokeWidth={stroke.line} strokeDasharray="10 8" opacity={line > 0 ? 1 : 0} />
			{/* the budget, and its cells of area T^2 */}
			<Frame x={fx} y={top} w={side} h={side} p={frameP} />
			<g opacity={grid}>
				{Array.from({length: OUT_CELLS - 1}, (_, k) => (
					<React.Fragment key={k}>
						<line x1={fx + (k + 1) * OUT_T} x2={fx + (k + 1) * OUT_T} y1={top} y2={y} stroke={alpha('pencil', 0.6)} strokeWidth={stroke.hair} strokeDasharray="3 6" />
						<line x1={fx} x2={fx + side} y1={top + (k + 1) * OUT_T} y2={top + (k + 1) * OUT_T} stroke={alpha('pencil', 0.6)} strokeWidth={stroke.hair} strokeDasharray="3 6" />
					</React.Fragment>
				))}
			</g>
			{/* each outlier's T-by-T square, then carried into a cell of the frame */}
			{carve > 0 &&
				OUTLIERS.map((r, k) => {
					const sx = xs[r.i];
					const sy = y - OUT_T;
					const cx = fx + (k % OUT_CELLS) * OUT_T;
					const cy = y - OUT_T * (1 + Math.floor(k / OUT_CELLS));
					return (
						<g key={r.i}>
							{move > 0 && <rect x={sx} y={sy} width={OUT_T} height={OUT_T} fill={`url(#${verm.id})`} opacity={0.35 * carve} />}
							<Square x={lerp(sx, cx, t)} y={lerp(sy, cy, t)} side={OUT_T} ink="vermilion" fill={`url(#${verm.id})`} fillP={carve} width={stroke.line} p={carve} />
						</g>
					);
				})}
		</svg>
	);
};
