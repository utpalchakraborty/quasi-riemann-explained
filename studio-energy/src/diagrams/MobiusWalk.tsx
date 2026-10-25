import React from 'react';
import numerics from '../data/numerics.json';
import {alpha, color, font, size, stroke} from '../design/tokens';

// M(x) = sum of mu(n) for n <= x, from computed values. Axis labels sit
// outside the plot so the walk never runs through them.

type Props = {
	x: number;
	y: number;
	w: number;
	h: number;
	upto?: number; // last n drawn (animates the walk)
	xMax?: number;
	yMax?: number;
	envelope?: number; // the ±sqrt(x) guide, 0..1
	trivial?: number; // the ±x guide, 0..1
	xTicks?: number[];
	yTicks?: number[];
};

export const MobiusWalk: React.FC<Props> = ({
	x,
	y,
	w,
	h,
	upto = 1200,
	xMax = 1200,
	yMax = 40,
	envelope = 0,
	trivial = 0,
	xTicks = [0, 300, 600, 900, 1200],
	yTicks = [-30, 0, 30],
}) => {
	const M = numerics.mertens as number[];
	const px = (n: number) => (n / xMax) * w;
	const py = (v: number) => h / 2 - (v / yMax) * (h / 2);
	const last = Math.max(1, Math.min(Math.floor(upto), M.length));
	// Step plot: M is constant between integers.
	let d = `M0,${py(0)}`;
	for (let n = 1; n <= last; n++) d += `H${px(n).toFixed(2)}V${py(M[n - 1]).toFixed(2)}`;
	const guide = (f: (n: number) => number, sign: number) => {
		let g = '';
		for (let i = 1; i <= 240; i++) {
			const n = (xMax * i) / 240;
			const v = Math.min(yMax * 1.2, f(n));
			g += `${i === 1 ? 'M' : 'L'}${px(n).toFixed(1)},${py(sign * v).toFixed(1)}`;
		}
		return g;
	};
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
			<svg width={w} height={h} style={{position: 'absolute', overflow: 'visible'}}>
				<defs>
					<clipPath id="walk-clip">
						<rect x={0} y={-4} width={w} height={h + 8} />
					</clipPath>
				</defs>
				{yTicks.map((v) => (
					<line key={v} x1={0} x2={w} y1={py(v)} y2={py(v)} stroke={alpha('pencil', v === 0 ? 0.7 : 0.18)} strokeWidth={v === 0 ? stroke.line : stroke.hair} />
				))}
				<g clipPath="url(#walk-clip)">
					{trivial > 0 && (
						<>
							<path d={guide((n) => n, 1)} fill="none" stroke={color.vermilion} strokeWidth={stroke.line} opacity={trivial} />
							<path d={guide((n) => n, -1)} fill="none" stroke={color.vermilion} strokeWidth={stroke.line} opacity={trivial} />
						</>
					)}
					{envelope > 0 && (
						<>
							<path d={guide(Math.sqrt, 1)} fill="none" stroke={color.pencil} strokeWidth={stroke.line} strokeDasharray="8 10" opacity={envelope} />
							<path d={guide(Math.sqrt, -1)} fill="none" stroke={color.pencil} strokeWidth={stroke.line} strokeDasharray="8 10" opacity={envelope} />
						</>
					)}
					<path d={d} fill="none" stroke={color.viridian} strokeWidth={stroke.line} strokeLinejoin="round" />
					<circle cx={px(last)} cy={py(M[last - 1])} r={7} fill={color.viridian} />
				</g>
			</svg>
			{yTicks.map((v) => (
				<div
					key={v}
					style={{
						position: 'absolute',
						right: w + 20,
						top: py(v) - size.small * 0.68,
						fontFamily: font.text,
						fontSize: size.small,
						color: color.pencil,
						fontVariantNumeric: 'tabular-nums',
					}}
				>
					{v > 0 ? `+${v}` : v === 0 ? '0' : `−${-v}`}
				</div>
			))}
			{xTicks.map((v) => (
				<div
					key={v}
					style={{
						position: 'absolute',
						left: px(v),
						top: h + 14,
						transform: 'translateX(-50%)',
						fontFamily: font.text,
						fontSize: size.small,
						color: color.pencil,
						fontVariantNumeric: 'tabular-nums',
					}}
				>
					{v.toLocaleString('en-US')}
				</div>
			))}
		</div>
	);
};
