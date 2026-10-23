import React from 'react';
import {Tex} from '../design/Tex';
import {alpha, color, size, stroke} from '../design/tokens';

// The bootstrap as two terraces over the sigma axis. Each slab spans the
// zero-free range [sigma, 1] it establishes (gilt hatch: claimed); the second
// rests on the first. Heights are schematic; the sigma positions are exact.

export type TerraceProps = {
	x: number;
	y: number; // the sigma axis
	w: number;
	sigma: [number, number];
	slab: number; // slab height
	first: number; // Part I slab draw-on
	second: number; // Part II slab, 0 = above, 1 = landed
	secondDrop?: number; // pixels the Part II slab falls through while landing
	ticks: {sigma: number; tex: string; p: number}[];
	supposed?: {sigma: number; p: number}; // a supposed beta_*, ember
	gap?: number; // the bracket 7/8 .. 11/12 under the overhang
	foothold?: number; // light on the contact between the slabs
};

export const Terrace: React.FC<TerraceProps> = ({x, y, w, sigma, slab, first, second, secondDrop = 120, ticks, supposed, gap = 0, foothold = 0}) => {
	const sx = (s: number) => x + ((s - sigma[0]) / (sigma[1] - sigma[0])) * w;
	const one = sx(1);
	const a = sx(11 / 12);
	const b = sx(7 / 8);
	const drop = (1 - second) * secondDrop;
	const slabRect = (left: number, top: number, p: number, id: string) => (
		<g opacity={p}>
			<rect x={left} y={top} width={one - left} height={slab} fill={`url(#terrace-hatch-${id})`} opacity={0.32} />
			<rect x={left} y={top} width={one - left} height={slab} fill="none" stroke={alpha('gilt', 0.5)} strokeWidth={stroke.hair} />
			<line x1={left} x2={left} y1={top + slab} y2={top + slab - slab * Math.min(1, p * 1.4)} stroke={color.gilt} strokeWidth={stroke.frontier} strokeLinecap="round" style={{filter: `drop-shadow(0 0 10px ${alpha('gilt', 0.6)})`}} />
		</g>
	);
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
				<defs>
					{['a', 'b'].map((id) => (
						<pattern key={id} id={`terrace-hatch-${id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
							<line x1="0" y1="0" x2="0" y2="14" stroke={color.gilt} strokeWidth="2" />
						</pattern>
					))}
				</defs>
				<line x1={x} x2={x + w} y1={y} y2={y} stroke={color.mist} strokeWidth={stroke.line} />
				{ticks.map((t) => (
					<line key={t.sigma} x1={sx(t.sigma)} x2={sx(t.sigma)} y1={y} y2={y + 12} stroke={color.mist} strokeWidth={stroke.line} opacity={t.p} />
				))}
				{slabRect(a, y - slab, first, 'a')}
				{second > 0 && slabRect(b, y - 2 * slab - drop, Math.min(1, second * 2), 'b')}
				{foothold > 0 && (
					<line x1={a} x2={one} y1={y - slab} y2={y - slab} stroke={color.paper} strokeWidth={stroke.bold} opacity={foothold} style={{filter: `drop-shadow(0 0 8px ${alpha('paper', 0.7)})`}} />
				)}
				{supposed && supposed.p > 0 && (
					<line x1={sx(supposed.sigma)} x2={sx(supposed.sigma)} y1={y} y2={y - slab} stroke={color.ember} strokeWidth={stroke.line} strokeDasharray="7 7" opacity={supposed.p} />
				)}
				{gap > 0 && (
					<g opacity={gap}>
						<line x1={b} x2={a} y1={y - 26} y2={y - 26} stroke={color.mist} strokeWidth={stroke.line} />
						<line x1={b} x2={b} y1={y - 36} y2={y - 16} stroke={color.mist} strokeWidth={stroke.line} />
						<line x1={a} x2={a} y1={y - 36} y2={y - 16} stroke={color.mist} strokeWidth={stroke.line} />
					</g>
				)}
			</svg>
			{ticks.map((t) => (
				<div key={t.sigma} style={{position: 'absolute', left: sx(t.sigma), top: y + 18, transform: 'translateX(-50%)', opacity: t.p}}>
					<Tex tex={t.tex} px={size.label} ink="mist" display={false} />
				</div>
			))}
			{supposed && (
				<div style={{position: 'absolute', left: sx(supposed.sigma) + 10, top: y - slab + 6, opacity: supposed.p}}>
					<Tex tex={'\\beta_*'} px={size.label} ink="ember" display={false} />
				</div>
			)}
		</>
	);
};

export const terraceX = (x: number, w: number, sigma: [number, number]) => (s: number) => x + ((s - sigma[0]) / (sigma[1] - sigma[0])) * w;
