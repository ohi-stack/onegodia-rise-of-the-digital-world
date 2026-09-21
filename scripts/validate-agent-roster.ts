import assert from 'node:assert/strict';
import fs from 'node:fs';
import { AGENT_ROSTER, HUMAN_LEADERSHIP, getAgentByDispatchRole } from '../src/data/agentRoster';

assert.equal(HUMAN_LEADERSHIP.name, 'Gregory L. Jones');
assert.equal(HUMAN_LEADERSHIP.type, 'Human Leadership');
assert.equal(HUMAN_LEADERSHIP.finalAuthority, true);

assert.equal(AGENT_ROSTER.length, 31, 'The canonical Onegodia AI Game Studio must contain 31 AI agents.');
assert.equal(new Set(AGENT_ROSTER.map((agent) => agent.id)).size, AGENT_ROSTER.length, 'Agent IDs must be unique.');
assert.equal(new Set(AGENT_ROSTER.map((agent) => agent.dispatchRole)).size, AGENT_ROSTER.length, 'Dispatch roles must be unique.');
assert.ok(AGENT_ROSTER.every((agent) => agent.type === 'AI Agent'), 'Every roster entry must be explicitly identified as an AI Agent.');
assert.ok(AGENT_ROSTER.every((agent) => agent.responsibilities.length > 0), 'Every agent must have at least one responsibility.');

for (const requiredName of [
  'Emma Davies Agent',
  'Jessica Turner Agent',
  'Sophia Martinez Agent',
  'Aaron Lopez Agent',
  'Daniel Ramirez Agent',
  'Sophie Nguyen Agent',
  'Emily Johnson Agent',
  'Alex Turner Agent',
  'Jason Harper Agent',
  'Michael Chen Agent',
  'Ryan Johnson Agent',
  'Emily Chen Agent',
  'Natalie Wright Agent',
  'Jessica Lee Agent',
  'Michael Davis Agent',
  'Andrew Clark Agent'
]) {
  assert.ok(AGENT_ROSTER.some((agent) => agent.name === requiredName), `Missing required named agent persona: ${requiredName}`);
}

const leadDesigner = getAgentByDispatchRole('AI-Emma-Davies-Lead-Game-Design');
assert.equal(leadDesigner?.id, 'OG-AGENT-GD-001');

const serverSource = fs.readFileSync(new URL('../server.ts', import.meta.url), 'utf8');
assert.match(serverSource, /human-directed/i, 'Agent dispatch system prompt must identify agents as human-directed.');
assert.match(serverSource, /Gregory L\. Jones|One Gregory Onegodian/i, 'Agent dispatch system prompt must preserve Gregory as final human authority.');
assert.doesNotMatch(serverSource, /authoritative autonomous cybernetic intelligence unit/i, 'Server must not characterize development agents as autonomous authority.');

console.log(`Agent roster validation passed: ${AGENT_ROSTER.length} AI agents + human final authority.`);
