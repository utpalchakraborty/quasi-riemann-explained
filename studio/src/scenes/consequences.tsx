import React from 'react';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Cite, Display, Rule, Tag, Text} from '../design/primitives';
import {At, SceneLocator, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {beat, color, ease, size, space, stroke} from '../design/tokens';
import {IDONEAL_LIMIT, idoneal, leastNonResidue, millerExample, nonResidueRecord, squareRootExample} from '../diagrams/frontierData';
import {Residues} from '../diagrams/Residues';

// Chapter 12: what a fixed zero-free line would change. Every number on
// screen is computed in diagrams/frontierData.ts.

const SMALL_P = 23;
const tex = (n: number) => n.toLocaleString('en-US').replace(/,/g, '\\,');
const plain = (n: number) => n.toLocaleString('en-US');

// cons-nonresidue: squares modulo 23, then the worst case below a million.
const ROW_A = {x: space.margin, y: 368, cell: 72, r: 16, n: 22};
const ROW_B = {x: space.margin, y: 628, cell: 33, r: 10, n: 50};

export const ConsNonresidue: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const c1 = (phrase: string) => cue('cons-1', phrase);
	const c2 = (phrase: string) => cue('cons-2', phrase);
	const {at} = nonResidueRecord();
	const big = at[0];
	const nBig = leastNonResidue(big);
	const nSmall = leastNonResidue(SMALL_P);
	const scanA = progress(f, c1('How far must you search'), beat * 3, ease.inOut);
	const scanB = progress(f, c2('where the first'), cue('cons-2', '43') - c2('where the first'), ease.inOut);
	const dimA = 1 - 0.5 * progress(f, start('cons-2'), beat * 2);
	const lift = lerp(150, 0, progress(f, start('cons-2') - beat, beat * 2.5, ease.inOut));
	return (
		<>
			<SceneTitle p={progress(f, 4)}>The first non-square</SceneTitle>

			{/* p = 23 */}
			<div style={{opacity: dimA, position: 'absolute', left: 0, top: lift, width: 1920, height: 1080}}>
				<At x={space.margin} y={222} style={{display: 'flex', alignItems: 'baseline', gap: 40}}>
					<Display px={size.heading} p={progress(f, c1('Pick an odd prime'))}>
						p = {SMALL_P}
					</Display>
					<Text px={size.label} ink="mist" p={progress(f, c1('half are not'))}>
						{(SMALL_P - 1) / 2} squares (filled), {(SMALL_P - 1) / 2} non-squares (hollow) among 1 to {SMALL_P - 1}
					</Text>
				</At>
				<Residues p={SMALL_P} {...ROW_A} reveal={progress(f, 6, beat * 3)} tint={progress(f, c1('Half of the nonzero'), beat * 3)} scan={scanA} labels={() => true} />
				<At x={ROW_A.x + ROW_A.cell * nSmall + 20} y={ROW_A.y - 76} style={{opacity: progress(f, c1('one that is not')), whiteSpace: 'nowrap'}}>
					<Text px={size.label} ink="gilt">
						first non-square: {nSmall}
					</Text>
				</At>
			</div>

			{/* the worst case below a million */}
			<At x={space.margin} y={482} style={{display: 'flex', alignItems: 'baseline', gap: 40}}>
				<Display px={size.heading} p={progress(f, c2('worst case'))}>
					p = {plain(big)}
				</Display>
				<Text px={size.small} ink="mist" p={progress(f, c2('worst case') + beat * 2)} style={{width: 860}}>
					no odd prime below a million has a larger first non-square{at.length > 1 ? `; ${at.slice(1).map(plain).join(', ')} ties it` : ''}
				</Text>
			</At>
			<Residues
				p={big}
				{...ROW_B}
				reveal={progress(f, c2('worst case'), beat * 3)}
				scan={scanB}
				labels={(k) => k === 1 || k % 10 === 0 || k === nBig}
				labelPx={size.micro}
			/>
			<At x={ROW_B.x + ROW_B.cell * (nBig - 0.5) - 330} y={ROW_B.y - 70} w={310} style={{textAlign: 'right', opacity: progress(f, cue('cons-2', '43'))}}>
				<Text px={size.label} ink="gilt">
					first non-square: {nBig}
				</Text>
			</At>
			<Tag kind="computed" p={progress(f, c1('Half of the nonzero'))} style={{position: 'absolute', left: 1560, top: 236}} />

			{/* conjecture and claim */}
			<At x={space.margin} y={760} style={{opacity: progress(f, c2('Vinogradov conjectured'))}}>
				<Text px={size.label} ink="mist">
					Vinogradov’s conjecture
				</Text>
				<div style={{marginTop: 10}}>
					<Tex tex={'n(p)\\ll_{\\varepsilon} p^{\\varepsilon}\\quad\\text{for every }\\varepsilon>0'} px={size.math * 0.85} display={false} />
				</div>
			</At>
			<At x={980} y={760} style={{opacity: progress(f, c2('September manuscript'))}}>
				<Text px={size.label} ink="mist">
					from a fixed zero-free line
				</Text>
				<div style={{marginTop: 10, opacity: progress(f, c2('fixed power of log p'))}}>
					<Tex tex={'n(p)\\le C\\,(\\log p)^{A}'} px={size.math * 0.85} display={false} />
				</div>
			</At>

			<SceneLocator />
			<Cite p={progress(f, c2('September manuscript'))}>September manuscript, Corollary 1.2</Cite>
		</>
	);
};

// cons-list: three consequences as stations; below them, each one's computed example.
const STATION_X = [space.margin, 698, 1268];
const RULE_Y = 232;
const LOWER_Y = 520;
const GRID = {x: space.margin, y: 590, cols: 13, cellW: 128, cellH: 56};

const Station: React.FC<{x: number; p: number; title: string; children: React.ReactNode}> = ({x, p, title, children}) => (
	<At x={x} y={RULE_Y + 26} w={530} style={{opacity: p}}>
		<Text px={size.body}>{title}</Text>
		<div style={{marginTop: 8}}>{children}</div>
	</At>
);

export const ConsList: React.FC = () => {
	const {frame: f, cue} = useCues();
	const c = (phrase: string) => cue('cons-3', phrase);
	const sqrt = squareRootExample();
	const miller = millerExample();
	const list = idoneal();
	const at = [c('square roots'), c('Miller’s primality test'), c('Euler’s list')];
	const reveal = at.map((a) => progress(f, a, beat * 2));
	const grid = c('sixty-five');
	const complete = progress(f, c('confirmed complete'), beat * 2);
	// the lower band shows one example at a time
	const v1 = window(f, at[0] + beat, at[1] - beat);
	const v2 = window(f, at[1] + beat, grid - beat);
	const scan = progress(f, at[0] + beat * 2, c('deterministic algorithm') - at[0] - beat * 2, ease.inOut);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Three consequences</SceneTitle>

			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<line x1={space.margin} x2={space.margin + (1920 - 2 * space.margin) * progress(f, 6, beat * 3, ease.inOut)} y1={RULE_Y} y2={RULE_Y} stroke={color.mist} strokeWidth={stroke.hair} />
				{STATION_X.map((x, i) => (
					<circle key={x} cx={x + 6} cy={RULE_Y} r={6} fill={color.paper} opacity={reveal[i]} />
				))}
			</svg>

			<Station x={STATION_X[0]} p={reveal[0]} title="Square roots modulo a prime">
				<Text px={size.small} ink="mist" p={progress(f, c('deterministic algorithm'))}>
					deterministic, in polynomial time, no coin flips
				</Text>
			</Station>
			<Station x={STATION_X[1]} p={reveal[1]} title="Miller’s primality test">
				<Text px={size.small} ink="mist" p={progress(f, c('deterministic and unconditional'))}>
					deterministic and unconditional
				</Text>
				<Text px={size.micro} ink="mist" p={progress(f, c('deterministic and unconditional') + beat * 2)} style={{marginTop: 8}}>
					Polynomial-time primality testing was already known unconditionally (Agrawal–Kayal–Saxena).
				</Text>
			</Station>
			<Station x={STATION_X[2]} p={reveal[2]} title="Euler’s idoneal numbers">
				<Text px={size.small} ink="mist" p={progress(f, c('open question'))}>
					an open question since the eighteenth century
				</Text>
				<Text px={size.small} p={complete} style={{marginTop: 8}}>
					the list of 65 would be complete
				</Text>
			</Station>

			{/* 1: search for the first non-square, then Tonelli–Shanks */}
			<div style={{opacity: v1}}>
				<At x={space.margin} y={LOWER_Y} style={{whiteSpace: 'nowrap'}}>
					<Text px={size.label} ink="mist">
						p = {plain(sqrt.p)}: test 1, 2, 3, … until one is not a square
					</Text>
				</At>
				<Residues p={sqrt.p} {...ROW_B} y={LOWER_Y + 116} reveal={1} scan={scan} labels={(k) => k === 1 || k % 10 === 0 || k === sqrt.z} labelPx={size.micro} />
				<At x={space.margin} y={LOWER_Y + 200} style={{opacity: progress(f, c('polynomial time')), display: 'flex', alignItems: 'baseline', gap: 36, whiteSpace: 'nowrap'}}>
					<Text px={size.label} ink="mist">
						Tonelli–Shanks with z = {sqrt.z}:
					</Text>
					<Tex tex={`${tex(sqrt.r)}^{2}\\equiv ${sqrt.a}\\pmod{${tex(sqrt.p)}}`} px={size.math} display={false} />
				</At>
			</div>

			{/* 2: one base can lie */}
			<div style={{opacity: v2}}>
				<At x={space.margin} y={LOWER_Y} style={{whiteSpace: 'nowrap', display: 'flex', alignItems: 'baseline', gap: 28}}>
					<Tex tex={`n=${miller.n}=${miller.factors[0]}\\cdot ${miller.factors[1]},\\qquad n-1=${miller.s === 1 ? '2' : `2^{${miller.s}}`}\\cdot ${miller.d}`} px={size.math * 0.85} display={false} />
				</At>
				{[
					{a: miller.liar, pow: miller.liarPow, note: 'looks prime: base 2 is fooled', ink: 'mist' as const},
					{a: miller.witness, pow: miller.witnessPow, note: 'not ±1, so n is composite', ink: 'ember' as const},
				].map((row, i) => (
					<At key={row.a} x={space.margin + 60} y={LOWER_Y + 110 + i * 100} style={{display: 'flex', alignItems: 'baseline', gap: 40, whiteSpace: 'nowrap', opacity: progress(f, at[1] + beat * (2 + 3 * i))}}>
						<Tex tex={`${row.a}^{${miller.d}}\\equiv ${row.pow}\\pmod{${miller.n}}`} px={size.math} display={false} />
						<Text px={size.label} ink={row.ink}>
							{row.note}
						</Text>
					</At>
				))}
			</div>
			<Tag kind="computed" p={Math.max(v1, v2)} style={{position: 'absolute', left: 1560, top: LOWER_Y + 6}} />

			{/* 3: the 65 idoneal numbers, computed */}
			{list.map((n, i) => {
				const col = i % GRID.cols;
				const row = Math.floor(i / GRID.cols);
				return (
					<At key={n} x={GRID.x + col * GRID.cellW} y={GRID.y + row * GRID.cellH} w={GRID.cellW - 24} style={{textAlign: 'right'}}>
						<Text px={size.lead * 0.8} ink="verdigris" p={progress(f, grid + i, beat)}>
							{n}
						</Text>
					</At>
				);
			})}
			<At x={GRID.x} y={GRID.y + 5 * GRID.cellH + 12} style={{opacity: complete}}>
				<Rule width={GRID.cols * GRID.cellW - 24} ink="paper" p={complete} />
			</At>
			<At x={GRID.x} y={GRID.y + 5 * GRID.cellH + 30} style={{display: 'flex', alignItems: 'baseline', gap: 20, opacity: progress(f, grid + beat * 4)}}>
				<Tag kind="computed" />
				<Text px={size.small} ink="mist">
					every n below {plain(IDONEAL_LIMIT)} whose forms of discriminant −4n have one class in each genus: {list.length} numbers
				</Text>
			</At>

			<SceneLocator />
			<Cite p={reveal[0]}>October manuscript, §1</Cite>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'cons-nonresidue': ConsNonresidue,
	'cons-list': ConsList,
};
