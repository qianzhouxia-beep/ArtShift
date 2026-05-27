import { useState } from 'react';
import { X, Zap, Star, Sparkles } from 'lucide-react';

const CREDIT_PACKS = [
  {
    id: 'starter',
    variantId: '1712203',
    name: 'Starter Pack',
    credits: 10,
    price: '$5',
    priceCents: 500,
    popular: false,
    description: 'Perfect for trying out ArtShift',
  },
  {
    id: 'popular',
    variantId: '1712229',
    name: 'Popular Pack',
    credits: 35,
    price: '$15',
    priceCents: 1500,
    popular: true,
    description: 'Best value for regular users',
  },
  {
    id: 'pro',
    variantId: '1712238',
    name: 'Pro Pack',
    credits: 80,
    price: '$30',
    priceCents: 3000,
    popular: false,
    description: 'For power users & professionals',
  },
];

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BuyCreditsModal({ isOpen, onClose }: BuyCreditsModalProps) {
  if (!isOpen) return null;

  const handleBuy = (variantId: string) => {
    // Lemon Squeezy checkout URL
    const checkoutUrl = `https://artshift.lemonsqueezy.com/checkout/buy/${variantId}`;
    window.open(checkoutUrl, '_blank');
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
                onClick={() => handleBuy(pack.variantId)}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                  pack.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>🔒 Secure payment powered by Lemon Squeezy</p>
          <p className="mt-1">Credits will be added to your account immediately after payment</p>
        </div>
      </div>
    </div>
  );
}
