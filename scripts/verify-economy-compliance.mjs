import fs from 'node:fs';
import assert from 'node:assert/strict';

const registry = fs.readFileSync('src/data/gameAssetRegistry.ts', 'utf8');
const compliance = fs.readFileSync('src/views/ComplianceView.tsx', 'utf8');

assert(
  !/title:'Mission Assets'.*status:'Playable Now'/.test(registry),
  'Mission Assets cannot be Playable Now without Unreal evidence'
);
assert(
  compliance.includes('V1 Compliance Guardrails Active'),
  'Compliance page must use guardrails wording'
);
assert(
  compliance.includes('Ordinary Gameplay Economy'),
  'Compliance page must show the economy layer model'
);
assert(
  compliance.includes('Compliance Locked'),
  'Compliance page must preserve locked future systems'
);

console.log('economy compliance verification passed');
