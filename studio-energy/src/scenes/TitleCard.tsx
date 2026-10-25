import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../design/motion';
import {Display, Tag, Text} from '../design/primitives';
import {beat, ease, size, space} from '../design/tokens';
import {FamilyField} from '../diagrams/FamilyField';

// The film's title, after the cold open: the computed family inked in from its
// centre outward, each row a square of side |A_u(D)|, the target lit in cobalt.
export const TitleCard: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<>
			<FamilyField cx={1400} cy={540} unit={19} radius={21.5} reveal={progress(f, 0, beat * 6, ease.inOut)} dots={0.6 * progress(f, 0, beat * 2)} target={progress(f, beat * 3)} />
			<div style={{position: 'absolute', left: space.margin, top: 300, width: 760}}>
				<Display px={size.hero} p={progress(f, beat)}>
					The energy
					<br />
					budget
				</Display>
				<Text px={size.lead} ink="pencil" p={progress(f, beat * 3)} style={{marginTop: 48, width: 640}}>
					How the quasi-Riemann proof pays for cancellation.
				</Text>
			</div>
			<Tag kind="computed" p={progress(f, beat * 4)} style={{position: 'absolute', left: 1180, top: 960}} />
		</>
	);
};
