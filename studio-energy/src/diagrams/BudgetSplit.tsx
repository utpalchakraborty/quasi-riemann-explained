import React from 'react';
import {At} from '../design/scene';
import {alpha, color, size, stroke} from '../design/tokens';
import {MixedLine} from './MixedLine';

// The energy budget spent on the copies: one bar per copy u = p^6, each the
// target squared (cobalt) plus its error (vermilion), laid end to end against the
// budget D^{1+eps} H. Schematic: lengths show the inequality, not data.

type Props = {
	x: number;
	y: number; // top of the bars
	w: number; // the budget's length
	h: number;
	count: number; // J
	shown: number; // bars drawn so far (fractional)
	scale: number; // bar length relative to an exact fit (1 = J bars fill the budget)
	error?: number; // vermilion share of each bar
	errorP?: number;
	budgetP?: number;
	isolate?: number; // one bar singled out, after dividing
};

export const BudgetSplit: React.FC<Props> = ({x, y, w, h, count, shown, scale, error = 0.16, errorP = 0, budgetP = 0, isolate = 0}) => {
	const bw = (w / count) * scale;
	const total = x + bw * Math.min(shown, count);
	const over = Math.max(0, total - (x + w));
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>
					<pattern id="budget-over" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
						<line x1="0" y1="0" x2="0" y2="12" stroke={color.vermilion} strokeWidth="2" />
					</pattern>
				</defs>
				{Array.from({length: count}, (_, i) => {
					const op = Math.max(0, Math.min(1, shown - i));
					if (op <= 0) return null;
					const bx = x + i * bw;
					const inner = Math.max(1, bw - 3);
					const eW = inner * error * errorP;
					const lift = i === 0 ? -24 * isolate : 0;
					return (
						<g key={i} opacity={op * (isolate > 0 && i > 0 ? 1 - 0.15 * isolate : 1)}>
							<rect x={bx} y={y + lift} width={inner - eW} height={h} fill={color.cobalt} />
							{eW > 0 && <rect x={bx + inner - eW} y={y + lift} width={eW} height={h} fill={color.vermilion} />}
						</g>
					);
				})}
				{over > 0 && budgetP > 0 && <rect x={x + w} y={y - 8} width={over} height={h + 16} fill="url(#budget-over)" opacity={0.9 * budgetP} />}
				<g opacity={budgetP}>
					<line x1={x} x2={x + w} y1={y - 44} y2={y - 44} stroke={color.ink} strokeWidth={stroke.line} />
					<line x1={x} x2={x} y1={y - 58} y2={y + h + 10} stroke={alpha('ink', 0.8)} strokeWidth={stroke.line} />
					<line x1={x + w} x2={x + w} y1={y - 58} y2={y + h + 10} stroke={alpha('ink', 0.8)} strokeWidth={stroke.line} strokeDasharray="6 6" />
				</g>
				{isolate > 0 && (
					<g opacity={isolate}>
						<line x1={x} x2={x + bw - 3} y1={y + h + 24} y2={y + h + 24} stroke={color.ink} strokeWidth={stroke.line} />
						<line x1={x} x2={x} y1={y + h + 16} y2={y + h + 32} stroke={color.ink} strokeWidth={stroke.line} />
						<line x1={x + bw - 3} x2={x + bw - 3} y1={y + h + 16} y2={y + h + 32} stroke={color.ink} strokeWidth={stroke.line} />
					</g>
				)}
			</svg>
			<At x={x + w + over / 2 - 150} y={y - 62} w={300} style={{textAlign: 'center', opacity: budgetP * Math.min(1, over / 60)}}>
				<MixedLine ink="vermilion" px={size.small} parts={['over budget']} />
			</At>
			<At x={x + w / 2 - 300} y={y - 112} w={600} style={{textAlign: 'center', opacity: budgetP}}>
				<MixedLine ink="ink" px={size.label} parts={['the budget  ', {tex: 'D^{1+\\varepsilon}H', ink: 'ink'}]} />
			</At>
		</>
	);
};
