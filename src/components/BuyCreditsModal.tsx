import { X, Zap, Star, Sparkles } from 'lucide-react';
import { useState } from 'react';

const CREDIT_PACKS = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 10,
    price: '$5',
    priceUsd: 5,
    popular: false,
    description: 'Perfect for trying out ArtShift',
  },
  {
    id: 'popular',
    name: 'Popular Pack',
    credits: 35,
    price: '$15',
    priceUsd: 15,
    popular: true,
    description: 'Best value for regular users',
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 80,
    price: '$30',
    priceUsd: 30,
    popular: false,
    description: 'For power users & professionals',
  },
];

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyCreditsModal({ isOpen, onClose }: BuyCreditsModalProps) {
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBuy = async (packId: string) => {
    setLoadingPack(packId);
    try {
      // Call backend to create PayPal order and get approval URL
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        alert('Failed to create payment. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoadingPack(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}>
      <div className="relative w-full max-w-4xl mx-4 bg-white rounded-3xl shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Buy Credits
          </h2>
          <p className="text-gray-600">
            Choose a credit pack to unlock AI image generation
          </p>
        </div>

        {/* Credit Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`relative rounded-2xl p-6 border-2 transition-all duration-200 hover:shadow-lg ${
                pack.popular
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              {/* Popular Badge */}
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </div>
              )}

              {/* Pack Icon */}
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${
                  pack.popular ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  {pack.id === 'starter' && <Zap size={24} className="text-blue-500" />}
                  {pack.id === 'popular' && <Star size={24} className="text-purple-500" />}
                  {pack.id === 'pro' && <Sparkles size={24} className="text-pink-500" />}
                </div>
              </div>

              {/* Pack Name */}
              <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
                {pack.name}
              </h3>

              {/* Credits */}
              <div className="text-center mb-4">
                <span className="text-3xl font-extrabold text-gray-900">
                  {pack.credits}
                </span>
                <span className="text-gray-600 ml-1">credits</span>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <span className="text-2xl font-bold text-gray-900">{pack.price}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 text-center mb-6">
                {pack.description}
              </p>

              {/* Buy Button */}
              <button
                onClick={() => handleBuy(pack.id)}
                disabled={loadingPack === pack.id}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  pack.popular
                    ? 'bg-gradient-to-r from-[#0070ba] to-[#003087] text-white hover:shadow-lg hover:scale-105'
                    : 'bg-[#0070ba] text-white hover:bg-[#005ea6]'
                } ${loadingPack === pack.id ? 'opacity-70 cursor-wait' : ''}`}
              >
                {loadingPack === pack.id ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H9.38c-.62 0-1.144.45-1.239 1.063l-.002.014-1.063 6.75zM19.825 7.78c-.036-.23-.066-.468-.09-.71a6.02 6.02 0 0 0-.367-1.488c-.77-1.978-2.425-3.083-4.89-3.582H14.44l.001-.003C13.82 1.998 12.86 1.5 11.46 1.5H5.998c-.352 0-.656.245-.73.59L2.467 20.64a.745.745 0 0 0 .734.857h4.47l1.127-7.152.004-.026c.095-.613.618-1.063 1.238-1.063h1.155c4.298 0 7.664-1.747 8.647-6.797.03-.149.054-.294.077-.437.276-1.763-.022-2.96-.995-4.05z"/>
                    </svg>
                    Pay with PayPal
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🔒 Secure payment powered by PayPal</p>
          <p className="mt-1">Credits will be added to your account immediately after payment</p>
        </div>
      </div>
    </div>
  );
}
