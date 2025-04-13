// Sample data for employer profiles with job postings
export const sampleEmployers = [
  // Expanded sample employers to enhance the demo experience
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
  },
  {
    id: 6,
    userId: 206,
    companyName: "DataFlow Systems",
    industry: "Data Analytics",
    companySize: "50-200",
    location: "Austin, TX",
    website: "https://dataflow.example.com",
    description: "DataFlow Systems helps businesses make data-driven decisions through advanced analytics solutions.",
    mission: "Our mission is to make data analytics accessible, actionable, and valuable for every organization.",
    culture: "We maintain a culture of intellectual curiosity, analytical thinking, and continuous learning. We believe in empowering teams to solve complex problems.",
    benefits: [
      "Competitive salary with performance bonuses",
      "Flexible remote work options",
      "Comprehensive health and financial benefits",
      "Education and certification reimbursement",
      "Regular team events and hackathons"
    ],
    jobPostings: [
      {
        id: 601,
        employerId: 6,
        title: "Data Scientist",
        description: "Apply statistical analysis and machine learning to solve complex business problems.",
        requirements: "Strong background in statistics, machine learning, and data manipulation with Python or R.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$120,000 - $160,000"
      },
      {
        id: 602,
        employerId: 6,
        title: "Data Engineer",
        description: "Build and maintain scalable data pipelines and infrastructure.",
        requirements: "Experience with data warehousing, ETL processes, and cloud-based data solutions.",
        employmentType: "FULL_TIME",
        locationType: "REMOTE",
        salary: "$110,000 - $150,000"
      },
      {
        id: 603,
        employerId: 6,
        title: "Analytics Product Manager",
        description: "Lead the development of our data analytics products and features.",
        requirements: "Product management experience with data or analytics products, technical background preferred.",
        employmentType: "FULL_TIME",
        locationType: "ONSITE",
        salary: "$130,000 - $170,000"
      }
    ]
  },
  {
    id: 7,
    userId: 207,
    companyName: "EduSpark",
    industry: "Education Technology",
    companySize: "10-50",
    location: "Seattle, WA",
    website: "https://eduspark.example.com",
    description: "EduSpark is transforming education with innovative learning technologies and platforms.",
    mission: "We're dedicated to making quality education accessible, engaging, and effective for learners of all ages.",
    culture: "Our supportive culture values creativity, impact, and continuous learning. We're passionate about education and believe in our potential to make a difference.",
    benefits: [
      "Competitive compensation package",
      "Flexible work arrangements",
      "Comprehensive health benefits",
      "Learning and development stipend",
      "Impact-focused work environment"
    ],
    jobPostings: [
      {
        id: 701,
        employerId: 7,
        title: "Educational Content Developer",
        description: "Create engaging learning content for our digital education platform.",
        requirements: "Background in education or instructional design, content creation experience preferred.",
        employmentType: "FULL_TIME",
        locationType: "REMOTE",
        salary: "$70,000 - $90,000"
      },
      {
        id: 702,
        employerId: 7,
        title: "Full Stack Developer - EdTech",
        description: "Build interactive learning features for our education platform.",
        requirements: "Experience with full stack development, interactive web applications, and ideally EdTech.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$100,000 - $130,000"
      }
    ]
  },
  {
    id: 8,
    userId: 208,
    companyName: "Quantum Robotics",
    industry: "Robotics & Automation",
    companySize: "100-300",
    location: "Denver, CO",
    website: "https://quantumrobotics.example.com",
    description: "Quantum Robotics develops next-generation robotic systems for manufacturing and logistics.",
    mission: "We aim to revolutionize manufacturing and logistics through intelligent robotics and automation solutions.",
    culture: "Our engineering-driven culture values innovation, technical excellence, and solving complex real-world problems.",
    benefits: [
      "Highly competitive salary and equity options",
      "Flexible work schedule with hybrid options",
      "Comprehensive benefits package",
      "Advanced labs and equipment access",
      "Continuous learning and professional development"
    ],
    jobPostings: [
      {
        id: 801,
        employerId: 8,
        title: "Robotics Engineer",
        description: "Design and implement robotic systems for industrial applications.",
        requirements: "Experience in robotics engineering, computer vision, and control systems.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$130,000 - $170,000"
      },
      {
        id: 802,
        employerId: 8,
        title: "Computer Vision Specialist",
        description: "Develop vision systems for our robotic platforms.",
        requirements: "Strong background in computer vision, deep learning, and practical implementation.",
        employmentType: "FULL_TIME",
        locationType: "ONSITE",
        salary: "$140,000 - $180,000"
      },
      {
        id: 803,
        employerId: 8,
        title: "ML Operations Engineer",
        description: "Build infrastructure for deploying and managing ML models in production robotic systems.",
        requirements: "Experience with MLOps, cloud infrastructure, and production ML deployments.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$120,000 - $160,000"
      }
    ]
  },
  {
    id: 9,
    userId: 209,
    companyName: "Caterpillar",
    industry: "Heavy Equipment & Manufacturing",
    companySize: "10,000+",
    location: "Peoria, IL",
    website: "https://www.caterpillar.com",
    description: "Caterpillar is the world's leading manufacturer of construction and mining equipment, diesel and natural gas engines, industrial gas turbines and diesel-electric locomotives.",
    mission: "Our mission is to enable economic growth through infrastructure and energy development, and to provide solutions that support communities and protect the planet.",
    culture: "Caterpillar's culture is built on the foundation of integrity, excellence, teamwork, and commitment. We embrace diversity and inclusion, fostering an environment where everyone can contribute to their fullest potential.",
    benefits: [
      "Competitive compensation and bonus structure",
      "Comprehensive health and retirement benefits",
      "Continuous learning and development opportunities",
      "Employee discount programs",
      "Work-life balance initiatives"
    ],
    jobPostings: [
      {
        id: 901,
        employerId: 9,
        title: "Mechanical Engineer",
        description: "Design and develop mechanical components and systems for heavy equipment.",
        requirements: "BS in Mechanical Engineering, experience with 3D CAD software, knowledge of manufacturing processes.",
        employmentType: "FULL_TIME",
        locationType: "ONSITE",
        salary: "$80,000 - $120,000"
      },
      {
        id: 902,
        employerId: 9,
        title: "Supply Chain Analyst",
        description: "Analyze and optimize global supply chain operations.",
        requirements: "Bachelor's degree in Supply Chain, Business, or related field. Experience with data analysis and ERP systems.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$70,000 - $90,000"
      },
      {
        id: 903,
        employerId: 9,
        title: "Manufacturing Engineering Intern",
        description: "Support manufacturing process improvement initiatives.",
        requirements: "Currently pursuing a degree in Engineering, Manufacturing, or related field.",
        employmentType: "INTERNSHIP",
        locationType: "ONSITE",
        salary: "$20 - $25/hr"
      }
    ]
  },
  {
    id: 10,
    userId: 210,
    companyName: "OSF HealthCare",
    industry: "Healthcare",
    companySize: "5,000+",
    location: "Peoria, IL",
    website: "https://www.osfhealthcare.org",
    description: "OSF HealthCare is an integrated health system owned and operated by The Sisters of the Third Order of St. Francis, providing state-of-the-art healthcare throughout Illinois and Michigan.",
    mission: "In the spirit of Christ and the example of Francis of Assisi, the Mission of OSF HealthCare is to serve persons with the greatest care and love in a community that celebrates the Gift of Life.",
    culture: "Our culture is centered on our Mission and Values. We foster an environment of compassion, integrity, and excellence in all we do, seeing our work as a calling to serve others.",
    benefits: [
      "Competitive compensation packages",
      "Comprehensive medical, dental, and vision coverage",
      "Retirement savings plans",
      "Tuition reimbursement",
      "Employee wellness programs"
    ],
    jobPostings: [
      {
        id: 1001,
        employerId: 10,
        title: "Registered Nurse",
        description: "Provide patient care in accordance with OSF nursing standards and protocols.",
        requirements: "BSN, current RN license, BLS certification, 1+ year experience preferred.",
        employmentType: "FULL_TIME",
        locationType: "ONSITE",
        salary: "$65,000 - $85,000"
      },
      {
        id: 1002,
        employerId: 10,
        title: "Healthcare Data Analyst",
        description: "Analyze clinical and operational data to improve healthcare delivery and outcomes.",
        requirements: "Bachelor's degree in Health Informatics, Data Science, or related field. Experience with healthcare data analysis.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$70,000 - $90,000"
      }
    ]
  },
  {
    id: 11,
    userId: 211,
    companyName: "SKB Cyber",
    industry: "Cybersecurity",
    companySize: "50-200",
    location: "Peoria, IL",
    website: "https://www.skbcyber.com",
    description: "SKB Cyber provides cutting-edge cybersecurity solutions to protect businesses from evolving digital threats.",
    mission: "Our mission is to secure the digital infrastructure of organizations through innovative cybersecurity solutions and services.",
    culture: "We maintain a culture of continuous learning, intellectual curiosity, and technical excellence. We value teamwork, ethical conduct, and staying ahead of emerging security threats.",
    benefits: [
      "Industry-competitive salaries",
      "Comprehensive health benefits",
      "Flexible work arrangements",
      "Professional development budget",
      "Regular team building activities"
    ],
    jobPostings: [
      {
        id: 1101,
        employerId: 11,
        title: "Security Analyst",
        description: "Monitor and respond to security incidents, implement security controls, and conduct vulnerability assessments.",
        requirements: "Bachelor's degree in Cybersecurity, IT, or related field. Security certifications (Security+, CISSP, etc.) preferred.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$75,000 - $95,000"
      },
      {
        id: 1102,
        employerId: 11,
        title: "Penetration Tester",
        description: "Conduct security testing to identify vulnerabilities in client systems and applications.",
        requirements: "Experience with penetration testing tools and methodologies. Security certifications (CEH, OSCP, etc.) preferred.",
        employmentType: "FULL_TIME",
        locationType: "REMOTE",
        salary: "$90,000 - $120,000"
      }
    ]
  },
  {
    id: 12,
    userId: 212,
    companyName: "Komatsu",
    industry: "Heavy Equipment Manufacturing",
    companySize: "5,000+",
    location: "Peoria, IL",
    website: "https://www.komatsu.com",
    description: "Komatsu is a global manufacturer of construction, mining, forestry, and industrial equipment, providing cutting-edge solutions for various industries.",
    mission: "Creating value through innovative manufacturing and technology to empower a sustainable future where people, businesses, and our planet thrive together.",
    culture: "Our culture promotes safety, quality, innovation, and teamwork. We embrace diversity and inclusion while fostering a commitment to continuous improvement.",
    benefits: [
      "Competitive compensation package",
      "Comprehensive health and wellness benefits",
      "Retirement savings plan with company match",
      "Educational assistance programs",
      "Employee recognition programs"
    ],
    jobPostings: [
      {
        id: 1201,
        employerId: 12,
        title: "Manufacturing Technician",
        description: "Operate and maintain manufacturing equipment to produce high-quality components.",
        requirements: "High school diploma or equivalent, manufacturing experience preferred, mechanical aptitude.",
        employmentType: "FULL_TIME",
        locationType: "ONSITE",
        salary: "$40,000 - $55,000"
      },
      {
        id: 1202,
        employerId: 12,
        title: "Automation Engineer",
        description: "Design and implement automation solutions to improve manufacturing processes.",
        requirements: "Bachelor's degree in Engineering, experience with industrial automation systems and PLC programming.",
        employmentType: "FULL_TIME",
        locationType: "ONSITE",
        salary: "$75,000 - $95,000"
      },
      {
        id: 1203,
        employerId: 12,
        title: "Product Development Engineer",
        description: "Develop new products and enhance existing ones to meet customer needs and market demands.",
        requirements: "Bachelor's degree in Mechanical or Industrial Engineering, experience with CAD software.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$80,000 - $110,000"
      }
    ]
  },
  {
    id: 13,
    userId: 213,
    companyName: "Carle Health",
    industry: "Healthcare",
    companySize: "1,000-5,000",
    location: "Peoria, IL",
    website: "https://www.carlehealth.com",
    description: "Carle Health is an integrated healthcare system serving communities throughout Illinois with high-quality, accessible healthcare services.",
    mission: "Our mission is to serve people through high-quality care, medical research, and education.",
    culture: "We foster a culture of collaboration, excellence, and compassion. Our team members are committed to improving the health and well-being of the communities we serve.",
    benefits: [
      "Competitive salaries",
      "Comprehensive medical, dental, and vision coverage",
      "Generous PTO and holiday time",
      "Retirement savings options",
      "Career advancement opportunities"
    ],
    jobPostings: [
      {
        id: 1301,
        employerId: 13,
        title: "Medical Assistant",
        description: "Assist healthcare providers with patient care and administrative tasks.",
        requirements: "Medical Assistant certification, strong communication skills, electronic medical record experience.",
        employmentType: "FULL_TIME",
        locationType: "ONSITE",
        salary: "$35,000 - $45,000"
      },
      {
        id: 1302,
        employerId: 13,
        title: "Healthcare IT Specialist",
        description: "Support and maintain healthcare information systems and applications.",
        requirements: "Bachelor's degree in IT or related field, experience with healthcare information systems.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$65,000 - $85,000"
      }
    ]
  },
  {
    id: 14,
    userId: 214,
    companyName: "Peoria Riverfront Museum",
    industry: "Arts & Education",
    companySize: "50-100",
    location: "Peoria, IL",
    website: "https://www.peoriariverfrontmuseum.org",
    description: "The Peoria Riverfront Museum is the only multidisciplinary museum of its kind in the nation, combining art, science, history, and achievement to create a unique experience.",
    mission: "To inspire learning for a lifetime through art, science, history, and achievement by creating engaging experiences for people of all ages.",
    culture: "Our culture embraces creativity, curiosity, and community engagement. We value diverse perspectives and collaborative approaches to education and exhibition development.",
    benefits: [
      "Competitive wages",
      "Health insurance options",
      "Professional development opportunities",
      "Free museum membership",
      "Flexible scheduling opportunities"
    ],
    jobPostings: [
      {
        id: 1401,
        employerId: 14,
        title: "Museum Educator",
        description: "Develop and deliver educational programs for museum visitors of all ages.",
        requirements: "Bachelor's degree in Education, Museum Studies, or related field. Experience in educational programming preferred.",
        employmentType: "FULL_TIME",
        locationType: "ONSITE",
        salary: "$38,000 - $48,000"
      },
      {
        id: 1402,
        employerId: 14,
        title: "Exhibit Designer",
        description: "Design engaging and educational museum exhibits that align with the museum's mission.",
        requirements: "Degree in Design, Museum Studies, or related field. Experience with exhibit design and production.",
        employmentType: "FULL_TIME",
        locationType: "ONSITE",
        salary: "$45,000 - $60,000"
      },
      {
        id: 1403,
        employerId: 14,
        title: "Digital Media Specialist",
        description: "Create and manage digital content for the museum's online presence and virtual exhibits.",
        requirements: "Experience with digital media production, web content management, and social media strategies.",
        employmentType: "PART_TIME",
        locationType: "HYBRID",
        salary: "$20 - $25/hr"
      }
    ]
  },
  {
    id: 14,
    userId: 214,
    companyName: "Ronald McDonald House Charities of Central Illinois",
    industry: "Non-Profit",
    companySize: "10-50",
    location: "Peoria, IL",
    website: "https://www.rmhc-centralillinois.org",
    description: "Ronald McDonald House Charities of Central Illinois provides a home away from home for families of children receiving medical care and supports programs that directly improve the health and well-being of children.",
    mission: "The mission of Ronald McDonald House Charities is to create, find, and support programs that directly improve the health and well-being of children and their families.",
    culture: "Our culture is compassionate, supportive, and community-focused. We value empathy, teamwork, and a commitment to making a difference in the lives of families during difficult times.",
    benefits: [
      "Competitive nonprofit compensation",
      "Comprehensive health benefits",
      "Flexible scheduling options",
      "Professional development opportunities",
      "Meaningful work that impacts families in need"
    ],
    jobPostings: [
      {
        id: 1401,
        employerId: 14,
        title: "Volunteer Coordinator",
        description: "Coordinate volunteer programs and activities to support families staying at Ronald McDonald House.",
        requirements: "Experience in volunteer management, strong organizational skills, and a compassionate attitude.",
        employmentType: "FULL_TIME",
        locationType: "ONSITE",
        salary: "$45,000 - $55,000"
      },
      {
        id: 1402,
        employerId: 14,
        title: "Development Associate",
        description: "Assist with fundraising efforts, donor relations, and community engagement activities.",
        requirements: "Experience in nonprofit development, event planning, and relationship building.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$40,000 - $50,000"
      }
    ]
  },
  {
    id: 15,
    userId: 215,
    companyName: "Distillery Labs",
    industry: "Technology Incubator",
    companySize: "10-50",
    location: "Peoria, IL",
    website: "https://www.distillerylabs.org",
    description: "Distillery Labs is a technology and innovation hub designed to foster entrepreneurship, support startups, and drive economic growth in the Greater Peoria region.",
    mission: "We aim to catalyze innovation, cultivate entrepreneurs, and create a vibrant ecosystem that attracts and retains talent in Central Illinois.",
    culture: "Our entrepreneurial culture is collaborative, innovative, and focused on growth. We encourage risk-taking, creative problem-solving, and community engagement.",
    benefits: [
      "Competitive salary with performance incentives",
      "Flexible work arrangements",
      "Health and wellness benefits",
      "Professional development opportunities",
      "Access to startup ecosystem and networking events"
    ],
    jobPostings: [
      {
        id: 1501,
        employerId: 15,
        title: "Startup Program Manager",
        description: "Develop and manage programs to support early-stage startups and entrepreneurs in the incubator.",
        requirements: "Experience with startups, business incubation, and program management in innovation spaces.",
        employmentType: "FULL_TIME",
        locationType: "ONSITE",
        salary: "$55,000 - $70,000"
      },
      {
        id: 1502,
        employerId: 15,
        title: "Community Engagement Specialist",
        description: "Build relationships with local businesses, universities, and community organizations to strengthen the innovation ecosystem.",
        requirements: "Strong networking skills, experience in community outreach, and knowledge of economic development strategies.",
        employmentType: "FULL_TIME",
        locationType: "HYBRID",
        salary: "$45,000 - $60,000"
      },
      {
        id: 1503,
        employerId: 15,
        title: "Marketing & Events Coordinator",
        description: "Coordinate marketing efforts and organize events to promote the incubator and its startups.",
        requirements: "Experience in marketing, event planning, and digital media management.",
        employmentType: "PART_TIME",
        locationType: "HYBRID",
        salary: "$20 - $25/hr"
      }
    ]
  }
];