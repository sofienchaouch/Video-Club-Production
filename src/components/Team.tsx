import React from "react";
import { TEAM_MEMBERS, sofieneImage, hazemImage } from "../data/agencyData";
import { Award } from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion } from "motion/react";

export default function Team() {
  const { t, data, dir, agencySettings } = useApp();

  const customTeam = agencySettings?.customTeam || [];

  const translatedTeam = [
    ...TEAM_MEMBERS.map((member) => {
      const customMem = customTeam.find((ct: any) => ct.id === member.id);
      const trans = data.team.find((tm) => tm.id === member.id);
      const base = customMem ? { ...member, ...customMem } : member;
      return {
        ...base,
        name: customMem?.name || trans?.name || member.name,
        role: customMem?.role || trans?.role || member.role,
        bio: customMem?.bio || trans?.bio || member.bio,
        specialties: customMem?.specialties || trans?.specialties || member.specialties,
        selectedWorks: customMem?.selectedWorks || trans?.selectedWorks || member.selectedWorks,
        image: agencySettings?.teamImages?.[member.id] || customMem?.image || member.image,
      };
    }),
    ...customTeam.filter((ct: any) => !TEAM_MEMBERS.some((tm) => tm.id === ct.id))
  ];

  return (
    <section id="roster" className="py-24 bg-slate-900 border-t border-zinc-900/60 relative scroll-mt-24">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] lens-flare-gold rounded-full filter blur-3xl opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs text-gold-500 uppercase tracking-widest block mb-3">
            {t("team_architects")}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 uppercase">
            {t("team_roster_title")}
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto rounded-full mb-6"></div>
          <p className="text-zinc-400 text-base sm:text-lg font-light leading-relaxed">
            {t("team_roster_desc")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-10">
          {translatedTeam.map((member, i) => (
            <motion.div
              key={member.id}
              className="bg-slate-950 rounded-2xl overflow-hidden border border-zinc-900 group shadow-2xl flex flex-col justify-between"
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <div>
                {/* Photo Headshot with Zoom */}
                <div className="h-80 overflow-hidden relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-103 filter grayscale group-hover:grayscale-0 contrast-110 saturate-90"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = member.id === "hazem" ? hazemImage : sofieneImage;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent opacity-80"></div>
                  <div className={`absolute bottom-4 ${dir === "rtl" ? "right-4" : "left-4"}`}>
                    <span className="px-2.5 py-1 bg-gold-500 text-slate-950 font-display font-bold text-[9px] tracking-widest uppercase rounded">
                      {member.role.includes(" / ") ? member.role.split(" / ")[0] : (member.role.includes(" & ") ? member.role.split(" & ")[0] : member.role)}
                    </span>
                  </div>
                </div>

                {/* Bio Description */}
                <div className={`p-6 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                  <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight mb-2">
                    {member.name}
                  </h3>
                  <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-wider mb-4">
                    {member.role}
                  </span>
                  <p className="text-zinc-350 text-xs font-light leading-relaxed mb-6">
                    {member.bio}
                  </p>

                  {/* Specialties Tags */}
                  <div className="space-y-4">
                    <div>
                      <span className={`block font-mono text-[8px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                        <Award className="w-3 h-3 text-gold-500" />
                        {t("team_creative_signature")}
                      </span>
                      <div className={`flex flex-wrap gap-1 ${dir === "rtl" ? "justify-end" : ""}`}>
                        {member.specialties.map((spec, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 bg-zinc-900 rounded text-[9px] text-zinc-400 border border-zinc-850"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Work credit line */}
              <div className={`p-4 bg-zinc-950/80 border-t border-zinc-900/60 flex items-center justify-between text-[10px] ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <span className="text-zinc-500 font-mono uppercase">{t("team_featured_works")}:</span>
                <span className="text-gold-400 font-medium tracking-wide uppercase truncate max-w-[180px]">
                  {member.selectedWorks.join(", ")}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
