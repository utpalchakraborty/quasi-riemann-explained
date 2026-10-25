import React from 'react';
import {useCues} from '../cues';
import {progress} from '../design/motion';
import {Tag, Text} from '../design/primitives';
import {At, SceneTitle} from '../design/scene';
import {beat, ease, size, space} from '../design/tokens';
import {FamilyField} from '../diagrams/FamilyField';
import {MixedLine} from '../diagrams/MixedLine';

// The close: the energy-is-area picture reassembles (the computed family, every
// row a square of side |A_u(D)|, the target lit), the film's three sentences,
// then the disclaimer.

export const CloseLedger: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const squares = cue('close-1', 'An energy is a sum of squares');
	const promise = cue('close-1', 'a budget is a promise');
	const none = cue('close-1', 'a fact about none');
	const proved = cue('close-2', 'It can be proved');
	const useful = cue('close-2', 'It is useful');
	const spent = cue('close-2', 'And it is spent');
	const disclaimer = start('close-3');
	const fade = 1 - progress(f, disclaimer - beat, beat * 2);
	const lines: {at: number; parts: Parameters<typeof MixedLine>[0]['parts']; ink?: 'ink' | 'cobalt'}[] = [
		{at: squares, parts: ['An energy is a sum of squares.']},
		{at: promise, parts: ['A budget is a promise about the total.']},
		{at: proved, parts: ['It can be proved: transforms preserve energy, and one sharp inequality prices it.']},
		{at: useful, parts: ['It is useful: arithmetic plants copies of the target inside the family.']},
		{at: spent, parts: ['It is spent by the rule every square obeys: no part is ever negative.']},
	];
	return (
		<>
			<SceneTitle p={progress(f, 4) * fade}>The energy budget</SceneTitle>
			<FamilyField cx={1420} cy={540} unit={17} radius={21} reveal={progress(f, 6, beat * 8, ease.inOut)} dots={0.5} target={progress(f, useful)} opacity={0.35 + 0.65 * fade} />
			<div style={{position: 'absolute', left: space.margin, top: 240, width: 900, display: 'flex', flexDirection: 'column', gap: 30, opacity: fade}}>
				{lines.slice(0, 2).map((l, i) => (
					<MixedLine key={i} parts={l.parts} px={size.body} ink="ink" p={progress(f, l.at)} />
				))}
				<MixedLine p={progress(f, none)} px={size.label} parts={['a fact about none of the members, and a fact about all of them']} italic style={{marginTop: -12}} />
				{lines.slice(2).map((l, i) => (
					<MixedLine key={i} parts={l.parts} px={size.body} ink="ink" p={progress(f, l.at)} />
				))}
			</div>
			<At x={space.margin} y={360} w={880} style={{opacity: progress(f, disclaimer)}}>
				<Text px={size.lead} ink="ink">
					This film explains how the arguments work.
				</Text>
				<Text px={size.body} ink="pencil" style={{marginTop: 28}}>
					It does not certify that they are correct. That is the work of careful readers, and it takes time.
				</Text>
			</At>
			<Tag kind="computed" p={progress(f, beat * 4)} style={{position: 'absolute', left: 1240, top: 920}} />
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'close-ledger': CloseLedger,
};
