import React from 'react';
import {useCues} from '../cues';
import {lerp, progress} from '../design/motion';
import {Cite, Tag, Text} from '../design/primitives';
import {At, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {beat, ease, size, space} from '../design/tokens';
import {IndexRow, insertedX} from '../diagrams/IndexRow';
import {MixedLine} from '../diagrams/MixedLine';
import {RootWheel, WheelDot} from '../diagrams/RootWheel';
import {SievePlot} from '../diagrams/SievePlot';
import {UpperHalfSpace} from '../diagrams/UpperHalfSpace';

// Chapter 8: The engine: a cubic theta function. October manuscript, §2.4 and §6.

// --- theta-kubota: cubic Gauss sums as theta coefficients; completing the sum ---

const ROW = {x: 200, y: 640, w: 1400};

export const ThetaKubota: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const gauss = cue('theta-1', 'Cubic Gauss sums are not random');
	const fourier = cue('theta-1', 'Fourier coefficients');
	const cubicTheta = cue('theta-1', 'cubic theta function');
	const automorphic = cue('theta-1', 'automorphic form');
	const space3 = cue('theta-1', 'three-dimensional hyperbolic space');
	const symmetry = cue('theta-1', 'Automorphic forms have symmetry');
	const law = cue('theta-1', 'transformation law');
	const second = start('theta-2');
	const completes = cue('theta-2', 'completes the sum');
	const alongside = cue('theta-2', 'Alongside each square-free index n');
	const cubed = cue('theta-2', 'n times b cubed');
	const contains = cue('theta-2', 'the terms the theta function contains');
	const turns = cue('theta-2', 'The transformation then turns');
	const dual = cue('theta-2', 'short dual sum');
	const first = 1 - progress(f, second - beat, beat * 2);
	const tau = progress(f, cubicTheta);
	const fold = progress(f, turns + beat, dual - turns, ease.inOut);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Kubota’s cubic theta function</SceneTitle>

			<At x={space.margin} y={190} style={{opacity: progress(f, fourier) * lerp(1, 0.55, progress(f, second))}}>
				<Tex
					px={size.math * 0.8}
					tex={
						'\\theta(z,v)=\\frac{3^{5/2}}{2}v^{2/3}+\\sum_{0\\ne\\ell\\in\\lambda^{-3}\\OO}\\htmlClass{tau}{\\tau(\\ell)}\\,vK_{1/3}(4\\pi|\\ell|v)\\exp\\!\\big(2\\pi i(\\ell z+\\overline{\\ell z})\\big)'
					}
					light={{tau: {ink: 'verdigris', p: tau}}}
				/>
			</At>

			{/* theta-1: what the coefficients are, and the space they live on */}
			<div style={{opacity: first}}>
				<At x={space.margin} y={380} w={820}>
					<MixedLine p={progress(f, gauss)} parts={['cubic Gauss sums']} />
					<div style={{display: 'inline-block', marginTop: 8, opacity: progress(f, gauss)}}>
						<Tex px={size.math * 0.8} tex={'\\verd{\\gamma_2(n)}=\\frac{1}{\\sqrt{\\N(n)}}\\sum\\nolimits_{x\\bmod n}\\chi_n(x)^{2}\\,e(x/n)'} />
					</div>
					<MixedLine
						p={tau}
						style={{marginTop: 18}}
						parts={['Patterson: the coefficients ', {tex: '\\tau(\\ell)', ink: 'verdigris'}, ' are these cubic Gauss sums, up to simple factors']}
					/>
				</At>
				<At x={space.margin} y={700} w={820}>
					<div style={{display: 'inline-block', opacity: progress(f, law)}}>
						<Tex px={size.math * 0.9} tex={'\\theta(g\\,w)=\\kappa(g)\\,\\theta(w)'} />
					</div>
					<MixedLine
						px={size.small}
						p={progress(f, law + beat)}
						style={{marginTop: 8}}
						parts={['for ', {tex: 'g\\equiv I\\ (\\mathrm{mod}\\ 3)'}, '; ', {tex: '\\kappa'}, ' is Kubota’s cubic character']}
					/>
				</At>
				<UpperHalfSpace
					x={1390}
					y={790}
					s={128}
					p={progress(f, automorphic, beat * 2)}
					domes={progress(f, space3, beat * 2)}
					point={progress(f, symmetry)}
					move={progress(f, symmetry + beat * 2, law - symmetry, ease.inOut)}
				/>
				<Tag kind="schematic" p={progress(f, space3)} style={{position: 'absolute', left: 1020, top: 900}} />
			</div>

			{/* theta-2: completion, then the long row folds into a short dual row */}
			<At x={space.margin} y={400} style={{opacity: progress(f, contains)}}>
				<Tex
					px={size.math * 0.9}
					tex={'c_\\theta(nb^3)=3^{5/2}\\,|b|\\,\\overline{\\chi_n(\\lambda)^2}\\,\\verd{\\gamma_2(n)}'}
				/>
			</At>
			<IndexRow {...ROW} p={progress(f, completes, beat * 3)} insert={progress(f, cubed, beat * 3, ease.inOut)} fold={fold} shortW={360} />
			<At x={ROW.x} y={ROW.y + 34} w={600} style={{opacity: progress(f, alongside) * (1 - fold)}}>
				<MixedLine ink="verdigris" parts={['squarefree ', {tex: 'n', ink: 'verdigris'}, ', with ', {tex: '\\N(n)\\asymp X', ink: 'verdigris'}]} />
			</At>
			<At x={insertedX(ROW.x, ROW.w, 3) - 100} y={ROW.y - 84} w={200} style={{textAlign: 'center', opacity: progress(f, cubed) * (1 - fold)}}>
				<Tex px={size.label} ink="mist" display={false} tex={'n\\,b^{3}'} />
			</At>
			<At x={ROW.x} y={ROW.y + 34} w={900} style={{opacity: progress(f, dual)}}>
				<MixedLine ink="paper" parts={['a short dual sum over ', {tex: 'm', ink: 'paper'}]} />
			</At>
			<At x={ROW.x + 480} y={ROW.y - 30} w={900} style={{opacity: progress(f, dual)}}>
				<Tex px={size.math * 0.8} display={false} tex={'\\N(nb^3)\\asymp X\\ \\longrightarrow\\ \\N(m)\\ll\\N(h)^2/X'} />
			</At>
			<Tag kind="schematic" p={progress(f, completes) * (1 - progress(f, dual))} style={{position: 'absolute', left: ROW.x + ROW.w - 210, top: ROW.y + 40}} />

			<SceneLocator />
			<Cite p={progress(f, fourier)}>October manuscript, §2.4, §6.1 and §A.2, after Kubota and Patterson</Cite>
		</>
	);
};

// --- theta-quadratic: chi^{-1} chi^{-2} = chi^{-3} = chi^3 takes only the values ±1 ---

const WHEEL = {cx: 1360, cy: 580, r: 250};

// Stage positions of the value zeta^k, in sixths of a turn: k, then -k (the
// Fourier side), -2k (the theta side), -3k (together). Between stages each
// value moves continuously; the first stage swaps conjugate pairs.
const stageAngle = (k: number, s1: number, s2: number, s3: number) => {
	const swap = [0, -2, 2, 0, -2, 2][k]; // k -> -k by the short way round
	return k + swap * s1 + -k * s2 + -k * s3;
};

export const ThetaQuadratic: React.FC = () => {
	const {frame: f, cue} = useCues();
	const phases = cue('theta-3', 'phases change character');
	const fourier = cue('theta-3', 'Fourier side contributes');
	const minusOne = cue('theta-3', 'chi to the minus one');
	const thetaSide = cue('theta-3', 'theta side contributes');
	const minusTwo = cue('theta-3', 'chi to the minus two');
	const together = cue('theta-3', 'Together that is');
	const minusThree = cue('theta-3', 'chi to the minus three');
	const cubed = cue('theta-3', 'equals chi cubed');
	const cube = cue('theta-3', 'the cube of a sixth-order phase');
	const pm = cue('theta-3', 'plus or minus one');
	const quadratic = cue('theta-3', 'It is quadratic');
	const s1 = progress(f, minusOne, beat * 3, ease.inOut);
	const s2 = progress(f, minusTwo, beat * 4, ease.inOut);
	const s3 = progress(f, minusThree, beat * 5, ease.inOut);
	const moving = (a: number, b: number) => (f > a && f < b ? 0.6 : 0);
	const dots: WheelDot[] = [0, 1, 2, 3, 4, 5].map((k) => ({
		angle: stageAngle(k, s1, s2, s3),
		ink: 'verdigris',
		r: 15,
		tail: k === 0 ? 0 : Math.max(moving(minusTwo, minusTwo + beat * 4), moving(minusThree, minusThree + beat * 5)) * (k / 6),
	}));
	const mapTex = s3 > 0 ? (f >= cubed ? '\\zeta\\mapsto\\zeta^{-3}=\\zeta^{3}' : '\\zeta\\mapsto\\zeta^{-3}') : s2 > 0 ? '\\zeta\\mapsto\\zeta^{-2}' : s1 > 0 ? '\\zeta\\mapsto\\zeta^{-1}=\\overline{\\zeta}' : '\\zeta=e^{2\\pi i k/6}';
	const end = progress(f, pm);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The phases turn quadratic</SceneTitle>

			<At x={space.margin} y={206} style={{display: 'grid', gridTemplateColumns: '260px auto', rowGap: 18, alignItems: 'center'}}>
				<Text px={size.label} ink="mist" p={progress(f, fourier)}>
					Fourier side
				</Text>
				<div style={{opacity: progress(f, minusOne)}}>
					<Tex px={size.math} display={false} tex={'\\chi_p^{-1}'} />
				</div>
				<Text px={size.label} ink="mist" p={progress(f, thetaSide)}>
					theta side
				</Text>
				<div style={{opacity: progress(f, minusTwo)}}>
					<Tex px={size.math} display={false} tex={'\\chi_p^{-2}'} />
				</div>
			</At>
			<At x={space.margin} y={466} style={{opacity: progress(f, together)}}>
				<Tex px={size.math} display={false} tex={'\\chi_p^{-1}\\chi_p^{-2}=\\htmlClass{a}{\\chi_p^{-3}}\\htmlClass{b}{=\\chi_p^{3}}'} show={{a: progress(f, minusThree), b: progress(f, cubed)}} />
			</At>
			<At x={space.margin} y={590} style={{opacity: progress(f, cube)}}>
				<Tex px={size.math} display={false} tex={'\\big(e^{2\\pi i k/6}\\big)^{3}=e^{\\pi i k}=\\htmlClass{pm}{(-1)^{k}}'} light={{pm: {ink: 'verdigris', p: end}}} />
			</At>
			<At x={space.margin} y={716} w={860} style={{opacity: progress(f, quadratic)}}>
				<MixedLine
					px={size.body}
					ink="paper"
					parts={[{tex: '\\chi_p^{3}=(\\,\\cdot\\,/p)_2', ink: 'verdigris'}, ', the quadratic residue symbol']}
				/>
			</At>

			<At x={WHEEL.cx - 300} y={WHEEL.cy - WHEEL.r - 96} w={600} style={{textAlign: 'center'}}>
				<MixedLine p={progress(f, phases)} parts={['the values of ', {tex: '\\chi_p'}, ': the six sixth roots of one']} />
			</At>
			<RootWheel cx={WHEEL.cx} cy={WHEEL.cy} r={WHEEL.r} p={progress(f, 6, beat * 2)} roots={0.45} dots={dots} />
			<At x={WHEEL.cx - 300} y={WHEEL.cy + WHEEL.r + 42} w={600} style={{textAlign: 'center', opacity: progress(f, phases)}}>
				<Tex px={size.mathInline} display={false} tex={mapTex} />
			</At>
			<At x={WHEEL.cx + WHEEL.r + 30} y={WHEEL.cy - 30} style={{opacity: end}}>
				<Tex px={size.math} ink="verdigris" display={false} tex={'+1'} />
				<MixedLine px={size.small} parts={[{tex: 'k'}, ' even']} />
			</At>
			<At x={WHEEL.cx - WHEEL.r - 130} y={WHEEL.cy - 30} w={110} style={{opacity: end, textAlign: 'right'}}>
				<Tex px={size.math} ink="verdigris" display={false} tex={'-1'} />
				<MixedLine px={size.small} parts={[{tex: 'k'}, ' odd']} />
			</At>

			<SceneLocator />
			<Cite p={progress(f, together)}>October manuscript, §2.4</Cite>
		</>
	);
};

// --- theta-sieve: the quadratic large sieve keeps the dual energy on budget ---

const SIEVE = {x: 1320, y: 330, w: 420, h: 420};

export const ThetaSieve: React.FC = () => {
	const {frame: f, cue} = useCues();
	const sharpest = cue('theta-4', 'sharpest large sieve');
	const rows = cue('theta-4', 'M rows and L columns');
	const bounds = cue('theta-4', 'bounds the energy by M plus L');
	const tiny = cue('theta-4', 'tiny losses');
	const general = cue('theta-4', 'The general bound for higher-order characters');
	const extra = cue('theta-4', 'an extra term');
	const twoThirds = cue('theta-4', 'M times L to the two thirds');
	const breaks = cue('theta-4', 'break the count');
	const withQ = cue('theta-4', 'With the quadratic sieve');
	const budget = cue('theta-4', 'come in on budget');
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The quadratic large sieve</SceneTitle>

			<At x={space.margin} y={190} style={{opacity: progress(f, 6, beat * 2)}}>
				<Tex
					px={size.math * 0.9}
					tex={'\\sum_{\\htmlClass{m}{m}}\\Big|\\sum_{\\htmlClass{l}{\\ell}}\\beta_\\ell\\,\\chi_m(\\ell)\\Big|^{2}'}
					light={{m: {ink: 'verdigris', p: progress(f, rows)}, l: {ink: 'verdigris', p: progress(f, rows)}}}
				/>
			</At>
			<At x={700} y={226} w={520} style={{opacity: progress(f, rows)}}>
				<MixedLine parts={[{tex: 'M'}, ' rows ', {tex: 'm'}, ', ', {tex: 'L'}, ' columns ', {tex: '\\ell'}]} />
				<MixedLine px={size.small} parts={['the energy of a family of character sums']} />
			</At>
			<At x={space.margin} y={380} style={{display: 'grid', gridTemplateColumns: '230px auto', rowGap: 34, alignItems: 'center'}}>
				<Text px={size.label} ink="mist" p={progress(f, sharpest)}>
					quadratic
				</Text>
				<div style={{opacity: progress(f, bounds)}}>
					<Tex
						px={size.math * 0.72}
						display={false}
						tex={'\\ll\\big(\\htmlClass{ml}{M+L}\\big)\\htmlClass{eps}{(ML)^{\\varepsilon}}\\sum|\\beta_\\ell|^2'}
						light={{eps: {ink: 'mist', p: progress(f, tiny)}}}
					/>
				</div>
				<Text px={size.label} ink="mist" p={progress(f, general)}>
					higher order
				</Text>
				<div style={{opacity: progress(f, general)}}>
					<Tex
						px={size.math * 0.72}
						display={false}
						tex={'\\ll\\big(M+L\\htmlClass{ex}{+(ML)^{2/3}}\\big)(ML)^{\\varepsilon}\\sum|\\beta_\\ell|^2'}
						show={{ex: progress(f, extra)}}
						light={{ex: {ink: 'ember', p: progress(f, twoThirds)}}}
					/>
				</div>
			</At>
			<At x={space.margin} y={566} style={{opacity: progress(f, withQ)}}>
				<Tex px={size.math * 0.9} tex={'\\sum\\nolimits_{0<\\N(h)\\ll\\cH}|T_h(X)|^2\\ll(\\cH X)^{\\varepsilon}\\Big(\\cH+\\frac{\\cH^{2}}{X}\\Big)'} />
			</At>
			<At x={space.margin} y={736} w={1100} style={{opacity: progress(f, budget)}}>
				<MixedLine
					ink="paper"
					parts={[
						'on budget: at ',
						{tex: 'X=D', ink: 'paper'},
						' and ',
						{tex: '\\cH\\le D', ink: 'paper'},
						', heuristically ',
						{tex: '\\textstyle\\sum_h|B_h(D)|^2\\approx D\\sum_h|T_h(D)|^2\\precsim D^{2}', ink: 'paper'},
					]}
				/>
			</At>

			<SievePlot
				{...SIEVE}
				p={progress(f, rows)}
				quad={progress(f, bounds, beat * 3, ease.inOut)}
				general={progress(f, twoThirds, beat * 3, ease.inOut)}
				gap={progress(f, breaks, beat * 2)}
			/>
			<At x={SIEVE.x} y={SIEVE.y - 60} w={460} style={{opacity: progress(f, breaks)}}>
				<MixedLine ink="ember" px={size.small} parts={['the extra term wins once ', {tex: 'M>8', ink: 'ember'}]} />
			</At>
			<Tag kind="computed" p={progress(f, rows)} style={{position: 'absolute', left: SIEVE.x, top: SIEVE.y + SIEVE.h + 100}} />

			<SceneLocator />
			<Cite p={progress(f, bounds)}>October manuscript, §2.4, Goldmakher–Louvel quadratic large sieve</Cite>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'theta-kubota': ThetaKubota,
	'theta-quadratic': ThetaQuadratic,
	'theta-sieve': ThetaSieve,
};
