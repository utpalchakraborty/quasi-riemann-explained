import React from 'react';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, size, stroke} from '../design/tokens';

// The divisors d of the inversion sum (2.18), by norm on a log scale, at the
// basic scales X ≍ D, H ≍ D^{1-θ}: from N(d) = 1 to X^{1/3} ≍ D^{1/3}, split at
// the cutoff H_c = (X/H)^{2/3} ≍ D^{2θ/3} (2.21). Positions are exponents of
// D, so the split sits where the formula puts it (a fraction 2θ of the way).

export const cutoffExponent = (theta: number): number => (2 * theta) / 3;
const TOP = 1 / 3; // N(d) reaches X^{1/3}

type Props = {
	x: number;
	y: number;
	w: number;
	theta: number;
	p?: number; // the axis
	small?: number; // N(d) <= H_c, paid directly
	cut?: number; // the cutoff tick
	large?: number; // N(d) > H_c, the remainders
};

export const cutoffX = (x: number, w: number, theta: number): number => x + (cutoffExponent(theta) / TOP) * w;

export const RecCutoff: React.FC<Props> = ({x, y, w, theta, p = 1, small = 0, cut = 0, large = 0}) => {
	const xc = cutoffX(x, w, theta);
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<line x1={x} x2={x + w * p} y1={y} y2={y} stroke={alpha('pencil', 0.7)} strokeWidth={stroke.line} />
				{[x, x + w].map((tx) => (
					<line key={tx} x1={tx} x2={tx} y1={y - 10} y2={y + 10} stroke={color.pencil} strokeWidth={stroke.line} opacity={p} />
				))}
				{small > 0 && <line x1={x} x2={x + (xc - x) * small} y1={y} y2={y} stroke={color.ink} strokeWidth={stroke.budget + 3} strokeLinecap="butt" />}
				{large > 0 && <line x1={xc} x2={xc + (x + w - xc) * large} y1={y} y2={y} stroke={color.vermilion} strokeWidth={stroke.budget + 3} strokeLinecap="butt" />}
				<line x1={xc} x2={xc} y1={y - 22} y2={y + 22} stroke={color.ink} strokeWidth={stroke.bold} opacity={cut} />
			</svg>
			<At x={x - 60} y={y + 22} w={120} style={{textAlign: 'center', opacity: p}}>
				<Tex px={size.label} ink="pencil" display={false} tex={'1'} />
			</At>
			<At x={xc - 160} y={y + 26} w={320} style={{textAlign: 'center', opacity: cut}}>
				<Tex px={size.label} display={false} tex={'H_c\\asymp D^{2\\vartheta/3}'} />
			</At>
			<At x={x + w - 160} y={y + 22} w={320} style={{textAlign: 'center', opacity: p}}>
				<Tex px={size.label} ink="pencil" display={false} tex={'X^{1/3}\\asymp D^{1/3}'} />
			</At>
		</>
	);
};
