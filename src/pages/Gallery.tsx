import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const cards = [
  {
    type: 'image',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBe_Zir9VLXc2bXGTjPT3t9S51y4mFv_N0dxz-UzjtgdMyJAy841KtuYGuypGfxvq3N4i4ybANPgi2vHUJkKk0mqqpEhjFixOU4ny1Y_bHAlo954fhLR05VoWNbAVbNjXF42nKD9fwtoFJ3M7iEP6ucASl_7v3FgudzoQcsdURG5XaftatiSNPMZ3pRKyCTfs7gZfN-21EEMpdE7SND5Swu1Zymj7EOuh2UghqRtQ6I8-64lbMi5ZoEuvBg-JFs5BcAedMQT5GVRG1',
    prompt: '"Cyberpunk lotus bloom in a digital lake, neon gradients, 8k resolution, intricate linework."',
    author: 'Sarah J.',
    initials: 'SJ',
    stars: 5,
    quote: '"The colors are even more vibrant in person than on my screen! The hoodie is incredibly soft and the AI print is sharp as a razor."',
  },
  {
    type: 'quote',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCaKWGvtZv3z5Tdz70-ao9WTWON-n8SggtAN-1rSGKp7lZerLguZHqZ1StXwLEaAggPhJnEVKS8bqiRYYprYhTuQ2nKjdrs4pglE0pFA6BgQp2zsAHs-OQZYWPOYkWvxg58F7v_Rv8hGePMfef9Vj4GnPTDw9M_KJ-1mrZ8xH8qZB9Uyk_WGMQuFpM9o6-95tGF5Zol3vcuokOHYxI3K3vooUEp9xM3w8PZ3A6WjzQ11pbFDOgEEzx5c7sGNEX6wUx0OoTUkVLrXTq',
    quote: '"Finally, a way to wear my imagination. ArtShift is the bridge between prompt and reality."',
    author: 'Marcus Thorne, Creator',
    quoteFeature: true,
  },
  {
    type: 'image',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYNSFE4Eh7Fr6stsA13TBr-NV9ayJKJ9dcKo9tQi22DqqQoaA7u68kF9fnh1y-z-crb2X5ZCNUEm8pbovgo5KVdm_ViCE3-KCFiYwduf81VQ0o2xG9qbWNhRyUaBe-OsYr8oaoirDnZQKAkHY4BzCdyOshXtllxOXgLmKSet0n5C9Ms3QBZ-f-dTVlyTCS0b7CSGmr-pJJ1wBJVxdEoMiK7gVZd-6EKLvUXPwPrhGxy8iWnCtxBK_xld59rq6Pzb809YKLKvExRp2_',
    prompt: '"Zen minimal crane, sumi-e style, negative space."',
    verified: true,
    stars: 5,
    title: 'Artistry in Every Stitch',
  },
  {
    type: 'highlight',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvC55q24Elbr4v-8kDAplDt33N1EXr6GZoJePyLrZvPlCXYP-c_ZpKjUJ9GIVzRRVlN0WjSD-irWGPUY8VUdi8gsZ7GiG-sUN1hS-Mdx2sr1glCpLyu3TL_adaZCmp68JimN0hgQ2dya9-oN33PDDOzNNuTq0rS-id3J25Wo5KkX7Z5IFdh7GrERMfEMqjWyT5VIV_StTyLVnQWdXkoonhn0oK5n7SnqT5AZdoyfil-9p0EWooRIIFGBmIWDQABCTlpUyG001md5mR',
    quote: '"ArtShift changed how I view fashion. It\'s no longer just clothes; it\'s a canvas for my mood."',
    author: 'Leo X.',
    initials: 'LX',
    likes: 24,
    time: '2 days ago',
  },
  {
    type: 'image',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDttsCrNCMuZ0Wq8YL9wX81FUQ9GbDatzc1suLf3SlMS34ovTHbjTXGmXcz-d4T6IwvjsqvUgb33C6hJRi1ji9WrYBarHNj-_62-Exq8d04q2McKUFnwsrsXLIsC2Ej3WTINRzXAKzOGelXCaQepvRL9LpzDU2qMC4ROaG47rjPKfZVMkHNGIqoL0FcQ2IkCATLvFK0mukpkCARa6m_pKRkyE1T90fWJMvJFbcebGgu-dhqiswa5WzGhoiWe9TPmhXDQR4VeiasUnpc',
    stars: 5,
    quote: '"The detail in the heart illustration is insane. ArtShift\'s AI is on another level."',
    author: 'Elena Ross',
  },
];

export default function Gallery() {
  return (
    <div className="min-h-screen bg-background text-on-surface overflow-x-hidden">
      <Header />

      <main className="pt-24 md:pt-32 pb-12 md:pb-24 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Hero */}
        <section className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant mb-6">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-sm font-semibold">ArtShift Community</span>
          </div>
          <h1 className="text-[32px] md:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight leading-tight">
            Real Creations. <br className="hidden md:block" />Real AI Artistry.
          </h1>
          <p className="text-on-surface-variant text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            Explore a dynamic gallery of custom-made apparel designed by our community and brought to life by ArtShift's precision printing.
          </p>
        </section>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {cards.map((card, i) => (
            <div key={i} className="break-inside-avoid group cursor-pointer">
              <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                {card.type === 'quote' && card.quoteFeature ? (
                  <>
                    <div className="p-6 bg-primary text-on-primary">
                      <span className="material-symbols-outlined text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                      <p className="text-xl md:text-2xl font-bold leading-snug mb-6">{card.quote}</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-on-primary/30 bg-white/20" />
                        <span className="text-sm font-semibold">— {card.author}</span>
                      </div>
                    </div>
                    <div className="relative aspect-square overflow-hidden">
                      <img alt="Surrealist art" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={card.img} />
                    </div>
                  </>
                ) : card.type === 'highlight' ? (
                  <>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">brush</span>
                          <span className="text-sm font-semibold text-on-surface">Creator Highlight</span>
                        </div>
                        <span className="text-on-surface-variant text-xs font-semibold">{card.time}</span>
                      </div>
                      <p className="text-base leading-relaxed text-on-surface mb-6 font-semibold">{card.quote}</p>
                    </div>
                    <div className="relative overflow-hidden aspect-[16/9]">
                      <img alt="Abstract urban sweater" className="w-full h-full object-cover" src={card.img} />
                    </div>
                    <div className="p-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-tertiary-fixed-dim flex items-center justify-center font-bold text-on-tertiary-fixed">{card.initials}</div>
                      <span className="text-sm font-semibold">{card.author}</span>
                      {card.likes && (
                        <div className="ml-auto flex items-center gap-1 text-on-surface-variant">
                          <span className="material-symbols-outlined text-sm">thumb_up</span>
                          <span className="text-xs font-semibold">{card.likes}</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : card.type === 'image' && card.prompt ? (
                  <>
                    <div className="relative overflow-hidden aspect-[4/5]">
                      <img alt="Gallery piece" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={card.img} />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <p className="text-on-primary text-xs font-semibold mb-1 uppercase tracking-wider">Prompt Used</p>
                        <p className="text-on-primary text-sm leading-tight italic">{card.prompt}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-on-secondary-fixed">{card.initials}</div>
                        <div>
                          <h4 className="text-sm font-semibold text-on-surface">{card.author}</h4>
                          <div className="flex text-primary">
                            {Array.from({ length: card.stars || 5 }).map((_, j) => (
                              <span key={j} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-on-surface-variant text-base leading-relaxed">{card.quote}</p>
                    </div>
                  </>
                ) : card.verified ? (
                  <>
                    <div className="relative overflow-hidden aspect-[3/4]">
                      <img alt="Verified creation" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={card.img} />
                      <div className="absolute top-4 right-4 bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Verified
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex gap-1 mb-3">
                        {Array.from({ length: card.stars || 5 }).map((_, j) => (
                          <span key={j} className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                      </div>
                      <h4 className="text-sm font-semibold text-on-surface mb-2">{card.title}</h4>
                      <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30">
                        <span className="text-primary text-[10px] font-semibold uppercase block mb-1">Creation prompt:</span>
                        <span className="text-on-surface text-sm">{card.prompt}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative aspect-square">
                      <img alt="Gallery creation" className="w-full h-full object-cover" src={card.img} />
                      <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Link
                          to="/studio"
                          className="bg-surface-bright text-primary px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg hover:bg-primary hover:text-white transition-colors"
                        >
                          <span className="material-symbols-outlined">shopping_cart</span>
                          Buy Design
                        </Link>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex text-primary mb-2">
                        {Array.from({ length: card.stars || 5 }).map((_, j) => (
                          <span key={j} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>grade</span>
                        ))}
                      </div>
                      <p className="text-on-surface-variant text-base leading-relaxed">{card.quote}</p>
                      <p className="mt-4 text-sm font-semibold text-on-surface">— {card.author}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* CTA Card */}
          <div className="break-inside-avoid group cursor-pointer">
            <div className="bg-surface-container-lowest rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
              <div className="p-8 text-center bg-surface-container-low border-b border-outline-variant/10">
                <h3 className="text-xl md:text-2xl font-bold text-primary mb-2">Create yours today</h3>
                <p className="text-on-surface-variant mb-6 text-sm md:text-base leading-relaxed">
                  Join 50,000+ creators turning prompts into products.
                </p>
                <a href="/studio" className="w-full bg-primary text-on-primary py-3 rounded-lg text-sm font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-2">
                  Get Started
                  <span className="material-symbols-outlined">arrow_forward</span>
                </a>
              </div>
              <div className="p-6 flex items-center justify-center gap-4 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                <span className="material-symbols-outlined text-3xl md:text-4xl">workspace_premium</span>
                <span className="material-symbols-outlined text-3xl md:text-4xl">verified</span>
                <span className="material-symbols-outlined text-3xl md:text-4xl">local_shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="mt-16 md:mt-32 p-8 md:p-12 bg-primary-container rounded-xl text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary-container opacity-20" />
          <div className="relative z-10">
            <h2 className="text-2xl md:text-[32px] font-bold text-on-primary-container mb-4">Inspired by the community?</h2>
            <p className="text-on-primary-container text-base md:text-lg leading-relaxed mb-8 max-w-xl mx-auto opacity-90">
              Your next favorite piece of clothing is just a prompt away. Let AI bring your unique vision to life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/studio" className="w-full sm:w-auto bg-on-primary-container text-primary-container text-sm font-semibold px-10 py-4 rounded-lg shadow-xl hover:scale-105 transition-transform flex items-center justify-center">
                Start Your Creation
              </a>
              <a href="/products" className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-on-primary-container border border-white/20 text-sm font-semibold px-10 py-4 rounded-lg hover:bg-white/20 transition-all flex items-center justify-center">
                View Product Guide
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
