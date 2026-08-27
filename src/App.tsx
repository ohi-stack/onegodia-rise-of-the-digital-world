/**
 * Onegodia: Rise of the Digital World™ — MVP v1.0 / Playable Game V1
 * Official Game Node: game.onegodian.com
 * Concept by One Gregory Onegodian™
 */

import React, { useState, useEffect } from 'react';
import { NavigationTab, Mission, PlayerProgress } from './types';
import { INITIAL_MISSION_001, INITIAL_PLAYER_PROGRESS } from './data/initialGameState';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ComplianceBanner } from './components/ComplianceBanner';

// Views
import { HomeView } from './views/HomeView';
import { PrototypeView } from './views/PrototypeView';
import { GameplayGridView } from './views/GameplayGridView';
import { TacticalHUDView } from './views/TacticalHUDView';
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
        return JSON.parse(saved);
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

  return (
    <div className="min-h-screen bg-[#050608] text-slate-300 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Global Compliance Banner */}
      <ComplianceBanner />

      {/* Futuristic Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        progress={progress}
      />

      {/* Main Page Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'missions' && (
          <MissionsView
            mission={mission}
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
          />
        )}

        {activeTab === 'compliance' && (
          <ComplianceView />
        )}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
