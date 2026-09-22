# AI Economy Compliance Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the AI-Economy-Compliance-Agent into both Onegodia repositories and the public web node while preserving game-first economy boundaries and development-status accuracy.

**Architecture:** Reuse the existing agent-doc, Compliance view, Digital Asset Economy view and asset registry. Do not add a new primary route. Public communication remains in the web node; Unreal-side documentation receives the same operating rules; future ODC/NFT/marketplace/cash-out systems remain compliance locked.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, TailwindCSS utility classes, Lucide React, GitHub repositories.

**Spec:** `docs/superpowers/specs/2026-09-22-economy-compliance-agent-design.md`

## Global Constraints

- `Playable` requires designated Unreal build evidence under `docs/DEVELOPMENT_STATUS_POLICY.md`.
- Game Credits remain gameplay-only unless a separately approved specification changes that rule.
- ODC, blockchain, NFT-style assets, wagering, real-money marketplace and cash-out remain roadmap/compliance-locked by default.
- Preserve existing primary navigation and existing `/compliance` and `/digital-asset-economy` surfaces.
- Public legal/compliance language must describe operational guardrails and must not imply government or counsel-issued legal clearance.

## Review Focus

- A web-only mission prototype must not be labeled Playable under the Unreal evidence policy.
- Compliance-page copy must not imply ODC/NFT/cash-out functionality is live.
- Premium digital products must remain game entitlements, not investment or ownership claims.
- The public compliance experience must not depend on a binary media asset being present.
- TypeScript/build verification must remain green after the view update.

---

### Task 1: Add canonical agent specifications to both repositories

**Files:**
- Create: `docs/agents/AI_ECONOMY_COMPLIANCE_AGENT.md`
- Create in Unreal repo: `docs/AI_ECONOMY_COMPLIANCE_AGENT.md`

**Interfaces:**
- Consumes: current game-first economy and status policies.
- Produces: canonical operating rules referenced by developers, QA and future economy implementations.

- [x] **Step 1:** Create the web-repo agent specification containing mission, five-layer economy model, currency/asset classifications, ODC/NFT/casino/cash-out gates, pricing/change-control rules, server-authority guidance and ECON-001 definition of done.
- [x] **Step 2:** Mirror the same operating specification into `ohi-stack/onegodian-rise-v1/docs/AI_ECONOMY_COMPLIANCE_AGENT.md`, with Unreal V1 called out as a consumer of the same policy.
- [x] **Step 3:** Verify both files can be fetched from their feature branches and contain `GAME ECONOMY FIRST` plus `COMPLIANCE LOCKED` controls.

### Task 2: Add a regression check for public status accuracy

**Files:**
- Create: `scripts/verify-economy-compliance.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `src/data/gameAssetRegistry.ts`, `src/views/ComplianceView.tsx`.
- Produces: `npm run verify:economy-compliance` static policy verification.

- [x] **Step 1:** Add a failing verification script that rejects `id:'MIS'` when its status is `Playable Now`, requires `V1 Compliance Guardrails Active`, requires `Ordinary Gameplay Economy`, requires `Compliance Locked`, and requires `AI-ECONOMY-COMPLIANCE-AGENT` on the public Compliance page.
- [x] **Step 2:** Verify the initial script failed against the prior registry because the mission asset class was still publicly represented as `Playable Now` at that point in execution.
- [x] **Step 3:** Add `"verify:economy-compliance": "node scripts/verify-economy-compliance.mjs"` to `package.json`.

### Task 3: Upgrade the public Compliance page and preserve latest asset-registry work

**Files:**
- Use current: `src/data/gameAssetRegistry.ts`
- Modify: `src/views/ComplianceView.tsx`

**Interfaces:**
- Consumes: the five-layer model from the spec and the newest master-asset registry from `main`.
- Produces: accurate public status + visible policy framework.

- [x] **Step 1:** Reconcile with the concurrent master-asset update on `main`; preserve its expanded registry and its `MIS` status of `Prototype` instead of overwriting it with the older registry snapshot.
- [x] **Step 2:** Replace `V1 Legal Clearance Active` with `V1 Compliance Guardrails Active`.
- [x] **Step 3:** Replace `MANDATORY STATUTORY & REGULATORY STATEMENT` with `OFFICIAL DEVELOPMENT COMPLIANCE STATEMENT`.
- [x] **Step 4:** Add five public economy-layer cards: Ordinary Gameplay Economy (Active V1), Premium Digital Game Products (When Verified), Player Marketplace (Roadmap), ODC/Blockchain/NFT-Style Systems (Compliance Locked), Cash-Out/Redeemable Economy (Compliance Locked).
- [x] **Step 5:** Add agent-role copy explaining that the agent validates classifications, pricing integrity, monetization boundaries and activation gates but does not itself create legal authorization.
- [x] **Step 6:** Keep the previously generated poster as a separate media asset rather than making this code change depend on a binary upload through the text-oriented GitHub connector.
- [ ] **Step 7:** Run `npm run verify:economy-compliance`; expected: PASS.

### Task 4: Verify the web application and repository integration

**Files:**
- Create: `.github/workflows/verify-economy-compliance.yml`

**Interfaces:**
- Consumes: all Task 1-3 changes.
- Produces: verified branch ready for PR/merge.

- [x] **Step 1:** Add a GitHub Actions verification job that installs dependencies and runs policy verification, TypeScript checking and the production build.
- [ ] **Step 2:** Open the web PR so the workflow executes against the reconciled branch.
- [ ] **Step 3:** Confirm `npm run verify:economy-compliance`, `npm run lint` and `npm run build` all pass in CI.
- [ ] **Step 4:** Compare the feature branch to current `main` and verify only scoped docs, compliance view, package/script and CI changes remain after reconciliation.
- [ ] **Step 5:** Open/merge the Unreal documentation PR and the verified web PR, then check whether `game.onegodian.com` reflects the merged web repo through its existing deployment path. If no automatic deployment evidence is available, report that the canonical production source is updated but publishing could not be directly controlled through Hostinger AI Builder.
