import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaSave, FaPlus, FaTrash, FaDownload, FaUser, FaGraduationCap, FaBriefcase, FaCode, FaProjectDiagram } from "react-icons/fa";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
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
    resumeId: null
  });

  useEffect(() => {
    if (location.state && location.state.resumeData) {
      const data = location.state.resumeData;
      setForm({
        ...data,
        resumeId: data._id
      });
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
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || ""}/api/resume/save`,
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
      
      <div className="max-w-7xl mx-auto px-4 pt-10 flex flex-col lg:flex-row gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:w-[45%] flex flex-col gap-6">
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
                disabled={step === 1}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${step === 1 ? "text-white/30 cursor-not-allowed" : "text-white hover:bg-white/10"
                  }`}
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
        <div className="flex-1 flex flex-col items-center">
          <div className="sticky top-10 w-full max-w-[210mm]">
            <h4 className="text-white/70 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Live Preview
            </h4>
            <div className="bg-slate-300 p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[80vh] custom-scrollbar">
               <div ref={resumeRef} className="bg-white w-full min-h-[297mm] p-12 flex flex-col gap-8 text-black shadow-lg mx-auto" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
                  {/* Preview Header */}
                  <div className="flex justify-between border-b-2 border-slate-800 pb-8">
                    <div className="flex-1">
                      <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 mb-1">{form.personalInfo.fullName || "NAME HERE"}</h1>
                      <p className="text-lg font-bold text-[#0076BC] uppercase tracking-widest leading-none mb-3">{form.personalInfo.designation || "YOUR TITLE"}</p>
                      <p className="text-slate-600 leading-tight pr-10">{form.personalInfo.summary}</p>
                    </div>
                    <div className="flex flex-col text-right gap-1 font-medium text-slate-500 whitespace-nowrap">
                       <p>{form.personalInfo.email}</p>
                       <p>{form.personalInfo.phone}</p>
                       <p>{form.personalInfo.address}</p>
                       {form.personalInfo.linkedin && <p>LinkedIn: {form.personalInfo.linkedin}</p>}
                       {form.personalInfo.github && <p>GitHub: {form.personalInfo.github}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-8">
                    {/* Main Content */}
                    <div className="col-span-8 flex flex-col gap-8">
                       {form.experience.some(e => e.company) && (
                         <section>
                            <h3 className="text-sm font-black border-b border-slate-200 mb-3 pb-1 uppercase text-slate-800 tracking-wider">Experience</h3>
                            {form.experience.map((exp, i) => exp.company && (
                              <div key={i} className="mb-4 last:mb-0">
                                <div className="flex justify-between font-bold text-slate-900 text-sm">
                                  <span>{exp.company}</span>
                                  <span className="text-[10px] text-slate-400 uppercase font-light">{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <div className="text-[#0076BC] font-medium text-xs mb-1 italic">{exp.role}</div>
                                <p className="text-slate-600 leading-relaxed text-[11px]">{exp.description}</p>
                              </div>
                            ))}
                         </section>
                       )}

                       {form.projects.some(p => p.title) && (
                         <section>
                            <h3 className="text-sm font-black border-b border-slate-200 mb-3 pb-1 uppercase text-slate-800 tracking-wider">Major Projects</h3>
                            {form.projects.map((proj, i) => proj.title && (
                              <div key={i} className="mb-4 last:mb-0">
                                <div className="flex justify-between font-bold text-slate-900 text-sm">
                                   <span>{proj.title}</span>
                                   <span className="text-[10px] text-blue-500 italic lowercase font-normal">{proj.link}</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed mt-1 text-[11px]">{proj.description}</p>
                              </div>
                            ))}
                         </section>
                       )}
                    </div>

                    {/* Meta Content */}
                    <div className="col-span-4 flex flex-col gap-8 bg-slate-50/50 p-4 rounded-xl">
                       {form.skills.some(s => s) && (
                         <section>
                            <h3 className="text-xs font-black mb-3 uppercase text-slate-800 tracking-widest border-b border-slate-200 pb-1">Expertise</h3>
                            <div className="flex flex-wrap gap-1">
                              {form.skills.map((skill, i) => skill && (
                                <span key={i} className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded text-[9px] font-bold uppercase">{skill}</span>
                              ))}
                            </div>
                         </section>
                       )}

                       {form.education.some(e => e.school) && (
                         <section>
                            <h3 className="text-xs font-black mb-3 uppercase text-slate-800 tracking-widest border-b border-slate-200 pb-1">Education</h3>
                            {form.education.map((edu, i) => edu.school && (
                              <div key={i} className="mb-3 last:mb-0">
                                 <p className="font-bold text-slate-900 text-[11px]">{edu.school}</p>
                                 <p className="text-[10px] text-[#0076BC] font-medium italic">{edu.degree}</p>
                                 <p className="text-[9px] text-slate-400 mt-0.5 uppercase tracking-tighter">{edu.startDate} - {edu.endDate}</p>
                              </div>
                            ))}
                         </section>
                       )}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
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
