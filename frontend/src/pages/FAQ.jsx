import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  HelpCircle, ChevronDown, ChevronUp, Search, FileText,
  Shield, Zap, Briefcase, CreditCard, User, ArrowRight,
} from "lucide-react";

// ─── FAQ Data ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "general",   label: "General",         icon: HelpCircle },
  { id: "resume",    label: "Resume Builder",   icon: FileText   },
  { id: "ats",       label: "ATS Checker",      icon: Shield     },
  { id: "account",   label: "Account",          icon: User       },
  { id: "jobs",      label: "Jobs & Career",    icon: Briefcase  },
  { id: "billing",   label: "Pricing & Limits", icon: CreditCard },
];

const FAQS = [
  // ── General ──
  {
    cat: "general",
    q: "What is YuvaNaukri?",
    a: "YuvaNaukri is a free, AI-powered career platform built for Indian students and freshers. It lets you build professional resumes, check ATS compatibility, find live job listings, and get career guidance — all in one place.",
  },
  {
    cat: "general",
    q: "Is YuvaNaukri completely free to use?",
    a: "Yes! The core features — resume builder, PDF export, job board, and career guidance — are 100% free. Some AI-powered features have daily usage limits to keep the platform sustainable.",
  },
  {
    cat: "general",
    q: "Do I need to create an account to use the platform?",
    a: "You can browse the platform without an account, but you'll need to sign up (free) to save resumes, use the AI features, and access the ATS Checker.",
  },
  {
    cat: "general",
    q: "Is my data safe on YuvaNaukri?",
    a: "Absolutely. Your resume data is stored securely in an encrypted MongoDB database. We never sell your personal data or share it with third parties without your consent. You can delete your resumes at any time.",
  },
  {
    cat: "general",
    q: "Which technology powers YuvaNaukri's AI features?",
    a: "YuvaNaukri uses Google Gemini 2.5 Flash — one of the most advanced AI models available — for both the AI Content Improve feature and the full ATS resume analysis.",
  },

  // ── Resume Builder ──
  {
    cat: "resume",
    q: "How many resume templates are available?",
    a: "We currently offer 4 premium ATS-friendly templates: Professional (classic corporate), Modern (two-column dark sidebar), Creative Top (centered avatar banner), and Creative Split (high-contrast with skill progress bars). More templates are coming soon.",
  },
  {
    cat: "resume",
    q: "Can I preview my resume in real time while editing?",
    a: "Yes! The Resume Builder has a side-by-side dual-pane layout — your form on the left, live preview on the right. Every change you make is instantly reflected in the preview.",
  },
  {
    cat: "resume",
    q: "How do I download my resume as a PDF?",
    a: "Click the 'Download PDF' button in the Resume Builder. Your resume is exported in full A4 quality, ready to send to employers.",
  },
  {
    cat: "resume",
    q: "Can I save multiple versions of my resume?",
    a: "Yes! You can save as many resumes as you like. Access all your saved resumes from the Navbar by clicking your profile avatar → 'My Resumes'.",
  },
  {
    cat: "resume",
    q: "What does the AI Content Improve feature do?",
    a: "The AI improve button (✨) appears next to text fields like your job descriptions and summary. It uses Gemini AI to rewrite your content with stronger action verbs, better structure, and more professional tone. You get 3 free AI improvements per account.",
  },
  {
    cat: "resume",
    q: "Can I change the color theme of my resume?",
    a: "Yes! Each template supports a live color picker that lets you customize the accent color in real time. Pick any color that fits your personal brand.",
  },

  // ── ATS Checker ──
  {
    cat: "ats",
    q: "What is an ATS and why does it matter?",
    a: "ATS stands for Applicant Tracking System — software used by companies to automatically filter resumes before a human ever reads them. Studies show 75% of resumes are rejected by ATS before reaching a recruiter. A high ATS score significantly improves your chances of getting an interview.",
  },
  {
    cat: "ats",
    q: "How does the ATS Checker work?",
    a: "Upload your resume as a PDF. Our AI (Google Gemini) reads the actual PDF directly — including layout, fonts, and structure — and gives you a full score breakdown: Overall Score, ATS Compatibility, Content Quality, Formatting, section-by-section analysis, matched/missing keywords (if you provide a job description), and top 5 actionable suggestions.",
  },
  {
    cat: "ats",
    q: "Why is there a 2 checks per day limit?",
    a: "The ATS Checker uses Google Gemini AI, which has processing costs. The 2 daily limit keeps the tool free for everyone while ensuring fair access. Your limit resets automatically at midnight every day.",
  },
  {
    cat: "ats",
    q: "Do I need to provide a job description?",
    a: "No — the job description is optional. Without it, the AI analyzes your resume for general ATS compatibility and content quality. With it, you also get keyword match analysis showing which required skills you have and which are missing from your resume.",
  },
  {
    cat: "ats",
    q: "What file types are supported for resume upload?",
    a: "Currently, only PDF files are supported (max 5MB). PDF is the standard format for ATS systems, so this ensures the most accurate analysis.",
  },

  // ── Account ──
  {
    cat: "account",
    q: "How do I sign up?",
    a: "Click 'Get Started' on the homepage or go to /signup. You only need your name, email, and a password (min. 6 characters with letters and numbers). No credit card required.",
  },
  {
    cat: "account",
    q: "Can I change my profile picture?",
    a: "Yes! Click your avatar in the Navbar → 'My Account' → tap the profile image to upload a new one. Images are compressed automatically and stored securely.",
  },
  {
    cat: "account",
    q: "How do I change my password?",
    a: "Go to Navbar → Your profile avatar → 'My Account' → 'Change Password'. You'll need to enter your current password and a new one that meets the security policy.",
  },
  {
    cat: "account",
    q: "How do I delete a resume?",
    a: "Open 'My Resumes' from the Navbar, find the resume you want to delete, and click the trash icon. Deletion is permanent.",
  },

  // ── Jobs & Career ──
  {
    cat: "jobs",
    q: "Where do the job listings come from?",
    a: "Job listings are powered by the Adzuna API, which aggregates jobs from thousands of Indian companies and job boards in real time.",
  },
  {
    cat: "jobs",
    q: "How do I search for jobs?",
    a: "Go to the Jobs page, enter a keyword (e.g. 'Python Developer'), choose a location and category, then click the Search button. The API is only called when you actively search — this keeps results relevant and avoids unnecessary calls.",
  },
  {
    cat: "jobs",
    q: "Can I save or apply for jobs on YuvaNaukri?",
    a: "Currently, clicking 'Apply Now' redirects you to the original job posting on the employer's site. A saved jobs / application tracker feature is planned for a future update.",
  },
  {
    cat: "jobs",
    q: "What is the Career Guidance section?",
    a: "Career Guidance offers curated career path recommendations, skill roadmaps, and industry insights tailored for Indian students and freshers entering the job market.",
  },

  // ── Billing & Limits ──
  {
    cat: "billing",
    q: "How many resumes can I create?",
    a: "Unlimited! You can create, save, and manage as many resumes as you want — all for free.",
  },
  {
    cat: "billing",
    q: "What are the AI usage limits?",
    a: "• AI Content Improve: 3 uses per account (lifetime) — use them wisely!\n• ATS Checker: 2 full analyses per day, resets at midnight.\n• More usage may be available in future plans.",
  },
  {
    cat: "billing",
    q: "Will YuvaNaukri always be free?",
    a: "The core features (resume builder, PDF export, job board) will always be free. Premium AI features may move to optional paid tiers in the future, but existing free limits will be maintained.",
  },
  {
    cat: "billing",
    q: "Is there a mobile app?",
    a: "Not yet — YuvaNaukri is a fully responsive web app that works great on mobile browsers. A native app may come in the future based on user demand.",
  },
];

// ─── Accordion Item ───────────────────────────────────────────────────────────

function AccordionItem({ q, a, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-200 ${open ? "border-[#0076BC] shadow-sm" : "border-slate-200 hover:border-slate-300"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <div className="flex items-start gap-3">
          <span className={`shrink-0 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center mt-0.5 ${open ? "bg-[#0076BC] text-white" : "bg-slate-100 text-slate-500"}`}>
            {index + 1}
          </span>
          <span className={`font-semibold text-sm md:text-base leading-snug ${open ? "text-[#0076BC]" : "text-slate-800"}`}>{q}</span>
        </div>
        <span className="shrink-0 ml-4">
          {open
            ? <ChevronUp className="w-5 h-5 text-[#0076BC]" />
            : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-5 pt-0">
          <div className="ml-9 border-l-2 border-[#0076BC]/20 pl-4">
            {a.split("\n").map((line, i) => (
              <p key={i} className="text-slate-600 text-sm leading-relaxed mb-1 last:mb-0">{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FAQ() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = FAQS.filter((faq) => {
    const matchesCat = activeCategory === "all" || faq.cat === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const isSearching = searchQuery.trim() !== "";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-[#003f6b] via-[#0076BC] to-[#00A86B] py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white border border-white/30 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-5 backdrop-blur-sm">
            <HelpCircle className="w-4 h-4" /> Help Center
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            Frequently Asked <span className="text-emerald-300">Questions</span>
          </h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto mb-8">
            Everything you need to know about YuvaNaukri. Can't find your answer? We're happy to help.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-5 py-4 rounded-2xl text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A86B] shadow-xl text-sm"
            />
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">

        {/* ── Category Tabs ── */}
        {!isSearching && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {CATEGORIES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === id
                    ? "bg-[#0076BC] text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-[#0076BC] hover:text-[#0076BC]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* ── Results Count ── */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {isSearching
              ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${searchQuery}"`
              : `${filtered.length} question${filtered.length !== 1 ? "s" : ""} in ${CATEGORIES.find(c => c.id === activeCategory)?.label}`}
          </p>
          {isSearching && (
            <button onClick={() => setSearchQuery("")} className="text-xs text-[#0076BC] font-semibold hover:underline">
              Clear search
            </button>
          )}
        </div>

        {/* ── FAQ List ── */}
        {filtered.length > 0 ? (
          <div className="space-y-3">
            {filtered.map((faq, i) => (
              <AccordionItem key={`${faq.cat}-${i}`} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">No results found</h3>
            <p className="text-slate-500 text-sm">Try a different search term or browse the categories above.</p>
            <button onClick={() => setSearchQuery("")} className="mt-4 text-sm text-[#0076BC] font-semibold hover:underline">
              Clear search
            </button>
          </div>
        )}

        {/* ── Still Have Questions ── */}
        <div className="mt-14 bg-gradient-to-r from-[#0076BC] to-[#00A86B] rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 0%, transparent 60%), radial-gradient(circle at 80% 50%, #fff 0%, transparent 60%)" }} />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Still have questions?</h2>
            <p className="text-blue-100 mb-7 max-w-md mx-auto">
              Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#0076BC] rounded-xl font-bold hover:bg-blue-50 transition shadow-lg"
            >
              Contact Support <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
