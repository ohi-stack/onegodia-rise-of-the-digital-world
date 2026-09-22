export type AssetStatus = 'Playable Now' | 'Prototype' | 'Planned' | 'Roadmap' | 'Compliance Locked';

export interface GameAssetClass {
  id: string;
  title: string;
  examples: string[];
  status: AssetStatus;
  ownership: 'Player' | 'Business' | 'Property' | 'World' | 'Mixed';
}

export const GAME_ASSET_CLASSES: GameAssetClass[] = [
  { id:'RE', title:'Real Estate', examples:['Houses','Apartments','Condos','Residential lots','Commercial buildings','Retail spaces','Industrial property','Creator spaces','Entertainment property','Development parcels'], status:'Planned', ownership:'Player' },
  { id:'BUS', title:'Businesses', examples:['Retail stores','Creative studios','Vehicle businesses','Restaurants','Technology companies','Construction companies','Entertainment venues','Property-development businesses'], status:'Planned', ownership:'Player' },
  { id:'VEH', title:'Vehicles', examples:['Cyber-Cruiser','Cars','SUVs','Trucks','Vans','Commercial/work vehicles','Racing vehicles','Specialty vehicles'], status:'Prototype', ownership:'Mixed' },
  { id:'AIR', title:'Aircraft', examples:['Aircraft','Future aerial vehicles','Flying mounts'], status:'Roadmap', ownership:'Mixed' },
  { id:'SEA', title:'Watercraft', examples:['Boats','Sailing vessels','Future water transportation'], status:'Roadmap', ownership:'Mixed' },
  { id:'CHAR', title:'Character Assets', examples:['Clothing','Outfits','Skins','Accessories','Character customization'], status:'Planned', ownership:'Player' },
  { id:'EQP', title:'Tools & Equipment', examples:['Mission tools','Construction equipment','Development equipment','Specialized gameplay equipment'], status:'Planned', ownership:'Mixed' },
  { id:'BLD', title:'Construction Assets', examples:['Building materials','Property upgrades','Infrastructure components','Green-development components'], status:'Planned', ownership:'Property' },
  { id:'TECH', title:'Technology Assets', examples:['Smart devices','Technology equipment','Digital-world devices'], status:'Planned', ownership:'Mixed' },
  { id:'LMK', title:'Landmarks & POIs', examples:['Landmarks','Important buildings','Mission POIs','World structures'], status:'Planned', ownership:'World' },
  { id:'MIS', title:'Mission Assets', examples:['Onegodia Data Fragment #001','Mission rewards','Quest items','Fragments','Progression unlocks'], status:'Prototype', ownership:'Player' },
  { id:'COL', title:'Collectibles', examples:['Digital collectibles','Limited items','Memorabilia','Rare Onegodia artifacts'], status:'Roadmap', ownership:'Player' },
  { id:'LIC', title:'Licenses & Rights', examples:['Business licenses','Gameplay permissions','Operational unlocks'], status:'Planned', ownership:'Player' },
  { id:'MEM', title:'Membership & Access', examples:['Membership items','Access items','Passes','Player unlocks'], status:'Roadmap', ownership:'Player' },
  { id:'CRT', title:'Creator Assets', examples:['Approved models','Buildings','Environmental objects','Artwork','Fashion','Compatible game content'], status:'Roadmap', ownership:'Mixed' },
  { id:'DEV', title:'Development Assets', examples:['Redevelopment parcels','Parks','Housing projects','Business zones','Cultural centers','Technology hubs','Green infrastructure'], status:'Planned', ownership:'Mixed' },
];

export const PROPERTY_CLASSES = ['Residential','Commercial','Retail','Industrial','Creator Space','Entertainment','Development Property'];
export const BUSINESS_CLASSES = ['Retail Store','Creative Studio','Vehicle Business','Restaurant','Technology Company','Construction Company','Entertainment Venue','Property Development Business'];
export const PROPERTY_LOOP = ['Discover','Acquire','Improve','Develop','Operate','Customize','Transfer / Redevelop'];
export const BUSINESS_LOOP = ['Property','Business','Products / Services','Customers','Game Revenue','Upgrades','Expansion'];
