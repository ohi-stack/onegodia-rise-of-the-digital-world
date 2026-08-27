import React, { useState } from 'react';
import { 
  GAMEPLAY_GRID_MODULES 
} from '../data/gameplayGridData';
import { GameplayGridModule, SystemStatus } from '../types';
import { 
  Plane, 
  Gauge, 
  Compass, 
  Store, 
  Waves, 
  Anchor, 
  Crosshair, 
  Smartphone, 
  Keyboard, 
  Footprints, 
  Flag, 
  Users, 
  ShoppingBag, 
  Coins, 
  Sparkles, 
  Bot, 
  Building2, 
  Cpu, 
  ShieldAlert, 
  Search,
  Filter
} from 'lucide-react';
import { sound } from '../services/audioService';

export const GameplayGridView: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<GameplayGridModule | null>(null);

  // Icon mapping
  const iconMap: { [key: string]: React.FC<{ className?: string }> } = {
    Plane,
    Gauge,
    Compass,
    Store,
    Waves,
    Anchor,
    Crosshair,
    Smartphone,
    Keyboard,
    Footprints,
    Flag,
    Users,
    ShoppingBag,
    Coins,
    Sparkles,
    Bot,
    Building2,
    Cpu
  };

  const statusCategories: { label: string; value: string }[] = [
    { label: 'All Modules (18)', value: 'All' },
    { label: 'Playable Now', value: 'Playable Now' },
    { label: 'Prototype', value: 'Prototype' },
    { label: 'Planned Phase / Roadmap', value: 'Planned Phase / Roadmap' },
    { label: 'Compliance Locked', value: 'Compliance Locked' },
    { label: 'Development Roadmap', value: 'Development Roadmap' },
  ];

  const filteredModules = GAMEPLAY_GRID_MODULES.filter(mod => {
    const matchesFilter = filter === 'All' || mod.status === filter;
    const matchesSearch = mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          mod.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadgeStyle = (status: SystemStatus) => {
    switch (status) {
      case 'Playable Now':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20';
      case 'Prototype':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/20';
      case 'Planned Phase / Roadmap':
        return 'bg-slate-900 text-slate-400 border-slate-700';
      case 'Compliance Locked':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'Development Roadmap':
        return 'bg-blue-950/80 text-blue-300 border-blue-500/50';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 py-2 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">
              SYSTEM ARCHITECTURE & ROADMAP
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Onegodia Gameplay Grid (18 Core Modules)
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Categorized by live prototype status, future Unreal Engine phase, and regulatory compliance boundaries.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-gameplay-grid"
            type="text"
            placeholder="Filter modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#11131a] border border-[#1e2230] rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 items-center">
        <Filter className="w-3 h-3 text-slate-500 mr-1 hidden sm:inline" />
        {statusCategories.map((cat) => (
          <button
            key={cat.value}
            id={`filter-btn-${cat.value.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => {
              sound.playClick();
              setFilter(cat.value);
            }}
            className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
              filter === cat.value
                ? 'bg-blue-600 text-white font-bold shadow-sm shadow-blue-500/25'
                : 'bg-[#11131a] text-slate-400 hover:text-slate-200 hover:bg-[#161821] border border-[#1e2230]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 18-Module Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredModules.map((module) => {
          const Icon = iconMap[module.icon] || Sparkles;
          return (
            <div
              key={module.id}
              id={`grid-module-${module.id}`}
              onClick={() => {
                sound.playClick();
                setSelectedModule(module);
              }}
              className="group p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] hover:border-blue-500/50 hover:bg-[#11131a] transition-all cursor-pointer flex flex-col justify-between space-y-3 shadow-md"
            >
              <div className="space-y-2.5">
                
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#11131a] border border-[#1e2230] flex items-center justify-center text-blue-400 group-hover:border-blue-400 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="font-mono text-[10px] text-slate-500">
                      Module #{module.number.toString().padStart(2, '0')}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold border ${getStatusBadgeStyle(module.status)}`}>
                      {module.status}
                    </span>
                  </div>
                </div>

                {/* Title and category */}
                <div>
                  <div className="text-[10px] font-mono text-blue-400 uppercase font-semibold">
                    {module.category}
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-blue-300 transition-colors font-sans">
                    {module.title}
                  </h3>
                </div>

                {/* Short Description */}
                <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-2">
                  {module.shortDescription}
                </p>

                {/* V1 Status pill */}
                <div className="p-2 rounded-lg bg-[#11131a] border border-[#1e2230] text-[11px] font-mono text-slate-300 space-y-0.5">
                  <div className="text-[9px] text-blue-400 uppercase font-bold">V1 Status:</div>
                  <div className="leading-snug text-slate-300">{module.v1Status}</div>
                </div>
              </div>

              {/* Compliance footer if applicable */}
              {module.complianceNote && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-400/90 pt-1.5 border-t border-[#1e2230]">
                  <ShieldAlert className="w-3 h-3 shrink-0" />
                  <span className="truncate">{module.complianceNote}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Modal for Selected Module */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-[#0c0e14] border border-[#1e2230] rounded-xl shadow-2xl overflow-hidden font-sans">
            
            <div className="bg-[#11131a] px-5 py-3 border-b border-[#1e2230] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] text-blue-400 font-bold px-2 py-0.5 rounded bg-blue-950 border border-blue-700/60">
                  Module #{selectedModule.number.toString().padStart(2, '0')}
                </span>
                <h3 className="font-bold text-slate-100 text-sm">{selectedModule.title}</h3>
              </div>
              <button
                id="close-module-modal-btn"
                onClick={() => setSelectedModule(null)}
                className="text-slate-400 hover:text-white font-mono text-xs px-2 py-0.5 bg-[#161821] rounded"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-3.5 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Current Phase Classification:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadgeStyle(selectedModule.status)}`}>
                  {selectedModule.status}
                </span>
              </div>

              <div className="p-3 bg-[#11131a] rounded-lg border border-[#1e2230] space-y-0.5">
                <div className="text-blue-400 font-bold uppercase text-[10px]">Overview</div>
                <div className="text-slate-200 leading-relaxed font-sans text-xs">{selectedModule.shortDescription}</div>
              </div>

              <div className="p-3 bg-[#11131a] rounded-lg border border-blue-900/40 space-y-0.5">
                <div className="text-cyan-400 font-bold uppercase text-[10px]">MVP v1.0 Scope</div>
                <div className="text-slate-200 leading-relaxed font-sans text-xs">{selectedModule.v1Status}</div>
              </div>

              <div className="p-3 bg-[#11131a] rounded-lg border border-[#1e2230] space-y-0.5">
                <div className="text-blue-400 font-bold uppercase text-[10px]">Unreal Engine / Future Expansion</div>
                <div className="text-slate-200 leading-relaxed font-sans text-xs">{selectedModule.futureExpansionNote}</div>
              </div>

              {selectedModule.complianceNote && (
                <div className="p-3 bg-amber-950/30 rounded-lg border border-amber-500/30 text-amber-300 space-y-0.5">
                  <div className="text-amber-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                    <ShieldAlert className="w-3 h-3" />
                    Regulatory & Compliance Notice
                  </div>
                  <div className="text-[11px] leading-relaxed font-sans">{selectedModule.complianceNote}</div>
                </div>
              )}
            </div>

            <div className="bg-[#11131a] px-5 py-2.5 border-t border-[#1e2230] flex justify-end">
              <button
                onClick={() => setSelectedModule(null)}
                className="px-3 py-1 rounded bg-[#161821] hover:bg-[#1e2230] text-slate-200 text-xs font-mono"
              >
                Close Spec
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
