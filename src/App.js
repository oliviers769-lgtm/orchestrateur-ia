import React, { useState, useRef, useEffect } from 'react';

// ============================================================
// Orchestrateur IA — App.js
// Version : 7.1 — Mars 2026
// ============================================================

const CONFIG = {
  siteName:    "Orchestrateur IA",
  ownerName:   "Jean-Luc Descombes",
  telephone:   "+33 07 70 00 73 35",
  email:       "jeanlucdescombes76@gmail.com",
  adresse:     "Vienne (38)",
  anthropicKey: "",
  systemPrompt:
    "Tu es l'assistant de Jean-Luc Descombes, orchestrateur IA basé à Vienne (38). " +
    "Tu aides les visiteurs à comprendre ce qu'est l'orchestration IA, comment Jean-Luc " +
    "conçoit des sites web modernes en combinant les meilleurs outils IA (Claude, Copilot, Grok...), " +
    "et comment le contacter pour un projet. Tu réponds en français, de façon claire et concise.",
};

const COLORS = {
  primary:   "#0a1628",
  secondary: "#00d4ff",
  dark:      "#050c1a",
  light:     "#f0f4ff",
  text:      "#1a1a2e",
  aiOrange:  "#e8711a",
  aiBlue:    "#1a73e8",
  aiDark:    "#2d2d2d",
  aiCyan:    "#00d4ff",
};

const AI_BADGES = [
  { label: "Claude",                   role: "Construction & déploiement", color: COLORS.aiOrange },
  { label: "Copilot",                  role: "Conception",                 color: COLORS.aiBlue   },
  { label: "Grok",                     role: "Design",                     color: COLORS.aiDark   },
  { label: "Jean-Luc · Orchestrateur", role: "Orchestration générale",     color: COLORS.aiCyan   },
];

const PORTFOLIO = [
  {
    title: "ASD — Aide Soignant à Domicile",
    desc: "Site vitrine pour une activité d'aide à domicile indépendante. Design épuré, formulaire de contact, référencement local Vienne (38).",
    url: "https://aidesoignant-vienne.fr",
    tags: ["React", "Vercel", "SEO local"],
    icon: "🏥",
  },
  {
    title: "Phone 7 Up",
    desc: "Site e-commerce pour une boutique de téléphonie. Galerie produits, section crypto, vidéos animées, design cyberpunk.",
    url: "https://phone7up.vercel.app",
    tags: ["React", "Vercel", "E-commerce"],
    icon: "📱",
  },
  {
    title: "NumAdminIA",
    desc: "Application civic-tech pour réduire la fracture numérique. 14 modules, 56 leçons, 3 langues (FR/AR/PT), feedback IA personnalisé via Mistral.",
    url: "https://numadminia.vercel.app",
    tags: ["React", "IA Mistral", "Multilingue", "Civic-tech"],
    icon: "🧭",
  },
  {
    title: "ExpanceLoop",
    desc: "Plateforme éducative interactive : logique, Python, HTML-CSS, JS, SQL. Exécution de code en direct (Pyodide), sauvegarde Supabase, scénario hôpital.",
    url: "https://expanceloop-oliviers-projects-87cc94b2.vercel.app",
    tags: ["React", "Pyodide", "Supabase", "EdTech"],
    icon: "🎓",
  },
  {
    title: "Orchestrateur IA",
    desc: "Ce site — présentation de la méthodologie d'orchestration IA. Chatbot intégré (proxy sécurisé), paiement Stripe, 5 langues.",
    url: "https://orchestrateur-ia.vercel.app",
    tags: ["React", "Stripe", "Chatbot IA"],
    icon: "🤖",
  },
];

const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  left:     `${(i * 19.1) % 100}%`,
  size:     `${1 + (i % 3)}px`,
  duration: `${7 + (i % 11)}s`,
  delay:    `${(i * 0.9) % 10}s`,
  opacity:  0.5 + (i % 4) * 0.12,
}));

const globalStyles = `
  * { box-sizing: border-box; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  body { margin: 0; padding: 0; }
  @keyframes floatStar {
    0%   { transform: translateY(0);      opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(-100vh); opacity: 0; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes glowPulse {
    0%,100% { filter: drop-shadow(0 0 8px rgba(0,212,255,0.5)); }
    50%     { filter: drop-shadow(0 0 22px rgba(0,212,255,1)) drop-shadow(0 0 40px rgba(0,212,255,0.4)); }
  }
  @keyframes floatLogo {
    0%,100% { transform: translateY(0px); }
    50%     { transform: translateY(-10px); }
  }
  @keyframes shimmerCta {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes badgePulse {
    0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,50,50,0.7); }
    50%     { transform: scale(1.15); box-shadow: 0 0 0 6px rgba(255,50,50,0); }
  }
  @keyframes pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(0,212,255,0.45); }
    50%     { box-shadow: 0 0 0 14px rgba(0,212,255,0); }
  }
  .star {
    position: absolute; border-radius: 50%; background: #fff;
    animation: floatStar linear infinite;
  }
  .card-service { transition: transform .2s, box-shadow .2s; }
  .card-service:hover { transform: translateY(-5px); box-shadow: 0 10px 36px rgba(0,0,0,0.13), 0 0 0 2px rgba(0,212,255,0.5), 0 0 24px rgba(0,212,255,0.25) !important; border-top-color: #00d4ff !important; }
  .temoignage-card { transition: transform .2s; }
  .temoignage-card:hover { transform: translateY(-3px); }
  input:focus, textarea:focus { border-color: #00d4ff !important; box-shadow: 0 0 0 3px rgba(0,212,255,0.12); }
  .burger-line { display: block; width: 22px; height: 2px; background: #fff; border-radius: 2px; transition: all .3s; }
  /* Loupe — fix global font-size sur <html> */
  html { font-size: 16px; }
`;

const S = {
  btn: (bg, color, extra = {}) => ({
    background: bg, color, border: 'none', borderRadius: 8,
    padding: '12px 24px', fontWeight: 700, cursor: 'pointer',
    fontSize: '0.95rem', textDecoration: 'none', display: 'inline-block',
    transition: 'all .2s', ...extra,
  }),
  card: {
    background: '#fff', borderRadius: 14, padding: 24,
    boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
  },
  modal: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 2000, padding: 16,
  },
};

// ============================================================
// TRADUCTIONS
// ============================================================

const LANGS = [
  { code: 'fr', flag: '🇫🇷', label: 'FR' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
  { code: 'it', flag: '🇮🇹', label: 'IT' },
  { code: 'es', flag: '🇪🇸', label: 'ES' },
  { code: 'zh', flag: '🇨🇳', label: 'ZH' },
  { code: 'ar', flag: '🇸🇦', label: 'AR' },
  { code: 'pt', flag: '🇵🇹', label: 'PT' },
];

const translations = {
  fr: {
    navServices:      "Services",
    navAbout:         "À propos",
    navFaq:           "FAQ",
    navContact:       "Contact",
    navTemoignages:   "Portfolio",
    whoAmI:           "Qui je suis",
    heroTitle:        "Votre site web professionnel,\nlivré en 72h.",
    heroSubtitle:     "Conçu avec l'IA, sur mesure, sans jargon technique.\nÀ partir de 250€ · Paiement sécurisé · Satisfait ou remboursé",
    heroCta:          "Demander un devis gratuit →",
    heroPhone:        "Appeler",
    heroDiscover:     "Découvrir",
    heroPrice:        "À partir de 250 €",
    heroPaypal:       "Paiement sécurisé par carte",
    servicesTitle:    "Mes services",
    services: [
      { icon: "🤖", title: "Orchestration IA",    desc: "Je combine Claude, Copilot, Grok et d'autres outils IA pour créer des solutions adaptées à vos besoins." },
      { icon: "🌐", title: "Sites web modernes",  desc: "Conception et déploiement de sites React performants, responsive et optimisés pour le référencement." },
      { icon: "⚡", title: "Automatisation",       desc: "Mise en place de workflows intelligents pour gagner du temps et réduire les tâches répétitives." },
      { icon: "🎯", title: "Conseil & formation", desc: "Accompagnement personnalisé pour intégrer l'IA dans vos projets professionnels." },
    ],
    aboutTitle:       "Qui suis-je ?",
    aboutText:        "Je conçois des sites web modernes en orchestrant intelligemment l'IA pour créer des expériences simples, rapides et adaptées aux besoins réels des utilisateurs. Basé à Vienne (38), j'accompagne particuliers et professionnels dans leur transformation numérique en tirant le meilleur de chaque outil IA disponible.",
    faqTitle:         "Questions fréquentes",
    faq: [
      { q: "Qu'est-ce que l'orchestration IA ?",     a: "L'orchestration IA consiste à combiner intelligemment plusieurs outils d'intelligence artificielle (Claude, Copilot, Grok...) pour produire un résultat supérieur à ce qu'un seul outil pourrait réaliser." },
      { q: "Combien coûte la création d'un site ?",  a: "Les tarifs démarrent à 250 €. Chaque projet est unique — contactez-moi pour un devis personnalisé selon vos besoins." },
      { q: "Quelle est votre zone d'intervention ?", a: "Basé à Vienne (38), j'interviens en présentiel localement et à distance pour toute la France." },
      { q: "Quels outils IA utilisez-vous ?",        a: "J'utilise principalement Claude (Anthropic), Copilot (Microsoft) et Grok (xAI), selon les besoins de chaque projet." },
    ],
    temoignagesTitle: "Ils me font confiance",
    discoverTitle:    "Prêt à démarrer ?",
    discoverSub:      "Un site professionnel conçu avec l'IA, livré rapidement.",
    contactTitle:     "Me contacter",
    contactName:      "Votre nom",
    contactPhone:     "Votre téléphone",
    contactEmail:     "Votre email",
    contactMessage:   "Votre message",
    contactSend:      "Envoyer",
    contactSuccess:   "✅ Message envoyé avec succès !",
    contactError:     "❌ Erreur — envoi par email de secours.",
    chatOpen:           "💬",
    chatTitle:          "Assistant IA",
    chatPlaceholder:    "Posez votre question...",
    chatSend:           "Envoyer",
    chatWelcome:        "Bonjour ! Je suis l'assistant de Jean-Luc. Comment puis-je vous aider ?",
    chatKeyLabel:       "Clé API Anthropic",
    chatKeyPlaceholder: "sk-ant-...",
    chatKeyConfirm:     "Confirmer",
    portfolioTitle:   "Projets réalisés",
    portfolioBtn:     "Voir le site →",
    mentionsTitle:    "Mentions légales",
    mentionsContent:  "Éditeur : Jean-Luc Descombes · Vienne (38200) · jeanlucdescombes76@gmail.com · +33 07 70 00 73 35. Hébergeur : Vercel Inc., 340 Pine Street, San Francisco, CA 94104, USA. Site conçu avec l'assistance d'outils IA (Claude · Copilot · Grok). SIRET en cours d'immatriculation.",
    footerRights: `© ${new Date().getFullYear()} Orchestrateur IA — Tous droits réservés`,
  },
  ar: {
    navServices: "الخدمات", navAbout: "من أنا", navFaq: "أسئلة شائعة", navContact: "اتصل بي", navTemoignages: "المشاريع",
    whoAmI: "من أنا",
    heroTitle: "موقعك الاحترافي،\nخلال 72 ساعة.",
    heroSubtitle: "مصمم بالذكاء الاصطناعي، مخصص، بدون تعقيد.\nابتداءً من 250€ · دفع آمن · ضمان الرضا",
    heroCta: "طلب عرض مجاني →", heroPhone: "اتصل", heroDiscover: "اكتشف", heroPrice: "ابتداءً من 250 €", heroPaypal: "دفع آمن بالبطاقة",
    servicesTitle: "خدماتي",
    services: [
      { icon: "🤖", title: "تنسيق الذكاء الاصطناعي", desc: "أجمع بين Claude و Copilot و Grok و Mistral لإنشاء حلول مخصصة لاحتياجاتك." },
      { icon: "🌐", title: "مواقع ويب حديثة", desc: "تصميم ونشر مواقع React عالية الأداء ومتجاوبة ومحسّنة لمحركات البحث." },
      { icon: "⚡", title: "أتمتة", desc: "إنشاء سير عمل ذكية لتوفير الوقت وتقليل المهام المتكررة." },
      { icon: "🎯", title: "استشارة وتدريب", desc: "مرافقة شخصية لدمج الذكاء الاصطناعي في مشاريعك المهنية." },
    ],
    aboutTitle: "من أنا؟",
    aboutText: "أصمم مواقع ويب حديثة من خلال التنسيق الذكي للذكاء الاصطناعي لإنشاء تجارب بسيطة وسريعة ومكيّفة مع الاحتياجات الفعلية للمستخدمين. أعمل من فيان (38) وأرافق الأفراد والمهنيين في تحولهم الرقمي.",
    faqTitle: "الأسئلة الشائعة",
    faq: [
      { q: "ما هو تنسيق الذكاء الاصطناعي؟", a: "هو الجمع الذكي بين عدة أدوات ذكاء اصطناعي (Claude, Copilot, Grok...) لإنتاج نتيجة أفضل مما يمكن تحقيقه بأداة واحدة." },
      { q: "ما هي تكلفة إنشاء موقع ويب؟", a: "تبدأ الأسعار من 250 €. كل مشروع فريد — تواصل معي للحصول على عرض مخصص." },
      { q: "ما هي منطقة تدخلك؟", a: "أعمل من فيان (38) عن بُعد لجميع أنحاء فرنسا." },
      { q: "ما هي أدوات الذكاء الاصطناعي التي تستخدمها؟", a: "أستخدم بشكل رئيسي Claude و Copilot و Grok و Mistral حسب احتياجات كل مشروع." },
    ],
    temoignagesTitle: "يثقون بي",
    discoverTitle: "مستعد للبدء؟", discoverSub: "موقع احترافي مصمم بالذكاء الاصطناعي، تسليم سريع.",
    contactTitle: "تواصل معي", contactName: "اسمك", contactPhone: "هاتفك", contactEmail: "بريدك الإلكتروني", contactMessage: "رسالتك", contactSend: "إرسال", contactSuccess: "✅ تم الإرسال بنجاح!", contactError: "❌ خطأ.",
    chatOpen: "💬", chatTitle: "المساعد الذكي", chatPlaceholder: "اطرح سؤالك...", chatSend: "إرسال",
    chatWelcome: "مرحباً! أنا مساعد جان-لوك. كيف يمكنني مساعدتك؟",
    chatKeyLabel: "مفتاح API", chatKeyPlaceholder: "sk-ant-...", chatKeyConfirm: "تأكيد",
    portfolioTitle: "المشاريع المنجزة", portfolioBtn: "زيارة الموقع →",
    mentionsTitle: "ملاحظات قانونية",
    mentionsContent: "المحرر: Jean-Luc Descombes · Vienne (38200) · jeanlucdescombes76@gmail.com. المضيف: Vercel Inc., San Francisco, USA.",
    footerRights: `© ${new Date().getFullYear()} Orchestrateur IA`,
  },
  pt: {
    navServices: "Serviços", navAbout: "Sobre mim", navFaq: "FAQ", navContact: "Contacto", navTemoignages: "Portfolio",
    whoAmI: "Quem sou eu",
    heroTitle: "O seu site profissional,\nentregue em 72h.",
    heroSubtitle: "Criado com IA, personalizado, sem jargão técnico.\nA partir de 250€ · Pagamento seguro · Satisfação garantida",
    heroCta: "Pedir orçamento gratuito →", heroPhone: "Ligar", heroDiscover: "Descobrir", heroPrice: "A partir de 250 €", heroPaypal: "Pagamento seguro por cartão",
    servicesTitle: "Os meus serviços",
    services: [
      { icon: "🤖", title: "Orquestração de IA", desc: "Combino Claude, Copilot, Grok e Mistral para criar soluções adaptadas às suas necessidades." },
      { icon: "🌐", title: "Sites modernos", desc: "Conceção e implementação de sites React performativos, responsivos e otimizados para SEO." },
      { icon: "⚡", title: "Automatização", desc: "Criação de fluxos de trabalho inteligentes para poupar tempo e reduzir tarefas repetitivas." },
      { icon: "🎯", title: "Consultoria & formação", desc: "Acompanhamento personalizado para integrar a IA nos seus projetos profissionais." },
    ],
    aboutTitle: "Quem sou eu?",
    aboutText: "Concebo sites modernos orquestrando inteligentemente a IA para criar experiências simples, rápidas e adaptadas às necessidades reais dos utilizadores. Baseado em Vienne (38), acompanho particulares e profissionais na sua transformação digital.",
    faqTitle: "Perguntas frequentes",
    faq: [
      { q: "O que é a orquestração de IA?", a: "Consiste em combinar inteligentemente várias ferramentas de IA (Claude, Copilot, Grok...) para produzir um resultado superior ao que uma única ferramenta poderia alcançar." },
      { q: "Quanto custa a criação de um site?", a: "A partir de 250 €. Cada projeto é único — contacte-me para um orçamento personalizado." },
      { q: "Qual é a sua área de intervenção?", a: "Baseado em Vienne (38), intervenho à distância para toda a França." },
      { q: "Que ferramentas de IA utiliza?", a: "Utilizo principalmente Claude, Copilot, Grok e Mistral, conforme as necessidades de cada projeto." },
    ],
    temoignagesTitle: "Confiam em mim",
    discoverTitle: "Pronto para começar?", discoverSub: "Um site profissional criado com IA, entregue rapidamente.",
    contactTitle: "Contactar-me", contactName: "O seu nome", contactPhone: "O seu telefone", contactEmail: "O seu email", contactMessage: "A sua mensagem", contactSend: "Enviar", contactSuccess: "✅ Mensagem enviada!", contactError: "❌ Erro.",
    chatOpen: "💬", chatTitle: "Assistente IA", chatPlaceholder: "Faça a sua pergunta...", chatSend: "Enviar",
    chatWelcome: "Olá! Sou o assistente de Jean-Luc. Como posso ajudar?",
    chatKeyLabel: "Chave API", chatKeyPlaceholder: "sk-ant-...", chatKeyConfirm: "Confirmar",
    portfolioTitle: "Projetos realizados", portfolioBtn: "Ver o site →",
    mentionsTitle: "Menções legais",
    mentionsContent: "Editor: Jean-Luc Descombes · Vienne (38200) · jeanlucdescombes76@gmail.com. Alojamento: Vercel Inc., San Francisco, USA. SIRET em processo de registo.",
    footerRights: `© ${new Date().getFullYear()} Orchestrateur IA — Todos os direitos reservados`,
  },
  en: {
    navServices: "Services", navAbout: "About", navFaq: "FAQ", navContact: "Contact", navTemoignages: "Portfolio",
    whoAmI: "Who I am",
    heroTitle: "Your professional website,\ndelivered in 72h.",
    heroSubtitle: "Built with AI, tailored to you, no technical jargon.\nFrom 250€ · Secure payment · Satisfaction guaranteed",
    heroCta: "Request a free quote →", heroPhone: "Call", heroDiscover: "Discover", heroPrice: "From 250 €", heroPaypal: "Secure card payment",
    servicesTitle: "My services",
    services: [
      { icon: "🤖", title: "AI Orchestration", desc: "I combine Claude, Copilot, Grok and Mistral to create solutions tailored to your needs." },
      { icon: "🌐", title: "Modern websites", desc: "Design and deployment of high-performance, responsive React sites optimized for SEO." },
      { icon: "⚡", title: "Automation", desc: "Setting up intelligent workflows to save time and reduce repetitive tasks." },
      { icon: "🎯", title: "Consulting & training", desc: "Personalized support to integrate AI into your professional projects." },
    ],
    aboutTitle: "Who am I?",
    aboutText: "I design modern websites by intelligently orchestrating AI to create simple, fast experiences adapted to real user needs. Based in Vienne (38), I support individuals and professionals in their digital transformation by getting the best out of each available AI tool.",
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "What is AI orchestration?", a: "AI orchestration means intelligently combining multiple AI tools (Claude, Copilot, Grok...) to produce a result superior to what any single tool could achieve." },
      { q: "How much does a website cost?", a: "Prices start at 250 €. Every project is unique — contact me for a personalized quote." },
      { q: "Where do you operate?", a: "Based in Vienne (38), I work remotely for clients throughout France and abroad." },
      { q: "Which AI tools do you use?", a: "I mainly use Claude (Anthropic), Copilot (Microsoft), Grok (xAI) and Mistral, depending on each project's needs." },
    ],
    temoignagesTitle: "They trust me",
    discoverTitle: "Ready to start?", discoverSub: "A professional website built with AI, delivered fast.",
    contactTitle: "Contact me", contactName: "Your name", contactPhone: "Your phone", contactEmail: "Your email", contactMessage: "Your message", contactSend: "Send", contactSuccess: "✅ Message sent successfully!", contactError: "❌ Error — fallback email sent.",
    chatOpen: "💬", chatTitle: "AI Assistant", chatPlaceholder: "Ask your question...", chatSend: "Send",
    chatWelcome: "Hello! I'm Jean-Luc's assistant. How can I help you?",
    chatKeyLabel: "Anthropic API Key", chatKeyPlaceholder: "sk-ant-...", chatKeyConfirm: "Confirm",
    portfolioTitle: "Projects delivered", portfolioBtn: "Visit website →",
    mentionsTitle: "Legal notices",
    mentionsContent: "Publisher: Jean-Luc Descombes · Vienne (38200) · jeanlucdescombes76@gmail.com · +33 07 70 00 73 35. Hosting: Vercel Inc., 340 Pine Street, San Francisco, CA 94104, USA. SIRET registration in progress.",
    footerRights: `© ${new Date().getFullYear()} Orchestrateur IA — All rights reserved`,
  },
  it: {
    navServices: "Servizi", navAbout: "Chi sono", navFaq: "FAQ", navContact: "Contatti", navTemoignages: "Portfolio",
    whoAmI: "Chi sono",
    heroTitle: "Il tuo sito professionale,\nconsegnato in 72h.",
    heroSubtitle: "Creato con l'IA, su misura, senza gergo tecnico.\nDa 250€ · Pagamento sicuro · Soddisfazione garantita",
    heroCta: "Richiedi un preventivo gratuito →", heroPhone: "Chiama", heroDiscover: "Scopri", heroPrice: "Da 250 €", heroPaypal: "Pagamento sicuro con carta",
    servicesTitle: "I miei servizi",
    services: [
      { icon: "🤖", title: "Orchestrazione IA", desc: "Combino Claude, Copilot, Grok e Mistral per creare soluzioni su misura per le tue esigenze." },
      { icon: "🌐", title: "Siti web moderni", desc: "Progettazione e distribuzione di siti React performanti, responsive e ottimizzati per la SEO." },
      { icon: "⚡", title: "Automazione", desc: "Implementazione di flussi di lavoro intelligenti per risparmiare tempo e ridurre le attività ripetitive." },
      { icon: "🎯", title: "Consulenza & formazione", desc: "Supporto personalizzato per integrare l'IA nei tuoi progetti professionali." },
    ],
    aboutTitle: "Chi sono?",
    aboutText: "Progetto siti web moderni orchestrando in modo intelligente l'IA per creare esperienze semplici, veloci e adattate alle reali esigenze degli utenti. Con base a Vienne (38), supporto privati e professionisti nella loro trasformazione digitale.",
    faqTitle: "Domande frequenti",
    faq: [
      { q: "Cos'è l'orchestrazione IA?", a: "L'orchestrazione IA consiste nel combinare in modo intelligente più strumenti di intelligenza artificiale (Claude, Copilot, Grok...) per produrre un risultato superiore a quello che un singolo strumento potrebbe realizzare." },
      { q: "Quanto costa la creazione di un sito?", a: "I prezzi partono da 250 €. Ogni progetto è unico — contattami per un preventivo personalizzato." },
      { q: "Qual è la tua area di intervento?", a: "Con base a Vienne (38), lavoro da remoto per tutta la Francia e anche all'estero." },
      { q: "Quali strumenti IA utilizzi?", a: "Utilizzo principalmente Claude (Anthropic), Copilot (Microsoft), Grok (xAI) e Mistral, a seconda delle esigenze di ogni progetto." },
    ],
    temoignagesTitle: "Si fidano di me",
    discoverTitle: "Pronto a iniziare?", discoverSub: "Un sito professionale creato con l'IA, consegnato rapidamente.",
    contactTitle: "Contattami", contactName: "Il tuo nome", contactPhone: "Il tuo telefono", contactEmail: "La tua email", contactMessage: "Il tuo messaggio", contactSend: "Invia", contactSuccess: "✅ Messaggio inviato con successo!", contactError: "❌ Errore — invio email di riserva.",
    chatOpen: "💬", chatTitle: "Assistente IA", chatPlaceholder: "Fai la tua domanda...", chatSend: "Invia",
    chatWelcome: "Ciao! Sono l'assistente di Jean-Luc. Come posso aiutarti?",
    chatKeyLabel: "Chiave API Anthropic", chatKeyPlaceholder: "sk-ant-...", chatKeyConfirm: "Conferma",
    portfolioTitle: "Progetti realizzati", portfolioBtn: "Visita il sito →",
    mentionsTitle: "Note legali",
    mentionsContent: "Editore: Jean-Luc Descombes · Vienne (38200) · jeanlucdescombes76@gmail.com · +33 07 70 00 73 35. Hosting: Vercel Inc., 340 Pine Street, San Francisco, CA 94104, USA. Numero SIRET in corso di registrazione.",
    footerRights: `© ${new Date().getFullYear()} Orchestrateur IA — Tutti i diritti riservati`,
  },
  es: {
    navServices: "Servicios", navAbout: "Sobre mí", navFaq: "FAQ", navContact: "Contacto", navTemoignages: "Portfolio",
    whoAmI: "Quién soy",
    heroTitle: "Tu sitio web profesional,\nentregado en 72h.",
    heroSubtitle: "Creado con IA, a medida, sin jerga técnica.\nDesde 250€ · Pago seguro · Satisfacción garantizada",
    heroCta: "Solicitar presupuesto gratuito →", heroPhone: "Llamar", heroDiscover: "Descubrir", heroPrice: "Desde 250 €", heroPaypal: "Pago seguro con tarjeta",
    servicesTitle: "Mis servicios",
    services: [
      { icon: "🤖", title: "Orquestación IA", desc: "Combino Claude, Copilot, Grok y Mistral para crear soluciones adaptadas a tus necesidades." },
      { icon: "🌐", title: "Sitios web modernos", desc: "Diseño y despliegue de sitios React de alto rendimiento, responsivos y optimizados para SEO." },
      { icon: "⚡", title: "Automatización", desc: "Implementación de flujos de trabajo inteligentes para ahorrar tiempo y reducir tareas repetitivas." },
      { icon: "🎯", title: "Consultoría & formación", desc: "Acompañamiento personalizado para integrar la IA en tus proyectos profesionales." },
    ],
    aboutTitle: "¿Quién soy?",
    aboutText: "Diseño sitios web modernos orquestando de forma inteligente la IA para crear experiencias simples, rápidas y adaptadas a las necesidades reales de los usuarios. Con base en Vienne (38), acompaño a particulares y profesionales en su transformación digital.",
    faqTitle: "Preguntas frecuentes",
    faq: [
      { q: "¿Qué es la orquestación IA?", a: "Consiste en combinar de forma inteligente varias herramientas de inteligencia artificial (Claude, Copilot, Grok...) para producir un resultado superior al que una sola herramienta podría lograr." },
      { q: "¿Cuánto cuesta crear un sitio web?", a: "Los precios empiezan desde 250 €. Cada proyecto es único — contáctame para un presupuesto personalizado." },
      { q: "¿Cuál es tu área de intervención?", a: "Con base en Vienne (38), trabajo de forma remota para toda Francia y también en el extranjero." },
      { q: "¿Qué herramientas IA utilizas?", a: "Utilizo principalmente Claude (Anthropic), Copilot (Microsoft), Grok (xAI) y Mistral, según las necesidades de cada proyecto." },
    ],
    temoignagesTitle: "Confían en mí",
    discoverTitle: "¿Listo para empezar?", discoverSub: "Un sitio profesional creado con IA, entregado rápidamente.",
    contactTitle: "Contáctame", contactName: "Tu nombre", contactPhone: "Tu teléfono", contactEmail: "Tu email", contactMessage: "Tu mensaje", contactSend: "Enviar", contactSuccess: "✅ ¡Mensaje enviado con éxito!", contactError: "❌ Error — envío de email alternativo.",
    chatOpen: "💬", chatTitle: "Asistente IA", chatPlaceholder: "Haz tu pregunta...", chatSend: "Enviar",
    chatWelcome: "¡Hola! Soy el asistente de Jean-Luc. ¿En qué puedo ayudarte?",
    chatKeyLabel: "Clave API Anthropic", chatKeyPlaceholder: "sk-ant-...", chatKeyConfirm: "Confirmar",
    portfolioTitle: "Proyectos realizados", portfolioBtn: "Ver el sitio →",
    mentionsTitle: "Avisos legales",
    mentionsContent: "Editor: Jean-Luc Descombes · Vienne (38200) · jeanlucdescombes76@gmail.com · +33 07 70 00 73 35. Alojamiento: Vercel Inc., 340 Pine Street, San Francisco, CA 94104, USA. SIRET en proceso de registro.",
    footerRights: `© ${new Date().getFullYear()} Orchestrateur IA — Todos los derechos reservados`,
  },
  zh: {
    navServices: "服务", navAbout: "关于我", navFaq: "常见问题", navContact: "联系", navTemoignages: "项目",
    whoAmI: "关于我",
    heroTitle: "您的专业网站，\n72小时交付。",
    heroSubtitle: "AI驱动，量身定制，无技术术语。\n起价250€ · 安全支付 · 满意保证",
    heroCta: "申请免费报价 →", heroPhone: "致电", heroDiscover: "了解更多", heroPrice: "起价 250 €", heroPaypal: "安全刷卡支付",
    servicesTitle: "我的服务",
    services: [
      { icon: "🤖", title: "AI编排", desc: "我整合Claude、Copilot、Grok和Mistral，为您的需求创建定制解决方案。" },
      { icon: "🌐", title: "现代网站", desc: "设计和部署高性能、响应式、搜索引擎优化的React网站。" },
      { icon: "⚡", title: "自动化", desc: "建立智能工作流程，节省时间，减少重复性工作。" },
      { icon: "🎯", title: "咨询与培训", desc: "为您的专业项目提供个性化AI集成支持。" },
    ],
    aboutTitle: "我是谁？",
    aboutText: "我通过智能编排AI技术，为用户设计简洁、快速、贴合实际需求的现代网站。总部位于Vienne (38)，我帮助个人和专业人士实现数字化转型，充分发挥每种AI工具的潜力。",
    faqTitle: "常见问题",
    faq: [
      { q: "什么是AI编排？", a: "AI编排是指智能组合多种AI工具（Claude、Copilot、Grok...），产生超越单一工具所能实现的卓越成果。" },
      { q: "创建网站需要多少费用？", a: "价格从250€起。每个项目都是独特的——请联系我获取个性化报价。" },
      { q: "您的服务范围是哪里？", a: "总部位于Vienne (38)，我为全法国及海外客户提供远程服务。" },
      { q: "您使用哪些AI工具？", a: "我主要使用Claude (Anthropic)、Copilot (Microsoft)、Grok (xAI)和Mistral，根据每个项目的需求而定。" },
    ],
    temoignagesTitle: "他们信任我",
    discoverTitle: "准备好开始了吗？", discoverSub: "AI打造的专业网站，快速交付。",
    contactTitle: "联系我", contactName: "您的姓名", contactPhone: "您的电话", contactEmail: "您的邮箱", contactMessage: "您的留言", contactSend: "发送", contactSuccess: "✅ 消息发送成功！", contactError: "❌ 错误 — 备用邮件已发送。",
    chatOpen: "💬", chatTitle: "AI助手", chatPlaceholder: "请输入您的问题...", chatSend: "发送",
    chatWelcome: "您好！我是Jean-Luc的助手。有什么可以帮您的吗？",
    chatKeyLabel: "Anthropic API密钥", chatKeyPlaceholder: "sk-ant-...", chatKeyConfirm: "确认",
    portfolioTitle: "已完成项目", portfolioBtn: "访问网站 →",
    mentionsTitle: "法律声明",
    mentionsContent: "发布者：Jean-Luc Descombes · Vienne (38200) · jeanlucdescombes76@gmail.com · +33 07 70 00 73 35。托管：Vercel Inc., 340 Pine Street, San Francisco, CA 94104, USA。SIRET注册中。",
    footerRights: `© ${new Date().getFullYear()} Orchestrateur IA — 版权所有`,
  },
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

export default function App() {
  const [lang,         setLang]         = useState('fr'); // fr | en | it | ar | pt
  const [fontSize,     setFontSize]     = useState(16);
  const [burgerOpen,   setBurgerOpen]   = useState(false);
  const [showWhoAmI,   setShowWhoAmI]   = useState(false);
  const [showDiscover, setShowDiscover] = useState(false);
  const [openFaq,      setOpenFaq]      = useState(null);
  const [formData,     setFormData]     = useState({ name: '', phone: '', email: '', message: '' });
  const [sending,      setSending]      = useState(false);
  const [formMsg,      setFormMsg]      = useState('');
  const [chatOpen,     setChatOpen]     = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput,    setChatInput]    = useState('');
  const [chatLoading,  setChatLoading]  = useState(false);
  const [apiKey,       setApiKey]       = useState('proxy'); // clé gérée côté serveur
  const [apiKeyInput,  setApiKeyInput]  = useState('');
  const [apiKeySet,    setApiKeySet]    = useState(true); // toujours actif via proxy
  const chatEndRef = useRef(null);

  const t     = translations[lang];
  const isRTL = lang === 'ar';

  // ── Fix loupe : applique fontSize sur <html> ──────────────
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (chatOpen && chatMessages.length === 0) {
      setChatMessages([{ role: 'assistant', content: t.chatWelcome }]);
    }
  }, [chatOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setBurgerOpen(false);
  };

  const handleSend = async () => {
    if (!formData.name || !formData.message) return;
    setSending(true); setFormMsg('');
    try {
      window.location.href =
        `mailto:jeanlucdescombes76@gmail.com?subject=Contact Orchestrateur IA` +
        `&body=${encodeURIComponent(formData.message)}`;
      setFormMsg(t.contactSuccess);
    } catch { setFormMsg(t.contactError); }
    finally  { setSending(false); }
  };

  const handleChat = async () => {
    if (!chatInput.trim() || !apiKey) return;
    const userMsg = { role: 'user', content: chatInput };
    const history = [...chatMessages.filter((m, i) => i > 0 || m.role === 'user'), userMsg];
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput(''); setChatLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: CONFIG.systemPrompt, messages: history.map(m => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data?.content?.[0]?.text || '…' }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: '❌ Erreur de connexion.' }]);
    } finally { setChatLoading(false); }
  };

  const navItems = [
    { key: 'navServices', id: 'services' },
    { key: 'navAbout',    id: 'about' },
    { key: 'navTemoignages', id: 'portfolio' },
    { key: 'navFaq',      id: 'faq' },
    { key: 'navContact',  id: 'contact' },
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}
      style={{ fontFamily: "'Montserrat', sans-serif", color: COLORS.text, minHeight: '100vh', background: '#fff' }}>

      <style>{globalStyles}</style>

      {/* ── BARRE ACCESSIBILITÉ ─────────────────────────────── */}
      <div style={{ background: COLORS.dark, padding: '5px 20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => setFontSize(f => Math.min(f + 2, 26))}
          style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 4, padding: '2px 10px', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>A+</button>
        <button onClick={() => setFontSize(f => Math.max(f - 2, 12))}
          style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 4, padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>A−</button>
        {LANGS.map(({ code, flag, label }) => (
          <button key={code} onClick={() => setLang(code)}
            style={{ background: lang === code ? COLORS.secondary : 'transparent', color: lang === code ? COLORS.dark : '#fff', border: `1px solid ${lang === code ? COLORS.secondary : 'rgba(255,255,255,0.4)'}`, borderRadius: 4, padding: '2px 8px', fontSize: '0.78rem', fontWeight: lang === code ? 700 : 400, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
            <span>{flag}</span><span>{label}</span>
          </button>
        ))}
      </div>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header style={{ background: COLORS.primary, padding: '0 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 72, borderBottom: `2px solid ${COLORS.secondary}44`, position: 'sticky', top: 0, zIndex: 500 }}>

        {/* Nom métal animé */}
        <span style={{
          fontFamily: "'Raleway', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          background: 'linear-gradient(90deg, #8eafd4 0%, #ffffff 30%, #00d4ff 50%, #ffffff 70%, #8eafd4 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: 'shimmer 3s linear infinite, glowPulse 3s ease-in-out infinite',
          lineHeight: 1,
        }}>{CONFIG.siteName}</span>

        {/* Burger — positionné en absolu à droite */}
        <button onClick={() => setBurgerOpen(o => !o)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 24 }}>
          <span className="burger-line" style={{ transform: burgerOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span className="burger-line" style={{ opacity: burgerOpen ? 0 : 1 }} />
          <span className="burger-line" style={{ transform: burgerOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>

        {/* Menu déroulant burger */}
        {burgerOpen && (
          <div style={{ position: 'absolute', top: 92, right: 0, background: COLORS.primary, border: `1px solid ${COLORS.secondary}33`, borderRadius: '0 0 12px 12px', minWidth: 200, zIndex: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
            {navItems.map(item => (
              <button key={item.key} onClick={() => scrollTo(item.id)}
                style={{ display: 'block', width: '100%', background: 'transparent', color: '#fff', border: 'none', borderBottom: `1px solid ${COLORS.secondary}15`, padding: '14px 24px', textAlign: isRTL ? 'right' : 'left', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.02em', transition: 'background .15s' }}
                onMouseEnter={e => e.currentTarget.style.background = `${COLORS.secondary}18`}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                {t[item.key]}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.dark }}>

        {/* Fond PNG — visible */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('/images/Fond_ecran.png')`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0, opacity: 0.6 }} />

        {/* Overlay léger pour lisibilité */}
        <div style={{ position: 'absolute', inset: 0, background: `rgba(5,12,26,0.55)`, zIndex: 1 }} />

        {/* Étoiles flottantes */}
        {STARS.map(s => (
          <div key={s.id} className="star" style={{ left: s.left, bottom: '-4px', width: s.size, height: s.size, animationDuration: s.duration, animationDelay: s.delay, opacity: s.opacity, zIndex: 2 }} />
        ))}

        {/* Vidéo gauche */}
        <div style={{ position: 'absolute', left: '5%', top: '50%', transform: 'translateY(-50%)', width: '20%', zIndex: 3 }}>
          <video autoPlay loop muted playsInline
            style={{ width: '100%', borderRadius: 14, boxShadow: `0 8px 40px ${COLORS.secondary}44`, border: `1px solid ${COLORS.secondary}33` }}
            src="/videos/logo_gauche.mp4" />
        </div>

        {/* Vidéo droite */}
        <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', width: '20%', zIndex: 3 }}>
          <video autoPlay loop muted playsInline
            style={{ width: '100%', borderRadius: 14, boxShadow: `0 8px 40px ${COLORS.secondary}44`, border: `1px solid ${COLORS.secondary}33` }}
            src="/videos/logo_droite.mp4" />
        </div>

        {/* Contenu central */}
        <div style={{ position: 'relative', zIndex: 4, textAlign: 'center', color: '#fff', padding: '50px 24px', maxWidth: 680, width: '52%', animation: 'fadeInUp .8s ease both' }}>

          {/* 3 logos grands et centrés au-dessus du titre */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginBottom: 44, flexWrap: 'wrap' }}>
            {['/videos/logo_01.mp4', '/videos/logo_03.mp4', '/videos/logo_02.mp4'].map((src, i) => (
              <video key={i} autoPlay loop muted playsInline
                style={{ height: 150, width: 'auto', objectFit: 'contain', borderRadius: 14, boxShadow: `0 6px 32px ${COLORS.secondary}44`, animation: `floatLogo ${3 + i * 0.6}s ease-in-out infinite`, animationDelay: `${i * 0.4}s` }}
                src={src} />
            ))}
          </div>

          <h1 style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: 'clamp(1.9rem, 3.5vw, 3.2rem)',
            fontWeight: 900,
            marginBottom: 22,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textShadow: '0 2px 40px rgba(255,255,255,0.25), 0 0 80px rgba(0,212,255,0.2)',
            whiteSpace: 'pre-line',
          }}>{t.heroTitle}</h1>

          <p style={{
            fontSize: 'clamp(0.95rem, 1.5vw, 1.12rem)',
            marginBottom: 44,
            lineHeight: 1.85,
            color: 'rgba(255,255,255,0.82)',
            letterSpacing: '0.015em',
            fontWeight: 400,
          }}>{t.heroSubtitle}</p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <button onClick={() => scrollTo('contact')}
              onMouseEnter={e => { e.currentTarget.style.transform='scale(1.07)'; e.currentTarget.style.boxShadow=`0 0 36px ${COLORS.secondary}bb`; }}
              onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none'; }}
              style={S.btn(COLORS.secondary, COLORS.dark, { animation: 'pulse 2.5s ease infinite', fontWeight: 900, letterSpacing: '0.03em', borderRadius: 50, padding: '16px 36px', fontSize: '1.05rem', transition: 'all .2s' })}>
              ✉️ {t.heroCta}
            </button>
            <a href={`tel:${CONFIG.telephone}`}
              onMouseEnter={e => { e.currentTarget.style.transform='scale(1.05)'; e.currentTarget.style.background='rgba(255,255,255,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.background='transparent'; }}
              style={S.btn('transparent', '#fff', { border: '2px solid rgba(255,255,255,0.45)', borderRadius: 50, padding: '16px 28px', transition: 'all .2s' })}>
              📞 {t.heroPhone}
            </a>
            <button onClick={() => setShowWhoAmI(true)}
              onMouseEnter={e => { e.currentTarget.style.transform='scale(1.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; }}
              style={S.btn('transparent', COLORS.secondary, { border: `2px solid ${COLORS.secondary}66`, borderRadius: 50, padding: '16px 28px', transition: 'all .2s' })}>
              👤 {t.whoAmI}
            </button>
          </div>

          {/* Bouton Découvrir — simple */}
          <button onClick={() => setShowDiscover(true)}
            onMouseEnter={e => { e.currentTarget.style.transform='scale(1.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; }}
            style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.15), rgba(0,212,255,0.3), rgba(0,212,255,0.15))', backgroundSize: '200% auto', color: COLORS.secondary, border: `1.5px solid ${COLORS.secondary}77`, borderRadius: 50, padding: '13px 36px', cursor: 'pointer', fontSize: '1rem', fontWeight: 800, letterSpacing: '0.06em', backdropFilter: 'blur(6px)', transition: 'all .2s', fontFamily: 'inherit', animation: 'shimmerCta 3s linear infinite' }}>
            ✨ {t.heroDiscover}
          </button>
        </div>

        {/* Ligne cyan en bas */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.secondary}, transparent)`, zIndex: 5 }} />
      </section>

      {/* ── SERVICES ────────────────────────────────────────── */}
      <section id="services" style={{ padding: '72px 32px', background: COLORS.light }}>
        <h2 style={{ textAlign: 'center', color: COLORS.primary, fontFamily: "'Raleway', sans-serif", marginBottom: 44, fontSize: '1.8rem', fontWeight: 800 }}>{t.servicesTitle}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24, maxWidth: 1000, margin: '0 auto' }}>
          {t.services.map((s, i) => (
            <div key={i} className="card-service" style={{ ...S.card, textAlign: 'center', borderTop: `3px solid ${COLORS.secondary}` }}>
              <div style={{ fontSize: '2.6rem', marginBottom: 14 }}>{s.icon}</div>
              <h3 style={{ color: COLORS.primary, margin: '0 0 10px', fontSize: '1.05rem', fontWeight: 700 }}>{s.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#555', margin: 0, lineHeight: 1.75 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PORTFOLIO ───────────────────────────────────────── */}
      <section id="portfolio" style={{ padding: '72px 32px', background: '#fff' }}>
        <h2 style={{ textAlign: 'center', color: COLORS.primary, fontFamily: "'Raleway', sans-serif", marginBottom: 12, fontSize: '1.8rem', fontWeight: 800 }}>{t.portfolioTitle || 'Projets réalisés'}</h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: 44, fontSize: '0.97rem' }}>Des sites livrés, en ligne, accessibles maintenant.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28, maxWidth: 980, margin: '0 auto' }}>
          {PORTFOLIO.map((p, i) => (
            <div key={i} className="card-service" style={{ ...S.card, borderTop: `3px solid ${COLORS.secondary}`, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ fontSize: '2.4rem' }}>{p.icon}</div>
              <h3 style={{ color: COLORS.primary, margin: 0, fontSize: '1.05rem', fontWeight: 800 }}>{p.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#555', margin: 0, lineHeight: 1.75, flex: 1 }}>{p.desc}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {p.tags.map((tag, j) => (
                  <span key={j} style={{ background: `${COLORS.secondary}18`, color: COLORS.primary, borderRadius: 20, padding: '3px 12px', fontSize: '0.75rem', fontWeight: 700, border: `1px solid ${COLORS.secondary}44` }}>{tag}</span>
                ))}
              </div>
              <a href={p.url} target="_blank" rel="noreferrer"
                style={{ ...S.btn(COLORS.primary, '#fff', { textAlign: 'center', borderRadius: 50, padding: '10px 20px', fontSize: '0.88rem' }) }}>
                {t.portfolioBtn || 'Voir le site →'}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION DÉCOUVRIR ───────────────────────────────── */}
      <section style={{ padding: '72px 32px', background: COLORS.primary, textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Raleway', sans-serif", color: '#fff', fontSize: '1.8rem', fontWeight: 800, marginBottom: 12 }}>{t.discoverTitle}</h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 36, fontSize: '1.05rem' }}>{t.discoverSub}</p>
        <button onClick={() => setShowDiscover(true)}
          onMouseEnter={e => { e.currentTarget.style.transform='scale(1.06)'; e.currentTarget.style.boxShadow=`0 0 40px ${COLORS.secondary}99`; }}
          onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='none'; }}
          style={{ background: `linear-gradient(90deg, ${COLORS.secondary}, #7fffff, ${COLORS.secondary})`, backgroundSize: '200% auto', color: COLORS.dark, border: 'none', borderRadius: 50, padding: '18px 56px', cursor: 'pointer', fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.06em', fontFamily: 'inherit', transition: 'all .2s', animation: 'shimmerCta 2.5s linear infinite' }}>
          🚀 {t.heroDiscover}
        </button>
      </section>

      {/* ── À PROPOS ────────────────────────────────────────── */}
      <section id="about" style={{ padding: '72px 32px', maxWidth: 860, margin: '0 auto' }}>
        <h2 style={{ color: COLORS.primary, fontFamily: "'Raleway', sans-serif", marginBottom: 24, fontSize: '1.8rem', fontWeight: 800 }}>{t.aboutTitle}</h2>
        <p style={{ lineHeight: 1.95, fontSize: '1.02rem', color: '#333' }}>{t.aboutText}</p>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section id="faq" style={{ padding: '72px 32px', background: COLORS.light }}>
        <h2 style={{ textAlign: 'center', color: COLORS.primary, fontFamily: "'Raleway', sans-serif", marginBottom: 36, fontSize: '1.8rem', fontWeight: 800 }}>{t.faqTitle}</h2>
        <div style={{ maxWidth: 740, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {t.faq.map((item, i) => (
            <div key={i} style={{ ...S.card, cursor: 'pointer', padding: '18px 22px', borderLeft: `4px solid ${COLORS.secondary}` }}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, color: COLORS.primary, fontSize: '0.97rem' }}>
                <span>{item.q}</span>
                <span style={{ fontSize: '1.4rem', transition: 'transform .25s', transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)', color: COLORS.secondary, marginLeft: 12, flexShrink: 0 }}>+</span>
              </div>
              {openFaq === i && <p style={{ marginTop: 14, lineHeight: 1.8, color: '#444', fontSize: '0.93rem' }}>{item.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ─────────────────────────────────────────── */}
      <section id="contact" style={{ padding: '72px 32px' }}>
        <h2 style={{ textAlign: 'center', color: COLORS.primary, fontFamily: "'Raleway', sans-serif", marginBottom: 36, fontSize: '1.8rem', fontWeight: 800 }}>{t.contactTitle}</h2>
        <div style={{ maxWidth: 520, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[{ key: 'name', type: 'text', label: t.contactName }, { key: 'phone', type: 'tel', label: t.contactPhone }, { key: 'email', type: 'email', label: t.contactEmail }].map(f => (
            <input key={f.key} type={f.type} placeholder={f.label} value={formData[f.key]}
              onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
              style={{ padding: 14, borderRadius: 10, border: `1.5px solid ${COLORS.primary}22`, fontSize: '1rem', outline: 'none', fontFamily: 'inherit', transition: 'all .2s' }} />
          ))}
          <textarea placeholder={t.contactMessage} rows={5} value={formData.message}
            onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
            style={{ padding: 14, borderRadius: 10, border: `1.5px solid ${COLORS.primary}22`, fontSize: '1rem', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
          <button onClick={handleSend} disabled={sending}
            style={S.btn(COLORS.primary, '#fff', { padding: 15, fontSize: '1rem', opacity: sending ? 0.7 : 1, borderRadius: 10 })}>
            {sending ? '…' : t.contactSend}
          </button>
          {formMsg && <p style={{ textAlign: 'center', fontWeight: 700, color: formMsg.includes('✅') ? '#27ae60' : '#c0392b' }}>{formMsg}</p>}
        </div>
      </section>

      {/* ── BANDEAU IA ──────────────────────────────────────── */}
      <div style={{ background: COLORS.dark, borderTop: `2px solid ${COLORS.secondary}22`, padding: '22px 32px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: '0.8rem', color: '#666', marginRight: 6 }}>Site conçu avec l'assistance de :</span>
        {AI_BADGES.map((b, i) => (
          <div key={i} title={b.role}
            style={{ background: b.color, color: b.color === COLORS.aiCyan ? COLORS.dark : '#fff', borderRadius: 20, padding: '6px 16px', fontSize: '0.78rem', fontWeight: 700, cursor: 'default', boxShadow: `0 0 10px ${b.color}33` }}>
            {b.label}
          </div>
        ))}
      </div>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{ background: COLORS.primary, color: '#999', padding: '40px 32px', textAlign: 'center' }}>
        <p style={{ margin: '4px 0', fontWeight: 800, color: '#fff', fontSize: '1.15rem', fontFamily: "'Raleway', sans-serif" }}>{CONFIG.siteName}</p>
        <p style={{ margin: '8px 0', fontSize: '0.85rem' }}>{CONFIG.adresse}</p>
        <p style={{ margin: '4px 0', fontSize: '0.85rem' }}>
          <a href={`mailto:${CONFIG.email}`} style={{ color: COLORS.secondary, textDecoration: 'none' }}>{CONFIG.email}</a>
          {' · '}
          <a href={`tel:${CONFIG.telephone}`} style={{ color: COLORS.secondary, textDecoration: 'none' }}>{CONFIG.telephone}</a>
        </p>
        <p style={{ margin: '20px 0 4px', fontSize: '0.75rem', color: '#444' }}>{t.footerRights}</p>
        <details style={{ marginTop: 14, cursor: 'pointer' }}>
          <summary style={{ fontSize: '0.72rem', color: '#555', letterSpacing: '0.05em', userSelect: 'none' }}>Mentions légales</summary>
          <p style={{ fontSize: '0.72rem', color: '#555', lineHeight: 1.8, marginTop: 10, maxWidth: 600, margin: '10px auto 0', textAlign: 'left' }}>
            {t.mentionsContent || 'Éditeur : Jean-Luc Descombes · Vienne (38200) · jeanlucdescombes76@gmail.com · Hébergeur : Vercel Inc.'}
          </p>
        </details>
      </footer>

      {/* ── MODALE QUI JE SUIS ──────────────────────────────── */}
      {showWhoAmI && (
        <div style={S.modal} onClick={() => setShowWhoAmI(false)}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', borderRadius: 16, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
            <img src="/images/03_Jean-Luc.png" alt="Jean-Luc Descombes"
              style={{ display: 'block', maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: 16 }} />
            <button onClick={() => setShowWhoAmI(false)}
              style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.65)', color: '#fff', border: 'none', borderRadius: '50%', width: 38, height: 38, fontSize: '1.1rem', cursor: 'pointer', fontWeight: 700 }}>✕</button>
          </div>
        </div>
      )}

      {/* ── MODALE DÉCOUVRIR ────────────────────────────────── */}
      {showDiscover && (
        <div style={S.modal} onClick={() => setShowDiscover(false)}>
          <div style={{ background: '#fff', borderRadius: 22, padding: '44px 40px', maxWidth: 480, width: '100%', textAlign: 'center', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowDiscover(false)}
              style={{ position: 'absolute', top: 16, right: 18, background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: '#aaa' }}>✕</button>
            <div style={{ fontSize: '2.8rem', marginBottom: 14 }}>🚀</div>
            <h2 style={{ fontFamily: "'Raleway', sans-serif", color: COLORS.primary, fontSize: '1.55rem', fontWeight: 800, marginBottom: 10 }}>{t.discoverTitle}</h2>
            <p style={{ color: '#666', marginBottom: 28, lineHeight: 1.75, fontSize: '0.97rem' }}>{t.discoverSub}</p>
            <div style={{ background: COLORS.light, borderRadius: 14, padding: '22px 28px', marginBottom: 28 }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: COLORS.primary, fontFamily: "'Raleway', sans-serif" }}>{t.heroPrice}</div>
              <div style={{ fontSize: '0.85rem', color: '#888', marginTop: 8, lineHeight: 1.6 }}>Site React complet · Déploiement inclus<br />Assets personnalisés · Livraison rapide</div>
            </div>
            <a href="https://buy.stripe.com/9B6eV6g9J98R2zpaAygfu01" target="_blank" rel="noreferrer"
              style={{ ...S.btn(COLORS.secondary, COLORS.dark, { display: 'block', padding: '18px 28px', fontSize: '1.02rem', borderRadius: 14, fontWeight: 800 }) }}>
              💳 {t.heroPaypal}
            </a>
            <p style={{ fontSize: '0.8rem', color: '#bbb', marginTop: 18 }}>
              Ou contactez-moi :{' '}
              <a href={`mailto:${CONFIG.email}`} style={{ color: COLORS.primary, fontWeight: 600 }}>{CONFIG.email}</a>
            </p>
          </div>
        </div>
      )}

      {/* ── CHATBOT + WHATSAPP ──────────────────────────────── */}
      {/* Bouton LinkedIn */}
      <a href="https://www.linkedin.com/in/expanceloop" target="_blank" rel="noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 164, width: 58, height: 58, borderRadius: '50%', background: '#0077B5', color: '#fff', border: 'none', fontSize: '1.4rem', cursor: 'pointer', boxShadow: '0 4px 24px rgba(0,119,181,0.5)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontWeight: 900, fontFamily: 'Arial, sans-serif', letterSpacing: '-0.5px' }}>
        in
      </a>
      {/* Bouton WhatsApp */}
      <a href="https://wa.me/33770007335" target="_blank" rel="noreferrer"
        style={{ position: 'fixed', bottom: 24, right: 94, width: 58, height: 58, borderRadius: '50%', background: '#25D366', color: '#fff', border: 'none', fontSize: '1.6rem', cursor: 'pointer', boxShadow: '0 4px 24px rgba(37,211,102,0.5)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
        💬
      </a>
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 900 }}>
        {!chatOpen && (
          <span style={{ position: 'absolute', top: -4, right: -4, background: '#ff3232', color: '#fff', borderRadius: '50%', width: 20, height: 20, fontSize: '0.6rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'badgePulse 1.8s ease infinite', zIndex: 901, border: '2px solid #fff' }}>IA</span>
        )}
        <button onClick={() => setChatOpen(o => !o)}
          style={{ width: 58, height: 58, borderRadius: '50%', background: COLORS.secondary, color: COLORS.dark, border: 'none', fontSize: '1.6rem', cursor: 'pointer', boxShadow: `0 4px 24px ${COLORS.secondary}66`, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {chatOpen ? '✕' : t.chatOpen}
        </button>
      </div>

      {chatOpen && (
        <div style={{ position: 'fixed', bottom: 94, right: 24, width: 350, maxHeight: 490, background: '#fff', borderRadius: 18, boxShadow: '0 8px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', zIndex: 901, overflow: 'hidden', border: `1px solid ${COLORS.secondary}22` }}>
          <div style={{ background: COLORS.primary, color: COLORS.secondary, padding: '14px 18px', fontWeight: 800, fontSize: '0.95rem', fontFamily: "'Raleway', sans-serif" }}>{t.chatTitle}</div>
          {!apiKeySet ? (
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: COLORS.text }}>{t.chatKeyLabel}</label>
              <input type="password" placeholder={t.chatKeyPlaceholder} value={apiKeyInput}
                onChange={e => setApiKeyInput(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: `1.5px solid ${COLORS.primary}22`, fontSize: '0.9rem', fontFamily: 'inherit' }} />
              <button onClick={() => { setApiKey(apiKeyInput); setApiKeySet(true); }}
                style={S.btn(COLORS.primary, '#fff', { padding: '10px', borderRadius: 8 })}>{t.chatKeyConfirm}</button>
            </div>
          ) : (
            <>
              <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {chatMessages.map((m, i) => (
                  <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', background: m.role === 'user' ? COLORS.primary : COLORS.light, color: m.role === 'user' ? '#fff' : COLORS.text, borderRadius: 10, padding: '9px 13px', maxWidth: '84%', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {m.content}
                  </div>
                ))}
                {chatLoading && <div style={{ alignSelf: 'flex-start', background: COLORS.light, borderRadius: 10, padding: '9px 14px', fontSize: '0.85rem', color: '#888' }}>…</div>}
                <div ref={chatEndRef} />
              </div>
              <div style={{ borderTop: `1px solid ${COLORS.secondary}22`, padding: 10, display: 'flex', gap: 8 }}>
                <input placeholder={t.chatPlaceholder} value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChat()}
                  style={{ flex: 1, padding: 9, borderRadius: 8, border: `1.5px solid ${COLORS.primary}22`, fontSize: '0.88rem', outline: 'none', fontFamily: 'inherit' }} />
                <button onClick={handleChat} disabled={chatLoading}
                  style={S.btn(COLORS.secondary, COLORS.dark, { padding: '9px 14px', fontSize: '0.85rem', borderRadius: 8 })}>
                  {t.chatSend}
                </button>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}
