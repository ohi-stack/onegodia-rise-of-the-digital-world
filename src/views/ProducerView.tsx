import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  GitBranch,
  Milestone,
  Network,
  ShieldCheck,
  TimerReset,
  Workflow
} from 'lucide-react';

const responsibilities = [
  'Sprint planning',
  'Task breakdown',
  'Dependency management',
  'Milestone reporting',
  'Blocker tracking',
  'Scope control',
  'Team coordination',
  'Evidence-based delivery'
];

const publicStatuses = [
  {
    name: 'Planned',
    description: 'Approved direction exists, but implementation evidence is not sufficient to claim active construction.'
  },
  {
    name: 'Building',
    description: 'Implementation work is underway, but verification requirements have not yet been satisfied.'
  },
  {
    name: 'Verified',
    description: 'Acceptance criteria were exercised and traceable evidence was recorded.'
  },
  {
    name: 'Playable',
    description: 'A player can actually exercise the feature in the designated Unreal build.'
  }
];

const blockerLevels = [
  { code: 'P0', title: 'Production Stop', description: 'Core build cannot continue.' },
  { code: 'P1', title: 'Sprint Critical', description: 'The active sprint objective is endangered.' },
  { code: 'P2', title: 'Feature Blocking', description: 'A feature or dependency cannot proceed.' },
  { code: 'P3', title: 'Non-Critical', description: 'Work can continue with limited impact.' }
];

const pipeline = [
  'Unreal Initialized',
  'Stamford GIS',
  'Stamford Hospital',
  'Player Foundation',
  'Roads / City',
  'Driving',
  'Mission 001',
  'NPCs',
  'HUD',
  'Vertical Slice',
  'V1'
];

export const ProducerView: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <section className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-[#0b0e14]/95 p-6 md:p-9 shadow-2xl shadow-black/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_30%)] pointer-events-none" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-amber-300">
              <ClipboardList className="h-3.5 w-3.5" />
              Onegodia Game Studio • Production Control
            </div>
            <h1 className="mt-5 text-3xl md:text-5xl font-black tracking-tight text-white">
              AI-Game-Producer
            </h1>
            <p className="mt-3 max-w-3xl text-base md:text-lg leading-relaxed text-slate-300">
              Sprint planning, task breakdown, milestone reports, dependency control, and blocker tracking for
              <span className="font-semibold text-white"> Onegodia: Rise of the Digital World™</span>.
            </p>
            <div className="mt-6 rounded-xl border border-blue-500/25 bg-blue-500/5 p-4">
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-blue-300">Production doctrine</p>
              <p className="mt-2 text-xl md:text-2xl font-black text-white">Playable first. Expansive later.</p>
              <p className="mt-2 text-sm text-slate-400">
                Every sprint must identify what becomes demonstrably more playable when the sprint is complete.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#29303e] bg-[#0f131b]/90 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-slate-500">Reporting line</p>
                <p className="mt-1 font-bold text-white">Founder / Game Director</p>
              </div>
              <ShieldCheck className="h-7 w-7 text-amber-300" />
            </div>
            <p className="mt-2 text-sm text-slate-400">One Gregory Onegodian™</p>
            <div className="my-5 h-px bg-[#252b36]" />
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-slate-500">Producer rule</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Do not report a feature as complete because it appears in documentation, generated code, a GitHub issue,
              a mockup, a screenshot, or an agent response. Status promotion requires evidence.
            </p>
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
          <Workflow className="mt-0.5 h-5 w-5 text-blue-400" />
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-blue-300">Current public production pipeline</p>
            <h2 className="mt-1 text-xl font-black text-white">Evidence-gated progression</h2>
            <p className="mt-2 text-sm text-slate-400">
              This sequence mirrors the repository development-status policy. It is a production path, not a claim that every stage is complete.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {pipeline.map((step, index) => (
            <div key={step} className="flex items-center gap-3 rounded-lg border border-[#222936] bg-[#0f141d] px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-500/40 bg-blue-500/10 font-mono text-xs font-black text-blue-300">
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-100">{step}</p>
                <p className="mt-0.5 text-[10px] font-mono uppercase tracking-wide text-slate-600">Status requires evidence</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#242a35] bg-[#0b0f16] p-5 md:p-7">
          <div className="flex items-center gap-3">
            <Milestone className="h-5 w-5 text-emerald-400" />
            <h2 className="text-xl font-black text-white">Public status model</h2>
          </div>
          <div className="mt-5 space-y-3">
            {publicStatuses.map((status, index) => (
              <div key={status.name} className="rounded-xl border border-[#232a36] bg-[#10151e] p-4">
                <div className="flex items-center gap-3">
                  <CircleDot className={`h-4 w-4 ${index < 2 ? 'text-amber-400' : 'text-emerald-400'}`} />
                  <p className="font-bold text-white">{status.name}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{status.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#242a35] bg-[#0b0f16] p-5 md:p-7">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <h2 className="text-xl font-black text-white">Blocker register</h2>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Blockers are tracked by severity so production attention goes to the issue with the greatest effect on the active milestone.
          </p>
          <div className="mt-5 space-y-3">
            {blockerLevels.map((item) => (
              <div key={item.code} className="grid grid-cols-[48px_1fr] gap-3 rounded-xl border border-[#232a36] bg-[#10151e] p-4">
                <div className="flex h-9 items-center justify-center rounded border border-rose-500/30 bg-rose-500/10 font-mono text-xs font-black text-rose-300">
                  {item.code}
                </div>
                <div>
                  <p className="font-bold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-[#242a35] bg-[#0d1118] p-5">
          <GitBranch className="h-5 w-5 text-blue-400" />
          <h3 className="mt-3 font-black text-white">Repository evidence</h3>
          <p className="mt-2 text-sm text-slate-400">Issues, commits, pull requests, builds, tests, and QA records should support milestone claims.</p>
        </div>
        <div className="rounded-xl border border-[#242a35] bg-[#0d1118] p-5">
          <Network className="h-5 w-5 text-cyan-400" />
          <h3 className="mt-3 font-black text-white">Dependency control</h3>
          <p className="mt-2 text-sm text-slate-400">Hard prerequisites are resolved before downstream work is promoted into the active sprint.</p>
        </div>
        <div className="rounded-xl border border-[#242a35] bg-[#0d1118] p-5">
          <TimerReset className="h-5 w-5 text-amber-400" />
          <h3 className="mt-3 font-black text-white">Daily producer check</h3>
          <p className="mt-2 text-sm text-slate-400">BUILD → VERIFY → BLOCK → NEXT → SCOPE keeps the team focused on the next dependency-correct action.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 md:p-7">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-emerald-300">Definition of done</p>
            <p className="mt-2 text-base font-bold text-white">Verified complete — evidence: specific proof.</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              If evidence is incomplete, the producer reports the work as Building or Implemented — Unverified internally rather than overstating the result.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
