import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Crosshair, 
  Compass, 
  MapPin, 
  Map as MapIcon,
  Radio, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Navigation, 
  Maximize2,
  Minimize2,
  Gamepad2,
  Sparkles,
  Car,
  Clock,
  Pin,
  CheckCircle2,
  Layers,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Eye,
  AlertTriangle,
  ShieldAlert,
  Sliders,
  RotateCcw,
  Footprints,
  EyeOff,
  Flame,
  Volume2,
  Play,
  Check,
  Timer,
  Save,
  Trophy
} from 'lucide-react';
import { PlayerProgress, Mission, NavigationTab, PlayerState } from '../types';
import { sound } from '../services/audioService';
import { saveMissionHistoryEntry } from '../services/historyService';
import { 
  SentinelDrone, 
  INITIAL_SENTINEL_DRONES, 
  SentinelDroneData, 
  updateDroneAI, 
  checkPointInVisionCone 
} from '../components/DronePatrol';

interface TacticalHUDViewProps {
  progress: PlayerProgress;
  setProgress: React.Dispatch<React.SetStateAction<PlayerProgress>>;
  mission: Mission;
  setMission?: React.Dispatch<React.SetStateAction<Mission>>;
  setActiveTab: (tab: NavigationTab) => void;
}

export const TacticalHUDView: React.FC<TacticalHUDViewProps> = ({
  progress,
  setProgress,
  mission,
  setMission,
  setActiveTab
}) => {
  const [sweepActive, setSweepActive] = useState<boolean>(true);
  const [sweepAngle, setSweepAngle] = useState<number>(0);
  const [activeZone, setActiveZone] = useState<string>('Sector 7 Metro Core');
  const [playerCoords, setPlayerCoords] = useState<{ x: number; y: number }>({ x: 240, y: 400 });
  const [simulatedState, setSimulatedState] = useState<PlayerState>('Idle');
  const [filterLayer, setFilterLayer] = useState<'all' | 'poi' | 'missions' | 'hazard'>('all');
  const [elapsedDuration, setElapsedDuration] = useState<number>(0);

  // Sentinel Drone AI State
  const [drones, setDrones] = useState<SentinelDroneData[]>(() => INITIAL_SENTINEL_DRONES);
  const [showPatrolRoutes, setShowPatrolRoutes] = useState<boolean>(true);
  const [showVisionCones, setShowVisionCones] = useState<boolean>(true);
  const [droneSpeedMult, setDroneSpeedMult] = useState<number>(1);
  const [hazardCountdown, setHazardCountdown] = useState<number>(5.0);
  const [activeLockDrone, setActiveLockDrone] = useState<SentinelDroneData | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const lastAlertSoundTime = useRef<number>(0);

  // Real-time Mission Duration Timer Engine
  // Starts when status === 'Active' and persists final duration upon 'Complete'
  useEffect(() => {
    const now = Date.now();
    let startTime = mission.startedAt;

    // If mission is Active but startedAt wasn't initialized yet, establish it and save
    if (!startTime && mission.status === 'Active') {
      startTime = now;
      if (setMission) {
        setMission(prev => {
          const updated: Mission = { ...prev, startedAt: now };
          try {
            localStorage.setItem('onegodia_mission_001_v1', JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      }
    }

    // If mission is complete and duration is saved, display the recorded final duration
    if (mission.status === 'Complete' && mission.durationSeconds !== undefined) {
      setElapsedDuration(mission.durationSeconds);
      return;
    }

    // Active Mission ticking loop
    if (mission.status === 'Active' && startTime) {
      const updateTimer = () => {
        const secs = Math.max(0, Math.floor((Date.now() - startTime!) / 1000));
        setElapsedDuration(secs);
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    } else {
      setElapsedDuration(mission.durationSeconds || 0);
    }
  }, [mission.startedAt, mission.status, mission.durationSeconds, setMission]);

  // Format seconds to mm:ss (or hh:mm:ss if > 3600)
  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to persist mission changes to state and localStorage
  const persistMissionState = (updated: Mission) => {
    if (setMission) {
      setMission(updated);
    }
    try {
      localStorage.setItem('onegodia_mission_001_v1', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to persist mission to localStorage:', e);
    }
  };

  // Trigger Start / Accept Mission from HUD
  const handleStartMissionHUD = () => {
    sound.playRadarScan();
    const now = Date.now();
    const updated: Mission = {
      ...mission,
      status: 'Active',
      startedAt: now,
      completedAt: undefined,
      durationSeconds: undefined,
      currentObjectiveIndex: 1,
      objectives: mission.objectives.map((obj, i) => i === 0 ? { ...obj, isCompleted: true } : obj)
    };
    persistMissionState(updated);
    setProgress(prev => ({ ...prev, activeMissionId: updated.id }));
    setSaveToast('Mission 001 Activated • Duration Timer Running');
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Trigger Complete Mission from HUD (Saves final duration data to state and localStorage)
  const handleCompleteMissionHUD = () => {
    sound.playMissionComplete();
    const now = Date.now();
    const startTime = mission.startedAt || (now - (elapsedDuration > 0 ? elapsedDuration * 1000 : 75000));
    const finalDurationSecs = Math.max(1, Math.floor((now - startTime) / 1000));

    const updated: Mission = {
      ...mission,
      status: 'Complete',
      completedAt: now,
      durationSeconds: finalDurationSecs,
      currentObjectiveIndex: mission.objectives.length - 1,
      objectives: mission.objectives.map(o => ({ ...o, isCompleted: true }))
    };

    // Save to state and localStorage
    persistMissionState(updated);
    setElapsedDuration(finalDurationSecs);

    // Save entry to verified history log
    saveMissionHistoryEntry(updated, finalDurationSecs);

    // Update Player Progress (+250 Credits, Data Fragment #001)
    setProgress(prev => {
      const hasItem = prev.inventory.some(i => i.name === 'Onegodia Data Fragment #001');
      const updatedInv = hasItem ? prev.inventory : [
        ...prev.inventory,
        {
          id: 'item-frag-001',
          name: 'Onegodia Data Fragment #001',
          type: 'Prototype Digital Collectible',
          rarity: 'Foundational' as const,
          status: 'Simulated / Off-chain',
          description: 'A crystallized holographic fragment containing the raw digital frequency needed to rebuild Sector 7 grid.',
          acquiredDate: 'Mission 001 Reward',
          iconName: 'Sparkles',
          metadata: {
            'Signal Stability': '100% Calibrated',
            'Sector': 'Sector 7 Outpost',
            'Verification': 'Aria Pulse Verified'
          }
        }
      ];

      return {
        ...prev,
        credits: prev.credits + 250,
        missionsCompleted: prev.missionsCompleted.includes('MISSION_001_REBUILDING_SIGNAL') 
          ? prev.missionsCompleted 
          : [...prev.missionsCompleted, 'MISSION_001_REBUILDING_SIGNAL'],
        collectedFragments: prev.collectedFragments.includes('FRAG_001')
          ? prev.collectedFragments
          : [...prev.collectedFragments, 'FRAG_001'],
        inventory: updatedInv
      };
    });

    setSaveToast(`Mission 001 Finalized • Recorded Duration: ${formatTimer(finalDurationSecs)} saved to localStorage`);
    setTimeout(() => setSaveToast(null), 4000);
  };

  // Reset Mission & Timer
  const handleResetMissionHUD = () => {
    sound.playClick();
    const updated: Mission = {
      ...mission,
      status: 'Available',
      startedAt: undefined,
      completedAt: undefined,
      durationSeconds: undefined,
      currentObjectiveIndex: 0,
      objectives: mission.objectives.map(o => ({ ...o, isCompleted: false }))
    };
    persistMissionState(updated);
    setElapsedDuration(0);
    setSaveToast('Mission 001 & Duration Timer Reset to Available');
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Pinned objectives quick access list
  const pinnedObjectives = useMemo(() => {
    return mission.objectives.filter(obj => obj.isPinnedToHUD);
  }, [mission.objectives]);

  // Rotate radar sweep
  useEffect(() => {
    if (!sweepActive) return;
    const interval = setInterval(() => {
      setSweepAngle(prev => (prev + 3) % 360);
    }, 25);
    return () => clearInterval(interval);
  }, [sweepActive]);

  // AI Movement Loop for Sentinel Drones
  useEffect(() => {
    if (!sweepActive) return;

    const interval = setInterval(() => {
      setDrones(prevDrones => {
        return prevDrones.map(drone => updateDroneAI(drone, playerCoords, droneSpeedMult));
      });
    }, 40);

    return () => clearInterval(interval);
  }, [sweepActive, playerCoords, droneSpeedMult]);

  // Check Sentinel Drone Vision Cones & Manage Hazard Alert Timer
  useEffect(() => {
    let detectedDrone: SentinelDroneData | null = null;

    for (const drone of drones) {
      const detection = checkPointInVisionCone(playerCoords, drone);
      if (detection.isDetected) {
        detectedDrone = drone;
        break;
      }
    }

    setActiveLockDrone(detectedDrone);

    if (detectedDrone) {
      // Play hazard alert siren if not played recently
      const now = Date.now();
      if (now - lastAlertSoundTime.current > 1200) {
        sound.playHazardAlert();
        lastAlertSoundTime.current = now;
      }
    } else {
      // Player is safe - restore countdown timer
      setHazardCountdown(5.0);
    }
  }, [drones, playerCoords]);

  // Hazard Alert Countdown Timer Ticking Loop
  useEffect(() => {
    if (!activeLockDrone) return;

    const tickInterval = setInterval(() => {
      setHazardCountdown(prev => {
        const next = Math.max(0, Math.round((prev - 0.1) * 10) / 10);

        if (next <= 0) {
          // FORCED MISSION RESET TRIGGER
          executeMissionReset();
          return 5.0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(tickInterval);
  }, [activeLockDrone]);

  // Forced Mission Reset handler when caught in vision cone
  const executeMissionReset = () => {
    sound.playMissionReset();
    
    // Warp player back to Safe Hub Plaza
    setPlayerCoords({ x: 240, y: 400 });
    setActiveZone('Onegodia Hub Plaza');
    setActiveLockDrone(null);
    setHazardCountdown(5.0);

    // Reset mission active step / rollback
    if (setMission) {
      const updated: Mission = {
        ...mission,
        currentObjectiveIndex: 0,
        status: 'Available',
        startedAt: undefined,
        durationSeconds: undefined,
        objectives: mission.objectives.map((obj) => ({
          ...obj,
          isCompleted: false
        }))
      };
      persistMissionState(updated);
      setElapsedDuration(0);
    }

    // Display Reset Alert Notification
    setResetMessage(
      'ALERT: Sentinel Drone Vision Cone Lock-on triggered emergency grid extraction! Operative signature was compromised. Mission reset back to Phase 1 (Speak to Aria Pulse at Safe Hub Plaza).'
    );
  };

  const sectors = [
    {
      id: 'sec-hub',
      name: 'Onegodia Hub Plaza',
      code: 'ZONE-01',
      coords: { x: 240, y: 400 },
      type: 'Safe District / Spawn Core',
      status: 'Active / Calibrated',
      color: '#06b6d4'
    },
    {
      id: 'sec-garage',
      name: 'Vehicle Bay & Transit Highway',
      code: 'ZONE-02',
      coords: { x: 340, y: 350 },
      type: 'Traversal Corridor',
      status: 'Cyber-Cruiser Ready',
      color: '#0d9488'
    },
    {
      id: 'sec-outpost',
      name: 'Sector 7 Digital Node #001',
      code: 'ZONE-03',
      coords: { x: 920, y: 260 },
      type: 'Corrupted Signal Outpost (Sentinel Patrols Active)',
      status: mission.status === 'Complete' ? 'Signal Purified' : 'Sentinel Grid Active',
      color: mission.status === 'Complete' ? '#10b981' : '#f43f5e'
    },
    {
      id: 'sec-submerged',
      name: 'Oceanic Submerged Gateway',
      code: 'ZONE-04',
      coords: { x: 1080, y: 650 },
      type: 'Underwater Realm Perimeter',
      status: 'Roadmap Locked (Phase 3)',
      color: '#6366f1'
    }
  ];

  const handleNudgeOperative = (direction: 'up' | 'down' | 'left' | 'right', amount = 40) => {
    sound.playClick();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(10); } catch { /* ignore */ }
    }
    setPlayerCoords(prev => {
      let nx = prev.x;
      let ny = prev.y;
      if (direction === 'up') ny = Math.max(50, ny - amount);
      if (direction === 'down') ny = Math.min(750, ny + amount);
      if (direction === 'left') nx = Math.max(50, nx - amount);
      if (direction === 'right') nx = Math.min(1150, nx + amount);
      return { x: nx, y: ny };
    });
    if (resetMessage) setResetMessage(null);
  };

  const handleWarp = (sector: typeof sectors[0]) => {
    sound.playWarp();
    setPlayerCoords(sector.coords);
    setActiveZone(sector.name);
    setProgress(prev => ({ ...prev, lastWarpLocation: sector.name }));
    if (resetMessage) setResetMessage(null);
  };

  const handleToggleSweep = () => {
    sound.playClick();
    setSweepActive(!sweepActive);
  };

  const handleSimulateEncounter = () => {
    sound.playWarp();
    // Place player near Sector 7 Sentinel Alpha patrol route
    setPlayerCoords({ x: 860, y: 240 });
    setActiveZone('Sector 7 Digital Node #001');
  };

  const handleResetDrones = () => {
    sound.playClick();
    setDrones(INITIAL_SENTINEL_DRONES);
    setActiveLockDrone(null);
    setHazardCountdown(5.0);
  };

  return (
    <div className="space-y-4 py-2 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
            <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">
              TACTICAL HUD & SENTINEL DRONE PATROL MATRIX
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Onegodia Sector 7 Tactical Radar & Drone Avoidance HUD
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Real-time AI path-finding visualization, Sentinel vision cones, and live Mission Duration persistence engine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mission Duration Live Telemetry Chip */}
          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 font-mono text-xs shadow-inner transition-colors ${
            mission.status === 'Active' 
              ? 'bg-amber-950/40 border-amber-500/60 text-amber-300' 
              : mission.status === 'Complete'
              ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
              : 'bg-[#11131a] border-[#1e2230] text-slate-300'
          }`}>
            <Clock className={`w-3.5 h-3.5 ${
              mission.status === 'Active' ? 'text-amber-400 animate-pulse' : mission.status === 'Complete' ? 'text-emerald-400' : 'text-blue-400'
            }`} />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                {mission.status === 'Complete' ? 'Record Time:' : mission.status === 'Active' ? 'Live Duration:' : 'Mission Time:'}
              </span>
              <span className={`font-bold tracking-wider ${
                mission.status === 'Complete' ? 'text-emerald-300' : mission.status === 'Active' ? 'text-amber-300' : 'text-slate-300'
              }`}>
                {formatTimer(elapsedDuration)}
              </span>
            </div>
            {mission.status === 'Active' && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            )}
            {mission.status === 'Complete' && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </div>

          <button
            id="toggle-radar-sweep-btn"
            onClick={handleToggleSweep}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              sweepActive
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/50'
                : 'bg-[#11131a] text-slate-400 border border-[#1e2230]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Radar: {sweepActive ? 'RUNNING' : 'PAUSED'}</span>
          </button>

          <button
            id="open-map-from-hud-btn"
            onClick={() => {
              sound.playClick();
              setActiveTab('map');
            }}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Full World Map</span>
          </button>

          <button
            id="launch-game-from-hud-btn"
            onClick={() => {
              sound.playClick();
              setActiveTab('prototype');
            }}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Launch Canvas</span>
          </button>
        </div>
      </div>

      {/* PERSISTENCE TOAST NOTIFICATION */}
      {saveToast && (
        <div className="p-3 rounded-xl bg-cyan-950/90 border border-cyan-500 text-cyan-200 font-mono text-xs flex items-center justify-between gap-2 shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-cyan-400 shrink-0 animate-pulse" />
            <span>{saveToast}</span>
          </div>
          <span className="text-[10px] bg-cyan-900/60 px-2 py-0.5 rounded text-cyan-300 border border-cyan-700/50">
            localStorage Synced
          </span>
        </div>
      )}

      {/* DEDICATED HAZARD ALERT TIMER BANNER (ACTIVE WHEN DETECTED) */}
      {activeLockDrone && (
        <div className="p-4 rounded-xl bg-red-950/90 border-2 border-red-500 shadow-2xl shadow-red-950/80 animate-pulse text-white space-y-3 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-500/50 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 border border-red-300 flex items-center justify-center text-white shrink-0 animate-bounce">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-red-100 tracking-wider">
                    HAZARD ALERT: SENTINEL VISION CONE LOCK-ON
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-red-800 text-red-100 border border-red-400 font-bold animate-ping">
                    CRITICAL
                  </span>
                </div>
                <p className="text-xs text-red-200 font-sans">
                  Player signature detected inside {activeLockDrone.name} tracking radius! Evade immediately.
                </p>
              </div>
            </div>

            {/* Countdown Clock Display */}
            <div className="flex items-center gap-3 bg-red-900/80 px-3.5 py-1.5 rounded-lg border border-red-400 self-start sm:self-auto">
              <span className="text-xs text-red-300 uppercase font-semibold">Emergency Extraction In:</span>
              <span className="text-xl font-bold text-white font-mono tracking-widest animate-pulse">
                {hazardCountdown.toFixed(1)}s
              </span>
            </div>
          </div>

          {/* Hazard Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-red-200">
              <span>Lock-on Progress / Extraction Threshold</span>
              <span>{Math.round((1 - hazardCountdown / 5) * 100)}% Locked</span>
            </div>
            <div className="w-full h-2.5 bg-red-950 rounded-full overflow-hidden border border-red-500/60">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 via-red-500 to-rose-600 transition-all duration-100"
                style={{ width: `${(1 - hazardCountdown / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Evasion Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-2 text-red-200">
              <AlertTriangle className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="font-sans text-[11px]">
                Tactical Rule: Move away from the red vision cone, or warp to a Safe Hub District to break line-of-sight.
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleWarp(sectors[0])}
              className="px-3 py-1.5 rounded bg-white text-red-950 font-bold hover:bg-slate-200 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Emergency Warp to Safe Hub</span>
            </button>
          </div>
        </div>
      )}

      {/* MISSION RESET NOTIFICATION MODAL BANNER */}
      {resetMessage && (
        <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/70 text-amber-200 font-mono text-xs flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="font-sans text-xs text-slate-100">{resetMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => setResetMessage(null)}
            className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 text-xs shrink-0 font-mono"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Main HUD Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Large Radar Map Canvas with Drone Overlays (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          
          <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#050608] rounded-xl border border-cyan-900 shadow-[0_0_30px_rgba(0,255,255,0.15)] p-4 overflow-hidden flex items-center justify-center">
            
            {/* Tactical Grid Background & Scanlines */}
            <div className="absolute inset-0 gamer-grid opacity-40 z-0 pointer-events-none"></div>
            <div className="scanline-overlay"></div>

            {/* Concentric Coordinate Rings */}
            <div className="relative w-full h-full max-w-[460px] max-h-[460px] rounded-full border border-cyan-500/30 flex items-center justify-center z-10 shadow-[inset_0_0_50px_rgba(0,255,255,0.1)]">
              <div className="w-3/4 h-3/4 rounded-full border border-cyan-500/40 flex items-center justify-center">
                <div className="w-1/2 h-1/2 rounded-full border border-cyan-500/50 flex items-center justify-center">
                  <div className="w-1/4 h-1/4 rounded-full border border-cyan-500/60 shadow-[0_0_15px_rgba(0,255,255,0.4)]"></div>
                </div>
              </div>

              {/* Radar Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/30 shadow-[0_0_5px_rgba(0,255,255,0.5)]"></div>
              <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/30 shadow-[0_0_5px_rgba(0,255,255,0.5)]"></div>

              {/* Rotating Radar Sweep Cone */}
              {sweepActive && (
                <div 
                  className="absolute inset-0 rounded-full origin-center pointer-events-none"
                  style={{
                    transform: `rotate(${sweepAngle}deg)`,
                    background: 'conic-gradient(from 0deg, rgba(0, 255, 255, 0.4) 0deg, rgba(0, 255, 255, 0.1) 20deg, transparent 60deg)'
                  }}
                ></div>
              )}

              {/* Sector POI Markers on Radar */}
              {sectors.map((sec) => {
                const isObjective = (mission.status === 'Active' && sec.id === 'sec-outpost') || 
                                    (mission.status === 'Available' && sec.id === 'sec-hub') ||
                                    (mission.status === 'Active' && progress.collectedFragments.includes('FRAG_001') && sec.id === 'sec-hub');

                return (
                  <button
                    key={sec.id}
                    id={`radar-poi-${sec.id}`}
                    onClick={() => handleWarp(sec)}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 p-2 focus:outline-none z-20"
                    style={{
                      left: `${(sec.coords.x / 1200) * 100}%`,
                      top: `${(sec.coords.y / 800) * 100}%`,
                    }}
                  >
                    {/* Active Mission Marker Pulsing Beacon Ring */}
                    {isObjective && (
                      <>
                        <div 
                          className="absolute inset-0 m-auto w-7 h-7 rounded-full border-2 border-blue-400 pointer-events-none animate-tactical-marker-ring"
                        ></div>
                        <div 
                          className="absolute inset-0 m-auto w-5 h-5 rounded-full bg-blue-500/20 pointer-events-none animate-tactical-pulse"
                        ></div>
                      </>
                    )}

                    <div 
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shadow-lg transition-transform group-hover:scale-125 ${
                        isObjective ? 'animate-tactical-pulse' : ''
                      }`}
                      style={{
                        backgroundColor: `${sec.color}33`,
                        borderColor: sec.color,
                        boxShadow: isObjective ? `0 0 12px ${sec.color}` : `0 0 10px ${sec.color}66`
                      }}
                    >
                      <span 
                        className={`w-1.5 h-1.5 rounded-full ${isObjective ? 'animate-beacon-dot' : ''}`} 
                        style={{ backgroundColor: sec.color }}
                      ></span>
                    </div>

                    {/* Objective Callout Tooltip / Pin */}
                    <div className={`absolute top-5 left-1/2 -translate-x-1/2 bg-[#0c0e14] border px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap text-slate-200 pointer-events-none transition-opacity z-30 flex items-center gap-1 ${
                      isObjective 
                        ? 'opacity-100 border-blue-500/80 shadow-md shadow-blue-950/60' 
                        : 'opacity-0 group-hover:opacity-100 border-[#1e2230]'
                    }`}>
                      {isObjective && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                      )}
                      <span>{sec.name}</span>
                      {isObjective && (
                        <span className="text-[8px] font-bold text-blue-400 bg-blue-950 px-1 rounded uppercase">
                          Active Obj
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* LIVE SENTINEL DRONES WITH VISION CONES AND PATROL PATHS */}
              {drones.map((drone) => (
                <SentinelDrone
                  key={drone.id}
                  drone={drone}
                  playerPos={playerCoords}
                  showPatrolRoutes={showPatrolRoutes}
                  showVisionCones={showVisionCones}
                  worldWidth={1200}
                  worldHeight={800}
                />
              ))}

              {/* Live Player Position Marker */}
              <div 
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30"
                style={{
                  left: `${(playerCoords.x / 1200) * 100}%`,
                  top: `${(playerCoords.y / 800) * 100}%`,
                }}
              >
                <div className="w-5 h-5 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center animate-ping"></div>
                <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-amber-400 shadow-lg shadow-amber-400/90"></div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-amber-950/90 text-amber-300 border border-amber-500/50 text-[8px] font-mono whitespace-nowrap">
                  OPERATIVE
                </span>
              </div>

            </div>

            {/* Telemetry Overlay Top-Left */}
            <div className="absolute top-3 left-3 bg-[#0c0e14]/90 border border-[#1e2230] p-2.5 rounded-lg font-mono text-xs text-slate-300 backdrop-blur-sm space-y-0.5 z-20">
              <div className="text-blue-400 font-bold flex items-center gap-1.5 text-[11px]">
                <Crosshair className="w-3.5 h-3.5" />
                <span>RADAR TELEMETRY</span>
              </div>
              <div className="text-[11px]">X: <strong className="text-slate-100">{Math.round(playerCoords.x)}</strong> | Y: <strong className="text-slate-100">{Math.round(playerCoords.y)}</strong></div>
              <div className="text-[11px]">ZONE: <strong className="text-blue-300">{activeZone}</strong></div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-0.5">
                <ShieldAlert className="w-3 h-3 text-red-400" />
                <span>Active Sentinels: <strong className="text-red-300 font-bold">{drones.length}</strong></span>
              </div>
            </div>

            {/* Compass Orientation Indicator */}
            <div className="absolute bottom-3 right-3 bg-[#0c0e14]/90 border border-[#1e2230] p-2 rounded-lg font-mono text-[10px] text-slate-400 flex items-center gap-1.5 z-20">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>GRID: NORTH 000°</span>
            </div>

          </div>

          {/* Sentinel Drone HUD Filter & Simulation Controls */}
          <div className="p-3 rounded-xl bg-[#0c0e14] border border-[#1e2230] flex flex-wrap items-center justify-between gap-2.5 font-mono text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">HUD Drone Controls:</span>
              
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowPatrolRoutes(!showPatrolRoutes);
                }}
                className={`px-2.5 py-1 rounded border text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                  showPatrolRoutes
                    ? 'bg-blue-950/70 border-blue-500/60 text-blue-300'
                    : 'bg-[#11131a] border-[#1e2230] text-slate-500'
                }`}
              >
                <Footprints className="w-3 h-3" />
                <span>Patrol Paths</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowVisionCones(!showVisionCones);
                }}
                className={`px-2.5 py-1 rounded border text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                  showVisionCones
                    ? 'bg-red-950/70 border-red-500/60 text-red-300'
                    : 'bg-[#11131a] border-[#1e2230] text-slate-500'
                }`}
              >
                {showVisionCones ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>Vision Cones</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSimulateEncounter}
                className="px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 transition-colors"
                title="Warp near Sector 7 to test Sentinel detection & avoidance phase"
              >
                <Flame className="w-3 h-3 text-amber-400" />
                <span>Test 'Avoid' Lock-On</span>
              </button>

              <button
                type="button"
                onClick={handleResetDrones}
                className="p-1 rounded bg-[#11131a] hover:bg-[#161922] text-slate-400 hover:text-white border border-[#1e2230] transition-colors"
                title="Reset Sentinel drone circuits"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* MOBILE TACTICAL RADAR NAVIGATOR */}
          <div className="p-3 rounded-xl bg-[#0c0e14] border border-[#1e2230] font-mono text-xs text-slate-300">
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#1e2230]">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>MOBILE RADAR PILOT CONTROLS</span>
              </div>
              <span className="text-[10px] text-slate-500">
                Move Operative on Radar & Evade Vision Cones
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              {/* Touch Nudge D-Pad */}
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-3 gap-1.5 w-36">
                  <div></div>
                  <button
                    type="button"
                    onClick={() => handleNudgeOperative('up')}
                    className="p-2.5 rounded-lg bg-[#11131a] hover:bg-amber-950/60 active:scale-95 border border-[#1e2230] text-amber-300 flex items-center justify-center transition-all"
                    aria-label="Nudge Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <div></div>

                  <button
                    type="button"
                    onClick={() => handleNudgeOperative('left')}
                    className="p-2.5 rounded-lg bg-[#11131a] hover:bg-amber-950/60 active:scale-95 border border-[#1e2230] text-amber-300 flex items-center justify-center transition-all"
                    aria-label="Nudge Left"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center justify-center font-mono text-[9px] text-slate-500">
                    NUDGE
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNudgeOperative('right')}
                    className="p-2.5 rounded-lg bg-[#11131a] hover:bg-amber-950/60 active:scale-95 border border-[#1e2230] text-amber-300 flex items-center justify-center transition-all"
                    aria-label="Nudge Right"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div></div>
                  <button
                    type="button"
                    onClick={() => handleNudgeOperative('down')}
                    className="p-2.5 rounded-lg bg-[#11131a] hover:bg-amber-950/60 active:scale-95 border border-[#1e2230] text-amber-300 flex items-center justify-center transition-all"
                    aria-label="Nudge Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <div></div>
                </div>
              </div>

              {/* Quick Evasive Actions & Spawn Shortcuts */}
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleNudgeOperative('up', 100)}
                    className="p-2 rounded-lg bg-[#11131a] hover:bg-amber-950/40 text-amber-300 border border-[#1e2230] text-[11px] font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Evasive Leap</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playWarp();
                      setPlayerCoords({ x: 240, y: 400 });
                      setActiveZone('Onegodia Hub Plaza');
                    }}
                    className="p-2 rounded-lg bg-[#11131a] hover:bg-cyan-950/40 text-cyan-300 border border-[#1e2230] text-[11px] font-semibold flex items-center justify-center gap-1 active:scale-95 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Safe Hub</span>
                  </button>
                </div>

                <div className="text-[10px] text-slate-400 bg-[#11131a] p-2 rounded-lg border border-[#1e2230]">
                  💡 <strong>Tip for Mobile:</strong> Tap any POI blip on the radar circle to warp directly and test Sentinel detection angles.
                </div>
              </div>
            </div>
          </div>

          {/* REAL-TIME MISSION DURATION & CONTROLS MATRIX */}
          <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-3 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1e2230] pb-2.5">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-xs text-cyan-400 uppercase tracking-wide">
                  Mission 001 Duration Telemetry & State Synchronization
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Current Status:</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                  mission.status === 'Active'
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/50 animate-pulse'
                    : mission.status === 'Complete'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                    : 'bg-blue-950 text-blue-300 border border-blue-500/50'
                }`}>
                  {mission.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Duration Live Stopwatch Display */}
              <div className="p-3 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Duration Timer:</span>
                <div className="flex items-center gap-2">
                  <span className={`text-2xl font-bold tracking-wider font-mono ${
                    mission.status === 'Active' 
                      ? 'text-amber-300 animate-pulse' 
                      : mission.status === 'Complete'
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}>
                    {formatTimer(elapsedDuration)}
                  </span>
                  {mission.status === 'Active' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  )}
                </div>
                <div className="text-[9px] text-slate-500">
                  {mission.status === 'Active' ? 'Ticking live • Starts on Active' : mission.status === 'Complete' ? 'Finalized duration saved in localStorage' : 'Awaiting Directive Acceptance'}
                </div>
              </div>

              {/* Start Time Stamp */}
              <div className="p-3 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Started At:</span>
                <div className="text-sm font-bold text-slate-200">
                  {mission.startedAt ? new Date(mission.startedAt).toLocaleTimeString() : 'Not Started'}
                </div>
                <div className="text-[9px] text-slate-500">
                  {mission.startedAt ? new Date(mission.startedAt).toLocaleDateString() : 'Auto-recorded upon Accept'}
                </div>
              </div>

              {/* Completion & Record Time */}
              <div className="p-3 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Finalized Time:</span>
                <div className="text-sm font-bold text-emerald-300">
                  {mission.completedAt ? new Date(mission.completedAt).toLocaleTimeString() : mission.status === 'Complete' ? 'Saved' : 'Pending Completion'}
                </div>
                <div className="text-[9px] text-slate-500">
                  {mission.durationSeconds !== undefined ? `${mission.durationSeconds}s saved to state` : 'Recorded upon node purification'}
                </div>
              </div>
            </div>

            {/* Interactive Operations Control Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1e2230]">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-sans">
                <Save className="w-3.5 h-3.5 text-cyan-400" />
                <span>All mission state changes and elapsed duration immediately sync to <strong>localStorage</strong>.</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {mission.status !== 'Active' && mission.status !== 'Complete' && (
                  <button
                    id="hud-start-mission-btn"
                    onClick={handleStartMissionHUD}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Accept Mission & Start Timer</span>
                  </button>
                )}

                {mission.status === 'Active' && (
                  <button
                    id="hud-complete-mission-btn"
                    onClick={handleCompleteMissionHUD}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Complete Mission & Save Duration</span>
                  </button>
                )}

                <button
                  id="hud-reset-mission-btn"
                  onClick={handleResetMissionHUD}
                  className="px-2.5 py-1.5 rounded-lg bg-[#11131a] hover:bg-[#181b26] text-slate-400 hover:text-slate-200 border border-[#1e2230] text-xs flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Mission</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Tactical Sectors List & Sentinel Unit Telemetry (Right Col) */}
        <div className="space-y-3 font-mono text-xs">
          
          {/* Sentinel Drones Telemetry Status Card */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-2.5">
            <div className="flex items-center justify-between text-slate-200">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span className="font-bold text-xs text-red-400 uppercase">Sentinel Drone Grid (AI Active)</span>
              </div>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-950 text-red-300 border border-red-700/50 font-bold">
                Mission 001 'Avoid' Phase
              </span>
            </div>

            <div className="space-y-2">
              {drones.map((drone) => {
                const detection = checkPointInVisionCone(playerCoords, drone);
                const isLock = drone.state === 'alerted' || detection.isDetected;

                return (
                  <div
                    key={drone.id}
                    className={`p-2.5 rounded-lg border text-xs space-y-1 transition-all ${
                      isLock
                        ? 'bg-red-950/40 border-red-500/80 text-red-200 shadow-md shadow-red-950/40 animate-pulse'
                        : 'bg-[#11131a] border-[#1e2230] text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: isLock ? '#ef4444' : drone.color }}
                        />
                        <span className="font-bold text-slate-100">{drone.name}</span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        isLock
                          ? 'bg-red-600 text-white'
                          : 'bg-[#0c0e14] border border-[#1e2230] text-slate-400'
                      }`}>
                        {isLock ? 'LOCK-ON' : drone.state}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-sans">{drone.sector}</div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#1e2230] text-[9px] text-slate-500 font-mono">
                      <span>Coords: [{Math.round(drone.x)}, {Math.round(drone.y)}]</span>
                      <span>Heading: {Math.round(drone.angle)}°</span>
                      <span className="font-semibold" style={{ color: drone.color }}>
                        FOV {drone.visionAngle}° / {drone.visionRadius}m
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sector Outposts Fast Travel Card */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-2.5">
            <div className="flex items-center justify-between text-slate-200">
              <span className="font-bold text-xs text-blue-400 uppercase">Sector Outposts (Click to Warp)</span>
              <span className="text-[10px] text-slate-400">{sectors.length} Nodes</span>
            </div>

            <div className="space-y-1.5">
              {sectors.map((sec) => {
                const isCurrent = playerCoords.x === sec.coords.x && playerCoords.y === sec.coords.y;
                const isObjective = (mission.status === 'Active' && sec.id === 'sec-outpost') || 
                                    (mission.status === 'Available' && sec.id === 'sec-hub') ||
                                    (mission.status === 'Active' && progress.collectedFragments.includes('FRAG_001') && sec.id === 'sec-hub');

                return (
                  <button
                    key={sec.id}
                    id={`sector-card-${sec.id}`}
                    onClick={() => handleWarp(sec)}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                      isCurrent
                        ? 'bg-blue-950/40 border-blue-500/80 text-blue-200 shadow-sm'
                        : isObjective
                        ? 'bg-[#11131a] border-blue-500/50 hover:border-blue-400 text-slate-200'
                        : 'bg-[#11131a] border-[#1e2230] hover:border-slate-600 text-slate-300 hover:bg-[#161821]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {isObjective && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-beacon-dot"></span>
                        )}
                        <span className="font-bold text-xs text-slate-100">{sec.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {isObjective && (
                          <span className="text-[8px] px-1 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-700/60 font-semibold uppercase">
                            Objective
                          </span>
                        )}
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[#0c0e14] border border-[#1e2230] text-slate-400 font-semibold">
                          {sec.code}
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{sec.type}</div>
                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#1e2230] text-[9px]">
                      <span className="text-slate-500">Coords: [{sec.coords.x}, {sec.coords.y}]</span>
                      <span className="font-semibold" style={{ color: sec.color }}>
                        {sec.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick-Access HUD Pinned Objectives List */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-2 text-slate-300">
            <div className="flex items-center justify-between text-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase">
                <Pin className="w-3.5 h-3.5 text-blue-400" />
                <span>Quick-Access HUD List</span>
              </div>
              <span className="text-[10px] text-slate-400">
                {pinnedObjectives.length > 0 ? `${pinnedObjectives.length} Pinned` : 'Auto-tracking'}
              </span>
            </div>

            {pinnedObjectives.length > 0 ? (
              <div className="space-y-1.5">
                {pinnedObjectives.map((obj) => (
                  <div
                    key={obj.id}
                    className={`p-2 rounded-lg border text-xs flex items-center justify-between gap-2 transition-colors ${
                      obj.isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-[#11131a] border-blue-500/40 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        obj.isCompleted ? 'bg-emerald-500 text-slate-950' : 'bg-blue-500 text-white'
                      }`}>
                        {obj.isCompleted ? <CheckCircle2 className="w-3 h-3" /> : obj.stepNumber}
                      </div>
                      <span className="font-sans text-[11px] truncate">{obj.description}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">{obj.targetZone}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-[#11131a] border border-dashed border-[#1e2230] text-center space-y-1">
                <p className="text-[11px] text-slate-400 font-sans">
                  No specific objectives pinned. Tracking active directive #{mission.currentObjectiveIndex + 1}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setActiveTab('missions');
                  }}
                  className="text-blue-400 hover:text-blue-300 text-[10px] font-mono underline inline-flex items-center gap-1"
                >
                  <span>Pin objectives in Missions View</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>

          {/* Active Mission HUD Marker with CSS Keyframe Pulse Animation */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-blue-500/60 animate-objective-card-pulse space-y-1.5 text-slate-300 shadow-md">
            <div className="flex items-center justify-between text-blue-400 font-bold">
              <span className="flex items-center gap-1.5 text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-beacon-dot"></span>
                <Sparkles className="w-3 h-3" />
                ACTIVE WAYPOINT
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-700/60 animate-pulse">
                {mission.status}
              </span>
            </div>
            <div className="font-bold text-slate-100 text-xs font-sans flex items-center justify-between">
              <span>{mission.title}</span>
              <span className="text-[10px] font-mono text-blue-300 font-normal">{mission.code}</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
              Objective #{mission.currentObjectiveIndex + 1}: {mission.objectives[mission.currentObjectiveIndex]?.description}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

