import React, {useId} from 'react';
import numerics from '../data/numerics.json';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, size, stroke} from '../design/tokens';

// The square of the Mertens function, M(x)^2, from the computed values to 1200
// (numerics.json `mertens`, the same data MobiusWalk draws), beside the line
// y = x: the energy a random walk of x steps would have on average.

const M = numerics.mertens as number[];
export const MERTENS = {
	upto: M.length,
	maxSq: Math.max(...M.map((v) => v * v)),
};
if (MERTENS.upto !== 1200) throw new Error('the Mertens data must run to 1200: update energy-5');

type Props = {
	x: number;
	y: number; // top edge
	w: number;
	h: number;
	upto?: number;
	xMax?: number;
	yMax?: number;
	line?: number; // y = x drawn on, 0..1
	axes?: number;
	xTicks?: number[];
	yTicks?: number[];
};

export const MertensSquare: React.FC<Props> = ({x, y, w, h, upto = 1200, xMax = 1200, yMax = 600, line = 0, axes = 1, xTicks = [0, 300, 600, 900, 1200], yTicks = [0, 300, 600]}) => {
	const clip = `mc${useId().replace(/:/g, '')}`;
	const sx = (n: number) => x + (n / xMax) * w;
	const sy = (v: number) => y + h - (v / yMax) * h;
	const last = Math.max(1, Math.min(Math.floor(upto), M.length));
	let d = `M${sx(0)},${sy(0)}`;
	for (let n = 1; n <= last; n++) d += `H${sx(n).toFixed(2)}V${sy(M[n - 1] * M[n - 1]).toFixed(2)}`;
	const lineEnd = Math.min(xMax, yMax) * line;
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>
					<clipPath id={clip}>
						<rect x={x} y={y - 2} width={w + 4} height={h + 4} />
					</clipPath>
				</defs>
				<g opacity={axes}>
					{yTicks.map((v) => (
						<line key={v} x1={x} x2={x + w} y1={sy(v)} y2={sy(v)} stroke={alpha('pencil', v === 0 ? 0.7 : 0.18)} strokeWidth={v === 0 ? stroke.line : stroke.hair} />
					))}
					<line x1={x} x2={x} y1={y} y2={y + h} stroke={alpha('pencil', 0.7)} strokeWidth={stroke.hair} />
				</g>
				<g clipPath={`url(#${clip})`}>
					{line > 0 && <line x1={sx(0)} y1={sy(0)} x2={sx(lineEnd)} y2={sy(lineEnd)} stroke={color.ink} strokeWidth={stroke.line} strokeDasharray="10 8" />}
					{upto > 0 && <path d={d} fill="none" stroke={color.ink} strokeWidth={stroke.line} strokeLinejoin="round" />}
				</g>
			</svg>
			{yTicks.map((v) => (
				<At key={v} x={x - 96} y={sy(v) - 20} w={80} style={{textAlign: 'right', opacity: axes}}>
					<Tex tex={`${v}`} px={size.small} ink="pencil" display={false} />
				</At>
			))}
			{xTicks.map((v) => (
				<At key={v} x={sx(v) - 60} y={y + h + 10} w={120} style={{textAlign: 'center', opacity: axes}}>
					<Tex tex={v >= 1000 ? `${v}`.replace(/(\d)(\d{3})$/, '$1{,}$2') : `${v}`} px={size.small} ink="pencil" display={false} />
				</At>
			))}
		</>
	);
};
