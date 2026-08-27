import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Compass, 
  Car, 
  Sparkles, 
  RotateCcw, 
  MapPin, 
  Flag, 
  HelpCircle,
  Eye,
  Zap,
  Radio,
  Maximize2
} from 'lucide-react';
import { PlayerState, Mission, PlayerProgress, NavigationTab } from '../../types';
import { sound } from '../../services/audioService';
import { NPCDialogueModal } from './NPCDialogueModal';
import { RewardModal } from './RewardModal';
import { MobileControllerPad } from './MobileControllerPad';

interface PlayableCanvasGameProps {
  mission: Mission;
  setMission: React.Dispatch<React.SetStateAction<Mission>>;
  progress: PlayerProgress;
  setProgress: React.Dispatch<React.SetStateAction<PlayerProgress>>;
  setActiveTab: (tab: NavigationTab) => void;
}

// World coordinate constants
const WORLD_WIDTH = 1200;
const WORLD_HEIGHT = 800;

export const PlayableCanvasGame: React.FC<PlayableCanvasGameProps> = ({
  mission,
  setMission,
  progress,
  setProgress,
  setActiveTab
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Player physics state
  const playerRef = useRef({
    x: 240,
    y: 400,
    vx: 0,
    vy: 0,
    angle: 0,
    speed: 0,
    isSprinting: false,
    jumpHeight: 0,
    jumpVelocity: 0,
    isJumping: false,
    isDriving: false,
  });

  // Vehicle physics state
  const vehicleRef = useRef({
    x: 320,
    y: 350,
    angle: 0,
    speed: 0,
    maxSpeed: 7.5,
    accel: 0.18,
    friction: 0.94,
    steerAngle: 0,
  });

  // Node state
  const nodeRef = useRef({
    x: 920,
    y: 260,
    isPurified: false,
    isScanning: false,
    scanProgress: 0,
    hasSpawnedFragment: false,
    fragmentCollected: false,
  });

  // Key state map
  const keysRef = useRef<{ [key: string]: boolean }>({});

  // Mobile controller state
  const mobileInputRef = useRef({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  // UI state for React overlays
  const [playerState, setPlayerState] = useState<PlayerState>('Idle');
  const [coords, setCoords] = useState({ x: 240, y: 400 });
  const [speedKmh, setSpeedKmh] = useState(0);
  const [isDrivingUI, setIsDrivingUI] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [nearNPC, setNearNPC] = useState(false);
  const [nearVehicle, setNearVehicle] = useState(false);
  const [nearNode, setNearNode] = useState(false);
  const [scanPercent, setScanPercent] = useState(0);
  const [showControlsGuide, setShowControlsGuide] = useState(false);
  const [radarSweepAngle, setRadarSweepAngle] = useState(0);
  const [distanceToObjective, setDistanceToObjective] = useState(0);

  // Synchronize initial purified state from completed missions
  useEffect(() => {
    if (mission.status === 'Complete' || progress.missionsCompleted.includes('MISSION_001_REBUILDING_SIGNAL')) {
      nodeRef.current.isPurified = true;
      nodeRef.current.fragmentCollected = true;
    }
  }, [mission.status, progress.missionsCompleted]);

  // Objective coordinates helper
  const getActiveTarget = useCallback(() => {
    if (mission.status === 'Available') {
      return { x: 220, y: 380, label: 'Aria Pulse (Mission Guide)' };
    }
    if (mission.status === 'Active') {
      if (!nodeRef.current.isPurified || !nodeRef.current.fragmentCollected) {
        return { x: 920, y: 260, label: 'Sector 7 Corrupted Node #001' };
      }
      return { x: 220, y: 380, label: 'Onegodia Hub (Report to Aria Pulse)' };
    }
    return { x: 240, y: 400, label: 'Onegodia Hub Plaza' };
  }, [mission.status]);

  // Scan trigger
  const handleStartScanning = useCallback(() => {
    if (nodeRef.current.isPurified) return;
    nodeRef.current.isScanning = true;
  }, []);

  const handleStopScanning = useCallback(() => {
    nodeRef.current.isScanning = false;
  }, []);

  // Jump trigger
  const handleJump = useCallback(() => {
    const p = playerRef.current;
    if (!p.isJumping && !p.isDriving) {
      p.isJumping = true;
      p.jumpVelocity = 8;
      sound.playJump();
    }
  }, []);

  // Mount/Dismount vehicle
  const handleMountToggle = useCallback(() => {
    const p = playerRef.current;
    const v = vehicleRef.current;
    
    if (p.isDriving) {
      // Exit vehicle
      p.isDriving = false;
      p.x = v.x + Math.cos(v.angle + Math.PI / 2) * 35;
      p.y = v.y + Math.sin(v.angle + Math.PI / 2) * 35;
      setIsDrivingUI(false);
      sound.playClick();
    } else {
      // Check distance to vehicle
      const dist = Math.hypot(p.x - v.x, p.y - v.y);
      if (dist < 75) {
        p.isDriving = true;
        setIsDrivingUI(true);
        sound.playVehicleIgnition();
      }
    }
  }, []);

  // Reset/Unstuck
  const handleResetPosition = useCallback(() => {
    const p = playerRef.current;
    const v = vehicleRef.current;
    p.isDriving = false;
    p.x = 240;
    p.y = 400;
    p.vx = 0;
    p.vy = 0;
    v.x = 320;
    v.y = 350;
    v.speed = 0;
    setIsDrivingUI(false);
    sound.playWarp();
  }, []);

  // Warp to specific POI
  const handleWarp = useCallback((x: number, y: number, name: string) => {
    const p = playerRef.current;
    p.isDriving = false;
    p.x = x;
    p.y = y;
    p.vx = 0;
    p.vy = 0;
    setIsDrivingUI(false);
    sound.playWarp();
    setProgress(prev => ({ ...prev, lastWarpLocation: name }));
  }, [setProgress]);

  // Mission flow handlers
  const handleAcceptMission = () => {
    setMission(prev => ({
      ...prev,
      status: 'Active',
      currentObjectiveIndex: 1
    }));
    setProgress(prev => ({ ...prev, activeMissionId: 'MISSION_001_REBUILDING_SIGNAL' }));
    setDialogueOpen(false);
    sound.playRadarScan();
  };

  const handleCompleteMission = () => {
    setMission(prev => ({
      ...prev,
      status: 'Complete',
      currentObjectiveIndex: 5
    }));
    
    // Add reward to player progress
    setProgress(prev => {
      const hasItem = prev.inventory.some(i => i.name === 'Onegodia Data Fragment #001');
      const updatedInv = hasItem ? prev.inventory : [
        ...prev.inventory,
        {
          id: 'item-frag-001',
          name: 'Onegodia Data Fragment #001',
          type: 'Prototype Digital Collectible',
          rarity: 'Foundational' as const,
          status: 'Simulated / Off-chain',
          description: 'A crystallized holographic fragment containing the raw digital frequency needed to rebuild Sector 7 grid.',
          acquiredDate: 'Mission 001 Reward',
          iconName: 'Sparkles',
          metadata: {
            'Signal Stability': '100% Calibrated',
            'Sector': 'Sector 7 Outpost',
            'Verification': 'Aria Pulse Verified'
          }
        }
      ];

      return {
        ...prev,
        credits: prev.credits + 250,
        missionsCompleted: prev.missionsCompleted.includes('MISSION_001_REBUILDING_SIGNAL') 
          ? prev.missionsCompleted 
          : [...prev.missionsCompleted, 'MISSION_001_REBUILDING_SIGNAL'],
        collectedFragments: prev.collectedFragments.includes('FRAG_001')
          ? prev.collectedFragments
          : [...prev.collectedFragments, 'FRAG_001'],
        inventory: updatedInv,
        activeMissionId: null
      };
    });

    setDialogueOpen(false);
    setRewardOpen(true);
  };

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = true;
      keysRef.current[e.code] = true;

      // Single triggers
      if (key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleJump();
      }
      if (key === 'f') {
        e.preventDefault();
        handleMountToggle();
      }
      if (key === 'e') {
        e.preventDefault();
        const p = playerRef.current;
        const distNPC = Math.hypot(p.x - 220, p.y - 380);
        if (distNPC < 65) {
          sound.playClick();
          setDialogueOpen(true);
        } else {
          handleStartScanning();
        }
      }
      if (key === 'r') {
        handleResetPosition();
      }
      if (key === 'm') {
        setActiveTab('tactical-hud');
      }
      if (key === 'i') {
        setActiveTab('inventory');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = false;
      keysRef.current[e.code] = false;

      if (key === 'e') {
        handleStopScanning();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleJump, handleMountToggle, handleResetPosition, handleStartScanning, handleStopScanning, setActiveTab]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let civilianAngle = 0;
    let droneAngle = 0;
    let scanAudioTimer = 0;

    const gameLoop = () => {
      const keys = keysRef.current;
      const mInput = mobileInputRef.current;
      const p = playerRef.current;
      const v = vehicleRef.current;
      const n = nodeRef.current;

      // 1. Process Movement & Physics
      const isShift = keys['shift'] || keys['shiftleft'] || keys['shiftright'];
      p.isSprinting = isShift && !p.isDriving;

      const moveUp = keys['w'] || keys['arrowup'] || mInput.up;
      const moveDown = keys['s'] || keys['arrowdown'] || mInput.down;
      const moveLeft = keys['a'] || keys['arrowleft'] || mInput.left;
      const moveRight = keys['d'] || keys['arrowright'] || mInput.right;

      if (p.isDriving) {
        // Vehicle Physics Mode
        if (moveUp) {
          v.speed = Math.min(v.speed + v.accel, v.maxSpeed);
        } else if (moveDown) {
          v.speed = Math.max(v.speed - v.accel * 0.8, -v.maxSpeed * 0.4);
        } else {
          v.speed *= v.friction;
        }

        if (Math.abs(v.speed) > 0.1) {
          const steerFactor = v.speed > 0 ? 0.045 : -0.045;
          if (moveLeft) v.angle -= steerFactor;
          if (moveRight) v.angle += steerFactor;
        }

        v.x += Math.cos(v.angle) * v.speed;
        v.y += Math.sin(v.angle) * v.speed;

        // Vehicle boundaries
        v.x = Math.max(40, Math.min(WORLD_WIDTH - 40, v.x));
        v.y = Math.max(40, Math.min(WORLD_HEIGHT - 40, v.y));

        p.x = v.x;
        p.y = v.y;
        p.angle = v.angle;

        const kmh = Math.round(Math.abs(v.speed) * 14.5);
        setSpeedKmh(kmh);
        setPlayerState(kmh > 2 ? 'Driving' : 'Idle');

      } else {
        // Player on foot physics
        const baseSpeed = p.isSprinting ? 4.2 : 2.5;
        let dx = 0;
        let dy = 0;

        if (moveUp) dy -= 1;
        if (moveDown) dy += 1;
        if (moveLeft) dx -= 1;
        if (moveRight) dx += 1;

        if (dx !== 0 && dy !== 0) {
          dx *= 0.7071;
          dy *= 0.7071;
        }

        p.vx = dx * baseSpeed;
        p.vy = dy * baseSpeed;

        p.x += p.vx;
        p.y += p.vy;

        if (dx !== 0 || dy !== 0) {
          p.angle = Math.atan2(dy, dx);
        }

        // Jump physics arc
        if (p.isJumping) {
          p.jumpHeight += p.jumpVelocity;
          p.jumpVelocity -= 0.6; // gravity
          if (p.jumpHeight <= 0) {
            p.jumpHeight = 0;
            p.jumpVelocity = 0;
            p.isJumping = false;
          }
        }

        // Boundaries
        p.x = Math.max(30, Math.min(WORLD_WIDTH - 30, p.x));
        p.y = Math.max(30, Math.min(WORLD_HEIGHT - 30, p.y));

        const moving = Math.hypot(p.vx, p.vy) > 0.1;
        const kmh = moving ? (p.isSprinting ? 22 : 11) : 0;
        setSpeedKmh(kmh);

        if (p.isJumping) {
          setPlayerState('Jumping');
        } else if (n.isScanning) {
          setPlayerState('Interacting');
        } else if (p.isSprinting && moving) {
          setPlayerState('Running');
        } else if (moving) {
          setPlayerState('Walking');
        } else if (mission.status === 'Complete') {
          setPlayerState('Mission Complete');
        } else if (mission.status === 'Active') {
          setPlayerState('Mission Active');
        } else {
          setPlayerState('Idle');
        }
      }

      // 2. Proximity checks
      const distNPC = Math.hypot(p.x - 220, p.y - 380);
      const distVeh = Math.hypot(p.x - v.x, p.y - v.y);
      const distNode = Math.hypot(p.x - n.x, p.y - n.y);

      setNearNPC(distNPC < 65);
      setNearVehicle(!p.isDriving && distVeh < 75);
      setNearNode(distNode < 90);

      // 3. Node Scanning Process
      if (n.isScanning && distNode < 95 && !n.isPurified) {
        n.scanProgress = Math.min(100, n.scanProgress + 0.8);
        setScanPercent(Math.round(n.scanProgress));

        scanAudioTimer++;
        if (scanAudioTimer % 12 === 0) {
          sound.playNodeScanBeep(n.scanProgress / 100);
        }

        if (n.scanProgress >= 100) {
          n.isPurified = true;
          n.isScanning = false;
          n.hasSpawnedFragment = true;
          sound.playFragmentCollected();
          // Update mission objective 3 & 4
          setMission(prev => ({
            ...prev,
            objectives: prev.objectives.map((obj, i) => 
              i === 2 || i === 3 ? { ...obj, isCompleted: true } : obj
            ),
            currentObjectiveIndex: 4
          }));
        }
      } else if (!n.isScanning && !n.isPurified && n.scanProgress > 0) {
        n.scanProgress = Math.max(0, n.scanProgress - 0.4);
        setScanPercent(Math.round(n.scanProgress));
      }

      // Auto collect fragment when close
      if (n.hasSpawnedFragment && !n.fragmentCollected && distNode < 70) {
        n.fragmentCollected = true;
        sound.playFragmentCollected();
      }

      // Update telemetry
      setCoords({ x: Math.round(p.x), y: Math.round(p.y) });

      // Calculate distance to active target
      const activeTgt = getActiveTarget();
      const distTargetMeters = Math.round(Math.hypot(p.x - activeTgt.x, p.y - activeTgt.y) * 0.45);
      setDistanceToObjective(distTargetMeters);

      // Radar rotation
      setRadarSweepAngle(prev => (prev + 0.04) % (Math.PI * 2));

      // 4. RENDERING CANVAS
      // Clear screen
      ctx.fillStyle = '#050811';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // World Grid & Cyber Pavement
      ctx.save();
      ctx.strokeStyle = '#0e2238';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Neon Transit Highway (Hub to Sector 7 Outpost)
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 44;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(240, 400);
      ctx.lineTo(550, 400);
      ctx.lineTo(750, 260);
      ctx.lineTo(920, 260);
      ctx.stroke();

      // Highway surface fill
      ctx.strokeStyle = '#091524';
      ctx.lineWidth = 36;
      ctx.stroke();

      // Highway dashed centerline
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash

      // Zone 1: Onegodia Hub Plaza
      ctx.beginPath();
      ctx.arc(240, 400, 110, 0, Math.PI * 2);
      ctx.fillStyle = '#061727';
      ctx.fill();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Hub Outer Pulsing Ring
      ctx.beginPath();
      ctx.arc(240, 400, 125, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Hub Central Monument / Telemetry Tower
      ctx.beginPath();
      ctx.arc(240, 400, 24, 0, Math.PI * 2);
      ctx.fillStyle = '#083344';
      ctx.fill();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Holographic Hub Glyph
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Ω', 240, 400);

      // Hub Zone Text
      ctx.font = '10px monospace';
      ctx.fillStyle = '#67e8f9';
      ctx.fillText('ONEGODIA HUB PLAZA', 240, 310);

      // Vehicle Bay / Garage Area
      ctx.fillStyle = '#0a192f';
      ctx.strokeStyle = '#0d9488';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(300, 310, 80, 70);
      ctx.fillRect(300, 310, 80, 70);
      ctx.fillStyle = '#2dd4bf';
      ctx.font = '9px monospace';
      ctx.fillText('VEHICLE BAY', 340, 325);

      // Zone 2: Sector 7 Outpost Shrine
      ctx.beginPath();
      ctx.arc(920, 260, 85, 0, Math.PI * 2);
      ctx.fillStyle = n.isPurified ? '#042f2e' : '#2b0c15';
      ctx.fill();
      ctx.strokeStyle = n.isPurified ? '#14b8a6' : '#f43f5e';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = n.isPurified ? '#5eead4' : '#fb7185';
      ctx.fillText('SECTOR 7 DIGITAL NODE', 920, 195);

      // Draw Corrupted/Purified Digital Node #001
      const pulseTime = Date.now() * 0.003;
      const nodeOffset = Math.sin(pulseTime) * 6;

      ctx.save();
      ctx.translate(n.x, n.y + nodeOffset);
      
      // Node Outer Shield Ring
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.strokeStyle = n.isPurified ? '#2dd4bf' : '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Node Inner Diamond / Cube
      ctx.rotate(pulseTime);
      ctx.fillStyle = n.isPurified ? '#14b8a6' : '#e11d48';
      ctx.fillRect(-12, -12, 24, 24);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(-12, -12, 24, 24);
      ctx.restore();

      // Scanning Progress Ring on Node
      if (n.isScanning && !n.isPurified) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 45, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (n.scanProgress / 100)));
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`${Math.round(n.scanProgress)}%`, n.x, n.y - 50);
      }

      // Draw Collectible Fragment if spawned and not collected
      if (n.hasSpawnedFragment && !n.fragmentCollected) {
        const fragPulse = Math.sin(Date.now() * 0.006) * 4;
        ctx.save();
        ctx.translate(n.x + 25, n.y + 15 + fragPulse);
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('◈', 0, 0);

        ctx.fillStyle = '#fef08a';
        ctx.font = '9px monospace';
        ctx.fillText('Fragment #001', 0, 20);
        ctx.restore();
      }

      // Draw Roaming Civilian NPC (Citizen CX-42)
      civilianAngle += 0.01;
      const civX = 360 + Math.cos(civilianAngle) * 50;
      const civY = 480 + Math.sin(civilianAngle) * 30;
      ctx.beginPath();
      ctx.arc(civX, civY, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#475569';
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '8px monospace';
      ctx.fillText('Citizen CX-42', civX, civY - 14);

      // Draw Security Drone (Sentinel OS-9) orbiting Outpost
      droneAngle += 0.02;
      const droneX = 920 + Math.cos(droneAngle) * 60;
      const droneY = 260 + Math.sin(droneAngle) * 45;
      ctx.beginPath();
      ctx.arc(droneX, droneY, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#0369a1';
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = '8px monospace';
      ctx.fillText('Sentinel OS-9', droneX, droneY - 12);

      // Draw Mission Guide NPC (Aria Pulse)
      const npcX = 220;
      const npcY = 380;
      ctx.beginPath();
      ctx.arc(npcX, npcY, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#0e7490';
      ctx.fill();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Aria Pulse Visor
      ctx.fillStyle = '#a5f3fc';
      ctx.fillRect(npcX - 6, npcY - 3, 12, 4);

      // NPC Floating Name & Status Badge
      ctx.fillStyle = '#22d3ee';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('Aria Pulse [NPC]', npcX, npcY - 24);

      if (mission.status === 'Available' || (mission.status === 'Active' && n.fragmentCollected)) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 13px monospace';
        ctx.fillText('!', npcX, npcY - 38);
      }

      // Draw Parked / Moving Vehicle (Cyber-Cruiser)
      ctx.save();
      ctx.translate(v.x, v.y);
      ctx.rotate(v.angle);

      // Vehicle Chassis
      ctx.fillStyle = '#0f2b3e';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-22, -12, 44, 24, 6);
      ctx.fill();
      ctx.stroke();

      // Vehicle Cockpit / Windshield
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-6, -8, 16, 16);

      // Vehicle Headlight Beams
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.beginPath();
      ctx.moveTo(22, -8);
      ctx.lineTo(80, -22);
      ctx.lineTo(80, 22);
      ctx.lineTo(22, 8);
      ctx.closePath();
      ctx.fill();

      // Vehicle Tail Lights
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-22, -9, 3, 4);
      ctx.fillRect(-22, 5, 3, 4);

      ctx.restore();

      // Draw Player Character (if not driving)
      if (!p.isDriving) {
        ctx.save();
        
        // Jump Shadow
        const shadowScale = Math.max(0.4, 1 - p.jumpHeight / 50);
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + 6, 11 * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fill();

        // Player Body with Jump Height Elevation
        ctx.translate(p.x, p.y - p.jumpHeight);
        ctx.rotate(p.angle);

        // Body Circle
        ctx.beginPath();
        ctx.arc(0, 0, 11, 0, Math.PI * 2);
        ctx.fillStyle = '#0369a1';
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Glowing Visor
        ctx.fillStyle = '#67e8f9';
        ctx.fillRect(2, -4, 6, 8);

        ctx.restore();
      }

      // Draw Interactive Guidance Waypoint Beam towards active target
      const target = getActiveTarget();
      const angleToTarget = Math.atan2(target.y - p.y, target.x - p.x);
      
      // Floating compass waypoint arrow around player
      ctx.save();
      ctx.translate(p.x, p.y - (p.isDriving ? 0 : p.jumpHeight));
      ctx.rotate(angleToTarget);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(35, 0);
      ctx.lineTo(24, -6);
      ctx.lineTo(26, 0);
      ctx.lineTo(24, 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.restore();

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [getActiveTarget, mission.status, setMission]);

  return (
    <div className="flex flex-col gap-3 font-sans max-w-7xl mx-auto">
      
      {/* Top Status & Controls Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 bg-[#0c0e14] border border-[#1e2230] rounded-lg font-mono text-xs text-slate-300">
        
        {/* Left: Active Mission Tracker */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            <span className="text-blue-400 font-bold text-[11px]">MISSION TRACKER:</span>
            <span className="text-slate-100 font-semibold text-[11px] font-sans">{mission.title}</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] ${
              mission.status === 'Complete' 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                : 'bg-amber-950 text-amber-300 border border-amber-500/50'
            }`}>
              {mission.status}
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 text-[10px]">
            <Flag className="w-3 h-3 text-blue-400" />
            <span>Target: {getActiveTarget().label} ({distanceToObjective}m)</span>
          </div>
        </div>

        {/* Right: Quick Actions & Help */}
        <div className="flex items-center gap-1.5">
          <button
            id="controls-guide-toggle-btn"
            onClick={() => {
              sound.playClick();
              setShowControlsGuide(!showControlsGuide);
            }}
            className="px-2 py-1 bg-[#11131a] hover:bg-[#161821] text-slate-300 rounded border border-[#1e2230] flex items-center gap-1 text-[11px]"
          >
            <HelpCircle className="w-3 h-3 text-blue-400" />
            <span>Keybinds</span>
          </button>

          <button
            id="tactical-hud-direct-btn"
            onClick={() => {
              sound.playClick();
              setActiveTab('tactical-hud');
            }}
            className="px-2 py-1 bg-blue-950 hover:bg-blue-900 text-blue-300 rounded border border-blue-700/60 flex items-center gap-1 text-[11px]"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Full Tactical HUD</span>
          </button>
        </div>
      </div>

      {/* Expandable Keybinds Card */}
      {showControlsGuide && (
        <div className="p-3 bg-[#0c0e14] border border-[#1e2230] rounded-lg font-mono text-[11px] grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-300 animate-fadeIn">
          <div><strong className="text-blue-400">WASD / Arrows:</strong> Move / Steer</div>
          <div><strong className="text-blue-400">Shift:</strong> Sprint (1.8x)</div>
          <div><strong className="text-blue-400">Space:</strong> Jump Matrix</div>
          <div><strong className="text-blue-400">F:</strong> Mount / Dismount</div>
          <div><strong className="text-blue-400">E (Hold):</strong> Talk / Scan Node</div>
          <div><strong className="text-blue-400">R:</strong> Reset to Hub</div>
          <div><strong className="text-blue-400">M:</strong> Tactical Map</div>
          <div><strong className="text-blue-400">I:</strong> Inventory Locker</div>
        </div>
      )}

      {/* Central Canvas Viewport Area */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[580px] bg-[#050608] rounded-xl border border-[#1e2230] shadow-2xl overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          width={WORLD_WIDTH}
          height={WORLD_HEIGHT}
          className="w-full h-full object-cover block"
        />

        {/* Live Tactical HUD Overlay (Top-Left) */}
        <div className="absolute top-2.5 left-2.5 bg-[#0c0e14]/90 border border-[#1e2230] p-2 rounded-lg font-mono text-[10px] text-slate-300 backdrop-blur-md space-y-0.5 shadow-lg pointer-events-none">
          <div className="flex items-center gap-1.5 text-blue-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
            <span>SECTOR 7 TELEMETRY</span>
          </div>
          <div className="flex items-center gap-2.5 text-slate-400">
            <span>POS: <strong className="text-slate-100">X:{coords.x} Y:{coords.y}</strong></span>
            <span>SPD: <strong className="text-blue-300">{speedKmh} km/h</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">STATE:</span>
            <span className="px-1 py-0.2 rounded bg-blue-950 border border-blue-700/60 text-blue-300 font-semibold">
              {playerState}
            </span>
          </div>
        </div>

        {/* Radar Minimap (Top-Right) */}
        <div className="absolute top-2.5 right-2.5 bg-[#0c0e14]/90 border border-[#1e2230] p-1.5 rounded-lg backdrop-blur-md shadow-lg flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-full bg-[#050608] border border-[#1e2230] overflow-hidden flex items-center justify-center">
            
            {/* Grid Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#1e2230]"></div>
            <div className="absolute inset-y-0 left-1/2 w-px bg-[#1e2230]"></div>
            
            {/* Concentric radar rings */}
            <div className="absolute w-14 h-14 rounded-full border border-blue-900/40"></div>
            <div className="absolute w-7 h-7 rounded-full border border-blue-900/40"></div>

            {/* Sweep Line */}
            <div 
              className="absolute inset-0 origin-center pointer-events-none"
              style={{
                transform: `rotate(${radarSweepAngle}rad)`,
                background: 'conic-gradient(from 0deg, rgba(37, 99, 235, 0.35) 0deg, transparent 45deg)'
              }}
            ></div>

            {/* Minimap Blips */}
            {/* Hub Blip */}
            <div 
              className="absolute w-1.5 h-1.5 rounded-full bg-blue-400"
              style={{
                left: `${(240 / WORLD_WIDTH) * 100}%`,
                top: `${(400 / WORLD_HEIGHT) * 100}%`,
              }}
              title="Onegodia Hub"
            ></div>

            {/* Node Blip (Objective Marker) */}
            <div 
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(920 / WORLD_WIDTH) * 100}%`,
                top: `${(260 / WORLD_HEIGHT) * 100}%`,
              }}
              title="Digital Node #001"
            >
              {!nodeRef.current.isPurified && (
                <div className="absolute -inset-1 rounded-full border border-rose-400 animate-tactical-marker-ring"></div>
              )}
              <div 
                className={`w-1.5 h-1.5 rounded-full ${
                  nodeRef.current.isPurified 
                    ? 'bg-teal-400' 
                    : 'bg-rose-500 animate-tactical-pulse shadow-sm shadow-rose-500'
                }`}
              ></div>
            </div>

            {/* Player Blip */}
            <div 
              className="absolute w-2 h-2 rounded-full bg-amber-400 border border-white shadow-sm"
              style={{
                left: `${(coords.x / WORLD_WIDTH) * 100}%`,
                top: `${(coords.y / WORLD_HEIGHT) * 100}%`,
              }}
            ></div>

          </div>
          <span className="text-[8px] font-mono text-blue-400 mt-0.5 uppercase tracking-wider">
            RADAR ACTIVE
          </span>
        </div>

        {/* Proximity Interaction Banners (Bottom Center of Canvas) */}
        <div className="absolute bottom-3 inset-x-3 flex justify-center pointer-events-auto">
          {nearNPC && (
            <button
              id="talk-npc-banner-btn"
              onClick={() => {
                sound.playClick();
                setDialogueOpen(true);
              }}
              className="px-3.5 py-2 bg-[#0c0e14] border border-blue-500 text-blue-200 rounded-lg shadow-xl font-mono text-xs font-bold flex items-center gap-2 animate-bounce"
            >
              <Radio className="w-3.5 h-3.5 text-blue-400" />
              <span>Press [E] or Click to Speak with Aria Pulse</span>
            </button>
          )}

          {nearVehicle && !isDrivingUI && (
            <button
              id="enter-vehicle-banner-btn"
              onClick={handleMountToggle}
              className="px-3.5 py-2 bg-[#0c0e14] border border-cyan-500 text-cyan-200 rounded-lg shadow-xl font-mono text-xs font-bold flex items-center gap-2 animate-pulse"
            >
              <Car className="w-3.5 h-3.5 text-cyan-400" />
              <span>Press [F] or Click to Drive Cyber-Cruiser</span>
            </button>
          )}

          {isDrivingUI && (
            <button
              id="exit-vehicle-banner-btn"
              onClick={handleMountToggle}
              className="px-3.5 py-1.5 bg-amber-950 border border-amber-500 text-amber-200 rounded-lg shadow-lg font-mono text-xs font-bold flex items-center gap-1.5"
            >
              <Car className="w-3.5 h-3.5 text-amber-400" />
              <span>Press [F] to Exit Vehicle</span>
            </button>
          )}

          {nearNode && !nodeRef.current.isPurified && (
            <div className="p-2.5 bg-[#0c0e14]/95 border border-rose-500/60 rounded-lg font-mono text-xs text-rose-300 flex flex-col items-center gap-1 shadow-xl">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                <span className="font-bold">Corrupted Digital Node #001 Detected!</span>
              </div>
              <div className="text-[10px] text-slate-300">
                Hold <strong className="text-blue-400">[E]</strong> or tap Scan on controller ({scanPercent}%)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Virtual Controller & POI Fast Travel Bar */}
      <div className="space-y-2.5">
        {/* POI Warp Bar for Rapid Testing */}
        <div className="p-2.5 bg-[#0c0e14] border border-[#1e2230] rounded-lg flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
            <MapPin className="w-3 h-3 text-blue-400" />
            <span>Prototype Fast-Travel:</span>
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              id="warp-hub-btn"
              onClick={() => handleWarp(240, 400, 'Onegodia Hub')}
              className="px-2 py-0.5 bg-[#11131a] hover:bg-blue-950/40 hover:text-blue-300 text-slate-300 rounded border border-[#1e2230] text-[11px] transition-colors"
            >
              Onegodia Hub Plaza
            </button>
            <button
              id="warp-garage-btn"
              onClick={() => handleWarp(340, 350, 'Vehicle Bay')}
              className="px-2 py-0.5 bg-[#11131a] hover:bg-cyan-950/40 hover:text-cyan-300 text-slate-300 rounded border border-[#1e2230] text-[11px] transition-colors"
            >
              Vehicle Bay / Cyber-Cruiser
            </button>
            <button
              id="warp-node-btn"
              onClick={() => handleWarp(870, 260, 'Sector 7 Outpost')}
              className="px-2 py-0.5 bg-[#11131a] hover:bg-rose-950/40 hover:text-rose-300 text-slate-300 rounded border border-[#1e2230] text-[11px] transition-colors"
            >
              Sector 7 Digital Node #001
            </button>
          </div>
        </div>

        {/* Mobile On-Screen Controller */}
        <MobileControllerPad
          onDirectionPress={(dir, pressed) => {
            mobileInputRef.current[dir] = pressed;
          }}
          onJumpPress={handleJump}
          onMountPress={handleMountToggle}
          onInteractPress={() => {
            if (nearNPC) {
              sound.playClick();
              setDialogueOpen(true);
            } else if (nearNode) {
              handleStartScanning();
            } else if (nearVehicle) {
              handleMountToggle();
            }
          }}
          onResetPress={handleResetPosition}
          onToggleMap={() => setActiveTab('tactical-hud')}
          onToggleInventory={() => setActiveTab('inventory')}
          isDriving={isDrivingUI}
          playerState={playerState}
          nearNPC={nearNPC}
          nearVehicle={nearVehicle}
          nearNode={nearNode}
        />
      </div>

      {/* NPC Dialogue Modal */}
      <NPCDialogueModal
        isOpen={dialogueOpen}
        onClose={() => setDialogueOpen(false)}
        mission={mission}
        onAcceptMission={handleAcceptMission}
        onCompleteMission={handleCompleteMission}
        hasFragment={nodeRef.current.fragmentCollected}
      />

      {/* Mission Reward Celebration Modal */}
      <RewardModal
        isOpen={rewardOpen}
        onClose={() => setRewardOpen(false)}
        creditsEarned={mission.rewardCredits}
        itemName={mission.rewardItem}
        itemRarity={mission.rewardItemRarity}
        setActiveTab={setActiveTab}
      />
    </div>
  );
};
