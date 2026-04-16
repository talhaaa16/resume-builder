import React from "react";

export default function ModernTemplate({ form, resumeRef }) {
  return (
    <div ref={resumeRef} className="bg-white w-full min-h-[297mm] flex text-black shadow-lg mx-auto" style={{ fontFamily: "'Outfit', 'Inter', sans-serif", fontSize: "12px" }}>
      
      {/* Left Sidebar (Dark) */}
      <div className="w-[35%] bg-slate-900 text-white p-8 flex flex-col gap-8">
        <div className="text-center">
          {form.personalInfo.profilePhoto ? (
            <img src={form.personalInfo.profilePhoto} alt="Profile" className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-slate-700 mb-4" />
          ) : (
            <div className="w-32 h-32 rounded-full mx-auto bg-slate-800 flex items-center justify-center border-4 border-slate-700 mb-4">
              <span className="text-4xl text-slate-500 font-bold">
                {form.personalInfo.fullName ? form.personalInfo.fullName.charAt(0) : "?"}
              </span>
            </div>
          )}
          <h2 className="text-xl font-bold uppercase tracking-widest mb-1">{form.personalInfo.fullName || "NAME HERE"}</h2>
          <p className="text-slate-400 text-sm">{form.personalInfo.designation || "DESIGNATION"}</p>
        </div>

        <div className="border-t border-slate-700 w-full"></div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Contact Info</h3>
          <div className="flex flex-col gap-3 text-xs text-slate-200">
             {form.personalInfo.email && <p className="break-all">📧 {form.personalInfo.email}</p>}
             {form.personalInfo.phone && <p>📱 {form.personalInfo.phone}</p>}
             {form.personalInfo.address && <p>📍 {form.personalInfo.address}</p>}
             {form.personalInfo.linkedin && <p>🔗 {form.personalInfo.linkedin}</p>}
             {form.personalInfo.github && <p>💻 {form.personalInfo.github}</p>}
          </div>
        </div>

        <div className="border-t border-slate-700 w-full"></div>

        {form.skills.some(s => s) && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((skill, i) => skill && (
                <span key={i} className="bg-slate-800 text-slate-200 px-3 py-1 rounded-full text-xs">{skill}</span>
              ))}
            </div>
          </div>
        )}
        
        {form.education.some(e => e.school) && (
          <>
            <div className="border-t border-slate-700 w-full"></div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Education</h3>
              {form.education.map((edu, i) => edu.school && (
                <div key={i} className="mb-4 last:mb-0">
                    <p className="font-bold text-slate-100">{edu.school}</p>
                    <p className="text-slate-400 italic text-xs mb-1">{edu.degree}</p>
                    <p className="text-slate-500 text-[10px] uppercase">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* Right Content Area (Light) */}
      <div className="w-[65%] p-8 bg-white flex flex-col gap-8">
        
        {form.personalInfo.summary && (
          <section>
            <h3 className="text-sm font-black border-b-2 border-[#00A86B] mb-3 pb-2 uppercase text-slate-800 tracking-wider inline-block">Profile Summary</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{form.personalInfo.summary}</p>
          </section>
        )}

        {form.experience.some(e => e.company) && (
          <section>
            <h3 className="text-sm font-black border-b-2 border-[#00A86B] mb-4 pb-2 uppercase text-slate-800 tracking-wider inline-block">Professional Experience</h3>
            <div className="flex flex-col gap-6">
              {form.experience.map((exp, i) => exp.company && (
                <div key={i} className="relative pl-4 border-l-2 border-slate-200">
                  <div className="absolute w-3 h-3 bg-[#00A86B] rounded-full -left-[7px] top-1"></div>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{exp.role}</h4>
                      <h5 className="text-slate-600 font-medium text-sm">{exp.company}</h5>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded font-medium">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {form.projects.some(p => p.title) && (
          <section>
            <h3 className="text-sm font-black border-b-2 border-[#00A86B] mb-4 pb-2 uppercase text-slate-800 tracking-wider inline-block">Featured Projects</h3>
            <div className="grid grid-cols-1 gap-4">
              {form.projects.map((proj, i) => proj.title && (
                <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                    {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline">View Link ↗</a>}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-xs">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
