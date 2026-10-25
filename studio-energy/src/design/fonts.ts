import {loadFont as loadBodoni} from '@remotion/google-fonts/BodoniModa';
import {loadFont as loadPlex} from '@remotion/google-fonts/IBMPlexSans';
import {continueRender, delayRender} from 'remotion';
import 'katex/dist/katex.min.css';

loadBodoni('normal', {weights: ['400', '500', '600'], subsets: ['latin']});
loadBodoni('italic', {weights: ['400'], subsets: ['latin']});
loadPlex('normal', {weights: ['400', '500'], subsets: ['latin', 'latin-ext', 'greek']});
loadPlex('italic', {weights: ['400'], subsets: ['latin']});

// KaTeX fonts arrive through CSS @font-face and load lazily; hold the first
// frame until the faces the film uses are ready so no frame shows fallbacks.
const handle = delayRender('Loading KaTeX fonts');
Promise.all(
	[
		'1em KaTeX_Main',
		'italic 1em KaTeX_Math',
		'1em KaTeX_Size1',
		'1em KaTeX_Size2',
		'1em KaTeX_AMS',
		'1em KaTeX_Fraktur',
	].map((f) => document.fonts.load(f)),
)
	.then(() => document.fonts.ready)
	.then(() => continueRender(handle))
	.catch((err) => {
		console.error(err);
		continueRender(handle);
	});
