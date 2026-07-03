import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Loader2, AlertCircle, FileText, ArrowLeft, Download, ExternalLink,
} from "lucide-react";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import ModernTemplate from "../components/templates/ModernTemplate";
import Creative1Template from "../components/templates/Creative1Template";
import Creative2Template from "../components/templates/Creative2Template";

const API = process.env.REACT_APP_API_URL || "";

function TemplateRenderer({ resume }) {
  // All templates expect a single `form` prop — same shape as what ResumeBuilder uses
  const form = {
    personalInfo:  resume.personalInfo  || {},
    experience:    resume.experience    || [],
    education:     resume.education     || [],
    skills:        resume.skills        || [],
    projects:      resume.projects      || [],
    languages:     resume.languages     || [],
    themeColor:    resume.themeColor    || "#0076BC",
    template:      resume.template      || "professional",
    fontFamily:    resume.fontFamily    || "font-sans",
  };

  switch (resume.template) {
    case "modern":    return <ModernTemplate      form={form} />;
    case "creative1": return <Creative1Template   form={form} />;
    case "creative2": return <Creative2Template   form={form} />;
    default:          return <ProfessionalTemplate form={form} />;
  }
}

export default function ResumeView() {
  const { shareId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API}/api/resume/public/${shareId}`);
        if (res.data.sts === 0) setResume(res.data.resume);
        else setError(res.data.msg || "Resume not found.");
      } catch (err) {
        setError(err.response?.data?.msg || "Resume not found or sharing is disabled.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [shareId]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0076BC] to-[#00A86B] flex items-center justify-center shadow-xl animate-pulse">
        <FileText className="w-8 h-8 text-white" />
      </div>
      <p className="text-slate-600 font-semibold flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading resume…
      </p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-5 px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-black text-slate-800 mb-2">Resume Not Found</h1>
        <p className="text-slate-500 text-sm max-w-xs">{error}</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 px-5 py-2.5 bg-[#0076BC] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition">
          <ArrowLeft className="w-4 h-4" /> Go Home
        </button>
        <button onClick={() => navigate("/resume-builder")} className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-100 transition">
          Build Your Resume
        </button>
      </div>
    </div>
  );

  const name = resume.personalInfo?.fullName || "Resume";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ── Top Banner ── */}
      <div className="bg-gradient-to-r from-[#003f6b] to-[#0076BC] text-white px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-black text-sm leading-tight">{name}</p>
            <p className="text-blue-200 text-xs">Shared via YuvaNaukri</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white border border-white/20 px-3 py-1.5 rounded-lg transition hover:bg-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Build Yours Free
          </a>
        </div>
      </div>

      {/* ── Resume Preview ── */}
      <div className="flex justify-center py-10 px-4">
        <div className="w-full max-w-[794px] shadow-2xl rounded-lg overflow-hidden bg-white">
          <TemplateRenderer resume={resume} />
        </div>
      </div>

      {/* ── Footer Note ── */}
      <div className="text-center pb-10 text-slate-400 text-xs">
        Made with <span className="text-emerald-500 font-semibold">YuvaNaukri</span> ·{" "}
        <a href="/resume-builder" className="hover:text-slate-600 transition underline">Build your free resume →</a>
      </div>
    </div>
  );
}
