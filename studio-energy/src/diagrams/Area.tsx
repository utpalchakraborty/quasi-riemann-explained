import React, {useId} from 'react';
import {alpha, color, hatch, Ink, stroke} from '../design/tokens';

// The energy grammar: energy is area. A number of size s is drawn as a square
// of side s; an energy is the total area of its squares; a budget is a frame
// (a bold outline) that the squares must fit inside. Area is shown by hatching,
// and density, never a new color, carries magnitude.
//
// Stroke weights, in order: a square's outline is `stroke.line`, a frame
// `stroke.bold`, and a budget line `stroke.budget` (see tokens).

export type Density = keyof Omit<typeof hatch, 'angle'>;

// One hatch pattern, unique to the SVG it sits in. Use the returned id as
// `fill={url(#id)}`.
export const useHatch = (ink: Ink, density: Density = 'medium', opacity = 0.7): {id: string; defs: React.ReactNode} => {
	const id = `h${useId().replace(/:/g, '')}`;
	const gap = hatch[density];
	return {
		id,
		defs: (
			<pattern id={id} width={gap} height={gap} patternUnits="userSpaceOnUse" patternTransform={`rotate(${hatch.angle})`}>
				<line x1={0} y1={0} x2={0} y2={gap} stroke={alpha(ink, opacity)} strokeWidth={stroke.hair} />
			</pattern>
		),
	};
};

type SquareProps = {
	x: number; // top-left
	y: number;
	side: number;
	ink?: Ink;
	fill?: string; // a hatch url, or a tint
	p?: number; // outline draw-on, 0..1
	fillP?: number; // fill opacity
	width?: number;
	dash?: string;
	opacity?: number;
};

// A square of side `side`: the picture of one number squared.
export const Square: React.FC<SquareProps> = ({x, y, side, ink = 'ink', fill, p = 1, fillP = 1, width = stroke.line, dash, opacity = 1}) => {
	if (side <= 0 || p <= 0 || opacity <= 0) return null;
	return (
		<g opacity={opacity}>
			{fill && <rect x={x} y={y} width={side} height={side} fill={fill} opacity={fillP * Math.min(1, p * 1.5)} />}
			<rect
				x={x}
				y={y}
				width={side}
				height={side}
				fill="none"
				stroke={color[ink]}
				strokeWidth={width}
				pathLength={dash ? undefined : 1}
				strokeDasharray={dash ?? `${p} 1`}
				opacity={dash ? p : 1}
			/>
		</g>
	);
};

type FrameProps = {
	x: number; // top-left
	y: number;
	w: number;
	h: number;
	ink?: Ink;
	p?: number;
	width?: number;
	dash?: string;
};

// A budget's boundary: everything it pays for must fit inside.
export const Frame: React.FC<FrameProps> = ({x, y, w, h, ink = 'ink', p = 1, width = stroke.bold, dash}) => {
	if (p <= 0 || w <= 0 || h <= 0) return null;
	return (
		<rect
			x={x}
			y={y}
			width={w}
			height={h}
			fill="none"
			stroke={color[ink]}
			strokeWidth={width}
			pathLength={dash ? undefined : 1}
			strokeDasharray={dash ?? `${p} 1`}
			opacity={dash ? p : 1}
		/>
	);
};

export type Placed = {x: number; y: number; side: number; i: number};

// Shelf packing: squares laid left to right in rows (a shelf is as tall as its
// first square), largest first unless `keepOrder`. Positions are relative to
// the frame's top-left corner. The packing is exact as a picture of areas:
// nothing overlaps, and gaps are only what shelves leave.
export const shelfPack = (sides: number[], width: number, gap = 0, keepOrder = false): {placed: Placed[]; height: number} => {
	const order = sides.map((s, i) => ({s, i}));
	if (!keepOrder) order.sort((a, b) => b.s - a.s);
	const placed: Placed[] = [];
	let x = 0;
	let y = 0;
	let shelf = 0;
	for (const {s, i} of order) {
		if (x > 0 && x + s > width) {
			x = 0;
			y += shelf + gap;
			shelf = 0;
		}
		placed.push({x, y, side: s, i});
		x += s + gap;
		shelf = Math.max(shelf, s);
	}
	return {placed, height: y + shelf};
};

// A strip of squares that tiles exactly: squares cut to strips of equal height,
// laid end to end, so total area reads as length. For comparing an energy with
// a budget along one line (the frame becomes a ruled bar of the same height).
export const areaLength = (sides: number[], height: number): number[] => sides.map((s) => (s * s) / height);

type ColumnProps = {
	x: number; // left edge
	y: number; // baseline (bottom of the frame)
	w: number; // column width
	areas: number[]; // the squares' areas, in the same units as `budget`
	budget: number; // the frame's area
	scale: number; // pixels² per unit of area
	filled?: number; // squares poured in so far (fractional)
	frameP?: number;
	ink?: (i: number) => Ink | null; // per-square ink, default ink
	density?: Density;
	gap?: number; // a ground-coloured gap between strips
};

// Squares poured into a budget: each area becomes a strip of the column's
// width and the same area, stacked from the baseline, under a frame whose area
// is the budget. Exact as a picture of areas (the strips' total height is the
// total energy over the width).
export const AreaColumn: React.FC<ColumnProps> = ({x, y, w, areas, budget, scale, filled = areas.length, frameP = 1, ink, density = 'medium', gap = 1.5}) => {
	const hatchInk = useHatch('ink', density, 0.8);
	const hatchCobalt = useHatch('cobalt', density, 0.9);
	const hatchVerm = useHatch('vermilion', density, 0.9);
	const hatchVir = useHatch('viridian', density, 0.9);
	const url: Record<string, string> = {ink: hatchInk.id, cobalt: hatchCobalt.id, vermilion: hatchVerm.id, viridian: hatchVir.id};
	const frameH = (budget * scale) / w;
	let base = y;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				{hatchInk.defs}
				{hatchCobalt.defs}
				{hatchVerm.defs}
				{hatchVir.defs}
			</defs>
			{areas.map((a, i) => {
				const part = Math.max(0, Math.min(1, filled - i));
				if (part <= 0) return null;
				const h = ((a * scale) / w) * part;
				base -= h;
				const k = ink?.(i) ?? 'ink';
				return (
					<g key={i}>
						<rect x={x} y={base} width={w} height={h} fill={`url(#${url[k] ?? hatchInk.id})`} />
						<line x1={x} x2={x + w} y1={base} y2={base} stroke={color.ground} strokeWidth={gap} />
						<rect x={x} y={base} width={w} height={h} fill="none" stroke={alpha(k, 0.7)} strokeWidth={stroke.hair} />
					</g>
				);
			})}
			<Frame x={x} y={y - frameH} w={w} h={frameH} p={frameP} />
		</svg>
	);
};
