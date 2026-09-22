import React, { useEffect, useRef, useState } from 'react';
import {
  Building2,
  Car,
  Check,
  Crosshair,
  Hospital,
  Map as MapIcon,
  MapPin,
  MessageSquare,
  Navigation,
  Package,
  RotateCcw,
  TrainFront,
  Waves,
} from 'lucide-react';
import { PlayerProgress } from '../types';

interface PlayViewProps {
  progress: PlayerProgress;
  setProgress: React.Dispatch<React.SetStateAction<PlayerProgress>>;
}

type Position = { x: number; y: number };

type PlayStage =
  | 'spawned'
  | 'vehicle-reached'
  | 'driving'
  | 'washington-reached'
  | 'station-reached'
  | 'harbor-point-reached';

const SPAWN: Position = { x: 15, y: 69 };
const VEHICLE: Position = { x: 29, y: 62 };
const WASHINGTON: Position = { x: 47, y: 49 };
const STATION: Position = { x: 65, y: 38 };
const HARBOR_POINT: Position = { x: 82, y: 70 };

const distance = (a: Position, b: Position) => Math.hypot(a.x - b.x, a.y - b.y);

const goldPanel =
  'border border-[#d8b35a]/45 bg-black/72 shadow-[0_18px_45px_rgba(0,0,0,.38),0_0_24px_rgba(216,179,90,.06)] backdrop-blur-md';

export const PlayView: React.FC<PlayViewProps> = ({ progress, setProgress }) => {
  const [position, setPosition] = useState<Position>(SPAWN);
  const [stage, setStage] = useState<PlayStage>('spawned');
  const [isDriving, setIsDriving] = useState(false);
  const [notice, setNotice] = useState(
    'Spawned at Stamford Hospital. Reach the vehicle staging area to begin the Stamford corridor run.'
  );
  const pressed = useRef<Set<string>>(new Set());

  const nearVehicle = distance(position, VEHICLE) < 7;
  const nearWashington = distance(position, WASHINGTON) < 8;
  const nearStation = distance(position, STATION) < 8;
  const nearHarborPoint = distance(position, HARBOR_POINT) < 9;

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift', 'f'].includes(key)) {
        event.preventDefault();
      }
      pressed.current.add(key);

      if (key === 'f' && nearVehicle && !isDriving) {
        setIsDriving(true);
        setStage('driving');
        setNotice('Vehicle engaged. Follow the illuminated route toward Washington Boulevard.');
        setProgress((current) => ({
          ...current,
          hasVehicleUnlocked: true,
          lastWarpLocation: 'Stamford Hospital Vehicle Staging',
        }));
      } else if (key === 'f' && isDriving) {
        setIsDriving(false);
        setNotice('Vehicle exited. Press F near the vehicle marker to re-enter.');
      }
    };

    const up = (event: KeyboardEvent) => pressed.current.delete(event.key.toLowerCase());
    window.addEventListener('keydown', down, { passive: false });
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [isDriving, nearVehicle, setProgress]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      let dx = 0;
      let dy = 0;
      const keys = pressed.current;

      if (keys.has('w') || keys.has('arrowup')) dy -= 1;
      if (keys.has('s') || keys.has('arrowdown')) dy += 1;
      if (keys.has('a') || keys.has('arrowleft')) dx -= 1;
      if (keys.has('d') || keys.has('arrowright')) dx += 1;
      if (!dx && !dy) return;

      const magnitude = Math.hypot(dx, dy) || 1;
      const sprinting = keys.has('shift');
      const speed = isDriving ? 2.2 : sprinting ? 1.35 : 0.85;

      setPosition((current) => ({
        x: Math.max(3, Math.min(97, current.x + (dx / magnitude) * speed)),
        y: Math.max(4, Math.min(94, current.y + (dy / magnitude) * speed)),
      }));
    }, 50);

    return () => window.clearInterval(timer);
  }, [isDriving]);

  useEffect(() => {
    if (stage === 'spawned' && nearVehicle) {
      setStage('vehicle-reached');
      setNotice('Vehicle staging reached. Press F to enter the prototype vehicle.');
      return;
    }

    if (!isDriving) return;

    if (nearHarborPoint && stage !== 'harbor-point-reached') {
      setStage('harbor-point-reached');
      setNotice('Harbor Point reached. Stamford corridor route test complete.');
      setProgress((current) => ({ ...current, lastWarpLocation: 'Harbor Point, Stamford' }));
      return;
    }

    if (nearStation && !['station-reached', 'harbor-point-reached'].includes(stage)) {
      setStage('station-reached');
      setNotice('Stamford Station reached. Continue south toward Harbor Point.');
      setProgress((current) => ({ ...current, lastWarpLocation: 'Stamford Station' }));
      return;
    }

    if (nearWashington && ['driving', 'vehicle-reached'].includes(stage)) {
      setStage('washington-reached');
      setNotice('Washington Boulevard corridor reached. Continue toward Stamford Station.');
      setProgress((current) => ({ ...current, lastWarpLocation: 'Washington Boulevard, Stamford' }));
    }
  }, [isDriving, nearHarborPoint, nearStation, nearWashington, setProgress, stage]);

  const moveButton = (key: string, active: boolean) => {
    if (active) pressed.current.add(key);
    else pressed.current.delete(key);
  };

  const toggleVehicle = () => {
    if (nearVehicle && !isDriving) {
      setIsDriving(true);
      setStage('driving');
      setNotice('Vehicle engaged. Follow the illuminated route toward Washington Boulevard.');
      setProgress((current) => ({
        ...current,
        hasVehicleUnlocked: true,
        lastWarpLocation: 'Stamford Hospital Vehicle Staging',
      }));
    } else if (isDriving) {
      setIsDriving(false);
      setNotice('Vehicle exited.');
    }
  };

  const reset = () => {
    pressed.current.clear();
    setPosition(SPAWN);
    setStage('spawned');
    setIsDriving(false);
    setNotice('Spawned at Stamford Hospital. Reach the vehicle staging area to begin the Stamford corridor run.');
    setProgress((current) => ({ ...current, lastWarpLocation: 'Stamford Hospital' }));
  };

  const objective =
    stage === 'spawned'
      ? 'Walk from Stamford Hospital to the vehicle staging area.'
      : stage === 'vehicle-reached'
        ? 'Press F to enter the vehicle.'
        : stage === 'driving'
          ? 'Drive toward Washington Boulevard.'
          : stage === 'washington-reached'
            ? 'Continue along the corridor to Stamford Station.'
            : stage === 'station-reached'
              ? 'Continue south from Stamford Station toward Harbor Point.'
              : 'Route complete — Stamford Hospital → Washington Blvd → Stamford Station → Harbor Point.';

  const progressPercent =
    stage === 'spawned'
      ? 15
      : stage === 'vehicle-reached'
        ? 30
        : stage === 'driving'
          ? 45
          : stage === 'washington-reached'
            ? 65
            : stage === 'station-reached'
              ? 82
              : 100;

  const reachedVehicle = stage !== 'spawned';
  const reachedWashington = ['washington-reached', 'station-reached', 'harbor-point-reached'].includes(stage);
  const reachedStation = ['station-reached', 'harbor-point-reached'].includes(stage);
  const reachedHarbor = stage === 'harbor-point-reached';

  const missionSteps = [
    ['Spawn at Stamford Hospital', true],
    ['Reach vehicle staging', reachedVehicle],
    ['Drive Washington Boulevard', reachedWashington],
    ['Reach Stamford Station', reachedStation],
    ['Finish at Harbor Point', reachedHarbor],
  ] as const;

  return (
    <div className="font-mono text-[#f5f1e8]">
      <section className="relative min-h-[780px] overflow-hidden rounded-[24px] border border-[#d8b35a]/35 bg-[#05070b] shadow-[0_28px_80px_rgba(0,0,0,.55)]">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 18%, rgba(111,60,255,.26), transparent 34%), radial-gradient(circle at 70% 70%, rgba(34,211,238,.14), transparent 30%), linear-gradient(180deg,#111827 0%,#07090f 44%,#030406 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'linear-gradient(rgba(216,179,90,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(216,179,90,.07) 1px, transparent 1px)',
            backgroundSize: '34px 34px',
            maskImage: 'linear-gradient(to bottom, black, transparent 88%)',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/85 to-transparent" />

        <div className="pointer-events-none absolute left-1/2 top-5 z-30 -translate-x-1/2 text-center" aria-label="ONEGODIA: RISE OF THE DIGITAL WORLD">
          <span className="sr-only">ONEGODIA: RISE OF THE DIGITAL WORLD</span>
          <div className="text-xl font-semibold tracking-[0.42em] text-[#f0d98a] sm:text-3xl">ONEGODIA™</div>
          <div className="mt-1 text-[8px] tracking-[0.55em] text-white/75 sm:text-[10px]">RISE OF THE DIGITAL WORLD</div>
        </div>

        <div className={`absolute left-4 top-4 z-40 w-[300px] max-w-[calc(100%-2rem)] rounded-2xl p-3 ${goldPanel}`}>
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#f0d98a]/60 bg-[#15111f] text-lg font-black text-[#f0d98a]">G</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="truncate text-sm font-bold text-white">Gregory · Dev Profile</div>
                <div className="text-[9px] text-[#f0d98a]">BUILD V1</div>
              </div>
              <div className="mt-2 grid grid-cols-[28px_1fr] items-center gap-x-2 gap-y-1 text-[9px]">
                <span className="text-slate-400">HP</span>
                <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-full bg-red-500/80" /></div>
                <span className="text-slate-400">EN</span>
                <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-full bg-cyan-400/80" /></div>
              </div>
              <div className="mt-1 text-right text-[8px] text-slate-500">HUD prototype values · not durable combat stats</div>
            </div>
          </div>
        </div>

        <div className={`absolute left-4 top-[118px] z-40 w-[350px] max-w-[calc(100%-2rem)] rounded-2xl p-3 ${goldPanel}`}>
          <div className="text-[10px] font-bold tracking-[0.08em] text-[#f0d98a]">MISSION 001 · REBUILDING SIGNAL</div>
          <div className="mt-1 text-[9px] text-slate-400">Current playable leg · Stamford Corridor Route Proof</div>
          <div className="mt-3 space-y-1.5">
            {missionSteps.map(([label, complete]) => (
              <div key={label} className="flex items-center gap-2 text-[9px] text-slate-200">
                <span className={`grid h-4 w-4 place-items-center rounded border ${complete ? 'border-emerald-400/70 bg-emerald-500/20 text-emerald-300' : 'border-white/20 text-transparent'}`}>
                  <Check className="h-3 w-3" />
                </span>
                <span className={complete ? 'text-slate-300' : 'text-white'}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute right-4 top-4 z-40 flex w-[260px] max-w-[calc(100%-2rem)] flex-col items-end gap-3">
          <div className={`relative h-44 w-44 overflow-hidden rounded-full p-4 ${goldPanel}`}>
            <div className="absolute inset-[12px] rounded-full border border-[#d8b35a]/35 bg-[#0a0e16]" />
            <div className="absolute left-1/2 top-1/2 h-[1px] w-28 -translate-x-1/2 rotate-[18deg] bg-cyan-400/35" />
            <div className="absolute left-1/2 top-1/2 h-28 w-[1px] -translate-y-1/2 rotate-[18deg] bg-cyan-400/25" />
            <div className="absolute left-[25%] top-[58%] h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.9)]" />
            <div className="absolute left-[48%] top-[43%] h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,.9)]" />
            <div className="absolute left-[66%] top-[32%] h-2 w-2 rounded-full bg-blue-400" />
            <div className="absolute left-[78%] top-[63%] h-2 w-2 rounded-full bg-purple-400" />
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-[#f0d98a]">▲</div>
            <div className="absolute left-1/2 top-1 -translate-x-1/2 text-[9px] text-[#f0d98a]">N</div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] text-[#f0d98a]">S</div>
            <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[9px] text-[#f0d98a]">W</div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-[#f0d98a]">E</div>
          </div>
          <div className={`w-full rounded-xl px-3 py-2 text-right ${goldPanel}`}>
            <div className="text-xs font-bold text-white">STAMFORD DISTRICT</div>
            <div className="text-[9px] text-slate-400">Browser V1 · Route Simulation</div>
          </div>
        </div>

        <div className="absolute right-4 top-[262px] z-40 hidden w-[210px] space-y-2 xl:block">
          {[
            ['BUSINESSES', Building2],
            ['INVENTORY', Package],
            ['MAP', MapIcon],
            ['MESSAGES', MessageSquare],
          ].map(([label, Icon]) => (
            <div key={String(label)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[10px] font-bold ${goldPanel}`}>
              <Icon className="h-4 w-4 text-[#f0d98a]" />
              <span>{String(label)}</span>
            </div>
          ))}
        </div>

        <section
          tabIndex={0}
          className="absolute inset-x-4 bottom-36 top-[286px] z-10 overflow-hidden rounded-[22px] border border-white/10 bg-[#060a0f]/75 outline-none focus:border-[#d8b35a]/70 sm:inset-x-[10%] sm:bottom-32 sm:top-[190px] lg:inset-x-[18%] lg:top-[170px] xl:right-[250px] xl:left-[220px]"
          aria-label="Playable Stamford corridor prototype map"
        >
          <div
            className="absolute inset-0 opacity-55"
            style={{
              background:
                'radial-gradient(circle at 42% 36%, rgba(111,60,255,.42), transparent 14%), radial-gradient(circle at 68% 66%, rgba(34,211,238,.2), transparent 18%), linear-gradient(135deg, rgba(10,20,35,.96), rgba(4,6,10,.98))',
            }}
          />
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                'linear-gradient(rgba(34,211,238,.09) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.09) 1px, transparent 1px)',
              backgroundSize: '38px 38px',
            }}
          />

          <div className="absolute left-[7%] top-[57%] h-[24%] w-[20%] min-w-[110px] rounded-xl border border-emerald-400/45 bg-emerald-950/35 p-3">
            <Hospital className="h-5 w-5 text-emerald-300" />
            <div className="mt-1 text-[10px] font-bold text-emerald-100">STAMFORD HOSPITAL</div>
            <div className="text-[8px] text-emerald-400">Canonical Player Spawn</div>
          </div>

          <div className="absolute left-[24%] top-[52%] h-[17%] w-[17%] min-w-[100px] rounded-xl border border-[#d8b35a]/45 bg-[#5a4318]/25 p-3">
            <Car className="h-5 w-5 text-[#f0d98a]" />
            <div className="mt-1 text-[10px] font-bold text-[#f0d98a]">VEHICLE STAGING</div>
            <div className="text-[8px] text-[#d8b35a]">Press F when nearby</div>
          </div>

          <div className="absolute left-[39%] top-[40%] h-[17%] w-[20%] min-w-[115px] rounded-xl border border-cyan-400/35 bg-cyan-950/20 p-3">
            <Building2 className="h-5 w-5 text-cyan-300" />
            <div className="mt-1 text-[10px] font-bold text-cyan-100">WASHINGTON BLVD</div>
            <div className="text-[8px] text-cyan-500">Corridor checkpoint</div>
          </div>

          <div className="absolute left-[58%] top-[25%] h-[19%] w-[21%] min-w-[115px] rounded-xl border border-blue-400/40 bg-blue-950/25 p-3">
            <TrainFront className="h-5 w-5 text-blue-300" />
            <div className="mt-1 text-[10px] font-bold text-blue-100">STAMFORD STATION</div>
            <div className="text-[8px] text-blue-500">Transit landmark</div>
          </div>

          <div className="absolute left-[75%] top-[61%] h-[20%] w-[20%] min-w-[110px] rounded-xl border border-purple-400/40 bg-purple-950/25 p-3">
            <Waves className="h-5 w-5 text-purple-300" />
            <div className="mt-1 text-[10px] font-bold text-purple-100">HARBOR POINT</div>
            <div className="text-[8px] text-purple-400">Route destination</div>
          </div>

          <div className="absolute left-[20%] top-[60%] h-[5%] w-[32%] -rotate-[20deg] rounded-full border-y border-[#d8b35a]/20 bg-slate-500/25" />
          <div className="absolute left-[46%] top-[43%] h-[5%] w-[25%] -rotate-[28deg] rounded-full border-y border-[#d8b35a]/20 bg-slate-500/25" />
          <div className="absolute left-[66%] top-[47%] h-[5%] w-[24%] rotate-[43deg] rounded-full border-y border-[#d8b35a]/20 bg-slate-500/25" />

          <div
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-75 ${
              isDriving
                ? 'h-7 w-10 rounded-md border border-[#f0d98a] bg-[#d8b35a] shadow-[0_0_20px_rgba(240,217,138,.78)]'
                : 'h-5 w-5 rounded-full border-2 border-white bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,.95)]'
            }`}
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            title={isDriving ? 'Player vehicle' : 'Player'}
          >
            {!isDriving && <div className="absolute inset-[5px] rounded-full bg-slate-950" />}
          </div>

          <div className="absolute left-3 top-3 rounded-lg border border-[#d8b35a]/30 bg-black/75 px-3 py-2 text-[9px] text-[#f0d98a] backdrop-blur">
            <div className="flex items-center gap-1.5 font-bold"><Crosshair className="h-3 w-3" /> LIVE POSITION</div>
            <div className="mt-1 text-slate-400">X {position.x.toFixed(1)} / Y {position.y.toFixed(1)}</div>
            <div className={isDriving ? 'text-[#f0d98a]' : 'text-emerald-300'}>{isDriving ? 'DRIVING' : 'ON FOOT'}</div>
          </div>

          <div className="absolute bottom-3 left-3 right-3 rounded-lg border border-[#d8b35a]/25 bg-black/82 px-3 py-2 text-[10px] text-slate-200 backdrop-blur">
            {notice}
          </div>
        </section>

        <div className={`absolute bottom-4 left-4 z-40 w-[245px] max-w-[calc(50%-1.5rem)] rounded-2xl p-3 ${goldPanel}`}>
          <div className="grid grid-cols-[1fr_auto] gap-y-1 text-[9px]">
            <span className="text-slate-400">CREDITS</span><span className="text-[#f0d98a]">{progress.credits.toLocaleString()}</span>
            <span className="text-slate-400">ODC ROADMAP</span><span className="text-purple-300">{progress.odcSimulatedBalance} · SIM</span>
            <span className="text-slate-400">PROTOTYPE XP</span><span className="text-cyan-300">{progressPercent * 100}</span>
          </div>
          <div className="mt-2 text-[8px] leading-relaxed text-slate-500">ODC remains simulated / compliance-locked in the current game build.</div>
        </div>

        <div className={`absolute bottom-4 left-1/2 z-40 hidden -translate-x-1/2 rounded-2xl px-3 py-2 md:flex ${goldPanel}`}>
          {[
            ['F', isDriving ? 'Exit' : 'Interact'],
            ['Space', 'Jump'],
            ['Shift', 'Sprint'],
            ['V', 'Drive'],
            ['B', 'Build · Roadmap'],
            ['Tab', 'Phone / Menu'],
          ].map(([key, label]) => (
            <div key={key} className="min-w-[72px] border-r border-white/10 px-2 text-center last:border-r-0">
              <div className="mx-auto grid h-6 min-w-6 place-items-center rounded border border-[#d8b35a]/35 bg-white/5 px-1 text-[8px] text-[#f0d98a]">{key}</div>
              <div className="mt-1 text-[8px] text-slate-300">{label}</div>
            </div>
          ))}
        </div>

        <div className={`absolute bottom-4 right-4 z-40 w-[230px] max-w-[calc(50%-1.5rem)] rounded-2xl p-3 ${goldPanel}`}>
          <div className="flex items-center justify-between">
            <div className="text-[9px] font-bold text-white">QUICK SLOTS</div>
            <div className="text-[8px] text-slate-500">UI PREVIEW</div>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {[
              ['1', 'SCAN'],
              ['2', `DATA ${progress.collectedFragments.length}`],
              ['3', 'AID'],
              ['4', '+'],
            ].map(([slot, label]) => (
              <div key={slot} className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
                <div className="text-[8px] text-[#f0d98a]">{slot}</div>
                <div className="mt-1 text-[7px] text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_360px]">
        <div className={`rounded-2xl p-4 ${goldPanel}`}>
          <div className="flex items-center gap-2 text-xs font-bold text-white"><Navigation className="h-4 w-4 text-[#f0d98a]" /> CURRENT OBJECTIVE</div>
          <p className="mt-2 text-sm leading-relaxed text-slate-300 font-sans">{objective}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded bg-slate-800"><div className="h-full bg-[#d8b35a] transition-all" style={{ width: `${progressPercent}%` }} /></div>
          <div className="mt-2 flex items-center gap-2 text-[9px] text-slate-500"><MapPin className="h-3 w-3" /> {progress.lastWarpLocation}</div>
        </div>

        <div className={`rounded-2xl p-4 ${goldPanel}`}>
          <div className="text-xs font-bold text-white">TOUCH / FALLBACK CONTROLS</div>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[10px]">
            <div />
            <button onPointerDown={() => moveButton('w', true)} onPointerUp={() => moveButton('w', false)} onPointerLeave={() => moveButton('w', false)} className="rounded border border-[#d8b35a]/30 bg-white/5 p-3 hover:border-[#d8b35a]">W</button>
            <div />
            <button onPointerDown={() => moveButton('a', true)} onPointerUp={() => moveButton('a', false)} onPointerLeave={() => moveButton('a', false)} className="rounded border border-[#d8b35a]/30 bg-white/5 p-3 hover:border-[#d8b35a]">A</button>
            <button onPointerDown={() => moveButton('s', true)} onPointerUp={() => moveButton('s', false)} onPointerLeave={() => moveButton('s', false)} className="rounded border border-[#d8b35a]/30 bg-white/5 p-3 hover:border-[#d8b35a]">S</button>
            <button onPointerDown={() => moveButton('d', true)} onPointerUp={() => moveButton('d', false)} onPointerLeave={() => moveButton('d', false)} className="rounded border border-[#d8b35a]/30 bg-white/5 p-3 hover:border-[#d8b35a]">D</button>
          </div>
          <button onClick={toggleVehicle} disabled={!nearVehicle && !isDriving} className="mt-2 w-full rounded border border-[#d8b35a]/40 bg-[#5a4318]/20 px-3 py-2 text-[10px] font-bold text-[#f0d98a] disabled:cursor-not-allowed disabled:opacity-40">
            {isDriving ? 'F — EXIT VEHICLE' : 'F — ENTER VEHICLE'}
          </button>
          <button onClick={reset} className="mt-2 flex w-full items-center justify-center gap-2 rounded border border-white/15 bg-white/5 px-3 py-2 text-[10px] text-slate-300 hover:border-[#d8b35a]/60">
            <RotateCcw className="h-3 w-3" /> RESET TO STAMFORD HOSPITAL
          </button>
        </div>
      </section>

      <div className="mt-3 rounded-xl border border-[#d8b35a]/20 bg-black/35 p-3 text-[9px] leading-relaxed text-slate-500">
        HUD status boundary: the browser runtime keeps the current playable Stamford route, movement and vehicle handoff. HP/EN, quick slots, businesses, build actions and ODC presentation are interface previews unless a separately verified gameplay system supports them. Durable identity, missions, inventory, progression and zone state remain assigned to Onegodia Game Services; Unreal remains the high-fidelity client in parallel.
      </div>
    </div>
  );
};
