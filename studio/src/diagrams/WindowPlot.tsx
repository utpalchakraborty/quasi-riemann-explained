import React from 'react';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, size, stroke} from '../design/tokens';

// The window aimed at a supposed zero rho: a smooth bump phi >= 0 supported
// in (1, 2), the window W(y) = y^{-rho} phi(y) (its real part, for an
// illustrative rho), and the area under phi(y)/y, which is W-hat(rho) > 0.
// Every curve is computed from these formulas.

// The standard C-infinity bump on (1, 2), scaled to peak at 1.
export const phi = (y: number) => (y <= 1 || y >= 2 ? 0 : Math.exp(4 - 1 / ((y - 1) * (2 - y))));

// W-hat(rho) = integral of phi(y) dy / y, by the midpoint rule.
export const WHAT_AT_RHO = (() => {
	const n = 20000;
	let s = 0;
	for (let i = 0; i < n; i++) {
		const y = 1 + (i + 0.5) / n;
		s += phi(y) / y / n;
	}
	return s;
})();

// An illustrative supposed zero, beyond 11/12.
export const RHO = {beta: 0.95, gamma: 20};
const reW = (y: number) => phi(y) * Math.pow(y, -RHO.beta) * Math.cos(RHO.gamma * Math.log(y));

type Props = {
	x: number;
	y: number;
	w: number;
	h: number;
	p?: number; // axes
	bump?: number;
	window?: number;
	area?: number;
};

const Y_RANGE: [number, number] = [0.8, 2.2];
const V_RANGE: [number, number] = [-1.05, 1.15];

export const WindowPlot: React.FC<Props> = ({x, y, w, h, p = 1, bump = 0, window = 0, area = 0}) => {
	const px = (t: number) => x + ((t - Y_RANGE[0]) / (Y_RANGE[1] - Y_RANGE[0])) * w;
	const py = (v: number) => y + h - ((v - V_RANGE[0]) / (V_RANGE[1] - V_RANGE[0])) * h;
	const curve = (fn: (t: number) => number) =>
		Array.from({length: 401}, (_, i) => {
			const t = Y_RANGE[0] + ((Y_RANGE[1] - Y_RANGE[0]) * i) / 400;
			return `${i ? 'L' : 'M'}${px(t).toFixed(1)},${py(fn(t)).toFixed(1)}`;
		}).join('');
	const areaPath = curve((t) => phi(t) / t) + `L${px(Y_RANGE[1])},${py(0)}L${px(Y_RANGE[0])},${py(0)}Z`;
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={p}>
					<line x1={x} x2={x + w} y1={py(0)} y2={py(0)} stroke={color.mist} strokeWidth={stroke.line} />
					<line x1={x} x2={x} y1={py(V_RANGE[0])} y2={py(V_RANGE[1])} stroke={alpha('mist', 0.6)} strokeWidth={stroke.hair} />
					{[1, 1.5, 2].map((t) => (
						<line key={t} x1={px(t)} x2={px(t)} y1={py(0) - 8} y2={py(0) + 8} stroke={color.mist} strokeWidth={stroke.line} />
					))}
					{[-1, 1].map((v) => (
						<line key={v} x1={x - 8} x2={x + 8} y1={py(v)} y2={py(v)} stroke={color.mist} strokeWidth={stroke.line} />
					))}
				</g>
				<path d={areaPath} fill={alpha('verdigris', 0.28)} opacity={area} />
				<path d={curve((t) => phi(t) / t)} fill="none" stroke={color.verdigris} strokeWidth={stroke.line} strokeDasharray="8 7" opacity={area} />
				<path d={curve(reW)} fill="none" stroke={color.paper} strokeWidth={stroke.line} pathLength={1} strokeDasharray={`${window} 1`} opacity={window > 0 ? 1 - 0.75 * area : 0} />
				<path d={curve(phi)} fill="none" stroke={color.verdigris} strokeWidth={stroke.bold} pathLength={1} strokeDasharray={`${bump} 1`} opacity={bump > 0 ? 1 : 0} />
			</svg>
			{[1, 1.5, 2].map((t) => (
				<At key={t} x={px(t) - 40} y={py(V_RANGE[0]) + 6} w={80} style={{textAlign: 'center', opacity: p}}>
					<Tex px={size.label} ink="mist" display={false} tex={`${t}`} />
				</At>
			))}
			{[-1, 1].map((v) => (
				<At key={v} x={x - 76} y={py(v) - 20} w={60} style={{textAlign: 'right', opacity: p}}>
					<Tex px={size.label} ink="mist" display={false} tex={`${v}`} />
				</At>
			))}
			<At x={x + w + 14} y={py(0) - 22} style={{opacity: p}}>
				<Tex px={size.label} ink="mist" display={false} tex={'y'} />
			</At>
			<At x={px(1.5) + 14} y={py(1) - 52} style={{opacity: bump}}>
				<Tex px={size.label} ink="verdigris" display={false} tex={'\\phi(y)\\ge0'} />
			</At>
			<At x={px(1.86)} y={py(-0.55)} style={{opacity: window * (1 - area)}}>
				<Tex px={size.label} display={false} tex={'\\Re W(y)'} />
			</At>
			<At x={px(1.74)} y={py(0.5) - 10} style={{opacity: area}}>
				<Tex px={size.label} ink="verdigris" display={false} tex={'\\phi(y)/y'} />
			</At>
		</>
	);
};
