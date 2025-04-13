// Sample data for employer profiles with job postings
export const sampleEmployers = [
  {
    id: 1,
    userId: 201,
    companyName: "TechNova",
    industry: "Software Development",
    companySize: "50-200",
    location: "San Francisco, CA",
    website: "https://technova.example.com",
    description: "TechNova is a cutting-edge software company specializing in AI-driven solutions for enterprise clients.",
    mission: "Our mission is to leverage artificial intelligence to solve complex business problems and drive digital transformation.",
    culture: "We foster a culture of innovation, continuous learning, and work-life balance. Our team members are encouraged to explore new ideas and challenge the status quo.",
    benefits: [
      "Competitive salary and equity options",
      "Flexible remote work policy",
      "Comprehensive health benefits",
      "Continuous education stipend",
      "Team retreats twice a year"
    ],
    jobPostings: [
      {
        id: 101,
        employerId: 1,
        title: "Senior Frontend Developer",
        description: "We're looking for an experienced frontend developer with React expertise to join our product team.",
        requirements: "5+ years of React experience, TypeScript proficiency, and experience with modern frontend architecture.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$140,000 - $180,000"
      },
      {
        id: 102,
        employerId: 1,
        title: "Machine Learning Engineer",
        description: "Join our AI team to develop cutting-edge machine learning models for our enterprise platform.",
        requirements: "Strong background in ML/AI, Python proficiency, and experience with modern ML frameworks.",
        employmentType: "FULL_TIME",
        locationType: "REMOTE",
        salary: "$150,000 - $190,000"
      }
    ]
  },
  {
    id: 2,
    userId: 202,
    companyName: "GreenEarth Solutions",
    industry: "Environmental Technology",
    companySize: "10-50",
    location: "Portland, OR",
    website: "https://greenearth.example.com",
    description: "GreenEarth Solutions develops innovative technologies to help businesses reduce their environmental impact.",
    mission: "We're on a mission to create a more sustainable future through accessible and effective environmental technologies.",
    culture: "Our collaborative culture values sustainability, innovation, and making a positive impact. We emphasize work-life balance and ethical business practices.",
    benefits: [
      "Competitive compensation",
      "4-day work week",
      "Comprehensive health and wellness benefits",
      "Paid volunteer time",
      "Company-wide sustainability initiatives"
    ],
    jobPostings: [
      {
        id: 201,
        employerId: 2,
        title: "Environmental Data Scientist",
        description: "Help us analyze environmental data to create insights for our sustainability platform.",
        requirements: "Background in data science, statistics, and environmental studies preferred.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$110,000 - $140,000"
      }
    ]
  },
  {
    id: 3,
    userId: 203,
    companyName: "FinEdge",
    industry: "Financial Technology",
    companySize: "200-500",
    location: "New York, NY",
    website: "https://finedge.example.com",
    description: "FinEdge is transforming financial services through innovative technology solutions.",
    mission: "Our mission is to democratize financial services and create products that empower individuals and businesses.",
    culture: "We have a fast-paced, results-oriented culture that values expertise, innovation, and customer focus.",
    benefits: [
      "Highly competitive salary and bonus structure",
      "Premium health and retirement benefits",
      "Professional development opportunities",
      "Fitness and wellness allowance",
      "Catered meals and premium office amenities"
    ],
    jobPostings: [
      {
        id: 301,
        employerId: 3,
        title: "Senior Backend Engineer",
        description: "Build robust, scalable systems for our financial technology platform.",
        requirements: "Experience with high-scale distributed systems, Node.js, and financial technology.",
        employmentType: "FULL_TIME",
        locationType: "ONSITE",
        salary: "$160,000 - $200,000"
      },
      {
        id: 302,
        employerId: 3,
        title: "Product Manager - Payments",
        description: "Lead our payments product strategy and roadmap.",
        requirements: "5+ years in product management, preferably in fintech or payments.",
        employmentType: "FULL_TIME",
        locationType: "ONSITE",
        salary: "$140,000 - $180,000"
      },
      {
        id: 303,
        employerId: 3,
        title: "Data Engineer",
        description: "Design and implement data pipelines for our analytics platform.",
        requirements: "Experience with big data technologies, ETL processes, and financial data.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$130,000 - $170,000"
      }
    ]
  },
  {
    id: 4,
    userId: 204,
    companyName: "HealthFirst",
    industry: "Healthcare Technology",
    companySize: "100-250",
    location: "Boston, MA",
    website: "https://healthfirst.example.com",
    description: "HealthFirst builds digital health solutions to improve patient care and healthcare operations.",
    mission: "We're committed to improving healthcare outcomes through innovative technology solutions.",
    culture: "Our mission-driven culture emphasizes impact, collaboration, and continuous improvement. We value work-life balance and making a difference.",
    benefits: [
      "Competitive compensation package",
      "Excellent healthcare benefits",
      "Flexible hybrid work arrangement",
      "Professional development stipend",
      "Generous PTO and parental leave"
    ],
    jobPostings: [
      {
        id: 401,
        employerId: 4,
        title: "Healthcare Software Developer",
        description: "Build innovative healthcare applications to improve patient care.",
        requirements: "Experience with healthcare applications, modern web frameworks, and HIPAA compliance.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$120,000 - $160,000"
      },
      {
        id: 402,
        employerId: 4,
        title: "UX Designer - Healthcare",
        description: "Design intuitive and accessible interfaces for healthcare providers and patients.",
        requirements: "Experience in UX design, preferably in healthcare or similar complex domains.",
        employmentType: "FULL_TIME",
        locationType: "REMOTE",
        salary: "$100,000 - $130,000"
      }
    ]
  },
  {
    id: 5,
    userId: 205,
    companyName: "CreativeCloud",
    industry: "Digital Media & Design",
    companySize: "25-100",
    location: "Los Angeles, CA",
    website: "https://creativecloud.example.com",
    description: "CreativeCloud provides innovative design and media tools for creative professionals.",
    mission: "We strive to empower creative individuals and teams with tools that bring their vision to life.",
    culture: "Our creative culture celebrates originality, craftsmanship, and artistic expression. We embrace flexibility and creative freedom.",
    benefits: [
      "Competitive salary",
      "Flexible work hours and location",
      "Creative project stipend",
      "Professional development opportunities",
      "Collaborative workspace and creative events"
    ],
    jobPostings: [
      {
        id: 501,
        employerId: 5,
        title: "UI/UX Designer",
        description: "Join our design team to create beautiful and intuitive user experiences.",
        requirements: "Strong portfolio showing UI/UX work, experience with design systems, and proficiency with design tools.",
        employmentType: "FULL_TIME",
        locationType: "REMOTE",
        salary: "$90,000 - $120,000"
      },
      {
        id: 502,
        employerId: 5,
        title: "Frontend Developer - Creative Tools",
        description: "Build interactive web-based creative tools using modern frontend technologies.",
        requirements: "Experience with interactive web applications, canvas/WebGL, and creative coding.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$100,000 - $140,000"
      }
    ]
  }
];