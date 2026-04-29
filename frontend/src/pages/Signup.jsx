import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { FileText, Briefcase, Sparkles, CheckCircle } from "lucide-react";

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

    try {
      const res = await axios.post(
        `${finalApiUrl}/api/auth/adduser`,
        userregi
      );
      showToast("Account created successfully! Please login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      showToast("Signup failed. Please try again.", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Side - Branding/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#00A86B] to-[#0076BC] p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-16">
            <div className="bg-white p-2 rounded-lg text-[#00A86B]">
              <FileText className="w-8 h-8" />
            </div>
            <span className="text-2xl font-black tracking-widest">YUVANAUKRI</span>
          </div>

          <h1 className="text-5xl font-black mb-6 leading-tight">
            Join the Network of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              Top Professionals
            </span>
          </h1>
          <p className="text-lg text-white/80 max-w-md mb-12">
            Your dream job is just a few clicks away. Sign up to build your stellar resume and connect with employers.
          </p>

          <div className="space-y-6">
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

        <div className="relative z-10 text-sm text-white/60 font-medium">
          © {new Date().getFullYear()} YuvaNaukri. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="flex lg:hidden items-center gap-2 mb-10 justify-center">
            <div className="bg-[#00A86B] p-2 rounded-lg text-white">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-widest text-[#00A86B]">YUVANAUKRI</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
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

            <p className="text-center text-slate-600 mt-6 font-medium">
              Already have an account?{" "}
              <a href="/login" className="text-[#0076BC] font-bold hover:underline">
                Sign in here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Regi;
