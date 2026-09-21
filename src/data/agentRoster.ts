export type AgentScopeStatus = 'Active' | 'Roadmap / Compliance-Locked';

export interface HumanLeadershipRecord {
  name: string;
  publicName: string;
  title: string;
  type: 'Human Leadership';
  finalAuthority: true;
  responsibilities: string[];
}

export interface GameStudioAgent {
  id: string;
  dispatchRole: string;
  name: string;
  title: string;
  department: string;
  type: 'AI Agent';
  scopeStatus: AgentScopeStatus;
  summary: string;
  responsibilities: string[];
  requiresHumanApproval: true;
}

export const HUMAN_LEADERSHIP: HumanLeadershipRecord = {
  name: 'Gregory L. Jones',
  publicName: 'One Gregory Onegodian™',
  title: 'Founder, Creator & Game Director',
  type: 'Human Leadership',
  finalAuthority: true,
  responsibilities: [
    'Creative vision and game direction',
    'Gameplay and production scope approval',
    'Major technical and repository architecture decisions',
    'Release and public-representation approval',
    'Partnership, spending, digital-economy, and compliance-sensitive approvals'
  ]
};

export const AGENT_ROSTER: GameStudioAgent[] = [
  {
    id: 'OG-AGENT-GD-001', dispatchRole: 'AI-Emma-Davies-Lead-Game-Design', name: 'Emma Davies Agent', title: 'Lead Game Design Agent', department: 'Game Design', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Translates the Onegodia vision into structured, testable gameplay systems.',
    responsibilities: ['Core gameplay loops', 'Player motivation and progression', 'Game-design specifications', 'Feature acceptance criteria']
  },
  {
    id: 'OG-AGENT-GD-002', dispatchRole: 'AI-Jessica-Turner-Gameplay-Quest', name: 'Jessica Turner Agent', title: 'Gameplay Systems & Quest Design Agent', department: 'Game Design', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Designs moment-to-moment gameplay, missions, objectives, rewards, and player-choice structures.',
    responsibilities: ['Quest architecture', 'Mission states', 'Objective logic', 'Rewards and pacing']
  },
  {
    id: 'OG-AGENT-GD-003', dispatchRole: 'AI-Sophia-Martinez-Narrative-Gameplay', name: 'Sophia Martinez Agent', title: 'Narrative Gameplay Designer', department: 'Game Design', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Connects Onegodia story, lore, and consequence-driven choices to gameplay.',
    responsibilities: ['Narrative progression', 'World events', 'Quest chains', 'Player-choice consequences']
  },
  {
    id: 'OG-AGENT-DEV-001', dispatchRole: 'AI-Aaron-Lopez-Lead-Development', name: 'Aaron Lopez Agent', title: 'Lead Development Agent', department: 'Engineering', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Coordinates technical implementation across gameplay engineering systems.',
    responsibilities: ['Technical implementation planning', 'Feature decomposition', 'Architecture review', 'Cross-agent dependency tracking']
  },
  {
    id: 'OG-AGENT-DEV-002', dispatchRole: 'AI-Daniel-Ramirez-Lead-Programmer', name: 'Daniel Ramirez Agent', title: 'Lead Programmer Agent', department: 'Engineering', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Owns core programming architecture and implementation standards.',
    responsibilities: ['Unreal architecture', 'Blueprint and C++ systems', 'Game state', 'Performance-sensitive implementation']
  },
  {
    id: 'OG-AGENT-ART-001', dispatchRole: 'AI-Sophie-Nguyen-Environment-Art', name: 'Sophie Nguyen Agent', title: 'Environment Art Director', department: 'Art & World', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Defines the visual direction for Onegodia environments and city spaces.',
    responsibilities: ['Environment art direction', 'Architectural language', 'Lighting direction', 'Visual consistency']
  },
  {
    id: 'OG-AGENT-ART-002', dispatchRole: 'AI-Emily-Johnson-Production-Art', name: 'Emily Johnson Agent', title: 'Production Art Director', department: 'Art & World', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Converts visual direction into repeatable asset-production standards.',
    responsibilities: ['Art-production pipeline', 'Asset review', 'VFX consistency', 'Asset organization']
  },
  {
    id: 'OG-AGENT-ART-003', dispatchRole: 'AI-Alex-Turner-Visual-World', name: 'Alex Turner Agent', title: 'Visual World Director', department: 'Art & World', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Shapes cityscapes, hero environments, landmarks, and cinematic visual composition.',
    responsibilities: ['Cityscape concepts', 'Hero environments', 'Landmark composition', 'Cinematic framing']
  },
  {
    id: 'OG-AGENT-WEB3-001', dispatchRole: 'AI-Jason-Harper-Digital-Asset-Architecture', name: 'Jason Harper Agent', title: 'Digital Asset Architecture Agent', department: 'Digital Economy Research', type: 'AI Agent', scopeStatus: 'Roadmap / Compliance-Locked', requiresHumanApproval: true,
    summary: 'Researches future digital-asset architecture without activating financial systems.',
    responsibilities: ['Digital asset specifications', 'Ownership-model research', 'Marketplace architecture research', 'Security requirements']
  },
  {
    id: 'OG-AGENT-WEB3-002', dispatchRole: 'AI-Michael-Chen-Blockchain-Engineering', name: 'Michael Chen Agent', title: 'Blockchain Engineering Agent', department: 'Digital Economy Research', type: 'AI Agent', scopeStatus: 'Roadmap / Compliance-Locked', requiresHumanApproval: true,
    summary: 'Designs future blockchain interfaces and test architecture subject to separate activation review.',
    responsibilities: ['Smart-contract architecture', 'Blockchain interfaces', 'Wallet integration research', 'Test-environment planning']
  },
  {
    id: 'OG-AGENT-WEB3-003', dispatchRole: 'AI-Ryan-Johnson-Digital-Economy-Research', name: 'Ryan Johnson Agent', title: 'Digital Economy Research Agent', department: 'Digital Economy Research', type: 'AI Agent', scopeStatus: 'Roadmap / Compliance-Locked', requiresHumanApproval: true,
    summary: 'Evaluates future game-economy models, feasibility, and risk before implementation.',
    responsibilities: ['Economy simulation', 'Blockchain feasibility analysis', 'Technical risk analysis', 'Compliance escalation']
  },
  {
    id: 'OG-AGENT-NPC-001', dispatchRole: 'AI-Emily-Chen-NPC-Dialogue', name: 'Emily Chen Agent', title: 'NPC & Dialogue Systems Agent', department: 'NPC & Intelligent World', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Develops controlled NPC interaction, dialogue, mission connections, and future behavior architecture.',
    responsibilities: ['NPC definitions', 'Dialogue trees', 'Mission connections', 'StateTree and Behavior Tree planning']
  },
  {
    id: 'OG-AGENT-COM-001', dispatchRole: 'AI-Natalie-Wright-Community-Intelligence', name: 'Natalie Wright Agent', title: 'Community Intelligence Agent', department: 'Community', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Turns player and creator feedback into structured development intelligence.',
    responsibilities: ['Feedback analysis', 'Playtest reports', 'Community announcements', 'Feedback-to-GitHub conversion']
  },
  {
    id: 'OG-AGENT-COM-002', dispatchRole: 'AI-Jessica-Lee-Community-Engagement', name: 'Jessica Lee Agent', title: 'Community Engagement Agent', department: 'Community', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Coordinates direct player participation and early-community programs.',
    responsibilities: ['Playtester onboarding', 'Community events', 'Surveys and feature voting', 'Contributor recognition']
  },
  {
    id: 'OG-AGENT-AUDIO-001', dispatchRole: 'AI-Michael-Davis-Sound-Music', name: 'Michael Davis Agent', title: 'Sound & Music Production Agent', department: 'Audio', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Defines the interactive soundscape and music-production requirements for Onegodia.',
    responsibilities: ['Environmental audio', 'Sound effects', 'Music direction', 'MetaSounds planning']
  },
  {
    id: 'OG-AGENT-UI-001', dispatchRole: 'AI-Andrew-Clark-UX-UI-HUD', name: 'Andrew Clark Agent', title: 'UX/UI & HUD Agent', department: 'UX/UI', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Designs clear player-facing HUD, menus, interaction prompts, and accessible control experiences.',
    responsibilities: ['HUD and menus', 'Mission UI', 'Tactical map UX', 'Accessibility and controller UX']
  },
  {
    id: 'OG-AGENT-MKT-001', dispatchRole: 'AI-Chief-Marketing', name: 'Chief Marketing Agent', title: 'Game Marketing & Positioning Agent', department: 'Marketing & Media', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Builds transparent launch, SEO, and player-acquisition campaigns tied to verified development status.',
    responsibilities: ['Game positioning', 'Launch campaigns', 'SEO and social campaigns', 'Status-safe release communications']
  },
  {
    id: 'OG-AGENT-MEDIA-001', dispatchRole: 'AI-Creator-Media', name: 'Creator & Media Agent', title: 'Creator & Media Agent', department: 'Marketing & Media', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Prepares creator outreach, gameplay media, devlogs, and feedback loops.',
    responsibilities: ['YouTuber outreach', 'Creator briefs', 'Gameplay clips and trailers', 'Media kits']
  },
  {
    id: 'OG-AGENT-BIZ-001', dispatchRole: 'AI-Director-Development', name: 'Director of Development Agent', title: 'Director of Development Agent', department: 'Business & Development', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Coordinates developer recruitment, external contributors, and technology relationships.',
    responsibilities: ['Developer recruitment', 'Contributor coordination', 'Technology relationships', 'Developer onboarding']
  },
  {
    id: 'OG-AGENT-BIZ-002', dispatchRole: 'AI-Business-Development', name: 'Business Development Agent', title: 'Business Development Agent', department: 'Business & Development', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Researches strategic partnerships, licensing, sponsorships, and platform opportunities.',
    responsibilities: ['Strategic partnerships', 'Licensing research', 'Vendor opportunities', 'Sponsorship research']
  },
  {
    id: 'OG-AGENT-FIN-001', dispatchRole: 'AI-Chief-Financial-Planning', name: 'Chief Financial Planning Agent', title: 'Chief Financial Planning Agent', department: 'Finance & Production Controls', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Provides analytical production budgeting and scenario planning without autonomous financial authority.',
    responsibilities: ['Development budgets', 'Cost estimates', 'Infrastructure-cost models', 'Production forecasting']
  },
  {
    id: 'OG-AGENT-UE-001', dispatchRole: 'AI-Unreal-Gameplay', name: 'Unreal Gameplay Agent', title: 'Unreal Gameplay Agent — The Engine Smith', department: 'Unreal Engineering', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Plans and implements Unreal gameplay architecture for the playable production path.',
    responsibilities: ['Gameplay framework', 'Character systems', 'Interaction architecture', 'Unreal integration']
  },
  {
    id: 'OG-AGENT-UE-002', dispatchRole: 'AI-Blueprint', name: 'Blueprint Agent', title: 'Blueprint Agent', department: 'Unreal Engineering', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Specializes in Blueprint prototyping and reusable gameplay logic.',
    responsibilities: ['Blueprint architecture', 'Interaction logic', 'Gameplay prototyping', 'Reusable Blueprint components']
  },
  {
    id: 'OG-AGENT-UE-003', dispatchRole: 'AI-CPP-Engineering', name: 'C++ Engineering Agent', title: 'C++ Engineering Agent', department: 'Unreal Engineering', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Builds reusable, architecture-level, and performance-sensitive Unreal C++ systems.',
    responsibilities: ['C++ gameplay systems', 'Reusable modules', 'Performance-critical code', 'Plugin architecture']
  },
  {
    id: 'OG-AGENT-WORLD-001', dispatchRole: 'AI-World-Building', name: 'World-Building Agent', title: 'World-Building Agent — The Cartographer', department: 'World Production', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Builds Stamford-first world specifications, GIS integration, districts, roads, and streaming plans.',
    responsibilities: ['Stamford world planning', 'GIS integration', 'Road and district systems', 'World Partition and PCG']
  },
  {
    id: 'OG-AGENT-VEH-001', dispatchRole: 'AI-Vehicle-Systems', name: 'Vehicle Systems Agent', title: 'Vehicle Systems Agent — The Mechanic', department: 'Gameplay Systems', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Develops entry, driving, camera, physics, and vehicle-mission systems.',
    responsibilities: ['Vehicle entry and exit', 'Driving controls', 'Vehicle physics', 'Driving missions']
  },
  {
    id: 'OG-AGENT-QA-001', dispatchRole: 'AI-QA', name: 'QA Agent', title: 'QA Agent — The Inspector', department: 'Quality Assurance', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Validates implementation against acceptance criteria and requires evidence before verification.',
    responsibilities: ['Functional testing', 'Bug reproduction', 'Regression testing', 'Build and gameplay validation']
  },
  {
    id: 'OG-AGENT-REPO-001', dispatchRole: 'AI-Repository-Source', name: 'Repository & Source Agent', title: 'Repository & Source Agent — The Archivist', department: 'Repository & Documentation', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Maintains GitHub traceability, source structure, issues, commits, and development evidence.',
    responsibilities: ['GitHub issues', 'Repository structure', 'Commit traceability', 'Source-document reconciliation']
  },
  {
    id: 'OG-AGENT-REL-001', dispatchRole: 'AI-Build-Release', name: 'Build & Release Agent', title: 'Build & Release Agent — The Launch Rail', department: 'Release Engineering', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Coordinates build validation, release candidates, versioning, and deployment checks.',
    responsibilities: ['Build validation', 'CI/CD', 'Release notes', 'Deployment checks']
  },
  {
    id: 'OG-AGENT-DOC-001', dispatchRole: 'AI-Documentation', name: 'Documentation Agent', title: 'Documentation Agent', department: 'Repository & Documentation', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Keeps implementation documentation synchronized with verified repository state.',
    responsibilities: ['Technical documentation', 'Status documentation', 'Release documentation', 'Implementation evidence records']
  },
  {
    id: 'OG-AGENT-COMP-001', dispatchRole: 'AI-Compliance-Review', name: 'Compliance Review Agent', title: 'Compliance Review Agent — The Gatekeeper', department: 'Compliance', type: 'AI Agent', scopeStatus: 'Active', requiresHumanApproval: true,
    summary: 'Flags legal, licensing, privacy, financial, gambling, digital-asset, and public-claim risks for human review.',
    responsibilities: ['Compliance review', 'Licensing flags', 'Public-claim review', 'Digital-economy and gambling escalation']
  }
];

export const getAgentByDispatchRole = (dispatchRole: string): GameStudioAgent | undefined =>
  AGENT_ROSTER.find((agent) => agent.dispatchRole === dispatchRole);

export const ACTIVE_AGENT_ROSTER = AGENT_ROSTER.filter((agent) => agent.scopeStatus === 'Active');
export const ROADMAP_AGENT_ROSTER = AGENT_ROSTER.filter((agent) => agent.scopeStatus === 'Roadmap / Compliance-Locked');
