import React from 'react';
import {Tex} from '../design/Tex';
import {alpha, color, font, size, stroke} from '../design/tokens';
import {COUNT_X, primeCounts} from './frontierData';

// Computed: primes up to x in the classes 1 and 3 mod 4, with the main term
// (1/phi(4)) * integral_2^x dt/log t. The three curves nearly coincide.

type Props = {x: number; y: number; w: number; h: number; p: number; axes?: number};

const Y_MAX = 5000;

export const PrimeCounts: React.FC<Props> = ({x, y, w, h, p, axes = 1}) => {
	const data = primeCounts();
	const sx = (v: number) => x + (v / COUNT_X) * w;
	const sy = (v: number) => y + h - (v / Y_MAX) * h;
	const n = Math.max(0, Math.round(p * data.xs.length));
	const path = (ys: number[]) =>
		'M' + [[0, 0] as [number, number], ...data.xs.slice(0, n).map((xv, i) => [xv, ys[i]] as [number, number])].map(([a, b]) => `${sx(a).toFixed(1)},${sy(b).toFixed(1)}`).join('L');
	const label = (v: number) => (
		<span style={{fontFamily: font.text, fontSize: size.small, color: color.mist, fontVariantNumeric: 'tabular-nums'}}>{v.toLocaleString('en-US')}</span>
	);
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={axes}>
					<line x1={x} x2={x + w} y1={y + h} y2={y + h} stroke={color.mist} strokeWidth={stroke.line} />
					<line x1={x} x2={x} y1={y} y2={y + h} stroke={color.mist} strokeWidth={stroke.line} />
					{[0, 2500, 5000].map((v) => (
						<line key={v} x1={x} x2={x + w} y1={sy(v)} y2={sy(v)} stroke={alpha('mist', 0.15)} strokeWidth={stroke.hair} />
					))}
				</g>
				{n > 0 && (
					<>
						<path d={path(data.main)} fill="none" stroke={color.paper} strokeWidth={stroke.bold} opacity={0.9} />
						<path d={path(data.three)} fill="none" stroke={color.verdigris} strokeWidth={stroke.line} />
						<path d={path(data.one)} fill="none" stroke={color.verdigris} strokeWidth={stroke.line} strokeDasharray="8 6" />
					</>
				)}
			</svg>
			{[0, 2500, 5000].map((v) => (
				<div key={v} style={{position: 'absolute', left: x - 90, top: sy(v) - 17, width: 76, textAlign: 'right', opacity: axes}}>
					{label(v)}
				</div>
			))}
			{[0, 50000, 100000].map((v) => (
				<div key={v} style={{position: 'absolute', left: sx(v) - 60, top: y + h + 10, width: 120, textAlign: 'center', opacity: axes}}>
					{label(v)}
				</div>
			))}
			<div style={{position: 'absolute', left: x + w + 12, top: y + h - 20, opacity: axes}}>
				<Tex tex={'x'} px={size.label} ink="mist" display={false} />
			</div>
		</>
	);
};

