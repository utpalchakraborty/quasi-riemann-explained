import React from 'react';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Cite, Fraction, Tag, Text} from '../design/primitives';
import {At, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, size, space, stroke} from '../design/tokens';
import {BraceFade, Bracket, EnergyRect} from '../diagrams/Energy';

// Chapter 9: the cube factors come back out, and what they leave behind is
// handled by a recursion whose scales shrink in a fixed ratio.

const SVG: React.FC<{children: React.ReactNode}> = ({children}) => (
	<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
		{children}
	</svg>
);

// rec-debt: the original mean square, and the remainders that inversion leaves.
const DEBT = {x: 300, y: 892, w: 540, h: 196, rows: 6};
const REMAINDERS = [250, 140, 80, 46]; // schematic widths standing for X / N(b)^3
const REM_GAP = 40;
const REM_X = REMAINDERS.map((_, i) => DEBT.x + DEBT.w + 80 + REMAINDERS.slice(0, i).reduce((a, w) => a + w + REM_GAP, 0));
const REM_END = REM_X[REM_X.length - 1] + REMAINDERS[REMAINDERS.length - 1];

const EQ_COMPLETION =
	'T_h(X)=\\htmlClass{rdUbO}{\\underbrace{\\htmlClass{rdOrig}{P_h(X)}}_{\\htmlClass{rdOrigL}{\\text{original sum}}}}' +
	'+\\htmlClass{rdUbC}{\\underbrace{\\htmlClass{rdCube}{\\sum_{b\\neq1}\\frac{w_h(b)}{\\N(b)}\\,P_h\\!\\Big(\\frac{X}{\\N(b)^3}\\Big)}}_{\\htmlClass{rdCubeL}{\\text{cube terms}}}}';

const inverted = (cmp: string) =>
	`\\sum_{\\N(d)${cmp}H_c}\\frac{\\verd{\\mu(d)}\\,w_h(d)}{\\N(d)}\\,T_h\\!\\Big(\\frac{X}{\\N(d)^3}\\Big)`;
const EQ_INVERSION =
	'P_h(X)=' +
	`\\htmlClass{rdUbS}{\\underbrace{\\htmlClass{rdSmall}{${inverted('\\le ')}}}_{\\htmlClass{rdSmallL}{\\text{small: harmless}}}}` +
	'+' +
	`\\htmlClass{rdUbL}{\\underbrace{\\htmlClass{rdLarge}{${inverted('>')}}}_{\\htmlClass{rdLargeL}{\\text{large: a debt}}}}`;

export const RecDebt: React.FC = () => {
	const {frame: f, cue} = useCues();
	const c = (phrase: string) => cue('rec-1', phrase);
	const cube = progress(f, c('cube terms'));
	const orig = progress(f, c('original sum'));
	const small = progress(f, c('small b'));
	const harmless = progress(f, c('harmless'));
	const large = progress(f, c('large b'));
	const rem = c('leaves remainders');
	const kind = progress(f, c('same kind'));
	const cols = progress(f, c('X over the norm'), beat * 2);
	const rows = progress(f, c('full range of rows'), beat * 2);
	const yet = progress(f, c('not progress yet'));
	const remP = REMAINDERS.map((_, i) => progress(f, rem + i * beat * 0.6, beat * 2));
	const top = DEBT.y - DEBT.h;
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Completion leaves a debt</SceneTitle>
			<BraceFade show={{rdUbO: orig, rdUbC: cube, rdUbS: harmless, rdUbL: large}} />

			<At x={space.margin} y={190} style={{opacity: progress(f, c('completion'))}}>
				<Tex
					px={44}
					tex={EQ_COMPLETION}
					light={{rdCube: {ink: 'ember', p: cube}}}
					show={{rdOrigL: orig, rdCubeL: cube}}
				/>
			</At>
			<At x={space.margin} y={440} style={{opacity: progress(f, c('Möbius inversion'))}}>
				<Tex
					px={44}
					tex={EQ_INVERSION}
					light={{rdSmall: {ink: 'verdigris', p: small}, rdLarge: {ink: 'ember', p: large}}}
					show={{rdSmallL: harmless, rdLargeL: large}}
				/>
			</At>

			<SVG>
				<EnergyRect {...DEBT} ink="paper" p={progress(f, c('original sum'), beat * 2)} fill={1} />
				{REMAINDERS.map((w, i) => (
					<EnergyRect key={w} x={REM_X[i]} y={DEBT.y} w={w} h={DEBT.h} rows={DEBT.rows} ink="ember" p={remP[i]} fill={1} />
				))}
				{/* rows: H, the same for every remainder */}
				<Bracket x1={DEBT.x - 28} y1={DEBT.y} x2={DEBT.x - 28} y2={top} ink={rows > 0 ? 'ember' : 'mist'} p={progress(f, c('original sum'), beat * 2)} />
				<Bracket x1={REM_END + 28} y1={DEBT.y} x2={REM_END + 28} y2={top} ink="ember" p={rows} />
				{[top, DEBT.y].map((yy) => (
					<line key={yy} x1={DEBT.x} x2={DEBT.x + (REM_END - DEBT.x) * rows} y1={yy} y2={yy} stroke={alpha('ember', 0.7)} strokeWidth={stroke.hair} strokeDasharray="6 8" />
				))}
				{/* columns: X, then X / N(b)^3 */}
				<Bracket x1={DEBT.x} y1={DEBT.y + 22} x2={DEBT.x + DEBT.w} y2={DEBT.y + 22} p={progress(f, c('original sum') + beat, beat * 2)} />
				<Bracket x1={REM_X[0]} y1={DEBT.y + 22} x2={REM_X[0] + REMAINDERS[0]} y2={DEBT.y + 22} ink="ember" p={cols} />
			</SVG>

			<At x={DEBT.x - 108} y={top + DEBT.h / 2 - 50} w={70} style={{textAlign: 'right', opacity: progress(f, c('original sum') + beat)}}>
				<Tex tex={'\\cH'} px={size.mathInline} display={false} ink={rows > 0.5 ? 'ember' : 'paper'} />
				<Text px={size.small} ink="mist">
					rows
				</Text>
			</At>
			<At x={DEBT.x} y={top + DEBT.h / 2 - 34} w={DEBT.w} style={{textAlign: 'center', opacity: progress(f, c('original sum') + beat)}}>
				<Tex tex={'E(\\cH,X)'} px={size.mathInline} display={false} />
			</At>
			<At x={DEBT.x} y={DEBT.y + 32} w={DEBT.w} style={{textAlign: 'center', opacity: progress(f, c('original sum') + beat * 2)}}>
				<Tex tex={'X\\ \\ \\mist{\\text{columns}}'} px={size.label} display={false} />
			</At>
			<At x={REM_X[0]} y={top + DEBT.h / 2 - 30} w={REMAINDERS[0]} style={{textAlign: 'center', opacity: kind}}>
				<Tex tex={'E(\\cH,L_b)'} px={size.label + 4} display={false} ink="ember" />
			</At>
			<At x={REM_X[0] - 40} y={DEBT.y + 32} w={REMAINDERS[0] + 80} style={{textAlign: 'center', opacity: cols}}>
				<Tex tex={'L_b=X/\\N(b)^3'} px={size.label} display={false} ink="ember" />
			</At>
			<At x={REM_END + 52} y={top + 20} w={space.margin + 1920 - REM_END - 2 * space.margin - 52} style={{opacity: rows}}>
				<Tex tex={'\\cH'} px={size.mathInline} display={false} ink="ember" />
				<Text px={size.small} ink="mist">
					all rows
				</Text>
				<Text px={size.small} ink="ember" p={yet} style={{marginTop: 10}}>
					not yet smaller
				</Text>
			</At>
			<Tag kind="schematic" p={remP[0]} style={{position: 'absolute', left: REM_END + 52, top: DEBT.y - 30}} />

			<SceneLocator />
			<Cite p={progress(f, c('Möbius inversion'))}>October manuscript, §2.5</Cite>
		</>
	);
};

// rec-shrink: two Poisson transfers turn (H, L_b) into (H', X') with the
// original shape; repeated, every branch reaches the counting floor.
const CORNER = {x: 1000, y: 884};
const OUTER = {w: 770, h: 470};
const RATIO = OUTER.h / OUTER.w; // H / X, fixed
const SHRINK = 0.48; // schematic contraction per step
const L_B = OUTER.w * SHRINK; // the remainder's column scale
const DUAL = (L_B * L_B) / OUTER.h; // L_b^2 / H
const WIDE = (OUTER.w * L_B) / OUTER.h; // Y = X L_b / H
const NEXT = (L_B * L_B) / WIDE; // H' = L_b^2 / Y = H L_b / X
const FLOOR = 30; // rows at most 1: counting
const STAGES = 4;
const scaleAt = (k: number) => Math.pow(SHRINK, k);
const BRANCHES = [0.62, 0.36]; // further branches, as fractions of the main step

const FlowLine: React.FC<{label: string; tex: string; p: number; lit?: number; px?: number}> = ({label, tex, p, lit = 0, px = 40}) => (
	<div style={{opacity: p}}>
		<Text px={size.small} ink={lit > 0.5 ? 'paper' : 'mist'}>
			{label}
		</Text>
		<div style={{marginTop: 4, display: 'inline-block', whiteSpace: 'nowrap'}}>
			<Tex tex={tex} px={px} />
		</div>
	</div>
);

export const RecShrink: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const c2 = (phrase: string) => cue('rec-2', phrase);
	const c3 = (phrase: string) => cue('rec-3', phrase);
	const c4 = (phrase: string) => cue('rec-4', phrase);

	// rec-2: the remainder's rows go H -> L_b^2/H -> Y -> H'; its columns stay L_b.
	const poisson1 = progress(f, c2('Poisson summation'), beat * 2.5, ease.inOut);
	const widen = progress(f, c2('widening'), beat * 3, ease.inOut);
	const nonneg = progress(f, c2('non-negative'));
	const poisson2 = progress(f, c2('same kind of estimate'), beat * 2.5, ease.inOut);
	const divided = progress(f, c2('both scales divided'));
	const together = progress(f, c2('shrink together'), beat * 3, ease.inOut);
	const ratio = progress(f, c2('ratio never changes'), beat * 2);
	const remH = lerp(lerp(lerp(OUTER.h, DUAL, poisson1), WIDE, widen), NEXT, poisson2);
	const rowLabel = poisson2 > 0.5 ? "\\cH'=\\cH L_b/X" : widen > 0.5 ? 'Y=XL_b/\\cH' : poisson1 > 0.5 ? 'L_b^2/\\cH' : '\\cH';

	// rec-3: steps 2..4, each the same contraction.
	const stepAt = [c3('Each step'), c3('D to the two theta'), c3('bounded number')];
	const stage = 1 + stepAt.reduce((s, at) => s + progress(f, at, beat * 2.5, ease.inOut), 0);
	const k = Math.min(STAGES, Math.floor(stage + 1e-6));
	const branches = progress(f, c3('every branch'), beat * 2);
	const counting = progress(f, c3('simple counting'));
	const never = progress(f, c3('never zero'));

	// rec-4: the inequality runs back up the steps.
	const closes = c4('it closes');
	const back = (j: number) => progress(f, closes + (STAGES - j) * beat * 0.5, beat);
	const proved = progress(f, c4('energy budget is proved'));

	const p2 = 1 - progress(f, start('rec-3') - beat, beat);
	const p3 = progress(f, start('rec-3'), beat) * (1 - progress(f, start('rec-4') - beat, beat));
	const p4 = progress(f, start('rec-4'), beat);

	const rect = (s: number) => ({x: CORNER.x, y: CORNER.y, w: OUTER.w * s, h: OUTER.h * s});
	const current = rect(scaleAt(stage));
	const remainderVisible = 1 - together;
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Rows and columns shrink together</SceneTitle>

			{/* rec-2: the transfer, step by step */}
			<At x={space.margin} y={210} w={800} style={{opacity: p2, display: 'flex', flexDirection: 'column', gap: 26}}>
				<FlowLine label="a remainder" tex={'E(\\cH,L_b),\\qquad L_b=X/\\N(b)^3'} p={progress(f, 6)} />
				<FlowLine
					label="Poisson summation in h"
					tex={'E(\\cH,L_b)\\preccurlyeq X+\\frac{\\cH}{L_b^2}\\sum_{0<\\N(y)\\ll L_b^2/\\cH}|M(y)|^2'}
					p={progress(f, c2('Poisson summation'))}
				/>
				<FlowLine
					label="widen the range: every term is non-negative"
					tex={'\\N(y)\\ll Y=\\frac{XL_b}{\\cH},\\qquad |M(y)|^2\\ge0'}
					p={progress(f, c2('widening'))}
					lit={nonneg}
				/>
				<FlowLine
					label="Poisson summation in y"
					tex={"E'(\\cH',X'),\\quad (\\cH',X')=\\Big(\\frac{\\cH}{\\N(b)^3},\\frac{X}{\\N(b)^3}\\Big)"}
					p={progress(f, c2('same kind of estimate'))}
					lit={divided}
				/>
				<div style={{opacity: ratio}}>
					<Tex tex={"\\frac{\\cH'}{X'}=\\frac{\\cH}{X}"} px={size.math} display={false} />
				</div>
			</At>

			{/* rec-3: the contraction and the count of steps */}
			<At x={space.margin} y={220} w={820} style={{opacity: p3, display: 'flex', flexDirection: 'column', gap: 34}}>
				<div style={{opacity: progress(f, c3('Each step'))}}>
					<Tex tex={"\\cH'<\\cH\\Big(\\frac{\\cH}{X}\\Big)^{2}\\ll D^{-2\\vartheta}\\cH"} px={size.math * 0.9} display={false} />
					<Text px={size.small} ink="mist" style={{marginTop: 8}}>
						at every step, for every branch
					</Text>
				</div>
				<div style={{opacity: progress(f, c3('Each step') + beat), display: 'flex', alignItems: 'baseline', gap: 24}}>
					<Text px={size.label} ink="mist">
						after step {k}
					</Text>
					<Tex tex={`\\cH^{(${k})}\\ll D^{-${2 * k}\\vartheta}\\,\\cH`} px={size.math * 0.8} display={false} />
				</div>
				<div style={{opacity: progress(f, c3('theta is positive'))}}>
					<Tex tex={'\\vartheta>0\\ \\Longrightarrow\\ O_{\\vartheta}(1)\\ \\text{steps}'} px={size.math * 0.8} display={false} />
				</div>
				<Text px={size.body} p={counting}>
					Rows at most 1: counting is enough.
				</Text>
				<div style={{opacity: never, display: 'flex', alignItems: 'baseline', gap: 24}}>
					<Tex tex={'\\vartheta=0:\\ \\ D^{-2\\vartheta}=1'} px={size.math * 0.8} display={false} ink="ember" />
					<Text px={size.label} ink="mist">
						no step need shrink
					</Text>
				</div>
			</At>

			{/* rec-4: the skeleton closes */}
			<At x={space.margin} y={210} w={820} style={{opacity: p4, display: 'flex', flexDirection: 'column', gap: 30}}>
				<div>
					<Text px={size.small} ink="mist">
						the full proof runs a larger family, with twists and common factors
					</Text>
					<div style={{marginTop: 6, display: 'inline-block', whiteSpace: 'nowrap'}}>
						<Tex
							tex={'\\mathcal E(\\cH,X,F)=\\frac{1}{XF}\\sum_{\\N(f)\\asymp F}^{*}\\ \\sum_{0<\\N(k)\\ll\\cH}\\Big|\\sum_{n}^{*}a_\\xi(n)\\chi_n(k)\\chi_n(f)^4U\\big(\\tfrac{\\N(n)}{X}\\big)\\Big|^2'}
							px={30}
							ink="mist"
						/>
					</div>
				</div>
				<div style={{opacity: progress(f, c4('skeleton')), display: 'inline-block', alignSelf: 'flex-start'}}>
					<Tex tex={"\\frac{E(\\cH,X)}{X}\\preccurlyeq 1+\\sup_{b}\\frac{E'(\\cH',X')}{X'}"} px={size.math * 0.8} />
				</div>
				<div style={{opacity: proved, display: 'flex', alignItems: 'baseline', gap: 28, whiteSpace: 'nowrap'}}>
					<Tex tex={'E(\\cH,X)\\preccurlyeq X'} px={size.math} display={false} />
					<Tex tex={'\\text{the energy budget, up to a factor }D^{\\varepsilon}'} px={size.small} display={false} ink="mist" />
				</div>
			</At>
			<At x={space.margin + 20} y={668} style={{opacity: p4}}>
				<Fraction n="11" d="12" px={112} p={progress(f, c4('eleven twelfths'))} />
			</At>

			<SVG>
				{/* the original shape, and the diagonal every similar rectangle shares */}
				<EnergyRect {...rect(1)} ink="mist" rows={9} p={progress(f, 2, beat * 2)} width={stroke.hair} />
				<line
					x1={CORNER.x}
					y1={CORNER.y}
					x2={CORNER.x + (OUTER.w + 40) * ratio}
					y2={CORNER.y - (OUTER.w + 40) * RATIO * ratio}
					stroke={color.mist}
					strokeWidth={stroke.hair}
					strokeDasharray="6 8"
				/>
				{/* the remainder, transformed by the two Poisson steps */}
				<EnergyRect x={CORNER.x} y={CORNER.y} w={L_B} h={remH} ink="ember" rows={6} fill={1} p={progress(f, 6, beat * 2)} opacity={remainderVisible} />
				<Bracket x1={CORNER.x + L_B + 20} y1={CORNER.y} x2={CORNER.x + L_B + 20} y2={CORNER.y - remH} ink="ember" p={progress(f, c2('Poisson summation') - beat) * remainderVisible} />
				{/* the original shrinking onto its copy */}
				{together > 0 && together < 1 && <EnergyRect {...rect(lerp(1, SHRINK, together))} ink="paper" width={stroke.hair} />}
				{/* finished steps, and the step in progress */}
				{Array.from({length: STAGES}, (_, i) => i + 1).map((j) => {
					if (j >= stage - 1e-6 && back(j) <= 0) return null;
					const lit = back(j);
					return <EnergyRect key={j} {...rect(scaleAt(j))} ink={lit > 0 ? 'paper' : 'mist'} width={lit > 0 ? stroke.bold : stroke.line} opacity={lit > 0 ? 1 : 0.8} />;
				})}
				<EnergyRect {...current} ink="paper" width={stroke.bold} opacity={together} />
				{back(0) > 0 && <EnergyRect {...rect(1)} ink="paper" width={stroke.bold} opacity={back(0)} />}
				{/* other branches: different b, same ratio, at least the same contraction */}
				{Array.from({length: STAGES}, (_, i) => i + 1).map((j) =>
					BRANCHES.map((b) => (
						<EnergyRect key={`${j}-${b}`} {...rect(scaleAt(j - 1) * SHRINK * b)} ink="mist" dash="4 5" width={stroke.hair} p={branches * (stage >= j ? 1 : 0)} />
					)),
				)}
				{/* the counting floor */}
				<line x1={CORNER.x} x2={CORNER.x + 400} y1={CORNER.y - FLOOR} y2={CORNER.y - FLOOR} stroke={counting > 0 ? color.verdigris : color.mist} strokeWidth={stroke.line} opacity={progress(f, c3('bounded number'))} />
			</SVG>

			{/* labels on the figure */}
			<At x={CORNER.x + L_B + 36} y={CORNER.y - remH / 2 - 24} style={{opacity: progress(f, 6) * remainderVisible, whiteSpace: 'nowrap'}}>
				<Tex tex={rowLabel} px={size.label + 2} display={false} ink="ember" />
			</At>
			<At x={CORNER.x + OUTER.w - 200} y={CORNER.y - OUTER.h + 18} w={190} style={{textAlign: 'right', opacity: progress(f, 2, beat * 2) * (1 - proved)}}>
				<Tex tex={'E(\\cH,X)'} px={size.label + 2} display={false} ink="mist" />
			</At>
			<At x={CORNER.x + OUTER.w - 320} y={CORNER.y - OUTER.h + 18} w={310} style={{textAlign: 'right', opacity: proved}}>
				<Tex tex={'E(\\cH,X)\\preccurlyeq X'} px={size.label + 4} display={false} />
			</At>
			<At x={CORNER.x + L_B * 0.5 - 90} y={CORNER.y - NEXT * 0.5 - 22} w={180} style={{textAlign: 'center', opacity: window(f, c2('shrink together') + beat * 2, start('rec-3'))}}>
				<Tex tex={"E'(\\cH',X')"} px={size.label} display={false} />
			</At>
			<At x={CORNER.x + OUTER.w * 0.62} y={CORNER.y - OUTER.w * 0.62 * RATIO - 84} style={{opacity: ratio * (1 - p4), whiteSpace: 'nowrap'}}>
				<Tex tex={'\\cH/X\\ \\text{fixed}'} px={size.label} display={false} ink="mist" />
			</At>
			<At x={CORNER.x + 414} y={CORNER.y - FLOOR - 22} style={{opacity: progress(f, c3('bounded number')), whiteSpace: 'nowrap'}}>
				<Text px={size.small} ink={counting > 0 ? 'verdigris' : 'mist'}>
					rows ≤ 1: count
				</Text>
			</At>
			<Tag kind="schematic" p={progress(f, 2, beat * 2)} style={{position: 'absolute', left: CORNER.x + OUTER.w - 250, top: CORNER.y + 24}} />

			<SceneLocator />
			<Cite p={progress(f, 6)}>October manuscript, §2.5 and Proposition 5.1</Cite>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'rec-debt': RecDebt,
	'rec-shrink': RecShrink,
};
