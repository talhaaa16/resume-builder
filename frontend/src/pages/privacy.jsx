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
  FolderOpen,
  Sparkles,
  Link2,
  HardDrive,
  Clock,
  RefreshCw,
  Mail
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SECTIONS = [
  {
    id: "introduction",
    title: "Introduction",
    icon: Scale,
    tldr: "This policy explains what YuvaNaukri collects, why, who it is shared with, and the choices you have.",
    searchText: "introduction privacy respect information protect security policy data visitor",
    content: (
      <div className="space-y-4">
        <p>
          At YuvaNaukri, one of our main priorities is the privacy of our visitors and users. This Privacy Policy explains what information YuvaNaukri collects, how we use it, which third-party services process it, and the choices you have. It applies to the YuvaNaukri website and all of its features, including the Resume Builder, the AI tools, the Jobs page and Yuva Assistant.
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
    tldr: "Your account details, resumes, AI tool history, Yuva Assistant chats, usage counters and basic site analytics (page views and visitor IP addresses).",
    searchText: "information collect personal details name email password linkedin profile photo resume versions snapshots interview prep history chatbot yuva assistant chat conversations feedback ats upload pdf usage counters analytics page views ip address",
    content: (
      <div className="space-y-4">
        <p>Depending on the features you use, we collect and store:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><span className="font-semibold text-slate-800">Account information:</span> your name (username), email address and password. Passwords are stored only as a bcrypt hash, never in plain text.</li>
          <li><span className="font-semibold text-slate-800">LinkedIn data:</span> if you sign in with or link LinkedIn, we receive your name, email address and profile photo from LinkedIn and store your LinkedIn account ID.</li>
          <li><span className="font-semibold text-slate-800">Profile photo:</span> if you upload one (max 5MB), it is compressed and stored with your account.</li>
          <li><span className="font-semibold text-slate-800">Resumes &amp; versions:</span> everything you enter in the Resume Builder (such as contact details, education, experience and skills), your template and theme choices, and any version snapshots you save.</li>
          <li><span className="font-semibold text-slate-800">Interview Prep history:</span> the job role and experience level you enter and the questions, answers and tips generated for each session.</li>
          <li><span className="font-semibold text-slate-800">Yuva Assistant conversations &amp; feedback:</span> the messages you send, the assistant's replies, and any thumbs up/down feedback you give on replies.</li>
          <li><span className="font-semibold text-slate-800">ATS Checker uploads:</span> the resume PDF you upload is sent to Google Gemini for analysis. We do not store the uploaded file.</li>
          <li><span className="font-semibold text-slate-800">Usage counters:</span> how many times you have used each AI feature, so we can apply usage limits.</li>
          <li><span className="font-semibold text-slate-800">Site analytics:</span> daily page-view counts and the IP addresses of visitors for each day, used to show traffic statistics to our admins.</li>
        </ul>
      </div>
    )
  },
  {
    id: "use",
    title: "2. How We Use Your Information",
    icon: FileText,
    tldr: "We use your data to run YuvaNaukri's features, personalize jobs and AI answers, apply usage limits and keep the platform secure. We never sell your data.",
    searchText: "use information provide maintain improve services generate resume career guidance job match personalize for you feed usage limits share sell third party",
    content: (
      <div className="space-y-4">
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Create your account, sign you in and keep your account secure.</li>
          <li>Build, save, export and (if you choose) share your resumes, and keep their version history.</li>
          <li>Run the AI tools — AI Content Improve, ATS Checker, Interview Prep, LinkedIn About Optimizer, AI Job Match and Yuva Assistant.</li>
          <li>Personalize your experience, for example the "For You" job feed on your Dashboard (based on your latest resume) and Yuva Assistant answers that use your profile and saved resumes.</li>
          <li>Apply fair-use limits on AI features and understand overall site traffic.</li>
          <li>Respond to your support requests.</li>
        </ul>
        <p>
          We do not sell, rent, or lease your personal information to anyone.
        </p>
      </div>
    )
  },
  {
    id: "third-parties",
    title: "3. AI Processing & Third-Party Services",
    icon: Sparkles,
    tldr: "AI features send the relevant content to Google Gemini. Job searches go to Adzuna. LinkedIn is used only for sign-in.",
    searchText: "ai processing third party services google gemini adzuna linkedin oauth sent shared resume job description chat messages",
    content: (
      <div className="space-y-4">
        <p>To provide some features, we send specific data to the following services:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <span className="font-semibold text-slate-800">Google Gemini (AI processing):</span> all AI features are powered by Google Gemini. Depending on the feature, we send your resume content, job descriptions, uploaded ATS PDFs, your LinkedIn About text, the role you enter for Interview Prep, and your Yuva Assistant messages together with the profile and resume context the assistant needs to answer.
          </li>
          <li>
            <span className="font-semibold text-slate-800">Adzuna (job listings):</span> when you search jobs, view the "For You" feed or ask Yuva Assistant to find jobs, the search terms (such as keywords and location) are sent to Adzuna to fetch live listings. When you click to apply, you leave YuvaNaukri and the employer's or job board's own privacy policy applies.
          </li>
          <li>
            <span className="font-semibold text-slate-800">LinkedIn (sign-in):</span> if you choose "Continue with LinkedIn" or link your LinkedIn account, LinkedIn shares your name, email address and profile photo with us.
          </li>
        </ul>
        <p>
          Please avoid entering highly sensitive information (for example ID numbers or financial details) into resumes, AI tools or chats.
        </p>
      </div>
    )
  },
  {
    id: "share-links",
    title: "4. Public Resume Share Links",
    icon: Link2,
    tldr: "Share links are off unless you turn them on. Anyone with the link can view that resume without logging in.",
    searchText: "public resume share link sharing visible anyone view without login turn off disable",
    content: (
      <div className="space-y-4">
        <p>
          You can create a public share link for any of your resumes. Once sharing is enabled, anyone who has the link can view that resume without logging in, and they may save or forward it.
        </p>
        <p>
          Only share the link with people you trust. You can turn sharing off at any time from your Dashboard to disable the link.
        </p>
      </div>
    )
  },
  {
    id: "storage",
    title: "5. Local Storage & Sessions",
    icon: HardDrive,
    tldr: "Your login token is kept in your browser's localStorage (not cookies). Sessions last up to 7 days and everyone is logged out every Monday.",
    searchText: "local storage localstorage cookies session token login logout 7 days monday weekly reset browser tracking",
    content: (
      <div className="space-y-4">
        <p>
          When you log in, we store a login token and basic display details (such as your name, email and profile photo) in your browser's localStorage. We do not use cookies to keep you logged in.
        </p>
        <p>
          Sessions last up to 7 days. For security, all users are also automatically logged out every Monday (a weekly session reset). Logging out removes the login token from your browser.
        </p>
      </div>
    )
  },
  {
    id: "retention",
    title: "6. Data Retention",
    icon: Clock,
    tldr: "We keep your data while your account is active. Chats stay until you delete them. Everything is deleted when you ask us to delete your account.",
    searchText: "data retention keep store how long delete account chats conversations resumes analytics",
    content: (
      <div className="space-y-4">
        <ul className="list-disc pl-6 space-y-2">
          <li>Account data, resumes, version snapshots and Interview Prep history are kept while your account is active, unless you delete them earlier.</li>
          <li>Yuva Assistant conversations are kept until you delete them.</li>
          <li>Uploaded ATS Checker PDFs are not stored by us.</li>
          <li>When you ask us to delete your account, we delete your account and its associated data.</li>
        </ul>
      </div>
    )
  },
  {
    id: "rights",
    title: "7. Your Rights",
    icon: UserCheck,
    tldr: "Update your details in My Account, delete resumes and chats in the app, and email us to delete your whole account.",
    searchText: "user rights access update edit correct delete resume chat account my account data privacy control email support",
    content: (
      <div className="space-y-4">
        <ul className="list-disc pl-6 space-y-2">
          <li><span className="font-semibold text-slate-800">Access &amp; correct:</span> view and update your username, email, password and profile photo from the "My Account" sidebar, and edit your resumes at any time.</li>
          <li><span className="font-semibold text-slate-800">Delete content:</span> delete resumes, version snapshots and Yuva Assistant conversations directly in the app.</li>
          <li><span className="font-semibold text-slate-800">Delete your account:</span> there is no self-service option in the app. Email <a href="mailto:support@yuvanaukri.org" className="font-semibold text-slate-800 hover:underline">support@yuvanaukri.org</a> and we will handle your request.</li>
        </ul>
      </div>
    )
  },
  {
    id: "security",
    title: "8. Data Security",
    icon: Lock,
    tldr: "Passwords are bcrypt-hashed and your data is protected by token-based authentication, but no system is 100% secure.",
    searchText: "data security encryption bcrypt hashed password token authentication protection access unauthorized secure server",
    content: (
      <div className="space-y-4">
        <p>
          We take reasonable technical measures to protect your personal data. Passwords are hashed with bcrypt, and access to your account data requires token-based authentication.
        </p>
        <p>
          However, no method of transmission over the Internet or electronic storage is 100% secure. Please use a strong password and log out on shared devices.
        </p>
      </div>
    )
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    icon: RefreshCw,
    tldr: "We may update this policy. The effective date at the top shows the latest version.",
    searchText: "changes updates policy effective date revisions",
    content: (
      <div className="space-y-4">
        <p>
          We may update this Privacy Policy from time to time as YuvaNaukri changes. When we do, we will update the effective date at the top of this page. Continuing to use YuvaNaukri after an update means you accept the revised policy.
        </p>
      </div>
    )
  },
  {
    id: "contact",
    title: "10. Contact Us",
    icon: Mail,
    tldr: "Questions about your data? Email support@yuvanaukri.org.",
    searchText: "contact us email support questions data requests",
    content: (
      <div className="space-y-4">
        <p>
          If you have any questions about this Privacy Policy or how your data is handled, email our team at <a href="mailto:support@yuvanaukri.org" className="font-semibold text-slate-800 hover:underline">support@yuvanaukri.org</a> or use our <Link to="/contact" className="font-semibold text-slate-800 hover:underline">Contact page</Link>.
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
            <span className="text-xs text-blue-50">Effective: October 7, 2026</span>
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
                    placeholder="Search e.g., 'storage'..."
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
                    Have questions about how your personal details or resumes are stored? Reach out to our team.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center text-xs font-bold text-orange-800 hover:text-orange-950 hover:underline gap-1"
                  >
                    Contact Us
                    <ArrowRight className="w-3 h-3" />
                  </Link>
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
                    We couldn't find any policy terms containing "{searchQuery}". Try searching for something else like "storage" or "collect".
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
