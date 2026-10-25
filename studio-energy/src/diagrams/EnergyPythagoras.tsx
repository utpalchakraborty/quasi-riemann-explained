import React from 'react';
import {exposeStyle} from '../design/motion';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, size, stroke} from '../design/tokens';
import {useHatch} from './Area';

// Pythagoras in the energy grammar: the 3-4-5 right triangle with a square on
// each side, each ruled into unit cells so its area can be counted. The two
// squares on the short sides hold 9 and 16 cells; the square on the long side
// holds 25. Schematic: an exact example, not data.

export const LEGS = [3, 4] as const;
export const HYP = Math.hypot(LEGS[0], LEGS[1]);
if (HYP !== 5) throw new Error('the triangle must be 3-4-5');

type Pt = [number, number];
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const mul = (a: Pt, k: number): Pt => [a[0] * k, a[1] * k];

type Props = {
	ox: number; // the right angle
	oy: number;
	u: number; // pixels per unit length
	tri?: number;
	right?: number;
	hyp?: number;
	legs?: number;
	grid?: number;
	lengths?: number;
	areas?: number;
	opacity?: number;
};

export const Pythagoras: React.FC<Props> = ({ox, oy, u, tri = 1, right = 1, hyp = 1, legs = 1, grid = 1, lengths = 1, areas = 1, opacity = 1}) => {
	const hatch = useHatch('ink', 'light', 0.55);
	const [a, b] = LEGS;
	const O: Pt = [ox, oy];
	const A: Pt = [ox + a * u, oy];
	const B: Pt = [ox, oy - b * u];
	// each square: a corner and its two edge vectors, and its side in units
	const squares = [
		{key: 'a', P: O, e1: [a * u, 0] as Pt, e2: [0, a * u] as Pt, k: a, p: legs},
		{key: 'b', P: B, e1: [0, b * u] as Pt, e2: [-b * u, 0] as Pt, k: b, p: legs},
		{key: 'c', P: A, e1: [-a * u, -b * u] as Pt, e2: [b * u, -a * u] as Pt, k: HYP, p: hyp},
	];
	const poly = (P: Pt, e1: Pt, e2: Pt) => [P, add(P, e1), add(add(P, e1), e2), add(P, e2)].map((q) => q.map((v) => v.toFixed(1)).join(',')).join(' ');
	const center = (P: Pt, e1: Pt, e2: Pt) => add(P, mul(add(e1, e2), 0.5));
	return (
		<div style={{position: 'absolute', left: 0, top: 0, opacity}}>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>{hatch.defs}</defs>
				{squares.map(({key, P, e1, e2, k, p}) =>
					p > 0 ? (
						<g key={key}>
							<polygon points={poly(P, e1, e2)} fill={`url(#${hatch.id})`} opacity={Math.min(1, p * 1.5)} />
							<g opacity={grid * p}>
								{Array.from({length: k - 1}, (_, i) => {
									const t = (i + 1) / k;
									const s1 = add(P, mul(e1, t));
									const s2 = add(P, mul(e2, t));
									return (
										<g key={i}>
											<line x1={s1[0]} y1={s1[1]} x2={s1[0] + e2[0]} y2={s1[1] + e2[1]} stroke={alpha('pencil', 0.6)} strokeWidth={stroke.hair} />
											<line x1={s2[0]} y1={s2[1]} x2={s2[0] + e1[0]} y2={s2[1] + e1[1]} stroke={alpha('pencil', 0.6)} strokeWidth={stroke.hair} />
										</g>
									);
								})}
							</g>
							<polygon points={poly(P, e1, e2)} fill="none" stroke={color.ink} strokeWidth={stroke.line} pathLength={1} strokeDasharray={`${p} 1`} />
						</g>
					) : null,
				)}
				{tri > 0 && (
					<polygon
						points={[O, A, B].map((q) => q.join(',')).join(' ')}
						fill={color.ground}
						stroke={color.ink}
						strokeWidth={stroke.bold}
						strokeLinejoin="round"
						pathLength={1}
						strokeDasharray={`${tri} 1`}
						fillOpacity={Math.min(1, tri * 2)}
					/>
				)}
				{right > 0 && <polyline points={`${ox + 18},${oy} ${ox + 18},${oy - 18} ${ox},${oy - 18}`} fill="none" stroke={color.ink} strokeWidth={stroke.hair} opacity={right} />}
			</svg>
			{/* lengths, inside the triangle beside each side */}
			{[
				{t: `${a}`, at: [ox + (a * u) / 2, oy - 30] as Pt},
				{t: `${b}`, at: [ox + 30, oy - (b * u) / 2 - 4] as Pt},
				{t: `${HYP}`, at: [ox + (a * u) / 2 + 20, oy - (b * u) / 2 - 22] as Pt},
			].map(({t, at}) => (
				<At key={t} x={at[0] - 30} y={at[1] - 20} w={60} style={{textAlign: 'center', ...exposeStyle(lengths)}}>
					<Tex tex={t} px={size.label} ink="pencil" display={false} />
				</At>
			))}
			{squares.map(({key, P, e1, e2, k, p}) => {
				const c = center(P, e1, e2);
				return (
					<At key={key} x={c[0] - 50} y={c[1] - 34} w={100} style={{textAlign: 'center', ...exposeStyle(Math.min(areas, p))}}>
						<Tex tex={`${k * k}`} px={size.mathInline} display={false} />
					</At>
				);
			})}
		</div>
	);
};
