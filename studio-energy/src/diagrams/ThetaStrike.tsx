import React from 'react';
import {color, Ink} from '../design/tokens';

// Draws on the strike of \htmlClass{name}{\sout{..}} from left to right, so a
// term can be struck through on the word that rejects it. Until `p` > 0 the
// strike is hidden and the term reads normally. Class names are global:
// prefix them.
export const StrikeFade: React.FC<{strike: Record<string, number>; ink?: Ink}> = ({strike, ink = 'ink'}) => (
	<style>
		{Object.entries(strike)
			.map(([cls, p]) => {
				const q = Math.max(0, Math.min(1, p));
				return `.${cls} .katex-sout{border-bottom-color:${color[ink]};border-bottom-width:0.09em;clip-path:inset(0 ${((1 - q) * 100).toFixed(2)}% 0 0);opacity:${q > 0 ? 1 : 0}}`;
			})
			.join('\n')}
	</style>
);
