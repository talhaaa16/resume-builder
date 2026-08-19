import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Target, Sparkles, Heart, Code2,
  Briefcase, FileSearch, ArrowRight,
  CheckCircle2, Zap, Shield,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "4+", label: "Resume Templates", icon: FileSearch, color: "text-blue-600", bg: "bg-blue-50" },
  { value: "AI", label: "Gemini Powered", icon: Sparkles, color: "text-emerald-600", bg: "bg-emerald-50" },
  { value: "Free", label: "Always Free Core", icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
  { value: "100%", label: "Open Source", icon: Code2, color: "text-violet-600", bg: "bg-violet-50" },
];

const VALUES = [
  {
    icon: Target,
    title: "Built for Indian Students",
    desc: "YuvaNaukri was designed specifically for freshers and students navigating India's competitive job market — from campus placements to first jobs.",
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    icon: Sparkles,
    title: "AI-First Approach",
    desc: "Powered by Google Gemini, every feature — from resume writing to ATS checking — uses cutting-edge AI to give you an unfair advantage.",
    color: "from-emerald-500 to-green-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  {
    icon: Shield,
    title: "Privacy by Default",
    desc: "Your resume data is yours. We never sell your data, never show your personal info to employers without your consent, and store everything securely.",
    color: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    text: "text-violet-700",
  },
  {
    icon: Zap,
    title: "Fast & Accessible",
    desc: "No bloated software to install. Open any browser, sign up in 30 seconds, and have a professional resume ready to download in minutes.",
    color: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
];


const FEATURES = [
  "Real-time resume builder with live preview",
  "4 premium ATS-friendly templates",
  "AI-powered content improvement",
  "PDF resume upload & full ATS analysis",
  "AI Interview Prep with 10 Q&As per session",
  "LinkedIn OAuth login & LinkedIn Profile Optimizer",
  "Public resume sharing links",
  "Live job board",
  "Career guidance & roadmaps",
  "Secure JWT authentication",
  "Daily AI usage limits (fair use)",
];

const TIMELINE = [
  { year: "2024", title: "Idea & Planning", desc: "Identified the gap — most free resume builders look terrible on ATS scanners. Started building." },
  { year: "Early 2025", title: "v1.0 Launch", desc: "Launched with core resume builder, 4 templates, PDF export, and user authentication." },
  { year: "Mid 2025", title: "AI Integration", desc: "Added Gemini AI for content improvement and the full ATS Checker with PDF upload." },
  { year: "Late 2025", title: "Growing Platform", desc: "Added Jobs Board, Career Guidance, Admin Panel, Interview Prep, and continued improving the experience." },
  { year: "2026", title: "LinkedIn & Beyond", desc: "Launched LinkedIn OAuth login, LinkedIn Profile Optimizer, resume sharing links, and a fully redesigned User Dashboard." },
];

// ─── Components ───────────────────────────────────────────────────────────────

function StatCard({ value, label, icon: Icon, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <div>
        <p className={`text-3xl font-black ${color}`}>{value}</p>
        <p className="text-sm text-slate-500 font-medium mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function ValueCard({ icon: Icon, title, desc, color, bg, text }) {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#003f6b] via-[#0076BC] to-[#00A86B] py-20 px-6 relative overflow-hidden">
        {/* Blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white border border-white/30 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
            <Heart className="w-4 h-4" /> Made with passion in India
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Helping Every Indian Student<br />
            <span className="text-emerald-300">Land Their Dream Job</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            YuvaNaukri is a free, AI-powered career platform built specifically for Indian freshers and students — because your first job shouldn't depend on how expensive your resume tool is.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <button
              onClick={() => navigate("/resume-builder")}
              className="flex items-center gap-2 px-8 py-3.5 bg-white text-[#0076BC] rounded-xl font-bold hover:bg-blue-50 transition shadow-lg"
            >
              Build Your Resume <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="flex items-center gap-2 px-8 py-3.5 bg-white/20 text-white border border-white/30 rounded-xl font-bold hover:bg-white/30 transition backdrop-blur-sm"
            >
              Explore Jobs
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-16 space-y-20">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {STATS.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* ── Our Story ── */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-[#0076BC] text-sm font-bold uppercase tracking-widest mb-4">
              <Target className="w-4 h-4" /> Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-5 leading-tight">
              Built by a Student,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0076BC] to-[#00A86B]">For Students</span>
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                YuvaNaukri started as a college project with a simple observation: most free resume builders produce resumes that get rejected by Applicant Tracking Systems before a human ever reads them.
              </p>
              <p>
                Indian students spend hours crafting resumes, only to lose out because their tool didn't know about ATS formatting, keyword optimization, or modern hiring workflows.
              </p>
              <p>
                So we built the tool we wished existed — a platform that combines professional resume templates, AI-powered content improvement, live ATS scoring, and a jobs board, all completely free.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-5">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0076BC] to-[#00A86B] flex items-center justify-center shrink-0 shadow-md">
                    <span className="text-white text-xs font-black">{i + 1}</span>
                  </div>
                  {i < TIMELINE.length - 1 && <div className="w-0.5 flex-1 bg-gradient-to-b from-[#0076BC]/30 to-transparent mt-2" />}
                </div>
                <div className="pb-5">
                  <span className="text-xs font-bold text-[#0076BC] uppercase tracking-wider">{item.year}</span>
                  <h3 className="text-base font-bold text-slate-800 mt-0.5">{item.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Values ── */}
        <div>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-[#00A86B] text-sm font-bold uppercase tracking-widest mb-3">
              <Heart className="w-4 h-4" /> What We Stand For
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => <ValueCard key={i} {...v} />)}
          </div>
        </div>

        {/* ── What's Inside ── */}
        <div className="bg-gradient-to-br from-slate-900 to-[#0d1f35] rounded-3xl p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-widest mb-4">
                <Zap className="w-4 h-4" /> Full Feature List
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                Everything you need,<br />
                <span className="text-emerald-400">nothing you don't</span>
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Every feature on YuvaNaukri has a clear purpose — to help you get hired faster. No paywalls on core features.
              </p>
            </div>
            <ul className="space-y-3">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>


        {/* ── CTA ── */}
        <div className="bg-gradient-to-r from-[#0076BC] to-[#00A86B] rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 0%, transparent 60%), radial-gradient(circle at 80% 50%, #fff 0%, transparent 60%)" }} />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              Join students across India who are using YuvaNaukri to build ATS-optimized resumes and find better opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="flex items-center gap-2 px-8 py-3.5 bg-white text-[#0076BC] rounded-xl font-bold hover:bg-blue-50 transition shadow-lg"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/contact")}
                className="flex items-center gap-2 px-8 py-3.5 bg-white/20 text-white border border-white/30 rounded-xl font-bold hover:bg-white/30 transition"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
