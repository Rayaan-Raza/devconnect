# DevConnect - University FYP Showcase Platform

DevConnect is a comprehensive platform designed for university students to showcase their Final Year Projects (FYPs) to potential employers. It bridges the gap between academic excellence and industry recruitment.

## Features

- **Role-Based Access Control**: Separate dashboards and features for Students, Companies, and Admins.
- **Rich Project Portfolios**: Students can upload posters, screenshots, and details about their FYPs.
- **Job Portal**: Companies can post job openings and browse student profiles.
- **Admin Management**: University placement officers can verify companies and approve/feature projects.
- **Secure Authentication**: JWT with refresh tokens and HTTP-only cookies.
- **Responsive Design**: Modern UI built with React and TailwindCSS.

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, React Router, Framer Motion, Axios.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Authentication**: JSON Web Tokens (JWT), Bcrypt.
- **File Storage**: Cloudinary (Free tier).

## Setup Instructions

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`.
4. Seed the database:
   ```bash
   npm run seed
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Demo Credentials

- **Admin**: admin@devconnect.com / Admin123!
- **Student**: 2021-cs-101@student.uet.edu.pk / Password123!
- **Company**: hr@techsoft.com / Password123!
