import React from 'react';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, size, stroke} from '../design/tokens';

// The film's own arithmetic (not a manuscript claim except at k = 6): if the
// twist had order k, copies would sit at k-th powers, Y = H^{1/k}, and the
// same spending would give |A_1(D)| << D^{e(k)} with
//   e(k) = (1 + (1 + theta)(1 - 1/k)) / 2.
// At k = 6 this is 11/12 + 5 theta/12 (October manuscript, §3). The dial maps
// exponents in [1/2, 1 + theta/2] onto a half circle, left to right.

export const exponentAt = (k: number, theta: number): number => 0.5 * (1 + (1 + theta) * (1 - 1 / k));
if (Math.abs(exponentAt(6, 0.1) - (11 / 12 + 0.5 / 12)) > 1e-12) throw new Error('dial formula');

type Props = {
	cx: number;
	cy: number; // centre of the half circle
	r: number;
	theta?: number;
	k: number; // the needle, fractional while it moves
	ks?: number[]; // ticks
	p?: number;
	lit?: number; // k = 6 lit in cobalt, 0..1
	marks?: number; // the reference marks 1/2 and 1, 0..1
};

export const ExponentDial: React.FC<Props> = ({cx, cy, r, theta = 0.1, k, ks = [1, 2, 3, 4, 6, 12], p = 1, lit = 0, marks = 1}) => {
	const lo = 0.5;
	const hi = 1 + theta / 2;
	const ang = (e: number) => Math.PI * (1 - (e - lo) / (hi - lo));
	const at = (e: number, rr: number): [number, number] => [cx + rr * Math.cos(ang(e)), cy - rr * Math.sin(ang(e))];
	const e = exponentAt(Math.max(1, k), theta);
	const [nx, ny] = at(e, r - 18);
	const arc = (e0: number, e1: number, rr: number) => {
		const [x0, y0] = at(e0, rr);
		const [x1, y1] = at(e1, rr);
		return `M${x0} ${y0} A${rr} ${rr} 0 0 1 ${x1} ${y1}`;
	};
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: p}}>
				<path d={arc(lo, hi, r)} fill="none" stroke={color.ink} strokeWidth={stroke.line} />
				{ks.map((kk) => {
					const [x0, y0] = at(exponentAt(kk, theta), r);
					const [x1, y1] = at(exponentAt(kk, theta), r + (kk === 6 ? 30 : 18));
					return <line key={kk} x1={x0} y1={y0} x2={x1} y2={y1} stroke={kk === 6 && lit > 0 ? color.cobalt : color.ink} strokeWidth={kk === 6 ? stroke.bold : stroke.line} />;
				})}
				<g opacity={marks}>
					{[0.5, 1].map((m) => {
						const [x0, y0] = at(m, r - 12);
						const [x1, y1] = at(m, r + 12);
						return <line key={m} x1={x0} y1={y0} x2={x1} y2={y1} stroke={alpha('pencil', 0.9)} strokeWidth={stroke.hair} strokeDasharray="4 4" />;
					})}
				</g>
				<line x1={cx} y1={cy} x2={nx} y2={ny} stroke={k >= 5.97 && k <= 6.03 && lit > 0 ? color.cobalt : color.ink} strokeWidth={stroke.bold} strokeLinecap="round" />
				<circle cx={cx} cy={cy} r={8} fill={color.ink} />
				<line x1={cx - r - 30} x2={cx + r + 30} y1={cy} y2={cy} stroke={alpha('pencil', 0.5)} strokeWidth={stroke.hair} />
			</svg>
			{ks.map((kk) => {
				const [x, y] = at(exponentAt(kk, theta), r + 62);
				return (
					<At key={kk} x={x - 60} y={y - 22} w={120} style={{textAlign: 'center', opacity: p}}>
						<Tex tex={`k=${kk}`} px={size.small} ink={kk === 6 && lit > 0 ? 'cobalt' : 'ink'} display={false} />
					</At>
				);
			})}
			{(
				[
					[0.5, '\\tfrac12'],
					[1, '1'],
				] as const
			).map(([m, t]) => {
				const [x, y] = at(m, r - 52);
				return (
					<At key={m} x={x - 50} y={y - 20} w={100} style={{textAlign: 'center', opacity: p * marks}}>
						<Tex tex={t} px={size.small} ink="pencil" display={false} />
					</At>
				);
			})}
			<At x={cx - 400} y={cy + 30} w={800} style={{textAlign: 'center', opacity: p, whiteSpace: 'nowrap'}}>
				<Tex tex={`e(k)=\\tfrac12\\big(1+(1+\\vartheta)(1-\\tfrac1k)\\big)=${e.toFixed(3)}`} px={size.label} display={false} />
			</At>
		</>
	);
};
