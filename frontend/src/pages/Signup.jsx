import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { FileText, Briefcase, Sparkles, CheckCircle, Linkedin } from "lucide-react";

const Regi = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [userregi, setUserRegi] = useState({
    user_name: "",
    user_email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserRegi({
      ...userregi,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;
    const finalApiUrl = (apiUrl && apiUrl !== "undefined") ? apiUrl : "";

    if (!userregi.user_name || !userregi.user_email || !userregi.password) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(userregi.password)) {
      showToast("Password too weak! (Min 6 chars, A-z, 0-9)", "error");
      return;
    }

    try {
      const res = await axios.post(
        `${finalApiUrl}/api/auth/adduser`,
        userregi
      );
      showToast("Account created successfully! Please login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.msg || "Signup failed. Please try again.";
      showToast(errorMsg, "error");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      {/* Branding Section - Banner on Mobile, Sidebar on Desktop */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#00A86B] to-[#0076BC] p-8 lg:p-12 flex flex-col justify-between text-white relative overflow-hidden min-h-[300px] lg:min-h-screen">
        <div className="absolute -top-24 -left-24 w-64 h-64 lg:w-96 lg:h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 lg:w-96 lg:h-96 bg-black/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8 lg:mb-16">
            <div className="bg-white p-2 rounded-lg text-[#00A86B]">
              <FileText className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            <span className="text-xl lg:text-2xl font-black tracking-widest">YUVANAUKRI</span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-black mb-4 lg:mb-6 leading-tight">
            Join the Network of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Top Professionals
            </span>
          </h1>
          <p className="text-sm lg:text-lg text-white/80 max-w-md mb-8 lg:mb-12">
            Your dream job is just a few clicks away. Sign up to build your stellar resume and connect with employers.
          </p>

          <div className="hidden lg:block space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">100% Free to Use</h3>
                <p className="text-sm text-white/70">Create resumes and apply for jobs at zero cost.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Direct Applications</h3>
                <p className="text-sm text-white/70">Apply to verified companies instantly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block relative z-10 text-xs lg:text-sm text-white/60 font-medium mt-8 lg:mt-0">
          © {new Date().getFullYear()} YuvaNaukri. All rights reserved.
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-transparent lg:bg-white">
        <div className="w-full max-w-md bg-white p-8 lg:p-0 rounded-3xl lg:rounded-none shadow-xl lg:shadow-none -mt-24 lg:mt-0 relative z-20">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500">Sign up to kickstart your career journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                name="user_name"
                value={userregi.user_name}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A86B] focus:border-transparent transition-all bg-slate-50"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                name="user_email"
                value={userregi.user_email}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A86B] focus:border-transparent transition-all bg-slate-50"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={userregi.password}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A86B] focus:border-transparent transition-all bg-slate-50"
                placeholder="Create a strong password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#00A86B] hover:bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg transition duration-200 mt-2 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              Sign Up <Sparkles className="w-5 h-5" />
            </button>

            <div className="flex items-center my-2">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-3 text-xs text-slate-400 font-bold uppercase tracking-wide">Or</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            <button
              type="button"
              onClick={() => {
                const clientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID || "";
                const redirectUri = encodeURIComponent(`${window.location.origin}/linkedin-callback`);
                const scope = encodeURIComponent("openid profile email");
                window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=signup&scope=${scope}`;
              }}
              className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white py-4 rounded-xl font-bold text-lg transition duration-200 shadow-md flex items-center justify-center gap-3"
            >
              <Linkedin className="w-5 h-5" /> Continue with LinkedIn
            </button>

            <p className="text-center text-slate-600 mt-4 font-medium">
              Already have an account?{" "}
              <a href="/login" className="text-[#0076BC] font-bold hover:underline">
                Sign in here
              </a>
            </p>
          </form>

          {/* Mobile Copyright (Visible only on small screens) */}
          <div className="lg:hidden text-center text-slate-400 text-xs mt-12 pb-4">
            © {new Date().getFullYear()} YuvaNaukri. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regi;
