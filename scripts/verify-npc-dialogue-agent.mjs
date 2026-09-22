import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2] || process.cwd();
const checks = [
  ['docs/agents/AI_NPC_DIALOGUE_AGENT.md', ['AI-NPC-Dialogue-Agent', 'Game state owns truth. NPCs communicate it.', 'NPC-001']],
  ['src/views/NPCDialogueAgentView.tsx', ['AI-NPC-Dialogue-Agent', 'Aria Pulse', 'Prototype', 'Game state owns truth. NPCs communicate it.']],
  ['src/types.ts', ["| 'npc-dialogue'"]],
  ['src/components/Navbar.tsx', ["{ id: 'npc-dialogue', label: 'NPC Dialogue'"]],
  ['src/App.tsx', ["import { NPCDialogueAgentView } from './views/NPCDialogueAgentView';", "activeTab === 'npc-dialogue' && <NPCDialogueAgentView />"]]
];

let failed = false;
for (const [relative, needles] of checks) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    console.error(`FAIL missing ${relative}`);
    failed = true;
    continue;
  }
  const text = fs.readFileSync(file, 'utf8');
  for (const needle of needles) {
    if (!text.includes(needle)) {
      console.error(`FAIL ${relative} missing: ${needle}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log('PASS NPC dialogue agent repository wiring verified');
