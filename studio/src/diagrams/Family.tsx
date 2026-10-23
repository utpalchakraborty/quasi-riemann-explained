import React from 'react';
import {seeded} from '../design/scene';
import {alpha, color, font, size, stroke} from '../design/tokens';

// A family of sums drawn as bars of squared size, one per row u. Schematic:
// heights are illustrative, never computed character sums. Row 0 is the
// target (u = 1). `copies` marks rows that nearly repeat the target.

type Props = {
	x: number;
	y: number; // baseline
	w: number;
	h: number; // height of the tallest ordinary bar
	rows: number;
	p?: number; // reveal, left to right
	target?: number; // height of the target bar, in units of h
	targetLit?: number;
	copies?: number[]; // row indices
	copiesLit?: number;
	copyHeight?: number; // in units of h; defaults to target
	budget?: number; // budget line, in units of h (0 = hidden)
	budgetP?: number;
	over?: number; // 0..1 how far copies overspend (ember)
	labelTarget?: string;
};

export const Family: React.FC<Props> = ({
	x,
	y,
	w,
	h,
	rows,
	p = 1,
	target = 0.45,
	targetLit = 1,
	copies = [],
	copiesLit = 0,
	copyHeight,
	budget = 0,
	budgetP = 1,
	over = 0,
	labelTarget,
}) => {
	const bw = w / rows;
	const bar = (i: number) => 0.16 + 0.42 * seeded(i, 7) * seeded(i, 3) + 0.12 * seeded(i, 11);
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<line x1={x} x2={x + w} y1={y} y2={y} stroke={alpha('mist', 0.7)} strokeWidth={stroke.line} />
				{Array.from({length: rows}, (_, i) => {
					const op = Math.max(0, Math.min(1, p * rows - i));
					if (op <= 0) return null;
					const isTarget = i === 0;
					const isCopy = copies.includes(i);
					const ch = copyHeight ?? target;
					const unit = isTarget ? target : isCopy ? bar(i) + (ch - bar(i)) * copiesLit : bar(i);
					const height = Math.max(2, h * unit);
					const fill = isTarget ? (targetLit > 0 ? color.gilt : color.mist) : isCopy && copiesLit > 0 ? (over > 0 ? color.ember : color.gilt) : alpha('mist', 0.55);
					return (
						<rect
							key={i}
							x={x + i * bw + bw * 0.18}
							y={y - height}
							width={bw * 0.64}
							height={height}
							rx={Math.min(3, bw * 0.2)}
							fill={fill}
							opacity={op * (isCopy && copiesLit > 0 ? 0.6 + 0.4 * copiesLit : 1)}
						/>
					);
				})}
				{budget > 0 && (
					<g opacity={budgetP}>
						<line x1={x} x2={x + w} y1={y - h * budget} y2={y - h * budget} stroke={color.paper} strokeWidth={stroke.line} strokeDasharray="10 8" />
					</g>
				)}
				{over > 0 && (
					<rect x={x} y={y - h * budget - h * 0.5 * over} width={w} height={h * 0.5 * over} fill={alpha('ember', 0.14)} />
				)}
			</svg>
			{labelTarget && (
				<div
					style={{
						position: 'absolute',
						left: x - 40,
						top: y + 18,
						width: 120,
						textAlign: 'left',
						fontFamily: font.text,
						fontSize: size.small,
						color: color.gilt,
						opacity: targetLit,
					}}
				>
					{labelTarget}
				</div>
			)}
		</>
	);
};
