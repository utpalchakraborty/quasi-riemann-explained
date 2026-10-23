// Synthesizes every narration passage with ElevenLabs (Sarah, Eleven v4) and
// stores audio plus character timestamps under public/narration/.
// A take is reused when its inputs are unchanged, so re-running never pays twice.
//
//   node scripts/narrate.mjs            all passages
//   node scripts/narrate.mjs open-1     selected passages
//
// The API key is read from ELEVENLABS_ENV_FILE (default: the Math-To-Manim
// .env.local used for the first edition). It is never written anywhere.

import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {allPassages, spoken} from '../src/narration/script.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public', 'narration');
const ENV_FILE = process.env.ELEVENLABS_ENV_FILE ?? resolve(ROOT, '../../Math-To-Manim/.env.local');
const VOICE = 'EXAVITQu4vr4xnSDxMaL'; // Sarah, as chosen for the first edition
const MODEL = 'eleven_v4';
const SETTINGS = {stability: 0.5, similarity_boost: 0.75};

const key = () => {
	const line = readFileSync(ENV_FILE, 'utf8')
		.split('\n')
		.find((l) => l.trim().startsWith('ELEVENLABS_API_KEY='));
	const value = line?.split('=').slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
	if (!value) throw new Error(`ELEVENLABS_API_KEY is not set in ${ENV_FILE}`);
	return value;
};

const synthesize = async (p, apiKey) => {
	const input = (p.dir ? `[${p.dir}] ` : '') + spoken(p.text);
	const payload = {text: input, model_id: MODEL, voice_settings: SETTINGS};
	const hash = createHash('sha256').update(JSON.stringify({payload, voice: VOICE})).digest('hex');
	const recordPath = join(OUT, `${p.id}.json`);
	if (existsSync(recordPath)) {
		const old = JSON.parse(readFileSync(recordPath, 'utf8'));
		if (old.hash === hash && existsSync(join(OUT, `${p.id}.mp3`))) return {id: p.id, reused: true};
	}
	const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_128`, {
		method: 'POST',
		headers: {'xi-api-key': apiKey, 'Content-Type': 'application/json'},
		body: JSON.stringify(payload),
	});
	if (!res.ok) {
		const body = (await res.text()).replaceAll(apiKey, '[redacted]');
		throw new Error(`${p.id}: HTTP ${res.status} ${body.slice(0, 600)}`);
	}
	const json = await res.json();
	writeFileSync(join(OUT, `${p.id}.mp3`), Buffer.from(json.audio_base64, 'base64'));
	const duration = Number(
		execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', join(OUT, `${p.id}.mp3`)], {
			env: {PATH: process.env.PATH},
		})
			.toString()
			.trim(),
	);
	writeFileSync(
		recordPath,
		JSON.stringify(
			{
				id: p.id,
				hash,
				voice_id: VOICE,
				model_id: MODEL,
				voice_settings: SETTINGS,
				input,
				duration,
				request_id: res.headers.get('request-id'),
				alignment: json.alignment,
				normalized_alignment: json.normalized_alignment,
			},
			null,
			1,
		),
	);
	return {id: p.id, reused: false, duration, chars: input.length};
};

const main = async () => {
	mkdirSync(OUT, {recursive: true});
	const only = new Set(process.argv.slice(2));
	const todo = allPassages().filter((p) => only.size === 0 || only.has(p.id));
	const apiKey = key();
	let next = 0;
	let spent = 0;
	const worker = async () => {
		while (next < todo.length) {
			const p = todo[next++];
			const r = await synthesize(p, apiKey);
			if (!r.reused) spent += r.chars;
			console.log(r.reused ? `reused ${r.id}` : `made ${r.id} ${r.duration.toFixed(2)} s, ${r.chars} chars`);
		}
	};
	await Promise.all([worker(), worker(), worker()]);
	console.log(`done: ${todo.length} passages, ${spent} characters synthesized`);
};

main().catch((e) => {
	console.error(e.message);
	process.exit(1);
});
