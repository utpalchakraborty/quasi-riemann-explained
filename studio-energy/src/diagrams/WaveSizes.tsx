import React from 'react';
import {Tex} from '../design/Tex';
import {alpha, color, Ink, size, stroke} from '../design/tokens';

// Sizes against x on log–log axes, where every power x^a is a straight line
// of slope a. Schematic: constants and logarithms are left out.

export type Wave = {
	exp: number; // the power of x
	shift?: number; // decades below x^exp (division by phi(q))
	ink: Ink;
	p: number;
	dash?: string;
	width?: number;
	label?: string; // TeX, at the right end
};

type Props = {
	x: number;
	y: number;
	w: number;
	h: number;
	decades: number;
	axes: number;
	waves: Wave[];
	band?: {lo: number; hi: number; p: number}; // shaded between two powers
	deficit?: {main: number; shift: number; bound: number; p: number}; // where the main term falls below the bound
	id: string;
};

// End labels keep at least LABEL_GAP between them, pushed apart downward.
const LABEL_GAP = 36;
const spread = <T extends {top: number}>(items: T[]): T[] => {
	const sorted = [...items].sort((a, b) => a.top - b.top);
	for (let i = 1; i < sorted.length; i++) sorted[i] = {...sorted[i], top: Math.max(sorted[i].top, sorted[i - 1].top + LABEL_GAP)};
	return sorted;
};

export const WaveSizes: React.FC<Props> = ({x, y, w, h, decades, axes, waves, band, deficit, id}) => {
	const sx = (d: number) => x + (d / decades) * w;
	const sy = (d: number) => y + h - (d / decades) * h;
	const line = (a: number, s: number) => `M${sx(0)},${sy(-s)}L${sx(decades)},${sy(a * decades - s)}`;
	const cross = deficit ? Math.min(decades, deficit.shift / (deficit.main - deficit.bound)) : 0;
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>
					<clipPath id={`waves-${id}`}>
						<rect x={x} y={y - 20} width={w + 2} height={h + 20} />
					</clipPath>
				</defs>
				<g opacity={axes}>
					<line x1={x} x2={x + w} y1={y + h} y2={y + h} stroke={color.pencil} strokeWidth={stroke.line} />
					<line x1={x} x2={x} y1={y} y2={y + h} stroke={color.pencil} strokeWidth={stroke.line} />
					{[0, decades / 2, decades].map((d) => (
						<g key={d}>
							<line x1={sx(d)} x2={sx(d)} y1={y + h} y2={y + h + 10} stroke={color.pencil} strokeWidth={stroke.line} />
							<line x1={x - 10} x2={x} y1={sy(d)} y2={sy(d)} stroke={color.pencil} strokeWidth={stroke.line} />
						</g>
					))}
				</g>
				<g clipPath={`url(#waves-${id})`}>
					{band && band.p > 0 && (
						<path
							d={`M${sx(0)},${sy(0)}L${sx(decades)},${sy(band.hi * decades)}L${sx(decades)},${sy(band.lo * decades)}Z`}
							fill={alpha('pencil', 0.12 * band.p)}
						/>
					)}
					{deficit && deficit.p > 0 && cross > 0 && (
						<path
							d={`M${sx(0)},${sy(0)}L${sx(cross)},${sy(deficit.bound * cross)}L${sx(cross)},${sy(deficit.main * cross - deficit.shift)}L${sx(0)},${sy(-deficit.shift)}Z`}
							fill={alpha('vermilion', 0.32 * deficit.p)}
						/>
					)}
					{waves.map((v, i) =>
						v.p > 0 ? (
							<path
								key={i}
								d={line(v.exp, v.shift ?? 0)}
								fill="none"
								stroke={color[v.ink]}
								strokeWidth={v.width ?? stroke.bold}
								strokeDasharray={v.dash ?? `${v.p * 2000} 2000`}
								opacity={v.dash ? v.p : 1}
							/>
						) : null,
					)}
				</g>
			</svg>
			{spread(
				waves.filter((v) => v.label && v.p > 0).map((v) => ({v, top: sy(v.exp * decades - (v.shift ?? 0)) - 22})),
			).map(({v, top}) => (
				<div key={v.label} style={{position: 'absolute', left: sx(decades) + 12, top, opacity: v.p, whiteSpace: 'nowrap'}}>
					<Tex tex={v.label!} px={size.label} ink={v.ink} display={false} />
				</div>
			))}
			{[0, decades / 2, decades].map((d) => (
				<div key={d} style={{position: 'absolute', left: sx(d) - 40, top: y + h + 14, width: 80, textAlign: 'center', opacity: axes}}>
					<Tex tex={`10^{${d}}`} px={size.small} ink="pencil" display={false} />
				</div>
			))}
			<div style={{position: 'absolute', left: x + w + 14, top: y + h - 18, opacity: axes}}>
				<Tex tex={'x'} px={size.label} ink="pencil" display={false} />
			</div>
		</>
	);
};
