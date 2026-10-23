import {contours} from 'd3-contour';
import React, {useMemo} from 'react';
import numerics from '../data/numerics.json';
import {alpha, color, stroke} from '../design/tokens';

// A topographic survey of log|zeta(sigma + i t)| from computed values. Each
// contour level is a sheet; tilted, the sheets stack into a relief and the
// zeros show as wells that pierce every sheet.

const L = numerics.landscape as {sigma: number[]; t: number[]; abs_zeta: number[][]};
const NS = L.sigma.length;
const NT = L.t.length;
const FLOOR = -3;
const values = L.abs_zeta.flatMap((row) => row.map((v) => Math.max(FLOOR, Math.log(v))));
export const TOPO_LEVELS = Array.from({length: 19}, (_, i) => -2.75 + i * 0.25); // -2.75 .. 1.75
const generator = contours().size([NS, NT]).thresholds(TOPO_LEVELS).smooth(true);
const all = generator(values);

type Props = {
	x: number;
	y: number;
	w: number;
	h: number;
	t?: [number, number]; // visible heights, within 8..40
	tilt?: number; // 0 flat map, 1 full relief
	lines?: number; // contour reveal
	fill?: number; // sheet fill opacity progress
	turn?: number; // degrees of rotation about the vertical axis
	zeros?: number;
	frontier?: {sigma: number; p: number; hatch: number};
};

const zeroHeights = (numerics.zeta_zero_heights as number[]).filter((v) => v < 40);

export const Topo: React.FC<Props> = ({x, y, w, h, t = [8, 40], tilt = 0, lines = 1, fill = 0, turn = 0, zeros = 0, frontier}) => {
	const sx = (gi: number) => (gi / (NS - 1)) * w;
	// rows map to heights; only the requested window is shown
	const tOfRow = (gj: number) => L.t[0] + (gj / (NT - 1)) * (L.t[NT - 1] - L.t[0]);
	const ty = (tv: number) => h - ((tv - t[0]) / (t[1] - t[0])) * h;
	const paths = useMemo(
		() =>
			all.map((level) =>
				level.coordinates
					.map((poly) =>
						poly
							.map((ring) => 'M' + ring.map(([gi, gj]) => `${sx(gi).toFixed(1)},${ty(tOfRow(gj)).toFixed(1)}`).join('L') + 'Z')
							.join(''),
					)
					.join(''),
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[w, h, t[0], t[1]],
	);
	const sigmaX = (s: number) => ((s - L.sigma[0]) / (L.sigma[NS - 1] - L.sigma[0])) * w;
	const dz = 26 * tilt;
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, height: h, perspective: 2400, perspectiveOrigin: '50% 30%'}}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					transformStyle: 'preserve-3d',
					transform: `rotateX(${tilt * 58}deg) rotateZ(${turn}deg)`,
					transformOrigin: '50% 60%',
				}}
			>
				{paths.map((d, i) => {
					const level = TOPO_LEVELS[i];
					const index = Math.abs(level - Math.round(level)) < 1e-6;
					return (
						<svg
							key={i}
							width={w}
							height={h}
							style={{position: 'absolute', left: 0, top: 0, overflow: 'hidden', transform: `translateZ(${(i + 1) * dz}px)`}}
						>
							<path
								d={d}
								fill={alpha('fieldLift', 0.16 * fill)}
								stroke={index ? color.paper : color.mist}
								strokeOpacity={(index ? 0.9 : 0.45) * lines}
								strokeWidth={index ? stroke.line : stroke.hair}
								fillRule="evenodd"
							/>
						</svg>
					);
				})}
				<svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
					<line x1={sigmaX(0.5)} x2={sigmaX(0.5)} y1={0} y2={h} stroke={color.mist} strokeWidth={stroke.hair} strokeDasharray="6 10" opacity={0.7} />
					<line x1={sigmaX(0)} x2={sigmaX(0)} y1={0} y2={h} stroke={alpha('mist', 0.5)} strokeWidth={stroke.hair} />
					<line x1={sigmaX(1)} x2={sigmaX(1)} y1={0} y2={h} stroke={alpha('mist', 0.5)} strokeWidth={stroke.hair} />
					{frontier && (
						<>
							<defs>
								<pattern id="topo-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
									<line x1="0" y1="0" x2="0" y2="14" stroke={color.gilt} strokeWidth="2" />
								</pattern>
							</defs>
							<rect x={sigmaX(frontier.sigma)} y={0} width={sigmaX(1) - sigmaX(frontier.sigma)} height={h} fill="url(#topo-hatch)" opacity={0.3 * frontier.hatch} />
							<line
								x1={sigmaX(frontier.sigma)}
								x2={sigmaX(frontier.sigma)}
								y1={h}
								y2={h * (1 - frontier.p)}
								stroke={color.gilt}
								strokeWidth={stroke.frontier}
								strokeLinecap="round"
								style={{filter: `drop-shadow(0 0 10px ${alpha('gilt', 0.6)})`}}
							/>
						</>
					)}
					{zeroHeights
						.filter((v) => v >= t[0] && v <= t[1])
						.map((v) => (
							<g key={v} opacity={zeros}>
								<circle cx={sigmaX(0.5)} cy={ty(v)} r={16} fill="none" stroke={color.paper} strokeWidth={stroke.line} />
								<circle cx={sigmaX(0.5)} cy={ty(v)} r={5} fill={color.paper} />
							</g>
						))}
				</svg>
			</div>
		</div>
	);
};
