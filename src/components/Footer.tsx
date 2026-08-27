import React from 'react';
import { NavigationTab } from '../types';
import { ShieldCheck, Terminal, Cpu, Radio, Sparkles } from 'lucide-react';
import { sound } from '../services/audioService';

interface FooterProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const handleNav = (tab: NavigationTab) => {
    sound.playClick();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0c0e14] border-t border-[#1e2230] text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-6 border-b border-[#1e2230]">
          
          {/* Col 1: Brand & Concept Credit */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center font-mono font-bold text-white text-[11px]">
                Ω
              </div>
              <span className="font-bold text-white text-xs sm:text-sm tracking-wide">
                Onegodia: Rise of the Digital World™
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-lg">
              An open-world digital lifestyle simulation and digital-world action concept created by <strong className="text-blue-300">One Gregory Onegodian™</strong>. Blending real-world metropolitan environments with futuristic cybernetic frameworks and staged Unreal Engine 5 development.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Official Node: game.onegodian.com
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#11131a] border border-[#1e2230] text-slate-400 text-[10px] font-mono">
                <Cpu className="w-3 h-3 text-blue-400" />
                Target: UE5 + Web V1
              </span>
            </div>
          </div>

          {/* Col 2: Prototype Quick Links */}
          <div className="space-y-2 font-mono text-xs">
            <h4 className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              V1 Prototype Links
            </h4>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>
                <button onClick={() => handleNav('prototype')} className="hover:text-blue-300 transition-colors">
                  Playable Game V1 (Sector 7)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gameplay-grid')} className="hover:text-blue-300 transition-colors">
                  18-Module Gameplay Grid
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tactical-hud')} className="hover:text-blue-300 transition-colors">
                  Tactical HUD & Radar
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('missions')} className="hover:text-blue-300 transition-colors">
                  Mission 001: Rebuilding Signal
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('inventory')} className="hover:text-blue-300 transition-colors">
                  Digital Locker & Badges
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Engineering & Legal */}
          <div className="space-y-2 font-mono text-xs">
            <h4 className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
              Documentation & Legal
            </h4>
            <ul className="space-y-1 text-slate-400 text-[11px]">
              <li>
                <button onClick={() => handleNav('developers')} className="hover:text-blue-300 transition-colors flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-blue-400" />
                  Developer Portal & Tracks
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('web-doc')} className="hover:text-blue-300 transition-colors">
                  Web Documentation Specs (16 Docs)
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('players')} className="hover:text-blue-300 transition-colors">
                  Player Onboarding Guide
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('compliance')} className="hover:text-blue-300 transition-colors flex items-center gap-1 text-amber-400/90 hover:text-amber-300">
                  <ShieldCheck className="w-3 h-3" />
                  Compliance & Regulatory Boundaries
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Regulatory Statement Card */}
        <div className="mt-4 p-3 rounded bg-[#11131a] border border-[#1e2230] font-mono text-[10px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>MANDATORY COMPLIANCE DISCLOSURE:</span>
          </div>
          <p className="leading-relaxed">
            MVP v1.0 is a gameplay and interface prototype. Digital assets, NFT-style items, ODC, marketplace features, gambling-related features, and blockchain integrations are conceptual or roadmap-only unless expressly activated through separate legal, technical, and compliance review.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 border-t border-[#1e2230] pt-3 font-mono">
          <div>
            © {new Date().getFullYear()} Onegodia: Rise of the Digital World™. Concept by One Gregory Onegodian™. All Rights Reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Milestone: MVP v1.0 Foundation</span>
            <span>•</span>
            <span className="text-blue-400">Node: game.onegodian.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
