import React from 'react';
import {exposeStyle} from '../design/motion';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, size, stroke} from '../design/tokens';
import {Square, useHatch} from './Area';

// Parseval, computed: a signal on one period, f(t) = sum of three waves
// A cos(2 pi k t + phi), and the energy of each, the mean of its square over the
// period. The energies are computed here by sampling (exact for these
// frequencies at this many samples) and the identity is asserted: the
// signal's energy equals the total energy of its waves.

export const WAVES = [
	{A: 3, k: 1, phi: 0.4},
	{A: 2, k: 3, phi: 1.9},
	{A: 1, k: 7, phi: 4.1},
] as const;

const SAMPLES = 512;
const wave = (j: number, t: number) => WAVES[j].A * Math.cos(2 * Math.PI * WAVES[j].k * t + WAVES[j].phi);
const signal = (t: number) => WAVES.reduce((s, _, j) => s + wave(j, t), 0);
const meanSquare = (g: (t: number) => number) => {
	let s = 0;
	for (let i = 0; i < SAMPLES; i++) s += g(i / SAMPLES) ** 2;
	return s / SAMPLES;
};

export const ENERGY = {
	signal: meanSquare(signal),
	waves: WAVES.map((_, j) => meanSquare((t) => wave(j, t))),
};
const total = ENERGY.waves.reduce((s, e) => s + e, 0);
if (Math.abs(ENERGY.signal - total) > 1e-9) throw new Error('Parseval: the energies must agree');
WAVES.forEach((w, j) => {
	if (Math.abs(ENERGY.waves[j] - (w.A * w.A) / 2) > 1e-9) throw new Error('a wave of amplitude A has energy A²/2');
});

// One decimal is exact for these amplitudes: energies 4.5, 2 and 0.5, total 7.
export const fmt = (e: number): string => `${Math.round(e * 10) / 10}`;

type Props = {
	x: number; // left edge of the curves
	w: number;
	rows: number[]; // centre lines: the signal, then each wave
	unit: number; // pixels per unit of amplitude
	sq: {x: number; unit: number}; // energy squares: left edge, pixels per unit of side (side = sqrt(energy))
	signalP?: number;
	wavesP?: number[];
	squaresP?: number[]; // the signal's square, then each wave's
	labelsP?: number[];
};

export const WaveRows: React.FC<Props> = ({x, w, rows, unit, sq, signalP = 1, wavesP = [1, 1, 1], squaresP = [1, 1, 1, 1], labelsP = [1, 1, 1, 1]}) => {
	const hatch = useHatch('ink', 'medium', 0.7);
	const path = (g: (t: number) => number, cy: number, p: number) => {
		const n = Math.max(2, Math.round(240 * p));
		let d = '';
		for (let i = 0; i < n; i++) {
			const t = i / 239;
			d += `${i ? 'L' : 'M'}${(x + t * w).toFixed(1)} ${(cy - g(t) * unit).toFixed(1)}`;
		}
		return d;
	};
	const energies = [ENERGY.signal, ...ENERGY.waves];
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>{hatch.defs}</defs>
				{rows.map((cy, r) => (
					<line key={r} x1={x} x2={x + w} y1={cy} y2={cy} stroke={alpha('pencil', 0.35)} strokeWidth={stroke.hair} opacity={r === 0 ? signalP > 0 ? 1 : 0 : (wavesP[r - 1] ?? 0) > 0 ? 1 : 0} />
				))}
				{signalP > 0 && <path d={path(signal, rows[0], signalP)} fill="none" stroke={color.ink} strokeWidth={stroke.line} strokeLinejoin="round" />}
				{WAVES.map((_, j) =>
					(wavesP[j] ?? 0) > 0 ? <path key={j} d={path((t) => wave(j, t), rows[j + 1], wavesP[j])} fill="none" stroke={color.ink} strokeWidth={stroke.line * 0.8} opacity={0.85} /> : null,
				)}
				{energies.map((e, r) => {
					const side = Math.sqrt(e) * sq.unit;
					return <Square key={r} x={sq.x} y={rows[r] - side / 2} side={side} fill={`url(#${hatch.id})`} p={squaresP[r] ?? 0} />;
				})}
			</svg>
			{energies.map((e, r) => {
				const side = Math.sqrt(e) * sq.unit;
				return (
					<At key={r} x={sq.x + side + 16} y={rows[r] - 24} w={120} style={{...exposeStyle(labelsP[r] ?? 0)}}>
						<Tex tex={fmt(e)} px={size.label} display={false} />
					</At>
				);
			})}
		</>
	);
};
