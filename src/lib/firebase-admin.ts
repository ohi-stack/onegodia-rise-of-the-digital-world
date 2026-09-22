import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

let adminApp: App | null = null;
let adminAuthInstance: Auth | null = null;

function getFirebaseAdminConfig() {
  try {
    const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('Could not read firebase-applet-config.json:', err);
  }
  return null;
}

export function getAdminAuth(): Auth | null {
  if (adminAuthInstance) return adminAuthInstance;
  try {
    const config = getFirebaseAdminConfig();
    const projectId = config?.projectId || process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;

    if (!getApps().length) {
      adminApp = initializeApp({
        projectId: projectId || undefined,
      });
    } else {
      adminApp = getApps()[0];
    }

    adminAuthInstance = getAuth(adminApp);
    return adminAuthInstance;
  } catch (error) {
    console.warn('Firebase Admin lazy initialization warning:', error);
    return null;
  }
}

// Proxy for backwards-compatibility
export const adminAuth = new Proxy({} as Auth, {
  get(_target, prop) {
    const auth = getAdminAuth();
    if (!auth) {
      throw new Error('Firebase Admin Auth is not initialized or configured.');
    }
    const val = (auth as any)[prop];
    return typeof val === 'function' ? val.bind(auth) : val;
  }
});

