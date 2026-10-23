import React from 'react';
import numerics from '../data/numerics.json';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Tag, Text} from '../design/primitives';
import {At, Callout, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, font, size, space, stroke} from '../design/tokens';
import {MobiusWalk} from '../diagrams/MobiusWalk';
import {SignMarks} from '../diagrams/SignMarks';
import {StripMap} from '../diagrams/StripMap';

// Chapter: From zeros to cancellation. Scenes are added here and listed in `scenes` by scene id.

const MU = numerics.mobius as number[];
const MERTENS = numerics.mertens as number[];

// cancel-mobius: the three worked values, read off the computed Möbius table.
const STRIP = {x: 196, y: 760, cell: 44, count: 36};
const WORKED = [
	{n: 6, cue: 'Six gets', fact: '6=2\\cdot3', why: '(-1)^{2}=', mu: 1, align: 'right'},
	{n: 30, cue: 'thirty gets', fact: '30=2\\cdot3\\cdot5', why: '(-1)^{3}=', mu: -1, align: 'center'},
	{n: 12, cue: 'twelve gets', fact: '12=2^{2}\\cdot3', why: '', mu: 0, align: 'left'},
] as const;
for (const w of WORKED) if (MU[w.n - 1] !== w.mu) throw new Error(`mu(${w.n}) is ${MU[w.n - 1]}, not ${w.mu}`);

export const CancelMobius: React.FC = () => {
	const {frame: f, cue} = useCues();
	const zero = cue('cancel-1', 'It is zero');
	const other = cue('cancel-1', 'Otherwise');
	const at = WORKED.map((w) => cue('cancel-1', w.cue));
	const first = at[0];
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The Möbius signs</SceneTitle>
			<At x={space.margin} y={196} style={{opacity: progress(f, 8)}}>
				<Tex
					px={size.math}
					tex={'\\frac{1}{\\zeta(s)}=\\sum_{n\\ge1}\\frac{\\htmlClass{mu}{\\mu(n)}}{n^{s}}'}
					light={{mu: {ink: 'verdigris', p: progress(f, cue('cancel-1', 'supplies the signs'))}}}
				/>
			</At>
			<At x={720} y={214}>
				<Tex
					px={size.label + 6}
					tex={
						'\\mu(n)=\\begin{cases}\\htmlClass{z}{0} & \\htmlClass{z}{\\text{if } p^{2}\\mid n \\text{ for some prime } p,}\\\\[6pt] \\htmlClass{s}{(-1)^{k}} & \\htmlClass{s}{\\text{if } n=p_1p_2\\cdots p_k,\\ \\text{distinct primes.}}\\end{cases}'
					}
					show={{z: progress(f, zero), s: progress(f, other)}}
					style={{opacity: progress(f, cue('cancel-1', 'It is zero') - beat)}}
				/>
			</At>
			<SignMarks
				x={STRIP.x}
				y={STRIP.y}
				values={MU.slice(0, STRIP.count)}
				cell={STRIP.cell}
				lift={34}
				p={progress(f, cue('cancel-1', 'Möbius function'), beat * 3, ease.inOut)}
				show={{
					zero: progress(f, cue('cancel-1', 'divisible by a square'), beat * 2),
					pos: progress(f, cue('cancel-1', 'minus one raised'), beat * 2),
					neg: progress(f, cue('cancel-1', 'minus one raised'), beat * 2),
				}}
				highlight={WORKED.map((w) => w.n)}
				ring={(n) => progress(f, at[WORKED.findIndex((w) => w.n === n)])}
				dim={progress(f, first, beat * 2) * 0.8}
			/>
			<At x={space.margin} y={STRIP.y + 110} w={1300}>
				<Text px={size.label} ink="mist" p={progress(f, other + beat * 2)}>
					μ(n) for n = 1 to 36: filled above for +1, hollow below for −1, a tick for 0
				</Text>
			</At>
			{WORKED.map((w, i) => {
				const p = progress(f, at[i]);
				const cx = STRIP.x + STRIP.cell * (w.n - 1);
				const m = MU[w.n - 1];
				const markY = m === 0 ? STRIP.y - 12 : m > 0 ? STRIP.y - 34 - 18 : STRIP.y - 12;
				return (
					<React.Fragment key={w.n}>
						<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: p}}>
							<line x1={cx} x2={cx} y1={600} y2={markY} stroke={alpha('gilt', 0.7)} strokeWidth={stroke.hair} />
						</svg>
						<At
							x={w.align === 'right' ? cx - 400 : w.align === 'left' ? cx - 40 : cx - 220}
							y={480}
							w={w.align === 'center' ? 440 : 440}
							style={{textAlign: w.align, whiteSpace: 'nowrap', opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}
						>
							<Tex tex={w.fact} px={size.label + 6} display={false} />
							<div style={{marginTop: 8}}>
								<Tex tex={`\\mu(${w.n})=${w.why}\\verd{${w.mu > 0 ? '+1' : w.mu < 0 ? '-1' : '0'}}`} px={size.label + 2} display={false} />
							</div>
						</At>
					</React.Fragment>
				);
			})}
			<SceneLocator />
		</>
	);
};

// cancel-walk: the Mertens function, a band at its computed extremes, and the
// shapes of the bounds one would want to prove.
const WALK = {x: 250, y: 380, w: 1360, h: 450};
const ALPHA = 0.7; // illustrative exponent, labelled as such on screen
const M_MIN = Math.min(...MERTENS);
const M_MIN_AT = MERTENS.indexOf(M_MIN) + 1;
const BAND = Math.max(-M_MIN, Math.max(...MERTENS));

export const CancelWalk: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const here = cue('cancel-2', 'Here it is');
	const strays = cue('cancel-2', 'never strays');
	const fifteen = cue('cancel-2', 'fifteen');
	const third = start('cancel-3');
	const zoom = progress(f, cue('cancel-3', 'A bound like'), beat * 3, ease.inOut);
	const yMax = lerp(40, 170, zoom);
	const alphaP = progress(f, cue('cancel-3', 'x to the alpha'), beat * 3, ease.inOut);
	const trivialP = progress(f, cue('cancel-3', 'cancellation means'), beat * 2);
	const proof = cue('cancel-3', 'No picture');
	const px = (n: number) => WALK.x + (n / 1200) * WALK.w;
	const py = (v: number) => WALK.y + WALK.h / 2 - (v / yMax) * (WALK.h / 2);
	const curve = (g: (n: number) => number, sign: number, upto: number) => {
		let d = '';
		for (let i = 0; i <= 240 * upto; i++) {
			const n = (1200 * i) / 240;
			const v = Math.min(yMax * 1.05, g(n));
			d += `${i ? 'L' : 'M'}${px(n).toFixed(1)},${py(sign * v).toFixed(1)}`;
		}
		return d;
	};
	const ticksBefore = [-30, 30];
	const ticksAfter = [-150, -75, 75, 150];
	const minP = progress(f, fifteen);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The signs nearly cancel</SceneTitle>
			<At x={space.margin} y={190} style={{opacity: progress(f, 8)}}>
				<Tex px={size.math} tex={'M(x)=\\sum_{n\\le x}\\verd{\\mu(n)}'} />
			</At>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>
					<clipPath id="cancel-walk-clip">
						<rect x={WALK.x} y={WALK.y - 4} width={WALK.w} height={WALK.h + 8} />
					</clipPath>
				</defs>
				{ticksBefore.map((v) => (
					Math.abs(v) > yMax ? null : <line key={v} x1={WALK.x} x2={WALK.x + WALK.w} y1={py(v)} y2={py(v)} stroke={alpha('mist', 0.18)} strokeWidth={stroke.hair} opacity={1 - zoom} />
				))}
				{ticksAfter.map((v) => (
					Math.abs(v) > yMax ? null : <line key={v} x1={WALK.x} x2={WALK.x + WALK.w} y1={py(v)} y2={py(v)} stroke={alpha('mist', 0.18)} strokeWidth={stroke.hair} opacity={zoom} />
				))}
				{/* the band the computed walk stays inside */}
				<g opacity={progress(f, strays, beat * 2)}>
					<rect x={WALK.x} y={py(BAND)} width={WALK.w * progress(f, strays, beat * 3, ease.inOut)} height={py(-BAND) - py(BAND)} fill={alpha('mist', 0.08)} />
					{[BAND, -BAND].map((v) => (
						<line key={v} x1={WALK.x} x2={WALK.x + WALK.w * progress(f, strays, beat * 3, ease.inOut)} y1={py(v)} y2={py(v)} stroke={color.mist} strokeWidth={stroke.hair} strokeDasharray="6 8" />
					))}
				</g>
				<g clipPath="url(#cancel-walk-clip)">
					{trivialP > 0 && [1, -1].map((s) => <path key={s} d={curve((n) => n, s, 1)} fill="none" stroke={color.ember} strokeWidth={stroke.line} opacity={trivialP} />)}
					{alphaP > 0 && [1, -1].map((s) => <path key={s} d={curve((n) => Math.pow(n, ALPHA), s, alphaP)} fill="none" stroke={color.gilt} strokeWidth={stroke.line} strokeDasharray="12 8" />)}
				</g>
			</svg>
			<MobiusWalk
				x={WALK.x}
				y={WALK.y}
				w={WALK.w}
				h={WALK.h}
				upto={1200 * progress(f, here, beat * 9, ease.inOut)}
				yMax={yMax}
				yTicks={[0]}
			/>
			{[...ticksBefore.map((v) => ({v, o: 1 - zoom})), ...ticksAfter.map((v) => ({v, o: zoom}))].map(({v, o}) => (
				Math.abs(v) > yMax ? null :
				<div
					key={v}
					style={{
						position: 'absolute',
						right: 1920 - WALK.x + 20,
						top: py(v) - size.small * 0.68,
						fontFamily: font.text,
						fontSize: size.small,
						color: color.mist,
						opacity: o,
						fontVariantNumeric: 'tabular-nums',
					}}
				>
					{v > 0 ? `+${v}` : `−${-v}`}
				</div>
			))}
			<At x={WALK.x + WALK.w + 18} y={py(BAND) - 20} style={{opacity: progress(f, fifteen)}}>
				<Tex tex={`\\pm${BAND}`} px={size.label} ink="mist" display={false} />
			</At>
			<Callout x={px(M_MIN_AT) - 200} y={py(M_MIN) + 70} to={[px(M_MIN_AT), py(M_MIN) + 4]} align="right" width={320} p={minP * (1 - zoom)}>
				<Tex tex={`M(${M_MIN_AT})=${M_MIN}`} px={size.label} ink="mist" display={false} />
			</Callout>
			<At x={820} y={196} w={960} style={{opacity: window(f, fifteen, third + beat)}}>
				<Tex tex={`|M(x)|\\le ${BAND}\\quad\\text{for every } x\\le 1200`} px={size.label + 10} display={false} />
				<Text px={size.label} ink="mist" style={{marginTop: 6}}>
					1,200 signs, and their total stays within {BAND} of zero
				</Text>
			</At>

			{/* cancel-3: what a bound would say */}
			<At x={px(1200) + 18} y={py(Math.pow(1200, ALPHA)) - 26} style={{opacity: alphaP}}>
				<Tex tex={'x^{\\alpha}'} px={size.label + 4} ink="gilt" display={false} />
			</At>
			<At x={820} y={196} w={960} style={{opacity: progress(f, cue('cancel-3', 'alpha less than one')) * (1 - progress(f, proof - beat))}}>
				<Tex tex={'|M(x)|\\le C\\,x^{\\gilt{\\alpha}},\\qquad \\alpha<1'} px={size.math * 0.8} display={false} />
				<Text px={size.label} ink="mist" style={{marginTop: 8}}>
					drawn with α = {ALPHA}, for illustration
				</Text>
			</At>
			<At x={px(Math.min(1200, yMax)) + 14} y={WALK.y - 6} style={{opacity: trivialP}}>
				<Tex tex={'\\pm x\\ \\ \\text{the trivial bound}'} px={size.label} ink="ember" display={false} />
			</At>
			<At x={820} y={196} w={960} style={{opacity: progress(f, proof)}}>
				<Text px={size.body}>No picture can prove a bound.</Text>
				<Text px={size.label} ink="mist" style={{marginTop: 6}}>
					A plot checks finitely many x; a bound must hold for all of them.
				</Text>
			</At>
			<Tag kind="computed" p={progress(f, cue('cancel-2', 'computed'))} style={{position: 'absolute', left: WALK.x, top: WALK.y + WALK.h + 56}} />
			<SceneLocator />
		</>
	);
};

// cancel-bridge: 1/zeta as an integral of M; cancellation keeps it holomorphic,
// so a zero, which would be a pole, cannot exist there.
const BRIDGE = {x: 1220, y: 250, w: 540, h: 570};
const B_SIGMA: [number, number] = [-0.04, 1.3];
const B_ALPHA = 0.78;
const bx = (s: number) => BRIDGE.x + ((s - B_SIGMA[0]) / (B_SIGMA[1] - B_SIGMA[0])) * BRIDGE.w;
const RHO = {x: bx(0.93), y: BRIDGE.y + BRIDGE.h * 0.36};

export const CancelBridge: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const integral = cue('cancel-4', 'Partial summation');
	const hyp = cue('cancel-4', 'If M of x');
	const conv = cue('cancel-4', 'the integral converges');
	const holo = cue('cancel-4', 'holomorphic there');
	const zero = cue('cancel-5', 'A zero of zeta');
	const pole = cue('cancel-5', 'pole of one over');
	const both = cue('cancel-5', 'cannot be both');
	const idea = cue('cancel-5', 'the whole idea');
	const earn = cue('cancel-5', 'earning the cancellation');
	const sweep = progress(f, conv, beat * 3, ease.inOut);
	const front = lerp(B_SIGMA[1], B_ALPHA, sweep);
	const strike = progress(f, both, beat * 1.5);
	const pulse = window(f, pole, both + beat) * (1 + 0.18 * Math.sin((f - pole) / 3.2));
	const rhoOp = progress(f, zero) * (1 - 0.6 * progress(f, both + beat, beat * 2));
	return (
		<>
			<SceneTitle p={progress(f, 4)}>From cancellation to no zeros</SceneTitle>
			<At x={space.margin} y={200} style={{opacity: progress(f, integral)}}>
				<Tex
					px={size.math}
					tex={'\\frac{1}{\\zeta(s)}=s\\int_{1}^{\\infty}\\htmlClass{M}{M(x)}\\,\\htmlClass{pw}{x^{-s-1}}\\,dx'}
					light={{M: {ink: 'verdigris', p: progress(f, cue('cancel-4', 'M of x'))}}}
				/>
			</At>
			<At x={space.margin} y={372} style={{opacity: progress(f, integral + beat * 2)}}>
				<Text px={size.small} ink="mist">
					partial summation, valid for σ &gt; 1
				</Text>
			</At>
			{[
				{y: 432, at: hyp, tex: '\\htmlClass{hyp}{|M(x)|\\ll x^{\\alpha}}'},
				{y: 502, at: conv, tex: '\\Longrightarrow\\ \\ \\text{the integral converges for } \\sigma>\\alpha'},
				{y: 572, at: holo, tex: '\\Longrightarrow\\ \\ 1/\\zeta(s)\\ \\text{is holomorphic there: no poles}'},
				{y: 672, at: zero, tex: '\\ember{\\zeta(\\rho)=0}\\htmlClass{pole}{\\ \\ \\Longrightarrow\\ \\ 1/\\zeta\\ \\text{has a pole at } \\ember{\\rho}}'},
				{y: 762, at: idea, tex: '\\text{so}\\ \\ \\zeta(s)\\neq0\\ \\ \\text{for } \\sigma>\\alpha'},
			].map((l) => (
				<At key={l.y} x={space.margin} y={l.y} style={{opacity: progress(f, l.at)}}>
					<Tex
						px={size.label + 10}
						display={false}
						tex={l.tex}
						show={{pole: progress(f, pole)}}
						light={{hyp: {ink: 'gilt', p: progress(f, earn)}}}
					/>
				</At>
			))}
			<At x={space.margin} y={846} w={900} style={{opacity: progress(f, earn)}}>
				<Text px={size.label} ink="gilt">
					The rest of the proof earns the bound on M.
				</Text>
			</At>

			<StripMap
				id="bridge"
				{...BRIDGE}
				sigma={B_SIGMA}
				t={[0, 60]}
				axes={progress(f, cue('cancel-4', 'the bridge'))}
				strip={progress(f, cue('cancel-4', 'the bridge'))}
				criticalLine={progress(f, cue('cancel-4', 'the bridge'))}
				sigmaTicks={[
					{sigma: 0, tex: '0'},
					{sigma: 0.5, tex: '\\tfrac12'},
					{sigma: 1, tex: '1'},
				]}
				frontiers={[{sigma: front, ink: 'gilt', label: sweep > 0.98 ? '\\alpha' : undefined, p: progress(f, conv - beat)}]}
			/>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>
					<pattern id="bridge-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
						<line x1="0" y1="0" x2="0" y2="14" stroke={color.gilt} strokeWidth="2" />
					</pattern>
				</defs>
				<rect x={bx(front)} y={BRIDGE.y} width={Math.max(0, BRIDGE.x + BRIDGE.w - bx(front))} height={BRIDGE.h} fill="url(#bridge-hatch)" opacity={0.28 * progress(f, conv)} />
				{/* the supposed zero, its pole, and the strike */}
				<g opacity={rhoOp}>
					<circle cx={RHO.x} cy={RHO.y} r={30 * pulse} fill={alpha('ember', 0.16)} stroke={color.ember} strokeWidth={stroke.line} opacity={pulse > 0 ? 1 : 0} />
					<circle cx={RHO.x} cy={RHO.y} r={52 * pulse} fill="none" stroke={alpha('ember', 0.5)} strokeWidth={stroke.hair} opacity={pulse > 0 ? 1 : 0} />
					<circle cx={RHO.x} cy={RHO.y} r={9} fill={color.ember} />
				</g>
				{strike > 0 &&
					[
						[-1, -1],
						[1, -1],
					].map(([sx, sy], i) => {
						const k = Math.max(0, Math.min(1, strike * 2 - i));
						const r = 34;
						return <line key={i} x1={RHO.x + sx * r} y1={RHO.y + sy * r} x2={RHO.x + sx * r - sx * 2 * r * k} y2={RHO.y + sy * r + 2 * r * k} stroke={color.ember} strokeWidth={stroke.bold} strokeLinecap="round" />;
					})}
			</svg>
			<Callout x={bx(0.5) + 70} y={RHO.y - 70} to={[RHO.x - 12, RHO.y - 8]} ink="ember" align="right" width={300} p={progress(f, zero) * (1 - progress(f, both + beat, beat * 2))}>
				a supposed zero ρ
			</Callout>
			<div
				style={{
					position: 'absolute',
					left: (bx(B_ALPHA) + BRIDGE.x + BRIDGE.w) / 2,
					top: BRIDGE.y + BRIDGE.h * 0.72,
					transform: 'translate(-50%, -50%) rotate(-90deg)',
					whiteSpace: 'nowrap',
					fontFamily: font.text,
					fontSize: size.label,
					color: color.paper,
					opacity: progress(f, holo),
				}}
			>
				1/ζ holomorphic
			</div>
			<Tag kind="schematic" p={progress(f, conv)} style={{position: 'absolute', left: BRIDGE.x, top: BRIDGE.y + BRIDGE.h + 62}} />
			<SceneLocator />
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'cancel-mobius': CancelMobius,
	'cancel-walk': CancelWalk,
	'cancel-bridge': CancelBridge,
};
