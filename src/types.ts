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
  | 'missions'
  | 'inventory'
  | 'developers'
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

export interface MissionObjective {
  id: string;
  stepNumber: number;
  description: string;
  isCompleted: boolean;
  targetCoordinates?: { x: number; y: number };
  targetZone?: string;
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

export interface DocFileSpec {
  filename: string;
  title: string;
  category: string;
  content: string;
}
