# Onegodia Public Development Status Policy

**Project:** Onegodia: Rise of the Digital World™  
**Public node:** game.onegodian.com  
**Engineering source of truth:** GitHub  
**Gameplay authority:** Unreal Engine build evidence

## Purpose

The public game node must never imply that an Unreal Engine feature exists merely because it appears in a design document, web prototype, generated code, issue, agent report, screenshot mockup, or roadmap.

## Canonical public statuses

### Planned
The feature has an approved direction, specification, issue, or roadmap entry, but implementation evidence is not sufficient to claim active construction.

### Building
Implementation work is underway. Source files, assets, data preparation, procedural generation, or integration work may exist, but the feature has not yet passed its verification requirements.

### Verified
The implementation has been exercised against documented acceptance criteria and evidence has been recorded. Evidence should identify the build/ref, test performed, result, and relevant repository artifacts.

### Playable
A player can actually exercise the feature in the designated Unreal build. Playable is stronger than Verified and must not be inferred from a web simulation.

## Promotion rules

A status may only move forward when the corresponding evidence exists.

`Planned → Building`
- implementation work has begun;
- the work is linked to a repository issue/specification or committed artifact.

`Building → Verified`
- acceptance criteria are satisfied;
- the relevant Unreal project/build loads successfully;
- required gameplay/system behavior has been tested;
- evidence is recorded and traceable to source control.

`Verified → Playable`
- the feature can be exercised by a player in the designated Unreal build;
- the required interaction is repeatable;
- blocking defects do not invalidate the public claim.

## Evidence hierarchy

Strong evidence includes:
1. reproducible Unreal build/test result;
2. playtest evidence tied to a commit/build identifier;
3. QA record with acceptance criteria;
4. committed implementation and configuration;
5. screenshots/video as supporting evidence only.

The following are not sufficient by themselves:
- web prototype behavior;
- generated code that has not been compiled/tested;
- an AI agent saying a task is complete;
- a GitHub issue marked complete without runtime evidence;
- a design document;
- a marketing page;
- a screenshot without build context.

## Current public pipeline

`Unreal Initialized → Stamford GIS → Stamford Hospital → Player Foundation → Roads/City → Driving → Mission 001 → NPCs → HUD → Vertical Slice → V1`

## V1 definition

V1 is not complete until the first intended experience is specified, implemented, built, playable, tested, documented, and committed.

For the Stamford vertical slice, the acceptance proof should demonstrate a coherent path such as:

`Spawn at Stamford Hospital → player control → traverse the district → reach/enter vehicle → drive through the intended route → reach objective → interact → complete Mission 001 → receive feedback/reward → reset/replay successfully.`

## Web-node rule

`game.onegodian.com` may present simulations, interface prototypes, development documentation, roadmap material, and build evidence, but each must be labeled according to what it actually represents.

When verification is missing or uncertain, use **Planned** or **Building** rather than inferring **Verified** or **Playable**.
