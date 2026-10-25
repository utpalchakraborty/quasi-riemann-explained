import React, {useMemo} from 'react';
import {alpha, color, stroke} from '../design/tokens';
import {eisPoint} from './Lattice';
import {latticePoints} from './LatticeField';

// Poisson summation in the row variable, as a change of viewpoint. Left: the
// rows u, a large disk of lattice points (N(u) <= H). Right: the dual rows h,
// a small disk (N(h) << D^2/H). A frequency h is a plane wave across the u
// disk. Schematic: the radii show "long" and "short", not true proportions.

type Disk = {cx: number; cy: number; unit: number; radius: number};

type Props = {
	left: Disk;
	right: Disk;
	leftP?: number;
	rightP?: number;
	wave?: {h: [number, number]; p: number} | null; // a dual point a + b·omega, as [a, b]
	litH?: [number, number] | null; // [a, b]
	collapse?: number; // the long sum folding into the short one
	arrow?: number;
};

const KAPPA = 0.075; // cycles per lattice step, per unit of h

export const PoissonDisks: React.FC<Props> = ({left, right, leftP = 1, rightP = 0, wave = null, litH = null, collapse = 0, arrow = 0}) => {
	const us = useMemo(() => latticePoints(left.radius).filter((p) => p.N > 0), [left.radius]);
	const hs = useMemo(() => latticePoints(right.radius).filter((p) => p.N > 0), [right.radius]);
	const hxy = wave ? eisPoint(wave.h[0], wave.h[1]) : [0, 0];
	const k = [hxy[0] * KAPPA, hxy[1] * KAPPA];
	const kk = Math.hypot(k[0], k[1]);
	const shrink = right.radius / left.radius;
	// wavefronts k·x = n, clipped to the left disk
	const fronts: number[] = [];
	if (wave && kk > 0) {
		const nMax = Math.ceil(left.radius * kk) + 1;
		for (let n = -nMax; n <= nMax; n++) fronts.push(n);
	}
	const L = left.radius * 1.2;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				<clipPath id="poisson-left">
					<circle cx={left.cx} cy={left.cy} r={left.unit * (left.radius + 0.6)} />
				</clipPath>
			</defs>
			<g opacity={leftP * (1 - 0.6 * collapse)}>
				<circle cx={left.cx} cy={left.cy} r={left.unit * (left.radius + 0.6)} fill="none" stroke={alpha('pencil', 0.35)} strokeWidth={stroke.hair} />
			</g>
			{wave && wave.p > 0 && (
				<g clipPath="url(#poisson-left)" opacity={wave.p * (1 - collapse)}>
					{fronts.map((n) => {
						// points with k·x = n: base point n·k/|k|^2, direction perpendicular to k
						const bx = (n * k[0]) / (kk * kk);
						const by = (n * k[1]) / (kk * kk);
						const dx = -k[1] / kk;
						const dy = k[0] / kk;
						return (
							<line
								key={n}
								x1={left.cx + left.unit * (bx - dx * L)}
								y1={left.cy - left.unit * (by - dy * L)}
								x2={left.cx + left.unit * (bx + dx * L)}
								y2={left.cy - left.unit * (by + dy * L)}
								stroke={alpha('viridian', 0.45)}
								strokeWidth={stroke.line}
							/>
						);
					})}
				</g>
			)}
			{collapse > 0 &&
				us.map((u) => (
					<circle key={`g${u.a},${u.b}`} cx={left.cx + left.unit * u.x} cy={left.cy - left.unit * u.y} r={2.5} fill={color.pencil} opacity={0.35 * collapse} />
				))}
			{us.map((u) => {
				const b = wave && wave.p > 0 ? 0.5 + 0.5 * Math.cos(2 * Math.PI * (k[0] * u.x + k[1] * u.y)) : 1;
				const mix = wave ? wave.p : 0;
				const bright = 1 - mix + mix * b;
				const x0 = left.cx + left.unit * u.x;
				const y0 = left.cy - left.unit * u.y;
				const x1 = right.cx + right.unit * u.x * shrink;
				const y1 = right.cy - right.unit * u.y * shrink;
				const t = collapse;
				return (
					<circle
						key={`u${u.a},${u.b}`}
						cx={x0 + (x1 - x0) * t}
						cy={y0 + (y1 - y0) * t}
						r={2.5 + 2.5 * bright}
						fill={color.ink}
						opacity={leftP * (0.25 + 0.75 * bright) * (1 - t * t)}
					/>
				);
			})}
			<g opacity={rightP}>
				<circle cx={right.cx} cy={right.cy} r={right.unit * (right.radius + 0.6)} fill="none" stroke={alpha('pencil', 0.35)} strokeWidth={stroke.hair} />
				{hs.map((h) => {
					const lit = litH !== null && litH[0] === h.a && litH[1] === h.b;
					return (
						<circle
							key={`h${h.a},${h.b}`}
							cx={right.cx + right.unit * h.x}
							cy={right.cy - right.unit * h.y}
							r={lit ? 9 : 5 + 1.5 * collapse}
							fill={lit ? color.viridian : color.ink}
							opacity={lit ? 1 : 0.55 + 0.45 * collapse}
						/>
					);
				})}
			</g>
			{arrow > 0 && (
				<g opacity={arrow * (1 - collapse)}>
					<line
						x1={left.cx + left.unit * (left.radius + 1.6)}
						x2={right.cx - right.unit * (right.radius + 1.8)}
						y1={left.cy}
						y2={right.cy}
						stroke={color.pencil}
						strokeWidth={stroke.line}
						strokeDasharray="8 8"
					/>
					<path
						d={`M${right.cx - right.unit * (right.radius + 1.8) - 16},${right.cy - 10} L${right.cx - right.unit * (right.radius + 1.8)},${right.cy} L${right.cx - right.unit * (right.radius + 1.8) - 16},${right.cy + 10}`}
						fill="none"
						stroke={color.pencil}
						strokeWidth={stroke.line}
					/>
				</g>
			)}
		</svg>
	);
};
