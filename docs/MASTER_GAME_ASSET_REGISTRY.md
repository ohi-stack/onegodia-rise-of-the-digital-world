# Onegodia: Rise of the Digital World™ — Master Game Asset Registry

**Canonical date:** September 22, 2026  
**Official node:** game.onegodian.com  
**Originator:** One Gregory Onegodian™  
**Commercial developer:** ONEGODIAN, LLC

## Purpose

This registry defines the documented asset families available to the Onegodia game design. It is a design and implementation registry, not a claim that every listed asset is obtainable in the current playable build.

## Master asset families

1. Real Estate & Land — homes, apartments, residential lots, commercial buildings, stores, offices, workshops, warehouses, industrial property, development parcels, entertainment venues, creator spaces.
2. Buildings & Improvements — renovations, property improvements, building upgrades, green infrastructure and smart-city upgrades.
3. Businesses — retail, vehicle, creative, restaurant, entertainment, construction, technology, transportation and property-development businesses.
4. Vehicles — cars, SUVs, trucks, vans, EVs, motorcycles, commercial/work vehicles, racing vehicles and Onegodia-branded vehicles.
5. Vehicle Parts & Upgrades — performance packages, components, accessories, custom paint and rare components.
6. Aircraft & Aerial Mobility — aircraft, future aerial vehicles, flying mounts and flight equipment.
7. Watercraft — boats, sailing vessels and future water transportation.
8. Fashion & Character Assets — clothing, footwear, jewelry, outfits, skins, accessories, hairstyles, cosmetics and visual effects.
9. Tools & Equipment — mission, construction, development, business and specialized gameplay equipment.
10. Construction & Development Assets — materials, plans, components, development resources and infrastructure.
11. Interior & World Assets — furniture, furnishings, artwork, decorative objects, environmental objects and world-building items.
12. Technology & Smart Devices — smart devices, technology equipment and commercial/digital-world technology.
13. Landmarks & POIs — landmarks, important buildings, mission POIs, world structures and special locations.
14. Mission & Reward Assets — data fragments, mission rewards, quest items, progression unlocks and access items.
15. Collectibles — achievement items, event rewards, limited editions and historical memorabilia.
16. Onegodia Artifacts & Relics — Nexus artifacts, historical objects, world fragments, mission relics and hidden digital creations.
17. Business Assets, Licenses & Rights — licenses, commercial equipment, furnishings, operational upgrades and authorized business items.
18. Membership & Access Assets — membership items, passes, player unlocks and zone access.
19. Creator Assets — approved 3D models, buildings, environmental assets, artwork, fashion, furniture, vehicle designs, experiences and business concepts.
20. Community Development Assets — redevelopment parcels, parks, housing projects, business zones, cultural centers, technology hubs, green-energy hubs and neighborhood improvements.
21. Player-Transferable Assets — future eligible property, vehicles, collectibles, creator assets and business assets.
22. Blockchain-Verified Eligible Assets — separately approved provenance/ownership records and eligible transfer history.

## Property system

**Classes:** Residential; Commercial; Retail; Industrial; Creator Space; Entertainment; Development Property.

**Loop:** Discover → Acquire → Improve → Develop → Operate → Customize → Lease / Transfer → Redevelop.

## Business system

**Classes:** Retail Store; Creative Studio; Vehicle Business; Restaurant; Technology Company; Construction Company; Entertainment Venue; Transportation Business; Property Development Business.

**Loop:** Property → Business → Products / Services → Customers → Game Revenue → Upgrades → Expansion.

## Technical classification

Every concrete asset record should be classified independently as one of:

- Standard Game Asset
- Rare / Limited Game Asset
- Player-Transferable Asset
- Blockchain-Verified Asset

Blockchain is not required for ordinary gameplay assets.

## Status policy

Asset-family presence in this registry does not establish Playable Now status. Development status must follow docs/DEVELOPMENT_STATUS_POLICY.md. Mission & Reward Assets are currently classified as **Prototype** pending qualifying Unreal-build evidence. Vehicles are **Prototype**. Player-transferable systems remain **Roadmap**. Blockchain-verified assets remain **Compliance Locked**.

ODC, NFT-style ownership, tokenized property, real-money asset exchange, casino/gambling systems and blockchain marketplace functionality remain inactive or compliance-locked unless separately reviewed and activated.

## Canonical future asset record

Each implemented asset should ultimately carry at minimum:

`assetId`, `name`, `family`, `subtype`, `status`, `ownershipDomain`, `ownerId`, `worldLocation`, `rarity`, `acquisitionMethod`, `gameValue`, `transferability`, `mediaAsset`, `runtimeReference`, `evidenceReference`.

This record is intended to become the shared source for Inventory, Garage, Properties, Businesses, World Map and any future approved marketplace interface.
