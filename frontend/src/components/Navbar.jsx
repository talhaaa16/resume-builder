import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, FileText, LogOut, X, Trash2, ExternalLink, Key, Image, BriefcaseBusiness, Sparkles } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [useremail, setUseremail] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showResumesModal, setShowResumesModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [passwordMsg, setPasswordMsg] = useState("");
  const [resumes, setResumes] = useState([]);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const uname = localStorage.getItem("uname");
    const uemail = localStorage.getItem("uemail");
    const upic = localStorage.getItem("uprofilepic");
    if (uname) {
      setUsername(uname);
      setUseremail(uemail);
      if (upic) setProfilePic(upic);
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("uname");
    localStorage.removeItem("uemail");
    localStorage.removeItem("uprofilepic");
    setUsername(null);
    setUseremail(null);
    setProfilePic("");
    setShowDropdown(false);
    navigate("/"); 
  };

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.REACT_APP_API_URL || ""}/api/resume/my-resumes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.sts === 0) {
        setResumes(res.data.resumes);
      }
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.REACT_APP_API_URL || ""}/api/resume/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchResumes(); // Refresh after deletion
    } catch (error) {
      alert("Failed to delete resume");
    }
  };

  const openResumesModal = () => {
    setShowDropdown(false);
    setShowResumesModal(true);
    fetchResumes();
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${process.env.REACT_APP_API_URL || ""}/api/auth/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.sts === 0) {
        alert("Password changed successfully!");
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: "", newPassword: "" });
        setPasswordMsg("");
      } else {
        setPasswordMsg(res.data.msg);
      }
    } catch (err) {
      setPasswordMsg("Error updating password.");
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
       alert("File size must be less than 2MB");
       return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
       const base64String = reader.result;
       try {
          const token = localStorage.getItem("token");
          const res = await axios.post(`${process.env.REACT_APP_API_URL || ""}/api/auth/update-profile-pic`, { profile_pic: base64String }, {
             headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.sts === 0) {
             setProfilePic(base64String);
             localStorage.setItem("uprofilepic", base64String);
             alert("Profile picture updated!");
             setShowDropdown(false);
          } else {
             alert(res.data.msg);
          }
       } catch (err) {
          alert("Failed to update profile picture.");
       }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <nav className="bg-white shadow-sm relative z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer transition hover:opacity-80" onClick={() => navigate("/")}>
            <div className="bg-gradient-to-tr from-blue-600 to-green-400 p-1.5 rounded-lg text-white shadow-md">
              <BriefcaseBusiness className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-[#00A86B]">YuvaNaukri</span>
          </div>

          <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
            <a href="/" className="relative group transition-colors duration-300 hover:text-blue-600">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/resume-builder" className="relative group transition-colors duration-300 hover:text-blue-600">
              Resume Builder
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/jobs" className="relative group transition-colors duration-300 hover:text-blue-600">
              Jobs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/carrier" className="relative group transition-colors duration-300 hover:text-blue-600">
              Career Guidance
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
            {username ? (
              <>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center justify-center rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 transition shadow-sm w-10 h-10 bg-slate-100"
                >
                  <img src={profilePic || `https://api.dicebear.com/7.x/notionists/svg?seed=${username || 'dev'}`} alt="profile" className="w-10 h-10 object-cover" />
                </button>

                {/* Profile Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 top-12 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 transform origin-top-right transition-all">
                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 rounded-t-xl mb-1">
                      <p className="text-sm font-bold text-gray-800">{username}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{useremail || 'user@example.com'}</p>
                    </div>
                    
                    <button
                      onClick={openResumesModal}
                      className="w-full text-left px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center transition"
                    >
                      <FileText className="w-4 h-4 mr-3" />
                      My Resumes
                    </button>

                    <button
                      onClick={() => { setShowDropdown(false); setShowPasswordModal(true); }}
                      className="w-full text-left px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center transition"
                    >
                      <Key className="w-4 h-4 mr-3" />
                      Change Password
                    </button>

                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="w-full text-left px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center transition"
                    >
                      <Image className="w-4 h-4 mr-3" />
                      Update Profile Pic
                    </button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handleProfileImageUpload} 
                      className="hidden" 
                    />
                    
                    <div className="h-px bg-gray-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center transition"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <a href="/login">
                  <button className="text-gray-700 hover:text-blue-600 font-medium">
                    Login
                  </button>
                </a>
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Resumes Modal */}
      {showResumesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#0076BC]" />
                Your Saved Resumes
              </h2>
              <button 
                onClick={() => setShowResumesModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-gray-50/50 flex-1">
              {resumes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">You haven't created any resumes yet.</p>
                  <button 
                    onClick={() => {
                      setShowResumesModal(false);
                      navigate("/resume-builder");
                    }} 
                    className="bg-[#0076BC] text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 hover:bg-blue-700 transition"
                  >
                    Create New Resume
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resumes.map((resume) => (
                    <div key={resume._id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-[#0076BC]">
                          <FileText className="w-6 h-6" />
                        </div>
                        <button 
                          onClick={() => deleteResume(resume._id)} 
                          className="text-gray-300 hover:text-red-500 transition"
                          title="Delete Resume"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg line-clamp-1 mb-1">
                        {resume.personalInfo?.fullName || "Untitled Resume"}
                      </h3>
                      <p className="text-sm text-gray-500 mb-5 line-clamp-1">
                        {resume.personalInfo?.designation || "No designation"}
                      </p>
                      <button 
                        onClick={() => {
                          setShowResumesModal(false);
                          navigate("/resume-builder", { state: { resumeData: resume } });
                        }}
                        className="w-full bg-gray-50 hover:bg-[#0076BC] hover:text-white text-gray-700 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors border border-gray-100"
                      >
                        Edit Resume <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Create New Card */}
                  <div 
                    onClick={() => {
                      setShowResumesModal(false);
                      navigate("/resume-builder");
                    }}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-[#0076BC] hover:border-[#0076BC] hover:bg-blue-50/50 transition cursor-pointer min-h-[200px]"
                  >
                    <div className="bg-gray-100 p-3 rounded-full mb-3 group-hover:bg-blue-100 transition">
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className="font-semibold">Create New</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
            <button onClick={() => setShowPasswordModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
              <X className="w-5 h-5"/>
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
            </div>
            
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
               {passwordMsg && <p className="text-red-500 text-sm font-medium text-center bg-red-50 rounded p-2">{passwordMsg}</p>}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                 <input type="password" required value={passwordData.currentPassword} onChange={e => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900" />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                 <input type="password" required value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900" />
               </div>
               <button type="submit" className="w-full bg-[#0076BC] text-white py-3 rounded-lg font-semibold mt-2 hover:bg-blue-700 transition">
                 Update Password
               </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
