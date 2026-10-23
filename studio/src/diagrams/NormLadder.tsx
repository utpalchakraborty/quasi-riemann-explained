import React from 'react';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {color, size, stroke} from '../design/tokens';
import {MixedLine} from './MixedLine';

// A norm axis on a log scale, ticked at the powers Y^k up to Y^6 = H, so that
// raising to the sixth power is six equal steps. Exact as a picture of
// exponents; no particular Y is implied.

type Props = {
	x: number;
	y: number; // axis baseline
	w: number;
	p?: number; // axis drawn up to Y (0..1)
	reach?: number; // axis extended from Y to Y^6 (0..1)
	yLit?: number; // the primes' range [1, Y] lit
	arrow?: number; // the sixth-power arc from Y to Y^6
	family?: number; // the family's range N(u) <= H
	sixth?: number; // [1, Y] marked as one sixth of [1, H]
};

export const NormLadder: React.FC<Props> = ({x, y, w, p = 1, reach = 0, yLit = 0, arrow = 0, family = 0, sixth = 0}) => {
	const step = w / 6;
	const end = x + step * (1 + 5 * reach) * p;
	const tick = (k: number) => x + step * k;
	const shown = (k: number) => (k <= 1 ? p : Math.max(0, Math.min(1, (reach * 5 - (k - 1) + 1) * 1.2)));
	// the sixth-power arc, Y to Y^6
	const ax0 = tick(1);
	const ax1 = tick(6);
	const apex = y - 150;
	const arcPt = (t: number): [number, number] => {
		const u = 1 - t;
		const mx = (ax0 + ax1) / 2;
		return [u * u * ax0 + 2 * u * t * mx + t * t * ax1, u * u * (y - 14) + 2 * u * t * apex + t * t * (y - 14)];
	};
	const arcPath = Array.from({length: 41}, (_, i) => arcPt((i / 40) * arrow))
		.map(([a, b], i) => `${i ? 'L' : 'M'}${a.toFixed(1)},${b.toFixed(1)}`)
		.join('');
	const head = arcPt(Math.max(0.001, arrow));
	const prev = arcPt(Math.max(0, arrow - 0.03));
	const ang = Math.atan2(head[1] - prev[1], head[0] - prev[0]);
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<line x1={x} x2={end} y1={y} y2={y} stroke={color.mist} strokeWidth={stroke.line} opacity={p > 0 ? 1 : 0} />
				{family > 0 && (
					<g opacity={family}>
						<line x1={x} x2={tick(6)} y1={y + 96} y2={y + 96} stroke={color.paper} strokeWidth={stroke.line} />
						<line x1={x} x2={x} y1={y + 84} y2={y + 108} stroke={color.paper} strokeWidth={stroke.line} />
						<line x1={tick(6)} x2={tick(6)} y1={y + 84} y2={y + 108} stroke={color.paper} strokeWidth={stroke.line} />
					</g>
				)}
				{yLit > 0 && <line x1={x} x2={x + step * yLit} y1={y} y2={y} stroke={color.verdigris} strokeWidth={stroke.frontier} strokeLinecap="round" />}
				{sixth > 0 && (
					<g opacity={sixth}>
						<line x1={x} x2={tick(1)} y1={y - 26} y2={y - 26} stroke={color.verdigris} strokeWidth={stroke.line} />
						<line x1={x} x2={x} y1={y - 34} y2={y - 18} stroke={color.verdigris} strokeWidth={stroke.line} />
						<line x1={tick(1)} x2={tick(1)} y1={y - 34} y2={y - 18} stroke={color.verdigris} strokeWidth={stroke.line} />
					</g>
				)}
				{Array.from({length: 7}, (_, k) => (
					<line key={k} x1={tick(k)} x2={tick(k)} y1={y - 10} y2={y + 10} stroke={k === 6 && family > 0 ? color.paper : color.mist} strokeWidth={stroke.line} opacity={shown(k)} />
				))}
				{arrow > 0 && (
					<g>
						<path d={arcPath} fill="none" stroke={color.verdigris} strokeWidth={stroke.line} strokeDasharray="7 7" />
						<path
							d={`M${head[0]},${head[1]} l${-16 * Math.cos(ang - 0.45)},${-16 * Math.sin(ang - 0.45)} M${head[0]},${head[1]} l${-16 * Math.cos(ang + 0.45)},${-16 * Math.sin(ang + 0.45)}`}
							stroke={color.verdigris}
							strokeWidth={stroke.line}
							fill="none"
							strokeLinecap="round"
						/>
					</g>
				)}
				<circle cx={tick(1)} cy={y} r={9} fill={color.verdigris} opacity={yLit} />
				<circle cx={tick(6)} cy={y} r={9} fill={color.paper} opacity={family} />
			</svg>
			{Array.from({length: 7}, (_, k) => (
				<At key={k} x={tick(k) - 80} y={y + 18} w={160} style={{textAlign: 'center', opacity: shown(k)}}>
					<Tex
						px={size.label}
						display={false}
						ink={k === 1 && yLit > 0 ? 'verdigris' : 'mist'}
						tex={k === 0 ? '1' : k === 1 ? 'Y' : k === 6 && family > 0 ? 'Y^{6}\\!=\\!H' : `Y^{${k}}`}
					/>
				</At>
			))}
			<At x={(ax0 + ax1) / 2 - 160} y={(y - 14 + apex) / 2 - 52} w={320} style={{textAlign: 'center', opacity: arrow}}>
				<MixedLine ink="verdigris" px={size.small} parts={['sixth powers: ', {tex: 'p\\mapsto p^{6}', ink: 'verdigris'}]} />
			</At>
			<At x={x} y={y + 112} w={w} style={{textAlign: 'center', opacity: family}}>
				<MixedLine ink="paper" px={size.small} parts={['rows of the family: ', {tex: '\\N(u)\\le H', ink: 'paper'}]} />
			</At>
			<At x={x + w - 220} y={y - 52} w={220} style={{textAlign: 'right', opacity: p * (1 - arrow)}}>
				<MixedLine px={size.small} parts={['norm, log scale']} />
			</At>
		</>
	);
};
