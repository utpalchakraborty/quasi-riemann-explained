import type React from 'react';
import numerics from '../data/numerics.json';
import {useCues} from '../cues';
import {lerp, progress} from '../design/motion';
import {Cite, Tag, Text} from '../design/primitives';
import {At, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, font, size, space, stroke} from '../design/tokens';
import {PRIMES, PrimeCount, PrimeError} from '../diagrams/PrimeCount';
import {SignMarks} from '../diagrams/SignMarks';
import {StripMap} from '../diagrams/StripMap';

// Chapter: Why zeros know about primes. Scenes are added here and listed in `scenes` by scene id.

// The Euler product, expanded: one geometric series per prime, as many terms as fit.
const FACTORS = [
	{p: 2, top: 4},
	{p: 3, top: 3},
	{p: 5, top: 2},
	{p: 7, top: 2},
];
const termTex = (p: number, k: number) => (k === 0 ? '1' : `${p ** k}^{-s}`);
const factorTex = ({p, top}: {p: number; top: number}) =>
	'\\Big(' + Array.from({length: top + 1}, (_, k) => `\\htmlClass{t${p}x${k}}{${termTex(p, k)}}`).join('+') + '+\\cdots\\Big)';

// The exponent of each listed prime in n; n must factor over the listed primes.
const exponents = (n: number): number[] => {
	let m = n;
	const e = FACTORS.map(({p, top}) => {
		let k = 0;
		while (m % p === 0) {
			m /= p;
			k++;
		}
		if (k > top) throw new Error(`${n}: ${p}^${k} is not in the expansion`);
		return k;
	});
	if (m !== 1) throw new Error(`${n} has a prime factor beyond the expansion`);
	return e;
};

// Each example picks one term from every factor; the product of the picks is n^{-s}.
const EXAMPLES = [12, 30, 20].map((n) => {
	const e = exponents(n);
	const picks = FACTORS.map((f, i) => `t${f.p}x${e[i]}`);
	const used = FACTORS.map((f, i) => ({p: f.p, k: e[i]})).filter((t) => t.k > 0);
	const tex = used.map((t) => `\\verd{${termTex(t.p, t.k)}}`).join('\\cdot') + `\\;=\\;\\verd{${n}}^{-s}`;
	return {n, picks, tex};
});

const ROW = {x: 196, y: 848, cell: 52, count: 30};

// The opening question: computed zeros of zeta on one side, the primes on the other.
const Q_ZEROS = (numerics.zeta_zero_heights as number[]).filter((t) => t < 50);
const Q_PRIMES = PRIMES.slice(0, 15);
const Q = {lineX: 470, top: 450, bottom: 800, tMax: 50, gridX: 1060, gridY: 500, dx: 110, dy: 92};

export const PrimesEuler: React.FC = () => {
	const {frame: f, cue} = useCues();
	const sum = progress(f, cue('primes-1', 'For sigma'));
	const prod = progress(f, cue('primes-1', 'product over all primes'));
	const expand = cue('primes-1', 'Expand the product');
	// The expansion stays at full strength until the narration names it the bridge.
	const rowsOut = 1 - progress(f, cue('primes-2', 'is the bridge'), beat * 1.5, ease.inOut);
	const at = [cue('primes-1', 'appears exactly once'), cue('primes-1', 'because every'), cue('primes-1', 'factors into primes')];
	const wave = cue('primes-1', 'exactly one way');
	const ex = EXAMPLES.map((_, i) => progress(f, at[i], beat * 0.6) * (1 - progress(f, i < at.length - 1 ? at[i + 1] : wave + beat, beat * 0.4)));
	const allTerms = FACTORS.flatMap(({p, top}) => Array.from({length: top + 1}, (_, k) => `t${p}x${k}`));
	const lightTerms: Record<string, {ink: 'verdigris'; p: number}> = {};
	const showTerms: Record<string, number> = {};
	const focus = Math.max(...ex);
	for (const cls of allTerms) {
		const lit = Math.max(0, ...EXAMPLES.map((e, i) => (e.picks.includes(cls) ? ex[i] : 0)));
		lightTerms[cls] = {ink: 'verdigris', p: lit};
		showTerms[cls] = 1 - 0.45 * focus + 0.45 * lit;
	}
	// The integers: an example lights its own n; on "exactly one way" every n develops.
	const question = 1 - progress(f, expand - beat, beat, ease.inOut);
	const qPrimes = progress(f, 14, beat * 2);
	const qBridge = progress(f, cue('primes-1', 'know anything'), beat * 3, ease.inOut);
	const plot = cue('primes-2', 'The zeros of zeta');
	const gap = cue('primes-2', 'how far the zeros');
	const accurate = cue('primes-2', 'controls how accurately');
	return (
		<>
			<SceneTitle p={progress(f, 4)}>A sum and a product</SceneTitle>
			<At x={space.margin} y={196}>
				<Tex
					px={size.math}
					tex={
						'\\htmlClass{cond}{\\mist{\\sigma>1:}\\qquad}\\htmlClass{sum}{\\zeta(s)=\\sum_{n\\ge1}\\frac{1}{n^{s}}}\\htmlClass{prod}{\\;=\\;\\prod_{\\verd{p}}\\Big(1-\\frac{1}{\\verd{p}^{s}}\\Big)^{-1}}'
					}
					show={{sum, prod, cond: sum}}
				/>
			</At>
			{/* the question: why should these know about those? */}
			<div style={{opacity: question}}>
				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
					<line x1={Q.lineX} x2={Q.lineX} y1={Q.top} y2={Q.bottom} stroke={color.mist} strokeWidth={stroke.hair} strokeDasharray="6 10" opacity={progress(f, 6)} />
					{Q_ZEROS.map((t, i) => (
						<circle key={t} cx={Q.lineX} cy={Q.bottom - (t / Q.tMax) * (Q.bottom - Q.top)} r={7} fill={color.paper} opacity={progress(f, 6 + i * 2, beat)} />
					))}
					<line x1={Q.lineX + 90} x2={Q.lineX + 90 + (Q.gridX - Q.lineX - 150) * qBridge} y1={625} y2={625} stroke={alpha('mist', 0.6)} strokeWidth={stroke.hair} strokeDasharray="4 8" />
				</svg>
				<At x={Q.lineX - 160} y={Q.bottom + 20} w={320} style={{textAlign: 'center', opacity: progress(f, 6)}}>
					<Text px={size.small} ink="mist">
						zeros of ζ, computed
					</Text>
				</At>
				{Q_PRIMES.map((q, i) => (
					<At key={q} x={Q.gridX + (i % 5) * Q.dx} y={Q.gridY + Math.floor(i / 5) * Q.dy} w={80} style={{textAlign: 'center', opacity: progress(f, 14 + i * 1.5)}}>
						<Text px={size.lead} ink="verdigris">
							{q}
						</Text>
					</At>
				))}
				<At x={Q.gridX} y={Q.bottom + 20} w={5 * Q.dx} style={{textAlign: 'center', opacity: qPrimes}}>
					<Text px={size.small} ink="mist">
						the primes
					</Text>
				</At>
			</div>
			<At x={space.margin} y={392} style={{opacity: progress(f, cue('primes-2', 'Euler’s product')) }}>
				<Text px={size.label} ink="mist" italic>
					Euler’s product: whole numbers on one side, primes on the other
				</Text>
			</At>

			{/* primes-1: the product, expanded */}
			<div style={{opacity: rowsOut}}>
				{FACTORS.map((fac, i) => (
					<At key={fac.p} x={space.margin} y={420 + i * 82} style={{display: 'flex', alignItems: 'center', gap: 18, opacity: progress(f, expand + i * beat * 0.5)}}>
						<div style={{width: 40, textAlign: 'center'}}>{i > 0 && <Tex tex={'\\times'} px={size.lead} ink="mist" display={false} />}</div>
						<Tex tex={factorTex(fac)} px={size.lead} display={false} light={lightTerms} show={showTerms} />
					</At>
				))}
				<At x={space.margin} y={420 + FACTORS.length * 82} style={{display: 'flex', alignItems: 'center', gap: 18, opacity: progress(f, expand + FACTORS.length * beat * 0.5)}}>
					<div style={{width: 40, textAlign: 'center'}}>
						<Tex tex={'\\times'} px={size.lead} ink="mist" display={false} />
					</div>
					<Tex tex={'\\cdots'} px={size.lead} ink="mist" display={false} />
				</At>
				{EXAMPLES.map((e, i) => (
					<At key={e.n} x={1180} y={560} style={{opacity: ex[i]}}>
						<Tex tex={e.tex} px={size.math} display={false} />
						<Text px={size.label} ink="mist" style={{marginTop: 18}}>
							one term from each factor
						</Text>
					</At>
				))}
				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
					<line
						x1={ROW.x - ROW.cell * 0.5}
						x2={ROW.x + ROW.cell * (ROW.count - 0.5)}
						y1={ROW.y - 22}
						y2={ROW.y - 22}
						stroke={alpha('mist', 0.35)}
						strokeWidth={stroke.hair}
						opacity={progress(f, cue('primes-1', 'every whole number'))}
					/>
				</svg>
				{Array.from({length: ROW.count}, (_, i) => {
					const n = i + 1;
					const k = EXAMPLES.findIndex((e) => e.n === n);
					const lit = k >= 0 ? progress(f, at[k], beat * 0.6) : 0;
					const all = progress(f, wave + i * 1.2, beat);
					return (
						<div
							key={n}
							style={{
								position: 'absolute',
								left: ROW.x + ROW.cell * i - 30,
								top: ROW.y,
								width: 60,
								textAlign: 'center',
								fontFamily: font.text,
								fontSize: size.label,
								fontVariantNumeric: 'tabular-nums',
								color: lit > 0 ? color.verdigris : all > 0.5 ? color.paper : color.mist,
								opacity: progress(f, cue('primes-1', 'every whole number') + i * 0.6) * (0.55 + 0.45 * Math.max(lit, all)),
								transform: `scale(${1 + 0.35 * (k >= 0 ? ex[k] : 0)})`,
							}}
						>
							{n}
						</div>
					);
				})}
			</div>

			{/* primes-2: the bridge, made visible as the prime count */}
			<PrimeCount
				x={250}
				y={490}
				w={880}
				h={360}
				axes={progress(f, plot - beat)}
				li={progress(f, plot, beat * 3, ease.inOut)}
				pi={progress(f, plot + beat, beat * 5, ease.inOut)}
				gap={progress(f, gap, beat * 2)}
			/>
			<At x={1250} y={490} style={{opacity: progress(f, plot)}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 16}}>
					<svg width={44} height={10}>
						<line x1={0} x2={44} y1={5} y2={5} stroke={color.verdigris} strokeWidth={stroke.line} />
					</svg>
					<Tex tex={'\\pi(x)'} px={size.label + 4} display={false} />
					<Text px={size.label} ink="mist">
						primes up to x
					</Text>
				</div>
				<div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 14}}>
					<svg width={44} height={10}>
						<line x1={0} x2={44} y1={5} y2={5} stroke={color.mist} strokeWidth={stroke.line} strokeDasharray="10 8" />
					</svg>
					<Tex tex={'\\operatorname{Li}(x)=\\int_2^x\\frac{dt}{\\log t}'} px={size.label + 4} display={false} />
				</div>
			</At>
			<At x={1250} y={620} w={540} style={{opacity: progress(f, gap)}}>
				<Text px={size.label} ink="mist">
					If no zero lies to the right of θ:
				</Text>
				<div style={{marginTop: 10}}>
					<Tex tex={'|\\ember{\\pi(x)-\\operatorname{Li}(x)}|\\ll x^{\\theta}\\log x'} px={size.label + 6} display={false} />
				</div>
			</At>
			<PrimeError x={1300} y={790} w={460} h={100} axes={progress(f, accurate - beat)} p={progress(f, accurate, beat * 4, ease.inOut)} />
			<At x={1300} y={744} style={{opacity: progress(f, accurate)}}>
				<Tex tex={'\\ember{\\pi(x)-\\operatorname{Li}(x)}'} px={size.small} display={false} />
			</At>
			<Tag kind="computed" p={progress(f, plot + beat * 3)} style={{position: 'absolute', left: 250, top: 444}} />
			<SceneLocator />
		</>
	);
};

// The character modulo 4: +1 on 1 mod 4, -1 on 3 mod 4, 0 on even numbers.
const CHI4 = Array.from({length: 24}, (_, i) => {
	const n = i + 1;
	return n % 2 === 0 ? 0 : n % 4 === 1 ? 1 : -1;
});
const MODULI = [
	{q: 1, tex: '\\zeta(s)', sub: 'q = 1'},
	{q: 3, tex: 'L(s,\\chi)', sub: 'q = 3'},
	{q: 4, tex: 'L(s,\\chi)', sub: 'q = 4'},
	{q: 5, tex: 'L(s,\\chi)', sub: 'q = 5'},
	{q: 7, tex: 'L(s,\\chi)', sub: 'q = 7'},
];
const SMALL = {x0: 200, dx: 318, y: 330, w: 250, h: 390};
const SMALL_SIGMA: [number, number] = [-0.04, 1.06];

export const PrimesCharacters: React.FC = () => {
	const {frame: f, cue} = useCues();
	const claim = cue('primes-3', 'claim their line');
	const top = 1 - progress(f, claim, beat * 1.5, ease.inOut);
	const each = cue('primes-3', 'every one of these');
	const same = cue('primes-3', 'the same line');
	const frontierX = (i: number) => SMALL.x0 + i * SMALL.dx + ((7 / 8 - SMALL_SIGMA[0]) / (SMALL_SIGMA[1] - SMALL_SIGMA[0])) * SMALL.w;
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Weighted by a character</SceneTitle>
			<div style={{opacity: top}}>
				<At x={space.margin} y={200} style={{opacity: progress(f, 8)}}>
					<Tex px={size.math} tex={'L(s,\\chi)=\\sum_{n\\ge1}\\frac{\\verd{\\chi(n)}}{n^{s}}'} />
				</At>
				<At x={980} y={206} style={{opacity: progress(f, cue('primes-3', 'modulo four'))}}>
					<Tex
						px={size.label + 6}
						tex={'\\verd{\\chi_4(n)}=\\begin{cases}+1 & n\\equiv 1 \\pmod 4\\\\ -1 & n\\equiv 3 \\pmod 4\\\\ \\ \\ 0 & n \\text{ even}\\end{cases}'}
					/>
				</At>
				<SignMarks
					x={230}
					y={630}
					values={CHI4}
					cell={62}
					lift={36}
					p={progress(f, cue('primes-3', 'arithmetic progressions'), beat * 3, ease.inOut)}
					show={{
						pos: progress(f, cue('primes-3', 'plus one')),
						neg: progress(f, cue('primes-3', 'minus one')),
						zero: progress(f, cue('primes-3', 'or zero')),
					}}
				/>
				<At x={space.margin} y={800} w={1200}>
					<Text px={size.label} ink="mist" p={progress(f, cue('primes-3', 'according to its remainder'))}>
						χ(n) for n = 1 to 24: the sign repeats with period 4
					</Text>
				</At>
			</div>

			{/* every modulus, one line */}
			{MODULI.map((m, i) => {
				const p = progress(f, each + i * beat * 0.5, beat * 1.5);
				return (
					<div key={m.q} style={{opacity: p}}>
						<StripMap
							id={`chars-${m.q}`}
							x={SMALL.x0 + i * SMALL.dx}
							y={SMALL.y}
							w={SMALL.w}
							h={SMALL.h}
							sigma={SMALL_SIGMA}
							t={[0, 50]}
							axisNames={false}
							frontiers={[{sigma: 7 / 8, ink: 'gilt', label: '\\tfrac78', p: progress(f, each + i * beat * 0.5 + beat, beat * 2), hatch: progress(f, each + i * beat * 0.5 + beat * 2, beat * 2)}]}
						/>
						<At x={SMALL.x0 + i * SMALL.dx} y={SMALL.y + SMALL.h + 78} w={SMALL.w} style={{textAlign: 'center'}}>
							<Tex tex={m.tex} px={size.label} display={false} />
							<Text px={size.small} ink="mist" style={{marginTop: 4}}>
								{m.sub}
							</Text>
						</At>
					</div>
				);
			})}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<line
					x1={frontierX(0)}
					x2={lerp(frontierX(0), frontierX(MODULI.length - 1), progress(f, same, beat * 2, ease.inOut))}
					y1={SMALL.y - 8}
					y2={SMALL.y - 8}
					stroke={color.gilt}
					strokeWidth={stroke.hair}
					strokeDasharray="6 8"
					opacity={progress(f, same)}
				/>
			</svg>
			<Tag kind="claim" p={progress(f, each + beat * 3)} style={{position: 'absolute', left: SMALL.x0 - 14, top: 880}} />
			<Cite p={progress(f, each + beat * 3)}>September manuscript, Theorem 1.1</Cite>
			<SceneLocator />
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'primes-euler': PrimesEuler,
	'primes-characters': PrimesCharacters,
};
