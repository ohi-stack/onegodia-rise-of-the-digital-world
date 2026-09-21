import React, { useState } from 'react';
import { 
  Gamepad2, 
  Car, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Compass
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
    <div className="space-y-6 py-3 font-sans">
      
      {/* Modern Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 dark:bg-[#0b0e17]/80 border border-slate-800/80 backdrop-blur-xl shadow-xl shadow-blue-950/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
              Sector 7 District Interactive Simulation
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Onegodia Metropolis — Sector 7 Outpost
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 dark:text-slate-400 mt-1">
            Traverse the transit highway, speak with Aria Pulse, purify Corrupted Node #001, and claim 250 CR.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center gap-2">
          <button
            id="subtab-canvas-btn"
            onClick={() => {
              sound.playClick();
              setActiveSubTab('canvas');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'canvas'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60'
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
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'objectives'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60'
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
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'vehicle'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700/60'
            }`}
          >
            Vehicle Specs
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
        <div className="p-6 bg-slate-900/60 dark:bg-[#0c0e16]/80 border border-slate-800/80 rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Mission Progression</span>
              <h2 className="text-xl font-bold text-white">Mission 001: Signal Recovery Steps</h2>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              mission.status === 'Complete'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {mission.status}
            </span>
          </div>

          <div className="space-y-3">
            {mission.objectives.map((obj, idx) => (
              <div 
                key={obj.id}
                className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                  obj.isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                    : idx === mission.currentObjectiveIndex
                    ? 'bg-blue-950/30 border-blue-500/50 text-blue-200 shadow-md'
                    : 'bg-slate-800/40 border-slate-800 text-slate-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  obj.isCompleted
                    ? 'bg-emerald-500 text-slate-950'
                    : idx === mission.currentObjectiveIndex
                    ? 'bg-blue-400 text-slate-950'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {obj.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : obj.stepNumber}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm text-slate-100">{obj.description}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Target Zone: <strong className="text-blue-300 font-semibold">{obj.targetZone}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => {
                sound.playClick();
                setActiveSubTab('canvas');
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Resume Game Canvas</span>
            </button>
          </div>
        </div>
      )}

      {activeSubTab === 'vehicle' && (
        <div className="p-6 bg-slate-900/60 dark:bg-[#0c0e16]/80 border border-slate-800/80 rounded-3xl space-y-6 text-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Vehicle Engineering</span>
            <h2 className="text-xl font-bold text-white">Cyber-Cruiser Ground Traversal Specs</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <div className="text-slate-400 text-xs">Drive Architecture</div>
              <div className="text-sm font-bold text-blue-300">Dual-Photonic Sub-Drive</div>
              <div className="text-xs text-slate-500">Zero-emission magnetic surface traction</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <div className="text-slate-400 text-xs">Cruising Velocity</div>
              <div className="text-sm font-bold text-amber-300">95 km/h (Sector 7 Limit)</div>
              <div className="text-xs text-slate-500">Speedometer integrated into HUD</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5">
              <div className="text-slate-400 text-xs">Engine Actor Component</div>
              <div className="text-sm font-bold text-cyan-300">BP_CyberCruiser</div>
              <div className="text-xs text-slate-500">Chaos Vehicle Movement Rig</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3 text-slate-300 leading-relaxed">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">How to Pilot:</h4>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300">
              <li>Walk near the vehicle parked at the Vehicle Bay near the Hub.</li>
              <li>Press <strong className="text-blue-400">[F]</strong> on keyboard or tap <strong className="text-blue-400">Mount Car</strong> on the virtual controls.</li>
              <li>Use <strong className="text-blue-400">W / Up</strong> to accelerate, <strong className="text-blue-400">S / Down</strong> to brake and reverse, and <strong className="text-blue-400">A / D</strong> to steer.</li>
              <li>Press <strong className="text-blue-400">[F]</strong> again at any time to dismount on foot.</li>
            </ol>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                sound.playClick();
                setActiveSubTab('canvas');
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all"
            >
              <Car className="w-4 h-4" />
              <span>Drive in Canvas</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
