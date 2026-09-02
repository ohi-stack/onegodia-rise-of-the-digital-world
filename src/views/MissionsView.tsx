import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flag, 
  CheckCircle2, 
  ArrowRight, 
  Trophy, 
  Bot, 
  Gamepad2,
  ShieldCheck,
  ListOrdered,
  BookOpen,
  Milestone,
  Coins,
  Cpu,
  Zap,
  Compass,
  Package,
  Shield,
  Gift,
  Pin,
  PinOff,
  ArrowUp,
  ArrowDown,
  Clock,
  Crosshair,
  History,
  CreditCard,
  Receipt,
  Calendar,
  Trash2,
  ExternalLink,
  Lock,
  RefreshCw,
  Flame,
  FileCheck2
} from 'lucide-react';
import { Mission, PlayerProgress, NavigationTab, MissionHistoryEntry } from '../types';
import { sound } from '../services/audioService';
import { MissionLog } from '../components/MissionLog';
import { StripeCheckoutModal } from '../components/StripeCheckoutModal';
import { getMissionHistory, saveMissionHistoryEntry, clearMissionHistory } from '../services/historyService';

interface MissionsViewProps {
  mission: Mission;
  setMission?: React.Dispatch<React.SetStateAction<Mission>>;
  progress?: PlayerProgress;
  setProgress?: React.Dispatch<React.SetStateAction<PlayerProgress>>;
  setActiveTab: (tab: NavigationTab) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({ mission, setMission, progress, setProgress, setActiveTab }) => {
  const [subTab, setSubTab] = useState<'briefing' | 'log' | 'history' | 'roadmap'>('briefing');
  const [historyEntries, setHistoryEntries] = useState<MissionHistoryEntry[]>([]);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState<boolean>(false);
  const [selectedStripePassId, setSelectedStripePassId] = useState<string>('priority_mission_pass');

  // Load history on mount and when switching tabs
  const refreshHistory = () => {
    const list = getMissionHistory();
    setHistoryEntries(list);
  };

  useEffect(() => {
    refreshHistory();
  }, [subTab, mission.status]);

  const formatDuration = (seconds?: number) => {
    if (!seconds && seconds !== 0) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Recent';
    const d = new Date(timestamp);
    return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • ${d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Manual simulate / test save entry if none exists
  const handleSimulateLogEntry = () => {
    sound.playClick();
    const entry = saveMissionHistoryEntry({
      ...mission,
      status: 'Complete',
      completedAt: Date.now(),
      durationSeconds: mission.durationSeconds || 138,
      objectives: mission.objectives.map(o => ({ ...o, isCompleted: true }))
    });
    refreshHistory();
  };

  const handleClearHistory = () => {
    sound.playClick();
    clearMissionHistory();
    setHistoryEntries([]);
  };

  // Reordering handler
  const handleMoveObjective = (index: number, direction: 'up' | 'down') => {
    if (!setMission) return;
    sound.playClick();
    const newObjectives = [...mission.objectives];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newObjectives.length) return;

    const temp = newObjectives[index];
    newObjectives[index] = newObjectives[targetIndex];
    newObjectives[targetIndex] = temp;

    setMission(prev => ({
      ...prev,
      objectives: newObjectives
    }));
  };

  // Toggle Pin objective to Tactical HUD
  const handleTogglePin = (objId: string) => {
    if (!setMission) return;
    sound.playClick();
    setMission(prev => {
      const isCurrentlyPinned = prev.objectives.find(o => o.id === objId)?.isPinnedToHUD;
      const updated = prev.objectives.map(obj => 
        obj.id === objId ? { ...obj, isPinnedToHUD: !isCurrentlyPinned } : obj
      );
      const pinnedIds = updated.filter(o => o.isPinnedToHUD).map(o => o.id);
      return {
        ...prev,
        objectives: updated,
        pinnedObjectiveIds: pinnedIds
      };
    });
  };

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

  const completedCount = mission.objectives.filter(o => o.isCompleted).length;
  const totalCount = mission.objectives.length;
  const percentCompleted = mission.status === 'Complete' 
    ? 100 
    : totalCount > 0 
    ? Math.round((completedCount / totalCount) * 100) 
    : 0;

  // Aggregate earned objective rewards
  const completedObjectives = mission.objectives.filter(o => o.isCompleted);
  const earnedRewards = completedObjectives.flatMap(obj => 
    (obj.rewards || []).map(r => ({
      ...r,
      sourceStep: obj.stepNumber,
      sourceDesc: obj.description
    }))
  );

  const totalEarnedCredits = earnedRewards
    .filter(r => r.type === 'credits' && r.amount)
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  const getRewardIconComponent = (iconName?: string, type?: string) => {
    switch (iconName || type) {
      case 'Coins':
      case 'credits':
        return Coins;
      case 'Sparkles':
      case 'fragment':
        return Sparkles;
      case 'Cpu':
        return Cpu;
      case 'Zap':
      case 'exp':
        return Zap;
      case 'Compass':
      case 'telemetry':
        return Compass;
      case 'Shield':
      case 'badge':
        return Shield;
      case 'Award':
      case 'Trophy':
        return Trophy;
      default:
        return Package;
    }
  };

  const getRarityBadgeStyle = (rarity?: string) => {
    switch (rarity) {
      case 'Foundational':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'Prototype':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50';
      case 'Rare':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/50';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-5 py-2 font-sans">
      
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

        <div className="flex items-center gap-2">
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
      </div>

      {/* Global Mission Objective Progress Bar Card */}
      <div 
        id="mission-overall-progress-card" 
        className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] shadow-xl space-y-3 font-mono"
      >
        {/* Progress Header & Percentage */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
              mission.status === 'Complete'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : mission.status === 'Active'
                ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                : 'bg-slate-800/40 border-slate-700 text-slate-400'
            }`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xs font-sans">
                  Current Directive Progress: {mission.title}
                </span>
                <span className="text-[10px] text-slate-400">[{mission.code}]</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {mission.status === 'Complete' ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    All 6 Objective Milestones Cleared (Signal 100% Calibrated)
                  </span>
                ) : mission.status === 'Active' ? (
                  <span>
                    Step {mission.currentObjectiveIndex + 1} of {totalCount} Active —{' '}
                    <strong className="text-blue-300">
                      {mission.objectives[mission.currentObjectiveIndex]?.description || 'In Progress'}
                    </strong>
                  </span>
                ) : (
                  <span>Status: Awaiting Activation at Hub Plaza (Aria Pulse)</span>
                )}
              </div>
            </div>
          </div>

          {/* Numerical Percentage Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="text-right">
              <div className={`text-base font-bold leading-tight ${
                percentCompleted === 100
                  ? 'text-emerald-400'
                  : percentCompleted > 0
                  ? 'text-blue-400'
                  : 'text-slate-400'
              }`}>
                {percentCompleted}%
              </div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">
                {completedCount}/{totalCount} Completed
              </div>
            </div>

            <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
              mission.status === 'Complete'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                : mission.status === 'Active'
                ? 'bg-blue-950 text-blue-300 border-blue-500/50 animate-pulse'
                : 'bg-[#11131a] text-slate-400 border-[#1e2230]'
            }`}>
              {mission.status === 'Complete' ? 'COMPLETE' : mission.status === 'Active' ? 'IN PROGRESS' : 'AVAILABLE'}
            </div>
          </div>
        </div>

        {/* Visual Progress Bar Track */}
        <div className="space-y-1.5">
          <div 
            id="mission-progress-bar-track"
            className="relative w-full h-3 bg-[#050608] rounded-full border border-[#1e2230] overflow-hidden p-0.5"
            role="progressbar"
            aria-valuenow={percentCompleted}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Mission completion progress"
          >
            {/* Animated Gradient Fill Bar */}
            <div
              id="mission-progress-bar-fill"
              className={`h-full rounded-full transition-all duration-700 ease-out relative ${
                percentCompleted === 100
                  ? 'bg-gradient-to-r from-teal-600 via-emerald-500 to-emerald-400 shadow-sm shadow-emerald-500/50'
                  : percentCompleted > 0
                  ? 'bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 shadow-sm shadow-blue-500/40'
                  : 'bg-slate-700/50'
              }`}
              style={{ width: `${Math.max(percentCompleted, percentCompleted > 0 ? 4 : 0)}%` }}
            >
              {/* Subtle light shimmer sweep */}
              {percentCompleted > 0 && percentCompleted < 100 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Segment Tick Marks & Step Pills */}
          <div className="grid grid-cols-6 gap-1 pt-1">
            {mission.objectives.map((obj, idx) => {
              const isDone = obj.isCompleted;
              const isCurrent = idx === mission.currentObjectiveIndex && mission.status !== 'Complete';
              return (
                <div
                  key={obj.id}
                  id={`progress-step-pill-${idx + 1}`}
                  className={`flex flex-col items-center p-1 rounded border text-[9px] transition-colors text-center ${
                    isDone
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : isCurrent
                      ? 'bg-blue-950/60 border-blue-500 text-blue-200 font-bold shadow-sm shadow-blue-950'
                      : 'bg-[#090b10] border-[#1e2230] text-slate-500'
                  }`}
                  title={`Step ${obj.stepNumber}: ${obj.description}`}
                >
                  <div className="flex items-center gap-1 font-mono">
                    {isDone ? (
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                    ) : (
                      <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-blue-400 animate-ping' : 'bg-slate-600'}`}></span>
                    )}
                    <span>Step {obj.stepNumber}</span>
                  </div>
                  <span className="hidden md:inline text-[8px] truncate max-w-full font-sans text-slate-400 mt-0.5">
                    {isDone ? 'Cleared' : isCurrent ? 'Active' : 'Pending'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Earned Objective Rewards Showcase (Displayed upon milestone / mission completion) */}
      {completedObjectives.length > 0 && (
        <div 
          id="earned-objective-rewards-section"
          className="p-4 sm:p-5 rounded-xl bg-[#0c0e14] border border-emerald-500/30 shadow-xl space-y-4 font-mono"
        >
          {/* Showcase Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#1e2230]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  EARNED OBJECTIVE REWARDS VAULT
                </span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  {completedCount} of {totalCount} Milestones Claimed
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans">
                Items, telemetry feeds, credentials, and credits unlocked directly through completed mission objectives.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="flex items-center gap-1.5 bg-[#11131a] px-2.5 py-1 rounded-lg border border-[#1e2230] text-xs">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">Total Bounty:</span>
                <strong className="text-amber-300 font-bold">+{totalEarnedCredits} CR</strong>
              </div>
              <button
                id="inspect-inventory-from-rewards-btn"
                onClick={() => {
                  sound.playClick();
                  setActiveTab('inventory');
                }}
                className="px-2.5 py-1 rounded-lg bg-[#11131a] hover:bg-[#161821] text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center gap-1 transition-colors"
              >
                <Package className="w-3 h-3" />
                <span>Digital Locker</span>
              </button>
            </div>
          </div>

          {/* Grid of Earned Items & Shards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {earnedRewards.map((reward, index) => {
              const IconComp = getRewardIconComponent(reward.icon, reward.type);
              return (
                <div
                  key={`${reward.name}-${index}`}
                  id={`earned-reward-card-${index}`}
                  className="p-3 rounded-lg bg-[#11131a] border border-[#1e2230] hover:border-emerald-500/40 transition-all flex flex-col justify-between gap-2 shadow-sm"
                >
                  <div className="space-y-1.5">
                    {/* Top Row: Icon + Rarity + Step */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-semibold">
                            Step {reward.sourceStep} Reward
                          </div>
                          <h4 className="text-xs font-bold text-slate-100 font-sans leading-tight">
                            {reward.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    {reward.description && (
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed pt-0.5">
                        {reward.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom Metadata Badges */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#1e2230]/70 text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.2 rounded border font-semibold ${getRarityBadgeStyle(reward.rarity)}`}>
                        {reward.rarity || 'Foundational'}
                      </span>
                      {reward.amount && reward.type === 'credits' && (
                        <span className="text-amber-400 font-bold">+{reward.amount} CR</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-emerald-400 font-semibold text-[10px]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mission Complete Celebratory Footer Notification */}
          {mission.status === 'Complete' && (
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-sans">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                <span>
                  <strong>All 6 Directive Objectives Completed!</strong> All earned rewards and data fragments are securely synced to your simulated wallet and inventory archive.
                </span>
              </div>
              <button
                id="celebration-view-inventory-btn"
                onClick={() => {
                  sound.playClick();
                  setActiveTab('inventory');
                }}
                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono shadow-sm flex items-center gap-1 whitespace-nowrap self-start sm:self-auto"
              >
                <span>View in Locker</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sub-Navigation Switcher (Briefing vs Mission Log vs Mission History vs Roadmap) */}
      <div className="flex items-center gap-2 border-b border-[#1e2230] pb-2 font-mono text-xs overflow-x-auto">
        <button
          id="subtab-briefing"
          onClick={() => {
            sound.playClick();
            setSubTab('briefing');
          }}
          className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            subTab === 'briefing'
              ? 'bg-blue-600 text-white border-blue-500 font-bold'
              : 'bg-[#0c0e14] text-slate-400 border-[#1e2230] hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Active Directive</span>
        </button>

        <button
          id="subtab-mission-log"
          onClick={() => {
            sound.playClick();
            setSubTab('log');
          }}
          className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            subTab === 'log'
              ? 'bg-blue-600 text-white border-blue-500 font-bold'
              : 'bg-[#0c0e14] text-slate-400 border-[#1e2230] hover:text-slate-200'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Mission Log ({completedCount}/{totalCount})</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse ml-0.5"></span>
        </button>

        <button
          id="subtab-mission-history"
          onClick={() => {
            sound.playClick();
            setSubTab('history');
            refreshHistory();
          }}
          className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            subTab === 'history'
              ? 'bg-blue-600 text-white border-blue-500 font-bold'
              : 'bg-[#0c0e14] text-slate-400 border-[#1e2230] hover:text-slate-200'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Mission History ({historyEntries.length})</span>
          {historyEntries.length > 0 && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
              Saved
            </span>
          )}
        </button>

        <button
          id="subtab-roadmap"
          onClick={() => {
            sound.playClick();
            setSubTab('roadmap');
          }}
          className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 whitespace-nowrap transition-colors ${
            subTab === 'roadmap'
              ? 'bg-blue-600 text-white border-blue-500 font-bold'
              : 'bg-[#0c0e14] text-slate-400 border-[#1e2230] hover:text-slate-200'
          }`}
        >
          <Milestone className="w-3.5 h-3.5" />
          <span>Future Roadmap (3)</span>
        </button>
      </div>

      {/* Mode 1: Mission Log */}
      {subTab === 'log' && (
        <MissionLog
          mission={mission}
          progress={progress}
          setActiveTab={setActiveTab}
        />
      )}

      {/* Mode 2: Directive Overview & Briefing */}
      {subTab === 'briefing' && (
        <div className="space-y-5">
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
                {/* Duration Badge */}
                {(mission.durationSeconds !== undefined || mission.status === 'Active') && (
                  <div className="px-2.5 py-1 rounded bg-[#11131a] border border-[#1e2230] text-xs font-mono flex items-center gap-1.5 text-slate-300">
                    <Clock className={`w-3 h-3 ${mission.status === 'Active' ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
                    <span className="text-[10px] text-slate-400">Duration:</span>
                    <span className={`font-bold ${mission.status === 'Complete' ? 'text-emerald-300' : 'text-amber-300'}`}>
                      {formatDuration(mission.durationSeconds)}
                    </span>
                  </div>
                )}

                <button
                  id="view-detailed-log-btn"
                  onClick={() => {
                    sound.playClick();
                    setSubTab('log');
                  }}
                  className="px-2.5 py-1 rounded bg-[#11131a] hover:bg-[#161821] text-blue-300 border border-blue-500/40 text-xs flex items-center gap-1 transition-colors"
                >
                  <ListOrdered className="w-3 h-3" />
                  <span>Open Full Log</span>
                </button>
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

            {/* Objectives Sequence List with Individual Objective Rewards */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 font-bold uppercase tracking-wider">
                    Objective Milestones (6 Steps):
                  </span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    percentCompleted === 100
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-blue-950 text-blue-300 border border-blue-500/40'
                  }`}>
                    {percentCompleted}% Done ({completedCount}/6)
                  </span>
                </div>
                <button
                  onClick={() => {
                    sound.playClick();
                    setSubTab('log');
                  }}
                  className="text-slate-400 hover:text-blue-300 flex items-center gap-1 text-[11px]"
                >
                  <span>View Telemetry History</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2">
                {mission.objectives.map((obj, idx) => {
                  const isDone = obj.isCompleted;
                  const isCurrent = idx === mission.currentObjectiveIndex && mission.status !== 'Complete';
                  
                  return (
                    <div
                      key={obj.id}
                      className={`p-3 rounded-lg border text-xs transition-colors space-y-2 ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : isCurrent
                          ? 'bg-blue-950/30 border-blue-500/60 shadow-sm'
                          : 'bg-[#11131a] border-[#1e2230] text-slate-400'
                      }`}
                    >
                      {/* Top Objective Line */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            isDone
                              ? 'bg-emerald-500 text-slate-950'
                              : isCurrent
                              ? 'bg-blue-500 text-white animate-pulse'
                              : 'bg-[#1e2230] text-slate-400'
                          }`}>
                            {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : obj.stepNumber}
                          </div>
                          <span className={`font-sans text-xs truncate ${
                            isDone ? 'text-emerald-200' : isCurrent ? 'text-blue-100 font-bold' : 'text-slate-300'
                          }`}>
                            {obj.description}
                          </span>
                        </div>

                        {/* Objective Actions: Pin to HUD & Reorder */}
                        <div className="flex items-center gap-1.5 ml-7 sm:ml-0 shrink-0 font-mono text-[10px]">
                          <span className="text-slate-400 mr-1 hidden sm:inline">
                            {obj.targetZone}
                          </span>

                          {/* Reorder Buttons */}
                          {setMission && (
                            <div className="flex items-center bg-[#090b10] border border-[#1e2230] rounded p-0.5">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveObjective(idx, 'up');
                                }}
                                title="Move Objective Up"
                                className="p-0.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === mission.objectives.length - 1}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveObjective(idx, 'down');
                                }}
                                title="Move Objective Down"
                                className="p-0.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {/* Pin to HUD Toggle */}
                          {setMission && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePin(obj.id);
                              }}
                              className={`px-1.5 py-0.5 rounded border flex items-center gap-1 transition-all ${
                                obj.isPinnedToHUD
                                  ? 'bg-blue-950 text-blue-300 border-blue-500/80 shadow-sm font-semibold'
                                  : 'bg-[#090b10] text-slate-400 hover:text-slate-200 border-[#1e2230]'
                              }`}
                              title={obj.isPinnedToHUD ? 'Pinned to Tactical HUD Quick Access' : 'Pin to Tactical HUD'}
                            >
                              {obj.isPinnedToHUD ? (
                                <>
                                  <Pin className="w-2.5 h-2.5 text-blue-400 fill-blue-400" />
                                  <span className="text-[9px]">HUD Pinned</span>
                                </>
                              ) : (
                                <>
                                  <Pin className="w-2.5 h-2.5" />
                                  <span className="text-[9px]">Pin</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Objective Rewards Breakdown */}
                      {obj.rewards && obj.rewards.length > 0 && (
                        <div className="ml-7 flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#1e2230]/60">
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 mr-1">
                            <Gift className="w-3 h-3 text-amber-400" />
                            <span>{isDone ? 'Milestone Claimed:' : 'Milestone Reward:'}</span>
                          </span>

                          {obj.rewards.map((rew, rIdx) => {
                            const Icon = getRewardIconComponent(rew.icon, rew.type);
                            return (
                              <div
                                key={`${rew.name}-${rIdx}`}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
                                  isDone
                                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                                    : 'bg-[#090b10] text-slate-300 border-[#1e2230]'
                                }`}
                                title={rew.description || rew.name}
                              >
                                <Icon className={`w-3 h-3 ${isDone ? 'text-emerald-400' : 'text-amber-400'}`} />
                                <span className="font-semibold">{rew.name}</span>
                                {rew.amount && rew.type === 'credits' && (
                                  <span className={isDone ? 'text-emerald-200' : 'text-amber-300'}>
                                    (+{rew.amount} CR)
                                  </span>
                                )}
                                {isDone && (
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 ml-0.5" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guaranteed Overall Rewards Box */}
            <div className="p-3 rounded-lg bg-[#11131a] border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-sans">
              <div className="flex items-center gap-2">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-300 font-bold">Guaranteed Overall Mission Completion Rewards:</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="text-amber-300 font-bold">+{mission.rewardCredits} Prototype Credits</span>
                <span className="text-slate-600">•</span>
                <span className="text-blue-300 font-bold">{mission.rewardItem} (Foundational)</span>
              </div>
            </div>

          </div>

          {/* Quick preview of Mission Log */}
          <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div className="flex items-center gap-2.5">
              <ListOrdered className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <div className="font-bold text-white">Need granular coordinate telemetry & filterable history?</div>
                <div className="text-[11px] text-slate-400 font-sans">
                  The Mission Log records past milestones, zone coordinates, and objective status filters.
                </div>
              </div>
            </div>
            <button
              id="open-mission-log-tab-btn"
              onClick={() => {
                sound.playClick();
                setSubTab('log');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#11131a] hover:bg-[#161821] text-blue-300 border border-blue-500/50 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <span>Access Mission Log</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Mission History (LocalStorage Persistence & Stripe Verified Receipts) */}
      {subTab === 'history' && (
        <div className="space-y-5 font-mono">
          {/* Header Action Bar */}
          <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm uppercase">
                  Mission Completion Archive & Audit Log
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#11131a] text-emerald-300 border border-emerald-500/40">
                  LocalStorage Active
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Read-only logs of finalized missions, recorded duration stats, cryptographic verification hashes, and Stripe receipts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setSelectedStripePassId('priority_mission_pass');
                  setIsStripeModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Stripe Pass Checkout</span>
              </button>

              {historyEntries.length === 0 && (
                <button
                  type="button"
                  onClick={handleSimulateLogEntry}
                  className="px-3 py-1.5 rounded-lg bg-[#11131a] hover:bg-[#161821] text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  title="Generate a sample verified mission log entry"
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Log Sample Entry</span>
                </button>
              )}

              {historyEntries.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="px-2.5 py-1.5 rounded-lg bg-[#11131a] hover:bg-red-950/40 text-slate-400 hover:text-red-300 border border-[#1e2230] text-xs flex items-center gap-1 transition-colors"
                  title="Clear saved mission history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear History</span>
                </button>
              )}
            </div>
          </div>

          {/* Stripe Booster Promo Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#0c1220] via-[#0e172a] to-[#0c0e14] border border-blue-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/60 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm font-sans">
                    Sector 7 Priority Mission Pass — Powered by Stripe
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-600 text-white">
                    Instant Clearance
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans max-w-xl">
                  Unlock expedited mission routing, permanent 2x telemetry multipliers, and verified supporter badges signed directly to your Mission History archive.
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-blue-300 pt-1 font-sans">
                  <span>✓ 256-Bit SSL Stripe Node</span>
                  <span>•</span>
                  <span>✓ +250 to +2,500 Bonus Credits</span>
                  <span>•</span>
                  <span>✓ Auto-Receipt Sync</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setSelectedStripePassId('priority_mission_pass');
                setIsStripeModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all shrink-0"
            >
              <span>Get Pass from $4.99</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* History Entries List */}
          {historyEntries.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Archived Mission Entries ({historyEntries.length})</span>
                <span className="text-[10px]">Read-Only Immutable Logs</span>
              </div>

              {historyEntries.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-4 rounded-xl border transition-all ${
                    entry.stripePaymentReceipt
                      ? 'bg-[#0e1320] border-blue-500/50 shadow-md'
                      : 'bg-[#0c0e14] border-[#1e2230] hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-[#1e2230]">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        entry.stripePaymentReceipt
                          ? 'bg-blue-950 text-blue-400 border border-blue-500/40'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      }`}>
                        {entry.stripePaymentReceipt ? <CreditCard className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm font-sans">{entry.title}</span>
                          <span className="text-xs text-slate-400">[{entry.code}]</span>
                        </div>
                        <div className="text-xs text-slate-400 font-sans">
                          Classification: <span className="text-slate-300">{entry.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {entry.stripePaymentReceipt ? (
                        <span className="px-2.5 py-1 rounded-md bg-blue-950/80 text-blue-300 border border-blue-500/40 font-bold flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-blue-400" />
                          <span>Stripe Paid (${(entry.stripePaymentReceipt.amountTotal / 100).toFixed(2)})</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Mission Finalized</span>
                        </span>
                      )}

                      <div className="px-2.5 py-1 rounded-md bg-[#11131a] border border-[#1e2230] text-slate-300 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span className="text-[10px] text-slate-400">Duration:</span>
                        <span className="font-bold text-amber-300">{formatDuration(entry.durationSeconds)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Stats & Verification Details */}
                  <div className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase">Completion Timestamp:</span>
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[11px]">{formatDate(entry.completedAt)}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase">Milestones & Telemetry:</span>
                      <div className="text-slate-200 text-[11px]">
                        <span className="text-emerald-400 font-bold">{entry.objectivesCompletedCount}</span> of {entry.totalObjectivesCount} Directives Cleared
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase">Rewards Claimed:</span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="text-amber-300 font-bold">+{entry.rewardCredits} CR</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-blue-300 font-bold truncate">{entry.rewardItem}</span>
                      </div>
                    </div>
                  </div>

                  {/* Cryptographic Verification Hash & Stripe Txn ID */}
                  <div className="mt-3 pt-2.5 border-t border-[#1e2230] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5 truncate">
                      <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>Verification Audit:</span>
                      <span className="text-slate-300 font-semibold truncate">{entry.verificationHash}</span>
                    </div>

                    {entry.stripePaymentReceipt && (
                      <div className="flex items-center gap-1.5 text-blue-300">
                        <Receipt className="w-3 h-3 text-blue-400" />
                        <span>Stripe Ref:</span>
                        <span className="text-slate-300">{entry.stripePaymentReceipt.sessionId.substring(0, 16)}...</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[#0c0e14] border border-dashed border-[#1e2230] text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#11131a] border border-[#1e2230] flex items-center justify-center mx-auto text-slate-400">
                <History className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-sm font-bold text-white">No Mission History Saved Yet</h4>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">
                  Completing directives in the playable prototype or purchasing mission passes via Stripe will automatically generate read-only log entries saved in your browser's persistent localStorage.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('prototype');
                  }}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>Launch Mission 001 Prototype</span>
                </button>

                <button
                  type="button"
                  onClick={handleSimulateLogEntry}
                  className="px-4 py-2 rounded-lg bg-[#11131a] hover:bg-[#161821] text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Simulate & Log Completed Mission</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 4: Roadmap Directives */}
      {subTab === 'roadmap' && (
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
      )}

      {/* Stripe Checkout Modal */}
      <StripeCheckoutModal
        isOpen={isStripeModalOpen}
        onClose={() => {
          setIsStripeModalOpen(false);
          refreshHistory();
        }}
        setProgress={setProgress}
        preselectedPassId={selectedStripePassId}
        onPaymentSuccess={() => {
          refreshHistory();
        }}
      />

    </div>
  );
};
