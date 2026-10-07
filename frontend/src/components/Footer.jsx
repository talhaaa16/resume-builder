import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1E2A32] text-gray-300 px-10 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-600 pb-10">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-[#0076BC] rounded-md flex items-center justify-center">
              <span className="text-white font-bold">YN</span>
            </div>
            <span className="text-xl font-bold text-white">YuvaNaukri</span>
          </div>
          <p>
            Empowering India's youth with tools and opportunities for successful
            careers. Contributing to Viksit Bharat @2047.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
            <li><Link to="/resume-builder" className="hover:text-white">Resume Builder</Link></li>
            <li><Link to="/jobs" className="hover:text-white">Job Listings</Link></li>
            <li><Link to="/ats-checker" className="hover:text-white">ATS Checker</Link></li>
            <li><Link to="/interview-prep" className="hover:text-white">Interview Prep</Link></li>
            <li><Link to="/linkedin-optimizer" className="hover:text-white">LinkedIn Optimizer</Link></li>
            <li><Link to="/career-guidance" className="hover:text-white">Career Guidance</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2">
            <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-orange-400" />
              <a href="mailto:support@yuvanaukri.org" className="hover:text-white">support@yuvanaukri.org</a>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-orange-400" />
              <span>Ahmedabad, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm text-gray-400">
        <p>© {new Date().getFullYear()} YuvaNaukri. All rights reserved.</p>
        <p>Contributing to SDG 4 & SDG 8 • Viksit Bharat @2047</p>
      </div>
    </footer>
  );
}
