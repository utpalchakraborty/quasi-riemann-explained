// Writes the energy/ companion files from the film's own timeline:
//   ../energy/index.html, chapters.json, subtitles.vtt, subtitles.srt, transcript.txt
//   out/chapters.ffmetadata (for muxing chapters into the MP4)
import katex from 'katex';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {CHAPTERS} from '../src/narration/script.ts';
import {TIMELINE} from '../src/timeline.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = resolve(ROOT, '..', 'energy');
const FPS = 30;
const VIDEO = 'The-Energy-Budget.mp4';
mkdirSync(SITE, {recursive: true});
mkdirSync(join(ROOT, 'out'), {recursive: true});

// ---- timing ---------------------------------------------------------------
const words = [];
const passages = [];
for (const it of TIMELINE.items) {
	if (it.kind !== 'scene') continue;
	for (const p of it.passages) {
		const t0 = (it.from + p.from) / FPS;
		passages.push({id: p.id, chapter: it.chapter.id, start: t0, text: p.text});
		p.words.forEach((w, i) => words.push({w: w.w, s: t0 + w.s, e: t0 + w.e, last: i === p.words.length - 1}));
	}
}
const total = TIMELINE.total / FPS;
const firstOf = new Map();
for (const it of TIMELINE.items) {
	if ((it.kind === 'scene' || it.kind === 'card') && !firstOf.has(it.chapter.id)) firstOf.set(it.chapter.id, it.from / FPS);
}
const chapters = CHAPTERS.map((c, i) => {
	const start = i === 0 ? 0 : firstOf.get(c.id);
	const next = i + 1 < CHAPTERS.length ? firstOf.get(CHAPTERS[i + 1].id) : total;
	return {id: c.id, index: c.index, title: c.title, start: +start.toFixed(3), duration: +(next - start).toFixed(3)};
});

// ---- captions ---------------------------------------------------------------
const cues = [];
let cur = [];
const flush = () => {
	if (cur.length) cues.push({s: cur[0].s, e: cur[cur.length - 1].e, text: cur.map((w) => w.w).join(' ')});
	cur = [];
};
for (const w of words) {
	cur.push(w);
	const text = cur.map((x) => x.w).join(' ');
	const dur = w.e - cur[0].s;
	if (w.last || text.length >= 78 || dur >= 6 || (/[.?!]$/.test(w.w) && text.length >= 24) || (/[,;:]$/.test(w.w) && text.length >= 56)) flush();
}
flush();
const wrap = (t) => {
	if (t.length <= 42) return t;
	const ws = t.split(' ');
	let best = null;
	for (let i = 1; i < ws.length; i++) {
		const a = ws.slice(0, i).join(' ');
		const b = ws.slice(i).join(' ');
		const score = Math.max(a.length, b.length);
		if (!best || score < best.score) best = {score, out: `${a}\n${b}`};
	}
	return best.out;
};
const stamp = (t, sep) => {
	const ms = Math.round(t * 1000);
	const h = Math.floor(ms / 3600000);
	const m = Math.floor((ms % 3600000) / 60000);
	const s = Math.floor((ms % 60000) / 1000);
	return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}${sep}${String(ms % 1000).padStart(3, '0')}`;
};
// keep each cue on screen a little past its last word, never overlapping the next
cues.forEach((c, i) => {
	const next = cues[i + 1]?.s ?? c.e + 1;
	c.e = Math.min(c.e + 0.35, next - 0.02);
});
writeFileSync(join(SITE, 'subtitles.srt'), cues.map((c, i) => `${i + 1}\n${stamp(c.s, ',')} --> ${stamp(c.e, ',')}\n${wrap(c.text)}\n`).join('\n'));
writeFileSync(join(SITE, 'subtitles.vtt'), 'WEBVTT\n\n' + cues.map((c) => `${stamp(c.s, '.')} --> ${stamp(c.e, '.')}\n${wrap(c.text)}\n`).join('\n'));

// ---- chapters ---------------------------------------------------------------
writeFileSync(join(SITE, 'chapters.json'), JSON.stringify(chapters, null, 2) + '\n');
writeFileSync(
	join(ROOT, 'out', 'chapters.ffmetadata'),
	';FFMETADATA1\ntitle=The energy budget\n' +
		chapters
			.map((c) => `\n[CHAPTER]\nTIMEBASE=1/1000\nSTART=${Math.round(c.start * 1000)}\nEND=${Math.round((c.start + c.duration) * 1000)}\ntitle=${(c.index ? c.index + '. ' : '') + c.title}\n`)
			.join(''),
);

// ---- reading notes: sources and the equations shown, per chapter ------------
const NOTES = {
	open: {src: 'Classical (random walks); October manuscript, §2.2', eq: ['\\mathbb E\\,\\big|\\varepsilon_1+\\cdots+\\varepsilon_N\\big|^2=N', '\\sum_{0<\\mathrm N(u)\\le H}|A_u(D)|^2\\ll D^{1+\\varepsilon}H']},
	energy: {src: 'Classical (Pythagoras, Parseval); October manuscript, §2.1 and §2.2; September manuscript, section titles', eq: ['\\Big|\\sum_n a_n\\Big|^2=\\sum_n|a_n|^2+\\sum_{n\\ne m}a_n\\overline{a_m}', 'M(x)=\\sum_{n\\le x}\\mu(n)']},
	family: {
		src: 'October manuscript, §2.2 and Proposition 3.1; classical: the large sieve (Iwaniec–Kowalski, ch. 7)',
		eq: ['A_u(D)=\\sum_{(\\mathfrak n,S)=1}\\mu(\\mathfrak n)\\nu(\\mathfrak n)\\chi_{\\mathfrak n}(u)W(\\mathrm N\\mathfrak n/D)', '\\sum_{0<\\mathrm N(u)\\le D^{1+\\vartheta}}|A_u(D)|^2\\ll\\Big(\\max_{0\\le j\\le k}\\|W^{(j)}\\|_\\infty\\Big)^2D^{2+\\vartheta+\\varepsilon}', '\\sum_{\\text{rows}}\\Big|\\sum_{\\text{cols}}\\beta_n\\phi_r(n)\\Big|^2\\ll(M+L)(ML)^{\\varepsilon}\\sum_n|\\beta_n|^2'],
	},
	demands: {src: 'October manuscript, §2.2, equation (2.4), and §3; the dial over k is the film’s own arithmetic', eq: ['\\chi_n(p^6)=\\mathbb 1_{p\\nmid n}', 'Y=H^{1/6}', 'e(k)=\\tfrac12\\big(1+(1+\\vartheta)(1-\\tfrac1k)\\big),\\qquad e(6)=\\tfrac{11}{12}+\\tfrac{5\\vartheta}{12}']},
	spend: {
		src: 'October manuscript, §3, equation (3.2); September manuscript, proof overview',
		eq: ['|A_1(D)-A_{p^6}(D)|\\ll_W D/Y,\\qquad J\\asymp Y/\\log Y', '|A_1(D)|^2\\le\\frac2J\\sum_p|A_{p^6}(D)|^2+O_W(D^2/Y^2)\\ll D^{\\frac{11}{6}+\\frac{5\\vartheta}{6}+\\varepsilon}+D^{\\frac53-\\frac\\vartheta3}', '\\#\\{u:|A_u|\\ge T\\}\\le B/T^2'],
	},
	dual: {
		src: 'October manuscript, §2.3, §4 and Lemma 4.1, after Hasse and Heath-Brown',
		eq: ['\\gamma_j(n)=\\mathrm N(n)^{-1/2}\\sum_{x\\bmod n}\\chi_n(x)^je(x/n)', '\\mu(n)\\gamma_{-1}(n)=\\chi_n(-1)G(n)^{-1}\\overline{\\alpha(n)}\\gamma_2(n)', '\\sum_{0<\\mathrm N(u)\\le H}|A_u(D)|^2\\lessapprox DH+\\frac HD\\sum_{0<\\mathrm N(h)\\ll\\mathcal H}|B_h(D)|^2,\\qquad\\mathcal H\\asymp D^2/H'],
	},
	theta: {
		src: 'October manuscript, §2.4, Proposition 5.2, §6 and Lemma 6.5; Goldmakher–Louvel; Blomer–Goldmakher–Louvel',
		eq: ['c_\\theta(nb^3)=3^{5/2}|b|\\,\\overline{\\chi_n(\\lambda)^2}\\,\\gamma_2(n)', '\\chi_p^{-1}\\chi_p^{-2}=\\chi_p^{-3}=\\chi_p^{3}', '\\sum_{0<\\mathrm N(h)\\ll\\mathcal H}|T_h(X)|^2\\ll(\\mathcal HX)^\\varepsilon\\Big(\\mathcal H+\\frac{\\mathcal H^2}{X}\\Big)'],
	},
	recursion: {
		src: 'October manuscript, §2.5, Lemma 5.3, Proposition 5.4 and §5.5; Heath-Brown’s admissible-exponent method',
		eq: ['P_h(X)=\\sum_d\\frac{\\mu(d)w_h(d)}{\\mathrm N(d)}T_h\\Big(\\frac X{\\mathrm N(d)^3}\\Big)', 'H_c=\\min\\Big\\{X^{1/3},\\Big(\\frac X{\\mathcal H}\\Big)^{2/3}\\Big\\}', '(\\mathcal H\',X\')=\\Big(\\frac{\\mathcal H}{\\mathrm N(b)^3},\\frac X{\\mathrm N(b)^3}\\Big),\\qquad\\mathcal H\'\\ll D^{-2\\vartheta}\\mathcal H'],
	},
	price: {src: 'October manuscript, §2.5, Proposition 5.1 and §5.6; September manuscript, proof overview', eq: ['A_1(D)\\ll D^{\\frac{11}{12}+\\frac{5\\vartheta}{12}+\\varepsilon},\\qquad 0<\\vartheta\\le\\tfrac1{10}']},
	close: {src: 'October manuscript, §2', eq: []},
};
const tex = (t) => katex.renderToString(t, {displayMode: true, output: 'htmlAndMathml', throwOnError: true});

// ---- transcript ---------------------------------------------------------------
const mmss = (t) => `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const transcript = [
	'The energy budget: how the quasi-Riemann proof pays for cancellation',
	'A companion to The Fixed Frontier. Narration: ElevenLabs, voice Sarah, Eleven v4.',
	'This film explains the manuscripts’ arguments; it does not verify them.',
	'',
	...chapters.flatMap((c) => [
		'',
		`${mmss(c.start)} | ${c.index ? c.index + '. ' : ''}${c.title}`,
		`Source: ${NOTES[c.id].src}`,
		'',
		...passages.filter((p) => p.chapter === c.id).map((p) => p.text),
	]),
	'',
].join('\n');
writeFileSync(join(SITE, 'transcript.txt'), transcript);

// ---- page ---------------------------------------------------------------------
const videoPath = join(SITE, VIDEO);
const version = existsSync(videoPath)
	? createHash('sha256').update(readFileSync(videoPath)).digest('hex').slice(0, 12)
	: 'pending';
const v = (f) => `${f}?v=${version}`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const chapterNav = chapters
	.map((c) => `<li><button type="button" data-t="${c.start}"><span class="t">${mmss(c.start)}</span><span class="n">${c.index || '·'}</span><span class="c">${esc(c.title)}</span></button></li>`)
	.join('\n');
const reading = chapters
	.map((c) => {
		const ps = passages.filter((p) => p.chapter === c.id);
		const eqs = NOTES[c.id].eq.map((e) => `<div class="eq">${tex(e)}</div>`).join('');
		return `<details id="${c.id}"${c.id === 'open' ? ' open' : ''}>
<summary><span class="n">${c.index || '·'}</span><span class="c">${esc(c.title)}</span><span class="t">${mmss(c.start)}</span></summary>
<div class="body">
<p class="src">${esc(NOTES[c.id].src)}</p>
${ps.map((p) => `<p><button type="button" class="seek" data-t="${p.start.toFixed(2)}" aria-label="Play from ${mmss(p.start)}">${mmss(p.start)}</button> ${esc(p.text)}</p>`).join('\n')}
${eqs}
</div>
</details>`;
	})
	.join('\n');
const mins = Math.floor(total / 60);
const secs = Math.round(total % 60);
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The Energy Budget</title>
<meta name="description" content="A ${mins}-minute narrated explainer of the mean-square estimate behind the 2026 Quasi-Riemann manuscript: what an energy budget is, how it is spent to reach 11/12, and how it is proved. With chapters, captions, transcript and equations.">
<meta property="og:type" content="video.other">
<meta property="og:title" content="The Energy Budget">
<meta property="og:description" content="How the quasi-Riemann proof pays for cancellation: one estimate about a family of sums, spent in a paragraph and earned in most of the paper.">
<meta property="og:url" content="https://utpalchakraborty.github.io/quasi-riemann-explained/energy/">
<meta property="og:image" content="https://utpalchakraborty.github.io/quasi-riemann-explained/energy/poster.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#EEE6D2">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;1,6..96,400&family=IBM+Plex+Sans:ital,wght@0,400;0,500;1,400&display=swap">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.19.0/dist/katex.min.css" crossorigin="anonymous">
<style>
/* Ledger paper, as in the film: one reading column, the player first. */
:root{--ground:#EEE6D2;--edge:#DCCFB2;--sheet:#F7F2E6;--ink:#24211C;--pencil:#635D50;--cobalt:#2B56B0;--viridian:#1E8466;--red:#C9452E;--rule:rgba(99,93,80,.3);--display:"Bodoni Moda",Didot,"Bodoni 72",Georgia,serif;--text:"IBM Plex Sans","Helvetica Neue",Arial,sans-serif;color-scheme:light}
*{box-sizing:border-box}
html{background:var(--ground)}
body{margin:0;background:radial-gradient(ellipse 120% 70% at 50% 20%,var(--ground) 55%,var(--edge)) fixed,var(--ground);color:var(--ink);font:400 18px/1.6 var(--text)}
main{max-width:1120px;margin:0 auto;padding-block:56px 96px;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));display:grid;gap:56px}
h1,h2{font-family:var(--display);font-weight:400;margin:0;text-wrap:balance}
h1{font-size:clamp(44px,7vw,92px);line-height:1.02}
h2{font-size:clamp(28px,3.6vw,42px);line-height:1.1}
p{margin:0}
.lead{font-size:20px;color:var(--pencil);max-width:62ch;margin-top:18px}
.player{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:24px;align-items:start}
video{display:block;width:100%;max-width:100%;aspect-ratio:16/9;background:var(--edge);border-radius:2px;box-shadow:0 0 0 1px var(--rule)}
nav ol{list-style:none;margin:0;padding:0;max-height:min(56vw,520px);overflow:auto;border-top:1px solid var(--rule)}
nav li{border-bottom:1px solid var(--rule)}
nav button{all:unset;cursor:pointer;display:grid;grid-template-columns:52px 30px 1fr;gap:6px;width:100%;padding:9px 4px;font-size:15px;line-height:1.35}
nav button:hover .c,nav button.on .c{color:var(--cobalt)}
nav button:focus-visible{outline:2px solid var(--cobalt);outline-offset:2px}
nav .t{color:var(--pencil);font-variant-numeric:tabular-nums}
nav .n{font-family:var(--display);color:var(--cobalt)}
.facts{display:flex;flex-wrap:wrap;gap:8px 28px;color:var(--pencil);font-size:15px}
.facts a{color:var(--cobalt)}
.note{border-left:2px solid var(--cobalt);padding-left:16px;color:var(--pencil);max-width:70ch}
details{border-bottom:1px solid var(--rule)}
details:first-of-type{border-top:1px solid var(--rule)}
summary{cursor:pointer;list-style:none;display:grid;grid-template-columns:44px 1fr auto;gap:12px;align-items:baseline;padding:16px 0}
summary::-webkit-details-marker{display:none}
summary .n{font-family:var(--display);font-size:24px;color:var(--cobalt)}
summary .c{font-family:var(--display);font-size:24px}
summary .t{color:var(--pencil);font-variant-numeric:tabular-nums;font-size:15px}
summary:focus-visible{outline:2px solid var(--cobalt);outline-offset:2px}
.body{display:grid;gap:14px;padding:0 0 24px 56px;max-width:78ch;min-width:0}
.src{color:var(--pencil);font-style:italic;font-size:15px}
.seek{all:unset;cursor:pointer;color:var(--cobalt);font-variant-numeric:tabular-nums;font-size:14px;margin-right:6px}
.seek:focus-visible{outline:2px solid var(--cobalt)}
.eq{overflow-x:auto;padding:6px 0;color:var(--ink)}
.eq .katex-display{margin:6px 0;text-align:left}
.sources p+p{margin-top:8px}
a{color:var(--cobalt)}
footer{color:var(--pencil);font-size:14px;border-top:1px solid var(--rule);padding-top:20px;display:grid;gap:6px}
@media (max-width:860px){.player{grid-template-columns:minmax(0,1fr)}nav ol{max-height:none}.body{padding-left:0}}
</style>
</head>
<body>
<main>
<header>
<h1>The energy budget</h1>
<p class="lead">How the quasi-Riemann proof pays for cancellation. One estimate about a whole family of sums, an energy budget, is what the October manuscript’s proof of 11/12 rests on: what it means, how it is spent, and how it is earned. A narrated film of ${mins} minutes ${secs} seconds, with chapters, captions and a transcript with equations; a companion to <a href="../v2/">The Fixed Frontier</a>.</p>
</header>
<section class="player" aria-label="Film">
<video id="film" controls preload="metadata" playsinline poster="${v('poster.jpg')}" src="${v(VIDEO)}">
<track kind="captions" src="${v('subtitles.vtt')}" srclang="en" label="English" default>
</video>
<nav aria-label="Chapters"><ol>
${chapterNav}
</ol></nav>
</section>
<div class="facts">
<a href="${v(VIDEO)}">Download the MP4</a><a href="${v('transcript.txt')}">Transcript</a><a href="${v('subtitles.srt')}">Captions (SRT)</a><a href="${v('chapters.json')}">Chapter times</a><a href="../v2/">The Fixed Frontier</a>
</div>
<p class="note">This film explains the arguments in two manuscripts released by OpenAI. It does not verify them; whether the proofs are correct is for careful readers to settle. Figures in the film are tagged as computed values, schematic, or claimed in the manuscript.</p>
<section aria-labelledby="read">
<h2 id="read">Read along</h2>
<p class="lead">Each chapter's narration, its sources in the manuscripts, and the equations it shows. The times jump the film to that passage.</p>
<div style="margin-top:24px">
${reading}
</div>
</section>
<section class="sources" aria-labelledby="src">
<h2 id="src">The manuscripts</h2>
<p style="margin-top:16px"><a href="https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/preprints/The-Quasi-Riemann-Hypothesis-October-5-2026/paper2.pdf">The Quasi-Riemann Hypothesis</a>, 5 October 2026. The film follows it: §2.2 for the family and the mean-square estimate, §3 for how it is spent, §§2.3–2.5 and §§4–7 for how it is proved.</p>
<p><a href="https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/preprints/The-Quasi-Riemann-Hypothesis-September-30-2026/paper.pdf">The Quasi-Riemann Hypothesis: A Zero-Free Half-Plane Re(s) &gt; 7/8</a>, 30 September 2026. The closing chapter draws on its proof overview.</p>
</section>
<footer>
<p>Narration: ElevenLabs, voice Sarah, Eleven v4. Captions are timed from the narration's own timestamps.</p>
<p>Numerics (random walks, the twisted family at D = 2000, copies, Gauss sums) computed with NumPy. Animated with Remotion; mathematics typeset with KaTeX; set in Bodoni Moda and IBM Plex Sans.</p>
<p>Source for the film and this page: <a href="https://github.com/utpalchakraborty/quasi-riemann-explained/tree/main/studio-energy">studio-energy/</a>.</p>
</footer>
</main>
<script>
const film=document.getElementById('film');
const go=t=>{film.currentTime=+t;film.play().catch(()=>{});film.scrollIntoView({behavior:'smooth',block:'center'});};
document.querySelectorAll('[data-t]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.t)));
const navButtons=[...document.querySelectorAll('nav button')];
film.addEventListener('timeupdate',()=>{let k=-1;navButtons.forEach((b,i)=>{if(film.currentTime>=+b.dataset.t)k=i;});navButtons.forEach((b,i)=>b.classList.toggle('on',i===k));});
</script>
</body>
</html>
`;
writeFileSync(join(SITE, 'index.html'), html);
console.log(`site: ${chapters.length} chapters, ${cues.length} captions, ${passages.length} passages, total ${mmss(total)}, version ${version}`);
if (existsSync(videoPath)) console.log('video', (statSync(videoPath).size / 1048576).toFixed(1), 'MiB');
