import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Send, ShieldCheck, Truck, RotateCcw, Zap } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { CATEGORIES } from '../data/products';

export default function Footer() {
  const { showToast } = useGlobal();
  const [email, setEmail] = useState('');

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showToast('Please enter a valid email', { type: 'error' });
      return;
    }
    showToast('Subscribed!', { description: 'Use code NOVA10 for 10% off your first order.' });
    setEmail('');
  };

  return (
    <footer className="relative mt-24 border-t border-white/10 bg-gray-950/80">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

      <div className="container-x grid gap-4 border-b border-white/5 py-8 sm:grid-cols-3">
        {[
          { icon: Truck, title: 'Free shipping', text: 'On orders over $500' },
          { icon: RotateCcw, title: '30-day returns', text: 'Hassle-free, no questions' },
          { icon: ShieldCheck, title: '2-year warranty', text: 'On every TechNova device' },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-300">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-sm text-gray-500">{text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600">
              <Zap className="h-5 w-5 text-white" fill="currentColor" />
            </span>
            <span className="font-display text-xl font-bold">
              Tech<span className="text-gradient">Nova</span>
            </span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
            Curated next-generation gadgets for creators, gamers and explorers. Engineered for the future, delivered today.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-cyan-400" /> 404 Neon Ave, San Francisco, CA</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-cyan-400" /> +1 (555) 010-2077</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-cyan-400" /> support@technova.dev</li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.name}>
                <Link to={`/shop?category=${encodeURIComponent(c.name)}`} className="text-gray-400 transition hover:text-cyan-300">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">Account</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              ['Cart', '/cart'],
              ['Wishlist', '/wishlist'],
              ['Checkout', '/checkout'],
              ['All Products', '/shop'],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-gray-400 transition hover:text-cyan-300">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 lg:col-span-4">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-300">Join the Nova Network</h4>
          <p className="mb-4 text-sm text-gray-400">Early access to drops, exclusive deals and 10% off your first order.</p>
          <form onSubmit={subscribe} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-field"
            />
            <button type="submit" className="btn-primary shrink-0 px-4" aria-label="Subscribe">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/5 py-6">
        <div className="container-x flex flex-col items-center justify-between gap-3 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} TechNova Inc. All rights reserved.</p>
          <div className="flex gap-5">
            <span className="cursor-pointer hover:text-gray-300">Privacy</span>
            <span className="cursor-pointer hover:text-gray-300">Terms</span>
            <span className="cursor-pointer hover:text-gray-300">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
