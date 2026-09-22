import React, { useMemo } from 'react';
import {
  Compass,
  MapPin,
  Hospital,
  Car,
  Building2,
  TrainFront,
  Waves,
  Navigation,
  Crosshair,
  Target,
  Sparkles,
  Zap,
} from 'lucide-react';
import { StamfordPOI } from '../../data/stamfordLocations';
import { sound } from '../../services/audioService';

interface StamfordVectorMapProps {
  originPoi: StamfordPOI;
  destinationPoi: StamfordPOI;
  waypointPois: StamfordPOI[];
  filteredPois: StamfordPOI[];
  selectedPoiId: string | null;
  onSelectPoi: (poi: StamfordPOI) => void;
  onInspectNode?: (poi: StamfordPOI) => void;
  onSetDestination: (id: string) => void;
  onFastTravel: (poi: StamfordPOI) => void;
  travelMode: 'DRIVE' | 'WALK' | 'BICYCLE' | 'TRANSIT';
  mapTheme: 'tactical-dark' | 'standard' | 'hybrid';
}

export const StamfordVectorMap: React.FC<StamfordVectorMapProps> = ({
  originPoi,
  destinationPoi,
  waypointPois,
  filteredPois,
  selectedPoiId,
  onSelectPoi,
  onInspectNode,
  onSetDestination,
  onFastTravel,
  travelMode,
  mapTheme,
}) => {
  // Coordinate projection from GPS lat/lng to SVG viewBox (800 x 600)
  // Stamford bounds: lat ~41.035 to 41.075, lng ~ -73.560 to -73.505
  const projectCoords = (lat: number, lng: number) => {
    const minLat = 41.035;
    const maxLat = 41.075;
    const minLng = -73.560;
    const maxLng = -73.505;

    const x = ((lng - minLng) / (maxLng - minLng)) * 700 + 50;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 500 + 50;
    return { x: Math.max(40, Math.min(760, x)), y: Math.max(40, Math.min(560, y)) };
  };

  const activePoi = useMemo(
    () => filteredPois.find((p) => p.id === selectedPoiId) || null,
    [filteredPois, selectedPoiId]
  );

  // Compute route path polyline points
  const routePoints = useMemo(() => {
    const points = [
      projectCoords(originPoi.lat, originPoi.lng),
      ...waypointPois.map((w) => projectCoords(w.lat, w.lng)),
      projectCoords(destinationPoi.lat, destinationPoi.lng),
    ];
    return points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  }, [originPoi, destinationPoi, waypointPois]);

  const renderIcon = (iconType: StamfordPOI['iconType']) => {
    switch (iconType) {
      case 'hospital':
        return <Hospital className="w-3 h-3" />;
      case 'train':
        return <TrainFront className="w-3 h-3" />;
      case 'car':
        return <Car className="w-3 h-3" />;
      case 'building':
        return <Building2 className="w-3 h-3" />;
      case 'waves':
        return <Waves className="w-3 h-3" />;
      default:
        return <MapPin className="w-3 h-3" />;
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#050811] overflow-hidden select-none font-mono">
      {/* Background SVG Grid & Cartography */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full object-cover"
        style={{ background: mapTheme === 'hybrid' ? '#040b17' : '#050811' }}
      >
        <defs>
          {/* Tactical Grid Pattern */}
          <pattern id="stamfordGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 255, 255, 0.05)" strokeWidth="0.8" />
          </pattern>
          <pattern id="stamfordFineGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0, 255, 255, 0.02)" strokeWidth="0.5" />
          </pattern>
          {/* Glowing Filter for Route Laser */}
          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Tactical Grids */}
        <rect width="800" height="600" fill="url(#stamfordFineGrid)" />
        <rect width="800" height="600" fill="url(#stamfordGrid)" />

        {/* Shoreline & Long Island Sound Coastal Boundary (South) */}
        <path
          d="M 50 560 Q 200 520, 360 540 T 580 510 T 760 530 L 760 600 L 50 600 Z"
          fill="rgba(6, 182, 212, 0.08)"
          stroke="rgba(6, 182, 212, 0.25)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />
        <text x="560" y="575" fill="rgba(6, 182, 212, 0.4)" fontSize="11" fontWeight="bold" letterSpacing="2">
          LONG ISLAND SOUND / HARBOR
        </text>

        {/* Major Road Arterials (Washington Blvd Spine & I-95 Expressway) */}
        {/* I-95 Crossing East-West near Train Station */}
        <line
          x1="40"
          y1="390"
          x2="760"
          y2="380"
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth="3"
        />
        <text x="60" y="375" fill="rgba(148, 163, 184, 0.4)" fontSize="9" letterSpacing="1">
          INTERSTATE 95 (CORRIDOR CROSSING)
        </text>

        {/* Washington Blvd Central Transit Spine (North-South) */}
        <path
          d="M 280 80 Q 300 240, 310 390 T 325 510"
          fill="none"
          stroke="rgba(0, 255, 255, 0.18)"
          strokeWidth="3.5"
          strokeDasharray="6 4"
        />
        <text x="330" y="220" fill="rgba(0, 255, 255, 0.35)" fontSize="9" letterSpacing="1" transform="rotate(78 330 220)">
          WASHINGTON BLVD CORRIDOR
        </text>

        {/* Active Vector Route Polyline (Glow + Dash) */}
        <polyline
          points={routePoints}
          fill="none"
          stroke="#00ffff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#routeGlow)"
          opacity="0.9"
        />
        <polyline
          points={routePoints}
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="8 6"
          className="animate-pulse"
        />

        {/* Render POI Markers */}
        {filteredPois.map((poi) => {
          const { x, y } = projectCoords(poi.lat, poi.lng);
          const isSelected = selectedPoiId === poi.id;
          const isOrigin = originPoi.id === poi.id;
          const isDestination = destinationPoi.id === poi.id;
          const isWaypoint = waypointPois.some((w) => w.id === poi.id);

          const markerColor = isOrigin
            ? '#10b981'
            : isDestination
            ? '#a855f7'
            : isWaypoint
            ? '#06b6d4'
            : poi.color;

          return (
            <g
              key={poi.id}
              onClick={() => {
                sound.playClick();
                onSelectPoi(poi);
              }}
              className="cursor-pointer transition-transform hover:scale-110"
            >
              {/* Pulsing ring for special nodes */}
              {(isSelected || isOrigin || isDestination) && (
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 18 : 14}
                  fill="none"
                  stroke={markerColor}
                  strokeWidth="1.5"
                  opacity="0.7"
                  className="animate-ping"
                />
              )}

              {/* Marker Base Ring */}
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 12 : 9}
                fill="#080c16"
                stroke={markerColor}
                strokeWidth={isSelected ? 2.5 : 1.8}
              />
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 6 : 4}
                fill={markerColor}
              />

              {/* Label */}
              <text
                x={x + 12}
                y={y + 4}
                fill={isSelected ? '#ffffff' : '#94a3b8'}
                fontSize={isSelected ? '10' : '8.5'}
                fontWeight={isSelected ? 'bold' : 'normal'}
                className="pointer-events-none select-none drop-shadow"
              >
                {poi.shortName}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Top Left: Tactical Corridor Legend */}
      <div className="absolute top-3 left-3 p-3 rounded-lg bg-[#080d18]/90 border border-cyan-500/40 text-cyan-200 backdrop-blur shadow-xl text-[10px] space-y-1 font-mono pointer-events-auto">
        <div className="flex items-center gap-1.5 font-bold text-white uppercase text-[11px]">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          <span>Vector GIS Corridor</span>
        </div>
        <div className="text-slate-400 text-[9px]">
          Origin: <span className="text-emerald-300 font-semibold">{originPoi.shortName}</span>
        </div>
        <div className="text-slate-400 text-[9px]">
          Dest: <span className="text-purple-300 font-semibold">{destinationPoi.shortName}</span>
        </div>
        <div className="text-slate-400 text-[9px]">
          Mode: <span className="text-amber-300 font-semibold">{travelMode}</span>
        </div>
      </div>

      {/* Top Right: Status Badge */}
      <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-[#090e1a]/90 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 backdrop-blur shadow-lg">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>Tactical Vector Cartography Active</span>
      </div>

      {/* Selected POI Floating Inspector Card */}
      {activePoi && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md p-3.5 rounded-xl bg-[#080d18]/95 border border-cyan-500/60 shadow-2xl backdrop-blur text-xs space-y-2 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-cyan-400">
              {renderIcon(activePoi.iconType)}
              <span>{activePoi.category}</span>
              {activePoi.isCorridorCheckpoint && (
                <span className="px-1.5 py-0.2 rounded bg-cyan-900/80 border border-cyan-500/50 text-cyan-200 text-[9px]">
                  Checkpoint #{activePoi.corridorOrder}
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              [{activePoi.lat.toFixed(4)}, {activePoi.lng.toFixed(4)}]
            </span>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm">{activePoi.name}</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{activePoi.description}</p>
          </div>

          <div className="pt-2 border-t border-[#1e2738] flex flex-wrap items-center justify-between gap-2 text-[10px]">
            {onInspectNode && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onInspectNode(activePoi);
                }}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1 transition-colors"
              >
                <Target className="w-3 h-3" />
                <span>Inspect Node Details</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onSetDestination(activePoi.id);
                }}
                className="px-2.5 py-1 rounded bg-[#101726] border border-cyan-500/40 hover:bg-cyan-950 text-cyan-200 font-medium transition-colors"
              >
                Set Destination
              </button>
              <button
                type="button"
                onClick={() => onFastTravel(activePoi)}
                className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors"
              >
                Fast Travel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
