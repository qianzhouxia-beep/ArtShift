import { useState, useEffect } from 'react';
import {
  Zap, Menu, X,
  Wand2, Truck,
  ArrowUp,
} from 'lucide-react';

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
  
  const links = [
    { key: 'Home', id: 'hero' },
    { key: 'How It Works', id: 'how-it-works' },
    { key: 'Products', id: 'products' },
    { key: 'FAQ', id: 'faq' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white shadow-md' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArtShiftLogo className="w-8 h-8" />
          <span className="font-extrabold text-xl tracking-tight text-gray-900">ArtShift</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.key} href={`#${l.id}`}
              className={`text-sm font-medium transition-colors ${
                scrolled ? 'text-gray-600 hover:text-gray-900' : 'text-gray-700 hover:text-black'
              }`}>
              {l.key}
            </a>
          ))}
          <a href="#waitlist"
            className="text-sm font-bold text-white rounded-full px-6 py-2.5 transition-all duration-200 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>
            JOIN WAITLIST
          </a>
        </div>
        
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-3">
          {links.map(l => (
            <a key={l.key} href={`#${l.id}`}
              className="block text-sm font-medium text-gray-600 hover:text-gray-900 py-2"
              onClick={() => setMenuOpen(false)}>
              {l.key}
            </a>
          ))}
          <a href="#waitlist"
            className="block text-sm font-bold text-white rounded-full px-6 py-2.5 text-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}
            onClick={() => setMenuOpen(false)}>
            JOIN WAITLIST
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── New Hero Section ─────────────────────────────────────────────────────
function NewHero() {
  return (
    <section id="hero" className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-6 pt-20 pb-12 relative overflow-hidden">
      {/* Floating Labels */}
      <div className="absolute top-32 left-8 md:left-16 animate-bounce">
        <div className="bg-[#FACC15] text-[#111111] text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
          <Zap size={14} fill="#111111" /> AI Generated in 30s
        </div>
      </div>
      
      <div className="absolute top-48 right-8 md:right-16 animate-pulse">
        <div className="bg-[#8B5CF6] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
          ✨ 2,847+ Designs Created
        </div>
      </div>
      
      <div className="absolute bottom-32 left-8 md:left-24 animate-bounce delay-100">
        <div className="bg-[#FACC15] text-[#111111] text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
          ✨ Free Worldwide Shipping
        </div>
      </div>
      
      <div className="absolute bottom-48 right-8 md:right-24 animate-pulse delay-150">
        <div className="bg-[#8B5CF6] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
          💜 Trending: Cyberpunk Style
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-6xl mx-auto text-center z-10">
        <div className="mb-8 flex justify-center">
          {/* Phone Mockup - CSS Drawing */}
          <div className="relative w-64 h-[500px] bg-white rounded-[3rem] shadow-2xl border-8 border-gray-900 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 rounded-t-[2.5rem] flex items-end justify-center pb-1">
              <div className="w-20 h-1 bg-gray-700 rounded-full"></div>
            </div>
            <div className="pt-8 px-4 h-full bg-gradient-to-br from-purple-100 to-blue-100 flex flex-col">
              <div className="text-[10px] font-bold text-gray-400 mb-2">AI GENERATING...</div>
              <div className="flex-1 bg-white rounded-2xl shadow-inner flex items-center justify-center">
                <div className="text-center p-4">
                    <div className="text-xs font-semibold text-gray-700">Cyberpunk Cat</div>
                    <div className="text-[10px] text-gray-400 mt-1">Style: Cyberpunk</div>
                  </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <div className="h-2 bg-purple-200 rounded-full w-3/4 mx-auto"></div>
                <div className="h-2 bg-blue-200 rounded-full w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-[#111111] mb-4 leading-none">
          TURN YOUR<br />IDEAS INTO
        </h1>
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-6 leading-none" style={{ color: '#8B5CF6' }}>
          WEARABLE ART
        </h1>
        <p className="text-lg md:text-xl text-[#666666] font-medium mb-10 max-w-2xl mx-auto">
          AI-Powered Custom Prints on Demand
        </p>
        
        <a href="#waitlist"
          className="inline-flex items-center gap-3 text-lg font-bold text-white rounded-full px-12 py-5 transition-all duration-200 hover:shadow-2xl hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>
          JOIN WAITLIST →
        </a>
      </div>
    </section>
  );
}

// ─── How It Works (Simplified) ───────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      icon: <Wand2 size={32} strokeWidth={1.5} />,
      title: 'Describe',
      description: 'Type your wildest idea',
      color: '#3B82F6',
    },
    {
      icon: <Wand2 size={32} strokeWidth={1.5} />,
      title: 'Generate',
      description: 'AI creates in 30 seconds',
      color: '#8B5CF6',
    },
    {
      icon: <Truck size={32} strokeWidth={1.5} />,
      title: 'Receive',
      description: 'Get it delivered worldwide',
      color: '#FACC15',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#111111] mb-4">
            HOW IT WORKS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div 
                className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: `${step.color}15`, color: step.color }}
              >
                {step.icon}
              </div>
              <div className="text-lg font-bold text-[#111111] mb-1">{step.title}</div>
              <div className="text-sm text-[#666666]">{step.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Demo (Optimized) ─────────────────────────────────────────────────
const AI_STYLES = [
  { id: 'oil-painting', name: 'Oil Painting', desc: 'Classic & Artistic' },
  { id: 'pixel-art', name: 'Pixel Art', desc: 'Retro Gaming Style' },
  { id: 'anime', name: 'Anime', desc: 'Japanese Animation' },
  { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Neon & Futuristic' },
  { id: 'pencil-sketch', name: 'Pencil Sketch', desc: 'Hand-drawn Feel' },
  { id: 'watercolor', name: 'Watercolor', desc: 'Soft & Dreamy' },
];

const API_URL = import.meta.env.VITE_API_URL || 'https://artshift-backend.zeabur.app/api';

function AIDemo() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('oil-painting');
  const [generating, setGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
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
    <section className="py-20 px-6 bg-[#FAFAFA]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#111111] mb-4">
            TRY IT <span style={{ color: '#8B5CF6' }}>NOW</span>
          </h2>
          <p className="text-[#666666] text-lg">
            See AI generate your custom design in real-time
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#E5E5E5]">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#666666] mb-2">YOUR PROMPT</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A cyberpunk cat riding a neon motorcycle..."
                rows={3}
                className="w-full rounded-2xl px-5 py-4 text-sm text-[#111111] placeholder-[#999999] border border-[#E5E5E5] focus:border-[#8B5CF6] focus:ring-2 focus:ring-purple-500/20 outline-none transition-all duration-200 resize-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#666666] mb-3">SELECT STYLE</label>
              <div className="grid grid-cols-3 gap-3">
                {AI_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 border-2 ${
                      selectedStyle === style.id
                        ? 'border-transparent text-white'
                        : 'border-[#E5E5E5] text-[#666666] hover:border-[#8B5CF6] bg-white'
                    }`}
                    style={selectedStyle === style.id ? { background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' } : {}}
                  >
                    <div>{style.name}</div>
                    <div className={`text-[10px] mt-0.5 ${selectedStyle === style.id ? 'text-white/70' : 'text-[#999999]'}`}>{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="rounded-xl p-4 bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full rounded-2xl px-8 py-4 text-sm font-bold text-white transition-all duration-200 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}
            >
              {generating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 size={18} />
                  Generate My Design
                </>
              )}
            </button>
          </div>

          {(generating || resultUrl) && (
            <div className="mt-10 pt-10 border-t border-[#E5E5E5]">
              <div className="max-w-2xl mx-auto">
                {generating ? (
                  <div className="rounded-3xl aspect-square flex items-center justify-center bg-[#FAFAFA]">
                    <div className="text-center">
                      <svg className="animate-spin h-16 w-16 mx-auto mb-4" style={{ color: '#8B5CF6' }} viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <div className="text-lg font-bold text-[#111111]">AI is creating...</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#8B5CF6] mt-2">Usually takes 30s</div>
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
                        style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}
                      >
                        View Full Size
                      </a>
                      <button
                        onClick={() => {
                          setResultUrl(null);
                          setPrompt('');
                        }}
                        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-[#666666] border border-[#E5E5E5] transition-all duration-200 hover:bg-[#FAFAFA]"
                      >
                        Generate Another
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Products (E-commerce Style) ────────────────────────────────────────
function Products() {
  const products = [
    { 
      emoji: '👕', 
      name: 'T-Shirt', 
      price: '$24.99 - $34.99',
      badge: 'BESTSELLER',
      badgeColor: '#FACC15',
      badgeBg: '#FACC15',
    },
    { 
      emoji: '🧥', 
      name: 'Hoodie', 
      price: '$39.99 - $49.99',
      badge: 'POPULAR',
      badgeColor: '#8B5CF6',
      badgeBg: '#8B5CF6',
    },
    { 
      emoji: '☕', 
      name: 'Mug', 
      price: '$14.99 - $19.99',
      badge: null,
      badgeColor: null,
      badgeBg: null,
    },
    { 
      emoji: '📱', 
      name: 'Phone Case', 
      price: '$19.99 - $29.99',
      badge: 'NEW',
      badgeColor: '#3B82F6',
      badgeBg: '#3B82F6',
    },
    { 
      emoji: '🧢', 
      name: 'Cap', 
      price: '$22.99 - $27.99',
      badge: null,
      badgeColor: null,
      badgeBg: null,
    },
  ];

  return (
    <section id="products" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#111111] mb-4">
            SHOP THE LOOK
          </h2>
          <p className="text-[#666666] text-lg max-w-xl mx-auto">
            Premium products featuring your AI-generated designs
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((p, i) => (
            <div key={i}
              className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer bg-white border border-[#E5E5E5]">
              {p.badge && (
                <div className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 text-center text-white"
                  style={{ backgroundColor: p.badgeBg }}>
                  {p.badge}
                </div>
              )}
              <div className="aspect-square flex items-center justify-center bg-[#FAFAFA]">
                <span className="text-6xl">{p.emoji}</span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-[#111111] text-sm mb-1">{p.name}</h4>
                <p className="text-sm font-bold mb-3" style={{ color: '#8B5CF6' }}>{p.price}</p>
                <button
                  className="w-full rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-1"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>
                  Customize →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Waitlist (Urgency-focused) ─────────────────────────────────────────
function Waitlist() {
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
        setMessage('You\'re on the list! Early access coming soon.');
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
    <section id="waitlist" className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>
      <div className="max-w-2xl mx-auto text-center text-white">
        <div className="text-6xl md:text-8xl font-extrabold mb-4">3,247</div>
        <div className="text-xl md:text-2xl font-bold mb-8">on waitlist</div>

        <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
          Join 3,000+ creators<br />waiting for early access
        </h2>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-5 py-3.5 rounded-full text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              disabled={status === 'loading' || status === 'success'}
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="px-8 py-3.5 rounded-full bg-white font-semibold text-sm hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              style={{ color: '#8B5CF6' }}
            >
              {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
            </button>
          </div>
        </form>

        {message && (
          <div className={`mt-4 text-sm ${status === 'success' ? 'text-white' : 'text-red-200'}`}>
            {message}
          </div>
        )}

        <p className="text-sm mt-8 text-white/70">Join 3,000+ creators waiting for early access</p>
      </div>
    </section>
  );
}

// ─── FAQ (Simplified to 4 questions) ────────────────────────────────────
function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  
  const faqs = [
    { 
      q: 'How does AI generation work?', 
      a: 'Our AI transforms your text description into unique artwork in seconds. Just type what you want, pick a style, and let our AI create it.' 
    },
    { 
      q: 'What products can I customize?', 
      a: 'Currently we support T-Shirts, Hoodies, Mugs, Phone Cases, and Caps. More products coming soon!' 
    },
    { 
      q: 'How long does shipping take?', 
      a: 'We offer free worldwide shipping. Typically 5-10 business days for domestic orders, 10-20 days for international.' 
    },
    { 
      q: 'Can I return my order?', 
      a: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied, return it for a full refund.' 
    },
  ];

  return (
    <section id="faq" className="py-20 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#111111]">
            FAQ
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i}
              className="rounded-2xl overflow-hidden transition-all duration-200 bg-white border border-[#E5E5E5]">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-semibold text-[#111111] text-sm sm:text-base">{faq.q}</span>
                <span className="text-lg font-light transition-transform duration-200 flex-shrink-0"
                  style={{ color: '#8B5CF6', transform: openIdx === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                  +
                </span>
              </button>
              {openIdx === i && (
                <div className="px-6 pb-5">
                  <p className="text-[#666666] text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer (Simplified) ────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-12 px-6 bg-[#111111] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ArtShiftLogo className="w-8 h-8" />
              <span className="font-extrabold text-lg">ArtShift</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              AI-powered custom prints on demand. Turn your ideas into wearable art.
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div>
              <div className="font-bold uppercase tracking-widest text-[10px] text-gray-500 mb-3">Product</div>
              <div className="space-y-2">
                <a href="#how-it-works" className="block text-gray-400 hover:text-white transition-colors text-sm">How It Works</a>
                <a href="#products" className="block text-gray-400 hover:text-white transition-colors text-sm">Products</a>
              </div>
            </div>
            <div>
              <div className="font-bold uppercase tracking-widest text-[10px] text-gray-500 mb-3">Legal</div>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10">
          <p className="text-[11px] text-gray-600 uppercase tracking-widest">© 2024 ArtShift. All rights reserved.</p>
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
      <NewHero />
      <HowItWorks />
      <AIDemo />
      <Products />
      <Waitlist />
      <FAQ />
      <Footer />
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
