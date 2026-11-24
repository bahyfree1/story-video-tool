// Usage: node scripts/new-style.mjs myStyle   -> creates src/styles/myStyle.ts from documentary and registers it
import fs from 'node:fs';
const name = process.argv[2];
if (!name) { console.log('usage: node scripts/new-style.mjs <name>'); process.exit(1); }
let src = fs.readFileSync('src/styles/documentary.ts', 'utf8').replaceAll('documentary', name);
fs.writeFileSync(`src/styles/${name}.ts`, src);
let idx = fs.readFileSync('src/styles/index.ts', 'utf8');
idx = idx.replace("import {documentary} from './documentary';", `import {documentary} from './documentary';\nimport {${name}} from './${name}';`).replace('= {documentary,', `= {documentary, ${name},`);
fs.writeFileSync('src/styles/index.ts', idx);
console.log(`created src/styles/${name}.ts. Edit colors/captions, then: node scripts/make.mjs <project> ${name}`);
