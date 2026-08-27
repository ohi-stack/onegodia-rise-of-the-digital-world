import React from 'react';
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
  Eye
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
  isDriving: boolean;
  playerState: PlayerState;
  nearNPC: boolean;
  nearVehicle: boolean;
  nearNode: boolean;
}

export const MobileControllerPad: React.FC<MobileControllerPadProps> = ({
  onDirectionPress,
  onJumpPress,
  onMountPress,
  onInteractPress,
  onResetPress,
  onToggleMap,
  onToggleInventory,
  isDriving,
  playerState,
  nearNPC,
  nearVehicle,
  nearNode
}) => {
  const handleTouchStart = (dir: 'up' | 'down' | 'left' | 'right', e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    onDirectionPress(dir, true);
  };

  const handleTouchEnd = (dir: 'up' | 'down' | 'left' | 'right', e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    onDirectionPress(dir, false);
  };

  return (
    <div 
      id="mobile-controller-pad"
      className="select-none touch-none w-full max-w-4xl mx-auto p-2.5 bg-[#0c0e14] border-t sm:border border-[#1e2230] sm:rounded-xl shadow-xl font-sans"
    >
      <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-[#1e2230] text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5 text-blue-400 font-semibold">
          <Eye className="w-3 h-3" />
          <span>VIRTUAL GAMEPAD</span>
          <span className="text-[10px] px-1 bg-blue-950 border border-blue-700/60 rounded text-blue-300">
            {playerState}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              onToggleMap();
            }}
            className="px-2 py-0.5 bg-[#11131a] hover:bg-[#161821] text-slate-300 rounded border border-[#1e2230] flex items-center gap-1 text-[11px]"
          >
            <Map className="w-3 h-3 text-blue-400" />
            <span>Map</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onToggleInventory();
            }}
            className="px-2 py-0.5 bg-[#11131a] hover:bg-[#161821] text-slate-300 rounded border border-[#1e2230] flex items-center gap-1 text-[11px]"
          >
            <Package className="w-3 h-3 text-amber-400" />
            <span>Locker</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onResetPress();
            }}
            className="px-2 py-0.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded border border-rose-800/50 flex items-center gap-1 text-[11px]"
            title="Reset position to Hub spawn"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 items-center">
        
        {/* Left: Directional D-Pad */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32 bg-[#050608] rounded-full border border-[#1e2230] flex items-center justify-center shadow-inner">
            
            {/* Center cross decorator */}
            <div className="w-8 h-8 rounded-full bg-[#0c0e14] border border-[#1e2230] flex items-center justify-center font-mono text-[9px] text-blue-400">
              Ω
            </div>

            {/* UP */}
            <button
              id="pad-btn-up"
              onTouchStart={(e) => handleTouchStart('up', e)}
              onTouchEnd={(e) => handleTouchEnd('up', e)}
              onMouseDown={(e) => handleTouchStart('up', e)}
              onMouseUp={(e) => handleTouchEnd('up', e)}
              className="absolute top-1 inset-x-10 h-9 bg-[#11131a] hover:bg-blue-600/30 active:bg-blue-600/50 rounded-t-lg border border-[#1e2230] flex items-center justify-center text-blue-300 active:scale-95 transition-transform"
              aria-label="Move Up"
            >
              <ArrowUp className="w-4 h-4" />
            </button>

            {/* DOWN */}
            <button
              id="pad-btn-down"
              onTouchStart={(e) => handleTouchStart('down', e)}
              onTouchEnd={(e) => handleTouchEnd('down', e)}
              onMouseDown={(e) => handleTouchStart('down', e)}
              onMouseUp={(e) => handleTouchEnd('down', e)}
              className="absolute bottom-1 inset-x-10 h-9 bg-[#11131a] hover:bg-blue-600/30 active:bg-blue-600/50 rounded-b-lg border border-[#1e2230] flex items-center justify-center text-blue-300 active:scale-95 transition-transform"
              aria-label="Move Down"
            >
              <ArrowDown className="w-4 h-4" />
            </button>

            {/* LEFT */}
            <button
              id="pad-btn-left"
              onTouchStart={(e) => handleTouchStart('left', e)}
              onTouchEnd={(e) => handleTouchEnd('left', e)}
              onMouseDown={(e) => handleTouchStart('left', e)}
              onMouseUp={(e) => handleTouchEnd('left', e)}
              className="absolute left-1 inset-y-10 w-9 bg-[#11131a] hover:bg-blue-600/30 active:bg-blue-600/50 rounded-l-lg border border-[#1e2230] flex items-center justify-center text-blue-300 active:scale-95 transition-transform"
              aria-label="Move Left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            {/* RIGHT */}
            <button
              id="pad-btn-right"
              onTouchStart={(e) => handleTouchStart('right', e)}
              onTouchEnd={(e) => handleTouchEnd('right', e)}
              onMouseDown={(e) => handleTouchStart('right', e)}
              onMouseUp={(e) => handleTouchEnd('right', e)}
              className="absolute right-1 inset-y-10 w-9 bg-[#11131a] hover:bg-blue-600/30 active:bg-blue-600/50 rounded-r-lg border border-[#1e2230] flex items-center justify-center text-blue-300 active:scale-95 transition-transform"
              aria-label="Move Right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Action Matrix Buttons */}
        <div className="flex flex-col gap-2 justify-center">
          
          {/* Action Row 1: Jump Matrix & Mount/Ride */}
          <div className="grid grid-cols-2 gap-1.5">
            
            {/* Jump Matrix */}
            <button
              id="mobile-btn-jump"
              onClick={onJumpPress}
              disabled={isDriving}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-0.5 font-mono text-xs active:scale-95 transition-all ${
                isDriving
                  ? 'bg-[#11131a] border-[#1e2230] text-slate-600 cursor-not-allowed'
                  : 'bg-[#11131a] border-blue-500/40 text-blue-300 hover:border-blue-400'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-bold text-[11px]">Jump</span>
            </button>

            {/* Mount / Drive */}
            <button
              id="mobile-btn-mount"
              onClick={onMountPress}
              className={`p-2.5 rounded-lg border flex flex-col items-center justify-center gap-0.5 font-mono text-xs active:scale-95 transition-all ${
                isDriving
                  ? 'bg-amber-950 border-amber-500 text-amber-300 animate-pulse'
                  : nearVehicle
                  ? 'bg-teal-950 border-teal-400 text-teal-200 animate-bounce'
                  : 'bg-[#11131a] border-[#1e2230] text-slate-400 hover:border-slate-700'
              }`}
            >
              <Car className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-bold text-[11px]">{isDriving ? 'Exit Car' : 'Mount Car'}</span>
            </button>
          </div>

          {/* Action Row 2: Interact / Scan */}
          <button
            id="mobile-btn-interact"
            onClick={onInteractPress}
            className={`w-full py-2.5 px-3 rounded-lg border flex items-center justify-center gap-1.5 font-mono text-xs active:scale-95 transition-all ${
              nearNode
                ? 'bg-gradient-to-r from-rose-950 via-[#0c0e14] to-slate-900 border-rose-400 text-rose-200 shadow-md animate-pulse'
                : nearNPC
                ? 'bg-blue-950 border-blue-400 text-blue-200 shadow-md animate-bounce'
                : 'bg-[#11131a] border-[#1e2230] text-slate-300 hover:border-slate-700'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-bold text-[11px]">
              {nearNPC
                ? 'Talk to Mission Guide [E]'
                : nearNode
                ? 'Hold Scan Corrupted Node [E]'
                : nearVehicle
                ? 'Enter Cyber-Cruiser [F]'
                : 'Interact / Photonic Scan [E]'}
            </span>
          </button>

        </div>

      </div>
    </div>
  );
};
