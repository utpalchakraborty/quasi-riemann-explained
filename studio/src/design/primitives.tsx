import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {exposeStyle} from './motion';
import {alpha, color, font, Ink, size, space, texture} from './tokens';

// The ground every frame is printed on: a lit Prussian field, a vignette,
// and a fixed paper grain on top of everything.
export const Field: React.FC<{children?: React.ReactNode}> = ({children}) => (
	<AbsoluteFill
		style={{
			background: `radial-gradient(ellipse 85% 75% at 50% 45%, ${color.field} 0%, ${color.field} 45%, ${color.fieldDeep} 100%)`,
		}}
	>
		{children}
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<Img
				src={staticFile('grain.jpg')}
				style={{width: '100%', height: '100%', mixBlendMode: 'overlay', opacity: texture.grainOpacity * 4}}
			/>
		</AbsoluteFill>
		<AbsoluteFill
			style={{
				pointerEvents: 'none',
				background: `radial-gradient(ellipse 75% 70% at 50% 48%, transparent 55%, ${alpha('fieldDeep', texture.vignette)} 100%)`,
			}}
		/>
	</AbsoluteFill>
);

type TextProps = {
	children: React.ReactNode;
	ink?: Ink;
	px?: number;
	p?: number; // exposure progress
	style?: React.CSSProperties;
};

// Bodoni for titles and for the few numbers the film is about.
export const Display: React.FC<TextProps & {italic?: boolean; weight?: number}> = ({
	children,
	ink = 'paper',
	px = size.title,
	p = 1,
	italic = false,
	weight = 400,
	style,
}) => (
	<div
		style={{
			fontFamily: font.display,
			fontSize: px,
			fontWeight: weight,
			fontStyle: italic ? 'italic' : 'normal',
			lineHeight: 1.08,
			letterSpacing: '-0.01em',
			fontOpticalSizing: 'auto',
			color: color[ink],
			...exposeStyle(p),
			...style,
		}}
	>
		{children}
	</div>
);

// Plex for everything that is read rather than looked at.
export const Text: React.FC<TextProps & {weight?: number; italic?: boolean}> = ({
	children,
	ink = 'paper',
	px = size.body,
	p = 1,
	weight = 400,
	italic = false,
	style,
}) => (
	<div
		style={{
			fontFamily: font.text,
			fontSize: px,
			fontWeight: weight,
			fontStyle: italic ? 'italic' : 'normal',
			lineHeight: 1.35,
			color: color[ink],
			fontVariantNumeric: 'tabular-nums lining-nums',
			...exposeStyle(p),
			...style,
		}}
	>
		{children}
	</div>
);

// Where a statement comes from. Sits bottom-right; always names the paper and place.
export const Cite: React.FC<{children: React.ReactNode; p?: number}> = ({children, p = 1}) => (
	<div
		style={{
			position: 'absolute',
			right: space.margin,
			bottom: space.margin * 0.5,
			fontFamily: font.text,
			fontSize: size.small,
			fontStyle: 'italic',
			color: color.mist,
			opacity: 0.85 * p,
		}}
	>
		{children}
	</div>
);

// What kind of picture this is. Lowercase, quiet, beside the figure it qualifies.
export type TagKind = 'computed' | 'schematic' | 'claim';
const tagWords: Record<TagKind, string> = {
	computed: 'computed values',
	schematic: 'schematic, not data',
	claim: 'claimed in the manuscript',
};
const tagInk: Record<TagKind, Ink> = {computed: 'verdigris', schematic: 'mist', claim: 'gilt'};

export const Tag: React.FC<{kind: TagKind; p?: number; style?: React.CSSProperties}> = ({kind, p = 1, style}) => (
	<div
		style={{
			display: 'inline-flex',
			alignItems: 'center',
			gap: 12,
			fontFamily: font.text,
			fontSize: size.small,
			color: color.mist,
			opacity: p,
			...style,
		}}
	>
		<span
			style={{
				width: 10,
				height: 10,
				borderRadius: kind === 'schematic' ? 0 : 5,
				border: `2px solid ${color[tagInk[kind]]}`,
				background: kind === 'computed' ? color[tagInk[kind]] : 'transparent',
				transform: kind === 'schematic' ? 'rotate(45deg)' : undefined,
			}}
		/>
		{tagWords[kind]}
	</div>
);

// Where we are in the argument: the act numeral in Bodoni, the chapter in Plex.
export const Locator: React.FC<{index: string; name: string; p?: number}> = ({index, name, p = 1}) => (
	<div
		style={{
			position: 'absolute',
			left: space.margin,
			bottom: space.margin * 0.5,
			display: 'flex',
			alignItems: 'baseline',
			gap: 16,
			opacity: 0.8 * p,
		}}
	>
		<span style={{fontFamily: font.display, fontSize: size.label, color: color.gilt}}>{index}</span>
		<span style={{fontFamily: font.text, fontSize: size.small, color: color.mist}}>{name}</span>
	</div>
);

// A thin rule: the only divider the film uses.
export const Rule: React.FC<{width: number; ink?: Ink; p?: number; style?: React.CSSProperties}> = ({
	width,
	ink = 'mist',
	p = 1,
	style,
}) => <div style={{width: width * p, height: 1.5, background: alpha(ink, 0.6), ...style}} />;

// The film's numbers (11/12, 7/8, 1/2) are set as stacked Bodoni fractions:
// they are the characters of the story, so they get the display face.
export const Fraction: React.FC<{n: string; d: string; px?: number; ink?: Ink; p?: number; style?: React.CSSProperties}> = ({
	n,
	d,
	px = size.title,
	ink = 'gilt',
	p = 1,
	style,
}) => (
	<div
		style={{
			display: 'inline-flex',
			flexDirection: 'column',
			alignItems: 'center',
			fontFamily: font.display,
			fontSize: px,
			lineHeight: 1,
			color: color[ink],
			fontVariantNumeric: 'lining-nums',
			...exposeStyle(p),
			...style,
		}}
	>
		<span>{n}</span>
		<span style={{width: '100%', minWidth: px * 0.62, height: Math.max(2, px * 0.035), background: color[ink], margin: `${px * 0.06}px 0`}} />
		<span>{d}</span>
	</div>
);
