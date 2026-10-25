import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../design/motion';
import {Display, Rule, Text} from '../design/primitives';
import {beat, size, space} from '../design/tokens';

// Closing credits: sources first, then how the film was made.
export const EndCard: React.FC = () => {
	const f = useCurrentFrame();
	const rows: [string, string][] = [
		['Source', 'OpenAI, The Quasi-Riemann Hypothesis, 5 October 2026: §2 and §§3–7; with the September 30 manuscript for the closing chapter'],
		['Status', 'Manuscript claims, explained here and not independently verified'],
		['Numerics', 'Random walks, the twisted family at D = 2000, copies and Gauss sums, computed with NumPy (scripts/compute_data.py)'],
		['Narration', 'ElevenLabs, voice Sarah, Eleven v4'],
		['Companion', 'The Fixed Frontier, the whole argument in one film'],
		['Made with', 'Remotion, KaTeX, Bodoni Moda and IBM Plex Sans'],
	];
	return (
		<div style={{position: 'absolute', left: space.margin, top: 190, width: 1560}}>
			<Display px={size.title} p={progress(f, 0)}>
				The energy budget
			</Display>
			<Rule width={160} ink="cobalt" p={progress(f, beat, beat * 2)} style={{margin: '32px 0 48px'}} />
			<div style={{display: 'grid', gridTemplateColumns: '220px 1fr', rowGap: 24, columnGap: 40}}>
				{rows.map(([k, v], i) => (
					<React.Fragment key={k}>
						<Text px={size.label} ink="pencil" p={progress(f, beat * (2 + i * 0.5))}>
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
