import React from 'react';
import {alpha, color, stroke} from '../design/tokens';

// The column indices of the sum, as a row of dots. Squarefree indices n are
// verdigris; completion inserts the indices n·b^3 (mist outlines) that the
// theta function also contains; the transformation then folds the long row
// into a short dual row. Schematic: counts and spacing are illustrative.

type Props = {
	x: number;
	y: number;
	w: number;
	p?: number; // the squarefree row, drawn left to right
	insert?: number; // the n·b^3 terms make room and appear
	fold?: number; // long row -> short dual row
	shortW?: number;
};

const BASE = 30;
const AFTER = [3, 8, 12, 17, 21, 26]; // base positions followed by an inserted n·b^3
const DUAL = 7;

const layout = (() => {
	const items: {kind: 'n' | 'b'; base: number}[] = [];
	for (let i = 0; i < BASE; i++) {
		items.push({kind: 'n', base: i});
		if (AFTER.includes(i)) items.push({kind: 'b', base: i + 0.5});
	}
	return items;
})();

export const IndexRow: React.FC<Props> = ({x, y, w, p = 1, insert = 0, fold = 0, shortW = 300}) => {
	const M = layout.length;
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<line x1={x - 20} x2={x + w + 20} y1={y} y2={y} stroke={alpha('mist', 0.4)} strokeWidth={stroke.hair} opacity={p * (1 - fold)} />
			{layout.map((it, j) => {
				const bx = x + (it.base / (BASE - 1)) * w;
				const mx = x + (j / (M - 1)) * w;
				const px0 = bx + (mx - bx) * insert;
				const c = Math.round((j / (M - 1)) * (DUAL - 1));
				const tx = x + (c / (DUAL - 1)) * shortW;
				const cx = px0 + (tx - px0) * fold;
				const shown = Math.max(0, Math.min(1, p * BASE - it.base));
				const op = (it.kind === 'n' ? shown : insert) * (1 - fold);
				if (op <= 0) return null;
				return it.kind === 'n' ? (
					<circle key={j} cx={cx} cy={y} r={9} fill={color.verdigris} opacity={op} />
				) : (
					<circle key={j} cx={cx} cy={y} r={9 * insert} fill="none" stroke={color.mist} strokeWidth={stroke.line} opacity={op} />
				);
			})}
			{fold > 0 &&
				Array.from({length: DUAL}, (_, c) => (
					<circle key={`d${c}`} cx={x + (c / (DUAL - 1)) * shortW} cy={y} r={11} fill={color.paper} opacity={Math.max(0, fold * 2 - 1)} />
				))}
			{fold > 0 && <line x1={x - 20} x2={x + shortW + 20} y1={y} y2={y} stroke={alpha('mist', 0.4)} strokeWidth={stroke.hair} opacity={fold} />}
		</svg>
	);
};

// Screen x of an inserted n·b^3 dot once the row has made room, for labels.
export const insertedX = (x: number, w: number, k = 0): number => {
	const j = layout.findIndex((it, i) => it.kind === 'b' && layout.slice(0, i + 1).filter((t) => t.kind === 'b').length === k + 1);
	return x + (j / (layout.length - 1)) * w;
};
