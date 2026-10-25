import React from 'react';
import {exposeStyle, lerp} from '../design/motion';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, Ink, size, stroke} from '../design/tokens';
import {Density, useHatch} from './Area';
import {MixedLine} from './MixedLine';
import {WALKS} from './WalkPlot';

// The running mean of the squared ends (N1, `running_mean_sq`): the mean of
// S² over the first k walks, k = 1 .. 4000, on a logarithmic axis in k so the
// first handful of walks and the last thousands both have room.

type ChartProps = {
	x: number; // left edge
	y: number; // top edge
	w: number;
	h: number;
	yMax?: number;
	upto: number; // walks drawn so far (1 .. 4000, fractional)
	axes?: number;
	line?: number; // the line at N, 0..1
	readout?: number;
};

const KMAX = WALKS.walks;

export const MeanChart: React.FC<ChartProps> = ({x, y, w, h, yMax = 1400, upto, axes = 1, line = 0, readout = 0}) => {
	const sx = (k: number) => x + (Math.log(k) / Math.log(KMAX)) * w;
	const sy = (v: number) => y + h - (v / yMax) * h;
	const k = Math.max(1, Math.min(KMAX, Math.floor(upto)));
	const rm = WALKS.running_mean_sq;
	let d = '';
	if (upto >= 1) for (let i = 1; i <= k; i++) d += `${i === 1 ? 'M' : 'L'}${sx(i).toFixed(1)} ${sy(rm[i - 1]).toFixed(1)}`;
	const xTicks = [1, 10, 100, 1000, KMAX];
	const yTicks = [0, 500, 1000];
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={axes}>
					<line x1={x} x2={x + w} y1={y + h} y2={y + h} stroke={alpha('pencil', 0.75)} strokeWidth={stroke.hair} />
					<line x1={x} x2={x} y1={y} y2={y + h} stroke={alpha('pencil', 0.75)} strokeWidth={stroke.hair} />
					{xTicks.map((t) => (
						<line key={t} x1={sx(t)} x2={sx(t)} y1={y + h} y2={y + h + 8} stroke={alpha('pencil', 0.75)} strokeWidth={stroke.hair} />
					))}
					{yTicks.slice(1).map((t) => (
						<line key={t} x1={x} x2={x + w} y1={sy(t)} y2={sy(t)} stroke={alpha('pencil', 0.25)} strokeWidth={stroke.hair} strokeDasharray="3 7" />
					))}
				</g>
				{line > 0 && (
					<line x1={x} x2={x + w * line} y1={sy(WALKS.steps)} y2={sy(WALKS.steps)} stroke={color.ink} strokeWidth={stroke.line} strokeDasharray="10 8" />
				)}
				{d && <path d={d} fill="none" stroke={color.ink} strokeWidth={stroke.line} strokeLinejoin="round" />}
				{upto >= 1 && <circle cx={sx(k)} cy={sy(rm[k - 1])} r={6.5} fill={color.ink} />}
			</svg>
			{xTicks.map((t) => (
				<At key={t} x={sx(t) - 50} y={y + h + 12} w={100} style={{textAlign: 'center', opacity: axes}}>
					<Tex tex={`${t}`} px={size.small} ink="pencil" display={false} />
				</At>
			))}
			{yTicks.map((t) => (
				<At key={t} x={x - 100} y={sy(t) - 20} w={84} style={{textAlign: 'right', opacity: axes}}>
					<Tex tex={`${t}`} px={size.small} ink="pencil" display={false} />
				</At>
			))}
			<At x={x + w - 300} y={y + h + 50} w={300} style={{textAlign: 'right', opacity: axes}}>
				<MixedLine px={size.small} parts={['walks averaged']} />
			</At>
			<At x={x + w - 60} y={sy(WALKS.steps) - 52} w={120} style={{textAlign: 'center', ...exposeStyle(line)}}>
				<Tex tex="N" px={size.mathInline} display={false} />
			</At>
			<At x={x + 24} y={y - 8} w={w - 40} style={{opacity: readout}}>
				<MixedLine
					px={size.label}
					ink="ink"
					parts={['mean of ', {tex: 'S^2'}, ' over ', {tex: `${k.toLocaleString('en-US').replace(',', '{,}')}`}, k === 1 ? ' walk: ' : ' walks: ', {tex: rm[k - 1].toFixed(1)}]}
				/>
			</At>
		</>
	);
};

// Squares poured into a budget: each square (side `side`, top-left x, y) flies
// to the column and becomes a strip of the column's width and the same area,
// stacked from the baseline in the given order. Exact as a picture of areas
// once landed, as in Area.tsx's AreaColumn; this variant moves the squares
// themselves, so the viewer sees each one become its strip.
export type PourItem = {x: number; y: number; side: number};

type PourProps = {
	items: PourItem[];
	column: {x: number; y: number; w: number}; // y: the baseline
	pour: (i: number) => number; // 0 = at its square, 1 = landed
	show?: (i: number) => number; // the square inked in, 0..1
	ghost?: number; // dashed outlines left where the squares were
	ink?: Ink;
	density?: Density;
	squareOpacity?: number;
};

export const PourSquares: React.FC<PourProps> = ({items, column, pour, show = () => 1, ghost = 0, ink = 'ink', density = 'medium', squareOpacity = 1}) => {
	const hatch = useHatch(ink, density, 0.75);
	let base = column.y;
	const strips = items.map((it) => {
		const h = (it.side * it.side) / column.w;
		base -= h;
		return {top: base, h};
	});
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<defs>{hatch.defs}</defs>
			{ghost > 0 &&
				items.map((it, i) =>
					it.side > 0 && pour(i) > 0 ? (
						<rect key={`g${i}`} x={it.x} y={it.y} width={it.side} height={it.side} fill="none" stroke={alpha('pencil', 0.55)} strokeWidth={stroke.hair} strokeDasharray="4 5" opacity={ghost * Math.min(1, pour(i) * 2)} />
					) : null,
				)}
			{items.map((it, i) => {
				const s = show(i);
				if (s <= 0 || it.side <= 0) return null;
				const q = pour(i);
				const x = lerp(it.x, column.x, q);
				const y = lerp(it.y, strips[i].top, q);
				const w = lerp(it.side, column.w, q);
				const h = lerp(it.side, strips[i].h, q);
				const landed = q >= 1;
				return (
					<g key={i} opacity={(q > 0 ? 1 : squareOpacity) * s}>
						<rect x={x} y={y} width={w} height={h} fill={`url(#${hatch.id})`} />
						{landed && <line x1={x} x2={x + w} y1={y} y2={y} stroke={color.ground} strokeWidth={1.5} />}
						<rect
							x={x}
							y={y}
							width={w}
							height={h}
							fill="none"
							stroke={landed ? alpha(ink, 0.7) : color[ink]}
							strokeWidth={landed ? stroke.hair : stroke.line}
							pathLength={q > 0 ? undefined : 1}
							strokeDasharray={q > 0 ? undefined : `${s} 1`}
						/>
					</g>
				);
			})}
		</svg>
	);
};
