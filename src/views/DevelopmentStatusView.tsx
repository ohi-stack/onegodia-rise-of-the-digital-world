import React from 'react';
import { CheckCircle2, CircleDashed, Hammer, Gamepad2, ShieldCheck, GitBranch } from 'lucide-react';

type PipelineStatus = 'Planned' | 'Building' | 'Verified' | 'Playable';

type PipelineItem = {
  id: string;
  title: string;
  status: PipelineStatus;
  summary: string;
  verification: string;
};

const pipeline: PipelineItem[] = [
  {
    id: 'unreal-initialized',
    title: 'Unreal Initialized',
    status: 'Building',
    summary: 'Unreal Engine project foundation and repository-backed V1 setup.',
    verification: 'Promote only after the Unreal project opens, builds, and the initialization checklist is recorded.'
  },
  {
    id: 'stamford-gis',
    title: 'Stamford GIS',
    status: 'Building',
    summary: 'Verified geospatial foundation for Stamford roads, terrain, districts, and coordinate references.',
    verification: 'Requires source/licensing record, coordinate-system validation, reproducible import, and Unreal load proof.'
  },
  {
    id: 'stamford-hospital',
    title: 'Stamford Hospital',
    status: 'Building',
    summary: 'Canonical Stamford player-entry anchor and first environment district.',
    verification: 'Requires the hospital-area world anchor and PlayerStart to load and be tested in Unreal.'
  },
  {
    id: 'player-foundation',
    title: 'Player Foundation',
    status: 'Planned',
    summary: 'Spawn, third-person camera, walk, run, jump, rotation, interaction, and reset.',
    verification: 'Requires a tested Unreal build demonstrating the complete movement foundation.'
  },
  {
    id: 'roads-city',
    title: 'Roads / City',
    status: 'Planned',
    summary: 'Stamford road network, sidewalks, collision, procedural city fabric, streaming, and recognizable routes.',
    verification: 'Requires generated geometry loaded in Unreal with collision, streaming, and route validation.'
  },
  {
    id: 'driving',
    title: 'Driving',
    status: 'Planned',
    summary: 'First drivable vehicle and validated Stamford route from the hospital district toward Downtown.',
    verification: 'Requires enter, drive, steer, brake, exit, collision, reset, and route playtest evidence.'
  },
  {
    id: 'mission-001',
    title: 'Mission 001',
    status: 'Planned',
    summary: 'First complete objective loop connecting traversal, interaction, destination, completion, and reward.',
    verification: 'Requires start-to-finish completion in Unreal with repeatable reset/replay.'
  },
  {
    id: 'npcs',
    title: 'NPCs',
    status: 'Planned',
    summary: 'First scripted NPC interaction and mission-facing behavior.',
    verification: 'Requires in-world spawn, interaction, dialogue/behavior, and mission integration proof.'
  },
  {
    id: 'hud',
    title: 'HUD',
    status: 'Planned',
    summary: 'Minimal Unreal HUD for mission state, interaction prompts, navigation, and player feedback.',
    verification: 'Requires in-game rendering and successful integration with the active mission/player state.'
  },
  {
    id: 'vertical-slice',
    title: 'Vertical Slice',
    status: 'Planned',
    summary: 'Stamford Hospital spawn → travel → vehicle → recognizable city route → objective → mission completion.',
    verification: 'Requires a packaged or reproducible development build passing the vertical-slice acceptance test.'
  },
  {
    id: 'v1',
    title: 'V1',
    status: 'Planned',
    summary: 'The first verified, documented, repeatable playable release of Onegodia: Rise of the Digital World™.',
    verification: 'Requires Specified → Implemented → Built → Playable → Tested → Documented → Committed.'
  }
];

const statusMeta: Record<PipelineStatus, { icon: React.FC<{ className?: string }>; className: string; description: string }> = {
  Planned: {
    icon: CircleDashed,
    className: 'border-slate-700 bg-slate-900/60 text-slate-300',
    description: 'Approved direction, but not yet represented as implementation.'
  },
  Building: {
    icon: Hammer,
    className: 'border-amber-500/50 bg-amber-950/30 text-amber-300',
    description: 'Implementation work is underway. This does not mean the feature is verified.'
  },
  Verified: {
    icon: CheckCircle2,
    className: 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300',
    description: 'Evidence confirms the implementation works against its stated acceptance criteria.'
  },
  Playable: {
    icon: Gamepad2,
    className: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300',
    description: 'A player can use the feature in the designated Unreal build.'
  }
};

export const DevelopmentStatusView: React.FC = () => {
  return (
    <section className="space-y-8 pb-12">
      <div className="rounded-2xl border border-blue-500/25 bg-[#090c13]/90 p-6 sm:p-8 shadow-2xl shadow-blue-950/20">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-950/40 px-3 py-1 text-xs font-mono font-semibold text-blue-300">
            <GitBranch className="h-3.5 w-3.5" /> PUBLIC DEVELOPMENT PIPELINE
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 text-xs font-mono text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" /> EVIDENCE-DRIVEN STATUS
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">From Stamford data to a verified playable V1.</h1>
        <p className="mt-4 max-w-4xl text-sm sm:text-base leading-7 text-slate-300">
          This page reports the production pipeline for the Unreal Engine build. Website simulations, interface prototypes, planning documents, generated code, or agent reports do not automatically make an Unreal feature verified or playable.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(statusMeta) as PipelineStatus[]).map((status) => {
          const meta = statusMeta[status];
          const Icon = meta.icon;
          return (
            <div key={status} className={`rounded-xl border p-4 ${meta.className}`}>
              <div className="flex items-center gap-2 font-mono text-sm font-bold">
                <Icon className="h-4 w-4" /> {status}
              </div>
              <p className="mt-2 text-xs leading-5 opacity-80">{meta.description}</p>
            </div>
          );
        })}
      </div>

      <div className="relative">
        <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-blue-500/70 via-slate-700 to-slate-900 sm:left-7" />
        <div className="space-y-4">
          {pipeline.map((item, index) => {
            const meta = statusMeta[item.status];
            const Icon = meta.icon;
            return (
              <article key={item.id} className="relative ml-12 sm:ml-16 rounded-xl border border-[#252b38] bg-[#0b0e14]/95 p-5 hover:border-blue-500/35 transition-colors">
                <div className={`absolute -left-[2.65rem] sm:-left-[3.2rem] top-5 flex h-9 w-9 items-center justify-center rounded-full border ${meta.className}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">Stage {String(index + 1).padStart(2, '0')}</div>
                    <h2 className="mt-1 text-xl font-bold text-white">{item.title}</h2>
                  </div>
                  <span className={`self-start rounded-full border px-3 py-1 text-[11px] font-mono font-bold ${meta.className}`}>{item.status}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.summary}</p>
                <div className="mt-4 rounded-lg border border-slate-800 bg-black/20 p-3">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Promotion requirement</div>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{item.verification}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-rose-500/25 bg-rose-950/10 p-5">
        <h2 className="font-mono text-sm font-bold text-rose-300">STATUS INTEGRITY RULE</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          No pipeline item may be labeled <strong className="text-cyan-300">Verified</strong> without recorded acceptance evidence, and no Unreal feature may be labeled <strong className="text-emerald-300">Playable</strong> unless it has actually been exercised in the designated build. When evidence is unavailable, the correct public status is Planned or Building.
        </p>
      </div>
    </section>
  );
};
