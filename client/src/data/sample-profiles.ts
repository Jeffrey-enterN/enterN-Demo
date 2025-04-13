// Sample data for jobseeker profiles with preferences
export const sampleJobseekers = [
  {
    id: 1,
    userId: 101,
    school: "University of Technology",
    major: "Computer Science",
    degreeLevel: "Bachelor's",
    graduationYear: 2024,
    preferredIndustries: ["Software Development", "Data Science", "Cloud Computing"],
    summary: "Passionate about software development with focus on backend systems and cloud architecture.",
    preferences: {
      id: 1,
      jobseekerId: 1,
      preferences: {
        // Mission & Vision
        purposeVsProfit: 4,
        innovationVsTradition: 8,
        diversityVsPerformance: 6,
        cooperativeVsCompetitive: 3,
        socialResponsibilityVsPragmatism: 6,
        
        // Work Style Preferences
        logicalVsIntuitive: 7,
        structureVsAmbiguity: 5,
        focusVsMultitasking: 4,
        deadlinesVsFlexibility: 6,
        planningVsAdaptability: 7,
        
        // Preferred Style for Supervisor
        handsOnVsHandsOff: 4,
        directVsDiplomatic: 6,
        professionalVsCasual: 7,
        frequentVsInfrequentFeedback: 8,
        fixedVsFlexibleHours: 9,
        
        // Preferred Work Environment
        officeVsRemote: 8,
        openVsEnclosed: 6,
        formalVsInformal: 7,
        quietVsEnergetic: 5,
        smallTeamVsLargeTeam: 4,
        
        // Preferred Collaboration Styles
        independentVsCollaborative: 6,
        specialistVsGeneralist: 7,
        writtenVsVerbalCommunication: 5,
        projectVsTaskFocus: 6,
        leaderVsSupporter: 4,
        
        // Growth & Development Goals
        technicalVsLeadership: 7,
        depthVsBreadth: 8,
        onTheJobVsFormalTraining: 6,
        mentorshipVsIndependentGrowth: 7,
        internalVsExternalPrograms: 5,
        mentorshipImportance: 8,
        recognitionStyle: 6,
        problemSolvingApproach: 8,
        paceOfWork: 7,
        adaptabilityRequirement: 8
      }
    }
  },
  {
    id: 2,
    userId: 102,
    school: "Design Institute",
    major: "User Experience Design",
    degreeLevel: "Master's",
    graduationYear: 2023,
    preferredIndustries: ["UX/UI Design", "Product Design", "Tech Startups"],
    summary: "UX designer focused on creating intuitive, accessible user experiences across web and mobile platforms.",
    preferences: {
      id: 2,
      jobseekerId: 2,
      preferences: {
        // Mission & Vision
        purposeVsProfit: 7,
        innovationVsTradition: 9,
        diversityVsPerformance: 8,
        cooperativeVsCompetitive: 2,
        socialResponsibilityVsPragmatism: 7,
        
        // Work Style Preferences
        logicalVsIntuitive: 8,
        structureVsAmbiguity: 9,
        focusVsMultitasking: 3,
        deadlinesVsFlexibility: 6,
        planningVsAdaptability: 8,
        
        // Preferred Style for Supervisor
        handsOnVsHandsOff: 8,
        directVsDiplomatic: 5,
        professionalVsCasual: 8,
        frequentVsInfrequentFeedback: 9,
        fixedVsFlexibleHours: 7,
        
        // Preferred Work Environment
        officeVsRemote: 9,
        openVsEnclosed: 8,
        formalVsInformal: 8,
        quietVsEnergetic: 4,
        smallTeamVsLargeTeam: 2,
        
        // Preferred Collaboration Styles
        independentVsCollaborative: 4,
        specialistVsGeneralist: 3,
        writtenVsVerbalCommunication: 7,
        projectVsTaskFocus: 8,
        leaderVsSupporter: 3,
        
        // Growth & Development Goals
        technicalVsLeadership: 4,
        depthVsBreadth: 3,
        onTheJobVsFormalTraining: 5,
        mentorshipVsIndependentGrowth: 7,
        internalVsExternalPrograms: 8
      }
    }
  },
  {
    id: 3,
    userId: 103,
    school: "Business Academy",
    major: "Marketing",
    degreeLevel: "Bachelor's",
    graduationYear: 2023,
    preferredIndustries: ["Digital Marketing", "E-commerce", "Consumer Tech"],
    summary: "Growth-focused marketing professional with expertise in digital campaigns and analytics.",
    preferences: {
      id: 3,
      jobseekerId: 3,
      preferences: {
        remoteWork: 6,
        organizationSize: 7,
        growthTrajectory: 8,
        workLifeBalance: 7,
        communicationStyle: 8,
        feedbackFrequency: 7,
        decisionMaking: 6,
        riskTolerance: 7,
        teamDynamics: 8,
        learningStyle: 5,
        workStructure: 6,
        innovationFocus: 7,
        companyStability: 7,
        travelRequirements: 6,
        compensationPreference: 8,
        mentorshipImportance: 7,
        recognitionStyle: 8,
        problemSolvingApproach: 6,
        paceOfWork: 7,
        adaptabilityRequirement: 6
      }
    }
  },
  {
    id: 4,
    userId: 104,
    school: "Engineering University",
    major: "Data Science",
    degreeLevel: "PhD",
    graduationYear: 2024,
    preferredIndustries: ["AI/Machine Learning", "Research", "FinTech"],
    summary: "Data scientist with research focus on machine learning algorithms and predictive modeling.",
    preferences: {
      id: 4,
      jobseekerId: 4,
      preferences: {
        remoteWork: 7,
        organizationSize: 6,
        growthTrajectory: 4,
        workLifeBalance: 6,
        communicationStyle: 3,
        feedbackFrequency: 5,
        decisionMaking: 3,
        riskTolerance: 5,
        teamDynamics: 4,
        learningStyle: 2,
        workStructure: 4,
        innovationFocus: 8,
        companyStability: 7,
        travelRequirements: 4,
        compensationPreference: 8,
        mentorshipImportance: 4,
        recognitionStyle: 3,
        problemSolvingApproach: 2,
        paceOfWork: 5,
        adaptabilityRequirement: 6
      }
    }
  },
  {
    id: 5,
    userId: 105,
    school: "Business School",
    major: "Project Management",
    degreeLevel: "Master's",
    graduationYear: 2022,
    preferredIndustries: ["Project Management", "Consulting", "Tech Implementation"],
    summary: "Certified project manager with experience delivering complex technology projects across industries.",
    preferences: {
      id: 5,
      jobseekerId: 5,
      preferences: {
        remoteWork: 5,
        organizationSize: 8,
        growthTrajectory: 7,
        workLifeBalance: 6,
        communicationStyle: 8,
        feedbackFrequency: 7,
        decisionMaking: 8,
        riskTolerance: 5,
        teamDynamics: 9,
        learningStyle: 6,
        workStructure: 8,
        innovationFocus: 6,
        companyStability: 8,
        travelRequirements: 7,
        compensationPreference: 7,
        mentorshipImportance: 6,
        recognitionStyle: 7,
        problemSolvingApproach: 8,
        paceOfWork: 7,
        adaptabilityRequirement: 7
      }
    }
  },
  {
    id: 6,
    userId: 106,
    school: "Creative Arts College",
    major: "Game Design",
    degreeLevel: "Bachelor's",
    graduationYear: 2023,
    preferredIndustries: ["Game Development", "Interactive Media", "Entertainment Tech"],
    summary: "Game designer and developer with skills in Unity and UX/UI for interactive experiences.",
    preferences: {
      id: 6,
      jobseekerId: 6,
      preferences: {
        remoteWork: 7,
        organizationSize: 4,
        growthTrajectory: 6,
        workLifeBalance: 7,
        communicationStyle: 6,
        feedbackFrequency: 7,
        decisionMaking: 5,
        riskTolerance: 8,
        teamDynamics: 9,
        learningStyle: 7,
        workStructure: 5,
        innovationFocus: 9,
        companyStability: 5,
        travelRequirements: 4,
        compensationPreference: 7,
        mentorshipImportance: 8,
        recognitionStyle: 7,
        problemSolvingApproach: 8,
        paceOfWork: 8,
        adaptabilityRequirement: 8
      }
    }
  },
  {
    id: 7,
    userId: 107,
    school: "Cloud Computing Institute",
    major: "Cloud Architecture",
    degreeLevel: "Master's",
    graduationYear: 2022,
    preferredIndustries: ["Cloud Services", "DevOps", "System Architecture"],
    summary: "Cloud architect with AWS certification and experience designing scalable infrastructure solutions.",
    preferences: {
      id: 7,
      jobseekerId: 7,
      preferences: {
        remoteWork: 9,
        organizationSize: 6,
        growthTrajectory: 7,
        workLifeBalance: 8,
        communicationStyle: 6,
        feedbackFrequency: 5,
        decisionMaking: 7,
        riskTolerance: 6,
        teamDynamics: 7,
        learningStyle: 8,
        workStructure: 6,
        innovationFocus: 8,
        companyStability: 7,
        travelRequirements: 3,
        compensationPreference: 9,
        mentorshipImportance: 6,
        recognitionStyle: 5,
        problemSolvingApproach: 8,
        paceOfWork: 7,
        adaptabilityRequirement: 7
      }
    }
  },
  {
    id: 8,
    userId: 108,
    school: "Cybersecurity Academy",
    major: "Information Security",
    degreeLevel: "Bachelor's",
    graduationYear: 2023,
    preferredIndustries: ["Cybersecurity", "FinTech", "Healthcare Tech"],
    summary: "Security specialist focused on threat detection and vulnerability management for enterprise systems.",
    preferences: {
      id: 8,
      jobseekerId: 8,
      preferences: {
        remoteWork: 6,
        organizationSize: 8,
        growthTrajectory: 6,
        workLifeBalance: 7,
        communicationStyle: 5,
        feedbackFrequency: 6,
        decisionMaking: 7,
        riskTolerance: 4,
        teamDynamics: 6,
        learningStyle: 7,
        workStructure: 8,
        innovationFocus: 6,
        companyStability: 9,
        travelRequirements: 4,
        compensationPreference: 8,
        mentorshipImportance: 7,
        recognitionStyle: 6,
        problemSolvingApproach: 8,
        paceOfWork: 7,
        adaptabilityRequirement: 6
      }
    }
  }
];