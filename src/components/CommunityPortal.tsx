import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Github, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  Award, 
  Globe, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { sound } from '../services/audioService';
import { NavigationTab } from '../types';

export interface FeedbackEntry {
  id: string;
  username: string;
  category: 'Gameplay' | 'Bug' | 'Feature Request' | 'General';
  message: string;
  timestamp: string;
}

export interface CommunityPortalProps {
  setActiveTab?: (tab: NavigationTab) => void;
}

export const CommunityPortal: React.FC<CommunityPortalProps> = ({ setActiveTab }) => {
  const [feedbackList, setFeedbackList] = useState<FeedbackEntry[]>([]);
  const [category, setCategory] = useState<'Gameplay' | 'Bug' | 'Feature Request' | 'General'>('General');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Load existing feedback from local storage
  useEffect(() => {
    const savedFeedback = localStorage.getItem('onegodia_community_feedback');
    if (savedFeedback) {
      try {
        setFeedbackList(JSON.parse(savedFeedback));
      } catch (err) {
        console.error('Failed to parse feedback from localStorage', err);
      }
    } else {
      // Default initial community posts
      const initialFeedback: FeedbackEntry[] = [
        {
          id: '1',
          username: 'Vanguard_01',
          category: 'Gameplay',
          message: 'The movement matrix in Genesis District One feels tight! Can’t wait for vehicle integration.',
          timestamp: '2026-09-20 14:32'
        },
        {
          id: '2',
          username: 'CyberScribe',
          category: 'Feature Request',
          message: 'Hoping to see custom scroll customization features for player housing in future updates!',
          timestamp: '2026-09-21 09:15'
        }
      ];
      setFeedbackList(initialFeedback);
      localStorage.setItem('onegodia_community_feedback', JSON.stringify(initialFeedback));
    }
  }, []);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sound.playClick();
    sound.playDing?.(1.0);

    const newEntry: FeedbackEntry = {
      id: Date.now().toString(),
      username: username.trim() || 'Anonymous Explorer',
      category,
      message: message.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    const updated = [newEntry, ...feedbackList];
    setFeedbackList(updated);
    localStorage.setItem('onegodia_community_feedback', JSON.stringify(updated));

    setMessage('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 md:p-12 font-sans">
      {/* Header Banner */}
      <header className="max-w-6xl mx-auto mb-10 text-center border-b border-cyan-900/50 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Founder-Led • AI-Assisted • Community-Driven
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
          Onegodia Community Portal
        </h1>
        <p className="mt-4 text-slate-400 max-w-2xl mx-auto text-sm sm:text-base md:text-lg">
          Join the global network of playtesters, developers, and creators shaping the evolution of <span className="text-slate-200 font-semibold">Onegodia: Rise of the Digital World™</span>.
        </p>
        
        {setActiveTab && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => { sound.playClick(); setActiveTab('prototype'); }}
              className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-xs font-mono font-semibold transition-all"
            >
              🎮 Play MVP Prototype
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveTab('missions'); }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-mono font-semibold transition-all"
            >
              📜 Mission Directives
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveTab('developers'); }}
              className="px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900 text-xs font-mono font-semibold transition-all"
            >
              ⚡ Developer Hub
            </button>
          </div>
        )}
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Official Community Hubs & Model */}
        <div className="space-y-6">
          
          {/* Social Links Matrix */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h2 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" /> Official Channels
            </h2>
            <div className="space-y-3">
              <a 
                href="https://discord.gg/onegodia" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 hover:bg-indigo-950/50 border border-slate-700/50 hover:border-indigo-500/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-slate-200 group-hover:text-indigo-300">Discord Community</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
              </a>

              <a 
                href="https://reddit.com/r/gamedev" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 hover:bg-orange-950/50 border border-slate-700/50 hover:border-orange-500/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-slate-200 group-hover:text-orange-300">Reddit (r/gamedev & r/unrealengine)</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-orange-400" />
              </a>

              <a 
                href="https://github.com/ohi-stack/onegodia-rise-of-the-digital-world/discussions" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Github className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold text-slate-200 group-hover:text-cyan-300">GitHub Discussions</span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
              </a>
            </div>
          </div>

          {/* Development Model Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-teal-400 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5" /> Contributor Guidelines
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Development is guided by Founder <span className="text-cyan-300 font-semibold">One Gregory Onegodian™</span>, powered by specialized AI studio agents, and iterated directly through community playtesting.
            </p>
            <ul className="text-xs space-y-2 text-slate-400 list-disc list-inside">
              <li>Submit feature ideas and bug reports via this portal or GitHub.</li>
              <li>Participate in 72-hour community sprint feedback cycles.</li>
              <li>Respect fellow developers and playtesters across all channels.</li>
            </ul>
          </div>

        </div>

        {/* Right Column: Player Feedback Intake & Live Stream */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Feedback Form Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyan-500 to-indigo-600" />
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-cyan-400" /> Direct Player Feedback Pipeline
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              Have suggestions or bug reports for Mission 001 or Genesis District One? Submit directly to the core development queue.
            </p>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Explorer / Handle</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. RogueOne_CT" 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="General">General Suggestion</option>
                    <option value="Gameplay">Gameplay Mechanics</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug">Bug Report</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Feedback Message</label>
                <textarea 
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your thoughts on core movement, UI HUD, or world interaction..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {submitted ? (
                  <span className="flex items-center gap-2 text-teal-400 text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Feedback logged to local queue!
                  </span>
                ) : <span />}
                
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-cyan-950/50 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" /> Dispatch Feedback
                </button>
              </div>
            </form>
          </div>

          {/* Live Feed Component */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" /> Recent Community Inputs
            </h3>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {feedbackList.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No feedback submitted yet. Be the first!</p>
              ) : (
                feedbackList.map((item) => (
                  <div key={item.id} className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 transition-all hover:border-slate-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-cyan-300">{item.username}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          item.category === 'Bug' ? 'bg-red-950/50 text-red-400 border-red-800/50' :
                          item.category === 'Gameplay' ? 'bg-teal-950/50 text-teal-400 border-teal-800/50' :
                          item.category === 'Feature Request' ? 'bg-indigo-950/50 text-indigo-400 border-indigo-800/50' :
                          'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CommunityPortal;
