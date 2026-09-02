import React from 'react';
import { 
  Gamepad2, 
  Layers, 
  Map as MapIcon,
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
      <section className="relative rounded-2xl bg-[#090b10] border border-[#1e2230] p-5 sm:p-8 lg:p-12 overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.1)]">
        {/* Background glow lines & Grid */}
        <div className="absolute inset-0 gamer-grid opacity-30"></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[rgba(0,255,255,0.15)] blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-[rgba(255,0,255,0.1)] blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl space-y-6">
          
          {/* Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-black/80 border border-cyan-500/80 text-cyan-400 font-mono text-[12px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(0,255,255,0.5)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_5px_#0ff]"></span>
              MVP v1.0 — Playable Prototype
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-black/80 border border-purple-500/80 text-purple-400 font-mono text-[12px] font-bold uppercase shadow-[0_0_10px_rgba(255,0,255,0.3)]">
              <Cpu className="w-3.5 h-3.5" />
              Node: game.onegodian.com
            </span>
          </div>

          {/* Main Title & Subheadline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-none uppercase">
              <span className="glitch text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 block pb-2" data-text="ONEGODIA">
                ONEGODIA
              </span>
              <span className="text-2xl sm:text-4xl text-slate-300 tracking-tight block mt-2" style={{ textShadow: '0 0 20px rgba(0,255,255,0.3)' }}>
                Rise of the Digital World<span className="text-cyan-400 align-super text-lg">™</span>
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-mono max-w-2xl border-l-2 border-cyan-500 pl-4 bg-black/30 p-2 rounded-r">
              A digital-world open-world game concept where real cities, futuristic systems, player movement, tactical maps, missions, vehicles, digital assets, and community-driven gameplay come together through a staged MVP roadmap.
            </p>
          </div>

          {/* Founder Credit */}
          <div className="pt-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-black border-2 border-cyan-400 flex items-center justify-center font-black text-cyan-400 text-lg shadow-[0_0_15px_rgba(0,255,255,0.6)]">
              Ω
            </div>
            <div>
              <div className="text-[10px] text-cyan-500 font-mono uppercase tracking-widest font-bold">Concept & Creative Architecture by</div>
              <div className="text-sm font-black text-white tracking-widest uppercase" style={{ animation: 'neon-glow 2s infinite alternate' }}>
                One Gregory Onegodian™
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-wrap gap-3 font-mono text-sm">
            <button
              id="hero-play-v1-btn"
              onClick={() => handleNav('prototype')}
              className="px-6 py-3 rounded-sm bg-cyan-500 text-black font-black uppercase tracking-wider flex items-center gap-2 transition-all transform hover:scale-105 hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.6)] active:scale-95"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Launch V1 Prototype</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              id="hero-world-map-btn"
              onClick={() => handleNav('map')}
              className="px-5 py-3 rounded-sm bg-black border-2 border-purple-500 text-purple-400 font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:bg-purple-950 shadow-[0_0_15px_rgba(255,0,255,0.3)] hover:shadow-[0_0_25px_rgba(255,0,255,0.6)] active:scale-95"
            >
              <MapIcon className="w-4 h-4" />
              <span>Sector 7 Map</span>
            </button>

            <button
              id="hero-view-grid-btn"
              onClick={() => handleNav('gameplay-grid')}
              className="px-4 py-3 rounded-sm bg-black border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]"
            >
              <Layers className="w-4 h-4" />
              <span>Gameplay Grid</span>
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
