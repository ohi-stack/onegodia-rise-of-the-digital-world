export interface StamfordPOI {
  id: string;
  name: string;
  shortName: string;
  category: 'spawn' | 'transit' | 'corridor' | 'landmark' | 'waterfront';
  address: string;
  lat: number;
  lng: number;
  description: string;
  urbanFeatures: string[];
  unrealNotes: string[];
  color: string;
  iconType: 'hospital' | 'car' | 'building' | 'train' | 'waves' | 'park' | 'map-pin';
  isCorridorCheckpoint: boolean;
  corridorOrder?: number;
}

export const STAMFORD_POIS: StamfordPOI[] = [
  {
    id: 'poi-hospital',
    name: 'Stamford Hospital (Bennett Medical Center)',
    shortName: 'Stamford Hospital',
    category: 'spawn',
    address: '1 Hospital Plaza / Shelburne Rd, Stamford, CT 06902',
    lat: 41.0664,
    lng: -73.5492,
    description: 'The canonical player spawn point for Onegodia. North-western anchor of the playable Stamford corridor.',
    urbanFeatures: [
      'Multi-level medical campus with emergency entrance',
      'Shelburne Road and West Broad Street access corridors',
      'Adjacent surface parking and emergency transport bays'
    ],
    unrealNotes: [
      'Designated as PlayerStart actor in Unreal World Partition',
      'Initial asset loading bubble and safe-zone barrier',
      'High-detail facade proxy with ambient exterior lighting'
    ],
    color: '#10b981', // Emerald
    iconType: 'hospital',
    isCorridorCheckpoint: true,
    corridorOrder: 1,
  },
  {
    id: 'poi-vehicle-staging',
    name: 'West Broad St Vehicle Staging Bay',
    shortName: 'Vehicle Staging',
    category: 'corridor',
    address: 'W Broad St & Merrell Ave, Stamford, CT 06902',
    lat: 41.0620,
    lng: -73.5465,
    description: 'Vehicle transition depot where operatives engage ground transport for the corridor transit run.',
    urbanFeatures: [
      'Secondary arterial transition into central road grid',
      'Staging curb with clear sightlines toward Washington Boulevard',
      'Low-rise commercial border structures and utility poles'
    ],
    unrealNotes: [
      'Spawns Chaos vehicle prototype with physics collision',
      'Trigger volume toggles driving camera mode and HUD speedometer',
      'Audio volume triggers engine ignition soundscape'
    ],
    color: '#f59e0b', // Amber
    iconType: 'car',
    isCorridorCheckpoint: true,
    corridorOrder: 2,
  },
  {
    id: 'poi-washington-blvd',
    name: 'Washington Boulevard & 430 Washington',
    shortName: 'Washington Blvd',
    category: 'corridor',
    address: '430 Washington Blvd, Stamford, CT 06902',
    lat: 41.0505,
    lng: -73.5415,
    description: 'Primary commercial arterial corridor leading south toward the Stamford rail viaduct and underpass.',
    urbanFeatures: [
      'Multi-lane urban boulevard with active signalized intersections',
      '430 Washington contemporary glass office structure anchor',
      'Pedestrian crosswalks, traffic signals, and street light poles'
    ],
    unrealNotes: [
      'Prominent skyline silhouette and navigation beacon',
      'Modular road kit with physical sidewalks and curb collision',
      'Key intersection for AI traffic navigation spline testing'
    ],
    color: '#06b6d4', // Cyan
    iconType: 'building',
    isCorridorCheckpoint: true,
    corridorOrder: 3,
  },
  {
    id: 'poi-rail-underpass',
    name: 'South State Street Rail Underpass',
    shortName: 'Rail Underpass',
    category: 'corridor',
    address: 'South State St & Washington Blvd, Stamford, CT 06902',
    lat: 41.0480,
    lng: -73.5428,
    description: 'Elevated Metro-North rail bridge and underpass condition framing the approach to Stamford Station.',
    urbanFeatures: [
      'Massive structural concrete and steel bridge abutments',
      'Multi-track overhead rail corridor carrying Northeast corridor trains',
      'Distinctive underpass lighting, shadows, and acoustic reverb'
    ],
    unrealNotes: [
      'Atmospheric lighting transition zone with dynamic shadows',
      'Acoustic resonance volume for vehicle engine and train rumble',
      'Overhead railway track mesh with simulated train pass-by events'
    ],
    color: '#6366f1', // Indigo
    iconType: 'building',
    isCorridorCheckpoint: true,
    corridorOrder: 4,
  },
  {
    id: 'poi-stamford-station',
    name: 'Stamford Transportation Center (Stamford Station)',
    shortName: 'Stamford Station',
    category: 'transit',
    address: '1 Station Pl, Stamford, CT 06902',
    lat: 41.0468,
    lng: -73.5425,
    description: 'Major multi-modal transportation hub serving Metro-North, Amtrak, and regional bus transit.',
    urbanFeatures: [
      'Multi-level parking garages with spiraling access ramps',
      'Glass pedestrian concourses and island train platforms',
      'Intermodal bus loop and passenger drop-off plaza'
    ],
    unrealNotes: [
      'Critical intermediate landmark between Downtown and Harbor Point',
      'Multi-tiered geometry for future interior traversal exploration',
      'High-density vehicle and pedestrian pathfinding boundary'
    ],
    color: '#3b82f6', // Blue
    iconType: 'train',
    isCorridorCheckpoint: true,
    corridorOrder: 5,
  },
  {
    id: 'poi-harbor-point',
    name: 'Harbor Point Gateway & Waterfront',
    shortName: 'Harbor Point',
    category: 'waterfront',
    address: '1 Harbor Point Rd, Stamford, CT 06902',
    lat: 41.0375,
    lng: -73.5398,
    description: 'Waterfront mixed-use expansion district, boardwalk parks, marinas, and southern corridor destination.',
    urbanFeatures: [
      'Modern mid-rise residential towers and retail promenade',
      'Boardwalk docks and marina piers on Stamford Harbor',
      'Spacious pedestrian plazas with decorative landscaping'
    ],
    unrealNotes: [
      'Terminus checkpoint for the initial corridor route test',
      'Water surface shader and reflection capture probe placement',
      'Natural world boundary transitioning to Long Island Sound'
    ],
    color: '#a855f7', // Purple
    iconType: 'waves',
    isCorridorCheckpoint: true,
    corridorOrder: 6,
  },
  {
    id: 'poi-mill-river',
    name: 'Mill River Park & Greenway',
    shortName: 'Mill River Park',
    category: 'landmark',
    address: '1050 Washington Blvd, Stamford, CT 06901',
    lat: 41.0542,
    lng: -73.5448,
    description: 'Central urban river greenway featuring naturalized riverbanks, walking trails, and open civic spaces.',
    urbanFeatures: [
      'Curved river corridor with stone edge embankments',
      'Pedestrian footbridges connecting east and west banks',
      'Expansive lawn spaces and native perennial plantings'
    ],
    unrealNotes: [
      'Natural foliage and water rendering stress-test environment',
      'Pedestrian-only traversal path alternative to Washington Blvd'
    ],
    color: '#14b8a6', // Teal
    iconType: 'park',
    isCorridorCheckpoint: false,
  },
  {
    id: 'poi-downtown-gateway',
    name: 'Downtown Stamford Cultural Gateway',
    shortName: 'Downtown Gateway',
    category: 'landmark',
    address: 'Atlantic St & Main St, Stamford, CT 06901',
    lat: 41.0531,
    lng: -73.5387,
    description: 'Historic downtown commercial intersection featuring theaters, restaurants, and civic monuments.',
    urbanFeatures: [
      'Dense urban street grid with historic masonry facades',
      'Retail storefronts, sidewalk dining, and marquee signage',
      'High pedestrian activity zone'
    ],
    unrealNotes: [
      'Alternative urban branch from the Washington Boulevard spine',
      'Dense shopfront collision and glass shader profiling'
    ],
    color: '#f43f5e', // Rose
    iconType: 'map-pin',
    isCorridorCheckpoint: false,
  },
];

export interface CorridorRoutePreset {
  id: string;
  name: string;
  description: string;
  originId: string;
  destinationId: string;
  waypointIds: string[];
  defaultTravelMode: 'DRIVE' | 'WALK' | 'BICYCLE' | 'TRANSIT';
}

export const CORRIDOR_ROUTE_PRESETS: CorridorRoutePreset[] = [
  {
    id: 'preset-canonical-run',
    name: 'Canonical Stamford Corridor Run',
    description: 'The primary game route: Stamford Hospital spawn through Washington Blvd & Stamford Station to Harbor Point.',
    originId: 'poi-hospital',
    destinationId: 'poi-harbor-point',
    waypointIds: ['poi-vehicle-staging', 'poi-washington-blvd', 'poi-stamford-station'],
    defaultTravelMode: 'DRIVE',
  },
  {
    id: 'preset-station-approach',
    name: 'Washington Blvd → Stamford Station Approach',
    description: 'Urban arterial approach down Washington Blvd passing under the rail viaduct into Stamford Station.',
    originId: 'poi-washington-blvd',
    destinationId: 'poi-stamford-station',
    waypointIds: ['poi-rail-underpass'],
    defaultTravelMode: 'DRIVE',
  },
  {
    id: 'preset-station-to-harbor',
    name: 'Stamford Station to Harbor Point Waterfront',
    description: 'Transit hub exit heading south along the harbor canal into the mixed-use boardwalk district.',
    originId: 'poi-stamford-station',
    destinationId: 'poi-harbor-point',
    waypointIds: [],
    defaultTravelMode: 'WALK',
  },
  {
    id: 'preset-hospital-staging',
    name: 'Hospital Spawn to Vehicle Staging',
    description: 'Initial on-foot leg from Bennett Medical Center to the prototype vehicle staging bay.',
    originId: 'poi-hospital',
    destinationId: 'poi-vehicle-staging',
    waypointIds: [],
    defaultTravelMode: 'WALK',
  },
];
