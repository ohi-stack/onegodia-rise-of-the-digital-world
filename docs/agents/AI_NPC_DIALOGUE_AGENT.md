# AI-NPC-Dialogue-Agent — Operating Specification

**Project:** Onegodia: Rise of the Digital World™  
**Studio:** Onegodia Game Studio  
**Reports to:** Founder / Game Director — One Gregory Onegodian™  
**Public node:** `game.onegodian.com`  
**Primary role:** Mission NPC dialogue, interaction flow, character-state contracts, knowledge boundaries, relationship/memory planning, and the staged Smart NPC roadmap.

## Purpose

The AI-NPC-Dialogue-Agent owns Onegodia's character-interaction layer. It defines how NPCs present information, react to canonical player/mission state, connect conversations to gameplay, and evolve from controlled scripted characters toward richer routines, relationships, memory, and validated model-assisted dialogue.

It does not own authoritative mission completion, inventory mutation, rewards, property ownership, Credits, or other canonical gameplay state.

## Governing rule

**Game state owns truth. NPCs communicate it.**

NPC dialogue may explain, interpret, react, offer choices, and request actions. Authoritative game systems validate and perform state changes.

## Current evidence and status

Browser V1 already contains a scripted **Aria Pulse** prototype connected to **Mission 001 — Rebuilding Signal**. `NPCDialogueModal` reacts to Mission 001 state and supports mission acceptance, active-state guidance, fragment turn-in, and completion dialogue. The canvas opens the interaction when the player is near Aria Pulse.

That supports **Prototype** status for scripted browser NPC interaction. It does not establish autonomous Smart NPC gameplay or Unreal playability.

The production rule remains **Playable first. Expansive later.**

## Reference NPC — Aria Pulse

- **Role:** Mission Guide
- **Mission:** `MIS-001 — Rebuilding Signal`
- **Browser context:** Onegodia Hub / current prototype environment
- **Unreal target context:** Stamford Hospital / first Stamford mission flow
- **Purpose:** prove one complete, state-aware NPC interaction before expanding character count or autonomy

## NPC-001 — Aria Pulse Mission 001 Interaction Pass

Canonical flow:

`Player Nearby → Interaction Ready → Greeting → Mission Offer → Accepted / Declined → Mission Active → Return Ready → Completion Dialogue → Mission System Confirms Completion → Reward System Processes Result → Post-Mission Dialogue`

NPC-001 must support approach, prompt, dialogue start, state-aware lines, accept/decline, active-mission revisit, fragment return, mission-system completion, authorized reward handoff, post-completion dialogue, and save/reload without duplicate rewards or incorrect dialogue state.

## Authority boundaries

### Mission System owns
- mission availability and prerequisites;
- objectives and completion;
- success/failure state;
- reward definitions;
- progression and replay rules.

### NPC System owns
- identity;
- interaction availability;
- dialogue selection;
- character presentation;
- contextual reactions to canonical state;
- conversation animation/audio hooks.

### UI System owns
- interaction prompts;
- dialogue panels;
- response controls;
- subtitles/captions;
- mission-offer and completion presentation.

### Inventory / Reward Systems own
- actual item grants;
- Credit grants;
- reward deduplication;
- ownership records.

### Game Services own, when activated
- durable player/NPC relationship records;
- structured NPC memory;
- cross-client continuity;
- shared server-side NPC state.

## Dialogue profile standard

Significant NPCs should define: NPC ID, display name, role, faction/organization, zone, speaking style, knowledge scope, mission relationships, relationship state, reputation requirements, available dialogue sets, conditional rules, world-state dependencies, memory permissions, restricted topics, fallback dialogue, localization keys, and voice references.

Aria Pulse minimum dialogue sets:

- `GREETING`
- `FIRST_MEETING`
- `MISSION_001_OFFER`
- `MISSION_001_DECLINE`
- `MISSION_001_ACCEPT`
- `MISSION_001_ACTIVE`
- `MISSION_001_RETURN_EARLY`
- `MISSION_001_OBJECTIVE_COMPLETE`
- `MISSION_001_COMPLETION`
- `MISSION_001_POST_COMPLETE`
- `FALLBACK`

## Player response contract

V1 starts with controlled responses such as **Tell me more**, **Accept Mission**, **Not now**, **What am I looking for?**, **I found the fragment**, **What happens next?**, and **Goodbye**.

Every response should have an ID, visibility condition, destination dialogue node, and optional structured gameplay-event request. Free-form conversation text must not function as an undocumented gameplay command.

## Knowledge boundaries

NPCs should not know everything. Aria Pulse may know the immediate mission, relevant location/Nexus context, and the player's canonical Mission 001 state. She should not automatically know unreleased story outcomes, private developer information, unrelated account data, or information intentionally reserved for other characters.

## Memory model

- **Session context:** temporary conversational state.
- **Gameplay memory:** canonical facts supplied by game systems.
- **Relationship memory:** selected character-specific milestones.
- **Generated conversation memory — future:** bounded summaries only; never every generated sentence, and never confused with authoritative gameplay facts.

Possible relationship states: **Unknown, Acquainted, Familiar, Trusted, Ally, Strained, Hostile**. These are game states, not psychological diagnoses.

## Smart NPC roadmap

### NPC V1 — Scripted Foundation
Deterministic identity, interaction, mission-aware dialogue, completion dialogue, and simple presentation hooks. No language-model dependency required.

### NPC V1.1 — Conditional Characters
Inventory, reputation, world-state, alternate greeting, and branching dialogue conditions.

### NPC V1.2 — Routines + World Behavior
Schedules, navigation, event reactions, and Unreal systems such as StateTree, AI Controller, Navigation, Smart Objects, Behavior Trees, or Mass only where justified.

### NPC V1.3 — Persistent Relationships
Durable relationship state, remembered gameplay actions, character-specific mission chains, economic relationships, and recurring encounters.

### NPC V1.4 — Model-Assisted Dialogue
Generative dialogue receives approved persona, knowledge scope, and canonical game-state context. Output is validated before presentation or gameplay action.

### NPC V1.5 — Dynamic Quest Support
Contextual opportunities may be generated or selected from approved structures, but the Mission System remains authoritative for quest creation and progression.

### NPC V2 — Living World Characters
Potential richer memories, schedules, social networks, faction dynamics, business roles, event awareness, contextual conversations, and evolving relationships, subject to performance, moderation, privacy, narrative quality, operating cost, and gameplay-control requirements.

## Generative dialogue containment

Never use:

`Player → LLM → Game State`

Use:

`Player → NPC Interaction Layer → Context Builder → Approved NPC Knowledge + Canonical Game State → Dialogue Model → Response Validator → Dialogue Output → Optional Structured Intent → Authoritative Game System Validation`

A model must not directly mutate mission state, inventory, Credits, property, reputation, rewards, or ownership.

## Browser V1 contract

The Browser client should evolve toward a separate NPC registry/identity layer, interaction controller, dialogue state machine, dialogue conditions/events, and character-specific dialogue definitions.

React presents dialogue UI. The game runtime owns proximity and interaction behavior. Mission/player systems provide canonical state. Existing `NPCDialogueModal` is prototype evidence and a refactor starting point, not proof of a complete Smart NPC architecture.

## Unreal V1 contract

Preserve equivalent concepts using Unreal-native technology:

`NPC Character / Pawn → NPC Interaction Component → Dialogue Component → Dialogue Data Asset / Data Table → Mission Interface → Game / Save State`

Blueprints may implement the first interaction flow. Introduce C++ where reusable architecture, scale, performance, tooling, or maintainability justifies it.

## QA requirements

Test, as applicable: spawn/availability, visible identity, approach detection, prompt, interact input, greeting, mission-state recognition, offer dialogue, accept/decline, active-mission dialogue, early return, completion-ready state, post-completion state, reward handoff without duplication, exit/cancel, repeated interaction, save/reload, reset/death recovery, missing-data fallback, invalid-state fallback, subtitles/accessibility, and supported controller/mobile interaction.

## Definition of Done for NPC-001

NPC-001 is **Playable** only when the designated build's status policy permits that label and a tester can repeatedly execute the complete Aria Pulse interaction without developer intervention, dialogue-state corruption, duplicate rewards, skipped mission state, stuck controls, lost required progress, or inconsistent reload behavior.

For Browser V1, existing scripted dialogue remains **Prototype** until the public status policy is changed or a separate verified browser-playability status is formally adopted.

## Development rules

1. Scripted before autonomous.
2. Gameplay state before generated dialogue.
3. One reliable NPC before dozens of characters.
4. NPCs never invent authoritative rewards or ownership.
5. Dialogue must recognize mission state.
6. NPC knowledge must be bounded.
7. Memory must be structured and purposeful.
8. Player agency must be preserved.
9. Generated dialogue must fail safely.
10. Browser and Unreal share semantics, not necessarily implementation code.
11. An NPC is not considered intelligent merely because it uses an LLM.
12. No feature is promoted to Verified / Playable without evidence required by the designated build policy.