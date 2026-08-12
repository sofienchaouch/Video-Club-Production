import React, { useState, useEffect } from "react";
import { Film, Menu, X, Play, Calculator, Sparkles, MessageSquare, Compass, Globe, Users, Camera, HelpCircle } from "lucide-react";
import { useApp } from "../context/AppContext";
import Logo from "./Logo";

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const { language, setLanguage, t, dir } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { id: "hero", label: t("nav_home"), icon: Compass },
    { id: "work", label: t("nav_work"), icon: Play },
    { id: "capabilities", label: t("nav_capabilities"), icon: Film },
    { id: "budget", label: t("nav_budget"), icon: Calculator },
    { id: "roster", label: t("nav_roster"), icon: Users },
    { id: "faqs", label: t("nav_faqs"), icon: HelpCircle },
    { id: "contact", label: t("nav_contact"), icon: MessageSquare },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-slate-950/85 backdrop-blur-md border-b border-zinc-900/60 py-3 shadow-xl"
          : "bg-gradient-to-b from-slate-950/80 to-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => handleNavClick("hero")}
            className="flex items-center cursor-pointer group"
          >
            <Logo className="h-12 w-auto transform group-hover:scale-105 transition-all duration-300" variant="navbar" />
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-2 xl:px-3.5 py-1.5 text-[10px] xl:text-xs font-semibold uppercase tracking-wider rounded-md transition-all duration-350 flex items-center gap-1 xl:gap-1.5 ${
                    isActive
                      ? "text-gold-400 font-bold"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                  }`}
                >
                  <Icon className={`w-3 h-3 xl:w-3.5 xl:h-3.5 shrink-0 ${isActive ? "text-gold-400" : "text-zinc-500"}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full shadow-[0_0_8px_rgba(219,179,116,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Header Panel (Lang and Pitch Button) */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-900 hover:border-gold-500/30 bg-zinc-950/40 text-zinc-400 hover:text-white text-xs font-medium uppercase tracking-wider transition-all cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language}</span>
              </button>
              
              {isLangDropdownOpen && (
                <div className={`absolute ${dir === "rtl" ? "left-0" : "right-0"} mt-2 w-28 bg-slate-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden py-1 z-50`}>
                  {(["en", "fr", "ar"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left ${dir === "rtl" ? "text-right px-4" : "text-left px-4"} py-2 text-xs font-medium hover:bg-zinc-800 hover:text-white transition-colors block ${
                        language === lang ? "text-gold-400 bg-zinc-800/20" : "text-zinc-400"
                      }`}
                      style={{ direction: lang === "ar" ? "rtl" : "ltr" }}
                    >
                      {lang === "en" ? "English" : lang === "fr" ? "Français" : "العربية"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Start Project CTA Button */}
            <button
              onClick={() => handleNavClick("contact")}
              className="px-4 xl:px-5 py-2 text-xs font-semibold tracking-wider text-slate-950 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 rounded-full hover:shadow-lg hover:shadow-gold-500/10 active:scale-95 transition-all duration-300 uppercase font-display shrink-0"
            >
              {t("nav_contact")}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Fullscreen Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-2xl flex flex-col w-full h-screen overflow-y-auto overscroll-contain" style={{ direction: dir }}>
          {/* Header Row */}
          <div className={`flex items-center justify-between px-6 py-5 border-b border-zinc-900/40 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            {/* Logo */}
            <div onClick={() => handleNavClick("hero")} className="cursor-pointer">
              <Logo className="h-10 w-auto" variant="navbar" />
            </div>

            {/* Close Button */}
            <div className={`flex items-center gap-3.5 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Scrollable Menu Options */}
          <div className="flex-1 px-6 py-8 flex flex-col justify-between space-y-8">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all ${
                      isActive
                        ? "bg-gold-500/10 text-gold-400 font-bold"
                        : "text-zinc-400 hover:text-white hover:bg-zinc-900/30"
                    } ${dir === "rtl" ? "text-right justify-start flex-row-reverse" : "text-left"}`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-gold-400" : "text-zinc-500"}`} />
                    <span className="text-sm font-semibold tracking-wide uppercase">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-6 pt-6 border-t border-zinc-900/40">
              {/* Language Selector Row */}
              <div className={`flex items-center justify-between ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <span className="text-[10px] text-zinc-500 flex items-center gap-1.5 uppercase tracking-wider font-mono font-semibold">
                  <Globe className="w-3.5 h-3.5" />
                  Language / Langue
                </span>
                <div className={`flex gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  {(["en", "fr", "ar"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        language === lang
                          ? "bg-gold-500 border-gold-500 text-slate-950 font-black shadow-md shadow-gold-500/20"
                          : "bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                      }`}
                    >
                      {lang === "en" ? "EN" : lang === "fr" ? "FR" : "AR"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start Project CTA Button */}
              <div>
                <button
                  onClick={() => handleNavClick("contact")}
                  className="w-full py-4 text-center text-xs font-bold tracking-widest text-slate-950 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full uppercase font-display shadow-lg shadow-gold-500/15 transition-all hover:scale-[1.01] active:scale-95"
                >
                  {t("nav_contact")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
