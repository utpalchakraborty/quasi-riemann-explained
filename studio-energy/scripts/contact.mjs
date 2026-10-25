// Renders review stills for scenes and tiles them into contact sheets.
//
//   node scripts/contact.mjs open-riemann open-border      fractions .15 .5 .85
//   node scripts/contact.mjs --at open-claim:0.3,0.6        chosen fractions
//   node scripts/contact.mjs --all                           every scene and card
//   add --out out/contact-mine to write somewhere else
//
// Output: out/contact/<scene>.jpg (one row per scene) and out/contact/sheet-<n>.jpg.

import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {TIMELINE} from '../src/timeline.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const outAt = argv.indexOf('--out');
const OUT = outAt >= 0 ? resolve(ROOT, argv[outAt + 1]) : join(ROOT, 'out', 'contact');
mkdirSync(OUT, {recursive: true});

const args = outAt >= 0 ? argv.filter((_, i) => i !== outAt && i !== outAt + 1) : argv;
const wanted = new Map();
const nameOf = (it) => (it.kind === 'scene' ? it.scene.id : `${it.kind}-${it.chapter.id}`);
if (args[0] === '--all') for (const it of TIMELINE.items) wanted.set(nameOf(it), it.kind === 'scene' ? [0.2, 0.55, 0.9] : [0.7]);
else
	for (let i = 0; i < args.length; i++) {
		if (args[i] === '--at') {
			const [id, fr] = args[++i].split(':');
			wanted.set(id, fr.split(',').map(Number));
		} else wanted.set(args[i], [0.15, 0.5, 0.85]);
	}

const serveUrl = await bundle({entryPoint: join(ROOT, 'src', 'index.ts'), publicDir: join(ROOT, 'public')});
const composition = await selectComposition({serveUrl, id: 'Film'});
const rows = [];
for (const it of TIMELINE.items) {
	const name = nameOf(it);
	if (!wanted.has(name)) continue;
	const files = [];
	for (const [k, fr] of wanted.get(name).entries()) {
		const frame = Math.min(it.from + it.frames - 1, Math.round(it.from + fr * it.frames));
		const file = join(OUT, `${name}-${k}.jpg`);
		await renderStill({composition, serveUrl, output: file, frame, imageFormat: 'jpeg', jpegQuality: 85, scale: 0.5});
		files.push(file);
	}
	const row = join(OUT, `${name}.jpg`);
	if (files.length === 1) execFileSync('cp', [files[0], row]);
	else execFileSync('ffmpeg', ['-v', 'error', '-y', ...files.flatMap((f) => ['-i', f]), '-filter_complex', `hstack=inputs=${files.length}`, row]);
	rows.push(row);
	console.log('rendered', name, files.length);
}
// Sheets of up to three rows each, padded to the widest row.
const widest = Math.max(...[...wanted.values()].map((fr) => fr.length)) * 960;
for (let s = 0; s * 3 < rows.length; s++) {
	const group = rows.slice(s * 3, s * 3 + 3);
	const sheet = join(OUT, `sheet-${s + 1}.jpg`);
	if (group.length === 1) execFileSync('cp', [group[0], sheet]);
	else
		execFileSync('ffmpeg', [
			'-v', 'error', '-y',
			...group.flatMap((f) => ['-i', f]),
			'-filter_complex',
			group.map((_, i) => `[${i}]pad=w=${widest}:h=540:color=0xDCCFB2[p${i}]`).join(';') + ';' + group.map((_, i) => `[p${i}]`).join('') + `vstack=inputs=${group.length}`,
			sheet,
		]);
	console.log('sheet', sheet);
}
