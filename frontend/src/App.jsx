import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Jobs from "./pages/Jobs";
import ResumeBuilder from "./pages/ResumeBuilder";
import PrivateRoute from "./components/PrivateRoute";
import ChatBot from "./components/chatbot/ChatBot";
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
import { isTokenExpired, logoutAndRedirect } from "./utils/session";

// Single global handler for expired / invalid sessions. Admin requests are
// skipped: a wrong admin password must not log the normal user out.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAdminRequest = error.config?.url?.includes("/api/admin");
    if (error.response?.status === 401 && !isAdminRequest) {
      const weekly = /weekly session reset/i.test(error.response.data?.msg || "");
      logoutAndRedirect(weekly ? "weekly" : "expired");
    }
    return Promise.reject(error);
  }
);

function AppRoutes() {
  usePageTracker();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isTokenExpired(token)) {
      logoutAndRedirect("expired");
    }
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/career-guidance" element={<CareerGuidance />} />
      <Route path="/carrier" element={<Navigate to="/career-guidance" replace />} />
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

      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />

      <Route path="*" element={<NotFound />} />
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
        <ChatBot />
      </div>
    </ToastProvider>
  );
}

export default App;
