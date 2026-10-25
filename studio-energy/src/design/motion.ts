import type React from 'react';
import {interpolate} from 'remotion';
import {duration, ease} from './tokens';

type Easer = (t: number) => number;

// 0 → 1 over [start, start + dur], clamped, eased.
export const progress = (
	frame: number,
	start: number,
	dur: number = duration.expose,
	easing: Easer = ease.out,
): number =>
	interpolate(frame, [start, start + Math.max(1, dur)], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing,
	});

// Rises at `start`, falls at `end`: for things that appear and later leave.
export const window = (
	frame: number,
	start: number,
	end: number,
	dur: number = duration.expose,
): number => Math.min(progress(frame, start, dur), 1 - progress(frame, end, dur, ease.inOut));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

// The film's signature reveal: an element is inked in, from a soft blur to a
// sharp line, the way wet ink settles into paper.
export const exposeStyle = (p: number): React.CSSProperties => ({
	opacity: p,
	filter: p >= 1 ? undefined : `blur(${(1 - p) * 6}px)`,
});
