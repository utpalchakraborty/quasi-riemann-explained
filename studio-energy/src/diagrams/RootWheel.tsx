import React from 'react';
import {alpha, color, Ink, stroke} from '../design/tokens';

// A variant of PhaseWheel for figures where the values themselves move:
// powers of a root sweeping round, a pointer that shrinks to zero, or all six
// roots carried to their cubes. Angles are in sixths of a turn (0 = the root 1).

export type WheelDot = {angle: number; ink: Ink; r?: number; opacity?: number; tail?: number};

type Props = {
	cx: number;
	cy: number;
	r: number;
	p?: number;
	roots?: number; // opacity of the six fixed root markers
	lit?: number[]; // fixed roots to fill
	pointer?: {angle: number; len: number; opacity?: number};
	trail?: {from: number; to: number; opacity: number}; // arc swept by the pointer
	dots?: WheelDot[];
	center?: {ink: Ink; p: number}; // a dot at 0, for the value zero
};

const th = (k: number) => (k * Math.PI) / 3;

const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
	const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) * 16));
	return Array.from({length: n + 1}, (_, i) => {
		const a = th(a0 + ((a1 - a0) * i) / n);
		return `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(1)},${(cy - r * Math.sin(a)).toFixed(1)}`;
	}).join('');
};

export const RootWheel: React.FC<Props> = ({cx, cy, r, p = 1, roots = 1, lit = [], pointer, trail, dots = [], center}) => (
	<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: p}}>
		<circle cx={cx} cy={cy} r={r} fill="none" stroke={alpha('pencil', 0.5)} strokeWidth={stroke.hair} />
		<line x1={cx - r - 24} x2={cx + r + 24} y1={cy} y2={cy} stroke={alpha('pencil', 0.25)} strokeWidth={stroke.hair} />
		<line x1={cx} x2={cx} y1={cy - r - 24} y2={cy + r + 24} stroke={alpha('pencil', 0.25)} strokeWidth={stroke.hair} />
		{trail && trail.opacity > 0 && Math.abs(trail.to - trail.from) > 0.01 && (
			<path d={arc(cx, cy, r * 0.62, trail.from, trail.to)} fill="none" stroke={color.viridian} strokeWidth={stroke.line} opacity={trail.opacity} strokeLinecap="round" />
		)}
		{Array.from({length: 6}, (_, k) => (
			<circle
				key={k}
				cx={cx + r * Math.cos(th(k))}
				cy={cy - r * Math.sin(th(k))}
				r={r > 200 ? 13 : 10}
				fill={lit.includes(k) ? color.viridian : color.ground}
				stroke={color.viridian}
				strokeWidth={stroke.line}
				opacity={roots}
			/>
		))}
		{dots.map((d, i) => (
			<g key={i} opacity={d.opacity ?? 1}>
				{(d.tail ?? 0) > 0.02 && (
					<path d={arc(cx, cy, r, d.angle - (d.tail ?? 0), d.angle)} fill="none" stroke={color[d.ink]} strokeWidth={stroke.bold} opacity={0.35} strokeLinecap="round" />
				)}
				<circle cx={cx + r * Math.cos(th(d.angle))} cy={cy - r * Math.sin(th(d.angle))} r={d.r ?? 12} fill={color[d.ink]} />
			</g>
		))}
		{pointer && (
			<g opacity={pointer.opacity ?? 1}>
				<line
					x1={cx}
					y1={cy}
					x2={cx + (r - 16) * pointer.len * Math.cos(th(pointer.angle))}
					y2={cy - (r - 16) * pointer.len * Math.sin(th(pointer.angle))}
					stroke={color.ink}
					strokeWidth={stroke.bold}
					strokeLinecap="round"
				/>
				<circle cx={cx} cy={cy} r={6} fill={color.ink} />
			</g>
		)}
		{center && center.p > 0 && (
			<g opacity={center.p}>
				<circle cx={cx} cy={cy} r={22} fill="none" stroke={color[center.ink]} strokeWidth={stroke.line} />
				<circle cx={cx} cy={cy} r={9} fill={color[center.ink]} />
			</g>
		)}
	</svg>
);
