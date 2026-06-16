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
  { id: 'hoodie', name: 'Hoodie', icon: 'apparel', price: 84.99 },
  { id: 'sweatshirt', name: 'Sweatshirt', icon: 'checkroom', price: 49.99 },
  { id: 'tshirt', name: 'T-Shirt', icon: 'dry_cleaning', price: 32.00 },
  { id: 'hat', name: 'Hat', icon: 'flag_filled', price: 39.99 },
  { id: 'mug', name: 'Mug', icon: 'coffee', price: 24.99 },
  { id: 'phonecase', name: 'Phone Case', icon: 'smartphone', price: 45.00 },
] as const;

const STYLES: StyleOption[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    image: '/images/styles/style-cyberpunk.svg',
  },
  {
    id: 'anime',
    name: 'Anime',
    image: '/images/styles/style-anime.svg',
  },
  {
    id: 'oil-painting',
    name: 'Oil Painting',
    image: '/images/styles/style-oil-painting.svg',
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    image: '/images/styles/style-watercolor.svg',
  },
  {
    id: 'pixel-art',
    name: 'Pixel Art',
    image: '/images/styles/style-pixel-art.png',
  },
  {
    id: 'pencil-sketch',
    name: 'Pencil Sketch',
    image: '/images/styles/style-pencil-sketch.svg',
  },
];

const COLORS = [
  { name: 'Black', hex: '#111827' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Heather Gray', hex: '#E5E7EB' },
  { name: 'Navy', hex: '#1e40af' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

const MOCKUP_IMAGES: Record<string, string> = {
  hoodie: '/images/products/hoodie.png',
  tshirt: '/images/products/tshirt.png',
  sweatshirt: '/images/products/sweatshirt.png',
  hat: '/images/products/hat.svg',
  mug: '/images/products/mug.png',
  phonecase: '/images/products/phonecase.png',
};

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
  const mockupRef = useRef<HTMLDivElement>(null);
  const [designState, setDesignState] = useState({ x: 50, y: 48, scale: 0.8, rotation: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 50, posY: 48 });
  const [addedToCart, setAddedToCart] = useState(false);

  const addToCart = () => {
    const product = PRODUCTS.find((p) => p.id === selectedProduct);
    const cartItem = {
      name: product?.name || 'Custom Hoodie',
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

    // ── Decide endpoint: image-to-image if user uploaded a reference ──
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
        setDesignState({ x: 50, y: 48, scale: 0.8, rotation: 0 });
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

  // ── Drag-to-position effect ──
  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => {
      const el = mockupRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const dx = ((e.clientX - dragStart.current.x) / rect.width) * 100;
      const dy = ((e.clientY - dragStart.current.y) / rect.height) * 100;
      setDesignState((prev) => ({
        ...prev,
        x: Math.max(2, Math.min(98, dragStart.current.posX + dx)),
        y: Math.max(2, Math.min(98, dragStart.current.posY + dy)),
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
      'left-chest': { x: 24, y: 28, scale: 0.45, rotation: 0 },
      center:       { x: 50, y: 48, scale: 0.8,  rotation: 0 },
      full:         { x: 50, y: 48, scale: 1.7,  rotation: 0 },
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

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header />

      {/* Studio Layout — fixed-height workspace, Footer visible below on scroll */}
      <main className="h-[calc(100vh-72px)] pt-16 md:pt-[72px] flex flex-col md:flex-row relative">
        {/* ── Left Sidebar: Tools ── */}
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

              {/* ── Image Upload (Reference / Image-to-Image) ── */}
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

        {/* ── Center: Preview Stage ── */}
        <section className="flex-1 min-h-0 flex items-center justify-center p-4 pb-20 md:p-8 md:pb-24 lg:p-12 lg:pb-28 relative bg-surface-container-lowest order-1 md:order-2 overflow-hidden">
          {/* Background atmosphere */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[600px] h-[280px] md:h-[600px] bg-vivid-purple/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

          <div className="relative w-full max-w-lg lg:max-w-2xl aspect-square flex items-center justify-center">
            {/* Main Product Mockup */}
            <div ref={mockupRef} className="relative z-10 w-full h-full canvas-glow transition-all duration-700">
              <img
                alt="Product Mockup"
                className="w-full h-full object-contain drop-shadow-2xl"
                src={MOCKUP_IMAGES[selectedProduct] || MOCKUP_IMAGES.hoodie}
              />
              {/* AI Artwork Overlay — draggable, scalable, rotatable */}
              {generatedImage && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div
                    className="absolute cursor-grab active:cursor-grabbing select-none pointer-events-auto"
                    style={{
                      left: `${designState.x}%`,
                      top: `${designState.y}%`,
                      transform: `translate(-50%, -50%) scale(${designState.scale}) rotate(${designState.rotation}deg)`,
                      width: '30%',
                      aspectRatio: '1',
                      transition: isDragging ? 'none' : 'transform 0.2s ease, left 0.2s ease, top 0.2s ease',
                    }}
                    onMouseDown={(e) => {
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
                    <img
                      className="w-full h-full object-cover rounded shadow-lg ring-2 ring-vivid-purple/30"
                      src={generatedImage}
                      alt="Your design"
                      draggable={false}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Floating Tools */}
            <div className="absolute right-0 top-0 flex flex-col gap-2 md:gap-3 z-20">
              <button
                onClick={() => setDesignState((prev) => ({ ...prev, scale: Math.min(3, prev.scale + 0.15) }))}
                className="glass-panel p-2.5 md:p-3 rounded-lg text-on-surface-variant hover:text-vivid-purple transition-colors"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-sm md:text-base">zoom_in</span>
              </button>
              <button
                onClick={() => setDesignState((prev) => ({ ...prev, scale: Math.max(0.3, prev.scale - 0.15) }))}
                className="glass-panel p-2.5 md:p-3 rounded-lg text-on-surface-variant hover:text-vivid-purple transition-colors"
                title="Zoom Out"
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

          {/* Design Position Presets */}
          {generatedImage && (
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
                    (p.id === 'center' && designState.x > 35 && designState.x < 65 && designState.scale > 0.6 && designState.scale < 1.2) ||
                    (p.id === 'full' && designState.scale > 1.2)
                      ? 'bg-vivid-purple/15 border border-vivid-purple/50 text-vivid-purple'
                      : 'bg-surface/80 backdrop-blur-sm border border-outline-variant/30 text-on-surface-variant hover:border-vivid-purple hover:text-vivid-purple'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* View Swatches */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-3 md:gap-4 z-20">
            {['FRONT', 'BACK', 'DETAIL'].map((v) => (
              <button
                key={v}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center text-[9px] md:text-[10px] font-semibold transition-colors ${
                  v === 'FRONT'
                    ? 'border-vivid-purple bg-vivid-purple/5 text-vivid-purple'
                    : 'border-outline-variant/30 bg-surface text-on-surface-variant hover:border-vivid-purple'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </section>

        {/* ── Right Sidebar: Configuration ── */}
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
