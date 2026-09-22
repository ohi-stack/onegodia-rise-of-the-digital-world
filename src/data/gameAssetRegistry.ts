export type AssetStatus = 'Playable Now' | 'Prototype' | 'Planned' | 'Roadmap' | 'Compliance Locked';

export interface GameAssetClass {
  id: string;
  title: string;
  examples: string[];
  status: AssetStatus;
  ownership: 'Player' | 'Business' | 'Property' | 'World' | 'Mixed';
}

export const GAME_ASSET_CLASSES: GameAssetClass[] = [
  { id:'RE', title:'Real Estate & Land', examples:['Homes','Apartments','Residential lots','Commercial buildings','Stores','Offices','Workshops','Warehouses','Industrial property','Development parcels','Entertainment venues','Creator spaces'], status:'Planned', ownership:'Player' },
  { id:'BLDG', title:'Buildings & Improvements', examples:['Property improvements','Renovations','Building upgrades','Mixed-use improvements','Green infrastructure','Smart-city upgrades'], status:'Planned', ownership:'Property' },
  { id:'BUS', title:'Businesses', examples:['Retail stores','Vehicle businesses','Creative studios','Restaurants','Entertainment venues','Construction companies','Technology businesses','Transportation businesses','Property-development businesses'], status:'Planned', ownership:'Player' },
  { id:'VEH', title:'Vehicles', examples:['Cyber-Cruiser','Cars','SUVs','Trucks','Vans','Electric vehicles','Motorcycles','Commercial/work vehicles','Racing vehicles','Onegodia-branded vehicles'], status:'Prototype', ownership:'Mixed' },
  { id:'VUP', title:'Vehicle Parts & Upgrades', examples:['Performance packages','Components','Accessories','Custom paint systems','Rare components','Wheels and tires','Utility upgrades'], status:'Planned', ownership:'Player' },
  { id:'AIR', title:'Aircraft & Aerial Mobility', examples:['Aircraft','Future aerial vehicles','Flying mounts','Flight equipment'], status:'Roadmap', ownership:'Mixed' },
  { id:'SEA', title:'Watercraft', examples:['Boats','Sailing vessels','Future water transportation'], status:'Roadmap', ownership:'Mixed' },
  { id:'CHAR', title:'Fashion & Character Assets', examples:['Clothing','Footwear','Jewelry','Outfits','Skins','Accessories','Hairstyles','Cosmetics','Special visual effects'], status:'Planned', ownership:'Player' },
  { id:'EQP', title:'Tools & Equipment', examples:['Mission tools','Construction equipment','Development equipment','Business equipment','Specialized gameplay equipment'], status:'Planned', ownership:'Mixed' },
  { id:'CON', title:'Construction & Development Assets', examples:['Building materials','Plans','Components','Development resources','Infrastructure components','Green-development components'], status:'Planned', ownership:'Property' },
  { id:'INT', title:'Interior & World Assets', examples:['Furniture','Furnishings','Artwork','Decorative objects','Environmental objects','World-building items'], status:'Planned', ownership:'Mixed' },
  { id:'TECH', title:'Technology & Smart Devices', examples:['Smart devices','Technology equipment','Digital-world devices','Commercial technology'], status:'Planned', ownership:'Mixed' },
  { id:'LMK', title:'Landmarks & POIs', examples:['Landmarks','Important buildings','Mission POIs','World structures','Special locations'], status:'Planned', ownership:'World' },
  { id:'MIS', title:'Mission & Reward Assets', examples:['Onegodia Data Fragment #001','Mission rewards','Quest items','Fragments','Progression unlocks','Access items'], status:'Prototype', ownership:'Player' },
  { id:'COL', title:'Collectibles', examples:['Digital collectibles','Achievement items','Event rewards','Limited editions','Historical memorabilia'], status:'Roadmap', ownership:'Player' },
  { id:'ART', title:'Onegodia Artifacts & Relics', examples:['Nexus artifacts','Historical objects','World fragments','Mission relics','Hidden digital creations'], status:'Roadmap', ownership:'Mixed' },
  { id:'LIC', title:'Business Assets, Licenses & Rights', examples:['Business licenses','Commercial equipment','Furnishings','Operational upgrades','Gameplay permissions','Authorized business items'], status:'Planned', ownership:'Business' },
  { id:'MEM', title:'Membership & Access Assets', examples:['Membership items','Access items','Passes','Player unlocks','Zone access'], status:'Roadmap', ownership:'Player' },
  { id:'CRT', title:'Creator Assets', examples:['Approved 3D models','Buildings','Environmental assets','Artwork','Fashion','Furniture','Vehicle designs','Experiences','Digital business concepts'], status:'Roadmap', ownership:'Mixed' },
  { id:'DEV', title:'Community Development Assets', examples:['Redevelopment parcels','Parks','Housing projects','Business zones','Cultural centers','Technology hubs','Green-energy hubs','Neighborhood improvements'], status:'Planned', ownership:'Mixed' },
  { id:'XFER', title:'Player-Transferable Assets', examples:['Eligible property','Vehicles','Collectibles','Creator assets','Business assets'], status:'Roadmap', ownership:'Mixed' },
  { id:'CHAIN', title:'Blockchain-Verified Eligible Assets', examples:['Separately approved provenance records','Limited-edition assets','Eligible ownership records','Approved transfer history'], status:'Compliance Locked', ownership:'Mixed' },
];

export const PROPERTY_CLASSES = ['Residential','Commercial','Retail','Industrial','Creator Space','Entertainment','Development Property'];
export const BUSINESS_CLASSES = ['Retail Store','Creative Studio','Vehicle Business','Restaurant','Technology Company','Construction Company','Entertainment Venue','Transportation Business','Property Development Business'];
export const PROPERTY_LOOP = ['Discover','Acquire','Improve','Develop','Operate','Customize','Lease / Transfer','Redevelop'];
export const BUSINESS_LOOP = ['Property','Business','Products / Services','Customers','Game Revenue','Upgrades','Expansion'];

export const ASSET_CLASSIFICATION = [
  'Standard Game Asset',
  'Rare / Limited Game Asset',
  'Player-Transferable Asset',
  'Blockchain-Verified Asset'
] as const;
