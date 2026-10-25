import React from 'react';
import {alpha, color, stroke} from '../design/tokens';

// The completed sum as a table: one line of dots per row h, one dot per
// column index. Squarefree indices n are viridian (the family B_h has only
// these); completion makes room for the indices n·b^3 the theta function also
// contains, first as dashed ghosts (what the transformation law wants), then
// as vermilion dots (borrowed). The theta transformation then folds each long
// row into a short dual row of ink dots, whose length grows like N(h)^2 / X:
// rows with larger h get longer dual sums. Schematic: counts, spacing and
// the norms of the rows are illustrative. A local variant of IndexRow, with
// rows and a debt ink for the inserted terms.

type Props = {
	x: number; // left end of the long rows
	y: number; // first row's centre line
	w: number; // long rows' width
	rows?: number;
	rowGap?: number;
	p?: number; // squarefree columns drawn left to right
	room?: number; // the columns make room; ghosts of n·b^3 appear
	fill?: number; // ghosts inked in as borrowed terms
	fold?: number; // long rows fold into short dual rows
	dualW?: number; // width of the longest dual row
};

const BASE = 22;
const AFTER = [2, 6, 9, 13, 16, 20]; // base positions followed by an inserted n·b^3
const DUAL_MAX = 12; // dots in the longest dual row
const R = 6.5; // dot radius

type Item = {kind: 'n' | 'b'; base: number};
const LAYOUT: Item[] = (() => {
	const items: Item[] = [];
	for (let i = 0; i < BASE; i++) {
		items.push({kind: 'n', base: i});
		if (AFTER.includes(i)) items.push({kind: 'b', base: i + 0.5});
	}
	return items;
})();
const M = LAYOUT.length;

// Row r stands for a row h with N(h) proportional to (r + 1) / rows; its dual
// sum runs over N(m) << N(h)^2 / X, so its length goes as the square.
export const dualCount = (r: number, rows: number): number => Math.max(1, Math.round(DUAL_MAX * ((r + 1) / rows) ** 2));

// Screen x of item j once the row has made room.
const roomX = (x: number, w: number, j: number) => x + (j / (M - 1)) * w;
const baseX = (x: number, w: number, base: number) => x + (base / (BASE - 1)) * w;
const dualX = (x: number, dualW: number, c: number) => x + (c / (DUAL_MAX - 1)) * dualW;

// Screen x of the k-th inserted n·b^3 column after the row has made room, for labels.
export const cubeColumnX = (x: number, w: number, k: number): number => {
	let seen = -1;
	for (let j = 0; j < M; j++) if (LAYOUT[j].kind === 'b' && ++seen === k) return roomX(x, w, j);
	return x + w;
};

export const ThetaColumns: React.FC<Props> = ({x, y, w, rows = 5, rowGap = 50, p = 1, room = 0, fill = 0, fold = 0, dualW = 360}) => {
	const lineOp = Math.min(1, p * 3);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			{Array.from({length: rows}, (_, r) => {
				const yy = y + r * rowGap;
				const count = dualCount(r, rows);
				const dualEnd = dualX(x, dualW, count - 1);
				return (
					<g key={r}>
						<line x1={x - 18} x2={x + w + 18} y1={yy} y2={yy} stroke={alpha('pencil', 0.4)} strokeWidth={stroke.hair} opacity={lineOp * (1 - fold)} />
						{fold > 0 && <line x1={x - 18} x2={dualEnd + 18} y1={yy} y2={yy} stroke={alpha('pencil', 0.45)} strokeWidth={stroke.hair} opacity={fold} />}
						{LAYOUT.map((it, j) => {
							const x0 = baseX(x, w, it.base);
							const x1 = roomX(x, w, j);
							const px0 = x0 + (x1 - x0) * room;
							// each long-row term folds onto the dual term it feeds
							const target = dualX(x, dualW, Math.min(count - 1, Math.floor((j / M) * count)));
							const cx = px0 + (target - px0) * fold;
							const shown = Math.max(0, Math.min(1, p * BASE - it.base));
							const op = (it.kind === 'n' ? shown : room) * (1 - fold);
							if (op <= 0.001) return null;
							if (it.kind === 'n') return <circle key={j} cx={cx} cy={yy} r={R} fill={color.viridian} opacity={op} />;
							return (
								<g key={j} opacity={op}>
									<circle cx={cx} cy={yy} r={R + 1} fill={color.ground} stroke={color.ink} strokeWidth={stroke.line} strokeDasharray="3.5 3" opacity={(1 - fill) * 0.85} />
									<circle cx={cx} cy={yy} r={R} fill={color.vermilion} opacity={fill} />
								</g>
							);
						})}
						{fold > 0 &&
							Array.from({length: count}, (_, c) => (
								<circle key={`d${c}`} cx={dualX(x, dualW, c)} cy={yy} r={R + 1.5} fill={color.ink} opacity={Math.max(0, fold * 2 - 1)} />
							))}
					</g>
				);
			})}
		</svg>
	);
};

// Right end of row r's dual sum, for labels.
export const dualEndX = (x: number, dualW: number, r: number, rows = 5): number => dualX(x, dualW, dualCount(r, rows) - 1);
