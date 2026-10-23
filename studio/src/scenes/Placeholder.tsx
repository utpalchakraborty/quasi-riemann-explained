import React from 'react';
import {useCues, useSceneInfo} from '../cues';
import {Display, Text} from '../design/primitives';
import {alpha, color, font, size, space} from '../design/tokens';

// Animatic stand-in: shows the scene id and the narration, lighting the word
// being spoken. Replaced scene by scene by the real compositions.
export const Placeholder: React.FC = () => {
	const {frame} = useCues();
	const info = useSceneInfo();
	return (
		<>
			<div style={{position: 'absolute', left: space.margin, top: 96}}>
				<Text px={size.small} ink="mist">
					{info.chapter.title}
				</Text>
				<Display px={size.heading} style={{marginTop: 8}}>
					{info.scene.id}
				</Display>
			</div>
			<div style={{position: 'absolute', left: space.margin, top: 300, width: 1500, display: 'flex', flexDirection: 'column', gap: 28}}>
				{info.passages.map((p) => (
					<div key={p.id} style={{fontSize: size.body, lineHeight: 1.45, fontFamily: font.text}}>
						{p.words.map((w, i) => {
							const t = (frame - p.from) / 30;
							const on = t >= w.s && t <= w.e + 0.15;
							const past = t > w.e;
							return (
								<span key={i} style={{color: on ? color.gilt : past ? color.paper : alpha('mist', 0.6)}}>
									{w.w}{' '}
								</span>
							);
						})}
					</div>
				))}
			</div>
		</>
	);
};
