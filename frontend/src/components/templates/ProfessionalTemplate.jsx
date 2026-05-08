import React from "react";

export default function ProfessionalTemplate({ form, resumeRef }) {
  return (
    <div ref={resumeRef} className="bg-white w-full min-h-[297mm] p-12 flex flex-col gap-8 text-black shadow-lg mx-auto" style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px" }}>
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-8 gap-6">
        {form.personalInfo.profilePhoto && (
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
            <img src={form.personalInfo.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 mb-1">{form.personalInfo.fullName || "NAME HERE"}</h1>
          <p className="text-lg font-bold text-[#0076BC] uppercase tracking-widest leading-none mb-3">{form.personalInfo.designation || "YOUR TITLE"}</p>
          <p className="text-slate-600 leading-tight pr-10 whitespace-pre-wrap">{form.personalInfo.summary}</p>
        </div>
        <div className="flex flex-col text-right gap-1 font-medium text-slate-500 whitespace-nowrap text-xs">
          <p>{form.personalInfo.email}</p>
          <p>{form.personalInfo.phone}</p>
          <p>{form.personalInfo.address}</p>
          {form.personalInfo.linkedin && (
            <a href={form.personalInfo.linkedin.startsWith('http') ? form.personalInfo.linkedin : `https://${form.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#0076BC] transition-colors">
              LinkedIn
            </a>
          )}
          {form.personalInfo.github && (
            <a href={form.personalInfo.github.startsWith('http') ? form.personalInfo.github : `https://${form.personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#0076BC] transition-colors">
              GitHub
            </a>
          )}
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
                    <span className="text-[10px] text-blue-500 italic lowercase font-normal">
                      {proj.link && (
                        <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Link ↗
                        </a>
                      )}
                    </span>
                  </div>
                  {proj.technologies && <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Tech: {proj.technologies}</p>}
                  <p className="text-slate-600 leading-relaxed mt-1 text-[11px]">{proj.description}</p>
                </div>
              ))}
            </section>
          )}
          {form.certifications?.some(c => c.title) && (
            <section>
              <h3 className="text-sm font-black border-b border-slate-200 mb-3 pb-1 uppercase text-slate-800 tracking-wider">Certifications</h3>
              {form.certifications.map((c, i) => c.title && (
                <div key={i} className="mb-3">
                  <div className="flex justify-between font-bold text-slate-900 text-xs">
                    <span>{c.title}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{c.date}</span>
                  </div>
                  <p className="text-[#0076BC] text-[10px] italic">{c.issuer}</p>
                </div>
              ))}
            </section>
          )}
        </div>

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
          {form.interests?.some(s => s) && (
            <section>
              <h3 className="text-xs font-black mb-3 uppercase text-slate-800 tracking-widest border-b border-slate-200 pb-1">Interests</h3>
              <div className="flex flex-wrap gap-1">
                {form.interests.map((interest, i) => interest && (
                  <span key={i} className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded text-[9px] border border-slate-200">{interest}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
