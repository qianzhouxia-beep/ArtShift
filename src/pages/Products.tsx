import { Link } from 'react-router-dom';
import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PrintfulDesigner from '../components/PrintfulDesigner';

interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  image: string;
}

/** Maps ArtShift product slug → Gooten numeric product ID */
const PRODUCT_TO_GOOTEN_ID: Record<string, number> = {
  hoodie: 85,       // Gildan 18500 Pullover Hoodie
  sweatshirt: 145,  // American Apparel F496 Drop Shoulder
  tshirt: 40,       // Next Level 3900 Boyfriend Tee
  hat: 460,         // Richardson 113 Foamie Trucker Cap
  mug: 186,         // Accent Mugs 11oz
  phonecase: 0,     // 待查
};

const PRODUCT_DATA: Product[] = [
  {
    id: 'hoodie',
    name: 'Heavyweight Hoodie',
    subtitle: 'Essential Collection · 400GSM',
    price: 84.99,
    image: '/images/products/hoodie.png',
  },
  {
    id: 'sweatshirt',
    name: 'Classic Sweatshirt',
    subtitle: 'Drop Shoulder · Midweight',
    price: 49.99,
    image: '/images/products/sweatshirt.png',
  },
  {
    id: 'tshirt',
    name: 'Signature T-Shirt',
    subtitle: 'Boxy Fit · Organic Cotton',
    price: 32.00,
    image: '/images/products/tshirt.png',
  },
  {
    id: 'hat',
    name: 'Structured 5-Panel',
    subtitle: 'Adjustable · Twill Finish',
    price: 39.99,
    image: '/images/products/hat.svg',
  },
  {
    id: 'phonecase',
    name: 'Impact Phone Case',
    subtitle: 'Ultra Protective · Matte Finish',
    price: 45.00,
    image: '/images/products/phonecase.png',
  },
  {
    id: 'mug',
    name: 'Ceramic Studio Mug',
    subtitle: '11oz · Matte Black Ceramic',
    price: 24.99,
    image: '/images/products/mug.png',
  },
];

export default function Products() {
  const [designerProduct, setDesignerProduct] = useState<Product | null>(null);
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header />

      <main className="pt-24 md:pt-32 pb-16 md:pb-20">
        {/* Hero */}
        <header className="max-w-[1280px] mx-auto px-4 md:px-6 mb-12 md:mb-16 text-center">
          <h1 className="text-headline-lg-mobile md:text-headline-xl font-extrabold mb-4 text-on-surface">
            Choose Your Canvas
          </h1>
          <p className="text-on-surface-variant text-body-md md:text-body-lg max-w-2xl mx-auto px-4">
            Transform high-end apparel and lifestyle goods into unique masterpieces. Select a base
            object to begin your generative design journey.
          </p>
        </header>

        {/* Product Grid */}
        <section className="max-w-[1280px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {PRODUCT_DATA.map((p) => (
              <div
                key={p.id}
                className="product-card group relative bg-surface-container-low rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-outline-variant/30 shadow-sm hover:shadow-lg"
              >
                {/* Glow effect */}
                <div className="glow-effect absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="aspect-square relative overflow-hidden bg-white flex items-center justify-center p-6 md:p-8">
                  <img
                    alt={p.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    src={p.image}
                  />
                </div>

                <div className="p-5 md:p-6 relative z-10 bg-surface-container-low">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-headline-md text-on-surface mb-1">{p.name}</h3>
                      <p className="text-on-surface-variant text-label-sm">{p.subtitle}</p>
                    </div>
                    <span className="text-vivid-purple font-bold text-lg">
                      ${p.price.toFixed(2)}
                    </span>
                  </div>

                  <Link
                    to={`/studio?product=${p.id}`}
                    className="w-full py-3 md:py-4 border-2 border-vivid-purple text-vivid-purple font-bold rounded-xl hover:bg-vivid-purple hover:text-white transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">brush</span>
                    Design This
                  </Link>
                  {PRODUCT_TO_GOOTEN_ID[p.id] && (
                    <button
                      onClick={() => setDesignerProduct(p)}
                      className="w-full mt-2 py-3 border-2 border-outline-variant text-on-surface-variant font-medium rounded-xl hover:bg-surface-container-high hover:border-vivid-purple hover:text-vivid-purple transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                      Customize
                    </button>
                  )}
                </div>
              </div>
            ))}

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
        </section>

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

      {/* Printful EDM Modal */}
      {designerProduct && (
        <PrintfulDesigner
          productId={PRODUCT_TO_GOOTEN_ID[designerProduct.id] || 85}
          externalProductId={designerProduct.id}
          onTemplateSaved={(templateId) => {
            console.log('[Products] Template saved:', templateId, 'for', designerProduct.name);
            setDesignerProduct(null);
            // TODO: Navigate to checkout with templateId
          }}
          onClose={() => setDesignerProduct(null)}
        />
      )}
    </div>
  );
}
