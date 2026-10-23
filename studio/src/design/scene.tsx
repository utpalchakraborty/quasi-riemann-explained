import React from 'react';
import {useCues, useSceneInfo} from '../cues';
import {exposeStyle, progress} from './motion';
import {Display, Locator} from './primitives';
import {alpha, color, font, Ink, size, space, stroke} from './tokens';

// Pieces every scene uses, so scenes stay consistent with the mood board.

// The scene's single title: top-left on the margin. A station numeral, when the
// scene belongs to a numbered move, sits before it in gilt.
export const SceneTitle: React.FC<{children: React.ReactNode; numeral?: string; p?: number; px?: number}> = ({
	children,
	numeral,
	p = 1,
	px = size.heading,
}) => (
	<div style={{position: 'absolute', left: space.margin, top: 84, display: 'flex', alignItems: 'baseline', gap: 28, ...exposeStyle(p)}}>
		{numeral && (
			<Display px={px} ink="gilt">
				{numeral}
			</Display>
		)}
		<Display px={px}>{children}</Display>
	</div>
);

// The chapter locator for scenes inside numbered chapters, faded in with the scene.
export const SceneLocator: React.FC = () => {
	const {chapter} = useSceneInfo();
	const {frame} = useCues();
	if (!chapter.index) return null;
	return <Locator index={chapter.index} name={chapter.title} p={progress(frame, 6, 18)} />;
};

// An annotation with a leader line to the thing it names.
export const Callout: React.FC<{
	x: number;
	y: number;
	to: [number, number];
	children: React.ReactNode;
	ink?: Ink;
	p?: number;
	align?: 'left' | 'right';
	width?: number;
}> = ({x, y, to, children, ink = 'mist', p = 1, align = 'left', width = 360}) => (
	<>
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none', opacity: p}}>
			<line x1={x} y1={y} x2={to[0]} y2={to[1]} stroke={alpha(ink, 0.8)} strokeWidth={stroke.hair} />
			<circle cx={to[0]} cy={to[1]} r={4} fill={color[ink]} />
		</svg>
		<div
			style={{
				position: 'absolute',
				left: align === 'left' ? x + 12 : x - 12 - width,
				top: y - size.label * 0.7,
				width,
				textAlign: align,
				fontFamily: font.text,
				fontSize: size.label,
				color: color[ink],
				lineHeight: 1.3,
				...exposeStyle(p),
			}}
		>
			{children}
		</div>
	</>
);

// Places children at an absolute position; keeps scene code readable.
export const At: React.FC<{x: number; y: number; w?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
	x,
	y,
	w,
	children,
	style,
}) => <div style={{position: 'absolute', left: x, top: y, width: w, ...style}}>{children}</div>;

// Deterministic pseudo-random numbers for schematic figures (same every render).
export const seeded = (i: number, salt = 0): number => {
	let h = Math.imul(i + 0x9e3779b9 + salt * 0x85ebca6b, 0x27d4eb2d) >>> 0;
	h ^= h >>> 15;
	h = Math.imul(h, 0x2c1b3c6d) >>> 0;
	h ^= h >>> 12;
	return (h >>> 0) / 4294967296;
};
