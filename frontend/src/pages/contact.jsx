import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <h1 className="text-4xl font-bold text-[#0076BC] mb-6">Contact Us</h1>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <p className="text-gray-700 leading-relaxed mb-6">
            We would love to hear from you! If you have any questions, feedback, or need assistance with YuvaNaukri, please reach out to us using the details below.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-800">Email Address</h3>
              <p className="text-gray-600">support@yuvanaukri.org</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Phone Number</h3>
              <p className="text-gray-600">+91 99999 00000</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Office Address</h3>
              <p className="text-gray-600">Ahmedabad, Gujarat, India</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Send us a message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0076BC] outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0076BC] outline-none" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows="4" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0076BC] outline-none" placeholder="How can we help you?"></textarea>
              </div>
              <button type="button" className="bg-[#0076BC] text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">Send Message</button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
