import React, { useState } from 'react';
import {
  Gamepad2,
  Layers,
  Crosshair,
  FileText,
  Terminal,
  Users,
  ShieldCheck,
  Package,
  Volume2,
  VolumeX,
  Menu,
  X,
  Sparkles,
  Radio,
  UserPlus
} from 'lucide-react';
import { NavigationTab, PlayerProgress } from '../types';
import { sound } from '../services/audioService';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  progress: PlayerProgress;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, progress }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const handleTabClick = (tab: NavigationTab) => {
    sound.playClick();
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Radio },
    { id: 'prototype', label: 'Playable V1', icon: Gamepad2 },
    { id: 'gameplay-grid', label: 'Gameplay', icon: Layers },
    { id: 'tactical-hud', label: 'HUD', icon: Crosshair },
    { id: 'missions', label: 'Missions', icon: Sparkles },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'developers', label: 'Developers', icon: Terminal },
    { id: 'community', label: 'Community', icon: UserPlus },
    { id: 'web-doc', label: 'Web Doc', icon: FileText },
    { id: 'players', label: 'Players', icon: Users },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0c0e14]/95 border-b border-[#1e2230] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <button
              id="brand-logo-btn"
              onClick={() => handleTabClick('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center p-0.5 shadow-md shadow-blue-500/20 group-hover:shadow-blue-400/40 transition-all">
                <div className="w-full h-full bg-[#090b10] rounded-[3px] flex items-center justify-center">
                  <span className="font-mono font-black text-sm bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Ω</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-tight text-white text-xs sm:text-sm group-hover:text-blue-300 transition-colors">
                    Onegodia<span className="text-blue-400">:</span> Rise of the Digital World<span className="text-[10px] text-blue-400">™</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-1 py-0.2 text-[9px] font-mono font-semibold bg-blue-950/80 text-blue-300 border border-blue-700/50 rounded">MVP v1.0</span>
                  <span className="text-[10px] font-mono text-slate-400 hidden md:inline">Node: <span className="text-blue-400 font-medium">game.onegodian.com</span></span>
                </div>
              </div>
            </button>
          </div>

          <nav className="hidden 2xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium font-mono transition-all ${isActive ? 'bg-blue-600/20 text-blue-300 border border-blue-500/50 shadow-sm shadow-blue-500/20 font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-[#161821] border border-transparent'}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#11131a] border border-[#1e2230] rounded font-mono text-xs">
              <div className="flex items-center gap-1 text-amber-400"><span className="text-[10px]">◈</span><span className="font-semibold">{progress.credits}</span><span className="text-[9px] text-slate-500">CR</span></div>
              <div className="w-px h-3 bg-slate-800" />
              <div className="flex items-center gap-1 text-slate-400 text-[10px]" title="ODC Economy is Roadmap only (Simulated Inactive)"><span className="text-blue-400 font-medium">0.00</span><span>ODC</span><span className="text-[8px] px-1 bg-[#161821] text-slate-500 rounded border border-slate-800">Lock</span></div>
            </div>

            <button
              id="audio-toggle-btn"
              onClick={toggleSound}
              aria-label={isMuted ? 'Unmute game audio' : 'Mute game audio'}
              className="p-1.5 rounded bg-[#11131a] border border-[#1e2230] text-slate-400 hover:text-blue-300 hover:border-blue-700/60 transition-colors"
              title={isMuted ? 'Unmute Audio FX' : 'Mute Audio FX'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-blue-400" />}
            </button>

            {activeTab !== 'community' && (
              <button
                id="header-community-cta"
                onClick={() => handleTabClick('community')}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono shadow-sm shadow-blue-500/25 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" /><span>Join Build</span>
              </button>
            )}

            <button
              id="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="2xl:hidden p-1.5 rounded bg-[#11131a] border border-[#1e2230] text-slate-400 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="2xl:hidden bg-[#0c0e14]/98 border-b border-[#1e2230] px-4 pt-2 pb-4 space-y-1 backdrop-blur-xl">
          <div className="py-1.5 px-2.5 mb-2 bg-[#11131a] rounded border border-[#1e2230] flex items-center justify-between font-mono text-xs">
            <span className="text-slate-400 text-[11px]">Prototype Economy:</span>
            <div className="flex items-center gap-3 text-[11px]"><span className="text-amber-400 font-bold">{progress.credits} CR</span><span className="text-slate-500">0.00 ODC (Locked)</span></div>
          </div>
          <div className="grid grid-cols-2 gap-1.5 font-mono">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded text-xs font-medium text-left transition-colors ${isActive ? 'bg-blue-600/20 text-blue-300 border border-blue-500/50' : 'text-slate-400 hover:bg-[#161821] hover:text-slate-200 border border-[#161821]'}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} /><span className="text-[11px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
