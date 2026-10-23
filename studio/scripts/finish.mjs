// Renders and packages the film for the v2 site.
//   1. Remotion renders a high-quality silent master and the narration as WAV.
//   2. The narration is downmixed to mono, set to -19 LUFS and peak-limited.
//   3. The final MP4: x264 tuned for animation, mono AAC, English captions and
//      chapters embedded, moov atom first for streaming.
//   4. A poster frame, then the page and edition metadata are rebuilt.
//
//   node scripts/finish.mjs            full pipeline
//   node scripts/finish.mjs --package  skip rendering; reuse out/master.mp4 and out/narration.wav
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {TIMELINE} from '../src/timeline.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = resolve(ROOT, '..', 'v2');
const OUT = join(ROOT, 'out');
const VIDEO = join(SITE, 'The-Fixed-Frontier.mp4');
const env = {...process.env};
for (const k of Object.keys(env)) if (/KEY|TOKEN|SECRET|PASSWORD/i.test(k)) delete env[k];
const run = (cmd, args) => execFileSync(cmd, args, {cwd: ROOT, stdio: ['ignore', 'pipe', 'inherit'], env}).toString();

const packageOnly = process.argv.includes('--package');
if (!packageOnly) {
	console.log('rendering master video');
	run('npx', ['remotion', 'render', 'src/index.ts', 'Film', join(OUT, 'master.mp4'), '--codec=h264', '--crf=14', '--x264-preset=fast', '--muted', '--concurrency=8', '--log=error']);
	console.log('rendering narration');
	run('npx', ['remotion', 'render', 'src/index.ts', 'Film', join(OUT, 'narration.wav'), '--codec=wav', '--log=error']);
}

console.log('measuring loudness');
// Remotion writes stereo; downmix to mono first so the gain and limiter see the
// final signal. Mono speech targets -19 LUFS, which plays as about -16 on two speakers.
const DOWNMIX = 'pan=mono|c0=0.5*c0+0.5*c1';
const measured = execFileSync('sh', ['-c', `ffmpeg -hide_banner -nostats -i "${join(OUT, 'narration.wav')}" -af "${DOWNMIX},ebur128" -f null - 2>&1 | grep -E "^\\s+I:" | tail -1`], {env})
	.toString()
	.trim()
	.split(/\s+/)[1];
const gain = (-19 - Number(measured)).toFixed(2);
const audioFilter = `${DOWNMIX},volume=${gain}dB,alimiter=limit=0.84:attack=5:release=50:level=false,aresample=48000`;
console.log('narration', measured, 'LUFS mono; gain', gain, 'dB');

console.log('building captions and chapters');
run('node', ['scripts/build-site.mjs']);

console.log('encoding the final film');
run('ffmpeg', [
	'-v', 'error', '-y',
	'-i', join(OUT, 'master.mp4'),
	'-i', join(OUT, 'narration.wav'),
	'-i', join(SITE, 'subtitles.srt'),
	'-i', join(OUT, 'chapters.ffmetadata'),
	'-map', '0:v', '-map', '1:a', '-map', '2:s',
	'-map_metadata', '3', '-map_chapters', '3',
	'-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '27', '-g', '300', '-pix_fmt', 'yuv420p',
	'-af', audioFilter, '-c:a', 'aac', '-b:a', '96k',
	'-c:s', 'mov_text', '-metadata:s:s:0', 'language=eng', '-metadata:s:a:0', 'language=eng',
	'-metadata', 'title=The fixed frontier',
	'-movflags', '+faststart',
	VIDEO,
]);

console.log('poster');
const titleItem = TIMELINE.items.find((it) => it.kind === 'title');
const posterAt = ((titleItem.from + titleItem.frames - 20) / 30).toFixed(3);
run('ffmpeg', ['-v', 'error', '-y', '-ss', posterAt, '-i', join(OUT, 'master.mp4'), '-frames:v', '1', '-q:v', '3', join(SITE, 'poster.jpg')]);

console.log('page and edition');
run('node', ['scripts/build-site.mjs']);
const bytes = statSync(VIDEO).size;
const sha256 = createHash('sha256').update(readFileSync(VIDEO)).digest('hex');
const info = JSON.parse(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=codec_type,codec_name,width,height,r_frame_rate,bit_rate', '-of', 'json', VIDEO]));
const v = info.streams.find((s) => s.codec_type === 'video');
const loud = execFileSync('sh', ['-c', `ffmpeg -hide_banner -nostats -i "${VIDEO}" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -E "^\\s+(I|Peak):" | tail -2`], {env}).toString().trim();
writeFileSync(
	join(SITE, 'edition.json'),
	JSON.stringify(
		{
			edition: 'v2-the-fixed-frontier',
			updated: new Date().toISOString().slice(0, 10),
			duration_seconds: +(+info.format.duration).toFixed(3),
			chapter_count: JSON.parse(readFileSync(join(SITE, 'chapters.json'), 'utf8')).length,
			narration: 'ElevenLabs Sarah (EXAVITQu4vr4xnSDxMaL), eleven_v4',
			video: {file: 'The-Fixed-Frontier.mp4', sha256, bytes, width: v.width, height: v.height, fps: 30, video_bitrate: +v.bit_rate},
			audio_loudness: loud.replace(/\s+/g, ' '),
			independent_proof_verification: false,
			source: 'studio/ (Remotion project)',
		},
		null,
		2,
	) + '\n',
);
console.log('done:', (bytes / 1048576).toFixed(1), 'MiB', sha256.slice(0, 12), loud.replace(/\s+/g, ' '));
if (!existsSync(join(SITE, 'poster.jpg'))) throw new Error('poster missing');
