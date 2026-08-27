import React, { useState } from 'react';
import { 
  Package, 
  Sparkles, 
  Key, 
  Radio, 
  Coins, 
  ShieldAlert, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { PlayerProgress, InventoryItem } from '../types';
import { sound } from '../services/audioService';

interface InventoryViewProps {
  progress: PlayerProgress;
  setProgress: React.Dispatch<React.SetStateAction<PlayerProgress>>;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ progress, setProgress }) => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(progress.inventory[0] || null);

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'Foundational':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'Prototype':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Key': return Key;
      case 'Radio': return Radio;
      case 'Sparkles': return Sparkles;
      default: return Package;
    }
  };

  return (
    <div className="space-y-6 py-2 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">
              SIMULATED DIGITAL LOCKER & ARCHIVE
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Player Assets & Collectibles Archive
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Simulated off-chain storage for mission rewards, access credentials, and Onegodia Data Fragments.
          </p>
        </div>

        {/* Currency summary pills */}
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-lg bg-[#11131a] border border-amber-500/40 flex items-center gap-2 font-mono text-xs">
            <div className="w-5 h-5 rounded bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
              ◈
            </div>
            <div>
              <div className="text-[9px] text-slate-400">Prototype Credits</div>
              <div className="text-xs font-bold text-amber-300">{progress.credits} CR</div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#11131a] border border-[#1e2230] flex items-center gap-2 font-mono text-xs" title="Roadmap Only">
            <div className="w-5 h-5 rounded bg-[#0c0e14] text-slate-500 font-bold flex items-center justify-center text-xs">
              Ω
            </div>
            <div>
              <div className="text-[9px] text-slate-500">ODC Token</div>
              <div className="text-xs font-bold text-slate-400">0.00 <span className="text-[9px] text-amber-400 font-normal">[Locked]</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Non-Financial Disclaimer */}
      <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 flex items-start gap-2.5 text-amber-200 text-xs font-mono">
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-amber-300 uppercase text-[11px]">[SIMULATED NON-FINANCIAL ECONOMY]:</span>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            All balances, credits, keycards, and digital fragments in MVP v1.0 are simulated local game variables. There is NO blockchain connection, NO real-world monetary value, NO NFT minting, and NO cryptocurrency trading active.
          </p>
        </div>
      </div>

      {/* Main Locker Grid & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Items List (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="font-bold text-slate-200 uppercase">Archive Items ({progress.inventory.length})</span>
            <span>Capacity: 3 / 24 Slots</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {progress.inventory.map((item) => {
              const Icon = getIcon(item.iconName);
              const isSelected = selectedItem?.id === item.id;
              return (
                <button
                  key={item.id}
                  id={`inv-item-${item.id}`}
                  onClick={() => {
                    sound.playClick();
                    setSelectedItem(item);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2.5 ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500/80 text-blue-200 shadow-md'
                      : 'bg-[#0c0e14] border-[#1e2230] hover:border-slate-600 text-slate-300 hover:bg-[#11131a]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-8 h-8 rounded-lg bg-[#11131a] border border-[#1e2230] flex items-center justify-center text-blue-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold border ${getRarityBadge(item.rarity)}`}>
                      {item.rarity}
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono text-blue-400">{item.type}</div>
                    <h3 className="font-bold text-xs text-slate-100 font-sans">{item.name}</h3>
                  </div>

                  <div className="text-[11px] font-sans text-slate-400 line-clamp-2">
                    {item.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Item 3D Inspector Panel (Right col) */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase font-bold">
            Item Telemetry & Data
          </div>

          {selectedItem ? (
            <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-3 font-mono text-xs shadow-xl">
              
              {/* Item Graphic */}
              <div className="w-full aspect-video rounded-lg bg-[#050608] border border-[#1e2230] flex flex-col items-center justify-center p-3 relative overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/60 flex items-center justify-center text-blue-400 shadow-md">
                  {React.createElement(getIcon(selectedItem.iconName), { className: 'w-6 h-6' })}
                </div>
                <span className="text-[9px] text-blue-400 mt-2 font-bold uppercase">{selectedItem.rarity} RARITY</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase">{selectedItem.type}</span>
                <h3 className="text-sm font-bold text-slate-100 font-sans">{selectedItem.name}</h3>
              </div>

              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {selectedItem.description}
              </p>

              {/* Metadata attributes */}
              {selectedItem.metadata && (
                <div className="p-2.5 bg-[#11131a] rounded-lg border border-[#1e2230] space-y-1.5">
                  <div className="text-[9px] text-blue-400 font-bold uppercase">Item Metadata</div>
                  {Object.entries(selectedItem.metadata).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">{key}:</span>
                      <span className="text-slate-200 font-bold">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-[#1e2230] flex items-center justify-between text-[10px] text-slate-500">
                <span>Acquired: {selectedItem.acquiredDate || 'MVP v1.0'}</span>
                <span className="text-blue-400">Off-Chain Record</span>
              </div>

            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[#0c0e14] border border-[#1e2230] text-center text-slate-500 font-mono text-xs">
              Select an item to inspect telemetry.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
