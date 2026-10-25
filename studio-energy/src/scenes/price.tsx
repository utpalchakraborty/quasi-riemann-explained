import React from 'react';
import {useCues} from '../cues';
import {progress, window} from '../design/motion';
import {Cite, Tag} from '../design/primitives';
import {At, SceneLocator, SceneTitle, seeded} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, size, space, stroke} from '../design/tokens';
import {AreaColumn, Square} from '../diagrams/Area';
import {Ledger, type LedgerRow} from '../diagrams/Ledger';
import {MixedLine} from '../diagrams/MixedLine';
import {ThetaSlider} from '../diagrams/ThetaSlider';

// Chapter 8: The price of the budget. October manuscript, §2.5, Proposition 5.1
// and §5.6; the coda is the September manuscript's proof overview.

// --- price-theta: theta is the fuel, epsilon the friction ---

export const PriceTheta: React.FC = () => {
	const {frame: f, cue} = useCues();
	const fuel = cue('price-1', 'Theta is the fuel');
	const gap = cue('price-1', 'the positive gap');
	const shrink = cue('price-1', 'makes the recursion shrink');
	const costs = cue('price-1', 'It costs five theta over twelve');
	const small = cue('price-1', 'kept small');
	const never = cue('price-1', 'never zero');
	const friction = cue('price-1', 'Epsilon is the friction');
	const sieve = cue('price-1', 'every sieve loses');
	const bounded = cue('price-1', 'a bounded number of steps');
	// theta slides toward zero once it is called small, and never reaches it
	const theta = f < small ? 0.1 : 0.004 + 0.096 * Math.exp(-(f - small) / (beat * 4));
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Fuel and friction</SceneTitle>
			<Ledger
				x={space.margin + 30}
				y={196}
				w={1400}
				amountW={420}
				heading={{label: 'What theta and epsilon buy, and what they cost', amount: 'at the basic scales', p: progress(f, 6)}}
				rows={[
					{label: ['fuel: dual rows shorter than the columns, the positive gap'], amount: '\\cH/X\\asymp D^{-\\vartheta}', kind: 'payment', p: progress(f, gap), light: window(f, gap, shrink)},
					{label: ['fuel: every step of the recursion shrinks the rows'], amount: "\\cH'\\ll D^{-2\\vartheta}\\,\\cH", kind: 'payment', p: progress(f, shrink), light: window(f, shrink, costs)},
					{label: ['cost: the exponent of the target'], amount: '+\\,\\tfrac{5\\vartheta}{12}', kind: 'debt', p: progress(f, costs), light: window(f, costs, friction)},
					{label: ['friction: every sieve loses a tiny power'], amount: '\\times\\,D^{\\varepsilon}', kind: 'debt', p: progress(f, sieve), light: window(f, sieve, bounded)},
					{label: ['steps, and so frictions, in all'], amount: 'O_{\\vartheta}(1)', kind: 'total', p: progress(f, bounded), light: progress(f, bounded)},
				]}
			/>
			<At x={space.margin + 30} y={196 + 6 * 65 + 6} w={900} style={{opacity: progress(f, fuel)}}>
				<MixedLine px={size.small} parts={['theta is fixed in ', {tex: '(0,\\tfrac1{10}]'}, '; the full positive gap is ', {tex: '\\cH\\le XF\\,D^{-\\kappa}'}, ' (Proposition 5.1)']} />
			</At>
			<ThetaSlider x={560} y={720} w={940} theta={theta} p={progress(f, costs - beat)} zero={progress(f, never)} exponent={progress(f, costs)} />
			<Tag kind="claim" p={progress(f, gap)} style={{position: 'absolute', left: 1580, top: 196 + 6 * 65 + 12}} />
			<SceneLocator />
			<Cite p={progress(f, gap)}>October manuscript, §2.5, Proposition 5.1 and §5.6</Cite>
		</>
	);
};

// --- price-september: the same idea, several accounts at once ---

const ROWS = 16;
const ROW = {x: space.margin + 20, y: 560, w: 1000};
// Schematic sizes; the detector flags the rows whose square is large.
const SIZES = Array.from({length: ROWS}, (_, i) => 16 + 42 * seeded(i, 11) ** 2);
const FLAG = SIZES.map((s) => s > 35);
if (FLAG.filter(Boolean).length < 3) throw new Error('the schematic needs a few flagged rows');

// Each account's frame holds the flagged rows' energy with room to spare.
const MOMENT = SIZES.filter((_, i) => FLAG[i]).reduce((t, s) => t + s * s, 0) * 1.3;

export const PriceSeptember: React.FC = () => {
	const {frame: f, cue} = useCues();
	const sept = cue('price-2', 'The September manuscript');
	const reflected = cue('price-2', 'reflected-energy bounds');
	const moments = cue('price-2', 'two moment bounds');
	const recursion = cue('price-2', 'its own recursion');
	const detector = cue('price-2', 'zero detector can flag');
	const outliers = cue('price-2', 'counting outliers');
	const accounts = cue('price-2', 'several accounts open');
	const keep = cue('price-2', 'Keep theta positive');
	const pay = cue('price-2', 'pay epsilon');
	const closes = cue('price-2', 'the ledger closes');
	const cell = ROW.w / ROWS;
	const scan = progress(f, detector - beat, beat * 3, ease.inOut);
	const flagged = SIZES.map((s, i) => ({s, i})).filter((r) => FLAG[r.i]);
	const pour = progress(f, outliers, beat * 3, ease.inOut);
	const out = 1 - progress(f, keep - beat, beat * 2);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Several accounts at once</SceneTitle>
			<div style={{opacity: out}}>
				<At x={space.margin} y={196} w={1100}>
					<MixedLine p={progress(f, sept)} parts={['the September manuscript, toward ', {tex: '\\tfrac78', ink: 'cobalt'}, ': rows of completed theta sums']} />
					<MixedLine p={progress(f, reflected)} px={size.small} parts={['their mean squares bounded by reflected energy (the cubic theta reflection and the quadratic sieve)']} style={{marginTop: 8}} />
				</At>
				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
					<line x1={ROW.x} x2={ROW.x + ROW.w} y1={ROW.y} y2={ROW.y} stroke={alpha('pencil', 0.7)} strokeWidth={stroke.hair} />
					{SIZES.map((s, i) => {
						const lit = FLAG[i] && scan * ROWS > i;
						return <Square key={i} x={ROW.x + i * cell + (cell - s) / 2} y={ROW.y - s - 4} side={s} ink={lit ? 'vermilion' : 'ink'} p={progress(f, sept + i * 1.2, beat)} width={lit ? stroke.bold : stroke.line} />;
					})}
					{/* the detector: a cursor sweeping the rows */}
					{scan > 0 && scan < 1 && <line x1={ROW.x + scan * ROW.w} x2={ROW.x + scan * ROW.w} y1={ROW.y - 70} y2={ROW.y + 16} stroke={color.vermilion} strokeWidth={stroke.line} />}
				</svg>
				<At x={ROW.x} y={ROW.y + 24} w={ROW.w}>
					<MixedLine p={progress(f, detector)} px={size.small} parts={['a zero detector flags the rows where a zero sits above its floor; each flagged row carries two large Dirichlet polynomials']} />
				</At>
				{/* two accounts: the moments of the two kinds of polynomial */}
				{[
					{x: 1260, label: 'inverse polynomials', at: moments},
					{x: 1540, label: 'plain polynomials', at: recursion},
				].map((a) => (
					<React.Fragment key={a.label}>
						<AreaColumn x={a.x} y={760} w={170} areas={flagged.map((r) => r.s * r.s)} budget={MOMENT} scale={(300 * 170) / MOMENT} filled={pour * flagged.length} frameP={progress(f, a.at)} ink={() => 'vermilion'} />
						<At x={a.x - 20} y={784} w={210} style={{textAlign: 'center'}}>
							<MixedLine p={progress(f, a.at)} px={size.small} parts={[a.label]} />
						</At>
					</React.Fragment>
				))}
				<At x={1260} y={330} w={470}>
					<MixedLine p={progress(f, recursion)} px={size.small} parts={['two moment bounds, each proved by its own recursion of finite Poisson steps']} />
				</At>
				<At x={1260} y={870} w={470} style={{opacity: progress(f, outliers)}}>
					<MixedLine px={size.small} parts={['so at most ', {tex: 'B/T^{2}'}, ' rows can be flagged']} />
				</At>
			</div>
			{/* the ledger closes */}
			<Ledger
				x={space.margin + 30}
				y={300}
				w={1300}
				amountW={420}
				heading={{label: 'The October account, as the manuscript closes it', amount: 'in the manuscript', p: progress(f, keep - beat)}}
				rows={(
					[
					{label: ['the budget: ', {tex: '\\textstyle\\sum_u|A_u(D)|^2\\ll D^{1+\\varepsilon}H'}], note: 'Proposition 3.1', kind: 'budget', p: progress(f, keep - beat * 0.5)},
					{label: ['theta: kept positive and small'], note: 'paid', kind: 'payment', p: progress(f, keep)},
					{label: ['epsilon: paid a bounded number of times'], note: 'paid', kind: 'payment', p: progress(f, pay)},
					{label: ['the borrowed cube terms'], note: 'returned', kind: 'debt', p: progress(f, pay + beat), strike: progress(f, pay + beat * 2, beat * 2)},
					{label: ['the target'], amount: '|A_1(D)|\\ll D^{\\frac{11}{12}+\\varepsilon}', kind: 'total', p: progress(f, closes)},
					] as LedgerRow[]
				).map((r) => ({...r, p: (r.p ?? 1) * progress(f, keep - beat)}))}
				rules={progress(f, keep - beat)}
			/>
			<Tag kind="schematic" p={progress(f, sept) * out} style={{position: 'absolute', left: ROW.x, top: 900}} />
			<SceneLocator />
			<Cite p={progress(f, sept) * out}>September manuscript, proof overview: “The refined second stage”</Cite>
			<Cite p={progress(f, keep)}>October manuscript, §§3–5</Cite>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'price-theta': PriceTheta,
	'price-september': PriceSeptember,
};
