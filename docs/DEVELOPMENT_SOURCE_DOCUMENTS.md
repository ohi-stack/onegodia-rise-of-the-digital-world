# Onegodia: Rise of the Digital World™ — Development Source Documents

**Project:** Onegodia: Rise of the Digital World™  
**Official game node:** game.onegodian.com  
**Founder / Originator:** One Gregory Onegodian™  
**Development entity:** ONEGODIAN, LLC  
**Prepared:** August 27, 2026  
**Status:** Development handoff and source-document baseline. This document records current direction, source precedence, repository status, development tracks, and community-growth priorities. It does not represent a final game release.

---

## 1. Current Repository Status

The current working repository is:

**ohi-stack/onegodia-rise-of-the-digital-world**

The repository is the current public game-node prototype for **Onegodia: Rise of the Digital World™**. It contains a React + TypeScript + Vite application and is structured as the web/game-control layer for the MVP. The application identifies the project as **“Onegodia: Rise of the Digital World™ — MVP v1.0 / Playable Game V1”**, identifies **game.onegodian.com** as the official game node, and credits the concept to **One Gregory Onegodian™**.

Current app-level modules include:

- Home
- Prototype
- Gameplay Grid
- Tactical HUD
- Missions
- Inventory
- Developers
- Web Doc
- Players
- Compliance

Current source structure includes:

- `src/App.tsx`
- `src/components/`
- `src/data/`
- `src/services/`
- `src/views/`
- `src/types.ts`
- `src/main.tsx`
- `src/index.css`
- root configuration files including `package.json`, `vite.config.ts`, `tsconfig.json`, and `.env.example`

This means the project has crossed from idea-only documentation into a working web MVP prototype. It is not yet the final Unreal Engine playable game. It is the official game-node layer that should connect to the future Game Services/API and Unreal Engine integration layer.

---

## 2. Source Precedence

Use this order when reconciling documents, code, public pages, and Codex tasks:

1. Current explicit instructions from One Gregory Onegodian™.
2. Current repository state in `ohi-stack/onegodia-rise-of-the-digital-world`.
3. `game.onegodian.com` MVP node structure.
4. Current MVP v1.0 production rule: playable-first, scoped, documented, compliance-aware.
5. Historical game outline materials, including the original open-world / digital economy vision.
6. Future feature documents, only after they are translated into concrete tasks, acceptance criteria, and implementation evidence.

Older documents may include broad concepts such as NFTs, ODC, casino features, live marketplaces, multiplayer, full open-world maps, and advanced economies. Those are preserved as long-term vision material, but they are not active MVP features unless separately implemented, tested, legally reviewed where needed, and clearly marked as active.

---

## 3. Current Development Doctrine

**The universe is the destination. The playable loop is the product.**

The current V1 direction is:

**Player → World → Movement → Interaction → Objective → Completion → Repeatable Build**

The practical Definition of Done for V1 is:

A player can launch the build, enter the first playable district, control the character, interact with the environment, complete an objective, reset/replay, and do it consistently from a documented build.

---

## 4. Three-Layer Architecture

The next major repository milestone is to formalize three layers:

### Layer 1 — Web Game Node

Purpose: public and developer-facing interface.

Responsibilities:

- Home page
- MVP v1.0 page
- Gameplay Grid
- Playable Prototype interface
- Tactical HUD
- Missions panel
- Inventory prototype
- Developers page
- Players page
- Web Doc page
- Media page
- Roadmap page
- Compliance page
- Contact / feedback intake
- Community onboarding links

### Layer 2 — Game Services / API

Purpose: bridge between the web node and future game systems.

Responsibilities:

- Player profile state
- Mission state
- Prototype save data
- Build registry
- Release registry
- Feedback intake
- Bug reports
- Developer task index
- Content manifests
- Future telemetry boundaries
- Future account integration
- Future Unreal handoff endpoints

### Layer 3 — Unreal Engine Integration

Purpose: production game layer.

Responsibilities:

- Unreal project setup
- `BP_PlayerCharacter`
- walk / run / jump
- third-person camera
- spawn / reset
- GenesisDistrictOne test level
- interaction framework
- mission/objective framework
- Stamford blockout
- Waterbury expansion planning
- vehicle prototypes
- NPC prototypes
- build packaging
- playable validation

---

## 5. V1 Scope

V1 should focus on proving a playable loop, not building the whole universe at once.

### V1 Must Prioritize

- Player character
- Movement
- Camera
- Spawn point
- Reset/fall recovery
- First test level
- One simple objective
- Mission state
- HUD feedback
- Basic interaction
- Repeatable play session
- Documentation
- Build validation

### V1 Should Not Depend On

- Full multiplayer
- Live blockchain transactions
- Live ODC economy
- Live NFTs
- Live marketplace
- Casino or gambling features
- Full open-world Connecticut map
- Production vehicle physics
- Production flight systems
- Large-scale NPC simulation
- Real-money economy

These features remain long-term roadmap items unless separately scoped.

---

## 6. Game Vision Preserved

The larger Onegodia vision remains intact. The original direction includes:

- Open-world lifestyle simulation
- Real-world and digital-world fusion
- Stamford starting zone
- Waterbury expansion storyline
- City exploration
- Missions
- Vehicles
- Flying systems
- Smart NPCs
- Multiplayer and community systems
- Digital asset economy concepts
- ODC / Layer 2 concepts
- Player-owned properties and businesses
- Marketplace concepts
- Visual immersion
- Player feedback and constant updates

The current production plan converts that vision into staged releases instead of attempting every feature in the first build.

---

## 7. Development Team Structure

Until specific people are verified as actual contributors, the production team should be represented by roles and responsibilities, not fictional names.

### Leadership

- Founder / Game Director — One Gregory Onegodian™
- Technical Director
- AI Project Manager
- Product / Release Lead

### Unreal Production

- Unreal Gameplay Developer
- Blueprint Engineer
- C++ Engineer
- Level / World Designer
- Vehicle Systems Developer
- Mission Designer
- NPC / Dialogue Designer
- UI / HUD Designer
- Build / Release Engineer

### Web Game Node

- Frontend Developer
- React / TypeScript Developer
- UI / UX Designer
- Game Portal Developer
- Content Systems Developer
- QA Tester

### Game Design and Content

- Game Designer
- Narrative / Lore Designer
- Systems Designer
- Player Progression Designer
- Economy Boundary Designer
- Media / Trailer Producer

### Documentation and Operations

- Documentation Agent
- GitHub / Repository Agent
- Codex Task Manager
- QA / Acceptance Agent
- Compliance Agent
- Community Agent

### External Community Contributors

- Game-dev YouTubers
- Unreal Engine educators
- livestream testers
- indie-game reviewers
- Discord moderators
- beta players
- modders and level designers
- 3D artists
- sound designers
- QA volunteers

---

## 8. Developer Involvement Strategy

Developers should be invited into a clear, controlled process.

### Developer Entry Points

- Read the Web Doc
- Review MVP scope
- Review repo setup
- Pick a task from the Codex task list
- Join the developer channel
- Submit an issue or pull request
- Share portfolio or role interest
- Watch or create tutorial content

### Developer Call-to-Action

**Help build Onegodia from prototype to playable world. Start with movement, map, missions, HUD, documentation, and Unreal Engine foundations.**

### Developer Rules

- Do not add live crypto, gambling, marketplace, or monetization features without approval.
- Do not expand V1 beyond the playable loop without review.
- Do not present roadmap features as active.
- Preserve founder/originator attribution.
- Use issues, branches, commits, and acceptance criteria.
- Every feature must have testing evidence or documented validation.

---

## 9. YouTuber and Gamer Community Strategy

The node has launched. The next phase is awareness, developer recruitment, and early player community formation.

### Target Community Sites and Channels

- YouTube gaming and dev channels
- Unreal Engine YouTube creators
- Reddit game-dev communities
- Reddit Unreal Engine communities
- IndieDB
- itch.io devlogs
- Discord gaming communities
- Discord Unreal Engine servers
- X / Twitter game-dev threads
- TikTok short devlog clips
- LinkedIn game-dev and tech posts
- GitHub repository watchers
- Connecticut creator / tech groups

### Outreach Targets

- Unreal Engine tutorial creators
- open-world game developers
- GTA-style prototype creators
- environment artists
- geospatial/world-generation creators
- vehicle-system developers
- indie-game testers
- gaming reaction channels
- Connecticut-based creators
- Stamford / Waterbury local media or creator pages

### Outreach Message Positioning

Use clear, grounded wording:

**Onegodia: Rise of the Digital World™ is a Connecticut-born open-world digital lifestyle simulation game project created by One Gregory Onegodian™ through ONEGODIAN, LLC. The MVP node is live at game.onegodian.com. The project is now moving from concept and interface prototype toward a documented playable V1 built around movement, missions, city exploration, and Unreal Engine production. Developers, gamers, YouTubers, testers, artists, and community builders are invited to follow the build, review the roadmap, and help shape the first playable version.**

---

## 10. Immediate Marketing and Community Actions

### Day 1–3

- Publish launch post for game.onegodian.com.
- Post short video walkthrough of the node.
- Pin the current MVP status: interface prototype, not final game.
- Invite developers to review the repo and Codex tasks.
- Invite gamers to join the early feedback list.
- Create Discord structure or update existing Discord.
- Create a bug/feedback form.

### Week 1

- Publish first devlog: “The Onegodia Game Node Is Live.”
- Publish second devlog: “How V1 Will Become Playable.”
- Record a 60–90 second gameplay-node walkthrough.
- Post screenshots of Home, Gameplay Grid, Tactical HUD, Missions, Developers, Players, and Compliance.
- Contact 20 Unreal Engine / indie-game YouTubers.
- Contact 20 gamers/testers/community creators.
- Create GitHub issues for V1 movement, map, mission, and Unreal setup.

### Week 2

- Launch first community vote: Stamford route, Waterbury storyline, first mission type, or first vehicle.
- Host a livestream review of the MVP node.
- Create “Wanted Roles” post for developers and creators.
- Publish a public roadmap image.
- Publish the first official community update.

---

## 11. Community Channels to Set Up

### Discord Channels

- `#start-here`
- `#announcements`
- `#mvp-updates`
- `#gameplay-feedback`
- `#bug-reports`
- `#unreal-development`
- `#web-node-development`
- `#mission-ideas`
- `#map-stamford`
- `#map-waterbury`
- `#vehicles-and-mobility`
- `#npc-and-story`
- `#media-and-youtube`
- `#compliance-notices`
- `#contributors`

### GitHub Labels

- `v1-scope`
- `web-node`
- `unreal`
- `gameplay`
- `mission`
- `hud`
- `map`
- `stamford`
- `waterbury`
- `documentation`
- `community`
- `marketing`
- `compliance-locked`
- `needs-review`
- `codex-task`

---

## 12. Immediate Codex Task Backlog

### OG-001 — Verify Repo and Build

Inspect the repository, install dependencies, run available checks, and document the current build status.

Acceptance evidence:

- install command used
- build command used
- test/lint result
- screenshots or notes if build fails
- updated `docs/BUILD_STATUS.md`

### OG-002 — Create Development Source Index

Create a clear source-document index that links to game design, technical architecture, MVP scope, community plan, compliance, and Codex task files.

Acceptance evidence:

- `docs/00-START-HERE.md`
- `docs/DEVELOPMENT_SOURCE_DOCUMENTS.md`
- README link update

### OG-003 — Formalize Three-Layer Architecture

Create architecture documentation for Web Game Node → Game Services/API → Unreal Engine Integration.

Acceptance evidence:

- `docs/ARCHITECTURE_THREE_LAYERS.md`
- data-flow diagram or text diagram
- proposed API contract names

### OG-004 — Add Community and Marketing Plan

Add developer, YouTuber, gamer, Discord, and community-development plan.

Acceptance evidence:

- `docs/COMMUNITY_AND_MARKETING_PLAN.md`
- launch message templates
- outreach target categories

### OG-005 — Add V1 Scope Guardrails

Separate playable V1 scope from the long-term universe.

Acceptance evidence:

- `docs/V1_SCOPE_GUARDRAILS.md`
- compliance-locked feature list
- README link update

### OG-006 — Add Unreal MCP Readiness Checklist

Document safe Unreal MCP readiness steps and a reversible test connection.

Acceptance evidence:

- `docs/UNREAL_MCP_READINESS.md`
- no destructive engine automation
- test checklist

### OG-007 — Add Stamford World Brief

Create the first focused map brief for Stamford.

Acceptance evidence:

- `docs/STAMFORD_WORLD_BRIEF.md`
- player spawn proposal
- district zones
- first mission zones
- expansion directions

### OG-008 — Create First Community Issue Pack

Create GitHub issues for web node, Unreal setup, mission prototype, community launch, and compliance.

Acceptance evidence:

- issue titles
- labels
- acceptance criteria
- milestone assignment if available

---

## 13. Public Launch Copy

### Short Launch Post

**The Onegodia game node is live.**  
**Onegodia: Rise of the Digital World™** now has its official MVP node at **game.onegodian.com**. The project is moving from concept into a documented playable-production path: web prototype, Gameplay Grid, Tactical HUD, missions, developer documentation, compliance boundaries, and the next step toward Unreal Engine V1.

Developers, YouTubers, gamers, testers, artists, and community builders are invited to follow the build and help shape the first playable version.

**Created by One Gregory Onegodian™ through ONEGODIAN, LLC.**

### Developer Post

Developers: the Onegodia MVP node is live. We are organizing the project around three layers: Web Game Node, Game Services/API, and Unreal Engine integration. Immediate priorities are movement, HUD, missions, Stamford map planning, documentation, QA, and community onboarding. If you build in Unreal, React, TypeScript, game systems, NPCs, vehicles, world design, or QA, this is the time to connect.

### Gamer Post

Gamers: Onegodia is opening its early community phase. The current MVP node shows the concept, Gameplay Grid, tactical HUD, mission structure, and roadmap. This is not the final game yet. It is the beginning of the playable path. Follow the build, give feedback, vote on features, and help shape the world before V1 locks in.

### YouTuber Post

Game-dev YouTubers and creators: Onegodia: Rise of the Digital World™ is now building publicly from its MVP node toward a playable Unreal Engine V1. The project is Connecticut-born, city-based, open-world inspired, and designed for staged development. We are looking for creators who want to document, review, test, critique, and help shape the build from the beginning.

---

## 14. Compliance Language for Public Materials

Use this language when discussing roadmap economy features:

**MVP v1.0 is a gameplay, interface, and documentation prototype. Digital assets, NFT-style items, ODC, marketplace systems, casino concepts, blockchain integrations, and tokenized features are conceptual or roadmap-only unless separately activated through legal, technical, security, and compliance review.**

Do not use:

- guaranteed earnings language
- “everyone wins” gambling language
- investment-return promises
- claims that NFTs, ODC, casino, or marketplace features are active if they are not
- claims that a complete Unreal game exists before playable validation exists

---

## 15. Next Production Decision

The next production decision is whether the repository should prioritize:

1. Web node polish and community launch,
2. Game Services/API architecture,
3. Unreal Engine project initialization,
4. Stamford map and world-generation pipeline,
5. Codex issue creation and task assignment.

Recommended order:

1. Verify build and deployment.
2. Publish documentation/source index.
3. Create issues and labels.
4. Open community channels.
5. Start Unreal V1 foundation.
6. Begin Stamford map blockout.

---

## Rights Notice

© ONEGODIAN, LLC. All rights reserved. Concept, universe, naming, systems, source direction, and original framework by **One Gregory Onegodian™**. No license, assignment, commercial right, derivative right, or redistribution right is granted unless expressly provided in writing.
