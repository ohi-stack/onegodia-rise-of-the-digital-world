import { DocFileSpec } from '../types';

export const SPECIFICATION_DOCS: DocFileSpec[] = [
  {
    filename: 'GAME_OVERVIEW.md',
    title: 'Game Overview & Creative Vision',
    category: 'Architecture & Vision',
    content: `# Onegodia: Rise of the Digital World™ — Game Overview

**Concept by:** One Gregory Onegodian™  
**Project Classification:** Open-World Digital Lifestyle Simulation & Digital-World Action RPG  
**Target Engine:** Unreal Engine 5 (Nanite / Lumen) + Web Companion Node (\`game.onegodian.com\`)  
**Current Milestone:** MVP v1.0 / Playable Game V1 Prototype

---

## 1. Executive Summary
*Onegodia: Rise of the Digital World™* is an expansive digital realm where physical city architecture merges seamlessly with futuristic cybernetic networks, digital assets, dynamic player navigation, strategic missions, and multiplayer social hubs. 

Rather than deploying an unvetted monolithic release, development is executed in tightly controlled, staged milestones starting with **MVP v1.0**.

## 2. Core Playable Loop
The foundational loop proven in V1 consists of:
\`\`\`
[Spawn at Hub] ➔ [Move & Navigate] ➔ [Explore Sector] ➔ [Interact with NPC]
      ➔ [Accept Mission] ➔ [Travel to Waypoint] ➔ [Scan Corrupted Node]
      ➔ [Extract Fragment] ➔ [Return to Hub] ➔ [Claim Reward] ➔ [Save Progress]
\`\`\`

## 3. High-Level Pillars
1. **Urban Digital Synthesis:** Real-world inspired metropolitan districts infused with holographic infrastructure.
2. **Multi-Modal Traversal:** Seamless transition between foot movement (Walk/Sprint/Jump Matrix), Cyber-Cruiser vehicles, and future aerial mounts.
3. **Restorative Storyline:** Rebuilding city signals and restoring corrupted digital nodes to revitalize the Onegodia grid.
4. **Principled Economic Compliance:** Clear separation between simulated in-game progression and future conceptual Layer 2 tokenomics.
`
  },
  {
    filename: 'MVP_SCOPE.md',
    title: 'MVP v1.0 Scope & Boundary Specification',
    category: 'Engineering & Scope',
    content: `# MVP v1.0 Scope & Boundary Specification

**Status:** Interface + Gameplay Planning Prototype  
**Audience:** Founders, Game Producers, Unreal Engineers, Web Developers, Legal Counsel

---

## 1. What IS in MVP v1.0
* **Playable Character:** 2.5D top-down / isometric navigation with Walk, Sprint, Jump Matrix, and directional rotation.
* **Sector 7 District:** Playable environment containing Onegodia Hub, road network, cyber flora, and Corrupted Digital Node #001.
* **Mission 001:** *Rebuilding Signal* — complete objective sequence from NPC briefing to reward claim.
* **Tactical HUD:** Live radar sweep, coordinate telemetry (X/Y), speed indicator, movement state register.
* **Vehicle Prototype:** Interactive Cyber-Cruiser with mount/dismount, acceleration, braking, and reverse.
* **Simulated Rewards:** 250 Prototype Credits and Onegodia Data Fragment #001 (Foundational Rarity).
* **Dual Control System:** Full Desktop Keyboard bindings and on-screen Virtual Mobile Controller Pad.
* **Developer & Compliance Portal:** Unreal Engine 5 Blueprint specs, AI Agent matrix, and regulatory boundary declarations.

## 2. What is STRICTLY EXCLUDED from MVP v1.0
* ❌ Real-money transactions or fiat gateways
* ❌ Live blockchain minting or smart contract calls
* ❌ Real cryptocurrency wallet connectivity (MetaMask, Phantom, etc.)
* ❌ Live ODC (Onegodian Coin) economy
* ❌ Casino, wagering, or gambling mechanics
* ❌ P2P Real-Money Marketplace
* ❌ Live multiplayer networking
`
  },
  {
    filename: 'MISSION_001_REBUILDING_SIGNAL.md',
    title: 'Mission 001: Rebuilding Signal Spec',
    category: 'Game Design & Missions',
    content: `# Mission Specification: MISSION_001_REBUILDING_SIGNAL

**Mission ID:** \`MISSION_001_REBUILDING_SIGNAL\`  
**Mission Title:** Rebuilding Signal  
**Type:** Movement / Exploration / Data Retrieval  
**Quest Giver:** Aria Pulse (Mission Guide NPC @ Onegodia Hub)  
**Location:** Sector 7 — Grid Coordinates [X: 680, Y: 420]  
**Status:** Prototype (Playable Now in V1)

---

## Objectives Sequence
1. **Objective 1:** Approach Aria Pulse at Onegodia Hub and initiate briefing.
2. **Objective 2:** Travel along the marked transit corridor toward Sector 7 Outpost.
3. **Objective 3:** Locate the pulsating Corrupted Digital Node #001.
4. **Objective 4:** Hold scan matrix (Key [E] or Mobile Scan Button) to purify the node.
5. **Objective 5:** Extract *Onegodia Data Fragment #001*.
6. **Objective 6:** Return to Onegodia Hub and report to Aria Pulse.
7. **Objective 7:** Receive 250 Prototype Credits and Foundational Badge.

## Dialogue Scripts
* **Briefing:** *"Onegodia signal interference has appeared near the city node. Reach the marked location, scan the digital fragment, and return it to the Hub."*
* **Debriefing:** *"Signal restored. The fragment has been added to your archive. This is only the beginning of the digital world."*
`
  },
  {
    filename: 'PLAYER_CONTROLS.md',
    title: 'Player Controls & Movement Spec',
    category: 'Game Design & Controls',
    content: `# Player Controls & Movement System Specification

## 1. Desktop Keyboard & Mouse Bindings
| Action | Primary Key | Secondary Key | Description |
| :--- | :--- | :--- | :--- |
| **Move Up / Forward** | \`W\` | \`Up Arrow\` | Navigates player north along grid |
| **Move Down / Backward** | \`S\` | \`Down Arrow\` | Navigates player south along grid |
| **Move Left** | \`A\` | \`Left Arrow\` | Navigates player west along grid |
| **Move Right** | \`D\` | \`Right Arrow\` | Navigates player east along grid |
| **Sprint / Run** | \`Shift\` | — | Increases movement speed by 1.8x |
| **Jump Matrix** | \`Space\` | — | Activates vertical elevation pulse |
| **Mount / Drive Vehicle**| \`F\` | — | Enters / Exits Cyber-Cruiser vehicle |
| **Interact / Scan Node** | \`E\` | — | Talks to NPCs / Scans corrupted nodes |
| **Tactical Map Toggle** | \`M\` | — | Expands Tactical HUD overlay |
| **Inventory Quick-View**| \`I\` | — | Opens simulated digital locker |
| **Reset / Unstuck** | \`R\` | — | Teleports player back to Hub Spawn |

## 2. Mobile Touch Controller Architecture
* **Virtual Directional Pad (D-Pad):** Up, Down, Left, Right directional buttons with multi-touch support.
* **Action Buttons:** Jump Matrix (elevates pawn), Mount/Ride (toggles vehicle), Scan/Interact (initiates interaction beam).
* **HUD Quick Actions:** Map view toggle, Inventory toggle, Audio mute toggle.
`
  },
  {
    filename: 'TACTICAL_HUD_SPEC.md',
    title: 'Tactical HUD & Minimap Specification',
    category: 'UI/UX & Systems',
    content: `# Tactical HUD & Radar Telemetry Specification

## 1. Functional Components
* **Coordinates Engine:** High-precision X / Y world position tracking normalized to the Sector 7 bounding box.
* **Movement State Machine:** Live telemetry displaying current state:
  * \`Idle\` | \`Walking\` | \`Running\` | \`Jumping\` | \`Driving\` | \`Interacting\` | \`Mission Active\` | \`Mission Complete\`
* **Radar Sweep:** 360-degree rotating radar beam detecting:
  * 🟢 Onegodia Hub [Home Base]
  * 🟡 Active Mission Waypoints
  * 🟣 Corrupted Digital Node #001
  * 🔵 Civil & Security NPCs
* **Interactive Warp Matrix:** Click-to-warp prototype feature for rapid developer testing across coordinate zones.
`
  },
  {
    filename: 'VEHICLE_SYSTEM.md',
    title: 'Vehicle Prototype System Specification',
    category: 'Engineering & Traversal',
    content: `# Vehicle Prototype System Specification

## 1. Overview
The Cyber-Cruiser serves as the primary urban ground vehicle prototype for MVP v1.0.

## 2. Vehicle Physics Model
* **Acceleration:** Smooth velocity ramp with forward traction.
* **Top Speed:** 2.5x player standard walking speed.
* **Braking / Reverse:** Dynamic deceleration with reverse gear capability.
* **Lighting:** Dual forward photonic headlights illuminating the neon road surface.
* **Unreal Engine 5 Target:** \`BP_CyberCruiser\` extending \`ChaosWheeledVehicleMovementComponent\`.
`
  },
  {
    filename: 'COMPLIANCE_BOUNDARIES.md',
    title: 'Compliance, Legal & Regulatory Boundaries',
    category: 'Legal & Compliance',
    content: `# Compliance, Legal & Regulatory Boundaries

**Mandatory Disclosure Notice:**
> **MVP v1.0 is a gameplay and interface prototype. Digital assets, NFT-style items, ODC, marketplace features, gambling-related features, and blockchain integrations are conceptual or roadmap-only unless expressly activated through separate legal, technical, and compliance review.**

---

## 1. Prohibited Features in MVP v1.0
Under no circumstances are any of the following represented or operated as active:
1. **ODC Economy:** Onegodian Coin is a conceptual design token only.
2. **NFT Sales & Minting:** Digital collectibles are stored locally as simulated records.
3. **Wallet Connectors:** No Web3 wallet integrations (MetaMask, Phantom, Ledger) are connected.
4. **Casino / Wagering:** No games of chance, slot mechanics, wagering, or cash prize pools.
5. **Real-Money Trading:** No fiat or crypto conversions.

## 2. Intellectual Property
*Onegodia: Rise of the Digital World™* and related assets are the proprietary intellectual property created by **One Gregory Onegodian™**.
`
  },
  {
    filename: 'ROADMAP.md',
    title: 'Multi-Phase Development Roadmap',
    category: 'Architecture & Vision',
    content: `# Staged Development Roadmap

## Phase 1: MVP v1.0 (Current Live Foundation)
* ✅ Playable 2.5D City District & Hub
* ✅ Player Movement State Machine (Walk/Run/Jump)
* ✅ Mission 001: Rebuilding Signal
* ✅ Tactical HUD with live radar sweep
* ✅ Cyber-Cruiser vehicle prototype
* ✅ Simulated rewards & inventory locker
* ✅ Web Node \`game.onegodian.com\` interface

## Phase 2: Unreal Engine 5 Prototype Core
* 🔄 UE5 Blockout of Metropolitan Core
* 🔄 \`BP_PlayerCharacter\` with Nanite mesh & Lumen lighting
* 🔄 Enhanced Chaos Vehicle physics
* 🔄 Smart NPC dialogue integration via Google Gemini AI backend

## Phase 3: Traversal & Multiplayer Alpha
* ⏳ Flying Mounts (\`BP_FlyingPawn\`)
* ⏳ Underwater Realms & Sailing coastal zones
* ⏳ Dedicated server node networking for multiplayer hubs

## Phase 4: Regulated Economy & Governance
* 🔒 Subject to legal review & regulatory clearance
* 🔒 Closed-loop digital marketplace & Layer 2 infrastructure
`
  },
  {
    filename: 'DEVELOPERS_PAGE.md',
    title: 'Developer Portal & Track Breakdown',
    category: 'Engineering & Scope',
    content: `# Developer Portal & Track Architecture

## Five Active Engineering Tracks:
1. **Track 1 — Unreal Engine 5:** Blueprint architecture (\`BP_PlayerCharacter\`, \`BP_GameMode\`, \`BP_PlayerController\`, \`BP_InteractionComponent\`, \`BP_SpawnPoint\`, \`BP_FallResetVolume\`).
2. **Track 2 — Frontend / Web Prototype:** Responsive React/TypeScript canvas engine, Tactical HUD telemetry, Mobile Controller pad, and \`game.onegodian.com\` node.
3. **Track 3 — Game Design:** Mission sequence balancing, world sector cartography, progression curves, and simulated item rarity hierarchies.
4. **Track 4 — Documentation:** Complete technical specifications, markdown architecture, and developer onboarding kits.
5. **Track 5 — Compliance & Ethics:** Mandatory regulatory guardrails, safe digital asset structuring, and zero-gambling verification.
`
  },
  {
    filename: 'PLAYERS_PAGE.md',
    title: 'Player Guide: Playable Now vs. Roadmap',
    category: 'Game Design & Controls',
    content: `# Player Guide: Welcome to Onegodia

Welcome, Citizen of Onegodia. You are experiencing the foundational MVP v1.0 of *Onegodia: Rise of the Digital World™*.

## What You Can Do Right Now:
* **Explore Sector 7:** Walk, sprint, or jump across the neon-lit plaza.
* **Pilot the Cyber-Cruiser:** Test high-speed urban driving controls.
* **Execute Mission 001:** Help Aria Pulse scan the corrupted digital node.
* **Collect Prototype Items:** Earn 250 credits and *Onegodia Data Fragment #001*.
* **Use Tactical HUD:** Track radar pings and warp across sectors.

## What is Coming in Future Phases:
* Massive multiplayer city districts with hundreds of concurrent citizens.
* High-fidelity AAA Unreal Engine 5 graphics.
* Flying mounts soaring between cyberpunk skyscrapers.
* Ocean sailing and underwater realm salvaging expeditions.
`
  },
  {
    filename: 'QA_TEST_PLAN.md',
    title: 'QA Test Plan & Verification Matrix',
    category: 'QA & Testing',
    content: `# QA Test Plan: MVP v1.0 Verification Matrix

## Test Cases:
1. **TC-01: Movement State Machine**
   * *Procedure:* Press WASD, Shift, and Space.
   * *Expected:* State transitions from Idle ➔ Walking ➔ Running ➔ Jumping with correct animations and sound effects.
2. **TC-02: Mission 001 Lifecycle**
   * *Procedure:* Interact with Aria Pulse, navigate to node, hold Scan, pick up fragment, return to Hub.
   * *Expected:* Mission moves Available ➔ Active ➔ Complete. 250 credits and Fragment #001 awarded.
3. **TC-03: Vehicle Enter/Exit**
   * *Procedure:* Approach vehicle, press \`F\` or click Mount, drive, press \`F\` to dismount.
   * *Expected:* Camera and controls lock to vehicle mode with speedometer active.
4. **TC-04: Compliance Verification**
   * *Procedure:* Inspect economy and inventory pages.
   * *Expected:* Inactive labels clearly present on all ODC and NFT placeholders.
`
  },
  {
    filename: 'BUG_LOG_TEMPLATE.md',
    title: 'Bug Report & Issue Template',
    category: 'QA & Testing',
    content: `# Bug Report Template — Onegodia MVP v1.0

**Issue ID:** \`BUG-[YEAR]-[000]\`  
**Severity:** \`Critical\` | \`High\` | \`Medium\` | \`Low\`  
**Module:** [Player Movement / Tactical HUD / Mission 001 / Vehicle / Audio]  
**Platform:** [Desktop Chrome / Safari / Firefox / Mobile Touch]

### Description:
A clear and concise description of what the bug is.

### Steps to Reproduce:
1. Spawn at Onegodia Hub
2. Execute action...
3. Observe unexpected behavior...

### Expected Behavior:
What should happen according to specification.

### Actual Behavior:
What actually occurred in prototype runtime.
`
  }
];
