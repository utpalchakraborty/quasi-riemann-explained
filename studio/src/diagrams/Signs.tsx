import React from 'react';
import numerics from '../data/numerics.json';
import {alpha, color, font, size, stroke} from '../design/tokens';

// The Möbius signs as marks on a baseline: +1 a filled dot above, −1 a hollow
// dot below, 0 a short tick on the line. Color is verdigris (arithmetic); the
// sign is carried by shape and position, never by color alone.

const MU = numerics.mobius as number[];

type Props = {
	x: number;
	y: number; // baseline
	count: number;
	cell: number;
	p?: number; // reveal progress, left to right
	labels?: boolean;
	lift?: number; // vertical offset of dots
	highlight?: number[]; // n values to ring in gilt
	labelEvery?: number; // label n = 1 and every k-th n
};

export const Signs: React.FC<Props> = ({x, y, count, cell, p = 1, labels = true, lift = 30, highlight = [], labelEvery = 1}) => (
	<>
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<line x1={x - cell * 0.5} x2={x + cell * (count - 0.5) * Math.min(1, p * 1.05)} y1={y} y2={y} stroke={alpha('mist', 0.6)} strokeWidth={stroke.hair} opacity={p > 0 ? 1 : 0} />
			{Array.from({length: count}, (_, i) => {
				const n = i + 1;
				const m = MU[i];
				const op = Math.max(0, Math.min(1, p * count - i));
				if (op <= 0) return null;
				const cx = x + cell * i;
				const ring = highlight.includes(n);
				return (
					<g key={n} opacity={op}>
						{m === 0 ? (
							<line x1={cx} x2={cx} y1={y - 8} y2={y + 8} stroke={color.mist} strokeWidth={stroke.line} />
						) : (
							<circle
								cx={cx}
								cy={y - m * lift}
								r={9}
								fill={m > 0 ? color.verdigris : 'none'}
								stroke={color.verdigris}
								strokeWidth={stroke.line}
							/>
						)}
						{m !== 0 && <line x1={cx} x2={cx} y1={y} y2={y - m * (lift - 9)} stroke={alpha('verdigris', 0.45)} strokeWidth={stroke.hair} />}
						{ring && <circle cx={cx} cy={m === 0 ? y : y - m * lift} r={17} fill="none" stroke={color.gilt} strokeWidth={stroke.line} />}
					</g>
				);
			})}
		</svg>
		{labels &&
			Array.from({length: count}, (_, i) => {
				const op = Math.max(0, Math.min(1, p * count - i));
				if (i > 0 && (i + 1) % labelEvery !== 0) return null;
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
							color: color.mist,
							opacity: op,
							fontVariantNumeric: 'tabular-nums',
						}}
					>
						{i + 1}
					</div>
				);
			})}
	</>
);
