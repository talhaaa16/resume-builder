import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Regi = () => {
  const navigate = useNavigate();
  const [userregi, setUserRegi] = useState({
    user_name: "",
    user_email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserRegi({
      ...userregi,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:6001/api/auth/adduser",
        userregi
      );
      console.log(res);
      console.log("Register success");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#0076BC] to-[#00A86B] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-4">
          Create Your Account
        </h2>

        <label className="font-medium text-gray-700">Username</label>
        <input
          type="text"
          name="user_name"
          value={userregi.user_name}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
          placeholder="Enter your username"
          required
        />

        <label className="font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="user_email"
          value={userregi.user_email}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
          placeholder="Enter your email"
          required
        />

        <label className="font-medium text-gray-700">Password</label>
        <input
          type="password"
          name="password"
          value={userregi.password}
          onChange={handleInputChange}
          className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
          placeholder="Enter your password"
          required
        />

        <button
          type="submit"
          className="bg-orange-500 text-white py-3 rounded-md font-semibold hover:bg-orange-600 transition duration-200"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#0076BC] font-semibold hover:underline"
          >
            Login here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Regi;
