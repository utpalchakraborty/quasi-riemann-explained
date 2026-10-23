import React from 'react';
import {useCues} from '../cues';
import {lerp, progress} from '../design/motion';
import {Cite, Display, Fraction, Tag} from '../design/primitives';
import {At, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, size, space, stroke} from '../design/tokens';
import {BudgetSplit} from '../diagrams/BudgetSplit';
import {E, eDivides, isEisensteinPrime, isPrimary, LatticeField, latticePoints, latticeXY} from '../diagrams/LatticeField';
import {MixedLine} from '../diagrams/MixedLine';
import {NormLadder} from '../diagrams/NormLadder';
import {RootWheel} from '../diagrams/RootWheel';
import {ThetaSlider} from '../diagrams/ThetaSlider';

// Chapter 5: Where eleven twelfths comes from.

// --- eleven-sixth: the row u = p^6 is the target, minus the multiples of p ---

// The picture's scale: terms are the ideals n of A_1(D), one primary generator
// each (n = 1 mod 3, so prime to 3), prime to 2, with D < N(n) <= 2D (a window
// W supported in (1, 2)). p = 1 + 3·omega is a primary prime of norm 7.
const SIX = {cx: 1480, cy: 560, unit: 15, radius: 20.6};
const D_PIC = 200;
const P: E = [1, 3];
const P_NORM = 7;
const isTerm = (a: number, b: number, N: number) => N > D_PIC && N <= 2 * D_PIC && isPrimary([a, b]) && !eDivides([2, 0], [a, b]);
const TERMS = (() => {
	const all: E[] = [];
	const R = 30;
	for (let a = -R; a <= R; a++) for (let b = -R; b <= R; b++) if (isTerm(a, b, a * a - a * b + b * b)) all.push([a, b]);
	return {all: all.length, multiples: all.filter((n) => eDivides(P, n)).length};
})();

export const ElevenSixth: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const termsAt = cue('eleven-1', 'Here is how');
	const pAt = cue('eleven-1', 'Take a prime p');
	const rowAt = cue('eleven-1', 'set u equal to p to the sixth');
	const wheelAt = cue('eleven-1', 'A sixth-order phase');
	const stepsFrom = cue('eleven-1', 'raised to the sixth power');
	const stepsTo = cue('eleven-1', 'is one', 'end');
	const allOne = cue('eleven-1', 'So the phase is one');
	const except = cue('eleven-1', 'except the n that p divides');
	const zero = cue('eleven-1', 'where it is zero');
	const second = start('eleven-2');
	const minus = cue('eleven-2', 'minus the terms divisible by p');
	const normY = cue('eleven-2', 'If p has norm about Y');
	const few = cue('eleven-2', 'D over Y');

	// ζ, ζ², …, ζ⁶: five eased steps of a sixth of a turn each.
	const gap = (stepsTo - stepsFrom) / 5;
	const steps = [1, 2, 3, 4, 5].map((j) => progress(f, stepsFrom + (j - 1) * gap, gap * 0.8, ease.inOut));
	const angle = 1 + steps.reduce((s, x) => s + x, 0);
	const collapse = progress(f, zero, beat * 2, ease.inOut);
	const wheelOut = 1 - progress(f, second, beat * 2);

	const termsP = progress(f, termsAt, beat * 3);
	const glow = progress(f, allOne, beat * 2);
	const ember = progress(f, except, beat * 2);
	const removed = progress(f, minus, beat * 2);
	const [px, py] = latticeXY(SIX.cx, SIX.cy, SIX.unit, P);

	return (
		<>
			<SceneTitle p={progress(f, 4)}>Sixth powers return to one</SceneTitle>

			{/* the row u = p^6, written out */}
			<At x={space.margin} y={210} style={{opacity: progress(f, rowAt)}}>
				<Tex
					px={size.math * 0.9}
					tex={'A_{\\htmlClass{u}{p^{6}}}(D)=\\sum_{\\nn}\\mu(\\nn)\\,\\nu(\\nn)\\,\\htmlClass{chi}{\\chi_{\\nn}(p^{6})}\\,W\\!\\big(\\N\\nn/D\\big)'}
					light={{u: {ink: 'verdigris', p: progress(f, rowAt)}, chi: {ink: 'verdigris', p: progress(f, wheelAt)}}}
				/>
			</At>
			<At x={space.margin} y={350} style={{opacity: progress(f, allOne)}}>
				<Tex
					px={size.math * 0.9}
					tex={'\\chi_{\\nn}(p^{6})=\\begin{cases}\\verd{1}, & p\\nmid\\nn\\\\ \\htmlClass{z}{0}, & p\\mid\\nn\\end{cases}'}
					show={{z: progress(f, except)}}
					light={{z: {ink: 'ember', p: progress(f, except)}}}
				/>
			</At>

			{/* the phase wheel: a sixth root raised to the sixth power */}
			<div style={{opacity: wheelOut}}>
				<RootWheel
					cx={270}
					cy={690}
					r={130}
					p={progress(f, wheelAt)}
					lit={collapse > 0 ? [] : [Math.round(angle) % 6]}
					pointer={{angle, len: 1 - collapse}}
					trail={{from: 1, to: angle, opacity: 0.55 * (1 - collapse)}}
					center={{ink: 'ember', p: collapse}}
				/>
				<At x={470} y={600} w={480}>
					<MixedLine p={progress(f, wheelAt)} parts={['a value ', {tex: '\\zeta'}, ' of the phase, and its powers']} />
					<div style={{marginTop: 18}}>
						<Tex
							px={size.mathInline}
							display={false}
							tex={'\\htmlClass{s1}{\\zeta,}\\ \\htmlClass{s2}{\\zeta^{2},}\\ \\htmlClass{s3}{\\zeta^{3},}\\ \\htmlClass{s4}{\\zeta^{4},}\\ \\htmlClass{s5}{\\zeta^{5},}\\ \\htmlClass{s6}{\\zeta^{6}=\\verd{1}}'}
							show={{s1: progress(f, wheelAt), s2: steps[0], s3: steps[1], s4: steps[2], s5: steps[3], s6: steps[4]}}
						/>
					</div>
					<MixedLine p={collapse} ink="ember" style={{marginTop: 22}} parts={['and when ', {tex: 'p\\mid\\nn', ink: 'ember'}, ', the phase is 0']} />
				</At>
			</div>

			{/* eleven-2: the copy and its defect */}
			<At x={space.margin} y={590} style={{opacity: progress(f, minus)}}>
				<Tex px={size.math * 0.82} tex={'A_{p^{6}}(D)=\\gilt{A_1(D)}-\\ember{\\sum_{p\\mid\\nn}}\\mu(\\nn)\\,\\nu(\\nn)\\,W(\\cdots)'} />
			</At>
			<At x={space.margin} y={750} style={{opacity: progress(f, few)}}>
				<Tex px={size.math} tex={'A_{p^{6}}(D)=\\gilt{A_1(D)}+\\ember{O(D/Y)}'} />
			</At>

			{/* the lattice: terms of A_1(D) on their annulus, multiples of p */}
			<LatticeField
				{...SIX}
				under={
					<g opacity={termsP}>
						{[D_PIC, 2 * D_PIC].map((n) => (
							<circle key={n} cx={SIX.cx} cy={SIX.cy} r={SIX.unit * Math.sqrt(n)} fill="none" stroke={alpha('mist', 0.45)} strokeWidth={stroke.hair} strokeDasharray="4 8" />
						))}
					</g>
				}
				style={({a, b, N, dist}) => {
					const appear = Math.max(0, Math.min(1, progress(f, 6, beat * 4) * (SIX.radius + 2) - dist));
					if (a === P[0] && b === P[1]) {
						const lit = progress(f, pAt);
						return {r: 4 + 6 * lit, fill: lit > 0 ? color.verdigris : alpha('mist', 0.5), opacity: appear};
					}
					if (!isTerm(a, b, N)) return {r: 3, fill: alpha('mist', 0.4), opacity: appear};
					const mult = eDivides(P, [a, b]);
					if (mult && ember > 0) {
						return removed > 0
							? {r: 8, fill: alpha('ember', 0.85 * (1 - removed)), stroke: color.ember, sw: stroke.line, opacity: 1}
							: {r: 6.5 + 1.5 * ember, fill: color.ember, opacity: 1};
					}
					const r = 3 + 3.5 * termsP + 1.2 * glow;
					return {r, fill: glow > 0 ? color.paper : alpha('paper', 0.85), opacity: Math.max(appear, termsP)};
				}}
			/>
			<At x={px + 14} y={py - 54} style={{opacity: progress(f, pAt)}}>
				<Tex px={size.label} ink="verdigris" display={false} tex={'p=1+3\\omega'} />
			</At>
			<At x={px + 14} y={py + 4} style={{opacity: progress(f, normY)}}>
				<Tex px={size.label} ink="verdigris" display={false} tex={'\\N(p)=7\\approx Y'} />
			</At>
			<At x={1590} y={140} w={220}>
				<MixedLine p={termsP} px={size.small} parts={['dots: the ', {tex: `${TERMS.all}`}, ' terms of ', {tex: 'A_1(D)'}, ', for ', {tex: `D=${D_PIC}`}]} />
			</At>
			<At x={1040} y={800} w={260}>
				<MixedLine p={progress(f, few)} px={size.small} ink="ember" parts={[{tex: `${TERMS.multiples}`, ink: 'ember'}, ' of them divisible by ', {tex: 'p', ink: 'ember'}, ': about ', {tex: `${TERMS.all}/${P_NORM}`, ink: 'ember'}]} />
			</At>
			<Tag kind="computed" p={termsP} style={{position: 'absolute', left: 1630, top: 880}} />

			<SceneLocator />
			<Cite p={progress(f, rowAt)}>October manuscript, §2.2</Cite>
		</>
	);
};

// --- eleven-count: one copy per prime of norm up to Y, and Y = H^{1/6} ---

// Prime ideals of norm at most Y_PIC, counted exactly: each prime element of
// the lattice has six associates, and all six generate the same ideal.
const COUNT = {cx: 530, cy: 580, unit: 23, radius: 15.2};
const Y_PIC = 200;
const PRIME_IDEALS =
	latticePoints(Math.sqrt(Y_PIC) + 1).filter((pt) => pt.N > 0 && pt.N <= Y_PIC && isEisensteinPrime(pt.a, pt.b)).length / 6;
const Y_OVER_LOG = Y_PIC / Math.log(Y_PIC);

export const ElevenCount: React.FC = () => {
	const {frame: f, cue, frames} = useCues();
	const each = cue('eleven-3', 'One for each prime');
	const upToY = cue('eleven-3', 'norm up to Y');
	const about = cue('eleven-3', 'about Y over log Y');
	const pit = cue('eleven-3', 'prime ideal theorem');
	const sixth = cue('eleven-3', 'Their sixth powers');
	const ySix = cue('eleven-3', 'Y to the sixth');
	const atMostH = cue('eleven-3', 'at most H');
	const yIs = cue('eleven-3', 'So Y is H to the one sixth');
	const sweep = progress(f, each, beat * 4, ease.inOut);
	const rMax = Math.sqrt(Y_PIC);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>How many copies</SceneTitle>
			<LatticeField
				{...COUNT}
				under={
					<circle
						cx={COUNT.cx}
						cy={COUNT.cy}
						r={COUNT.unit * rMax}
						fill="none"
						stroke={alpha('mist', 0.7)}
						strokeWidth={stroke.line}
						strokeDasharray="6 9"
						opacity={progress(f, upToY)}
					/>
				}
				style={({a, b, N, dist}) => {
					const appear = Math.max(0, Math.min(1, progress(f, 4, beat * 4) * (COUNT.radius + 2) - dist));
					const prime = N > 0 && N <= Y_PIC && isEisensteinPrime(a, b);
					const lit = prime ? Math.max(0, Math.min(1, sweep * (rMax + 1.5) - dist)) : 0;
					return lit > 0 ? {r: 3.5 + 2 * lit, fill: color.verdigris, opacity: 1} : {r: 3, fill: alpha('mist', N <= Y_PIC ? 0.55 : 0.28), opacity: appear};
				}}
			/>
			<At x={COUNT.cx + COUNT.unit * rMax * 0.72 + 6} y={COUNT.cy - COUNT.unit * rMax * 0.72 - 46} style={{opacity: progress(f, upToY)}}>
				<Tex px={size.label} ink="mist" display={false} tex={`\\N=Y=${Y_PIC}`} />
			</At>
			<Tag kind="computed" p={progress(f, each + beat * 3)} style={{position: 'absolute', left: space.margin, top: 900}} />

			{/* the count, and the prime ideal theorem's estimate */}
			{[
				{x: 1040, tex: 'J', value: `${PRIME_IDEALS}`, ink: 'verdigris' as const, at: each + beat * 4, note: ['prime ideals of norm ', {tex: `\\le ${Y_PIC}`}]},
				{x: 1420, tex: 'Y/\\log Y', value: Y_OVER_LOG.toFixed(1), ink: 'paper' as const, at: about, note: ['prime ideal theorem']},
			].map((c) => (
				<At key={c.tex} x={c.x} y={210} w={340} style={{opacity: progress(f, c.at)}}>
					<Tex px={size.mathInline} ink={c.ink} display={false} tex={c.tex} />
					<Display px={size.title} ink={c.ink} style={{marginTop: 4}}>
						{c.value}
					</Display>
					<MixedLine px={size.small} p={progress(f, c.ink === 'paper' ? pit : c.at)} parts={c.note} style={{marginTop: 8}} />
				</At>
			))}
			<At x={1040} y={486} w={720} style={{opacity: progress(f, each + beat * 5) * (1 - progress(f, yIs - beat, beat))}}>
				<MixedLine px={size.small} parts={['Each prime is drawn with its six associates; all six give one row, since ', {tex: '(\\varepsilon p)^{6}=p^{6}'}, '.']} />
			</At>
			<At x={1040} y={478} style={{opacity: progress(f, yIs)}}>
				<Tex px={size.mathLarge} display={false} tex={'Y=H^{1/6}'} />
			</At>

			{/* the norm axis: Y, and sixth powers up to Y^6 = H */}
			<NormLadder
				x={1040}
				y={780}
				w={600}
				p={progress(f, sixth - beat, beat * 2)}
				yLit={progress(f, sixth, beat * 2)}
				arrow={progress(f, sixth + beat, ySix + beat * 2 - sixth, ease.inOut)}
				reach={progress(f, sixth + beat, ySix + beat * 2 - sixth, ease.inOut)}
				family={progress(f, atMostH)}
				sixth={progress(f, yIs)}
			/>

			<SceneLocator />
			<Cite p={progress(f, about) * (1 - progress(f, frames - beat * 2))}>October manuscript, §2.2 and §3</Cite>
		</>
	);
};

// --- eleven-spend: J copies of the target cannot exceed the budget ---

export const ElevenSpend: React.FC = () => {
	const {frame: f, cue} = useCues();
	const copy = cue('eleven-4', 'Each copy is the target');
	const err = cue('eleven-4', 'an error of about D over Y');
	const together = cue('eleven-4', 'copies together cost');
	const count = cue('eleven-4', 'Y over log Y');
	const exceed = cue('eleven-4', 'cannot exceed D times H');
	const divide = cue('eleven-4', 'Divide');
	const errSq = cue('eleven-4', 'plus the error squared');
	const J = PRIME_IDEALS;
	const shown = progress(f, copy, beat) + (J - 1) * progress(f, together, count - together + beat * 3, ease.inOut);
	const squeeze = progress(f, exceed + beat, beat * 3, ease.inOut);
	const BAR = {x: space.margin, y: 668, w: 1300, h: 90};
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Spending the budget</SceneTitle>
			<At x={space.margin} y={196} style={{opacity: progress(f, together)}}>
				<Tex
					px={size.math * 0.9}
					tex={
						'\\begin{aligned}\\htmlClass{j1}{J}\\,|A_1(D)|^2 &\\lesssim \\sum_{p}|A_{p^{6}}(D)|^2+\\htmlClass{j2}{J}\\,\\ember{(D/Y)^2}\\\\ &\\htmlClass{l2}{\\lesssim D^{1+\\varepsilon}H+\\htmlClass{j3}{J}\\,\\ember{(D/Y)^2}}\\end{aligned}'
					}
					show={{l2: progress(f, exceed)}}
					light={{j1: {ink: 'verdigris', p: progress(f, count)}, j2: {ink: 'verdigris', p: progress(f, count)}, j3: {ink: 'verdigris', p: progress(f, count)}}}
				/>
			</At>
			<At x={1090} y={330} style={{opacity: progress(f, divide)}}>
				<Tex
					px={size.math * 0.8}
					tex={'|A_1(D)|^2\\lesssim\\frac{D^{1+\\varepsilon}H}{\\htmlClass{j}{J}}+\\htmlClass{e}{\\Big(\\frac DY\\Big)^{2}}'}
					light={{j: {ink: 'verdigris', p: 1}, e: {ink: 'ember', p: progress(f, errSq)}}}
				/>
			</At>
			<BudgetSplit
				{...BAR}
				count={J}
				shown={shown}
				scale={lerp(1.22, 1, squeeze)}
				errorP={progress(f, err)}
				budgetP={progress(f, 6, beat * 2)}
				isolate={progress(f, divide, beat * 2)}
			/>
			<At x={BAR.x} y={BAR.y + BAR.h + 22} w={900} style={{opacity: progress(f, copy) * (1 - progress(f, divide - beat, beat))}}>
				<MixedLine px={size.small} parts={['each bar: one copy, ', {tex: '|A_{p^{6}}(D)|^2', ink: 'gilt'}, ', about the target squared']} />
				<MixedLine px={size.small} p={progress(f, err)} ink="ember" parts={['and its error, about ', {tex: '(D/Y)^2', ink: 'ember'}]} />
			</At>
			<At x={BAR.x} y={BAR.y + BAR.h + 44} w={600} style={{opacity: progress(f, divide + beat)}}>
				<MixedLine ink="paper" px={size.label} parts={['each copy: at most ', {tex: 'D^{1+\\varepsilon}H/J', ink: 'paper'}]} />
			</At>
			<At x={BAR.x + BAR.w - 560} y={BAR.y + BAR.h + 22} w={560} style={{textAlign: 'right', opacity: progress(f, count)}}>
				<MixedLine ink="verdigris" px={size.label} parts={[{tex: 'J\\approx Y/\\log Y', ink: 'verdigris'}, ' copies']} />
			</At>
			<Tag kind="schematic" p={progress(f, copy)} style={{position: 'absolute', left: BAR.x + BAR.w + 60, top: BAR.y + BAR.h + 30}} />
			<SceneLocator />
			<Cite p={progress(f, together)}>October manuscript, §3, equation (3.2)</Cite>
		</>
	);
};

// --- eleven-root: the exponent, and theta toward zero ---

export const ElevenRoot: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const putY = cue('eleven-5', 'Put in Y equals');
	const putH = cue('eleven-5', 'H equals D');
	const dh = cue('eleven-5', 'D times H');
	const fiveSixths = cue('eleven-5', 'five sixths');
	const isD = cue('eleven-5', 'is D to the');
	const elevenSixths = cue('eleven-5', 'eleven sixths');
	const fiveTheta6 = cue('eleven-5', 'five theta over six');
	const root = cue('eleven-5', 'Take the square root');
	const elevenTwelfths = cue('eleven-5', 'eleven twelfths');
	const fiveTheta12 = cue('eleven-5', 'five theta over twelve');
	const errorTerm = cue('eleven-5', 'The error term');
	const errFive = cue('eleven-5', 'D to the five sixths');
	const smaller = cue('eleven-5', 'which is smaller');
	const second = start('eleven-6');
	const small = cue('eleven-6', 'as small as we like');
	const positive = cue('eleven-6', 'stay positive');
	const engine = cue('eleven-6', 'the engine needs it');
	const finalAt = cue('eleven-6', 'D to the eleven twelfths');
	const every = cue('eleven-6', 'for every epsilon');
	const cancel = cue('eleven-6', 'That is the cancellation');

	const old = 1 - progress(f, second - beat, beat * 2);
	const rise = progress(f, second, beat * 3, ease.inOut);
	const theta = f < small ? 0.1 : 0.003 + 0.097 * Math.exp(-(f - small) / (beat * 9));
	const swap = progress(f, finalAt, beat * 2);
	const l3y = lerp(494, 220, rise);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Take the square root</SceneTitle>
			<div style={{opacity: old}}>
				<At x={space.margin} y={196}>
					<Tex
						px={size.math}
						tex={'\\htmlClass{y}{Y=H^{1/6},}\\qquad\\htmlClass{h}{H=D^{1+\\vartheta}}'}
						show={{y: progress(f, putY), h: progress(f, putH)}}
					/>
				</At>
				<At x={space.margin} y={296}>
					<Tex
						px={size.math * 0.9}
						tex={
							'\\htmlClass{a}{\\frac{D^{1+\\varepsilon}H}{Y}=D^{1+\\varepsilon}H^{\\htmlClass{fs}{5/6}}}\\htmlClass{b}{=D^{\\,1+\\frac56(1+\\vartheta)+\\varepsilon}}\\htmlClass{c}{=D^{\\,\\htmlClass{es}{\\frac{11}{6}}+\\htmlClass{ft}{\\frac{5\\vartheta}{6}}+\\varepsilon}}'
						}
						show={{a: progress(f, dh), b: progress(f, isD), c: progress(f, elevenSixths)}}
						light={{fs: {ink: 'verdigris', p: progress(f, fiveSixths)}, es: {ink: 'gilt', p: progress(f, elevenSixths)}, ft: {ink: 'mist', p: progress(f, fiveTheta6)}}}
					/>
				</At>
				<At x={space.margin} y={448} style={{opacity: progress(f, root) * (1 - rise)}}>
					<MixedLine px={size.small} parts={['square root of the bound on ', {tex: '|A_1(D)|^2'}]} />
				</At>
				<At x={space.margin} y={690} style={{opacity: progress(f, errorTerm)}}>
					<Tex
						px={size.math}
						tex={'\\ember{\\Big(\\frac DY\\Big)^{2}}=D^{\\frac53-\\frac{\\vartheta}{3}},\\qquad\\htmlClass{r}{\\ember{\\frac DY}=D^{\\,\\frac56-\\frac{\\vartheta}{6}}}\\htmlClass{lt}{\\;<\\;D^{\\frac{11}{12}}}'}
						show={{r: progress(f, errFive), lt: progress(f, smaller)}}
					/>
				</At>
			</div>
			<At x={space.margin} y={l3y} style={{opacity: progress(f, root) * (1 - swap)}}>
				<Tex
					px={size.mathLarge}
					tex={'|A_1(D)|\\ll D^{\\,\\htmlClass{et}{\\frac{11}{12}}+\\htmlClass{ftt}{\\frac{5\\vartheta}{12}}+\\varepsilon}'}
					show={{et: progress(f, elevenTwelfths), ftt: progress(f, fiveTheta12)}}
					light={{et: {ink: 'gilt', p: progress(f, elevenTwelfths)}}}
				/>
			</At>
			<At x={space.margin} y={l3y} style={{opacity: swap}}>
				<Tex px={size.mathLarge} tex={'|A_1(D)|\\ll D^{\\,\\gilt{\\frac{11}{12}}+\\varepsilon}'} />
				<MixedLine p={progress(f, every)} parts={['for every ', {tex: '\\varepsilon>0'}]} style={{marginTop: 6}} />
			</At>
			<At x={1530} y={300} w={262} style={{textAlign: 'center'}}>
				<Fraction n="11" d="12" px={230} p={progress(f, elevenTwelfths)} />
			</At>

			{/* eleven-6: theta slides toward zero; the exponent toward 11/12 */}
			<ThetaSlider
				x={420}
				y={640}
				w={880}
				theta={theta}
				p={progress(f, second)}
				zero={progress(f, positive)}
				exponent={progress(f, second + beat)}
				saving={progress(f, cancel)}
			/>
			<At x={330} y={706} w={600} style={{opacity: progress(f, engine)}}>
				<MixedLine ink="ember" px={size.small} parts={['the engine needs ', {tex: '\\vartheta>0', ink: 'ember'}]} />
			</At>

			<SceneLocator />
			<Cite p={progress(f, dh)}>October manuscript, §3, equation (3.2)</Cite>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'eleven-sixth': ElevenSixth,
	'eleven-count': ElevenCount,
	'eleven-spend': ElevenSpend,
	'eleven-root': ElevenRoot,
};
