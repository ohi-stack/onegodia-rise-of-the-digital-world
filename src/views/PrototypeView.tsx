import React, { useState } from 'react';
import { 
  Gamepad2, 
  Car, 
  Sparkles, 
  Radio, 
  RotateCcw, 
  Map, 
  Info, 
  Bot, 
  CheckCircle2, 
  Flag,
  ShieldCheck
} from 'lucide-react';
import { Mission, PlayerProgress, NavigationTab } from '../types';
import { PlayableCanvasGame } from '../components/game/PlayableCanvasGame';
import { sound } from '../services/audioService';

interface PrototypeViewProps {
  mission: Mission;
  setMission: React.Dispatch<React.SetStateAction<Mission>>;
  progress: PlayerProgress;
  setProgress: React.Dispatch<React.SetStateAction<PlayerProgress>>;
  setActiveTab: (tab: NavigationTab) => void;
}

export const PrototypeView: React.FC<PrototypeViewProps> = ({
  mission,
  setMission,
  progress,
  setProgress,
  setActiveTab
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'canvas' | 'objectives' | 'vehicle' | 'npcs'>('canvas');

  return (
    <div className="space-y-4 py-2 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">
              PLAYABLE PROTOTYPE V1.0 (SECTOR 7 DISTRICT)
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Onegodia Cyber Metropolis — Sector 7 Outpost
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Spawn at Hub ➔ Walk/Drive along Transit Highway ➔ Purify Corrupted Node #001 ➔ Claim 250 CR & Data Fragment #001
          </p>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            id="subtab-canvas-btn"
            onClick={() => {
              sound.playClick();
              setActiveSubTab('canvas');
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeSubTab === 'canvas'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'bg-[#11131a] text-slate-300 hover:bg-[#161821] border border-[#1e2230]'
            }`}
          >
            Playable Canvas
          </button>
          <button
            id="subtab-objectives-btn"
            onClick={() => {
              sound.playClick();
              setActiveSubTab('objectives');
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeSubTab === 'objectives'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'bg-[#11131a] text-slate-300 hover:bg-[#161821] border border-[#1e2230]'
            }`}
          >
            Mission 001 Guide
          </button>
          <button
            id="subtab-vehicle-btn"
            onClick={() => {
              sound.playClick();
              setActiveSubTab('vehicle');
            }}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
              activeSubTab === 'vehicle'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'bg-[#11131a] text-slate-300 hover:bg-[#161821] border border-[#1e2230]'
            }`}
          >
            Vehicle Spec
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'canvas' && (
        <PlayableCanvasGame
          mission={mission}
          setMission={setMission}
          progress={progress}
          setProgress={setProgress}
          setActiveTab={setActiveTab}
        />
      )}

      {activeSubTab === 'objectives' && (
        <div className="p-5 bg-[#0c0e14] border border-[#1e2230] rounded-xl space-y-5 font-mono">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] text-blue-400 font-bold uppercase">MISSION 001: REBUILDING SIGNAL</span>
              <h2 className="text-base font-bold text-slate-100 font-sans">Step-by-Step Objective Progression</h2>
            </div>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
              mission.status === 'Complete'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                : 'bg-amber-950 text-amber-300 border-amber-500/50'
            }`}>
              {mission.status}
            </span>
          </div>

          <div className="space-y-2">
            {mission.objectives.map((obj, idx) => (
              <div 
                key={obj.id}
                className={`p-3.5 rounded-lg border flex items-start gap-3 transition-colors ${
                  obj.isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : idx === mission.currentObjectiveIndex
                    ? 'bg-blue-950/30 border-blue-500/50 text-blue-200 shadow-sm'
                    : 'bg-[#11131a] border-[#1e2230] text-slate-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  obj.isCompleted
                    ? 'bg-emerald-500 text-slate-950'
                    : idx === mission.currentObjectiveIndex
                    ? 'bg-blue-400 text-slate-950 animate-pulse'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {obj.isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : obj.stepNumber}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-xs text-slate-100 font-sans">{obj.description}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Target Zone: <strong className="text-blue-300">{obj.targetZone}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1e2230] flex justify-end">
            <button
              onClick={() => {
                sound.playClick();
                setActiveSubTab('canvas');
              }}
              className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Resume Game Canvas</span>
            </button>
          </div>
        </div>
      )}

      {activeSubTab === 'vehicle' && (
        <div className="p-5 bg-[#0c0e14] border border-[#1e2230] rounded-xl space-y-5 font-mono text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] text-blue-400 font-bold uppercase">PROTOTYPE GROUND TRAVERSAL</span>
            <h2 className="text-base font-bold text-slate-100 font-sans">Cyber-Cruiser V1 Specifications</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1">
              <div className="text-slate-400 text-[11px]">Powertrain</div>
              <div className="text-xs font-bold text-blue-300 font-sans">Dual-Photonic Sub-Drive</div>
              <div className="text-[10px] text-slate-500">Zero-emission magnetic traction</div>
            </div>
            <div className="p-3.5 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1">
              <div className="text-slate-400 text-[11px]">Top Speed (Prototype)</div>
              <div className="text-xs font-bold text-amber-300 font-sans">95 km/h (Sector 7 Limit)</div>
              <div className="text-[10px] text-slate-500">Speedometer active on HUD</div>
            </div>
            <div className="p-3.5 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1">
              <div className="text-slate-400 text-[11px]">UE5 Target Actor</div>
              <div className="text-xs font-bold text-cyan-300 font-sans">BP_CyberCruiser</div>
              <div className="text-[10px] text-slate-500">Chaos Vehicle Movement Component</div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-2 text-slate-300 leading-relaxed font-sans text-xs">
            <h4 className="font-bold text-slate-200 font-mono text-[11px]">How to Pilot in Prototype:</h4>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Walk towards the vehicle parked at the Vehicle Bay near the Hub.</li>
              <li>Press <strong className="text-blue-400">[F]</strong> on keyboard or tap <strong className="text-blue-400">Mount Car</strong> on the mobile controller.</li>
              <li>Use <strong className="text-blue-400">W / Up</strong> to accelerate, <strong className="text-blue-400">S / Down</strong> to brake and reverse, and <strong className="text-blue-400">A / D</strong> to steer.</li>
              <li>Press <strong className="text-blue-400">[F]</strong> again at any time to dismount on foot.</li>
            </ol>
          </div>

          <div className="pt-2 flex justify-end font-mono">
            <button
              onClick={() => {
                sound.playClick();
                setActiveSubTab('canvas');
              }}
              className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Drive in Canvas</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
