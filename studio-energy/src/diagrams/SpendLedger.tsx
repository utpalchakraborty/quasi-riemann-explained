import React from 'react';
import {At} from '../design/scene';
import {Tex, TexProps} from '../design/Tex';
import {color, Ink, ledger, size, stroke} from '../design/tokens';
import {Frame, Square, useHatch} from './Area';
import {Ledger, LedgerKind, LedgerRow} from './Ledger';

// Chapter 4's ledger. A local variant of Ledger whose amounts can be lit part
// by part as they are spoken: the rows are drawn by Ledger itself, and each
// amount is set on top of its row, in the same place Ledger would put it, by a
// Tex that takes `light` and `show`.

export type LitRow = Omit<LedgerRow, 'amount'> & {
	amount?: string;
	amountLight?: TexProps['light'];
	amountShow?: TexProps['show'];
};

const inkOf: Record<LedgerKind, Ink> = {entry: 'ink', budget: 'cobalt', debt: 'vermilion', payment: 'ink', total: 'ink', note: 'pencil'};

type Props = {
	x: number;
	y: number;
	w: number;
	amountW: number;
	rows: LitRow[];
	heading?: {label: string; amount?: string; p?: number};
	px?: number;
	rowH?: number;
	rules?: number;
};

export const LitLedger: React.FC<Props> = ({x, y, w, amountW, rows, heading, px = size.label, rowH = ledger.row * 1.25, rules = 1}) => {
	const top = heading ? y + rowH : y;
	return (
		<>
			<Ledger x={x} y={y} w={w} amountW={amountW} heading={heading} px={px} rowH={rowH} rules={rules} rows={rows.map(({amount: _a, amountLight: _l, amountShow: _s, ...r}) => r)} />
			{rows.map((r, i) => {
				const p = r.p ?? 1;
				if (!r.amount || p <= 0) return null;
				const rowTop = top + i * rowH + (rowH - px * 1.4) / 2 - 8;
				return (
					<At key={i} x={x + w - amountW} y={rowTop - 2} w={amountW} style={{textAlign: 'right', opacity: p, filter: p >= 1 ? undefined : `blur(${(1 - p) * 6}px)`}}>
						<Tex tex={r.amount} px={px * 1.08} ink={inkOf[r.kind ?? 'entry']} display={false} light={r.amountLight} show={r.amountShow} />
					</At>
				);
			})}
		</>
	);
};

// |a|^2 <= 2|b|^2 + 2|a - b|^2, as areas: the target's square against two
// squares of the copy and two of the error. Schematic: the copy is drawn a
// little smaller than the target and the error small, as in the spend.
type TwiceProps = {
	x: number; // left edge
	y: number; // common baseline
	unit: number; // side of the target's square
	a?: number;
	b?: number;
	e?: number;
};

export const TWICE = {copy: 0.92, error: 0.2};

export const twiceLayout = (x: number, unit: number) => {
	const B = unit * TWICE.copy;
	const E = unit * TWICE.error;
	const le = x + unit + 70; // after the target and the "at most" sign
	const plus = le + 2 * B + 14 + 30;
	return {B, E, le, plus, end: plus + 30 + 2 * E + 10};
};

export const TwiceSquares: React.FC<TwiceProps> = ({x, y, unit, a = 1, b = 0, e = 0}) => {
	const cob = useHatch('cobalt', 'medium', 0.9);
	const verm = useHatch('vermilion', 'dense', 0.9);
	const {B, E, le, plus} = twiceLayout(x, unit);
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>
					{cob.defs}
					{verm.defs}
				</defs>
				<Square x={x} y={y - unit} side={unit} ink="cobalt" fill={color.cobalt} fillP={0.22} width={stroke.bold} p={a} />
				{[0, 1].map((k) => (
					<Square key={`b${k}`} x={le + k * (B + 14)} y={y - B} side={B} ink="cobalt" fill={`url(#${cob.id})`} p={Math.max(0, Math.min(1, b * 2 - k))} />
				))}
				{[0, 1].map((k) => (
					<Square key={`e${k}`} x={plus + 30 + k * (E + 10)} y={y - E} side={E} ink="vermilion" fill={`url(#${verm.id})`} p={Math.max(0, Math.min(1, e * 2 - k))} />
				))}
			</svg>
			<At x={x + unit + 14} y={y - unit / 2 - 30} w={42} style={{textAlign: 'center', opacity: b}}>
				<Tex tex={'\\le'} px={size.math} display={false} />
			</At>
			<At x={plus - 6} y={y - unit / 2 - 30} w={42} style={{textAlign: 'center', opacity: e}}>
				<Tex tex={'+'} px={size.math} display={false} />
			</At>
		</>
	);
};

// The J copies of the target, each with its error, and then the budget's frame
// drawn round them with room to spare: their energy is part of the budget's.
// Schematic: seven copies stand for J.
export const CopiesInBudget: React.FC<{x: number; y: number; avg?: number; frame?: number}> = ({x, y, avg = 0, frame = 0}) => {
	const cob = useHatch('cobalt', 'medium', 0.9);
	const verm = useHatch('vermilion', 'dense', 0.9);
	const W = 560;
	const H = 250;
	const side = 54;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				{cob.defs}
				{verm.defs}
			</defs>
			{Array.from({length: 7}, (_, k) => {
				const a = Math.max(0, Math.min(1, avg * 8 - k));
				const sx = x + 22 + k * 76;
				const sy = y + H - 22 - side;
				return (
					<g key={k}>
						<Square x={sx} y={sy} side={side} ink="cobalt" fill={`url(#${cob.id})`} p={a} />
						<Square x={sx + side + 3} y={sy} side={11} ink="vermilion" fill={`url(#${verm.id})`} p={a} />
					</g>
				);
			})}
			<Frame x={x} y={y} w={W} h={H} p={frame} />
		</svg>
	);
};

// A ledger rule drawn in an ink, for marking a line as it is spoken.
export const Underline: React.FC<{x: number; y: number; w: number; ink?: Ink; p?: number}> = ({x, y, w, ink = 'ink', p = 1}) => (
	<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
		<line x1={x} x2={x + w * p} y1={y} y2={y} stroke={color[ink]} strokeWidth={stroke.line} opacity={p > 0 ? 1 : 0} />
	</svg>
);
