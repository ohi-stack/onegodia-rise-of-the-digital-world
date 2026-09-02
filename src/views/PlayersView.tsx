import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Sparkles, 
  Gamepad2, 
  CheckCircle2, 
  Clock, 
  Send, 
  ShieldCheck, 
  ArrowRight,
  MessageSquare,
  TrendingUp,
  Award,
  Zap,
  Activity,
  BarChart3,
  Calendar,
  Layers,
  Info,
  Coins
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { NavigationTab, PlayerProgress, Mission } from '../types';
import { sound } from '../services/audioService';
import { useTheme } from '../context/ThemeContext';

interface PlayersViewProps {
  setActiveTab: (tab: NavigationTab) => void;
  progress?: PlayerProgress;
  mission?: Mission;
}

export const PlayersView: React.FC<PlayersViewProps> = ({ setActiveTab, progress, mission }) => {
  const { theme } = useTheme();
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('Movement & Controls');
  const [chartMetric, setChartMetric] = useState<'xp_credits_line' | 'xp_growth' | 'session_bars' | 'telemetry_curve'>('xp_credits_line');
  const [timeRange, setTimeRange] = useState<'all' | 'recent'>('all');

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    sound.playFragmentCollected();
    setFeedbackSent(true);
  };

  // Calculate dynamic bonuses from active game state
  const isMissionComplete = progress?.missionsCompleted?.includes('mission_001') || mission?.status === 'Complete';
  const fragmentCount = progress?.collectedFragments?.length || 0;
  const creditBonus = Math.floor(((progress?.credits || 250) - 250) / 2);
  const liveSessionBonusXP = (isMissionComplete ? 750 : (mission?.currentObjectiveIndex || 0) * 150) + (fragmentCount * 250) + Math.max(0, creditBonus);

  // Chronological player progress data
  const rawChartData = useMemo(() => [
    {
      cycle: 'Cycle 01',
      sessionName: 'Sector 7 Drop',
      date: 'Aug 24',
      cumulativeXP: 150,
      sessionXP: 150,
      directivesCompleted: 1,
      signalStrength: 28,
      credits: 50,
      note: 'Initial grid drop & jump calibration'
    },
    {
      cycle: 'Cycle 02',
      sessionName: 'Aria Pulse Contact',
      date: 'Aug 25',
      cumulativeXP: 450,
      sessionXP: 300,
      directivesCompleted: 2,
      signalStrength: 45,
      credits: 100,
      note: 'Mission 001 briefing unlocked'
    },
    {
      cycle: 'Cycle 03',
      sessionName: 'Highway Transit',
      date: 'Aug 27',
      cumulativeXP: 850,
      sessionXP: 400,
      directivesCompleted: 3,
      signalStrength: 62,
      credits: 150,
      note: 'Cyber-Cruiser vehicle test'
    },
    {
      cycle: 'Cycle 04',
      sessionName: 'Node Resonator Scan',
      date: 'Aug 28',
      cumulativeXP: 1350,
      sessionXP: 500,
      directivesCompleted: 4,
      signalStrength: 78,
      credits: 200,
      note: 'Photonic beam frequency locked'
    },
    {
      cycle: 'Cycle 05',
      sessionName: 'Fragment Extraction',
      date: 'Aug 29',
      cumulativeXP: 1950,
      sessionXP: 600,
      directivesCompleted: 5,
      signalStrength: 89,
      credits: 250,
      note: 'Foundational Data Fragment stored'
    },
    {
      cycle: 'Cycle 06',
      sessionName: 'Tactical HUD Master',
      date: 'Aug 30',
      cumulativeXP: 2450,
      sessionXP: 500,
      directivesCompleted: 6,
      signalStrength: 94,
      credits: 300,
      note: 'Radar scan & waypoint navigation'
    },
    {
      cycle: 'Cycle 07',
      sessionName: 'Live Session Alpha',
      date: 'Aug 31',
      cumulativeXP: 2450 + liveSessionBonusXP,
      sessionXP: 450 + liveSessionBonusXP,
      directivesCompleted: 6 + (isMissionComplete ? 2 : 1),
      signalStrength: 98,
      credits: progress?.credits || 350,
      note: 'Active session real-time telemetry'
    }
  ], [liveSessionBonusXP, isMissionComplete, progress?.credits]);

  const chartData = useMemo(() => {
    if (timeRange === 'recent') {
      return rawChartData.slice(-4);
    }
    return rawChartData;
  }, [rawChartData, timeRange]);

  const totalXP = rawChartData[rawChartData.length - 1].cumulativeXP;
  const currentRankLevel = Math.floor(totalXP / 600) + 1;
  const xpIntoCurrentLevel = totalXP % 600;
  const xpToNextLevel = 600 - xpIntoCurrentLevel;

  return (
    <div className="space-y-6 py-2 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-wider">
              CITIZEN & PLAYER HUB
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Player Telemetry, XP Progress & Staged Capability Matrix
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Real-time player telemetry, visual XP accumulation curves, and staged capability boundaries.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('prototype');
          }}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono shadow-sm flex items-center gap-1.5 transition-all self-start md:self-auto"
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Launch Playable V1</span>
        </button>
      </div>

      {/* Recharts Player Progress & XP Analytics Section */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#0c0e14] border border-blue-500/30 shadow-xl space-y-4 font-mono">
        
        {/* Analytics Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#1e2230]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <h2 className="font-bold text-white text-sm font-sans tracking-wide">
                Player Experience Progression & Telemetry (Recharts Visualizer)
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] bg-blue-950 text-blue-300 border border-blue-500/40">
                Live Data Active
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">
              Cumulative XP earned across operative cycles, telemetry signal strength, and mission directives cleared.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#11131a] p-1 rounded-lg border border-[#1e2230] text-xs">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setChartMetric('xp_credits_line');
              }}
              className={`px-2.5 py-1 rounded font-bold flex items-center gap-1.5 transition-all ${
                chartMetric === 'xp_credits_line'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Coins className="w-3 h-3 text-amber-300" />
              <span>XP & Credits Over Time</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setChartMetric('xp_growth');
              }}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                chartMetric === 'xp_growth'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              XP Area Curve
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setChartMetric('session_bars');
              }}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                chartMetric === 'session_bars'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Session XP & Directives
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setChartMetric('telemetry_curve');
              }}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                chartMetric === 'telemetry_curve'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Signal Calibration (%)
            </button>
          </div>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-sans">
          
          <div className="p-3 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span>Total XP Earned</span>
              <Award className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {totalXP.toLocaleString()} <span className="text-blue-400 text-xs">XP</span>
            </div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <span>+{(liveSessionBonusXP > 0 ? liveSessionBonusXP : 450)} XP this cycle</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span>Operative Rank</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono flex items-baseline gap-1.5">
              <span>Level {currentRankLevel}</span>
              <span className="text-[10px] text-slate-400 font-sans">Operative</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {xpToNextLevel} XP to Level {currentRankLevel + 1}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span>Player Credits</span>
              <Coins className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-amber-400 font-mono">
              {(progress?.credits || 350).toLocaleString()} <span className="text-xs text-amber-300">CR</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {(progress?.collectedFragments?.length || 0)} Foundational Fragments
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#11131a] border border-[#1e2230] space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
              <span>Directives Cleared</span>
              <Zap className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="text-lg font-bold text-white font-mono">
              {rawChartData[rawChartData.length - 1].directivesCompleted} / 8
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              {isMissionComplete ? 'Mission 001 Finalized' : 'Directive Active'}
            </div>
          </div>

        </div>

        {/* Recharts Canvas Container */}
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 px-1 font-mono">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">
                {chartMetric === 'xp_credits_line' && 'Line Chart: Player Experience (XP) & Credits Gained Over Operative Cycles'}
                {chartMetric === 'xp_growth' && 'Area Chart: Cumulative Experience Points (XP) Over Operative Cycles'}
                {chartMetric === 'session_bars' && 'Bar Chart: Cycle-by-Cycle XP Gain vs. Directives Cleared'}
                {chartMetric === 'telemetry_curve' && 'Line Chart: Sector 7 Photonic Signal Calibration Resonance (%)'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-slate-500">Range:</span>
              <button
                type="button"
                onClick={() => setTimeRange('all')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  timeRange === 'all' ? 'bg-[#1e2230] text-blue-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                All 7 Cycles
              </button>
              <button
                type="button"
                onClick={() => setTimeRange('recent')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  timeRange === 'recent' ? 'bg-[#1e2230] text-blue-300 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Recent Operations
              </button>
            </div>
          </div>

          <div className="h-72 sm:h-80 w-full bg-[#08090e] p-3 rounded-lg border border-[#1e2230]/80">
            <ResponsiveContainer width="100%" height="100%">
              {chartMetric === 'xp_credits_line' ? (
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e2e8f0' : '#1e2230'} vertical={false} />
                  <XAxis 
                    dataKey="cycle" 
                    stroke={theme === 'light' ? '#64748b' : '#64748b'} 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#1e2230' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#3b82f6" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#1e2230' }}
                    tickFormatter={(val) => `${val} XP`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#f59e0b" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#1e2230' }}
                    tickFormatter={(val) => `${val} CR`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'light' ? '#ffffff' : '#0c0e14', 
                      borderColor: theme === 'light' ? '#cbd5e1' : '#1e2230', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                      fontSize: '12px',
                      color: theme === 'light' ? '#0f172a' : '#f8fafc',
                      fontFamily: 'monospace'
                    }} 
                    formatter={(value: any, name: any) => [
                      name === 'cumulativeXP' ? `${Number(value).toLocaleString()} XP` : `${Number(value).toLocaleString()} CR`, 
                      name === 'cumulativeXP' ? 'Accumulated XP' : 'Player Credits'
                    ]}
                    labelFormatter={(label, items) => {
                      const item = items?.[0]?.payload;
                      return `${label}: ${item?.sessionName || ''} (${item?.date || ''})`;
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="cumulativeXP" 
                    name="Accumulated XP" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#3b82f6' }}
                    activeDot={{ r: 7, fill: '#60a5fa', stroke: '#1e3a8a', strokeWidth: 2 }}
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="credits" 
                    name="Credits (CR)" 
                    stroke="#f59e0b" 
                    strokeWidth={2.5} 
                    strokeDasharray="4 4"
                    dot={{ r: 4, fill: '#f59e0b' }}
                    activeDot={{ r: 7, fill: '#fbbf24', stroke: '#78350f', strokeWidth: 2 }}
                  />
                </LineChart>
              ) : chartMetric === 'xp_growth' ? (
                <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e2e8f0' : '#1e2230'} vertical={false} />
                  <XAxis 
                    dataKey="cycle" 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#1e2230' }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#1e2230' }}
                    tickFormatter={(val) => `${val} XP`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'light' ? '#ffffff' : '#0c0e14', 
                      borderColor: theme === 'light' ? '#cbd5e1' : '#1e2230', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                      fontSize: '12px',
                      color: theme === 'light' ? '#0f172a' : '#f8fafc',
                      fontFamily: 'monospace'
                    }} 
                    formatter={(value: any, name: any) => [
                      `${Number(value).toLocaleString()} XP`, 
                      name === 'cumulativeXP' ? 'Total Accumulated XP' : name
                    ]}
                    labelFormatter={(label, items) => {
                      const item = items?.[0]?.payload;
                      return `${label}: ${item?.sessionName || ''} (${item?.date || ''})`;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cumulativeXP" 
                    name="Cumulative XP" 
                    stroke="#3b82f6" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#xpGradient)" 
                    activeDot={{ r: 6, fill: '#60a5fa', stroke: '#1e3a8a', strokeWidth: 2 }}
                  />
                </AreaChart>
              ) : chartMetric === 'session_bars' ? (
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e2e8f0' : '#1e2230'} vertical={false} />
                  <XAxis 
                    dataKey="cycle" 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#1e2230' }}
                  />
                  <YAxis 
                    yAxisId="left"
                    stroke="#10b981" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#1e2230' }}
                    tickFormatter={(val) => `+${val} XP`}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    stroke="#8b5cf6" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#1e2230' }}
                    tickFormatter={(val) => `${val} Dir`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'light' ? '#ffffff' : '#0c0e14', 
                      borderColor: theme === 'light' ? '#cbd5e1' : '#1e2230', 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      color: theme === 'light' ? '#0f172a' : '#f8fafc',
                      fontFamily: 'monospace'
                    }}
                    labelFormatter={(label, items) => {
                      const item = items?.[0]?.payload;
                      return `${label}: ${item?.sessionName || ''} (${item?.note || ''})`;
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} 
                  />
                  <Bar 
                    yAxisId="left" 
                    dataKey="sessionXP" 
                    name="Session XP Gained" 
                    fill="#10b981" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    yAxisId="right" 
                    dataKey="directivesCompleted" 
                    name="Directives Cleared" 
                    fill="#8b5cf6" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e2e8f0' : '#1e2230'} vertical={false} />
                  <XAxis 
                    dataKey="cycle" 
                    stroke="#64748b" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#1e2230' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    stroke="#f59e0b" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: theme === 'light' ? '#cbd5e1' : '#1e2230' }}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'light' ? '#ffffff' : '#0c0e14', 
                      borderColor: theme === 'light' ? '#cbd5e1' : '#1e2230', 
                      borderRadius: '8px', 
                      fontSize: '12px',
                      color: theme === 'light' ? '#0f172a' : '#f8fafc',
                      fontFamily: 'monospace'
                    }}
                    formatter={(value: any) => [`${value}% Signal Resonance`, 'Calibration Strength']}
                    labelFormatter={(label, items) => {
                      const item = items?.[0]?.payload;
                      return `${label}: ${item?.sessionName || ''}`;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="signalStrength" 
                    name="Signal Calibration %" 
                    stroke="#f59e0b" 
                    strokeWidth={2.5} 
                    dot={{ r: 4, fill: '#f59e0b' }} 
                    activeDot={{ r: 7, fill: '#fbbf24', stroke: '#78350f', strokeWidth: 2 }}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Milestone XP Breakdown Legend */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-300 font-sans">
          <div className="p-2.5 rounded-lg bg-[#11131a] border border-[#1e2230] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></div>
            <div>
              <span className="font-bold text-white font-mono">Mission 001 Flow:</span>
              <span className="text-slate-400 ml-1">+750 XP for Aria contact, photonic scan & data extraction.</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#11131a] border border-[#1e2230] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></div>
            <div>
              <span className="font-bold text-white font-mono">Transit Highway:</span>
              <span className="text-slate-400 ml-1">+400 XP vehicle acceleration telemetry along Sector 7.</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#11131a] border border-[#1e2230] flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></div>
            <div>
              <span className="font-bold text-white font-mono">Telemetry Radar:</span>
              <span className="text-slate-400 ml-1">Up to +500 XP waypoint pings & fast-travel warp test.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Two Column Grid: Playable Now vs Future Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Playable Now Card */}
        <div className="p-4 rounded-xl bg-[#0c0e14] border border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1e2230]">
            <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>WHAT YOU CAN DO RIGHT NOW (V1)</span>
            </div>
            <span className="px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[9px] font-mono font-semibold border border-emerald-700/50">
              Live in Browser
            </span>
          </div>

          <ul className="space-y-2 font-sans text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <span><strong>Explore Sector 7 District:</strong> Walk, sprint, and test the Jump Matrix across the neon-lit Onegodia Hub plaza.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <span><strong>Pilot the Cyber-Cruiser:</strong> Mount the ground vehicle in the garage, accelerate along the transit highway, and reverse.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <span><strong>Complete Mission 001:</strong> Talk with Aria Pulse, locate Corrupted Node #001, scan with the photonic beam, and extract Data Fragment #001.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <span><strong>Collect Simulated Rewards:</strong> Receive 250 Prototype Credits and the Foundational Data Fragment in your digital locker.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
              <span><strong>Use Tactical HUD:</strong> Track coordinates, radar sweep angles, and test instant warp fast-travel.</span>
            </li>
          </ul>
        </div>

        {/* What Comes Later Card */}
        <div className="p-4 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1e2230]">
            <div className="flex items-center gap-2 text-blue-400 font-bold font-mono text-xs">
              <Clock className="w-4 h-4" />
              <span>WHAT IS COMING IN FUTURE PHASES</span>
            </div>
            <span className="px-2 py-0.2 rounded bg-[#11131a] text-slate-400 text-[9px] font-mono font-semibold border border-[#1e2230]">
              Unreal Engine 5
            </span>
          </div>

          <ul className="space-y-2 font-sans text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
              <span><strong>Full AAA Open World:</strong> Seamless metropolitan districts built in Unreal Engine 5 with Nanite and Lumen lighting.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
              <span><strong>Aerial & Oceanic Mounts:</strong> Flying mechanics soaring between skyway spires and sub-aquatic deep sea salvage.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
              <span><strong>Multiplayer Hubs:</strong> Synchronized instances for squad assemblies, cooperative strikes, and community world events.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
              <span><strong>Deep Character Customization:</strong> Advanced avatar creators, cybernetic implants, and customizable apartment suites.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
              <span><strong>Regulated Digital Economy:</strong> Compliant player marketplace and Layer 2 infrastructure subject to regulatory clearance.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Playtest Feedback Form */}
      <div className="p-5 rounded-xl bg-[#0c0e14] border border-[#1e2230] space-y-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-blue-400 font-mono text-[10px] font-bold uppercase">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>COMMUNITY FEEDBACK CHANNEL</span>
          </div>
          <h2 className="text-base font-bold text-white font-sans">
            Submit MVP v1.0 Playtest Feedback
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Help shape the Unreal Engine 5 production build by reporting controls feel, HUD clarity, and gameplay feedback.
          </p>
        </div>

        {feedbackSent ? (
          <div className="p-5 rounded-lg bg-emerald-950/40 border border-emerald-500/50 text-center font-mono space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-slate-100 text-xs">Feedback Successfully Received!</h4>
            <p className="text-xs text-slate-400">
              Your playtest telemetry and observations have been logged for the game engineering team.
            </p>
            <button
              onClick={() => {
                setFeedbackSent(false);
                setFeedbackText('');
              }}
              className="mt-1 text-xs text-blue-400 hover:underline"
            >
              Submit another observation
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitFeedback} className="space-y-3 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold text-[11px]">Feedback Category</label>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="w-full p-2 rounded-lg bg-[#11131a] border border-[#1e2230] text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option>Movement & Controls</option>
                  <option>Tactical HUD & Minimap</option>
                  <option>Mission 001 Flow & Pacing</option>
                  <option>Vehicle Handling & Physics</option>
                  <option>Mobile Controller Usability</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold text-[11px]">Player Handle / Call-sign (Optional)</label>
                <input
                  type="text"
                  placeholder="Citizen-Alpha"
                  className="w-full p-2 rounded-lg bg-[#11131a] border border-[#1e2230] text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-semibold text-[11px]">Your Observations & Suggestions</label>
              <textarea
                rows={3}
                required
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts on the movement physics, scanning mechanics, or vehicle handling in Sector 7..."
                className="w-full p-2.5 rounded-lg bg-[#11131a] border border-[#1e2230] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit Feedback to Devs</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

