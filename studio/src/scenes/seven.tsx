import React from 'react';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Cite, Display, Fraction, Tag, Text} from '../design/primitives';
import {At, Callout, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, size, space, stroke} from '../design/tokens';
import {StripMap} from '../diagrams/StripMap';
import {Terrace} from '../diagrams/Terrace';

// Chapter 10: the September manuscript's continuation principle, then its
// second stage, which starts from 11/12 and reaches 7/8.

const Row: React.FC<{label: string; tex: string; p: number; px?: number; light?: Record<string, {ink: 'gilt' | 'ember' | 'verdigris' | 'paper' | 'mist'; p: number}>}> = ({
	label,
	tex,
	p,
	px = 42,
	light,
}) => (
	<div style={{display: 'grid', gridTemplateColumns: '150px auto', alignItems: 'center', opacity: p}}>
		<Text px={size.small} ink="mist">
			{label}
		</Text>
		<div style={{display: 'inline-block', whiteSpace: 'nowrap'}}>
			<Tex tex={tex} px={px} light={light} />
		</div>
	</div>
);

// Mathematics inside a line of Plex text.
const M: React.FC<{tex: string; ink?: 'paper' | 'mist'; px?: number}> = ({tex, ink = 'mist', px = size.small * 1.1}) => (
	<Tex tex={tex} px={px} display={false} ink={ink} style={{display: 'inline-block'}} />
);

// seven-principle: a schematic strip near the rightmost zeros.
const MAP = {x: 1090, y: 220, w: 670, h: 640};
const SIG: [number, number] = [0.44, 1.04];
const T: [number, number] = [0, 100];
const sx = (s: number) => MAP.x + ((s - SIG[0]) / (SIG[1] - SIG[0])) * MAP.w;
const ty = (t: number) => MAP.y + MAP.h - ((t - T[0]) / (T[1] - T[0])) * MAP.h;
const BETA = 0.88; // schematic positions
const SIGMA0 = 0.72;
const EPS = 0.06;
// Supposed zeros, from different characters, creeping toward beta_* with height.
const SUPPOSED: [number, number][] = [
	[0.57, 8],
	[0.64, 19],
	[0.55, 30],
	[0.7, 36],
	[0.76, 47],
	[0.62, 55],
	[0.8, 58],
	[0.836, 68],
	[0.858, 78],
	[0.871, 87],
	[0.877, 95],
];
const WITNESS = 8; // the zero inside the strip at seven-3

export const SevenPrinciple: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const c1 = (phrase: string) => cue('seven-1', phrase);
	const c2 = (phrase: string) => cue('seven-2', phrase);
	const c3 = (phrase: string) => cue('seven-3', phrase);

	const zerosAt = c1('any zero');
	const sup = progress(f, c1('supremum'), beat * 2);
	const suppose = progress(f, c1('Suppose'));
	const sigma0 = progress(f, c1('proposed line'), beat * 2);
	const band = progress(f, c2('reciprocal continues'), beat * 3, ease.inOut);
	const witness = progress(f, c3('some zero lies'));
	const pole = window(f, c3('pole there'), c3('So beta star'));
	const contra = window(f, c3('Contradiction'), c3('So beta star') + beat * 2);
	const settle = progress(f, c3('So beta star'), beat * 3, ease.inOut);
	const beta = lerp(BETA, SIGMA0, settle);

	const p1 = 1 - progress(f, start('seven-2') - beat, beat);
	const p2 = progress(f, start('seven-2'), beat) * (1 - progress(f, start('seven-3') - beat, beat));
	const p3 = progress(f, start('seven-3'), beat);
	const headerY = lerp(470, 216, progress(f, start('seven-2') - beat, beat * 2, ease.inOut));
	const [wx, wy] = [sx(SUPPOSED[WITNESS][0]), ty(SUPPOSED[WITNESS][1])];
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Continuation from a common signal</SceneTitle>

			{/* seven-1: beta_* and the supposition */}
			<At x={space.margin} y={216} w={900} style={{opacity: p1, display: 'flex', flexDirection: 'column', gap: 18}}>
				<div style={{opacity: progress(f, c1('Let beta star')), display: 'inline-block', alignSelf: 'flex-start'}}>
					<Tex tex={'\\beta_*=\\sup\\big\\{\\Re\\rho:\\ L_F(\\rho,\\eta)=0\\big\\}'} px={46} />
				</div>
				<Text px={size.label} ink="mist" p={progress(f, c1('across all the Hecke'))} style={{width: 820}}>
					over the zeros with ½ ≤ Re ρ ≤ 1 of every primitive finite-order Hecke L-function of the Eisenstein field
				</Text>
				<Text px={size.label} ink="mist" p={progress(f, c1('supremum'))} style={{width: 820}}>
					a supremum: no zero need lie on the line itself
				</Text>
			</At>
			<At x={space.margin} y={headerY} style={{opacity: suppose, display: 'flex', alignItems: 'baseline', gap: 24}}>
				<Text px={size.label} ink="mist">
					suppose
				</Text>
				<Tex tex={'\\beta_*>\\sigma_0'} px={size.math} display={false} ink="ember" />
			</At>

			{/* seven-2: one sum, two bounds, uniform margins */}
			<At x={space.margin} y={318} w={920} style={{opacity: p2, display: 'flex', flexDirection: 'column', gap: 16}}>
				<Text px={size.label} p={progress(f, c2('builds a sum'))}>
					For each target η, a sum <M tex={'J_\\eta(Z)'} ink="paper" px={size.label * 1.1} /> with two bounds:
				</Text>
				<Row label="reflection" tex={'|J_\\eta(Z)|\\ll_\\eta Z^{C(\\sigma_0)+\\htmlClass{om}{\\omega}}'} p={progress(f, c2('Reflection'))} light={{om: {ink: 'paper', p: 0}}} />
				<Row label="Poisson" tex={'|J_\\eta(Z)-f_\\eta(Z)|\\ll_\\eta Z^{C(\\beta_*)-\\delta}'} p={progress(f, c2('Poisson summation'))} />
				<Row
					label="the signal"
					tex={'f_\\eta(Z)=\\frac{1}{2\\pi i}\\int_{(2)}Z^{C(s)}e^{(s-5/6)^2}\\,\\htmlClass{inv}{\\frac{H_\\eta(s)}{L_F^{\\mathcal S}(s,\\eta)}}\\,ds'}
					p={progress(f, c2('signal'))}
					px={34}
					light={{inv: {ink: 'gilt', p: progress(f, c2('one over the target'))}}}
				/>
				<div style={{opacity: progress(f, c2('margins')), marginTop: 10}}>
					<Row label="margins" tex={'\\varepsilon_*=\\min\\{\\beta_*-\\sigma_0-\\omega,\\ \\delta\\}>0'} p={1} />
					<Text px={size.micro} ink="mist" style={{marginLeft: 150, marginTop: 6}}>
						δ is the paper’s σ, renamed here to keep σ for real parts
					</Text>
				</div>
			</At>

			{/* seven-3: the contradiction */}
			<At x={space.margin} y={330} w={900} style={{opacity: p3, display: 'flex', flexDirection: 'column', gap: 26}}>
				<div style={{opacity: progress(f, c3('some zero lies')), display: 'flex', alignItems: 'baseline', gap: 24}}>
					<Text px={size.label} ink="mist">
						some zero has
					</Text>
					<Tex tex={'\\Re\\rho>\\beta_*-\\varepsilon_*'} px={size.math * 0.9} display={false} ink="ember" />
				</div>
				<div style={{opacity: progress(f, c3('pole there')), display: 'flex', alignItems: 'baseline', gap: 24}}>
					<Tex tex={'1/L_F(s,\\eta)'} px={size.math * 0.8} display={false} />
					<Text px={size.label} ink="mist">
						would have a pole at ρ
					</Text>
				</div>
				<Display px={size.heading} ink="ember" p={progress(f, c3('Contradiction'))}>
					Contradiction
				</Display>
				<div style={{opacity: settle}}>
					<Tex tex={'\\beta_*\\le\\sigma_0'} px={size.mathLarge} display={false} />
				</div>
			</At>

			<div style={{position: 'absolute', left: MAP.x - 40, top: MAP.y - 110, width: MAP.w + 80, height: MAP.h + 180, overflow: 'hidden'}}>
				<StripMap
				id="seven-sup"
				x={40}
				y={110}
				w={MAP.w}
				h={MAP.h}
				axisNames={false}
				sigma={SIG}
				t={T}
				axes={progress(f, 2, beat * 2)}
				strip={progress(f, 2, beat * 2)}
				criticalLine={progress(f, 2, beat * 2)}
				sigmaTicks={[
					{sigma: 0.5, tex: '\\tfrac12'},
					{sigma: 1, tex: '1'},
				]}
				frontiers={[{sigma: beta, ink: 'paper' as const, label: settle > 0.5 ? '\\beta_*\\le\\sigma_0' : '\\beta_*', labelOffset: [settle > 0.5 ? 40 : 0, 0] as [number, number], p: sup}].filter((fr) => fr.p > 0)}
				/>
			</div>
			<At x={MAP.x + MAP.w + 18} y={MAP.y + MAP.h - 26} style={{opacity: progress(f, 2, beat * 2)}}>
				<Tex tex={'\\sigma'} px={size.label} ink="mist" display={false} />
			</At>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>
					<pattern id="seven-band" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
						<line x1="0" y1="0" x2="0" y2="14" stroke={color.gilt} strokeWidth="2" />
					</pattern>
				</defs>
				{/* the strip where the reciprocal would continue */}
				<g opacity={band * (1 - settle)}>
					<rect x={sx(BETA - EPS)} y={MAP.y} width={(sx(BETA) - sx(BETA - EPS)) * band} height={MAP.h} fill="url(#seven-band)" opacity={0.42} />
					<line x1={sx(BETA - EPS)} x2={sx(BETA - EPS)} y1={MAP.y} y2={MAP.y + MAP.h} stroke={alpha('gilt', 0.8)} strokeWidth={stroke.line} strokeDasharray="5 6" />
					<line x1={sx(BETA - EPS)} x2={sx(BETA)} y1={MAP.y + MAP.h + 34} y2={MAP.y + MAP.h + 34} stroke={color.mist} strokeWidth={stroke.line} />
				</g>
				{/* the proposed line */}
				<line x1={sx(SIGMA0)} x2={sx(SIGMA0)} y1={MAP.y + MAP.h} y2={MAP.y + MAP.h - MAP.h * sigma0} stroke={color.mist} strokeWidth={stroke.line} strokeDasharray="10 9" />
				{/* supposed zeros */}
				{SUPPOSED.map(([s, t], i) => {
					const op = progress(f, zerosAt + i * 3, beat) * (1 - settle * (s > SIGMA0 ? 1 : 0.5));
					const isW = i === WITNESS;
					return (
						<g key={i} opacity={op}>
							<circle cx={sx(s)} cy={ty(t)} r={isW ? 7 + 3 * witness : 6} fill={color.ember} />
							{isW && witness > 0 && <circle cx={wx} cy={wy} r={22 + 16 * pole} fill={alpha('ember', 0.15 * witness)} stroke={color.ember} strokeWidth={stroke.line} opacity={witness} />}
						</g>
					);
				})}
				{contra > 0 && <rect x={MAP.x} y={MAP.y} width={MAP.w} height={MAP.h} fill={alpha('ember', 0.1 * contra)} />}
			</svg>
			<At x={sx(SIGMA0) - 60} y={MAP.y - 94} w={120} style={{textAlign: 'center', opacity: sigma0 * (1 - settle)}}>
				<Tex tex={'\\sigma_0'} px={size.lead} ink="mist" display={false} />
			</At>
			<At x={sx(BETA - EPS / 2) - 50} y={MAP.y + MAP.h + 44} w={100} style={{textAlign: 'center', opacity: band * (1 - settle)}}>
				<Tex tex={'\\varepsilon_*'} px={size.label} display={false} />
			</At>
			<Callout x={MAP.x + 250} y={ty(70)} to={[sx(SUPPOSED[6][0]) - 10, ty(SUPPOSED[6][1]) - 4]} ink="ember" align="right" p={progress(f, zerosAt + beat * 2) * (1 - p2) * (1 - p3)} width={220}>
				supposed zeros
			</Callout>
			<Callout x={MAP.x + 300} y={wy - 80} to={[wx - 22, wy - 10]} ink="ember" align="right" p={witness * (1 - settle)} width={280}>
				a supposed zero ρ
			</Callout>
			<Tag kind="schematic" p={progress(f, zerosAt)} style={{position: 'absolute', left: MAP.x, top: MAP.y + MAP.h + 76}} />

			<SceneLocator />
			<Cite p={progress(f, c1('one principle'))}>September manuscript, Proposition 2.1</Cite>
		</>
	);
};

// seven-bootstrap: Part II stands on Part I.
const TER = {x: 1150, y: 850, w: 610, sigma: [0.83, 1] as [number, number], slab: 132};
const tx = (s: number) => TER.x + ((s - TER.sigma[0]) / (TER.sigma[1] - TER.sigma[0])) * TER.w;

export const SevenBootstrap: React.FC = () => {
	const {frame: f, cue} = useCues();
	const c4 = (phrase: string) => cue('seven-4', phrase);
	const c5 = (phrase: string) => cue('seven-5', phrase);
	const partI = progress(f, c4('Part one'), beat * 2);
	const partII = progress(f, c4('Part two'));
	const assume = progress(f, c4('may assume'), beat * 2);
	const land = progress(f, c5('margins close'), beat * 3, ease.inOut);
	const seven = progress(f, c5('seven eighths'));
	const foothold = progress(f, c5('foothold'), beat * 2);
	const ingredients = [
		{
			at: c4('compensating prime factors'),
			label: 'compensating prime factors',
			tex: '\\overline{\\eta(p)}\\,I_{\\eta;p}(X,Y,Zq_p)\\;-\\;q_p^{-3/2}\\,I_\\eta\\big(\\tfrac{X}{q_p},\\tfrac{Y}{q_p},Z\\big)',
		},
		{
			at: c4('unequal averaging scales'),
			label: 'unequal averaging scales',
			tex: 'X=Z^{17/48},\\quad Y=Z^{23/48}\\qquad\\mist{\\text{(Part I: }X=Y=Z^{1/2})}',
		},
		{
			at: c4('moment bounds'),
			label: 'moment bounds, each with its own recursion',
			tex: 'D^{-1/2}\\!\\sum_{\\mathfrak a}\\verd{\\mu(\\mathfrak a)}\\psi(\\mathfrak a)W\\big(\\tfrac{\\N\\mathfrak a}{D}\\big),\\qquad D^{-1/2}\\!\\sum_{\\mathfrak a}\\psi(\\mathfrak a)W\\big(\\tfrac{\\N\\mathfrak a}{D}\\big)',
		},
	];
	return (
		<>
			<SceneTitle p={progress(f, 4)}>A bootstrap, from 11/12 to 7/8</SceneTitle>

			<At x={space.margin} y={214} w={840} style={{display: 'flex', flexDirection: 'column', gap: 22}}>
				<div style={{display: 'grid', gridTemplateColumns: '90px auto', alignItems: 'baseline', opacity: partI}}>
					<Display px={size.lead}>I</Display>
					<div>
						<Tex tex={'\\beta_*\\le\\tfrac{11}{12}'} px={44} display={false} />
						<Text px={size.small} ink="mist" style={{marginTop: 4}}>
							Part I, with signal exponent <M tex={'C_{\\mathrm I}(s)=s-\\tfrac23'} />
						</Text>
					</div>
				</div>
				<div style={{display: 'grid', gridTemplateColumns: '90px auto', alignItems: 'baseline', opacity: partII}}>
					<Display px={size.lead}>II</Display>
					<div>
						<div style={{whiteSpace: 'nowrap'}}>
							<Tex tex={'\\text{suppose }\\beta_*>\\tfrac78,\\qquad 0<\\Delta=\\beta_*-\\tfrac78\\le\\tfrac1{24}'} px={40} display={false} />
						</div>
						<Text px={size.small} ink="mist" p={assume} style={{marginTop: 4}}>
							Part I already gives <M tex={'\\beta_*\\le\\tfrac{11}{12}'} />, so the gap is at most <M tex={'\\tfrac1{24}'} />
						</Text>
					</div>
				</div>
				<div style={{marginLeft: 90, marginTop: 14, display: 'flex', flexDirection: 'column', gap: 18}}>
					{ingredients.map((g) => (
						<div key={g.label} style={{opacity: progress(f, g.at)}}>
							<Text px={size.small} ink="mist">
								{g.label}
							</Text>
							<div style={{marginTop: 4, display: 'inline-block', whiteSpace: 'nowrap'}}>
								<Tex tex={g.tex} px={29} />
							</div>
						</div>
					))}
				</div>
			</At>

			{/* the signal's exponent, and the frontier it reaches */}
			<At x={TER.x - 120} y={222} style={{opacity: progress(f, c5('s minus two thirds')), whiteSpace: 'nowrap'}}>
				<Tex
					tex={'C_{\\mathrm I}(s)=s-\\tfrac23\\ \\ \\longrightarrow\\ \\ \\htmlClass{c2}{C_{\\mathrm{II}}(s)=s-\\tfrac{11}{16}}'}
					px={36}
					display={false}
					show={{c2: progress(f, c5('s minus eleven sixteenths'))}}
				/>
			</At>
			<At x={tx(7 / 8) - 80} y={TER.y - 2 * TER.slab - 250} w={160} style={{textAlign: 'center'}}>
				<Fraction n="7" d="8" px={96} p={seven} />
			</At>
			<Terrace
				{...TER}
				first={partI}
				second={land}
				ticks={[
					{sigma: 7 / 8, tex: '\\tfrac78', p: partII},
					{sigma: 11 / 12, tex: '\\tfrac{11}{12}', p: partI},
					{sigma: 1, tex: '1', p: partI},
				]}
				supposed={{sigma: 0.9, p: assume * (1 - land)}}
				gap={assume * (1 - land)}
				foothold={foothold}
			/>
			<At x={tx(7 / 8)} y={TER.y - 66} w={tx(11 / 12) - tx(7 / 8)} style={{textAlign: 'center', opacity: assume * (1 - land)}}>
				<Tex tex={'\\Delta\\le\\tfrac1{24}'} px={size.small} display={false} />
			</At>
			<At x={tx(11 / 12) + 24} y={TER.y - TER.slab + 40} style={{opacity: partI}}>
				<Text px={size.label} ink={foothold > 0.5 ? 'paper' : 'mist'}>
					{foothold > 0.5 ? 'Part I, the foothold' : 'Part I'}
				</Text>
			</At>
			<At x={tx(7 / 8) + 24} y={TER.y - 2 * TER.slab + 40 - (1 - land) * 120} style={{opacity: Math.min(1, land * 2)}}>
				<Text px={size.label}>Part II</Text>
			</At>
			<Tag kind="schematic" p={partI} style={{position: 'absolute', left: tx(1) - 250, top: TER.y - 2 * TER.slab - 60}} />

			<SceneLocator />
			<Cite p={partII}>September manuscript, Part II</Cite>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'seven-principle': SevenPrinciple,
	'seven-bootstrap': SevenBootstrap,
};
