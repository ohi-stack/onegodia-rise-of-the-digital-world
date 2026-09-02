import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Zap, 
  Car, 
  Radio, 
  RotateCcw, 
  Map, 
  Package, 
  Eye,
  Sliders,
  Gamepad2,
  Navigation2,
  Flame,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { PlayerState } from '../../types';
import { sound } from '../../services/audioService';

interface MobileControllerPadProps {
  onDirectionPress: (dir: 'up' | 'down' | 'left' | 'right', pressed: boolean) => void;
  onJumpPress: () => void;
  onMountPress: () => void;
  onInteractPress: () => void;
  onResetPress: () => void;
  onToggleMap: () => void;
  onToggleInventory: () => void;
  onSprintToggle?: (sprint: boolean) => void;
  isDriving: boolean;
  playerState: PlayerState;
  nearNPC: boolean;
  nearVehicle: boolean;
  nearNode: boolean;
  scanProgress?: number;
}

export const MobileControllerPad: React.FC<MobileControllerPadProps> = ({
  onDirectionPress,
  onJumpPress,
  onMountPress,
  onInteractPress,
  onResetPress,
  onToggleMap,
  onToggleInventory,
  onSprintToggle,
  isDriving,
  playerState,
  nearNPC,
  nearVehicle,
  nearNode,
  scanProgress = 0
}) => {
  const [controlMode, setControlMode] = useState<'joystick' | 'dpad'>('joystick');
  const [isSprinting, setIsSprinting] = useState(false);
  const [activeDirections, setActiveDirections] = useState<{ [key: string]: boolean }>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  // Joystick touch tracking
  const joystickBaseRef = useRef<HTMLDivElement | null>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const joystickTouchIdRef = useRef<number | null>(null);

  // Trigger subtle device haptics
  const triggerHaptic = useCallback((duration = 12) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(duration);
      } catch {
        // ignore
      }
    }
  }, []);

  // Update directional state and notify parent
  const updateDirections = useCallback((newDirs: { up: boolean; down: boolean; left: boolean; right: boolean }) => {
    (['up', 'down', 'left', 'right'] as const).forEach(dir => {
      if (newDirs[dir] !== activeDirections[dir]) {
        onDirectionPress(dir, newDirs[dir]);
      }
    });
    setActiveDirections(newDirs);
  }, [activeDirections, onDirectionPress]);

  // Handle Joystick Touch Start & Move
  const handleJoystickMove = useCallback((clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);
    const maxRadius = 38;

    const clampedDist = Math.min(distance, maxRadius);
    const angle = Math.atan2(deltaY, deltaX);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: knobX, y: knobY });

    // Deadzone check (8px)
    if (clampedDist < 8) {
      updateDirections({ up: false, down: false, left: false, right: false });
      return;
    }

    // Direction vector resolution (with 8-way overlap)
    const deadzoneRatio = clampedDist / maxRadius;
    const isUp = deltaY < -10;
    const isDown = deltaY > 10;
    const isLeft = deltaX < -10;
    const isRight = deltaX > 10;

    updateDirections({
      up: isUp && Math.abs(deltaY) > Math.abs(deltaX) * 0.45,
      down: isDown && Math.abs(deltaY) > Math.abs(deltaX) * 0.45,
      left: isLeft && Math.abs(deltaX) > Math.abs(deltaY) * 0.45,
      right: isRight && Math.abs(deltaX) > Math.abs(deltaY) * 0.45,
    });
  }, [updateDirections]);

  const handleJoystickTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      joystickTouchIdRef.current = touch.identifier;
      setIsJoystickActive(true);
      triggerHaptic(15);
      handleJoystickMove(touch.clientX, touch.clientY);
    }
  };

  const handleJoystickTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (touch.identifier === joystickTouchIdRef.current) {
        handleJoystickMove(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsJoystickActive(false);
    joystickTouchIdRef.current = null;
    setKnobPos({ x: 0, y: 0 });
    updateDirections({ up: false, down: false, left: false, right: false });
  };

  // Mouse fallback for Joystick testing
  const handleJoystickMouseDown = (e: React.MouseEvent) => {
    setIsJoystickActive(true);
    triggerHaptic(10);
    handleJoystickMove(e.clientX, e.clientY);

    const onMouseMove = (moveEvent: MouseEvent) => {
      handleJoystickMove(moveEvent.clientX, moveEvent.clientY);
    };

    const onMouseUp = () => {
      setIsJoystickActive(false);
      setKnobPos({ x: 0, y: 0 });
      updateDirections({ up: false, down: false, left: false, right: false });
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // D-Pad Touch/Swipe Handler (supports dragging across buttons seamlessly)
  const dpadContainerRef = useRef<HTMLDivElement | null>(null);

  const calculateDpadDirection = (clientX: number, clientY: number) => {
    if (!dpadContainerRef.current) return;
    const rect = dpadContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    if (dist < 12) {
      updateDirections({ up: false, down: false, left: false, right: false });
      return;
    }

    const isUp = dy < -12;
    const isDown = dy > 12;
    const isLeft = dx < -12;
    const isRight = dx > 12;

    updateDirections({
      up: isUp,
      down: isDown,
      left: isLeft,
      right: isRight,
    });
  };

  const handleDpadTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    triggerHaptic(12);
    if (e.touches.length > 0) {
      calculateDpadDirection(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleDpadTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      calculateDpadDirection(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleDpadTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    updateDirections({ up: false, down: false, left: false, right: false });
  };

  const toggleSprint = () => {
    triggerHaptic(20);
    sound.playClick();
    const next = !isSprinting;
    setIsSprinting(next);
    onSprintToggle?.(next);
  };

  return (
    <div 
      id="mobile-controller-pad"
      className="select-none touch-none w-full max-w-4xl mx-auto p-2 sm:p-3 bg-[#0c0e14] border-t sm:border border-[#1e2230] sm:rounded-xl shadow-2xl font-sans transition-colors"
    >
      {/* Top Controller Bar */}
      <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#1e2230] text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-blue-400 font-bold">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">TOUCHPAD</span>
          </div>

          {/* Mode Switcher: Joystick vs D-Pad */}
          <div className="flex items-center p-0.5 rounded bg-[#11131a] border border-[#1e2230]">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setControlMode('joystick');
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                controlMode === 'joystick'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Analog Stick
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setControlMode('dpad');
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                controlMode === 'dpad'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              D-Pad
            </button>
          </div>

          <span className="text-[10px] px-1.5 py-0.5 bg-blue-950/80 border border-blue-700/60 rounded text-blue-300 font-semibold">
            {playerState}
          </span>
        </div>

        {/* Quick Travel & Reset Shortcuts */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              sound.playClick();
              onToggleMap();
            }}
            className="px-2 py-1 bg-[#11131a] hover:bg-[#161821] active:scale-95 text-slate-300 rounded border border-[#1e2230] flex items-center gap-1 text-[11px] transition-all"
            title="Open Sector Map"
          >
            <Map className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Map</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(10);
              sound.playClick();
              onToggleInventory();
            }}
            className="px-2 py-1 bg-[#11131a] hover:bg-[#161821] active:scale-95 text-slate-300 rounded border border-[#1e2230] flex items-center gap-1 text-[11px] transition-all"
            title="Open Locker Inventory"
          >
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Locker</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(25);
              sound.playClick();
              onResetPress();
            }}
            className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 active:scale-95 text-rose-300 rounded border border-rose-800/50 flex items-center gap-1 text-[11px] transition-all"
            title="Reset position to Hub spawn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Cluster Touch Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 items-center bg-[#090b10] rounded-xl p-2 sm:p-4 border border-cyan-900/50 shadow-[0_0_30px_rgba(0,255,255,0.05)] relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gamer-grid opacity-20 z-0 pointer-events-none"></div>

        {/* LEFT CLUSTER: Thumbstick or Multi-Touch D-Pad */}
        <div className="flex items-center justify-center p-1 relative z-10">
          {controlMode === 'joystick' ? (
            /* Virtual Analog Joystick */
            <div
              ref={joystickBaseRef}
              id="virtual-joystick-base"
              onTouchStart={handleJoystickTouchStart}
              onTouchMove={handleJoystickTouchMove}
              onTouchEnd={handleJoystickTouchEnd}
              onTouchCancel={handleJoystickTouchEnd}
              onMouseDown={handleJoystickMouseDown}
              className={`relative w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all shadow-[inset_0_0_20px_rgba(0,255,255,0.1)] select-none ${
                isJoystickActive 
                  ? 'bg-black border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.5)]' 
                  : 'bg-[#050608] border-cyan-900 hover:border-cyan-700'
              }`}
            >
              {/* Outer Guide Markings */}
              <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/30 pointer-events-none"></div>
              
              {/* Direction Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-cyan-500/20 pointer-events-none"></div>
              <div className="absolute inset-y-0 left-1/2 w-px bg-cyan-500/20 pointer-events-none"></div>

              {/* Directional Labels */}
              <span className="absolute top-1 text-[9px] font-mono text-cyan-500">▲</span>
              <span className="absolute bottom-1 text-[9px] font-mono text-cyan-500">▼</span>
              <span className="absolute left-1.5 text-[9px] font-mono text-cyan-500">◀</span>
              <span className="absolute right-1.5 text-[9px] font-mono text-cyan-500">▶</span>

              {/* Dynamic Vector Line */}
              {isJoystickActive && (knobPos.x !== 0 || knobPos.y !== 0) && (
                <div
                  className="absolute w-1 bg-gradient-to-t from-transparent to-cyan-400 origin-center pointer-events-none rounded-full shadow-[0_0_10px_#0ff]"
                  style={{
                    height: `${Math.hypot(knobPos.x, knobPos.y)}px`,
                    transform: `translate(${knobPos.x / 2}px, ${knobPos.y / 2}px) rotate(${Math.atan2(knobPos.y, knobPos.x) + Math.PI / 2}rad)`,
                  }}
                ></div>
              )}

              {/* Movable Joystick Thumb Puck */}
              <div
                className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center transition-transform duration-75 pointer-events-none ${
                  isJoystickActive
                    ? 'bg-cyan-500 border-white text-black shadow-[0_0_20px_#0ff] scale-110 font-black'
                    : 'bg-[#11131a] border-cyan-700 text-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.2)] font-bold'
                }`}
                style={{
                  transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
                }}
              >
                <div className={`w-3 h-3 rounded-full mb-0.5 ${isJoystickActive ? 'bg-white' : 'bg-cyan-500/40 border border-cyan-400/60'}`}></div>
                <span className="text-[8px] font-mono tracking-tight">
                  {isDriving ? 'DRIVE' : 'MOVE'}
                </span>
              </div>
            </div>
          ) : (
            /* Multi-Touch Swipe-Enabled D-Pad */
            <div
              ref={dpadContainerRef}
              id="virtual-dpad-container"
              onTouchStart={handleDpadTouchStart}
              onTouchMove={handleDpadTouchMove}
              onTouchEnd={handleDpadTouchEnd}
              onTouchCancel={handleDpadTouchEnd}
              className="relative w-36 h-36 sm:w-40 sm:h-40 bg-black rounded-full border-2 border-cyan-900 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,255,255,0.1)]"
            >
              {/* Center Decorative Core */}
              <div className="w-10 h-10 rounded-full bg-[#0c0e14] border-2 border-cyan-500 flex items-center justify-center font-mono text-[10px] text-cyan-400 pointer-events-none shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                Ω
              </div>

              {/* UP */}
              <button
                type="button"
                id="pad-btn-up"
                onMouseDown={() => {
                  triggerHaptic(10);
                  onDirectionPress('up', true);
                }}
                onMouseUp={() => onDirectionPress('up', false)}
                className={`absolute top-1 inset-x-11 h-10 rounded-t-xl border flex items-center justify-center transition-all ${
                  activeDirections.up
                    ? 'bg-cyan-500 text-black border-white shadow-[0_0_15px_#0ff]'
                    : 'bg-[#11131a] text-cyan-500 border-cyan-900 hover:bg-cyan-950/40 hover:border-cyan-500'
                }`}
                aria-label="Move Up"
              >
                <ArrowUp className="w-5 h-5" />
              </button>

              {/* DOWN */}
              <button
                type="button"
                id="pad-btn-down"
                onMouseDown={() => {
                  triggerHaptic(10);
                  onDirectionPress('down', true);
                }}
                onMouseUp={() => onDirectionPress('down', false)}
                className={`absolute bottom-1 inset-x-11 h-10 rounded-b-xl border flex items-center justify-center transition-all ${
                  activeDirections.down
                    ? 'bg-cyan-500 text-black border-white shadow-[0_0_15px_#0ff]'
                    : 'bg-[#11131a] text-cyan-500 border-cyan-900 hover:bg-cyan-950/40 hover:border-cyan-500'
                }`}
                aria-label="Move Down"
              >
                <ArrowDown className="w-5 h-5" />
              </button>

              {/* LEFT */}
              <button
                type="button"
                id="pad-btn-left"
                onMouseDown={() => {
                  triggerHaptic(10);
                  onDirectionPress('left', true);
                }}
                onMouseUp={() => onDirectionPress('left', false)}
                className={`absolute left-1 inset-y-11 w-10 rounded-l-xl border flex items-center justify-center transition-all ${
                  activeDirections.left
                    ? 'bg-cyan-500 text-black border-white shadow-[0_0_15px_#0ff]'
                    : 'bg-[#11131a] text-cyan-500 border-cyan-900 hover:bg-cyan-950/40 hover:border-cyan-500'
                }`}
                aria-label="Move Left"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              {/* RIGHT */}
              <button
                type="button"
                id="pad-btn-right"
                onMouseDown={() => {
                  triggerHaptic(10);
                  onDirectionPress('right', true);
                }}
                onMouseUp={() => onDirectionPress('right', false)}
                className={`absolute right-1 inset-y-11 w-10 rounded-r-xl border flex items-center justify-center transition-all ${
                  activeDirections.right
                    ? 'bg-cyan-500 text-black border-white shadow-[0_0_15px_#0ff]'
                    : 'bg-[#11131a] text-cyan-500 border-cyan-900 hover:bg-cyan-950/40 hover:border-cyan-500'
                }`}
                aria-label="Move Right"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT CLUSTER: Context Action Cluster & Sprint/Jump Matrix */}
        <div className="flex flex-col gap-2 justify-center relative z-10">
          
          {/* Secondary Action Row: Jump / Brake + Mount Car + Sprint Mode */}
          <div className="grid grid-cols-3 gap-1.5">
            
            {/* Jump / Reverse Brake */}
            <button
              type="button"
              id="mobile-btn-jump"
              onClick={() => {
                triggerHaptic(15);
                onJumpPress();
              }}
              disabled={isDriving}
              className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 font-mono text-xs active:scale-95 transition-all min-h-[50px] ${
                isDriving
                  ? 'bg-black border-slate-800 text-slate-600 opacity-60 cursor-not-allowed'
                  : 'bg-black hover:bg-cyan-950/60 border-cyan-600 text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(0,255,255,0.4)]'
              }`}
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-[10px] sm:text-[11px] uppercase tracking-wider">Jump</span>
            </button>

            {/* Mount / Vehicle Mode */}
            <button
              type="button"
              id="mobile-btn-mount"
              onClick={() => {
                triggerHaptic(20);
                onMountPress();
              }}
              className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 font-mono text-xs active:scale-95 transition-all min-h-[50px] ${
                isDriving
                  ? 'bg-black border-purple-500 text-purple-400 animate-pulse shadow-[0_0_15px_rgba(255,0,255,0.4)]'
                  : nearVehicle
                  ? 'bg-purple-950/40 border-purple-400 text-purple-300 animate-bounce shadow-[0_0_15px_rgba(255,0,255,0.3)]'
                  : 'bg-black hover:bg-purple-950/30 border-purple-900 text-purple-600'
              }`}
            >
              <Car className="w-4 h-4 text-current" />
              <span className="font-bold text-[10px] sm:text-[11px] uppercase tracking-wider">
                {isDriving ? 'Exit' : 'Mount'}
              </span>
            </button>

            {/* Sprint / Boost Toggle */}
            <button
              type="button"
              id="mobile-btn-sprint"
              onClick={toggleSprint}
              className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-center gap-1 font-mono text-xs active:scale-95 transition-all min-h-[50px] ${
                isSprinting
                  ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400 font-bold shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                  : 'bg-black hover:bg-yellow-950/30 border-yellow-900 text-yellow-600'
              }`}
            >
              <Flame className={`w-4 h-4 ${isSprinting ? 'text-yellow-400 animate-pulse' : 'text-current'}`} />
              <span className="font-bold text-[10px] sm:text-[11px] uppercase tracking-wider">
                {isSprinting ? 'Boost' : 'Sprint'}
              </span>
            </button>
          </div>

          {/* Primary Action Button (Extra-Large Dynamic Target) */}
          <button
            type="button"
            id="mobile-btn-interact"
            onClick={() => {
              triggerHaptic(20);
              onInteractPress();
            }}
            className={`w-full py-3 px-3.5 rounded-xl border-2 flex items-center justify-center gap-2 font-mono text-xs active:scale-95 transition-all shadow-lg min-h-[52px] ${
              nearNode
                ? 'bg-black border-red-500 text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-pulse'
                : nearNPC
                ? 'bg-black border-cyan-400 text-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.6)] animate-pulse'
                : nearVehicle && !isDriving
                ? 'bg-black border-purple-500 text-purple-300 shadow-[0_0_20px_rgba(255,0,255,0.6)] animate-pulse'
                : isDriving
                ? 'bg-black border-yellow-500/60 text-yellow-500'
                : 'bg-black hover:bg-slate-900 border-slate-700 text-slate-300'
            }`}
          >
            {nearNode ? (
              <Sparkles className="w-4 h-4 text-red-400 animate-spin" />
            ) : nearNPC ? (
              <Radio className="w-4 h-4 text-cyan-400" />
            ) : nearVehicle ? (
              <Car className="w-4 h-4 text-purple-400" />
            ) : (
              <Navigation2 className="w-4 h-4 text-current" />
            )}

            <div className="flex flex-col items-start text-left">
              <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">
                {nearNPC
                  ? 'Speak with Aria [E]'
                  : nearNode
                  ? `Scan Node (${scanProgress}%)`
                  : nearVehicle && !isDriving
                  ? 'Enter Cruiser [F]'
                  : isDriving
                  ? 'Cruiser Active'
                  : 'Interact [E]'}
              </span>
              {nearNode && (
                <div className="w-full bg-red-950/80 rounded-full h-1 mt-1 overflow-hidden border border-red-700/60 shadow-[0_0_5px_#f00]">
                  <div 
                    className="bg-red-500 h-full transition-all duration-100 shadow-[0_0_5px_#f00]"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </button>

        </div>

      </div>
    </div>
  );
};

