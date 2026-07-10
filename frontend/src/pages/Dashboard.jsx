import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FileText, Zap, Shield, ArrowRight, Plus, Share2,
  Edit2, Clock, CheckCircle2, AlertCircle, User,
  Sparkles, Briefcase, Target, ExternalLink, Calendar,
} from "lucide-react";

const API = process.env.REACT_APP_API_URL || "";


function UsageBar({ used, limit, label, color, icon: Icon }) {
  const pct = Math.min((used / limit) * 100, 100);
  const remaining = limit - used;
  const isExhausted = remaining <= 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg ${color.bg} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${color.text}`} />
          </div>
          <span className="text-sm font-bold text-slate-700">{label}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isExhausted ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"}`}>
          {isExhausted ? "Limit Reached" : `${remaining} left`}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all duration-700 ${isExhausted ? "bg-red-400" : color.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-400">{used} of {limit} used</p>
    </div>
  );
}

function ResumeCard({ resume, onEdit, onShare }) {
  const name = resume.personalInfo?.fullName || "Untitled Resume";
  const role = resume.personalInfo?.designation || "No designation";
  const template = resume.template || "professional";
  const date = new Date(resume.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const templateColors = {
    professional: "from-blue-500 to-blue-600",
    modern: "from-slate-700 to-slate-900",
    creative1: "from-amber-500 to-orange-500",
    creative2: "from-violet-500 to-purple-600",
  };

  const templateLabels = {
    professional: "Professional",
    modern: "Modern",
    creative1: "Creative Top",
    creative2: "Creative Split",
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${templateColors[template] || "from-blue-500 to-blue-600"} flex items-center justify-center shadow-md`}>
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center gap-2">
          {resume.isPublic && (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">
              <Share2 className="w-2.5 h-2.5" /> Shared
            </span>
          )}
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
            {templateLabels[template] || template}
          </span>
        </div>
      </div>

      <h3 className="font-bold text-slate-800 text-base leading-tight line-clamp-1">{name}</h3>
      <p className="text-xs text-slate-400 mt-0.5 mb-4 line-clamp-1">{role}</p>

      <div className="flex items-center gap-1 text-xs text-slate-400 mb-4">
        <Calendar className="w-3 h-3" />
        <span>{date}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(resume)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-[#0076BC] hover:text-white border border-slate-200 rounded-xl transition-all"
        >
          <Edit2 className="w-3.5 h-3.5" /> Edit
        </button>
        <button
          onClick={() => onShare(resume)}
          className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all ${resume.isPublic
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-blue-50 hover:text-[#0076BC] hover:border-blue-200"
            }`}
          title={resume.isPublic ? "Disable sharing" : "Share resume"}
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shareToast, setShareToast] = useState("");

  const [localPic, setLocalPic] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    // Read profile pic from localStorage (same key Navbar uses)
    const pic = localStorage.getItem("uprofilepic");
    if (pic) setLocalPic(pic);
    fetchDashboard(token);
  }, []);

  const fetchDashboard = async (token) => {
    try {
      const res = await axios.get(`${API}/api/auth/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.sts === 0) setData(res.data);
      else setError("Failed to load dashboard.");
    } catch {
      setError("Session expired. Please login again.");
      setTimeout(() => navigate("/login"), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resume) => {
    navigate("/resume-builder", { state: { resumeData: resume } });
  };

  const handleShare = async (resume) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/api/resume/share/${resume._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.sts === 0 && res.data.shared) {
        const link = `${window.location.origin}/r/${res.data.shareId}`;
        await navigator.clipboard.writeText(link);
        setShareToast("Link copied! Anyone with the link can view your resume.");
        // update local state
        setData(prev => ({
          ...prev,
          resumes: prev.resumes.map(r =>
            r._id === resume._id ? { ...r, isPublic: true, shareId: res.data.shareId } : r
          ),
        }));
      } else if (res.data.sts === 0 && !res.data.shared) {
        setShareToast("Sharing disabled. Resume is now private.");
        setData(prev => ({
          ...prev,
          resumes: prev.resumes.map(r =>
            r._id === resume._id ? { ...r, isPublic: false, shareId: null } : r
          ),
        }));
      }
    } catch {
      setShareToast("Failed to toggle sharing.");
    }
    setTimeout(() => setShareToast(""), 3500);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0076BC] to-[#00A86B] animate-pulse" />
          <p className="text-slate-500 text-sm font-medium">Loading your dashboard…</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-slate-600 font-semibold">{error}</p>
        </div>
      </div>
    </div>
  );

  const { profile, usage, resumes } = data;
  const joinDate = new Date(profile.memberSince).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const sharedCount = resumes.filter(r => r.isPublic).length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* ── Toast ── */}
      {shareToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          {shareToast}
        </div>
      )}

      {/* ── Hero Header ── */}
      <div className="bg-gradient-to-br from-[#003f6b] via-[#0076BC] to-[#00A86B] px-6 py-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="relative z-10 max-w-5xl mx-auto flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl shrink-0">
            {(localPic || profile.avatar)
              ? <img src={localPic || profile.avatar} alt="avatar" className="w-full h-full object-cover" />
              : <img
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${profile.name || 'user'}`}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            }
          </div>
          <div>
            <p className="text-white/70 text-sm font-medium">Welcome back 👋</p>
            <h1 className="text-2xl md:text-3xl font-black text-white">{profile.name}</h1>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 space-y-10">

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Resumes", value: resumes.length, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Shared", value: sharedCount, icon: Share2, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "ATS Checks Today", value: `${usage.atsToday}/${usage.atsLimit}`, icon: Shield, color: "text-violet-600", bg: "bg-violet-50" },
            { label: "AI Improvements", value: `${usage.aiUsed}/${usage.aiLimit}`, icon: Sparkles, color: "text-amber-600", bg: "bg-amber-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className={`text-2xl font-black ${color}`}>{value}</p>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── AI Usage ── */}
        <div>
          <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" /> AI Usage
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <UsageBar
              used={usage.atsToday} limit={usage.atsLimit}
              label="ATS Checks Today"
              icon={Shield}
              color={{ bg: "bg-violet-50", text: "text-violet-600", bar: "bg-gradient-to-r from-violet-400 to-purple-500" }}
            />
            <UsageBar
              used={usage.aiUsed} limit={usage.aiLimit}
              label="AI Content Improve (Lifetime)"
              icon={Sparkles}
              color={{ bg: "bg-amber-50", text: "text-amber-600", bar: "bg-gradient-to-r from-amber-400 to-orange-500" }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> ATS limit resets daily at midnight. AI improvements are lifetime credits.
          </p>
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#0076BC]" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Build Resume", icon: Plus, href: "/resume-builder", color: "bg-[#0076BC] text-white hover:opacity-90" },
              { label: "ATS Checker", icon: Shield, href: "/ats-checker", color: "bg-violet-600 text-white hover:opacity-90" },
              { label: "Interview Prep", icon: Sparkles, href: "/interview-prep", color: "bg-amber-500 text-white hover:opacity-90" },
              { label: "Browse Jobs", icon: Briefcase, href: "/jobs", color: "bg-emerald-600 text-white hover:opacity-90" },
            ].map(({ label, icon: Icon, href, color }) => (
              <button
                key={label}
                onClick={() => navigate(href)}
                className={`${color} rounded-xl p-4 flex flex-col items-center gap-2 transition font-semibold text-sm shadow-sm`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── My Resumes ── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0076BC]" /> My Resumes
            </h2>
            <button
              onClick={() => navigate("/resume-builder")}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#0076BC] hover:underline"
            >
              <Plus className="w-4 h-4" /> New Resume
            </button>
          </div>

          {resumes.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-slate-300" />
              </div>
              <h3 className="font-bold text-slate-700 mb-2">No resumes yet</h3>
              <p className="text-slate-400 text-sm mb-5">Create your first professional resume in minutes.</p>
              <button
                onClick={() => navigate("/resume-builder")}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0076BC] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition"
              >
                Build Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumes.map(resume => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  onEdit={handleEdit}
                  onShare={handleShare}
                />
              ))}
              {/* Add new card */}
              <div
                onClick={() => navigate("/resume-builder")}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-[#0076BC] hover:text-[#0076BC] hover:bg-blue-50/50 transition cursor-pointer min-h-[180px]"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span className="font-semibold text-sm">New Resume</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Explore More ── */}
        <div className="bg-gradient-to-r from-[#0076BC] to-[#00A86B] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white font-black text-lg">Boost your ATS score</h3>
            <p className="text-blue-100 text-sm mt-1">Upload your resume and get instant AI feedback with keyword matching.</p>
          </div>
          <button
            onClick={() => navigate("/ats-checker")}
            className="flex items-center gap-2 px-6 py-3 bg-white text-[#0076BC] rounded-xl font-bold text-sm hover:bg-blue-50 transition shrink-0 shadow-lg"
          >
            Check ATS Score <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
}
