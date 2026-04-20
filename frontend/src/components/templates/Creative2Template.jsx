import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";

export default function Creative2Template({ form, resumeRef }) {
  const themeColor = form.themeColor || "#F59E0B"; // Default Orange

  return (
    <div ref={resumeRef} className="bg-white w-[210mm] min-h-[297mm] text-black shadow-lg mx-auto flex overflow-hidden" style={{ fontFamily: "'Nunito', 'Inter', sans-serif", fontSize: "12px" }}>
      
      {/* Left Column (White) */}
      <div className="w-[60%] flex flex-col pt-10 px-8 pb-10 relative">
        {/* Background accent top left */}
        <div className="absolute top-0 left-0 w-full h-48 bg-[#FFF8ED] -z-10" style={{ backgroundColor: `${themeColor}20` }}></div>
        
        {/* Photo Container */}
        <div className="w-52 h-52 rounded-full border-[8px] p-1 mx-auto mb-10 z-10 bg-white" style={{ borderColor: themeColor }}>
           <div className="w-full h-full rounded-full overflow-hidden bg-slate-200">
             {form.personalInfo.profilePhoto ? (
                <img src={form.personalInfo.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-slate-400 font-bold uppercase">
                  {form.personalInfo.fullName ? form.personalInfo.fullName.charAt(0) : "?"}
                </div>
             )}
           </div>
        </div>
        
        {/* Summary */}
        {form.personalInfo.summary && (
          <div className="mb-12 px-2">
             <div className="text-center font-black tracking-widest uppercase text-white py-1.5 mb-6 text-sm shadow-sm" style={{ backgroundColor: themeColor }}>Profile Summary</div>
             <div className="flex gap-4">
                <div className="w-16 shrink-0"></div>
                <div className="w-3 h-3 mt-1 rounded bg-slate-400 shrink-0 opacity-0"></div> {/* Spacer to align with timeline dots below */}
                <div className="pl-4 w-full">
                  <p className="text-slate-600 italic text-[11.5px] leading-[1.7] whitespace-pre-wrap font-medium">
                    {form.personalInfo.summary}
                  </p>
                </div>
             </div>
          </div>
        )}

        {/* Education */}
        {form.education.some(e => e.school) && (
          <div className="mb-10">
            <div className="text-center font-black tracking-widest uppercase text-white py-1.5 mb-6 text-sm shadow-sm" style={{ backgroundColor: themeColor }}>Education</div>
            <div className="flex flex-col gap-6 pl-2 pr-4">
               {form.education.map((e,i)=> e.school && (
                 <div key={i} className="flex gap-4">
                   <div className="w-16 shrink-0 text-right text-slate-500 font-bold text-[11px] leading-snug">
                     {e.startDate} <br/><span className="text-slate-300">to</span><br/> {e.endDate}
                   </div>
                   <div className="w-3 h-3 mt-1 rounded bg-slate-400 shrink-0 shadow-sm" style={{ backgroundColor: themeColor }}></div>
                   <div className="border-l-2 border-slate-100 pl-4 pb-2 w-full">
                     <h4 className="font-bold text-slate-800 tracking-wider text-[13px]">{e.degree}</h4>
                     <p className="italic text-slate-500 text-xs mb-1 font-medium">{e.school}</p>
                     <p className="text-slate-400 text-[11px] leading-relaxed">{e.description}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {form.experience.some(e => e.company) && (
          <div>
            <div className="text-center font-black tracking-widest uppercase text-white py-1.5 mb-6 text-sm shadow-sm" style={{ backgroundColor: themeColor }}>Experience</div>
            <div className="flex flex-col gap-6 pl-2 pr-4">
               {form.experience.map((e,i)=> e.company && (
                 <div key={i} className="flex gap-4">
                   <div className="w-16 shrink-0 text-right text-slate-500 font-bold text-[11px] leading-snug">
                     {e.startDate} <br/><span className="text-slate-300">to</span><br/> {e.endDate}
                   </div>
                   <div className="w-3 h-3 mt-1 rounded bg-slate-400 shrink-0 shadow-sm" style={{ backgroundColor: themeColor }}></div>
                   <div className="border-l-2 border-slate-100 pl-4 pb-2 w-full">
                     <h4 className="font-bold text-slate-800 tracking-wider text-[13px]">{e.role}</h4>
                     <p className="italic text-slate-500 text-xs mb-1 font-medium">{e.company}</p>
                     <p className="text-slate-400 text-[11px] leading-relaxed">{e.description}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column (Dark) */}
      <div className="w-[40%] bg-[#2b2b2b] text-white flex flex-col pt-20 shadow-2xl z-20 pb-10">
         
         <div className="px-8 py-8 mb-12 text-white relative left-[-20px] w-[calc(100%+20px)] shadow-lg" style={{ backgroundColor: themeColor }}>
            <h1 className="text-[26px] font-black uppercase tracking-widest leading-none mb-2">{form.personalInfo.fullName || "KELLY WHITE"}</h1>
            <p className="text-xs font-bold tracking-[0.2em] uppercase opacity-90">{form.personalInfo.designation || "ART DIRECTOR"}</p>
         </div>

         <div className="px-8 text-xs text-slate-300">
            <h3 className="font-bold tracking-widest uppercase border-y border-slate-600 py-3 mb-8 text-center text-white text-sm">Contact Me</h3>
            <div className="flex flex-col gap-6 mb-12">
               {form.personalInfo.address && (
                  <div className="flex gap-4 items-center">
                     <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: themeColor }}><FaMapMarkerAlt className="text-white w-3 h-3"/></div>
                     <p className="text-[11px] leading-snug">{form.personalInfo.address}</p>
                  </div>
               )}
               {form.personalInfo.email && (
                  <div className="flex gap-4 items-center">
                     <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: themeColor }}><FaEnvelope className="text-white w-3 h-3"/></div>
                     <p className="text-[11px] break-all">{form.personalInfo.email}</p>
                  </div>
               )}
               {form.personalInfo.phone && (
                  <div className="flex gap-4 items-center">
                     <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: themeColor }}><FaPhoneAlt className="text-white w-3 h-3"/></div>
                     <p className="text-[11px]">{form.personalInfo.phone}</p>
                  </div>
               )}
               {form.personalInfo.portfolio && (
                  <div className="flex gap-4 items-center">
                     <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: themeColor }}><FaGlobe className="text-white w-3 h-3"/></div>
                     <p className="text-[11px]">{form.personalInfo.portfolio}</p>
                  </div>
               )}
            </div>

            {form.skills.some(s => s) && (
              <>
                <h3 className="font-bold tracking-widest uppercase border-y border-slate-600 py-3 mb-8 text-center text-white text-sm">Pro Skills</h3>
                <div className="flex flex-col gap-5">
                  {form.skills.map((s, i) => s && (
                    <div key={i}>
                      <p className="uppercase text-[11px] font-bold mb-2 tracking-wider">{s}</p>
                      <div className="w-full bg-slate-700 h-[6px] rounded-full overflow-hidden">
                         <div className="h-full rounded-full transition-all" style={{ width: `${Math.floor(Math.random() * 30) + 70}%`, backgroundColor: themeColor }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

         </div>
      </div>
    </div>
  )
}
