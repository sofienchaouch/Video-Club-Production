import React from "react";
import { CAPABILITIES } from "../data/agencyData";
import { Sparkles, Sliders, Film, Camera, Shield, Mic } from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion } from "motion/react";

export default function Capabilities() {
  const { t, data } = useApp();

  // Merge image URLs and IDs from raw data with translated metadata
  const translatedCapabilities = CAPABILITIES.map((cap, i) => {
    const trans = data.capabilities[i];
    return {
      ...cap,
      title: trans?.title || cap.title,
      subtitle: trans?.subtitle || cap.subtitle,
      description: trans?.description || cap.description,
      bullets: trans?.bullets || cap.bullets,
    };
  });

  return (
    <section id="capabilities" className="py-24 bg-slate-900 border-t border-zinc-900/60 relative scroll-mt-24">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] lens-flare-blue rounded-full filter blur-3xl opacity-15"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Capabilities Section Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs text-gold-500 uppercase tracking-widest block mb-3">
            {t("team_workflow")}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 uppercase">
            {t("team_capabilities_title")}
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto rounded-full mb-6"></div>
          <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed">
            {t("team_capabilities_desc")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {translatedCapabilities.map((cap, i) => {
            const icons = [Film, Sliders, Mic, Camera, Sparkles];
            const Icon = icons[i] || Shield;
            return (
              <motion.div
                key={i}
                className="bg-slate-950/80 backdrop-blur-md rounded-2xl p-6 border border-zinc-900 hover:border-gold-500/20 transition-all duration-300 shadow-2xl relative group flex flex-col justify-between"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500/0 via-gold-500/40 to-gold-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div>
                  <div className="w-12 h-12 rounded-xl bg-gold-950/40 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-6 group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-5 h-5 stroke-[1.5]" />
                  </div>

                  <span className="block font-mono text-[11px] text-zinc-400 uppercase tracking-widest leading-none mb-1">
                    0{i + 1} &bull; {cap.subtitle}
                  </span>
                  
                  <h3 className="font-display text-base font-bold text-white uppercase tracking-wider mb-4">
                    {cap.title}
                  </h3>

                  <p className="text-zinc-350 text-sm font-normal leading-relaxed mb-6">
                    {cap.description}
                  </p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-zinc-900/40">
                  {cap.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-zinc-300 text-xs sm:text-sm font-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 mt-1.5 shrink-0 opacity-80"></span>
                      <span className="leading-tight">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
