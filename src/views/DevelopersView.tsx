import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Server,
  Activity,
  Send,
  RefreshCw,
  Database,
  Radio,
  Key,
  Shield,
  Zap,
  Globe,
  Check,
  Copy
} from 'lucide-react';
import { sound } from '../services/audioService';
import { 
  networkNodeService, 
  SystemNodesConfig, 
  AgentDispatchResponse, 
  ObpStatusResponse 
} from '../services/networkNodeService';

export const DevelopersView: React.FC = () => {
  const [selectedTrack, setSelectedTrack] = useState<number>(1);
  const [systemNodes, setSystemNodes] = useState<SystemNodesConfig | null>(null);
  const [obpStatus, setObpStatus] = useState<ObpStatusResponse | null>(null);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [isLoadingNodes, setIsLoadingNodes] = useState<boolean>(false);

  // AI Agent Dispatch Console state
  const [selectedAgentRole, setSelectedAgentRole] = useState<string>('AI-Game-Designer');
  const [selectedProvider, setSelectedProvider] = useState<'auto' | 'gemini' | 'openai' | 'anthropic' | 'xai' | 'acc'>('auto');
  const [promptInput, setPromptInput] = useState<string>('Analyze the transmission telemetry for Node #001 in Sector 7 and provide Blueprint optimization recommendations.');
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [agentResponse, setAgentResponse] = useState<AgentDispatchResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // QRV Verification Test State
  const [qrvTestId, setQrvTestId] = useState<string>('QRV-ALPHA-7709');
  const [qrvResult, setQrvResult] = useState<any>(null);
  const [isVerifyingQrv, setIsVerifyingQrv] = useState<boolean>(false);

  const fetchNodeTelemetry = async () => {
    setIsLoadingNodes(true);
    try {
      const [nodes, obp, db] = await Promise.all([
        networkNodeService.getSystemNodes(),
        networkNodeService.getObpStatus(),
        networkNodeService.getDatabaseHealth()
      ]);
      setSystemNodes(nodes);
      setObpStatus(obp);
      setDbStatus(db);
    } catch (e) {
      console.warn('Telemetry load failed:', e);
    } finally {
      setIsLoadingNodes(false);
    }
  };

  useEffect(() => {
    fetchNodeTelemetry();
  }, []);

  const handleAgentDispatch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!promptInput.trim() || isDispatching) return;

    sound.playClick();
    setIsDispatching(true);
    setAgentResponse(null);

    try {
      const res = await networkNodeService.dispatchAgentQuery(
        promptInput,
        selectedAgentRole,
        selectedProvider,
        {
          sector: 'Sector 7 Genesis District',
          activeZone: 'Onegodia Hub Plaza',
          nodeId: 'NODE-001'
        }
      );
      setAgentResponse(res);
      sound.playReward();
    } catch (err: any) {
      setAgentResponse({
        provider: 'error',
        model: 'system-error',
        response: `Execution error: ${err.message}`,
        agentRole: selectedAgentRole,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsDispatching(false);
    }
  };

  const handleVerifyQrv = async () => {
    sound.playClick();
    setIsVerifyingQrv(true);
    try {
      const res = await networkNodeService.verifyQrvReceipt(
        qrvTestId,
        'ASSET_PRIORITY_PASS_01',
        'sha256_quantum_proof_sig_0x9923'
      );
      setQrvResult(res);
    } finally {
      setIsVerifyingQrv(false);
    }
  };

  const handleCopyResponse = () => {
    if (!agentResponse?.response) return;
    navigator.clipboard.writeText(agentResponse.response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ueBlueprintClasses = [
    {
      name: 'BP_PlayerCharacter',
      base: 'ACharacter',
      desc: 'Controls player movement state machine, skeletal meshes, camera arm, and physical interaction spheres.',
      status: 'Blockout Ready'
    },
    {
      name: 'BP_SentinelDrone',
      base: 'ACharacter / APawn',
      desc: 'Patrol drone actor equipped with SplineComponent for perimeter patrol routes, spotter searchlight, and 45° dynamic vision cone sensor.',
      status: 'Avoid Phase Core'
    },
    {
      name: 'AIC_SentinelDrone',
      base: 'AAIController',
      desc: 'Behavior tree AI controller running UAIPerceptionComponent (Sight Config: 90° FOV, 650 unit range) with SplineFollow and Alert/Sweep states.',
      status: 'AI Logic Spec'
    },
    {
      name: 'BP_EnergyCore',
      base: 'AActor',
      desc: 'Collectible node core actor with USphereComponent collision, continuous yaw rotation, Niagara energy aura, and telemetry broadcast.',
      status: 'Collect Phase Core'
    },
    {
      name: 'BP_ExtractionPortal',
      base: 'AActor',
      desc: 'Extraction gate win-condition actor enabled upon purifying Node #001, triggering victory sequence and telemetry logging.',
      status: 'Portal Win Gate'
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
            Onegodia Engineering & Node Infrastructure Portal
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Full-stack server bridge connecting AI multi-agents, OBP protocol, QRV verification, and Unreal Engine 5.
          </p>
        </div>

        <button
          onClick={fetchNodeTelemetry}
          disabled={isLoadingNodes}
          className="px-3 py-1.5 rounded-lg bg-[#11131a] hover:bg-[#161821] text-blue-400 border border-blue-500/40 text-xs font-mono flex items-center gap-1.5 self-start md:self-auto transition-all active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoadingNodes ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* LIVE INFRASTRUCTURE ENVIRONMENT NODES MATRIX */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              ENVIRONMENT SERVICES & SECURE NODES
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Auto-Configured via Secrets Panel
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          
          {/* Gemini AI Node */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Google Gemini AI</span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                systemNodes?.nodes.gemini.configured 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60' 
                  : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
              }`}>
                {systemNodes?.nodes.gemini.configured ? 'LIVE KEY CONNECTED' : 'AWAITING KEY'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Model: <strong className="text-blue-300">gemini-3.7-flash</strong></div>
            <p className="text-[11px] text-slate-400 font-sans">
              Powers primary game master reasoning, dynamic NPC dialogue, and tactical coordinate processing.
            </p>
          </div>

          {/* OpenAI Node */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span>OpenAI Multi-Agent</span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                systemNodes?.nodes.openai.configured 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60' 
                  : 'bg-slate-900 text-slate-400 border border-slate-700'
              }`}>
                {systemNodes?.nodes.openai.configured ? 'ACTIVE (GPT-4o)' : 'STANDBY'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Environment: <strong className="text-slate-300">OPENAI_API_KEY</strong></div>
            <p className="text-[11px] text-slate-400 font-sans">
              Autonomous sub-agent delegation, game producer sprint breakdowns, and unit test generation.
            </p>
          </div>

          {/* Anthropic Claude Node */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <Code className="w-3.5 h-3.5 text-amber-400" />
                <span>Anthropic Claude</span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                systemNodes?.nodes.anthropic.configured 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60' 
                  : 'bg-slate-900 text-slate-400 border border-slate-700'
              }`}>
                {systemNodes?.nodes.anthropic.configured ? 'ACTIVE (Claude 3.5)' : 'STANDBY'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Environment: <strong className="text-slate-300">ANTHROPIC_API_KEY</strong></div>
            <p className="text-[11px] text-slate-400 font-sans">
              Deep narrative lore architecture, high-context world building, and ethical dialogue checks.
            </p>
          </div>

          {/* xAI Grok Node */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>xAI Grok Intelligence</span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                systemNodes?.nodes.xai.configured 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60' 
                  : 'bg-slate-900 text-slate-400 border border-slate-700'
              }`}>
                {systemNodes?.nodes.xai.configured ? 'ACTIVE (Grok-2)' : 'STANDBY'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Environment: <strong className="text-slate-300">XAI_API_KEY</strong></div>
            <p className="text-[11px] text-slate-400 font-sans">
              Sentinel drone tactical combat vectors, rapid telemetry analysis, and evasive route generation.
            </p>
          </div>

          {/* OBP Protocol Node */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>OBP Blockchain Node</span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-bold">
                {obpStatus?.connected ? 'NODE LINKED' : 'TESTNET SYNC'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Block: <strong className="text-cyan-300">#{obpStatus?.blockHeight || 1489204}</strong> | Epoch: <strong className="text-slate-300">{obpStatus?.epoch || 842}</strong>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Onegodia ledger protocol recording player experience milestones and telemetry hash signatures.
            </p>
          </div>

          {/* QRV Verification Node */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <Shield className="w-3.5 h-3.5 text-teal-400" />
                <span>QRV Quantum Verification</span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                systemNodes?.nodes.qrvVerify.configured 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60' 
                  : 'bg-teal-950/60 text-teal-300 border border-teal-800/40'
              }`}>
                {systemNodes?.nodes.qrvVerify.configured ? 'LIVE VERIFIER' : 'LOCAL CRYPTO'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Endpoint: <strong className="text-slate-300">QRV_VERIFY_URL</strong></div>
            <p className="text-[11px] text-slate-400 font-sans">
              Zero-knowledge cryptographic receipt validation for priority mission passes and digital locker inventory.
            </p>
          </div>

          {/* Relational Database */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <Database className="w-3.5 h-3.5 text-rose-400" />
                <span>Database Node</span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                dbStatus?.configured 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60' 
                  : 'bg-slate-900 text-slate-400 border border-slate-700'
              }`}>
                {dbStatus?.configured ? 'CONNECTED' : 'LOCAL CACHE'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Driver: <strong className="text-slate-300">{dbStatus?.driver || 'Client Local Storage'}</strong></div>
            <p className="text-[11px] text-slate-400 font-sans">
              High-throughput persistence layer storing operative cycles, waypoint telemetry, and mission audit logs.
            </p>
          </div>

          {/* ACC Gateway */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>ACC Cloud Gateway</span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                systemNodes?.nodes.accGateway.configured 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60' 
                  : 'bg-slate-900 text-slate-400 border border-slate-700'
              }`}>
                {systemNodes?.nodes.accGateway.configured ? 'GATEWAY SYNC' : 'STANDBY'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Config: <strong className="text-slate-300">ACC_API_KEY & URL</strong></div>
            <p className="text-[11px] text-slate-400 font-sans">
              Enterprise game node telemetry distribution and live server synchronization bridge.
            </p>
          </div>

          {/* Stripe Payment Infrastructure */}
          <div className="p-3.5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Stripe Payments</span>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                systemNodes?.nodes.stripe.configured 
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60' 
                  : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
              }`}>
                {systemNodes?.nodes.stripe.mode === 'live' ? 'LIVE MODE' : systemNodes?.nodes.stripe.mode === 'test' ? 'TEST MODE' : 'SIMULATION'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Client Key: <strong className="text-slate-300">{systemNodes?.nodes.stripe.publishableKeySet ? 'Configured' : 'Fallback'}</strong></div>
            <p className="text-[11px] text-slate-400 font-sans">
              Server-side API routes proxying checkout sessions for Priority Mission Passes with simulated sandboxing.
            </p>
          </div>

        </div>
      </div>

      {/* MULTI-AGENT AI INTELLIGENCE COMMAND CONSOLE */}
      <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#1e2230]">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white font-sans">
              Live Multi-Agent Intelligence Command Terminal
            </h2>
          </div>
          <span className="text-[10px] text-slate-400">
            Dispatches to Gemini, OpenAI, Claude, xAI, or ACC Gateway
          </span>
        </div>

        {/* Agent Role & Provider Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-bold">
              TARGET AI AGENT ROLE:
            </label>
            <select
              value={selectedAgentRole}
              onChange={(e) => setSelectedAgentRole(e.target.value)}
              className="w-full bg-[#11131a] border border-[#1e2230] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            >
              {aiAgentRoles.map((agent) => (
                <option key={agent.name} value={agent.name}>
                  {agent.name} — {agent.task.split(',')[0]}
                </option>
              ))}
              <option value="AI-Sentinel-Tactical">AI-Sentinel-Tactical — Drone Vision & Threat Analysis</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-bold">
              AI MODEL PROVIDER ROUTE:
            </label>
            <select
              value={selectedProvider}
              onChange={(e: any) => setSelectedProvider(e.target.value)}
              className="w-full bg-[#11131a] border border-[#1e2230] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            >
              <option value="auto">Auto Routing (Fastest Configured Provider)</option>
              <option value="gemini">Google Gemini (gemini-3.7-flash)</option>
              <option value="openai">OpenAI (gpt-4o)</option>
              <option value="anthropic">Anthropic Claude (claude-3-5-sonnet)</option>
              <option value="xai">xAI Grok (grok-2)</option>
              <option value="acc">ACC Cloud Gateway Protocol</option>
            </select>
          </div>
        </div>

        {/* Quick Prompt Presets */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] text-slate-500 font-bold mr-1">PRESETS:</span>
          {[
            { label: 'Unreal BP_Player Spec', prompt: 'Generate the C++ / Blueprint header specs for BP_PlayerCharacter enhanced input IA_Move and IA_Jump.' },
            { label: 'Drone Patrol Math', prompt: 'Calculate the optimal SplineComponent velocity and vision cone FOV for Sentinel Drone Patrol Alpha.' },
            { label: 'Mission 001 Loop', prompt: 'Review Mission 001 objective flow from Hub spawn to Node #001 scan and extraction gate.' },
            { label: 'QRV Telemetry Hash', prompt: 'Verify the cryptographic proof structure for recording player XP milestones into the OBP node.' }
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                sound.playClick();
                setPromptInput(preset.prompt);
              }}
              className="px-2 py-0.5 rounded bg-[#11131a] hover:bg-[#161821] text-slate-400 hover:text-slate-200 border border-[#1e2230] text-[10px] transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleAgentDispatch} className="flex gap-2">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            placeholder="Type developer directive or agent command..."
            className="flex-1 bg-[#11131a] border border-[#1e2230] rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
          />
          <button
            type="submit"
            disabled={isDispatching || !promptInput.trim()}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 shrink-0"
          >
            {isDispatching ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Query</span>
              </>
            )}
          </button>
        </form>

        {/* Live Response Box */}
        {agentResponse && (
          <div className="p-3.5 rounded-xl bg-[#07090e] border border-[#1e2230] space-y-2">
            <div className="flex items-center justify-between border-b border-[#1e2230] pb-2 text-[10px]">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">[{agentResponse.agentRole}]</span>
                <span className="text-slate-400">via {agentResponse.provider} ({agentResponse.model})</span>
                {agentResponse.isSimulated && (
                  <span className="px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[9px]">
                    Synthetic Mode
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-500">{new Date(agentResponse.timestamp).toLocaleTimeString()}</span>
                <button
                  type="button"
                  onClick={handleCopyResponse}
                  className="px-2 py-0.5 rounded bg-[#11131a] hover:bg-[#161821] text-slate-400 hover:text-slate-200 border border-[#1e2230] flex items-center gap-1 text-[10px]"
                  title="Copy response"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-200 font-sans leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
              {agentResponse.response}
            </div>
          </div>
        )}
      </div>

      {/* QRV & OBP CRYPTOGRAPHIC VERIFICATION SANDBOX */}
      <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between pb-2 border-b border-[#1e2230]">
          <div className="flex items-center gap-2 text-teal-400 font-bold">
            <Shield className="w-4 h-4" />
            <span>QRV Cryptographic Receipt Verification Sandbox</span>
          </div>
          <span className="text-[10px] text-slate-500">QRV_VERIFY_URL Bridge</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 items-center">
          <div className="md:col-span-2">
            <label className="block text-[10px] text-slate-400 mb-1">RECEIPT / PROOF ID:</label>
            <input
              type="text"
              value={qrvTestId}
              onChange={(e) => setQrvTestId(e.target.value)}
              className="w-full bg-[#11131a] border border-[#1e2230] rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleVerifyQrv}
              disabled={isVerifyingQrv}
              className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              {isVerifyingQrv ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>Verify Receipt Proof</span>
            </button>
          </div>
        </div>

        {qrvResult && (
          <div className="p-2.5 rounded-lg bg-[#11131a] border border-teal-500/40 text-teal-200 text-[11px] flex items-center justify-between">
            <div className="space-y-0.5">
              <div>Status: <strong>{qrvResult.verificationState || 'VERIFIED'}</strong></div>
              <div className="text-[10px] text-slate-400 font-mono truncate max-w-md">Proof: {qrvResult.quantumProof}</div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 border border-teal-700 text-teal-300 font-bold">
              {qrvResult.live ? 'LIVE VERIFIED' : 'LOCAL CRYPTO PASS'}
            </span>
          </div>
        )}
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

