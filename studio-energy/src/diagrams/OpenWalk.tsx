import React, {useId} from 'react';
import {exposeStyle} from '../design/motion';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, Ink, size, stroke} from '../design/tokens';
import {MixedLine} from './MixedLine';
import {WALKS} from './WalkPlot';

// The cold open's walks: the computed ±1 walks of WalkPlot (N1), on an axis
// that zooms out as wider walks arrive. A local variant of WalkPlot, which has
// a fixed scale: here `yMax` may animate, ticks fade in only while they fit,
// and the walks are clipped to the plot. Walk -1 is walk 0 in full; walk
// i >= 0 is sampled every 10 steps.

const pathOf = (index: number): {pts: number[]; every: number} =>
	index < 0 ? {pts: WALKS.first_path, every: 1} : {pts: WALKS.paths[index], every: 10};

export const walkEnd = (index: number): number => {
	const {pts} = pathOf(index);
	return pts[pts.length - 1];
};

// The first flips of walk 0, and its running totals, read off the computed path.
export const FLIPS = WALKS.first_path.slice(1).map((v, i) => v - WALKS.first_path[i]);
if (FLIPS.some((s) => s !== 1 && s !== -1) || FLIPS.length !== WALKS.steps) throw new Error('walk 0 must be 1000 steps of ±1');

type WalkSpec = {index: number; p: number; ink?: Ink; width?: number; opacity?: number};

type PlotProps = {
	x: number; // left edge
	y: number; // the zero line
	w: number;
	h: number; // half-height: the plot spans y - h .. y + h
	yMax: number; // walk value at the top edge (may animate)
	walks: WalkSpec[];
	ends?: {index: number; p: number; label?: number; ink?: Ink}[]; // a dot at a walk's end, and its value
	axes?: number;
	ticks?: number[];
};

export const ZoomWalkPlot: React.FC<PlotProps> = ({x, y, w, h, yMax, walks, ends = [], axes = 1, ticks = [-60, -40, -20, 20, 40, 60]}) => {
	const clip = `wc${useId().replace(/:/g, '')}`;
	const sx = (step: number) => x + (step / WALKS.steps) * w;
	const sy = (v: number) => y - (v / yMax) * h;
	const tickOp = (v: number) => Math.max(0, Math.min(1, (yMax * 0.95 - Math.abs(v)) / (yMax * 0.12)));
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>
					<clipPath id={clip}>
						<rect x={x - 4} y={y - h - 6} width={w + 14} height={2 * h + 12} />
					</clipPath>
				</defs>
				<g opacity={axes}>
					<line x1={x} x2={x + w} y1={y} y2={y} stroke={alpha('pencil', 0.75)} strokeWidth={stroke.hair} />
					<line x1={x} x2={x} y1={y - h} y2={y + h} stroke={alpha('pencil', 0.75)} strokeWidth={stroke.hair} />
					{ticks.map((v) => (
						<line key={v} x1={x} x2={x + w} y1={sy(v)} y2={sy(v)} stroke={alpha('pencil', 0.3)} strokeWidth={stroke.hair} strokeDasharray="3 7" opacity={tickOp(v)} />
					))}
				</g>
				<g clipPath={`url(#${clip})`}>
					{walks.map(({index, p, ink = 'ink', width = stroke.line, opacity = 1}) => {
						if (p <= 0) return null;
						const {pts, every} = pathOf(index);
						const n = Math.max(2, Math.round(pts.length * Math.min(1, p)));
						const d = pts
							.slice(0, n)
							.map((v, k) => `${k ? 'L' : 'M'}${sx(k * every).toFixed(1)} ${sy(v).toFixed(1)}`)
							.join('');
						return (
							<g key={index} opacity={opacity}>
								<path d={d} fill="none" stroke={color[ink]} strokeWidth={width} strokeLinejoin="round" />
								{p < 1 && <circle cx={sx((n - 1) * every)} cy={sy(pts[n - 1])} r={6} fill={color[ink]} />}
							</g>
						);
					})}
				</g>
				{ends.map(({index, p, ink = 'ink'}) => {
					if (p <= 0) return null;
					const v = walkEnd(index);
					return <circle key={index} cx={sx(WALKS.steps)} cy={sy(v)} r={7} fill={color[ink]} opacity={p} />;
				})}
			</svg>
			{ticks.map((v) => (
				<At key={v} x={x - 86} y={sy(v) - 20} w={70} style={{textAlign: 'right', opacity: axes * tickOp(v)}}>
					<Tex tex={`${v}`} px={size.small} ink="pencil" display={false} />
				</At>
			))}
			<At x={x - 86} y={y - 20} w={70} style={{textAlign: 'right', opacity: axes}}>
				<Tex tex="0" px={size.small} ink="pencil" display={false} />
			</At>
			<At x={x - 20} y={y + h + 8} w={40} style={{textAlign: 'center', opacity: axes}}>
				<Tex tex="0" px={size.small} ink="pencil" display={false} />
			</At>
			<At x={x + w - 160} y={y + h + 4} w={220} style={{textAlign: 'right', opacity: axes}}>
				<MixedLine px={size.small} parts={[{tex: `${WALKS.steps}`}, ' flips']} />
			</At>
			{ends.map(({index, label = 0, ink = 'ink'}) =>
				label > 0 ? (
					<At key={index} x={x + w + 20} y={sy(walkEnd(index)) - 26} w={120} style={{...exposeStyle(label)}}>
						<Tex tex={`${walkEnd(index)}`} px={size.mathInline} ink={ink} display={false} />
					</At>
				) : null,
			)}
		</>
	);
};

// The first flips of walk 0 as a ruled ledger: the step, the flip, and the
// running total, then a gap, then the last step. Each column inks in on cue.
type LedgerProps = {
	x: number;
	y: number; // top of the first row
	cell: number;
	count: number; // flips shown before the gap
	flips: number; // columns of flips revealed (fractional)
	totals: number; // columns of totals revealed (fractional)
	last: number; // the last column, 0..1
	rowH?: number;
	labelW?: number;
};

export const FlipLedger: React.FC<LedgerProps> = ({x, y, cell, count, flips, totals, last, rowH = 50, labelW = 230}) => {
	const colX = (i: number) => x + labelW + i * cell;
	const reveal = (n: number, i: number) => Math.max(0, Math.min(1, n - i));
	const rows = [
		{label: 'step', px: size.micro, ink: 'pencil' as Ink},
		{label: 'flip', px: size.label, ink: 'ink' as Ink},
		{label: 'running total', px: size.label, ink: 'ink' as Ink},
	];
	const lastX = colX(count + 1.4);
	const cellTex = (row: number, step: number) => (row === 0 ? `${step}` : row === 1 ? (FLIPS[step - 1] > 0 ? '+1' : '-1') : `${WALKS.first_path[step]}`);
	const width = labelW + (count + 2.6) * cell;
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				{rows.map((_, r) => {
					const p = Math.max(0, Math.min(1, r === 2 ? totals : flips));
					if (p <= 0) return null;
					return <line key={r} x1={x} x2={x + width * p} y1={y + (r + 1) * rowH - 6} y2={y + (r + 1) * rowH - 6} stroke={alpha('pencil', r === 0 ? 0.55 : 0.4)} strokeWidth={stroke.hair} />;
				})}
			</svg>
			{rows.map((row, r) => (
				<At key={row.label} x={x} y={y + r * rowH + (r === 0 ? 10 : 2)} w={labelW - 20} style={{opacity: Math.max(0, Math.min(1, r === 2 ? totals : flips))}}>
					<MixedLine px={size.small} parts={[row.label]} />
				</At>
			))}
			{rows.map((row, r) =>
				Array.from({length: count}, (_, i) => {
					const p = reveal(r === 2 ? totals : flips, i);
					if (p <= 0) return null;
					return (
						<At key={`${r}-${i}`} x={colX(i)} y={y + r * rowH + (r === 0 ? 10 : 0)} w={cell} style={{textAlign: 'center', ...exposeStyle(p)}}>
							<Tex tex={cellTex(r, i + 1)} px={row.px} ink={row.ink} display={false} />
						</At>
					);
				}),
			)}
			{rows.map((row, r) => (
				<React.Fragment key={`gap${r}`}>
					<At x={colX(count)} y={y + r * rowH + (r === 0 ? 10 : 0)} w={cell} style={{textAlign: 'center', opacity: last}}>
						<Tex tex="\cdots" px={row.px} ink="pencil" display={false} />
					</At>
					<At x={lastX} y={y + r * rowH + (r === 0 ? 10 : 0)} w={cell * 1.4} style={{textAlign: 'center', ...exposeStyle(last)}}>
						<Tex tex={cellTex(r, WALKS.steps)} px={row.px} ink={row.ink} display={false} />
					</At>
				</React.Fragment>
			))}
		</>
	);
};
