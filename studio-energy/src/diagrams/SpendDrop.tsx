import React from 'react';
import {lerp} from '../design/motion';
import {seeded} from '../design/scene';
import {alpha, color, ease, stroke} from '../design/tokens';
import {Frame, shelfPack, Square, useHatch} from './Area';

// Chapter 4, dropping rows. A schematic family packed inside its budget frame:
// one square per row, side |A_u(D)|, and J of them (cobalt) the copies
// u = p^6, all about the size of the target. Beside it the same squares
// stacked by area into a column. Dropping a row removes its strip; since every
// strip has nonnegative height, the stack can only go down. Schematic: sizes
// are illustrative, never computed.

const ROWS = 44;
const COPY_SIDE = 58;
const COPY_AT = [3, 9, 15, 22, 28, 34, 40];
export const DROP_J = COPY_AT.length;
const SIDES = Array.from({length: ROWS}, (_, i) => (COPY_AT.includes(i) ? COPY_SIDE : Math.round(18 + 70 * seeded(i, 3) ** 1.6)));
const isCopy = (i: number) => COPY_AT.includes(i);

export const DROP_PACK_W = 600;
const PAD = 18;
const PACK = shelfPack(SIDES, DROP_PACK_W, 12, true);
export const DROP_FRAME = {w: DROP_PACK_W + 2 * PAD, h: PACK.height + 2 * PAD};
const AREA = SIDES.reduce((s, x) => s + x * x, 0);
const KEPT = COPY_AT.reduce((s, i) => s + SIDES[i] ** 2, 0);
export const DROP_SHARE = KEPT / AREA;

type Props = {
	x: number; // frame top-left
	y: number;
	colX: number; // the column's left edge; its baseline is the frame's bottom
	colW: number;
	row: {x: number; y: number; gap: number}; // where the copies are lifted to
	frameP?: number;
	fill?: number; // squares inked in
	copies?: number; // the copies lit
	drop?: number; // the other rows dropped to ghosts
	lift?: number; // the copies lifted out of the frame
	column?: number; // squares stacked into the column
	collapse?: number; // dropped strips removed from the column
	levels?: number; // the whole and the kept part marked on the column
	pulse?: number; // every square's outline, ghosts included, drawn up for a moment
};

export const DropFrame: React.FC<Props> = ({x, y, colX, colW, row, frameP = 1, fill = 1, copies = 0, drop = 0, lift = 0, column = 0, collapse = 0, levels = 0, pulse = 0}) => {
	const ink = useHatch('ink', 'light', 0.55);
	const cob = useHatch('cobalt', 'medium', 0.9);
	const base = y + DROP_FRAME.h;
	const scale = DROP_FRAME.h / AREA; // column height per unit of area
	const t = ease.inOut(Math.max(0, Math.min(1, lift)));
	let stack = base;
	let order = 0;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				{ink.defs}
				{cob.defs}
			</defs>
			<Frame x={x} y={y} w={DROP_FRAME.w} h={DROP_FRAME.h} p={frameP} />
			{PACK.placed.map((q) => {
				const appear = Math.max(0, Math.min(1, fill * (ROWS + 6) - q.i));
				if (appear <= 0) return null;
				const sx = x + PAD + q.x;
				const sy = y + PAD + q.y;
				if (isCopy(q.i)) {
					const k = COPY_AT.indexOf(q.i);
					const tx = row.x + k * (COPY_SIDE + row.gap);
					return (
						<g key={q.i}>
							{lift > 0 && <Square x={sx} y={sy} side={q.side} ink="pencil" width={stroke.hair} dash="4 6" opacity={0.7 * t} />}
							<Square
								x={lerp(sx, tx, t)}
								y={lerp(sy, row.y, t)}
								side={q.side}
								ink={copies > 0.5 ? 'cobalt' : 'ink'}
								fill={`url(#${copies > 0 ? cob.id : ink.id})`}
								fillP={copies > 0 ? copies : 1}
								width={stroke.line + copies}
								p={appear}
							/>
						</g>
					);
				}
				return drop >= 1 ? (
					<Square key={q.i} x={sx} y={sy} side={q.side} ink={pulse > 0.5 ? 'ink' : 'pencil'} width={stroke.hair + pulse} dash="4 6" opacity={0.75 + 0.25 * pulse} />
				) : (
					<g key={q.i}>
						<Square x={sx} y={sy} side={q.side} fill={`url(#${ink.id})`} p={appear} opacity={1 - drop} />
						{drop > 0 && <Square x={sx} y={sy} side={q.side} ink="pencil" width={stroke.hair} dash="4 6" opacity={0.75 * drop} />}
					</g>
				);
			})}
			{/* the column: strips stacked from the frame's baseline, in row order */}
			{SIDES.map((s, i) => {
				const part = Math.max(0, Math.min(1, column * ROWS - order++));
				if (part <= 0) return null;
				const keep = isCopy(i) ? 1 : 1 - collapse;
				const h = s * s * scale * part * keep;
				if (h <= 0.05) return null;
				stack -= h;
				const k = isCopy(i) && copies > 0 ? 'cobalt' : 'ink';
				return (
					<g key={`c${i}`}>
						<rect x={colX} y={stack} width={colW} height={h} fill={`url(#${k === 'cobalt' ? cob.id : ink.id})`} />
						<rect x={colX} y={stack} width={colW} height={h} fill="none" stroke={alpha(k, 0.8)} strokeWidth={stroke.hair} />
					</g>
				);
			})}
			<g opacity={levels}>
				<line x1={x + DROP_FRAME.w + 8} x2={colX + colW + 24} y1={base - DROP_FRAME.h} y2={base - DROP_FRAME.h} stroke={color.ink} strokeWidth={stroke.line} strokeDasharray="6 6" />
				<line x1={colX - 14} x2={colX + colW + 24} y1={base - DROP_FRAME.h * DROP_SHARE} y2={base - DROP_FRAME.h * DROP_SHARE} stroke={color.cobalt} strokeWidth={stroke.line} />
			</g>
			<line x1={colX - 14} x2={colX + colW + 14} y1={base} y2={base} stroke={color.pencil} strokeWidth={stroke.line} opacity={Math.min(1, column * 4)} />
		</svg>
	);
};

// Heights of the column's two levels, for labels placed by the scene.
export const dropLevels = (y: number) => ({whole: y, kept: y + DROP_FRAME.h * (1 - DROP_SHARE)});
