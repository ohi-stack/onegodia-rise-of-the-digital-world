import React from 'react';
import { Bot, Sparkles, CheckCircle2, ArrowRight, X, ShieldAlert } from 'lucide-react';
import { Mission } from '../../types';
import { sound } from '../../services/audioService';

interface NPCDialogueModalProps {
  isOpen: boolean;
  onClose: () => void;
  mission: Mission;
  onAcceptMission: () => void;
  onCompleteMission: () => void;
  npcName?: string;
  npcRole?: string;
  hasFragment: boolean;
}

export const NPCDialogueModal: React.FC<NPCDialogueModalProps> = ({
  isOpen,
  onClose,
  mission,
  onAcceptMission,
  onCompleteMission,
  npcName = 'Aria Pulse',
  npcRole = 'Onegodia Hub Mission Guide & Signal Architect',
  hasFragment
}) => {
  if (!isOpen) return null;

  const isMissionAvailable = mission.status === 'Available';
  const isMissionActive = mission.status === 'Active';
  const isMissionComplete = mission.status === 'Complete';
  const canTurnIn = isMissionActive && hasFragment;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        id="npc-dialogue-modal"
        className="relative w-full max-w-xl bg-[#0c0e14] border border-[#1e2230] rounded-xl shadow-2xl overflow-hidden font-sans"
      >
        {/* Top Header Bar */}
        <div className="bg-[#050608] px-4 py-3 border-b border-[#1e2230] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#11131a] border border-[#1e2230] flex items-center justify-center text-blue-400">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{npcName}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#11131a] border border-[#1e2230] text-blue-300">
                  SMART NPC (V1 PROTO)
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">{npcRole}</p>
            </div>
          </div>
          <button
            id="close-dialogue-btn"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#11131a] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* NPC Hologram & Dialogue Area */}
        <div className="p-4 space-y-3.5">
          <div className="flex gap-3 items-start">
            {/* NPC Visual Portrait */}
            <div className="relative shrink-0 w-14 h-14 rounded-lg bg-[#050608] border border-[#1e2230] flex items-center justify-center overflow-hidden">
              <span className="font-mono text-xl text-blue-400 font-bold">AP</span>
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-500"></div>
            </div>

            {/* Speech Bubble */}
            <div className="flex-1 bg-[#11131a] p-3 rounded-lg border border-[#1e2230] font-mono text-xs text-slate-200 leading-relaxed space-y-1.5">
              <div className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                Transmitting Signal:
              </div>
              <p className="italic text-slate-200 text-xs">
                {isMissionComplete
                  ? mission.completionDialogue
                  : isMissionActive && hasFragment
                  ? "“Incredible! You have safely recovered Data Fragment #001. Hand it over to synchronize our Hub's core transmitter!”"
                  : isMissionActive
                  ? "“The signal disturbance is at Sector 7 Outpost [X: 740, Y: 180]. You can travel there on foot or test the Cyber-Cruiser in the garage!”"
                  : mission.briefingDialogue}
              </p>
            </div>
          </div>

          {/* Mission Briefing Details Card */}
          <div className="p-3 rounded-lg bg-[#050608] border border-[#1e2230] space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3 h-3" />
                {mission.title} ({mission.code})
              </span>
              <span className={`px-2 py-0.2 rounded text-[9px] font-semibold border ${
                isMissionComplete
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                  : isMissionActive
                  ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                  : 'bg-blue-950 text-blue-300 border-blue-500/50'
              }`}>
                Status: {mission.status}
              </span>
            </div>

            <p className="text-slate-400 text-xs font-sans leading-relaxed">
              {mission.description}
            </p>

            {/* Rewards Summary */}
            <div className="pt-2 border-t border-[#1e2230] flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Simulated Mission Reward:</span>
              <div className="flex items-center gap-2.5 font-bold">
                <span className="text-amber-400">+{mission.rewardCredits} CR</span>
                <span className="text-blue-300">{mission.rewardItem}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-1">
            <button
              id="dialogue-cancel-btn"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="w-full sm:w-auto px-3 py-1 rounded bg-[#11131a] hover:bg-[#161821] text-slate-300 text-xs font-mono border border-[#1e2230] transition-colors"
            >
              Close Comm
            </button>

            {isMissionAvailable && (
              <button
                id="accept-mission-btn"
                onClick={() => {
                  sound.playClick();
                  onAcceptMission();
                }}
                className="w-full sm:w-auto px-3.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Accept Mission 001</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            {canTurnIn && (
              <button
                id="turn-in-mission-btn"
                onClick={() => {
                  onCompleteMission();
                }}
                className="w-full sm:w-auto px-3.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Deliver Fragment & Claim Reward</span>
              </button>
            )}

            {isMissionComplete && (
              <div className="text-emerald-400 font-mono text-xs flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/40 rounded">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mission 001 Completed & Archived</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Notice */}
        <div className="bg-[#050608] px-4 py-2 border-t border-[#1e2230] text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <ShieldAlert className="w-3 h-3 text-amber-400 shrink-0" />
          <span>Simulated non-financial quest loop. Unlocks local off-chain game assets.</span>
        </div>
      </div>
    </div>
  );
};
