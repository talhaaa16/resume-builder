import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { FileText, Briefcase, Sparkles, Linkedin } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { showToast } = useToast();
  const [msg, setMsg] = useState(null);
  const [userlogin, setUserlogin] = useState({
    user_email: "",
    password: "",
  });

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("expired") === "true") {
      setMsg("Your session has expired. Please login again.");
    }
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserlogin({
      ...userlogin,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;
    const finalApiUrl = (apiUrl && apiUrl !== "undefined") ? apiUrl : "";

    try {
      const res = await axios.post(
        `${finalApiUrl}/api/auth/userlogin`,
        userlogin
      );

      if (res.data.sts === 0) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("uname", res.data.user.user_name);
        localStorage.setItem("uemail", res.data.user.user_email);
        localStorage.setItem("uprofilepic", res.data.user.profile_pic || "");

        showToast("Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setMsg(res.data.msg);
      }

    } catch (error) {
      console.error(error);
      if (error.response && error.response.data && error.response.data.msg) {
        setMsg(error.response.data.msg);
      } else {
        setMsg("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      {/* Branding Section - Banner on Mobile, Sidebar on Desktop */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#0076BC] to-[#00A86B] p-8 lg:p-12 flex flex-col justify-between text-white relative overflow-hidden min-h-[300px] lg:min-h-screen">
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 lg:w-96 lg:h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 lg:w-96 lg:h-96 bg-black/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8 lg:mb-16">
            <div className="bg-white p-2 rounded-lg text-[#0076BC]">
              <FileText className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            <span className="text-xl lg:text-2xl font-black tracking-widest">YUVANAUKRI</span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-black mb-4 lg:mb-6 leading-tight">
            Build Your Future <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
              One Step at a Time
            </span>
          </h1>
          <p className="text-sm lg:text-lg text-white/80 max-w-md mb-8 lg:mb-12">
            Create professional resumes, discover exciting job opportunities, and take the next step in your career journey.
          </p>

          <div className="hidden lg:block space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Smart Resume Builder</h3>
                <p className="text-sm text-white/70">ATS-friendly templates to get you hired.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Job Opportunities</h3>
                <p className="text-sm text-white/70">Find jobs that match your skills perfectly.</p>
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
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <input
                type="email"
                name="user_email"
                value={userlogin.user_email}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0076BC] focus:border-transparent transition-all bg-slate-50"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={userlogin.password}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0076BC] focus:border-transparent transition-all bg-slate-50"
                placeholder="Enter your password"
                required
              />
            </div>

            {msg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0"></span>
                {msg}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#0076BC] hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition duration-200 mt-2 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              Sign In <Sparkles className="w-5 h-5" />
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
                window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=login&scope=${scope}`;
              }}
              className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white py-4 rounded-xl font-bold text-lg transition duration-200 shadow-md flex items-center justify-center gap-3"
            >
              <Linkedin className="w-5 h-5" /> Continue with LinkedIn
            </button>

            <p className="text-center text-slate-600 mt-4 font-medium">
              Don’t have an account?{" "}
              <a href="/signup" className="text-[#00A86B] font-bold hover:underline">
                Create one now
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

export default Login;
