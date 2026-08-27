import React, { useState, useEffect } from 'react';
import { 
  Crosshair, 
  Compass, 
  MapPin, 
  Radio, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Navigation, 
  Maximize2,
  Minimize2,
  Gamepad2,
  Sparkles,
  Car
} from 'lucide-react';
import { PlayerProgress, Mission, NavigationTab, PlayerState } from '../types';
import { sound } from '../services/audioService';

interface TacticalHUDViewProps {
  progress: PlayerProgress;
  setProgress: React.Dispatch<React.SetStateAction<PlayerProgress>>;
  mission: Mission;
  setActiveTab: (tab: NavigationTab) => void;
}

export const TacticalHUDView: React.FC<TacticalHUDViewProps> = ({
  progress,
  setProgress,
  mission,
  setActiveTab
}) => {
  const [sweepActive, setSweepActive] = useState<boolean>(true);
  const [sweepAngle, setSweepAngle] = useState<number>(0);
  const [activeZone, setActiveZone] = useState<string>('Sector 7 Metro Core');
  const [playerCoords, setPlayerCoords] = useState<{ x: number; y: number }>({ x: 240, y: 400 });
  const [simulatedState, setSimulatedState] = useState<PlayerState>('Idle');
  const [filterLayer, setFilterLayer] = useState<'all' | 'poi' | 'missions' | 'hazard'>('all');

  // Rotate radar sweep
  useEffect(() => {
    if (!sweepActive) return;
    const interval = setInterval(() => {
      setSweepAngle(prev => (prev + 3) % 360);
    }, 25);
    return () => clearInterval(interval);
  }, [sweepActive]);

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
      type: 'Corrupted Signal Outpost',
      status: mission.status === 'Complete' ? 'Signal Purified' : 'Interference Detected',
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

  const handleWarp = (sector: typeof sectors[0]) => {
    sound.playWarp();
    setPlayerCoords(sector.coords);
    setActiveZone(sector.name);
    setProgress(prev => ({ ...prev, lastWarpLocation: sector.name }));
  };

  const handleToggleSweep = () => {
    sound.playClick();
    setSweepActive(!sweepActive);
  };

  return (
    <div className="space-y-6 py-2 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
            <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">
              TACTICAL HUD TELEMETRY & CARTOGRAPHY
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Onegodia Sector 7 Tactical Radar Matrix
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Live geospatial coordinates, radar sweep status, zone grid layers, and click-to-warp prototype interface.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="toggle-radar-sweep-btn"
            onClick={handleToggleSweep}
            className={`px-2.5 py-1 rounded text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
              sweepActive
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/50'
                : 'bg-[#11131a] text-slate-400 border border-[#1e2230]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Sweep: {sweepActive ? 'RUNNING' : 'PAUSED'}</span>
          </button>

          <button
            id="launch-game-from-hud-btn"
            onClick={() => {
              sound.playClick();
              setActiveTab('prototype');
            }}
            className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono shadow-sm flex items-center gap-1.5"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Launch Canvas</span>
          </button>
        </div>
      </div>

      {/* Main HUD Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Large Radar Map Canvas (Left 2 cols) */}
        <div className="lg:col-span-2 relative aspect-[4/3] sm:aspect-[16/10] bg-[#050608] rounded-xl border border-[#1e2230] shadow-xl p-4 overflow-hidden flex items-center justify-center">
          
          {/* Tactical Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e2230_1px,transparent_1px)] [background-size:20px_20px] opacity-40"></div>

          {/* Concentric Coordinate Rings */}
          <div className="relative w-full h-full max-w-[460px] max-h-[460px] rounded-full border border-[#1e2230] flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-full border border-[#1e2230]/80 flex items-center justify-center">
              <div className="w-1/2 h-1/2 rounded-full border border-[#1e2230]/60 flex items-center justify-center">
                <div className="w-1/4 h-1/4 rounded-full border border-[#1e2230]/40"></div>
              </div>
            </div>

            {/* Radar Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#1e2230]"></div>
            <div className="absolute inset-y-0 left-1/2 w-px bg-[#1e2230]"></div>

            {/* Rotating Radar Sweep Cone */}
            {sweepActive && (
              <div 
                className="absolute inset-0 rounded-full origin-center pointer-events-none"
                style={{
                  transform: `rotate(${sweepAngle}deg)`,
                  background: 'conic-gradient(from 0deg, rgba(59, 130, 246, 0.35) 0deg, rgba(59, 130, 246, 0.08) 30deg, transparent 60deg)'
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
                  className="group absolute -translate-x-1/2 -translate-y-1/2 p-2 focus:outline-none"
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
                  <div className={`absolute top-5 left-1/2 -translate-x-1/2 bg-[#0c0e14] border px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap text-slate-200 pointer-events-none transition-opacity z-20 flex items-center gap-1 ${
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

            {/* Live Player Position Marker */}
            <div 
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
              style={{
                left: `${(playerCoords.x / 1200) * 100}%`,
                top: `${(playerCoords.y / 800) * 100}%`,
              }}
            >
              <div className="w-4 h-4 rounded-full bg-amber-400/20 border-2 border-amber-400 flex items-center justify-center animate-ping"></div>
              <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-amber-400 shadow-md shadow-amber-400/80"></div>
            </div>

          </div>

          {/* Telemetry Overlay Top-Left */}
          <div className="absolute top-3 left-3 bg-[#0c0e14]/90 border border-[#1e2230] p-2.5 rounded-lg font-mono text-xs text-slate-300 backdrop-blur-sm space-y-0.5">
            <div className="text-blue-400 font-bold flex items-center gap-1.5 text-[11px]">
              <Crosshair className="w-3.5 h-3.5" />
              <span>RADAR POSITION</span>
            </div>
            <div className="text-[11px]">X: <strong className="text-slate-100">{playerCoords.x}</strong> | Y: <strong className="text-slate-100">{playerCoords.y}</strong></div>
            <div className="text-[11px]">SECTOR: <strong className="text-blue-300">{activeZone}</strong></div>
          </div>

          {/* Compass Orientation Indicator */}
          <div className="absolute bottom-3 right-3 bg-[#0c0e14]/90 border border-[#1e2230] p-2 rounded-lg font-mono text-[10px] text-slate-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span>GRID: NORTH 000°</span>
          </div>

        </div>

        {/* Tactical Sectors List & Fast Travel (Right Col) */}
        <div className="space-y-3 font-mono text-xs">
          
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
