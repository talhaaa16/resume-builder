import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, FileText, LogOut, X, Trash2, ExternalLink, Key, Image, BriefcaseBusiness, Sparkles, Menu, Settings, Camera, Check, Edit2, ChevronDown, ChevronUp, Share2, Copy, LayoutDashboard } from "lucide-react";
import axios from "axios";
import { useToast } from "../context/ToastContext";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [useremail, setUseremail] = useState(null);
  const [profilePic, setProfilePic] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showResumesModal, setShowResumesModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [shareState, setShareState] = useState({ resumeId: null, loading: false, link: "", copied: false });
  
  // Account Sidebar state
  const [showAccountSidebar, setShowAccountSidebar] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [isPasswordCollapsed, setIsPasswordCollapsed] = useState(true);

  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });
  const [passwordMsg, setPasswordMsg] = useState("");
  const [resumes, setResumes] = useState([]);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    confirmText: "OK",
    confirmColor: "bg-red-500 hover:bg-red-600"
  });
  const { showToast } = useToast();
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
    setConfirmModal({
      isOpen: true,
      title: "Are you sure?",
      message: "You are about to logout from your account. You will need to login again to access your resumes.",
      confirmText: "Logout",
      confirmColor: "bg-red-500 hover:bg-red-600",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            await axios.post(`${process.env.REACT_APP_API_URL || ""}/api/auth/logout`, { token });
          }
        } catch (error) {
          console.error("Logout error:", error);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("uname");
        localStorage.removeItem("uemail");
        localStorage.removeItem("uprofilepic");
        setUsername(null);
        setUseremail(null);
        setProfilePic("");
        setShowDropdown(false);
        navigate("/");
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
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

  const deleteResume = async (resumeId) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Resume?",
      message: "This action cannot be undone. Your resume data will be permanently deleted.",
      confirmText: "Delete",
      confirmColor: "bg-red-500 hover:bg-red-600",
      onConfirm: async () => {
        try {
          const token = localStorage.getItem("token");
          await axios.delete(`${process.env.REACT_APP_API_URL || ""}/api/resume/${resumeId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setResumes(resumes.filter((r) => r._id !== resumeId));
          showToast("Resume deleted.");
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          showToast("Failed to delete resume.", "error");
        }
      },
    });
  };

  const handleShareResume = async (resumeId) => {
    setShareState({ resumeId, loading: true, link: "", copied: false });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || ""}/api/resume/share/${resumeId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.sts === 0 && res.data.shared) {
        const link = `${window.location.origin}/r/${res.data.shareId}`;
        setShareState({ resumeId, loading: false, link, copied: false });
      } else if (res.data.sts === 0 && !res.data.shared) {
        setShareState({ resumeId: null, loading: false, link: "", copied: false });
        showToast("Sharing disabled. Resume is now private.", "info");
      } else {
        setShareState({ resumeId: null, loading: false, link: "", copied: false });
        showToast("Failed to generate link.", "error");
      }
    } catch {
      setShareState({ resumeId: null, loading: false, link: "", copied: false });
      showToast("Error sharing resume.", "error");
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(shareState.link);
    setShareState(prev => ({ ...prev, copied: true }));
    setTimeout(() => setShareState(prev => ({ ...prev, copied: false })), 2000);
  };

  const openResumesModal = () => {
    setShowDropdown(false);
    setShowResumesModal(true);
    fetchResumes();
  };

  const openAccountSidebar = () => {
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    setEditUsername(username || "");
    setEditEmail(useremail || "");
    setIsEditingUsername(false);
    setIsEditingEmail(false);
    setPasswordData({ currentPassword: "", newPassword: "" });
    setPasswordMsg("");
    setIsPasswordCollapsed(true);
    setShowAccountSidebar(true);
  };

  const handleProfileUpdate = async (field) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {};
      
      if (field === "username") {
        if (!editUsername.trim()) {
          showToast("Username cannot be empty", "error");
          return;
        }
        payload.user_name = editUsername.trim();
      } else if (field === "email") {
        if (!editEmail.trim()) {
          showToast("Email address cannot be empty", "error");
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(editEmail.trim())) {
          showToast("Please enter a valid email address", "error");
          return;
        }
        payload.user_email = editEmail.trim();
      }

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || ""}/api/auth/update-profile`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.sts === 0) {
        showToast(res.data.msg || "Profile updated successfully!");
        if (field === "username") {
          setUsername(res.data.user.user_name);
          localStorage.setItem("uname", res.data.user.user_name);
          setIsEditingUsername(false);
        } else if (field === "email") {
          setUseremail(res.data.user.user_email);
          localStorage.setItem("uemail", res.data.user.user_email);
          setIsEditingEmail(false);
        }
      } else {
        showToast(res.data.msg || "Failed to update profile", "error");
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.msg || "Error updating profile. Please try again.", "error");
    }
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

    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file (JPG, PNG).", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Maximum file size is 5MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

        try {
          const token = localStorage.getItem("token");
          const res = await axios.post(`${process.env.REACT_APP_API_URL || ""}/api/auth/update-profile-pic`, { profile_pic: compressedBase64 }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data.sts === 0) {
            setProfilePic(compressedBase64);
            localStorage.setItem("uprofilepic", compressedBase64);
            showToast("Profile picture updated!");
            setShowDropdown(false);
          } else {
            showToast(res.data.msg, "error");
          }
        } catch (err) {
          showToast("Failed to update profile picture.", "error");
        }
      };
      img.src = event.target.result;
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
            <a href="/ats-checker" className="relative group transition-colors duration-300 hover:text-blue-600 flex items-center gap-1">
              ATS Checker
              <span className="bg-gradient-to-r from-blue-500 to-green-400 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider mb-3">New</span>
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
            <a href="/about" className="relative group transition-colors duration-300 hover:text-blue-600">
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4 relative" ref={dropdownRef}>
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
                      onClick={() => { setShowDropdown(false); navigate("/dashboard"); }}
                      className="w-full text-left px-5 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-[#0076BC] flex items-center transition"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-3 text-[#0076BC]" />
                      My Dashboard
                    </button>

                    <button
                      onClick={openResumesModal}
                      className="w-full text-left px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center transition"
                    >
                      <FileText className="w-4 h-4 mr-3 text-gray-500" />
                      My Resumes
                    </button>

                    <button
                      onClick={openAccountSidebar}
                      className="w-full text-left px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 flex items-center transition"
                    >
                      <Settings className="w-4 h-4 mr-3 text-gray-500" />
                      My Account
                    </button>

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

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none transition"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-50 flex flex-col py-4 px-6 space-y-4">
            <a href="/" className="text-gray-700 font-semibold hover:text-blue-600 transition">Home</a>
            <a href="/resume-builder" className="text-gray-700 font-semibold hover:text-blue-600 transition">Resume Builder</a>
            <a href="/ats-checker" className="text-gray-700 font-semibold hover:text-blue-600 transition flex items-center gap-2">ATS Checker <span className="bg-gradient-to-r from-blue-500 to-green-400 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">New</span></a>
            <a href="/jobs" className="text-gray-700 font-semibold hover:text-blue-600 transition">Jobs</a>
            <a href="/carrier" className="text-gray-700 font-semibold hover:text-blue-600 transition">Career Guidance</a>
            <a href="/about" className="text-gray-700 font-semibold hover:text-blue-600 transition">About Us</a>
            
            <div className="h-px bg-gray-200 my-2"></div>
            
            {username ? (
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-3 mb-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <img src={profilePic || `https://api.dicebear.com/7.x/notionists/svg?seed=${username || 'dev'}`} alt="profile" className="w-12 h-12 object-cover rounded-full bg-slate-200" />
                  <div>
                    <p className="text-base font-bold text-gray-800">{username}</p>
                    <p className="text-sm text-gray-500">{useremail || 'user@example.com'}</p>
                  </div>
                </div>
                <button onClick={() => { setIsMobileMenuOpen(false); navigate("/dashboard"); }} className="text-left text-sm font-medium text-[#0076BC] flex items-center py-2"><LayoutDashboard className="w-5 h-5 mr-3 text-[#0076BC]" />My Dashboard</button>
                <button onClick={() => { setIsMobileMenuOpen(false); openResumesModal(); }} className="text-left text-sm font-medium text-gray-700 flex items-center py-2"><FileText className="w-5 h-5 mr-3 text-blue-600" />My Resumes</button>
                <button onClick={() => { setIsMobileMenuOpen(false); openAccountSidebar(); }} className="text-left text-sm font-medium text-gray-700 flex items-center py-2"><Settings className="w-5 h-5 mr-3 text-gray-600" />My Account</button>
                <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="text-left text-sm font-medium text-red-600 flex items-center py-2"><LogOut className="w-5 h-5 mr-3 text-red-500" />Logout</button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <button onClick={() => { setIsMobileMenuOpen(false); navigate("/login"); }} className="w-full text-center text-gray-700 hover:text-blue-600 font-semibold py-3 border border-gray-200 rounded-xl transition">
                  Login
                </button>
                <button onClick={() => { setIsMobileMenuOpen(false); navigate("/signup"); }} className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-3 rounded-xl shadow-md hover:opacity-90 transition">
                  Get Started
                </button>
              </div>
            )}
          </div>
        )}
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
                      <p className="text-sm text-gray-500 mb-4 line-clamp-1">
                        {resume.personalInfo?.designation || "No designation"}
                      </p>

                      {/* Share link panel — shows inline when this resume's link is ready */}
                      {shareState.resumeId === resume._id && shareState.link && (
                        <div className="mb-3 bg-slate-50 border border-slate-200 rounded-lg p-2.5 flex items-center gap-2">
                          <span className="flex-1 text-xs text-slate-600 truncate font-mono">{shareState.link}</span>
                          <button
                            onClick={handleCopyShareLink}
                            className={`shrink-0 flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md transition ${
                              shareState.copied ? "bg-emerald-500 text-white" : "bg-[#0076BC] text-white hover:opacity-90"
                            }`}
                          >
                            {shareState.copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy</>}
                          </button>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setShowResumesModal(false);
                            navigate("/resume-builder", { state: { resumeData: resume } });
                          }}
                          className="flex-1 bg-gray-50 hover:bg-[#0076BC] hover:text-white text-gray-700 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors border border-gray-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleShareResume(resume._id)}
                          disabled={shareState.loading && shareState.resumeId === resume._id}
                          title={resume.isPublic ? "Disable sharing" : "Share this resume"}
                          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-semibold border transition ${
                            resume.isPublic
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-[#0076BC] hover:border-blue-200"
                          }`}
                        >
                          {shareState.loading && shareState.resumeId === resume._id
                            ? <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            : <Share2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
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
      {/* Account Sidebar */}
      {showAccountSidebar && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAccountSidebar(false)}
          />

          {/* Sidebar Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col h-full border-l border-gray-200 animate-slideIn">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2.5">
                <Settings className="w-5.5 h-5.5 text-blue-600" />
                Account Settings
              </h2>
              <button
                onClick={() => setShowAccountSidebar(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {/* Profile Image Section */}
              <div className="text-center pb-6 border-b border-gray-100 flex flex-col items-center">
                <div className="relative w-28 h-28 mb-3.5 group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                  <img
                    src={profilePic || `https://api.dicebear.com/7.x/notionists/svg?seed=${username || 'dev'}`}
                    alt="Profile"
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-gray-100 group-hover:opacity-90 transition"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleProfileImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                >
                  Change Profile Photo
                </button>
              </div>

              {/* Username Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
                {isEditingUsername ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 font-semibold"
                    />
                    <button
                      onClick={() => handleProfileUpdate("username")}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shrink-0"
                      title="Save Username"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingUsername(false);
                        setEditUsername(username || "");
                      }}
                      className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition shrink-0"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl">
                    <span className="font-semibold text-gray-700 truncate mr-2">{username || "Not set"}</span>
                    <button
                      onClick={() => setIsEditingUsername(true)}
                      className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-white transition shrink-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Email Address Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                {isEditingEmail ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 font-semibold"
                    />
                    <button
                      onClick={() => handleProfileUpdate("email")}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shrink-0"
                      title="Save Email"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingEmail(false);
                        setEditEmail(useremail || "");
                      }}
                      className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition shrink-0"
                      title="Cancel"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl">
                    <span className="font-semibold text-gray-700 truncate mr-2">{useremail || "Not set"}</span>
                    <button
                      onClick={() => setIsEditingEmail(true)}
                      className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-white transition shrink-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Security / Password Accordion */}
              <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setIsPasswordCollapsed(!isPasswordCollapsed)}
                  className="w-full flex justify-between items-center px-4 py-3.5 bg-gray-50 hover:bg-gray-100/70 transition text-gray-700 font-semibold text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-gray-500" />
                    Change Password
                  </span>
                  {isPasswordCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {!isPasswordCollapsed && (
                  <form onSubmit={handlePasswordChange} className="p-4 border-t border-gray-200 bg-white flex flex-col gap-4">
                    {passwordMsg && (
                      <p className="text-red-500 text-xs font-semibold text-center bg-red-50 rounded-lg py-2 px-3 border border-red-100">
                        {passwordMsg}
                      </p>
                    )}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Current Password</label>
                      <input
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 font-semibold"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition"
                    >
                      Update Password
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Footer / Logout in Sidebar */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button
                onClick={() => {
                  setShowAccountSidebar(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-bold text-sm border border-red-100 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center transform transition-all scale-100">
            
            {/* Warning Icon */}
            <div className="mx-auto w-[72px] h-[72px] border-4 border-[#F8BB86] rounded-full flex items-center justify-center mb-6">
              <span className="text-[#F8BB86] text-5xl font-light leading-none -mt-1">!</span>
            </div>

            <h2 className="text-[26px] font-semibold text-gray-700 mb-3">{confirmModal.title}</h2>
            <p className="text-gray-500 mb-8 text-[15px] leading-relaxed px-2">
              {confirmModal.message}
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                className="px-5 py-2.5 bg-[#efefef] hover:bg-[#e2e2e2] rounded text-gray-700 font-semibold transition min-w-[100px]"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className={`px-5 py-2.5 rounded text-white font-semibold transition min-w-[100px] shadow-md ${confirmModal.confirmColor}`}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
