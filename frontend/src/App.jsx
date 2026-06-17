import { Routes, Route } from "react-router-dom";
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
import { usePageTracker } from "./hooks/usePageTracker";
import { ToastProvider } from "./context/ToastContext";

function AppRoutes() {
  usePageTracker();
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
