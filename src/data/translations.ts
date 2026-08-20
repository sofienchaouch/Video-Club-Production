export interface LanguageConfig {
  code: "en" | "fr" | "ar";
  label: string;
  dir: "ltr" | "rtl";
}

export const LANGUAGES: LanguageConfig[] = [
  { code: "en", label: "EN", dir: "ltr" },
  { code: "fr", label: "FR", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" }
];

export const TRANSLATIONS = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_about: "About",
    nav_work: "Portfolio",
    nav_budget: "Our Studio",
    nav_capabilities: "Our Expertise",
    nav_gear_vault: "Gear Vault",
    nav_roster: "Team",
    nav_faqs: "FAQs",
    nav_contact: "Contact Us",
    nav_production_house: "PRODUCTION HOUSE",

    // Hero Section
    hero_boutique_agency: "AUDIOVISUAL AGENCY",
    hero_crafting: "CRAFTING",
    hero_cinematic_stories: "CINEMATIC STORIES",
    hero_concept: "We are Video Club Production. An elite production house designing high-end commercials, award-winning music videos, and poetic branded films that linger long after the screen goes dark.",
    hero_play_showreel: "Play Our Presentation Video",
    hero_explore_projects: "Explore Projects",
    trusted_by: "TRUSTED BY ELITE BRANDS & CREATIVE PARTNERS",

    // About & Process Section
    about_label: "ABOUT US",
    about_title: "We always make the best",
    about_desc: "Video Club Production is a creative agency specializing in video production and photography. From concept to delivery, we bring stories to life through cinematic visuals and artistic direction. Our mission is to help brands, businesses, influencers and artists communicate with authenticity, creativity, and emotion turning every idea into powerful images that inspire and connect.",
    why_us_title: "Why Video Club Production?",
    why_us_desc: "Choosing Video Club Production means working with a creative team that masters every stage of visual creation — from production and post-production to photography and art direction. We don’t just deliver content; we craft experiences that enhance your brand and captivate your audience. Whether you need a cinematic video, a powerful visual campaign, or stunning photos, we are the team that can handle it all and take your business to the next level.",
    how_we_work_title: "How We Work",
    how_we_work_desc: "At Video Club Production, every project begins with understanding your vision. We take the time to learn about your goals, your audience, and the message you want to share. Our workflow is designed to be simple, efficient, and fully client-centered — ensuring a smooth creative process from the first message to the final delivery.",
    step_1_title: "Conversation",
    step_1_desc: "We start with a conversation to understand your brand, goals, audience, and message.",
    step_2_title: "Concept & Planning",
    step_2_desc: "We build the concept: moodboard, style, shot list, and production plan.",
    step_3_title: "Production",
    step_3_desc: "We film and photograph high-quality, authentic content that reflects your identity.",
    step_4_title: "Post-Production",
    step_4_desc: "Editing, color grading, sound design, and retouching — your story comes to life.",
    step_5_title: "Refinement & Review",
    step_5_desc: "You review the first draft and we refine it until it’s perfect.",
    step_6_title: "Delivery & Performance",
    step_6_desc: "Final content delivered, optimized for every platform and ready to perform.",

    // Work Showcase
    work_latest_work: "LATEST WORK",
    work_crafted_moments: "Crafted Cinematic Moments",
    work_all_categories: "All Projects",
    work_commercial: "Commercials",
    work_music_video: "Music Videos",
    work_branded: "Branded Content",
    work_documentary: "Documentaries",
    work_client: "Client",
    work_director: "Director",
    work_dp: "Director of Photography",
    work_duration: "Duration",
    work_camera: "Camera Rig",
    work_challenge: "The Challenge",
    work_solution: "The Solution",
    work_credits: "Key Credits",
    work_close: "Close Details",
    work_watch: "Watch Film",

    // Budget Estimator
    budget_calculator: "PRODUCTION COST CALCULATOR",
    budget_headline: "Design Your Custom Production Package",
    budget_description: "Choose services below to dynamically compile a transparent, professional production estimate for your project in Tunisian Dinars (TND). All prices are out of tax (Hors Taxe - HT).",
    budget_selected_services: "selected services",
    budget_save_estimate: "Save Custom Estimate",
    budget_disclaimer: "All prices are indicated in Tunisian Dinars (TND) excluding taxes (HT) for regional productions. Global campaigns may vary.",
    budget_estimated_total: "Estimated Production Budget (HT)",
    budget_tax_notice: "All prices are out of tax (Hors Taxe - HT).",
    budget_custom_prompt: "Need a fully tailored custom treatment or script? Describe your vision to our AI treatment builder or directly submit a prompt.",
    budget_pre_production: "Pre-Production",
    budget_production: "Production (Filming)",
    budget_post_production: "Post-Production",

    // Team Capabilities
    team_workflow: "END-TO-END WORKFLOW",
    team_capabilities_title: "OUR CAPABILITIES",
    team_capabilities_desc: "We operate at the intersection of wild artistic vision and meticulous logistic craftsmanship, shepherding raw stories from initial scripts to final high-grade color prints.",
    team_architects: "CREATIVE ARCHITECTS",
    team_roster_title: "THE TEAM",
    team_roster_desc: "Meet our co-founders and elite team of visual creators, directors, and camera practitioners.",
    team_specialties: "Specialties",
    team_featured_works: "Featured Works",
    team_creative_signature: "Creative Signature",

    // Contact
    contact_title: "GET IN TOUCH",
    contact_subtitle: "Start Your Next Story With Us",
    contact_form_name: "Your Name",
    contact_form_email: "Email Address",
    contact_form_phone: "Phone Number",
    booking_date: "Preferred Session Date",
    booking_time: "Preferred Session Time",
    booking_title: "Book Your Session",
    contact_form_company: "Company Name (Optional)",
    contact_form_project_type: "Project Type",
    contact_form_timeline: "Target Timeline",
    contact_form_budget: "Estimated Budget",
    contact_form_message: "Project Brief / Message",
    contact_form_placeholder_message: "Tell us about your story, aesthetic references, and objectives...",
    contact_form_submit: "Send Inquiry",
    contact_form_success_title: "Message Sent Successfully",
    contact_form_success: "Thank you! Your production inquiry has been received. Our lead producer will review your requirements and reach out within 24 hours.",
    contact_form_reset: "Send Another Message",

    // Showreel Modal
    showreel_streaming: "STREAMING HIGH-BITRATE CINEMA WORK",
    showreel_title: "CHRONOS, VELOCITY, & POETIC SHOTS",
    showreel_desc: "Experience raw Icelandic landscapes, Tokyo cyber alleyways, and the Swiss Alps hairpin corners.",
    showreel_paused: "SHOWREEL PAUSED",
    showreel_resume: "Click anywhere or press play to resume cinematic streaming.",
    showreel_label: "VIDEO CLUB // SHOWREEL 2026 // MASTER RESOLUTION",

    // General UI
    toast_success: "Success! Custom estimate of {amount} for {itemsCount} production services saved.",

    // Footer
    footer_tagline: "A podcast studio and Tunisian audiovisual agency specializing in high-end commercials, award-winning music videos, and poetic branded films that linger long after the screen goes dark.",
    quick_links: "Quick Links",
    all_rights: "All rights reserved"
  },
  fr: {
    // Navigation
    nav_home: "Accueil",
    nav_about: "À Propos",
    nav_work: "Portfolio",
    nav_budget: "Notre Studio",
    nav_capabilities: "Expertise",
    nav_gear_vault: "Arsenal Technique",
    nav_roster: "Équipe",
    nav_faqs: "FAQ",
    nav_contact: "Contact",
    nav_production_house: "MAISON DE PRODUCTION",

    // Hero Section
    hero_boutique_agency: "AGENCE AUDIOVISUELLE",
    hero_crafting: "CRÉATION DE",
    hero_cinematic_stories: "RÉCITS CINÉMATOGRAPHIQUES",
    hero_concept: "Nous sommes Video Club Production. Une maison de production d'élite qui conçoit des publicités haut de gamme, des clips vidéo primés et des films de marque poétiques qui perdurent bien après que l'écran s'éteint.",
    hero_play_showreel: "Voir notre vidéo de présentation",
    hero_explore_projects: "Découvrir les Projets",
    trusted_by: "PARTENAIRES & MARQUES DE PRESTIGE",

    // About & Process Section
    about_label: "À PROPOS DE NOUS",
    about_title: "Nous faisons toujours de notre mieux",
    about_desc: "Video Club Production est une agence créative spécialisée dans la production vidéo et la photographie. Du concept à la livraison, nous donnons vie aux histoires grâce à des visuels cinématographiques et une direction artistique d'excellence. Notre mission est d'aider les marques, les entreprises, les influenceurs et les artistes à communiquer avec authenticité, créativité et émotion, transformant chaque idée en images puissantes qui inspirent et connectent.",
    why_us_title: "Pourquoi Video Club Production ?",
    why_us_desc: "Choisir Video Club Production, c'est collaborer avec une équipe créative qui maîtrise chaque étape de la création visuelle — de la production et post-production à la photographie et la direction artistique. Nous ne livrons pas seulement du contenu ; nous concevons des expériences qui valorisent votre marque et captivent votre audience. Que vous ayez besoin d'une vidéo cinématographique, d'une campagne visuelle percutante ou de photos époustouflantes, nous sommes l'équipe capable de tout orchestrer pour propulser votre entreprise vers de nouveaux sommets.",
    how_we_work_title: "Notre Méthode de Travail",
    how_we_work_desc: "Chez Video Club Production, chaque projet commence par la compréhension de votre vision. Nous prenons le temps d'assimiler vos objectifs, votre public cible et le message que vous souhaitez transmettre. Notre flux de travail est conçu pour être simple, efficace et entièrement centré sur le client — garantissant un processus créatif fluide, du premier message à la livraison finale.",
    step_1_title: "Discussion",
    step_1_desc: "Nous commençons par une conversation pour comprendre votre marque, vos objectifs, votre public et votre message.",
    step_2_title: "Concept & Planification",
    step_2_desc: "Nous construisons le concept : moodboard, style artistique, liste des plans (shot list) et plan de production.",
    step_3_title: "Production",
    step_3_desc: "Nous filmons et photographions des contenus authentiques de haute qualité qui reflètent fidèlement votre identité.",
    step_4_title: "Post-Production",
    step_4_desc: "Montage, étalonnage des couleurs, conception sonore et retouche — votre histoire prend vie.",
    step_5_title: "Ajustements & Révisions",
    step_5_desc: "Vous examinez la première version et nous la peaufinons jusqu'à ce qu'elle soit parfaite.",
    step_6_title: "Livraison & Performance",
    step_6_desc: "Le contenu final est livré, optimisé pour chaque plateforme et prêt à performer.",

    // Work Showcase
    work_latest_work: "DERNIERS TRAVAUX",
    work_crafted_moments: "Moments Cinématographiques Façonnés",
    work_all_categories: "Tous les Projets",
    work_commercial: "Publicités",
    work_music_video: "Clips Vidéos",
    work_branded: "Contenu de Marque",
    work_documentary: "Documentaires",
    work_client: "Client",
    work_director: "Réalisateur",
    work_dp: "Directeur de la Photo",
    work_duration: "Durée",
    work_camera: "Équipement Caméra",
    work_challenge: "Le Défi",
    work_solution: "La Solution",
    work_credits: "Générique",
    work_close: "Fermer les Détails",
    work_watch: "Regarder le Film",

    // Budget Estimator
    budget_calculator: "CALCULATEUR DE COÛTS DE PRODUCTION",
    budget_headline: "Créez Votre Formule de Production Sur Mesure",
    budget_description: "Sélectionnez les services ci-dessous pour compiler de manière dynamique une estimation transparente et professionnelle en Dinars Tunisiens (TND). Tous les prix sont Hors Taxe (HT).",
    budget_selected_services: "services sélectionnés",
    budget_save_estimate: "Enregistrer l'estimation",
    budget_disclaimer: "Tous les prix sont indiqués en Dinars Tunisiens (TND) Hors Taxe (HT) pour les productions régionales.",
    budget_estimated_total: "Budget de Production Estimé (HT)",
    budget_tax_notice: "Tous les prix sont Hors Taxe (HT).",
    budget_custom_prompt: "Besoin d'un scénario ou d'un traitement entièrement sur mesure ? Décrivez votre vision à notre créateur IA.",
    budget_pre_production: "Pré-Production",
    budget_production: "Production (Tournage)",
    budget_post_production: "Post-Production",

    // Team Capabilities
    team_workflow: "FLUX DE TRAVAIL INTÉGRAL",
    team_capabilities_title: "NOS CAPABILITÉS",
    team_capabilities_desc: "Nous opérons à l'intersection d'une vision artistique sauvage et d'un savoir-faire logistique méticuleux, guidant les histoires brutes des scripts initiaux jusqu'aux tirages couleur de qualité supérieure.",
    team_architects: "ARCHITECTES CRÉATIFS",
    team_roster_title: "L'ÉQUIPE",
    team_roster_desc: "Découvrez nos cofondateurs et notre équipe d'élite de créateurs visuels, de réalisateurs et de chefs opérateurs.",
    team_specialties: "Spécialités",
    team_featured_works: "Travaux Phares",
    team_creative_signature: "Signature Créative",

    // Contact
    contact_title: "CONTACTEZ-NOUS",
    contact_subtitle: "Commencez Votre Prochaine Histoire Avec Nous",
    contact_form_name: "Votre Nom",
    contact_form_email: "Adresse E-mail",
    contact_form_phone: "Numéro de Téléphone",
    booking_date: "Date de session préférée",
    booking_time: "Heure de session préférée",
    booking_title: "Réservez votre session",
    contact_form_company: "Nom de l'entreprise (Optionnel)",
    contact_form_project_type: "Type de Projet",
    contact_form_timeline: "Délai Souhaité",
    contact_form_budget: "Budget Estimé",
    contact_form_message: "Brief du Projet / Message",
    contact_form_placeholder_message: "Parlez-nous de votre histoire, de vos références esthétiques et de vos objectifs...",
    contact_form_submit: "Envoyer la Demande",
    contact_form_success_title: "Message Envoyé avec Succès",
    contact_form_success: "Merci ! Votre demande a été reçue. Notre producteur principal examinera vos besoins et vous contactera sous 24 heures.",
    contact_form_reset: "Envoyer un Autre Message",

    // Showreel Modal
    showreel_streaming: "FLUX CINÉMATOGRAPHIQUE HAUT DÉBIT",
    showreel_title: "CHRONOS, VÉLOCITÉ ET IMAGES POÉTIQUES",
    showreel_desc: "Découvrez des paysages islandais bruts, des ruelles cybernétiques de Tokyo et les virages en épingle des Alpes suisses.",
    showreel_paused: "SHOWREEL EN PAUSE",
    showreel_resume: "Cliquez n'importe où ou appuyez sur lecture pour reprendre le flux cinématographique.",
    showreel_label: "VIDEO CLUB // SHOWREEL 2026 // RÉSOLUTION MASTER",

    // General UI
    toast_success: "Succès ! Estimation sur mesure de {amount} pour {itemsCount} services de production enregistrée.",

    // Footer
    footer_tagline: "Un studio podcast et une agence audiovisuelle tunisienne, spécialisés dans les publicités haut de gamme, les clips vidéo primés et les films de marque poétiques qui durent longtemps après que l'écran s'éteigne.",
    quick_links: "Liens rapides",
    all_rights: "Tous droits réservés"
  },
  ar: {
    // Navigation
    nav_home: "الرئيسية",
    nav_about: "من نحن",
    nav_work: "المعرض الفني",
    nav_budget: "الاستوديو الخاص بنا",
    nav_capabilities: "خبراتنا",
    nav_gear_vault: "خزانة العتاد",
    nav_roster: "الفريق",
    nav_faqs: "الأسئلة الشائعة",
    nav_contact: "اتصل بنا",
    nav_production_house: "دار إنتاج سينمائي",

    // Hero Section
    hero_boutique_agency: "وكالة سمعية بصرية",
    hero_crafting: "صناعة",
    hero_cinematic_stories: "قصص سينمائية مذهلة",
    hero_concept: "نحن فيديو كلوب بروداكشن. بيت إنتاج سينمائي نخبي نصمم إعلانات تجارية فاخرة، وفيديوهات موسيقية حائزة على جوائز، وأفلام هوية بصرية شاعرية تترك أثراً طويلاً في الذاكرة بعد انطفاء الشاشة.",
    hero_play_showreel: "شاهد فيديو التقديم الخاص بنا",
    hero_explore_projects: "استكشف المشاريع",
    trusted_by: "شركاء النجاح والعلامات التجارية الرائدة",

    // About & Process Section
    about_label: "من نحن",
    about_title: "نصنع الأفضل دائماً",
    about_desc: "فيديو كلوب بروداكشن هي وكالة إبداعية متخصصة في الإنتاج المرئي والتصوير الفوتوغرافي. من الفكرة والسيناريو إلى التسليم النهائي، نبث الحياة في القصص من خلال مرئيات سينمائية وتوجيه فني متميز. مهمتنا هي مساعدة العلامات التجارية، الشركات، المؤثرين والفنانين على التواصل بأصالة وإبداع وعاطفة جياشة، محولين كل فكرة إلى صور قوية تلهم وتصنع فارقاً.",
    why_us_title: "لماذا فيديو كلوب بروداكشن؟",
    why_us_desc: "اختيار فيديو كلوب بروداكشن يعني العمل مع فريق إبداعي متمكن يتقن كل مرحلة من مراحل الابتكار البصري — بدءاً من الإنتاج وما بعد الإنتاج إلى التصوير الفوتوغرافي والإشراف الفني. نحن لا نقدم مجرد محتوى؛ بل نصنع تجارب متكاملة تعزز حضور علامتك التجارية وتأسر جمهورك. سواء كنت بحاجة إلى فيديو سينمائي، أو حملة بصرية مؤثرة، أو لقطات فوتوغرافية مذهلة، فنحن الفريق القادر على تحقيق ذلك والارتقاء بأعمالك إلى آفاق جديدة.",
    how_we_work_title: "كيف نعمل",
    how_we_work_desc: "في فيديو كلوب بروداكشن، يبدأ كل مشروع بفهم رؤيتك أولاً. نستثمر الوقت الكافي لاستيعاب أهدافك، وجمهورك المستهدف، والرسالة التي ترغب في مشاركتها. تم تصميم سير العمل لدينا ليكون بسيطاً وفعالاً ومرتبطاً باحتياجات العميل بالكامل — مما يضمن عملية إبداعية سلسة وممتعة من أول رسالة حتى التسليم النهائي.",
    step_1_title: "المحادثة والاستكشاف",
    step_1_desc: "نبدأ بنقاش دافئ ومستفيض لفهم علامتك التجارية وأهدافك ورسالتك البصرية.",
    step_2_title: "الفكرة والتخطيط",
    step_2_desc: "نقوم ببناء المفهوم الإبداعي: لوحة الإلهام (Moodboard)، الهوية البصرية، قائمة اللقطات، وخطة التصوير الفعلي.",
    step_3_title: "التصوير والإنتاج",
    step_3_desc: "نقوم بتصوير وإنتاج محتوى فوتوغرافي وسينمائي أصيل وعالي الجودة يعكس جوهر هويتك بدقة.",
    step_4_title: "عمليات ما بعد الإنتاج",
    step_4_desc: "المونتاج، تصحيح الألوان السينمائي، التصميم والمؤثرات الصوتية — لتبدأ قصتك بالنبض والنباهة.",
    step_5_title: "المراجعة والتنقيح",
    step_5_desc: "تراجع المسودة الأولى للمشروع معاً، ونقوم بإجراء التعديلات والتحسينات اللازمة حتى تصل للكمال الفني.",
    step_6_title: "التسليم والنشر",
    step_6_desc: "تسليم المحتوى النهائي والكامل، مهيأً ومحسناً لكل منصات العرض وجاهزاً لإحداث الأثر المطلوب.",

    // Work Showcase
    work_latest_work: "أحدث أعمالنا",
    work_crafted_moments: "لحظات سينمائية مصنوعة بدقة",
    work_all_categories: "جميع المشاريع",
    work_commercial: "الإعلانات التجارية",
    work_music_video: "فيديو كليبات",
    work_branded: "محتوى العلامة التجارية",
    work_documentary: "أفلام وثائقية",
    work_client: "العميل",
    work_director: "المخرج",
    work_dp: "مدير التصوير",
    work_duration: "المدة",
    work_camera: "نوع الكاميرا",
    work_challenge: "التحدي",
    work_solution: "الحل",
    work_credits: "فريق العمل",
    work_close: "إغلاق التفاصيل",
    work_watch: "مشاهدة الفيلم",

    // Budget Estimator
    budget_calculator: "حاسبة تكاليف الإنتاج السينمائي",
    budget_headline: "صمم حزمة الإنتاج المخصصة لك",
    budget_description: "اختر الخدمات أدناه لتجميع ميزانية إنتاج تقديرية شفافة واحترافية لمشروعك بالدينار التونسي (TND). جميع الأسعار غير شاملة للضريبة (دون احتساب الأداءات HT).",
    budget_selected_services: "خدمات مختارة",
    budget_save_estimate: "حفظ الميزانية التقديرية",
    budget_disclaimer: "جميع الأسعار المعروضة بالدينار التونسي (TND) غير شاملة للضريبة (دون احتساب الأداءات HT).",
    budget_estimated_total: "ميزانية الإنتاج التقديرية (دون احتساب الضريبة HT)",
    budget_tax_notice: "جميع الأسعار غير شاملة للضريبة (دون احتساب الأداءات HT).",
    budget_custom_prompt: "هل تحتاج إلى معالجة سينمائية مخصصة أو سيناريو؟ صف رؤيتك لأداة توليد المعالجات بالذكاء الاصطناعي لدينا.",
    budget_pre_production: "مرحلة ما قبل الإنتاج",
    budget_production: "الإنتاج (التصوير الفعلي)",
    budget_post_production: "ما بعد الإنتاج (المونتاج والألوان)",

    // Team Capabilities
    team_workflow: "مراحل العمل المتكاملة",
    team_capabilities_title: "قدراتنا وإنتاجنا",
    team_capabilities_desc: "نحن نعمل عند تقاطع الرؤية الفنية الجامحة والحرفية التنظيمية الدقيقة، لنرعى القصص من الفكرة والسيناريو إلى اللوحة الفنية والألوان النهائية.",
    team_architects: "صنّاع الرؤية الإبداعية",
    team_roster_title: "فريق العمل",
    team_roster_desc: "تعرف على شركائنا المؤسسين ونخبة من المبدعين البصريين والمخرجين وممارسي التصوير السينمائي.",
    team_specialties: "التخصصات الإبداعية",
    team_featured_works: "أعمال مميزة",
    team_creative_signature: "البصمة الإبداعية",

    // Contact
    contact_title: "تواصل معنا",
    contact_subtitle: "ابدأ قصتك السينمائية القادمة معنا",
    contact_form_name: "الاسم الكريم",
    contact_form_email: "البريد الإلكتروني",
    contact_form_phone: "رقم الهاتف",
    booking_date: "تاريخ الجلسة المفضل",
    booking_time: "وقت الجلسة المفضل",
    booking_title: "احجز جلستك السينمائية",
    contact_form_company: "اسم الشركة (اختياري)",
    contact_form_project_type: "نوع المشروع البصري",
    contact_form_timeline: "الجدول الزمني المستهدف",
    contact_form_budget: "الميزانية المتوقعة",
    contact_form_message: "ملخص المشروع / الرسالة",
    contact_form_placeholder_message: "حدثنا عن قصتك، المراجع الجمالية والأهداف المرجوة...",
    contact_form_submit: "إرسال الاستفسار",
    contact_form_success_title: "تم إرسال الرسالة بنجاح",
    contact_form_success: "شكراً لك! تم استلام طلبك بنجاح. سيقوم منتجنا الرئيسي بمراجعة متطلباتك والتواصل معك خلال 24 ساعة.",
    contact_form_reset: "إرسال رسالة أخرى",

    // Showreel Modal
    showreel_streaming: "بث عالي الدقة لأعمال السينما والإنتاج",
    showreel_title: "الزمن، السرعة، واللقطات الشاعرية الدقيقة",
    showreel_desc: "اختبر المناظر الطبيعية الآيسلندية الخام، وأزقة طوكيو السيبرانية، ومنعطفات جبال الألب السويسرية.",
    showreel_paused: "شريط العرض متوقف مؤقتاً",
    showreel_resume: "انقر في أي مكان أو اضغط على تشغيل للاستمرار في مشاهدة العرض السينمائي.",
    showreel_label: "فيديو كلوب // عرض أعمال 2026 // الدقة الرئيسية 4K",

    // General UI
    toast_success: "نجاح! تم حفظ ميزانيتك المخصصة بقيمة {amount} لعدد {itemsCount} من خدمات الإنتاج.",

    // Footer
    footer_tagline: "استوديو بودكاست ووكالة سمعية بصرية تونسية متخصصة في تصميم الإعلانات الفاخرة، الفيديوهات الموسيقية الحائزة على جوائز، وأفلام الهوية البصرية الشاعرية التي تترك أثراً طويلاً بعد انطفاء الشاشة.",
    quick_links: "روابط سريعة",
    all_rights: "جميع الحقوق محفوظة"
  }
};

// Dynamic data with translated fields to maintain clean implementation without modifying layouts heavily
export const TRANSLATED_DATA = {
  en: {
    works: [
      {
        id: "company-presentation",
        title: "Company Presentation Videos",
        client: "Video Club Production",
        director: "Sofien Chaouch",
        dp: "Youssef Guezguez",
        description: "The official cinematic showcase showcasing Video Club Production's elite visual craftsmanship, brand representation, and high-quality creative work environment.",
        challenge: "Seamlessly combining complex industrial, creative, and corporate aesthetics into an engaging and emotionally resonant video narrative.",
        solution: "Directing with a unified lighting philosophy and a mix of dynamic camera movements to highlight key team structures and core values.",
        tags: ["Official Reel", "Corporate", "Presentation", "Cinematic", "Anamorphic"]
      },
      {
        id: "instagram-reels",
        title: "Instagram Reels",
        client: "Social Media Brands",
        director: "Sofien Chaouch",
        dp: "Mehdi Bouhlel",
        description: "A dynamic and premium collection of vertical videos and Instagram Reels produced to capture immediate attention, built for luxury lifestyle, tech, and modern brands.",
        challenge: "Capturing high-retention viewer interest in the initial three seconds of mobile vertical scrolling feeds.",
        solution: "Using snappy cuts, rhythmic pacing, customized color grading, and stylized subtitles to maximize mobile viewer engagement.",
        tags: ["Reels", "Instagram", "Vertical Format", "Dynamic Pacing", "Engagement"]
      },
      {
        id: "fashion-videos",
        title: "Fashion Videos",
        client: "Burda Bleau Studio",
        director: "Sofien Chaouch",
        dp: "Firas Belhassine",
        description: "A gorgeous, high-fashion branded visual experience showcasing modern outfit designs, stylistic neon-noire reflections, and elegant urban model settings.",
        challenge: "Creating an editorial look that is deeply artistic while keeping the textures of fabrics and key brand styles perfectly sharp.",
        solution: "Orchestrating high-contrast backlighting, gentle camera sweeps, and custom-designed cinematic LUTs in post-production.",
        tags: ["Fashion", "Commercial", "Aesthetic", "Neon Noir", "High-End"]
      },
      {
        id: "youtube-videos",
        title: "Youtube Videos",
        client: "La Boutique & Heritage Partners",
        director: "Sofien Chaouch",
        dp: "Anis Hammami",
        description: "A documentary-style talking-head and dynamic cinematic YouTube video exploring local Medina heritage, modern cuisine, and old-world architecture.",
        challenge: "Orchestrating professional, pristine production layouts inside variable and crowded heritage sites in old Tunis.",
        solution: "Deploying high-speed prime lenses with lightweight LED diffusion panels to create beautiful contrast on ancient stonework.",
        tags: ["YouTube", "Documentary", "Culture", "Storytelling", "Medina"]
      },
      {
        id: "padel-videos",
        title: "Padel Videos",
        client: "Padel Club Tunisia",
        director: "Sofien Chaouch",
        dp: "Anis Hammami",
        description: "An energetic, rapid-fire sports promo video showcasing high-intensity action shots, swift racquet movements, and court speed.",
        challenge: "Tracking extremely fast ball flights and swift athletic moves under bright, direct outdoor sunlight.",
        solution: "Using high-speed shutters and anamorphic optics to capture majestic sun flares, paired with dynamic FPV chase drone footage.",
        tags: ["Sports", "Padel", "Action", "FPV Drone", "High-Speed"]
      },
      {
        id: "interview-videos",
        title: "Interview Videos",
        client: "Mieux vaut tard que jamais",
        director: "Sofien Chaouch",
        dp: "Youssef Guezguez",
        description: "An intimate, beautifully lit multi-camera talking-head interview featuring Nour Boumalela on the second episode of the hit talk series 'Mieux vaut tard que jamais'.",
        challenge: "Capturing pristine sound quality and warm, conversational lighting in a highly reverberant open studio space.",
        solution: "Configuring dual-system wireless audio recorders paired with high-performance lavaliers and deep softbox key lights.",
        tags: ["Interview", "Dialogue", "Nour Boumalela", "Show", "Multi-Cam"]
      }
    ],
    team: [
      {
        id: "sofiene",
        name: "Sofiene Ben Romdhane",
        role: "Creative Lead / Director & Editor",
        bio: "Holder of a Bachelor’s degree from EMC – École Supérieure des Métiers de l’Image, du Son et de la Création 2D-3D in Paris, our creative lead brings years of experience in videography, editing, and audiovisual production. Driven by a passion for storytelling and compelling visuals, he transforms ideas into memorable narratives and delivers polished, professional work that elevates every project.",
        specialties: ["Creative Direction", "Post-Production", "Videography", "Visual Storytelling"],
        selectedWorks: ["VIDEO CLUB REEL", "BRAND FILM MASTERS", "CINEMATIC PROJECTS"]
      },
      {
        id: "hazem",
        name: "Hazem Cherif",
        role: "Lead Sound Engineer & Sound Designer",
        bio: "With 5 years of experience, our sound engineer brings both technical mastery and artistic expertise to every stage of audio production, from recording and mixing to post-production. Passionate about delivering impeccable sound and meticulous in every detail, he ensures each project achieves professional, precise, and client-focused results.",
        specialties: ["Audio Post-Production", "Sound Mixing", "Live Studio Engineering", "Foley & Sound Design"],
        selectedWorks: ["CREATIVE EDGE PODCAST", "CINEMATIC MIXES", "DIRECT MUSIC VIDEOS"]
      }
    ],
    capabilities: [
      {
        title: "VIDEOGRAPHY",
        subtitle: "High-End Cinema Production",
        description: "Every great film starts with a powerful vision. We design campaigns from scratch and execute with premium cinema camera kits.",
        bullets: ["ARRI, RED, & Sony Venice 2 Cinema Cameras", "Heavyweight Drone & Gimbal Rigging", "Precision Pursuit Tracking Vehicles", "Award-Winning Directors & DPs", "Global Production Network"]
      },
      {
        title: "VIDEO EDITING",
        subtitle: "The Final Cut & Grading",
        description: "We capture light and movement with industry-leading gear, crews, and precision, putting it together in our premium post-production suite.",
        bullets: ["Premium Offline & Online Editing", "Hollywood-Grade Color Grading in DaVinci", "Immersive Sound Design & Custom Scoring", "Seamless High-End Visual Effects (VFX)", "Subtitles, Localization & Multi-Platform Delivery"]
      },
      {
        title: "PODCAST PRODUCTION",
        subtitle: "Cinematic Multi-Cam Studios",
        description: "We capture crisp sound and high-profile visual talk shows in acoustically perfect studios with state-of-the-art camera and lighting systems.",
        bullets: ["Broadcast-Grade Acoustic Environments", "Multi-Camera 4K Cinematic Switching", "Professional Shure & Neumann Microphones", "Integrated On-Screen Graphics & Lower Thirds", "RSS Feed Distribution & Syndication Setup"]
      },
      {
        title: "PHOTOGRAPHY",
        subtitle: "Capturing Frames & Stories",
        description: "From concept to delivery, we bring stories to life through cinematic visuals and artistic direction, turning every idea into powerful images.",
        bullets: ["Commercial & Product Photography", "Fashion Lookbooks & Editorial Portraits", "Architecture & Interior Visuals", "Events & High-Profile Coverage", "Advanced High-End Retouching"]
      },
      {
        title: "BRANDING",
        subtitle: "Connecting and Inspiring",
        description: "We help brands, businesses, influencers and artists communicate with authenticity, creativity, and emotion.",
        bullets: ["Concept Development & Scriptwriting", "Moodboarding & Visual Treatment", "Detailed Storyboarding", "Corporate Identity Design", "Motion Graphics & Title Design"]
      }
    ],
    budget: {
      "location-studio": "Studio Rental",
      "location-studio_desc": "Lighting (softbox / LED) + paper/vinyl background included",
      "location-materiel": "Equipment Rental",
      "location-materiel_desc": "Professional camera and microphone rental options per unit",
      "post-production": "Post-Production & Editing",
      "post-production_desc": "High-end editing, dynamic cuts, sound mixing, and subtitles",
      "ressources-humaines": "Human Resources — Field Crew",
      "ressources-humaines_desc": "Dedicated filmmakers, photographers, and assistants for your shoot",
      items: {
        "studio-hour": "Studio Rental — Hourly (Min. 2 Hours)",
        "studio-hour_desc": "Lighting (softbox / LED) + paper/vinyl background included (per hour — minimum 2 hours)",
        "studio-halfday": "Studio Rental — Half Day (5 hours)",
        "studio-halfday_desc": "Lighting + paper/vinyl background included (5-hour session)",
        "studio-fullday": "Studio Rental — Full Day (8 hours)",
        "studio-fullday_desc": "Total access to the stage with lights and backgrounds included (8-hour session)",
        "camera-rental": "Camera Rental",
        "camera-rental_desc": "Per camera unit (flat rate applicable for both hour and day)",
        "microphone-rental": "Microphone Rental",
        "microphone-rental_desc": "Per microphone unit (flat rate applicable for both hour and day)",
        "editing-reel": "Reel Editing (under 1 min)",
        "editing-reel_desc": "Simple edit, pacing assembly, cuts and raw footage cleaning",
        "editing-reel-dynamic": "Dynamic / Trendy Reel Editing",
        "editing-reel-dynamic_desc": "Fast cuts, modern effects, trending transitions, and animated text overlays",
        "editing-podcast": "Podcast Editing — Full Episode",
        "editing-podcast_desc": "Audio cleaning, multi-camera switching, voice mixing, and full episode edit",
        "captions-subtitles": "Captions / Subtitles",
        "captions-subtitles_desc": "Adding custom animated subtitles to capture mobile feed attention",
        "videographer-halfday": "Videographer — Half Day",
        "videographer-halfday_desc": "Professional director/cameraman equipped for a 5-hour shoot",
        "videographer-fullday": "Videographer — Full Day",
        "videographer-fullday_desc": "Professional director/cameraman equipped for an 8-hour shoot",
        "sound-engineer-fullday": "Sound Engineer — Full Day",
        "sound-engineer-fullday_desc": "Professional audio engineer / sound recordist for an 8-hour shoot",
        "technician-fullday": "Technician — Full Day",
        "technician-fullday_desc": "On-set stage assistant or technician for an 8-hour shoot",
        "photographer-fullday": "Photographer — Full Day",
        "photographer-fullday_desc": "Professional photographer for lookbooks, packshots, or press visuals (8h)",
        "photographer-halfday": "Photographer — Half Day",
        "photographer-halfday_desc": "Professional photographer for a 5-hour shoot"
      }
    }
  },
  fr: {
    works: [
      {
        id: "company-presentation",
        title: "Vidéos de Présentation d'Entreprise",
        client: "Video Club Production",
        director: "Sofien Chaouch",
        dp: "Youssef Guezguez",
        description: "La présentation cinématographique officielle montrant le savoir-faire visuel d'élite de Video Club Production, la représentation de la marque et un environnement de travail hautement créatif.",
        challenge: "Combiner de manière transparente des esthétiques industrielles, créatives et d'entreprise complexes en un récit vidéo engageant.",
        solution: "Réalisation avec une philosophie d'éclairage unifiée et des mouvements de caméra dynamiques pour mettre en valeur l'équipe et ses valeurs.",
        tags: ["Reel Officiel", "Entreprise", "Présentation", "Cinématographique", "Anamorphique"]
      },
      {
        id: "instagram-reels",
        title: "Instagram Reels",
        client: "Social Media Brands",
        director: "Sofien Chaouch",
        dp: "Mehdi Bouhlel",
        description: "Une collection dynamique et premium de vidéos verticales et de Reels Instagram conçus pour capter l'attention immédiate des marques de luxe, de technologie et de lifestyle.",
        challenge: "Capter l'intérêt des spectateurs dans les trois premières secondes du flux de défilement vertical mobile.",
        solution: "Des coupes rapides, un rythme rythmé, un étalonnage des couleurs personnalisé et des sous-titres stylisés pour maximiser l'engagement.",
        tags: ["Reels", "Instagram", "Format Vertical", "Rythme Dynamique", "Engagement"]
      },
      {
        id: "fashion-videos",
        title: "Vidéos de Mode",
        client: "Burda Bleau Studio",
        director: "Sofien Chaouch",
        dp: "Firas Belhassine",
        description: "Une superbe expérience visuelle haute couture présentant des tenues modernes, des reflets de néon stylisés et un cadre de mannequins urbains élégants.",
        challenge: "Créer un look éditorial profondément artistique tout en préservant la netteté des tissus et des styles de marque clés.",
        solution: "Orchestration d'un contre-jour contrasté, de balayages de caméra fluides et de LUTs cinématographiques personnalisées en post-production.",
        tags: ["Mode", "Commercial", "Esthétique", "Néon Noir", "Haut de Gamme"]
      },
      {
        id: "youtube-videos",
        title: "Vidéos YouTube",
        client: "La Boutique & Heritage Partners",
        director: "Sofien Chaouch",
        dp: "Anis Hammami",
        description: "Une vidéo YouTube de style documentaire avec interviews et cinématiques explorant le patrimoine de la Médina, la cuisine moderne et l'architecture ancienne.",
        challenge: "Mettre en œuvre des dispositifs de production professionnels et soignés dans des sites patrimoniaux animés et variables de la vieille ville de Tunis.",
        solution: "Déploiement d'objectifs de pointe ultra-lumineux et de panneaux LED diffus pour créer de jolis contrastes sur la pierre ancienne.",
        tags: ["YouTube", "Documentary", "Culture", "Storytelling", "Médina"]
      },
      {
        id: "padel-videos",
        title: "Vidéos de Padel",
        client: "Padel Club Tunisia",
        director: "Sofien Chaouch",
        dp: "Anis Hammami",
        description: "Une vidéo promotionnelle sportive énergique et rapide présentant des tirs d'intensité maximale, la vitesse sur le court et la passion grandissante pour le Padel.",
        challenge: "Suivre des balles ultra-rapides et des mouvements athlétiques vifs sous la lumière directe du soleil.",
        solution: "Obturateur haute vitesse et optique anamorphique pour capter de superbes flares solaires, combinés à des balayages dynamiques de drone FPV.",
        tags: ["Sports", "Padel", "Action", "Drone FPV", "Haute Vitesse"]
      },
      {
        id: "interview-videos",
        title: "Vidéos d'Interviews",
        client: "Mieux vaut tard que jamais",
        director: "Sofien Chaouch",
        dp: "Youssef Guezguez",
        description: "Une interview intimiste et joliment éclairée mettant en scène Nour Boumalela dans le deuxième épisode de la série d'interviews 'Mieux vaut tard que jamais'.",
        challenge: "Obtenir une qualité sonore impeccable et un éclairage chaleureux et conversationnel dans un espace de studio ouvert réverbérant.",
        solution: "Mise en œuvre d'enregistreurs audio sans fil double canal avec micros cravates de haute performance et boîtes à lumière douces pour les projecteurs clés.",
        tags: ["Interview", "Dialogue", "Nour Boumalela", "Émission", "Multi-Cam"]
      }
    ],
    team: [
      {
        id: "sofiene",
        name: "Sofiene Ben Romdhane",
        role: "Directeur de Création / Réalisateur & Monteur",
        bio: "Titulaire d'une licence de l'EMC – École Supérieure des Métiers de l'Image, du Son et de la Création 2D-3D à Paris, notre responsable de création apporte des années d'expérience en vidéographie, montage et production audiovisuelle. Animé par une passion pour le récit et les visuels captivants, il transforme les idées en récits mémorables et livre un travail soigné et professionnel qui élève chaque projet.",
        specialties: ["Direction Créative", "Post-Production", "Vidéographie", "Récit Visuel"],
        selectedWorks: ["VIDEO CLUB REEL", "MASTER DES FILMS DE MARQUE", "PROJETS CINÉMATOGRAPHIQUES"]
      },
      {
        id: "hazem",
        name: "Hazem Cherif",
        role: "Ingénieur du Son Principal & Sound Designer",
        bio: "Avec 5 ans d'expérience, notre ingénieur du son apporte à la fois une maîtrise technique et une expertise artistique à toutes les étapes de la production audio, de l'enregistrement et du mixage à la post-production. Passionné par l'obtention d'un son irréprochable et méticuleux dans les moindres détails, il veille à ce que chaque projet obtienne des résultats professionnels, précis et axés sur le client.",
        specialties: ["Post-Production Audio", "Mixage Son", "Ingénierie Studio Live", "Bruitage & Sound Design"],
        selectedWorks: ["PODCAST CREATIVE EDGE", "MIXAGES CINÉMATOGRAPHIQUES", "CLIPS VIDÉO DIRECTS"]
      }
    ],
    capabilities: [
      {
        title: "VIDÉOGRAPHIE",
        subtitle: "Production Cinéma Haut de Gamme",
        description: "Chaque grand film commence par une vision forte. Nous concevons des campagnes à partir de zéro et les exécutons avec des kits de caméras de cinéma haut de gamme.",
        bullets: ["Caméras ARRI, RED & Sony Venice 2", "Prise de vue par drone et nacelle stabilisée", "Véhicules de poursuite et de suivi de précision", "Réalisateurs & Chefs opérateurs primés", "Réseau de production international"]
      },
      {
        title: "MONTAGE VIDÉO",
        subtitle: "La Coupe Finale & l'Étalonnage",
        description: "Nous capturons la lumière et le mouvement avec du matériel de pointe, des équipes qualifiées et de la précision, puis nous assemblons le tout dans notre suite de post-production haut de gamme.",
        bullets: ["Montage Offline & Online Premium", "Étalonnage couleur DaVinci de niveau Hollywood", "Conception sonore immersive & musique sur mesure", "Effets visuels (VFX) haut de gamme fluides", "Sous-titres, localisation et livraison multiplateforme"]
      },
      {
        title: "PRODUCTION DE PODCAST",
        subtitle: "Studios Multi-Cam Cinématographiques",
        description: "Nous capturons un son cristallin et des talk-shows visuels de haut profil dans des studios acoustiquement parfaits équipés de systèmes de caméras et d'éclairage de pointe.",
        bullets: ["Environnements acoustiques de qualité diffusion", "Commutation cinématographique multi-caméras 4K", "Microphones professionnels Shure & Neumann", "Graphismes à l'écran et synthétiseurs intégrés", "Distribution de flux RSS & configuration de syndication"]
      },
      {
        title: "PHOTOGRAPHIE",
        subtitle: "Capturer des Images & des Histoires",
        description: "Du concept à la livraison, nous donnons vie aux histoires à travers des visuels cinématographiques et une direction artistique, transformant chaque idée en images puissantes.",
        bullets: ["Photographie commerciale et de produits", "Lookbooks de mode et portraits éditoriaux", "Visuels d'architecture et d'intérieur", "Couverture d'événements prestigieux", "Retouche avancée haut de gamme"]
      },
      {
        title: "BRANDING",
        subtitle: "Connecter et Inspirer",
        description: "Nous aidons les marques, les entreprises, les influenceurs et les artistes à communiquer avec authenticité, créativité et émotion.",
        bullets: ["Développement de concepts & scénarisation", "Création de planches de tendances (Moodboard)", "Scénarimage (Storyboard) détaillé", "Conception de l'identité d'entreprise", "Animations graphiques et conception de titres"]
      }
    ],
    budget: {
      "location-studio": "Location Studio — Espace Brut",
      "location-studio_desc": "Lumière (softbox / LED) + fond papier / vinyle inclus",
      "location-materiel": "Location Matériel",
      "location-materiel_desc": "Tarif unique par unité pour votre tournage",
      "post-production": "Post-Production & Montage",
      "post-production_desc": "Montage professionnel, étalonnage, design sonore et sous-titres",
      "ressources-humaines": "Ressources Humaines — Équipe Terrain",
      "ressources-humaines_desc": "Techniciens de plateau, vidéastes et photographes professionnels",
      items: {
        "studio-hour": "Location studio — à l'heure (Min. 2 Heures)",
        "studio-hour_desc": "Lumière (softbox / LED) + fond papier / vinyle inclus (par heure — minimum 2 heures)",
        "studio-halfday": "Location studio — demi-journée (5 heures)",
        "studio-halfday_desc": "Lumière + fond papier / vinyle inclus (session de 5 heures)",
        "studio-fullday": "Location studio — journée complète (8 heures)",
        "studio-fullday_desc": "Accès total au plateau avec lumières et fonds papier/vinyle inclus (8 heures)",
        "camera-rental": "Location caméra",
        "camera-rental_desc": "Par unité — tarif unique applicable à l'heure comme à la journée",
        "microphone-rental": "Location microphone",
        "microphone-rental_desc": "Par unité — tarif unique applicable à l'heure comme à la journée",
        "editing-reel": "Montage Reel (moins d'1 minute)",
        "editing-reel_desc": "Montage simple, découpe et assemblage des rushes",
        "editing-reel-dynamic": "Montage Reel Dynamique / Trendy",
        "editing-reel-dynamic_desc": "Montage ultra-rythmé, effets modernes, transitions tendances et sous-titres animés",
        "editing-podcast": "Montage Podcast — épisode complet",
        "editing-podcast_desc": "Nettoyage audio, mixage des voix et montage complet de votre épisode de podcast",
        "captions-subtitles": "Captions / Sous-titres",
        "captions-subtitles_desc": "Ajout de sous-titres animés dynamiques pour capter l'attention sur mobile",
        "videographer-halfday": "Vidéaste — demi-journée",
        "videographer-halfday_desc": "Réalisateur/cadreur professionnel équipé pour une demi-journée de tournage (5h)",
        "videographer-fullday": "Vidéaste — journée complète",
        "videographer-fullday_desc": "Réalisateur/cadreur professionnel équipé pour une journée de tournage de 8 heures",
        "sound-engineer-fullday": "Ingénieur du son — journée complète",
        "sound-engineer-fullday_desc": "Ingénieur du son / preneur de son professionnel pour un tournage de 8 heures",
        "technician-fullday": "Technicien — journée complète",
        "technician-fullday_desc": "Assistant plateau ou technicien dédié pour un tournage de 8 heures",
        "photographer-fullday": "Photographe — journée complète",
        "photographer-fullday_desc": "Photographe professionnel pour vos packshots, lookbooks ou couvertures (8h)",
        "photographer-halfday": "Photographe — demi-journée",
        "photographer-halfday_desc": "Photographe professionnel pour une demi-journée de shooting (5h)"
      }
    }
  },
  ar: {
    works: [
      {
        id: "company-presentation",
        title: "فيديوهات التعريف بالشركات",
        client: "فيديو كلوب للإنتاج",
        director: "سفيان الشاوش",
        dp: "يوسف قزقز",
        description: "شريط العرض السينمائي الرسمي الذي يستعرض الحرفية البصرية العالية لـ فيديو كلوب بروداكشن، والتمثيل البصري للعلامات التجارية وبيئة العمل الإبداعية الراقية.",
        challenge: "الجمع السلس بين الجماليات الصناعية والمؤسسية والإبداعية المعقدة في سرد قصصي بصري جذاب.",
        solution: "الإخراج بفلسفة إضاءة موحدة مع مزيج من حركات الكاميرا الديناميكية لإبراز هيكلية الفريق والقيم الأساسية.",
        tags: ["العرض الرسمي", "تعريف الشركات", "عرض تقديمي", "سينمائي", "أنامورفيك"]
      },
      {
        id: "instagram-reels",
        title: "مقاطع إنستغرام ريلز",
        client: "مختلف العلامات التجارية",
        director: "سفيان الشاوش",
        dp: "مهدي بوهلال",
        description: "مجموعة متميزة وديناميكية من مقاطع الفيديو العمودية وريلز إنستغرام المصممة لجذب الانتباه الفوري، والمعدة للعلامات التجارية الفاخرة والتقنية والحديثة.",
        challenge: "جذب اهتمام المشاهدين والحفاظ على تفاعلهم في الثواني الثلاث الأولى عبر منصات التصفح العمودي للهواتف.",
        solution: "لقطات سريعة، إيقاع متناغم، تلوين سينمائي مخصص، مع ترجمة وعناوين منسقة وجذابة لزيادة فاعلية المشاهدة.",
        tags: ["ريلز", "إنستغرام", "تنسيق عمودي", "إيقاع سريع", "تفاعل"]
      },
      {
        id: "fashion-videos",
        title: "فيديوهات الأزياء والموضة",
        client: "استوديو بوردا بلو",
        director: "سفيان الشاوش",
        dp: "فراس بلحسين",
        description: "تجربة بصرية مذهلة تعنى بأرقى علامات الموضة العصرية وتجمع تفاصيل التصاميم الخلابة مع ألوان النيون وظلال العارضين الحضرية الأنيقة.",
        challenge: "تصميم مظهر تحريري سينمائي فني للغاية مع الحفاظ التام على حدة أقمشة الأزياء وتفاصيل العلامة التجارية البارزة.",
        solution: "استخدام إضاءة خلفية متباينة مع حركات كاميرا انسيابية وتطبيق جداول بحث لونية (LUTs) مخصصة في مرحلة ما بعد الإنتاج.",
        tags: ["أزياء", "إعلان تجاري", "جماليات مخصصة", "نيون نوار", "راقٍ"]
      },
      {
        id: "youtube-videos",
        title: "فيديوهات يوتيوب",
        client: "لا بوتيك وشركاء التراث",
        director: "سفيان الشاوش",
        dp: "أنيس الهمامي",
        description: "فيديو يوتيوب وثائقي سينمائي مميز يستعرض تفاصيل المدينة العتيقة العريقة في تونس، المأكولات المعاصرة، والهندسة المعمارية التراثية.",
        challenge: "إعداد وتنظيم لقطات إنتاجية احترافية خالية من العيوب داخل مواقع تراثية مزدحمة ومتباينة الضوء في تونس العتيقة.",
        solution: "استخدام عدسات بؤرية فائقة السرعة مع لوحات إضاءة LED مبعثرة وخفيفة لإبراز تباينات رائعة على الجدران العتيقة.",
        tags: ["يوتيوب", "وثائقي", "ثقافة", "سرد قصصي", "المدينة العتيقة"]
      },
      {
        id: "padel-videos",
        title: "فيديوهات رياضة البادل",
        client: "نادي البادل تونس",
        director: "سفيان الشاوش",
        dp: "أنيس الهمامي",
        description: "فيديو ترويجي رياضي حماسي وسريع يستعرض لقطات الحركة عالية الكثافة، سرعة تداول الكرة على أرض الملعب، والشغف المتنامي باللعبة.",
        challenge: "تتبع الكرات السريعة للغاية وتحركات اللاعبين الخاطفة تحت أشعة الشمس المباشرة الحادة.",
        solution: "التصوير بسرعات غالق عالية وعدسات أنامورفيك لالتقاط وهج الشمس الطبيعي بشكل سينمائي ساحر، مع لقطات طائرة مذهلة لدرون FPV.",
        tags: ["رياضة", "بادل", "إثارة", "درون FPV", "سرعة عالية"]
      },
      {
        id: "interview-videos",
        title: "فيديوهات المقابلات",
        client: "برنامج 'ميو فو تار كيجامي'",
        director: "سفيان الشاوش",
        dp: "يوسف قزقز",
        description: "مقابلة حميمية ومضاءة بشكل مذهل تعتمد على تصوير متعدد الكاميرات وتستضيف نور بومليلة في الحلقة الثانية من البرنامج الشهير.",
        challenge: "تسجيل صوت نقي خالٍ من الصدى والضجيج، وتطبيق إضاءة دافئة ومريحة في مساحة استوديو مفتوحة وكبيرة.",
        solution: "إعداد أجهزة تسجيل لاسلكية ثنائية النظام مع ميكروفونات لافالير احترافية واستخدام صناديق إضاءة ناعمة وعميقة للإضاءة الرئيسية.",
        tags: ["مقابلة", "حوار", "نور بومليلة", "برنامج", "كاميرات متعددة"]
      }
    ],
    team: [
      {
        id: "sofiene",
        name: "سفيان بن رمضان",
        role: "المشرف الإبداعي / المخرج والمونتير",
        bio: "حاصل على الإجازة من المدرسة العليا لمهن الصورة والصوت والتصميم (EMC) في باريس. يمتلك رئيسنا الإبداعي سنوات من الخبرة الطويلة في تصوير الفيديو، المونتاج والإنتاج السمعي البصري. بدافع الشغف العميق بالسرد القصصي البصري، يحول الأفكار إلى روايات لا تُنسى ويقدم أعمالاً احترافية ترتقي بكل مشروع.",
        specialties: ["الإخراج الإبداعي", "ما بعد الإنتاج", "تصوير الفيديو", "السرد البصري"],
        selectedWorks: ["العرض الرسمي", "أفلام الهوية البصرية للعلامات", "المشاريع السينمائية"]
      },
      {
        id: "hazem",
        name: "حازم الشريف",
        role: "مهندس الصوت الرئيسي ومصمم الصوت",
        bio: "بخمس سنوات من الخبرة الغنية، يجمع مهندس الصوت لدينا بين التمكن التقني والخبرة الفنية في كل مرحلة من مراحل الإنتاج الصوتي، من التسجيل والميكساج إلى ما بعد الإنتاج. يسعى لتقديم صوت نقي وخالٍ من العيوب بدقة متناهية تضمن نجاح العمل واحترافيته البالغة.",
        specialties: ["ما بعد الإنتاج الصوتي", "ميكساج الصوت", "هندسة البث المباشر", "تصميم المؤثرات الصوتية"],
        selectedWorks: ["بودكاست كرياتيف إيدج", "ميكساج سينمائي مدمج", "إخراج الفيديو كليبات الموسيقية"]
      }
    ],
    capabilities: [
      {
        title: "التصوير السينمائي",
        subtitle: "إنتاج سينمائي راقٍ",
        description: "كل فيلم عظيم يبدأ برؤية بصرية قوية. نحن نصمم الحملات من الصفر وننفذها بأحدث معدات كاميرات السينما العالمية.",
        bullets: ["كاميرات ARRI و RED و Sony Venice 2", "تصوير جوي احترافي بالدرون ومثبتات ثقيلة", "سيارات تتبع ومطاردة سينمائية دقيقة", "مخرجون ومديرو تصوير حاصلون على جوائز", "شبكة إنتاج وتنسيق محلية ودولية"]
      },
      {
        title: "المونتاج وتعديل الفيديو",
        subtitle: "المونتاج النهائي وتصحيح الألوان",
        description: "نلتقط الضوء والحركة بدقة متناهية وأحدث الأجهزة المتاحة لجمعها وصياغتها باحترافية كاملة في أجنحة المونتاج وتعديل الألوان لدينا.",
        bullets: ["مونتاج أوفلاين وأونلاين ممتاز وسريع", "تصحيح وتلوين سينمائي بمعايير هوليوود عبر DaVinci", "تصميم صوتي غامر ومؤلفات موسيقية خاصة", "مؤثرات بصرية سينمائية ودمج احترافي (VFX)", "ترجمة وتوطين المحتوى وتسليمه لمختلف المنصات"]
      },
      {
        title: "إنتاج البودكاست",
        subtitle: "استوديوهات سينمائية متعددة الكاميرات",
        description: "نسجل صوتاً فائق النقاء وتصويراً متعدد الكاميرات للبرامج الحوارية البارزة في استوديوهات معزولة صوتياً ومجهزة بأحدث الأنظمة.",
        bullets: ["بيئات استوديو معزولة بمعايير البث التلفزيوني", "تصوير سينمائي 4K متعدد الكاميرات ومباشر", "ميكروفونات شريحة Shure و Neumann الاحترافية", "رسومات وعناوين جرافيكس مدمجة على الشاشة", "إعداد وتوزيع قنوات البث ومختلف المنصات العالمية"]
      },
      {
        title: "التصوير الفوتوغرافي",
        subtitle: "التقاط الإطارات والقصص الرائعة",
        description: "من المفهوم والفكرة إلى التسليم، نبث الحياة في القصص من خلال مرئيات سينمائية وتوجيه فني يحول الأفكار إلى صور فوتوغرافية قوية ومؤثرة.",
        bullets: ["التصوير التجاري وتصوير المنتجات الفاخرة", "كتيبات أزياء الموضة والصور الشخصية الافتتاحية", "تصوير الهندسة المعمارية والديكورات الداخلية", "تغطية الأحداث والمؤتمرات رفيعة المستوى", "معالجة ورتوش وتعديل فني فائق الجودة"]
      },
      {
        title: "الهوية البصرية والعلامات",
        subtitle: "التواصل والجاذبية والإلهام",
        description: "نساعد العلامات التجارية والشركات والمؤثرين والفنانين على التواصل بفعالية وأصالة، وإبراز حضورهم بروح إبداعية ومشاعر حقيقية.",
        bullets: ["تطوير المفاهيم الإبداعية وكتابة النصوص والسيناريو", "تصميم لوحات الإلهام (Moodboarding) والمراجع الجمالية", "رسم لوحات العمل والقصص المصورة (Storyboard) بالتفصيل", "تصميم الهويات البصرية للشركات والمؤسسات", "تصميم جرافيكس متحرك وعناوين مقدمة الأفلام"]
      }
    ],
    budget: {
      "location-studio": "كراء الاستوديو — فضاء خام",
      "location-studio_desc": "إضاءة (softbox / LED) + خلفية ورقية / فينيل مدرجة",
      "location-materiel": "كراء المعدات",
      "location-materiel_desc": "تعريفة موحدة لكل وحدة لجميع متطلبات التصوير",
      "post-production": "ما بعد الإنتاج والمونتاج",
      "post-production_desc": "تعديل، مونتاج ديناميكي، مؤثرات بصرية وهندسة صوت وترجمة",
      "ressources-humaines": "الموارد البشرية — الفريق الميداني",
      "ressources-humaines_desc": "مصورون ومخرجون ومساعدون محترفون مخصصون لتصويركم",
      items: {
        "studio-hour": "كراء الاستوديو — بالساعة (ساعتان كحد أدنى)",
        "studio-hour_desc": "إضاءة (softbox / LED) + خلفية ورقية / فينيل مدرجة (للساعة — ساعتان كحد أدنى)",
        "studio-halfday": "كراء الاستوديو — نصف يوم (5 ساعات)",
        "studio-halfday_desc": "إضاءة + خلفية ورقية / فينيل مدرجة (لمدة 5 ساعات)",
        "studio-fullday": "كراء الاستوديو — يوم كامل (8 ساعات)",
        "studio-fullday_desc": "دخول كامل للفضاء والبلاتو مع الإضاءة والخلفيات المدرجة (لمدة 8 ساعات)",
        "camera-rental": "كراء الكاميرا",
        "camera-rental_desc": "للكاميرا الواحدة (تعريفة موحدة صالحة بالساعة أو باليوم)",
        "microphone-rental": "كراء الميكروفون",
        "microphone-rental_desc": "للميكروفون الواحد (تعريفة موحدة صالحة بالساعة أو باليوم)",
        "editing-reel": "مونتاج ريلز (أقل من دقيقة)",
        "editing-reel_desc": "مونتاج بسيط، تجميع اللقطات وتصفية المشاهد لقصيرة تحت الدقيقة",
        "editing-reel-dynamic": "مونتاج ريلز ديناميكي وسريع",
        "editing-reel-dynamic_desc": "قطع سريع ومؤلفات إيقاعية، مؤثرات بصرية حديثة وترجمات متحركة",
        "editing-podcast": "مونتاج بودكاست — حلقة كاملة",
        "editing-podcast_desc": "تصفية وتنقية الصوت، دمج الكاميرات المتعددة ومونتاج الحلقة كاملة",
        "captions-subtitles": "عناوين وترجمات (Captions)",
        "captions-subtitles_desc": "إضافة ترجمات ديناميكية جذابة للمشاهد لجذب الانتباه عبر الهواتف",
        "videographer-halfday": "مصور فيديو — نصف يوم",
        "videographer-halfday_desc": "مخرج ومصور فيديو محترف مجهز لجلسة تصوير مدتها 5 ساعات",
        "videographer-fullday": "مصور فيديو — يوم كامل",
        "videographer-fullday_desc": "مخرج ومصور فيديو محترف مجهز بالكامل ليوم تصوير 8 ساعات",
        "sound-engineer-fullday": "مهندس صوت — يوم كامل",
        "sound-engineer-fullday_desc": "مهندس صوت / مسجل صوت محترف ليوم تصوير كامل (8 ساعات)",
        "technician-fullday": "تقني — يوم كامل",
        "technician-fullday_desc": "مساعد بلاتو أو تقني ميداني ليوم تصوير كامل من 8 ساعات",
        "photographer-fullday": "مصور فوتوغرافي — يوم كامل",
        "photographer-fullday_desc": "مصور محترف لجلسات تصوير المنتجات، الأزياء واللقطات الشخصية (8 ساعات)",
        "photographer-halfday": "مصور فوتوغرافي — نصف يوم",
        "photographer-halfday_desc": "مصور محترف لجلسة تصوير مدتها 5 ساعات"
      }
    }
  }
};
