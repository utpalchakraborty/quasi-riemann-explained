import React from 'react';
import {useCues} from '../cues';
import {progress, window} from '../design/motion';
import {Cite, Tag} from '../design/primitives';
import {At, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {beat, ease, size, space} from '../design/tokens';
import {CUBIC_ARG, GaussWalk} from '../diagrams/GaussWalk';
import {MixedLine} from '../diagrams/MixedLine';
import {PoissonDisks} from '../diagrams/PoissonDisks';

// Chapter 7: The engine: Poisson and Gauss. October manuscript, §2.3.

// --- poisson-swap: a long sum over u becomes a short sum over h ---

const LEFT = {cx: 520, cy: 640, unit: 24, radius: 9.2};
const RIGHT = {cx: 1420, cy: 640, unit: 24, radius: 3.1};
// Frequencies shown as plane waves across the u disk, as h = a + b·omega.
const WAVES: [number, number][] = [
	[1, 0],
	[1, 2],
	[-2, -1],
];

export const PoissonSwap: React.FC = () => {
	const {frame: f, cue} = useCues();
	const budget = cue('poisson-1', 'energy budget');
	const engine = cue('poisson-1', 'the engine that proves it');
	const expand = cue('poisson-1', 'Expand the squares');
	const apply = cue('poisson-1', 'apply Poisson summation');
	const rowU = cue('poisson-1', 'row variable u');
	const trades = cue('poisson-1', 'trades a sum');
	const positions = cue('poisson-1', 'sum over positions');
	const frequencies = cue('poisson-1', 'sum over frequencies');
	const longSum = cue('poisson-1', 'A long sum over u');
	const short = cue('poisson-1', 'a short sum over');
	const newH = cue('poisson-1', 'a new variable');
	const terms = cue('poisson-1', 'D squared over H');
	const theta = cue('poisson-1', 'D to the one minus theta');

	// one plane wave per frequency, from "trades a sum" to "a long sum"
	const span = (longSum + beat - trades) / WAVES.length;
	const idx = Math.max(0, Math.min(WAVES.length - 1, Math.floor((f - trades) / span)));
	const waveP = f >= trades && f < longSum + beat * 3 ? window(f, trades, longSum + beat) : 0;
	const collapse = progress(f, short, beat * 4, ease.inOut);
	const u = {ink: 'verdigris' as const, p: progress(f, rowU)};
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Positions to frequencies</SceneTitle>

			<At x={space.margin} y={196} style={{opacity: progress(f, budget) * (1 - progress(f, expand))}}>
				<Tex px={size.math * 0.9} tex={'\\sum_{0<\\N(u)\\le H}|A_u(D)|^2\\ll D^{1+\\varepsilon}H'} />
			</At>
			<At x={space.margin} y={196} style={{opacity: progress(f, expand)}}>
				<Tex
					px={size.math * 0.9}
					tex={
						'\\sum_{u}|A_u(D)|^2=\\sum_{\\nn,\\mathfrak m}(\\cdots)\\sum_{0<\\N(\\htmlClass{u1}{u})\\le H}\\chi_{\\nn}(\\htmlClass{u2}{u})\\,\\overline{\\chi_{\\mathfrak m}(\\htmlClass{u3}{u})}\\,(\\cdots)'
					}
					light={{u1: u, u2: u, u3: u}}
				/>
			</At>
			<At x={1180} y={340} w={600} style={{opacity: progress(f, budget) * (1 - progress(f, engine))}}>
				<MixedLine parts={['assumed so far: the energy budget']} />
			</At>

			<PoissonDisks
				left={LEFT}
				right={RIGHT}
				leftP={progress(f, 6, beat * 3)}
				rightP={progress(f, trades)}
				wave={waveP > 0 ? {h: WAVES[idx], p: waveP} : null}
				litH={waveP > 0.5 ? WAVES[idx] : null}
				collapse={collapse}
				arrow={progress(f, apply)}
			/>
			<At x={(LEFT.cx + RIGHT.cx) / 2 - 170} y={LEFT.cy - 64} w={340} style={{textAlign: 'center', opacity: progress(f, apply) * (1 - collapse)}}>
				<MixedLine parts={['Poisson summation in ', {tex: 'u'}]} />
			</At>
			<At x={LEFT.cx - 260} y={LEFT.cy - LEFT.unit * 10.4 - 46} w={520} style={{textAlign: 'center'}}>
				<MixedLine p={progress(f, positions)} parts={['positions ', {tex: 'u'}]} />
			</At>
			<At x={LEFT.cx - 300} y={880} w={600} style={{textAlign: 'center'}}>
				<MixedLine p={progress(f, 6)} ink="paper" parts={[{tex: '0<\\N(u)\\le H', ink: 'paper'}, {tex: '\\,=D^{1+\\vartheta}', ink: 'paper'}]} />
			</At>
			<At x={RIGHT.cx - 260} y={RIGHT.cy - RIGHT.unit * 4.3 - 46} w={520} style={{textAlign: 'center'}}>
				<MixedLine p={progress(f, frequencies)} parts={['frequencies ', {tex: 'h'}]} />
			</At>
			<At x={RIGHT.cx - 260} y={RIGHT.cy + RIGHT.unit * 4.4} w={520} style={{textAlign: 'center'}}>
				<MixedLine p={progress(f, newH)} ink="paper" parts={[{tex: '0<\\N(h)\\ll\\cH', ink: 'paper'}]} />
			</At>
			<At x={RIGHT.cx - 300} y={350} w={600} style={{textAlign: 'center', opacity: progress(f, terms)}}>
				<Tex px={size.math * 0.9} tex={'\\cH\\asymp\\frac{D^{2}}{H}\\htmlClass{t}{=D^{1-\\vartheta}}'} show={{t: progress(f, theta)}} />
			</At>
			<Tag kind="schematic" p={progress(f, frequencies)} style={{position: 'absolute', left: 1540, top: 624}} />

			<SceneLocator />
			<Cite p={progress(f, apply)}>October manuscript, §2.3</Cite>
		</>
	);
};

// --- poisson-gauss: Gauss sums, the sign identity, and its sextic relative ---

const WALK = {ox: 1300, oy: 760, scale: 100};

export const PoissonGauss: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const transforms = cue('poisson-2', 'The Fourier transforms');
	const gauss = cue('poisson-2', 'are Gauss sums');
	const helps = cue('poisson-2', 'the arithmetic helps');
	const ordinary = cue('poisson-2', 'For ordinary integers');
	const sign = cue('poisson-2', 'just a sign');
	const relative = cue('poisson-2', 'a sextic relative');
	const hasse = cue('poisson-2', 'Hasse and Heath-Brown');
	const second = start('poisson-3');
	const absorb = cue('poisson-3', 'absorb a Gauss sum');
	const left = cue('poisson-3', 'what is left');
	const cubic = cue('poisson-3', 'cubic Gauss sums');
	const newSums = cue('poisson-3', 'B h of X');
	const built = cue('poisson-3', 'built from cubic Gauss sums');
	const twisted = cue('poisson-3', 'twisted by phases in h');
	const verd = (p: number) => ({ink: 'verdigris' as const, p});
	const mist = (p: number) => ({ink: 'mist' as const, p});
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Gauss sums</SceneTitle>

			<At x={space.margin} y={188} style={{opacity: progress(f, transforms)}}>
				<Tex px={size.math * 0.85} tex={'\\gamma_j(n)=\\frac{1}{\\sqrt{\\N(n)}}\\sum\\nolimits_{x\\bmod n}\\chi_n(x)^{j}\\,e(x/n)'} />
			</At>
			<At x={space.margin} y={332} style={{opacity: progress(f, ordinary)}}>
				<Tex
					px={size.math * 0.85}
					tex={'\\htmlClass{sq}{\\Big(\\frac{1}{\\sqrt m}\\sum\\nolimits_{x\\bmod m}\\Big(\\frac xm\\Big)e^{2\\pi ix/m}\\Big)^{2}}=\\htmlClass{s}{\\Big(\\frac{-1}{m}\\Big)}'}
					light={{s: verd(progress(f, sign))}}
				/>
			</At>
			<At x={space.margin} y={460} w={1060} style={{opacity: progress(f, sign + beat)}}>
				<MixedLine px={size.small} parts={['for ', {tex: 'm=13'}, ': the walk ends at ', {tex: '\\sqrt{13}'}, ', and ', {tex: '(\\sqrt{13}/\\sqrt{13})^2=1=\\big(\\tfrac{-1}{13}\\big)'}]} />
			</At>
			<At x={space.margin} y={532} style={{opacity: progress(f, relative)}}>
				<Tex
					px={size.math * 0.85}
					tex={
						'\\htmlClass{mu}{\\mu(n)\\gamma_{-1}(n)}=\\htmlClass{r1}{\\chi_n(-1)\\,G(n)^{-1}\\,\\overline{\\alpha(n)}}\\,\\htmlClass{g2}{\\gamma_2(n)}'
					}
					light={{mu: verd(progress(f, absorb)), r1: mist(progress(f, left)), g2: verd(progress(f, cubic))}}
				/>
			</At>
			<At x={space.margin} y={622} w={1000} style={{opacity: progress(f, hasse) * (1 - progress(f, second))}}>
				<MixedLine px={size.small} parts={['squarefree primary ', {tex: 'n'}, ', away from finitely many primes; ', {tex: 'G(n)'}, ' is a ray-class factor, ', {tex: '\\alpha(n)=n/|n|'}]} />
			</At>
			<At x={space.margin} y={684} style={{opacity: progress(f, newSums)}}>
				<Tex
					px={size.math * 0.8}
					tex={
						'B_h(X)=\\sum\\nolimits_{n}^{\\ast}\\overline{\\alpha(n)}\\,\\htmlClass{g2}{\\gamma_2(n)}\\,\\xi(n)\\,\\htmlClass{ch}{\\chi_n(h)}\\,U\\!\\big(\\N(n)/X\\big)'
					}
					light={{g2: verd(progress(f, built)), ch: verd(progress(f, twisted))}}
				/>
			</At>

			<At x={space.margin} y={786} w={1000} style={{opacity: progress(f, newSums + beat)}}>
				<MixedLine px={size.small} parts={[{tex: '\\ast'}, ': over squarefree ', {tex: 'n\\equiv1\\ (\\mathrm{mod}\\ 3)'}, '; ', {tex: 'h'}, ' is the new row variable']} />
			</At>
			<GaussWalk
				{...WALK}
				axes={progress(f, 6, beat * 2)}
				quad={progress(f, gauss + beat, ordinary - gauss + beat * 2, ease.inOut)}
				rootLabel={progress(f, sign)}
				quadDim={progress(f, cubic)}
				cubic={progress(f, cubic, beat * 5, ease.inOut)}
				circle={progress(f, cubic + beat * 4)}
			/>
			<At x={WALK.ox + 30} y={WALK.oy + 56} w={460} style={{opacity: progress(f, helps) * (1 - progress(f, cubic))}}>
				<MixedLine px={size.small} parts={['a Gauss sum as a walk: steps ', {tex: '\\big(\\tfrac{x}{13}\\big)e^{2\\pi i x/13}'}, ', ', {tex: 'x=1,\\dots,12'}]} />
			</At>
			<At x={1490} y={196} w={300} style={{opacity: progress(f, cubic + beat * 5)}}>
				<MixedLine
					px={size.small}
					ink="verdigris"
					parts={[
						'a cubic Gauss sum for ',
						{tex: '\\pi=1-3\\omega', ink: 'verdigris'},
						': length ',
						{tex: '\\sqrt{13}', ink: 'verdigris'},
						' again, at angle ',
						{tex: `${((CUBIC_ARG * 180) / Math.PI).toFixed(1)}^\\circ`, ink: 'verdigris'},
						'; its square is not a sign',
					]}
				/>
			</At>
			<Tag kind="computed" p={progress(f, gauss)} style={{position: 'absolute', left: WALK.ox + 30, top: 906}} />

			<SceneLocator />
			<Cite p={progress(f, relative)}>October manuscript, §2.3, after Hasse and Heath-Brown</Cite>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'poisson-swap': PoissonSwap,
	'poisson-gauss': PoissonGauss,
};
