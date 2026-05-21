import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TOONHUBHero from './TOONHUBHero';
import ParticleBackground from './ParticleBackground';

// ─── Navbar ─────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
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
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-white/25 backdrop-blur-xl border-b border-white/20 shadow-lg" style={{ backdropFilter: 'blur(20px)' }}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shadow-sm bg-white">
          <img src="/logo.png" alt="ArtShift Logo" className="w-5 h-5 sm:w-6 sm:h-6" style={{ objectFit: 'contain' }} />
        </div>
        <div className="flex items-center gap-4 sm:gap-8 rounded-2xl px-5 sm:px-8 py-2.5 sm:py-3 shadow-sm bg-white">
          {links.map(l => (
            <a key={l.key} href={`#${l.id}`}
              className="text-[12px] sm:text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 hidden sm:block">
              {t(l.key)}
            </a>
          ))}
          <a href="#waitlist"
            className="text-[12px] sm:text-[13px] font-semibold text-white rounded-full px-5 py-1.5 transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            {t('navbar.joinWaitlist')}
          </a>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => changeLanguage('en')}
              className="text-[11px] font-semibold px-2 py-1 rounded-md transition-all duration-200 hover:bg-gray-100"
              style={{ color: i18n.language === 'en' ? '#3b82f6' : '#9ca3af' }}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('zh')}
              className="text-[11px] font-semibold px-2 py-1 rounded-md transition-all duration-200 hover:bg-gray-100"
              style={{ color: i18n.language === 'zh' ? '#3b82f6' : '#9ca3af' }}
            >
              中文
            </button>
          </div>
          <button className="sm:hidden text-gray-500" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
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
      <ParticleBackground />
      <Navbar />
      <TOONHUBHero />
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        >
          ↑
        </button>
      )}
    </div>
  );
}
