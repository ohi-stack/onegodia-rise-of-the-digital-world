import React, { useState, useEffect } from 'react';
import { NavigationTab } from '../types';
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Bell, 
  MousePointer, 
  Sliders, 
  Play,
  Sun,
  Moon,
  FileText,
  Compass
} from 'lucide-react';
import { sound, SoundSettings } from '../services/audioService';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { theme, setTheme } = useTheme();
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(() => sound.getSettings());

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
    <footer className="bg-[#07090e] border-t border-slate-800/80 text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Modern Sound Settings Panel */}
        <div className="p-6 rounded-3xl bg-slate-900/60 dark:bg-[#0b0e17]/80 border border-slate-800/80 shadow-xl shadow-blue-950/20 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/70">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">
                    Interactive Audio & Preferences
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Web Audio API
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customize procedural sound FX, mission pings, and UI audio responses.
                </p>
              </div>
            </div>

            {/* Actions: Theme Mode & Master Audio Toggle */}
            <div className="flex items-center gap-2.5">
              {/* Theme Mode Segmented Control */}
              <div className="flex items-center p-1 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    theme === 'dark'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Switch to Dark Mode"
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    theme === 'light'
                      ? 'bg-amber-500 text-black shadow-sm font-bold'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                  title="Switch to Light Mode"
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>
              </div>

              {/* Master Mute Button */}
              <button
                type="button"
                onClick={handleToggleMasterMute}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  soundSettings.masterMuted
                    ? 'bg-rose-950/60 border border-rose-500/50 text-rose-300 hover:bg-rose-900/60'
                    : 'bg-slate-800/80 border border-slate-700/60 text-slate-200 hover:text-white hover:border-slate-600'
                }`}
              >
                {soundSettings.masterMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-rose-400" />
                    <span>Muted</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                    <span>Active Audio</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sound Controls Grid */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Tactical Alerts Toggle Card */}
            <div className={`p-4 rounded-2xl border transition-all ${
              soundSettings.tacticalAlerts && !soundSettings.masterMuted
                ? 'bg-slate-800/50 border-blue-500/40'
                : 'bg-slate-800/20 border-slate-800 opacity-70'
            }`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    soundSettings.tacticalAlerts && !soundSettings.masterMuted
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 text-xs flex items-center gap-2">
                      <span>Tactical Alerts</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        soundSettings.tacticalAlerts && !soundSettings.masterMuted
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {soundSettings.tacticalAlerts && !soundSettings.masterMuted ? 'Active' : 'Off'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Objective updates, waypoint milestones, and scan frequencies.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white border border-slate-700 text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test</span>
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
            <div className={`p-4 rounded-2xl border transition-all ${
              soundSettings.ambientUI && !soundSettings.masterMuted
                ? 'bg-slate-800/50 border-emerald-500/40'
                : 'bg-slate-800/20 border-slate-800 opacity-70'
            }`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    soundSettings.ambientUI && !soundSettings.masterMuted
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    <MousePointer className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100 text-xs flex items-center gap-2">
                      <span>Ambient UI FX</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        soundSettings.ambientUI && !soundSettings.masterMuted
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {soundSettings.ambientUI && !soundSettings.masterMuted ? 'Active' : 'Off'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Button interactions, warp transit, reward chimes, and ignition.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => sound.playFragmentCollected()}
                    title="Test ambient UI sound"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 hover:text-white border border-slate-700 text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Test</span>
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

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-6 border-b border-slate-800">
          
          {/* Brand & Concept Credit */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                Ω
              </div>
              <span className="font-extrabold text-white text-sm tracking-wide">
                ONEGODIA: Rise of the Digital World™
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-lg">
              An open-world digital lifestyle simulation and futuristic metropolis experience created by <strong className="text-blue-300 font-semibold">One Gregory Onegodian™</strong>. Blending real-world metropolitan topography with Unreal Engine 5 development.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Node: game.onegodian.com
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px]">
                <Cpu className="w-3 h-3 text-blue-400" />
                Unreal Engine 5 In Parallel
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
              Prototype Experiences
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => handleNav('play')} className="hover:text-blue-400 transition-colors">
                  Play Stamford Corridor
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('prototype')} className="hover:text-blue-400 transition-colors">
                  Sector 7 Web Canvas
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('map')} className="hover:text-blue-400 transition-colors">
                  Interactive World Map
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('missions')} className="hover:text-blue-400 transition-colors">
                  Missions & Contracts
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('inventory')} className="hover:text-blue-400 transition-colors">
                  Inventory & Digital Locker
                </button>
              </li>
            </ul>
          </div>

          {/* Architecture & Documentation */}
          <div className="space-y-2.5 text-xs">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
              Architecture & Docs
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => handleNav('developers')} className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  Developer Portal
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('web-doc')} className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  System Documentation
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('players')} className="hover:text-blue-400 transition-colors">
                  Player Onboarding Guide
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('compliance')} className="hover:text-blue-400 transition-colors flex items-center gap-1.5 text-amber-400/90 hover:text-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Safety & Compliance Disclosures
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclosure Card */}
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Prototype & Regulatory Notice</span>
          </div>
          <p className="leading-relaxed">
            Onegodia MVP v1.0 is an active gameplay and interface prototype. Simulated economy, token assets, and marketplace mechanisms are strictly roadmap concepts and off-chain sandbox features.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 border-t border-slate-800 pt-4">
          <div>
            © {new Date().getFullYear()} Onegodia: Rise of the Digital World™. Creative Concept by One Gregory Onegodian™.
          </div>
          <div className="flex items-center gap-3">
            <span>Milestone: MVP v1.0</span>
            <span>•</span>
            <span className="text-blue-400">game.onegodian.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
