import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function Profile() {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />

      <main className="pt-32 pb-20 px-4 md:px-16 max-w-screen-2xl mx-auto">
        {/* Profile Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20">
          {/* User Info Card */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-12 rounded-xl shadow-[0_4px_20px_-1px_rgba(107,56,212,0.05)] flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full ring-4 ring-primary-fixed overflow-hidden">
                <img
                  alt="User avatar"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKFfzt44ahuba3KXKYjOfdG1SdAkJpF7GCg-hMNp274aK2uTNz9n_ZYdjX034R-JdUd0g7V_9yWYoFgeh-dcBHFK-0Snt192JHb_PvPHDTgRlJtKbjytJPusX4Q7P7C2BXHIiQuFvXE2kP5TtuFQeSAxIJsMfEf0BXvYQDdz6eMQ7-iPNst0enbGNQQM9X45WShoiCb1CTYRfzn3EWlPy_b-ZgbhZ0wyBPswBqg2IQc19kS-6p3U_ZZLXPUm9seNykPjBEksaJkdPr"
                />
              </div>
              <button className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-[32px] font-bold text-on-surface mb-1">Julian Rivers</h1>
              <p className="text-base leading-relaxed text-on-surface-variant flex items-center justify-center md:justify-start gap-1">
                <span className="material-symbols-outlined text-[18px]">mail</span>
                julian.artshift@creative.ai
              </p>
              <div className="flex gap-3 mt-6 justify-center md:justify-start">
                <span className="bg-primary-fixed text-primary px-4 py-1 rounded-full text-xs font-semibold">Pro Member</span>
                <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-4 py-1 rounded-full text-xs font-semibold">Top Creator</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <a href="/studio" className="bg-primary text-on-primary flex items-center justify-center gap-1 px-6 py-3 rounded-xl text-sm font-semibold active:scale-95 duration-200 shadow-sm">
                <span className="material-symbols-outlined">add</span>
                Create New Art
              </a>
              <button
                className="border border-outline-variant text-on-surface-variant flex items-center justify-center gap-1 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-surface-container-low transition-colors active:scale-95 duration-200"
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                title="Copy profile link"
              >
                <span className="material-symbols-outlined">share</span>
                Share Profile
              </button>
            </div>
          </div>

          {/* Credits Card */}
          <div className="lg:col-span-4 bg-primary-container text-on-primary-container p-12 rounded-xl flex flex-col justify-between overflow-hidden relative group">
            <div className="relative z-10">
              <h3 className="text-sm font-semibold opacity-80 uppercase tracking-[0.15em] mb-6">Current Credits</h3>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-extrabold">842</span>
                <span className="text-sm font-semibold mb-2">/ 1,000</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full mb-2">
                <div className="bg-white h-full rounded-full w-[84%]" />
              </div>
              <p className="text-xs font-semibold opacity-90">Renews on Oct 12, 2024</p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm space-y-2 sticky top-28">
              <h4 className="px-6 text-xs font-semibold text-outline uppercase tracking-wider mb-3">Account Settings</h4>
              <a href="/profile" className="flex items-center gap-6 px-6 py-3 rounded-lg bg-primary-fixed text-primary font-bold transition-all">
                <span className="material-symbols-outlined">person</span>
                Profile
              </a>
              <a href="/profile" className="flex items-center gap-6 px-6 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined">security</span>
                Security
              </a>
              <a href="/shipping" className="flex items-center gap-6 px-6 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined">local_shipping</span>
                Shipping
              </a>
              <a href="/profile" className="flex items-center gap-6 px-6 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined">payments</span>
                Billing
              </a>
              <hr className="border-outline-variant/30 my-3" />
              <a href="/" className="flex items-center gap-6 px-6 py-3 rounded-lg text-error hover:bg-error-container/20 transition-all">
                <span className="material-symbols-outlined">logout</span>
                Sign Out
              </a>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-20">
            {/* My Creations */}
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-on-surface">My Creations</h2>
                  <p className="text-base leading-relaxed text-on-surface-variant">Your latest AI-generated masterpieces</p>
                </div>
                <a href="/gallery" className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline decoration-2 underline-offset-4">
                  View All <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </a>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { name: 'Cyber Dream #01', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh4Be-oSu4GJMsKAF2Ga7DtFeF7N8ZpHLHWtLHUqcu5OHsGJnzHiFWxDiyM5Bo2rt4rm-KCysJf2rcxwcq5v9HLiQxMG-SxAWb4uh97r07s-F2gNTj3uIjMI33r501GdAMwM3BdimZkN379qjl-g6yeA-GC3E0VhpV7FyyDZS7JEkPH-87T9y4cW5NXg7rfI3Dfjtc1TPFY6GcMLYDQTKnp7J1XPSDZAlDEcNA_NoC5H_HHmy5clNZy30RaW_0hMaVoSp7cCG-vN3C' },
                  { name: 'Prism Flux', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcgpFGWJ6hhHX7LqTCjCppCrGkJ8TprFq9M-M2hB55FM6IHoKASGIv4moFDhfOKZuOzG1XrcEDC7yYYVDBtQUhVe96dI1zzzFXi_edU1sxVNO4k3sebXhzlnd2fxJKH9ObL_lA9Z0EO0P_6njHqMW-IuHkC9N9oL8CpxTMRT2xnPqgI2tChe9W_KBiy5SKO_9rAyDOQRpsZe7ILeDJEy3muiDEp2ritVQ31WtNrRYsCi8QirnLTk5T6vNmIcc9YXWVXm6CdjSke5M6' },
                  { name: 'Soft Layering', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhnJZ6JI5sm9AR6G-dPkOqwMTHV-Fhk6DAFZPxm4n_gIQIaBOmsqcg69HiVrLWbFoAvDjolPdZc5Ldz4_W_ru3HJUKs1lfuyVpfEbEgP5dYMPyGF7r5GU12chVc2djJQSsenQpo5Uow_dim3aIUdwGrJQxjYQ3JILsHlh02GuVx8io_P5j_PeqR89yZGzGg55dC74tjAWdwghkFFLa7UcXeSAvvXZJRsOOyR2dHpadBWlNyQ8IuY5QfPX6bP5mdLOuBYpiJvZ8pvsP' },
                ].map((art) => (
                  <div key={art.name} className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer">
                    <img alt={art.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={art.img} />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-on-primary text-sm font-semibold">{art.name}</span>
                      <div className="flex gap-1 mt-1">
                        <span className="material-symbols-outlined text-on-primary text-[16px]">print</span>
                        <span className="material-symbols-outlined text-on-primary text-[16px]">share</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Orders */}
            <section>
              <h2 className="text-2xl font-bold text-on-surface mb-8">Recent Orders</h2>
              <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Product</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {[
                      { id: '#AS-98210', name: 'Cyber Dream Hoodie', status: 'In Transit', statusColor: 'secondary', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQfuj9nwEKm8b5jaO1k7xARn0JFiTswiQuG8JwJdB1Jimss5QFR5znSy2J15MFureek-J6cVk4CMsfNMsRbzCR4e-71D3gitOkBjX5_ZtnR-FU89t8rRJySyh6b5WGb2UZ33Xt_goe6O_9Q6rVRc6BYasnDw2JilixcLQWczNH1DJqmmEbF9lsrYvBS9sPFjoFjXBoLjBKNR57fVyLlpnH3m0Ppgc8Z7PNkLDBCdHc-u_jPpRS1c3IPKqrowt-gcpsj1U-u9OTzMtd', amount: '$84.00' },
                      { id: '#AS-97554', name: 'Prism Flux Tee', status: 'Delivered', statusColor: 'on-surface-variant', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzg6pFnPFYoDgvGE-sY_9MvSs5Y8H0n9vI73SBUDu3Xl5VdAswDu3v7R-o-oTGOjWx5WXe8zqaNtrOtoOQrDRt_nIaG2QdIKR-dhFjpQhE89Ss2zAWiP4DMQpuQebOVBGAIqRMOVotsCJ2_PDLyRlhnwODynJHAIi0HXvCh_ljsB_8qqWIdvowBIF2pr7PmafBTh2Ezb9543vXF57ErdJwFAz-igwYSW7Q28BjyrtL2JHgPwKYkYmMuolhTxM9VfE_evn7UuCtl19G', amount: '$42.00' },
                    ].map((order) => (
                      <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold">{order.id}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
                              <img alt={order.name} className="w-full h-full object-cover" src={order.img} />
                            </div>
                            <span className="text-base leading-relaxed">{order.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1 text-${order.statusColor} text-xs font-semibold ${order.status === 'Delivered' ? 'opacity-60' : ''}`}>
                            {order.status === 'In Transit' ? (
                              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                            ) : (
                              <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            )}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold">{order.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="p-6 bg-surface-container-low/30 text-center">
                  <a href="/profile" className="text-primary text-sm font-semibold hover:underline decoration-2 underline-offset-4">View Full History</a>
                </div>
              </div>
            </section>

            {/* Studio CTA */}
            <section className="relative rounded-2xl bg-gradient-to-r from-primary to-primary-container p-20 overflow-hidden group">
              <div className="relative z-10 max-w-lg">
                <h2 className="text-[32px] font-bold text-on-primary mb-6">Ready to start your next masterpiece?</h2>
                <p className="text-on-primary/80 text-lg leading-relaxed mb-8">Unlock new styles and higher resolution exports with your Pro account tools.</p>
                <a href="/studio" className="bg-white text-primary px-20 py-4 rounded-full text-sm font-semibold shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 inline-block">
                  Launch Studio 2.0
                </a>
              </div>
              <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none transition-transform duration-1000 group-hover:scale-110">
                <img
                  alt="Abstract particles"
                  className="w-full h-full object-cover grayscale brightness-150"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAm4I8KL-RgbW-B5iaV0Gc--BJtt2TXRyY25SHX4i1-hDyUm7gGQj2giSUFpjYBP2t5oLdsH3um4k8q2dzYpok6qTHQIFAsBb2WzPPKj6aeb1C9YSmETajZXnx-dEhOcnDkkvx8vg-dPZa6NKOVG2GM1DA8Lc2sSIM2rZgoBlqgsSNEDpl_nUgOsVKO5zlqCo-0-mj76yEX2NwwePieXfGdQYmcED3SjA4YI8W5N0mX4dcbouKfkVrGhKLeLIRRLw787a_pfqp9L7VJ"
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
