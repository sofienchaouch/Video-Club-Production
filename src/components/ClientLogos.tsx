import React from "react";
import { motion } from "motion/react";
import { useApp } from "../context/AppContext";
import { formatGoogleDriveLink } from "../utils/googleDrive";

export default function ClientLogos() {
  const { agencySettings, t, dir } = useApp();

  // Define the client logos as beautiful, crisp, custom SVGs that represent the user's uploaded images
  const logos = [
    {
      name: "HA Power Academy",
      id: "hpa",
      svg: (
        <svg viewBox="0 0 280 100" className="w-full h-full">
          <defs>
            <g id="gothic-h">
              {/* Left Stem */}
              <path 
                d="M 30,5 C 22,5 18,12 16,22 L 6,62 C 4,70 1,75 0,75 L 10,75 C 13,75 15,70 17,62 L 27,22 C 29,12 32,5 34,5 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinejoin="round" 
              />
              {/* Right Stem */}
              <path 
                d="M 52,15 C 44,15 40,22 38,32 L 28,72 C 26,80 23,85 22,85 L 32,85 C 35,85 37,80 39,72 L 49,32 C 51,22 54,15 56,15 Z" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinejoin="round" 
              />
              {/* Crossbar */}
              <path 
                d="M 21,45 L 39,49" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />
            </g>
          </defs>
          
          {/* 3 Cascading Gothic H symbols */}
          <g className="text-white/30 group-hover:text-white transition-colors duration-500">
            <use href="#gothic-h" transform="translate(10, 5)" className="opacity-60" />
            <use href="#gothic-h" transform="translate(32, 17)" className="opacity-80" />
            <use href="#gothic-h" transform="translate(54, 29)" className="opacity-100" />
          </g>

          {/* Outline Texts */}
          <g className="text-white/40 group-hover:text-white transition-colors duration-500">
            <text 
              x="125" 
              y="50" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinejoin="round" 
              className="font-sans font-black italic text-[28px] tracking-[0.05em] uppercase"
            >
              POWER
            </text>
            <text 
              x="125" 
              y="80" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinejoin="round" 
              className="font-sans font-black italic text-[28px] tracking-[0.05em] uppercase"
            >
              ACADEMY
            </text>
          </g>
        </svg>
      )
    },
    {
      name: "BurdaBleau",
      id: "burda",
      svg: (
        <svg viewBox="0 0 260 80" className="w-full h-full">
          {/* Interlocking rounded squares/rings */}
          {/* Blue ring */}
          <rect x="5" y="10" width="55" height="55" rx="18" fill="none" strokeWidth="6" className="text-zinc-600 group-hover:text-sky-500 transition-colors duration-300" />
          {/* Red ring */}
          <rect x="40" y="10" width="55" height="55" rx="18" fill="none" strokeWidth="6" className="text-zinc-600 group-hover:text-red-500 transition-colors duration-300" />
          {/* Interlocking mask effect or overlapping stroke to show link */}
          <path d="M40 28 A 18 18 0 0 1 58 10" fill="none" strokeWidth="6" className="text-zinc-600 group-hover:text-red-500 transition-colors duration-300" />
          {/* BurdaBleau Text */}
          <text x="105" y="46" className="font-sans font-black tracking-tight text-2xl fill-white">BurdaBleau</text>
        </svg>
      )
    },
    {
      name: "Control F Expertises",
      id: "controlf",
      svg: (
        <svg viewBox="0 0 260 80" className="w-full h-full">
          {/* Intersecting loop cursor logo */}
          <g className="text-white group-hover:text-indigo-400 transition-colors duration-300" stroke="currentColor" strokeWidth="4.5" fill="none">
            <path d="M25 22 H55 V52 H25 Z" />
            <path d="M38 34 H68 V64 H38 Z" />
          </g>
          {/* Text: Control F */}
          <text x="85" y="38" className="font-sans font-black tracking-wide text-lg fill-white">CONTROL F</text>
          <text x="85" y="56" className="font-mono tracking-widest text-xs fill-zinc-400 uppercase">Expertises</text>
        </svg>
      )
    },
    {
      name: "CFJJB",
      id: "cfjjb",
      svg: (
        <svg viewBox="0 0 280 80" className="w-full h-full">
          {/* CFJJB Bold Italic text */}
          <text x="10" y="52" className="font-sans font-black italic tracking-tighter text-4xl fill-white">CFJJB</text>
          {/* Hexagonal flag emblem */}
          <g transform="translate(170, 10)">
            {/* Hexagon background border */}
            <polygon points="30,0 60,17 60,52 30,70 0,52 0,17" fill="none" strokeWidth="4" className="text-zinc-500 group-hover:text-white transition-colors duration-300" />
            {/* Split background fields (blue left, red right) */}
            <polygon points="30,2 58,18 58,51 30,68" className="text-zinc-700 group-hover:fill-red-600 transition-colors duration-300" />
            <polygon points="30,2 2,18 2,51 30,68" className="text-zinc-800 group-hover:fill-blue-700 transition-colors duration-300" />
            {/* Central white hexagon */}
            <polygon points="30,22 43,30 43,45 30,53 17,45 17,30" className="fill-white" />
          </g>
        </svg>
      )
    },
    {
      name: "Orfeo Paris",
      id: "orfeo",
      svg: (
        <svg viewBox="0 0 200 80" className="w-full h-full">
          {/* Lyre Harp Icon */}
          <path 
            d="M30 15 C30 35, 45 45, 55 45 C65 45, 80 35, 80 15 M38 10 L38 43 M55 10 L55 45 M72 10 L72 43 M25 15 C20 15, 18 22, 24 25 C30 28, 32 15, 30 15 M85 15 C90 15, 92 22, 86 25 C80 28, 78 15, 80 15" 
            fill="none" 
            strokeWidth="3.5" 
            strokeLinecap="round"
            className="text-white group-hover:text-amber-300 transition-colors duration-300" 
          />
          {/* Orfeo Paris text in elegant serif */}
          <text x="100" y="40" className="font-serif tracking-widest text-xl fill-white">ORFEO</text>
          <text x="115" y="55" className="font-sans tracking-[0.3em] text-[10px] fill-zinc-400 uppercase">Paris</text>
        </svg>
      )
    },
    {
      name: "Winsoft Informatique",
      id: "winsoft",
      svg: (
        <svg viewBox="0 0 280 80" className="w-full h-full">
          {/* Origami wireframe W */}
          <g stroke="currentColor" strokeWidth="2" fill="none" className="text-zinc-500 group-hover:text-teal-400 transition-colors duration-300">
            <path d="M10 20 L25 55 L40 20 L55 55 L70 20" />
            <path d="M10 20 L40 20 L70 20" />
            <path d="M25 55 L55 55" />
            <path d="M10 20 L55 55" />
            <path d="M40 20 L25 55" />
            <path d="M40 20 L55 55" />
            <path d="M70 20 L25 55" />
          </g>
          {/* Separator Line */}
          <line x1="85" y1="15" x2="85" y2="60" stroke="#3f3f46" strokeWidth="2" />
          {/* Text: WINSOFT */}
          <text x="98" y="38" className="font-sans font-light tracking-[0.15em] text-xl fill-white">WINSOFT</text>
          <text x="98" y="54" className="font-sans font-medium tracking-[0.22em] text-[9px] fill-zinc-400 uppercase">INFORMATIQUE</text>
        </svg>
      )
    },
    {
      name: "Win Worth It Nutrition",
      id: "win_nutrition",
      svg: (
        <svg viewBox="0 0 280 80" className="w-full h-full">
          {/* Bold slash-cut WIN */}
          <g className="text-white group-hover:text-emerald-400 transition-colors duration-300" fill="currentColor">
            {/* W */}
            <path d="M15 15 L25 15 L32 45 L39 15 L49 15 L42 55 L32 55 Z" />
            <path d="M38 15 L48 15 L55 45 L62 15 L72 15 L65 55 L55 55 Z" />
            {/* I */}
            <path d="M78 15 L88 15 L88 55 L78 55 Z" />
            {/* N */}
            <path d="M95 15 L106 15 L121 42 L121 15 L131 15 L131 55 L120 55 L105 28 L105 55 L95 55 Z" />
          </g>
          {/* Text: Worth It Nutrition */}
          <text x="15" y="70" className="font-sans font-black tracking-[0.25em] text-[10px] fill-zinc-400 uppercase">WORTH IT NUTRITION</text>
        </svg>
      )
    },
    {
      name: "Elyssar",
      id: "elyssar",
      svg: (
        <svg viewBox="0 0 240 80" className="w-full h-full">
          {/* Mediterranean Queen Crown & Laurel motif */}
          <g className="text-white group-hover:text-amber-400 transition-colors duration-300">
            <path d="M20 48 L28 20 L40 38 L52 20 L60 48 Z" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            <circle cx="28" cy="16" r="2.5" fill="currentColor" />
            <circle cx="40" cy="30" r="2.5" fill="currentColor" />
            <circle cx="52" cy="16" r="2.5" fill="currentColor" />
            <path d="M15 54 C30 62 50 62 65 54" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </g>
          {/* Text: ELYSSAR */}
          <text x="80" y="44" className="font-serif font-bold tracking-[0.25em] text-2xl fill-white">ELYSSAR</text>
          <text x="82" y="58" className="font-sans font-medium tracking-[0.35em] text-[8px] fill-amber-400/90 uppercase">HAUTE MAISON</text>
        </svg>
      )
    },
    {
      name: "Cartagina",
      id: "cartagina",
      svg: (
        <svg viewBox="0 0 260 80" className="w-full h-full">
          {/* Carthaginian Column & Sun Emblem */}
          <g className="text-white group-hover:text-gold-400 transition-colors duration-300">
            <rect x="20" y="20" width="30" height="36" rx="3" fill="none" stroke="currentColor" strokeWidth="2.5" />
            <line x1="28" y1="20" x2="28" y2="56" stroke="currentColor" strokeWidth="2" />
            <line x1="35" y1="20" x2="35" y2="56" stroke="currentColor" strokeWidth="2" />
            <line x1="42" y1="20" x2="42" y2="56" stroke="currentColor" strokeWidth="2" />
            <circle cx="35" cy="12" r="4" fill="currentColor" />
          </g>
          {/* Text: CARTAGINA */}
          <text x="70" y="42" className="font-sans font-black tracking-[0.2em] text-xl fill-white">CARTAGINA</text>
          <text x="72" y="56" className="font-mono font-medium tracking-[0.3em] text-[8px] fill-zinc-400 uppercase">HERITAGE & PRODUCTION</text>
        </svg>
      )
    },
    {
      name: "Auguste",
      id: "auguste",
      svg: (
        <svg viewBox="0 0 240 80" className="w-full h-full">
          {/* Monogram A with Imperial Crescent */}
          <g className="text-white group-hover:text-amber-300 transition-colors duration-300">
            <path d="M22 55 L38 18 L54 55" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M28 42 H48" stroke="currentColor" strokeWidth="2" />
            <circle cx="38" cy="10" r="3" fill="currentColor" />
          </g>
          {/* Text: AUGUSTE */}
          <text x="70" y="44" className="font-serif font-semibold tracking-[0.3em] text-2xl fill-white">AUGUSTE</text>
          <text x="72" y="58" className="font-sans font-light tracking-[0.4em] text-[8px] fill-zinc-400 uppercase">STUDIO & STYLE</text>
        </svg>
      )
    }
  ];

  const customLogos = agencySettings?.partnerLogos || [];
  const activeLogos = customLogos.length > 0
    ? customLogos.map((cl: any) => ({
        id: cl.id || String(Math.random()),
        name: cl.name || "Partner",
        content: cl.url ? (
          <img
            src={formatGoogleDriveLink(cl.url, 'image')}
            alt={cl.name}
            className="max-h-8 sm:max-h-10 max-w-[140px] sm:max-w-[160px] object-contain opacity-40 group-hover:opacity-100 transition-all duration-300 filter grayscale brightness-200"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="font-display font-black tracking-widest text-xs text-zinc-500 group-hover:text-gold-400 transition-colors uppercase">
            {cl.name}
          </span>
        )
      }))
    : logos.map((l: any) => ({
        id: l.id,
        name: l.name,
        content: l.svg
      }));

  // For infinite scroll marquee, we duplicate the logos to make a seamless loop
  const duplicatedLogos = [...activeLogos, ...activeLogos, ...activeLogos];

  return (
    <section id="clients" className="relative py-16 bg-slate-950 border-t border-b border-zinc-900/60 overflow-hidden">
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/40 to-slate-950 pointer-events-none z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 0.5, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono tracking-[0.3em] text-zinc-400 uppercase"
        >
          {t("trusted_by")}
        </motion.p>
      </div>

      {/* Scrolling Marquee Container */}
      <motion.div 
        className="relative w-full flex overflow-x-hidden"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        {/* Left Fade Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-950 to-transparent z-20 pointer-events-none"></div>
        {/* Right Fade Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-950 to-transparent z-20 pointer-events-none"></div>

        {/* Marquee Row */}
        <motion.div
          className="flex space-x-12 sm:space-x-16 shrink-0 py-4 items-center"
          animate={{
            x: dir === "rtl" ? ["-33.33%", "0%"] : ["0%", "-33.33%"],
          }}
          transition={{
            ease: "linear",
            duration: 32,
            repeat: Infinity,
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="group flex items-center justify-center h-10 sm:h-12 w-[160px] sm:w-[190px] text-zinc-550 hover:text-white transition-all duration-300 filter grayscale contrast-125 hover:grayscale-0 hover:contrast-100 transform hover:scale-105"
              title={logo.name}
            >
              <div className="w-full h-full flex items-center justify-center">
                {logo.content}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
