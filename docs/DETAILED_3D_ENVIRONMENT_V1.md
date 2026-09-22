# Detailed 3D Environment Specification v1.0

**Project:** Onegodia: Rise of the Digital World™  
**Target clients:** Browser runtime at game.OneGodian.com and Unreal production client  
**Status:** Implementation specification. Features described here are not "Playable Now" until verified under `docs/DEVELOPMENT_STATUS_POLICY.md`.

## Purpose

Upgrade the current schematic Stamford runtime into a layered, believable 3D city environment while preserving Mission 001, Stamford Hospital as the primary spawn anchor, Sector 7 progression, vehicle gameplay, POIs, businesses, property systems, and the game-first architecture.

The browser client should progressively render the same world model consumed by higher-fidelity Unreal builds. Durable world identity and gameplay state belong in services/data rather than being authored independently in each client.

## Environment hierarchy

```
World
└── Stamford Region
    ├── District
    │   ├── Block
    │   │   ├── Parcel
    │   │   │   ├── Building
    │   │   │   ├── Exterior props
    │   │   │   ├── Interior shell
    │   │   │   └── Gameplay anchors
    │   │   ├── Road segments
    │   │   ├── Sidewalks
    │   │   ├── vegetation
    │   │   └── street furniture
    │   └── POIs
    └── World systems
```

Every placed gameplay object should have a stable ID and source/provenance field.

## Stamford MVP environment zones

### 1. Stamford Hospital Spawn District
Primary first-session spawn and orientation environment.

Required layers:
- hospital massing and recognizable campus silhouette
- entrance/drop-off zone
- emergency/service access separation
- sidewalks, curbs, crossings and parking
- street signs and wayfinding
- trees, planters, benches and lighting
- traffic and pedestrian spawn anchors
- Aria Pulse/NPC interaction anchor
- player spawn, reset and safe-zone volumes
- vehicle pickup/parking location
- mission navigation marker

The environment must distinguish **verified geographic/world data** from fictional Onegodia gameplay overlays.

### 2. Hub / Civic Transition Zone
Connects the hospital spawn district to the playable mission network.

Include:
- plaza or public-space geometry
- mission kiosks / interaction anchors
- transit and road connections
- commercial frontage placeholders
- seating, landscaping, lighting and signage
- navigation landmarks visible from multiple approaches

### 3. Sector 7 / Mission 001 Zone
A visually distinct digital-disruption district used for Rebuilding Signal.

Include:
- corrupted node #001
- readable approach corridor
- environmental signal/glitch effects
- Data Fragment spawn anchor
- cover/prop geometry without blocking mission navigation
- purified-state visual variant
- return route toward Aria Pulse / Hub

### 4. Onegodia Motors Dealership District
Economic/vehicle POI supporting future vehicle purchase, resale and customization gameplay.

Exterior:
- two-story glass-and-metal showroom
- illuminated V identity/signage
- forecourt display pads
- customer parking
- delivery/service lane
- service bays
- landscaped edge and pedestrian access
- vehicle spawn/display anchors
- nighttime architectural lighting

Interior shells:
- showroom floor
- sales desk
- customization desk
- service reception
- delivery handoff zone

Gameplay anchors:
- dealership interaction
- browse inventory
- buy/sell vehicle
- customization
- service/repair
- vehicle delivery/spawn

Marketplace functions remain staged until their backend and compliance requirements are operational.

### 5. Downtown / Commercial Expansion
Prepare reusable environment modules for:
- storefronts
- offices
- restaurants
- garages
- creative studios
- warehouses
- hotels
- entertainment venues
- player-operable businesses

### 6. Residential / Property Expansion
Prepare parcels and modular structures for:
- apartments
- condos
- starter homes
- family homes
- luxury residences
- vacant/development land
- property improvements and construction states

## World-data pipeline

Target pipeline:

`Verified Stamford GIS/OSM/source data → normalized world dataset → district/block/parcel graph → browser LOD geometry → Unreal high-fidelity geometry → gameplay anchors → persistence`

Do not label geometry "verified Stamford" merely because it resembles Stamford. Each geographic feature should preserve:
- source
- source feature ID where available
- import timestamp/version
- coordinate reference
- confidence/verification status
- fictional-overlay flag

## 3D rendering layers

### Terrain and ground
- terrain/ground mesh
- road surface
- curbs
- sidewalks
- parking surfaces
- grass/soil/landscape zones
- water where present
- decals for lane markings, crossings and wear

### Buildings
Use modular facade kits and LODs:
- LOD0: close gameplay facade/interior shell
- LOD1: reduced facade detail
- LOD2: simplified building mass
- LOD3: skyline proxy

Building metadata should include parcel ID, use type, enterable flag, ownership/economy eligibility and current construction state.

### Roads and mobility
Road graph must support:
- vehicle navigation
- pedestrian crossings
- lane direction
- intersections
- parking
- traffic spawn points
- delivery/service access
- future NPC navigation

### Props
Reusable prop families:
- streetlights
- traffic lights
- signs
- hydrants
- benches
- trash/recycling
- barriers
- bus/transit furniture
- utility boxes
- planters
- bollards
- parking meters
- construction equipment

### Vegetation
Use instancing for trees, shrubs, planters and grass. Keep vegetation out of critical mission paths and vehicle lanes.

## Lighting and atmosphere

Support time-of-day profiles:
- daylight
- golden hour
- dusk
- night
- rain/wet-road variant

Browser runtime should favor baked/precomputed or inexpensive lighting techniques. Unreal can use its production lighting stack subject to performance targets.

Environment lighting must preserve gameplay readability: interaction anchors, roads, NPCs, entrances and mission objectives cannot disappear into cinematic darkness.

## Materials

Create reusable PBR-oriented material families:
- asphalt
- concrete
- sidewalk
- glass
- metal
- brick
- painted facade
- stone
- grass/soil
- emissive signage
- wet-surface variants

Avoid unique materials for every object. Prefer atlases, instances and parameterized variants.

## Interior strategy

Do not build every interior.

Use three levels:
1. **Exterior only** — background/non-interactive.
2. **Interior shell** — dealership, shops, mission spaces and selected businesses.
3. **Full gameplay interior** — only where missions or core economic gameplay require it.

Interior transitions must preserve player state and stable building IDs.

## Environment interaction anchors

Standard anchor types:
- PLAYER_SPAWN
- VEHICLE_SPAWN
- NPC_SPAWN
- MISSION_OBJECTIVE
- INTERACTION
- BUSINESS_ENTRY
- PROPERTY_ENTRY
- MARKETPLACE
- SERVICE
- PARKING
- FAST_TRAVEL
- SAFE_ZONE
- DISCOVERY_POI

Each anchor requires stable ID, world position, orientation, district, activation rules and client visibility.

## Browser runtime performance targets

The browser runtime is not expected to match Unreal fidelity.

Targets:
- progressive district loading
- geometry instancing
- texture compression
- LOD switching
- occlusion/frustum culling
- pooled NPC/vehicle/prop entities
- mobile quality preset
- desktop quality preset
- avoid loading detailed interiors until entered
- no high-resolution source GIS data sent directly to the client

Performance budgets should be measured on representative mobile and desktop hardware before declaring a production target achieved.

## Unreal production targets

The Unreal environment should consume the same IDs, POIs and gameplay semantics while providing:
- higher-fidelity meshes/materials
- World Partition / streaming strategy
- HLOD
- Nanite where appropriate
- production collision
- navigation meshes
- traffic/vehicle paths
- NPC navigation
- mission volumes
- optimized interiors
- cinematic lighting variants

## Environment data contract

Proposed record:

```ts
interface WorldFeature {
  id: string;
  type: 'district' | 'block' | 'parcel' | 'building' | 'road' | 'poi' | 'prop' | 'vegetation' | 'anchor';
  name: string;
  districtId?: string;
  parentId?: string;
  position: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
  scale?: { x: number; y: number; z: number };
  source?: {
    provider: string;
    sourceId?: string;
    importedAt?: string;
    verified: boolean;
  };
  fictionalOverlay?: boolean;
  lodGroup?: string;
  collision?: boolean;
  enterable?: boolean;
  gameplayTags?: string[];
}
```

## Development order

1. Preserve existing Mission 001 functionality.
2. Create world feature/data contract.
3. Replace flat schematic ground with district/block/road layers.
4. Build Stamford Hospital spawn district.
5. Add road/sidewalk/parking/street-prop kit.
6. Build Hub transition.
7. Upgrade Sector 7 environment and state change.
8. Add Onegodia Motors dealership as a vehicle/economy POI.
9. Add modular commercial/residential blocks.
10. Add streaming/LOD/performance controls.
11. Connect persistence and server-owned world state.
12. Mirror stable IDs and gameplay anchors into Unreal.
13. Verify each feature before changing its development-status label.

## Definition of Done for "Detailed 3D Environment v1"

- Player can spawn at the Stamford Hospital environment.
- Environment has readable roads, sidewalks, buildings, props, vegetation and lighting rather than only abstract grid geometry.
- Mission 001 remains completable end-to-end.
- Player can navigate from spawn through the Hub to Sector 7.
- Vehicle can traverse the designated road network without obvious blocking geometry.
- Sector 7 visually changes from corrupted to purified state.
- Onegodia Motors exists as a discoverable dealership POI, even if marketplace transactions remain staged.
- Stable world IDs exist for districts, major buildings, roads, POIs and interaction anchors.
- Browser runtime passes agreed mobile/desktop performance tests.
- Unreal counterpart uses the same world IDs/anchors for implemented areas.
- Status documentation contains evidence links before anything is labeled Playable Now.
