import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'https://artshift-backend.zeabur.app/api';

export default function SignUp() {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!fullName.trim()) { setError('Please enter your full name'); return; }
      if (!email.trim()) { setError('Please enter your email'); return; }
      if (!password || password.length < 6) { setError('Password must be at least 6 characters'); return; }
      if (!agreeTerms) { setError('Please agree to the Terms of Service'); return; }
    } else {
      if (!email.trim()) { setError('Please enter your email'); return; }
      if (!password) { setError('Please enter your password'); return; }
    }

    setLoading(true);
    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/login';
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      // Save session info from backend
      const token = data.session?.access_token;
      if (token) {
        localStorage.setItem('artshift_token', token);
        localStorage.setItem('artshift_user', JSON.stringify({
          id: data.user?.id,
          email: data.user?.email,
          fullName,
        }));
      }
      setRegistered(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Register success screen
  if (registered) {
    return (
      <div className="min-h-screen bg-surface text-on-surface flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-green-600">check</span>
          </div>
          <h1 className="text-headline-lg font-extrabold mb-4">
            {mode === 'signup' ? 'Account Created!' : 'Welcome Back!'}
          </h1>
          <p className="text-on-surface-variant text-body-lg mb-8">
            {mode === 'signup'
              ? 'Your account has been successfully created. Start creating your AI-powered designs!'
              : 'You\'ve been logged in successfully. Continue your creative journey.'}
          </p>
          <a href="/studio" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary-container transition-colors shadow-md">
            <span className="material-symbols-outlined">brush</span>
            Start Designing
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-on-surface">
      <main className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 md:px-16 py-12">
        {/* Decorative Background */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[1100px] grid md:grid-cols-2 bg-surface-container-lowest rounded-xl shadow-[0_20px_50px_-12px_rgba(107,56,212,0.12)] overflow-hidden">
          {/* Left: Branding */}
          <div className="hidden md:flex flex-col justify-between p-12 relative bg-primary text-on-primary">
            <div className="z-10">
              <a href="/" className="block mb-12">
                <img alt="ArtShift Logo" className="h-12 w-auto" src="/logo.png" />
              </a>
              <h2 className="text-5xl font-extrabold mb-6 leading-tight">Elevate Your Apparel with AI.</h2>
              <p className="text-lg leading-relaxed opacity-90">Join a community of digital creators turning artistic vision into wearable reality.</p>
            </div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-1 w-8 bg-on-primary rounded-full" />
                <div className="h-1 w-2 bg-on-primary/30 rounded-full" />
                <div className="h-1 w-2 bg-on-primary/30 rounded-full" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] opacity-70">Empowering Creatives</p>
            </div>
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent" />
            </div>
          </div>

          {/* Right: Form */}
          <div className="p-6 md:p-12 lg:p-20 flex flex-col justify-center">
            <div className="mb-12">
              <div className="md:hidden flex justify-center mb-6">
                <a href="/">
                  <img alt="ArtShift Logo" className="h-10 w-auto" src="/logo.png" />
                </a>
              </div>
              <h1 className="text-[32px] font-bold text-on-surface mb-1">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h1>
              <p className="text-base leading-relaxed text-on-surface-variant">{mode === 'signup' ? 'Start your journey into AI-driven fashion.' : 'Log in to continue your creative journey.'}</p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-2 mb-8">
              <button className="flex items-center justify-center gap-2 py-2 px-4 border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors active:scale-95 duration-200">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Google</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-2 px-4 border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-container transition-colors active:scale-95 duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C4.31 16.92 3.65 11.23 6.64 8.72c1.47-1.24 2.87-1.34 4.07-.63.92.54 1.48.56 2.45.02 1.4-.78 3.12-.91 4.3.49-2.92 1.62-2.43 5.48.43 6.63-.56 1.48-1.3 2.94-2.24 5.05zM12.03 7.25c-.13-2.05 1.57-3.9 3.51-4.25.32 2.37-2.01 4.39-3.51 4.25z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-surface-container-lowest text-outline">{mode === 'signup' ? 'Or register with email' : 'Or log in with email'}</span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {mode === 'signup' && (
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1" htmlFor="full_name">Full Name</label>
                <input className="w-full bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-lg p-2.5 text-base transition-all outline-none focus:bg-white" id="full_name" placeholder="John Doe" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1" htmlFor="email">Email Address</label>
                <input className="w-full bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-lg p-2.5 text-base transition-all outline-none focus:bg-white" id="email" placeholder="hello@artshift.ai" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="relative">
                <label className="block text-sm font-semibold text-on-surface mb-1" htmlFor="password">Password</label>
                <input className="w-full bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-lg p-2.5 text-base transition-all outline-none focus:bg-white pr-10" id="password" placeholder="••••••••" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="absolute right-2 bottom-2 p-1 text-outline hover:text-primary transition-colors" type="button" onClick={() => setShowPassword(!showPassword)}>
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
              {mode === 'signup' && (
              <div className="flex items-center gap-1">
                <input className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" id="terms" type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
                <label className="text-xs font-semibold text-on-surface-variant" htmlFor="terms">
                  I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                </label>
              </div>
              )}
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              <button className="w-full bg-primary text-on-primary py-3 px-6 rounded-full text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary-container hover:shadow-xl hover:-translate-y-px active:scale-95 transition-all duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed" type="submit" disabled={loading}>
                {loading ? (mode === 'signup' ? 'Creating...' : 'Signing in...') : (mode === 'signup' ? 'Create Account' : 'Log In')}
              </button>
            </form>

            <p className="text-center mt-8 text-base leading-relaxed text-on-surface-variant">
              {mode === 'signup' ? (
                <>Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-primary font-bold hover:underline">Log in</button></>
              ) : (
                <>Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="text-primary font-bold hover:underline">Sign up</button></>
              )}
            </p>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-6 px-16 bg-surface-container-lowest flex flex-col md:flex-row justify-between items-center gap-6 border-t border-surface-container-high">
        <p className="text-xs font-semibold text-outline">© 2024 ArtShift AI Apparel. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="/faq" className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Support</a>
          <a href="/privacy" className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Privacy</a>
          <a href="/terms" className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
}
