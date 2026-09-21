import React from 'react';
import {
  Globe,
  Car,
  Compass,
  Box,
  Users,
  Play,
  Grid,
  FileText,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  MapPin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { NavigationTab, PlayerProgress, Mission } from '../types';
import { sound } from '../services/audioService';

interface HomeViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  progress: PlayerProgress;
  mission: Mission;
}

export const HomeView: React.FC<HomeViewProps> = ({ setActiveTab, progress, mission }) => {
  const handleNav = (tab: NavigationTab) => {
    sound.playClick();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const featureCards = [
    {
      id: 'stamford-hospital',
      tag: 'START YOUR JOURNEY',
      title: 'Stamford Hospital',
      desc: 'Your story begins here. Explore, take on missions, and help shape the future of Stamford.',
      image: '/src/assets/images/stamford_hospital_facade_1790031002708.jpg',
      targetTab: 'play' as NavigationTab,
    },
    {
      id: 'downtown-stamford',
      tag: 'EXPLORE THE CITY',
      title: 'Downtown Stamford',
      desc: 'Discover a vibrant city filled with opportunities.',
      image: '/src/assets/images/stamford_station_dusk_1790031015582.jpg',
      targetTab: 'map' as NavigationTab,
    },
    {
      id: 'harbor-point',
      tag: 'EXPAND YOUR HORIZON',
      title: 'Harbor Point',
      desc: 'Waterfront adventures, new missions, and more.',
      image: '/src/assets/images/harbor_point_waterfront_1790031027039.jpg',
      targetTab: 'play' as NavigationTab,
    },
    {
      id: 'waterbury-expansion',
      tag: 'REBUILD COMMUNITIES',
      title: 'Waterbury Expansion',
      desc: 'Be part of the Rebuilding Waterbury story.',
      image: '/src/assets/images/connecticut_waterbury_map_1790031038853.jpg',
      targetTab: 'community' as NavigationTab,
    },
  ];

  const coreLoopSteps = [
    { num: '01', label: 'Spawn', desc: 'Initialize at Hub Plaza or Stamford Hospital' },
    { num: '02', label: 'Movement', desc: 'Walk, Sprint, and directional traversal' },
    { num: '03', label: 'Explore', desc: 'Navigate dynamic city districts and streets' },
    { num: '04', label: 'Interact', desc: 'Engage with NPCs and discover waypoints' },
    { num: '05', label: 'Missions', desc: 'Accept objectives and tactical contracts' },
    { num: '06', label: 'Vehicles', desc: 'Board Cyber-Cruiser for high-speed transit' },
    { num: '07', label: 'Purify', desc: 'Scan and clear corrupted district nodes' },
    { num: '08', label: 'Rewards', desc: 'Earn digital credits and unlocked gear' },
    { num: '09', label: 'Persistence', desc: 'Automatic state sync and cloud saves' },
  ];

  return (
    <div className="w-full space-y-8 font-sans -mt-4 sm:-mt-6 pb-16">
      
      {/* =========================================================
          HERO PANORAMA SECTION (Exactly matching reference image)
         ========================================================= */}
      <section className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden border border-cyan-500/25 bg-[#070d17] shadow-2xl shadow-blue-950/40">
        
        {/* Background Skyline Image with Dramatic Twilight Grading */}
        <div className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] flex flex-col justify-between p-5 sm:p-8 lg:p-12">
          
          <img
            src="/src/assets/images/onegodia_hero_skyline_1790030990014.jpg"
            alt="Onegodia Stamford Metropolitan Skyline at Twilight"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Cinematic Vignette, Radial Sunset Lighting & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040810] via-black/40 to-black/75 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(245,158,11,0.18),transparent_45%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_65%,rgba(6,182,212,0.15),transparent_40%)] pointer-events-none" />

          {/* Top Overlays: Real Cities Header & Lateral Callouts */}
          <div className="relative z-10 w-full flex items-start justify-between">
            
            {/* Left Skyscraper Translucent Banner */}
            <div className="hidden md:flex flex-col items-start gap-1">
              <div className="px-2.5 py-1 rounded bg-blue-950/60 border border-blue-500/30 backdrop-blur-md text-[10px] font-bold text-cyan-300 tracking-widest uppercase">
                STAMFORD LIVES HERE
              </div>
              <div className="text-[11px] font-semibold text-slate-300 tracking-wider pl-1 uppercase opacity-80">
                A MORE HUMAN TOMORROW
              </div>
            </div>

            {/* Top Center Slogan */}
            <div className="mx-auto text-center">
              <p className="text-[11px] sm:text-xs md:text-sm font-bold tracking-[0.25em] text-cyan-300 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                REAL CITIES. DIGITAL WORLDS. LIMITLESS POSSIBILITIES.
              </p>
            </div>

            {/* Right Side Vertical Stacked Callouts */}
            <div className="hidden md:flex flex-col items-end text-right">
              <div className="text-[11px] font-black tracking-[0.22em] text-white/90 uppercase space-y-0.5 drop-shadow-md">
                <div>EXPLORE</div>
                <div>BUILD</div>
                <div>CONNECT</div>
                <div className="text-cyan-400">BELONG</div>
              </div>
              <div className="mt-3 px-2 py-1 rounded bg-blue-950/60 border border-blue-500/30 backdrop-blur-md text-[9px] font-bold text-cyan-200 tracking-wider uppercase text-center">
                STAMFORD<br />A BRIGHTER<br />TOMORROW<br />TOGETHER
              </div>
            </div>
          </div>

          {/* Centerpiece: Huge 3D Chrome ONEGODIA Title & Description */}
          <div className="relative z-10 my-auto text-center space-y-3 sm:space-y-4 max-w-5xl mx-auto px-2">
            
            {/* Massive Metallic Chrome 3D Logo Title */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[0.14em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-[#d6e5ff] to-[#7fa1cf] drop-shadow-[0_6px_25px_rgba(0,0,0,0.95)] select-none">
              ONEGODIA
            </h1>

            {/* Subtitle */}
            <div className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-black tracking-[0.24em] sm:tracking-[0.32em] uppercase text-cyan-300 drop-shadow-[0_2px_12px_rgba(6,182,212,0.6)]">
              RISE OF THE DIGITAL WORLD<span className="text-xs sm:text-base align-super text-cyan-400">™</span>
            </div>

            {/* Description Subheader */}
            <p className="text-xs sm:text-sm md:text-base font-bold tracking-[0.18em] text-slate-200 uppercase drop-shadow-md max-w-3xl mx-auto">
              A NEXT-GENERATION OPEN-WORLD LIFESTYLE SIMULATION
            </p>

            {/* Concept Credit */}
            <div className="text-[10px] sm:text-xs font-semibold tracking-[0.22em] text-slate-300 uppercase opacity-90">
              CONCEPT BY ONE GREGORY ONEGODIAN™
            </div>

            {/* Three Hero Action Cards (Play Now, View Gameplay Grid, Read The Web Doc) */}
            <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
              
              {/* Primary Action: PLAY NOW */}
              <button
                id="hero-cta-play-now"
                onClick={() => handleNav('play')}
                className="w-full sm:w-auto flex-1 min-w-[240px] px-6 py-4 rounded-2xl bg-gradient-to-r from-[#0066cc] via-[#0088ff] to-[#00b4d8] text-white font-black text-left shadow-[0_0_35px_rgba(0,136,255,0.45)] border-2 border-cyan-300 hover:border-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/40 flex items-center justify-center shadow-inner group-hover:bg-white group-hover:text-blue-600 transition-colors shrink-0">
                  <Play className="w-6 h-6 fill-current text-white group-hover:text-blue-600 ml-0.5" />
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black tracking-wider uppercase leading-tight">
                    PLAY NOW
                  </div>
                  <div className="text-xs font-semibold text-cyan-100 tracking-normal opacity-90">
                    Explore Stamford (MVP)
                  </div>
                </div>
              </button>

              {/* Secondary Action: VIEW GAMEPLAY GRID */}
              <button
                id="hero-cta-gameplay-grid"
                onClick={() => handleNav('gameplay-grid')}
                className="w-full sm:w-auto flex-1 min-w-[240px] px-6 py-4 rounded-2xl bg-black/65 backdrop-blur-xl text-white font-bold text-left border border-cyan-500/40 hover:border-cyan-300 hover:bg-black/80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group flex items-center gap-4 shadow-lg shadow-black/40"
              >
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-500 group-hover:text-black transition-colors shrink-0">
                  <Grid className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold tracking-wide uppercase leading-tight text-white group-hover:text-cyan-300 transition-colors">
                    VIEW GAMEPLAY GRID
                  </div>
                  <div className="text-xs text-slate-300 tracking-normal">
                    See the world in action
                  </div>
                </div>
              </button>

              {/* Tertiary Action: READ THE WEB DOC */}
              <button
                id="hero-cta-read-webdoc"
                onClick={() => handleNav('web-doc')}
                className="w-full sm:w-auto flex-1 min-w-[240px] px-6 py-4 rounded-2xl bg-black/65 backdrop-blur-xl text-white font-bold text-left border border-cyan-500/40 hover:border-cyan-300 hover:bg-black/80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group flex items-center gap-4 shadow-lg shadow-black/40"
              >
                <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-500 group-hover:text-black transition-colors shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-extrabold tracking-wide uppercase leading-tight text-white group-hover:text-cyan-300 transition-colors">
                    READ THE WEB DOC
                  </div>
                  <div className="text-xs text-slate-300 tracking-normal">
                    Game vision, features & more
                  </div>
                </div>
              </button>
            </div>

          </div>

          {/* Bottom Overlays: Location Pin (Left), Cursive Movement (Right), Scroll Indicator (Center) */}
          <div className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
            
            {/* Left Location Indicator */}
            <div className="flex items-center gap-2 text-left">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <div className="text-[11px] font-bold text-white uppercase tracking-wider">
                  STAMFORD, CONNECTICUT
                </div>
                <div className="text-[10px] text-slate-300 tracking-wider">
                  REAL PEOPLE. REAL PLACES. A BRIGHTER TOMORROW.
                </div>
              </div>
            </div>

            {/* Center Scroll Prompt */}
            <div className="flex flex-col items-center justify-center text-center cursor-pointer group" onClick={() => {
              window.scrollBy({ top: 500, behavior: 'smooth' });
            }}>
              <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-300 group-hover:text-white transition-colors">
                SCROLL TO EXPLORE
              </span>
            </div>

            {/* Right Cursive Script Accent */}
            <div className="text-right">
              <span className="font-serif italic text-base sm:text-lg text-slate-100 drop-shadow-md tracking-wide">
                More Than a Game. A Movement.<span className="text-xs not-italic">™</span>
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          HORIZONTAL FEATURE ICONS RIBBON (From reference image)
         ========================================================= */}
      <section className="w-full rounded-2xl bg-[#080e18]/90 border border-cyan-500/20 backdrop-blur-xl px-6 py-5 shadow-lg">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center lg:text-left">
          
          {/* Feature 1: Real-World Cities */}
          <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => handleNav('map')}>
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                REAL-WORLD CITIES
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Explore iconic locations
              </div>
            </div>
          </div>

          {/* Feature 2: Drive & Fly */}
          <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => handleNav('play')}>
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                DRIVE & FLY
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Vehicles, racing and more
              </div>
            </div>
          </div>

          {/* Feature 3: Missions & Story */}
          <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => handleNav('missions')}>
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                MISSIONS & STORY
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Make a real impact
              </div>
            </div>
          </div>

          {/* Feature 4: Own & Build */}
          <div className="flex items-center gap-3.5 group cursor-pointer" onClick={() => handleNav('inventory')}>
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all shrink-0">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                OWN & BUILD
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Digital assets & properties
              </div>
            </div>
          </div>

          {/* Feature 5: A Living Community */}
          <div className="flex items-center gap-3.5 group cursor-pointer col-span-2 sm:col-span-1" onClick={() => handleNav('community')}>
            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-all shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-white group-hover:text-cyan-300 transition-colors">
                A LIVING COMMUNITY
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                Play, create, belong
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          FOUR FEATURE CARDS (Exactly matching the 4 cards in image)
         ========================================================= */}
      <section className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {featureCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleNav(card.targetTab)}
              className="group rounded-2xl overflow-hidden bg-[#0a101b] border border-cyan-950 hover:border-cyan-400/60 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-950/40 cursor-pointer flex flex-col justify-between"
            >
              {/* Card Image Area */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a101b] via-transparent to-black/20" />
              </div>

              {/* Card Content Area */}
              <div className="p-5 flex flex-col justify-between flex-1 gap-4">
                <div className="space-y-1.5">
                  <div className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
                    {card.tag}
                  </div>
                  <h3 className="text-lg font-black text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                {/* Circular Arrow Button */}
                <div className="flex items-center justify-end pt-2">
                  <div className="w-8 h-8 rounded-full border border-slate-700 group-hover:border-cyan-400 bg-slate-900/90 group-hover:bg-cyan-500 flex items-center justify-center text-slate-300 group-hover:text-black transition-all">
                    <ChevronRight className="w-4 h-4 ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SLEEK STATS & REGIONAL SUB-FOOTER BAR (From reference image)
         ========================================================= */}
      <section className="w-full rounded-2xl bg-[#060c16] border border-slate-800/80 px-6 py-6 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Left: Skyline Vector Illustration & Title */}
          <div className="flex items-center gap-3.5 text-left">
            <svg className="w-8 h-8 text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 21h18M5 21V7l4-2v16M9 5l4 2v14M13 7l4-2v16M17 5l2 2v14" />
            </svg>
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-white">
                ONEGODIA<span className="text-cyan-400">™</span> | RISE OF THE DIGITAL WORLD<span className="text-cyan-400">™</span>
              </div>
              <div className="text-[10px] font-semibold text-slate-400 tracking-wider">
                STAMFORD • WATERBURY • AND BEYOND
              </div>
            </div>
          </div>

          {/* Center Metrics: Real Places, Opportunities, One Community */}
          <div className="flex items-center gap-8 text-center font-mono">
            <div>
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-sans">
                REAL PLACES
              </div>
              <div className="text-lg font-black text-white">
                2+ <span className="text-xs font-normal text-slate-400">CITIES</span>
              </div>
            </div>

            <div className="w-px h-8 bg-slate-800" />

            <div>
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-sans">
                ENDLESS
              </div>
              <div className="text-lg font-black text-cyan-400 tracking-wide font-sans uppercase">
                OPPORTUNITIES
              </div>
            </div>

            <div className="w-px h-8 bg-slate-800" />

            <div>
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-sans">
                ONE
              </div>
              <div className="text-lg font-black text-blue-400 tracking-wide font-sans uppercase">
                COMMUNITY
              </div>
            </div>
          </div>

          {/* Right: Social Handles & Movement Slogan */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-right">
            {/* Social Icons */}
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-cyan-300 transition-colors p-1" title="X (Twitter)">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-red-400 transition-colors p-1" title="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-400 transition-colors p-1" title="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors p-1" title="Discord">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
            </div>

            <div>
              <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
                PLAY • CREATE • BUILD • BELONG
              </div>
              <div className="text-[10px] font-semibold text-cyan-300">
                A MORE HUMAN TOMORROW™
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          THE 9-STEP CORE GAMEPLAY CYCLE & UNREAL 5 ROADMAP
         ========================================================= */}
      <section className="space-y-6 pt-6 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-cyan-400 tracking-wider uppercase">
              Interactive Prototype Architecture
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">
              The 9-Step Core Gameplay Cycle
            </h2>
          </div>
          <button
            onClick={() => handleNav('prototype')}
            className="text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <span>Launch Web Simulator</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
          {coreLoopSteps.map((step) => (
            <div
              key={step.num}
              className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all group flex flex-col justify-between"
            >
              <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded w-fit border border-cyan-500/20">
                {step.num}
              </span>
              <div className="mt-3">
                <div className="font-bold text-xs text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {step.label}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {step.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
