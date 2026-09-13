import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  History,
  Shield,
  Swords,
  Zap,
  Flame,
  Crosshair,
  Terminal,
  Search,
  ArrowDown,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Clock,
  ChevronRight
} from 'lucide-react';
import { sound } from '../../services/audioService';

export type CombatHistoryCategory =
  | 'all'
  | 'attack'
  | 'damage_taken'
  | 'mitigation'
  | 'critical'
  | 'override'
  | 'kill'
  | 'system';

export interface CombatHistoryEvent {
  id: string;
  timestamp: string;      // e.g. '19:42:08'
  relativeTime: string;   // e.g. 'T+14s'
  tick: number;
  actor: string;          // e.g. 'Operative Alpha', 'Plasma Battery', 'Rogue Drone #04'
  target: string;         // e.g. 'Rogue Drone Swarm', 'Phase-Shield Matrix'
  category: 'attack' | 'damage_taken' | 'mitigation' | 'critical' | 'override' | 'kill' | 'system';
  action: string;         // e.g. 'Plasma Repeater Burst', 'Kinetic Rail Penetration'
  damageValue?: number;
  damageType?: 'Kinetic' | 'Thermal' | 'EMP' | 'Nanite' | 'Composite';
  mitigatedValue?: number;
  message: string;
}

interface CombatHistoryLogProps {
  history: CombatHistoryEvent[];
  onClearHistory: () => void;
  scenarioName: string;
}

export const CombatHistoryLog: React.FC<CombatHistoryLogProps> = ({
  history,
  onClearHistory,
  scenarioName
}) => {
  const [categoryFilter, setCategoryFilter] = useState<CombatHistoryCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Filtered entries
  const filteredEvents = useMemo(() => {
    return history.filter((event) => {
      if (categoryFilter !== 'all' && event.category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuery =
          event.actor.toLowerCase().includes(query) ||
          event.target.toLowerCase().includes(query) ||
          event.action.toLowerCase().includes(query) ||
          event.message.toLowerCase().includes(query) ||
          (event.damageType && event.damageType.toLowerCase().includes(query)) ||
          event.relativeTime.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [history, categoryFilter, searchQuery]);

  // Auto-scroll when new events arrive
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [history.length, autoScroll]);

  // Aggregate statistics for the log footer
  const stats = useMemo(() => {
    let totalDealt = 0;
    let totalMitigated = 0;
    let criticalHits = 0;
    let kills = 0;

    for (const ev of history) {
      if (ev.category === 'attack' || ev.category === 'critical' || ev.category === 'override') {
        totalDealt += ev.damageValue || 0;
      }
      if (ev.category === 'mitigation') {
        totalMitigated += ev.mitigatedValue || 0;
      }
      if (ev.category === 'critical') {
        criticalHits += 1;
      }
      if (ev.category === 'kill') {
        kills += 1;
      }
    }

    return { totalDealt, totalMitigated, criticalHits, kills };
  }, [history]);

  const getCategoryBadge = (category: CombatHistoryEvent['category']) => {
    switch (category) {
      case 'attack':
        return {
          label: 'DAMAGE DEALT',
          icon: Swords,
          badgeStyle: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50',
          dotColor: 'bg-cyan-400'
        };
      case 'damage_taken':
        return {
          label: 'DAMAGE TAKEN',
          icon: Flame,
          badgeStyle: 'bg-rose-950/80 text-rose-300 border-rose-500/50',
          dotColor: 'bg-rose-500'
        };
      case 'mitigation':
        return {
          label: 'DEFLECTED',
          icon: Shield,
          badgeStyle: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50',
          dotColor: 'bg-emerald-400'
        };
      case 'critical':
        return {
          label: 'CRITICAL HIT',
          icon: Zap,
          badgeStyle: 'bg-yellow-950/80 text-yellow-300 border-yellow-500/50 font-bold',
          dotColor: 'bg-yellow-400'
        };
      case 'override':
        return {
          label: 'OVERRIDE',
          icon: Zap,
          badgeStyle: 'bg-purple-950/80 text-purple-300 border-purple-500/50 font-bold',
          dotColor: 'bg-purple-400'
        };
      case 'kill':
        return {
          label: 'ELIMINATED',
          icon: Crosshair,
          badgeStyle: 'bg-red-950/90 text-red-200 border-red-500 font-extrabold shadow-[0_0_8px_rgba(239,68,68,0.5)]',
          dotColor: 'bg-red-400'
        };
      case 'system':
      default:
        return {
          label: 'SYSTEM',
          icon: Terminal,
          badgeStyle: 'bg-slate-900 text-slate-300 border-slate-700',
          dotColor: 'bg-slate-400'
        };
    }
  };

  const categories: { key: CombatHistoryCategory; label: string; count: number }[] = [
    { key: 'all', label: 'All Events', count: history.length },
    { key: 'attack', label: 'Damage Dealt', count: history.filter((e) => e.category === 'attack').length },
    { key: 'damage_taken', label: 'Damage Taken', count: history.filter((e) => e.category === 'damage_taken').length },
    { key: 'mitigation', label: 'Mitigations', count: history.filter((e) => e.category === 'mitigation').length },
    { key: 'critical', label: 'Criticals', count: history.filter((e) => e.category === 'critical').length },
    { key: 'override', label: 'Overrides', count: history.filter((e) => e.category === 'override').length },
    { key: 'kill', label: 'Eliminations', count: history.filter((e) => e.category === 'kill').length }
  ];

  return (
    <section
      id="combat-history-log-panel"
      className="p-4 sm:p-5 rounded-xl bg-[#090b10] border border-cyan-900 shadow-[0_0_25px_rgba(0,255,255,0.06)] relative overflow-hidden"
    >
      <div className="absolute inset-0 gamer-grid opacity-15 pointer-events-none z-0"></div>
      <div className="scanline-overlay"></div>

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-cyan-950/90">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#0ff]"></span>
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              COMBAT HISTORY LOG • SIMULATED ACTION & DAMAGE FEED
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/90 text-cyan-300 border border-cyan-700/60">
              {filteredEvents.length} / {history.length} Events
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
            Chronological Unit Action & Damage Telemetry
          </h3>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Active theater: <span className="text-cyan-300">{scenarioName}</span> • Real-time event log tracking kinetic, thermal, and EMP damage vectors.
          </p>
        </div>

        {/* Action Controls: Search, AutoScroll, Clear */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative min-w-[190px] sm:min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-cyan-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="combat-history-search"
              type="text"
              placeholder="Search action, unit, damage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/70 border border-cyan-900/70 rounded-lg pl-8 pr-3 py-1 text-xs font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_12px_rgba(0,255,255,0.25)] transition-all"
            />
          </div>

          {/* Auto-scroll button */}
          <button
            id="combat-history-autoscroll-toggle"
            onClick={() => {
              sound.playClick();
              setAutoScroll(!autoScroll);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-semibold border transition-all ${
              autoScroll
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.2)]'
                : 'bg-black/60 text-slate-400 border-cyan-950 hover:text-cyan-300'
            }`}
            title="Toggle automatic downward scrolling on new events"
          >
            <ArrowDown className={`w-3.5 h-3.5 ${autoScroll ? 'animate-bounce' : ''}`} />
            <span>Auto-Scroll {autoScroll ? 'ON' : 'OFF'}</span>
          </button>

          {/* Clear Log Button */}
          <button
            id="combat-history-clear-btn"
            onClick={() => {
              sound.playClick();
              onClearHistory();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono text-slate-400 hover:text-rose-300 bg-black/60 border border-cyan-950 hover:border-rose-800 transition-colors"
            title="Reset Combat History Log"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="relative z-10 flex flex-wrap items-center gap-1.5 py-2.5 border-b border-cyan-950/60 font-mono text-xs">
        <span className="text-[10px] text-cyan-500 uppercase font-bold flex items-center gap-1 mr-1">
          <Filter className="w-3 h-3" /> FILTER:
        </span>
        {categories.map((cat) => (
          <button
            key={cat.key}
            id={`filter-history-${cat.key}`}
            onClick={() => {
              sound.playClick();
              setCategoryFilter(cat.key);
            }}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all flex items-center gap-1.5 ${
              categoryFilter === cat.key
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_#0ff]'
                : 'bg-black/60 text-slate-400 hover:text-cyan-300 border border-cyan-950 hover:border-cyan-800'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`px-1 py-0.2 rounded text-[9px] ${
                categoryFilter === cat.key ? 'bg-black text-cyan-300 font-bold' : 'bg-slate-900 text-slate-400'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Column Headers */}
      <div className="relative z-10 hidden sm:grid sm:grid-cols-12 gap-2 px-3 py-1.5 bg-black/80 border-b border-cyan-950 text-[10px] font-mono uppercase tracking-wider text-cyan-500/80 font-bold">
        <div className="sm:col-span-2">Time / Tick</div>
        <div className="sm:col-span-2">Action Type</div>
        <div className="sm:col-span-3">Actor ➔ Target</div>
        <div className="sm:col-span-2">Damage / Vector</div>
        <div className="sm:col-span-3">Telemetry Details</div>
      </div>

      {/* Scrollable Event Feed Container */}
      <div
        ref={logContainerRef}
        id="combat-history-scroll-container"
        className="relative z-10 max-h-80 sm:max-h-96 overflow-y-auto space-y-1.5 p-1 font-mono text-xs scrollbar-thin select-text"
        style={{ scrollBehavior: 'smooth' }}
      >
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            <Terminal className="w-6 h-6 mx-auto mb-2 text-cyan-600 opacity-60" />
            No combat events match current criteria ({categoryFilter}
            {searchQuery ? ` & "${searchQuery}"` : ''}).
          </div>
        ) : (
          filteredEvents.map((event) => {
            const meta = getCategoryBadge(event.category);
            const CategoryIcon = meta.icon;

            return (
              <div
                key={event.id}
                id={`combat-event-row-${event.id}`}
                className="p-2.5 rounded-lg bg-black/60 hover:bg-cyan-950/20 border border-slate-900 hover:border-cyan-800/80 transition-all flex flex-col sm:grid sm:grid-cols-12 gap-2 items-start sm:items-center text-[11px] leading-snug group"
              >
                {/* Col 1: Time and Tick */}
                <div className="sm:col-span-2 flex sm:flex-col items-center sm:items-start gap-1.5 sm:gap-0.5 text-slate-400">
                  <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold">
                    <Clock className="w-3 h-3 text-cyan-500" />
                    <span>{event.timestamp}</span>
                  </div>
                  <div className="text-[9px] text-slate-500">
                    {event.relativeTime} • Tick #{event.tick}
                  </div>
                </div>

                {/* Col 2: Category Badge */}
                <div className="sm:col-span-2 flex items-center">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${meta.badgeStyle}`}
                  >
                    <CategoryIcon className="w-3 h-3" />
                    <span>{meta.label}</span>
                  </span>
                </div>

                {/* Col 3: Actor ➔ Target */}
                <div className="sm:col-span-3 text-slate-200 truncate w-full">
                  <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1 truncate">
                    <span className="truncate">{event.actor}</span>
                    <ChevronRight className="w-3 h-3 text-cyan-600 shrink-0" />
                    <span className="text-cyan-400 truncate">{event.target}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">{event.action}</div>
                </div>

                {/* Col 4: Damage / Value & Vector */}
                <div className="sm:col-span-2 w-full sm:w-auto flex flex-wrap sm:flex-col items-start gap-1 sm:gap-0.5">
                  {event.damageValue !== undefined && event.damageValue > 0 && (
                    <span
                      className={`font-black text-xs ${
                        event.category === 'damage_taken'
                          ? 'text-rose-400'
                          : event.category === 'critical'
                          ? 'text-yellow-400'
                          : event.category === 'kill'
                          ? 'text-red-400'
                          : 'text-cyan-300'
                      }`}
                    >
                      {event.category === 'damage_taken' ? '-' : '+'}
                      {event.damageValue} DMG
                    </span>
                  )}
                  {event.mitigatedValue !== undefined && event.mitigatedValue > 0 && (
                    <span className="text-emerald-400 text-[10px] font-semibold bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-800/40">
                      -{event.mitigatedValue} Mitigated
                    </span>
                  )}
                  {event.damageType && (
                    <span className="text-[9px] text-slate-400 uppercase tracking-wider">
                      [{event.damageType}]
                    </span>
                  )}
                </div>

                {/* Col 5: Description & Telemetry */}
                <div className="sm:col-span-3 text-slate-300 text-[11px] leading-relaxed break-words w-full">
                  {event.message}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Metrics Summary Bar */}
      <div className="relative z-10 mt-3 pt-3 border-t border-cyan-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">AGGREGATE FIREPOWER:</span>
            <span className="text-cyan-300 font-bold">{stats.totalDealt.toLocaleString()} DMG</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">DEFLECTED:</span>
            <span className="text-emerald-400 font-bold">{stats.totalMitigated.toLocaleString()} DMG</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">CRITICAL HITS:</span>
            <span className="text-yellow-400 font-bold">{stats.criticalHits}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">HOSTILES NEUTRALIZED:</span>
            <span className="text-rose-400 font-bold">{stats.kills}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-cyan-600">
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>BUFFER RETENTION: 100 CYCLIC RECORDS</span>
        </div>
      </div>
    </section>
  );
};
