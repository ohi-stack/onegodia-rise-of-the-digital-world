import React from 'react';
import {
  Bot,
  BrainCircuit,
  CheckCircle2,
  CircleDot,
  GitBranch,
  MessageCircle,
  Network,
  Route,
  ShieldCheck,
  UserRound,
  Workflow
} from 'lucide-react';

const responsibilities = [
  'Mission NPC dialogue',
  'Interaction-state flow',
  'Dialogue conditions',
  'Character knowledge boundaries',
  'Relationship / memory roadmap',
  'Browser + Unreal NPC contracts',
  'Smart NPC safety boundaries',
  'NPC interaction QA'
];

const currentStatuses = [
  {
    name: 'Aria Pulse — Browser Prototype',
    status: 'Prototype',
    detail: 'Scripted Mission 001 interaction already exists in the browser canvas and responds to mission state.'
  },
  {
    name: 'NPC-001 — Reusable Interaction State Machine',
    status: 'Planned',
    detail: 'Formalize approach, greeting, offer, active-mission, return-ready, completion, and post-mission states.'
  },
  {
    name: 'Persistent Relationships / Memory',
    status: 'Roadmap',
    detail: 'Structured gameplay facts and relationship events will be persisted through Game Services when activated.'
  },
  {
    name: 'Model-Assisted Smart Dialogue',
    status: 'Roadmap',
    detail: 'Generative dialogue remains behind canonical state, knowledge, validation, cost, privacy, and safety controls.'
  }
];

const interactionFlow = [
  'Player Nearby',
  'Interaction Ready',
  'Greeting',
  'Mission Offer',
  'Mission Active',
  'Return Ready',
  'Completion Dialogue',
  'Post-Mission State'
];

const roadmap = [
  ['NPC V1', 'Scripted Foundation', 'Deterministic identity, interaction, mission-aware dialogue, completion dialogue.'],
  ['V1.1', 'Conditional Characters', 'Inventory, reputation, world-state, and branch conditions.'],
  ['V1.2', 'Routines + World Behavior', 'Schedules, navigation, Smart Objects / StateTree where justified.'],
  ['V1.3', 'Persistent Relationships', 'Durable relationship state and remembered gameplay actions.'],
  ['V1.4', 'Model-Assisted Dialogue', 'Validated generative conversation constrained by canonical game state.'],
  ['V1.5+', 'Dynamic / Living World', 'Contextual opportunities, factions, social networks, and richer character behavior.']
];

export const NPCDialogueAgentView: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <section className="relative overflow-hidden rounded-2xl border border-violet-500/25 bg-[#0b0e14]/95 p-6 md:p-9 shadow-2xl shadow-black/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.15),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10),transparent_30%)] pointer-events-none" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-violet-300">
              <MessageCircle className="h-3.5 w-3.5" />
              Onegodia Game Studio • Character Systems
            </div>
            <h1 className="mt-5 text-3xl md:text-5xl font-black tracking-tight text-white">AI-NPC-Dialogue-Agent</h1>
            <p className="mt-3 max-w-3xl text-base md:text-lg leading-relaxed text-slate-300">
              Mission NPC dialogue, interaction flow, character-state contracts, and the staged smart-NPC roadmap for
              <span className="font-semibold text-white"> Onegodia: Rise of the Digital World™</span>.
            </p>
            <div className="mt-6 rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-4">
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-cyan-300">Core rule</p>
              <p className="mt-2 text-xl md:text-2xl font-black text-white">Game state owns truth. NPCs communicate it.</p>
              <p className="mt-2 text-sm text-slate-400">NPC dialogue never independently grants rewards, completes missions, changes ownership, or overrides canonical player state.</p>
            </div>
          </div>

          <div className="rounded-xl border border-[#29303e] bg-[#0f131b]/90 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-slate-500">Reference character</p>
                <p className="mt-1 font-bold text-white">Aria Pulse</p>
              </div>
              <UserRound className="h-7 w-7 text-violet-300" />
            </div>
            <p className="mt-2 text-sm text-slate-400">Mission Guide • Mission 001 — Rebuilding Signal</p>
            <div className="my-5 h-px bg-[#252b36]" />
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-slate-500">Current evidence</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">The browser prototype already contains scripted Aria Pulse dialogue, mission acceptance, active-state guidance, fragment turn-in, and completion dialogue. This is prototype evidence—not proof of autonomous smart-NPC gameplay or Unreal playability.</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {responsibilities.map((item) => (
          <div key={item} className="rounded-xl border border-[#242a35] bg-[#0d1118] p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
              <span className="text-sm font-semibold text-slate-200">{item}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-[#242a35] bg-[#0b0f16] p-5 md:p-7">
        <div className="flex items-start gap-3">
          <Workflow className="mt-0.5 h-5 w-5 text-violet-400" />
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-violet-300">Canonical NPC interaction flow</p>
            <h2 className="mt-1 text-xl font-black text-white">State-aware conversation, not a single static script</h2>
            <p className="mt-2 text-sm text-slate-400">The same NPC responds differently as mission and player state change. The Mission System remains authoritative.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {interactionFlow.map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-lg border border-[#222936] bg-[#0f141d] px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-violet-500/40 bg-violet-500/10 font-mono text-xs font-black text-violet-300">{index + 1}</div>
              <div>
                <p className="text-sm font-bold text-slate-100">{step}</p>
                <p className="mt-0.5 text-[10px] font-mono uppercase tracking-wide text-slate-600">Condition-driven</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#242a35] bg-[#0b0f16] p-5 md:p-7">
          <div className="flex items-center gap-3"><CircleDot className="h-5 w-5 text-cyan-400" /><h2 className="text-xl font-black text-white">Current status</h2></div>
          <div className="mt-5 space-y-3">
            {currentStatuses.map((item) => (
              <div key={item.name} className="rounded-xl border border-[#232a36] bg-[#10151e] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-white">{item.name}</p>
                  <span className="rounded border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wide text-violet-300">{item.status}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#242a35] bg-[#0b0f16] p-5 md:p-7">
          <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-emerald-400" /><h2 className="text-xl font-black text-white">Authority boundaries</h2></div>
          <div className="mt-5 space-y-3 text-sm text-slate-400">
            <p><strong className="text-white">Mission System:</strong> mission availability, objective state, success/failure, rewards.</p>
            <p><strong className="text-white">NPC System:</strong> identity, interaction availability, dialogue selection, character presentation.</p>
            <p><strong className="text-white">UI System:</strong> prompts, dialogue panels, response controls, subtitles, mission presentation.</p>
            <p><strong className="text-white">Inventory / Reward Systems:</strong> actual item and Credit grants.</p>
            <p><strong className="text-white">Game Services:</strong> future durable relationship, memory, and cross-client records.</p>
          </div>
          <div className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-xs font-mono uppercase tracking-[0.14em] text-amber-300">Generative dialogue rule</p>
            <p className="mt-2 text-sm text-slate-300">A language model may propose dialogue or structured intent; authoritative game systems validate every state-changing request.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#242a35] bg-[#0b0f16] p-5 md:p-7">
        <div className="flex items-center gap-3"><BrainCircuit className="h-5 w-5 text-fuchsia-400" /><h2 className="text-xl font-black text-white">Smart NPC roadmap</h2></div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {roadmap.map(([version, title, detail]) => (
            <div key={version} className="rounded-xl border border-[#232a36] bg-[#10151e] p-4">
              <div className="flex items-center gap-3">
                <span className="rounded border border-fuchsia-500/30 bg-fuchsia-500/10 px-2 py-0.5 text-[10px] font-mono font-black text-fuchsia-300">{version}</span>
                <p className="font-bold text-white">{title}</p>
              </div>
              <p className="mt-2 text-sm text-slate-400">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-[#242a35] bg-[#0d1118] p-5"><Route className="h-5 w-5 text-violet-400" /><h3 className="mt-3 font-black text-white">First milestone</h3><p className="mt-2 text-sm text-slate-400">NPC-001 formalizes Aria Pulse as the reference Mission 001 interaction flow across browser and Unreal specifications.</p></div>
        <div className="rounded-xl border border-[#242a35] bg-[#0d1118] p-5"><Network className="h-5 w-5 text-cyan-400" /><h3 className="mt-3 font-black text-white">Cross-client contract</h3><p className="mt-2 text-sm text-slate-400">Browser and Unreal may use different technology, but share NPC identity, mission meaning, dialogue-state semantics, and future durable records.</p></div>
        <div className="rounded-xl border border-[#242a35] bg-[#0d1118] p-5"><GitBranch className="h-5 w-5 text-emerald-400" /><h3 className="mt-3 font-black text-white">Evidence before status</h3><p className="mt-2 text-sm text-slate-400">Scripted browser behavior is Prototype. Playable/Verified promotion requires evidence defined by the designated build policy.</p></div>
      </section>

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 md:p-7">
        <div className="flex items-start gap-3"><Bot className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" /><div><p className="text-[11px] font-mono uppercase tracking-[0.16em] text-emerald-300">NPC-001 success test</p><p className="mt-2 text-base font-bold text-white">Meet Aria → make a clear choice → complete Mission 001 → return → receive the correct state-aware response → save/reload without duplicate rewards.</p><p className="mt-2 text-sm leading-relaxed text-slate-400">Once repeatable, the architecture can expand to relationships, routines, reputation, economic roles, and validated model-assisted dialogue.</p></div></div>
      </section>
    </div>
  );
};
