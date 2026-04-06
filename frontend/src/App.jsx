import { Routes, Route } from "react-router-dom";
// import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Jobs from "./pages/Jobs";
import ResumeBuilder from "./pages/ResumeBuilder";
import PrivateRoute from "./components/PrivateRoute";
import CareerGuidance from "./pages/carrer-guidance";

function App() {
  return (
    <div className="app-shell">
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/carrier" element={<CareerGuidance/>} />

          <Route
            path="/resume-builder"
            element={
              <PrivateRoute>
                <ResumeBuilder />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
