import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Sparkles, FileSearch } from "lucide-react";

export default function ATSChecker() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-20 w-full flex flex-col items-center justify-center text-center">
        <div className="bg-white p-12 rounded-[32px] shadow-2xl border border-slate-100 w-full max-w-3xl relative overflow-hidden">
          
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-green-100 rounded-full blur-3xl opacity-50"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-gradient-to-tr from-[#00A86B] to-[#0076BC] p-6 rounded-3xl text-white mb-8 shadow-lg inline-flex items-center justify-center">
              <FileSearch className="w-16 h-16" />
            </div>
            
            <h1 className="text-5xl font-black mb-6 tracking-tight text-slate-800">
              AI ATS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A86B] to-[#0076BC]">Checker</span>
            </h1>
            
            <p className="text-slate-500 text-xl leading-relaxed mb-8 max-w-xl">
              We're building an advanced AI tool to analyze your resume against job descriptions, calculate match scores, and give you actionable feedback to pass any Applicant Tracking System.
            </p>

            <div className="inline-flex items-center gap-2 bg-blue-50 text-[#0076BC] px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm border border-blue-100">
              <Sparkles className="w-4 h-4" />
              Coming Soon
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
