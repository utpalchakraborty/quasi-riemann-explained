import React from 'react';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Cite, Tag, Text} from '../design/primitives';
import {At, Callout, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, size, space, stroke} from '../design/tokens';
import {COUNT_X, primeCounts} from '../diagrams/frontierData';
import {PrimeCounts} from '../diagrams/PrimeCounts';
import {StripMap} from '../diagrams/StripMap';
import {WaveSizes} from '../diagrams/WaveSizes';

// Chapter 11: from the Eisenstein field back to Dirichlet L-functions, and
// from zeros back to counts of primes.

const ELEVEN = 11 / 12;

// back-transfer: L_K(s, chi o N) = L(s, chi) L(s, chi chi_{-3}), as three strips.
const STRIP = {y: 470, w: 380, h: 360};
const STRIP_X = [200, 770, 1340];
const sxIn = (i: number, s: number) => STRIP_X[i] + ((s + 0.04) / 1.1) * STRIP.w;
const tyIn = (u: number) => STRIP.y + STRIP.h * (1 - u);
const SUPPOSED = [
	{strip: 1, s: 0.955, u: 0.56},
	{strip: 2, s: 0.97, u: 0.8},
];

export const BackTransfer: React.FC = () => {
	const {frame: f, cue} = useCues();
	const c = (phrase: string) => cue('back-1', phrase);
	const hecke = progress(f, c('theorem about'), beat * 3);
	const lift = progress(f, c('Lift a Dirichlet character'));
	const split = progress(f, c('splits into two'), beat * 2);
	const names = [progress(f, 6), progress(f, c('L of chi')), progress(f, c('L of chi times'))];
	const either = c('zero of either factor');
	const product = progress(f, c('zero of the product'));
	const transfers = progress(f, c('line transfers'), beat * 3);
	const zeta = progress(f, c('including zeta itself'));
	const gone = progress(f, c('line transfers'), beat * 2);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>One field, every character</SceneTitle>

			<At x={space.margin} y={186} style={{opacity: lift, display: 'flex', alignItems: 'baseline', gap: 32, whiteSpace: 'nowrap'}}>
				<Tex tex={'(\\chi\\circ\\N)(\\mathfrak a)=\\chi(\\N\\mathfrak a)'} px={size.math * 0.85} display={false} />
				<Text px={size.label} ink="mist">
					a Dirichlet character, lifted through the norm
				</Text>
			</At>
			<At x={space.margin} y={262} w={1100} style={{opacity: progress(f, c('splits into two') + beat * 2)}}>
				<Text px={size.small} ink="mist">
					up to finitely many Euler factors, all nonzero for Re s &gt; 0
				</Text>
			</At>

			{[
				'L_K(s,\\chi\\circ\\N)',
				'L(s,\\verd{\\chi})',
				'L(s,\\verd{\\chi\\chi_{-3}})',
			].map((tex, i) => (
				<At key={tex} x={STRIP_X[i] - 40} y={STRIP.y - 156} w={STRIP.w + 80} style={{textAlign: 'center', opacity: i === 0 ? hecke : names[i] * split}}>
					<Tex tex={tex} px={size.math * 0.8} display={false} />
				</At>
			))}
			{['=', '\\times'].map((tex, i) => (
				<At key={tex} x={STRIP_X[i] + STRIP.w + 30} y={STRIP.y + STRIP.h / 2 - 40} w={STRIP_X[i + 1] - STRIP_X[i] - STRIP.w - 60} style={{textAlign: 'center', opacity: split}}>
					<Tex tex={tex} px={size.mathLarge} display={false} />
				</At>
			))}
			{STRIP_X.map((x, i) => {
				const shown = i === 0 ? hecke : split * names[i];
				const line = i === 0 ? hecke : transfers;
				return (
					<div key={x} style={{opacity: shown}}>
						<StripMap
							id={`transfer-${i}`}
							x={x}
							y={STRIP.y}
							w={STRIP.w}
							h={STRIP.h}
							sigma={[-0.04, 1.06]}
							t={[0, 50]}
							axisNames={false}
							frontiers={line > 0 ? [{sigma: ELEVEN, ink: 'gilt', label: i === 0 ? '\\tfrac{11}{12}' : undefined, p: line, hatch: line}] : []}
						/>
					</div>
				);
			})}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				{SUPPOSED.map((z, k) => {
					const appear = progress(f, either + k * beat);
					const op = appear * (1 - gone);
					if (op <= 0) return null;
					const [x0, y0] = [sxIn(z.strip, z.s), tyIn(z.u)];
					const [x1, y1] = [sxIn(0, z.s), tyIn(z.u)];
					return (
						<g key={k} opacity={op}>
							<circle cx={x0} cy={y0} r={8} fill={color.ember} />
							<g opacity={product}>
								<path d={`M${x0},${y0 - 14}Q${(x0 + x1) / 2},${y0 - 90 - 70 * k} ${x1},${y1 - 14}`} fill="none" stroke={alpha('ember', 0.8)} strokeWidth={stroke.line} strokeDasharray="6 7" />
								<circle cx={x1} cy={y1} r={8} fill={color.ember} />
								<circle cx={x1} cy={y1} r={20} fill="none" stroke={color.ember} strokeWidth={stroke.line} />
							</g>
						</g>
					);
				})}
			</svg>
			<At x={STRIP_X[1]} y={STRIP.y + STRIP.h + 56} w={STRIP_X[2] + STRIP.w - STRIP_X[1]} style={{opacity: window(f, either, c('line transfers'))}}>
				<Text px={size.small} ink="ember">
					a zero of either factor would be a zero of the product
				</Text>
			</At>
			<At x={STRIP_X[1]} y={STRIP.y + STRIP.h + 66} w={STRIP_X[2] + STRIP.w - STRIP_X[1]} style={{opacity: zeta, display: 'flex', alignItems: 'baseline', gap: 28}}>
				<Text px={size.label} ink="mist">
					χ = 1:
				</Text>
				<Tex tex={'\\zeta_K(s)=\\zeta(s)\\,L(s,\\chi_{-3})'} px={size.math * 0.8} display={false} />
			</At>
			<Tag kind="claim" p={hecke} style={{position: 'absolute', left: STRIP_X[0], top: STRIP.y + STRIP.h + 60}} />

			<SceneLocator />
			<Cite p={progress(f, c('splits into two'))}>October manuscript, §3</Cite>
		</>
	);
};

// back-count: zeros set the size of the error; counts in progressions mod 4.
const COUNTS = {x: 230, y: 460, w: 560, h: 370};
const WAVES = {x: 1060, y: 460, w: 600, h: 370, decades: 24};
const SIEGEL = {x: 40, y: 100, w: 520, h: 300, box: {x: 190, y: 360, w: 640, h: 470}};

const CORollary =
	'\\sup_{\\substack{q\\le x\\\\(a,q)=1}}\\Big|\\pi(x;q,a)-\\frac{1}{\\varphi(q)}\\int_2^x\\frac{dt}{\\log t}\\Big|\\ll \\htmlClass{cb}{x^{11/12}\\log x}';

const Swatch: React.FC<{ink: 'verdigris' | 'paper'; dash?: string; width?: number}> = ({ink, dash, width = stroke.line}) => (
	<svg width={36} height={14} style={{flex: 'none'}}>
		<line x1={0} x2={36} y1={7} y2={7} stroke={color[ink]} strokeWidth={width} strokeDasharray={dash} />
	</svg>
);

export const BackCount: React.FC = () => {
	const {frame: f, cue} = useCues();
	const c2 = (phrase: string) => cue('back-2', phrase);
	const c3 = (phrase: string) => cue('back-3', phrase);
	const final = primeCounts().final;

	const counts = progress(f, c2('prime counts'), beat * 8, ease.inOut);
	const formula = progress(f, c2('explicit formula'));
	const rho = progress(f, c2('a zero, rho'));
	const wave = progress(f, c2('contributes a wave'), beat * 2);
	const keep = progress(f, c2('Keep every real part'), beat * 4, ease.inOut);
	const ceiling = progress(f, c2('eleven twelfths'), beat * 2);
	const corollary = progress(f, c2('error in counting primes'));
	const bound = progress(f, c2('constant times x'));
	const modulus = progress(f, c3('every modulus up to x'));
	const effective = progress(f, c3('absolute and effective'));
	const q1 = progress(f, c3('large moduli'), beat * 3, ease.inOut);
	const q2 = progress(f, c3('bigger than the count'), beat * 3, ease.inOut);
	const shift = q1 + q2; // decades: q = 10, then q = 100
	const notLast = progress(f, c3('not the last word'));
	const siegel = progress(f, c3('rules out'), beat * 2);
	const sweep = progress(f, c3('exceptional zeros'), beat * 4, ease.inOut);
	const erased = progress(f, c3('shadowed'), beat * 2);

	const beta = lerp(0.97, ELEVEN, keep);
	const q = Math.round(Math.pow(10, shift));
	const mainTex = shift > 0.05 ? `x/\\varphi(q)` : 'x';
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Zeros count primes</SceneTitle>

			{/* the explicit formula, then the corollary in its place */}
			<At x={space.margin} y={196} style={{opacity: formula * (1 - corollary), whiteSpace: 'nowrap'}}>
				<Tex
					tex={'\\psi(x)=x-\\htmlClass{wv}{\\sum_{\\rho}\\frac{x^{\\rho}}{\\rho}}-\\log 2\\pi-\\tfrac12\\log\\big(1-x^{-2}\\big)'}
					px={46}
					light={{wv: {ink: 'ember', p: rho}}}
				/>
			</At>
			<At x={WAVES.x} y={340} style={{opacity: wave * (1 - progress(f, c2('Keep every real part'))), whiteSpace: 'nowrap'}}>
				<Tex tex={'\\Big|\\frac{x^{\\rho}}{\\rho}\\Big|=\\frac{x^{\\beta}}{|\\rho|},\\qquad \\rho=\\beta+i\\gamma'} px={40} />
			</At>
			<At x={space.margin} y={190} style={{opacity: corollary, whiteSpace: 'nowrap'}}>
				<Tex tex={CORollary} px={42} light={{cb: {ink: 'gilt', p: bound}}} />
			</At>
			<At x={1240} y={204} w={552} style={{display: 'flex', flexDirection: 'column', gap: 6}}>
				<Text px={size.label} p={modulus}>
					every modulus q ≤ x at once
				</Text>
				<Text px={size.label} p={effective}>
					an absolute, effective constant
				</Text>
				<Text px={size.small} ink="mist" p={progress(f, c3('in principle'))}>
					it could, in principle, be computed
				</Text>
			</At>

			{/* left: computed counts, later the exceptional zero */}
			<div style={{opacity: 1 - siegel}}>
				<PrimeCounts {...COUNTS} p={counts} axes={progress(f, c2('prime counts'))} />
				<At x={COUNTS.x + 20} y={COUNTS.y + 4} style={{opacity: progress(f, c2('prime counts') + beat * 4), display: 'flex', flexDirection: 'column', gap: 6}}>
					<Text px={size.small} ink="mist">
						primes up to x = {COUNT_X.toLocaleString('en-US')}
					</Text>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<Swatch ink="verdigris" dash="8 6" />
						<Text px={size.small}>p ≡ 1 mod 4: {final.one.toLocaleString('en-US')}</Text>
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<Swatch ink="verdigris" />
						<Text px={size.small}>p ≡ 3 mod 4: {final.three.toLocaleString('en-US')}</Text>
					</div>
					<div style={{display: 'flex', alignItems: 'center', gap: 12}}>
						<Swatch ink="paper" width={stroke.bold} />
						<Tex tex={'\\tfrac12\\int_2^x\\tfrac{dt}{\\log t}'} px={size.small} display={false} />
						<Text px={size.small}>: {final.main.toLocaleString('en-US', {maximumFractionDigits: 1, minimumFractionDigits: 1})}</Text>
					</div>
				</At>
				<Tag kind="computed" p={progress(f, c2('prime counts'))} style={{position: 'absolute', left: COUNTS.x, top: COUNTS.y + COUNTS.h + 54}} />
			</div>
			<div style={{opacity: siegel}}>
				<div style={{position: 'absolute', left: SIEGEL.box.x, top: SIEGEL.box.y, width: SIEGEL.box.w, height: SIEGEL.box.h, overflow: 'hidden'}}>
					<StripMap
						id="siegel"
						x={SIEGEL.x}
						y={SIEGEL.y}
						w={SIEGEL.w}
						h={SIEGEL.h}
						sigma={[0.62, 1.04]}
						t={[0, 30]}
						axisNames={false}
						sigmaTicks={[{sigma: 1, tex: '1'}]}
						regions={[{width: (t) => 0.13 / Math.log(t + 3), p: 1, hatch: 1, tMin: 0}]}
						frontiers={sweep > 0 ? [{sigma: ELEVEN, ink: 'gilt', label: '\\tfrac{11}{12}', p: sweep, hatch: sweep}] : []}
					/>
				</div>
				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
					{(() => {
						const zx = SIEGEL.box.x + SIEGEL.x + ((0.975 - 0.62) / 0.42) * SIEGEL.w;
						const zy = SIEGEL.box.y + SIEGEL.y + SIEGEL.h;
						return (
							<g opacity={1 - erased}>
								<circle cx={zx} cy={zy} r={9} fill={color.ember} />
								<circle cx={zx} cy={zy} r={22} fill="none" stroke={color.ember} strokeWidth={stroke.line} />
							</g>
						);
					})()}
				</svg>
				<Callout
					x={SIEGEL.box.x + SIEGEL.x + 300}
					y={SIEGEL.box.y + SIEGEL.y + SIEGEL.h - 120}
					to={[SIEGEL.box.x + SIEGEL.x + ((0.975 - 0.62) / 0.42) * SIEGEL.w - 14, SIEGEL.box.y + SIEGEL.y + SIEGEL.h - 16]}
					ink="ember"
					align="right"
					width={300}
					p={siegel * (1 - erased)}
				>
					a supposed exceptional real zero
				</Callout>
				<At x={SIEGEL.box.x + SIEGEL.x} y={SIEGEL.box.y + SIEGEL.y + SIEGEL.h + 52} w={SIEGEL.w + 120} style={{opacity: progress(f, c3('exceptional zeros'))}}>
					<Text px={size.small} ink="mist">
						classical regions allow at most one exception per character, a simple real zero; the line at 11/12 excludes it
					</Text>
				</At>
			</div>

			{/* right: the size of a zero's wave */}
			<WaveSizes
				id="back"
				{...WAVES}
				axes={wave}
				band={{lo: 0.5, hi: ELEVEN, p: ceiling * (1 - q1)}}
				deficit={{main: 1, shift, bound: ELEVEN, p: q1}}
				waves={[
					{exp: 0.5, ink: 'mist', p: ceiling, dash: '8 8', width: stroke.line, label: 'x^{1/2}'},
					{exp: ELEVEN, ink: 'gilt', p: ceiling, label: 'x^{11/12}'},
					{exp: 1, shift, ink: 'paper', p: wave, label: mainTex},
					{exp: beta, ink: 'ember', p: wave * (1 - ceiling), width: stroke.line, label: keep > 0.5 ? undefined : 'x^{\\beta}'},
				]}
			/>
			<At x={WAVES.x + 24} y={WAVES.y + 4} style={{opacity: q1, whiteSpace: 'nowrap'}}>
				<Tex tex={`q=${q}`} px={size.label} display={false} />
				<Text px={size.small} ink="ember" p={notLast} style={{marginTop: 8, width: 300, whiteSpace: 'normal'}}>
					the bound exceeds the count
				</Text>
			</At>
			<At x={WAVES.x + 24} y={WAVES.y + 4} style={{opacity: window(f, c2('Keep every real part'), c3('large moduli')), width: 300}}>
				<Text px={size.small} ink="mist">
					waves of zeros with ½ ≤ β ≤ 11/12 lie in the shaded fan
				</Text>
			</At>
			<At x={WAVES.x} y={WAVES.y + WAVES.h + 54} style={{opacity: wave, display: 'flex', gap: 20, alignItems: 'baseline'}}>
				<Tag kind="schematic" />
				<Text px={size.small} ink="mist">
					log–log; constants and logarithms omitted
				</Text>
			</At>

			<SceneLocator />
			<Cite p={progress(f, c2('Keep every real part')) * (1 - siegel)}>October manuscript, Corollary 1.2</Cite>
			<Cite p={siegel}>October manuscript, §1.1</Cite>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'back-transfer': BackTransfer,
	'back-count': BackCount,
};
