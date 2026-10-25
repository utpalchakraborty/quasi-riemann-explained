// Compares local Whisper transcripts (.cache/stt/*.txt) with the script.
import {readFileSync, existsSync} from 'node:fs';
import {join, resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {allPassages, spoken} from '../src/narration/script.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const NUM = {'1859': 'eighteen fifty nine', '1896': 'eighteen ninety six', '1958': 'nineteen fifty eight', '2026': 'twenty twenty six', '366791': 'three hundred sixty six thousand seven hundred ninety one', '43': 'forty three'};
const norm = (s) => s.toLowerCase().replace(/[’']/g, '').replace(/,(?=\d)/g, '').replace(/-/g, ' ').replace(/[^a-z0-9éè ]+/g, ' ').split(/\s+/).filter(Boolean).flatMap((w) => (NUM[w] ? NUM[w].split(' ') : [w]));
const diff = (a, b) => {
	const n = a.length, m = b.length, L = Array.from({length: n + 1}, () => new Int32Array(m + 1));
	for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
	const out = [];
	let i = 0, j = 0;
	while (i < n || j < m) {
		if (i < n && j < m && a[i] === b[j]) { i++; j++; continue; }
		if (j < m && (i === n || L[i][j + 1] >= L[i + 1][j])) out.push(`+${b[j++]}`);
		else out.push(`-${a[i++]}`);
	}
	return out;
};
for (const p of allPassages()) {
	const f = join(ROOT, '.cache', 'stt', `${p.id}.txt`);
	if (!existsSync(f)) { console.log(p.id, 'missing'); continue; }
	const d = diff(norm(spoken(p.text)), norm(readFileSync(f, 'utf8')));
	console.log(p.id.padEnd(12), d.length ? d.join(' ') : 'ok');
}
