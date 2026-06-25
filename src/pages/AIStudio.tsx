import { useState, useCallback, useRef, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const API_BASE = import.meta.env.VITE_API_URL || '';

interface StyleOption {
  id: string;
  name: string;
  image: string;
}

const PRODUCTS = [
  { id: 'hoodie',     name: 'Hoodie',     icon: 'apparel',          price: 84.99 },
  { id: 'sweatshirt', name: 'Sweatshirt', icon: 'checkroom',        price: 49.99 },
  { id: 'tshirt',     name: 'T-Shirt',     icon: 'dry_cleaning',     price: 32.00 },
  { id: 'bag',         name: 'Tote Bag',    icon: 'shopping_bag',    price: 39.99 },
  { id: 'mug',         name: 'Mug',         icon: 'coffee',           price: 24.99 },
  { id: 'phonecase',   name: 'Phone Case',  icon: 'smartphone',       price: 45.00 },
  { id: 'hat',         name: 'Trucker Hat', icon: 'travel_explore',   price: 29.99 },
] as const;

const STYLES: StyleOption[] = [
  { id: 'cyberpunk',   name: 'Cyberpunk',     image: '/images/styles/style-cyberpunk.svg' },
  { id: 'anime',       name: 'Anime',          image: '/images/styles/style-anime.svg' },
  { id: 'oil-painting',name: 'Oil Painting',   image: '/images/styles/style-oil-painting.svg' },
  { id: 'watercolor',  name: 'Watercolor',     image: '/images/styles/style-watercolor.svg' },
  { id: 'pixel-art',   name: 'Pixel Art',      image: '/images/styles/style-pixel-art.png' },
  { id: 'pencil-sketch', name: 'Pencil Sketch', image: '/images/styles/style-pencil-sketch.svg' },
];

const COLORS = [
  { name: 'Black',       hex: '#111827' },
  { name: 'White',       hex: '#FFFFFF' },
  { name: 'Heather Gray',hex: '#E5E7EB' },
  { name: 'Navy',        hex: '#1e40af' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

// ── Product image map (prefer SVG for proper mockup) ──
const PRODUCT_IMAGES: Record<string, string> = {
  hoodie:     '/images/products/hoodie.svg',
  sweatshirt: '/images/products/sweatshirt.svg',
  tshirt:     '/images/products/tshirt.svg',
  bag:        '/images/products/bag.png',
  mug:        '/images/products/mug.svg',
  phonecase:  '/images/products/phonecase.svg',
  hat:        '/images/products/hat.svg',
};

// ── Print area in SVG viewBox coords (400×500) ──
const PRINT_AREAS: Record<string, { x: number; y: number; w: number; h: number }> = {
  hoodie:     { x: 155, y: 170, w: 90,  h: 100 },
  sweatshirt: { x: 155, y: 165, w: 90,  h: 95  },
  tshirt:     { x: 158, y: 170, w: 84,  h: 88  },
  bag:        { x: 155, y: 120, w: 90,  h: 100 },
  mug:        { x: 158, y: 220, w: 84,  h: 100 },
  phonecase:  { x: 148, y: 220, w: 104, h: 90  },
  hat:        { x: 165, y: 245, w: 70,  h: 45  },
};

// ── Unique clip IDs to avoid SVG <defs> conflicts ──
let clipIdCounter = 0;

export default function AIStudio() {
  const [selectedProduct, setSelectedProduct] = useState<string>('hoodie');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('cyberpunk');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('Black');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [designState, setDesignState] = useState({ x: 50, y: 50, scale: 1.0, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 50, posY: 50 });
  const [addedToCart, setAddedToCart] = useState(false);
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');
  const [uniqueClipId] = useState(() => `clip-${++clipIdCounter}`);

  // ── Reset design when product or image changes ──
  useEffect(() => {
    setDesignState({ x: 50, y: 50, scale: 1.0, rotation: 0 });
  }, [selectedProduct, generatedImage]);

  const addToCart = () => {
    const product = PRODUCTS.find((p) => p.id === selectedProduct);
    const cartItem = {
      name: product?.name || 'Custom Product',
      size: selectedSize,
      color: selectedColor,
      price: product?.price || 84.99,
      image: generatedImage || null,
    };
    localStorage.setItem('artshift_cart', JSON.stringify(cartItem));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || prompt.trim().length < 3) {
      setError('Please describe your idea (at least 3 characters)');
      return;
    }
    setError(null);
    setIsGenerating(true);
    setGeneratedImage(null);

    const isImg2Img = !!uploadedImage;
    const endpoint = isImg2Img
      ? `${API_BASE}/api/generation/image-to-image`
      : `${API_BASE}/api/generation/text-to-image`;
    const body = isImg2Img
      ? JSON.stringify({ image: uploadedImage, prompt: prompt.trim(), style: selectedStyle })
      : JSON.stringify({ prompt: prompt.trim(), style: selectedStyle });

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      const data = await res.json();
      if (data.success) {
        if (data.base64Images?.[0]) {
          setGeneratedImage(data.base64Images[0]);
        } else if (data.imageUrl) {
          setGeneratedImage(data.imageUrl);
        } else if (data.images?.[0]) {
          setGeneratedImage(data.images[0]);
        }
      } else {
        setError(data.error || 'Generation failed. Please try again.');
      }
    } catch (err: any) {
      console.error('AI generation error:', err);
      setError(`Connection failed: ${err?.message || 'Check if backend is running on port 8081'}`);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, selectedStyle, uploadedImage]);

  // ── Drag-to-position on the SVG canvas ──
  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      const el = svgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = ((e.clientX - dragStart.current.x) / rect.width) * 100;
      const dy = ((e.clientY - dragStart.current.y) / rect.height) * 100;
      setDesignState((prev) => ({
        ...prev,
        x: Math.max(0, Math.min(100, dragStart.current.posX + dx)),
        y: Math.max(0, Math.min(100, dragStart.current.posY + dy)),
      }));
    };
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging]);

  const applyPreset = (preset: 'left-chest' | 'center' | 'full') => {
    const presets = {
      'left-chest': { x: 28, y: 38, scale: 0.45, rotation: 0 },
      center:       { x: 50, y: 50, scale: 1.0,  rotation: 0 },
      full:         { x: 50, y: 50, scale: 1.8,  rotation: 0 },
    };
    setDesignState((prev) => ({ ...prev, ...presets[preset] }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (PNG, JPG, etc.)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB');
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => setUploadedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearUploadedImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── Compute design geometry in SVG coords ──
  const printArea = PRINT_AREAS[selectedProduct] || PRINT_AREAS.hoodie;
  const designX = printArea.x + (designState.x / 100) * printArea.w;
  const designY = printArea.y + (designState.y / 100) * printArea.h;
  const designW = printArea.w * designState.scale;
  const designH = printArea.h * designState.scale;
  const isSvgProduct = PRODUCT_IMAGES[selectedProduct]?.endsWith('.svg');

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header />

      {/* Studio Layout */}
      <main className="h-[calc(100vh-72px)] pt-16 md:pt-[72px] flex flex-col md:flex-row relative">
        {/* ── Left Sidebar ── */}
        <aside className="w-full md:w-[380px] lg:w-[420px] bg-surface-container-low/50 backdrop-blur-md border-r border-outline-variant/20 flex flex-col order-2 md:order-1 min-h-0 overflow-hidden">
          <div className="p-4 md:p-6 overflow-y-auto space-y-6 md:space-y-8 flex-1 sidebar-scroll">

            {/* 1. Product Selector */}
            <section>
              <span className="text-label-sm font-semibold tracking-wider text-on-surface-variant block mb-4 uppercase">
                1. Select Product
              </span>
              <div className="grid grid-cols-2 gap-3">
                {PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p.id);
                      setGeneratedImage(null);
                      clearUploadedImage();
                    }}
                    className={`product-btn flex flex-col items-center p-4 rounded-xl transition-all duration-300 border-2 ${
                      selectedProduct === p.id
                        ? 'border-vivid-purple bg-vivid-purple/5'
                        : 'border-outline-variant/30 hover:border-vivid-purple'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined mb-2 ${
                        selectedProduct === p.id ? 'text-vivid-purple' : 'text-on-surface-variant'
                      }`}
                    >
                      {p.icon}
                    </span>
                    <span
                      className={`text-label-sm font-semibold ${
                        selectedProduct === p.id ? 'text-vivid-purple' : 'text-on-surface-variant'
                      }`}
                    >
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* 2. Prompt Input */}
            <section>
              <span className="text-label-sm font-semibold tracking-wider text-on-surface-variant block mb-4 uppercase">
                2. Define Your Idea
              </span>
              <div className="relative group">
                <textarea
                  className="w-full bg-surface-container-lowest border-2 border-outline-variant/30 focus:border-vivid-purple focus:ring-0 focus:outline-none text-on-surface text-body-md p-4 transition-all duration-300 min-h-[100px] md:min-h-[120px] resize-none rounded-xl"
                  placeholder="What are we creating today? (e.g., A cybernetic wolf in neon rain...)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="absolute bottom-4 right-4 text-vivid-purple/50 pointer-events-none">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    auto_awesome
                  </span>
                </div>
              </div>
              {error && (
                <p className="text-error text-label-sm mt-2">{error}</p>
              )}

              {/* Image Upload */}
              <div className="mt-4">
                {!uploadedImage ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-outline-variant/40 hover:border-vivid-purple/60 bg-surface-container-low/30 rounded-xl p-4 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center justify-center gap-3 text-on-surface-variant group-hover:text-vivid-purple">
                      <span className="material-symbols-outlined text-xl">upload</span>
                      <span className="text-label-sm font-semibold">Upload Reference Image</span>
                      <span className="text-[10px] text-outline">(optional)</span>
                    </div>
                  </button>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border-2 border-vivid-purple/60">
                    <img
                      src={uploadedImage}
                      alt="Reference"
                      className="w-full h-28 object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearUploadedImage}
                      className="absolute top-2 right-2 bg-surface/80 backdrop-blur-sm text-error w-7 h-7 rounded-full flex items-center justify-center hover:bg-error hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                      <span className="text-[10px] font-semibold text-white">Reference Image</span>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </section>

            {/* 3. Style Selector */}
            <section>
              <span className="text-label-sm font-semibold tracking-wider text-on-surface-variant block mb-4 uppercase">
                3. Choose Style
              </span>
              <div className="grid grid-cols-3 gap-3">
                {STYLES.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`group relative cursor-pointer rounded-lg overflow-hidden border-2 aspect-square transition-all ${
                      selectedStyle === s.id
                        ? 'border-vivid-purple ring-2 ring-vivid-purple/20'
                        : 'border-transparent hover:border-vivid-purple/60'
                    }`}
                  >
                    <img
                      alt={s.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      src={s.image}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2">
                      <span className="text-[10px] font-semibold text-white uppercase tracking-wider">
                        {s.name}
                      </span>
                    </div>
                    {selectedStyle === s.id && (
                      <div className="absolute top-1.5 right-1.5 bg-vivid-purple text-white w-5 h-5 rounded-full flex items-center justify-center shadow-lg z-10">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Generate Button */}
            <div className="pb-6 md:pb-0">
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full bg-vivid-purple hover:bg-primary-container text-white font-semibold py-5 rounded-xl shadow-xl shadow-vivid-purple/20 transition-all active:scale-95 flex items-center justify-center gap-3 ${
                  isGenerating ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
                {isGenerating ? 'GENERATING...' : 'GENERATE ARTWORK'}
              </button>
            </div>
          </div>
        </aside>

        {/* ── Center: Mockup Preview ── */}
        <section className="flex-1 min-h-0 flex items-center justify-center p-4 pb-20 md:p-8 md:pb-24 lg:p-12 lg:pb-28 relative bg-surface-container-lowest order-1 md:order-2 overflow-hidden">
          {/* Atmosphere glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[600px] h-[280px] md:h-[600px] bg-vivid-purple/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

          {/* ── Mockup Canvas ── */}
          <div className="relative w-full max-w-lg lg:max-w-2xl aspect-[4/5] max-h-[70vh] flex items-center justify-center">
            <div className="relative w-[85%] max-w-[420px] aspect-[4/5] rounded-2xl shadow-2xl overflow-hidden bg-surface-container-low canvas-glow transition-all duration-700">

              {/* ── SVG Mockup (for SVG products) ── */}
              {isSvgProduct ? (
                <svg
                  ref={svgRef as any}
                  viewBox="0 0 400 500"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <defs>
                    {/* Clip path: design is clipped to print area rounded rect */}
                    <clipPath id={uniqueClipId}>
                      <rect
                        x={printArea.x}
                        y={printArea.y}
                        width={printArea.w}
                        height={printArea.h}
                        rx={8}
                      />
                    </clipPath>
                    {/* Blend filter: make design look "printed" not "stuck on" */}
                    <filter id="printed-look">
                      <feColorMatrix type="saturate" values="0.85"/>
                    </filter>
                  </defs>

                  {/* ── Product base layer (SVG background) ── */}
                  <ProductSvgLayer productId={selectedProduct} colorHex={COLORS.find(c => c.name === selectedColor)?.hex || '#111827'} />

                  {/* ── Print area guide (dashed rect) ── */}
                  <rect
                    x={printArea.x}
                    y={printArea.y}
                    width={printArea.w}
                    height={printArea.h}
                    rx={8}
                    fill={generatedImage ? 'rgba(139,92,246,0.04)' : 'rgba(232,236,240,0.7)'}
                    stroke={generatedImage ? 'rgba(139,92,246,0.35)' : '#D0D5DD'}
                    strokeWidth={1.5}
                    strokeDasharray={generatedImage ? 'none' : '6 4'}
                  />

                  {/* Placeholder text */}
                  {!generatedImage && (
                    <>
                      <text
                        x={printArea.x + printArea.w / 2}
                        y={printArea.y + printArea.h / 2 - 6}
                        textAnchor="middle"
                        fontFamily="sans-serif"
                        fontSize={selectedProduct === 'hat' ? 8 : 11}
                        fill="#98A2B3"
                      >
                        Your Design Here
                      </text>
                      <text
                        x={printArea.x + printArea.w / 2}
                        y={printArea.y + printArea.h / 2 + 10}
                        textAnchor="middle"
                        fontFamily="sans-serif"
                        fontSize={7}
                        fill="#B0B8C8"
                      >
                        Generate or upload to preview
                      </text>
                    </>
                  )}

                  {/* ── Generated Design (clipped to print area) ── */}
                  {generatedImage && (
                    <g
                      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                      onMouseDown={(e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDragging(true);
                        dragStart.current = {
                          x: e.clientX,
                          y: e.clientY,
                          posX: designState.x,
                          posY: designState.y,
                        };
                      }}
                    >
                      <image
                        href={generatedImage}
                        x={designX - designW / 2}
                        y={designY - designH / 2}
                        width={designW}
                        height={designH}
                        clipPath={`url(#${uniqueClipId})`}
                        preserveAspectRatio="xMidYMid slice"
                        filter="url(#printed-look)"
                        style={{ pointerEvents: 'auto' }}
                      />
                      {/* Selection border */}
                      <rect
                        x={designX - designW / 2}
                        y={designY - designH / 2}
                        width={designW}
                        height={designH}
                        rx={4}
                        fill="none"
                        stroke="#8B5CF6"
                        strokeWidth={1.5}
                        strokeDasharray="5 3"
                        opacity={0.6}
                        pointerEvents="none"
                      />
                    </g>
                  )}
                </svg>
              ) : (
                /* PNG fallback (bag etc.) — composite with CSS */
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Product base image */}
                  <img
                    alt="Product"
                    className="w-full h-full object-contain drop-shadow-2xl"
                    src={PRODUCT_IMAGES[selectedProduct] || PRODUCT_IMAGES.hoodie}
                  />
                  {/* Design overlay — blended so it looks printed */}
                  {generatedImage && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{ mixBlendMode: 'multiply' }}
                    >
                      <div
                        className="pointer-events-auto cursor-grab active:cursor-grabbing"
                        style={{
                          position: 'absolute',
                          left: `${designState.x}%`,
                          top: `${designState.y}%`,
                          transform: `translate(-50%, -50%) scale(${designState.scale * 0.5}) rotate(${designState.rotation}deg)`,
                          width: '40%',
                          aspectRatio: '1',
                          transition: isDragging ? 'none' : 'transform 0.2s ease',
                        }}
                        onMouseDown={(e: any) => {
                          e.preventDefault();
                          setIsDragging(true);
                          dragStart.current = {
                            x: e.clientX,
                            y: e.clientY,
                            posX: designState.x,
                            posY: designState.y,
                          };
                        }}
                      >
                        <img
                          src={generatedImage}
                          alt="Your design"
                          className="w-full h-full object-cover rounded shadow-lg"
                          draggable={false}
                          style={{ mixBlendMode: 'multiply', opacity: 0.9 }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── Floating design control buttons ── */}
            {generatedImage && isSvgProduct && (
              <div className="absolute right-0 top-0 flex flex-col gap-2 md:gap-3 z-20">
                <button
                  onClick={() => setDesignState((prev) => ({ ...prev, scale: Math.min(3, prev.scale + 0.15) }))}
                  className="glass-panel p-2.5 md:p-3 rounded-lg text-on-surface-variant hover:text-vivid-purple transition-colors"
                  title="Zoom In Design"
                >
                  <span className="material-symbols-outlined text-sm md:text-base">zoom_in</span>
                </button>
                <button
                  onClick={() => setDesignState((prev) => ({ ...prev, scale: Math.max(0.3, prev.scale - 0.15) }))}
                  className="glass-panel p-2.5 md:p-3 rounded-lg text-on-surface-variant hover:text-vivid-purple transition-colors"
                  title="Zoom Out Design"
                >
                  <span className="material-symbols-outlined text-sm md:text-base">zoom_out</span>
                </button>
                <button
                  onClick={() => setDesignState((prev) => ({ ...prev, rotation: (prev.rotation + 15) % 360 }))}
                  className="glass-panel p-2.5 md:p-3 rounded-lg text-on-surface-variant hover:text-vivid-purple transition-colors"
                  title="Rotate 15°"
                >
                  <span className="material-symbols-outlined text-sm md:text-base">3d_rotation</span>
                </button>
                <button
                  onClick={() => applyPreset('center')}
                  className="glass-panel p-2.5 md:p-3 rounded-lg text-on-surface-variant hover:text-vivid-purple transition-colors"
                  title="Reset Position"
                >
                  <span className="material-symbols-outlined text-sm md:text-base">screenshot</span>
                </button>
              </div>
            )}

            {/* Generation Status */}
            {isGenerating && (
              <div className="absolute bottom-4 md:bottom-[-40px] left-1/2 -translate-x-1/2 glass-panel px-4 md:px-6 py-2 md:py-3 rounded-full flex items-center gap-3 z-30 shadow-lg whitespace-nowrap">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-vivid-purple rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-1.5 h-1.5 bg-vivid-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1.5 h-1.5 bg-vivid-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span className="text-[10px] md:text-label-sm font-semibold text-vivid-purple uppercase">
                  Processing AI Magic...
                </span>
              </div>
            )}
          </div>

          {/* ── Design Position Presets ── */}
          {generatedImage && isSvgProduct && (
            <div className="absolute bottom-14 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {([
                { id: 'left-chest' as const, label: 'Left Chest' },
                { id: 'center' as const, label: 'Center' },
                { id: 'full' as const, label: 'Full Print' },
              ]).map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id)}
                  className={`px-3 py-1.5 rounded-full text-[10px] md:text-xs font-semibold transition-all ${
                    (p.id === 'left-chest' && designState.x < 35 && designState.scale < 0.6) ||
                    (p.id === 'center' && designState.x >= 35 && designState.x <= 65 && designState.scale >= 0.6 && designState.scale < 1.5) ||
                    (p.id === 'full' && designState.scale >= 1.5)
                      ? 'bg-vivid-purple/15 border border-vivid-purple/50 text-vivid-purple'
                      : 'bg-surface/80 backdrop-blur-sm border border-outline-variant/30 text-on-surface-variant hover:border-vivid-purple hover:text-vivid-purple'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* View Mode Switches */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-3 md:gap-4 z-20">
            {(['FRONT', 'BACK'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v === 'FRONT' ? 'front' : 'back')}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center text-[9px] md:text-[10px] font-semibold transition-colors ${
                  (v === 'FRONT' && viewMode === 'front') ||
                  (v === 'BACK' && viewMode === 'back')
                    ? 'border-vivid-purple bg-vivid-purple/5 text-vivid-purple'
                    : 'border-outline-variant/30 bg-surface text-on-surface-variant hover:border-vivid-purple'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </section>

        {/* ── Right Sidebar ── */}
        <aside className="w-full md:w-80 lg:w-96 bg-surface-container-low/50 backdrop-blur-md border-l border-outline-variant/20 p-6 flex flex-col order-3 min-h-0 overflow-y-auto">
          <div className="flex-grow space-y-6 md:space-y-8">
            {/* Product Info */}
            <div className="border-b md:border-none pb-4 md:pb-0">
              <h1 className="text-2xl md:text-headline-md text-on-surface mb-1">
                Premium {PRODUCTS.find((p) => p.id === selectedProduct)?.name || 'Hoodie'}
              </h1>
              <p className="text-sm md:text-body-md text-on-surface-variant">
                Standard Fit, Heavyweight Cotton
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
              {/* Fabric Color */}
              <div className="space-y-3">
                <span className="text-label-sm font-semibold text-on-surface-variant block uppercase">
                  Fabric Color
                </span>
                <div className="flex gap-4 flex-wrap">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      title={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === c.name
                          ? 'border-vivid-purple ring-2 ring-vivid-purple/20'
                          : 'border-outline-variant'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="space-y-3">
                <span className="text-label-sm font-semibold text-on-surface-variant block uppercase">
                  Size
                </span>
                <div className="grid grid-cols-5 gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`h-10 border rounded text-[12px] font-semibold transition-all ${
                        selectedSize === s
                          ? 'border-2 border-vivid-purple bg-vivid-purple/10 text-vivid-purple'
                          : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-bright'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mockup Tips */}
            <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/20">
              <h3 className="text-label-sm font-semibold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-vivid-purple text-base">lightbulb</span>
                Mockup Tips
              </h3>
              <ul className="text-[11px] md:text-xs text-on-surface-variant space-y-1.5">
                <li>• Upload your own image or generate with AI</li>
                <li>• Drag to position, use +/- buttons to scale</li>
                <li>• "Left Chest" ≈ 4×4″, "Full Print" ≈ all-over</li>
                <li>• Fabric color updates the preview in real time</li>
              </ul>
            </div>

            {/* Pricing + Add to Cart */}
            <div className="pt-6 border-t border-outline-variant/20 mt-auto">
              <div className="flex justify-between items-end mb-6">
                <span className="text-body-md text-on-surface-variant">Estimated Price</span>
                <span className="text-2xl font-semibold text-on-surface">
                  ${(PRODUCTS.find((p) => p.id === selectedProduct)?.price || 84.99).toFixed(2)}
                </span>
              </div>
              <button
                className={`w-full font-semibold py-4 md:py-5 rounded-xl transition-all flex items-center justify-center gap-2 group mb-4 ${
                  addedToCart
                    ? 'bg-green-600 text-white'
                    : 'bg-vivid-purple hover:bg-primary text-white'
                }`}
                onClick={addToCart}
              >
                {addedToCart ? (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    ADD TO CART
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>
              <p className="text-center text-label-sm text-outline">
                Free shipping on orders over $100
              </p>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────
// Inline SVG Product Layer
// Dynamically colored to match the selected fabric color
// ─────────────────────────────────────────────

const COLOR_TINTS: Record<string, { fill: string; stroke: string }> = {
  '#111827': { fill: '#1a1a2e',  stroke: '#2C3E50' },
  '#FFFFFF': { fill: '#f5f5f5',  stroke: '#2C3E50' },
  '#E5E7EB': { fill: '#e8ecf0',  stroke: '#2C3E50' },
  '#1e40af': { fill: '#1e3a8a',  stroke: '#1e2a60' },
};

function getTint(hex: string) {
  return COLOR_TINTS[hex] || { fill: hex, stroke: '#2C3E50' };
}

// ── Product SVG sub-components ──

function ProductSvgLayer({ productId, colorHex }: { productId: string; colorHex: string }) {
  const { fill, stroke } = getTint(colorHex);
  const lightFill = adjustColor(fill, 15);
  const veryLight = adjustColor(fill, 8);

  switch (productId) {
    case 'hoodie':
      return (
        <g>
          <ellipse cx="200" cy="470" rx="120" ry="15" fill="#000" opacity="0.08"/>
          <path d="M140 80 L100 130 L95 200 L105 200 L105 420 C105 435 115 445 130 445 L270 445 C285 445 295 435 295 420 L295 200 L305 200 L300 130 L260 80" stroke={stroke} strokeWidth={3} fill={fill}/>
          <path d="M145 85 C145 50 200 30 200 30 C200 30 255 50 255 85 L260 80 L255 100 L145 100 L140 80 Z" stroke={stroke} strokeWidth={3} fill={lightFill}/>
          <path d="M175 100 L170 140 M225 100 L230 140" stroke={stroke} strokeWidth={2} fill="none"/>
          <path d="M140 80 L100 130 L115 135 L140 100" stroke={stroke} strokeWidth={2} fill={veryLight}/>
          <path d="M260 80 L300 130 L285 135 L260 100" stroke={stroke} strokeWidth={2} fill={veryLight}/>
          <path d="M105 420 C105 435 115 445 130 445 L270 445 C285 445 295 435 295 420" stroke={stroke} strokeWidth={2} fill="none"/>
        </g>
      );
    case 'sweatshirt':
      return (
        <g>
          <ellipse cx="200" cy="470" rx="120" ry="15" fill="#000" opacity="0.08"/>
          <path d="M145 100 L110 130 L100 200 L108 200 L108 420 C108 432 118 440 132 440 L268 440 C282 440 292 432 292 420 L292 200 L300 200 L290 130 L255 100" stroke={stroke} strokeWidth={3} fill={fill}/>
          <path d="M155 100 C155 75 200 65 200 65 C200 65 245 75 245 100" stroke={stroke} strokeWidth={3} fill={lightFill}/>
          <path d="M162 98 C165 85 195 78 200 78 C205 78 235 85 238 98" stroke={stroke} strokeWidth={1.5} fill="none"/>
          <path d="M145 100 L110 130 L122 138 L148 108" stroke={stroke} strokeWidth={2} fill={veryLight}/>
          <path d="M255 100 L290 130 L278 138 L252 108" stroke={stroke} strokeWidth={2} fill={veryLight}/>
          <path d="M108 420 C108 432 118 440 132 440 L268 440 C282 440 292 432 292 420" stroke={stroke} strokeWidth={2} fill="none"/>
        </g>
      );
    case 'tshirt':
      return (
        <g>
          <ellipse cx="200" cy="470" rx="100" ry="12" fill="#000" opacity="0.08"/>
          <path d="M155 95 L120 120 L105 200 L115 200 L115 430 L285 430 L285 200 L295 200 L280 120 L245 95" stroke={stroke} strokeWidth={3} fill={fill}/>
          <path d="M165 95 C165 70 200 60 200 60 C200 60 235 70 235 95" stroke={stroke} strokeWidth={3} fill={lightFill}/>
          <path d="M155 95 L120 120 L133 130 L158 108" stroke={stroke} strokeWidth={2} fill={veryLight}/>
          <path d="M245 95 L280 120 L267 130 L242 108" stroke={stroke} strokeWidth={2} fill={veryLight}/>
          <path d="M115 430 L285 430" stroke={stroke} strokeWidth={2} fill="none"/>
        </g>
      );
    case 'mug':
      return (
        <g>
          <ellipse cx="200" cy="470" rx="80" ry="10" fill="#000" opacity="0.08"/>
          <path d="M140 180 L140 360 C140 390 160 410 200 410 C240 410 260 390 260 360 L260 180" stroke={stroke} strokeWidth={3} fill={fill}/>
          <ellipse cx="200" cy="180" rx="60" ry="16" stroke={stroke} strokeWidth={3} fill={lightFill}/>
          <path d="M260 220 C300 220 320 260 320 300 C320 340 300 370 260 370" stroke={stroke} strokeWidth={3} fill="none"/>
          <path d="M260 240 C290 240 305 270 305 300 C305 330 290 355 260 355" stroke={stroke} strokeWidth={1.5} fill="none"/>
          <path d="M145 185 C145 170 200 160 200 160 C200 160 255 170 255 185" fill={veryLight} opacity={0.4}/>
        </g>
      );
    case 'phonecase':
      return (
        <g>
          <ellipse cx="200" cy="470" rx="80" ry="10" fill="#000" opacity="0.08"/>
          <rect x="120" y="110" width="160" height="320" rx="28" stroke={stroke} strokeWidth={3} fill={fill}/>
          <rect x="134" y="130" width="132" height="260" rx="18" fill="#1A1A2E"/>
          <circle cx="200" cy="148" r="8" fill="#2C2C3E" stroke="#444" strokeWidth={1}/>
          <circle cx="200" cy="148" r="4" fill="#000"/>
          <rect x="185" y="165" width="30" height="3" rx="1.5" fill="#333"/>
          <rect x="185" y="410" width="30" height="4" rx="2" fill="#333"/>
          <rect x="280" y="200" width="6" height="30" rx="3" fill="#D0D5DD" stroke={stroke} strokeWidth={1.5}/>
          <rect x="280" y="245" width="6" height="40" rx="3" fill="#D0D5DD" stroke={stroke} strokeWidth={1.5}/>
        </g>
      );
    case 'hat':
      return (
        <g>
          <ellipse cx="200" cy="470" rx="100" ry="12" fill="#000" opacity="0.08"/>
          <path d="M120 220 L120 280 C120 330 150 360 200 360 C250 360 280 330 280 280 L280 220" stroke={stroke} strokeWidth={3} fill={fill}/>
          <path d="M110 220 C90 240 60 250 45 265 C35 275 60 285 80 280 C100 275 120 260 130 245" stroke={stroke} strokeWidth={3} fill="#1A1A2E"/>
          <path d="M45 265 C35 275 60 285 80 280 C100 275 120 260 130 245" stroke={stroke} strokeWidth={2.5} fill="#2C2C3E"/>
          <path d="M280 220 L280 280 C280 330 250 360 200 360" stroke={stroke} strokeWidth={2} fill="#D0D5DD" opacity="0.5"/>
          <path d="M120 220 L200 160 L280 220" stroke={stroke} strokeWidth={2.5} fill={lightFill}/>
          <rect x="193" y="340" width="14" height="20" rx="2" fill="#D0D5DD" stroke={stroke} strokeWidth={1}/>
          <circle cx="150" cy="230" r="3" stroke={stroke} strokeWidth={1.5} fill="none"/>
          <circle cx="250" cy="230" r="3" stroke={stroke} strokeWidth={1.5} fill="none"/>
        </g>
      );
    default:
      // bag fallback
      return (
        <g>
          <ellipse cx="200" cy="470" rx="100" ry="12" fill="#000" opacity="0.08"/>
          <rect x="120" y="120" width="160" height="200" rx="12" stroke={stroke} strokeWidth={3} fill={fill}/>
          <rect x="175" y="100" width="50" height="30" rx="6" stroke={stroke} strokeWidth={2} fill={lightFill}/>
          <path d="M200 100 L200 130" stroke={stroke} strokeWidth={2}/>
        </g>
      );
  }
}

// ── Utility: adjust hex color brightness (pct: -100..100) ──
function adjustColor(hex: string, pct: number): string {
  // Handle rgb() strings
  if (hex.startsWith('rgb')) return hex;
  const h = hex.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(h.substring(0, 2), 16) + Math.round(pct / 100 * 255)));
  const g = Math.min(255, Math.max(0, parseInt(h.substring(2, 4), 16) + Math.round(pct / 100 * 255)));
  const b = Math.min(255, Math.max(0, parseInt(h.substring(4, 6), 16) + Math.round(pct / 100 * 255)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
