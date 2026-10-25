import React from 'react';
import numerics from '../data/numerics.json';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, Ink, size, stroke} from '../design/tokens';

// Random ±1 walks, computed (scripts/compute_data.py, N1): 4000 seeded walks of
// 1000 steps. `paths` keeps 24 of them sampled every 10 steps for drawing;
// `first_path` is walk 0 in full; `final` the end of every walk;
// `running_mean_sq` the mean of the squared ends over the first k walks.

type WalkData = {
	steps: number;
	walks: number;
	seed: number;
	final: number[];
	running_mean_sq: number[];
	mean_sq: number;
	paths: number[][];
	first_path: number[];
};

export const WALKS = numerics.walks as unknown as WalkData;

// The narration names the first three ends and the settled mean.
if (WALKS.final[0] !== 4 || WALKS.final[1] !== 20 || WALKS.final[2] !== -32) throw new Error('walk ends changed: update open-1');
if (WALKS.walks !== 4000 || Math.abs(WALKS.mean_sq - 1000) > 30) throw new Error('mean of squares no longer near 1000: update open-2');

type PlotProps = {
	x: number; // left edge of the plot
	y: number; // the zero line
	w: number;
	h: number; // half-height: the plot spans y - h .. y + h
	yMax?: number; // walk value at the top edge
	walks: {index: number; p: number; ink?: Ink; width?: number; opacity?: number}[]; // index -1 = first_path in full
	axes?: number;
	end?: {index: number; p: number}; // mark a walk's end with its value
};

const pathOf = (index: number): {pts: number[]; every: number} =>
	index < 0 ? {pts: WALKS.first_path, every: 1} : {pts: WALKS.paths[index], every: 10};

export const WalkPlot: React.FC<PlotProps> = ({x, y, w, h, yMax = 100, walks, axes = 1, end}) => {
	const sx = (step: number) => x + (step / WALKS.steps) * w;
	const sy = (v: number) => y - (v / yMax) * h;
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={axes}>
					<line x1={x} x2={x + w} y1={y} y2={y} stroke={alpha('pencil', 0.7)} strokeWidth={stroke.hair} />
					<line x1={x} x2={x} y1={y - h} y2={y + h} stroke={alpha('pencil', 0.7)} strokeWidth={stroke.hair} />
					{[-yMax / 2, yMax / 2].map((v) => (
						<line key={v} x1={x} x2={x + w} y1={sy(v)} y2={sy(v)} stroke={alpha('pencil', 0.2)} strokeWidth={stroke.hair} strokeDasharray="3 7" />
					))}
				</g>
				{walks.map(({index, p, ink = 'ink', width = stroke.line, opacity = 1}) => {
					if (p <= 0) return null;
					const {pts, every} = pathOf(index);
					const n = Math.max(2, Math.round(pts.length * p));
					const d = pts
						.slice(0, n)
						.map((v, k) => `${k ? 'L' : 'M'}${sx(k * every).toFixed(1)} ${sy(v).toFixed(1)}`)
						.join('');
					return <path key={index} d={d} fill="none" stroke={color[ink]} strokeWidth={width} strokeLinejoin="round" opacity={opacity} />;
				})}
				{end && end.p > 0 && (() => {
					const {pts, every} = pathOf(end.index);
					const v = pts[pts.length - 1];
					return <circle cx={sx((pts.length - 1) * every)} cy={sy(v)} r={7} fill={color.ink} opacity={end.p} />;
				})()}
			</svg>
			<At x={x - 70} y={sy(yMax / 2) - 20} w={60} style={{textAlign: 'right', opacity: axes}}>
				<Tex tex={`${yMax / 2}`} px={size.small} ink="pencil" display={false} />
			</At>
			<At x={x - 70} y={sy(-yMax / 2) - 20} w={60} style={{textAlign: 'right', opacity: axes}}>
				<Tex tex={`-${yMax / 2}`} px={size.small} ink="pencil" display={false} />
			</At>
			<At x={x - 70} y={y - 20} w={60} style={{textAlign: 'right', opacity: axes}}>
				<Tex tex="0" px={size.small} ink="pencil" display={false} />
			</At>
			<At x={x + w - 100} y={y + h + 8} w={200} style={{textAlign: 'center', opacity: axes}}>
				<Tex tex={`${WALKS.steps}`} px={size.small} ink="pencil" display={false} />
			</At>
		</>
	);
};
