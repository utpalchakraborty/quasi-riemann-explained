// Transcribes each narration take with ElevenLabs speech-to-text and reports
// words that differ from the script, to catch skipped or garbled words.
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {join, resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {allPassages, spoken} from '../src/narration/script.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'narration');
const ENV_FILE = process.env.ELEVENLABS_ENV_FILE ?? resolve(ROOT, '../../Math-To-Manim/.env.local');
const apiKey = readFileSync(ENV_FILE, 'utf8').split('\n').find((l) => l.startsWith('ELEVENLABS_API_KEY=')).split('=').slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');

const norm = (s) => s.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9éè ]+/g, ' ').split(/\s+/).filter(Boolean);

// word-level edit script (LCS) between expected and heard
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

const only = new Set(process.argv.slice(2));
const report = {};
for (const p of allPassages().filter((p) => only.size === 0 || only.has(p.id))) {
	const cache = join(OUT, `${p.id}.stt.json`);
	let text;
	if (existsSync(cache)) text = JSON.parse(readFileSync(cache, 'utf8')).text;
	else {
		const form = new FormData();
		form.append('model_id', 'scribe_v1');
		form.append('file', new Blob([readFileSync(join(OUT, `${p.id}.mp3`))], {type: 'audio/mpeg'}), `${p.id}.mp3`);
		const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {method: 'POST', headers: {'xi-api-key': apiKey}, body: form});
		if (!res.ok) { console.error(p.id, res.status, (await res.text()).replaceAll(apiKey, '[redacted]').slice(0, 300)); process.exit(1); }
		text = (await res.json()).text;
		writeFileSync(cache, JSON.stringify({text}));
	}
	const d = diff(norm(spoken(p.text)), norm(text));
	report[p.id] = d;
	console.log(p.id.padEnd(12), d.length ? d.join(' ') : 'ok');
}
