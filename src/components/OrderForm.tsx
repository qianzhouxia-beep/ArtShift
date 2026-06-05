import { useState } from 'react';
import {
  ArrowLeft, ShoppingBag, Loader2, CheckCircle,
  CreditCard, Truck, User, Package
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
interface ProductVariant {
  id: number | string;
  name: string;
  size: string;
  color: string;
  price: number | null;
  available: boolean;
}

interface Product {
  id: number;
  name: string;
  thumbnail: string | null;
  retail_price: number | null;
  currency: string;
  mockups: string[];
  variants: ProductVariant[];
}

interface ShippingAddress {
  name: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface Props {
  product: Product;
  designUrl?: string | null;
  onBack: () => void;
  t: (key: string) => string;
}

// ─── API Config ───────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'https://artshift-backend.zeabur.app/api';

// ─── Currency Formatter ───────────────────────────────────────
const fmt = (price: number | null, currency = 'USD') => {
  if (price == null) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
};

// ─── Component ─────────────────────────────────────────────────
export default function OrderForm({ product, designUrl: initialDesignUrl, onBack }: Props) {
  const [step, setStep] = useState<'form' | 'submitting' | 'success' | 'error'>('form');
  const [variantId, setVariantId] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [designUrl, setDesignUrl] = useState(initialDesignUrl || '');
  const [designPrompt, setDesignPrompt] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [shipping, setShipping] = useState<ShippingAddress>({
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    phone: '',
  });
  const [orderResult, setOrderResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Filter available variants
  const availableVariants = product.variants.filter((v) => v.available);
  const selectedVariant = availableVariants.find(
    (v) => String(v.id) === variantId
  );

  // Calculate price
  const unitPrice = selectedVariant?.price ?? product.retail_price ?? 29.99;
  const totalPrice = (unitPrice || 0) * quantity;

  const updateShipping = (field: keyof ShippingAddress, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!variantId) {
      setErrorMsg('Please select a variant (size + color).');
      return;
    }
    if (!customerEmail || !customerEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!shipping.name || !shipping.address1 || !shipping.city || !shipping.zip) {
      setErrorMsg('Please fill in all required shipping fields.');
      return;
    }

    setStep('submitting');

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_email: customerEmail,
          product_id: String(product.id),
          variant_id: variantId,
          price: totalPrice,
          quantity,
          design_url: designUrl,
          design_prompt: designPrompt,
          shipping_address: shipping,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      setOrderResult(data);
      setStep('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
      setStep('error');
    }
  };

  // ─── Success Screen ──────────────────────────────────────
  if (step === 'success') {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Order Created!</h2>
          <p className="text-gray-600 mb-6">
            Your order <span className="font-mono font-bold text-violet-600">{orderResult?.order_number}</span> has been placed.
          </p>

          <div className="rounded-2xl p-6 bg-white border border-gray-100 text-left mb-8">
            <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Product</span>
                <span className="font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Variant</span>
                <span className="font-medium">{selectedVariant?.name || variantId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Quantity</span>
                <span className="font-medium">{quantity}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-violet-600">{fmt(totalPrice)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold text-white transition-all duration-200 hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            <ArrowLeft size={16} /> Back to Products
          </button>
        </div>
      </section>
    );
  }

  // ─── Order Form ──────────────────────────────────────────
  return (
    <section className="min-h-screen py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Products</span>
        </button>

        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
          Create Your Order
        </h2>
        <p className="text-gray-500 mb-10">
          Customize your <span className="font-semibold text-gray-700">{product.name}</span> and place your order.
        </p>

        <form onSubmit={handleSubmit}>
          {/* ─── Product Summary ──────────────────────────── */}
          <div className="rounded-2xl p-5 bg-white border border-gray-100 mb-6 flex gap-4 items-center">
            <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0">
              {product.mockups[0] ? (
                <img src={product.mockups[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <Package size={28} className="text-gray-300" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">
                {availableVariants.length} variants available
              </p>
            </div>
          </div>

          {/* ─── Variant Selection ────────────────────────── */}
          <div className="rounded-2xl p-6 bg-white border border-gray-100 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={18} className="text-violet-500" />
              Select Variant
            </h3>
            {availableVariants.length === 0 ? (
              <p className="text-sm text-red-500">No variants available for this product.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                {availableVariants.map((v) => (
                  <button
                    key={String(v.id)}
                    type="button"
                    onClick={() => setVariantId(String(v.id))}
                    className={`rounded-xl px-4 py-3 text-left text-sm border-2 transition-all duration-200 ${
                      variantId === String(v.id)
                        ? 'border-violet-500 bg-violet-50 text-violet-900'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{v.size || v.name}</div>
                    <div className="text-xs text-gray-400">{v.color}</div>
                    {v.price && <div className="text-xs font-bold text-violet-600 mt-1">{fmt(v.price)}</div>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Design ────────────────────────────────────── */}
          <div className="rounded-2xl p-6 bg-white border border-gray-100 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-violet-500" />
              Your Design
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Design Image URL
                </label>
                <input
                  type="url"
                  value={designUrl}
                  onChange={(e) => setDesignUrl(e.target.value)}
                  placeholder="https://example.com/my-design.png"
                  className="w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Design Prompt (optional)
                </label>
                <textarea
                  value={designPrompt}
                  onChange={(e) => setDesignPrompt(e.target.value)}
                  placeholder="Describe your design idea..."
                  rows={2}
                  className="w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 rounded-xl px-4 py-3 text-sm text-gray-900 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* ─── Customer Info ─────────────────────────────── */}
          <div className="rounded-2xl p-6 bg-white border border-gray-100 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <User size={18} className="text-violet-500" />
              Customer
            </h3>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* ─── Shipping Address ──────────────────────────── */}
          <div className="rounded-2xl p-6 bg-white border border-gray-100 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Truck size={18} className="text-violet-500" />
              Shipping Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={shipping.name}
                  onChange={(e) => updateShipping('name', e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Address Line 1 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={shipping.address1}
                  onChange={(e) => updateShipping('address1', e.target.value)}
                  placeholder="123 Main St"
                  className="w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={shipping.address2}
                  onChange={(e) => updateShipping('address2', e.target.value)}
                  placeholder="Apt 4B"
                  className="w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={shipping.city}
                  onChange={(e) => updateShipping('city', e.target.value)}
                  placeholder="New York"
                  className="w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={shipping.state}
                  onChange={(e) => updateShipping('state', e.target.value)}
                  placeholder="NY"
                  className="w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  ZIP / Postal Code <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={shipping.zip}
                  onChange={(e) => updateShipping('zip', e.target.value)}
                  placeholder="10001"
                  className="w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Country <span className="text-red-400">*</span>
                </label>
                <select
                  value={shipping.country}
                  onChange={(e) => updateShipping('country', e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-gray-900 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="AU">Australia</option>
                  <option value="JP">Japan</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={shipping.phone}
                  onChange={(e) => updateShipping('phone', e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* ─── Error ─────────────────────────────────────── */}
          {errorMsg && (
            <div className="rounded-xl p-4 bg-red-50 border border-red-200 mb-6">
              <p className="text-sm text-red-600">{errorMsg}</p>
            </div>
          )}

          {/* ─── Order Summary + Submit ────────────────────── */}
          <div className="rounded-2xl p-6 bg-white border border-gray-100 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-500">{product.name}</span>
                <span className="font-medium">{fmt(unitPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Quantity</span>
                <span className="font-medium">x{quantity}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-violet-600">{fmt(totalPrice)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={step === 'submitting'}
              className="w-full rounded-xl px-8 py-4 text-sm font-bold text-white transition-all duration-200 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              {step === 'submitting' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Order...
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  Place Order — {fmt(totalPrice)}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
