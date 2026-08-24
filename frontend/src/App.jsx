import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Jobs from "./pages/Jobs";
import ResumeBuilder from "./pages/ResumeBuilder";
import PrivateRoute from "./components/PrivateRoute";
import CareerGuidance from "./pages/carrer-guidance";
import Contact from "./pages/contact";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import ATSChecker from "./pages/ATSChecker";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import ResumeView from "./pages/ResumeView";
import Dashboard from "./pages/Dashboard";
import InterviewPrep from "./pages/InterviewPrep";
import LinkedInOptimizer from "./pages/LinkedInOptimizer";
import LinkedInCallback from "./pages/LinkedInCallback";
import ResumeVersionHistory from "./pages/ResumeVersionHistory";
import { usePageTracker } from "./hooks/usePageTracker";
import { ToastProvider } from "./context/ToastContext";
import axios from "axios";

// Global interceptor for auto-logout when session expires
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("uname");
      localStorage.removeItem("uemail");
      localStorage.removeItem("uprofilepic");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

function AppRoutes() {
  usePageTracker();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("uname");
          localStorage.removeItem("uemail");
          localStorage.removeItem("uprofilepic");
          window.location.href = "/login";
        }
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("uname");
        localStorage.removeItem("uemail");
        localStorage.removeItem("uprofilepic");
        window.location.href = "/login";
      }
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/carrier" element={<CareerGuidance />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/ats-checker" element={<ATSChecker />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/r/:shareId" element={<ResumeView />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/linkedin-optimizer" element={<LinkedInOptimizer />} />
      <Route path="/interview-prep" element={<InterviewPrep />} />
      <Route path="/linkedin-callback" element={<LinkedInCallback />} />
      <Route path="/resume-history/:resumeId" element={<ResumeVersionHistory />} />

      <Route
        path="/resume-builder"
        element={
          <PrivateRoute>
            <ResumeBuilder />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<NotFound />} />

      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

function App() {
  return (
    <ToastProvider>
      <div className="app-shell">
        <main className="container">
          <AppRoutes />
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;
