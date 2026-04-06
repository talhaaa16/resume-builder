import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1E2A32] text-gray-300 px-10 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-600 pb-10">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-[#0076BC] rounded-md flex items-center justify-center">
              <span className="text-white font-bold">YN</span>
            </div>
            <h1 className="text-xl font-bold text-white">YuvaNaukri</h1>
          </div>
          <p>
            Empowering India's youth with tools and opportunities for successful
            careers. Contributing to Viksit Bharat @2047.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/resume-builder" className="hover:text-white">Resume Builder</a></li>
            <li><a href="/jobs" className="hover:text-white">Job Listings</a></li>
            <li><a href="/carrier" className="hover:text-white">Career Guidance</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
            <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Get in Touch</h3>
          <ul className="space-y-3">
            <li className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-orange-400" />
              <span>support@yuvanaukri.org</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-orange-400" />
              <span>+91 99999 00000</span>
            </li>
            <li className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-orange-400" />
              <span>Ahmedabad, India</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm text-gray-400">
        <p>© 2025 YuvaNaukri. All rights reserved.</p>
        <p>Contributing to SDG 4 & SDG 8 • Viksit Bharat @2047</p>
      </div>
    </footer>
  );
}
