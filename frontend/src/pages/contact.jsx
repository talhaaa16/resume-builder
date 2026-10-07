import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, MapPin, MessageSquare, Send } from "lucide-react";
import { useToast } from "../context/ToastContext";

const SUPPORT_EMAIL = "support@yuvanaukri.org";

export default function Contact() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Field Validation
    if (!formData.name.trim()) {
      showToast("Please enter your name.", "error");
      return;
    }
    if (!formData.email.trim()) {
      showToast("Please enter your email address.", "error");
      return;
    }
    
    // Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    if (!formData.message.trim()) {
      showToast("Please enter your message.", "error");
      return;
    }

    // Open the user's email app with the message pre-filled
    const subject = `YuvaNaukri support request from ${formData.name.trim()}`;
    const body = `Name: ${formData.name.trim()}\nEmail: ${formData.email.trim()}\n\nMessage:\n${formData.message.trim()}`;
    showToast("Opening your email app…", "info");
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="flex-1 max-w-6xl mx-auto px-4 py-16 w-full flex flex-col justify-center">
        {/* Header Block */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A86B] to-[#0076BC]">
              Touch
            </span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Have questions, feedback, or need help? Send us a message and our support team will get back to you as soon as possible.
          </p>
        </div>

        {/* Info & Form Container Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100">
          
          {/* Left Column: Premium Contact Details Banner */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#00A86B] to-[#0076BC] p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden min-h-[350px] lg:min-h-[500px]">
            <div className="absolute -top-24 -left-24 w-64 h-64 lg:w-96 lg:h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-64 h-64 lg:w-96 lg:h-96 bg-black/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-2xl lg:text-3xl font-extrabold mb-8 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 shrink-0" />
                Contact Info
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4 bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                  <div className="bg-white p-3 rounded-xl text-[#00A86B] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">Email Us</h3>
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="text-white/80 hover:text-white hover:underline text-sm font-medium break-all">{SUPPORT_EMAIL}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-white/10 p-5 rounded-2xl border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                  <div className="bg-white p-3 rounded-xl text-[#00A86B] shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base mb-1">Our Office</h3>
                    <p className="text-white/80 text-sm font-medium">Ahmedabad, Gujarat, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 text-xs text-white/60 font-medium pt-8 lg:pt-0">
              © {new Date().getFullYear()} YuvaNaukri. All rights reserved.
            </div>
          </div>

          {/* Right Column: Premium Contact Form */}
          <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-white">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Send Us a Message</h2>
            <p className="text-slate-400 mb-8 text-sm font-medium">Fill in the fields below and we'll open your email app with your message ready to send.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A86B] focus:border-transparent transition-all bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A86B] focus:border-transparent transition-all bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea
                  rows="4"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your message here..."
                  className="w-full border border-slate-200 rounded-xl p-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00A86B] focus:border-transparent transition-all bg-slate-50 font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00A86B] hover:bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg transition duration-200 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                Send Message <Send className="w-5 h-5" />
              </button>
              <p className="text-xs text-slate-400 text-center -mt-2">
                This opens your email app. You can also email us directly at{" "}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[#0076BC] hover:underline">{SUPPORT_EMAIL}</a>.
              </p>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
