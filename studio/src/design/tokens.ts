// The mood board, as code. Every color, size, and timing in the film comes from
// this file; scripts/lint-design.mjs rejects literals anywhere else.

import {Easing} from 'remotion';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// Cyanotype: paper-white ink on a Prussian-blue field. Three accents, each with
// one job that never changes across the film.
export const color = {
	field: '#12304D', // the exposed ground
	fieldDeep: '#0A1F35', // vignette edge
	fieldLift: '#1B4068', // the critical strip, panels that must sit forward
	paper: '#F3EFE4', // primary ink: text, geometry, zeros
	mist: '#A9C4E8', // secondary ink: axes, annotations, captions
	gilt: '#E9B949', // the frontier, the claim, the target
	verdigris: '#5FCFB2', // arithmetic: primes, characters, Möbius signs
	ember: '#F07563', // obstruction: poles, contradictions, error terms
} as const;

export type Ink = keyof typeof color;

// Translucent versions are derived, never hand-written.
export const alpha = (ink: Ink, a: number): string => {
	const hex = color[ink].slice(1);
	const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
	return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export const font = {
	display: 'Bodoni Moda', // titles and the big fractions
	text: 'IBM Plex Sans', // labels, captions, axis numbers
} as const;

// A classical scale (Bringhurst 6–72pt), doubled for a 1080p frame.
export const size = {
	micro: 22,
	small: 26,
	label: 30,
	body: 38,
	lead: 46,
	heading: 64,
	title: 96,
	hero: 150,
	mathInline: 44,
	math: 56,
	mathLarge: 80,
} as const;

export const space = {
	margin: 128, // outer safe margin
	gutter: 40,
	unit: 8,
	baseline: 1080 / 27, // 40px rhythm
} as const;

export const stroke = {
	hair: 1.5,
	line: 2.5,
	bold: 4,
	frontier: 5,
} as const;

// Motion: one easing family, durations in beats of 12 frames (0.4 s).
export const beat = 12;
export const ease = {
	out: Easing.bezier(0.22, 1, 0.36, 1),
	inOut: Easing.bezier(0.65, 0, 0.35, 1),
	// For slow camera drifts: no overshoot, long tail.
	drift: Easing.bezier(0.33, 0, 0.15, 1),
} as const;

export const duration = {
	expose: beat * 1.5, // an element develops from mist to paper
	draw: beat * 2, // a stroke draws on
	settle: beat * 2.5, // an element moves to a new place
	cut: beat, // cross-dissolve between scenes
} as const;

// The grain of cyanotype paper: a fixed texture, never animated.
export const texture = {
	grainOpacity: 0.07,
	vignette: 0.55,
} as const;
