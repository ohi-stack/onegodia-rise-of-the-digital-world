# AI-NPC-Dialogue-Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish the canonical AI-NPC-Dialogue-Agent specification to both Onegodia repositories and expose an evidence-accurate NPC Dialogue studio page on the public web game node.

**Architecture:** The web repository receives the public agent view and navigation wiring while preserving the existing scripted Aria Pulse prototype. Both the web and Unreal repositories receive the same NPC authority, dialogue-state, memory, and Smart NPC roadmap specification so Browser V1 and Unreal V1 share semantics without sharing implementation code.

**Tech Stack:** React 19, TypeScript, Vite, Lucide React, Markdown documentation, Unreal Engine V1 documentation.

**Spec:** `docs/agents/AI_NPC_DIALOGUE_AGENT.md` (web) / `docs/AI_NPC_DIALOGUE_AGENT.md` (Unreal)

## Global Constraints

- Playable first. Expansive later.
- Game state owns truth. NPCs communicate it.
- Existing Aria Pulse browser interaction is labeled Prototype, not autonomous Smart NPC gameplay.
- Mission, Inventory, Reward, and Game Services remain authoritative for their respective state.
- Browser and Unreal share NPC semantics, not implementation code.
- No feature is promoted to Verified / Playable without evidence required by the designated build policy.

## Review Focus

- Existing Mission 001 and Aria Pulse prototype remain intact and are not falsely promoted to Playable.
- Navigation/type/App wiring compiles without breaking existing tabs.
- Public page distinguishes current Prototype evidence from Planned/Roadmap Smart NPC work.
- Generative dialogue cannot be represented as authoritative state mutation.
- Both repositories carry the same NPC-001 and Smart NPC roadmap contract.

## Task 1 — Canonical NPC agent specifications

Create `docs/agents/AI_NPC_DIALOGUE_AGENT.md` in the web repo and mirror it to `docs/AI_NPC_DIALOGUE_AGENT.md` in the Unreal repo. Both documents must contain the governing rule, NPC-001, authority boundaries, QA requirements, and the staged Smart NPC roadmap.

## Task 2 — Public NPC Dialogue studio view

Create `src/views/NPCDialogueAgentView.tsx`; add `npc-dialogue` to `NavigationTab`; add `NPC Dialogue` to the navigation; import/render the view in `App.tsx`. The page must label the existing Aria Pulse browser behavior **Prototype** and keep reusable state-machine work and advanced Smart NPC systems as Planned/Roadmap.

## Task 3 — Repository verification guard

Create `scripts/verify-npc-dialogue-agent.mjs`, add `npm run verify:npc-agent`, and verify the specification/view/navigation/App wiring. Use a red-before-green check for the new feature wiring.

## Task 4 — Track NPC-001 implementation work

Create separate Browser and Unreal GitHub issues for NPC-001. These remain implementation tasks until runtime evidence satisfies the relevant development-status policy.