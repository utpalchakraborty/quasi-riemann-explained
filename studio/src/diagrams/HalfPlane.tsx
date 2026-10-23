import React from 'react';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, Ink, size, stroke} from '../design/tokens';

// A close view of the s-plane near the right edge of the critical strip, for
// the Mellin argument: half-planes Re s > sigma hatched by what holds there,
// a bracket for where an identity is known, and a supposed zero.

export type HalfPlaneProps = {
	id: string;
	x: number;
	y: number;
	w: number;
	h: number;
	sigma: [number, number];
	p?: number;
	lines?: {sigma: number; ink: Ink; p: number; dash?: string}[];
	hatches?: {from: number; ink: Ink; p: number}[];
	ticks?: {sigma: number; tex: string; ink?: Ink; p?: number}[];
	zero?: {sigma: number; y: number; p: number; gone?: number}; // y as a fraction of the height, from the top
	bracket?: {from: number; p: number; y: number}; // y in pixels above the map
};

export const HalfPlane: React.FC<HalfPlaneProps> = ({id, x, y, w, h, sigma, p = 1, lines = [], hatches = [], ticks: allTicks = [], zero, bracket}) => {
	const ticks = allTicks.filter((tk) => tk.sigma >= sigma[0] && tk.sigma <= sigma[1]);
	const sx = (s: number) => ((s - sigma[0]) / (sigma[1] - sigma[0])) * w;
	const s0 = Math.max(0, sigma[0]);
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
			<svg width={w} height={h} style={{position: 'absolute', overflow: 'visible'}}>
				<defs>
					{(['gilt', 'mist', 'paper'] as Ink[]).map((k) => (
						<pattern key={k} id={`hp-${k}-${id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform={`rotate(${k === 'mist' ? -45 : 45})`}>
							<line x1="0" y1="0" x2="0" y2="14" stroke={color[k]} strokeWidth="2" />
						</pattern>
					))}
					<clipPath id={`hp-clip-${id}`}>
						<rect x={0} y={0} width={w} height={h} />
					</clipPath>
				</defs>
				<g clipPath={`url(#hp-clip-${id})`} opacity={p}>
					<rect x={sx(s0)} y={0} width={sx(1) - sx(s0)} height={h} fill={alpha('fieldLift', 0.55)} />
					{hatches.map((hh, i) => (
						<rect key={i} x={sx(hh.from)} y={0} width={Math.max(0, w - sx(hh.from))} height={h} fill={`url(#hp-${hh.ink}-${id})`} opacity={0.3 * hh.p} />
					))}
					{sigma[0] < 0.5 && <line x1={sx(0.5)} x2={sx(0.5)} y1={0} y2={h} stroke={color.mist} strokeWidth={stroke.hair} strokeDasharray="6 10" />}
					<line x1={sx(1)} x2={sx(1)} y1={0} y2={h} stroke={alpha('mist', 0.6)} strokeWidth={stroke.hair} />
					{lines.map((l, i) => (
						<line
							key={i}
							x1={sx(l.sigma)}
							x2={sx(l.sigma)}
							y1={h}
							y2={h * (1 - l.p)}
							stroke={color[l.ink]}
							strokeWidth={stroke.frontier}
							strokeDasharray={l.dash}
							strokeLinecap="round"
							style={{filter: `drop-shadow(0 0 10px ${alpha(l.ink, 0.6)})`}}
						/>
					))}
				</g>
				<g opacity={p}>
					<line x1={0} x2={w} y1={h} y2={h} stroke={color.mist} strokeWidth={stroke.line} />
					{ticks.map((tk) => (
						<line key={tk.sigma} x1={sx(tk.sigma)} x2={sx(tk.sigma)} y1={h} y2={h + 12} stroke={color.mist} strokeWidth={stroke.line} opacity={tk.p ?? 1} />
					))}
				</g>
				{bracket && bracket.p > 0 && (
					<g opacity={bracket.p}>
						<line x1={sx(bracket.from)} x2={w} y1={-bracket.y} y2={-bracket.y} stroke={color.paper} strokeWidth={stroke.line} />
						<line x1={sx(bracket.from)} x2={sx(bracket.from)} y1={-bracket.y - 10} y2={-bracket.y + 10} stroke={color.paper} strokeWidth={stroke.line} />
						<path d={`M${w - 14},${-bracket.y - 8} L${w},${-bracket.y} L${w - 14},${-bracket.y + 8}`} fill="none" stroke={color.paper} strokeWidth={stroke.line} />
					</g>
				)}
				{zero && zero.p > 0 && (
					<g>
						<g opacity={zero.p * (1 - (zero.gone ?? 0))}>
							<circle cx={sx(zero.sigma)} cy={h * zero.y} r={24} fill={alpha('ember', 0.18)} stroke={color.ember} strokeWidth={stroke.line} />
							<circle cx={sx(zero.sigma)} cy={h * zero.y} r={9} fill={color.ember} />
						</g>
						{(zero.gone ?? 0) > 0 && (
							<circle
								cx={sx(zero.sigma)}
								cy={h * zero.y}
								r={24 + 70 * (zero.gone ?? 0)}
								fill="none"
								stroke={color.ember}
								strokeWidth={stroke.line}
								opacity={1 - (zero.gone ?? 0)}
							/>
						)}
					</g>
				)}
			</svg>
			{ticks.map((tk) => (
				<div key={tk.sigma} style={{position: 'absolute', left: sx(tk.sigma), top: h + 18, transform: 'translateX(-50%)', opacity: (tk.p ?? 1) * p}}>
					<Tex tex={tk.tex} px={size.label} ink={tk.ink ?? 'mist'} display={false} />
				</div>
			))}
			<At x={w + 18} y={h - size.label * 0.8} style={{opacity: p}}>
				<Tex tex={'\\sigma'} px={size.label} ink="mist" display={false} />
			</At>
		</div>
	);
};

export const planeX = (x: number, w: number, sigma: [number, number], s: number) => x + ((s - sigma[0]) / (sigma[1] - sigma[0])) * w;
