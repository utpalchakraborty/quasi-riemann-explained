import React from 'react';
import {alpha, color, font, size, stroke} from '../design/tokens';
import {Eis, mobiusIdeal, norm} from './EisArith';
import {eisPoint} from './Lattice';

// The terms of A_1(D) on the Eisenstein lattice: every element of norm between
// D and 2D, prime to 6, marked by the Möbius value of the ideal it generates
// (filled +1, hollow -1; mu = 0 left unmarked) and sized by W(N/D). Each ideal
// appears once per unit, six times. Drawn with nu trivial. Values computed here.

// A smooth bump supported on (1, 2), normalised to 1 at y = 3/2.
export const bump = (y: number): number => (y <= 1 || y >= 2 ? 0 : Math.exp(4 - 1 / ((y - 1) * (2 - y))));

export const annulusTerms = (D: number) => {
	const R = Math.ceil(Math.sqrt(2 * D) * 1.2) + 1;
	const out: {a: number; b: number; N: number; mu: number; w: number; angle: number}[] = [];
	for (let a = -R; a <= R; a++)
		for (let b = -R; b <= R; b++) {
			const z: Eis = [a, b];
			const N = norm(z);
			if (N <= D || N >= 2 * D || N % 2 === 0 || N % 3 === 0) continue;
			const [x, y] = eisPoint(a, b);
			out.push({a, b, N, mu: mobiusIdeal(z), w: bump(N / D), angle: (Math.atan2(y, x) + 2 * Math.PI) % (2 * Math.PI)});
		}
	return out;
};

type Props = {
	cx: number;
	cy: number;
	unit: number;
	D: number;
	p?: number; // angular sweep that lays the terms down
	rings?: number; // the circles N = D and N = 2D
};

export const NormAnnulus: React.FC<Props> = ({cx, cy, unit, D, p = 1, rings = 0}) => {
	const terms = React.useMemo(() => annulusTerms(D), [D]);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			{[D, 2 * D].map((n) => (
				<circle key={n} cx={cx} cy={cy} r={unit * Math.sqrt(n)} fill="none" stroke={alpha('cobalt', 0.75)} strokeWidth={stroke.line} strokeDasharray="5 9" opacity={rings} />
			))}
			{terms.map((t) => {
				if (t.mu === 0) return null;
				const op = Math.max(0, Math.min(1, (p * 2 * Math.PI * 1.08 - t.angle) / 0.4));
				if (op <= 0) return null;
				const [x, y] = eisPoint(t.a, t.b);
				const r = 3 + 8 * t.w;
				return (
					<circle
						key={`${t.a},${t.b}`}
						cx={cx + unit * x}
						cy={cy - unit * y}
						r={r}
						fill={t.mu > 0 ? color.viridian : color.ground}
						stroke={color.viridian}
						strokeWidth={stroke.line}
						opacity={op}
					/>
				);
			})}
		</svg>
	);
};

// The window W on its own axis, y = N(n)/D, with its support (1, 2) marked.
export const BumpPlot: React.FC<{x: number; y: number; w: number; h: number; p?: number}> = ({x, y, w, h, p = 1}) => {
	const Y0 = 0.6;
	const Y1 = 2.4;
	const px = (v: number) => x + ((v - Y0) / (Y1 - Y0)) * w;
	const py = (v: number) => y + h - v * h;
	let d = '';
	for (let i = 0; i <= 200 * p; i++) {
		const v = Y0 + ((Y1 - Y0) * i) / 200;
		d += `${i ? 'L' : 'M'}${px(v).toFixed(1)},${py(bump(v)).toFixed(1)}`;
	}
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: Math.min(1, p * 3)}}>
				<line x1={px(Y0)} x2={px(Y1)} y1={py(0)} y2={py(0)} stroke={alpha('pencil', 0.7)} strokeWidth={stroke.line} />
				{[1, 2].map((v) => (
					<line key={v} x1={px(v)} x2={px(v)} y1={py(0)} y2={py(0) + 10} stroke={color.pencil} strokeWidth={stroke.line} />
				))}
				<path d={d} fill="none" stroke={color.ink} strokeWidth={stroke.line} />
			</svg>
			{[1, 2].map((v) => (
				<div
					key={v}
					style={{
						position: 'absolute',
						left: px(v) - 20,
						width: 40,
						top: py(0) + 14,
						textAlign: 'center',
						fontFamily: font.text,
						fontSize: size.small,
						color: color.pencil,
						opacity: Math.min(1, p * 3),
					}}
				>
					{v}
				</div>
			))}
		</>
	);
};
