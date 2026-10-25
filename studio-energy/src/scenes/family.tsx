import React from 'react';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Cite, Tag, Text} from '../design/primitives';
import {At, SceneLocator, SceneTitle, seeded} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, size, space, stroke} from '../design/tokens';
import {Frame, Square, useHatch} from '../diagrams/Area';
import {Bracket, EnergyRect} from '../diagrams/Energy';
import {FAMILY, FamilyField, latticeXY} from '../diagrams/FamilyField';
import {FamilyTable, PhaseWalk, walkEnd} from '../diagrams/FamilyTable';
import {Lattice} from '../diagrams/Lattice';
import {Ledger} from '../diagrams/Ledger';
import {MixedLine} from '../diagrams/MixedLine';
import {NormAnnulus} from '../diagrams/NormAnnulus';

// Chapter 2: Why a family, and the shape of a budget. October manuscript,
// §2.1–§2.2 and §3 (Proposition 3.1); the large sieve is classical.

const Arrowhead: React.FC<{x: number; y: number; angle: number; ink: 'ink' | 'cobalt' | 'pencil' | 'viridian'; p?: number}> = ({x, y, angle, ink, p = 1}) => (
	<path
		d={`M${x},${y}l${-14 * Math.cos(angle - 0.45)},${-14 * Math.sin(angle - 0.45)}M${x},${y}l${-14 * Math.cos(angle + 0.45)},${-14 * Math.sin(angle + 0.45)}`}
		stroke={color[ink]}
		strokeWidth={stroke.line}
		strokeLinecap="round"
		fill="none"
		opacity={p}
	/>
);

// --- family-target: the one sum the proof needs ---

// The lattice picture uses its own small D so the terms can be seen one by
// one; NormAnnulus computes them (nu trivial, window on (1, 2)).
const ANN = {cx: 1460, cy: 548, unit: 25, D: 80};
// The trivial size D as the side of a square; the target's side is unknown.
const SQ = {x: 176, y: 880, side: 360};
const UNKNOWN = 0.6;
const GOAL = 0.22;

export const FamilyTarget: React.FC = () => {
	const {frame: f, cue} = useCues();
	const named = cue('family-1', 'called A one of D');
	const mob = cue('family-1', 'Möbius values');
	const nu = cue('family-1', 'fixed character');
	const ideals = cue('family-1', 'ideals of the Eisenstein integers');
	const normD = cue('family-1', 'norm about D');
	const terms = cue('family-1', 'about D terms');
	const goal = cue('family-1', 'The goal');
	const smaller = cue('family-1', 'much smaller than D');
	const zeros = cue('family-1', 'rules out zeros');
	const frontier = cue('family-1', 'The Fixed Frontier');
	const s1 = SQ.side * UNKNOWN;
	const s2 = SQ.side * GOAL;
	const shrink = progress(f, smaller, beat * 2.5, ease.inOut);
	const ax = SQ.x + lerp(s1, s2, shrink);
	const ay = SQ.y - lerp(s1, s2, shrink);
	const mid = SQ.x + SQ.side + 60;
	const rIn = ANN.unit * Math.sqrt(ANN.D);
	const rOut = ANN.unit * Math.sqrt(2 * ANN.D);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The one sum</SceneTitle>

			<At x={space.margin} y={190} style={{opacity: progress(f, named - beat)}}>
				<Tex
					px={size.math}
					tex={'\\target{A_1(D)}=\\sum_{(\\nn,S)=1}\\htmlClass{mu}{\\mu(\\nn)}\\,\\htmlClass{nu}{\\nu(\\nn)}\\,W\\!\\big(\\N\\nn/D\\big)'}
					light={{mu: {ink: 'viridian', p: progress(f, mob)}, nu: {ink: 'viridian', p: progress(f, nu)}}}
				/>
			</At>
			<At x={space.margin} y={346} w={960}>
				<MixedLine p={progress(f, ideals)} parts={['over ideals ', {tex: '\\nn'}, ' of ', {tex: '\\OO=\\mathbb{Z}[\\omega]'}, ' with norm about ', {tex: 'D'}, ', prime to a fixed set ', {tex: 'S'}]} />
				<MixedLine p={progress(f, terms)} style={{marginTop: 4}} parts={['about ', {tex: 'D'}, ' terms, so trivially ', {tex: '|A_1(D)|\\ll D'}]} />
			</At>

			{/* the target as a square: its side is not known; the goal is a small side */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<Square x={SQ.x} y={SQ.y - SQ.side} side={SQ.side} ink="pencil" dash="5 9" p={progress(f, terms, beat * 2)} />
				<Bracket x1={SQ.x} y1={SQ.y + 22} x2={SQ.x + SQ.side} y2={SQ.y + 22} p={progress(f, terms, beat * 2)} />
				<Square x={SQ.x} y={SQ.y - s1} side={s1} ink="cobalt" dash="12 9" width={stroke.bold} p={progress(f, goal)} />
				<Square x={SQ.x} y={SQ.y - s2} side={s2} ink="cobalt" width={stroke.bold} p={progress(f, smaller + beat, beat * 2)} />
				<g opacity={progress(f, smaller) * (1 - progress(f, zeros + beat * 2, beat * 2))}>
					<line x1={SQ.x + s1} y1={SQ.y - s1} x2={ax} y2={ay} stroke={color.cobalt} strokeWidth={stroke.line} strokeDasharray="4 7" />
					<Arrowhead x={ax} y={ay} angle={(3 * Math.PI) / 4} ink="cobalt" p={shrink > 0.2 ? 1 : 0} />
				</g>
			</svg>
			<At x={SQ.x + SQ.side / 2 - 40} y={SQ.y + 30} w={80} style={{textAlign: 'center', opacity: progress(f, terms)}}>
				<Tex tex="D" px={size.label} ink="pencil" display={false} />
			</At>
			<At x={SQ.x + 12} y={SQ.y - s1 - 44} style={{opacity: progress(f, goal), whiteSpace: 'nowrap'}}>
				<MixedLine ink="cobalt" parts={[{tex: '|A_1(D)|', ink: 'cobalt'}, ': not known']} />
			</At>
			<At x={SQ.x + s2 + 12} y={SQ.y - s2 + 4} style={{opacity: progress(f, smaller + beat * 2), whiteSpace: 'nowrap'}}>
				<Text px={size.label} ink="cobalt">
					the goal
				</Text>
			</At>
			<Tag kind="schematic" p={progress(f, goal)} style={{position: 'absolute', left: mid, top: 900}} />

			{/* why it matters, and where the first film explains it */}
			<At x={mid} y={560} w={500}>
				<div style={{opacity: progress(f, smaller + beat)}}>
					<Tex px={size.label + 6} display={false} tex={'\\target{A_1(D)\\ll D^{1-\\delta+\\varepsilon}}'} />
				</div>
				<div style={{marginTop: 12, opacity: progress(f, zeros)}}>
					<Tex px={size.label + 6} display={false} tex={'\\Longrightarrow\\ L_K(s,\\nu)\\ne0'} />
				</div>
				<div style={{marginTop: 6, opacity: progress(f, zeros)}}>
					<Tex px={size.label + 6} display={false} tex={'\\phantom{\\Longrightarrow}\\ \\text{for}\\ \\Re s>1-\\delta'} />
				</div>
			</At>
			<At x={mid} y={782} w={500}>
				<Text px={size.small} ink="pencil" italic p={progress(f, frontier)}>
					Why: The Fixed Frontier, chapters 2 and 6
				</Text>
			</At>

			{/* the terms on the Eisenstein lattice */}
			<div style={{opacity: 0.6}}>
				<Lattice cx={ANN.cx} cy={ANN.cy} unit={ANN.unit} radius={Math.sqrt(2 * ANN.D) + 0.3} points={progress(f, 6, beat * 5)} units={0} />
			</div>
			<NormAnnulus cx={ANN.cx} cy={ANN.cy} unit={ANN.unit} D={ANN.D} p={progress(f, mob, ideals - mob + beat * 3, ease.inOut)} rings={progress(f, normD, beat * 2)} />
			<At x={ANN.cx - rIn * 0.55 - 60} y={ANN.cy - 20} w={120} style={{textAlign: 'center', opacity: progress(f, normD), whiteSpace: 'nowrap', textShadow: `0 0 4px ${color.ground}, 0 0 8px ${color.ground}`}}>
				<Tex tex={'\\N\\nn=D'} px={size.small} ink="pencil" display={false} />
			</At>
			<At x={ANN.cx + rOut * 0.72 + 8} y={ANN.cy - rOut * 0.7 - 40} style={{opacity: progress(f, normD)}}>
				<Tex tex={'\\N\\nn=2D'} px={size.small} ink="pencil" display={false} />
			</At>
			<At x={1150} y={876} w={650} style={{opacity: progress(f, mob + beat * 3), whiteSpace: 'nowrap'}}>
				<MixedLine
					px={size.micro}
					parts={['filled ', {tex: '\\mu=+1'}, ', hollow ', {tex: '-1'}, '; six marks per ideal; ', {tex: '\\nu'}, ' trivial; ', {tex: `D=${ANN.D}`}]}
				/>
			</At>
			<Tag kind="computed" p={progress(f, mob + beat * 3)} style={{position: 'absolute', left: 1150, top: 914}} />

			<SceneLocator />
			<Cite p={progress(f, named)}>October manuscript, §2.1 and §3</Cite>
		</>
	);
};

// --- family-table: rows are members, columns are terms ---

// Schematic: signs beta_n = +-1 and phases phi_u(n) = e(u n / 14), so the
// columns are close to orthogonal over the rows. Row 0 is u = 1, every phase 1.
const TB = {x: 236, y: 300, cell: 46, rows: 10, cols: 14};
const BETA = Array.from({length: TB.cols}, (_, n) => (seeded(n, 5) < 0.5 ? -1 : 1));
if (BETA.every((b) => b === BETA[0])) throw new Error('the schematic signs should be mixed');
const PH = (u: number, n: number) => (2 * Math.PI * u * n) / TB.cols;
const ENTRY = (u: number, n: number) => PH(u, n) + (BETA[n] < 0 ? Math.PI : 0);
const ROWSUM = Array.from({length: TB.rows}, (_, u) => {
	let re = 0;
	let im = 0;
	for (let n = 0; n < TB.cols; n++) {
		re += Math.cos(ENTRY(u, n));
		im += Math.sin(ENTRY(u, n));
	}
	return Math.hypot(re, im);
});
const ROW_K = (TB.cell - 8) / Math.max(...ROWSUM); // px per unit of |row sum|
const PAIR = [4, 6] as const;
const CROSS = Array.from({length: TB.rows}, (_, u) => PH(u, PAIR[0]) - PH(u, PAIR[1]));
const SAME = Array.from({length: TB.rows}, () => 0);
const CROSS_SIZE = Math.hypot(...[CROSS.reduce((s, a) => s + Math.cos(a), 0), CROSS.reduce((s, a) => s + Math.sin(a), 0)]);
if (CROSS_SIZE > TB.rows / 4) throw new Error('the chosen pair of columns should nearly cancel');

export const FamilyRowsCols: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const one = cue('family-2', 'One sum');
	const cross = cue('family-2', 'cross terms');
	const table = cue('family-2', 'Lay it out as a table');
	const rowIs = cue('family-2', 'each row is one member');
	const colIs = cue('family-2', 'each column is one term');
	const words = cue('family-2', 'The paper uses exactly');
	const s3 = start('family-3');
	const square = cue('family-3', 'Square every row');
	const add = cue('family-3', 'and add');
	const swap = cue('family-3', 'Swap the order of summation');
	const pairs = cue('family-3', 'pairs two columns');
	const averaged = cue('family-3', 'averaged over all the rows');
	const rowsEnd = cue('family-3', 'all the rows', 'end');
	const orth = cue('family-3', 'orthogonal');
	const perp = cue('family-3', 'perpendicular directions');
	const small = cue('family-3', 'that average is small');
	const cancels = cue('family-3', 'The family cancels');
	const early = 1 - progress(f, s3, beat * 1.5);
	const sweep = (rowsEnd + beat - averaged) / TB.rows;
	const cursor = (f - averaged) / sweep; // rows swept so far
	const sq = (u: number) => progress(f, square + u * 2.5, beat);
	const WALK = {x: 1420, y: 700, step: 34};
	const SAMEW = {x: 1340, y: 862, step: 34};
	const PERP = {x: 1050, y: 860, len: 150};
	const end = walkEnd(WALK.x, WALK.y, WALK.step, CROSS);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Rows and columns</SceneTitle>

			<FamilyTable
				{...TB}
				at={(u, n) => {
					const p = u === 0 ? progress(f, 6, beat * 2) : progress(f, table + (u - 1) * 3, beat);
					const lit = Math.max(window(f, rowIs, colIs, beat) * (u === 4 ? 1 : 0), 0);
					return {angle: ENTRY(u, n), ink: u === 0 ? 'cobalt' : 'viridian', p: lit > 0 ? 1 : p * (u === 0 ? 1 : 0.92)};
				}}
				grid={progress(f, 6, beat * 2)}
				gridRows={1 + Math.round((TB.rows - 1) * progress(f, table, beat * 4))}
				rowMarks={[{i: 4, ink: 'ink', p: window(f, rowIs, colIs, beat)}]}
				colMarks={[
					{i: 6, ink: 'ink', p: window(f, colIs, words, beat)},
					{i: PAIR[0], ink: 'viridian', p: progress(f, pairs) * (1 - progress(f, cancels + beat * 2, beat * 2))},
					{i: PAIR[1], ink: 'viridian', p: progress(f, pairs + 6) * (1 - progress(f, cancels + beat * 2, beat * 2))},
				]}
				band={cursor > 0 && cursor < TB.rows + 0.5 ? {r: Math.min(TB.rows - 1, Math.floor(cursor)), p: 1} : undefined}
			/>
			<At x={TB.x - 110} y={TB.y + 6} w={100} style={{textAlign: 'right', opacity: progress(f, table)}}>
				<Tex tex="u=1" px={size.label} ink="cobalt" display={false} />
			</At>
			<At x={TB.x} y={TB.y - 50} w={TB.cols * TB.cell}>
				<MixedLine p={progress(f, 8) * (1 - progress(f, colIs - beat, beat))} parts={['one sum ', {tex: '\\sum_n\\beta_n'}, ': a row of terms']} />
			</At>
			<At x={TB.x} y={TB.y - 50} w={TB.cols * TB.cell}>
				<MixedLine p={progress(f, colIs)} parts={['columns ', {tex: 'n'}, ': the terms']} />
			</At>
			<At x={TB.x - 108} y={TB.y + TB.rows * TB.cell + 14} w={600}>
				<MixedLine p={progress(f, rowIs)} parts={['rows ', {tex: 'u'}, ': the members']} />
			</At>
			<Tag kind="schematic" p={progress(f, table + beat * 3)} style={{position: 'absolute', left: TB.x, top: TB.y + TB.rows * TB.cell + 70}} />

			{/* each row squared: a square of side |row sum| at the row's end */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				{ROWSUM.map((s, u) => {
					const side = s * ROW_K;
					const cx = TB.x + TB.cols * TB.cell + 46;
					return <Square key={u} x={cx - side / 2} y={TB.y + u * TB.cell + (TB.cell - side) / 2} side={side} ink={u === 0 ? 'cobalt' : 'ink'} fill={alpha(u === 0 ? 'cobalt' : 'ink', 0.22)} p={sq(u)} />;
				})}
			</svg>

			{/* family-2: one sum, and its cross terms */}
			<div style={{opacity: early}}>
				<At x={1010} y={186} style={{opacity: progress(f, one)}}>
					<Tex
						px={size.math * 0.8}
						tex={'\\Big|\\sum_n\\beta_n\\Big|^{2}=\\sum_n|\\beta_n|^{2}+\\htmlClass{x}{\\sum_{n\\ne m}\\beta_n\\overline{\\beta_m}}'}
						light={{x: {ink: 'vermilion', p: progress(f, cross)}}}
					/>
				</At>
				<At x={1010} y={330} w={760}>
					<MixedLine p={progress(f, cross + beat)} parts={['one sum alone: nothing controls its cross terms']} />
				</At>
				<At x={1010} y={430} w={780} style={{opacity: progress(f, words)}}>
					<Text px={size.label} ink="ink" italic>
						“In a mean square, we call the variable in the outer sum the <span style={{fontStyle: 'normal'}}>row</span> and the variable in the inner sum the{' '}
						<span style={{fontStyle: 'normal'}}>column</span>.”
					</Text>
				</At>
			</div>

			{/* family-3: square, add, swap */}
			<At x={1010} y={178} style={{opacity: progress(f, add)}}>
				<Tex px={size.math * 0.78} tex={'\\sum_u\\Big|\\sum_n\\beta_n\\,\\phi_u(n)\\Big|^{2}'} />
			</At>
			<At x={1010} y={312} style={{opacity: progress(f, swap)}}>
				<Tex
					px={size.math * 0.78}
					tex={'=\\sum_{n,m}\\beta_n\\overline{\\beta_m}\\;\\htmlClass{inner}{\\sum_u\\phi_u(n)\\overline{\\phi_u(m)}}'}
					light={{inner: {ink: 'viridian', p: progress(f, pairs)}}}
				/>
			</At>
			<At x={1010} y={438} w={780}>
				<MixedLine p={progress(f, pairs)} parts={['each pair of columns ', {tex: 'n,m'}, ', summed over all the rows']} />
			</At>
			<At x={1010} y={488} style={{opacity: progress(f, cancels)}}>
				<Tex px={size.math * 0.78} tex={'\\approx\\ R\\sum_n|\\beta_n|^{2}'} />
			</At>
			<At x={1330} y={522} w={460} style={{opacity: progress(f, cancels + beat)}}>
				<MixedLine px={size.small} parts={[{tex: 'R'}, ' rows; only ', {tex: 'n=m'}, ' survives']} />
			</At>

			{/* the cross term of the lit pair, row by row, as a walk; and n = m for comparison */}
			<PhaseWalk x={WALK.x} y={WALK.y} step={WALK.step} angles={CROSS} shown={Math.max(0, cursor)} p={progress(f, averaged)} />
			<At x={WALK.x + 110} y={WALK.y - 60} w={300} style={{opacity: progress(f, averaged)}}>
				<MixedLine px={size.small} ink="viridian" parts={[{tex: 'n\\ne m', ink: 'viridian'}, ': the phases turn']} />
			</At>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: progress(f, small)}}>
				<circle cx={end[0]} cy={end[1]} r={12} fill="none" stroke={color.viridian} strokeWidth={stroke.line} />
			</svg>
			<At x={WALK.x + 110} y={WALK.y - 22} w={300} style={{opacity: progress(f, small)}}>
				<MixedLine px={size.small} ink="viridian" parts={['and end near the start: small']} />
			</At>
			<PhaseWalk x={SAMEW.x} y={SAMEW.y} step={SAMEW.step} angles={SAME} shown={TB.rows * progress(f, small + beat, beat * 2)} ink="ink" p={progress(f, small + beat)} />
			<At x={SAMEW.x} y={SAMEW.y + 14} w={460} style={{opacity: progress(f, small + beat * 2)}}>
				<MixedLine px={size.small} parts={[{tex: 'n=m'}, ': every step the same, ', {tex: 'R'}, ' in all']} />
			</At>

			{/* orthogonal: perpendicular directions */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: progress(f, orth)}}>
				<line x1={PERP.x} y1={PERP.y} x2={PERP.x + PERP.len * progress(f, orth, beat * 2)} y2={PERP.y} stroke={color.viridian} strokeWidth={stroke.bold} strokeLinecap="round" />
				<line x1={PERP.x} y1={PERP.y} x2={PERP.x} y2={PERP.y - PERP.len * progress(f, perp, beat * 2)} stroke={color.viridian} strokeWidth={stroke.bold} strokeLinecap="round" />
				<path d={`M${PERP.x + 22},${PERP.y}v-22h-22`} fill="none" stroke={color.pencil} strokeWidth={stroke.hair} opacity={progress(f, perp + beat)} />
				<Arrowhead x={PERP.x + PERP.len} y={PERP.y} angle={0} ink="viridian" p={progress(f, orth + beat)} />
				<Arrowhead x={PERP.x} y={PERP.y - PERP.len} angle={-Math.PI / 2} ink="viridian" p={progress(f, perp + beat)} />
			</svg>
			<At x={PERP.x + PERP.len + 10} y={PERP.y - 22} style={{opacity: progress(f, orth + beat)}}>
				<Tex tex="n" px={size.label} ink="viridian" display={false} />
			</At>
			<At x={PERP.x - 34} y={PERP.y - PERP.len - 30} style={{opacity: progress(f, perp + beat)}}>
				<Tex tex="m" px={size.label} ink="viridian" display={false} />
			</At>
			<At x={PERP.x - 30} y={PERP.y + 16} w={260}>
				<Text px={size.small} ink="pencil" p={progress(f, perp)}>
					orthogonal columns
				</Text>
			</At>

			<SceneLocator />
			<Cite p={progress(f, words)}>October manuscript, §2.2</Cite>
		</>
	);
};

// --- family-shape: rows plus columns, and why it cannot be beaten ---

const SH = {x: 200, y: 424, cell: 50, rows: 6, cols: 10};
const SH_BETA = Array.from({length: SH.cols}, (_, n) => (seeded(n, 9) < 0.5 ? -1 : 1));
const SH_PH = (r: number, n: number) => 2 * Math.PI * (((r + 1) * (n + 1) * 0.6180339887 + 0.31 * r) % 1);
const N0 = 6; // the column that takes all the weight
const R0 = 2; // the row that is blind to the columns
const FR = {x: 200, y: 792, u: 72}; // the frame, one unit of sum |beta_n|^2 tall
const FR_M = FR.x + SH.rows * FR.u; // where the rows' part ends
const BLIND = Math.sqrt(SH.cols) * FR.u; // the blind row's square: area L units
const BLIND_AT = {x: SH.x + SH.cols * SH.cell + 36, y: SH.y + (R0 + 0.5) * SH.cell - BLIND / 2};

export const FamilyShape: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const shape = cue('family-4', 'characteristic shape');
	const rows = cue('family-4', 'number of rows');
	const cols = cue('family-4', 'number of columns');
	const coef = cue('family-4', 'energy of the coefficients');
	const tiny = cue('family-4', 'tiny losses');
	const sieve = cue('family-4', 'large sieve');
	const beaten = cue('family-5', 'cannot be beaten');
	const weight = cue('family-5', 'all the weight on one column');
	const sees = cue('family-5', 'every row sees it');
	const isRows = cue('family-5', 'the energy is the number of rows');
	const isRowsEnd = cue('family-5', 'number of rows', 'end');
	const blind = cue('family-5', 'one row be blind');
	const collects = cue('family-5', 'collects them all');
	const isCols = cue('family-5', 'the energy is the number of columns');
	const good = cue('family-5', 'as good as a budget gets');
	const ex1 = progress(f, weight, beat * 2) * (1 - progress(f, blind, beat * 2));
	const ex2 = progress(f, blind, beat * 2);
	const align = progress(f, blind + beat, beat * 3, ease.inOut);
	const grow = progress(f, collects, cue('family-5', 'them all', 'end') - collects + beat, ease.inOut);
	const pour = progress(f, isCols, beat * 3, ease.inOut);
	const hatchInk = useHatch('ink', 'medium', 0.8);
	const bw = lerp(BLIND * grow, SH.cols * FR.u, pour);
	const bh = pour > 0 ? (BLIND * BLIND) / bw : BLIND * grow;
	const bx = lerp(BLIND_AT.x, FR_M, pour);
	const by = lerp(BLIND_AT.y + (BLIND - BLIND * grow) / 2, FR.y, pour);
	const unit = (r: number) => progress(f, lerp(sees, isRowsEnd, r / (SH.rows - 1)), beat);
	const tx = 1010;
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The shape of a budget</SceneTitle>
			<At x={space.margin} y={192} style={{opacity: progress(f, shape - beat)}}>
				<Tex
					px={size.math * 0.86}
					tex={'\\sum_{r\\le M}\\Big|\\sum_{n\\le L}\\beta_n\\,\\phi_r(n)\\Big|^{2}\\ \\ll\\ \\htmlClass{m}{(M}\\htmlClass{l}{+L)}\\,\\htmlClass{eps}{(ML)^{\\varepsilon}}\\,\\htmlClass{b}{\\sum_n|\\beta_n|^{2}}'}
					show={{m: progress(f, rows), l: progress(f, cols), b: progress(f, coef), eps: progress(f, tiny)}}
					light={{m: {ink: 'cobalt', p: progress(f, beaten)}, l: {ink: 'cobalt', p: progress(f, beaten)}, eps: {ink: 'pencil', p: 1}}}
				/>
			</At>
			<At x={1010} y={338} w={790}>
				<MixedLine p={progress(f, sieve)} parts={['the classical example: the large sieve']} />
			</At>
			<At x={SH.x} y={350} w={SH.cols * SH.cell + 300}>
				<MixedLine p={progress(f, rows)} parts={[{tex: 'M'}, ' rows ', {tex: 'r'}, ', ', {tex: 'L'}, ' columns ', {tex: 'n'}, ', coefficients ', {tex: '\\beta_n'}]} />
			</At>

			<FamilyTable
				{...SH}
				at={(r, n) => {
					const p = progress(f, shape + r * 3, beat);
					// family-4: signs times phases; example 1: only column N0; example 2: all beta_n = 1, row R0 blind
					const base = SH_PH(r, n) + (SH_BETA[n] < 0 ? Math.PI : 0);
					const ex2Angle = r === R0 ? lerp(SH_PH(r, n), 0, align) : SH_PH(r, n);
					const angle = ex2 > 0 ? ex2Angle : base;
					const off = n === N0 ? 1 : 1 - ex1;
					return {angle, ink: r === R0 && ex2 > 0 ? 'ink' : 'viridian', p: p * off};
				}}
				grid={progress(f, shape, beat * 2)}
				colMarks={[{i: N0, ink: 'ink', p: ex1}]}
				rowMarks={[{i: R0, ink: 'ink', p: progress(f, blind + beat) * (1 - progress(f, good, beat * 2))}]}
			/>

			{/* the frame: (M + L) sum |beta_n|^2, drawn in units of sum |beta_n|^2 */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>{hatchInk.defs}</defs>
				{Array.from({length: SH.rows}, (_, r) => (
					<Square key={r} x={FR.x + r * FR.u} y={FR.y} side={FR.u} fill={`url(#${hatchInk.id})`} p={unit(r)} width={stroke.hair} />
				))}
				{grow > 0 && (
					<g>
						<rect x={bx} y={by} width={bw} height={bh} fill={`url(#${hatchInk.id})`} />
						<rect x={bx} y={by} width={bw} height={bh} fill="none" stroke={color.ink} strokeWidth={stroke.line} />
					</g>
				)}
				<Frame x={FR.x} y={FR.y} w={SH.rows * FR.u} h={FR.u} p={progress(f, rows, beat * 2)} />
				<Frame x={FR_M} y={FR.y} w={SH.cols * FR.u} h={FR.u} p={progress(f, cols, beat * 2)} />
			</svg>
			<At x={FR.x} y={FR.y + FR.u + 10} w={SH.rows * FR.u} style={{textAlign: 'center'}}>
				<MixedLine p={progress(f, rows)} parts={[{tex: 'M'}, ': rows']} />
			</At>
			<At x={FR_M} y={FR.y + FR.u + 10} w={SH.cols * FR.u} style={{textAlign: 'center'}}>
				<MixedLine p={progress(f, cols)} parts={[{tex: 'L'}, ': columns']} />
			</At>
			<At x={FR_M + SH.cols * FR.u + 30} y={FR.y - 14} w={420}>
				<MixedLine p={progress(f, coef)} ink="ink" px={size.small} parts={['the budget; areas in units of ', {tex: '\\sum_n|\\beta_n|^{2}'}]} />
			</At>
			<Tag kind="schematic" p={progress(f, rows)} style={{position: 'absolute', left: FR_M + SH.cols * FR.u + 30, top: FR.y + 84}} />

			{/* example 1: all the weight on one column */}
			<At x={tx} y={410} w={790} style={{opacity: progress(f, weight), whiteSpace: 'nowrap'}}>
				<MixedLine parts={['all the weight on one column: ', {tex: '\\beta_n=0'}, ' unless ', {tex: 'n=n_0'}]} />
				<div style={{marginTop: 12, opacity: progress(f, isRows)}}>
					<Tex px={size.label + 2} display={false} tex={'\\textstyle\\sum_{r\\le M}|\\beta_{n_0}\\phi_r(n_0)|^{2}=M\\,|\\beta_{n_0}|^{2}=M\\sum_n|\\beta_n|^{2}'} />
				</div>
			</At>
			{/* example 2: one row blind to the columns */}
			<At x={tx} y={548} w={790} style={{opacity: progress(f, blind), whiteSpace: 'nowrap'}}>
				<MixedLine parts={['every ', {tex: '\\beta_n=1'}, ', and one row blind: ', {tex: '\\phi_{r_0}(n)=1'}]} />
				<div style={{marginTop: 12, opacity: progress(f, collects + beat)}}>
					<Tex px={size.label + 2} display={false} tex={'\\Big|\\sum_{n\\le L}\\beta_n\\,\\phi_{r_0}(n)\\Big|^{2}=L^{2}=\\htmlClass{lb}{L\\sum_n|\\beta_n|^{2}}'} show={{lb: progress(f, isCols)}} />
				</div>
			</At>
			<At x={tx} y={700} w={790}>
				<MixedLine p={progress(f, good)} ink="ink" parts={['each example fills its own part: neither can be dropped']} />
			</At>

			<SceneLocator />
			<Cite p={progress(f, sieve)}>Classical: the large sieve; Iwaniec–Kowalski, ch. 7</Cite>
		</>
	);
};

// --- family-ms: the paper's family and Proposition 3.1 ---

const RECT = {x: 236, y: 872, w: 280, h: 360, bands: 14}; // columns D wide, rows H tall
const BAND = 9; // the typical row lit in family-7
const BAND_H = RECT.h / RECT.bands;
const ROOT_SIDE = Math.sqrt(RECT.w * BAND_H); // a square with one row's area

export const FamilyMS: React.FC = () => {
	const {frame: f, cue} = useCues();
	const fam = cue('family-6', 'The paper’s family');
	const chi = cue('family-6', 'sextic phase');
	const rows = cue('family-6', 'The rows are Eisenstein integers');
	const upToH = cue('family-6', 'norm up to H');
	const hIs = cue('family-6', 'where H is');
	const little = cue('family-6', 'a little more than D');
	const cols = cue('family-6', 'The columns are the ideals');
	const prop = cue('family-6', 'Proposition 3.1');
	const atMost = cue('family-6', 'at most about D times H');
	const aboutH = cue('family-7', 'about H rows');
	const typical = cue('family-7', 'a typical row has energy about D');
	const sizeAt = cue('family-7', 'size about the square root of D');
	const sqrtCancel = cue('family-7', 'square-root cancellation');
	const cheaper = cue('family-7', 'A budget is cheaper than a bound');
	const pay = cue('family-7', 'You pay for it');
	const whole = cue('family-7', 'the whole family at once');
	const hatchInk = useHatch('ink', 'medium', 0.8);
	const lift = progress(f, sizeAt, beat * 2.5, ease.inOut);
	const bandTop = RECT.y - RECT.h + BAND * BAND_H;
	const sqX = RECT.x + RECT.w + 50;
	const bx = lerp(RECT.x, sqX, lift);
	const bw = lerp(RECT.w, ROOT_SIDE, lift);
	const bh = (RECT.w * BAND_H) / bw;
	const by = lerp(bandTop, RECT.y - ROOT_SIDE, lift);
	const lx = RECT.x + RECT.w + 50;
	const rx = 1010;
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The paper’s budget</SceneTitle>
			<At x={space.margin} y={190} style={{opacity: progress(f, fam - beat * 0.5)}}>
				<Tex
					px={size.math * 0.82}
					tex={'A_{u}(D)=\\sum_{(\\nn,S)=1}\\mu(\\nn)\\,\\nu(\\nn)\\,\\htmlClass{chi}{\\chi_{\\nn}(u)}\\,W\\!\\big(\\N\\nn/D\\big)'}
					light={{chi: {ink: 'viridian', p: progress(f, chi)}}}
				/>
			</At>

			{/* the energy rectangle: rows H tall, columns D wide; its area is the budget */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>{hatchInk.defs}</defs>
				<EnergyRect x={RECT.x} y={RECT.y} w={RECT.w} h={RECT.h} p={progress(f, rows, beat * 3)} rows={progress(f, aboutH) > 0 ? RECT.bands : 0} fill={progress(f, atMost)} />
				<Frame x={RECT.x} y={RECT.y - RECT.h} w={RECT.w} h={RECT.h} p={progress(f, atMost, beat * 2)} />
				<Bracket x1={RECT.x - 30} y1={RECT.y} x2={RECT.x - 30} y2={RECT.y - RECT.h} p={progress(f, upToH, beat * 2)} />
				<Bracket x1={RECT.x} y1={RECT.y + 24} x2={RECT.x + RECT.w} y2={RECT.y + 24} p={progress(f, cols, beat * 2)} />
				{progress(f, typical) > 0 && (
					<g opacity={progress(f, typical)}>
						<rect x={bx} y={by} width={bw} height={bh} fill={`url(#${hatchInk.id})`} />
						<rect x={bx} y={by} width={bw} height={bh} fill="none" stroke={color.ink} strokeWidth={stroke.line} />
					</g>
				)}
				<Bracket x1={sqX} y1={RECT.y + 24} x2={sqX + ROOT_SIDE} y2={RECT.y + 24} p={progress(f, sizeAt + beat * 2, beat)} />
			</svg>
			<At x={RECT.x - 112} y={RECT.y - RECT.h / 2 - 24} w={70} style={{textAlign: 'right', opacity: progress(f, upToH)}}>
				<Tex tex="H" px={size.math * 0.8} display={false} />
			</At>
			<At x={RECT.x + RECT.w / 2 - 40} y={RECT.y + 32} w={80} style={{textAlign: 'center', opacity: progress(f, cols)}}>
				<Tex tex="D" px={size.math * 0.8} display={false} />
			</At>
			<At x={sqX + ROOT_SIDE / 2 - 50} y={RECT.y + 34} w={100} style={{textAlign: 'center', opacity: progress(f, sizeAt + beat * 2)}}>
				<Tex tex="\sqrt{D}" px={size.label} display={false} />
			</At>
			<At x={RECT.x} y={RECT.y - RECT.h - 42} w={440} style={{opacity: progress(f, atMost + beat), whiteSpace: 'nowrap'}}>
				<MixedLine ink="ink" px={size.small} parts={['its area: the budget, ', {tex: 'D^{1+\\varepsilon}H'}]} />
			</At>

			{/* rows and columns, in the paper's terms */}
			<At x={lx} y={506} w={440} style={{whiteSpace: 'nowrap'}}>
				<MixedLine p={progress(f, rows)} ink="ink" parts={['rows: ', {tex: 'u\\in\\OO'}, ', ', {tex: '0<\\N(u)\\le H'}]} />
				<div style={{marginTop: 8, opacity: progress(f, hIs)}}>
					<Tex px={size.label + 2} display={false} tex={'H=D^{1+\\vartheta},\\ \\ 0<\\vartheta\\le\\tfrac{1}{10}'} />
				</div>
				<MixedLine p={progress(f, little)} px={size.small} style={{marginTop: 2}} parts={[{tex: '\\vartheta'}, ' fixed: ', {tex: 'H'}, ' a little more than ', {tex: 'D'}]} />
				<MixedLine p={progress(f, cols)} ink="ink" style={{marginTop: 16}} parts={['columns: ideals ', {tex: '\\nn'}, ', ', {tex: '\\N\\nn\\asymp D'}]} />
			</At>
			<At x={lx} y={808} w={420} style={{opacity: progress(f, typical) * (1 - progress(f, sizeAt, beat)), whiteSpace: 'nowrap'}}>
				<MixedLine ink="ink" parts={['one row: energy about ', {tex: 'D'}]} />
			</At>
			<At x={sqX + ROOT_SIDE + 24} y={RECT.y - ROOT_SIDE - 6} w={300} style={{opacity: progress(f, sqrtCancel)}}>
				<MixedLine px={size.small} parts={['size about ', {tex: '\\sqrt D'}, ': square-root cancellation, on average']} />
			</At>

			{/* Proposition 3.1, as stated, and the outline's shorthand */}
			<At x={rx} y={300} w={790} style={{opacity: progress(f, prop)}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 28}}>
					<Text px={size.small} ink="pencil" style={{letterSpacing: '0.08em', textTransform: 'uppercase'}}>
						Proposition 3.1
					</Text>
					<Tag kind="claim" />
				</div>
				<MixedLine
					px={size.small}
					ink="ink"
					style={{marginTop: 6}}
					parts={[
						'For every fixed ',
						{tex: '0<\\vartheta\\le1/10'},
						' and ',
						{tex: '\\varepsilon>0'},
						' there is an integer ',
						{tex: 'k=k(\\vartheta,\\varepsilon)\\ge1'},
						' such that, for every compact interval ',
						{tex: 'I\\subset(0,\\infty)'},
						', all smooth ',
						{tex: 'W'},
						' supported in ',
						{tex: 'I'},
						', and ',
						{tex: 'D\\ge2'},
						',',
					]}
				/>
				<div style={{marginTop: 12}}>
					<Tex
						px={size.label + 2}
						tex={'\\begin{aligned}&\\textstyle\\sum_{0<\\N(u)\\le D^{1+\\vartheta}}|A_u(D)|^{2}\\\\ &\\qquad\\ll_{\\nu,S,I,\\vartheta,\\varepsilon}\\big(\\textstyle\\max_{0\\le j\\le k}\\|W^{(j)}\\|_\\infty\\big)^{2}D^{2+\\vartheta+\\varepsilon}\\end{aligned}'}
					/>
				</div>
			</At>
			<At x={rx} y={612} w={790} style={{opacity: progress(f, atMost)}}>
				<MixedLine px={size.small} parts={['in the outline’s shorthand:']} />
				<div style={{marginTop: 4}}>
					<Tex px={size.math * 0.74} display={false} tex={'\\textstyle\\sum_{0<\\N(u)\\le H}|A_u(D)|^{2}\\ \\ll\\ \\target{D^{1+\\varepsilon}H}'} />
				</div>
			</At>

			{/* family-7: what a budget buys, on the ledger */}
			<Ledger
				x={rx}
				y={748}
				w={790}
				amountW={300}
				px={size.small}
				rowH={48}
				rules={progress(f, cheaper)}
				rows={[
					{label: ['a bound: every row, one at a time'], note: 'far harder', kind: 'note', p: progress(f, cheaper)},
					{label: ['a budget: all the rows together'], amount: 'D^{1+\\varepsilon}H', kind: 'budget', p: progress(f, cheaper + beat)},
					{label: ['paid for with'], note: 'orthogonality', kind: 'payment', p: progress(f, pay)},
				]}
			/>
			<At x={rx} y={898} w={790}>
				<MixedLine p={progress(f, whole)} ink="ink" parts={['bought: the whole family at once']} />
			</At>

			<SceneLocator />
			<Cite p={progress(f, fam)}>October manuscript, (2.2) and Proposition 3.1</Cite>
		</>
	);
};

// --- family-field: a real family, computed at a small scale ---

// The smallest norm of a prime ideal outside S (primes above 2 and 3): split
// primes have norm p = 1 mod 3, inert ones q^2 with q = 2 mod 3, q > 2.
const SMALLEST_PRIME_NORM = (() => {
	const isP = (n: number) => n > 1 && Array.from({length: Math.floor(Math.sqrt(n)) - 1}, (_, i) => i + 2).every((d) => n % d !== 0);
	for (let n = 5; ; n++) {
		if (isP(n) && n % 3 === 1) return n;
		const q = Math.round(Math.sqrt(n));
		if (q * q === n && isP(q) && q % 3 === 2 && q > 2) return n;
	}
})();
if (FAMILY.Y >= SMALLEST_PRIME_NORM) throw new Error('a sixth-power copy could now be a row: update family-9');

const FULL = {cx: 470, cy: 590, unit: 5.0};
const ZOOM = {cx: 1186, cy: 548, unit: 33, radius: 7.4};
const FIELD_SIDE = (ZOOM.unit * 0.92) / FAMILY.max_row.size; // px per unit of |A_u|, zoom
const CMP_K = 2.2; // px per unit of |A_u|, the typical-versus-largest pair

export const FamilyFieldScene: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const real = cue('family-8', 'a real family');
	const dIs = cue('family-8', 'D equal to two thousand');
	const rowsAt = cue('family-8', '15,528 rows');
	const colsAt = cue('family-8', '847 columns');
	const each = cue('family-8', 'Each square is one row');
	const stands = cue('family-8', 'No row stands out');
	const largest = cue('family-8', 'the largest is about three times');
	const total = cue('family-8', 'the total comes within');
	const random = cue('family-8', 'random signs');
	const s9 = start('family-9');
	const nothing = cue('family-9', 'tests nothing');
	const looks = cue('family-9', 'what a budget looks like');
	const [mx, my] = latticeXY(FAMILY.max_row.a, FAMILY.max_row.b);
	const maxX = FULL.cx + mx * FULL.unit;
	const maxY = FULL.cy + my * FULL.unit;
	const zoomP = progress(f, each, beat * 3, ease.inOut);
	const caveat = progress(f, s9, beat * 1.5);
	const BAR = {x: 960, y: 900, w: 460, h: 26};
	const fill = BAR.w * FAMILY.energy_over_random;
	const typ = FAMILY.rms * CMP_K;
	const big = FAMILY.max_row.size * CMP_K;
	const CMP = {x: 1556, y: 520};
	return (
		<>
			<SceneTitle p={progress(f, 4)}>A real family</SceneTitle>
			<At x={space.margin} y={188} w={1200}>
				<div style={{display: 'flex', alignItems: 'baseline', gap: 0}}>
					<MixedLine ink="ink" p={progress(f, dIs)} parts={[{tex: `D=${FAMILY.D}`}]} />
					<MixedLine ink="ink" p={progress(f, rowsAt)} parts={[', ', {tex: FAMILY.rows.toLocaleString('en-US').replace(',', '{,}')}, ' rows']} />
					<MixedLine ink="ink" p={progress(f, colsAt)} parts={[', ', {tex: `${FAMILY.columns}`}, ' columns']} />
				</div>
			</At>

			<FamilyField cx={FULL.cx} cy={FULL.cy} unit={FULL.unit} reveal={progress(f, real - beat, beat * 5, ease.inOut)} opacity={1} />
			<Tag kind="computed" p={progress(f, real)} style={{position: 'absolute', left: space.margin, top: 920}} />

			{/* the zoom: squares big enough to read, the target row at the centre */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: zoomP * (1 - 0.9 * caveat)}}>
				<circle cx={FULL.cx} cy={FULL.cy} r={FULL.unit * ZOOM.radius} fill="none" stroke={color.pencil} strokeWidth={stroke.line} />
				<line x1={FULL.cx + FULL.unit * ZOOM.radius} y1={FULL.cy} x2={ZOOM.cx - ZOOM.unit * ZOOM.radius - 24} y2={ZOOM.cy} stroke={alpha('pencil', 0.7)} strokeWidth={stroke.hair} />
			</svg>
			<FamilyField {...ZOOM} reveal={progress(f, each, beat * 4, ease.inOut)} dots={0.7} side={FIELD_SIDE} target={progress(f, each + beat * 4)} opacity={1 - caveat} />
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: progress(f, each + beat * 4) * (1 - caveat)}}>
				<line x1={ZOOM.cx + 20} y1={ZOOM.cy - 20} x2={ZOOM.cx + ZOOM.unit * ZOOM.radius * 0.8} y2={ZOOM.cy - ZOOM.unit * ZOOM.radius - 20} stroke={color.cobalt} strokeWidth={stroke.hair} />
			</svg>
			<At x={ZOOM.cx + ZOOM.unit * ZOOM.radius * 0.8 + 8} y={ZOOM.cy - ZOOM.unit * ZOOM.radius - 52} style={{opacity: progress(f, each + beat * 4) * (1 - caveat), whiteSpace: 'nowrap'}}>
				<MixedLine ink="cobalt" px={size.small} parts={[{tex: 'u=1', ink: 'cobalt'}, ': the target']} />
			</At>
			<At x={ZOOM.cx - 220} y={ZOOM.cy + ZOOM.unit * ZOOM.radius + 18} w={440} style={{textAlign: 'center', opacity: progress(f, each + beat * 2) * (1 - caveat)}}>
				<MixedLine px={size.small} parts={['each square: one row, side ', {tex: '|A_u(D)|'}]} />
			</At>

			{/* no row stands out: the largest against the typical */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<circle cx={maxX} cy={maxY} r={16} fill="none" stroke={color.ink} strokeWidth={stroke.line} opacity={progress(f, largest)} />
				<Square x={CMP.x} y={CMP.y - typ} side={typ} fill={alpha('ink', 0.82)} p={progress(f, stands, beat * 2)} />
				<Square x={CMP.x + typ + 30} y={CMP.y - big} side={big} fill={alpha('ink', 0.82)} p={progress(f, largest, beat * 2)} />
			</svg>
			<At x={CMP.x - 20} y={CMP.y + 12} w={typ + 40} style={{textAlign: 'center', opacity: progress(f, stands)}}>
				<Text px={size.small} ink="pencil">
					typical
				</Text>
			</At>
			<At x={CMP.x + typ + 30} y={CMP.y + 12} w={big} style={{textAlign: 'center', opacity: progress(f, largest)}}>
				<Text px={size.small} ink="pencil">
					largest
				</Text>
			</At>
			<At x={CMP.x - 10} y={CMP.y + 56} w={260} style={{opacity: progress(f, largest + beat)}}>
				<MixedLine ink="ink" parts={[{tex: `${FAMILY.max_over_rms.toFixed(1)}\\times`}, ' typical']} />
			</At>
			<At x={CMP.x - 10} y={CMP.y + 100} w={260} style={{opacity: progress(f, largest + beat)}}>
				<MixedLine px={size.small} parts={['typical: the root mean square']} />
			</At>

			{/* the total against random signs: area as length */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<rect x={BAR.x} y={BAR.y} width={fill * progress(f, total, beat * 3, ease.inOut)} height={BAR.h} fill={alpha('ink', 0.75)} />
				<Frame x={BAR.x} y={BAR.y} w={BAR.w} h={BAR.h} p={progress(f, random, beat * 2)} width={stroke.bold} />
				<line x1={BAR.x + BAR.w + 18} x2={BAR.x + BAR.w + 18} y1={BAR.y - 6} y2={BAR.y + BAR.h + 6} stroke={color.ink} strokeWidth={stroke.line} opacity={window(f, looks, looks + beat * 6)} />
			</svg>
			<At x={BAR.x} y={BAR.y - 46} w={BAR.w + 300} style={{whiteSpace: 'nowrap'}}>
				<MixedLine p={progress(f, total)} parts={['all the squares: ', {tex: `${FAMILY.energy_over_random.toFixed(2)}`}, ' of the frame']} />
			</At>
			<At x={BAR.x + BAR.w + 36} y={BAR.y - 40} w={300} style={{whiteSpace: 'nowrap'}}>
				<Text px={size.small} ink="pencil" p={progress(f, random)}>
					frame: random signs,
				</Text>
				<Tex px={size.small} ink="pencil" display={false} tex={'\\text{rows}\\times\\textstyle\\sum_{\\nn}|W(\\N\\nn/D)|^{2}'} style={{opacity: progress(f, random)}} />
			</At>

			{/* family-9: what this does not show */}
			<At x={960} y={300} w={560} style={{opacity: caveat}}>
				<Text px={size.lead} ink="ink">
					At this scale it tests nothing about the paper’s claim.
				</Text>
				<MixedLine
					px={size.label}
					p={progress(f, nothing + beat)}
					style={{marginTop: 26}}
					parts={[
						'Nor does it hold the copies: ',
						{tex: `Y=H^{1/6}\\approx${FAMILY.Y.toFixed(2)}`},
						', and no prime outside ',
						{tex: 'S'},
						' has norm below ',
						{tex: `${SMALLEST_PRIME_NORM}`},
						'.',
					]}
				/>
				<Text px={size.label} ink="pencil" p={progress(f, looks)} style={{marginTop: 26}}>
					It shows only what a budget looks like when it holds.
				</Text>
			</At>

			<SceneLocator />
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'family-target': FamilyTarget,
	'family-table': FamilyRowsCols,
	'family-shape': FamilyShape,
	'family-ms': FamilyMS,
	'family-field': FamilyFieldScene,
};
