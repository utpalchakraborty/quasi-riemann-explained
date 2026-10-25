import type React from 'react';
import {useCues} from '../cues';
import {progress, window} from '../design/motion';
import {Cite, Tag} from '../design/primitives';
import {At, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, ledger, size, space, stroke} from '../design/tokens';
import {FAMILY, FamilyField} from '../diagrams/FamilyField';
import {Ledger} from '../diagrams/Ledger';
import {MixedLine} from '../diagrams/MixedLine';
import {PairGrid, PhaseTicks} from '../diagrams/DualPairs';
import {PL_ENERGY, PlancherelRows, plancherelHeight} from '../diagrams/DualPlancherel';
import {dualHeight, ReflectRect} from '../diagrams/DualRect';
import {CHECKS, GAUSS_MAX_ERROR, ID13, QUAD13, TURN13, W13, WalkPlane, walkEnd} from '../diagrams/DualWalks';
import {carg, cis, type C} from '../diagrams/DualArith';
import {PoissonDisks} from '../diagrams/PoissonDisks';

// Chapter 5: Proving it, I: the dual side. October manuscript, §2.3 (Step 3:
// Poisson summation, equations (2.6)–(2.9)) and Lemma 4.1; Plancherel is classical.

const BUDGET = '\\sum_{0<\\N(u)\\le H}|A_u(D)|^2\\ll D^{2+\\vartheta+\\varepsilon}';

// --- dual-method: transform the energy instead of computing it ---

const PL = {x: 170, slot: 74, unit: 56, top: 446, bottom: 712};
const PCOL = {x1: 1250, x2: 1420, w: 90, base: 712};

export const DualMethod: React.FC = () => {
	const {frame: f, cue} = useCues();
	const hard = cue('dual-1', 'Now the hard part');
	const nobody = cue('dual-1', 'Nobody can compute');
	const transforms = cue('dual-1', 'It transforms the energy instead');
	const fourier = cue('dual-1', 'A Fourier transform');
	const keeps = cue('dual-1', 'keeps the total energy');
	const scrambles = cue('dual-1', 'scrambles everything else');
	const planch = cue('dual-1', 'Plancherel’s theorem');
	const energies = cue('dual-1', 'with energies rather than');
	const level = PCOL.base - plancherelHeight(PL.unit, PCOL.w);
	const top = 1 - progress(f, transforms - beat, beat * 2);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Transform, do not compute</SceneTitle>
			<div style={{opacity: top}}>
				<At x={space.margin} y={200} w={1600}>
					<MixedLine p={progress(f, hard)} parts={['to be earned: ', {tex: BUDGET, ink: 'cobalt'}]} />
					<MixedLine
						p={progress(f, nobody)}
						px={size.small}
						parts={['about ', {tex: 'H=D^{1+\\vartheta}'}, ' sums of about ', {tex: 'D'}, ' terms each, for every large ', {tex: 'D'}, ': the proof computes none of them']}
						style={{marginTop: 10}}
					/>
				</At>
				<FamilyField cx={1450} cy={600} unit={3.5} reveal={progress(f, nobody, beat * 4, ease.inOut)} />
				<At x={1200} y={850} w={500} style={{textAlign: 'center'}}>
					<MixedLine
						p={progress(f, nobody + beat * 2)}
						px={size.small}
						parts={['computed here at ', {tex: `D=${FAMILY.D}`}, ': ', {tex: FAMILY.rows.toLocaleString('en-US').replace(',', '{,}')}, ' rows. The proof needs every large ', {tex: 'D'}, '.']}
					/>
				</At>
				<Tag kind="computed" p={progress(f, nobody + beat * 2)} style={{position: 'absolute', left: 1160, top: 330}} />
			</div>
			<At x={PL.x - 10} y={PL.top - 128} w={1000}>
				<MixedLine p={progress(f, transforms)} parts={['a short vector ', {tex: 'x'}, ': the Möbius values ', {tex: 'x_n=\\mu(n)'}, ', ', {tex: 'n=1,\\dots,12'}]} />
			</At>
			<At x={PL.x - 10} y={PL.bottom - 128} w={1060}>
				<MixedLine p={progress(f, fourier)} parts={['its Fourier transform ', {tex: '\\hat x_k=\\tfrac{1}{\\sqrt{12}}\\sum_{n}x_n\\,e^{-2\\pi i nk/12}'}]} />
			</At>
			<PlancherelRows
				{...PL}
				col={PCOL}
				values={progress(f, transforms, beat * 3, ease.inOut)}
				signs={progress(f, transforms + beat * 2)}
				transform={progress(f, fourier, beat * 3, ease.inOut)}
				pour={progress(f, keeps, beat * 3, ease.inOut)}
				level={progress(f, keeps + beat * 3)}
			/>
			<At x={PL.x - 10} y={PL.bottom + 16} w={900}>
				<MixedLine p={progress(f, scrambles)} px={size.small} parts={['every size changes, and every sign becomes a phase']} />
			</At>
			{[
				{x: PCOL.x1, label: 'values'},
				{x: PCOL.x2, label: 'transform'},
			].map((c) => (
				<At key={c.label} x={c.x - 40} y={PCOL.base + 16} w={PCOL.w + 80} style={{textAlign: 'center'}}>
					<MixedLine p={progress(f, keeps)} px={size.small} parts={[c.label]} />
				</At>
			))}
			<At x={PCOL.x1 - 14} y={level - 52} w={420}>
				<MixedLine p={progress(f, keeps + beat * 3)} px={size.small} ink="ink" parts={['total area ', {tex: `${PL_ENERGY}`}, ' in both']} />
			</At>
			<Tag kind="computed" p={progress(f, transforms)} style={{position: 'absolute', left: 940, top: PL.bottom + 20}} />

			<At x={space.margin} y={812} style={{opacity: progress(f, planch)}}>
				<Tex px={size.math * 0.8} tex={'\\sum_{k}|\\hat x_k|^{2}=\\sum_{n}|x_n|^{2}'} />
			</At>
			<At x={640} y={830} w={1000}>
				<MixedLine p={progress(f, energies)} parts={['so the proof works with energies, not single sums']} />
			</At>

			<SceneLocator />
			<Cite p={progress(f, planch)}>Classical: Plancherel’s theorem</Cite>
		</>
	);
};

// --- dual-poisson: expand the squares, then Poisson summation in u ---

const LEFT = {cx: 830, cy: 618, unit: 23, radius: 9.2};
const RIGHT_D = {cx: 1530, cy: 618, unit: 23, radius: 3.1};
const GRID = {x: 186, y: 470, cell: 34, k: 8};
const LIT = {i: 2, j: 5};
const WAVES: [number, number][] = [
	[1, 0],
	[1, 2],
	[-2, -1],
];
const RR = {x: 500, y: 860, w: 390, h: 520};

export const DualPoisson: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const expand = cue('dual-2', 'Expand the squares');
	const cross = cue('dual-2', 'Each cross term');
	const pairs = cue('dual-2', 'pairs two columns');
	const nm = cue('dual-2', 'n and m');
	const phases = cue('dual-2', 'the product of their phases');
	const rowsU = cue('dual-2', 'all the rows u in a disk');
	const poisson = cue('dual-2', 'Poisson summation rewrites');
	const positions = cue('dual-2', 'sum over positions');
	const freqs = cue('dual-2', 'sum over frequencies');
	const becomes = cue('dual-2', 'The sum over u becomes');
	const newVar = cue('dual-2', 'a new variable');
	const dualRow = cue('dual-2', 'the dual row');

	const second = start('dual-3');
	const flips = cue('dual-3', 'the row range flips');
	const hRows = cue('dual-3', 'H rows become');
	const d2h = cue('dual-3', 'D squared over H');
	const script = cue('dual-3', 'Call that number script H');
	const withH = cue('dual-3', 'With H equal to');
	const oneMinus = cue('dual-3', 'D to the one minus theta');
	const multiply = cue('dual-3', 'always multiply to D squared');
	const fewer = cue('dual-3', 'fewer rows than columns');

	const phaseA = 1 - progress(f, second - beat, beat * 2);
	const span = (becomes - positions) / WAVES.length;
	const idx = Math.max(0, Math.min(WAVES.length - 1, Math.floor((f - positions) / span)));
	const waveP = f >= positions && f < becomes + beat * 2 ? window(f, positions, becomes) : 0;
	const collapse = progress(f, becomes, beat * 4, ease.inOut);
	const k = progress(f, flips, hRows - flips, ease.inOut);
	const hh = dualHeight(RR.w, RR.h, k);
	const [cellX, cellY] = [GRID.x + (LIT.j + 0.5) * GRID.cell, GRID.y + (LIT.i + 0.5) * GRID.cell];
	const vir = (p: number) => ({ink: 'viridian' as const, p});
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Positions become frequencies</SceneTitle>

			<div style={{opacity: phaseA}}>
				<At x={space.margin} y={196} style={{opacity: progress(f, expand)}}>
					<Tex
						px={size.math * 0.78}
						tex={
							'\\sum\\nolimits_{0<\\N(u)\\le H}|A_u(D)|^2\\htmlClass{r}{{}=\\sum\\nolimits_{\\htmlClass{n}{n},\\,\\htmlClass{m}{m}}a_n\\overline{a_m}\\htmlClass{s}{\\sum\\nolimits_{0<\\N(\\htmlClass{u}{u})\\le H}\\chi_n(u)\\,\\overline{\\chi_m(u)}}}'
						}
						show={{r: progress(f, cross)}}
						light={{n: vir(progress(f, nm)), m: vir(progress(f, nm)), s: vir(progress(f, phases)), u: vir(progress(f, rowsU))}}
					/>
				</At>
				<At x={space.margin} y={292} w={760}>
					<MixedLine p={progress(f, cross)} px={size.small} parts={['with ', {tex: 'a_n=\\mu(n)\\nu(n)W(\\N(n)/D)'}, ', the column weights']} />
				</At>

				{/* the pairs of columns */}
				<PairGrid {...GRID} p={progress(f, cross, beat * 2)} diag={progress(f, pairs)} lit={{...LIT, p: progress(f, nm)}} />
				<At x={GRID.x} y={GRID.y - 46} w={GRID.k * GRID.cell} style={{textAlign: 'center'}}>
					<MixedLine p={progress(f, pairs)} parts={['columns ', {tex: 'n'}]} />
				</At>
				<At x={GRID.x - 56} y={GRID.y + (GRID.k * GRID.cell) / 2 - 22} w={44} style={{textAlign: 'right'}}>
					<MixedLine p={progress(f, pairs)} parts={[{tex: 'm'}]} />
				</At>
				<At x={GRID.x - 20} y={GRID.y + GRID.k * GRID.cell + 14} w={360}>
					<MixedLine p={progress(f, pairs)} px={size.small} parts={['one cross term per pair; shaded: ', {tex: 'n=m'}]} />
				</At>
				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: progress(f, phases) * (1 - progress(f, poisson))}}>
					<line x1={cellX} y1={cellY} x2={LEFT.cx - LEFT.unit * (LEFT.radius + 0.6)} y2={LEFT.cy} stroke={alpha('pencil', 0.8)} strokeWidth={stroke.hair} />
					<circle cx={cellX} cy={cellY} r={4} fill={color.viridian} />
				</svg>

				{/* the rows u: their phases, then the waves of Poisson summation */}
				<PoissonDisks
					left={LEFT}
					right={RIGHT_D}
					leftP={progress(f, phases, beat * 2)}
					rightP={progress(f, freqs)}
					wave={waveP > 0 ? {h: WAVES[idx], p: waveP} : null}
					litH={waveP > 0.5 ? WAVES[idx] : null}
					collapse={collapse}
					arrow={progress(f, poisson)}
				/>
				<PhaseTicks {...LEFT} p={progress(f, phases, beat * 4, ease.inOut)} opacity={1 - progress(f, poisson, beat * 2)} />
				<At x={LEFT.cx - 300} y={LEFT.cy - LEFT.unit * (LEFT.radius + 0.6) - 50} w={600} style={{textAlign: 'center'}}>
					<MixedLine p={progress(f, rowsU)} px={size.small} parts={['rows ', {tex: 'u'}, ' in a disk; ticks: ', {tex: '\\chi_n(u)\\overline{\\chi_m(u)}', ink: 'viridian'}]} />
				</At>
				<At x={LEFT.cx - 300} y={LEFT.cy + LEFT.unit * (LEFT.radius + 0.6) + 12} w={600} style={{textAlign: 'center'}}>
					<MixedLine p={progress(f, positions)} parts={['positions ', {tex: 'u'}]} />
				</At>
				<At x={RIGHT_D.cx - 200} y={RIGHT_D.cy - RIGHT_D.unit * 4.4 - 46} w={400} style={{textAlign: 'center'}}>
					<MixedLine p={progress(f, freqs)} parts={['frequencies ', {tex: 'h'}]} />
				</At>
				<At x={RIGHT_D.cx - 220} y={RIGHT_D.cy + RIGHT_D.unit * 4.4} w={440} style={{textAlign: 'center'}}>
					<MixedLine p={progress(f, dualRow)} ink="ink" parts={[{tex: 'h', ink: 'ink'}, ': the dual row']} />
				</At>
				<At x={1100} y={836} style={{opacity: progress(f, becomes)}}>
					<Tex
						px={size.math * 0.7}
						tex={'\\sum_{u}\\chi_n(u)\\overline{\\chi_m(u)}\\,(\\cdots)\\ \\htmlClass{h}{\\longrightarrow\\ \\sum_{h}(\\cdots)}'}
						show={{h: progress(f, newVar)}}
					/>
				</At>
				<At x={(LEFT.cx + RIGHT_D.cx) / 2 - 150} y={LEFT.cy - 66} w={300} style={{textAlign: 'center', opacity: progress(f, poisson) * (1 - collapse)}}>
					<MixedLine px={size.small} parts={['Poisson summation in ', {tex: 'u'}]} />
				</At>
				<Tag kind="computed" p={progress(f, phases) * (1 - progress(f, poisson))} style={{position: 'absolute', left: LEFT.cx + 190, top: LEFT.cy + 200}} />
				<Tag kind="schematic" p={progress(f, poisson)} style={{position: 'absolute', left: RIGHT_D.cx + 110, top: RIGHT_D.cy - 16}} />
			</div>

			{/* dual-3: the row range flips through the column scale */}
			<div style={{opacity: progress(f, second - beat, beat * 2)}}>
				<ReflectRect {...RR} k={k} p={progress(f, second, beat * 2)} ghost={progress(f, hRows)} mirror={progress(f, multiply)} brackets={progress(f, second + beat)} />
				<At x={RR.x - 190} y={RR.y - hh / 2 - 30} w={140} style={{textAlign: 'right'}}>
					<Tex px={size.math} display={false} tex={f < d2h ? 'H' : f < script ? '\\tfrac{D^{2}}{H}' : '\\cH'} />
				</At>
				<At x={RR.x + RR.w / 2 - 60} y={RR.y + 40} w={120} style={{textAlign: 'center'}}>
					<Tex px={size.math * 0.9} display={false} tex={'D'} />
				</At>
				<At x={RR.x - 210} y={RR.y - hh / 2 + 36} w={160} style={{textAlign: 'right'}}>
					<MixedLine p={progress(f, fewer)} px={size.small} parts={['rows']} />
				</At>
				<At x={RR.x + RR.w + 24} y={RR.y - 40} w={200}>
					<MixedLine p={progress(f, fewer)} px={size.small} parts={['columns ', {tex: 'D'}]} />
				</At>
				<At x={RR.x + RR.w + 24} y={RR.y - RR.w - 20} w={160}>
					<MixedLine p={progress(f, multiply)} px={size.small} parts={[{tex: 'D'}, ' by ', {tex: 'D'}]} />
				</At>

				<At x={1100} y={280} style={{opacity: progress(f, hRows)}}>
					<Tex px={size.math * 0.8} tex={'H\\ \\text{rows}\\ \\longrightarrow\\ \\htmlClass{d}{\\frac{D^{2}}{H}}\\ \\text{dual rows}'} show={{d: progress(f, d2h)}} />
				</At>
				<At x={1100} y={412} style={{opacity: progress(f, script)}}>
					<Tex px={size.math * 0.8} tex={'\\cH\\asymp\\frac{D^{2}}{H}'} />
				</At>
				<At x={1100} y={546} style={{opacity: progress(f, withH)}}>
					<Tex px={size.math * 0.8} tex={'H=D^{1+\\vartheta}\\ \\Longrightarrow\\ \\htmlClass{r}{\\cH\\asymp D^{1-\\vartheta}}'} show={{r: progress(f, oneMinus)}} />
				</At>
				<At x={1100} y={652} style={{opacity: progress(f, multiply)}}>
					<Tex px={size.math * 0.8} tex={'H\\cdot\\cH\\asymp D^{2}'} />
				</At>
				<At x={1100} y={754} w={692}>
					<MixedLine p={progress(f, fewer)} ink="ink" parts={['now fewer rows than columns: ', {tex: '\\cH=D^{1-\\vartheta}<D', ink: 'ink'}]} />
				</At>
				<Tag kind="schematic" p={progress(f, second)} style={{position: 'absolute', left: 1100, top: 820}} />
			</div>

			<SceneLocator />
			<Cite p={progress(f, poisson)}>October manuscript, §2.3</Cite>
		</>
	);
};

// --- dual-gauss: Gauss sums, the classical identity, its sextic relative ---

const PLANE = {cx: 1470, cy: 600, R: 200};

export const DualGauss: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const transform = cue('dual-4', 'The Fourier transform of a sextic phase');
	const gaussSum = cue('dual-4', 'is a Gauss sum');
	const roots = cue('dual-4', 'roots of one');
	const waves = cue('dual-4', 'weighted by waves');
	const added = cue('dual-4', 'added up');
	const ordinary = cue('dual-4', 'For ordinary integers');
	const square = cue('dual-4', 'the square of a quadratic Gauss sum');
	const sign = cue('dual-4', 'just a sign');
	const relative = cue('dual-4', 'a sextic relative');

	const says = start('dual-5');
	const mobius = cue('dual-5', 'the Möbius value times a sextic Gauss sum');
	const cubic = cue('dual-5', 'equals a cubic Gauss sum');
	const size1 = cue('dual-5', 'up to factors of size one');
	const absorbed = cue('dual-5', 'The Möbius function has been absorbed');
	const checked = cue('dual-5', 'Checked here at twenty-two primes');
	const agree = cue('dual-5', 'agree to fourteen decimal places');
	const left = cue('dual-5', 'What is left is a new family');
	const coeffs = cue('dual-5', 'cubic Gauss sums as coefficients');
	const twisted = cue('dual-5', 'twisted by phases in h');
	const fixed = cue('dual-5', 'up to fixed twists');

	const vir = (p: number) => ({ink: 'viridian' as const, p});
	const quadOn = progress(f, ordinary, beat * 2) * (1 - progress(f, relative, beat * 2));
	const g1Dim = 1 - 0.75 * quadOn;
	const ringOn = progress(f, checked, beat * 2);
	const dim = 1 - 0.7 * ringOn;
	const gm1End = walkEnd(W13.gm1);
	const g2End = walkEnd(W13.g2);
	const turn = progress(f, size1, beat * 3, ease.inOut);
	const moving: C = cis(carg(g2End) + TURN13 * turn);
	const nChecks = CHECKS.length * progress(f, checked, agree - checked, ease.inOut);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Gauss sums</SceneTitle>

			{/* the formulas, left */}
			<At x={space.margin} y={190} style={{opacity: progress(f, transform)}}>
				<Tex
					px={size.math * 0.8}
					tex={'\\gamma_j(n)=\\frac{1}{\\sqrt{\\N(n)}}\\htmlClass{a}{\\sum\\nolimits_{x\\bmod n}}\\htmlClass{c}{\\chi_n(x)^{j}}\\,\\htmlClass{w}{e(x/n)}'}
					light={{c: vir(progress(f, roots)), w: vir(progress(f, waves)), a: vir(progress(f, added))}}
				/>
			</At>
			<At x={space.margin} y={312} style={{opacity: progress(f, ordinary) * (1 - 0.6 * progress(f, says))}}>
				<Tex
					px={size.math * 0.72}
					tex={'\\htmlClass{s}{\\Big(\\frac{-1}{m}\\Big)}=\\htmlClass{q}{\\Big(\\frac{1}{\\sqrt m}\\sum\\nolimits_{x\\bmod m}\\Big(\\frac{x}{m}\\Big)e^{2\\pi ix/m}\\Big)^{2}}'}
					light={{s: vir(progress(f, sign)), q: vir(progress(f, square) * 0.6)}}
				/>
			</At>
			<At x={space.margin} y={436} style={{opacity: progress(f, relative)}}>
				<Tex
					px={size.math * 0.85}
					tex={'\\htmlClass{mu}{\\mu(n)}\\,\\htmlClass{gm}{\\gamma_{-1}(n)}=\\htmlClass{fa}{\\chi_n(-1)\\,G(n)^{-1}\\,\\overline{\\alpha(n)}}\\,\\htmlClass{g2}{\\gamma_2(n)}'}
					light={{mu: vir(progress(f, mobius)), gm: vir(progress(f, mobius)), g2: vir(progress(f, cubic)), fa: {ink: 'pencil', p: progress(f, size1)}}}
				/>
			</At>
			<At x={space.margin} y={528} w={1000}>
				<MixedLine p={progress(f, size1)} px={size.small} parts={[{tex: '\\alpha(n)=n/|n|'}, ', ', {tex: 'G(n)=\\overline{\\chi_n(4)}\\gamma_3(n)'}, ': all of size one']} />
				<MixedLine p={progress(f, absorbed)} px={size.small} ink="ink" parts={['no Möbius function on the right: it has been absorbed']} />
			</At>
			<At x={space.margin} y={628} w={1020}>
				<MixedLine
					p={progress(f, checked)}
					px={size.small}
					parts={['checked at 22 primary primes of norm 7 to 97: the sides differ by at most ', {tex: `${(GAUSS_MAX_ERROR / 1e-15).toFixed(1)}\\times10^{-15}`}]}
				/>
			</At>
			<At x={space.margin} y={700} style={{opacity: progress(f, left)}}>
				<Tex
					px={size.math * 0.75}
					tex={'B_h(X)=\\sum_{\\substack{n\\equiv1\\ (3)\\\\ n\\ \\text{squarefree}}}\\overline{\\alpha(n)}\\,\\htmlClass{g2}{\\gamma_2(n)}\\,\\xi(n)\\,\\htmlClass{ch}{\\chi_n(h)}\\,U\\big(\\N(n)/X\\big)'}
					light={{g2: vir(progress(f, coeffs)), ch: vir(progress(f, twisted))}}
				/>
			</At>
			<At x={space.margin} y={860} w={1040}>
				<MixedLine p={progress(f, fixed)} px={size.small} parts={['up to fixed twists that the outline suppresses: ', {tex: '\\xi'}, ' is ', {tex: '\\nu'}, ' or ', {tex: '\\overline{\\nu}'}, ' times a ray class character']} />
			</At>

			{/* the walks, right */}
			<WalkPlane
				{...PLANE}
				axes={progress(f, transform, beat * 2)}
				circle={progress(f, added)}
				walks={[
					{pts: W13.gm1, p: progress(f, roots, added + beat - roots, ease.inOut), opacity: g1Dim * dim},
					{pts: QUAD13, p: progress(f, ordinary, square - ordinary + beat, ease.inOut), opacity: quadOn * dim, width: 3},
					{pts: W13.g2, p: progress(f, cubic, beat * 3, ease.inOut), opacity: dim, dash: '9 6'},
				]}
				segments={[{a: gm1End, b: ID13.lhs, p: progress(f, mobius, beat * 2) * dim}]}
				arc={{from: carg(g2End), to: carg(g2End) + TURN13, p: turn * (1 - ringOn)}}
				marks={[
					{z: gm1End, p: progress(f, added) * g1Dim * dim},
					{z: [1, 0], p: window(f, sign, relative), r: 9},
					{z: ID13.lhs, p: progress(f, mobius + beat * 2) * (1 - ringOn), kind: 'hollow', r: 14},
					{z: moving, p: progress(f, cubic + beat * 3) * (1 - ringOn), r: 7},
					...CHECKS.flatMap((c, i) => {
						const p = Math.max(0, Math.min(1, nChecks - i));
						return [
							{z: c.lhs, p, kind: 'hollow' as const, r: 12},
							{z: c.rhs, p, r: 5},
						];
					}),
				]}
			/>
			<At x={1230} y={196} w={562}>
				<MixedLine p={progress(f, gaussSum)} px={size.small} ink="viridian" parts={[{tex: '\\gamma_{-1}(\\pi)', ink: 'viridian'}, ', for the prime ', {tex: '\\pi=1-3\\omega', ink: 'viridian'}, ' of norm 13']} />
			</At>
			{[
				{p: quadOn, ink: 'pencil' as const, parts: ['the quadratic sum for ', {tex: 'm=13'}, ': its square is ', {tex: '(\\tfrac{-1}{13})=+1'}]},
				{p: progress(f, cubic) * (1 - ringOn), ink: 'viridian' as const, parts: ['dashed: ', {tex: '\\gamma_2(\\pi)', ink: 'viridian' as const}, ', cubic; ring: ', {tex: '\\mu(\\pi)\\gamma_{-1}(\\pi)', ink: 'viridian' as const}]},
				{p: ringOn, ink: 'viridian' as const, parts: ['both sides at 22 primes: each dot sits in its ring']},
			].map((l, i) => (
				<At key={i} x={1230} y={238} w={562} style={{opacity: l.p}}>
					<MixedLine px={size.small} ink={l.ink} parts={l.parts} />
				</At>
			))}
			<Tag kind="computed" p={progress(f, gaussSum)} style={{position: 'absolute', left: 1230, top: 890}} />

			<SceneLocator />
			<Cite p={progress(f, transform)}>October manuscript, §2.3 and Lemma 4.1, after Hasse and Heath-Brown</Cite>
		</>
	);
};

// --- dual-target: what the budget now asks for ---

const TR = {x: 1330, y: 860, w: 300, h: 420};

export const DualTarget: React.FC = () => {
	const {frame: f, cue} = useCues();
	const schem = cue('dual-6', 'Schematically');
	const dh = cue('dual-6', 'at most D times H');
	const hOverD = cue('dual-6', 'plus H over D');
	const newFam = cue('dual-6', 'the energy of the new family');
	const dualRows = cue('dual-6', 'over the dual rows');
	const asks = cue('dual-6', 'So the budget now asks for this');
	const energyB = cue('dual-6', 'the energy of B');
	const d2 = cue('dual-6', 'at most about D squared');
	const notShrink = cue('dual-6', 'Poisson summation does not shrink the energy');
	const moves = cue('dual-6', 'It moves it to a side');
	const short = cue('dual-6', 'the rows are short');
	const gauss = cue('dual-6', 'the coefficients are Gauss sums');
	const theory = cue('dual-6', 'which have a theory');
	const k = progress(f, dualRows, beat * 4, ease.inOut);
	const hh = dualHeight(TR.w, TR.h, k);
	const dense = progress(f, moves, beat * 3);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>What the budget now asks</SceneTitle>
			<At x={space.margin} y={196} style={{opacity: progress(f, schem)}}>
				<Tex
					px={size.math * 0.8}
					tex={'\\sum\\nolimits_{0<\\N(u)\\le H}|A_u(D)|^2\\;\\lesssim\\;\\htmlClass{dh}{DH}\\htmlClass{r}{{}+\\frac{H}{D}\\htmlClass{b}{\\sum\\nolimits_{0<\\N(h)\\ll\\cH}|B_h(D)|^2}}'}
					show={{dh: progress(f, dh), r: progress(f, hOverD)}}
					light={{b: {ink: 'viridian', p: progress(f, newFam) * 0.5}}}
				/>
			</At>
			<At x={space.margin} y={318} w={1100}>
				<MixedLine p={progress(f, dh)} px={size.small} parts={['schematically: after the diagonal and the smooth weights, up to fixed factors and ', {tex: 'D^{\\varepsilon}'}]} />
			</At>
			<Ledger
				x={space.margin + 40}
				y={404}
				w={1000}
				amountW={420}
				rowH={ledger.row * 1.35}
				heading={{label: 'The budget, on the dual side', amount: 'size', p: progress(f, dh)}}
				rules={progress(f, dh)}
				rows={[
					{label: ['the diagonal and zero frequency'], amount: 'DH', kind: 'entry', p: progress(f, dh), light: window(f, dh, hOverD)},
					{label: [{tex: 'H/D'}, ' times the energy of ', {tex: 'B'}], amount: '\\tfrac{H}{D}\\sum_h|B_h(D)|^2', kind: 'entry', p: progress(f, hOverD), light: window(f, hOverD, asks)},
					{label: ['now asked for, over ', {tex: '\\N(h)\\ll\\cH'}], amount: '\\sum_h|B_h(D)|^2\\lesssim D^{2}', kind: 'budget', p: progress(f, asks), light: progress(f, asks)},
					{label: ['then the original energy'], amount: '\\lesssim DH+\\tfrac{H}{D}\\,D^{2}\\asymp DH', kind: 'total', p: progress(f, d2 + beat), light: window(f, d2 + beat, notShrink)},
				]}
			/>
			<At x={space.margin + 40} y={404 + ledger.row * 1.35 * 5 + 10} w={1000}>
				<MixedLine p={progress(f, notShrink)} ink="ink" parts={['the energy is moved, not shrunk']} />
			</At>
			<Tag kind="schematic" p={progress(f, schem)} style={{position: 'absolute', left: space.margin + 40, top: 900}} />

			{/* the rectangle: tall rows u, then short rows h; the same energy, denser */}
			<ReflectRect
				{...TR}
				k={k}
				p={progress(f, schem, beat * 2)}
				ghost={progress(f, dualRows) * (1 - dense)}
				hatch={{density: dense > 0.5 ? 'dense' : 'light', p: 1}}
				brackets={progress(f, schem + beat)}
				rows={7}
			/>
			<At x={TR.x - 150} y={TR.y - hh / 2 - 30} w={100} style={{textAlign: 'right'}}>
				<Tex px={size.math * 0.9} display={false} tex={k < 0.5 ? 'H' : '\\cH'} />
			</At>
			<At x={TR.x - 230} y={TR.y - hh / 2 + 30} w={180} style={{textAlign: 'right'}}>
				<MixedLine p={progress(f, short)} px={size.small} ink="ink" parts={['short rows']} />
			</At>
			<At x={TR.x + TR.w / 2 - 50} y={TR.y + 36} w={100} style={{textAlign: 'center'}}>
				<Tex px={size.label} display={false} tex={'D'} />
			</At>
			<At x={1210} y={TR.y - hh - 92} w={582}>
				<MixedLine p={progress(f, gauss)} px={size.small} ink="viridian" parts={['coefficients: Gauss sums ', {tex: '\\overline{\\alpha(n)}\\gamma_2(n)', ink: 'viridian'}]} />
				<MixedLine p={progress(f, theory)} px={size.small} parts={['with a theory: the cubic theta function, chapter 6']} />
			</At>
			<At x={TR.x} y={TR.y - TR.h - 50} w={460}>
				<MixedLine p={progress(f, energyB) * (1 - progress(f, moves))} px={size.small} parts={['rows ', {tex: 'u'}, ' become ', {tex: '\\cH'}, ' rows ', {tex: 'h'}]} />
			</At>

			<SceneLocator />
			<Cite p={progress(f, schem)}>October manuscript, §2.3, equations (2.8) and (2.9)</Cite>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'dual-method': DualMethod,
	'dual-poisson': DualPoisson,
	'dual-gauss': DualGauss,
	'dual-target': DualTarget,
};
