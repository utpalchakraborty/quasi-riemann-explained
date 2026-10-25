// Enforces the mood board: colors, typefaces and translucency come from
// src/design/tokens.ts and nowhere else.
import {readFileSync, readdirSync, statSync} from 'node:fs';
import {join, relative, resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const ALLOWED = new Set(['design/tokens.ts']);
const RULES = [
	[/#[0-9a-fA-F]{3,8}\b/, 'hex color literal: use color.* or alpha() from tokens'],
	[/\brgba?\s*\(/, 'rgb()/rgba() literal: use alpha() from tokens'],
	[/\bhsla?\s*\(/, 'hsl() literal: use tokens'],
	[/fontFamily:\s*['"`]/, 'font family literal: use font.display or font.text'],
	[/var\(--/, 'CSS variable: use tokens'],
	[/\b(white|black|red|green|blue|yellow|orange|gray|grey)\b['"]/, 'named color: use tokens'],
];
const files = [];
const walk = (d) => {
	for (const n of readdirSync(d)) {
		const p = join(d, n);
		if (statSync(p).isDirectory()) walk(p);
		else if (/\.(tsx?|mjs)$/.test(n)) files.push(p);
	}
};
walk(SRC);
let problems = 0;
for (const f of files) {
	const rel = relative(SRC, f);
	if (ALLOWED.has(rel)) continue;
	readFileSync(f, 'utf8')
		.split('\n')
		.forEach((line, i) => {
			if (/^\s*\/\//.test(line)) return;
			for (const [re, msg] of RULES)
				if (re.test(line)) {
					problems++;
					console.log(`${rel}:${i + 1}: ${msg}\n    ${line.trim()}`);
				}
		});
}
console.log(problems ? `${problems} design violation(s)` : `design lint: ${files.length} files clean`);
process.exit(problems ? 1 : 0);
