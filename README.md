# YuvaNaukri — AI-Powered Resume Builder & Career Platform

> A full-stack MERN platform that helps students and professionals build ATS-optimized resumes, find jobs, and accelerate their careers — powered by **Google Gemini AI**.

🌐 **Live:** [yuvanaukri.onrender.com](https://yuvanaukri.onrender.com)

---

## ✨ Features

### 📄 Resume Builder
- **Real-Time Live Preview** — side-by-side dual-pane layout, see every change instantly
- **4 Premium Templates** — Professional, Modern, Creative Top, Creative Split
- **Live Theme Color Picker** — customize accent colors on any template
- **Instant PDF Export** — full A4 quality, single click
- **AI Content Improve** — Gemini AI rewrites any section with strong action verbs and professional tone (3 free uses)

### 🤖 AI ATS Checker *(New)*
- **Upload Resume PDF** — Gemini reads the actual PDF directly (no text extraction)
- **Full Score Analysis** — Overall score, ATS Compatibility, Content Quality, Formatting
- **Keyword Match** — matched vs missing keywords when job description is provided
- **Section-by-Section Feedback** — Contact Info, Summary, Skills, Experience, Education with individual scores
- **Top 5 Actionable Suggestions** — specific improvements ranked by impact
- **Daily Limit** — 2 free analyses per day per user, auto-resets at midnight

### 💼 Jobs Board
- Live job listings powered by **Adzuna API**
- Search by keyword, location, category filters
- API only called on manual search (no auto-fetch)
- Skeleton loading states and premium card UI

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
- **Recent Users Table**: last 10 registered users with usage data
- Auto-refresh every 60 seconds
- Client-side page tracking via `usePageTracker` hook — captures all React Router navigation

### 🎨 UI/UX
- Fully responsive across mobile, tablet, desktop
- Premium Navbar with gradient branding and smooth hover animations
- GSAP animations throughout (ATS Checker, 404 page)
- Modern glassmorphism and gradient design language
- Toast notification system

### 📜 Legal Center
- Redesigned Terms of Service and Privacy Policy
- Sticky Table of Contents with scroll-spy
- Plain-English "TL;DR" callouts and keyword search

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

## 🌩️ Production Deployment (Render)

| Service | URL |
|---|---|
| Frontend (Static Site) | `yuvanaukri.onrender.com` |
| Backend (Web Service) | `test-2-09s8.onrender.com` |

### Environment Variables (Backend — Render Dashboard)
```
PORT, MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, ADMIN_SECRET
```

### Keep-Alive (Prevents Render Free Tier Sleep)
The backend exposes `GET /ping` which returns `{ status: "ok" }`.  
Set up **UptimeRobot** (free) to ping `https://test-2-09s8.onrender.com/ping` every **14 minutes** to keep the server awake 24/7.

---

## 📁 Project Structure

```
resume-builder/
├── backend/
│   ├── models/
│   │   ├── user.js          # User schema (with ATS daily usage tracking)
│   │   ├── resume.js        # Resume schema
│   │   ├── token.js         # JWT session tokens
│   │   └── pageVisit.js     # Daily site traffic tracking
│   ├── routes/
│   │   ├── auth.js          # Signup, login, password change
│   │   ├── resume.js        # Resume CRUD
│   │   ├── ai.js            # Gemini AI: improve text + ATS resume analysis
│   │   └── admin.js         # Admin stats, login, visit tracking
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   └── App.js               # Express app, routes, visit middleware
│
└── frontend/src/
    ├── pages/
    │   ├── Home.jsx
    │   ├── ResumeBuilder.jsx
    │   ├── ATSChecker.jsx   # Full AI resume analysis with file upload
    │   ├── Jobs.jsx
    │   ├── AdminLogin.jsx
    │   ├── AdminDashboard.jsx
    │   └── NotFound.jsx     # GSAP animated 404
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
| GET | `/api/resume/my-resumes` | ✅ | Get all user resumes |
| POST | `/api/resume/save` | ✅ | Save/update resume |
| DELETE | `/api/resume/:id` | ✅ | Delete resume |
| POST | `/api/ai/improve` | ✅ | AI improve resume text (3 uses) |
| POST | `/api/ai/analyze-resume` | ✅ | Upload PDF + AI full analysis (2/day) |
| POST | `/api/admin/login` | — | Admin login |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| POST | `/api/admin/track` | — | Record page visit |
| GET | `/ping` | — | Keep-alive health check |

---

## License
MIT License — © 2026 YuvaNaukri
