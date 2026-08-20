import React, { useEffect, useState } from "react";
import { Users, TrendingUp, FileText, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [resumes, setResumes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0076BC] to-[#00A86B] text-white">
      <Navbar />

      <section className="flex flex-col md:flex-row items-center justify-between px-12 py-20">
        <div className="max-w-xl">
          <h2 className="text-5xl font-extrabold leading-tight">
            Empower Your <span className="text-orange-500">Career Journey</span>
          </h2>
          <p className="mt-6 text-lg text-gray-100">
            Build professional resumes, discover opportunities, and get career guidance - all designed for India's ambitious youth.
          </p>
          <div className="mt-8 flex space-x-4">
            <button onClick={() => navigate("/resume-builder")} className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-md font-semibold text-white">
              Start Building Resume →
            </button>
            <button onClick={() => navigate("/jobs")} className="border border-white px-6 py-3 rounded-md font-semibold text-white hover:bg-white hover:text-[#0076BC] transition">
              Explore Jobs
            </button>
          </div>
        </div>

        <div className="mt-16 md:mt-0 md:w-[55%] flex justify-center relative w-full h-[450px]">
          {/* Background glowing orbs */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-400 blur-[100px] opacity-50 w-72 h-72 rounded-full"></div>
          <div className="absolute top-0 right-1/4 bg-orange-400 blur-[80px] opacity-40 w-56 h-56 rounded-full"></div>
          
          {/* Main Glass Card (Features Showcase) */}
          <div className="relative z-10 w-full max-w-[420px] bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl p-7 shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex flex-col transform hover:scale-[1.02] transition-transform duration-500 self-center">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0076BC] to-[#00A86B] flex items-center justify-center text-white shadow-lg ring-2 ring-white/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-wide">YuvaNaukri</h3>
                  <p className="text-xs text-blue-100 font-bold uppercase tracking-widest">Platform Features</p>
                </div>
              </div>
              <div className="bg-white/20 px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest text-white flex items-center gap-1 uppercase shadow-md animate-pulse">
                Live
              </div>
            </div>

            {/* Feature blocks */}
            <div className="space-y-4 flex-grow">
              
              <div className="flex gap-4 items-center bg-white/10 p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">Smart Resume Builder</h4>
                  <p className="text-[11px] text-blue-50 mt-1 leading-relaxed opacity-90">Create recruiter-ready resumes in minutes with our drag-and-drop templates.</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-center bg-white/10 p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">AI ATS Checker</h4>
                  <p className="text-[11px] text-emerald-50 mt-1 leading-relaxed opacity-90">Instantly score your resume against job descriptions to guarantee you pass filters.</p>
                </div>
              </div>

              <div className="flex gap-4 items-center bg-white/10 p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">1-Click Job Apply</h4>
                  <p className="text-[11px] text-indigo-50 mt-1 leading-relaxed opacity-90">Discover top opportunities and apply directly with your saved profile.</p>
                </div>
              </div>

            </div>
          </div>
          
          {/* Floating badge 1: ATS Score */}
          <div className="absolute top-8 -right-4 lg:-right-8 z-20 bg-white text-slate-800 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-slate-100 flex items-center gap-4 animate-bounce hover:scale-105 transition-transform" style={{ animationDuration: '3s' }}>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 ring-4 ring-green-50">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">ATS Pass Rate</p>
              <p className="text-2xl font-black text-green-500 leading-none mt-1">98%</p>
            </div>
          </div>

          {/* Floating badge 2: Users */}
          <div className="absolute bottom-10 -left-4 lg:-left-12 z-20 bg-white text-slate-800 p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-slate-100 flex items-center gap-4 animate-bounce hover:scale-105 transition-transform" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 ring-4 ring-orange-50">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest">Active Users</p>
              <p className="text-2xl font-black text-orange-500 leading-none mt-1">50k+</p>
            </div>
          </div>
          
        </div>
      </section>



      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-20 text-center">
        <div>
          <Users className="mx-auto h-10 w-10 text-orange-400" />
          <h3 className="mt-2 text-2xl font-bold">50K+</h3>
          <p className="text-gray-100">Youth Empowered</p>
        </div>
        <div>
          <Briefcase className="mx-auto h-10 w-10 text-yellow-400" />
          <h3 className="mt-2 text-2xl font-bold">10K+</h3>
          <p className="text-gray-100">Jobs Listed</p>
        </div>
        <div>
          <TrendingUp className="mx-auto h-10 w-10 text-green-300" />
          <h3 className="mt-2 text-2xl font-bold">85%</h3>
          <p className="text-gray-100">Success Rate</p>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6 md:px-20 text-center text-slate-900">
        <h2 className="text-3xl font-bold mb-4">
          Everything You Need to Succeed
        </h2>
        <p className="text-gray-600 text-lg mb-12">
          Comprehensive tools and resources designed specifically for India's youth to build successful careers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">
              Professional Resume Builder
            </h3>
            <p className="text-gray-600 mb-6">
              Create stunning resumes with our easy-to-use templates designed for Indian job market.
            </p>
            <button onClick={() => navigate("/resume-builder")} className="font-semibold text-gray-900 hover:underline flex items-center justify-center space-x-1 mx-auto">
              <span>Build Resume</span>
              <span>→</span>
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Briefcase className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">
              Entry-Level Job Listings
            </h3>
            <p className="text-gray-600 mb-6">
              Discover thousands of opportunities perfect for fresh graduates and career starters.
            </p>
            <button onClick={() => navigate("/jobs")} className="font-semibold text-gray-900 hover:underline flex items-center justify-center space-x-1 mx-auto">
              <span>Browse Jobs</span>
              <span>→</span>
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <GraduationCap className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4">
              Career Guidance
            </h3>
            <p className="text-gray-600 mb-6">
              Get expert advice, skill development tips, and interview preparation guidance.
            </p>
            <button onClick={() => navigate("/carrier")} className="font-semibold text-gray-900 hover:underline flex items-center justify-center space-x-1 mx-auto">
              <span>Get Guidance</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 px-6 md:px-20 text-center text-gray-900">
        <p className="inline-block bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
          Contributing to Viksit Bharat @2047
        </p>
        <h2 className="text-3xl font-bold mb-12">
          Aligned with UN Sustainable Development Goals
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="border rounded-xl p-8 hover:shadow-md transition">
            <h3 className="text-xl font-bold text-blue-600 mb-2">SDG 4</h3>
            <h4 className="text-lg font-semibold mb-2">Quality Education</h4>
            <p className="text-gray-600">
              Providing skill development and career guidance for lifelong learning
            </p>
          </div>
          <div className="border rounded-xl p-8 hover:shadow-md transition">
            <h3 className="text-xl font-bold text-blue-600 mb-2">SDG 8</h3>
            <h4 className="text-lg font-semibold mb-2">Decent Work</h4>
            <p className="text-gray-600">
              Creating pathways to productive employment and economic growth
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
        <p className="text-gray-600 mb-12">
          Real stories from youth who transformed their careers with YuvaNaukri
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StoryCard
            name="Priya Sharma"
            role="Software Developer at Tech Corp"
            text="YuvaNaukri helped me create my first professional resume. Within a month, I landed my dream job!"
          />
          <StoryCard
            name="Rahul Kumar"
            role="Marketing Assistant at Digital Agency"
            text="The career guidance section was invaluable. I learned interview skills that changed my confidence completely."
          />
          <StoryCard
            name="Anita Desai"
            role="Data Analyst at Analytics Inc"
            text="Found my current job through YuvaNaukri's job portal. The platform truly understands what youth need."
          />
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#0076BC] to-[#00A86B] py-20 px-6 md:px-20 text-center">
        <Sparkles className="mx-auto h-8 w-8 text-orange-400 mb-4" />
        <h2 className="text-4xl font-bold mb-6">
          Ready to Transform Your Career?
        </h2>
        <p className="text-lg text-gray-100 max-w-2xl mx-auto mb-10">
          Join thousands of successful youth who have built their careers with YuvaNaukri.
          Start your journey today – it’s completely free!
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button onClick={() => navigate("/resume-builder")} className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-md font-semibold text-white">
            Create Your Resume Now →
          </button>
          <button onClick={() => navigate("/jobs")} className="border border-white px-8 py-3 rounded-md font-semibold text-white hover:bg-white hover:text-[#0076BC] transition">
            Explore Job Opportunities
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StoryCard({ name, role, text }) {
  return (
    <div className="bg-white border text-left rounded-2xl p-6 shadow hover:shadow-lg transition">
      <p className="text-orange-500 text-3xl mb-2">❝</p>
      <p className="text-gray-700 mb-4 italic">"{text}"</p>
      <h4 className="font-bold">{name}</h4>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  );
}
