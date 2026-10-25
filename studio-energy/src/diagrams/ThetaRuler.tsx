import React from 'react';
import {exposeStyle} from '../design/motion';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, Ink, size, stroke} from '../design/tokens';
import {MixedLine, Part} from './MixedLine';

// Sizes as powers of D on one vertical ruler: a mark at height e stands for
// D^e. The budget is a cobalt line across it; whatever rises above the line
// overspends. Schematic as a picture (constants and D^epsilon left out); the
// exponents it is given come from the formulas, never from the eye.

export type RulerMark = {e: number; tex: string; words?: Part[]; ink?: Ink; p: number};

type Props = {
	x: number; // the axis
	top: number;
	bottom: number;
	lo: number; // exponent at the bottom
	hi: number; // exponent at the top
	p?: number;
	ticks?: {e: number; tex: string}[];
	marks: RulerMark[];
	budget?: {e: number; p: number; label: Part[]};
	gap?: {from: number; to: number; p: number; tex: string; ink?: Ink};
	over?: {from: number; to: number; p: number}; // the overspend, between the budget and a mark above it
};

export const rulerY = (top: number, bottom: number, lo: number, hi: number, e: number): number => bottom - ((e - lo) / (hi - lo)) * (bottom - top);

export const ThetaRuler: React.FC<Props> = ({x, top, bottom, lo, hi, p = 1, ticks = [], marks, budget, gap, over}) => {
	const Y = (e: number) => rulerY(top, bottom, lo, hi, e);
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<line x1={x} x2={x} y1={bottom} y2={bottom - (bottom - top) * p} stroke={color.pencil} strokeWidth={stroke.line} />
				<path d={`M${x - 8},${top + 14} L${x},${top} L${x + 8},${top + 14}`} fill="none" stroke={color.pencil} strokeWidth={stroke.line} opacity={p >= 1 ? 1 : 0} />
				{ticks.map((t) => (
					<line key={t.e} x1={x - 10} x2={x} y1={Y(t.e)} y2={Y(t.e)} stroke={color.pencil} strokeWidth={stroke.line} opacity={p} />
				))}
				{over && over.p > 0 && <rect x={x - 14} y={Y(over.to)} width={28} height={Y(over.from) - Y(over.to)} fill={alpha('vermilion', 0.28)} opacity={over.p} />}
				{budget && budget.p > 0 && (
					<line x1={x - 24} x2={x - 24 + 320 * budget.p} y1={Y(budget.e)} y2={Y(budget.e)} stroke={color.cobalt} strokeWidth={stroke.budget} />
				)}
				{marks.map((m, i) =>
					m.p > 0 ? (
						<g key={i} opacity={m.p}>
							<line x1={x - 18} x2={x + 18} y1={Y(m.e)} y2={Y(m.e)} stroke={color[m.ink ?? 'ink']} strokeWidth={stroke.bold} strokeLinecap="round" />
						</g>
					) : null,
				)}
				{gap && gap.p > 0 && (
					<g opacity={Math.min(1, gap.p * 2)}>
						<line x1={x - 44} x2={x - 44} y1={Y(gap.from)} y2={Y(gap.from) + (Y(gap.to) - Y(gap.from)) * gap.p} stroke={color[gap.ink ?? 'vermilion']} strokeWidth={stroke.line} />
						<line x1={x - 54} x2={x - 34} y1={Y(gap.from)} y2={Y(gap.from)} stroke={color[gap.ink ?? 'vermilion']} strokeWidth={stroke.line} />
						<line x1={x - 54} x2={x - 34} y1={Y(gap.to)} y2={Y(gap.to)} stroke={color[gap.ink ?? 'vermilion']} strokeWidth={stroke.line} opacity={gap.p >= 1 ? 1 : 0} />
					</g>
				)}
			</svg>
			{ticks.map((t) => (
				<At key={t.e} x={x - 130} y={Y(t.e) - 20} w={110} style={{textAlign: 'right', opacity: p}}>
					<Tex px={size.small} ink="pencil" display={false} tex={t.tex} />
				</At>
			))}
			{marks.map((m, i) => (
				<At key={i} x={x + 34} y={Y(m.e) - 24} style={{whiteSpace: 'nowrap', display: 'flex', alignItems: 'baseline', gap: 14, ...exposeStyle(m.p)}}>
					<Tex px={size.label} ink={m.ink ?? 'ink'} display={false} tex={m.tex} />
					{m.words && <MixedLine px={size.small} parts={m.words} />}
				</At>
			))}
			{budget && (
				<At x={x + 34} y={Y(budget.e) + 8} style={{whiteSpace: 'nowrap', ...exposeStyle(budget.p)}}>
					<MixedLine px={size.small} ink="cobalt" parts={budget.label} />
				</At>
			)}
			{gap && (
				<At x={x - 270} y={(Y(gap.from) + Y(gap.to)) / 2 - 22} w={200} style={{textAlign: 'right', ...exposeStyle(gap.p)}}>
					<Tex px={size.label} ink={gap.ink ?? 'vermilion'} display={false} tex={gap.tex} />
				</At>
			)}
		</>
	);
};
