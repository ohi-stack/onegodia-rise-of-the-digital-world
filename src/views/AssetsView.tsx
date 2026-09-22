import React from 'react';
import { Building2, Car, Store, Package, ShieldCheck } from 'lucide-react';
import { GAME_ASSET_CLASSES, PROPERTY_CLASSES, BUSINESS_CLASSES, PROPERTY_LOOP, BUSINESS_LOOP } from '../data/gameAssetRegistry';

const statusClass: Record<string,string> = {
  'Playable Now':'text-emerald-300 border-emerald-500/30 bg-emerald-950/20',
  'Prototype':'text-cyan-300 border-cyan-500/30 bg-cyan-950/20',
  'Planned':'text-amber-300 border-amber-500/30 bg-amber-950/20',
  'Roadmap':'text-violet-300 border-violet-500/30 bg-violet-950/20',
  'Compliance Locked':'text-rose-300 border-rose-500/30 bg-rose-950/20'
};

export const AssetsView: React.FC = () => (
  <div className="space-y-8 pb-16">
    <section className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-[#070b12] via-[#09101b] to-[#100a1c] p-7 md:p-10">
      <div className="font-mono text-[10px] font-bold tracking-[.18em] text-cyan-300">ONEGODIA • MASTER GAME ASSET REGISTRY</div>
      <h1 className="mt-4 text-4xl md:text-6xl font-black text-white">Assets of the Digital World</h1>
      <p className="mt-4 max-w-4xl text-slate-300 leading-7">The canonical gameplay catalog for property, businesses, transportation, equipment, collectibles, development projects and world assets. Status labels distinguish what is playable now from planned and roadmap systems.</p>
      <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10px]">
        <span className="rounded border border-cyan-500/30 px-2 py-1 text-cyan-300">{GAME_ASSET_CLASSES.length} ASSET CLASSES</span>
        <span className="rounded border border-slate-700 px-2 py-1 text-slate-300">GAMEPLAY FIRST</span>
        <span className="rounded border border-rose-500/30 px-2 py-1 text-rose-300">MARKETPLACE / BLOCKCHAIN COMPLIANCE LOCKED</span>
      </div>
    </section>

    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {GAME_ASSET_CLASSES.map((asset) => (
        <article key={asset.id} className="rounded-xl border border-slate-800 bg-[#090c12] p-5">
          <div className="flex items-start justify-between gap-3">
            <div><div className="font-mono text-[10px] text-slate-500">{asset.id}</div><h2 className="mt-1 text-lg font-black text-white">{asset.title}</h2></div>
            <span className={`rounded border px-2 py-1 font-mono text-[9px] font-bold ${statusClass[asset.status]}`}>{asset.status}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-1.5">{asset.examples.map(x => <span key={x} className="rounded bg-slate-900 px-2 py-1 text-[11px] text-slate-300">{x}</span>)}</div>
          <div className="mt-4 border-t border-slate-800 pt-3 font-mono text-[10px] text-slate-500">OWNERSHIP DOMAIN: <span className="text-slate-300">{asset.ownership}</span></div>
        </article>
      ))}
    </section>

    <section className="grid gap-5 lg:grid-cols-2">
      <article className="rounded-2xl border border-cyan-500/20 bg-[#080c12] p-6">
        <Building2 className="h-7 w-7 text-cyan-300"/><h2 className="mt-3 text-2xl font-black text-white">Real Estate System</h2>
        <div className="mt-4 flex flex-wrap gap-2">{PROPERTY_CLASSES.map(x=><span key={x} className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-300">{x}</span>)}</div>
        <p className="mt-5 font-mono text-xs leading-6 text-cyan-300">{PROPERTY_LOOP.join(' → ')}</p>
      </article>
      <article className="rounded-2xl border border-violet-500/20 bg-[#0b0912] p-6">
        <Store className="h-7 w-7 text-violet-300"/><h2 className="mt-3 text-2xl font-black text-white">Business System</h2>
        <div className="mt-4 flex flex-wrap gap-2">{BUSINESS_CLASSES.map(x=><span key={x} className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-300">{x}</span>)}</div>
        <p className="mt-5 font-mono text-xs leading-6 text-violet-300">{BUSINESS_LOOP.join(' → ')}</p>
      </article>
    </section>

    <section className="rounded-xl border border-slate-800 bg-[#080a0f] p-6">
      <div className="flex gap-3"><Car className="h-6 w-6 text-cyan-300"/><div><h2 className="text-xl font-black text-white">Asset Relationship Model</h2><p className="mt-2 font-mono text-xs leading-7 text-slate-300">PLAYER → PROPERTY → BUSINESS → VEHICLES / EQUIPMENT<br/>PROPERTY → BUILDING + INFRASTRUCTURE UPGRADES<br/>PLAYER → INVENTORY + COLLECTIBLES + MISSION ASSETS + UNLOCKS<br/>GAME SERVICES → AUTHORITATIVE OWNERSHIP + PROGRESSION RECORDS</p></div></div>
    </section>

    <section className="rounded-xl border border-amber-500/25 bg-amber-950/10 p-5 text-sm leading-6 text-slate-400">
      <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 text-amber-300"/><p><strong className="text-amber-200">Development boundary:</strong> This registry combines playable, prototype, planned and roadmap asset classes. A catalog entry does not mean the asset is currently obtainable. ODC, NFT-style ownership, player marketplace trading, casino/gambling systems, tokenized property and real-money asset exchange remain inactive or compliance-locked unless separately reviewed and activated.</p></div>
    </section>
  </div>
);
