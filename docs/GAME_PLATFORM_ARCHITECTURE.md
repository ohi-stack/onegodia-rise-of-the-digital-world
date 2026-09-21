# Onegodia Game Platform Architecture

**Status:** Active architecture directive  
**Effective:** September 21, 2026  
**Public node:** game.onegodian.com

## Product model

Onegodia is a platform game with multiple clients.

1. **Onegodia Web Game V1** — the playable browser client delivered through `game.onegodian.com/play`.
2. **Onegodia Unreal V1** — the high-fidelity Stamford 3D production client developed in `ohi-stack/onegodian-rise-v1`.
3. **Onegodia Game Services** — the shared service layer for identity, sessions, missions, inventory, progression, achievements, zone state, build manifests, and cross-client persistence.

## Authority boundary

Game Services own durable player and game state. Browser and Unreal clients consume and update that state through controlled APIs. Authoritative real-time simulation belongs to the applicable game server/runtime; clients must not be trusted to self-award durable rewards, currency, inventory, or mission completion.

## V1 vertical slice

The canonical Browser V1 loop is:

`Enter /play → spawn at Stamford Hospital → move through the Stamford runtime → interact with NPC/POI → accept/advance Mission 001 → obtain the mission item → return/complete → receive simulated game reward → persist progress → reload and continue.`

Stamford Hospital is the canonical Browser V1 spawn. The first world scope remains deliberately bounded. Verified GIS/OSM world data should replace schematic geography incrementally; the browser map must not be represented as surveyed GIS until that verification is complete.

## Runtime architecture

```text
game.onegodian.com
        |
  Web Game Client
        |
 Onegodia Game Services
        |
 +------+---------+----------+-----------+
 |                |          |           |
Identity       Missions   Inventory   Progression
 |                |          |           |
 +----------------+----------+-----------+
                  |
           Persistent Store
                  |
        +---------+---------+
        |                   |
   Browser Client      Unreal Client
```

## Implementation sequence

1. Make `/play` the primary real-time browser runtime.
2. Preserve Stamford Hospital as the canonical safe spawn.
3. Replace schematic Stamford data with verified GIS/OSM-derived world data in bounded slices.
4. Integrate Mission 001, Aria Pulse/NPC interaction, POIs, inventory, and progression into the runtime.
5. Add authenticated player sessions.
6. Introduce Game Services API contracts and server-side validation.
7. Move durable state from browser-only localStorage to persistent account-backed storage while retaining safe migration/fallback behavior during development.
8. Add vehicle/driving systems after the mission/POI/persistence loop is repeatable.
9. Define a versioned cross-client state contract for Unreal.
10. Validate builds, evidence, telemetry, and recovery behavior before changing status labels.

## V1 completion rule

Browser V1 is operational only when a player can repeatedly enter the game, spawn, move, interact, complete the vertical-slice objective, receive the permitted in-game result, persist it, reload it, and reset/replay without manual developer intervention.

## Compliance boundary

Digital assets, ODC, NFT-style assets, marketplaces, casino/gambling concepts, tokenized systems, and real-money economic features remain conceptual, inactive, roadmap-only, or compliance-locked unless separately reviewed and explicitly activated. Browser V1 rewards are game-state values and do not represent equity, securities, ownership in ONEGODIAN, LLC, or promises of financial return.
