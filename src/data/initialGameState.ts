import { Mission, InventoryItem, PlayerProgress } from '../types';

export const INITIAL_MISSION_001: Mission = {
  id: 'MISSION_001_REBUILDING_SIGNAL',
  code: 'MIS-001',
  title: 'Rebuilding Signal',
  type: 'Movement / Exploration / Retrieval',
  description: 'Onegodia signal interference has appeared near Sector 7 digital node. Speak with Aria Pulse, reach the marked outpost, scan the corrupted node, retrieve Data Fragment #001, and bring it safely back to the Hub.',
  rewardCredits: 250,
  rewardItem: 'Onegodia Data Fragment #001',
  rewardItemRarity: 'Foundational',
  status: 'Available',
  currentObjectiveIndex: 0,
  briefingDialogue: 'Citizen, Onegodia signal interference has appeared near the Sector 7 digital node. Reach the marked location, scan the digital fragment, and return it to the Hub to stabilize our grid.',
  completionDialogue: 'Outstanding work, Citizen! Signal restored to nominal power. Onegodia Data Fragment #001 has been added to your digital archive. This is only the beginning of our world reconstruction.',
  objectives: [
    {
      id: 'obj-1',
      stepNumber: 1,
      description: 'Speak to Mission Guide (Aria Pulse) at Onegodia Hub',
      isCompleted: false,
      targetCoordinates: { x: 220, y: 380 },
      targetZone: 'Onegodia Hub Plaza',
      rewards: [
        {
          type: 'credits',
          name: 'Directive Activation Stipend',
          amount: 25,
          rarity: 'Foundational',
          icon: 'Coins',
          description: 'Immediate operational funds granted by Aria Pulse upon contract acceptance.'
        },
        {
          type: 'telemetry',
          name: 'Sector 7 Navigation Telemetry',
          amount: 1,
          rarity: 'Prototype',
          icon: 'Compass',
          description: 'Calibrated coordinate feed loaded directly into the Tactical HUD radar.'
        }
      ]
    },
    {
      id: 'obj-2',
      stepNumber: 2,
      description: 'Travel along the neon transit corridor to Sector 7 Outpost',
      isCompleted: false,
      targetCoordinates: { x: 550, y: 220 },
      targetZone: 'Sector 7 Transit Highway',
      rewards: [
        {
          type: 'credits',
          name: 'Transit Highway Recon Stipend',
          amount: 35,
          rarity: 'Foundational',
          icon: 'Coins',
          description: 'Reconnaissance bonus for traversing the neon transit corridor.'
        },
        {
          type: 'item',
          name: 'Cyber-Cruiser Boost Capacitor',
          amount: 1,
          rarity: 'Prototype',
          icon: 'Zap',
          description: 'High-yield acceleration capacitor schematic for prototype vehicles.'
        }
      ]
    },
    {
      id: 'obj-3',
      stepNumber: 3,
      description: 'Locate and hold [E] / Scan on Corrupted Digital Node #001',
      isCompleted: false,
      targetCoordinates: { x: 740, y: 180 },
      targetZone: 'Digital Node Shrine',
      rewards: [
        {
          type: 'credits',
          name: 'Harmonics Stabilization Bounty',
          amount: 65,
          rarity: 'Foundational',
          icon: 'Coins',
          description: 'Photonic pulse clearing compensation for decrypting Node #001.'
        },
        {
          type: 'item',
          name: 'Photonic Calibration Lens',
          amount: 1,
          rarity: 'Prototype',
          icon: 'Cpu',
          description: 'Harmonic optical crystal utilized in node purification and data decoding.'
        }
      ]
    },
    {
      id: 'obj-4',
      stepNumber: 4,
      description: 'Extract and collect Onegodia Data Fragment #001',
      isCompleted: false,
      targetCoordinates: { x: 740, y: 180 },
      targetZone: 'Digital Node Shrine',
      rewards: [
        {
          type: 'fragment',
          name: 'Onegodia Data Fragment #001',
          amount: 1,
          rarity: 'Foundational',
          icon: 'Sparkles',
          description: 'Core world lore data shard containing foundational grid memory.'
        },
        {
          type: 'credits',
          name: 'Rare Salvage Recovery Bonus',
          amount: 50,
          rarity: 'Foundational',
          icon: 'Coins',
          description: 'Salvage recovery fee for securing off-chain collectible shard.'
        }
      ]
    },
    {
      id: 'obj-5',
      stepNumber: 5,
      description: 'Return to Onegodia Hub and report to Aria Pulse',
      isCompleted: false,
      targetCoordinates: { x: 220, y: 380 },
      targetZone: 'Onegodia Hub Plaza',
      rewards: [
        {
          type: 'credits',
          name: 'Plaza Courier Return Compensation',
          amount: 25,
          rarity: 'Foundational',
          icon: 'Coins',
          description: 'Safe courier transit return stipend awarded at Hub Plaza.'
        },
        {
          type: 'badge',
          name: 'Hub Courier Protocol Clearance',
          amount: 1,
          rarity: 'Foundational',
          icon: 'Shield',
          description: 'Alpha access credentials for successfully retrieving high-value digital shards.'
        }
      ]
    },
    {
      id: 'obj-6',
      stepNumber: 6,
      description: 'Receive 250 Prototype Credits and Foundational Fragment',
      isCompleted: false,
      targetCoordinates: { x: 220, y: 380 },
      targetZone: 'Onegodia Hub Plaza',
      rewards: [
        {
          type: 'credits',
          name: 'Mission 001 Completion Grand Bounty',
          amount: 250,
          rarity: 'Foundational',
          icon: 'Award',
          description: 'Final grand contract settlement credited directly to player prototype balance.'
        },
        {
          type: 'badge',
          name: 'Signal Pioneer Badge #001',
          amount: 1,
          rarity: 'Foundational',
          icon: 'Trophy',
          description: 'Prestigious commemorative emblem honoring first wave world rebuilders.'
        }
      ]
    }
  ]
};

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    id: 'item-pass',
    name: 'Citizen Genesis Pass',
    type: 'Access Keycard',
    rarity: 'Foundational',
    status: 'Simulated Prototype',
    description: 'Foundational credential granting access to Sector 7 Hub and Prototype Vehicle Bays.',
    acquiredDate: 'Day 1 Launch',
    iconName: 'Key',
    metadata: {
      'Security Tier': 'Alpha Clearance',
      'Issuer': 'Onegodia Central Grid'
    }
  },
  {
    id: 'item-scanner',
    name: 'Tactical Photonic Scanner',
    type: 'Utility Tool',
    rarity: 'Prototype',
    status: 'Operational',
    description: 'Handheld scanner capable of detecting digital node harmonics and purifying signal corruptions.',
    acquiredDate: 'Day 1 Launch',
    iconName: 'Radio',
    metadata: {
      'Frequency': '5.8 GHz Cyber-Band',
      'Scan Radius': '45m Pulse'
    }
  }
];

export const INITIAL_PLAYER_PROGRESS: PlayerProgress = {
  credits: 100,
  odcSimulatedBalance: 0.00,
  missionsCompleted: [],
  collectedFragments: [],
  inventory: INITIAL_INVENTORY,
  hasVehicleUnlocked: true,
  activeMissionId: null,
  lastWarpLocation: 'Onegodia Hub'
};
