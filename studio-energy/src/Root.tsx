import React from 'react';
import {Composition, Folder} from 'remotion';
import './design/fonts';
import {FPS, HEIGHT, WIDTH} from './design/tokens';
import {Film} from './Film';
import {MOODS} from './moodboard/Samples';
import {TIMELINE} from './timeline';

export const Root: React.FC = () => (
	<>
		<Composition id="Film" component={Film} durationInFrames={TIMELINE.total} fps={FPS} width={WIDTH} height={HEIGHT} />
		<Folder name="Moodboard">
			{Object.entries(MOODS).map(([id, C]) => (
				<Composition key={id} id={id} component={C} durationInFrames={FPS * 6} fps={FPS} width={WIDTH} height={HEIGHT} />
			))}
		</Folder>
	</>
);
