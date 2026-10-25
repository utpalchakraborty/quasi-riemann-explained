import type React from 'react';
import {scenes as open} from './open';
import {scenes as energy} from './energy';
import {scenes as family} from './family';
import {scenes as demands} from './demands';
import {scenes as spend} from './spend';
import {scenes as dual} from './dual';
import {scenes as theta} from './theta';
import {scenes as recursion} from './recursion';
import {scenes as price} from './price';
import {scenes as close} from './close';

// Scene id (from narration/script.ts) to composition. Each chapter file exports
// its own `scenes`; anything missing renders as the animatic placeholder.
export const SCENES: Record<string, React.FC> = {
	...open,
	...energy,
	...family,
	...demands,
	...spend,
	...dual,
	...theta,
	...recursion,
	...price,
	...close,
};
