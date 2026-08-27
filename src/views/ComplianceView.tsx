import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  AlertTriangle, 
  FileText, 
  Scale, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';

export const ComplianceView: React.FC = () => {
  const restrictedCategories = [
    { title: 'ODC (Onegodian Coin) Economy', status: 'Conceptual / Roadmap Only', reason: 'No active cryptocurrency, tokens, or sales.' },
    { title: 'NFT-Style Digital Collectibles', status: 'Simulated Off-Chain Only', reason: 'Stored only in local player cache; no smart contracts.' },
    { title: 'Blockchain Minting & Gas Fees', status: 'Strictly Inactive', reason: 'Zero on-chain transactions or contract interactions.' },
    { title: 'Web3 Wallet Connectors', status: 'Disabled / Prohibited in V1', reason: 'No MetaMask, Phantom, or Web3 connector scripts.' },
    { title: 'Casino & Wagering Mechanics', status: 'Zero Gambling Guarantee', reason: 'No games of chance, staking, or real-money wagering.' },
    { title: 'Lending & Borrowing Protocols', status: 'Non-Existent', reason: 'No financial mechanisms or credit instruments.' },
    { title: 'Real-Money Marketplace', status: 'Compliance Locked', reason: 'Subject to comprehensive regulatory review before any Phase 4 beta.' },
    { title: 'Cash Prizes or Dividends', status: 'Strictly Prohibited', reason: 'All game points and credits are non-convertible video game points.' },
  ];

  return (
    <div className="space-y-6 py-2 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-[#0c0e14] border border-amber-500/40">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
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
          <span>V1 Legal Clearance Active</span>
        </div>
      </div>

      {/* Mandatory Official Disclosure Box */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/60 shadow-lg space-y-2.5 font-mono text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
          <ShieldAlert className="w-4 h-4" />
          <span>MANDATORY STATUTORY & REGULATORY STATEMENT</span>
        </div>
        <blockquote className="p-3.5 rounded-lg bg-[#050608] border border-amber-600/40 text-amber-100 text-xs leading-relaxed font-sans italic">
          “MVP v1.0 is a gameplay and interface prototype. Digital assets, NFT-style items, ODC, marketplace features, gambling-related features, and blockchain integrations are conceptual or roadmap-only unless expressly activated through separate legal, technical, and compliance review.”
        </blockquote>
      </div>

      {/* System Classification Matrix */}
      <div className="space-y-3 font-mono text-xs">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Compliance Status by System:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {restrictedCategories.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 font-sans text-xs">{item.title}</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/40 text-[9px]">
                  {item.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{item.reason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal & IP Protections */}
      <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-3 text-xs font-sans">
        <div className="flex items-center gap-2 font-mono text-blue-400 font-bold uppercase text-[11px]">
          <Scale className="w-3.5 h-3.5" />
          <span>Intellectual Property & Founder Attribution</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-xs">
          The concept, universe, lore, game design documents, digital world architectures, and brand marks of <strong>Onegodia: Rise of the Digital World™</strong> and related game components are the proprietary intellectual property created by <strong>One Gregory Onegodian™</strong>.
        </p>
        <div className="p-2.5 bg-[#11131a] rounded-lg border border-[#1e2230] font-mono text-[10px] text-slate-400">
          Official Development Node: <span className="text-blue-300 font-bold">game.onegodian.com</span> • Prototype Classification: MVP v1.0
        </div>
      </div>

    </div>
  );
};
