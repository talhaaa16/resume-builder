import React from "react";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const CareerGuidance = () => {
  const careers = [
    {
      icon: "https://img.icons8.com/ios-filled/50/ffffff/combo-chart.png",
      title: "Technology",
      roles: "Software Developer, Data Analyst",
      growth: "23% growth",
    },
    {
      icon: "https://img.icons8.com/ios-filled/50/ffffff/chat.png",
      title: "Digital Marketing",
      roles: "Social Media, Content Creator",
      growth: "18% growth",
    },
    {
      icon: "https://img.icons8.com/ios-filled/50/ffffff/stethoscope.png",
      title: "Healthcare",
      roles: "Nurse, Medical Assistant",
      growth: "15% growth",
    },
    {
      icon: "https://img.icons8.com/ios-filled/50/ffffff/factory.png",
      title: "Manufacturing",
      roles: "Quality Control, Operations",
      growth: "12% growth",
    },
  ];

  return (
    <div>
        <Navbar/>
    <div className="min-h-screen bg-white px-6 py-16">
      {/* Top Hero Section */}
      <div className="flex flex-col items-center justify-center mb-20">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-md"
        >
          <img
            src="https://img.icons8.com/ios-filled/50/ffffff/compass.png"
            alt="Career Icon"
            className="w-8 h-8"
          />
        </motion.div>

        {/* Heading */}
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
          Career Guidance
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-center max-w-2xl mb-8">
          Navigate your career journey with expert guidance, resources, and
          mentorship designed specifically for India's youth.
        </p>

        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition"
        >
          Start Your Journey
        </motion.a>
      </div>

      <section id="career-paths" className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
          Popular Career Paths
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Explore high-demand career opportunities in India
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {careers.map((career, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white border rounded-2xl shadow-md p-6 text-center transition"
            >
              <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <img src={career.icon} alt={career.title} className="w-7 h-7" />
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {career.title}
              </h3>

              <p className="text-sm text-gray-500 mb-2">{career.roles}</p>

              <p className="text-green-600 font-medium mb-4">{career.growth}</p>

              <a
                href="#"
                className="text-blue-600 font-medium hover:underline"
              >
                Learn More
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
        <Footer/>
    </div>
  );
};

export default CareerGuidance;
