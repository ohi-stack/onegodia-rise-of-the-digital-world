import { eq, desc } from 'drizzle-orm';
import { db } from './index.ts';
import { users, playerProgress, corridorRuns } from './schema.ts';

export async function getOrCreateUser(uid: string, email: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
        },
      })
      .returning();

    const user = result[0];

    // Ensure initial player progress entry exists
    const existingProgress = await db
      .select()
      .from(playerProgress)
      .where(eq(playerProgress.userId, user.id));

    if (existingProgress.length === 0) {
      await db.insert(playerProgress).values({
        userId: user.id,
        credits: 1500,
        rank: 'CADET',
        level: 1,
        exp: 0,
        lastWarpLocation: 'Stamford Hospital',
        unlockedLocations: JSON.stringify(['Stamford Hospital', 'Stamford Transportation Center']),
        relicsCollected: JSON.stringify([]),
        droneHacks: 0,
      });
    }

    return user;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Database operation failed for user synchronization.', { cause: error });
  }
}

export async function getPlayerProgressByUid(uid: string) {
  try {
    const rows = await db
      .select({
        progress: playerProgress,
        user: users,
      })
      .from(users)
      .innerJoin(playerProgress, eq(playerProgress.userId, users.id))
      .where(eq(users.uid, uid));

    if (rows.length === 0) {
      return null;
    }

    const item = rows[0].progress;
    return {
      id: item.id,
      userId: item.userId,
      credits: item.credits ?? 1500,
      rank: item.rank ?? 'CADET',
      level: item.level ?? 1,
      exp: item.exp ?? 0,
      lastWarpLocation: item.lastWarpLocation ?? 'Stamford Hospital',
      unlockedLocations: item.unlockedLocations ? JSON.parse(item.unlockedLocations) : [],
      relicsCollected: item.relicsCollected ? JSON.parse(item.relicsCollected) : [],
      droneHacks: item.droneHacks ?? 0,
      updatedAt: item.updatedAt,
    };
  } catch (error) {
    console.error('Error in getPlayerProgressByUid:', error);
    throw new Error('Database query failed while fetching player progress.', { cause: error });
  }
}

export async function updatePlayerProgressByUid(
  uid: string,
  updates: {
    credits?: number;
    rank?: string;
    level?: number;
    exp?: number;
    lastWarpLocation?: string;
    unlockedLocations?: string[];
    relicsCollected?: string[];
    droneHacks?: number;
  }
) {
  try {
    const userRows = await db.select().from(users).where(eq(users.uid, uid));
    if (userRows.length === 0) {
      throw new Error(`User with uid ${uid} not found.`);
    }
    const user = userRows[0];

    const patch: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (updates.credits !== undefined) patch.credits = updates.credits;
    if (updates.rank !== undefined) patch.rank = updates.rank;
    if (updates.level !== undefined) patch.level = updates.level;
    if (updates.exp !== undefined) patch.exp = updates.exp;
    if (updates.lastWarpLocation !== undefined) patch.lastWarpLocation = updates.lastWarpLocation;
    if (updates.unlockedLocations !== undefined)
      patch.unlockedLocations = JSON.stringify(updates.unlockedLocations);
    if (updates.relicsCollected !== undefined)
      patch.relicsCollected = JSON.stringify(updates.relicsCollected);
    if (updates.droneHacks !== undefined) patch.droneHacks = updates.droneHacks;

    const updated = await db
      .update(playerProgress)
      .set(patch)
      .where(eq(playerProgress.userId, user.id))
      .returning();

    return updated[0];
  } catch (error) {
    console.error('Error in updatePlayerProgressByUid:', error);
    throw new Error('Database query failed while updating player progress.', { cause: error });
  }
}

export async function recordCorridorRun(
  uid: string,
  runData: {
    origin: string;
    destination: string;
    travelMode: string;
    distanceMeters?: number;
    durationSeconds?: number;
    status?: string;
  }
) {
  try {
    const userRows = await db.select().from(users).where(eq(users.uid, uid));
    if (userRows.length === 0) {
      throw new Error(`User with uid ${uid} not found.`);
    }
    const user = userRows[0];

    const result = await db
      .insert(corridorRuns)
      .values({
        userId: user.id,
        origin: runData.origin,
        destination: runData.destination,
        travelMode: runData.travelMode,
        distanceMeters: runData.distanceMeters,
        durationSeconds: runData.durationSeconds,
        status: runData.status ?? 'completed',
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error in recordCorridorRun:', error);
    throw new Error('Database query failed while recording corridor run.', { cause: error });
  }
}

export async function getCorridorRunsByUid(uid: string) {
  try {
    const rows = await db
      .select({
        run: corridorRuns,
      })
      .from(users)
      .innerJoin(corridorRuns, eq(corridorRuns.userId, users.id))
      .where(eq(users.uid, uid))
      .orderBy(desc(corridorRuns.createdAt))
      .limit(15);

    return rows.map((r) => r.run);
  } catch (error) {
    console.error('Error in getCorridorRunsByUid:', error);
    throw new Error('Database query failed while fetching corridor runs.', { cause: error });
  }
}
