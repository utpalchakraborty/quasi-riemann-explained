import React from 'react';
import {exposeStyle} from '../design/motion';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, color, font, Ink, ledger, size, stroke} from '../design/tokens';
import {MixedLine, Part} from './MixedLine';

// The ledger: the film's account of what the budget has bought and what is
// still owed. Ruled lines and aligned figures only, never a box. Entries are
// Plex (with typeset math through MixedLine); amounts are typeset, right-aligned
// in their own column. Inks follow their roles: the target and the budget in
// cobalt, debts in vermilion, payments in ink; rules in pencil.

export type LedgerKind = 'entry' | 'budget' | 'debt' | 'payment' | 'total' | 'note';

export type LedgerRow = {
	label: Part[];
	amount?: string; // TeX
	note?: string; // Plex words in the amount column, for amounts that are words
	kind?: LedgerKind;
	p?: number; // inked in, 0..1
	strike?: number; // a debt struck through once paid, 0..1
	light?: number; // a row lit as it is spoken, 0..1
};

const inkOf: Record<LedgerKind, Ink> = {
	entry: 'ink',
	budget: 'cobalt',
	debt: 'vermilion',
	payment: 'ink',
	total: 'ink',
	note: 'pencil',
};

type Props = {
	x: number;
	y: number; // top of the first row's text
	w: number;
	amountW?: number; // width of the amount column
	rows: LedgerRow[];
	heading?: {label: string; amount?: string; p?: number};
	px?: number;
	rowH?: number;
	rules?: number; // rule opacity, 0..1
};

export const Ledger: React.FC<Props> = ({x, y, w, amountW = 360, rows, heading, px = size.label, rowH = ledger.row * 1.25, rules = 1}) => {
	const top = heading ? y + rowH : y;
	const lineY = (i: number) => top + (i + 1) * rowH - 10;
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
				{/* the money column's two vertical rules, as a ledger page has */}
				<g opacity={rules}>
					<line x1={x + w - amountW - 18} x2={x + w - amountW - 18} y1={y - 8} y2={lineY(rows.length - 1) + 4} stroke={alpha('pencil', 0.45)} strokeWidth={stroke.hair} />
					<line x1={x + w - amountW - 24} x2={x + w - amountW - 24} y1={y - 8} y2={lineY(rows.length - 1) + 4} stroke={alpha('pencil', 0.45)} strokeWidth={stroke.hair} />
					{heading && <line x1={x} x2={x + w} y1={y + rowH - 12} y2={y + rowH - 12} stroke={alpha('pencil', 0.8)} strokeWidth={stroke.line} opacity={heading.p ?? 1} />}
				</g>
				{rows.map((r, i) => {
					const p = r.p ?? 1;
					const yy = lineY(i);
					const kind = r.kind ?? 'entry';
					return (
						<g key={i}>
							<line x1={x} x2={x + w * Math.min(1, p * 1.4)} y1={yy} y2={yy} stroke={alpha('pencil', 0.4)} strokeWidth={ledger.rule} opacity={rules} />
							{kind === 'total' && p > 0 && (
								<>
									<line x1={x + w - amountW} x2={x + w} y1={yy - rowH - 2} y2={yy - rowH - 2} stroke={color.ink} strokeWidth={stroke.hair} opacity={p} />
									<line x1={x + w - amountW} x2={x + w} y1={yy - rowH - 2 - ledger.totalGap} y2={yy - rowH - 2 - ledger.totalGap} stroke={color.ink} strokeWidth={stroke.hair} opacity={p} />
								</>
							)}
							{(r.strike ?? 0) > 0 && (
								<line
									x1={x}
									x2={x + w * (r.strike ?? 0)}
									y1={yy - rowH * 0.42}
									y2={yy - rowH * 0.42}
									stroke={color.ink}
									strokeWidth={stroke.line}
								/>
							)}
							{(r.light ?? 0) > 0 && (
								<line x1={x - 22} x2={x - 22} y1={yy - rowH + 14} y2={yy - 6} stroke={color[inkOf[kind]]} strokeWidth={stroke.bold} opacity={r.light} />
							)}
						</g>
					);
				})}
			</svg>
			{heading && (
				<>
					<At x={x} y={y} w={w - amountW - 40} style={{...exposeStyle(heading.p ?? 1)}}>
						<div style={{fontFamily: font.text, fontSize: px * 0.86, letterSpacing: '0.08em', textTransform: 'uppercase', color: color.pencil}}>{heading.label}</div>
					</At>
					{heading.amount && (
						<At x={x + w - amountW} y={y} w={amountW} style={{textAlign: 'right', ...exposeStyle(heading.p ?? 1)}}>
							<div style={{fontFamily: font.text, fontSize: px * 0.86, letterSpacing: '0.08em', textTransform: 'uppercase', color: color.pencil}}>{heading.amount}</div>
						</At>
					)}
				</>
			)}
			{rows.map((r, i) => {
				const p = r.p ?? 1;
				if (p <= 0) return null;
				const ink = inkOf[r.kind ?? 'entry'];
				const rowTop = top + i * rowH + (rowH - px * 1.4) / 2 - 8;
				return (
					<React.Fragment key={i}>
						<At x={x} y={rowTop} w={w - amountW - 40}>
							<MixedLine parts={r.label} px={px} ink={ink} p={p} style={{whiteSpace: 'nowrap'}} />
						</At>
						{r.amount && (
							<At x={x + w - amountW} y={rowTop - 2} w={amountW} style={{textAlign: 'right', ...exposeStyle(p)}}>
								<Tex tex={r.amount} px={px * 1.08} ink={ink} display={false} />
							</At>
						)}
						{r.note && (
							<At x={x + w - amountW} y={rowTop} w={amountW} style={{textAlign: 'right'}}>
								<MixedLine parts={[r.note]} px={px} ink={ink} p={p} italic />
							</At>
						)}
					</React.Fragment>
				);
			})}
		</>
	);
};
