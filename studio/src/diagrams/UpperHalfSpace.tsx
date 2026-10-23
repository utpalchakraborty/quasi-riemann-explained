import React from 'react';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, size, stroke} from '../design/tokens';

// Hyperbolic three-space, drawn as a line sketch: the complex plane of z as a
// floor in oblique projection, the height v above it, and hemispheres standing
// on the floor (the planes of this geometry). A symmetry g carries a point w
// to g·w. Schematic throughout.

type Props = {
	x: number; // screen position of z = 0 on the floor
	y: number;
	s: number; // pixels per unit
	p?: number;
	domes?: number;
	point?: number;
	move?: number; // w carried to g·w
};

const proj = (x0: number, y0: number, s: number, u: number, w: number, v = 0): [number, number] => [x0 + s * (u + 0.5 * w), y0 - s * (0.36 * w + v)];

// w = (z, v) and its image under the inversion (z, v) -> (-conj z, v) / (|z|^2 + v^2)
const W = {u: 0.32, w: 0.18, v: 0.42};
const R2 = W.u * W.u + W.w * W.w + W.v * W.v;
const GW = {u: -W.u / R2, w: W.w / R2, v: W.v / R2};

const NEIGHBOURS: [number, number][] = [
	[1, 0],
	[0.5, Math.sqrt(3) / 2],
	[-0.5, Math.sqrt(3) / 2],
	[-1, 0],
	[-0.5, -Math.sqrt(3) / 2],
	[0.5, -Math.sqrt(3) / 2],
];

export const UpperHalfSpace: React.FC<Props> = ({x, y, s, p = 1, domes = 1, point = 0, move = 0}) => {
	const P = (u: number, w: number, v = 0) => proj(x, y, s, u, w, v);
	const floor = [P(-2.1, -1.5), P(2.1, -1.5), P(2.1, 1.5), P(-2.1, 1.5)];
	const dome = (cu: number, cw: number, r: number, ink: string, key: string, op: number) => {
		const [cx, cy] = P(cu, cw);
		const rx = r * s;
		const ry = r * s * 0.36;
		return (
			<g key={key} opacity={op}>
				<path d={`M${cx - rx},${cy} A${rx},${ry} 0 0 1 ${cx + rx},${cy}`} fill="none" stroke={alpha('mist', 0.35)} strokeWidth={stroke.hair} strokeDasharray="4 6" />
				<path d={`M${cx - rx},${cy} A${rx},${ry} 0 0 0 ${cx + rx},${cy}`} fill="none" stroke={ink} strokeWidth={stroke.hair} />
				<path d={`M${cx - rx},${cy} A${rx},${r * s} 0 0 1 ${cx + rx},${cy}`} fill={alpha('fieldLift', 0.35)} stroke={ink} strokeWidth={stroke.line} />
			</g>
		);
	};
	// back domes first
	const ring = NEIGHBOURS.map(([u, w], i) => ({u, w, i})).sort((a, b) => b.w - a.w);
	const [wx, wy] = P(W.u, W.w, W.v);
	const [gx, gy] = P(GW.u, GW.w, GW.v);
	const [fx, fy] = P(W.u, W.w);
	const [hx, hy] = P(GW.u, GW.w);
	const mx = (wx + gx) / 2 + 40;
	const my = Math.min(wy, gy) - 110;
	const arc = Array.from({length: 31}, (_, i) => {
		const t = (i / 30) * move;
		const u = 1 - t;
		return `${i ? 'L' : 'M'}${(u * u * wx + 2 * u * t * mx + t * t * gx).toFixed(1)},${(u * u * wy + 2 * u * t * my + t * t * gy).toFixed(1)}`;
	}).join('');
	const [ax, ay] = P(-2.1, -1.5);
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={p}>
					<polygon points={floor.map(([a, b]) => `${a},${b}`).join(' ')} fill={alpha('fieldLift', 0.4)} stroke={alpha('mist', 0.6)} strokeWidth={stroke.hair} />
					<line x1={ax} y1={ay} x2={ax} y2={ay - s * 2.5} stroke={color.mist} strokeWidth={stroke.line} />
					<path d={`M${ax - 8},${ay - s * 2.5 + 14} L${ax},${ay - s * 2.5} L${ax + 8},${ay - s * 2.5 + 14}`} fill="none" stroke={color.mist} strokeWidth={stroke.line} />
				</g>
				{ring.filter((d) => d.w > 0).map((d) => dome(d.u, d.w, 0.42, alpha('mist', 0.8), `b${d.i}`, domes))}
				{dome(0, 0, 1, color.paper, 'unit', domes)}
				{ring.filter((d) => d.w <= 0).map((d) => dome(d.u, d.w, 0.42, alpha('mist', 0.8), `f${d.i}`, domes))}
				<g opacity={point}>
					<line x1={wx} y1={wy} x2={fx} y2={fy} stroke={alpha('paper', 0.6)} strokeWidth={stroke.hair} strokeDasharray="4 5" />
					<circle cx={wx} cy={wy} r={8} fill={color.paper} />
				</g>
				{move > 0 && (
					<g>
						<path d={arc} fill="none" stroke={color.paper} strokeWidth={stroke.line} strokeDasharray="7 7" />
						<g opacity={Math.max(0, move * 3 - 2)}>
							<line x1={gx} y1={gy} x2={hx} y2={hy} stroke={alpha('paper', 0.6)} strokeWidth={stroke.hair} strokeDasharray="4 5" />
							<circle cx={gx} cy={gy} r={8} fill={color.paper} />
						</g>
					</g>
				)}
			</svg>
			<At x={ax - 44} y={ay - s * 2.5 - 10} style={{opacity: p}}>
				<Tex px={size.label} ink="mist" display={false} tex={'v'} />
			</At>
			<At x={floor[1][0] - 150} y={floor[1][1] + 12} w={200} style={{textAlign: 'right', opacity: p}}>
				<Tex px={size.label} ink="mist" display={false} tex={'z\\in\\mathbb C'} />
			</At>
			<At x={wx + 14} y={wy - 18} style={{opacity: point}}>
				<Tex px={size.label} display={false} tex={'w=(z,v)'} />
			</At>
			<At x={gx - 70} y={gy - 50} style={{opacity: Math.max(0, move * 3 - 2)}}>
				<Tex px={size.label} display={false} tex={'g\\,w'} />
			</At>
		</>
	);
};
