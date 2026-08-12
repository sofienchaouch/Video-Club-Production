import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ClientLogos from "./components/ClientLogos";
import WorkShowcase from "./components/WorkShowcase";
import Capabilities from "./components/Capabilities";
import Team from "./components/Team";
import BudgetEstimator from "./components/BudgetEstimator";
import FaqSection from "./components/FaqSection";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ScrollExperience from "./components/ScrollExperience";
import AdminPanel from "./components/AdminPanel";
import FloatingCallButton from "./components/FloatingCallButton";
import { X, Volume2, Check, Play } from "lucide-react";
import { useApp } from "./context/AppContext";

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [activeSection, setActiveSection] = useState("hero");
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);
  const [isPlayingShowreel, setIsPlayingShowreel] = useState(false);
  const [showreelProgress, setShowreelProgress] = useState(0);
  const [showreelVolume, setShowreelVolume] = useState(80);
  const [showreelResolution, setShowreelResolution] = useState("4K Master");

  // Track simple toast notifications for saved estimates
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { language, t, dir, agencySettings } = useApp();

  // Listen to popstate to update current path (e.g. when jumping from footer link or back button)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  // Viewport-aware scroll tracking for pixel-perfect active section highlighting
  useEffect(() => {
    const sections = ["hero", "work", "capabilities", "budget", "roster", "faqs", "contact"];
    
    const handleScroll = () => {
      let currentSection = "hero";
      let minDistance = Infinity;
      const targetPoint = 220; // Matches navbar height + comfortable offset

      sections.forEach((secId) => {
        const el = document.getElementById(secId);
        if (el) {
          const rect = el.getBoundingClientRect();
          
          // If the element spans across our target visual line, it is active
          if (rect.top <= targetPoint && rect.bottom >= targetPoint) {
            currentSection = secId;
            minDistance = 0;
          } else {
            // Fallback: calculate the distance from the top of the element to our target line
            const distance = Math.abs(rect.top - targetPoint);
            if (distance < minDistance) {
              minDistance = distance;
              currentSection = secId;
            }
          }
        }
      });

      setActiveSection(currentSection);
    };

    // Run immediately to set accurate initial active section
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Showreel progress simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isShowreelOpen && isPlayingShowreel) {
      interval = setInterval(() => {
        setShowreelProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingShowreel(false);
            return 0;
          }
          return prev + 1;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isShowreelOpen, isPlayingShowreel]);

  if (currentPath === "/admin") {
    return (
      <AdminPanel
        onExit={() => {
          window.history.pushState({}, "", "/");
          setCurrentPath("/");
        }}
      />
    );
  }

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  const handleOpenShowreel = () => {
    setIsShowreelOpen(true);
    setIsPlayingShowreel(true);
    setShowreelProgress(0);
  };

  const handleCloseShowreel = () => {
    setIsShowreelOpen(false);
    setIsPlayingShowreel(false);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Localized texts for showreel modal
  const showreelMetaText = language === "ar"
    ? "فيديو كلوب // شريط استعراضي 2026 // دقة الماستر الأصلي"
    : "VIDEO CLUB // SHOWREEL 2026 // MASTER RESOLUTION";

  const streamingTag = language === "ar"
    ? "بث مباشر لأعمالنا السينمائية فائقة الدقة"
    : language === "fr"
    ? "DIFFUSION DE TRAVAUX CINÉMATOGRAPHIQUES EN HAUTE QUALITÉ"
    : "STREAMING HIGH-BITRATE CINEMA WORK";

  const showreelTitle = language === "ar"
    ? "الزمن، السرعة، واللقطات الشاعرية الساحرة"
    : "CHRONOS, VELOCITY, & POETIC SHOTS";

  const showreelConcept = language === "ar"
    ? "شاهد مناظر آيسلندا الطبيعية الخلابة، وأزقة طوكيو السيبرانية العميقة، وممرات جبال الألب السويسرية الرائعة."
    : language === "fr"
    ? "Découvrez les paysages sauvages d'Islande, les ruelles cyber de Tokyo et les virages des Alpes suisses."
    : "Experience raw Icelandic landscapes, Tokyo cyber alleyways, and the Swiss Alps hairpin corners.";

  const pausedTitle = language === "ar" ? "تم إيقاف الشريط مؤقتاً" : language === "fr" ? "BANDE-ANNONCE EN PAUSE" : "SHOWREEL PAUSED";
  const pausedDesc = language === "ar"
    ? "انقر في أي مكان أو اضغط تشغيل لمواصلة العرض السينمائي."
    : language === "fr"
    ? "Cliquez n'importe où ou appuyez sur lecture pour reprendre."
    : "Click anywhere or press play to resume cinematic streaming.";

  const pauseBtnLabel = language === "ar" ? "إيقاف مؤقت" : language === "fr" ? "PAUSE" : "PAUSE";
  const playBtnLabel = language === "ar" ? "تشغيل" : language === "fr" ? "LECTURE" : "PLAY";

  return (
    <div className="relative min-h-screen bg-slate-950 text-gray-100 font-sans selection:bg-gold-500 selection:text-slate-950">
      {/* Visual background grain overlay */}
      <div className="fixed inset-0 grain-overlay z-40 pointer-events-none"></div>

      {/* Navigation */}
      <Navbar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Interactive Scroll Experience Tools */}
      <ScrollExperience activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <main id="main-content">
        {/* Hero Header Section */}
        <Hero
          onPlayShowreel={handleOpenShowreel}
          onExploreWork={() => handleNavigate("work")}
        />

        {/* Client Partners Section */}
        <ClientLogos />

        {/* Work Showcase / Portfolio Section */}
        <WorkShowcase onOpenShowreel={handleOpenShowreel} />

        {/* Our Expertise / Capabilities Section */}
        <Capabilities />

        {/* Interactive Budget Estimator Section */}
        <BudgetEstimator
          onEstimateSaved={(amount, itemsCount) => {
            const localeStr = language === "ar" ? "ar-TN" : language === "fr" ? "fr-TN" : "en-TN";
            const formatted = new Intl.NumberFormat(localeStr, {
              style: "currency",
              currency: "TND",
              maximumFractionDigits: 0,
            }).format(amount);
            
            const msg = language === "ar"
              ? `نجاح! تم حفظ تقدير ميزانيتك المخصصة بمبلغ ${formatted} لعدد ${itemsCount} من خدمات الإنتاج.`
              : language === "fr"
              ? `Succès ! Estimation personnalisée de ${formatted} pour ${itemsCount} services de production enregistrée.`
              : language === "en-TN" || language === "en" || true
              ? `Success! Custom estimate of ${formatted} for ${itemsCount} production services saved.`
              : `Success! Custom estimate of ${formatted} for ${itemsCount} production services saved.`;
            triggerToast(msg);
          }}
        />

        {/* Team Specialties & Crew Roster */}
        <Team />

        {/* Frequently Asked Questions */}
        <FaqSection />

        {/* Contact Inquiry Section */}
        <Contact />
      </main>

      {/* Footer Content */}
      <Footer onNavigate={handleNavigate} />

      {/* 4K FULL-SCREEN CINEMATIC SHOWREEL MODAL */}
      {isShowreelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
          <div className="relative w-full max-w-5xl aspect-video bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between">
            
            {/* Header control line */}
            <div className={`p-4 bg-gradient-to-b from-black to-transparent flex items-center justify-between z-10 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <div className={`flex items-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400">
                  {showreelMetaText}
                </span>
              </div>
              <button
                onClick={handleCloseShowreel}
                className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
                title="Close showreel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Canvas Area */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              {isPlayingShowreel ? (
                <div className="w-full h-full relative bg-black flex items-center justify-center overflow-hidden">
                  <video
                    src={agencySettings?.presentationVideoUrl || "/uploads/presentation-video.mp4"}
                    autoPlay
                    controls
                    playsInline
                    className="w-full h-full object-contain bg-black"
                    onTimeUpdate={(e) => {
                      const v = e.currentTarget;
                      if (v.duration) {
                        setShowreelProgress(Math.floor((v.currentTime / v.duration) * 100));
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-4 z-10 p-6">
                  <div className="w-16 h-16 bg-gold-500 text-slate-950 rounded-full flex items-center justify-center shadow-2xl mx-auto cursor-pointer hover:scale-105 transition-all" onClick={() => setIsPlayingShowreel(true)}>
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                      {pausedTitle}
                    </h4>
                    <p className="text-zinc-500 text-xs mt-1">
                      {pausedDesc}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom control bar */}
            <div className="p-4 bg-gradient-to-t from-black to-transparent flex flex-col gap-3 z-10">
              {/* Progress Slider */}
              <div className={`flex items-center justify-between text-[10px] font-mono text-zinc-500 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <span>0:{showreelProgress < 10 ? `0${showreelProgress}` : showreelProgress} / 1:40</span>
                <span className="text-gold-400">{showreelResolution}</span>
              </div>
              <div
                className="w-full h-1 bg-zinc-850 rounded-full cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  setShowreelProgress(Math.floor((clickX / rect.width) * 100));
                }}
              >
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold-500 to-gold-300 rounded-full shadow-[0_0_8px_#dbb374]"
                  style={{ width: `${showreelProgress}%` }}
                ></div>
              </div>

              {/* Action Buttons */}
              <div className={`flex items-center justify-between ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <div className={`flex items-center gap-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <button
                    onClick={() => setIsPlayingShowreel(!isPlayingShowreel)}
                    className="text-xs text-zinc-300 hover:text-white transition-colors uppercase font-mono font-bold cursor-pointer"
                  >
                    {isPlayingShowreel ? pauseBtnLabel : playBtnLabel}
                  </button>

                  {/* Volume block */}
                  <div className={`flex items-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <Volume2 className="w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={showreelVolume}
                      onChange={(e) => setShowreelVolume(Number(e.target.value))}
                      className="w-16 accent-gold-500 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Resolution switchers */}
                <div className={`flex gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  {["1080p Stream", "4K Master"].map((res) => (
                    <button
                      key={res}
                      onClick={() => setShowreelResolution(res)}
                      className={`px-2 py-0.5 rounded text-[9px] font-mono border transition-all cursor-pointer ${
                        showreelResolution === res
                          ? "bg-gold-500 border-gold-500 text-slate-950 font-bold"
                          : "bg-transparent border-zinc-850 text-zinc-500 hover:text-white hover:border-zinc-700"
                      }`}
                    >
                      {res === "1080p Stream" && language === "ar" ? "بث 1080p" : (res === "4K Master" && language === "ar" ? "ماستر 4K" : res)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CALL BUTTON */}
      <FloatingCallButton />

      {/* FLOATING ACTION TOAST */}
      {toastMessage && (
        <div className={`fixed bottom-6 ${dir === "rtl" ? "left-6" : "right-6"} z-50 bg-slate-900 border-l-4 border-gold-500 text-white px-5 py-4 rounded-lg shadow-2xl flex items-start gap-3 max-w-md animate-slide-in ${dir === "rtl" ? "flex-row-reverse text-right border-l-0 border-r-4" : "text-left"}`}>
          <div className="w-6 h-6 bg-gold-500/10 text-gold-400 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <span className="block font-display text-xs font-bold uppercase tracking-wider text-gold-400">
              {t("budget_calculator")}
            </span>
            <p className="text-zinc-300 text-xs mt-1 font-light leading-normal">
              {toastMessage}
            </p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-zinc-500 hover:text-white text-xs font-mono select-none cursor-pointer"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
