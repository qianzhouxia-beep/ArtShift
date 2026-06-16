import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const faqData = [
  {
    id: 'ordering',
    icon: 'shopping_cart',
    title: 'Ordering',
    items: [
      { q: 'Can I modify my order after it has been placed?', a: 'Since each ArtShift piece is a unique AI-generated creation, the manufacturing process begins almost immediately after order confirmation. We can accommodate modifications within a 2-hour window. Please reach out to our support team with your order number.' },
      { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, American Express), Apple Pay, Google Pay, and PayPal. All transactions are processed securely with SSL encryption.' },
      { q: 'How do I track my order?', a: 'Once your order enters production, you will receive a confirmation email with a tracking number. You can track your shipment at any time from your order confirmation page or by logging into your ArtShift account.' },
      { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 1 hour of placement free of charge. After production begins, cancellations are subject to a 15% processing fee to cover materials already committed.' },
    ],
  },
  {
    id: 'ai-process',
    icon: 'auto_awesome',
    title: 'AI Design Process',
    items: [
      { q: 'Who owns the copyright of the AI-generated art?', a: 'When you create with ArtShift, you receive a full commercial license for the physical product. The underlying digital generation rights are shared between the user and ArtShift AI. You are free to use your generated designs on any products you order through us.' },
      { q: 'How does the AI generate my design?', a: 'Our Idea Engine v4.0 uses advanced latent diffusion models fine-tuned on fashion and textile data. Simply describe your vision with a text prompt, select a style preset, and the AI transforms your words into a print-ready design in seconds.' },
      { q: 'What if I don\'t like the generated design?', a: 'No problem — generation credits are only consumed when you add a design to your cart. You can regenerate as many times as you like until you find a result you love, at no extra charge.' },
    ],
  },
  {
    id: 'sizing',
    icon: 'straighten',
    title: 'Sizing & Fit',
    items: [
      { q: 'How do I find the right size?', a: 'Each product page includes a detailed size chart with measurements in both inches and centimeters. We recommend measuring a similar item you already own and comparing it to our chart for the best fit.' },
      { q: 'Do your products run true to size?', a: 'Our heavyweight hoodies have a relaxed, slightly oversized fit. T-shirts are a modern boxy cut. If you prefer a more fitted look, we recommend sizing down. Check the individual product page for specific fit notes.' },
      { q: 'What sizes do you offer?', a: 'Most apparel items range from XS to 3XL. Select products go up to 5XL. We are continuously expanding our size range to be more inclusive.' },
    ],
  },
  {
    id: 'product-care',
    icon: 'local_laundry_service',
    title: 'Product Care',
    items: [
      { q: 'How do I wash my custom printed apparel?', a: 'Machine wash cold, inside out, with like colors. Do not bleach. Tumble dry low or hang dry for best results. Our prints are designed to withstand 50+ washes without fading when cared for properly.' },
      { q: "What materials do you use?", a: "Our hoodies use 400GSM heavyweight organic cotton with a brushed fleece interior. T-shirts are 220GSM combed ring-spun organic cotton. Phone cases use impact-resistant polycarbonate. Ceramic mugs are dishwasher and microwave safe." },
      { q: 'Will the print crack or peel over time?', a: 'We use direct-to-garment (DTG) printing with eco-friendly, water-based inks that bond at the fiber level. Unlike vinyl or screen printing, our prints become part of the fabric and will not crack, peel, or fade with proper care.' },
    ],
  },
  {
    id: 'shipping',
    icon: 'local_shipping',
    title: 'Shipping & Delivery',
    items: [
      { q: 'How long does shipping take?', a: 'Production takes 3-5 business days for each custom item. After that, domestic shipping takes 5-7 business days and international shipping takes 10-14 business days. You will receive a tracking number once your order ships.' },
      { q: 'Do you ship internationally?', a: 'Yes! We ship to over 180 countries worldwide. International shipping is a flat rate of $9.99 per order. Please note that customs duties and import taxes may apply depending on your country.' },
      { q: 'How much does shipping cost?', a: 'We offer worldwide flat-rate shipping for $9.99 on all orders. All shipments include tracking and are carbon neutral.' },
      { q: 'Can I change my shipping address after ordering?', a: 'Address changes are possible within 12 hours of placing your order. Once production begins, we cannot reroute the package. Contact support immediately if you need to update your address.' },
    ],
  },
  {
    id: 'returns',
    icon: 'keyboard_return',
    title: 'Returns & Exchanges',
    items: [
      { q: 'What is your return policy for custom items?', a: 'Custom AI-generated apparel is made specifically for you. We offer free replacements for any manufacturing defects or print errors within 30 days of delivery. However, we cannot accept returns for change of mind or sizing issues on custom items.' },
      { q: 'What if my item arrives damaged?', a: 'If your order arrives damaged, contact our support team within 48 hours of delivery with photos of the damage. We will rush-produce a free replacement and handle the return shipping for the damaged item.' },
      { q: 'How do I start a return or exchange?', a: 'Visit our Contact page or email hello@artshift.ai with your order number and photos of the issue. Our team reviews claims within 24-48 hours and will guide you through the next steps.' },
    ],
  },
];

export default function FAQ() {
  const [openCategory, setOpenCategory] = useState(faqData[0].id);
  const [openItems, setOpenItems] = useState<Record<string, number>>({ ordering: 0 });

  const toggleAccordion = (catId: string, idx: number) => {
    setOpenCategory(catId);
    setOpenItems((prev) => ({ ...prev, [catId]: prev[catId] === idx ? -1 : idx }));
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />

      <main className="pt-24 md:pt-32 pb-20 px-4 md:px-16 max-w-[1440px] mx-auto">
        {/* Hero */}
        <section className="mb-12 md:mb-20 text-center max-w-3xl mx-auto">
          <span className="text-primary text-sm font-semibold tracking-[0.1em] uppercase mb-3 md:mb-4 block">Support Center</span>
          <h1 className="text-[28px] md:text-5xl font-extrabold leading-tight mb-4 md:mb-6">How can we help you create?</h1>
          <p className="text-base md:text-lg leading-relaxed text-on-surface-variant">
            Find answers to common questions about our AI design process, ordering, and logistics.
          </p>
        </section>

        {/* FAQ Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-24 space-y-6">
              <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
                {faqData.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setOpenCategory(cat.id)}
                    className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-semibold ${
                      openCategory === cat.id ? 'bg-primary-container/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]" style={openCategory === cat.id ? { fontVariationSettings: "'FILL' 1" } : {}}>
                      {cat.icon}
                    </span>
                    {cat.title}
                  </button>
                ))}
              </nav>
              {/* Help Card - Desktop */}
              <div className="hidden lg:block p-6 rounded-xl bg-surface-container-highest border border-outline-variant/20">
                <h4 className="text-2xl font-bold text-primary mb-2">Still curious?</h4>
                <p className="text-base leading-relaxed text-on-surface-variant mb-4">Our support team is ready to assist with your custom project.</p>
                <a href="/contact" className="w-full py-3 px-4 border border-primary text-primary rounded-full text-sm font-semibold hover:bg-primary/5 transition-colors text-center inline-block">
                  Contact Support
                </a>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-12 md:space-y-20">
            {faqData.map((cat) => (
              <section key={cat.id} id={cat.id} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-10 rounded-full bg-secondary-container/20 text-secondary flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined">{cat.icon}</span>
                  </span>
                  <h2 className="text-2xl md:text-[32px] font-bold">{cat.title}</h2>
                </div>

                {/* AI Process feature cards */}
                {cat.id === 'ai-process' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                    <div className="bg-surface-container-low rounded-xl p-5 md:p-6 border border-outline-variant/10">
                      <div className="aspect-video w-full mb-4 overflow-hidden rounded-lg">
                        <img alt="AI neural network" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7efJ0lVRxQF781uYgwRvV2ULzBgFoQDII0ioWkbmRFq8T0viDZ0_yDahDogAWtRYtOFXb-thAW3tDgbuQi8joKbA__SNlWf2AjAw1LSnSn-j_T7rJ_9jvYefzT7lKdut9pu9xBTkBRQf3kEw_QinNUqkDw1FFg66c--b2_mmaBVd8YpTLxOwvnxaOMo57Dcd7_P5AaaQ_LDRdPrCjuzqazLv_JuV2a0fcCZ2UlHwXrOZmEDg5oJLp5FPISHOHKYPMNUPcVoWmpRJP" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Prompt Optimization</h3>
                      <p className="text-base leading-relaxed text-on-surface-variant">Learn how our engine refines your words into visual masterpieces using advanced latent diffusion models.</p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-5 md:p-6 border border-outline-variant/10">
                      <div className="aspect-video w-full mb-4 overflow-hidden rounded-lg">
                        <img alt="Art canvas texture" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmJgdzMCtSKJ_NpxZMKN_ec0NxI_3csObMhOAJu3H14tOqGZf8rNIi8-p5WsWqSMa-bLbMaZ-nbdgEbjogMgnmzlJ0HAiRO4mKD6MqCzp95espIGZTDe00Q588wO-jeSJuHXS0Ma1nTR1IDVrE7yZ0dziLa6rB3-Uqe2pxF-Lva8kghL5Rx5thB0hcHyVKjEAC5a3CYHas1oaYWVfrrQNJREGYCEsCtSwSSv8IUyDASJYIvY-l5WqPedd2TLv49kRPUYPXFGst339L" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Material Science</h3>
                      <p className="text-base leading-relaxed text-on-surface-variant">We use archival-grade materials and UV-resistant inks to ensure your AI art lasts a lifetime.</p>
                    </div>
                  </div>
                )}

                {/* Accordion Items */}
                <div className="space-y-4">
                  {cat.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden transition-all hover:shadow-md ${openCategory === cat.id && openItems[cat.id] === idx ? '' : ''}`}
                    >
                      <button
                        className="w-full px-6 py-5 flex justify-between items-center text-left"
                        onClick={() => toggleAccordion(cat.id, idx)}
                      >
                        <span className="font-semibold text-on-surface leading-snug">{item.q}</span>
                        <span
                          className="material-symbols-outlined transition-transform flex-shrink-0 ml-4"
                          style={openCategory === cat.id && openItems[cat.id] === idx ? { transform: 'rotate(180deg)' } : {}}
                        >
                          expand_more
                        </span>
                      </button>
                      <div
                        className="overflow-hidden transition-all duration-300"
                        style={{
                          maxHeight: openCategory === cat.id && openItems[cat.id] === idx ? '500px' : '0',
                          paddingBottom: openCategory === cat.id && openItems[cat.id] === idx ? '24px' : '0',
                        }}
                      >
                        <p className="px-6 text-base leading-relaxed text-on-surface-variant">{item.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <section className="mt-20 bg-primary-container rounded-[2rem] p-8 md:p-16 text-center text-on-primary-container relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl" />
          <h2 className="text-[32px] md:text-5xl font-extrabold mb-4 md:mb-6 relative z-10">Ready to transform your vision?</h2>
          <p className="text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto opacity-90 relative z-10">
            Join thousands of creators who have turned their prompts into professional art objects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <a href="/studio" className="bg-on-primary-container text-primary px-8 py-4 rounded-full font-bold text-sm hover:scale-105 transition-transform inline-block">
              Start Creating
            </a>
            <a href="/gallery" className="bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-white/10 transition-colors inline-block">
              View Gallery
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
