import React from 'react';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Cite, Display, Tag, Text} from '../design/primitives';
import {At, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, size, space, stroke} from '../design/tokens';
import {BraceFade, Bracket, EnergyRect} from '../diagrams/Energy';
import {Ledger} from '../diagrams/Ledger';
import {MixedLine, Part} from '../diagrams/MixedLine';
import {CANCEL_P, CANCEL_T, RecCancel} from '../diagrams/RecCancel';
import {cutoffX, RecCutoff} from '../diagrams/RecCutoff';
import {LEVELS, levelSize, RecLadder, SCHEDULE} from '../diagrams/RecLadder';
import {ROW_BAND, RowSquares, TRANSFER} from '../diagrams/RecTransfer';

// Chapter 7: Proving it, III: the debt and the recursion. October manuscript,
// §2.5 (Step 5), §5 (Lemma 5.3, Proposition 5.4, §5.5), §7.

const SVG: React.FC<{children: React.ReactNode; opacity?: number}> = ({children, opacity = 1}) => (
	<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity}}>
		{children}
	</svg>
);

// A labelled step in a chain of estimates: a quiet caption above its formula.
const Step: React.FC<{label: Part[]; tex: string; p: number; px?: number; lit?: number; style?: React.CSSProperties}> = ({label, tex, p, px = 40, lit = 0, style}) => (
	<div style={{opacity: p, ...style}}>
		<MixedLine px={size.small} ink={lit > 0.5 ? 'ink' : 'pencil'} parts={label} />
		<div style={{marginTop: 2, display: 'inline-block', whiteSpace: 'nowrap'}}>
			<Tex tex={tex} px={px} />
		</div>
	</div>
);

const PREC: Part[] = [{tex: '\\preccurlyeq'}, ' means at most, up to a factor ', {tex: 'D^{\\varepsilon}'}];

// --- rec-debt: the borrowed cube terms, and the inversion that returns them ---

const EQ_COMPLETION =
	'T_h(X)=P_h(X)+\\htmlClass{rdUb}{\\underbrace{\\debt{\\sum_{b\\ne1}\\frac{w_h(b)}{\\N(b)}\\,P_h\\big(X/\\N(b)^{3}\\big)}}_{\\htmlClass{rdUbL}{\\text{cube terms}}}}';
const EQ_INVERSION = 'P_h(X)=\\sum_{d\\equiv1\\,(3)}\\frac{\\arith{\\mu(d)}\\,w_h(d)}{\\N(d)}\\,\\htmlClass{rdT}{T_h\\big(X/\\N(d)^{3}\\big)}';
const CANCEL = {x: 1180, y: 480, unit: 96};
const SCALES = [300, 126, 60, 30]; // schematic widths for X / N(d)^3, d = 1 and a few others
const SCALE_GAP = 30;
const SCALE_X = SCALES.map((_, i) => 1150 + SCALES.slice(0, i).reduce((a, w) => a + w + SCALE_GAP, 0));
const SCALE_Y = 890;
const SCALE_H = 140;

export const RecDebt: React.FC = () => {
	const {frame: f, cue} = useCues();
	const c = (s: string) => cue('rec-1', s);
	const returned = c('must be returned');
	const dropped = c('cannot simply be dropped');
	const cubes = c('different cubes can cancel');
	const cancel = c('can cancel');
	const mobius = c('Möbius inversion');
	const exactly = c('returns them exactly');
	const needs = c('the sum the proof needs');
	const weighted = c('a weighted sum of completed sums');
	const smaller = c('smaller column scales');
	const overD = c('X over the norm of d');
	const at = ([a, b]: [number, number]): [number, number] => [CANCEL.x + a * CANCEL.unit, CANCEL.y - b * CANCEL.unit];
	const [pxx, pyy] = at(CANCEL_P);
	const [tx, ty] = at(CANCEL_T);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Returning the cube terms</SceneTitle>
			<BraceFade show={{rdUb: progress(f, 10, beat * 2)}} />

			<At x={space.margin} y={190} style={{opacity: progress(f, 6, beat * 2)}}>
				<Tex px={size.math * 0.72} tex={EQ_COMPLETION} show={{rdUbL: progress(f, 10, beat * 2)}} />
			</At>
			<At x={space.margin} y={404} w={1000}>
				<MixedLine
					px={size.small}
					p={progress(f, returned)}
					parts={[{tex: 'P_h(X)=X^{-1/2}B_h(X)'}, ' and ', {tex: 'w_h(b)=\\overline{\\alpha(b)}^{\\,3}\\xi(b)^{3}\\chi_b(h)^{3}'}]}
				/>
			</At>
			<At x={space.margin} y={458} style={{opacity: progress(f, mobius)}}>
				<MixedLine px={size.small} ink="ink" parts={['Möbius inversion returns them exactly']} />
				<div style={{display: 'inline-block', marginTop: 2}}>
					<Tex px={size.math * 0.72} tex={EQ_INVERSION} light={{rdT: {ink: 'ink', p: progress(f, weighted)}}} />
				</div>
			</At>
			<At x={space.margin} y={636} w={960}>
				<MixedLine
					px={size.small}
					ink="ink"
					p={progress(f, needs)}
					parts={[
						'the sum the proof needs',
						...(f >= weighted ? [' is a weighted sum of completed sums'] : []),
						...(f >= smaller ? [', at the smaller column scales ', {tex: 'X/\\N(d)^{3}'} as Part] : []),
					]}
				/>
			</At>

			<Ledger
				x={space.margin}
				y={726}
				w={960}
				amountW={250}
				rowH={54}
				rules={progress(f, 6)}
				heading={{label: 'The cube account', amount: 'status', p: progress(f, 6)}}
				rows={[
					{label: ['borrowed in chapter 6: the cube terms'], note: 'owed', kind: 'debt', p: progress(f, 10), strike: progress(f, exactly, beat * 2)},
					{label: ['returned exactly, by Möbius inversion'], note: 'exact', kind: 'payment', p: progress(f, exactly + beat)},
					{label: ['to pay: completed sums at ', {tex: 'X/\\N(d)^{3}'}], note: 'next', kind: 'entry', p: progress(f, overD), light: progress(f, overD + beat)},
				]}
			/>

			{/* why the cube terms cannot be dropped */}
			<RecCancel {...CANCEL} p={progress(f, dropped, beat * 2)} cubes={progress(f, cubes - beat, cancel - cubes + beat * 2, ease.inOut)} result={progress(f, cancel + beat)} />
			<At x={(CANCEL.x + pxx) / 2 - 60} y={(CANCEL.y + pyy) / 2 - 70} style={{opacity: progress(f, dropped), whiteSpace: 'nowrap'}}>
				<Tex px={size.label} display={false} tex={'P_h(X)'} />
			</At>
			<At x={CANCEL.x + 2.9 * CANCEL.unit} y={CANCEL.y + 0.7 * CANCEL.unit} w={260} style={{opacity: progress(f, cubes)}}>
				<MixedLine ink="vermilion" parts={['cube terms']} />
			</At>
			<At x={tx - 40} y={ty + 22} style={{opacity: progress(f, cancel + beat), whiteSpace: 'nowrap'}}>
				<MixedLine ink="ink" parts={[{tex: 'T_h(X)'}, ': small']} />
			</At>
			<At x={1150} y={604} w={640}>
				<MixedLine px={size.small} p={progress(f, cancel + beat * 2)} parts={['a small ', {tex: 'T_h'}, ' does not make ', {tex: 'P_h'}, ' small: the cube terms can cancel it']} />
			</At>
			<Tag kind="schematic" p={progress(f, dropped)} style={{position: 'absolute', left: 1150, top: 250}} />

			{/* the completed sums the inversion asks for: all rows, shorter columns */}
			<At x={1150} y={SCALE_Y - SCALE_H - 64} w={640} style={{opacity: progress(f, smaller)}}>
				<MixedLine parts={[{tex: 'T_h'}, ' at column scales ', {tex: 'X,\\ X/\\N(d)^{3},\\ \\dots'}]} />
			</At>
			<SVG>
				{SCALES.map((w, i) => (
					<EnergyRect key={w} x={SCALE_X[i]} y={SCALE_Y} w={w} h={SCALE_H} rows={5} fill={1} p={progress(f, smaller + i * beat * 0.6, beat * 2)} />
				))}
			</SVG>
			<At x={SCALE_X[0]} y={SCALE_Y - SCALE_H / 2 - 22} w={SCALES[0]} style={{textAlign: 'center', opacity: progress(f, smaller + beat)}}>
				<Tex px={size.label} display={false} tex={'T_h(X)'} />
			</At>
			<Tag kind="schematic" p={progress(f, smaller)} style={{position: 'absolute', left: 1150, top: SCALE_Y + 14}} />

			<SceneLocator />
			<Cite p={progress(f, 6)}>October manuscript, §2.5, (2.16)–(2.18); after Dunn–Radziwiłł</Cite>
		</>
	);
};

// --- rec-split: small d paid up to the cutoff; large d leave remainders ---

const EQ_SHORT = '\\sum_{0<\\N(h)\\ll\\cH}|P_{h,\\le H_c}(X)|^{2}\\ll(\\cH X)^{\\varepsilon}\\Big(\\cH+\\frac{\\cH^{2}H_c^{3}}{X}\\Big)';
const EQ_CUTOFF = 'H_c=\\min\\Big\\{X^{1/3},\\Big(\\frac{X}{\\cH}\\Big)^{2/3}\\Big\\}';
const EQ_REMAINDER = 'E(\\cH,X)\\preccurlyeq X+\\sup_{b:\\,1\\le L_b\\le X/H_c^{3}}\\htmlClass{rsRem}{E(\\cH,L_b)},\\qquad L_b=\\frac{X}{\\N(b)^{3}}';
const AXIS = {x: 200, y: 520, w: 1300};
const ORIG = {x: 160, y: 880, w: 440, h: 190};
const REMS = [0.3, 0.17, 0.09].map((s) => ORIG.w * s); // schematic widths for L_b = X / N(b)^3
const REM_X = REMS.map((_, i) => ORIG.x + ORIG.w + 60 + REMS.slice(0, i).reduce((a, w) => a + w + 36, 0));
const REM_END = REM_X[REM_X.length - 1] + REMS[REMS.length - 1];

export const RecSplit: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const c2 = (s: string) => cue('rec-2', s);
	const c3 = (s: string) => cue('rec-3', s);
	const cs = c2('Cauchy–Schwarz');
	const bound = c2('the completed bound');
	const pay = c2('pay directly');
	const cutoff = c2('up to a cutoff');
	const hc = c2('H sub c');
	const basic = c2('At the basic scales');
	const dTwo = c2('D to the two theta over three');
	const keep = c2('theta earns its keep');
	const large = c3('Large d leave remainders');
	const kind = c3('energies of the same kind');
	const shorter = c3('a shorter column scale');
	const lb = c3('L sub b');
	const notShrunk = c3('the rows have not shrunk');
	const still = c3('the bound still required is X');
	const yet = c3('not progress yet');
	const first = 1 - progress(f, start('rec-3') - beat, beat * 1.5);
	const top = ORIG.y - ORIG.h;
	const rowsP = progress(f, notShrunk, beat * 2);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Paid up to the cutoff</SceneTitle>

			{/* rec-2: the short cube sum, within budget up to the cutoff */}
			<div style={{opacity: first}}>
				<At x={space.margin} y={186}>
					<MixedLine px={size.small} p={progress(f, 6)} parts={['small ', {tex: 'd'}, ': Cauchy–Schwarz, then the completed bound (2.15)']} />
					<div style={{display: 'inline-block', marginTop: 2, opacity: progress(f, bound)}}>
						<Tex px={size.math * 0.68} tex={EQ_SHORT} />
					</div>
				</At>
				<At x={1110} y={186} w={682}>
					<MixedLine px={size.small} p={progress(f, cutoff)} parts={['within budget while ', {tex: '\\cH^{2}H_c^{3}/X\\le X'}, ': the cutoff']} />
					<div style={{display: 'inline-block', marginTop: 2, opacity: progress(f, hc)}}>
						<Tex px={size.math * 0.72} tex={EQ_CUTOFF} />
					</div>
				</At>
				<At x={space.margin} y={652} w={1500}>
					<MixedLine
						p={progress(f, basic)}
						parts={['at the basic scales ', {tex: 'X\\asymp D'}, ', ', {tex: '\\cH\\asymp D^{1-\\vartheta}'}, ': ', {tex: '(X/\\cH)^{2/3}\\asymp D^{2\\vartheta/3}', ink: 'ink'}]}
					/>
					<MixedLine px={size.small} p={progress(f, keep)} style={{marginTop: 8}} parts={['with ', {tex: '\\vartheta=0'}, ' the cutoff would be about 1, and the direct payment would cover almost nothing: theta earns its keep']} />
				</At>
			</div>

			{/* the divisors, split at the cutoff (both passages) */}
			<At x={space.margin} y={AXIS.y - 120} w={1500}>
				<MixedLine px={size.small} p={progress(f, cs)} parts={['the divisors ', {tex: 'd'}, ' in the inversion, by norm on a log scale, at the basic scales']} />
			</At>
			<RecCutoff {...AXIS} theta={SCHEDULE.theta} p={progress(f, cs, beat * 2)} small={progress(f, pay, beat * 2)} cut={progress(f, hc)} large={progress(f, large, beat * 3)} />
			<At x={AXIS.x} y={AXIS.y - 62} w={cutoffX(AXIS.x, AXIS.w, SCHEDULE.theta) - AXIS.x} style={{textAlign: 'center', opacity: progress(f, pay)}}>
				<Text px={size.small}>paid directly</Text>
			</At>
			<At x={cutoffX(AXIS.x, AXIS.w, SCHEDULE.theta)} y={AXIS.y - 62} w={AXIS.x + AXIS.w - cutoffX(AXIS.x, AXIS.w, SCHEDULE.theta)} style={{textAlign: 'center', opacity: progress(f, large)}}>
				<Text px={size.small} ink="vermilion">
					large: remainders
				</Text>
			</At>
			<Tag kind="schematic" p={progress(f, cs)} style={{position: 'absolute', left: AXIS.x + AXIS.w + 40, top: AXIS.y - 16}} />

			{/* rec-3: the remainders are energies of the same kind */}
			<At x={space.margin} y={186} style={{opacity: progress(f, kind)}}>
				<MixedLine px={size.small} parts={['large ', {tex: 'd'}, ': remainders of the same kind, at shorter column scales']} />
				<div style={{display: 'inline-block', marginTop: 2}}>
					<Tex px={size.math * 0.72} tex={EQ_REMAINDER} light={{rsRem: {ink: 'vermilion', p: progress(f, shorter)}}} />
				</div>
				<MixedLine px={size.small} p={progress(f, lb + beat)} parts={PREC} />
			</At>
			<SVG>
				<EnergyRect {...ORIG} p={progress(f, kind, beat * 2)} fill={1} rows={6} />
				{REMS.map((w, i) => (
					<EnergyRect key={w} x={REM_X[i]} y={ORIG.y} w={w} h={ORIG.h} rows={6} ink="vermilion" fill={1} p={progress(f, shorter + i * beat * 0.6, beat * 2)} />
				))}
				{[top, ORIG.y].map((yy) => (
					<line key={yy} x1={ORIG.x} x2={ORIG.x + (REM_END - ORIG.x) * rowsP} y1={yy} y2={yy} stroke={alpha('vermilion', 0.8)} strokeWidth={stroke.hair} strokeDasharray="6 8" />
				))}
				<Bracket x1={REM_END + 26} y1={ORIG.y} x2={REM_END + 26} y2={top} ink="vermilion" p={rowsP} />
				<Bracket x1={ORIG.x} y1={ORIG.y + 20} x2={ORIG.x + ORIG.w} y2={ORIG.y + 20} p={progress(f, kind + beat, beat * 2)} />
				<Bracket x1={REM_X[0]} y1={ORIG.y + 20} x2={REM_X[0] + REMS[0]} y2={ORIG.y + 20} ink="vermilion" p={progress(f, lb, beat * 2)} />
			</SVG>
			<At x={ORIG.x} y={top + ORIG.h / 2 - 24} w={ORIG.w} style={{textAlign: 'center', opacity: progress(f, kind + beat)}}>
				<Tex px={size.label} display={false} tex={'E(\\cH,X)'} />
			</At>
			<At x={ORIG.x + ORIG.w / 2 - 40} y={ORIG.y + 26} w={80} style={{textAlign: 'center', opacity: progress(f, kind + beat * 2)}}>
				<Tex px={size.label} display={false} ink="pencil" tex={'X'} />
			</At>
			<At x={REM_X[0] - 40} y={ORIG.y + 26} w={REMS[0] + 80} style={{textAlign: 'center', opacity: progress(f, lb)}}>
				<Tex px={size.label} display={false} ink="vermilion" tex={'L_b'} />
			</At>
			<At x={REM_END + 52} y={top - 4} w={1792 - REM_END - 52} style={{display: 'flex', flexDirection: 'column', gap: 10}}>
				<MixedLine ink="vermilion" p={rowsP} parts={['rows: still ', {tex: '\\cH', ink: 'vermilion'}]} />
				<MixedLine ink="ink" p={progress(f, still)} parts={['bound required: still ', {tex: 'X', ink: 'cobalt'}]} />
				<Text px={size.label} ink="pencil" italic p={progress(f, yet)}>
					not progress yet
				</Text>
			</At>
			<Tag kind="schematic" p={progress(f, kind)} style={{position: 'absolute', left: REM_END + 52, top: ORIG.y - 30}} />

			<SceneLocator />
			<Cite p={progress(f, cs) * first}>October manuscript, §2.5, (2.20) and (2.21)</Cite>
			<Cite p={progress(f, kind)}>October manuscript, §2.5, (2.22); Lemma 5.3</Cite>
		</>
	);
};

// --- rec-transfer: two more Poisson summations, with the row range enlarged between them ---

const T = TRANSFER;
const FIG = {x: 1150, y: 880};

export const RecTransfer: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const c4 = (s: string) => cue('rec-4', s);
	const c5 = (s: string) => cue('rec-5', s);
	const firstP = c4('The first, in h');
	const newRows = c4('produces new rows');
	const normY = c4('with norm up to');
	const enlarges = c4('deliberately enlarges');
	const square = c4('every term is a square');
	const never = c4('never negative');
	const same = c4('the same positivity');
	const second = c5('The second Poisson summation');
	const back = c5('brings the rows back shorter');
	const gauss = c5('return to cubic Gauss sums');
	const both = c5('Both scales have shrunk');
	const ratio = c5('their ratio is unchanged');
	const transfer = c5('This is the transfer estimate');

	// the remainder's row side: H -> L_b^2/H -> Y -> H'
	const k1 = progress(f, newRows, beat * 3, ease.inOut);
	const k2 = progress(f, enlarges, beat * 4, ease.inOut);
	const k3 = progress(f, back, beat * 3, ease.inOut);
	const rows = lerp(lerp(lerp(T.H, T.R1, k1), T.Y, k2), T.Hp, k3);
	const label = k3 > 0.5 ? "\\cH'=\\cH L_b/X" : k2 > 0.5 ? 'Y=XL_b/\\cH' : k1 > 0.5 ? 'L_b^{2}/\\cH' : '\\cH';
	const p4 = 1 - progress(f, start('rec-5') - beat, beat * 1.5);
	const p5 = progress(f, start('rec-5'), beat * 1.5);
	const kept = Math.round(T.R1 / ROW_BAND);
	const added = Math.round(T.Y / ROW_BAND);
	const squaresP = progress(f, square, beat * 3) * (1 - k3);
	const similar = progress(f, both, beat * 2);
	const reInk = progress(f, gauss) > 0.5 ? 'ink' : 'vermilion';
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The transfer: rows shrink</SceneTitle>

			{/* rec-4: the remainder, the first Poisson summation, the enlargement */}
			<At x={space.margin} y={186} w={940} style={{opacity: p4, display: 'flex', flexDirection: 'column', gap: 18}}>
				<Step label={['a remainder: all rows, a shorter column scale']} tex={'E(\\cH,L_b),\\qquad L_b=X/\\N(b)^{3}'} p={progress(f, 6, beat * 2)} />
				<Step
					label={['first Poisson summation, in ', {tex: 'h'}, ': new rows ', {tex: 'y'}]}
					tex={'E(\\cH,L_b)\\preccurlyeq X+\\frac{\\cH}{L_b^{2}}\\sum_{0<\\N(y)\\ll L_b^{2}/\\cH}|M(y)|^{2}'}
					p={progress(f, firstP)}
				/>
				<MixedLine
					px={size.small}
					p={progress(f, normY + beat)}
					parts={[{tex: 'M(y)=\\sum\\nolimits^{*}_{\\N(n)\\asymp L_b}\\arith{\\mu(n)}\\,\\xi_1(n)\\,\\overline{\\chi_n(y)}\\,U_1\\big(\\N(n)/L_b\\big)'}, ': the coefficients are Möbius signs']}
				/>
				<Step
					label={['then enlarge the row range: every term is a square']}
					tex={'\\N(y)\\ll Y=\\frac{XL_b}{\\cH}\\ \\ge\\ \\frac{L_b^{2}}{\\cH},\\qquad\\htmlClass{rtPos}{|M(y)|^{2}\\ge0}'}
					p={progress(f, enlarges)}
					lit={progress(f, square)}
				/>
				<MixedLine px={size.small} ink="ink" p={progress(f, same)} parts={['the same positivity spent the budget in chapter 4: dropping squares can only lower a sum of squares, and adding them can only raise it']} />
			</At>

			{/* rec-5: the second Poisson summation, and the transfer estimate */}
			<At x={space.margin} y={186} w={940} style={{opacity: p5, display: 'flex', flexDirection: 'column', gap: 26}}>
				<Step
					label={['second Poisson summation, in ', {tex: 'y'}, ': the rows come back shorter']}
					tex={"\\sum_{0<\\N(y)\\ll Y}|M(y)|^{2}\\preccurlyeq YL_b+Y\\,E'(\\cH',L_b),\\qquad\\cH'=\\frac{L_b^{2}}{Y}=\\frac{\\cH L_b}{X}"}
					p={progress(f, second)}
				/>
				<MixedLine px={size.small} p={progress(f, gauss)} parts={[{tex: "E'"}, ' has the same form as ', {tex: 'E'}, ': its coefficients are cubic Gauss sums again']} />
				<Step
					label={['both scales shrink by ', {tex: '\\N(b)^{3}'}, ', and their ratio is fixed']}
					tex={"(\\cH',X')=\\Big(\\frac{\\cH}{\\N(b)^{3}},\\frac{X}{\\N(b)^{3}}\\Big),\\qquad\\htmlClass{rtRatio}{\\frac{\\cH'}{X'}=\\frac{\\cH}{X}}"}
					p={progress(f, both)}
				/>
				<Step
					label={['the transfer estimate, Proposition 5.4']}
					tex={"E(\\cH,L_b)\\preccurlyeq X+\\frac{X}{L_b}\\,E'\\Big(\\frac{\\cH L_b}{X},L_b\\Big)"}
					p={progress(f, transfer)}
					lit={progress(f, transfer)}
				/>
				<MixedLine px={size.small} p={progress(f, transfer + beat)} parts={PREC} />
			</At>

			{/* the remainder's rows on one rectangle, columns L_b fixed */}
			<SVG>
				<EnergyRect x={FIG.x} y={FIG.y} w={T.X} h={T.H} ink={similar > 0.5 ? 'ink' : 'pencil'} dash={similar > 0.5 ? undefined : '6 8'} width={stroke.hair} p={progress(f, 6, beat * 2)} />
				<line
					x1={FIG.x}
					y1={FIG.y}
					x2={FIG.x + (T.X + 30) * progress(f, ratio, beat * 2)}
					y2={FIG.y - (T.X + 30) * (T.H / T.X) * progress(f, ratio, beat * 2)}
					stroke={color.pencil}
					strokeWidth={stroke.hair}
					strokeDasharray="6 8"
				/>
				<EnergyRect x={FIG.x} y={FIG.y} w={T.Lb} h={rows} ink={reInk} fill={1} width={similar > 0.5 ? stroke.bold : stroke.line} p={progress(f, 6, beat * 2)} />
				{/* the added rows, between the first range and the enlarged one */}
				{k2 > 0 && k3 < 1 && <rect x={FIG.x} y={FIG.y - rows} width={T.Lb} height={Math.max(0, rows - T.R1)} fill={alpha('ink', 0.06)} />}
				<Bracket x1={FIG.x + T.Lb + 18} y1={FIG.y} x2={FIG.x + T.Lb + 18} y2={FIG.y - rows} ink={reInk} p={progress(f, 6, beat * 2)} />
				<Bracket x1={FIG.x} y1={FIG.y + 18} x2={FIG.x + T.Lb} y2={FIG.y + 18} ink="pencil" p={progress(f, 8, beat * 2)} />
			</SVG>
			<RowSquares x={FIG.x} y={FIG.y} rows={kept} p={squaresP} ink="ink" />
			<RowSquares x={FIG.x} y={FIG.y} rows={added} from={kept} p={squaresP} ink="ink" density="light" />
			<At x={FIG.x + T.Lb + 36} y={FIG.y - rows / 2 - 22} style={{whiteSpace: 'nowrap', opacity: progress(f, 6, beat * 2)}}>
				<Tex px={size.label} display={false} ink={reInk} tex={label} />
			</At>
			<At x={FIG.x} y={FIG.y - T.H - 96} w={640} style={{opacity: window(f, square, start('rec-5'))}}>
				<MixedLine px={size.small} ink="ink" parts={['every row a square, ', {tex: '|M(y)|^{2}\\ge0'}]} />
				<MixedLine px={size.small} p={progress(f, never)} parts={['so adding rows can only raise the sum']} />
			</At>
			<At x={FIG.x + T.Lb / 2 - 40} y={FIG.y + 24} w={80} style={{textAlign: 'center', opacity: progress(f, 8, beat * 2)}}>
				<Tex px={size.label} display={false} ink="pencil" tex={'L_b'} />
			</At>
			<At x={FIG.x + T.X - 220} y={FIG.y - T.H + 14} w={210} style={{textAlign: 'right', opacity: progress(f, 6, beat * 2)}}>
				<Tex px={size.label} display={false} ink={similar > 0.5 ? 'ink' : 'pencil'} tex={'E(\\cH,X)'} />
			</At>
			<At x={FIG.x} y={FIG.y - T.Hp / 2 - 20} w={T.Lb} style={{textAlign: 'center', opacity: progress(f, gauss + beat)}}>
				<Tex px={size.label} display={false} tex={"E'(\\cH',X')"} />
			</At>
			<At x={FIG.x + T.X * 0.62 + 20} y={FIG.y - T.X * 0.62 * (T.H / T.X) - 60} style={{opacity: progress(f, ratio + beat), whiteSpace: 'nowrap'}}>
				<MixedLine px={size.small} parts={[{tex: '\\cH/X'}, ' fixed']} />
			</At>
			<Tag kind="schematic" p={progress(f, 6)} style={{position: 'absolute', left: FIG.x + T.X - 250, top: FIG.y + 24}} />

			<SceneLocator />
			<Cite p={progress(f, firstP) * p4}>October manuscript, §2.5; §7.1, first Poisson summation</Cite>
			<Cite p={p5}>October manuscript, §2.5 and Proposition 5.4; §7.2</Cite>
		</>
	);
};

// --- rec-ladder: the recursion, level by level, down to counting ---

const LADDER = {x: 180, y: 880, w: 680, h: 400};
const EQ_RECURSION = "\\htmlClass{rlLhs}{\\frac{E(\\cH,X)}{X}}\\;\\preccurlyeq\\;\\htmlClass{rlOne}{1}\\htmlClass{rlNext}{{}+\\sup_{b}\\frac{E'(\\cH',X')}{X'}}";
const EQ_SHRINK = "\\cH'<\\cH\\Big(\\frac{\\cH}{X}\\Big)^{2}\\ll D^{-2\\vartheta}\\,\\cH";

export const RecLadderScene: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const c6 = (s: string) => cue('rec-6', s);
	const c7 = (s: string) => cue('rec-7', s);
	const recursion = c6('runs as a recursion');
	const level = c6('The energy at one level');
	const atMost = c6('is at most one plus');
	const down = c6('one level down');
	const because = c6('Because the norm of b exceeds the cutoff');
	const shrinks = c6('each level shrinks the rows');
	const bounded = c6('After a bounded number of levels');
	const rowParam = c6('the row parameter is at most one');
	const counting = c6('plain counting finishes the job');
	const full = c7('The full proof carries');
	const hb = c7('admissible-exponent method');
	const skeleton = c7('the skeleton is this');
	const never = c7('never pays the energy outright');
	const instalments = c7('a bounded number of instalments');
	const last = c7('the last one is small enough to count');
	const n = LEVELS.length;
	// levels appear one by one between "shrinks" and "the row parameter is at most one"
	const appear = (j: number) => (j === 0 ? 6 : shrinks + ((j - 1) * (rowParam - shrinks)) / (n - 2));
	const shown = LEVELS.map((_, j) => progress(f, appear(j), beat * 2));
	// the instalments, paid in order, each at a smaller scale
	const pay = (j: number) => instalments + (j * (last - instalments)) / (n - 1);
	const lit = LEVELS.map((_, j) => window(f, pay(j), j === n - 1 ? 1e9 : pay(j + 1), beat));
	const fullP = window(f, full, skeleton - beat, beat * 1.5);
	const skeletonP = 1 - fullP;
	const land = progress(f, never);
	const t = SCHEDULE.theta;
	return (
		<>
			<SceneTitle p={progress(f, 4)}>A bounded number of instalments</SceneTitle>

			{/* top left: what the picture is, then the sentence the chapter lands */}
			<At x={space.margin} y={196} w={800} style={{opacity: 1 - progress(f, never - beat * 1.5, beat)}}>
				<MixedLine px={size.small} p={progress(f, shrinks)} parts={['similar rectangles on one diagonal: ', {tex: '\\cH/X'}, ' never changes']} />
				<MixedLine px={size.small} p={progress(f, shrinks + beat)} parts={['its rows at least ', {tex: 'D^{2\\vartheta}'}, ' times shorter (drawn smaller, not to scale)']} />
			</At>
			<At x={space.margin} y={190} w={780}>
				<Display px={size.lead} p={land}>
					The proof never pays the energy outright.
				</Display>
				<Display px={size.lead * 0.78} ink="pencil" p={progress(f, instalments)} style={{marginTop: 12}}>
					It pays a bounded number of instalments, each at a smaller scale, and the last one is small enough to count.
				</Display>
			</At>

			<Tag kind="schematic" p={progress(f, 6)} style={{position: 'absolute', left: LADDER.x, top: LADDER.y - LADDER.h - 46}} />
			<RecLadder {...LADDER} shown={shown} lit={lit} diag={progress(f, shrinks, beat * 3)} counted={progress(f, counting, beat * 2)} />
			<At x={LADDER.x + LADDER.w - 230} y={LADDER.y - LADDER.h + 14} w={220} style={{textAlign: 'right', opacity: progress(f, 6, beat * 2)}}>
				<Tex px={size.label} display={false} tex={'E(\\cH,X)'} />
			</At>
			<At x={LADDER.x - 52} y={LADDER.y - LADDER.h / 2 - 22} w={40} style={{textAlign: 'right', opacity: progress(f, 6, beat * 2)}}>
				<Tex px={size.label} display={false} ink="pencil" tex={'\\cH'} />
			</At>
			<At x={LADDER.x + levelSize(LADDER.w, LADDER.h, n - 1).w + 120} y={LADDER.y + 10} style={{whiteSpace: 'nowrap', opacity: progress(f, rowParam)}}>
				<MixedLine px={size.small} ink="ink" parts={['last level: row parameter at most 1', progress(f, counting) > 0.5 ? ', counted' : '']} />
			</At>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: progress(f, rowParam)}}>
				<line
					x1={LADDER.x + levelSize(LADDER.w, LADDER.h, n - 1).w * 0.6}
					y1={LADDER.y - levelSize(LADDER.w, LADDER.h, n - 1).h * 0.4}
					x2={LADDER.x + levelSize(LADDER.w, LADDER.h, n - 1).w + 110}
					y2={LADDER.y + 30}
					stroke={alpha('ink', 0.7)}
					strokeWidth={stroke.hair}
				/>
			</svg>

			{/* right: the recursion and the shrink, then the full proof's family */}
			<At x={980} y={186} w={812} style={{opacity: skeletonP}}>
				<MixedLine px={size.small} p={progress(f, level)} parts={['each level, measured against its column scale']} />
				<div style={{display: 'inline-block', marginTop: 2, opacity: progress(f, recursion)}}>
					<Tex
						px={size.math * 0.68}
						tex={EQ_RECURSION}
						light={{rlLhs: {ink: 'ink', p: progress(f, level)}}}
						show={{rlOne: progress(f, atMost), rlNext: progress(f, down)}}
					/>
				</div>
				<div style={{marginTop: 8, opacity: progress(f, because)}}>
					<MixedLine px={size.small} parts={['since ', {tex: '\\N(b)>H_c'}, ', and ', {tex: '\\cH/X\\asymp D^{-\\vartheta}'}, ' at every level:']} />
					<div style={{display: 'inline-block', marginTop: 2}}>
						<Tex px={size.math * 0.6} display={false} tex={EQ_SHRINK} />
					</div>
				</div>
				<MixedLine px={size.small} p={progress(f, bounded)} style={{marginTop: 8}} parts={['so level ', {tex: 'j'}, ' has rows at most ', {tex: 'D^{1-\\vartheta-2\\vartheta j}'}, ': ', {tex: 'O_\\vartheta(1)'}, ' levels']} />
			</At>
			<At x={970} y={186} w={822} style={{opacity: fullP}}>
				<MixedLine px={size.small} parts={['the full proof runs a larger family, with extra twists, common factors and dyadic ranges']} />
				<div style={{display: 'inline-block', marginTop: 4}}>
					<Tex
						px={24}
						ink="pencil"
						tex={'\\mathcal E(\\cH,X,F)=(XF)^{-1}\\mathop{{\\sum}^{*}}\\limits_{\\N(f)\\asymp F}\\ \\sum_{0<\\N(k)\\ll\\cH}\\Big|\\sum\\nolimits^{*}_{n}a_\\xi(n)\\chi_n(k)\\chi_n(f)^{4}U\\big(\\tfrac{\\N(n)}{X}\\big)\\Big|^{2}'}
					/>
				</div>
				<MixedLine
					px={size.small}
					ink="ink"
					style={{marginTop: 4}}
					parts={['Proposition 5.1: ', {tex: '\\mathcal E\\preccurlyeq XF'}, ' when ', {tex: '\\cH\\le XF\\cdot D^{-\\kappa}'}, ', the positive gap']}
				/>
				<MixedLine px={size.small} p={progress(f, hb)} parts={['by Heath-Brown’s admissible-exponent method']} />
			</At>

			<Ledger
				x={980}
				y={532}
				w={812}
				amountW={300}
				rowH={49}
				rules={progress(f, 6)}
				heading={{label: 'The instalments', amount: 'rows, at most', p: progress(f, 6)}}
				rows={[
					...LEVELS.map((e, j) => ({
						label: (j === 0 ? ['level 0: ', {tex: 'E(\\cH,X)'}] : j === n - 1 ? [`level ${j}: counting`] : [`level ${j}`]) as Part[],
						amount: j === n - 1 ? 'D^{0}=1' : `D^{${e}}`,
						kind: (j === n - 1 ? 'payment' : 'entry') as 'payment' | 'entry',
						p: j === 0 ? progress(f, level) : progress(f, appear(j) + beat),
						light: lit[j],
					})),
					{label: ['total: ', {tex: 'O_\\vartheta(1)'}, ' instalments'], amount: 'E(\\cH,X)\\preccurlyeq X', kind: 'total', p: progress(f, last + beat), light: progress(f, last + beat * 2)},
				]}
			/>

			<At x={1250} y={532} w={220} style={{opacity: progress(f, bounded)}}>
				<MixedLine px={size.small} parts={['at ', {tex: `\\vartheta=${t}`}]} />
			</At>

			<SceneLocator />
			<Cite p={progress(f, recursion) * (1 - progress(f, start('rec-7')))}>October manuscript, §2.5 and §5.5</Cite>
			<Cite p={progress(f, start('rec-7'))}>October manuscript, Proposition 5.1 and §5.5; Heath-Brown (1995), Lemma 8 and §8</Cite>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'rec-debt': RecDebt,
	'rec-split': RecSplit,
	'rec-transfer': RecTransfer,
	'rec-ladder': RecLadderScene,
};
