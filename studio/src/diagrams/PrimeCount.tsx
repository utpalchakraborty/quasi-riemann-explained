import React from 'react';
import {alpha, color, font, size, stroke} from '../design/tokens';

// The prime counting staircase pi(x) against Li(x) = integral from 2 to x of
// dt / log t, both computed here: a sieve for the primes, Simpson's rule for
// the integral. Tick labels sit outside the plot.

export const X_MAX = 1000;

const sieve = (n: number): number[] => {
	const composite = new Uint8Array(n + 1);
	const primes: number[] = [];
	for (let k = 2; k <= n; k++) {
		if (composite[k]) continue;
		primes.push(k);
		for (let m = k * k; m <= n; m += k) composite[m] = 1;
	}
	return primes;
};

export const PRIMES = sieve(X_MAX);

// Li on a grid of step 1/STEPS, accumulated by Simpson's rule on each cell.
const STEPS = 4;
const LI: number[] = (() => {
	const g = (t: number) => 1 / Math.log(t);
	const out = [0];
	let acc = 0;
	for (let i = 1; i <= (X_MAX - 2) * STEPS; i++) {
		const a = 2 + (i - 1) / STEPS;
		const b = 2 + i / STEPS;
		acc += ((b - a) / 6) * (g(a) + 4 * g((a + b) / 2) + g(b));
		out.push(acc);
	}
	return out;
})();

export const li2 = (x: number): number => (x <= 2 ? 0 : LI[Math.min(LI.length - 1, Math.round((x - 2) * STEPS))]);
export const piOf = (x: number): number => {
	let lo = 0;
	let hi = PRIMES.length;
	while (lo < hi) {
		const mid = (lo + hi) >> 1;
		if (PRIMES[mid] <= x) lo = mid + 1;
		else hi = mid;
	}
	return lo;
};

type Props = {
	x: number;
	y: number;
	w: number;
	h: number;
	yMax?: number;
	axes?: number;
	li?: number; // draw progress of Li(x)
	pi?: number; // draw progress of the staircase
	gap?: number; // ember shading between the curves
	xTicks?: number[];
	yTicks?: number[];
};

export const PrimeCount: React.FC<Props> = ({
	x,
	y,
	w,
	h,
	yMax = 180,
	axes = 1,
	li = 1,
	pi = 1,
	gap = 0,
	xTicks = [0, 250, 500, 750, 1000],
	yTicks = [0, 50, 100, 150],
}) => {
	const px = (v: number) => (v / X_MAX) * w;
	const py = (v: number) => h - (v / yMax) * h;
	const liUpto = 2 + (X_MAX - 2) * li;
	let liPath = `M${px(2).toFixed(1)},${py(0).toFixed(1)}`;
	for (let v = 4; v <= liUpto; v += 2) liPath += `L${px(v).toFixed(1)},${py(li2(v)).toFixed(1)}`;
	const piUpto = X_MAX * pi;
	let piPath = `M0,${py(0).toFixed(1)}`;
	let count = 0;
	for (const q of PRIMES) {
		if (q > piUpto) break;
		piPath += `H${px(q).toFixed(1)}V${py(++count).toFixed(1)}`;
	}
	piPath += `H${px(piUpto).toFixed(1)}`;
	// The gap pi(x) - Li(x), as a band between the two curves.
	let band = '';
	if (gap > 0) {
		const top: string[] = [];
		const bottom: string[] = [];
		for (let v = 2; v <= X_MAX; v += 2) {
			top.push(`${px(v).toFixed(1)},${py(li2(v)).toFixed(1)}`);
			bottom.push(`${px(v).toFixed(1)},${py(piOf(v)).toFixed(1)}`);
		}
		band = `M${top.join('L')}L${bottom.reverse().join('L')}Z`;
	}
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
			<svg width={w} height={h} style={{position: 'absolute', overflow: 'visible'}}>
				<g opacity={axes}>
					{yTicks.map((v) => (
						<line key={v} x1={0} x2={w} y1={py(v)} y2={py(v)} stroke={alpha('mist', v === 0 ? 0.7 : 0.16)} strokeWidth={v === 0 ? stroke.line : stroke.hair} />
					))}
					<line x1={0} x2={0} y1={0} y2={h} stroke={alpha('mist', 0.7)} strokeWidth={stroke.line} />
				</g>
				{gap > 0 && <path d={band} fill={alpha('ember', 0.35 * gap)} />}
				{li > 0 && <path d={liPath} fill="none" stroke={color.mist} strokeWidth={stroke.line} strokeDasharray="10 8" />}
				{pi > 0 && <path d={piPath} fill="none" stroke={color.verdigris} strokeWidth={stroke.line} strokeLinejoin="round" />}
			</svg>
			{yTicks.map((v) => (
				<div
					key={v}
					style={{
						position: 'absolute',
						right: w + 18,
						top: py(v) - size.small * 0.68,
						fontFamily: font.text,
						fontSize: size.small,
						color: color.mist,
						opacity: axes,
						fontVariantNumeric: 'tabular-nums',
					}}
				>
					{v}
				</div>
			))}
			{xTicks.map((v) => (
				<div
					key={v}
					style={{
						position: 'absolute',
						left: px(v),
						top: h + 12,
						transform: 'translateX(-50%)',
						fontFamily: font.text,
						fontSize: size.small,
						color: color.mist,
						opacity: axes,
						fontVariantNumeric: 'tabular-nums',
					}}
				>
					{v.toLocaleString('en-US')}
				</div>
			))}
		</div>
	);
};

// The error pi(x) - Li(x) on its own scale: what the zeros control.
export const PrimeError: React.FC<{x: number; y: number; w: number; h: number; p?: number; axes?: number; yRange?: [number, number]}> = ({
	x,
	y,
	w,
	h,
	p = 1,
	axes = 1,
	yRange = [-12, 4],
}) => {
	const px = (v: number) => (v / X_MAX) * w;
	const py = (v: number) => h - ((v - yRange[0]) / (yRange[1] - yRange[0])) * h;
	let d = '';
	for (let v = 2; v <= X_MAX * p; v += 1) d += `${d ? 'L' : 'M'}${px(v).toFixed(1)},${py(piOf(v) - li2(v)).toFixed(1)}`;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h, opacity: axes}}>
			<svg width={w} height={h} style={{position: 'absolute', overflow: 'visible'}}>
				<line x1={0} x2={w} y1={py(0)} y2={py(0)} stroke={alpha('mist', 0.7)} strokeWidth={stroke.hair} />
				{[-10].map((v) => (
					<line key={v} x1={0} x2={w} y1={py(v)} y2={py(v)} stroke={alpha('mist', 0.18)} strokeWidth={stroke.hair} />
				))}
				{d && <path d={d} fill="none" stroke={color.ember} strokeWidth={stroke.line} strokeLinejoin="round" />}
			</svg>
			{[0, -10].map((v) => (
				<div
					key={v}
					style={{
						position: 'absolute',
						right: w + 14,
						top: py(v) - size.micro * 0.68,
						fontFamily: font.text,
						fontSize: size.micro,
						color: color.mist,
						fontVariantNumeric: 'tabular-nums',
					}}
				>
					{v < 0 ? `−${-v}` : v}
				</div>
			))}
		</div>
	);
};
