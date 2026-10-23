import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../design/motion';
import {Display, Text} from '../design/primitives';
import {beat, size, space} from '../design/tokens';
import {Topo} from '../diagrams/Topo';

// The film's title, after the cold open: the survey with the frontier drawn in.
export const TitleCard: React.FC = () => {
	const f = useCurrentFrame();
	return (
		<>
			<Topo
				x={820}
				y={-40}
				w={1160}
				h={1160}
				t={[9, 40]}
				lines={0.55 * progress(f, 0, beat * 3)}
				zeros={progress(f, beat)}
				frontier={{sigma: 7 / 8, p: progress(f, beat * 2, beat * 3), hatch: progress(f, beat * 4, beat * 3)}}
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
		</>
	);
};
