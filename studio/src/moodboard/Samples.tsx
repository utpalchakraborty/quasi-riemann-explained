import React from 'react';
import {useCurrentFrame} from 'remotion';
import numerics from '../data/numerics.json';
import {progress} from '../design/motion';
import {Cite, Display, Field, Fraction, Locator, Tag, Text} from '../design/primitives';
import {Tex} from '../design/Tex';
import {beat, size, space} from '../design/tokens';
import {Lattice} from '../diagrams/Lattice';
import {MobiusWalk} from '../diagrams/MobiusWalk';
import {ProofMap} from '../diagrams/ProofMap';
import {StripMap} from '../diagrams/StripMap';
import {Topo} from '../diagrams/Topo';
import {Landscape3D} from '../diagrams/Landscape3D';

const zeros = numerics.zeta_zero_heights as number[];

export const MoodTitle: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<Field>
			<Topo
				x={820}
				y={-40}
				w={1160}
				h={1160}
				t={[9, 40]}
				lines={0.55 * progress(f, 0, beat * 4)}
				zeros={progress(f, beat * 2)}
				frontier={{sigma: 7 / 8, p: progress(f, beat * 4, beat * 4), hatch: progress(f, beat * 7, beat * 3)}}
			/>
			<div style={{position: 'absolute', left: space.margin, top: 300, width: 760}}>
				<Display px={size.hero} p={progress(f, beat)}>
					The fixed
					<br />
					frontier
				</Display>
				<Text px={size.lead} ink="mist" p={progress(f, beat * 3)} style={{marginTop: 48, width: 640}}>
					How two manuscripts from 2026 claim a line that no zeta zero crosses, at any height.
				</Text>
			</div>
		</Field>
	);
};

export const MoodMap: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<Field>
			<div style={{position: 'absolute', left: space.margin, top: 190, width: 560}}>
				<Display px={size.title}>One line for every height</Display>
				<Text px={size.body} ink="mist" style={{marginTop: 36}}>
					Classical regions hug the edge and thin out as you climb. The manuscripts claim a border that does not move.
				</Text>
				<div style={{marginTop: 48, display: 'flex', flexDirection: 'column', gap: 14}}>
					<Tag kind="computed" />
					<Tag kind="schematic" />
					<Tag kind="claim" />
				</div>
			</div>
			<StripMap
				id="map"
				x={880}
				y={190}
				w={820}
				h={700}
				sigma={[-0.04, 1.06]}
				t={[0, 110]}
				zeros={{heights: zeros, p: progress(f, 0, beat * 5)}}
				classical={{c: 1 / 5.573412, p: progress(f, beat * 2, beat * 3)}}
				frontiers={[
					{sigma: 7 / 8, ink: 'gilt', label: '\\tfrac78', p: progress(f, beat * 5, beat * 3), hatch: progress(f, beat * 7, beat * 3)},
				]}
				tTicks={[20, 50, 80, 110]}
			/>
			<Locator index="1" name="The frontier" />
			<Cite>September manuscript, Theorem 1.1</Cite>
		</Field>
	);
};

export const MoodProofMap: React.FC = () => {
	const f = useCurrentFrame();
	const main = [0, 1, 2, 3].map((i) => progress(f, beat * (1 + i * 1.5)));
	const engine = [0, 1, 2, 3, 4].map((i) => progress(f, beat * (7 + i)));
	return (
		<Field>
			<div style={{position: 'absolute', left: space.margin, top: 96}}>
				<Display px={size.title}>The proof in four moves</Display>
			</div>
			<ProofMap main={main} engine={engine} current={2} terminal={progress(f, beat * 12)} branch={progress(f, beat * 13, beat * 2)} />
		</Field>
	);
};

export const MoodEquation: React.FC = () => {
	const f = useCurrentFrame();
	const lit = progress(f, beat * 4);
	const root = progress(f, beat * 7);
	return (
		<Field>
			<div style={{position: 'absolute', left: space.margin, top: 96}}>
				<Display px={size.title}>Where eleven twelfths comes from</Display>
			</div>
			<div style={{position: 'absolute', left: space.margin, top: 300, display: 'flex', flexDirection: 'column', gap: 34, alignItems: 'flex-start'}}>
				<Tex
					px={size.math}
					tex={'\\sum_{0<\\N(u)\\le H}|A_u(D)|^2 \\ll D^{1+\\varepsilon}H,\\qquad H=D^{1+\\vartheta}'}
					show={{}}
				/>
				<Tex
					px={size.math}
					tex={'|A_1(D)|^2 \\ll \\frac{D^{1+\\varepsilon}H}{\\htmlClass{copies}{Y/\\log Y}} + \\Big(\\ember{\\frac DY}\\Big)^2,\\quad Y=H^{1/6}'}
					light={{copies: {ink: 'verdigris', p: lit}}}
				/>
				<Tex
					px={size.math}
					tex={'D\\,H^{5/6} = D^{\\,1+\\frac56(1+\\vartheta)} = D^{\\,\\frac{11}{6}+\\frac{5\\vartheta}{6}}'}
					style={{opacity: progress(f, beat * 5)}}
				/>
				<Tex
					px={size.mathLarge}
					tex={'|A_1(D)| \\ll D^{\\,\\gilt{\\frac{11}{12}}+\\frac{5\\vartheta}{12}+\\varepsilon}'}
					style={{opacity: root}}
				/>
			</div>
			<div style={{position: 'absolute', left: 1500, top: 330, width: 300, textAlign: 'center'}}>
				<Fraction n="11" d="12" px={220} p={root} />
			</div>
			<Locator index="5" name="Where eleven twelfths comes from" />
			<Cite>October manuscript, §3, equation (3.2)</Cite>
		</Field>
	);
};

export const MoodChart: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<Field>
			<div style={{position: 'absolute', left: space.margin, top: 96, width: 1300}}>
				<Display px={size.title}>The signs nearly cancel</Display>
			</div>
			<div style={{position: 'absolute', left: space.margin, top: 250}}>
				<Tex px={size.math} tex={'M(x)=\\sum_{n\\le x}\\verd{\\mu(n)}'} />
			</div>
			<MobiusWalk x={260} y={420} w={1400} h={460} upto={progress(f, 0, beat * 8) * 1200} envelope={progress(f, beat * 8)} />
			<div style={{position: 'absolute', left: 1680, top: 470}}>
				<Tex px={size.label} tex={'\\mist{+\\sqrt{x}}'} display={false} />
			</div>
			<Tag kind="computed" style={{position: 'absolute', left: 1280, top: 290}} />
			<Locator index="2" name="From zeros to cancellation" />
		</Field>
	);
};

export const MoodLattice: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<Field>
			<Lattice cx={600} cy={540} unit={46} radius={9.5} points={progress(f, 0, beat * 5)} primes={0} units={progress(f, beat * 9)} />
			<div style={{position: 'absolute', left: 1160, top: 230, width: 680}}>
				<Display px={size.title}>A six-fold world</Display>
				<div style={{marginTop: 48, display: 'flex', flexDirection: 'column', gap: 30, whiteSpace: 'nowrap'}}>
					<Tex px={size.math} tex={'\\OO=\\mathbb Z[\\omega],\\quad \\omega=e^{2\\pi i/3}'} display={false} />
					<Tex px={size.math} tex={'\\N(a+b\\omega)=a^2-ab+b^2'} display={false} />
				</div>
				<Text px={size.body} ink="mist" style={{marginTop: 40}}>
					Integers of the form a + bω form a triangular lattice with six units.
				</Text>
				<Tag kind="computed" style={{marginTop: 30}} />
			</div>
			<Locator index="3" name="The Eisenstein world" />
		</Field>
	);
};

export const MoodTopo: React.FC = () => {
	const f = useCurrentFrame();
	const tilt = progress(f, beat * 4, beat * 6);
	return (
		<Field>
			<div style={{position: 'absolute', left: space.margin, top: 96, width: 620}}>
				<Display px={size.title}>A survey of the strip</Display>
				<Text px={size.body} ink="mist" style={{marginTop: 36}}>
					Contours of the size of zeta. Every zero is a well; so far, every well lies on the line one half.
				</Text>
				<Tag kind="computed" style={{marginTop: 36}} />
			</div>
			<Topo x={860} y={70} w={900} h={900} t={[10, 40]} tilt={tilt} lines={progress(f, 0, beat * 3)} fill={tilt} zeros={progress(f, beat * 3)} turn={-14 * tilt} />
			<Locator index="1" name="The frontier" />
		</Field>
	);
};

export const MoodLandscape: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<Field>
			<Landscape3D width={1920} height={1080} travel={f / 179} lines={1} zeros={1} />
		</Field>
	);
};
