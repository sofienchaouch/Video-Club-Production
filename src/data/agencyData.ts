import { WorkItem, TeamMember, CostCategory } from "../types";
import sofieneImageLocal from "../assets/images/regenerated_image_1782265113552.jpg";
import hazemImageLocal from "../assets/images/regenerated_image_1782265197228.jpg";
export const sofieneImage = sofieneImageLocal;
export const hazemImage = hazemImageLocal;

export const PORTFOLIO_WORKS: WorkItem[] = [
  {
    id: "company-presentation",
    title: "Company Presentation Videos",
    category: "branded",
    client: "Video Club Production",
    director: "Sofien Chaouch",
    dp: "Youssef Guezguez",
    year: "2026",
    duration: "1:40",
    camera: "RED V-Raptor XL & Sony Venice 2",
    visualStill: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    youtubeId: "TuXP4MTPta4",
    description: "The official cinematic showcase showcasing Video Club Production's elite visual craftsmanship, brand representation, and high-quality creative work environment.",
    challenge: "Seamlessly combining complex industrial, creative, and corporate aesthetics into an engaging and emotionally resonant video narrative.",
    solution: "Directing with a unified lighting philosophy and a mix of dynamic camera movements to highlight key team structures and core values.",
    credits: [
      { role: "Executive Producer", name: "Sofien Chaouch" },
      { role: "Lead Editor", name: "Amine Boufaied" },
      { role: "Colorist", name: "DaVinci Master Group" },
      { role: "Sound Design", name: "Marwan Salem" }
    ],
    tags: ["Official Reel", "Corporate", "Presentation", "Cinematic", "Anamorphic"]
  },
  {
    id: "instagram-reels",
    title: "Instagram Reels",
    category: "branded",
    client: "Social Media Brands",
    director: "Sofien Chaouch",
    dp: "Mehdi Bouhlel",
    year: "2025",
    duration: "0:45",
    camera: "Sony Venice 2 + Cooke Anamorphics",
    visualStill: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80",
    youtubeId: "IfM7dNRKjWc",
    description: "A dynamic and premium collection of vertical videos and Instagram Reels produced to capture immediate attention, built for luxury lifestyle, tech, and modern brands.",
    challenge: "Capturing high-retention viewer interest in the initial three seconds of mobile vertical scrolling feeds.",
    solution: "Using snappy cuts, rhythmic pacing, customized color grading, and stylized subtitles to maximize mobile viewer engagement.",
    credits: [
      { role: "Social Coordinator", name: "Sonia Ben Ammar" },
      { role: "Lead Editor", name: "Amine Boufaied" },
      { role: "Sound Designer", name: "Zied Rahmani" }
    ],
    tags: ["Reels", "Instagram", "Vertical Format", "Dynamic Pacing", "Engagement"]
  },
  {
    id: "fashion-videos",
    title: "Fashion Videos",
    category: "commercial",
    client: "Burda Bleau Studio",
    director: "Sofien Chaouch",
    dp: "Firas Belhassine",
    year: "2026",
    duration: "1:30",
    camera: "RED V-Raptor + Zeiss Supreme Prime",
    visualStill: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
    youtubeId: "L62GKkH-v1w",
    description: "A gorgeous, high-fashion branded visual experience showcasing modern outfit designs, stylistic neon-noire reflections, and elegant urban model settings.",
    challenge: "Creating an editorial look that is deeply artistic while keeping the textures of fabrics and key brand styles perfectly sharp.",
    solution: "Orchestrating high-contrast backlighting, gentle camera sweeps, and custom-designed cinematic LUTs in post-production.",
    credits: [
      { role: "Stylist", name: "Fatma Ben Ayed" },
      { role: "Production Coordinator", name: "Rami Dridi" },
      { role: "Lead Gaffer", name: "Hassen Touati" }
    ],
    tags: ["Fashion", "Commercial", "Aesthetic", "Neon Noir", "High-End"]
  },
  {
    id: "youtube-videos",
    title: "Youtube Videos",
    category: "documentary",
    client: "La Boutique & Heritage Partners",
    director: "Sofien Chaouch",
    dp: "Anis Hammami",
    year: "2025",
    duration: "5:20",
    camera: "ARRI Alexa Mini LF + Atlas Orion",
    visualStill: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    youtubeId: "nl0CngwP5Fw",
    description: "A documentary-style talking-head and dynamic cinematic YouTube video exploring local Medina heritage, modern cuisine, and old-world architecture.",
    challenge: "Orchestrating professional, pristine production layouts inside variable and crowded heritage sites in old Tunis.",
    solution: "Deploying high-speed prime lenses with lightweight LED diffusion panels to create beautiful contrast on ancient stonework.",
    credits: [
      { role: "Art Director", name: "Salma Ben Slimane" },
      { role: "Lead Gaffer", name: "Kamel Mansouri" },
      { role: "VFX Compositor", name: "Wajdi Gharbi" }
    ],
    tags: ["YouTube", "Documentary", "Culture", "Storytelling", "Medina"]
  },
  {
    id: "padel-videos",
    title: "Padel Videos",
    category: "commercial",
    client: "Padel Club Tunisia",
    director: "Sofien Chaouch",
    dp: "Anis Hammami",
    year: "2026",
    duration: "1:15",
    camera: "RED V-Raptor + Atlas Orion Anamorphics",
    visualStill: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80",
    youtubeId: "JWivVT_-fDc",
    description: "An energetic, rapid-fire sports promo video showcasing high-intensity action shots, swift racquet movements, and court speed.",
    challenge: "Tracking extremely fast ball flights and swift athletic moves under bright, direct outdoor sunlight.",
    solution: "Using high-speed shutters and anamorphic optics to capture majestic sun flares, paired with dynamic FPV chase drone footage.",
    credits: [
      { role: "Drone Operator", name: "Rami Dridi" },
      { role: "Sound Design", name: "Marwan Salem" }
    ],
    tags: ["Sports", "Padel", "Action", "FPV Drone", "High-Speed"]
  },
  {
    id: "interview-videos",
    title: "Interview Videos",
    category: "documentary",
    client: "Mieux vaut tard que jamais",
    director: "Sofien Chaouch",
    dp: "Youssef Guezguez",
    year: "2026",
    duration: "4:12",
    camera: "Sony FX6 & FX3 Cinema Line",
    visualStill: "/uploads/studio-podcast.jpg",
    videoUrl: "/uploads/presentation-video.mp4",
    description: "An intimate, beautifully lit multi-camera talking-head interview featuring Nour Boumalela on the second episode of the hit talk series 'Mieux vaut tard que jamais'.",
    challenge: "Capturing pristine sound quality and warm, conversational lighting in a highly reverberant open studio space.",
    solution: "Configuring dual-system wireless audio recorders paired with high-performance lavaliers and deep softbox key lights.",
    credits: [
      { role: "Sound Engineer", name: "Hazem Cherif" },
      { role: "Lead Editor", name: "Sofiene Ben Romdhane" }
    ],
    tags: ["Interview", "Dialogue", "Nour Boumalela", "Show", "Multi-Cam"]
  },
  {
    id: "elyssar-haute-couture",
    title: "Elyssar Haute Couture Campaign",
    category: "photography",
    client: "Elyssar",
    director: "Sofien Chaouch",
    dp: "Sonia Ben Ammar",
    year: "2026",
    duration: "Photography Series",
    camera: "Hasselblad H6D-100c & Profoto Studio Lighting",
    visualStill: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    description: "An editorial photography campaign capturing Mediterranean royal elegance, flowing silk gowns, and hand-embroidered haute couture dresses for Maison Elyssar.",
    challenge: "Rendering intricate gold thread embroidery and natural silk shimmer under high-contrast studio lights.",
    solution: "Utilizing medium format Hasselblad sensors paired with diffused Profoto softboxes and silver reflectors for skin tones.",
    credits: [
      { role: "Lead Photographer", name: "Sofien Chaouch" },
      { role: "Artistic Director", name: "Salma Ben Slimane" },
      { role: "Retoucher", name: "Master Studio Paris" }
    ],
    tags: ["Photography", "Haute Couture", "Elyssar", "Editorial", "Fashion"]
  },
  {
    id: "cartagina-heritage-film",
    title: "Cartagina Ancient Echoes",
    category: "branded",
    client: "Cartagina",
    director: "Sofien Chaouch",
    dp: "Youssef Guezguez",
    year: "2026",
    duration: "2:15",
    camera: "ARRI Alexa Mini LF & Leica Summilux Primes",
    visualStill: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    youtubeId: "nl0CngwP5Fw",
    description: "A poetic luxury brand film captured along Carthaginian coastal ruins, fusing ancient Mediterranean heritage with modern artisanal production.",
    challenge: "Filming golden hour natural sunlight over ancient stonework while maintaining smooth camera movements across uneven seaside terrain.",
    solution: "Deploying Steadicam operators with Leica Summilux warm lenses to capture natural sun flares and rich sea textures.",
    credits: [
      { role: "Executive Director", name: "Sofien Chaouch" },
      { role: "Steadicam Operator", name: "Kamel Mansouri" },
      { role: "Colorist", name: "DaVinci Master Group" }
    ],
    tags: ["Branded Film", "Cartagina", "Heritage", "Mediterranean", "Cinematic"]
  },
  {
    id: "video-club-showcase-svZNfyC6C78",
    title: "Video Club Cinema Showcase",
    category: "commercial",
    client: "Video Club Production",
    director: "Sofien Chaouch",
    dp: "Youssef Guezguez",
    year: "2026",
    duration: "2:15",
    camera: "RED V-Raptor XL & ARRI Alexa Mini LF",
    visualStill: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    youtubeId: "svZNfyC6C78",
    description: "A captivating cinematic showcase produced by Video Club Production, featuring high-end camera work, dynamic lighting, and pristine visual storytelling.",
    challenge: "Creating a high-octane narrative that highlights technical versatility and cinematic polish across diverse commercial scenarios.",
    solution: "Combining anamorphic glass, precise movement, and atmospheric color grading to deliver an immersive viewing experience.",
    credits: [
      { role: "Director", name: "Sofien Chaouch" },
      { role: "Director of Photography", name: "Youssef Guezguez" },
      { role: "Lead Editor", name: "Sofiene Ben Romdhane" }
    ],
    tags: ["Commercial", "Cinematic", "Video Club", "Showcase", "4K"]
  },
  {
    id: "auguste-lookbook",
    title: "Auguste Studio Lookbook 2026",
    category: "photography",
    client: "Auguste",
    director: "Sofien Chaouch",
    dp: "Firas Belhassine",
    year: "2026",
    duration: "Photography Series",
    camera: "Phase One XF 150MP & Broncolor Lighting",
    visualStill: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    description: "High-fashion lookbook studio photography showcasing sharp geometric tailoring, metallic accents, and minimal luxury silhouettes for Auguste Maison.",
    challenge: "Preserving fine fabric weave textures and micro-details across dark charcoal and metallic garments.",
    solution: "Setting up a 150-megapixel Phase One back with targeted optical grid spotlights and hard rim lights.",
    credits: [
      { role: "Lead Photographer", name: "Sofien Chaouch" },
      { role: "Stylist", name: "Fatma Ben Ayed" },
      { role: "Gaffer", name: "Hassen Touati" }
    ],
    tags: ["Photography", "Lookbook", "Auguste", "Studio", "High-Fashion"]
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "sofiene",
    name: "Sofiene Ben Romdhane",
    role: "Creative Lead / Director & Editor",
    bio: "Holder of a Bachelor’s degree from EMC – École Supérieure des Métiers de l’Image, du Son et de la Création 2D-3D in Paris, our creative lead brings years of experience in videography, editing, and audiovisual production. Driven by a passion for storytelling and compelling visuals, he transforms ideas into memorable narratives and delivers polished, professional work that elevates every project.",
    image: sofieneImage,
    specialties: ["Creative Direction", "Post-Production", "Videography", "Visual Storytelling"],
    selectedWorks: ["VIDEO CLUB REEL", "BRAND FILM MASTERS", "CINEMATIC PROJECTS"]
  },
  {
    id: "hazem",
    name: "Hazem Cherif",
    role: "Lead Sound Engineer & Sound Designer",
    bio: "With 5 years of experience, our sound engineer brings both technical mastery and artistic expertise to every stage of audio production, from recording and mixing to post-production. Passionate about delivering impeccable sound and meticulous in every detail, he ensures each project achieves professional, precise, and client-focused results.",
    image: hazemImage,
    specialties: ["Audio Post-Production", "Sound Mixing", "Live Studio Engineering", "Foley & Sound Design"],
    selectedWorks: ["CREATIVE EDGE PODCAST", "CINEMATIC MIXES", "DIRECT MUSIC VIDEOS"]
  }
];

export const CAPABILITIES = [
  {
    title: "VIDEOGRAPHY",
    subtitle: "High-End Cinema Production",
    description: "From concept development to main stage filming, we orchestrate cinematic brand stories. Deployed with 4K/8K cinema rigs (RED V-Raptor, Sony Venice 2), master prime lenses, and studio lighting, our directors deliver striking visual mastery.",
    bullets: ["ARRI, RED, & Sony Venice 2 Cinema Systems", "Heavyweight FPV Drone & Gimbal Stabilization", "Precision Lighting & Studio Optics", "Award-Winning Directors & DPs", "International Shooting & Location Permits"]
  },
  {
    title: "VIDEO EDITING",
    subtitle: "The Final Cut & Grading",
    description: "Post-production is where raw emotion meets visual poetry. In our dedicated suite, we sculpt story pacing, perform Hollywood-level color grading in DaVinci Resolve Studio, and engineer immersive custom audio mixes.",
    bullets: ["Precision Offline & Master Online Editing", "Hollywood-Grade Color Grading in DaVinci", "Spatial Sound Design & Acoustic Scoring", "Seamless VFX, Keying & Motion Graphics", "Multi-Platform Resolution & Aspect Ratios"]
  },
  {
    title: "PODCAST PRODUCTION",
    subtitle: "Cinematic Multi-Cam Studios",
    description: "Record high-impact talk shows and video podcasts in an acoustically optimized studio environment. Complete with live 4K multi-camera switching, broadcast Shure SM7B/Neumann microphones, and dedicated audio engineers.",
    bullets: ["Soundproof Acoustic Wall Treatment", "Multi-Camera 4K Live Video Switching", "Broadcast Shure & Neumann Vocal Microphones", "Custom Animated Lower Thirds & Branding", "Social Media Viral Snippet Extraction"]
  },
  {
    title: "PHOTOGRAPHY",
    subtitle: "Editorial & High-End Visuals",
    description: "Capture the essence of your identity with editorial fashion lookbooks, luxury product packshots, architectural interiors, and high-profile portraiture. Crafted with artistic precision and advanced retouching.",
    bullets: ["Commercial & High-Key Product Photography", "Fashion Editorial & Lookbook Campaigns", "Architecture & Interior Design Coverage", "Corporate Portraiture & Event Coverage", "High-End Beauty & Skin Retouching"]
  },
  {
    title: "BRANDING",
    subtitle: "Identity & Visual Strategy",
    description: "We craft compelling visual identities and brand strategies for leaders, luxury houses, and artists. From moodboards and script treatments to motion titles and brand books, we build iconic visual presence.",
    bullets: ["Creative Scriptwriting & Treatment Design", "Moodboarding & Aesthetic Direction", "Shot List & Storyboard Blueprinting", "Corporate & Luxury Identity Systems", "Cinematic Motion Graphics & Title Sequences"]
  }
];

export const INITIAL_BUDGET_CATEGORIES: CostCategory[] = [
  {
    id: "location-studio",
    name: "Studio Rental — Open Space",
    description: "Lighting (softbox / LED) + paper / vinyl background included",
    items: [
      { id: "studio-hour", name: "Studio Rental — Hourly (Min. 2 Hours)", description: "Lighting (softbox / LED) + paper/vinyl background included (per hour — minimum 2 hours)", basePrice: 100, unitType: "hours", isSelected: true, quantity: 2 },
      { id: "studio-halfday", name: "Studio Rental — Half Day (5 hours)", description: "Lighting + paper/vinyl background included (5-hour session)", basePrice: 400, unitType: "days", isSelected: false, quantity: 1 },
      { id: "studio-fullday", name: "Studio Rental — Full Day (8 hours)", description: "Total access to the stage with lights and backgrounds included (8-hour session)", basePrice: 600, unitType: "days", isSelected: false, quantity: 1 }
    ]
  },
  {
    id: "location-materiel",
    name: "Equipment Rental",
    description: "Flat rate per unit for your shoots",
    items: [
      { id: "camera-rental", name: "Camera Rental", description: "Per camera unit (flat rate applicable for both hour and day)", basePrice: 100, unitType: "units", isSelected: true, quantity: 1 },
      { id: "microphone-rental", name: "Microphone Rental", description: "Per microphone unit (flat rate applicable for both hour and day)", basePrice: 50, unitType: "units", isSelected: false, quantity: 1 }
    ]
  },
  {
    id: "post-production",
    name: "Post-Production & Editing",
    description: "High-end editing, motion graphics, and subtitles for your productions",
    items: [
      { id: "editing-reel", name: "Reel Editing (under 1 min)", description: "Simple edit, pacing assembly, cuts, and raw footage cleaning", basePrice: 100, unitType: "flat", isSelected: false, quantity: 1 },
      { id: "editing-reel-dynamic", name: "Dynamic / Trendy Reel Editing", description: "Fast cuts, modern effects, trending transitions, and animated text overlays", basePrice: 150, unitType: "flat", isSelected: true, quantity: 1 },
      { id: "editing-podcast", name: "Podcast Editing — Full Episode", description: "Audio cleaning, multi-camera switching, voice mixing, and full episode edit", basePrice: 250, unitType: "flat", isSelected: false, quantity: 1 },
      { id: "captions-subtitles", name: "Captions / Subtitles", description: "Adding custom animated subtitles to capture mobile feed attention", basePrice: 100, unitType: "flat", isSelected: false, quantity: 1 }
    ]
  },
  {
    id: "ressources-humaines",
    name: "Human Resources — Field Crew",
    description: "Qualified professionals to assist you during your shoot",
    items: [
      { id: "videographer-halfday", name: "Videographer — Half Day", description: "Professional director/cameraman equipped for a 5-hour shoot", basePrice: 400, unitType: "days", isSelected: false, quantity: 1 },
      { id: "videographer-fullday", name: "Videographer — Full Day", description: "Professional director/cameraman equipped for an 8-hour shoot", basePrice: 650, unitType: "days", isSelected: false, quantity: 1 },
      { id: "sound-engineer-fullday", name: "Sound Engineer — Full Day", description: "Professional audio engineer / sound recordist for an 8-hour shoot", basePrice: 250, unitType: "days", isSelected: false, quantity: 1 },
      { id: "technician-fullday", name: "Technician — Full Day", description: "On-set stage assistant or technician for an 8-hour shoot", basePrice: 150, unitType: "days", isSelected: false, quantity: 1 },
      { id: "photographer-fullday", name: "Photographer — Full Day", description: "Professional photographer for lookbooks, packshots, or press visuals (8h)", basePrice: 600, unitType: "days", isSelected: false, quantity: 1 },
      { id: "photographer-halfday", name: "Photographer — Half Day", description: "Professional photographer for a 5-hour shoot", basePrice: 400, unitType: "days", isSelected: false, quantity: 1 }
    ]
  }
];
