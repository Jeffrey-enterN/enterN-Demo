// Sample matches for demo purposes

// Matches for employers (when viewing jobseeker matches)
export const sampleEmployerMatches = [
  {
    id: 1,
    userId: 101,
    name: "Alex Johnson",
    position: "Software Engineer",
    matchId: 1001,
    matchDate: "2025-04-01T10:30:00Z",
    recentMessage: "Looking forward to hearing more about the position!",
    hasUnreadMessages: true,
  },
  {
    id: 2,
    userId: 102,
    name: "Taylor Smith",
    position: "UX Designer",
    matchId: 1002,
    matchDate: "2025-03-30T14:45:00Z",
    recentMessage: "When would be a good time to schedule a call?",
    hasUnreadMessages: false,
  },
  {
    id: 3,
    userId: 103,
    name: "Jordan Williams",
    position: "Data Scientist",
    matchId: 1003,
    matchDate: "2025-03-28T09:15:00Z",
    hasUnreadMessages: false,
  },
  {
    id: 4,
    userId: 104,
    name: "Casey Martinez",
    position: "Product Manager",
    matchId: 1004,
    matchDate: "2025-03-25T16:20:00Z",
    recentMessage: "I'd love to learn more about your company culture.",
    hasUnreadMessages: false,
  },
];

// Matches for jobseekers (when viewing employer matches)
export const sampleJobseekerMatches = [
  {
    id: 11,
    userId: 201,
    name: "TechNova",
    company: "Software Development",
    matchId: 2001,
    matchDate: "2025-04-02T11:30:00Z",
    recentMessage: "We were impressed with your portfolio and would like to discuss potential opportunities.",
    hasUnreadMessages: true,
  },
  {
    id: 12,
    userId: 202,
    name: "GreenEarth Solutions",
    company: "Environmental Consulting",
    matchId: 2002,
    matchDate: "2025-03-31T15:45:00Z",
    hasUnreadMessages: false,
  },
  {
    id: 13,
    userId: 203,
    name: "Caterpillar",
    company: "Heavy Equipment Manufacturing",
    matchId: 2003,
    matchDate: "2025-03-29T10:15:00Z",
    recentMessage: "Would you be interested in an interview next week?",
    hasUnreadMessages: true,
  },
];

// For demo: matches that become available after swiping
export const demoNewMatches = {
  // Key is the employer ID from sample-employers.ts
  "9": {  // Caterpillar
    id: 9,
    userId: 209,
    name: "Caterpillar",
    company: "Heavy Equipment Manufacturing",
    matchId: 3001,
    matchDate: new Date().toISOString(),
    hasUnreadMessages: false,
  },
  "10": {  // OSF HealthCare
    id: 10,
    userId: 210,
    name: "OSF HealthCare",
    company: "Healthcare Services",
    matchId: 3002,
    matchDate: new Date().toISOString(),
    hasUnreadMessages: false,
  },
  "11": {  // SKB Cyber
    id: 11,
    userId: 211,
    name: "SKB Cyber",
    company: "Cybersecurity",
    matchId: 3003,
    matchDate: new Date().toISOString(),
    hasUnreadMessages: false,
  },
};