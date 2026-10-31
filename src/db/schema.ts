// Trueself database schema.
//
// There is no account system. Each browser generates a random
// `anonymousId` (stored in localStorage) that scopes personal records
// such as notes and check-ins. Reports are addressed by an unguessable
// UUID so share links never leak sequential/predictable identifiers.
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// A single completed six-question assessment + its AI analysis.
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  anonymousId: text("anonymous_id").notNull(),
  name: text("name").notNull(),
  // Raw answers the user submitted: [{ questionId, optionId, context }]
  answers: jsonb("answers").notNull(),
  // The validated AI (or demo) analysis payload described in ai/schema.ts
  analysis: jsonb("analysis").notNull(),
  // "ai" when a real model produced the analysis, "demo" otherwise.
  source: text("source").notNull().default("demo"),
  isDemo: boolean("is_demo").notNull().default(false),
  patternConfirmed: boolean("pattern_confirmed"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Completion state for the 24h action, 7-day plan and 30-day experiment.
export const planProgress = pgTable("plan_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").notNull(),
  itemKey: text("item_key").notNull(), // e.g. "next24h", "day-1" ... "day-7", "thirty-day"
  completed: boolean("completed").notNull().default(false),
  skippedReason: text("skipped_reason"),
  note: text("note"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// "My Patterns" + "My Personal Notes" — a private, searchable journal.
export const personalNotes = pgTable("personal_notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  anonymousId: text("anonymous_id").notNull(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  category: text("category").notNull().default("note"),
  linkedInsight: text("linked_insight"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Lightweight daily check-in (max 3 questions).
export const dailyCheckins = pgTable("daily_checkins", {
  id: uuid("id").primaryKey().defaultRandom(),
  anonymousId: text("anonymous_id").notNull(),
  checkinDate: text("checkin_date").notNull(), // YYYY-MM-DD, one per day
  energyDrain: text("energy_drain"),
  wentWell: text("went_well"),
  avoiding: text("avoiding"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Structured, non-anonymous outside perspective invited by the user.
export const friendPerspectives = pgTable("friend_perspectives", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").notNull(),
  fromName: text("from_name").notNull(),
  underestimatedStrength: text("underestimated_strength").notNull(),
  deservesMoreCredit: text("deserves_more_credit").notNull(),
  improvementSuggestion: text("improvement_suggestion").notNull(),
  revealed: boolean("revealed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Friend invitations with email, permission, and opened/pending tracking
export const friendInvitations = pgTable("friend_invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").notNull(),
  email: text("email").notNull(),
  name: text("name"),
  permission: text("permission").notNull().default("blind"),
  status: text("status").notNull().default("pending"), // "pending" | "opened" | "completed"
  openedAt: timestamp("opened_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// User-adjusted Values Compass weights (0-100 per dimension).
export const valuesCompass = pgTable("values_compass", {
  id: uuid("id").primaryKey().defaultRandom(),
  reportId: uuid("report_id").notNull(),
  weights: jsonb("weights").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Count of completed assessments per anonymous visitor — used to decide
// whether to offer "Monthly Reflection" and to link historical reports.
export const reportCounters = pgTable("report_counters", {
  anonymousId: text("anonymous_id").primaryKey(),
  totalReports: integer("total_reports").notNull().default(0),
});
