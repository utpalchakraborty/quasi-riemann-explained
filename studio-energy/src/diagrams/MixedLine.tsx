import React from 'react';
import {exposeStyle} from '../design/motion';
import {Tex} from '../design/Tex';
import {color, font, Ink, size} from '../design/tokens';

// A caption that mixes Plex words with typeset math on one baseline, so a
// label like "terms of A_1(D)" never falls back to plain-text mathematics.
// Strings are Plex; {tex} parts go through KaTeX at a matching size.

export type Part = string | {tex: string; ink?: Ink};

export const MixedLine: React.FC<{
	parts: Part[];
	px?: number;
	ink?: Ink;
	p?: number;
	italic?: boolean;
	style?: React.CSSProperties;
}> = ({parts, px = size.label, ink = 'pencil', p = 1, italic = false, style}) => (
	<div
		style={{
			fontFamily: font.text,
			fontSize: px,
			fontStyle: italic ? 'italic' : 'normal',
			lineHeight: 1.4,
			color: color[ink],
			fontVariantNumeric: 'tabular-nums lining-nums',
			...exposeStyle(p),
			...style,
		}}
	>
		{parts.map((part, i) =>
			typeof part === 'string' ? (
				<span key={i} style={{whiteSpace: 'pre-wrap'}}>
					{part}
				</span>
			) : (
				<span key={i} style={{display: 'inline-block'}}>
					<Tex tex={part.tex} px={px * 1.04} ink={part.ink ?? ink} display={false} />
				</span>
			),
		)}
	</div>
);
