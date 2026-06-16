import { Link } from 'react-router-dom';

const footerLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/faq', label: 'FAQ' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/shipping', label: 'Shipping & Returns' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/20 py-10 md:py-0">
      <div className="flex flex-col lg:flex-row justify-between items-center w-full px-4 md:px-6 py-8 md:py-6 max-w-[1280px] mx-auto gap-6">
        {/* Brand Info */}
        <div className="flex flex-col items-center lg:items-start gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-3">
            <img
              alt="ArtShift Logo"
              className="h-8 w-auto object-contain"
              src="/logo.png"
            />
            <span className="text-lg font-bold text-on-surface hidden sm:block">ArtShift</span>
          </Link>
          <p className="text-xs md:text-sm text-on-surface-variant max-w-[280px] text-center lg:text-left leading-relaxed">
            &copy; {new Date().getFullYear()} ArtShift AI. From Idea to Object.
          </p>
        </div>

        {/* Footer Nav */}
        <nav className="flex flex-wrap justify-center gap-4 md:gap-10">
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-on-surface-variant text-xs md:text-label-sm hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Social Icons — icon only, no text */}
        <div className="flex gap-4 shrink-0">
          <button
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all"
            aria-label="Share"
          >
            <span className="material-symbols-outlined">share</span>
          </button>
          <button
            className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-all"
            aria-label="Language"
          >
            <span className="material-symbols-outlined">language</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
