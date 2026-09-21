import React from 'react';
import { NavigationTab } from '../types';
import {
  Play,
  Map,
  Car,
  Plane,
  Waves,
  Building2,
  Home,
  Hammer,
  Swords,
  Users,
  Coins,
  ShieldCheck,
  Sparkles,
  Compass,
  BriefcaseBusiness,
  Gamepad2
} from 'lucide-react';

interface GameplayViewProps {
  setActiveTab: (tab: NavigationTab) => void;
}

const FeatureCard = ({
  icon: Icon,
  title,
  status,
  children
}: {
  icon: React.FC<{ className?: string }>;
  title: string;
  status: string;
  children: React.ReactNode;
}) => (
  <article className="rounded-2xl border border-slate-800 bg-[#0b0e14]/90 p-5 shadow-lg shadow-black/20">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-blue-300" />
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded border border-slate-700 bg-slate-900 text-slate-300">
        {status}
      </span>
    </div>
    <div className="text-sm leading-6 text-slate-400">{children}</div>
  </article>
);

export const GameplayView: React.FC<GameplayViewProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-10 pb-14">
      <section className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-[#0a1220] via-[#080b12] to-[#050608] px-6 py-10 md:px-10 md:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.12),transparent_35%)]" />
        <div className="relative max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-semibold text-cyan-300 mb-5">
            <Gamepad2 className="w-3.5 h-3.5" />
            GAMEPLAY • CURRENT VISION + VERIFIED DEVELOPMENT BOUNDARIES
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-5">
            Explore the Thrilling Gameplay of Onegodia: Rise of the Digital World™
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-cyan-300 mb-4">
            Live. Build. Explore. Create.
          </p>
          <p className="max-w-3xl text-base md:text-lg leading-8 text-slate-300">
            Onegodia is an evolving open-world lifestyle simulation and digital-world adventure where players can explore cities,
            complete missions, drive vehicles, operate businesses, acquire game property, interact with characters, discover new
            environments, and help shape an expanding world.
          </p>

          <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <div className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-wider mb-2">Current gameplay foundation</div>
            <div className="font-mono text-sm md:text-base text-white">
              Launch → Spawn → Explore → Interact → Receive Objective → Complete Mission → Receive Result → Save Progress → Continue
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-7">
            <button onClick={() => setActiveTab('play')} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-black hover:bg-cyan-300 transition-colors">
              <Play className="w-4 h-4" /> Play Onegodia
            </button>
            <button onClick={() => setActiveTab('map')} className="inline-flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-bold text-blue-200 hover:bg-blue-500/20 transition-colors">
              <Map className="w-4 h-4" /> Explore World Map
            </button>
            <button onClick={() => setActiveTab('gameplay-grid')} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-slate-800 transition-colors">
              <Compass className="w-4 h-4" /> View Gameplay Grid
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <div className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">Starting World</div>
          <h2 className="text-2xl md:text-3xl font-black text-white">Explore Stamford</h2>
        </div>
        <div className="rounded-2xl border border-blue-500/20 bg-[#0b0e14] p-6">
          <p className="text-slate-300 leading-7">
            The first major Onegodia world is being built around Stamford, Connecticut. The player journey begins around the
            Stamford Hospital area and expands outward through the Hospital District, Washington Boulevard, Downtown Stamford,
            the Transportation Center, South End, Harbor Point, the waterfront, and later districts.
          </p>
          <p className="text-slate-400 leading-7 mt-3">
            The goal is not simply to display a map. Stamford is being developed as a place where the player can walk, drive,
            interact, complete missions, find opportunities, operate businesses, acquire game property, meet characters, and build a life.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-5">
          <div className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">Core + Future Systems</div>
          <h2 className="text-2xl md:text-3xl font-black text-white">How You Play</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <FeatureCard icon={Car} title="Driving & Vehicle Racing" status="Foundation / Roadmap">
            Transportation is a major part of the experience. Planned systems include cars, trucks, commercial vehicles,
            motorcycles, deliveries, races, time trials, tournaments, vehicle challenges, and mission-linked driving.
          </FeatureCard>

          <FeatureCard icon={Plane} title="Flying & Aviation" status="Roadmap">
            Future aviation may include aircraft ownership, flight training, air races, cargo and passenger missions,
            airport operations, airline businesses, scenic routes, aircraft customization, and long-distance travel.
          </FeatureCard>

          <FeatureCard icon={Sparkles} title="Majestic Flying Mounts" status="Roadmap">
            Fantasy and dimensional regions may introduce flying creatures and alternative aerial traversal for hidden
            areas, elevated environments, remote regions, and special quests.
          </FeatureCard>

          <FeatureCard icon={Compass} title="Missions & Story" status="Active Development">
            Missions connect movement, characters, locations, vehicles, businesses, property, and progression.
            Objectives can involve transportation, investigation, redevelopment, technology, exploration, deliveries, and discoveries.
          </FeatureCard>

          <FeatureCard icon={BriefcaseBusiness} title="Player-Owned Businesses" status="Roadmap">
            Future players may operate stores, restaurants, transportation companies, vehicle businesses, studios,
            construction companies, technology businesses, entertainment venues, workshops, aviation companies, and other game businesses.
          </FeatureCard>

          <FeatureCard icon={Home} title="Player-Owned Property" status="Roadmap">
            Planned property systems include homes, apartments, commercial buildings, offices, workshops, warehouses,
            development parcels, creator spaces, and other locations that can be acquired, improved, customized, or operated.
          </FeatureCard>

          <FeatureCard icon={Hammer} title="Crafting & Resource Management" status="Roadmap">
            Players may gather resources, discover rare materials, acquire tools, develop skills, and create construction
            materials, vehicle upgrades, clothing, equipment, technology, decorations, business inventory, and mission items.
          </FeatureCard>

          <FeatureCard icon={Waves} title="Sailing & Underwater Realms" status="Roadmap">
            Maritime expansion may include sailboats, speedboats, jet skis, yachts, submersibles, water races, coastal
            exploration, shipwrecks, marine missions, underwater facilities, rare resources, and submerged discoveries.
          </FeatureCard>

          <FeatureCard icon={Swords} title="Skill-Based Combat" status="Roadmap">
            Combat and competitive systems may include hand-to-hand encounters, structured arenas, tactical gameplay,
            team competition, abilities, defensive play, and PvP modes built around player skill, timing, and strategy.
          </FeatureCard>

          <FeatureCard icon={Users} title="Cooperative Multiplayer" status="Future Development">
            Multiplayer is intended to support exploration, groups, cooperative missions, businesses, events, racing,
            trading of eligible game assets, community projects, and structured competition after core networking and persistence are ready.
          </FeatureCard>

          <FeatureCard icon={Building2} title="Living Player-Driven World" status="Roadmap">
            Player activity may eventually affect properties, neighborhoods, businesses, character relationships,
            mission availability, local economies, development projects, events, and story outcomes.
          </FeatureCard>

          <FeatureCard icon={Coins} title="Digital Assets & Creator Economy" status="Compliance Locked / Roadmap">
            Ordinary gameplay does not require blockchain or a wallet. NFT-style assets, ODC, transfer systems, and
            blockchain verification remain optional future layers that may be activated only after separate technical, security, and compliance review.
          </FeatureCard>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck className="w-5 h-5 text-amber-300" />
          <h2 className="text-xl font-bold text-white">Casino and Chance-Based Concepts</h2>
        </div>
        <p className="text-sm leading-6 text-slate-300">
          Historical Onegodia planning explored casino and crypto-gambling concepts. These are not part of the current MVP
          or active gameplay offering. Any wagering, gambling, casino, crypto-casino, or real-money chance-based functionality
          remains compliance locked and would require separate legal, jurisdictional, age-verification, responsible-gaming,
          technical, financial, and policy review before activation.
        </p>
      </section>

      <section className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-cyan-500/5 p-7 md:p-9 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Build Onegodia With Us</h2>
        <p className="max-w-3xl mx-auto text-slate-300 leading-7">
          Players, developers, Unreal specialists, 3D artists, creators, YouTubers, streamers, vehicle enthusiasts,
          storytellers, testers, and community members can help shape the game through the development feedback loop.
        </p>
        <div className="font-mono text-sm text-cyan-300 mt-4">Play → Test → Report → Improve → Build → Release → Repeat</div>
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button onClick={() => setActiveTab('play')} className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-black hover:bg-cyan-300">
            <Play className="w-4 h-4" /> Play Prototype
          </button>
          <button onClick={() => setActiveTab('developers')} className="inline-flex items-center gap-2 rounded-xl border border-blue-500/40 bg-blue-500/10 px-5 py-3 text-sm font-bold text-blue-200 hover:bg-blue-500/20">
            <Users className="w-4 h-4" /> Build With Us
          </button>
        </div>
      </section>

      <section className="text-center py-4">
        <p className="text-xl font-bold text-white">Live. Build. Explore. Create.</p>
        <p className="text-sm text-slate-500 mt-2">Your journey into Onegodia begins here.</p>
      </section>
    </div>
  );
};
