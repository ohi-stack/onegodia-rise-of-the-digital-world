import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  Swords,
  Shield,
  Activity,
  Zap,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Crosshair,
  Flame,
  Radio,
  Terminal,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  Layers,
  BarChart3,
  PieChart as PieIcon,
  Disc
} from 'lucide-react';
import { sound } from '../../services/audioService';
import { CombatHistoryLog, CombatHistoryEvent } from './CombatHistoryLog';

export interface CombatTelemetryPoint {
  time: string;
  tick: number;
  shield: number;
  hull: number;
  hostileHp: number;
  energyCore: number;
  outgoingDps: number;
  incomingDps: number;
}

export interface WeaponOutputMetric {
  name: string;
  dps: number;
  heat: number;
  efficiency: number;
}

export interface DamageVector {
  name: string;
  value: number;
  color: string;
  mitigated: number;
}

export interface CombatEventLog {
  id: string;
  timestamp: string;
  type: 'attack' | 'defense' | 'emp' | 'system' | 'critical' | 'kill';
  message: string;
}

type CombatScenario = 'sector7' | 'quantumCore' | 'stamfordSkyRail';
type TacticalDoctrine = 'aggressive' | 'defensive' | 'balanced';
type ThreatLevel = 'tier1' | 'tier2' | 'tier3';

const SCENARIOS: Record<CombatScenario, { title: string; description: string; enemyName: string; maxHostiles: number }> = {
  sector7: {
    title: 'Sector 7 Firewall Incursion',
    description: 'Autonomous rogue drone swarm infiltrating the Sector 7 data relay conduit.',
    enemyName: 'Rogue Sentinel Swarm',
    maxHostiles: 12
  },
  quantumCore: {
    title: 'Quantum Core Perimeter Siege',
    description: 'Void-class phase stalkers attempting core breach near Stamford substation.',
    enemyName: 'Void Phase Stalkers',
    maxHostiles: 8
  },
  stamfordSkyRail: {
    title: 'Stamford Sky-Rail Ambush',
    description: 'Cyber-syndicate interceptors assaulting high-speed data transport corridor.',
    enemyName: 'Syndicate Interceptors',
    maxHostiles: 16
  }
};

const DOCTRINES: Record<TacticalDoctrine, { label: string; desc: string; dpsMod: number; shieldMod: number }> = {
  aggressive: {
    label: 'Aggressive Strike',
    desc: '+35% Outgoing DPS, +25% Core Heat, -15% Shield Regen',
    dpsMod: 1.35,
    shieldMod: 0.85
  },
  defensive: {
    label: 'Defensive Phalanx',
    desc: '+40% Shield Deflection, EMP counter-pulse, -20% Outgoing DPS',
    dpsMod: 0.8,
    shieldMod: 1.4
  },
  balanced: {
    label: 'Balanced Protocol',
    desc: 'Standard nominal tactical parameters and balanced capacitor cooling',
    dpsMod: 1.0,
    shieldMod: 1.0
  }
};

const INITIAL_VECTORS: DamageVector[] = [
  { name: 'Kinetic Projectile', value: 34, color: '#00f0ff', mitigated: 28 },
  { name: 'Thermal Plasma', value: 28, color: '#f43f5e', mitigated: 22 },
  { name: 'EMP / Cyber Surge', value: 24, color: '#a855f7', mitigated: 30 },
  { name: 'Nanite Corrosion', value: 14, color: '#eab308', mitigated: 10 }
];

export const TacticalCombatSimulation: React.FC = () => {
  // Simulation Controls
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1); // 1 = 900ms, 2 = 450ms
  const [scenario, setScenario] = useState<CombatScenario>('sector7');
  const [doctrine, setDoctrine] = useState<TacticalDoctrine>('balanced');
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('tier1');
  const [activeChartTab, setActiveChartTab] = useState<'telemetry' | 'weapons' | 'vectors'>('telemetry');

  // Combat State
  const [tick, setTick] = useState<number>(10);
  const [shield, setShield] = useState<number>(85);
  const [hull, setHull] = useState<number>(98);
  const [hostileHp, setHostileHp] = useState<number>(90);
  const [energyCore, setEnergyCore] = useState<number>(80);
  const [hostilesActive, setHostilesActive] = useState<number>(8);
  const [hostilesEliminated, setHostilesEliminated] = useState<number>(2);
  const [peakDps, setPeakDps] = useState<number>(460);
  const [totalDamageDealt, setTotalDamageDealt] = useState<number>(12450);

  // Time-series history for Recharts
  const [telemetryData, setTelemetryData] = useState<CombatTelemetryPoint[]>(() => {
    const points: CombatTelemetryPoint[] = [];
    let s = 95;
    let h = 100;
    let enemy = 100;
    let e = 85;

    for (let i = 0; i < 10; i++) {
      s = Math.max(20, Math.min(100, s - Math.floor(Math.random() * 6) + 3));
      enemy = Math.max(10, Math.min(100, enemy - Math.floor(Math.random() * 8) + 2));
      const outDps = 280 + Math.floor(Math.random() * 140);
      const inDps = 140 + Math.floor(Math.random() * 90);
      points.push({
        time: `T+${i * 2}s`,
        tick: i,
        shield: s,
        hull: h,
        hostileHp: enemy,
        energyCore: e,
        outgoingDps: outDps,
        incomingDps: inDps
      });
    }
    return points;
  });

  // Weapon Output Metrics for BarChart
  const [weaponMetrics, setWeaponMetrics] = useState<WeaponOutputMetric[]>([
    { name: 'Plasma Repeater', dps: 340, heat: 48, efficiency: 92 },
    { name: 'EMP Disruptor', dps: 210, heat: 35, efficiency: 88 },
    { name: 'Kinetic Rail', dps: 490, heat: 72, efficiency: 84 },
    { name: 'Nanite Swarm', dps: 180, heat: 25, efficiency: 95 },
    { name: 'Point Defense', dps: 150, heat: 20, efficiency: 98 }
  ]);

  // Damage Vector Distribution for PieChart
  const [damageVectors, setDamageVectors] = useState<DamageVector[]>(INITIAL_VECTORS);

  // Event Log
  const [logs, setLogs] = useState<CombatEventLog[]>([
    { id: '1', timestamp: '00:01', type: 'system', message: 'Combat telemetry linked to Sector 7 Node. Autonomous targeting verified.' },
    { id: '2', timestamp: '00:03', type: 'attack', message: 'Plasma Repeater burst scored 310 thermal dmg on Rogue Drone Alpha.' },
    { id: '3', timestamp: '00:06', type: 'defense', message: 'Operative Phase-Shield absorbed 125 kinetic incoming fire.' },
    { id: '4', timestamp: '00:08', type: 'critical', message: 'Kinetic Railgun scored CRITICAL HIT (490 dmg) — Drone Alpha armor ruptured.' },
    { id: '5', timestamp: '00:10', type: 'kill', message: 'TARGET ELIMINATED: Rogue Drone Alpha neutralized. Swarm threat recalibrating.' }
  ]);

  // Comprehensive Combat History (Units, Actions, Damage Values & Mitigations)
  const [combatHistory, setCombatHistory] = useState<CombatHistoryEvent[]>([
    {
      id: 'h1',
      timestamp: '00:01:04',
      relativeTime: 'T+02s',
      tick: 1,
      actor: 'Operative Nexus',
      target: 'Sector 7 Perimeter',
      category: 'system',
      action: 'Targeting Array Calibration',
      message: 'Autonomous combat telemetry and target locking initialized.'
    },
    {
      id: 'h2',
      timestamp: '00:01:06',
      relativeTime: 'T+04s',
      tick: 2,
      actor: 'Plasma Repeater',
      target: 'Rogue Drone Alpha',
      category: 'attack',
      action: 'Thermal Discharge Volley',
      damageValue: 310,
      damageType: 'Thermal',
      message: 'Scored concentrated thermal impact against frontal chassis plate.'
    },
    {
      id: 'h3',
      timestamp: '00:01:08',
      relativeTime: 'T+06s',
      tick: 3,
      actor: 'Hostile Swarm Drone',
      target: 'Operative Phase-Shield',
      category: 'mitigation',
      action: 'Kinetic Flechette Burst',
      damageValue: 45,
      mitigatedValue: 125,
      damageType: 'Kinetic',
      message: 'Operative Phase-Shield absorbed 125 kinetic incoming fire (73% deflection rate).'
    },
    {
      id: 'h4',
      timestamp: '00:01:10',
      relativeTime: 'T+08s',
      tick: 4,
      actor: 'Kinetic Rail Battery',
      target: 'Rogue Drone Alpha',
      category: 'critical',
      action: 'Hyper-Velocity Penetrator',
      damageValue: 490,
      damageType: 'Kinetic',
      message: 'Critical armor puncture verified at 4,800 m/s. Internal capacitor breached.'
    },
    {
      id: 'h5',
      timestamp: '00:01:12',
      relativeTime: 'T+10s',
      tick: 5,
      actor: 'Nanite Swarm Matrix',
      target: 'Rogue Drone Alpha',
      category: 'kill',
      action: 'Corrosive Structural Dissolution',
      damageValue: 240,
      damageType: 'Nanite',
      message: 'TARGET ELIMINATED: Rogue Drone Alpha neutralized. Swarm threat recalibrating.'
    }
  ]);

  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((type: CombatEventLog['type'], message: string) => {
    const now = new Date();
    const ts = `${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newLog: CombatEventLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: ts,
      type,
      message
    };
    setLogs((prev) => [...prev.slice(-35), newLog]);
  }, []);

  const addCombatHistoryEvent = useCallback((event: Omit<CombatHistoryEvent, 'id' | 'timestamp'>) => {
    const now = new Date();
    const ts = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newEntry: CombatHistoryEvent = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: ts,
      ...event
    };
    setCombatHistory((prev) => [...prev.slice(-99), newEntry]);
  }, []);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Simulation Tick Logic
  const executeSimulationTick = useCallback(() => {
    setTick((prevTick) => {
      const nextTick = prevTick + 1;
      const currentDoc = DOCTRINES[doctrine];
      const threatMultiplier = threatLevel === 'tier3' ? 1.45 : threatLevel === 'tier2' ? 1.2 : 1.0;

      // Calculate new values
      const baseOutDps = (300 + Math.floor(Math.random() * 120)) * currentDoc.dpsMod;
      const baseInDps = (160 + Math.floor(Math.random() * 90)) * threatMultiplier / currentDoc.shieldMod;

      setPeakDps((prev) => Math.max(prev, Math.round(baseOutDps)));
      setTotalDamageDealt((prev) => prev + Math.round(baseOutDps));

      // Shield and Hull calculation
      setShield((prevShield) => {
        let newShield = prevShield - Math.floor(baseInDps * 0.08) + Math.floor(12 * currentDoc.shieldMod);
        if (newShield < 0) {
          setHull((prevHull) => Math.max(10, prevHull - Math.floor(Math.random() * 6)));
          newShield = 0;
        }
        return Math.min(100, Math.max(0, newShield));
      });

      // Energy Core calculation
      setEnergyCore((prevEnergy) => {
        const drain = doctrine === 'aggressive' ? 8 : 4;
        const regen = 6;
        return Math.min(100, Math.max(20, prevEnergy - drain + regen));
      });

      // Hostile HP & elimination logic
      const currentEnemyUnit = `${SCENARIOS[scenario].enemyName} #${((nextTick % SCENARIOS[scenario].maxHostiles) + 1).toString().padStart(2, '0')}`;

      setHostileHp((prevHostile) => {
        const damageToEnemy = Math.floor(baseOutDps * 0.08);
        const nextHp = prevHostile - damageToEnemy;

        if (nextHp <= 0) {
          // Enemy eliminated, respawn next wave or increment counter
          setHostilesEliminated((e) => e + 1);
          setHostilesActive((a) => Math.max(1, a - 1));
          addLog('kill', `TARGET DESTROYED: ${SCENARIOS[scenario].enemyName} unit vaporized under continuous fire.`);
          addCombatHistoryEvent({
            relativeTime: `T+${nextTick * 2}s`,
            tick: nextTick,
            actor: 'Operative Fireteam',
            target: currentEnemyUnit,
            category: 'kill',
            action: 'Unit Neutralization',
            damageValue: 360,
            damageType: 'Composite',
            message: `TARGET NEUTRALIZED: ${currentEnemyUnit} disintegrated under concentrated fire.`
          });
          return 100;
        }
        return nextHp;
      });

      // Dynamic weapon metric fluctuations
      setWeaponMetrics((prevMetrics) =>
        prevMetrics.map((w) => {
          const deltaDps = (Math.random() - 0.5) * 40;
          const deltaHeat = (Math.random() - 0.48) * 8;
          return {
            ...w,
            dps: Math.max(100, Math.round(w.dps + deltaDps)),
            heat: Math.min(100, Math.max(10, Math.round(w.heat + deltaHeat)))
          };
        })
      );

      // Dynamic damage vector distribution
      setDamageVectors((prevVectors) => {
        const jitter = (Math.random() - 0.5) * 4;
        return prevVectors.map((v, idx) => ({
          ...v,
          value: Math.max(10, Math.round(v.value + (idx === 0 ? jitter : -jitter / 3)))
        }));
      });

      // Unit Actions and Damage Events for Combat History Log
      const weaponNames = ['Plasma Repeater', 'EMP Disruptor', 'Kinetic Rail Battery', 'Nanite Swarm'];
      const activeWeapon = weaponNames[nextTick % weaponNames.length];
      const isCriticalRoll = Math.random() < 0.22;
      const dealtDmg = Math.round(isCriticalRoll ? baseOutDps * 1.35 : baseOutDps * 0.95);
      const activeDmgType = activeWeapon.includes('Plasma')
        ? 'Thermal'
        : activeWeapon.includes('Rail')
        ? 'Kinetic'
        : activeWeapon.includes('EMP')
        ? 'EMP'
        : 'Nanite';

      // Record Operative unit action
      addCombatHistoryEvent({
        relativeTime: `T+${nextTick * 2}s`,
        tick: nextTick,
        actor: `Operative (${activeWeapon})`,
        target: currentEnemyUnit,
        category: isCriticalRoll ? 'critical' : 'attack',
        action: isCriticalRoll ? 'Critical Armor Penetration' : 'Concentrated Fire Volley',
        damageValue: dealtDmg,
        damageType: activeDmgType,
        message: isCriticalRoll
          ? `CRITICAL HIT: High-yield ${activeDmgType} breach delivering ${dealtDmg} damage to ${currentEnemyUnit}.`
          : `Delivered ${dealtDmg} ${activeDmgType} damage to ${currentEnemyUnit}. Capacitor heat nominal.`
      });

      // Hostile unit action & Operative Shield/Hull Mitigation
      const inDmgTotal = Math.round(baseInDps * 0.85);
      const deflectorMitigated = Math.round(inDmgTotal * (currentDoc.shieldMod * 0.65));
      const hullPenetrated = Math.max(0, inDmgTotal - deflectorMitigated);

      if (deflectorMitigated > 15) {
        addCombatHistoryEvent({
          relativeTime: `T+${nextTick * 2}s`,
          tick: nextTick,
          actor: currentEnemyUnit,
          target: 'Operative Phase-Shield',
          category: 'mitigation',
          action: 'Kinetic Flechette Wave',
          damageValue: hullPenetrated,
          mitigatedValue: deflectorMitigated,
          damageType: 'Kinetic',
          message: `Deflector shield absorbed ${deflectorMitigated} kinetic damage (${Math.min(100, Math.round((deflectorMitigated / inDmgTotal) * 100))}% deflection rate).`
        });
      } else if (hullPenetrated > 0) {
        addCombatHistoryEvent({
          relativeTime: `T+${nextTick * 2}s`,
          tick: nextTick,
          actor: currentEnemyUnit,
          target: 'Operative Composite Hull',
          category: 'damage_taken',
          action: 'Hull Breaching Strike',
          damageValue: hullPenetrated,
          damageType: 'Composite',
          message: `Shield penetration! Hull sustained -${hullPenetrated} structural damage.`
        });
      }

      // Periodic narrative logs
      if (nextTick % 4 === 0) {
        addLog('attack', `Kinetic and plasma trajectory convergence: ${Math.round(baseOutDps)} DPS sustained.`);
      } else if (nextTick % 7 === 0) {
        addLog('defense', `Deflector matrix mitigated ${Math.round(baseInDps * 0.65)} damage. Core temp stable.`);
      }

      // Update time-series for Recharts
      setTelemetryData((prevData) => {
        const newPoint: CombatTelemetryPoint = {
          time: `T+${nextTick * 2}s`,
          tick: nextTick,
          shield: Math.round(shield),
          hull: Math.round(hull),
          hostileHp: Math.round(hostileHp),
          energyCore: Math.round(energyCore),
          outgoingDps: Math.round(baseOutDps),
          incomingDps: Math.round(baseInDps)
        };
        return [...prevData.slice(-15), newPoint];
      });

      return nextTick;
    });
  }, [doctrine, threatLevel, scenario, shield, hull, hostileHp, energyCore, addLog, addCombatHistoryEvent]);

  // Simulation Interval Timer
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = Math.round(900 / simSpeed);
    const timer = setInterval(() => {
      executeSimulationTick();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, simSpeed, executeSimulationTick]);

  // Interactive Tactical Overrides
  const triggerEmpDischarge = () => {
    sound.playClick();
    addLog('emp', 'TACTICAL OVERRIDE: EMP Shockwave detonated! Hostile swarms stunned and armor destabilized.');
    addCombatHistoryEvent({
      relativeTime: `T+${(tick + 1) * 2}s`,
      tick: tick + 1,
      actor: 'Tactical EMP Generator',
      target: `${SCENARIOS[scenario].enemyName} Swarm`,
      category: 'override',
      action: 'EMP Shockwave Burst',
      damageValue: 420,
      damageType: 'EMP',
      message: 'High-frequency pulse detonated (-20 MW). Stunned hostile targeting optics and ionized shields.'
    });
    setHostileHp((prev) => Math.max(10, prev - 25));
    setEnergyCore((prev) => Math.max(15, prev - 20));
    setTelemetryData((prev) => [
      ...prev.slice(-15),
      {
        time: `EMP!`,
        tick: tick + 1,
        shield,
        hull,
        hostileHp: Math.max(10, hostileHp - 25),
        energyCore: Math.max(15, energyCore - 20),
        outgoingDps: 720, // EMP burst spike
        incomingDps: 20
      }
    ]);
  };

  const triggerShieldOvercharge = () => {
    sound.playClick();
    addLog('defense', 'TACTICAL OVERRIDE: Auxiliary Capacitors dumped into Phase-Shield (+35% integrity restored).');
    addCombatHistoryEvent({
      relativeTime: `T+${(tick + 1) * 2}s`,
      tick: tick + 1,
      actor: 'Auxiliary Power Core',
      target: 'Operative Phase-Shield',
      category: 'override',
      action: 'Emergency Capacitor Inversion',
      mitigatedValue: 320,
      damageType: 'Composite',
      message: 'Emergency power dumped into phase coils (-25 MW). Shield integrity boosted by +35%.'
    });
    setShield((prev) => Math.min(100, prev + 35));
    setEnergyCore((prev) => Math.max(10, prev - 25));
  };

  const triggerKineticRailStrike = () => {
    sound.playClick();
    addLog('critical', 'TACTICAL OVERRIDE: Overcharged Kinetic Rail fired! High-velocity hyper-penetration (640 dmg).');
    addCombatHistoryEvent({
      relativeTime: `T+${(tick + 1) * 2}s`,
      tick: tick + 1,
      actor: 'Overcharged Kinetic Railgun',
      target: `${SCENARIOS[scenario].enemyName} Command Vessel`,
      category: 'critical',
      action: 'Tungsten-Core Hyper-Velocity Strike',
      damageValue: 640,
      damageType: 'Kinetic',
      message: 'DIRECT HIT! Catastrophic structural shearing through armored bulkheads at Mach 14.'
    });
    setHostileHp((prev) => Math.max(0, prev - 38));
    setPeakDps((prev) => Math.max(prev, 640));
    setTotalDamageDealt((prev) => prev + 640);
  };

  const resetSimulation = () => {
    sound.playClick();
    setTick(0);
    setShield(95);
    setHull(100);
    setHostileHp(100);
    setEnergyCore(85);
    setHostilesActive(SCENARIOS[scenario].maxHostiles);
    setHostilesEliminated(0);
    setTelemetryData([
      {
        time: 'T+0s',
        tick: 0,
        shield: 95,
        hull: 100,
        hostileHp: 100,
        energyCore: 85,
        outgoingDps: 310,
        incomingDps: 120
      }
    ]);
    addLog('system', `SIMULATION RESET: Re-initializing parameters for ${SCENARIOS[scenario].title}.`);
    setCombatHistory([
      {
        id: 'r1',
        timestamp: new Date().toTimeString().split(' ')[0],
        relativeTime: 'T+00s',
        tick: 0,
        actor: 'Diagnostic Console',
        target: 'Tactical Grid',
        category: 'system',
        action: 'Simulation Parameters Re-initialized',
        message: `Simulation reset for ${SCENARIOS[scenario].title}. Real-time telemetry tracking resumed.`
      }
    ]);
  };

  return (
    <div className="space-y-5 font-sans">
      
      {/* Top Header & Simulation Command Center */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#090b10] border border-cyan-900 shadow-[0_0_25px_rgba(0,255,255,0.08)] relative overflow-hidden">
        <div className="absolute inset-0 gamer-grid opacity-25 z-0 pointer-events-none"></div>
        <div className="scanline-overlay"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyan-400 animate-pulse shadow-[0_0_10px_#0ff]' : 'bg-amber-400'}`}></span>
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-cyan-400" />
                TACTICAL COMBAT SIMULATION ENGINE • RECHARTS LIVE STREAM
              </span>
              <span className="px-1.5 py-0.2 bg-cyan-950/80 border border-cyan-500/50 rounded text-[9px] font-mono text-cyan-300">
                TICK #{tick}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white uppercase glitch" data-text={SCENARIOS[scenario].title}>
              {SCENARIOS[scenario].title}
            </h1>
            <p className="text-xs font-mono text-cyan-500/80 mt-1 max-w-2xl">
              {SCENARIOS[scenario].description}
            </p>
          </div>

          {/* Master Simulation Playback & Speed Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="sim-toggle-play-btn"
              onClick={() => {
                sound.playClick();
                setIsPlaying(!isPlaying);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-bold border transition-all ${
                isPlaying
                  ? 'bg-cyan-500 text-black border-white shadow-[0_0_15px_#0ff]'
                  : 'bg-black text-cyan-400 border-cyan-800 hover:border-cyan-500'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'PAUSE' : 'RESUME'}
            </button>

            <button
              id="sim-step-tick-btn"
              onClick={() => {
                sound.playClick();
                executeSimulationTick();
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-black text-cyan-400 border border-cyan-900 hover:border-cyan-500 font-mono text-xs transition-colors"
              title="Step Single Tick"
            >
              <ChevronRight className="w-3.5 h-3.5" /> STEP
            </button>

            <div className="flex items-center rounded-lg bg-black border border-cyan-900 p-0.5">
              {[1, 2, 4].map((speed) => (
                <button
                  key={speed}
                  onClick={() => {
                    sound.playClick();
                    setSimSpeed(speed);
                  }}
                  className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                    simSpeed === speed
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60'
                      : 'text-slate-500 hover:text-cyan-400'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button
              id="sim-reset-btn"
              onClick={resetSimulation}
              className="p-1.5 rounded-lg bg-black text-slate-400 hover:text-white border border-cyan-900 hover:border-cyan-500 transition-colors"
              title="Reset Simulation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Configuration Bar: Scenario Selector + Tactical Doctrine */}
        <div className="relative z-10 mt-4 pt-3 border-t border-cyan-950/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          
          {/* Scenario Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-cyan-500 uppercase font-bold mr-1">SCENARIO:</span>
            {(Object.keys(SCENARIOS) as CombatScenario[]).map((key) => (
              <button
                key={key}
                onClick={() => {
                  sound.playClick();
                  setScenario(key);
                  setHostilesActive(SCENARIOS[key].maxHostiles);
                  addLog('system', `ENGAGEMENT SHIFT: Transferred tactical focus to ${SCENARIOS[key].title}.`);
                }}
                className={`px-2.5 py-1 rounded border transition-all ${
                  scenario === key
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_10px_rgba(0,255,255,0.2)]'
                    : 'bg-black/60 border-cyan-950 text-slate-400 hover:text-cyan-300 hover:border-cyan-800'
                }`}
              >
                {SCENARIOS[key].title.split(' ')[0]} {SCENARIOS[key].title.split(' ')[1]}
              </button>
            ))}
          </div>

          {/* Tactical Doctrine */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-purple-400 uppercase font-bold mr-1">DOCTRINE:</span>
            {(Object.keys(DOCTRINES) as TacticalDoctrine[]).map((docKey) => (
              <button
                key={docKey}
                onClick={() => {
                  sound.playClick();
                  setDoctrine(docKey);
                  addLog('system', `DOCTRINE SWITCH: Engaged ${DOCTRINES[docKey].label} (${DOCTRINES[docKey].desc}).`);
                }}
                className={`px-2 py-1 rounded border transition-all ${
                  doctrine === docKey
                    ? 'bg-purple-500/20 border-purple-400 text-purple-200 font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'bg-black/60 border-purple-950 text-slate-400 hover:text-purple-300 hover:border-purple-800'
                }`}
              >
                {DOCTRINES[docKey].label}
              </button>
            ))}
          </div>

          {/* Threat Level */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-rose-400 uppercase font-bold mr-1">THREAT:</span>
            {(['tier1', 'tier2', 'tier3'] as ThreatLevel[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  sound.playClick();
                  setThreatLevel(t);
                  addLog('system', `THREAT LEVEL ADJUSTED: Set to ${t.toUpperCase()}.`);
                }}
                className={`px-2 py-0.5 rounded text-[10px] border transition-all ${
                  threatLevel === t
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold'
                    : 'bg-black border-rose-950 text-slate-500 hover:text-rose-400'
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* KPI Real-Time Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Operative Shield */}
        <div className="p-3 rounded-xl bg-[#090b10] border border-cyan-900 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
            <span className="flex items-center gap-1 font-bold">
              <Shield className="w-3 h-3 text-cyan-400" /> SHIELD
            </span>
            <span className="font-bold">{shield}%</span>
          </div>
          <div className="my-2">
            <div className="text-xl font-black font-mono text-white tracking-tight">{shield}<span className="text-xs text-cyan-500">/100</span></div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden border border-cyan-950">
              <div
                className="bg-cyan-400 h-full transition-all duration-300 shadow-[0_0_8px_#0ff]"
                style={{ width: `${shield}%` }}
              ></div>
            </div>
          </div>
          <span className="text-[9px] font-mono text-cyan-600 truncate">
            {shield > 50 ? 'PHASE DEFLECTION NOMINAL' : shield > 20 ? 'SHIELD CRITICAL' : 'OFFLINE'}
          </span>
        </div>

        {/* Card 2: Hull Integrity */}
        <div className="p-3 rounded-xl bg-[#090b10] border border-emerald-900/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
            <span className="flex items-center gap-1 font-bold">
              <Activity className="w-3 h-3 text-emerald-400" /> HULL
            </span>
            <span className="font-bold">{hull}%</span>
          </div>
          <div className="my-2">
            <div className="text-xl font-black font-mono text-white tracking-tight">{hull}<span className="text-xs text-emerald-500">/100</span></div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden border border-emerald-950">
              <div
                className="bg-emerald-400 h-full transition-all duration-300 shadow-[0_0_8px_#10b981]"
                style={{ width: `${hull}%` }}
              ></div>
            </div>
          </div>
          <span className="text-[9px] font-mono text-emerald-600 truncate">REINFORCED COMPOSITE</span>
        </div>

        {/* Card 3: Hostile Target HP */}
        <div className="p-3 rounded-xl bg-[#090b10] border border-rose-900/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono text-rose-400">
            <span className="flex items-center gap-1 font-bold">
              <Crosshair className="w-3 h-3 text-rose-400" /> HOSTILE SWARM
            </span>
            <span className="font-bold">{hostileHp}%</span>
          </div>
          <div className="my-2">
            <div className="text-xl font-black font-mono text-white tracking-tight">{hostileHp}<span className="text-xs text-rose-500">/100</span></div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden border border-rose-950">
              <div
                className="bg-rose-500 h-full transition-all duration-300 shadow-[0_0_8px_#f43f5e]"
                style={{ width: `${hostileHp}%` }}
              ></div>
            </div>
          </div>
          <span className="text-[9px] font-mono text-rose-500 truncate">{hostilesActive} Active Units</span>
        </div>

        {/* Card 4: Energy Core & Capacitors */}
        <div className="p-3 rounded-xl bg-[#090b10] border border-purple-900/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono text-purple-400">
            <span className="flex items-center gap-1 font-bold">
              <Zap className="w-3 h-3 text-purple-400" /> ENERGY CORE
            </span>
            <span className="font-bold">{energyCore}%</span>
          </div>
          <div className="my-2">
            <div className="text-xl font-black font-mono text-white tracking-tight">{energyCore}<span className="text-xs text-purple-500"> MW</span></div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full mt-1.5 overflow-hidden border border-purple-950">
              <div
                className="bg-purple-500 h-full transition-all duration-300 shadow-[0_0_8px_#a855f7]"
                style={{ width: `${energyCore}%` }}
              ></div>
            </div>
          </div>
          <span className="text-[9px] font-mono text-purple-500 truncate">CAPACITOR NOMINAL</span>
        </div>

        {/* Card 5: Current DPS Output */}
        <div className="p-3 rounded-xl bg-[#090b10] border border-yellow-900/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono text-yellow-400">
            <span className="flex items-center gap-1 font-bold">
              <Flame className="w-3 h-3 text-yellow-400" /> PEAK DPS
            </span>
            <span className="font-bold">LIVE</span>
          </div>
          <div className="my-2">
            <div className="text-xl font-black font-mono text-white tracking-tight">{peakDps}<span className="text-xs text-yellow-500"> DPS</span></div>
            <div className="text-[10px] font-mono text-yellow-400/90 mt-1">
              Tot: {(totalDamageDealt / 1000).toFixed(1)}k DMG
            </div>
          </div>
          <span className="text-[9px] font-mono text-yellow-600 truncate">FIREPOWER RATING: A+</span>
        </div>

        {/* Card 6: Neutralized Hostiles */}
        <div className="p-3 rounded-xl bg-[#090b10] border border-cyan-900/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
            <span className="flex items-center gap-1 font-bold">
              <Sparkles className="w-3 h-3 text-cyan-400" /> KILLS
            </span>
            <span className="font-bold">SECURED</span>
          </div>
          <div className="my-2">
            <div className="text-xl font-black font-mono text-white tracking-tight">{hostilesEliminated}<span className="text-xs text-cyan-500"> UNITS</span></div>
            <div className="text-[10px] font-mono text-cyan-400/90 mt-1">
              Sector Clear: {Math.min(100, Math.round((hostilesEliminated / (hostilesEliminated + hostilesActive)) * 100))}%
            </div>
          </div>
          <span className="text-[9px] font-mono text-cyan-600 truncate">TELEMETRY ARCHIVED</span>
        </div>
      </div>

      {/* Main Interactive Charts Area (Powered by Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Chart Column (Left 2 spans) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Main Chart Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#090b10] border border-cyan-900 shadow-[0_0_25px_rgba(0,255,255,0.06)] relative overflow-hidden">
            <div className="absolute inset-0 gamer-grid opacity-15 pointer-events-none z-0"></div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  REAL-TIME COMBAT TELEMETRY STREAM
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white uppercase">
                  {activeChartTab === 'telemetry' && 'Shield Absorption, Core Power & Threat Degradation'}
                  {activeChartTab === 'weapons' && 'Weapon Systems DPS Output & Heat Dissipation'}
                  {activeChartTab === 'vectors' && 'Threat Vector Damage Allocation & Mitigation'}
                </h2>
              </div>

              {/* Chart Mode Sub-Tabs */}
              <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-cyan-900/80">
                <button
                  id="chart-tab-telemetry"
                  onClick={() => {
                    sound.playClick();
                    setActiveChartTab('telemetry');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                    activeChartTab === 'telemetry'
                      ? 'bg-cyan-500 text-black shadow-[0_0_10px_#0ff]'
                      : 'text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  <Layers className="w-3 h-3" /> Telemetry
                </button>
                <button
                  id="chart-tab-weapons"
                  onClick={() => {
                    sound.playClick();
                    setActiveChartTab('weapons');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                    activeChartTab === 'weapons'
                      ? 'bg-cyan-500 text-black shadow-[0_0_10px_#0ff]'
                      : 'text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  <BarChart3 className="w-3 h-3" /> Weapon DPS
                </button>
                <button
                  id="chart-tab-vectors"
                  onClick={() => {
                    sound.playClick();
                    setActiveChartTab('vectors');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                    activeChartTab === 'vectors'
                      ? 'bg-cyan-500 text-black shadow-[0_0_10px_#0ff]'
                      : 'text-slate-400 hover:text-cyan-300'
                  }`}
                >
                  <PieIcon className="w-3 h-3" /> Vectors
                </button>
              </div>
            </div>

            {/* CHART 1: Real-Time Stream AreaChart */}
            {activeChartTab === 'telemetry' && (
              <div className="w-full h-72 sm:h-80 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={telemetryData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="hostileGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="coreGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.08)" vertical={false} />
                    
                    <XAxis
                      dataKey="time"
                      stroke="#475569"
                      fontSize={11}
                      fontFamily="monospace"
                      tickLine={false}
                    />
                    
                    <YAxis
                      domain={[0, 100]}
                      stroke="#475569"
                      fontSize={11}
                      fontFamily="monospace"
                      tickLine={false}
                    />

                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="p-2.5 rounded-lg bg-[#090b10] border border-cyan-500/60 shadow-[0_0_15px_rgba(0,255,255,0.3)] font-mono text-xs space-y-1">
                              <div className="text-[10px] text-cyan-400 font-bold border-b border-cyan-900 pb-1">
                                TIME INDEX: {label}
                              </div>
                              {payload.map((entry, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-3 text-[11px]">
                                  <span style={{ color: entry.color }} className="font-semibold">
                                    {entry.name}:
                                  </span>
                                  <span className="text-white font-bold">{entry.value}%</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    <Legend
                      wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'monospace' }}
                    />

                    <Area
                      type="monotone"
                      dataKey="shield"
                      name="Operative Shield"
                      stroke="#00f0ff"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#shieldGrad)"
                      dot={{ stroke: '#00f0ff', strokeWidth: 2, r: 2, fill: '#000' }}
                      activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2, fill: '#00f0ff' }}
                    />

                    <Area
                      type="monotone"
                      dataKey="hostileHp"
                      name="Hostile Swarm HP"
                      stroke="#f43f5e"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#hostileGrad)"
                      dot={{ stroke: '#f43f5e', strokeWidth: 2, r: 2, fill: '#000' }}
                    />

                    <Area
                      type="monotone"
                      dataKey="energyCore"
                      name="Energy Core"
                      stroke="#a855f7"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#coreGrad)"
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* CHART 2: Weapon Systems BarChart */}
            {activeChartTab === 'weapons' && (
              <div className="w-full h-72 sm:h-80 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weaponMetrics} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 255, 255, 0.08)" vertical={false} />
                    
                    <XAxis
                      dataKey="name"
                      stroke="#475569"
                      fontSize={11}
                      fontFamily="monospace"
                      tickLine={false}
                    />

                    <YAxis
                      stroke="#475569"
                      fontSize={11}
                      fontFamily="monospace"
                      tickLine={false}
                    />

                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="p-2.5 rounded-lg bg-[#090b10] border border-cyan-500/60 shadow-lg font-mono text-xs space-y-1">
                              <div className="text-[10px] text-cyan-400 font-bold border-b border-cyan-900 pb-1">
                                {label}
                              </div>
                              {payload.map((entry, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-3 text-[11px]">
                                  <span style={{ color: entry.color }}>{entry.name}:</span>
                                  <span className="text-white font-bold">{entry.value}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'monospace' }} />

                    <Bar dataKey="dps" name="Firepower Output (DPS)" fill="#00f0ff" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="heat" name="Capacitor Heat (%)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* CHART 3: Damage Vectors PieChart */}
            {activeChartTab === 'vectors' && (
              <div className="w-full h-72 sm:h-80 relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <div className="w-full sm:w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={damageVectors}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {damageVectors.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="#000"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload as DamageVector;
                            return (
                              <div className="p-2 rounded bg-[#090b10] border border-cyan-500 text-xs font-mono">
                                <div className="font-bold" style={{ color: data.color }}>{data.name}</div>
                                <div className="text-white">Share: {data.value}%</div>
                                <div className="text-emerald-400">Shield Deflected: {data.mitigated}%</div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Legend Breakdown */}
                <div className="w-full sm:w-1/2 space-y-2 font-mono text-xs pr-2">
                  <div className="text-[10px] text-cyan-500 font-bold uppercase tracking-wider mb-2">
                    INCOMING ENGAGEMENT COMPOSITION
                  </div>
                  {damageVectors.map((vector) => (
                    <div key={vector.name} className="p-2 rounded bg-black/60 border border-cyan-950 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: vector.color }}></span>
                        <span className="text-slate-300 text-[11px]">{vector.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{vector.value}%</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1 py-0.2 rounded border border-emerald-800/40">
                          -{vector.mitigated}% Defl
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Secondary Telemetry: Instantaneous DPS vs Incoming DPS LineChart */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-cyan-900 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400">
                <Activity className="w-3.5 h-3.5" /> LIVE DPS VELOCITY vs INCOMING THREAT IMPACT
              </div>
              <span className="text-[10px] font-mono text-slate-500">Dual Differential Delta</span>
            </div>

            <div className="w-full h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryData} margin={{ top: 5, right: 15, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="rgba(0, 255, 255, 0.05)" vertical={false} />
                  <XAxis dataKey="time" stroke="#334155" fontSize={10} fontFamily="monospace" />
                  <YAxis stroke="#334155" fontSize={10} fontFamily="monospace" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-2 rounded bg-[#090b10] border border-cyan-500 font-mono text-xs">
                            {payload.map((p, i) => (
                              <div key={i} style={{ color: p.color }}>
                                {p.name}: {p.value} DPS
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line type="monotone" dataKey="outgoingDps" name="Operative DPS" stroke="#00f0ff" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="incomingDps" name="Incoming Threat DPS" stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Tactical Controls & Combat Log Column (Right 1 span) */}
        <div className="space-y-4">
          
          {/* Tactical Overrides Panel */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-cyan-900 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-3 border-b border-cyan-950 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> TACTICAL OVERRIDES
              </div>
              <span className="text-[10px] font-mono text-cyan-500 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">
                ACTIVE
              </span>
            </div>

            <div className="space-y-2">
              <button
                id="tactical-btn-emp"
                onClick={triggerEmpDischarge}
                className="w-full p-2.5 rounded-lg bg-black hover:bg-cyan-950/40 border border-cyan-700 hover:border-cyan-400 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 group-hover:shadow-[0_0_10px_#0ff]">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-cyan-300 font-mono">EMP Shockwave</div>
                    <div className="text-[10px] text-slate-400 font-mono">Stun Swarm & Disrupt Shields</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
                  -20 MW
                </span>
              </button>

              <button
                id="tactical-btn-shield-overcharge"
                onClick={triggerShieldOvercharge}
                className="w-full p-2.5 rounded-lg bg-black hover:bg-emerald-950/40 border border-emerald-700 hover:border-emerald-400 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 group-hover:shadow-[0_0_10px_#10b981]">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 font-mono">Shield Overcharge</div>
                    <div className="text-[10px] text-slate-400 font-mono">Restore +35% Phase Deflection</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                  -25 MW
                </span>
              </button>

              <button
                id="tactical-btn-rail-strike"
                onClick={triggerKineticRailStrike}
                className="w-full p-2.5 rounded-lg bg-black hover:bg-rose-950/40 border border-rose-700 hover:border-rose-400 text-left flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-rose-950 border border-rose-500/50 flex items-center justify-center text-rose-400 group-hover:shadow-[0_0_10px_#f43f5e]">
                    <Crosshair className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-rose-300 font-mono">Kinetic Railgun</div>
                    <div className="text-[10px] text-slate-400 font-mono">Overcharged Critical Strike</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/80 px-1.5 py-0.5 rounded border border-rose-800">
                  640 DMG
                </span>
              </button>
            </div>
          </div>

          {/* Real-Time Combat Event Log Terminal */}
          <div className="p-4 rounded-xl bg-[#090b10] border border-cyan-900 shadow-md flex flex-col h-[320px]">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-950 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" /> COMBAT ENGAGEMENT LOG
              </div>
              <span className="text-[9px] font-mono text-slate-500">AUTO-STREAM</span>
            </div>

            {/* Scrollable Log Feed */}
            <div
              ref={logContainerRef}
              className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-[11px] select-text scrollbar-thin"
            >
              {logs.map((item) => {
                let badgeStyle = 'text-cyan-400 bg-cyan-950/80 border-cyan-800';
                if (item.type === 'defense') badgeStyle = 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
                if (item.type === 'emp') badgeStyle = 'text-purple-400 bg-purple-950/80 border-purple-800';
                if (item.type === 'critical') badgeStyle = 'text-yellow-400 bg-yellow-950/80 border-yellow-800';
                if (item.type === 'kill') badgeStyle = 'text-rose-400 bg-rose-950/80 border-rose-800 font-bold';

                return (
                  <div key={item.id} className="p-1.5 rounded bg-black/60 border border-slate-900 flex flex-col gap-0.5 leading-snug">
                    <div className="flex items-center justify-between text-[9px] text-slate-500">
                      <span>[{item.timestamp}]</span>
                      <span className={`px-1 rounded border uppercase text-[8px] ${badgeStyle}`}>
                        {item.type}
                      </span>
                    </div>
                    <span className="text-slate-300">{item.message}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-cyan-950 mt-1 flex items-center justify-between text-[10px] font-mono text-cyan-600">
              <span className="flex items-center gap-1">
                <Radio className="w-3 h-3 text-cyan-500 animate-pulse" /> LINKED TO GAME NODE
              </span>
              <span>BUFFER: 35 ENTRIES</span>
            </div>
          </div>

        </div>

      </div>

      {/* Scrollable 'Combat History Log' Panel below the Tactical Combat Simulation Recharts Graphs */}
      <CombatHistoryLog
        history={combatHistory}
        onClearHistory={() => {
          const now = new Date();
          const ts = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
          setCombatHistory([
            {
              id: Math.random().toString(36).substring(2, 9),
              timestamp: ts,
              relativeTime: `T+${tick * 2}s`,
              tick,
              actor: 'Diagnostic Console',
              target: 'Combat History Buffer',
              category: 'system',
              action: 'Log Buffer Cleared',
              message: 'Combat history log cleared by operator. Active tracking resumed.'
            }
          ]);
        }}
        scenarioName={SCENARIOS[scenario].title}
      />

    </div>
  );
};
