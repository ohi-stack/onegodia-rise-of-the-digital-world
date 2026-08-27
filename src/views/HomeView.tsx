import React from 'react';
import { 
  Gamepad2, 
  Layers, 
  FileText, 
  Terminal, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Radio, 
  Compass, 
  Car, 
  Bot, 
  Coins, 
  CheckCircle2 
} from 'lucide-react';
import { NavigationTab, PlayerProgress, Mission } from '../types';
import { sound } from '../services/audioService';

interface HomeViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  progress: PlayerProgress;
  mission: Mission;
}

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab, progress, mission }) => {
  const handleNav = (tab: NavigationTab) => {
    sound.playClick();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const coreLoopSteps = [
    { num: 1, label: 'Spawn', desc: 'Initialize at Onegodia Hub Plaza' },
    { num: 2, label: 'Move', desc: 'Walk, Sprint, Jump Matrix' },
    { num: 3, label: 'Explore', desc: 'Navigate Sector 7 city grid' },
    { num: 4, label: 'Interact', desc: 'Speak with Aria Pulse (NPC)' },
    { num: 5, label: 'Accept Mission', desc: 'Receive Mission 001: Rebuilding Signal' },
    { num: 6, label: 'Travel', desc: 'Drive Cyber-Cruiser to Outpost' },
    { num: 7, label: 'Complete Objective', desc: 'Scan & purify Corrupted Node #001' },
    { num: 8, label: 'Receive Reward', desc: '+250 Credits & Data Fragment #001' },
    { num: 9, label: 'Save Progress', desc: 'Store state in digital locker' },
  ];

  return (
    <div className="space-y-8 py-2 font-sans">
      
      {/* Hero Section */}
      <section className="relative rounded-2xl bg-gradient-to-b from-[#0e111a] via-[#090b10] to-[#050608] border border-[#1e2230] p-5 sm:p-8 lg:p-10 overflow-hidden shadow-2xl">
        {/* Background glow lines */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-5">
          
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-950/80 border border-blue-500/40 text-blue-300 font-mono text-[11px] font-semibold shadow-sm shadow-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              MVP v1.0 — Interface + Gameplay Planning Prototype
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#11131a] border border-[#1e2230] text-slate-300 font-mono text-[11px]">
              <Cpu className="w-3 h-3 text-blue-400" />
              Node: game.onegodian.com
            </span>
          </div>

          {/* Main Title & Subheadline */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Onegodia<span className="text-blue-400">:</span> Rise of the Digital World<span className="text-lg sm:text-xl text-blue-400 align-super">™</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-3xl">
              A digital-world open-world game concept where real cities, futuristic systems, player movement, tactical maps, missions, vehicles, digital assets, and community-driven gameplay come together through a staged MVP roadmap.
            </p>
          </div>

          {/* Founder Credit */}
          <div className="pt-0.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-blue-600/20 border border-blue-400/60 flex items-center justify-center font-mono font-bold text-blue-300 text-xs">
              Ω
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-mono">Concept & Creative Architecture by</div>
              <div className="text-xs font-bold text-blue-300 tracking-wide font-sans">
                One Gregory Onegodian™
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap gap-2.5 font-mono text-xs">
            <button
              id="hero-play-v1-btn"
              onClick={() => handleNav('prototype')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Preview MVP / Play V1</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              id="hero-view-grid-btn"
              onClick={() => handleNav('gameplay-grid')}
              className="px-3.5 py-2 rounded-lg bg-[#11131a] hover:bg-[#161821] border border-[#1e2230] hover:border-blue-500/50 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>View Gameplay Grid (18)</span>
            </button>

            <button
              id="hero-read-doc-btn"
              onClick={() => handleNav('web-doc')}
              className="px-3.5 py-2 rounded-lg bg-[#11131a] hover:bg-[#161821] border border-[#1e2230] hover:border-blue-500/50 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Read Web Doc (16 Specs)</span>
            </button>

            <button
              id="hero-join-dev-btn"
              onClick={() => handleNav('developers')}
              className="px-3.5 py-2 rounded-lg bg-[#11131a] hover:bg-[#161821] border border-[#1e2230] hover:border-blue-500/50 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Join Development</span>
            </button>
          </div>

        </div>
      </section>

      {/* The Proven V1 Playable Loop Visualizer */}
      <section className="space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] text-blue-400 uppercase tracking-wider font-semibold">
              Core Development Loop
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 font-sans">
              The Proven 9-Step Gameplay Loop (MVP v1.0)
            </h2>
          </div>
          <button
            onClick={() => handleNav('prototype')}
            className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Launch Interactive Loop</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {coreLoopSteps.map((step) => (
            <div 
              key={step.num}
              className="p-2.5 bg-[#0c0e14] border border-[#1e2230] rounded-lg space-y-1 hover:border-blue-700/60 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="w-4 h-4 rounded bg-blue-950 text-blue-300 border border-blue-800/60 flex items-center justify-center font-bold text-[9px]">
                  {step.num}
                </span>
              </div>
              <div className="font-bold text-slate-200 text-xs truncate">{step.label}</div>
              <div className="text-[10px] text-slate-400 line-clamp-2 leading-snug font-sans">{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured V1 Systems Matrix */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Playable Character & Sector 7 */}
        <div className="p-5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-3 hover:border-blue-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/40 flex items-center justify-center text-blue-300">
              <Compass className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm font-sans">Sector 7 & Player Movement</h3>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                Playable Now
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Full 2.5D top-down physics engine supporting Walk, Sprint (1.8x), Jump Matrix, fall-reset boundary protection, and directional camera orientation.
            </p>
          </div>
          <button
            onClick={() => handleNav('prototype')}
            className="w-full py-1.5 px-3 rounded bg-[#161821] hover:bg-blue-950/60 text-blue-300 border border-[#1e2230] font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Test Character Movement</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 2: Mission 001: Rebuilding Signal */}
        <div className="p-5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-3 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm font-sans">Mission 001: Rebuilding Signal</h3>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-500/40">
                Active Prototype
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Interact with Aria Pulse at Hub Plaza, follow transit waypoints to Sector 7 Outpost, scan and purify Corrupted Node #001, and extract Data Fragment #001.
            </p>
          </div>
          <button
            onClick={() => handleNav('missions')}
            className="w-full py-1.5 px-3 rounded bg-[#161821] hover:bg-cyan-950/60 text-cyan-300 border border-[#1e2230] font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Mission Briefing</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Card 3: Cyber-Cruiser Vehicle Prototype */}
        <div className="p-5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-3 hover:border-amber-500/40 transition-all flex flex-col justify-between">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Car className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-100 text-sm font-sans">Cyber-Cruiser Vehicle</h3>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/40">
                Playable Prototype
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Drivable ground vehicle in Sector 7 Vehicle Bay. Enter with [F], steer with WASD, accelerate up to 95 km/h, test braking, and cruise neon highways.
            </p>
          </div>
          <button
            onClick={() => handleNav('prototype')}
            className="w-full py-1.5 px-3 rounded bg-[#161821] hover:bg-amber-950/60 text-amber-300 border border-[#1e2230] font-mono text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Drive Cyber-Cruiser</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </section>

      {/* Staged Milestone Roadmap Summary */}
      <section className="p-5 sm:p-6 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-4">
        <div className="space-y-0.5">
          <div className="text-[11px] font-mono text-blue-400 uppercase tracking-wider font-semibold">
            Development Architecture
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-100 font-sans">
            From Web MVP v1.0 to Unreal Engine 5 Open World
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          <div className="p-3.5 rounded-lg bg-[#11131a] border border-emerald-500/30 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-emerald-400 font-bold">Phase 1 (Live)</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[9px]">Active</span>
            </div>
            <h4 className="font-bold text-slate-200 text-xs font-sans">MVP v1.0 Foundation</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
              Web Canvas 2.5D, Tactical HUD, Mission 001, dual controls, simulated inventory, game.onegodian.com node.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#11131a] border border-blue-500/30 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-blue-400 font-bold">Phase 2</span>
              <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 text-[9px]">In Dev</span>
            </div>
            <h4 className="font-bold text-slate-200 text-xs font-sans">Unreal Engine Core</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
              BP_PlayerCharacter, Nanite metropolis blockout, Lumen lighting, Chaos vehicle physics, smart NPCs.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400 font-bold">Phase 3</span>
              <span className="px-1.5 py-0.2 rounded bg-[#161821] text-slate-400 text-[9px]">Roadmap</span>
            </div>
            <h4 className="font-bold text-slate-200 text-xs font-sans">Flying Mounts & Oceans</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
              Aerial flight mechanics, ocean sailing, underwater realms, and dedicated server multiplayer instances.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#11131a] border border-amber-500/30 space-y-1.5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-amber-400 font-bold">Phase 4</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 text-[9px]">Compliance Locked</span>
            </div>
            <h4 className="font-bold text-slate-200 text-xs font-sans">Regulated Digital Assets</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed font-sans">
              Formal compliance structuring, Layer 2 blockchain infrastructure, and closed-loop player marketplace.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
