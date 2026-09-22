import fs from 'node:fs';

const required = [
  ['src/components/September22Milestone.tsx', [
    'September 22, 2026',
    'From 2D Prototype to a Playable 3D World',
    'Browser V1 Milestone'
  ]],
  ['src/App.tsx', [
    'September22Milestone',
    "activeTab === 'home'"
  ]],
  ['src/views/DevelopmentStatusView.tsx', [
    'September22Milestone',
    'Browser V1 milestone'
  ]]
];

let failed = false;

for (const [file, needles] of required) {
  if (!fs.existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    failed = true;
    continue;
  }

  const source = fs.readFileSync(file, 'utf8');
  for (const needle of needles) {
    if (!source.includes(needle)) {
      console.error(`${file} is missing required milestone text: ${needle}`);
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
}

console.log('September 22, 2026 milestone integration is present in the expected public-site surfaces.');
