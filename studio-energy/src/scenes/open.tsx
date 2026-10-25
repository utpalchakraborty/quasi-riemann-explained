import React from 'react';
import {useCues} from '../cues';
import {lerp, progress, window} from '../design/motion';
import {Cite, Display, Tag, Text} from '../design/primitives';
import {At, SceneTitle} from '../design/scene';
import {Tex} from '../design/Tex';
import {beat, color, ease, size, space, stroke} from '../design/tokens';
import {Frame, shelfPack} from '../diagrams/Area';
import {MixedLine} from '../diagrams/MixedLine';
import {PaperStrip} from '../diagrams/OpenPaper';
import {MeanChart, PourSquares} from '../diagrams/OpenSquares';
import {FlipLedger, ZoomWalkPlot} from '../diagrams/OpenWalk';
import {WALKS} from '../diagrams/WalkPlot';

// Chapter: open (no index, so no locator). The cold open: a thousand coins.

// --- open-walk: one computed walk draws on; three walks, three ends ---

const PLOT = {x: 230, y: 620, w: 1400, h: 245};
const FAN = Array.from({length: 21}, (_, i) => i + 3); // the other sampled walks

export const OpenWalk: React.FC = () => {
	const {frame: f, cue} = useCues();
	const count = cue('open-1', 'Count plus one');
	const running = cue('open-1', 'keep a running total');
	const ends = cue('open-1', 'This walk ends');
	const four = cue('open-1', 'four');
	const next = cue('open-1', 'The next ends');
	const twenty = cue('open-1', 'twenty');
	const after = cue('open-1', 'the one after that');
	const minus32 = cue('open-1', 'minus thirty-two');
	const before = cue('open-1', 'Before the first flip');
	const nobody = cue('open-1', 'nobody can say');

	const zoomOut = progress(f, before, beat * 3, ease.inOut);
	const yMax = lerp(lerp(30, 40, progress(f, after, beat * 2, ease.inOut)), 80, zoomOut);
	const w0 = progress(f, running, ends + beat - running, ease.inOut);
	const w1 = progress(f, next, twenty + beat - next, ease.inOut);
	const w2 = progress(f, after, minus32 + beat * 2 - after, ease.inOut);
	const fan = (k: number) => progress(f, nobody + k * 2, beat * 2.5, ease.inOut);
	// once the other walks arrive, the three named walks are inked alike
	const named = progress(f, before, beat * 2);
	const inkOf = (later: number) => (later > 0 && named < 0.5 ? ('pencil' as const) : ('ink' as const));
	return (
		<>
			<SceneTitle p={progress(f, 4)}>A thousand coins</SceneTitle>
			<FlipLedger x={space.margin} y={186} cell={58} count={20} flips={(f - count) / 3} totals={(f - running) / 2.5} last={progress(f, four)} />
			<ZoomWalkPlot
				{...PLOT}
				yMax={yMax}
				axes={progress(f, 6, beat * 2)}
				walks={[
					...FAN.map((i, k) => ({index: i, p: fan(k), ink: 'pencil' as const, width: stroke.hair, opacity: 0.6})),
					{index: 2, p: w2, width: stroke.line},
					{index: 1, p: w1, ink: inkOf(w2), width: stroke.line},
					{index: -1, p: w0, ink: inkOf(w1), width: stroke.line * (1 - 0.3 * named)},
				]}
				ends={[
					...FAN.map((i, k) => ({index: i, p: progress(f, nobody + k * 2 + beat * 2.5, beat), ink: 'pencil' as const})),
					{index: 0, p: progress(f, four), label: progress(f, four)},
					{index: 1, p: progress(f, twenty), label: progress(f, twenty)},
					{index: 2, p: progress(f, minus32), label: progress(f, minus32)},
				]}
			/>
			<At x={PLOT.x + 30} y={PLOT.y + PLOT.h - 46} w={800} style={{opacity: progress(f, nobody + beat * 3)}}>
				<MixedLine px={size.small} parts={[{tex: `${FAN.length + 3}`}, ' walks, and where each one ended']} />
			</At>
			<Tag kind="computed" p={progress(f, running)} style={{position: 'absolute', left: PLOT.x, top: PLOT.y + PLOT.h + 47}} />
		</>
	);
};

// --- open-squares: square the ends, average over many walks, pour into a frame ---

const COUNT = 24; // walks drawn as squares (as on the mood board)
const BIG = 7; // px per unit of |S| while three walks are named
const UNIT = 2.6; // px per unit of |S| for the family of 24
const SHELF = {x: space.margin, y: 330, w: 700};
const ENDS = WALKS.final.slice(0, COUNT);
const PACK = shelfPack(
	ENDS.map((s) => Math.abs(s) * UNIT),
	SHELF.w,
	14,
	true,
);
// The three named walks, side by side on one baseline, at the larger scale.
const NAMED_BASE = 580;
const NAMED_X = [200, 300, 520];
const CHART = {x: 1080, y: 250, w: 700, h: 360};
const COLUMN = {x: 1180, y: 900, w: 300};
const AREA = ENDS.reduce((s, v) => s + v * v, 0); // the 24 squares' total area, in units
const FRAME_AREA = COUNT * WALKS.steps; // N per walk
const FRAME_H = (FRAME_AREA * UNIT * UNIT) / COLUMN.w;
if (AREA > FRAME_AREA * 1.05) throw new Error('the 24 squares no longer fit their frame: revisit open-3');

export const OpenSquares: React.FC = () => {
	const {frame: f, cue} = useCues();
	const squareEach = cue('open-2', 'Square each final total');
	const sign = cue('open-2', 'so the sign no longer matters');
	const average = cue('open-2', 'average the squares');
	const many = cue('open-2', 'many walks');
	const handful = cue('open-2', 'After a handful');
	const jumps = cue('open-2', 'jumps around', 'end');
	const fourK = cue('open-2', 'After four thousand');
	const settled = cue('open-2', 'settled near');
	const near = cue('open-2', 'one thousand');
	const stepsAt = cue('open-2', 'the number of steps');
	const none = cue('open-3', 'a fact about none');
	const all = cue('open-3', 'a fact about all');
	const single = cue('open-3', 'It does not say');
	const says = cue('open-3', 'It says how much');
	const room = cue('open-3', 'how much room');

	const shrink = progress(f, average, beat * 2.5, ease.inOut);
	// the chart: walks 1..10 by "jumps around", then on to 4000
	const early = progress(f, handful, jumps - handful, ease.inOut);
	const late = progress(f, fourK, settled + beat - fourK, ease.inOut);
	const upto = f < handful ? 0 : Math.pow(10, early) * Math.pow(WALKS.walks / 10, late);
	const chartOut = 1 - progress(f, single, beat * 2);
	const rise = progress(f, single, beat * 2.5, ease.inOut);
	const dimmed = 1 - 0.5 * window(f, none, single);
	const pour = (i: number) => progress(f, says + 6 + i * 2, beat * 2, ease.inOut);
	const show = (i: number) => (i < 3 ? progress(f, squareEach + i * 6, beat * 1.5) : progress(f, many + (i - 3) * 2.5, beat));
	const pos = (i: number) => {
		const q = PACK.placed.find((pl) => pl.i === i)!;
		const side = Math.abs(ENDS[i]);
		if (i >= 3) return {x: SHELF.x + q.x, y: SHELF.y + q.y, side: q.side};
		return {
			x: lerp(NAMED_X[i], SHELF.x + q.x, shrink),
			y: lerp(NAMED_BASE - side * BIG, SHELF.y + q.y, shrink),
			side: lerp(side * BIG, q.side, shrink),
		};
	};
	const labelsP = 1 - progress(f, average, beat);
	const formulaY = lerp(CHART.y + CHART.h + 84, 210, rise);
	const formulaX = lerp(CHART.x, COLUMN.x, rise);
	return (
		<>
			<SceneTitle p={progress(f, 4)}>Square the ends</SceneTitle>

			{/* the three named walks: their ends, then their squares */}
			{[0, 1, 2].map((i) => {
				const side = Math.abs(ENDS[i]) * BIG;
				const cx = NAMED_X[i] + side / 2;
				return (
					<React.Fragment key={i}>
						<At x={cx - 100} y={NAMED_BASE + 14} w={200} style={{textAlign: 'center', opacity: progress(f, 6 + i * 4) * labelsP}}>
							<Tex tex={ENDS[i] < 0 ? `S=\\htmlClass{neg}{-}${-ENDS[i]}` : `S=${ENDS[i]}`} px={size.label} display={false} show={{neg: 1 - 0.75 * progress(f, sign, beat * 2)}} />
						</At>
						<At x={cx - 100} y={NAMED_BASE - side - 50} w={200} style={{textAlign: 'center', opacity: progress(f, squareEach + i * 6 + beat) * labelsP}}>
							<Tex tex={`${ENDS[i] * ENDS[i]}`} px={size.label} display={false} />
						</At>
					</React.Fragment>
				);
			})}
			<At x={NAMED_X[0]} y={NAMED_BASE + 76} w={760} style={{opacity: progress(f, sign) * labelsP}}>
				<MixedLine px={size.small} parts={['squared, the sign is gone: ', {tex: '(-32)^{2}=32^{2}=1024'}]} />
			</At>

			{/* the family of squares, and later their pour into the frame */}
			<PourSquares
				items={ENDS.map((_, i) => pos(i))}
				column={COLUMN}
				pour={pour}
				show={show}
				ghost={1}
				squareOpacity={dimmed}
			/>
			<At x={SHELF.x} y={SHELF.y - 56} w={760} style={{opacity: progress(f, many + beat * 2)}}>
				<MixedLine px={size.small} parts={['the squares of ', {tex: `${COUNT}`}, ' walks, side ', {tex: '|S|'}]} />
			</At>

			{/* the running mean of the squares */}
			<div style={{opacity: chartOut}}>
				<MeanChart {...CHART} upto={upto} axes={progress(f, handful - beat, beat * 2)} line={progress(f, near, beat * 2, ease.inOut)} readout={progress(f, handful)} />
			</div>
			<At x={formulaX} y={formulaY} style={{opacity: progress(f, stepsAt)}}>
				<Tex tex={'\\mathbb{E}\\,|S_N|^{2}=N'} px={size.math} display={false} />
				<svg width={320} height={14} style={{display: 'block', marginTop: 6}}>
					<line x1={0} x2={300 * window(f, all, single, beat)} y1={7} y2={7} stroke={color.ink} strokeWidth={stroke.line} />
				</svg>
			</At>
			<At x={CHART.x} y={CHART.y + CHART.h + 196} w={700} style={{opacity: progress(f, stepsAt + beat) * chartOut}}>
				<MixedLine px={size.small} parts={['for independent signs, the average of ', {tex: 'S_N^{2}'}, ' is exactly ', {tex: 'N'}, '; the 4,000 walks settle near it']} />
			</At>

			{/* open-3: how much room the walks take up together */}
			<svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
				<Frame x={COLUMN.x} y={COLUMN.y - FRAME_H} w={COLUMN.w} h={FRAME_H} p={progress(f, says, beat * 2, ease.inOut)} />
			</svg>
			<At x={COLUMN.x + COLUMN.w + 30} y={COLUMN.y - FRAME_H - 8} w={330} style={{opacity: progress(f, says + beat)}}>
				<MixedLine ink="ink" parts={['the frame: ', {tex: `${COUNT}\\times N`}]} />
				<MixedLine px={size.small} parts={['area ', {tex: `N=${WALKS.steps}`}, ' per walk']} />
			</At>
			<At x={COLUMN.x + COLUMN.w + 30} y={COLUMN.y - 118} w={320} style={{opacity: progress(f, room + beat * 2)}}>
				<MixedLine px={size.small} parts={['the same ', {tex: `${COUNT}`}, ' squares, poured in area for area, fill ', {tex: `${Math.round((100 * AREA) / FRAME_AREA)}\\%`}, ' of it']} />
			</At>
			<Tag kind="computed" p={progress(f, many)} style={{position: 'absolute', left: space.margin, top: 912}} />
		</>
	);
};

// --- open-claim: the October manuscript rests on one estimate; the disclaimer ---

const STRIP = {x: space.margin, y: 716, w: 1920 - 2 * space.margin};

export const OpenClaim: React.FC = () => {
	const {frame: f, cue, start} = useCues();
	const october = cue('open-4', 'The October');
	const rests = cue('open-4', 'rests on one estimate');
	const family = cue('open-4', 'a family of sums');
	const spending = cue('open-4', 'Spending it');
	const proving = cue('open-4', 'Proving it');
	const most = cue('open-4', 'most of the paper');
	const film = cue('open-4', 'This film is about');
	const means = cue('open-4', 'what it means');
	const spent = cue('open-4', 'how it is spent');
	const earned = cue('open-4', 'how it is earned');
	const disclaim = start('open-5');
	const certify = cue('open-5', 'It does not certify');
	const readers = cue('open-5', 'That is the work');
	const out = 1 - progress(f, disclaim - beat, beat * 1.5);
	const last = progress(f, disclaim + beat * 0.5, beat * 2);
	const agenda = [
		{at: means, words: 'what it means', where: 'chapters 1 to 3'},
		{at: spent, words: 'how it is spent', where: 'chapter 4'},
		{at: earned, words: 'how it is earned', where: 'chapters 5 to 8'},
	];
	return (
		<>
			<div style={{opacity: out}}>
				<SceneTitle p={progress(f, 4)}>One estimate</SceneTitle>
				<At x={space.margin} y={190}>
					<Text px={size.small} ink="pencil" p={progress(f, october)}>
						5 October 2026
					</Text>
					<Display px={size.lead} p={progress(f, october)} style={{marginTop: 4}}>
						The Quasi-Riemann Hypothesis
					</Display>
				</At>
				<At x={space.margin} y={286} style={{opacity: progress(f, rests)}}>
					<Tex px={size.math} tex={'\\sum_{0<\\N(u)\\le H}|A_u(D)|^{2}\\ \\ll\\ \\target{D^{1+\\varepsilon}H},'} />
				</At>
				<At x={1060} y={318} style={{opacity: progress(f, rests)}}>
					<Tex px={size.mathInline} display={false} tex={'H=D^{1+\\vartheta}'} />
				</At>
				<At x={1560} y={322} w={232} style={{textAlign: 'right', opacity: progress(f, rests)}}>
					<Tex px={size.label} ink="pencil" display={false} tex="(2.3)" />
				</At>
				<Tag kind="claim" p={progress(f, rests + beat)} style={{position: 'absolute', left: 1060, top: 392}} />
				<At x={space.margin} y={466} w={1100} style={{opacity: progress(f, family)}}>
					<MixedLine px={size.small} parts={['a family of sums ', {tex: 'A_u(D)'}, ', one for each row ', {tex: 'u'}, '; the bound is for all of them together']} />
				</At>
				<At x={space.margin} y={512} w={1100} style={{opacity: progress(f, rests + beat * 2)}}>
					<MixedLine px={size.label} italic parts={['“Therefore it remains to establish ', {tex: '(2.3)'}, '.”']} />
				</At>

				<PaperStrip
					{...STRIP}
					p={progress(f, spending - beat, beat * 2, ease.inOut)}
					spend={progress(f, spending, beat * 2, ease.inOut)}
					proof={progress(f, proving, most + beat * 2 - proving, ease.inOut)}
					spendLabel={['spending it: one paragraph of §3']}
					proofLabel={['proving it: §§4–7 and Appendices A–B']}
					spendLit={progress(f, spent)}
					proofLit={progress(f, earned)}
				/>
				<At x={STRIP.x + STRIP.w - 760} y={STRIP.y - 130} w={760} style={{textAlign: 'right', opacity: progress(f, spending)}}>
					<MixedLine px={size.small} parts={['the October manuscript, 49 pages, as its contents divide them']} />
				</At>

				{/* what this film is about */}
				<At x={space.margin} y={858} style={{opacity: progress(f, film), display: 'flex', gap: 120}}>
					{agenda.map((a) => (
						<div key={a.words}>
							<Display px={size.lead} italic p={progress(f, a.at)}>
								{a.words}
							</Display>
							<Text px={size.small} ink="pencil" p={progress(f, a.at + beat)} style={{marginTop: 4}}>
								{a.where}
							</Text>
						</div>
					))}
				</At>
				<Cite p={progress(f, rests + beat * 2) * (1 - progress(f, spending, beat))}>October manuscript, §2.2, equation (2.3)</Cite>
				<Cite p={progress(f, spending + beat, beat)}>October manuscript: contents, §1.3 and §3</Cite>
			</div>

			{/* open-5: what this film is, and is not */}
			<At x={space.margin} y={300} w={1300}>
				<Display px={size.title} p={last}>
					Explained,
					<br />
					not certified
				</Display>
				<Text px={size.body} ink="pencil" p={progress(f, disclaim + beat)} style={{marginTop: 48, width: 1100}}>
					This film explains how the arguments work.
				</Text>
				<Text px={size.body} ink="pencil" p={progress(f, certify)} style={{width: 1100}}>
					It does not certify that they are correct.
				</Text>
				<Text px={size.body} ink="pencil" p={progress(f, readers)} style={{marginTop: 18, width: 1100}}>
					That is the work of careful readers, and it takes time.
				</Text>
			</At>
		</>
	);
};

export const scenes: Record<string, React.FC> = {
	'open-walk': OpenWalk,
	'open-squares': OpenSquares,
	'open-claim': OpenClaim,
};
