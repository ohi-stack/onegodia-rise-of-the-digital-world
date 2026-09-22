# AI Economy Compliance Agent Integration Design

**Date:** 2026-09-22  
**Project:** Onegodia: Rise of the Digital World™  
**Creator / Game Director:** One Gregory Onegodian™  
**Development Entity:** ONEGODIAN, LLC

## Purpose

Integrate the AI-Economy-Compliance-Agent into the existing Onegodia development architecture without creating a competing economy subsystem or implying that roadmap financial systems are live.

## Design Decision

Use the existing public and engineering surfaces rather than add a new primary route.

- `docs/agents/AI_ECONOMY_COMPLIANCE_AGENT.md` becomes the canonical web-repo agent specification.
- `onegodian-rise-v1/docs/AI_ECONOMY_COMPLIANCE_AGENT.md` mirrors the Unreal-side operating specification.
- `src/views/ComplianceView.tsx` becomes the primary public policy surface for the agent's five-layer economy model and restrictions.
- `src/views/DigitalAssetEconomyView.tsx` remains the public roadmap/economy explanation and continues to distinguish ordinary game assets from future marketplace/blockchain systems.
- `src/data/gameAssetRegistry.ts` must follow `docs/DEVELOPMENT_STATUS_POLICY.md`; web simulation evidence cannot justify `Playable Now` where Unreal build evidence is required.
- The previously generated AI-Economy-Compliance-Agent poster remains a separate media asset. Binary inclusion is not required for this code change because the connected GitHub write path is text-oriented; the public compliance experience must remain complete without depending on that image.

## Economy Layers

1. **Ordinary Gameplay Economy — Active / V1**  
   Mission rewards, Game Credits, ordinary assets, shops, upgrades and simulated ownership.

2. **Premium Digital Game Products — When Verified**  
   Conventional paid game entitlements such as cosmetics, access passes and expansion content, with explicit fulfillment and no implied investment rights.

3. **Player Marketplace — Roadmap / Separate Review**  
   Future player-to-player and creator trading, subject to fraud, security, consumer, tax/reporting, moderation and dispute controls.

4. **ODC / Blockchain / NFT-Style Systems — Compliance Locked**  
   Tokens, wallets, minting, blockchain ownership, staking and external transfers require separate legal, technical, security and economic approval.

5. **Cash-Out / Redeemable Economy — Compliance Locked**  
   Any conversion from gameplay or marketplace value into USD or other real-world consideration requires a separately approved payout architecture.

## Public Communication Rules

- Ordinary Game Credits are gameplay-only and must not be presented as ODC or cash-equivalent.
- Historical ODC/NFT concepts remain historical or roadmap material unless independently activated and verified.
- Virtual property must not be represented as real-world legal title.
- Casino/wagering concepts remain compliance locked unless separately reviewed and activated.
- Avoid investment, guaranteed appreciation, guaranteed resale, passive-income or guaranteed-return language for game assets.
- Replace any legal-status claim that overstates review, such as `V1 Legal Clearance Active`, with operationally accurate language such as `V1 Compliance Guardrails Active`.

## Status Correction

The stable rule is that the mission/reward asset class (`id: 'MIS'`) must not be `Playable Now` unless designated Unreal build evidence is linked. During implementation, a concurrent master-asset update on `main` had already renamed the class to `Mission & Reward Assets` and set it to `Prototype`; that newer registry is preserved.

## Success Criteria

- Both repositories contain the canonical AI-Economy-Compliance-Agent specification.
- The public Compliance page visibly explains the five-layer economy model and the agent's gatekeeping role.
- ODC, NFT, blockchain, wagering, marketplace cash-out and redeemable systems remain visibly locked or roadmap-only.
- The `MIS` asset class does not claim `Playable Now` without Unreal evidence.
- The web application passes the policy regression check, TypeScript check and production build verification.
