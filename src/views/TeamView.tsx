import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Crown,
  Loader2,
  Search,
  Send,
  ShieldCheck,
  Users
} from 'lucide-react';
import { AGENT_ROSTER, HUMAN_LEADERSHIP } from '../data/agentRoster';
import { networkNodeService, AgentDispatchResponse } from '../services/networkNodeService';
import { sound } from '../services/audioService';

type ProviderRoute = 'auto' | 'gemini' | 'openai' | 'anthropic' | 'xai' | 'acc';

export const TeamView: React.FC = () => {
  const [department, setDepartment] = useState('All Departments');
  const [search, setSearch] = useState('');
  const [selectedAgentRole, setSelectedAgentRole] = useState(AGENT_ROSTER[0].dispatchRole);
  const [provider, setProvider] = useState<ProviderRoute>('auto');
  const [prompt, setPrompt] = useState('Review the current Onegodia playable-first priority and identify the next task inside your assigned scope.');
  const [isDispatching, setIsDispatching] = useState(false);
  const [response, setResponse] = useState<AgentDispatchResponse | null>(null);

  const departments = useMemo(
    () => ['All Departments', ...Array.from(new Set(AGENT_ROSTER.map((agent) => agent.department))).sort()],
    []
  );

  const visibleAgents = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return AGENT_ROSTER.filter((agent) => {
      const departmentMatch = department === 'All Departments' || agent.department === department;
      const searchMatch = !normalizedSearch || [agent.name, agent.title, agent.department, agent.id, agent.summary]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);
      return departmentMatch && searchMatch;
    });
  }, [department, search]);

  const selectedAgent = AGENT_ROSTER.find((agent) => agent.dispatchRole === selectedAgentRole) || AGENT_ROSTER[0];

  const dispatchAgent = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!prompt.trim() || isDispatching) return;

    sound.playClick();
    setIsDispatching(true);
    setResponse(null);

    try {
      const result = await networkNodeService.dispatchAgentQuery(
        prompt,
        selectedAgent.dispatchRole,
        provider,
        {
          agentId: selectedAgent.id,
          agentName: selectedAgent.name,
          title: selectedAgent.title,
          department: selectedAgent.department,
          scopeStatus: selectedAgent.scopeStatus,
          humanFinalAuthority: HUMAN_LEADERSHIP.name,
          productionDoctrine: 'Playable first. Expansive later.'
        }
      );
      setResponse(result);
      sound.playReward();
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="space-y-6 py-2">
      <section className="rounded-2xl border border-[#1e2230] bg-[#0c0e14] p-5 sm:p-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_42%)] pointer-events-none" />
        <div className="relative z-10 grid gap-5 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-950/30 px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-blue-300">
              <Users className="h-3.5 w-3.5" />
              Onegodia AI Game Studio • 31-Agent Studio
            </div>
            <h1 className="mt-4 text-2xl sm:text-3xl font-black text-white tracking-tight">
              Meet the Onegodia AI Game Studio Team
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
              Onegodia: Rise of the Digital World™ is developed through a hybrid studio structure: human creative and production authority led by Gregory L. Jones, supported by specialized AI development agents working across design, engineering, world production, art, audio, QA, documentation, community, media, and future-systems research.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-mono">
              <span className="rounded border border-emerald-700/50 bg-emerald-950/30 px-2 py-1 text-emerald-300">Human-directed</span>
              <span className="rounded border border-blue-700/50 bg-blue-950/30 px-2 py-1 text-blue-300">GitHub-controlled</span>
              <span className="rounded border border-amber-700/50 bg-amber-950/30 px-2 py-1 text-amber-300">Playable first</span>
              <span className="rounded border border-slate-700 bg-[#11131a] px-2 py-1 text-slate-300">Evidence before verification</span>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-[#090b10]/90 p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-950/30 text-amber-300">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">Human Final Authority</div>
                <h2 className="mt-1 text-base font-bold text-white">{HUMAN_LEADERSHIP.name}</h2>
                <div className="text-xs text-amber-200">{HUMAN_LEADERSHIP.publicName}</div>
                <div className="mt-1 text-xs text-slate-300">{HUMAN_LEADERSHIP.title}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              {HUMAN_LEADERSHIP.responsibilities.map((item) => (
                <div key={item} className="flex items-start gap-2 text-[11px] text-slate-400">
                  <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-amber-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[#1e2230] bg-[#0c0e14] p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">Canonical Roster</div>
            <h2 className="mt-1 text-lg font-bold text-white">31 AI Agents • One Controlled Studio</h2>
            <p className="mt-1 text-xs text-slate-400">Named personas are AI development-agent identities, not representations of human employees or corporate officers.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:w-[560px]">
            <label className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search agent, ID, department..."
                className="w-full rounded-lg border border-[#1e2230] bg-[#11131a] py-2 pl-9 pr-3 text-xs text-slate-200 outline-none focus:border-blue-500"
              />
            </label>
            <select
              value={department}
              onChange={(event) => setDepartment(event.target.value)}
              className="rounded-lg border border-[#1e2230] bg-[#11131a] px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
            >
              {departments.map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleAgents.map((agent) => {
            const isSelected = selectedAgentRole === agent.dispatchRole;
            const isRoadmap = agent.scopeStatus === 'Roadmap / Compliance-Locked';
            return (
              <button
                type="button"
                key={agent.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedAgentRole(agent.dispatchRole);
                }}
                className={`rounded-xl border p-4 text-left transition-all ${isSelected ? 'border-blue-500/80 bg-blue-950/25 shadow-md shadow-blue-950/30' : 'border-[#1e2230] bg-[#090b10] hover:border-slate-600 hover:bg-[#11131a]'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${isSelected ? 'border-blue-500/50 bg-blue-950/50 text-blue-300' : 'border-[#1e2230] bg-[#11131a] text-slate-400'}`}>
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-white">{agent.name}</div>
                      <div className="truncate text-[10px] font-mono text-slate-500">{agent.id}</div>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase ${isRoadmap ? 'border-amber-800/60 bg-amber-950/30 text-amber-300' : 'border-emerald-800/60 bg-emerald-950/30 text-emerald-300'}`}>
                    {isRoadmap ? 'Locked' : 'Active'}
                  </span>
                </div>
                <div className="mt-3 text-xs font-semibold text-blue-200">{agent.title}</div>
                <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-slate-500">{agent.department}</div>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{agent.summary}</p>
                <div className="mt-3 border-t border-[#1e2230] pt-2">
                  <div className="text-[9px] font-mono uppercase tracking-wider text-slate-600">Primary responsibilities</div>
                  <div className="mt-1 text-[10px] leading-relaxed text-slate-400">{agent.responsibilities.slice(0, 3).join(' • ')}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl border border-[#1e2230] bg-[#0c0e14] p-4">
        <div className="flex flex-col gap-3 border-b border-[#1e2230] pb-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">Human-Directed Agent Command</div>
            <h2 className="mt-1 text-base font-bold text-white">Dispatch a Studio Agent</h2>
          </div>
          <div className="text-[10px] font-mono text-slate-500">Final authority remains with {HUMAN_LEADERSHIP.name}</div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[0.9fr_0.6fr]">
          <div className="rounded-lg border border-blue-500/30 bg-blue-950/15 p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-xs font-bold text-blue-200">{selectedAgent.name}</div>
                <div className="text-[10px] font-mono text-slate-500">{selectedAgent.id} • {selectedAgent.department}</div>
              </div>
              <ShieldCheck className="h-4 w-4 text-blue-400" />
            </div>
            <p className="mt-2 text-[11px] text-slate-400">{selectedAgent.summary}</p>
          </div>

          <select
            value={provider}
            onChange={(event) => setProvider(event.target.value as ProviderRoute)}
            className="rounded-lg border border-[#1e2230] bg-[#11131a] px-3 py-2 text-xs text-slate-200 outline-none focus:border-amber-500"
          >
            <option value="auto">Auto Routing</option>
            <option value="gemini">Google Gemini</option>
            <option value="openai">OpenAI</option>
            <option value="anthropic">Anthropic Claude</option>
            <option value="xai">xAI Grok</option>
            <option value="acc">ACC Gateway</option>
          </select>
        </div>

        {selectedAgent.scopeStatus === 'Roadmap / Compliance-Locked' && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-800/50 bg-amber-950/20 p-3 text-[11px] text-amber-200">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>This agent may research and plan future digital-economy systems, but it cannot activate ODC, blockchain transactions, token sales, marketplaces, gambling, or other compliance-locked functionality.</span>
          </div>
        )}

        <form onSubmit={dispatchAgent} className="mt-3 flex flex-col gap-2 sm:flex-row">
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            rows={3}
            className="min-h-[84px] flex-1 resize-y rounded-lg border border-[#1e2230] bg-[#11131a] px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-amber-500"
            placeholder="Give the selected agent a scoped development task..."
          />
          <button
            type="submit"
            disabled={isDispatching || !prompt.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-black text-slate-950 transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-40"
          >
            {isDispatching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {isDispatching ? 'Dispatching' : 'Dispatch Agent'}
          </button>
        </form>

        {response && (
          <div className="mt-3 rounded-lg border border-[#1e2230] bg-[#07090e] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1e2230] pb-2 text-[10px] font-mono">
              <span className="font-bold text-amber-300">{selectedAgent.name}</span>
              <span className="text-slate-500">{response.provider} • {response.model}</span>
            </div>
            <div className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-slate-300">{response.response}</div>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-[#1e2230] bg-[#090b10] p-4 text-xs text-slate-400">
        <div className="font-bold text-white">Studio Operating Rule</div>
        <p className="mt-2 leading-relaxed">
          Receive Task → Inspect Current Source → Define Dependencies → Implement → Build → Test → Produce Evidence → Human/QA Review → Commit → Document. No AI agent may independently expand approved scope, spend funds, execute agreements, activate compliance-locked systems, publish production releases, or declare its own work verified.
        </p>
      </section>
    </div>
  );
};
