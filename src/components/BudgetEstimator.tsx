import React, { useState } from "react";
import { INITIAL_BUDGET_CATEGORIES } from "../data/agencyData";
import { CostCategory, CostItem } from "../types";
import { Calculator, Check, ArrowRight, Sparkles, HelpCircle, RefreshCw, Send, Film, Briefcase, Mic, Tv, Loader2, Calendar, Clock, ShieldCheck, Lock, ChevronLeft, ChevronRight, Trash, Plus, X, Receipt, Info } from "lucide-react";
import { useApp } from "../context/AppContext";
import { motion } from "motion/react";
import { formatGoogleDriveLink } from "../utils/googleDrive";

const ICON_MAP = {
  Film,
  Briefcase,
  Mic,
  Tv
};

export const DEFAULT_PACKS = [
  {
    id: "essential",
    name: {
      en: "Essential Studio Recording",
      fr: "Session Studio Simple",
      ar: "جلسة الاستوديو الأساسية"
    },
    price: 1000,
    icon: Film,
    badge: {
      en: "Studio & Gear",
      fr: "Studio & Matériel",
      ar: "الاستوديو والمعدات"
    },
    desc: {
      en: "Simple hour-based studio session with raw space and a professional camera kit.",
      fr: "Simple session de studio à l'heure avec espace brut et kit caméra professionnel.",
      ar: "جلسة استوديو بسيطة بالساعة مع توفير الفضاء الخام وحزمة الكاميرا الاحترافية."
    },
    bullets: {
      en: ["2 Hours Studio Rental", "1 Camera package included", "1 Professional Videographer", "RAW footage delivery"],
      fr: ["2 Heures de location studio", "1 Pack caméra inclus", "1 Vidéaste professionnel", "Livraison des rushes bruts"],
      ar: ["ساعتان كراء استوديو", "حزمة كاميرا واحدة مدرجة", "مصور فيديو محترف واحد", "تسليم المشاهد الخام"]
    },
    selections: {
      "location-studio": [
        { id: "studio-hour", quantity: 2 }
      ],
      "location-materiel": [
        { id: "camera-rental", quantity: 1 }
      ],
      "ressources-humaines": [
        { id: "videographer-halfday", quantity: 1 }
      ]
    }
  },
  {
    id: "showcase",
    name: {
      en: "Reel / TikTok Creator",
      fr: "Pack Créateur Reel",
      ar: "باقة صناع المحتوى والريلز"
    },
    price: 1450,
    icon: Briefcase,
    badge: {
      en: "Reels & Shorts",
      fr: "Reels & Shorts",
      ar: "مقاطع ريلز وقصيرة"
    },
    desc: {
      en: "Half-day studio session dedicated to high-impact social media Reels and short videos.",
      fr: "Session studio d'une demi-journée dédiée aux Reels et vidéos courtes à fort impact.",
      ar: "جلسة استوديو لنصف يوم مخصصة لإنتاج مقاطع ريلز وفيديوهات قصيرة عالية التأثير."
    },
    bullets: {
      en: ["5 Hours Studio Access", "1 Camera & Microphone", "1 Professional Videographer", "2 Dynamic Reels editing", "Animated Captions included"],
      fr: ["5 Heures d'accès studio", "1 Caméra & Microphone", "1 Vidéaste professionnel", "Montage de 2 Reels dynamiques", "Sous-titres animés inclus"],
      ar: ["5 ساعات دخول للاستوديو", "كاميرا وميكروفون واحد", "مصور فيديو محترف واحد", "مونتاج مقطعي ريلز ديناميكيين", "ترجمة وعناوين متحركة مدرجة"]
    },
    selections: {
      "location-studio": [
        { id: "studio-halfday", quantity: 1 }
      ],
      "location-materiel": [
        { id: "camera-rental", quantity: 1 }
      ],
      "post-production": [
        { id: "editing-reel-dynamic", quantity: 2 },
        { id: "captions-subtitles", quantity: 2 }
      ],
      "ressources-humaines": [
        { id: "videographer-halfday", quantity: 1 }
      ]
    }
  },
  {
    id: "podcast",
    name: {
      en: "Podcast Master Suite",
      fr: "Pack Podcast Élite",
      ar: "باقة البودكاست النخبوية"
    },
    price: 1600,
    icon: Mic,
    badge: {
      en: "Multi-Cam Show",
      fr: "Émission Multi-Cam",
      ar: "برنامج متعدد الكاميرات"
    },
    desc: {
      en: "Complete multi-camera podcast episode recording and broadcast-grade editing.",
      fr: "Enregistrement complet d'un épisode de podcast multi-caméras et montage de niveau diffusion.",
      ar: "تسجيل كامل لحلقة بودكاست متعددة الكاميرات مع مونتاج وهندسة صوت احترافية."
    },
    bullets: {
      en: ["5 Hours Studio Access", "2 Cinematic Cameras", "2 Pro Microphones", "Full Episode Editing", "1 Videographer & Sound Engineer"],
      fr: ["5 Heures d'accès studio", "2 Caméras cinématographiques", "2 Microphones professionnels", "Montage complet de l'épisode", "1 Vidéaste & 1 Ingénieur du son"],
      ar: ["5 ساعات دخول للاستوديو", "كاميرتان سينمائيتان", "ميكروفونان احترافيان", "مونتاج الحلقة الكاملة", "مصور فيديو واحد ومهندس صوت واحد"]
    },
    selections: {
      "location-studio": [
        { id: "studio-halfday", quantity: 1 }
      ],
      "location-materiel": [
        { id: "camera-rental", quantity: 2 },
        { id: "microphone-rental", quantity: 2 }
      ],
      "post-production": [
        { id: "editing-podcast", quantity: 1 }
      ],
      "ressources-humaines": [
        { id: "videographer-halfday", quantity: 1 },
        { id: "sound-engineer-fullday", quantity: 1 }
      ]
    }
  },
  {
    id: "cinema",
    name: {
      en: "Elite Production Day",
      fr: "Pack Production Élite",
      ar: "باقة الإنتاج السينمائي الإبداعية"
    },
    price: 3050,
    icon: Tv,
    badge: {
      en: "Complete Creative Day",
      fr: "Création Élite",
      ar: "يوم إبداعي متكامل"
    },
    desc: {
      en: "Full production day with complete studio access, professional photography, videography, and premium editing.",
      fr: "Journée complète de production avec accès studio total, photo/vidéo pro et montage premium.",
      ar: "يوم كامل من الإنتاج مع دخول كامل للاستوديو، تصوير فوتوغرافي وفيديو احترافي ومونتاج ممتاز."
    },
    bullets: {
      en: ["8 Hours Full Studio", "Dual Camera & Mic Setup", "Professional Photographer", "Professional Videographer & Assistant", "3 Dynamic Reels & Editing"],
      fr: ["8 Heures de studio complet", "Configuration double caméra & mic", "Photographe professionnel", "Vidéaste pro & Assistant technique", "Montage de 3 Reels dynamiques"],
      ar: ["8 ساعات كاملة في الاستوديو", "إعداد كاميرتين وميكروفونين", "مصور فوتوغرافي محترف", "مصور فيديو محترف ومساعد", "مونتاج 3 مقاطع ريلز ديناميكية"]
    },
    selections: {
      "location-studio": [
        { id: "studio-fullday", quantity: 1 }
      ],
      "location-materiel": [
        { id: "camera-rental", quantity: 2 },
        { id: "microphone-rental", quantity: 2 }
      ],
      "post-production": [
        { id: "editing-reel-dynamic", quantity: 3 },
        { id: "captions-subtitles", quantity: 3 }
      ],
      "ressources-humaines": [
        { id: "videographer-fullday", quantity: 1 },
        { id: "photographer-fullday", quantity: 1 },
        { id: "technician-fullday", quantity: 1 }
      ]
    }
  }
];

const STUDIO_VIEWS = [
  {
    id: "plateau",
    name: {
      en: "Main Shooting Stage",
      fr: "Plateau Principal",
      ar: "البلاتو الرئيسي"
    },
    image: "/uploads/studio-plateau.jpg",
    hotspots: [
      {
        id: "p1",
        x: 25,
        y: 30,
        title: {
          en: "Professional Lighting Grid",
          fr: "Grille d'Éclairage Professionnelle",
          ar: "شبكة إضاءة احترافية"
        },
        desc: {
          en: "Overhead softboxes, adjustable LED panels, and spotlight arrays.",
          fr: "Boîtes à lumière suspendues, panneaux LED réglables et projecteurs.",
          ar: "إضاءة علوية ناعمة (Softboxes)، ألواح LED قابلة للتعديل ومجموعات إضاءة مركزة."
        }
      },
      {
        id: "p2",
        x: 75,
        y: 55,
        title: {
          en: "Seamless Backgrounds",
          fr: "Fonds Sans Couture",
          ar: "خلفيات ورقية سلسة"
        },
        desc: {
          en: "Motorized multi-color paper and vinyl background rollers.",
          fr: "Rouleaux motorisés de papiers colorés et vinyles de qualité studio.",
          ar: "بكرات خلفية ورقية وفينيل متعددة الألوان بمحركات لسهولة التبديل."
        }
      },
      {
        id: "p3",
        x: 45,
        y: 75,
        title: {
          en: "4K Cinematic Camera",
          fr: "Caméra Cinématographique 4K",
          ar: "كاميرا سينمائية بدقة 4K"
        },
        desc: {
          en: "High-end cinematic camera package equipped with master anamorphic lenses.",
          fr: "Ensemble caméra haut de gamme équipé d'objectifs anamorphiques maîtres.",
          ar: "كاميرا سينمائية احترافية مجهزة بعدسات أنامورفيك رئيسية."
        }
      }
    ]
  },
  {
    id: "podcast",
    name: {
      en: "Podcast Studio",
      fr: "Studio Podcast",
      ar: "استوديو البودكاست"
    },
    image: "/uploads/studio-podcast.jpg",
    hotspots: [
      {
        id: "pod1",
        x: 35,
        y: 45,
        title: {
          en: "Broadcast Microphones",
          fr: "Microphones de Diffusion",
          ar: "ميكروفونات البث الإذاعي"
        },
        desc: {
          en: "Premium vocal mics with studio-grade boom arms and shock mounts.",
          fr: "Micros vocaux haut de gamme avec bras articulés et suspensions antichoc.",
          ar: "ميكروفونات صوتية متميزة مع أذرع مرنة وحوامل مضادة للاهتزاز."
        }
      },
      {
        id: "pod2",
        x: 70,
        y: 35,
        title: {
          en: "Acoustic Treatment",
          fr: "Traitement Acoustique",
          ar: "العزل والمعالجة الصوتية"
        },
        desc: {
          en: "Custom sound-absorbing wood slat panels for pristine recording quality.",
          fr: "Panneaux de lattes de bois insonorisants pour un son d'une netteté absolue.",
          ar: "ألواح خشبية ممتصة للصوت مخصصة للحصول على جودة صوت نقية وخالية من الصدى."
        }
      },
      {
        id: "pod3",
        x: 50,
        y: 65,
        title: {
          en: "Multi-Cam Setup",
          fr: "Configuration Multi-Cam",
          ar: "إعداد الكاميرات المتعددة"
        },
        desc: {
          en: "3-Camera active shooting angle with live switching capability.",
          fr: "3 Angles de prise de vue actifs avec possibilité de commutation en direct.",
          ar: "زوايا تصوير نشطة بـ 3 كاميرات مع إمكانية التبديل المباشر للبث."
        }
      }
    ]
  }
];

interface BudgetEstimatorProps {
  onEstimateSaved: (totalAmount: number, itemsCount: number) => void;
}

export default function BudgetEstimator({ onEstimateSaved }: BudgetEstimatorProps) {
  const { language, t, data, dir, estimatorConfig, agencySettings } = useApp();

  const packs = estimatorConfig?.packs || DEFAULT_PACKS;
  const baseCategories = estimatorConfig?.categories || INITIAL_BUDGET_CATEGORIES;

  const [categories, setCategories] = useState<CostCategory[]>(baseCategories);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingSessions, setBookingSessions] = useState<Array<{ date: string; time: string; dayLabel?: string }>>([]);
  const [bookingMode, setBookingMode] = useState<"hourly" | "daily">("hourly");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activePack, setActivePack] = useState<string | null>(null);
  const [activeStudioTab, setActiveStudioTab] = useState("plateau");
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const [clickedHotspot, setClickedHotspot] = useState<string | null>(null);
  const [busySlots, setBusySlots] = useState<Array<{ start: string; end: string }>>([]);
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [wizardStep, setWizardStep] = useState<number>(0);
  const [localToast, setLocalToast] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "location-studio": true,
    "location-materiel": false,
    "ressources-humaines": false,
    "post-production": false,
  });

  const isInitialStepMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialStepMount.current) {
      isInitialStepMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const el = document.getElementById("budget-wizard-container");
      if (el) {
        const yOffset = -90;
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [wizardStep]);

  React.useEffect(() => {
    if (localToast) {
      const timer = setTimeout(() => {
        setLocalToast(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [localToast]);

  React.useEffect(() => {
    const fetchBusySlots = async () => {
      try {
        const res = await fetch("/api/google/calendar-freebusy");
        if (res.ok) {
          const data = await res.json();
          if (data.connected && data.busy) {
            setBusySlots(data.busy);
            setIsCalendarConnected(true);
          }
        }
      } catch (err) {
        console.error("Error fetching busy slots:", err);
      }
    };
    fetchBusySlots();
  }, []);

  const isTimeSlotBusy = (date: string, time: string): boolean => {
    if (!date || !time || busySlots.length === 0) return false;
    try {
      const startPart = time.includes(" - ") ? time.split(" - ")[0] : time;
      const chosenDateTime = new Date(`${date}T${startPart}`);
      if (isNaN(chosenDateTime.getTime())) return false;
      
      let durationHours = 2;
      if (time.includes(" - ")) {
        const parts = time.split(" - ");
        const startH = parseInt(parts[0].split(":")[0], 10);
        const endH = parseInt(parts[1].split(":")[0], 10);
        durationHours = endH - startH;
      } else {
        durationHours = 1;
      }
      
      const chosenEnd = new Date(chosenDateTime.getTime() + durationHours * 60 * 60 * 1000);

      return busySlots.some((slot) => {
        const start = new Date(slot.start);
        const end = new Date(slot.end);
        return (chosenDateTime < end && chosenEnd > start);
      });
    } catch (err) {
      console.error("Error verifying slot busy state:", err);
      return false;
    }
  };

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const getMonthDays = (viewedDate: Date) => {
    const year = viewedDate.getFullYear();
    const month = viewedDate.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday = 0, Monday = 1...
    const totalDays = new Date(year, month + 1, 0).getDate(); // total days in month
    
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    
    const cells = [];
    
    // Fill in days from previous month to align starting weekday
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthTotalDays - i);
      cells.push({
        dateObject: d,
        isCurrentMonth: false,
        dayNumber: prevMonthTotalDays - i
      });
    }
    
    // Fill in current month days
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      cells.push({
        dateObject: d,
        isCurrentMonth: true,
        dayNumber: i
      });
    }
    
    // Fill in remaining cells from next month to complete the grid (up to 42 cells)
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      cells.push({
        dateObject: d,
        isCurrentMonth: false,
        dayNumber: i
      });
    }
    
    return cells;
  };

  const isDateSelectable = (d: Date): boolean => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    maxDate.setHours(23,59,59,999);
    
    return d >= today && d <= maxDate;
  };

  const getDateString = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const date = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${date}`;
  };

  const formatMonthHeader = (d: Date) => {
    const year = d.getFullYear();
    const monthIdx = d.getMonth();
    if (language === "ar") {
      const monthsAr = ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
      return `${monthsAr[monthIdx]} ${year}`;
    } else if (language === "fr") {
      const monthsFr = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
      return `${monthsFr[monthIdx]} ${year}`;
    } else {
      const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return `${monthsEn[monthIdx]} ${year}`;
    }
  };

  const formatSelectedDayFullLabel = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(`${dateStr}T00:00:00`);
      if (isNaN(d.getTime())) return dateStr;
      const dayIdx = d.getDay();
      const monthIdx = d.getMonth();
      const dateNum = d.getDate();
      if (language === "ar") {
        const weekdaysAr = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
        const monthsAr = ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
        return `${weekdaysAr[dayIdx]}، ${dateNum} ${monthsAr[monthIdx]}`;
      } else if (language === "fr") {
        const weekdaysFr = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
        const monthsFr = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
        return `${weekdaysFr[dayIdx]} ${dateNum} ${monthsFr[monthIdx]}`;
      } else {
        const weekdaysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return `${weekdaysEn[dayIdx]}, ${monthsEn[monthIdx]} ${dateNum}`;
      }
    } catch (err) {
      return dateStr;
    }
  };

  React.useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const date = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${date}`;
    if (!bookingDate) {
      setBookingDate(todayStr);
    }
    if (!bookingTime) {
      setBookingTime("14:00");
    }
  }, []);

  React.useEffect(() => {
    if (estimatorConfig?.categories) {
      setCategories(JSON.parse(JSON.stringify(estimatorConfig.categories)));
    } else {
      setCategories(JSON.parse(JSON.stringify(INITIAL_BUDGET_CATEGORIES)));
    }
  }, [estimatorConfig?.categories]);

  // Dynamically update Studio / Hourly / Daily items quantity & total price based on booked sessions count
  React.useEffect(() => {
    if (bookingSessions.length === 0) return;

    // Count how many hourly sessions (2h each) vs full day sessions (8h each) are booked in total
    const hourlySessionsCount = bookingSessions.filter(s => s.time !== "09:00 - 18:00").length;
    const dailySessionsCount = bookingSessions.filter(s => s.time === "09:00 - 18:00").length;

    setCategories(prevCats =>
      prevCats.map(cat => {
        return {
          ...cat,
          items: cat.items.map(item => {
            // Studio Hourly item
            if (item.id === "studio-hour") {
              if (hourlySessionsCount > 0) {
                return {
                  ...item,
                  isSelected: true,
                  quantity: hourlySessionsCount * 2 // Each slot is 2 hours
                };
              }
            }
            // Studio Half-day item
            if (item.id === "studio-halfday") {
              if (hourlySessionsCount > 0 && !prevCats.some(c => c.items.some(i => i.id === "studio-hour" && i.isSelected))) {
                return {
                  ...item,
                  isSelected: true,
                  quantity: Math.ceil(hourlySessionsCount / 2)
                };
              }
            }
            // Studio Full day item
            if (item.id === "studio-fullday") {
              if (dailySessionsCount > 0) {
                return {
                  ...item,
                  isSelected: true,
                  quantity: dailySessionsCount
                };
              }
            }
            return item;
          })
        };
      })
    );
  }, [bookingSessions]);

  const applyPackPreset = (packId: string) => {
    const pack = packs.find((p: any) => p.id === packId);
    if (!pack) return;
    
    setActivePack(packId);
    
    const updatedCategories = baseCategories.map((cat: any) => {
      const packCatSelections = pack.selections[cat.id as keyof typeof pack.selections] || [];
      return {
        ...cat,
        items: cat.items.map((item: any) => {
          const selection = packCatSelections.find((s: any) => s.id === item.id);
          if (selection) {
            return {
              ...item,
              isSelected: true,
              quantity: selection.quantity
            };
          } else {
            return {
              ...item,
              isSelected: false,
              quantity: 1
            };
          }
        })
      };
    });
    
    setCategories(updatedCategories);
  };

  // Map state categories and items to pull localized names and descriptions dynamically
  const translatedCategories = categories.map((cat) => {
    const localizedCatName = data.budget[cat.id as keyof typeof data.budget] as string;
    const localizedCatDesc = data.budget[`${cat.id}_desc` as keyof typeof data.budget] as string;
    return {
      ...cat,
      name: localizedCatName || cat.name,
      description: localizedCatDesc || cat.description,
      items: cat.items.map((item) => {
        const localizedItemName = data.budget.items[item.id as keyof typeof data.budget.items];
        const localizedItemDesc = data.budget.items[`${item.id}_desc` as keyof typeof data.budget.items];
        return {
          ...item,
          name: localizedItemName || item.name,
          description: localizedItemDesc || item.description,
        };
      }),
    };
  });

  const handleToggleItem = (categoryId: string, itemId: string) => {
    setActivePack(null);

    setCategories(
      categories.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) => {
            if (item.id !== itemId) return item;

            const nextSelected = !item.isSelected;
            const minQty = (item.id === "studio-hour" || item.unitType === "hours") ? 2 : 1;
            return {
              ...item,
              isSelected: nextSelected,
              quantity: nextSelected ? Math.max(item.quantity, minQty) : item.quantity,
            };
          }),
        };
      })
    );
  };

  const handleQuantityChange = (categoryId: string, itemId: string, newValue: number) => {
    const minQty = (itemId === "studio-hour" || itemId.includes("hour")) ? 2 : 1;
    if (newValue < minQty) return;
    setActivePack(null);
    setCategories(
      categories.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          items: cat.items.map((item) => {
            if (item.id !== itemId) return item;
            return { ...item, quantity: newValue };
          }),
        };
      })
    );
  };

  const calculateItemCost = (item: CostItem): number => {
    if (!item.isSelected) return 0;
    return item.basePrice * item.quantity;
  };

  const calculateCategoryCost = (category: CostCategory): number => {
    return category.items.reduce((sum, item) => sum + calculateItemCost(item), 0);
  };

  const calculateGrandTotal = (): number => {
    return categories.reduce((sum, cat) => sum + calculateCategoryCost(cat), 0);
  };

  const countSelectedItems = (): number => {
    return categories.reduce(
      (sum, cat) => sum + cat.items.filter((item) => item.isSelected).length,
      0
    );
  };

  const handleReset = () => {
    setCategories(JSON.parse(JSON.stringify(baseCategories)));
    setIsSubmitted(false);
    setClientEmail("");
    setClientName("");
    setClientPhone("");
    setBookingDate("");
    setBookingTime("");
    setBookingSessions([]);
    setBookingMode("hourly");
    setSubmitError("");
    setActivePack(null);
    setWizardStep(0);
  };

  const handleSubmitEstimate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientEmail || !clientName || !clientPhone) return;

    // Validate minimum 2 hours for studio hourly booking
    const studioHourItem = categories.flatMap((c) => c.items).find((i) => i.id === "studio-hour");
    if (studioHourItem && studioHourItem.isSelected && studioHourItem.quantity < 2) {
      const errMsg =
        language === "ar"
          ? "⚠️ حجز الاستوديو بالساعة يتطلب ساعتين كحد أدنى."
          : language === "fr"
          ? "⚠️ La réservation du studio à l'heure nécessite un minimum de 2 heures."
          : "⚠️ Hourly studio booking requires a minimum of 2 hours.";
      setSubmitError(errMsg);
      return;
    }

    // Check if any of the booked sessions are busy
    const busySession = bookingSessions.find((s) => isTimeSlotBusy(s.date, s.time));
    if (busySession) {
      const errMsg = language === "ar"
        ? `⚠️ الوقت في ${busySession.date} على الساعة ${busySession.time} غير متاح في تقويم غوغل الخاص بنا.`
        : language === "fr"
        ? `⚠️ Le créneau du ${busySession.date} à ${busySession.time} est occupé sur notre agenda Google.`
        : `⚠️ The slot on ${busySession.date} at ${busySession.time} is busy on our Google Calendar. Please select another slot.`;
      setSubmitError(errMsg);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError("");

    // Build the items list for submission details
    const selectedServices: any[] = [];
    categories.forEach((cat) => {
      cat.items.forEach((item) => {
        if (item.isSelected) {
          selectedServices.push({
            id: item.id,
            name: typeof item.name === "object" ? (item.name[language] || item.name.en || "") : item.name,
            quantity: item.quantity,
            basePrice: item.basePrice,
            cost: item.basePrice * item.quantity,
            unitType: item.unitType
          });
        }
      });
    });

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "estimate",
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          bookingDate: bookingSessions.length > 0 ? bookingSessions[0].date : "",
          bookingTime: bookingSessions.length > 0 ? bookingSessions[0].time : "",
          bookingDayLabel: bookingSessions.length > 0 ? (bookingSessions[0].dayLabel || formatSelectedDayFullLabel(bookingSessions[0].date)) : "",
          bookingSessions: bookingSessions.map(s => ({
            ...s,
            dayLabel: s.dayLabel || formatSelectedDayFullLabel(s.date)
          })),
          packId: activePack || "custom",
          estimatedTotal: calculateGrandTotal(),
          selectedItems: selectedServices
        })
      });

      if (response.ok) {
        // Notify parent component of saved estimate details
        onEstimateSaved(calculateGrandTotal(), countSelectedItems());
        
        // Show local toast about booking confirmation
        const msg = language === "ar"
          ? `✓ تم تأكيد الحجز بنجاح! شكراً لك ${clientName}. سيتواصل معك أحد منتجينا المبدعين قريباً.`
          : language === "fr"
          ? `✓ Réservation confirmée avec succès ! Merci ${clientName}. Un producteur créatif vous contactera bientôt.`
          : `✓ Booking Confirmed Successfully! Thank you ${clientName}. A creative producer will contact you shortly.`;
        setLocalToast(msg);
        
        // Reset the block back to step 0
        handleReset();
      } else {
        const errData = await response.json();
        setSubmitError(errData.error || "Failed to submit estimate.");
      }
    } catch (err) {
      console.error("Failed to submit estimate:", err);
      // Fallback for resilient offline experience
      onEstimateSaved(calculateGrandTotal(), countSelectedItems());
      
      const msg = language === "ar"
        ? `✓ تم الحجز بنجاح! شكراً لك ${clientName}.`
        : language === "fr"
        ? `✓ Réservation réussie ! Merci ${clientName}.`
        : `✓ Booking Confirmed! Thank you ${clientName}.`;
      setLocalToast(msg);
      
      handleReset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    const localeStr = language === "ar" ? "ar-TN" : language === "fr" ? "fr-TN" : "en-TN";
    return new Intl.NumberFormat(localeStr, {
      style: "currency",
      currency: "TND",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getUnitLabel = (unit: string) => {
    const u = unit.toLowerCase();
    if (u === "day" || u === "days") {
      return language === "ar" ? "يوم" : language === "fr" ? "jour" : "day";
    }
    if (u === "minute" || u === "minutes") {
      return language === "ar" ? "دقيقة" : language === "fr" ? "minute" : "minute";
    }
    if (u === "clip" || u === "clips") {
      return language === "ar" ? "مقطع" : language === "fr" ? "clip" : "clip";
    }
    if (u === "hour" || u === "hours") {
      return language === "ar" ? "ساعة" : language === "fr" ? "heure" : "hour";
    }
    if (u === "unit" || u === "units") {
      return language === "ar" ? "وحدة" : language === "fr" ? "unité" : "unit";
    }
    return unit;
  };

  const subtotalLabel = language === "ar" ? "المجموع الفرعي" : language === "fr" ? "Sous-total" : "Subtotal";
  const selectedLabel = language === "ar" ? "محددة" : language === "fr" ? "sélectionnés" : "selected";
  const calculatedLabel = language === "ar" ? "محسوب" : language === "fr" ? "calculé" : "calculated";
  const baselineLabel = language === "ar" ? "سعر أساسي" : language === "fr" ? "prix de base" : "unit baseline";
  const summaryTitle = language === "ar" ? "ملخص الميزانية التقديرية" : language === "fr" ? "RÉSUMÉ DE L'ESTIMATION" : "ESTIMATE SUMMARY";
  const taxesExcludedLabel = language === "ar" ? "• جميع الأسعار غير شاملة للضريبة (دون احتساب الأداءات HT)" : language === "fr" ? "• TOUS LES PRIX SONT HORS TAXE (HT)" : "• ALL PRICES ARE EXCLUSIVE OF TAX (HT)";
  const successTitle = language === "ar" ? "تم إرسال الميزانية بنجاح!" : language === "fr" ? "ESTIMATION ENVOYÉE !" : "ESTIMATE SUBMITTED!";
  const resetConfigLabel = language === "ar" ? "تعديل ميزانية أخرى" : language === "fr" ? "Configurer un autre budget" : "Configure Another Budget";

  const packsTitle = language === "ar" ? "١. باقات الإنتاج السينمائي الجاهزة" : language === "fr" ? "1. FORFAITS CINÉMATOGRAPHIQUES PRÉ-CONFIGURÉS" : "1. PRE-CONFIGURED CINEMATIC PACKAGES";
  const packsSubtitle = language === "ar" ? "اختر باقة إنتاج كقاعدة أساسية لمشروعك، ثم عدّل أي عنصر حسب رغبتك أدناه." : language === "fr" ? "Sélectionnez un forfait comme base, puis personnalisez chaque composant ci-dessous." : "Select a curated package as a baseline, then customize any component dynamically below.";
  const calculatorTitle = language === "ar" ? "٢. تخصيص وحساب الميزانية التفاعلية" : language === "fr" ? "2. ESTIMATEUR DE BUDGET & PERSONNALISATION" : "2. DYNAMIC BUDGET ESTIMATOR & CUSTOMIZER";

  return (
    <section id="budget" className="py-24 bg-black relative overflow-hidden border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono text-gold-500 uppercase tracking-widest block mb-2">
            {language === "ar" ? "استوديو الخاص بنا" : language === "fr" ? "NOTRE STUDIO" : "OUR STUDIO"}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase">
            {language === "ar" ? "استوديو الخاص بنا" : language === "fr" ? "NOTRE STUDIO" : "OUR STUDIO"}
          </h2>
          <p className="mt-4 text-zinc-400 text-sm sm:text-base font-light leading-relaxed">
            {language === "ar" 
              ? "ولد من التعاون بين Video Club Production و Elyssar Agency، فيديو كلوب دإليسار هو استوديو احترافي للتصوير الفوتوغرافي والفيديو والبودكاست في قلب تونس، صُمّم لمنح مشاريعكم مساحة تليق بطموحاتكم."
              : language === "fr"
              ? "Né de la collaboration entre Video Club Production et Elyssar Agency, Video Club d'Elyssar est un studio professionnel de photo, vidéo et podcast au cœur de Tunis, conçu pour offrir à vos projets un espace à la hauteur de vos ambitions."
              : "Born from the collaboration between Video Club Production and Elyssar Agency, Video Club d'Elyssar is a professional photo, video and podcast studio in the heart of Tunis. Built to give your projects a space that matches your ambition."
            }
          </p>
        </div>

        <div id="budget-wizard-container" className="space-y-10">
          {/* STEP 0: INTERACTIVE STUDIO TOUR */}
          {wizardStep === 0 && (
          <motion.div
            className="mb-24 bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 sm:p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Subtle glowing accents */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-gold-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
              <div className={dir === "rtl" ? "text-right" : "text-left"}>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-500" />
                  {language === "ar" ? "جولة تفاعلية في الاستوديو" : language === "fr" ? "Visite Interactive du Studio" : "Interactive Studio Tour"}
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm font-light mt-1">
                  {language === "ar" ? "استكشف غرف الإنتاج والمعدات عالية الجودة لدينا" : language === "fr" ? "Explorez nos plateaux de production et notre matériel haut de gamme" : "Explore our premium production spaces and state-of-the-art equipment"}
                </p>
              </div>

              {/* Studio view tabs */}
              <div className="flex flex-wrap gap-2">
                {STUDIO_VIEWS.map((view) => {
                  const isActive = activeStudioTab === view.id;
                  const viewName = view.name[language as keyof typeof view.name] || view.name.en;
                  return (
                    <button
                      key={view.id}
                      onClick={() => {
                        setActiveStudioTab(view.id);
                        setClickedHotspot(null);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-gold-500 text-slate-950 shadow-[0_0_15px_rgba(219,179,116,0.3)]"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                      }`}
                    >
                      {viewName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Image Display Area */}
            {STUDIO_VIEWS.map((view) => {
              if (view.id !== activeStudioTab) return null;
              const viewImage = formatGoogleDriveLink(agencySettings?.studioTourImages?.[view.id] || view.image, 'image');

              return (
                <div key={view.id} className="relative aspect-[16/10] md:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-zinc-855 bg-zinc-950 group">
                  {/* Main studio image */}
                  <img
                    src={viewImage}
                    alt={view.name.en}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = view.id === "podcast"
                        ? "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=80"
                        : "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80";
                    }}
                  />

                  {/* Ambient dark overlay with glassmorphism */}
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors duration-500"></div>

                  {/* Book your session button at the bottom/corner to clear hotspots */}
                  <div className={`absolute inset-0 flex items-end justify-center p-4 sm:p-6 pointer-events-none z-20 ${dir === "rtl" ? "sm:justify-start" : "sm:justify-end"}`}>
                    <motion.div
                      className="pointer-events-auto bg-slate-950/90 backdrop-blur-md px-5 py-4 rounded-2xl border border-zinc-800 shadow-2xl text-center max-w-[260px] hover:border-gold-500/50 transition-colors duration-300"
                      initial={{ scale: 0.9, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-[10px] font-mono text-gold-400 uppercase tracking-widest mb-1">
                        {language === "ar" ? "احجز جلستك الآن" : language === "fr" ? "Planifiez votre tournage" : "Plan your shoot"}
                      </p>
                      <h4 className="text-white text-xs sm:text-sm font-display font-extrabold uppercase mb-2.5 tracking-wide">
                        {language === "ar" ? "جاهز للتصوير؟" : language === "fr" ? "Prêt à tourner ?" : "Ready to Shoot?"}
                      </h4>
                      <button
                        onClick={() => {
                          setWizardStep(1);
                        }}
                        className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-600 hover:to-gold-500 text-slate-950 font-display font-black text-[10px] sm:text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-lg hover:shadow-gold-500/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {language === "ar" ? "احجز جلستك" : language === "fr" ? "Réservez votre session" : "Book your session"}
                      </button>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Step Progress Header */}
        {wizardStep > 0 && (
          <div className="mb-8 bg-zinc-950/30 border border-zinc-900 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className={dir === "rtl" ? "text-right" : "text-left"}>
              <span className="text-[10px] font-mono text-gold-400 uppercase tracking-widest block mb-1">
                {language === "ar" ? "خطوات الحجز الذكي" : language === "fr" ? "PROGRÈS DE RÉSERVATION" : "SMART BOOKING PROGRESS"}
              </span>
              <h4 className="font-display text-sm sm:text-base font-extrabold text-white uppercase tracking-wider">
                {wizardStep === 1
                  ? (language === "ar" ? "الخطوة ١ من ٢: اختر الباقة والخدمات المخصصة" : language === "fr" ? "Étape 1 sur 2 : Sélectionner & personnaliser vos services" : "Step 1 of 2: Select Packages & Customize Services")
                  : (language === "ar" ? "الخطوة ٢ من ٢: مراجعة الميزانية وجدولة الحجز" : language === "fr" ? "Étape 2 sur 2 : Résumé & Planification de session" : "Step 2 of 2: Review Estimate & Schedule Session")
                }
              </h4>
            </div>
            
            {/* Sleek Progress Indicator */}
            <div className="flex items-center gap-3 w-full sm:w-48">
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden relative border border-zinc-850">
                <div
                  className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full transition-all duration-500 shadow-[0_0_8px_#dbb374]"
                  style={{ width: wizardStep === 1 ? "50%" : "100%" }}
                ></div>
              </div>
              <span className="font-mono text-xs text-gold-400 font-bold shrink-0">
                {wizardStep === 1 ? "50%" : "100%"}
              </span>
            </div>
          </div>
        )}

        {/* STEP 1: PACKAGES & INDIVIDUAL ESTIMATOR CUSTOMIZER */}
        {wizardStep === 1 && (
          <motion.div
            className="space-y-12 bg-zinc-950/20 border border-zinc-900 rounded-3xl p-6 sm:p-8 relative"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Section 1: Pre-configured Pricing Packs */}
            <div>
              <div className={`mb-8 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                <h3 className="font-display text-base sm:text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-gold-500" />
                  {packsTitle}
                </h3>
                <p className="text-zinc-400 text-xs font-light mt-1">
                  {packsSubtitle}
                </p>
                <div className="mt-3 bg-gold-950/20 border border-gold-500/20 rounded-xl px-3.5 py-2 flex items-center gap-2 text-[11px] font-mono text-gold-400/90">
                  <Info className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  <span>
                    {language === "ar"
                      ? "تنبيه: جميع الأسعار المعروضة غير شاملة للضريبة (دون احتساب الأداءات HT)."
                      : language === "fr"
                      ? "Note : Tous les prix indiqués sont Hors Taxe (HT)."
                      : "Note: All listed prices are exclusive of tax (HT)."}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                {packs.map((pack: any, i: number) => {
                  const IconComponent = typeof pack.icon === "string" ? (ICON_MAP[pack.icon as keyof typeof ICON_MAP] || Film) : (pack.icon || Film);
                  const isSelected = activePack === pack.id;
                  const packName = pack.name[language as keyof typeof pack.name] || pack.name.en;
                  const packBadge = pack.badge[language as keyof typeof pack.badge] || pack.badge.en;
                  const packDesc = pack.desc[language as keyof typeof pack.desc] || pack.desc.en;
                  const packBullets = pack.bullets[language as keyof typeof pack.bullets] || pack.bullets.en;
                  
                  return (
                    <div
                      key={pack.id}
                      onClick={() => applyPackPreset(pack.id)}
                      className={`group relative rounded-2xl border bg-[#09090b]/80 p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer select-none hover:bg-slate-950 hover:-translate-y-0.5 ${
                        isSelected
                          ? "border-gold-500 shadow-[0_0_20px_rgba(219,179,116,0.15)] ring-1 ring-gold-500"
                          : "border-zinc-900 hover:border-zinc-800"
                      }`}
                    >
                      <div className="relative z-10">
                        <div className={`flex items-center justify-between mb-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                          <span className="inline-block px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider rounded-md bg-zinc-900 border border-zinc-850 text-gold-400 uppercase">
                            {packBadge}
                          </span>
                          <IconComponent className={`w-4 h-4 transition-colors shrink-0 ${isSelected ? "text-gold-500" : "text-zinc-600 group-hover:text-gold-400"}`} />
                        </div>

                        <h4 className={`font-display text-sm font-extrabold uppercase tracking-wide text-white mb-1.5 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                          {packName}
                        </h4>
                        <p className={`text-zinc-500 text-[11px] font-light leading-relaxed mb-4 h-10 overflow-hidden ${dir === "rtl" ? "text-right" : "text-left"}`}>
                          {packDesc}
                        </p>

                        <ul className="space-y-2 mb-4 border-t border-zinc-900/80 pt-3">
                          {packBullets.map((bullet, idx) => (
                            <li key={idx} className={`flex items-start gap-1.5 text-[11px] text-zinc-400 ${dir === "rtl" ? "flex-row-reverse text-right" : "text-left"}`}>
                              <Check className="w-3 h-3 text-gold-500 shrink-0 mt-0.5" />
                              <span className="leading-tight">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="relative z-10 border-t border-zinc-900/80 pt-3 mt-auto">
                        <div className={`flex items-baseline gap-1.5 mb-3 ${dir === "rtl" ? "flex-row-reverse justify-start" : ""}`}>
                          <span className="text-xl font-mono font-black text-white">{formatCurrency(pack.price)}</span>
                          <span className="text-[9px] font-mono font-bold text-gold-400 bg-gold-500/10 border border-gold-500/20 px-1.5 py-0.5 rounded uppercase">HT</span>
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            applyPackPreset(pack.id);
                          }}
                          className={`w-full py-2 px-3 rounded-lg font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                            isSelected
                              ? "bg-gold-500 text-slate-950 shadow-[0_0_12px_rgba(219,179,116,0.3)]"
                              : "bg-zinc-900 border border-zinc-850 text-zinc-400 group-hover:text-white group-hover:border-zinc-750 hover:bg-zinc-850"
                          }`}
                        >
                          {isSelected
                            ? (language === "ar" ? "✓ الباقة النشطة" : language === "fr" ? "✓ Forfait Actif" : "✓ Active Package")
                            : (language === "ar" ? "تطبيق الباقة" : language === "fr" ? "Appliquer le Forfait" : "Apply Package")}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Collapsible Accordion Customizer */}
            <div className="border-t border-zinc-900/80 pt-8">
              <div className={`mb-6 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                <h3 className="font-display text-base sm:text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-gold-500" />
                  {calculatorTitle}
                </h3>
                <p className="text-zinc-400 text-xs font-light mt-1">
                  {language === "ar"
                    ? "تحكّم في تفاصيل إنتاجك بالكامل عن طريق تعديل عناصر الميزانية وتحديد الكميات بدقة أدناه."
                    : language === "fr"
                    ? "Prenez le contrôle total de votre budget de production en personnalisant les options individuelles ci-dessous."
                    : "Take full control of your production budget by customizing individual line-items and quantities below."}
                </p>
              </div>

              <div className="space-y-4">
                {translatedCategories.map((cat) => {
                  const isExpanded = !!expandedCategories[cat.id];
                  const subTotal = calculateCategoryCost(categories.find(c => c.id === cat.id)!);
                  const itemsCount = categories.find(c => c.id === cat.id)!.items.filter((item) => item.isSelected).length;

                  return (
                    <div
                      key={cat.id}
                      className="bg-[#09090b]/80 rounded-2xl border border-zinc-900 overflow-hidden transition-colors duration-300 hover:border-zinc-850"
                    >
                      {/* Accordion Header */}
                      <div
                        onClick={() => setExpandedCategories(p => ({ ...p, [cat.id]: !p[cat.id] }))}
                        className={`px-5 py-4 bg-zinc-950/20 hover:bg-zinc-900/30 flex items-center justify-between cursor-pointer select-none ${dir === "rtl" ? "flex-row-reverse text-right" : "text-left"}`}
                      >
                        <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                          <div className="text-zinc-400">
                            <span className={`inline-block transition-transform duration-300 ${isExpanded ? "rotate-90" : "rotate-0"}`}>
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                          <div>
                            <h4 className="font-display text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                              {cat.name}
                              {itemsCount > 0 && (
                                <span className="bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[9px] font-mono px-1.5 py-0.5 rounded-md font-bold">
                                  {itemsCount} {selectedLabel}
                                </span>
                              )}
                            </h4>
                            <p className="text-zinc-500 text-[10px] mt-0.5 font-light">{cat.description}</p>
                          </div>
                        </div>

                        <div className={dir === "rtl" ? "text-left" : "text-right"}>
                          <span className="block font-mono text-[9px] text-zinc-500 uppercase leading-none">{subtotalLabel}</span>
                          <span className="text-gold-400 font-mono font-bold text-xs sm:text-sm mt-0.5 inline-block">
                            {formatCurrency(subTotal)} <span className="text-[8px] text-gold-500/80 uppercase font-mono">HT</span>
                          </span>
                        </div>
                      </div>

                      {/* Accordion Content */}
                      {isExpanded && (
                        <div className="divide-y divide-zinc-900/60 border-t border-zinc-900/80 bg-zinc-950/10">
                          {cat.items.map((item) => {
                            const originalItem = categories.find(c => c.id === cat.id)!.items.find(i => i.id === item.id)!;
                            return (
                              <div
                                key={item.id}
                                onClick={() => handleToggleItem(cat.id, item.id)}
                                className={`p-4 sm:p-5 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-zinc-900/20 select-none ${
                                  originalItem.isSelected ? "bg-gold-500/[0.01]" : ""
                                } ${dir === "rtl" ? "sm:flex-row-reverse" : ""}`}
                              >
                                {/* Checkbox + Details */}
                                <div className={`flex gap-3.5 items-start max-w-lg ${dir === "rtl" ? "flex-row-reverse text-right" : "text-left"}`}>
                                  <div
                                    className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded border transition-all shrink-0 ${
                                      originalItem.isSelected
                                        ? "bg-gold-500 border-gold-500 text-slate-950"
                                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                                    }`}
                                  >
                                    {originalItem.isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                  <div>
                                    <h5 className={`text-xs sm:text-sm font-semibold tracking-wide transition-colors ${originalItem.isSelected ? "text-white" : "text-zinc-400"}`}>
                                      {item.name}
                                    </h5>
                                    <p className="text-zinc-500 text-[11px] mt-0.5 leading-relaxed font-light">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Controls & Price */}
                                <div className={`flex items-center justify-between sm:justify-end gap-5 ${dir === "rtl" ? "flex-row-reverse" : ""}`} onClick={(e) => e.stopPropagation()}>
                                  {/* Quantity adjustment */}
                                  {originalItem.isSelected && originalItem.unitType !== "flat" && (
                                    <div className={`flex items-center gap-2 bg-zinc-950 px-2 py-0.5 rounded-lg border border-zinc-850 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                                      <button
                                        type="button"
                                        disabled={originalItem.quantity <= ((originalItem.id === "studio-hour" || originalItem.unitType === "hours") ? 2 : 1)}
                                        onClick={() => handleQuantityChange(cat.id, item.id, originalItem.quantity - 1)}
                                        className="w-5.5 h-5.5 rounded flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all text-xs font-bold cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                      >
                                        -
                                      </button>
                                      <div className="text-center min-w-[28px]">
                                        <span className="font-mono text-xs text-white font-bold block">
                                          {originalItem.quantity}
                                        </span>
                                        <span className="block text-[8px] text-zinc-500 font-mono uppercase leading-none">
                                          {getUnitLabel(originalItem.unitType)}
                                        </span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleQuantityChange(cat.id, item.id, originalItem.quantity + 1)}
                                        className="w-5.5 h-5.5 rounded flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all text-xs font-bold cursor-pointer"
                                      >
                                        +
                                      </button>
                                    </div>
                                  )}

                                  {/* Price tag */}
                                  <div className={dir === "rtl" ? "text-left min-w-[85px]" : "text-right min-w-[85px]"}>
                                    <div className={`flex items-center gap-1 ${dir === "rtl" ? "justify-start flex-row-reverse" : "justify-end"}`}>
                                      <span className={`font-mono text-xs sm:text-sm font-bold block ${originalItem.isSelected ? "text-white" : "text-zinc-650 line-through"}`}>
                                        {formatCurrency(originalItem.isSelected ? calculateItemCost(originalItem) : originalItem.basePrice)}
                                      </span>
                                      <span className="text-[8px] font-mono text-gold-400 font-bold uppercase">HT</span>
                                    </div>
                                    <span className="text-[9px] font-mono text-zinc-500 uppercase leading-none block mt-0.5">
                                      {originalItem.isSelected ? calculatedLabel : baselineLabel}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dynamic Sticky Footer inside wizard block */}
            <div className="border-t border-zinc-900/80 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 mt-8">
              <div className={dir === "rtl" ? "text-right" : "text-left"}>
                <span className="block font-mono text-[10px] text-zinc-400 uppercase tracking-widest leading-none mb-1.5">
                  {t("budget_estimated_total")}
                </span>
                <div className={`flex items-baseline gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <span className="text-2xl sm:text-3xl font-display font-black text-white leading-none block">
                    {formatCurrency(calculateGrandTotal())}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-gold-400 bg-gold-500/10 border border-gold-500/20 px-1.5 py-0.5 rounded uppercase">
                    HT
                  </span>
                </div>
                <span className="block text-[10px] text-gold-400 font-mono uppercase mt-1">
                  {taxesExcludedLabel}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setWizardStep(0);
                  }}
                  className="px-5 py-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
                >
                  <ChevronLeft className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
                  {language === "ar" ? "العودة للجولة" : language === "fr" ? "Retour au Studio" : "Back to Tour"}
                </button>

                <button
                  type="button"
                  disabled={countSelectedItems() === 0}
                  onClick={() => {
                    setWizardStep(2);
                  }}
                  className={`px-6 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    countSelectedItems() > 0
                      ? "bg-gold-500 text-slate-950 hover:bg-gold-400 shadow-[0_0_15px_rgba(219,179,116,0.25)]"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-650 cursor-not-allowed"
                  }`}
                >
                  {language === "ar" ? "المتابعة للملخص" : language === "fr" ? "Suivant : Résumé" : "Next to Summary"}
                  <ArrowRight className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: ESTIMATE SUMMARY & BOOKING */}
        {wizardStep === 2 && (
          <motion.div
            className="space-y-8 bg-zinc-950/20 border border-zinc-900 rounded-3xl p-6 sm:p-8 relative"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Estimate Summary Receipt & Contact Form */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#09090b]/60 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-600 to-gold-400"></div>
                  
                  <h3 className={`font-display text-xs sm:text-sm font-black text-white uppercase tracking-wider mb-5 flex items-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <Receipt className="w-4 h-4 text-gold-500" />
                    {language === "ar" ? "تفاصيل التقدير المالي" : language === "fr" ? "Détails du Devis" : "Estimate Summary"}
                  </h3>

                  {/* Receipt Items List */}
                  <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1 mb-5 pb-5 border-b border-zinc-900/80 scrollbar-thin">
                    {categories.flatMap(cat => cat.items.filter(item => item.isSelected)).length === 0 ? (
                      <div className="text-zinc-500 text-xs text-center py-6 font-mono">
                        {language === "ar" ? "لم يتم تحديد أي خدمات" : language === "fr" ? "Aucun service sélectionné" : "No services customized yet"}
                      </div>
                    ) : (
                      categories.map((cat) => {
                        const selectedItems = cat.items.filter(item => item.isSelected);
                        if (selectedItems.length === 0) return null;
                        
                        // Get translated category name
                        const translatedCatName = data.budget[cat.id as keyof typeof data.budget] as string || cat.name;

                        return (
                          <div key={cat.id} className="space-y-2">
                            <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                              {translatedCatName}
                            </span>
                            <div className={`space-y-1.5 pl-2 border-l border-zinc-900 ${dir === "rtl" ? "pr-2 pl-0 border-r border-l-0 border-zinc-900 text-right" : ""}`}>
                              {selectedItems.map((item) => {
                                // Get translated item name
                                const translatedItemName = data.budget.items[item.id as keyof typeof data.budget.items] || item.name;
                                return (
                                  <div key={item.id} className={`flex justify-between items-start text-xs ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                                    <span className="text-zinc-400 font-light max-w-[70%]">
                                      {typeof translatedItemName === "object" ? (translatedItemName[language] || translatedItemName.en) : translatedItemName}
                                      {item.unitType !== "flat" && (
                                        <span className="text-zinc-650 font-mono text-[9px] ml-1.5">
                                          (x{item.quantity} {getUnitLabel(item.unitType)})
                                        </span>
                                      )}
                                    </span>
                                    <span className="font-mono text-zinc-300 font-semibold">{formatCurrency(calculateItemCost(item))}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Grand Total */}
                  <div className={`mb-6 ${dir === "rtl" ? "text-right" : "text-left"}`}>
                    <span className="block font-mono text-[10px] text-zinc-500 uppercase tracking-widest leading-none mb-1.5">
                      {t("budget_estimated_total")}
                    </span>
                    <div className={`flex items-baseline gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <span className="text-3xl sm:text-4xl font-display font-black text-white leading-none block">
                        {formatCurrency(calculateGrandTotal())}
                      </span>
                      <span className="text-xs font-mono font-bold text-gold-400 bg-gold-500/10 border border-gold-500/20 px-2 py-0.5 rounded uppercase">
                        HT
                      </span>
                    </div>
                    <span className="block text-[10px] text-gold-400 font-mono uppercase mt-2">
                      {taxesExcludedLabel}
                    </span>
                  </div>
                </div>

                {/* Booking contact form fields */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className={`block text-[10px] font-mono text-zinc-400 uppercase tracking-wider ${dir === "rtl" ? "text-right" : "text-left"}`}>
                      {t("contact_form_name")} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder={language === "ar" ? "نجيب محفوظ" : language === "fr" ? "Jean-Luc Godard" : "Christopher Nolan"}
                      className={`w-full bg-[#0c0c0e] border border-zinc-900 focus:border-gold-500 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-zinc-650 focus:outline-none transition-colors ${dir === "rtl" ? "text-right" : "text-left"}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`block text-[10px] font-mono text-zinc-400 uppercase tracking-wider ${dir === "rtl" ? "text-right" : "text-left"}`}>
                      {t("contact_form_email")} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="cinema@videoclub.tn"
                      className={`w-full bg-[#0c0c0e] border border-zinc-900 focus:border-gold-500 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-zinc-650 focus:outline-none transition-colors ${dir === "rtl" ? "text-right" : "text-left"}`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`block text-[10px] font-mono text-zinc-400 uppercase tracking-wider ${dir === "rtl" ? "text-right" : "text-left"}`}>
                      {language === "ar" ? "رقم الهاتف" : language === "fr" ? "Téléphone" : "Phone Number"} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+216 98 765 432"
                      className={`w-full bg-[#0c0c0e] border border-zinc-900 focus:border-gold-500 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-zinc-650 focus:outline-none transition-colors ${dir === "rtl" ? "text-right" : "text-left"}`}
                    />
                  </div>
                </form>
              </div>

              {/* Right Column: Inline Sessions Scheduler Calendar */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-[#09090b]/60 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden flex flex-col">
                  {/* Top line accent */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold-600 to-gold-400"></div>

                  <div className={`flex items-center justify-between pb-3 border-b border-zinc-900/80 mb-5 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <div>
                      <h3 className="text-xs sm:text-sm font-display font-black tracking-wider text-white uppercase flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold-500" />
                        {language === "ar" ? "جدول حجز جلسات الفيديو" : language === "fr" ? "PLANIFICATEUR DE SESSIONS" : "VIDEO CLUB SESSION SCHEDULER"}
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        {language === "ar" ? "حدد تاريخاً ووقتاً لتأكيد الحجز" : language === "fr" ? "Sélectionnez vos dates et créneaux" : "Select one or multiple dates & time blocks"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#0c0c0e]/40 p-4 rounded-xl border border-zinc-900 shadow-inner">
                    {/* Select a Date Calendar */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-zinc-900/60">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                          📅 {language === "ar" ? "اختر التاريخ" : language === "fr" ? "Sélectionner" : "Select date"}
                        </span>

                        {/* Calendar Navigation */}
                        <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-855 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              const prev = new Date(currentMonthDate);
                              prev.setMonth(prev.getMonth() - 1);
                              setCurrentMonthDate(prev);
                            }}
                            className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                          <span className="text-[9px] font-mono font-bold text-zinc-300 min-w-[70px] text-center">
                            {formatMonthHeader(currentMonthDate)}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const next = new Date(currentMonthDate);
                              next.setMonth(next.getMonth() + 1);
                              setCurrentMonthDate(next);
                            }}
                            className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Calendar table Grid */}
                      <div className="space-y-2.5 bg-zinc-950/60 p-3 rounded-lg border border-zinc-900 shadow-inner">
                        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[8px] font-bold text-zinc-500 uppercase pb-1 border-b border-zinc-900/30">
                          {(language === "ar" 
                            ? ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"]
                            : language === "fr"
                            ? ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
                            : ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
                          ).map((lbl, idx) => (
                            <span key={idx}>{lbl}</span>
                          ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 pt-0.5">
                          {getMonthDays(currentMonthDate).map((cell, idx) => {
                            const isSelectable = isDateSelectable(cell.dateObject);
                            const cellDateStr = getDateString(cell.dateObject);
                            const isSelected = bookingDate === cellDateStr;
                            const isToday = getDateString(new Date()) === cellDateStr;
                            const hasBookingsOnThisDay = bookingSessions.some(s => s.date === cellDateStr);

                            return (
                              <button
                                key={idx}
                                type="button"
                                disabled={!isSelectable}
                                onClick={() => setBookingDate(cellDateStr)}
                                className={`h-7 w-7 mx-auto flex flex-col items-center justify-center text-[10px] font-mono rounded-md relative transition-all duration-150 cursor-pointer ${
                                  !cell.isCurrentMonth
                                    ? "text-zinc-750 font-normal opacity-40"
                                    : !isSelectable
                                    ? "text-zinc-650 line-through opacity-15 cursor-not-allowed"
                                    : isSelected
                                    ? "bg-gold-500 text-slate-950 font-black scale-105 shadow-md shadow-gold-500/30"
                                    : hasBookingsOnThisDay
                                    ? "bg-gold-500/10 border border-gold-500/25 text-gold-400 font-bold"
                                    : isToday
                                    ? "border border-zinc-700 text-white font-bold"
                                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                                }`}
                              >
                                <span>{cell.dayNumber}</span>
                                {hasBookingsOnThisDay && !isSelected && (
                                  <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-gold-500 shadow shadow-gold-500/50"></span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Select Time Slots Column */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-1 border-b border-zinc-900/60">
                        <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gold-500" />
                          {language === "ar" ? "اختر الحصّة" : language === "fr" ? "Créneaux" : "Select slot"}
                        </span>
                        <span className="text-[8px] text-zinc-500 font-mono">
                          GMT+1
                        </span>
                      </div>

                      {/* Booking Mode Selector (Hourly vs Daily) */}
                      <div className="grid grid-cols-2 gap-2 bg-zinc-950/80 p-1 border border-zinc-900 rounded-xl mb-1">
                        <button
                          type="button"
                          onClick={() => {
                            setBookingMode("hourly");
                          }}
                          className={`py-1.5 px-2 text-center rounded-lg font-mono text-[9px] font-bold uppercase transition-all duration-155 cursor-pointer ${
                            bookingMode === "hourly"
                              ? "bg-gold-500 text-slate-950 shadow-sm font-extrabold"
                              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
                          }`}
                        >
                          {language === "ar" ? "حجز بالساعة" : language === "fr" ? "Horaire" : "Hourly"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBookingMode("daily");
                          }}
                          className={`py-1.5 px-2 text-center rounded-lg font-mono text-[9px] font-bold uppercase transition-all duration-155 cursor-pointer ${
                            bookingMode === "daily"
                              ? "bg-gold-500 text-slate-950 shadow-sm font-extrabold"
                              : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
                          }`}
                        >
                          {language === "ar" ? "حجز يومي" : language === "fr" ? "Journalier" : "Daily"}
                        </button>
                      </div>

                      {/* Active viewed banner & Min session notice */}
                      <div className="flex flex-col gap-1.5">
                        <div className="bg-zinc-950 border border-zinc-900 px-3 py-1.5 rounded-lg text-[9px] font-mono text-zinc-400 font-semibold uppercase flex items-center justify-between">
                          <span>📅 {formatSelectedDayFullLabel(bookingDate)}</span>
                          {bookingMode === "hourly" && (
                            <span className="text-gold-400 font-bold bg-gold-500/10 px-1.5 py-0.5 rounded border border-gold-500/20 text-[8px]">
                              {language === "ar" ? "أدنى 2 ساعات" : language === "fr" ? "Min. 2 heures" : "Min. 2 Hours"}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Time Slots Toggle Vertical Stack */}
                      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-0.5 scrollbar-thin">
                        {(bookingMode === "hourly"
                          ? [
                              "09:00 - 11:00",
                              "11:00 - 13:00",
                              "13:00 - 15:00",
                              "15:00 - 17:00",
                              "17:00 - 19:00"
                            ]
                          : [
                              "09:00 - 18:00"
                            ]
                        ).map((slotTime) => {
                          const isBusy = isTimeSlotBusy(bookingDate, slotTime);
                          const isSelected = bookingSessions.some(s => s.date === bookingDate && s.time === slotTime);

                          // Check if full day is already selected for this date
                          const hasFullDayOnThisDate = bookingSessions.some(s => s.date === bookingDate && s.time === "09:00 - 18:00");
                          // Check if any hourly slot is selected for this date
                          const hasHourlyOnThisDate = bookingSessions.some(s => s.date === bookingDate && s.time !== "09:00 - 18:00");

                          // Disallow selecting hourly slot if full day is already selected on this date
                          const isDisabledByConflict =
                            (bookingMode === "hourly" && hasFullDayOnThisDate) ||
                            (bookingMode === "daily" && hasHourlyOnThisDate);

                          let slotLabel = slotTime;
                          if (bookingMode === "daily") {
                            slotLabel = language === "ar" 
                              ? "يوم كامل (09:00 - 18:00)" 
                              : language === "fr" 
                              ? "Journée Entière (09:00 - 18:00)" 
                              : "Full Day (09:00 - 18:00)";
                          }

                          if (isBusy || (isDisabledByConflict && !isSelected)) {
                            return (
                              <div
                                key={slotTime}
                                className="border border-zinc-900 border-l-2 border-l-amber-700/50 bg-zinc-950/20 rounded-lg p-2 flex items-center justify-between text-zinc-500 text-[10px] select-none opacity-50"
                                title={
                                  isDisabledByConflict
                                    ? (language === "ar"
                                        ? "لا يمكن الجمع بين حجز يوم كامل وحجز بالساعة في نفس اليوم"
                                        : language === "fr"
                                        ? "Impossible de combiner réservation journalière et horaire le même jour"
                                        : "Cannot combine daily and hourly slots on the same day")
                                    : undefined
                                }
                              >
                                <span className="font-mono line-through">{slotLabel}</span>
                                {isDisabledByConflict ? (
                                  <span className="text-[8px] font-mono text-amber-500/80 bg-amber-950/30 px-1.5 py-0.5 rounded border border-amber-500/20">
                                    {language === "ar" ? "محجوز ضمناً" : language === "fr" ? "Occupé" : "Booked"}
                                  </span>
                                ) : (
                                  <Lock className="w-3 h-3 text-zinc-700" />
                                )}
                              </div>
                            );
                          }

                          return (
                            <button
                              key={slotTime}
                              type="button"
                              onClick={() => {
                                setBookingSessions(prev => {
                                  const exists = prev.some(s => s.date === bookingDate && s.time === slotTime);
                                  if (exists) {
                                    return prev.filter(s => !(s.date === bookingDate && s.time === slotTime));
                                  } else {
                                    const dayLabel = formatSelectedDayFullLabel(bookingDate);
                                    return [...prev, { date: bookingDate, time: slotTime, dayLabel }];
                                  }
                                });
                              }}
                              className={`w-full text-left border rounded-lg p-2.5 flex items-center justify-between transition-all duration-150 cursor-pointer text-[10px] ${
                                isSelected
                                  ? "border-gold-500/40 border-l-2 border-l-gold-500 bg-gold-500/10 text-gold-400 font-bold animate-[pulse_1.5s_infinite]"
                                  : "border-zinc-900 border-l-2 border-l-zinc-800 bg-zinc-950/40 hover:bg-zinc-900 text-zinc-300"
                              }`}
                            >
                              <span className="font-mono">{slotLabel}</span>
                              {isSelected ? (
                                <Check className="w-3 h-3 text-gold-500 font-bold shrink-0" />
                              ) : (
                                <span className="text-[7px] font-mono text-emerald-500 bg-emerald-950/10 px-1 rounded border border-emerald-500/10">
                                  {language === "ar" ? "متاح" : language === "fr" ? "Libre" : "Free"}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Selected Sessions List Summary */}
                  <div className="space-y-2 mt-4">
                    <label className={`block text-[10px] font-mono text-zinc-400 uppercase tracking-wider ${dir === "rtl" ? "text-right" : "text-left"}`}>
                      {language === "ar" ? "جلسات التصوير المحجوزة" : language === "fr" ? "SESSIONS RÉSERVÉES" : "BOOKED SESSIONS"}
                    </label>
                    
                    <div className="bg-[#0c0c0e] border border-zinc-900 rounded-xl p-3.5 space-y-2.5">
                      {bookingSessions.length === 0 ? (
                        <div className="text-center py-4 text-zinc-500 text-[11px] font-mono">
                          {language === "ar" ? "⚠️ لم يتم اختيار أي جلسات بعد. يرجى اختيار تاريخ ووقت لتأكيد الحجز." : language === "fr" ? "⚠️ Aucune session sélectionnée. Veuillez choisir un créneau." : "⚠️ No sessions scheduled yet. Please select slot dates & times above."}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                          {bookingSessions.map((session, index) => (
                            <div key={index} className="flex items-center justify-between bg-zinc-950/80 border border-zinc-900 p-2.5 rounded-lg text-[10px] font-mono">
                              <div className="flex items-center gap-1.5 text-zinc-300">
                                <span className="text-gold-500 font-black font-mono">#{index + 1}</span>
                                <span className="font-bold text-white">{session.dayLabel ? `${session.dayLabel} (${session.date})` : session.date}</span>
                                <span className="text-gold-400 font-semibold">
                                  {session.time === "09:00 - 18:00"
                                    ? (language === "ar" ? "يوم كامل (09:00 - 18:00)" : language === "fr" ? "Journée Entière (09:00 - 18:00)" : "Full Day (09:00 - 18:00)")
                                    : session.time}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setBookingSessions(prev => prev.filter((_, i) => i !== index));
                                }}
                                className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-all cursor-pointer animate-[pulse_2s_infinite]"
                                title="Remove Session"
                              >
                                <Trash className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking form submit & errors */}
                  <div className="mt-5 space-y-4 border-t border-zinc-900 pt-4">
                    {submitError && (
                      <div className="p-3 bg-rose-950/20 border border-rose-500/25 text-rose-300 text-xs rounded-lg font-mono">
                        {submitError}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setWizardStep(1);
                        }}
                        className="px-5 py-3.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
                      >
                        <ChevronLeft className={`w-3.5 h-3.5 ${dir === "rtl" ? "rotate-180" : ""}`} />
                        {language === "ar" ? "تعديل الميزانية" : language === "fr" ? "Modifier Devis" : "Edit Config"}
                      </button>

                      <button
                        type="button"
                        disabled={isSubmitting || bookingSessions.length === 0 || !clientName || !clientEmail || !clientPhone}
                        onClick={handleSubmitEstimate}
                        className={`px-7 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                          bookingSessions.length > 0 && clientName && clientEmail && clientPhone
                            ? "bg-gradient-to-r from-gold-500 to-gold-400 text-slate-950 hover:from-gold-400 hover:to-gold-300 shadow-[0_0_20px_rgba(219,179,116,0.3)] font-extrabold"
                            : "bg-zinc-900 border border-zinc-800 text-zinc-650 cursor-not-allowed"
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <span>{language === "ar" ? "جاري تسجيل الحجز..." : language === "fr" ? "Enregistrement..." : "Saving Booking..."}</span>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          </>
                        ) : (
                          <>
                            {language === "ar" ? "تأكيد حجز الجلسة" : language === "fr" ? "Confirmer la Réservation" : "Confirm production booking"}
                            <Check className="w-4 h-4 text-slate-950 font-black" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  </section>
  );
}
