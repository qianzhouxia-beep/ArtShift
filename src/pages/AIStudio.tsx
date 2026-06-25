import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Canvas, Rect, FabricImage, FabricText } from 'fabric';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const API_BASE = import.meta.env.VITE_API_URL || '';

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

type Step = 1 | 2 | 3;

interface GootenColor { name: string; hex: string; }

interface GootenProduct {
  id: string; name: string; gooten_product_id: number;
  category: string; category_name: string; icon: string;
  price: number; requires_model: boolean; default_model: string | null;
  print_placement: string; colors: GootenColor[];
  sizes: string[]; models: string[];
}

interface CatalogSummary {
  id: string; name: string; category: string; category_name: string;
  icon: string; price: number;
  color_count: number; size_count: number; model_count: number;
  default_model: string | null; requires_model: boolean;
}

interface StyleOption { id: string; name: string; image: string; }

// ═══════════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════════

const PRODUCT_THUMBNAILS: Record<string, string> = {
  'tshirt': '/images/products/tshirt.svg',
  'hoodie': '/images/products/hoodie.svg',
  'sweatshirt': '/images/products/sweatshirt.svg',
  'tank-top': '/images/products/thumbnails/tank-top.svg',
  'long-sleeve': '/images/products/thumbnails/long-sleeve.svg',
  'oversized-tee': '/images/products/thumbnails/oversized-tee.svg',
  'trucker-cap': '/images/products/thumbnails/trucker-cap.svg',
  'snapback-cap': '/images/products/thumbnails/snapback-cap.svg',
  'mug': '/images/products/mug.svg',
  'tote-bag': '/images/products/thumbnails/tote-bag.svg',
  'phone-case': '/images/products/phonecase.svg',
};

const CATEGORY_ICONS: Record<string, string> = {
  apparel: 'checkroom', headwear: 'travel_explore',
  drinkware: 'coffee', bags: 'shopping_bag', tech: 'smartphone',
};

const STYLES: StyleOption[] = [
  { id: 'cyberpunk', name: 'Cyberpunk', image: '/images/styles/style-cyberpunk.svg' },
  { id: 'anime', name: 'Anime', image: '/images/styles/style-anime.svg' },
  { id: 'oil-painting', name: 'Oil Painting', image: '/images/styles/style-oil-painting.svg' },
  { id: 'watercolor', name: 'Watercolor', image: '/images/styles/style-watercolor.svg' },
  { id: 'pixel-art', name: 'Pixel Art', image: '/images/styles/style-pixel-art.png' },
  { id: 'pencil-sketch', name: 'Pencil Sketch', image: '/images/styles/style-pencil-sketch.svg' },
];

const PRINT_AREAS: Record<string, { x: number; y: number; w: number; h: number }> = {
  hoodie: { x: 155, y: 170, w: 90, h: 100 },
  sweatshirt: { x: 155, y: 165, w: 90, h: 95 },
  tshirt: { x: 158, y: 170, w: 84, h: 88 },
  'tank-top': { x: 158, y: 180, w: 84, h: 75 },
  'long-sleeve': { x: 155, y: 170, w: 90, h: 90 },
  'oversized-tee': { x: 150, y: 170, w: 100, h: 100 },
  'trucker-cap': { x: 165, y: 245, w: 70, h: 45 },
  'snapback-cap': { x: 165, y: 245, w: 70, h: 45 },
  mug: { x: 158, y: 220, w: 84, h: 100 },
  'phone-case': { x: 148, y: 220, w: 104, h: 90 },
  'tote-bag': { x: 155, y: 120, w: 90, h: 100 },
};

const HAS_SVG_MOCKUP = new Set(Object.keys(PRINT_AREAS));

const PRESETS = {
  'left-chest': { x: 28, y: 38, scale: 0.45, rot: 0 },
  center: { x: 50, y: 50, scale: 1.0, rot: 0 },
  full: { x: 50, y: 50, scale: 1.8, rot: 0 },
};

// ═══════════════════════════════════════════════════════════════════════════
// Step Indicator
// ═══════════════════════════════════════════════════════════════════════════

function StepIndicator({ step, onStep }: { step: Step; onStep: (s: Step) => void }) {
  const steps = [
    { num: 1 as Step, label: 'Pick Product', icon: 'checkroom' },
    { num: 2 as Step, label: 'Add Design', icon: 'draw' },
    { num: 3 as Step, label: 'Preview & Order', icon: 'package_2' },
  ];

  return (
    <div className="bg-surface-container-low border-b border-outline-variant/20">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => onStep(s.num)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl transition-all ${
                step === s.num
                  ? 'bg-vivid-purple text-white shadow-sm'
                  : step > s.num
                  ? 'bg-vivid-purple/10 text-vivid-purple hover:bg-vivid-purple/20'
                  : 'bg-surface text-on-surface-variant/50 cursor-not-allowed'
              }`}
              disabled={step < s.num}
            >
              <span className="material-symbols-outlined text-lg">{s.icon}</span>
              <span className="hidden sm:inline text-[13px] font-semibold">{s.label}</span>
            </button>
            {i < 2 && (
              <div className={`w-6 sm:w-10 h-0.5 rounded ${step > s.num ? 'bg-vivid-purple' : 'bg-outline-variant/30'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Utility: render SVG product to data URL
// ═══════════════════════════════════════════════════════════════════════════

function svgToDataUrl(svgString: string): string {
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
}

function buildProductSvg(productId: string, colorHex: string): string {
  const { fill, stroke } = getTint(colorHex);
  const lightFill = adjustColor(fill, 15);
  const veryLight = adjustColor(fill, 8);

  const paths: Record<string, string> = {
    hoodie: `<ellipse cx="200" cy="470" rx="120" ry="15" fill="#000" opacity="0.08"/>
      <path d="M140 80 L100 130 L95 200 L105 200 L105 420 C105 435 115 445 130 445 L270 445 C285 445 295 435 295 420 L295 200 L305 200 L300 130 L260 80" stroke="${stroke}" stroke-width="3" fill="${fill}"/>
      <path d="M145 85 C145 50 200 30 200 30 C200 30 255 50 255 85 L260 80 L255 100 L145 100 L140 80 Z" stroke="${stroke}" stroke-width="3" fill="${lightFill}"/>
      <path d="M175 100 L170 140 M225 100 L230 140" stroke="${stroke}" stroke-width="2" fill="none"/>
      <path d="M140 80 L100 130 L115 135 L140 100" stroke="${stroke}" stroke-width="2" fill="${veryLight}"/>
      <path d="M260 80 L300 130 L285 135 L260 100" stroke="${stroke}" stroke-width="2" fill="${veryLight}"/>`,

    sweatshirt: `<ellipse cx="200" cy="470" rx="120" ry="15" fill="#000" opacity="0.08"/>
      <path d="M145 100 L110 130 L100 200 L108 200 L108 420 C108 432 118 440 132 440 L268 440 C282 440 292 432 292 420 L292 200 L300 200 L290 130 L255 100" stroke="${stroke}" stroke-width="3" fill="${fill}"/>
      <path d="M155 100 C155 75 200 65 200 65 C200 65 245 75 245 100" stroke="${stroke}" stroke-width="3" fill="${lightFill}"/>
      <path d="M162 98 C165 85 195 78 200 78 C205 78 235 85 238 98" stroke="${stroke}" stroke-width="1.5" fill="none"/>
      <path d="M145 100 L110 130 L122 138 L148 108" stroke="${stroke}" stroke-width="2" fill="${veryLight}"/>
      <path d="M255 100 L290 130 L278 138 L252 108" stroke="${stroke}" stroke-width="2" fill="${veryLight}"/>`,

    tshirt: `<ellipse cx="200" cy="470" rx="100" ry="12" fill="#000" opacity="0.08"/>
      <path d="M155 95 L120 120 L105 200 L115 200 L115 430 L285 430 L285 200 L295 200 L280 120 L245 95" stroke="${stroke}" stroke-width="3" fill="${fill}"/>
      <path d="M165 95 C165 70 200 60 200 60 C200 60 235 70 235 95" stroke="${stroke}" stroke-width="3" fill="${lightFill}"/>
      <path d="M155 95 L120 120 L133 130 L158 108" stroke="${stroke}" stroke-width="2" fill="${veryLight}"/>
      <path d="M245 95 L280 120 L267 130 L242 108" stroke="${stroke}" stroke-width="2" fill="${veryLight}"/>`,

    'tank-top': `<ellipse cx="200" cy="470" rx="90" ry="10" fill="#000" opacity="0.08"/>
      <path d="M160 95 L130 115 L115 200 L120 200 L120 430 L280 430 L280 200 L285 200 L270 115 L240 95" stroke="${stroke}" stroke-width="3" fill="${fill}"/>
      <path d="M170 95 C170 80 200 75 200 75 C200 75 230 80 230 95" stroke="${stroke}" stroke-width="2.5" fill="${lightFill}"/>
      <path d="M160 95 L137 110 M240 95 L263 110" stroke="${stroke}" stroke-width="2" fill="none"/>`,

    'long-sleeve': `<ellipse cx="200" cy="470" rx="100" ry="12" fill="#000" opacity="0.08"/>
      <path d="M90 180 L75 300 L100 300 L100 200 L115 200 L115 430 L285 430 L285 200 L300 200 L300 300 L325 300 L310 180" stroke="${stroke}" stroke-width="3" fill="${fill}"/>
      <path d="M165 95 C165 70 200 60 200 60 C200 60 235 70 235 95" stroke="${stroke}" stroke-width="3" fill="${lightFill}"/>
      <path d="M155 95 L120 120 L133 130 L158 108" stroke="${stroke}" stroke-width="2" fill="${veryLight}"/>
      <path d="M245 95 L280 120 L267 130 L242 108" stroke="${stroke}" stroke-width="2" fill="${veryLight}"/>`,

    'oversized-tee': `<ellipse cx="200" cy="470" rx="110" ry="14" fill="#000" opacity="0.08"/>
      <path d="M145 90 L105 115 L95 200 L110 200 L110 430 L290 430 L290 200 L305 200 L295 115 L255 90" stroke="${stroke}" stroke-width="3.5" fill="${fill}"/>
      <path d="M155 90 C155 60 200 50 200 50 C200 50 245 60 245 90" stroke="${stroke}" stroke-width="3" fill="${lightFill}"/>
      <path d="M145 90 L110 115 L125 128 L152 100" stroke="${stroke}" stroke-width="2.5" fill="${veryLight}"/>
      <path d="M255 90 L290 115 L275 128 L248 100" stroke="${stroke}" stroke-width="2.5" fill="${veryLight}"/>`,

    'trucker-cap': `<ellipse cx="200" cy="470" rx="100" ry="12" fill="#000" opacity="0.08"/>
      <path d="M120 220 L120 280 C120 330 150 360 200 360 C250 360 280 330 280 280 L280 220" stroke="${stroke}" stroke-width="3" fill="${fill}"/>
      <path d="M110 220 C90 240 60 250 45 265 C35 275 60 285 80 280 C100 275 120 260 130 245" stroke="${stroke}" stroke-width="3" fill="${lightFill}"/>
      <rect x="193" y="340" width="14" height="20" rx="2" fill="${adjustColor(stroke, -20)}" stroke="${stroke}" stroke-width="1"/>
      <path d="M120 220 L200 160 L280 220" stroke="${stroke}" stroke-width="2.5" fill="${veryLight}"/>`,

    mug: `<ellipse cx="200" cy="470" rx="80" ry="10" fill="#000" opacity="0.08"/>
      <path d="M140 180 L140 360 C140 390 160 410 200 410 C240 410 260 390 260 360 L260 180" stroke="${stroke}" stroke-width="3" fill="${fill}"/>
      <ellipse cx="200" cy="180" rx="60" ry="16" stroke="${stroke}" stroke-width="3" fill="${lightFill}"/>
      <path d="M260 220 C300 220 320 260 320 300 C320 340 300 370 260 370" stroke="${stroke}" stroke-width="3" fill="none"/>
      <path d="M260 240 C290 240 305 270 305 300 C305 330 290 355 260 355" stroke="${stroke}" stroke-width="1.5" fill="none"/>`,

    'phone-case': `<ellipse cx="200" cy="470" rx="80" ry="10" fill="#000" opacity="0.08"/>
      <rect x="120" y="110" width="160" height="320" rx="28" stroke="${stroke}" stroke-width="3" fill="${fill}"/>
      <rect x="134" y="130" width="132" height="260" rx="18" fill="#1A1A2E"/>
      <circle cx="200" cy="148" r="8" fill="#2C2C3E" stroke="#444" stroke-width="1"/>
      <circle cx="200" cy="148" r="4" fill="#000"/>`,

    'tote-bag': `<ellipse cx="200" cy="470" rx="100" ry="12" fill="#000" opacity="0.08"/>
      <rect x="120" y="120" width="160" height="200" rx="12" stroke="${stroke}" stroke-width="3" fill="${fill}"/>
      <rect x="175" y="100" width="50" height="30" rx="6" stroke="${stroke}" stroke-width="2" fill="${lightFill}"/>
      <path d="M200 100 L200 130" stroke="${stroke}" stroke-width="2"/>`,
  };

  const body = paths[productId] || paths.hoodie;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="400" height="500">${body}</svg>`;
}

// ═══════════════════════════════════════════════════════════════════════════
// Color utilities
// ═══════════════════════════════════════════════════════════════════════════

const COLOR_TINTS: Record<string, { fill: string; stroke: string }> = {
  '#111827': { fill: '#1a1a2e', stroke: '#2C3E50' },
  '#111111': { fill: '#1a1a20', stroke: '#2C2F33' },
  '#FFFFFF': { fill: '#f5f5f5', stroke: '#D0D5DD' },
  '#FAFAFA': { fill: '#f8f8f8', stroke: '#D0D5DD' },
  '#E5E7EB': { fill: '#e8ecf0', stroke: '#D0D5DD' },
};

function getTint(hex: string) {
  if (COLOR_TINTS[hex]) return COLOR_TINTS[hex];
  try {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    const lighten = (v: number) => Math.min(255, v + 25);
    const lr = lighten(r).toString(16).padStart(2, '0');
    const lg = lighten(g).toString(16).padStart(2, '0');
    const lb = lighten(b).toString(16).padStart(2, '0');
    return { fill: `#${lr}${lg}${lb}`, stroke: '#2C3E50' };
  } catch { return { fill: hex, stroke: '#2C3E50' }; }
}

function adjustColor(hex: string, pct: number): string {
  if (hex.startsWith('rgb')) return hex;
  const h = hex.replace('#', '');
  const r = Math.min(255, Math.max(0, parseInt(h.substring(0, 2), 16) + Math.round(pct / 100 * 255)));
  const g = Math.min(255, Math.max(0, parseInt(h.substring(2, 4), 16) + Math.round(pct / 100 * 255)));
  const b = Math.min(255, Math.max(0, parseInt(h.substring(4, 6), 16) + Math.round(pct / 100 * 255)));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════════════

export default function AIStudio() {
  // ── Step state ──
  const [step, setStep] = useState<Step>(1);

  // ── Catalog ──
  const [catalogSummary, setCatalogSummary] = useState<CatalogSummary[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [activeCategory, setActiveCategory] = useState('apparel');
  const [selectedProduct, setSelectedProduct] = useState('hoodie');
  const [currentProduct, setCurrentProduct] = useState<GootenProduct | null>(null);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState<string | null>(null);

  // ── Variant selections ──
  const [selectedColor, setSelectedColor] = useState<GootenColor>({ name: 'Black', hex: '#111111' });
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedModel, setSelectedModel] = useState('');

  // ── Design state ──
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('cyberpunk');
  const [isGenerating, setIsGenerating] = useState(false);
  const [_generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [designText, setDesignText] = useState('');

  // ── Ref ──
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fabricCanvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const bgImageRef = useRef<FabricImage | null>(null);
  const designObjectRef = useRef<FabricImage | FabricText | null>(null);

  // ── Export / Cart ──
  const [isExporting, setIsExporting] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  // ── Fetch catalog ──
  useEffect(() => { fetchCatalog(); }, []);

  // ── Fetch product details ──
  useEffect(() => {
    if (!selectedProduct) return;
    fetchProductDetails(selectedProduct);
  }, [selectedProduct]);

  // ── When going to Step 2, init Fabric canvas ──
  useEffect(() => {
    if (step !== 2 || !fabricCanvasRef.current || !currentProduct) return;
    initFabricCanvas();
    return () => {
      fabricRef.current?.dispose();
      fabricRef.current = null;
      bgImageRef.current = null;
      designObjectRef.current = null;
    };
  }, [step, currentProduct, selectedColor]);

  // ════════════════════════════════════════════════════════════════════════
  // Data Fetching
  // ════════════════════════════════════════════════════════════════════════

  const fetchCatalog = async () => {
    setCatalogLoading(true);
    setCatalogError(null);
    try {
      const res = await fetch(`${API_BASE}/api/gooten/catalog?summary=true`);
      const json = await res.json();
      if (json.ok) {
        setCatalogSummary(json.data);
        setCategories(json.categories || []);
        const first = json.data.find((p: CatalogSummary) => p.category === activeCategory);
        if (first) setSelectedProduct(first.id);
      } else {
        setCatalogError(json.error || 'Failed to load catalog');
        setCategories([
          { id: 'apparel', name: 'Apparel' }, { id: 'headwear', name: 'Headwear' },
          { id: 'drinkware', name: 'Drinkware' }, { id: 'bags', name: 'Bags' },
          { id: 'tech', name: 'Tech' },
        ]);
      }
    } catch (err: any) {
      setCatalogError('Unable to connect to backend');
    } finally { setCatalogLoading(false); }
  };

  const fetchProductDetails = async (productId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/gooten/catalog/${productId}`);
      const json = await res.json();
      if (json.ok && json.data) {
        const p: GootenProduct = json.data;
        setCurrentProduct(p);
        if (p.colors.length > 0) setSelectedColor(p.colors[0]);
        if (p.sizes.length > 0) { setSelectedSize(p.sizes.includes('M') ? 'M' : p.sizes[0]); }
        if (p.default_model) setSelectedModel(p.default_model);
        else if (p.models.length > 0) setSelectedModel(p.models[0]);
        else setSelectedModel('');
      }
    } catch (err) { console.error('Product detail error:', err); }
  };

  // ════════════════════════════════════════════════════════════════════════
  // Fabric.js Canvas
  // ════════════════════════════════════════════════════════════════════════

  const initFabricCanvas = useCallback(async () => {
    const el = fabricCanvasRef.current;
    if (!el) return;

    // Dispose existing
    fabricRef.current?.dispose();

    const canvasW = 480;
    const canvasH = 600;

    const canvas = new Canvas(el, {
      width: canvasW,
      height: canvasH,
      backgroundColor: '#f0f0f0',
      selection: false,
    });
    fabricRef.current = canvas;

    // Build product SVG and load as background
    const svgStr = buildProductSvg(selectedProduct, selectedColor.hex);
    const svgUrl = svgToDataUrl(svgStr);

    try {
      const bgImg = await FabricImage.fromURL(svgUrl, {}, { crossOrigin: 'anonymous' });
      bgImg.set({
        left: canvasW / 2,
        top: canvasH / 2,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      });
      // Scale to fit
      const scale = Math.min(canvasW / 420, canvasH / 520) * 0.92;
      bgImg.scale(scale);
      canvas.add(bgImg);
      canvas.sendObjectToBack(bgImg);
      bgImageRef.current = bgImg;

      // Draw print area guide
      const area = PRINT_AREAS[selectedProduct] || PRINT_AREAS.hoodie;
      // We need to map SVG viewBox (400x500) coords to canvas coords
      const svg2canvas = (vx: number, vy: number) => ({
        x: canvasW / 2 - (200 - vx) * (canvasW * scale / 400),
        y: canvasH / 2 - (250 - vy) * (canvasH * scale / 500),
      });

      const guide = new Rect({
        left: svg2canvas(area.x, area.y).x,
        top: svg2canvas(area.x, area.y).y,
        width: area.w * (canvasW * scale / 400),
        height: area.h * (canvasH * scale / 500),
        fill: 'rgba(139,92,246,0.06)',
        stroke: '#8B5CF6',
        strokeWidth: 1.5,
        strokeDashArray: [6, 4],
        selectable: false,
        evented: false,
      });
      canvas.add(guide);

      canvas.renderAll();
    } catch (e) {
      console.error('Failed to load product SVG:', e);
    }
  }, [selectedProduct, selectedColor]);

  const updateDesignOnCanvas = useCallback(async (imageUrl: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Remove previous design
    if (designObjectRef.current) {
      canvas.remove(designObjectRef.current);
      designObjectRef.current = null;
    }

    try {
      const img = await FabricImage.fromURL(imageUrl, {}, { crossOrigin: 'anonymous' });
      const scale = Math.min(canvas.width! / 400, canvas.height! / 500) * 0.92;
      const area = PRINT_AREAS[selectedProduct] || PRINT_AREAS.hoodie;

      // Map SVG coords to canvas
      const svg2canvas = (vx: number, vy: number) => ({
        x: canvas.width! / 2 - (200 - vx) * (canvas.width! * scale / 400),
        y: canvas.height! / 2 - (250 - vy) * (canvas.height! * scale / 500),
      });

      const printW = area.w * (canvas.width! * scale / 400);
      const printH = area.h * (canvas.height! * scale / 500);
      const pc = svg2canvas(area.x + area.w / 2, area.y + area.h / 2);

      img.set({
        left: pc.x,
        top: pc.y,
        originX: 'center',
        originY: 'center',
        hasControls: true,
        hasBorders: true,
        cornerColor: '#8B5CF6',
        cornerSize: 8,
      });

      // Scale the design to fit within the print area
      const designScale = Math.min(printW / img.width!, printH / img.height!) * 0.85;
      img.scale(designScale);

      canvas.add(img);
      canvas.setActiveObject(img);
      designObjectRef.current = img;
      canvas.renderAll();
    } catch (e) {
      console.error('Failed to add design to canvas:', e);
    }
  }, [selectedProduct]);

  // When design image changes, update canvas
  useEffect(() => {
    if (step === 2 && designImage && fabricRef.current) {
      updateDesignOnCanvas(designImage);
    }
  }, [designImage, step, updateDesignOnCanvas]);

  const handleCanvasExport = useCallback(async () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    setIsExporting(true);
    try {
      const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 3 });
      setExportUrl(dataUrl);
    } catch (e) {
      console.error('Export failed:', e);
      setError('Export failed. Please try again.');
    } finally { setIsExporting(false); }
  }, []);

  // ════════════════════════════════════════════════════════════════════════
  // Image Generation
  // ════════════════════════════════════════════════════════════════════════

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || prompt.trim().length < 3) {
      setError('Please describe your idea (at least 3 characters)');
      return;
    }
    setError(null);
    setIsGenerating(true);

    const isImg2Img = !!uploadedImage;
    const endpoint = isImg2Img
      ? `${API_BASE}/api/generation/image-to-image`
      : `${API_BASE}/api/generation/text-to-image`;
    const body = isImg2Img
      ? JSON.stringify({ image: uploadedImage, prompt: prompt.trim(), style: selectedStyle })
      : JSON.stringify({ prompt: prompt.trim(), style: selectedStyle });

    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
      const data = await res.json();
      if (data.success) {
        let imageBase64 = data.base64Images?.[0] || data.imageUrl || data.images?.[0] || '';
        if (imageBase64) {
          setGeneratedImage(imageBase64);
          setDesignImage(imageBase64);
        }
      } else {
        setError(data.error || 'Generation failed.');
      }
    } catch (err: any) {
      setError(`Connection failed: ${err?.message || 'Check backend'}`);
    } finally { setIsGenerating(false); }
  }, [prompt, selectedStyle, uploadedImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please upload an image file'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be under 10MB'); return; }
    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setUploadedImage(dataUrl);
      setDesignImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // ════════════════════════════════════════════════════════════════════════
  // Cart
  // ════════════════════════════════════════════════════════════════════════

  const addToCart = () => {
    const cartItem = {
      name: currentProduct?.name || 'Custom Product',
      size: selectedSize,
      color: selectedColor?.name || 'Black',
      colorHex: selectedColor?.hex || '#111111',
      price: currentProduct?.price || 49.99,
      image: exportUrl || designImage || null,
      productId: selectedProduct,
      model: selectedModel || undefined,
    };
    localStorage.setItem('artshift_cart', JSON.stringify(cartItem));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const downloadExport = () => {
    if (!exportUrl) return;
    const a = document.createElement('a');
    a.href = exportUrl;
    a.download = `artshift-${selectedProduct}-${Date.now()}.png`;
    a.click();
  };

  // ════════════════════════════════════════════════════════════════════════
  // Computed
  // ════════════════════════════════════════════════════════════════════════

  const filteredCatalog = useMemo(
    () => catalogSummary.filter(p => p.category === activeCategory),
    [catalogSummary, activeCategory]
  );
  const displayPrice = currentProduct?.price || 49.99;
  const hasSvgMockup = HAS_SVG_MOCKUP.has(selectedProduct);

  // ════════════════════════════════════════════════════════════════════════
  // Render
  // ════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <Header />
      <StepIndicator step={step} onStep={setStep} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* ── STEP 1: Pick Product ── */}
        {step === 1 && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-on-surface mb-2">
                  Choose a Product to Customize
                </h1>
                <p className="text-on-surface-variant text-sm sm:text-base">
                  Select the product you want to design. All colors, sizes, and styles are real factory options.
                </p>
              </div>

              {/* Category Tabs */}
              <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-1 no-scrollbar">
                {(categories.length > 0 ? categories : [
                  { id: 'apparel', name: 'Apparel' }, { id: 'headwear', name: 'Headwear' },
                  { id: 'drinkware', name: 'Drinkware' }, { id: 'bags', name: 'Bags' },
                  { id: 'tech', name: 'Tech' },
                ]).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); }}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                      activeCategory === cat.id
                        ? 'bg-vivid-purple text-white shadow-sm'
                        : 'bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:border-vivid-purple/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {CATEGORY_ICONS[cat.id] || 'category'}
                    </span>
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* Product Grid */}
              {catalogLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="aspect-[4/3] bg-surface-container-lowest rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : catalogError ? (
                <div className="text-center py-12 text-error">{catalogError}</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {filteredCatalog.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProduct(p.id)}
                      className={`group relative flex flex-col p-3 sm:p-4 rounded-2xl transition-all duration-300 border-2 ${
                        selectedProduct === p.id
                          ? 'border-vivid-purple bg-vivid-purple/5 shadow-lg shadow-vivid-purple/10 ring-2 ring-vivid-purple/20'
                          : 'border-outline-variant/20 hover:border-vivid-purple/40 hover:bg-surface-container-low hover:shadow-md'
                      }`}
                    >
                      <div className="w-full aspect-[4/3] rounded-xl bg-surface-container-lowest overflow-hidden mb-3 flex items-center justify-center p-2">
                        <img
                          src={PRODUCT_THUMBNAILS[p.id] || `/images/products/${p.id}.svg`}
                          alt={p.name}
                          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <span className={`text-sm font-semibold leading-tight text-center ${
                        selectedProduct === p.id ? 'text-vivid-purple' : 'text-on-surface'
                      }`}>
                        {p.name}
                      </span>
                      <span className="text-xs text-outline mt-0.5 text-center">
                        {p.color_count} colors
                        {p.size_count > 0 ? ` \u00B7 ${p.size_count} sizes` : ''}
                      </span>
                      <span className="text-sm font-semibold text-on-surface mt-1 text-center">
                        ${p.price.toFixed(2)}
                      </span>
                      {selectedProduct === p.id && (
                        <div className="absolute top-2 right-2 bg-vivid-purple text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Product Preview Card */}
              {currentProduct && (
                <div className="mt-8 p-5 sm:p-6 bg-surface-container-low rounded-2xl border border-outline-variant/20 flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-40 h-52 shrink-0 bg-surface-container-lowest rounded-xl flex items-center justify-center overflow-hidden">
                    <img
                      src={PRODUCT_THUMBNAILS[selectedProduct] || `/images/products/${selectedProduct}.svg`}
                      alt={currentProduct.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl font-bold text-on-surface">{currentProduct.name}</h2>
                    <p className="text-on-surface-variant text-sm mt-1">
                      {currentProduct.colors.length} colors &middot;
                      {currentProduct.sizes.length > 0 ? ` ${currentProduct.sizes.join(', ')}` : ' One Size'}
                      {currentProduct.models.length > 0 && ` \u00B7 ${currentProduct.models.length} styles`}
                    </p>
                    <p className="text-lg font-bold text-vivid-purple mt-2">${displayPrice.toFixed(2)}</p>
                    <button
                      onClick={() => { setDesignImage(null); setExportUrl(null); setGeneratedImage(null); setStep(2); }}
                      className="mt-4 bg-vivid-purple hover:bg-primary-container text-white font-semibold px-8 py-3 rounded-xl transition-all active:scale-95 flex items-center gap-2 mx-auto sm:mx-0"
                    >
                      Continue to Design
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 2: Add Design ── */}
        {step === 2 && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left: Design Tools */}
            <aside className="w-full lg:w-80 xl:w-96 bg-surface-container-low/50 border-b lg:border-b-0 lg:border-r border-outline-variant/20 overflow-y-auto">
              <div className="p-4 lg:p-6 space-y-5">

                {/* Product Info */}
                <div>
                  <h2 className="text-lg font-bold text-on-surface">{currentProduct?.name}</h2>
                  <p className="text-sm text-on-surface-variant">
                    <span className="inline-block w-4 h-4 rounded-full align-middle mr-1.5 border" style={{ backgroundColor: selectedColor.hex }} />
                    {selectedColor.name}
                    {currentProduct && currentProduct.sizes.length > 0 && ` \u00B7 ${selectedSize}`}
                    {selectedModel && ` \u00B7 ${selectedModel}`}
                  </p>
                </div>

                <hr className="border-outline-variant/20" />

                {/* AI Generation */}
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                    AI Generate
                  </h3>
                  <textarea
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 focus:border-vivid-purple focus:outline-none text-on-surface text-sm p-3 rounded-xl resize-none"
                    placeholder="Describe your design... (e.g., A neon cyberpunk wolf)"
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    rows={3}
                  />
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {STYLES.slice(0, 4).map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedStyle(s.id)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          selectedStyle === s.id
                            ? 'border-vivid-purple bg-vivid-purple/10 text-vivid-purple'
                            : 'border-outline-variant/30 text-on-surface-variant hover:border-vivid-purple/50'
                        }`}
                      >{s.name}</button>
                    ))}
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || prompt.trim().length < 3}
                    className="w-full mt-3 bg-vivid-purple hover:bg-primary-container text-white font-semibold py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                    {isGenerating ? 'Generating...' : 'Generate Design'}
                  </button>
                </section>

                <hr className="border-outline-variant/20" />

                {/* Upload */}
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                    Upload Design
                  </h3>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-outline-variant/40 hover:border-vivid-purple/60 rounded-xl p-4 transition-all flex flex-col items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-2xl text-on-surface-variant">upload</span>
                    <span className="text-xs text-on-surface-variant">Click to upload (PNG, JPG)</span>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  {uploadedImage && (
                    <div className="mt-2 relative rounded-lg overflow-hidden border border-vivid-purple/40">
                      <img src={uploadedImage} alt="Uploaded" className="w-full h-20 object-cover" />
                    </div>
                  )}
                </section>

                <hr className="border-outline-variant/20" />

                {/* Text */}
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                    Add Text
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={designText}
                      onChange={e => setDesignText(e.target.value)}
                      placeholder="Your text..."
                      className="flex-1 bg-surface-container-lowest border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:border-vivid-purple focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (!designText.trim() || !fabricRef.current) return;
                        const canvas = fabricRef.current;
                        const text = new FabricText(designText.trim(), {
                          left: canvas.width! / 2,
                          top: canvas.height! / 2,
                          originX: 'center',
                          originY: 'center',
                          fontSize: 32,
                          fill: '#111',
                          fontWeight: 'bold',
                          fontFamily: 'Arial, sans-serif',
                        });
                        canvas.add(text);
                        canvas.setActiveObject(text);
                        designObjectRef.current = text;
                        canvas.renderAll();
                      }}
                      className="bg-surface-container-lowest border border-outline-variant/30 hover:border-vivid-purple px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </section>

                <hr className="border-outline-variant/20" />

                {/* Position Presets */}
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                    Position
                  </h3>
                  <div className="flex gap-2">
                    {Object.entries(PRESETS).map(([key, preset]) => (
                      <button
                        key={key}
                        onClick={() => {
                          const obj = designObjectRef.current;
                          if (!obj || !fabricRef.current) return;
                          const cw = fabricRef.current.width!;
                          const ch = fabricRef.current.height!;
                          obj.set({
                            left: (preset.x / 100) * cw,
                            top: (preset.y / 100) * ch,
                            scaleX: preset.scale,
                            scaleY: preset.scale,
                            angle: preset.rot,
                          });
                          fabricRef.current.renderAll();
                        }}
                        className="flex-1 px-2 py-1.5 rounded-lg text-xs font-semibold border border-outline-variant/30 hover:border-vivid-purple hover:text-vivid-purple transition-colors text-center capitalize"
                      >{key.replace('-', ' ')}</button>
                    ))}
                  </div>
                </section>

                {error && <p className="text-error text-xs">{error}</p>}
              </div>
            </aside>

            {/* Center: Fabric.js Canvas */}
            <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-surface-container-lowest relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 lg:w-96 h-72 lg:h-96 bg-vivid-purple/5 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative w-full max-w-[480px] aspect-[4/5] max-h-full rounded-2xl shadow-2xl overflow-hidden bg-white border border-outline-variant/10">
                <canvas ref={fabricCanvasRef} className="w-full h-full" />
              </div>

              {/* Design status indicator */}
              {designImage && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-vivid-purple text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Design applied
                  <span className="text-white/60 mx-1">\u00B7</span>
                  Drag to position, use corners to resize
                </div>
              )}
            </div>

            {/* Right: Quick Preview & Next */}
            <aside className="w-full lg:w-72 xl:w-80 bg-surface-container-low/50 border-t lg:border-t-0 lg:border-l border-outline-variant/20 p-4 lg:p-6 flex flex-col gap-4 overflow-y-auto">
              <h3 className="text-sm font-semibold text-on-surface">Design Preview</h3>

              <div className="flex-1 flex items-center justify-center bg-surface-container-lowest rounded-xl p-4 min-h-[200px]">
                {designImage ? (
                  <img src={designImage} alt="Design" className="max-w-full max-h-full object-contain rounded-lg" />
                ) : (
                  <div className="text-center text-on-surface-variant/50">
                    <span className="material-symbols-outlined text-4xl block mb-2">imagesmode</span>
                    <p className="text-xs">Upload or generate a design to preview</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => { handleCanvasExport(); setStep(3); }}
                disabled={!designImage}
                className="w-full bg-vivid-purple hover:bg-primary-container text-white font-semibold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Preview
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full text-sm text-on-surface-variant hover:text-vivid-purple transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Change Product
              </button>
            </aside>
          </div>
        )}

        {/* ── STEP 3: Preview & Order ── */}
        {step === 3 && (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Review Your Design</h1>
                <p className="text-on-surface-variant text-sm mt-1">Final check before ordering</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Mockup Preview */}
                <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden">
                  <div className="aspect-[4/5] flex items-center justify-center p-4 relative">
                    {exportUrl ? (
                      <img src={exportUrl} alt="Product mockup" className="max-w-full max-h-full object-contain rounded-xl" />
                    ) : designImage ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                        {hasSvgMockup && (
                          <div className="w-full h-full flex items-center justify-center">
                            <div
                              className="relative"
                              dangerouslySetInnerHTML={{
                                __html: buildProductSvg(selectedProduct, selectedColor.hex)
                              }}
                              style={{ width: 400, height: 500, maxWidth: '100%' }}
                            />
                            <img
                              src={designImage}
                              alt="Design overlay"
                              className="absolute"
                              style={{
                                maxWidth: '30%',
                                maxHeight: '30%',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                borderRadius: 8,
                              }}
                            />
                          </div>
                        )}
                        {!hasSvgMockup && (
                          <div className="text-center">
                            <img src={designImage} alt="Design" className="max-w-64 max-h-64 object-contain rounded-xl mx-auto" />
                            <p className="text-xs text-on-surface-variant mt-2">Design will be printed on {currentProduct?.name}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-on-surface-variant/50">Generating preview...</p>
                    )}
                    {isExporting && (
                      <div className="absolute inset-0 bg-surface/60 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                        <div className="flex items-center gap-2 text-vivid-purple">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 bg-vivid-purple rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 bg-vivid-purple rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1.5 h-1.5 bg-vivid-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="space-y-5">
                  {/* Product Info */}
                  <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20">
                    <h2 className="text-lg font-bold text-on-surface">{currentProduct?.name}</h2>
                    {currentProduct && (
                      <p className="text-xs text-outline mt-1">Gooten ID: {currentProduct.gooten_product_id}</p>
                    )}
                  </div>

                  {/* Color Selection */}
                  {currentProduct && currentProduct.colors.length > 0 && (
                    <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20">
                      <h3 className="text-sm font-semibold text-on-surface mb-3">
                        Color <span className="text-xs text-on-surface-variant">({currentProduct.colors.length} options)</span>
                      </h3>
                      <div className="flex flex-wrap gap-2.5">
                        {currentProduct.colors.map(c => (
                          <button
                            key={c.name}
                            title={c.name}
                            onClick={() => setSelectedColor(c)}
                            className={`w-9 h-9 rounded-full border-2 transition-all ${
                              selectedColor.name === c.name
                                ? 'border-vivid-purple ring-2 ring-vivid-purple/20 scale-110'
                                : 'border-outline-variant/30 hover:scale-105'
                            }`}
                            style={{ backgroundColor: c.hex }}
                          >
                            {selectedColor.name === c.name && (
                              <span className="flex items-center justify-center h-full">
                                <span className="material-symbols-outlined text-xs text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Size Selection */}
                  {currentProduct && currentProduct.sizes.length > 0 && (
                    <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20">
                      <h3 className="text-sm font-semibold text-on-surface mb-3">Size</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {currentProduct.sizes.map(s => (
                          <button
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className={`h-10 border rounded-lg text-xs font-semibold transition-all ${
                              selectedSize === s
                                ? 'border-2 border-vivid-purple bg-vivid-purple/10 text-vivid-purple'
                                : 'border-outline-variant/30 text-on-surface-variant hover:border-vivid-purple/50'
                            }`}
                          >{s}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Model */}
                  {currentProduct && currentProduct.models.length > 0 && (
                    <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20">
                      <h3 className="text-sm font-semibold text-on-surface mb-3">Style</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentProduct.models.map(m => (
                          <button
                            key={m}
                            onClick={() => setSelectedModel(m)}
                            className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                              selectedModel === m
                                ? 'border-vivid-purple bg-vivid-purple/5 text-vivid-purple'
                                : 'border-outline-variant/20 text-on-surface-variant hover:border-vivid-purple/40'
                            }`}
                          >{m}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price + Actions */}
                  <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-on-surface-variant">Unit Price</span>
                      <span className="text-xl font-bold text-on-surface">${displayPrice.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={handleCanvasExport}
                      disabled={isExporting}
                      className="w-full border-2 border-outline-variant/30 hover:border-vivid-purple font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-on-surface"
                    >
                      <span className="material-symbols-outlined">download</span>
                      {isExporting ? 'Exporting...' : 'Download Preview'}
                    </button>

                    {exportUrl && (
                      <button
                        onClick={downloadExport}
                        className="w-full bg-surface-container-highest hover:bg-surface-bright font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-on-surface text-sm"
                      >
                        <span className="material-symbols-outlined">save_alt</span>
                        Save PNG File
                      </button>
                    )}

                    <button
                      onClick={addToCart}
                      className={`w-full font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 ${
                        addedToCart
                          ? 'bg-green-600 text-white'
                          : 'bg-vivid-purple hover:bg-primary-container text-white shadow-lg shadow-vivid-purple/20'
                      }`}
                    >
                      {addedToCart ? (
                        <><span className="material-symbols-outlined">check_circle</span> Added to Cart</>
                      ) : (
                        <><span className="material-symbols-outlined">shopping_cart</span> Add to Cart</>
                      )}
                    </button>

                    <button
                      onClick={() => setStep(2)}
                      className="w-full text-sm text-on-surface-variant hover:text-vivid-purple transition-colors flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      Back to Design
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
