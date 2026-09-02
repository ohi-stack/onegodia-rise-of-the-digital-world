import React, { useState, useEffect } from 'react';
import { NavigationTab } from '../types';
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Radio, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Bell, 
  MousePointer, 
  Sliders, 
  Check, 
  Activity, 
  Play,
  Sun,
  Moon
} from 'lucide-react';
import { sound, SoundSettings } from '../services/audioService';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(() => sound.getSettings());
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  useEffect(() => {
    const unsubscribe = sound.subscribe((newSettings) => {
      setSoundSettings({ ...newSettings });
    });
    return unsubscribe;
  }, []);

  const handleNav = (tab: NavigationTab) => {
    sound.playClick();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleMasterMute = () => {
    const isMuted = sound.toggleMute();
    if (!isMuted) {
      sound.playClick();
    }
  };

  const handleToggleTactical = () => {
    const enabled = sound.toggleTacticalAlerts();
    if (enabled) {
      sound.playObjectiveUpdated();
    }
  };

  const handleToggleAmbient = () => {
    const enabled = sound.toggleAmbientUI();
    if (enabled) {
      sound.playClick();
    }
  };

  return (
    <footer className="bg-[#0c0e14] border-t border-[#1e2230] text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Sound Settings Panel */}
        <div className="p-4 rounded-xl bg-[#090b10] border border-[#1e2230] shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1e2230]/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-xs font-mono uppercase tracking-wider">
                    Acoustic & Sound Settings Matrix
                  </h4>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-blue-950 text-blue-300 border border-blue-500/40">
                    Web Audio API
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">
                  Configure procedural tactical alerts and interactive ambient UI feedback.
                </p>
              </div>
            </div>

            {/* Actions: Theme Toggle & Master Mute */}
            <div className="flex items-center gap-2">
              {/* Theme Mode Toggle */}
              <div className="flex items-center p-0.5 rounded-lg bg-[#11131a] border border-[#1e2230]">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`px-2 py-1 rounded text-xs font-mono font-medium flex items-center gap-1 transition-all ${
                    theme === 'dark'
                      ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Switch to Dark Mode"
                >
                  <Moon className="w-3 h-3 text-indigo-400" />
                  <span className="hidden sm:inline">Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`px-2 py-1 rounded text-xs font-mono font-medium flex items-center gap-1 transition-all ${
                    theme === 'light'
                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50 shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title="Switch to Light Mode"
                >
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span className="hidden sm:inline">Light</span>
                </button>
              </div>

              {/* Quick Master Mute Button */}
              <button
                type="button"
                onClick={handleToggleMasterMute}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                  soundSettings.masterMuted
                    ? 'bg-red-950/80 border border-red-500/50 text-red-300 hover:bg-red-900/80'
                    : 'bg-[#11131a] border border-[#1e2230] text-slate-200 hover:text-white hover:border-slate-600'
                }`}
              >
                {soundSettings.masterMuted ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-red-400" />
                    <span>Audio Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Audio Active</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sound Controls Grid */}
          <div className="pt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Tactical Alerts Toggle Card */}
            <div className={`p-3 rounded-lg border transition-all ${
              soundSettings.tacticalAlerts && !soundSettings.masterMuted
                ? 'bg-[#0e1422] border-blue-500/40 shadow-sm'
                : 'bg-[#0e1017] border-[#1e2230] opacity-80'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                    soundSettings.tacticalAlerts && !soundSettings.masterMuted
                      ? 'bg-blue-950 text-blue-400 border border-blue-500/40'
                      : 'bg-[#141722] text-slate-500 border border-[#1e2230]'
                  }`}>
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs flex items-center gap-1.5 font-mono">
                      <span>Tactical Alerts</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                        soundSettings.tacticalAlerts && !soundSettings.masterMuted
                          ? 'bg-blue-900/50 text-blue-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {soundSettings.tacticalAlerts && !soundSettings.masterMuted ? 'ENABLED' : 'MUTED'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans">
                      Objective completions, radar pings & node scan frequencies.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (!soundSettings.masterMuted && soundSettings.tacticalAlerts) {
                        sound.playObjectiveComplete(2);
                      } else {
                        sound.playObjectiveUpdated();
                      }
                    }}
                    title="Test tactical alert sound"
                    className="p-1.5 rounded bg-[#151926] hover:bg-[#1e2336] text-blue-300 hover:text-white border border-blue-500/30 text-[10px] flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span className="hidden sm:inline font-mono">Test</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleTactical}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      soundSettings.tacticalAlerts ? 'bg-blue-600' : 'bg-slate-800'
                    }`}
                    aria-label="Toggle Tactical Alerts"
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      soundSettings.tacticalAlerts ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Ambient UI Toggle Card */}
            <div className={`p-3 rounded-lg border transition-all ${
              soundSettings.ambientUI && !soundSettings.masterMuted
                ? 'bg-[#0e171b] border-emerald-500/40 shadow-sm'
                : 'bg-[#0e1017] border-[#1e2230] opacity-80'
            }`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                    soundSettings.ambientUI && !soundSettings.masterMuted
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                      : 'bg-[#141722] text-slate-500 border border-[#1e2230]'
                  }`}>
                    <MousePointer className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-xs flex items-center gap-1.5 font-mono">
                      <span>Ambient UI</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] ${
                        soundSettings.ambientUI && !soundSettings.masterMuted
                          ? 'bg-emerald-900/50 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {soundSettings.ambientUI && !soundSettings.masterMuted ? 'ENABLED' : 'MUTED'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans">
                      Button interactions, warp transit, reward chimes & vehicle ignition.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => sound.playFragmentCollected()}
                    title="Test ambient UI sound"
                    className="p-1.5 rounded bg-[#121c1d] hover:bg-[#1a2b2d] text-emerald-300 hover:text-white border border-emerald-500/30 text-[10px] flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span className="hidden sm:inline font-mono">Test</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleAmbient}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      soundSettings.ambientUI ? 'bg-emerald-600' : 'bg-slate-800'
                    }`}
                    aria-label="Toggle Ambient UI sounds"
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      soundSettings.ambientUI ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

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

