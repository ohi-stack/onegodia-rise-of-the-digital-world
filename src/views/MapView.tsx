import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Map as MapIcon,
  Compass, 
  Crosshair, 
  MapPin, 
  Radio, 
  Shield, 
  Car, 
  Sparkles, 
  ShieldAlert, 
  Layers, 
  Flag, 
  Zap, 
  Eye, 
  EyeOff, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Navigation, 
  Footprints, 
  Sliders, 
  ArrowRight, 
  Gamepad2, 
  Sparkle,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info
} from 'lucide-react';
import { PlayerProgress, Mission, NavigationTab, MapLandmark } from '../types';
import { sound } from '../services/audioService';
import { SECTOR_7_LANDMARKS, SECTOR_7_REGIONS } from '../data/mapData';
import { 
  SentinelDrone, 
  INITIAL_SENTINEL_DRONES, 
  SentinelDroneData, 
  updateDroneAI, 
  checkPointInVisionCone 
} from '../components/DronePatrol';

interface MapViewProps {
  progress: PlayerProgress;
  setProgress: React.Dispatch<React.SetStateAction<PlayerProgress>>;
  mission: Mission;
  setMission?: React.Dispatch<React.SetStateAction<Mission>>;
  setActiveTab: (tab: NavigationTab) => void;
}

type MapLayer = 'all' | 'missions' | 'fast-travel' | 'sentinels' | 'relics' | 'districts';
type MapInteractionMode = 'inspect' | 'warp' | 'waypoint';

export const MapView: React.FC<MapViewProps> = ({
  progress,
  setProgress,
  mission,
  setMission,
  setActiveTab
}) => {
  // Player Position in World Space
  const [playerCoords, setPlayerCoords] = useState<{ x: number; y: number }>(() => {
    return { x: 240, y: 400 };
  });

  const [activeZone, setActiveZone] = useState<string>('Onegodia Safe Hub Plaza');
  const [selectedLandmark, setSelectedLandmark] = useState<MapLandmark>(() => SECTOR_7_LANDMARKS[0]);
  
  // Custom User Waypoint
  const [customWaypoint, setCustomWaypoint] = useState<{ x: number; y: number; label: string } | null>(null);

  // Map Viewport Settings (Zoom & Pan)
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<MapLayer>('all');
  const [interactionMode, setInteractionMode] = useState<MapInteractionMode>('inspect');
  const [showPatrolRoutes, setShowPatrolRoutes] = useState<boolean>(true);
  const [showVisionCones, setShowVisionCones] = useState<boolean>(true);
  const [showTerrainGrid, setShowTerrainGrid] = useState<boolean>(true);
  const [warpToast, setWarpToast] = useState<string | null>(null);

  // Sentinel Drones Live Simulation on Map
  const [drones, setDrones] = useState<SentinelDroneData[]>(() => INITIAL_SENTINEL_DRONES);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Live Drone AI Patrol Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setDrones(prevDrones => {
        return prevDrones.map(drone => updateDroneAI(drone, playerCoords, 1));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [playerCoords]);

  // Distance from player to selected landmark
  const distanceToSelected = useMemo(() => {
    if (!selectedLandmark) return 0;
    const dx = selectedLandmark.coords.x - playerCoords.x;
    const dy = selectedLandmark.coords.y - playerCoords.y;
    return Math.round(Math.hypot(dx, dy));
  }, [selectedLandmark, playerCoords]);

  // Distance from player to custom waypoint
  const distanceToWaypoint = useMemo(() => {
    if (!customWaypoint) return null;
    const dx = customWaypoint.x - playerCoords.x;
    const dy = customWaypoint.y - playerCoords.y;
    return Math.round(Math.hypot(dx, dy));
  }, [customWaypoint, playerCoords]);

  // Calculate sector exploration percentage
  const explorationProgress = useMemo(() => {
    const total = SECTOR_7_LANDMARKS.length;
    const discovered = SECTOR_7_LANDMARKS.filter(l => l.discovered).length;
    return Math.round((discovered / total) * 100);
  }, []);

  // Determine current active objective target coords
  const activeObjectiveCoords = useMemo(() => {
    if (mission.status === 'Active') {
      if (mission.currentObjectiveIndex === 0) return { x: 920, y: 260 }; // Node
      if (mission.currentObjectiveIndex === 1) return { x: 1040, y: 480 }; // Fragment Quarry
      if (mission.currentObjectiveIndex === 2) return { x: 240, y: 400 }; // Hub return
    }
    return null;
  }, [mission]);

  // Fast Travel Warp Handler
  const handleWarpToLandmark = (landmark: MapLandmark) => {
    if (!landmark.fastTravelAvailable) return;
    sound.playWarp();
    setPlayerCoords(landmark.coords);
    setActiveZone(landmark.name);
    setSelectedLandmark(landmark);
    setProgress(prev => ({ ...prev, lastWarpLocation: landmark.name }));

    setWarpToast(`Operative successfully warped to ${landmark.name} [${landmark.coords.x}, ${landmark.coords.y}]`);
    setTimeout(() => setWarpToast(null), 4000);
  };

  // Map Canvas Click / Touch Handler (For Inspect, Warp, or Waypoint Placement)
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(10); } catch { /* ignore */ }
    }

    // Convert click position to 1200x800 world coordinates
    const worldX = Math.round((clickX / rect.width) * 1200);
    const worldY = Math.round((clickY / rect.height) * 800);

    if (interactionMode === 'waypoint') {
      sound.playClick();
      setCustomWaypoint({
        x: worldX,
        y: worldY,
        label: `GPS Marker [${worldX}, ${worldY}]`
      });
      setWarpToast(`Custom navigation waypoint placed at [${worldX}, ${worldY}]`);
      setTimeout(() => setWarpToast(null), 3000);
    } else if (interactionMode === 'warp') {
      sound.playWarp();
      setPlayerCoords({ x: worldX, y: worldY });
      setActiveZone(`Custom Grid [${worldX}, ${worldY}]`);
      setWarpToast(`Tactical teleport jump to coordinates [${worldX}, ${worldY}]`);
      setTimeout(() => setWarpToast(null), 3000);
    }
  };

  // Render Landmark Icon helper
  const renderLandmarkIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-3.5 h-3.5" />;
      case 'Car': return <Car className="w-3.5 h-3.5" />;
      case 'Radio': return <Radio className="w-3.5 h-3.5" />;
      case 'Sparkles': return <Sparkles className="w-3.5 h-3.5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'Layers': return <Layers className="w-3.5 h-3.5" />;
      case 'Flag': return <Flag className="w-3.5 h-3.5" />;
      case 'Zap': return <Zap className="w-3.5 h-3.5" />;
      default: return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-4 py-2 font-sans">
      
      {/* Top Header & Telemetry Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              ONEGODIA CARTOGRAPHY & SECTOR 7 WORLD MAP
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-cyan-400" />
            <span>Interactive World Cartography & Fast-Travel Grid</span>
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Full-scale topographic radar, district sectors, real-time Sentinel flight paths, mission directive beacons, and click-to-warp teleportation.
          </p>
        </div>

        {/* Quick Mode Switcher & Stats */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-[#11131a] border border-[#1e2230] text-slate-300 flex items-center gap-2">
            <span className="text-slate-400">Sector 7 Charted:</span>
            <strong className="text-cyan-400">{explorationProgress}%</strong>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('prototype');
            }}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Enter Playable Game</span>
          </button>
        </div>
      </div>

      {/* Warp / Action Notification Toast */}
      {warpToast && (
        <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/70 text-cyan-200 font-mono text-xs flex items-center justify-between gap-3 shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{warpToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setWarpToast(null)}
            className="px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Map Control Toolbar */}
      <div className="p-3 rounded-xl bg-[#0c0e14] border border-[#1e2230] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        
        {/* Layer Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 text-[11px] font-bold uppercase mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Layers:</span>
          </span>

          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveLayer('all'); }}
            className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors ${
              activeLayer === 'all'
                ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 font-bold'
                : 'bg-[#11131a] border-[#1e2230] text-slate-400 hover:text-slate-200'
            }`}
          >
            All POIs
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveLayer('missions'); }}
            className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors flex items-center gap-1 ${
              activeLayer === 'missions'
                ? 'bg-blue-950/80 border-blue-500 text-blue-200 font-bold'
                : 'bg-[#11131a] border-[#1e2230] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3 h-3 text-blue-400" />
            <span>Mission Directives</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveLayer('fast-travel'); }}
            className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors flex items-center gap-1 ${
              activeLayer === 'fast-travel'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold'
                : 'bg-[#11131a] border-[#1e2230] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-3 h-3 text-emerald-400" />
            <span>Fast Travel Pads</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveLayer('sentinels'); }}
            className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors flex items-center gap-1 ${
              activeLayer === 'sentinels'
                ? 'bg-red-950/80 border-red-500 text-red-200 font-bold'
                : 'bg-[#11131a] border-[#1e2230] text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-red-400" />
            <span>Sentinel Patrols</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setActiveLayer('relics'); }}
            className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors flex items-center gap-1 ${
              activeLayer === 'relics'
                ? 'bg-purple-950/80 border-purple-500 text-purple-200 font-bold'
                : 'bg-[#11131a] border-[#1e2230] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>Data Caches</span>
          </button>
        </div>

        {/* Interaction Tool Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px] font-bold uppercase mr-1">Click Tool:</span>
          
          <button
            type="button"
            onClick={() => { sound.playClick(); setInteractionMode('inspect'); }}
            className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors flex items-center gap-1 ${
              interactionMode === 'inspect'
                ? 'bg-blue-600 text-white border-blue-400 font-bold'
                : 'bg-[#11131a] border-[#1e2230] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-3 h-3" />
            <span>Inspect POI</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setInteractionMode('waypoint'); }}
            className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors flex items-center gap-1 ${
              interactionMode === 'waypoint'
                ? 'bg-amber-600 text-white border-amber-400 font-bold'
                : 'bg-[#11131a] border-[#1e2230] text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>Drop Waypoint</span>
          </button>

          <button
            type="button"
            onClick={() => { sound.playClick(); setInteractionMode('warp'); }}
            className={`px-2.5 py-1 rounded text-[11px] font-medium border transition-colors flex items-center gap-1 ${
              interactionMode === 'warp'
                ? 'bg-cyan-600 text-white border-cyan-400 font-bold'
                : 'bg-[#11131a] border-[#1e2230] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-3 h-3" />
            <span>Click to Warp</span>
          </button>
        </div>
      </div>

      {/* Main Map Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Interactive World Map Canvas (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-2">
          
          <div 
            ref={mapContainerRef}
            onClick={handleMapClick}
            onTouchStart={handleMapClick}
            className="relative aspect-[16/10] bg-[#05070c] rounded-xl border border-[#1e2230] shadow-2xl p-4 overflow-hidden select-none cursor-crosshair group"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, #0a0d16 0%, #05070c 100%)'
            }}
          >
            
            {/* Topographical Grid Pattern */}
            {showTerrainGrid && (
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b28_1px,transparent_1px),linear-gradient(to_bottom,#161b28_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none"></div>
            )}

            {/* SVG Background Layer for Sector Regions, Transit Arteries, and Topography */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1200 800"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Neon Highway Glow Filter */}
                <filter id="highway-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* District Region Polygons */}
              {(activeLayer === 'all' || activeLayer === 'districts') && SECTOR_7_REGIONS.map((reg) => {
                const pointsStr = reg.polygon.map(p => `${p[0]},${p[1]}`).join(' ');
                return (
                  <g key={reg.id}>
                    <polygon
                      points={pointsStr}
                      fill={reg.fillColor}
                      stroke={reg.strokeColor}
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                    />
                    <text
                      x={reg.polygon[0][0] + 15}
                      y={reg.polygon[0][1] + 25}
                      fill={reg.strokeColor}
                      fontSize="12"
                      fontFamily="monospace"
                      fontWeight="bold"
                      opacity="0.85"
                    >
                      {reg.name}
                    </text>
                  </g>
                );
              })}

              {/* Major Cyber-Highway Transit Arteries */}
              <g opacity="0.8">
                {/* East-West Cyber Expressway */}
                <path
                  d="M 60 400 L 240 400 L 520 330 L 920 260 L 1140 260"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="4"
                  strokeOpacity="0.6"
                  filter="url(#highway-glow)"
                />
                <path
                  d="M 60 400 L 240 400 L 520 330 L 920 260 L 1140 260"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeDasharray="12 8"
                  className="animate-pulse"
                />

                {/* North-South Industrial Spur */}
                <path
                  d="M 520 330 L 520 640 L 420 640"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  strokeOpacity="0.4"
                  strokeDasharray="8 4"
                />

                {/* East Quarry Spur */}
                <path
                  d="M 920 260 L 1040 480"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  strokeOpacity="0.4"
                  strokeDasharray="6 6"
                />
              </g>

              {/* Trajectory Beam to Active Mission Objective */}
              {activeObjectiveCoords && (
                <g>
                  <line
                    x1={playerCoords.x}
                    y1={playerCoords.y}
                    x2={activeObjectiveCoords.x}
                    y2={activeObjectiveCoords.y}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                    strokeOpacity="0.8"
                  />
                  <circle
                    cx={activeObjectiveCoords.x}
                    cy={activeObjectiveCoords.y}
                    r="24"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="animate-spin origin-center"
                  />
                </g>
              )}

              {/* Vector line from player to custom waypoint */}
              {customWaypoint && (
                <g>
                  <line
                    x1={playerCoords.x}
                    y1={playerCoords.y}
                    x2={customWaypoint.x}
                    y2={customWaypoint.y}
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    strokeOpacity="0.9"
                  />
                </g>
              )}
            </svg>

            {/* LIVE SENTINEL DRONES LAYER (IF ENABLED) */}
            {(activeLayer === 'all' || activeLayer === 'sentinels') && drones.map((drone) => (
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

            {/* LANDMARKS & POINTS OF INTEREST MARKERS */}
            {SECTOR_7_LANDMARKS.map((landmark) => {
              const isSelected = selectedLandmark?.id === landmark.id;
              const isObjective = (mission.status === 'Active' && landmark.id === 'sec-node-1') ||
                                  (mission.status === 'Available' && landmark.id === 'sec-hub');

              // Filter check
              if (activeLayer === 'missions' && !isObjective) return null;
              if (activeLayer === 'fast-travel' && !landmark.fastTravelAvailable) return null;
              if (activeLayer === 'relics' && !landmark.lootAvailable) return null;

              const percentX = (landmark.coords.x / 1200) * 100;
              const percentY = (landmark.coords.y / 800) * 100;

              return (
                <button
                  key={landmark.id}
                  id={`landmark-node-${landmark.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playClick();
                    setSelectedLandmark(landmark);
                    if (interactionMode === 'warp' && landmark.fastTravelAvailable) {
                      handleWarpToLandmark(landmark);
                    }
                  }}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none z-30 transition-transform hover:scale-125"
                  style={{
                    left: `${percentX}%`,
                    top: `${percentY}%`,
                  }}
                >
                  {/* Glowing halo beacon if selected or active objective */}
                  {(isSelected || isObjective) && (
                    <div 
                      className="absolute -inset-2.5 rounded-full border border-cyan-400 bg-cyan-500/20 animate-ping pointer-events-none"
                      style={{ borderColor: landmark.color }}
                    />
                  )}

                  {/* Landmark Node Badge */}
                  <div
                    className={`w-7 h-7 rounded-lg border flex items-center justify-center shadow-lg transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-white text-white shadow-white/40 scale-110'
                        : 'bg-[#0b0e14]/90 border-[#1e2230] hover:border-slate-300'
                    }`}
                    style={{
                      borderColor: isSelected ? '#ffffff' : landmark.color,
                      color: landmark.color
                    }}
                  >
                    {renderLandmarkIcon(landmark.iconName)}
                  </div>

                  {/* Landmark Label Tooltip */}
                  <div className={`absolute top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap border pointer-events-none transition-all z-40 flex items-center gap-1 shadow-xl ${
                    isSelected
                      ? 'opacity-100 bg-slate-900 border-white text-white font-bold'
                      : 'opacity-0 group-hover:opacity-100 bg-[#0c0e14]/95 border-[#1e2230] text-slate-200'
                  }`}>
                    <span>{landmark.name}</span>
                    {isObjective && (
                      <span className="text-[8px] bg-blue-600 text-white px-1 rounded font-bold uppercase">
                        Active Obj
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {/* Custom User GPS Waypoint Marker */}
            {customWaypoint && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-40 group"
                style={{
                  left: `${(customWaypoint.x / 1200) * 100}%`,
                  top: `${(customWaypoint.y / 800) * 100}%`,
                }}
              >
                <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/80 animate-bounce">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="absolute top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap bg-amber-950 border border-amber-400 text-amber-200 shadow-md">
                  {customWaypoint.label} ({distanceToWaypoint}m)
                </div>
              </div>
            )}

            {/* Live Operative Position Marker */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40"
              style={{
                left: `${(playerCoords.x / 1200) * 100}%`,
                top: `${(playerCoords.y / 800) * 100}%`,
              }}
            >
              <div className="w-5 h-5 rounded-full bg-cyan-400/30 border-2 border-cyan-400 flex items-center justify-center animate-ping"></div>
              <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-white shadow-lg shadow-cyan-400"></div>
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-slate-950/95 text-cyan-300 border border-cyan-500 text-[8px] font-mono whitespace-nowrap font-bold">
                OPERATIVE
              </span>
            </div>

            {/* Top-Left Telemetry Overlay Box */}
            <div className="absolute top-3 left-3 bg-[#0c0e14]/90 border border-[#1e2230] p-2.5 rounded-lg font-mono text-xs text-slate-300 backdrop-blur-sm space-y-0.5 z-20">
              <div className="text-cyan-400 font-bold flex items-center gap-1 text-[11px]">
                <Crosshair className="w-3.5 h-3.5" />
                <span>SECTOR 7 CARTOGRAPHY</span>
              </div>
              <div className="text-[11px]">
                X: <strong className="text-slate-100">{playerCoords.x}</strong> | Y: <strong className="text-slate-100">{playerCoords.y}</strong>
              </div>
              <div className="text-[10px] text-slate-400">
                Zone: <span className="text-cyan-300">{activeZone}</span>
              </div>
            </div>

            {/* Bottom-Right Compass & Scale Overlay */}
            <div className="absolute bottom-3 right-3 bg-[#0c0e14]/90 border border-[#1e2230] p-2 rounded-lg font-mono text-[10px] text-slate-400 flex items-center gap-2 z-20">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>SCALE: 1:1000m • NORTH 000°</span>
            </div>

          </div>

          {/* Sub-Map Auxiliary Bar */}
          <div className="p-3 rounded-xl bg-[#0c0e14] border border-[#1e2230] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Drone Display:</span>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowPatrolRoutes(!showPatrolRoutes);
                }}
                className={`px-2.5 py-1 rounded border text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                  showPatrolRoutes
                    ? 'bg-blue-950/70 border-blue-500 text-blue-300'
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
                    ? 'bg-red-950/70 border-red-500 text-red-300'
                    : 'bg-[#11131a] border-[#1e2230] text-slate-500'
                }`}
              >
                {showVisionCones ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                <span>Vision Cones</span>
              </button>
            </div>

            {customWaypoint && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCustomWaypoint(null);
                }}
                className="px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/50 text-amber-300 text-[11px] hover:bg-amber-900 transition-colors flex items-center gap-1"
              >
                <span>Clear Custom Waypoint</span>
              </button>
            )}
          </div>

        </div>

        {/* Selected Landmark Recon Telemetry & Fast Travel (Right Col) */}
        <div className="space-y-3 font-mono text-xs">
          
          {/* Landmark Recon Intelligence Card */}
          <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#1e2230] pb-2.5">
              <div className="flex items-center gap-2">
                <div 
                  className="w-7 h-7 rounded-lg border flex items-center justify-center shadow-md"
                  style={{ 
                    borderColor: selectedLandmark.color,
                    backgroundColor: `${selectedLandmark.color}20`,
                    color: selectedLandmark.color
                  }}
                >
                  {renderLandmarkIcon(selectedLandmark.iconName)}
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{selectedLandmark.code}</span>
                  <h3 className="font-bold text-sm text-white">{selectedLandmark.name}</h3>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                selectedLandmark.threatLevel === 'Safe Haven'
                  ? 'bg-blue-950 text-blue-300 border border-blue-700/50'
                  : selectedLandmark.threatLevel === 'Critical Lockdown'
                  ? 'bg-red-950 text-red-300 border border-red-700/50'
                  : 'bg-amber-950 text-amber-300 border border-amber-700/50'
              }`}>
                {selectedLandmark.threatLevel}
              </span>
            </div>

            {/* Strategic Intelligence Details */}
            <div className="space-y-2 text-slate-300 font-sans text-xs">
              <p className="leading-relaxed text-slate-300">{selectedLandmark.description}</p>
              
              <div className="p-2.5 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1 font-mono text-[11px]">
                <div className="text-cyan-400 font-bold flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  <span>STRATEGIC RECON INTEL:</span>
                </div>
                <p className="text-slate-300 font-sans text-xs">{selectedLandmark.strategicIntel}</p>
              </div>
            </div>

            {/* Geographical Coordinates Grid */}
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 rounded bg-[#11131a] border border-[#1e2230]">
                <div className="text-slate-500 text-[10px]">GRID COORDS</div>
                <div className="text-slate-200 font-bold">[{selectedLandmark.coords.x}, {selectedLandmark.coords.y}]</div>
              </div>

              <div className="p-2 rounded bg-[#11131a] border border-[#1e2230]">
                <div className="text-slate-500 text-[10px]">ELEVATION TIER</div>
                <div className="text-slate-200 font-bold">{selectedLandmark.elevation}</div>
              </div>

              <div className="p-2 rounded bg-[#11131a] border border-[#1e2230]">
                <div className="text-slate-500 text-[10px]">DISTANCE FROM OPERATIVE</div>
                <div className="text-cyan-300 font-bold">{distanceToSelected} meters</div>
              </div>

              <div className="p-2 rounded bg-[#11131a] border border-[#1e2230]">
                <div className="text-slate-500 text-[10px]">STATUS</div>
                <div className="text-slate-200 font-semibold truncate">{selectedLandmark.status}</div>
              </div>
            </div>

            {/* Action Buttons: Fast Travel Warp & Set Waypoint */}
            <div className="space-y-2 pt-2 border-t border-[#1e2230]">
              {selectedLandmark.fastTravelAvailable ? (
                <button
                  type="button"
                  id="fast-travel-btn"
                  onClick={() => handleWarpToLandmark(selectedLandmark)}
                  className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-600/30"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Fast Travel Warp ({selectedLandmark.name})</span>
                </button>
              ) : (
                <div className="w-full py-2 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-center font-bold text-[11px] flex items-center justify-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Restricted Airspace — Fast Travel Disabled</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setCustomWaypoint({
                    x: selectedLandmark.coords.x,
                    y: selectedLandmark.coords.y,
                    label: selectedLandmark.name
                  });
                  setWarpToast(`Navigation directive pinned to ${selectedLandmark.name}`);
                  setTimeout(() => setWarpToast(null), 3000);
                }}
                className="w-full py-2 rounded-lg bg-[#11131a] hover:bg-[#181c26] text-slate-200 border border-[#1e2230] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Pin Target GPS Waypoint</span>
              </button>
            </div>

          </div>

          {/* Quick Sector Fast-Travel Directory List */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="font-bold text-xs text-cyan-400 uppercase">Sector 7 Directory</span>
              <span className="text-[10px] text-slate-500 font-mono">8 Key Landmarks</span>
            </div>

            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {SECTOR_7_LANDMARKS.map((lm) => {
                const isCurrent = selectedLandmark?.id === lm.id;
                return (
                  <button
                    key={lm.id}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setSelectedLandmark(lm);
                    }}
                    className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between transition-all ${
                      isCurrent
                        ? 'bg-slate-900 border-cyan-500 text-white font-bold'
                        : 'bg-[#11131a] border-[#1e2230] text-slate-400 hover:text-slate-200 hover:bg-[#161922]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div 
                        className="w-2 h-2 rounded-full shrink-0" 
                        style={{ backgroundColor: lm.color }}
                      />
                      <span className="truncate">{lm.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0 ml-2">
                      {lm.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
