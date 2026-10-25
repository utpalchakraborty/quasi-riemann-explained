import React from 'react';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, size, stroke} from '../design/tokens';

// The two large-sieve factors on the diagonal M = L, on log-log axes:
// M + L = 2M against (ML)^{2/3} = M^{4/3}. Computed from the formulas; the
// common (ML)^epsilon factor is left out.

type Props = {
	x: number;
	y: number;
	w: number;
	h: number;
	p?: number;
	quad?: number;
	general?: number;
	gap?: number;
};

const LOG_M = 6; // M from 1 to 10^6
const LOG_V = 8.5; // values from 1 to 10^8.5

export const SievePlot: React.FC<Props> = ({x, y, w, h, p = 1, quad = 0, general = 0, gap = 0}) => {
	const px = (lm: number) => x + (lm / LOG_M) * w;
	const py = (lv: number) => y + h - (lv / LOG_V) * h;
	const line = (fn: (lm: number) => number, t: number) =>
		Array.from({length: 121}, (_, i) => {
			const lm = (LOG_M * i * t) / 120;
			return `${i ? 'L' : 'M'}${px(lm).toFixed(1)},${py(fn(lm)).toFixed(1)}`;
		}).join('');
	const plus = (lm: number) => Math.log10(2) + lm; // log10(M + L) at L = M
	const twoThirds = (lm: number) => (4 / 3) * lm; // log10((ML)^{2/3}) at L = M
	const cross = 3 * Math.log10(2); // where M^{4/3} = 2M: M = 8
	const band =
		Array.from({length: 61}, (_, i) => {
			const lm = cross + ((LOG_M - cross) * i) / 60;
			return `${i ? 'L' : 'M'}${px(lm).toFixed(1)},${py(twoThirds(lm)).toFixed(1)}`;
		}).join('') +
		Array.from({length: 61}, (_, i) => {
			const lm = LOG_M - ((LOG_M - cross) * i) / 60;
			return `L${px(lm).toFixed(1)},${py(plus(lm)).toFixed(1)}`;
		}).join('') +
		'Z';
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={p}>
					<line x1={x} x2={x + w} y1={y + h} y2={y + h} stroke={color.pencil} strokeWidth={stroke.line} />
					<line x1={x} x2={x} y1={y + h} y2={y} stroke={color.pencil} strokeWidth={stroke.line} />
					{[0, 2, 4, 6].map((lm) => (
						<line key={lm} x1={px(lm)} x2={px(lm)} y1={y + h} y2={y + h + 10} stroke={color.pencil} strokeWidth={stroke.line} />
					))}
					{[0, 4, 8].map((lv) => (
						<line key={lv} x1={x - 10} x2={x} y1={py(lv)} y2={py(lv)} stroke={color.pencil} strokeWidth={stroke.line} />
					))}
				</g>
				<path d={band} fill={alpha('vermilion', 0.2)} opacity={gap} />
				<path d={line(plus, quad)} fill="none" stroke={color.ink} strokeWidth={stroke.bold} opacity={quad > 0 ? 1 : 0} />
				<path d={line(twoThirds, general)} fill="none" stroke={color.vermilion} strokeWidth={stroke.bold} opacity={general > 0 ? 1 : 0} />
			</svg>
			{[0, 2, 4, 6].map((lm) => (
				<At key={lm} x={px(lm) - 50} y={y + h + 16} w={100} style={{textAlign: 'center', opacity: p}}>
					<Tex px={size.small} ink="pencil" display={false} tex={lm === 0 ? '1' : `10^{${lm}}`} />
				</At>
			))}
			{[0, 4, 8].map((lv) => (
				<At key={lv} x={x - 90} y={py(lv) - 18} w={74} style={{textAlign: 'right', opacity: p}}>
					<Tex px={size.small} ink="pencil" display={false} tex={lv === 0 ? '1' : `10^{${lv}}`} />
				</At>
			))}
			<At x={x + w - 160} y={y + h + 56} w={160} style={{textAlign: 'right', opacity: p}}>
				<Tex px={size.small} ink="pencil" display={false} tex={'M=L'} />
			</At>
			<At x={px(4.6)} y={py(plus(4.6)) + 10} style={{opacity: quad}}>
				<Tex px={size.label} display={false} tex={'M+L'} />
			</At>
			<At x={px(3.4) - 150} y={py(twoThirds(3.4)) - 52} style={{opacity: general}}>
				<Tex px={size.label} ink="vermilion" display={false} tex={'(ML)^{2/3}'} />
			</At>
		</>
	);
};
