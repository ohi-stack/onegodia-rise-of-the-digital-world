import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { sound } from '../../services/audioService';
import { NavigationTab } from '../../types';

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditsEarned: number;
  itemName: string;
  itemRarity: string;
  setActiveTab: (tab: NavigationTab) => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  isOpen,
  onClose,
  creditsEarned,
  itemName,
  itemRarity,
  setActiveTab
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playMissionComplete();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#14b8a6', '#f59e0b', '#3b82f6']
        });
      } catch {
        // confetti fallback
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoToInventory = () => {
    sound.playClick();
    onClose();
    setActiveTab('inventory');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        id="mission-reward-modal"
        className="relative w-full max-w-lg bg-[#0c0e14] border border-emerald-500/60 rounded-xl shadow-2xl overflow-hidden font-sans text-center"
      >
        {/* Top Banner Graphic */}
        <div className="bg-[#050608] px-5 py-4 border-b border-[#1e2230] flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mb-2 shadow-sm">
            <Trophy className="w-6 h-6 text-emerald-300" />
          </div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950 px-2 py-0.2 rounded border border-emerald-700/60 mb-1">
            OBJECTIVE COMPLETE
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Mission 001: Rebuilding Signal
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Sector 7 Digital Node Restored & Synchronized
          </p>
        </div>

        {/* Rewards Breakdown */}
        <div className="p-4 space-y-3 font-mono">
          <div className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
            Simulated Rewards Granted:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
            
            {/* Reward 1: Credits */}
            <div className="p-3 rounded-lg bg-[#050608] border border-amber-500/40 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 text-sm font-bold">
                ◈
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">Prototype Currency</div>
                <div className="text-sm font-bold text-amber-300">+{creditsEarned} Credits</div>
                <div className="text-[9px] text-amber-400/80">In-game Simulated</div>
              </div>
            </div>

            {/* Reward 2: Collectible Fragment */}
            <div className="p-3 rounded-lg bg-[#050608] border border-[#1e2230] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/50 flex items-center justify-center text-blue-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[9px] text-blue-400 uppercase font-semibold">{itemRarity} Rarity</div>
                <div className="text-xs font-bold text-slate-100 leading-snug">{itemName}</div>
                <div className="text-[9px] text-blue-400/80">Added to Archive</div>
              </div>
            </div>

          </div>

          {/* Lore Debrief */}
          <div className="p-2.5 bg-[#050608] rounded-lg border border-[#1e2230] text-[11px] text-slate-400 text-left leading-relaxed font-sans">
            <span className="text-blue-400 font-semibold">Aria Pulse Log:</span> “The signal corruption is cleared. Your prototype telemetry data has been written to your local profile cache.”
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1 font-mono">
            <button
              id="continue-exploring-btn"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex-1 py-1.5 px-3 rounded-lg bg-[#11131a] hover:bg-[#161821] text-slate-200 text-xs font-bold border border-[#1e2230] transition-colors"
            >
              Continue Exploring Sector 7
            </button>

            <button
              id="view-inventory-btn"
              onClick={handleGoToInventory}
              className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <span>View in Digital Locker</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Compliance Badge */}
        <div className="bg-[#050608] px-4 py-2 border-t border-[#1e2230] text-[10px] font-mono text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Non-financial simulated rewards. No real cryptocurrency or trading enabled.</span>
        </div>
      </div>
    </div>
  );
};
