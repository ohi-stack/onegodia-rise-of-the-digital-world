import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Scale,
  XCircle,
  Coins,
  CreditCard,
  Store,
  Blocks,
  WalletCards,
  Bot,
} from 'lucide-react';

export const ComplianceView: React.FC = () => {
  const economyLayers = [
    {
      layer: 'Layer 1',
      title: 'Ordinary Gameplay Economy',
      status: 'Active / V1',
      icon: Coins,
      accent: 'text-emerald-300',
      border: 'border-emerald-500/30',
      background: 'bg-emerald-950/10',
      description:
        'Mission rewards, Game Credits, ordinary assets, shops, upgrades, and simulated ownership. Game Credits are gameplay-only by default.',
    },
    {
      layer: 'Layer 2',
      title: 'Premium Digital Game Products',
      status: 'When Verified',
      icon: CreditCard,
      accent: 'text-blue-300',
      border: 'border-blue-500/30',
      background: 'bg-blue-950/10',
      description:
        'Optional paid game entitlements such as cosmetics, access passes, and expansion content. These do not create investment, equity, appreciation, or profit-sharing rights.',
    },
    {
      layer: 'Layer 3',
      title: 'Player Marketplace',
      status: 'Roadmap',
      icon: Store,
      accent: 'text-amber-300',
      border: 'border-amber-500/30',
      background: 'bg-amber-950/10',
      description:
        'Future player-to-player or creator trading. Activation requires fraud, security, consumer, moderation, transaction, and dispute controls.',
    },
    {
      layer: 'Layer 4',
      title: 'ODC / Blockchain / NFT-Style Systems',
      status: 'Compliance Locked',
      icon: Blocks,
      accent: 'text-rose-300',
      border: 'border-rose-500/30',
      background: 'bg-rose-950/10',
      description:
        'Tokens, wallets, minting, staking, blockchain ownership, and external transfers require separate legal, technical, security, and economic review before activation.',
    },
    {
      layer: 'Layer 5',
      title: 'Cash-Out / Redeemable Economy',
      status: 'Compliance Locked',
      icon: WalletCards,
      accent: 'text-rose-300',
      border: 'border-rose-500/30',
      background: 'bg-rose-950/10',
      description:
        'Ordinary gameplay does not convert to USD. Any future redeemable-value system requires a separately approved payout, fraud, identity, tax/reporting, and compliance architecture.',
    },
  ];

  const restrictedCategories = [
    {
      title: 'ODC (Onegodian Coin) Economy',
      status: 'Compliance Locked',
      reason: 'Historical and roadmap references do not activate token transactions in V1.',
    },
    {
      title: 'NFT-Style Digital Collectibles',
      status: 'Roadmap / Compliance Locked',
      reason: 'Ordinary or rare game assets do not become NFTs merely because they are scarce or collectible.',
    },
    {
      title: 'Blockchain Minting & External Transfers',
      status: 'Inactive',
      reason: 'No on-chain minting, staking, gas-fee, or external-transfer requirement is part of ordinary V1 gameplay.',
    },
    {
      title: 'Web3 Wallet Connectors',
      status: 'Disabled in V1',
      reason: 'A player does not need a crypto wallet to play, complete missions, or use ordinary game inventory.',
    },
    {
      title: 'Casino & Wagering Mechanics',
      status: 'Compliance Locked',
      reason: 'No real-money or crypto wagering, casino deposits, withdrawals, or paid games of chance are active in V1.',
    },
    {
      title: 'Lending, Borrowing & Yield',
      status: 'Not Active',
      reason: 'No lending protocol, staking yield, passive-income mechanism, or financial return is part of ordinary gameplay.',
    },
    {
      title: 'Real-Money Player Marketplace',
      status: 'Compliance Locked',
      reason: 'Player resale, settlement, and cash redemption require a separate marketplace, security, and compliance architecture.',
    },
    {
      title: 'Cash Prizes / Redeemable Credits',
      status: 'Not Active',
      reason: 'Ordinary Game Credits are non-cashable gameplay points unless a separately approved specification changes that rule.',
    },
  ];

  return (
    <div className="space-y-6 py-2 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-[#0c0e14] border border-amber-500/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              REGULATORY, ETHICAL & COMPLIANCE FRAMEWORK
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Compliance & Technical Boundaries
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Official operational guardrails for Onegodia: Rise of the Digital World™ MVP v1.0.
          </p>
        </div>

        <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/50 flex items-center gap-2 text-amber-300 font-mono text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>V1 Compliance Guardrails Active</span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/60 shadow-lg space-y-2.5 font-mono text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
          <ShieldAlert className="w-4 h-4" />
          <span>OFFICIAL DEVELOPMENT COMPLIANCE STATEMENT</span>
        </div>
        <blockquote className="p-3.5 rounded-lg bg-[#050608] border border-amber-600/40 text-amber-100 text-xs leading-relaxed font-sans italic">
          “MVP v1.0 is a gameplay and interface prototype. Digital assets, NFT-style items, ODC, marketplace features, gambling-related features, and blockchain integrations are conceptual or roadmap-only unless expressly activated through separate legal, technical, security, economic, and compliance review.”
        </blockquote>
      </div>

      <section className="rounded-2xl border border-cyan-500/25 bg-gradient-to-br from-[#071018] via-[#08101a] to-[#100b18] p-5 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[.14em] text-cyan-300">
              <Bot className="h-4 w-4" />
              AI-ECONOMY-COMPLIANCE-AGENT
            </div>
            <h2 className="mt-3 text-2xl font-black text-white">Game economy policy & activation gate</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This project-control agent reviews game-economy classifications, pricing integrity, monetization boundaries, asset status, ODC/NFT restrictions, marketplace requirements, and activation gates before economic features are represented as operational.
            </p>
            <p className="mt-3 text-xs leading-6 text-slate-400">
              The agent is a development-governance function. It does not itself create legal authorization, regulatory approval, or a financial entitlement. Features requiring legal, financial, security, tax, platform, or jurisdiction-specific review remain locked until the appropriate human and technical review is completed.
            </p>
          </div>
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/10 p-4 font-mono text-xs text-cyan-200 lg:max-w-xs">
            <div className="font-bold text-cyan-300">OPERATING RULE</div>
            <div className="mt-2 leading-6">GAME ECONOMY FIRST.<br />REGULATED OR BLOCKCHAIN-BASED SYSTEMS SECOND.</div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-[.16em] text-slate-400">Economy Activation Model</div>
          <h2 className="mt-1 text-xl font-bold text-white">Five controlled economic layers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          {economyLayers.map(({ layer, title, status, icon: Icon, accent, border, background, description }) => (
            <article key={layer} className={`rounded-xl border ${border} ${background} p-4`}>
              <div className={`flex items-center gap-2 ${accent}`}>
                <Icon className="h-4 w-4" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">{layer}</span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-white">{title}</h3>
              <div className={`mt-2 font-mono text-[10px] font-bold uppercase ${accent}`}>{status}</div>
              <p className="mt-3 text-xs leading-5 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="space-y-3 font-mono text-xs">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Compliance Status by System:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {restrictedCategories.map((item) => (
            <div key={item.title} className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-slate-100 font-sans text-xs">{item.title}</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/40 text-[9px] text-right">
                  {item.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>{item.reason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-3 text-xs font-sans">
        <div className="flex items-center gap-2 font-mono text-blue-400 font-bold uppercase text-[11px]">
          <Scale className="w-3.5 h-3.5" />
          <span>Intellectual Property & Founder Attribution</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-xs">
          Project records identify <strong>One Gregory Onegodian™</strong> as the creator and originator of <strong>Onegodia: Rise of the Digital World™</strong>. Game concepts, documentation, brand materials, and related development assets are managed under the project’s applicable intellectual-property and contractual records.
        </p>
        <div className="p-2.5 bg-[#11131a] rounded-lg border border-[#1e2230] font-mono text-[10px] text-slate-400">
          Official Development Node: <span className="text-blue-300 font-bold">game.onegodian.com</span> • Prototype Classification: MVP v1.0
        </div>
      </div>
    </div>
  );
};
