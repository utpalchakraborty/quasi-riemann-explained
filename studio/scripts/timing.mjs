// Builds src/data/timing.json: each passage's duration and the start/end time
// of every caption word, from the ElevenLabs character timestamps.
import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {allPassages, spoken} from '../src/narration/script.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = {};
for (const p of allPassages()) {
	const rec = JSON.parse(readFileSync(join(ROOT, 'public', 'narration', `${p.id}.json`), 'utf8'));
	const a = rec.alignment;
	const chars = a.characters.join('');
	const say = spoken(p.text);
	const offset = chars.lastIndexOf(say);
	if (offset < 0) throw new Error(`${p.id}: alignment does not contain the spoken text`);
	const shown = p.text.split(/\s+/);
	const words = [];
	const re = /\S+/g;
	let m;
	let k = 0;
	while ((m = re.exec(say))) {
		const i0 = offset + m.index;
		const i1 = offset + m.index + m[0].length - 1;
		words.push({w: shown[k], s: +a.character_start_times_seconds[i0].toFixed(3), e: +a.character_end_times_seconds[i1].toFixed(3)});
		k++;
	}
	if (k !== shown.length) throw new Error(`${p.id}: ${k} spoken words for ${shown.length} caption words`);
	out[p.id] = {duration: rec.duration, words};
}
writeFileSync(join(ROOT, 'src', 'data', 'timing.json'), JSON.stringify(out));
console.log('timing for', Object.keys(out).length, 'passages');
