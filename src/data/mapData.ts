import { MapLandmark } from '../types';

export const SECTOR_7_LANDMARKS: MapLandmark[] = [
  {
    id: 'sec-hub',
    code: 'DIST-01',
    name: 'Onegodia Safe Hub Plaza',
    district: 'Central Sanctuary Core',
    coords: { x: 240, y: 400 },
    elevation: '+12m (Ground Tier)',
    type: 'Safe Sanctuary',
    threatLevel: 'Safe Haven',
    status: 'Sanctuary Shield Active',
    description: 'The primary operations center of Onegodia. Houses Aria Pulse HQ, Operative Terminal Relays, Warp Pad Alpha, and civilian holographic trade kiosks.',
    strategicIntel: 'Weapons discharge and Sentinel hostile scans are strictly disabled inside the plasma barrier. Safe for re-calibration, vehicle customization, and mission debriefs.',
    fastTravelAvailable: true,
    color: '#3b82f6',
    iconName: 'Shield',
    discovered: true,
    associatedMissions: ['MISSION_001_REBUILDING_SIGNAL']
  },
  {
    id: 'sec-highway',
    code: 'DIST-02',
    name: 'Sector 7 Cyber-Highway Arteries',
    district: 'Vehicular Transit Corridor',
    coords: { x: 520, y: 330 },
    elevation: '+45m (Elevated Skyway)',
    type: 'Transit Hub',
    threatLevel: 'Low Risk',
    status: 'Speed Monitoring Active (120 km/h)',
    description: 'Multi-lane cybernetic highway system with magnetic acceleration rails connecting the central hub to outer resource nodes and industrial sectors.',
    strategicIntel: 'Ideal test course for the Cyber-Cruiser prototype. Beware of intermittent Sentinel Beta patrol drones monitoring highway speed lanes.',
    fastTravelAvailable: true,
    color: '#06b6d4',
    iconName: 'Car',
    discovered: true,
    associatedMissions: ['MISSION_001_REBUILDING_SIGNAL']
  },
  {
    id: 'sec-node-1',
    code: 'DIST-03',
    name: 'Digital Node #001 & Signal Shrine',
    district: 'Eastern Resonance Enclave',
    coords: { x: 920, y: 260 },
    elevation: '+85m (Monolith Apex)',
    type: 'Digital Node',
    threatLevel: 'Hazardous',
    status: 'Signal Frequency Purified / Monitored',
    description: 'Sacred data relay monolith that radiates photonic signal resonance. Serves as the primary objective in Mission 001 Rebuilding the Signal.',
    strategicIntel: 'Emits a 30m photonic scanning zone. Operatives must complete frequency synchronization to decrypt high-tier Onegodia telemetry packets.',
    fastTravelAvailable: true,
    color: '#10b981',
    iconName: 'Radio',
    discovered: true,
    associatedMissions: ['MISSION_001_REBUILDING_SIGNAL'],
    lootAvailable: true
  },
  {
    id: 'sec-relic-quarry',
    code: 'DIST-04',
    name: 'Data Cache Ruins & Fragment Quarry',
    district: 'Eastern Outskirts Basin',
    coords: { x: 1040, y: 480 },
    elevation: '-18m (Sub-Surface Pit)',
    type: 'Relic Quarry',
    threatLevel: 'Moderate',
    status: 'Ancient Data Crystallization Detected',
    description: 'Sub-level archaeological dig containing fragmented memory crystalline matrices from the pre-digital era of Onegodia.',
    strategicIntel: 'Houses Data Fragment #001 and legacy encryption caches. High background radiation signatures detected.',
    fastTravelAvailable: true,
    color: '#a855f7',
    iconName: 'Sparkles',
    discovered: true,
    associatedMissions: ['MISSION_001_REBUILDING_SIGNAL'],
    lootAvailable: true
  },
  {
    id: 'sec-sentinel-bastion',
    code: 'DIST-05',
    name: 'Sentinel Airborne Bastion & Watchtower',
    district: 'Northern Airspace Command',
    coords: { x: 820, y: 150 },
    elevation: '+180m (Fortified Pinnacle)',
    type: 'Sentinel Hive',
    threatLevel: 'Critical Lockdown',
    status: 'Automated AI Patrols Active',
    description: 'Autonomous launch base for Sentinel Units Alpha, Beta, and Gamma. Armed with tracking radar sweeps and automated security vision cones.',
    strategicIntel: 'Trespassing operatives trigger immediate 5.0s emergency extraction alarms. Exercise extreme stealth or use high-speed vehicle maneuvers to bypass.',
    fastTravelAvailable: false,
    color: '#ef4444',
    iconName: 'ShieldAlert',
    discovered: true,
    associatedMissions: ['MISSION_001_REBUILDING_SIGNAL']
  },
  {
    id: 'sec-aqueduct',
    code: 'DIST-06',
    name: 'Southern Sub-Grid Aqueduct & Canals',
    district: 'Industrial Drainage Sector',
    coords: { x: 420, y: 640 },
    elevation: '-35m (Subterranean Canal)',
    type: 'Sub-Grid Aqueduct',
    threatLevel: 'Low Risk',
    status: 'Coolant Flow Optimal',
    description: 'Underground cyber-coolant drainage waterways cooling the reactor cores of the central Onegodia supercomputer infrastructure.',
    strategicIntel: 'Features underground tunnels offering discreet stealth transit away from aerial Sentinel radar sweeps.',
    fastTravelAvailable: true,
    color: '#38bdf8',
    iconName: 'Layers',
    discovered: true
  },
  {
    id: 'sec-perimeter-gate',
    code: 'DIST-07',
    name: 'West Outpost Perimeter Gate',
    district: 'Western Frontier Defense',
    coords: { x: 120, y: 220 },
    elevation: '+24m (Outpost Ridge)',
    type: 'Perimeter Gate',
    threatLevel: 'Moderate',
    status: 'Defensive Kinetic Barrier Nominal',
    description: 'Heavy reinforced security gate overlooking the uncharted wasteland zones bordering the digital grid of Sector 7.',
    strategicIntel: 'Direct transit point towards future Expansion Sectors (Sector 8 & 9). Key reconnaissance post for early threat detection.',
    fastTravelAvailable: true,
    color: '#eab308',
    iconName: 'Flag',
    discovered: false
  },
  {
    id: 'sec-telecom-spire',
    code: 'DIST-08',
    name: 'Genesis Global Telecom Spire',
    district: 'North-Central Broadcast Enclave',
    coords: { x: 680, y: 130 },
    elevation: '+240m (High-Altitude Spire)',
    type: 'Telecom Spire',
    threatLevel: 'Moderate',
    status: 'Global Satellite Relay 99.8% Uplink',
    description: 'Gigantic holographic transmitter beaming real-time telemetry across the Onegodian ecosystem and connecting external API web nodes.',
    strategicIntel: 'Operatives syncing with this spire receive instant radar grid de-fogging for all surrounding sub-sectors.',
    fastTravelAvailable: true,
    color: '#ec4899',
    iconName: 'Zap',
    discovered: true
  }
];

export interface MapRegion {
  id: string;
  name: string;
  polygon: [number, number][];
  fillColor: string;
  strokeColor: string;
  dangerRating: 'Safe' | 'Low' | 'Moderate' | 'High' | 'Extreme';
  description: string;
}

export const SECTOR_7_REGIONS: MapRegion[] = [
  {
    id: 'reg-hub',
    name: 'District 1: Safe Hub Sanctuary Zone',
    polygon: [
      [80, 280],
      [380, 280],
      [420, 520],
      [140, 560],
      [60, 420]
    ],
    fillColor: 'rgba(59, 130, 246, 0.08)',
    strokeColor: 'rgba(59, 130, 246, 0.4)',
    dangerRating: 'Safe',
    description: 'Zero hostility zone protected by quantum shield barrier.'
  },
  {
    id: 'reg-transit',
    name: 'District 2: Highway Transit Grid',
    polygon: [
      [380, 260],
      [760, 240],
      [800, 420],
      [420, 480]
    ],
    fillColor: 'rgba(6, 182, 212, 0.06)',
    strokeColor: 'rgba(6, 182, 212, 0.35)',
    dangerRating: 'Low',
    description: 'High-speed tarmac for Cyber-Cruisers with automated speed cameras.'
  },
  {
    id: 'reg-node-shrine',
    name: 'District 3: Signal Monolith Zone',
    polygon: [
      [780, 160],
      [1080, 180],
      [1140, 390],
      [840, 390]
    ],
    fillColor: 'rgba(16, 185, 129, 0.07)',
    strokeColor: 'rgba(16, 185, 129, 0.45)',
    dangerRating: 'Moderate',
    description: 'Electromagnetic energy field around sacred signal spire.'
  },
  {
    id: 'reg-quarry',
    name: 'District 4: Relic Excavation Quarry',
    polygon: [
      [880, 410],
      [1160, 410],
      [1140, 680],
      [840, 660]
    ],
    fillColor: 'rgba(168, 85, 247, 0.06)',
    strokeColor: 'rgba(168, 85, 247, 0.35)',
    dangerRating: 'Moderate',
    description: 'Crystalline fragment field with high cryptographic noise.'
  },
  {
    id: 'reg-sentinel',
    name: 'District 5: Sentinel Air Command',
    polygon: [
      [680, 40],
      [980, 40],
      [960, 200],
      [660, 200]
    ],
    fillColor: 'rgba(239, 68, 68, 0.08)',
    strokeColor: 'rgba(239, 68, 68, 0.45)',
    dangerRating: 'Extreme',
    description: 'Restricted military airspace. Sentinel AI drones maintain active lock-on patrols.'
  },
  {
    id: 'reg-aqueduct',
    name: 'District 6: South Sub-Grid Canal',
    polygon: [
      [180, 560],
      [680, 520],
      [740, 760],
      [220, 780]
    ],
    fillColor: 'rgba(56, 189, 248, 0.06)',
    strokeColor: 'rgba(56, 189, 248, 0.3)',
    dangerRating: 'Low',
    description: 'Industrial cyber-waterway cooling conduits.'
  }
];
