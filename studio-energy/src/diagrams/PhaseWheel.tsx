import React from 'react';
import {alpha, color, stroke} from '../design/tokens';

// The six sixth roots of unity on a circle, with a pointer at the current
// phase. `angle` is in units of sixths of a turn (0 = the root 1).

type Props = {
	cx: number;
	cy: number;
	r: number;
	angle: number;
	p?: number;
	lit?: number[]; // indices 0..5 of roots to fill
};

export const PhaseWheel: React.FC<Props> = ({cx, cy, r, angle, p = 1, lit = []}) => {
	const th = (k: number) => (k * Math.PI) / 3;
	const a = th(angle);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: p}}>
			<circle cx={cx} cy={cy} r={r} fill="none" stroke={alpha('pencil', 0.5)} strokeWidth={stroke.hair} />
			<line x1={cx - r - 20} x2={cx + r + 20} y1={cy} y2={cy} stroke={alpha('pencil', 0.25)} strokeWidth={stroke.hair} />
			<line x1={cx} x2={cx} y1={cy - r - 20} y2={cy + r + 20} stroke={alpha('pencil', 0.25)} strokeWidth={stroke.hair} />
			{Array.from({length: 6}, (_, k) => (
				<circle
					key={k}
					cx={cx + r * Math.cos(th(k))}
					cy={cy - r * Math.sin(th(k))}
					r={10}
					fill={lit.includes(k) ? color.viridian : color.ground}
					stroke={color.viridian}
					strokeWidth={stroke.line}
				/>
			))}
			<line x1={cx} y1={cy} x2={cx + (r - 16) * Math.cos(a)} y2={cy - (r - 16) * Math.sin(a)} stroke={color.ink} strokeWidth={stroke.bold} strokeLinecap="round" />
			<circle cx={cx} cy={cy} r={6} fill={color.ink} />
		</svg>
	);
};
