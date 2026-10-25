import React from 'react';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Cite, Display, Tag, Text} from '../design/primitives';
import {At, Callout, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, size, space, stroke} from '../design/tokens';
import {Frame, shelfPack, Square, useHatch} from '../diagrams/Area';
import {Bracket} from '../diagrams/Energy';
import {familySizes} from '../diagrams/EnergyBars';
import {DRAWS, GRID, N, SignGrid} from '../diagrams/EnergyGrid';
import {MertensSquare} from '../diagrams/EnergyMertens';
import {Pythagoras} from '../diagrams/EnergyPythagoras';
import {ENERGY, fmt, WaveRows} from '../diagrams/EnergyWaves';
import {Ledger} from '../diagrams/Ledger';
import {MixedLine} from '../diagrams/MixedLine';
import {MobiusWalk} from '../diagrams/MobiusWalk';
import {PourSquares} from '../diagrams/OpenSquares';
import {Signs} from '../diagrams/Signs';

// Chapter 1: What energy means. Classical material, then the film's word.

// --- energy-squares: a list of numbers, their squares, the total area ---

// An illustrative list (schematic): small integers, so every square can be
// counted cell by cell.
const LIST = [3, -1, 2, -4, 1, -2];
const LIST_ENERGY = LIST.reduce((s, a) => s + a * a, 0);
const U = 52; // px per unit
const BASE = 740; // the bars' baseline
const GAP = 64;
const X0 = 300;
const SLOTS = LIST.map((_, i) => X0 + LIST.slice(0, i).reduce((s, a) => s + Math.abs(a) * U + GAP, 0));
const LIST_END = SLOTS[LIST.length - 1] + Math.abs(LIST[LIST.length - 1]) * U;

export const EnergySquares: React.FC = () => {
	const {frame: f, cue} = useCues();
	const energyIs = cue('energy-1', 'is a sum of squares');
	const list = cue('energy-1', 'Take a list of numbers');
	const squareEach = cue('energy-1', 'square each one');
	const add = cue('energy-1', 'and add');
	const never = cue('energy-1', 'never negative');
	const forgets = cue('energy-1', 'forgets the sign');
	const keeps = cue('energy-1', 'keeps only the size');
	const draw = cue('energy-1', 'Draw each number');
	const side = cue('energy-1', 'whose side is its size');
	const area = cue('energy-1', 'the total area');
	const hatch = useHatch('ink', 'medium', 0.7);
	const flip = progress(f, forgets, beat * 2.5, ease.inOut);
	const widen = progress(f, side, beat * 3, ease.inOut);
	const fillP = widen;
	const gridP = progress(f, area, beat * 2);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>A sum of squares</SceneTitle>
			<At x={space.margin} y={186} style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
				<Display px={size.lead} italic p={progress(f, 8)}>
					energy
				</Display>
				<MixedLine px={size.lead} ink="ink" p={progress(f, energyIs)} parts={[{tex: '=\\ a_1^{2}+a_2^{2}+a_3^{2}+\\cdots'}]} />
			</At>

			{/* the numbers, and their squares, in two ruled rows */}
			<At x={space.margin} y={312} w={190} style={{opacity: progress(f, list)}}>
				<MixedLine px={size.small} parts={[flip > 0.5 ? 'their sizes' : 'the numbers']} />
			</At>
			<At x={space.margin} y={402} w={190} style={{opacity: progress(f, squareEach)}}>
				<MixedLine px={size.small} parts={['their squares']} />
			</At>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<line x1={space.margin} x2={space.margin + (LIST_END + 200 - space.margin) * progress(f, list, beat * 2)} y1={370} y2={370} stroke={alpha('pencil', 0.45)} strokeWidth={stroke.hair} />
				<line x1={space.margin} x2={space.margin + (LIST_END + 200 - space.margin) * progress(f, squareEach, beat * 2)} y1={460} y2={460} stroke={alpha('pencil', 0.45)} strokeWidth={stroke.hair} />
			</svg>
			{LIST.map((a, i) => {
				const cx = SLOTS[i] + (Math.abs(a) * U) / 2;
				return (
					<React.Fragment key={i}>
						<At x={cx - 60} y={300} w={120} style={{textAlign: 'center', opacity: progress(f, list + i * 4)}}>
							<Tex tex={a < 0 ? `\\htmlClass{neg}{-}${-a}` : `${a}`} px={size.mathInline} display={false} show={{neg: 1 - flip}} />
						</At>
						<At x={cx - 60} y={392} w={120} style={{textAlign: 'center', opacity: progress(f, squareEach + i * 4)}}>
							<Tex tex={`${a * a}`} px={size.mathInline} display={false} />
						</At>
						{i > 0 && (
							<At x={SLOTS[i] - GAP / 2 - 20} y={392} w={40} style={{textAlign: 'center', opacity: progress(f, add)}}>
								<Tex tex="+" px={size.mathInline} ink="pencil" display={false} />
							</At>
						)}
					</React.Fragment>
				);
			})}
			<At x={LIST_END + 24} y={392} w={200} style={{opacity: progress(f, add + 6)}}>
				<Tex tex={`=\\ ${LIST_ENERGY}`} px={size.mathInline} display={false} />
			</At>

			{/* the picture: bars of size |a| that flip up, then widen into squares */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>{hatch.defs}</defs>
				<line x1={X0 - 40} x2={LIST_END + 40} y1={BASE} y2={BASE} stroke={alpha('pencil', 0.7)} strokeWidth={stroke.hair} opacity={progress(f, list)} />
				{LIST.map((a, i) => {
					const s = Math.abs(a) * U;
					const p = progress(f, list + i * 4 + 6, beat * 1.5);
					if (p <= 0) return null;
					const bw = 12;
					const cx = SLOTS[i] + s / 2;
					const x = lerp(cx - bw / 2, SLOTS[i], widen);
					const w = lerp(bw, s, widen);
					const top = a > 0 ? BASE - s * p : BASE - s * flip;
					const h = s * p;
					return (
						<g key={i}>
							<rect x={x} y={top} width={w} height={h} fill={color.ink} opacity={Math.max(0, 1 - widen * 3) * 0.85} />
							{widen > 0 && (
								<>
									<rect x={x} y={top} width={w} height={h} fill={`url(#${hatch.id})`} opacity={fillP} />
									<g opacity={gridP}>
										{Array.from({length: Math.abs(a) - 1}, (_, k) => (
											<g key={k}>
												<line x1={x + (k + 1) * U} x2={x + (k + 1) * U} y1={top} y2={top + h} stroke={alpha('pencil', 0.55)} strokeWidth={stroke.hair} />
												<line x1={x} x2={x + w} y1={top + (k + 1) * U} y2={top + (k + 1) * U} stroke={alpha('pencil', 0.55)} strokeWidth={stroke.hair} />
											</g>
										))}
									</g>
									<rect x={x} y={top} width={w} height={h} fill="none" stroke={color.ink} strokeWidth={stroke.line} opacity={widen} />
								</>
							)}
						</g>
					);
				})}
			</svg>
			<At x={SLOTS[3] - 8} y={BASE + 18} w={260} style={{opacity: progress(f, side + beat * 2)}}>
				<MixedLine px={size.small} parts={['side ', {tex: '4'}, ', area ', {tex: '16'}]} />
			</At>

			{/* what squaring does, and what the picture adds up to */}
			<At x={1400} y={560} w={420} style={{opacity: window(f, never, side)}}>
				<Tex tex={'(\\htmlClass{m}{-4})^{2}=4^{2}=16'} px={size.mathInline} display={false} light={{m: {ink: 'pencil', p: progress(f, forgets)}}} />
				<MixedLine px={size.small} p={progress(f, keeps)} parts={['the sign is gone; the size is kept']} style={{marginTop: 12}} />
			</At>
			<At x={1400} y={580} w={420} style={{opacity: progress(f, area)}}>
				<MixedLine px={size.lead} ink="ink" parts={['energy ', {tex: `=\\ ${LIST_ENERGY}`}]} />
				<MixedLine px={size.small} parts={['the total area: ', {tex: `${LIST_ENERGY}`}, ' unit cells']} style={{marginTop: 6}} />
			</At>
			<Tag kind="schematic" p={progress(f, list)} style={{position: 'absolute', left: 1400, top: 880}} />
			<SceneLocator />
		</>
	);
};

// --- energy-why: Pythagoras, then Parseval ---

const TRI = {ox: 350, oy: 568, u: 50};
const WAVE = {x: 1020, w: 440, rows: [304, 456, 570, 652], unit: 12, sq: {x: 1560, unit: 44}};

export const EnergyWhy: React.FC = () => {
	const {frame: f, cue} = useCues();
	const why = cue('energy-2', 'Why squares');
	const sizes = cue('energy-2', 'not plain sizes');
	const perpendicular = cue('energy-2', 'perpendicular pieces');
	const pyth = cue('energy-2', 'That is Pythagoras');
	const longSide = cue('energy-2', 'the square on the long side');
	const two = cue('energy-2', 'the two squares');
	const fourier = cue('energy-2', 'Fourier analysis');
	const split = cue('energy-2', 'Split a signal');
	const waves = cue('energy-2', 'into waves');
	const itsEnergy = cue('energy-2', 'its energy equals');
	const total = cue('energy-2', 'the total energy');
	const parseval = cue('energy-2', 'Parseval’s identity');
	const physicists = cue('energy-2', 'physicists call');
	const its = cue('energy-2', 'its energy', 'start', 2);
	const stuck = cue('energy-2', 'The word stuck');
	const left = 1 - 0.4 * progress(f, fourier, beat * 2);
	const wavesP = [0, 1, 2].map((j) => progress(f, waves + j * 6, beat * 2, ease.inOut));
	const squaresP = [progress(f, itsEnergy + 6), ...[0, 1, 2].map((j) => progress(f, total + j * 5))];
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Why squares</SceneTitle>

			{/* Pythagoras: sizes do not add over perpendicular pieces; squares do */}
			<Pythagoras
				{...TRI}
				tri={progress(f, why, beat * 2, ease.inOut)}
				lengths={progress(f, sizes)}
				right={progress(f, perpendicular)}
				hyp={progress(f, longSide, beat * 2, ease.inOut)}
				legs={progress(f, two, beat * 2, ease.inOut)}
				grid={progress(f, two + beat * 2)}
				areas={1}
				opacity={left}
			/>
			<At x={space.margin} y={760} w={760} style={{opacity: left}}>
				<MixedLine px={size.label} p={progress(f, sizes)} parts={['sizes do not add: ', {tex: '3+4\\neq5'}]} />
				<MixedLine px={size.label} ink="ink" p={progress(f, two + beat)} parts={['squares do: ', {tex: '3^{2}+4^{2}=9+16=25=5^{2}'}]} style={{marginTop: 10}} />
				<Display px={size.lead} italic p={progress(f, pyth)} style={{marginTop: 18}}>
					Pythagoras
				</Display>
			</At>
			<Tag kind="schematic" p={progress(f, why)} style={{position: 'absolute', left: 560, top: 690}} />

			{/* Parseval: a signal, its waves, and their energies as areas */}
			<At x={WAVE.x} y={180} w={760} style={{opacity: progress(f, split)}}>
				<MixedLine px={size.small} parts={['a signal on one period, and the three waves it splits into']} />
			</At>
			<WaveRows
				{...WAVE}
				signalP={progress(f, split, beat * 2, ease.inOut)}
				wavesP={wavesP}
				squaresP={squaresP}
				labelsP={squaresP}
			/>
			{[1, 2, 3].map((r) => (
				<At key={r} x={WAVE.x - 52} y={WAVE.rows[r] - 26} w={40} style={{textAlign: 'center', opacity: wavesP[r - 1]}}>
					<Tex tex={r === 1 ? '=' : '+'} px={size.mathInline} ink="pencil" display={false} />
				</At>
			))}
			<At x={WAVE.sq.x} y={686} w={260} style={{opacity: squaresP[1]}}>
				<MixedLine px={size.small} parts={['energies, as areas']} />
			</At>
			<At x={WAVE.x} y={716} w={520} style={{opacity: progress(f, total + beat)}}>
				<MixedLine px={size.label} ink="ink" parts={['energy: ', {tex: `${fmt(ENERGY.signal)}=${ENERGY.waves.map(fmt).join('+')}`}]} />
			</At>
			<At x={WAVE.x} y={780} w={780} style={{opacity: progress(f, parseval)}}>
				<MixedLine px={size.label} ink="ink" parts={['Parseval’s identity: ', {tex: '\\int_0^1|f(t)|^{2}\\,dt=\\sum_{k}|\\hat f(k)|^{2}'}]} />
			</At>
			<At x={WAVE.x} y={846} w={780} style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
				<MixedLine px={size.label} p={progress(f, physicists)} parts={['physicists call ', {tex: '\\int|f(t)|^{2}\\,dt'}, ' the']} />
				<Display px={size.lead} italic p={progress(f, its)}>
					energy
				</Display>
				<MixedLine px={size.label} p={progress(f, its)} parts={['of the signal']} />
			</At>
			<Tag kind="computed" p={progress(f, itsEnergy)} style={{position: 'absolute', left: WAVE.sq.x, top: 730}} />
			<SceneLocator />
			<Cite p={progress(f, pyth)}>Classical: Pythagoras; Parseval’s identity</Cite>
		</>
	);
};

// --- energy-grid: the square of a sum of N terms, and random signs ---

const GRID_AT = {x: 330, y: 330, cell: 30};
const BLOCK = {x: 980, y: 452};
const PANEL = 960;

export const EnergyGrid: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const sumOf = cue('energy-3', 'square a sum');
	const spreads = cue('energy-3', 'spreads into a grid');
	const products = cue('energy-3', 'N squared products');
	const diagonal = cue('energy-3', 'on the diagonal');
	const neverNeg = cue('energy-3', 'never negative');
	const cancellation = cue('energy-3', 'All the cancellation');
	const cross = cue('energy-3', 'in the cross terms');
	const meet = cue('energy-3', 'where a plus can meet a minus');
	const random = start('energy-4');
	const nothing = cue('energy-4', 'to nothing', 'end');
	const survives = cue('energy-4', 'Only the diagonal survives');
	const aboutN = cue('energy-4', 'the energy is about N');
	const typical = cue('energy-4', 'a typical sum');
	const root = cue('energy-4', 'square root of N');
	const sqrtCancel = cue('energy-4', 'square-root cancellation');
	const benchmark = cue('energy-4', 'the benchmark');
	const avgT = progress(f, random + 6, nothing + beat * 2 - random - 6, ease.inOut);
	const draws = f < random ? 1 : Math.pow(DRAWS, avgT);
	const second = progress(f, random, beat * 1.5);
	const crossShow = 1 - 0.65 * window(f, diagonal, cancellation, beat) - 0.85 * progress(f, survives, beat * 2);
	const diagShow = 1 - 0.65 * window(f, cancellation, random + beat * 2, beat);
	const slide = progress(f, aboutN, beat * 3, ease.inOut);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Expand the square</SceneTitle>
			<At x={space.margin} y={176} style={{opacity: progress(f, Math.min(sumOf, 10))}}>
				<Tex
					px={size.math * 0.8}
					display={false}
					tex={'\\Big|\\sum_{n\\le N}a_n\\Big|^{2}=\\htmlClass{diag}{\\sum_{n\\le N}|a_n|^{2}}\\;\\htmlClass{cross}{+\\sum_{n\\ne m}a_n\\overline{a_m}}'}
					show={{diag: progress(f, diagonal) * diagShow, cross: progress(f, cancellation) * crossShow}}
				/>
			</At>
			<SignGrid
				{...GRID_AT}
				fill={progress(f, spreads, products + beat * 2 - spreads, ease.inOut)}
				headers={progress(f, Math.min(sumOf, 10) + beat)}
				draws={draws}
				diag={progress(f, diagonal, beat * 2)}
				cross={window(f, cancellation, random)}
				minus={window(f, meet, random)}
				dim={progress(f, survives, beat * 2)}
				slide={slide}
				block={BLOCK}
			/>
			<At x={GRID_AT.x} y={GRID_AT.y + N * GRID_AT.cell + 22} w={560}>
				<Tag kind="computed" p={progress(f, spreads)} />
				<MixedLine px={size.small} p={progress(f, spreads)} parts={['random signs ', {tex: 'a_n=\\pm1'}, ', seeded']} style={{marginTop: 4}} />
			</At>

			{/* energy-3: what the grid holds */}
			<At x={PANEL} y={330} w={830} style={{opacity: 1 - second}}>
				<MixedLine p={progress(f, products)} parts={['a grid of ', {tex: 'N^{2}'}, ' products ', {tex: 'a_n\\overline{a_m}'}, ', here ', {tex: `N=${N}`}]} />
				<MixedLine ink="ink" p={progress(f, diagonal)} parts={['on the diagonal: ', {tex: '|a_n|^{2}=1'}, progress(f, neverNeg) > 0 ? ', never negative' : '']} style={{marginTop: 26}} />
				<MixedLine p={progress(f, cross)} parts={['off it: the cross terms, each ', {tex: '\\pm1'}]} style={{marginTop: 26}} />
				<MixedLine p={progress(f, meet)} parts={['where ', {tex: '+'}, ' meets ', {tex: '-'}, ', the product is ', {tex: '-1'}, ': cancellation']} style={{marginTop: 12}} />
			</At>

			{/* energy-4: averaged over random signs, only the diagonal survives */}
			<At x={PANEL} y={330} w={830} style={{opacity: second}}>
				<MixedLine
					parts={[
						'averaged over ',
						{tex: `${Math.max(1, Math.min(DRAWS, Math.floor(draws)))}`},
						' random choices of the signs: the cross terms fade',
					]}
				/>
			</At>
			<At x={BLOCK.x + 4 * GRID_AT.cell + 30} y={BLOCK.y - 4} w={640} style={{opacity: progress(f, aboutN + beat * 2)}}>
				<MixedLine ink="ink" parts={['the diagonal: area ', {tex: `N=${N}`}]} />
				<MixedLine p={progress(f, root)} parts={['a square of side ', {tex: `\\sqrt N=${Math.sqrt(N)}`}]} style={{marginTop: 10}} />
			</At>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<Bracket x1={BLOCK.x - 18} y1={BLOCK.y + 4 * GRID_AT.cell} x2={BLOCK.x - 18} y2={BLOCK.y} ink="ink" p={progress(f, root, beat * 2)} />
			</svg>
			<At x={PANEL} y={616} w={830} style={{opacity: progress(f, aboutN)}}>
				<Tex px={size.math * 0.6} display={false} tex={'\\mathbb{E}\\,\\Big|\\sum_{n\\le N}a_n\\Big|^{2}=N,\\qquad \\htmlClass{r}{\\Big|\\sum_{n\\le N}a_n\\Big|\\approx\\sqrt N}'} show={{r: progress(f, typical)}} />
				<MixedLine px={size.small} p={progress(f, aboutN + beat * 2)} parts={['the mean of ', {tex: '|a_1+\\cdots+a_N|^{2}'}, ' over these ', {tex: `${DRAWS}`}, ' draws: ', {tex: GRID.meanSq(DRAWS).toFixed(1)}]} style={{marginTop: 10}} />
			</At>
			<At x={PANEL} y={790} w={830}>
				<Display px={size.lead} italic p={progress(f, sqrtCancel)}>
					square-root cancellation
				</Display>
				<MixedLine px={size.small} p={progress(f, benchmark)} parts={['size about ', {tex: '\\sqrt N'}, ', not ', {tex: 'N'}, ': the benchmark for every sum in this film']} style={{marginTop: 8}} />
			</At>
			<SceneLocator />
			<Cite p={progress(f, products)}>Classical</Cite>
		</>
	);
};

// --- energy-mertens: arithmetic can look random; a picture proves nothing ---

const WALK_AT = {x: 300, y: 330, w: 900, h: 230};
const SQ_AT = {x: 300, y: 630, w: 900, h: 230};
const RIGHT = 1290;

export const EnergyMertens: React.FC = () => {
	const {frame: f, cue} = useCues();
	const look = cue('energy-5', 'it can look it');
	const mertens = cue('energy-5', 'the Mertens function');
	const running = cue('energy-5', 'the running total');
	const computed = cue('energy-5', 'computed to twelve hundred');
	const hundred = cue('energy-5', 'twelve hundred', 'end');
	const square = cue('energy-5', 'its square beside');
	const line = cue('energy-5', 'the line y equals x');
	const proves = cue('energy-5', 'A picture proves nothing');
	const bound = cue('energy-5', 'A bound of x');
	const equivalent = cue('energy-5', 'is equivalent to');
	const upto = 1 + 1199 * progress(f, mertens, hundred - mertens, ease.inOut);
	const sqUpto = 1 + 1199 * progress(f, square, beat * 3, ease.inOut);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Arithmetic can look random</SceneTitle>
			<At x={space.margin} y={226} w={140} style={{opacity: progress(f, 8)}}>
				<Tex tex={'\\arith{\\mu(n)}'} px={size.label} display={false} />
			</At>
			<Signs x={WALK_AT.x} y={250} count={40} cell={22.5} p={progress(f, 8, look - 8, ease.inOut)} labels={false} lift={20} />
			<MobiusWalk {...WALK_AT} upto={upto} yMax={20} yTicks={[-15, 0, 15]} xTicks={[]} />
			<MertensSquare {...SQ_AT} upto={f < square ? 0 : sqUpto} line={progress(f, line, beat * 2, ease.inOut)} axes={progress(f, square - beat, beat * 2)} />
			<At x={space.margin} y={WALK_AT.y + WALK_AT.h / 2 - 22} w={140} style={{opacity: progress(f, mertens)}}>
				<Tex tex="M(x)" px={size.label} ink="viridian" display={false} />
			</At>
			<At x={space.margin} y={SQ_AT.y + SQ_AT.h / 2 - 22} w={140} style={{opacity: progress(f, square)}}>
				<Tex tex="M(x)^{2}" px={size.label} display={false} />
			</At>
			<At x={SQ_AT.x + SQ_AT.w * 0.26} y={SQ_AT.y + 10} w={200} style={{opacity: progress(f, line + beat)}}>
				<Tex tex="y=x" px={size.label} display={false} />
			</At>

			<At x={RIGHT} y={330} w={500} style={{opacity: progress(f, running)}}>
				<Tex tex={'M(x)=\\sum_{n\\le x}\\arith{\\mu(n)}'} px={size.math * 0.7} display={false} />
				<MixedLine px={size.small} p={progress(f, computed)} parts={['the running total of the Möbius signs, computed to ', {tex: 'x=1200'}]} style={{marginTop: 14}} />
			</At>
			<Tag kind="computed" p={progress(f, computed)} style={{position: 'absolute', left: RIGHT, top: 500}} />
			<At x={RIGHT} y={636} w={500} style={{opacity: progress(f, square)}}>
				<MixedLine px={size.small} parts={['its square, beside the line ', {tex: 'y=x'}, ': the energy a random walk of ', {tex: 'x'}, ' steps would have, on average']} />
			</At>
			<At x={RIGHT} y={768} w={500}>
				<Text px={size.label} p={progress(f, proves)}>
					A picture proves nothing.
				</Text>
				<div style={{marginTop: 10}}>
					<MixedLine px={size.small} p={progress(f, bound)} parts={[{tex: 'M(x)\\ll_{\\varepsilon} x^{1/2+\\varepsilon}'}, ' for every ', {tex: '\\varepsilon>0'}, ' '] } style={{display: 'inline'}} />
					<MixedLine px={size.small} p={progress(f, equivalent)} parts={['is equivalent to the Riemann hypothesis']} style={{display: 'inline'}} />
				</div>
			</At>
			<SceneLocator />
			<Cite p={progress(f, bound)}>Littlewood (1912), as cited in the October manuscript, §2.1</Cite>
		</>
	);
};

// --- energy-budget: a family of sums, all their squares, a frame: the budget ---

const FAMILY_N = 20;
const FAM_UNIT = 76; // px for a member of typical size (schematic sizes, mean square 1)
const FAM_SIZES = familySizes(FAMILY_N, 9);
const FAM_PACK = shelfPack(
	FAM_SIZES.map((s) => s * FAM_UNIT),
	660,
	16,
);
const FAM_AT = {x: space.margin, y: 236};
const FAM_COL = {x: 920, y: 870, w: 300};
const FAM_AREA = FAM_SIZES.reduce((s, v) => s + v * v * FAM_UNIT * FAM_UNIT, 0);
const FAM_BUDGET_H = FAM_AREA / 0.8 / FAM_COL.w; // the total sits inside its frame, with room to spare
const FAM_TOP = FAM_COL.y - FAM_BUDGET_H;
// the member singled out: the largest on the bottom shelf, so its callout is short
const BOTTOM = Math.max(...FAM_PACK.placed.map((q) => q.y));
const ONE = FAM_PACK.placed.filter((q) => q.y === BOTTOM).reduce((a, b) => (b.side > a.side ? b : a));
const NOTES = 1320;

export const EnergyBudget: React.FC = () => {
	const {frame: f, cue} = useCues();
	const family = cue('energy-6', 'a whole family of sums');
	const add = cue('energy-6', 'add the squares');
	const upper = cue('energy-6', 'An upper bound');
	const calls = cue('energy-6', 'an energy budget');
	const ms = cue('energy-6', 'a mean-square estimate');
	const word = cue('energy-6', 'the word energy');
	const titles = cue('energy-6', 'section titles');
	const nothing = cue('energy-6', 'says nothing about any one member');
	const sum = cue('energy-6', 'An energy is a sum of squares');
	const promise = cue('energy-6', 'A budget is a promise');
	const pour = (i: number) => progress(f, add + i * 2.5, beat * 2, ease.inOut);
	const items = FAM_SIZES.map((_, i) => {
		const q = FAM_PACK.placed.find((pl) => pl.i === i)!;
		return {x: FAM_AT.x + q.x, y: FAM_AT.y + q.y, side: q.side};
	});
	const one = window(f, nothing, sum + beat);
	const hatch = useHatch('ink', 'light', 0.6);
	const oneItem = items[ONE.i];
	return (
		<>
			<SceneTitle p={progress(f, 4)}>An energy budget</SceneTitle>
			<At x={FAM_AT.x} y={180} w={700} style={{opacity: progress(f, family)}}>
				<MixedLine px={size.small} parts={['a family of sums ', {tex: 'A_u'}, ', each a square of side ', {tex: '|A_u|'}]} />
			</At>
			{/* the members stay where they are; copies of their squares pour into the column */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>{hatch.defs}</defs>
				{items.map((it, i) => (
					<Square key={i} x={it.x} y={it.y} side={it.side} fill={`url(#${hatch.id})`} fillP={0.8} p={progress(f, Math.min(family, 10) + FAM_PACK.placed.findIndex((pl) => pl.i === i) * 2, beat)} opacity={i === ONE.i ? 1 : 1 - 0.55 * one} width={i === ONE.i ? stroke.line + 1.5 * one : stroke.line} />
				))}
			</svg>
			<PourSquares items={items} column={FAM_COL} pour={pour} show={(i) => (pour(i) > 0 ? 1 : 0)} />
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<Frame x={FAM_COL.x} y={FAM_TOP} w={FAM_COL.w} h={FAM_BUDGET_H} p={progress(f, upper, beat * 2, ease.inOut)} />
				<line x1={FAM_COL.x - 24} x2={FAM_COL.x - 24 + (FAM_COL.w + 48) * progress(f, upper + beat, beat * 2, ease.inOut)} y1={FAM_TOP} y2={FAM_TOP} stroke={color.cobalt} strokeWidth={stroke.budget} />
			</svg>
			<At x={FAM_COL.x - 40} y={FAM_COL.y + 12} w={FAM_COL.w + 80} style={{textAlign: 'center', opacity: progress(f, add + beat * 3)}}>
				<Tex tex={'\\sum_u|A_u|^{2}'} px={size.label} ink="pencil" display={false} />
			</At>
			<Callout x={oneItem.x + oneItem.side / 2 + 50} y={FAM_AT.y + FAM_PACK.height + 64} to={[oneItem.x + oneItem.side / 2, oneItem.y + oneItem.side + 4]} p={one} width={520}>
				any one member: the budget alone does not size it
			</Callout>

			{/* the film's word, and the manuscripts' */}
			<At x={NOTES} y={FAM_TOP - 44} w={520}>
				<Display px={size.heading} p={progress(f, calls)}>
					energy budget
				</Display>
				<MixedLine px={size.small} p={progress(f, calls + beat)} parts={['this film’s name for an upper bound on the total']} style={{marginTop: 6}} />
			</At>
			<At x={NOTES} y={FAM_TOP + 110} w={520}>
				<MixedLine ink="ink" p={progress(f, ms)} parts={['the manuscripts: a “mean-square estimate”']} />
				<MixedLine px={size.small} p={progress(f, word)} parts={['“energy” in the October LaTeX labels: ']} style={{marginTop: 22}} />
				<div style={{opacity: progress(f, word + beat), marginTop: 4}}>
					<Tex px={size.small} ink="pencil" display={false} tex={'\\texttt{eq:energy},\\ \\texttt{eq:intro-energy-target}'} />
				</div>
				<MixedLine px={size.small} p={progress(f, titles)} parts={['and in September section titles: “Completed cubic reflection and unmarked row energy”, “The reflected energy bound”']} style={{marginTop: 16}} />
			</At>

			{/* the ledger: the first entry of the film's account */}
			<Ledger
				x={FAM_AT.x + 30}
				y={FAM_AT.y + FAM_PACK.height + 150}
				w={720}
				amountW={180}
				px={size.label}
				rules={progress(f, sum)}
				rows={[
					{label: ['an energy: a sum of squares'], amount: '\\sum_u|A_u|^{2}', kind: 'entry', p: progress(f, sum), light: window(f, sum, promise)},
					{label: ['a budget: a promise about the sum'], amount: '\\le B', kind: 'budget', p: progress(f, promise), light: progress(f, promise)},
				]}
			/>
			<Tag kind="schematic" p={progress(f, family)} style={{position: 'absolute', left: FAM_AT.x + 600, top: 182}} />
			<SceneLocator />
			<Cite p={progress(f, ms) * (1 - progress(f, word, beat))}>October manuscript, §1.3 and the title of §3</Cite>
			<Cite p={progress(f, word + beat, beat)}>October manuscript, §2.5 and §4.3 (labels); September manuscript, §5 and §14.4</Cite>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'energy-squares': EnergySquares,
	'energy-why': EnergyWhy,
	'energy-grid': EnergyGrid,
	'energy-mertens': EnergyMertens,
	'energy-budget': EnergyBudget,
};
