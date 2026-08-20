import React from "react";
import { Film, ArrowUp, Instagram, Youtube, MessageCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const { t, dir } = useApp();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 border-t border-zinc-900/80 py-16 relative overflow-hidden">
      {/* Subtle background grain overlay */}
      <div className="absolute inset-0 grain-overlay opacity-5 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-12 border-b border-zinc-900/60">
          {/* Brand info (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center cursor-pointer" onClick={() => onNavigate("hero")}>
              <Logo className="h-14 w-auto hover:opacity-95 transition-opacity duration-300" variant="light" />
            </div>

            <p className="text-zinc-500 text-xs font-light leading-relaxed max-w-sm">
              {t("footer_tagline")}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/video.club.prod"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-850 hover:border-gold-500/40 text-zinc-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:bg-zinc-850"
                title="Instagram"
              >
                <Instagram className="w-4 h-4 stroke-[1.8]" />
              </a>
              <a
                href="https://www.youtube.com/@VideoClubProduction-e6u7p"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-850 hover:border-gold-500/40 text-zinc-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:bg-zinc-850"
                title="YouTube"
              >
                <Youtube className="w-4 h-4 stroke-[1.8]" />
              </a>
              <a
                href="https://wa.me/21654610546"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-850 hover:border-gold-500/40 text-zinc-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:bg-zinc-850"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 stroke-[1.8]" />
              </a>
            </div>
          </div>

          {/* Links Grid (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Nav Links */}
            <div className="space-y-4">
              <h4 className="font-mono text-[11px] text-gold-500 uppercase tracking-widest">
                {t("quick_links")}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => onNavigate("hero")}
                    className="text-zinc-400 hover:text-white hover:underline transition-colors cursor-pointer"
                  >
                    {t("nav_home")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("work")}
                    className="text-zinc-400 hover:text-white hover:underline transition-colors cursor-pointer"
                  >
                    {t("nav_work")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("capabilities")}
                    className="text-zinc-400 hover:text-white hover:underline transition-colors cursor-pointer"
                  >
                    {t("nav_capabilities")}
                  </button>
                </li>
              </ul>
            </div>

            {/* Tools Links */}
            <div className="space-y-4">
              <h4 className="font-mono text-[11px] text-gold-500 uppercase tracking-widest">
                {t("budget_calculator")}
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => onNavigate("budget")}
                    className="text-zinc-400 hover:text-white hover:underline transition-colors cursor-pointer"
                  >
                    {t("nav_budget")}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onNavigate("contact")}
                    className="text-zinc-400 hover:text-white hover:underline transition-colors cursor-pointer"
                  >
                    {t("nav_contact")}
                  </button>
                </li>
              </ul>
            </div>

            {/* Support/Legals */}
            <div className="space-y-4 col-span-2 sm:col-span-1">
              <h4 className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest">
                VIDEO CLUB PRODUCTION
              </h4>
              <p className="text-zinc-500 text-[11px] leading-relaxed font-light">
                This podcast studio and audiovisual portal is powered by advanced visual engineering. Tunis &copy; 2026.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <span>
            &copy; {currentYear} VIDEO CLUB PRODUCTION. {t("all_rights")}.
          </span>
          <div className="flex items-center gap-6">
            <span className="hover:text-zinc-400 cursor-pointer">PRIVACY POLICY</span>
            <span className="hover:text-zinc-400 cursor-pointer">TERMS OF CRAFT</span>
            <button
              onClick={handleScrollToTop}
              className="flex items-center gap-1 text-gold-500 hover:text-gold-400 transition-colors cursor-pointer"
              title="Scroll to top"
            >
              TOP <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
