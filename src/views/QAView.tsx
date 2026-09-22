import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Gamepad2,
  GitBranch,
  ShieldCheck
} from 'lucide-react';

const responsibilities = [
  'Acceptance test planning',
  'Independent verification',
  'Bug reproduction and triage',
  'Regression testing',
  'Browser V1 playtesting',
  'Unreal V1 playtesting',
  'Evidence recording',
  'Release-gate recommendations'
];

const decisions = [
  { name: 'PASS — VERIFIED', description: 'Acceptance criteria were exercised successfully and supporting evidence was recorded.' },
  { name: 'PASS WITH KNOWN ISSUES', description: 'Core requirements passed while documented non-blocking defects remain.' },
  { name: 'FAIL', description: 'One or more required acceptance criteria failed.' },
  { name: 'BLOCKED', description: 'Testing could not be completed because a required dependency, environment, or build condition was unavailable.' },
  { name: 'NOT TESTED', description: 'No runtime verification evidence exists yet.' }
];

const severity = [
  { code: 'S0', title: 'Blocker', description: 'The build cannot reasonably be tested or a critical test prerequisite is unusable.' },
  { code: 'S1', title: 'Critical', description: 'The primary gameplay path crashes, breaks, or cannot be completed.' },
  { code: 'S2', title: 'Major', description: 'Important behavior is incorrect, but testing can continue.' },
  { code: 'S3', title: 'Minor', description: 'A localized defect has limited gameplay impact.' },
  { code: 'S4', title: 'Cosmetic', description: 'A presentation issue does not materially affect gameplay.' }
];

const testLevels = [
  'Smoke Test — can the build launch and begin the required gameplay path?',
  'Feature Acceptance Test — does one feature satisfy its approved criteria?',
  'Integration Test — do connected gameplay systems work together?',
  'Regression Test — do previously passing behaviors still pass?',
  'Vertical-Slice Test — can the complete current loop be completed?',
  'Exploratory Playtest — what breaks when the player behaves unexpectedly?'
];

const browserPath = [
  'Launch',
  'Stamford Hospital Spawn',
  'Player Control',
  'Explore',
  'Meet Aria Pulse',
  'Accept Mission 001',
  'Travel',
  'Objective Interaction',
  'Data Fragment',
  'Return / Complete',
  'Result / Reward',
  'Save',
  'Reload / Continue'
];

const unrealPath = [
  'Launch Unreal Level',
  'Stamford Hospital PlayerStart',
  'Move / Sprint / Jump',
  'Camera',
  'Collision',
  'Interaction',
  'Reset / Recovery',
  'NPC + Mission Integration',
  'HUD',
  'Vehicle Possession',
  'Stamford Driving Proof',
  'Checkpoint / Save',
  'Vertical Slice QA'
];

const releaseGate = [
  'Build or commit identity is recorded.',
  'Required smoke and acceptance tests were executed.',
  'Expected and actual results are documented.',
  'No unresolved S0 blocker invalidates the test cycle.',
  'No unresolved S1 defect invalidates the public release claim.',
  'Applicable regression checks pass.',
  'Known issues and supporting evidence are recorded.',
  'QA issues an explicit verification decision.'
];

export const QAView: React.FC = () => {
  return (
    <div className="space-y-8 pb-12">
      <section className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-[#0b0e14]/95 p-6 md:p-9 shadow-2xl shadow-black/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.10),transparent_30%)] pointer-events-none" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-cyan-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              Onegodia Game Studio • The Test Chamber™
            </div>
            <h1 className="mt-5 text-3xl md:text-5xl font-black tracking-tight text-white">AI-QA-Test-Agent</h1>
            <p className="mt-3 max-w-3xl text-base md:text-lg leading-relaxed text-slate-300">
              Test plans, bug reproduction, regression checks, playtest verification feedback, and release-gate evidence for
              <span className="font-semibold text-white"> Onegodia: Rise of the Digital World™</span>.
            </p>
            <div className="mt-6 rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-4">
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-cyan-300">QA doctrine</p>
              <p className="mt-2 text-xl md:text-2xl font-black text-white">Implementation is not verification.</p>
              <p className="mt-2 text-sm text-slate-400">
                A screenshot, commit, Blueprint, generated file, issue, or agent response cannot promote a feature by itself. Verification requires a reproducible runtime test and recorded evidence.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#29303e] bg-[#0f131b]/90 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-slate-500">Verification relationship</p>
                <p className="mt-1 font-bold text-white">Independent from implementation</p>
              </div>
              <GitBranch className="h-7 w-7 text-cyan-300" />
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Implementing agents build the feature. QA challenges the claim, reproduces the intended behavior, records evidence, and recommends whether the work is ready for Verified or Playable status.
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

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#242a35] bg-[#0b0f16] p-5 md:p-7">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-black text-white">Verification decisions</h2>
          </div>
          <div className="mt-5 space-y-3">
            {decisions.map((item) => (
              <div key={item.name} className="rounded-xl border border-[#232a36] bg-[#10151e] p-4">
                <div className="flex items-center gap-3">
                  <CircleDot className="h-4 w-4 text-cyan-400" />
                  <p className="font-bold text-white">{item.name}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#242a35] bg-[#0b0f16] p-5 md:p-7">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <h2 className="text-xl font-black text-white">Defect severity</h2>
          </div>
          <p className="mt-2 text-sm text-slate-400">Severity measures player/build impact. Priority is a separate production scheduling decision.</p>
          <div className="mt-5 space-y-3">
            {severity.map((item) => (
              <div key={item.code} className="grid grid-cols-[48px_1fr] gap-3 rounded-xl border border-[#232a36] bg-[#10151e] p-4">
                <div className="flex h-9 items-center justify-center rounded border border-rose-500/30 bg-rose-500/10 font-mono text-xs font-black text-rose-300">{item.code}</div>
                <div>
                  <p className="font-bold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#242a35] bg-[#0b0f16] p-5 md:p-7">
        <div className="flex items-start gap-3">
          <Gamepad2 className="mt-0.5 h-5 w-5 text-cyan-400" />
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-cyan-300">QA test ladder</p>
            <h2 className="mt-1 text-xl font-black text-white">From smoke test to vertical-slice proof</h2>
          </div>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {testLevels.map((item, index) => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-[#232a36] bg-[#10151e] p-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-500/35 bg-cyan-500/10 font-mono text-[11px] font-black text-cyan-300">{index + 1}</div>
              <p className="text-sm leading-relaxed text-slate-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 md:p-7">
          <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-blue-300">Browser V1 verification path</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {browserPath.map((step, index) => (
              <span key={step} className="rounded-lg border border-blue-500/25 bg-[#0d1420] px-3 py-2 text-xs font-mono text-slate-300">
                {String(index + 1).padStart(2, '0')} · {step}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 md:p-7">
          <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-violet-300">Unreal V1 verification path</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {unrealPath.map((step, index) => (
              <span key={step} className="rounded-lg border border-violet-500/25 bg-[#141020] px-3 py-2 text-xs font-mono text-slate-300">
                {String(index + 1).padStart(2, '0')} · {step}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 md:p-7">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div className="w-full">
            <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-emerald-300">Release gate</p>
            <h2 className="mt-1 text-xl font-black text-white">Evidence before status promotion</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {releaseGate.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border border-emerald-500/15 bg-[#0e1716] p-4">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <p className="text-sm leading-relaxed text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-rose-500/25 bg-rose-950/10 p-5">
        <h2 className="font-mono text-sm font-bold text-rose-300">PUBLIC STATUS INTEGRITY</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          The public game node uses <strong>Planned</strong>, <strong>Building</strong>, <strong>Verified</strong>, and <strong>Playable</strong>. QA evidence supports promotion into Verified or Playable; this page does not itself claim that any untested feature has reached either status.
        </p>
      </section>
    </div>
  );
};
