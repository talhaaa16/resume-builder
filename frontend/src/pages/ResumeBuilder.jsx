import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaSave, FaTrash } from "react-icons/fa";

export default function ResumeBuilder() {
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    fullName: "",
    designation: "",
    summary: "",
    profilePhoto: null,

    address: "",
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, profilePhoto: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const removePhoto = () => {
    setForm({ ...form, profilePhoto: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0076BC] to-[#00A86B] p-10 flex gap-8">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-1/2">
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold text-[#0076BC] mb-6">
              Personal Information
            </h2>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {form.profilePhoto ? (
                  <img
                    src={form.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">+ Profile</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="text-sm"
                />
                {form.profilePhoto && (
                  <button
                    onClick={removePhoto}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <FaTrash /> Remove
                  </button>
                )}
              </div>
            </div>

            {/* Full Name & Designation */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-[#0076BC] outline-none py-2"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-[#0076BC] outline-none py-2"
                  placeholder="UI Designer, Frontend Dev..."
                />
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600">
                Summary
              </label>
              <textarea
                name="summary"
                value={form.summary}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#0076BC] outline-none"
                placeholder="Write a short professional summary..."
                rows="4"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold text-[#0076BC] mb-6">
              Contact Information
            </h2>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-[#00A86B] outline-none py-2"
                placeholder="Short Address"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-[#00A86B] outline-none py-2"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-[#00A86B] outline-none py-2"
                  placeholder="9876543210"
                />
              </div>
            </div>

            {/* LinkedIn & GitHub */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  LinkedIn
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-[#00A86B] outline-none py-2"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  GitHub
                </label>
                <input
                  type="text"
                  name="github"
                  value={form.github}
                  onChange={handleChange}
                  className="w-full border-b-2 border-gray-300 focus:border-[#00A86B] outline-none py-2"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            {/* Portfolio */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Portfolio / Website
              </label>
              <input
                type="text"
                name="portfolio"
                value={form.portfolio}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 focus:border-[#00A86B] outline-none py-2"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            disabled={step === 1}
            onClick={() => setStep(step - 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              step === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#E0F7F1] text-[#0076BC]"
            }`}
          >
            <FaArrowLeft /> Back
          </button>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-200 text-purple-700 rounded-lg">
              <FaSave /> Save & Exit
            </button>
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-[#00A86B] text-white rounded-lg"
            >
              Next <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Right Preview Section */}
      <div className="bg-gray-50 shadow-lg rounded-2xl p-6 w-1/2">
        {/* Profile */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-cyan-200 flex items-center justify-center overflow-hidden mb-3">
            {form.profilePhoto ? (
              <img
                src={form.profilePhoto}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600">+ Profile</span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            {form.fullName || "Your Name"}
          </h3>
          <p className="text-gray-600 italic">
            {form.designation || "Your Designation"}
          </p>
        </div>

        {/* Summary */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-2">
            Professional Summary
          </h4>
          <p className="text-gray-600">
            {form.summary || "Write your professional summary here..."}
          </p>
        </div>

        {/* Contact Info Preview */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-2">Contact</h4>
          <p className="text-gray-600">{form.address}</p>
          <p className="text-gray-600">{form.email}</p>
          <p className="text-gray-600">{form.phone}</p>
          <p className="text-gray-600">{form.linkedin}</p>
          <p className="text-gray-600">{form.github}</p>
          <p className="text-gray-600">{form.portfolio}</p>
        </div>
      </div>
    </div>
  );
}
