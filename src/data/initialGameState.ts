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
      targetZone: 'Onegodia Hub Plaza'
    },
    {
      id: 'obj-2',
      stepNumber: 2,
      description: 'Travel along the neon transit corridor to Sector 7 Outpost',
      isCompleted: false,
      targetCoordinates: { x: 550, y: 220 },
      targetZone: 'Sector 7 Transit Highway'
    },
    {
      id: 'obj-3',
      stepNumber: 3,
      description: 'Locate and hold [E] / Scan on Corrupted Digital Node #001',
      isCompleted: false,
      targetCoordinates: { x: 740, y: 180 },
      targetZone: 'Digital Node Shrine'
    },
    {
      id: 'obj-4',
      stepNumber: 4,
      description: 'Extract and collect Onegodia Data Fragment #001',
      isCompleted: false,
      targetCoordinates: { x: 740, y: 180 },
      targetZone: 'Digital Node Shrine'
    },
    {
      id: 'obj-5',
      stepNumber: 5,
      description: 'Return to Onegodia Hub and report to Aria Pulse',
      isCompleted: false,
      targetCoordinates: { x: 220, y: 380 },
      targetZone: 'Onegodia Hub Plaza'
    },
    {
      id: 'obj-6',
      stepNumber: 6,
      description: 'Receive 250 Prototype Credits and Foundational Fragment',
      isCompleted: false,
      targetCoordinates: { x: 220, y: 380 },
      targetZone: 'Onegodia Hub Plaza'
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
