import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header />

      <main className="pt-20 md:pt-24">
        {/* ===== Hero Section ===== */}
        <section className="relative min-h-[auto] md:min-h-[800px] flex items-center justify-center overflow-hidden px-4 md:px-4 py-12 md:py-0">
          {/* Atmospheric Glows */}
          <div className="absolute top-1/4 -left-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-vivid-purple/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 -right-20 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-electric-cyan/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

          <div className="max-w-[1280px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="relative z-10 space-y-6 md:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-surface-container border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-vivid-purple animate-pulse" />
                <span className="text-primary font-label-bold text-[10px] md:text-label-sm">
                  POWERED BY ADVANCED GENERATIVE AI
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-display-lg lg:text-display-xl leading-tight text-on-surface">
                Your Imagination, <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-vivid-purple to-electric-cyan">
                  Manufactured.
                </span>
              </h1>

              <p className="text-body-md md:text-body-lg text-on-surface-variant max-w-xl mx-auto lg:mx-0">
                The world's most sophisticated boutique for custom streetwear. Turn any thought into premium, physical high-fashion objects using the "Idea to Object" engine.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Link
                  to="/studio"
                  className="bg-vivid-purple text-stark-white px-8 md:px-10 py-4 md:py-5 rounded-xl font-label-bold text-body-md hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-vivid-purple/20 group flex items-center justify-center gap-3"
                >
                  Start Creating
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </Link>
                <Link
                  to="/gallery"
                  className="border-2 border-outline-variant text-on-surface-variant px-8 md:px-10 py-4 md:py-5 rounded-xl font-label-bold text-body-md hover:bg-surface-container-low transition-all text-center"
                >
                  View Gallery
                </Link>
              </div>
            </div>

            {/* Right: Demonstration Card */}
            <div className="relative order-first lg:order-last">
              <div className="glass-panel p-4 md:p-8 rounded-2xl md:rounded-3xl ai-glow relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-vivid-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Step Navigation */}
                <div className="flex justify-between items-center mb-6 md:mb-10 relative">
                  <div className="absolute left-0 right-0 h-0.5 bg-outline-variant/30 top-1/2 -translate-y-1/2 -z-10" />
                  {[
                    { num: 1, label: 'IDEA', active: true, color: 'vivid-purple' },
                    { num: 2, label: 'AI GEN', active: true, color: 'electric-cyan' },
                    { num: 3, label: 'PRINT', active: false, color: 'surface-container-highest' },
                  ].map((step) => (
                    <div key={step.num} className="flex flex-col items-center gap-1 md:gap-2">
                      <div
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-lg"
                        style={{
                          backgroundColor: step.active
                            ? step.num === 1 ? '#8B5CF6'
                            : step.num === 2 ? '#06B6D4'
                            : '#E5E7EB',
                          color: step.active ? '#FFFFFF' : '#6B7280',
                          border: step.active ? 'none' : '1px solid #D1D5DB',
                          boxShadow: step.active ? '0 4px 12px rgba(139,92,246,0.35)' : 'none',
                        }}
                      >
                      >
                        {step.num}
                      </div>
                      <span className="font-label-bold text-[10px] md:text-label-sm text-on-surface">{step.label}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 md:space-y-6">
                  {/* Prompt Mock */}
                  <div className="bg-surface-container-low p-3 md:p-4 rounded-xl border border-outline-variant/20 group-hover:border-electric-cyan/50 transition-colors">
                    <div className="flex justify-between mb-1 md:mb-2">
                      <span className="text-[10px] md:text-label-sm font-label-bold text-on-surface-variant uppercase tracking-wider">AI Prompt</span>
                      <span className="material-symbols-outlined text-electric-cyan text-sm">auto_awesome</span>
                    </div>
                    <p className="text-sm md:text-body-md text-on-surface italic leading-relaxed">
                      "Cyberpunk streetwear aesthetic, neon geometric patterns, deep violet and electric blue lighting, cinematic matte finish"
                    </p>
                  </div>

                  {/* Mockup Showcase */}
                  <div className="aspect-square bg-surface-dim rounded-xl md:rounded-2xl overflow-hidden relative border border-outline-variant/10 flex items-center justify-center">
                    <img
                      alt="Custom AI Hoodie"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgHqhqg_0xJvCi9x0UGbyDdrltcnmweOkHsA0PqfDA_j91E2c3PBSSQWdg1YeG_hz5ntPblTvoE4b09GCpbXs1VgEBfTNxnugNLtijnrflqEbI_CDaJbpA6P3R3HRBPW-AsFtsVyxIksYYlbHRxFzD4YTUUzH1XRuFGnn9qAvpT9Rqik9oU9zs4QPevQmtVLm6sQ_AducOGSKdrslwYTnRWqzPw4n4GBO2-iXZfJ-uqHZvlbCQFAHTOWV_h_ozLdr9DlFHCUrCCs2O"
                    />
                    {/* Floating UI */}
                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex justify-between items-end">
                      <div className="bg-stark-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-[10px] md:text-label-sm font-label-bold flex items-center gap-2 shadow-sm text-on-surface">
                        <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500" />
                        READY TO PRINT
                      </div>
                      <div className="bg-vivid-purple p-2 md:p-3 rounded-full shadow-lg">
                        <span className="material-symbols-outlined text-stark-white text-sm md:text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== Bento Grid Feature Section ===== */}
        <section className="py-16 md:py-[120px] px-4 md:px-4 max-w-[1280px] mx-auto">
          <div className="text-center mb-10 md:mb-16 space-y-4">
            <h2 className="text-3xl md:text-headline-lg text-on-surface">The Boutique of the Future</h2>
            <p className="text-body-md md:text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              No designers. No middlemen. Just you, our AI engine, and premium physical results delivered to your door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Feature 1 — Span 2 cols */}
            <div className="md:col-span-2 bg-surface-container-low rounded-2xl md:rounded-3xl p-6 md:p-10 flex flex-col justify-end min-h-[300px] md:min-h-[400px] relative overflow-hidden group border border-outline-variant/10">
              <div className="absolute inset-0 z-0">
                <img
                  alt="AI Abstract waves"
                  className="w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNf3BkVdixqN6ztBwnb76NTL7fEDEl2ZRxKEuC1vYEuONcJqNa9uMpMVUaeUjpjWFgf2q6sikTD-sHzbmSTMOGEDTzNYiLnFynNYCjJuddLVN_WHQHysBH0oxUdwNgbMumpE33jM12yC9gBPhG_9dykuXGHmR9u-4jLD4YP6FcOT43TQ3dLMxIxzSrlSr-vziEIqqx6BBH8H7jyXNvcV72lvNP5wEJTfoFR5m2UFU-mDdHwySepNCLY8CLllDfPz96bG1MEXzkfkof"
                />
              </div>
              <div className="relative z-10 space-y-3 md:space-y-4">
                <span className="material-symbols-outlined text-primary text-3xl md:text-4xl">neurology</span>
                <h3 className="text-xl md:text-headline-md text-on-surface">Idea Engine v4.0</h3>
                <p className="text-sm md:text-body-md text-on-surface-variant max-w-md">
                  Our custom-tuned diffusion models understand fashion trends, texture physics, and brand identity better than any human designer.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface-container rounded-2xl md:rounded-3xl p-6 md:p-8 border border-outline-variant/10 flex flex-col justify-between group h-full">
              <div className="space-y-3 md:space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary text-on-primary rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl md:text-2xl">apparel</span>
                </div>
                <h3 className="font-label-bold text-lg md:text-xl text-on-surface">Premium Blanks</h3>
                <p className="text-sm md:text-body-md text-on-surface-variant">
                  We only use 400GSM organic cotton and sustainably sourced luxury materials for every object.
                </p>
              </div>
              <div className="pt-6 flex justify-end">
                <span className="material-symbols-outlined text-3xl md:text-4xl text-primary/10 group-hover:text-primary/30 transition-colors">diamond</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface-container-high rounded-2xl md:rounded-3xl p-6 md:p-8 border border-outline-variant/10 flex flex-col justify-between group h-full">
              <div className="space-y-3 md:space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-vivid-purple text-stark-white rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                </div>
                <h3 className="font-label-bold text-lg md:text-xl text-on-surface">72-Hour Fulfillment</h3>
                <p className="text-sm md:text-body-md text-on-surface-variant">
                  From final AI generation to local manufacturing and dispatch in under three days.
                </p>
              </div>
              <div className="pt-6 flex justify-end">
                <span className="material-symbols-outlined text-3xl md:text-4xl text-vivid-purple/10 group-hover:text-vivid-purple/30 transition-colors">local_shipping</span>
              </div>
            </div>

            {/* Feature 4 — Span 2 cols */}
            <div className="md:col-span-2 glass-panel rounded-2xl md:rounded-3xl p-6 md:p-8 border border-outline-variant/10 flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 group">
              <div className="w-full sm:w-48 h-32 rounded-xl bg-surface-dim overflow-hidden border border-outline-variant/20 shrink-0">
                <img
                  alt="Manufacturing process"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLUwICSB_U96Q1t5LpTh9GLkyvJRd_Q5Z-qYHW-e4UJ3Ng5UdsQCnOCp-0LhLdpVVAM6XlEaS-DnxWPnG3Iot6Z0TChNclqETAXJ1JYyDIJNlQdhxHnvpF8Ke76JCVmo8tXAoTBzJ5ezBwD51mlw2dEGTjoU5ZdPAxdq-lLBUTluUHS9BDE14GXbo7x5lejGTVpmEUo2zdGDQSLJZgzVagxM2N5HJb50_7p8kgUkdlDOILnGloNzA6H70kQXu5RrsM8IZW9XLbsCwZ"
                />
              </div>
              <div className="space-y-2">
                <h3 className="font-label-bold text-lg md:text-xl text-on-surface">Direct-to-Future Printing</h3>
                <p className="text-sm md:text-body-md text-on-surface-variant">
                  Next-gen pigmentation technology that ensures your AI artwork never fades or cracks, maintaining museum-quality detail forever.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CTA Section ===== */}
        <section className="py-16 md:py-[120px] px-4 md:px-4 relative">
          <div className="max-w-[1280px] mx-auto bg-surface-container-low rounded-3xl md:rounded-[40px] p-8 md:p-24 overflow-hidden relative border border-outline-variant/20">
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #8B5CF6 1px, transparent 0)', backgroundSize: '32px 32px' }}
            />
            <div className="relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-8">
              <h2 className="text-3xl sm:text-4xl md:text-display-lg lg:text-display-xl text-on-surface max-w-3xl leading-tight">
                Ready to turn your thoughts into thread?
              </h2>
              <p className="text-body-md md:text-body-lg text-on-surface-variant max-w-xl">
                Join 50,000+ creators manufacturing their imagination today. No experience required.
              </p>
              <div className="pt-2 md:pt-4 w-full sm:w-auto">
                <Link
                  to="/studio"
                  className="block w-full sm:w-auto bg-vivid-purple text-stark-white px-8 md:px-12 py-4 md:py-6 rounded-xl md:rounded-2xl font-label-bold text-base md:text-lg hover:opacity-90 transition-all active:scale-95 shadow-2xl shadow-vivid-purple/20 text-center"
                >
                  Start My First Project
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
