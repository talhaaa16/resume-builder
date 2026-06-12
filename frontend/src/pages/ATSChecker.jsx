import React, { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { gsap } from "gsap";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import {
  Upload, FileText, Sparkles, CheckCircle2, XCircle, AlertTriangle,
  ChevronDown, ChevronUp, Loader2, Lightbulb, Target, Award,
  BookOpen, Briefcase, Code2, LayoutTemplate, TrendingUp, TrendingDown,
  RefreshCw, User, BarChart3, ShieldCheck, FileSearch, X, Clock,
} from "lucide-react";

// ─── Animated Score Ring ──────────────────────────────────────────────────────
function ScoreRing({ score, size = 160, strokeWidth = 14 }) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#00A86B" : score >= 60 ? "#0076BC" : score >= 40 ? "#f59e0b" : "#ef4444";
  const textColor = score >= 80 ? "text-emerald-600" : score >= 60 ? "text-blue-600" : score >= 40 ? "text-amber-500" : "text-red-500";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-black ${textColor}`}>{score}</span>
        <span className="text-xs text-slate-400 font-medium">/ 100</span>
      </div>
    </div>
  );
}

// ─── Mini Score Bar ──────────────────────────────────────────────────────────
function ScoreBar({ label, score, icon: Icon, color }) {
  const barColor = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-blue-500" : score >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-lg ${color}`}><Icon className="w-3.5 h-3.5" /></div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-slate-600">{label}</span>
          <span className="text-xs font-bold text-slate-700">{score}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${barColor} transition-all duration-1000`} style={{ width: `${score}%` }} />
        </div>
      </div>
    </div>
  );
}

// ─── Section Analysis Accordion ───────────────────────────────────────────────
function SectionCard({ icon: Icon, title, score, feedback, iconBg }) {
  const [open, setOpen] = useState(false);
  const scoreColor = score >= 80 ? "text-emerald-600 bg-emerald-50" : score >= 60 ? "text-blue-600 bg-blue-50" : score >= 40 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition text-left">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${iconBg}`}><Icon className="w-4 h-4" /></div>
          <span className="font-semibold text-slate-700 text-sm">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${scoreColor}`}>{score}%</span>
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>
      {open && <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-3 bg-slate-50/50">{feedback}</div>}
    </div>
  );
}

// ─── Verdict Config ───────────────────────────────────────────────────────────
const VERDICT = {
  Excellent:    { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: Award },
  Good:         { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    icon: CheckCircle2 },
  Fair:         { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   icon: AlertTriangle },
  "Needs Work": { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200",     icon: XCircle },
};

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({ file, onFile, onRemove, loading }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") onFile(dropped);
  }, [onFile]);

  if (file) return (
    <div className="flex items-center gap-4 p-5 bg-blue-50 border-2 border-blue-200 rounded-2xl">
      <div className="p-3 bg-blue-100 rounded-xl shrink-0"><FileText className="w-7 h-7 text-[#0076BC]" /></div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 truncate">{file.name}</p>
        <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB · PDF</p>
      </div>
      {!loading && (
        <button onClick={onRemove} className="p-2 hover:bg-blue-200 rounded-lg transition shrink-0"><X className="w-4 h-4 text-slate-500" /></button>
      )}
    </div>
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 transition-all ${dragging ? "border-[#0076BC] bg-blue-50" : "border-slate-300 bg-white hover:border-[#0076BC] hover:bg-blue-50/30"}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0076BC] to-[#00A86B] flex items-center justify-center shadow-lg">
        <Upload className="w-8 h-8 text-white" />
      </div>
      <div className="text-center">
        <p className="font-bold text-slate-700 text-lg">Drop your resume here</p>
        <p className="text-slate-400 text-sm mt-1">or <span className="text-[#0076BC] font-semibold">click to browse</span></p>
        <p className="text-xs text-slate-400 mt-2">PDF only · Max 5MB</p>
      </div>
      <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => onFile(e.target.files[0])} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ATSChecker() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [usesLeft, setUsesLeft] = useState(null);
  const [limitReached, setLimitReached] = useState(false);

  const resultRef = useRef(null);
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const limitBannerRef = useRef(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // ── GSAP: Hero entrance animation ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".hero-badge",  { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
        .fromTo(".hero-title",  { y: 30, opacity: 0 },  { y: 0, opacity: 1, duration: 0.7 }, "-=0.3")
        .fromTo(".hero-sub",    { y: 20, opacity: 0 },  { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
        .fromTo(".hero-blob-1", { scale: 0 }, { scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }, 0)
        .fromTo(".hero-blob-2", { scale: 0 }, { scale: 1, duration: 1.5, ease: "elastic.out(1, 0.5)" }, 0.2);

      gsap.to(".hero-blob-1", { x: 20, y: -15, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".hero-blob-2", { x: -25, y: 10, duration: 7, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // ── GSAP: Form entrance animation ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".form-card",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: "power3.out", delay: 0.5 }
      );
    }, formRef);
    return () => ctx.revert();
  }, []);

  // ── GSAP: Results entrance animation ──
  useEffect(() => {
    if (!result) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".result-card",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: "power3.out" }
      );
    }, resultRef);
    return () => ctx.revert();
  }, [result]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) { showToast("Please login to use the ATS Checker.", "info"); navigate("/login"); return; }
    if (!file) { showToast("Please upload your resume PDF first.", "error"); return; }

    setLoading(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      if (jobDescription.trim()) formData.append("jobDescription", jobDescription.trim());

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || ""}/api/ai/analyze-resume`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );

      if (res.data.sts === 0) {
        setResult(res.data.data);
        setFileName(res.data.fileName || file.name);
        setUsesLeft(res.data.usesLeft ?? null);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      } else {
        showToast(res.data.msg || "Analysis failed.", "error");
      }
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.limitReached) {
        setLimitReached(true);
        // Animate limit banner
        setTimeout(() => {
          gsap.fromTo(limitBannerRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" });
        }, 50);
      }
      showToast(errData?.msg || "Analysis failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null); setFile(null); setJobDescription(""); setFileName("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const verdictCfg = result ? (VERDICT[result.verdict] || VERDICT["Fair"]) : null;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* ── Hero ── */}
      <div ref={heroRef} className="bg-gradient-to-br from-[#003f6b] via-[#0076BC] to-[#00A86B] py-16 px-6 text-center relative overflow-hidden">
        <div className="hero-blob-1 absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="hero-blob-2 absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="hero-badge inline-flex items-center gap-2 bg-white/20 text-white border border-white/30 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-5 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: "3s" }} /> AI Powered · Gemini 2.5
          </div>
          <h1 className="hero-title text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
            Resume <span className="text-emerald-300">ATS Checker</span>
          </h1>
          <p className="hero-sub text-blue-100 text-lg max-w-xl mx-auto">
            Upload your resume PDF and get a full AI score, keyword analysis, section feedback, and actionable improvements.
          </p>
          <div className="hero-sub mt-5 inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 px-4 py-1.5 rounded-full text-sm backdrop-blur-sm">
            <Clock className="w-4 h-4" /> 2 free analyses per day
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">

        {/* ── Daily Limit Reached Banner ── */}
        {limitReached && (
          <div ref={limitBannerRef} className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
            <div className="p-3 bg-amber-100 rounded-xl shrink-0">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-amber-800 text-base">Daily Limit Reached</p>
              <p className="text-amber-700 text-sm mt-1">
                You've used all <strong>2 free ATS analyses</strong> for today. Your limit will reset automatically at midnight.
                Come back tomorrow for more! 🚀
              </p>
            </div>
          </div>
        )}

        {/* ── Remaining Uses Badge ── */}
        {usesLeft !== null && !limitReached && (
          <div className="mb-4 flex justify-end">
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${usesLeft > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
              <Clock className="w-3 h-3" />
              {usesLeft} {usesLeft === 1 ? "analysis" : "analyses"} left today
            </span>
          </div>
        )}

        {/* ── Upload Form ── */}
        {!result && (
          <form ref={formRef} onSubmit={handleAnalyze} className="space-y-6">
            <div className="form-card bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-[#0076BC]" /> Upload Your Resume
              </h2>
              <UploadZone file={file} onFile={setFile} onRemove={() => setFile(null)} loading={loading} />
            </div>

            <div className="form-card bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-[#00A86B]" />
                Job Description
                <span className="text-xs font-normal text-slate-400 ml-1">(optional — adds keyword matching)</span>
              </h2>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={7}
                placeholder="Paste the job description here to get keyword match analysis…"
                className="w-full p-4 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A86B] resize-none transition"
              />
            </div>

            <div className="form-card flex justify-center">
              <button
                type="submit"
                disabled={loading || !file || limitReached}
                className="flex items-center gap-3 px-12 py-4 bg-gradient-to-r from-[#0076BC] to-[#00A86B] text-white font-bold text-base rounded-2xl shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing…</> : <><Sparkles className="w-5 h-5" /> Analyze My Resume</>}
              </button>
            </div>
          </form>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-5">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#0076BC] to-[#00A86B] flex items-center justify-center shadow-2xl animate-pulse">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div className="text-center">
              <p className="text-slate-700 text-xl font-bold">AI is reviewing your resume…</p>
              <p className="text-slate-400 mt-1">This usually takes 10–15 seconds</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {["Reading PDF", "Analyzing content", "Scoring sections", "Generating feedback"].map((step, i) => (
                <span key={i} className="text-xs bg-white border border-slate-200 text-slate-500 px-3 py-1 rounded-full shadow-sm animate-pulse" style={{ animationDelay: `${i * 0.4}s` }}>{step}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {result && !loading && verdictCfg && (
          <div ref={resultRef} className="space-y-6">

            {/* File + uses left */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <FileText className="w-4 h-4" />
                <span>Results for <strong className="text-slate-700">{fileName}</strong></span>
              </div>
              {usesLeft !== null && (
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${usesLeft > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                  <Clock className="w-3 h-3" /> {usesLeft} {usesLeft === 1 ? "analysis" : "analyses"} left today
                </span>
              )}
            </div>

            {/* Overall Score + Summary */}
            <div className="result-card grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col items-center gap-5">
                <ScoreRing score={result.overallScore} />
                <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border font-bold text-sm ${verdictCfg.bg} ${verdictCfg.text} ${verdictCfg.border}`}>
                  <verdictCfg.icon className="w-4 h-4" />{result.verdict}
                </div>
                <p className="text-xs text-slate-500 text-center font-medium">Overall Resume Score</p>
              </div>
              <div className="md:col-span-2 bg-white rounded-2xl p-7 shadow-sm border border-slate-100 flex flex-col gap-5">
                <div>
                  <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#0076BC]" /> AI Summary
                  </h2>
                  <p className="text-slate-600 text-sm leading-relaxed">{result.summary}</p>
                </div>
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <ScoreBar label="ATS Compatibility" score={result.atsScore} icon={ShieldCheck} color="bg-blue-50 text-blue-600" />
                  <ScoreBar label="Content Quality" score={result.contentScore} icon={FileText} color="bg-violet-50 text-violet-600" />
                  <ScoreBar label="Formatting" score={result.formattingScore} icon={LayoutTemplate} color="bg-amber-50 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="result-card grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500" /> Strengths</h3>
                <ul className="space-y-3">
                  {result.strengths?.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingDown className="w-5 h-5 text-red-500" /> Areas to Improve</h3>
                <ul className="space-y-3">
                  {result.improvements?.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />{s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Keywords (only if matched/missing exist) */}
            {(result.matchedKeywords?.length > 0 || result.missingKeywords?.length > 0) && (
              <div className="result-card grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Matched Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.matchedKeywords.map((kw, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />{kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><XCircle className="w-5 h-5 text-red-500" /> Missing Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords?.length > 0 ? result.missingKeywords.map((kw, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-600 border border-red-200">
                        <XCircle className="w-3 h-3" />{kw}
                      </span>
                    )) : <p className="text-sm text-slate-400">🎉 No critical keywords missing!</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Section Analysis */}
            <div className="result-card bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><Target className="w-5 h-5 text-[#0076BC]" /> Section-by-Section Analysis</h3>
              <div className="space-y-3">
                {result.sectionAnalysis?.contactInfo && <SectionCard icon={User} title="Contact Information" score={result.sectionAnalysis.contactInfo.score} feedback={result.sectionAnalysis.contactInfo.feedback} iconBg="bg-slate-100 text-slate-600" />}
                {result.sectionAnalysis?.summary && <SectionCard icon={FileText} title="Professional Summary" score={result.sectionAnalysis.summary.score} feedback={result.sectionAnalysis.summary.feedback} iconBg="bg-violet-50 text-violet-600" />}
                {result.sectionAnalysis?.skills && <SectionCard icon={Code2} title="Skills" score={result.sectionAnalysis.skills.score} feedback={result.sectionAnalysis.skills.feedback} iconBg="bg-blue-50 text-blue-600" />}
                {result.sectionAnalysis?.experience && <SectionCard icon={Briefcase} title="Work Experience" score={result.sectionAnalysis.experience.score} feedback={result.sectionAnalysis.experience.feedback} iconBg="bg-indigo-50 text-indigo-600" />}
                {result.sectionAnalysis?.education && <SectionCard icon={BookOpen} title="Education" score={result.sectionAnalysis.education.score} feedback={result.sectionAnalysis.education.feedback} iconBg="bg-amber-50 text-amber-600" />}
              </div>
            </div>

            {/* Top Suggestions */}
            {result.topSuggestions?.length > 0 && (
              <div className="result-card bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><Lightbulb className="w-5 h-5 text-amber-500" /> Top Actionable Suggestions</h3>
                <ol className="space-y-4">
                  {result.topSuggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#0076BC] to-[#00A86B] text-white text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                      <p className="text-slate-600 text-sm leading-relaxed">{s}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Reset */}
            <div className="flex justify-center pt-4 pb-4">
              <button onClick={handleReset} className="flex items-center gap-2 px-8 py-3 border-2 border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-100 transition">
                <RefreshCw className="w-4 h-4" /> Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
