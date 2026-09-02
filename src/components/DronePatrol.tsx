import React from 'react';
import { ShieldAlert, AlertTriangle, Crosshair, Radio, Eye, Activity } from 'lucide-react';

export interface SentinelWaypoint {
  x: number;
  y: number;
  label?: string;
  holdTimeSec?: number;
}

export interface SentinelDroneData {
  id: string;
  name: string;
  sector: string;
  x: number;
  y: number;
  angle: number; // in degrees (0 to 360)
  speed: number;
  visionRadius: number;
  visionAngle: number; // FOV angle in degrees
  waypoints: SentinelWaypoint[];
  currentWaypointIndex: number;
  state: 'patrolling' | 'investigating' | 'alerted';
  threatLevel: 'Low' | 'Moderate' | 'Critical';
  color: string;
}

// Initial tactical sentinel drone configurations patrolling Sector 7 & Transit Choke Points
export const INITIAL_SENTINEL_DRONES: SentinelDroneData[] = [
  {
    id: 'sentinel-alpha',
    name: 'Sentinel Unit Alpha-01',
    sector: 'Sector 7 Outpost Perimeter',
    x: 820,
    y: 220,
    angle: 45,
    speed: 0.85,
    visionRadius: 160,
    visionAngle: 70,
    waypoints: [
      { x: 820, y: 200, label: 'Node Alpha Recon' },
      { x: 960, y: 220, label: 'Outpost North Choke' },
      { x: 980, y: 340, label: 'East Grid Perimeter' },
      { x: 850, y: 320, label: 'Relay Approach Point' }
    ],
    currentWaypointIndex: 0,
    state: 'patrolling',
    threatLevel: 'Critical',
    color: '#ef4444' // Red
  },
  {
    id: 'sentinel-beta',
    name: 'Sentinel Unit Beta-02',
    sector: 'Transit Highway Corridor',
    x: 520,
    y: 310,
    angle: 180,
    speed: 0.7,
    visionRadius: 140,
    visionAngle: 60,
    waypoints: [
      { x: 440, y: 320, label: 'Highway Overpass West' },
      { x: 620, y: 290, label: 'Highway Junction East' },
      { x: 680, y: 360, label: 'South Transit Intercept' },
      { x: 480, y: 380, label: 'Underpass Security Gate' }
    ],
    currentWaypointIndex: 0,
    state: 'patrolling',
    threatLevel: 'Moderate',
    color: '#f59e0b' // Amber
  },
  {
    id: 'sentinel-gamma',
    name: 'Sentinel Unit Gamma-03',
    sector: 'Digital Node #001 Core',
    x: 900,
    y: 200,
    angle: 90,
    speed: 0.6,
    visionRadius: 130,
    visionAngle: 80,
    waypoints: [
      { x: 890, y: 190, label: 'Shrine North Orbit' },
      { x: 950, y: 240, label: 'Shrine East Orbit' },
      { x: 930, y: 290, label: 'Shrine South Orbit' },
      { x: 870, y: 250, label: 'Shrine West Orbit' }
    ],
    currentWaypointIndex: 0,
    state: 'patrolling',
    threatLevel: 'Critical',
    color: '#f43f5e' // Rose
  }
];

/**
 * Normalizes an angle to the [-180, 180] range in degrees
 */
export function normalizeAngleDiff(angleDeg: number): number {
  let diff = (angleDeg + 180) % 360;
  if (diff < 0) diff += 360;
  return diff - 180;
}

/**
 * Checks if a target point (e.g. player) is inside a sentinel drone's vision cone or proximity bubble
 */
export function checkPointInVisionCone(
  point: { x: number; y: number },
  drone: SentinelDroneData
): { isDetected: boolean; distance: number; angleDiff: number; proximityAlert: boolean } {
  const dx = point.x - drone.x;
  const dy = point.y - drone.y;
  const distance = Math.hypot(dx, dy);

  // Proximity touch radius (immediate lock-on if player is extremely close, e.g. within 35 units)
  const proximityRadius = 38;
  if (distance <= proximityRadius) {
    return {
      isDetected: true,
      distance,
      angleDiff: 0,
      proximityAlert: true
    };
  }

  // If outside the vision radius, no detection
  if (distance > drone.visionRadius) {
    return {
      isDetected: false,
      distance,
      angleDiff: 180,
      proximityAlert: false
    };
  }

  // Calculate angle from drone to point in degrees
  const angleToPoint = (Math.atan2(dy, dx) * 180) / Math.PI;
  const angleDiff = Math.abs(normalizeAngleDiff(angleToPoint - drone.angle));

  // Detected if within half the vision cone FOV
  const isDetected = angleDiff <= drone.visionAngle / 2;

  return {
    isDetected,
    distance,
    angleDiff,
    proximityAlert: false
  };
}

/**
 * AI Step Calculation: Moves drone towards current waypoint and rotates heading smoothly
 */
export function updateDroneAI(
  drone: SentinelDroneData,
  playerPos: { x: number; y: number },
  speedMultiplier: number = 1
): SentinelDroneData {
  const currentWaypoint = drone.waypoints[drone.currentWaypointIndex];
  if (!currentWaypoint) return drone;

  const dx = currentWaypoint.x - drone.x;
  const dy = currentWaypoint.y - drone.y;
  const distToWaypoint = Math.hypot(dx, dy);

  // Target angle towards waypoint in degrees
  let targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (targetAngle < 0) targetAngle += 360;

  // Check if player is detected to switch state
  const detection = checkPointInVisionCone(playerPos, drone);
  let nextState: 'patrolling' | 'investigating' | 'alerted' = 'patrolling';

  if (detection.isDetected) {
    nextState = 'alerted';
    // Lock heading directly onto player when alerted
    const pDx = playerPos.x - drone.x;
    const pDy = playerPos.y - drone.y;
    targetAngle = (Math.atan2(pDy, pDx) * 180) / Math.PI;
    if (targetAngle < 0) targetAngle += 360;
  } else if (detection.distance < drone.visionRadius * 1.3) {
    nextState = 'investigating';
  }

  // Smooth rotational steering towards target angle
  const angleDiff = normalizeAngleDiff(targetAngle - drone.angle);
  const turnSpeed = nextState === 'alerted' ? 5.5 : 2.8;
  const angleStep = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), turnSpeed * speedMultiplier);
  let newAngle = (drone.angle + angleStep) % 360;
  if (newAngle < 0) newAngle += 360;

  // Linear movement towards waypoint
  const currentSpeed = (nextState === 'alerted' ? drone.speed * 1.35 : drone.speed) * speedMultiplier;
  let newX = drone.x;
  let newY = drone.y;
  let nextWaypointIndex = drone.currentWaypointIndex;

  if (distToWaypoint < 8) {
    // Reached waypoint, advance to next in patrol circuit
    nextWaypointIndex = (drone.currentWaypointIndex + 1) % drone.waypoints.length;
  } else {
    // Move along current forward angle
    const rad = (newAngle * Math.PI) / 180;
    newX += Math.cos(rad) * currentSpeed;
    newY += Math.sin(rad) * currentSpeed;
  }

  return {
    ...drone,
    x: newX,
    y: newY,
    angle: newAngle,
    currentWaypointIndex: nextWaypointIndex,
    state: nextState
  };
}

/**
 * Generates an SVG path string for a vision cone given position, radius, angle, and FOV
 */
export function getVisionConeSvgPath(
  x: number,
  y: number,
  radius: number,
  angleDeg: number,
  fovDeg: number
): string {
  const halfFov = fovDeg / 2;
  const startAngle = (angleDeg - halfFov) * (Math.PI / 180);
  const endAngle = (angleDeg + halfFov) * (Math.PI / 180);

  const x1 = x + radius * Math.cos(startAngle);
  const y1 = y + radius * Math.sin(startAngle);
  const x2 = x + radius * Math.cos(endAngle);
  const y2 = y + radius * Math.sin(endAngle);

  // SVG arc flag: large-arc is 0 for fov < 180
  const largeArcFlag = fovDeg > 180 ? 1 : 0;

  return `M ${x} ${y} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
}

interface SentinelDroneProps {
  drone: SentinelDroneData;
  playerPos: { x: number; y: number };
  showPatrolRoutes?: boolean;
  showVisionCones?: boolean;
  isMapScale?: boolean;
  worldWidth?: number;
  worldHeight?: number;
}

/**
 * SentinelDrone component renders the drone, vision cone, patrol route, and status cues on the Tactical HUD radar.
 */
export const SentinelDrone: React.FC<SentinelDroneProps> = ({
  drone,
  playerPos,
  showPatrolRoutes = true,
  showVisionCones = true,
  worldWidth = 1200,
  worldHeight = 800
}) => {
  const detection = checkPointInVisionCone(playerPos, drone);
  const isAlerted = drone.state === 'alerted' || detection.isDetected;

  // Normalized percentages for map canvas placement
  const percentX = (drone.x / worldWidth) * 100;
  const percentY = (drone.y / worldHeight) * 100;

  // Build SVG path for patrol route
  const patrolPathD = drone.waypoints.length > 1
    ? `M ${drone.waypoints.map(wp => `${wp.x} ${wp.y}`).join(' L ')} Z`
    : '';

  // SVG Vision Cone Path
  const conePath = getVisionConeSvgPath(
    drone.x,
    drone.y,
    drone.visionRadius,
    drone.angle,
    drone.visionAngle
  );

  return (
    <>
      {/* SVG Layer for Patrol Paths, Waypoints, and Vision Cones in World Coordinate Space */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox={`0 0 ${worldWidth} ${worldHeight}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Vision Cone Gradient (Normal Patrol vs Alert Lock-on) */}
          <radialGradient id={`cone-grad-${drone.id}`} cx="0%" cy="0%" r="100%">
            <stop 
              offset="0%" 
              stopColor={isAlerted ? '#ef4444' : drone.color} 
              stopOpacity={isAlerted ? 0.65 : 0.28} 
            />
            <stop 
              offset="70%" 
              stopColor={isAlerted ? '#dc2626' : drone.color} 
              stopOpacity={isAlerted ? 0.4 : 0.12} 
            />
            <stop 
              offset="100%" 
              stopColor={isAlerted ? '#b91c1c' : drone.color} 
              stopOpacity={0.0} 
            />
          </radialGradient>

          {/* Alert Pulse Filter */}
          <filter id={`glow-${drone.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={isAlerted ? "4" : "2"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Patrol Route Path Line */}
        {showPatrolRoutes && patrolPathD && (
          <g opacity={0.8}>
            {/* Background path glow */}
            <path
              d={patrolPathD}
              fill="none"
              stroke={drone.color}
              strokeWidth="2"
              strokeDasharray="6 4"
              strokeOpacity="0.4"
            />
            {/* Animated trajectory beam */}
            <path
              d={patrolPathD}
              fill="none"
              stroke={isAlerted ? '#ef4444' : drone.color}
              strokeWidth="1.5"
              strokeDasharray="8 6"
              strokeDashoffset="0"
              className="animate-pulse"
              strokeOpacity="0.75"
            />

            {/* Waypoint Nodes along the route */}
            {drone.waypoints.map((wp, idx) => {
              const isCurrent = idx === drone.currentWaypointIndex;
              return (
                <g key={`${drone.id}-wp-${idx}`} transform={`translate(${wp.x}, ${wp.y})`}>
                  <circle
                    r={isCurrent ? 5 : 3.5}
                    fill={isCurrent ? '#ffffff' : '#0c0e14'}
                    stroke={drone.color}
                    strokeWidth={isCurrent ? 2 : 1.2}
                    filter={isCurrent ? `url(#glow-${drone.id})` : undefined}
                  />
                  {isCurrent && (
                    <circle
                      r="9"
                      fill="none"
                      stroke={drone.color}
                      strokeWidth="1"
                      strokeDasharray="2 2"
                      className="animate-spin origin-center"
                    />
                  )}
                </g>
              );
            })}

            {/* Vector line from drone to active target waypoint */}
            {drone.waypoints[drone.currentWaypointIndex] && (
              <line
                x1={drone.x}
                y1={drone.y}
                x2={drone.waypoints[drone.currentWaypointIndex].x}
                y2={drone.waypoints[drone.currentWaypointIndex].y}
                stroke={isAlerted ? '#ef4444' : drone.color}
                strokeWidth="1.2"
                strokeDasharray="3 3"
                strokeOpacity="0.7"
              />
            )}
          </g>
        )}

        {/* Vision Cone Area */}
        {showVisionCones && (
          <g>
            <path
              d={conePath}
              fill={`url(#cone-grad-${drone.id})`}
              stroke={isAlerted ? '#ef4444' : drone.color}
              strokeWidth={isAlerted ? '2' : '1'}
              strokeOpacity={isAlerted ? '0.9' : '0.4'}
              filter={`url(#glow-${drone.id})`}
            />

            {/* Scanning Arc Laser Sweep Line */}
            <path
              d={conePath}
              fill="none"
              stroke={isAlerted ? '#ffffff' : drone.color}
              strokeWidth={isAlerted ? '1.5' : '0.8'}
              strokeDasharray={isAlerted ? '4 2' : '6 4'}
              opacity={0.8}
            />

            {/* Proximity Core Circle */}
            <circle
              cx={drone.x}
              cy={drone.y}
              r="38"
              fill={isAlerted ? 'rgba(239, 68, 68, 0.25)' : 'none'}
              stroke={isAlerted ? '#ef4444' : drone.color}
              strokeWidth="1"
              strokeDasharray="2 2"
              strokeOpacity={isAlerted ? 0.9 : 0.3}
            />
          </g>
        )}
      </svg>

      {/* Drone Body Marker Overlay */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto z-20 group"
        style={{
          left: `${percentX}%`,
          top: `${percentY}%`,
        }}
      >
        {/* Pulsing Lock-On Target Aura if Alerted */}
        {isAlerted && (
          <div className="absolute -inset-4 rounded-full border-2 border-red-500 bg-red-500/20 animate-ping pointer-events-none"></div>
        )}

        {/* Drone Hardware Chassis Container */}
        <div
          className={`relative w-7 h-7 rounded-lg border flex items-center justify-center transition-transform shadow-lg ${
            isAlerted
              ? 'bg-red-950/90 border-red-500 shadow-red-500/50 scale-110'
              : 'bg-[#0f1118]/90 border-[#1e2230] shadow-black/80 hover:border-slate-400'
          }`}
          style={{ borderColor: isAlerted ? '#ef4444' : drone.color }}
        >
          {/* Rotational Direction Arrow on Chassis */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-75"
            style={{ transform: `rotate(${drone.angle + 90}deg)` }}
          >
            <div 
              className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[8px] -translate-y-3"
              style={{ borderBottomColor: isAlerted ? '#ef4444' : drone.color }}
            />
          </div>

          {/* Central Eye / Sensor Hub */}
          <div
            className={`w-2.5 h-2.5 rounded-full flex items-center justify-center ${
              isAlerted ? 'bg-red-500 animate-pulse' : 'bg-slate-300'
            }`}
            style={{ backgroundColor: isAlerted ? '#ef4444' : drone.color }}
          >
            <div className="w-1 h-1 rounded-full bg-white"></div>
          </div>
        </div>

        {/* Drone Hover Information Pill / Callout */}
        <div className={`absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap border pointer-events-none transition-all z-30 flex items-center gap-1 shadow-md ${
          isAlerted
            ? 'opacity-100 bg-red-950/95 border-red-500 text-red-200'
            : 'opacity-0 group-hover:opacity-100 bg-[#0c0e14]/95 border-[#1e2230] text-slate-300'
        }`}>
          {isAlerted ? (
            <>
              <AlertTriangle className="w-2.5 h-2.5 text-red-400 animate-bounce" />
              <span className="font-bold text-red-300">LOCK-ON DETECTED</span>
            </>
          ) : (
            <>
              <Crosshair className="w-2.5 h-2.5 text-slate-400" />
              <span>{drone.name}</span>
            </>
          )}
        </div>
      </div>
    </>
  );
};
