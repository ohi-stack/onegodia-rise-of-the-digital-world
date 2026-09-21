import React, { useEffect, useRef, useState } from 'react';
import {
  Building2,
  Car,
  Crosshair,
  Hospital,
  MapPin,
  Navigation,
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
        setNotice('Vehicle engaged. Follow the route toward Washington Boulevard.');
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
      setNotice('Vehicle engaged. Follow the route toward Washington Boulevard.');
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

  return (
    <div className="space-y-4 font-mono">
      <section className="rounded-xl border border-cyan-500/30 bg-[#080b10] p-4 sm:p-5 shadow-[0_0_30px_rgba(0,255,255,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-400">Onegodia Web Game V1 · World Gate</div>
            <h1 className="mt-1 text-xl sm:text-2xl font-black text-white">Stamford Hospital → Harbor Point Corridor</h1>
            <p className="mt-1 max-w-3xl text-xs sm:text-sm text-slate-400 font-sans">
              Playable browser runtime for Stamford. Stamford Hospital is the canonical safe spawn. Browser progression will migrate from local development state to shared Onegodia Game Services so the web and Unreal clients can consume the same durable player record.
            </p>
          </div>
          <div className="flex gap-2 text-[10px]">
            <span className="rounded border border-emerald-500/40 bg-emerald-950/30 px-2 py-1 text-emerald-300">PLAYABLE WEB V1</span>
            <span className="rounded border border-blue-500/40 bg-blue-950/30 px-2 py-1 text-blue-300">UNREAL IN PARALLEL</span>
            <span className="rounded border border-purple-500/40 bg-purple-950/30 px-2 py-1 text-purple-300">GAME SERVICES NEXT</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <section
          tabIndex={0}
          className="relative min-h-[560px] overflow-hidden rounded-xl border border-[#27314a] bg-[#060a0f] outline-none focus:border-cyan-500/60"
          aria-label="Playable Stamford corridor prototype map"
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,.08) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="absolute left-[7%] top-[57%] h-[24%] w-[20%] rounded-lg border border-emerald-400/50 bg-emerald-950/35 p-3">
            <Hospital className="h-5 w-5 text-emerald-300" />
            <div className="mt-1 text-[11px] font-bold text-emerald-200">STAMFORD HOSPITAL</div>
            <div className="text-[9px] text-emerald-500">Canonical Player Spawn</div>
          </div>

          <div className="absolute left-[24%] top-[52%] h-[17%] w-[17%] rounded-lg border border-amber-400/40 bg-amber-950/25 p-3">
            <Car className="h-5 w-5 text-amber-300" />
            <div className="mt-1 text-[11px] font-bold text-amber-200">VEHICLE STAGING</div>
            <div className="text-[9px] text-amber-500">Press F when nearby</div>
          </div>

          <div className="absolute left-[39%] top-[40%] h-[17%] w-[20%] rounded-lg border border-cyan-400/40 bg-cyan-950/20 p-3">
            <Building2 className="h-5 w-5 text-cyan-300" />
            <div className="mt-1 text-[11px] font-bold text-cyan-100">WASHINGTON BLVD</div>
            <div className="text-[9px] text-cyan-500">430 Washington Blvd / rail approach</div>
          </div>

          <div className="absolute left-[58%] top-[25%] h-[19%] w-[21%] rounded-lg border border-blue-400/45 bg-blue-950/25 p-3">
            <TrainFront className="h-5 w-5 text-blue-300" />
            <div className="mt-1 text-[11px] font-bold text-blue-200">STAMFORD STATION</div>
            <div className="text-[9px] text-blue-500">Transit / rail landmark</div>
          </div>

          <div className="absolute left-[75%] top-[61%] h-[20%] w-[20%] rounded-lg border border-purple-400/45 bg-purple-950/25 p-3">
            <Waves className="h-5 w-5 text-purple-300" />
            <div className="mt-1 text-[11px] font-bold text-purple-200">HARBOR POINT</div>
            <div className="text-[9px] text-purple-500">First corridor destination</div>
          </div>

          <div className="absolute left-[20%] top-[60%] h-[6%] w-[32%] -rotate-[20deg] rounded-full bg-slate-700/45" />
          <div className="absolute left-[46%] top-[43%] h-[6%] w-[25%] -rotate-[28deg] rounded-full bg-slate-700/45" />
          <div className="absolute left-[66%] top-[47%] h-[6%] w-[24%] rotate-[43deg] rounded-full bg-slate-700/45" />

          <div
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-75 ${
              isDriving
                ? 'h-7 w-10 rounded-md border border-amber-300 bg-amber-500 shadow-[0_0_16px_rgba(245,158,11,.8)]'
                : 'h-5 w-5 rounded-full border-2 border-cyan-100 bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,.95)]'
            }`}
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            title={isDriving ? 'Player vehicle' : 'Player'}
          >
            {!isDriving && <div className="absolute inset-[5px] rounded-full bg-slate-950" />}
          </div>

          <div className="absolute left-3 top-3 rounded border border-cyan-500/30 bg-black/75 px-3 py-2 text-[10px] text-cyan-200 backdrop-blur">
            <div className="flex items-center gap-1.5 font-bold">
              <Crosshair className="h-3 w-3" /> LIVE POSITION
            </div>
            <div className="mt-1 text-slate-400">X {position.x.toFixed(1)} / Y {position.y.toFixed(1)}</div>
            <div className={isDriving ? 'text-amber-300' : 'text-emerald-300'}>{isDriving ? 'DRIVING' : 'ON FOOT'}</div>
          </div>

          <div className="absolute bottom-3 left-3 right-3 rounded border border-[#27314a] bg-black/80 px-3 py-2 text-[11px] text-slate-300 backdrop-blur">
            {notice}
          </div>
        </section>

        <aside className="space-y-3">
          <div className="rounded-xl border border-[#27314a] bg-[#0b0f16] p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Navigation className="h-4 w-4 text-cyan-400" /> CURRENT OBJECTIVE
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300 font-sans">{objective}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded bg-slate-800">
              <div className="h-full bg-cyan-400 transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="rounded-xl border border-[#27314a] bg-[#0b0f16] p-4">
            <div className="text-xs font-bold text-white">CORRIDOR CHECKPOINTS</div>
            <div className="mt-2 space-y-2 text-[10px] text-slate-400">
              <div>01 · Stamford Hospital <span className="text-emerald-300">SPAWN</span></div>
              <div>02 · Washington Boulevard <span className={['washington-reached', 'station-reached', 'harbor-point-reached'].includes(stage) ? 'text-emerald-300' : 'text-slate-600'}>CHECKPOINT</span></div>
              <div>03 · Stamford Station <span className={['station-reached', 'harbor-point-reached'].includes(stage) ? 'text-emerald-300' : 'text-slate-600'}>CHECKPOINT</span></div>
              <div>04 · Harbor Point <span className={stage === 'harbor-point-reached' ? 'text-emerald-300' : 'text-slate-600'}>DESTINATION</span></div>
            </div>
          </div>

          <div className="rounded-xl border border-[#27314a] bg-[#0b0f16] p-4">
            <div className="text-xs font-bold text-white">CONTROLS</div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[10px]">
              <div />
              <button onPointerDown={() => moveButton('w', true)} onPointerUp={() => moveButton('w', false)} onPointerLeave={() => moveButton('w', false)} className="rounded border border-slate-700 bg-slate-900 p-3 hover:border-cyan-500">W</button>
              <div />
              <button onPointerDown={() => moveButton('a', true)} onPointerUp={() => moveButton('a', false)} onPointerLeave={() => moveButton('a', false)} className="rounded border border-slate-700 bg-slate-900 p-3 hover:border-cyan-500">A</button>
              <button onPointerDown={() => moveButton('s', true)} onPointerUp={() => moveButton('s', false)} onPointerLeave={() => moveButton('s', false)} className="rounded border border-slate-700 bg-slate-900 p-3 hover:border-cyan-500">S</button>
              <button onPointerDown={() => moveButton('d', true)} onPointerUp={() => moveButton('d', false)} onPointerLeave={() => moveButton('d', false)} className="rounded border border-slate-700 bg-slate-900 p-3 hover:border-cyan-500">D</button>
            </div>
            <button onClick={toggleVehicle} disabled={!nearVehicle && !isDriving} className="mt-2 w-full rounded border border-amber-500/40 bg-amber-950/20 px-3 py-2 text-[10px] font-bold text-amber-300 disabled:cursor-not-allowed disabled:opacity-40">
              {isDriving ? 'F — EXIT VEHICLE' : 'F — ENTER VEHICLE'}
            </button>
            <button onClick={reset} className="mt-2 flex w-full items-center justify-center gap-2 rounded border border-slate-700 bg-slate-900 px-3 py-2 text-[10px] text-slate-300 hover:border-cyan-500">
              <RotateCcw className="h-3 w-3" /> RESET TO STAMFORD HOSPITAL
            </button>
            <div className="mt-2 text-[9px] leading-relaxed text-slate-500">
              Desktop: WASD / Arrow keys. Hold Shift to sprint. Press F near the vehicle. Mobile/touch: use the directional pad above.
            </div>
          </div>

          <div className="rounded-xl border border-[#27314a] bg-[#0b0f16] p-4 text-[10px]">
            <div className="font-bold text-white">PLAYER STATE</div>
            <div className="mt-2 space-y-1 text-slate-400">
              <div>Credits: <span className="text-amber-300">{progress.credits}</span></div>
              <div>Last location: <span className="text-cyan-300">{progress.lastWarpLocation}</span></div>
              <div>Web route: <span className={stage === 'harbor-point-reached' ? 'text-emerald-300' : 'text-blue-300'}>{stage === 'harbor-point-reached' ? 'ROUTE COMPLETE' : 'IN PROGRESS'}</span></div>
            </div>
          </div>
        </aside>
      </div>

      <div className="rounded border border-[#27314a] bg-[#090d14] p-3 text-[10px] leading-relaxed text-slate-500">
        Platform architecture: this browser runtime is a first-class Onegodia client. The current Stamford map remains a gameplay abstraction, not surveyed GIS. Durable identity, missions, inventory, progression, and zone state are being assigned to Onegodia Game Services; Unreal remains the high-fidelity client in parallel.
      </div>
    </div>
  );
};
