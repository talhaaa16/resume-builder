# YuvaNaukri - Modern Platform to build resume and find jobs

A highly responsive, dynamic, and professional Resume Builder web application built with the **MERN** stack (MongoDB, Express, React, Node.js). YuvaNaukri allows users to create elegant, real-time updated resumes with customizable templates and instant PDF generation.

## 🌟 Key Features

- **Real-Time Live Preview**: See your resume build exactly as you type with a side-by-side dual-pane layout.
- **Multiple Premium Templates**:
  - *Professional*: Clean, classic, corporate standard.
  - *Modern*: Sleek, two-column layout with a stylish dark sidebar.
  - *Creative Top*: Dynamic centered avatar banner design.
  - *Creative Split*: High-contrast sidebars with skill progress bars and bold timeline dots.
- **Live Theme Color Picker**: Customize the accent color of any template in real-time.
- **Instant PDF Export**: Download your perfect resume in full A4 high quality with a single click.
- **Secure Authentication**: Full JWT-based login, signup, and session management.
- **Cloud Database**: Persistent user profiles and secure resume data storage using MongoDB Atlas.

## 🚀 Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** (for highly responsive and modern styling)
- **React Router v6** (for seamless SPA navigation)
- **html2canvas & jsPDF** (for PDF generation)
- **Lucide React** & **React Icons** (for iconography)

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose** (for NoSQL database modeling)
- **JSON Web Tokens (JWT)** (for secure authorization)
- **bcrypt.js** (for password hashing)
- **Body-parser & Cors** (configured for large payload resumes)

---

## 🛠️ Local Development Setup

To run this project locally, you will need **Node.js** and a **MongoDB** connection string.

### 1. Clone the repository
```bash
git clone https://github.com/talhaaa16/resume-builder.git
cd resume-builder
```

### 2. Setup the Backend
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env` file in the root of the `backend` directory and add your environment variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:
```bash
npm run dev
```
*The server will run on http://localhost:5000*

### 3. Setup the Frontend
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm start
```
*The frontend will run on http://localhost:3000 (or the port provided by Vite)*

---

## 🌩️ Production Deployment Info

The project is configured for deployment on **Render / Vercel**. 
- The backend features a keep-alive route and handles CORS dynamically.
- The frontend must have the `REACT_APP_API_URL` environment variable set in its production dashboard pointing to the deployed backend URL to ensure accurate API requests.

---

## 🤝 Roadmap / Future Features
- [ ] AI Content Generation / Smart Phrasing
- [ ] Drag-and-Drop section ordering
- [ ] Direct hyperlinked PDF exports via `@react-pdf/renderer`
- [ ] Automated ATS Score Checker

## License
MIT License
