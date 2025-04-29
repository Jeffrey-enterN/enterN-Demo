import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, UserRoleEnum } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

// Add passport to session type
declare module 'express-session' {
  interface Session {
    passport?: {
      user: number;
    };
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Using the default in-memory store for simplicity
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "enterN-secret-key",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: 'lax',
      path: '/'
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !(await comparePasswords(password, user.password))) {
            return done(null, false);
          } else {
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      },
    ),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { email, password, role } = req.body;

      // Basic validation
      if (!email || !password || !role) {
        return res.status(400).json({ message: "Email, password, and role are required" });
      }

      // Check if role is valid
      if (![UserRoleEnum.EMPLOYER, UserRoleEnum.JOBSEEKER].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const user = await storage.createUser({
        email,
        password: await hashPassword(password),
        role,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        return res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    console.log("Login attempt for:", req.body.email);
    
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("Authentication error:", err);
        return next(err);
      }
      
      if (!user) {
        console.log("Authentication failed: Invalid credentials");
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      console.log("User authenticated successfully:", user.email);
      
      req.login(user, (err) => {
        if (err) {
          console.error("Session error:", err);
          return next(err);
        }
        
        // Force session save to ensure it's stored before responding
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
            return next(err);
          }
          
          console.log("Session saved successfully");
          console.log("Session established, user ID in session:", req.session.passport?.user);
          console.log("Authentication state:", req.isAuthenticated());
          
          // Set a custom cookie as a backup
          res.cookie('user_logged_in', 'true', { 
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false
          });
          
          // Set another cookie with basic user info (non-sensitive)
          res.cookie('user_info', JSON.stringify({
            id: user.id,
            role: user.role
          }), { 
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false
          });
          
          return res.status(200).json(user);
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    console.log("Logout request received");
    
    // Destroy the session completely
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return next(err);
      }
      
      // Clear the cookie
      res.clearCookie('connect.sid');
      console.log("Session destroyed and cookie cleared");
      
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    console.log("/api/user called, authenticated:", req.isAuthenticated());
    console.log("Session data:", req.session);
    
    if (!req.isAuthenticated()) {
      console.log("User not authenticated, returning 401");
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    console.log("User authenticated, returning user data:", req.user?.email);
    res.json(req.user);
  });
}
