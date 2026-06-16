import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const termsSections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    content: (
      <>
        <p className="text-base leading-relaxed">By accessing or using ArtShift AI ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use the Service. These terms constitute a legally binding agreement between you and ArtShift AI regarding your use of our website, mobile applications, and AI generation tools.</p>
        <p className="text-base leading-relaxed">We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the Service following such changes constitutes your acceptance of the revised terms.</p>
      </>
    ),
  },
  {
    id: 'services',
    title: '2. AI Services & Ownership',
    content: (
      <>
        <div className="bg-surface-container-low p-6 rounded-lg mb-6">
          <h4 className="text-sm font-semibold text-primary mb-2">The "Idea to Object" Protocol</h4>
          <p className="text-base leading-relaxed italic mb-0">
            ArtShift provides generative AI tools that transform user-provided prompts into digital art. You retain ownership of the original prompts you provide. ArtShift grants you a royalty-free, perpetual license to use the resulting digital assets for personal or commercial use, subject to our fair use policy.
          </p>
        </div>
        <p className="text-base leading-relaxed">ArtShift uses proprietary and third-party AI models. We do not guarantee that the Service will produce specific results or that the output will be unique. Due to the nature of machine learning, multiple users may generate similar or identical outputs.</p>
      </>
    ),
  },
  {
    id: 'accounts',
    title: '3. User Accounts',
    content: (
      <>
        <p className="text-base leading-relaxed">To access certain features of the Service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.</p>
        <ul className="list-disc pl-6 space-y-3 text-base leading-relaxed">
          <li>You must be at least 18 years old to create an account.</li>
          <li>You must provide accurate and complete registration information.</li>
          <li>You may not use the Service for any illegal or unauthorized purpose.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'conduct',
    title: '4. Prohibited Conduct',
    content: (
      <>
        <p className="text-base leading-relaxed mb-4">You agree not to use the Service to:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: 'block', text: 'Generate harmful, explicit, or offensive content.' },
            { icon: 'copyright', text: 'Infringe upon the intellectual property of others.' },
            { icon: 'memory', text: 'Attempt to reverse-engineer our AI models.' },
            { icon: 'person_off', text: 'Impersonate any person or entity.' },
          ].map((item) => (
            <div key={item.icon} className="p-4 rounded-lg bg-error-container/10 border border-error/10 flex gap-3 items-start">
              <span className="material-symbols-outlined text-error shrink-0">{item.icon}</span>
              <p className="text-sm font-semibold text-on-error-container">{item.text}</p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'physical',
    title: '5. Physical Goods & Shipping',
    content: (
      <>
        <p className="text-base leading-relaxed">ArtShift offers the ability to print digital creations onto physical objects. All orders are subject to availability and acceptance. We use high-quality materials and printing processes, but slight variations in color and texture may occur between the digital preview and the final physical product.</p>
        <p className="text-base leading-relaxed">Shipping times are estimates and not guarantees. We are not responsible for delays caused by shipping carriers or customs processes.</p>
      </>
    ),
  },
  {
    id: 'liability',
    title: '6. Limitation of Liability',
    content: (
      <>
        <p className="text-base leading-relaxed">TO THE MAXIMUM EXTENT PERMITTED BY LAW, ARTSHIFT AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.</p>
        <p className="text-base leading-relaxed">OUR TOTAL LIABILITY FOR ANY CLAIM ARISING OUT OF OR RELATING TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF ONE HUNDRED DOLLARS ($100) OR THE AMOUNT YOU PAID US IN THE PAST SIX MONTHS.</p>
      </>
    ),
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />

      <main className="pt-24 md:pt-32 pb-20">
        <div className="max-w-[1440px] mx-auto px-4 md:px-16">
          {/* Hero */}
          <div className="mb-12 md:mb-20 text-center md:text-left">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase mb-4 block">Legal Center</span>
            <h1 className="text-[28px] md:text-5xl font-extrabold text-on-surface mb-6">Terms of Service</h1>
            <p className="text-base md:text-lg leading-relaxed text-on-surface-variant max-w-2xl mx-auto md:mx-0">
              Last updated: June 6, 2025. Please read these terms carefully before using the ArtShift AI platform and services.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sticky Sidebar - Desktop */}
            <aside className="w-full md:w-1/4 h-fit sticky top-28 hidden md:block">
              <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border border-outline-variant/10">
                <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-widest mb-4">On This Page</h3>
                <ul className="space-y-1">
                  {termsSections.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="block py-2 px-4 rounded-lg text-sm font-semibold text-on-surface-variant hover:text-primary transition-all">
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Mobile Nav */}
            <div className="md:hidden mb-8 sticky top-20 z-40 bg-background/95 backdrop-blur-sm py-2">
              <div className="flex overflow-x-auto gap-4 no-scrollbar pb-2">
                {termsSections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="whitespace-nowrap px-4 py-2 bg-surface-container-low rounded-lg text-sm font-semibold text-on-surface-variant border border-outline-variant/10">
                    {s.title.split('.')[0]}
                  </a>
                ))}
              </div>
            </div>

            {/* Content */}
            <article className="w-full md:w-3/4 bg-surface-container-lowest p-6 md:p-12 rounded-lg shadow-sm border border-outline-variant/10">
              <div className="space-y-8">
                {termsSections.map((s) => (
                  <section key={s.id} id={s.id}>
                    <h2 className="text-2xl font-bold text-on-surface mb-4">{s.title}</h2>
                    <div className="space-y-4 text-on-surface-variant">{s.content}</div>
                  </section>
                ))}
              </div>

              {/* Contact Callout */}
              <div className="mt-12 p-6 md:p-8 rounded-lg bg-primary text-on-primary">
                <h3 className="text-2xl font-bold mb-2">Have questions about our terms?</h3>
                <p className="text-base leading-relaxed mb-6 opacity-90">Our legal team is here to help you understand how we protect your rights and your data.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/contact" className="bg-surface-container-lowest text-primary px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-opacity-90 transition-all text-center">Contact Legal Team</a>
                  <a href="/contact" className="border border-on-primary text-on-primary px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-white/10 transition-all text-center">Print This Page</a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
