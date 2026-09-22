# Onegodia Marketplace Economy v1.0

**Project:** Onegodia: Rise of the Digital World™  
**Owner:** ONEGODIAN, LLC  
**Status:** Economic design specification — cash redemption is compliance-locked until separately implemented and approved.

## Core loop
PLAY → EARN → BUY → BUILD → OPERATE → CREATE VALUE → SELL → REINVEST OR REDEEM ELIGIBLE PROCEEDS

## Currency ledger classes
1. **Game Credits (₡)** — normal gameplay currency from missions, jobs, achievements, exploration and promotions. Non-redeemable.
2. **Marketplace Credits (₡M)** — pending proceeds from qualifying player-to-player commerce.
3. **Redeemable Credits (₡R)** — cleared qualifying marketplace proceeds that may be eligible for USD payout where permitted and after settlement, identity, fraud, tax, payments and jurisdiction checks.

## Proposed reference rate
For economic modeling only: **100 Credits = $1.00 USD reference value**. This is not a promise that all Credits can be redeemed for USD.

## Proposed marketplace fee
For v1.0 modeling: **10% transaction fee / 90% seller proceeds**.

Example: an eligible asset sells for ₡50,000. Seller receives ₡45,000 and the marketplace fee is ₡5,000.

## Economic asset classes
- Real estate: land, homes, apartments, commercial property, development sites and improvements.
- Vehicles: cars, trucks, motorcycles, commercial vehicles, aircraft, watercraft and specialty transport.
- Businesses: retail, dealerships, auto service, restaurants, creative studios, transportation, construction, technology, hotels, entertainment and property development.
- Creator goods: approved clothing, artwork, furniture, liveries, designs, media and other virtual goods.
- Services/jobs: approved player economic activities and services.
- Equipment, construction assets and collectibles.

## Transferability
- **Class A — Non-transferable:** mission rewards, promotional balances, progression items and designated assets.
- **Class B — Transferable:** eligible virtual assets that can be listed and transferred for game currency.
- **Class C — Redeemable-market eligible:** specifically approved transactions whose seller proceeds may enter the redemption pipeline.

Every asset must record a transferability class and redemption eligibility.

## Real estate lifecycle
Acquire → Improve → Develop → Operate → Customize → Lease/Transfer → Redevelop.

## Vehicle lifecycle
Purchase → Drive → Customize → Upgrade → Maintain → Build History → Resell.

## Player business loop
Acquire/lease location → obtain required game permissions → obtain inventory/equipment → operate → serve players/NPCs → generate revenue → reinvest → expand or sell.

## Settlement and redemption
Target flow:
Sale → Marketplace Credits → settlement hold → eligibility checks → Redeemable Credits → payout request → USD.

Proposed pilot parameters:
- Minimum redemption: $25
- Settlement hold: 7 days
- Identity verification before first USD payout
- Fraud/chargeback controls
- Permanent transaction ledger
- Payout fees disclosed before confirmation

These parameters remain proposals until the payout system and applicable legal/compliance controls are operational.

## Platform revenue
ONEGODIAN may monetize primary virtual-goods sales, marketplace transaction fees, customization, premium services, creator commissions, business services, sponsorship/advertising, optional subscriptions and disclosed payment-processing services.

## Economic integrity rules
- Game Credits cannot be converted directly into cash.
- Game-generated rewards cannot create unlimited redeemable balances.
- No guaranteed asset appreciation, profit, return or resale price.
- Marketplace value comes from gameplay utility and voluntary player transactions.
- Wealth, progression and player skill remain distinct.
- Credit sinks may include maintenance, repairs, energy, licenses, construction, utilities, NPC operating costs, transportation, customization, advertising and listing services.
- The economy must not depend on new-player payments being used to pay earlier players.

## Required asset fields
`asset_id`, `asset_type`, `asset_class`, `owner_player_id`, `title`, `original_price`, `current_listing_price`, `last_sale_price`, `credit_type`, `transferability_class`, `redeemable_sale_eligible`, `condition`, `rarity`, `upgrades`, `seller_id`, `buyer_id`, `marketplace_fee`, `seller_proceeds`, `transaction_history`, `status`.

## Required transaction fields
`transaction_id`, `timestamp`, `payer`, `payee`, `asset_id`, `transaction_type`, `gross_amount`, `marketplace_fee`, `net_amount`, `currency_class`, `usd_reference_value`, `settlement_status`, `redemption_status`, `fraud_status`.

The server/service layer must be authoritative for economic state. Browser and Unreal clients consume controlled APIs and must not be authoritative for balances or settlement.

## Rollout
**Phase 1 — Closed Economy:** Credits, jobs, assets, dealerships, property, businesses and NPC commerce.

**Phase 2 — Player Marketplace:** listings, purchases, ownership transfers, marketplace fees and creator commerce.

**Phase 3 — Controlled Redemption Pilot:** qualified sellers, identity verification, settlement and limited USD payout where permitted.

**Phase 4 — Expanded Player Economy:** businesses, property development, player services, creator economy and marketplace analytics.

ODC, blockchain assets, NFTs and external tokenization are not prerequisites for this economy.

## Canonical definition
Onegodia Marketplace Economy™ is the economic system of Onegodia: Rise of the Digital World™ through which players acquire, use, improve, create, operate, list, purchase and sell eligible virtual assets and services. Ordinary gameplay operates through non-redeemable Game Credits, while proceeds from qualifying player-to-player commerce may enter a controlled Marketplace Credit system and, where permitted and after applicable settlement, identity, fraud, tax and compliance requirements, become eligible for USD redemption. Asset values and resale outcomes are determined through gameplay and marketplace activity and are not guaranteed by ONEGODIAN, LLC.
