# Onegodia Browser Game Runtime V1 — Design Specification

**Project:** Onegodia: Rise of the Digital World™  
**Repository:** `ohi-stack/onegodia-rise-of-the-digital-world`  
**Branch:** `feat/browser-game-runtime-v1`  
**Date:** September 20, 2026  
**Founder / Originator:** Gregory Jones / One Gregory Onegodian™  

## 1. Objective

Convert the existing `/play` experience on `game.onegodian.com` from a tactical DOM prototype into a dedicated browser-game runtime while preserving the surrounding React application, documentation, missions, inventory, developer pages, compliance pages, and existing player-progress persistence.

The first production slice must prove a complete browser gameplay loop:

**Load game → spawn at Stamford Hospital → move → interact with Mission Guide → accept Mission 001 → reach vehicle → enter vehicle → drive to Downtown objective → interact → complete mission → receive reward → save progress → reload/reset and replay.**

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
- Existing missions, inventory, tactical HUD, gameplay grid, development status, players, developers, and compliance views.

The implementation must extend these systems rather than replace unrelated application architecture.

## 3. Scope

### In scope for Browser Runtime V1

- Dedicated game render loop for `/play`.
- Canvas-based world rendering.
- Player controller with desktop and touch input.
- Player facing/direction state.
- Camera/viewport tracking inside the bounded Stamford Hospital district.
- Walk and sprint movement.
- World boundaries and simple collision primitives.
- Mission Guide NPC.
- Interaction prompt and interaction action.
- Mission 001 state machine.
- Vehicle staging, enter/exit, and simplified browser driving.
- Downtown mission objective.
- Completion/reward state.
- HUD for objective, location, interaction, movement mode, and mission state.
- Integration with the existing `PlayerProgress` and mission persistence model.
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
│   └── mission001.ts
├── npc/
│   └── MissionGuide.ts
└── persistence/
    └── gamePersistence.ts

src/components/game/
├── GameCanvas.tsx
├── GameHUD.tsx
├── InteractionPrompt.tsx
└── MobileGameControls.tsx
```

`src/views/PlayView.tsx` should compose these pieces and bridge runtime events into React state.

### 4.2 Rendering strategy

Use a native HTML `<canvas>` 2D renderer for this first production slice.

Reasons:

- No additional engine dependency is required.
- It can ship inside the current Vite/React deployment with minimal build risk.
- It gives us an actual frame loop, viewport, layered world rendering, player/vehicle/NPC sprites, collision visualization, and responsive controls.
- The runtime interfaces can later be retained while the renderer is replaced by Three.js/Babylon.js if 3D browser production is approved.

The canvas renderer must not be implemented as a one-off monolith. Runtime state and gameplay rules remain renderer-independent where practical.

### 4.3 Coordinate model

Use world-space pixel coordinates inside a bounded virtual Stamford Hospital zone, separate from screen coordinates.

The runtime owns:

- world width/height,
- player world position,
- NPC position,
- vehicle position,
- mission objective position,
- collision rectangles,
- camera offset.

Rendering converts world coordinates to viewport coordinates each frame.

This replaces the existing percentage-position DOM model while preserving the same gameplay landmarks.

## 5. Core Components

### 5.1 `GameRuntime`

Responsibilities:

- Own current runtime state.
- Start/stop the animation loop.
- Apply fixed/clamped delta time.
- Read normalized input.
- Update player/vehicle movement.
- Resolve world bounds/collisions.
- Evaluate proximity/interactions.
- Advance Mission 001.
- Emit runtime events to React.
- Render the current frame.

The runtime exposes a small public API:

- `start()`
- `stop()`
- `reset()`
- `setInputState()` or connect to `InputController`
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
- `E` = interact
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

### 5.5 Mission Guide NPC

The Mission Guide is a scripted NPC located near the Stamford Hospital start area.

Required behavior:

- visible world entity,
- interaction radius,
- prompt when player is nearby,
- `E`/touch interaction,
- one short mission-offer dialogue state,
- mission acceptance triggers Mission 001.

### 5.6 Mission 001 state machine

Canonical runtime stages:

1. `spawned`
2. `guide-reached`
3. `mission-accepted`
4. `vehicle-reached`
5. `driving`
6. `downtown-reached`
7. `objective-interacted`
8. `completed`

The mission may not skip required stages due only to proximity. Interaction gates must be explicit for Guide acceptance and Downtown completion.

Completion must update the existing persistent player state with a defined reward and last-location value.

Initial Browser V1 completion reward:

- `+250 credits`
- last location: `Downtown Stamford Gateway`
- mission-complete flag persisted through the existing mission/player state model

The reward must be idempotent: re-rendering or repeated interaction after completion must not grant credits repeatedly.

## 6. World Design — Stamford Hospital Slice

The first canvas world remains fictionalized and schematic rather than a claim of exact GIS reproduction.

Required landmarks:

- Stamford Hospital spawn campus.
- Mission Guide position near spawn.
- sidewalk/street corridor.
- vehicle staging area.
- road path toward Downtown.
- Downtown Stamford Gateway mission marker.
- decorative city blocks/green areas sufficient to make movement spatially readable.

The existing public labeling must continue to distinguish this browser slice from the separate high-fidelity Unreal Stamford build.

## 7. React Integration and Data Flow

```text
React App state
  ↓ props
PlayView
  ↓ initializes
GameCanvas / GameRuntime
  ↓ runtime events
PlayView event handlers
  ↓
setProgress / setMission
  ↓
existing localStorage persistence in App.tsx
```

The runtime should not write directly to `localStorage` if existing React application state already owns persistence. The runtime emits semantic events such as:

- `MISSION_ACCEPTED`
- `VEHICLE_ENTERED`
- `DOWNTOWN_REACHED`
- `MISSION_COMPLETED`
- `PLAYER_LOCATION_CHANGED`

React translates those events into existing `PlayerProgress` / `Mission` mutations.

This preserves one source of truth for persisted application state.

## 8. Error Handling

### Canvas/runtime startup failure

If canvas context acquisition or runtime initialization fails:

- show a visible error panel inside `/play`,
- preserve navigation to the rest of the site,
- do not crash the entire React application,
- provide a `Retry Runtime` action.

### Persistence failure

Existing application persistence already tolerates localStorage failure. Browser-runtime gameplay must continue for the current session even if persistence is unavailable.

### Invalid saved state

If persisted mission state is incomplete or incompatible with the runtime stages, normalize it back to a valid Browser V1 stage rather than throwing.

### Input cleanup

All keyboard/pointer listeners and animation-frame callbacks must be removed when `PlayView` unmounts to prevent duplicate input processing or resource leaks.

## 9. Accessibility and Mobile Behavior

- Canvas must have an accessible label/description.
- Critical state must also appear in DOM HUD text rather than only visually on the canvas.
- Touch directional controls must support pointer down/up/cancel behavior.
- Interact and vehicle actions must have visible touch buttons.
- The runtime should pause or stop processing movement when the page/view is not active or component is unmounted.

## 10. Testing Strategy

### Unit tests / pure logic tests

Test independently where practical:

- movement normalization,
- world-bound clamping,
- rectangle collision response,
- interaction-radius checks,
- mission stage transitions,
- reward idempotency,
- saved-state normalization.

### Integration tests

At minimum verify:

1. Runtime initializes.
2. Player starts at Stamford Hospital.
3. Player can move.
4. Guide proximity displays interaction state.
5. Mission cannot advance without explicit Guide interaction.
6. Mission acceptance changes objective.
7. Vehicle cannot be entered from outside radius.
8. Vehicle can be entered near staging.
9. Driving reaches Downtown trigger.
10. Downtown requires explicit interaction to complete.
11. Completion grants exactly 250 credits once.
12. Reset returns player to Stamford Hospital without duplicating reward.
13. React state persists after page reload through the existing localStorage flow.
14. Mobile controls drive the same runtime input path as keyboard controls.

### Build verification

Before merge:

- `npm install`
- `npm run lint`
- `npm run build`
- run available automated tests
- verify no TypeScript errors
- manually exercise the full Browser V1 loop in a local/preview build

## 11. Deployment and Source-Control Strategy

Implementation occurs on `feat/browser-game-runtime-v1`.

No direct product-code edits should be made on `main` during development.

Merge readiness requires:

- specification implemented,
- build passing,
- automated logic tests passing where added,
- manual gameplay acceptance evidence recorded,
- PR reviewed,
- no unrelated changes.

The existing Hostinger deployment is expected to consume `main` through its current GitHub deployment path. A merge does not by itself prove the public node deployed successfully; live status must be verified from deployment evidence or the live site after merge.

## 12. Definition of Done

Browser Game Runtime V1 is complete only when a player can:

1. Open `/play`.
2. Spawn at Stamford Hospital.
3. Move with desktop or touch controls.
4. Reach and interact with the Mission Guide.
5. Accept Mission 001.
6. Reach the vehicle staging point.
7. Enter the vehicle.
8. Drive to Downtown Stamford Gateway.
9. Interact with the objective.
10. Complete the mission.
11. Receive exactly 250 credits once.
12. Reload and retain persisted progress.
13. Reset and replay without runtime/input duplication or application crash.

Anything beyond this list is a separate approved increment.
