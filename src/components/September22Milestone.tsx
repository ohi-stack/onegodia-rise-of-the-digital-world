import React from 'react';
import { ArrowRight, CalendarDays, Gamepad2, Radar, Sparkles } from 'lucide-react';

type September22MilestoneProps = {
  variant?: 'home' | 'status';
  onPlay?: () => void;
  onStatus?: () => void;
};

const demonstratedSystems = [
  '3D world traversal',
  'WASD movement',
  'Sprint + jump',
  'Interaction controls',
  'Mission objective HUD',
  'Radar / minimap',
  'Stamford Hospital context',
  'Mission 001 gameplay'
];

export const September22Milestone: React.FC<September22MilestoneProps> = ({
  variant = 'home',
  onPlay,
  onStatus
}) => {
  const isStatus = variant === 'status';

  return (
    <section
      aria-labelledby={`september-22-milestone-${variant}`}
      className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-[#07111d]/95 shadow-2xl shadow-cyan-950/20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(6,182,212,0.16),transparent_35%),radial-gradient(circle_at_85%_70%,rgba(37,99,235,0.16),transparent_40%)] pointer-events-none" />

      <div className="relative p-5 sm:p-7 lg:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-950/40 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-200">
            <Gamepad2 className="h-3.5 w-3.5" /> Browser V1 Milestone
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-950/30 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-blue-200">
            <CalendarDays className="h-3.5 w-3.5" /> September 22, 2026
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-start">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              <Sparkles className="h-4 w-4" /> Development Milestone
            </div>
            <h2
              id={`september-22-milestone-${variant}`}
              className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-white"
            >
              From 2D Prototype to a Playable 3D World
            </h2>
            <p className="mt-4 max-w-3xl text-sm sm:text-base leading-7 text-slate-300">
              On September 22, 2026, <strong className="text-white">Onegodia: Rise of the Digital World™</strong> reached a major Browser V1 milestone: the playable prototype advanced from an interface-driven and 2D presentation into a 3D world that could be entered, controlled, explored, and played.
            </p>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              The milestone records the browser prototype's development history. It does not change or promote any separate Unreal Engine pipeline status.
            </p>

            {!isStatus && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {onPlay && (
                  <button
                    type="button"
                    onClick={onPlay}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300 bg-cyan-500 px-5 py-3 text-sm font-black uppercase tracking-wide text-[#04101a] transition hover:bg-cyan-300"
                  >
                    <Gamepad2 className="h-4 w-4" /> Play the 3D Prototype
                  </button>
                )}
                {onStatus && (
                  <button
                    type="button"
                    onClick={onStatus}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-950/70 px-5 py-3 text-sm font-bold text-slate-100 transition hover:border-cyan-400/60 hover:text-cyan-200"
                  >
                    View Development Status <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-800 bg-black/25 p-4 sm:p-5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              <Radar className="h-4 w-4 text-cyan-300" /> Demonstrated in the milestone build
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {demonstratedSystems.map((system) => (
                <div
                  key={system}
                  className="rounded-lg border border-slate-800 bg-slate-950/55 px-3 py-2 text-xs text-slate-300"
                >
                  {system}
                </div>
              ))}
            </div>
          </div>
        </div>

        {isStatus && (
          <div className="mt-6 rounded-xl border border-blue-500/25 bg-blue-950/15 p-4">
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-300">Development progression</div>
            <p className="mt-2 text-sm font-semibold text-slate-200">
              Concept → Interface Prototype → 2D Gameplay → 3D Playable World
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
