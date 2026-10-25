import type React from 'react';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Cite, Fraction, Tag} from '../design/primitives';
import {At, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {beat, ease, size, space} from '../design/tokens';
import {MixedLine} from '../diagrams/MixedLine';
import {ANNULUS, ANNULUS_Y, CopyScatter, PrimeAnnulus} from '../diagrams/SpendCopies';
import {DROP_FRAME, DropFrame, dropLevels} from '../diagrams/SpendDrop';
import {CopiesInBudget, LitLedger, TwiceSquares, twiceLayout} from '../diagrams/SpendLedger';
import {OUT_CELLS, OUT_T, OUT_W, OutlierRow} from '../diagrams/SpendOutliers';

// Chapter 4: Spending it. October manuscript, §2.2 and §3 (the proof of
// Theorem 1.1 from Proposition 3.1, equation (3.2)); the coda points to the
// September manuscript's proof overview.

const BUDGET = '\\sum_{0<\\N(u)\\le H}|A_u(D)|^2\\ll D^{2+\\vartheta+\\varepsilon}';
const RIGHT = 1000; // the right-hand column of the first scene

// --- spend-copies: primes of norm about Y, whose sixth powers are copies ---

const LAT = {cx: 470, cy: 596, unit: 14.5};
const SC = {x: 236, y: 776, w: 560, h: 410};

export const SpendCopies: React.FC = () => {
	const {frame: f, cue} = useCues();
	const how = cue('spend-1', 'Here is how the budget is spent');
	const primary = cue('spend-1', 'primary prime p');
	const between = cue('spend-1', 'between Y over two and Y');
	const landau = cue('spend-1', 'Landau’s prime ideal theorem');
	const about = cue('spend-1', 'about Y over log Y');
	const callJ = cue('spend-1', 'Call that number J');
	const sixth = cue('spend-1', 'Their sixth powers');
	const distinct = cue('spend-1', 'distinct rows');
	const target = cue('spend-1', 'each of those rows is the target');
	const error = cue('spend-1', 'up to an error');
	const dy = cue('spend-1', 'D over Y');

	const swap = progress(f, target - beat, beat * 1.5, ease.inOut);
	const rOut = LAT.unit * Math.sqrt(ANNULUS_Y);
	const rIn = LAT.unit * Math.sqrt(ANNULUS_Y / 2);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Copies of the target</SceneTitle>

			{/* left: the primes, then the computed differences */}
			<div style={{opacity: 1 - swap}}>
				<PrimeAnnulus
					{...LAT}
					p={progress(f, 4, beat * 4, ease.inOut)}
					primes={progress(f, primary, beat * 3, ease.inOut)}
					annulus={progress(f, between, beat * 2)}
					pulse={window(f, callJ, sixth)}
				/>
				<At x={LAT.cx - 60} y={LAT.cy - rIn - 2} w={120} style={{textAlign: 'center', opacity: progress(f, between)}}>
					<Tex px={size.small} ink="pencil" display={false} tex={'\\tfrac{Y}{2}'} />
				</At>
				<At x={LAT.cx - 60} y={LAT.cy - rOut - 40} w={120} style={{textAlign: 'center', opacity: progress(f, between)}}>
					<Tex px={size.small} ink="pencil" display={false} tex={'Y'} />
				</At>
				<At x={space.margin} y={196} w={760}>
					<MixedLine
						p={progress(f, callJ)}
						px={size.small}
						parts={['a picture at ', {tex: `Y=${ANNULUS_Y}`}, ': ', {tex: `J=${ANNULUS.J}`, ink: 'viridian'}, ' primary primes']}
					/>
				</At>
			</div>
			<div style={{opacity: swap}}>
				<CopyScatter {...SC} p={progress(f, target, beat * 2)} points={progress(f, target + beat, beat * 4, ease.inOut)} line={progress(f, dy, beat * 2, ease.inOut)} />
				<At x={SC.x - 6} y={SC.y - SC.h - 58} w={700}>
					<MixedLine px={size.small} ink="vermilion" parts={['terms of ', {tex: 'A_1(D)', ink: 'vermilion'}, ' that ', {tex: 'p', ink: 'vermilion'}, ' divides: where the copy differs']} />
				</At>
				<At x={SC.x + SC.w + 18} y={SC.y - 26} w={120}>
					<Tex px={size.label} ink="pencil" display={false} tex={'D/\\N(p)'} />
				</At>
				<At x={SC.x - 6} y={SC.y + 46} w={760}>
					<MixedLine p={progress(f, dy)} px={size.small} parts={[{tex: '\\N(p)=7'}, ' to ', {tex: '43'}, ', ', {tex: 'D=2000'}, ' to ', {tex: '20000'}, ': about ', {tex: 'D/\\N(p)'}, ' of them']} />
					<MixedLine p={progress(f, dy + beat)} px={size.small} parts={['computed directly; at this scale ', {tex: 'p^{6}'}, ' is not yet a row of the family']} />
				</At>
			</div>
			<Tag kind="computed" p={progress(f, primary)} style={{position: 'absolute', left: space.margin, top: 924}} />

			{/* right: the manuscript's statements, as they are spoken */}
			<At x={RIGHT} y={196} w={792}>
				<MixedLine p={progress(f, how)} parts={['the budget: ', {tex: BUDGET, ink: 'cobalt'}]} />
			</At>
			<At x={RIGHT} y={286} style={{opacity: progress(f, between)}}>
				<Tex px={size.math * 0.75} tex={'\\tfrac{Y}{2}<\\N(\\arith{p})\\le Y,\\qquad \\arith{p}\\notin S'} />
			</At>
			<At x={RIGHT} y={384} w={792}>
				<MixedLine p={progress(f, landau)} parts={['Landau’s prime ideal theorem counts them:']} />
			</At>
			<At x={RIGHT} y={430} style={{opacity: progress(f, about)}}>
				<Tex px={size.math * 0.75} tex={'\\htmlClass{j}{J\\asymp{}}Y/\\log Y'} show={{j: progress(f, callJ)}} />
			</At>
			<At x={RIGHT} y={540} style={{opacity: progress(f, sixth)}}>
				<Tex px={size.math * 0.75} tex={'u=\\arith{p}^{6}:\\quad \\N(u)=\\N(\\arith{p})^{6}\\le Y^{6}=H'} />
			</At>
			<At x={RIGHT} y={612} w={792}>
				<MixedLine p={progress(f, distinct)} px={size.small} parts={['with ', {tex: 'Y=H^{1/6}'}, ': distinct primes, distinct rows']} />
			</At>
			<At x={RIGHT} y={716} style={{opacity: progress(f, target)}}>
				<Tex px={size.math * 0.9} tex={'A_{p^{6}}(D)=\\target{A_1(D)}\\htmlClass{e}{\\,+\\,\\debt{O_W(D/Y)}}'} show={{e: progress(f, error)}} />
			</At>
			<Tag kind="claim" p={progress(f, between)} style={{position: 'absolute', left: RIGHT, top: 824}} />

			<SceneLocator />
			<Cite p={progress(f, between)}>October manuscript, §3; equation (2.4)</Cite>
		</>
	);
};

// --- spend-drop: keep the copies, drop the rest ---

const DF = {x: 150, y: 222};
const COL = {x: 836, w: 90};
const ROW = {x: 1110, y: 720, gap: 22};

export const SpendDrop: React.FC = () => {
	const {frame: f, cue} = useCues();
	const covers = cue('spend-2', 'The budget covers every row');
	const keep = cue('spend-2', 'Keep only the J copies');
	const drop = cue('spend-2', 'drop the rest');
	const contributes = cue('spend-2', 'contributes a square');
	const never = cue('spend-2', 'squares are never negative');
	const left = cue('spend-2', 'what is left is at most the whole');
	const mayDrop = cue('spend-2', 'You may drop any part');
	const everyPart = cue('spend-2', 'because every part is a square');
	const keepT = cue('spend-2', 'What you keep is the target');
	const many = cue('spend-2', 'many times over');
	const lv = dropLevels(DF.y);
	const bottom = DF.y + DROP_FRAME.h;
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Keep the copies</SceneTitle>
			<DropFrame
				{...DF}
				colX={COL.x}
				colW={COL.w}
				row={ROW}
				frameP={progress(f, 4, beat * 2)}
				fill={progress(f, 4, beat * 3, ease.inOut)}
				column={progress(f, covers + beat, beat * 4, ease.inOut)}
				copies={progress(f, keep, beat * 1.5)}
				drop={progress(f, drop, beat * 2)}
				collapse={progress(f, drop + beat, beat * 3, ease.inOut)}
				levels={progress(f, left)}
				lift={progress(f, keepT, beat * 3)}
				pulse={window(f, everyPart, keepT, beat)}
			/>
			<At x={DF.x} y={bottom + 16} w={660}>
				<MixedLine p={progress(f, covers)} parts={['the budget frame holds every row']} />
				<MixedLine p={progress(f, covers)} parts={[{tex: BUDGET, ink: 'cobalt'}]} />
			</At>
			<At x={COL.x - 30} y={bottom + 16} w={COL.w + 60} style={{textAlign: 'center'}}>
				<MixedLine p={progress(f, covers + beat * 2)} px={size.small} parts={['by area']} />
			</At>
			<At x={COL.x + COL.w + 34} y={lv.whole - 20} w={150}>
				<MixedLine p={progress(f, left)} px={size.small} ink="ink" parts={['the whole']} />
			</At>
			<At x={COL.x + COL.w + 34} y={lv.kept - 20} w={150}>
				<MixedLine p={progress(f, left)} px={size.small} ink="cobalt" parts={['kept']} />
			</At>

			{/* the reason, then the inequality */}
			<At x={ROW.x} y={262} w={682}>
				<MixedLine p={progress(f, contributes)} parts={['every row contributes a square']} />
			</At>
			<At x={ROW.x} y={308} style={{opacity: progress(f, contributes)}}>
				<Tex px={size.math * 0.85} tex={'|A_u(D)|^{2}\\htmlClass{g}{\\;\\ge\\;0}'} show={{g: progress(f, never)}} />
			</At>
			<At x={ROW.x} y={410} style={{opacity: progress(f, left)}}>
				<Tex
					px={size.label * 1.2}
					tex={'\\underbrace{\\sum_{p}|A_{p^{6}}(D)|^{2}}_{\\text{the copies}}\\;\\le\\;\\underbrace{\\sum_{0<\\N(u)\\le H}|A_u(D)|^{2}}_{\\text{every row}}'}
				/>
			</At>
			<At x={ROW.x} y={590} w={682}>
				<MixedLine p={progress(f, mayDrop)} ink="ink" parts={['Drop any part of an energy:']} />
				<MixedLine p={progress(f, everyPart)} ink="ink" parts={['what is left is never more.']} />
			</At>

			{/* the copies, lifted out */}
			<At x={ROW.x} y={ROW.y + 76} w={680}>
				<MixedLine p={progress(f, keepT + beat * 2)} px={size.small} parts={[{tex: 'J'}, ' copies, each ', {tex: '\\target{A_1(D)}+\\debt{O(D/Y)}'}]} />
				<MixedLine p={progress(f, many)} px={size.small} ink="cobalt" parts={['the target, many times over']} />
			</At>
			<Tag kind="schematic" p={progress(f, covers)} style={{position: 'absolute', left: space.margin, top: 924}} />

			<SceneLocator />
			<Cite p={progress(f, left)}>October manuscript, §3</Cite>
		</>
	);
};

// --- spend-chain: the inequality, the average, and the exponent ---

const TW = {x: 1196, y: 404, unit: 120};

export const SpendChain: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const each = cue('spend-3', 'For each copy');
	const tsq = cue('spend-3', 'the target squared');
	const twiceCopy = cue('spend-3', 'twice the copy squared');
	const twiceErr = cue('spend-3', 'plus twice the error squared');
	const avg = cue('spend-3', 'Average over the J copies');
	const twoJ = cue('spend-3', 'two over J');
	const energyCopies = cue('spend-3', 'times the energy of the copies');
	const errSq = cue('spend-3', 'plus the error squared');
	const copiesBudget = cue('spend-3', 'And the energy of the copies');
	const atMost = cue('spend-3', 'is at most the budget');

	const put = start('spend-4');
	const budgetIs = cue('spend-4', 'The budget is D');
	const dividing = cue('spend-4', 'Dividing by J');
	const sixthRoot = cue('spend-4', 'the sixth root of H');
	const remains = cue('spend-4', 'What remains');
	const fiveSix = cue('spend-4', 'five theta over six');
	const errTerm = cue('spend-4', 'The error term');
	const minusThird = cue('spend-4', 'minus theta over three');
	const smaller = cue('spend-4', 'which is smaller');
	const root = cue('spend-4', 'Take the square root');
	const e12 = cue('spend-4', 'eleven twelfths');
	const f12 = cue('spend-4', 'five theta over twelve');
	const small = cue('spend-4', 'Then let theta be small');

	const phaseA = 1 - progress(f, put - beat, beat * 2);
	const rise = progress(f, put, beat * 2.5, ease.inOut);
	const tw = twiceLayout(TW.x, TW.unit);
	const L = {x: 168, y: 342, w: 1320, amountW: 440, rowH: 68, px: size.body * 0.95};
	const after = L.y + L.rowH * 7 + 18;
	return (
		<>
			<SceneTitle p={progress(f, 4)}>From the budget to the target</SceneTitle>

			{/* spend-3: one copy, the average, the budget */}
			<div style={{opacity: phaseA}}>
				<At x={space.margin} y={200} style={{opacity: progress(f, each)}}>
					<Tex
						px={size.math * 0.75}
						tex={'|\\htmlClass{a}{A_1(D)}|^2\\le\\htmlClass{b}{2\\,|A_{p^6}(D)|^2}\\htmlClass{e}{{}+2\\,|\\debt{A_1(D)-A_{p^6}(D)}|^2}'}
						light={{a: {ink: 'cobalt', p: progress(f, tsq)}}}
						show={{b: progress(f, twiceCopy), e: progress(f, twiceErr)}}
					/>
				</At>
				<At x={TW.x} y={208} w={600}>
					<MixedLine p={progress(f, each)} px={size.small} parts={['for any two numbers ', {tex: 'a'}, ' and ', {tex: 'b'}, ':']} />
				</At>
				<TwiceSquares {...TW} a={progress(f, tsq, beat * 1.5)} b={progress(f, twiceCopy, beat * 2)} e={progress(f, twiceErr, beat * 2)} />
				{[
					{x: TW.x + TW.unit / 2, tex: '|a|^2', at: tsq},
					{x: tw.le + tw.B + 7, tex: '2|b|^2', at: twiceCopy},
					{x: tw.plus + 30 + tw.E + 5, tex: '2|a-b|^2', at: twiceErr},
				].map((l) => (
					<At key={l.tex} x={l.x - 80} y={TW.y + 12} w={160} style={{textAlign: 'center', opacity: progress(f, l.at)}}>
						<Tex px={size.label} display={false} tex={l.tex} />
					</At>
				))}
				<At x={TW.x} y={TW.y + 62} w={600}>
					<MixedLine p={progress(f, twiceErr)} px={size.small} parts={['the copy is nearly the target: the 2 is room to spare']} />
				</At>
				<At x={space.margin} y={556} style={{opacity: progress(f, copiesBudget)}}>
					<Tex px={size.math * 0.72} tex={'\\sum_{p}|A_{p^{6}}(D)|^2\\;\\le\\;\\sum_{0<\\N(u)\\le H}|A_u(D)|^2\\;\\ll\\;\\target{D^{2+\\vartheta+\\varepsilon}}'} />
				</At>
				<At x={space.margin} y={704} w={1000}>
					<MixedLine p={progress(f, atMost)} px={size.small} parts={['the copies are some of the rows, and a part of an energy is at most the whole']} />
				</At>
				<At x={space.margin} y={482} w={1000}>
					<MixedLine p={progress(f, errSq)} px={size.small} parts={['each error is ', {tex: '|A_1(D)-A_{p^6}(D)|\\ll_W D/Y', ink: 'vermilion'}]} />
				</At>
				<CopiesInBudget x={TW.x} y={560} avg={progress(f, avg, beat * 2)} frame={progress(f, copiesBudget, beat * 2)} />
				<At x={TW.x} y={830} w={560}>
					<MixedLine p={progress(f, avg)} px={size.small} parts={['the ', {tex: 'J'}, ' copies, each with its error, averaged']} />
					<MixedLine p={progress(f, atMost)} px={size.small} ink="ink" parts={['and all of them inside the budget']} />
				</At>
			</div>

			{/* the average: it stays, and rises to head the ledger */}
			<At x={space.margin} y={lerp(338, 196, rise)} style={{opacity: progress(f, avg)}}>
				<Tex
					px={size.math * 0.8}
					tex={'|\\target{A_1(D)}|^2\\le\\htmlClass{tj}{\\frac{2}{J}}\\htmlClass{s}{\\sum_{p}|A_{p^{6}}(D)|^2}+\\htmlClass{o}{O_W\\!\\big(D^2/Y^2\\big)}'}
					light={{o: {ink: 'vermilion', p: progress(f, errSq)}}}
					show={{tj: progress(f, twoJ), s: progress(f, energyCopies) * 0.75 + 0.25, o: progress(f, errSq)}}
				/>
			</At>

			{/* spend-4: the numbers, as a ledger */}
			<LitLedger
				{...L}
				heading={{label: 'Putting in the numbers', amount: 'size', p: progress(f, put)}}
				rules={progress(f, put)}
				rows={[
					{label: ['the budget: every row, so the copies too'], amount: 'D^{2+\\vartheta+\\varepsilon}', kind: 'budget', p: progress(f, budgetIs), light: window(f, budgetIs, dividing)},
					{
						label: ['divided by ', {tex: 'J\\asymp Y/\\log Y'}, ': about ', {tex: 'Y=H^{1/6}'}],
						amount: '\\div\\,D^{\\frac{1+\\vartheta}{6}}',
						kind: 'payment',
						p: progress(f, dividing),
						light: window(f, sixthRoot, remains),
					},
					{
						label: ['the copies’ share, exponent ', {tex: '2+\\vartheta-\\tfrac{1+\\vartheta}{6}'}],
						amount: 'D^{\\htmlClass{a}{\\frac{11}{6}}\\htmlClass{b}{+\\frac{5\\vartheta}{6}}+\\varepsilon}',
						amountShow: {b: progress(f, fiveSix)},
						kind: 'entry',
						p: progress(f, remains),
						light: window(f, remains, errTerm),
					},
					{
						label: ['the error term ', {tex: '(D/Y)^{2}'}, ', exponent ', {tex: '2-\\tfrac{1+\\vartheta}{3}'}],
						amount: 'D^{\\frac{5}{3}\\htmlClass{b}{-\\frac{\\vartheta}{3}}}',
						amountShow: {b: progress(f, minusThird)},
						kind: 'debt',
						p: progress(f, errTerm),
						light: window(f, errTerm, root),
					},
					{label: ['the target, squared: the error term is smaller'], amount: '|A_1(D)|^2\\ll D^{\\frac{11}{6}+\\frac{5\\vartheta}{6}+\\varepsilon}', kind: 'total', p: progress(f, smaller), light: window(f, smaller, root)},
					{
						label: ['the target: the square root'],
						amount: '|A_1(D)|\\ll D^{\\htmlClass{a}{\\frac{11}{12}}\\htmlClass{b}{+\\frac{5\\vartheta}{12}}+\\varepsilon}',
						amountShow: {a: progress(f, e12) * 0.8 + 0.2, b: progress(f, f12)},
						amountLight: {b: {ink: 'pencil', p: progress(f, small)}},
						kind: 'budget',
						p: progress(f, root),
						light: progress(f, root),
					},
				]}
			/>
			<At x={1580} y={360} w={212} style={{textAlign: 'center'}}>
				<Fraction n="11" d="12" px={180} p={progress(f, e12)} />
			</At>
			<At x={L.x} y={after} w={1400}>
				<MixedLine
					p={progress(f, small)}
					ink="ink"
					parts={['then let ', {tex: '\\vartheta>0', ink: 'ink'}, ' be small: ', {tex: '|A_1(D)|\\ll D^{\\frac{11}{12}+\\varepsilon}', ink: 'cobalt'}, ', the loss renamed ', {tex: '\\varepsilon', ink: 'ink'}]}
				/>
			</At>
			<Tag kind="claim" p={progress(f, each) * phaseA} style={{position: 'absolute', left: space.margin, top: 900}} />
			<Tag kind="claim" p={progress(f, put)} style={{position: 'absolute', left: 1590, top: 800}} />

			<SceneLocator />
			<Cite p={progress(f, avg)}>October manuscript, §3, equation (3.2)</Cite>
		</>
	);
};

// --- spend-outliers: if the total is at most B, few rows exceed T ---

const OR = {x: 190, y: 790};
const FX = OR.x + OUT_W + 70;

export const SpendOutliers: React.FC = () => {
	const {frame: f, cue} = useCues();
	const second = cue('spend-5', 'There is a second way');
	const totalB = cue('spend-5', 'If the total is at most B');
	const bOverT = cue('spend-5', 'at most B over T squared');
	const exceed = cue('spend-5', 'can exceed T');
	const because = cue('spend-5', 'because each of them alone');
	const uses = cue('spend-5', 'uses T squared');
	const counting = cue('spend-5', 'Counting outliers');
	const sept = cue('spend-5', 'the September manuscript');
	const spends = cue('spend-5', 'spends its own estimates');
	const last = cue('spend-5', 'as the last chapter shows');
	const side = OUT_CELLS * OUT_T;
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Counting outliers</SceneTitle>
			<OutlierRow
				{...OR}
				fx={FX}
				p={progress(f, 4, beat * 4, ease.inOut)}
				frameP={progress(f, totalB, beat * 2)}
				line={progress(f, bOverT, beat * 2, ease.inOut)}
				flag={progress(f, exceed)}
				carve={progress(f, because)}
				move={progress(f, uses, beat * 3)}
				grid={progress(f, uses + beat * 2)}
			/>
			<At x={OR.x - 56} y={OR.y - OUT_T - 26} w={40} style={{textAlign: 'right', opacity: progress(f, bOverT)}}>
				<Tex px={size.label} display={false} tex={'T'} />
			</At>
			<At x={FX} y={OR.y - side - 52} w={side} style={{textAlign: 'center'}}>
				<MixedLine p={progress(f, totalB)} ink="ink" parts={['the budget ', {tex: 'B'}]} />
			</At>
			<At x={FX - 120} y={OR.y + 16} w={side + 150} style={{textAlign: 'right'}}>
				<MixedLine p={progress(f, uses + beat * 2)} px={size.small} parts={['room for ', {tex: 'B/T^{2}'}, ' squares of side ', {tex: 'T'}]} />
			</At>
			<At x={OR.x} y={OR.y + 16} w={900}>
				<MixedLine p={progress(f, because)} px={size.small} ink="vermilion" parts={['each row above ', {tex: 'T', ink: 'vermilion'}, ' alone uses ', {tex: 'T^{2}', ink: 'vermilion'}, ' of the budget']} />
			</At>
			<Tag kind="schematic" p={progress(f, second)} style={{position: 'absolute', left: OR.x, top: OR.y + 70}} />

			<At x={space.margin} y={200} style={{opacity: progress(f, totalB)}}>
				<Tex px={size.math * 0.8} tex={'\\sum_{u}|A_u|^{2}\\le B'} />
			</At>
			<At x={space.margin} y={316} style={{opacity: progress(f, bOverT)}}>
				<Tex px={size.math * 0.8} tex={'\\#\\{u:\\ \\htmlClass{t}{|A_u|>T}\\}\\;\\le\\;\\frac{B}{T^{2}}'} light={{t: {ink: 'vermilion', p: progress(f, exceed)}}} />
			</At>
			<At x={980} y={200} w={812}>
				<MixedLine p={progress(f, counting)} ink="ink" parts={['how zero-density estimates work:']} />
				<MixedLine p={progress(f, counting + beat * 2)} px={size.small} parts={['a budget limits how many rows can be large']} />
			</At>
			<At x={980} y={310} w={812}>
				<MixedLine p={progress(f, sept)} ink="ink" parts={['how the September manuscript spends its estimates:']} />
				<MixedLine p={progress(f, spends)} px={size.small} parts={['its moment bounds limit how many rows a zero detector flags']} />
				<MixedLine p={progress(f, last)} px={size.small} italic parts={['chapter 8, The price of the budget']} />
			</At>

			<SceneLocator />
			<Cite p={progress(f, second) * (1 - progress(f, sept - beat, beat))}>Classical: Chebyshev’s inequality</Cite>
			<Cite p={progress(f, sept)}>September manuscript, proof overview, “The refined second stage”</Cite>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'spend-copies': SpendCopies,
	'spend-drop': SpendDrop,
	'spend-chain': SpendChain,
	'spend-outliers': SpendOutliers,
};
