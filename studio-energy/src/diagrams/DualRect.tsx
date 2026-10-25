import React from 'react';
import {lerp} from '../design/motion';
import {stroke} from '../design/tokens';
import {Density, useHatch} from './Area';
import {Bracket, EnergyRect} from './Energy';

// Chapter 5, the energy rectangle (rows by columns) and its reflection under
// Poisson summation: the row side H is carried through the column scale D to
// D^2/H, so H and script H are mirror images about D (H · script H = D^2).
// Drawn as Energy.tsx draws it, anchored bottom-left, with the D-by-D square
// (rows equal to columns) as the mirror. Schematic: proportions, not values.

type Props = {
	x: number; // bottom-left corner
	y: number;
	w: number; // the column scale D
	h: number; // the row range H, drawn taller than D
	k?: number; // 0: the rows u, height H; 1: the dual rows h, height D^2/H
	p?: number;
	ghost?: number; // the tall rectangle left behind, dashed
	mirror?: number; // the D-by-D square
	hatch?: {density: Density; p: number};
	brackets?: number;
	rows?: number;
};

export const dualHeight = (w: number, h: number, k: number) => lerp(h, (w * w) / h, k);

export const ReflectRect: React.FC<Props> = ({x, y, w, h, k = 0, p = 1, ghost = 0, mirror = 0, hatch, brackets = 0, rows = 9}) => {
	const light = useHatch('ink', 'light', 0.6);
	const medium = useHatch('ink', 'medium', 0.7);
	const dense = useHatch('ink', 'dense', 0.7);
	const fill = {light, medium, dense}[hatch?.density ?? 'light'];
	const hh = dualHeight(w, h, k);
	return (
		<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
			<defs>
				{light.defs}
				{medium.defs}
				{dense.defs}
			</defs>
			<EnergyRect x={x} y={y} w={w} h={h} p={1} dash="8 8" ink="pencil" opacity={ghost} />
			{hatch && hatch.p > 0 && <rect x={x} y={y - hh} width={w} height={hh} fill={`url(#${fill.id})`} opacity={hatch.p} />}
			<EnergyRect x={x} y={y} w={w} h={hh} rows={rows} fill={hatch ? 0 : 1} p={p} />
			<EnergyRect x={x} y={y} w={w} h={w} p={1} dash="3 7" ink="pencil" opacity={mirror} width={stroke.line} />
			<Bracket x1={x - 36} y1={y} x2={x - 36} y2={y - hh} p={brackets} />
			<Bracket x1={x} y1={y + 32} x2={x + w} y2={y + 32} p={brackets} />
		</svg>
	);
};
