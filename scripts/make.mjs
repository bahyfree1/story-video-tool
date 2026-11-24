// Usage: node scripts/make.mjs <project> [style] [lang] [--scale 0.5]
import {execSync} from 'node:child_process';
const [project, style = 'documentary', lang = 'ar', ...rest] = process.argv.slice(2);
if (!project) { console.log('usage: node scripts/make.mjs <project> [style] [lang]'); process.exit(1); }
execSync(`python3 scripts/align.py ${project} ${style} ${lang}`, {stdio: 'inherit'});
execSync(`npx remotion render src/index.ts Story out/${project}.mp4 --props=public/projects/${project}/timeline.json ${rest.join(' ')}`, {stdio: 'inherit'});
console.log(`done: out/${project}.mp4`);
