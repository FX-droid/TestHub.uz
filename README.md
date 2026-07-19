# TestHub.uz - DTM Mock Test Platform

TestHub.uz is a complete, production-ready full-stack DTM Mock Test platform for Uzbekistan, built with modern web technologies: React 19, Vite, Node.js + Express, and MongoDB.

## Features

- **JWT-Based Authentication**: Secure login using Email or Username, custom profile settings.
- **Interactive Mock engine**: DTM standard 180-minute timer, 90 questions, option navigators, and auto-save/auto-submit logic.
- **Mistakes Notebook**: Automatically tracks user errors for subsequent review and target practice.
- **Global Leaderboard**: Tracks top users based on best scores, accuracy ( %), and mock count.
- **Fully Responsive Design**: Premium, minimalistic Apple-inspired glassmorphism theme with dark-mode compatibility.
- **Admin Dashboard & CRUD modules**: Full CRUD for questions, test assignments, user base, and stats tracking.
- **Automatic Seed Scripter**: Pre-populates the database with 500 DTM-style mathematics questions and default admin/test profiles.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)

---

### Step-by-Step Installation

1. **Clone & Open the Directory**
   Ensure you are in the application root directory:
   ```bash
   cd TestHub.uz
   ```

2. **Configure Environment Variables**
   The project contains default configurations. If you are using a local MongoDB, make sure MongoDB is running. The server `.env` configuration is located at `server/.env`.
   
   Example values inside `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/testhub
   JWT_SECRET=supersecretkey_testhub_2026
   JWT_EXPIRE=7d
   ```

3. **Install Dependencies**
   Run the following command in the root folder to install all packages for both the server and client concurrently:
   ```bash
   npm run install:all
   ```

4. **Seed the Database**
   This script populates MongoDB with initial datasets including 500 Mathematics questions, 1 active mock test, 10 users, and 1 administrator profile.
   ```bash
   npm run seed
   ```

5. **Start Development Servers**
   Run the platform in local development mode (starts both frontend mock engine and Express backend API):
   ```bash
   npm run dev
   ```

   - **Frontend URL:** [http://localhost:5173](http://localhost:5173)
   - **Backend API URL:** [http://localhost:5000](http://localhost:5000)

---

## Seed Accounts

- **Admin Account**: 
  - Username: `admin`
  - Password: `admin123`
- **Standard User Accounts**:
  - Usernames range from `user1` to `user10`
  - Password: `password123`

---

## Tech Stack

- **Frontend**: React 19, Vite, SCSS, React Router, Axios, React Hook Form, Framer Motion, Lucide icons (emojis used for reliability).
- **Backend**: Node.js, Express, MongoDB (Mongoose), bcryptjs (12 rounds hashing), jsonwebtoken, express-validator.
"# TestHub.uz" 
