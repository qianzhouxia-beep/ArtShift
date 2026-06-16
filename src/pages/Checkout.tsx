import { useState, useRef, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const API_BASE = import.meta.env.VITE_API_URL || '';
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb'; // 'sb' = sandbox

type PaymentMethod = 'card' | 'paypal' | 'apple';

const VALID_PROMO_CODES: Record<string, number> = {
  ART10: 10,
  FIRST20: 20,
  SHIPFREE: 0,
};

// Product slug → Gooten SKU mapping (for order submission)
const PRODUCT_SKU: Record<string, string> = {
  hoodie: 'Apparel-DTG-Hoodie-Gildan-18500-L-SportGrey-Mens-CF',
  sweatshirt: 'Apparel-DTG-Sweatshirt-AA-F496-L-Black-Unisex-CF',
  tshirt: 'Apparel-DTG-TShirt-NL-3900-L-Navy-Womens-CF',
  bag: 'ToteBag-16x16',
  mug: '',
  phonecase: 'PremiumPhoneCase-iPhone-14-Pro-Max-SnapCaseGloss',
};

// ── Component ────────────────────────────────────────────────────────

export default function Checkout() {
  const [payment, setPayment] = useState<PaymentMethod>('paypal'); // default to PayPal
  const [savedInfo, setSavedInfo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const paypalBtnRef = useRef<HTMLDivElement>(null);

  // Address state
  const [address, setAddress] = useState({
    fullName: '',
    line1: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States',
    email: '',
  });

  // Cart from localStorage
  const [cartItem] = useState(() => {
    try {
      const saved = localStorage.getItem('artshift_cart');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { name: 'Custom AI Hoodie', size: 'M', color: 'Stark White', price: 84.99, image: null as string | null };
  });

  // ── Calculations ───────────────────────────────────────────────────
  const subtotal = cartItem.price;
  const discountPercent = promoApplied?.percent || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const BASE_SHIPPING = 13.99;
  const shipping = promoApplied?.code === 'SHIPFREE' ? 0 : BASE_SHIPPING;
  const tax = Math.round((subtotal - discountAmount) * 0.08 * 100) / 100;
  const total = Math.round((subtotal - discountAmount + shipping + tax) * 100) / 100;

  // ── Submit order to backend + Gooten ──────────────────────────────
  const submitOrder = async (paypalTransactionId?: string) => {
    setSubmitting(true);
    try {
      // Determine Gooten SKU from product name
      const nameLower = cartItem.name.toLowerCase();
      const productKey = Object.keys(PRODUCT_SKU).find((k) => nameLower.includes(k)) || 'hoodie';
      const sku = PRODUCT_SKU[productKey] || PRODUCT_SKU.hoodie;

      const payload = {
        shipping: {
          first_name: address.fullName.split(' ')[0] || 'Customer',
          last_name: address.fullName.split(' ').slice(1).join(' ') || address.fullName,
          line1: address.line1,
          city: address.city,
          state: address.state,
          country: address.country === 'United States' ? 'US' : address.country,
          postal: address.zip,
          email: address.email || 'customer@artshift.ai',
          phone: '',
        },
        items: [
          {
            sku,
            quantity: 1,
            image_url: cartItem.image || '',
            price: cartItem.price,
          },
        ],
        currency: 'USD',
        is_test: true,
        reference: `artshift-${Date.now()}`,
        paypal_order_id: paypalTransactionId || '',
      };

      const resp = await fetch(`${API_BASE}/api/gooten/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();

      if (data.ok) {
        const gootenOrderId = data.data?.order_id || '';
        // Save to local history
        const history = JSON.parse(localStorage.getItem('artshift_orders') || '[]');
        history.unshift({
          id: `ORD-${Date.now().toString(36).toUpperCase()}`,
          gootenId: gootenOrderId,
          item: cartItem.name,
          total,
          paypalTx: paypalTransactionId || '',
          date: new Date().toISOString(),
        });
        localStorage.setItem('artshift_orders', JSON.stringify(history.slice(0, 20)));
        localStorage.removeItem('artshift_cart');
        setOrderId(gootenOrderId || 'confirmed');
        setOrderComplete(true);
      } else {
        setErrors({ submit: data.error || 'Order submission failed' });
      }
    } catch (err: any) {
      setErrors({ submit: err.message || 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── PayPal Button Render ──────────────────────────────────────────
  useEffect(() => {
    if (payment !== 'paypal' || !paypalBtnRef.current || orderComplete) return;

    // Load PayPal SDK
    const scriptId = 'paypal-sdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
      script.onload = renderPayPalButton;
      document.head.appendChild(script);
    } else {
      renderPayPalButton();
    }

    function renderPayPalButton() {
      if (!paypalBtnRef.current || !(window as any).paypal) return;
      paypalBtnRef.current.innerHTML = '';
      (window as any).paypal.Buttons({
        createOrder: (_data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: total.toFixed(2) }, description: cartItem.name }],
          });
        },
        onApprove: async (_data: any, actions: any) => {
          const details = await actions.order.capture();
          const txId = details.id || '';
          await submitOrder(txId);
        },
        onError: (err: any) => {
          setErrors({ paypal: err.message || 'PayPal payment failed' });
        },
        style: { layout: 'vertical', color: 'blue', shape: 'rect', label: 'paypal' },
      }).render(paypalBtnRef.current);
    }
  }, [payment, total, orderComplete]);

  // ── Promo handler ──────────────────────────────────────────────────
  const applyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (!code) { setPromoError('Enter a promo code'); return; }
    if (VALID_PROMO_CODES[code] !== undefined) {
      setPromoApplied({ code, percent: VALID_PROMO_CODES[code] });
      setPromoError('');
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(null);
    }
  };

  // ── Success Screen ─────────────────────────────────────────────────
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-surface text-on-surface">
        <Header />
        <main className="pt-24 pb-16 px-4 flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-bounce">
              <span className="material-symbols-outlined text-4xl text-green-600">check</span>
            </div>
            <h1 className="text-headline-lg font-extrabold mb-4">Order Confirmed!</h1>
            <p className="text-on-surface-variant text-body-lg mb-2">
              Your {cartItem.name} is being processed.
            </p>
            <p className="text-on-surface-variant text-body-md mb-2">
              Order ID: <span className="font-mono text-primary">{orderId}</span>
            </p>
            <p className="text-on-surface-variant text-body-md mb-8">
              You'll receive a confirmation email shortly. Production takes 3-5 business days.
            </p>
            <a
              href="/profile"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary-container transition-colors shadow-md"
            >
              <span className="material-symbols-outlined">receipt_long</span>
              View Order
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Main Checkout UI ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header />

      <main className="pt-24 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
          {/* ── Left Column ── */}
          <div className="flex-1 space-y-8 md:space-y-12">
            {/* Progress Stepper */}
            <nav aria-label="Progress" className="mb-8">
              <ol className="flex items-center" role="list">
                <li className="relative flex-1">
                  <div className="flex items-center">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-primary rounded-full">
                      <span className="material-symbols-outlined text-white text-[18px]">check</span>
                    </span>
                    <span className="ml-4 text-label-md text-primary font-semibold">Information</span>
                  </div>
                  <div className="absolute top-4 left-8 w-full h-0.5 bg-primary" />
                </li>
                <li className="relative flex-1">
                  <div className="flex items-center">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-primary rounded-full">
                      <span className="material-symbols-outlined text-white text-[18px]">local_shipping</span>
                    </span>
                    <span className="ml-4 text-label-md text-primary font-semibold">Shipping</span>
                  </div>
                  <div className="absolute top-4 left-8 w-full h-0.5 bg-outline-variant" />
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-surface-container border-2 border-outline-variant rounded-full">
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">payments</span>
                    </span>
                    <span className="ml-4 text-label-md text-on-surface-variant font-semibold">Payment</span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Shipping Address */}
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-luminous">
              <h2 className="text-headline-md mb-6 text-on-surface">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="md:col-span-2">
                  <label className="block text-label-md mb-1 text-on-surface-variant">Full Name</label>
                  <input className="w-full bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none"
                    placeholder="John Doe" type="text" value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-label-md mb-1 text-on-surface-variant">Address</label>
                  <input className="w-full bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none"
                    placeholder="123 AI Lane" type="text" value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
                </div>
                <div>
                  <label className="block text-label-md mb-1 text-on-surface-variant">City</label>
                  <input className="w-full bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none"
                    placeholder="San Francisco" type="text" value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-label-md mb-1 text-on-surface-variant">ZIP Code</label>
                    <input className="w-full bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none"
                      placeholder="94103" type="text" value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-label-md mb-1 text-on-surface-variant">Country</label>
                    <select className="w-full bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none"
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}>
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-label-md mb-1 text-on-surface-variant">Email</label>
                  <input className="w-full bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none"
                    placeholder="hello@artshift.ai" type="email" value={address.email}
                    onChange={(e) => setAddress({ ...address, email: e.target.value })} />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-luminous">
              <h2 className="text-headline-md mb-6 text-on-surface">Payment Method</h2>

              {/* PayPal (default & only) */}
              <div className="rounded-xl p-6 border-2 border-primary bg-surface/50">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked className="text-primary focus:ring-primary w-5 h-5"
                    name="payment" onChange={() => setPayment('paypal')} type="radio" />
                  <span className="text-label-md font-semibold">PayPal</span>
                  <span className="text-on-surface-variant ml-auto text-sm">Recommended</span>
                </label>
                <div className="mt-5 pt-4 border-t border-outline-variant/30">
                  <div ref={paypalBtnRef} className="min-h-[40px]" />
                  <p className="text-label-sm text-on-surface-variant mt-2 text-center">
                    Secure payment via PayPal. Credit/debit cards also accepted without a PayPal account.
                  </p>
                </div>
              </div>

              {/* Credit Card & Apple Pay — coming soon via PayPal guest checkout */}
              <div className="rounded-xl p-6 border border-outline-variant opacity-60 pointer-events-none">
                <div className="flex items-center gap-3">
                  <span className="inline-block w-5 h-5 rounded-full border-2 border-outline-variant" />
                  <span className="text-label-md font-semibold">Credit Card</span>
                  <span className="material-symbols-outlined text-on-surface-variant ml-auto">credit_card</span>
                </div>
                <p className="text-label-sm text-on-surface-variant mt-2">Pay via PayPal guest checkout — no account required.</p>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <input checked={savedInfo} className="rounded text-primary focus:ring-primary h-5 w-5 border-outline-variant"
                  id="save_info" onChange={(e) => setSavedInfo(e.target.checked)} type="checkbox" />
                <label className="text-body-md text-on-surface-variant cursor-pointer" htmlFor="save_info">
                  Save information for next time
                </label>
              </div>
            </section>
          </div>

          {/* ── Right Column: Order Summary ── */}
          <aside className="lg:w-[400px]">
            <div className="sticky top-24 space-y-6">
              <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-luminous border border-surface-variant">
                <h2 className="text-headline-md mb-6">Order Summary</h2>

                {/* Product Preview */}
                <div className="flex gap-6 mb-8">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-surface-container flex items-center justify-center">
                    {cartItem.image ? (
                      <img alt={cartItem.name} className="w-full h-full object-cover" src={cartItem.image} />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-outline">shopping_bag</span>
                    )}
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-label-sm px-2 py-0.5 rounded-full">1</span>
                  </div>
                  <div className="flex-1 py-1">
                    <h3 className="text-label-md font-semibold text-on-surface">{cartItem.name}</h3>
                    <p className="text-body-md text-on-surface-variant">Size: {cartItem.size}</p>
                    <p className="text-body-md text-on-surface-variant">Color: {cartItem.color}</p>
                    <p className="text-label-md font-semibold text-primary mt-1">${cartItem.price.toFixed(2)}</p>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-4">
                  <div className="flex gap-3 mb-1">
                    <input className="flex-1 bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none"
                      disabled={!!promoApplied} onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') applyPromo(); }}
                      placeholder="Promo code" type="text"
                      value={promoApplied ? `${promoApplied.code} applied ✓` : promoCode} />
                    {promoApplied ? (
                      <button className="bg-red-50 text-red-500 px-4 rounded-lg text-label-sm font-semibold hover:bg-red-100 transition-colors whitespace-nowrap"
                        onClick={() => { setPromoApplied(null); setPromoCode(''); }}>Remove</button>
                    ) : (
                      <button className="bg-surface-variant text-on-surface-variant px-6 rounded-lg text-label-md font-semibold hover:bg-vivid-purple hover:text-white transition-colors whitespace-nowrap"
                        onClick={applyPromo}>Apply</button>
                    )}
                  </div>
                  {promoError && <p className="text-red-500 text-label-sm ml-1">{promoError}</p>}
                  {promoApplied && discountPercent > 0 && <p className="text-green-600 text-label-sm ml-1">-{discountPercent}% discount applied!</p>}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 border-b border-surface-variant pb-6">
                  <div className="flex justify-between text-body-md">
                    <span className="text-on-surface-variant">Subtotal</span>
                    <span className="text-on-surface">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-body-md">
                      <span className="text-green-600">Discount ({promoApplied?.code})</span>
                      <span className="text-green-600 font-semibold">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-body-md">
                    <span className="text-on-surface-variant">Shipping</span>
                    <span className={shipping === 0 ? 'text-secondary font-bold' : 'text-on-surface'}>
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-body-md">
                    <span className="text-on-surface-variant">Estimated Tax</span>
                    <span className="text-on-surface">${tax.toFixed(2)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-8">
                  <span className="text-headline-md">Total</span>
                  <div className="text-right">
                    <span className="text-label-sm text-on-surface-variant block uppercase tracking-wider">USD</span>
                    <span className="text-headline-lg text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Errors */}
                {(errors.submit || errors.paypal) && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    {errors.submit && <p className="text-red-600 text-label-sm">{errors.submit}</p>}
                    {errors.paypal && <p className="text-red-600 text-label-sm">{errors.paypal}</p>}
                  </div>
                )}

                {/* Trust Signals */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-on-surface-variant opacity-80">
                    <span className="material-symbols-outlined text-primary">verified_user</span>
                    <span className="text-label-sm">Secure 256-bit SSL Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant opacity-80">
                    <span className="material-symbols-outlined text-primary">autorenew</span>
                    <span className="text-label-sm">30-day effortless return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
