import React from 'react';
import {exposeStyle} from '../design/motion';
import {At} from '../design/scene';
import {alpha, color, size, stroke} from '../design/tokens';
import {Bracket} from './Energy';
import {MixedLine, Part} from './MixedLine';

// The October manuscript, page by page, as its own table of contents gives
// it (paper2.pdf, page 1): the page on which each part begins. The PDF has 49
// pages. §3 deduces the theorem from the mean-square estimate (the spend is
// the one paragraph of its proof that ends at (3.2)); §§4–7 and the two
// appendices prove the estimate (the paper's §1.3, "Organization").
export const PAPER = {
	pages: 49,
	parts: [
		{key: '1', page: 1},
		{key: '2', page: 3},
		{key: '3', page: 11},
		{key: '4', page: 12},
		{key: '5', page: 18},
		{key: '6', page: 22},
		{key: '7', page: 29},
		{key: 'A', page: 35},
		{key: 'B', page: 44},
		{key: 'refs', page: 46},
	],
} as const;

const partEnd = (i: number) => (i + 1 < PAPER.parts.length ? PAPER.parts[i + 1].page : PAPER.pages + 1);

type Props = {
	x: number;
	y: number; // the strip's line
	w: number;
	p?: number; // the strip drawn on
	spend?: number; // §3 marked
	proof?: number; // §4 to the end of Appendix B bracketed
	spendLabel: Part[];
	proofLabel: Part[];
	spendLit?: number;
	proofLit?: number;
};

export const PaperStrip: React.FC<Props> = ({x, y, w, p = 1, spend = 0, proof = 0, spendLabel, proofLabel, spendLit = 0, proofLit = 0}) => {
	const px = (page: number) => x + ((page - 1) / PAPER.pages) * w;
	const s3 = PAPER.parts.findIndex((q) => q.key === '3');
	const s4 = PAPER.parts.findIndex((q) => q.key === '4');
	const refs = PAPER.parts.findIndex((q) => q.key === 'refs');
	const spendX0 = px(PAPER.parts[s3].page);
	const spendX1 = px(partEnd(s3));
	const proofX0 = px(PAPER.parts[s4].page);
	const proofX1 = px(PAPER.parts[refs].page);
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={p}>
					{/* every page a short rule, every part a tall one */}
					{Array.from({length: PAPER.pages + 1}, (_, i) => (
						<line key={i} x1={px(i + 1)} x2={px(i + 1)} y1={y - 9} y2={y + 9} stroke={alpha('pencil', 0.45)} strokeWidth={stroke.hair} />
					))}
					{PAPER.parts.map((q) => (
						<line key={q.key} x1={px(q.page)} x2={px(q.page)} y1={y - 26} y2={y + 26} stroke={alpha('pencil', 0.8)} strokeWidth={stroke.hair} />
					))}
					<line x1={x} x2={x + w * p} y1={y} y2={y} stroke={alpha('pencil', 0.8)} strokeWidth={stroke.line} />
				</g>
				{spend > 0 && <line x1={spendX0} x2={spendX0 + (spendX1 - spendX0) * spend} y1={y} y2={y} stroke={color.ink} strokeWidth={stroke.budget * 2} />}
				{proof > 0 && (
					<>
						<line x1={proofX0} x2={proofX0 + (proofX1 - proofX0) * proof} y1={y} y2={y} stroke={color.ink} strokeWidth={stroke.bold} />
						<Bracket x1={proofX0} y1={y + 52} x2={proofX0 + (proofX1 - proofX0) * proof} y2={y + 52} ink="ink" p={1} />
					</>
				)}
				{spend > 0 && <line x1={(spendX0 + spendX1) / 2} x2={(spendX0 + spendX1) / 2} y1={y - 34} y2={y - 70} stroke={alpha('ink', 0.8)} strokeWidth={stroke.hair} opacity={spend} />}
			</svg>
			{PAPER.parts.map((q, i) => (
				<At key={q.key} x={(px(q.page) + px(partEnd(i))) / 2 - 40} y={y - 62} w={80} style={{textAlign: 'center', opacity: p * (q.key === '3' ? 1 - spend : 1)}}>
					<MixedLine px={size.small} parts={[q.key === 'refs' ? 'refs' : q.key.match(/[0-9]/) ? `§${q.key}` : q.key]} />
				</At>
			))}
			<At x={(spendX0 + spendX1) / 2 - 20} y={y - 126} w={900} style={{...exposeStyle(spend)}}>
				<MixedLine px={size.label} ink="ink" parts={spendLabel} style={{opacity: 0.75 + 0.25 * spendLit}} />
			</At>
			<At x={proofX0} y={y + 70} w={proofX1 - proofX0} style={{textAlign: 'center', ...exposeStyle(proof)}}>
				<MixedLine px={size.label} ink="ink" parts={proofLabel} style={{opacity: 0.75 + 0.25 * proofLit}} />
			</At>
		</>
	);
};
