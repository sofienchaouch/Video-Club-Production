import React, { useState, useRef, useEffect } from "react";
import { PORTFOLIO_WORKS } from "../data/agencyData";
import { WorkItem, ProjectCategory } from "../types";
import { 
  Eye, 
  Clock, 
  Video, 
  Award, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Play, 
  Volume2, 
  Maximize, 
  User, 
  Sparkles, 
  Tv, 
  Camera, 
  Sliders, 
  Share2, 
  Film, 
  Minimize2,
  CheckCircle2,
  HelpCircle
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";

interface WorkShowcaseProps {
  onOpenShowreel: () => void;
}

export default function WorkShowcase({ onOpenShowreel }: WorkShowcaseProps) {
  const { language, t, data, dir, agencySettings } = useApp();
  
  // Merge original works metadata with custom projects & translations dynamically
  const customProjects = agencySettings?.customProjects || [];
  
  // Helper function to dynamically derive the best video thumbnail cover
  const resolveProjectStill = (p: any) => {
    // 1. Check if custom override from Admin Settings exists
    if (agencySettings?.portfolioImages?.[p.id]) {
      return agencySettings.portfolioImages[p.id];
    }
    // 2. Check if a valid specific visualStill image is set on the project object
    if (p.visualStill && typeof p.visualStill === "string" && p.visualStill.trim() !== "" && p.visualStill !== "https://videoclubproduction.com/wp-content/uploads/2025/11/p8.jpg") {
      return p.visualStill;
    }
    // 3. Extract YouTube ID if present and generate high resolution thumbnail
    let yId = p.youtubeId;
    const urlToTest = p.youtubeUrl || p.videoUrl || p.url || "";
    if (!yId && typeof urlToTest === "string") {
      const match = urlToTest.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match) yId = match[1];
    }
    if (yId) {
      return `https://img.youtube.com/vi/${yId}/maxresdefault.jpg`;
    }
    return "/uploads/p8.jpg";
  };

  const resolveProjectVideo = (p: any) => {
    if (p.id === "company-presentation" && agencySettings?.presentationVideoUrl) {
      return agencySettings.presentationVideoUrl;
    }
    return p.videoUrl;
  };

  const translatedWorks = [
    ...PORTFOLIO_WORKS.map((work) => {
      const customProject = customProjects.find((cp: any) => cp.id === work.id);
      const translated = data.works.find((w) => w.id === work.id);
      const base = customProject ? { ...work, ...customProject } : work;
      return {
        ...base,
        title: customProject?.title || translated?.title || work.title,
        client: customProject?.client || translated?.client || work.client,
        description: customProject?.description || translated?.description || work.description,
        challenge: customProject?.challenge || translated?.challenge || work.challenge,
        solution: customProject?.solution || translated?.solution || work.solution,
        tags: customProject?.tags || translated?.tags || work.tags,
        visualStill: resolveProjectStill({ ...base, ...customProject }),
        videoUrl: resolveProjectVideo({ ...base, ...customProject }),
      };
    }),
    ...customProjects
      .filter((cp: any) => !PORTFOLIO_WORKS.some((w) => w.id === cp.id))
      .map((cp: any) => ({
        ...cp,
        visualStill: resolveProjectStill(cp),
        tags: Array.isArray(cp.tags) ? cp.tags : (cp.tags ? String(cp.tags).split(",").map((s: string) => s.trim()) : ["Commercial", "4K"])
      }))
  ];

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("all");

  // Default active work is the first video
  const [activeWorkId, setActiveWorkId] = useState<string>(translatedWorks[0]?.id || "company-presentation");
  
  // Cinematic Case Study Tab
  const [activeTab, setActiveTab] = useState<"overview" | "challenge">("overview");
  
  // Full-screen Theater Mode Modal state
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Native MP4 Video Player states (for videos with videoUrl instead of youtubeId)
  const [isPlayingNative, setIsPlayingNative] = useState(false);
  const [nativeMuted, setNativeMuted] = useState(false);
  const [nativeProgress, setNativeProgress] = useState(0);
  const [nativeDuration, setNativeDuration] = useState("0:00");
  const [nativeCurrentTime, setNativeCurrentTime] = useState("0:00");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerSectionRef = useRef<HTMLDivElement | null>(null);

  const filteredWorks = selectedCategory === "all"
    ? translatedWorks
    : translatedWorks.filter((w) => w.category === selectedCategory);

  const currentWorkIndex = filteredWorks.findIndex((w) => w.id === activeWorkId);
  const activeWork = filteredWorks[currentWorkIndex] || filteredWorks[0] || translatedWorks[0];

  // Auto-reset native player state when active work changes
  useEffect(() => {
    setIsPlayingNative(false);
    setNativeProgress(0);
    setNativeCurrentTime("0:00");
  }, [activeWorkId]);

  // Track native video updates
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 1;
      setNativeProgress((current / total) * 100);
      setNativeCurrentTime(formatTime(current));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setNativeDuration(formatTime(videoRef.current.duration));
    }
  };

  const handleNativeVideoEnd = () => {
    setIsPlayingNative(false);
    setNativeProgress(0);
  };

  const toggleNativePlay = () => {
    if (videoRef.current) {
      if (isPlayingNative) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.log("Video play error:", err));
      }
      setIsPlayingNative(!isPlayingNative);
    }
  };

  const toggleNativeMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !nativeMuted;
      setNativeMuted(!nativeMuted);
    }
  };

  const handleNativeScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = clickX / width;
      const newTime = percentage * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setNativeProgress(percentage * 100);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Change active video and smooth scroll up to player if clicked from below
  const handleSelectWork = (id: string) => {
    setActiveWorkId(id);
    if (playerSectionRef.current) {
      playerSectionRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/#work?id=${activeWork.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const handleNextWork = () => {
    if (currentWorkIndex < translatedWorks.length - 1) {
      setActiveWorkId(translatedWorks[currentWorkIndex + 1].id);
    } else {
      setActiveWorkId(translatedWorks[0].id); // loop
    }
  };

  const handlePrevWork = () => {
    if (currentWorkIndex > 0) {
      setActiveWorkId(translatedWorks[currentWorkIndex - 1].id);
    } else {
      setActiveWorkId(translatedWorks[translatedWorks.length - 1].id); // loop
    }
  };

  const isVerticalRatio = activeWork.tags.some(tag => 
    tag.toLowerCase().includes("vertical") || tag.toLowerCase().includes("reels")
  );

  const workDesc = language === "ar"
    ? "مساحة عرض تفاعلية لأحدث أعمالنا السينمائية الفاخرة. استمتع بمشاهدة الفيديوهات مباشرة ودراسة تفاصيل كل مشروع من الفكرة إلى الإنتاج."
    : language === "fr"
    ? "Un espace de projection interactif pour nos dernières créations. Regardez les vidéos directement sur place et explorez les coulisses de chaque projet, de l'idée à la livraison."
    : "An interactive screening suite designed to display our cinematic works directly. Seamlessly toggle between films, explore production briefs, challenge maps, and creative credits in real-time.";

  return (
    <section id="work" className="py-24 bg-slate-950 border-t border-zinc-900/40 relative scroll-mt-24">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-gold-950/10 rounded-full filter blur-[120px] opacity-40"></div>
        <div className="absolute bottom-1/3 left-10 w-80 h-80 bg-blue-950/10 rounded-full filter blur-[100px] opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs text-gold-500 uppercase tracking-[0.3em] block mb-3">
            {t("work_latest_work")}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 uppercase">
            {t("work_crafted_moments")}
          </h2>
          <div className="h-0.5 w-12 bg-gold-500 mx-auto rounded-full"></div>
        </motion.div>

        {/* ================= PORTFOLIO PROJECT GALLERY GRID ================= */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-8 border-b border-zinc-900 pb-4">
            <div>
              <span className="font-mono text-[10px] text-gold-500 uppercase tracking-widest block mb-1">
                PORTFOLIO
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                {selectedCategory === "all"
                  ? (language === "ar" ? "جميع المشاريع والإنتاجات" : language === "fr" ? "Toutes Nos Réalisations" : "All Productions & Works")
                  : (selectedCategory.toUpperCase())
                }
              </h3>
            </div>
            <span className="font-mono text-xs text-zinc-500">
              {filteredWorks.length} {filteredWorks.length === 1 ? "PROJECT" : "PROJECTS"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorks.map((work) => {
              const isSelected = work.id === activeWorkId;
              return (
                <motion.div
                  key={work.id}
                  onClick={() => handleSelectWork(work.id)}
                  whileHover={{ y: -4 }}
                  className={`group relative bg-slate-900/40 rounded-2xl border overflow-hidden cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? "border-gold-500/80 shadow-xl shadow-gold-500/10 ring-1 ring-gold-500/40"
                      : "border-zinc-900 hover:border-zinc-800"
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="relative aspect-video w-full bg-black overflow-hidden">
                    <img
                      src={work.visualStill}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.includes('maxresdefault.jpg')) {
                          target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                        } else if (!target.src.includes('unsplash.com')) {
                          target.src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80";
                        } else {
                          target.onerror = null;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    
                    {/* Top Category Badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-black/70 border border-white/10 font-mono text-[9px] text-zinc-300 uppercase tracking-widest backdrop-blur-md">
                        {work.category}
                      </span>
                    </div>

                    {/* Play/Eye Icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-gold-500 text-slate-950 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        {work.category === "photography" ? (
                          <Camera className="w-5 h-5 stroke-[2.5]" />
                        ) : (
                          <Play className="w-5 h-5 fill-current translate-x-0.5" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-4 sm:p-5">
                    <span className="font-mono text-[9px] text-gold-500 uppercase tracking-widest block mb-1">
                      {work.client} &bull; {work.year}
                    </span>
                    <h4 className="font-display text-base font-bold text-white group-hover:text-gold-400 transition-colors line-clamp-1 uppercase">
                      {work.title}
                    </h4>
                    <p className="text-zinc-400 text-xs font-light leading-relaxed mt-2 line-clamp-2">
                      {work.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-zinc-900/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>{work.camera}</span>
                      <span className="text-zinc-400 font-medium">{work.duration}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ================= FULL SCREEN DEEP CINEMA THEATER MODE ================= */}
      <AnimatePresence>
        {isTheaterMode && (
          <motion.div 
            className="fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-8 bg-slate-950/98 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header Control Deck */}
            <div className={`flex items-center justify-between max-w-7xl mx-auto w-full z-10 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <div className={dir === "rtl" ? "text-right" : "text-left"}>
                <span className="font-mono text-[9px] text-gold-500 uppercase tracking-widest block mb-1">
                  {activeWork.category.replace("-", " ")}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                  {activeWork.title}
                </h3>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-gold-500/30 text-xs font-mono text-white flex items-center gap-2 transition-all cursor-pointer relative"
                >
                  <Share2 className="w-4 h-4" />
                  SHARE REVIEW
                  {isCopied && (
                    <span className="absolute -bottom-8 right-0 bg-slate-950 border border-zinc-800 text-[9px] font-mono text-emerald-400 px-2 py-0.5 rounded uppercase whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setIsTheaterMode(false)}
                  className="w-11 h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 hover:border-red-500/30 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                  title="Close Theater Mode"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Expanded Cinematic Player Stage */}
            <div className="max-w-7xl mx-auto w-full flex-1 my-8 flex items-center justify-center relative">
              <div className={`w-full max-h-[75vh] rounded-3xl overflow-hidden bg-black border border-zinc-900 shadow-2xl relative ${
                isVerticalRatio ? "max-w-[420px] aspect-[9/16]" : "aspect-video"
              }`}>
                {activeWork.youtubeId ? (
                  <iframe
                    className="w-full h-full border-0"
                    src={`https://www.youtube.com/embed/${activeWork.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={activeWork.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : activeWork.videoUrl ? (
                  <video
                    src={activeWork.videoUrl}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <img
                    src={activeWork.visualStill}
                    alt={activeWork.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src.includes('maxresdefault.jpg')) {
                        target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                      } else if (!target.src.includes('unsplash.com')) {
                        target.src = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80";
                      } else {
                        target.onerror = null;
                      }
                    }}
                  />
                )}
              </div>
            </div>

            {/* Immersive Footer Case Briefing bar */}
            <div className="max-w-7xl mx-auto w-full z-10 border-t border-zinc-900/60 pt-6 flex flex-col md:flex-row justify-between gap-4">
              <div className="max-w-2xl text-left">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">
                  DIRECTOR BRIEF & SPECIFICATION
                </span>
                <p className="text-zinc-400 text-xs sm:text-sm font-light leading-relaxed">
                  {activeWork.description}
                </p>
              </div>

              <div className="flex gap-4 items-center shrink-0">
                <div className="text-right">
                  <span className="block font-mono text-[8px] text-zinc-500 uppercase leading-none mb-1">OPTICAL PACKAGE</span>
                  <span className="text-zinc-300 text-xs font-mono font-bold uppercase">{activeWork.camera}</span>
                </div>
                <div className="h-6 w-[1px] bg-zinc-900"></div>
                <div className="text-right">
                  <span className="block font-mono text-[8px] text-zinc-500 uppercase leading-none mb-1">DURATION</span>
                  <span className="text-gold-400 text-xs font-mono font-bold">{activeWork.duration}</span>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
