import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Cpu,
  Headphones,
  Heart,
  House,
  Keyboard,
  Menu,
  Plane,
  Search,
  ShoppingCart,
  Watch,
  X,
  Zap,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { CATEGORIES, products, formatPrice } from '../data/products';

export const CATEGORY_ICONS = {
  Audio: Headphones,
  Peripherals: Keyboard,
  'Smart Home': House,
  Wearables: Watch,
  Drones: Plane,
};

const MEGA_MENU = [
  { name: 'Audio', links: ['Noise-Cancelling Headphones', 'True Wireless Earbuds', 'Studio Monitors'] },
  { name: 'Peripherals', links: ['Mechanical Keyboards', 'Gaming Mice', 'Desk Accessories'] },
  { name: 'Smart Home', links: ['Smart Speakers', 'Security Cameras', 'Smart Lighting'] },
  { name: 'Wearables', links: ['Smartwatches', 'Fitness Bands', 'Health Trackers'] },
];

const navLinkClass = ({ isActive }) =>
  `relative px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'text-cyan-300' : 'text-gray-300 hover:text-white'
  }`;

export default function Navbar() {
  const { totals, wishlist } = useGlobal();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCatsOpen, setMobileCatsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const closeTimer = useRef(null);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const featured = products.find((p) => p.id === 4);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const openMega = () => {
    clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
    setQuery('');
  };

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || megaOpen ? 'glass-strong border-x-0 border-t-0 shadow-[0_8px_32px_rgba(0,0,0,0.4)]' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-4 lg:h-20">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-purple-600 shadow-glow-cyan transition group-hover:shadow-glow-purple">
            <Zap className="h-5 w-5 text-white" fill="currentColor" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight">
            Tech<span className="text-gradient">Nova</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>
          <div onMouseEnter={openMega} onMouseLeave={closeMega} className="relative">
            <button
              onClick={() => setMegaOpen((o) => !o)}
              aria-expanded={megaOpen}
              className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors ${
                megaOpen ? 'text-cyan-300' : 'text-gray-300 hover:text-white'
              }`}
            >
              Categories
              <ChevronDown className={`h-4 w-4 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          <NavLink to="/wishlist" className={navLinkClass}>
            Wishlist
          </NavLink>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <form onSubmit={submitSearch} className="relative hidden md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gadgets…"
              className="w-44 rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm outline-none transition-all placeholder:text-gray-500 focus:w-64 focus:border-cyan-400/60 focus:bg-white/10 xl:w-56"
            />
          </form>
          <button
            onClick={() => setSearchOpen((o) => !o)}
            className="rounded-xl p-2.5 text-gray-300 transition hover:bg-white/10 hover:text-white md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            to="/wishlist"
            className="relative rounded-xl p-2.5 text-gray-300 transition hover:bg-white/10 hover:text-pink-400"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishlist.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink-500 px-1 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link
            to="/cart"
            className="relative rounded-xl p-2.5 text-gray-300 transition hover:bg-white/10 hover:text-cyan-300"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {totals.itemCount > 0 && (
                <motion.span
                  key={totals.itemCount}
                  initial={{ scale: 0.4 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 px-1 text-[10px] font-bold text-white shadow-glow-sm"
                >
                  {totals.itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-xl p-2.5 text-gray-300 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile search bar */}
      <AnimatePresence>
        {searchOpen && (
          <motion.form
            onSubmit={submitSearch}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="container-x overflow-hidden md:hidden"
          >
            <div className="relative pb-3">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search gadgets…"
                className="input-field pl-9"
              />
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Mega menu */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            onMouseEnter={openMega}
            onMouseLeave={closeMega}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-full hidden lg:block"
          >
            <div className="glass-strong border-x-0 shadow-2xl">
              <div className="container-x grid grid-cols-12 gap-8 py-8">
                <div className="col-span-8 grid grid-cols-4 gap-6">
                  {MEGA_MENU.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.name];
                    const count = products.filter((p) => p.category === cat.name).length;
                    return (
                      <div key={cat.name}>
                        <Link
                          to={`/shop?category=${encodeURIComponent(cat.name)}`}
                          className="group mb-4 flex items-center gap-3"
                        >
                          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 text-cyan-300 transition group-hover:shadow-glow-cyan">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="font-semibold text-white transition group-hover:text-cyan-300">{cat.name}</p>
                            <p className="text-xs text-gray-500">{count} products</p>
                          </div>
                        </Link>
                        <ul className="space-y-2.5">
                          {cat.links.map((l) => (
                            <li key={l}>
                              <Link
                                to={`/shop?category=${encodeURIComponent(cat.name)}`}
                                className="text-sm text-gray-400 transition hover:translate-x-1 hover:text-white"
                              >
                                {l}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                  <Link
                    to="/shop?category=Drones"
                    className="col-span-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition hover:border-cyan-400/40"
                  >
                    <span className="flex items-center gap-3 text-sm text-gray-300">
                      <Plane className="h-5 w-5 text-purple-400" />
                      Also explore our <strong className="text-white">Drones</strong> collection — 8K aerial cinema.
                    </span>
                    <ArrowRight className="h-4 w-4 text-cyan-300" />
                  </Link>
                </div>
                {featured && (
                  <Link
                    to={`/product/${featured.id}`}
                    className="group relative col-span-4 overflow-hidden rounded-2xl border border-white/10"
                  >
                    <img
                      src={featured.images[0]}
                      alt={featured.name}
                      className="h-full max-h-72 w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                    <div className="absolute bottom-0 p-5">
                      <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-cyan-400/15 px-2.5 py-1 text-xs font-semibold text-cyan-300">
                        <Cpu className="h-3 w-3" /> Featured
                      </span>
                      <p className="font-display text-lg font-bold">{featured.name}</p>
                      <p className="text-sm text-gray-300">
                        From <span className="text-cyan-300">{formatPrice(featured.price)}</span>
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>

      {/* Mobile drawer (outside header so backdrop-filter doesn't trap fixed positioning) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="glass-strong fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-sm flex-col border-y-0 border-r-0 lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-5">
                <span className="font-display text-lg font-bold">
                  Tech<span className="text-gradient">Nova</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 space-y-1 overflow-y-auto px-3 pb-6">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/shop', label: 'Shop All' },
                ].map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 font-medium ${
                        isActive ? 'bg-cyan-400/10 text-cyan-300' : 'text-gray-200 hover:bg-white/5'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                <button
                  onClick={() => setMobileCatsOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 font-medium text-gray-200 hover:bg-white/5"
                >
                  Categories
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileCatsOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {mobileCatsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 py-1 pl-3">
                        {CATEGORIES.map((c) => {
                          const Icon = CATEGORY_ICONS[c.name];
                          return (
                            <Link
                              key={c.name}
                              to={`/shop?category=${encodeURIComponent(c.name)}`}
                              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:bg-white/5 hover:text-cyan-300"
                            >
                              <Icon className="h-4 w-4" />
                              {c.name}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                {[
                  { to: '/wishlist', label: `Wishlist (${wishlist.length})` },
                  { to: '/cart', label: `Cart (${totals.itemCount})` },
                  { to: '/checkout', label: 'Checkout' },
                ].map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 font-medium ${
                        isActive ? 'bg-cyan-400/10 text-cyan-300' : 'text-gray-200 hover:bg-white/5'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </div>
              <div className="border-t border-white/10 p-5">
                <Link to="/shop" className="btn-primary w-full">
                  Explore the Shop <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
