import React from 'react';
import { 
  Sparkles, 
  Flag, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Trophy, 
  Bot, 
  Lock, 
  Gamepad2,
  ShieldCheck 
} from 'lucide-react';
import { Mission, NavigationTab } from '../types';
import { sound } from '../services/audioService';

interface MissionsViewProps {
  mission: Mission;
  setActiveTab: (tab: NavigationTab) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({ mission, setActiveTab }) => {
  const futureMissions = [
    {
      id: 'MIS-002',
      title: 'Neon Circuit Overdrive',
      type: 'Vehicle Traversal / Checkpoint Trial',
      reward: '500 CR + Cyber-Cruiser Neon Wrap',
      status: 'Locked / Phase 2 Roadmap',
      desc: 'High-speed transit trial through the outer arterial corridors of Sector 7.'
    },
    {
      id: 'MIS-003',
      title: 'Sub-Aquatic Reconnaissance',
      type: 'Deep Sea Salvage',
      reward: '750 CR + Oceanic Dive Suit',
      status: 'Locked / Phase 3 Roadmap',
      desc: 'Investigate signal echo beneath the coastal trenches of the Onegodia Archipelago.'
    },
    {
      id: 'MIS-004',
      title: 'Skyline Beacon Array',
      type: 'Aerial Mount Navigation',
      reward: '1,000 CR + Flying Mount Harness',
      status: 'Locked / Phase 3 Roadmap',
      desc: 'Ascend to the spire peaks of the Metropolitan Core to link aerial communication relays.'
    }
  ];

  return (
    <div className="space-y-6 py-2 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">
              NARRATIVE PROGRESSION & DIRECTIVES
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Mission Operations Terminal
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Rebuild the city of Onegodia by restoring corrupted nodes and recovering lost digital fragments.
          </p>
        </div>

        <button
          id="missions-play-now-btn"
          onClick={() => {
            sound.playClick();
            setActiveTab('prototype');
          }}
          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono shadow-sm flex items-center gap-1.5 transition-all self-start md:self-auto"
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Execute in Game V1</span>
        </button>
      </div>

      {/* Featured Active Mission: Mission 001 */}
      <div className="p-5 rounded-xl bg-[#0c0e14] border border-[#1e2230] shadow-xl space-y-5 font-mono">
        
        {/* Title & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#1e2230]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-blue-400 font-bold uppercase">PRIMARY V1 DIRECTIVE</span>
              <span className="text-xs text-slate-400">[{mission.code}]</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white font-sans">{mission.title}</h2>
            <div className="text-xs text-slate-400 font-sans">Type: <span className="text-slate-300">{mission.type}</span></div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${
              mission.status === 'Complete'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                : mission.status === 'Active'
                ? 'bg-amber-950 text-amber-300 border-amber-500/50 animate-pulse'
                : 'bg-blue-950 text-blue-300 border-blue-500/50'
            }`}>
              Status: {mission.status}
            </span>
          </div>
        </div>

        {/* Description & Dialogue Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
          
          <div className="p-3.5 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1.5">
            <div className="font-mono text-blue-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
              <Flag className="w-3 h-3" />
              Mission Briefing
            </div>
            <p className="text-slate-300 leading-relaxed text-xs">
              {mission.description}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1.5">
            <div className="font-mono text-cyan-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
              <Bot className="w-3 h-3" />
              NPC Dispatch (Aria Pulse)
            </div>
            <p className="text-slate-300 italic text-xs leading-relaxed">
              “{mission.briefingDialogue}”
            </p>
          </div>

        </div>

        {/* Objectives Sequence List */}
        <div className="space-y-2.5">
          <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">
            Objective Milestones (6 Steps):
          </div>

          <div className="space-y-1.5">
            {mission.objectives.map((obj, idx) => (
              <div
                key={obj.id}
                className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                  obj.isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : idx === mission.currentObjectiveIndex
                    ? 'bg-blue-950/30 border-blue-500/60 text-blue-100 font-bold'
                    : 'bg-[#11131a] border-[#1e2230] text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                    obj.isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : idx === mission.currentObjectiveIndex
                      ? 'bg-blue-500 text-white animate-pulse'
                      : 'bg-[#1e2230] text-slate-400'
                  }`}>
                    {obj.isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : obj.stepNumber}
                  </div>
                  <span className="font-sans text-xs">{obj.description}</span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:inline font-mono">
                  {obj.targetZone}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards Box */}
        <div className="p-3 rounded-lg bg-[#11131a] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-sans">
          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300 font-bold">Guaranteed Mission Completion Rewards:</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-amber-300 font-bold">+{mission.rewardCredits} Prototype Credits</span>
            <span className="text-slate-600">•</span>
            <span className="text-blue-300 font-bold">{mission.rewardItem} (Foundational)</span>
          </div>
        </div>

      </div>

      {/* Future Roadmap Missions */}
      <div className="space-y-3 font-mono">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Roadmap Directives (Phases 2 & 3):
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {futureMissions.map((fm) => (
            <div key={fm.id} className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold">{fm.id}</span>
                <span className="px-1.5 py-0.2 rounded bg-[#11131a] text-slate-400 border border-[#1e2230] text-[9px]">
                  {fm.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-200 text-xs font-sans">{fm.title}</h3>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">{fm.desc}</p>
              <div className="pt-2 border-t border-[#1e2230] text-[10px] text-amber-400/90 font-mono">
                Reward: {fm.reward}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
