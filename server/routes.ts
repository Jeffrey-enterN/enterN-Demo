import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Employer Profile Routes
  app.post("/api/employer/profile", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "employer") return res.status(403).json({ message: "Forbidden" });
      
      const employerProfile = await storage.createEmployerProfile({
        ...req.body,
        userId: req.user.id,
      });
      
      res.status(201).json(employerProfile);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/employer/profile", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "employer") return res.status(403).json({ message: "Forbidden" });
      
      const employerProfile = await storage.getEmployerProfileByUserId(req.user.id);
      if (!employerProfile) {
        return res.status(404).json({ message: "Employer profile not found" });
      }
      
      res.json(employerProfile);
    } catch (error) {
      next(error);
    }
  });

  // Job Posting Routes
  app.post("/api/job-postings", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "employer") return res.status(403).json({ message: "Forbidden" });
      
      const employerProfile = await storage.getEmployerProfileByUserId(req.user.id);
      if (!employerProfile) {
        return res.status(404).json({ message: "Employer profile not found" });
      }
      
      const jobPosting = await storage.createJobPosting({
        ...req.body,
        employerId: employerProfile.id,
      });
      
      res.status(201).json(jobPosting);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/job-postings", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "employer") return res.status(403).json({ message: "Forbidden" });
      
      const employerProfile = await storage.getEmployerProfileByUserId(req.user.id);
      if (!employerProfile) {
        return res.status(404).json({ message: "Employer profile not found" });
      }
      
      const jobPostings = await storage.getJobPostingsByEmployerId(employerProfile.id);
      res.json(jobPostings);
    } catch (error) {
      next(error);
    }
  });

  // Jobseeker Profile Routes
  app.post("/api/jobseeker/profile", async (req, res, next) => {
    try {
      console.log("Received POST to /api/jobseeker/profile with body:", req.body);
      
      if (!req.isAuthenticated()) {
        console.log("User not authenticated");
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      console.log("User authenticated:", req.user);
      
      if (req.user.role !== "jobseeker") {
        console.log("User is not a jobseeker, role:", req.user.role);
        return res.status(403).json({ message: "Forbidden" });
      }
      
      console.log("Creating jobseeker profile with user ID:", req.user.id);
      
      const profileData = {
        ...req.body,
        userId: req.user.id,
      };
      
      console.log("Profile data to save:", profileData);
      
      const jobseekerProfile = await storage.createJobseekerProfile(profileData);
      
      console.log("Created jobseeker profile:", jobseekerProfile);
      
      res.status(201).json(jobseekerProfile);
    } catch (error) {
      console.error("Error creating jobseeker profile:", error);
      next(error);
    }
  });

  app.get("/api/jobseeker/profile", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "jobseeker") return res.status(403).json({ message: "Forbidden" });
      
      const jobseekerProfile = await storage.getJobseekerProfileByUserId(req.user.id);
      if (!jobseekerProfile) {
        return res.status(404).json({ message: "Jobseeker profile not found" });
      }
      
      res.json(jobseekerProfile);
    } catch (error) {
      next(error);
    }
  });

  // Jobseeker Preferences Routes
  app.post("/api/jobseeker/preferences", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "jobseeker") return res.status(403).json({ message: "Forbidden" });
      
      const jobseekerProfile = await storage.getJobseekerProfileByUserId(req.user.id);
      if (!jobseekerProfile) {
        return res.status(404).json({ message: "Jobseeker profile not found" });
      }
      
      const preferences = await storage.createJobseekerPreferences({
        jobseekerId: jobseekerProfile.id,
        preferences: req.body.preferences,
      });
      
      res.status(201).json(preferences);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/jobseeker/preferences", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "jobseeker") return res.status(403).json({ message: "Forbidden" });
      
      const jobseekerProfile = await storage.getJobseekerProfileByUserId(req.user.id);
      if (!jobseekerProfile) {
        return res.status(404).json({ message: "Jobseeker profile not found" });
      }
      
      const preferences = await storage.getJobseekerPreferencesByJobseekerId(jobseekerProfile.id);
      res.json(preferences);
    } catch (error) {
      next(error);
    }
  });

  // Match Feed Routes
  app.get("/api/employer/match-feed", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "employer") return res.status(403).json({ message: "Forbidden" });
      
      const employerProfile = await storage.getEmployerProfileByUserId(req.user.id);
      if (!employerProfile) {
        return res.status(404).json({ message: "Employer profile not found" });
      }
      
      const jobseekers = await storage.getJobseekersForEmployerMatchFeed(employerProfile.id);
      res.json(jobseekers);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/jobseeker/match-feed", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "jobseeker") return res.status(403).json({ message: "Forbidden" });
      
      const jobseekerProfile = await storage.getJobseekerProfileByUserId(req.user.id);
      if (!jobseekerProfile) {
        return res.status(404).json({ message: "Jobseeker profile not found" });
      }
      
      const employers = await storage.getEmployersForJobseekerMatchFeed(jobseekerProfile.id);
      res.json(employers);
    } catch (error) {
      next(error);
    }
  });

  // Employer Analytics Route
  app.get("/api/employer/analytics", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "employer") return res.status(403).json({ message: "Forbidden" });
      
      const employerProfile = await storage.getEmployerProfileByUserId(req.user.id);
      if (!employerProfile) {
        return res.status(404).json({ message: "Employer profile not found" });
      }
      
      // Get all matches for this employer
      const matches = await storage.getMatchesByEmployerId(employerProfile.id);
      
      // Count total, yes, and no matches
      const totalMatches = matches.length;
      const yesMatches = matches.filter(match => match.jobseekerStatus === 'matched').length;
      const noMatches = matches.filter(match => match.jobseekerStatus === 'rejected').length;
      const pendingMatches = totalMatches - yesMatches - noMatches;
      
      // Calculate yes:no ratio
      const ratio = noMatches > 0 ? (yesMatches / noMatches).toFixed(2) : yesMatches > 0 ? "∞" : "0";
      
      res.json({
        totalSwipes: totalMatches,
        yesSwipes: yesMatches,
        noSwipes: noMatches,
        pendingSwipes: pendingMatches,
        yesToNoRatio: ratio
      });
    } catch (error) {
      next(error);
    }
  });
  
  // Jobseeker Analytics Route
  app.get("/api/jobseeker/analytics", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "jobseeker") return res.status(403).json({ message: "Forbidden" });
      
      const jobseekerProfile = await storage.getJobseekerProfileByUserId(req.user.id);
      if (!jobseekerProfile) {
        return res.status(404).json({ message: "Jobseeker profile not found" });
      }
      
      // Get all matches for this jobseeker
      const matches = await storage.getMatchesByJobseekerId(jobseekerProfile.id);
      
      // Count employer swipes
      const totalMatches = matches.length;
      const yesMatches = matches.filter(match => match.employerStatus === 'matched').length;
      const noMatches = matches.filter(match => match.employerStatus === 'rejected').length;
      const pendingMatches = totalMatches - yesMatches - noMatches;
      
      // Count jobseeker swipes
      const totalSwipes = matches.length;
      const yesSwipes = matches.filter(match => match.jobseekerStatus === 'matched').length;
      const noSwipes = matches.filter(match => match.jobseekerStatus === 'rejected').length;
      const pendingSwipes = totalSwipes - yesSwipes - noSwipes;
      
      // Count mutual matches (where both sides matched)
      const mutualMatches = matches.filter(match => 
        match.employerStatus === 'matched' && match.jobseekerStatus === 'matched'
      ).length;
      
      // Get all job interests for this jobseeker's matches
      const jobInterests = await Promise.all(
        matches
          .filter(match => match.matchedAt !== null) // Only consider completed matches
          .map(async match => {
            return await storage.getJobInterestsByMatchId(match.id);
          })
      );
      
      // Flatten the array of arrays
      const flatJobInterests = jobInterests.flat();
      
      // Count job reviews
      const totalJobReviews = flatJobInterests.length;
      const interestedJobs = flatJobInterests.filter(interest => interest.status === 'interested').length;
      const notInterestedJobs = flatJobInterests.filter(interest => interest.status === 'not_interested').length;
      const pendingJobs = totalJobReviews - interestedJobs - notInterestedJobs;
      
      res.json({
        swipes: {
          total: totalSwipes,
          yes: yesSwipes,
          no: noSwipes,
          pending: pendingSwipes
        },
        matches: {
          total: mutualMatches
        },
        jobReviews: {
          total: totalJobReviews,
          interested: interestedJobs,
          notInterested: notInterestedJobs,
          pending: pendingJobs
        }
      });
    } catch (error) {
      next(error);
    }
  });

  // Match Routes
  app.post("/api/employer/match", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "employer") return res.status(403).json({ message: "Forbidden" });
      
      const { jobseekerId, status } = req.body;
      
      const employerProfile = await storage.getEmployerProfileByUserId(req.user.id);
      if (!employerProfile) {
        return res.status(404).json({ message: "Employer profile not found" });
      }
      
      const match = await storage.updateEmployerMatchStatus(employerProfile.id, jobseekerId, status);
      res.json(match);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/jobseeker/match", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "jobseeker") return res.status(403).json({ message: "Forbidden" });
      
      const { employerId, status } = req.body;
      
      const jobseekerProfile = await storage.getJobseekerProfileByUserId(req.user.id);
      if (!jobseekerProfile) {
        return res.status(404).json({ message: "Jobseeker profile not found" });
      }
      
      const match = await storage.updateJobseekerMatchStatus(jobseekerProfile.id, employerId, status);
      res.json(match);
    } catch (error) {
      next(error);
    }
  });

  // Job Interest Routes
  app.post("/api/job-interest", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const { matchId, jobId, status } = req.body;
      
      // Verify that the user is a part of this match
      const userIsPartOfMatch = await storage.verifyUserInMatch(req.user.id, matchId);
      if (!userIsPartOfMatch) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const jobInterest = await storage.updateJobInterestStatus(matchId, jobId, status);
      res.json(jobInterest);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/job-interests/:matchId", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const matchId = parseInt(req.params.matchId);
      
      // Verify that the user is a part of this match
      const userIsPartOfMatch = await storage.verifyUserInMatch(req.user.id, matchId);
      if (!userIsPartOfMatch) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const jobInterests = await storage.getJobInterestsByMatchId(matchId);
      res.json(jobInterests);
    } catch (error) {
      next(error);
    }
  });

  // Match Routes for Employer
  app.get("/api/employer/matches", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "employer") return res.status(403).json({ message: "Forbidden" });
      
      const employerProfile = await storage.getEmployerProfileByUserId(req.user.id);
      if (!employerProfile) {
        return res.status(404).json({ message: "Employer profile not found" });
      }
      
      const matches = await storage.getMatchesByEmployerId(employerProfile.id);
      res.json(matches);
    } catch (error) {
      next(error);
    }
  });
  
  // Match Routes for Jobseeker
  app.get("/api/jobseeker/matches", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      if (req.user.role !== "jobseeker") return res.status(403).json({ message: "Forbidden" });
      
      const jobseekerProfile = await storage.getJobseekerProfileByUserId(req.user.id);
      if (!jobseekerProfile) {
        return res.status(404).json({ message: "Jobseeker profile not found" });
      }
      
      const matches = await storage.getMatchesByJobseekerId(jobseekerProfile.id);
      res.json(matches);
    } catch (error) {
      next(error);
    }
  });
  
  // Message Routes
  app.post("/api/messages/:matchId", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const matchId = parseInt(req.params.matchId);
      const { content } = req.body;
      
      // Verify that the user is a part of this match
      const userIsPartOfMatch = await storage.verifyUserInMatch(req.user.id, matchId);
      if (!userIsPartOfMatch) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const message = await storage.createMessage({
        matchId,
        senderId: req.user.id,
        content,
      });
      
      res.status(201).json(message);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/messages/:matchId", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
      
      const matchId = parseInt(req.params.matchId);
      
      // Verify that the user is a part of this match
      const userIsPartOfMatch = await storage.verifyUserInMatch(req.user.id, matchId);
      if (!userIsPartOfMatch) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const messages = await storage.getMessagesByMatchId(matchId);
      res.json(messages);
    } catch (error) {
      next(error);
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
