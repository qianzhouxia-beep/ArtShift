import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sparkles, Zap, Globe, ShieldCheck, Star, ArrowRight,
  CreditCard, Menu, X,
  Layers, Wand2,
  ArrowUp,
} from 'lucide-react';
import TOONHUBHero from './TOONHUBHero';

// ─── Style Gallery Data ───────────────────────────────────────────────────────
const styleGallery = [
  { src: '/images/styles/style-oil-painting.png', titleKey: 'styleGallery.oil_painting', descKey: 'styleGallery.oil_painting_desc' },
  { src: '/images/styles/style-pixel-art.png', titleKey: 'styleGallery.pixel_art', descKey: 'styleGallery.pixel_art_desc' },
  { src: '/images/styles/style-anime.png', titleKey: 'styleGallery.anime', descKey: 'styleGallery.anime_desc' },
  { src: '/images/styles/style-cyberpunk.png', titleKey: 'styleGallery.cyberpunk', descKey: 'styleGallery.cyberpunk_desc' },
  { src: '/images/styles/style-pencil-sketch.png', titleKey: 'styleGallery.pencil_sketch', descKey: 'styleGallery.pencil_sketch_desc' },
  { src: '/images/styles/style-watercolor.png', titleKey: 'styleGallery.watercolor', descKey: 'styleGallery.watercolor_desc' },
];

// ─── Logo Image ──────────────────────────────────────────────────────────────
function ArtShiftLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img src="/logo.png" alt="ArtShift Logo" className={className} style={{ objectFit: 'contain' }} />
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  
  const links = [
    { key: 'navbar.howItWorks', id: 'how-it-works' },
    { key: 'navbar.products', id: 'products' },
    { key: 'navbar.pricing', id: 'pricing' },
    { key: 'navbar.faq', id: 'faq' },
  ];
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleScroll = () => {
      // After scrolling past the hero (100vh), switch to solid navbar
      setScrolled(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ${
      scrolled 
        ? 'bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shadow-sm transition-colors duration-500 ${
          scrolled ? 'bg-white' : 'bg-white/20 backdrop-blur-sm'
        }`}>
          <ArtShiftLogo className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className={`flex items-center gap-4 sm:gap-8 rounded-2xl px-5 sm:px-8 py-2.5 sm:py-3 shadow-sm transition-colors duration-500 ${
          scrolled ? 'bg-white' : 'bg-white/15 backdrop-blur-md'
        }`}>
          {links.map(l => (
            <a key={l.key} href={`#${l.id}`}
              className={`text-[12px] sm:text-[13px] font-medium transition-colors duration-500 hidden sm:block ${
                scrolled ? 'text-gray-500 hover:text-gray-900' : 'text-white/80 hover:text-white'
              }`}>
              {t(l.key)}
            </a>
          ))}
          <a href="#waitlist"
            className={`text-[12px] sm:text-[13px] font-semibold text-white rounded-full px-5 py-1.5 transition-all duration-200 ${
              scrolled ? '' : 'bg-white/20 backdrop-blur-sm hover:bg-white/30'
            }`}
            style={scrolled ? { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' } : {}}>
            {t('navbar.joinWaitlist')}
          </a>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => changeLanguage('en')}
              className={`text-[11px] font-semibold px-2 py-1 rounded-md transition-all duration-500 ${
                scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              }`}
              style={{ color: i18n.language === 'en' ? (scrolled ? '#3b82f6' : '#93c5fd') : (scrolled ? '#9ca3af' : 'rgba(255,255,255,0.6)') }}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('zh')}
              className={`text-[11px] font-semibold px-2 py-1 rounded-md transition-all duration-500 ${
                scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
              }`}
              style={{ color: i18n.language === 'zh' ? (scrolled ? '#3b82f6' : '#93c5fd') : (scrolled ? '#9ca3af' : 'rgba(255,255,255,0.6)') }}
            >
              中文
            </button>
          </div>
          <button className={`sm:hidden transition-colors duration-500 ${
            scrolled ? 'text-gray-500' : 'text-white'
          }`} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 flex flex-col items-center gap-3 p-4 rounded-2xl shadow-lg bg-white">
          {links.map(l => (
            <a key={l.key} href={`#${l.id}`}
              className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setMenuOpen(false)}>
              {t(l.key)}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── How It Works ──────────────────────────────────────────────────────────
function HowItWorks() {
  const { t } = useTranslation();
  const steps = [
    {
      num: '01',
      titleKey: 'howItWorks.step_1_title',
      descKey: 'howItWorks.step_1_desc',
      image: '/images/step1-describe-vision.png',
      color: '#3b82f6',
    },
    {
      num: '02',
      titleKey: 'howItWorks.step_2_title',
      descKey: 'howItWorks.step_2_desc',
      image: '/images/step2-ai-generates.png',
      color: '#8b5cf6',
    },
    {
      num: '03',
      titleKey: 'howItWorks.step_3_title',
      descKey: 'howItWorks.step_3_desc',
      image: '/images/step3-print-ship.png',
      color: '#f97316',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-12 px-6 sm:px-12 md:px-20 lg:px-28 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600">
            {t('howItWorks.badge')}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
            {t('howItWorks.title_1')}{' '}
            <span className="gradient-text">{t('howItWorks.title_2')}</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, i) => (
            <div key={i}
              className="rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white border border-gray-100">
              <div className="rounded-2xl overflow-hidden mb-6 bg-gray-50">
                <img src={step.image} alt={t(step.titleKey)} className="w-full h-auto object-cover" loading="lazy" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: step.color }}>
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t(step.titleKey)}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t(step.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Style Gallery ─────────────────────────────────────────────────────────
function StyleGallery() {
  const { t } = useTranslation();
  
  return (
    <section className="py-12 px-6 sm:px-12 md:px-20 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
          <span className="gradient-text">{t('styleGallery.title_1')}</span>{' '}
          {t('styleGallery.title_2')}
        </h2>
        <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto">
          {t('styleGallery.subtitle')}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {styleGallery.map((style) => (
            <div
              key={style.titleKey}
              className="group cursor-pointer"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300 mb-3">
                <img
                  src={style.src}
                  alt={t(style.titleKey)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{t(style.titleKey)}</h3>
              <p className="text-gray-400 text-xs">{t(style.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Demo ────────────────────────────────────────────────────────────────
const AI_STYLES = [
  { id: 'oil-painting', nameKey: 'styleGallery.oil_painting', descKey: 'styleGallery.oil_painting_desc' },
  { id: 'pixel-art', nameKey: 'styleGallery.pixel_art', descKey: 'styleGallery.pixel_art_desc' },
  { id: 'anime', nameKey: 'styleGallery.anime', descKey: 'styleGallery.anime_desc' },
  { id: 'cyberpunk', nameKey: 'styleGallery.cyberpunk', descKey: 'styleGallery.cyberpunk_desc' },
  { id: 'pencil-sketch', nameKey: 'styleGallery.pencil_sketch', descKey: 'styleGallery.pencil_sketch_desc' },
  { id: 'watercolor', nameKey: 'styleGallery.watercolor', descKey: 'styleGallery.watercolor_desc' },
];

const API_URL = import.meta.env.VITE_API_URL || 'https://artshift-backend.zeabur.app/api';

function AIDemo() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('oil-painting');
  const [generating, setGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(t('aiDemo.error_no_prompt'));
      return;
    }
    setError('');
    setResultUrl(null);
    setGenerating(true);
    try {
      const res = await fetch(`${API_URL}/generation/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style: selectedStyle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Generation failed');
      if (data.success && data.imageUrl) {
        setResultUrl(data.imageUrl);
      } else {
        throw new Error('No image returned');
      }
    } catch (err: any) {
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };
  
  return (
    <section className="py-12 sm:py-12 px-6 sm:px-12 md:px-20 lg:px-28 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-violet-50 text-violet-600">
            {t('aiDemo.badge')}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
            <span className="gradient-text">{t('aiDemo.title')}</span>
            <br />{t('aiDemo.title_suffix')}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
            {t('aiDemo.subtitle')}
          </p>
        </div>

        <div className="rounded-3xl p-8 sm:p-12 lg:p-16 bg-white border border-gray-100 shadow-sm">
          {/* Input Area */}
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Prompt Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">{t('aiDemo.prompt_label')}</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('aiDemo.prompt_placeholder')}
                rows={3}
                className="w-full rounded-2xl px-5 py-4 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 resize-none"
              />
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">{t('aiDemo.style_label')}</label>
              <div className="grid grid-cols-3 gap-3">
                {AI_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 border-2 ${
                      selectedStyle === style.id
                        ? 'border-transparent text-white shadow-lg'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50'
                    }`}
                    style={selectedStyle === style.id ? { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' } : {}}
                  >
                    <div>{t(style.nameKey)}</div>
                    <div className={`text-[10px] mt-0.5 ${selectedStyle === style.id ? 'text-white/70' : 'text-gray-400'}`}>{t(style.descKey)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl p-4 bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full rounded-2xl px-8 py-4 text-sm font-bold text-white transition-all duration-200 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              {generating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t('aiDemo.generating_text')}
                </>
              ) : (
                <>
                  <Wand2 size={18} />
                  {t('aiDemo.generate_button')}
                </>
              )}
            </button>
          </div>

          {/* Result Display Area */}
          {(generating || resultUrl) && (
            <div className="mt-12 pt-10 border-t border-gray-100">
              <div className="max-w-2xl mx-auto">
                {generating ? (
                  <div className="rounded-3xl aspect-square flex items-center justify-center relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
                    <div className="absolute inset-0" style={{
                      background: 'radial-gradient(circle at 30% 40%, rgba(139,92,246,0.4), transparent 60%), radial-gradient(circle at 70% 60%, rgba(59,130,246,0.4), transparent 60%)'
                    }} />
                    <div className="text-center relative z-10">
                      <svg className="animate-spin h-16 w-16 mx-auto mb-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <div className="text-lg font-bold text-white">{t('aiDemo.generating_title')}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mt-2">{t('aiDemo.generating_hint')}</div>
                    </div>
                  </div>
                ) : resultUrl ? (
                  <div className="text-center space-y-6">
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                      <img src={resultUrl} alt="Generated AI Art" className="w-full h-auto" />
                    </div>
                    <div className="flex gap-4 justify-center">
                      <a
                        href={resultUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                      >
                        {t('aiDemo.view_full_size')}
                      </a>
                      <button
                        onClick={() => {
                          setResultUrl(null);
                          setPrompt('');
                        }}
                        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200 transition-all duration-200 hover:bg-gray-50"
                      >
                        {t('aiDemo.generate_another')}
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Product Preview Area - removed emoji placeholders for cleaner look */}
          {!generating && !resultUrl && null}
        </div>
      </div>
    </section>
  );
}

// ─── Products ─────────────────────────────────────────────────────────────
function Products() {
  const { t } = useTranslation();
  const products = [
    { emoji: '👕', nameKey: 'products.t_shirt_name', descKey: 'products.t_shirt_desc', priceKey: 'products.t_shirt_price', badgeKey: 'products.t_shirt_badge', badgeColor: '#3b82f6', badgeBg: '#eff6ff', colors: ['bg-white', 'bg-gray-900', 'bg-blue-600'] },
    { emoji: '🧥', nameKey: 'products.hoodie_name', descKey: 'products.hoodie_desc', priceKey: 'products.hoodie_price', badgeKey: 'products.hoodie_badge', badgeColor: '#8b5cf6', badgeBg: '#f5f3ff', colors: ['bg-gray-700', 'bg-gray-900', 'bg-emerald-800'] },
    { emoji: '☕', nameKey: 'products.mug_name', descKey: 'products.mug_desc', priceKey: 'products.mug_price', badge: null, colors: ['bg-white', 'bg-gray-900'] },
    { emoji: '📱', nameKey: 'products.phone_case_name', descKey: 'products.phone_case_desc', priceKey: 'products.phone_case_price', badge: null, colors: ['bg-gray-200', 'bg-gray-400'] },
    { emoji: '🧢', nameKey: 'products.cap_name', descKey: 'products.cap_desc', priceKey: 'products.cap_price', badgeKey: 'products.cap_badge', badgeColor: '#f97316', badgeBg: '#fff7ed', colors: ['bg-gray-900', 'bg-gray-700'] },
  ];

  return (
    <section id="products" className="py-12 sm:py-12 px-6 sm:px-12 md:px-20 lg:px-28 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600">
            {t('products.badge')}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
            {t('products.title_1')}{' '}
            <span className="gradient-text">{t('products.title_2')}</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
            {t('products.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map((p, i) => (
            <div key={i}
              className="rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer bg-white border border-gray-100">
              {p.badgeKey && (
                <div className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 text-center"
                  style={{ backgroundColor: p.badgeBg, color: p.badgeColor }}>
                  {t(p.badgeKey)}
                </div>
              )}
              <div className="aspect-square flex items-center justify-center bg-slate-50">
                <span className="text-6xl sm:text-7xl">{p.emoji}</span>
              </div>
              <div className="p-4 sm:p-5">
                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{t(p.nameKey)}</h4>
                <p className="text-[10px] sm:text-[11px] text-gray-500 mb-3">{t(p.descKey)}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-600">{t(p.priceKey)}</span>
                  <div className="flex gap-1">
                    {p.colors.map((c, j) => (
                      <div key={j} className={`w-3 h-3 rounded-full ${c} border border-gray-200`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why ArtShift ─────────────────────────────────────────────────────────────
function WhyArtShift() {
  const { t } = useTranslation();
  const features = [
    { icon: <Sparkles size={20} />, titleKey: 'whyArtShift.feature_1_title', descKey: 'whyArtShift.feature_1_desc', color: '#3b82f6', bg: '#eff6ff' },
    { icon: <Layers size={20} />, titleKey: 'whyArtShift.feature_2_title', descKey: 'whyArtShift.feature_2_desc', color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: <Zap size={20} />, titleKey: 'whyArtShift.feature_3_title', descKey: 'whyArtShift.feature_3_desc', color: '#f97316', bg: '#fff7ed' },
    { icon: <Globe size={20} />, titleKey: 'whyArtShift.feature_4_title', descKey: 'whyArtShift.feature_4_desc', color: '#10b981', bg: '#ecfdf5' },
    { icon: <ShieldCheck size={20} />, titleKey: 'whyArtShift.feature_5_title', descKey: 'whyArtShift.feature_5_desc', color: '#3b82f6', bg: '#eff6ff' },
    { icon: <CreditCard size={20} />, titleKey: 'whyArtShift.feature_6_title', descKey: 'whyArtShift.feature_6_desc', color: '#8b5cf6', bg: '#f5f3ff' },
  ];

  return (
    <section className="py-12 sm:py-12 px-6 sm:px-12 md:px-20 lg:px-28 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600">
              {t('whyArtShift.badge')}
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              {t('whyArtShift.title_1')}{' '}
              <span className="gradient-text">{t('whyArtShift.title_2')}</span>
              <br />{t('whyArtShift.title_3')}
            </h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-10">
              {t('whyArtShift.subtitle')}
            </p>
            <a href="#waitlist"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-white rounded-full px-8 py-4 transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              {t('hero.cta_primary')} <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i}
                className="rounded-2xl p-5 transition-all duration-300 hover:shadow-md bg-white border border-gray-100">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-white"
                  style={{ color: f.color }}>
                  {f.icon}
                </div>
                <div className="font-bold text-gray-900 text-sm mb-1">{t(f.titleKey)}</div>
                <div className="text-xs text-gray-600 leading-relaxed">{t(f.descKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────
function Testimonials() {
  const { t } = useTranslation();
  const reviews = [
    { nameKey: 'testimonials.review_1_name', countryKey: 'testimonials.review_1_country', textKey: 'testimonials.review_1_text', rating: 5 },
    { nameKey: 'testimonials.review_2_name', countryKey: 'testimonials.review_2_country', textKey: 'testimonials.review_2_text', rating: 5 },
    { nameKey: 'testimonials.review_3_name', countryKey: 'testimonials.review_3_country', textKey: 'testimonials.review_3_text', rating: 5 },
    { nameKey: 'testimonials.review_4_name', countryKey: 'testimonials.review_4_country', textKey: 'testimonials.review_4_text', rating: 5 },
    { nameKey: 'testimonials.review_5_name', countryKey: 'testimonials.review_5_country', textKey: 'testimonials.review_5_text', rating: 5 },
    { nameKey: 'testimonials.review_6_name', countryKey: 'testimonials.review_6_country', textKey: 'testimonials.review_6_text', rating: 5 },
  ];

  return (
    <section className="py-12 sm:py-12 px-6 sm:px-12 md:px-20 lg:px-28 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600">
            {t('testimonials.badge')}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
            {t('testimonials.title_1')}{' '}
            <span className="gradient-text">{t('testimonials.title_2')}</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i}
              className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white border border-gray-100">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="#f97316" color="#f97316" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{t(r.textKey)}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                  {t(r.nameKey)[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t(r.nameKey)}</div>
                  <div className="text-xs text-gray-500">{t(r.countryKey)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ────────────────────────────────────────────────────────────────
function Pricing() {
  const { t } = useTranslation();
  return (
    <section id="pricing" className="py-12 sm:py-12 px-6 sm:px-12 md:px-20 lg:px-28 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600">
            {t('pricing.badge')}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
            <span className="gradient-text">{t('pricing.title')}</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto mb-8">
            {t('pricing.subtitle')}
          </p>
          <a href="#waitlist"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-white rounded-full px-8 py-4 transition-all duration-200 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            {t('pricing.cta')} <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Waitlist ────────────────────────────────────────────────────────────
function Waitlist() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/waitlist/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(t('waitlist.success_text'));
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section id="waitlist" className="py-12 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-sm font-medium mb-6">
          {t('waitlist.title_1')} <span className="text-blue-400">{t('waitlist.title_2')}</span> {t('waitlist.title_3')}
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
          {t('waitlist.title_1')} <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{t('waitlist.title_2')}</span> {t('waitlist.title_3')}
        </h2>

        <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto">
          {t('waitlist.subtitle')}
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('waitlist.email_placeholder')}
              className="flex-1 px-5 py-3.5 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={status === 'loading' || status === 'success'}
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50"
            >
              {status === 'loading' ? t('waitlist.loading') : t('waitlist.button')}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-4 text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </div>
        )}

        <div className="flex justify-center gap-8 mt-10 text-sm text-gray-400">
          <div>
            <span className="text-2xl font-bold text-white">{t('waitlist.stat_1_num')}</span>
            <span className="ml-2">{t('waitlist.stat_1_label')}</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-white">{t('waitlist.stat_2_num')}</span>
            <span className="ml-2">{t('waitlist.stat_2_label')}</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-white">{t('waitlist.stat_3_num')}</span>
            <span className="ml-2">{t('waitlist.stat_3_label')}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-8">{t('waitlist.footer')}</p>
      </div>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { t } = useTranslation();
  const faqs = [
    { qKey: 'faq.q_1', aKey: 'faq.a_1' },
    { qKey: 'faq.q_2', aKey: 'faq.a_2' },
    { qKey: 'faq.q_3', aKey: 'faq.a_3' },
    { qKey: 'faq.q_4', aKey: 'faq.a_4' },
    { qKey: 'faq.q_5', aKey: 'faq.a_5' },
    { qKey: 'faq.q_6', aKey: 'faq.a_6' },
  ];

  return (
    <section id="faq" className="py-12 sm:py-12 px-6 sm:px-12 md:px-20 lg:px-28 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600">
            {t('faq.badge')}
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
            {t('faq.title_1')}{' '}
            <span className="gradient-text">{t('faq.title_2')}</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i}
              className="rounded-2xl overflow-hidden transition-all duration-200 bg-white border border-gray-100">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">{t(faq.qKey)}</span>
                <span className="text-lg font-light transition-transform duration-200 flex-shrink-0 text-blue-500"
                  style={{ transform: openIdx === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                  +
                </span>
              </button>
              {openIdx === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 text-sm leading-relaxed">{t(faq.aKey)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="py-16 px-6 sm:px-12 md:px-20 lg:px-28 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ArtShiftLogo className="w-8 h-8" />
              <span className="font-extrabold text-white tracking-tight text-lg">ArtShift</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
              {t('footer.description')}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">{t('footer.platform')}</div>
              <div className="space-y-3">
                {[t('footer.howItWorks'), t('footer.products'), t('footer.pricing')].map(l => (
                  <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
                    className="block text-gray-400 hover:text-white transition-colors text-sm">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">{t('footer.company')}</div>
              <div className="space-y-3">
                {[t('footer.about'), t('footer.blog'), t('footer.contact')].map(l => (
                  <a key={l} href="#"
                    className="block text-gray-400 hover:text-white transition-colors text-sm">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">{t('footer.legal')}</div>
              <div className="space-y-3">
                {[t('footer.privacyPolicy'), t('footer.termsOfService'), t('footer.refundPolicy')].map(l => (
                  <a key={l} href="#"
                    className="block text-gray-400 hover:text-white transition-colors text-sm">{l}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10">
          <p className="text-[11px] text-gray-600 uppercase tracking-widest">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <TOONHUBHero />
      <HowItWorks />
      <StyleGallery />
      <AIDemo />
      <Products />
      <WhyArtShift />
      <Testimonials />
      <Pricing />
      <Waitlist />
      <FAQ />
      <Footer />
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
