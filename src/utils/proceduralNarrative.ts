/**
 * Procedural Narrative Synthesis Engine for Onegodia: Rise of the Digital World™
 * Generates dynamic, contextual narrative summaries, radio comms, and tactical AARs
 * for active and completed mission directives.
 */

import { Mission, MissionObjective, PlayerProgress } from '../types';

export interface NarrativeSummaryBundle {
  headline: string;
  statusOverview: string;
  tacticalAAR: {
    classification: string;
    clearanceCode: string;
    statusSummary: string;
    keyObservations: string[];
    threatLevel: string;
    directiveAssessment: string;
    nextStrategicAction: string;
  };
  radioComms: Array<{
    timestamp: string;
    speaker: 'ARIA PULSE' | 'FIELD OPERATIVE' | 'STAMFORD GRID DISPATCH' | 'SYSTEM CORE';
    callsign: string;
    message: string;
    type: 'incoming' | 'outgoing' | 'system';
  }>;
  chronicleProse: string[];
  quantumTelemetry: {
    carrierFrequency: string;
    resonanceHarmonic: string;
    encryptionProtocol: string;
    packetIntegrity: string;
    signalStabilityPercentage: number;
    rawTelemetryHex: string;
  };
}

const ENVIRONMENTAL_MOODS = [
  'dusk twilight amber glow over the glass spires of Stamford',
  'rain-slicked neon reflections along the Washington Boulevard transit corridor',
  'crisp Long Island Sound sea breeze cutting through Harbor Point',
  'low-frequency electromagnetic hum pulsating from the Sector 7 relay towers',
  'golden hour shadows stretching across the Onegodia Hub Plaza'
];

const ARIA_OBSERVATIONS = [
  'Grid telemetry indicates a sharp reduction in localized harmonic dissonance.',
  'Sector 7 sub-aqueduct routing is beginning to stabilize as the node frequency aligns.',
  'Civilians at Stamford Station have reported visual restoration of civic holographic displays.',
  'Data packet velocity along the north corridor has jumped by 34.8% since shard acquisition.'
];

export function generateProceduralNarrative(
  mission: Mission,
  progress?: PlayerProgress,
  seedModifier: number = 0
): NarrativeSummaryBundle {
  const completedObjs = mission.objectives.filter(o => o.isCompleted);
  const completedCount = completedObjs.length;
  const totalCount = mission.objectives.length;
  const isComplete = mission.status === 'Complete' || completedCount === totalCount;
  const activeObj = mission.objectives[mission.currentObjectiveIndex] || mission.objectives[0];

  const moodIndex = (completedCount + seedModifier) % ENVIRONMENTAL_MOODS.length;
  const mood = ENVIRONMENTAL_MOODS[moodIndex];

  // Base timestamps
  const baseTime = mission.startedAt || (Date.now() - completedCount * 90000);
  const formatTime = (offsetMs: number) => {
    const d = new Date(baseTime + offsetMs);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  // 1. Headline & Overview
  let headline = '';
  let statusOverview = '';

  if (isComplete) {
    headline = 'Sector 7 Core Stabilized — Signal Restoration Complete';
    statusOverview = `Citizen operative has successfully resolved directive [${mission.code}: ${mission.title}]. All 6 regional milestones cleared under nominal parameters. Onegodia Data Fragment #001 secured into the central archive; grid calibration at 100%.`;
  } else if (completedCount === 0) {
    headline = 'Directive Initialized — Awaiting Operative Deployment';
    statusOverview = `Contract [${mission.code}: ${mission.title}] is currently active. Operative awaiting initial contact with Aria Pulse at Onegodia Hub Plaza. Sector 7 frequency anomaly remains uncontained.`;
  } else if (completedCount <= 2) {
    headline = 'Transit Phase Active — Approaching Sector 7 Outpost';
    statusOverview = `Operative has mobilized along the neon transit highway. Uplink to Aria Pulse confirmed, with navigation telemetry tracking high-frequency interference emanating from the Sector 7 digital node shrine.`;
  } else if (completedCount <= 4) {
    headline = 'Harmonic Purification & Shard Extraction Underway';
    statusOverview = `Node #001 scanning and resonance calibration executed successfully. Corrupted frequency harmonics stabilized at 432 Hz; quantum Data Fragment #001 retrieved into operative payload locker.`;
  } else {
    headline = 'Extraction Vector Engaged — Returning to Hub Command';
    statusOverview = `Operative carrying stabilized digital shard back through the Stamford corridor. Sector 7 perimeter secure, awaiting final debrief and node integration at Hub Plaza.`;
  }

  // 2. Tactical AAR
  const tacticalAAR = {
    classification: 'ONEGODIA TACTICAL LEVEL-3 // RESTRICTED DISPATCH',
    clearanceCode: `OGD-${mission.code}-CLR-${(completedCount * 17 + 102).toString(16).toUpperCase()}`,
    statusSummary: isComplete
      ? 'DIRECTIVE ACCOMPLISHED — SIGNAL SECURED'
      : `OPERATIONAL IN PROGRESS — STEP ${Math.min(completedCount + 1, totalCount)} OF ${totalCount}`,
    threatLevel: isComplete ? 'NOMINAL / MONITORED' : completedCount >= 3 ? 'ELEVATED TELEMETRY NOISE' : 'LOW RISK URBAN TRANSIT',
    keyObservations: [
      `Milestone completion velocity: ${completedCount > 0 ? `${completedCount}/${totalCount} objectives verified` : 'Awaiting baseline traversal'}.`,
      `Ambient environmental state: ${mood}.`,
      ARIA_OBSERVATIONS[seedModifier % ARIA_OBSERVATIONS.length],
      `Cryptographic integrity of recovered shards: 99.87% match against Onegodia genesis protocol.`
    ],
    directiveAssessment: isComplete
      ? 'The operative demonstrated optimal pathfinding efficiency through the Stamford corridor. Shard #001 has restored primary civic telemetry across Sector 7.'
      : `Mission parameters remain well within tolerance thresholds. Immediate focus required on: "${activeObj?.description || 'Next directive objective'}".`,
    nextStrategicAction: isComplete
      ? 'Proceed to Stamford Station and Harbor Point for Phase 2 regional corridor expansion.'
      : `Advance coordinates toward ${activeObj?.targetZone || 'target waypoint'} [X: ${activeObj?.targetCoordinates?.x || 'N/A'}, Y: ${activeObj?.targetCoordinates?.y || 'N/A'}].`
  };

  // 3. Procedural Radio Comms
  const radioComms: NarrativeSummaryBundle['radioComms'] = [];

  // Message 1: Initial brief
  radioComms.push({
    timestamp: formatTime(0),
    speaker: 'ARIA PULSE',
    callsign: 'PULSE-ACTUAL',
    message: 'Citizen, Onegodia Hub is reading severe signal degradation along the Sector 7 conduit. I have uploaded the telemetry coordinates to your HUD. Move out when ready.',
    type: 'incoming'
  });

  if (completedCount >= 1) {
    radioComms.push({
      timestamp: formatTime(45000),
      speaker: 'FIELD OPERATIVE',
      callsign: 'OPERATIVE-01',
      message: 'Uplink authenticated at Hub Plaza. Receiving directive parameters. Heading onto the neon transit corridor.',
      type: 'outgoing'
    });
  }

  if (completedCount >= 2) {
    radioComms.push({
      timestamp: formatTime(110000),
      speaker: 'ARIA PULSE',
      callsign: 'PULSE-ACTUAL',
      message: 'Tracking your Cyber-Cruiser speed across Washington Boulevard. Watch the perimeter sensors near the Sector 7 overpass.',
      type: 'incoming'
    });
  }

  if (completedCount >= 3) {
    radioComms.push({
      timestamp: formatTime(185000),
      speaker: 'FIELD OPERATIVE',
      callsign: 'OPERATIVE-01',
      message: 'Node #001 in visual range. Commencing frequency scan... Hold frequency at 432 Hz. Purifying corruption vectors now.',
      type: 'outgoing'
    });
    radioComms.push({
      timestamp: formatTime(215000),
      speaker: 'SYSTEM CORE',
      callsign: 'OGD-SYS',
      message: 'SIGNAL HARMONICS RESTORED. NODE PURIFIED. QUANTUM SHARD RECOVERY PROTOCOL UNLOCKED.',
      type: 'system'
    });
  }

  if (completedCount >= 4) {
    radioComms.push({
      timestamp: formatTime(270000),
      speaker: 'FIELD OPERATIVE',
      callsign: 'OPERATIVE-01',
      message: 'Onegodia Data Fragment #001 is secured in my digital locker. Signal crystal resonance is stable.',
      type: 'outgoing'
    });
    radioComms.push({
      timestamp: formatTime(290000),
      speaker: 'ARIA PULSE',
      callsign: 'PULSE-ACTUAL',
      message: 'Splendid work! Bring that shard back to the Hub Plaza. The whole Sector 7 mesh is beginning to light back up.',
      type: 'incoming'
    });
  }

  if (completedCount >= 5) {
    radioComms.push({
      timestamp: formatTime(340000),
      speaker: 'STAMFORD GRID DISPATCH',
      callsign: 'METRO-GRID',
      message: 'Inbound operative detected approaching Onegodia Hub perimeter. Automated docking lane green.',
      type: 'incoming'
    });
  }

  if (isComplete) {
    radioComms.push({
      timestamp: formatTime(395000),
      speaker: 'ARIA PULSE',
      callsign: 'PULSE-ACTUAL',
      message: 'Fragment integrated! Signal restored to 100% calibration. Bounty of 250 CR has cleared your account. You have made history today in Onegodia.',
      type: 'incoming'
    });
  }

  // 4. Procedural Chronicle Prose
  const chronicleProse: string[] = [];

  chronicleProse.push(
    `The metropolitan skyline of Stamford stood quiet under the ${mood}. Far above the pavement, holographic billboards flickered with static, their digital glyphs distorted by the erratic signal pulse originating from the Sector 7 digital node shrine.`
  );

  if (completedCount >= 1) {
    chronicleProse.push(
      `At the center of Onegodia Hub Plaza, Aria Pulse met the operative with focused resolve. Her holographic visor reflected the amber light of the corridor. "The reconstruction of our world begins with a single stable frequency," she whispered, transmitting the encrypted telemetry into the operative's tactical wrist-comm.`
    );
  }

  if (completedCount >= 2) {
    chronicleProse.push(
      `Accelerating onto the neon-drenched transit highway, the operative steered past the high-rises of Washington Boulevard. The cybernetic road surface glowed with cyan guidance vectors, leading onward into the shadowed industrial perimeter of Sector 7.`
    );
  }

  if (completedCount >= 3) {
    chronicleProse.push(
      `The corrupted node loomed before them—a towering spire of crystalline lattice crackling with crimson distortion. Holding the sensor array steady, the operative initiated the harmonic calibration sweep. As the resonance stabilized, the red static collapsed into an ethereal wave of deep indigo light.`
    );
  }

  if (completedCount >= 4) {
    chronicleProse.push(
      `From the core of the purified shrine descended Onegodia Data Fragment #001—a prism of compressed memory containing the lost blueprints of Stamford's digital foundation. Cradling the shard into the magnetic containment locker, the operative felt the subtle pulse of restored vitality through their glove.`
    );
  }

  if (completedCount >= 5) {
    chronicleProse.push(
      `The return journey was marked by a visible transformation in the city. Street lamps hummed with newfound clarity, and the civic network began answering ping requests across Harbor Point and the downtown corridor.`
    );
  }

  if (isComplete) {
    chronicleProse.push(
      `Back at the Hub, the shard locked into the central spire with a resonant chime that echoed across the plaza. Sector 7 was no longer an isolated ghost district—it was reconnected to the living pulse of Onegodia. The first chapter in the rise of the digital world had been written.`
    );
  }

  // 5. Quantum Telemetry
  const stabilityPct = isComplete ? 100 : Math.min(95, Math.round(15 + (completedCount / totalCount) * 80));
  const quantumTelemetry = {
    carrierFrequency: `${(432.84 + completedCount * 12.4).toFixed(2)} MHz`,
    resonanceHarmonic: isComplete ? 'SYNCHRONIZED (1:1.000)' : `CALIBRATING (${(0.65 + completedCount * 0.05).toFixed(3)})`,
    encryptionProtocol: 'OGD-GENESIS-AES256-GCM',
    packetIntegrity: `${(96.2 + completedCount * 0.6).toFixed(1)}%`,
    signalStabilityPercentage: stabilityPct,
    rawTelemetryHex: `0x7F4B${(completedCount * 1234).toString(16).toUpperCase()}..892A..ONEGODIA`
  };

  return {
    headline,
    statusOverview,
    tacticalAAR,
    radioComms,
    chronicleProse,
    quantumTelemetry
  };
}
