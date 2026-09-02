import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Compass, 
  Filter, 
  Search, 
  Sparkles, 
  MapPin, 
  ChevronRight, 
  ChevronDown, 
  Gamepad2, 
  ShieldCheck, 
  Archive, 
  ArrowRight,
  ListOrdered,
  AlertCircle,
  Gift,
  Coins,
  Cpu,
  Zap,
  Shield,
  Trophy,
  Package
} from 'lucide-react';
import { Mission, MissionObjective, PlayerProgress, NavigationTab, ObjectiveReward } from '../types';
import { sound } from '../services/audioService';

interface MissionLogProps {
  mission: Mission;
  progress?: PlayerProgress;
  setActiveTab?: (tab: NavigationTab) => void;
}

type ObjectiveFilter = 'all' | 'completed' | 'active' | 'upcoming';

export const MissionLog: React.FC<MissionLogProps> = ({
  mission,
  progress,
  setActiveTab
}) => {
  const [filter, setFilter] = useState<ObjectiveFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedObjId, setExpandedObjId] = useState<string | null>(
    mission.objectives[mission.currentObjectiveIndex]?.id || null
  );

  const completedCount = mission.objectives.filter(o => o.isCompleted).length;
  const totalCount = mission.objectives.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const getRewardIcon = (iconName?: string, type?: string) => {
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

  // Filter objectives
  const filteredObjectives = mission.objectives.filter((obj, idx) => {
    const isCurrent = idx === mission.currentObjectiveIndex && !obj.isCompleted && mission.status !== 'Complete';
    
    // Status filter
    if (filter === 'completed' && !obj.isCompleted) return false;
    if (filter === 'active' && !isCurrent) return false;
    if (filter === 'upcoming' && (obj.isCompleted || isCurrent)) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = obj.description.toLowerCase().includes(q);
      const matchZone = obj.targetZone?.toLowerCase().includes(q) || false;
      const matchStep = `step ${obj.stepNumber}`.includes(q);
      return matchDesc || matchZone || matchStep;
    }

    return true;
  });

  return (
    <div id="mission-log-container" className="space-y-4 font-sans text-xs">
      
      {/* Top Header Card & Progress Summary */}
      <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ListOrdered className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">Tactical Objective Telemetry Log</h3>
                <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-700/50 text-[9px] font-mono">
                  {mission.code}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Live chronological audit trail of mission milestones, directives, and completed coordinates.
              </p>
            </div>
          </div>

          {/* Quick Play CTA */}
          {setActiveTab && (
            <button
              id="mission-log-play-btn"
              onClick={() => {
                sound.playClick();
                setActiveTab('prototype');
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold font-mono text-xs flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Resume Objective</span>
            </button>
          )}
        </div>

        {/* Progress Bar & Telemetry Stats */}
        <div className="space-y-1.5 pt-2 border-t border-[#1e2230] font-mono">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Completion Milestone:</span>
              <span className="font-bold text-blue-400">{completedCount} of {totalCount} Objectives Cleared</span>
            </div>
            <span className="font-bold text-slate-200">{progressPercent}%</span>
          </div>

          <div className="w-full h-2 bg-[#11131a] rounded-full overflow-hidden border border-[#1e2230]">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-1">
          
          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 flex-wrap font-mono text-[10px]">
            <button
              id="filter-all"
              onClick={() => {
                sound.playClick();
                setFilter('all');
              }}
              className={`px-2.5 py-1 rounded border transition-colors ${
                filter === 'all'
                  ? 'bg-blue-600 text-white border-blue-500 font-bold'
                  : 'bg-[#11131a] text-slate-400 border-[#1e2230] hover:text-slate-200'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              id="filter-completed"
              onClick={() => {
                sound.playClick();
                setFilter('completed');
              }}
              className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
                filter === 'completed'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500 font-bold'
                  : 'bg-[#11131a] text-slate-400 border-[#1e2230] hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Completed ({completedCount})</span>
            </button>
            <button
              id="filter-active"
              onClick={() => {
                sound.playClick();
                setFilter('active');
              }}
              className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1 ${
                filter === 'active'
                  ? 'bg-blue-950 text-blue-300 border-blue-500 font-bold'
                  : 'bg-[#11131a] text-slate-400 border-[#1e2230] hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              <span>Active (1)</span>
            </button>
            <button
              id="filter-upcoming"
              onClick={() => {
                sound.playClick();
                setFilter('upcoming');
              }}
              className={`px-2.5 py-1 rounded border transition-colors ${
                filter === 'upcoming'
                  ? 'bg-purple-950 text-purple-300 border-purple-500 font-bold'
                  : 'bg-[#11131a] text-slate-400 border-[#1e2230] hover:text-slate-200'
              }`}
            >
              Upcoming ({Math.max(0, totalCount - completedCount - (mission.status === 'Complete' ? 0 : 1))})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="mission-log-search"
              placeholder="Search objectives or zones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#11131a] border border-[#1e2230] focus:border-blue-500 focus:outline-none pl-8 pr-3 py-1 rounded text-slate-200 font-mono text-[11px] placeholder:text-slate-500"
            />
          </div>
        </div>

      </div>

      {/* Objectives Timeline Log */}
      <div className="space-y-2">
        {filteredObjectives.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-[#0c0e14] border border-[#1e2230] text-slate-400 font-mono space-y-1">
            <AlertCircle className="w-5 h-5 text-slate-500 mx-auto mb-1" />
            <p>No objective log entries match the selected filter.</p>
          </div>
        ) : (
          filteredObjectives.map((obj, idx) => {
            const isCompleted = obj.isCompleted;
            const isCurrent = obj.stepNumber - 1 === mission.currentObjectiveIndex && !isCompleted && mission.status !== 'Complete';
            const isExpanded = expandedObjId === obj.id;

            return (
              <div
                key={obj.id}
                id={`objective-log-item-${obj.id}`}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isCurrent
                    ? 'bg-[#0c0e14] border-blue-500/70 shadow-md shadow-blue-950/30 animate-objective-card-pulse'
                    : isCompleted
                    ? 'bg-[#0c0e14] border-[#1e2230]'
                    : 'bg-[#0c0e14] border-[#1e2230] opacity-80'
                }`}
              >
                {/* Header Row */}
                <div 
                  onClick={() => {
                    sound.playClick();
                    setExpandedObjId(isExpanded ? null : obj.id);
                  }}
                  className="p-3 cursor-pointer flex items-center justify-between gap-3 select-none hover:bg-[#11131a] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    
                    {/* Status Badge Icon */}
                    <div className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center font-mono font-bold text-xs ${
                      isCompleted
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                        : isCurrent
                        ? 'bg-blue-600 text-white shadow-sm animate-tactical-pulse'
                        : 'bg-[#11131a] text-slate-500 border border-[#1e2230]'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <span>{obj.stepNumber}</span>
                      )}
                    </div>

                    {/* Step Title & Zone */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] text-slate-400 uppercase font-semibold">
                          STEP {obj.stepNumber}
                        </span>
                        {isCompleted && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono font-semibold">
                            CLEARED
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-500/50 text-[9px] font-mono font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                            ACTIVE DIRECTIVE
                          </span>
                        )}
                      </div>
                      <h4 className={`text-xs font-semibold truncate ${
                        isCurrent ? 'text-white font-bold' : isCompleted ? 'text-slate-200' : 'text-slate-400'
                      }`}>
                        {obj.description}
                      </h4>
                    </div>
                  </div>

                  {/* Zone & Expand Toggle */}
                  <div className="flex items-center gap-3 shrink-0">
                    {obj.targetZone && (
                      <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-slate-400 bg-[#11131a] px-2 py-0.5 rounded border border-[#1e2230]">
                        <MapPin className="w-3 h-3 text-blue-400" />
                        <span>{obj.targetZone}</span>
                      </div>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="p-3.5 bg-[#08090e] border-t border-[#1e2230] space-y-3 font-mono text-xs">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      
                      {/* Telemetry Target Info */}
                      <div className="p-2.5 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                          <Compass className="w-3 h-3 text-blue-400" />
                          Target Waypoint Coordinates
                        </div>
                        <div className="text-slate-200 text-xs font-bold">
                          {obj.targetZone || 'Sector 7 Area'}
                        </div>
                        {obj.targetCoordinates && (
                          <div className="text-[10px] text-blue-300">
                            Grid Node: X: {obj.targetCoordinates.x}, Y: {obj.targetCoordinates.y}
                          </div>
                        )}
                      </div>

                      {/* Status & Verification Audit */}
                      <div className="p-2.5 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1">
                        <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1.5">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          Protocol Status
                        </div>
                        <div className={`text-xs font-bold ${
                          isCompleted ? 'text-emerald-400' : isCurrent ? 'text-blue-400' : 'text-slate-400'
                        }`}>
                          {isCompleted ? 'Verified & Committed to Memory Cache' : isCurrent ? 'Live Tracking on Tactical Radar' : 'Pending Previous Milestone'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">
                          {isCompleted 
                            ? 'Telemetry sequence validated by Onegodia Digital Grid.'
                            : isCurrent
                            ? 'Move character near target waypoint to execute directive.'
                            : 'Objective unlocks automatically upon completing Step ' + (obj.stepNumber - 1) + '.'
                          }
                        </div>
                      </div>

                    </div>

                    {/* Objective Rewards Breakdown */}
                    {obj.rewards && obj.rewards.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1.5">
                        <div className="text-[10px] text-amber-400 uppercase font-semibold flex items-center gap-1.5">
                          <Gift className="w-3 h-3 text-amber-400" />
                          <span>{isCompleted ? 'Unlocked Milestone Rewards' : 'Milestone Rewards on Completion'}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {obj.rewards.map((rew, rIdx) => {
                            const Icon = getRewardIcon(rew.icon, rew.type);
                            return (
                              <div
                                key={`${rew.name}-${rIdx}`}
                                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-mono ${
                                  isCompleted
                                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                                    : 'bg-[#090b10] text-slate-300 border-[#1e2230]'
                                }`}
                              >
                                <Icon className={`w-3.5 h-3.5 ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`} />
                                <span className="font-bold">{rew.name}</span>
                                {rew.amount && rew.type === 'credits' && (
                                  <span className={isCompleted ? 'text-emerald-200' : 'text-amber-300'}>
                                    (+{rew.amount} CR)
                                  </span>
                                )}
                                <span className="text-[9px] text-slate-400 bg-slate-800/80 px-1 py-0.2 rounded border border-slate-700">
                                  {rew.rarity || 'Foundational'}
                                </span>
                                {isCompleted && (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 ml-0.5" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Action Hint */}
                    {isCurrent && (
                      <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="text-[11px] text-blue-200 font-sans flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span><strong>Tactical Tip:</strong> Navigate to the coordinates in Game V1 and hold [E] or tap the Action button to advance.</span>
                        </div>
                        {setActiveTab && (
                          <button
                            id={`goto-obj-btn-${obj.id}`}
                            onClick={() => {
                              sound.playClick();
                              setActiveTab('prototype');
                            }}
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] font-mono flex items-center gap-1 shrink-0 transition-colors"
                          >
                            <span>Open In-Game</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Historical Missions Archive Section */}
      <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Archive className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-200 text-xs uppercase">Historical Mission Archive</span>
          </div>
          <span className="text-[10px] text-slate-500">
            {mission.status === 'Complete' ? '1 Completed' : '0 Archived'}
          </span>
        </div>

        <div className="p-3 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1.5 text-xs font-sans">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{mission.title}</span>
              <span className="text-[10px] font-mono text-slate-400">[{mission.code}]</span>
            </div>
            <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold border ${
              mission.status === 'Complete'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                : 'bg-blue-950 text-blue-300 border-blue-500/50'
            }`}>
              {mission.status === 'Complete' ? 'ARCHIVED / REWARD CLAIMED' : 'IN PROGRESS'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {mission.status === 'Complete' 
              ? `Signal successfully purified by Citizen. Received 250 Prototype Credits and ${mission.rewardItem}.`
              : 'Core Mission 001 is currently active in the Onegodia simulation environment.'
            }
          </p>
        </div>
      </div>

    </div>
  );
};
