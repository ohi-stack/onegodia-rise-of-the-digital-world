/**
 * Onegodia: Rise of the Digital World™ — MVP v1.0
 * Type Definitions & System Contracts
 * Concept by One Gregory Onegodian™
 */

export type NavigationTab =
  | 'home'
  | 'mvp-v1'
  | 'play'
  | 'development-status'
  | 'producer'
  | 'prototype'
  | 'gameplay'
  | 'gameplay-grid'
  | 'tactical-hud'
  | 'map'
  | 'missions'
  | 'story'
  | 'inventory'
  | 'assets'
  | 'digital-asset-economy'
  | 'developers'
  | 'community'
  | 'media'
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
  odcBalance: number;
  fragments: number;
  playerState: PlayerState;
  currentCoordinates: { x: number; y: number };
  currentZone: string;
  inventory: InventoryItem[];
  achievements: string[];
  unlockedZones: string[];
  equippedVehicle?: string;
  playerName?: string;
  membershipTier?: string;
  lastSavedAt?: number;
}

export interface TacticalMarker {
  id: string;
  type: 'player' | 'objective' | 'poi' | 'vehicle' | 'future';
  label: string;
  x: number;
  y: number;
  isActive: boolean;
  status?: SystemStatus;
}

export interface WorldZone {
  id: string;
  name: string;
  description: string;
  status: SystemStatus;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ComplianceItem {
  feature: string;
  currentStatus: SystemStatus;
  notice: string;
}

export interface PlayerControlBinding {
  action: string;
  keyboard: string;
  gamepad?: string;
  mobile?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'concept' | 'screenshot';
  status: SystemStatus;
  url?: string;
  description: string;
}

export interface DeveloperTrack {
  id: string;
  title: string;
  description: string;
  status: SystemStatus;
  tasks: string[];
}

export interface RoadmapPhase {
  id: string;
  phase: string;
  title: string;
  status: SystemStatus;
  target: string;
  goals: string[];
}

export interface AssetCatalogItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  basePriceCredits?: number;
  realMoneyPriceUsd?: number;
  status: SystemStatus | 'Operational';
  description: string;
  transferable?: boolean;
  blockchainEnabled?: boolean;
  productKey?: string;
}
