import { X, Zap, Star, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

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
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // Load PayPal SDK
  useEffect(() => {
    if (!isOpen || paypalLoaded || document.getElementById('paypal-sdk')) return;

    const script = document.createElement('script');
    script.id = 'paypal-sdk';
    script.src = `https://www.paypal.com/sdk/js?client-id=AaDu9-BNI0GuaE3Rw_FoVk-J3D9vmnFafp-llIew-nduwODRQlEeyAb3_iN2dV4_L3OIG_skfZeVU&currency=USD`;
    script.setAttribute('data-sdk-integration-source', 'buttonfactory');
    script.onload = () => setPaypalLoaded(true);
    document.head.appendChild(script);
  }, [isOpen, paypalLoaded]);

  if (!isOpen) return null;

  const handleBuy = (packId: string, priceUsd: number) => {
    if (typeof window !== 'undefined' && (window as any).paypal) {
      const pack = CREDIT_PACKS.find(p => p.id === packId);
      (window as any).paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'pay',
        },
        createOrder: (_data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              description: `${pack?.name} - ${pack?.credits} AI image generation credits`,
              amount: {
                currency_code: 'USD',
                value: String(priceUsd),
              },
              custom_id: packId, // Pass pack ID for webhook processing
            }],
          });
        },
        onApprove: async (_data: any, actions: any) => {
          await actions.order.capture();
          alert(`🎉 Payment successful! ${pack?.credits} credits will be added to your account shortly.`);
          onClose();
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          alert('Payment failed. Please try again.');
        },
      }).render(`#paypal-button-${packId}`);
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

              {/* PayPal Button Container */}
              {!paypalLoaded ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl font-semibold bg-gray-200 text-gray-400 cursor-not-allowed"
                >
                  Loading PayPal...
                </button>
              ) : (
                <>
                  <div id={`paypal-button-${pack.id}`} />
                  <button
                    onClick={() => handleBuy(pack.id, pack.priceUsd)}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                      pack.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    Pay with PayPal
                  </button>
                </>
              )}
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
