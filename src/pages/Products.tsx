import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const API_BASE = import.meta.env.VITE_API_URL || '';

// ── Types ──────────────────────────────────────────────────────────────────

interface CatalogItem {
  id: string;
  name: string;
  category: string;
  category_name: string;
  icon: string;
  price: number;
  color_count: number;
  size_count: number;
  model_count: number;
  default_model: string | null;
  requires_model: boolean;
}

interface CategoryInfo {
  id: string;
  name: string;
}

// ── Product image map ──────────────────────────────────────────────────────
const PRODUCT_IMAGE: Record<string, string> = {
  tshirt: '/images/products/tshirt.svg',
  hoodie: '/images/products/hoodie.svg',
  sweatshirt: '/images/products/sweatshirt.svg',
  mug: '/images/products/mug.svg',
  'tote-bag': '/images/products/thumbnails/tote-bag.svg',
  'phone-case': '/images/products/phonecase.svg',
  'tank-top': '/images/products/thumbnails/tank-top.svg',
  'long-sleeve': '/images/products/thumbnails/long-sleeve.svg',
  'oversized-tee': '/images/products/thumbnails/oversized-tee.svg',
  'trucker-cap': '/images/products/thumbnails/trucker-cap.svg',
  'snapback-cap': '/images/products/thumbnails/snapback-cap.svg',
};

// ── Category display helpers ───────────────────────────────────────────────
const CATEGORY_ICONS: Record<string, string> = {
  apparel: 'checkroom',
  headwear: 'travel_explore',
  drinkware: 'coffee',
  bags: 'shopping_bag',
  tech: 'smartphone',
};

export default function Products() {
  // ── State ──
  const [products, setProducts] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch catalog on mount ──
  useEffect(() => {
    fetchCatalog();
  }, []);

  const fetchCatalog = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/gooten/catalog?summary=true`);
      const json = await res.json();
      if (json.ok) {
        setProducts(json.data);
        setCategories(json.categories || []);
      } else {
        setError(json.error || 'Failed to load products');
      }
    } catch (err: any) {
      console.error('Catalog fetch error:', err);
      setError('Unable to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // ── Filter by category ──
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  // ── Product image helper ──
  const getProductImage = (product: CatalogItem): string | null => {
    return PRODUCT_IMAGE[product.id] || null;
  };

  // ── Subtitle helper ──
  const getSubtitle = (p: CatalogItem): string => {
    const parts: string[] = [];
    if (p.color_count > 0) parts.push(`${p.color_count} colors`);
    if (p.size_count > 0) parts.push(`${p.size_count} sizes`);
    if (p.model_count > 0) parts.push(`${p.model_count} models`);
    return parts.join(' · ') || 'Custom';
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header />

      <main className="pt-24 md:pt-32 pb-16 md:pb-20">
        {/* Hero */}
        <header className="max-w-[1280px] mx-auto px-4 md:px-6 mb-8 md:mb-12 text-center">
          <h1 className="text-headline-lg-mobile md:text-headline-xl font-extrabold mb-4 text-on-surface">
            Choose Your Canvas
          </h1>
          <p className="text-on-surface-variant text-body-md md:text-body-lg max-w-2xl mx-auto px-4">
            Transform high-end apparel and lifestyle goods into unique masterpieces.
            Select a base object to begin your generative design journey.
          </p>
        </header>

        {/* Loading state */}
        {loading && (
          <div className="max-w-[1280px] mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-surface-container-low rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-square bg-surface-container-high" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-surface-container-high rounded w-2/3" />
                    <div className="h-4 bg-surface-container-high rounded w-1/2" />
                    <div className="h-12 bg-surface-container-high rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="max-w-[1280px] mx-auto px-4 md:px-6 text-center py-16">
            <span className="material-symbols-outlined text-5xl text-outline mb-4">error_outline</span>
            <p className="text-on-surface-variant text-body-lg mb-4">{error}</p>
            <button
              onClick={fetchCatalog}
              className="px-6 py-3 bg-vivid-purple text-white rounded-xl font-bold hover:bg-primary transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Category tabs */}
        {!loading && !error && (
          <div className="max-w-[1280px] mx-auto px-4 md:px-6 mb-8 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 md:gap-3 min-w-max justify-center">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-5 py-2.5 rounded-full font-semibold text-label-lg transition-all duration-300 whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-vivid-purple text-white shadow-md'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                All ({products.length})
              </button>
              {categories.map((cat) => {
                const count = products.filter(p => p.category === cat.id).length;
                const icon = CATEGORY_ICONS[cat.id] || 'category';
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-5 py-2.5 rounded-full font-semibold text-label-lg transition-all duration-300 whitespace-nowrap flex items-center gap-1.5 ${
                      activeCategory === cat.id
                        ? 'bg-vivid-purple text-white shadow-md'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{icon}</span>
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <section className="max-w-[1280px] mx-auto px-4 md:px-6">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-5xl text-outline mb-4">inventory_2</span>
                <p className="text-on-surface-variant text-body-lg">No products in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredProducts.map((p) => {
                  const image = getProductImage(p);
                  return (
                    <div
                      key={p.id}
                      className="product-card group relative bg-surface-container-low rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-outline-variant/30 shadow-sm hover:shadow-lg"
                    >
                      {/* Glow effect */}
                      <div className="glow-effect absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Image */}
                      <Link to={`/products/${p.id}`} className="block">
                        <div className="aspect-square relative overflow-hidden bg-white flex items-center justify-center p-6 md:p-8">
                          {image ? (
                            <img
                              alt={p.name}
                              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                              src={image}
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center text-outline gap-3">
                              <span className="material-symbols-outlined text-[64px] opacity-30">
                                {CATEGORY_ICONS[p.category] || 'category'}
                              </span>
                              <span className="text-on-surface-variant text-label-sm">{p.name}</span>
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="p-5 md:p-6 relative z-10 bg-surface-container-low">
                        <div className="flex justify-between items-start mb-1">
                          <Link to={`/products/${p.id}`} className="group/title">
                            <h3 className="text-headline-md text-on-surface group-hover/title:text-vivid-purple transition-colors">{p.name}</h3>
                          </Link>
                          <span className="text-vivid-purple font-bold text-lg">
                            ${p.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-on-surface-variant text-label-sm mb-4">{getSubtitle(p)}</p>

                        <Link
                          to={`/products/${p.id}`}
                          className="w-full py-3 md:py-4 border-2 border-vivid-purple text-vivid-purple font-bold rounded-xl hover:bg-vivid-purple hover:text-white transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                          View Details
                        </Link>
                      </div>
                    </div>
                  );
                })}

                {/* Custom Request card */}
                <div className="group relative bg-surface-container-lowest rounded-2xl overflow-hidden flex flex-col items-center justify-center p-8 text-center border-dashed border-primary/30 border-2 transition-all hover:bg-surface-container-low hover:border-primary/50 cursor-pointer min-h-[350px]">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                    <span className="material-symbols-outlined text-primary text-[32px]">add</span>
                  </div>
                  <h3 className="text-headline-md text-on-surface mb-2">Something Else?</h3>
                  <p className="text-on-surface-variant text-body-md mb-6 max-w-[200px]">
                    Suggest a product for our next drop
                  </p>
                  <a href="/contact" className="text-primary font-bold hover:underline transition-all text-body-md">
                    Submit Request
                  </a>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="max-w-4xl mx-auto px-4 md:px-6 mt-16 md:mt-[120px]">
          <div className="bg-surface-container-high p-8 md:p-12 rounded-3xl relative overflow-hidden shadow-inner border border-outline-variant/30 text-center">
            <div className="absolute -top-24 -right-24 w-48 h-48 md:w-64 md:h-64 bg-vivid-purple/5 blur-[80px] md:blur-[100px] rounded-full" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 md:w-48 md:h-48 bg-primary/5 blur-[60px] md:blur-[80px] rounded-full" />
            <div className="relative z-10">
              <h2 className="text-headline-md md:text-headline-lg font-bold mb-4 text-on-surface">
                Never Miss a Drop
              </h2>
              <p className="text-on-surface-variant mb-8 text-body-md md:text-body-lg">
                Get notified when we release limited edition canvases and AI styles.
              </p>
              <form
                className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  className="flex-grow bg-white rounded-xl border-0 border-b-2 border-outline-variant/50 focus:border-vivid-purple focus:ring-0 text-on-surface px-4 py-4 transition-all placeholder:text-outline text-body-md"
                  placeholder="Enter your email"
                  type="email"
                />
                <button
                  type="submit"
                  className="bg-vivid-purple text-white px-8 py-4 rounded-xl font-bold hover:bg-primary transition-all shadow-md active:scale-95 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
