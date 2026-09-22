import fs from 'node:fs';

const failures = [];
const specPath = 'docs/AI_UNREAL_DEVELOPER.md';
const mediaPath = 'src/views/MediaView.tsx';
const developersPath = 'src/views/DevelopersView.tsx';

if (!fs.existsSync(specPath)) {
  failures.push('missing docs/AI_UNREAL_DEVELOPER.md');
} else {
  const spec = fs.readFileSync(specPath, 'utf8');
  for (const needle of [
    'AI-UNREAL-DEVELOPER',
    'UNREAL-001',
    'Stamford Hospital',
    'PLAYABLE FIRST. EXPANSIVE LATER.',
  ]) {
    if (!spec.includes(needle)) failures.push(`spec missing: ${needle}`);
  }
}

const media = fs.readFileSync(mediaPath, 'utf8');
for (const needle of [
  'AI-Unreal-Developer — Stamford V1 Concept',
  'CONCEPT ART — NOT PLAYABLE EVIDENCE',
  'Visual concepts are development references only',
]) {
  if (!media.includes(needle)) failures.push(`media missing: ${needle}`);
}

const developers = fs.readFileSync(developersPath, 'utf8');
if (!developers.includes("AI-Unreal-Developer")) {
  failures.push('DevelopersView missing AI-Unreal-Developer role');
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('AI-Unreal-Developer integration verification passed.');
