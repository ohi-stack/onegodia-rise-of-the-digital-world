import React, { useState } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';

interface ComplianceBannerProps {
  compact?: boolean;
}

export const ComplianceBanner: React.FC<ComplianceBannerProps> = ({ compact = false }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside 
      aria-label="Gameplay Prototype Compliance Notice"
      className="bg-slate-900/90 dark:bg-[#0b0e14]/90 border-b border-slate-800/80 px-4 py-2 text-slate-300 text-xs backdrop-blur-md transition-all"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20 shrink-0">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span>Prototype Notice</span>
          </span>
          <p className="text-[12px] text-slate-300 dark:text-slate-400 leading-normal truncate sm:text-clip">
            Onegodia MVP v1.0 is an active gameplay and interface prototype. Simulated economy and token assets remain strictly off-chain and roadmap-only.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!compact && (
            <div className="hidden md:flex items-center gap-1.5 text-slate-400 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800/50 border border-slate-700/50">
              <Info className="w-3 h-3 text-cyan-400" />
              <span>Safe Sandbox Mode</span>
            </div>
          )}
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
            aria-label="Dismiss banner"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
