import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();

  const [msg, setMsg] = useState(null);
  const [toast, setToast] = useState(null);
  const [userlogin, setUserlogin] = useState({
    user_email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserlogin({
      ...userlogin,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:6001/api/auth/userlogin",
        userlogin
      );

      if (res.data.sts === 0) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("uname", res.data.user.user_name);

        setToast("✅ Login successful! Redirecting...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setMsg(res.data.msg);
      }

    } catch (error) {
      console.error(error);
      setMsg("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#0076BC] to-[#00A86B] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
          Welcome Back
        </h2>

        <label className="font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="user_email"
          value={userlogin.user_email}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
          placeholder="Enter your email"
          required
        />

        <label className="font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={userlogin.password}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
          placeholder="Enter your password"
          required
        />

        {msg && (
          <div className="text-red-500 text-sm font-medium text-center">
            {msg}
          </div>
        )}

        <button
          type="submit"
          className="bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition duration-200"
        >
          Login
        </button>

        <p className="text-center text-gray-600 text-sm">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-[#0076BC] font-semibold hover:underline"
          >
            Signup here
          </a>
        </p>
      </form>

      {/* ✅ Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
