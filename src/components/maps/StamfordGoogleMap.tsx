import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  MapControl,
  ControlPosition,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Compass,
  Building2,
  TrainFront,
  Waves,
  Hospital,
  Car,
  Layers,
  Sparkles,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Crosshair,
  Footprints,
  Bike,
  Info,
  Shield,
  Zap,
  Target,
} from 'lucide-react';
import {
  STAMFORD_POIS,
  CORRIDOR_ROUTE_PRESETS,
  StamfordPOI,
  CorridorRoutePreset,
} from '../../data/stamfordLocations';
import { StamfordRouteRenderer, RouteCalculationResult } from './StamfordRouteRenderer';
import { StamfordVectorMap } from './StamfordVectorMap';
import { TACTICAL_DARK_MAP_STYLES } from './mapStyles';
import { PlayerProgress } from '../../types';
import { sound } from '../../services/audioService';

interface StamfordGoogleMapProps {
  progress?: PlayerProgress;
  setProgress?: React.Dispatch<React.SetStateAction<PlayerProgress>>;
  onWarpLocation?: (locationName: string, coords: { lat: number; lng: number }) => void;
  onInspectNode?: (poi: StamfordPOI) => void;
}

type MapTheme = 'tactical-dark' | 'standard' | 'hybrid';

export const StamfordGoogleMap: React.FC<StamfordGoogleMapProps> = ({
  progress,
  setProgress,
  onWarpLocation,
  onInspectNode,
}) => {
  const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
  const hasValidApiKey = Boolean(apiKey && apiKey !== '' && apiKey !== 'MY_GOOGLE_MAPS_API_KEY');

  // Active Route State
  const [selectedPreset, setSelectedPreset] = useState<CorridorRoutePreset>(
    CORRIDOR_ROUTE_PRESETS[0]
  );
  const [originId, setOriginId] = useState<string>(CORRIDOR_ROUTE_PRESETS[0].originId);
  const [destinationId, setDestinationId] = useState<string>(
    CORRIDOR_ROUTE_PRESETS[0].destinationId
  );
  const [travelMode, setTravelMode] = useState<'DRIVE' | 'WALK' | 'BICYCLE' | 'TRANSIT'>(
    CORRIDOR_ROUTE_PRESETS[0].defaultTravelMode
  );

  // Selected POI for Inspector & InfoWindow
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>('poi-hospital');
  const [infoWindowPoi, setInfoWindowPoi] = useState<StamfordPOI | null>(null);

  // Map theme & filters
  const [mapTheme, setMapTheme] = useState<MapTheme>('tactical-dark');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [routeResult, setRouteResult] = useState<RouteCalculationResult | null>(null);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Derive POIs
  const originPoi = useMemo(
    () => STAMFORD_POIS.find((p) => p.id === originId) || STAMFORD_POIS[0],
    [originId]
  );
  const destinationPoi = useMemo(
    () => STAMFORD_POIS.find((p) => p.id === destinationId) || STAMFORD_POIS[5],
    [destinationId]
  );

  // Intermediate waypoints from preset or selected
  const waypointPois = useMemo(() => {
    if (selectedPreset && selectedPreset.originId === originId && selectedPreset.destinationId === destinationId) {
      return selectedPreset.waypointIds
        .map((id) => STAMFORD_POIS.find((p) => p.id === id))
        .filter((p): p is StamfordPOI => Boolean(p));
    }
    return [];
  }, [selectedPreset, originId, destinationId]);

  const activePoi = useMemo(
    () => STAMFORD_POIS.find((p) => p.id === selectedPoiId) || null,
    [selectedPoiId]
  );

  const filteredPois = useMemo(() => {
    if (filterCategory === 'all') return STAMFORD_POIS;
    if (filterCategory === 'checkpoints') return STAMFORD_POIS.filter((p) => p.isCorridorCheckpoint);
    return STAMFORD_POIS.filter((p) => p.category === filterCategory);
  }, [filterCategory]);

  const handleApplyPreset = (preset: CorridorRoutePreset) => {
    setSelectedPreset(preset);
    setOriginId(preset.originId);
    setDestinationId(preset.destinationId);
    setTravelMode(preset.defaultTravelMode);
    setSelectedPoiId(preset.originId);
    sound.playClick();
    setStatusNotice(`Loaded preset: ${preset.name}`);
    setTimeout(() => setStatusNotice(null), 3500);
  };

  const handleSelectPoi = (poi: StamfordPOI) => {
    setSelectedPoiId(poi.id);
    setInfoWindowPoi(poi);
    sound.playClick();
  };

  const handleFastTravel = (poi: StamfordPOI) => {
    sound.playReward();
    if (setProgress) {
      setProgress((prev) => ({
        ...prev,
        lastWarpLocation: poi.name,
      }));
    }
    if (onWarpLocation) {
      onWarpLocation(poi.name, { lat: poi.lat, lng: poi.lng });
    }
    setStatusNotice(`Player coordinates calibrated to: ${poi.shortName}`);
    setTimeout(() => setStatusNotice(null), 3500);
  };

  const handleReverseRoute = () => {
    const prevOrigin = originId;
    setOriginId(destinationId);
    setDestinationId(prevOrigin);
    sound.playClick();
  };

  // Route calculation in autonomous Vector GIS mode (when Google Maps API key is not active)
  useEffect(() => {
    if (hasValidApiKey) return;

    const getHaversine = (p1: { lat: number; lng: number }, p2: { lat: number; lng: number }) => {
      const R = 6371e3; // meters
      const phi1 = (p1.lat * Math.PI) / 180;
      const phi2 = (p2.lat * Math.PI) / 180;
      const deltaPhi = ((p2.lat - p1.lat) * Math.PI) / 180;
      const deltaLambda = ((p2.lng - p1.lng) * Math.PI) / 180;
      const a =
        Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    let totalMeters = 0;
    const points = [
      { lat: originPoi.lat, lng: originPoi.lng },
      ...waypointPois.map((w) => ({ lat: w.lat, lng: w.lng })),
      { lat: destinationPoi.lat, lng: destinationPoi.lng },
    ];
    for (let i = 0; i < points.length - 1; i++) {
      totalMeters += getHaversine(points[i], points[i + 1]);
    }
    const roadMeters = Math.round(totalMeters * 1.28);
    const speed =
      travelMode === 'DRIVE' ? 11.2 : travelMode === 'BICYCLE' ? 4.8 : travelMode === 'TRANSIT' ? 8.5 : 1.35;
    const durationSeconds = Math.round(roadMeters / speed);
    const miles = (roadMeters * 0.000621371).toFixed(1);
    const km = (roadMeters / 1000).toFixed(1);
    const minutes = Math.max(1, Math.round(durationSeconds / 60));

    setRouteResult({
      distanceMeters: roadMeters,
      durationSeconds,
      formattedDistance: `${miles} mi (${km} km)`,
      formattedDuration: minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes} min`,
      status: 'computed',
      steps: [
        {
          instruction: `Depart ${originPoi.shortName} via Washington Blvd corridor`,
          distance: `${(parseFloat(miles) * 0.4).toFixed(1)} mi`,
        },
        ...waypointPois.map((w) => ({
          instruction: `Pass corridor checkpoint: ${w.shortName}`,
          distance: 'En route',
        })),
        {
          instruction: `Arrive at destination: ${destinationPoi.shortName}`,
          distance: `${(parseFloat(miles) * 0.6).toFixed(1)} mi`,
        },
      ],
    });
  }, [hasValidApiKey, originPoi, destinationPoi, waypointPois, travelMode]);

  return (
    <div className="space-y-4 font-mono text-slate-200">
      {/* Top Header Card */}
      <div className="rounded-xl border border-cyan-500/40 bg-[#080b12] p-4 sm:p-5 shadow-[0_0_25px_rgba(0,255,255,0.08)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/50 text-cyan-300">
                <Compass className="w-3 h-3 text-cyan-400" />
                {hasValidApiKey ? 'Google Maps Platform' : 'Vector GIS Simulation'}
              </span>
              <span className="text-[10px] text-slate-400">
                Stamford, CT Corridor · Unreal Engine Reference
              </span>
            </div>
            <h2 className="mt-1.5 text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>Stamford GIS Map & Route Planning</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 font-sans max-w-3xl leading-relaxed">
              Real-world geospatial anchoring for the Onegodia Stamford corridor. Explore canonical POIs from Stamford Hospital down Washington Boulevard and Stamford Station to Harbor Point, compute live Routes API paths, and cross-reference urban geometry with Unreal Engine 5 production notes.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] shrink-0">
            <div className="p-2.5 rounded-lg border border-[#1e2738] bg-[#0c121e]">
              <div className="text-slate-400">CORRIDOR SPAN</div>
              <div className="text-cyan-300 font-bold text-xs mt-0.5">Hospital → Harbor Pt</div>
              <div className="text-slate-500 text-[9px]">~2.1 mi (3.4 km)</div>
            </div>
            <div className="p-2.5 rounded-lg border border-[#1e2738] bg-[#0c121e]">
              <div className="text-slate-400">CURRENT ROUTE</div>
              <div className="text-amber-300 font-bold text-xs mt-0.5">
                {routeResult ? routeResult.formattedDistance : 'Calculating...'}
              </div>
              <div className="text-emerald-400 text-[9px]">
                {routeResult ? `Est. ${routeResult.formattedDuration}` : 'Live Route'}
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-[#1e2738] bg-[#0c121e] col-span-2 sm:col-span-1">
              <div className="text-slate-400">PLAYER WARP</div>
              <div className="text-purple-300 font-bold text-xs mt-0.5 truncate">
                {progress?.lastWarpLocation || 'Stamford Hospital'}
              </div>
              <div className="text-slate-500 text-[9px]">Synced to Game State</div>
            </div>
          </div>
        </div>

        {/* Status Toast */}
        {statusNotice && (
          <div className="mt-3 p-2 rounded bg-cyan-950/80 border border-cyan-500/60 text-cyan-200 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>{statusNotice}</span>
          </div>
        )}
      </div>

      {/* Preset Route Quick Selector */}
      <div className="p-3 rounded-xl border border-[#222d42] bg-[#090e18] flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 mr-1">
          <Navigation className="w-3.5 h-3.5" />
          Corridor Route Presets:
        </span>
        {CORRIDOR_ROUTE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleApplyPreset(preset)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedPreset?.id === preset.id
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400 shadow-sm'
                : 'bg-[#0f1626] text-slate-300 border border-[#222d42] hover:border-slate-500 hover:text-white'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Grid: Left Map, Right Route & POI Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
        {/* Map Container */}
        <div className="rounded-xl border border-[#222d42] bg-[#060910] overflow-hidden flex flex-col relative shadow-xl min-h-[580px] h-[640px]">
          {/* Map Toolbar Controls */}
          <div className="p-2.5 bg-[#0a0f1c] border-b border-[#222d42] flex flex-wrap items-center justify-between gap-2 z-10">
            {/* Filter POIs */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-400 mr-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-cyan-400" /> Layer:
              </span>
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  filterCategory === 'all'
                    ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All POIs ({STAMFORD_POIS.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('checkpoints')}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  filterCategory === 'checkpoints'
                    ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Corridor Run ({STAMFORD_POIS.filter((p) => p.isCorridorCheckpoint).length})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('transit')}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  filterCategory === 'transit'
                    ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Transit
              </button>
            </div>

            {/* Map Theme Toggle */}
            <div className="flex items-center gap-1 text-[10px]">
              <span className="text-slate-400 mr-1">Theme:</span>
              <button
                type="button"
                onClick={() => setMapTheme('tactical-dark')}
                className={`px-2 py-0.5 rounded ${
                  mapTheme === 'tactical-dark'
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-[#121828] text-slate-400 hover:text-white'
                }`}
              >
                Tactical Dark
              </button>
              <button
                type="button"
                onClick={() => setMapTheme('standard')}
                className={`px-2 py-0.5 rounded ${
                  mapTheme === 'standard'
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-[#121828] text-slate-400 hover:text-white'
                }`}
              >
                Roadmap
              </button>
              <button
                type="button"
                onClick={() => setMapTheme('hybrid')}
                className={`px-2 py-0.5 rounded ${
                  mapTheme === 'hybrid'
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'bg-[#121828] text-slate-400 hover:text-white'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>

          {/* Map Viewport: Conditionally Render Live Google Maps or Autonomous Vector GIS */}
          <div className="relative flex-1 w-full h-full min-h-[500px]">
            {hasValidApiKey ? (
              <APIProvider apiKey={apiKey} libraries={['routes', 'marker', 'geometry', 'places']}>
                <Map
                  style={{ width: '100%', height: '100%' }}
                  defaultCenter={{ lat: 41.0535, lng: -73.5435 }}
                  defaultZoom={14}
                  mapId="DEMO_MAP_ID"
                  mapTypeId={
                    mapTheme === 'hybrid'
                      ? 'hybrid'
                      : mapTheme === 'tactical-dark'
                      ? 'roadmap'
                      : 'roadmap'
                  }
                  styles={mapTheme === 'tactical-dark' ? TACTICAL_DARK_MAP_STYLES : undefined}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    streetViewControl: true,
                    mapTypeControl: false,
                    fullscreenControl: true,
                  }}
                  internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                >
                  {/* Real-World Route Renderer */}
                  <StamfordRouteRenderer
                    origin={{ lat: originPoi.lat, lng: originPoi.lng, name: originPoi.name }}
                    destination={{
                      lat: destinationPoi.lat,
                      lng: destinationPoi.lng,
                      name: destinationPoi.name,
                    }}
                    waypoints={waypointPois.map((w) => ({
                      lat: w.lat,
                      lng: w.lng,
                      name: w.name,
                    }))}
                    travelMode={travelMode}
                    strokeColor="#00ffff"
                    onRouteCalculated={setRouteResult}
                  />

                  {/* Render Advanced Markers for Stamford POIs */}
                  {filteredPois.map((poi) => {
                    const isSelected = selectedPoiId === poi.id;
                    const isOrigin = originId === poi.id;
                    const isDestination = destinationId === poi.id;
                    const isWaypoint = waypointPois.some((w) => w.id === poi.id);

                    return (
                      <AdvancedMarker
                        key={poi.id}
                        position={{ lat: poi.lat, lng: poi.lng }}
                        title={poi.name}
                        onClick={() => handleSelectPoi(poi)}
                      >
                        <Pin
                          background={
                            isOrigin
                              ? '#10b981' // Green start
                              : isDestination
                              ? '#a855f7' // Purple end
                              : isWaypoint
                              ? '#06b6d4' // Cyan waypoint
                              : poi.color
                          }
                          borderColor="#050608"
                          glyphColor="#ffffff"
                          scale={isSelected || isOrigin || isDestination ? 1.35 : 1.0}
                        />
                      </AdvancedMarker>
                    );
                  })}

                  {/* InfoWindow for Clicked POI */}
                  {infoWindowPoi && (
                    <InfoWindow
                      position={{ lat: infoWindowPoi.lat, lng: infoWindowPoi.lng }}
                      onCloseClick={() => setInfoWindowPoi(null)}
                    >
                      <div className="p-1 max-w-[240px] text-slate-900 font-sans">
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cyan-800">
                          <span>{infoWindowPoi.category}</span>
                          {infoWindowPoi.isCorridorCheckpoint && (
                            <span className="px-1 rounded bg-cyan-100 text-cyan-900 text-[9px]">
                              Checkpoint #{infoWindowPoi.corridorOrder}
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-xs mt-0.5 text-slate-950">
                          {infoWindowPoi.name}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                          {infoWindowPoi.description}
                        </p>
                        <div className="mt-2 pt-1 border-t border-slate-200 flex items-center justify-between text-[10px] gap-2">
                          {onInspectNode && (
                            <button
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                onInspectNode(infoWindowPoi);
                              }}
                              className="px-1.5 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1"
                            >
                              <Target className="w-2.5 h-2.5" />
                              <span>Inspect Node</span>
                            </button>
                          )}
                          <div className="flex items-center gap-1.5 ml-auto">
                            <button
                              type="button"
                              onClick={() => {
                                setDestinationId(infoWindowPoi.id);
                                sound.playClick();
                              }}
                              className="text-cyan-700 hover:text-cyan-900 font-semibold underline"
                            >
                              Route
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFastTravel(infoWindowPoi)}
                              className="px-1.5 py-0.5 rounded bg-cyan-700 hover:bg-cyan-800 text-white font-medium"
                            >
                              Warp
                            </button>
                          </div>
                        </div>
                      </div>
                    </InfoWindow>
                  )}

                  {/* Map Control: Legend HUD Overlay */}
                  <MapControl position={ControlPosition.TOP_LEFT}>
                    <div className="m-3 p-2.5 rounded-lg bg-[#080d18]/90 border border-cyan-500/40 text-cyan-200 backdrop-blur shadow-lg text-[10px] space-y-1 font-mono pointer-events-auto">
                      <div className="flex items-center gap-1.5 font-bold text-white uppercase text-[11px]">
                        <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Live GIS Corridor</span>
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
                  </MapControl>
                </Map>
              </APIProvider>
            ) : (
              <StamfordVectorMap
                originPoi={originPoi}
                destinationPoi={destinationPoi}
                waypointPois={waypointPois}
                filteredPois={filteredPois}
                selectedPoiId={selectedPoiId}
                onSelectPoi={handleSelectPoi}
                onInspectNode={onInspectNode}
                onSetDestination={(id) => {
                  setDestinationId(id);
                  sound.playClick();
                }}
                onFastTravel={handleFastTravel}
                travelMode={travelMode}
                mapTheme={mapTheme}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar: Route Planner & Unreal Reference Inspector */}
        <div className="space-y-4">
          {/* Route Planning Card */}
          <div className="p-4 rounded-xl border border-[#222d42] bg-[#090e18] space-y-3">
            <div className="flex items-center justify-between border-b border-[#1e2738] pb-2">
              <span className="font-bold text-xs text-cyan-400 uppercase flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                Route Planning
              </span>
              <button
                type="button"
                onClick={handleReverseRoute}
                className="p-1 rounded hover:bg-[#121828] text-slate-400 hover:text-white"
                title="Reverse Origin and Destination"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            {/* Origin & Destination Selectors */}
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[10px] text-emerald-400 font-semibold uppercase flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Origin (Start)
                </label>
                <select
                  value={originId}
                  onChange={(e) => {
                    setOriginId(e.target.value);
                    sound.playClick();
                  }}
                  className="mt-1 w-full rounded-lg border border-[#222d42] bg-[#0c121e] px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  {STAMFORD_POIS.map((poi) => (
                    <option key={`origin-${poi.id}`} value={poi.id}>
                      {poi.isCorridorCheckpoint ? `[#${poi.corridorOrder}] ` : ''}
                      {poi.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-purple-400 font-semibold uppercase flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span> Destination
                </label>
                <select
                  value={destinationId}
                  onChange={(e) => {
                    setDestinationId(e.target.value);
                    sound.playClick();
                  }}
                  className="mt-1 w-full rounded-lg border border-[#222d42] bg-[#0c121e] px-2.5 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  {STAMFORD_POIS.map((poi) => (
                    <option key={`dest-${poi.id}`} value={poi.id}>
                      {poi.isCorridorCheckpoint ? `[#${poi.corridorOrder}] ` : ''}
                      {poi.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Travel Mode Selector */}
            <div className="pt-2 border-t border-[#1e2738]">
              <div className="text-[10px] text-slate-400 mb-1.5 uppercase font-semibold">Travel Mode:</div>
              <div className="grid grid-cols-4 gap-1">
                {(['DRIVE', 'WALK', 'BICYCLE', 'TRANSIT'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      setTravelMode(mode);
                      sound.playClick();
                    }}
                    className={`p-1.5 rounded text-[10px] flex flex-col items-center justify-center gap-0.5 transition-all ${
                      travelMode === mode
                        ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400'
                        : 'bg-[#0c121e] text-slate-400 hover:text-white border border-[#1e2738]'
                    }`}
                  >
                    {mode === 'DRIVE' && <Car className="w-3.5 h-3.5" />}
                    {mode === 'WALK' && <Footprints className="w-3.5 h-3.5" />}
                    {mode === 'BICYCLE' && <Bike className="w-3.5 h-3.5" />}
                    {mode === 'TRANSIT' && <TrainFront className="w-3.5 h-3.5" />}
                    <span>{mode}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Computed Route Telemetry */}
            {routeResult && (
              <div className="p-2.5 rounded-lg bg-[#0c121e] border border-cyan-500/30 space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Total Distance:</span>
                  <span className="font-bold text-cyan-300 font-mono">
                    {routeResult.formattedDistance}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Est. Travel Time:</span>
                  <span className="font-bold text-amber-300 font-mono">
                    {routeResult.formattedDuration}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-[#1e2738]">
                  <span>Calculation Engine:</span>
                  <span className="text-emerald-400 font-mono">
                    {routeResult.status === 'computed' ? 'Routes API v2' : 'Geodesic Corridor'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Selected POI Real-World & Unreal Reference Inspector */}
          {activePoi ? (
            <div className="p-4 rounded-xl border border-cyan-500/40 bg-[#090e18] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  POI Inspector
                </span>
                <span
                  className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase"
                  style={{ backgroundColor: `${activePoi.color}25`, color: activePoi.color }}
                >
                  {activePoi.category}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{activePoi.name}</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{activePoi.address}</p>
                <div className="text-[10px] text-cyan-300 font-mono mt-0.5">
                  GPS: [{activePoi.lat.toFixed(4)}° N, {Math.abs(activePoi.lng).toFixed(4)}° W]
                </div>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {activePoi.description}
              </p>

              {/* Urban Features */}
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  Observed Urban Features:
                </div>
                <ul className="text-[11px] text-slate-300 font-sans list-disc list-inside space-y-0.5">
                  {activePoi.urbanFeatures.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>

              {/* Unreal Engine Production Reference */}
              <div className="p-2.5 rounded-lg bg-[#060910] border border-purple-500/30 space-y-1">
                <div className="text-[10px] text-purple-300 font-bold uppercase flex items-center gap-1">
                  <Zap className="w-3 h-3 text-purple-400" />
                  Unreal 5 Corridor Spec:
                </div>
                <ul className="text-[10px] text-slate-300 font-sans space-y-0.5">
                  {activePoi.unrealNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-purple-400">›</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {onInspectNode && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      onInspectNode(activePoi);
                    }}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/30 font-mono uppercase"
                  >
                    <Target className="w-3.5 h-3.5" />
                    <span>Inspect Game Node & Objectives</span>
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleFastTravel(activePoi)}
                    className="flex-1 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                  >
                    <Navigation className="w-3 h-3" />
                    Fast Travel / Warp
                  </button>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${activePoi.name}, ${activePoi.address}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg border border-[#222d42] bg-[#0c121e] text-slate-300 hover:text-white flex items-center justify-center"
                    title="View on Google Maps"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-[#222d42] bg-[#090e18] text-center text-xs text-slate-400">
              Click any map marker to inspect real-world POI data and Unreal Engine notes.
            </div>
          )}
        </div>
      </div>

      {/* Corridor Landmarks Reference Grid */}
      <div className="p-4 rounded-xl border border-[#222d42] bg-[#080d18] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-400 uppercase flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            Canonical Stamford Corridor Checkpoints
          </span>
          <span className="text-[10px] text-slate-400">
            STAMFORD_STATION_REFERENCE_PASS.md Alignment
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {STAMFORD_POIS.filter((p) => p.isCorridorCheckpoint).map((poi) => {
            const isSelected = selectedPoiId === poi.id;
            return (
              <div
                key={poi.id}
                onClick={() => handleSelectPoi(poi)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-md'
                    : 'border-[#1e2738] bg-[#0c121e] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: poi.color }}
                    ></span>
                    <span className="font-bold text-xs text-white">
                      #{poi.corridorOrder} · {poi.shortName}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">
                    [{poi.lat.toFixed(3)}, {poi.lng.toFixed(3)}]
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-sans line-clamp-2">
                  {poi.description}
                </div>
                <div className="mt-2 pt-1 border-t border-[#1e2738] flex items-center justify-between text-[10px]">
                  <span className="text-cyan-400 font-mono">{poi.category}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFastTravel(poi);
                    }}
                    className="text-amber-400 hover:text-amber-300 font-mono underline"
                  >
                    Warp
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
