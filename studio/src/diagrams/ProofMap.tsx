import React from 'react';
import {Display, Fraction, Text} from '../design/primitives';
import {alpha, color, size, stroke} from '../design/tokens';

// The argument drawn as a survey traverse. The upper line is the logic, read
// left to right, ending at 11/12. The engine is a shaft beneath station 2: it
// supplies the energy bound that station 2 needs. A second route branches
// from the end to 7/8.

export const MAIN_STATIONS = [
	'A zero would force a pole',
	'Hide the target in a family',
	'Sixth powers make copies',
	'Count, divide, take a root',
];

export const ENGINE_STATIONS = [
	'Poisson summation',
	'Cubic Gauss sums',
	'Kubota’s cubic theta',
	'Quadratic large sieve',
	'A shrinking recursion',
];

export type ProofMapProps = {
	main: number[]; // per-station reveal progress
	engine?: number[];
	current?: number | number[]; // main index, 10 + engine index, 20 terminal, 21 branch
	terminal?: number; // the 11/12 end of the line
	branch?: number; // the 7/8 branch
	dim?: number; // fade everything not current, for chapter openers
};

const Y = 470;
const X0 = 230;
const DX = 380;
const SHAFT_TOP = Y + 110;
const SHAFT_DY = 86;
const END_X = X0 + DX * 4;

export const ProofMap: React.FC<ProofMapProps> = ({main, engine = [], current: cur = -1, terminal = 0, branch = 0, dim = 0}) => {
	const lit = new Set(Array.isArray(cur) ? cur : [cur]);
	const isLit = (k: number) => lit.has(k);
	const sx = (i: number) => X0 + DX * i;
	const reach = Math.max(0, ...main.map((p, i) => (p > 0 ? i + p : 0))) - 1;
	const lineEnd = X0 + DX * Math.max(0, Math.min(4, reach + terminal));
	const shaftReach = Math.max(0, ...engine.map((p, i) => (p > 0 ? i + p : 0)));
	const shaftEnd = SHAFT_TOP + SHAFT_DY * Math.max(0, shaftReach - 1);
	const fade = (lit: boolean) => (lit ? 1 : 1 - 0.65 * dim);
	return (
		<>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<line x1={X0} y1={Y} x2={lineEnd} y2={Y} stroke={color.paper} strokeWidth={stroke.line} opacity={fade(false)} />
				{engine.length > 0 && shaftReach > 0 && (
					<>
						<line x1={sx(1)} y1={Y + 22} x2={sx(1)} y2={shaftEnd} stroke={color.mist} strokeWidth={stroke.line} opacity={fade([10, 11, 12, 13, 14].some(isLit))} />
						{/* the bound flows up the shaft into station 2 */}
						<path d={`M${sx(1) - 9},${Y + 44} L${sx(1)},${Y + 28} L${sx(1) + 9},${Y + 44}`} fill="none" stroke={color.mist} strokeWidth={stroke.line} opacity={engine[engine.length - 1] ?? 0} />
					</>
				)}
				<path
					d={`M${END_X},${Y + 22} L${END_X},${Y + 250}`}
					stroke={color.gilt}
					strokeWidth={stroke.line}
					strokeDasharray="7 9"
					opacity={branch * fade(isLit(21))}
				/>
				{MAIN_STATIONS.map((_, i) => {
					const p = main[i] ?? 0;
					const on = isLit(i);
					return (
						<circle key={i} cx={sx(i)} cy={Y} r={15 * p} fill={on ? color.gilt : color.field} stroke={on ? color.gilt : color.paper} strokeWidth={stroke.bold} opacity={fade(on)} />
					);
				})}
				<circle cx={END_X} cy={Y} r={20 * terminal} fill={color.gilt} opacity={fade(isLit(20))} />
				{engine.map((p, i) => {
					const on = isLit(10 + i);
					return (
						<circle
							key={i}
							cx={sx(1)}
							cy={SHAFT_TOP + SHAFT_DY * i}
							r={11 * p}
							fill={on ? color.gilt : color.field}
							stroke={on ? color.gilt : color.mist}
							strokeWidth={stroke.line}
							opacity={fade(on)}
						/>
					);
				})}
			</svg>

			{MAIN_STATIONS.map((name, i) => {
				const p = main[i] ?? 0;
				const on = isLit(i);
				return (
					<div
						key={name}
						style={{
							position: 'absolute',
							left: sx(i) - 170,
							width: 340,
							bottom: 1080 - Y + 34,
							textAlign: 'center',
							opacity: fade(on),
						}}
					>
						<Display px={size.heading} ink={on ? 'gilt' : 'paper'} p={p}>
							{i + 1}
						</Display>
						<Text px={size.label} p={p} ink={on ? 'paper' : 'mist'} style={{marginTop: 14, textWrap: 'balance'}}>
							{name}
						</Text>
					</div>
				);
			})}
			{engine.map((p, i) => {
				const on = isLit(10 + i);
				return (
					<div key={i} style={{position: 'absolute', left: sx(1) + 34, top: SHAFT_TOP + SHAFT_DY * i - 20, opacity: fade(on)}}>
						<Text px={size.label} p={p} ink={on ? 'gilt' : 'mist'}>
							{ENGINE_STATIONS[i]}
						</Text>
					</div>
				);
			})}
			<div style={{position: 'absolute', left: END_X - 80, width: 160, bottom: 1080 - Y + 40, textAlign: 'center', opacity: fade(isLit(20))}}>
				<Fraction n="11" d="12" px={size.heading} p={terminal} />
			</div>
			<div style={{position: 'absolute', left: END_X - 80, width: 160, top: Y + 262, textAlign: 'center', opacity: fade(isLit(21))}}>
				<Fraction n="7" d="8" px={size.heading} p={branch} />
				<Text px={size.small} ink="mist" p={branch} style={{marginTop: 18, width: 300, marginLeft: -70}}>
					a second route, September
				</Text>
			</div>
		</>
	);
};
