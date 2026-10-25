import React from 'react';
import {alpha, color, Ink, stroke} from '../design/tokens';

// A family laid out as a table, in the paper's words (October manuscript,
// §2.2): each row is one member, each column one term. A cell shows the phase
// of its entry as a needle from the cell's centre (angle in radians, 0 = the
// value 1, counter-clockwise); an entry 0 is a small hollow ring. The caller
// decides what the phases are and says whether they are computed.

export type Cell = {angle: number | null; ink?: Ink; p?: number; len?: number};

type Mark = {i: number; ink: Ink; p: number};

type Props = {
	x: number; // top-left
	y: number;
	cell: number;
	rows: number;
	cols: number;
	at: (r: number, c: number) => Cell;
	grid?: number; // rule opacity, 0..1
	gridRows?: number; // rows the rules cover (default all)
	colMarks?: Mark[]; // outlines round whole columns
	rowMarks?: Mark[]; // outlines round whole rows
	band?: {r: number; p: number}; // a pencil tint over one row, for a sweep
};

export const FamilyTable: React.FC<Props> = ({x, y, cell, rows, cols, at, grid = 1, gridRows = rows, colMarks = [], rowMarks = [], band}) => {
	const w = cols * cell;
	const h = gridRows * cell;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			{band && band.p > 0 && <rect x={x} y={y + band.r * cell} width={w} height={cell} fill={alpha('pencil', 0.12 * band.p)} />}
			<g opacity={grid}>
				{Array.from({length: gridRows + 1}, (_, i) => (
					<line key={`r${i}`} x1={x} x2={x + w} y1={y + i * cell} y2={y + i * cell} stroke={alpha('pencil', i === 0 || i === gridRows ? 0.7 : 0.3)} strokeWidth={stroke.hair} />
				))}
				{Array.from({length: cols + 1}, (_, j) => (
					<line key={`c${j}`} x1={x + j * cell} x2={x + j * cell} y1={y} y2={y + h} stroke={alpha('pencil', j === 0 || j === cols ? 0.7 : 0.3)} strokeWidth={stroke.hair} />
				))}
			</g>
			{Array.from({length: rows * cols}, (_, k) => {
				const r = Math.floor(k / cols);
				const c = k % cols;
				const {angle, ink = 'viridian', p = 1, len = 1} = at(r, c);
				if (p <= 0) return null;
				const cx = x + c * cell + cell / 2;
				const cy = y + r * cell + cell / 2;
				if (angle === null) return <circle key={k} cx={cx} cy={cy} r={cell * 0.1} fill={color.ground} stroke={color[ink]} strokeWidth={stroke.line} opacity={p} />;
				const L = cell * 0.34 * len;
				return (
					<line
						key={k}
						x1={cx}
						y1={cy}
						x2={cx + L * Math.cos(angle)}
						y2={cy - L * Math.sin(angle)}
						stroke={color[ink]}
						strokeWidth={stroke.line}
						strokeLinecap="round"
						opacity={p}
					/>
				);
			})}
			{colMarks.map(({i, ink, p}) => (
				<rect key={`cm${i}`} x={x + i * cell} y={y} width={cell} height={h} fill="none" stroke={color[ink]} strokeWidth={stroke.line} opacity={p} />
			))}
			{rowMarks.map(({i, ink, p}) => (
				<rect key={`rm${i}`} x={x} y={y + i * cell} width={w} height={cell} fill="none" stroke={color[ink]} strokeWidth={stroke.line} opacity={p} />
			))}
		</svg>
	);
};

// A walk of unit steps: the partial sums of a list of phases (null steps are
// zeros and add nothing). Drawn from (x, y), `step` pixels per unit, the first
// `shown` steps (fractional while it draws).
export const PhaseWalk: React.FC<{x: number; y: number; step: number; angles: (number | null)[]; shown: number; ink?: Ink; p?: number}> = ({
	x,
	y,
	step,
	angles,
	shown,
	ink = 'viridian',
	p = 1,
}) => {
	let px = x;
	let py = y;
	const segs: React.ReactNode[] = [];
	angles.forEach((a, i) => {
		const part = Math.max(0, Math.min(1, shown - i));
		if (part <= 0 || a === null) return;
		const nx = px + step * part * Math.cos(a);
		const ny = py - step * part * Math.sin(a);
		segs.push(<line key={i} x1={px} y1={py} x2={nx} y2={ny} stroke={color[ink]} strokeWidth={stroke.line} strokeLinecap="round" />);
		segs.push(<circle key={`d${i}`} cx={nx} cy={ny} r={2.5} fill={color[ink]} />);
		px = nx;
		py = ny;
	});
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: p}}>
			<circle cx={x} cy={y} r={5} fill={color.ink} />
			{segs}
		</svg>
	);
};

// Where a walk ends, for labels: the full sum of the phases.
export const walkEnd = (x: number, y: number, step: number, angles: (number | null)[]): [number, number] =>
	angles.reduce<[number, number]>(([px, py], a) => (a === null ? [px, py] : [px + step * Math.cos(a), py - step * Math.sin(a)]), [x, y]);
