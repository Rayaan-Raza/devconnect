const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');
const CompanyProfile = require('./models/CompanyProfile');
const StudentProfile = require('./models/StudentProfile');
const Job = require('./models/Job');

dotenv.config();

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
    const admin = await User.create({
      name: 'DevConnect Admin',
      email: 'admin@devconnect.com',
      password: 'Admin123!',
      role: 'admin',
      isVerified: true
    });

    // 2. Create Students
    const studentData = [
      { name: 'Ahmed Ali', email: '2021-cs-101@student.uet.edu.pk', password: 'Password123!', role: 'student', isVerified: true },
      { name: 'Sara Khan', email: '2021-cs-102@student.uet.edu.pk', password: 'Password123!', role: 'student', isVerified: true },
      { name: 'Zainab Fatima', email: '2021-cs-103@student.uet.edu.pk', password: 'Password123!', role: 'student', isVerified: true },
      { name: 'Hamza Sheikh', email: '2021-cs-104@student.uet.edu.pk', password: 'Password123!', role: 'student', isVerified: true },
      { name: 'Bilal Ahmed', email: '2021-cs-105@student.uet.edu.pk', password: 'Password123!', role: 'student', isVerified: true },
    ];

    const students = await User.insertMany(studentData);
    
    // Create Student Profiles
    for (const s of students) {
      await StudentProfile.create({
        user: s._id,
        regNumber: s.email.split('@')[0].toUpperCase(),
        department: 'Computer Science',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        bio: `Final year CS student at UET. Passionate about building impactful software solutions.`,
        githubUrl: 'https://github.com',
        linkedinUrl: 'https://linkedin.com'
      });
    }

    // 3. Create Companies
    const companyData = [
      { name: 'TechSoft Solutions', email: 'hr@techsoft.com', password: 'Password123!', role: 'company', isVerified: true },
      { name: 'Innovate AI', email: 'jobs@innovate.ai', password: 'Password123!', role: 'company', isVerified: true },
      { name: 'WebScale Corp', email: 'talent@webscale.com', password: 'Password123!', role: 'company', isVerified: false },
    ];

    const companies = await User.insertMany(companyData);

    // Create Company Profiles
    for (const c of companies) {
      await CompanyProfile.create({
        user: c._id,
        companyName: c.name,
        website: 'https://example.com',
        location: 'Lahore, Pakistan',
        description: 'Leading software development house specializing in modern web and AI solutions.',
        industry: 'Software Engineering',
        logoUrl: 'https://via.placeholder.com/150'
      });
    }

    // 4. Create 10 FYPs
    const projects = [
      {
        title: 'CropDoc - AI plant disease detection',
        tagline: 'Empowering farmers with AI-driven diagnostics',
        abstract: 'An AI-powered mobile application that helps farmers identify crop diseases by simply taking a photo. Uses a deep learning model trained on over 50,000 images of various crops.',
        problemStatement: 'Farmers lose up to 40% of their yields to undiagnosed pests and diseases, often due to lack of access to agricultural experts.',
        solution: 'A lightweight mobile app that works offline to provide instant diagnostics and treatment recommendations.',
        techStack: ['Python', 'TensorFlow', 'React Native', 'Node.js'],
        category: 'Artificial Intelligence',
        department: 'Computer Science',
        owner: students[0]._id,
        status: 'approved',
        isFeatured: true,
        academicYear: '2025-2026',
        teamMembers: [{ name: 'Ahmed Ali', regNumber: '2021-CS-101', role: 'Team Lead' }]
      },
      {
        title: 'MediTrack - Blockchain for medicine supply chain',
        tagline: 'Securing the path from factory to pharmacy',
        abstract: 'A decentralized application built on Ethereum to track the provenance of medicines and prevent counterfeit drugs from entering the supply chain.',
        techStack: ['Solidity', 'Ethereum', 'Web3.js', 'React'],
        category: 'Blockchain',
        department: 'Software Engineering',
        owner: students[1]._id,
        status: 'approved',
        isFeatured: false,
        academicYear: '2025-2026',
        teamMembers: [{ name: 'Sara Khan', regNumber: '2021-CS-102' }]
      },
      {
        title: 'EduBridge - Sign language translator',
        tagline: 'Breaking barriers with real-time gesture translation',
        abstract: 'A system that uses computer vision to translate sign language gestures into spoken and written language in real-time, facilitating communication for the hearing impaired.',
        techStack: ['Python', 'OpenCV', 'MediaPipe', 'Flask'],
        category: 'Artificial Intelligence',
        department: 'Computer Engineering',
        owner: students[2]._id,
        status: 'approved',
        isFeatured: true,
        academicYear: '2025-2026'
      },
      {
        title: 'TrafficFlow - Smart traffic management with YOLO',
        tagline: 'Reducing congestion using real-time object detection',
        abstract: 'An intelligent traffic signal control system that adjusts signal timings based on the actual vehicle density detected by cameras using the YOLO algorithm.',
        techStack: ['Python', 'YOLOv8', 'PyQt', 'C++'],
        category: 'IoT',
        department: 'Computer Science',
        owner: students[3]._id,
        status: 'approved'
      },
      {
        title: 'PawSpace - Pet adoption platform',
        tagline: 'Connecting pets with their forever homes',
        abstract: 'A comprehensive web platform for pet shelters to showcase animals available for adoption and for potential owners to find their perfect companions.',
        techStack: ['MERN Stack', 'Redux', 'Cloudinary'],
        category: 'Web Development',
        department: 'Computer Science',
        owner: students[4]._id,
        status: 'pending'
      },
      {
        title: 'StockSage - Financial news sentiment analysis',
        tagline: 'Predicting market trends from news headlines',
        abstract: 'A tool that scrapes financial news and performs sentiment analysis using BERT to predict short-term stock price movements.',
        techStack: ['Python', 'NLP', 'BERT', 'Scrapy', 'FastAPI'],
        category: 'Data Science',
        department: 'Computer Science',
        owner: students[0]._id,
        status: 'approved'
      },
      {
        title: 'MediHome - IoT patient monitoring',
        tagline: 'Remote healthcare for elderly and chronic patients',
        abstract: 'A wearable device and cloud platform that monitors vital signs and alerts doctors or family members in case of emergencies.',
        techStack: ['Arduino', 'Raspberry Pi', 'Firebase', 'Flutter'],
        category: 'IoT',
        department: 'Computer Engineering',
        owner: students[1]._id,
        status: 'approved'
      },
      {
        title: 'FraudShield - Credit card fraud detection',
        tagline: 'Protecting transactions with machine learning',
        abstract: 'A real-time fraud detection system that uses anomaly detection algorithms to identify suspicious credit card transactions.',
        techStack: ['Python', 'Scikit-Learn', 'Docker', 'Kafka'],
        category: 'Artificial Intelligence',
        department: 'Computer Science',
        owner: students[2]._id,
        status: 'approved'
      },
      {
        title: 'CVForge - AI resume parser',
        tagline: 'Transforming resumes into structured data',
        abstract: 'An AI tool for recruiters that extracts skills, experience, and education from resumes in various formats and matches them with job descriptions.',
        techStack: ['Python', 'Spacy', 'Django', 'PostgreSQL'],
        category: 'Artificial Intelligence',
        department: 'Software Engineering',
        owner: students[3]._id,
        status: 'rejected',
        rejectionReason: 'The abstract is too short and lacks technical details.'
      },
      {
        title: 'CodeCollab - Real-time code editor',
        tagline: 'Coding together, wherever you are',
        abstract: 'A web-based IDE that allows multiple developers to code in the same environment simultaneously with real-time updates and integrated video chat.',
        techStack: ['Node.js', 'Socket.io', 'Monaco Editor', 'WebRTC'],
        category: 'Web Development',
        department: 'Computer Science',
        owner: students[4]._id,
        status: 'approved'
      }
    ];

    await Project.insertMany(projects);

    // 5. Create some Jobs
    const jobs = [
      {
        title: 'Junior Web Developer',
        company: companies[0]._id,
        description: 'Looking for a passionate React developer to join our frontend team.',
        requirements: ['React', 'CSS', 'JavaScript'],
        location: 'Lahore',
        salaryRange: '60k - 80k',
        type: 'Full-time'
      },
      {
        title: 'AI Research Intern',
        company: companies[1]._id,
        description: 'Join us in building next-gen NLP models.',
        requirements: ['Python', 'PyTorch', 'Linear Algebra'],
        location: 'Remote',
        salaryRange: '30k - 40k',
        type: 'Internship'
      }
    ];

    await Job.insertMany(jobs);

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
