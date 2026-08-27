import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';

interface ComplianceBannerProps {
  compact?: boolean;
}

export const ComplianceBanner: React.FC<ComplianceBannerProps> = ({ compact = false }) => {
  return (
    <aside 
      aria-label="MVP v1.0 Regulatory & Technical Compliance Notice"
      className="bg-[#0e0c06] border-b border-amber-500/25 px-4 py-2 text-amber-200/90 text-xs backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-snug font-mono text-[11px]">
            <span className="font-semibold text-amber-300 uppercase tracking-wider mr-1.5">[MVP v1.0 NOTICE]:</span>
            MVP v1.0 is a gameplay and interface prototype. Digital assets, NFT-style items, ODC, marketplace features, gambling-related features, and blockchain integrations are conceptual or roadmap-only unless expressly activated through separate legal, technical, and compliance review.
          </p>
        </div>
        {!compact && (
          <div className="hidden lg:flex items-center gap-1.5 text-amber-400/80 hover:text-amber-300 font-mono text-[10px] whitespace-nowrap bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
            <Info className="w-3 h-3" />
            <span>Off-Chain Prototype Only</span>
          </div>
        )}
      </div>
    </aside>
  );
};
