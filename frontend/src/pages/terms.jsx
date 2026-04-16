import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Terms() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <h1 className="text-4xl font-bold text-[#0076BC] mb-6">Terms of Service</h1>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-gray-700 space-y-6">
          <p className="text-sm text-gray-500">Last updated: April 16, 2026</p>
          
          <p>Welcome to YuvaNaukri! By accessing or using our website, you agree to be bound by these Terms of Service and our Privacy Policy.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">1. Description of Service</h2>
          <p>YuvaNaukri provides an online platform that allows users to create resumes, explore job listings, and receive career guidance. These services are provided "as is" and intended to support educational and career advancement.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">2. User Accounts</h2>
          <p>To use certain features like the Resume Builder, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">3. User Content</h2>
          <p>When you create a resume or post content on our platform, you retain all rights to your data. However, you grant YuvaNaukri the right to store and process your data to provide the requested services.</p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">4. Prohibited Conduct</h2>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>You agree not to use the service for any illegal purposes.</li>
            <li>You agree not to upload harmful, offensive, or fraudulent content.</li>
            <li>You agree not to attempt to breach our security or access unauthorized data.</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">5. Termination</h2>
          <p>We reserve the right to terminate or suspend your account at any time if you violate these Terms of Service or for any other reason at our sole discretion.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
