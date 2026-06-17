import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://artshift-backend.zeabur.app/api';

interface Order {
  id: number;
  order_number: string;
  product_name: string;
  price: number;
  currency: string;
  status: string;
  payment_status: string;
  tracking_number: string | null;
  created_at: string;
}

export default function Profile() {
  const { user, token, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!token) { setOrdersLoading(false); return; }
    fetch(`${API_URL}/api/me/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setOrders(data.orders || []);
      })
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface text-on-surface">
        <Header />
        <main className="pt-32 pb-20 px-4 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl text-outline mb-4 block">person_off</span>
            <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
            <p className="text-on-surface-variant mb-6">Sign in to view your profile and orders.</p>
            <Link to="/signup" className="bg-primary text-white px-8 py-3 rounded-full font-semibold">Sign In</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      pending: 'Pending', processing: 'Processing', production: 'In Production',
      shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled', refunded: 'Refunded',
    };
    return map[s] || s;
  };

  const statusColor = (s: string) => {
    if (s === 'delivered') return 'text-green-600';
    if (s === 'cancelled' || s === 'refunded') return 'text-red-500';
    if (s === 'shipped') return 'text-blue-600';
    return 'text-amber-600';
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Header />

      <main className="pt-32 pb-20 px-4 md:px-16 max-w-screen-2xl mx-auto">
        {/* Profile Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-20">
          {/* User Info Card */}
          <div className="lg:col-span-8 bg-surface-container-lowest p-12 rounded-xl shadow-[0_4px_20px_-1px_rgba(107,56,212,0.05)] flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full ring-4 ring-primary-fixed overflow-hidden bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-5xl text-primary">person</span>
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-[32px] font-bold text-on-surface mb-1">
                {user.name || 'Artist'}
              </h1>
              <p className="text-base leading-relaxed text-on-surface-variant flex items-center justify-center md:justify-start gap-1">
                <span className="material-symbols-outlined text-[18px]">mail</span>
                {user.email}
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <Link
                to="/studio"
                className="bg-primary text-on-primary flex items-center justify-center gap-1 px-6 py-3 rounded-xl text-sm font-semibold active:scale-95 duration-200 shadow-sm"
              >
                <span className="material-symbols-outlined">add</span>
                Create New Art
              </Link>
            </div>
          </div>

          {/* Credits Card */}
          <div className="lg:col-span-4 bg-primary-container text-on-primary-container p-12 rounded-xl flex flex-col justify-between overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-sm font-semibold opacity-80 uppercase tracking-[0.15em] mb-6">Available Credits</h3>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-5xl font-extrabold">{user.credits || 0}</span>
                <span className="text-sm font-semibold mb-2">credits</span>
              </div>
              <p className="text-xs font-semibold opacity-90">
                {user.credits ? `${user.credits} credits available for AI generation` : 'Purchase credits to start creating'}
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm space-y-2 sticky top-28">
              <h4 className="px-6 text-xs font-semibold text-outline uppercase tracking-wider mb-3">Account</h4>
              <span className="flex items-center gap-6 px-6 py-3 rounded-lg bg-primary-fixed text-primary font-bold transition-all">
                <span className="material-symbols-outlined">person</span>
                Profile
              </span>
              <Link to="/shipping" className="flex items-center gap-6 px-6 py-3 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined">local_shipping</span>
                Shipping Info
              </Link>
              <hr className="border-outline-variant/30 my-3" />
              <button
                onClick={() => { localStorage.removeItem('artshift_token'); window.location.href = '/'; }}
                className="w-full flex items-center gap-6 px-6 py-3 rounded-lg text-error hover:bg-error-container/20 transition-all"
              >
                <span className="material-symbols-outlined">logout</span>
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-20">
            {/* Orders */}
            <section>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-on-surface">My Orders</h2>
                  <p className="text-base leading-relaxed text-on-surface-variant">Your recent print-on-demand orders</p>
                </div>
              </div>

              {ordersLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-xl p-12 text-center border border-outline-variant/20">
                  <span className="material-symbols-outlined text-4xl text-outline mb-3 block">receipt_long</span>
                  <h3 className="text-lg font-semibold mb-2">No Orders Yet</h3>
                  <p className="text-on-surface-variant mb-6">Start creating AI artwork and order your first custom product.</p>
                  <Link to="/studio" className="text-primary font-semibold hover:underline">Create Your First Design</Link>
                </div>
              ) : (
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
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-6 py-4 text-sm font-semibold font-mono">
                            {order.order_number || `#${order.id}`}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-base leading-relaxed">{order.product_name || 'Custom Apparel'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`flex items-center gap-1 text-xs font-semibold ${statusColor(order.status)}`}>
                              {order.status === 'processing' || order.status === 'production' ? (
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                              ) : order.status === 'delivered' ? (
                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                              ) : null}
                              {statusLabel(order.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-sm font-semibold">
                            ${order.price?.toFixed(2) || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Studio CTA */}
            <section className="relative rounded-2xl bg-gradient-to-r from-primary to-primary-container p-12 md:p-20 overflow-hidden group">
              <div className="relative z-10 max-w-lg">
                <h2 className="text-[32px] font-bold text-on-primary mb-6">Ready to create?</h2>
                <p className="text-on-primary/80 text-lg leading-relaxed mb-8">Design your next custom apparel piece with AI-powered art generation.</p>
                <Link to="/studio" className="bg-white text-primary px-8 py-4 rounded-full text-sm font-semibold shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 inline-block">
                  Launch Studio
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
