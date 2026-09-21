import React from 'react';
import {
  BookOpen,
  Box,
  CheckCircle2,
  Circle,
  Gamepad2,
  Gauge,
  MapPin,
  Navigation,
  Play,
  Route,
  Smartphone,
  Users,
  XCircle,
} from 'lucide-react';
import { NavigationTab } from '../types';
import { sound } from '../services/audioService';

interface MVPV1ViewProps {
  setActiveTab: (tab: NavigationTab) => void;
}

const includedSystems = [
  {
    title: 'Player Movement',
    description: 'Walk, sprint, explore and control the browser-game player.',
    icon: Gamepad2,
  },
  {
    title: 'Stamford Prototype',
    description: 'Begin at Stamford Hospital and follow the first Stamford route.',
    icon: MapPin,
  },
  {
    title: 'Tactical HUD',
    description: 'Position, map, objectives and navigation interfaces.',
    icon: Gauge,
  },
  {
    title: 'Mission System',
    description: 'Objective state, mission progression and completion logic.',
    icon: Route,
  },
  {
    title: 'Inventory System',
    description: 'Collect and manage prototype rewards and game items.',
    icon: Box,
  },
  {
    title: 'Mobile + Desktop',
    description: 'Keyboard controls and touch-friendly browser controls.',
    icon: Smartphone,
  },
];

const statusRows = [
  { label: 'Web game framework', status: 'Playable', tone: 'emerald' },
  { label: 'Player movement', status: 'Playable', tone: 'emerald' },
  { label: 'Stamford Hospital start', status: 'Playable', tone: 'emerald' },
  { label: 'Washington Blvd route', status: 'Prototype', tone: 'cyan' },
  { label: 'Stamford Station checkpoint', status: 'Prototype', tone: 'cyan' },
  { label: 'Mission 001', status: 'In Progress', tone: 'amber' },
  { label: 'Browser vehicle traversal', status: 'Prototype', tone: 'cyan' },
  { label: 'Unreal Stamford city build', status: 'In Development', tone: 'amber' },
];

const notIncluded = [
  'Full open-world multiplayer',
  'Live blockchain transactions',
  'Live NFT minting',
  'Live ODC economy',
  'Casino or gambling features',
  'Real-money player marketplace',
  'Finished Unreal Engine Stamford city',
  'Production combat systems',
  'Final release game client',
];

const roadmap = [
  { phase: 'MVP v1.0', label: 'Stamford', active: true },
  { phase: 'Phase 2', label: 'Waterbury' },
  { phase: 'Phase 3', label: 'Connecticut' },
  { phase: 'Phase 4', label: 'United States' },
  { phase: 'Phase 5', label: 'Global World' },
];

export const MVPV1View: React.FC<MVPV1ViewProps> = ({ setActiveTab }) => {
  const go = (tab: NavigationTab) => {
    sound.playClick();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-5 pb-10 font-sans">
      <section className="relative overflow-hidden rounded-2xl border border-cyan-500/25 bg-[#07101a] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage:
            'radial-gradient(circle at 72% 36%, rgba(14,165,233,.26), transparent 28%), radial-gradient(circle at 88% 12%, rgba(59,130,246,.18), transparent 22%), linear-gradient(120deg, rgba(2,6,23,.98), rgba(7,20,34,.9))',
        }} />
        <div className="absolute inset-x-0 bottom-0 h-36 opacity-30" style={{
          backgroundImage:
            'linear-gradient(90deg, transparent 2%, rgba(56,189,248,.35) 2%, rgba(56,189,248,.35) 2.4%, transparent 2.4%), linear-gradient(rgba(56,189,248,.11) 1px, transparent 1px)',
          backgroundSize: '64px 100%, 100% 24px',
        }} />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.28em] text-cyan-300">
              Play. Explore. Build. Belong.
            </div>
            <h1 className="mt-3 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
              MVP <span className="text-cyan-400">v1.0</span>
            </h1>
            <div className="mt-2 text-lg font-bold uppercase tracking-[0.12em] text-slate-200 sm:text-2xl">
              The first step into a bigger world
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Onegodia MVP v1.0 is the first playable browser prototype of <strong className="text-white">Onegodia: Rise of the Digital World™</strong>. Start in Stamford, test the core gameplay loop, and follow development toward the higher-fidelity Unreal Engine world.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => go('play')}
                className="inline-flex items-center gap-2 rounded-md border border-cyan-300 bg-cyan-500 px-5 py-3 text-sm font-black uppercase tracking-wide text-slate-950 shadow-[0_0_28px_rgba(34,211,238,.38)] transition hover:bg-cyan-300"
              >
                <Play className="h-5 w-5" /> Play Now
                <span className="text-[10px] font-semibold normal-case tracking-normal">Explore Stamford</span>
              </button>
              <button
                onClick={() => go('web-doc')}
                className="inline-flex items-center gap-2 rounded-md border border-cyan-500/45 bg-[#081522] px-5 py-3 text-sm font-bold text-slate-100 transition hover:border-cyan-300"
              >
                <BookOpen className="h-5 w-5 text-cyan-300" /> Read the Doc
              </button>
              <button
                onClick={() => go('community')}
                className="inline-flex items-center gap-2 rounded-md border border-blue-500/45 bg-[#081522] px-5 py-3 text-sm font-bold text-slate-100 transition hover:border-blue-300"
              >
                <Users className="h-5 w-5 text-blue-300" /> Join the Community
              </button>
            </div>
          </div>

          <div className="relative min-h-[290px] overflow-hidden rounded-xl border border-cyan-500/20 bg-[#09131f] shadow-[0_18px_70px_rgba(0,0,0,.35)]">
            <div className="absolute inset-0" style={{
              background:
                'linear-gradient(180deg, rgba(14,165,233,.05), rgba(2,6,23,.8)), radial-gradient(circle at 70% 20%, rgba(56,189,248,.35), transparent 24%), linear-gradient(135deg, #17263a 0%, #0c1521 55%, #07111c 100%)',
            }} />
            <div className="absolute bottom-0 left-0 right-0 h-[58%] opacity-90" style={{
              backgroundImage:
                'linear-gradient(78deg, transparent 42%, rgba(148,163,184,.34) 43%, rgba(148,163,184,.34) 52%, transparent 53%), linear-gradient(102deg, transparent 35%, rgba(30,41,59,.9) 36%, rgba(30,41,59,.9) 62%, transparent 63%)',
            }} />
            <div className="absolute left-[10%] top-[24%] h-[48%] w-[22%] rounded-sm border border-cyan-400/30 bg-slate-700/65 shadow-[0_0_40px_rgba(34,211,238,.08)]" />
            <div className="absolute left-[34%] top-[16%] h-[55%] w-[18%] rounded-sm bg-slate-600/55" />
            <div className="absolute left-[55%] top-[30%] h-[42%] w-[14%] rounded-sm bg-slate-700/55" />
            <div className="absolute left-[71%] top-[20%] h-[52%] w-[16%] rounded-sm bg-slate-600/50" />
            <div className="absolute left-5 top-5 rounded border border-cyan-400/30 bg-black/60 px-3 py-2 font-mono text-[10px] text-cyan-200">
              STAMFORD HOSPITAL — PLAYER ORIGIN
            </div>
            <div className="absolute bottom-5 right-5 text-right">
              <div className="text-xl font-black text-white">Your Story Starts Here</div>
              <div className="mt-1 flex items-center justify-end gap-1 text-[10px] uppercase tracking-widest text-cyan-300">
                <MapPin className="h-3 w-3" /> Stamford, Connecticut
              </div>
              <div className="mt-4 text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Real places · Real possibilities · A bigger future
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.45fr_.9fr]">
        <section className="rounded-xl border border-[#26364b] bg-[#07101a]/90 p-5">
          <h2 className="text-lg font-black uppercase tracking-wide text-white">What’s included in MVP v1.0</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {includedSystems.map(({ title, description, icon: Icon }) => (
              <div key={title} className="rounded-lg border border-[#26364b] bg-[#0b1724] p-4 transition hover:border-cyan-500/45">
                <Icon className="h-6 w-6 text-cyan-400" />
                <div className="mt-3 text-sm font-bold text-white">{title}</div>
                <div className="mt-1 text-xs leading-relaxed text-slate-400">{description}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#26364b] bg-[#07101a]/90 p-5">
          <h2 className="text-lg font-black uppercase tracking-wide text-white">MVP Gameplay Preview</h2>
          <button
            onClick={() => go('play')}
            className="group relative mt-4 block min-h-[235px] w-full overflow-hidden rounded-lg border border-cyan-500/25 bg-[#0b1724] text-left"
          >
            <div className="absolute inset-0" style={{
              background:
                'radial-gradient(circle at 76% 24%, rgba(14,165,233,.34), transparent 24%), linear-gradient(145deg, #16293d, #07111b 72%)',
            }} />
            <div className="absolute left-[7%] top-[30%] h-[43%] w-[18%] rounded bg-slate-600/60" />
            <div className="absolute left-[29%] top-[20%] h-[54%] w-[17%] rounded bg-slate-700/70" />
            <div className="absolute left-[52%] top-[35%] h-[38%] w-[15%] rounded bg-slate-600/55" />
            <div className="absolute left-[73%] top-[26%] h-[47%] w-[18%] rounded bg-slate-700/60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/60 bg-black/55 text-white transition group-hover:scale-105 group-hover:border-cyan-300">
                <Play className="ml-1 h-7 w-7" />
              </span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 text-[10px] uppercase tracking-[0.12em] text-slate-200">
              Stamford Hospital → Washington Blvd → Stamford Station → Harbor Point
            </div>
          </button>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-[#26364b] bg-[#07101a]/90 p-5">
          <h2 className="text-lg font-black uppercase tracking-wide text-white">MVP v1.0 Status</h2>
          <div className="mt-4 divide-y divide-slate-800/80">
            {statusRows.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4 py-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  {row.tone === 'emerald' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Circle className={`h-4 w-4 ${row.tone === 'amber' ? 'text-amber-400' : 'text-cyan-400'}`} />
                  )}
                  {row.label}
                </div>
                <span className={row.tone === 'emerald' ? 'text-emerald-300' : row.tone === 'amber' ? 'text-amber-300' : 'text-cyan-300'}>
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#26364b] bg-[#07101a]/90 p-5">
          <h2 className="text-lg font-black uppercase tracking-wide text-white">From Stamford to the World</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-cyan-500/20 bg-[#0b1724] p-4">
            <div className="relative h-44 overflow-hidden rounded-md bg-gradient-to-br from-cyan-950 via-slate-800 to-blue-950">
              <div className="absolute bottom-0 left-[8%] h-[65%] w-[14%] bg-slate-500/55" />
              <div className="absolute bottom-0 left-[26%] h-[82%] w-[16%] bg-slate-600/60" />
              <div className="absolute bottom-0 left-[48%] h-[58%] w-[12%] bg-slate-500/60" />
              <div className="absolute bottom-0 left-[64%] h-[75%] w-[15%] bg-slate-600/55" />
              <div className="absolute bottom-0 left-[83%] h-[51%] w-[10%] bg-slate-500/60" />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-cyan-950/70" />
            </div>
            <p className="mt-4 text-xs leading-relaxed text-slate-300">
              MVP v1.0 begins in Stamford, Connecticut. The browser game proves the route and gameplay foundation while the Unreal build develops the high-fidelity city. Future phases expand to Waterbury, Connecticut and beyond.
            </p>
            <button onClick={() => go('map')} className="mt-4 inline-flex items-center gap-2 rounded border border-cyan-500/40 px-3 py-2 text-xs font-bold text-cyan-300 hover:border-cyan-300">
              <Navigation className="h-4 w-4" /> View World Map
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-[#26364b] bg-[#07101a]/90 p-5">
          <h2 className="text-lg font-black uppercase tracking-wide text-white">MVP v1.0 Does Not Yet Include</h2>
          <div className="mt-4 space-y-2.5">
            {notIncluded.map((item) => (
              <div key={item} className="flex items-start gap-2 text-xs text-slate-300">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 border-t border-slate-800 pt-4 text-[10px] leading-relaxed text-slate-500">
            These systems remain development, roadmap or compliance-gated items. They are not represented as currently operational game functionality.
          </p>
        </section>
      </div>

      <section className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-[#050b13] px-5 py-9 sm:px-8">
        <div className="absolute inset-x-0 bottom-0 h-28 opacity-50" style={{
          background: 'radial-gradient(ellipse at 50% 110%, rgba(56,189,248,.48), rgba(2,6,23,.15) 55%, transparent 72%)',
        }} />
        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-black uppercase tracking-[0.14em] text-white">A Bigger World Is Coming</h2>
          <p className="mt-2 text-sm uppercase tracking-[0.18em] text-slate-400">Play the vision. Help build the future.</p>
          <div className="mx-auto mt-7 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-5">
            {roadmap.map((item) => (
              <div key={item.phase} className="relative">
                <div className={`mx-auto h-4 w-4 rounded-full border-2 ${item.active ? 'border-cyan-200 bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,.9)]' : 'border-slate-500 bg-[#07101a]'}`} />
                <div className={`mt-3 text-xs font-bold ${item.active ? 'text-white' : 'text-slate-400'}`}>{item.phase}</div>
                <div className={`mt-1 text-[10px] ${item.active ? 'text-cyan-300' : 'text-slate-500'}`}>{item.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-xs italic text-cyan-200/70">“More Than a Game. A Movement.”</div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-slate-500">— One Gregory Onegodian™</div>
        </div>
      </section>
    </div>
  );
};
