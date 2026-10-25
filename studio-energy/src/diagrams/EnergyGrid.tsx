import React from 'react';
import {lerp} from '../design/motion';
import {seeded} from '../design/scene';
import {alpha, color, stroke} from '../design/tokens';
import {useHatch} from './Area';

// The square of a sum of N random signs, spread into its N × N grid of
// products a_n a_m. Computed: the signs are seeded draws (`seeded`, salt 23),
// DRAWS independent choices of all N signs; draw 0 is the grid shown first.
// Averaging over the draws, every product off the diagonal tends to zero and
// every product on it stays 1, so the mean of |a_1 + ... + a_N|^2 tends to N.

export const N = 16;
export const DRAWS = 400;
const SIDE = Math.sqrt(N);
if (!Number.isInteger(SIDE)) throw new Error('N must be a square, so its diagonal tiles a square of side √N');

export const signOf = (draw: number, n: number): number => (seeded(n + N * draw, 23) < 0.5 ? 1 : -1);

// prefix[k][n * N + m] = sum over the first k draws of a_n a_m; sq[k] = sum of S^2.
const prefix: Int16Array[] = [new Int16Array(N * N)];
const sq: number[] = [0];
for (let k = 0; k < DRAWS; k++) {
	const a = Array.from({length: N}, (_, n) => signOf(k, n));
	const row = new Int16Array(prefix[k]);
	for (let n = 0; n < N; n++) for (let m = 0; m < N; m++) row[n * N + m] += a[n] * a[m];
	prefix.push(row);
	const S = a.reduce((s, v) => s + v, 0);
	sq.push(sq[k] + S * S);
}

export const GRID = {
	// mean of |a_1 + ... + a_N|^2 over the first k draws
	meanSq: (k: number): number => sq[Math.max(1, Math.min(DRAWS, Math.floor(k)))] / Math.max(1, Math.min(DRAWS, Math.floor(k))),
	sum: (draw: number): number => Array.from({length: N}, (_, n) => signOf(draw, n)).reduce((s, v) => s + v, 0),
	// the largest mean product off the diagonal after all draws
	maxCross: (() => {
		let m = 0;
		for (let n = 0; n < N; n++) for (let j = 0; j < N; j++) if (n !== j) m = Math.max(m, Math.abs(prefix[DRAWS][n * N + j]) / DRAWS);
		return m;
	})(),
};
if (Math.abs(GRID.meanSq(DRAWS) - N) > 0.15 * N) throw new Error('the mean square should be near N');
if (GRID.maxCross > 0.2) throw new Error('the cross terms should average out');

type Props = {
	x: number; // top-left of the grid
	y: number;
	cell: number;
	fill?: number; // products revealed in reading order, 0..1
	draws?: number; // draws averaged (1 = draw 0 alone)
	headers?: number;
	diag?: number; // the diagonal as hatched unit squares
	cross?: number; // the cross terms brought forward
	minus?: number; // the minus products brought forward
	slide?: number; // the diagonal squares moved into a square of side √N
	block?: {x: number; y: number}; // top-left of that square
	dim?: number; // fade the off-diagonal
};

const Glyph: React.FC<{cx: number; cy: number; s: number; v: number; width: number; op: number; ink?: string}> = ({cx, cy, s, v, width, op, ink = color.ink}) =>
	op <= 0 ? null : (
		<g opacity={op} stroke={ink} strokeWidth={width} strokeLinecap="round">
			<line x1={cx - s} x2={cx + s} y1={cy} y2={cy} />
			{v > 0 && <line x1={cx} x2={cx} y1={cy - s} y2={cy + s} />}
		</g>
	);

export const SignGrid: React.FC<Props> = ({x, y, cell, fill = 1, draws = 1, headers = 1, diag = 0, cross = 0, minus = 0, slide = 0, block, dim = 0}) => {
	const hatch = useHatch('ink', 'medium', 0.8);
	const K = Math.max(1, Math.min(DRAWS, Math.floor(draws)));
	const latest = K - 1;
	const shown = fill * N * N;
	const mid = (i: number) => i * cell + cell / 2;
	const avg = (n: number, m: number) => prefix[K][n * N + m] / K;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<defs>{hatch.defs}</defs>
			{/* the ruling of the grid */}
			<g opacity={Math.min(1, fill * 4)}>
				{Array.from({length: N + 1}, (_, i) => (
					<g key={i}>
						<line x1={x} x2={x + N * cell} y1={y + i * cell} y2={y + i * cell} stroke={alpha('pencil', i === 0 || i === N ? 0.7 : 0.25)} strokeWidth={stroke.hair} />
						<line x1={x + i * cell} x2={x + i * cell} y1={y} y2={y + N * cell} stroke={alpha('pencil', i === 0 || i === N ? 0.7 : 0.25)} strokeWidth={stroke.hair} />
					</g>
				))}
			</g>
			{/* the signs themselves, along the top and the left */}
			{Array.from({length: N}, (_, i) => (
				<g key={`h${i}`}>
					<Glyph cx={x + mid(i)} cy={y - cell * 0.75} s={cell * 0.24} v={signOf(latest, i)} width={stroke.line} op={headers} />
					<Glyph cx={x - cell * 0.75} cy={y + mid(i)} s={cell * 0.24} v={signOf(latest, i)} width={stroke.line} op={headers} />
				</g>
			))}
			{Array.from({length: N * N}, (_, k) => {
				const n = Math.floor(k / N);
				const m = k % N;
				const p = Math.max(0, Math.min(1, shown - k));
				if (p <= 0) return null;
				const cx = x + mid(m);
				const cy = y + mid(n);
				if (n === m) {
					const sq0 = {x: x + m * cell, y: y + n * cell};
					const to = block ? {x: block.x + (n % SIDE) * cell, y: block.y + Math.floor(n / SIDE) * cell} : sq0;
					const sx = lerp(sq0.x, to.x, slide);
					const sy = lerp(sq0.y, to.y, slide);
					return (
						<g key={k}>
							<Glyph cx={cx} cy={cy} s={cell * 0.2} v={1} width={stroke.line} op={p * (1 - diag)} />
							{diag > 0 && (
								<>
									{slide > 0 && <rect x={sq0.x + 2} y={sq0.y + 2} width={cell - 4} height={cell - 4} fill="none" stroke={alpha('pencil', 0.5)} strokeWidth={stroke.hair} strokeDasharray="3 4" opacity={slide} />}
									<rect x={sx + 1} y={sy + 1} width={cell - 2} height={cell - 2} fill={`url(#${hatch.id})`} opacity={diag} />
									<rect x={sx + 1} y={sy + 1} width={cell - 2} height={cell - 2} fill="none" stroke={color.ink} strokeWidth={stroke.line} opacity={diag} />
								</>
							)}
						</g>
					);
				}
				const a = avg(n, m);
				const isMinus = a < 0;
				const width = stroke.line + (isMinus ? minus * 1.5 : 0) + cross * 0.4;
				const op = p * Math.max(0.0, Math.abs(a)) * (0.7 + 0.3 * cross) * (1 - dim);
				return <Glyph key={k} cx={cx} cy={cy} s={cell * 0.2} v={a} width={width} op={op} />;
			})}
		</svg>
	);
};
