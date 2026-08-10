import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Sparkles, Copy, Check, Edit2 } from "lucide-react";

const API = process.env.REACT_APP_API_URL || "";

export default function LinkedInOptimizer() {
  const navigate = useNavigate();
  const [aboutText, setAboutText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [optimized, setOptimized] = useState("");
  const [usesLeft, setUsesLeft] = useState(2);

  useEffect(() => {
    // no-op for now; could fetch usage/history later
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (!aboutText.trim() || aboutText.trim().length < 10) {
      setError("Please provide at least 10 characters of About text.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    setLoading(true);
    setOptimized("");
    try {
      const res = await axios.post(
        `${API}/api/ai/linkedin-optimizer`,
        { aboutText: aboutText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.sts === 0) {
        setOptimized(res.data.optimizedText || "");
        if (typeof res.data.usesLeft === "number") setUsesLeft(res.data.usesLeft);
      } else {
        setError(res.data.msg || "Failed to optimize. Please try again.");
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.limitReached) {
        setError(data.msg || "Daily limit reached.");
        setUsesLeft(0);
      } else {
        setError(data?.msg || "Network error. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!optimized) return;
    navigator.clipboard.writeText(optimized);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-br from-[#003f6b] via-[#0076BC] to-[#005a8e] px-6 py-14 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> AI-Powered · LinkedIn
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">LinkedIn About Optimizer</h1>
          <p className="text-blue-200 text-base max-w-xl mx-auto">Paste your LinkedIn "About" section and get an optimized, keyword-rich version tailored for visibility and engagement.</p>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 space-y-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-black text-slate-800 mb-4">Optimize Your LinkedIn About</h2>

          <div className="space-y-4">
            <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">About Text</label>
            <textarea
              rows={8}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Paste your current LinkedIn About summary here..."
              className="w-full border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0076BC]/30 focus:border-[#0076BC] transition"
            />

            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Daily limit: 2 optimizations</span>
              <span className={`font-bold ${usesLeft === 0 ? "text-red-500" : "text-emerald-600"}`}>{usesLeft} use{usesLeft !== 1 ? "s" : ""} left today</span>
            </div>

            {error && <div className="border text-sm px-4 py-3 rounded-xl font-medium bg-red-50 border-red-200 text-red-700">{error}</div>}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading || usesLeft <= 0}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#0076BC] to-[#005a8e] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />} {loading ? "Optimizing…" : "Optimize"}
              </button>
              <button
                onClick={() => { setAboutText(""); setOptimized(""); setError(""); }}
                className="py-3.5 px-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold hover:bg-slate-100 transition"
              >Clear</button>
            </div>
          </div>
        </div>

        {optimized && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-black text-slate-800">Optimized About</h3>
              <div className="flex items-center gap-2">
                <button onClick={handleCopy} className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition">{/**/}Copy</button>
                <button onClick={() => { navigator.clipboard.writeText(optimized); }} className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition">Copy</button>
              </div>
            </div>

            <pre className="whitespace-pre-wrap text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">{optimized}</pre>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
