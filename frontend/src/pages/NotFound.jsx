import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Home, Compass, AlertCircle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const numberRef = useRef(null);
  const illustrationRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Background animation
      gsap.to(".bg-circle-1", {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".bg-circle-2", {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Main content reveal
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(numberRef.current, 
        { y: 50, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.1 }
      )
      .fromTo(illustrationRef.current,
        { scale: 0, rotation: -45, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.6"
      )
      .fromTo(textRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
        "-=0.4"
      )
      .fromTo(buttonsRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
        "-=0.2"
      );

      // Glitch effect on the 404 text
      gsap.to(".glitch-text", {
        x: "random(-5, 5)",
        y: "random(-5, 5)",
        opacity: "random(0.5, 1)",
        duration: 0.1,
        repeat: -1,
        repeatRefresh: true,
        ease: "none"
      }).pause(); // Pause by default, could play on hover
      
      const glitchElement = document.querySelector(".glitch-container");
      if (glitchElement) {
        glitchElement.addEventListener("mouseenter", () => gsap.getTweensOf(".glitch-text")[0].play());
        glitchElement.addEventListener("mouseleave", () => {
          gsap.getTweensOf(".glitch-text")[0].pause();
          gsap.to(".glitch-text", { x: 0, y: 0, opacity: 1, duration: 0.2 });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative overflow-hidden" ref={containerRef}>
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob bg-circle-1"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 bg-circle-2"></div>
      <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[800px] h-96 bg-[#0076BC] rounded-full filter blur-[120px] opacity-20"></div>

      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="max-w-3xl w-full text-center">
          
          <div className="flex justify-center items-center gap-4 mb-6" ref={numberRef}>
            <div className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-br from-[#0076BC] to-[#00A86B] leading-none tracking-tighter drop-shadow-sm glitch-container relative">
              4
              <span className="absolute top-0 left-0 text-[#0076BC] opacity-50 -z-10 mix-blend-screen glitch-text">4</span>
              <span className="absolute top-0 left-0 text-[#00A86B] opacity-50 -z-10 mix-blend-screen glitch-text" style={{ transform: 'translate(2px, 2px)' }}>4</span>
            </div>
            
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-emerald-100" ref={illustrationRef}>
              <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-emerald-500" />
            </div>
            
            <div className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-bl from-[#00A86B] to-[#0076BC] leading-none tracking-tighter drop-shadow-sm glitch-container relative">
              4
              <span className="absolute top-0 left-0 text-[#00A86B] opacity-50 -z-10 mix-blend-screen glitch-text">4</span>
              <span className="absolute top-0 left-0 text-[#0076BC] opacity-50 -z-10 mix-blend-screen glitch-text" style={{ transform: 'translate(-2px, -2px)' }}>4</span>
            </div>
          </div>

          <div ref={textRef} className="space-y-4 mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-slate-800 tracking-tight">
              Oops! Page Not Found
            </h1>
            <p className="text-slate-500 text-lg md:text-xl max-w-lg mx-auto">
              It seems you've ventured into the unknown. The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#0076BC] to-[#00A86B] text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
            <button 
              onClick={() => navigate("/jobs")}
              className="flex items-center gap-2 px-8 py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all w-full sm:w-auto justify-center shadow-sm"
            >
              <Compass className="w-5 h-5 text-slate-400" />
              Explore Jobs
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
