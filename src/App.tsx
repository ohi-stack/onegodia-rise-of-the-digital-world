/**
 * Onegodia: Rise of the Digital World™ — MVP v1.0 / Playable Game V1
 * Official Game Node: game.onegodian.com
 * Concept by One Gregory Onegodian™
 */

import React, { useState, useEffect } from 'react';
import { NavigationTab, Mission, PlayerProgress } from './types';
import { INITIAL_MISSION_001, INITIAL_PLAYER_PROGRESS } from './data/initialGameState';
import { attachStripeReceiptToHistory } from './services/historyService';
import { sound } from './services/audioService';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ComplianceBanner } from './components/ComplianceBanner';

// Views
import { HomeView } from './views/HomeView';
import { PrototypeView } from './views/PrototypeView';
import { GameplayGridView } from './views/GameplayGridView';
import { TacticalHUDView } from './views/TacticalHUDView';
import { MapView } from './views/MapView';
import { MissionsView } from './views/MissionsView';
import { InventoryView } from './views/InventoryView';
import { DevelopersView } from './views/DevelopersView';
import { WebDocView } from './views/WebDocView';
import { PlayersView } from './views/PlayersView';
import { ComplianceView } from './views/ComplianceView';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');

  // Load persistent progress from localStorage
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    try {
      const saved = localStorage.getItem('onegodia_player_progress_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_PLAYER_PROGRESS;
  });

  // Load persistent mission state from localStorage
  const [mission, setMission] = useState<Mission>(() => {
    try {
      const saved = localStorage.getItem('onegodia_mission_001_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.objectives)) {
          parsed.objectives = parsed.objectives.map((obj: any, idx: number) => ({
            ...INITIAL_MISSION_001.objectives[idx],
            ...obj,
            rewards: obj.rewards || INITIAL_MISSION_001.objectives[idx]?.rewards
          }));
        }
        return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_MISSION_001;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('onegodia_player_progress_v1', JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  useEffect(() => {
    try {
      localStorage.setItem('onegodia_mission_001_v1', JSON.stringify(mission));
    } catch {
      // ignore
    }
  }, [mission]);

  // Check for Stripe Checkout return in URL params
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const stripeStatus = urlParams.get('stripe_status');
      const sessionId = urlParams.get('session_id');
      const passId = urlParams.get('pass');

      if (stripeStatus === 'success' && sessionId) {
        const receipt = {
          sessionId,
          passName: passId === 'founder_sector_pass' ? 'Founder Sector Key & Cyber-Cruiser Skin' : passId === 'genesis_bounty_booster' ? 'Genesis Bounty Booster Pack' : 'Sector 7 Priority Mission Pass',
          amountTotal: passId === 'founder_sector_pass' ? 1999 : passId === 'genesis_bounty_booster' ? 999 : 499,
          currency: 'USD',
          paidAt: Date.now(),
          status: 'paid'
        };

        attachStripeReceiptToHistory(receipt);
        sound.playReward();
        setActiveTab('missions');

        // Clean up URL query parameters without reloading
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch (err) {
      console.error('Failed to parse Stripe return params:', err);
    }
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#050608] text-slate-300 flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200 relative overflow-hidden">
        
        {/* Animated Gamer Grid & Scanline Background */}
        <div className="absolute inset-0 gamer-grid opacity-20 pointer-events-none z-0"></div>
        <div className="scanline-overlay"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#050608_80%)] pointer-events-none z-0"></div>

        {/* Top Global Compliance Banner */}
        <div className="relative z-10">
          <ComplianceBanner />
        </div>

        {/* Futuristic Navbar */}
        <div className="relative z-20">
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            progress={progress}
          />
        </div>

        {/* Main Page Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          {activeTab === 'home' && (
            <HomeView
              setActiveTab={setActiveTab}
              progress={progress}
              mission={mission}
            />
          )}

          {activeTab === 'prototype' && (
            <PrototypeView
              mission={mission}
              setMission={setMission}
              progress={progress}
              setProgress={setProgress}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'gameplay-grid' && (
            <GameplayGridView />
          )}

          {activeTab === 'tactical-hud' && (
            <TacticalHUDView
              progress={progress}
              setProgress={setProgress}
              mission={mission}
              setMission={setMission}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'map' && (
            <MapView
              progress={progress}
              setProgress={setProgress}
              mission={mission}
              setMission={setMission}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'missions' && (
            <MissionsView
              mission={mission}
              setMission={setMission}
              progress={progress}
              setProgress={setProgress}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView
              progress={progress}
              setProgress={setProgress}
            />
          )}

          {activeTab === 'developers' && (
            <DevelopersView />
          )}

          {activeTab === 'web-doc' && (
            <WebDocView />
          )}

          {activeTab === 'players' && (
            <PlayersView
              setActiveTab={setActiveTab}
              progress={progress}
              mission={mission}
            />
          )}

          {activeTab === 'compliance' && (
            <ComplianceView />
          )}
        </main>

        {/* Global Footer */}
        <Footer setActiveTab={setActiveTab} />

      </div>
    </ThemeProvider>
  );
}
