import type React from 'react';
import {MoveFour, MoveOne, MoveThree, MoveTwo, MovesEngine, MovesMap} from './moves';
import {OpenBorder, OpenClaim, OpenRiemann} from './open';
import {scenes as primes} from './primes';
import {scenes as cancel} from './cancel';
import {scenes as eisenstein} from './eisenstein';
import {scenes as budget} from './budget';
import {scenes as eleven} from './eleven';
import {scenes as contradiction} from './contradiction';
import {scenes as poisson} from './poisson';
import {scenes as theta} from './theta';
import {scenes as recursion} from './recursion';
import {scenes as seven} from './seven';
import {scenes as back} from './back';
import {scenes as consequences} from './consequences';
import {scenes as ahead} from './ahead';

// Scene id (from narration/script.ts) to composition. Each chapter file exports
// its own `scenes`; anything missing renders as the animatic placeholder.
export const SCENES: Record<string, React.FC> = {
	'open-riemann': OpenRiemann,
	'open-border': OpenBorder,
	'open-claim': OpenClaim,
	'moves-map': MovesMap,
	'moves-1': MoveOne,
	'moves-2': MoveTwo,
	'moves-3': MoveThree,
	'moves-4': MoveFour,
	'moves-engine': MovesEngine,
	...primes,
	...cancel,
	...eisenstein,
	...budget,
	...eleven,
	...contradiction,
	...poisson,
	...theta,
	...recursion,
	...seven,
	...back,
	...consequences,
	...ahead,
};
