import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaExternalLinkAlt } from "react-icons/fa";

export default function Creative1Template({ form, resumeRef }) {
  const themeColor = form.themeColor || "#FFB000";

  // Guard: ensure all array fields exist even when resume is partially loaded
  const skills        = form.skills        || [];
  const projects      = form.projects      || [];
  const education     = form.education     || [];
  const experience    = form.experience    || [];
  const languages     = form.languages     || [];
  const certifications = form.certifications || [];
  const interests     = form.interests     || [];
  const personalInfo  = form.personalInfo  || {};

  return (
    <div ref={resumeRef} className={`bg-white w-[210mm] min-h-[297mm] text-black shadow-lg mx-auto overflow-hidden relative ${form.fontFamily || "font-sans"}`} style={{ fontSize: "12px" }}>

      <div className="absolute top-0 left-0 w-full h-24 bg-slate-50 z-0"></div>


      <div className="pt-12 px-16 relative flex gap-8 mb-6 z-10 items-center">
        <div className="w-48 h-48 rounded-full overflow-hidden shrink-0 border-8 border-white shadow-xl bg-slate-200">
          {personalInfo.profilePhoto ? (
            <img src={personalInfo.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-slate-400 font-bold uppercase">
              {personalInfo.fullName ? personalInfo.fullName.charAt(0) : "?"}
            </div>
          )}
        </div>

        <div className="flex-1 pt-4">
          <h1 className="text-5xl font-black text-slate-900 mb-4">{personalInfo.fullName || "FRANK HUGH"}</h1>
          <div className="inline-block px-4 py-2 font-bold tracking-widest text-sm uppercase text-slate-900" style={{ backgroundColor: themeColor }}>
            {personalInfo.designation || "MARKETING COACH"}
          </div>
          <div className="flex gap-3 mt-5 text-lg">
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <FaLinkedin className="w-4 h-4" />
              </a>
            )}
            {personalInfo.github && (
              <a href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                <FaGithub className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="px-16 text-center text-slate-400 text-sm mb-2 pb-2">
        <span className="font-medium">
          {[personalInfo.portfolio, personalInfo.email, personalInfo.phone, personalInfo.address].filter(Boolean).join("  |  ")}
        </span>
      </div>
      <div className="w-full h-3" style={{ backgroundColor: themeColor }}></div>

      <div className="px-16 py-10 grid grid-cols-2 gap-16">
        <div className="flex flex-col gap-10">
          {personalInfo.summary && (
            <section>
              <h2 className="text-2xl font-black mb-4 text-slate-900">About Me</h2>
              <p className="text-slate-600 leading-relaxed text-[13px] whitespace-pre-wrap">{personalInfo.summary}</p>
            </section>
          )}

          {skills.some(s => s) && (
            <section>
              <h2 className="text-2xl font-black mb-4 text-slate-900">Skills</h2>
              <ul className="space-y-3">
                {skills.map((s, i) => s && (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium text-[13px]">
                    <div className="w-0 h-0 border-y-4 border-y-transparent border-l-[6px]" style={{ borderLeftColor: themeColor }}></div>
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {projects.some(p => p.title) && (
            <section>
              <h2 className="text-2xl font-black mb-4 text-slate-900">Projects</h2>
              <div className="space-y-6">
                {projects.map((p, i) => p.title && (
                  <div key={i}>
                    <h3 className="font-bold text-slate-800 text-[13px] uppercase tracking-wide">{p.title}</h3>
                    {p.link && (
                      <a href={p.link.startsWith('http') ? p.link : `https://${p.link}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold flex items-center gap-1 hover:underline mb-1" style={{ color: themeColor }}>
                        View Project <FaExternalLinkAlt className="w-2 h-2" />
                      </a>
                    )}
                    <p className="text-slate-600 text-[12px] leading-relaxed">{p.description}</p>
                    {p.technologies && (
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">
                        <b>Tech Stack:</b> {p.technologies}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          {interests.some(s => s) && (
            <section>
              <h2 className="text-2xl font-black mb-4 text-slate-900">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, i) => interest && (
                  <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[11px] font-bold border border-slate-200 uppercase tracking-tighter">
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-10">
          {education.some(e => e.school) && (
            <section>
              <h2 className="text-2xl font-black mb-4 text-slate-900">Education</h2>
              <div className="space-y-6">
                {education.map((e, i) => e.school && (
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

          {experience.some(e => e.company) && (
            <section>
              <h2 className="text-2xl font-black mb-4 text-slate-900">Experience</h2>
              <div className="space-y-6">
                {experience.map((e, i) => e.company && (
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
          {certifications.some(c => c.title) && (
            <section>
              <h2 className="text-2xl font-black mb-4 text-slate-900">Certifications</h2>
              <div className="space-y-4">
                {certifications.map((c, i) => c.title && (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-0 h-0 border-y-4 border-y-transparent border-l-[6px] mt-1.5" style={{ borderLeftColor: themeColor }}></div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm tracking-wide">{c.title}</p>
                      <p className="text-slate-500 text-[12px] italic">{c.issuer} {c.date && `— ${c.date}`}</p>
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
