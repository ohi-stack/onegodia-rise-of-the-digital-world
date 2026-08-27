import React, { useState } from 'react';
import { 
  Terminal, 
  Cpu, 
  Code, 
  Layers, 
  ShieldCheck, 
  Bot, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { sound } from '../services/audioService';

export const DevelopersView: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<number>(1);

  const ueBlueprintClasses = [
    {
      name: 'BP_PlayerCharacter',
      base: 'ACharacter',
      desc: 'Controls player movement state machine, skeletal meshes, camera arm, and physical interaction spheres.',
      status: 'Blockout Ready'
    },
    {
      name: 'BP_GameMode',
      base: 'AGameModeBase',
      desc: 'Authoritative rules engine governing Sector 7 zone states, mission progression, and simulated economy balance.',
      status: 'Architecture Mapped'
    },
    {
      name: 'BP_PlayerController',
      base: 'APlayerController',
      desc: 'Processes hardware input bindings (WASD/Gamepad), HUD widget viewport creation, and tactical radar communication.',
      status: 'Mapped from Web V1'
    },
    {
      name: 'BP_InteractionComponent',
      base: 'UActorComponent',
      desc: 'Modular actor component attached to NPCs, vehicles, and digital nodes for contextual proximity triggers.',
      status: 'Active Spec'
    },
    {
      name: 'BP_SpawnPoint',
      base: 'AActor',
      desc: 'Safe coordinate anchor at Onegodia Hub Plaza for initial player boot and respawn routines.',
      status: 'Coordinates Logged'
    },
    {
      name: 'BP_FallResetVolume',
      base: 'ATriggerVolume',
      desc: 'Safety boundary perimeter around city district borders that catches fallen pawns and teleports them to spawn.',
      status: 'Active Spec'
    }
  ];

  const aiAgentRoles = [
    { name: 'AI-Game-Producer', task: 'Sprint planning, task breakdown, milestone reports, blocker tracking' },
    { name: 'AI-Game-Designer', task: 'Gameplay loop, mission structure, rewards, progression curves' },
    { name: 'AI-Unreal-Developer', task: 'Unreal implementation plans, Blueprint class planning, controls, character movement' },
    { name: 'AI-Level-Design-Agent', task: 'City district layout, Hub location, mission route, map zones' },
    { name: 'AI-Vehicle-System-Agent', task: 'Vehicle controls, driving route, vehicle UI, vehicle test cases' },
    { name: 'AI-UI-UX-Agent', task: 'HUD, menus, inventory, reward screens, mobile virtual controls' },
    { name: 'AI-NPC-Dialogue-Agent', task: 'Mission NPC dialogue, interaction flow, smart NPC roadmap' },
    { name: 'AI-Economy-Compliance-Agent', task: 'Simulated economy, ODC/NFT restrictions, compliance review' },
    { name: 'AI-QA-Test-Agent', task: 'Test plans, bug logs, playtest verification feedback' },
    { name: 'AI-Game-Web-Agent', task: 'Website pages, SEO, game node content, developer/player onboarding' },
  ];

  const tracks = [
    {
      id: 1,
      title: 'Track 1 — Unreal Engine 5',
      icon: Cpu,
      items: [
        'Player character & skeletal mesh binding',
        'SpringArm and Third-Person Camera follow',
        'Metropolitan Level blockout with Nanite architecture',
        'Keyboard and Gamepad Input mapping (Enhanced Input)',
        'BP_SpawnPoint and BP_FallResetVolume triggers',
        'Chaos Vehicle dynamics for BP_CyberCruiser'
      ]
    },
    {
      id: 2,
      title: 'Track 2 — Frontend / Web Prototype',
      icon: Code,
      items: [
        'Interactive 2.5D Canvas game engine with physics',
        'Tactical HUD radar sweep & coordinate telemetry',
        'Touch-optimized Mobile Controller pad component',
        'game.onegodian.com node portal architecture',
        'Zero-latency Web Audio API sound synthesizer',
        'Fast-travel warp matrix & POI routing'
      ]
    },
    {
      id: 3,
      title: 'Track 3 — Game Design',
      icon: Layers,
      items: [
        'Mission 001: Rebuilding Signal objective flow',
        'Sector 7 cartography and world zone bounds',
        'Non-financial simulated reward calibrations',
        'Foundational collectible rarity tiering',
        'City reconstruction narrative arcs'
      ]
    },
    {
      id: 4,
      title: 'Track 4 — Technical Documentation',
      icon: FileText,
      items: [
        'MVP v1.0 scope & boundary specifications',
        'Unreal Engine Blueprint class architectural docs',
        'Tactical HUD and Mobile Controller specs',
        'QA test plans & bug logging templates',
        '16 public markdown specification files'
      ]
    },
    {
      id: 5,
      title: 'Track 5 — Compliance & Ethics',
      icon: ShieldCheck,
      items: [
        'Strict roadmap-only language for ODC and NFT concepts',
        'Zero-real-money and zero-gambling verification',
        'Safe user interaction & community guidelines',
        'Jurisdictional boundary disclosures and legal headers',
        'Founder concept protections (One Gregory Onegodian™)'
      ]
    },
  ];

  return (
    <div className="space-y-6 py-2 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">
              DEVELOPER HUB & ENGINE ARCHITECTURE
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Onegodia Engineering & Unreal Engine 5 Portal
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Connecting web prototype telemetry with Unreal Engine 5 Blueprint classes and 5 multi-disciplinary tracks.
          </p>
        </div>
      </div>

      {/* 5 Engineering Tracks Selector */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-blue-400 uppercase font-bold tracking-wider">
          5 Core Development Tracks:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {tracks.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedTrack === t.id;
            return (
              <button
                key={t.id}
                id={`dev-track-btn-${t.id}`}
                onClick={() => {
                  sound.playClick();
                  setSelectedTrack(t.id);
                }}
                className={`p-3.5 rounded-xl border text-left transition-all space-y-1.5 ${
                  isSelected
                    ? 'bg-blue-950/40 border-blue-500/80 text-blue-200 shadow-md'
                    : 'bg-[#0c0e14] border-[#1e2230] hover:border-slate-600 text-slate-400 hover:bg-[#11131a]'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-[#11131a] border border-[#1e2230] flex items-center justify-center text-blue-400">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="font-bold text-xs text-slate-200 font-mono">{t.title}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Track Details Card */}
        <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-3 font-mono text-xs shadow-xl">
          <div className="flex items-center justify-between text-blue-400 font-bold uppercase pb-2 border-b border-[#1e2230]">
            <span>{tracks[selectedTrack - 1]?.title} Deliverables</span>
            <span>Track 0{selectedTrack}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {tracks[selectedTrack - 1]?.items.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-[#11131a] border border-[#1e2230] flex items-center gap-2 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-sans text-xs">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unreal Engine 5 Blueprint Specification Matrix */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-blue-400 font-bold uppercase">UNREAL ENGINE 5 ACTORS</span>
            <h2 className="text-base sm:text-lg font-bold text-white font-sans">Core Blueprint Hierarchy (UE5)</h2>
          </div>
          <span className="text-xs text-slate-400">Target: UE 5.4+</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {ueBlueprintClasses.map((bp) => (
            <div key={bp.name} className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-300">{bp.name}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#11131a] text-blue-300 border border-blue-800/40 font-semibold">
                  {bp.status}
                </span>
              </div>
              <div className="text-[10px] text-slate-500">Extends: <strong className="text-slate-400">{bp.base}</strong></div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">{bp.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Agent Roles Matrix */}
      <div className="space-y-3 font-mono">
        <div className="space-y-0.5">
          <span className="text-[11px] text-amber-400 font-bold uppercase">COLLABORATIVE ARCHITECTURE</span>
          <h2 className="text-base sm:text-lg font-bold text-white font-sans">AI Agent Roles for Game Construction (10 Agents)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {aiAgentRoles.map((agent) => (
            <div key={agent.name} className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Bot className="w-3.5 h-3.5" />
                <span className="truncate">{agent.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                {agent.task}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
