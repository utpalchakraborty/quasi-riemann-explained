import type React from 'react';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Cite, Tag, Text} from '../design/primitives';
import {At, Callout, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, size, space, stroke} from '../design/tokens';
import {EnergyBars, EnergyMeter, familySizes} from '../diagrams/EnergyBars';

// Chapter: An energy budget. Scenes are added here and listed in `scenes` by scene id.

// One frame for both scenes: the family as bars of size |A_u(D)|, the meter
// that stacks their squares, and the budget line. Schematic throughout.
const ROWS = 96;
const SIZES = familySizes(ROWS);
const BARS = {x: space.margin, y: 820, w: 1240, unit: 80};
const METER = {x: 1540, y: 820, w: 64, h: 410};
const FILL = 0.8; // the family's total, as a share of the budget
const BUDGET = SIZES.reduce((s, v) => s + v * v, 0) / FILL;
const squares = (sizes: number[]) => sizes.map((v) => v * v);
const typicalY = BARS.y - BARS.unit; // mean square of SIZES is exactly 1

// budget-outlier: one member made huge, still inside the budget.
const OUTLIER = 37;
const EXTRA = 0.12 * BUDGET; // energy the outlier adds
const OUTLIER_SIZE = Math.sqrt(SIZES[OUTLIER] ** 2 + EXTRA);
const COPIES = [13, 28, 41, 57, 68, 81, 92];
// With the outlier grown and the copies at the target's size, the total must still fit.
const FINAL = SIZES.map((v, i) => (i === OUTLIER ? OUTLIER_SIZE : COPIES.includes(i) ? SIZES[0] : v));
if (FINAL.reduce((s, v) => s + v * v, 0) > BUDGET) throw new Error('the family must stay within the budget');

const Formula: React.FC<{show?: Record<string, number>; light?: number; p?: number}> = ({show = {}, light = 0, p = 1}) => (
	<At x={space.margin} y={190} style={{opacity: p}}>
		<Tex
			px={size.math * 0.92}
			display={false}
			tex={
				'\\htmlClass{sum}{\\sum_{0<\\N(u)\\le H}|A_u(D)|^{2}}\\htmlClass{bound}{\\ \\ll\\ D^{1+\\varepsilon}H,}\\htmlClass{H}{\\qquad H=D^{1+\\vartheta}}'
			}
			show={show}
			light={{bound: {ink: 'gilt', p: light}}}
		/>
	</At>
);

const MeterLabels: React.FC<{p: number; budgetP: number}> = ({p, budgetP}) => (
	<>
		<At x={METER.x - 80} y={METER.y + 14} w={METER.w + 160} style={{textAlign: 'center', opacity: p}}>
			<Tex tex={'\\sum_u |A_u(D)|^{2}'} px={size.small} ink="mist" display={false} />
		</At>
		<At x={METER.x + METER.w + 26} y={METER.y - METER.h - 22} style={{opacity: budgetP}}>
			<Tex tex={'D^{1+\\varepsilon}H'} px={size.label} display={false} />
			<Text px={size.small} ink="mist">
				budget
			</Text>
		</At>
	</>
);

export const BudgetMS: React.FC = () => {
	const {frame: f, cue} = useCues();
	const fam = cue('budget-1', 'whole family');
	const add = cue('budget-1', 'Add up');
	const total = cue('budget-1', 'at most about');
	const hDef = cue('budget-1', 'where H');
	const theta = cue('budget-1', 'small and positive');
	const members = cue('budget-2', 'about H members');
	const typical = cue('budget-2', 'typical member');
	const root = cue('budget-2', 'square root of');
	const sqrtCancel = cue('budget-2', 'square-root cancellation');
	const filled = ROWS * progress(f, add, cue('budget-1', 'norm up to H', 'end') - add + beat * 2, ease.inOut);
	const cursor = Math.floor(filled);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The energy budget</SceneTitle>
			<Formula show={{sum: progress(f, 10), bound: progress(f, total), H: progress(f, hDef)}} light={progress(f, total + beat * 2)} />
			<At x={space.margin} y={300} style={{opacity: progress(f, theta)}}>
				<Tex tex={'0<\\vartheta\\le\\tfrac{1}{10}\\ \\text{fixed}'} px={size.label + 2} ink="mist" display={false} />
			</At>
			<Tag kind="claim" p={progress(f, total + beat * 2)} style={{position: 'absolute', left: 560, top: 306}} />

			<EnergyBars
				{...BARS}
				sizes={SIZES}
				p={progress(f, fam, beat * 4, ease.inOut)}
				ink={(i) => (filled > 0 && filled < ROWS && i === cursor ? 'paper' : null)}
			/>
			<EnergyMeter
				{...METER}
				squares={squares(SIZES)}
				budget={BUDGET}
				filled={filled}
				budgetP={progress(f, total)}
			/>
			<MeterLabels p={progress(f, add)} budgetP={progress(f, total)} />

			{/* budget-2: about H rows, each typically of size about the root of D */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={progress(f, members)}>
					<line x1={BARS.x} x2={BARS.x + BARS.w} y1={BARS.y + 22} y2={BARS.y + 22} stroke={color.mist} strokeWidth={stroke.hair} />
					{[BARS.x, BARS.x + BARS.w].map((x) => (
						<line key={x} x1={x} x2={x} y1={BARS.y + 14} y2={BARS.y + 30} stroke={color.mist} strokeWidth={stroke.hair} />
					))}
				</g>
				<line
					x1={BARS.x}
					x2={BARS.x + BARS.w * progress(f, typical, beat * 2, ease.inOut)}
					y1={typicalY}
					y2={typicalY}
					stroke={color.paper}
					strokeWidth={stroke.line}
					strokeDasharray="10 8"
					opacity={progress(f, typical)}
				/>
			</svg>
			<At x={BARS.x + BARS.w / 2 - 200} y={BARS.y + 34} w={400} style={{textAlign: 'center', opacity: progress(f, members)}}>
				<Tex tex={'\\text{about } H \\text{ rows } u'} px={size.small} ink="mist" display={false} />
			</At>
			<At x={BARS.x + BARS.w + 14} y={typicalY - 24} style={{opacity: progress(f, root)}}>
				<Tex tex={'\\sqrt{D}'} px={size.label + 4} display={false} />
			</At>
			<At x={space.margin} y={400} w={1300} style={{opacity: progress(f, root + beat)}}>
				<Tex tex={'H\\ \\text{members}\\ \\times\\ (\\sqrt{D})^{2}\\ =\\ DH'} px={size.label + 6} display={false} />
				<div style={{marginTop: 14, opacity: progress(f, sqrtCancel)}}>
					<Tex tex={'\\text{about } D \\text{ terms, typical size } \\sqrt{D}:\\ \\text{square-root cancellation, on average}'} px={size.label} ink="mist" display={false} />
				</div>
			</At>
			<Tag kind="schematic" p={progress(f, fam + beat * 4)} style={{position: 'absolute', left: BARS.x + BARS.w - 210, top: BARS.y + 34}} />
			<Cite p={progress(f, total)}>October manuscript, Proposition 3.1</Cite>
			<SceneLocator />
		</>
	);
};

export const BudgetOutlier: React.FC = () => {
	const {frame: f, cue} = useCues();
	const huge = cue('budget-3', 'One huge sum');
	const allows = cue('budget-3', 'budget allows it');
	const one = cue('budget-3', 'u equal to one');
	const row = cue('budget-3', 'single row');
	const many = cue('budget-3', 'show up many times');
	const grow = progress(f, huge, beat * 3, ease.inOut);
	// Rows u = p^6 (chapter 5) nearly repeat the target: here they take its height.
	const copyP = (k: number) => progress(f, many + k * 5, beat);
	const sizes = SIZES.map((v, i) => (i === OUTLIER ? lerp(v, OUTLIER_SIZE, grow) : COPIES.includes(i) ? lerp(v, SIZES[0], copyP(COPIES.indexOf(i))) : v));
	const inkOf = (i: number) =>
		i === 0 && target > 0 ? 'gilt' : i === OUTLIER && grow > 0 ? 'paper' : COPIES.includes(i) && copyP(COPIES.indexOf(i)) > 0.5 ? 'gilt' : null;
	const target = progress(f, one);
	const ox = BARS.x + (OUTLIER + 0.5) * (BARS.w / ROWS);
	const oy = BARS.y - BARS.unit * sizes[OUTLIER];
	const tx = BARS.x + 0.5 * (BARS.w / ROWS);
	const unknownTop = BARS.y - BARS.unit * OUTLIER_SIZE;
	const range = progress(f, row, beat * 2, ease.inOut);
	const flicker = (k: number) => {
		const t0 = many + k * 5;
		return progress(f, t0, beat * 0.5) * (0.35 + 0.55 * Math.abs(Math.sin((f - t0) / 3.1 + k * 1.7)));
	};
	return (
		<>
			<SceneTitle p={progress(f, 4)}>One row can hide</SceneTitle>
			<Formula p={0.45} />
			<Text px={size.body} p={progress(f, 8)} style={{position: 'absolute', left: space.margin, top: 310}}>
				An average says nothing about a single member.
			</Text>
			<EnergyBars
				{...BARS}
				sizes={sizes}
				ink={inkOf}
			/>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<line x1={BARS.x} x2={BARS.x + BARS.w} y1={typicalY} y2={typicalY} stroke={alpha('paper', 0.7)} strokeWidth={stroke.line} strokeDasharray="10 8" />
				{/* the target's size is unknown: anything up to what the budget allows */}
				<g opacity={range}>
					<line x1={tx} x2={tx} y1={BARS.y - BARS.unit * SIZES[0] - 6} y2={lerp(BARS.y - BARS.unit * SIZES[0] - 6, unknownTop, range)} stroke={color.gilt} strokeWidth={stroke.line} strokeDasharray="4 7" />
					<line x1={tx - 9} x2={tx + 9} y1={unknownTop} y2={unknownTop} stroke={color.gilt} strokeWidth={stroke.line} opacity={range >= 1 ? 1 : 0} />
				</g>
				{COPIES.map((r, k) => {
					const cx = BARS.x + (r + 0.5) * (BARS.w / ROWS);
					return (
						<g key={r} opacity={flicker(k)}>
							<line x1={cx} x2={cx} y1={BARS.y - BARS.unit * SIZES[0] - 6} y2={unknownTop} stroke={color.gilt} strokeWidth={stroke.line} strokeDasharray="4 7" />
							<line x1={cx - 9} x2={cx + 9} y1={unknownTop} y2={unknownTop} stroke={color.gilt} strokeWidth={stroke.line} />
						</g>
					);
				})}
			</svg>
			<At x={BARS.x + BARS.w + 14} y={typicalY - 24}>
				<Tex tex={'\\sqrt{D}'} px={size.label + 4} display={false} />
			</At>
			<Callout x={ox + 110} y={unknownTop - 34} to={[ox + 4, oy + 6]} p={progress(f, huge + beat * 2)} width={560}>
				one huge member, still within budget
			</Callout>
			<EnergyMeter
				{...METER}
				squares={squares(sizes)}
				budget={BUDGET}
				ink={inkOf}
			/>
			<MeterLabels p={1} budgetP={1} />
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: window(f, allows, one + beat * 2)}}>
				<line x1={METER.x - 22} x2={METER.x + METER.w + 22} y1={METER.y - METER.h} y2={METER.y - METER.h} stroke={color.paper} strokeWidth={stroke.bold} />
			</svg>
			<At x={tx - 20} y={BARS.y + 18} style={{opacity: target}}>
				<Tex tex={'u=1'} px={size.small} ink="gilt" display={false} />
			</At>
			<At x={tx + 24} y={unknownTop - 64} style={{opacity: range, whiteSpace: 'nowrap'}}>
				<Text px={size.label} ink="gilt">
					the target: its size is not pinned down
				</Text>
			</At>
			<At x={BARS.x + 300} y={BARS.y + 30} w={900} style={{opacity: progress(f, many)}}>
				<Text px={size.label} ink="gilt">
					what we need: the target, appearing in many rows
				</Text>
			</At>
			<Tag kind="schematic" style={{position: 'absolute', left: BARS.x + BARS.w - 210, top: BARS.y + 34}} />
			<SceneLocator />
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'budget-ms': BudgetMS,
	'budget-outlier': BudgetOutlier,
};
