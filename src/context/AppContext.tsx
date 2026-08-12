import React, { createContext, useContext, useState, useEffect } from "react";
import { LANGUAGES, TRANSLATIONS, TRANSLATED_DATA, LanguageConfig } from "../data/translations";

interface AppContextType {
  language: "en" | "fr" | "ar";
  setLanguage: (lang: "en" | "fr" | "ar") => void;
  theme: "dark";
  toggleTheme: () => void;
  t: (key: keyof typeof TRANSLATIONS["en"]) => string;
  data: typeof TRANSLATED_DATA["en"];
  dir: "ltr" | "rtl";
  customTranslations: any;
  setCustomTranslations: React.Dispatch<React.SetStateAction<any>>;
  reloadTranslations: () => Promise<void>;
  estimatorConfig: any;
  setEstimatorConfig: React.Dispatch<React.SetStateAction<any>>;
  reloadEstimatorConfig: () => Promise<void>;
  agencySettings: any;
  setAgencySettings: React.Dispatch<React.SetStateAction<any>>;
  reloadAgencySettings: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Load default from localStorage or default to English
  const [language, setLanguageState] = useState<"en" | "fr" | "ar">(() => {
    const saved = localStorage.getItem("video-club-lang");
    return (saved === "en" || saved === "fr" || saved === "ar") ? saved : "en";
  });

  const theme: "dark" = "dark";

  const toggleTheme = () => {
    // Theme locked to dark mode
  };

  const [customTranslations, setCustomTranslations] = useState<any>({});
  const [estimatorConfig, setEstimatorConfig] = useState<any>({});
  const [agencySettings, setAgencySettings] = useState<any>({
    heroImages: [
      "/uploads/VA_1302227-scaled_1786452312112.jpg",
      "/uploads/hero-1.jpg",
      "/uploads/studio-podcast.jpg"
    ],
    mapsLocation: {
      iframeQuery: "Video Club Production Ennasr 2 Ariana Tunisia",
      directionsUrl: "https://maps.app.goo.gl/wpghGfG57A8rkCd2A",
      addressTextAr: "24 نهج خليج القمر، النصر 2، أريانة 2037، تونس",
      addressTextEn: "24 Rue Khalij El Kamar, Ennasr 2, Ariana 2037, Tunisia",
      addressTextFr: "24 Rue Khalij El Kamar, Ennasr 2, Ariana 2037, Tunisia"
    },
    portfolioImages: {
      "company-presentation": "/uploads/two-diverse-businessmen-making-a-pitch-during-a-meeting-with-shareholders-after-hours-presenting-budget-numbers-and-other-resources-discussing-multinational-company-growth-strategy-camera-a-video_1786452512234.jpg",
      "instagram-reels": "/uploads/reels-logo_1786452504898.webp",
      "fashion-videos": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
      "youtube-videos": "/uploads/yt_1786452504238.jpeg",
      "padel-videos": "/uploads/GettyImages-1423558556_1786452503737.avif",
      "interview-videos": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
      "elyssar-haute-couture": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
      "cartagina-heritage-film": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      "video-club-showcase-svZNfyC6C78": "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
      "auguste-lookbook": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
    },
    teamImages: {},
    studioTourImages: {
      "plateau": "/uploads/Firefly_surcetteimageenlevezlesfilsnonsouhaitsacotelevezlesboutsdescotch4327291_1786452883842.png",
      "podcast": "/uploads/studio-podcast.jpg"
    },
    agencyLogo: "/uploads/Fichier-42x_1786452239382.png",
    presentationVideoUrl: "/uploads/presentation-video.mp4",
    partnerLogos: []
  });

  const reloadTranslations = async () => {
    try {
      const res = await fetch("/api/translations");
      if (res.ok) {
        const data = await res.json();
        setCustomTranslations(data);
      }
    } catch (err) {
      console.error("Failed to load custom translations:", err);
    }
  };

  const reloadEstimatorConfig = async () => {
    try {
      const res = await fetch("/api/estimator/config");
      if (res.ok) {
        const data = await res.json();
        setEstimatorConfig(data);
      }
    } catch (err) {
      console.error("Failed to load custom estimator config:", err);
    }
  };

  const reloadAgencySettings = async () => {
    try {
      const res = await fetch("/api/agency-settings");
      if (res.ok) {
        const data = await res.json();
        setAgencySettings(data);
      }
    } catch (err) {
      console.error("Failed to load custom agency settings:", err);
    }
  };

  useEffect(() => {
    reloadTranslations();
    reloadEstimatorConfig();
    reloadAgencySettings();
  }, []);

  // Keep direction synchronized
  const activeLangConfig = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const dir = activeLangConfig.dir;

  // Set language and update document properties
  const setLanguage = (lang: "en" | "fr" | "ar") => {
    setLanguageState(lang);
    localStorage.setItem("video-club-lang", lang);
  };

  // Sync state with HTML attributes and update SEO tags dynamically
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Sync language and text direction
    root.setAttribute("lang", language);
    root.setAttribute("dir", dir);
    
    // Ensure light theme class is removed
    root.classList.remove("light");

    // Dynamic localized SEO Metadata values
    let pageTitle = "Video Club Production | Boutique Cinematic Video Agency Tunis";
    let pageDesc = "Video Club Production is an elite boutique cinematic production agency based in Tunis (Ennasr 2). We design high-end commercials, award-winning music videos, and poetic branded films.";
    let localeVal = "en_US";

    if (language === "ar") {
      pageTitle = "Video Club Production | وكالة إنتاج سينمائي متميزة في تونس";
      pageDesc = "Video Club Production هي شركة إنتاج سينمائي وتلفزيوني متميزة في النصر 2 تونس، متخصصة في الإعلانات التجارية، الفيديو كليب، والأفلام الترويجية الراقية.";
      localeVal = "ar_TN";
    } else if (language === "fr") {
      pageTitle = "Video Club Production | Agence de Production Vidéo Cinématique à Tunis";
      pageDesc = "Video Club Production est une agence de production vidéo d'élite basée à Ennasr 2, Tunis, spécialisée dans les publicités de marque, les clips musicaux et les films cinématiques.";
      localeVal = "fr_FR";
    }

    // Update document title
    window.document.title = pageTitle;

    // Update Meta Description
    const metaDesc = window.document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", pageDesc);
    }

    // Update Open Graph (OG) tags
    const ogTitle = window.document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", pageTitle);
    
    const ogDesc = window.document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", pageDesc);

    const ogLocale = window.document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute("content", localeVal);

    // Update Twitter Card tags
    const twitterTitle = window.document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute("content", pageTitle);

    const twitterDesc = window.document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute("content", pageDesc);

  }, [language, dir, theme]);

  // Translation function helper
  const t = (key: keyof typeof TRANSLATIONS["en"]): string => {
    const customForLang = customTranslations[language];
    if (customForLang && customForLang[key] !== undefined && customForLang[key] !== "") {
      return customForLang[key];
    }
    const translationsForLang = TRANSLATIONS[language];
    return translationsForLang[key] || TRANSLATIONS["en"][key] || String(key);
  };

  // Language-specific data objects
  const data = TRANSLATED_DATA[language] || TRANSLATED_DATA["en"];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        toggleTheme,
        t,
        data,
        dir,
        customTranslations,
        setCustomTranslations,
        reloadTranslations,
        estimatorConfig,
        setEstimatorConfig,
        reloadEstimatorConfig,
        agencySettings,
        setAgencySettings,
        reloadAgencySettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
