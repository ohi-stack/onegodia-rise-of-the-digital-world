import React, { useMemo, useState } from 'react';
import {
  Users,
  Gamepad2,
  Terminal,
  Video,
  Bug,
  ArrowRight,
  CheckCircle2,
  Github,
  MessageSquare,
  Radio,
  ShieldCheck,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';
import { NavigationTab } from '../types';
import { sound } from '../services/audioService';

interface CommunityViewProps {
  setActiveTab: (tab: NavigationTab) => void;
}

type PathId = 'player' | 'developer' | 'creator' | 'tester';

const paths = [
  {
    id: 'player' as PathId,
    title: 'Player',
    icon: Gamepad2,
    tagline: 'Play the current browser MVP and help shape the first Unreal build.',
    steps: ['Launch Playable V1', 'Complete Mission 001', 'Submit gameplay feedback', 'Follow development updates'],
    cta: 'Start as Player',
    tab: 'players' as NavigationTab
  },
  {
    id: 'developer' as PathId,
    title: 'Developer',
    icon: Terminal,
    tagline: 'Build against defined tracks, source documents, issues, and acceptance criteria.',
    steps: ['Read the Web Doc', 'Review V1 scope', 'Choose a development track', 'Work through GitHub issues / pull requests'],
    cta: 'Open Developer Hub',
    tab: 'developers' as NavigationTab
  },
  {
    id: 'creator' as PathId,
    title: 'Creator / YouTuber',
    icon: Video,
    tagline: 'Document, review, critique, stream, and explain the build as it develops in public.',
    steps: ['Review current MVP status', 'Choose a feature or devlog angle', 'Publish clearly as prototype coverage', 'Send useful feedback back to the team'],
    cta: 'View Creator Brief',
    tab: 'web-doc' as NavigationTab
  },
  {
    id: 'tester' as PathId,
    title: 'Playtester / QA',
    icon: Bug,
    tagline: 'Reproduce issues, test controls, verify mission flow, and provide structured evidence.',
    steps: ['Run the current build', 'Record reproduction steps', 'Report expected vs actual behavior', 'Retest after fixes'],
    cta: 'Begin Playtest',
    tab: 'prototype' as NavigationTab
  }
];

export const CommunityView: React.FC<CommunityViewProps> = ({ setActiveTab }) => {
  const [selectedPath, setSelectedPath] = useState<PathId>('player');
  const [joined, setJoined] = useState(false);
  const [handle, setHandle] = useState('');
  const selected = useMemo(() => paths.find((path) => path.id === selectedPath) ?? paths[0], [selectedPath]);

  const registerInterest = (event: React.FormEvent) => {
    event.preventDefault();
    const record = {
      path: selectedPath,
      handle: handle.trim() || 'Anonymous Founding Community Member',
      createdAt: new Date().toISOString(),
      source: 'game.onegodian.com community onboarding v1'
    };
    try {
      localStorage.setItem('onegodia_community_interest_v1', JSON.stringify(record));
    } catch {
      // local persistence is optional in MVP
    }
    sound.playFragmentCollected();
    setJoined(true);
  };

  return (
    <div className="space-y-6 py-2 font-sans">
      <section className="p-5 rounded-xl bg-[#0c0e14] border border-[#1e2230] overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_45%)] pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">FOUNDING GAME COMMUNITY • ONBOARDING LIVE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">Build Onegodia With Us</h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Onegodia: Rise of the Digital World™ is moving from web MVP into a documented playable-production path. Players, developers, game-dev creators, YouTubers, testers, artists, and community builders can enter through a role-specific path without confusing roadmap concepts with active features.
            </p>
            <p className="text-[11px] font-mono text-slate-500 mt-2">Created by One Gregory Onegodian™ through ONEGODIAN, LLC • Official node: game.onegodian.com</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://github.com/ohi-stack/onegodia-rise-of-the-digital-world"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#11131a] border border-[#2a2f3d] text-xs font-mono font-bold text-slate-200 hover:border-blue-500/60 hover:text-blue-300 transition-colors"
            >
              <Github className="w-3.5 h-3.5" /> Public Repository
            </a>
            <button
              onClick={() => setActiveTab('prototype')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold transition-colors"
            >
              <Gamepad2 className="w-3.5 h-3.5" /> Play V1
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <span className="text-[11px] font-mono text-blue-400 font-bold uppercase">CHOOSE YOUR ENTRY PATH</span>
          <h2 className="text-lg font-bold text-white">Four ways to enter the build</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {paths.map((path) => {
            const Icon = path.icon;
            const active = selectedPath === path.id;
            return (
              <button
                key={path.id}
                onClick={() => { sound.playClick(); setSelectedPath(path.id); setJoined(false); }}
                className={`text-left p-4 rounded-xl border transition-all ${active ? 'bg-blue-950/35 border-blue-500/70 shadow-lg shadow-blue-950/20' : 'bg-[#0c0e14] border-[#1e2230] hover:border-slate-600'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#11131a] border border-[#1e2230] flex items-center justify-center text-blue-400"><Icon className="w-4 h-4" /></div>
                  {active && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <h3 className="text-sm font-bold text-white">{path.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{path.tagline}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_.8fr] gap-4">
        <div className="p-5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-[10px] font-mono text-blue-400 font-bold uppercase">{selected.title.toUpperCase()} ONBOARDING</div>
              <h2 className="text-base font-bold text-white">Your first four actions</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selected.steps.map((step, index) => (
              <div key={step} className="p-3 rounded-lg bg-[#11131a] border border-[#1e2230] flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-950 border border-blue-700/50 text-blue-300 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">{index + 1}</span>
                <span className="text-xs text-slate-300">{step}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => { sound.playClick(); setActiveTab(selected.tab); }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold"
          >
            {selected.cta} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] font-mono text-amber-400 font-bold uppercase">FOUNDING COMMUNITY REGISTRY • MVP</div>
              <h2 className="text-base font-bold text-white">Register your interest locally</h2>
            </div>
          </div>
          {joined ? (
            <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-center space-y-2">
              <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-400" />
              <div className="text-sm font-bold text-white">Path saved on this device</div>
              <p className="text-xs text-slate-400">This MVP does not yet transmit registration data to a production backend. Use the GitHub repository and project channels for active contribution.</p>
            </div>
          ) : (
            <form onSubmit={registerInterest} className="space-y-3">
              <label className="block text-[11px] font-mono font-semibold text-slate-300">Player / Developer / Creator handle (optional)</label>
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="Your handle"
                className="w-full p-2.5 rounded-lg bg-[#11131a] border border-[#1e2230] text-sm text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <div className="text-[10px] font-mono text-slate-500">Selected path: <span className="text-blue-300">{selected.title}</span></div>
              <button type="submit" className="w-full px-3 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold transition-colors">Save Founding Community Path</button>
            </form>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230]">
          <div className="flex items-center gap-2 text-blue-300 font-mono font-bold text-xs"><MessageSquare className="w-4 h-4" /> Community Channels</div>
          <p className="text-xs text-slate-400 mt-2">Planned channel structure covers announcements, MVP updates, gameplay feedback, bug reports, Unreal development, Stamford/Waterbury map work, vehicles, NPC/story, creators, and contributors.</p>
          <div className="mt-3 text-[10px] font-mono text-amber-300 bg-amber-950/20 border border-amber-800/30 rounded px-2 py-1.5">Discord public invite: activation pending — no placeholder link published.</div>
        </div>
        <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230]">
          <div className="flex items-center gap-2 text-blue-300 font-mono font-bold text-xs"><Radio className="w-4 h-4" /> Build in Public</div>
          <p className="text-xs text-slate-400 mt-2">Devlogs, creator coverage, livestream reviews, screenshots, issue tracking, and player votes should feed useful findings back into documented development work.</p>
        </div>
        <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230]">
          <div className="flex items-center gap-2 text-blue-300 font-mono font-bold text-xs"><ShieldCheck className="w-4 h-4" /> Scope & Compliance</div>
          <p className="text-xs text-slate-400 mt-2">MVP v1.0 is a gameplay, interface, and documentation prototype. ODC, NFT-style assets, blockchain marketplaces, and gambling-related concepts remain roadmap-only or compliance-locked unless separately activated.</p>
        </div>
      </section>

      <section className="p-5 rounded-xl bg-gradient-to-r from-blue-950/30 to-[#0c0e14] border border-blue-800/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono font-bold uppercase"><Sparkles className="w-3.5 h-3.5" /> THE COMMUNITY LOOP</div>
          <h2 className="text-base font-bold text-white mt-1">Founder → Team & Agents → Creators → Players → Feedback → GitHub → Unreal → Playtest → Release</h2>
          <p className="text-xs text-slate-400 mt-1">The community is part of development, not an audience waiting outside the studio.</p>
        </div>
        <button onClick={() => setActiveTab('developers')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold shrink-0">Enter Development <ArrowRight className="w-3.5 h-3.5" /></button>
      </section>
    </div>
  );
};
