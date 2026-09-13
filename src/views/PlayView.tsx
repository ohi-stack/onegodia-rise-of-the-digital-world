import React, { useEffect, useRef, useState } from 'react';
import { Car, Crosshair, Hospital, MapPin, Navigation, RotateCcw } from 'lucide-react';
import { PlayerProgress } from '../types';

interface PlayViewProps {
  progress: PlayerProgress;
  setProgress: React.Dispatch<React.SetStateAction<PlayerProgress>>;
}

type Position = { x: number; y: number };

type PlayStage = 'spawned' | 'vehicle-reached' | 'driving' | 'downtown-reached';

const SPAWN: Position = { x: 18, y: 66 };
const VEHICLE: Position = { x: 43, y: 56 };
const DOWNTOWN: Position = { x: 80, y: 29 };

const distance = (a: Position, b: Position) => Math.hypot(a.x - b.x, a.y - b.y);

export const PlayView: React.FC<PlayViewProps> = ({ progress, setProgress }) => {
  const [position, setPosition] = useState<Position>(SPAWN);
  const [stage, setStage] = useState<PlayStage>('spawned');
  const [isDriving, setIsDriving] = useState(false);
  const [notice, setNotice] = useState('Spawned at Stamford Hospital. Reach the vehicle staging area.');
  const [isFocused, setIsFocused] = useState(false);
  const pressed = useRef<Set<string>>(new Set());

  const nearVehicle = distance(position, VEHICLE) < 7;
  const nearDowntown = distance(position, DOWNTOWN) < 8;

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
        setNotice('Vehicle engaged. Drive toward the Downtown Stamford waypoint.');
        setProgress((current) => ({ ...current, hasVehicleUnlocked: true, lastWarpLocation: 'Stamford Hospital Vehicle Staging' }));
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
      const speed = isDriving ? 2.25 : sprinting ? 1.35 : 0.85;

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
    }

    if (isDriving && nearDowntown && stage !== 'downtown-reached') {
      setStage('downtown-reached');
      setNotice('Downtown Stamford waypoint reached. Browser V1 route test complete.');
      setProgress((current) => ({ ...current, lastWarpLocation: 'Downtown Stamford Gateway' }));
    }
  }, [isDriving, nearDowntown, nearVehicle, setProgress, stage]);

  const moveButton = (key: string, active: boolean) => {
    if (active) pressed.current.add(key);
    else pressed.current.delete(key);
  };

  const toggleVehicle = () => {
    if (nearVehicle && !isDriving) {
      setIsDriving(true);
      setStage('driving');
      setNotice('Vehicle engaged. Drive toward the Downtown Stamford waypoint.');
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
    setNotice('Spawned at Stamford Hospital. Reach the vehicle staging area.');
    setProgress((current) => ({ ...current, lastWarpLocation: 'Stamford Hospital' }));
  };

  const objective = stage === 'spawned'
    ? 'Walk from Stamford Hospital to the vehicle staging area.'
    : stage === 'vehicle-reached'
      ? 'Press F to enter the vehicle.'
      : stage === 'driving'
        ? 'Drive to the Downtown Stamford waypoint.'
        : 'Route complete — Stamford Hospital → Downtown gateway.';

  return (
    <div className="space-y-4 font-mono">
      <section className="rounded-xl border border-cyan-500/30 bg-[#080b10] p-4 sm:p-5 shadow-[0_0_30px_rgba(0,255,255,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-400">Onegodia Web Game V1</div>
            <h1 className="mt-1 text-xl sm:text-2xl font-black text-white">Stamford Hospital Start Zone</h1>
            <p className="mt-1 max-w-3xl text-xs sm:text-sm text-slate-400 font-sans">
              This is the browser-playable layer of game.onegodian.com. Move from the Stamford Hospital spawn, reach the prototype vehicle, and drive to the Downtown Stamford gateway.
            </p>
          </div>
          <div className="flex gap-2 text-[10px]">
            <span className="rounded border border-emerald-500/40 bg-emerald-950/30 px-2 py-1 text-emerald-300">PLAYABLE WEB V1</span>
            <span className="rounded border border-blue-500/40 bg-blue-950/30 px-2 py-1 text-blue-300">UNREAL IN PARALLEL</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
        <section
          tabIndex={0}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="relative min-h-[520px] overflow-hidden rounded-xl border border-[#27314a] bg-[#060a0f] outline-none focus:border-cyan-500/60"
          aria-label="Playable Stamford prototype map"
        >
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: 'linear-gradient(rgba(0,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,.08) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />

          <div className="absolute left-[8%] top-[51%] h-[31%] w-[22%] rounded-lg border border-emerald-400/50 bg-emerald-950/35 p-3">
            <Hospital className="h-5 w-5 text-emerald-300" />
            <div className="mt-1 text-[11px] font-bold text-emerald-200">STAMFORD HOSPITAL</div>
            <div className="text-[9px] text-emerald-500">Canonical Player Spawn</div>
          </div>

          <div className="absolute left-[34%] top-[44%] h-[20%] w-[21%] rounded-lg border border-amber-400/40 bg-amber-950/25 p-3">
            <Car className="h-5 w-5 text-amber-300" />
            <div className="mt-1 text-[11px] font-bold text-amber-200">VEHICLE STAGING</div>
            <div className="text-[9px] text-amber-500">Press F when nearby</div>
          </div>

          <div className="absolute left-[67%] top-[14%] h-[28%] w-[25%] rounded-lg border border-blue-400/45 bg-blue-950/25 p-3">
            <MapPin className="h-5 w-5 text-blue-300" />
            <div className="mt-1 text-[11px] font-bold text-blue-200">DOWNTOWN GATEWAY</div>
            <div className="text-[9px] text-blue-500">First Route Destination</div>
          </div>

          <div className="absolute left-[25%] top-[56%] h-[7%] w-[52%] -rotate-[23deg] rounded-full bg-slate-700/45 shadow-[0_0_18px_rgba(56,189,248,.12)]" />
          <div className="absolute left-[54%] top-[35%] h-[6%] w-[31%] -rotate-[31deg] rounded-full bg-slate-700/45" />

          <div
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-75 ${isDriving ? 'h-7 w-10 rounded-md border border-amber-300 bg-amber-500 shadow-[0_0_16px_rgba(245,158,11,.8)]' : 'h-5 w-5 rounded-full border-2 border-cyan-100 bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,.95)]'}`}
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            title={isDriving ? 'Player vehicle' : 'Player'}
          >
            {!isDriving && <div className="absolute inset-[5px] rounded-full bg-slate-950" />}
          </div>

          <div className="absolute left-3 top-3 rounded border border-cyan-500/30 bg-black/75 px-3 py-2 text-[10px] text-cyan-200 backdrop-blur">
            <div className="flex items-center gap-1.5 font-bold"><Crosshair className="h-3 w-3" /> LIVE POSITION</div>
            <div className="mt-1 text-slate-400">X {position.x.toFixed(1)} / Y {position.y.toFixed(1)}</div>
            <div className={isDriving ? 'text-amber-300' : 'text-emerald-300'}>{isDriving ? 'DRIVING' : 'ON FOOT'}</div>
          </div>

          <div className="absolute bottom-3 left-3 right-3 rounded border border-[#27314a] bg-black/80 px-3 py-2 text-[11px] text-slate-300 backdrop-blur">
            {notice}
          </div>
        </section>

        <aside className="space-y-3">
          <div className="rounded-xl border border-[#27314a] bg-[#0b0f16] p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white"><Navigation className="h-4 w-4 text-cyan-400" /> CURRENT OBJECTIVE</div>
            <p className="mt-2 text-xs leading-relaxed text-slate-300 font-sans">{objective}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded bg-slate-800">
              <div className="h-full bg-cyan-400 transition-all" style={{ width: stage === 'spawned' ? '25%' : stage === 'vehicle-reached' ? '50%' : stage === 'driving' ? '75%' : '100%' }} />
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
            <div className="mt-2 text-[9px] leading-relaxed text-slate-500">Desktop: WASD / Arrow keys. Hold Shift to sprint. Press F near the vehicle. Mobile/touch: use the directional pad above.</div>
          </div>

          <div className="rounded-xl border border-[#27314a] bg-[#0b0f16] p-4 text-[10px]">
            <div className="font-bold text-white">PLAYER STATE</div>
            <div className="mt-2 space-y-1 text-slate-400">
              <div>Credits: <span className="text-amber-300">{progress.credits}</span></div>
              <div>Last location: <span className="text-cyan-300">{progress.lastWarpLocation}</span></div>
              <div>Web route: <span className={stage === 'downtown-reached' ? 'text-emerald-300' : 'text-blue-300'}>{stage === 'downtown-reached' ? 'VERIFIED BY PLAYER' : 'IN PROGRESS'}</span></div>
            </div>
          </div>
        </aside>
      </div>

      <div className="text-[10px] text-slate-500">
        Browser V1 is an independent playable client. The Unreal Stamford build remains the high-fidelity production path and is developed in parallel.
      </div>
    </div>
  );
};
