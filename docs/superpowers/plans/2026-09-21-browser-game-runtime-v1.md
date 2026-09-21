# Onegodia Browser Game Runtime V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the existing `/play` tactical prototype into a dedicated Canvas-based browser game runtime that completes the canonical Mission 001 loop while preserving the surrounding React application and existing player/mission persistence.

**Architecture:** `PlayView` remains the React route boundary, but gameplay moves into focused modules under `src/game/`. Pure TypeScript modules own world state, movement, collision, vehicle state, and Mission 001 progression; a native HTML Canvas renderer visualizes that state. React components own the HUD, mobile controls, error fallback, and the bridge between runtime events and the existing `PlayerProgress` / `Mission` application state.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Express 4, native HTML Canvas 2D, Node test runner through the already-installed `tsx` package.

**Spec:** `docs/superpowers/specs/2026-09-20-browser-game-runtime-v1-design.md`

## Global Constraints

- Preserve the current `ohi-stack/onegodia-rise-of-the-digital-world` React/Vite/Express architecture.
- Preserve canonical `MISSION_001_REBUILDING_SIGNAL` and its existing 250-credit completion reward.
- Preserve `PlayerProgress`, `Mission`, and current localStorage persistence contracts unless a backwards-compatible field is explicitly added.
- Keep `/play` browser-only; do not modify the Unreal project in this plan.
- Do not add Three.js, Babylon.js, multiplayer, blockchain, ODC transactions, marketplace logic, flying, or advanced combat.
- Important progression gates must require explicit interaction, not proximity alone.
- Existing non-play pages must continue to compile and render.
- Browser V1 must work with keyboard and touch controls.
- Canvas initialization failure must leave a usable fallback/reset path rather than a blank screen.

## Review Focus

1. **Repeated interaction input:** holding `E` or `F` must not skip multiple mission stages or rapidly toggle vehicle state.
2. **Diagonal movement:** simultaneous horizontal/vertical input must be normalized so diagonal travel is not faster than cardinal travel.
3. **Mission reload state:** reloading with Mission 001 already active or complete must restore a valid stage without duplicating rewards.
4. **Canvas sizing:** runtime coordinates must stay stable when the viewport resizes; rendering may scale, world state must not.
5. **Touch release/cancel:** pointer-up, pointer-leave, and pointer-cancel must clear movement so mobile input cannot get stuck.

---

## File Structure

### New runtime files

- `src/game/runtime/runtimeTypes.ts` — browser-runtime state contracts, input state, stage enum, snapshots, runtime events.
- `src/game/world/stamfordHospitalZone.ts` — bounded world definition, landmarks, collision rectangles, interaction radii.
- `src/game/world/collision.ts` — pure boundary/collision helpers.
- `src/game/player/PlayerController.ts` — pure on-foot movement update.
- `src/game/vehicle/VehicleController.ts` — pure simplified vehicle movement and enter/exit eligibility.
- `src/game/missions/mission001.ts` — pure Mission 001 runtime stage machine and reward guard.
- `src/game/runtime/GameRuntime.ts` — orchestrates state updates, input edges, proximity, mission progression, events, and snapshots.
- `src/game/render/CanvasRenderer.ts` — native Canvas 2D world + entity rendering only.
- `src/game/persistence/gamePersistence.ts` — maps runtime completion into existing `Mission` and `PlayerProgress` state without duplicate rewards.
- `src/components/game/GameCanvas.tsx` — Canvas lifecycle, resize handling, runtime startup/shutdown, fallback UI.
- `src/components/game/GameHUD.tsx` — current mission, objective, location, mode, credits, fragment, and status overlay.
- `src/components/game/InteractionPrompt.tsx` — contextual `E`/touch interaction prompt.
- `src/components/game/MobileGameControls.tsx` — touch controls mapped to the normalized input contract.

### Existing files to modify

- `package.json` — add a deterministic test script using `tsx --test`.
- `src/views/PlayView.tsx` — replace inline tactical-map logic with runtime orchestration components.
- `src/App.tsx` — pass canonical `mission` / `setMission` into `PlayView` so `/play` updates the same mission object used by the rest of the app.
- `src/data/initialGameState.ts` — no mission-content rewrite; only change if a required backwards-compatible runtime constant belongs here.
- `src/index.css` — add minimal game-canvas/responsive control styles only if utility classes cannot express them cleanly.

### Tests

- `src/game/world/collision.test.ts`
- `src/game/player/PlayerController.test.ts`
- `src/game/vehicle/VehicleController.test.ts`
- `src/game/missions/mission001.test.ts`
- `src/game/persistence/gamePersistence.test.ts`
- `src/game/runtime/GameRuntime.test.ts`

---

### Task 1: Establish the runtime contracts, test command, and bounded Stamford Hospital world

**Files:**
- Modify: `package.json`
- Create: `src/game/runtime/runtimeTypes.ts`
- Create: `src/game/world/stamfordHospitalZone.ts`
- Create: `src/game/world/collision.ts`
- Test: `src/game/world/collision.test.ts`

**Interfaces:**
- Produces: `GameInputState`, `RuntimeStage`, `WorldPosition`, `RuntimeSnapshot`, `RuntimeEvent`, `STAMFORD_HOSPITAL_ZONE`, `clampToWorld(position, radius, bounds)`, `resolveCircleAgainstRects(position, radius, obstacles)`.
- Consumes: no new runtime code.

- [ ] **Step 1: Add the test script**

Update `package.json` scripts to include:

```json
"test": "tsx --test src/game/**/*.test.ts"
```

Do not remove the existing `dev`, `build`, `start`, `preview`, `clean`, or `lint` scripts.

- [ ] **Step 2: Define runtime contracts**

Create `runtimeTypes.ts` with these exact public types:

```ts
export type RuntimeStage =
  | 'spawned'
  | 'guide-reached'
  | 'mission-accepted'
  | 'vehicle-reached'
  | 'driving'
  | 'sector-7-reached'
  | 'node-scanned'
  | 'fragment-collected'
  | 'returning-to-hub'
  | 'completed';

export interface WorldPosition { x: number; y: number }

export interface GameInputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
}

export interface RuntimeSnapshot {
  stage: RuntimeStage;
  player: WorldPosition;
  facingRadians: number;
  mode: 'on-foot' | 'in-vehicle';
  locationLabel: string;
  objectiveText: string;
  interactionPrompt: string | null;
  hasFragment: boolean;
  missionAccepted: boolean;
  missionCompleted: boolean;
}

export type RuntimeEvent =
  | { type: 'mission-accepted' }
  | { type: 'node-scanned' }
  | { type: 'fragment-collected' }
  | { type: 'mission-completed' }
  | { type: 'vehicle-entered' }
  | { type: 'vehicle-exited' };
```

- [ ] **Step 3: Write failing collision tests**

Create `collision.test.ts` covering boundary clamping and obstacle rejection:

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { clampToWorld, resolveCircleAgainstRects } from './collision';

const bounds = { width: 2000, height: 1400 };

test('clamps player center inside world bounds', () => {
  assert.deepEqual(clampToWorld({ x: -10, y: 1500 }, 20, bounds), { x: 20, y: 1380 });
});

test('rejects movement into a collision rectangle', () => {
  const previous = { x: 100, y: 100 };
  const attempted = { x: 155, y: 100 };
  const result = resolveCircleAgainstRects(previous, attempted, 20, [{ x: 150, y: 60, width: 100, height: 100 }]);
  assert.deepEqual(result, previous);
});
```

- [ ] **Step 4: Run the collision test and verify failure**

Run:

```bash
npm test -- --test-name-pattern="clamps|rejects"
```

Expected: failure because `collision.ts` does not yet export the helpers.

- [ ] **Step 5: Implement collision helpers and the Stamford world definition**

Create `collision.ts` with pure implementations matching the tests. Create `stamfordHospitalZone.ts` using a fixed `2000 x 1400` world and these stable gameplay anchors:

```ts
export const STAMFORD_HOSPITAL_ZONE = {
  width: 2000,
  height: 1400,
  spawn: { x: 260, y: 980 },
  ariaPulse: { x: 390, y: 900 },
  vehicle: { x: 650, y: 820 },
  sector7: { x: 1420, y: 500 },
  digitalNode: { x: 1600, y: 360 },
  hubReturn: { x: 390, y: 900 },
  interactionRadius: 72,
  vehicleRadius: 82,
  obstacles: [
    { x: 80, y: 760, width: 360, height: 160, label: 'Stamford Hospital footprint' },
    { x: 780, y: 610, width: 250, height: 190, label: 'Hospital District block A' },
    { x: 1120, y: 250, width: 230, height: 210, label: 'Downtown block B' }
  ]
} as const;
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm test
```

Expected: collision tests pass.

- [ ] **Step 7: Commit**

```bash
git add package.json src/game/runtime/runtimeTypes.ts src/game/world/stamfordHospitalZone.ts src/game/world/collision.ts src/game/world/collision.test.ts
git commit -m "feat(game): establish browser runtime world contracts"
```

---

### Task 2: Implement deterministic player and vehicle movement

**Files:**
- Create: `src/game/player/PlayerController.ts`
- Create: `src/game/vehicle/VehicleController.ts`
- Test: `src/game/player/PlayerController.test.ts`
- Test: `src/game/vehicle/VehicleController.test.ts`

**Interfaces:**
- Consumes: `GameInputState`, `WorldPosition`, collision helpers, `STAMFORD_HOSPITAL_ZONE`.
- Produces: `updatePlayerPosition(...)`, `updateVehiclePosition(...)`, `canEnterVehicle(...)`.

- [ ] **Step 1: Write failing player movement tests**

Test cardinal movement, normalized diagonal movement, sprint speed, collision, and world bounds. The diagonal assertion must verify distance moved is approximately equal to cardinal movement for the same delta time.

- [ ] **Step 2: Run player tests and verify failure**

Run:

```bash
npm test -- --test-name-pattern="player|diagonal|sprint"
```

Expected: failure because `PlayerController.ts` is missing.

- [ ] **Step 3: Implement `updatePlayerPosition`**

Use this signature:

```ts
export function updatePlayerPosition(args: {
  current: WorldPosition;
  input: GameInputState;
  deltaSeconds: number;
  sprinting: boolean;
}): { position: WorldPosition; facingRadians: number }
```

Use `180` world-units/second walk speed and `300` world-units/second sprint speed. Clamp `deltaSeconds` to `0.05`. Normalize the movement vector before multiplying by speed.

- [ ] **Step 4: Write failing vehicle tests**

Verify vehicle movement is faster than sprinting, respects collision/bounds, and `canEnterVehicle` returns true only within the configured radius.

- [ ] **Step 5: Implement vehicle helpers**

Use `420` world-units/second vehicle speed and the same normalized directional input for V1. Do not implement acceleration curves or realistic steering physics in this slice.

- [ ] **Step 6: Run tests**

Run:

```bash
npm test
```

Expected: player and vehicle tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/game/player src/game/vehicle
git commit -m "feat(game): add deterministic player and vehicle movement"
```

---

### Task 3: Implement the canonical Mission 001 runtime state machine

**Files:**
- Create: `src/game/missions/mission001.ts`
- Test: `src/game/missions/mission001.test.ts`

**Interfaces:**
- Consumes: `RuntimeStage`, world anchor positions.
- Produces: `getMissionObjective(stage)`, `getInteractionPrompt(context)`, `advanceMissionOnInteract(context)`, `advanceMissionOnProximity(context)`.

- [ ] **Step 1: Write failing mission-order tests**

Tests must prove:

```text
spawned -> guide-reached          (proximity)
guide-reached -> mission-accepted (explicit interact)
mission-accepted -> vehicle-reached (proximity)
vehicle-reached -> driving        (explicit vehicle toggle)
driving -> sector-7-reached       (proximity)
sector-7-reached -> node-scanned  (explicit interact)
node-scanned -> fragment-collected (explicit interact)
fragment-collected -> returning-to-hub (state transition after collection)
returning-to-hub -> completed     (explicit interact at Aria Pulse)
```

Also assert that interacting with the Digital Node before Mission 001 is accepted does not advance the mission.

- [ ] **Step 2: Write the repeated-input guard test**

A single `interactPressed` edge may advance at most one stage. Holding the key across multiple update frames must not jump from `sector-7-reached` through `fragment-collected` in one continuous press.

- [ ] **Step 3: Run tests and verify failure**

Run:

```bash
npm test -- --test-name-pattern="mission|interact"
```

Expected: failure because the state-machine module is missing.

- [ ] **Step 4: Implement the mission state machine**

Keep mission copy consistent with the existing `INITIAL_MISSION_001` object: Aria Pulse, Sector 7, Corrupted Digital Node #001, Onegodia Data Fragment #001, and return to Hub.

- [ ] **Step 5: Run mission tests**

Run:

```bash
npm test -- --test-name-pattern="mission|interact"
```

Expected: all Mission 001 tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/game/missions/mission001.ts src/game/missions/mission001.test.ts
git commit -m "feat(game): add Mission 001 browser runtime state machine"
```

---

### Task 4: Implement the runtime orchestrator and edge-triggered controls

**Files:**
- Create: `src/game/runtime/GameRuntime.ts`
- Test: `src/game/runtime/GameRuntime.test.ts`

**Interfaces:**
- Consumes: world definition, player controller, vehicle controller, Mission 001 state machine.
- Produces: `GameRuntime` with `start()`, `stop()`, `reset()`, `setInputState()`, `interact()`, `toggleVehicle()`, `getSnapshot()`, `subscribe(listener)`.

- [ ] **Step 1: Write failing runtime tests**

Test:

- initial snapshot starts at Stamford Hospital;
- moving updates world position;
- interaction emits one mission event per call;
- vehicle toggle emits `vehicle-entered`/`vehicle-exited`;
- reset returns to `spawned` and spawn coordinates;
- runtime restores a supplied persisted stage without paying rewards itself.

- [ ] **Step 2: Run runtime tests and verify failure**

Run:

```bash
npm test -- --test-name-pattern="runtime"
```

Expected: failure because `GameRuntime` is missing.

- [ ] **Step 3: Implement `GameRuntime`**

Constructor signature:

```ts
new GameRuntime({
  initialStage,
  initialMissionAccepted,
  initialMissionCompleted,
  onEvent
})
```

`GameRuntime` owns world mechanics only. It must not mutate React state, localStorage, credits, or inventory directly.

- [ ] **Step 4: Add input edge guards**

Keyboard/touch handlers call `interact()` and `toggleVehicle()` once on press edges. Movement booleans remain continuous. Ensure a held key cannot repeatedly advance a stage.

- [ ] **Step 5: Run runtime tests**

Run:

```bash
npm test
```

Expected: all pure runtime tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/game/runtime/GameRuntime.ts src/game/runtime/GameRuntime.test.ts
git commit -m "feat(game): add browser game runtime orchestrator"
```

---

### Task 5: Preserve mission/player persistence and prevent duplicate rewards

**Files:**
- Create: `src/game/persistence/gamePersistence.ts`
- Test: `src/game/persistence/gamePersistence.test.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: existing `Mission`, `PlayerProgress`, runtime events.
- Produces: `deriveInitialRuntimeStage(mission, progress)`, `applyRuntimeEvent(event, mission, progress)`.

- [ ] **Step 1: Write failing persistence tests**

Test these cases:

1. Completing Mission 001 adds exactly `250` credits once.
2. A second `mission-completed` event does not add another `250` credits.
3. Completion adds `MISSION_001_REBUILDING_SIGNAL` to `missionsCompleted` once.
4. Completion adds `Onegodia Data Fragment #001` to `collectedFragments` once.
5. Completion sets mission status to `Complete`, marks all objectives complete, and sets `lastWarpLocation` to `Onegodia Hub / Stamford Hospital District`.
6. Reloading a complete mission derives runtime stage `completed`.
7. Reloading an active mission derives a valid in-progress stage and never `spawned` if progress already exists.

- [ ] **Step 2: Run persistence tests and verify failure**

Run:

```bash
npm test -- --test-name-pattern="persistence|reward|reload"
```

Expected: failure because persistence adapter is missing.

- [ ] **Step 3: Implement the pure persistence adapter**

`applyRuntimeEvent` returns new objects:

```ts
{
  mission: Mission;
  progress: PlayerProgress;
}
```

It must never write localStorage; existing `App.tsx` effects remain the sole persistence writer.

- [ ] **Step 4: Modify `App.tsx` PlayView props**

Change the `/play` mount to pass:

```tsx
<PlayView
  progress={progress}
  setProgress={setProgress}
  mission={mission}
  setMission={setMission}
/>
```

- [ ] **Step 5: Run tests and type-check**

Run:

```bash
npm test
npm run lint
```

Expected: all tests pass; TypeScript reports no errors.

- [ ] **Step 6: Commit**

```bash
git add src/game/persistence src/App.tsx
git commit -m "feat(game): bridge browser runtime to canonical mission persistence"
```

---

### Task 6: Add Canvas rendering with resize-safe camera behavior

**Files:**
- Create: `src/game/render/CanvasRenderer.ts`
- Create: `src/components/game/GameCanvas.tsx`

**Interfaces:**
- Consumes: `RuntimeSnapshot`, `STAMFORD_HOSPITAL_ZONE`, runtime subscription API.
- Produces: `CanvasRenderer.render(ctx, snapshot, viewport)` and `GameCanvas` React component.

- [ ] **Step 1: Implement renderer-independent viewport math**

Inside `CanvasRenderer.ts`, expose a pure helper:

```ts
export function worldToScreen(args: {
  point: WorldPosition;
  camera: WorldPosition;
  viewportWidth: number;
  viewportHeight: number;
}): WorldPosition
```

Camera rendering changes screen projection only; it must never mutate runtime world coordinates.

- [ ] **Step 2: Add a viewport test in `GameRuntime.test.ts` or a focused renderer test**

Assert that changing viewport dimensions changes screen coordinates but leaves the supplied world point object unchanged.

- [ ] **Step 3: Implement Canvas world rendering**

Render at minimum:

- dark Stamford district ground/grid;
- road corridors;
- Stamford Hospital footprint and label;
- Aria Pulse marker;
- vehicle marker;
- Sector 7 / Downtown gateway;
- Corrupted Digital Node #001;
- player or vehicle avatar;
- camera-follow offset;
- subtle waypoint line/marker to the current objective.

No external image assets are required for this slice.

- [ ] **Step 4: Implement `GameCanvas` lifecycle**

`GameCanvas` must:

- create one runtime instance;
- start/stop `requestAnimationFrame` on mount/unmount;
- use `ResizeObserver` or window resize to fit its container;
- cap device pixel ratio used for backing resolution at `2`;
- catch canvas/runtime initialization errors and render a visible fallback panel with a reset/reload action.

- [ ] **Step 5: Run tests, lint, and build**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/game/render src/components/game/GameCanvas.tsx
git commit -m "feat(game): render Stamford runtime on dedicated canvas"
```

---

### Task 7: Add HUD, interaction prompts, keyboard, and mobile controls

**Files:**
- Create: `src/components/game/GameHUD.tsx`
- Create: `src/components/game/InteractionPrompt.tsx`
- Create: `src/components/game/MobileGameControls.tsx`
- Modify: `src/views/PlayView.tsx`
- Modify: `src/index.css` only if needed for safe-area/responsive canvas sizing.

**Interfaces:**
- Consumes: `RuntimeSnapshot`, runtime control functions, canonical `mission` / `progress`.
- Produces: final `/play` interactive UI.

- [ ] **Step 1: Replace inline map state in `PlayView`**

Remove the old percentage-based DOM world and interval movement loop. `PlayView` becomes a composition shell for `GameCanvas`, `GameHUD`, `InteractionPrompt`, and `MobileGameControls`.

- [ ] **Step 2: Implement keyboard controls**

Mappings:

```text
W / ArrowUp    -> up
S / ArrowDown  -> down
A / ArrowLeft  -> left
D / ArrowRight -> right
Shift          -> sprint
E              -> interact edge
F              -> vehicle toggle edge
R              -> browser-runtime reset
```

Prevent default browser scrolling only while `/play` has gameplay focus.

- [ ] **Step 3: Implement HUD**

Show:

- `MIS-001 — Rebuilding Signal`;
- current objective text from runtime stage;
- location label;
- `ON FOOT` / `DRIVING`;
- current credits from `PlayerProgress`;
- whether Data Fragment #001 is held/collected;
- mission progress indicator;
- reset control.

- [ ] **Step 4: Implement interaction prompt**

Only render when runtime snapshot provides a prompt. Examples:

```text
E — TALK TO ARIA PULSE
E — SCAN DIGITAL NODE #001
E — COLLECT DATA FRAGMENT #001
E — REPORT TO ARIA PULSE
F — ENTER VEHICLE
F — EXIT VEHICLE
```

- [ ] **Step 5: Implement mobile controls with cancellation safety**

Directional controls must clear on `pointerup`, `pointerleave`, and `pointercancel`. `Interact` and `Vehicle` buttons fire one edge event per press. Include mobile Sprint and Reset controls.

- [ ] **Step 6: Run verification commands**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src/views/PlayView.tsx src/components/game src/index.css
git commit -m "feat(game): integrate playable HUD and cross-device controls"
```

---

### Task 8: Full Browser V1 verification and release evidence

**Files:**
- Create: `docs/development/BROWSER_GAME_V1_VERIFICATION.md`
- Modify: `README.md` only to add verified browser-runtime status and link to evidence.

**Interfaces:**
- Consumes: completed runtime implementation.
- Produces: reproducible release evidence and a merge-ready branch.

- [ ] **Step 1: Run the complete automated verification suite**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: every command exits `0`.

- [ ] **Step 2: Run local production server smoke test**

Run:

```bash
npm start
```

Then verify:

```text
GET /api/health -> HTTP 200 and status "ok"
GET /           -> application HTML
```

- [ ] **Step 3: Perform the manual vertical-slice playtest**

Record PASS/FAIL for each exact checkpoint:

```text
1. Open /play.
2. Spawn at Stamford Hospital.
3. Walk and sprint with keyboard.
4. Move with touch/pointer controls.
5. Approach Aria Pulse.
6. Press E / Interact once and accept Mission 001.
7. Reach vehicle.
8. Press F / Vehicle once and enter.
9. Drive toward Sector 7 / Downtown.
10. Reach Digital Node #001.
11. Press E to scan.
12. Press E once to collect Data Fragment #001.
13. Return to Aria Pulse / Hub.
14. Press E to complete mission.
15. Confirm exactly +250 completion credits.
16. Reload page.
17. Confirm mission remains complete and credits do not increase again.
18. Reset Browser V1 and confirm runtime position resets without corrupting canonical mission completion history.
```

- [ ] **Step 4: Write verification evidence**

`BROWSER_GAME_V1_VERIFICATION.md` must contain:

- commit SHA tested;
- date/time;
- Node/npm versions if available;
- `npm test`, `npm run lint`, `npm run build` results;
- each manual checkpoint result;
- known limitations;
- statement that Unreal remains the high-fidelity production path;
- statement that multiplayer/economic/blockchain systems remain out of scope.

- [ ] **Step 5: Update README status only from evidence**

Use status wording:

```text
Browser Runtime V1: Verified locally on the recorded commit when all automated and manual checks pass.
Live game.onegodian.com deployment: Verification required until Hostinger serves the merged main commit and the live smoke check passes.
```

Do not call the live node verified before checking it.

- [ ] **Step 6: Commit verification docs**

```bash
git add docs/development/BROWSER_GAME_V1_VERIFICATION.md README.md
git commit -m "docs(game): record Browser V1 verification evidence"
```

---

### Task 9: Cross-repository alignment with the Unreal V1 project

**Repository:** `ohi-stack/onegodian-rise-v1`

**Files:**
- Modify or create: `docs/BROWSER_GAME_RUNTIME_STATUS.md`
- Update the relevant open Stamford/browser integration issue if one exists; otherwise create a concise tracking issue.

**Interfaces:**
- Consumes: verified browser-runtime commit/PR URL from the web repository.
- Produces: Unreal repository documentation that clearly separates Browser V1 from Unreal V1 while documenting the shared Stamford Hospital origin and Mission 001 concepts.

- [ ] **Step 1: Record the browser-runtime relationship**

Document:

```text
Browser client: ohi-stack/onegodia-rise-of-the-digital-world
Production game client: ohi-stack/onegodian-rise-v1
Shared canonical start: Stamford Hospital
Browser purpose: immediately playable web vertical slice
Unreal purpose: high-fidelity production world
```

- [ ] **Step 2: Link verified evidence, not claims**

Include the exact browser PR/commit and verification document. If the browser runtime has not passed verification, label it `Implementation In Progress` instead of `Playable Verified`.

- [ ] **Step 3: Commit the Unreal documentation update**

Use commit message:

```bash
git commit -m "docs: align Unreal V1 with browser game runtime"
```

---

### Task 10: Merge, Hostinger deployment, and live-node verification

**Repositories/Systems:**
- `ohi-stack/onegodia-rise-of-the-digital-world`
- Hostinger deployment for `game.onegodian.com`

**Interfaces:**
- Consumes: verified feature branch and PR.
- Produces: merged `main` plus deployment evidence for the public node.

- [ ] **Step 1: Open a pull request from `feat/browser-game-runtime-v1` to `main`**

PR description must list:

- runtime architecture;
- canonical Mission 001 preservation;
- automated verification commands/results;
- manual vertical-slice evidence;
- explicit out-of-scope systems;
- rollback method: redeploy/revert the merge commit.

- [ ] **Step 2: Check PR status and changed files**

Confirm only intended runtime, integration, tests, and documentation files changed.

- [ ] **Step 3: Merge only after required checks pass**

Use squash or repository-standard merge method. Record resulting `main` SHA.

- [ ] **Step 4: Confirm Hostinger deploys that exact `main` SHA**

If the existing GitHub-to-Hostinger pipeline auto-deploys, use its deployment evidence. If no deployment evidence is available through connected tools, state `deployment verification unavailable` rather than guessing.

- [ ] **Step 5: Live smoke-check `game.onegodian.com`**

Verify public responses for:

```text
https://game.onegodian.com/
https://game.onegodian.com/api/health
```

Then verify the public node exposes the updated Play experience. Do not claim live success unless the returned site and health endpoint correspond to the merged runtime release.

- [ ] **Step 6: Update cross-repository status with the live result**

If live verification passes, update `docs/BROWSER_GAME_RUNTIME_STATUS.md` in `onegodian-rise-v1` with the deployment date and merged SHA. If it does not pass, record the blocker without changing the browser runtime's local/branch verification status.
