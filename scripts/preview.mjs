// Usage: node scripts/preview.mjs <project> [style]  -> out/<project>-contact.png (6 evenly spaced frames) for a quick look
import {execSync} from 'node:child_process';
import fs from 'node:fs';
const [project, style = 'documentary'] = process.argv.slice(2);
execSync(`python3 scripts/align.py ${project} ${style}`, {stdio: 'inherit'});
const tl = JSON.parse(fs.readFileSync(`public/projects/${project}/timeline.json`));
const total = Math.ceil(tl.duration * tl.fps);
const frames = [0.04, 0.2, 0.36, 0.52, 0.68, 0.84].map((p) => Math.floor(total * p));
frames.forEach((f, i) => execSync(`npx remotion still src/index.ts Story out/prev${i}.png --frame=${f} --props=public/projects/${project}/timeline.json`, {stdio: 'inherit'}));
execSync(`ffmpeg -y -loglevel error ${frames.map((_, i) => `-i out/prev${i}.png`).join(' ')} -filter_complex "${frames.map((_, i) => `[${i}:v]scale=-1:560[v${i}]`).join(';')};${frames.map((_, i) => `[v${i}]`).join('')}hstack=inputs=6" out/${project}-contact.png`);
console.log(`wrote out/${project}-contact.png`);
