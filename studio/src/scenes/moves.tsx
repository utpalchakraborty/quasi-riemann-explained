import React from 'react';
import {useCues} from '../cues';
import {progress, window} from '../design/motion';
import {Display, Fraction, Tag, Text} from '../design/primitives';
import {At, Callout, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, size, space, stroke} from '../design/tokens';
import {Family} from '../diagrams/Family';
import {PhaseWheel} from '../diagrams/PhaseWheel';
import {ProofMap} from '../diagrams/ProofMap';
import {Signs} from '../diagrams/Signs';
import {StripMap} from '../diagrams/StripMap';

const stagger = (f: number, at: number, n: number, gap = beat * 0.6) => Array.from({length: n}, (_, i) => progress(f, at + i * gap));

export const MovesMap: React.FC = () => {
	const {frame: f, cue} = useCues();
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The proof in four moves</SceneTitle>
			<ProofMap
				main={stagger(f, cue('moves-1', 'four moves'), 4)}
				engine={stagger(f, cue('moves-1', 'engine underneath'), 5, beat * 0.3)}
				terminal={progress(f, cue('moves-1', 'eleven twelfths proof'))}
				branch={progress(f, cue('moves-1', 'seven eighths proof'), beat * 2)}
			/>
		</>
	);
};

// Move 1: a zero of L is a pole of 1/L; cancellation keeps 1/L holomorphic.
export const MoveOne: React.FC = () => {
	const {frame: f, cue} = useCues();
	const region = cue('moves-2', 'cancel strongly');
	const zero = cue('moves-2', 'a zero of L');
	const blow = cue('moves-2', 'blow up');
	const none = cue('moves-2', 'no zeros');
	const MAP = {x: 1120, y: 230, w: 600, h: 620};
	const sx = (s: number) => MAP.x + ((s + 0.04) / 1.1) * MAP.w;
	const rho = {x: sx(0.94), y: MAP.y + MAP.h * 0.42};
	const pole = window(f, blow, none + beat * 2) * (1 + 0.15 * Math.sin((f - blow) / 3));
	return (
		<>
			<SceneTitle numeral="1" p={progress(f, 4)}>
				A zero would force a pole
			</SceneTitle>
			<At x={space.margin} y={250} w={860} style={{opacity: window(f, cue('moves-2', 'question about zeros'), cue('moves-2', 'one over the L-function') - beat)}}>
				<Text px={size.lead}>
					a question about zeros{' '}
					<span style={{color: color.mist}}>becomes</span> a question about cancellation
				</Text>
			</At>
			<At x={space.margin} y={230} style={{opacity: progress(f, cue('moves-2', 'one over the L-function'))}}>
				<Tex px={size.math} tex={'\\frac{1}{\\zeta(s)}=\\sum_{n\\ge1}\\frac{\\verd{\\mu(n)}}{n^{s}}'} />
			</At>
			<Signs x={space.margin + 20} y={640} count={30} cell={29} p={progress(f, cue('moves-2', 'Möbius signs'), beat * 4, ease.inOut)} lift={34} labelEvery={5} />
			<At x={space.margin} y={760} w={860}>
				<Text px={size.label} ink="mist" p={progress(f, cue('moves-2', 'plus one'))}>
					μ(n) for n = 1 to 30: filled above for +1, hollow below for −1, a tick for 0
				</Text>
			</At>
			<StripMap
				id="move1"
				{...MAP}
				sigma={[-0.04, 1.06]}
				t={[0, 60]}
				axes={progress(f, region - beat * 2)}
				strip={progress(f, region - beat * 2)}
				criticalLine={progress(f, region - beat * 2)}
				frontiers={[{sigma: 0.8, ink: 'gilt', label: '\\alpha', p: progress(f, region, beat * 2), hatch: progress(f, cue('moves-2', 'wider region'), beat * 2)}]}
			/>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={progress(f, zero) * (1 - progress(f, none + beat * 2, beat * 2))}>
					<circle cx={rho.x} cy={rho.y} r={34 * pole} fill={alpha('ember', 0.18)} stroke={color.ember} strokeWidth={stroke.line} />
					<circle cx={rho.x} cy={rho.y} r={9} fill={color.ember} />
				</g>
			</svg>
			<Callout x={MAP.x - 60} y={rho.y - 120} to={[rho.x - 14, rho.y - 6]} ink="ember" align="right" width={440} p={progress(f, blow) * (1 - progress(f, none + beat * 2, beat * 2))}>
				a zero of L at ρ is a pole of 1/L
			</Callout>
		</>
	);
};

// Move 2: the target as one row in a family of twisted sums, under a budget.
const FAMILY = {x: 900, y: 860, w: 860, h: 300, rows: 44};

export const MoveTwo: React.FC = () => {
	const {frame: f, cue} = useCues();
	const twist = cue('moves-3', 'a twist');
	return (
		<>
			<SceneTitle numeral="2" p={progress(f, 4)}>
				Hide the target in a family
			</SceneTitle>
			<At x={space.margin} y={240} style={{opacity: progress(f, cue('moves-3', 'target sum'))}}>
				<Tex
					px={size.math * 0.92}
					tex={'A_{\\htmlClass{u}{u}}(D)=\\sum_{\\nn}\\mu(\\nn)\\,\\nu(\\nn)\\,\\htmlClass{chi}{\\chi_{\\nn}(u)}\\,W\\!\\left(\\tfrac{\\N\\nn}{D}\\right)'}
					light={{chi: {ink: 'verdigris', p: progress(f, twist)}, u: {ink: 'verdigris', p: progress(f, cue('moves-3', 'new parameter'))}}}
				/>
			</At>
			<PhaseWheel cx={420} cy={640} r={150} angle={f / 40} p={progress(f, cue('moves-3', 'six-fold symmetry'))} lit={[Math.round(f / 40) % 6]} />
			<At x={space.margin} y={850} w={620}>
				<Text px={size.label} ink="mist" p={progress(f, twist)}>
					The twist takes values among the six sixth roots of one.
				</Text>
			</At>
			<Family
				{...FAMILY}
				p={progress(f, cue('moves-3', 'inside a family'), beat * 4, ease.inOut)}
				targetLit={progress(f, cue('moves-3', 'u equal to one'))}
				labelTarget="u = 1"
				budget={0.75}
				budgetP={progress(f, cue('moves-3', 'energy budget'))}
			/>
			<At x={FAMILY.x} y={FAMILY.y - FAMILY.h * 0.75 - 50} style={{opacity: progress(f, cue('moves-3', 'add up the squares'))}}>
				<Tex px={size.label + 4} display={false} tex={'\\textstyle\\sum_u |A_u(D)|^2\\ \\text{stays within budget}'} />
			</At>
			<Tag kind="schematic" p={progress(f, cue('moves-3', 'inside a family') + beat * 3)} style={{position: 'absolute', left: FAMILY.x + FAMILY.w - 250, top: FAMILY.y + 24}} />
		</>
	);
};

const COPIES = [6, 13, 19, 26, 31, 37, 42];

// Move 3: sixth powers of primes give rows that nearly repeat the target.
export const MoveThree: React.FC = () => {
	const {frame: f, cue} = useCues();
	const sixth = cue('moves-4', 'sixth power');
	const spin = progress(f, sixth, beat * 5, ease.inOut);
	const one = progress(f, cue('moves-4', 'nearly equals'));
	const many = progress(f, cue('moves-4', 'many such primes'), beat * 3);
	return (
		<>
			<SceneTitle numeral="3" p={progress(f, 4)}>
				Sixth powers make copies
			</SceneTitle>
			<At x={space.margin} y={240} style={{opacity: progress(f, sixth)}}>
				<Tex px={size.math} tex={'\\chi_{\\nn}(p^{6})=\\chi_{\\nn}(p)^{6}=\\verd{1}\\qquad(p\\nmid \\nn)'} />
			</At>
			<PhaseWheel cx={420} cy={640} r={150} angle={1 + spin * 5} p={1} lit={[spin >= 1 ? 0 : Math.floor(1 + spin * 5) % 6]} />
			<At x={space.margin} y={850} w={620}>
				<Text px={size.label} ink="mist" p={progress(f, cue('moves-4', 'almost disappears'))}>
					Six steps of a sixth of a turn bring every phase back to one.
				</Text>
			</At>
			<Family {...FAMILY} copies={COPIES.slice(0, 1 + Math.floor(many * (COPIES.length - 1)))} copiesLit={one} budget={0.75} labelTarget="u = 1" />
			<At x={FAMILY.x} y={FAMILY.y - FAMILY.h * 0.75 - 50} style={{opacity: progress(f, cue('moves-4', 'many times'))}}>
				<Text px={size.label} ink="gilt">
					rows u = p⁶: the target, nearly repeated
				</Text>
			</At>
			<Tag kind="schematic" style={{position: 'absolute', left: FAMILY.x + FAMILY.w - 250, top: FAMILY.y + 24}} />
		</>
	);
};

// Move 4: too many large copies would overspend; the count gives 11/12.
export const MoveFour: React.FC = () => {
	const {frame: f, cue} = useCues();
	const large = progress(f, cue('moves-5', 'target were large'), beat * 3);
	const over = progress(f, cue('moves-5', 'overspend the budget'), beat * 2);
	const settle = progress(f, cue('moves-5', 'Count the copies'), beat * 3);
	const h = 0.45 + 0.5 * large * (1 - settle);
	const eleven = cue('moves-5', 'eleven twelfths');
	const steps = [
		{at: cue('moves-5', 'Count the copies'), label: 'count', tex: 'J\\approx Y/\\log Y'},
		{at: cue('moves-5', 'divide the budget'), label: 'divide', tex: '|A_1|^2\\lesssim DH/J'},
		{at: cue('moves-5', 'square root'), label: 'take a root', tex: '|A_1|\\lesssim D^{\\gilt{11/12}+\\varepsilon}'},
	];
	return (
		<>
			<SceneTitle numeral="4" p={progress(f, 4)}>
				Count, divide, take a root
			</SceneTitle>
			<Family
				x={space.margin}
				y={860}
				w={760}
				h={300}
				rows={44}
				target={h}
				copies={COPIES}
				copiesLit={1}
				budget={0.75}
				over={over * (1 - settle)}
				labelTarget="u = 1"
			/>
			<At x={space.margin} y={430} w={760} style={{opacity: over * (1 - settle)}}>
				<Text px={size.label} ink="ember">
					Large copies would spend more than the budget allows.
				</Text>
			</At>
			<At x={1000} y={230} style={{display: 'flex', flexDirection: 'column', gap: 30}}>
				{steps.map((s) => (
					<div key={s.label} style={{display: 'grid', gridTemplateColumns: '190px auto', alignItems: 'center', opacity: progress(f, s.at)}}>
						<Text px={size.label} ink="mist">
							{s.label}
						</Text>
						<Tex px={size.math * 0.85} display={false} tex={s.tex} />
					</div>
				))}
			</At>
			<At x={1000} y={540} w={260} style={{textAlign: 'center'}}>
				<Fraction n="11" d="12" px={150} p={progress(f, eleven)} />
			</At>
			<At x={1300} y={640} w={460} style={{opacity: progress(f, cue('moves-5', 'no zero survives'))}}>
				<Text px={size.label} ink="mist">
					With move 1: no zero to the right of 11/12.
				</Text>
			</At>
			<Tag kind="schematic" style={{position: 'absolute', left: space.margin + 510, top: 884}} />
		</>
	);
};

export const MovesEngine: React.FC = () => {
	const {frame: f, cue} = useCues();
	const order = ['Poisson summation', 'cubic Gauss sums', 'a theta function', 'a large sieve', 'a recursion'];
	const at = order.map((w) => cue('moves-6', w));
	let current: number[] = [];
	if (f >= cue('moves-6', 'energy budget')) current = [1];
	at.forEach((a, i) => {
		if (f >= a) current = [10 + i];
	});
	const branch = cue('moves-7', 'second route');
	if (f >= branch) current = [21];
	const dim = progress(f, cue('moves-6', 'energy budget')) * (1 - progress(f, cue('moves-7', 'one at a time'), beat * 2));
	return (
		<>
			<SceneTitle p={1}>The proof in four moves</SceneTitle>
			<ProofMap main={[1, 1, 1, 1]} engine={[1, 1, 1, 1, 1]} terminal={1} branch={1} current={current} dim={dim} />
			<At x={1060} y={760} w={640} style={{opacity: window(f, cue('moves-6', 'hard part'), at[0])}}>
				<Text px={size.body} ink="mist">
					The energy budget is the estimate everything else depends on.
				</Text>
			</At>
		</>
	);
};
