import React from 'react';
import {alpha, color, stroke} from '../design/tokens';

// The Eisenstein integers a + b·omega, omega = e^{2 pi i / 3}, drawn as the
// triangular lattice they form. Primes are found by their norms.

const isPrime = (n: number) => {
	if (n < 2) return false;
	for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
	return true;
};

export const eisNorm = (a: number, b: number) => a * a - a * b + b * b;

export const isEisensteinPrime = (a: number, b: number) => {
	const N = eisNorm(a, b);
	if (isPrime(N)) return true; // N = 3 or a split prime p = 1 mod 3
	const q = Math.round(Math.sqrt(N));
	return q * q === N && isPrime(q) && q % 3 === 2; // an inert prime, up to a unit
};

export const eisPoint = (a: number, b: number): [number, number] => [a - b / 2, (b * Math.sqrt(3)) / 2];

type Props = {
	cx: number;
	cy: number;
	unit: number; // pixels per lattice step
	radius: number; // in lattice units
	points?: number; // reveal progress for lattice points
	primes?: number; // reveal progress for prime highlighting
	units?: number; // the six units, joined as a hexagon
	normRing?: {n: number; p: number}; // circle of norm n
};

export const Lattice: React.FC<Props> = ({cx, cy, unit, radius, points = 1, primes = 0, units = 0, normRing}) => {
	const pts: {a: number; b: number; x: number; y: number; r: number}[] = [];
	const R = Math.ceil(radius * 1.3);
	for (let a = -R; a <= R; a++)
		for (let b = -R; b <= R; b++) {
			const [x, y] = eisPoint(a, b);
			const r = Math.hypot(x, y);
			if (r <= radius) pts.push({a, b, x, y, r});
		}
	const hex = Array.from({length: 6}, (_, k) => {
		const th = (k * Math.PI) / 3;
		return `${cx + unit * Math.cos(th)},${cy - unit * Math.sin(th)}`;
	}).join(' ');
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			{normRing && (
				<circle cx={cx} cy={cy} r={unit * Math.sqrt(normRing.n)} fill="none" stroke={alpha('gilt', 0.7)} strokeWidth={stroke.line} strokeDasharray="5 9" opacity={normRing.p} />
			)}
			<polygon points={hex} fill={alpha('gilt', 0.08 * units)} stroke={color.gilt} strokeWidth={stroke.line} opacity={units} />
			{pts.map(({a, b, x, y, r}) => {
				const appear = Math.max(0, Math.min(1, points * (radius + 2) - r));
				if (appear <= 0) return null;
				const prime = isEisensteinPrime(a, b);
				const lit = prime ? Math.max(0, Math.min(1, primes * (radius + 2) - r)) : 0;
				const isUnit = eisNorm(a, b) === 1;
				return (
					<circle
						key={`${a},${b}`}
						cx={cx + unit * x}
						cy={cy - unit * y}
						r={(isUnit && units > 0 ? 7 : 4) + lit * 3.5}
						fill={isUnit && units > 0 ? color.gilt : lit > 0 ? color.verdigris : alpha('mist', 0.55)}
						opacity={appear}
					/>
				);
			})}
		</svg>
	);
};
