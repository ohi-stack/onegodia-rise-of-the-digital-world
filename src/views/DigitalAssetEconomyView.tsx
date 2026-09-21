import React from 'react';
import { Building2, Car, Gem, Palette, Store, Boxes, ShieldCheck, ArrowRight, Hammer, Landmark, Shirt, Sparkles } from 'lucide-react';

const assetClasses = [
  { icon: Car, title: 'Vehicles', text: 'Cars, transportation assets, upgrades, components and future specialty vehicles.' },
  { icon: Building2, title: 'Property', text: 'Homes, commercial spaces, development locations and other virtual property systems.' },
  { icon: Store, title: 'Digital Businesses', text: 'Player-operated stores, studios, services and entertainment venues.' },
  { icon: Shirt, title: 'Fashion & Identity', text: 'Clothing, footwear, jewelry, accessories and character customization.' },
  { icon: Gem, title: 'Collectibles', text: 'Rare objects, artifacts, limited editions and achievement-linked collectibles.' },
  { icon: Palette, title: 'Creator Assets', text: 'Approved player-created buildings, artwork, fashion, objects and compatible game content.' },
];

const statuses = [
  ['Digital Asset Economy', 'Roadmap'],
  ['Inventory', 'Gameplay System / Development'],
  ['Virtual Property', 'Planned'],
  ['Digital Businesses', 'Planned'],
  ['Creator Assets', 'Planned'],
  ['Player Marketplace', 'Compliance Locked'],
  ['NFT-Style Assets', 'Compliance Locked'],
  ['Blockchain Ownership', 'Compliance Locked'],
  ['ODC Transactions', 'Compliance Locked'],
  ['Real-Money Asset Trading', 'Not Active'],
];

export const DigitalAssetEconomyView: React.FC = () => (
  <div className="space-y-10 pb-16">
    <section className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-[#080b13] via-[#0b1020] to-[#120a22] p-7 md:p-12">
      <div className="absolute inset-0 gamer-grid opacity-20" />
      <div className="relative z-10 max-w-4xl">
        <div className="inline-flex rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[10px] font-mono font-bold tracking-[.18em] text-amber-300">ONEGODIA • DIGITAL ASSET ECONOMY • ROADMAP SYSTEM</div>
        <h1 className="mt-5 text-4xl md:text-6xl font-black tracking-tight text-white">Own More Than Items. <span className="text-violet-300">Build Your Place in the World.</span></h1>
        <p className="mt-5 max-w-3xl text-base md:text-lg leading-8 text-slate-300">Onegodia's Digital Asset Economy is designed to connect exploration, missions, property, vehicles, businesses, customization, collecting, creation and commerce into one evolving gameplay system.</p>
        <div className="mt-6 inline-flex items-center gap-2 rounded border border-violet-500/40 bg-violet-500/10 px-3 py-2 font-mono text-xs font-bold text-violet-200"><ShieldCheck className="h-4 w-4"/> STATUS: ROADMAP / DEVELOPMENT</div>
      </div>
    </section>

    <section>
      <div className="mb-4 font-mono text-xs font-bold tracking-[.18em] text-cyan-400">THE ECONOMIC LOOP</div>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-[#090c12] p-5">
        {['EXPLORE','EARN','ACQUIRE','BUILD','CUSTOMIZE','USE','TRADE','UPGRADE','CREATE','REINVEST'].map((x,i)=><React.Fragment key={x}><span className="rounded bg-slate-900 px-3 py-2 font-mono text-xs font-bold text-slate-200">{x}</span>{i<9&&<ArrowRight className="h-3.5 w-3.5 text-cyan-500"/>}</React.Fragment>)}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-400">The economy begins with gameplay. Players earn access to opportunities by exploring the world, completing missions, developing properties, operating businesses, creating content and progressing through Onegodia.</p>
    </section>

    <section>
      <h2 className="text-2xl font-black text-white">Digital Asset Classes</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assetClasses.map(({icon:Icon,title,text})=><article key={title} className="rounded-xl border border-slate-800 bg-[#090c12] p-5 hover:border-violet-500/40 transition-colors"><Icon className="h-6 w-6 text-violet-300"/><h3 className="mt-4 font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></article>)}
      </div>
    </section>

    <section className="grid gap-4 lg:grid-cols-4">
      {[
        ['STANDARD GAME ASSET','GAMEPLAY SYSTEM','Stored and managed through the normal game system.'],
        ['RARE / LIMITED ASSET','PLANNED','Controlled supply, achievement requirements or defined rarity.'],
        ['PLAYER-TRANSFERABLE ASSET','ROADMAP','Eligible assets capable of exchange through an approved future marketplace.'],
        ['BLOCKCHAIN-VERIFIED ASSET','COMPLIANCE LOCKED','Future eligible assets whose provenance or ownership could use a verification layer.']
      ].map(([title,status,text])=><article key={title} className="rounded-xl border border-slate-800 bg-[#090c12] p-5"><div className="font-mono text-[10px] font-bold text-amber-300">{status}</div><h3 className="mt-2 font-bold text-white">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></article>)}
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <article className="rounded-2xl border border-cyan-500/20 bg-[#080c12] p-6"><Landmark className="h-7 w-7 text-cyan-300"/><h2 className="mt-4 text-2xl font-black text-white">Acquire. Develop. Operate. Transform.</h2><p className="mt-3 text-sm leading-6 text-slate-400">Property is intended to become an active gameplay system: discover, acquire, improve, develop, operate, customize, and eventually transfer or redevelop eligible spaces.</p><div className="mt-4 font-mono text-xs text-cyan-300">RESIDENTIAL • COMMERCIAL • RETAIL • CREATOR SPACE • DEVELOPMENT</div></article>
      <article className="rounded-2xl border border-violet-500/20 bg-[#0b0912] p-6"><Hammer className="h-7 w-7 text-violet-300"/><h2 className="mt-4 text-2xl font-black text-white">Build a Business Inside the World.</h2><p className="mt-3 text-sm leading-6 text-slate-400">Players may eventually establish and operate digital businesses using eligible Onegodia properties, products and services.</p><div className="mt-4 font-mono text-xs text-violet-300">PROPERTY → BUSINESS → CUSTOMERS → GAME REVENUE → UPGRADES → EXPANSION</div></article>
    </section>

    <section className="rounded-2xl border border-amber-500/25 bg-[#0d0b08] p-6 md:p-8">
      <div className="flex items-center gap-3"><Boxes className="h-7 w-7 text-amber-300"/><div><div className="font-mono text-[10px] font-bold text-amber-300">ROADMAP / COMPLIANCE LOCKED</div><h2 className="text-2xl font-black text-white">The Future Onegodia Marketplace</h2></div></div>
      <div className="mt-5 flex flex-wrap gap-2">{['ALL','VEHICLES','PROPERTY','FASHION','COLLECTIBLES','CREATOR ASSETS','BUSINESS ASSETS'].map(x=><span key={x} className="rounded border border-slate-700 bg-slate-900 px-3 py-2 font-mono text-[10px] text-slate-300">{x}</span>)}</div>
      <p className="mt-5 text-sm leading-6 text-slate-400">Conceptual flow: Asset → Ownership Verification → Eligible Listing → Exchange → Settlement → Ownership Update. No live real-money marketplace, NFT exchange, or ODC transaction functionality is represented here.</p>
    </section>

    <section className="rounded-2xl border border-violet-500/25 bg-gradient-to-r from-violet-950/20 to-cyan-950/20 p-7 text-center">
      <Sparkles className="mx-auto h-8 w-8 text-violet-300"/><h2 className="mt-3 text-3xl font-black text-white">THE GAME COMES FIRST.</h2>
      <p className="mx-auto mt-4 max-w-3xl font-mono text-sm leading-7 text-slate-300">Fun Gameplay → Meaningful Progression → Useful Assets → Player Creation → Internal Economy → Marketplace → Optional Verification Layer</p>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">Players should be able to enjoy Onegodia without being required to purchase cryptocurrency, NFTs, or speculative digital assets.</p>
    </section>

    <section>
      <h2 className="text-2xl font-black text-white">Development Status</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
        {statuses.map(([system,status],i)=><div key={system} className={`flex items-center justify-between gap-4 px-4 py-3 text-sm ${i%2?'bg-[#080a0f]':'bg-[#0c0f15]'}`}><span className="font-semibold text-slate-200">{system}</span><span className="font-mono text-[10px] font-bold text-amber-300">{status}</span></div>)}
      </div>
    </section>

    <section className="rounded-xl border border-slate-800 bg-[#080a0f] p-5 text-xs leading-6 text-slate-500">
      <strong className="text-slate-300">Development Notice:</strong> Digital assets, NFTs, blockchain ownership, ODC transactions, marketplace trading, tokenized property, real-money transactions and related economic systems described on this page represent planned or conceptual functionality unless expressly identified as operational. Availability depends on development completion, testing, security review, platform requirements, and applicable legal and compliance review.
    </section>
  </div>
);
