import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from 'remotion';
import {SceneTimingProvider} from './cues';
import {Field} from './design/primitives';
import {ChapterCard} from './scenes/ChapterCard';
import {EndCard} from './scenes/EndCard';
import {TitleCard} from './scenes/TitleCard';
import {Placeholder} from './scenes/Placeholder';
import {SCENES} from './scenes';
import {DISSOLVE, Item, TIMELINE} from './timeline';

// Each item fades in and out over the dissolve; neighbours overlap by exactly
// that much, so content cross-dissolves on a field that never changes.
const Dissolve: React.FC<{frames: number; children: React.ReactNode}> = ({frames, children}) => {
	const f = useCurrentFrame();
	const o = interpolate(f, [0, DISSOLVE, frames - DISSOLVE, frames], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const ItemView: React.FC<{item: Item}> = ({item}) => {
	if (item.kind === 'card') return <ChapterCard chapter={item.chapter} frames={item.frames} />;
	if (item.kind === 'title') return <TitleCard />;
	if (item.kind === 'end') return <EndCard />;
	const Scene = SCENES[item.scene.id] ?? Placeholder;
	return (
		<SceneTimingProvider value={{id: item.scene.id, frames: item.frames, passages: item.passages, chapter: item.chapter, scene: item.scene}}>
			<Scene />
		</SceneTimingProvider>
	);
};

export const Film: React.FC = () => (
	<AbsoluteFill>
		<Field>
			{TIMELINE.items.map((item, i) => (
				<Sequence key={i} from={item.from} durationInFrames={item.frames} name={item.kind === 'scene' ? item.scene.id : `${item.kind} ${item.chapter.id}`}>
					<Dissolve frames={item.frames}>
						<ItemView item={item} />
					</Dissolve>
				</Sequence>
			))}
		</Field>
		{TIMELINE.items.flatMap((item) =>
			item.kind === 'scene'
				? item.passages.map((p) => (
						<Sequence key={p.id} from={item.from + p.from} durationInFrames={p.frames + 6} name={`voice ${p.id}`} layout="none">
							<Audio src={staticFile(`narration/${p.id}.mp3`)} />
						</Sequence>
					))
				: [],
		)}
	</AbsoluteFill>
);
