// The mood board, as code. Every color, size, and timing in the film comes from
// this file; scripts/lint-design.mjs rejects literals anywhere else.

import {Easing} from 'remotion';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

// The account book: iron-gall ink on buff ledger paper. Three accents, each with
// one job that never changes across the film. The accents were run through the
// dataviz palette validator against `ground` (all pairs, CVD-simulated): worst
// deuteranope separation ΔE 9.8, worst normal-vision ΔE 20.3, all above 3:1.
export const color = {
	ground: '#EEE6D2', // the page every frame is printed on
	groundDeep: '#DCCFB2', // the page's edge, where it has aged
	groundLift: '#F7F2E6', // a fresh sheet laid on the page: anything that must sit forward
	ink: '#24211C', // primary ink: text, geometry, the squares of an energy
	pencil: '#635D50', // secondary ink: axes, ledger rules, captions, citations
	cobalt: '#2B56B0', // the target and the claim: A_1(D), 11/12, the budget line
	viridian: '#1E8466', // arithmetic: primes, characters, Gauss sums, Möbius signs
	vermilion: '#C9452E', // debt and obstruction: error terms, borrowed terms, overspend
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
	text: 'IBM Plex Sans', // labels, captions, ledger figures (tabular)
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

// Stroke weights, lightest to heaviest. The energy grammar uses them in order:
// a ledger rule is a hair, a square's outline a line, a frame (a budget's
// boundary) bold, and the budget line itself — the one number promised — budget.
export const stroke = {
	hair: 1.5,
	line: 2.5,
	bold: 4,
	budget: 5,
} as const;

// Hatching carries area. Density, never a new color, carries magnitude:
// the gap between hatch lines for a light, medium and dense fill.
export const hatch = {
	light: 14,
	medium: 9,
	dense: 5,
	angle: 45,
} as const;

// The ledger: ruled lines and aligned figures, never boxes.
export const ledger = {
	row: 52, // ruled line spacing
	rule: stroke.hair,
	totalGap: 6, // the double rule under a total
} as const;

// Motion: one easing family, durations in beats of 12 frames (0.4 s).
export const beat = 12;
export const ease = {
	out: Easing.bezier(0.22, 1, 0.36, 1),
	inOut: Easing.bezier(0.65, 0, 0.35, 1),
	// For slow drifts: no overshoot, long tail.
	drift: Easing.bezier(0.33, 0, 0.15, 1),
} as const;

export const duration = {
	expose: beat * 1.5, // an element is inked in, from a soft blur to a sharp line
	draw: beat * 2, // a stroke draws on
	settle: beat * 2.5, // an element moves to a new place
	cut: beat, // cross-dissolve between scenes
} as const;

// The tooth of the paper: a fixed texture, never animated.
export const texture = {
	grainOpacity: 0.06,
	vignette: 0.5,
} as const;
