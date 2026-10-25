import React from 'react';
import {alpha, color, Ink, stroke} from '../design/tokens';

// A mean square drawn as a rectangle: its height is the row range (H), its
// width the column scale (X). Schematic: sizes show relations, not values.
// Each rectangle is anchored at its bottom-left corner, so similar rectangles
// share a diagonal through the anchor.

export type EnergyRectProps = {
	x: number; // bottom-left corner
	y: number;
	w: number;
	h: number;
	ink?: Ink;
	p?: number; // outline draw-on
	rows?: number; // faint row lines, one per row band
	fill?: number; // tint opacity, 0..1
	dash?: string;
	width?: number;
	opacity?: number;
};

export const EnergyRect: React.FC<EnergyRectProps> = ({x, y, w, h, ink = 'ink', p = 1, rows = 0, fill = 0, dash, width = stroke.line, opacity = 1}) => {
	if (p <= 0 || opacity <= 0 || w <= 0 || h <= 0) return null;
	const top = y - h;
	return (
		<g opacity={opacity}>
			{fill > 0 && <rect x={x} y={top} width={w} height={h} fill={alpha(ink, 0.09 * fill * p)} />}
			{Array.from({length: Math.max(0, rows - 1)}, (_, i) => {
				const yy = top + ((i + 1) * h) / rows;
				return <line key={i} x1={x} x2={x + w * p} y1={yy} y2={yy} stroke={alpha('pencil', 0.2)} strokeWidth={stroke.hair} />;
			})}
			<rect
				x={x}
				y={top}
				width={w}
				height={h}
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

// A measurement bracket: a line with end ticks, drawn on from its start.
export const Bracket: React.FC<{x1: number; y1: number; x2: number; y2: number; ink?: Ink; p?: number; tick?: number}> = ({
	x1,
	y1,
	x2,
	y2,
	ink = 'pencil',
	p = 1,
	tick = 9,
}) => {
	if (p <= 0) return null;
	const len = Math.hypot(x2 - x1, y2 - y1) || 1;
	const [nx, ny] = [-(y2 - y1) / len, (x2 - x1) / len];
	const ex = x1 + (x2 - x1) * p;
	const ey = y1 + (y2 - y1) * p;
	const t = (cx: number, cy: number) => (
		<line x1={cx - nx * tick} y1={cy - ny * tick} x2={cx + nx * tick} y2={cy + ny * tick} stroke={color[ink]} strokeWidth={stroke.line} />
	);
	return (
		<g opacity={Math.min(1, p * 3)}>
			<line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color[ink]} strokeWidth={stroke.line} />
			{t(x1, y1)}
			{t(ex, ey)}
		</g>
	);
};

// Fades the stretchy braces inside \htmlClass{name}{\underbrace{..}_{..}}
// without fading what they enclose. Class names are global: prefix them.
export const BraceFade: React.FC<{show: Record<string, number>}> = ({show}) => (
	<style>{Object.entries(show)
		.map(([cls, p]) => `.${cls} .katex-stretchy{opacity:${Math.max(0, Math.min(1, p)).toFixed(3)}}`)
		.join('\n')}</style>
);
