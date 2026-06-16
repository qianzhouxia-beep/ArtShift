import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header />

      <main className="w-full pt-20 md:pt-[80px]">
        {/* Hero Section: Editorial Header */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-16 py-12 md:pt-24 md:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 items-end">
            <div className="md:col-span-8">
              <span className="inline-block uppercase tracking-[0.15em] text-xs font-bold text-primary mb-4">Est. 2014</span>
              <h1 className="text-[40px] md:text-[64px] leading-[1.1] md:leading-[1.0] font-extrabold mb-6 md:mb-8 text-on-surface">
                Where Heritage <br className="hidden md:block" />
                <span className="italic text-primary">Meets</span> The Infinite Canvas.
              </h1>
            </div>
            <div className="md:col-span-4 md:pb-2">
              <p className="text-lg leading-relaxed text-on-surface-variant max-w-xs">
                ArtShift curates the intersection of classical craftsmanship and digital avant-garde, redefining what it means to experience art in the 21st century.
              </p>
            </div>
          </div>
        </section>

        {/* Asymmetric Image Section: The Origin */}
        <section className="w-full bg-surface-container-low py-16 md:py-32">
          <div className="max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center">
            <div className="md:col-span-7 relative order-2 md:order-1">
              <img
                alt="Sophisticated minimalist gallery room"
                className="w-full h-[300px] md:h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-700 rounded-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZckQC67-KAfgyG7Ylqf7bZuGNAAGdCGdMQCOvlxQvb9ZbkkHQaz_bgYKRctEVuJ74DHxz91ao0JDSbSySoRTZ2O3hQpkJ8DKYwHeeskrTIkfW9lMQW2gSa9x2uF5nMEvXcJm9NkxnqFpMhxMA8vH2jdANfmNYP48qzr0f3kUuY71klagQi6TxLbgevqxtrMdZTc4d3S39tUVGsroLleanXG8xGsTsUsunqXyXZAO-JUCBIxpeorVSawNbeZ-ltfU-deL7CczLAA0I"
              />
              <div className="absolute -bottom-6 -right-6 md:-bottom-12 md:-right-12 w-32 h-32 md:w-48 md:h-48 bg-surface-container-lowest p-4 md:p-8 border border-surface-container-high flex flex-col justify-center rounded-lg">
                <span className="font-extrabold text-[40px] leading-none text-on-surface">10+</span>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1 md:mt-2">Years of Curation</p>
              </div>
            </div>
            <div className="md:col-span-4 md:col-start-9 space-y-6 md:space-y-8 order-1 md:order-2">
              <h2 className="text-2xl md:text-[32px] font-bold italic">The Origin</h2>
              <p className="text-base leading-relaxed">
                Founded in a small studio in Paris, ArtShift began as a radical experiment: could the tactile soul of physical art survive the transition into the digital ether? We spent a decade answering that question through obsession with detail.
              </p>
              <div className="h-px bg-on-surface origin-left" />
              <p className="text-base leading-relaxed italic text-on-surface-variant">
                "Technology is not the subject of our art; it is the medium through which the eternal is rediscovered."
              </p>
            </div>
          </div>
        </section>

        {/* Values Section: Bento Grid */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-16 py-16 md:py-32">
          <div className="mb-10 md:mb-16">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant mb-2">Our Pillars</h2>
            <div className="h-px w-24 bg-on-surface" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: 'history_edu', title: 'Curation Over Chaos', desc: 'In an era of infinite scrolls, we choose intentionality. Every piece in our collection is hand-vetted by master curators.' },
              { icon: 'precision_manufacturing', title: 'Digital Craft', desc: 'We treat pixels like pigment. Our technical processes mirror the meticulous nature of classical restoration.' },
              { icon: 'unfold_less', title: 'Quiet Luxury', desc: 'We believe the best interfaces are invisible. Our technology fades away to let the artwork breathe.' },
            ].map((v, i) => (
              <div
                key={v.title}
                className={`border border-outline-variant/20 p-8 md:p-10 flex flex-col justify-between aspect-square group hover:bg-on-surface hover:text-surface transition-colors duration-500 rounded-lg ${i === 1 ? 'md:mt-16' : ''}`}
              >
                <span className="material-symbols-outlined text-4xl mb-6 md:mb-8 group-hover:text-primary">{v.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold mb-3 md:mb-4">{v.title}</h3>
                  <p className="text-base leading-relaxed text-on-surface-variant group-hover:text-surface-variant">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="w-full bg-on-surface text-surface py-16 md:py-32 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-4 md:px-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 relative">
            <div className="md:col-span-6 z-10">
              <h2 className="text-[40px] md:text-[64px] leading-[1.1] font-extrabold mb-8 md:mb-12">The Shift.</h2>
              <p className="text-lg leading-relaxed mb-6 md:mb-8 opacity-80">
                We don't just sell art; we facilitate a transformation in perception. By bridging the gap between physical galleries and digital ecosystems, we provide a home for the works that define our future heritage.
              </p>
              <a href="/studio" className="inline-block text-sm font-bold uppercase border-b border-primary pb-1 hover:text-primary transition-all">
                View the Process
              </a>
            </div>
            <div className="md:col-span-6 relative mt-8 md:mt-0 h-[300px] md:h-auto">
              <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-on-surface to-transparent z-10" />
              <img
                alt="Liquid purple and cyan swirl"
                className="w-full h-full object-cover opacity-60 rounded-lg"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeGkX3kCeJJirvYXg09gon7i8qUxkFsGuvljCpVzk_iSZTv-tJwyam0JR88g8_LfDWsq3yOF9JYwYmqL3vC2zfJi7P546Ch3hyGtzAGy28U5D3PPv5rExmQOzOcIGOH8pJC_OK4xjMOxxz_KQPUNM7dduFOJKfZo5iaOoUmTQc0e5HDM0J9WBS_DSET1guPcO9cgB2ukiXPAKWu44hI3CRAefC_NYxec1hdEqkdcupnkEzY4Kal9C7lXB0WpcZc7w4VHkusPRpgq8U"
              />
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-16 py-16 md:py-32 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-[32px] font-bold italic mb-4 md:mb-6">Join the Inner Circle.</h2>
            <p className="text-base leading-relaxed mb-8 md:mb-10 text-on-surface-variant">
              Stay informed about private exhibitions, digital drops, and the evolution of ArtShift curation.
            </p>
            <form className="flex flex-col md:flex-row gap-4 justify-center" onSubmit={(e) => e.preventDefault()}>
              <input
                className="bg-transparent border-t-0 border-x-0 border-b border-on-surface focus:ring-0 focus:border-primary text-xs font-bold uppercase tracking-wider px-0 w-full md:w-80 py-2 outline-none"
                placeholder="YOUR EMAIL ADDRESS"
                type="email"
              />
              <button className="bg-on-surface text-surface px-10 py-4 text-sm font-bold hover:bg-primary transition-colors rounded-full" type="submit">
                SUBSCRIBE
              </button>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
