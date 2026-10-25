import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../design/motion';
import {Cite, Display, Field, Fraction, Locator, Tag, Text} from '../design/primitives';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, size, space, stroke} from '../design/tokens';
import {AreaColumn, Frame, shelfPack, Square, useHatch} from '../diagrams/Area';
import {Bracket, EnergyRect} from '../diagrams/Energy';
import {ExponentDial} from '../diagrams/ExponentDial';
import {FAMILY, FamilyField} from '../diagrams/FamilyField';
import {Ledger} from '../diagrams/Ledger';
import {MixedLine} from '../diagrams/MixedLine';
import {UpperHalfSpace} from '../diagrams/UpperHalfSpace';
import {WALKS, WalkPlot} from '../diagrams/WalkPlot';
import {TitleCard} from '../scenes/TitleCard';

// Frames for the mood board, rendered by the film's own components. Each one
// demonstrates a rule; the board's captions say which.

const MoodTitle: React.FC = () => (
	<Field>
		<TitleCard />
	</Field>
);

// Energy is area: walks end at S; each end becomes a square of side |S|; the
// squares are poured, area for area, into a frame whose area is N per walk.
const AREA_WALKS = 24;
const AREA_SCALE = 2.6; // px per unit of |S|
const AREA_W = 360; // the frame's width
const MoodArea: React.FC = () => {
	const f = useCurrentFrame();
	const ends = WALKS.final.slice(0, AREA_WALKS).map(Math.abs);
	const {placed} = shelfPack(
		ends.map((s) => s * AREA_SCALE),
		760,
		14,
	);
	const pour = progress(f, beat * 5, beat * 6, ease.inOut);
	return (
		<Field>
			<At x={space.margin} y={84}>
				<Display px={size.heading}>Energy is area</Display>
			</At>
			<WalkPlot x={space.margin + 70} y={290} w={640} h={90} yMax={100} walks={[0, 1, 2].map((i) => ({index: i, p: progress(f, i * 8, beat * 3), ink: 'ink', width: stroke.line, opacity: 1 - 0.45 * i}))} />
			<At x={space.margin} y={420} w={760}>
				<MixedLine p={progress(f, beat * 3)} parts={['each walk ends at ', {tex: 'S'}, '; draw it as a square of side ', {tex: '|S|'}]} />
			</At>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				{placed.map((q, j) => (
					<Square key={q.i} x={space.margin + q.x} y={500 + q.y} side={q.side} p={progress(f, beat * 2 + j * 0.8, beat)} opacity={1 - pour * 0.7} />
				))}
			</svg>
			<AreaColumn x={1100} y={930} w={AREA_W} areas={WALKS.final.slice(0, AREA_WALKS).map((s) => s * s)} budget={AREA_WALKS * WALKS.steps} scale={AREA_SCALE * AREA_SCALE} filled={pour * AREA_WALKS} frameP={progress(f, beat * 4, beat * 2)} />
			<At x={1100 + AREA_W + 30} y={930 - (AREA_WALKS * WALKS.steps * AREA_SCALE * AREA_SCALE) / AREA_W - 12} w={330} style={{opacity: progress(f, beat * 4)}}>
				<MixedLine parts={['the frame: ', {tex: `${AREA_WALKS}\\times N`}]} ink="ink" />
				<MixedLine px={size.small} parts={['area ', {tex: 'N=1000'}, ' per walk']} />
			</At>
			<At x={1100 + AREA_W + 30} y={860} w={330} style={{opacity: pour}}>
				<MixedLine px={size.small} parts={['the same squares, poured in area for area']} />
			</At>
			<Tag kind="computed" p={progress(f, beat * 2)} style={{position: 'absolute', left: space.margin, top: 920}} />
			<Locator index="1" name="What energy means" />
		</Field>
	);
};

// The rows-and-columns law: a family as a table, and the shape of a budget.
const MoodRowsCols: React.FC = () => {
	const f = useCurrentFrame();
	const R = 9;
	const C = 14;
	const cell = 46;
	const ox = 200;
	const oy = 300;
	return (
		<Field>
			<At x={space.margin} y={84}>
				<Display px={size.heading}>Rows and columns</Display>
			</At>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				{Array.from({length: R + 1}, (_, i) => (
					<line key={`r${i}`} x1={ox} x2={ox + C * cell} y1={oy + i * cell} y2={oy + i * cell} stroke={alpha('pencil', i === 0 || i === R ? 0.7 : 0.3)} strokeWidth={stroke.hair} />
				))}
				{Array.from({length: C + 1}, (_, j) => (
					<line key={`c${j}`} x1={ox + j * cell} x2={ox + j * cell} y1={oy} y2={oy + R * cell} stroke={alpha('pencil', j === 0 || j === C ? 0.7 : 0.3)} strokeWidth={stroke.hair} />
				))}
				{Array.from({length: R * C}, (_, k) => {
					const i = Math.floor(k / C);
					const j = k % C;
					// a phase in each cell: the column's character evaluated at the row (schematic)
					const a = ((i + 1) * (j + 2) * 2.1) % (2 * Math.PI);
					const cx = ox + j * cell + cell / 2;
					const cy = oy + i * cell + cell / 2;
					const p = progress(f, k * 0.12, beat);
					return <line key={k} x1={cx} y1={cy} x2={cx + 15 * Math.cos(a) * p} y2={cy - 15 * Math.sin(a) * p} stroke={i === 0 ? color.cobalt : color.viridian} strokeWidth={stroke.line} strokeLinecap="round" />;
				})}
			</svg>
			<At x={ox - 110} y={oy + 8} w={100} style={{textAlign: 'right'}}>
				<MixedLine p={progress(f, beat * 2)} parts={[{tex: 'u=1', ink: 'cobalt'}]} />
			</At>
			<At x={ox} y={oy - 56} w={C * cell}>
				<MixedLine p={progress(f, beat * 2)} parts={['columns ', {tex: 'n'}, ': the terms']} />
			</At>
			<At x={ox - 160} y={oy + R * cell + 16} w={500}>
				<MixedLine p={progress(f, beat * 2)} parts={['rows ', {tex: 'u'}, ': the members']} />
			</At>
			<At x={960} y={330} w={840} style={{opacity: progress(f, beat * 4)}}>
				<Tex px={size.math * 0.72} tex={'\\sum_{\\text{rows}}\\Big|\\sum_{\\text{cols}}\\beta_n\\,\\phi_r(n)\\Big|^2\\ \\ll\\ \\htmlClass{ml}{(M+L)}\\,\\htmlClass{b}{\\sum_n|\\beta_n|^{2}}'} light={{ml: {ink: 'cobalt', p: progress(f, beat * 6)}}} />
			</At>
			<At x={960} y={460} w={760}>
				<MixedLine p={progress(f, beat * 5)} parts={['energy at most rows plus columns, times the energy of the coefficients, up to tiny losses']} />
			</At>
			<Tag kind="schematic" p={progress(f, beat * 2)} style={{position: 'absolute', left: ox, top: oy + R * cell + 70}} />
			<Locator index="2" name="Why a family" />
			<Cite p={progress(f, beat * 4)}>Classical: the large sieve (Iwaniec–Kowalski, ch. 7)</Cite>
		</Field>
	);
};

// The computed family: every row a square on its lattice point, side |A_u(D)|.
const MoodFamily: React.FC = () => {
	const f = useCurrentFrame();
	const zoom = {cx: 1330, cy: 560, unit: 40, radius: 8.6};
	return (
		<Field>
			<At x={space.margin} y={84}>
				<Display px={size.heading}>A real family</Display>
			</At>
			<FamilyField cx={470} cy={590} unit={5.2} reveal={progress(f, 0, beat * 5, ease.inOut)} />
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: progress(f, beat * 4)}}>
				<circle cx={470} cy={590} r={5.2 * zoom.radius} fill="none" stroke={color.pencil} strokeWidth={stroke.hair} />
				<line x1={470 + 5.2 * zoom.radius} y1={590} x2={zoom.cx - zoom.unit * zoom.radius - 20} y2={zoom.cy} stroke={alpha('pencil', 0.6)} strokeWidth={stroke.hair} />
			</svg>
			<FamilyField {...zoom} reveal={progress(f, beat * 4, beat * 4, ease.inOut)} dots={0.7} target={progress(f, beat * 8)} side={(zoom.unit * 0.9) / 40} />
			<At x={space.margin} y={190} w={1200}>
				<MixedLine
					p={progress(f, beat * 2)}
					parts={[{tex: `D=${FAMILY.D}`}, ', ', {tex: `${FAMILY.rows.toLocaleString('en-US').replace(',', '{,}')}`}, ' rows, ', {tex: `${FAMILY.columns}`}, ' columns']}
				/>
			</At>
			<At x={1000} y={900} w={760} style={{textAlign: 'center'}}>
				<MixedLine p={progress(f, beat * 6)} parts={['energy ', {tex: `${FAMILY.energy_over_random.toFixed(2)}`}, ' times what random signs give']} />
			</At>
			<At x={zoom.cx + 56} y={zoom.cy - 60} w={200} style={{opacity: progress(f, beat * 8)}}>
				<MixedLine parts={[{tex: 'u=1', ink: 'cobalt'}]} />
			</At>
			<Tag kind="computed" p={progress(f, beat * 2)} style={{position: 'absolute', left: space.margin, top: 920}} />
			<Locator index="2" name="Why a family" />
		</Field>
	);
};

// Poisson summation reflects the row range through the column scale.
const MoodReflect: React.FC = () => {
	const f = useCurrentFrame();
	const k = progress(f, beat * 4, beat * 5, ease.inOut);
	const X = 420; // column scale D, in px
	const Hh = 560; // H = D^{1.1}, drawn taller than D
	const Hs = (X * X) / Hh; // script H = D^2 / H
	const h = Hh + (Hs - Hh) * k;
	const ox = 620;
	const oy = 900;
	return (
		<Field>
			<At x={space.margin} y={84}>
				<Display px={size.heading}>Poisson reflects the rows</Display>
			</At>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<EnergyRect x={ox} y={oy} w={X} h={Hh} p={1} dash="8 8" ink="pencil" opacity={k} />
				<EnergyRect x={ox} y={oy} w={X} h={h} rows={9} fill={1} p={progress(f, 0, beat * 2)} />
				<EnergyRect x={ox} y={oy} w={X} h={X} p={progress(f, beat * 2)} dash="3 7" ink="pencil" />
				<Bracket x1={ox - 40} y1={oy} x2={ox - 40} y2={oy - h} p={progress(f, beat)} />
				<Bracket x1={ox} y1={oy + 40} x2={ox + X} y2={oy + 40} p={progress(f, beat)} />
			</svg>
			<At x={ox - 200} y={oy - h / 2 - 26} w={150} style={{textAlign: 'right'}}>
				<Tex tex={k < 0.5 ? 'H' : '\\cH'} px={size.math} display={false} />
			</At>
			<At x={ox + X / 2 - 60} y={oy + 56} w={120} style={{textAlign: 'center'}}>
				<Tex tex="D" px={size.math} display={false} />
			</At>
			<At x={1180} y={320} w={620} style={{opacity: progress(f, beat * 3)}}>
				<MixedLine parts={['rows ', {tex: 'H=D^{1+\\vartheta}'}, ' become dual rows']} />
				<Tex px={size.math} tex={'\\cH\\asymp\\frac{D^{2}}{H}=D^{1-\\vartheta},\\qquad H\\cdot\\cH\\asymp D^{2}'} style={{marginTop: 18}} />
				<MixedLine p={progress(f, beat * 9)} px={size.small} parts={['dotted: the square, rows equal to columns']} style={{marginTop: 18}} />
			</At>
			<Tag kind="schematic" p={1} style={{position: 'absolute', left: 1180, top: 600}} />
			<Locator index="5" name="Proving it, I: the dual side" />
			<Cite>October manuscript, §2.3</Cite>
		</Field>
	);
};

// The theta function: a symmetry of hyperbolic three-space, and the twist it leaves.
const MoodTheta: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<Field>
			<At x={space.margin} y={84}>
				<Display px={size.heading}>The theta function pays</Display>
			</At>
			<UpperHalfSpace x={560} y={760} s={190} p={progress(f, 0, beat * 3)} domes={progress(f, beat, beat * 3)} point={progress(f, beat * 3)} move={progress(f, beat * 5, beat * 4, ease.inOut)} />
			<At x={1140} y={330} w={700}>
				<Tex
					px={size.mathLarge * 0.8}
					tex={'\\htmlClass{a}{\\chi_p^{-1}}\\,\\htmlClass{b}{\\chi_p^{-2}}=\\chi_p^{-3}=\\htmlClass{c}{\\chi_p^{3}}'}
					light={{a: {ink: 'viridian', p: progress(f, beat * 3)}, b: {ink: 'viridian', p: progress(f, beat * 4)}, c: {ink: 'cobalt', p: progress(f, beat * 7)}}}
				/>
				<MixedLine p={progress(f, beat * 6)} parts={['a sixth root of one, cubed, is ', {tex: '\\pm1'}, ': the twist is quadratic']} style={{marginTop: 24}} />
			</At>
			<Tag kind="schematic" p={1} style={{position: 'absolute', left: space.margin, top: 900}} />
			<Locator index="6" name="Proving it, II: the theta function pays" />
			<Cite>October manuscript, §2.4, equation (2.14)</Cite>
		</Field>
	);
};

// The ledger: what the budget buys and what it costs, line by line.
const MoodLedger: React.FC = () => {
	const f = useCurrentFrame();
	const at = (i: number) => progress(f, beat * (1 + i * 1.6));
	return (
		<Field>
			<At x={space.margin} y={84}>
				<Display px={size.heading}>The ledger</Display>
			</At>
			<Ledger
				x={space.margin + 40}
				y={240}
				w={1300}
				amountW={460}
				heading={{label: 'Spending the budget', amount: 'size, in powers of D', p: at(0)}}
				rows={[
					{label: ['the budget: every row'], amount: 'D^{2+\\vartheta+\\varepsilon}', kind: 'budget', p: at(1)},
					{label: ['kept: ', {tex: 'J\\asymp Y/\\log Y'}, ' copies of the target'], amount: '\\le D^{2+\\vartheta+\\varepsilon}', kind: 'entry', p: at(2)},
					{label: ['the error on each copy, squared'], amount: '(D/Y)^{2}', kind: 'debt', p: at(3)},
					{label: ['divided among the copies'], amount: '\\div\\, J', kind: 'payment', p: at(4)},
					{label: ['the target, squared'], amount: 'D^{\\frac{11}{6}+\\frac{5\\vartheta}{6}+\\varepsilon}', kind: 'total', p: at(5)},
				]}
			/>
			<At x={1560} y={560} w={240} style={{textAlign: 'center'}}>
				<Fraction n="11" d="12" px={170} p={at(6)} />
			</At>
			<Tag kind="claim" p={at(1)} style={{position: 'absolute', left: space.margin + 40, top: 640}} />
			<Locator index="4" name="Spending it" />
			<Cite p={at(1)}>October manuscript, §3, equation (3.2)</Cite>
		</Field>
	);
};

// The exponent dial: the film's arithmetic, with the manuscript's case lit.
const MoodDial: React.FC = () => {
	const f = useCurrentFrame();
	const k = 1 + 11 * progress(f, beat, beat * 6, ease.inOut);
	const settle = progress(f, beat * 7, beat * 3, ease.inOut);
	const kk = k + (6 - k) * settle;
	return (
		<Field>
			<At x={space.margin} y={84}>
				<Display px={size.heading}>Where provable meets useful</Display>
			</At>
			<ExponentDial cx={1080} cy={780} r={400} k={kk} lit={progress(f, beat * 9)} />
			<At x={space.margin} y={220} w={520}>
				<MixedLine p={progress(f, 6)} parts={['if the twist had order ', {tex: 'k'}, ', the same spending would give ', {tex: 'D^{e(k)}'}]} />
			</At>
			<Tag kind="schematic" p={1} style={{position: 'absolute', left: space.margin, top: 400}} />
			<At x={space.margin} y={440} w={500} style={{opacity: progress(f, beat * 9)}}>
				<MixedLine px={size.small} parts={['the film’s arithmetic; only ', {tex: 'k=6', ink: 'cobalt'}, ' is the manuscript’s']} />
			</At>
			<Locator index="3" name="Two demands" />
			<Cite p={progress(f, beat * 9)}>October manuscript, §3 (for k = 6)</Cite>
		</Field>
	);
};

// Hatching carries magnitude by density, never by a new colour.
const MoodHatch: React.FC = () => {
	const f = useCurrentFrame();
	const light = useHatch('ink', 'light');
	const medium = useHatch('ink', 'medium');
	const dense = useHatch('ink', 'dense');
	const debt = useHatch('vermilion', 'medium', 0.9);
	const target = useHatch('cobalt', 'medium', 0.9);
	const items = [
		{id: light.id, label: 'light', x: 200},
		{id: medium.id, label: 'medium', x: 500},
		{id: dense.id, label: 'dense', x: 800},
		{id: target.id, label: 'the target', x: 1180},
		{id: debt.id, label: 'a debt', x: 1480},
	];
	return (
		<Field>
			<At x={space.margin} y={84}>
				<Display px={size.heading}>Area, hatched</Display>
			</At>
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<defs>
					{light.defs}
					{medium.defs}
					{dense.defs}
					{debt.defs}
					{target.defs}
				</defs>
				{items.map((it, i) => (
					<Square key={it.label} x={it.x} y={360} side={220} fill={`url(#${it.id})`} p={progress(f, i * 6, beat * 2)} ink={it.label === 'a debt' ? 'vermilion' : it.label === 'the target' ? 'cobalt' : 'ink'} />
				))}
				<Frame x={160} y={320} w={900} h={300} p={progress(f, beat * 4, beat * 2)} />
				<line x1={1140} x2={1740} y1={680} y2={680} stroke={color.cobalt} strokeWidth={stroke.budget} opacity={progress(f, beat * 5)} />
			</svg>
			{items.map((it) => (
				<At key={it.label} x={it.x} y={it.x < 1100 ? 640 : 600} w={220} style={{textAlign: 'center'}}>
					<Text px={size.small} ink="pencil">
						{it.label}
					</Text>
				</At>
			))}
			<At x={160} y={700} w={900}>
				<MixedLine p={progress(f, beat * 4)} px={size.small} parts={['a frame: the bold outline of a budget']} />
			</At>
			<At x={1140} y={700} w={600}>
				<MixedLine p={progress(f, beat * 5)} px={size.small} parts={['the budget line, heaviest stroke']} />
			</At>
		</Field>
	);
};

export const MOODS: Record<string, React.FC> = {MoodTitle, MoodArea, MoodRowsCols, MoodFamily, MoodReflect, MoodTheta, MoodLedger, MoodDial, MoodHatch};
