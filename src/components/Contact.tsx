import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Check, Instagram, Youtube, MessageCircle, HelpCircle, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion } from "motion/react";

export default function Contact() {
  const { language, t, dir, agencySettings } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "Commercial",
    timeline: "1-3 months",
    budget: "30k - 100k TND",
    message: "",
  });

  const [isSent, setIsSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) return;

    setIsSending(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "contact",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          projectType: formData.projectType,
          timeline: formData.timeline,
          budget: formData.budget,
          message: formData.message
        })
      });

      if (response.ok) {
        setIsSent(true);
      } else {
        const errData = await response.json();
        setErrorMessage(errData.error || "Failed to submit inquiry.");
      }
    } catch (err) {
      console.error("Failed to submit contact form:", err);
      setIsSent(true);
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      projectType: "Commercial",
      timeline: "1-3 months",
      budget: "30k - 100k TND",
      message: "",
    });
    setErrorMessage("");
    setIsSent(false);
  };

  // Localized general texts
  const historyTag = language === "ar" ? "دعنا نصنع التاريخ معاً" : language === "fr" ? "ÉCRIVONS L'HISTOIRE ENSEMBLE" : "LET'S CREATE HISTORY";
  const pitchTitle = language === "ar" ? "تواصل معنا" : language === "fr" ? "CONTACTEZ-NOUS" : "CONTACT US";
  const visionTitle = language === "ar" ? "رؤيتك الفنية" : language === "fr" ? "VOTRE VISION" : "YOUR VISION";
  const descriptionBody = language === "ar"
    ? "سواء كان لديك سيناريو متكامل أو مجرد شرارة لفكرة فنية، نحن نريد التعاون معك. تواصل معنا لترتيب لقاء خاص أو استشارة إبداعية للتطوير."
    : language === "fr"
    ? "Que vous ayez un scénario déjà structuré ou simplement l'étincelle d'un concept artistique, nous voulons collaborer. Contactez-nous pour planifier un briefing privé."
    : "Whether you have a fully formed screenplay treatment or just a spark of an artistic concept, we want to collaborate. Get in touch to schedule a private briefing or creative consultation.";

  const addressLabel = language === "ar" ? "عنوان الاستوديو" : language === "fr" ? "ADRESSE DU STUDIO" : "STUDIO ADDRESS";
  const phoneLabel = language === "ar" ? "الاستقبال الهاتفي" : language === "fr" ? "ACCUEIL TÉLÉPHONIQUE" : "PHONE RECEPTION";
  const representationLabel = language === "ar" ? "الاتصال المباشر" : language === "fr" ? "REPRÉSENTATION DIRECTE" : "DIRECT REPRESENTATION";
  const findOnlineLabel = language === "ar" ? "تجدنا على الإنترنت" : language === "fr" ? "SUIVEZ-NOUS EN LIGNE" : "FIND US ONLINE";

  return (
    <section id="contact" className="py-24 bg-slate-950 border-t border-zinc-900/60 relative">
      {/* Background radial spotlights */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-10 left-10 w-96 h-96 lens-flare rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center`}>
          {/* Left Side: Agency Pitch Information (5 cols) */}
          <motion.div 
            className={`lg:col-span-5 space-y-8 ${dir === "rtl" ? "text-right" : "text-left"}`}
            initial={{ opacity: 0, x: dir === "rtl" ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div>
              <span className="font-mono text-xs text-gold-500 uppercase tracking-widest block mb-3">
                {historyTag}
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight mb-6">
                {pitchTitle}
              </h2>
              <div className={`h-1 w-12 bg-gold-400 rounded-full mb-6 ${dir === "rtl" ? "ms-auto" : ""}`}></div>
              <p className="text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
                {descriptionBody}
              </p>
            </div>

            {/* Address cards */}
            <div className="space-y-4">
              <a
                href="https://maps.app.goo.gl/wpghGfG57A8rkCd2A"
                target="_blank"
                rel="noreferrer"
                className={`flex gap-4 items-center bg-zinc-900/40 hover:bg-zinc-900/85 p-4 rounded-xl border border-zinc-900 hover:border-gold-500/30 transition-all duration-300 group cursor-pointer ${dir === "rtl" ? "flex-row-reverse text-right" : "text-left"}`}
              >
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <MapPin className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest leading-none mb-1">
                    {addressLabel}
                  </span>
                  <span className="text-zinc-300 text-xs font-light group-hover:text-white transition-colors duration-300 block truncate">
                    {language === "ar" ? "24 نهج خليج القمر، النصر 2، أريانة 2037، تونس" : "24 Rue Khalij El Kamar, Ennasr 2, Ariana 2037, Tunisia"}
                  </span>
                </div>
              </a>

              <div className={`flex gap-4 items-center bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 ${dir === "rtl" ? "flex-row-reverse text-right" : "text-left"}`}>
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                  <Phone className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest leading-none mb-1">
                    {phoneLabel}
                  </span>
                  <a
                    href={`tel:${agencySettings?.contactInfo?.phoneTel || "+21654610546"}`}
                    className="text-gold-400 text-xs font-semibold hover:underline"
                    style={{ direction: "ltr", display: "inline-block" }}
                  >
                    {agencySettings?.contactInfo?.phone || "(+216) 54 610 546"}
                  </a>
                </div>
              </div>

              <div className={`flex gap-4 items-center bg-zinc-900/40 p-4 rounded-xl border border-zinc-900 ${dir === "rtl" ? "flex-row-reverse text-right" : "text-left"}`}>
                <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                  <Mail className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div>
                  <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest leading-none mb-1">
                    {representationLabel}
                  </span>
                  <a
                    href={`mailto:${agencySettings?.contactInfo?.email || "videoclubproduction11@gmail.com"}`}
                    className="text-gold-400 text-xs font-semibold hover:underline"
                  >
                    {agencySettings?.contactInfo?.email || "videoclubproduction11@gmail.com"}
                  </a>
                </div>
              </div>
            </div>

            {/* Social media connections */}
            <div className="pt-4 border-t border-zinc-900">
              <span className="block font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-3">
                {findOnlineLabel}
              </span>
              <div className={`flex flex-wrap gap-3 ${dir === "rtl" ? "justify-start flex-row-reverse" : ""}`}>
                <a
                  href="https://www.instagram.com/video.club.prod"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-gold-500/40 text-zinc-300 hover:text-white flex items-center gap-2.5 text-xs font-medium transition-all duration-300 hover:bg-zinc-850"
                >
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.youtube.com/@VideoClubProduction-e6u7p"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-gold-500/40 text-zinc-300 hover:text-white flex items-center gap-2.5 text-xs font-medium transition-all duration-300 hover:bg-zinc-850"
                >
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span>YouTube</span>
                </a>
                <a
                  href="https://wa.me/21654610546"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-850 hover:border-gold-500/40 text-zinc-300 hover:text-white flex items-center gap-2.5 text-xs font-medium transition-all duration-300 hover:bg-zinc-850"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Inquiry Form Panel (7 cols) */}
          <motion.div 
            className="lg:col-span-7"
            initial={{ opacity: 0, x: dir === "rtl" ? -40 : 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="bg-slate-900 border border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
              {!isSent ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className={`block text-[10px] font-mono text-zinc-500 uppercase tracking-wider ${dir === "rtl" ? "text-right" : "text-left"}`}>
                        {t("contact_form_name")}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={language === "ar" ? "رؤوف بن عمر" : language === "fr" ? "Jean-Luc Godard" : "Christopher Nolan"}
                        className={`w-full bg-zinc-950 border border-zinc-850 focus:border-gold-500 rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-zinc-700 focus:outline-none transition-colors ${dir === "rtl" ? "text-right" : "text-left"}`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={`block text-[10px] font-mono text-zinc-500 uppercase tracking-wider ${dir === "rtl" ? "text-right" : "text-left"}`}>
                        {t("contact_form_email")}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="cinema@videoclub.tn"
                        className={`w-full bg-zinc-950 border border-zinc-850 focus:border-gold-500 rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-zinc-700 focus:outline-none transition-colors ${dir === "rtl" ? "text-right" : "text-left"}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1">
                      <label className={`block text-[10px] font-mono text-zinc-500 uppercase tracking-wider ${dir === "rtl" ? "text-right" : "text-left"}`}>
                        {t("contact_form_phone")}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+216 54 610 546"
                        className={`w-full bg-zinc-950 border border-zinc-850 focus:border-gold-500 rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-zinc-700 focus:outline-none transition-colors ${dir === "rtl" ? "text-right" : "text-left"}`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className={`block text-[10px] font-mono text-zinc-500 uppercase tracking-wider ${dir === "rtl" ? "text-right" : "text-left"}`}>
                        {t("contact_form_company")}
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder={language === "ar" ? "مثال: هاتف / مستقل" : "e.g. Independant / Brand"}
                        className={`w-full bg-zinc-950 border border-zinc-850 focus:border-gold-500 rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-zinc-700 focus:outline-none transition-colors ${dir === "rtl" ? "text-right" : "text-left"}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className={`block text-[10px] font-mono text-zinc-500 uppercase tracking-wider ${dir === "rtl" ? "text-right" : "text-left"}`}>
                      {t("contact_form_message")}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t("contact_form_placeholder_message")}
                      className={`w-full bg-zinc-950 border border-zinc-850 focus:border-gold-500 rounded-lg py-2.5 px-3.5 text-xs text-white placeholder-zinc-700 focus:outline-none resize-none leading-relaxed ${dir === "rtl" ? "text-right" : "text-left"}`}
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 bg-rose-950/20 border border-rose-500/20 text-rose-300 text-xs rounded-lg font-mono">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 disabled:opacity-50 text-slate-950 font-display font-bold text-xs tracking-wider rounded-lg shadow-xl shadow-gold-500/10 active:scale-98 transition-all flex items-center justify-center gap-2.5 uppercase mt-3 cursor-pointer"
                  >
                    {isSending ? (
                      <>
                        <span>{language === "ar" ? "جاري الإرسال..." : language === "fr" ? "Envoi en cours..." : "Sending..."}</span>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      </>
                    ) : (
                      <>
                        {t("contact_form_submit")}
                        <Send className={`w-3.5 h-3.5 fill-current ${dir === "rtl" ? "rotate-180" : ""}`} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-gold-500/5 border border-gold-500/20 p-8 text-center space-y-6 rounded-xl min-h-[350px] flex flex-col justify-center items-center">
                  <div className="w-14 h-14 bg-gold-500/15 text-gold-400 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                      {t("contact_form_success_title")}
                    </h3>
                    <p className="text-zinc-400 text-xs mt-2 max-w-md mx-auto leading-relaxed font-light">
                      {t("contact_form_success")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded text-xs font-semibold tracking-wider transition-colors border border-zinc-800 cursor-pointer"
                    >
                      {t("contact_form_reset")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Interactive Premium Dark Map Embed */}
        <motion.div 
          className="mt-16 rounded-2xl border border-zinc-900 overflow-hidden bg-slate-900/30 p-2.5 backdrop-blur-xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="relative w-full h-[320px] sm:h-[380px] rounded-xl overflow-hidden group">
            {/* Dark Mode Styled Free Google Maps Iframe */}
            <iframe
              title="Video Club Production Location Map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(agencySettings?.mapsLocation?.iframeQuery || "Video Club Production Ennasr 2 Ariana Tunisia")}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ 
                border: 0, 
                filter: "invert(90%) hue-rotate(180deg) grayscale(80%) contrast(120%) brightness(95%)" 
              }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full rounded-lg"
            ></iframe>

            {/* Float Badge over the Map */}
            <div className={`absolute bottom-6 ${dir === "rtl" ? "left-6" : "right-6"} bg-slate-950/95 border border-zinc-850 p-5 rounded-2xl max-w-sm backdrop-blur-lg shadow-2xl transition-all duration-300 group-hover:border-gold-500/30`}>
              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
                  <MapPin className="w-4.5 h-4.5 stroke-[1.5]" />
                </div>
                <div className={dir === "rtl" ? "text-right" : "text-left"}>
                  <h4 className="font-display text-xs font-black text-white uppercase tracking-wider">
                    Video Club Production
                  </h4>
                  <p className="text-zinc-450 text-[10px] font-light mt-1.5 leading-relaxed">
                    {language === "ar" 
                      ? (agencySettings?.mapsLocation?.addressTextAr || "24 نهج خليج القمر، النصر 2، أريانة 2037، تونس") 
                      : language === "fr"
                        ? (agencySettings?.mapsLocation?.addressTextFr || "24 Rue Khalij El Kamar, Ennasr 2, Ariana 2037, Tunisia")
                        : (agencySettings?.mapsLocation?.addressTextEn || "24 Rue Khalij El Kamar, Ennasr 2, Ariana 2037, Tunisia")
                    }
                  </p>
                  <a
                    href={agencySettings?.mapsLocation?.directionsUrl || "https://maps.app.goo.gl/wpghGfG57A8rkCd2A"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-gold-400 text-[10px] font-bold mt-3 hover:text-gold-300 uppercase tracking-widest transition-colors"
                  >
                    {language === "ar" ? "عرض الاتجاهات" : language === "fr" ? "VOIR LES ITINÉRAIRES" : "GET DIRECTIONS"}
                    <span className="text-xs">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
