import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  onSnapshot,
  query,
  where,
  getDocFromServer,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { PlayerProgress, AdminRecord, SystemBroadcast, SystemConfig } from '../types';

// 1. Initialize Firebase App (Singleton pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 2. Auth Instance
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// 3. Firestore Database Instance (with dedicated Database ID if configured)
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// 4. Strict Error Handling Enum & Interface
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 5. Test Firestore Connection on Boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase] Connection verified.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('[Firebase] Offline or unreachable; verify Firebase configuration.');
      return false;
    }
    // Expected if 'test/connection' doc doesn't exist or is blocked by rules
    return true;
  }
}

// Run connection test once at boot in background
testConnection().catch(() => {});

// 6. Auth Helpers
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('[Firebase Auth] Sign in failed:', err);
    throw err;
  }
}

export async function signOutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('[Firebase Auth] Sign out failed:', err);
    throw err;
  }
}

export function onAuthUserChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// 7. Cloud Persistence: Sync Operative Progress to Firestore
export async function syncProgressToCloud(
  user: User,
  progress: PlayerProgress
): Promise<void> {
  const path = `player_progress/${user.uid}`;
  try {
    await setDoc(
      doc(db, 'player_progress', user.uid),
      {
        playerId: user.uid,
        credits: progress.credits,
        odcSimulatedBalance: progress.odcSimulatedBalance || 0,
        hasVehicleUnlocked: Boolean(progress.hasVehicleUnlocked),
        activeMissionId: progress.activeMissionId || '',
        missionsCompleted: progress.missionsCompleted || [],
        collectedFragments: progress.collectedFragments || [],
        inventory: JSON.stringify(progress.inventory || []),
        lastWarpLocation: progress.lastWarpLocation || '',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadProgressFromCloud(
  user: User
): Promise<Partial<PlayerProgress> | null> {
  const path = `player_progress/${user.uid}`;
  try {
    const docSnap = await getDoc(doc(db, 'player_progress', user.uid));
    if (docSnap.exists()) {
      const data = docSnap.data();
      let inventory = [];
      try {
        if (data.inventory) inventory = JSON.parse(data.inventory);
      } catch {
        // use default
      }
      return {
        credits: typeof data.credits === 'number' ? data.credits : undefined,
        odcSimulatedBalance: typeof data.odcSimulatedBalance === 'number' ? data.odcSimulatedBalance : undefined,
        missionsCompleted: Array.isArray(data.missionsCompleted) ? data.missionsCompleted : undefined,
        collectedFragments: Array.isArray(data.collectedFragments) ? data.collectedFragments : undefined,
        inventory: inventory.length ? inventory : undefined,
        hasVehicleUnlocked: typeof data.hasVehicleUnlocked === 'boolean' ? data.hasVehicleUnlocked : undefined,
        activeMissionId: data.activeMissionId || null,
        lastWarpLocation: data.lastWarpLocation || undefined,
      };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// 8. Admin Authorization & Clearance
export const BOOTSTRAPPED_ADMIN_EMAIL = 'onegodianone@gmail.com';

export async function checkIsAdmin(user: User | null): Promise<boolean> {
  if (!user) return false;
  if (user.email === BOOTSTRAPPED_ADMIN_EMAIL && user.emailVerified) {
    return true;
  }
  const path = `admins/${user.uid}`;
  try {
    const adminDoc = await getDoc(doc(db, 'admins', user.uid));
    return adminDoc.exists();
  } catch (err) {
    // If not admin, permission denied is expected
    return false;
  }
}

export async function getAdmins(): Promise<AdminRecord[]> {
  const path = 'admins';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map((d) => d.data() as AdminRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveAdminRecord(admin: AdminRecord): Promise<void> {
  const path = `admins/${admin.adminId}`;
  try {
    await setDoc(doc(db, 'admins', admin.adminId), admin);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteAdminRecord(adminId: string): Promise<void> {
  const path = `admins/${adminId}`;
  try {
    await deleteDoc(doc(db, 'admins', adminId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 9. Admin: Operative Player Progress Management
export async function getAllPlayerProgress(): Promise<(PlayerProgress & { playerId: string; updatedAt?: string })[]> {
  const path = 'player_progress';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map((d) => {
      const data = d.data();
      let inventory = [];
      try {
        if (data.inventory) inventory = JSON.parse(data.inventory);
      } catch {
        inventory = [];
      }
      return {
        playerId: d.id,
        credits: typeof data.credits === 'number' ? data.credits : 0,
        odcSimulatedBalance: typeof data.odcSimulatedBalance === 'number' ? data.odcSimulatedBalance : 0,
        hasVehicleUnlocked: Boolean(data.hasVehicleUnlocked),
        activeMissionId: data.activeMissionId || null,
        missionsCompleted: Array.isArray(data.missionsCompleted) ? data.missionsCompleted : [],
        collectedFragments: Array.isArray(data.collectedFragments) ? data.collectedFragments : [],
        inventory,
        lastWarpLocation: data.lastWarpLocation,
        updatedAt: data.updatedAt,
      };
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function adminUpdatePlayerProgress(
  playerId: string,
  progress: Partial<PlayerProgress>
): Promise<void> {
  const path = `player_progress/${playerId}`;
  try {
    const payload: Record<string, unknown> = {
      playerId,
      updatedAt: new Date().toISOString(),
    };
    if (typeof progress.credits === 'number') payload.credits = progress.credits;
    if (typeof progress.odcSimulatedBalance === 'number') payload.odcSimulatedBalance = progress.odcSimulatedBalance;
    if (typeof progress.hasVehicleUnlocked === 'boolean') payload.hasVehicleUnlocked = progress.hasVehicleUnlocked;
    if (progress.activeMissionId !== undefined) payload.activeMissionId = progress.activeMissionId || '';
    if (progress.missionsCompleted) payload.missionsCompleted = progress.missionsCompleted;
    if (progress.collectedFragments) payload.collectedFragments = progress.collectedFragments;
    if (progress.inventory) payload.inventory = JSON.stringify(progress.inventory);
    if (progress.lastWarpLocation) payload.lastWarpLocation = progress.lastWarpLocation;

    await setDoc(doc(db, 'player_progress', playerId), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function adminDeletePlayerProgress(playerId: string): Promise<void> {
  const path = `player_progress/${playerId}`;
  try {
    await deleteDoc(doc(db, 'player_progress', playerId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 10. Admin: System Broadcasts
export async function getSystemBroadcasts(): Promise<SystemBroadcast[]> {
  const path = 'system_broadcasts';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map((d) => d.data() as SystemBroadcast);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeToActiveBroadcasts(
  callback: (broadcasts: SystemBroadcast[]) => void
): () => void {
  const path = 'system_broadcasts';
  const q = query(collection(db, path), where('active', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      const broadcasts = snapshot.docs.map((d) => d.data() as SystemBroadcast);
      callback(broadcasts);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function saveSystemBroadcast(broadcast: SystemBroadcast): Promise<void> {
  const path = `system_broadcasts/${broadcast.id}`;
  try {
    await setDoc(doc(db, 'system_broadcasts', broadcast.id), broadcast);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSystemBroadcast(broadcastId: string): Promise<void> {
  const path = `system_broadcasts/${broadcastId}`;
  try {
    await deleteDoc(doc(db, 'system_broadcasts', broadcastId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 11. Admin: Global System Configuration
export async function getSystemConfig(): Promise<SystemConfig | null> {
  const path = 'system_config/gameplay';
  try {
    const snap = await getDoc(doc(db, 'system_config', 'gameplay'));
    if (snap.exists()) {
      return snap.data() as SystemConfig;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveSystemConfig(config: SystemConfig): Promise<void> {
  const path = `system_config/${config.configId}`;
  try {
    await setDoc(doc(db, 'system_config', config.configId), config);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
