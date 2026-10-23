import React from 'react';
import {Tex} from '../design/Tex';
import {alpha, color, font, Ink, size, stroke} from '../design/tokens';

// The survey map of the critical strip: sigma runs right, height t runs up.
// Zero-free territory is hatched, as charted ground is on a map.

export type Frontier = {
	sigma: number;
	ink: Ink;
	label?: string; // TeX
	labelOffset?: [number, number];
	p: number; // draw progress
	hatch?: number; // hatch opacity progress, 0 = none
};

export type StripMapProps = {
	x: number;
	y: number;
	w: number;
	h: number;
	sigma: [number, number];
	t: [number, number];
	log?: boolean;
	axes?: number;
	strip?: number;
	criticalLine?: number;
	zeros?: {heights: number[]; p: number; lit?: number; r?: number; halo?: boolean};
	classical?: {c: number; p: number; hatch?: number; tMin?: number};
	// Further proven regions, each as its width 1 - sigma at height t.
	regions?: {width: (t: number) => number; p: number; hatch?: number; dash?: string; tMin?: number}[];
	edge?: number; // emphasis on the line sigma = 1 (0..1)
	frontiers?: Frontier[];
	sigmaTicks?: {sigma: number; tex: string}[];
	tTicks?: number[];
	tTickTex?: (v: number) => string; // typeset tick labels, e.g. powers of ten
	axisNames?: boolean;
	id: string;
};

export const StripMap: React.FC<StripMapProps> = ({
	x,
	y,
	w,
	h,
	sigma,
	t,
	log = false,
	axes = 1,
	strip = 1,
	criticalLine = 1,
	zeros,
	classical,
	regions = [],
	edge = 0,
	frontiers = [],
	sigmaTicks = [
		{sigma: 0, tex: '0'},
		{sigma: 0.5, tex: '\\tfrac12'},
		{sigma: 1, tex: '1'},
	],
	tTicks = [],
	tTickTex,
	axisNames = true,
	id,
}) => {
	const sx = (s: number) => ((s - sigma[0]) / (sigma[1] - sigma[0])) * w;
	const ty = (v: number) => {
		const [a, b] = log ? [Math.log(t[0]), Math.log(t[1])] : t;
		const u = log ? Math.log(Math.max(v, 1e-9)) : v;
		return h - ((u - a) / (b - a)) * h;
	};

	// A proven region: sigma > 1 - width(t), sampled up the visible heights.
	const regionPath = (width: (t: number) => number, tMinIn = 9) => {
		const tMin = Math.max(tMinIn, t[0]);
		const n = 200;
		const pts: [number, number][] = [];
		for (let i = 0; i <= n; i++) {
			const tv = log ? tMin * Math.pow(t[1] / tMin, i / n) : tMin + ((t[1] - tMin) * i) / n;
			pts.push([sx(1 - width(tv)), ty(tv)]);
		}
		const edgePath = 'M' + pts.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join('L');
		const region = `${edgePath}L${sx(1).toFixed(1)},${ty(t[1]).toFixed(1)}L${sx(1).toFixed(1)},${ty(tMin).toFixed(1)}Z`;
		return {edge: edgePath, region};
	};
	const allRegions = [
		...(classical ? [{width: (tv: number) => classical.c / Math.log(tv), p: classical.p, hatch: classical.hatch, tMin: classical.tMin, dash: undefined}] : []),
		...regions,
	].map((r) => ({...r, path: regionPath(r.width, r.tMin)}));
	const visibleZeros = zeros ? zeros.heights.filter((v) => v >= t[0] && v <= t[1]) : [];

	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
			<svg width={w} height={h} style={{overflow: 'visible', position: 'absolute'}}>
				<defs>
					<pattern id={`hatch-gilt-${id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
						<line x1="0" y1="0" x2="0" y2="14" stroke={color.gilt} strokeWidth="2" />
					</pattern>
					<pattern id={`hatch-mist-${id}`} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
						<line x1="0" y1="0" x2="0" y2="14" stroke={color.mist} strokeWidth="1.5" />
					</pattern>
					<clipPath id={`clip-${id}`}>
						<rect x={0} y={0} width={w} height={h} />
					</clipPath>
				</defs>

				<g clipPath={`url(#clip-${id})`}>
					{/* the critical strip */}
					<rect x={sx(0)} y={0} width={sx(1) - sx(0)} height={h} fill={alpha('fieldLift', 0.55 * strip)} />

					{/* proven zero-free territory, hugging sigma = 1 */}
					{allRegions.map((r, i) => (
						<g key={i}>
							<path d={r.path.region} fill={`url(#hatch-mist-${id})`} opacity={0.35 * (r.hatch ?? r.p)} />
							<path
								d={r.path.edge}
								fill="none"
								stroke={color.mist}
								strokeWidth={stroke.line}
								strokeDasharray={r.dash}
								opacity={Math.min(1, r.p * 4)}
								style={r.dash ? undefined : {strokeDasharray: 4000, strokeDashoffset: 4000 * (1 - r.p)}}
							/>
						</g>
					))}
					{edge > 0 && (
						<line x1={sx(1)} x2={sx(1)} y1={0} y2={h} stroke={color.paper} strokeWidth={stroke.bold} opacity={edge} style={{filter: `drop-shadow(0 0 8px ${alpha('paper', 0.5)})`}} />
					)}

					{/* claimed fixed frontiers */}
					{frontiers.map((f, i) =>
						f.p <= 0 && (f.hatch ?? 0) <= 0 ? null : (
						<g key={i}>
							{(f.hatch ?? 0) > 0 && (
								<rect
									x={sx(f.sigma)}
									y={0}
									width={Math.max(0, sx(1) - sx(f.sigma))}
									height={h}
									fill={`url(#hatch-gilt-${id})`}
									opacity={0.28 * (f.hatch ?? 0)}
								/>
							)}
							<line
								x1={sx(f.sigma)}
								x2={sx(f.sigma)}
								y1={h}
								y2={h * (1 - f.p)}
								stroke={color[f.ink]}
								strokeWidth={stroke.frontier}
								strokeLinecap="round"
								style={{filter: `drop-shadow(0 0 10px ${alpha(f.ink, 0.6)})`}}
							/>
						</g>
						),
					)}

					{/* the critical line */}
					<line
						x1={sx(0.5)}
						x2={sx(0.5)}
						y1={0}
						y2={h}
						stroke={color.mist}
						strokeWidth={stroke.hair}
						strokeDasharray="6 10"
						opacity={criticalLine}
					/>

					{/* zeros, revealed upward */}
					{visibleZeros.map((v, i) => {
						const k = zeros!.p * visibleZeros.length - i;
						const op = Math.max(0, Math.min(1, k));
						if (op <= 0) return null;
						return (
							<g key={v} opacity={op}>
								{(zeros!.halo ?? true) && <circle cx={sx(0.5)} cy={ty(v)} r={14} fill={alpha('paper', 0.12 * (zeros!.lit ?? 1))} />}
								<circle cx={sx(0.5)} cy={ty(v)} r={zeros!.r ?? 6.5} fill={color.paper} />
							</g>
						);
					})}
				</g>

				{/* axes */}
				<g opacity={axes}>
					<line x1={0} x2={w} y1={h} y2={h} stroke={color.mist} strokeWidth={stroke.line} />
					{sx(0) >= 0 && sx(0) <= w && <line x1={sx(0)} x2={sx(0)} y1={0} y2={h} stroke={alpha('mist', 0.6)} strokeWidth={stroke.hair} />}
					{sx(1) >= 0 && sx(1) <= w && <line x1={sx(1)} x2={sx(1)} y1={0} y2={h} stroke={alpha('mist', 0.6)} strokeWidth={stroke.hair} />}
					{sigmaTicks.map((tk) => (
						<line key={tk.sigma} x1={sx(tk.sigma)} x2={sx(tk.sigma)} y1={h} y2={h + 12} stroke={color.mist} strokeWidth={stroke.line} />
					))}
				</g>
			</svg>

			{/* tick labels and frontier labels as typeset math */}
			{sigmaTicks.map((tk) => (
				<div
					key={tk.sigma}
					style={{position: 'absolute', left: sx(tk.sigma), top: h + 18, transform: 'translateX(-50%)', opacity: axes}}
				>
					<Tex tex={tk.tex} px={size.label} ink="mist" display={false} />
				</div>
			))}
			{tTicks.map((tv) => {
				const yy = ty(tv);
				if (yy < -4 || yy > h + 4) return null;
				return (
					<div
						key={tv}
						style={{
							position: 'absolute',
							right: w - sx(sigma[0]) + 16,
							top: yy - size.small * 0.75,
							fontFamily: font.text,
							fontSize: size.small,
							color: color.mist,
							opacity: axes,
							whiteSpace: 'nowrap',
						}}
					>
						{tTickTex ? <Tex tex={tTickTex(tv)} px={size.small} ink="mist" display={false} /> : tv.toLocaleString('en-US')}
					</div>
				);
			})}
			{axisNames && (
				<>
					<div style={{position: 'absolute', left: w + 22, top: h - size.label * 0.8, opacity: axes}}>
						<Tex tex={'\\sigma'} px={size.label} ink="mist" display={false} />
					</div>
					<div style={{position: 'absolute', left: sx(sigma[0]) - 12, top: -size.label * 2.4, transform: 'translateX(-100%)', opacity: axes}}>
						<Tex tex={'t'} px={size.label} ink="mist" display={false} />
					</div>
				</>
			)}
			{frontiers
				.filter((f) => f.label)
				.map((f, i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: sx(f.sigma) + (f.labelOffset?.[0] ?? 0),
							top: -size.lead * 2.05 + (f.labelOffset?.[1] ?? 0),
							transform: 'translateX(-50%)',
							opacity: f.p,
						}}
					>
						<Tex tex={f.label!} px={size.lead} ink={f.ink} display={false} />
					</div>
				))}
		</div>
	);
};
