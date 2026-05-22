import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  FileText,
  Search,
  Share2,
  Info,
  Check,
  AlertOctagon,
  ArrowRight,
  Lock,
  UserCheck,
  Cookie,
  FolderOpen
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SECTIONS = [
  {
    id: "introduction",
    title: "Introduction",
    icon: Scale,
    tldr: "We respect your privacy and protect your personal information at YuvaNaukri.",
    searchText: "introduction privacy respect information protect security policy data visitor",
    content: (
      <div className="space-y-4">
        <p>
          At YuvaNaukri, one of our main priorities is the privacy of our visitors and users. This Privacy Policy document outlines the types of information that is collected and recorded by YuvaNaukri and how we use it.
        </p>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact our support team.
        </p>
      </div>
    )
  },
  {
    id: "collect",
    title: "1. Information We Collect",
    icon: FolderOpen,
    tldr: "We collect personal details like name, email, educational background, and resume contents that you provide.",
    searchText: "information collect personal details name email educational professional experience profile submission data",
    content: (
      <div className="space-y-4">
        <p>
          When you use YuvaNaukri, we may collect personal information such as your name, email address, educational background, professional experience, skills, and any other details you choose to include in your resume, profile, or forms.
        </p>
        <p>
          This information is gathered to help build and display your resume and profile accurately, ensuring a tailored experience on our platform.
        </p>
      </div>
    )
  },
  {
    id: "use",
    title: "2. How We Use Your Information",
    icon: FileText,
    tldr: "We use your data to create resumes, match you with jobs, provide guidance, and improve the site. We never sell your data.",
    searchText: "use information provide maintain improve services generate resume career guidance job match share sell third party",
    content: (
      <div className="space-y-4">
        <p>
          We use the information we collect to provide, maintain, and improve our services, including generating resumes, offering career guidance, matching you with job vacancies, and checking platform performance.
        </p>
        <p>
          We do not sell, rent, or lease your personal information to third parties. All processing is strictly done to facilitate the career development features of the platform.
        </p>
      </div>
    )
  },
  {
    id: "security",
    title: "3. Data Security",
    icon: Lock,
    tldr: "We use encryption and strict security measures to protect your resumes and credentials.",
    searchText: "data security encryption protection access unauthorized disclosure resume credentials secure server",
    content: (
      <div className="space-y-4">
        <p>
          We implement strict technical and security measures to protect your personal data from unauthorized access, alteration, disclosure, or destruction.
        </p>
        <p>
          Resumes, passwords, and account credentials created on our platform are secured using standard encryption practices. However, please remember that no method of transmission over the Internet is 100% secure.
        </p>
      </div>
    )
  },
  {
    id: "rights",
    title: "4. Your Rights",
    icon: UserCheck,
    tldr: "You can view, edit, or delete your resumes and account information anytime from your dashboard.",
    searchText: "user rights access update edit delete resume profile account dashboard data privacy settings control",
    content: (
      <div className="space-y-4">
        <p>
          You have the right to access, update, or delete your personal information at any time.
        </p>
        <p>
          You can view, modify, or permanently delete your resumes and account details directly from your account dashboard. For further requests or data portability inquiries, you can reach out to us at <span className="font-semibold text-slate-800">support@yuvanaukri.org</span>.
        </p>
      </div>
    )
  },
  {
    id: "cookies",
    title: "5. Cookies & Tracking",
    icon: Cookie,
    tldr: "We use cookies to keep you logged in and learn how to make our platform better for you.",
    searchText: "cookies tracking analytics login session browser experience analytics interaction metrics preferences",
    content: (
      <div className="space-y-4">
        <p>
          We use cookies to keep you logged in across sessions, understand how you interact with our platform, and personalize your experience.
        </p>
        <p>
          You can choose to disable cookies through your browser settings, though some features of the service may not function properly as a result.
        </p>
      </div>
    )
  }
];

export default function Privacy() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // offset for navbar

      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyLink = (id) => {
    const link = `${window.location.origin}/privacy#${id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredSections = SECTIONS.filter(section => {
    const query = searchQuery.toLowerCase();
    return (
      section.title.toLowerCase().includes(query) ||
      section.tldr.toLowerCase().includes(query) ||
      section.searchText.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-inter">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#0076BC] to-[#00A86B] text-white py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
              Privacy Hub
            </span>
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-xs text-blue-50">Effective: April 16, 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 animate-fade-in">
            Privacy Policy
          </h1>
          <p className="text-lg md:text-xl text-blue-50/90 max-w-2xl font-light">
            Your privacy is our priority. Read about how we gather, protect, and handle your data on YuvaNaukri.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-4 md:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Left Sticky Navigation (Sidebar) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* Search Bar */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Search Policy
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search e.g., 'cookies'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 text-sm pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0076BC] focus:border-[#0076BC] transition"
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Table of Contents */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                  Policy Sections
                </h3>
                <nav className="space-y-1">
                  {SECTIONS.map((section) => {
                    const isVisible = filteredSections.some(s => s.id === section.id);
                    return (
                      <a
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${activeSection === section.id
                            ? "bg-blue-50 text-[#0076BC]"
                            : isVisible
                              ? "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                              : "text-slate-300 pointer-events-none line-through"
                          }`}
                      >
                        <section.icon className={`w-4 h-4 shrink-0 ${activeSection === section.id ? "text-[#0076BC]" : "text-slate-400"}`} />
                        <span className="truncate">{section.title.replace(/^\d+\.\s*/, "")}</span>
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Document Actions Card */}
              <div className="flex flex-col gap-2">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <h4 className="text-xs font-bold text-orange-800 mb-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    Data Questions?
                  </h4>
                  <p className="text-xs text-orange-700 leading-relaxed mb-3 font-sans">
                    Have questions about how your personal details or resumes are stored? Reach out to our privacy officer.
                  </p>
                  <a
                    href="/contact"
                    className="inline-flex items-center text-xs font-bold text-orange-800 hover:text-orange-950 hover:underline gap-1"
                  >
                    Contact Us
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column (Policy Content) */}
          <div className="lg:col-span-3 space-y-8">
            <AnimatePresence mode="popLayout">
              {filteredSections.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm"
                >
                  <AlertOctagon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-800 mb-2">No matching sections found</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto font-sans">
                    We couldn't find any policy terms containing "{searchQuery}". Try searching for something else like "cookies" or "collect".
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition"
                  >
                    Clear Search
                  </button>
                </motion.div>
              ) : (
                filteredSections.map((section, idx) => (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm scroll-mt-24"
                  >

                    {/* Header and Quick Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-4">
                      <div className="flex items-center space-x-3.5">
                        <div className="p-2.5 bg-blue-50 text-[#0076BC] rounded-xl">
                          <section.icon className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                          {section.title}
                        </h2>
                      </div>

                      <button
                        onClick={() => handleCopyLink(section.id)}
                        className="self-start sm:self-center flex items-center space-x-1.5 px-3 py-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 text-xs font-semibold rounded-lg border border-slate-100 transition"
                      >
                        {copiedId === section.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-green-600 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Quick TL;DR Callout Card */}
                    <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-start space-x-3">
                      <div className="mt-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0">
                        TL;DR
                      </div>
                      <p className="text-sm text-slate-600 font-medium font-sans">
                        {section.tldr}
                      </p>
                    </div>

                    {/* Detailed Policy content */}
                    <div className="text-slate-600 leading-relaxed text-sm md:text-base space-y-4 font-sans">
                      {section.content}
                    </div>

                  </motion.section>
                ))
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
