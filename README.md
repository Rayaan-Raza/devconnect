# DevConnect — University FYP Showcase & Recruitment Platform

> **DevConnect** bridges the gap between final-year university students and top tech companies. Students showcase their Final Year Projects (FYPs) while companies discover talent, post job openings, and recruit directly from the platform.

---

## 🌟 Features Overview

### 🎓 Student Features
- **Registration & Authentication** — Secure signup with `.edu` email validation, bcrypt password hashing, JWT sessions
- **Profile Management** — University info, skills, keywords, LinkedIn/GitHub links, avatar upload
- **FYP Submission** — Upload projects with GitHub repo, demo video, static HTML demo page, poster, tags (5-10), and collaborator emails
- **Multiple Projects** — Students can submit multiple FYPs
- **Browse Companies** — View company profiles, open positions, and contact info
- **Browse & Search Jobs** — Filter by title, company, type; view detailed job descriptions
- **Apply to Jobs** — One-click application with duplicate prevention
- **Real-time Messaging** — Send messages to companies, view conversation history
- **Dashboard** — Live stats (project count, views, conversations)

### 🏢 Company Features
- **Company Registration** — Register with company name (unique), industry, and contact email
- **Profile Completion** — Description, location, website, industry, size — enforced before access
- **Post Multiple Jobs** — Full job posting form with salary range, requirements, type, location
- **View Applicants** — See who applied to each job with their profile details
- **Browse Talent** — Search students by name, skills, keywords, or expertise
- **Browse FYPs** — Search projects by tags, category, department
- **Messaging** — Direct messaging with students
- **Dashboard** — Live stats (jobs posted, total applicants, conversations)

### 🛡️ Admin Features
- **Admin Dashboard** — Platform-wide statistics (total students, companies, projects, pending reviews)
- **User Management** — View, activate/deactivate, change roles
- **Project Moderation** — Approve or reject submitted FYPs
- **Full Access** — Access to all platform sections

### 🔒 Security Features
- **bcrypt Password Hashing** — Passwords hashed with 12 salt rounds before storage
- **JWT Authentication** — Secure token-based sessions with expiry
- **Role-Based Access Control** — `student`, `company`, `admin` roles enforced at route and middleware level
- **Input Sanitization** — `express-mongo-sanitize` and `xss-clean` middleware
- **Rate Limiting** — API rate limiting via `express-rate-limit`
- **Helmet** — Security headers with `helmet`
- **Cookie-based Tokens** — HTTP-only cookies for session management

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT + bcrypt |
| **File Upload** | Multer + Cloudinary |
| **State Management** | React Context + TanStack React Query |
| **Form Validation** | Zod + React Hook Form (client), Express validators (server) |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |

---

## 📁 Project Structure

```
project/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers (auth, project, job, message, student, company, admin)
│   ├── middleware/       # Auth, upload, error handling
│   ├── models/          # Mongoose schemas (User, Project, Job, Message, StudentProfile, CompanyProfile)
│   ├── public/demos/    # Static HTML demo pages for seeded FYPs
│   ├── routes/          # Express route definitions
│   ├── utils/           # Email utilities
│   ├── seed.js          # Database seeder (10 students, 10 companies, 3 FYPs, 25 jobs)
│   └── server.js        # Express app entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components (Layout, Navbar, Footer, ProtectedRoute)
│   │   ├── context/     # AuthContext with JWT management
│   │   ├── pages/       # 18 page components
│   │   └── App.jsx      # React Router configuration
│   └── index.html
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the Repository
```bash
git clone https://github.com/Tabarak-Cheema/devconnect.git
cd devconnect
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Seed the Database
```bash
node seed.js
```
This creates: **1 admin**, **10 students**, **10 companies**, **3 FYPs** (with static HTML demos), and **25 diverse job listings**.

### 4. Start Backend
```bash
node server.js
```
Server runs on `http://localhost:5000`

### 5. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@devconnect.com` | `Admin123!` |
| Student 1 | `student1@uet.edu.pk` | `Password123!` |
| Student 2 | `student2@uet.edu.pk` | `Password123!` |
| Company (NexGen) | `hr@nexgensolutions.com` | `Password123!` |
| Company (CloudSync) | `hr@cloudsynctechnologies.com` | `Password123!` |

---

## 📊 Seed Data Details

### Students (10)
- Ahmed Hassan, Sara Khan, Bilal Raza, Fatima Ali, Usman Tariq, Ayesha Noor, Hamza Sheikh, Zainab Malik, Omar Farooq, Hira Javed
- Each with unique skills (React, Python, IoT, Blockchain, etc.) and keywords

### Companies (10)
- NexGen Solutions, CloudSync Technologies, DataPulse AI, FinEdge Systems, MedTech Innovations, EduSpark Labs, CyberShield Corp, GreenWave Energy, PixelForge Studios, AgriSmart Tech

### FYPs (3)
1. **Smart Farm Automation System** — IoT + React + Arduino
2. **AI Vision Accessibility Tool** — Computer Vision + TensorFlow + Chrome Extension
3. **Decentralized Academic Credentials** — Blockchain + Solidity + IPFS

### Jobs (25)
Frontend Developer, Backend Engineer, Data Scientist, DevOps Engineer, Mobile App Developer, ML Engineer, UI/UX Designer, Blockchain Developer, Cybersecurity Analyst, Game Developer, and 15 more across all 10 companies.

---

## 🎨 Design Highlights

- **Modern glassmorphism** and gradient backgrounds
- **Micro-animations** with Framer Motion (page transitions, card hover effects)
- **Responsive design** — works on desktop, tablet, and mobile
- **Dark/light consistent palette** — Indigo-purple-slate color scheme
- **Dynamic navigation** — Navbar changes based on user role
- **Real-time stats** — Dashboard loads live data from API

---

## 📋 API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login and get JWT
- `GET /api/auth/me` — Get current user
- `POST /api/auth/logout` — Logout

### Projects
- `GET /api/projects` — List all approved projects (public)
- `GET /api/projects/:id` — Get project detail (public)
- `POST /api/projects` — Submit new FYP (student)
- `GET /api/projects/mine` — My projects (student)

### Jobs
- `GET /api/jobs` — List all active jobs
- `GET /api/jobs/:id` — Job detail with applicants
- `POST /api/jobs` — Post new job (company)
- `POST /api/jobs/:id/apply` — Apply to job (student)

### Students
- `GET /api/students` — Browse students (company/admin)
- `GET /api/students/me` — My profile (student)
- `PUT /api/students/me` — Update profile (student)

### Companies
- `GET /api/companies` — List all companies (public)
- `GET /api/companies/:id` — Company detail (public)
- `GET /api/companies/me` — My profile (company)
- `PUT /api/companies/me` — Update profile (company)

### Messages
- `GET /api/messages/conversations` — My conversations
- `GET /api/messages/:otherUserId` — Conversation messages
- `POST /api/messages` — Send message

### Admin
- `GET /api/admin/stats` — Platform statistics
- `GET /api/admin/users` — All users
- `PUT /api/projects/:id/approve` — Approve project
- `PUT /api/projects/:id/reject` — Reject project

---

## 👥 Team

- **Tabarak Cheema** — Full-Stack Developer

---

## 📜 License

This project was built as a Final Year Project for the BS Computer Science program at UET Lahore, 2025-2026.
