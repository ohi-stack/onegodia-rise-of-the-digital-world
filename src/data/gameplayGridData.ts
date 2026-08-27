import { GameplayGridModule } from '../types';

export const GAMEPLAY_GRID_MODULES: GameplayGridModule[] = [
  {
    id: 'flying-mounts',
    number: 1,
    title: 'Flying Mounts',
    status: 'Planned Phase / Roadmap',
    category: 'World & Exploration',
    shortDescription: 'Aerial traversal system allowing players to fly above futuristic digital cityscapes and oceanic boundaries.',
    v1Status: 'Phase 3 Unreal Engine Physics prototype planned.',
    futureExpansionNote: 'Will integrate with BP_FlyingPawn in Unreal Engine 5 with custom altitude barriers and aerodynamics.',
    complianceNote: 'Simulated gameplay traversal mechanic only.',
    icon: 'Plane'
  },
  {
    id: 'vehicle-racing',
    number: 2,
    title: 'Vehicle Racing',
    status: 'Planned Phase / Roadmap',
    category: 'Core Gameplay',
    shortDescription: 'High-speed urban track racing and time-trials across illuminated neon circuit corridors.',
    v1Status: 'Single-vehicle city travel prototype active in V1 test district.',
    futureExpansionNote: 'Multi-tiered street racing tournaments with vehicle tuning and obstacle courses.',
    complianceNote: 'Skill-based gameplay only; no wagering or gambling mechanics.',
    icon: 'Gauge'
  },
  {
    id: 'city-exploration',
    number: 3,
    title: 'City Exploration',
    status: 'Prototype',
    category: 'World & Exploration',
    shortDescription: 'Open-world city navigation merging real-world architecture with digital cyber hubs and interactive waypoints.',
    v1Status: 'Sector 7 Onegodia Hub & Digital Node perimeter playable in V1 Canvas.',
    futureExpansionNote: 'Full metropolitan world map featuring interconnected districts and weather systems.',
    icon: 'Compass'
  },
  {
    id: 'digital-asset-shops',
    number: 4,
    title: 'Digital Asset Shops',
    status: 'Compliance Locked / Roadmap',
    category: 'Economy & Assets',
    shortDescription: 'In-game storefronts for acquiring character gear, vehicle cosmetics, and holographic apartment decors.',
    v1Status: 'Simulated non-financial item catalog placeholder only.',
    futureExpansionNote: 'Subject to full jurisdictional compliance and closed in-game currency architecture.',
    complianceNote: 'MVP v1.0 is an interface prototype. No real money, fiat exchange, or blockchain minting active.',
    icon: 'Store'
  },
  {
    id: 'underwater-realms',
    number: 5,
    title: 'Underwater Realms',
    status: 'Planned Phase / Roadmap',
    category: 'World & Exploration',
    shortDescription: 'Sub-aquatic biomes and submerged cyber-ruins for deep-sea salvage and exploration.',
    v1Status: 'Conceptual world map sector designated on world cartography.',
    futureExpansionNote: 'Submarine vehicle systems and pressure-suit traversal planned for Phase 4.',
    icon: 'Waves'
  },
  {
    id: 'sailing-adventures',
    number: 6,
    title: 'Sailing Adventures',
    status: 'Planned Phase / Roadmap',
    category: 'World & Exploration',
    shortDescription: 'Coastal waterway navigation and archipelago expeditions linking digital islands.',
    v1Status: 'Harbor zone blocked out in world lore and architectural schematics.',
    futureExpansionNote: 'Buoyancy physics and oceanic weather simulation in Unreal Engine 5.',
    icon: 'Anchor'
  },
  {
    id: 'tactical-hud-map',
    number: 7,
    title: 'Tactical HUD Map',
    status: 'Prototype',
    category: 'Technology & UI',
    shortDescription: 'Live radar scanning, coordinate tracking, waypoint telemetry, and sector status overlay.',
    v1Status: 'Fully interactive Tactical HUD with radar sweep, warp prototype, and live coordinates.',
    futureExpansionNote: '3D holographic mini-map projection integrated into player helmet visor.',
    icon: 'Crosshair'
  },
  {
    id: 'mobile-controller-pad',
    number: 8,
    title: 'Mobile Controller Pad',
    status: 'Prototype',
    category: 'Technology & UI',
    shortDescription: 'Touch-optimized virtual controller pad with directional D-Pad, Jump Matrix, Mount, and Scan triggers.',
    v1Status: 'Functional on-screen mobile gamepad prototype with responsive touch feedback.',
    futureExpansionNote: 'Native iOS & Android mobile companion application with haptic integration.',
    icon: 'Smartphone'
  },
  {
    id: 'desktop-controls',
    number: 9,
    title: 'Desktop Controls',
    status: 'Prototype',
    category: 'Technology & UI',
    shortDescription: 'Full WASD, Arrow keys, Sprint (Shift), Jump Matrix (Space), Mount (F), and Scan (E) keyboard bindings.',
    v1Status: 'Active keyboard input listeners with live state visualization.',
    futureExpansionNote: 'Custom key remapping, controller gamepad API, and flight stick support.',
    icon: 'Keyboard'
  },
  {
    id: 'player-movement',
    number: 10,
    title: 'Player Movement',
    status: 'Playable Now',
    category: 'Core Gameplay',
    shortDescription: 'Comprehensive movement state machine featuring Idle, Walk, Run, Jump Matrix, and Fall-Reset safety.',
    v1Status: 'Playable 2D/2.5D physics loop with velocity damping and collision testing.',
    futureExpansionNote: 'BP_PlayerCharacter in Unreal Engine 5 with Root Motion and Motion Matching animations.',
    icon: 'Footprints'
  },
  {
    id: 'missions',
    number: 11,
    title: 'Missions & Objectives',
    status: 'Prototype',
    category: 'Core Gameplay',
    shortDescription: 'Objective-driven narrative progression system guiding players through the digital realm.',
    v1Status: 'Mission 001: Rebuilding Signal fully playable from briefing to reward collection.',
    futureExpansionNote: 'Dynamic branching missions, cooperative strikes, and community world events.',
    icon: 'Flag'
  },
  {
    id: 'multiplayer-community',
    number: 12,
    title: 'Multiplayer Community',
    status: 'Planned Phase / Roadmap',
    category: 'World & Exploration',
    shortDescription: 'Synchronized shared world instances where players interact, assemble squads, and explore together.',
    v1Status: 'Simulated civilian and security NPCs populating Sector 7 Hub.',
    futureExpansionNote: 'Dedicated Unreal Engine dedicated server nodes and spatial audio voice channels.',
    complianceNote: 'Community moderation and safe user interaction standards will apply.',
    icon: 'Users'
  },
  {
    id: 'marketplace-showcase',
    number: 13,
    title: 'Marketplace Showcase',
    status: 'Compliance Locked / Roadmap',
    category: 'Economy & Assets',
    shortDescription: 'Player-to-player exchange system for game blueprints, vehicle wraps, and architected spaces.',
    v1Status: 'UI blueprint and compliance architecture placeholder only.',
    futureExpansionNote: 'Requires rigorous legal structuring prior to any transactional capabilities.',
    complianceNote: 'Strictly locked in MVP v1.0. No peer-to-peer real-money transfer or trading.',
    icon: 'ShoppingBag'
  },
  {
    id: 'odc-economy',
    number: 14,
    title: 'ODC Economy',
    status: 'Compliance Locked / Roadmap',
    category: 'Economy & Assets',
    shortDescription: 'Onegodian Coin (ODC) long-term conceptual tokenomics architecture for digital world governance.',
    v1Status: 'Simulated 0.00 ODC balance clearly labeled INACTIVE / ROADMAP ONLY.',
    futureExpansionNote: 'Future Layer 2 blockchain infrastructure subject to regulatory approval.',
    complianceNote: 'Not a live currency. No wallet connections, no sales, no investment offerings.',
    icon: 'Coins'
  },
  {
    id: 'nft-style-collectibles',
    number: 15,
    title: 'NFT-Style Collectibles',
    status: 'Compliance Locked / Roadmap',
    category: 'Economy & Assets',
    shortDescription: 'Provably unique digital world artifacts, foundational badges, and historical milestone fragments.',
    v1Status: 'Off-chain simulated digital items (Onegodia Data Fragment #001) in local inventory.',
    futureExpansionNote: 'Conceptual roadmap phase only pending full compliance framework.',
    complianceNote: 'Simulated off-chain game assets. No live minting, gas fees, or staking.',
    icon: 'Sparkles'
  },
  {
    id: 'smart-npcs',
    number: 16,
    title: 'Smart NPCs',
    status: 'Planned Phase / Roadmap',
    category: 'Core Gameplay',
    shortDescription: 'Context-aware non-player characters with dynamic dialogue trees, mission dispatch, and lore knowledge.',
    v1Status: 'Mission Guide NPC (Aria Pulse) with briefing and completion dialogue.',
    futureExpansionNote: 'AI-driven conversational agents using server-side LLM knowledge grounding.',
    icon: 'Bot'
  },
  {
    id: 'rebuilding-city-storyline',
    number: 17,
    title: 'Rebuilding City Storyline',
    status: 'Planned Phase / Roadmap',
    category: 'World & Exploration',
    shortDescription: 'The overarching narrative arc where players restore corrupted digital nodes to rebuild the city of Onegodia.',
    v1Status: 'First narrative beat established in Mission 001: Rebuilding Signal.',
    futureExpansionNote: 'Progressive city reconstruction where completed community missions restore city power grids.',
    icon: 'Building2'
  },
  {
    id: 'unreal-engine-production-build',
    number: 18,
    title: 'Unreal Engine Production Build',
    status: 'Development Roadmap',
    category: 'Technology & UI',
    shortDescription: 'The long-term high-fidelity AAA client built on Unreal Engine 5 with Nanite and Lumen technology.',
    v1Status: 'Blueprint class architecture mapped (BP_PlayerCharacter, BP_GameMode, BP_PlayerController).',
    futureExpansionNote: 'Full PC & console client connecting to official game node game.onegodian.com.',
    icon: 'Cpu'
  }
];
