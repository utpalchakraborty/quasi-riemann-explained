// Lays the film out on one clock. Narration sets the length of every scene;
// scenes overlap by one dissolve so the field never goes dark between them.

import timing from './data/timing.json' with {type: 'json'};
import {CHAPTERS, type Chapter, type Scene} from './narration/script.ts';
import {FPS, duration} from './design/tokens.ts';

export type Word = {w: string; s: number; e: number};
type Timing = Record<string, {duration: number; words: Word[]}>;
const T = timing as Timing;

export const LEAD = 0.7; // silence before the first passage of a scene, seconds
export const GAP = 0.55; // between passages within a scene
export const TAIL = 1.0; // after the last passage, before the dissolve ends
export const CARD = 3.2; // chapter cards between deep-dive chapters
export const TITLE = 5.5; // the film's title, after the cold open
export const END = 9; // closing credits
export const DISSOLVE = duration.cut; // frames of overlap between consecutive items

export type PlacedPassage = {id: string; from: number; frames: number; words: Word[]; text: string};

export type Item =
	| {kind: 'scene'; scene: Scene; chapter: Chapter; from: number; frames: number; passages: PlacedPassage[]}
	| {kind: 'card'; chapter: Chapter; from: number; frames: number}
	| {kind: 'title'; chapter: Chapter; from: number; frames: number}
	| {kind: 'end'; chapter: Chapter; from: number; frames: number};

const f = (seconds: number) => Math.round(seconds * FPS);

const build = (): {items: Item[]; total: number} => {
	const items: Item[] = [];
	let cursor = 0;
	const push = (item: Item) => {
		items.push(item);
		cursor = item.from + item.frames - DISSOLVE;
	};
	for (const chapter of CHAPTERS) {
		if (chapter.id === 'moves') push({kind: 'title', chapter, from: cursor, frames: f(TITLE)});
		if (chapter.index) push({kind: 'card', chapter, from: cursor, frames: f(CARD)});
		for (const scene of chapter.scenes) {
			let t = LEAD;
			const passages: PlacedPassage[] = scene.passages.map((p, i) => {
				const d = T[p.id];
				if (!d) throw new Error(`No timing for ${p.id}; run scripts/timing.mjs`);
				const placed = {id: p.id, from: f(t), frames: f(d.duration), words: d.words, text: p.text};
				t += d.duration + (i < scene.passages.length - 1 ? GAP : 0);
				return placed;
			});
			push({kind: 'scene', scene, chapter, from: cursor, frames: f(t + TAIL) + DISSOLVE, passages});
		}
	}
	push({kind: 'end', chapter: CHAPTERS[CHAPTERS.length - 1], from: cursor, frames: f(END)});
	return {items, total: cursor + DISSOLVE};
};

export const TIMELINE = build();

export const chapterStarts = (): {chapter: Chapter; from: number}[] => {
	const seen = new Set<string>();
	return TIMELINE.items
		.filter((it) => (seen.has(it.chapter.id) ? false : (seen.add(it.chapter.id), true)))
		.map((it) => ({chapter: it.chapter, from: it.from}));
};
