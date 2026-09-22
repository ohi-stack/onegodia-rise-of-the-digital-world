# Onegodia HUD Visual Standard — Cinematic Stamford V1

**Project:** Onegodia: Rise of the Digital World™  
**Creator / Game Director:** One Gregory Onegodian™  
**Date:** September 22, 2026  
**Status:** Approved visual direction; implementation status remains client-specific.

## Purpose

Translate the approved September 22 game-UI concept into a shared Browser V1 and Unreal V1 interface language without changing authoritative gameplay state.

## Visual language

- Dark cinematic world surface with restrained purple/cyan environmental glow.
- Gold `#d8b35a` / `#f0d98a` HUD borders and priority accents.
- Translucent black HUD panels with strong contrast and readable small text.
- Centered ONEGODIA™ / RISE OF THE DIGITAL WORLD title treatment.
- Tactical route/world content remains visually dominant; HUD frames the world rather than replacing it.

## Canonical HUD zones

1. **Player status — upper left:** player/profile label plus HP/EN presentation. Until combat/energy systems are verified, these values are explicitly prototype presentation only.
2. **Mission panel — left:** `MISSION 001 · REBUILDING SIGNAL` with the currently playable Stamford route leg and objective completion states.
3. **District/minimap — upper right:** Stamford District, route orientation and POI context.
4. **World shortcuts — right:** Businesses, Inventory, Map and Messages. A shortcut may be shown before its underlying system is playable only when clearly treated as interface preview/navigation.
5. **Economy strip — lower left:** Game Credits are ordinary game state. ODC must display as `ODC ROADMAP` / simulated or compliance-locked until separately activated and verified.
6. **Context controls — lower center:** Interact/vehicle, jump, sprint and menu controls; roadmap-only actions must be labeled accordingly.
7. **Quick slots — lower right:** interface preview for scanner/data/aid slots until inventory/equipment behavior is separately verified.

## State authority

Gameplay systems own truth; HUD components only communicate that state. The interface must not independently grant rewards, complete missions, create inventory, unlock vehicles, or represent roadmap systems as live.

## Browser V1

`src/views/PlayView.tsx` implements the visual shell while preserving the existing Stamford Hospital → Vehicle Staging → Washington Boulevard → Stamford Station → Harbor Point route logic.

## Unreal V1

`WBP_HUD` should implement the same information hierarchy through UMG/CommonUI while continuing to consume the documented HUD events (`OnInteractionTargetChanged`, `OnMissionStateChanged`, `OnObjectiveChanged`, `OnFragmentCollected`, `OnVehicleEntered`, `OnVehicleExited`, `OnPlayerReset`). This document is not evidence that the Unreal widget has been created or verified.

## Status rule

Visual presence does not establish gameplay status. Public labels must continue to follow `DEVELOPMENT_STATUS_POLICY.md` and the designated-build verification evidence.
