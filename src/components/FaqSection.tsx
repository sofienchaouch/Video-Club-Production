import React, { useState } from "react";
import { HelpCircle, ChevronDown, MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";

interface FaqItem {
  id: string;
  icon: any;
  question: {
    en: string;
    fr: string;
    ar: string;
  };
  answer: {
    en: string;
    fr: string;
    ar: string;
  };
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: "confirm-booking",
    icon: HelpCircle,
    question: {
      en: "HOW DO I CONFIRM MY STUDIO BOOKING?",
      fr: "COMMENT CONFIRMER MA RÉSERVATION DE STUDIO ?",
      ar: "كيف أؤكد حجز الاستوديو الخاص بي؟"
    },
    answer: {
      en: "Every studio rental is confirmed once a 40% deposit of the total booking value is paid. This secures your date and time slot exclusively for you. The remaining 60% is settled on the day of your session. Until the deposit is received, the slot stays open and can be booked by another client, so we recommend locking your date early.",
      fr: "Toute location de studio est confirmée dès le versement d'un acompte de 40 % du montant total. Cela garantit votre date et votre créneau horaire de manière exclusive. Les 60 % restants sont réglés le jour de votre session. Tant que l'acompte n'est pas reçu, le créneau reste ouvert et peut être réservé par un autre client, nous vous conseillons donc de bloquer votre date au plus vite.",
      ar: "يتم تأكيد أي حجز للاستوديو بمجرد دفع عربون بنسبة 40% من القيمة الإجمالية للحجز. يضمن هذا حجز التاريخ والوقت حصرياً لك. ويتم سداد الـ 60% المتبقية في يوم الجلسة. إلى أن يتم استلام العربون، يظل الموعد متاحاً ويمكن حجزه من قبل عميل آخر، لذا نوصي بتأكيد حجزك في أقرب وقت."
    }
  },
  {
    id: "rental-alone",
    icon: HelpCircle,
    question: {
      en: "CAN I RENT THE STUDIO ON ITS OWN, WITHOUT A FULL PRODUCTION?",
      fr: "PUIS-JE LOUER LE STUDIO SEUL, SANS PRODUCTION COMPLÈTE ?",
      ar: "هل يمكنني استئجار الاستوديو بمفرده، دون إنتاج كامل؟"
    },
    answer: {
      en: "Absolutely. Beyond full productions, our studio is available to rent by the session for your own podcast, interview, photo shoot or product content.",
      fr: "Absolument. En dehors des productions complètes, notre studio est disponible à la location par session pour vos propres podcasts, interviews, séances photo ou contenus produits.",
      ar: "بالتأكيد. إلى جانب الإنتاجات الكاملة، استوديونا متاح للاستئجار بالجلسة لبودكاست خاص بك، أو مقابلة، أو جلسة تصوير فوتوغرافي، أو تصوير منتجات."
    }
  },
  {
    id: "revisions",
    icon: HelpCircle,
    question: {
      en: "HOW MANY ROUNDS OF REVISIONS ARE INCLUDED?",
      fr: "COMBIEN DE SESSIONS DE RÉVISION SONT INCLUSES ?",
      ar: "كم عدد جولات التعديل / المراجعة المشمولة؟"
    },
    answer: {
      en: "Every project includes 2 rounds of revisions on the edit, so we fine-tune the result to match your vision.",
      fr: "Chaque projet comprend 2 tours de révisions sur le montage afin de perfectionner le rendu selon votre vision.",
      ar: "يتضمن كل مشروع جولتين من التعديلات والمراجعات على المونتاج، لنقوم بضبط النتيجة النهائية بدقة لتطابق رؤيتك."
    }
  },
  {
    id: "locations",
    icon: HelpCircle,
    question: {
      en: "Can you shoot outside of Tunis or operate international campaigns?",
      fr: "Pouvez-vous tourner en dehors de Tunis ou gérer des projets internationaux ?",
      ar: "هل يمكنكم التصوير خارج مدينة تونس أو إدارة حملات دولية؟"
    },
    answer: {
      en: "Absolutely. While our creative studio is based in Tunis, our directors, drone operators, and camera crews travel internationally. We have secured shooting permits and done productions across France, UAE, and Swiss regions. Travel and logistics can be calculated directly in custom briefs.",
      fr: "Absolument. Bien que notre studio créatif soit basé à Tunis, nos réalisateurs, pilotes de drone et équipes techniques se déplacent à l'international. Nous avons obtenu des permis de tournage et réalisé des projets en France, aux Émirats Arabes Unis et en Suisse.",
      ar: "بالتأكيد. على الرغم من أن الاستوديو الإبداعي الخاص بنا يقع في تونس العاصمة، إلا أن المخرجين ومشغلي الدرون وطواقم العمل لدينا يسافرون دولياً. لقد حصلنا على تصاريح تصوير وأنتجنا أعمالاً في فرنسا والإمارات العربية المتحدة ومناطق في سويسرا."
    }
  },
  {
    id: "podcast-multicam",
    icon: MessageSquare,
    question: {
      en: "What makes your Multi-Cam Podcast studio premium compared to home setups?",
      fr: "Qu'est-ce qui rend votre studio de podcast Multi-Cam supérieur à un studio amateur ?",
      ar: "ما الذي يميز استوديو البودكاست متعدد الكاميرات لديكم مقارنة بالتجهيزات المنزلية؟"
    },
    answer: {
      en: "We deploy broadcast-grade vocal microphones (Shure SM7B/Neumann), multi-layered soundproof acoustic panels, and live high-speed video switcher interfaces with cinematic depth. Our packages also include dedicated audio mastering engineers and automatic extraction of viral vertical shorts.",
      fr: "Nous utilisons des micros de diffusion vocale (Shure SM7B/Neumann), des panneaux acoustiques d'isolation phonique multicouches et une régie de commutation vidéo 4K en direct. Nos forfaits comprennent également l'étalonnage et l'extraction de formats verticaux.",
      ar: "نحن نستخدم ميكروفونات بث صوتي احترافية (Shure SM7B / Neumann)، وألواح عزل صوتي متطورة متعددة الطبقات، وأنظمة دمج وتوجيه فيديو فوري عالي السرعة بجمالية سينمائية دقيقة. تشمل باقاتنا أيضاً مهندس هندسة صوتية متخصص واستخراجاً ذكياً للمقاطع العمودية القصيرة."
    }
  }
];

export default function FaqSection() {
  const { language, t, dir, agencySettings } = useApp();
  const [openId, setOpenId] = useState<string | null>("confirm-booking");

  const customFaqs = agencySettings?.customFaqs || [];
  const activeFaqs: FaqItem[] = customFaqs.length > 0 
    ? customFaqs.map((cf: any) => ({
        id: cf.id || String(Math.random()),
        icon: HelpCircle,
        question: cf.question,
        answer: cf.answer
      }))
    : FAQ_DATA;

  const toggleOpen = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const faqTitle = language === "ar" ? "الأسئلة الشائعة" : language === "fr" ? "QUESTIONS FRÉQUENTES" : "FREQUENTLY ASKED QUESTIONS";
  const faqSubtitle = language === "ar" ? "كل ما تود معرفته عن مراحل الإنتاج" : language === "fr" ? "TOUT COMPRENDRE SUR NOTRE PROCESSUS" : "PRODUCTION INTELLIGENCE & FAQS";
  const contactLinkText = language === "ar" ? "هل لديك سؤال آخر؟ تواصل معنا مباشرة" : language === "fr" ? "Une autre question ? Parlons-en directement" : "Have a bespoke question? Contact our producers";

  return (
    <section id="faqs" className="py-24 bg-slate-900 border-t border-zinc-900/60 relative scroll-mt-24">
      {/* Visual glowing backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] lens-flare-gold rounded-full filter blur-3xl opacity-10"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs text-gold-500 uppercase tracking-widest block mb-3">
            {faqSubtitle}
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 uppercase">
            {faqTitle}
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto rounded-full mb-6"></div>
        </motion.div>

        {/* Accordion list */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {activeFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const Icon = faq.icon;
            const questionText = faq.question[language as keyof typeof faq.question] || faq.question.en;
            const answerText = faq.answer[language as keyof typeof faq.answer] || faq.answer.en;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border bg-slate-950/40 backdrop-blur-sm transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? "border-gold-500/35 shadow-[0_0_15px_rgba(219,179,116,0.05)] bg-slate-950" 
                    : "border-zinc-900/80 hover:border-zinc-800"
                }`}
              >
                <button
                  onClick={() => toggleOpen(faq.id)}
                  className={`w-full py-5 px-6 flex items-center justify-between gap-4 cursor-pointer select-none ${
                    dir === "rtl" ? "flex-row-reverse text-right" : "text-left"
                  }`}
                  aria-expanded={isOpen}
                >
                  <div className={`flex items-center gap-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                      isOpen 
                        ? "bg-gold-500/10 border-gold-500/30 text-gold-400" 
                        : "bg-zinc-900/50 border-zinc-800/80 text-zinc-500"
                    }`}>
                      <Icon className="w-4 h-4 stroke-[1.8]" />
                    </div>
                    <span className="font-display text-sm sm:text-base font-bold text-white uppercase tracking-wide">
                      {questionText}
                    </span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 shrink-0 ${
                    isOpen ? "rotate-180 text-gold-400" : ""
                  }`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className={`px-6 pb-6 pt-2 text-zinc-400 text-sm font-light leading-relaxed border-t border-zinc-900/40 ${
                        dir === "rtl" ? "text-right" : "text-left"
                      }`}>
                        {answerText}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        {/* Footer contact quick link */}
        <div className="text-center mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-gold-400 uppercase tracking-widest transition-colors duration-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
            <span>{contactLinkText}</span>
          </a>
        </div>

      </div>
    </section>
  );
}
