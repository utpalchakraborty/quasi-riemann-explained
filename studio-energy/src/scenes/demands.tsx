import React from 'react';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Cite, Fraction, Tag, Text} from '../design/primitives';
import {At, SceneLocator, SceneTitle, seeded} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, size, space, stroke} from '../design/tokens';
import {Frame, Square} from '../diagrams/Area';
import {chi, termsOf} from '../diagrams/DemandsArith';
import {divides, type Eis, ROOT_TEX} from '../diagrams/EisArith';
import {exponentAt, ExponentDial} from '../diagrams/ExponentDial';
import {FamilyTable, PhaseWalk, walkEnd} from '../diagrams/FamilyTable';
import {MixedLine} from '../diagrams/MixedLine';
import {NormLadder} from '../diagrams/NormLadder';
import {RootWheel} from '../diagrams/RootWheel';

// Chapter 3: Two demands. October manuscript, §2.2 (the family, (2.4)) and §3
// (the spend at k = 6). The k-dial is the film's own arithmetic.

const SIXTH = Math.PI / 3;

// --- demands-tension: members must differ, and members must agree ---

// Schematic: each member is a row of phases and a square of side |row sum|.
// Left, the members differ; right, every member is the target's row.
const TN = {rows: 5, cols: 9, cell: 50, pitch: 108, top: 300};
const TN_L = 196;
const TN_R = 1120;
const TN_PH = (r: number, j: number) => 2 * Math.PI * (((r + 2) * (j + 1) * 0.6180339887 + 0.37 * r) % 1);
const TN_BETA = Array.from({length: TN.cols}, (_, j) => (seeded(j, 21) < 0.42 ? -1 : 1));
const TN_TARGET = (j: number) => (TN_BETA[j] < 0 ? Math.PI : 0);
const rowSize = (angle: (j: number) => number) => {
	let re = 0;
	let im = 0;
	for (let j = 0; j < TN.cols; j++) {
		re += Math.cos(angle(j));
		im += Math.sin(angle(j));
	}
	return Math.hypot(re, im);
};
const TN_SIZES = Array.from({length: TN.rows}, (_, r) => rowSize((j) => TN_PH(r, j)));
const TN_TSIZE = rowSize(TN_TARGET);
const TN_K = 80 / Math.max(...TN_SIZES, TN_TSIZE);
if (Math.max(...TN_SIZES) / Math.min(...TN_SIZES) < 1.6) throw new Error('the diverse members should differ visibly in size');

export const DemandsTension: React.FC = () => {
	const {frame: f, cue} = useCues();
	const jobs = cue('demands-1', 'two jobs');
	const opposite = cue('demands-1', 'opposite directions');
	const prove = cue('demands-1', 'To prove a budget');
	const differ = cue('demands-1', 'the members must differ');
	const orth = cue('demands-1', 'orthogonality is what pays');
	const use = cue('demands-1', 'To use a budget');
	const many = cue('demands-1', 'many times');
	const agree = cue('demands-1', 'the members must agree');
	const turn = (r: number) => progress(f, lerp(use + beat * 2, many + beat, r / (TN.rows - 1)), beat * 1.5, ease.inOut);
	const rowY = (r: number) => TN.top + r * TN.pitch;
	const cx = (TN_L + TN.cols * TN.cell + 40 + TN_R) / 2 - 20;
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Two jobs</SceneTitle>

			{/* both blocks start as the same family */}
			{Array.from({length: TN.rows}, (_, r) => (
				<React.Fragment key={r}>
					<FamilyTable
						x={TN_L}
						y={rowY(r)}
						cell={TN.cell}
						rows={1}
						cols={TN.cols}
						grid={progress(f, 6 + r * 3, beat * 2)}
						at={(_, j) => ({angle: TN_PH(r, j), ink: progress(f, differ) > 0 ? 'viridian' : 'pencil', p: progress(f, 6 + r * 3 + j, beat)})}
					/>
					<FamilyTable
						x={TN_R}
						y={rowY(r)}
						cell={TN.cell}
						rows={1}
						cols={TN.cols}
						grid={progress(f, 6 + r * 3, beat * 2)}
						at={(_, j) => {
							const t = turn(r);
							// rotate the short way round to the target's phase
							let d = TN_TARGET(j) - TN_PH(r, j);
							d = ((d + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
							return {angle: TN_PH(r, j) + d * t, ink: t >= 1 ? 'cobalt' : 'pencil', p: progress(f, 6 + r * 3 + j, beat)};
						}}
					/>
				</React.Fragment>
			))}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				{TN_SIZES.map((s, r) => {
					const side = s * TN_K;
					const x0 = TN_L + TN.cols * TN.cell + 30;
					return <Square key={`l${r}`} x={x0 + (80 - side) / 2} y={rowY(r) + TN.cell / 2 - side / 2} side={side} fill={alpha('ink', 0.22)} p={progress(f, differ + r * 4, beat)} />;
				})}
				{TN_SIZES.map((_, r) => {
					const side = TN_TSIZE * TN_K;
					const x0 = TN_R + TN.cols * TN.cell + 30;
					return <Square key={`r${r}`} x={x0 + (80 - side) / 2} y={rowY(r) + TN.cell / 2 - side / 2} side={side} ink="cobalt" fill={alpha('cobalt', 0.25)} p={turn(r) >= 1 ? 1 : 0} />;
				})}
				{/* pulled apart */}
				<g opacity={progress(f, opposite)}>
					<line x1={cx - 20} x2={cx - 20 - 70 * progress(f, opposite, beat * 2)} y1={rowY(2) + TN.cell / 2} y2={rowY(2) + TN.cell / 2} stroke={color.pencil} strokeWidth={stroke.line} strokeLinecap="round" />
					<line x1={cx + 20} x2={cx + 20 + 70 * progress(f, opposite, beat * 2)} y1={rowY(2) + TN.cell / 2} y2={rowY(2) + TN.cell / 2} stroke={color.pencil} strokeWidth={stroke.line} strokeLinecap="round" />
					{[-1, 1].map((s) => {
						const x = cx + s * (20 + 70 * progress(f, opposite, beat * 2));
						const y = rowY(2) + TN.cell / 2;
						return <path key={s} d={`M${x},${y}l${-s * 13},-9M${x},${y}l${-s * 13},9`} stroke={color.pencil} strokeWidth={stroke.line} strokeLinecap="round" fill="none" />;
					})}
				</g>
			</svg>

			<At x={TN_L} y={214} w={600}>
				<Text px={size.lead} p={progress(f, prove)}>
					To prove a budget
				</Text>
			</At>
			<At x={TN_R} y={214} w={640}>
				<Text px={size.lead} p={progress(f, use)}>
					To spend a budget
				</Text>
			</At>
			<At x={TN_L} y={rowY(TN.rows) + 6} w={640}>
				<MixedLine ink="viridian" p={progress(f, differ)} parts={['the members differ']} />
				<MixedLine ink="ink" p={progress(f, orth)} parts={['orthogonality pays for the budget']} />
			</At>
			<At x={TN_R} y={rowY(TN.rows) + 6} w={640}>
				<MixedLine ink="cobalt" p={progress(f, agree)} parts={['the members agree']} />
				<MixedLine ink="ink" p={progress(f, many)} parts={['the target, many times over']} />
			</At>
			<At x={cx - 150} y={rowY(2) + TN.cell / 2 + 22} w={300} style={{textAlign: 'center'}}>
				<Text px={size.small} ink="pencil" p={progress(f, opposite + beat)}>
					opposite directions
				</Text>
			</At>
			<At x={cx - 150} y={rowY(2) - 30} w={300} style={{textAlign: 'center'}}>
				<Text px={size.small} ink="pencil" p={progress(f, jobs)}>
					one family, two jobs
				</Text>
			</At>
			<Tag kind="schematic" p={progress(f, differ)} style={{position: 'absolute', left: cx - 100, top: 914}} />
			<SceneLocator />
		</>
	);
};

// --- demands-sextic: one phase, both properties ---

// Computed: chi_n(u) for the rows u = 1 + j·omega (j = 0..7) and the 28 terms
// n of A_1(D) at D = 100 (squarefree primary n prime to 6, D < N(n) <= 2D),
// in order of norm. p = 1 + 3·omega is a primary prime of norm 7: the row
// j = 3 is u = p.
const SX_D = 100;
const SX_TERMS = termsOf(SX_D);
const SX_U: Eis[] = Array.from({length: 8}, (_, j) => [1, j]);
const SX_UTEX = SX_U.map(([, b]) => (b === 0 ? 'u=1' : b === 1 ? '1+\\omega' : `1+${b}\\omega`));
const SX_VAL = SX_U.map((u) => SX_TERMS.map((n) => chi(u, n)));
const P: Eis = [1, 3];
const P_ROW = 3;
const P_NORM = 7;
const SX_MULT = SX_TERMS.map((n) => divides(P, n));
const MULTS = SX_MULT.filter(Boolean).length;
if (P_NORM !== P[0] ** 2 - P[0] * P[1] + P[1] ** 2) throw new Error('p should have norm 7');
if (SX_VAL[P_ROW].some((v, c) => (v === null) !== SX_MULT[c])) throw new Error('chi_n(p) should vanish exactly when p | n');
if (SX_VAL[0].some((v) => v !== 0)) throw new Error('chi_n(1) should be 1');
const C0 = SX_VAL[0].findIndex((_, c) => SX_VAL.some((row) => row[c] === null)); // a column with a zero
const C1 = C0 + 1;
const pairAngles = (a: number, b: number) =>
	SX_VAL.map((row) => (row[a] === null || row[b] === null ? null : (((row[a]! - row[b]! + 6) % 6) * Math.PI) / 3));
const SX_CROSS = pairAngles(C0, C1);
const SX_SAME = pairAngles(C0, C0);
const SX_STEPS = SX_SAME.filter((a) => a !== null).length;
const SX_CROSS_SIZE = Math.hypot(...SX_CROSS.reduce<[number, number]>(([x, y], a) => (a === null ? [x, y] : [x + Math.cos(a), y + Math.sin(a)]), [0, 0]));
if (SX_CROSS_SIZE > SX_STEPS / 2) throw new Error('the chosen columns should nearly cancel');
const SX = {x: 528, y: 336, cell: 44, rows: 8, cols: SX_TERMS.length};
const SX_EXTRA = SX.y + SX.rows * SX.cell + 30; // the row u = p^6
const WHEEL = {cx: 236, cy: 520, r: 92};

export const DemandsSextic: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const both = cue('demands-2', 'The sextic phase does both');
	const fix = cue('demands-2', 'Fix a column n');
	const run = cue('demands-2', 'let u run');
	const root = cue('demands-2', 'sixth root of one');
	const zero = cue('demands-2', 'or zero');
	const changesEnd = cue('demands-2', 'changes with u', 'end');
	const different = cue('demands-2', 'Different columns');
	const orth = cue('demands-2', 'so they are orthogonal');
	const diversity = cue('demands-2', 'That is diversity');
	const s3 = start('demands-3');
	const setP = cue('demands-3', 'Now set u equal to p to the sixth');
	const primeP = cue('demands-3', 'for a prime p');
	const sixthRoot = cue('demands-3', 'A sixth root of one');
	const raised = cue('demands-3', 'raised to the sixth power');
	const isOne = cue('demands-3', 'is one', 'end');
	const becomes = cue('demands-3', 'every phase becomes one');
	const except = cue('demands-3', 'except on the terms');
	const isZero = cue('demands-3', 'where it is zero');
	const normY = cue('demands-3', 'If p has norm about Y');
	const minus = cue('demands-3', 'the target minus');
	const overY = cue('demands-3', 'D over Y terms');
	const repetition = cue('demands-3', 'That is repetition');

	// demands-2: a cursor runs down the column C0, reaching its zero on "or zero"
	const zeroRow = SX_VAL.findIndex((row) => row[C0] === null);
	const cur = f < run ? 0 : f < zero ? lerp(0, zeroRow, (f - run) / (zero - run)) : Math.min(SX.rows - 1, lerp(zeroRow, SX.rows - 1, (f - zero) / Math.max(1, changesEnd - zero)));
	const curRow = Math.round(cur);
	const curVal = SX_VAL[curRow][C0];
	const part2 = 1 - progress(f, s3, beat * 1.5);
	// demands-3: copy the row u = p down, raise to the sixth power
	const slide = progress(f, setP + beat, beat * 3, ease.inOut);
	const spin = progress(f, becomes - beat, beat * 3, ease.inOut);
	const steps = [1, 2, 3, 4, 5].map((j) => progress(f, lerp(raised, isOne, (j - 1) / 5), (isOne - raised) / 6, ease.inOut));
	const power = 1 + steps.reduce((s, x) => s + x, 0); // the pointer at zeta^power
	const wheel3 = progress(f, sixthRoot, beat);
	const extraY = lerp(SX.y + P_ROW * SX.cell, SX_EXTRA, slide);
	const lit = (r: number) => (r === 0 ? progress(f, both) : 1);
	const WALK = {x: 616, y: 904, step: 40};
	const SAME = {x: 1250, y: 904, step: 34};
	const crossEnd = walkEnd(WALK.x, WALK.y, WALK.step, SX_CROSS);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>One phase, both demands</SceneTitle>
			<At x={space.margin} y={186} style={{opacity: progress(f, both)}}>
				<Tex px={size.math * 0.8} display={false} tex={'\\arith{\\chi_n(u)}=\\Big(\\frac{u}{n}\\Big)_{6}'} />
			</At>
			<At x={520} y={204} w={1000}>
				<MixedLine p={progress(f, root)} parts={['a sixth root of one, or ', {tex: '0'}, ' when ', {tex: 'u'}, ' and ', {tex: 'n'}, ' share a prime']} />
			</At>

			{/* the table: rows u, columns the terms n */}
			<FamilyTable
				{...SX}
				grid={progress(f, 6, beat * 2)}
				at={(r, c) => ({angle: SX_VAL[r][c] === null ? null : SX_VAL[r][c]! * SIXTH, ink: r === 0 ? 'cobalt' : 'viridian', p: progress(f, 6 + r * 2, beat) * lit(r)})}
				colMarks={[
					{i: C0, ink: 'ink', p: progress(f, fix) * part2},
					{i: C1, ink: 'ink', p: progress(f, different) * part2},
					...SX_MULT.flatMap((m, c) => (m ? [{i: c, ink: 'vermilion' as const, p: 0.6 * progress(f, except) * (1 - progress(f, repetition, beat * 2))}] : [])),
				]}
				rowMarks={[
					{i: P_ROW, ink: 'ink', p: window(f, setP, becomes)},
					{i: 0, ink: 'cobalt', p: progress(f, repetition)},
				]}
				band={f >= run && f < changesEnd + beat * 2 ? {r: curRow, p: 1 - progress(f, changesEnd, beat * 2)} : undefined}
			/>
			{SX_UTEX.map((t, r) => (
				<At key={r} x={SX.x - 130} y={SX.y + r * SX.cell + 6} w={118} style={{textAlign: 'right', opacity: progress(f, 6 + r * 2)}}>
					<Tex tex={t} px={size.small} ink={r === 0 ? 'cobalt' : r === P_ROW && progress(f, primeP) > 0 ? 'ink' : 'pencil'} display={false} />
				</At>
			))}
			<At x={SX.x} y={SX.y - 40} w={SX.cols * SX.cell}>
				<MixedLine px={size.small} p={progress(f, fix - beat)} parts={['columns: the ', {tex: `${SX_TERMS.length}`}, ' terms ', {tex: 'n'}, ' of ', {tex: 'A_1(D)'}, ' at ', {tex: `D=${SX_D}`}, ', by norm']} />
			</At>
			<Tag kind="computed" p={progress(f, fix)} style={{position: 'absolute', left: SX.x + SX.cols * SX.cell - 200, top: SX.y - 40}} />

			{/* the row u = p^6 */}
			<FamilyTable
				x={SX.x}
				y={extraY}
				cell={SX.cell}
				rows={1}
				cols={SX.cols}
				grid={slide}
				at={(_, c) => {
					const v = SX_VAL[P_ROW][c];
					return {angle: v === null ? null : v * SIXTH * (1 + 5 * spin), ink: v === null ? (progress(f, isZero) > 0 ? 'vermilion' : 'viridian') : spin >= 1 ? 'cobalt' : 'viridian', p: slide};
				}}
				rowMarks={[{i: 0, ink: 'cobalt', p: progress(f, repetition)}]}
			/>
			<At x={SX.x - 130} y={SX_EXTRA + 6} w={118} style={{textAlign: 'right', opacity: slide}}>
				<Tex tex={spin > 0.5 ? 'u=p^{6}' : 'u=p'} px={size.small} ink={spin > 0.5 ? 'cobalt' : 'ink'} display={false} />
			</At>
			<At x={SX.x - 330} y={SX_EXTRA + 54} w={318} style={{textAlign: 'right', opacity: progress(f, primeP), whiteSpace: 'nowrap'}}>
				<MixedLine px={size.small} ink="ink" parts={[{tex: 'p=1+3\\omega'}, ', a prime']} />
			</At>

			{/* the wheel: the column's values as u runs, then powers of a root */}
			<div style={{opacity: progress(f, run - beat) * part2}}>
				<RootWheel
					cx={WHEEL.cx}
					cy={WHEEL.cy}
					r={WHEEL.r}
					lit={curVal === null ? [] : [curVal]}
					pointer={{angle: curVal ?? 0, len: curVal === null ? 0 : 1}}
					center={{ink: 'ink', p: curVal === null ? 1 : 0}}
				/>
				<At x={WHEEL.cx - 130} y={WHEEL.cy + WHEEL.r + 34} w={260} style={{textAlign: 'center', whiteSpace: 'nowrap'}}>
					<Tex px={size.small} display={false} tex={`\\chi_n(${SX_UTEX[curRow].replace('u=', '')})=${curVal === null ? '0' : ROOT_TEX[curVal]}`} ink="viridian" />
				</At>
			</div>
			<div style={{opacity: wheel3 * (1 - progress(f, minus, beat * 2))}}>
				<RootWheel
					cx={WHEEL.cx}
					cy={WHEEL.cy}
					r={WHEEL.r}
					lit={steps[4] >= 1 ? [0] : []}
					pointer={{angle: power, len: 1}}
					trail={{from: 1, to: power, opacity: 0.6}}
				/>
				<At x={WHEEL.cx - 116} y={WHEEL.cy + WHEEL.r + 34} w={232} style={{textAlign: 'center'}}>
					<Tex
						px={size.label}
						display={false}
						tex={'\\htmlClass{a}{\\zeta,}\\,\\htmlClass{b}{\\zeta^{2},}\\,\\htmlClass{c}{\\ldots,}\\,\\htmlClass{d}{\\zeta^{6}=1}'}
						show={{a: wheel3, b: steps[0], c: steps[2], d: steps[4]}}
					/>
				</At>
			</div>

			{/* demands-2: two columns, multiplied row by row and added */}
			<div style={{opacity: part2}}>
				<PhaseWalk x={WALK.x} y={WALK.y} step={WALK.step} angles={SX_CROSS} shown={SX.rows * progress(f, orth, beat * 3, ease.inOut)} p={progress(f, orth)} />
				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: progress(f, orth + beat * 3)}}>
					<circle cx={crossEnd[0]} cy={crossEnd[1]} r={12} fill="none" stroke={color.viridian} strokeWidth={stroke.line} />
				</svg>
				<At x={WALK.x + 110} y={WALK.y - 100} w={520}>
					<MixedLine px={size.small} ink="viridian" p={progress(f, orth)} parts={['two columns, row by row: ', {tex: '\\sum_u\\chi_n(u)\\overline{\\chi_{n\'}(u)}', ink: 'viridian'}]} />
					<MixedLine px={size.small} ink="viridian" p={progress(f, orth + beat * 2)} parts={['the steps turn and come back']} />
				</At>
				<PhaseWalk x={SAME.x} y={SAME.y} step={SAME.step} angles={SX_SAME} shown={SX.rows * progress(f, orth + beat * 2, beat * 2)} ink="ink" p={progress(f, orth + beat * 2)} />
				<At x={SAME.x} y={SAME.y - 50} w={460} style={{whiteSpace: 'nowrap'}}>
					<MixedLine px={size.small} p={progress(f, orth + beat * 2)} parts={['one column with itself: ', {tex: `${SX_STEPS}`}, ' steps in a line']} />
				</At>
				<At x={1560} y={760} w={240}>
					<Text px={size.lead} ink="viridian" italic p={progress(f, diversity)}>
						diversity
					</Text>
				</At>
			</div>

			{/* demands-3: the row is the target, less the terms p divides */}
			<At x={SX.x} y={SX_EXTRA + SX.cell + 30} w={1300} style={{opacity: progress(f, minus)}}>
				<Tex
					px={size.label + 6}
					display={false}
					tex={'A_{p^{6}}(D)=\\target{A_1(D)}-\\debt{\\textstyle\\sum_{p\\mid n}\\mu(n)\\nu(n)W(\\N n/D)}\\htmlClass{o}{\\ =\\ \\target{A_1(D)}+\\debt{O(D/Y)}}'}
					show={{o: progress(f, overY)}}
				/>
			</At>
			<At x={SX.x} y={SX_EXTRA + SX.cell + 92} w={1100}>
				<MixedLine
					px={size.small}
					ink="vermilion"
					p={progress(f, overY + beat)}
					parts={['here ', {tex: `${MULTS}`, ink: 'vermilion'}, ' of the ', {tex: `${SX_TERMS.length}`, ink: 'vermilion'}, ' terms: about ', {tex: `${SX_TERMS.length}/${P_NORM}`, ink: 'vermilion'}, '; in general about ', {tex: 'D/Y', ink: 'vermilion'}]}
				/>
			</At>
			<At x={SX.x - 330} y={SX_EXTRA + 92} w={318} style={{textAlign: 'right', opacity: progress(f, normY), whiteSpace: 'nowrap'}}>
				<MixedLine px={size.small} ink="ink" parts={[{tex: `\\N(p)=${P_NORM}\\approx Y`}]} />
			</At>
			<At x={1500} y={SX_EXTRA + SX.cell + 92} w={300}>
				<Text px={size.lead} ink="cobalt" italic p={progress(f, repetition)}>
					repetition
				</Text>
			</At>

			<SceneLocator />
			<Cite p={progress(f, both)}>October manuscript, §2.2, (2.4)</Cite>
		</>
	);
};

// --- demands-ladder: copies are rare; the dial over the order of the twist ---

// Schematic: the rows as a field of squares, H of them; the copies (cobalt)
// number about H^{1/k} for a twist of order k.
const FLD = {x: 200, y: 624, cols: 38, rows: 12, cell: 20};
const FLD_N = FLD.cols * FLD.rows;
const FLD_SIDE = Array.from({length: FLD_N}, (_, i) => 3 + 12 * seeded(i, 41) ** 1.6);
const FLD_ORDER = Array.from({length: FLD_N}, (_, i) => i).sort((a, b) => seeded(a, 77) - seeded(b, 77));
const FLD_RANK = (() => {
	const r = new Array<number>(FLD_N);
	FLD_ORDER.forEach((i, k) => (r[i] = k));
	return r;
})();
const COPY_SIDE = 14;
const DIAL = {cx: 1420, cy: 820, r: 280};
if (Math.abs(exponentAt(6, 0.1) - (11 / 12 + 0.5 / 12)) > 1e-12) throw new Error('e(6) should be 11/12 + 5 theta/12');
if (exponentAt(1, 0.1) !== 0.5) throw new Error('e(1) should be 1/2');

export const DemandsLadder: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	// demands-4
	const rarity = cue('demands-4', 'The price of repetition');
	const sixthP = cue('demands-4', 'Copies sit only at sixth powers');
	const forP = cue('demands-4', 'For p to the sixth to be a row');
	const atMostH = cue('demands-4', 'can be at most H');
	const oneSixth = cue('demands-4', 'H to the one sixth');
	const callY = cue('demands-4', 'Call that Y');
	const aboutY = cue('demands-4', 'about Y copies');
	const log = cue('demands-4', 'up to a logarithm');
	const notH = cue('demands-4', 'not H of them');
	// demands-5
	const s5 = start('demands-5');
	const own = cue('demands-5', 'this film’s own arithmetic');
	const orderK = cue('demands-5', 'If the twist had order k');
	const atPk = cue('demands-5', 'sit at p to the k');
	const dial = cue('demands-5', 'the exponent on the dial');
	const kSix = cue('demands-5', 'At k equal to six');
	const elevenAt = cue('demands-5', 'eleven twelfths');
	const fiveTheta = cue('demands-5', 'five theta over twelve');
	const lower = cue('demands-5', 'Lower orders give more copies');
	const lowerEnd = cue('demands-5', 'smaller exponents', 'end');
	// demands-6
	const s6 = start('demands-6');
	const bottom = cue('demands-6', 'At the bottom of the dial');
	const noTwist = cue('demands-6', 'no twist at all');
	const everyRow = cue('demands-6', 'every row would be nearly the target');
	const rh = cue('demands-6', 'the Riemann hypothesis');
	const noOrth = cue('demands-6', 'that family has no orthogonality');
	const nobody = cue('demands-6', 'nobody can prove its budget');
	const meets = cue('demands-6', 'The sixth power is where');
	const land = cue('demands-6', 'diverse enough to prove');

	// the order of the twist: 6; then 3 and 12 as examples; back to 6; down to
	// 2 and to 1; and back to 6
	const kDown = progress(f, lower, lowerEnd - lower, ease.inOut);
	const kBottom = progress(f, bottom, beat * 3, ease.inOut);
	const kBack = progress(f, meets, beat * 4, ease.inOut);
	let k = 6;
	k = lerp(k, 3, progress(f, atPk, beat * 3, ease.inOut));
	k = lerp(k, 12, progress(f, dial, kSix - dial, ease.inOut));
	k = lerp(k, 6, progress(f, kSix, beat * 3, ease.inOut));
	k = lerp(k, 2, kDown);
	k = lerp(k, 1, kBottom);
	k = lerp(k, 6, kBack);
	const copies = Math.min(FLD_N, FLD_N ** (1 / k)); // about H^{1/k}
	const allTarget = progress(f, everyRow, beat * 3) * (1 - kBack);
	const phase1 = 1 - progress(f, s5, beat * 1.5);
	const dialP = progress(f, own, beat * 2);
	const fieldShow = progress(f, 4, beat * 3);
	const dead = progress(f, noOrth) * (1 - kBack);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Where provable meets useful</SceneTitle>

			{/* the rows, and the copies among them */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: fieldShow}}>
				{FLD_SIDE.map((s, i) => {
					const cx = FLD.x + (i % FLD.cols) * FLD.cell + FLD.cell / 2;
					const cy = FLD.y + Math.floor(i / FLD.cols) * FLD.cell + FLD.cell / 2;
					const rank = FLD_RANK[i];
					const copy = Math.max(0, Math.min(1, copies - rank)) * progress(f, sixthP, beat * 2);
					const c = Math.max(copy, allTarget);
					const side = lerp(s, COPY_SIDE, c);
					return <rect key={i} x={cx - side / 2} y={cy - side / 2} width={side} height={side} fill={c > 0.5 ? color.cobalt : alpha('ink', 0.55)} />;
				})}
				<Frame x={FLD.x - 10} y={FLD.y - 10} w={FLD.cols * FLD.cell + 20} h={FLD.rows * FLD.cell + 20} ink="vermilion" dash="10 8" p={dead} width={stroke.bold} />
			</svg>
			<At x={FLD.x} y={FLD.y + FLD.rows * FLD.cell + 16} w={760} style={{whiteSpace: 'nowrap'}}>
				<MixedLine px={size.small} p={progress(f, sixthP)} parts={['each square a row, ', {tex: 'H'}, ' in all; cobalt: the copies, about ', {tex: 'H^{1/k}'}]} />
			</At>
			<Tag kind="schematic" p={fieldShow} style={{position: 'absolute', left: FLD.x + FLD.cols * FLD.cell - 190, top: FLD.y - 44}} />

			{/* demands-4: the sixth-power ladder, Y = H^{1/6} */}
			<div style={{opacity: phase1}}>
				<NormLadder
					x={FLD.x + 20}
					y={420}
					w={720}
					p={progress(f, sixthP, beat * 2)}
					yLit={progress(f, forP, beat * 2)}
					arrow={progress(f, forP + beat, oneSixth - forP, ease.inOut)}
					reach={progress(f, forP + beat, oneSixth - forP, ease.inOut)}
					family={progress(f, atMostH)}
					sixth={progress(f, callY)}
				/>
				<At x={1060} y={300} w={740}>
					<div style={{opacity: progress(f, forP)}}>
						<Tex px={size.math * 0.8} display={false} tex={'\\N(p^{6})=\\N(p)^{6}\\le H'} />
					</div>
					<div style={{marginTop: 22, opacity: progress(f, oneSixth)}}>
						<Tex px={size.math * 0.8} display={false} tex={'\\N(p)\\le H^{1/6}\\htmlClass{y}{\\;=\\;Y}'} show={{y: progress(f, callY)}} />
					</div>
					<div style={{marginTop: 34, opacity: progress(f, aboutY)}}>
						<MixedLine ink="ink" parts={['copies: ', {tex: 'J\\asymp Y/\\log Y', ink: 'cobalt'}]} />
						<MixedLine px={size.small} p={progress(f, log)} parts={['primes of norm about ', {tex: 'Y'}, ', by Landau’s prime ideal theorem']} />
					</div>
					<div style={{marginTop: 26, opacity: progress(f, notH)}}>
						<MixedLine ink="ink" parts={['rows: about ', {tex: 'H'}, ', and ', {tex: 'Y=H^{1/6}\\ll H'}]} />
					</div>
				</At>
				<Cite p={progress(f, forP)}>October manuscript, §3</Cite>
			</div>

			{/* demands-5 and 6: the film's arithmetic over the order k */}
			<At x={space.margin} y={196} w={900}>
				<Text px={size.label} ink="pencil" italic p={progress(f, own) * (1 - progress(f, bottom, beat))}>
					This film’s own arithmetic, not a claim from the paper.
				</Text>
			</At>
			<At x={space.margin} y={196} w={900}>
				<Text px={size.label} ink="pencil" italic p={progress(f, bottom + beat) * (1 - progress(f, meets, beat))}>
					A thought experiment, not a claim.
				</Text>
			</At>
			<At x={space.margin} y={256} w={900} style={{opacity: progress(f, orderK) * (1 - progress(f, meets, beat * 1.5))}}>
				<MixedLine
					ink="ink"
					parts={['a twist of order ', {tex: 'k'}, ': copies at ', {tex: 'p^{k}'}, ', so ', {tex: '\\N(p)^{k}\\le H'}, ' and ', {tex: 'Y=H^{1/k}'}]}
					p={progress(f, orderK)}
				/>
				<div style={{marginTop: 14, opacity: progress(f, dial)}}>
					<MixedLine ink="ink" parts={['the same spending: ', {tex: '|A_1(D)|\\ll D^{\\,e(k)+\\varepsilon}'}]} />
				</div>
			</At>
			<ExponentDial cx={DIAL.cx} cy={DIAL.cy} r={DIAL.r} k={k} p={dialP} lit={progress(f, kSix) * (1 - dead)} />
			<Tag kind="schematic" p={dialP} style={{position: 'absolute', left: DIAL.cx - 100, top: DIAL.cy + 86}} />

			{/* k = 6: the manuscript's case */}
			<div style={{opacity: progress(f, elevenAt) * (1 - progress(f, bottom, beat * 1.5))}}>
				<At x={space.margin} y={356} w={130} style={{textAlign: 'center'}}>
					<Fraction n="11" d="12" px={100} />
				</At>
				<At x={space.margin + 140} y={418} w={200}>
					<Tex px={size.math} display={false} tex={'+\\ \\tfrac{5\\vartheta}{12}'} ink="cobalt" style={{opacity: progress(f, fiveTheta)}} />
				</At>
			</div>
			<At x={space.margin + 360} y={392} w={480}>
				<MixedLine px={size.small} p={progress(f, kSix) * (1 - progress(f, bottom, beat))} parts={['at ', {tex: 'k=6', ink: 'cobalt'}, ': the October manuscript’s exponent']} />
				<MixedLine px={size.small} style={{marginTop: 10}} p={progress(f, lower) * (1 - progress(f, bottom, beat))} parts={['lower ', {tex: 'k'}, ': more copies, smaller exponents']} />
			</At>
			<Cite p={progress(f, kSix) * (1 - progress(f, bottom, beat))}>October manuscript, §3 (for k = 6)</Cite>

			{/* k = 1: the thought experiment, and why it fails */}
			<At x={space.margin} y={384} w={880} style={{opacity: progress(f, rh) * (1 - progress(f, meets, beat * 1.5))}}>
				<MixedLine ink="ink" parts={['no twist, ', {tex: 'k=1'}, ': every row nearly the target, ', {tex: 'e(1)=\\tfrac12'}]} />
				<MixedLine ink="ink" style={{marginTop: 6}} parts={['that is, the Riemann hypothesis for ', {tex: 'L_K(s,\\nu)'}]} />
			</At>
			<At x={space.margin} y={490} w={880} style={{opacity: progress(f, noOrth) * (1 - progress(f, meets, beat * 1.5))}}>
				<MixedLine ink="vermilion" parts={['but no orthogonality']} />
				<MixedLine ink="vermilion" p={progress(f, nobody)} parts={['and no one can prove its budget']} />
			</At>
			<At x={DIAL.cx - DIAL.r + 30} y={DIAL.cy - 112} w={300} style={{opacity: progress(f, noTwist) * (1 - progress(f, meets, beat * 1.5))}}>
				<MixedLine px={size.small} ink="ink" parts={[{tex: 'e=\\tfrac12'}, ': the Riemann', ' hypothesis line']} />
			</At>

			{/* the landing */}
			<At x={space.margin} y={250} w={880}>
				<MixedLine ink="ink" p={progress(f, meets + beat * 2)} parts={['at ', {tex: 'k=6', ink: 'cobalt'}, ': orthogonal columns, and copies at sixth powers']} />
				<Text px={size.lead} ink="ink" p={progress(f, land)} style={{marginTop: 40}}>
					Diverse enough to prove,
				</Text>
				<Text px={size.lead} ink="ink" p={progress(f, cue('demands-6', 'repetitive enough to spend'))}>
					repetitive enough to spend.
				</Text>
			</At>

			<SceneLocator />
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'demands-tension': DemandsTension,
	'demands-sextic': DemandsSextic,
	'demands-ladder': DemandsLadder,
};
