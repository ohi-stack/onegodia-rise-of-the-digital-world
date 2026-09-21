# Onegodia Browser Game Runtime V1 — Design Specification

**Project:** Onegodia: Rise of the Digital World™  
**Repository:** `ohi-stack/onegodia-rise-of-the-digital-world`  
**Branch:** `feat/browser-game-runtime-v1`  
**Date:** September 20, 2026  
**Founder / Originator:** Gregory Jones / One Gregory Onegodian™  

## 1. Objective

Convert the existing `/play` experience on `game.onegodian.com` from a tactical DOM prototype into a dedicated browser-game runtime while preserving the surrounding React application, documentation, missions, inventory, developer pages, compliance pages, and existing player-progress persistence.

The first production slice must prove a complete browser gameplay loop using the repository's existing canonical **Mission 001 — Rebuilding Signal**:

**Load game → spawn at Stamford Hospital / browser Hub area → move → speak with Aria Pulse → accept Mission 001 → reach vehicle → drive toward the Downtown/Sector 7 route → scan Corrupted Digital Node #001 → collect Data Fragment #001 → return to Aria Pulse / Hub → complete mission → receive the canonical 250-credit completion bounty → save progress → reload/reset and replay.**

The browser runtime is an independent playable client. The Unreal Engine Stamford build remains the high-fidelity production path developed in parallel.

## 2. Current State

The repository already contains:

- React 19 + TypeScript + Vite frontend.
- Express Node server.
- `PlayView.tsx` mounted as the `play` navigation tab.
- Stamford Hospital spawn coordinates.
- WASD / arrow-key movement.
- Shift sprint.
- Touch directional controls.
- Vehicle staging point.
- Enter/exit vehicle state.
- Downtown destination waypoint.
- Reset to Stamford Hospital.
- Local player-progress persistence through the existing application state/localStorage flow.
- Canonical `MISSION_001_REBUILDING_SIGNAL` state and objectives in `src/data/initialGameState.ts`.
- Existing missions, inventory, tactical HUD, gameplay grid, development status, players, developers, and compliance views.

The implementation must extend these systems rather than replace unrelated application architecture or silently redefine Mission 001.

## 3. Scope

### In scope for Browser Runtime V1

- Dedicated game render loop for `/play`.
- Canvas-based world rendering.
- Player controller with desktop and touch input.
- Player facing/direction state.
- Camera/viewport tracking inside the bounded Stamford Hospital district.
- Walk and sprint movement.
- World boundaries and simple collision primitives.
- Aria Pulse as the first scripted Mission Guide NPC.
- Interaction prompt and interaction action.
- Browser-runtime mapping of the existing Mission 001 objective sequence.
- Vehicle staging, enter/exit, and simplified browser driving.
- Sector 7 / Downtown route objective.
- Corrupted Digital Node #001 scan interaction.
- Data Fragment #001 collection.
- Return-to-Hub step.
- Canonical mission completion/reward integration.
- HUD for objective, location, interaction, movement mode, and mission state.
- Integration with the existing `PlayerProgress` and `Mission` persistence model.
- Reset and replay behavior.
- Responsive desktop/mobile controls.
- Graceful fallback if canvas initialization fails.

### Explicitly out of scope

- Multiplayer/network replication.
- ODC/blockchain economy.
- NFT or marketplace functionality.
- Real-money game mechanics.
- Full Stamford GIS reproduction.
- Three.js/Babylon.js dependency in this first slice.
- Large open-world streaming.
- Flying.
- Combat expansion.
- Advanced NPC AI/LLM autonomy.
- Unreal code or Unreal asset changes.

These remain future phases unless separately approved.

## 4. Architecture

### 4.1 Runtime boundary

`PlayView` remains the React route/view boundary. It becomes an orchestration shell rather than containing all gameplay logic inline.

Recommended structure:

```text
src/game/
├── runtime/
│   ├── GameRuntime.ts
│   ├── gameLoop.ts
│   └── runtimeTypes.ts
├── input/
│   └── InputController.ts
├── world/
│   ├── stamfordHospitalZone.ts
│   ├── collision.ts
│   └── worldTypes.ts
├── player/
│   └── PlayerController.ts
├── vehicle/
│   └── VehicleController.ts
├── missions/
│   └── mission001Runtime.ts
└── npc/
    └── AriaPulse.ts

src/components/game/
├── GameCanvas.tsx
├── GameHUD.tsx
├── InteractionPrompt.tsx
└── MobileGameControls.tsx
```

`src/views/PlayView.tsx` composes these pieces and bridges runtime events into React state.

### 4.2 Rendering strategy

Use a native HTML `<canvas>` 2D renderer for this first production slice.

Reasons:

- No additional engine dependency is required.
- It can ship inside the current Vite/React deployment with minimal build risk.
- It provides an actual frame loop, viewport, layered world rendering, player/vehicle/NPC sprites, collision, mission markers, and responsive controls.
- The runtime interfaces can later be retained while the renderer is replaced by Three.js/Babylon.js if 3D browser production is separately approved.

The canvas renderer must not be implemented as a one-off monolith. Runtime state and gameplay rules remain renderer-independent where practical.

### 4.3 Coordinate model

Use world-space pixel coordinates inside a bounded fictionalized Stamford Hospital zone, separate from screen coordinates.

The runtime owns:

- world width/height,
- player world position,
- NPC position,
- vehicle position,
- Sector 7 / Digital Node position,
- Hub return position,
- collision rectangles,
- camera offset.

Rendering converts world coordinates to viewport coordinates each frame.

This replaces the existing percentage-position DOM model while preserving the same public Stamford Hospital and Downtown route concepts.

## 5. Core Components

### 5.1 `GameRuntime`

Responsibilities:

- Own current runtime state.
- Start/stop the animation loop.
- Apply clamped delta time.
- Read normalized input.
- Update player/vehicle movement.
- Resolve world bounds/collisions.
- Evaluate proximity/interactions.
- Map runtime actions to canonical Mission 001 objectives.
- Emit semantic runtime events to React.
- Render the current frame.

Public API:

- `start()`
- `stop()`
- `reset()`
- `interact()`
- `enterExitVehicle()`
- `getSnapshot()`

### 5.2 `InputController`

Normalize desktop and touch input into one structure:

```ts
{
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean,
  sprint: boolean,
  interactPressed: boolean,
  vehiclePressed: boolean
}
```

Desktop mappings:

- `W` / Arrow Up = up
- `S` / Arrow Down = down
- `A` / Arrow Left = left
- `D` / Arrow Right = right
- `Shift` = sprint
- `E` = interact / scan / collect / report, depending on the active objective
- `F` = enter/exit vehicle

Touch controls map to the same runtime input model.

### 5.3 Player controller

Player states:

- `on-foot`
- `in-vehicle`

On-foot movement supports normalized diagonal movement, walk speed, sprint speed, facing direction, and collision resolution.

### 5.4 Vehicle controller

Browser V1 driving is intentionally simplified.

Required behavior:

- Enter vehicle only while within interaction radius.
- Exit vehicle while driving.
- Faster movement than walking.
- Distinct vehicle rendering.
- Same world-boundary/collision rules as the player.

No realistic physics simulation is required in this slice.

### 5.5 Aria Pulse NPC

Aria Pulse is the scripted Mission Guide for Browser Runtime V1.

Required behavior:

- visible world entity near the start/Hub area,
- interaction radius,
- prompt when player is nearby,
- `E`/touch interaction,
- briefing dialogue sourced from the existing Mission 001 definition,
- mission acceptance advances the existing mission state.

### 5.6 Mission 001 runtime mapping

The browser runtime must preserve the canonical mission definition from `INITIAL_MISSION_001` rather than replacing it.

Runtime stages map to the existing six objectives:

1. **Speak to Aria Pulse at the Hub** — player reaches Aria and explicitly interacts.
2. **Travel to Sector 7 Outpost** — player reaches vehicle staging, enters vehicle, and travels along the browser route toward the Downtown/Sector 7 destination.
3. **Scan Corrupted Digital Node #001** — player reaches the node and performs explicit `E`/touch scan interaction.
4. **Collect Onegodia Data Fragment #001** — scan completion reveals/permits a separate collection interaction.
5. **Return to Hub and report to Aria Pulse** — player returns to the start/Hub area and explicitly interacts with Aria.
6. **Receive mission completion bounty** — existing mission completion logic grants the canonical 250-credit grand bounty and associated completion state exactly once.

The runtime may expose finer internal stages (`vehicle-reached`, `driving`, `node-reached`, `returning`) but those are implementation detail; the persisted mission source of truth remains the existing `Mission` object and objective list.

Reward behavior must be idempotent. Re-rendering, resetting the canvas, or repeated interaction after mission completion must not grant the final bounty repeatedly.

## 6. World Design — Stamford Hospital Slice

The first canvas world remains fictionalized and schematic rather than a claim of exact GIS reproduction.

Required landmarks:

- Stamford Hospital spawn / browser Hub area.
- Aria Pulse near the Hub.
- sidewalk/street corridor.
- vehicle staging area.
- road path toward Downtown / Sector 7.
- Corrupted Digital Node #001 objective area.
- return route to the Hub.
- decorative city blocks/green areas sufficient to make movement spatially readable.

The existing public labeling must continue to distinguish this browser slice from the separate high-fidelity Unreal Stamford build.

## 7. React Integration and Data Flow

```text
React App state (`progress`, `mission`)
  ↓ props
PlayView
  ↓ initializes
GameCanvas / GameRuntime
  ↓ semantic runtime events
PlayView event handlers
  ↓
setProgress / setMission
  ↓
existing localStorage persistence in App.tsx
```

The runtime does not write directly to `localStorage`. Existing React application state remains the persistence owner.

Semantic events may include:

- `GUIDE_INTERACTED`
- `MISSION_ACCEPTED`
- `VEHICLE_ENTERED`
- `SECTOR_7_REACHED`
- `NODE_SCANNED`
- `FRAGMENT_COLLECTED`
- `HUB_RETURNED`
- `MISSION_COMPLETED`
- `PLAYER_LOCATION_CHANGED`

`PlayView` translates these events into changes to the existing `PlayerProgress` and `Mission` structures.

`App.tsx` must pass both `mission/setMission` and `progress/setProgress` to `PlayView` after this refactor.

## 8. Error Handling

### Canvas/runtime startup failure

If canvas context acquisition or runtime initialization fails:

- show a visible error panel inside `/play`,
- preserve navigation to the rest of the site,
- do not crash the React application,
- provide a `Retry Runtime` action.

### Persistence failure

Existing application persistence already tolerates localStorage failure. Browser-runtime gameplay must continue for the current session even if persistence is unavailable.

### Invalid saved state

If persisted mission state is incomplete, stale, or incompatible, normalize it against `INITIAL_MISSION_001` in the same spirit as the existing `App.tsx` normalization behavior rather than throwing.

### Input cleanup

All keyboard/pointer listeners and animation-frame callbacks must be removed when `PlayView` unmounts to prevent duplicate input processing or resource leaks.

## 9. Accessibility and Mobile Behavior

- Canvas has an accessible label/description.
- Critical state appears in DOM HUD text as well as visually on the canvas.
- Touch directional controls support pointer down/up/cancel behavior.
- Interact and vehicle actions have visible touch buttons.
- Runtime processing stops on unmount.
- Keyboard actions do not hijack unrelated site navigation when the runtime is not active.

## 10. Testing Strategy

### Pure-logic tests

Test independently where practical:

- movement normalization,
- world-bound clamping,
- rectangle collision response,
- interaction-radius checks,
- runtime-to-Mission-001 objective mapping,
- valid objective transition order,
- reward idempotency,
- saved-state normalization.

### Integration / acceptance tests

At minimum verify:

1. Runtime initializes.
2. Player starts at Stamford Hospital / Hub.
3. Player can move.
4. Aria proximity displays interaction state.
5. Objective 1 cannot complete without explicit Aria interaction.
6. Mission acceptance changes objective state.
7. Vehicle cannot be entered outside its interaction radius.
8. Vehicle can be entered near staging.
9. Driving can reach the Sector 7 / Downtown route destination.
10. Node scan requires explicit interaction.
11. Fragment collection requires a subsequent explicit interaction.
12. Mission cannot complete at the node; player must return to Hub.
13. Return interaction with Aria advances the reporting objective.
14. Final completion grants the canonical 250-credit completion bounty exactly once.
15. Relevant fragment/completion state is reflected in existing persisted player/mission structures.
16. Reset returns the runtime avatar to Stamford Hospital without duplicating rewards or erasing canonical persisted mission state unless an explicit new-game/reset-progress action is later approved.
17. Page reload restores persisted progress through the existing localStorage flow.
18. Mobile controls use the same runtime input path as keyboard controls.

### Build verification

Before merge:

- install dependencies using the repository's normal package workflow,
- `npm run lint`,
- `npm run build`,
- run added automated tests,
- verify no TypeScript errors,
- manually exercise the full Browser Runtime V1 mission loop in a local/preview build.

## 11. Deployment and Source-Control Strategy

Implementation occurs on `feat/browser-game-runtime-v1`.

No direct product-code edits are made on `main` during development.

Merge readiness requires:

- specification implemented,
- build passing,
- automated logic tests passing,
- manual gameplay acceptance evidence recorded,
- PR reviewed,
- no unrelated changes.

The existing Hostinger deployment is expected to consume `main` through its current GitHub deployment path. A merge does not itself prove the public node deployed successfully; live status must be verified from deployment evidence or the public site after merge.

## 12. Definition of Done

Browser Game Runtime V1 is complete only when a player can:

1. Open `/play`.
2. Spawn at Stamford Hospital / browser Hub.
3. Move with desktop or touch controls.
4. Reach and interact with Aria Pulse.
5. Accept Mission 001 — Rebuilding Signal.
6. Reach the vehicle staging point.
7. Enter the vehicle.
8. Drive to the Sector 7 / Downtown route objective.
9. Scan Corrupted Digital Node #001.
10. Collect Onegodia Data Fragment #001.
11. Return to Aria Pulse / Hub.
12. Report mission completion.
13. Receive the canonical 250-credit final completion bounty exactly once.
14. Reload and retain persisted progress.
15. Reset/re-enter the runtime without duplicate input handlers, duplicate rewards, or application crash.

Anything beyond this list is a separate approved increment.
