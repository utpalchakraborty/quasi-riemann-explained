import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../design/motion';
import {Display, Rule} from '../design/primitives';
import {beat, size, space} from '../design/tokens';
import {ProofMap} from '../diagrams/ProofMap';
import type {Chapter} from '../narration/script';

// Where each chapter sits on the proof map (see ProofMap for the codes).
const STATION: Record<string, number[]> = {
	primes: [],
	cancel: [0],
	eisenstein: [1],
	budget: [1],
	eleven: [2, 3],
	contradiction: [0],
	poisson: [10, 11],
	theta: [12, 13],
	recursion: [14],
	seven: [21],
	back: [20],
	consequences: [20, 21],
};

export const ChapterCard: React.FC<{chapter: Chapter; frames: number}> = ({chapter}) => {
	const f = useCurrentFrame();
	const p = progress(f, 0, beat * 1.5);
	const all = [1, 1, 1, 1];
	return (
		<>
			<div style={{position: 'absolute', left: space.margin, top: 330, width: 760}}>
				<Display px={size.title} ink="gilt" p={p}>
					{chapter.index}
				</Display>
				<Rule width={120} ink="gilt" p={progress(f, beat * 0.5, beat * 1.5)} style={{margin: '28px 0 32px'}} />
				<Display px={size.title} p={progress(f, beat * 0.5)} style={{textWrap: 'balance'}}>
					{chapter.title}
				</Display>
			</div>
			<div style={{position: 'absolute', left: 860, top: 250, width: 1920, height: 1080, transform: 'scale(0.54)', transformOrigin: '0 0', opacity: progress(f, beat * 0.5, beat * 2)}}>
				<ProofMap main={all} engine={[1, 1, 1, 1, 1]} terminal={1} branch={1} current={STATION[chapter.id] ?? []} dim={1} />
			</div>
		</>
	);
};
