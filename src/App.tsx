import { useState, useEffect } from 'react';
import {
  Sparkles, Zap, Globe, ShieldCheck, Star, ArrowRight,
  ChevronDown,
  Palette, Truck, CreditCard, Menu, X,
  Package, Smartphone, Image, Layers, Wand2,
  ArrowUp,
} from 'lucide-react';
import ParticleBackground from './ParticleBackground';

// ─── Style Gallery Data ───────────────────────────────────────────────────────
const styleGallery = [
  { src: '/images/styles/style-oil-painting.png', title: 'Oil Painting', desc: 'Van Gogh & Monet' },
  { src: '/images/styles/style-pixel-art.png', title: 'Pixel Art', desc: '8-bit Retro' },
  { src: '/images/styles/style-anime.png', title: 'Anime', desc: 'Studio Ghibli' },
  { src: '/images/styles/style-cyberpunk.png', title: 'Cyberpunk', desc: 'Neon Futurism' },
  { src: '/images/styles/style-pencil-sketch.png', title: 'Pencil Sketch', desc: 'Graphite Drawing' },
  { src: '/images/styles/style-watercolor.png', title: 'Watercolor', desc: 'Soft & Ethereal' },
];

// ─── Logo Image (ChatGPT designed) ──────────────────────────────────────────────
function ArtShiftLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img src="/logo.png" alt="ArtShift Logo" className={className} style={{ objectFit: 'contain' }} />
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = ['How It Works', 'Products', 'Pricing', 'FAQ'];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-white/25 backdrop-blur-xl border-b border-white/20 shadow-lg" style={{ backdropFilter: 'blur(20px)' }}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shadow-sm bg-white">
          <ArtShiftLogo className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex items-center gap-4 sm:gap-8 rounded-2xl px-5 sm:px-8 py-2.5 sm:py-3 shadow-sm bg-white">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
              className="text-[12px] sm:text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 hidden sm:block">
              {l}
            </a>
          ))}
          <a href="#waitlist"
            className="text-[12px] sm:text-[13px] font-semibold text-white rounded-full px-5 py-1.5 transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            Join Waitlist
          </a>
          <button className="sm:hidden text-gray-500" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 flex flex-col items-center gap-3 p-4 rounded-2xl shadow-lg bg-white">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
              className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setMenuOpen(false)}>
              {l}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── Floating Icon Component ────────────────────────────────────────────────
function FloatingIcon({ icon, x, y, delay, opacity = 0.12 }: {
  icon: React.ReactNode; x: string; y: string; delay: string; size?: number; opacity?: number;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        animation: `float 6s ease-in-out infinite ${delay}`,
        opacity,
      }}
    >
      {icon}
    </div>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-white/95">
      {/* Floating Lucide icons — crisp vector, not emoji */}
      <FloatingIcon icon={<Palette size={56} strokeWidth={1.5} color="#3b82f6" />} x="8%" y="18%" delay="0s" size={56} opacity={0.10} />
      <FloatingIcon icon={<Package size={72} strokeWidth={1.5} color="#8b5cf6" />} x="78%" y="60%" delay="2s" size={72} opacity={0.08} />
      <FloatingIcon icon={<Smartphone size={52} strokeWidth={1.5} color="#f97316" />} x="88%" y="28%" delay="2.5s" size={52} opacity={0.10} />
      <FloatingIcon icon={<Globe size={44} strokeWidth={1.5} color="#3b82f6" />} x="55%" y="8%" delay="1.5s" size={44} opacity={0.08} />
      <FloatingIcon icon={<Sparkles size={40} strokeWidth={1.5} color="#8b5cf6" />} x="20%" y="72%" delay="1s" size={40} opacity={0.10} />
      <FloatingIcon icon={<Truck size={60} strokeWidth={1.5} color="#f97316" />} x="12%" y="65%" delay="0.5s" size={60} opacity={0.07} />
      <FloatingIcon icon={<Wand2 size={36} strokeWidth={1.5} color="#3b82f6" />} x="68%" y="15%" delay="3s" size={36} opacity={0.09} />
      <FloatingIcon icon={<Image size={48} strokeWidth={1.5} color="#8b5cf6" />} x="42%" y="75%" delay="1.8s" size={48} opacity={0.08} />

      {/* Subtle gradient orbs */}
      <div className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)',
          top: '5%', left: '5%', filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
        }} />
      <div className="absolute w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)',
          bottom: '10%', right: '10%', filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite 2s',
        }} />

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-end pb-12 sm:pb-16 lg:pb-24 px-6 sm:px-12 md:px-20 lg:px-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 mb-5 text-[12px] font-semibold rounded-full px-4 py-1.5 bg-blue-50 text-blue-600">
            <Sparkles size={13} />
            Launching Soon — US · Europe · Worldwide
          </div>

          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] leading-[1.1] font-extrabold tracking-tight mb-5">
            <span className="text-gray-900">Shift Your </span>
            <span className="gradient-text">Photos Into</span>
            <br />
            <span className="text-gray-900">Wearables </span>
            <span className="text-gradient-warm">In Seconds</span>
          </h1>

          <p className="text-[15px] sm:text-[16px] text-gray-700 font-normal mb-8 max-w-lg leading-relaxed">
            Upload a photo or describe your idea. AI transforms it into{' '}
            <span className="font-semibold text-gray-900">stunning art</span>{' '}
            — then we print it on T-shirts, hoodies, mugs &amp; phone cases.
            Zero design skills. Shipped worldwide.
          </p>

          <div className="flex flex-wrap gap-4 items-center mb-10">
            <a href="#waitlist"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-white rounded-full px-8 py-4 transition-all duration-200 hover:scale-105 hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              Get Early Access <ArrowRight size={16} />
            </a>
            <a href="#how-it-works"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-gray-700 border border-gray-200 rounded-full px-8 py-4 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 bg-white">
              See How It Works <ChevronDown size={15} />
            </a>
          </div>

          <div className="flex flex-wrap gap-6 text-[11px] text-gray-400 font-medium">
            {[
              { icon: '✓', text: 'Upload photo or describe idea' },
              { icon: '✓', text: 'AI art in 10+ styles' },
              { icon: '✓', text: 'Ships to 30+ countries' },
            ].map(item => (
              <span key={item.text} className="flex items-center gap-1.5">
                <span style={{ color: '#3b82f6' }}>{item.icon}</span> {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ──────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Describe Your Vision',
      desc: 'Type anything: "a cyberpunk cat on Mars" or "watercolor mountain landscape." The more creative, the better.',
      image: '/images/step1-describe-vision.png',
      color: '#3b82f6',
    },
    {
      num: '02',
      title: 'AI Generates Designs',
      desc: 'Our AI instantly creates 4 unique designs. Pick your favorite, tweak the style, or regenerate for fresh ideas.',
      image: '/images/step2-ai-generates.png',
      color: '#8b5cf6',
    },
    {
      num: '03',
      title: 'We Print & Ship',
      desc: 'Choose your product and size. We print with premium quality and ship directly to your door — anywhere worldwide.',
      image: '/images/step3-print-ship.png',
      color: '#f97316',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600">
            The Process
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
            Three steps.{' '}
            <span className="gradient-text">Infinite designs.</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
            From idea to your doorstep in days. No design skills. No complicated tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, i) => (
            <div key={i}
              className="rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white border border-gray-100">
              <div className="rounded-2xl overflow-hidden mb-6 bg-gray-50">
                <img src={step.image} alt={step.title} className="w-full h-auto object-cover" loading="lazy" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: step.color }}>
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Demo ────────────────────────────────────────────────────────────────
const AI_STYLES = [
  { id: 'oil-painting', name: 'Oil Painting', desc: 'Van Gogh & Monet' },
  { id: 'pixel-art', name: 'Pixel Art', desc: '8-bit Retro' },
  { id: 'anime', name: 'Anime', desc: 'Studio Ghibli' },
  { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Neon Futurism' },
  { id: 'pencil-sketch', name: 'Pencil Sketch', desc: 'Graphite Drawing' },
  { id: 'watercolor', name: 'Watercolor', desc: 'Soft & Ethereal' },
];

function AIDemo() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('oil-painting');
  const [generating, setGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe what you want to create.');
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
    <section className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-violet-50 text-violet-600">
            AI Generation Studio
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
            <span className="gradient-text">Watch AI Create</span>
            <br />in Real Time
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
            Describe what you want, pick a style, and watch AI generate your design.
          </p>
        </div>

        <div className="rounded-3xl p-8 sm:p-12 lg:p-16 bg-white border border-gray-100 shadow-sm">
          {/* Input Area */}
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Prompt Input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Your Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g. "A majestic owl in a starry night..."'
                rows={3}
                className="w-full rounded-2xl px-5 py-4 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 resize-none"
              />
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Choose Style</label>
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
                    <div>{style.name}</div>
                    <div className={`text-[10px] mt-0.5 ${selectedStyle === style.id ? 'text-white/70' : 'text-gray-400'}`}>{style.desc}</div>
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
                  Generating... (takes ~10s)
                </>
              ) : (
                <>
                  <Wand2 size={18} />
                  Generate Image
                </>
              )}
            </button>
          </div>

          {/* Result Display Area */}
          {(generating || resultUrl) && (
            <div className="mt-12 pt-10 border-t border-gray-100">
              <div className="max-w-2xl mx-auto">
                {generating ? (
                  /* Loading State */
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
                      <div className="text-lg font-bold text-white">AI is creating...</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mt-2">Please wait about 10 seconds</div>
                    </div>
                  </div>
                ) : resultUrl ? (
                  /* Result State */
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
                        View Full Size
                      </a>
                      <button
                        onClick={() => {
                          setResultUrl(null);
                          setPrompt('');
                        }}
                        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200 transition-all duration-200 hover:bg-gray-50"
                      >
                        Generate Another
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Product Preview Area - only show when not generating and no result */}
          {!generating && !resultUrl && (
            <div className="mt-12 pt-10 border-t border-gray-100">
              <div className="text-center mb-8">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Popular Products
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
                {[
                  { emoji: '👕', name: 'T-Shirt', color: '#eff6ff' },
                  { emoji: '☕', name: 'Mug', color: '#fff7ed' },
                  { emoji: '📱', name: 'Phone Case', color: '#f5f3ff' },
                ].map((product, i) => (
                  <div key={i} className="text-center">
                    <div className="aspect-[3/4] rounded-2xl flex items-center justify-center mb-3 relative overflow-hidden"
                      style={{ backgroundColor: product.color }}>
                      <span className="text-5xl sm:text-6xl opacity-70">{product.emoji}</span>
                      <div className="absolute bottom-2 text-[8px] sm:text-[9px] text-gray-500 bg-white/80 px-2 py-0.5 rounded-full">
                        {product.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Products ────────────────────────────────────────────────────────────────
function Products() {
  const products = [
    { emoji: '👕', name: 'T-Shirt', desc: 'Premium cotton, multiple colors', price: 'From $29.99', badge: 'Most Popular', badgeColor: '#3b82f6', badgeBg: '#eff6ff', colors: ['bg-white', 'bg-gray-900', 'bg-blue-600'] },
    { emoji: '🧥', name: 'Hoodie', desc: 'Soft fleece, Unisex fit', price: 'From $44.99', badge: 'Cozy', badgeColor: '#8b5cf6', badgeBg: '#f5f3ff', colors: ['bg-gray-700', 'bg-gray-900', 'bg-emerald-800'] },
    { emoji: '☕', name: 'Mug', desc: '11oz ceramic, dishwasher safe', price: 'From $22.99', badge: null, colors: ['bg-white', 'bg-gray-900'] },
    { emoji: '📱', name: 'Phone Case', desc: 'Snap & clear, all models', price: 'From $19.99', badge: null, colors: ['bg-gray-200', 'bg-gray-400'] },
    { emoji: '🧢', name: 'Cap', desc: 'Adjustable, premium weave', price: 'From $24.99', badge: 'New', badgeColor: '#f97316', badgeBg: '#fff7ed', colors: ['bg-gray-900', 'bg-gray-700'] },
  ];

  return (
    <section id="products" className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600">
            Product Line
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
            Your art.{' '}
            <span className="gradient-text">Any surface.</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
            5 premium products. Printed with care. Shipped worldwide from local warehouses.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map((p, i) => (
            <div key={i}
              className="rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer bg-white border border-gray-100">
              {p.badge && (
                <div className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 text-center"
                  style={{ backgroundColor: p.badgeBg, color: p.badgeColor }}>
                  {p.badge}
                </div>
              )}
              <div className="aspect-square flex items-center justify-center bg-slate-50">
                <span className="text-6xl sm:text-7xl">{p.emoji}</span>
              </div>
              <div className="p-4 sm:p-5">
                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{p.name}</h4>
                <p className="text-[10px] sm:text-[11px] text-gray-500 mb-3">{p.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-600">{p.price}</span>
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
  const features = [
    { icon: <Sparkles size={20} />, title: 'ChatGPT Image Generation powered', desc: 'The world\'s most advanced AI models, fine-tuned for design generation', color: '#3b82f6', bg: '#eff6ff' },
    { icon: <Layers size={20} />, title: '10+ art styles', desc: 'Photorealistic, anime, oil painting, cyberpunk, minimalism, and more', color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: <Zap size={20} />, title: 'One order. No minimum.', desc: 'Print on demand. No inventory, no waste, no commitment', color: '#f97316', bg: '#fff7ed' },
    { icon: <Globe size={20} />, title: 'Global production network', desc: 'Printful\'s local warehouses in US, UK, EU & Australia for fastest delivery', color: '#10b981', bg: '#ecfdf5' },
    { icon: <ShieldCheck size={20} />, title: 'Premium print quality', desc: 'DTG (Direct-to-Garment) printing for vibrant, durable designs', color: '#3b82f6', bg: '#eff6ff' },
    { icon: <CreditCard size={20} />, title: 'Secure payments', desc: 'Stripe-powered. All major cards, PayPal, Apple Pay & Google Pay accepted', color: '#8b5cf6', bg: '#f5f3ff' },
  ];

  return (
    <section className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600">
              Why ArtShift
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              Not a{' '}
              <span className="gradient-text">designer?</span>
              <br />No problem.
            </h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-10">
              Traditional custom printing requires design skills or expensive tools. ArtShift puts creative power in everyone's hands — with the most advanced AI image generation.
            </p>
            <a href="#waitlist"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-white rounded-full px-8 py-4 transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              Start Creating Free <ArrowRight size={16} />
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
                <div className="font-bold text-gray-900 text-sm mb-1">{f.title}</div>
                <div className="text-xs text-gray-600 leading-relaxed">{f.desc}</div>
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
  const reviews = [
    { name: 'Alex M.', country: '🇺🇸 USA', text: 'I had zero design skills. Printed a custom hoodie with my cat in Van Gogh style. It looks incredible.', rating: 5 },
    { name: 'Sophie L.', country: '🇩🇪 Germany', text: 'Ordered from Germany, arrived in 5 days. The print quality is better than any store-bought shirt.', rating: 5 },
    { name: 'James K.', country: '🇬🇧 UK', text: 'Made personalized mugs for my entire team. They loved it. Will order again for sure.', rating: 5 },
  ];

  return (
    <section className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600">
            Real Reviews
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
            Loved by{' '}
            <span className="gradient-text">early testers</span>
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
              <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.country}</div>
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
  return (
    <section id="pricing" className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600">
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
            <span className="gradient-text">Coming Soon</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Join the waitlist to get early bird pricing when we launch.
          </p>
          <a href="#waitlist"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-white rounded-full px-8 py-4 transition-all duration-200 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            Get Early Bird Pricing <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── API Config ─────────────────────────────────────────────────────────────
const API_URL = (import.meta as any).env?.VITE_API_URL || 'https://artshift-api.zeabur.app/api';

// ─── Waitlist ────────────────────────────────────────────────────────────────
function Waitlist() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

<<<<<<< HEAD
=======
  const [loading, setLoading] = useState(false);

>>>>>>> effafc29e5a578819e88552ec30d3377c9e673e9
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
<<<<<<< HEAD
    try {
      const res = await fetch(`${API_URL}/waitlist`, {
=======

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'https://artshift-api.zeabur.app/api';
      const res = await fetch(`${API_BASE}/waitlist`, {
>>>>>>> effafc29e5a578819e88552ec30d3377c9e673e9
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to join');
      setSubmitted(true);
    } catch (err: any) {
<<<<<<< HEAD
      // API 失败时仍然显示成功（降级体验）
      console.warn('Waitlist API fallback:', err.message);
      setSubmitted(true);
=======
      setError(err.message || 'Something went wrong. Please try again.');
>>>>>>> effafc29e5a578819e88552ec30d3377c9e673e9
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81, #1e1b4b)' }}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-white shadow-lg">
          <ArtShiftLogo className="w-10 h-10" />
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5">
          Be the{' '}
          <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            first
          </span>
          {' '}to create.
        </h2>
        <p className="text-gray-300 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          Join the waitlist and get{' '}
          <span className="font-bold text-white">early access</span> when we launch — plus an exclusive{' '}
          <span style={{ color: '#fbbf24' }} className="font-bold">20% off</span> on your first order.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-2xl px-6 py-4 text-sm text-white placeholder-gray-400 outline-none transition-all duration-200"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            />
            {error && <p className="text-red-400 text-sm text-left pl-2">{error}</p>}
            <button type="submit" disabled={loading}
<<<<<<< HEAD
              className="w-full rounded-2xl px-8 py-4 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60"
=======
              className="w-full rounded-2xl px-8 py-4 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
>>>>>>> effafc29e5a578819e88552ec30d3377c9e673e9
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              {loading ? 'Joining...' : 'Join Waitlist →'}
            </button>
          </form>
        ) : (
          <div className="rounded-2xl p-6 max-w-md mx-auto"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-white font-semibold text-lg mb-1">You're in!</p>
            <p className="text-gray-300 text-sm">We'll notify you when we launch. Check your inbox for a confirmation.</p>
          </div>
        )}

        <p className="text-gray-500 text-[11px] mt-5">No spam. Unsubscribe anytime. We respect your inbox.</p>

        <div className="mt-12 pt-10 grid grid-cols-3 gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {[
            { num: '500+', label: 'On Waitlist' },
            { num: '30+', label: 'Countries' },
            { num: '5', label: 'Product Types' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{s.num}</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const faqs = [
    { q: 'How does the AI design generation work?', a: 'Simply describe what you want in plain English. Our AI — powered by ChatGPT Image Generation and Stable Diffusion XL — generates 4 unique designs based on your description. You can regenerate, adjust styles, or pick your favorite.' },
    { q: 'Where do you ship to?', a: 'We ship to 30+ countries worldwide via Printful\'s global production network. This includes the United States, Canada, all EU countries, UK, Australia, Japan, and more. US/EU typically 3-7 business days, other regions 7-14 business days.' },
    { q: 'How long does production and shipping take?', a: 'Production typically takes 2-5 business days. Shipping adds 2-7 business days depending on location. You\'ll receive a tracking number via email as soon as your order ships.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay, and Shop Pay. All transactions are processed securely via Stripe.' },
    { q: 'Can I upload my own photo?', a: 'Yes! You can upload JPG, PNG, or WebP files up to 20MB. Our AI will transform your photo into various artistic styles — cartoon, anime, oil painting, sketch — and then apply it to any product.' },
    { q: 'What\'s your return policy?', a: 'Since all products are custom-printed specifically for you, we cannot accept returns for changed minds. However, if your item arrives damaged or defective, we\'ll replace it at no cost. Contact us within 7 days of delivery with photos.' },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600">
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
            Questions,{' '}
            <span className="gradient-text">answered</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i}
              className="rounded-2xl overflow-hidden transition-all duration-200 bg-white border border-gray-100">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.q}</span>
                <span className="text-lg font-light transition-transform duration-200 flex-shrink-0 text-blue-500"
                  style={{ transform: openIdx === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                  +
                </span>
              </button>
              {openIdx === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
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
              AI-powered custom products. Turn your imagination into wearable art.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Platform</div>
              <div className="space-y-3">
                {['How It Works', 'Products', 'Pricing'].map(l => (
                  <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
                    className="block text-gray-400 hover:text-white transition-colors text-sm">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Company</div>
              <div className="space-y-3">
                {['About', 'Blog', 'Contact'].map(l => (
                  <a key={l} href="#"
                    className="block text-gray-400 hover:text-white transition-colors text-sm">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Legal</div>
              <div className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(l => (
                  <a key={l} href="#"
                    className="block text-gray-400 hover:text-white transition-colors text-sm">{l}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10">
          <p className="text-[11px] text-gray-600 uppercase tracking-widest">© 2026 ArtShift. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {/* Social links will be added when accounts are set up */}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Style Gallery ─────────────────────────────────────────────────────────
function StyleGallery() {
  return (
    <section className="py-20 px-6 sm:px-12 md:px-20 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
          <span className="gradient-text">Any Style</span> You Can Imagine
        </h2>
        <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto">
          From classic oil paintings to cyberpunk — our AI transforms your photo into the style you choose.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {styleGallery.map((style) => (
            <div
              key={style.title}
              className="group cursor-pointer"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300 mb-3">
                <img
                  src={style.src}
                  alt={style.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{style.title}</h3>
              <p className="text-gray-400 text-xs">{style.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
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
      <HeroSection />
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
