import React, {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';
import {FPS} from './design/tokens';
import type {Chapter, Scene} from './narration/script';
import type {PlacedPassage} from './timeline';

// Scenes animate on words, not on clocks. `cue('eleven-5', 'square root')`
// returns the frame (relative to the scene) at which that phrase is spoken.
// A phrase that is not in the passage is an error, so script edits that
// break a cue fail the render instead of drifting silently.

export type SceneTiming = {id: string; frames: number; passages: PlacedPassage[]; chapter: Chapter; scene: Scene};
const Ctx = createContext<SceneTiming | null>(null);

export const SceneTimingProvider: React.FC<{value: SceneTiming; children: React.ReactNode}> = ({value, children}) => (
	<Ctx.Provider value={value}>{children}</Ctx.Provider>
);

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]+/g, '');

export type Cues = {
	frame: number; // current frame within the scene
	frames: number; // scene length
	start: (passage: string) => number;
	end: (passage: string) => number;
	cue: (passage: string, phrase: string, edge?: 'start' | 'end', occurrence?: number) => number;
};

export const useCues = (): Cues => {
	const t = useContext(Ctx);
	const frame = useCurrentFrame();
	if (!t) throw new Error('useCues outside a scene');
	const get = (id: string) => {
		const p = t.passages.find((x) => x.id === id);
		if (!p) throw new Error(`Scene ${t.id} has no passage ${id}`);
		return p;
	};
	return {
		frame,
		frames: t.frames,
		start: (id) => get(id).from,
		end: (id) => get(id).from + get(id).frames,
		cue: (id, phrase, edge = 'start', occurrence = 1) => {
			const p = get(id);
			const target = phrase.split(/\s+/).map(norm).filter(Boolean);
			const words = p.words.map((w) => norm(w.w));
			let seen = 0;
			for (let i = 0; i + target.length <= words.length; i++) {
				if (target.every((w, k) => words[i + k] === w)) {
					seen++;
					if (seen === occurrence) {
						const sec = edge === 'start' ? p.words[i].s : p.words[i + target.length - 1].e;
						return p.from + Math.round(sec * FPS);
					}
				}
			}
			throw new Error(`Cue "${phrase}" not found in ${id}`);
		},
	};
};

export const useSceneInfo = (): SceneTiming => {
	const t = useContext(Ctx);
	if (!t) throw new Error('useSceneInfo outside a scene');
	return t;
};
