const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');
const CompanyProfile = require('./models/CompanyProfile');
const StudentProfile = require('./models/StudentProfile');
const Job = require('./models/Job');

dotenv.config();

const PUBLIC_BASE = process.env.PUBLIC_BASE_URL || 'http://localhost:5000';

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await CompanyProfile.deleteMany();
    await StudentProfile.deleteMany();
    await Job.deleteMany();

    console.log('Cleared existing data...');

    // 1. Create Admin
    await User.create({
      name: 'DevConnect Admin',
      email: 'admin@devconnect.com',
      password: await bcrypt.hash('Admin123!', 12),
      role: 'admin',
      isVerified: true,
      isProfileComplete: true
    });

    // 2. Create 10 Students
    const studentNames = [
      'Ahmed Hassan', 'Sara Khan', 'Bilal Raza', 'Fatima Ali', 'Usman Tariq',
      'Ayesha Noor', 'Hamza Sheikh', 'Zainab Malik', 'Omar Farooq', 'Hira Javed'
    ];
    const studentSkills = [
      ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'],
      ['Python', 'Machine Learning', 'TensorFlow', 'NLP', 'Data Science'],
      ['Arduino', 'IoT', 'C++', 'Embedded Systems', 'MQTT'],
      ['Java', 'Spring Boot', 'Docker', 'Kubernetes', 'AWS'],
      ['Flutter', 'Dart', 'Firebase', 'React Native', 'Mobile Dev'],
      ['Solidity', 'Web3.js', 'Blockchain', 'Smart Contracts', 'Ethereum'],
      ['Python', 'Computer Vision', 'OpenCV', 'PyTorch', 'Deep Learning'],
      ['React', 'TypeScript', 'GraphQL', 'PostgreSQL', 'Prisma'],
      ['Cybersecurity', 'Penetration Testing', 'Linux', 'Network Security', 'Wireshark'],
      ['Unity', 'C#', 'Game Design', 'AR/VR', 'Blender']
    ];
    const studentKeywords = [
      ['fullstack', 'web', 'mern', 'api', 'developer'],
      ['ai', 'ml', 'data', 'research', 'analytics'],
      ['iot', 'hardware', 'automation', 'embedded', 'sensors'],
      ['backend', 'cloud', 'devops', 'microservices', 'enterprise'],
      ['mobile', 'cross-platform', 'ui', 'app', 'frontend'],
      ['blockchain', 'crypto', 'defi', 'web3', 'fintech'],
      ['cv', 'image-processing', 'neural-networks', 'ai', 'research'],
      ['frontend', 'design-systems', 'graphql', 'typescript', 'saas'],
      ['security', 'ethical-hacking', 'networking', 'infosec', 'compliance'],
      ['gamedev', 'metaverse', 'xr', '3d', 'simulation']
    ];
    const departments = [
      'Computer Science', 'Computer Science', 'Computer Engineering', 'Software Engineering', 'Computer Science',
      'Software Engineering', 'Computer Science', 'Software Engineering', 'Computer Engineering', 'Computer Science'
    ];

    const studentData = [];
    for (let i = 0; i < 10; i++) {
      studentData.push({
        name: studentNames[i],
        email: `student${i+1}@uet.edu.pk`,
        password: await bcrypt.hash('Password123!', 12),
        role: 'student',
        isVerified: true,
        isProfileComplete: true
      });
    }
    const students = await User.insertMany(studentData);
    
    // Create Student Profiles
    for (let i = 0; i < students.length; i++) {
      await StudentProfile.create({
        user: students[i]._id,
        regNumber: `2021-CS-${100 + i}`,
        department: departments[i],
        university: 'UET Lahore',
        campusCity: i < 5 ? 'Lahore' : 'Taxila',
        fatherName: `Muhammad ${['Aslam', 'Iqbal', 'Naveed', 'Tariq', 'Aziz', 'Rashid', 'Saleem', 'Waseem', 'Khalid', 'Akram'][i]}`,
        skills: studentSkills[i],
        keywords: studentKeywords[i],
        bio: `Final year ${departments[i]} student at UET. Specializing in ${studentSkills[i].slice(0, 2).join(' & ')}. Looking for opportunities in the tech industry.`,
        github: `https://github.com/${studentNames[i].toLowerCase().replace(' ', '')}`,
        linkedin: `https://linkedin.com/in/${studentNames[i].toLowerCase().replace(' ', '-')}`
      });
    }

    // 3. Create 10 Companies
    const companyNames = [
      'NexGen Solutions', 'CloudSync Technologies', 'DataPulse AI', 'FinEdge Systems', 'MedTech Innovations',
      'EduSpark Labs', 'CyberShield Corp', 'GreenWave Energy', 'PixelForge Studios', 'AgriSmart Tech'
    ];
    const companyIndustries = [
      'Software Engineering', 'Cloud Computing', 'Artificial Intelligence', 'FinTech', 'HealthTech',
      'EdTech', 'Cybersecurity', 'CleanTech', 'Game Development', 'AgriTech'
    ];
    const companyData = [];
    for (let i = 0; i < 10; i++) {
      companyData.push({
        name: companyNames[i],
        email: `hr@${companyNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
        password: await bcrypt.hash('Password123!', 12),
        role: 'company',
        isVerified: true,
        isProfileComplete: true
      });
    }
    const companies = await User.insertMany(companyData);

    // Create Company Profiles
    for (let i = 0; i < companies.length; i++) {
      await CompanyProfile.create({
        user: companies[i]._id,
        companyName: companyNames[i],
        contactEmail: companies[i].email,
        website: `https://${companyNames[i].toLowerCase().replace(/\s+/g, '')}.com`,
        location: i % 2 === 0 ? 'Lahore, Pakistan' : 'Islamabad, Pakistan',
        description: `${companyNames[i]} is a leading company in the ${companyIndustries[i]} space. We build cutting-edge products and hire top talent from Pakistani universities.`,
        industry: companyIndustries[i],
        size: ['1-50', '51-200', '201-500', '501-1000'][i % 4],
        isVerified: i < 5,
      });
    }

    // 4. Create 3 Detailed FYPs (Prebuilt public github repos and html demo)
    const projects = [
      {
        title: 'Smart Farm Automation System',
        tagline: 'IoT-based precision agriculture',
        abstract: 'A complete IoT solution utilizing sensors and an automated irrigation system to optimize water usage and crop yield. The project integrates a React frontend dashboard and a Node.js API to control the hardware components remotely.',
        problemStatement: 'Farmers lack real-time data to make informed decisions about irrigation, leading to water waste and suboptimal crop health.',
        solution: 'Our system deploys soil moisture sensors and weather APIs to automatically trigger irrigation only when necessary.',
        techStack: ['Node.js', 'React', 'Arduino', 'MongoDB'],
        tags: ['automation', 'iot', 'agriculture', 'hardware'],
        category: 'IoT',
        department: 'Computer Science',
        owner: students[0]._id,
        status: 'approved',
        isFeatured: true,
        academicYear: '2025-2026',
        teamMembers: [
          { name: students[0].name, regNumber: 'STUDENT1', role: 'Team Lead', email: students[0].email },
          { name: students[1].name, regNumber: 'STUDENT2', role: 'Hardware Engineer', email: students[1].email }
        ],
        collaboratorEmails: [students[1].email],
        githubRepo: 'https://github.com/microsoft/IoT-For-Beginners',
        demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        posterUrl: 'https://via.placeholder.com/800x600',
        demoHtmlUrl: `${PUBLIC_BASE}/public/demos/demo-farm.html`
      },
      {
        title: 'AI Vision Accessibility Tool',
        tagline: 'Helping visually impaired navigate the web',
        abstract: 'A browser extension powered by computer vision models that describes images, reads text aloud, and simplifies complex web layouts for visually impaired users in real-time.',
        techStack: ['Python', 'TensorFlow', 'JavaScript', 'Chrome Extension API'],
        tags: ['computer vision', 'accessibility', 'ai', 'deep learning'],
        category: 'Artificial Intelligence',
        department: 'Computer Science',
        owner: students[2]._id,
        status: 'approved',
        isFeatured: true,
        academicYear: '2025-2026',
        teamMembers: [
          { name: students[2].name, regNumber: 'STUDENT3', email: students[2].email }
        ],
        githubRepo: 'https://github.com/tensorflow/models',
        demoVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        demoHtmlUrl: `${PUBLIC_BASE}/public/demos/demo-vision.html`
      },
      {
        title: 'Decentralized Academic Credentials',
        tagline: 'Verifiable university degrees on the blockchain',
        abstract: 'A smart contract system built on Ethereum to issue, store, and instantly verify academic transcripts and degrees, eliminating credential fraud.',
        techStack: ['Solidity', 'React', 'Web3.js', 'IPFS'],
        tags: ['blockchain', 'security', 'web3', 'smart contracts'],
        category: 'Blockchain',
        department: 'Software Engineering',
        owner: students[3]._id,
        status: 'approved',
        isFeatured: false,
        academicYear: '2025-2026',
        teamMembers: [
          { name: students[3].name, regNumber: 'STUDENT4', email: students[3].email }
        ],
        githubRepo: 'https://github.com/ethereum/solidity',
        demoHtmlUrl: `${PUBLIC_BASE}/public/demos/demo-blockchain.html`
      }
    ];

    await Project.insertMany(projects);

    // 5. Create 25 Diverse Jobs
    const jobTemplates = [
      { title: 'Frontend Developer', desc: 'Build responsive UIs with React and modern CSS.', reqs: ['React', 'JavaScript', 'CSS', 'Git'] },
      { title: 'Backend Engineer', desc: 'Design scalable APIs and microservices.', reqs: ['Node.js', 'PostgreSQL', 'Docker', 'REST APIs'] },
      { title: 'Data Scientist', desc: 'Analyze datasets and build predictive ML models.', reqs: ['Python', 'Pandas', 'Scikit-learn', 'SQL'] },
      { title: 'DevOps Engineer', desc: 'Manage CI/CD pipelines and cloud infrastructure.', reqs: ['AWS', 'Docker', 'Kubernetes', 'Terraform'] },
      { title: 'Mobile App Developer', desc: 'Build cross-platform mobile apps.', reqs: ['Flutter', 'React Native', 'Firebase', 'REST APIs'] },
      { title: 'Machine Learning Engineer', desc: 'Train and deploy production ML models.', reqs: ['Python', 'TensorFlow', 'PyTorch', 'MLOps'] },
      { title: 'UI/UX Designer', desc: 'Design intuitive and beautiful user interfaces.', reqs: ['Figma', 'User Research', 'Prototyping', 'Design Systems'] },
      { title: 'Blockchain Developer', desc: 'Write smart contracts and dApps.', reqs: ['Solidity', 'Web3.js', 'Hardhat', 'Ethereum'] },
      { title: 'Cybersecurity Analyst', desc: 'Protect systems from threats and vulnerabilities.', reqs: ['Penetration Testing', 'SIEM', 'Network Security', 'Linux'] },
      { title: 'Game Developer', desc: 'Build immersive gaming experiences.', reqs: ['Unity', 'C#', 'Game Physics', '3D Modeling'] },
      { title: 'Cloud Architect', desc: 'Design and implement cloud solutions.', reqs: ['AWS', 'Azure', 'GCP', 'Microservices'] },
      { title: 'QA Engineer', desc: 'Ensure software quality through automated testing.', reqs: ['Selenium', 'Jest', 'CI/CD', 'Test Planning'] },
      { title: 'Product Manager', desc: 'Drive product strategy and roadmap.', reqs: ['Agile', 'Jira', 'Data Analysis', 'Communication'] },
      { title: 'Full Stack Developer', desc: 'End-to-end web application development.', reqs: ['React', 'Node.js', 'MongoDB', 'TypeScript'] },
      { title: 'AI Research Intern', desc: 'Assist in cutting-edge AI research projects.', reqs: ['Python', 'Deep Learning', 'Research Papers', 'Math'] },
      { title: 'Database Administrator', desc: 'Manage and optimize databases.', reqs: ['PostgreSQL', 'MongoDB', 'Redis', 'Query Optimization'] },
      { title: 'Embedded Systems Engineer', desc: 'Program microcontrollers and firmware.', reqs: ['C', 'C++', 'Arduino', 'RTOS'] },
      { title: 'Technical Writer', desc: 'Write clear documentation and API guides.', reqs: ['Technical Writing', 'Markdown', 'API Documentation', 'Git'] },
      { title: 'Systems Analyst', desc: 'Analyze business requirements and design solutions.', reqs: ['UML', 'SQL', 'Business Analysis', 'Agile'] },
      { title: 'NLP Engineer', desc: 'Build natural language processing pipelines.', reqs: ['Python', 'Hugging Face', 'spaCy', 'Transformers'] },
      { title: 'AR/VR Developer', desc: 'Develop augmented and virtual reality applications.', reqs: ['Unity', 'ARKit', 'WebXR', '3D Math'] },
      { title: 'FinTech Developer', desc: 'Build secure financial technology applications.', reqs: ['Node.js', 'Payment APIs', 'Security', 'Compliance'] },
      { title: 'Network Engineer', desc: 'Design and maintain network infrastructure.', reqs: ['Cisco', 'TCP/IP', 'Firewalls', 'VPN'] },
      { title: 'Site Reliability Engineer', desc: 'Keep production systems running smoothly.', reqs: ['Linux', 'Monitoring', 'Automation', 'Incident Response'] },
      { title: 'Computer Vision Engineer', desc: 'Build image and video analysis systems.', reqs: ['OpenCV', 'Python', 'CNN', 'YOLO'] },
    ];

    const jobList = [];
    for (let i = 0; i < jobTemplates.length; i++) {
      const company = companies[i % 10];
      const t = jobTemplates[i];
      jobList.push({
        company: company._id,
        title: t.title,
        type: i % 4 === 0 ? 'internship' : i % 3 === 0 ? 'part-time' : 'full-time',
        location: i % 3 === 0 ? 'Remote' : i % 2 === 0 ? 'Lahore' : 'Islamabad',
        description: `${t.desc} Join our team and work on exciting projects that impact millions.`,
        requirements: t.reqs,
        salary: { min: 40000 + (i * 5000), max: 120000 + (i * 8000), currency: 'PKR' },
        isActive: true,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      });
    }

    await Job.insertMany(jobList);

    console.log('Seeding completed successfully!');
    console.log(`Created: 1 admin, 10 students, 10 companies, 3 FYPs, ${jobList.length} jobs`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
