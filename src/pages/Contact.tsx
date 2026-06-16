import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'https://artshift-backend.zeabur.app/api';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', type: 'General Inquiry', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to send message');
      setSubmitted(true);
      setForm({ name: '', email: '', type: 'General Inquiry', message: '' });
    } catch {
      setError('Failed to send. Please try again later.');
    } finally {
      setLoading(false);
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface overflow-x-hidden">
      <Header />

      <main className="pt-24 md:pt-32 pb-20 px-4 md:px-16 max-w-7xl mx-auto">
        {/* Hero */}
        <section className="mb-20 text-center md:text-left">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block py-1 px-3 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-xs font-semibold uppercase tracking-wider">
                Contact Us
              </span>
              <h1 className="text-[28px] md:text-5xl font-extrabold text-on-surface">
                We're here to help you <span className="text-primary">evolve</span> your art.
              </h1>
              <p className="text-base md:text-lg leading-relaxed text-on-surface-variant max-w-xl mx-auto md:mx-0">
                Whether you have questions about our AI generation tools, shipping for physical prints, or just want to share your latest creation, our team is ready to connect.
              </p>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <div className="absolute -top-6 md:-top-12 -right-6 md:-right-12 w-32 md:w-64 h-32 md:h-64 bg-secondary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 md:-bottom-12 -left-6 md:-left-12 w-32 md:w-64 h-32 md:h-64 bg-primary/10 rounded-full blur-3xl" />
              <img
                alt="Abstract digital art"
                className="rounded-xl shadow-2xl relative z-10 w-full h-[300px] md:h-[400px] object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOUih11Eaf92DZprHMMU4uhaLRUc4c1oyzzGo9bq261OFzPJQaGTynLc5Z9q2NrAlbcJZLIyicdpSI_y4JjKNuo9g6cLkkKw4xXG3frsqw2iW6XLpjS5QPjr8xwqUYHAoe8_7cRBopU1-MuPKoNvcJp_F_c4SoeVndRVUJeP_vzbaj86igrkMac8pJfY60PlNZaWeSagC3U_PNWkMQaozxZ_pSc6KjtPIwGzq0VZr_ACeJiABBN5f6W6xyfX3dXRCTFBlHCY7eIHD6"
              />
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Info Cards */}
          <div className="lg:col-span-5 space-y-6 flex flex-col">
            <div className="p-8 rounded-xl glass-panel border border-surface-container-highest shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined">alternate_email</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Email Support</h3>
                  <p className="text-on-surface-variant mb-4">Expect a response within 24 hours.</p>
                  <a href="mailto:hello@artshift.ai" className="text-primary text-sm font-bold hover:underline">hello@artshift.ai</a>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-xl bg-surface-container-low border border-surface-container-highest shadow-sm transition-all">
              <h3 className="text-2xl font-bold mb-4">Follow Our Journey</h3>
              <p className="text-on-surface-variant mb-6">Join 50,000+ artists creating the future of generative aesthetics.</p>
              <div className="flex gap-4">
                {[
                  { icon: 'share', label: 'Share', href: '#' },
                  { icon: 'public', label: 'Website', href: '/' },
                  { icon: 'podcasts', label: 'Podcast', href: '#' },
                ].map((item) => (
                  <a key={item.icon} href={item.href} className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-on-surface-variant hover:text-primary border border-outline-variant/30 transition-all" title={item.label}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-xl bg-on-surface text-on-primary shadow-lg overflow-hidden relative flex-grow">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Check the FAQ</h3>
                <p className="opacity-80 mb-6">Most questions about shipping and billing are answered in our portal.</p>
                <a href="/faq" className="inline-block bg-surface text-on-surface px-6 py-2 rounded-full text-sm font-bold hover:bg-primary-fixed transition-colors">
                  Visit Help Center
                </a>
              </div>
              <div className="absolute -bottom-4 -right-4 text-white/5 pointer-events-none hidden md:block">
                <span className="material-symbols-outlined text-[120px]">help_center</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="p-4 md:p-12 rounded-xl bg-white shadow-xl shadow-primary/5 border border-surface-container-highest h-full">
              <h2 className="text-[32px] font-bold mb-2">Send us a message</h2>
              <p className="text-on-surface-variant mb-8">Fill out the form below and our studio team will get back to you shortly.</p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant">Full Name</label>
                    <input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary transition-all outline-none" placeholder="Alex Rivera" type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-on-surface-variant">Email Address</label>
                    <input className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary transition-all outline-none" placeholder="alex@example.com" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant">Inquiry Type</label>
                  <div className="relative">
                    <select className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary transition-all appearance-none outline-none" value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}>
                      <option>General Inquiry</option>
                      <option>Technical Support</option>
                      <option>Artist Partnership</option>
                      <option>Order & Shipping</option>
                      <option>Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-on-surface-variant">Message</label>
                  <textarea className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary transition-all resize-none outline-none" placeholder="Tell us how we can help..." rows={5} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} />
                </div>
                <div className="flex items-start gap-3 py-2">
                  <input className="mt-1 rounded text-primary focus:ring-primary border-outline-variant bg-surface" id="consent" type="checkbox" />
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="consent">
                    I agree to the privacy policy and data processing terms.
                  </label>
                </div>
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                <button
                  className={`w-full py-4 rounded-xl text-lg font-bold active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed ${submitted ? 'bg-secondary text-on-secondary' : 'bg-primary text-on-primary hover:shadow-lg hover:shadow-primary/20'}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : submitted ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">check_circle</span>
                      Sent Successfully
                    </span>
                  ) : (
                    'Send Message'
                  )}
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
