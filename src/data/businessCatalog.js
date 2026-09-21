export const businessCatalog = [
  { id: 'corner-market', name: 'Corner Market', priceCredits: 12500, tier: 'Neighborhood', unlock: 'Starter Commerce', status: 'Planned Gameplay', category: 'Retail', description: 'A compact neighborhood store for basic goods, supplies, and local customer missions.' },
  { id: 'cafe', name: 'Café', priceCredits: 18000, tier: 'Neighborhood', unlock: 'Starter Commerce', status: 'Planned Gameplay', category: 'Food & Hospitality', description: 'Operate a small café, serve NPC customers, and build neighborhood reputation.' },
  { id: 'auto-detail', name: 'Auto Detail', priceCredits: 24000, tier: 'Service', unlock: 'Local Services', status: 'Planned Gameplay', category: 'Automotive', description: 'Run a vehicle-detailing business connected to the driving and vehicle customization systems.' },
  { id: 'creative-studio', name: 'Creative Studio', priceCredits: 30000, tier: 'Service', unlock: 'Creator Economy', status: 'Planned Gameplay', category: 'Creative', description: 'A creator workspace for approved art, media, design, and future player-created assets.' },
  { id: 'repair-garage', name: 'Repair Garage', priceCredits: 35000, tier: 'Service', unlock: 'Vehicle Services', status: 'Planned Gameplay', category: 'Automotive', description: 'Repair, maintain, and eventually upgrade eligible vehicles inside the game economy.' },
  { id: 'delivery-logistics', name: 'Delivery & Logistics', priceCredits: 42500, tier: 'Growth', unlock: 'Mobility Network', status: 'Planned Gameplay', category: 'Transportation', description: 'Take delivery contracts, move goods across districts, and expand transportation routes.' },
  { id: 'restaurant', name: 'Restaurant', priceCredits: 55000, tier: 'Growth', unlock: 'Hospitality Operations', status: 'Planned Gameplay', category: 'Food & Hospitality', description: 'Operate a larger food-service venue with staffing, supply, and customer-flow gameplay.' },
  { id: 'construction-services', name: 'Construction Services', priceCredits: 75000, tier: 'Enterprise', unlock: 'Redevelopment', status: 'Planned Gameplay', category: 'Construction', description: 'Support property upgrades, district renewal missions, and future player development projects.' },
  { id: 'property-management', name: 'Property Management', priceCredits: 90000, tier: 'Enterprise', unlock: 'Property Operations', status: 'Planned Gameplay', category: 'Real Estate', description: 'Manage eligible virtual properties, maintenance tasks, tenants, and operating objectives.' },
  { id: 'technology-company', name: 'Technology Company', priceCredits: 120000, tier: 'Enterprise', unlock: 'Digital Infrastructure', status: 'Planned Gameplay', category: 'Technology', description: 'Operate a technology business tied to digital infrastructure, systems, and advanced missions.' },
  { id: 'entertainment-venue', name: 'Entertainment Venue', priceCredits: 150000, tier: 'Premier', unlock: 'District Entertainment', status: 'Planned Gameplay', category: 'Entertainment', description: 'Run an event or entertainment location with programming, visitors, and community activities.' },
  { id: 'property-development-company', name: 'Property Development Company', priceCredits: 250000, tier: 'Premier', unlock: 'City Builder', status: 'Planned Gameplay', category: 'Real Estate', description: 'The advanced redevelopment business for acquiring projects, improving districts, and coordinating large virtual developments.' },
];

export const realMoneyPackages = [
  {
    id: 'genesis-business-starter-pack',
    name: 'Genesis Business Starter Pack',
    price: '$29.99',
    priceCents: 2999,
    checkoutStatus: 'disabled-until-stripe-price-configured',
    virtualGameProduct: true,
    description: 'Optional virtual-game package for future business onboarding. It is not an investment, equity interest, security, or promise of financial return.',
    includes: ['Founder business badge', 'Business onboarding cosmetic set', 'Future eligible starter-business entitlement after activation'],
  },
];
