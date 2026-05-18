import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Brain, Palette, BarChart, BadgeDollarSign, PenTool, Code,
  Sparkles, Award, ArrowRight, BookOpen, Compass, ChevronRight, X, Loader2
} from "lucide-react";
import { useToast } from "../context/ToastContext";

const CareerGuidance = () => {
  const { showToast } = useToast();

  const [activeRoadmap, setActiveRoadmap] = useState(null);

  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({
    interest: "",
    environment: "",
    style: ""
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  const careers = [
    {
      id: "ai-tech",
      icon: Code,
      color: "from-blue-500 to-indigo-600",
      bgLight: "bg-blue-50",
      textDark: "text-blue-700",
      title: "AI & Software Engineering",
      roles: "AI Engineer, Full-Stack Developer, Data Scientist",
      growth: "28% YoY Growth",
      salary: "₹6 - 25 LPA",
      skills: ["JavaScript/Python", "Data Structures", "System Design"],
      roadmap: [
        "Learn core programming concepts & version control (Git).",
        "Master Data Structures, Algorithms, and database management.",
        "Build 3 full-stack applications or train custom machine learning models.",
        "Contribute to open-source and apply for developer internships."
      ]
    },
    {
      id: "ui-ux",
      icon: Palette,
      color: "from-pink-500 to-rose-600",
      bgLight: "bg-pink-50",
      textDark: "text-pink-700",
      title: "UI/UX & Product Design",
      roles: "Product Designer, UX Researcher, Interaction Specialist",
      growth: "22% YoY Growth",
      salary: "₹5 - 18 LPA",
      skills: ["Figma / Adobe XD", "User Research", "Wireframing"],
      roadmap: [
        "Learn design fundamentals: Typography, grid systems, and color theory.",
        "Master Figma and user-centric design principles.",
        "Conduct user research and create interactive case studies.",
        "Build a strong portfolio on Behance or a personal website."
      ]
    },
    {
      id: "marketing",
      icon: BarChart,
      color: "from-amber-500 to-orange-600",
      bgLight: "bg-amber-50",
      textDark: "text-amber-700",
      title: "Growth & Digital Marketing",
      roles: "SEO Specialist, Growth Marketer, Content Strategist",
      growth: "18% YoY Growth",
      salary: "₹4 - 12 LPA",
      skills: ["Google Analytics", "Copywriting", "SEO Optimization"],
      roadmap: [
        "Understand marketing funnels, customer acquisition, and brand psychology.",
        "Learn search engine optimization (SEO) and paid advertising tools.",
        "Practice growth hacking on micro-projects or local businesses.",
        "Get certified in Google Ads and build a personal brand online."
      ]
    },
    {
      id: "finance",
      icon: BadgeDollarSign,
      color: "from-emerald-500 to-teal-600",
      bgLight: "bg-emerald-50",
      textDark: "text-emerald-700",
      title: "FinTech & Investment Banking",
      roles: "Financial Analyst, Blockchain Engineer, Portfolio Specialist",
      growth: "16% YoY Growth",
      salary: "₹6 - 22 LPA",
      skills: ["Financial Modeling", "Solidity/SQL", "Risk Assessment"],
      roadmap: [
        "Learn corporate finance foundations, accounting, and spreadsheet tools.",
        "Get certified in relevant finance courses or study CFA/FRM modules.",
        "Work on mock asset portfolios or build decentralized finance (DeFi) smart contracts.",
        "Apply for entry-level analyst internships at trading or startup firms."
      ]
    },
    {
      id: "content",
      icon: PenTool,
      color: "from-violet-500 to-purple-600",
      bgLight: "bg-violet-50",
      textDark: "text-violet-700",
      title: "Creative Writing & Branding",
      roles: "Technical Writer, UX Copywriter, Brand Consultant",
      growth: "14% YoY Growth",
      salary: "₹3.5 - 10 LPA",
      skills: ["Copywriting", "Content Strategy", "Technical Documentation"],
      roadmap: [
        "Develop an exceptional voice, grammar, and writing flow.",
        "Learn SEO-optimized writing and specialized technical documentation formats.",
        "Start a newsletter, medium publication, or write case studies.",
        "Apply to digital publication hubs or content design agencies."
      ]
    },
    {
      id: "pm",
      icon: Brain,
      color: "from-cyan-500 to-blue-600",
      bgLight: "bg-cyan-50",
      textDark: "text-cyan-700",
      title: "Product Management",
      roles: "Associate PM, Product Owner, Program Coordinator",
      growth: "20% YoY Growth",
      salary: "₹7 - 24 LPA",
      skills: ["Agile/Scrum", "Product Analytics", "Roadmapping"],
      roadmap: [
        "Develop tech fluency and learn how to interpret business metrics.",
        "Study successful product case studies (e.g. Uber, Spotify product models).",
        "Master wireframing, SQL basics, and product planning tools like Jira.",
        "Participate in product teardowns and network with product leads."
      ]
    }
  ];

  const handleQuizAnswer = (field, value) => {
    setQuizAnswers(prev => ({ ...prev, [field]: value }));
    setQuizStep(prev => prev + 1);
  };

  const generateQuizResult = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      let recommended = careers[0];

      const { interest, environment, style } = quizAnswers;

      if (interest === "tech") {
        recommended = careers[0];
      } else if (interest === "design") {
        recommended = careers[1];
      } else if (interest === "business" && environment === "startup") {
        recommended = careers[5];
      } else if (interest === "business") {
        recommended = careers[3];
      } else if (interest === "creative" && style === "self") {
        recommended = careers[4];
      } else {
        recommended = careers[2];
      }

      setQuizResult(recommended);
      setIsAnalyzing(false);
      setQuizStep(4);
      showToast("✨ AI Career Recommendation generated!");
    }, 1800);
  };

  const resetQuiz = () => {
    setQuizAnswers({ interest: "", environment: "", style: "" });
    setQuizResult(null);
    setQuizStep(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-16">

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="w-16 h-16 bg-gradient-to-tr from-[#00A86B] to-[#0076BC] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 text-white"
          >
            <Compass className="w-8 h-8 animate-pulse" />
          </motion.div>

          <h1 className="text-4xl lg:text-6xl font-black mb-4 tracking-tight leading-tight">
            Design Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A86B] to-[#0076BC]">
              Dream Career
            </span>
          </h1>

          <p className="text-slate-500 text-lg lg:text-xl leading-relaxed mb-8">
            Navigate your career with precision. Explore structured professional roadmaps and discover paths designed for the digital workforce.
          </p>

          <a
            href="#career-paths"
            className="bg-gradient-to-r from-[#00A86B] to-[#0076BC] hover:opacity-95 text-white px-8 py-4 rounded-2xl font-extrabold text-base shadow-xl shadow-emerald-500/10 flex items-center gap-2 transition duration-200"
          >
            Explore Paths <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <div className="mb-28 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 lg:p-12 rounded-[32px] text-white shadow-2xl border border-slate-800 relative overflow-hidden">
            <div className="absolute -top-48 -right-48 w-96 h-96 bg-[#00A86B]/10 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-[#0076BC]/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 text-[#00A86B]">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-black tracking-widest uppercase">Smart Assistant</span>
              </div>

              {quizStep === 0 && (
                <div>
                  <h2 className="text-3xl font-extrabold mb-4 leading-tight">Not sure where to begin?</h2>
                  <p className="text-slate-400 mb-8 text-base leading-relaxed">
                    Take our 45-second Interactive Career Assessment. Our advisor tool will analyze your primary interests, ideal working environment, and educational style to output the perfect career roadmap recommendation.
                  </p>
                  <button
                    onClick={() => setQuizStep(1)}
                    className="bg-[#00A86B] hover:bg-emerald-600 px-8 py-4 rounded-xl font-bold transition shadow-lg shadow-emerald-500/20"
                  >
                    Start Advisor Quiz
                  </button>
                </div>
              )}

              {/* Step 1: Interest Choice */}
              {quizStep === 1 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">1. What sparks your excitement the most?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => handleQuizAnswer("interest", "tech")} className="text-left bg-white/5 border border-white/10 hover:border-[#00A86B] hover:bg-white/10 p-5 rounded-2xl transition">
                      <h4 className="font-bold text-lg mb-1 flex items-center gap-2"><Code className="w-5 h-5 text-indigo-400" /> Building Software / Coding</h4>
                      <p className="text-xs text-slate-400">Create software, databases, or training models.</p>
                    </button>
                    <button onClick={() => handleQuizAnswer("interest", "design")} className="text-left bg-white/5 border border-white/10 hover:border-[#00A86B] hover:bg-white/10 p-5 rounded-2xl transition">
                      <h4 className="font-bold text-lg mb-1 flex items-center gap-2"><Palette className="w-5 h-5 text-rose-400" /> UX Research / Drawing</h4>
                      <p className="text-xs text-slate-400">Design interactive layouts and user portfolios.</p>
                    </button>
                    <button onClick={() => handleQuizAnswer("interest", "business")} className="text-left bg-white/5 border border-white/10 hover:border-[#00A86B] hover:bg-white/10 p-5 rounded-2xl transition">
                      <h4 className="font-bold text-lg mb-1 flex items-center gap-2"><BarChart className="w-5 h-5 text-amber-400" /> Business / Data Analytics</h4>
                      <p className="text-xs text-slate-400">Evaluate market trends, systems, and metrics.</p>
                    </button>
                    <button onClick={() => handleQuizAnswer("interest", "creative")} className="text-left bg-white/5 border border-white/10 hover:border-[#00A86B] hover:bg-white/10 p-5 rounded-2xl transition">
                      <h4 className="font-bold text-lg mb-1 flex items-center gap-2"><PenTool className="w-5 h-5 text-violet-400" /> Writing / Brand Content</h4>
                      <p className="text-xs text-slate-400">Draft professional copy or technical writeups.</p>
                    </button>
                  </div>
                </div>
              )}

              {quizStep === 2 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">2. What is your ideal working setting?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button onClick={() => handleQuizAnswer("environment", "remote")} className="text-left bg-white/5 border border-white/10 hover:border-[#0076BC] p-5 rounded-2xl transition">
                      <h4 className="font-bold text-lg mb-1">Fully Remote</h4>
                      <p className="text-xs text-slate-400">Complete work from anywhere globally.</p>
                    </button>
                    <button onClick={() => handleQuizAnswer("environment", "startup")} className="text-left bg-white/5 border border-white/10 hover:border-[#0076BC] p-5 rounded-2xl transition">
                      <h4 className="font-bold text-lg mb-1">Fast Startup</h4>
                      <p className="text-xs text-slate-400">Fast scaling work dynamic.</p>
                    </button>
                    <button onClick={() => handleQuizAnswer("environment", "corp")} className="text-left bg-white/5 border border-white/10 hover:border-[#0076BC] p-5 rounded-2xl transition">
                      <h4 className="font-bold text-lg mb-1">Stable Corp</h4>
                      <p className="text-xs text-slate-400">Standard operations and structures.</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Education Style */}
              {quizStep === 3 && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">3. What is your preferred study path?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <button onClick={() => setQuizAnswers(p => ({ ...p, style: "self" }))} className={`text-left bg-white/5 border p-5 rounded-2xl transition ${quizAnswers.style === "self" ? "border-[#00A86B] bg-white/10" : "border-white/10 hover:border-slate-500"}`}>
                      <h4 className="font-bold text-lg mb-1">Self-Taught</h4>
                      <p className="text-xs text-slate-400">Learn on-demand with tutorials and docs.</p>
                    </button>
                    <button onClick={() => setQuizAnswers(p => ({ ...p, style: "boot" }))} className={`text-left bg-white/5 border p-5 rounded-2xl transition ${quizAnswers.style === "boot" ? "border-[#00A86B] bg-white/10" : "border-white/10 hover:border-slate-500"}`}>
                      <h4 className="font-bold text-lg mb-1">Bootcamp</h4>
                      <p className="text-xs text-slate-400">Intense, fast practical structures.</p>
                    </button>
                    <button onClick={() => setQuizAnswers(p => ({ ...p, style: "uni" }))} className={`text-left bg-white/5 border p-5 rounded-2xl transition ${quizAnswers.style === "uni" ? "border-[#00A86B] bg-white/10" : "border-white/10 hover:border-slate-500"}`}>
                      <h4 className="font-bold text-lg mb-1">University</h4>
                      <p className="text-xs text-slate-400">Formal, extensive engineering degree.</p>
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <button
                      disabled={!quizAnswers.style || isAnalyzing}
                      onClick={generateQuizResult}
                      className="bg-[#00A86B] hover:bg-emerald-600 disabled:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>Analyzing Profile... <Loader2 className="w-5 h-5 animate-spin" /></>
                      ) : (
                        <>Generate Recommendation <Sparkles className="w-5 h-5" /></>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Results */}
              {quizStep === 4 && quizResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <h3 className="text-2xl font-bold mb-2">🎉 Recommended Career Path</h3>
                  <p className="text-slate-400 mb-8 text-sm">Based on your interests, we found the perfect professional match!</p>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-tr ${quizResult.color} text-white shrink-0`}>
                        <quizResult.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-xl font-extrabold mb-1">{quizResult.title}</h4>
                        <p className="text-[#00A86B] text-sm font-bold">{quizResult.growth} • {quizResult.salary}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setActiveRoadmap(quizResult); }}
                      className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition whitespace-nowrap"
                    >
                      View Step-by-Step Roadmap
                    </button>
                  </div>

                  <button
                    onClick={resetQuiz}
                    className="text-slate-400 hover:text-white text-sm font-bold flex items-center gap-1 transition"
                  >
                    Retake Advisor Quiz <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Section: Popular Career Paths */}
        <section id="career-paths" className="scroll-mt-12 mb-28">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Popular Career Paths</h2>
            <p className="text-slate-500 font-medium">Explore high-demand career sectors and get detailed roadmap steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {careers.map((career) => {
              const IconComponent = career.icon;
              return (
                <div
                  key={career.id}
                  className="bg-white border border-slate-100 rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Icon Card */}
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${career.color} text-white flex items-center justify-center mb-6`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <h3 className="text-xl font-black text-slate-800 mb-2">{career.title}</h3>
                    <p className="text-slate-400 text-xs font-semibold mb-6">{career.roles}</p>

                    {/* Stats & Growth */}
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100/50 mb-6">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Average Salary</span>
                        <span className="text-slate-800 text-sm font-extrabold">{career.salary}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Growth Rate</span>
                        <span className="text-emerald-600 text-sm font-extrabold">{career.growth}</span>
                      </div>
                    </div>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {career.skills.map((skill, sIdx) => (
                        <span key={sIdx} className="bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-lg font-bold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveRoadmap(career)}
                    className="w-full bg-slate-50 group-hover:bg-[#0076BC] group-hover:text-white text-slate-700 py-3 rounded-2xl font-bold text-sm transition-colors border border-slate-100/50 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    View Career Roadmap <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Static Section: Free Career Guidance Resources */}
        <section className="bg-white border border-slate-100 rounded-[32px] p-8 lg:p-12 shadow-xl mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="bg-[#00A86B]/10 text-[#00A86B] text-xs font-black px-3 py-1.5 rounded-lg uppercase tracking-wider mb-4 inline-block">
                Skill Up Today
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight">
                Unlock Free Professional Career Learning Resources
              </h2>
              <p className="text-slate-500 font-medium leading-relaxed">
                Take the next professional step. Use our industry resume builder tools to format, customize layout components, and apply directly to matching company listings.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <a
                href="/resume-builder"
                className="bg-[#0076BC] hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition shadow-lg shadow-blue-500/20 text-sm"
              >
                Launch Resume Builder
              </a>
              <a
                href="/jobs"
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold transition text-sm"
              >
                Search Current Jobs
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Career Roadmap Detail Modal */}
      <AnimatePresence>
        {activeRoadmap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveRoadmap(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl relative z-10 border border-slate-100 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className={`p-8 bg-gradient-to-tr ${activeRoadmap.color} text-white flex justify-between items-start relative`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-white/70 block mb-1">
                    Roadmap Guidelines
                  </span>
                  <h3 className="text-2xl font-black">{activeRoadmap.title}</h3>
                  <p className="text-white/80 text-xs font-semibold mt-1">Average Entry Range: {activeRoadmap.salary}</p>
                </div>
                <button
                  onClick={() => setActiveRoadmap(null)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content (Scrollable) */}
              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                <h4 className="text-sm font-black text-slate-800 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#0076BC]" />
                  Recommended Roadmaps Steps
                </h4>

                <div className="space-y-6 relative border-l border-slate-100 pl-6 ml-3">
                  {activeRoadmap.roadmap.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Bullet number indicator */}
                      <span className={`absolute -left-[38px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold bg-gradient-to-tr ${activeRoadmap.color} text-white`}>
                        {idx + 1}
                      </span>
                      <p className="text-slate-600 text-sm font-bold leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Top Skills Needed</span>
                    <div className="flex gap-2">
                      {activeRoadmap.skills.map((s, sIdx) => (
                        <span key={sIdx} className="text-slate-700 text-xs font-extrabold bg-slate-100 px-3 py-1 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveRoadmap(null);
                      showToast("Roadmap applied! Ready to format layout.");
                    }}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-xs transition"
                  >
                    Close Roadmap
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default CareerGuidance;
