import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Radio,
  FileText,
  Activity,
  Compass,
  MapPin,
  Coins,
  Shield,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Copy,
  Check,
  Download,
  Play,
  Volume2,
  VolumeX,
  FastForward,
  RotateCcw,
  Zap,
  Package,
  Layers,
  Terminal,
  Share2,
  Search,
  Filter,
  Eye,
  Info,
  Bell,
  Plus,
  X,
  MessageSquarePlus,
  Send
} from 'lucide-react';
import { Mission, MissionObjective, PlayerProgress, NavigationTab, ObjectiveReward } from '../types';
import { audioService, sound } from '../services/audioService';
import { generateProceduralNarrative, NarrativeSummaryBundle } from '../utils/proceduralNarrative';

export interface CustomNarrativeSummary {
  id: string;
  timestamp: string;
  author: string;
  title: string;
  content: string;
  category: 'debrief' | 'intel' | 'chronicle' | 'transmission';
}

interface MissionLogViewProps {
  mission: Mission;
  setMission?: React.Dispatch<React.SetStateAction<Mission>>;
  progress?: PlayerProgress;
  setProgress?: React.Dispatch<React.SetStateAction<PlayerProgress>>;
  setActiveTab?: (tab: NavigationTab) => void;
}

type NarrativeTab = 'overview' | 'comms' | 'chronicle' | 'aar' | 'telemetry' | 'field_logs';
type MilestoneFilter = 'all' | 'completed' | 'active' | 'pending';

export const MissionLogView: React.FC<MissionLogViewProps> = ({
  mission,
  setMission,
  progress,
  setProgress,
  setActiveTab
}) => {
  const [activeNarrativeTab, setActiveNarrativeTab] = useState<NarrativeTab>('overview');
  const [milestoneFilter, setMilestoneFilter] = useState<MilestoneFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(null);
  const [seedModifier, setSeedModifier] = useState<number>(0);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isPlayingCommsAudio, setIsPlayingCommsAudio] = useState(false);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [liveElapsedSeconds, setLiveElapsedSeconds] = useState(0);

  // Custom narrative summaries logged by operative or tactical command
  const [customNarrativeSummaries, setCustomNarrativeSummaries] = useState<CustomNarrativeSummary[]>(() => {
    try {
      const saved = localStorage.getItem('onegodia_mission_narrative_logs_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'narrative-init-1',
        timestamp: new Date(Date.now() - 180000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        author: 'Aria Pulse Dispatch',
        title: 'Initial Quantum Telemetry Calibration',
        content: 'Grid sensors calibrated along Washington Blvd. Relic harmonic frequencies identified within acceptable noise margins.',
        category: 'debrief'
      }
    ];
  });

  // Modal states for creating new milestone or narrative summary
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
  const [isAddNarrativeModalOpen, setIsAddNarrativeModalOpen] = useState(false);

  // Form states for adding milestone
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');
  const [newMilestoneZone, setNewMilestoneZone] = useState('Stamford Sector 7');
  const [newMilestoneCredits, setNewMilestoneCredits] = useState('50');

  // Form states for adding narrative summary
  const [newNarrativeTitle, setNewNarrativeTitle] = useState('');
  const [newNarrativeAuthor, setNewNarrativeAuthor] = useState('Field Operative [Local Unit]');
  const [newNarrativeCategory, setNewNarrativeCategory] = useState<'debrief' | 'intel' | 'chronicle' | 'transmission'>('debrief');
  const [newNarrativeContent, setNewNarrativeContent] = useState('');

  // Audio visual notification toast for ding trigger
  const [audioFeedbackToast, setAudioFeedbackToast] = useState<{
    visible: boolean;
    type: 'milestone' | 'narrative';
    message: string;
  } | null>(null);

  const audioToastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAudioVisualCue = (type: 'milestone' | 'narrative', message: string) => {
    if (audioToastTimeoutRef.current) clearTimeout(audioToastTimeoutRef.current);
    setAudioFeedbackToast({ visible: true, type, message });
    audioToastTimeoutRef.current = setTimeout(() => {
      setAudioFeedbackToast(null);
    }, 3200);
  };

  // Dynamic Audio Trigger: Monitor when a new milestone is added to mission.objectives
  const prevMilestonesCountRef = useRef<number>(mission.objectives.length);
  const isInitialMilestoneMountRef = useRef<boolean>(true);

  useEffect(() => {
    if (isInitialMilestoneMountRef.current) {
      isInitialMilestoneMountRef.current = false;
      return;
    }
    if (mission.objectives.length > prevMilestonesCountRef.current) {
      const latestObj = mission.objectives[mission.objectives.length - 1];
      audioService.playDing(1.1);
      triggerAudioVisualCue(
        'milestone',
        `New Milestone Added to Log: Step 0${latestObj.stepNumber} - ${latestObj.description.slice(0, 36)}...`
      );
    }
    prevMilestonesCountRef.current = mission.objectives.length;
  }, [mission.objectives.length, mission.objectives]);

  // Dynamic Audio Trigger: Monitor when a new narrative summary is added to the log
  const prevNarrativeCountRef = useRef<number>(customNarrativeSummaries.length);
  const isInitialNarrativeMountRef = useRef<boolean>(true);

  useEffect(() => {
    if (isInitialNarrativeMountRef.current) {
      isInitialNarrativeMountRef.current = false;
      return;
    }
    if (customNarrativeSummaries.length > prevNarrativeCountRef.current) {
      const latest = customNarrativeSummaries[0];
      audioService.playDing(1.0);
      triggerAudioVisualCue('narrative', `New Narrative Summary Added: "${latest.title}"`);
    }
    prevNarrativeCountRef.current = customNarrativeSummaries.length;
  }, [customNarrativeSummaries.length, customNarrativeSummaries]);

  // Reference for audio interval
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate milestone metrics
  const completedObjectives = useMemo(() => {
    return mission.objectives.filter(o => o.isCompleted);
  }, [mission.objectives]);

  const completedCount = completedObjectives.length;
  const totalCount = mission.objectives.length;
  const isComplete = mission.status === 'Complete' || completedCount === totalCount;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Generate procedural narrative bundle
  const narrativeBundle: NarrativeSummaryBundle = useMemo(() => {
    return generateProceduralNarrative(mission, progress, seedModifier);
  }, [mission, progress, seedModifier]);

  // Live timer tracking duration since mission started
  useEffect(() => {
    const startTime = mission.startedAt || (mission.completedAt ? mission.completedAt - 180000 : Date.now());
    const updateElapsed = () => {
      if (mission.status === 'Complete' && mission.durationSeconds) {
        setLiveElapsedSeconds(mission.durationSeconds);
      } else {
        const secs = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
        setLiveElapsedSeconds(secs);
      }
    };
    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);
    return () => clearInterval(interval);
  }, [mission.startedAt, mission.completedAt, mission.durationSeconds, mission.status]);

  // Ensure completed milestones have timestamps
  useEffect(() => {
    if (!setMission) return;
    let needsUpdate = false;
    const now = Date.now();
    const baseStart = mission.startedAt || (now - 120000);

    const updatedObjectives = mission.objectives.map((obj, index) => {
      if (obj.isCompleted && !obj.completedTimestamp) {
        needsUpdate = true;
        const staggeredTimestamp = baseStart + (index + 1) * 35000;
        const d = new Date(staggeredTimestamp);
        return {
          ...obj,
          completedTimestamp: staggeredTimestamp,
          completedTimeString: `${d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
          durationSecondsToComplete: 35 + index * 8
        };
      }
      return obj;
    });

    if (needsUpdate) {
      setMission(prev => ({
        ...prev,
        objectives: updatedObjectives
      }));
    }
  }, [mission.objectives, mission.startedAt, setMission]);

  // Format seconds to mm:ss
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format timestamp helper
  const formatMilestoneDate = (timestamp?: number) => {
    if (!timestamp) return 'Timestamp Pending';
    const d = new Date(timestamp);
    return `${d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  };

  // Regenerate procedural narrative with seed variation & audio feedback
  const handleRegenerateNarrative = () => {
    sound.playClick();
    audioService.playDing(1.0);
    triggerAudioVisualCue('narrative', 'Procedural Narrative Resynthesized & Logged');
    setSeedModifier(prev => prev + 1);
  };

  // Add a new milestone directly to the mission directive log
  const handleAddNewMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneDesc.trim() || !setMission) return;

    sound.playClick();
    const now = Date.now();
    const newObjective: MissionObjective = {
      id: `milestone-${now}-${Math.random().toString(36).substring(2, 6)}`,
      stepNumber: mission.objectives.length + 1,
      description: newMilestoneDesc.trim(),
      isCompleted: false,
      targetZone: newMilestoneZone.trim() || 'Stamford Sector 7',
      targetCoordinates: {
        x: 350 + Math.floor(Math.random() * 80),
        y: 420 + Math.floor(Math.random() * 80)
      },
      rewards: [
        {
          type: 'credits',
          name: 'Tactical Recon Bounty',
          amount: Number(newMilestoneCredits) || 50
        }
      ]
    };

    setMission(prev => {
      const nextObjectives = [...prev.objectives, newObjective];
      const nextMission = {
        ...prev,
        objectives: nextObjectives
      };
      try {
        localStorage.setItem('onegodia_mission_001_v1', JSON.stringify(nextMission));
      } catch (err) {
        console.error(err);
      }
      return nextMission;
    });

    setNewMilestoneDesc('');
    setIsAddMilestoneModalOpen(false);
  };

  // Add a new narrative summary debrief/log to the mission archive
  const handleAddNewNarrativeSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNarrativeTitle.trim() || !newNarrativeContent.trim()) return;

    sound.playClick();
    const now = Date.now();
    const d = new Date(now);
    const newEntry: CustomNarrativeSummary = {
      id: `narrative-${now}`,
      timestamp: `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      author: newNarrativeAuthor.trim() || 'Field Operative',
      title: newNarrativeTitle.trim(),
      content: newNarrativeContent.trim(),
      category: newNarrativeCategory
    };

    setCustomNarrativeSummaries(prev => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem('onegodia_mission_narrative_logs_v1', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setNewNarrativeTitle('');
    setNewNarrativeContent('');
    setIsAddNarrativeModalOpen(false);
  };

  // Advance to next milestone manually (interactive simulator)
  const handleAdvanceNextMilestone = () => {
    if (!setMission) return;
    sound.playClick();

    const nextIndex = mission.objectives.findIndex(o => !o.isCompleted);
    if (nextIndex === -1) {
      sound.playReward();
      return;
    }

    const now = Date.now();
    const d = new Date(now);
    const updatedObjectives = mission.objectives.map((obj, i) => {
      if (i === nextIndex) {
        return {
          ...obj,
          isCompleted: true,
          completedTimestamp: now,
          completedTimeString: `${d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
          durationSecondsToComplete: 42
        };
      }
      return obj;
    });

    const isAllDone = updatedObjectives.every(o => o.isCompleted);

    sound.playObjectiveComplete(nextIndex + 1);

    setMission(prev => ({
      ...prev,
      status: isAllDone ? 'Complete' : 'Active',
      completedAt: isAllDone ? now : prev.completedAt,
      startedAt: prev.startedAt || (now - 60000),
      currentObjectiveIndex: isAllDone ? prev.objectives.length - 1 : nextIndex + 1,
      objectives: updatedObjectives
    }));

    if (isAllDone && setProgress) {
      sound.playMissionComplete();
      setProgress(prev => ({
        ...prev,
        credits: prev.credits + 250,
        missionsCompleted: prev.missionsCompleted.includes(mission.id)
          ? prev.missionsCompleted
          : [...prev.missionsCompleted, mission.id]
      }));
    }
  };

  // Fast forward: complete all milestones
  const handleCompleteAllMilestones = () => {
    if (!setMission) return;
    sound.playClick();
    sound.playMissionComplete();
    const now = Date.now();

    const updatedObjectives = mission.objectives.map((obj, index) => {
      const ts = now - (mission.objectives.length - index) * 45000;
      const d = new Date(ts);
      return {
        ...obj,
        isCompleted: true,
        completedTimestamp: ts,
        completedTimeString: `${d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} • ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`,
        durationSecondsToComplete: 38 + index * 6
      };
    });

    setMission(prev => ({
      ...prev,
      status: 'Complete',
      completedAt: now,
      startedAt: prev.startedAt || (now - 300000),
      durationSeconds: 270,
      currentObjectiveIndex: prev.objectives.length - 1,
      objectives: updatedObjectives
    }));

    if (setProgress) {
      setProgress(prev => ({
        ...prev,
        credits: prev.credits + 250,
        missionsCompleted: prev.missionsCompleted.includes(mission.id)
          ? prev.missionsCompleted
          : [...prev.missionsCompleted, mission.id]
      }));
    }
  };

  // Reset milestone progress for testing
  const handleResetMilestones = () => {
    if (!setMission) return;
    sound.playClick();
    const updatedObjectives = mission.objectives.map(obj => ({
      ...obj,
      isCompleted: false,
      completedTimestamp: undefined,
      completedTimeString: undefined,
      durationSecondsToComplete: undefined
    }));

    setMission(prev => ({
      ...prev,
      status: 'Available',
      startedAt: undefined,
      completedAt: undefined,
      durationSeconds: undefined,
      currentObjectiveIndex: 0,
      objectives: updatedObjectives
    }));
  };

  // Copy narrative dossier to clipboard
  const handleCopyDossier = () => {
    sound.playClick();
    const report = `=====================================================
ONEGODIA: RISE OF THE DIGITAL WORLD™
MISSION LOG DOSSIER // [${mission.code}] ${mission.title.toUpperCase()}
=====================================================
STATUS: ${mission.status.toUpperCase()}
PROGRESSION: ${completedCount}/${totalCount} Milestones (${progressPercent}%)
MISSION TIME: ${formatTime(liveElapsedSeconds)}
SIGNAL STABILITY: ${narrativeBundle.quantumTelemetry.signalStabilityPercentage}%
CARRIER FREQUENCY: ${narrativeBundle.quantumTelemetry.carrierFrequency}

--- PROCEDURAL SUMMARY ---
${narrativeBundle.headline}
${narrativeBundle.statusOverview}

--- TACTICAL COMMAND AAR ---
Clearance: ${narrativeBundle.tacticalAAR.clearanceCode}
Assessment: ${narrativeBundle.tacticalAAR.directiveAssessment}
Next Action: ${narrativeBundle.tacticalAAR.nextStrategicAction}

--- MILESTONE TIMELINE ---
${mission.objectives
  .map(
    (o, i) =>
      `[Step 0${o.stepNumber}] ${o.isCompleted ? '✓ CLEARED' : '• PENDING'} - ${o.description}
  Timestamp: ${o.completedTimeString || 'Pending'}
  Zone: ${o.targetZone || 'N/A'}`
  )
  .join('\n\n')}
=====================================================`;

    navigator.clipboard.writeText(report);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  // Export as text file
  const handleExportTxt = () => {
    sound.playClick();
    const report = `ONEGODIA DIRECTIVE LOG // ${mission.code}: ${mission.title}\nExported: ${new Date().toISOString()}\n\n` +
      `Overview: ${narrativeBundle.statusOverview}\n\n` +
      `Tactical AAR:\n${narrativeBundle.tacticalAAR.keyObservations.join('\n')}\n\n` +
      `Chronicle:\n${narrativeBundle.chronicleProse.join('\n\n')}\n`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `onegodia_mission_log_${mission.code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Audio simulator for radio comms
  const togglePlayComms = () => {
    if (isPlayingCommsAudio) {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setIsPlayingCommsAudio(false);
    } else {
      setIsPlayingCommsAudio(true);
      sound.playRadarScan();
      setCurrentAudioIndex(0);

      audioIntervalRef.current = setInterval(() => {
        setCurrentAudioIndex(curr => {
          if (curr + 1 >= narrativeBundle.radioComms.length) {
            if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
            setIsPlayingCommsAudio(false);
            return 0;
          }
          sound.playClick();
          return curr + 1;
        });
      }, 3500);
    }
  };

  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, []);

  // Filtered objectives list
  const filteredObjectives = useMemo(() => {
    return mission.objectives.filter((obj, idx) => {
      const isCurrent = idx === mission.currentObjectiveIndex && !obj.isCompleted && mission.status !== 'Complete';
      if (milestoneFilter === 'completed' && !obj.isCompleted) return false;
      if (milestoneFilter === 'active' && !isCurrent) return false;
      if (milestoneFilter === 'pending' && (obj.isCompleted || isCurrent)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDesc = obj.description.toLowerCase().includes(q);
        const matchZone = (obj.targetZone || '').toLowerCase().includes(q);
        return matchDesc || matchZone;
      }
      return true;
    });
  }, [mission.objectives, mission.currentObjectiveIndex, mission.status, milestoneFilter, searchQuery]);

  return (
    <div className="w-full space-y-6 font-sans py-2 relative">
      
      {/* Dynamic Audio Feedback Trigger Toast */}
      {audioFeedbackToast?.visible && (
        <div
          id="audio-ding-toast"
          className="fixed top-20 right-4 sm:right-8 z-50 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto"
        >
          <div className="px-4 py-3 rounded-2xl bg-[#080d19]/95 border border-cyan-400 shadow-2xl shadow-cyan-950/90 backdrop-blur-md flex items-center gap-3 font-mono text-xs text-white max-w-md ring-1 ring-cyan-500/40">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 shrink-0">
              <Bell className="w-4 h-4 text-cyan-300 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <span>Audio Cue Triggered: Subtle &apos;Ding&apos;</span>
              </div>
              <div className="text-slate-200 font-sans text-xs mt-0.5 truncate">
                {audioFeedbackToast.message}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAudioFeedbackToast(null)}
              className="text-slate-400 hover:text-white p-1 text-xs"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          HERO STATUS & METRICS HEADER BANNER
         ========================================================= */}
      <section className="relative w-full rounded-2xl bg-[#090d16] border border-cyan-500/25 p-5 sm:p-6 shadow-2xl shadow-blue-950/30 overflow-hidden">
        
        {/* Subtle background circuit grid texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Left Title & Status Badges */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-cyan-400" />
                <span>DIRECTIVE LOG // {mission.code}</span>
              </span>

              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
                isComplete
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-blue-500/10 text-blue-300 border-blue-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isComplete ? 'bg-emerald-400' : 'bg-blue-400 animate-ping'}`} />
                <span>{mission.status}</span>
              </span>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                Stamford Sector 7
              </span>

              {/* Dynamic Audio Feedback Trigger Badge */}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 shadow-sm">
                <Bell className="w-3 h-3 text-cyan-400 animate-pulse" />
                <span>Audio Trigger: Armed (Ding on Log)</span>
                <button
                  type="button"
                  id="test-audio-ding-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    audioService.playDing(1.0);
                    triggerAudioVisualCue('milestone', "Audio Feedback Test: Subtle Bell 'Ding' Chime Played");
                  }}
                  className="ml-1 px-1.5 py-0.2 rounded bg-cyan-500/20 hover:bg-cyan-500 hover:text-black text-[9px] text-cyan-200 transition-colors"
                  title="Test subtle 'ding' sound effect"
                >
                  Test 🔔
                </button>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>{mission.title}</span>
              <span className="text-sm font-mono text-cyan-400 font-normal">
                [{mission.type}]
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {narrativeBundle.headline}
            </p>
          </div>

          {/* Right Action & Simulation Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            
            {/* Advance next milestone */}
            {!isComplete && (
              <button
                id="advance-milestone-btn"
                onClick={handleAdvanceNextMilestone}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 flex items-center gap-1.5 transition-all hover:scale-105"
                title="Advance to next milestone and log timestamp"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Advance Milestone</span>
              </button>
            )}

            {/* Quick Complete Mission button */}
            {!isComplete && (
              <button
                id="complete-all-milestones-btn"
                onClick={handleCompleteAllMilestones}
                className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all"
                title="Simulate all milestones completed"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simulate 100%</span>
              </button>
            )}

            {/* Reset button */}
            <button
              id="reset-milestones-btn"
              onClick={handleResetMilestones}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
              title="Reset mission milestones to step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Copy Dossier */}
            <button
              id="copy-dossier-btn"
              onClick={handleCopyDossier}
              className="px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Copy narrative report to clipboard"
            >
              {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedToast ? 'Copied' : 'Copy Dossier'}</span>
            </button>

            {/* Execute in game */}
            {setActiveTab && (
              <button
                id="launch-game-v1-btn"
                onClick={() => {
                  sound.playClick();
                  setActiveTab('play');
                }}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Stamford Corridor</span>
              </button>
            )}
          </div>

        </div>

        {/* Tactical Telemetry Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-cyan-900/30 font-mono text-xs">
          
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Milestones Cleared
              </div>
              <div className="text-sm font-bold text-white">
                {completedCount} of {totalCount}{' '}
                <span className="text-cyan-400 text-xs">({progressPercent}%)</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Elapsed Duration
              </div>
              <div className="text-sm font-bold text-white">
                {formatTime(liveElapsedSeconds)}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Contract Bounty
              </div>
              <div className="text-sm font-bold text-amber-300">
                {mission.rewardCredits} CR + Fragment
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                Signal Stability
              </div>
              <div className="text-sm font-bold text-emerald-400">
                {narrativeBundle.quantumTelemetry.signalStabilityPercentage}% Calibrated
              </div>
            </div>
          </div>

        </div>

        {/* Global Progress Bar */}
        <div className="mt-4 space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Directive Calibration Rail</span>
            <span className="text-cyan-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

      </section>

      {/* =========================================================
          MAIN TWO-COLUMN WORKSPACE:
          LEFT: PROCEDURAL NARRATIVE SUMMARIES
          RIGHT: COMPLETED MILESTONES WITH TIMESTAMPS
         ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =========================================================
            LEFT COLUMN (7 cols): PROCEDURAL NARRATIVE SUITE
           ========================================================= */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="rounded-2xl bg-[#090d16] border border-cyan-500/20 p-5 shadow-xl space-y-4">
            
            {/* Narrative Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  Procedural Narrative Synthesizer
                </h2>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  Live Feed
                </span>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  id="add-narrative-summary-btn"
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsAddNarrativeModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-500/50 hover:bg-cyan-900 text-cyan-200 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-all shadow-sm"
                  title="Add a custom narrative summary entry to the log"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>+ Log Summary</span>
                </button>

                <button
                  id="regenerate-narrative-btn"
                  onClick={handleRegenerateNarrative}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition-all"
                  title="Synthesize new procedural story variation (triggers audio chime)"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resynthesize</span>
                </button>

                <button
                  id="export-narrative-txt-btn"
                  onClick={handleExportTxt}
                  className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors"
                  title="Export narrative log"
                >
                  <Download className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Narrative Perspective Sub-Tabs */}
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              <button
                onClick={() => {
                  sound.playClick();
                  setActiveNarrativeTab('overview');
                }}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  activeNarrativeTab === 'overview'
                    ? 'bg-blue-600 text-white border-blue-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Overview
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveNarrativeTab('comms');
                }}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                  activeNarrativeTab === 'comms'
                    ? 'bg-blue-600 text-white border-blue-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Radio className="w-3 h-3" />
                <span>Radio Comms ({narrativeBundle.radioComms.length})</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveNarrativeTab('chronicle');
                }}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                  activeNarrativeTab === 'chronicle'
                    ? 'bg-blue-600 text-white border-blue-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Chronicle Lore</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveNarrativeTab('aar');
                }}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                  activeNarrativeTab === 'aar'
                    ? 'bg-blue-600 text-white border-blue-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Shield className="w-3 h-3" />
                <span>Tactical AAR</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveNarrativeTab('telemetry');
                }}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                  activeNarrativeTab === 'telemetry'
                    ? 'bg-blue-600 text-white border-blue-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Activity className="w-3 h-3" />
                <span>Telemetry</span>
              </button>

              <button
                id="field-logs-tab-btn"
                onClick={() => {
                  sound.playClick();
                  setActiveNarrativeTab('field_logs');
                }}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors ${
                  activeNarrativeTab === 'field_logs'
                    ? 'bg-blue-600 text-white border-blue-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <MessageSquarePlus className="w-3 h-3 text-cyan-400" />
                <span>Field Debriefs ({customNarrativeSummaries.length})</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeNarrativeTab === 'overview' && (
              <div className="space-y-4 pt-1">
                
                {/* Situation Overview Box */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2">
                  <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    SITUATIONAL DEBRIEF
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {narrativeBundle.statusOverview}
                  </p>
                </div>

                {/* Latest Comms Wiretap Snippet */}
                {narrativeBundle.radioComms.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-[#060a12] border border-cyan-900/40 font-mono text-xs space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-cyan-400">
                      <span className="flex items-center gap-1.5">
                        <Radio className="w-3 h-3 animate-pulse" />
                        <span>LATEST TRANSCEIVER DISPATCH</span>
                      </span>
                      <span>{narrativeBundle.radioComms[narrativeBundle.radioComms.length - 1].timestamp}</span>
                    </div>
                    <div className="text-slate-300">
                      <strong className="text-cyan-300">
                        {narrativeBundle.radioComms[narrativeBundle.radioComms.length - 1].callsign}:
                      </strong>{' '}
                      &quot;{narrativeBundle.radioComms[narrativeBundle.radioComms.length - 1].message}&quot;
                    </div>
                  </div>
                )}

                {/* Key Observations List */}
                <div className="space-y-2">
                  <div className="text-xs font-mono font-bold text-slate-300 uppercase">
                    Key Tactical Intelligence Observations:
                  </div>
                  <div className="space-y-1.5">
                    {narrativeBundle.tacticalAAR.keyObservations.map((obs, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-400 font-sans">
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{obs}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategic Directive Next Action */}
                <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-start gap-3">
                  <Compass className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-bold text-blue-200 uppercase font-mono text-[10px]">
                      Immediate Strategic Vector
                    </div>
                    <div className="text-slate-300 font-sans mt-0.5">
                      {narrativeBundle.tacticalAAR.nextStrategicAction}
                    </div>
                  </div>
                </div>

                {/* Tactical Field Narrative Summaries section */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquarePlus className="w-4 h-4 text-cyan-400" />
                      <div className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                        Tactical Narrative Summaries ({customNarrativeSummaries.length})
                      </div>
                    </div>
                    <button
                      type="button"
                      id="log-summary-overview-btn"
                      onClick={() => {
                        sound.playClick();
                        setIsAddNarrativeModalOpen(true);
                      }}
                      className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-300 text-[10px] font-mono flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Log Entry</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {customNarrativeSummaries.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg bg-[#060a12] border border-slate-800/90 text-xs space-y-1 font-mono"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span className="font-bold text-cyan-300">{item.title}</span>
                          <span>{item.timestamp}</span>
                        </div>
                        <p className="text-slate-300 font-sans text-xs leading-relaxed">
                          {item.content}
                        </p>
                        <div className="flex items-center gap-2 text-[9px] text-slate-500">
                          <span>By: {item.author}</span>
                          <span>•</span>
                          <span className="uppercase text-cyan-400">{item.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: RADIO COMMS */}
            {activeNarrativeTab === 'comms' && (
              <div className="space-y-4 pt-1 font-mono text-xs">
                
                {/* Audio Simulator Player Bar */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      id="toggle-comms-audio-btn"
                      onClick={togglePlayComms}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                        isPlayingCommsAudio
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black'
                      }`}
                      title={isPlayingCommsAudio ? 'Stop Radio Sim' : 'Play Radio Wiretap'}
                    >
                      {isPlayingCommsAudio ? <VolumeX className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <div>
                      <div className="text-xs font-bold text-white">
                        {isPlayingCommsAudio ? 'Transmitting Audio Wiretap...' : 'Aria Pulse Wireless Intercept'}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isPlayingCommsAudio
                          ? `Playing segment ${currentAudioIndex + 1} of ${narrativeBundle.radioComms.length}`
                          : 'Click to simulate procedural radio transmission'}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/60 px-2 py-1 rounded border border-cyan-500/30">
                    432.8 MHz
                  </span>
                </div>

                {/* Comms Messages Stack */}
                <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {narrativeBundle.radioComms.map((comm, idx) => {
                    const isSystem = comm.type === 'system';
                    const isIncoming = comm.type === 'incoming';
                    const isCurrent = isPlayingCommsAudio && idx === currentAudioIndex;

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400 shadow-md shadow-cyan-950/40'
                            : isSystem
                            ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                            : isIncoming
                            ? 'bg-slate-950/80 border-slate-800 text-slate-200'
                            : 'bg-blue-950/30 border-blue-900/50 text-slate-200 ml-4'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1 mb-1 border-b border-slate-800/60">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className={isIncoming ? 'text-cyan-400' : 'text-blue-400'}>
                              [{comm.callsign}]
                            </span>
                            <span className="text-white">{comm.speaker}</span>
                          </div>
                          <span>{comm.timestamp}</span>
                        </div>
                        <p className="text-xs font-sans leading-relaxed text-slate-300">
                          &quot;{comm.message}&quot;
                        </p>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* TAB 3: CHRONICLE LORE PROSE */}
            {activeNarrativeTab === 'chronicle' && (
              <div className="space-y-4 pt-1 font-serif text-sm leading-relaxed text-slate-200">
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 space-y-3 shadow-inner">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-400 not-italic">
                    <FileText className="w-3.5 h-3.5" />
                    <span>The Stamford Reconstruction Chronicles • Volume I</span>
                  </div>

                  {narrativeBundle.chronicleProse.map((paragraph, idx) => (
                    <p key={idx} className="first-letter:text-2xl first-letter:font-bold first-letter:text-cyan-400 first-letter:mr-1">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: TACTICAL AAR */}
            {activeNarrativeTab === 'aar' && (
              <div className="space-y-3 pt-1 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase">Clearance Protocol</div>
                      <div className="text-xs font-bold text-cyan-300">
                        {narrativeBundle.tacticalAAR.clearanceCode}
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded bg-rose-950/60 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                      {narrativeBundle.tacticalAAR.threatLevel}
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Status Summary</div>
                    <div className="text-xs font-bold text-white mt-0.5">
                      {narrativeBundle.tacticalAAR.statusSummary}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Directive Assessment</div>
                    <p className="text-xs text-slate-300 font-sans mt-0.5 leading-relaxed">
                      {narrativeBundle.tacticalAAR.directiveAssessment}
                    </p>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Recommended Next Vector</div>
                    <p className="text-xs text-blue-300 font-sans mt-0.5 leading-relaxed">
                      {narrativeBundle.tacticalAAR.nextStrategicAction}
                    </p>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 5: QUANTUM TELEMETRY */}
            {activeNarrativeTab === 'telemetry' && (
              <div className="space-y-3 pt-1 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Carrier Frequency</div>
                    <div className="text-sm font-bold text-cyan-400 mt-1">
                      {narrativeBundle.quantumTelemetry.carrierFrequency}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Resonance Harmonic</div>
                    <div className="text-sm font-bold text-emerald-400 mt-1">
                      {narrativeBundle.quantumTelemetry.resonanceHarmonic}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Packet Integrity</div>
                    <div className="text-sm font-bold text-white mt-1">
                      {narrativeBundle.quantumTelemetry.packetIntegrity}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Encryption Protocol</div>
                    <div className="text-sm font-bold text-slate-300 mt-1 truncate">
                      {narrativeBundle.quantumTelemetry.encryptionProtocol}
                    </div>
                  </div>

                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Raw Telemetry Hex Signature</div>
                  <div className="text-xs text-cyan-300 font-mono mt-1 break-all bg-black/40 p-2 rounded border border-slate-800">
                    {narrativeBundle.quantumTelemetry.rawTelemetryHex}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: CUSTOM FIELD NARRATIVE DEBRIEFS */}
            {activeNarrativeTab === 'field_logs' && (
              <div className="space-y-4 pt-1 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="text-slate-400">
                    Recorded <span className="text-cyan-400 font-bold">{customNarrativeSummaries.length}</span> tactical field narrative summaries
                  </div>
                  <button
                    type="button"
                    id="add-narrative-tab-btn"
                    onClick={() => {
                      sound.playClick();
                      setIsAddNarrativeModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Log Narrative Summary</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {customNarrativeSummaries.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-colors space-y-2 font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            {item.category}
                          </span>
                          <span className="text-sm font-bold text-white font-sans">
                            {item.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                      </div>

                      <p className="text-slate-300 font-sans text-xs leading-relaxed">
                        {item.content}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-[10px] text-slate-500">
                        <span>Operative: <strong className="text-slate-300">{item.author}</strong></span>
                        <span className="text-cyan-400/80">HASH: 0x{item.id.replace(/[^a-f0-9]/gi, '').slice(0, 6)}</span>
                      </div>
                    </div>
                  ))}

                  {customNarrativeSummaries.length === 0 && (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      No tactical narrative summaries logged yet. Click &quot;+ Log Narrative Summary&quot; to file an entry.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* =========================================================
            RIGHT COLUMN (5 cols): COMPLETED MISSION MILESTONES WITH TIMESTAMPS
           ========================================================= */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-2xl bg-[#090d16] border border-cyan-500/20 p-5 shadow-xl space-y-4">
            
            {/* Header & Milestone Filter */}
            <div className="space-y-3 pb-3 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-sm font-black text-white uppercase tracking-wider">
                    Mission Milestones
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="add-milestone-open-modal-btn"
                    onClick={() => {
                      sound.playClick();
                      setIsAddMilestoneModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-200 hover:text-white text-xs font-mono font-bold flex items-center gap-1 transition-all shadow-sm"
                    title="Add a new milestone (plays audio ding sound effect)"
                  >
                    <Plus className="w-3 h-3 text-emerald-400" />
                    <span>+ Add Milestone</span>
                  </button>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {completedCount}/{totalCount} Cleared
                  </span>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-1 text-[11px] font-mono">
                <button
                  onClick={() => setMilestoneFilter('all')}
                  className={`px-2.5 py-1 rounded-lg border transition-colors ${
                    milestoneFilter === 'all'
                      ? 'bg-cyan-600 text-white border-cyan-500 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  All ({totalCount})
                </button>
                <button
                  onClick={() => setMilestoneFilter('completed')}
                  className={`px-2.5 py-1 rounded-lg border transition-colors ${
                    milestoneFilter === 'completed'
                      ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Cleared ({completedCount})
                </button>
                <button
                  onClick={() => setMilestoneFilter('active')}
                  className={`px-2.5 py-1 rounded-lg border transition-colors ${
                    milestoneFilter === 'active'
                      ? 'bg-blue-600 text-white border-blue-500 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Active ({isComplete ? 0 : 1})
                </button>
                <button
                  onClick={() => setMilestoneFilter('pending')}
                  className={`px-2.5 py-1 rounded-lg border transition-colors ${
                    milestoneFilter === 'pending'
                      ? 'bg-slate-700 text-white border-slate-600 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  Pending ({Math.max(0, totalCount - completedCount - (isComplete ? 0 : 1))})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter milestones by description or zone..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Milestones Sequential Timeline */}
            <div className="space-y-3 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
              
              {filteredObjectives.map((obj, idx) => {
                const isCurrent = idx === mission.currentObjectiveIndex && !obj.isCompleted && mission.status !== 'Complete';
                const isExpanded = expandedMilestoneId === obj.id;

                return (
                  <div
                    key={obj.id}
                    id={`milestone-card-${obj.stepNumber}`}
                    className={`relative pl-8 transition-all ${
                      obj.isCompleted ? 'opacity-100' : isCurrent ? 'opacity-100' : 'opacity-70'
                    }`}
                  >
                    {/* Circle Node on Rail */}
                    <div
                      className={`absolute left-2.5 -translate-x-1/2 top-3 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all ${
                        obj.isCompleted
                          ? 'bg-emerald-500 border-emerald-400 text-black shadow-sm shadow-emerald-500/50'
                          : isCurrent
                          ? 'bg-blue-600 border-cyan-300 text-white animate-pulse shadow-md shadow-blue-500/50'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      {obj.isCompleted ? '✓' : obj.stepNumber}
                    </div>

                    {/* Milestone Card */}
                    <div
                      onClick={() => {
                        sound.playClick();
                        setExpandedMilestoneId(isExpanded ? null : obj.id);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        obj.isCompleted
                          ? 'bg-[#0a111a] border-emerald-500/30 hover:border-emerald-500/60'
                          : isCurrent
                          ? 'bg-[#0a1220] border-cyan-500/60 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/40'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Top Row: Milestone Step Number & Status Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400">
                          MILESTONE 0{obj.stepNumber}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                            obj.isCompleted
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : isCurrent
                              ? 'bg-blue-950 text-blue-300 border border-blue-500/50 animate-pulse'
                              : 'bg-slate-900 text-slate-500 border border-slate-800'
                          }`}
                        >
                          {obj.isCompleted ? 'CLEARED' : isCurrent ? 'IN PROGRESS' : 'PENDING'}
                        </span>
                      </div>

                      {/* Objective Description */}
                      <h3 className="text-xs font-bold text-white mt-1 leading-snug">
                        {obj.description}
                      </h3>

                      {/* Timestamp Row (The Core Requirement) */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 pt-2 border-t border-slate-800/80 font-mono text-[10px]">
                        
                        {/* Formatted Date & Time */}
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Clock className={`w-3 h-3 ${obj.isCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
                          <span className={obj.isCompleted ? 'text-slate-200' : 'text-slate-500'}>
                            {obj.completedTimeString || (isCurrent ? 'Active Now' : 'Pending Milestone')}
                          </span>
                        </div>

                        {/* Split Duration */}
                        {obj.durationSecondsToComplete && (
                          <span className="text-cyan-400 bg-cyan-950/60 px-1.5 py-0.2 rounded border border-cyan-500/30">
                            +{obj.durationSecondsToComplete}s split
                          </span>
                        )}

                        {/* Target Zone */}
                        {obj.targetZone && (
                          <div className="flex items-center gap-1 text-slate-400 truncate max-w-[140px]">
                            <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate">{obj.targetZone}</span>
                          </div>
                        )}
                      </div>

                      {/* Expandable Details Area */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2.5 font-sans animate-in fade-in">
                          
                          {/* Target Coordinates */}
                          {obj.targetCoordinates && (
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800">
                              <span>Target Coordinates:</span>
                              <span className="text-cyan-300 font-bold">
                                [{obj.targetCoordinates.x}, {obj.targetCoordinates.y}]
                              </span>
                            </div>
                          )}

                          {/* Rewards Unlocked */}
                          {obj.rewards && obj.rewards.length > 0 && (
                            <div className="space-y-1">
                              <div className="text-[10px] font-mono text-slate-400 uppercase">
                                Milestone Rewards:
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {obj.rewards.map((r, rIdx) => (
                                  <span
                                    key={rIdx}
                                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/60 text-amber-300 border border-amber-500/30 flex items-center gap-1"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    <span>{r.name}</span>
                                    {r.amount && <strong className="text-white">+{r.amount}</strong>}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Telemetry signature */}
                          <div className="text-[9px] font-mono text-slate-500 truncate">
                            SEC7-MILESTONE-VERIFY: 0x{obj.id.replace(/[^a-f0-9]/gi, '')}9B4A
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                );
              })}

              {filteredObjectives.length === 0 && (
                <div className="py-8 text-center text-xs font-mono text-slate-500">
                  No milestones match &quot;{searchQuery}&quot;
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* =========================================================
          MODAL: ADD NEW MILESTONE TO MISSION DIRECTIVE
         ========================================================= */}
      {isAddMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0a0f1d] border border-cyan-500/40 p-6 shadow-2xl shadow-cyan-950/50 space-y-5 font-mono">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-sans">
                  Log New Mission Milestone
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddMilestoneModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Define a new tactical milestone for this directive. Adding it to the log will automatically trigger the dynamic subtle bell &apos;ding&apos; audio cue.
            </p>

            <form onSubmit={handleAddNewMilestone} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Milestone Directive Description <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newMilestoneDesc}
                  onChange={(e) => setNewMilestoneDesc(e.target.value)}
                  placeholder="e.g., Scan high-frequency transmitter at Mill River substation"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    Target Stamford Zone
                  </label>
                  <select
                    value={newMilestoneZone}
                    onChange={(e) => setNewMilestoneZone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Stamford Sector 7">Stamford Sector 7</option>
                    <option value="Washington Boulevard Transit">Washington Boulevard Transit</option>
                    <option value="Harbor Point Pier">Harbor Point Pier</option>
                    <option value="Downtown Station Plaza">Downtown Station Plaza</option>
                    <option value="Mill River Greenway">Mill River Greenway</option>
                    <option value="Onegodia Gateway Hub">Onegodia Gateway Hub</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    Reward Bounty (Credits)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    step="5"
                    value={newMilestoneCredits}
                    onChange={(e) => setNewMilestoneCredits(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2 text-cyan-300 text-[11px]">
                <Bell className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                <span>Audio Trigger: Submitting will play the subtle chime feedback</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMilestoneModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-950"
                >
                  <Plus className="w-4 h-4" />
                  <span>Commit Milestone (Chime 🔔)</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* =========================================================
          MODAL: ADD NEW NARRATIVE SUMMARY TO LOG ARCHIVE
         ========================================================= */}
      {isAddNarrativeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#0a0f1d] border border-cyan-500/40 p-6 shadow-2xl shadow-cyan-950/50 space-y-5 font-mono">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-sans">
                  Log Tactical Narrative Summary
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddNarrativeModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              File a situational debrief or operative observation into the directive archive. Committing the summary will automatically trigger the dynamic subtle bell &apos;ding&apos; sound effect.
            </p>

            <form onSubmit={handleAddNewNarrativeSummary} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Summary Headline / Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newNarrativeTitle}
                  onChange={(e) => setNewNarrativeTitle(e.target.value)}
                  placeholder="e.g., Sub-aqueduct Quantum Conduit Resonance"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    Operative Callsign
                  </label>
                  <input
                    type="text"
                    value={newNarrativeAuthor}
                    onChange={(e) => setNewNarrativeAuthor(e.target.value)}
                    placeholder="Field Operative"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    Category
                  </label>
                  <select
                    value={newNarrativeCategory}
                    onChange={(e) => setNewNarrativeCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="debrief">Field Debrief</option>
                    <option value="intel">Tactical Intel</option>
                    <option value="chronicle">Chronicle Lore</option>
                    <option value="transmission">Radio Transmission</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Narrative Prose / Observation Content <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={newNarrativeContent}
                  onChange={(e) => setNewNarrativeContent(e.target.value)}
                  placeholder="Record your field observations, harmonic resonance readings, or directive outcome analysis..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2 text-cyan-300 text-[11px]">
                <Bell className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
                <span>Audio Trigger: Submitting will play the subtle chime feedback</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddNarrativeModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-950"
                >
                  <Send className="w-4 h-4" />
                  <span>Archive Narrative Entry (Chime 🔔)</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
