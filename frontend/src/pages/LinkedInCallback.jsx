import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useToast } from "../context/ToastContext";
import { Loader2 } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "";

const LinkedInCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      showToast("LinkedIn authentication cancelled or failed.", "error");
      navigate("/login");
      return;
    }

    if (code) {
      // Send code to backend
      axios.post(`${API}/api/auth/linkedin`, {
        code,
        redirectUri: `${window.location.origin}/linkedin-callback`
      })
      .then((res) => {
        if (res.data.sts === 0) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("uname", res.data.uname);
          localStorage.setItem("uemail", res.data.uemail);
          if (res.data.uprofilepic) localStorage.setItem("uprofilepic", res.data.uprofilepic);
          
          showToast(res.data.msg);
          navigate("/dashboard");
        } else {
          showToast(res.data.msg || "Authentication failed", "error");
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("LinkedIn Auth Error:", err);
        showToast(err.response?.data?.msg || "Something went wrong during LinkedIn login.", "error");
        navigate("/login");
      });
    } else {
      navigate("/login");
    }
  }, [location, navigate, showToast]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-[#0076BC] animate-spin" />
        <p className="text-slate-500 text-sm font-semibold animate-pulse">Authenticating with LinkedIn…</p>
      </div>
    </div>
  );
};

export default LinkedInCallback;
