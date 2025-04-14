import { db } from "./db";
import { eq, and, inArray as drizzleInArray, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { SQL } from "drizzle-orm";

// For TypeScript compatibility
declare module "express-session" {
  interface SessionStore {
    // Just the minimal interface needed
    on(event: string, callback: (...args: any[]) => void): this;
  }
}

import {
  users,
  employerProfiles,
  jobPostings,
  jobseekerProfiles,
  jobseekerPreferences,
  matches,
  jobInterests,
  messages,
  type User,
  type InsertUser,
  type EmployerProfile,
  type InsertEmployerProfile,
  type JobPosting,
  type InsertJobPosting,
  type JobseekerProfile,
  type InsertJobseekerProfile,
  type JobseekerPreferences,
  type InsertJobseekerPreferences,
  type Match,
  type InsertMatch,
  type JobInterest,
  type InsertJobInterest,
  type Message,
  type InsertMessage,
} from "@shared/schema";
import { IStorage } from "./storage";

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    // Create session store using the PostgreSQL connection pool
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Employer Profiles
  async getEmployerProfile(id: number): Promise<EmployerProfile | undefined> {
    const result = await db.select().from(employerProfiles).where(eq(employerProfiles.id, id));
    return result[0];
  }

  async getEmployerProfileByUserId(userId: number): Promise<EmployerProfile | undefined> {
    const result = await db.select().from(employerProfiles).where(eq(employerProfiles.userId, userId));
    return result[0];
  }

  async createEmployerProfile(profile: InsertEmployerProfile): Promise<EmployerProfile> {
    const result = await db.insert(employerProfiles).values(profile).returning();
    return result[0];
  }

  // Job Postings
  async getJobPosting(id: number): Promise<JobPosting | undefined> {
    const result = await db.select().from(jobPostings).where(eq(jobPostings.id, id));
    return result[0];
  }

  async getJobPostingsByEmployerId(employerId: number): Promise<JobPosting[]> {
    return await db.select().from(jobPostings).where(eq(jobPostings.employerId, employerId));
  }

  async createJobPosting(posting: InsertJobPosting): Promise<JobPosting> {
    const result = await db.insert(jobPostings).values(posting).returning();
    return result[0];
  }

  // Jobseeker Profiles
  async getJobseekerProfile(id: number): Promise<JobseekerProfile | undefined> {
    const result = await db.select().from(jobseekerProfiles).where(eq(jobseekerProfiles.id, id));
    return result[0];
  }

  async getJobseekerProfileByUserId(userId: number): Promise<JobseekerProfile | undefined> {
    const result = await db.select().from(jobseekerProfiles).where(eq(jobseekerProfiles.userId, userId));
    return result[0];
  }

  async createJobseekerProfile(profile: InsertJobseekerProfile): Promise<JobseekerProfile> {
    const result = await db.insert(jobseekerProfiles).values(profile).returning();
    return result[0];
  }

  // Jobseeker Preferences
  async getJobseekerPreferences(id: number): Promise<JobseekerPreferences | undefined> {
    const result = await db.select().from(jobseekerPreferences).where(eq(jobseekerPreferences.id, id));
    return result[0];
  }

  async getJobseekerPreferencesByJobseekerId(jobseekerId: number): Promise<JobseekerPreferences | undefined> {
    const result = await db.select().from(jobseekerPreferences).where(eq(jobseekerPreferences.jobseekerId, jobseekerId));
    return result[0];
  }

  async createJobseekerPreferences(preferences: InsertJobseekerPreferences): Promise<JobseekerPreferences> {
    const result = await db.insert(jobseekerPreferences).values(preferences).returning();
    return result[0];
  }

  // Match Feed
  async getJobseekersForEmployerMatchFeed(employerId: number): Promise<(JobseekerProfile & { preferences?: JobseekerPreferences })[]> {
    // Get all jobseekers that haven't been matched with this employer yet
    const existingMatches = await db
      .select({ jobseekerId: matches.jobseekerId })
      .from(matches)
      .where(eq(matches.employerId, employerId));

    const existingJobseekerIds = existingMatches.map(m => m.jobseekerId);

    // Get all jobseeker profiles
    let query = db.select().from(jobseekerProfiles);
    
    if (existingJobseekerIds.length > 0) {
      // Exclude already matched jobseekers
      query = query.where(
        sql`${jobseekerProfiles.id} NOT IN (${existingJobseekerIds.join(', ')})`
      );
    }
    
    const jobseekerProfilesData = await query;

    // For each jobseeker profile, get their preferences
    const results = await Promise.all(
      jobseekerProfilesData.map(async (profile: JobseekerProfile) => {
        const preferences = await this.getJobseekerPreferencesByJobseekerId(profile.id);
        return {
          ...profile,
          preferences,
        };
      })
    );

    return results;
  }

  async getEmployersForJobseekerMatchFeed(jobseekerId: number): Promise<(EmployerProfile & { jobPostings: JobPosting[] })[]> {
    // Get all employers that haven't been matched with this jobseeker yet
    const existingMatches = await db
      .select({ employerId: matches.employerId })
      .from(matches)
      .where(eq(matches.jobseekerId, jobseekerId));

    const existingEmployerIds = existingMatches.map(m => m.employerId);

    // Get all employer profiles
    let query = db.select().from(employerProfiles);
    
    if (existingEmployerIds.length > 0) {
      // Exclude already matched employers
      query = query.where(
        sql`${employerProfiles.id} NOT IN (${existingEmployerIds.join(', ')})`
      );
    }
    
    const employerProfilesData = await query;

    // For each employer profile, get their job postings
    const results = await Promise.all(
      employerProfilesData.map(async (profile: EmployerProfile) => {
        const jobPostings = await this.getJobPostingsByEmployerId(profile.id);
        return {
          ...profile,
          jobPostings,
        };
      })
    );

    return results;
  }

  // Matches
  async updateEmployerMatchStatus(employerId: number, jobseekerId: number, status: string): Promise<Match> {
    // Try to find existing match
    const existingMatches = await db
      .select()
      .from(matches)
      .where(
        and(
          eq(matches.employerId, employerId),
          eq(matches.jobseekerId, jobseekerId)
        )
      );

    if (existingMatches.length > 0) {
      // Update existing match
      const [match] = await db
        .update(matches)
        .set({ employerStatus: status })
        .where(eq(matches.id, existingMatches[0].id))
        .returning();
      
      // If both sides are matched, update matchedAt timestamp
      if (match.employerStatus === 'matched' && match.jobseekerStatus === 'matched') {
        const [updatedMatch] = await db
          .update(matches)
          .set({ matchedAt: new Date() })
          .where(eq(matches.id, match.id))
          .returning();
        
        return updatedMatch;
      }
      
      return match;
    } else {
      // Create new match
      const [match] = await db
        .insert(matches)
        .values({
          employerId,
          jobseekerId,
          employerStatus: status,
          jobseekerStatus: 'pending',
        })
        .returning();
      
      return match;
    }
  }

  async updateJobseekerMatchStatus(jobseekerId: number, employerId: number, status: string): Promise<Match> {
    // Try to find existing match
    const existingMatches = await db
      .select()
      .from(matches)
      .where(
        and(
          eq(matches.employerId, employerId),
          eq(matches.jobseekerId, jobseekerId)
        )
      );

    if (existingMatches.length > 0) {
      // Update existing match
      const [match] = await db
        .update(matches)
        .set({ jobseekerStatus: status })
        .where(eq(matches.id, existingMatches[0].id))
        .returning();
      
      // If both sides are matched, update matchedAt timestamp
      if (match.employerStatus === 'matched' && match.jobseekerStatus === 'matched') {
        const [updatedMatch] = await db
          .update(matches)
          .set({ matchedAt: new Date() })
          .where(eq(matches.id, match.id))
          .returning();
        
        return updatedMatch;
      }
      
      return match;
    } else {
      // Create new match
      const [match] = await db
        .insert(matches)
        .values({
          employerId,
          jobseekerId,
          employerStatus: 'pending',
          jobseekerStatus: status,
        })
        .returning();
      
      return match;
    }
  }

  async getMatchById(id: number): Promise<Match | undefined> {
    const result = await db.select().from(matches).where(eq(matches.id, id));
    return result[0];
  }

  async getMatchesByEmployerId(employerId: number): Promise<Match[]> {
    return await db.select().from(matches).where(eq(matches.employerId, employerId));
  }

  async getMatchesByJobseekerId(jobseekerId: number): Promise<Match[]> {
    return await db.select().from(matches).where(eq(matches.jobseekerId, jobseekerId));
  }

  async verifyUserInMatch(userId: number, matchId: number): Promise<boolean> {
    // Get the match
    const match = await this.getMatchById(matchId);
    if (!match) return false;

    // Get the employer and jobseeker profiles
    const employerProfile = await this.getEmployerProfile(match.employerId);
    const jobseekerProfile = await this.getJobseekerProfile(match.jobseekerId);

    // Check if the user is either the employer or the jobseeker
    return !!(employerProfile?.userId === userId || jobseekerProfile?.userId === userId);
  }

  // Job Interests
  async updateJobInterestStatus(matchId: number, jobId: number, status: string): Promise<JobInterest> {
    // Try to find existing job interest
    const existingInterests = await db
      .select()
      .from(jobInterests)
      .where(
        and(
          eq(jobInterests.matchId, matchId),
          eq(jobInterests.jobId, jobId)
        )
      );

    if (existingInterests.length > 0) {
      // Update existing job interest
      const [interest] = await db
        .update(jobInterests)
        .set({ status })
        .where(eq(jobInterests.id, existingInterests[0].id))
        .returning();
      
      return interest;
    } else {
      // Create new job interest
      const [interest] = await db
        .insert(jobInterests)
        .values({
          matchId,
          jobId,
          status,
        })
        .returning();
      
      return interest;
    }
  }

  async getJobInterestsByMatchId(matchId: number): Promise<JobInterest[]> {
    return await db.select().from(jobInterests).where(eq(jobInterests.matchId, matchId));
  }

  // Messages
  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async getMessagesByMatchId(matchId: number): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.matchId, matchId))
      .orderBy(messages.createdAt);
  }
}