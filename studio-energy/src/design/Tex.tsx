import katex from 'katex';
import React, {useId, useMemo} from 'react';
import {color, Ink, size} from './tokens';

// Semantic ink macros, named by role so equations read as the diagrams do:
// \target{..} the target and the claim (cobalt), \arith{..} arithmetic (viridian),
// \debt{..} error, debt, obstruction (vermilion), \aside{..} a quiet aside (pencil).
// KaTeX reads '#' as a macro argument, so colors are passed as bare hex.
const ink = (k: Ink) => `\\textcolor{${color[k].slice(1)}}{#1}`;
const macros: Record<string, string> = {
	'\\target': ink('cobalt'),
	'\\arith': ink('viridian'),
	'\\debt': ink('vermilion'),
	'\\aside': ink('pencil'),
	'\\N': '\\mathrm{N}',
	'\\Re': '\\operatorname{Re}',
	'\\OO': '\\mathcal{O}',
	'\\nn': '\\mathfrak{n}',
	'\\pp': '\\mathfrak{p}',
	'\\cH': '\\mathcal{H}',
};

// A part tagged \htmlClass{name}{...} can be lit in an ink (`light`) or
// faded in (`show`) frame by frame, driven by narration cues.
export type TexProps = {
	tex: string;
	px?: number;
	display?: boolean;
	ink?: Ink;
	light?: Record<string, {ink: Ink; p: number}>;
	show?: Record<string, number>;
	style?: React.CSSProperties;
};

export const Tex: React.FC<TexProps> = ({tex, px = size.math, display = true, ink = 'ink', light = {}, show = {}, style}) => {
	const id = useId().replace(/:/g, '');
	const html = useMemo(
		() =>
			katex.renderToString(tex, {
				displayMode: display,
				throwOnError: true,
				trust: true,
				strict: 'ignore',
				macros: {...macros},
				output: 'html',
			}),
		[tex, display],
	);
	const rules = [
		...Object.entries(light).map(
			([cls, {ink: k, p}]) =>
				`.t${id} .${cls}{color:color-mix(in oklab, ${color[k]} ${(p * 100).toFixed(1)}%, currentColor)}`,
		),
		...Object.entries(show).map(([cls, p]) => `.t${id} .${cls}{opacity:${p.toFixed(3)}}`),
	].join('\n');
	return (
		<div className={`t${id}`} style={{color: color[ink], fontSize: px, lineHeight: 1.2, ...style}}>
			<style>{`.t${id} .katex-display{margin:0}` + rules}</style>
			<div dangerouslySetInnerHTML={{__html: html}} />
		</div>
	);
};
