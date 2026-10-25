import React from 'react';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, size, stroke} from '../design/tokens';
import {cabs, type C} from './DualArith';
import {Square, useHatch} from './Area';

// Chapter 5, Plancherel, computed here. A short vector, the Möbius values
// mu(1), ..., mu(12), and its discrete Fourier transform with the unitary
// normalization, xhat_k = 12^{-1/2} sum_n x_n e^{-2 pi i n k / 12}. Each value
// is a square of side |value|; the two rows look nothing alike, and their
// areas, stacked into two columns, are equal.

const N = 12;
const mobius = (n: number): number => {
	let m = n;
	let r = 1;
	for (let d = 2; d * d <= m; d++)
		if (m % d === 0) {
			m /= d;
			if (m % d === 0) return 0;
			r = -r;
		}
	return m > 1 ? -r : r;
};

export const PL_X = Array.from({length: N}, (_, i) => mobius(i + 1));
export const PL_HAT: C[] = Array.from({length: N}, (_, k) => {
	let re = 0;
	let im = 0;
	PL_X.forEach((v, n) => {
		re += v * Math.cos((-2 * Math.PI * n * k) / N);
		im += v * Math.sin((-2 * Math.PI * n * k) / N);
	});
	return [re / Math.sqrt(N), im / Math.sqrt(N)];
});
export const PL_ENERGY = PL_X.reduce((s, v) => s + v * v, 0);
const HAT_ENERGY = PL_HAT.reduce((s, z) => s + cabs(z) ** 2, 0);
// Plancherel, checked: the totals agree; the values do not.
if (PL_ENERGY !== 8) throw new Error('mu(1..12) should have eight nonzero values');
if (Math.abs(HAT_ENERGY - PL_ENERGY) > 1e-12) throw new Error('the transform did not keep the energy');
if (PL_HAT.filter((z) => Math.abs(cabs(z) - 1) > 0.05 && cabs(z) > 0.05).length < 6) throw new Error('the transform should scramble the sizes');

type Props = {
	x: number; // left edge of the rows
	slot: number; // spacing of the values
	unit: number; // side of a square of size 1
	top: number; // baseline of the values
	bottom: number; // baseline of the transform
	col: {x1: number; x2: number; w: number; base: number};
	values?: number;
	transform?: number;
	pour?: number; // both rows stacked into their columns
	level?: number; // the common height marked
	signs?: number;
};

const strip = (sides: number[], w: number, base: number, part: number) => {
	let y = base;
	return sides.map((s) => {
		const h = (s * s) / w;
		y -= h * part;
		return {y, h: h * part};
	});
};

export const PlancherelRows: React.FC<Props> = ({x, slot, unit, top, bottom, col, values = 1, transform = 0, pour = 0, level = 0, signs = 0}) => {
	const ink = useHatch('ink', 'light', 0.6);
	const sTop = PL_X.map((v) => Math.abs(v) * unit);
	const sBot = PL_HAT.map((z) => cabs(z) * unit);
	const height = (PL_ENERGY * unit * unit) / col.w;
	const column = (sides: number[], cx: number, p: number) =>
		strip(
			sides.filter((s) => s > 0),
			col.w,
			col.base,
			p,
		).map((r, i) => (
			<g key={i}>
				<rect x={cx} y={r.y} width={col.w} height={r.h} fill={`url(#${ink.id})`} />
				<rect x={cx} y={r.y} width={col.w} height={r.h} fill="none" stroke={alpha('ink', 0.75)} strokeWidth={stroke.hair} />
			</g>
		));
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>{ink.defs}</defs>
				{[top, bottom].map((b, r) => (
					<line key={b} x1={x - 10} x2={x + N * slot + 10} y1={b} y2={b} stroke={alpha('pencil', 0.7)} strokeWidth={stroke.hair} opacity={r === 0 ? values : transform} />
				))}
				{sTop.map((s, i) => {
					const a = Math.max(0, Math.min(1, values * (N + 3) - i));
					const cx = x + i * slot + slot / 2;
					return s > 0 ? (
						<Square key={i} x={cx - s / 2} y={top - s} side={s} fill={`url(#${ink.id})`} p={a} />
					) : (
						<line key={i} x1={cx - 8} x2={cx + 8} y1={top} y2={top} stroke={color.pencil} strokeWidth={stroke.bold} opacity={a} />
					);
				})}
				{sBot.map((s, i) => {
					const a = Math.max(0, Math.min(1, transform * (N + 3) - i));
					const cx = x + i * slot + slot / 2;
					return <Square key={i} x={cx - s / 2} y={bottom - s} side={s} fill={`url(#${ink.id})`} p={a} />;
				})}
				{pour > 0 && column(sTop, col.x1, pour)}
				{pour > 0 && column(sBot, col.x2, pour)}
				<line x1={col.x1 - 14} x2={col.x2 + col.w + 14} y1={col.base} y2={col.base} stroke={color.pencil} strokeWidth={stroke.line} opacity={Math.min(1, pour * 4)} />
				<line
					x1={col.x1 - 14}
					x2={col.x2 + col.w + 14}
					y1={col.base - height}
					y2={col.base - height}
					stroke={color.ink}
					strokeWidth={stroke.line}
					strokeDasharray="6 6"
					opacity={level}
				/>
			</svg>
			{PL_X.map((v, i) => (
				<At key={i} x={x + i * slot} y={top + 8} w={slot} style={{textAlign: 'center', opacity: signs * Math.max(0, Math.min(1, values * (N + 3) - i))}}>
					<Tex px={size.micro} ink="viridian" display={false} tex={v > 0 ? '+1' : v < 0 ? '-1' : '0'} />
				</At>
			))}
		</>
	);
};

export const plancherelHeight = (unit: number, w: number) => (PL_ENERGY * unit * unit) / w;
