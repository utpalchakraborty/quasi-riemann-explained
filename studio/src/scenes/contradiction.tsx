import React from 'react';
import {useCues} from '../cues';
import {progress} from '../design/motion';
import {Cite, Tag} from '../design/primitives';
import {At, Callout, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {beat, ease, size, space} from '../design/tokens';
import {HalfPlane, planeX} from '../diagrams/HalfPlane';
import {MixedLine} from '../diagrams/MixedLine';
import {RHO, WHAT_AT_RHO, WindowPlot} from '../diagrams/WindowPlot';

// Chapter 6: The contradiction. October manuscript, §3.

const TICKS = [
	{sigma: 0.5, tex: '\\tfrac12'},
	{sigma: 11 / 12, tex: '\\tfrac{11}{12}', ink: 'gilt' as const},
	{sigma: 1, tex: '1'},
];

// --- contra-mellin: the transform is holomorphic beyond 11/12, and equals W-hat / L ---

const MAP = {x: 1100, y: 330, w: 600, h: 520, sigma: [0.45, 1.2] as [number, number]};

export const ContraMellin: React.FC = () => {
	const {frame: f, cue} = useCues();
	const mellin = cue('contra-1', 'Mellin transform');
	const integrate = cue('contra-1', 'integrate A one of D');
	const bound = cue('contra-1', 'The bound we just proved');
	const converge = cue('contra-1', 'converge');
	const above = cue('contra-1', 'above eleven twelfths');
	const holo = cue('contra-1', 'holomorphic');
	const termwise = cue('contra-2', 'term by term');
	const what = cue('contra-2', 'W hat of s');
	const divided = cue('contra-2', 'divided by the L-function');
	const multiply = cue('contra-2', 'Multiply through');
	const carries = cue('contra-2', 'carries over');
	const reach = progress(f, carries, beat * 5, ease.inOut);
	const from = 1 - reach / 12;
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The Mellin transform</SceneTitle>

			<At x={space.margin} y={196} style={{opacity: progress(f, mellin)}}>
				<Tex
					px={size.math}
					tex={'\\mathcal M_W(s)=\\int_0^\\infty \\htmlClass{a}{A_1(D)}\\,\\htmlClass{d}{D^{-s}}\\,\\frac{dD}{D}'}
					light={{a: {ink: 'gilt', p: progress(f, integrate)}}}
				/>
			</At>
			<At x={space.margin} y={372} style={{opacity: progress(f, bound)}}>
				<Tex px={size.math * 0.9} display={false} tex={'|A_1(D)|\\ll D^{\\frac{11}{12}+\\varepsilon}'} />
			</At>
			<At x={space.margin} y={456} w={900}>
				<MixedLine p={progress(f, converge)} parts={['so the integral converges, and is holomorphic, for ', {tex: '\\Re s>\\tfrac{11}{12}'}]} />
			</At>
			<At x={space.margin} y={540} style={{opacity: progress(f, what)}}>
				<Tex
					px={size.math}
					tex={'\\mathcal M_W(s)=\\frac{\\widehat W(s)}{\\htmlClass{l}{L_K^S(s,\\nu)}}'}
					light={{l: {ink: 'mist', p: 1 - progress(f, divided)}}}
				/>
			</At>
			<At x={space.margin} y={712} w={900}>
				<MixedLine p={progress(f, what)} parts={['computed term by term, for ', {tex: '\\Re s>1'}]} />
			</At>
			<At x={space.margin} y={796} style={{opacity: progress(f, multiply)}}>
				<Tex px={size.math} display={false} tex={'L_K^S(s,\\nu)\\,\\mathcal M_W(s)=\\widehat W(s)'} />
			</At>

			<HalfPlane
				id="mellin"
				{...MAP}
				p={progress(f, 4, beat * 2)}
				ticks={TICKS.map((t) => ({...t, p: t.ink ? progress(f, above) : 1}))}
				lines={[{sigma: 11 / 12, ink: 'gilt', p: progress(f, above, beat * 2)}]}
				hatches={[{from: 11 / 12, ink: 'gilt', p: progress(f, holo, beat * 2)}]}
				bracket={{from, p: progress(f, termwise), y: 44}}
			/>
			<Callout
				x={planeX(MAP.x, MAP.w, MAP.sigma, 0.9) - 30}
				y={MAP.y + 150}
				to={[planeX(MAP.x, MAP.w, MAP.sigma, 1.06), MAP.y + 190]}
				ink="gilt"
				align="right"
				width={330}
				p={progress(f, holo)}
			>
				<MixedLine ink="gilt" parts={[{tex: '\\mathcal M_W', ink: 'gilt'}, ' is holomorphic']} />
			</Callout>
			<At x={MAP.x + MAP.w - 520} y={MAP.y - 118} w={520} style={{textAlign: 'right'}}>
				<div style={{position: 'absolute', right: 0, opacity: progress(f, termwise) * (1 - progress(f, multiply))}}>
					<MixedLine parts={['term by term, ', {tex: '\\Re s>1'}]} />
				</div>
				<div style={{position: 'absolute', right: 0, opacity: progress(f, multiply)}}>
					<Tex px={size.label} display={false} tex={'L_K^S\\,\\mathcal M_W=\\widehat W'} />
				</div>
			</At>
			<Tag kind="schematic" p={progress(f, holo)} style={{position: 'absolute', left: MAP.x + MAP.w - 230, top: MAP.y + MAP.h + 64}} />

			<SceneLocator />
			<Cite p={progress(f, mellin)}>October manuscript, §3</Cite>
		</>
	);
};

// --- contra-window: aim the window at a supposed zero; 0 = positive ---

const MINI = {x: 1340, y: 300, w: 400, h: 500, sigma: [0.78, 1.12] as [number, number]};
const PLOT = {x: 230, y: 450, w: 820, h: 330};

export const ContraWindow: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const zeroAt = cue('contra-3', 'had a zero');
	const rhoAt = cue('contra-3', 'rho');
	const beyond = cue('contra-3', 'beyond eleven twelfths');
	const aims = cue('contra-3', 'aims the window');
	const wOf = cue('contra-3', 'W of y is');
	const minusRho = cue('contra-3', 'minus rho');
	const bump = cue('contra-3', 'smooth bump');
	const what = cue('contra-3', 'Then W hat at rho');
	const integral = cue('contra-3', 'the integral of phi');
	const positiveNum = cue('contra-3', 'a positive number');
	const second = start('contra-4');
	const leftZero = cue('contra-4', 'the left side is zero');
	const finite = cue('contra-4', 'something finite');
	const isZero = cue('contra-4', 'which is zero');
	const rightPos = cue('contra-4', 'The right side is positive');
	const absurd = cue('contra-4', 'Zero equals a positive number');
	const none = cue('contra-4', 'no such zero exists');
	const plotOut = 1 - progress(f, second, beat * 2);
	const value = WHAT_AT_RHO.toFixed(3);
	const zx = planeX(MINI.x, MINI.w, MINI.sigma, RHO.beta);
	const zy = MINI.y + MINI.h * 0.42;
	const gone = progress(f, none, beat * 3, ease.inOut);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Aim the window at the zero</SceneTitle>

			<At x={space.margin} y={186} style={{opacity: progress(f, wOf) * plotOut}}>
				<Tex
					px={size.math}
					tex={'W(y)=\\htmlClass{r}{y^{-\\varrho}}\\,\\htmlClass{b}{\\phi(y)}'}
					light={{r: {ink: 'ember', p: progress(f, minusRho)}, b: {ink: 'verdigris', p: progress(f, bump)}}}
				/>
			</At>
			<At x={space.margin} y={276} style={{opacity: progress(f, what)}}>
				<Tex
					px={size.math * 0.95}
					tex={'\\widehat W(\\varrho)=\\htmlClass{i}{\\int\\phi(y)\\,\\frac{dy}{y}}\\htmlClass{v}{=' + value + '\\ldots>0}'}
					show={{i: progress(f, integral), v: progress(f, positiveNum)}}
				/>
			</At>

			<div style={{opacity: plotOut}}>
				<WindowPlot {...PLOT} p={progress(f, aims)} window={progress(f, minusRho, beat * 3)} bump={progress(f, bump, beat * 3)} area={progress(f, integral, beat * 3)} />
				<At x={PLOT.x} y={PLOT.y + PLOT.h + 54} w={700} style={{opacity: progress(f, minusRho) * (1 - progress(f, integral - beat, beat))}}>
					<MixedLine px={size.small} parts={['real part of the window, for an illustrative ', {tex: `\\varrho=${RHO.beta}+${RHO.gamma}i`}]} />
				</At>
				<Tag kind="schematic" p={progress(f, minusRho) * (1 - progress(f, integral - beat, beat))} style={{position: 'absolute', left: PLOT.x + PLOT.w - 220, top: PLOT.y + PLOT.h + 58}} />
				<At x={PLOT.x} y={PLOT.y + PLOT.h + 54} w={700} style={{opacity: progress(f, integral, beat)}}>
					<MixedLine px={size.small} parts={['shaded: the area under ', {tex: '\\phi(y)/y'}, ', which is ', {tex: '\\widehat W(\\varrho)'}]} />
				</At>
				<Tag kind="computed" p={progress(f, integral, beat)} style={{position: 'absolute', left: PLOT.x + PLOT.w - 220, top: PLOT.y + PLOT.h + 58}} />
			</div>

			{/* contra-4: zero equals a positive number */}
			<At x={space.margin} y={450} style={{opacity: progress(f, second)}}>
				<Tex
					px={size.math * 1.1}
					tex={
						'\\htmlClass{z}{0=}\\underset{\\htmlClass{u1}{\\ember{0}}}{\\htmlClass{l}{L_K^S(\\varrho,\\nu)}}\\,\\underset{\\htmlClass{u2}{\\in\\,\\mathbb C}}{\\mathcal M_W(\\varrho)}=\\widehat W(\\varrho)\\htmlClass{g}{>0}'
					}
					show={{z: progress(f, isZero), u1: progress(f, leftZero), u2: progress(f, finite), g: progress(f, rightPos)}}
					light={{l: {ink: 'ember', p: progress(f, leftZero)}, z: {ink: 'ember', p: progress(f, absurd)}, g: {ink: 'ember', p: progress(f, absurd)}}}
				/>
			</At>
			<At x={space.margin} y={690} style={{opacity: progress(f, absurd)}}>
				<Tex px={size.mathLarge} ink="ember" tex={`0=${value}\\ldots`} />
			</At>

			<HalfPlane
				id="window"
				{...MINI}
				p={progress(f, 4, beat * 2)}
				ticks={TICKS}
				lines={[{sigma: 11 / 12, ink: 'gilt', p: progress(f, beyond, beat * 2)}]}
				hatches={[{from: 11 / 12, ink: 'gilt', p: progress(f, beyond, beat * 2)}]}
				zero={{sigma: RHO.beta, y: 0.42, p: progress(f, zeroAt), gone}}
			/>
			<Callout x={MINI.x - 24} y={zy - 90} to={[zx - 20, zy - 8]} ink="ember" align="right" width={300} p={progress(f, rhoAt) * (1 - gone)}>
				<MixedLine ink="ember" parts={['a supposed zero ', {tex: '\\varrho', ink: 'ember'}]} />
			</Callout>
			<At x={MINI.x - 40} y={MINI.y - 96} w={MINI.w + 40} style={{textAlign: 'right', opacity: progress(f, none + beat * 2)}}>
				<MixedLine ink="paper" parts={['no zero with ', {tex: '\\Re s>\\tfrac{11}{12}', ink: 'paper'}]} />
			</At>
			<Tag kind="claim" p={progress(f, none + beat * 2)} style={{position: 'absolute', left: MINI.x + MINI.w - 300, top: MINI.y + MINI.h + 64}} />

			<SceneLocator />
			<Cite p={progress(f, wOf)}>October manuscript, §3</Cite>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'contra-mellin': ContraMellin,
	'contra-window': ContraWindow,
};
