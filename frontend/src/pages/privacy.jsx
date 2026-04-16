import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Privacy() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <h1 className="text-4xl font-bold text-[#0076BC] mb-6">Privacy Policy</h1>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-gray-700 space-y-6">
          <p className="text-sm text-gray-500">Last updated: April 16, 2026</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Information We Collect</h2>
          <p>When you use YuvaNaukri, we may collect personal information such as your name, email address, educational background, professional experience, and any other details you choose to include in your resume or profile.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, including generating resumes, offering career guidance, and showing relevant job opportunities. We do not sell your personal information to third parties.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">3. Data Security</h2>
          <p>We implement strict security measures to protect your personal data from unauthorized access or disclosure. Resumes created on our platform are secured using standard encryption practices.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">4. Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information at any time. You can view or delete your resumes from your account dashboard.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">5. Cookies</h2>
          <p>We use cookies to keep you logged in and understand how you interact with our platform to improve user experience.</p>

          <p className="mt-8 font-medium">If you have any questions about this Privacy Policy, please <a href="/contact" className="text-blue-600 hover:underline">contact us</a>.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
