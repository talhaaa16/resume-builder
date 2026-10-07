import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scale, 
  ShieldCheck, 
  FileText, 
  ShieldAlert, 
  Sparkles, 
  Search, 
  Share2, 
  Info, 
  Check, 
  AlertOctagon,
  ArrowRight,
  Bot,
  Gauge,
  Briefcase,
  Link2,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SECTIONS = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: Scale,
    tldr: "By using YuvaNaukri, you agree to these terms. If you don't agree, please do not use the platform.",
    searchText: "acceptance terms agree policy conditions legal yuvanaukri platform",
    content: (
      <div className="space-y-4">
        <p>
          Welcome to YuvaNaukri ("Service", "we", "us", or "our"). By accessing or using our website, applications, and tools, you ("User", "you", or "your") acknowledge that you have read, understood, and agree to be bound by these Terms of Service, along with our Privacy Policy.
        </p>
        <p>
          These Terms constitute a legally binding agreement between you and YuvaNaukri. If you do not agree with any part of these terms, you are prohibited from using or accessing our platform.
        </p>
      </div>
    )
  },
  {
    id: "service",
    title: "1. Description of Service",
    icon: Sparkles,
    tldr: "A free platform with a resume builder, AI career tools, Yuva Assistant, live job listings from third parties, and career guidance.",
    searchText: "description service platform resume builder templates pdf version history share links ai tools ats checker interview prep linkedin optimizer job match yuva assistant chatbot job listings career guidance viksit bharat sdg",
    content: (
      <div className="space-y-4">
        <p>
          YuvaNaukri is a free online career platform for students and freshers. The Service includes:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>A Resume Builder with 4 templates, live preview, theme colors, PDF export, version history and optional public share links.</li>
          <li>AI tools powered by Google Gemini: AI Content Improve, ATS Checker, Interview Prep, LinkedIn About Optimizer and AI Job Match.</li>
          <li>Yuva Assistant, an AI chatbot that answers career questions and can search live job listings.</li>
          <li>Live job listings provided by a third party (Adzuna), a personal Dashboard, and Career Guidance roadmaps.</li>
        </ul>
        <p>
          YuvaNaukri does not submit job applications for you. When you apply for a job, you do so on the employer's or job board's own website.
        </p>
        <p>
          These services are provided "as is" and "as available" to support educational, skill-building, and career advancement initiatives. We continuously update and enhance our features, and we reserve the right to modify, suspend, or discontinue any aspect of the service at any time without prior notice or liability.
        </p>
      </div>
    )
  },
  {
    id: "accounts",
    title: "2. Accounts & Sessions",
    icon: ShieldCheck,
    tldr: "You need an account for most features. Keep your login secure. Sessions last up to 7 days and everyone is logged out every Monday.",
    searchText: "user accounts sessions profile resume builder credentials password register login linkedin secure confidentiality logout monday weekly 7 days",
    content: (
      <div className="space-y-4">
        <p>
          To use features like saving resumes, the AI tools and Yuva Assistant, you must create an account — either with your email and a password, or with "Continue with LinkedIn". You must provide accurate, current, and complete information.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately at <a href="mailto:support@yuvanaukri.org" className="font-semibold text-slate-800 hover:underline">support@yuvanaukri.org</a> if you suspect any unauthorized access or breach of security.
        </p>
        <p>
          Login sessions last up to 7 days. For security, all users are automatically logged out every Monday (a weekly session reset), after which you simply log in again.
        </p>
      </div>
    )
  },
  {
    id: "content",
    title: "3. User Content",
    icon: FileText,
    tldr: "You own your resumes and data, but you let us store and process it so we can run the services for you.",
    searchText: "user content resumes data ownership intellectual property rights host store process share upload information",
    content: (
      <div className="space-y-4">
        <p>
          When you create a resume or post content on our platform, you retain all rights to your data. However, you grant YuvaNaukri the non-exclusive, worldwide, royalty-free license to store, process, and host your content to provide the services, including sending relevant content to our AI provider (Google Gemini) when you use an AI feature.
        </p>
        <p>
          You represent and warrant that you own or have the necessary rights to use all information in your resumes and submissions, and that sharing it does not violate any third-party rights.
        </p>
      </div>
    )
  },
  {
    id: "ai-content",
    title: "4. AI-Generated Content",
    icon: Bot,
    tldr: "AI output can be wrong. Always review it before using it. It is not professional, legal or career advice.",
    searchText: "ai generated content gemini accuracy disclaimer review advice suggestions chatbot yuva assistant ats score",
    content: (
      <div className="space-y-4">
        <p>
          Our AI features (including AI Content Improve, ATS scores and feedback, Interview Prep answers, LinkedIn suggestions, AI Job Match scores and Yuva Assistant replies) are generated automatically and may be inaccurate, incomplete or out of date.
        </p>
        <p>
          You are responsible for reviewing and editing any AI-generated content before using it. AI output is provided for general guidance only and is not professional, legal or career advice. An ATS score or match score does not guarantee any hiring outcome.
        </p>
      </div>
    )
  },
  {
    id: "limits",
    title: "5. Fair Use & Usage Limits",
    icon: Gauge,
    tldr: "AI features have usage limits. Daily limits reset at 00:00 UTC (5:30 AM IST). Limits may change.",
    searchText: "fair use usage limits daily reset quota ats checker interview prep linkedin optimizer job match yuva assistant messages content improve 5:30 am ist utc",
    content: (
      <div className="space-y-4">
        <p>To keep YuvaNaukri free and available for everyone, AI features have the following limits:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>AI Content Improve: 3 uses per account (lifetime, does not reset)</li>
          <li>ATS Checker: 2 per day</li>
          <li>Interview Prep: 2 sessions per day</li>
          <li>LinkedIn About Optimizer: 2 per day</li>
          <li>AI Job Match: 5 per day</li>
          <li>Yuva Assistant: 30 messages per day</li>
        </ul>
        <p>
          Daily limits reset every day at 00:00 UTC (5:30 AM IST). We may change these limits at any time. You agree not to try to bypass them, for example by creating multiple accounts or automating requests.
        </p>
      </div>
    )
  },
  {
    id: "jobs",
    title: "6. Third-Party Job Listings",
    icon: Briefcase,
    tldr: "Job listings come from Adzuna. We don't verify employers and aren't responsible for external sites.",
    searchText: "third party job listings adzuna employers verify external websites apply links responsibility",
    content: (
      <div className="space-y-4">
        <p>
          Job listings shown on YuvaNaukri (on the Jobs page, the Dashboard and in Yuva Assistant) are provided by a third-party service, Adzuna. We do not create these listings, and we do not verify the employers or the accuracy of the listings.
        </p>
        <p>
          Applying for a job takes you to an external website. We are not responsible for the content, practices or privacy policies of external sites, or for any hiring decisions. Never pay money to apply for a job, and use your own judgement before sharing personal information with an employer.
        </p>
      </div>
    )
  },
  {
    id: "share-links",
    title: "7. Public Share Links",
    icon: Link2,
    tldr: "If you turn on a share link, anyone with the link can view that resume. You're responsible for what you share.",
    searchText: "public share links resume sharing visible anyone responsible turn off",
    content: (
      <div className="space-y-4">
        <p>
          When you enable a public share link for a resume, anyone with the link can view that resume without logging in. You are responsible for the content you choose to share and for who you share the link with.
        </p>
        <p>
          You can turn sharing off at any time. We are not responsible for copies of your resume that others may have saved while the link was active.
        </p>
      </div>
    )
  },
  {
    id: "conduct",
    title: "8. Prohibited Conduct",
    icon: ShieldAlert,
    tldr: "Don't use YuvaNaukri for illegal stuff, don't upload harmful content, and don't try to hack or breach our security.",
    searchText: "prohibited conduct illegal harmful offensive fraudulent hacking security breach scraper bot spam copyright",
    content: (
      <div className="space-y-4">
        <p>
          You agree to use our platform responsibly. Specifically, you agree not to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-2">
          <li>Use the service for any illegal or unauthorized purposes.</li>
          <li>Upload harmful, offensive, hateful, defamatory, or fraudulent content.</li>
          <li>Attempt to breach our security, reverse engineer our systems, or access unauthorized data.</li>
          <li>Use automated bots, scrapers, or scripts to access our platform without explicit permission.</li>
          <li>Falsify credentials or impersonate others in your resume submissions or job applications.</li>
        </ul>
      </div>
    )
  },
  {
    id: "termination",
    title: "9. Termination",
    icon: AlertOctagon,
    tldr: "We can suspend or close your account if you break the rules. You can ask us to delete your account at any time.",
    searchText: "termination suspend delete account cancel rules violation discretion ban access closure",
    content: (
      <div className="space-y-4">
        <p>
          We reserve the right to terminate or suspend your account and restrict your access to the service at any time if you violate these Terms of Service, or for any other reason at our sole discretion, with or without prior notice.
        </p>
        <p>
          You may stop using YuvaNaukri at any time. To delete your account, email <a href="mailto:support@yuvanaukri.org" className="font-semibold text-slate-800 hover:underline">support@yuvanaukri.org</a>. Upon termination, all rights granted to you under these terms will immediately cease, and you must discontinue all use of the platform.
        </p>
      </div>
    )
  },
  {
    id: "liability",
    title: "10. Limitation of Liability",
    icon: AlertTriangle,
    tldr: "YuvaNaukri is a free service provided \"as is\", without guarantees. We aren't liable for losses from using it.",
    searchText: "limitation of liability as is warranty disclaimer free service damages losses guarantee",
    content: (
      <div className="space-y-4">
        <p>
          YuvaNaukri is provided free of charge, on an "as is" and "as available" basis, without warranties of any kind. We do not guarantee that the service will be uninterrupted or error-free, that AI output or job listings will be accurate, or that using the service will lead to interviews or job offers.
        </p>
        <p>
          To the fullest extent permitted by law, YuvaNaukri is not liable for any indirect, incidental or consequential damages, or any loss of data, opportunities or income, arising from your use of the service.
        </p>
      </div>
    )
  },
  {
    id: "changes",
    title: "11. Changes to Terms",
    icon: RefreshCw,
    tldr: "We may update these terms. The effective date at the top shows the latest version.",
    searchText: "changes updates terms effective date revisions",
    content: (
      <div className="space-y-4">
        <p>
          We may update these Terms of Service from time to time. When we do, we will update the effective date at the top of this page. Continuing to use YuvaNaukri after an update means you accept the revised terms.
        </p>
      </div>
    )
  }
];

export default function Terms() {
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
    const link = `${window.location.origin}/terms#${id}`;
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
              Legal Center
            </span>
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-xs text-blue-50">Effective: October 7, 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 animate-fade-in">
            Terms of Service
          </h1>
          <p className="text-lg md:text-xl text-blue-50/90 max-w-2xl font-light">
            Welcome to YuvaNaukri. Please review our rules and guidelines that govern your use of our platform and resume builder.
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
                  Search Terms
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search e.g., 'accounts'..."
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
                  Document Sections
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
                        className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                          activeSection === section.id
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

              {/* Document Actions */}
              <div className="flex flex-col gap-2">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <h4 className="text-xs font-bold text-orange-800 mb-1 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    Need Help?
                  </h4>
                  <p className="text-xs text-orange-700 leading-relaxed mb-3 font-sans">
                    If you have questions about these terms, please contact our support team.
                  </p>
                  <Link
                    to="/contact"
                    className="inline-flex items-center text-xs font-bold text-orange-800 hover:text-orange-950 hover:underline gap-1"
                  >
                    Contact Support
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column (Terms Content) */}
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
                    We couldn't find any terms containing "{searchQuery}". Try searching for something else like "accounts" or "resume".
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

                    {/* Detailed Legal content */}
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
