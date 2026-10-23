import React from 'react';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Cite, Tag, Text} from '../design/primitives';
import {At, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, size, space, stroke} from '../design/tokens';
import {PI7, primeOfNorm, ROOT_TEX, sexticSymbol} from '../diagrams/EisArith';
import {Family} from '../diagrams/Family';
import {eisNorm, eisPoint, Lattice} from '../diagrams/Lattice';
import {BumpPlot, NormAnnulus} from '../diagrams/NormAnnulus';
import {PhaseWheel} from '../diagrams/PhaseWheel';

// Chapter: The Eisenstein world. Scenes are added here and listed in `scenes` by scene id.

// One lattice frame for the chapter, so its scenes read as one place.
const LAT = {cx: 1330, cy: 540, unit: 52, radius: 7.2};

const toScreen = (a: number, b: number, unit = LAT.unit): [number, number] => {
	const [x, y] = eisPoint(a, b);
	return [LAT.cx + unit * x, LAT.cy - unit * y];
};

// Edges of the triangular lattice: each point to its neighbours 1, omega, 1 + omega.
const EDGES = (() => {
	const out: [number, number, number, number][] = [];
	const R = Math.ceil(LAT.radius * 1.3);
	const inside = (a: number, b: number) => Math.hypot(...eisPoint(a, b)) <= LAT.radius;
	for (let a = -R; a <= R; a++)
		for (let b = -R; b <= R; b++) {
			if (!inside(a, b)) continue;
			for (const [da, db] of [
				[1, 0],
				[0, 1],
				[1, 1],
			])
				if (inside(a + da, b + db)) out.push([a, b, a + da, b + db]);
		}
	return out;
})();

const Arrow: React.FC<{to: [number, number]; from?: [number, number]; ink?: 'paper' | 'mist' | 'verdigris'; p: number; dash?: string}> = ({to, from = [LAT.cx, LAT.cy], ink = 'paper', p, dash}) => {
	const [x0, y0] = from;
	const x1 = lerp(x0, to[0], p);
	const y1 = lerp(y0, to[1], p);
	const th = Math.atan2(y1 - y0, x1 - x0);
	const head = 14;
	return (
		<g opacity={p > 0 ? 1 : 0}>
			<line x1={x0} y1={y0} x2={x1} y2={y1} stroke={color[ink]} strokeWidth={stroke.bold} strokeDasharray={dash} strokeLinecap="round" />
			{p > 0.6 && !dash && (
				<path
					d={`M${x1},${y1}L${x1 - head * Math.cos(th - 0.45)},${y1 - head * Math.sin(th - 0.45)}M${x1},${y1}L${x1 - head * Math.cos(th + 0.45)},${y1 - head * Math.sin(th + 0.45)}`}
					stroke={color[ink]}
					strokeWidth={stroke.bold}
					strokeLinecap="round"
					fill="none"
				/>
			)}
		</g>
	);
};

const Label: React.FC<{at: [number, number]; tex: string; p: number; ink?: 'paper' | 'mist' | 'gilt' | 'verdigris'; dx?: number; dy?: number; px?: number}> = ({
	at,
	tex,
	p,
	ink = 'paper',
	dx = 0,
	dy = 0,
	px = size.label + 4,
}) => (
	<At x={at[0] + dx - 100} y={at[1] + dy - px * 0.7} w={200} style={{textAlign: 'center', opacity: p}}>
		<Tex tex={tex} px={px} ink={ink} display={false} />
	</At>
);

export const EisLattice: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const second = start('eis-2');
	const enter = cue('eis-1', 'richer number system');
	const ab = cue('eis-1', 'a plus b omega');
	const cube = cue('eis-1', 'cube root');
	const tri = cue('eis-1', 'triangular lattice');
	const units = cue('eis-1', 'six units');
	const left = 1 - progress(f, second, beat * 1.5, ease.inOut);
	const latDim = 1 - 0.6 * progress(f, second, beat * 2);
	const basis = window(f, ab, tri + beat * 2) ;
	const example = window(f, ab + beat * 2, cube);
	const cubeP = window(f, cube, units + beat);
	const one = toScreen(1, 0);
	const om = toScreen(0, 1);
	const om2 = toScreen(-1, -1);
	const ex = toScreen(3, 2);
	const three = toScreen(3, 0);
	// eis-2: one Hecke L-function, two Dirichlet factors, and the line coming down to both.
	const factor = cue('eis-2', 'as a factor');
	const lineHere = cue('eis-2', 'a line proved here');
	const down = progress(f, cue('eis-2', 'comes back down'), beat * 2.5, ease.inOut);
	const TOP: [number, number] = [470, 300];
	const L1: [number, number] = [270, 520];
	const L2: [number, number] = [690, 520];
	const branch = progress(f, factor, beat * 2, ease.inOut);
	const glyph = (x: number, y: number, p: number) => (
		<g opacity={p}>
			<line x1={x} x2={x} y1={y - 26} y2={y + 26} stroke={color.gilt} strokeWidth={stroke.frontier} strokeLinecap="round" style={{filter: `drop-shadow(0 0 8px ${alpha('gilt', 0.6)})`}} />
		</g>
	);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>A six-fold world</SceneTitle>
			<div style={{opacity: latDim}}>
				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: progress(f, tri, beat * 3)}}>
					{EDGES.map(([a, b, c, d]) => {
						const [x1, y1] = toScreen(a, b);
						const [x2, y2] = toScreen(c, d);
						return <line key={`${a},${b},${c},${d}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={alpha('mist', 0.2)} strokeWidth={stroke.hair} />;
					})}
				</svg>
				<Lattice cx={LAT.cx} cy={LAT.cy} unit={LAT.unit} radius={LAT.radius} points={progress(f, Math.min(enter, 30), beat * 5)} units={progress(f, units, beat * 2)} />
				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
					<Arrow to={one} p={progress(f, ab, beat) * (basis > 0 ? 1 : 0) * Math.min(1, basis * 1.2)} />
					<Arrow to={om} p={progress(f, ab + beat * 0.5, beat) * Math.min(1, basis * 1.2)} />
					<g opacity={example}>
						<Arrow from={[LAT.cx, LAT.cy]} to={three} ink="verdigris" p={progress(f, ab + beat * 2, beat)} dash="2 9" />
						<Arrow from={three} to={ex} ink="verdigris" p={progress(f, ab + beat * 3, beat)} dash="2 9" />
						<circle cx={ex[0]} cy={ex[1]} r={12} fill="none" stroke={color.verdigris} strokeWidth={stroke.line} />
					</g>
					<g opacity={cubeP}>
						<polygon points={[one, om, om2].map((q) => q.join(',')).join(' ')} fill="none" stroke={color.paper} strokeWidth={stroke.line} />
						{[one, om, om2].map((q, i) => (
							<circle key={i} cx={q[0]} cy={q[1]} r={8} fill={color.paper} />
						))}
					</g>
				</svg>
				<Label at={one} tex={'1'} p={Math.min(basis, 1 - cubeP)} dx={4} dy={36} />
				<Label at={om} tex={'\\omega'} p={Math.max(Math.min(1, basis * 1.2) * progress(f, ab + beat * 0.5), cubeP)} dx={-30} dy={-26} />
				<Label at={ex} tex={'3+2\\omega'} p={example} ink="verdigris" dx={50} dy={-34} />
				<Label at={one} tex={'1'} p={cubeP} dx={30} dy={-6} />
				<Label at={om2} tex={'\\omega^{2}'} p={cubeP} dx={-34} dy={26} />
			</div>

			{/* eis-1: the definitions */}
			<div style={{opacity: left}}>
				<At x={space.margin} y={220} style={{opacity: progress(f, cue('eis-1', 'Eisenstein integers'))}}>
					<Tex px={size.math} display={false} tex={'a+b\\,\\omega,\\qquad a,b\\in\\mathbb{Z}'} />
				</At>
				<At x={space.margin} y={340} style={{opacity: progress(f, cube - beat)}}>
					<Tex px={size.math} display={false} tex={'\\omega=e^{2\\pi i/3},\\qquad \\omega^{3}=1'} />
				</At>
				<At x={space.margin} y={460} style={{opacity: progress(f, tri)}}>
					<Tex px={size.math} display={false} tex={'\\N(a+b\\omega)=a^{2}-ab+b^{2}'} />
					<Text px={size.label} ink="mist" style={{marginTop: 10}}>
						the norm: squared distance from 0
					</Text>
				</At>
				<At x={space.margin} y={640} style={{opacity: progress(f, units)}}>
					<Tex px={size.math} display={false} tex={'\\gilt{\\pm1,\\ \\pm\\omega,\\ \\pm\\omega^{2}}'} />
					<Text px={size.label} ink="mist" style={{marginTop: 10}} p={progress(f, cue('eis-1', 'sixth roots'))}>
						the six units: norm 1, the six sixth roots of one
					</Text>
				</At>
			</div>

			{/* eis-2: the factorization */}
			<div style={{opacity: progress(f, second, beat * 1.5)}}>
				<At x={TOP[0] - 250} y={TOP[1] - 40} w={500} style={{textAlign: 'center'}}>
					<Tex tex={'L_K(s,\\chi\\circ\\N)'} px={size.lead} display={false} />
				</At>
				<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
					{[L1, L2].map((to, i) => (
						<line
							key={i}
							x1={TOP[0]}
							y1={TOP[1] + 40}
							x2={lerp(TOP[0], to[0], branch)}
							y2={lerp(TOP[1] + 40, to[1] - 44, branch)}
							stroke={alpha('mist', 0.8)}
							strokeWidth={stroke.line}
						/>
					))}
					{glyph(TOP[0] + 190, TOP[1] + 4, progress(f, lineHere) * (1 - down * 0.65))}
					{[L1, L2].map((to, i) => glyph(lerp(TOP[0] + 190, to[0] + 170, down), lerp(TOP[1] + 4, to[1] + 4, down), down))}
				</svg>
				<At x={TOP[0] + 210} y={TOP[1] - 36} style={{opacity: progress(f, lineHere)}}>
					<Tex tex={'\\tfrac{11}{12}'} px={size.lead} ink="gilt" display={false} />
				</At>
				{[
					{at: L1, tex: 'L(s,\\chi)'},
					{at: L2, tex: 'L(s,\\chi\\chi_{-3})'},
				].map((n, i) => (
					<At key={i} x={n.at[0] - 200} y={n.at[1] - 40} w={400} style={{textAlign: 'center', opacity: progress(f, factor + beat * (1 + i * 0.5))}}>
						<Tex tex={n.tex} px={size.lead} display={false} />
					</At>
				))}
				<At x={space.margin} y={640} style={{opacity: progress(f, cue('eis-2', 'L-function of this field'))}}>
					<Tex tex={'L_K(s,\\chi\\circ\\N)=L(s,\\chi)\\,L(s,\\chi\\chi_{-3})'} px={size.label + 10} display={false} />
					<Text px={size.small} ink="mist" style={{marginTop: 10, width: 780}}>
						up to finitely many Euler factors, none of them zero for Re s &gt; 0
					</Text>
					<Tex tex={'\\chi_{-3}:\\ \\text{the nontrivial character modulo } 3'} px={size.small} ink="mist" display={false} style={{marginTop: 4}} />
				</At>
				<At x={space.margin} y={810} style={{opacity: progress(f, cue('eis-2', 'zeta and all'))}}>
					<Tex tex={'\\chi=1:\\qquad \\zeta_K(s)=\\zeta(s)\\,L(s,\\chi_{-3})'} px={size.label + 6} display={false} />
				</At>
			</div>
			<Cite p={progress(f, second + beat * 2)}>October manuscript, §3</Cite>
			<SceneLocator />
		</>
	);
};

// eis-target: the target sum, laid out on the lattice.
const D = 60;
const ZOOM = {unit: 28, radius: 11.4};

export const EisTarget: React.FC = () => {
	const {frame: f, cue} = useCues();
	const pull = progress(f, 0, beat * 3, ease.inOut);
	const unit = lerp(LAT.unit, ZOOM.unit, pull);
	const radius = lerp(LAT.radius, ZOOM.radius, pull);
	const mobius = cue('eis-3', 'Möbius values');
	const normD = cue('eis-3', 'norm about D');
	const terms = cue('eis-3', 'about D terms');
	const goal = cue('eis-3', 'The goal');
	const smaller = cue('eis-3', 'much smaller');
	const ring = progress(f, normD, beat * 2);
	const rIn = ZOOM.unit * Math.sqrt(D);
	const rOut = ZOOM.unit * Math.sqrt(2 * D);
	// the schematic comparison, log D across, log size up
	const CMP = {x: 200, y: 706, w: 520, h: 166};
	const line = (slope: number, p: number) => `M${CMP.x},${CMP.y + CMP.h}L${CMP.x + CMP.w * p},${CMP.y + CMP.h - CMP.h * slope * p}`;
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The target sum</SceneTitle>
			<Lattice cx={LAT.cx} cy={LAT.cy} unit={unit} radius={radius} points={1} units={1 - pull} />
			<NormAnnulus cx={LAT.cx} cy={LAT.cy} unit={unit} D={D} p={progress(f, mobius, beat * 4, ease.inOut)} rings={ring} />
			<At x={LAT.cx - rIn + 18} y={LAT.cy - 20} style={{opacity: ring}}>
				<Tex tex={'\\N\\nn=D'} px={size.small} ink="gilt" display={false} />
			</At>
			<At x={LAT.cx + rOut * Math.cos(Math.PI / 5) + 14} y={LAT.cy - rOut * Math.sin(Math.PI / 5) - 48} style={{opacity: ring}}>
				<Tex tex={'\\N\\nn=2D'} px={size.small} ink="gilt" display={false} />
			</At>

			<At x={space.margin} y={196} style={{opacity: progress(f, cue('eis-3', 'the target'))}}>
				<Tex
					px={size.math}
					tex={'\\gilt{A_1(D)}=\\sum_{\\nn}\\htmlClass{mu}{\\mu(\\nn)}\\,\\htmlClass{nu}{\\nu(\\nn)}\\,\\htmlClass{W}{W\\!\\left(\\tfrac{\\N\\nn}{D}\\right)}'}
					light={{
						mu: {ink: 'verdigris', p: progress(f, mobius)},
						nu: {ink: 'verdigris', p: progress(f, cue('eis-3', 'fixed character'))},
					}}
				/>
			</At>
			<At x={space.margin} y={366} w={820}>
				<div style={{opacity: progress(f, normD)}}>
					<Tex tex={`\\text{lit: ideals with } D<\\N\\nn<2D,\\ \\text{prime to } 6;\\ D=${D}`} px={size.label} ink="mist" display={false} />
				</div>
				<Text px={size.label} ink="mist" p={progress(f, terms)} style={{marginTop: 6}}>
					about D terms, each of size at most 1
				</Text>
			</At>
			<BumpPlot x={180} y={500} w={300} h={80} p={progress(f, cue('eis-3', 'smooth sum'), beat * 3, ease.inOut)} />
			<At x={510} y={510} w={300} style={{opacity: progress(f, cue('eis-3', 'smooth sum') + beat)}}>
				<Tex tex={'W\\ \\text{on}\\ y=\\N\\nn/D'} px={size.label} display={false} />
				<Text px={size.small} ink="mist" style={{marginTop: 4}}>
					a smooth bump on (1, 2)
				</Text>
			</At>

			{/* the goal, schematically: much smaller than D */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: progress(f, goal)}}>
				<line x1={CMP.x} x2={CMP.x + CMP.w} y1={CMP.y + CMP.h} y2={CMP.y + CMP.h} stroke={alpha('mist', 0.7)} strokeWidth={stroke.line} />
				<line x1={CMP.x} x2={CMP.x} y1={CMP.y} y2={CMP.y + CMP.h} stroke={alpha('mist', 0.7)} strokeWidth={stroke.line} />
				<path d={line(1, progress(f, goal, beat * 2, ease.inOut))} stroke={color.mist} strokeWidth={stroke.line} strokeDasharray="10 8" fill="none" />
				<path d={line(0.72, progress(f, smaller, beat * 2, ease.inOut))} stroke={color.gilt} strokeWidth={stroke.bold} fill="none" />
			</svg>
			<At x={CMP.x + CMP.w + 14} y={CMP.y - 22} style={{opacity: progress(f, goal + beat)}}>
				<Tex tex={'D'} px={size.label} ink="mist" display={false} />
			</At>
			<At x={CMP.x + CMP.w + 14} y={CMP.y + CMP.h * 0.28 - 24} style={{opacity: progress(f, smaller + beat)}}>
				<Tex tex={'|\\gilt{A_1(D)}|\\ll D^{1-\\delta+\\varepsilon}'} px={size.label} display={false} />
			</At>
			<At x={CMP.x} y={CMP.y + CMP.h + 12} w={CMP.w} style={{opacity: progress(f, goal)}}>
				<Text px={size.small} ink="mist">
					log D →
				</Text>
			</At>
			<Tag kind="schematic" p={progress(f, goal + beat * 2)} style={{position: 'absolute', left: CMP.x + 140, top: CMP.y + CMP.h + 12}} />
			<Tag kind="computed" p={progress(f, mobius + beat * 3)} style={{position: 'absolute', left: 1566, top: 792}} />
			<At x={1566} y={828} w={226} style={{opacity: progress(f, mobius + beat * 3)}}>
				<Text px={size.micro} ink="mist">
					filled μ = +1, hollow −1
					<br />
					six marks per ideal
				</Text>
			</At>
			<At x={CMP.x + 8} y={CMP.y - 34} style={{opacity: progress(f, goal)}}>
				<Text px={size.small} ink="mist">
					log size
				</Text>
			</At>
			<Cite p={progress(f, cue('eis-3', 'the target'))}>October manuscript, §2, Step 1</Cite>
			<SceneLocator />
		</>
	);
};

// eis-family: the sextic residue symbol, computed for pi = 3 + omega, then the family.
const WHEELS = Array.from({length: 7}, (_, i) => {
	const u = i + 1;
	const k = sexticSymbol([u, 0], PI7);
	return {u, k};
});
const PRIMES_U1 = [7, 13, 19, 31, 37, 43, 61].map((p) => {
	const [a, b] = primeOfNorm(p);
	if (eisNorm(a, b) !== p) throw new Error('bad prime');
	return `${a}+${b === 1 ? '' : b}\\omega`;
});
const WH = {x0: 250, dx: 186, y: 500, r: 58};

export const EisFamily: React.FC = () => {
	const {frame: f, cue} = useCues();
	const symbols = cue('eis-4', 'sextic residue symbols');
	const each = cue('eis-4', 'for each n');
	const zero = cue('eis-4', 'or zero');
	const insert = cue('eis-4', 'Insert it');
	const family = cue('eis-4', 'becomes a family');
	const setOne = cue('eis-4', 'Set u equal');
	const phaseOne = cue('eis-4', 'every phase is one');
	const target = cue('eis-4', 'our target');
	const turn = progress(f, setOne, beat * 3, ease.inOut);
	const relabel = progress(f, setOne + beat, beat * 1.5);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>A twist makes a family</SceneTitle>
			<At x={space.margin} y={196} style={{opacity: progress(f, symbols)}}>
				<Tex
					px={size.math * 0.9}
					display={false}
					tex={'\\verd{\\chi_{\\nn}(u)}=\\Big(\\frac{u}{\\nn}\\Big)_{6}\\htmlClass{vals}{\\ \\in\\ \\{1,\\,-\\omega^{2},\\,\\omega,\\,-1,\\,\\omega^{2},\\,-\\omega\\}\\cup\\{0\\}}'}
					show={{vals: progress(f, cue('eis-4', 'sixth root'))}}
				/>
			</At>
			<At x={1500} y={WH.y - 90} w={300} style={{opacity: progress(f, each)}}>
				<div style={{opacity: 1 - relabel}}>
					<Tex tex={'\\nn=(3+\\omega)'} px={size.label + 2} display={false} />
					<Text px={size.small} ink="mist" style={{marginTop: 6}}>
						a prime ideal of norm 7
					</Text>
				</div>
			</At>
			<At x={1500} y={WH.y - 90} w={300} style={{opacity: relabel}}>
				<Tex tex={'u=1'} px={size.label + 2} display={false} />
				<Text px={size.small} ink="mist" style={{marginTop: 6}}>
					and seven different primes
				</Text>
			</At>
			{WHEELS.map(({u, k}, i) => {
				const cx = WH.x0 + i * WH.dx;
				const p = progress(f, k === null ? zero : each + i * beat * 0.7);
				const from = k ?? 0;
				const to = from > 3 ? 6 : 0;
				const angle = lerp(from, to, turn);
				const isZero = k === null;
				return (
					<React.Fragment key={u}>
						<At x={cx - 90} y={WH.y - WH.r - 62} w={180} style={{textAlign: 'center', opacity: p * (1 - relabel)}}>
							<Tex tex={`u=${u}`} px={size.label} ink="mist" display={false} />
						</At>
						<At x={cx - 90} y={WH.y - WH.r - 62} w={180} style={{textAlign: 'center', opacity: relabel}}>
							<Tex tex={`\\nn=${PRIMES_U1[i]}`} px={size.small} ink="mist" display={false} />
						</At>
						{isZero && (
							<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: p * (1 - relabel)}}>
								<circle cx={cx} cy={WH.y} r={WH.r} fill="none" stroke={alpha('mist', 0.5)} strokeWidth={stroke.hair} strokeDasharray="4 6" />
								<circle cx={cx} cy={WH.y} r={6} fill={color.mist} />
							</svg>
						)}
						<PhaseWheel cx={cx} cy={WH.y} r={WH.r} angle={isZero ? 0 : angle} p={isZero ? relabel : p} lit={turn >= 1 || turn === 0 ? [Math.round(angle) % 6] : []} />
						<At x={cx - 90} y={WH.y + WH.r + 18} w={180} style={{textAlign: 'center', opacity: p * (1 - relabel)}}>
							<Tex tex={k === null ? '0' : ROOT_TEX[k]} px={size.label + 4} ink="verdigris" display={false} />
						</At>
						<At x={cx - 90} y={WH.y + WH.r + 18} w={180} style={{textAlign: 'center', opacity: relabel}}>
							<Tex tex={'1'} px={size.label + 4} ink="verdigris" display={false} />
						</At>
					</React.Fragment>
				);
			})}
			<At x={1500} y={WH.y + 30} w={300} style={{opacity: progress(f, zero) * (1 - relabel)}}>
				<Tex tex={'\\chi_{\\nn}(7)=0:\\ \\ 3+\\omega\\mid 7'} px={size.small} ink="mist" display={false} />
			</At>
			<Tag kind="computed" p={progress(f, each + beat * 3)} style={{position: 'absolute', left: 1500, top: WH.y + 110}} />

			<At x={space.margin} y={700} style={{opacity: progress(f, 8) * (1 - progress(f, insert, beat))}}>
				<Tex px={size.math * 0.85} tex={'\\gilt{A_1(D)}=\\sum_{\\nn}\\mu(\\nn)\\,\\nu(\\nn)\\,W\\!\\left(\\tfrac{\\N\\nn}{D}\\right)'} />
			</At>
			<At x={space.margin} y={700} style={{opacity: progress(f, insert + beat * 0.5)}}>
				<Tex
					px={size.math * 0.85}
					tex={'A_{\\htmlClass{u}{u}}(D)=\\sum_{\\nn}\\mu(\\nn)\\,\\nu(\\nn)\\,\\verd{\\chi_{\\nn}(u)}\\,W\\!\\left(\\tfrac{\\N\\nn}{D}\\right)'}
					light={{u: {ink: 'gilt', p: progress(f, phaseOne)}}}
				/>
			</At>
			<At x={space.margin} y={830} style={{opacity: progress(f, phaseOne)}}>
				<Tex px={size.label + 4} display={false} tex={'\\chi_{\\nn}(1)=1\\ \\text{ for every }\\nn,\\ \\text{ so }\\ A_{\\gilt{1}}(D)\\ \\text{is the target}'} />
			</At>
			<div style={{opacity: progress(f, family - beat)}}>
			<Family
				x={1060}
				y={860}
				w={730}
				h={170}
				rows={40}
				p={progress(f, family, beat * 4, ease.inOut)}
				targetLit={progress(f, phaseOne)}
				labelTarget="u = 1"
			/>
			</div>
			<At x={1052} y={860 - 170 * 0.45 - 46} style={{opacity: progress(f, target)}}>
				<Text px={size.small} ink="gilt">
					the target
				</Text>
			</At>
			<At x={1060} y={686} style={{opacity: progress(f, cue('eis-4', 'one member for each'))}}>
				<Tex tex={'\\text{one member } A_u(D) \\text{ for each } u'} px={size.small} ink="mist" display={false} />
			</At>
			<Tag kind="schematic" p={progress(f, family + beat * 3)} style={{position: 'absolute', left: 1560, top: 878}} />
			<Cite p={progress(f, insert)}>October manuscript, §2, equation (2.2)</Cite>
			<SceneLocator />
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'eis-lattice': EisLattice,
	'eis-target': EisTarget,
	'eis-family': EisFamily,
};
