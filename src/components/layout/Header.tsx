import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { to: '/gallery', label: 'Gallery' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[60] bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="flex justify-between items-center w-full px-4 md:px-6 py-4 max-w-[1280px] mx-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              alt="ArtShift Logo"
              className="h-8 md:h-10 w-auto object-contain"
              src="/logo.png"
            />
            <span className="text-lg font-bold text-on-surface hidden sm:block">ArtShift</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-label-bold transition-colors ${
                  isActive(link.to)
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex gap-1 md:gap-2">
              <Link to="/checkout" className="p-2 text-on-surface-variant hover:text-primary transition-all" aria-label="Cart">
                <span className="material-symbols-outlined">shopping_bag</span>
              </Link>
              <Link to="/profile" className="p-2 text-on-surface-variant hover:text-primary transition-all">
                <span className="material-symbols-outlined">account_circle</span>
              </Link>
            </div>
            <Link
              to="/studio"
              className="hidden md:block bg-vivid-purple text-stark-white px-6 py-2.5 rounded-full font-label-bold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-vivid-purple/20 text-center"
            >
              Create Now
            </Link>
            <button
              className="md:hidden p-2 text-on-surface-variant hover:text-primary transition-all"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] flex md:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative ml-auto w-[280px] bg-surface h-full flex flex-col shadow-2xl">
            <div className="flex justify-between items-center px-4 py-4 border-b border-outline-variant/30">
              <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-3">
                <img
                  alt="ArtShift Logo"
                  className="h-8 w-auto object-contain"
                  src="/logo.png"
                />
                <span className="text-lg font-bold text-on-surface">ArtShift</span>
              </Link>
              <button
                className="p-2 text-on-surface-variant"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <nav className="flex flex-col p-6 gap-6 flex-grow">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-2xl font-bold ${
                    isActive(link.to) ? 'text-primary' : 'text-on-surface-variant'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-outline-variant/30 my-4" />
              <div className="flex gap-6">
                <Link to="/checkout" onClick={() => setMobileOpen(false)} className="p-2 text-on-surface-variant" aria-label="Cart">
                  <span className="material-symbols-outlined">shopping_bag</span>
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="p-2 text-on-surface-variant">
                  <span className="material-symbols-outlined">account_circle</span>
                </Link>
              </div>
            </nav>
            <div className="p-6 border-t border-outline-variant/30">
              <Link
                to="/studio"
                onClick={() => setMobileOpen(false)}
                className="block w-full bg-vivid-purple text-stark-white py-4 rounded-xl font-bold shadow-lg text-center"
              >
                Create Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
