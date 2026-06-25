import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const API_BASE = import.meta.env.VITE_API_URL || '';

// ── Types ──────────────────────────────────────────────────────────────────

interface GootenColor {
  name: string;
  hex: string;
}

interface ProductDetail {
  id: string;
  name: string;
  gooten_product_id: number;
  category: string;
  category_name: string;
  icon: string;
  price: number;
  gooten_cost: number;
  requires_model: boolean;
  default_model: string | null;
  print_placement: string;
  colors: GootenColor[];
  sizes: string[];
  models: string[];
}

// ── Product image map ──────────────────────────────────────────────────────
const PRODUCT_IMAGE: Record<string, string> = {
  tshirt: '/images/products/tshirt.svg',
  hoodie: '/images/products/hoodie.svg',
  sweatshirt: '/images/products/sweatshirt.svg',
  mug: '/images/products/mug.svg',
  'tote-bag': '/images/products/bag.png',
  'phone-case': '/images/products/phonecase.svg',
  'tank-top': '',
  'long-sleeve': '',
  'oversized-tee': '',
  'trucker-cap': '/images/products/hat.svg',
  'snapback-cap': '/images/products/hat.svg',
};

// ── Category display ───────────────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, string> = {
  apparel: 'checkroom',
  headwear: 'travel_explore',
  drinkware: 'coffee',
  bags: 'shopping_bag',
  tech: 'smartphone',
};

const CATEGORY_NAMES: Record<string, string> = {
  apparel: 'Apparel',
  headwear: 'Headwear',
  drinkware: 'Drinkware',
  bags: 'Bags',
  tech: 'Tech',
};

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedColor, setSelectedColor] = useState<GootenColor | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');

  useEffect(() => {
    if (!productId) return;
    fetchProduct(productId);
  }, [productId]);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/gooten/catalog/${id}`);
      const json = await res.json();
      if (json.ok && json.data) {
        const p: ProductDetail = json.data;
        setProduct(p);
        // Defaults
        if (p.colors.length > 0) setSelectedColor(p.colors[0]);
        if (p.sizes.length > 0) {
          setSelectedSize(p.sizes.includes('M') ? 'M' : p.sizes[0]);
        }
      } else {
        setError(json.error || 'Product not found');
        setProduct(null);
      }
    } catch (err: any) {
      console.error('Product detail fetch error:', err);
      setError('Unable to load product details.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!product) return;
    const cartItem = {
      name: product.name,
      size: selectedSize || undefined,
      color: selectedColor?.name || undefined,
      colorHex: selectedColor?.hex || undefined,
      price: product.price,
      image: null,
      productId: product.id,
      model: product.default_model || undefined,
    };
    localStorage.setItem('artshift_cart', JSON.stringify(cartItem));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const image = productId ? PRODUCT_IMAGE[productId] : null;

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-surface text-on-surface">
        <Header />
        <main className="pt-24 md:pt-32 pb-16">
          <div className="max-w-[960px] mx-auto px-4 md:px-6">
            <div className="animate-pulse space-y-6">
              <div className="h-6 bg-surface-container-high rounded w-1/4" />
              <div className="h-10 bg-surface-container-high rounded w-1/2" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square bg-surface-container-high rounded-2xl" />
                <div className="space-y-4">
                  <div className="h-8 bg-surface-container-high rounded w-2/3" />
                  <div className="h-6 bg-surface-container-high rounded w-1/3" />
                  <div className="h-24 bg-surface-container-high rounded" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Error / Not Found ──
  if (error || !product) {
    return (
      <div className="min-h-screen bg-surface text-on-surface">
        <Header />
        <main className="pt-24 md:pt-32 pb-16">
          <div className="max-w-[960px] mx-auto px-4 md:px-6 text-center py-16">
            <span className="material-symbols-outlined text-5xl text-outline mb-4">
              {error ? 'error_outline' : 'search_off'}
            </span>
            <h2 className="text-headline-md text-on-surface mb-2">
              {error || 'Product Not Found'}
            </h2>
            <p className="text-on-surface-variant mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-vivid-purple text-white rounded-xl font-bold hover:bg-primary transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Products
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header />

      <main className="pt-24 md:pt-32 pb-16 md:pb-20">
        <div className="max-w-[960px] mx-auto px-4 md:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-6">
            <Link to="/products" className="hover:text-vivid-purple transition-colors">Products</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link
              to={`/products?category=${product.category}`}
              className="hover:text-vivid-purple transition-colors"
            >
              {product.category_name}
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface">{product.name}</span>
          </nav>

          {/* Product detail grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* ── Left: Product Image ── */}
            <div>
              <div className="aspect-square bg-white rounded-2xl overflow-hidden flex items-center justify-center p-8 border border-outline-variant/20 shadow-sm">
                {image ? (
                  <img
                    alt={product.name}
                    className="w-full h-full object-contain"
                    src={image}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-outline gap-4">
                    <span className="material-symbols-outlined text-[96px] opacity-20">
                      {CATEGORY_ICONS[product.category] || 'category'}
                    </span>
                    <span className="text-on-surface-variant text-body-lg">{product.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right: Product Info ── */}
            <div className="flex flex-col justify-center">
              {/* Category badge */}
              <span className="inline-flex items-center gap-1.5 bg-surface-container-high text-on-surface-variant text-label-sm px-3 py-1.5 rounded-full w-fit mb-3">
                <span className="material-symbols-outlined text-[16px]">
                  {CATEGORY_ICONS[product.category] || 'category'}
                </span>
                {product.category_name}
              </span>

              {/* Name & Price */}
              <h1 className="text-display-sm md:text-display-md font-extrabold mb-2">{product.name}</h1>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-vivid-purple font-extrabold text-2xl">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-on-surface-variant text-label-sm">
                  Gooten ID: {product.gooten_product_id}
                </span>
              </div>

              {/* Colors */}
              {product.colors.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-label-lg font-semibold text-on-surface mb-3">
                    Color{product.colors.length > 1 ? 's' : ''} ({product.colors.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 text-label-sm ${
                          selectedColor?.name === c.name
                            ? 'border-vivid-purple bg-vivid-purple/5 text-on-surface'
                            : 'border-outline-variant/30 text-on-surface-variant hover:border-outline'
                        }`}
                        title={c.name}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 flex-shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes.length > 0 && (
                <div className="mb-5">
                  <h3 className="text-label-lg font-semibold text-on-surface mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 rounded-lg border-2 font-semibold text-label-md transition-all duration-200 ${
                          selectedSize === s
                            ? 'border-vivid-purple bg-vivid-purple text-white'
                            : 'border-outline-variant/30 text-on-surface-variant hover:border-outline'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Models (if applicable) */}
              {product.models.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-label-lg font-semibold text-on-surface mb-3">
                    Model{product.models.length > 1 ? 's' : ''} ({product.models.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.models.map((m) => (
                      <span
                        key={m}
                        className="px-3 py-1.5 bg-surface-container-low rounded-lg text-label-sm text-on-surface-variant border border-outline-variant/20"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Print placement info */}
              <div className="flex items-center gap-2 text-label-sm text-on-surface-variant mb-6">
                <span className="material-symbols-outlined text-[16px]">print</span>
                Print placement: <span className="font-semibold text-on-surface capitalize">{product.print_placement.replace('-', ' ')}</span>
              </div>

              {/* ── Action Buttons ── */}
              <div className="space-y-3">
                {/* Design This — main CTA */}
                <Link
                  to={`/studio?product=${product.id}`}
                  className="w-full py-4 bg-vivid-purple text-white font-bold rounded-xl hover:bg-primary transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-md"
                >
                  <span className="material-symbols-outlined text-[20px]">brush</span>
                  Design This Product
                </Link>

                {/* Quick Add to Cart */}
                <button
                  onClick={addToCart}
                  className={`w-full py-4 border-2 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 ${
                    addedToCart
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : 'border-outline-variant text-on-surface-variant hover:border-vivid-purple hover:text-vivid-purple'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {addedToCart ? 'check_circle' : 'shopping_cart'}
                  </span>
                  {addedToCart ? 'Added to Cart!' : 'Add to Cart — Blank'}
                </button>
              </div>

              {/* Price breakdown */}
              <p className="text-on-surface-variant text-label-xs mt-4 text-center">
                Add your design in AI Studio, or buy blank now
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
