import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Creative1Template({ form, resumeRef }) {
  const themeColor = form.themeColor || "#FFB000"; // Default Yellow
  
  return (
    <div ref={resumeRef} className="bg-white w-[210mm] min-h-[297mm] text-black shadow-lg mx-auto overflow-hidden relative" style={{ fontFamily: "'Montserrat', 'Inter', sans-serif", fontSize: "12px" }}>
      
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 w-full h-24 bg-slate-50 z-0"></div>

      {/* Header */}
      <div className="pt-12 px-16 relative flex gap-8 mb-6 z-10 items-center">
        {/* Photo */}
        <div className="w-48 h-48 rounded-full overflow-hidden shrink-0 border-8 border-white shadow-xl bg-slate-200">
          {form.personalInfo.profilePhoto ? (
            <img src={form.personalInfo.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-slate-400 font-bold uppercase">
              {form.personalInfo.fullName ? form.personalInfo.fullName.charAt(0) : "?"}
            </div>
          )}
        </div>
        
        {/* Name & Title */}
        <div className="flex-1 pt-4">
          <h1 className="text-5xl font-black text-slate-900 mb-4">{form.personalInfo.fullName || "FRANK HUGH"}</h1>
          <div className="inline-block px-4 py-2 font-bold tracking-widest text-sm uppercase text-slate-900" style={{ backgroundColor: themeColor }}>
            {form.personalInfo.designation || "MARKETING COACH"}
          </div>
          <div className="flex gap-3 mt-5 text-lg">
             {form.personalInfo.linkedin && (
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
                   <FaLinkedin className="w-4 h-4"/>
                </div>
             )}
             {form.personalInfo.github && (
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md">
                   <FaGithub className="w-4 h-4"/>
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Contact Line */}
      <div className="px-16 text-center text-slate-400 text-sm mb-2 pb-2">
        <span className="font-medium">
          {[form.personalInfo.portfolio, form.personalInfo.email, form.personalInfo.phone, form.personalInfo.address].filter(Boolean).join("  |  ")}
        </span>
      </div>
      <div className="w-full h-3" style={{ backgroundColor: themeColor }}></div>

      {/* Main Grid */}
      <div className="px-16 py-10 grid grid-cols-2 gap-16">
        {/* Left Column */}
        <div className="flex flex-col gap-10">
           {form.personalInfo.summary && (
             <section>
               <h2 className="text-2xl font-black mb-4 text-slate-900">About Me</h2>
               <p className="text-slate-600 leading-relaxed text-[13px]">{form.personalInfo.summary}</p>
             </section>
           )}
           
           {form.skills.some(s=>s) && (
             <section>
               <h2 className="text-2xl font-black mb-4 text-slate-900">Skills</h2>
               <ul className="space-y-3">
                 {form.skills.map((s, i) => s && (
                   <li key={i} className="flex items-center gap-3 text-slate-700 font-medium text-[13px]">
                     <div className="w-0 h-0 border-y-4 border-y-transparent border-l-[6px]" style={{ borderLeftColor: themeColor }}></div> 
                     {s}
                   </li>
                 ))}
               </ul>
             </section>
           )}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-10">
           {form.education.some(e=>e.school) && (
             <section>
               <h2 className="text-2xl font-black mb-4 text-slate-900">Education</h2>
               <div className="space-y-6">
                 {form.education.map((e,i)=> e.school && (
                   <div key={i}>
                     <div className="font-bold text-slate-400 text-lg mb-2">{e.startDate} {e.endDate && `- ${e.endDate}`}</div>
                     <div className="flex items-start gap-3">
                        <div className="w-0 h-0 border-y-4 border-y-transparent border-l-[6px] mt-1.5" style={{ borderLeftColor: themeColor }}></div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{e.school}</p>
                          <p className="text-slate-600 italic text-[13px]">{e.degree}</p>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
             </section>
           )}

           {form.experience.some(e=>e.company) && (
             <section>
               <h2 className="text-2xl font-black mb-4 text-slate-900">Experience</h2>
               <div className="space-y-6">
                 {form.experience.map((e,i)=> e.company && (
                   <div key={i}>
                     <div className="font-bold text-slate-400 text-lg mb-2">{e.startDate} {e.endDate && `- ${e.endDate}`}</div>
                     <div className="flex items-start gap-3">
                        <div className="w-0 h-0 border-y-4 border-y-transparent border-l-[6px] mt-1.5" style={{ borderLeftColor: themeColor }}></div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{e.role} — {e.company}</p>
                          <p className="text-slate-600 text-[12px] mt-1 leading-relaxed">{e.description}</p>
                        </div>
                     </div>
                   </div>
                 ))}
               </div>
             </section>
           )}
        </div>
      </div>
    </div>
  )
}
