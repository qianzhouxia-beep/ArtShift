import { useState, useEffect } from 'react';
import AuthModal from './components/AuthModal';
import {
  Sparkles, Zap, Globe, ShieldCheck, Star, ArrowRight,
  ChevronDown,
  Palette, Truck, CreditCard, Menu, X,
  Package, Smartphone, Image, Layers, Wand2,
  ArrowUp, Upload, ImagePlus,
} from 'lucide-react';
import ParticleBackground from './ParticleBackground';
import BuyCreditsModal from './components/BuyCreditsModal';


// ─── i18n Translations ─────────────────────────────────────────────
const translations: Record<string, Record<string, string>> = {
  en: {
    howItWorks: 'How It Works', products: 'Products', pricing: 'Pricing', faq: 'FAQ',
    joinWaitlist: 'Join Waitlist', logout: 'Logout', signIn: 'Sign In', buyCredits: 'Buy Credits', credits: 'credits',
    heroBadge: 'Launching Soon — US · Europe · Worldwide',
    heroTitle1a: 'Shift Your ', heroTitle1b: 'Photos Into', heroTitle2a: 'Wearables ', heroTitle2b: 'In Seconds',
    heroDesc1: 'Upload a photo or describe your idea. AI transforms it into ',
    heroDescBold: 'stunning art', heroDesc2: " — then we print it on T-shirts, hoodies, mugs & phone cases. Zero design skills. Shipped worldwide.",
    btnGetEarlyAccess: 'Get Early Access', btnSeeHowItWorks: 'See How It Works',
    heroCheck1: 'Upload photo or describe idea', heroCheck2: 'AI art in 10+ styles', heroCheck3: 'Ships to 30+ countries',
    howItWorksBadge: 'The Process', howItWorksTitle1: 'Three steps.', howItWorksTitle2: 'Infinite designs.',
    howItWorksDesc: 'From idea to your doorstep in days. No design skills. No complicated tools.',
    step1Num: '01', step1Title: 'Describe Your Vision', step1Desc: 'Type anything: "a cyberpunk cat on Mars" or "watercolor mountain landscape." The more creative, the better.',
    step2Num: '02', step2Title: 'AI Generates Designs', step2Desc: 'Our AI instantly creates unique designs. Pick your favorite, tweak the style, or regenerate for fresh ideas.',
    step3Num: '03', step3Title: 'We Print & Ship', step3Desc: 'Choose your product and size. We print with premium quality and ship directly to your door — anywhere worldwide.',
    styleGalleryTitle1: 'Any Style', styleGalleryTitle2: 'You Can Imagine', styleGalleryDesc: 'From classic oil paintings to cyberpunk — our AI transforms your photo into the style you choose.',
    aiDemoBadge: 'AI Generation Studio', aiDemoTitle1: 'Watch AI Create', aiDemoTitle2: 'in Real Time',
    aiDemoDesc: 'Describe what you want, upload a photo for style transfer, and watch AI generate your design.',
    modeText: 'Text to Image', modeImage: 'Upload & Style Transfer',
    labelUploadImage: 'Upload Your Image', dropImageHere: 'Drop your image here', dragDropUpload: 'Drag & drop or click to upload',
    imageFormatHint: 'JPG, PNG, WebP — Max 10MB', originalLabel: 'Original',
    labelPrompt: 'Your Prompt', labelAdditionalPrompt: 'Additional Prompt (optional)',
    placeholderPrompt: 'e.g. "A majestic owl in a starry night..."', placeholderAdditionalPrompt: 'e.g. "Make it more colorful" or leave blank for pure style transfer',
    labelChooseStyle: 'Choose Style', labelStyleStrength: 'Style Strength', labelQuality: 'Quality',
    subtleLabel: 'Subtle', boldLabel: 'Bold',
    btnGenerate: 'Generate', btnGenerating: 'Generating...', btnReset: 'Reset',
    resultLabel: 'Result', beforeAfterTip: 'Click to toggle before/after',
    standardName: 'Standard', standardBadge: 'FREE', standardDesc: 'Fast, good quality',
    premiumName: 'Premium', premiumBadge: 'PRO', premiumDesc: 'More detail, better coherence',
    errorLoginRequired: 'Please sign in to use Premium quality.',
    productsBadge: 'Product Line', productsTitle1: 'Your art.', productsTitle2: 'Any surface.',
    productsDesc: '5 premium products. Printed with care. Shipped worldwide from local warehouses.',
    whyBadge: 'Why ArtShift', whyTitle1: 'Not a ', whyTitle2: 'designer?', whyTitle3: 'No problem.',
    whyDesc: "Traditional custom printing requires design skills or expensive tools. ArtShift puts creative power in everyone's hands — with the most advanced AI image generation.",
    btnStartCreatingFree: 'Start Creating Free',
    featAiPowered: 'ChatGPT Image Generation powered', featAiPoweredDesc: "The world's most advanced AI models, fine-tuned for design generation",
    featStyles: '10+ art styles', featStylesDesc: 'Photorealistic, anime, oil painting, cyberpunk, minimalism, and more',
    featOneOrder: 'One order. No minimum.', featOneOrderDesc: 'Print on demand. No inventory, no waste, no commitment',
    featGlobalNetwork: 'Global production network', featGlobalNetworkDesc: "Printful's local warehouses in US, UK, EU & Australia for fastest delivery",
    featPrintQuality: 'Premium print quality', featPrintQualityDesc: 'DTG (Direct-to-Garment) printing for vibrant, durable designs',
    featSecurePayments: 'Secure payments', featSecurePaymentsDesc: 'PayPal-powered. All major cards, PayPal, Apple Pay & Google Pay accepted',
    testimonialsBadge: 'Social Proof', testimonialsTitle1: 'Loved by Creators', testimonialsTitle2: 'Worldwide',
    pricingBadge: 'Pricing', pricingTitle: 'Coming Soon', pricingDesc: 'Join the waitlist to get early bird pricing when we launch.',
    btnGetEarlyBirdPricing: 'Get Early Bird Pricing',
    waitlistTitle1: 'Be the ', waitlistTitleHighlight: 'first', waitlistTitle2: 'to create.',
    waitlistDesc1: 'Join the waitlist and get ', waitlistDescHighlight: 'early access', waitlistDesc2: ' when we launch — plus an exclusive ',
    waitlistDiscount: '20% off', waitlistDesc3: ' on your first order.',
    emailPlaceholder: 'your@email.com', errorValidEmail: 'Please enter a valid email address.',
    btnJoining: 'Joining...', btnJoinWaitlist: 'Join Waitlist →',
    waitlistSuccessTitle: "You're in!", waitlistSuccessDesc: "We'll notify you when we launch. Check your inbox for a confirmation.",
    waitlistNoSpam: 'No spam. Unsubscribe anytime. We respect your inbox.',
    statWaitlist: 'On Waitlist', statCountries: 'Countries', statProducts: 'Product Types',
    faqBadge: 'FAQ', faqTitle1: 'Questions,', faqTitle2: 'answered',
    faqQ1: 'How does the AI design generation work?',
    faqA1: 'Simply describe what you want in plain English. Our AI generates unique designs based on your description. You can regenerate, adjust styles, or pick your favorite.',
    faqQ2: 'Where do you ship to?',
    faqA2: 'We ship to 30+ countries worldwide via our global production network. This includes the United States, Canada, all EU countries, UK, Australia, Japan, and more. US/EU typically 3-7 business days, other regions 7-14 business days.',
    faqQ3: 'How long does production and shipping take?',
    faqA3: 'Production typically takes 2-5 business days. Shipping adds 2-7 business days depending on location. You\'ll receive a tracking number via email as soon as your order ships.',
    faqQ4: 'What payment methods do you accept?',
    faqA4: 'We accept all major credit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay. All transactions are processed securely.',
    faqQ5: 'Can I upload my own photo?',
    faqA5: 'Yes! You can upload JPG, PNG, or WebP files up to 20MB. Our AI will transform your photo into various artistic styles — cartoon, anime, oil painting, sketch — and then apply it to any product.',
    faqQ6: "What's your return policy?",
    faqA6: 'Since all products are custom-printed specifically for you, we cannot accept returns for changed minds. However, if your item arrives damaged or defective, we\'ll replace it at no cost. Contact us within 7 days of delivery with photos.',
    footerTagline: 'AI-powered custom products. Turn your imagination into wearable art.',
    footerPlatform: 'Platform', footerCompany: 'Company', footerLegal: 'Legal',
    footerAbout: 'About', footerBlog: 'Blog', footerContact: 'Contact',
    footerPrivacy: 'Privacy Policy', footerTerms: 'Terms of Service', footerRefund: 'Refund Policy',
    styleOilPainting: 'Oil Painting',
    styleOilPaintingDesc: 'Van Gogh & Monet',
    stylePixelArt: 'Pixel Art',
    stylePixelArtDesc: '8-bit Retro',
    styleAnime: 'Anime',
    styleAnimeDesc: 'Studio Ghibli',
    styleCyberpunk: 'Cyberpunk',
    styleCyberpunkDesc: 'Neon Futurism',
    stylePencilSketch: 'Pencil Sketch',
    stylePencilSketchDesc: 'Graphite Drawing',
    styleWatercolor: 'Watercolor',
    styleWatercolorDesc: 'Soft & Ethereal',
    footerCopyright: '© 2026 ArtShift. All rights reserved.',
    testimonial1Name: 'Alex M.', testimonial1Text: 'I had zero design skills. Printed a custom hoodie with my cat in Van Gogh style. It looks incredible.',
    testimonial2Name: 'Sophie L.', testimonial2Text: 'Ordered from Germany, arrived in 5 days. The print quality is better than any store-bought shirt.',
    testimonial3Name: 'James K.', testimonial3Text: 'Made personalized mugs for my entire team. They loved it. Will order again for sure.',
  },
  zh: {
    howItWorks: '如何使用', products: '产品', pricing: '价格', faq: '常见问题',
    joinWaitlist: '加入候补名单', logout: '退出登录', signIn: '登录', buyCredits: '购买积分', credits: '积分',
    heroBadge: '即将上线 — 美国 · 欧洲 · 全球',
    heroTitle1a: '将你的', heroTitle1b: '照片变成', heroTitle2a: '穿戴艺术品', heroTitle2b: '只需几秒',
    heroDesc1: '上传一张照片或描述你的想法。AI 将其转化为',
    heroDescBold: '惊艳艺术作品', heroDesc2: ' —— 然后我们印在 T 恤、卫衣、马克杯和手机壳上。无需设计技巧。全球配送。',
    btnGetEarlyAccess: '获取早期访问', btnSeeHowItWorks: '了解工作流程',
    heroCheck1: '上传照片或描述想法', heroCheck2: '10+ 种 AI 艺术风格', heroCheck3: '配送至 30+ 国家',
    howItWorksBadge: '流程', howItWorksTitle1: '三个步骤。', howItWorksTitle2: '无限可能。',
    howItWorksDesc: '从灵感到送到家门口，只需数天。无需设计技能。无需复杂工具。',
    step1Num: '01', step1Title: '描述你的想法', step1Desc: '输入任何内容："火星上的赛博朋克猫"或"水彩山水画"。越有创意越好。',
    step2Num: '02', step2Title: 'AI 生成设计', step2Desc: '我们的 AI 即时创建独特的设计。选择你喜欢的，调整风格，或重新生成获取新灵感。',
    step3Num: '03', step3Title: '打印并配送', step3Desc: '选择产品和尺寸。我们以优质品质打印并直接配送到你家门 —— 全球任意地点。',
    styleGalleryTitle1: '任意风格', styleGalleryTitle2: '任你想象', styleGalleryDesc: '从经典油画到赛博朋克 —— 我们的 AI 将你的照片转换为你选择的风格。',
    aiDemoBadge: 'AI 创作工作室', aiDemoTitle1: '实时观看 AI', aiDemoTitle2: '创作过程',
    aiDemoDesc: '描述你想要的内容，上传照片进行风格迁移，观看 AI 为你生成设计。',
    modeText: '文字生图', modeImage: '上传图片 & 风格迁移',
    labelUploadImage: '上传图片', dropImageHere: '将图片拖到此处', dragDropUpload: '拖拽或点击上传',
    imageFormatHint: 'JPG、PNG、WebP —— 最大 10MB', originalLabel: '原图',
    labelPrompt: '输入提示词', labelAdditionalPrompt: '附加提示词（可选）',
    placeholderPrompt: '例如："星空下的雄伟猫头鹰..."', placeholderAdditionalPrompt: '例如："让它更鲜艳" 或留空进行纯风格迁移',
    labelChooseStyle: '选择风格', labelStyleStrength: '风格强度', labelQuality: '画质',
    subtleLabel: '轻微', boldLabel: '强烈',
    btnGenerate: '生成', btnGenerating: '生成中...', btnReset: '重置',
    resultLabel: '结果', beforeAfterTip: '点击切换前后对比',
    standardName: '标准', standardBadge: '免费', standardDesc: '快速，良好画质',
    premiumName: '高级', premiumBadge: '专业', premiumDesc: '更多细节，更好一致性',
    errorLoginRequired: '请先登录以使用高级画质。',
    productsBadge: '产品线', productsTitle1: '你的艺术。', productsTitle2: '任意载体。',
    productsDesc: '5 款优质产品。精心印制。从本地仓库全球配送。',
    whyBadge: '为什么选择 ArtShift', whyTitle1: '不是', whyTitle2: '设计师？', whyTitle3: '没问题。',
    whyDesc: '传统定制印刷需要设计技能或昂贵工具。ArtShift 让每个人都能掌握创作力 —— 凭借最先进的 AI 图像生成技术。',
    btnStartCreatingFree: '免费开始创作',
    featAiPowered: 'ChatGPT 图像生成驱动', featAiPoweredDesc: '世界最先进的 AI 模型，专为设计生成而微调',
    featStyles: '10+ 种艺术风格', featStylesDesc: '写实、动漫、油画、赛博朋克、极简主义等',
    featOneOrder: '一件起订。无最低限量。', featOneOrderDesc: '按需印刷。无库存，无浪费，无承诺',
    featGlobalNetwork: '全球生产网络', featGlobalNetworkDesc: 'Printful 在美国、英国、欧盟和澳大利亚的本地仓库，最快配送',
    featPrintQuality: '优质印刷品质', featPrintQualityDesc: 'DTG（直喷）印刷，色彩鲜艳，持久耐用',
    featSecurePayments: '安全支付', featSecurePaymentsDesc: 'PayPal 驱动。支持主流信用卡、PayPal、Apple Pay 和 Google Pay',
    testimonialsBadge: '用户好评', testimonialsTitle1: '创作者的挚爱', testimonialsTitle2: '遍布全球',
    pricingBadge: '价格', pricingTitle: '即将推出', pricingDesc: '加入候补名单，上线时享受早鸟价优惠。',
    btnGetEarlyBirdPricing: '获取早鸟价',
    waitlistTitle1: '成为', waitlistTitleHighlight: '首批', waitlistTitle2: '创作者。',
    waitlistDesc1: '加入候补名单，获得', waitlistDescHighlight: '早期访问权限', waitlistDesc2: '，上线时还可享受独家',
    waitlistDiscount: '8 折', waitlistDesc3: '首单优惠。',
    emailPlaceholder: '你的邮箱', errorValidEmail: '请输入有效的邮箱地址。',
    btnJoining: '加入中...', btnJoinWaitlist: '加入候补名单 →',
    waitlistSuccessTitle: '已加入！', waitlistSuccessDesc: '上线时会通知你。请查看邮箱确认邮件。',
    waitlistNoSpam: '无垃圾邮件。随时退订。我们尊重你的收件箱。',
    statWaitlist: '候补人数', statCountries: '覆盖国家', statProducts: '产品类型',
    faqBadge: '常见问题', faqTitle1: '有疑问？', faqTitle2: '这里有答案',
    faqQ1: 'AI 设计生成如何工作？',
    faqA1: '用简单的语言描述你想要什么。我们的 AI 会根据你的描述生成独特的设计。你可以重新生成、调整风格或选择最喜欢的。',
    faqQ2: '你们配送到哪里？',
    faqA2: '我们通过全球生产网络配送至 30+ 个国家，包括美国、加拿大、所有欧盟国家、英国、澳大利亚等。美国/欧盟通常 3-7 个工作日，其他地区 7-14 个工作日。',
    faqQ3: '生产和配送需要多长时间？',
    faqA3: '生产通常需要 2-5 个工作日。根据地点不同，配送需要 2-7 个工作日。订单发货后你会收到邮件追踪号。',
    faqQ4: '你们接受哪些支付方式？',
    faqA4: '我们接受所有主流信用卡（Visa、Mastercard、Amex）、PayPal、Apple Pay、Google Pay。所有交易均安全处理。',
    faqQ5: '我可以上传自己的照片吗？',
    faqA5: '可以！你可以上传 JPG、PNG 或 WebP 文件（最大 20MB）。我们的 AI 会将你的照片转换为各种艺术风格 —— 卡通、动漫、油画、素描 —— 然后应用到任何产品上。',
    faqQ6: '退货政策是什么？',
    faqA6: '由于所有产品都是为您定制印刷的，我们不接受因改变主意而退货。但如果商品在运输中损坏或有缺陷，我们将免费更换。请在收货后 7 天内联系我们并提供照片。',
    footerTagline: 'AI 驱动的定制产品。将你的想象力变成可穿戴的艺术品。',
    footerPlatform: '平台', footerCompany: '公司', footerLegal: '法律',
    footerAbout: '关于我们', footerBlog: '博客', footerContact: '联系我们',
    footerPrivacy: '隐私政策', footerTerms: '服务条款', footerRefund: '退款政策',
    styleOilPainting: '油画',
    styleOilPaintingDesc: '梵高与莫奈风格',
    stylePixelArt: '像素艺术',
    stylePixelArtDesc: '8位复古风',
    styleAnime: '动漫',
    styleAnimeDesc: '吉卜力工作室风格',
    styleCyberpunk: '赛博朋克',
    styleCyberpunkDesc: '霓虹未来主义',
    stylePencilSketch: '铅笔素描',
    stylePencilSketchDesc: '石墨手绘风格',
    styleWatercolor: '水彩画',
    styleWatercolorDesc: '柔和梦幻风格',
    footerCopyright: '© 2026 ArtShift. 保留所有权利。',
    testimonial1Name: 'Alex M.', testimonial1Text: '我完全没有设计技能。用我猫咪的照片印了一件梵高风格的卫衣。效果太惊艳了。',
    testimonial2Name: 'Sophie L.', testimonial2Text: '从德国订货，5天就到了。印刷质量比任何店里买的T恤都好。',
    testimonial3Name: 'James K.', testimonial3Text: '给整个团队做了定制马克杯。他们都很喜欢。肯定会再订购。',
  },
};

function useT(lang: string): (key: string) => string {
  const langObj: Record<string, string> = translations[lang] as unknown as Record<string, string>;
  return (key: string): string => langObj[key] ?? key;
}
// ─────────────────────────────────────────────────────────────────────


// ─── Style Gallery Data ───────────────────────────────────────────────────────
const styleGallery = [
  { src: '/images/styles/style-oil-painting.png', titleKey: 'styleOilPainting', descKey: 'styleOilPaintingDesc' },
  { src: '/images/styles/style-pixel-art.png', titleKey: 'stylePixelArt', descKey: 'stylePixelArtDesc' },
  { src: '/images/styles/style-anime.png', titleKey: 'styleAnime', descKey: 'styleAnimeDesc' },
  { src: '/images/styles/style-cyberpunk.png', titleKey: 'styleCyberpunk', descKey: 'styleCyberpunkDesc' },
  { src: '/images/styles/style-pencil-sketch.png', titleKey: 'stylePencilSketch', descKey: 'stylePencilSketchDesc' },
  { src: '/images/styles/style-watercolor.png', titleKey: 'styleWatercolor', descKey: 'styleWatercolorDesc' },
];

// ─── Logo Image (ChatGPT designed) ──────────────────────────────────────────────
function ArtShiftLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img src="/logo.png" alt="ArtShift Logo" className={className} style={{ objectFit: 'contain' }} />
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────
interface NavbarProps {
  onOpenModal: () => void;
  user: { id: string; email: string } | null;
  credits: number;
  onOpenAuth: () => void;
  onLogout: () => void;
  t: (key: string) => string;
  lang: string;
  setLang: (l: string) => void;
}

function Navbar({ onOpenModal, user, credits, onOpenAuth, onLogout, t, lang, setLang }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [t("howItWorks"), t("products"), t("pricing"), t("faq")];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center bg-white/25 backdrop-blur-xl border-b border-white/20 shadow-lg" style={{ backdropFilter: 'blur(20px)' }}>
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center rounded-full w-10 h-10 sm:w-11 sm:h-11 shadow-sm bg-white">
          <ArtShiftLogo className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="flex items-center gap-4 sm:gap-8 rounded-2xl px-5 sm:px-8 py-2.5 sm:py-3 shadow-sm bg-white">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
              className="text-[12px] sm:text-[13px] font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 hidden sm:block">
              {l}
            </a>
          ))}
          <a href="#waitlist"
            className="text-[12px] sm:text-[13px] font-semibold text-white rounded-full px-5 py-1.5 transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            Join Waitlist
          </a>
          {user ? (
            <>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 border border-violet-100">
                <div className="text-[11px] font-bold text-violet-600">{credits}</div>
                <div className="text-[10px] text-violet-400 font-medium">credits</div>
              </div>
              <button
                onClick={onLogout}
                className="text-[12px] sm:text-[13px] font-medium text-gray-400 hover:text-gray-600 rounded-full px-3 py-1.5 transition-all duration-200"
                title="Sign out"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-[12px] sm:text-[13px] font-semibold text-violet-600 rounded-full px-5 py-1.5 transition-all duration-200 hover:bg-violet-50 border border-violet-100"
            >
              Sign In
            </button>
          )}
          <button
            onClick={onOpenModal}
            className="text-[12px] sm:text-[13px] font-semibold text-gray-700 rounded-full px-5 py-1.5 transition-all duration-200 border border-gray-200 hover:bg-gray-50"
          >
            Buy Credits
          </button>
          <button className="sm:hidden text-gray-500" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="absolute top-full mt-2 left-0 right-0 flex flex-col items-center gap-3 p-4 rounded-2xl shadow-lg bg-white">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
              className="text-[13px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
              onClick={() => setMenuOpen(false)}>
              {l}
            </a>
          ))}
        </div>
      )}
      {/* Language Switcher */}
      <div className="flex items-center gap-1 ml-4">
        <button onClick={() => setLang('en')} className={`text-xs font-bold px-2 py-1 rounded ${lang === 'en' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}>EN</button>
        <button onClick={() => setLang('zh')} className={`text-xs font-bold px-2 py-1 rounded ${lang === 'zh' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}>中文</button>
      </div>
    </nav>
  );
}

// ─── Floating Icon Component ────────────────────────────────────────────────
function FloatingIcon({ icon, x, y, delay, opacity = 0.12 }: {
  icon: React.ReactNode; x: string; y: string; delay: string; size?: number; opacity?: number;
}) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        animation: `float 6s ease-in-out infinite ${delay}`,
        opacity,
      }}
    >
      {icon}
    </div>

  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────
function HeroSection({ t }: { t: (key: string) => string }) {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-white/95">
      {/* Floating Lucide icons — crisp vector, not emoji */}
      <FloatingIcon icon={<Palette size={56} strokeWidth={1.5} color="#3b82f6" />} x="8%" y="18%" delay="0s" size={56} opacity={0.10} />
      <FloatingIcon icon={<Package size={72} strokeWidth={1.5} color="#8b5cf6" />} x="78%" y="60%" delay="2s" size={72} opacity={0.08} />
      <FloatingIcon icon={<Smartphone size={52} strokeWidth={1.5} color="#f97316" />} x="88%" y="28%" delay="2.5s" size={52} opacity={0.10} />
      <FloatingIcon icon={<Globe size={44} strokeWidth={1.5} color="#3b82f6" />} x="55%" y="8%" delay="1.5s" size={44} opacity={0.08} />
      <FloatingIcon icon={<Sparkles size={40} strokeWidth={1.5} color="#8b5cf6" />} x="20%" y="72%" delay="1s" size={40} opacity={0.10} />
      <FloatingIcon icon={<Truck size={60} strokeWidth={1.5} color="#f97316" />} x="12%" y="65%" delay="0.5s" size={60} opacity={0.07} />
      <FloatingIcon icon={<Wand2 size={36} strokeWidth={1.5} color="#3b82f6" />} x="68%" y="15%" delay="3s" size={36} opacity={0.09} />
      <FloatingIcon icon={<Image size={48} strokeWidth={1.5} color="#8b5cf6" />} x="42%" y="75%" delay="1.8s" size={48} opacity={0.08} />

      {/* Subtle gradient orbs */}
      <div className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)',
          top: '5%', left: '5%', filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
        }} />
      <div className="absolute w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)',
          bottom: '10%', right: '10%', filter: 'blur(60px)',
          animation: 'float 10s ease-in-out infinite 2s',
        }} />

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-end pb-12 sm:pb-16 lg:pb-24 px-6 sm:px-12 md:px-20 lg:px-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 mb-5 text-[12px] font-semibold rounded-full px-4 py-1.5 bg-blue-50 text-blue-600">
            <Sparkles size={13} />
            Launching Soon — US · Europe · Worldwide
          </div>

          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] leading-[1.1] font-extrabold tracking-tight mb-5">
            <span className="text-gray-900">{t("heroTitle1a")}</span>
            <span className="gradient-text">{t("heroTitle1b")}</span>
            <br />
            <span className="text-gray-900">{t("heroTitle2a")}</span>
            <span className="text-gradient-warm">{t("heroTitle2b")}</span>
          </h1>

          <p className="text-[15px] sm:text-[16px] text-gray-700 font-normal mb-8 max-w-lg leading-relaxed">
            {t("heroDesc1")}{' '}
            <span className="font-semibold text-gray-900">{t("heroDescBold")}</span>{' '}
            {t("heroDesc2")}
          </p>

          <div className="flex flex-wrap gap-4 items-center mb-10">
            <a href="#waitlist"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-white rounded-full px-8 py-4 transition-all duration-200 hover:scale-105 hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              {t("btnGetEarlyAccess")} <ArrowRight size={16} />
            </a>
            <a href="#how-it-works"
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-gray-700 border border-gray-200 rounded-full px-8 py-4 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 bg-white">
              {t("btnSeeHowItWorks")} <ChevronDown size={15} />
            </a>
          </div>

          <div className="flex flex-wrap gap-6 text-[11px] text-gray-400 font-medium">
            {[
              { icon: '✓', text: 'Upload photo or describe idea' },
              { icon: '✓', text: 'AI art in 10+ styles' },
              { icon: '✓', text: 'Ships to 30+ countries' },
            ].map(item => (
              <span key={item.text} className="flex items-center gap-1.5">
                <span style={{ color: '#3b82f6' }}>{item.icon}</span> {item.text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ──────────────────────────────────────────────────────────
function HowItWorks({ t }: { t: (key: string) => string }) {
  const steps = [
    { num: t('step1Num'), title: t('step1Title'), desc: t('step1Desc'), image: '/images/step1-describe-vision.png', color: '#3b82f6' },
    { num: t('step2Num'), title: t('step2Title'), desc: t('step2Desc'), image: '/images/step2-ai-generates.png', color: '#8b5cf6' },
    { num: t('step3Num'), title: t('step3Title'), desc: t('step3Desc'), image: '/images/step3-print-ship.png', color: '#f97316' },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600">
            The Process
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
            {t('howItWorksTitle1')}{' '}
            <span className="gradient-text">{t("howItWorksTitle2")}</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
            From idea to your doorstep in days. No design skills. No complicated tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, i) => (
            <div key={i}
              className="rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white border border-gray-100">
              <div className="rounded-2xl overflow-hidden mb-6 bg-gray-50">
                <img src={step.image} alt={step.title} className="w-full h-auto object-cover" loading="lazy" />
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: step.color }}>
                {step.num}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Demo ────────────────────────────────────────────────────────────────
const AI_STYLES = [
  { id: 'oil-painting', name: 'Oil Painting', desc: 'Van Gogh & Monet' },
  { id: 'pixel-art', name: 'Pixel Art', desc: '8-bit Retro' },
  { id: 'anime', name: 'Anime', desc: 'Studio Ghibli' },
  { id: 'cyberpunk', name: 'Cyberpunk', desc: 'Neon Futurism' },
  { id: 'pencil-sketch', name: 'Pencil Sketch', desc: 'Graphite Drawing' },
  { id: 'watercolor', name: 'Watercolor', desc: 'Soft & Ethereal' },
];

interface AIDemoProps {
  userId: string | null;
}

function AIDemo({ userId, t }: AIDemoProps & { t: (key: string) => string }) {
  // ─── Mode: 'text' or 'image' ───────────────────────────
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('oil-painting');
  const [quality, setQuality] = useState<'standard' | 'premium'>('standard');
  const [generating, setGenerating] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  // ─── Image upload state ──────────────────────────────────
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);
  const [strength, setStrength] = useState(0.55);
  const [isDragging, setIsDragging] = useState(false);

  // ─── Handle file selection ───────────────────────────────
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      return;
    }
    setError('');
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setUploadedPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  // ─── Drag & drop handlers ────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  // ─── Generate ────────────────────────────────────────────
  const handleGenerate = async () => {
    // Validate
    if (mode === 'text' && !prompt.trim()) {
      setError('Please describe what you want to create.');
      return;
    }
    if (mode === 'image' && !uploadedFile) {
      setError('Please upload an image first.');
      return;
    }

    setError('');
    setResultUrl(null);
    setGenerating(true);

    try {
      if (mode === 'text') {
        // Text-to-Image
        const res = await fetch(`${API_URL}/generation/text-to-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            style: selectedStyle,
            quality,
            userId: userId || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Generation failed');
        if (data.success && data.imageUrl) {
          setResultUrl(data.imageUrl);
        } else {
          throw new Error('No image returned');
        }
      } else {
        // Image-to-Image (style transfer)
        const formData = new FormData();
        formData.append('image', uploadedFile!);
        formData.append('style', selectedStyle);
        formData.append('quality', quality);
        formData.append('strength', String(strength));
        if (prompt.trim()) formData.append('prompt', prompt);

        if (userId) formData.append('userId', userId);
        const res = await fetch(`${API_URL}/generation/image-to-image`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Style transfer failed');
        if (data.success && data.imageUrl) {
          setResultUrl(data.imageUrl);
        } else {
          throw new Error('No image returned');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // ─── Reset ───────────────────────────────────────────────
  const handleReset = () => {
    setResultUrl(null);
    setPrompt('');
    setUploadedFile(null);
    setUploadedPreview(null);
    setError('');
  };

  const QUALITY_TIERS = [
    { id: 'standard' as const, name: t('standardName'), badge: t('standardBadge'), desc: t('standardDesc'), color: '#10b981' },
    { id: 'premium' as const, name: t('premiumName'), badge: t('premiumBadge'), desc: t('premiumDesc'), color: '#8b5cf6' },
  ];

  return (
    <section className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-violet-50 text-violet-600">
            AI Generation Studio
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
            <span className="gradient-text">{t("aiDemoTitle1")}</span>
            <br />{t("aiDemoTitle2")}
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
            Describe what you want, upload a photo for style transfer, and watch AI generate your design.
          </p>
        </div>

        <div className="rounded-3xl p-8 sm:p-12 lg:p-16 bg-white border border-gray-100 shadow-sm">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* ─── Mode Toggle ──────────────────────────── */}
            <div className="flex rounded-2xl p-1 bg-gray-100">
              <button
                onClick={() => { setMode('text'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-200 ${
                  mode === 'text'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Wand2 size={16} />
                Text to Image
              </button>
              <button
                onClick={() => { setMode('image'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-200 ${
                  mode === 'image'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <ImagePlus size={16} />
                Upload & Style Transfer
              </button>
            </div>

            {/* ─── Image Upload (img2img mode only) ─────── */}
            {mode === 'image' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  Upload Your Image
                </label>
                {!uploadedPreview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-input')?.click()}
                    className={`rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-200 ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                    }`}
                  >
                    <Upload size={32} className={`mx-auto mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      {isDragging ? t('dropImageHere') : t('dragDropUpload')}
                    </p>
                    <p className="text-xs text-gray-400">JPG, PNG, WebP — Max 10MB</p>
                    <input
                      id="file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                    />
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200">
                    <img
                      src={uploadedPreview}
                      alt="Uploaded preview"
                      className="w-full max-h-64 object-contain bg-gray-50"
                    />
                    <button
                      onClick={() => {
                        setUploadedFile(null);
                        setUploadedPreview(null);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <X size={14} />
                    </button>
                    <div className="absolute bottom-3 left-3 text-[9px] font-bold uppercase tracking-widest bg-white/90 px-2 py-1 rounded-full text-gray-600">
                      Original
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ─── Prompt Input ─────────────────────────── */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                {mode === 'text' ? t('labelPrompt') : t('labelAdditionalPrompt')}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === 'text'
                    ? 'e.g. "A majestic owl in a starry night..."'
                    : 'e.g. "Make it more colorful" or leave blank for pure style transfer'
                }
                rows={mode === 'text' ? 3 : 2}
                className="w-full rounded-2xl px-5 py-4 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 resize-none"
              />
            </div>

            {/* ─── Style Selection ──────────────────────── */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Choose Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                {AI_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 border-2 ${
                      selectedStyle === style.id
                        ? 'border-transparent text-white shadow-lg'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50'
                    }`}
                    style={selectedStyle === style.id ? { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' } : {}}
                  >
                    <div>{style.name}</div>
                    <div className={`text-[10px] mt-0.5 ${selectedStyle === style.id ? 'text-white/70' : 'text-gray-400'}`}>{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* ─── Style Strength Slider (img2img mode) ── */}
            {mode === 'image' && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                  {t('labelStyleStrength')}: {Math.round(strength * 100)}%
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="0.8"
                  step="0.05"
                  value={strength}
                  onChange={(e) => setStrength(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 ${Math.round((strength - 0.2) / 0.6 * 100)}%, #e5e7eb ${Math.round((strength - 0.2) / 0.6 * 100)}%)`
                  }}
                />
                <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                  <span>{t('subtleLabel')}</span>
                  <span>{t('boldLabel')}</span>
                </div>
              </div>
            )}

            {/* ─── Quality Tier ─────────────────────────── */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Quality
              </label>
              <div className="grid grid-cols-2 gap-3">
                {QUALITY_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setQuality(tier.id)}
                    className={`rounded-xl px-4 py-3 text-left transition-all duration-200 border-2 ${
                      quality === tier.id
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{tier.name}</span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          quality === tier.id ? 'bg-white/20 text-white' : 'text-white'
                        }`}
                        style={quality !== tier.id ? { backgroundColor: tier.color } : {}}
                      >
                        {tier.badge}
                      </span>
                    </div>
                    <div className={`text-[10px] mt-1 ${quality === tier.id ? 'text-white/60' : 'text-gray-400'}`}>
                      {tier.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* ─── Error Message ────────────────────────── */}
            {error && (
              <div className="rounded-xl p-4 bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* ─── Generate Button ─────────────────────── */}
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="w-full rounded-2xl px-8 py-4 text-sm font-bold text-white transition-all duration-200 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              {generating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {mode === 'text' ? 'Generating...' : 'Transforming...'} (takes ~10s)
                </>
              ) : (
                <>
                  {mode === 'text' ? <Wand2 size={18} /> : <ImagePlus size={18} />}
                  {mode === 'text' ? 'Generate Image' : 'Apply Style Transfer'}
                  {quality === 'premium' && <span className="ml-1 text-[9px] bg-white/20 px-2 py-0.5 rounded-full">PRO</span>}
                </>
              )}
            </button>
          </div>

          {/* ─── Result Display Area ─────────────────────── */}
          {(generating || resultUrl) && (
            <div className="mt-12 pt-10 border-t border-gray-100">
              <div className="max-w-2xl mx-auto">
                {generating ? (
                  <div className="rounded-3xl aspect-square flex items-center justify-center relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81)' }}>
                    <div className="absolute inset-0" style={{
                      background: 'radial-gradient(circle at 30% 40%, rgba(139,92,246,0.4), transparent 60%), radial-gradient(circle at 70% 60%, rgba(59,130,246,0.4), transparent 60%)'
                    }} />
                    <div className="text-center relative z-10">
                      <svg className="animate-spin h-16 w-16 mx-auto mb-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <div className="text-lg font-bold text-white">
                        {mode === 'text' ? 'AI is creating...' : 'AI is transforming...'}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-violet-300 mt-2">
                        Please wait about 10 seconds
                      </div>
                    </div>
                  </div>
                ) : resultUrl ? (
                  <div className="text-center space-y-6">
                    {/* Show before/after for img2img */}
                    {mode === 'image' && uploadedPreview && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="rounded-2xl overflow-hidden border border-gray-200">
                            <img src={uploadedPreview} alt="Original" className="w-full h-auto" />
                          </div>
                          <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-2">Original</div>
                        </div>
                        <div>
                          <div className="rounded-2xl overflow-hidden shadow-lg">
                            <img src={resultUrl} alt="Styled" className="w-full h-auto" />
                          </div>
                          <div className="text-[9px] font-bold uppercase tracking-widest text-violet-500 mt-2">
                            {AI_STYLES.find(s => s.id === selectedStyle)?.name} Style
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Single result for text2img */}
                    {mode === 'text' && (
                      <div className="rounded-2xl overflow-hidden shadow-lg">
                        <img src={resultUrl} alt="Generated AI Art" className="w-full h-auto" />
                      </div>
                    )}
                    <div className="flex gap-4 justify-center">
                      <a
                        href={resultUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                      >
                        View Full Size
                      </a>
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200 transition-all duration-200 hover:bg-gray-50"
                      >
                        Generate Another
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* ─── Product Preview Area ────────────────────── */}
          {!generating && !resultUrl && (
            <div className="mt-12 pt-10 border-t border-gray-100">
              <div className="text-center mb-8">
                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Popular Products
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto">
                {[
                  { emoji: '👕', name: 'T-Shirt', color: '#eff6ff' },
                  { emoji: '☕', name: 'Mug', color: '#fff7ed' },
                  { emoji: '📱', name: 'Phone Case', color: '#f5f3ff' },
                ].map((product, i) => (
                  <div key={i} className="text-center">
                    <div className="aspect-[3/4] rounded-2xl flex items-center justify-center mb-3 relative overflow-hidden"
                      style={{ backgroundColor: product.color }}>
                      <span className="text-5xl sm:text-6xl opacity-70">{product.emoji}</span>
                      <div className="absolute bottom-2 text-[8px] sm:text-[9px] text-gray-500 bg-white/80 px-2 py-0.5 rounded-full">
                        {product.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Products ────────────────────────────────────────────────────────────────
function Products({ t }: { t: (key: string) => string }) {
  const products = [
    { emoji: '👕', name: 'T-Shirt', desc: 'Premium cotton, multiple colors', price: 'From $29.99', badge: 'Most Popular', badgeColor: '#3b82f6', badgeBg: '#eff6ff', colors: ['bg-white', 'bg-gray-900', 'bg-blue-600'] },
    { emoji: '🧥', name: 'Hoodie', desc: 'Soft fleece, Unisex fit', price: 'From $44.99', badge: 'Cozy', badgeColor: '#8b5cf6', badgeBg: '#f5f3ff', colors: ['bg-gray-700', 'bg-gray-900', 'bg-emerald-800'] },
    { emoji: '☕', name: 'Mug', desc: '11oz ceramic, dishwasher safe', price: 'From $22.99', badge: null, colors: ['bg-white', 'bg-gray-900'] },
    { emoji: '📱', name: 'Phone Case', desc: 'Snap & clear, all models', price: 'From $19.99', badge: null, colors: ['bg-gray-200', 'bg-gray-400'] },
    { emoji: '🧢', name: 'Cap', desc: 'Adjustable, premium weave', price: 'From $24.99', badge: 'New', badgeColor: '#f97316', badgeBg: '#fff7ed', colors: ['bg-gray-900', 'bg-gray-700'] },
  ];

  return (
    <section id="products" className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600">
            Product Line
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
            {t('productsTitle1')}{' '}
            <span className="gradient-text">{t("productsTitle2")}</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
            5 premium products. Printed with care. Shipped worldwide from local warehouses.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {products.map((p, i) => (
            <div key={i}
              className="rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer bg-white border border-gray-100">
              {p.badge && (
                <div className="text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 text-center"
                  style={{ backgroundColor: p.badgeBg, color: p.badgeColor }}>
                  {p.badge}
                </div>
              )}
              <div className="aspect-square flex items-center justify-center bg-slate-50">
                <span className="text-6xl sm:text-7xl">{p.emoji}</span>
              </div>
              <div className="p-4 sm:p-5">
                <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{p.name}</h4>
                <p className="text-[10px] sm:text-[11px] text-gray-500 mb-3">{p.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-600">{p.price}</span>
                  <div className="flex gap-1">
                    {p.colors.map((c, j) => (
                      <div key={j} className={`w-3 h-3 rounded-full ${c} border border-gray-200`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why ArtShift ─────────────────────────────────────────────────────────────
function WhyArtShift({ t }: { t: (key: string) => string }) {
  const features = [
    { icon: <Sparkles size={20} />, title: t('featAiPowered'), desc: t('featAiPoweredDesc'), color: '#3b82f6', bg: '#eff6ff' },
    { icon: <Layers size={20} />, title: t('featStyles'), desc: t('featStylesDesc'), color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: <Zap size={20} />, title: t('featOneOrder'), desc: t('featOneOrderDesc'), color: '#f97316', bg: '#fff7ed' },
    { icon: <Globe size={20} />, title: t('featGlobalNetwork'), desc: 'Printful\'s local warehouses in US, UK, EU & Australia for fastest delivery', color: '#10b981', bg: '#ecfdf5' },
    { icon: <ShieldCheck size={20} />, title: t('featPrintQuality'), desc: t('featPrintQualityDesc'), color: '#3b82f6', bg: '#eff6ff' },
    { icon: <CreditCard size={20} />, title: t('featSecurePayments'), desc: t('featSecurePaymentsDesc'), color: '#8b5cf6', bg: '#f5f3ff' },
  ];

  return (
    <section className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600">
              Why ArtShift
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              {t('whyTitle1')}{' '}
              <span className="gradient-text">{t("whyTitle2")}</span>
              <br />{t("whyTitle3")}.
            </h2>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-10">
              {t("whyDesc")}
            </p>
            <a href="#waitlist"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-white rounded-full px-8 py-4 transition-all duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              {t("btnStartCreatingFree")} <ArrowRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <div key={i}
                className="rounded-2xl p-5 transition-all duration-300 hover:shadow-md bg-white border border-gray-100">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-white"
                  style={{ color: f.color }}>
                  {f.icon}
                </div>
                <div className="font-bold text-gray-900 text-sm mb-1">{f.title}</div>
                <div className="text-xs text-gray-600 leading-relaxed">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ──────────────────────────────────────────────────────────
function Testimonials({ t }: { t: (key: string) => string }) {
  const reviews = [
    { name: t('testimonial1Name'), country: '🇺🇸 USA', text: t('testimonial1Text'), rating: 5 },
    { name: t('testimonial2Name'), country: '🇩🇪 Germany', text: t('testimonial2Text'), rating: 5 },
    { name: t('testimonial3Name'), country: '🇬🇧 UK', text: t('testimonial3Text'), rating: 5 },
  ];

  return (
    <section className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600">{t('testimonialsBadge')}</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
            Loved by{' '}
            <span className="gradient-text">early testers</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i}
              className="rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-white border border-gray-100">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="#f97316" color="#f97316" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.country}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ────────────────────────────────────────────────────────────────
function Pricing({ t }: { t: (key: string) => string }) {
  return (
    <section id="pricing" className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600">
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
            <span className='gradient-text'>{t('pricingTitle')}</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto mb-8">
            Join the waitlist to get early bird pricing when we launch.
          </p>
          <a href="#waitlist"
            className="inline-flex items-center gap-2 text-[14px] font-bold text-white rounded-full px-8 py-4 transition-all duration-200 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            {t("btnGetEarlyBirdPricing")} <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── API Config ─────────────────────────────────────────────────────────────
const API_URL = import.meta.env.VITE_API_URL || 'https://artshift-backend.zeabur.app/api';

// ─── Waitlist ────────────────────────────────────────────────────────────────
function Waitlist({ t }: { t: (key: string) => string }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to join');
      setSubmitted(true);
    } catch (err: any) {
      // API 失败时仍然显示成功（降级体验）
      console.warn('Waitlist API fallback:', err.message);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28" style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81, #1e1b4b)' }}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-white shadow-lg">
          <ArtShiftLogo className="w-10 h-10" />
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5">
          {t("waitlistTitle1")}
          <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            {t("waitlistTitleHighlight")}
          </span>
          {t("waitlistTitle2")}
        </h2>
        <p className="text-gray-300 text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          {t("waitlistDesc1")}
          <span className="font-bold text-white">{t("waitlistDescHighlight")}</span>{t("waitlistDesc2")}<span style={{ color: '#fbbf24' }} className="font-bold">{t("waitlistDiscount")}</span>{t("waitlistDesc3")}
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-2xl px-6 py-4 text-sm text-white placeholder-gray-400 outline-none transition-all duration-200"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            />
            {error && <p className="text-red-400 text-sm text-left pl-2">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full rounded-2xl px-8 py-4 text-sm font-bold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              {loading ? t('btnJoining') : t('btnJoinWaitlist')}
            </button>
          </form>
        ) : (
          <div className="rounded-2xl p-6 max-w-md mx-auto"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-white font-semibold text-lg mb-1">{t("waitlistSuccessTitle")}</p>
            <p className="text-gray-300 text-sm">We'll notify you when we launch. Check your inbox for a confirmation.</p>
          </div>
        )}

        <p className="text-gray-500 text-[11px] mt-5">No spam. Unsubscribe anytime. We respect your inbox.</p>

        <div className="mt-12 pt-10 grid grid-cols-3 gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {[
            { num: '500+', label: 'On Waitlist' },
            { num: '30+', label: 'Countries' },
            { num: '5', label: 'Product Types' },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{s.num}</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────
function FAQ({ t }: { t: (key: string) => string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const faqs = [
    { q: t('faqQ1'), a: t('faqA1') },
    { q: t('faqQ2'), a: t('faqA2') },
    { q: t('faqQ3'), a: t('faqA3') },
    { q: t('faqQ4'), a: t('faqA4') },
    { q: t('faqQ5'), a: t('faqA5') },
    { q: t('faqQ6'), a: t('faqA6') },
  ];

  return (
    <section id="faq" className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 lg:px-28 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600">
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
            {t('faqTitle1')}{' '}
            <span className='gradient-text'>{t('faqTitle2')}</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i}
              className="rounded-2xl overflow-hidden transition-all duration-200 bg-white border border-gray-100">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.q}</span>
                <span className="text-lg font-light transition-transform duration-200 flex-shrink-0 text-blue-500"
                  style={{ transform: openIdx === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>
                  +
                </span>
              </button>
              {openIdx === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer({ t }: { t: (key: string) => string }) {
  return (
    <footer className="py-16 px-6 sm:px-12 md:px-20 lg:px-28 bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ArtShiftLogo className="w-8 h-8" />
              <span className="font-extrabold text-white tracking-tight text-lg">ArtShift</span>
            </div>
            <p className="text-gray-500 text-sm max-w-xs">
              AI-powered custom products. Turn your imagination into wearable art.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Platform</div>
              <div className="space-y-3">
                {[t('howItWorks'), t('products'), t('pricing')].map(l => (
                  <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`}
                    className="block text-gray-400 hover:text-white transition-colors text-sm">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Company</div>
              <div className="space-y-3">
                {['About', 'Blog', 'Contact'].map(l => (
                  <a key={l} href="#"
                    className="block text-gray-400 hover:text-white transition-colors text-sm">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Legal</div>
              <div className="space-y-3">
                {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(l => (
                  <a key={l} href="#"
                    className="block text-gray-400 hover:text-white transition-colors text-sm">{l}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10">
          <p className="text-[11px] text-gray-600 uppercase tracking-widest">© 2026 ArtShift. All rights reserved.</p>
          <div className="flex items-center gap-5">
            {/* Social links will be added when accounts are set up */}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Style Gallery ─────────────────────────────────────────────────────────
function StyleGallery({ t }: { t: (key: string) => string }) {
  return (
    <section className="py-20 px-6 sm:px-12 md:px-20 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
          <span className="gradient-text">{t("styleGalleryTitle1")}</span> {t("styleGalleryTitle2")}
        </h2>
        <p className="text-gray-500 text-lg mb-12 max-w-2xl mx-auto">
          From classic oil paintings to cyberpunk — our AI transforms your photo into the style you choose.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {styleGallery.map((style) => (
            <div
              key={style.titleKey}
              className="group cursor-pointer"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-300 mb-3">
                <img
                  src={style.src}
                  alt={t(style.titleKey)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{t(style.titleKey)}</h3>
              <p className="text-gray-400 text-xs">{t(style.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState('zh');
  const t = useT(lang);

  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showBuyCredits, setShowBuyCredits] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [credits, setCredits] = useState(0);

  // Load user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('artshift_user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);
        fetchCredits(u.id);
      } catch {
        // ignore
      }
    }
  }, []);

  const fetchCredits = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/payments/credits/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits ?? 0);
      }
    } catch {
      // ignore
    }
  };

  const handleAuthSuccess = (u: { id: string; email: string }) => {
    setUser(u);
    fetchCredits(u.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('artshift_token');
    localStorage.removeItem('artshift_user');
    setUser(null);
    setCredits(0);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <ParticleBackground />
      <Navbar
        onOpenModal={() => setShowBuyCredits(true)}
        user={user}
        credits={credits}
        onOpenAuth={() => setShowAuth(true)}
        onLogout={handleLogout}
        t={t}
        lang={lang}
        setLang={setLang}
      />
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />
      <BuyCreditsModal
        isOpen={showBuyCredits}
        onClose={() => setShowBuyCredits(false)}
        userId={user?.id}
      />
      <HeroSection t={t} />
      <HowItWorks t={t} />
      <StyleGallery t={t} />
      <AIDemo userId={user?.id || null} t={t} />
      <Products t={t} />
      <WhyArtShift t={t} />
      <Testimonials t={t} />
      <Pricing t={t} />
      <Waitlist t={t} />
      <FAQ t={t} />
      <Footer t={t} />
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        >
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
