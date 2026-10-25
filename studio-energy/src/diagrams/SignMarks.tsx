import React from 'react';
import {alpha, color, font, size, stroke} from '../design/tokens';

// Signs as marks on a baseline, for any sequence of values in {+1, −1, 0}:
// the visual language of Signs, generalised to a given values array (a
// Dirichlet character, or Möbius values revealed kind by kind). +1 is a
// filled viridian dot above, −1 a hollow dot below, 0 a pencil tick on the line.

type Props = {
	x: number;
	y: number; // baseline
	values: number[]; // values[i] belongs to n = i + 1
	cell: number;
	p?: number; // reveal, left to right
	show?: {pos?: number; neg?: number; zero?: number}; // reveal by kind
	lift?: number;
	labels?: boolean;
	labelEvery?: number;
	highlight?: number[]; // n values ringed in cobalt
	ring?: number | ((n: number) => number); // ring progress, overall or per n
	dim?: number; // fade every mark not highlighted (0..1)
};

export const SignMarks: React.FC<Props> = ({
	x,
	y,
	values,
	cell,
	p = 1,
	show = {},
	lift = 30,
	labels = true,
	labelEvery = 1,
	highlight = [],
	ring = 1,
	dim = 0,
}) => {
	const count = values.length;
	const kind = (v: number) => (v > 0 ? (show.pos ?? 1) : v < 0 ? (show.neg ?? 1) : (show.zero ?? 1));
	const reveal = (i: number) => Math.max(0, Math.min(1, p * count - i));
	const ringOf = (n: number) => (typeof ring === 'function' ? ring(n) : ring);
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				<line
					x1={x - cell * 0.5}
					x2={x + cell * (count - 0.5) * Math.min(1, p * 1.05)}
					y1={y}
					y2={y}
					stroke={alpha('pencil', 0.6)}
					strokeWidth={stroke.hair}
					opacity={p > 0 ? 1 : 0}
				/>
				{values.map((v, i) => {
					const n = i + 1;
					const lit = highlight.includes(n) && ringOf(n) > 0;
					const op = reveal(i) * kind(v) * (lit ? 1 : 1 - 0.7 * dim);
					if (op <= 0) return null;
					const cx = x + cell * i;
					const cy = v === 0 ? y : y - v * lift;
					return (
						<g key={n} opacity={op}>
							{v === 0 ? (
								<line x1={cx} x2={cx} y1={y - 8} y2={y + 8} stroke={color.pencil} strokeWidth={stroke.line} />
							) : (
								<>
									<line x1={cx} x2={cx} y1={y} y2={y - v * (lift - 9)} stroke={alpha('viridian', 0.45)} strokeWidth={stroke.hair} />
									<circle cx={cx} cy={cy} r={9} fill={v > 0 ? color.viridian : 'none'} stroke={color.viridian} strokeWidth={stroke.line} />
								</>
							)}
							{lit && <circle cx={cx} cy={cy} r={17} fill="none" stroke={color.cobalt} strokeWidth={stroke.line} opacity={ringOf(n)} />}
						</g>
					);
				})}
			</svg>
			{labels &&
				values.map((_, i) => {
					if (i > 0 && (i + 1) % labelEvery !== 0) return null;
					const lit = highlight.includes(i + 1) && ringOf(i + 1) > 0;
					return (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: x + cell * i - 30,
								width: 60,
								top: y + lift + 22,
								textAlign: 'center',
								fontFamily: font.text,
								fontSize: size.micro,
								color: lit ? color.cobalt : color.pencil,
								opacity: reveal(i) * (lit ? 1 : 1 - 0.5 * dim),
								fontVariantNumeric: 'tabular-nums',
							}}
						>
							{i + 1}
						</div>
					);
				})}
		</>
	);
};
