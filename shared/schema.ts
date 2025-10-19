import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { eq } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth + Google OAuth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique().notNull(), // Made notNull for consistency
  googleId: varchar("google_id").unique(), // Added for Google OAuth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("user"), // 'owner', 'admin', 'moderator', 'user'
  permissions: text("permissions").array().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  apiKey: text("api_key").notNull().unique(),
  version: text("version").notNull().default("1.0.0"),
  isActive: boolean("is_active").notNull().default(true),
  hwidLockEnabled: boolean("hwid_lock_enabled").notNull().default(false),
  loginSuccessMessage: text("login_success_message").default("Login successful!"),
  loginFailedMessage: text("login_failed_message").default("Invalid credentials!"),
  accountDisabledMessage: text("account_disabled_message").default("Account is disabled!"),
  accountExpiredMessage: text("account_expired_message").default("Account has expired!"),
  versionMismatchMessage: text("version_mismatch_message").default("Please update your application to the latest version!"),
  hwidMismatchMessage: text("hwid_mismatch_message").default("Hardware ID mismatch detected!"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Application users
export const appUsers = pgTable(
  "app_users",
  {
    id: serial("id").primaryKey(),
    applicationId: integer("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
    username: text("username").notNull(),
    password: text("password").notNull(),
    email: text("email"),
    apiKey: text("api_key").notNull(), // Added to match test-login.tsx
    isActive: boolean("is_active").notNull().default(true),
    isPaused: boolean("is_paused").notNull().default(false),
    hwid: text("hwid"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    lastLogin: timestamp("last_login"),
    loginAttempts: integer("login_attempts").notNull().default(0),
    lastLoginAttempt: timestamp("last_login_attempt"),
  },
  (table) => ({
    uniqueUsernamePerApp: index("unique_username_per_app").on(table.applicationId, table.username),
    uniqueEmailPerApp: index("unique_email_per_app").on(table.applicationId, table.email),
    uniqueApiKeyPerApp: index("unique_api_key_per_app").on(table.applicationId, table.apiKey), // Added index
  }),
);

// Webhook configurations
export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  secret: text("secret"),
  events: text("events").array().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Blacklist system
export const blacklist = pgTable(
  "blacklist",
  {
    id: serial("id").primaryKey(),
    applicationId: integer("application_id").references(() => applications.id, { onDelete: "cascade" }),
    userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // 'ip', 'hwid', 'username', 'email'
    value: text("value").notNull(),
    reason: text("reason"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    createdBy: varchar("created_by").references(() => users.id),
  },
  (table) => ({
    uniqueBlacklistEntry: index("unique_blacklist_entry").on(table.applicationId, table.type, table.value),
  }),
);

// Activity logs
export const activityLogs = pgTable(
  "activity_logs",
  {
    id: serial("id").primaryKey(),
    applicationId: integer("application_id").references(() => applications.id, { onDelete: "cascade" }),
    appUserId: integer("app_user_id").references(() => appUsers.id, { onDelete: "cascade" }),
    event: text("event").notNull(),
    ipAddress: text("ip_address"),
    hwid: text("hwid"),
    userAgent: text("user_agent"),
    metadata: jsonb("metadata"),
    success: boolean("success").notNull().default(true),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    activityLogsByApp: index("activity_logs_by_app").on(table.applicationId, table.createdAt),
    activityLogsByUser: index("activity_logs_by_user").on(table.appUserId, table.createdAt),
  }),
);

// Active sessions tracking
export const activeSessions = pgTable(
  "active_sessions",
  {
    id: serial("id").primaryKey(),
    applicationId: integer("application_id").notNull().references(() => applications.id, { onDelete: "cascade" }),
    appUserId: integer("app_user_id").notNull().references(() => appUsers.id, { onDelete: "cascade" }),
    sessionToken: text("session_token").notNull().unique(),
    ipAddress: text("ip_address"),
    hwid: text("hwid"),
    userAgent: text("user_agent"),
    location: text("location"),
    isActive: boolean("is_active").notNull().default(true),
    lastActivity: timestamp("last_activity").notNull().defaultNow(),
    expiresAt: timestamp("expires_at"),
  },
  (table) => ({
    activeSessionsByApp: index("active_sessions_by_app").on(table.applicationId, table.isActive),
    activeSessionsByUser: index("active_sessions_by_user").on(table.appUserId, table.isActive),
  }),
);

// Zod Schemas
export const insertApplicationSchema = createInsertSchema(applications).pick({
  name: true,
  description: true,
  version: true,
  hwidLockEnabled: true,
  loginSuccessMessage: true,
  loginFailedMessage: true,
  accountDisabledMessage: true,
  accountExpiredMessage: true,
  versionMismatchMessage: true,
  hwidMismatchMessage: true,
});

export const insertAppUserSchema = createInsertSchema(appUsers)
  .pick({
    username: true,
    password: true,
    email: true,
    apiKey: true, // Added
    expiresAt: true,
    hwid: true,
  })
  .extend({
    email: z.union([z.string().email(), z.literal(""), z.null(), z.undefined()]).optional().transform((val) => val === "" || val === undefined ? null : val),
    expiresAt: z.string().optional().nullable(),
    hwid: z.string().optional().nullable(),
    apiKey: z.string().min(1, "API key is required"), // Added validation
  });

export const updateApplicationSchema = createInsertSchema(applications)
  .pick({
    name: true,
    description: true,
    version: true,
    isActive: true,
    hwidLockEnabled: true,
    loginSuccessMessage: true,
    loginFailedMessage: true,
    accountDisabledMessage: true,
    accountExpiredMessage: true,
    versionMismatchMessage: true,
    hwidMismatchMessage: true,
  })
  .partial();

export const updateAppUserSchema = createInsertSchema(appUsers)
  .pick({
    username: true,
    password: true,
    email: true,
    apiKey: true, // Added
    isActive: true,
    isPaused: true,
    hwid: true,
    expiresAt: true,
    lastLogin: true,
    loginAttempts: true,
    lastLoginAttempt: true,
  })
  .partial()
  .extend({
    hwid: z.string().optional().nullable(),
    expiresAt: z.string().optional().nullable(),
    apiKey: z.string().optional(),
  });

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  api_key: z.string().min(1, "API key is required"), // Updated to match test-login.tsx
  version: z.string().optional(),
  hwid: z.string().optional(),
});

export const insertWebhookSchema = createInsertSchema(webhooks).pick({
  url: true,
  secret: true,
  events: true,
});

export const insertBlacklistSchema = createInsertSchema(blacklist).pick({
  applicationId: true,
  type: true,
  value: true,
  reason: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs)
  .pick({
    applicationId: true,
    appUserId: true,
    event: true,
    ipAddress: true,
    hwid: true,
    userAgent: true,
    metadata: true,
    errorMessage: true,
  })
  .extend({
    success: z.boolean().optional(),
  });

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type UpdateApplication = z.infer<typeof updateApplicationSchema>;
export type AppUser = typeof appUsers.$inferSelect;
export type InsertAppUser = z.infer<typeof insertAppUserSchema>;
export type UpdateAppUser = z.infer<typeof updateAppUserSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = z.infer<typeof insertWebhookSchema>;
export type BlacklistEntry = typeof blacklist.$inferSelect;
export type InsertBlacklistEntry = z.infer<typeof insertBlacklistSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActiveSession = typeof activeSessions.$inferSelect;
