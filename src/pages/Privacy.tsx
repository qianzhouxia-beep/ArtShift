import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const sections = [
  {
    id: 'information-we-collect',
    icon: 'database',
    title: '1. Information We Collect',
    content: (
      <>
        <p className="text-base leading-relaxed mb-4">To provide the ArtShift experience, we collect information that you provide directly to us, such as when you create an account, upload an image, or use our generative tools.</p>
        <ul className="list-disc ml-6 space-y-2 text-base leading-relaxed">
          <li><strong className="text-on-surface">Account Data:</strong> Name, email address, and profile preferences.</li>
          <li><strong className="text-on-surface">User Content:</strong> Prompts, uploaded images, and the resulting AI-generated artworks.</li>
          <li><strong className="text-on-surface">Transactional Info:</strong> Billing details for product orders (processed via secure third-party partners).</li>
        </ul>
      </>
    ),
  },
  {
    id: 'ai-training',
    icon: 'auto_awesome',
    title: '2. AI & Generative Models',
    accent: 'secondary',
    content: (
      <>
        <p className="text-base leading-relaxed mb-4">ArtShift utilizes advanced neural networks to transform ideas into objects. Your privacy is paramount in this process.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-surface-container-low">
            <h4 className="text-sm font-semibold text-on-surface mb-2">No Training Policy</h4>
            <p className="text-xs font-semibold">We do not use your private generated art or personal uploads to train our underlying public models without your explicit consent.</p>
          </div>
          <div className="p-4 rounded-lg bg-surface-container-low">
            <h4 className="text-sm font-semibold text-on-surface mb-2">Metadata Privacy</h4>
            <p className="text-xs font-semibold">Original image EXIF data is stripped upon upload to ensure location and device data is never stored on our servers.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'how-we-use-data',
    icon: 'visibility',
    title: '3. How We Use Data',
    accent: 'tertiary',
    content: (
      <>
        <p className="text-base leading-relaxed mb-4">Your data is used solely to enhance your creative workflow. We use it to:</p>
        <div className="space-y-3">
          {['Generate high-fidelity digital art from your textual prompts.', 'Facilitate the printing and shipping of physical objects.', 'Personalize your feed based on community engagement and likes.'].map((item) => (
            <div key={item} className="flex items-start gap-3">
              <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
              <span className="text-base leading-relaxed text-on-surface-variant">{item}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'your-rights',
    icon: 'gavel',
    title: '4. Your Creative Rights',
    content: (
      <>
        <p className="text-base leading-relaxed mb-4">You retain ownership of the prompts you create. Regarding the AI-generated outputs, we grant you a perpetual, worldwide license to use, copy, and distribute the images for both personal and commercial purposes, provided you adhere to our Community Guidelines.</p>
        <div className="p-5 md:p-6 rounded-xl border-2 border-dashed border-outline-variant/30 bg-surface">
          <p className="text-sm font-semibold text-on-surface italic text-center md:text-left">"At ArtShift, we believe the creator is the soul of the machine. Your data remains your property."</p>
        </div>
      </>
    ),
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-on-surface overflow-x-hidden">
      <Header />

      <main className="pt-[100px] md:pt-[140px] pb-20 px-4 md:px-16 max-w-[1200px] mx-auto">
        {/* Hero */}
        <section className="mb-12 md:mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/10 text-primary mb-6">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            <span className="text-sm font-semibold">Data Privacy & Security</span>
          </div>
          <h1 className="text-[28px] md:text-5xl font-extrabold mb-4 text-on-surface">Privacy Policy</h1>
          <p className="text-base md:text-lg leading-relaxed text-on-surface-variant max-w-[700px] mx-auto">
            Transparency is at the heart of our creative community. Here is how ArtShift handles your data with the care and respect your art deserves.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar TOC */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div className="sticky top-[100px] md:top-[120px] p-6 md:p-8 rounded-xl glass-panel shadow-sm border border-outline-variant/20">
              <h3 className="text-2xl font-bold mb-6 text-on-surface">Quick Navigation</h3>
              <ul className="space-y-4">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="group flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors">
                      <span className="h-1 rounded-full bg-primary/30 group-hover:bg-primary group-hover:w-2 transition-all w-1" />
                      <span className="text-sm font-semibold">{s.title}</span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href="#contact" className="group flex items-center gap-3 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="w-1 h-1 rounded-full bg-primary/30 group-hover:bg-primary group-hover:w-2 transition-all" />
                    <span className="text-sm font-semibold">Contact Us</span>
                  </a>
                </li>
              </ul>
              <div className="mt-8 md:mt-20 pt-6 md:pt-12 border-t border-outline-variant/10">
                <p className="text-xs font-semibold text-on-surface-variant mb-2">Last Updated:</p>
                <p className="text-sm font-semibold text-primary">June 6, 2025</p>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="lg:col-span-8 order-1 lg:order-2 space-y-8 md:space-y-12">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className={`p-6 md:p-8 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/5 relative overflow-hidden ${s.id === 'ai-training' ? '' : ''}`}>
                {s.id === 'ai-training' && <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-container/10 rounded-full -mr-16 -mt-16 blur-3xl" />}
                <div className="flex items-center gap-4 mb-6 relative">
                  <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${s.accent === 'secondary' ? 'bg-secondary-container/10 text-secondary' : s.accent === 'tertiary' ? 'bg-tertiary-container/10 text-tertiary' : 'bg-primary-container/10 text-primary'}`}>
                    <span className="material-symbols-outlined">{s.icon}</span>
                  </div>
                  <h2 className="text-2xl font-bold">{s.title}</h2>
                </div>
                <div className="space-y-4 text-on-surface-variant relative">
                  {s.content}
                </div>
              </section>
            ))}

            {/* Visual Break */}
            <div className="rounded-2xl overflow-hidden h-[200px] md:h-[300px] relative">
              <img alt="Abstract secure art" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC82oeqdSLtY7rF3pEk213k0anX2-1joMFg_EmQP-JrqL8iWepMW_57Yrp74OIf5CQ4qSveRyBOm1P39GWcx_o1vUY0hoUuCB7JVj4Bite4k1F90WGgIzwPkYScHlTMmHDrMjiyiMYT5QNZJguexYQq7BSh2b4SChLb6HXmnLq-t52Jiya6_Z8oH3k9YDdl3C5-Z6kWUwcXo93JS8bcPGVl0Doa1zxuTE7F5MQxAR4--X96oYGzk1nBG2FsN4xS6SyuLP1LQqD-PSor" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:p-8">
                <p className="text-white text-2xl font-bold leading-tight">Encryption is an art form in itself.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
