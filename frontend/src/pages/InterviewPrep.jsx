import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Sparkles, ChevronDown, ChevronUp, Copy, Check,
  Briefcase, Brain, Heart, Users, HelpCircle,
  BookOpen, Lightbulb, Search, ArrowRight, RefreshCw,
  Star, MessageSquare, Target, History, Clock,
} from "lucide-react";

const API = process.env.REACT_APP_API_URL || "";

const CATEGORY_CONFIG = {
  Behavioral:    { color: "bg-violet-100 text-violet-700 border-violet-200",  icon: Heart },
  Technical:     { color: "bg-blue-100 text-blue-700 border-blue-200",        icon: Brain },
  Situational:   { color: "bg-amber-100 text-amber-700 border-amber-200",     icon: Target },
  HR:            { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: Users },
  "Role-Specific": { color: "bg-rose-100 text-rose-700 border-rose-200",      icon: Briefcase },
};

const EXPERIENCE_LEVELS = [
  { value: "fresher", label: "Fresher (0–1 yr)" },
  { value: "junior",  label: "Junior (1–3 yrs)" },
  { value: "mid",     label: "Mid-Level (3–6 yrs)" },
  { value: "senior",  label: "Senior (6+ yrs)" },
];

const POPULAR_ROLES = [
  "Software Engineer", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "Data Scientist", "Product Manager",
  "UI/UX Designer", "DevOps Engineer", "Business Analyst", "Marketing Executive",
];

function QuestionCard({ q, index }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cfg = CATEGORY_CONFIG[q.category] || CATEGORY_CONFIG["HR"];
  const Icon = cfg.icon;

  const handleCopy = () => {
    navigator.clipboard.writeText(`Q: ${q.question}\n\nA: ${q.answer}\n\nTip: ${q.tip}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${open ? "border-[#0076BC]/30" : "border-slate-100"}`}>
      {/* Question header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-6 py-5 flex items-start gap-4 group"
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-sm mt-0.5 ${open ? "bg-[#0076BC] text-white" : "bg-slate-100 text-slate-500"} transition-colors`}>
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cfg.color}`}>
              <Icon className="w-3 h-3" /> {q.category}
            </span>
          </div>
          <p className="text-slate-800 font-semibold text-sm leading-relaxed pr-4">{q.question}</p>
        </div>
        <div className={`shrink-0 mt-1 transition-transform ${open ? "rotate-180" : ""}`}>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </div>
      </button>

      {/* Answer panel */}
      {open && (
        <div className="px-6 pb-5 border-t border-slate-50">
          {/* Model Answer */}
          <div className="mt-4 mb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-[#0076BC]" />
              <span className="text-xs font-bold text-[#0076BC] uppercase tracking-wide">Model Answer</span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              {q.answer}
            </p>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 font-medium">{q.tip}</p>
          </div>

          {/* Copy */}
          <div className="flex justify-end mt-3">
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                copied ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy Q&A</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterviewPrep() {
  const navigate = useNavigate();
  const [jobRole, setJobRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("fresher");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [openAll, setOpenAll] = useState(false);
  const [usesLeft, setUsesLeft] = useState(2);
  const [history, setHistory] = useState([]);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get(`${API}/api/ai/my-interview-preps`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data.sts === 0) setHistory(res.data.preps);
      }).catch(err => console.error(err));
    }
  }, []);

  const handleGenerate = async (role = jobRole) => {
    const trimmedRole = role.trim();
    if (!trimmedRole) { setError("Please enter a job role."); return; }
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post(
        `${API}/api/ai/interview-prep`,
        { jobRole: trimmedRole, experienceLevel },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.sts === 0) {
        const newPrep = {
          jobRole: res.data.jobRole,
          experienceLevel: res.data.experienceLevel,
          questions: res.data.questions,
          createdAt: new Date().toISOString()
        };
        setResult(newPrep);
        setJobRole(trimmedRole);
        setHistory(prev => [newPrep, ...prev]);
        if (typeof res.data.usesLeft === "number") setUsesLeft(res.data.usesLeft);
      } else {
        setError(res.data.msg || "Something went wrong.");
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.limitReached) {
        setError(data.msg);
        setUsesLeft(0);
      } else {
        setError(data?.msg || "Failed to connect. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const categoryCount = result
    ? Object.entries(
        result.questions.reduce((acc, q) => {
          acc[q.category] = (acc[q.category] || 0) + 1;
          return acc;
        }, {})
      )
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#003f6b] via-[#0076BC] to-[#005a8e] px-6 py-14 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-5 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> AI-Powered · 10 Questions
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Interview Prep</h1>
          <p className="text-blue-200 text-base max-w-xl mx-auto">
            Enter your target job role and get 10 tailored interview questions with model answers — crafted for Indian job market.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 space-y-8">

        {/* ── Input Card ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#0076BC]" /> Configure Your Prep
          </h2>

          <div className="space-y-4">
            {/* Job Role Input */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Job Role *</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={jobRole}
                  onChange={e => setJobRole(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleGenerate()}
                  placeholder="e.g. Frontend Developer, Data Scientist…"
                  className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0076BC]/30 focus:border-[#0076BC] transition"
                />
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wide">Experience Level</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EXPERIENCE_LEVELS.map(lvl => (
                  <button
                    key={lvl.value}
                    onClick={() => setExperienceLevel(lvl.value)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition ${
                      experienceLevel === lvl.value
                        ? "bg-[#0076BC] text-white border-[#0076BC] shadow-sm"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-[#0076BC] hover:text-[#0076BC]"
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular roles */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Popular Roles</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_ROLES.map(role => (
                  <button
                    key={role}
                    onClick={() => setJobRole(role)}
                    className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-full hover:bg-[#0076BC] hover:text-white hover:border-[#0076BC] transition font-medium"
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily usage indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Daily limit: 2 generations (includes regenerate)</span>
              <span className={`font-bold ${usesLeft === 0 ? "text-red-500" : "text-emerald-600"}`}>
                {usesLeft} use{usesLeft !== 1 ? "s" : ""} left today
              </span>
            </div>

            {error && (
              <div className={`border text-sm px-4 py-3 rounded-xl font-medium ${usesLeft === 0 ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                {error}
              </div>
            )}

            <button
              onClick={() => handleGenerate()}
              disabled={loading || usesLeft <= 0}
              className="w-full py-3.5 bg-gradient-to-r from-[#0076BC] to-[#005a8e] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Generating with AI…</>
                : usesLeft <= 0
                ? <>Limit Reached — Come Back Tomorrow</>
                : <><Sparkles className="w-4 h-4" /> Generate 10 Questions</>
              }
            </button>
          </div>
        </div>

        {/* ── Results ── */}
        {result && (
          <div className="space-y-5">
            {/* Stats header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <button 
                  onClick={() => { setResult(null); setJobRole(""); }}
                  className="text-xs font-bold text-slate-400 hover:text-[#0076BC] mb-2 flex items-center gap-1 transition-colors"
                >
                  ← Back to History
                </button>
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                  {result.questions.length} Questions for "{result.jobRole}"
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 capitalize">{result.experienceLevel} level • Click any question to reveal the answer</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpenAll(!openAll)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition"
                >
                  {openAll ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {openAll ? "Collapse All" : "Expand All"}
                </button>
                <button
                  onClick={() => handleGenerate()}
                  disabled={loading || usesLeft <= 0}
                  title={usesLeft <= 0 ? "Daily limit reached" : "Generate new questions"}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 bg-[#0076BC] text-white rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate {usesLeft <= 0 ? "(Limit Reached)" : `(${usesLeft} left)`}
                </button>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="flex flex-wrap gap-2">
              {categoryCount.map(([cat, count]) => {
                const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG["HR"];
                const Icon = cfg.icon;
                return (
                  <span key={cat} className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${cfg.color}`}>
                    <Icon className="w-3 h-3" /> {cat} <span className="opacity-60">×{count}</span>
                  </span>
                );
              })}
            </div>

            {/* Questions */}
            <div className="space-y-3">
              {result.questions.map((q, i) => (
                <QuestionCard key={q.id || i} q={q} index={i} forceOpen={openAll} />
              ))}
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#0076BC] to-[#00A86B] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-white font-black text-base">Ready for the interview?</p>
                <p className="text-blue-100 text-sm mt-0.5">Make sure your resume is ATS-ready before applying.</p>
              </div>
              <button
                onClick={() => navigate("/ats-checker")}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0076BC] rounded-xl font-bold text-sm hover:bg-blue-50 transition shrink-0 shadow-md"
              >
                Check ATS Score <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Empty state / History ── */}
        {!result && !loading && (
          <div className="space-y-8">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-[#0076BC]" />
              </div>
              <h3 className="font-bold text-slate-700 mb-1">Enter a role to get started</h3>
              <p className="text-slate-400 text-sm">AI will generate 10 realistic questions with model answers.</p>
            </div>
            
            {history.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                  <History className="w-4 h-4 text-[#0076BC]" /> Recent Preps
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {history.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setResult(item);
                        setJobRole(item.jobRole);
                        setExperienceLevel(item.experienceLevel);
                      }}
                      className="bg-white border border-slate-100 rounded-2xl p-4 text-left hover:border-[#0076BC] hover:shadow-md transition-all group"
                    >
                      <h4 className="font-bold text-slate-800 group-hover:text-[#0076BC] transition-colors line-clamp-1">{item.jobRole}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                        <span className="capitalize bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">{item.experienceLevel}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(item.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
