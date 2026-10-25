import React from 'react';
import {useCurrentFrame} from 'remotion';
import {progress} from '../design/motion';
import {Display, Rule} from '../design/primitives';
import {beat, size, space} from '../design/tokens';
import {Ledger, LedgerRow} from '../diagrams/Ledger';
import {CHAPTERS, type Chapter} from '../narration/script';

// Between numbered chapters: the chapter's numeral and title, and beside them
// the film's contents kept as a ledger, the current line inked and the others
// in pencil. The right-hand column says which question the chapter answers.
const QUESTION: Record<string, string> = {
	energy: 'what it means',
	family: 'what it means',
	demands: 'what it means',
	spend: 'how it is spent',
	dual: 'how it is earned',
	theta: 'how it is earned',
	recursion: 'how it is earned',
	price: 'how it is earned',
};

const short = (t: string) => {
	const s = t.replace(/^Proving it, [IV]+: /, '');
	return s[0].toUpperCase() + s.slice(1);
};

export const ChapterCard: React.FC<{chapter: Chapter; frames: number}> = ({chapter}) => {
	const f = useCurrentFrame();
	const p = progress(f, 0, beat * 1.5);
	const numbered = CHAPTERS.filter((c) => c.index);
	const rows: LedgerRow[] = numbered.map((c) => ({
		label: [`${c.index}   ${short(c.title)}`],
		note: QUESTION[c.id],
		kind: c.id === chapter.id ? 'entry' : 'note',
		light: c.id === chapter.id ? progress(f, beat, beat) : 0,
		p: progress(f, beat * 0.5, beat * 1.5),
	}));
	return (
		<>
			<div style={{position: 'absolute', left: space.margin, top: 330, width: 700}}>
				<Display px={size.title} ink="cobalt" p={p}>
					{chapter.index}
				</Display>
				<Rule width={120} ink="cobalt" p={progress(f, beat * 0.5, beat * 1.5)} style={{margin: '28px 0 32px'}} />
				<Display px={size.title * 0.9} p={progress(f, beat * 0.5)} style={{textWrap: 'balance'}}>
					{chapter.title}
				</Display>
			</div>
			<Ledger x={1000} y={250} w={800} amountW={300} px={size.small} rowH={64} rows={rows} heading={{label: 'Contents', amount: 'answers', p: progress(f, beat * 0.5)}} rules={progress(f, 0, beat * 2)} />
		</>
	);
};
