import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../design/motion';
import {Display, Rule, Text} from '../design/primitives';
import {beat, size, space} from '../design/tokens';

// Closing credits: sources first, then how the film was made.
export const EndCard: React.FC = () => {
	const f = useCurrentFrame();
	const rows: [string, string][] = [
		['Sources', 'OpenAI, The Quasi-Riemann Hypothesis: A Zero-Free Half-Plane Re(s) > 7/8, 30 September 2026; and The Quasi-Riemann Hypothesis, 5 October 2026'],
		['Status', 'Manuscript claims, explained here and not independently verified'],
		['Numerics', 'Zeta zeros, contours, Möbius sums and residues computed with mpmath and sympy'],
		['Narration', 'ElevenLabs, voice Sarah, Eleven v4'],
		['Made with', 'Remotion, KaTeX, Bodoni Moda and IBM Plex Sans'],
	];
	return (
		<div style={{position: 'absolute', left: space.margin, top: 200, width: 1500}}>
			<Display px={size.title} p={progress(f, 0)}>
				The fixed frontier
			</Display>
			<Rule width={160} ink="gilt" p={progress(f, beat, beat * 2)} style={{margin: '32px 0 48px'}} />
			<div style={{display: 'grid', gridTemplateColumns: '220px 1fr', rowGap: 26, columnGap: 40}}>
				{rows.map(([k, v], i) => (
					<React.Fragment key={k}>
						<Text px={size.label} ink="mist" p={progress(f, beat * (2 + i * 0.5))}>
							{k}
						</Text>
						<Text px={size.label} p={progress(f, beat * (2 + i * 0.5))}>
							{v}
						</Text>
					</React.Fragment>
				))}
			</div>
		</div>
	);
};
