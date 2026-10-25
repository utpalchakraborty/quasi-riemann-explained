import React from 'react';
import numerics from '../data/numerics.json';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Cite, Display, Tag, Text} from '../design/primitives';
import {At, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, duration, ease, Ink, size, space, stroke} from '../design/tokens';
import {AreaColumn} from '../diagrams/Area';
import {BraceFade, Bracket} from '../diagrams/Energy';
import {Ledger} from '../diagrams/Ledger';
import {MixedLine} from '../diagrams/MixedLine';
import {RootWheel, WheelDot} from '../diagrams/RootWheel';
import {cubeColumnX, ThetaColumns} from '../diagrams/ThetaColumns';
import {rulerY, ThetaRuler} from '../diagrams/ThetaRuler';
import {StrikeFade} from '../diagrams/ThetaStrike';
import {UpperHalfSpace} from '../diagrams/UpperHalfSpace';

// Chapter 6: Proving it, II: the theta function pays. October manuscript,
// §2.4 (Step 4), Proposition 5.2, §6 (Proposition 6.2, Lemma 6.5).

// The completed sum's table of rows and columns, shared by the first two scenes.
const GRID = {x: 470, y: 400, w: 1120, rows: 5, rowGap: 42};
const GRID_BOTTOM = GRID.y + (GRID.rows - 1) * GRID.rowGap;

const RowLabel: React.FC<{p: number; lit: number}> = ({p, lit}) => (
	<>
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<Bracket x1={GRID.x - 46} y1={GRID_BOTTOM + 16} x2={GRID.x - 46} y2={GRID.y - 16} ink={lit > 0.5 ? 'ink' : 'pencil'} p={p} />
		</svg>
		<At x={space.margin} y={(GRID.y + GRID_BOTTOM) / 2 - 46} w={GRID.x - 80 - space.margin} style={{textAlign: 'right', opacity: p}}>
			<MixedLine ink={lit > 0.5 ? 'ink' : 'pencil'} parts={['rows ', {tex: 'h'}]} />
			<Tex px={size.label} display={false} ink={lit > 0.5 ? 'ink' : 'pencil'} tex={'0<\\N(h)\\ll\\cH'} />
		</At>
	</>
);

// --- theta-kubota: cubic Gauss sums are theta coefficients; completing the sum ---

const EQ_THETA =
	'\\theta(z,v)=\\frac{3^{5/2}}{2}\\,v^{2/3}+\\sum_{0\\ne\\ell\\in\\lambda^{-3}\\OO}\\htmlClass{tkTau}{\\tau(\\ell)}\\,vK_{1/3}(4\\pi|\\ell|v)\\,\\exp\\!\\big(2\\pi i(\\ell z+\\overline{\\ell z})\\big)';
const EQ_PATTERSON = 'c_\\theta(nb^3)=3^{5/2}\\,|b|\\,\\overline{\\chi_n(\\lambda)^2}\\,\\arith{\\gamma_2(n)},\\qquad\\lambda=1+2\\omega';
const EQ_B = 'B_h(X)=\\sum\\nolimits^{*}_{n}\\overline{\\alpha(n)}\\,\\arith{\\gamma_2(n)}\\,\\xi(n)\\,\\chi_n(h)\\,U\\big(\\N(n)/X\\big)';
const EQ_T =
	'T_h(X)=\\htmlClass{tkUbB}{\\underbrace{X^{-1/2}B_h(X)}_{\\htmlClass{tkB}{b\\,=\\,1}}}\\;+\\;\\htmlClass{tkUbC}{\\underbrace{\\debt{\\text{the terms }nb^{3},\\ b\\ne1}}_{\\htmlClass{tkC}{\\text{cube terms}}}}';

export const ThetaKubota: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const c1 = (s: string) => cue('theta-1', s);
	const c2 = (s: string) => cue('theta-2', s);
	const fourier = c1('Fourier coefficients');
	const cubicTheta = c1('cubic theta function');
	const automorphic = c1('automorphic form');
	const hyper = c1('three-dimensional hyperbolic space');
	const symmetry = c1('have symmetry');
	const gives = c1('symmetry gives');
	const law = c1('transformation law');
	const contains = c2('contains');
	const sqfree = c2('each square-free n');
	const cubed = c2('n times b cubed');
	const family = c2('The family B h');
	const only = c2('has only the square-free indices');
	const adding = c2('adding the cube terms');
	const newSum = c2('T h of X');
	const rows = c2('The rows are unchanged');
	const borrowed = c2('borrowed');
	const back = c2('chapter seven pays them back');

	// theta-1 leaves as Patterson's formula arrives
	const first = 1 - progress(f, contains - beat, beat * 1.5);
	const room = progress(f, cubed, beat * 3, ease.inOut);
	const fill = progress(f, adding, beat * 2);
	const rowsLit = progress(f, rows);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Kubota’s cubic theta function</SceneTitle>

			{/* theta-1: the Gauss sums, the function whose coefficients they are, and its space */}
			<div style={{opacity: first}}>
				<At x={space.margin} y={190}>
					<MixedLine p={progress(f, 6)} parts={['a cubic Gauss sum']} />
					<div style={{display: 'inline-block', marginTop: 4, opacity: progress(f, 8)}}>
						<Tex px={size.math * 0.8} tex={'\\arith{\\gamma_2(n)}=\\frac{1}{\\sqrt{\\N(n)}}\\sum\\nolimits_{x\\bmod n}\\chi_n(x)^{2}\\,e(x/n)'} />
					</div>
				</At>
				<At x={space.margin} y={372}>
					<MixedLine p={progress(f, fourier)} parts={[progress(f, cubicTheta) > 0.5 ? 'Kubota’s cubic theta function, as a Fourier series in ' : 'a Fourier series in ', {tex: 'z'}]} />
					<div style={{display: 'inline-block', marginTop: 4, opacity: progress(f, fourier)}}>
						<Tex px={size.math * 0.72} tex={EQ_THETA} light={{tkTau: {ink: 'viridian', p: progress(f, fourier + beat)}}} />
					</div>
					<MixedLine
						px={size.small}
						p={progress(f, cubicTheta + beat)}
						style={{marginTop: 6}}
						parts={['Patterson: the coefficients ', {tex: '\\tau(\\ell)', ink: 'viridian'}, ' are cubic Gauss sums, up to simple factors']}
					/>
				</At>
				<At x={space.margin} y={636} w={820}>
					<MixedLine px={size.body} ink="ink" p={progress(f, automorphic)} parts={['an automorphic form on hyperbolic three-space']} />
					<MixedLine px={size.small} p={progress(f, hyper)} parts={['points ', {tex: 'w=(z,v)'}, ': ', {tex: 'z\\in\\mathbb C'}, ' on the floor, height ', {tex: 'v>0'}]} />
				</At>
				<At x={space.margin} y={748} w={820}>
					<MixedLine px={size.small} p={progress(f, symmetry)} parts={['a symmetry ', {tex: 'g'}, ' carries ', {tex: 'w'}, ' to ', {tex: 'g\\,w'}, '; the function obeys a law']} />
					<div style={{display: 'inline-block', marginTop: 8, opacity: progress(f, law)}}>
						<Tex px={size.math * 0.85} display={false} tex={'\\theta(g\\,w)=\\kappa(g)\\,\\theta(w)'} />
					</div>
					<MixedLine
						px={size.small}
						p={progress(f, law + beat)}
						style={{marginTop: 4}}
						parts={['for ', {tex: 'g\\equiv I\\ (\\mathrm{mod}\\ 3)'}, '; ', {tex: '\\kappa'}, ' is Kubota’s cubic character']}
					/>
				</At>
				<UpperHalfSpace
					x={1400}
					y={790}
					s={128}
					p={progress(f, automorphic, beat * 2)}
					domes={progress(f, hyper, beat * 2)}
					point={progress(f, symmetry)}
					move={progress(f, gives, law - gives + beat, ease.inOut)}
				/>
				<Tag kind="schematic" p={progress(f, hyper)} style={{position: 'absolute', left: 1060, top: 904}} />
			</div>

			{/* theta-2: Patterson's formula, then the table of rows and columns completed */}
			<At x={space.margin} y={196} style={{opacity: progress(f, contains)}}>
				<Tex px={size.math * 0.85} tex={EQ_PATTERSON} />
				<MixedLine
					px={size.small}
					p={progress(f, contains + beat)}
					style={{marginTop: 6}}
					parts={['Patterson’s formula: the coefficient at every index ', {tex: 'nb^{3}'}, ': ', {tex: 'n'}, ' and ', {tex: 'b'}, ' primary, ', {tex: 'n'}, ' squarefree']}
				/>
			</At>

			<ThetaColumns {...GRID} p={progress(f, sqfree, beat * 4)} room={room} fill={fill} />
			<RowLabel p={progress(f, sqfree + beat, beat * 2)} lit={rowsLit} />
			<At x={GRID.x} y={GRID.y - 74} style={{opacity: progress(f, sqfree), whiteSpace: 'nowrap'}}>
				<MixedLine ink="viridian" parts={['columns: squarefree ', {tex: 'n', ink: 'viridian'}, ', with ', {tex: '\\N(n)\\asymp X', ink: 'viridian'}]} />
			</At>
			<At x={cubeColumnX(GRID.x, GRID.w, 3) - 100} y={GRID.y - 74} w={200} style={{textAlign: 'center', opacity: room}}>
				<Tex px={size.label} display={false} ink={fill > 0.5 ? 'vermilion' : 'pencil'} tex={'n\\,b^{3}'} />
			</At>
			<At x={cubeColumnX(GRID.x, GRID.w, 5) - 120} y={GRID.y - 74} w={240} style={{textAlign: 'center', opacity: progress(f, c2('for every b'))}}>
				<MixedLine px={size.small} ink={fill > 0.5 ? 'vermilion' : 'pencil'} parts={['for every ', {tex: 'b'}]} />
			</At>
			<At x={GRID.x + GRID.w - 420} y={GRID_BOTTOM + 30} w={420} style={{textAlign: 'right', opacity: rowsLit}}>
				<Text px={size.small}>the same rows, more columns</Text>
			</At>
			<Tag kind="schematic" p={progress(f, sqfree + beat)} style={{position: 'absolute', left: GRID.x, top: GRID_BOTTOM + 34}} />

			<BraceFade show={{tkUbB: progress(f, newSum + beat), tkUbC: progress(f, newSum + beat * 2)}} />
			<At x={space.margin} y={644} style={{display: 'flex', alignItems: 'baseline', gap: 36, whiteSpace: 'nowrap'}}>
				<div style={{opacity: progress(f, family)}}>
					<Tex px={size.math * 0.72} display={false} tex={EQ_B} />
				</div>
				<MixedLine px={size.small} p={progress(f, only)} parts={['the star: squarefree ', {tex: 'n'}, ' only']} />
			</At>
			<At x={space.margin} y={736} style={{opacity: progress(f, newSum)}}>
				<Tex px={size.math * 0.75} tex={EQ_T} show={{tkB: progress(f, newSum + beat), tkC: progress(f, newSum + beat * 2)}} />
			</At>
			<Ledger
				x={1250}
				y={740}
				w={542}
				amountW={220}
				rowH={56}
				px={size.label * 0.93}
				rules={progress(f, borrowed - beat)}
				heading={{label: 'The account', amount: 'when', p: progress(f, borrowed - beat)}}
				rows={[{label: ['borrowed: cube terms'], note: 'paid in chapter 7', kind: 'debt', p: progress(f, borrowed), light: window(f, back, back + beat * 6)}]}
			/>

			<SceneLocator />
			<Cite p={progress(f, fourier) * first}>October manuscript, §2.4, §6.1 and §A.2, after Kubota (1969) and Patterson (1977)</Cite>
			<Cite p={progress(f, contains)}>October manuscript, §2.4, (2.10) and (2.12); completion after Dunn–Radziwiłł</Cite>
		</>
	);
};

// --- theta-quadratic: the dual sum, and χ_p^{-1}χ_p^{-2} = χ_p^{-3} = χ_p^3 ---

const EQ_DUAL =
	'\\sum_{0\\ne m\\in\\OO}\\frac{d_\\theta(m)\\,\\alpha(m)}{\\sqrt{\\N(m)}}\\,\\htmlClass{tqTw}{\\chi_h(m)^{3}}\\;V_*^{\\sharp}\\!\\Big(\\frac{\\N(m)X}{\\N(h)^{2}}\\Big)';
const WHEEL = {cx: 1430, cy: 545, r: 210};

// An arc on the wheel, in sixths of a turn (0 = the root 1, counterclockwise).
const Arc: React.FC<{r: number; a0: number; a1: number; ink: Ink; p: number; dash?: string; width?: number}> = ({r, a0, a1, ink, p, dash, width = stroke.line}) => {
	if (p <= 0 || Math.abs(a1 - a0) < 0.01) return null;
	const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) * 16));
	const d = Array.from({length: n + 1}, (_, i) => {
		const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 3;
		return `${i ? 'L' : 'M'}${(WHEEL.cx + r * Math.cos(a)).toFixed(1)},${(WHEEL.cy - r * Math.sin(a)).toFixed(1)}`;
	}).join('');
	const end = (a1 * Math.PI) / 3;
	const dir = Math.sign(a1 - a0);
	// arrowhead tangent to the arc at its end
	const tx = -Math.sin(end) * dir;
	const ty = -Math.cos(end) * dir;
	const ex = WHEEL.cx + r * Math.cos(end);
	const ey = WHEEL.cy - r * Math.sin(end);
	const nx = Math.cos(end);
	const ny = -Math.sin(end);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: p}}>
			<path d={d} fill="none" stroke={color[ink]} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" />
			<path
				d={`M${ex - tx * 14 + nx * 8},${ey - ty * 14 + ny * 8} L${ex},${ey} L${ex - tx * 14 - nx * 8},${ey - ty * 14 - ny * 8}`}
				fill="none"
				stroke={color[ink]}
				strokeWidth={width}
				strokeLinejoin="round"
			/>
		</svg>
	);
};

// Where a label for the point at angle a (sixths) sits, just outside the wheel.
const around = (a: number, out: number): [number, number] => [WHEEL.cx + (WHEEL.r + out) * Math.cos((a * Math.PI) / 3), WHEEL.cy - (WHEEL.r + out) * Math.sin((a * Math.PI) / 3)];

export const ThetaQuadratic: React.FC = () => {
	const {frame: f, cue} = useCues();
	const c3 = (s: string) => cue('theta-3', s);
	const c4 = (s: string) => cue('theta-4', s);
	const long = c3('A long sum over n');
	const becomes = c3('becomes a shorter dual sum');
	const newVar = c3('a new variable, m');
	const twist = c3('the twist changes character');
	const eachPrime = c3('At each prime dividing h');
	const fourierSide = c3('the Fourier side contributed');
	const minusOne = c3('chi to the minus one');
	const thetaSide = c3('the theta side contributes');
	const minusTwo = c3('chi to the minus two');
	const together = c4('Together that is');
	const minusThree = c4('chi to the minus three');
	const equalsCubed = c4('equals chi cubed');
	const sixthRoot = c4('a sixth root of one');
	const cubedCue = c4('cubed, is plus');
	const pm = c4('plus or minus one');
	const quadratic = c4('The twist is now quadratic');
	const sign = c4('A sixth-order twist');
	const price = c4('sharpest sieve can price');

	// phase 1: the table folds into dual sums; phase 2: the twist on the wheel
	const fold = progress(f, becomes, beat * 4, ease.inOut);
	const phase1 = 1 - progress(f, eachPrime - beat, beat * 1.5);
	const lift = progress(f, eachPrime - beat, duration.settle, ease.inOut);
	const wheelP = progress(f, eachPrime, beat * 2);

	// the factor for one value ζ = χ_p(x): angles add, −1 then −2 sixths of a turn
	const a1 = progress(f, minusOne, beat * 2.5, ease.inOut);
	const a2 = progress(f, minusTwo, beat * 3, ease.inOut);
	const angle = -a1 - 2 * a2;
	const single = 1 - progress(f, sixthRoot - beat, beat * 1.5);
	// all six roots carried to their cubes: ζ^k -> ζ^{ks}, s from 1 to 3
	const many = progress(f, sixthRoot, beat * 1.5);
	const s = 1 + 2 * progress(f, cubedCue - beat, beat * 4, ease.inOut);
	const sweeping = f > cubedCue - beat && f < cubedCue + beat * 4 ? 1 : 0;
	const dots: WheelDot[] = [0, 1, 2, 3, 4, 5].map((k) => ({
		angle: k * s,
		ink: 'viridian',
		r: 15,
		opacity: many,
		tail: sweeping * Math.min(1.2, k * (s - 1) * 0.5),
	}));
	const end = progress(f, pm);
	const [lx, ly] = around(3, 34);
	const [rx, ry] = around(0, 34);
	const [zx, zy] = around(1, 26);
	const [mx, my] = around(-1, 30);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The twist turns quadratic</SceneTitle>

			{/* phase 1: the completed table, folded by the transformation */}
			<div style={{opacity: phase1}}>
				<ThetaColumns {...GRID} p={progress(f, 2, beat * 2)} room={1} fill={1} fold={fold} dualW={420} />
				<RowLabel p={progress(f, 2, beat * 2)} lit={0} />
				<At x={GRID.x} y={GRID.y - 74} style={{whiteSpace: 'nowrap', opacity: progress(f, 6) * (1 - fold)}}>
					<MixedLine ink="ink" parts={['a long sum over ', {tex: 'nb^{3}'}, ', with ', {tex: '\\N(nb^{3})\\asymp X'}]} />
				</At>
				<At x={GRID.x} y={GRID.y - 74} style={{whiteSpace: 'nowrap', opacity: progress(f, becomes + beat * 3)}}>
					<MixedLine ink="ink" parts={['a shorter dual sum over ', {tex: 'm'}, ', with ', {tex: '\\N(m)\\ll\\N(h)^{2}/X'}]} />
				</At>
				<At x={GRID.x + 470} y={GRID.y + 2 * GRID.rowGap - 22} w={600} style={{opacity: progress(f, becomes + beat * 5)}}>
					<MixedLine px={size.small} parts={['larger ', {tex: '\\N(h)'}, ', longer dual sum']} />
				</At>
				<Tag kind="schematic" p={progress(f, long)} style={{position: 'absolute', left: GRID.x, top: GRID_BOTTOM + 34}} />
				<At x={space.margin} y={lerp(654, 196, lift) + 136} style={{opacity: progress(f, newVar + beat)}}>
					<MixedLine px={size.small} parts={['the transformed sum, up to a finite sum of such terms and fixed twists']} />
				</At>
			</div>
			<At x={space.margin} y={lerp(654, 196, lift)} style={{opacity: progress(f, newVar)}}>
				<Tex px={size.math * 0.74} tex={EQ_DUAL} light={{tqTw: {ink: 'viridian', p: progress(f, twist)}}} />
			</At>

			{/* phase 2: the exponents add at each prime dividing h */}
			<At x={space.margin} y={346} style={{opacity: progress(f, eachPrime)}}>
				<MixedLine px={size.small} parts={['at each prime ', {tex: 'p\\mid h'}, ', the twists multiply']} />
			</At>
			<At x={space.margin} y={394} style={{display: 'grid', gridTemplateColumns: '250px auto', rowGap: 14, alignItems: 'center'}}>
				<Text px={size.label} ink="pencil" p={progress(f, fourierSide)}>
					Fourier side
				</Text>
				<div style={{opacity: progress(f, minusOne)}}>
					<Tex px={size.math} display={false} ink="viridian" tex={'\\chi_p^{-1}'} />
				</div>
				<Text px={size.label} ink="pencil" p={progress(f, thetaSide)}>
					theta side
				</Text>
				<div style={{opacity: progress(f, minusTwo)}}>
					<Tex px={size.math} display={false} ink="viridian" tex={'\\chi_p^{-2}'} />
				</div>
			</At>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<line x1={space.margin} x2={space.margin + 820 * progress(f, together, beat * 2)} y1={582} y2={582} stroke={alpha('pencil', 0.6)} strokeWidth={stroke.hair} />
			</svg>
			<At x={space.margin} y={598} style={{display: 'grid', gridTemplateColumns: '250px auto', alignItems: 'center'}}>
				<Text px={size.label} ink="pencil" p={progress(f, together)}>
					together
				</Text>
				<div style={{opacity: progress(f, together)}}>
					<Tex
						px={size.math}
						display={false}
						tex={'\\chi_p^{-1}\\chi_p^{-2}\\htmlClass{tqA}{=\\chi_p^{-3}}\\htmlClass{tqB}{=\\chi_p^{3}}'}
						show={{tqA: progress(f, minusThree), tqB: progress(f, equalsCubed)}}
						light={{tqB: {ink: 'viridian', p: progress(f, quadratic)}}}
					/>
				</div>
			</At>
			<At x={space.margin} y={704} w={1000}>
				<MixedLine ink="ink" p={progress(f, quadratic)} parts={['so the twist ', {tex: '\\chi_h^{3}', ink: 'viridian'}, ' takes the values ', {tex: '\\pm1'}, ' (or 0): it is quadratic']} />
			</At>
			<At x={space.margin} y={784} w={1000}>
				<Display px={size.lead} p={progress(f, sign)}>
					A sixth-order twist, cubed, is a sign.
				</Display>
				<Text px={size.label} ink="pencil" p={progress(f, price)} style={{marginTop: 10}}>
					Signs are what the sharpest sieve can price.
				</Text>
			</At>

			{/* the wheel of sixth roots */}
			<At x={WHEEL.cx - 320} y={WHEEL.cy - WHEEL.r - 92} w={640} style={{textAlign: 'center'}}>
				<MixedLine p={wheelP} parts={['the values of ', {tex: '\\chi_p'}, ': the six sixth roots of one']} />
			</At>
			<RootWheel
				cx={WHEEL.cx}
				cy={WHEEL.cy}
				r={WHEEL.r}
				p={wheelP}
				roots={lerp(1, 0.45, many)}
				lit={single > 0.5 && f >= minusOne - beat ? [1] : []}
				pointer={{angle, len: 1, opacity: progress(f, minusOne - beat) * single}}
				dots={dots}
			/>
			<Arc r={WHEEL.r * 0.6} a0={0} a1={-a1} ink="viridian" p={progress(f, minusOne) * single} />
			<Arc r={WHEEL.r * 0.42} a0={-1} a1={-1 - 2 * a2} ink="viridian" p={progress(f, minusTwo) * single} width={stroke.bold} />
			<Arc r={WHEEL.r * 0.78} a0={0} a1={3 * progress(f, equalsCubed, beat * 2.5, ease.inOut)} ink="pencil" dash="6 7" p={progress(f, equalsCubed) * single} />
			<At x={zx + 16} y={zy - 30} style={{opacity: progress(f, minusOne - beat) * single, whiteSpace: 'nowrap'}}>
				<MixedLine px={size.small} parts={[{tex: '\\zeta=\\chi_p(x)', ink: 'viridian'}]} />
			</At>
			<At x={mx - 20} y={my + 8} style={{opacity: progress(f, minusOne + beat) * single, whiteSpace: 'nowrap'}}>
				<Tex px={size.label} display={false} tex={'\\zeta^{-1}'} />
			</At>
			<At x={lx - 260} y={ly - 22} w={230} style={{textAlign: 'right', opacity: progress(f, minusTwo + beat) * single, whiteSpace: 'nowrap'}}>
				<Tex px={size.label} display={false} tex={f >= equalsCubed ? '\\zeta^{-3}=\\zeta^{3}' : f >= minusThree ? '\\zeta^{-3}' : '\\zeta^{-1}\\zeta^{-2}'} />
			</At>
			<At x={rx + 6} y={ry - 32} style={{opacity: end}}>
				<Tex px={size.math} ink="viridian" display={false} tex={'+1'} />
				<MixedLine px={size.small} parts={[{tex: 'k'}, ' even']} />
			</At>
			<At x={lx - 136} y={ly - 32} w={120} style={{opacity: end, textAlign: 'right'}}>
				<Tex px={size.math} ink="viridian" display={false} tex={'-1'} />
				<MixedLine px={size.small} parts={[{tex: 'k'}, ' odd']} />
			</At>
			<At x={WHEEL.cx - 340} y={WHEEL.cy + WHEEL.r + 40} w={680} style={{textAlign: 'center', opacity: progress(f, sixthRoot)}}>
				<Tex
					px={size.mathInline}
					display={false}
					tex={'\\big(e^{2\\pi i k/6}\\big)^{3}=e^{\\pi i k}=\\htmlClass{tqPm}{(-1)^{k}}'}
					light={{tqPm: {ink: 'viridian', p: end}}}
				/>
			</At>
			<Tag kind="schematic" p={wheelP} style={{position: 'absolute', left: WHEEL.cx + 120, top: 900}} />

			<SceneLocator />
			<Cite p={progress(f, newVar) * (1 - progress(f, together))}>October manuscript, §2.4, (2.13); Proposition 6.2</Cite>
			<Cite p={progress(f, together)}>October manuscript, §2.4, equation (2.14)</Cite>
		</>
	);
};

// --- theta-sieve: the quadratic large sieve pays rows plus columns ---

const EQ_SIEVE =
	'\\mathop{{\\sum}^{*}}\\limits_{\\N(k)\\le\\cH}\\Big|\\sum_{\\N(n)\\asymp U}\\beta(n)\\,\\arith{\\chi_k(n)^{3}}\\Big|^{2}\\ll\\htmlClass{tsEps}{(\\cH U)^{\\varepsilon}}\\,\\htmlClass{tsMl}{(\\cH+U)}\\sum_n|\\beta(n)|^{2}';
const EQ_COMPLETED =
	'\\sum_{0<\\N(h)\\ll\\cH}|T_h(X)|^{2}\\ll(\\cH X)^{\\varepsilon}\\Big(\\htmlClass{tsUbR}{\\underbrace{\\cH}_{\\htmlClass{tsR}{\\text{rows}}}}+\\htmlClass{tsUbC}{\\underbrace{\\cH^{2}/X}_{\\htmlClass{tsC}{\\text{dual columns}}}}\\Big)';
const COLUMN = {x: 1330, y: 900, w: 230, frameH: 460};
const AREAS = [0.42, 0.17]; // schematic: rows, dual columns, as parts of the budget

export const ThetaSieve: React.FC = () => {
	const {frame: f, cue} = useCues();
	const c = (s: string) => cue('theta-5', s);
	const hb = c('building on Heath-Brown');
	const rowsCols = c('rows plus columns');
	const tiny = c('tiny losses');
	const shape = c('the shape from chapter two');
	const bill = c('paying the bill');
	const completed = c('The completed energy');
	const scriptH = c('comes in at script H');
	const squared = c('script H squared over X');
	const basic = c('At the basic scales');
	const within = c('within budget');
	const pour = progress(f, scriptH, beat * 2) + progress(f, squared, beat * 2);
	const stripH = AREAS.map((a) => a * COLUMN.frameH);
	const top = COLUMN.y - COLUMN.frameH;
	const budgetInk = progress(f, basic) > 0.5 ? 'cobalt' : 'ink';
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The quadratic sieve pays</SceneTitle>

			<At x={space.margin} y={186}>
				<MixedLine px={size.small} p={progress(f, 6)} parts={['Lemma 6.5: Goldmakher and Louvel’s quadratic large sieve, after Heath-Brown']} />
				<div style={{display: 'inline-block', marginTop: 2, opacity: progress(f, 8, beat * 2)}}>
					<Tex
						px={size.math * 0.72}
						tex={EQ_SIEVE}
						light={{tsMl: {ink: 'cobalt', p: progress(f, rowsCols)}, tsEps: {ink: 'pencil', p: progress(f, tiny)}}}
					/>
				</div>
			</At>
			<At x={space.margin} y={364} w={1180}>
				<MixedLine
					px={size.small}
					p={progress(f, rowsCols)}
					parts={['rows ', {tex: 'k'}, ' up to ', {tex: '\\cH'}, ', columns ', {tex: 'n'}, ' of norm about ', {tex: 'U'}, ': rows plus columns', progress(f, tiny) > 0.5 ? ', up to tiny losses' : '']}
				/>
				<MixedLine px={size.small} ink="ink" p={progress(f, shape)} parts={['the shape from chapter 2', progress(f, bill) > 0.5 ? ', now paying the bill' : '']} />
			</At>
			<BraceFade show={{tsUbR: progress(f, scriptH), tsUbC: progress(f, squared)}} />
			<At x={space.margin} y={458} style={{opacity: progress(f, completed)}}>
				<Tex px={size.math * 0.72} tex={EQ_COMPLETED} show={{tsR: progress(f, scriptH), tsC: progress(f, squared)}} />
			</At>
			<At x={space.margin} y={614} w={1180}>
				<MixedLine
					px={size.small}
					p={progress(f, squared + beat)}
					parts={['precise form, Proposition 5.2: ', {tex: '\\cH+\\cH^{2}\\N(f)/X'}, ', with the twists the sketch suppresses']}
				/>
			</At>

			<Ledger
				x={space.margin}
				y={672}
				w={1060}
				amountW={330}
				rowH={52}
				rules={progress(f, basic)}
				heading={{label: 'At the basic scales', amount: 'size', p: progress(f, basic)}}
				rows={[
					{label: ['needed: about ', {tex: 'X'}], amount: 'X\\asymp D', kind: 'budget', p: progress(f, basic + beat * 0.5)},
					{label: ['rows'], amount: '\\cH\\asymp D^{1-\\vartheta}', kind: 'payment', p: progress(f, basic + beat * 1.5)},
					{label: ['dual columns'], amount: '\\cH^{2}/X\\asymp D^{1-2\\vartheta}', kind: 'payment', p: progress(f, basic + beat * 2.5)},
					{label: ['the sieve’s bill: within budget'], amount: '\\ll D^{1-\\vartheta}', kind: 'total', p: progress(f, within), light: progress(f, within + beat)},
				]}
			/>

			{/* the same account as area: the bill poured into the budget's frame */}
			<AreaColumn
				x={COLUMN.x}
				y={COLUMN.y}
				w={COLUMN.w}
				areas={AREAS}
				budget={1}
				scale={COLUMN.frameH * COLUMN.w}
				filled={pour}
				frameP={progress(f, shape, beat * 2)}
				density="medium"
			/>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<line x1={COLUMN.x} x2={COLUMN.x + COLUMN.w * progress(f, basic, beat * 2)} y1={top} y2={top} stroke={color.cobalt} strokeWidth={stroke.budget} />
			</svg>
			<At x={COLUMN.x} y={top - 50} w={420} style={{whiteSpace: 'nowrap', opacity: progress(f, shape)}}>
				<MixedLine ink={budgetInk} parts={['the budget: about ', {tex: 'X', ink: budgetInk}]} />
			</At>
			<At x={COLUMN.x + COLUMN.w + 22} y={COLUMN.y - stripH[0] / 2 - 22} style={{whiteSpace: 'nowrap', opacity: progress(f, scriptH)}}>
				<MixedLine parts={['rows ', {tex: '\\cH'}]} />
			</At>
			<At x={COLUMN.x + COLUMN.w + 22} y={COLUMN.y - stripH[0] - stripH[1] / 2 - 40} w={210} style={{opacity: progress(f, squared)}}>
				<MixedLine parts={['dual columns ', {tex: '\\cH^{2}/X'}]} />
			</At>
			<At x={COLUMN.x + COLUMN.w + 22} y={top + 30} w={210} style={{opacity: progress(f, within)}}>
				<Text px={size.label} ink="ink">
					room to spare
				</Text>
			</At>
			<Tag kind="schematic" p={progress(f, shape)} style={{position: 'absolute', left: COLUMN.x, top: COLUMN.y + 14}} />

			<SceneLocator />
			<Cite p={progress(f, hb) * (1 - progress(f, completed))}>October manuscript, Lemma 6.5; Goldmakher–Louvel (2013), after Heath-Brown (1995)</Cite>
			<Cite p={progress(f, completed)}>October manuscript, §2.4, (2.15); Proposition 5.2</Cite>
		</>
	);
};

// --- theta-why: the higher-order sieve's extra term would break the count ---

const SIEVE = numerics.sieve as {theta: number; rows: number; columns: number; rows_plus_columns: number; extra: number};
// The figures the narration states, asserted so a recomputation that changes them fails the render.
const EXACT = (a: number, b: number) => Math.abs(a - b) < 1e-9;
if (!EXACT(SIEVE.rows, 1 - SIEVE.theta) || !EXACT(SIEVE.columns, 1 - 2 * SIEVE.theta) || !EXACT(SIEVE.extra, 4 / 3 - 2 * SIEVE.theta))
	throw new Error('numerics.sieve no longer matches D^{1-θ}, D^{1-2θ}, D^{4/3-2θ}');
// Two decimals, with an ellipsis when that truncates (4/3 − 0.2 = 1.1333…).
const fmt = (e: number) => {
	const r = Math.floor(e * 100 + 1e-9) / 100;
	return Math.abs(r - e) < 1e-9 ? `${r}` : `${r.toFixed(2)}\\ldots`;
};
const RULER = {x: 1500, top: 260, bottom: 880, lo: 0.5, hi: 1.25};

const EQ_QUAD = '\\ll\\big(M+L\\big)(ML)^{\\varepsilon}\\textstyle\\sum|\\beta|^{2}';
const EQ_GENERAL =
	'\\ll\\big(M+L\\htmlClass{twEx}{\\debt{{}+\\htmlClass{twS}{\\sout{(\\htmlClass{twMl}{ML})^{\\htmlClass{twTt}{2/3}}}}}}\\big)(ML)^{\\varepsilon}\\textstyle\\sum|\\beta|^{2}';

export const ThetaWhy: React.FC = () => {
	const {frame: f, cue} = useCues();
	const c = (s: string) => cue('theta-6', s);
	const ml = c('M rows and L columns');
	const general = c('the general sieve');
	const extra = c('an extra term');
	const together = c('M L together');
	const twoThirds = c('to the two thirds');
	const rowsHere = c('Here the rows are');
	const rowsExp = c('D to the one minus theta');
	const dual = c('the dual columns');
	const colsExp = c('one minus two theta');
	const sum = c('Rows plus columns');
	const sumExp = c('is about D');
	const extraIs = c('The extra term is');
	const fourThirds = c('four thirds');
	const larger = c('larger by a power of D');
	const fail = c('the count would fail');
	const Y = (e: number) => rulerY(RULER.top, RULER.bottom, RULER.lo, RULER.hi, e);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Why it must be quadratic</SceneTitle>
			<StrikeFade strike={{twS: progress(f, fail, beat * 2)}} />

			<At x={space.margin} y={192}>
				<MixedLine px={size.small} p={progress(f, ml)} parts={['a family with ', {tex: 'M'}, ' rows and ', {tex: 'L'}, ' columns: ', {tex: '\\textstyle\\sum_{\\text{rows}}\\big|\\sum_{\\text{cols}}\\beta\\,\\chi\\big|^{2}'}]} />
			</At>
			<At x={space.margin} y={250} style={{display: 'grid', gridTemplateColumns: '250px auto', rowGap: 22, alignItems: 'center'}}>
				<Text px={size.label} ink="pencil" p={progress(f, 6)}>
					quadratic
				</Text>
				<div style={{opacity: progress(f, 8, beat * 2)}}>
					<Tex px={size.math * 0.78} display={false} tex={EQ_QUAD} />
				</div>
				<Text px={size.label} ink="pencil" p={progress(f, general)}>
					higher order
				</Text>
				<div style={{opacity: progress(f, general)}}>
					<Tex
						px={size.math * 0.78}
						display={false}
						tex={EQ_GENERAL}
						show={{twEx: progress(f, extra), twTt: progress(f, twoThirds)}}
						light={{twMl: {ink: 'ink', p: window(f, together, twoThirds + beat)}}}
					/>
				</div>
			</At>
			<At x={space.margin} y={424}>
				<MixedLine px={size.small} p={progress(f, extra + beat)} parts={['Blomer–Goldmakher–Louvel, Theorem 1.3: ', {tex: 'M'}, ' and ', {tex: 'L'}, ' together, to the two thirds']} />
			</At>

			<Ledger
				x={space.margin}
				y={486}
				w={1040}
				amountW={320}
				rowH={56}
				rules={progress(f, rowsHere)}
				heading={{label: 'At the basic scales', amount: 'size', p: progress(f, rowsHere)}}
				rows={[
					{label: ['rows ', {tex: 'M=\\cH'}], amount: 'D^{1-\\vartheta}', p: progress(f, rowsExp)},
					{label: ['dual columns ', {tex: 'L=\\cH^{2}/X'}], amount: 'D^{1-2\\vartheta}', p: progress(f, colsExp)},
					{label: ['rows plus columns'], amount: '\\asymp D^{1-\\vartheta}', kind: 'payment', p: progress(f, sumExp), light: window(f, sumExp, extraIs)},
					{label: ['the extra term ', {tex: '(ML)^{2/3}'}], amount: 'D^{4/3-2\\vartheta}', kind: 'debt', p: progress(f, fourThirds), light: window(f, fourThirds, fail + beat * 4)},
					{label: ['larger, by'], amount: 'D^{1/3-\\vartheta}', kind: 'debt', p: progress(f, larger)},
				]}
			/>
			<At x={space.margin} y={846} w={1040}>
				<MixedLine px={size.body} ink="vermilion" p={progress(f, fail)} parts={['with it, the bill exceeds the budget: the count fails']} />
			</At>

			{/* the same sizes on one ruler, against the budget at the basic scales */}
			<At x={RULER.x - 120} y={196} w={430}>
				<MixedLine px={size.small} p={progress(f, rowsHere)} parts={['sizes as powers of ', {tex: 'D'}, ', at ', {tex: `\\vartheta=${SIEVE.theta}`}]} />
			</At>
			<ThetaRuler
				{...RULER}
				p={progress(f, rowsHere, beat * 2)}
				ticks={[{e: 0.5, tex: 'D^{1/2}'}]}
				budget={{e: 1, p: progress(f, rowsHere + beat, beat * 2), label: ['needed: about ', {tex: 'X=D', ink: 'cobalt'}]}}
				marks={[
					{e: SIEVE.rows, tex: `D^{${fmt(SIEVE.rows)}}`, words: progress(f, sumExp) > 0.5 ? ['rows + columns'] : ['rows'], p: progress(f, rowsExp)},
					{e: SIEVE.columns, tex: `D^{${fmt(SIEVE.columns)}}`, words: ['dual columns'], p: progress(f, colsExp)},
					{e: SIEVE.extra, tex: `D^{${fmt(SIEVE.extra)}}`, words: [{tex: '(ML)^{2/3}', ink: 'vermilion'}], ink: 'vermilion', p: progress(f, fourThirds)},
				]}
				gap={{from: SIEVE.rows_plus_columns, to: SIEVE.extra, p: progress(f, larger, beat * 2), tex: `D^{${fmt(SIEVE.extra - SIEVE.rows_plus_columns)}}`}}
				over={{from: 1, to: SIEVE.extra, p: progress(f, fail)}}
			/>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: progress(f, sum)}}>
				<line x1={RULER.x} x2={RULER.x} y1={Y(RULER.lo)} y2={Y(SIEVE.rows_plus_columns)} stroke={color.ink} strokeWidth={stroke.bold} />
			</svg>
			<Tag kind="schematic" p={progress(f, rowsHere)} style={{position: 'absolute', left: RULER.x - 120, top: 904}} />

			<SceneLocator />
			<Cite p={progress(f, general)}>October manuscript, §2.4; Blomer–Goldmakher–Louvel (2014), Theorem 1.3</Cite>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'theta-kubota': ThetaKubota,
	'theta-quadratic': ThetaQuadratic,
	'theta-sieve': ThetaSieve,
	'theta-why': ThetaWhy,
};
