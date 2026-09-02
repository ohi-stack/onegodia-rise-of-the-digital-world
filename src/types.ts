/**
 * Onegodia: Rise of the Digital World™ — MVP v1.0
 * Type Definitions & System Contracts
 * Concept by One Gregory Onegodian™
 */

export type NavigationTab =
  | 'home'
  | 'prototype'
  | 'gameplay-grid'
  | 'tactical-hud'
  | 'map'
  | 'missions'
  | 'inventory'
  | 'developers'
  | 'community'
  | 'web-doc'
  | 'players'
  | 'compliance';

export type SystemStatus =
  | 'Playable Now'
  | 'Prototype'
  | 'Planned Phase / Roadmap'
  | 'Compliance Locked'
  | 'Compliance Locked / Roadmap'
  | 'Development Roadmap';

export type PlayerState =
  | 'Idle'
  | 'Walking'
  | 'Running'
  | 'Jumping'
  | 'Driving'
  | 'Interacting'
  | 'Mission Active'
  | 'Mission Complete';

export interface GameplayGridModule {
  id: string;
  number: number;
  title: string;
  status: SystemStatus;
  shortDescription: string;
  v1Status: string;
  futureExpansionNote: string;
  complianceNote?: string;
  category: 'Core Gameplay' | 'World & Exploration' | 'Economy & Assets' | 'Technology & UI';
  icon: string;
}

export type MissionStatus =
  | 'Locked'
  | 'Available'
  | 'Active'
  | 'Complete'
  | 'Failed / Reset';

export interface ObjectiveReward {
  type: 'credits' | 'item' | 'telemetry' | 'badge' | 'fragment' | 'exp';
  name: string;
  amount?: number;
  rarity?: 'Foundational' | 'Prototype' | 'Roadmap' | 'Common' | 'Rare' | 'Legendary';
  icon?: string;
  description?: string;
}

export interface MissionObjective {
  id: string;
  stepNumber: number;
  description: string;
  isCompleted: boolean;
  targetCoordinates?: { x: number; y: number };
  targetZone?: string;
  rewards?: ObjectiveReward[];
  isPinnedToHUD?: boolean;
}

export interface Mission {
  id: string;
  code: string;
  title: string;
  type: string;
  description: string;
  rewardCredits: number;
  rewardItem: string;
  rewardItemRarity: string;
  status: MissionStatus;
  objectives: MissionObjective[];
  currentObjectiveIndex: number;
  briefingDialogue: string;
  completionDialogue: string;
  startedAt?: number;
  completedAt?: number;
  durationSeconds?: number;
  pinnedObjectiveIds?: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  type: string;
  rarity: 'Foundational' | 'Prototype' | 'Roadmap';
  status: string;
  description: string;
  acquiredDate?: string;
  iconName: string;
  metadata?: Record<string, string>;
}

export interface PlayerProgress {
  credits: number;
  odcSimulatedBalance: number;
  missionsCompleted: string[];
  collectedFragments: string[];
  inventory: InventoryItem[];
  hasVehicleUnlocked: boolean;
  activeMissionId: string | null;
  lastWarpLocation: string;
}

export interface GameEntity {
  id: string;
  name: string;
  type: 'player' | 'npc' | 'vehicle' | 'node' | 'waypoint' | 'hub';
  x: number;
  y: number;
  radius: number;
  color: string;
  interactionPrompt?: string;
  dialogue?: string[];
}

export interface DeveloperTrack {
  id: string;
  title: string;
  leadRole: string;
  summary: string;
  items: string[];
  unrealBlueprintClasses?: {
    className: string;
    description: string;
    targetComponent: string;
  }[];
}

export interface AIAgentRole {
  name: string;
  responsibility: string;
  deliverables: string[];
  focusTrack: string;
}

export interface MissionHistoryEntry {
  id: string;
  missionId: string;
  code: string;
  title: string;
  type: string;
  completedAt: number;
  startedAt?: number;
  durationSeconds: number;
  objectivesCompletedCount: number;
  totalObjectivesCount: number;
  rewardCredits: number;
  rewardItem: string;
  rewardItemRarity: string;
  verificationHash: string;
  stripePaymentReceipt?: {
    sessionId: string;
    passName: string;
    amountTotal: number;
    currency: string;
    paidAt: number;
    status: string;
    isSimulated?: boolean;
  };
}

export interface StripePass {
  id: string;
  name: string;
  price: string;
  priceCents: number;
  badge: string;
  description: string;
  perks: string[];
  highlighted?: boolean;
}

export interface DocFileSpec {
  filename: string;
  title: string;
  category: string;
  content: string;
}

export interface MapLandmark {
  id: string;
  code: string;
  name: string;
  district: string;
  coords: { x: number; y: number };
  elevation: string;
  type: 'Safe Sanctuary' | 'Transit Hub' | 'Digital Node' | 'Relic Quarry' | 'Sentinel Hive' | 'Sub-Grid Aqueduct' | 'Perimeter Gate' | 'Telecom Spire';
  threatLevel: 'Safe Haven' | 'Low Risk' | 'Moderate' | 'Hazardous' | 'Critical Lockdown';
  status: string;
  description: string;
  strategicIntel: string;
  fastTravelAvailable: boolean;
  color: string;
  iconName: string;
  discovered: boolean;
  associatedMissions?: string[];
  lootAvailable?: boolean;
}
