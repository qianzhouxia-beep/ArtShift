import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

interface Props {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: Props) {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Header />
      <main className="pt-20 md:pt-24 flex items-center justify-center min-h-[80vh]">
        <div className="text-center space-y-6 px-4">
          <span className="material-symbols-outlined text-6xl md:text-7xl text-primary/30">construction</span>
          <h1 className="text-3xl md:text-headline-lg text-on-surface">{title}</h1>
          <p className="text-body-md md:text-body-lg text-on-surface-variant max-w-md mx-auto">
            {description || 'This page is being crafted with the same care as our products. Check back soon.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-vivid-purple text-stark-white px-6 py-3 rounded-xl font-label-bold hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
