# YuvaNaukri — AI-Powered Resume Builder & Career Platform

> A full-stack MERN platform that helps students and professionals build ATS-optimized resumes, find jobs, and accelerate their careers.

🌐 **Live:** [yuvanaukri.onrender.com](https://yuvanaukri.onrender.com)

---

## ✨ Features

### 📄 Resume Builder
- **Real-Time Live Preview** — side-by-side dual-pane layout, see every change instantly
- **4 Premium Templates** — Professional, Modern, Creative Top, Creative Split
- **Live Theme Color Picker** — customize accent colors on any template
- **Instant PDF Export** — full A4 quality, single click
- **AI Content Improve** — Gemini AI rewrites any section with strong action verbs and professional tone (3 free uses)
- **🔗 Resume Share Link** — generate a public, read-only shareable URL for any saved resume
  - One-click share from the Resume Builder toolbar
  - One-click share from the **My Resumes** modal in the Navbar
  - Anyone with the link can view the resume in its original template (no login required)
  - Toggle sharing on/off at any time from the same button

### 🤖 AI ATS Checker *(New)*
- **Upload Resume PDF** — Gemini reads the actual PDF directly (no text extraction)
- **Full Score Analysis** — Overall score, ATS Compatibility, Content Quality, Formatting
- **Keyword Match** — matched vs missing keywords when job description is provided
- **Section-by-Section Feedback** — Contact Info, Summary, Skills, Experience, Education with individual scores
- **Top 5 Actionable Suggestions** — specific improvements ranked by impact
- **Daily Limit** — 2 free analyses per day per user, auto-resets at midnight

### 🎤 Interview Prep *(New)*
- **Role-Based Questions** — Enter target job role and experience level (Fresher to Senior)
- **AI-Generated Q&A** — 10 tailored interview questions with professional model answers and actionable tips
- **Categorized** — Questions tagged as Behavioral, Technical, Situational, HR, or Role-Specific
- **History & Revision** — Automatically saves past generated preps for easy review without spending limits
- **Daily Limit** — 2 free generations per day (including regenerations), auto-resets at midnight

### 🌐 LinkedIn About Optimizer *(New)*
- **AI-Powered Optimization** — Paste your LinkedIn "About" summary and get a keyword-rich version tailored for visibility and engagement
- **Professional Tone** — Rewrites content to be more professional and appealing to recruiters
- **Daily Limit** — 2 free optimizations per day per user, auto-resets at midnight

### 📊 User Dashboard *(New)*
- **Centralized Hub** — Replaces basic navbar profile with a full dashboard page
- **Quick Stats** — Track total resumes, shared links, ATS daily checks, and AI improvements
- **My Resumes Grid** — View all saved resumes with template badges, plus inline Edit and Share buttons
- **Quick Actions** — One-click access to Build Resume, ATS Checker, Interview Prep, and Jobs

### 💼 Jobs Board
- Live job listings powered by **Adzuna API**
- Search by keyword, location, category filters
- **✨ AI Job Match Score *(New)***
  - Instantly compares your latest saved resume against any job description
  - Generates a Match Percentage (e.g. 🔥 85% Match)
  - Provides a 1-sentence personalized recommendation on how to improve your fit (e.g., "Add AWS to your skills.")
  - **Daily Limit** — 5 free match checks per day per user, auto-resets at midnight

### 🎓 Career Guidance
- Curated career path recommendations
- Skill roadmaps and industry insights

### 🔐 Authentication & Security
- JWT-based secure login, signup, and session management
- **Password Policy**: min. 6 characters, must contain letters + numbers
- Enforced on both signup and password change (frontend + backend)
- Profile picture upload with 5MB limit handled gracefully
- Secure session invalidation on logout

### 🛡️ Admin Panel *(New)*
- Password-protected admin dashboard at `/admin`
- **Live Stats**: total users, new users today/this week
- **Traffic Analytics**: unique visitors + page views (tracked per day)
- **7-day Bar Chart**: page views vs unique visitors
- **Resume & ATS Stats**: total resumes created, total ATS checks done
- Auto-refresh every 60 seconds

### 🎨 UI/UX
- Fully responsive across mobile, tablet, desktop
- Premium Navbar with gradient branding and smooth hover animations
- GSAP animations throughout (ATS Checker, 404 page)
- Modern glassmorphism and gradient design language
- Toast notification system

### ℹ️ About Us
- Story, mission, and what makes YuvaNaukri different
- Features showcase panel with iconography
- Direct CTA into the Resume Builder

### ❓ FAQ
- 26 questions across 6 categories: General, Resume Builder, ATS Checker, Account, Jobs & Career, Pricing & Limits
- Live search across all questions and categories
- Category tab filter with icons
- Accordion UI (one question open at a time) with smooth expand animation
- Result counter showing matches
- "Still have questions?" support CTA banner
- Accessible from the Footer (Support column)

---

## 🚀 Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| **React.js** (CRA) | SPA framework |
| **Tailwind CSS** | Styling |
| **React Router v6** | Client-side routing |
| **GSAP** | Animations |
| **Axios** | API requests |
| **html2canvas + jsPDF** | PDF generation |
| **Lucide React** | Iconography |

### Backend
| Tech | Purpose |
|---|---|
| **Node.js + Express.js** | Server framework |
| **MongoDB + Mongoose** | Database |
| **JWT** | Authentication |
| **bcrypt.js** | Password hashing |
| **Multer** | File upload (PDF) |
| **@google/generative-ai** | Gemini AI integration |
| **body-parser** | Large payload handling (10MB) |

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js v18+
- MongoDB connection string (MongoDB Atlas free tier works)
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### 1. Clone the repository
```bash
git clone https://github.com/talhaaa16/resume-builder.git
cd resume-builder
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=6001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
ADMIN_SECRET=your_admin_panel_password
```

Start the backend:
```bash
npm run dev
```
*Runs on `http://localhost:6001`*

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
REACT_APP_API_URL=http://localhost:6001
```

Start the frontend:
```bash
npm start
```
*Runs on `http://localhost:3000`*

### 4. Access Admin Panel
Visit `http://localhost:3000/admin` and enter your `ADMIN_SECRET` password.

---

## 📁 Project Structure

```
resume-builder/
├── backend/
│   ├── models/
│   │   ├── user.js          # User schema (with ATS daily usage tracking)
│   │   ├── resume.js        # Resume schema
│   │   ├── interviewPrep.js # Interview Prep history schema
│   │   ├── token.js         # JWT session tokens
│   │   └── pageVisit.js     # Daily site traffic tracking
│   ├── routes/
│   │   ├── auth.js          # Signup, login, password change
│   │   ├── resume.js        # Resume CRUD
│   │   ├── ai.js            # Gemini AI: improve text, ATS analysis, job matching
│   │   └── admin.js         # Admin stats, login, visit tracking
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   └── App.js               # Express app, routes, visit middleware
│
└── frontend/src/
    ├── pages/
    │   ├── Home.jsx
    │   ├── ResumeBuilder.jsx
    │   ├── ResumeView.jsx     # Public read-only resume view (shareable link)
    │   ├── ATSChecker.jsx    # Full AI resume analysis with file upload
    │   ├── InterviewPrep.jsx # AI-generated interview questions and answers
    │   ├── LinkedInOptimizer.jsx # AI-powered LinkedIn About optimizer
    │   ├── Dashboard.jsx     # User dashboard with stats and saved resumes
    │   ├── Jobs.jsx
    │   ├── About.jsx
    │   ├── FAQ.jsx
    │   ├── AdminLogin.jsx
    │   ├── AdminDashboard.jsx
    │   └── NotFound.jsx      # GSAP animated 404
    ├── components/
    │   └── Navbar.jsx
    └── hooks/
        └── usePageTracker.js  # Client-side visit tracking hook
```

---

## 🔑 API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/adduser` | — | Register new user |
| POST | `/api/auth/userlogin` | — | Login |
| POST | `/api/auth/logout` | ✅ | Logout |
| POST | `/api/auth/change-password` | ✅ | Change password |
| GET | `/api/auth/dashboard` | ✅ | Fetch user profile, usage stats, and resumes |
| GET | `/api/resume/my-resumes` | ✅ | Get all user resumes |
| POST | `/api/resume/save` | ✅ | Save/update resume |
| DELETE | `/api/resume/:id` | ✅ | Delete resume |
| POST | `/api/resume/share/:id` | ✅ | Toggle public sharing (returns shareId) |
| GET | `/api/resume/public/:shareId` | — | Fetch a public shared resume (no auth) |
| POST | `/api/ai/improve` | ✅ | AI improve resume text (3 uses) |
| POST | `/api/ai/analyze-resume` | ✅ | Upload PDF + AI full analysis (2/day) |
| POST | `/api/ai/job-match` | ✅ | AI checks resume vs job description (5/day) |
| POST | `/api/ai/interview-prep` | ✅ | AI generate interview questions (2/day) |
| POST | `/api/ai/linkedin-optimizer` | ✅ | AI optimize LinkedIn About section (2/day) |
| GET | `/api/ai/my-interview-preps` | ✅ | Fetch past interview prep history |
| POST | `/api/admin/login` | — | Admin login |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| POST | `/api/admin/track` | — | Record page visit |

---

## License
MIT License — © 2026 YuvaNaukri
