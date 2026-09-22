import React, { useEffect } from 'react';
import {
  X,
  Radio,
  Shield,
  Car,
  Sparkles,
  ShieldAlert,
  Layers,
  Flag,
  Zap,
  MapPin,
  Navigation,
  Compass,
  CheckCircle2,
  Crosshair,
  Award,
  AlertTriangle,
  Play,
  Share2,
  ExternalLink,
  ChevronRight,
  Target
} from 'lucide-react';
import { MapLandmark } from '../../types';
import { sound } from '../../services/audioService';

interface NodeDetailModalProps {
  node: MapLandmark | null;
  isOpen: boolean;
  onClose: () => void;
  onInitiateExploration: (node: MapLandmark) => void;
  isExplorationActive: boolean;
  onFastTravel?: (node: MapLandmark) => void;
  onSetWaypoint?: (node: MapLandmark) => void;
  onLaunchPlay?: (node: MapLandmark) => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({
  node,
  isOpen,
  onClose,
  onInitiateExploration,
  isExplorationActive,
  onFastTravel,
  onSetWaypoint,
  onLaunchPlay
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !node) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-5 h-5" />;
      case 'Car': return <Car className="w-5 h-5" />;
      case 'Radio': return <Radio className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Flag': return <Flag className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      default: return <MapPin className="w-5 h-5" />;
    }
  };

  const threatColorClasses = {
    'Safe Haven': 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50',
    'Low Risk': 'bg-cyan-950/80 text-cyan-300 border-cyan-600/50',
    'Moderate': 'bg-amber-950/80 text-amber-300 border-amber-600/50',
    'Hazardous': 'bg-orange-950/80 text-orange-300 border-orange-600/50',
    'Critical Lockdown': 'bg-red-950/80 text-red-300 border-red-600/50'
  }[node.threatLevel] || 'bg-slate-900 text-slate-300 border-slate-700';

  const objective = node.explorationObjective || {
    id: `exp-${node.id}`,
    title: `Recon & Survey: ${node.name}`,
    brief: `Conduct a tactical reconnaissance sweep around ${node.name}. Calibrate local telemetry anchors and report anomaly status.`,
    targetAction: 'Sector Survey & Telemetry Calibration',
    rewardCredits: 125,
    rewardItem: 'Sector 7 Data Shard',
    threatLevel: node.threatLevel,
    status: 'available' as const
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="node-detail-modal-container"
        className="relative w-full max-w-2xl rounded-2xl bg-[#090d16] border border-cyan-500/40 shadow-2xl shadow-cyan-950/50 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow Line */}
        <div 
          className="h-1.5 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600"
          style={{
            background: `linear-gradient(90deg, ${node.color} 0%, #3b82f6 50%, #a855f7 100%)`
          }}
        />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#1e2738] bg-[#0c121f]/90">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div 
                className="w-12 h-12 rounded-xl border-2 flex items-center justify-center shrink-0 shadow-lg"
                style={{
                  borderColor: node.color,
                  backgroundColor: `${node.color}15`,
                  color: node.color
                }}
              >
                {renderIcon(node.iconName)}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider">
                    {node.code}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono text-slate-400">
                    {node.district}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${threatColorClasses}`}>
                    {node.threatLevel}
                  </span>
                </div>

                <h2 className="mt-1 text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>{node.name}</span>
                  {node.isGameNode && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/60 text-[10px] font-mono text-cyan-300 font-semibold tracking-normal">
                      ACTIVE NODE
                    </span>
                  )}
                </h2>
              </div>
            </div>

            <button
              type="button"
              id="close-node-modal-btn"
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-lg bg-[#141b2b] border border-[#222e44] text-slate-400 hover:text-white hover:border-slate-400 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Node Frequency & Resonance Band */}
          <div className="mt-4 pt-3 border-t border-[#182236] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2 rounded-lg bg-[#080b12] border border-[#1c2638]">
              <span className="text-[10px] text-slate-500 block">GRID COORDS</span>
              <span className="text-cyan-300 font-bold">[{node.coords.x}, {node.coords.y}]</span>
            </div>

            <div className="p-2 rounded-lg bg-[#080b12] border border-[#1c2638]">
              <span className="text-[10px] text-slate-500 block">ELEVATION</span>
              <span className="text-slate-200 font-bold">{node.elevation}</span>
            </div>

            <div className="p-2 rounded-lg bg-[#080b12] border border-[#1c2638]">
              <span className="text-[10px] text-slate-500 block">FREQUENCY</span>
              <span className="text-amber-300 font-bold truncate">{node.nodeFrequency || '432.8 MHz'}</span>
            </div>

            <div className="p-2 rounded-lg bg-[#080b12] border border-[#1c2638]">
              <span className="text-[10px] text-slate-500 block">RESONANCE</span>
              <span className="text-emerald-300 font-bold">{node.signalResonance || 95}%</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* Location Description */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Location Profile & Description</span>
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed font-sans bg-[#0c121e] p-3.5 rounded-xl border border-[#1a2334]">
              {node.description}
            </p>
          </div>

          {/* Strategic Recon & Environmental Intel */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-amber-400" />
              <span>Strategic Reconnaissance & Defense Intel</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-[#0d1424] border border-amber-500/30 text-xs font-sans text-slate-300 space-y-2">
              <p className="leading-relaxed">{node.strategicIntel}</p>
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3 font-mono text-[11px]">
                <span className="text-slate-400">
                  Node Status: <strong className="text-cyan-300">{node.status}</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">
                  Fast Travel: <strong className={node.fastTravelAvailable ? 'text-emerald-400' : 'text-red-400'}>
                    {node.fastTravelAvailable ? 'Available' : 'Restricted'}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Sector Exploration Objective Card */}
          <div className="rounded-xl border-2 border-cyan-500/50 bg-gradient-to-br from-[#0c1728] via-[#09111f] to-[#120f26] p-4 sm:p-5 shadow-xl shadow-cyan-950/40 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/30">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                    SECTOR EXPLORATION OBJECTIVE
                  </span>
                  <h4 className="text-base font-extrabold text-white">
                    {objective.title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-md bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-mono font-bold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>+{objective.rewardCredits} CR</span>
                </span>
                {objective.rewardItem && (
                  <span className="px-2 py-1 rounded-md bg-purple-900/40 border border-purple-500/40 text-purple-300 text-[10px] font-mono font-semibold">
                    {objective.rewardItem}
                  </span>
                )}
              </div>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {objective.brief}
            </p>

            <div className="mt-3 flex items-center gap-2 text-xs font-mono text-cyan-300">
              <span className="text-slate-400">Action:</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-700/50">
                {objective.targetAction}
              </span>
            </div>

            {/* Primary Action Button: Initiate Exploration Objective */}
            <div className="mt-4 pt-3 border-t border-[#1a2538] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {isExplorationActive ? (
                <div className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 font-mono font-bold text-xs shadow-lg shadow-emerald-950/50 animate-pulse">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>SECTOR OBJECTIVE ACTIVE — TRACKING NODE [{node.coords.x}, {node.coords.y}]</span>
                </div>
              ) : (
                <button
                  type="button"
                  id="initiate-sector-objective-btn"
                  onClick={() => {
                    sound.playReward();
                    onInitiateExploration(node);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Target className="w-4 h-4" />
                  <span>Initiate Sector Exploration Objective</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-[#1e2738] bg-[#0c121f] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {onFastTravel && node.fastTravelAvailable && (
              <button
                type="button"
                id="modal-warp-btn"
                onClick={() => {
                  onFastTravel(node);
                }}
                className="px-3 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-200 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span>Fast Travel Warp</span>
              </button>
            )}

            {onSetWaypoint && (
              <button
                type="button"
                id="modal-waypoint-btn"
                onClick={() => {
                  onSetWaypoint(node);
                }}
                className="px-3 py-2 rounded-lg bg-[#141c2c] hover:bg-[#1a253a] border border-[#24334d] text-amber-300 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Pin Waypoint</span>
              </button>
            )}

            {onLaunchPlay && (
              <button
                type="button"
                id="modal-launch-play-btn"
                onClick={() => {
                  onLaunchPlay(node);
                }}
                className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-600/30"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Play in Stamford</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-[#151b29] hover:bg-[#1f2738] border border-[#222b3d] text-slate-300 font-mono text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
