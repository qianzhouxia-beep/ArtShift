import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const faqs = [
  { q: 'Can I change my shipping address after ordering?', a: 'Address changes are possible within 12 hours of placing your order. Once production begins, we cannot reroute the package.' },
  { q: 'Do you ship to P.O. Boxes?', a: 'Currently, we only ship to physical street addresses to ensure safe delivery and signature confirmation for our custom art pieces.' },
  { q: 'What if my art arrives broken?', a: "Don't worry. If your object arrives damaged, we will rush-produce a replacement for you at no additional cost. Just contact our support team." },
];

export default function Shipping() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />

      <main className="pt-24 md:pt-32 pb-20 px-4 md:px-16 max-w-[1440px] mx-auto">
        {/* Hero */}
        <section className="mb-12 md:mb-20 text-center">
          <h1 className="text-[28px] md:text-5xl font-extrabold mb-4 text-on-surface">Shipping &amp; Returns</h1>
          <p className="text-base md:text-lg leading-relaxed text-on-surface-variant max-w-2xl mx-auto">
            We bridge the gap between digital creativity and physical reality. Here is everything you need to know about how your AI-crafted objects reach your doorstep.
          </p>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12 md:mb-20">
          {/* Delivery Times */}
          <div className="md:col-span-8 bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">local_shipping</span>
                <h2 className="text-2xl font-bold">Production &amp; Delivery</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">Production Phase</h3>
                  <p className="text-base leading-relaxed text-on-surface-variant">
                    Each item is custom-made to order. Digital printing and quality inspection takes <strong>3-5 business days</strong>.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">Shipping Phase</h3>
                  <p className="text-base leading-relaxed text-on-surface-variant">
                    Standard domestic transit takes <strong>5-7 business days</strong>. International orders may take <strong>10-14 business days</strong>.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-outline-variant/10 flex flex-wrap gap-2 md:gap-4">
              {[
                { icon: 'check_circle', label: 'Tracked Shipping' },
                { icon: 'language', label: 'International Delivery' },
                { icon: 'eco', label: 'Carbon Neutral' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
                  <span className="material-symbols-outlined text-sm">{item.icon}</span>
                  <span className="text-xs font-semibold whitespace-nowrap">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Card */}
          <div className="md:col-span-4 bg-primary text-on-primary p-8 rounded-xl shadow-lg flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="material-symbols-outlined text-9xl">payments</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">Flat Rate Shipping</h3>
            <div className="text-5xl font-extrabold mb-4">$9.99</div>
            <p className="text-base leading-relaxed opacity-90">Worldwide flat rate for any custom item. Every order ships with tracking and carbon-neutral delivery.</p>
          </div>
        </div>

        {/* Returns Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center mb-12 md:mb-20">
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-tertiary text-3xl">assignment_return</span>
              <h2 className="text-2xl font-bold">Our Returns Policy</h2>
            </div>
            <div className="space-y-6">
              {[
                { num: 1, title: 'Custom Goods Assurance', desc: "Since your art is unique, we can't accept returns for change of mind. However, if there's a manufacturing defect or damage, we'll replace it immediately." },
                { num: 2, title: '30-Day Window', desc: 'Please report any issues within 30 days of receiving your item to qualify for a free replacement or repair.' },
                { num: 3, title: 'Easy Photo Review', desc: "No need to mail it back first. Simply send us a high-quality photo of the defect, and our team will process the claim within 48 hours." },
              ].map((item) => (
                <div key={item.num} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center font-bold">{item.num}</div>
                  <div>
                    <h4 className="text-sm font-semibold mb-1">{item.title}</h4>
                    <p className="text-base leading-relaxed text-on-surface-variant">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <a href="/contact" className="mt-8 md:mt-10 inline-block border-2 border-primary text-primary px-8 py-3 rounded-full text-sm font-semibold hover:bg-primary/5 transition-all">
              Start a Return Claim
            </a>
          </div>
          <div className="order-1 md:order-2">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-xl relative">
              <img alt="Premium packaging" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWoWolehEeau6dECDia5gUmFZwuZvqyY9MDP7J1YeveZQSOatsB1pcyFrtYsbIpoecmxWqmzLXo1280Bsc-sCzaeERPWxDbCacjO5VbD-YIGEx0ErPIExb52UMfFf8fhL2TdlG5Fag9A-0OhSc5Mj-8QWugMQyekTTZrvk0dc8Wc3cojvT46YK9oy_0-R0flbGQCJjDaApT5sjc9U2t0jTuMtZVUSE0nn_NZr9f3AKz2DSHk6VKeaFGvAm_F4PF5qtkWm6ajKQUqAv" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6 md:p-8">
                <p className="text-white text-sm font-semibold italic">"Every object is securely nested in eco-friendly protective custom foam."</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-12 md:mt-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-surface-container-low p-5 md:p-6 rounded-xl cursor-pointer transition-all duration-300">
                <summary className="flex justify-between items-center list-none">
                  <span className="text-sm font-semibold pr-4">{faq.q}</span>
                  <span className="material-symbols-outlined transition-transform duration-300 group-open:rotate-180">expand_more</span>
                </summary>
                <p className="mt-4 text-base leading-relaxed text-on-surface-variant">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
