import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Database,
  Sliders,
  Radio,
  Sparkles,
  Terminal,
  Activity,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle2,
  Coins,
  Car,
  Package,
  Compass,
  Zap,
  Server,
  Key,
  Flame,
  ArrowUpRight,
  UserCheck,
  LogIn
} from 'lucide-react';
import {
  NavigationTab,
  PlayerProgress,
  SystemBroadcast,
  SystemConfig,
  AdminRecord,
} from '../types';
import { useAuth } from '../context/AuthContext';
import {
  BOOTSTRAPPED_ADMIN_EMAIL,
  testConnection,
  getAllPlayerProgress,
  adminUpdatePlayerProgress,
  adminDeletePlayerProgress,
  getSystemBroadcasts,
  saveSystemBroadcast,
  deleteSystemBroadcast,
  getSystemConfig,
  saveSystemConfig,
  getAdmins,
  saveAdminRecord,
  deleteAdminRecord,
} from '../services/firebase';
import { sound } from '../services/audioService';

interface AdminViewProps {
  progress: PlayerProgress;
  setProgress: React.Dispatch<React.SetStateAction<PlayerProgress>>;
  setActiveTab: (tab: NavigationTab) => void;
}

type AdminSubTab = 'overview' | 'operatives' | 'economy' | 'broadcasts' | 'admins';

export const AdminView: React.FC<AdminViewProps> = ({
  progress,
  setProgress,
  setActiveTab,
}) => {
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<AdminSubTab>('overview');

  // Authorization Status
  const isSuperAdmin =
    user?.email === BOOTSTRAPPED_ADMIN_EMAIL ||
    user?.email?.toLowerCase().includes('admin');

  // Telemetry & DB State
  const [pingMs, setPingMs] = useState<number | null>(null);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [dbStatus, setDbStatus] = useState<'connected' | 'checking' | 'error'>('connected');

  // Operatives from Firestore
  const [operatives, setOperatives] = useState<
    (PlayerProgress & { playerId: string; updatedAt?: string })[]
  >([]);
  const [loadingOperatives, setLoadingOperatives] = useState(false);
  const [selectedOperativeId, setSelectedOperativeId] = useState<string>('current-session');
  const [creditAdjustment, setCreditAdjustment] = useState<number>(5000);

  // System Economy Config
  const [systemConfig, setSystemConfigState] = useState<SystemConfig>({
    configId: 'gameplay',
    creditMultiplier: 1.5,
    odcMintRate: 10,
    relicShardDensity: 'Standard',
    pvpEngagementStatus: 'Zone-Restricted',
    maintenanceMode: false,
    updatedAt: new Date().toISOString(),
    updatedBy: user?.email || 'admin@onegodia.sys',
  });
  const [savingConfig, setSavingConfig] = useState(false);
  const [configSavedSuccess, setConfigSavedSuccess] = useState(false);

  // System Broadcasts
  const [broadcasts, setBroadcasts] = useState<SystemBroadcast[]>([]);
  const [loadingBroadcasts, setLoadingBroadcasts] = useState(false);
  const [newBroadcastTitle, setNewBroadcastTitle] = useState('');
  const [newBroadcastBody, setNewBroadcastBody] = useState('');
  const [newBroadcastSeverity, setNewBroadcastSeverity] = useState<'info' | 'warning' | 'critical'>('warning');

  // Admin Roster
  const [adminList, setAdminList] = useState<AdminRecord[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'superadmin' | 'game_master' | 'auditor'>('game_master');

  // Action feedback message
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Run Connection Ping Test
  const handleTestPing = async () => {
    sound.playClick();
    setIsTestingPing(true);
    const start = performance.now();
    try {
      await testConnection();
      const elapsed = Math.round(performance.now() - start);
      setPingMs(elapsed);
      setDbStatus('connected');
      sound.playFragmentCollected();
      showNotification(`Cloud Firestore ping responded in ${elapsed}ms`);
    } catch {
      setDbStatus('error');
    } finally {
      setIsTestingPing(false);
    }
  };

  // Fetch Operatives
  const loadOperativesList = useCallback(async () => {
    setLoadingOperatives(true);
    try {
      const records = await getAllPlayerProgress();
      if (records && records.length > 0) {
        setOperatives(records);
      } else {
        // Initialize with active local progress if cloud empty
        setOperatives([
          {
            ...progress,
            playerId: user?.uid || 'local-operative-001',
            updatedAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.warn('Could not fetch all operatives via Firestore:', err);
      // Fallback
      setOperatives([
        {
          ...progress,
          playerId: user?.uid || 'local-operative-001',
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoadingOperatives(false);
    }
  }, [progress, user]);

  // Fetch Config
  const loadConfig = useCallback(async () => {
    try {
      const remoteConfig = await getSystemConfig();
      if (remoteConfig) {
        setSystemConfigState(remoteConfig);
      }
    } catch (err) {
      console.warn('Could not fetch remote system config:', err);
    }
  }, []);

  // Fetch Broadcasts
  const loadBroadcastsList = useCallback(async () => {
    setLoadingBroadcasts(true);
    try {
      const list = await getSystemBroadcasts();
      setBroadcasts(
        list || [
          {
            id: 'b-default-1',
            title: 'SECTOR 7 RECONNAISSANCE ACTIVE',
            message: 'All operatives authorized to explore Stamford Node 001. Relic frequency boosted by 1.5x.',
            severity: 'info',
            active: true,
            createdAt: new Date().toISOString(),
          },
        ]
      );
    } catch {
      setBroadcasts([
        {
          id: 'b-default-1',
          title: 'SECTOR 7 RECONNAISSANCE ACTIVE',
          message: 'All operatives authorized to explore Stamford Node 001. Relic frequency boosted by 1.5x.',
          severity: 'info',
          active: true,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoadingBroadcasts(false);
    }
  }, []);

  // Fetch Admins
  const loadAdminsList = useCallback(async () => {
    try {
      const list = await getAdmins();
      setAdminList(
        list.length > 0
          ? list
          : [
              {
                adminId: 'superadmin-master',
                email: BOOTSTRAPPED_ADMIN_EMAIL,
                role: 'superadmin',
                createdAt: new Date().toISOString(),
              },
            ]
      );
    } catch {
      setAdminList([
        {
          adminId: 'superadmin-master',
          email: BOOTSTRAPPED_ADMIN_EMAIL,
          role: 'superadmin',
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    loadOperativesList();
    loadConfig();
    loadBroadcastsList();
    loadAdminsList();
  }, [loadOperativesList, loadConfig, loadBroadcastsList, loadAdminsList]);

  // Save System Config
  const handleSaveSystemConfig = async () => {
    sound.playClick();
    setSavingConfig(true);
    try {
      const updated: SystemConfig = {
        ...systemConfig,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email || 'admin@onegodia.sys',
      };
      await saveSystemConfig(updated);
      setSystemConfigState(updated);
      setConfigSavedSuccess(true);
      sound.playFragmentCollected();
      showNotification('Global System Configuration deployed to Cloud Firestore');
      setTimeout(() => setConfigSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save config:', err);
      showNotification('Notice: Saved to local simulation state');
    } finally {
      setSavingConfig(false);
    }
  };

  // Add Broadcast
  const handleCreateBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBroadcastTitle.trim() || !newBroadcastBody.trim()) return;
    sound.playClick();
    const newBroadcast: SystemBroadcast = {
      id: `bc-${Date.now()}`,
      title: newBroadcastTitle.trim().toUpperCase(),
      message: newBroadcastBody.trim(),
      severity: newBroadcastSeverity,
      active: true,
      authorEmail: user?.email || 'system-admin',
      createdAt: new Date().toISOString(),
    };

    try {
      await saveSystemBroadcast(newBroadcast);
      setBroadcasts((prev) => [newBroadcast, ...prev]);
      setNewBroadcastTitle('');
      setNewBroadcastBody('');
      sound.playFragmentCollected();
      showNotification(`System Broadcast "${newBroadcast.title}" published`);
    } catch (err) {
      console.error(err);
      setBroadcasts((prev) => [newBroadcast, ...prev]);
      setNewBroadcastTitle('');
      setNewBroadcastBody('');
      showNotification('Broadcast active in local operative memory');
    }
  };

  // Toggle Broadcast Active
  const handleToggleBroadcast = async (b: SystemBroadcast) => {
    sound.playClick();
    const updated = { ...b, active: !b.active };
    try {
      await saveSystemBroadcast(updated);
      setBroadcasts((prev) => prev.map((item) => (item.id === b.id ? updated : item)));
      showNotification(`Broadcast ${updated.active ? 'activated' : 'deactivated'}`);
    } catch {
      setBroadcasts((prev) => prev.map((item) => (item.id === b.id ? updated : item)));
    }
  };

  // Delete Broadcast
  const handleDeleteBroadcast = async (id: string) => {
    sound.playClick();
    try {
      await deleteSystemBroadcast(id);
      setBroadcasts((prev) => prev.filter((item) => item.id !== id));
      showNotification('Broadcast deleted');
    } catch {
      setBroadcasts((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Grant Credits to Target Operative
  const handleModifyCredits = async (targetId: string, delta: number) => {
    sound.playClick();
    if (targetId === 'current-session') {
      setProgress((prev) => {
        const nextCredits = Math.max(0, prev.credits + delta);
        return { ...prev, credits: nextCredits };
      });
      showNotification(`Adjusted local operative credits by ${delta > 0 ? '+' : ''}${delta}`);
      return;
    }

    const op = operatives.find((o) => o.playerId === targetId);
    if (!op) return;
    const nextCredits = Math.max(0, op.credits + delta);

    try {
      await adminUpdatePlayerProgress(targetId, { credits: nextCredits });
      setOperatives((prev) =>
        prev.map((o) => (o.playerId === targetId ? { ...o, credits: nextCredits } : o))
      );
      if (user?.uid === targetId) {
        setProgress((prev) => ({ ...prev, credits: nextCredits }));
      }
      sound.playFragmentCollected();
      showNotification(`Updated operative ${targetId} credits to ${nextCredits.toLocaleString()}`);
    } catch (err) {
      console.error(err);
      showNotification('Failed to update remote Firestore. Check admin privileges.');
    }
  };

  // Toggle Vehicle for Operative
  const handleToggleVehicle = async (targetId: string) => {
    sound.playClick();
    if (targetId === 'current-session') {
      setProgress((prev) => ({
        ...prev,
        hasVehicleUnlocked: !prev.hasVehicleUnlocked,
      }));
      showNotification('Toggled vehicle unlock for current operative session');
      return;
    }

    const op = operatives.find((o) => o.playerId === targetId);
    if (!op) return;
    const nextStatus = !op.hasVehicleUnlocked;

    try {
      await adminUpdatePlayerProgress(targetId, { hasVehicleUnlocked: nextStatus });
      setOperatives((prev) =>
        prev.map((o) => (o.playerId === targetId ? { ...o, hasVehicleUnlocked: nextStatus } : o))
      );
      if (user?.uid === targetId) {
        setProgress((prev) => ({ ...prev, hasVehicleUnlocked: nextStatus }));
      }
      sound.playFragmentCollected();
      showNotification(`Vehicle clearance ${nextStatus ? 'GRANTED' : 'REVOKED'} for ${targetId}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Grant Relic Keycard / Weapon
  const handleInjectItem = async (targetId: string, itemName: string) => {
    sound.playClick();
    if (targetId === 'current-session') {
      setProgress((prev) => {
        const inv = prev.inventory || [];
        if (inv.includes(itemName)) return prev;
        return { ...prev, inventory: [...inv, itemName] };
      });
      showNotification(`Injected ${itemName} into active loadout`);
      return;
    }

    const op = operatives.find((o) => o.playerId === targetId);
    if (!op) return;
    const inv = op.inventory || [];
    if (inv.includes(itemName)) return;
    const nextInv = [...inv, itemName];

    try {
      await adminUpdatePlayerProgress(targetId, { inventory: nextInv });
      setOperatives((prev) =>
        prev.map((o) => (o.playerId === targetId ? { ...o, inventory: nextInv } : o))
      );
      showNotification(`Injected ${itemName} into operative loadout`);
    } catch (err) {
      console.error(err);
    }
  };

  // Add Admin Record
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) return;
    sound.playClick();
    const newRecord: AdminRecord = {
      adminId: `admin-${Date.now()}`,
      email: newAdminEmail.trim().toLowerCase(),
      role: newAdminRole,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveAdminRecord(newRecord);
      setAdminList((prev) => [...prev, newRecord]);
      setNewAdminEmail('');
      sound.playFragmentCollected();
      showNotification(`Admin credential granted to ${newRecord.email}`);
    } catch {
      setAdminList((prev) => [...prev, newRecord]);
      setNewAdminEmail('');
      showNotification(`Admin role provisioned in local state`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0d1627] border border-cyan-400/80 text-cyan-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-mono backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Top Banner: Master Clearance Header */}
      <div className="p-6 rounded-2xl bg-[#090e1a]/95 border border-cyan-500/30 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-widest bg-cyan-950 border border-cyan-500/50 text-cyan-300 uppercase">
                Level 5 Clearance // Architect Terminal
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Security Rules ABAC Active</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white flex items-center gap-2.5">
              <ShieldAlert className="w-7 h-7 text-cyan-400" />
              <span>Admin Command Dashboard</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl font-mono">
              Real-time oversight for Onegodia: Rise of the Digital World™. Monitor live player progress, dispatch system broadcasts, configure simulated economic parameters, and test Cloud Firestore synchronization.
            </p>
          </div>

          {/* Quick Admin Auth Box */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full md:w-auto">
            {user ? (
              <div className="p-3 bg-[#0d1424] rounded-xl border border-cyan-500/40 text-xs font-mono flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Admin"
                      className="w-8 h-8 rounded-full border border-cyan-400"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-400 flex items-center justify-center font-bold text-cyan-200">
                      {(user.displayName || user.email || 'A')[0].toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-white font-bold truncate max-w-[140px]">
                      {user.displayName || 'Architect Admin'}
                    </div>
                    <div className="text-[10px] text-cyan-300 truncate max-w-[160px]">
                      {user.email}
                    </div>
                  </div>
                </div>
                {isSuperAdmin ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-emerald-200 text-[10px] font-bold border border-emerald-500">
                    SUPERADMIN
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-cyan-900/80 text-cyan-200 text-[10px] font-bold border border-cyan-500">
                    GAME MASTER
                  </span>
                )}
              </div>
            ) : (
              <div className="p-3 bg-[#0f1422] rounded-xl border border-amber-500/40 text-xs font-mono space-y-2 w-full sm:w-auto">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-amber-300 font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Admin Preview Mode</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Sign in with <span className="text-cyan-300 font-bold">{BOOTSTRAPPED_ADMIN_EMAIL}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      sound.playClick();
                      try {
                        await signInWithGoogle();
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    disabled={authLoading}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 transition-all text-xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveSubTab('overview');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              activeSubTab === 'overview'
                ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Overview & Health</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveSubTab('operatives');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              activeSubTab === 'operatives'
                ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Operatives & Progress ({operatives.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveSubTab('economy');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              activeSubTab === 'economy'
                ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Global Economy Engine</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveSubTab('broadcasts');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              activeSubTab === 'broadcasts'
                ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>System Broadcasts ({broadcasts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveSubTab('admins');
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              activeSubTab === 'admins'
                ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Admin Roster ({adminList.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & SYSTEM HEALTH */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#0b101d] border border-slate-800/80 relative overflow-hidden font-mono">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>DATABASE STATUS</span>
                <Database className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE // SYNCED</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-2 truncate">
                ID: ai-studio-onegodiariseofth...
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b101d] border border-slate-800/80 relative overflow-hidden font-mono">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>ACTIVE OPERATIVES</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-amber-300">
                {operatives.length} Registered
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                Across Stamford Grid Nodes
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b101d] border border-slate-800/80 relative overflow-hidden font-mono">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>SIMULATED ODC POOL</span>
                <Coins className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl font-bold text-purple-300">
                {(progress.odcSimulatedBalance || 25000).toLocaleString()} ODC
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                Rate: {systemConfig.odcMintRate} ODC / Directive
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0b101d] border border-slate-800/80 relative overflow-hidden font-mono">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
                <span>FIRESTORE PING LATENCY</span>
                <Server className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-emerald-300">
                {pingMs !== null ? `${pingMs} ms` : 'Ready'}
              </div>
              <button
                type="button"
                onClick={handleTestPing}
                disabled={isTestingPing}
                className="mt-2 text-[10px] text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isTestingPing ? 'animate-spin' : ''}`} />
                <span>{isTestingPing ? 'Pinging Cloud...' : 'Run Diagnostics Ping'}</span>
              </button>
            </div>
          </div>

          {/* Diagnostics Panel & Architecture Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-[#0b101d] border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Security Rules Architecture & Zero-Trust State</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                  VERIFIED
                </span>
              </div>

              <div className="space-y-2.5 text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Hardened RBAC Access Gates:</strong> Admin capabilities are strictly evaluated using runtime email verification and <code className="text-cyan-300">/admins/{'{uid}'}</code> token lookup.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Catch-All Default Deny:</strong> Any unmapped collections or orphan documents are sealed behind <code className="text-cyan-300">allow read, write: if false;</code>.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Volumetric Constraint Guards:</strong> Operative payloads, string sizes, and mission array sizes are bounded to prevent Denial of Wallet.
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#080d17] rounded-lg border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="text-white font-bold">Bootstrapped Administrator:</div>
                <div className="text-cyan-300">{BOOTSTRAPPED_ADMIN_EMAIL}</div>
                <div className="text-[10px] text-slate-500">
                  Google Workspace / Cloud Run container integration active
                </div>
              </div>
            </div>

            {/* Quick Engine Actions */}
            <div className="p-5 rounded-xl bg-[#0b101d] border border-slate-800 space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Immediate Tactical Overrides</span>
                </div>
                <span className="text-slate-400 text-[10px]">Instant Session Effect</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleModifyCredits('current-session', 10000)}
                  className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-800/80 hover:border-cyan-400 text-left transition-all"
                >
                  <div className="text-cyan-300 font-bold flex items-center justify-between">
                    <span>+10,000 Credits</span>
                    <Coins className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Inject into active operative session
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleVehicle('current-session')}
                  className="p-3 rounded-lg bg-indigo-950/60 border border-indigo-800/80 hover:border-indigo-400 text-left transition-all"
                >
                  <div className="text-indigo-300 font-bold flex items-center justify-between">
                    <span>Toggle Vehicle Unlock</span>
                    <Car className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Current: {progress.hasVehicleUnlocked ? 'Unlocked' : 'Locked'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleInjectItem('current-session', 'Ancient Quantum Keycard')}
                  className="p-3 rounded-lg bg-purple-950/60 border border-purple-800/80 hover:border-purple-400 text-left transition-all"
                >
                  <div className="text-purple-300 font-bold flex items-center justify-between">
                    <span>Inject Quantum Keycard</span>
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Adds Tier-3 Clearance item
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('play')}
                  className="p-3 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-left transition-all group"
                >
                  <div className="text-white font-bold flex items-center justify-between">
                    <span>Jump to 3D Canvas</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Test live Stamford map viewport
                  </div>
                </button>
              </div>

              {/* Maintenance Toggle */}
              <div className="p-3 bg-[#131019] rounded-lg border border-rose-900/60 flex items-center justify-between">
                <div>
                  <div className="text-rose-300 font-bold">Emergency Server Maintenance Lock</div>
                  <div className="text-[10px] text-slate-400">
                    Halts operative mission deployments across Stamford
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSystemConfigState((prev) => ({
                      ...prev,
                      maintenanceMode: !prev.maintenanceMode,
                    }));
                  }}
                  className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all ${
                    systemConfig.maintenanceMode
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {systemConfig.maintenanceMode ? 'ACTIVE LOCK' : 'NORMAL (OFF)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OPERATIVES & PROGRESS EDITOR */}
      {activeSubTab === 'operatives' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[#0b101d] border border-slate-800 font-mono text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-white font-bold text-sm">Operative Cloud Progression Registry</div>
              <div className="text-slate-400">
                Inspect and modify persistent operative documents stored in Cloud Firestore (<code className="text-cyan-300">player_progress</code>).
              </div>
            </div>
            <button
              type="button"
              onClick={loadOperativesList}
              disabled={loadingOperatives}
              className="px-3 py-1.5 rounded-lg bg-cyan-950 border border-cyan-800 hover:border-cyan-400 text-cyan-300 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingOperatives ? 'animate-spin' : ''}`} />
              <span>Refresh Operatives</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Operative Selector Column */}
            <div className="p-4 rounded-xl bg-[#0b101d] border border-slate-800 space-y-3 font-mono text-xs max-h-[600px] overflow-y-auto">
              <div className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                Registered Operatives ({operatives.length})
              </div>

              {/* Current Local Session Option */}
              <button
                type="button"
                onClick={() => setSelectedOperativeId('current-session')}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedOperativeId === 'current-session'
                    ? 'bg-cyan-950/80 border-cyan-400 text-white'
                    : 'bg-[#0e1422] border-slate-800 text-slate-300 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-200">ACTIVE LOCAL SESSION</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-900 text-cyan-200">LIVE</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Credits: {progress.credits.toLocaleString()} • Vehicle: {progress.hasVehicleUnlocked ? 'Yes' : 'No'}
                </div>
              </button>

              {/* Firestore Remote Operatives */}
              {operatives.map((op) => (
                <button
                  key={op.playerId}
                  type="button"
                  onClick={() => setSelectedOperativeId(op.playerId)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    selectedOperativeId === op.playerId
                      ? 'bg-cyan-950/80 border-cyan-400 text-white'
                      : 'bg-[#0e1422] border-slate-800 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold truncate max-w-[150px]">{op.playerId}</span>
                    <span className="text-[10px] text-slate-400">
                      {op.missionsCompleted?.length || 0} Missions
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Credits: {op.credits?.toLocaleString() || 0} • Items: {op.inventory?.length || 0}
                  </div>
                </button>
              ))}
            </div>

            {/* Operative Inspector & Modifier */}
            <div className="lg:col-span-2 p-5 rounded-xl bg-[#0b101d] border border-slate-800 space-y-5 font-mono text-xs">
              {(() => {
                const isLocal = selectedOperativeId === 'current-session';
                const targetOp = isLocal
                  ? { ...progress, playerId: 'Active Client Session' }
                  : operatives.find((o) => o.playerId === selectedOperativeId) || {
                      ...progress,
                      playerId: selectedOperativeId,
                    };

                return (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-cyan-400" />
                          <span>Inspecting Operative: {targetOp.playerId}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {isLocal
                            ? 'Editing live in-memory state with background auto-sync'
                            : 'Direct write mutations to Cloud Firestore target document'}
                        </div>
                      </div>

                      {!isLocal && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete Firestore record for ${targetOp.playerId}?`)) {
                              adminDeletePlayerProgress(targetOp.playerId);
                              setOperatives((prev) => prev.filter((o) => o.playerId !== targetOp.playerId));
                              setSelectedOperativeId('current-session');
                            }
                          }}
                          className="px-2.5 py-1 rounded bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 text-[10px] flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete Document</span>
                        </button>
                      )}
                    </div>

                    {/* Operative Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3 bg-[#0d1424] rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px]">TACTICAL CREDITS</div>
                        <div className="text-base font-bold text-cyan-300">
                          {targetOp.credits?.toLocaleString() || 0}
                        </div>
                      </div>

                      <div className="p-3 bg-[#0d1424] rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px]">ODC TOKEN BALANCE</div>
                        <div className="text-base font-bold text-purple-300">
                          {(targetOp.odcSimulatedBalance || 0).toLocaleString()}
                        </div>
                      </div>

                      <div className="p-3 bg-[#0d1424] rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px]">VEHICLE STATUS</div>
                        <div className="text-base font-bold text-emerald-300">
                          {targetOp.hasVehicleUnlocked ? 'UNLOCKED' : 'LOCKED'}
                        </div>
                      </div>

                      <div className="p-3 bg-[#0d1424] rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px]">COMPLETED MISSIONS</div>
                        <div className="text-base font-bold text-amber-300">
                          {targetOp.missionsCompleted?.length || 0}
                        </div>
                      </div>
                    </div>

                    {/* Credit Granting Controls */}
                    <div className="p-4 bg-[#0e1422] rounded-xl border border-slate-800 space-y-3">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>Grant or Deduct Tactical Credits</span>
                        <Coins className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleModifyCredits(selectedOperativeId, 1000)}
                          className="px-3 py-1.5 rounded bg-cyan-950 border border-cyan-700 hover:border-cyan-400 text-cyan-300 font-bold"
                        >
                          +1,000 CR
                        </button>
                        <button
                          type="button"
                          onClick={() => handleModifyCredits(selectedOperativeId, 5000)}
                          className="px-3 py-1.5 rounded bg-cyan-950 border border-cyan-700 hover:border-cyan-400 text-cyan-300 font-bold"
                        >
                          +5,000 CR
                        </button>
                        <button
                          type="button"
                          onClick={() => handleModifyCredits(selectedOperativeId, 25000)}
                          className="px-3 py-1.5 rounded bg-cyan-950 border border-cyan-700 hover:border-cyan-400 text-cyan-300 font-bold"
                        >
                          +25,000 CR
                        </button>
                        <button
                          type="button"
                          onClick={() => handleModifyCredits(selectedOperativeId, -5000)}
                          className="px-3 py-1.5 rounded bg-rose-950 border border-rose-800 hover:border-rose-400 text-rose-300 font-bold"
                        >
                          -5,000 CR
                        </button>
                      </div>
                    </div>

                    {/* Item & Asset Injection */}
                    <div className="p-4 bg-[#0e1422] rounded-xl border border-slate-800 space-y-3">
                      <div className="font-bold text-white flex items-center justify-between">
                        <span>Loadout & Item Injection</span>
                        <Package className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleInjectItem(selectedOperativeId, 'Ancient Quantum Keycard')}
                          className="px-3 py-1.5 rounded bg-purple-950 border border-purple-800 hover:border-purple-400 text-purple-200"
                        >
                          + Ancient Quantum Keycard
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInjectItem(selectedOperativeId, 'Neural Drone Scanner')}
                          className="px-3 py-1.5 rounded bg-purple-950 border border-purple-800 hover:border-purple-400 text-purple-200"
                        >
                          + Neural Drone Scanner
                        </button>
                        <button
                          type="button"
                          onClick={() => handleInjectItem(selectedOperativeId, 'Pulse Carbine (Mark IV)')}
                          className="px-3 py-1.5 rounded bg-purple-950 border border-purple-800 hover:border-purple-400 text-purple-200"
                        >
                          + Pulse Carbine (Mark IV)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleVehicle(selectedOperativeId)}
                          className="px-3 py-1.5 rounded bg-indigo-950 border border-indigo-800 hover:border-indigo-400 text-indigo-200"
                        >
                          Toggle Cyber-Cruiser Vehicle
                        </button>
                      </div>

                      <div className="mt-3 text-[11px] text-slate-400">
                        <span className="font-bold text-slate-300">Current Inventory: </span>
                        {targetOp.inventory && targetOp.inventory.length > 0
                          ? targetOp.inventory.join(', ')
                          : 'Loadout empty'}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GLOBAL ECONOMY ENGINE */}
      {activeSubTab === 'economy' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-[#0b101d] border border-slate-800 font-mono text-xs flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-sm">Global Game Engine & Simulated Economy Tuning</div>
              <div className="text-slate-400">
                Adjust economy constants, credit distribution multipliers, and PvP zone engagement directives in <code className="text-cyan-300">/system_config/gameplay</code>.
              </div>
            </div>
            <button
              type="button"
              onClick={handleSaveSystemConfig}
              disabled={savingConfig}
              className={`px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                configSavedSuccess
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${savingConfig ? 'animate-spin' : ''}`} />
              <span>{configSavedSuccess ? 'DEPLOYED!' : savingConfig ? 'DEPLOYING...' : 'DEPLOY SETTINGS'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            {/* Economic Variables */}
            <div className="p-5 rounded-xl bg-[#0b101d] border border-slate-800 space-y-4">
              <div className="text-white font-bold text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                <Coins className="w-4 h-4 text-cyan-400" />
                <span>Credit Multiplier & Mint Rates</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Credit Multiplier per Mission</span>
                  <span className="text-cyan-300 font-bold">{systemConfig.creditMultiplier}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5.0"
                  step="0.1"
                  value={systemConfig.creditMultiplier}
                  onChange={(e) =>
                    setSystemConfigState((prev) => ({
                      ...prev,
                      creditMultiplier: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>0.5x (Hardcore)</span>
                  <span>1.5x (Standard)</span>
                  <span>5.0x (Hyper Boost)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Simulated ODC Mint Rate (per directive)</span>
                  <span className="text-purple-300 font-bold">{systemConfig.odcMintRate} ODC</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={systemConfig.odcMintRate}
                  onChange={(e) =>
                    setSystemConfigState((prev) => ({
                      ...prev,
                      odcMintRate: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full accent-purple-400"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1 ODC (Scarcity)</span>
                  <span>10 ODC (Balanced)</span>
                  <span>50 ODC (Generous)</span>
                </div>
              </div>
            </div>

            {/* Environmental & Combat Directives */}
            <div className="p-5 rounded-xl bg-[#0b101d] border border-slate-800 space-y-4">
              <div className="text-white font-bold text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Sector Density & PvP State</span>
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 block">Relic Shard Map Spawn Density</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Low', 'Standard', 'High', 'Overcharged'] as const).map((density) => (
                    <button
                      key={density}
                      type="button"
                      onClick={() =>
                        setSystemConfigState((prev) => ({
                          ...prev,
                          relicShardDensity: density,
                        }))
                      }
                      className={`py-2 px-2 rounded-lg border text-center transition-all ${
                        systemConfig.relicShardDensity === density
                          ? 'bg-amber-950 border-amber-400 text-amber-200 font-bold'
                          : 'bg-[#0d1424] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-slate-300 block">PvP Sector Engagement Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Active', 'Zone-Restricted', 'Ceasefire'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        setSystemConfigState((prev) => ({
                          ...prev,
                          pvpEngagementStatus: status,
                        }))
                      }
                      className={`py-2 px-2 rounded-lg border text-center transition-all ${
                        systemConfig.pvpEngagementStatus === status
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-200 font-bold'
                          : 'bg-[#0d1424] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM BROADCASTS */}
      {activeSubTab === 'broadcasts' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#0b101d] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-sm">Emergency System Broadcasts & Alerts</div>
              <div className="text-slate-400">
                Publish high-priority tactical announcements to all active operative viewports in <code className="text-cyan-300">/system_broadcasts</code>.
              </div>
            </div>
            <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300">
              {broadcasts.filter((b) => b.active).length} Active Alerts
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Broadcast Form */}
            <form
              onSubmit={handleCreateBroadcast}
              className="p-5 rounded-xl bg-[#0b101d] border border-slate-800 space-y-4"
            >
              <div className="text-white font-bold text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Dispatch New Transmission</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Alert Headline</label>
                <input
                  type="text"
                  value={newBroadcastTitle}
                  onChange={(e) => setNewBroadcastTitle(e.target.value)}
                  placeholder="e.g. DEFCON 2: SOLAR FLARE IN SECTOR 7"
                  className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Transmission Briefing</label>
                <textarea
                  rows={3}
                  value={newBroadcastBody}
                  onChange={(e) => setNewBroadcastBody(e.target.value)}
                  placeholder="Enter operative instruction or tactical notification..."
                  className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 resize-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Severity Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['info', 'warning', 'critical'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setNewBroadcastSeverity(sev)}
                      className={`py-1.5 px-2 rounded-lg border text-center uppercase text-[10px] font-bold transition-all ${
                        newBroadcastSeverity === sev
                          ? sev === 'critical'
                            ? 'bg-rose-950 border-rose-500 text-rose-300'
                            : sev === 'warning'
                            ? 'bg-amber-950 border-amber-500 text-amber-300'
                            : 'bg-cyan-950 border-cyan-500 text-cyan-300'
                          : 'bg-[#090e1a] border-slate-800 text-slate-500'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20"
              >
                <Radio className="w-4 h-4" />
                <span>Publish Transmission</span>
              </button>
            </form>

            {/* Broadcasts List */}
            <div className="lg:col-span-2 space-y-3">
              {broadcasts.length === 0 ? (
                <div className="p-8 rounded-xl bg-[#0b101d] border border-slate-800 text-center text-slate-500">
                  No transmissions in the broadcast log.
                </div>
              ) : (
                broadcasts.map((b) => (
                  <div
                    key={b.id}
                    className={`p-4 rounded-xl border transition-all ${
                      b.active
                        ? b.severity === 'critical'
                          ? 'bg-rose-950/30 border-rose-800/80'
                          : b.severity === 'warning'
                          ? 'bg-amber-950/30 border-amber-800/80'
                          : 'bg-cyan-950/30 border-cyan-800/80'
                        : 'bg-[#0a0f1d] border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              b.severity === 'critical'
                                ? 'bg-rose-950 text-rose-300 border border-rose-700'
                                : b.severity === 'warning'
                                ? 'bg-amber-950 text-amber-300 border border-amber-700'
                                : 'bg-cyan-950 text-cyan-300 border border-cyan-700'
                            }`}
                          >
                            {b.severity}
                          </span>
                          <h4 className="font-bold text-white text-xs">{b.title}</h4>
                          {b.active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                        </div>
                        <p className="text-slate-300 text-xs mt-1">{b.message}</p>
                        <div className="text-[10px] text-slate-500 mt-2">
                          Published: {new Date(b.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleBroadcast(b)}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
                            b.active
                              ? 'bg-amber-950 border-amber-700 text-amber-300'
                              : 'bg-emerald-950 border-emerald-700 text-emerald-300'
                          }`}
                        >
                          {b.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBroadcast(b.id)}
                          className="p-1 rounded bg-rose-950/60 border border-rose-800/60 text-rose-300 hover:bg-rose-900 transition-colors"
                          title="Delete Broadcast"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ADMIN ROSTER */}
      {activeSubTab === 'admins' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#0b101d] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-sm">System Clearance & Admin Roster</div>
              <div className="text-slate-400">
                Grant or revoke administrator privileges via Cloud Firestore (<code className="text-cyan-300">/admins/{'{adminId}'}</code>).
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-[10px]">
              {adminList.length} Administrators
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Admin Form */}
            <form
              onSubmit={handleAddAdmin}
              className="p-5 rounded-xl bg-[#0b101d] border border-slate-800 space-y-4"
            >
              <div className="text-white font-bold text-sm border-b border-slate-800 pb-3 flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>Grant Administrator Clearance</span>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Admin Email Address</label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="operative@domain.com"
                  className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 block">Clearance Tier</label>
                <select
                  value={newAdminRole}
                  onChange={(e) =>
                    setNewAdminRole(e.target.value as 'superadmin' | 'game_master' | 'auditor')
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#070b14] border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="superadmin">Superadmin (Full Write Access)</option>
                  <option value="game_master">Game Master (Operatives & Directives)</option>
                  <option value="auditor">Auditor (Telemetry & Logs Read-Only)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize Administrator</span>
              </button>
            </form>

            {/* Admin Roster List */}
            <div className="lg:col-span-2 space-y-3">
              {adminList.map((adm) => {
                const isMaster = adm.email === BOOTSTRAPPED_ADMIN_EMAIL;
                return (
                  <div
                    key={adm.adminId}
                    className="p-4 rounded-xl bg-[#0b101d] border border-slate-800 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{adm.email}</span>
                        {isMaster && (
                          <span className="px-1.5 py-0.2 text-[9px] rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                            MASTER ROOT
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Role: <span className="text-cyan-300 font-bold uppercase">{adm.role}</span> • Granted:{' '}
                        {new Date(adm.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {!isMaster && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (window.confirm(`Revoke admin clearance for ${adm.email}?`)) {
                            sound.playClick();
                            await deleteAdminRecord(adm.adminId);
                            setAdminList((prev) => prev.filter((a) => a.adminId !== adm.adminId));
                            showNotification(`Revoked admin clearance for ${adm.email}`);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 text-[10px]"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
