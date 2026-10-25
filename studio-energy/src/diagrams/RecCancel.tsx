import React from 'react';
import {color, Ink, stroke} from '../design/tokens';

// Why the cube terms cannot be dropped. P_h(X) and the cube terms drawn as
// vectors in the complex plane, head to tail: their sum T_h(X) is short, so
// a bound for T_h says nothing about P_h alone, because the cube terms can
// cancel it. Schematic: the vectors are illustrative, not computed sums.

export const CANCEL_P: [number, number] = [5, 1.8];
export const CANCEL_CUBES: [number, number][] = [
	[-0.7, -1.1],
	[-1.0, -0.7],
	[-1.1, -0.45],
	[-1.0, -0.2],
	[-0.65, 0.1],
];
// where the chain ends: T_h = P_h + the cube terms
export const CANCEL_T: [number, number] = CANCEL_CUBES.reduce<[number, number]>((s, c) => [s[0] + c[0], s[1] + c[1]], [...CANCEL_P]);

const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; ink: Ink; width?: number; dash?: string; head?: number}> = ({x1, y1, x2, y2, ink, width = stroke.line, dash, head = 12}) => {
	const len = Math.hypot(x2 - x1, y2 - y1);
	if (len < 1) return null;
	const ux = (x2 - x1) / len;
	const uy = (y2 - y1) / len;
	const h = Math.min(head, len * 0.6);
	return (
		<g>
			<line x1={x1} y1={y1} x2={x2 - ux * h * 0.4} y2={y2 - uy * h * 0.4} stroke={color[ink]} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" />
			<path d={`M${x2 - ux * h - uy * h * 0.55},${y2 - uy * h + ux * h * 0.55} L${x2},${y2} L${x2 - ux * h + uy * h * 0.55},${y2 - uy * h - ux * h * 0.55}Z`} fill={color[ink]} />
		</g>
	);
};

type Props = {
	x: number; // the origin
	y: number;
	unit: number; // px per unit
	p?: number; // P_h drawn
	cubes?: number; // the cube terms, one after another (0..1)
	result?: number; // T_h, the short sum
};

export const RecCancel: React.FC<Props> = ({x, y, unit, p = 1, cubes = 0, result = 0}) => {
	const at = ([a, b]: [number, number]): [number, number] => [x + a * unit, y - b * unit];
	const [px, py] = at(CANCEL_P);
	let cur: [number, number] = [...CANCEL_P];
	const shown = cubes * CANCEL_CUBES.length;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<circle cx={x} cy={y} r={5} fill={color.pencil} opacity={p} />
			{p > 0 && <Arrow x1={x} y1={y} x2={x + (px - x) * p} y2={y + (py - y) * p} ink="ink" width={stroke.bold} head={16} />}
			{CANCEL_CUBES.map((c, i) => {
				const part = Math.max(0, Math.min(1, shown - i));
				const from = at(cur);
				cur = [cur[0] + c[0], cur[1] + c[1]];
				if (part <= 0) return null;
				const to = at(cur);
				return <Arrow key={i} x1={from[0]} y1={from[1]} x2={from[0] + (to[0] - from[0]) * part} y2={from[1] + (to[1] - from[1]) * part} ink="vermilion" />;
			})}
			{result > 0 && (
				<g opacity={result}>
					<Arrow x1={x} y1={y} x2={at(CANCEL_T)[0]} y2={at(CANCEL_T)[1]} ink="ink" width={stroke.bold} dash="5 5" head={14} />
				</g>
			)}
		</svg>
	);
};
