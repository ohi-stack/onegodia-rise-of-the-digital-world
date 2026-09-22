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
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ComplianceBanner } from './components/ComplianceBanner';

// Views
import { HomeView } from './views/HomeView';
import { MVPV1View } from './views/MVPV1View';
import { PlayView } from './views/PlayView';
import { DevelopmentStatusView } from './views/DevelopmentStatusView';
import { ProducerView } from './views/ProducerView';
import { PrototypeView } from './views/PrototypeView';
import { GameplayView } from './views/GameplayView';
import { GameplayGridView } from './views/GameplayGridView';
import { TacticalHUDView } from './views/TacticalHUDView';
import { MapView } from './views/MapView';
import { MissionsView } from './views/MissionsView';
import { InventoryView } from './views/InventoryView';
import { DigitalAssetEconomyView } from './views/DigitalAssetEconomyView';
import { AssetsView } from './views/AssetsView';
import { DevelopersView } from './views/DevelopersView';
import { CommunityView } from './views/CommunityView';
import { MediaView } from './views/MediaView';
import { WebDocView } from './views/WebDocView';
import { PlayersView } from './views/PlayersView';
import { ComplianceView } from './views/ComplianceView';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');

  const [progress, setProgress] = useState<PlayerProgress>(() => {
    try {
      const saved = localStorage.getItem('onegodia_player_progress_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PLAYER_PROGRESS;
  });

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
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      console.error('Failed to parse Stripe return params:', err);
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-[#07090e] text-slate-200 flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200 relative overflow-hidden">
        {/* Modern Ambient Mesh & Soft Dot Texture */}
        <div className="absolute inset-0 modern-mesh-bg opacity-70 pointer-events-none z-0"></div>
        <div className="absolute inset-0 modern-dot-pattern opacity-30 pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07090e]/40 to-[#07090e] pointer-events-none z-0"></div>

        <div className="relative z-10">
          <ComplianceBanner />
        </div>

        <div className="relative z-20">
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} progress={progress} />
        </div>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          {activeTab === 'home' && (
            <HomeView setActiveTab={setActiveTab} progress={progress} mission={mission} />
          )}

          {activeTab === 'mvp-v1' && <MVPV1View setActiveTab={setActiveTab} />}

          {activeTab === 'play' && (
            <PlayView progress={progress} setProgress={setProgress} setActiveTab={setActiveTab} />
          )}

          {activeTab === 'development-status' && <DevelopmentStatusView />}
          {activeTab === 'producer' && <ProducerView />}

          {activeTab === 'prototype' && (
            <PrototypeView
              mission={mission}
              setMission={setMission}
              progress={progress}
              setProgress={setProgress}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'gameplay' && <GameplayView setActiveTab={setActiveTab} />}

          {activeTab === 'gameplay-grid' && <GameplayGridView />}

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

          {(activeTab === 'missions' || activeTab === 'story') && (
            <MissionsView
              mission={mission}
              setMission={setMission}
              progress={progress}
              setProgress={setProgress}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryView progress={progress} setProgress={setProgress} />
          )}

          {activeTab === 'assets' && <AssetsView />}

          {activeTab === 'digital-asset-economy' && <DigitalAssetEconomyView />}

          {activeTab === 'developers' && <DevelopersView />}
          {activeTab === 'community' && <CommunityView setActiveTab={setActiveTab} />}
          {activeTab === 'media' && <MediaView setActiveTab={setActiveTab} />}
          {activeTab === 'web-doc' && <WebDocView />}

          {activeTab === 'players' && (
            <PlayersView setActiveTab={setActiveTab} progress={progress} mission={mission} />
          )}

          {activeTab === 'compliance' && <ComplianceView />}
        </main>

        <Footer setActiveTab={setActiveTab} />
      </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
