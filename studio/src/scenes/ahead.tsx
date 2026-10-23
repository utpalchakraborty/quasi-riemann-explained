import React from 'react';
import numerics from '../data/numerics.json';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Cite, Display, Fraction, Tag, Text} from '../design/primitives';
import {At, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {alpha, beat, color, ease, size, space, stroke} from '../design/tokens';
import {StripMap} from '../diagrams/StripMap';
import {Topo} from '../diagrams/Topo';
import {BORDER_MAP} from './open';

// The coda: back to the survey map of the cold open, then the relief.

const zeros = numerics.zeta_zero_heights as number[];
const SIGMA: [number, number] = [-0.04, 1.06]; // as in the cold open
const sx = (s: number) => BORDER_MAP.x + ((s - SIGMA[0]) / (SIGMA[1] - SIGMA[0])) * BORDER_MAP.w;

// Proven regions, drawn to show their shape (the same curves as the cold open).
const dvp = (t: number) => 0.5 / Math.log(t);
const vk = (t: number) => 0.35 / (Math.pow(Math.log(t), 2 / 3) * Math.pow(Math.log(Math.log(t)), 1 / 3));
const powTex = (v: number) => (v === 10 ? '10' : `10^{${Math.round(Math.log10(v))}}`);

export const AheadMap: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const c1 = (phrase: string) => cue('ahead-1', phrase);
	const c2 = (phrase: string) => cue('ahead-2', phrase);
	const regions = progress(f, c1('proven regions'), beat * 3);
	const thin = progress(f, c1('thinning toward the edge'), beat * 6, ease.inOut);
	const line = progress(f, c1('a line that does not move'), beat * 3);
	const seven = progress(f, c1('seven eighths'), beat * 2);
	const height = progress(f, c1('at every height'), beat * 8, ease.inOut);
	const every = progress(f, c1('every character'));
	const half = progress(f, c2('line one half'), beat * 3);
	const between = progress(f, c2('Between seven eighths'), beat * 2);
	const rest = progress(f, c2('rest of the Riemann hypothesis'));
	const believe = progress(f, c2('much of what we believe'));
	const say = progress(f, c2('say so themselves'));
	const top = Math.pow(10, lerp(3, 12, thin) + 28 * height);
	const p1 = 1 - progress(f, start('ahead-2') - beat, beat);
	const p2 = progress(f, start('ahead-2'), beat);
	const band = {left: sx(0.5), right: sx(7 / 8), y: BORDER_MAP.y + 34};
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Where the line stands</SceneTitle>

			{/* ahead-1: the ledger, then the line */}
			<At x={space.margin} y={250} w={780} style={{opacity: p1}}>
				<Text px={size.label} ink="mist" p={progress(f, c1('A century and a half'))}>
					proven regions, every one thinning toward σ = 1
				</Text>
				<div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10, opacity: regions}}>
					<Tex tex={'\\sigma>1-\\dfrac{c}{\\log t}'} px={size.label + 4} display={false} ink="mist" />
					<Tex tex={'\\sigma>1-\\dfrac{c}{(\\log t)^{2/3}(\\log\\log t)^{1/3}}'} px={size.label + 4} display={false} ink="mist" />
				</div>
				<Text px={size.label} italic ink="mist" p={progress(f, c1('If these manuscripts'))} style={{marginTop: 56}}>
					If the manuscripts are right:
				</Text>
				<div style={{display: 'flex', alignItems: 'center', gap: 40, marginTop: 18}}>
					<Fraction n="7" d="8" px={120} p={seven} />
					<div>
						<Text px={size.body} p={progress(f, c1('at every height'))}>
							at every height
						</Text>
						<Text px={size.body} p={every}>
							for every character
						</Text>
					</div>
				</div>
			</At>

			{/* ahead-2: what is left */}
			<At x={space.margin} y={250} w={800} style={{opacity: p2}}>
				<div style={{display: 'flex', alignItems: 'center', gap: 28}}>
					<Fraction n="1" d="2" px={96} ink="paper" p={half} />
					<div style={{width: 160 * between, height: stroke.line, background: alpha('mist', 0.8)}} />
					<Fraction n="7" d="8" px={96} p={between} />
				</div>
				<Display px={size.lead} p={rest} style={{marginTop: 40, width: 760}}>
					the rest of the Riemann hypothesis
				</Display>
				<Text px={size.body} ink="mist" p={believe} style={{marginTop: 14, width: 760}}>
					and much of what we believe about the primes but cannot prove
				</Text>
				<Text px={size.label} italic p={say} style={{marginTop: 44, width: 720}}>
					“The theorem does not establish the Riemann hypothesis or its generalized versions, which place nontrivial zeros on Re s = 1/2.”
				</Text>
			</At>

			<StripMap
				id="ahead"
				{...BORDER_MAP}
				sigma={SIGMA}
				t={[10, top]}
				log
				axes={progress(f, 2, beat * 2)}
				strip={progress(f, 2, beat * 2)}
				zeros={{heights: zeros, p: progress(f, 2, beat * 3), r: 3, halo: false}}
				regions={[
					{width: dvp, p: regions, hatch: regions * (1 - 0.6 * line), tMin: 10},
					{width: vk, p: regions, hatch: 0, dash: '6 8', tMin: 10},
				]}
				frontiers={[
					{sigma: 0.5, ink: 'paper' as const, label: '\\tfrac12', p: half},
					{sigma: 7 / 8, ink: 'gilt' as const, label: '\\tfrac78', p: line, hatch: seven},
				].filter((fr) => fr.p > 0)}
				tTicks={[10, 1e10, 1e20, 1e30, 1e40].filter((v) => v <= top * 1.01)}
				tTickTex={powTex}
			/>
			{/* the unsurveyed ground between 1/2 and 7/8: no hatch, only a name */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<g opacity={between}>
					<line x1={band.left + 10} x2={band.right - 10} y1={band.y} y2={band.y} stroke={color.mist} strokeWidth={stroke.line} />
					<line x1={band.left + 10} x2={band.left + 10} y1={band.y - 10} y2={band.y + 10} stroke={color.mist} strokeWidth={stroke.line} />
					<line x1={band.right - 10} x2={band.right - 10} y1={band.y - 10} y2={band.y + 10} stroke={color.mist} strokeWidth={stroke.line} />
				</g>
			</svg>
			<At x={band.left} y={band.y + 16} w={band.right - band.left} style={{textAlign: 'center', opacity: between}}>
				<Text px={size.label} italic ink="mist">
					unsurveyed
				</Text>
			</At>
			<Tag kind="claim" p={seven} style={{position: 'absolute', left: BORDER_MAP.x + 16, top: BORDER_MAP.y + 14}} />

			<Cite p={say}>September manuscript, §1</Cite>
		</>
	);
};

// The closing image: the cold open's survey of log|zeta|, now with the gilt
// line, drifting slowly up the strip.
const RELIEF = {x: 530, y: 104, w: 860, h: 790};
const TOPO_SIGMA: [number, number] = [-0.2, 1.2]; // the landscape grid in numerics.json
const reliefX = (s: number) => RELIEF.x + ((s - TOPO_SIGMA[0]) / (TOPO_SIGMA[1] - TOPO_SIGMA[0])) * RELIEF.w;

export const AheadClose: React.FC = () => {
	const {frame: f, cue, frames} = useCues();
	const c = (phrase: string) => cue('ahead-3', phrase);
	const drift = progress(f, 0, frames, ease.drift);
	const holds = progress(f, c('If this line holds'), beat * 4);
	const border = window(f, c('A border that holds'), c('And beyond it'), beat * 3);
	const beyond = progress(f, c('ground is still unsurveyed'), beat * 3);
	const t0 = lerp(8, 17, drift);
	return (
		<>
			<Topo
				{...RELIEF}
				t={[t0, t0 + 23]}
				lines={progress(f, 0, c('read slowly'), ease.inOut)}
				zeros={progress(f, c('line by line'), beat * 4)}
				frontier={holds > 0 ? {sigma: 7 / 8, p: holds, hatch: holds * (0.6 + 0.4 * border)} : undefined}
			/>
			<At x={reliefX(7 / 8) - 50} y={RELIEF.y - 74} w={100} style={{textAlign: 'center', opacity: holds}}>
				<Tex tex={'\\tfrac78'} px={size.lead} ink="gilt" display={false} />
			</At>
			<At x={reliefX(0.5)} y={RELIEF.y + RELIEF.h + 18} w={reliefX(7 / 8) - reliefX(0.5)} style={{textAlign: 'center', opacity: beyond}}>
				<Text px={size.label} italic ink="mist">
					unsurveyed
				</Text>
			</At>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'ahead-map': AheadMap,
	'ahead-close': AheadClose,
};
