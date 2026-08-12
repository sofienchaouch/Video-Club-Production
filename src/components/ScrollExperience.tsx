import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";

interface ScrollExperienceProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const SECTIONS = [
  { id: "hero", key: "nav_home" },
  { id: "work", key: "nav_work" },
  { id: "capabilities", key: "nav_capabilities" },
  { id: "budget", key: "nav_budget" },
  { id: "roster", key: "nav_roster" },
  { id: "faqs", key: "nav_faqs" },
  { id: "contact", key: "nav_contact" },
] as const;

export default function ScrollExperience({ activeSection, onNavigate }: ScrollExperienceProps) {
  const { t, dir } = useApp();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate overall page scroll progress
      if (docHeight > 0) {
        const progress = (scrollY / docHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }

      // Show or hide "Back to Top" widget with a comfortable threshold
      setShowBackToTop(scrollY > 450);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initialize immediately
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // SVG Circular progress configurations
  const radius = 24;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  const isRtl = dir === "rtl";

  return (
    <>
      {/* 1. Global Top Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-zinc-950/20 pointer-events-none">
        <motion.div
          className="h-full bg-gradient-to-r from-gold-600 via-gold-400 to-amber-500 shadow-[0_1px_10px_rgba(219,179,116,0.6)]"
          style={{ width: `${scrollProgress}%` }}
          layoutId="scrollProgressTop"
          transition={{ type: "spring", stiffness: 120, damping: 25 }}
        />
      </div>

      {/* 2. Floating Vertical Desk Dot Indicator (Scroll Spy) */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-5 items-center bg-slate-950/40 backdrop-blur-md border border-zinc-900/60 p-3 rounded-full shadow-2xl py-5 ${
          isRtl ? "left-6" : "right-6"
        }`}
      >
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          const label = t(sec.key as any);

          return (
            <div
              key={sec.id}
              className="relative flex items-center justify-center cursor-pointer group"
              onClick={() => onNavigate(sec.id)}
              onMouseEnter={() => setHoveredDot(sec.id)}
              onMouseLeave={() => setHoveredDot(null)}
            >
              {/* Pulsing Active Outer Ring */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeSectionRing"
                    className="absolute w-5 h-5 rounded-full border border-gold-500/80 bg-gold-500/10"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  />
                )}
              </AnimatePresence>

              {/* Central Circle State */}
              <motion.div
                className={`w-2.5 h-2.5 rounded-full z-10 transition-colors duration-300 ${
                  isActive
                    ? "bg-gold-400"
                    : hoveredDot === sec.id
                    ? "bg-white scale-125"
                    : "bg-zinc-600 group-hover:bg-zinc-400"
                }`}
                animate={{
                  scale: isActive ? 1 : hoveredDot === sec.id ? 1.25 : 1,
                }}
              />

              {/* Side Floating Tooltip */}
              <AnimatePresence>
                {hoveredDot === sec.id && (
                  <motion.div
                    className={`absolute whitespace-nowrap px-3 py-1.5 text-[10px] font-mono tracking-widest font-bold uppercase rounded-lg bg-slate-900 border border-zinc-800 text-gold-400 shadow-2xl pointer-events-none z-50 ${
                      isRtl ? "left-8 origin-left" : "right-8 origin-right"
                    }`}
                    initial={{ opacity: 0, x: isRtl ? -10 : 10, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: isRtl ? -10 : 10, scale: 0.9 }}
                    transition={{ duration: 0.18 }}
                  >
                    {label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 3. Bottom-Corner Back to Top Radial Progress Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            id="backToTopButton"
            onClick={() => onNavigate("hero")}
            className={`fixed bottom-8 z-50 p-2 rounded-full bg-slate-950 border border-zinc-900/80 hover:border-gold-500/40 text-gold-400 hover:text-white hover:bg-slate-900 shadow-2xl transition-all duration-300 cursor-pointer active:scale-95 flex items-center justify-center ${
              isRtl ? "left-8" : "right-8"
            }`}
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            title={isRtl ? "الرجوع للأعلى" : "Back to top"}
          >
            {/* SVG Circular Ring Gauge */}
            <svg width="56" height="56" className="transform -rotate-90">
              {/* Underlay Track */}
              <circle
                cx="28"
                cy="28"
                r={radius}
                className="stroke-zinc-900/60 fill-transparent"
                strokeWidth={strokeWidth}
              />
              {/* Filled Animated Segment */}
              <motion.circle
                cx="28"
                cy="28"
                r={radius}
                className="stroke-gold-500 fill-transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transition={{ type: "spring", stiffness: 100, damping: 25 }}
              />
            </svg>

            {/* Centered Arrow Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <ArrowUp className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
