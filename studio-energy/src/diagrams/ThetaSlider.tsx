import React from 'react';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, size, stroke} from '../design/tokens';
import {MixedLine} from './MixedLine';

// Two scales read together: theta on (0, 1/10], and the exponent it buys,
// 11/12 + 5·theta/12, on [0.9, 1]. Exact: the marker is that formula.

type Props = {
	x: number;
	y: number; // the theta track
	w: number;
	theta: number;
	p?: number;
	zero?: number; // emphasis on the excluded end, theta = 0
	exponent?: number; // the second scale
	saving?: number; // the interval [11/12, 1], the cancellation
};

const GAP = 190; // between the two tracks

export const exponentOf = (theta: number) => 11 / 12 + (5 * theta) / 12;

export const ThetaSlider: React.FC<Props> = ({x, y, w, theta, p = 1, zero = 0, exponent = 0, saving = 0}) => {
	const tx = (t: number) => x + (t / 0.1) * w;
	const ex = (e: number) => x + ((e - 0.9) / 0.1) * w;
	const y2 = y + GAP;
	const e = exponentOf(theta);
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={p}>
					<line x1={x} x2={x + w} y1={y} y2={y} stroke={color.pencil} strokeWidth={stroke.line} />
					<line x1={tx(0.05)} x2={tx(0.05)} y1={y - 8} y2={y + 8} stroke={color.pencil} strokeWidth={stroke.line} />
					<circle cx={tx(0.1)} cy={y} r={8} fill={color.pencil} />
					<circle cx={x} cy={y} r={11} fill={color.ground} stroke={zero > 0 ? color.vermilion : color.pencil} strokeWidth={stroke.line} />
					{zero > 0 && <circle cx={x} cy={y} r={22 + 6 * zero} fill="none" stroke={alpha('vermilion', 0.7 * zero)} strokeWidth={stroke.hair} />}
					<line x1={tx(theta)} x2={tx(0.1)} y1={y} y2={y} stroke={color.ink} strokeWidth={stroke.budget} strokeLinecap="round" />
					<circle cx={tx(theta)} cy={y} r={13} fill={color.ink} />
				</g>
				<g opacity={exponent}>
					<line x1={x} x2={x + w} y1={y2} y2={y2} stroke={color.pencil} strokeWidth={stroke.line} />
					{[0.9, 0.95, 1].map((v) => (
						<line key={v} x1={ex(v)} x2={ex(v)} y1={y2 - 8} y2={y2 + 8} stroke={color.pencil} strokeWidth={stroke.line} />
					))}
					<line x1={ex(11 / 12)} x2={ex(11 / 12)} y1={y2 - 22} y2={y2 + 22} stroke={color.cobalt} strokeWidth={stroke.budget} />
					{saving > 0 && (
						<g opacity={saving}>
							<line x1={ex(11 / 12)} x2={ex(1)} y1={y2 + 74} y2={y2 + 74} stroke={color.cobalt} strokeWidth={stroke.line} />
							<line x1={ex(11 / 12)} x2={ex(11 / 12)} y1={y2 + 64} y2={y2 + 84} stroke={color.cobalt} strokeWidth={stroke.line} />
							<line x1={ex(1)} x2={ex(1)} y1={y2 + 64} y2={y2 + 84} stroke={color.cobalt} strokeWidth={stroke.line} />
						</g>
					)}
					<circle cx={ex(e)} cy={y2} r={11} fill={color.ink} />
				</g>
			</svg>
			<At x={x - 140} y={y - 26} w={60} style={{textAlign: 'right', opacity: p}}>
				<Tex px={size.mathInline} display={false} tex={'\\vartheta'} />
			</At>
			{[
				{v: 0, tex: '0', ink: zero > 0 ? ('vermilion' as const) : ('pencil' as const)},
				{v: 0.05, tex: '1/20', ink: 'pencil' as const},
				{v: 0.1, tex: '1/10', ink: 'pencil' as const},
			].map((t) => (
				<At key={t.v} x={tx(t.v) - 60} y={y + 20} w={120} style={{textAlign: 'center', opacity: p}}>
					<Tex px={size.label} display={false} ink={t.ink} tex={t.tex} />
				</At>
			))}
			<At x={tx(theta) - 150} y={y - 76} w={300} style={{textAlign: 'center', opacity: p}}>
				<Tex px={size.label} display={false} tex={`\\vartheta=${theta.toFixed(4)}`} />
			</At>
			<At x={x - 250} y={y2 - 24} w={220} style={{textAlign: 'right', opacity: exponent}}>
				<MixedLine px={size.small} parts={['exponent']} />
			</At>
			{[
				{v: 0.9, tex: '0.9', ink: 'pencil' as const},
				{v: 11 / 12, tex: '\\tfrac{11}{12}', ink: 'cobalt' as const},
				{v: 1, tex: '1', ink: 'pencil' as const},
			].map((t) => (
				<At key={t.v} x={ex(t.v) - 60} y={y2 + 22} w={120} style={{textAlign: 'center', opacity: exponent}}>
					<Tex px={size.label} display={false} ink={t.ink} tex={t.tex} />
				</At>
			))}
			<At x={ex(e) - 200} y={y2 - 80} w={400} style={{textAlign: 'center', opacity: exponent}}>
				<Tex px={size.label} display={false} tex={`\\tfrac{11}{12}+\\tfrac{5\\vartheta}{12}=${e.toFixed(4)}`} />
			</At>
			<At x={ex(11 / 12)} y={y2 + 84} w={ex(1) - ex(11 / 12) + 260} style={{opacity: saving}}>
				<MixedLine ink="cobalt" px={size.small} parts={['saved: a factor ', {tex: 'D^{1/12-\\varepsilon}', ink: 'cobalt'}]} />
			</At>
		</>
	);
};
