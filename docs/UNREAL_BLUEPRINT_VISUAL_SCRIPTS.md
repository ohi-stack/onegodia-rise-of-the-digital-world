# Unreal Blueprint Visual Scripts — Stamford V1

**Updated:** September 22, 2026  
**Public node:** game.onegodian.com  
**Unreal source:** `ohi-stack/onegodian-rise-v1`  
**Status:** Planned / implementation specification

The canonical Unreal Blueprint specification is maintained in:

`onegodian-rise-v1/docs/BLUEPRINT_VISUAL_SCRIPTS_STAMFORD_V1.md`

## Planned Blueprint Set

- `BP_GM_StamfordV1`
- `BP_OnegodiaGameInstance`
- `BP_OnegodiaPlayerController`
- `BP_PlayerCharacter`
- `BPI_Interactable`
- `BP_InteractionComponent`
- `BP_SpawnPoint_Hospital`
- `BP_FallResetVolume`
- `BP_AriaPulse`
- `BP_MissionManager`
- `BP_DigitalNode_001`
- `BP_DataFragment_001`
- `BP_CyberCruiser`
- `BP_SaveManager`
- `WBP_HUD`

## Target Flow

`Stamford Hospital → player control → interaction → Aria Pulse → Mission 001 → Digital Node #001 → Data Fragment #001 → completion feedback → checkpoint → vehicle/driving integration`

## Status Rule

This page documents the implementation plan. It does not prove that the Unreal Blueprint assets exist or are playable. Public status follows `docs/DEVELOPMENT_STATUS_POLICY.md`: Planned → Building → Verified → Playable, with Unreal build evidence required for the final two states.

## Architecture Boundary

Game Services own durable player/game state. Browser and Unreal clients consume/update that state through controlled APIs. Client-side Blueprints must not self-award authoritative durable currency, ownership, inventory, or mission completion.
