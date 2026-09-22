import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Layers,
  Crosshair,
  Map as MapIcon,
  FileText,
  Terminal,
  Users,
  ShieldCheck,
  Package,
  Coins,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  Radio,
  Sun,
  Moon,
  GitBranch,
  Play,
  ChevronDown,
  LayoutGrid,
  Search,
  ExternalLink,
  ChevronRight,
  Shield,
  ShieldAlert,
  LogIn,
  LogOut,
  Cloud
} from 'lucide-react';
import { NavigationTab, PlayerProgress } from '../types';
import { sound } from '../services/audioService';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  progress: PlayerProgress;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  shortLabel?: string;
  icon: React.FC<{ className?: string }>;
  description?: string;
  badge?: string;
  badgeColor?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, progress }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'systems' | 'economy' | 'intel' | null>(null);
  const [isCommandModalOpen, setIsCommandModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const { theme, toggleTheme } = useTheme();
  const { user, signInWithGoogle, signOut, loading: authLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const commandInputRef = useRef<HTMLInputElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard navigation & shortcuts (ESC to close, Ctrl+K or Cmd+K to open All Hubs matrix)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsCommandModalOpen(false);
        setMobileMenuOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandModalOpen((prev) => !prev);
        setActiveDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-focus search input when command modal opens
  useEffect(() => {
    if (isCommandModalOpen) {
      setTimeout(() => {
        commandInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isCommandModalOpen]);

  const handleTabClick = (tab: NavigationTab) => {
    sound.playClick();
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setIsCommandModalOpen(false);
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  // 1. Direct Nav Items (Accessible with 1-click on Desktop)
  const directNavItems: NavItem[] = [
    { id: 'home', label: 'Home', shortLabel: 'Home', icon: Radio },
    { id: 'play', label: 'Play Stamford', shortLabel: 'Play', icon: Play, badge: 'Live' },
    { id: 'map', label: 'World Map', shortLabel: 'Map', icon: MapIcon },
    { id: 'missions', label: 'Missions', shortLabel: 'Missions', icon: Sparkles },
    { id: 'prototype', label: 'Prototype', shortLabel: 'Prototype', icon: Gamepad2 }
  ];

  // 2. Systems Dropdown Items
  const systemsItems: NavItem[] = [
    {
      id: 'tactical-hud',
      label: 'Tactical HUD',
      icon: Crosshair,
      description: 'Real-time threat scanner, drone radar & mission telemetry',
      badge: 'Interactive',
      badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-700/50'
    },
    {
      id: 'gameplay',
      label: 'Gameplay View',
      icon: Gamepad2,
      description: 'Core combat controls, vehicle driving & player physics',
      badge: 'Engine',
      badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-700/50'
    },
    {
      id: 'gameplay-grid',
      label: 'Gameplay Grid',
      icon: Layers,
      description: '8 modular game system architectures and technical matrices',
      badge: 'Systems',
      badgeColor: 'text-indigo-400 bg-indigo-950/80 border-indigo-700/50'
    },
    {
      id: 'mvp-v1',
      label: 'MVP v1.0 Hub',
      icon: Terminal,
      description: 'Verified scope, deliverable specifications & engine contracts',
      badge: 'Scope',
      badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-700/50'
    }
  ];

  // 3. Economy Dropdown Items
  const economyItems: NavItem[] = [
    {
      id: 'inventory',
      label: 'Inventory & Rewards',
      icon: Package,
      description: 'Player loadout, weapons, keycards & ancient relic shards',
      badge: 'Loadout',
      badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-700/50'
    },
    {
      id: 'digital-asset-economy',
      label: 'Digital Economy',
      icon: Coins,
      description: 'ODC roadmap, token ledger architecture & game asset compliance',
      badge: 'Ledger',
      badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-700/50'
    }
  ];

  // 4. Intel & Project Dropdown Items
  const intelItems: NavItem[] = [
    {
      id: 'development-status',
      label: 'Dev Status',
      icon: GitBranch,
      description: 'Sprint velocity, build pipeline progress & milestone roadmap',
      badge: 'Pipeline',
      badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-700/50'
    },
    {
      id: 'developers',
      label: 'Developers Hub',
      icon: Terminal,
      description: 'Full-stack engineering stack, API schemas & technical specifications',
      badge: 'Code',
      badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-700/50'
    },
    {
      id: 'web-doc',
      label: 'Web Documentation',
      icon: FileText,
      description: 'Canonical lore, system whitepaper & design principles',
      badge: 'Docs',
      badgeColor: 'text-blue-400 bg-blue-950/80 border-blue-700/50'
    },
    {
      id: 'players',
      label: 'Operatives & Players',
      icon: Users,
      description: 'Agent roster, combat telemetry, leaderboards & ranks',
      badge: 'Network',
      badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-700/50'
    },
    {
      id: 'community',
      label: 'Community Hub',
      icon: Users,
      description: 'Official channels, discord, live operative broadcasts & events',
      badge: 'Social',
      badgeColor: 'text-pink-400 bg-pink-950/80 border-pink-700/50'
    },
    {
      id: 'compliance',
      label: 'Compliance & Legal',
      icon: ShieldCheck,
      description: 'Regulatory framework, disclaimer verification & IP protection',
      badge: 'Verified',
      badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-700/50'
    },
    {
      id: 'media',
      label: 'Media Kit & Lore',
      icon: Sparkles,
      description: 'Visual brand assets, high-res wallpapers & audio showcases',
      badge: 'Media',
      badgeColor: 'text-violet-400 bg-violet-950/80 border-violet-700/50'
    },
    {
      id: 'admin',
      label: 'Admin Command Center',
      icon: ShieldAlert,
      description: 'Level 5 Master oversight, Firestore progression editor & economy tuning',
      badge: 'Admin',
      badgeColor: 'text-rose-400 bg-rose-950/80 border-rose-700/50'
    }
  ];

  // All 18 hubs aggregated for the Command Center modal
  const allHubs: { category: string; items: NavItem[] }[] = [
    {
      category: 'Core Gameplay & World',
      items: [
        { id: 'home', label: 'Home Terminal', icon: Radio, description: 'Command center overview & project synopsis' },
        { id: 'play', label: 'Play Stamford V1', icon: Play, description: 'Direct 2D playable sandbox & vehicular engine', badge: 'Playable' },
        { id: 'prototype', label: 'Web Prototype', icon: Gamepad2, description: 'Interactive browser simulator & mission 001', badge: 'Live' },
        { id: 'map', label: 'World Map & GIS', icon: MapIcon, description: 'Sector 7 radar grid & Stamford real-world map', badge: 'Nodes' },
        { id: 'missions', label: 'Mission Log', icon: Sparkles, description: 'Active sector directives & objective tracking', badge: 'Directives' }
      ]
    },
    {
      category: 'Game Simulation & Systems',
      items: systemsItems
    },
    {
      category: 'Economy & Loadout',
      items: economyItems
    },
    {
      category: 'Project, Intel & Community',
      items: intelItems
    }
  ];

  const filteredHubs = allHubs.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(group => group.items.length > 0);

  // Active status check for dropdown parents
  const isSystemsActive = systemsItems.some((item) => item.id === activeTab);
  const isEconomyActive = economyItems.some((item) => item.id === activeTab);
  const isIntelActive = intelItems.some((item) => item.id === activeTab);

  return (
    <header className="sticky top-0 z-40 bg-[#080b11]/95 border-b border-cyan-500/20 backdrop-blur-xl transition-colors">
      {/* Ambient Top Glow Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 opacity-70" />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 gap-2">
          
          {/* Brand Logo & Node Indicator */}
          <div className="flex items-center shrink-0">
            <button
              id="brand-logo-btn"
              onClick={() => handleTabClick('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/25 group-hover:shadow-cyan-400/40 transition-all">
                <div className="w-full h-full bg-[#070a10] rounded-[7px] flex items-center justify-center">
                  <span className="font-mono font-black text-sm bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    Ω
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black tracking-tight text-white text-xs sm:text-sm group-hover:text-cyan-300 transition-colors">
                    Onegodia<span className="text-cyan-400">:</span> Rise
                  </span>
                  <span className="hidden sm:inline font-bold text-slate-400 text-xs">
                    of the Digital World
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[9px] font-mono">
                  <span className="px-1 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-600/40 font-semibold uppercase tracking-wider">
                    V1 Playable
                  </span>
                  <span className="text-slate-500 hidden 2xl:inline">
                    • game.onegodian.com
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Menu (Structured & Compact to Fit Any Screen) */}
          <nav ref={dropdownRef} className="hidden lg:flex items-center gap-1 text-xs font-mono">
            {/* Direct Core Tabs */}
            {directNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isPlay = item.id === 'play';

              if (isPlay) {
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleTabClick(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shadow-md ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-emerald-500/40 ring-1 ring-emerald-300'
                        : 'bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 hover:text-white shadow-emerald-950/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                    <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-cyan-300 border border-cyan-500/60 shadow-sm shadow-cyan-500/20 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#131926] border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.shortLabel || item.label}</span>
                </button>
              );
            })}

            {/* Separator */}
            <div className="w-px h-4 bg-slate-800 mx-0.5" />

            {/* Dropdown: Systems ▾ */}
            <div className="relative">
              <button
                type="button"
                id="nav-dropdown-systems-btn"
                onClick={() => setActiveDropdown(activeDropdown === 'systems' ? null : 'systems')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  isSystemsActive
                    ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/60 font-bold'
                    : activeDropdown === 'systems'
                    ? 'bg-[#151c2a] text-slate-200 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131926] border border-transparent'
                }`}
                aria-expanded={activeDropdown === 'systems'}
              >
                <Layers className={`w-3.5 h-3.5 ${isSystemsActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>Systems</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'systems' ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`} />
              </button>

              {activeDropdown === 'systems' && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-[#0a0e17]/98 border border-cyan-500/30 p-2 shadow-2xl shadow-black/80 backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800/80 mb-1 flex items-center justify-between">
                    <span>Engine & Simulation</span>
                    <span className="text-cyan-400">{systemsItems.length} Modules</span>
                  </div>
                  <div className="space-y-1">
                    {systemsItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleTabClick(item.id)}
                          className={`w-full text-left p-2 rounded-lg flex items-start gap-2.5 transition-all group ${
                            isActive
                              ? 'bg-cyan-950/80 border border-cyan-500/50 text-white'
                              : 'hover:bg-[#121826] text-slate-300 border border-transparent'
                          }`}
                        >
                          <div className={`p-1.5 rounded-md mt-0.5 shrink-0 ${isActive ? 'bg-cyan-500 text-slate-950' : 'bg-[#172030] text-slate-400 group-hover:text-cyan-300'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold ${isActive ? 'text-cyan-300' : 'text-slate-200 group-hover:text-white'}`}>
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold border ${item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown: Economy ▾ */}
            <div className="relative">
              <button
                type="button"
                id="nav-dropdown-economy-btn"
                onClick={() => setActiveDropdown(activeDropdown === 'economy' ? null : 'economy')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  isEconomyActive
                    ? 'bg-amber-950/70 text-amber-300 border border-amber-500/60 font-bold'
                    : activeDropdown === 'economy'
                    ? 'bg-[#151c2a] text-slate-200 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131926] border border-transparent'
                }`}
                aria-expanded={activeDropdown === 'economy'}
              >
                <Coins className={`w-3.5 h-3.5 ${isEconomyActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>Economy</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'economy' ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} />
              </button>

              {activeDropdown === 'economy' && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-xl bg-[#0a0e17]/98 border border-amber-500/30 p-2 shadow-2xl shadow-black/80 backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800/80 mb-1 flex items-center justify-between">
                    <span>Assets & Economy</span>
                    <span className="text-amber-400">{economyItems.length} Subsystems</span>
                  </div>
                  <div className="space-y-1">
                    {economyItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleTabClick(item.id)}
                          className={`w-full text-left p-2 rounded-lg flex items-start gap-2.5 transition-all group ${
                            isActive
                              ? 'bg-amber-950/80 border border-amber-500/50 text-white'
                              : 'hover:bg-[#121826] text-slate-300 border border-transparent'
                          }`}
                        >
                          <div className={`p-1.5 rounded-md mt-0.5 shrink-0 ${isActive ? 'bg-amber-500 text-slate-950' : 'bg-[#172030] text-slate-400 group-hover:text-amber-300'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold ${isActive ? 'text-amber-300' : 'text-slate-200 group-hover:text-white'}`}>
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold border ${item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown: Intel & Dev ▾ */}
            <div className="relative">
              <button
                type="button"
                id="nav-dropdown-intel-btn"
                onClick={() => setActiveDropdown(activeDropdown === 'intel' ? null : 'intel')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  isIntelActive
                    ? 'bg-blue-950/70 text-blue-300 border border-blue-500/60 font-bold'
                    : activeDropdown === 'intel'
                    ? 'bg-[#151c2a] text-slate-200 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#131926] border border-transparent'
                }`}
                aria-expanded={activeDropdown === 'intel'}
              >
                <Terminal className={`w-3.5 h-3.5 ${isIntelActive ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>Intel & Dev</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'intel' ? 'rotate-180 text-blue-400' : 'text-slate-500'}`} />
              </button>

              {activeDropdown === 'intel' && (
                <div className="absolute top-full right-0 mt-2 w-80 rounded-xl bg-[#0a0e17]/98 border border-blue-500/30 p-2 shadow-2xl shadow-black/80 backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-800/80 mb-1 flex items-center justify-between">
                    <span>Project Specs & Operatives</span>
                    <span className="text-blue-400">{intelItems.length} Hubs</span>
                  </div>
                  <div className="space-y-1 max-h-80 overflow-y-auto pr-0.5">
                    {intelItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleTabClick(item.id)}
                          className={`w-full text-left p-2 rounded-lg flex items-start gap-2.5 transition-all group ${
                            isActive
                              ? 'bg-blue-950/80 border border-blue-500/50 text-white'
                              : 'hover:bg-[#121826] text-slate-300 border border-transparent'
                          }`}
                        >
                          <div className={`p-1.5 rounded-md mt-0.5 shrink-0 ${isActive ? 'bg-blue-500 text-slate-950' : 'bg-[#172030] text-slate-400 group-hover:text-blue-300'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold ${isActive ? 'text-blue-300' : 'text-slate-200 group-hover:text-white'}`}>
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold border ${item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-sans line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Command Center / All Hubs Matrix Trigger */}
            <button
              type="button"
              id="all-hubs-matrix-btn"
              onClick={() => {
                sound.playClick();
                setIsCommandModalOpen(true);
                setActiveDropdown(null);
              }}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#111624] hover:bg-[#172033] border border-[#212c44] hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all font-mono text-xs ml-1"
              title="Open Command Matrix (Ctrl+K)"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xl:inline">Hubs</span>
              <kbd className="hidden 2xl:inline-block px-1 py-0.2 rounded bg-[#0b0e17] border border-slate-700 text-[9px] text-slate-500">
                ⌘K
              </kbd>
            </button>
          </nav>

          {/* Right Header Utilities (Credits, Audio, Theme, Quick Play) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Credits & Currency Wallet */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#101420] border border-[#1d263b] rounded-lg font-mono text-xs shadow-inner">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <span className="text-[11px]">◈</span>
                <span>{progress.credits}</span>
                <span className="text-[9px] text-slate-500 font-normal">CR</span>
              </div>
              <div className="w-px h-3 bg-slate-800" />
              <div className="flex items-center gap-1 text-slate-400 text-[10px]" title="ODC Economy token ledger is roadmap only">
                <span className="text-cyan-400 font-medium">0.00</span>
                <span>ODC</span>
              </div>
            </div>

            {/* Theme Toggle Button */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to Light mode' : 'Switch to Dark mode'}
              className="p-1.5 rounded-lg bg-[#101420] border border-[#1d263b] text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500" />
              )}
            </button>

            {/* Audio Toggle Button */}
            <button
              id="audio-toggle-btn"
              onClick={toggleSound}
              aria-label={isMuted ? 'Unmute game audio' : 'Mute game audio'}
              className="p-1.5 rounded-lg bg-[#101420] border border-[#1d263b] text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors"
              title={isMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            {/* Admin Command Dashboard Quick Link */}
            <button
              type="button"
              id="quick-admin-dashboard-btn"
              onClick={() => handleTabClick('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-mono text-xs transition-all ${
                activeTab === 'admin'
                  ? 'bg-rose-950/90 border-rose-500 text-rose-300 font-bold shadow-md shadow-rose-950/50'
                  : 'bg-[#101420] border-[#1d263b] hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300'
              }`}
              title="Open Level 5 Admin Command Center"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden xl:inline">Admin</span>
            </button>

            {/* Firebase Auth & Cloud Sync Control */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    type="button"
                    id="user-auth-menu-btn"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-1.5 p-1 sm:px-2 sm:py-1 rounded-lg bg-[#101524] border border-cyan-500/40 hover:border-cyan-400 text-xs font-mono transition-all text-slate-200"
                    title={`Connected as ${user.displayName || user.email} • Firestore Cloud Sync Active`}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Operative"
                        className="w-5 h-5 rounded-full object-cover border border-cyan-400"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-cyan-900 border border-cyan-400 flex items-center justify-center text-[10px] text-cyan-200 font-bold">
                        {(user.displayName || user.email || 'OP')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden md:inline max-w-[80px] truncate text-[11px] text-cyan-200 font-medium">
                      {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Firestore Synced" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-[#0a0e17]/98 border border-cyan-500/40 p-2.5 shadow-2xl backdrop-blur-2xl z-50 text-xs font-mono space-y-2">
                      <div className="border-b border-slate-800 pb-2">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Authenticated Operative</div>
                        <div className="text-white font-bold truncate mt-0.5">{user.displayName || 'Operative'}</div>
                        <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 px-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Cloud Firestore Sync Active</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          handleTabClick('admin');
                        }}
                        className="w-full flex items-center justify-start gap-2 py-1.5 px-2 rounded-lg bg-[#141b2d] hover:bg-[#1a233a] border border-cyan-500/40 text-cyan-200 transition-colors text-xs font-bold"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Admin Dashboard</span>
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setShowUserMenu(false);
                          sound.playClick();
                          await signOut();
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800/60 text-rose-300 hover:bg-rose-900/80 transition-colors text-xs font-bold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  id="user-sign-in-btn"
                  onClick={async () => {
                    sound.playClick();
                    try {
                      await signInWithGoogle();
                    } catch (e) {
                      console.error('Sign in error:', e);
                    }
                  }}
                  disabled={authLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 hover:border-cyan-400 text-cyan-200 text-xs font-mono font-medium transition-all shadow-sm"
                  title="Sign In with Google to sync game progress to Cloud Firestore"
                >
                  <LogIn className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>

            {/* Mobile / Tablet Menu Toggle */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-[#101420] border border-[#1d263b] text-slate-400 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Accordion Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#090d16]/98 border-b border-cyan-500/30 px-4 pt-3 pb-5 space-y-4 backdrop-blur-2xl max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Operative Profile & Auth Banner */}
          <div className="p-3 bg-[#0d1322] rounded-xl border border-cyan-500/30 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Operative"
                        className="w-7 h-7 rounded-full object-cover border border-cyan-400"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-cyan-900 border border-cyan-400 flex items-center justify-center text-xs text-cyan-200 font-bold">
                        {(user.displayName || user.email || 'OP')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-white font-bold text-xs truncate max-w-[150px]">
                        {user.displayName || 'Operative'}
                      </div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Cloud Firestore Synced</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <div className="text-slate-300 font-bold text-xs">Offline Operative</div>
                    <div className="text-[10px] text-slate-500">Sign in to sync progress to cloud</div>
                  </div>
                )}
              </div>

              {user ? (
                <button
                  type="button"
                  onClick={async () => {
                    sound.playClick();
                    await signOut();
                  }}
                  className="px-2.5 py-1 rounded bg-rose-950 border border-rose-800 text-rose-300 text-[10px] font-bold"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    sound.playClick();
                    try {
                      await signInWithGoogle();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Wallet & Quick Info */}
          <div className="py-2 px-3 bg-[#0f1523] rounded-xl border border-[#1f2940] flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Operative Balance:</span>
              <span className="text-amber-400 font-bold">{progress.credits} CR</span>
            </div>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsCommandModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50 text-[10px] font-bold"
            >
              All Hubs (18)
            </button>
          </div>

          {/* Categorized Sections */}
          <div className="space-y-3 font-mono">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                Core Operations
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {directNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                        isActive
                          ? 'bg-cyan-950 border border-cyan-400 text-cyan-200'
                          : 'bg-[#101624] text-slate-300 border border-[#1a2336] hover:bg-[#162033]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                Game Systems & Engine
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {systemsItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                        isActive
                          ? 'bg-cyan-950 border border-cyan-400 text-cyan-200'
                          : 'bg-[#101624] text-slate-300 border border-[#1a2336] hover:bg-[#162033]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                Economy & Loadout
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {economyItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                        isActive
                          ? 'bg-amber-950 border border-amber-400 text-amber-200'
                          : 'bg-[#101624] text-slate-300 border border-[#1a2336] hover:bg-[#162033]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                Intel, Docs & Community
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {intelItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg text-xs font-semibold text-left transition-colors ${
                        isActive
                          ? 'bg-blue-950 border border-blue-400 text-blue-200'
                          : 'bg-[#101624] text-slate-300 border border-[#1a2336] hover:bg-[#162033]'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Command Matrix / All Hubs Search Modal (Full Screen Responsive Overlay) */}
      {isCommandModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setIsCommandModalOpen(false)}
        >
          <div 
            id="command-center-modal"
            className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl bg-[#090d16] border border-cyan-500/40 shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header & Quick Search Bar */}
            <div className="p-4 sm:p-5 border-b border-[#1c2638] bg-[#0c121f]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    <LayoutGrid className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm sm:text-base font-black text-white font-mono uppercase tracking-wide">
                      Onegodia Command Center — Sector 7 Matrix
                    </h2>
                    <p className="text-[11px] text-slate-400 font-sans">
                      Select or search across all 18 playable game hubs, systems, and developer matrices
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="close-command-center-btn"
                  onClick={() => setIsCommandModalOpen(false)}
                  className="p-1.5 rounded-lg bg-[#141b2b] border border-[#222e44] text-slate-400 hover:text-white"
                  aria-label="Close command matrix"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Instant Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  ref={commandInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to filter hubs (e.g., 'map', 'radar', 'inventory', 'economy', 'dev')..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#060910] border border-[#222e44] focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs text-white placeholder-slate-500 font-mono outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Modal Body: Categorized Matrix */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {filteredHubs.length === 0 ? (
                <div className="py-12 text-center text-slate-500 font-mono text-xs">
                  No game hubs found matching &quot;{searchQuery}&quot;. Try another search term.
                </div>
              ) : (
                filteredHubs.map((category) => (
                  <div key={category.category} className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                        {category.category}
                      </span>
                      <div className="flex-1 h-px bg-slate-800" />
                      <span className="text-[10px] font-mono text-slate-500">
                        {category.items.length} Modules
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {category.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleTabClick(item.id)}
                            className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all group ${
                              isActive
                                ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/50'
                                : 'bg-[#0c121e] border-[#1a2436] hover:border-slate-500 hover:bg-[#121929] text-slate-300'
                            }`}
                          >
                            <div className={`p-2 rounded-lg mt-0.5 shrink-0 ${isActive ? 'bg-cyan-500 text-slate-950' : 'bg-[#141b2a] text-cyan-400 group-hover:scale-105 transition-transform'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className={`text-xs font-bold font-mono truncate ${isActive ? 'text-cyan-300' : 'text-slate-100 group-hover:text-cyan-300'}`}>
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold border ${item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 font-sans line-clamp-2 mt-1 leading-snug">
                                {item.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-[#1c2638] bg-[#0c121f] flex items-center justify-between font-mono text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span>Active Hub: <strong className="text-cyan-400 uppercase">{activeTab}</strong></span>
                <span className="hidden sm:inline text-slate-600">•</span>
                <span className="hidden sm:inline text-slate-500">Press <kbd className="px-1 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px]">ESC</kbd> to return</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCommandModalOpen(false)}
                className="px-3 py-1 rounded-lg bg-[#141b2b] hover:bg-[#1e273d] border border-[#222e44] text-slate-300 transition-colors"
              >
                Close Matrix
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
