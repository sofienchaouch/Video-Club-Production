import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { TRANSLATIONS } from "../data/translations";
import { INITIAL_BUDGET_CATEGORIES, PORTFOLIO_WORKS, TEAM_MEMBERS } from "../data/agencyData";
import { DEFAULT_PACKS } from "./BudgetEstimator";
import { FAQ_DATA } from "./FaqSection";
import { googleSignIn, logoutGoogle } from "../lib/googleAuth";
import { motion, AnimatePresence } from "motion/react";
import ImageUploader from "./ImageUploader";
import Logo from "./Logo";
import { formatGoogleDriveLink } from "../utils/googleDrive";
import { 
  Lock, 
  Save, 
  ArrowLeft, 
  Languages, 
  Search, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  Globe,
  Settings,
  Eye,
  MapPin,
  User,
  Camera,
  Video,
  FileText,
  Plus,
  Trash2,
  DollarSign,
  Layers,
  PlusCircle,
  Film,
  Briefcase,
  Mic,
  Tv,
  LayoutGrid,
  RefreshCw,
  Loader2,
  Sparkles,
  Calendar,
  Mail,
  Link2,
  Unlink,
  ShieldCheck,
  Database,
  HardDrive
} from "lucide-react";
// Groupings for intuitive admin editing
const SECTIONS = [
  {
    id: "nav",
    label: "Navigation & Headers",
    keys: [
      "nav_production_house", "nav_home", "nav_about", "nav_work", 
      "nav_capabilities", "nav_gear_vault", "nav_budget", "nav_roster", 
      "nav_faqs", "nav_contact"
    ]
  },
  {
    id: "hero",
    label: "Hero Section",
    keys: [
      "hero_boutique_agency", "hero_crafting", "hero_cinematic_stories", 
      "hero_concept", "hero_play_showreel", "hero_explore_projects", "trusted_by"
    ]
  },
  {
    id: "about",
    label: "About & Process",
    keys: [
      "about_label", "about_title", "about_desc", 
      "why_us_title", "why_us_desc", "how_we_work_title", "how_we_work_desc",
      "step_1_title", "step_1_desc", "step_2_title", "step_2_desc",
      "step_3_title", "step_3_desc", "step_4_title", "step_4_desc",
      "step_5_title", "step_5_desc", "step_6_title", "step_6_desc"
    ]
  },
  {
    id: "work",
    label: "Works & Portfolio",
    keys: [
      "work_latest_work", "work_crafted_moments", "work_all_categories",
      "work_commercial", "work_music_video", "work_branded", "work_documentary",
      "work_client", "work_director", "work_dp", "work_duration", "work_camera",
      "work_challenge", "work_solution", "work_credits", "work_close", "work_watch"
    ]
  },
  {
    id: "budget",
    label: "Cost Calculator (Budget)",
    keys: [
      "budget_calculator", "budget_headline", "budget_description", 
      "budget_selected_services", "budget_save_estimate", "budget_disclaimer", 
      "budget_estimated_total", "budget_custom_prompt", "budget_pre_production", 
      "budget_production", "budget_post_production"
    ]
  },
  {
    id: "roster",
    label: "Roster & Capabilities",
    keys: [
      "team_workflow", "team_capabilities_title", "team_capabilities_desc", 
      "team_architects", "team_roster_title", "team_roster_desc", 
      "team_specialties", "team_featured_works", "team_creative_signature"
    ]
  },
  {
    id: "contact",
    label: "Contact & Footer",
    keys: [
      "contact_title", "contact_subtitle", "contact_form_name", 
      "contact_form_email", "contact_form_company", "contact_form_project_type", 
      "contact_form_timeline", "contact_form_budget", "contact_form_message", 
      "contact_form_placeholder_message", "contact_form_submit", 
      "contact_form_success_title", "contact_form_success", "contact_form_reset",
      "footer_tagline", "quick_links", "all_rights"
    ]
  }
];

export default function AdminPanel({ onExit, bypassLogin = false }: { onExit: () => void, bypassLogin?: boolean }) {
  const { 
    customTranslations, 
    setCustomTranslations, 
    reloadTranslations,
    estimatorConfig,
    setEstimatorConfig,
    reloadEstimatorConfig,
    agencySettings,
    setAgencySettings,
    reloadAgencySettings
  } = useApp();
  
  // Auth state
  const [token, setToken] = useState<string | null>(() => {
    if (bypassLogin) return "bypassed-token";
    return localStorage.getItem("video-club-admin-token");
  });
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Admin Modes: "translations", "estimator", "projects", "team", "faqs", "assets", "leads", "google"
  const [adminMode, setAdminMode] = useState<"translations" | "estimator" | "projects" | "team" | "faqs" | "assets" | "leads" | "google">("translations");

  // Projects editing state
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isEditingProjectModal, setIsEditingProjectModal] = useState(false);

  // Team member editing state
  const [editingTeamMember, setEditingTeamMember] = useState<any | null>(null);
  const [isEditingTeamModal, setIsEditingTeamModal] = useState(false);

  // FAQ editing state
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  const [isEditingFaqModal, setIsEditingFaqModal] = useState(false);

  // Agency Settings Buffer state
  const [settingsBuffer, setSettingsBuffer] = useState<any>({
    heroImages: ["", "", ""],
    mapsLocation: { iframeQuery: "", directionsUrl: "", addressTextAr: "", addressTextEn: "", addressTextFr: "" },
    contactInfo: { phone: "", phoneTel: "", email: "", whatsapp: "", instagram: "", facebook: "", linkedin: "" },
    portfolioImages: {},
    teamImages: {},
    studioTourImages: {},
    agencyLogo: "",
    customProjects: [],
    customTeam: [],
    customFaqs: [],
    partnerLogos: [],
    googleConnection: { accessToken: "", adminEmail: "", connectedAt: "" }
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSaveStatus, setSettingsSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  // Local state buffers for new partner logos
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerUrl, setNewPartnerUrl] = useState("");

  useEffect(() => {
    if (agencySettings) {
      setSettingsBuffer(JSON.parse(JSON.stringify(agencySettings)));
    }
  }, [agencySettings]);

  const handleSaveAgencySettings = async () => {
    if (!token) return;
    setIsSavingSettings(true);
    setSettingsSaveStatus("saving");
    setSaveStatus("saving");
    setErrorMessage("");
    try {
      const response = await fetch("/api/agency-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, settings: settingsBuffer })
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setSettingsSaveStatus("success");
        setSaveStatus("success");
        await reloadAgencySettings();
        setTimeout(() => {
          setSettingsSaveStatus("idle");
          setSaveStatus("idle");
        }, 3000);
      } else {
        setSettingsSaveStatus("error");
        setSaveStatus("error");
        setErrorMessage(data.error || "Failed to save agency settings.");
      }
    } catch (err) {
      console.error("Error saving agency settings:", err);
      setSettingsSaveStatus("error");
      setSaveStatus("error");
      setErrorMessage("Network error saving agency settings.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Leads & Inquiries Manager states
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [leadsFilter, setLeadsFilter] = useState<"all" | "contact" | "estimate">("all");
  const [leadsStatusFilter, setLeadsStatusFilter] = useState<"all" | "new" | "contacted" | "completed">("all");
  const [leadsError, setLeadsError] = useState("");

  const fetchLeads = async () => {
    if (!token) return;
    setIsLoadingLeads(true);
    setLeadsError("");
    try {
      const response = await fetch(`/api/admin/leads?token=${token}`);
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      } else {
        const errData = await response.json();
        setLeadsError(errData.error || "Failed to load inquiries.");
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      setLeadsError("Network error. Could not connect to leads manager.");
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (token && adminMode === "leads") {
      fetchLeads();
    }
  }, [token, adminMode]);

  const handleUpdateLeadStatus = async (leadId: string, status: string) => {
    if (!token) return;
    try {
      const response = await fetch("/api/admin/leads/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, leadId, status })
      });
      if (response.ok) {
        setLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, status } : lead));
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm("Are you sure you want to delete this lead from the vault?")) return;
    if (!token) return;
    try {
      const response = await fetch("/api/admin/leads/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, leadId })
      });
      if (response.ok) {
        setLeads(prev => prev.filter(lead => lead.id !== leadId));
      } else {
        alert("Failed to delete lead.");
      }
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  // Cost Estimator state
  const [estimatorBuffer, setEstimatorBuffer] = useState<any>({ packs: [], categories: [] });
  const [estimatorTab, setEstimatorTab] = useState<"items" | "packs">("items");
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);

  // Editor configuration state
  const [selectedLang, setSelectedLang] = useState<"en" | "fr" | "ar">("en");
  const [activeTab, setActiveTab] = useState("hero");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Local edit buffer
  const [editBuffer, setEditBuffer] = useState<any>({});
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [translatingKeys, setTranslatingKeys] = useState<Record<string, boolean>>({});
  const [autoTranslateEnabled, setAutoTranslateEnabled] = useState<boolean>(true);
  const [focusedValue, setFocusedValue] = useState<string>("");

  // Populate local edit buffer from custom translations or defaults
  useEffect(() => {
    // Merge database/dynamic translations with fallback definitions
    const merged: any = { en: {}, fr: {}, ar: {} };
    
    (["en", "fr", "ar"] as const).forEach((lang) => {
      const baseLangKeys = TRANSLATIONS[lang] as any;
      const customLangKeys = customTranslations[lang] || {};
      
      Object.keys(baseLangKeys).forEach((key) => {
        merged[lang][key] = customLangKeys[key] !== undefined ? customLangKeys[key] : "";
      });
    });
    
    setEditBuffer(merged);
  }, [customTranslations]);

  // Synchronize Estimator config with buffer
  useEffect(() => {
    if (estimatorConfig && estimatorConfig.categories && estimatorConfig.packs) {
      setEstimatorBuffer(JSON.parse(JSON.stringify(estimatorConfig)));
    } else {
      setEstimatorBuffer({
        packs: JSON.parse(JSON.stringify(DEFAULT_PACKS)),
        categories: JSON.parse(JSON.stringify(INITIAL_BUDGET_CATEGORIES))
      });
    }
  }, [estimatorConfig]);

  // Handle Admin Authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setAuthError("");
    setIsLoggingIn(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch (e) {
        data = { error: `Server response error (${response.status} ${response.statusText || 'Unable to parse server response'})` };
      }

      if (response.ok && data.token) {
        localStorage.setItem("video-club-admin-token", data.token);
        setToken(data.token);
        setPassword("");
      } else {
        setAuthError(data.error || "Incorrect password. Please try again.");
      }
    } catch (err) {
      setAuthError("Network error. Failed to reach the authentication service.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Log out of control panel
  const handleLogout = () => {
    localStorage.removeItem("video-club-admin-token");
    setToken(null);
  };

  // Update a single translation key in our buffer
  const handleFieldChange = (key: string, value: string) => {
    setEditBuffer((prev: any) => ({
      ...prev,
      [selectedLang]: {
        ...prev[selectedLang],
        [key]: value
      }
    }));
  };

  const autoTranslateField = async (key: string, value: string, sourceLang: "en" | "fr" | "ar") => {
    if (!value.trim()) return;

    const targets = (["en", "fr", "ar"] as const).filter((lang) => lang !== sourceLang);

    setTranslatingKeys((prev) => ({ ...prev, [key]: true }));

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: value,
          from: sourceLang,
          targets
        })
      });

      if (!response.ok) {
        throw new Error("Translation request failed");
      }

      const data = await response.json();
      if (data.success && data.translations) {
        setEditBuffer((prev: any) => {
          const updated = { ...prev };
          targets.forEach((lang) => {
            if (data.translations[lang]) {
              updated[lang] = {
                ...(updated[lang] || {}),
                [key]: data.translations[lang]
              };
            }
          });
          return updated;
        });
      }
    } catch (err) {
      console.error(`Failed to auto-translate key "${key}":`, err);
    } finally {
      setTranslatingKeys((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Save changes to the backend
  const handleSaveChanges = async () => {
    if (!token) return;

    setSaveStatus("saving");
    setErrorMessage("");

    try {
      // Filter out any empty strings so they fallback correctly to default hardcoded translations
      const filteredTranslations: any = { en: {}, fr: {}, ar: {} };
      
      (["en", "fr", "ar"] as const).forEach((lang) => {
        Object.keys(editBuffer[lang] || {}).forEach((key) => {
          const val = editBuffer[lang][key];
          if (val && val.trim() !== "") {
            filteredTranslations[lang][key] = val;
          }
        });
      });

      const response = await fetch("/api/translations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          translations: filteredTranslations
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSaveStatus("success");
        // Reload global translation context so website changes reflect immediately
        await reloadTranslations();
        
        setTimeout(() => {
          setSaveStatus("idle");
        }, 3000);
      } else {
        setSaveStatus("error");
        setErrorMessage(data.error || "Failed to persist changes.");
      }
    } catch (err) {
      setSaveStatus("error");
      setErrorMessage("Network error. Failed to write to dynamic translations repository.");
    }
  };

  // Save estimator changes to the backend
  const handleSaveEstimator = async () => {
    if (!token) return;

    setSaveStatus("saving");
    setErrorMessage("");

    try {
      const response = await fetch("/api/estimator/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          config: estimatorBuffer
        })
      });

      const data = await response.json();
      if (response.ok) {
        setSaveStatus("success");
        await reloadEstimatorConfig();
        setTimeout(() => {
          setSaveStatus("idle");
        }, 3000);
      } else {
        setSaveStatus("error");
        setErrorMessage(data.error || "Failed to save estimator configuration.");
      }
    } catch (err) {
      setSaveStatus("error");
      setErrorMessage("Network error. Failed to write to dynamic estimator repository.");
    }
  };

  // Helper to change estimator values
  const handleItemBasePriceChange = (categoryId: string, itemId: string, price: number) => {
    setEstimatorBuffer((prev: any) => {
      const categories = prev.categories.map((cat: any) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item: any) => {
            if (item.id !== itemId) return item;
            return { ...item, basePrice: price };
          })
        };
      });
      return { ...prev, categories };
    });
  };

  const handleItemTextChange = (categoryId: string, itemId: string, field: "name" | "description", value: string) => {
    setEstimatorBuffer((prev: any) => {
      const categories = prev.categories.map((cat: any) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item: any) => {
            if (item.id !== itemId) return item;
            return { ...item, [field]: value };
          })
        };
      });
      return { ...prev, categories };
    });
  };

  const handleItemUnitTypeChange = (categoryId: string, itemId: string, value: string) => {
    setEstimatorBuffer((prev: any) => {
      const categories = prev.categories.map((cat: any) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item: any) => {
            if (item.id !== itemId) return item;
            return { ...item, unitType: value };
          })
        };
      });
      return { ...prev, categories };
    });
  };

  const handleAddEstimatorItem = (categoryId: string) => {
    const newItemId = "item-" + Math.random().toString(36).substr(2, 9);
    const newItem = {
      id: newItemId,
      name: "New Line Item",
      description: "Description of the new production service.",
      basePrice: 100,
      unitType: "flat",
      isSelected: false,
      quantity: 1
    };

    setEstimatorBuffer((prev: any) => {
      const categories = prev.categories.map((cat: any) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: [...cat.items, newItem]
        };
      });
      return { ...prev, categories };
    });
  };

  const handleDeleteEstimatorItem = (categoryId: string, itemId: string) => {
    if (!window.confirm("Are you sure you want to delete this cost item?")) return;
    setEstimatorBuffer((prev: any) => {
      const categories = prev.categories.map((cat: any) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.filter((item: any) => item.id !== itemId)
        };
      });
      return { ...prev, categories };
    });
  };

  // Packs helpers
  const handlePackFieldChange = (packId: string, field: string, value: any) => {
    setEstimatorBuffer((prev: any) => {
      const packs = prev.packs.map((pack: any) => {
        if (pack.id !== packId) return pack;
        return { ...pack, [field]: value };
      });
      return { ...prev, packs };
    });
  };

  const handlePackNestedFieldChange = (packId: string, subObj: string, key: string, value: any) => {
    setEstimatorBuffer((prev: any) => {
      const packs = prev.packs.map((pack: any) => {
        if (pack.id !== packId) return pack;
        return {
          ...pack,
          [subObj]: {
            ...pack[subObj],
            [key]: value
          }
        };
      });
      return { ...prev, packs };
    });
  };

  const handlePackSelectionToggle = (packId: string, categoryId: string, itemId: string, defaultQty: number = 1) => {
    setEstimatorBuffer((prev: any) => {
      const packs = prev.packs.map((pack: any) => {
        if (pack.id !== packId) return pack;
        const currentSelections = pack.selections || {};
        const catSelections = currentSelections[categoryId] || [];
        
        const exists = catSelections.some((s: any) => s.id === itemId);
        let updatedCatSelections;
        
        if (exists) {
          updatedCatSelections = catSelections.filter((s: any) => s.id !== itemId);
        } else {
          updatedCatSelections = [...catSelections, { id: itemId, quantity: defaultQty }];
        }
        
        return {
          ...pack,
          selections: {
            ...currentSelections,
            [categoryId]: updatedCatSelections
          }
        };
      });
      return { ...prev, packs };
    });
  };

  const handlePackSelectionQtyChange = (packId: string, categoryId: string, itemId: string, qty: number) => {
    setEstimatorBuffer((prev: any) => {
      const packs = prev.packs.map((pack: any) => {
        if (pack.id !== packId) return pack;
        const currentSelections = pack.selections || {};
        const catSelections = currentSelections[categoryId] || [];
        
        const updatedCatSelections = catSelections.map((s: any) => {
          if (s.id !== itemId) return s;
          return { ...s, quantity: qty };
        });
        
        return {
          ...pack,
          selections: {
            ...currentSelections,
            [categoryId]: updatedCatSelections
          }
        };
      });
      return { ...prev, packs };
    });
  };

  const handleAddPack = () => {
    const newPackId = "pack-" + Math.random().toString(36).substr(2, 9);
    const newPack = {
      id: newPackId,
      name: { en: "New Custom Pack", fr: "Nouveau Forfait", ar: "باقة مخصصة جديدة" },
      price: 2500,
      icon: "Film",
      badge: { en: "Elite Custom", fr: "Élite Sur Mesure", ar: "مخصصة ممتازة" },
      desc: {
        en: "Short, engaging description of this premium custom production bundle package.",
        fr: "Description courte et engageante de ce pack de production personnalisé haut de gamme.",
        ar: "وصف قصير وجذاب لهذه الباقة الإنتاجية المتميزة والمخصصة."
      },
      bullets: {
        en: ["Custom Bullet point 1", "Custom Bullet point 2"],
        fr: ["Point personnalisé 1", "Point personnalisé 2"],
        ar: ["عنصر مخصص ١", "عنصر مخصص ٢"]
      },
      selections: {}
    };

    setEstimatorBuffer((prev: any) => ({
      ...prev,
      packs: [...prev.packs, newPack]
    }));
    setSelectedPackId(newPackId);
  };

  const handleDeletePack = (packId: string) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;
    setEstimatorBuffer((prev: any) => ({
      ...prev,
      packs: prev.packs.filter((p: any) => p.id !== packId)
    }));
    if (selectedPackId === packId) {
      setSelectedPackId(null);
    }
  };

  // Reset local buffer back to currently saved customized overrides
  const handleResetBuffer = () => {
    if (window.confirm("Discard all unsaved edits in your working buffer?")) {
      const reset: any = { en: {}, fr: {}, ar: {} };
      (["en", "fr", "ar"] as const).forEach((lang) => {
        const baseLangKeys = TRANSLATIONS[lang] as any;
        const customLangKeys = customTranslations[lang] || {};
        
        Object.keys(baseLangKeys).forEach((key) => {
          reset[lang][key] = customLangKeys[key] !== undefined ? customLangKeys[key] : "";
        });
      });
      setEditBuffer(reset);
    }
  };

  // Auth Screen Layout
  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Subtle grid bg */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>

        <motion.div 
          className="relative max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Accent glow line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-xl bg-gold-950/30 border border-gold-500/20 text-gold-400 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight text-white mb-1 uppercase">
              Content Control Vault
            </h1>
            <p className="text-xs font-mono text-zinc-500 tracking-wider">
              VIDEO CLUB PRODUCTION // ADMIN GATEWAY
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Secure Access Key
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 hover:border-zinc-700 focus:border-gold-500/50 rounded-lg text-white text-sm outline-none transition-colors font-mono"
                disabled={isLoggingIn}
                autoFocus
              />
            </div>

            {authError && (
              <div className="flex items-start gap-2 p-3.5 bg-rose-950/20 border border-rose-500/30 rounded-lg text-rose-300 text-xs leading-relaxed animate-shake">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 font-display font-bold text-sm tracking-widest rounded-lg uppercase shadow-lg shadow-gold-500/10 hover:shadow-gold-500/25 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoggingIn ? "Verifying..." : "Grant Access"}
            </button>
          </form>

          <button
            onClick={onExit}
            className="w-full mt-4 py-2.5 bg-transparent border border-slate-800 hover:border-slate-700 hover:bg-slate-800/20 text-zinc-400 hover:text-white font-semibold text-xs tracking-wider rounded-lg uppercase transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Live Site
          </button>
        </motion.div>
      </div>
    );
  }

  // Active fields inside the selected section
  const currentSectionConfig = SECTIONS.find(s => s.id === activeTab) || SECTIONS[0];
  const keysToRender = currentSectionConfig.keys.filter(key => {
    if (!searchQuery.trim()) return true;
    
    const baseValue = (TRANSLATIONS[selectedLang] as any)[key] || "";
    const customValue = editBuffer[selectedLang]?.[key] || "";
    const query = searchQuery.toLowerCase();
    
    return (
      key.toLowerCase().includes(query) ||
      baseValue.toLowerCase().includes(query) ||
      customValue.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Top Banner / Navigation */}
      <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-gold-950/40 border border-gold-500/30 text-gold-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg tracking-tight uppercase">
              Control Center
            </h1>
            <p className="text-2xs font-mono text-zinc-500 tracking-wider font-light">
              VIDEO CLUB CONTROL VAULT
            </p>
          </div>
          {/* Mode switch pills */}
          <div className="ml-6 hidden xl:flex p-1 bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto gap-1">
            <button
              onClick={() => setAdminMode("translations")}
              className={`px-3 py-1.5 text-2xs font-bold rounded-md uppercase transition-all cursor-pointer whitespace-nowrap ${adminMode === "translations" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
            >
              Translations
            </button>
            <button
              onClick={() => setAdminMode("estimator")}
              className={`px-3 py-1.5 text-2xs font-bold rounded-md uppercase transition-all cursor-pointer whitespace-nowrap ${adminMode === "estimator" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
            >
              Estimator & Packs
            </button>
            <button
              onClick={() => setAdminMode("projects")}
              className={`px-3 py-1.5 text-2xs font-bold rounded-md uppercase transition-all cursor-pointer whitespace-nowrap ${adminMode === "projects" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
            >
              Portfolio & Works
            </button>
            <button
              onClick={() => setAdminMode("team")}
              className={`px-3 py-1.5 text-2xs font-bold rounded-md uppercase transition-all cursor-pointer whitespace-nowrap ${adminMode === "team" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
            >
              Team Roster
            </button>
            <button
              onClick={() => setAdminMode("faqs")}
              className={`px-3 py-1.5 text-2xs font-bold rounded-md uppercase transition-all cursor-pointer whitespace-nowrap ${adminMode === "faqs" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
            >
              FAQs
            </button>
            <button
              onClick={() => setAdminMode("assets")}
              className={`px-3 py-1.5 text-2xs font-bold rounded-md uppercase transition-all cursor-pointer whitespace-nowrap ${adminMode === "assets" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
            >
              Images & Contact
            </button>
            <button
              onClick={() => setAdminMode("leads")}
              className={`px-3 py-1.5 text-2xs font-bold rounded-md uppercase transition-all cursor-pointer whitespace-nowrap ${adminMode === "leads" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
            >
              Leads
            </button>
            <button
              onClick={() => setAdminMode("google")}
              className={`px-3 py-1.5 text-2xs font-bold rounded-md uppercase transition-all cursor-pointer whitespace-nowrap ${adminMode === "google" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
            >
              Google
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Mode switch buttons */}
        <div className="flex xl:hidden w-full p-1 bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto gap-1">
          <button
            onClick={() => setAdminMode("translations")}
            className={`flex-1 min-w-[75px] py-1.5 text-[10px] font-bold rounded-md uppercase transition-colors whitespace-nowrap ${adminMode === "translations" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
          >
            Translations
          </button>
          <button
            onClick={() => setAdminMode("estimator")}
            className={`flex-1 min-w-[75px] py-1.5 text-[10px] font-bold rounded-md uppercase transition-colors whitespace-nowrap ${adminMode === "estimator" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
          >
            Estimator
          </button>
          <button
            onClick={() => setAdminMode("projects")}
            className={`flex-1 min-w-[75px] py-1.5 text-[10px] font-bold rounded-md uppercase transition-colors whitespace-nowrap ${adminMode === "projects" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setAdminMode("team")}
            className={`flex-1 min-w-[75px] py-1.5 text-[10px] font-bold rounded-md uppercase transition-colors whitespace-nowrap ${adminMode === "team" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
          >
            Team
          </button>
          <button
            onClick={() => setAdminMode("faqs")}
            className={`flex-1 min-w-[75px] py-1.5 text-[10px] font-bold rounded-md uppercase transition-colors whitespace-nowrap ${adminMode === "faqs" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
          >
            FAQs
          </button>
          <button
            onClick={() => setAdminMode("assets")}
            className={`flex-1 min-w-[75px] py-1.5 text-[10px] font-bold rounded-md uppercase transition-colors whitespace-nowrap ${adminMode === "assets" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
          >
            Contact
          </button>
          <button
            onClick={() => setAdminMode("leads")}
            className={`flex-1 min-w-[75px] py-1.5 text-[10px] font-bold rounded-md uppercase transition-colors whitespace-nowrap ${adminMode === "leads" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
          >
            Leads
          </button>
          <button
            onClick={() => setAdminMode("google")}
            className={`flex-1 min-w-[75px] py-1.5 text-[10px] font-bold rounded-md uppercase transition-colors whitespace-nowrap ${adminMode === "google" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
          >
            Google
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Exit / Return button */}
          <button
            onClick={onExit}
            className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-zinc-700 hover:bg-slate-900 text-zinc-300 hover:text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Exit Dashboard
          </button>

          {/* Save Status indicators */}
          {saveStatus === "success" && (
            <div className="px-3 py-2 bg-emerald-950/20 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Dynamic Repo Synced</span>
            </div>
          )}

          {saveStatus === "error" && (
            <div className="px-3 py-2 bg-rose-950/20 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Sync Failed</span>
            </div>
          )}

          {/* Reset / Clear working buffer */}
          {adminMode === "translations" && (
            <button
              onClick={handleResetBuffer}
              className="px-4 py-2 bg-transparent hover:bg-rose-950/10 border border-slate-800 hover:border-rose-500/30 text-zinc-500 hover:text-rose-400 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all"
            >
              Reset Working Copy
            </button>
          )}

          {/* Save modifications */}
          <button
            onClick={() => {
              if (adminMode === "estimator") {
                handleSaveEstimator();
              } else if (adminMode === "translations") {
                handleSaveChanges();
              } else {
                handleSaveAgencySettings();
              }
            }}
            disabled={saveStatus === "saving" || isSavingSettings}
            className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 font-display font-bold text-xs tracking-widest uppercase rounded-lg shadow-md shadow-gold-500/10 hover:shadow-gold-500/25 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saveStatus === "saving" || isSavingSettings ? "Syncing..." : "Publish Content"}
          </button>

          {/* Log out */}
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-zinc-500 hover:text-rose-400 text-xs font-semibold uppercase tracking-wider transition-all"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {adminMode === "translations" ? (
          <aside className="w-full lg:w-72 bg-slate-900/30 border-r border-slate-800 p-4 lg:p-6 space-y-6">
            {/* Target Language Selection */}
            <div>
              <span className="block text-3xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Language Target
              </span>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg">
                <button
                  onClick={() => setSelectedLang("en")}
                  className={`py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${selectedLang === "en" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setSelectedLang("fr")}
                  className={`py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${selectedLang === "fr" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
                >
                  FR
                </button>
                <button
                  onClick={() => setSelectedLang("ar")}
                  className={`py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${selectedLang === "ar" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Sections List */}
            <div>
              <span className="block text-3xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Content Chapters
              </span>
              <div className="space-y-1">
                {SECTIONS.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveTab(sec.id);
                      setSearchQuery(""); // Clear search when changing tabs
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase flex items-center justify-between cursor-pointer ${
                      activeTab === sec.id 
                        ? "bg-slate-800 text-gold-400 border-l-2 border-gold-500 pl-3" 
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-slate-900/50"
                    }`}
                  >
                    <span>{sec.label}</span>
                    <span className="text-3xs bg-slate-950 border border-slate-800 text-zinc-500 px-2 py-0.5 rounded-full font-mono">
                      {sec.keys.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-900">
              <div className="flex items-center gap-2 text-zinc-500 text-2xs leading-relaxed font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-500" />
                <span>Placeholders show base defaults. Overwrite a field to customize, or leave blank to fall back safely.</span>
              </div>
            </div>
          </aside>
        ) : adminMode === "estimator" ? (
          <aside className="w-full lg:w-72 bg-slate-900/30 border-r border-slate-800 p-4 lg:p-6 space-y-6">
            {/* Target Language Selection in Estimator Mode */}
            <div>
              <span className="block text-3xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Language Target
              </span>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg">
                <button
                  onClick={() => setSelectedLang("en")}
                  className={`py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${selectedLang === "en" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setSelectedLang("fr")}
                  className={`py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${selectedLang === "fr" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
                >
                  FR
                </button>
                <button
                  onClick={() => setSelectedLang("ar")}
                  className={`py-2 text-xs font-bold rounded-md transition-colors cursor-pointer ${selectedLang === "ar" ? "bg-gold-500 text-slate-950" : "text-zinc-400 hover:text-white"}`}
                >
                  العربية
                </button>
              </div>
            </div>

            {/* Estimator Sub-navigation */}
            <div>
              <span className="block text-3xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Estimator Modules
              </span>
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    setEstimatorTab("items");
                    setSelectedPackId(null);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase flex items-center justify-between cursor-pointer ${
                    estimatorTab === "items" 
                      ? "bg-slate-800 text-gold-400 border-l-2 border-gold-500 pl-3" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-slate-900/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 shrink-0" />
                    <span>Prices & Line Items</span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    setEstimatorTab("packs");
                    if (estimatorBuffer.packs && estimatorBuffer.packs.length > 0) {
                      setSelectedPackId(estimatorBuffer.packs[0].id);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all uppercase flex items-center justify-between cursor-pointer ${
                    estimatorTab === "packs" 
                      ? "bg-slate-800 text-gold-400 border-l-2 border-gold-500 pl-3" 
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-slate-900/50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 shrink-0" />
                    <span>Package Deals (Packs)</span>
                  </span>
                </button>
              </div>
            </div>

            {estimatorTab === "packs" && estimatorBuffer.packs && (
              <div className="pt-4 border-t border-slate-900">
                <span className="block text-3xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span>Package Selection</span>
                  <button 
                    onClick={handleAddPack}
                    className="p-1 bg-gold-500 hover:bg-gold-400 text-slate-950 rounded transition-colors flex items-center justify-center cursor-pointer"
                    title="Add Package"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </span>
                <div className="space-y-1 max-h-[220px] overflow-y-auto pr-1">
                  {estimatorBuffer.packs.map((pk: any) => (
                    <div 
                      key={pk.id}
                      className={`group/item flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                        selectedPackId === pk.id 
                          ? "bg-slate-800/80 text-gold-400 font-bold" 
                          : "text-zinc-400 hover:text-white hover:bg-slate-900/50"
                      }`}
                    >
                      <button
                        onClick={() => setSelectedPackId(pk.id)}
                        className="flex-1 text-left truncate uppercase text-[11px] cursor-pointer"
                      >
                        {pk.name[selectedLang] || pk.name.en || pk.name}
                      </button>
                      <button
                        onClick={() => handleDeletePack(pk.id)}
                        className="opacity-0 group-hover/item:opacity-100 hover:text-rose-400 p-1 transition-all cursor-pointer shrink-0"
                        title="Delete Pack"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-900">
              <div className="flex items-center gap-2 text-zinc-500 text-2xs leading-relaxed font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span>Publish changes at the top right to apply newly configured prices and packages to the live Cost Estimator.</span>
              </div>
            </div>
          </aside>
        ) : (
          /* Leads Manager Aside Panel */
          <aside className="w-full lg:w-72 bg-slate-900/30 border-r border-slate-800 p-4 lg:p-6 space-y-6">
            {/* Lead Type Filter */}
            <div>
              <span className="block text-3xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" /> Inquiry Type
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setLeadsFilter("all")}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all flex items-center justify-between cursor-pointer ${
                    leadsFilter === "all" ? "bg-slate-800 text-gold-400 font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>All Inquiries</span>
                  <span className="text-3xs font-mono text-zinc-500 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full">{leads.length}</span>
                </button>
                <button
                  onClick={() => setLeadsFilter("contact")}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all flex items-center justify-between cursor-pointer ${
                    leadsFilter === "contact" ? "bg-slate-800 text-gold-400 font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Contact Forms</span>
                  <span className="text-3xs font-mono text-zinc-500 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full">
                    {leads.filter(l => l.type === "contact").length}
                  </span>
                </button>
                <button
                  onClick={() => setLeadsFilter("estimate")}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all flex items-center justify-between cursor-pointer ${
                    leadsFilter === "estimate" ? "bg-slate-800 text-gold-400 font-bold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Estimates Saved</span>
                  <span className="text-3xs font-mono text-zinc-500 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full">
                    {leads.filter(l => l.type === "estimate").length}
                  </span>
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <span className="block text-3xs font-semibold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Filter by Status
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => setLeadsStatusFilter("all")}
                  className={`w-full text-left px-4 py-2 rounded-lg text-2xs font-semibold tracking-wide uppercase transition-all flex items-center justify-between cursor-pointer ${
                    leadsStatusFilter === "all" ? "bg-slate-850 text-gold-400 border-l-2 border-gold-500 pl-3" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>All Statuses</span>
                </button>
                <button
                  onClick={() => setLeadsStatusFilter("new")}
                  className={`w-full text-left px-4 py-2 rounded-lg text-2xs font-semibold tracking-wide uppercase transition-all flex items-center justify-between cursor-pointer ${
                    leadsStatusFilter === "new" ? "bg-slate-850 text-gold-400 border-l-2 border-gold-500 pl-3" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>New Leads</span>
                  </span>
                  <span className="text-3xs font-mono text-zinc-500 bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded">
                    {leads.filter(l => l.status === "new" || !l.status).length}
                  </span>
                </button>
                <button
                  onClick={() => setLeadsStatusFilter("contacted")}
                  className={`w-full text-left px-4 py-2 rounded-lg text-2xs font-semibold tracking-wide uppercase transition-all flex items-center justify-between cursor-pointer ${
                    leadsStatusFilter === "contacted" ? "bg-slate-850 text-gold-400 border-l-2 border-gold-500 pl-3" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <span>Contacted</span>
                  </span>
                  <span className="text-3xs font-mono text-zinc-500 bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded">
                    {leads.filter(l => l.status === "contacted").length}
                  </span>
                </button>
                <button
                  onClick={() => setLeadsStatusFilter("completed")}
                  className={`w-full text-left px-4 py-2 rounded-lg text-2xs font-semibold tracking-wide uppercase transition-all flex items-center justify-between cursor-pointer ${
                    leadsStatusFilter === "completed" ? "bg-slate-850 text-gold-400 border-l-2 border-gold-500 pl-3" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Completed / Booked</span>
                  </span>
                  <span className="text-3xs font-mono text-zinc-500 bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded">
                    {leads.filter(l => l.status === "completed").length}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="pt-4 border-t border-slate-900 space-y-3">
              <span className="block text-3xs font-semibold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Pipeline Metrics
              </span>
              <div className="p-4 bg-slate-950/60 border border-zinc-900 rounded-xl space-y-1.5">
                <span className="block text-4xs font-mono text-zinc-500 uppercase">Estimated Total Value</span>
                <span className="block text-xl font-display font-black text-gold-400">
                  {new Intl.NumberFormat("en-TN", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(
                    leads
                      .filter(l => l.type === "estimate")
                      .reduce((acc, curr) => acc + (Number(curr.estimatedTotal) || 0), 0)
                  )}
                </span>
                <span className="block text-[9px] font-mono text-zinc-600">From {leads.filter(l => l.type === "estimate").length} submitted estimations.</span>
              </div>
            </div>
          </aside>
        )}

        {/* Workspace panel */}
        {adminMode === "translations" ? (
          <main className="flex-1 p-4 sm:p-8 space-y-6">
            {/* Section title & search bar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-3xs font-bold text-gold-500 tracking-widest uppercase">
                  Now Editing Block // {selectedLang.toUpperCase()}
                </span>
                <h2 className="font-display font-black text-xl tracking-tight text-white uppercase mt-0.5">
                  {currentSectionConfig.label}
                </h2>
              </div>

              {/* Toggle and Search */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Auto Translate Toggle */}
                <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-950/40 border border-slate-800/80 rounded-lg">
                  <input
                    type="checkbox"
                    id="auto-translate-toggle"
                    checked={autoTranslateEnabled}
                    onChange={(e) => setAutoTranslateEnabled(e.target.checked)}
                    className="w-3.5 h-3.5 accent-gold-500 cursor-pointer"
                  />
                  <label htmlFor="auto-translate-toggle" className="text-3xs font-mono font-bold text-zinc-400 uppercase tracking-wider cursor-pointer select-none flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-gold-400" /> Auto-Translate
                  </label>
                </div>

                {/* Search filter */}
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keys or labels..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-zinc-700 focus:border-gold-500/50 rounded-lg text-xs outline-none text-white transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Fields Grid */}
            <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-6">
              {keysToRender.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {keysToRender.map((key) => {
                    const baseValue = (TRANSLATIONS[selectedLang] as any)[key] || "";
                    const currentValue = editBuffer[selectedLang]?.[key] || "";
                    const isLarge = baseValue.length > 80;

                    return (
                      <div 
                        key={key} 
                        className="border-b border-slate-800/60 pb-6 last:border-0 last:pb-0 group"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="font-mono text-3xs text-gold-500/80 font-bold tracking-wider uppercase bg-gold-950/15 border border-gold-500/10 px-2 py-1 rounded">
                            {key}
                          </span>
                          <div className="flex items-center gap-2">
                            {translatingKeys[key] ? (
                              <span className="text-3xs text-gold-400 font-semibold uppercase tracking-wider flex items-center gap-1 bg-gold-950/20 border border-gold-500/20 px-2 py-0.5 rounded-full animate-pulse">
                                <Loader2 className="w-3 h-3 animate-spin text-gold-500" /> Translating...
                              </span>
                            ) : (
                              currentValue.trim() !== "" && (
                                <button
                                  type="button"
                                  onClick={() => autoTranslateField(key, currentValue, selectedLang)}
                                  title="Translate this field to other languages"
                                  className="text-3xs text-gold-400/80 hover:text-gold-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 bg-slate-950 border border-slate-800 hover:border-gold-500/30 px-2.5 py-1 rounded-full cursor-pointer transition-all active:scale-95"
                                >
                                  <Sparkles className="w-3 h-3 text-gold-400" /> Auto-Translate
                                </button>
                              )
                            )}
                            {currentValue !== "" && (
                              <span className="text-3xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1 bg-emerald-950/20 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> Customized
                              </span>
                            )}
                          </div>
                        </div>

                        {isLarge ? (
                          <div className="relative">
                            <textarea
                              value={currentValue}
                              onChange={(e) => handleFieldChange(key, e.target.value)}
                              onFocus={() => setFocusedValue(currentValue)}
                              onBlur={() => {
                                if (autoTranslateEnabled && currentValue !== focusedValue && currentValue.trim() !== "") {
                                  autoTranslateField(key, currentValue, selectedLang);
                                }
                              }}
                              placeholder={baseValue}
                              rows={3}
                              className="w-full pr-10 pl-4.5 py-3.5 bg-slate-950 border border-slate-800 hover:border-zinc-700 focus:border-gold-500/50 focus:bg-slate-950/80 rounded-xl text-xs outline-none text-zinc-100 placeholder:text-zinc-600 transition-all leading-relaxed"
                            />
                            {currentValue.trim() !== "" && !translatingKeys[key] && (
                              <button
                                type="button"
                                onClick={() => autoTranslateField(key, currentValue, selectedLang)}
                                className="absolute bottom-3 right-3 text-zinc-500 hover:text-gold-400 transition-colors p-1 bg-slate-900 border border-slate-800 rounded-md cursor-pointer"
                                title="Auto-translate to other languages"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="relative flex items-center w-full">
                            <input
                              type="text"
                              value={currentValue}
                              onChange={(e) => handleFieldChange(key, e.target.value)}
                              onFocus={() => setFocusedValue(currentValue)}
                              onBlur={() => {
                                if (autoTranslateEnabled && currentValue !== focusedValue && currentValue.trim() !== "") {
                                  autoTranslateField(key, currentValue, selectedLang);
                                }
                              }}
                              placeholder={baseValue}
                              className="w-full pr-10 pl-4.5 py-3.5 bg-slate-950 border border-slate-800 hover:border-zinc-700 focus:border-gold-500/50 focus:bg-slate-950/80 rounded-xl text-xs outline-none text-zinc-100 placeholder:text-zinc-600 transition-all"
                            />
                            {currentValue.trim() !== "" && !translatingKeys[key] && (
                              <button
                                type="button"
                                onClick={() => autoTranslateField(key, currentValue, selectedLang)}
                                className="absolute right-3 text-zinc-500 hover:text-gold-400 transition-colors p-1 bg-slate-900/60 border border-slate-800 rounded-md cursor-pointer"
                                title="Auto-translate to other languages"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-10 h-10 text-zinc-600 mx-auto mb-3.5" />
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    No Translation Keys Found
                  </h3>
                  <p className="text-2xs text-zinc-500 font-mono mt-1 max-w-sm mx-auto">
                    No matching keywords found in this section. Clear your search filter or try another section tab.
                  </p>
                </div>
              )}
            </div>
          </main>
        ) : adminMode === "estimator" ? (
          <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
            {estimatorTab === "items" ? (
              // LINE ITEMS PANEL
              <div className="space-y-8">
                <div>
                  <span className="text-3xs font-bold text-gold-500 tracking-widest uppercase">
                    Cost Estimator Configurator
                  </span>
                  <h2 className="font-display font-black text-xl tracking-tight text-white uppercase mt-0.5">
                    Production Services & Line Items
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Manage the base pricing, names, and description details of individual options across pre-production, production, and post-production.
                  </p>
                </div>

                <div className="space-y-6">
                  {estimatorBuffer.categories?.map((category: any) => {
                    const catName = category.name[selectedLang] || category.name.en || category.name;
                    return (
                      <div key={category.id} className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                          <h3 className="font-display font-bold text-sm tracking-wide text-white uppercase">
                            {catName} ({category.id})
                          </h3>
                          <button
                            onClick={() => handleAddEstimatorItem(category.id)}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-gold-400 text-2xs font-semibold rounded-lg flex items-center gap-1 uppercase transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add New Service
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          {category.items?.map((item: any) => (
                            <div key={item.id} className="bg-slate-950/60 p-4 border border-zinc-900/60 rounded-lg space-y-3 relative group">
                              <button
                                onClick={() => handleDeleteEstimatorItem(category.id, item.id)}
                                className="absolute top-4 right-4 text-zinc-600 hover:text-rose-400 p-1.5 bg-zinc-900/30 hover:bg-rose-950/20 border border-zinc-900 hover:border-rose-500/30 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
                                title="Delete Service Option"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Title and Base Price row */}
                              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                <div className="md:col-span-4">
                                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                                    Service Name ({selectedLang.toUpperCase()})
                                  </label>
                                  <input
                                    type="text"
                                    value={typeof item.name === "object" ? (item.name[selectedLang] !== undefined ? item.name[selectedLang] : item.name.en || "") : item.name}
                                    onChange={(e) => {
                                      const text = e.target.value;
                                      setEstimatorBuffer((prev: any) => {
                                        const categories = prev.categories.map((cat: any) => {
                                          if (cat.id !== category.id) return cat;
                                          return {
                                            ...cat,
                                            items: cat.items.map((it: any) => {
                                              if (it.id !== item.id) return it;
                                              const updatedName = typeof it.name === "object" ? { ...it.name, [selectedLang]: text } : { en: it.name, [selectedLang]: text };
                                              return { ...it, name: updatedName };
                                            })
                                          };
                                        });
                                        return { ...prev, categories };
                                      });
                                    }}
                                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-gold-500/40 rounded-lg text-xs text-white outline-none"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                                    Base Price (TND HT)
                                  </label>
                                  <input
                                    type="number"
                                    value={item.basePrice}
                                    onChange={(e) => handleItemBasePriceChange(category.id, item.id, parseFloat(e.target.value) || 0)}
                                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-gold-500/40 rounded-lg text-xs text-white outline-none font-mono text-right"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                                    Billing Unit
                                  </label>
                                  <select
                                    value={item.unitType}
                                    onChange={(e) => handleItemUnitTypeChange(category.id, item.id, e.target.value)}
                                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-gold-500/40 rounded-lg text-xs text-white outline-none"
                                  >
                                    <option value="flat">Flat Price</option>
                                    <option value="days">Per Day</option>
                                    <option value="hours">Per Hour</option>
                                    <option value="minutes">Per Minute</option>
                                    <option value="pages">Per Page</option>
                                  </select>
                                </div>

                                <div className="md:col-span-4 pr-12">
                                  <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                                    Service ID (Unique)
                                  </label>
                                  <input
                                    type="text"
                                    value={item.id}
                                    disabled
                                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-zinc-600 outline-none font-mono"
                                  />
                                </div>
                              </div>

                              {/* Description text area */}
                              <div>
                                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                                  Description Text ({selectedLang.toUpperCase()})
                                </label>
                                <textarea
                                  value={typeof item.description === "object" ? (item.description[selectedLang] !== undefined ? item.description[selectedLang] : item.description.en || "") : item.description}
                                  onChange={(e) => {
                                    const text = e.target.value;
                                    setEstimatorBuffer((prev: any) => {
                                      const categories = prev.categories.map((cat: any) => {
                                        if (cat.id !== category.id) return cat;
                                        return {
                                          ...cat,
                                          items: cat.items.map((it: any) => {
                                            if (it.id !== item.id) return it;
                                            const updatedDesc = typeof it.description === "object" ? { ...it.description, [selectedLang]: text } : { en: it.description, [selectedLang]: text };
                                            return { ...it, description: updatedDesc };
                                          })
                                        };
                                      });
                                      return { ...prev, categories };
                                    });
                                  }}
                                  rows={2}
                                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-gold-500/40 rounded-lg text-xs text-white outline-none leading-relaxed"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              // PACKAGE DEALS TAB
              (() => {
                const currentPack = estimatorBuffer.packs?.find((p: any) => p.id === selectedPackId);
                if (!currentPack) {
                  return (
                    <div className="text-center py-16 bg-slate-900/10 border border-slate-800/50 rounded-xl p-8">
                      <LayoutGrid className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                      <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                        No Package Deal Selected
                      </h3>
                      <p className="text-2xs text-zinc-500 font-mono mt-1.5 max-w-sm mx-auto">
                        Select an existing package in the left sidebar under Package Selection, or click the Add Package button to create one.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <span className="text-3xs font-bold text-gold-500 tracking-widest uppercase">
                          Package Editor // {selectedLang.toUpperCase()}
                        </span>
                        <h2 className="font-display font-black text-xl tracking-tight text-white uppercase mt-0.5 flex items-center gap-2">
                          <span className="text-gold-400">{currentPack.name[selectedLang] || currentPack.name.en || currentPack.name}</span>
                        </h2>
                      </div>
                      <button
                        onClick={() => handleDeletePack(currentPack.id)}
                        className="px-3.5 py-2 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 text-2xs font-semibold rounded-lg flex items-center gap-1.5 uppercase transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Package Deal
                      </button>
                    </div>

                    {/* Metadata config form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-4">
                        <h3 className="font-display font-bold text-xs tracking-wide text-zinc-400 uppercase border-b border-slate-800 pb-2">
                          Primary Information
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                              Package Name ({selectedLang.toUpperCase()})
                            </label>
                            <input
                              type="text"
                              value={currentPack.name[selectedLang] !== undefined ? currentPack.name[selectedLang] : currentPack.name.en || ""}
                              onChange={(e) => handlePackNestedFieldChange(currentPack.id, "name", selectedLang, e.target.value)}
                              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-gold-500/40 rounded-lg text-xs text-white outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                                Base Flat Price (TND HT)
                              </label>
                              <input
                                type="number"
                                value={currentPack.price}
                                onChange={(e) => handlePackFieldChange(currentPack.id, "price", parseFloat(e.target.value) || 0)}
                                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-gold-500/40 rounded-lg text-xs text-white outline-none font-mono"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                                Visual Icon
                              </label>
                              <select
                                value={currentPack.icon}
                                onChange={(e) => handlePackFieldChange(currentPack.id, "icon", e.target.value)}
                                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-gold-500/40 rounded-lg text-xs text-white outline-none"
                              >
                                <option value="Film">Film Reel (Camera)</option>
                                <option value="Briefcase">Briefcase (Commercial)</option>
                                <option value="Mic">Microphone (Audio/Podcast)</option>
                                <option value="Tv">TV Station (Broadcast)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                              Ribbon Badge text ({selectedLang.toUpperCase()})
                            </label>
                            <input
                              type="text"
                              value={currentPack.badge[selectedLang] !== undefined ? currentPack.badge[selectedLang] : currentPack.badge.en || ""}
                              onChange={(e) => handlePackNestedFieldChange(currentPack.id, "badge", selectedLang, e.target.value)}
                              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-gold-500/40 rounded-lg text-xs text-white outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                              Short Description ({selectedLang.toUpperCase()})
                            </label>
                            <textarea
                              value={currentPack.desc[selectedLang] !== undefined ? currentPack.desc[selectedLang] : currentPack.desc.en || ""}
                              onChange={(e) => handlePackNestedFieldChange(currentPack.id, "desc", selectedLang, e.target.value)}
                              rows={3}
                              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 focus:border-gold-500/40 rounded-lg text-xs text-white outline-none leading-relaxed"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Highlights Bullets Form */}
                      <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <h3 className="font-display font-bold text-xs tracking-wide text-zinc-400 uppercase">
                            Highlights & Key Points ({selectedLang.toUpperCase()})
                          </h3>
                          <button
                            onClick={() => {
                              const bulletsArr = currentPack.bullets[selectedLang] || [];
                              const updated = [...bulletsArr, "New selling point..."];
                              handlePackNestedFieldChange(currentPack.id, "bullets", selectedLang, updated);
                            }}
                            className="p-1 bg-zinc-900 border border-zinc-800 text-gold-400 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-2">
                          {(currentPack.bullets[selectedLang] || []).map((bullet: string, bIdx: number) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <span className="text-3xs font-mono text-zinc-600 font-bold bg-slate-950 border border-slate-850 px-2 py-1 rounded">
                                #{bIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => {
                                  const text = e.target.value;
                                  const bulletsArr = [...(currentPack.bullets[selectedLang] || [])];
                                  bulletsArr[bIdx] = text;
                                  handlePackNestedFieldChange(currentPack.id, "bullets", selectedLang, bulletsArr);
                                }}
                                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 focus:border-gold-500/40 rounded-lg text-xs text-white outline-none"
                              />
                              <button
                                onClick={() => {
                                  const bulletsArr = (currentPack.bullets[selectedLang] || []).filter((_: any, idx: number) => idx !== bIdx);
                                  handlePackNestedFieldChange(currentPack.id, "bullets", selectedLang, bulletsArr);
                                }}
                                className="p-1.5 hover:text-rose-400 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* SELECTIONS: WHAT IS INCLUDED IN THIS PACK */}
                    <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-4">
                      <div>
                        <h3 className="font-display font-bold text-xs tracking-wide text-zinc-400 uppercase">
                          Preset Selections (Services Included in this Package)
                        </h3>
                        <p className="text-3xs text-zinc-500 font-mono mt-1">
                          Select the specific service line items included when this package is selected by the user. Specify the default pre-filled quantity for each active item.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        {estimatorBuffer.categories?.map((cat: any) => {
                          const catName = cat.name[selectedLang] || cat.name.en || cat.name;
                          return (
                            <div key={cat.id} className="bg-slate-950/60 border border-zinc-900 rounded-xl p-4 space-y-3.5">
                              <h4 className="font-display font-black text-[11px] tracking-wider text-gold-500 uppercase border-b border-zinc-900 pb-2">
                                {catName}
                              </h4>

                              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                                {cat.items?.map((item: any) => {
                                  const selections = currentPack.selections || {};
                                  const catSelections = selections[cat.id] || [];
                                  const foundSel = catSelections.find((s: any) => s.id === item.id);
                                  const isSelected = !!foundSel;
                                  const quantity = foundSel ? foundSel.quantity : 1;
                                  const itemName = typeof item.name === "object" ? (item.name[selectedLang] || item.name.en || "") : item.name;

                                  return (
                                    <div 
                                      key={item.id} 
                                      className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 ${
                                        isSelected 
                                          ? "bg-gold-500/5 border-gold-500/20" 
                                          : "bg-slate-950 border-transparent hover:bg-slate-900/30"
                                      }`}
                                    >
                                      <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={() => handlePackSelectionToggle(currentPack.id, cat.id, item.id)}
                                          className="rounded border-zinc-800 text-gold-500 focus:ring-gold-500/30 cursor-pointer"
                                        />
                                        <span className="text-2xs font-semibold text-zinc-300 truncate leading-tight uppercase">
                                          {itemName}
                                        </span>
                                      </label>

                                      {isSelected && (
                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <span className="text-[9px] font-mono text-zinc-500 uppercase">Qty:</span>
                                          <input
                                            type="number"
                                            min={1}
                                            value={quantity}
                                            onChange={(e) => handlePackSelectionQtyChange(currentPack.id, cat.id, item.id, parseInt(e.target.value) || 1)}
                                            className="w-10 text-center bg-slate-900 border border-slate-800 rounded text-3xs font-mono text-white py-0.5"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </main>
        ) : adminMode === "assets" ? (
          /* Assets Panel Workspace (Images & Google Maps Location) */
          <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-900 pb-5">
              <div>
                <span className="text-3xs font-bold text-gold-500 tracking-widest uppercase">
                  Asset & Location Configuration
                </span>
                <h2 className="font-display font-black text-xl tracking-tight text-white uppercase mt-0.5">
                  Dynamic Images & Maps
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Manage background images, portfolio visual stills, and Google Maps embed location parameters.
                </p>
              </div>

              <button
                onClick={handleSaveAgencySettings}
                disabled={isSavingSettings}
                className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 font-display font-black text-2xs tracking-widest uppercase rounded-lg shadow-lg hover:shadow-gold-500/10 active:scale-[0.99] transition-all cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isSavingSettings ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Saving...
                  </>
                ) : settingsSaveStatus === "success" ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>

            {/* Config Subsections */}
            <div className="space-y-8">
              {/* Google Maps Configuration Card */}
              <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm tracking-wide text-white uppercase">
                      Google Maps & Location
                    </h3>
                    <p className="text-3xs text-zinc-500 uppercase font-mono mt-0.5">Configure embedded iframe maps & links</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2">
                        Iframe Map Search Query
                      </label>
                      <input
                        type="text"
                        value={settingsBuffer?.mapsLocation?.iframeQuery || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettingsBuffer((prev: any) => ({
                            ...prev,
                            mapsLocation: { ...prev.mapsLocation, iframeQuery: val }
                          }));
                        }}
                        placeholder="Video Club Production Ennasr 2 Ariana Tunisia"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-zinc-700 focus:border-gold-500/50 rounded-lg text-xs outline-none text-white transition-all font-mono"
                      />
                      <span className="block text-[9px] font-mono text-zinc-600 mt-1.5">
                        The physical address or business name used by the Google Map iframe to locate your venue.
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2">
                        Get Directions Pin Link
                      </label>
                      <input
                        type="text"
                        value={settingsBuffer?.mapsLocation?.directionsUrl || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSettingsBuffer((prev: any) => ({
                            ...prev,
                            mapsLocation: { ...prev.mapsLocation, directionsUrl: val }
                          }));
                        }}
                        placeholder="https://maps.app.goo.gl/wpghGfG57A8rkCd2A"
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-zinc-700 focus:border-gold-500/50 rounded-lg text-xs outline-none text-white transition-all font-mono"
                      />
                      <span className="block text-[9px] font-mono text-zinc-600 mt-1.5">
                        The direct share URL from Google Maps that loads the precise pin on client click.
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <span className="block text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                      Localized Location Address Lines
                    </span>
                    <div className="space-y-3.5">
                      <div>
                        <span className="block text-4xs font-mono text-zinc-500 uppercase mb-1">English Address Text</span>
                        <input
                          type="text"
                          value={settingsBuffer?.mapsLocation?.addressTextEn || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSettingsBuffer((prev: any) => ({
                              ...prev,
                              mapsLocation: { ...prev.mapsLocation, addressTextEn: val }
                            }));
                          }}
                          placeholder="24 Rue Khalij El Kamar, Ennasr 2, Ariana 2037, Tunisia"
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-zinc-700 focus:border-gold-500/50 rounded-lg text-xs outline-none text-white transition-all font-mono"
                        />
                      </div>

                      <div>
                        <span className="block text-4xs font-mono text-zinc-500 uppercase mb-1">French Address Text</span>
                        <input
                          type="text"
                          value={settingsBuffer?.mapsLocation?.addressTextFr || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSettingsBuffer((prev: any) => ({
                              ...prev,
                              mapsLocation: { ...prev.mapsLocation, addressTextFr: val }
                            }));
                          }}
                          placeholder="24 Rue Khalij El Kamar, Ennasr 2, Ariana 2037, Tunisia"
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-zinc-700 focus:border-gold-500/50 rounded-lg text-xs outline-none text-white transition-all font-mono"
                        />
                      </div>

                      <div>
                        <span className="block text-4xs font-mono text-zinc-500 uppercase mb-1">Arabic Address Text</span>
                        <input
                          type="text"
                          value={settingsBuffer?.mapsLocation?.addressTextAr || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSettingsBuffer((prev: any) => ({
                              ...prev,
                              mapsLocation: { ...prev.mapsLocation, addressTextAr: val }
                            }));
                          }}
                          placeholder="24 نهج خليج القمر، النصر 2، أريانة 2037، تونس"
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 hover:border-zinc-700 focus:border-gold-500/50 rounded-lg text-xs outline-none text-white transition-all font-mono text-right"
                          dir="rtl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Agency Brand Logo & Identity Section */}
              <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm tracking-wide text-white uppercase">
                      Agency Brand Logo & Identity
                    </h3>
                    <p className="text-3xs text-zinc-500 uppercase font-mono mt-0.5">
                      Upload a custom logo image (PNG, SVG, JPG, WebP) or use the default vector logo
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Live Logo Preview Box */}
                  <div className="md:col-span-4 p-6 bg-slate-950 border border-slate-850 rounded-xl flex flex-col items-center justify-center space-y-3 text-center">
                    <span className="text-4xs font-mono text-zinc-500 uppercase tracking-widest">
                      Current Logo Preview
                    </span>
                    <div className="h-20 w-full flex items-center justify-center p-2 bg-slate-900/50 border border-dashed border-slate-800 rounded-lg">
                      {settingsBuffer?.agencyLogo ? (
                        <img
                          key={settingsBuffer.agencyLogo}
                          src={formatGoogleDriveLink(settingsBuffer.agencyLogo, 'image')}
                          alt="Agency Logo"
                          className="max-h-16 max-w-full object-contain"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.opacity = '0.3';
                          }}
                        />
                      ) : (
                        <Logo className="h-14 w-auto" variant="navbar" />
                      )}
                    </div>
                    <span className="text-4xs font-mono text-gold-400">
                      {settingsBuffer?.agencyLogo ? "Custom Uploaded Logo" : "Default Vector SVG Logo"}
                    </span>
                  </div>

                  {/* Controls */}
                  <div className="md:col-span-8 space-y-4">
                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                        Custom Logo Image URL / Path
                      </label>
                      <input
                        type="text"
                        value={settingsBuffer?.agencyLogo || ""}
                        onChange={(e) => {
                          const val = formatGoogleDriveLink(e.target.value, 'image');
                          setSettingsBuffer((prev: any) => ({
                            ...prev,
                            agencyLogo: val
                          }));
                        }}
                        placeholder="https://domain.com/logo.png or upload file below"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 hover:border-zinc-800 focus:border-gold-500/40 rounded-lg text-xs outline-none text-white transition-all font-mono"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex-1">
                        <ImageUploader
                          label="Upload Logo File from Computer"
                          currentImageUrl={settingsBuffer?.agencyLogo || ""}
                          onUploadSuccess={(url) => {
                            setSettingsBuffer((prev: any) => ({
                              ...prev,
                              agencyLogo: url
                            }));
                          }}
                        />
                      </div>

                      {settingsBuffer?.agencyLogo && (
                        <button
                          type="button"
                          onClick={() => {
                            setSettingsBuffer((prev: any) => ({
                              ...prev,
                              agencyLogo: ""
                            }));
                          }}
                          className="px-4 py-2.5 bg-slate-950 border border-red-500/30 hover:border-red-500/60 text-red-400 hover:bg-red-500/10 text-3xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Reset to Default Vector Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Presentation Video / Showreel Section */}
              <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm tracking-wide text-white uppercase">
                      Official Presentation Video & Showreel
                    </h3>
                    <p className="text-3xs text-zinc-500 uppercase font-mono mt-0.5">
                      Upload or edit the main agency presentation video (plays in the 4K Showreel modal and featured showcase)
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Live Video Player Preview */}
                  <div className="md:col-span-5 bg-slate-950 border border-slate-850 rounded-xl overflow-hidden aspect-video relative flex items-center justify-center group shadow-xl">
                    {settingsBuffer?.presentationVideoUrl ? (
                      <video
                        src={settingsBuffer.presentationVideoUrl}
                        controls
                        playsInline
                        className="w-full h-full object-contain bg-black"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-2">
                        <Video className="w-10 h-10 text-zinc-600 mx-auto" />
                        <span className="text-3xs font-mono text-zinc-500 uppercase block font-bold">
                          No Video Uploaded
                        </span>
                        <p className="text-[10px] text-zinc-600 font-light">
                          Paste a video URL or upload an MP4/WebM video file below
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Input & Upload Controls */}
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
                        Presentation Video URL (Direct MP4 / Stream Link)
                      </label>
                      <input
                        type="text"
                        value={settingsBuffer?.presentationVideoUrl || ""}
                        onChange={(e) => {
                          const val = formatGoogleDriveLink(e.target.value, 'video');
                          setSettingsBuffer((prev: any) => ({
                            ...prev,
                            presentationVideoUrl: val
                          }));
                        }}
                        placeholder="https://videoclubproduction.com/.../presentation.mp4 or upload file below"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-850 hover:border-zinc-800 focus:border-gold-500/40 rounded-lg text-xs outline-none text-white transition-all font-mono"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex-1">
                        <ImageUploader
                          label="Upload Presentation Video File (MP4, WebM)"
                          acceptType="video"
                          maxSizeMB={100}
                          currentImageUrl={settingsBuffer?.presentationVideoUrl || ""}
                          onUploadSuccess={(url) => {
                            setSettingsBuffer((prev: any) => ({
                              ...prev,
                              presentationVideoUrl: url
                            }));
                          }}
                        />
                      </div>

                      {settingsBuffer?.presentationVideoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setSettingsBuffer((prev: any) => ({
                              ...prev,
                              presentationVideoUrl: ""
                            }));
                          }}
                          className="px-4 py-2.5 bg-slate-950 border border-red-500/30 hover:border-red-500/60 text-red-400 hover:bg-red-500/10 text-3xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove Video
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Slide Images Section */}
              <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm tracking-wide text-white uppercase">
                      Hero Slideshow Backgrounds
                    </h3>
                    <p className="text-3xs text-zinc-500 uppercase font-mono mt-0.5">Customize the main landing header images</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((idx) => {
                    const fallbackUrls = [
                      "/uploads/hero-1.jpg",
                      "/uploads/studio-plateau.jpg",
                      "/uploads/studio-podcast.jpg"
                    ];
                    const val = settingsBuffer?.heroImages?.[idx] || "";
                    const currentUrl = val || fallbackUrls[idx];

                    return (
                      <div key={idx} className="space-y-3.5 p-4 bg-slate-950/40 border border-zinc-900 rounded-xl flex flex-col justify-between">
                        <div>
                          <span className="block text-3xs font-bold text-gold-500 tracking-wider font-mono uppercase mb-2">
                            Hero Slide #{idx + 1}
                          </span>
                          
                          {/* Image preview */}
                          <div className="w-full h-32 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden relative mb-3">
                            <img
                              src={currentUrl}
                              alt={`Hero preview #${idx + 1}`}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = fallbackUrls[idx];
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-2.5">
                              <span className="text-4xs font-mono text-zinc-400 truncate w-full">
                                {val ? "Custom Asset" : "Default Asset"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-4xs font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                            Image URL
                          </label>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => {
                              const inputVal = formatGoogleDriveLink(e.target.value, 'image');
                              setSettingsBuffer((prev: any) => {
                                const arr = [...(prev.heroImages || ["", "", ""])];
                                arr[idx] = inputVal;
                                return { ...prev, heroImages: arr };
                              });
                            }}
                            placeholder={fallbackUrls[idx]}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-850 hover:border-zinc-800 focus:border-gold-500/40 rounded text-3xs outline-none text-white transition-all font-mono mb-2"
                          />
                          <ImageUploader
                            label="Or Upload Image File"
                            currentImageUrl={val}
                            onUploadSuccess={(url) => {
                              setSettingsBuffer((prev: any) => {
                                const arr = [...(prev.heroImages || ["", "", ""])];
                                arr[idx] = url;
                                return { ...prev, heroImages: arr };
                              });
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Studio Tour Images */}
              <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm tracking-wide text-white uppercase">
                      Interactive Studio Tour Backgrounds
                    </h3>
                    <p className="text-3xs text-zinc-500 uppercase font-mono mt-0.5">Customize the background images for the interactive studio tour spaces</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      id: "plateau",
                      title: "Main Shooting Stage (Plateau Principal)",
                      defaultImg: "/uploads/studio-plateau.jpg"
                    },
                    {
                      id: "podcast",
                      title: "Podcast Studio (Studio Podcast)",
                      defaultImg: "/uploads/studio-podcast.jpg"
                    }
                  ].map((space) => {
                    const val = settingsBuffer?.studioTourImages?.[space.id] || "";
                    const currentImg = val || space.defaultImg;

                    return (
                      <div key={space.id} className="p-4 bg-slate-950/40 border border-zinc-900 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="block text-3xs font-black text-gold-400 uppercase tracking-wider">
                            {space.title}
                          </span>
                          <span className="text-4xs font-mono text-zinc-500 uppercase">Space ID: {space.id}</span>
                        </div>

                        <div className="w-full h-36 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden relative">
                          <img
                            src={currentImg}
                            alt={space.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = space.defaultImg;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent flex items-end p-2.5">
                            <span className="text-4xs font-mono text-zinc-400 truncate w-full">
                              {val ? "Custom Asset" : "Default Asset"}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-4xs font-mono text-zinc-500 uppercase tracking-widest">
                            Image URL
                          </label>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => {
                              const inputVal = formatGoogleDriveLink(e.target.value, 'image');
                              setSettingsBuffer((prev: any) => ({
                                ...prev,
                                studioTourImages: {
                                  ...(prev.studioTourImages || {}),
                                  [space.id]: inputVal
                                }
                              }));
                            }}
                            placeholder={space.defaultImg}
                            className="w-full px-3 py-2 bg-slate-950 border border-slate-850 hover:border-zinc-800 focus:border-gold-500/40 rounded text-3xs outline-none text-white transition-all font-mono"
                          />
                          <ImageUploader
                            label="Or Upload Studio Photo"
                            currentImageUrl={val}
                            onUploadSuccess={(url) => {
                              setSettingsBuffer((prev: any) => ({
                                ...prev,
                                studioTourImages: {
                                  ...(prev.studioTourImages || {}),
                                  [space.id]: url
                                }
                              }));
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Portfolio Works (Visual Stills) */}
              <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Film className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm tracking-wide text-white uppercase">
                      Portfolio Works Stills
                    </h3>
                    <p className="text-3xs text-zinc-500 uppercase font-mono mt-0.5">Manage the thumbnail still frames for each project</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(() => {
                    const customProjects = settingsBuffer?.customProjects || [];
                    const allProjects = [
                      ...PORTFOLIO_WORKS.map((work) => {
                        const cp = customProjects.find((p: any) => p.id === work.id);
                        return cp ? { ...work, ...cp } : work;
                      }),
                      ...customProjects.filter((cp: any) => !PORTFOLIO_WORKS.some((w) => w.id === cp.id))
                    ];

                    return allProjects.map((work: any) => {
                      const fallbackStill = work.visualStill || (work.youtubeId ? `https://img.youtube.com/vi/${work.youtubeId}/hqdefault.jpg` : "/uploads/p8.jpg");
                      const val = settingsBuffer?.portfolioImages?.[work.id] || "";
                      const currentStill = val || fallbackStill;

                      return (
                        <div key={work.id} className="p-4 bg-slate-950/40 border border-zinc-900 rounded-xl flex gap-4 items-center">
                          <div className="w-24 h-24 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden relative shrink-0">
                            <img
                              src={currentStill}
                              alt={work.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = fallbackStill;
                              }}
                            />
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            <div>
                              <span className="block text-3xs font-black text-white uppercase tracking-wider truncate">
                                {work.title}
                              </span>
                              <span className="block text-4xs font-mono text-zinc-500 uppercase">ID: {work.id}</span>
                            </div>

                            <div className="space-y-2">
                              <input
                                type="text"
                                value={val}
                                onChange={(e) => {
                                  const inputVal = formatGoogleDriveLink(e.target.value, 'image');
                                  setSettingsBuffer((prev: any) => ({
                                    ...prev,
                                    portfolioImages: {
                                      ...(prev.portfolioImages || {}),
                                      [work.id]: inputVal
                                    }
                                  }));
                                }}
                                placeholder={fallbackStill}
                                className="w-full px-3 py-2 bg-slate-950 border border-slate-850 hover:border-zinc-800 focus:border-gold-500/40 rounded text-3xs outline-none text-white transition-all font-mono"
                              />
                              <ImageUploader
                                label="Or Upload Project Thumbnail"
                                currentImageUrl={val}
                                onUploadSuccess={(url) => {
                                  setSettingsBuffer((prev: any) => ({
                                    ...prev,
                                    portfolioImages: {
                                      ...(prev.portfolioImages || {}),
                                      [work.id]: url
                                    }
                                  }));
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Team Bios/Photos section */}
              <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm tracking-wide text-white uppercase">
                      Creative Team Portraits
                    </h3>
                    <p className="text-3xs text-zinc-500 uppercase font-mono mt-0.5">Customize member portraits and profile photos</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { id: "sofiene", name: "Sofiene" },
                    { id: "hazem", name: "Hazem" }
                  ].map((member) => {
                    const fallbackPhotos: Record<string, string> = {
                      "sofiene": "/uploads/team-female.jpg",
                      "hazem": "/uploads/team-male.jpg"
                    };

                    const val = settingsBuffer?.teamImages?.[member.id] || "";
                    const currentPhoto = val || fallbackPhotos[member.id];

                    return (
                      <div key={member.id} className="p-4 bg-slate-950/40 border border-zinc-900 rounded-xl flex gap-4 items-center">
                        <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 overflow-hidden relative shrink-0">
                          <img
                            src={currentPhoto}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = fallbackPhotos[member.id];
                            }}
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                          <div>
                            <span className="block text-3xs font-black text-white uppercase tracking-wider truncate">
                              {member.name}
                            </span>
                            <span className="block text-4xs font-mono text-zinc-500 uppercase">ID: {member.id}</span>
                          </div>

                          <div className="space-y-2">
                            <input
                              type="text"
                              value={val}
                              onChange={(e) => {
                                const inputVal = formatGoogleDriveLink(e.target.value, 'image');
                                setSettingsBuffer((prev: any) => ({
                                  ...prev,
                                  teamImages: {
                                    ...(prev.teamImages || {}),
                                    [member.id]: inputVal
                                  }
                                }));
                              }}
                              placeholder="Portrait image URL..."
                              className="w-full px-3 py-2 bg-slate-950 border border-slate-850 hover:border-zinc-800 focus:border-gold-500/40 rounded text-3xs outline-none text-white transition-all font-mono"
                            />
                            <ImageUploader
                              label="Or Upload Portrait File"
                              currentImageUrl={val}
                              onUploadSuccess={(url) => {
                                setSettingsBuffer((prev: any) => ({
                                  ...prev,
                                  teamImages: {
                                    ...(prev.teamImages || {}),
                                    [member.id]: url
                                  }
                                }));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Trusted Brands & Partner Logos Section */}
              <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm tracking-wide text-white uppercase">
                      Trusted Brands & Partner Logos
                    </h3>
                    <p className="text-3xs text-zinc-500 uppercase font-mono mt-0.5">Manage custom brand and client partner logos</p>
                  </div>
                </div>

                {/* Information Callout */}
                <div className="p-3 bg-zinc-950/40 border border-zinc-850 rounded-lg text-3xs text-zinc-400 leading-relaxed font-sans">
                  <span className="text-gold-400 font-bold uppercase block mb-1">PRO-TIP: FALLBACK SYSTEM IS ACTIVE</span>
                  If no custom partner logos are added, the website will automatically display the default set of elegant creative brand logos (HA Power Academy, BurdaBleau, Control F, CFJJB, etc.).
                </div>

                {/* Add New Partner Brand Form */}
                <div className="p-4 bg-slate-950/40 border border-zinc-900 rounded-xl space-y-4">
                  <span className="block text-3xs font-black text-white uppercase tracking-wider font-mono">
                    Add Custom Partner Brand
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-4xs font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                        Brand / Partner Name
                      </label>
                      <input
                        type="text"
                        value={newPartnerName}
                        onChange={(e) => setNewPartnerName(e.target.value)}
                        placeholder="e.g. Acme Studio"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-850 hover:border-zinc-800 focus:border-gold-500/40 rounded text-3xs outline-none text-white transition-all font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                        Logo Image URL
                      </label>
                      <input
                        type="text"
                        value={newPartnerUrl}
                        onChange={(e) => setNewPartnerUrl(e.target.value)}
                        placeholder="e.g. https://domain.com/logo.png"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-850 hover:border-zinc-800 focus:border-gold-500/40 rounded text-3xs outline-none text-white transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div className="max-w-md">
                    <ImageUploader
                      label="Or Upload Partner Logo File"
                      currentImageUrl={newPartnerUrl}
                      onUploadSuccess={(url) => {
                        setNewPartnerUrl(url);
                      }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newPartnerName.trim()) {
                          alert("Please specify a Partner Brand Name.");
                          return;
                        }
                        const newLogo = {
                          id: "partner_" + Date.now(),
                          name: newPartnerName.trim(),
                          url: newPartnerUrl.trim()
                        };
                        setSettingsBuffer((prev: any) => ({
                          ...prev,
                          partnerLogos: [...(prev.partnerLogos || []), newLogo]
                        }));
                        setNewPartnerName("");
                        setNewPartnerUrl("");
                      }}
                      className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-gold-400 hover:text-white hover:bg-zinc-850 transition-all text-3xs font-mono font-bold uppercase rounded-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Partner
                    </button>
                  </div>
                </div>

                {/* Currently Configured Brands List */}
                <div className="space-y-3">
                  <span className="block text-3xs font-black text-white uppercase tracking-wider font-mono">
                    Currently Configured Partner Logos ({(settingsBuffer?.partnerLogos || []).length})
                  </span>
                  
                  {(settingsBuffer?.partnerLogos || []).length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-zinc-900 rounded-xl text-zinc-500 font-mono text-3xs uppercase">
                      No custom partners defined. Showing 7 elegant defaults.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(settingsBuffer.partnerLogos).map((cl: any, index: number) => (
                        <div key={cl.id || index} className="p-3.5 bg-slate-950/60 border border-zinc-900 rounded-xl flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded bg-slate-950 border border-slate-850 overflow-hidden flex items-center justify-center shrink-0">
                              {cl.url ? (
                                <img
                                  src={cl.url}
                                  alt={cl.name}
                                  className="w-full h-full object-contain filter grayscale brightness-200"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <span className="text-4xs font-mono font-black text-zinc-600">TXT</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <span className="block text-3xs font-black text-white uppercase tracking-wider truncate">
                                {cl.name}
                              </span>
                              <span className="block text-4xs font-mono text-zinc-500 truncate">
                                {cl.url || "Text fallback only"}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSettingsBuffer((prev: any) => ({
                                ...prev,
                                partnerLogos: (prev.partnerLogos || []).filter((item: any) => item.id !== cl.id)
                              }));
                            }}
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-900/60 rounded transition-colors cursor-pointer shrink-0"
                            title="Delete Partner logo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {(settingsBuffer?.partnerLogos || []).length > 0 && (
                    <div className="flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Are you sure you want to clear all custom partner logos and revert to the default elite partners?")) {
                            setSettingsBuffer((prev: any) => ({
                              ...prev,
                              partnerLogos: []
                            }));
                          }
                        }}
                        className="text-4xs font-mono font-bold text-red-400 hover:text-red-300 transition-colors uppercase cursor-pointer"
                      >
                        Reset to default elite partners
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Direct Contact & Social Links Section */}
              <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm tracking-wide text-white uppercase">
                      Agency Hotline, Direct Contact & Socials
                    </h3>
                    <p className="text-3xs text-zinc-500 uppercase font-mono mt-0.5">Configure phone numbers, email, WhatsApp, and social media channels</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-4xs font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                      Hotline Phone Display
                    </label>
                    <input
                      type="text"
                      value={settingsBuffer?.contactInfo?.phone || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettingsBuffer((prev: any) => ({
                          ...prev,
                          contactInfo: { ...(prev.contactInfo || {}), phone: val }
                        }));
                      }}
                      placeholder="(+216) 54 610 546"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 hover:border-zinc-800 focus:border-gold-500/40 rounded text-3xs outline-none text-white transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                      Phone Call Tel Protocol Link
                    </label>
                    <input
                      type="text"
                      value={settingsBuffer?.contactInfo?.phoneTel || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettingsBuffer((prev: any) => ({
                          ...prev,
                          contactInfo: { ...(prev.contactInfo || {}), phoneTel: val }
                        }));
                      }}
                      placeholder="+21654610546"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 hover:border-zinc-800 focus:border-gold-500/40 rounded text-3xs outline-none text-white transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                      Primary Direct Email Address
                    </label>
                    <input
                      type="text"
                      value={settingsBuffer?.contactInfo?.email || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettingsBuffer((prev: any) => ({
                          ...prev,
                          contactInfo: { ...(prev.contactInfo || {}), email: val }
                        }));
                      }}
                      placeholder="videoclubproduction11@gmail.com"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 hover:border-zinc-800 focus:border-gold-500/40 rounded text-3xs outline-none text-white transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                      WhatsApp Direct Chat Link
                    </label>
                    <input
                      type="text"
                      value={settingsBuffer?.contactInfo?.whatsapp || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettingsBuffer((prev: any) => ({
                          ...prev,
                          contactInfo: { ...(prev.contactInfo || {}), whatsapp: val }
                        }));
                      }}
                      placeholder="https://wa.me/21654610546?text=Bonjour..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 hover:border-zinc-800 focus:border-gold-500/40 rounded text-3xs outline-none text-white transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                      Instagram Profile URL
                    </label>
                    <input
                      type="text"
                      value={settingsBuffer?.contactInfo?.instagram || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettingsBuffer((prev: any) => ({
                          ...prev,
                          contactInfo: { ...(prev.contactInfo || {}), instagram: val }
                        }));
                      }}
                      placeholder="https://instagram.com/videoclubproduction"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 hover:border-zinc-800 focus:border-gold-500/40 rounded text-3xs outline-none text-white transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-mono text-zinc-500 uppercase tracking-widest mb-1.5">
                      Facebook Page URL
                    </label>
                    <input
                      type="text"
                      value={settingsBuffer?.contactInfo?.facebook || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSettingsBuffer((prev: any) => ({
                          ...prev,
                          contactInfo: { ...(prev.contactInfo || {}), facebook: val }
                        }));
                      }}
                      placeholder="https://facebook.com/videoclubproduction"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 hover:border-zinc-800 focus:border-gold-500/40 rounded text-3xs outline-none text-white transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

            </div>
          </main>
        ) : adminMode === "projects" ? (
          /* Projects Workspace */
          <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-3xs font-bold text-gold-500 tracking-widest uppercase">
                  Dynamic Portfolio Management
                </span>
                <h2 className="font-display font-black text-xl tracking-tight text-white uppercase mt-0.5">
                  Projects & Visual Showcase
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Add new projects, edit visual stills, YouTube video IDs, clients, and technical specs.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProject({
                      id: "project-" + Date.now(),
                      title: "",
                      client: "",
                      category: "commercial",
                      director: "Sofien Chaouch",
                      dp: "Youssef Guezguez",
                      year: new Date().getFullYear().toString(),
                      duration: "2:00",
                      camera: "RED V-Raptor XL 8K",
                      visualStill: "",
                      youtubeId: "",
                      description: "",
                      challenge: "",
                      solution: "",
                      tags: "Commercial, Cinematic, 4K"
                    });
                    setIsEditingProjectModal(true);
                  }}
                  className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-slate-950 font-display font-black text-2xs tracking-widest uppercase rounded-lg shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New Project
                </button>

                <button
                  type="button"
                  onClick={handleSaveAgencySettings}
                  disabled={isSavingSettings}
                  className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 font-display font-black text-2xs tracking-widest uppercase rounded-lg shadow-lg hover:shadow-gold-500/10 active:scale-[0.99] transition-all cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isSavingSettings ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : settingsSaveStatus === "success" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save All Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* List of Projects Grid */}
            {(() => {
              const customProjects = settingsBuffer?.customProjects || [];
              const allProjects = [
                ...PORTFOLIO_WORKS.map((work) => {
                  const cp = customProjects.find((p: any) => p.id === work.id);
                  return cp ? { ...work, ...cp } : work;
                }),
                ...customProjects.filter((cp: any) => !PORTFOLIO_WORKS.some((w) => w.id === cp.id))
              ];

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allProjects.map((project: any) => {
                    const still = settingsBuffer?.portfolioImages?.[project.id] || project.visualStill || "/uploads/p8.jpg";
                    const isCustom = customProjects.some((cp: any) => cp.id === project.id);

                    return (
                      <div key={project.id} className="bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between group">
                        <div>
                          <div className="h-44 relative bg-slate-950 overflow-hidden">
                            <img
                              src={still}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-3 left-3 flex gap-2">
                              <span className="px-2 py-0.5 bg-gold-500 text-slate-950 text-[9px] font-black uppercase rounded">
                                {project.category}
                              </span>
                              {isCustom && (
                                <span className="px-2 py-0.5 bg-blue-500 text-white text-[9px] font-mono font-bold uppercase rounded">
                                  Custom
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-5 space-y-2">
                            <h3 className="font-display font-bold text-base text-white uppercase tracking-tight">
                              {project.title}
                            </h3>
                            <p className="text-3xs font-mono text-zinc-400 uppercase">
                              Client: <strong className="text-gold-400">{project.client}</strong> • {project.year} • {project.duration}
                            </p>
                            <p className="text-xs text-zinc-400 font-light line-clamp-2 mt-2">
                              {project.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-950/40 border-t border-slate-850 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProject({ ...project, visualStill: still });
                              setIsEditingProjectModal(true);
                            }}
                            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-gold-500/40 text-gold-400 text-3xs font-bold uppercase rounded transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Settings className="w-3 h-3" />
                            Edit Project
                          </button>

                          {isCustom && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete project "${project.title}"?`)) {
                                  setSettingsBuffer((prev: any) => ({
                                    ...prev,
                                    customProjects: (prev.customProjects || []).filter((cp: any) => cp.id !== project.id)
                                  }));
                                }
                              }}
                              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </main>
        ) : adminMode === "team" ? (
          /* Team Workspace */
          <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-3xs font-bold text-gold-500 tracking-widest uppercase">
                  Creative Directors & Crew Roster
                </span>
                <h2 className="font-display font-black text-xl tracking-tight text-white uppercase mt-0.5">
                  Team Roster & Architects
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Manage team member profiles, roles, headshot portraits, bios, and creative specialties.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingTeamMember({
                      id: "member-" + Date.now(),
                      name: "",
                      role: "Director of Photography",
                      bio: "",
                      specialties: "Anamorphic Optics, Color Grading",
                      image: ""
                    });
                    setIsEditingTeamModal(true);
                  }}
                  className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-slate-950 font-display font-black text-2xs tracking-widest uppercase rounded-lg shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Team Member
                </button>

                <button
                  type="button"
                  onClick={handleSaveAgencySettings}
                  disabled={isSavingSettings}
                  className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 font-display font-black text-2xs tracking-widest uppercase rounded-lg shadow-lg hover:shadow-gold-500/10 active:scale-[0.99] transition-all cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isSavingSettings ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : settingsSaveStatus === "success" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save All Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* List of Team Members Grid */}
            {(() => {
              const customTeam = settingsBuffer?.customTeam || [];
              const allTeam = [
                ...TEAM_MEMBERS.map((mem) => {
                  const ct = customTeam.find((tm: any) => tm.id === mem.id);
                  return ct ? { ...mem, ...ct } : mem;
                }),
                ...customTeam.filter((ct: any) => !TEAM_MEMBERS.some((tm) => tm.id === ct.id))
              ];

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allTeam.map((member: any) => {
                    const portrait = settingsBuffer?.teamImages?.[member.id] || member.image || "/uploads/team-female.jpg";
                    const isCustom = customTeam.some((ct: any) => ct.id === member.id);

                    return (
                      <div key={member.id} className="bg-slate-900/30 border border-slate-800 rounded-xl p-6 flex gap-5 items-start">
                        <div className="w-24 h-28 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden relative shrink-0">
                          <img
                            src={portrait}
                            alt={member.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight truncate">
                              {member.name}
                            </h3>
                            {isCustom && (
                              <span className="px-2 py-0.5 bg-blue-500 text-white text-[8px] font-mono font-bold uppercase rounded">
                                Custom
                              </span>
                            )}
                          </div>
                          <span className="block text-3xs font-mono text-gold-400 font-bold uppercase">
                            {member.role}
                          </span>
                          <p className="text-xs text-zinc-400 font-light line-clamp-3">
                            {member.bio}
                          </p>

                          <div className="pt-2 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingTeamMember({ ...member, image: portrait });
                                setIsEditingTeamModal(true);
                              }}
                              className="px-3 py-1 bg-zinc-900 border border-zinc-800 hover:border-gold-500/40 text-gold-400 text-3xs font-bold uppercase rounded transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <Settings className="w-3 h-3" />
                              Edit Profile
                            </button>

                            {isCustom && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Delete team member "${member.name}"?`)) {
                                    setSettingsBuffer((prev: any) => ({
                                      ...prev,
                                      customTeam: (prev.customTeam || []).filter((ct: any) => ct.id !== member.id)
                                    }));
                                  }
                                }}
                                className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded transition-colors cursor-pointer"
                                title="Delete Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </main>
        ) : adminMode === "faqs" ? (
          /* FAQs Workspace */
          <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-3xs font-bold text-gold-500 tracking-widest uppercase">
                  Production Intelligence & Knowledge Base
                </span>
                <h2 className="font-display font-black text-xl tracking-tight text-white uppercase mt-0.5">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Manage client questions and detailed answers across English, French, and Arabic.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingFaq({
                      id: "faq-" + Date.now(),
                      question: { en: "", fr: "", ar: "" },
                      answer: { en: "", fr: "", ar: "" }
                    });
                    setIsEditingFaqModal(true);
                  }}
                  className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-slate-950 font-display font-black text-2xs tracking-widest uppercase rounded-lg shadow-lg transition-all cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add FAQ Item
                </button>

                <button
                  type="button"
                  onClick={handleSaveAgencySettings}
                  disabled={isSavingSettings}
                  className="px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 font-display font-black text-2xs tracking-widest uppercase rounded-lg shadow-lg hover:shadow-gold-500/10 active:scale-[0.99] transition-all cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isSavingSettings ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : settingsSaveStatus === "success" ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save All Changes
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* List of FAQs */}
            {(() => {
              const customFaqs = settingsBuffer?.customFaqs || [];
              const activeFaqs = customFaqs.length > 0 ? customFaqs : FAQ_DATA;

              return (
                <div className="space-y-4">
                  {activeFaqs.map((faq: any, idx: number) => (
                    <div key={faq.id || idx} className="p-5 bg-slate-900/30 border border-slate-800 rounded-xl space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="font-display font-bold text-sm text-white uppercase tracking-tight">
                            FR: {faq.question?.fr || faq.question?.en}
                          </h4>
                          <span className="block text-3xs font-mono text-zinc-400">
                            EN: {faq.question?.en}
                          </span>
                          {faq.question?.ar && (
                            <span className="block text-3xs font-mono text-gold-400/80" style={{ direction: "rtl" }}>
                              AR: {faq.question?.ar}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingFaq(faq);
                              setIsEditingFaqModal(true);
                            }}
                            className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:border-gold-500/40 text-gold-400 text-3xs font-bold uppercase rounded transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Settings className="w-3 h-3" />
                            Edit FAQ
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm("Delete this FAQ item?")) {
                                setSettingsBuffer((prev: any) => ({
                                  ...prev,
                                  customFaqs: (prev.customFaqs && prev.customFaqs.length > 0 ? prev.customFaqs : FAQ_DATA).filter((item: any) => item.id !== faq.id)
                                }));
                              }
                            }}
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-900 rounded transition-colors cursor-pointer"
                            title="Delete FAQ"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-950/60 rounded-lg text-xs text-zinc-350 font-light leading-relaxed">
                        {faq.answer?.fr || faq.answer?.en}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </main>
        ) : adminMode === "google" ? (
          /* Google Connection Workspace */
          <main className="flex-1 p-4 sm:p-8 space-y-8 overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-900 pb-5">
              <div>
                <span className="text-3xs font-bold text-gold-500 tracking-widest uppercase">
                  Google Workspace & API Connection
                </span>
                <h2 className="font-display font-black text-xl tracking-tight text-white uppercase mt-0.5">
                  Calendar & Gmail Integration
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Connect your Google account to automatically sync free/busy time blocks for clients and receive booking notifications via Gmail.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Connection Status Card */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-sm tracking-wide text-white uppercase">
                        OAuth 2.0 Connection Status
                      </h3>
                      <p className="text-3xs text-zinc-500 uppercase font-mono mt-0.5">Manage secure workspace tokens</p>
                    </div>
                  </div>

                  {settingsBuffer?.googleConnection?.accessToken ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-emerald-950/10 border border-emerald-500/20 rounded-lg flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide">Successfully Connected</h4>
                          <p className="text-2xs text-zinc-400 mt-1 leading-relaxed">
                            Your Google Workspace integration is active. The system can read calendar free/busy slots and route automated emails through Gmail.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-1">
                          <span className="block text-4xs font-mono text-zinc-500 uppercase">Authorized Admin Account</span>
                          <span className="block text-2xs font-mono text-white font-bold truncate">
                            {settingsBuffer.googleConnection.adminEmail || "Connected"}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-950 border border-slate-850 rounded-lg space-y-1">
                          <span className="block text-4xs font-mono text-zinc-500 uppercase">Authorized At</span>
                          <span className="block text-2xs font-mono text-white font-semibold">
                            {settingsBuffer.googleConnection.connectedAt ? new Date(settingsBuffer.googleConnection.connectedAt).toLocaleString() : "Unknown"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-850">
                        <span className="text-3xs text-zinc-500 font-mono uppercase">Need to change accounts?</span>
                        <button
                          onClick={async () => {
                            if (!window.confirm("Are you sure you want to disconnect your Google integration? This will halt real-time booking calendar syncing and Gmail notification dispatches.")) return;
                            try {
                              await logoutGoogle();
                              const updatedSettings = {
                                ...settingsBuffer,
                                googleConnection: {
                                  accessToken: "",
                                  adminEmail: "",
                                  connectedAt: ""
                                }
                              };
                              setSettingsBuffer(updatedSettings);
                              
                              // Save straight to server
                              const response = await fetch("/api/agency-settings", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ token, settings: updatedSettings })
                              });
                              if (response.ok) {
                                await reloadAgencySettings();
                              }
                            } catch (err) {
                              console.error("Failed to disconnect:", err);
                            }
                          }}
                          className="px-4 py-2 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 text-2xs font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Unlink className="w-3.5 h-3.5" />
                          Disconnect Account
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        To activate calendar scheduling block checking and Gmail notifications, authorize your account through Google OAuth 2.0. We request read-only access to Calendar availability and permission to send transaction notification emails using Gmail.
                      </p>

                      <div className="p-4 bg-amber-950/10 border border-amber-500/20 rounded-lg flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide">Setup Prerequisite</h4>
                          <p className="text-2xs text-zinc-400 mt-1 leading-relaxed font-light">
                            Please ensure your Google pop-ups blocker is disabled to complete authentication. If prompted, grant all requested permissions.
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-center py-6">
                        <button
                          onClick={async () => {
                            try {
                              const result = await googleSignIn();
                              if (result) {
                                const updatedSettings = {
                                  ...settingsBuffer,
                                  googleConnection: {
                                    accessToken: result.accessToken,
                                    adminEmail: result.user.email || "",
                                    connectedAt: new Date().toISOString()
                                  }
                                };
                                setSettingsBuffer(updatedSettings);

                                // Save settings to database immediately
                                const response = await fetch("/api/agency-settings", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ token, settings: updatedSettings })
                                });
                                if (response.ok) {
                                  await reloadAgencySettings();
                                  alert("Google connection successfully established and saved to your agency profile!");
                                } else {
                                  alert("Connected to Google successfully, but failed to persist tokens to database.");
                                }
                              }
                            } catch (error: any) {
                              console.error("Sign-In failed:", error);
                              alert("Google OAuth connection failed. Please try again: " + (error.message || ""));
                            }
                          }}
                          className="px-6 py-3 bg-white text-slate-950 hover:bg-zinc-200 transition-all font-display font-black text-2xs tracking-widest uppercase rounded-lg shadow-xl cursor-pointer flex items-center gap-2.5 active:scale-[0.98]"
                        >
                          <svg className="w-4 h-4 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Connect Admin Google Account
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Scope Checklist / Explanations Card */}
              <div className="space-y-6">
                <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-850 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                      <LayoutGrid className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-sm tracking-wide text-white uppercase">
                        Active Integrations
                      </h3>
                      <p className="text-3xs text-zinc-500 uppercase font-mono mt-0.5">Automated workflow metrics</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xs font-bold text-white uppercase flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gold-400" />
                          Google Calendar Sync
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${settingsBuffer?.googleConnection?.accessToken ? "bg-emerald-950/20 text-emerald-400 border border-emerald-500/10" : "bg-zinc-950 text-zinc-500 border border-zinc-800"}`}>
                          {settingsBuffer?.googleConnection?.accessToken ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-3xs text-zinc-400 leading-relaxed font-light font-sans">
                        Automatically queries free/busy blocks from Google Calendar to block unavailable dates during client booking selection. No client sees personal details—only availability block indicators.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xs font-bold text-white uppercase flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-gold-400" />
                          Gmail Notifications
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${settingsBuffer?.googleConnection?.accessToken ? "bg-emerald-950/20 text-emerald-400 border border-emerald-500/10" : "bg-zinc-950 text-zinc-500 border border-zinc-800"}`}>
                          {settingsBuffer?.googleConnection?.accessToken ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-3xs text-zinc-400 leading-relaxed font-light font-sans">
                        Whenever a client fills out the "Contact Us" form or confirms a booking session, an automated email gets sent directly to the connected administrator Gmail address containing full client records and calculation parameters.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xs font-bold text-white uppercase flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-gold-400" />
                          Google Sheets Database Sync
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${settingsBuffer?.googleConnection?.accessToken ? "bg-emerald-950/20 text-emerald-400 border border-emerald-500/10" : "bg-zinc-950 text-zinc-500 border border-zinc-800"}`}>
                          {settingsBuffer?.googleConnection?.accessToken ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-3xs text-zinc-400 leading-relaxed font-light font-sans">
                        Automatically appends new lead details, scheduled slots, and calculated budgets to the "Video Club Production - Leads Database" Google Sheet in real-time.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-850 rounded-lg space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xs font-bold text-white uppercase flex items-center gap-2">
                          <HardDrive className="w-3.5 h-3.5 text-gold-400" />
                          Google Drive Brief Uploads
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${settingsBuffer?.googleConnection?.accessToken ? "bg-emerald-950/20 text-emerald-400 border border-emerald-500/10" : "bg-zinc-950 text-zinc-500 border border-zinc-800"}`}>
                          {settingsBuffer?.googleConnection?.accessToken ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-3xs text-zinc-400 leading-relaxed font-light font-sans">
                        Generates a beautifully structured text-based Production Brief for every client and uploads it to the designated "Video Club Production Briefs" folder on Google Drive.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        ) : (
          /* Leads Panel Workspace */
          <main className="flex-1 p-4 sm:p-8 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-3xs font-bold text-gold-500 tracking-widest uppercase">
                  Lead & Inquiry Log Registry
                </span>
                <h2 className="font-display font-black text-xl tracking-tight text-white uppercase mt-0.5">
                  Client Leads Ledger
                </h2>
                <p className="text-xs text-zinc-500 mt-1">
                  Secure real-time ledger recording submitted budget calculations and contact forms.
                </p>
              </div>

              <button
                onClick={fetchLeads}
                className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-zinc-700 hover:bg-slate-900 text-zinc-300 hover:text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? "animate-spin" : ""}`} />
                Refresh Log
              </button>
            </div>

            {leadsError && (
              <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl text-rose-300 text-xs">
                {leadsError}
              </div>
            )}

            {isLoadingLeads ? (
              <div className="p-12 text-center text-zinc-500 text-xs font-mono">
                <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-3" />
                Retrieving inquiry logs from safe vault...
              </div>
            ) : (
              (() => {
                // Filter leads
                const filteredLeads = leads.filter((lead) => {
                  const matchesType = 
                    leadsFilter === "all" || 
                    lead.type === leadsFilter;
                  
                  const status = lead.status || "new";
                  const matchesStatus = 
                    leadsStatusFilter === "all" || 
                    status === leadsStatusFilter;
                  
                  return matchesType && matchesStatus;
                });

                if (filteredLeads.length === 0) {
                  return (
                    <div className="bg-slate-900/20 border border-slate-800 rounded-xl p-12 text-center space-y-2">
                      <div className="p-3 bg-zinc-900 text-zinc-600 rounded-full w-fit mx-auto mb-1">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h4 className="font-display font-bold text-xs uppercase tracking-wider text-zinc-400">
                        No Inquiries Logged
                      </h4>
                      <p className="text-3xs text-zinc-600 font-mono max-w-xs mx-auto">
                        Inbound client leads and price estimations will automatically synchronize here once submitted in live client interface.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {filteredLeads.map((lead) => {
                      const isEstimate = lead.type === "estimate";
                      const dateStr = lead.createdAt 
                        ? new Date(lead.createdAt).toLocaleString("fr-TN")
                        : "Unknown Date";
                      const status = lead.status || "new";

                      return (
                        <div 
                          key={lead.id} 
                          className="bg-slate-900/30 border border-zinc-900 hover:border-zinc-800 rounded-xl overflow-hidden transition-all"
                        >
                          {/* Header / Primary details */}
                          <div className="p-5 flex flex-wrap items-center justify-between gap-4 border-b border-zinc-900/40">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                                  isEstimate 
                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                                    : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                }`}>
                                  {isEstimate ? "Budget Estimate" : "Contact Inquiry"}
                                </span>
                                <span className="text-4xs font-mono text-zinc-600 uppercase">
                                  {lead.id}
                                </span>
                              </div>
                              <h3 className="font-display font-black text-sm text-white uppercase tracking-tight">
                                {lead.name}
                              </h3>
                              <p className="text-3xs font-mono text-zinc-400 flex items-center gap-1.5">
                                <span>{lead.email}</span>
                                {lead.company && (
                                  <>
                                    <span className="text-zinc-600">•</span>
                                    <span className="text-gold-400/80">{lead.company}</span>
                                  </>
                                )}
                              </p>
                            </div>

                            {/* Center parameters */}
                            <div className="flex flex-wrap items-center gap-6">
                              {isEstimate ? (
                                <div className="text-right">
                                  <span className="block text-4xs font-mono text-zinc-500 uppercase">Estimated Budget</span>
                                  <span className="text-sm font-mono text-white font-bold">
                                    {new Intl.NumberFormat("en-TN", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(lead.estimatedTotal)}
                                  </span>
                                </div>
                              ) : (
                                <div className="text-right">
                                  <span className="block text-4xs font-mono text-zinc-500 uppercase">Client Budget</span>
                                  <span className="text-2xs font-mono text-white font-semibold">
                                    {lead.budget || "N/A"}
                                  </span>
                                </div>
                              )}

                              {(lead.bookingSessions && lead.bookingSessions.length > 0) ? (
                                <div className="text-right px-3 py-1.5 bg-gold-500/10 border border-gold-500/20 rounded-lg max-w-[240px]">
                                  <span className="block text-[8px] font-mono text-gold-500 uppercase font-black tracking-wider">Booked ({lead.bookingSessions.length} Sessions)</span>
                                  <div className="flex flex-col gap-1 mt-1 text-left">
                                    {lead.bookingSessions.map((s: any, sIdx: number) => (
                                      <span key={sIdx} className="text-[10px] font-mono text-white/95 block leading-tight">
                                        📅 {s.dayLabel ? `${s.dayLabel}` : s.date} @ {s.time}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ) : lead.bookingDate ? (
                                <div className="text-right px-3 py-1 bg-gold-500/10 border border-gold-500/20 rounded-lg">
                                  <span className="block text-[8px] font-mono text-gold-500 uppercase font-black tracking-wider">Booked Session</span>
                                  <span className="text-xs font-mono text-white font-bold">
                                    {lead.bookingDate} @ {lead.bookingTime}
                                  </span>
                                </div>
                              ) : null}

                              <div className="text-right hidden sm:block">
                                <span className="block text-4xs font-mono text-zinc-500 uppercase">Submission Date</span>
                                <span className="text-3xs font-mono text-zinc-400">
                                  {dateStr}
                                </span>
                              </div>

                              {/* Status Select dropdown */}
                              <div className="flex items-center gap-2">
                                <select
                                  value={status}
                                  onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                                  className={`px-3 py-1 bg-zinc-950 border text-3xs font-bold rounded-lg cursor-pointer focus:outline-none uppercase ${
                                    status === "new" 
                                      ? "border-blue-500/30 text-blue-400 bg-blue-950/10" 
                                      : status === "contacted" 
                                      ? "border-amber-500/30 text-amber-400 bg-amber-950/10" 
                                      : "border-emerald-500/30 text-emerald-400 bg-emerald-950/10"
                                  }`}
                                >
                                  <option value="new" className="bg-slate-950 text-blue-400">New</option>
                                  <option value="contacted" className="bg-slate-950 text-amber-400">Contacted</option>
                                  <option value="completed" className="bg-slate-950 text-emerald-400">Booked</option>
                                </select>

                                {/* Delete */}
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="p-1.5 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/20 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                                  title="Remove Lead"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Body / Detailed Section */}
                          <div className="bg-slate-950/40 p-5 space-y-3.5 border-t border-zinc-900/30">
                            {isEstimate ? (
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                                    Budget Estimation Breakdown ({lead.selectedItems?.length || 0} active line items)
                                  </h4>
                                  <span className="text-4xs font-mono text-zinc-500 uppercase">Package preset: {lead.packId}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {lead.selectedItems?.map((item: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center p-2.5 bg-zinc-950 border border-zinc-900 rounded-lg">
                                      <div className="space-y-0.5">
                                        <span className="block text-2xs font-semibold text-zinc-300 uppercase leading-none">{item.name}</span>
                                        <span className="block text-4xs font-mono text-zinc-600">Qty: {item.quantity} × {new Intl.NumberFormat("en-TN", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(item.basePrice)}</span>
                                      </div>
                                      <span className="text-2xs font-mono text-gold-400 font-bold">
                                        {new Intl.NumberFormat("en-TN", { style: "currency", currency: "TND", maximumFractionDigits: 0 }).format(item.cost)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
                                    Contact Us // Detailed Message & Goals
                                  </h4>
                                  <div className="flex gap-4 text-4xs font-mono text-zinc-500 uppercase">
                                    <span>Timeline: <strong className="text-zinc-300">{lead.timeline}</strong></span>
                                    <span>Project Type: <strong className="text-zinc-300">{lead.projectType}</strong></span>
                                  </div>
                                </div>
                                <p className="bg-zinc-950 border border-zinc-900 p-4 rounded-lg text-xs leading-relaxed text-zinc-300 font-light whitespace-pre-line">
                                  {lead.message || "No message left."}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            )}
          </main>
        )}

        {/* Project Edit Modal */}
        <AnimatePresence>
          {isEditingProjectModal && editingProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-3xs font-mono font-bold text-gold-500 uppercase tracking-widest">
                      Portfolio Project Management
                    </span>
                    <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
                      {editingProject.title ? `Edit: ${editingProject.title}` : "New Project Showcase"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsEditingProjectModal(false)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Project Title</label>
                      <input
                        type="text"
                        value={editingProject.title || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        placeholder="e.g. Elyssar Brand Film"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Client Name</label>
                      <input
                        type="text"
                        value={editingProject.client || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, client: e.target.value })}
                        placeholder="e.g. Elyssar"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Category</label>
                      <select
                        value={editingProject.category || "commercial"}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                      >
                        <option value="commercial">Commercial</option>
                        <option value="branded">Branded</option>
                        <option value="documentary">Documentary</option>
                        <option value="photography">Photography</option>
                        <option value="music-video">Music Video</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Year</label>
                      <input
                        type="text"
                        value={editingProject.year || "2026"}
                        onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Duration</label>
                      <input
                        type="text"
                        value={editingProject.duration || "2:00"}
                        onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                        placeholder="e.g. 1:45"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Director</label>
                      <input
                        type="text"
                        value={editingProject.director || "Sofien Chaouch"}
                        onChange={(e) => setEditingProject({ ...editingProject, director: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                      />
                    </div>

                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Director of Photography (DP)</label>
                      <input
                        type="text"
                        value={editingProject.dp || "Youssef Guezguez"}
                        onChange={(e) => setEditingProject({ ...editingProject, dp: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Video Source (YouTube ID or Direct MP4 Link / Upload)</label>
                    <input
                      type="text"
                      value={editingProject.youtubeId || editingProject.videoUrl || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, youtubeId: formatGoogleDriveLink(e.target.value, 'video'), videoUrl: formatGoogleDriveLink(e.target.value, 'video') })}
                      placeholder="YouTube ID (e.g. TuXP4MTPta4) or MP4 URL"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none font-mono focus:border-gold-500/50 mb-2"
                    />
                    <ImageUploader
                      label="Or Upload Video File for this Project (MP4, WebM)"
                      acceptType="video"
                      maxSizeMB={100}
                      currentImageUrl={editingProject.videoUrl || ""}
                      onUploadSuccess={(url) => setEditingProject({ ...editingProject, videoUrl: url })}
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Visual Still Image URL</label>
                    <input
                      type="text"
                      value={editingProject.visualStill || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, visualStill: formatGoogleDriveLink(e.target.value, 'image') })}
                      placeholder="https://domain.com/image.jpg"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none font-mono focus:border-gold-500/50 mb-2"
                    />
                    <ImageUploader
                      label="Or Upload Project Thumbnail"
                      currentImageUrl={editingProject.visualStill || ""}
                      onUploadSuccess={(url) => setEditingProject({ ...editingProject, visualStill: url })}
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingProject.description || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      placeholder="High-level summary of the visual campaign..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Tags (Comma-separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingProject.tags) ? editingProject.tags.join(", ") : editingProject.tags || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value.split(",").map((s) => s.trim()) })}
                      placeholder="Cinematic, Commercial, 4K"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingProjectModal(false)}
                    className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-zinc-400 text-xs font-bold uppercase rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!editingProject.title.trim()) {
                        alert("Please enter a Project Title.");
                        return;
                      }

                      setSettingsBuffer((prev: any) => {
                        const existingCustom = prev.customProjects || [];
                        const index = existingCustom.findIndex((p: any) => p.id === editingProject.id);

                        let updatedCustom;
                        if (index >= 0) {
                          updatedCustom = [...existingCustom];
                          updatedCustom[index] = editingProject;
                        } else {
                          updatedCustom = [...existingCustom, editingProject];
                        }

                        // Also save still url in portfolioImages
                        const updatedStills = {
                          ...(prev.portfolioImages || {}),
                          [editingProject.id]: editingProject.visualStill
                        };

                        return {
                          ...prev,
                          customProjects: updatedCustom,
                          portfolioImages: updatedStills
                        };
                      });

                      setIsEditingProjectModal(false);
                    }}
                    className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-slate-950 font-display font-black text-xs uppercase tracking-widest rounded-lg cursor-pointer shadow-lg"
                  >
                    Save Project
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Team Member Edit Modal */}
        <AnimatePresence>
          {isEditingTeamModal && editingTeamMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-3xs font-mono font-bold text-gold-500 uppercase tracking-widest">
                      Team Roster Management
                    </span>
                    <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
                      {editingTeamMember.name ? `Edit: ${editingTeamMember.name}` : "Add Team Member"}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsEditingTeamModal(false)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editingTeamMember.name || ""}
                      onChange={(e) => setEditingTeamMember({ ...editingTeamMember, name: e.target.value })}
                      placeholder="e.g. Sofiene Chaouch"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Role / Position Title</label>
                    <input
                      type="text"
                      value={editingTeamMember.role || ""}
                      onChange={(e) => setEditingTeamMember({ ...editingTeamMember, role: e.target.value })}
                      placeholder="e.g. Founder / Director of Photography"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Headshot Portrait Image URL</label>
                    <input
                      type="text"
                      value={editingTeamMember.image || ""}
                      onChange={(e) => setEditingTeamMember({ ...editingTeamMember, image: formatGoogleDriveLink(e.target.value, 'image') })}
                      placeholder="https://domain.com/portrait.jpg"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none font-mono focus:border-gold-500/50 mb-2"
                    />
                    <ImageUploader
                      label="Or Upload Headshot Portrait"
                      currentImageUrl={editingTeamMember.image || ""}
                      onUploadSuccess={(url) => setEditingTeamMember({ ...editingTeamMember, image: url })}
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Biography / Summary</label>
                    <textarea
                      rows={4}
                      value={editingTeamMember.bio || ""}
                      onChange={(e) => setEditingTeamMember({ ...editingTeamMember, bio: e.target.value })}
                      placeholder="Creative philosophy and background..."
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                    />
                  </div>

                  <div>
                    <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Specialties (Comma-separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(editingTeamMember.specialties) ? editingTeamMember.specialties.join(", ") : editingTeamMember.specialties || ""}
                      onChange={(e) => setEditingTeamMember({ ...editingTeamMember, specialties: e.target.value.split(",").map((s) => s.trim()) })}
                      placeholder="Anamorphic Optics, Color Grading, Aerial Drone"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingTeamModal(false)}
                    className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-zinc-400 text-xs font-bold uppercase rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!editingTeamMember.name.trim()) {
                        alert("Please enter Team Member Name.");
                        return;
                      }

                      setSettingsBuffer((prev: any) => {
                        const existingCustom = prev.customTeam || [];
                        const index = existingCustom.findIndex((tm: any) => tm.id === editingTeamMember.id);

                        let updatedCustom;
                        if (index >= 0) {
                          updatedCustom = [...existingCustom];
                          updatedCustom[index] = editingTeamMember;
                        } else {
                          updatedCustom = [...existingCustom, editingTeamMember];
                        }

                        // Also update teamImages
                        const updatedImages = {
                          ...(prev.teamImages || {}),
                          [editingTeamMember.id]: editingTeamMember.image
                        };

                        return {
                          ...prev,
                          customTeam: updatedCustom,
                          teamImages: updatedImages
                        };
                      });

                      setIsEditingTeamModal(false);
                    }}
                    className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-slate-950 font-display font-black text-xs uppercase tracking-widest rounded-lg cursor-pointer shadow-lg"
                  >
                    Save Member Profile
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* FAQ Edit Modal */}
        <AnimatePresence>
          {isEditingFaqModal && editingFaq && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-3xs font-mono font-bold text-gold-500 uppercase tracking-widest">
                      FAQ Management
                    </span>
                    <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
                      Edit FAQ Item
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsEditingFaqModal(false)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* English */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <span className="text-3xs font-mono font-bold text-gold-400 uppercase tracking-wider block">
                      English (EN)
                    </span>
                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Question (EN)</label>
                      <input
                        type="text"
                        value={editingFaq.question?.en || ""}
                        onChange={(e) => setEditingFaq({ ...editingFaq, question: { ...(editingFaq.question || {}), en: e.target.value } })}
                        placeholder="How long does a production take?"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Answer (EN)</label>
                      <textarea
                        rows={3}
                        value={editingFaq.answer?.en || ""}
                        onChange={(e) => setEditingFaq({ ...editingFaq, answer: { ...(editingFaq.answer || {}), en: e.target.value } })}
                        placeholder="Detailed answer..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                      />
                    </div>
                  </div>

                  {/* French */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <span className="text-3xs font-mono font-bold text-blue-400 uppercase tracking-wider block">
                      French (FR)
                    </span>
                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Question (FR)</label>
                      <input
                        type="text"
                        value={editingFaq.question?.fr || ""}
                        onChange={(e) => setEditingFaq({ ...editingFaq, question: { ...(editingFaq.question || {}), fr: e.target.value } })}
                        placeholder="Combien de temps prend une production ?"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Answer (FR)</label>
                      <textarea
                        rows={3}
                        value={editingFaq.answer?.fr || ""}
                        onChange={(e) => setEditingFaq({ ...editingFaq, answer: { ...(editingFaq.answer || {}), fr: e.target.value } })}
                        placeholder="Réponse détaillée..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50"
                      />
                    </div>
                  </div>

                  {/* Arabic */}
                  <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                    <span className="text-3xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                      Arabic (AR)
                    </span>
                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Question (AR)</label>
                      <input
                        type="text"
                        value={editingFaq.question?.ar || ""}
                        onChange={(e) => setEditingFaq({ ...editingFaq, question: { ...(editingFaq.question || {}), ar: e.target.value } })}
                        placeholder="ما هي المدة المستغرقة؟"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50 text-right"
                        style={{ direction: "rtl" }}
                      />
                    </div>
                    <div>
                      <label className="block text-4xs font-mono text-zinc-400 uppercase mb-1">Answer (AR)</label>
                      <textarea
                        rows={3}
                        value={editingFaq.answer?.ar || ""}
                        onChange={(e) => setEditingFaq({ ...editingFaq, answer: { ...(editingFaq.answer || {}), ar: e.target.value } })}
                        placeholder="الإجابة بالتفصيل..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white outline-none focus:border-gold-500/50 text-right"
                        style={{ direction: "rtl" }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingFaqModal(false)}
                    className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-zinc-400 text-xs font-bold uppercase rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!editingFaq.question?.en?.trim() && !editingFaq.question?.fr?.trim()) {
                        alert("Please fill at least English or French question.");
                        return;
                      }

                      setSettingsBuffer((prev: any) => {
                        const currentFaqs = (prev.customFaqs && prev.customFaqs.length > 0) ? prev.customFaqs : FAQ_DATA;
                        const index = currentFaqs.findIndex((f: any) => f.id === editingFaq.id);

                        let updatedFaqs;
                        if (index >= 0) {
                          updatedFaqs = [...currentFaqs];
                          updatedFaqs[index] = editingFaq;
                        } else {
                          updatedFaqs = [...currentFaqs, editingFaq];
                        }

                        return {
                          ...prev,
                          customFaqs: updatedFaqs
                        };
                      });

                      setIsEditingFaqModal(false);
                    }}
                    className="px-5 py-2 bg-gold-500 hover:bg-gold-400 text-slate-950 font-display font-black text-xs uppercase tracking-widest rounded-lg cursor-pointer shadow-lg"
                  >
                    Save FAQ
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
