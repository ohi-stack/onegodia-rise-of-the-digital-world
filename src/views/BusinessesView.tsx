import React, { useMemo, useState } from 'react';
import {
  Building2,
  Car,
  Coffee,
  Construction,
  Cpu,
  Hammer,
  PackageCheck,
  Play,
  ShieldCheck,
  Sparkles,
  Store,
  Truck,
  UtensilsCrossed,
  Wrench,
} from 'lucide-react';
import { NavigationTab } from '../types';
import { businessCatalog, realMoneyPackages } from '../data/businessCatalog.js';

interface BusinessesViewProps {
  setActiveTab: (tab: NavigationTab) => void;
}

const creditFormatter = new Intl.NumberFormat('en-US');

const categoryIcons: Record<string, React.FC<{ className?: string }>> = {
  Retail: Store,
  'Food & Hospitality': UtensilsCrossed,
  Automotive: Car,
  Creative: Sparkles,
  Transportation: Truck,
  Construction,
  'Real Estate': Building2,
  Technology: Cpu,
  Entertainment: Play,
};

const tierOrder = ['All', 'Neighborhood', 'Service', 'Growth', 'Enterprise', 'Premier'];

export const BusinessesView: React.FC<BusinessesViewProps> = ({ setActiveTab }) => {
  const [tier, setTier] = useState('All');

  const businesses = useMemo(
    () => (tier === 'All' ? businessCatalog : businessCatalog.filter((business) => business.tier === tier)),
    [tier],
  );

  const starterPack = realMoneyPackages[0];

  return (
    <div className="space-y-10 pb-16">
      <section className="relative overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#07110e] via-[#071015] to-[#0d0a16] p-7 md:p-12">
        <div className="absolute inset-0 gamer-grid opacity-20" />
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[10px] font-mono font-bold tracking-[.18em] text-emerald-300">
            ONEGODIA • DIGITAL BUSINESSES • PROTOTYPE ECONOMY PRICING
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white md:text-6xl">
            Start Small. <span className="text-emerald-300">Build an Empire Inside the World.</span>
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
            Onegodia businesses are designed as progression systems. Players can work toward stores, services, hospitality, transportation, technology and property-development operations using the ordinary game economy first.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('play')}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 font-mono text-xs font-black text-black transition-colors hover:bg-emerald-300"
            >
              <Play className="h-4 w-4" /> PLAY STAMFORD
            </button>
            <button
              onClick={() => setActiveTab('digital-asset-economy')}
              className="inline-flex items-center gap-2 rounded-lg border border-violet-500/40 bg-violet-500/10 px-4 py-2.5 font-mono text-xs font-bold text-violet-200 transition-colors hover:border-violet-400/70"
            >
              <Building2 className="h-4 w-4" /> VIEW DIGITAL ECONOMY
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#080b10] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="font-mono text-xs font-bold tracking-[.18em] text-cyan-400">CANONICAL BUSINESS CATALOG</div>
            <h2 className="mt-2 text-2xl font-black text-white">12 Businesses • 5 Progression Tiers</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Prices below are prototype in-game acquisition targets denominated in Onegodia Credits (CR). They are not real-world valuations, investments, equity interests, securities, or promises of financial return.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {tierOrder.map((item) => (
              <button
                key={item}
                onClick={() => setTier(item)}
                className={`rounded border px-3 py-2 font-mono text-[10px] font-bold transition-colors ${
                  tier === item
                    ? 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200'
                    : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {item.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {businesses.map((business, index) => {
          const Icon = categoryIcons[business.category] || Hammer;
          return (
            <article
              key={business.id}
              className="group rounded-2xl border border-slate-800 bg-[#090c12] p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-500/40"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10">
                  <Icon className="h-5 w-5 text-emerald-300" />
                </div>
                <div className="text-right">
                  <div className="font-mono text-[9px] font-bold tracking-wider text-slate-500">BUS-{String(index + 1).padStart(3, '0')}</div>
                  <div className="mt-1 rounded border border-amber-500/30 bg-amber-500/10 px-2 py-1 font-mono text-[10px] font-bold text-amber-300">
                    {creditFormatter.format(business.priceCredits)} CR
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 font-mono text-[9px] font-bold">
                <span className="rounded bg-slate-800 px-2 py-1 text-slate-300">{business.tier.toUpperCase()}</span>
                <span className="rounded bg-blue-950/70 px-2 py-1 text-blue-300">{business.category.toUpperCase()}</span>
              </div>

              <h3 className="mt-4 text-xl font-black text-white">{business.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{business.description}</p>

              <div className="mt-5 space-y-2 border-t border-slate-800 pt-4 font-mono text-[10px]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">UNLOCK PATH</span>
                  <span className="text-cyan-300">{business.unlock}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">STATUS</span>
                  <span className="text-amber-300">{business.status}</span>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <article className="rounded-2xl border border-cyan-500/20 bg-[#071018] p-6 md:p-8">
          <div className="flex items-center gap-3">
            <PackageCheck className="h-7 w-7 text-cyan-300" />
            <div>
              <div className="font-mono text-[10px] font-bold text-cyan-300">BUSINESS GAMEPLAY LOOP</div>
              <h2 className="text-2xl font-black text-white">Earn → Acquire → Operate → Upgrade → Expand</h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-400">
            The catalog defines progression pricing now, but the actual operating mechanics remain staged development. Business ownership should eventually connect to missions, properties, customers, staffing, supplies, vehicles, district reputation and reinvestment.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 font-mono text-[10px] font-bold text-cyan-200">
            {['MISSIONS', 'PROPERTY', 'CUSTOMERS', 'GAME REVENUE', 'UPGRADES', 'EXPANSION'].map((item) => (
              <span key={item} className="rounded border border-cyan-500/25 bg-cyan-500/5 px-3 py-2">{item}</span>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-violet-500/25 bg-[#0d0915] p-6 md:p-8">
          <div className="font-mono text-[10px] font-bold tracking-[.16em] text-violet-300">OPTIONAL VIRTUAL GAME PACKAGE</div>
          <h2 className="mt-2 text-2xl font-black text-white">{starterPack.name}</h2>
          <div className="mt-3 text-4xl font-black text-amber-300">{starterPack.price}</div>
          <p className="mt-3 text-sm leading-6 text-slate-400">{starterPack.description}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {starterPack.includes.map((item) => (
              <li key={item} className="flex gap-2"><span className="text-violet-300">◆</span>{item}</li>
            ))}
          </ul>
          <button
            type="button"
            disabled
            className="mt-5 w-full cursor-not-allowed rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 font-mono text-xs font-bold text-slate-500"
          >
            CHECKOUT NOT CONFIGURED
          </button>
          <div className="mt-3 flex items-start gap-2 text-[11px] leading-5 text-slate-500">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            Stripe checkout stays disabled until a valid server-side Price ID and entitlement flow are configured and verified.
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-slate-800 bg-[#080a0f] p-5 text-xs leading-6 text-slate-500">
        <strong className="text-slate-300">Development Notice:</strong> The business catalog and prototype-credit prices are approved game-design targets. Business operating systems, game revenue, property integration, customer simulation, staffing and paid starter-pack entitlements remain development features unless separately marked verified/playable. No business purchase represents ownership in ONEGODIAN, LLC or any real-world enterprise.
      </section>
    </div>
  );
};
