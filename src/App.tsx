import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AIStudio from './pages/AIStudio';
import Products from './pages/Products';
import Checkout from './pages/Checkout';
import Gallery from './pages/Gallery';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Shipping from './pages/Shipping';
import Contact from './pages/Contact';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/studio" element={<AIStudio />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/products" element={<Products />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
