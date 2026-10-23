import React from 'react';
import {alpha, color, font, size, stroke} from '../design/tokens';
import {residueRow} from './frontierData';

// The numbers 1..n modulo a prime p: filled where n is a square mod p,
// hollow where it is not (computed with Euler's criterion). A cursor scans
// from 1 and stops on the first non-square, which is lit in gilt.

type Props = {
	p: number;
	n: number;
	x: number;
	y: number; // centre line of the marks
	cell: number;
	r: number;
	reveal: number; // 0..1, left to right
	scan: number; // 0..1, cursor travel from 1 to the first non-square
	labels: (k: number) => boolean; // which numbers to print
	labelPx?: number;
	tint?: number; // 0: neutral rings only, 1: squares filled, non-squares hollow
};

export const Residues: React.FC<Props> = ({p, n, x, y, cell, r, reveal, scan, labels, labelPx = size.small, tint = 1}) => {
	const row = residueRow(p, n);
	const first = row.indexOf(false); // index of the first non-square
	const cx = (i: number) => x + cell * (i + 0.5);
	const at = scan > 0 ? scan * first : -1;
	const found = scan >= 1;
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				{row.map((sq, i) => {
					const op = Math.max(0, Math.min(1, reveal * n * 1.2 - i));
					if (op <= 0) return null;
					const lit = found && i === first;
					return (
						<g key={i}>
							{tint < 1 && <circle cx={cx(i)} cy={y} r={r} fill="none" stroke={color.mist} strokeWidth={stroke.line} opacity={op * (1 - tint)} />}
							<circle
								cx={cx(i)}
								cy={y}
								r={r}
								fill={sq ? color.verdigris : lit ? alpha('gilt', 0.25) : 'none'}
								stroke={lit ? color.gilt : color.verdigris}
								strokeWidth={lit ? stroke.bold : stroke.line}
								opacity={op * tint * (scan > 0 && scan < 1 && i > at + 0.5 ? 0.45 : 1)}
							/>
						</g>
					);
				})}
				{scan > 0 && (
					<circle cx={cx(at)} cy={y} r={r + 9} fill="none" stroke={color.gilt} strokeWidth={stroke.line} opacity={found ? 0.9 : 1} />
				)}
			</svg>
			{row.map((_, i) =>
				labels(i + 1) ? (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: cx(i) - 30,
							top: y + r + 14,
							width: 60,
							textAlign: 'center',
							fontFamily: font.text,
							fontSize: labelPx,
							color: found && i === first ? color.gilt : color.mist,
							opacity: Math.max(0, Math.min(1, reveal * n * 1.2 - i)),
							fontVariantNumeric: 'tabular-nums',
						}}
					>
						{i + 1}
					</div>
				) : null,
			)}
		</>
	);
};

export const firstNonSquareIndex = (p: number, n: number) => residueRow(p, n).indexOf(false);
