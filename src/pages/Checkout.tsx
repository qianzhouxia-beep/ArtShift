import { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

type PaymentMethod = 'card' | 'paypal' | 'apple';

const VALID_PROMO_CODES: Record<string, number> = {
  ART10: 10,
  FIRST20: 20,
  SHIPFREE: 0, // free shipping
};

interface CartItem {
  name: string;
  size: string;
  color: string;
  price: number;
  image: string | null;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export default function Checkout() {
  const [payment, setPayment] = useState<PaymentMethod>('card');
  const [savedInfo, setSavedInfo] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load cart from localStorage (set by AIStudio)
  const [cartItem] = useState<CartItem>(() => {
    try {
      const saved = localStorage.getItem('artshift_cart');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: 'Custom AI Hoodie',
      size: 'M',
      color: 'Stark White',
      price: 84.99,
      image: null,
    };
  });

  // ── Calculations ──────────────────────────────────────────────────────
  const subtotal = cartItem.price;
  const discountPercent = promoApplied?.percent || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  // Gooten标准运费: 卫衣≈$13.99, T恤≈$9.99 — 用 $13.99 做保守估值
  const BASE_SHIPPING = 13.99;
  const shipping = promoApplied?.code === 'SHIPFREE' ? 0 : BASE_SHIPPING;
  const tax = Math.round((subtotal - discountAmount) * 0.08 * 100) / 100;
  const total = Math.round((subtotal - discountAmount + shipping + tax) * 100) / 100;

  // ── Promo code handler ───────────────────────────────────────────────
  const applyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (!code) {
      setPromoError('Enter a promo code');
      return;
    }
    if (VALID_PROMO_CODES[code] !== undefined) {
      setPromoApplied({ code, percent: VALID_PROMO_CODES[code] });
      setPromoError('');
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code');
      setPromoApplied(null);
    }
  };

  // ── Checkout submit ──────────────────────────────────────────────────
  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (payment === 'card') {
      if (cardNumber.replace(/\s/g, '').length < 16) newErrors.card = 'Enter a valid 16-digit card number';
      if (expiry.replace(/\D/g, '').length < 4) newErrors.expiry = 'Enter a valid expiry (MM/YY)';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Save order to history
    try {
      const history = JSON.parse(localStorage.getItem('artshift_orders') || '[]');
      history.unshift({
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        item: cartItem.name,
        total,
        date: new Date().toISOString(),
      });
      localStorage.setItem('artshift_orders', JSON.stringify(history.slice(0, 20)));
      localStorage.removeItem('artshift_cart');
    } catch {}

    setOrderComplete(true);
  };

  // ── Success overlay ──────────────────────────────────────────────────
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

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header />

      <main className="pt-24 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-screen">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
          {/* ── Left Column: Checkout Form ── */}
          <div className="flex-1 space-y-8 md:space-y-12">
            {/* Progress Stepper */}
            <nav aria-label="Progress" className="mb-8">
              <ol className="flex items-center" role="list">
                <li className="relative flex-1">
                  <div className="flex items-center">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-primary rounded-full">
                      <span className="material-symbols-outlined text-white text-[18px]">
                        check
                      </span>
                    </span>
                    <span className="ml-4 text-label-md text-primary font-semibold">
                      Information
                    </span>
                  </div>
                  <div className="absolute top-4 left-8 w-full h-0.5 bg-primary" />
                </li>
                <li className="relative flex-1">
                  <div className="flex items-center">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-primary rounded-full">
                      <span className="material-symbols-outlined text-white text-[18px]">
                        local_shipping
                      </span>
                    </span>
                    <span className="ml-4 text-label-md text-primary font-semibold">Shipping</span>
                  </div>
                  <div className="absolute top-4 left-8 w-full h-0.5 bg-outline-variant" />
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="relative z-10 w-8 h-8 flex items-center justify-center bg-surface-container border-2 border-outline-variant rounded-full">
                      <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                        payments
                      </span>
                    </span>
                    <span className="ml-4 text-label-md text-on-surface-variant font-semibold">
                      Payment
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            {/* Shipping Address */}
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-luminous">
              <h2 className="text-headline-md mb-6 text-on-surface">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="md:col-span-2">
                  <label className="block text-label-md mb-1 text-on-surface-variant">
                    Full Name
                  </label>
                  <input
                    className="w-full bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none"
                    placeholder="John Doe"
                    type="text"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-label-md mb-1 text-on-surface-variant">
                    Address
                  </label>
                  <input
                    className="w-full bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none"
                    placeholder="123 AI Lane, Studio District"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-label-md mb-1 text-on-surface-variant">City</label>
                  <input
                    className="w-full bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none"
                    placeholder="San Francisco"
                    type="text"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-label-md mb-1 text-on-surface-variant">
                      ZIP Code
                    </label>
                    <input
                      className="w-full bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none"
                      placeholder="94103"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-label-md mb-1 text-on-surface-variant">
                      Country
                    </label>
                    <select className="w-full bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-luminous">
              <h2 className="text-headline-md mb-6 text-on-surface">Payment Method</h2>

              {/* Credit Card */}
              <div
                className={`rounded-xl p-6 mb-3 transition-colors ${
                  payment === 'card'
                    ? 'border-2 border-primary bg-surface/50'
                    : 'border border-outline-variant'
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    checked={payment === 'card'}
                    className="text-primary focus:ring-primary w-5 h-5"
                    name="payment"
                    onChange={() => setPayment('card')}
                    type="radio"
                  />
                  <span className="text-label-md font-semibold">Credit Card</span>
                  <span className="material-symbols-outlined text-on-surface-variant ml-auto">
                    credit_card
                  </span>
                </label>

                {payment === 'card' && (
                  <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-outline-variant/30">
                    <div className="col-span-2">
                      <label className="block text-label-sm mb-1 text-on-surface-variant">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          className={`w-full bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none ${errors.card ? 'ring-2 ring-red-400' : ''}`}
                          onChange={(e) => { setCardNumber(formatCardNumber(e.target.value)); setErrors((p) => { const { card, ...r } = p; return r; }); }}
                          placeholder="0000 0000 0000 0000"
                          type="text"
                          value={cardNumber}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">
                          lock
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-label-sm mb-1 text-on-surface-variant">
                        Expiry Date
                      </label>
                      <input
                        className={`w-full bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none ${errors.expiry ? 'ring-2 ring-red-400' : ''}`}
                        onChange={(e) => { setExpiry(formatExpiry(e.target.value)); setErrors((p) => { const { expiry, ...r } = p; return r; }); }}
                        placeholder="MM/YY"
                        type="text"
                        value={expiry}
                      />
                    </div>
                    <div>
                      <label className="block text-label-sm mb-1 text-on-surface-variant">
                        CVV
                      </label>
                      <input
                        className="w-full bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none"
                        placeholder="123"
                        type="text"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* PayPal */}
              <label
                className={`flex items-center justify-between rounded-xl p-6 mb-3 cursor-pointer transition-colors ${
                  payment === 'paypal'
                    ? 'border-2 border-primary bg-surface/50'
                    : 'border border-outline-variant hover:border-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    checked={payment === 'paypal'}
                    className="text-primary focus:ring-primary w-5 h-5"
                    name="payment"
                    onChange={() => setPayment('paypal')}
                    type="radio"
                  />
                  <span className="text-label-md font-semibold">PayPal</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">
                  account_balance_wallet
                </span>
              </label>

              {/* Apple Pay */}
              <label
                className={`flex items-center justify-between rounded-xl p-6 cursor-pointer transition-colors ${
                  payment === 'apple'
                    ? 'border-2 border-primary bg-surface/50'
                    : 'border border-outline-variant hover:border-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    checked={payment === 'apple'}
                    className="text-primary focus:ring-primary w-5 h-5"
                    name="payment"
                    onChange={() => setPayment('apple')}
                    type="radio"
                  />
                  <span className="text-label-md font-semibold">Apple Pay</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant">
                  contactless
                </span>
              </label>

              <div className="mt-6 flex items-center gap-3">
                <input
                  checked={savedInfo}
                  className="rounded text-primary focus:ring-primary h-5 w-5 border-outline-variant"
                  id="save_info"
                  onChange={(e) => setSavedInfo(e.target.checked)}
                  type="checkbox"
                />
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
                      <img
                        alt={cartItem.name}
                        className="w-full h-full object-cover"
                        src={cartItem.image}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-outline">shopping_bag</span>
                    )}
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-label-sm px-2 py-0.5 rounded-full">
                      1
                    </span>
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
                    <input
                      className="flex-1 bg-[#f1f5f9] border-none rounded-lg p-4 focus:ring-2 focus:ring-primary transition-all text-body-md outline-none"
                      disabled={!!promoApplied}
                      onChange={(e) => { setPromoCode(e.target.value); setPromoError(''); }}
                      onKeyDown={(e) => { if (e.key === 'Enter') applyPromo(); }}
                      placeholder="Promo code"
                      type="text"
                      value={promoApplied ? `${promoApplied.code} applied ✓` : promoCode}
                    />
                    {promoApplied ? (
                      <button
                        className="bg-red-50 text-red-500 px-4 rounded-lg text-label-sm font-semibold hover:bg-red-100 transition-colors whitespace-nowrap"
                        onClick={() => { setPromoApplied(null); setPromoCode(''); }}
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        className="bg-surface-variant text-on-surface-variant px-6 rounded-lg text-label-md font-semibold hover:bg-vivid-purple hover:text-white transition-colors whitespace-nowrap"
                        onClick={applyPromo}
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {promoError && (
                    <p className="text-red-500 text-label-sm ml-1">{promoError}</p>
                  )}
                  {promoApplied && discountPercent > 0 && (
                    <p className="text-green-600 text-label-sm ml-1">-{discountPercent}% discount applied!</p>
                  )}
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
                    <span className="text-label-sm text-on-surface-variant block uppercase tracking-wider">
                      USD
                    </span>
                    <span className="text-headline-lg text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Card validation errors */}
                {(errors.card || errors.expiry) && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    {errors.card && <p className="text-red-600 text-label-sm">{errors.card}</p>}
                    {errors.expiry && <p className="text-red-600 text-label-sm">{errors.expiry}</p>}
                  </div>
                )}

                {/* CTA */}
                <button
                  className="w-full bg-primary text-white py-5 rounded-full text-headline-md flex items-center justify-center gap-3 active:scale-95 transition-all shadow-md shadow-primary/20 hover:bg-primary-container"
                  onClick={handleSubmit}
                >
                  <span className="material-symbols-outlined">lock</span>
                  Complete Purchase
                </button>

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
