import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 英文翻译（硬编码，避免 JSON 导入问题）
const resources = {
  en: {
    translation: {
      "hero": {
        "badge": "Launching Soon — US · Europe · Worldwide",
        "title_1": "Shift Your",
        "title_2": "Photos Into",
        "title_3": "Wearables",
        "title_4": "In Seconds",
        "subtitle": "Upload a photo or describe your idea. AI transforms it into stunning art — then we print it on T-shirts, hoodies, mugs & phone cases. Zero design skills. Shipped worldwide.",
        "cta_primary": "Get Early Access",
        "cta_secondary": "See How It Works"
      },
      "navbar": {
        "howItWorks": "How It Works",
        "products": "Products",
        "pricing": "Pricing",
        "faq": "FAQ",
        "joinWaitlist": "Join Waitlist"
      },
      "howItWorks": {
        "badge": "The Process",
        "title_1": "Three steps.",
        "title_2": "Infinite designs.",
        "subtitle": "From idea to your doorstep in days. No design skills. No complicated tools.",
        "step_1_title": "Describe Your Vision",
        "step_1_desc": "Type anything: \"a cyberpunk cat on Mars\" or \"watercolor mountain landscape.\" The more creative, the better.",
        "step_2_title": "AI Generates Designs",
        "step_2_desc": "Our AI instantly creates 4 unique designs. Pick your favorite, tweak the style, or regenerate for fresh ideas.",
        "step_3_title": "We Print & Ship",
        "step_3_desc": "Choose your product and size. We print with premium quality and ship directly to your door — anywhere worldwide."
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
