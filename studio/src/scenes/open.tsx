import React from 'react';
import numerics from '../data/numerics.json';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Display, Tag, Text} from '../design/primitives';
import {At} from '../design/scene';
import {Tex} from '../design/Tex';
import {beat, ease, size, space} from '../design/tokens';
import {StripMap} from '../diagrams/StripMap';
import {Topo} from '../diagrams/Topo';
import {Landscape3D} from '../diagrams/Landscape3D';

const zeros = numerics.zeta_zero_heights as number[];

// The map frame shared by the cold open, so the three scenes read as one shot.
const MAP = {x: 900, y: 96, w: 860, h: 800};
const SIGMA: [number, number] = [-0.2, 1.2]; // matches the topographic grid
const sigmaX = (s: number) => MAP.x + ((s - SIGMA[0]) / (SIGMA[1] - SIGMA[0])) * MAP.w;

const StripLabels: React.FC<{p: number; half?: number}> = ({p, half = p}) => (
	<>
		{[
			{s: 0, tex: '0', o: p},
			{s: 0.5, tex: '\\tfrac12', o: half},
			{s: 1, tex: '1', o: p},
		].map((l) => (
			<At key={l.s} x={sigmaX(l.s) - 40} y={MAP.y + MAP.h + 16} w={80} style={{textAlign: 'center', opacity: l.o}}>
				<Tex tex={l.tex} px={size.label} ink="mist" display={false} />
			</At>
		))}
	</>
);

export const OpenRiemann: React.FC = () => {
	const {frame: f, cue, start, frames} = useCues();
	const strip = cue('open-1', 'narrow strip');
	const half = cue('open-1', 'one line');
	const second = start('open-2');
	const slide = progress(f, second, cue('open-2', 'Every one') - second + beat * 4, ease.inOut);
	return (
		<>
			{/* left: the year and the memoir */}
			<At x={space.margin} y={250} w={700} style={{opacity: 1 - progress(f, second - beat, beat * 1.5)}}>
				<Display px={size.hero} p={progress(f, 6)}>
					1859
				</Display>
				<Text px={size.body} ink="mist" italic p={progress(f, cue('open-1', 'Bernhard Riemann'))} style={{marginTop: 24, width: 620}}>
					Bernhard Riemann, Ueber die Anzahl der Primzahlen unter einer gegebenen Grösse
				</Text>
				<div style={{marginTop: 48, opacity: progress(f, cue('open-1', 'zeta function'))}}>
					<Tex px={size.math} display={false} tex={'\\zeta(s)=\\sum_{n=1}^{\\infty}\\frac{1}{n^{s}}'} />
				</div>
			</At>

			{/* left, second passage: the count */}
			<At x={space.margin} y={300} w={700}>
				<Display px={size.hero} p={progress(f, cue('open-2', 'ten trillion'))}>
					10<sup style={{fontSize: '0.5em', verticalAlign: '0.9em'}}>13</sup>
				</Display>
				<Text px={size.lead} ink="mist" p={progress(f, cue('open-2', 'ten trillion') + beat)} style={{marginTop: 20}}>
					zeros located by computer
				</Text>
				<Text px={size.lead} p={progress(f, cue('open-2', 'Every one'))} style={{marginTop: 8}}>
					every one on the line ½
				</Text>
			</At>

			{/* right: the strip, surveyed */}
			<div style={{opacity: 1 - progress(f, second, beat * 2)}}>
				<Topo
					x={MAP.x}
					y={MAP.y}
					w={MAP.w}
					h={MAP.h}
					t={[9, 40]}
					lines={progress(f, strip, beat * 4)}
					zeros={progress(f, half, beat * 3)}
				/>
			</div>
			<div style={{position: 'absolute', left: 760, top: 0, width: 1160, height: 1080, opacity: progress(f, second - beat, beat * 2)}}>
				{f >= second - beat * 2 && (
					<Landscape3D width={1160} height={1080} travel={0.05 + 0.95 * slide} tilt={progress(f, second, beat * 5, ease.inOut)} lines={1} zeros={1} />
				)}
			</div>
			<div style={{opacity: 1 - progress(f, second - beat, beat * 2)}}>
				<StripLabels p={progress(f, cue('open-1', 'between zero and one'))} half={progress(f, half)} />
			</div>
			<Tag kind="computed" p={progress(f, half + beat * 2) * (1 - progress(f, second - beat, beat))} style={{position: 'absolute', left: MAP.x, top: MAP.y - 52}} />
			<Tag kind="computed" p={progress(f, cue('open-2', 'Every one') + beat) * (1 - progress(f, frames - beat * 2))} style={{position: 'absolute', left: space.margin, top: 660}} />
		</>
	);
};

// Proven zero-free regions, drawn to show their shape, not their published constants.
const dvp = (t: number) => 0.5 / Math.log(t);
const vk = (t: number) => 0.35 / (Math.pow(Math.log(t), 2 / 3) * Math.pow(Math.log(Math.log(t)), 1 / 3));
const powTex = (v: number) => (v === 10 ? '10' : `10^{${Math.round(Math.log10(v))}}`);

const Ledger: React.FC<{year: string; who: string; tex?: string; p: number}> = ({year, who, tex, p}) => (
	<div style={{display: 'grid', gridTemplateColumns: '150px 1fr', columnGap: 24, alignItems: 'baseline', opacity: p}}>
		<Display px={size.heading} p={p}>
			{year}
		</Display>
		<div>
			<Text px={size.label} ink="mist" p={p}>
				{who}
			</Text>
			{tex && (
				<div style={{marginTop: 6}}>
					<Tex tex={tex} px={size.label + 2} display={false} />
				</div>
			)}
		</div>
	</div>
);

export const BORDER_MAP = {x: 1000, y: 110, w: 760, h: 780};

export const OpenBorder: React.FC = () => {
	const {frame: f, cue} = useCues();
	const climb = cue('open-4', 'greater heights');
	const top = Math.pow(10, lerp(3, 12, progress(f, climb, beat * 9, ease.inOut)));
	return (
		<>
			<At x={space.margin} y={92}>
				<Display px={size.heading} p={progress(f, 4)}>
					What can be proved
				</Display>
			</At>
			<At x={space.margin} y={260} w={800} style={{display: 'flex', flexDirection: 'column', gap: 46}}>
				<Ledger year="1896" who="Hadamard; de la Vallée Poussin. No zeros on the line σ = 1, which gives the prime number theorem." p={progress(f, cue('open-3', 'In 1896'))} />
				<Ledger year="1899" who="de la Vallée Poussin" tex={'\\sigma > 1-\\dfrac{c}{\\log t}'} p={progress(f, cue('open-4', 'Three years later'))} />
				<Ledger
					year="1958"
					who="Vinogradov; Korobov"
					tex={'\\sigma > 1-\\dfrac{c}{(\\log t)^{2/3}(\\log\\log t)^{1/3}}'}
					p={progress(f, cue('open-4', 'Vinogradov and Korobov'))}
				/>
			</At>
			<StripMap
				id="border"
				{...BORDER_MAP}
				sigma={[-0.04, 1.06]}
				t={[10, top]}
				log
				zeros={{heights: zeros, p: progress(f, 0, beat * 3), r: 3, halo: false}}
				edge={window(f, cue('open-3', 'sigma equals one'), cue('open-4', 'Three years later'))}
				regions={[
					{width: dvp, p: progress(f, cue('open-4', 'into a sliver'), beat * 3), hatch: progress(f, cue('open-4', 'into a sliver'), beat * 3), tMin: 10},
					{width: vk, p: progress(f, cue('open-4', 'Vinogradov and Korobov'), beat * 3), hatch: 0, dash: '6 8', tMin: 10},
				]}
				tTicks={[10, 1e3, 1e6, 1e9, 1e12]}
				tTickTex={powTex}
			/>
			<Tag kind="schematic" p={progress(f, cue('open-4', 'into a sliver') + beat * 3)} style={{position: 'absolute', left: BORDER_MAP.x + 60, top: BORDER_MAP.y - 56}} />
		</>
	);
};

export const OpenClaim: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const claimP = progress(f, start('open-6'), beat * 1.5);
	const seven = cue('open-6', 'seven eighths');
	const eleven = cue('open-6', 'eleven twelfths');
	const height = cue('open-6', 'every height');
	const top = Math.pow(10, lerp(12, 40, progress(f, height, beat * 6, ease.inOut)));
	const qrh = progress(f, cue('open-5', 'quasi-Riemann hypothesis'));
	const sweep = progress(f, cue('open-5', 'any fixed vertical line'), cue('open-5', 'keeps every zero', 'end') - cue('open-5', 'any fixed vertical line'), ease.inOut);
	const candidate = 0.97 - 0.07 * Math.sin(sweep * Math.PI);
	const last = progress(f, start('open-7'));
	return (
		<>
			{/* open-5: the question */}
			<At x={space.margin} y={250} w={760} style={{opacity: 1 - claimP}}>
				<Display px={size.title} p={progress(f, 6)}>
					167 years
				</Display>
				<Text px={size.body} ink="mist" p={progress(f, cue('open-5', 'any fixed vertical line'))} style={{marginTop: 48, width: 640}}>
					Is there one line, short of the edge, with no zero to its right at any height?
				</Text>
				<div style={{marginTop: 28, whiteSpace: 'nowrap', opacity: progress(f, cue('open-5', 'keeps every zero'))}}>
					<Tex px={size.mathInline} display={false} tex={'\\exists\\,\\sigma_0<1:\\quad \\zeta(s)\\neq 0\\ \\text{ for }\\ \\Re s>\\sigma_0'} />
				</div>
				<Display px={size.lead} italic ink="mist" p={qrh} style={{marginTop: 40}}>
					a quasi-Riemann hypothesis
				</Display>
			</At>

			{/* open-6: the two manuscripts */}
			<At x={space.margin} y={210} w={780} style={{opacity: claimP * (1 - last), display: 'flex', flexDirection: 'column', gap: 44}}>
				<div>
					<Text px={size.small} ink="mist" p={progress(f, cue('open-6', 'September thirtieth'))}>
						30 September 2026
					</Text>
					<Display px={size.lead} p={progress(f, cue('open-6', 'September thirtieth'))} style={{marginTop: 6}}>
						The Quasi-Riemann Hypothesis: A Zero-Free Half-Plane Re(s) &gt; 7/8
					</Display>
				</div>
				<div>
					<Text px={size.small} ink="mist" p={progress(f, cue('open-6', 'five days later'))}>
						5 October 2026
					</Text>
					<Display px={size.lead} p={progress(f, cue('open-6', 'five days later'))} style={{marginTop: 6}}>
						The Quasi-Riemann Hypothesis
					</Display>
				</div>
				<div style={{opacity: progress(f, cue('open-6', 'every Dirichlet'))}}>
					<Tex
						px={size.math * 0.8}
						display={false}
						tex={'\\zeta(s),\\ \\ L(s,\\chi_{4}),\\ \\ L(s,\\chi_{5}),\\ \\ L(s,\\chi_{7}),\\ \\ \\dots'}
					/>
					<Text px={size.label} ink="mist" style={{marginTop: 10}}>
						every character, every modulus, one line
					</Text>
				</div>
			</At>

			{/* open-7: what this film is */}
			<At x={space.margin} y={330} w={720} style={{opacity: last}}>
				<Display px={size.title} p={last}>
					Explained,
					<br />
					not certified
				</Display>
				<Text px={size.body} ink="mist" p={progress(f, cue('open-7', 'careful readers'))} style={{marginTop: 40, width: 620}}>
					The film follows the manuscripts’ arguments. Whether they are correct is for careful readers to settle.
				</Text>
			</At>

			<StripMap
				id="claim"
				{...BORDER_MAP}
				sigma={[-0.04, 1.06]}
				t={[10, top]}
				log
				zeros={{heights: zeros, p: 1, r: 3, halo: false}}
				regions={[{width: dvp, p: 1, hatch: 1 - claimP * 0.6, tMin: 10}]}
				frontiers={[
					{sigma: candidate, ink: 'mist', p: sweep > 0 && claimP < 1 ? 1 - claimP : 0},
					{sigma: 7 / 8, ink: 'gilt', label: '\\tfrac78', labelOffset: [-22, 0], p: progress(f, seven, beat * 3), hatch: progress(f, seven + beat * 2, beat * 3)},
					{sigma: 11 / 12, ink: 'gilt', label: '\\tfrac{11}{12}', labelOffset: [40, 0], p: progress(f, eleven, beat * 3), hatch: 0},
				]}
				tTicks={[10, 1e10, 1e20, 1e30, 1e40].filter((v) => v <= top * 1.01)}
				tTickTex={powTex}
			/>
			<Tag kind="claim" p={progress(f, seven + beat * 3)} style={{position: 'absolute', left: BORDER_MAP.x + 60, top: BORDER_MAP.y - 56}} />
		</>
	);
};
