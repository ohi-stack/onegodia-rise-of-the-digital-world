import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  Gamepad2, 
  CheckCircle2, 
  Clock, 
  Send, 
  ShieldCheck, 
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { NavigationTab } from '../types';
import { sound } from '../services/audioService';

interface PlayersViewProps {
  setActiveTab: (tab: NavigationTab) => void;
}

export const PlayersView: React.FC<PlayersViewProps> = ({ setActiveTab }) => {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('Movement & Controls');

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    sound.playFragmentCollected();
    setFeedbackSent(true);
  };

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
            Player Onboarding & Staged Capability Matrix
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Clear separation between active prototype gameplay and future open-world systems.
          </p>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('prototype');
          }}
          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono shadow-sm flex items-center gap-1.5 transition-all self-start md:self-auto"
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Launch Playable V1</span>
        </button>
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
