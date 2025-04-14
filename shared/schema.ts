import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enum values
export const UserRoleEnum = {
  EMPLOYER: "employer",
  JOBSEEKER: "jobseeker",
} as const;

export const EmploymentTypeEnum = {
  FULL_TIME: "full_time",
  PART_TIME: "part_time",
  CONTRACT: "contract",
  INTERNSHIP: "internship",
  ENTRY_LEVEL: "entry_level",
} as const;

export const LocationTypeEnum = {
  ONSITE: "onsite",
  HYBRID: "hybrid",
  REMOTE: "remote",
  NO_PREFERENCE: "no_preference",
} as const;

export const JobStatusEnum = {
  OPEN: "open",
  FILLED: "filled",
  EXPIRED: "expired",
} as const;

export const MatchStatusEnum = {
  PENDING: "pending",
  MATCHED: "matched",
  REJECTED: "rejected",
} as const;

export const InterestStatusEnum = {
  PENDING: "pending",
  INTERESTED: "interested",
  NOT_INTERESTED: "not_interested",
} as const;

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: Object.values(UserRoleEnum) }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Employer Profiles
export const employerProfiles = pgTable("employer_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  headquarters: text("headquarters").notNull(),
  additionalOffices: text("additional_offices"),
  employeeCount: text("employee_count").notNull(),
  yearFounded: integer("year_founded").notNull(),
  about: text("about"),
  missionValues: text("mission_values"),
  perksAndBenefits: text("perks_and_benefits"),
  calendarLink: text("calendar_link"),
  atsLink: text("ats_link"),
  superUser: boolean("super_user").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Job Postings
export const jobPostings = pgTable("job_postings", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").notNull().references(() => employerProfiles.id),
  title: text("title").notNull(),
  function: text("function").notNull(),
  type: text("type", { enum: Object.values(EmploymentTypeEnum) }).notNull(),
  location: text("location").notNull(),
  locationType: text("location_type", { enum: Object.values(LocationTypeEnum) }).notNull(),
  description: text("description").notNull(),
  responsibilities: text("responsibilities").notNull(),
  status: text("status", { enum: Object.values(JobStatusEnum) }).default(JobStatusEnum.OPEN).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Jobseeker Profiles
export const jobseekerProfiles = pgTable("jobseeker_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phoneNumber: text("phone_number"),
  portfolioUrl: text("portfolio_url"),
  school: text("school"),
  degreeLevel: text("degree_level"),
  major: text("major"),
  preferredIndustries: text("preferred_industries").array(),
  preferredLocations: text("preferred_locations").array(),
  preferredLocationTypes: text("preferred_location_types").array(),
  preferredFunctionalAreas: text("preferred_functional_areas").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Jobseeker Preferences
export const jobseekerPreferences = pgTable("jobseeker_preferences", {
  id: serial("id").primaryKey(),
  jobseekerId: integer("jobseeker_id").notNull().references(() => jobseekerProfiles.id),
  // Store all 36 sliders as a JSON object
  preferences: jsonb("preferences").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Matches
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  employerId: integer("employer_id").notNull().references(() => employerProfiles.id),
  jobseekerId: integer("jobseeker_id").notNull().references(() => jobseekerProfiles.id),
  employerStatus: text("employer_status", { enum: Object.values(MatchStatusEnum) }).default(MatchStatusEnum.PENDING).notNull(),
  jobseekerStatus: text("jobseeker_status", { enum: Object.values(MatchStatusEnum) }).default(MatchStatusEnum.PENDING).notNull(),
  matchedAt: timestamp("matched_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Job Interest (after matching)
export const jobInterests = pgTable("job_interests", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull().references(() => matches.id),
  jobId: integer("job_id").notNull().references(() => jobPostings.id),
  status: text("status", { enum: Object.values(InterestStatusEnum) }).default(InterestStatusEnum.PENDING).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Messages
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").notNull().references(() => matches.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertEmployerProfileSchema = createInsertSchema(employerProfiles).omit({
  id: true,
  superUser: true,
  createdAt: true,
});

export const insertJobPostingSchema = createInsertSchema(jobPostings).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertJobseekerProfileSchema = createInsertSchema(jobseekerProfiles).omit({
  id: true,
  createdAt: true,
});

export const insertJobseekerPreferencesSchema = createInsertSchema(jobseekerPreferences).omit({
  id: true,
  createdAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  employerStatus: true,
  jobseekerStatus: true,
  matchedAt: true,
  createdAt: true,
});

export const insertJobInterestSchema = createInsertSchema(jobInterests).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type EmployerProfile = typeof employerProfiles.$inferSelect;
export type InsertEmployerProfile = z.infer<typeof insertEmployerProfileSchema>;

export type JobPosting = typeof jobPostings.$inferSelect;
export type InsertJobPosting = z.infer<typeof insertJobPostingSchema>;

export type JobseekerProfile = typeof jobseekerProfiles.$inferSelect;
export type InsertJobseekerProfile = z.infer<typeof insertJobseekerProfileSchema>;

export type JobseekerPreferences = typeof jobseekerPreferences.$inferSelect;
export type InsertJobseekerPreferences = z.infer<typeof insertJobseekerPreferencesSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type JobInterest = typeof jobInterests.$inferSelect;
export type InsertJobInterest = z.infer<typeof insertJobInterestSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
