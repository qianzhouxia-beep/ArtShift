import { useState, useEffect } from 'react';
import { ShoppingCart, Loader2, AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
interface ProductVariant {
  id: number | string;
  name: string;
  size: string;
  color: string;
  price: number | null;
  available: boolean;
}

interface Product {
  id: number;
  name: string;
  thumbnail: string | null;
  retail_price: number | null;
  currency: string;
  mockups: string[];
  variants: ProductVariant[];
}

interface Props {
  designUrl?: string | null;
  onSelectProduct: (product: Product) => void;
  onBack: () => void;
  t: (key: string) => string;
}

// ─── API Config ───────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'https://artshift-backend.zeabur.app/api';
const BACKUP_DATA_URL = '/data/products.json';

// ─── Currency Formatter ───────────────────────────────────────
const fmt = (price: number | null, currency = 'USD') => {
  if (price == null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
};

// ─── Component ─────────────────────────────────────────────────
export default function ProductShowcase({ designUrl, onSelectProduct, onBack, t }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [source, setSource] = useState<'api' | 'local' | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    // Try backend API first
    try {
      const res = await fetch(`${API_URL}/printful/products`);
      if (res.ok) {
        const data = await res.json();
        // Transform Printful response to our Product type
        const mapped = Array.isArray(data)
          ? data.map(mapProduct)
          : (data?.result || data?.data || []).map(mapProduct);

        if (mapped.length > 0) {
          setProducts(mapped);
          setSource('api');
          setLoading(false);
          return;
        }
      }
      console.warn('[ProductShowcase] API returned empty or failed, falling back to local data');
    } catch (err) {
      console.warn('[ProductShowcase] API unreachable, falling back to local data:', err);
    }

    // Fallback to local JSON
    try {
      const res = await fetch(BACKUP_DATA_URL);
      if (res.ok) {
        const data: Product[] = await res.json();
        setProducts(data);
        setSource('local');
      } else {
        throw new Error('Local data not found');
      }
    } catch (err) {
      setError('Unable to load products. Please check your connection and try again.');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleBuy = (product: Product) => {
    setSelectedId(product.id);
    onSelectProduct(product);
  };

  // ─── Loading State ──────────────────────────────────────
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin mx-auto mb-4 text-violet-500" />
          <p className="text-gray-500 text-sm">Loading products...</p>
        </div>
      </section>
    );
  }

  // ─── Error State ────────────────────────────────────────
  if (error) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <p className="text-gray-700 font-semibold mb-2">Failed to Load Products</p>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </section>
    );
  }

  // ─── Products Grid ──────────────────────────────────────
  return (
    <section className="min-h-screen py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">{t('backToHome') || 'Back'}</span>
          </button>
          <div className="flex-1" />
          {source === 'local' && (
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Using cached data
            </span>
          )}
        </div>

        {/* Design preview banner */}
        {designUrl && (
          <div className="mb-12 rounded-3xl overflow-hidden border border-violet-100 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-md flex-shrink-0 border-2 border-white">
                <img src={designUrl} alt="Your design" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="text-[10px] font-bold uppercase tracking-widest text-violet-600 mb-1">Your design</div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Print it on a product</h3>
                <p className="text-gray-500 text-sm">Select a product below to see your design printed on it.</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-violet-50 text-violet-600">
            Printful Products
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
            Choose Your <span className="gradient-text">Product</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
            Select a product to customize with your AI-generated design.
            All products are printed on demand and shipped worldwide.
          </p>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400">No products available yet. Run the extraction script first.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                designUrl={designUrl}
                isSelected={selectedId === product.id}
                onBuy={() => handleBuy(product)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Product Card ──────────────────────────────────────────────
function ProductCard({
  product,
  designUrl,
  isSelected,
  onBuy,
}: {
  product: Product;
  designUrl?: string | null;
  isSelected: boolean;
  onBuy: () => void;
}) {
  const hasMockup = product.mockups.length > 0;
  const mockupUrl = hasMockup ? product.mockups[0] : (product.thumbnail || null);
  const variantCount = product.variants.length;
  const availableVariants = product.variants.filter((v) => v.available);

  return (
    <div
      className={`rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white border ${
        isSelected ? 'border-violet-400 shadow-lg shadow-violet-100' : 'border-gray-100'
      }`}
    >
      {/* Mockup Image */}
      <div className="aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
        {mockupUrl ? (
          <img
            src={mockupUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : designUrl ? (
          <div className="w-full h-full relative bg-gray-100">
            <img
              src={product.thumbnail || product.mockups[0] || ''}
              alt=""
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <img
                src={designUrl}
                alt="Design preview"
                className="max-w-[70%] max-h-[70%] object-contain rounded-lg shadow-lg border-2 border-white"
              />
            </div>
          </div>
        ) : (
          <div className="text-center p-6">
            <div className="text-6xl mb-3 opacity-30">
              {product.name.toLowerCase().includes('hoodie')
                ? '🧥'
                : product.name.toLowerCase().includes('mug')
                  ? '☕'
                  : product.name.toLowerCase().includes('cap')
                    ? '🧢'
                    : product.name.toLowerCase().includes('case')
                      ? '📱'
                      : '👕'}
            </div>
            <p className="text-xs text-gray-400">Mockup coming soon</p>
          </div>
        )}
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
          <span className="text-sm font-bold text-violet-600">
            {fmt(product.retail_price, product.currency)}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 sm:p-6">
        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1">{product.name}</h3>

        {/* Variant Preview */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {product.variants.slice(0, 5).map((v, i) => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full border-2 ${
                v.available ? 'border-gray-200' : 'border-red-200 opacity-50'
              }`}
              style={{ backgroundColor: v.color || '#ccc' }}
              title={`${v.name} — ${v.available ? 'Available' : 'Unavailable'}`}
            />
          ))}
          {variantCount > 5 && (
            <span className="text-[10px] text-gray-400 self-center ml-1">+{variantCount - 5}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-500">
            {availableVariants.length} / {variantCount} variants available
          </span>
        </div>

        {/* Buy Button */}
        <button
          onClick={onBuy}
          disabled={availableVariants.length === 0}
          className="w-full mt-4 rounded-xl px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        >
          <ShoppingCart size={16} />
          {availableVariants.length === 0 ? 'Out of Stock' : 'Customize & Buy'}
        </button>
      </div>
    </div>
  );
}

// ─── Helper: Map Printful API response to Product type ──────────
function mapProduct(raw: any): Product {
  // Handle different API response structures
  const syncProduct = raw.sync_product || raw;
  const variants = (raw.sync_variants || syncProduct.variants || []).map((v: any) => ({
    id: v.variant_id || v.id,
    name: v.name || '',
    size: v.size || '',
    color: v.color || '',
    price: v.retail_price ?? null,
    available: v.availability_status !== 'discontinued',
  }));

  const mockups: string[] = [];
  const seen = new Set<string>();
  for (const v of raw.sync_variants || syncProduct.variants || []) {
    for (const f of v.files || []) {
      const url = f.preview_url || f.thumbnail_url;
      if (url && !seen.has(url)) {
        seen.add(url);
        mockups.push(url);
      }
    }
  }

  return {
    id: syncProduct.id || raw.id,
    name: syncProduct.name || raw.name || `Product #${syncProduct.id || raw.id}`,
    thumbnail: syncProduct.thumbnail_url || raw.thumbnail_url || null,
    retail_price: syncProduct.retail_price ?? raw.retail_price ?? null,
    currency: syncProduct.currency || raw.currency || 'USD',
    mockups,
    variants,
  };
}
