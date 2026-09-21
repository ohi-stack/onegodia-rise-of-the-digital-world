import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Primary users table tied to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Player telemetry, RPG progression, and game state
export const playerProgress = pgTable('player_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  credits: integer('credits').default(1500),
  rank: text('rank').default('CADET'),
  level: integer('level').default(1),
  exp: integer('exp').default(0),
  lastWarpLocation: text('last_warp_location').default('Stamford Hospital'),
  unlockedLocations: text('unlocked_locations').default('[]'),
  relicsCollected: text('relics_collected').default('[]'),
  droneHacks: integer('drone_hacks').default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Stamford Corridor transit runs and geospatial navigation telemetry
export const corridorRuns = pgTable('corridor_runs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  origin: text('origin').notNull(),
  destination: text('destination').notNull(),
  travelMode: text('travel_mode').notNull(),
  distanceMeters: integer('distance_meters'),
  durationSeconds: integer('duration_seconds'),
  status: text('status').default('completed'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  progress: one(playerProgress, {
    fields: [users.id],
    references: [playerProgress.userId],
  }),
  corridorRuns: many(corridorRuns),
}));

export const playerProgressRelations = relations(playerProgress, ({ one }) => ({
  user: one(users, {
    fields: [playerProgress.userId],
    references: [users.id],
  }),
}));

export const corridorRunsRelations = relations(corridorRuns, ({ one }) => ({
  user: one(users, {
    fields: [corridorRuns.userId],
    references: [users.id],
  }),
}));
