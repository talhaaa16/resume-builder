import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSave, FaPlus, FaTrash, FaDownload, FaUser, FaGraduationCap, FaBriefcase, FaCode, FaProjectDiagram } from "react-icons/fa";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfessionalTemplate from "../components/templates/ProfessionalTemplate";
import ModernTemplate from "../components/templates/ModernTemplate";
import Creative1Template from "../components/templates/Creative1Template";
import Creative2Template from "../components/templates/Creative2Template";

const MOCK_DATA = {
  personalInfo: {
    fullName: "Alex Carter",
    designation: "Full Stack Developer",
    summary: "Dedicated software engineer with 4+ years of experience building scalable web applications. Passionate about UI/UX and backend performance optimization.",
    email: "alex@example.com",
    phone: "+1 234 567 890",
    address: "New York, USA",
    linkedin: "linkedin.com/in/alexcarter",
    github: "github.com/alexcarter",
    profilePhoto: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
  },
  experience: [
    { company: "Tech Innovations", role: "Software Engineer", startDate: "2021", endDate: "Present", description: "Led frontend development using React and Tailwind. Improved load times by 40%." },
    { company: "Web Solutions Inc.", role: "Web Developer", startDate: "2019", endDate: "2021", description: "Built and maintained multiple client websites using Node.js and MongoDB." }
  ],
  education: [
    { school: "State University", degree: "B.Sc. in Computer Science", startDate: "2015", endDate: "2019", description: "" }
  ],
  skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
  projects: [
    { title: "E-Commerce Dashboard", link: "github.com/alex/dashboard", description: "A comprehensive admin dashboard with real-time data visualization." }
  ],
  template: "professional",
  languages: ["English", "Spanish"]
};

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const resumeRef = useRef();

  const [form, setForm] = useState({
    personalInfo: {
      fullName: "",
      designation: "",
      summary: "",
      profilePhoto: "",
      address: "",
      email: "",
      phone: "",
      linkedin: "",
      github: "",
      portfolio: ""
    },
    education: [{ school: "", degree: "", startDate: "", endDate: "", description: "" }],
    experience: [{ company: "", role: "", startDate: "", endDate: "", description: "" }],
    skills: [""],
    projects: [{ title: "", link: "", description: "" }],
    languages: [""],
    template: "professional",
    themeColor: "#0076BC",
    resumeId: null
  });

  useEffect(() => {
    if (location.state && location.state.resumeData) {
      const data = location.state.resumeData;
      setForm({
        ...data,
        resumeId: data._id
      });
      setStep(1);
    }
  }, [location]);

  const handlePersonalChange = (e) => {
    setForm({
      ...form,
      personalInfo: { ...form.personalInfo, [e.target.name]: e.target.value }
    });
  };

  const handleArrayChange = (index, field, value, section) => {
    const newArray = [...form[section]];
    if (field === null) {
      newArray[index] = value;
    } else {
      newArray[index] = { ...newArray[index], [field]: value };
    }
    setForm({ ...form, [section]: newArray });
  };

  const addArrayItem = (section, defaultObj) => {
    setForm({ ...form, [section]: [...form[section], defaultObj] });
  };

  const removeArrayItem = (index, section) => {
    const newArray = form[section].filter((_, i) => i !== index);
    setForm({ ...form, [section]: newArray });
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm({
          ...form,
          personalInfo: { ...form.personalInfo, profilePhoto: reader.result }
        });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const saveResume = async () => {
    setLoading(true);
    const apiUrl = process.env.REACT_APP_API_URL;
    const finalApiUrl = (apiUrl && apiUrl !== "undefined") ? apiUrl : "";

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${finalApiUrl}/api/resume/save`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.sts === 0) {
        alert("Resume saved successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save resume. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const input = resumeRef.current;
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${form.personalInfo.fullName || "Resume"}.pdf`);
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#0076BC] to-[#00A86B] pb-10">
      <Navbar />
      
      {step === 0 ? (
        <div className="max-w-[1400px] mx-auto px-4 pt-10">
          <h2 className="text-3xl font-black text-white text-center mb-8 uppercase tracking-widest">Select a Template</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto pb-10">
             
             {/* Professional Template Selection Tile */}
             <div 
               onClick={() => { setForm({...form, template: "professional", themeColor: "#0076BC"}); setStep(1); }}
               className="bg-white p-4 rounded-2xl cursor-pointer hover:ring-4 ring-orange-500 transition-all transform hover:-translate-y-2 shadow-2xl flex flex-col group"
             >
                <div className="h-[320px] bg-slate-50 rounded-xl mb-4 overflow-hidden border border-slate-200 flex justify-center relative pointer-events-none">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 scale-[0.28] origin-top transition-transform duration-300 group-hover:scale-[0.30] shadow-xl">
                    <div className="w-[210mm] bg-white ring-1 ring-slate-200">
                      <ProfessionalTemplate form={{...MOCK_DATA, themeColor: "#0076BC"}} resumeRef={null} />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-slate-800">Professional</h3>
                <p className="text-xs text-center text-slate-500 mt-1">Clean, corporate standard</p>
             </div>

             {/* Modern Template Selection Tile */}
             <div 
               onClick={() => { setForm({...form, template: "modern", themeColor: "#10B981"}); setStep(1); }}
               className="bg-white p-4 rounded-2xl cursor-pointer hover:ring-4 ring-orange-500 transition-all transform hover:-translate-y-2 shadow-2xl flex flex-col group"
             >
                <div className="h-[320px] bg-slate-50 rounded-xl mb-4 overflow-hidden border border-slate-200 flex justify-center relative pointer-events-none">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 scale-[0.28] origin-top transition-transform duration-300 group-hover:scale-[0.30] shadow-xl">
                     <div className="w-[210mm] bg-white ring-1 ring-slate-200">
                       <ModernTemplate form={{...MOCK_DATA, themeColor: "#10B981"}} resumeRef={null} />
                     </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-slate-800">Modern</h3>
                <p className="text-xs text-center text-slate-500 mt-1">Stylish two-column dark sidebar</p>
             </div>

             {/* Creative 1 Template Selection Tile */}
             <div 
               onClick={() => { setForm({...form, template: "creative1", themeColor: "#FFB000"}); setStep(1); }}
               className="bg-white p-4 rounded-2xl cursor-pointer hover:ring-4 ring-orange-500 transition-all transform hover:-translate-y-2 shadow-2xl flex flex-col group"
             >
                <div className="h-[320px] bg-slate-50 rounded-xl mb-4 overflow-hidden border border-slate-200 flex justify-center relative pointer-events-none">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 scale-[0.28] origin-top transition-transform duration-300 group-hover:scale-[0.30] shadow-xl">
                     <div className="w-[210mm] bg-white ring-1 ring-slate-200">
                       <Creative1Template form={{...MOCK_DATA, themeColor: "#FFB000"}} resumeRef={null} />
                     </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-slate-800">Creative Top</h3>
                <p className="text-xs text-center text-slate-500 mt-1">Bold header with centered avatar</p>
             </div>

             {/* Creative 2 Template Selection Tile */}
             <div 
               onClick={() => { setForm({...form, template: "creative2", themeColor: "#F59E0B"}); setStep(1); }}
               className="bg-white p-4 rounded-2xl cursor-pointer hover:ring-4 ring-orange-500 transition-all transform hover:-translate-y-2 shadow-2xl flex flex-col group"
             >
                <div className="h-[320px] bg-slate-50 rounded-xl mb-4 overflow-hidden border border-slate-200 flex justify-center relative pointer-events-none">
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 scale-[0.28] origin-top transition-transform duration-300 group-hover:scale-[0.30] shadow-xl">
                     <div className="w-[210mm] bg-white ring-1 ring-slate-200">
                       <Creative2Template form={{...MOCK_DATA, themeColor: "#F59E0B"}} resumeRef={null} />
                     </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-slate-800">Creative Split</h3>
                <p className="text-xs text-center text-slate-500 mt-1">Bold sidebars with progress bars</p>
             </div>

          </div>
        </div>
      ) : (
      <div className="w-full px-4 lg:px-8 xl:px-12 pt-8 pb-20 flex flex-col xl:flex-row gap-10 items-start">
        {/* Left Column: Form Controls */}
        <div className="w-full xl:w-[40%] flex flex-col gap-6">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="bg-orange-500 w-8 h-8 rounded-full flex items-center justify-center text-sm">{step}</span>
                {step === 1 && "Personal Info"}
                {step === 2 && "Education"}
                {step === 3 && "Work Experience"}
                {step === 4 && "Skills"}
                {step === 5 && "Projects"}
                {step === 6 && "Ready to Download!"}
              </h2>
              <div className="flex gap-2">
                 <button onClick={saveResume} disabled={loading} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition">
                   <FaSave className="w-5 h-5" />
                 </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-inner min-h-[400px]">
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 relative group">
                      {form.personalInfo.profilePhoto ? (
                        <img src={form.personalInfo.profilePhoto} className="w-full h-full object-cover" />
                      ) : (
                        <FaUser className="text-slate-300 text-2xl" />
                      )}
                      <input type="file" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" title="Upload Photo" />
                    </div>
                    <div className="text-xs text-slate-500 italic">Click to upload photo</div>
                  </div>
                  <Input label="Full Name" name="fullName" value={form.personalInfo.fullName} onChange={handlePersonalChange} />
                  <Input label="Designation" name="designation" value={form.personalInfo.designation} onChange={handlePersonalChange} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Email" name="email" value={form.personalInfo.email} onChange={handlePersonalChange} />
                    <Input label="Phone" name="phone" value={form.personalInfo.phone} onChange={handlePersonalChange} />
                  </div>
                  <Input label="Address" name="address" value={form.personalInfo.address} onChange={handlePersonalChange} />
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Summary</label>
                    <textarea
                      name="summary"
                      value={form.personalInfo.summary}
                      onChange={handlePersonalChange}
                      className="w-full p-3 bg-slate-50 border-b-2 border-transparent focus:border-[#0076BC] outline-none rounded-t-lg h-24"
                      placeholder="Your professional mission..."
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Educational History</h3>
                    <button onClick={() => addArrayItem("education", { school: "", degree: "", startDate: "", endDate: "" })} className="bg-[#00A86B] text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                      <FaPlus /> Add
                    </button>
                  </div>
                  {form.education.map((edu, index) => (
                    <div key={index} className="p-4 border border-slate-100 rounded-lg bg-slate-50 relative">
                       <button onClick={() => removeArrayItem(index, "education")} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><FaTrash /></button>
                       <Input label="School/Univ" value={edu.school} onChange={(e) => handleArrayChange(index, "school", e.target.value, "education")} />
                       <Input label="Degree" value={edu.degree} onChange={(e) => handleArrayChange(index, "degree", e.target.value, "education")} />
                    </div>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Work Experience</h3>
                    <button onClick={() => addArrayItem("experience", { company: "", role: "", startDate: "", endDate: "", description: "" })} className="bg-[#00A86B] text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                      <FaPlus /> Add
                    </button>
                  </div>
                  {form.experience.map((exp, index) => (
                    <div key={index} className="p-4 border border-slate-100 rounded-lg bg-slate-50 relative">
                       <button onClick={() => removeArrayItem(index, "experience")} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><FaTrash /></button>
                       <Input label="Company" value={exp.company} onChange={(e) => handleArrayChange(index, "company", e.target.value, "experience")} />
                       <Input label="Role" value={exp.role} onChange={(e) => handleArrayChange(index, "role", e.target.value, "experience")} />
                       <div className="grid grid-cols-2 gap-2 mt-2">
                         <Input label="Start" value={exp.startDate} onChange={(e) => handleArrayChange(index, "startDate", e.target.value, "experience")} />
                         <Input label="End" value={exp.endDate} onChange={(e) => handleArrayChange(index, "endDate", e.target.value, "experience")} />
                       </div>
                    </div>
                  ))}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4 animate-fadeIn">
                   <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Core Skills</h3>
                    <button onClick={() => addArrayItem("skills", "")} className="bg-[#00A86B] text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                      <FaPlus /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map((skill, index) => (
                      <div key={index} className="flex items-center bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        <input value={skill} onChange={(e) => handleArrayChange(index, null, e.target.value, "skills")} className="bg-transparent outline-none text-sm w-24" />
                        <button onClick={() => removeArrayItem(index, "skills")} className="text-red-400 ml-1"><FaTrash className="w-3 h-3"/></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-6 animate-fadeIn">
                   <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">Key Projects</h3>
                    <button onClick={() => addArrayItem("projects", { title: "", link: "", description: "" })} className="bg-[#00A86B] text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                      <FaPlus /> Add
                    </button>
                  </div>
                  {form.projects.map((proj, index) => (
                    <div key={index} className="p-4 border border-slate-100 rounded-lg bg-slate-50 relative">
                       <button onClick={() => removeArrayItem(index, "projects")} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><FaTrash /></button>
                       <Input label="Title" value={proj.title} onChange={(e) => handleArrayChange(index, "title", e.target.value, "projects")} />
                       <Input label="Link" value={proj.link} onChange={(e) => handleArrayChange(index, "link", e.target.value, "projects")} />
                    </div>
                  ))}
                </div>
              )}

              {step === 6 && (
                <div className="text-center py-20 animate-fadeIn">
                   <FaDownload className="w-16 h-16 text-[#00A86B] mx-auto mb-6 opacity-30" />
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Almost Done!</h3>
                   <p className="text-slate-500 mb-8">Click below to export your resume or save it for later.</p>
                   <div className="flex flex-col gap-4 max-w-xs mx-auto">
                     <button onClick={downloadPDF} className="bg-[#00A86B] hover:bg-[#008f5d] text-white py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2">
                       <FaDownload /> Download PDF
                     </button>
                     <button onClick={saveResume} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg transition flex items-center justify-center gap-2">
                       <FaSave /> {loading ? "Saving..." : "Save Online"}
                     </button>
                   </div>
                </div>
              )}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition text-white hover:bg-white/10"
              >
                <FaArrowLeft /> Back
              </button>
              {step < 6 && (
                <button
                  onClick={nextStep}
                  className="bg-orange-500 text-white px-8 py-2 rounded-lg font-bold hover:bg-orange-600 flex items-center gap-2 shadow-lg transition"
                >
                  Next <FaArrowRight />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Preview */}
        <div className="w-full xl:w-[60%] sticky top-6 h-[calc(100vh-3rem)] flex flex-col hide-scrollbar-on-print">
          
          <div className="w-full flex justify-between items-center mb-4 bg-slate-900/60 backdrop-blur-md p-3 px-6 rounded-2xl shadow-xl border border-white/20 z-10">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
              Live Preview
            </h4>
            {/* Theme Color Picker */}
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg border border-white/10">
               <label className="text-white text-xs font-bold uppercase tracking-wider">Theme Color</label>
               <input 
                  type="color" 
                  value={form.themeColor || "#0076BC"} 
                  onChange={(e) => setForm({...form, themeColor: e.target.value})} 
                  className="w-8 h-6 p-0 border-0 rounded cursor-pointer shrink-0" 
                  title="Choose template theme color"
               />
            </div>
          </div>

          <div className="w-full flex-1 overflow-auto custom-scrollbar rounded-2xl bg-[#0F172A] shadow-inner border border-slate-700 flex justify-center items-start pt-8 pb-16">
             <div className="shrink-0 transition-transform transform origin-top w-[210mm] shadow-2xl" style={{ zoom: "0.8" }}>
                  {form.template === 'modern' && <ModernTemplate form={form} resumeRef={resumeRef} />}
                  {form.template === 'professional' && <ProfessionalTemplate form={form} resumeRef={resumeRef} />}
                  {form.template === 'creative1' && <Creative1Template form={form} resumeRef={resumeRef} />}
                  {form.template === 'creative2' && <Creative2Template form={form} resumeRef={resumeRef} />}
             </div>
          </div>
        </div>
      </div>
      )}
      <Footer />
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1 w-full mt-3 first:mt-0">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <input
        {...props}
        className="w-full p-2 bg-slate-50 border-b-2 border-transparent focus:border-[#0076BC] focus:bg-white outline-none transition-all rounded-t-lg text-sm"
      />
    </div>
  );
}
