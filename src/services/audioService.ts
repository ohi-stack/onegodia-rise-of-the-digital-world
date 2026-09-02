/**
 * Procedural Audio Synthesizer for Onegodia: Rise of the Digital World™
 * Uses Web Audio API to generate zero-latency futuristic sci-fi sound effects.
 */

export interface SoundSettings {
  masterMuted: boolean;
  tacticalAlerts: boolean;
  ambientUI: boolean;
  volume: number;
}

const SOUND_STORAGE_KEY = 'onegodia_sound_settings_v1';

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private tacticalAlertsEnabled: boolean = true;
  private ambientUIEnabled: boolean = true;
  private volumeLevel: number = 1.0;
  private listeners: Array<(settings: SoundSettings) => void> = [];

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(SOUND_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.masterMuted === 'boolean') this.isMuted = parsed.masterMuted;
        if (typeof parsed.tacticalAlerts === 'boolean') this.tacticalAlertsEnabled = parsed.tacticalAlerts;
        if (typeof parsed.ambientUI === 'boolean') this.ambientUIEnabled = parsed.ambientUI;
        if (typeof parsed.volume === 'number') this.volumeLevel = parsed.volume;
      }
    } catch {
      // ignore
    }
  }

  private saveSettings() {
    if (typeof window === 'undefined') return;
    try {
      const data: SoundSettings = {
        masterMuted: this.isMuted,
        tacticalAlerts: this.tacticalAlertsEnabled,
        ambientUI: this.ambientUIEnabled,
        volume: this.volumeLevel,
      };
      localStorage.setItem(SOUND_STORAGE_KEY, JSON.stringify(data));
      this.notifyListeners();
    } catch {
      // ignore
    }
  }

  public getSettings(): SoundSettings {
    return {
      masterMuted: this.isMuted,
      tacticalAlerts: this.tacticalAlertsEnabled,
      ambientUI: this.ambientUIEnabled,
      volume: this.volumeLevel,
    };
  }

  public subscribe(callback: (settings: SoundSettings) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners() {
    const s = this.getSettings();
    this.listeners.forEach((cb) => {
      try {
        cb(s);
      } catch {
        // ignore
      }
    });
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    this.saveSettings();
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.saveSettings();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleTacticalAlerts(): boolean {
    this.tacticalAlertsEnabled = !this.tacticalAlertsEnabled;
    this.saveSettings();
    return this.tacticalAlertsEnabled;
  }

  public setTacticalAlerts(enabled: boolean) {
    this.tacticalAlertsEnabled = enabled;
    this.saveSettings();
  }

  public getTacticalAlerts(): boolean {
    return this.tacticalAlertsEnabled;
  }

  public toggleAmbientUI(): boolean {
    this.ambientUIEnabled = !this.ambientUIEnabled;
    this.saveSettings();
    return this.ambientUIEnabled;
  }

  public setAmbientUI(enabled: boolean) {
    this.ambientUIEnabled = enabled;
    this.saveSettings();
  }

  public getAmbientUI(): boolean {
    return this.ambientUIEnabled;
  }

  public setVolume(vol: number) {
    this.volumeLevel = Math.max(0, Math.min(1, vol));
    this.saveSettings();
  }

  public getVolume(): number {
    return this.volumeLevel;
  }

  // Futuristic UI button click
  public playClick() {
    if (this.isMuted || !this.ambientUIEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.12 * this.volumeLevel, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {
      // ignore audio errors
    }
  }

  // Player Jump Matrix
  public playJump() {
    if (this.isMuted || !this.ambientUIEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {
      // ignore
    }
  }

  // Radar Scan pulse
  public playRadarScan() {
    if (this.isMuted || !this.tacticalAlertsEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.1 * this.volumeLevel, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch {
      // ignore
    }
  }

  // Scanning Corrupted Node
  public playNodeScanBeep(progress: number) {
    if (this.isMuted || !this.tacticalAlertsEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = 400 + progress * 600;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.05 * this.volumeLevel, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // ignore
    }
  }

  // Data Fragment Collected
  public playFragmentCollected() {
    if (this.isMuted || !this.ambientUIEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const startTime = this.ctx.currentTime + idx * 0.08;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15 * this.volumeLevel, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch {
      // ignore
    }
  }

  // Mission Complete Fanfare
  public playMissionComplete() {
    if (this.isMuted || !this.tacticalAlertsEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const chords = [
        { freq: 440, time: 0 },
        { freq: 554.37, time: 0.1 },
        { freq: 659.25, time: 0.2 },
        { freq: 880, time: 0.3 },
        { freq: 1108.73, time: 0.45 },
      ];

      chords.forEach((note) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const startTime = this.ctx.currentTime + note.time;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, startTime);

        gain.gain.setValueAtTime(0.18 * this.volumeLevel, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.55);
      });
    } catch {
      // ignore
    }
  }

  // Vehicle mount/ignition
  public playVehicleIgnition() {
    if (this.isMuted || !this.ambientUIEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.12 * this.volumeLevel, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.36);
    } catch {
      // ignore
    }
  }

  // Warp / Teleport Chime
  public playWarp() {
    if (this.isMuted || !this.ambientUIEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.25);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.5);

      gain.gain.setValueAtTime(0.15 * this.volumeLevel, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.52);
    } catch {
      // ignore
    }
  }

  // Hazard Alert Siren / Sentinel Lock-On Alarm
  public playHazardAlert() {
    if (this.isMuted || !this.tacticalAlertsEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);

      gain.gain.setValueAtTime(0.18 * this.volumeLevel, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.31);
    } catch {
      // ignore
    }
  }

  // Mission Reset / Extraction Glitch Sound
  public playMissionReset() {
    if (this.isMuted || !this.tacticalAlertsEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.4);

      gain.gain.setValueAtTime(0.2 * this.volumeLevel, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.41);
    } catch {
      // ignore
    }
  }

  // Reward / Stripe Purchase Chime
  public playReward() {
    if (this.isMuted || !this.ambientUIEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.15 * this.volumeLevel, this.ctx!.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(this.ctx!.currentTime + idx * 0.08);
        osc.stop(this.ctx!.currentTime + idx * 0.08 + 0.36);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Mission Objective Completed Audio Cue
   * Uses Web Audio API to create a crisp, subtle, futuristic dual-harmonic chime
   * with smooth lowpass filtering and exponential decay for tactile feedback.
   */
  public playObjectiveComplete(stepNumber: number = 1) {
    if (this.isMuted || !this.tacticalAlertsEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // Step-indexed pitch harmonic scaling (D Major Pentatonic cyber chord)
      // Base frequencies provide an uplifting, subtle confirmation feel
      const rootOffset = (stepNumber - 1) * 35;
      const baseFreqs = [587.33 + rootOffset, 880 + rootOffset, 1174.66 + rootOffset]; // D5, A5, D6
      
      // Shared lowpass filter for silky, warm sci-fi resonance without harsh clicks
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(1200, now + 0.35);
      filter.Q.setValueAtTime(1.5, now);
      filter.connect(this.ctx.destination);

      baseFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const noteTime = now + idx * 0.055;
        osc.type = idx === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq * 0.98, noteTime);
        osc.frequency.exponentialRampToValueAtTime(freq, noteTime + 0.04);

        // Soft attack, pleasant tactical decay
        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime((0.12 / (idx + 1)) * this.volumeLevel, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.32);

        osc.connect(gain);
        gain.connect(filter);

        osc.start(noteTime);
        osc.stop(noteTime + 0.35);
      });

      // Subtle sub-click tick for tactile physical transient
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(1400, now);
      clickOsc.frequency.exponentialRampToValueAtTime(220, now + 0.03);
      clickGain.gain.setValueAtTime(0.08 * this.volumeLevel, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      clickOsc.connect(clickGain);
      clickGain.connect(filter);
      clickOsc.start(now);
      clickOsc.stop(now + 0.04);

    } catch {
      // ignore audio errors
    }
  }

  /**
   * Tactical Waypoint / Objective Updated Blip
   */
  public playObjectiveUpdated() {
    if (this.isMuted || !this.tacticalAlertsEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(987.77, now + 0.09); // B5

      gain.gain.setValueAtTime(0.09 * this.volumeLevel, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // ignore
    }
  }

  /**
   * Subtle Tactical Sonar Ping
   */
  public playTacticalPing() {
    if (this.isMuted || !this.tacticalAlertsEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now); // C6
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.08); // G5

      gain.gain.setValueAtTime(0.07 * this.volumeLevel, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // ignore
    }
  }
}

export const sound = new AudioSynthesizer();
