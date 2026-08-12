import React, { useState } from "react";
import { PhoneCall, Phone, MessageCircle, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";

export default function FloatingCallButton() {
  const { language, dir, agencySettings } = useApp();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const phoneNum = agencySettings?.contactInfo?.phone || "(+216) 54 610 546";
  const telLink = `tel:${agencySettings?.contactInfo?.phoneTel || "+21654610546"}`;
  const whatsappLink = agencySettings?.contactInfo?.whatsapp || "https://wa.me/21654610546?text=Bonjour%20Video%20Club%20Production";

  const callLabel = language === "ar"
    ? "اتصل بنا الآن"
    : language === "fr"
    ? "Appeler VCP Direct"
    : "Call VCP Directly";

  const subLabel = language === "ar"
    ? "فريق الإنتاج في الخدمة"
    : language === "fr"
    ? "Studio & Production Direct"
    : "Studio Production Hotline";

  return (
    <>
      {/* Floating Action Phone Button */}
      <div 
        className={`fixed bottom-6 ${dir === "rtl" ? "right-6" : "left-6"} z-40 flex items-center gap-3`}
      >
        <div className="relative group">
          {/* Subtle pulse ring behind button */}
          <span className="absolute -inset-1.5 rounded-full bg-gold-400/40 animate-ping opacity-75"></span>
          
          <button
            onClick={() => setIsOpenModal(!isOpenModal)}
            className="relative w-14 h-14 rounded-full bg-gradient-to-br from-gold-400 via-gold-500 to-amber-600 text-slate-950 shadow-2xl shadow-gold-500/30 border border-white/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group/btn"
            title={callLabel}
            aria-label="Call Video Club Production"
          >
            <PhoneCall className="w-6 h-6 stroke-[2.2] animate-bounce-short" />
            
            {/* Tooltip badge on hover */}
            <span className={`absolute top-1/2 -translate-y-1/2 ${dir === "rtl" ? "right-full mr-3" : "left-full ml-3"} px-3 py-1.5 rounded-xl bg-slate-950/90 border border-gold-500/30 text-white font-mono text-xs uppercase tracking-wider whitespace-nowrap shadow-xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none backdrop-blur-md`}>
              {callLabel}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Phone Call Dialog Modal */}
      <AnimatePresence>
        {isOpenModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`fixed bottom-24 ${dir === "rtl" ? "right-6" : "left-6"} z-50 w-80 bg-slate-950/95 border border-gold-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-xl ${dir === "rtl" ? "text-right" : "text-left"}`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-900 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-xs font-black text-white uppercase tracking-wider">
                    VIDEO CLUB PRODUCTION
                  </h4>
                  <span className="font-mono text-[9px] text-zinc-400 block">
                    {subLabel}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsOpenModal(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-zinc-300 text-xs leading-relaxed mb-4">
              {language === "ar"
                ? "تواصل مباشرة مع فريق الإخراج والإنتاج لمناقشة مشروعك السينمائي:"
                : language === "fr"
                ? "Contactez directement notre équipe de production pour échanger sur vos projets :"
                : "Connect directly with our producers and executive crew:"}
            </p>

            <div className="space-y-2.5">
              {/* Direct Phone Call Button */}
              <a
                href={telLink}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-gold-500/20 hover:brightness-110 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4 fill-current" />
                {phoneNum}
              </a>

              {/* WhatsApp Quick Chat */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Direct Chat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
