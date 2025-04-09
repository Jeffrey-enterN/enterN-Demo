import { 
  User, InsertUser, 
  EmployerProfile, InsertEmployerProfile, 
  JobPosting, InsertJobPosting, 
  JobseekerProfile, InsertJobseekerProfile, 
  JobseekerPreferences, InsertJobseekerPreferences,
  Match, 
  JobInterest, 
  Message, InsertMessage,
  MatchStatusEnum, InterestStatusEnum
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

// Memory store for session
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Sessions
  sessionStore: session.SessionStore;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Employer Profiles
  getEmployerProfile(id: number): Promise<EmployerProfile | undefined>;
  getEmployerProfileByUserId(userId: number): Promise<EmployerProfile | undefined>;
  createEmployerProfile(profile: InsertEmployerProfile): Promise<EmployerProfile>;

  // Job Postings
  getJobPosting(id: number): Promise<JobPosting | undefined>;
  getJobPostingsByEmployerId(employerId: number): Promise<JobPosting[]>;
  createJobPosting(posting: InsertJobPosting): Promise<JobPosting>;

  // Jobseeker Profiles
  getJobseekerProfile(id: number): Promise<JobseekerProfile | undefined>;
  getJobseekerProfileByUserId(userId: number): Promise<JobseekerProfile | undefined>;
  createJobseekerProfile(profile: InsertJobseekerProfile): Promise<JobseekerProfile>;

  // Jobseeker Preferences
  getJobseekerPreferences(id: number): Promise<JobseekerPreferences | undefined>;
  getJobseekerPreferencesByJobseekerId(jobseekerId: number): Promise<JobseekerPreferences | undefined>;
  createJobseekerPreferences(preferences: InsertJobseekerPreferences): Promise<JobseekerPreferences>;

  // Match Feed
  getJobseekersForEmployerMatchFeed(employerId: number): Promise<(JobseekerProfile & { preferences?: JobseekerPreferences })[]>;
  getEmployersForJobseekerMatchFeed(jobseekerId: number): Promise<(EmployerProfile & { jobPostings: JobPosting[] })[]>;

  // Matches
  updateEmployerMatchStatus(employerId: number, jobseekerId: number, status: string): Promise<Match>;
  updateJobseekerMatchStatus(jobseekerId: number, employerId: number, status: string): Promise<Match>;
  getMatchById(id: number): Promise<Match | undefined>;
  getMatchesByEmployerId(employerId: number): Promise<Match[]>;
  getMatchesByJobseekerId(jobseekerId: number): Promise<Match[]>;
  verifyUserInMatch(userId: number, matchId: number): Promise<boolean>;

  // Job Interests
  updateJobInterestStatus(matchId: number, jobId: number, status: string): Promise<JobInterest>;
  getJobInterestsByMatchId(matchId: number): Promise<JobInterest[]>;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByMatchId(matchId: number): Promise<Message[]>;
}

export class MemStorage implements IStorage {
  sessionStore: session.SessionStore;
  private users: Map<number, User>;
  private employerProfiles: Map<number, EmployerProfile>;
  private jobPostings: Map<number, JobPosting>;
  private jobseekerProfiles: Map<number, JobseekerProfile>;
  private jobseekerPreferences: Map<number, JobseekerPreferences>;
  private matches: Map<number, Match>;
  private jobInterests: Map<number, JobInterest>;
  private messages: Map<number, Message>;
  
  private userIdCounter: number;
  private employerProfileIdCounter: number;
  private jobPostingIdCounter: number;
  private jobseekerProfileIdCounter: number;
  private jobseekerPreferencesIdCounter: number;
  private matchIdCounter: number;
  private jobInterestIdCounter: number;
  private messageIdCounter: number;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    this.users = new Map();
    this.employerProfiles = new Map();
    this.jobPostings = new Map();
    this.jobseekerProfiles = new Map();
    this.jobseekerPreferences = new Map();
    this.matches = new Map();
    this.jobInterests = new Map();
    this.messages = new Map();
    
    this.userIdCounter = 1;
    this.employerProfileIdCounter = 1;
    this.jobPostingIdCounter = 1;
    this.jobseekerProfileIdCounter = 1;
    this.jobseekerPreferencesIdCounter = 1;
    this.matchIdCounter = 1;
    this.jobInterestIdCounter = 1;
    this.messageIdCounter = 1;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Employer Profiles
  async getEmployerProfile(id: number): Promise<EmployerProfile | undefined> {
    return this.employerProfiles.get(id);
  }

  async getEmployerProfileByUserId(userId: number): Promise<EmployerProfile | undefined> {
    return Array.from(this.employerProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async createEmployerProfile(profile: InsertEmployerProfile): Promise<EmployerProfile> {
    const id = this.employerProfileIdCounter++;
    const now = new Date();
    const employerProfile: EmployerProfile = {
      ...profile,
      id,
      superUser: true,
      createdAt: now
    };
    this.employerProfiles.set(id, employerProfile);
    return employerProfile;
  }

  // Job Postings
  async getJobPosting(id: number): Promise<JobPosting | undefined> {
    return this.jobPostings.get(id);
  }

  async getJobPostingsByEmployerId(employerId: number): Promise<JobPosting[]> {
    return Array.from(this.jobPostings.values()).filter(
      (posting) => posting.employerId === employerId,
    );
  }

  async createJobPosting(posting: InsertJobPosting): Promise<JobPosting> {
    const id = this.jobPostingIdCounter++;
    const now = new Date();
    const jobPosting: JobPosting = {
      ...posting,
      id,
      status: "open",
      createdAt: now
    };
    this.jobPostings.set(id, jobPosting);
    return jobPosting;
  }

  // Jobseeker Profiles
  async getJobseekerProfile(id: number): Promise<JobseekerProfile | undefined> {
    return this.jobseekerProfiles.get(id);
  }

  async getJobseekerProfileByUserId(userId: number): Promise<JobseekerProfile | undefined> {
    return Array.from(this.jobseekerProfiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async createJobseekerProfile(profile: InsertJobseekerProfile): Promise<JobseekerProfile> {
    const id = this.jobseekerProfileIdCounter++;
    const now = new Date();
    const jobseekerProfile: JobseekerProfile = {
      ...profile,
      id,
      createdAt: now
    };
    this.jobseekerProfiles.set(id, jobseekerProfile);
    return jobseekerProfile;
  }

  // Jobseeker Preferences
  async getJobseekerPreferences(id: number): Promise<JobseekerPreferences | undefined> {
    return this.jobseekerPreferences.get(id);
  }

  async getJobseekerPreferencesByJobseekerId(jobseekerId: number): Promise<JobseekerPreferences | undefined> {
    return Array.from(this.jobseekerPreferences.values()).find(
      (preferences) => preferences.jobseekerId === jobseekerId,
    );
  }

  async createJobseekerPreferences(preferences: InsertJobseekerPreferences): Promise<JobseekerPreferences> {
    const id = this.jobseekerPreferencesIdCounter++;
    const now = new Date();
    const jobseekerPreferences: JobseekerPreferences = {
      ...preferences,
      id,
      createdAt: now
    };
    this.jobseekerPreferences.set(id, jobseekerPreferences);
    return jobseekerPreferences;
  }

  // Match Feed
  async getJobseekersForEmployerMatchFeed(employerId: number): Promise<(JobseekerProfile & { preferences?: JobseekerPreferences })[]> {
    // In a real implementation, this would filter by matching algorithms, location, etc.
    // For the MVP, we'll return all jobseekers with their preferences
    const jobseekers = Array.from(this.jobseekerProfiles.values());
    
    return jobseekers.map(jobseeker => {
      const preferences = Array.from(this.jobseekerPreferences.values()).find(
        pref => pref.jobseekerId === jobseeker.id
      );
      
      return {
        ...jobseeker,
        preferences
      };
    });
  }

  async getEmployersForJobseekerMatchFeed(jobseekerId: number): Promise<(EmployerProfile & { jobPostings: JobPosting[] })[]> {
    // In a real implementation, this would filter by matching algorithms, location, etc.
    // For the MVP, we'll return all employers with their job postings
    const employers = Array.from(this.employerProfiles.values());
    
    return employers.map(employer => {
      const jobPostings = Array.from(this.jobPostings.values()).filter(
        posting => posting.employerId === employer.id
      );
      
      return {
        ...employer,
        jobPostings
      };
    });
  }

  // Matches
  async updateEmployerMatchStatus(employerId: number, jobseekerId: number, status: string): Promise<Match> {
    // First, check if a match already exists
    let match = Array.from(this.matches.values()).find(
      m => m.employerId === employerId && m.jobseekerId === jobseekerId
    );
    
    if (!match) {
      // If no match exists, create a new one
      const id = this.matchIdCounter++;
      const now = new Date();
      match = {
        id,
        employerId,
        jobseekerId,
        employerStatus: status as any,
        jobseekerStatus: MatchStatusEnum.PENDING,
        matchedAt: null,
        createdAt: now
      };
      this.matches.set(id, match);
    } else {
      // If a match exists, update the employer status
      match.employerStatus = status as any;
      
      // If both sides matched, update the matchedAt timestamp
      if (match.employerStatus === MatchStatusEnum.MATCHED && match.jobseekerStatus === MatchStatusEnum.MATCHED) {
        match.matchedAt = new Date();
      }
      
      this.matches.set(match.id, match);
    }
    
    return match;
  }

  async updateJobseekerMatchStatus(jobseekerId: number, employerId: number, status: string): Promise<Match> {
    // First, check if a match already exists
    let match = Array.from(this.matches.values()).find(
      m => m.employerId === employerId && m.jobseekerId === jobseekerId
    );
    
    if (!match) {
      // If no match exists, create a new one
      const id = this.matchIdCounter++;
      const now = new Date();
      match = {
        id,
        employerId,
        jobseekerId,
        employerStatus: MatchStatusEnum.PENDING,
        jobseekerStatus: status as any,
        matchedAt: null,
        createdAt: now
      };
      this.matches.set(id, match);
    } else {
      // If a match exists, update the jobseeker status
      match.jobseekerStatus = status as any;
      
      // If both sides matched, update the matchedAt timestamp
      if (match.employerStatus === MatchStatusEnum.MATCHED && match.jobseekerStatus === MatchStatusEnum.MATCHED) {
        match.matchedAt = new Date();
      }
      
      this.matches.set(match.id, match);
    }
    
    return match;
  }

  async getMatchById(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async getMatchesByEmployerId(employerId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      match => match.employerId === employerId
    );
  }

  async getMatchesByJobseekerId(jobseekerId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      match => match.jobseekerId === jobseekerId
    );
  }

  async verifyUserInMatch(userId: number, matchId: number): Promise<boolean> {
    const match = this.matches.get(matchId);
    if (!match) return false;
    
    const employerProfile = await this.getEmployerProfileByUserId(userId);
    const jobseekerProfile = await this.getJobseekerProfileByUserId(userId);
    
    return (
      (employerProfile && employerProfile.id === match.employerId) ||
      (jobseekerProfile && jobseekerProfile.id === match.jobseekerId)
    );
  }

  // Job Interests
  async updateJobInterestStatus(matchId: number, jobId: number, status: string): Promise<JobInterest> {
    // Check if job interest already exists
    let jobInterest = Array.from(this.jobInterests.values()).find(
      ji => ji.matchId === matchId && ji.jobId === jobId
    );
    
    if (!jobInterest) {
      // If no job interest exists, create a new one
      const id = this.jobInterestIdCounter++;
      const now = new Date();
      jobInterest = {
        id,
        matchId,
        jobId,
        status: status as any,
        createdAt: now
      };
      this.jobInterests.set(id, jobInterest);
    } else {
      // If a job interest exists, update the status
      jobInterest.status = status as any;
      this.jobInterests.set(jobInterest.id, jobInterest);
    }
    
    return jobInterest;
  }

  async getJobInterestsByMatchId(matchId: number): Promise<JobInterest[]> {
    return Array.from(this.jobInterests.values()).filter(
      jobInterest => jobInterest.matchId === matchId
    );
  }

  // Messages
  async createMessage(message: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const now = new Date();
    const newMessage: Message = {
      ...message,
      id,
      createdAt: now
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getMessagesByMatchId(matchId: number): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(message => message.matchId === matchId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }
}

export const storage = new MemStorage();
