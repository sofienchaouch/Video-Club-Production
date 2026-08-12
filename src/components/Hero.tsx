import React, { useState, useEffect, useRef } from "react";
import { Play, Sparkles, Film, ArrowDown, ChevronLeft, ChevronRight, Compass, HelpCircle, Workflow } from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { formatGoogleDriveLink } from "../utils/googleDrive";

interface HeroProps {
  onPlayShowreel: () => void;
  onExploreWork: () => void;
}

export default function Hero({ onPlayShowreel, onExploreWork }: HeroProps) {
  const { t, dir, language, agencySettings } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const slides = [
    {
      id: "about",
      label: t("about_label"),
      title: t("about_title"),
      desc: t("about_desc"),
      bgImage: formatGoogleDriveLink(agencySettings?.heroImages?.[0] || "/uploads/hero-1.jpg", 'image'),
      badge: language === "ar" ? "رؤيتنا الإبداعية" : language === "fr" ? "NOTRE VISION CRÉATIVE" : "THE CREATIVE VISION",
      accent: "text-amber-400 border-amber-500/20 bg-amber-500/10",
      icon: Compass
    },
    {
      id: "why_us",
      label: t("why_us_title"),
      title: language === "ar" ? "لماذا فيديو كلوب بروداكشن؟" : t("why_us_title"),
      desc: t("why_us_desc"),
      bgImage: formatGoogleDriveLink(agencySettings?.heroImages?.[1] || "/uploads/studio-plateau.jpg", 'image'),
      badge: language === "ar" ? "القيمة المضافة" : language === "fr" ? "L'AVANTAGE CONCURRENTIEL" : "THE ADVANTAGE",
      accent: "text-blue-400 border-blue-500/20 bg-blue-500/10",
      icon: HelpCircle
    },
    {
      id: "how_we_work",
      label: t("how_we_work_title"),
      title: language === "ar" ? "سير العمل المتكامل" : t("how_we_work_title"),
      desc: t("how_we_work_desc"),
      bgImage: formatGoogleDriveLink(agencySettings?.heroImages?.[2] || "/uploads/studio-podcast.jpg", 'image'),
      badge: language === "ar" ? "منهجية العمل" : language === "fr" ? "NOTRE MÉTHODE DE TRAVAIL" : "THE WORKFLOW",
      accent: "text-teal-400 border-teal-500/20 bg-teal-500/10",
      icon: Workflow
    }
  ];

  const handleNext = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Autoplay handler
  useEffect(() => {
    if (!isAutoplayPaused) {
      autoplayTimerRef.current = setInterval(() => {
        handleNext();
      }, 9500);
    }
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isAutoplayPaused]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-20 pb-16">
      {/* Background Visuals */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/80 to-slate-950 z-[1]"></div>
        
        {/* Dynamic Background Image Switcher with cinematic crossfade */}
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSlide}
            src={slides[activeSlide].bgImage}
            alt="Cinematic production background"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-25 filter grayscale-[30%] contrast-110 saturate-75 mix-blend-lighten scale-105"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 0.28, scale: 1.05 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80";
            }}
          />
        </AnimatePresence>

        {/* Glowing Lens Flare */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 lens-flare rounded-full filter blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] lens-flare-blue rounded-full filter blur-3xl opacity-40"></div>
      </div>

      {/* Camera Viewfinder Overlay */}
      <div className="absolute inset-4 sm:inset-8 border border-white/5 pointer-events-none z-10 rounded-lg">
        {/* Corners */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-sm"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-sm"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-sm"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-sm"></div>

        {/* Viewfinder Data */}
        <div className={`absolute top-4 ${dir === "rtl" ? "right-6 flex-row-reverse" : "left-6"} hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500 uppercase`}>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-red-500 font-bold">REC</span>
          <span>4K RAW</span>
          <span>24 FPS</span>
        </div>
        <div className={`absolute top-4 ${dir === "rtl" ? "left-6 flex-row-reverse" : "right-6"} hidden sm:flex items-center gap-3 text-[10px] font-mono tracking-widest text-zinc-500`}>
          <span>STBY</span>
          <span>ISO 800</span>
          <span>F/2.8</span>
          <span>BAT 98%</span>
        </div>
        <div className={`absolute bottom-4 ${dir === "rtl" ? "right-6" : "left-6"} hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500`}>
          <span>TC 16:39:05:14</span>
        </div>
        <div className={`absolute bottom-4 ${dir === "rtl" ? "left-6" : "right-6"} hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500`}>
          <span>2.39:1 SFER</span>
        </div>
      </div>

      {/* Hero Content */}
      <motion.div 
        className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
            }
          }
        }}
      >
        {/* Subtle Tagline */}
        <motion.div 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold-500/20 bg-gold-950/20 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-6"
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
          }}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>{t("hero_boutique_agency")}</span>
        </motion.div>

        {/* Large Cinematic Title */}
        <motion.h1 
          className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter text-white mb-8 uppercase leading-none"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
        >
          {t("hero_crafting")} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-gold-200 to-white hover:brightness-110 transition-all duration-300">
            {t("hero_cinematic_stories")}
          </span>
        </motion.h1>

        {/* ================= INTERACTIVE CAROUSEL ================= */}
        <motion.div 
          className="relative max-w-3xl mx-auto mb-10 group"
          onMouseEnter={() => setIsAutoplayPaused(true)}
          onMouseLeave={() => setIsAutoplayPaused(false)}
          variants={{
            hidden: { opacity: 0, scale: 0.95, y: 30 },
            visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
        >
          {/* Card Border glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-500/10 to-transparent rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
          
          <div className="relative bg-slate-900/60 border border-zinc-900/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
            
            {/* Carousel Tabs */}
            <div className={`flex justify-center border-b border-zinc-800/40 pb-4 mb-6 gap-2 sm:gap-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              {slides.map((slide, idx) => {
                const isSelected = activeSlide === idx;
                return (
                  <button
                    key={slide.id}
                    onClick={() => {
                      setActiveSlide(idx);
                      setIsAutoplayPaused(true);
                    }}
                    className={`relative pb-2 text-[9px] sm:text-[11px] font-mono uppercase tracking-[0.18em] transition-all duration-300 cursor-pointer ${
                      isSelected ? "text-gold-400 font-bold" : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {slide.id === "about" ? t("about_label") : slide.id === "why_us" ? (language === "ar" ? "لماذا نحن" : language === "fr" ? "Pourquoi nous" : "Why Us") : (language === "ar" ? "سير العمل" : language === "fr" ? "Notre méthode" : "The Pipeline")}
                    {isSelected && (
                      <motion.div
                        layoutId="heroActiveTabLine"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold-400"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Carousel Content */}
            <div className="min-h-[190px] sm:min-h-[150px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, x: dir === "rtl" ? -15 : 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir === "rtl" ? 15 : -15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="space-y-4"
                >
                  <div className="flex justify-center items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[8px] sm:text-[9px] font-mono tracking-widest rounded-md border ${slides[activeSlide].accent}`}>
                      {React.createElement(slides[activeSlide].icon, { className: "w-3 h-3" })}
                      {slides[activeSlide].badge}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white uppercase tracking-wider">
                    {slides[activeSlide].title}
                  </h3>
                  
                  <p className="text-zinc-350 text-xs sm:text-sm font-light leading-relaxed max-w-2xl mx-auto">
                    {slides[activeSlide].desc}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Custom Arrow Buttons on hover */}
            <div className={`absolute inset-y-0 ${dir === "rtl" ? "left-1 right-1 flex-row-reverse" : "left-1 right-1"} flex items-center justify-between pointer-events-none`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                  setIsAutoplayPaused(true);
                }}
                className="pointer-events-auto w-8 h-8 rounded-full bg-slate-950/80 border border-zinc-900/60 text-zinc-500 hover:text-white flex items-center justify-center transition-all hover:border-gold-500/40 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105"
                title="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                  setIsAutoplayPaused(true);
                }}
                className="pointer-events-auto w-8 h-8 rounded-full bg-slate-950/80 border border-zinc-900/60 text-zinc-500 hover:text-white flex items-center justify-center transition-all hover:border-gold-500/40 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105"
                title="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Auto-play progress countdown tracks */}
            <div className={`flex justify-center gap-1.5 mt-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              {slides.map((_, idx) => {
                const isActive = activeSlide === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveSlide(idx);
                      setIsAutoplayPaused(true);
                    }}
                    className="h-1 bg-zinc-800 rounded-full cursor-pointer relative overflow-hidden transition-all duration-300"
                    style={{ width: isActive ? "32px" : "8px" }}
                  >
                    {isActive && !isAutoplayPaused && (
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-gold-400"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 9.5, ease: "linear" }}
                      />
                    )}
                    {isActive && isAutoplayPaused && (
                      <div className="absolute inset-0 bg-gold-500" />
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${dir === "rtl" ? "sm:flex-row-reverse" : ""}`}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
        >
          <button
            onClick={onPlayShowreel}
            className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-slate-950 font-display font-bold text-sm tracking-widest rounded-lg shadow-xl shadow-gold-500/10 hover:shadow-gold-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2.5 uppercase cursor-pointer"
          >
            <div className="relative flex items-center justify-center w-5 h-5 bg-slate-950 rounded-full group-hover:scale-110 transition-all duration-300">
              <Play className={`w-2.5 h-2.5 text-gold-400 fill-current ${dir === "rtl" ? "translate-x-[-0.5px]" : "translate-x-0.5"}`} />
            </div>
            {t("hero_play_showreel")}
          </button>

          <button
            onClick={onExploreWork}
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-white font-display font-medium text-sm tracking-widest rounded-lg border border-zinc-800 hover:border-zinc-700 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 uppercase cursor-pointer"
          >
            <Film className="w-4 h-4 text-zinc-400" />
            {t("hero_explore_projects")}
          </button>
        </motion.div>
      </motion.div>

      {/* Decorative Bottom gradient & arrow */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center animate-bounce opacity-40 z-20">
        <button
          onClick={onExploreWork}
          className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
          title="Scroll down"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent z-10 pointer-events-none"></div>
    </section>
  );
}
