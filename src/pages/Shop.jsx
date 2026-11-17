import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PackageSearch, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import Rating from '../components/Rating';
import { CATEGORY_ICONS } from '../components/Navbar';
import { CATEGORIES, products, formatPrice } from '../data/products';

const PER_PAGE = 6;
const PRICE_MIN = 0;
const PRICE_MAX = 1000;
const PRICE_STEP = 10;

const SORTS = {
  featured: { label: 'Featured', fn: (a, b) => a.id - b.id },
  'price-asc': { label: 'Price: Low to High', fn: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: High to Low', fn: (a, b) => b.price - a.price },
  rating: { label: 'Top Rated', fn: (a, b) => b.rating - a.rating },
  newest: { label: 'Newest', fn: (a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id },
};

function FilterPanel({ category, setCategory, price, setPrice, minRating, setMinRating, query, setQuery, onReset }) {
  const [min, max] = price;
  const leftPct = ((min - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const rightPct = ((max - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className="space-y-8">
      {/* Search */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Search</h3>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Product, brand…"
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Category</h3>
        <ul className="space-y-1">
          {[{ name: 'All' }, ...CATEGORIES].map((c) => {
            const Icon = CATEGORY_ICONS[c.name] || PackageSearch;
            const count = c.name === 'All' ? products.length : products.filter((p) => p.category === c.name).length;
            const active = category === c.name;
            return (
              <li key={c.name}>
                <button
                  onClick={() => setCategory(c.name)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                    active
                      ? 'border border-cyan-400/40 bg-cyan-400/10 text-cyan-300 shadow-glow-sm'
                      : 'border border-transparent text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    {c.name === 'All' ? 'All Products' : c.name}
                  </span>
                  <span className={`rounded-md px-1.5 py-0.5 text-xs ${active ? 'bg-cyan-400/20' : 'bg-white/5 text-gray-500'}`}>
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price range */}
      <div>
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Price Range</h3>
        <div className="relative h-6">
          <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-gray-800" />
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-glow-sm"
            style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={min}
            onChange={(e) => setPrice([Math.min(Number(e.target.value), max - PRICE_STEP), max])}
            className="range-thumb top-1/2 -translate-y-1/2"
            style={{ zIndex: min > PRICE_MAX - 100 ? 5 : 3 }}
            aria-label="Minimum price"
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={max}
            onChange={(e) => setPrice([min, Math.max(Number(e.target.value), min + PRICE_STEP)])}
            className="range-thumb top-1/2 -translate-y-1/2"
            style={{ zIndex: 4 }}
            aria-label="Maximum price"
          />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            ['Min', min, (v) => setPrice([Math.max(PRICE_MIN, Math.min(v, max - PRICE_STEP)), max])],
            ['Max', max, (v) => setPrice([min, Math.min(PRICE_MAX, Math.max(v, min + PRICE_STEP))])],
          ].map(([label, val, set]) => (
            <label key={label} className="block">
              <span className="mb-1 block text-[11px] uppercase text-gray-500">{label}</span>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">$</span>
                <input
                  type="number"
                  value={val}
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  onChange={(e) => set(Number(e.target.value) || 0)}
                  className="input-field py-2 pl-7"
                />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Minimum Rating</h3>
        <div className="space-y-1">
          {[0, 4.5, 4.7].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                minRating === r ? 'bg-purple-500/10 text-purple-300' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <span
                className={`h-4 w-4 rounded-full border-2 ${
                  minRating === r ? 'border-purple-400 bg-purple-400 shadow-glow-purple' : 'border-gray-600'
                }`}
              />
              {r === 0 ? 'Any rating' : (
                <span className="flex items-center gap-2">
                  <Rating value={r} size="h-3.5 w-3.5" /> {r}+
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <button onClick={onReset} className="btn-ghost w-full py-2.5 text-sm">
        <RotateCcw className="h-4 w-4" /> Reset Filters
      </button>
    </div>
  );
}

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') || 'All';
  const urlQuery = params.get('q') || '';
  const page = Math.max(1, Number(params.get('page')) || 1);

  const [query, setQuery] = useState(urlQuery);
  const [price, setPrice] = useState([PRICE_MIN, PRICE_MAX]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('featured');
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sync input with URL query (e.g. navbar search)
  useEffect(() => setQuery(urlQuery), [urlQuery]);

  const updateParams = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => {
      if (v === null || v === '' || v === 'All' || (k === 'page' && v === 1)) next.delete(k);
      else next.set(k, String(v));
    });
    setParams(next, { replace: true });
  };

  const setCategory = (c) => {
    updateParams({ category: c, page: 1 });
    setDrawerOpen(false);
  };
  const handleQuery = (q) => {
    setQuery(q);
    updateParams({ q, page: 1 });
  };
  const handlePrice = (p) => {
    setPrice(p);
    if (page !== 1) updateParams({ page: 1 });
  };
  const handleRating = (r) => {
    setMinRating(r);
    if (page !== 1) updateParams({ page: 1 });
  };
  const handleSort = (s) => {
    setSort(s);
    if (page !== 1) updateParams({ page: 1 });
  };
  const reset = () => {
    setQuery('');
    setPrice([PRICE_MIN, PRICE_MAX]);
    setMinRating(0);
    setSort('featured');
    setParams({}, { replace: true });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => category === 'All' || p.category === category)
      .filter((p) => p.price >= price[0] && p.price <= price[1])
      .filter((p) => p.rating >= minRating)
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .sort(SORTS[sort].fn);
  }, [category, price, minRating, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const goToPage = (p) => {
    updateParams({ page: p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeChips = [
    category !== 'All' && { label: category, clear: () => setCategory('All') },
    urlQuery && { label: `“${urlQuery}”`, clear: () => handleQuery('') },
    (price[0] !== PRICE_MIN || price[1] !== PRICE_MAX) && {
      label: `${formatPrice(price[0])} – ${formatPrice(price[1])}`,
      clear: () => handlePrice([PRICE_MIN, PRICE_MAX]),
    },
    minRating > 0 && { label: `${minRating}+ stars`, clear: () => handleRating(0) },
  ].filter(Boolean);

  const panelProps = {
    category,
    setCategory,
    price,
    setPrice: handlePrice,
    minRating,
    setMinRating: handleRating,
    query,
    setQuery: handleQuery,
    onReset: reset,
  };

  return (
    <div className="container-x py-10 lg:py-14">
      {/* Header */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/10 via-gray-900/60 to-purple-600/10 p-8 sm:p-10">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-purple-600/20 blur-3xl" />
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">The Shop</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
          {category === 'All' ? (
            <>All <span className="text-gradient">Gadgets</span></>
          ) : (
            <span className="text-gradient">{category}</span>
          )}
        </h1>
        <p className="mt-3 max-w-xl text-gray-400">
          {category === 'All'
            ? 'Hand-picked, rigorously tested tech from the brands shaping tomorrow.'
            : CATEGORIES.find((c) => c.name === category)?.description}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="glass sticky top-28 rounded-2xl p-6">
            <FilterPanel {...panelProps} />
          </div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setDrawerOpen(true)} className="btn-ghost px-4 py-2.5 text-sm lg:hidden">
                <SlidersHorizontal className="h-4 w-4" /> Filters
                {activeChips.length > 0 && (
                  <span className="rounded-full bg-cyan-400 px-1.5 text-xs text-gray-950">{activeChips.length}</span>
                )}
              </button>
              <p className="text-sm text-gray-400">
                Showing{' '}
                <span className="font-semibold text-white">
                  {filtered.length === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1}–
                  {Math.min(currentPage * PER_PAGE, filtered.length)}
                </span>{' '}
                of <span className="font-semibold text-white">{filtered.length}</span> products
              </p>
            </div>
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              className="rounded-xl border border-white/10 bg-gray-900/80 px-4 py-2.5 text-sm text-gray-200 outline-none focus:border-cyan-400/60"
              aria-label="Sort products"
            >
              {Object.entries(SORTS).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active chips */}
          {activeChips.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={chip.clear}
                  className="flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/20"
                >
                  {chip.label} <X className="h-3 w-3" />
                </button>
              ))}
              <button onClick={reset} className="text-xs text-gray-500 underline-offset-2 hover:text-white hover:underline">
                Clear all
              </button>
            </div>
          )}

          {/* Grid */}
          {pageItems.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {pageItems.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="glass flex flex-col items-center rounded-2xl px-6 py-20 text-center">
              <PackageSearch className="h-14 w-14 text-gray-600" />
              <h3 className="mt-4 font-display text-xl font-semibold">No products match your filters</h3>
              <p className="mt-2 text-sm text-gray-400">Try widening the price range or choosing another category.</p>
              <button onClick={reset} className="btn-primary mt-6">
                <RotateCcw className="h-4 w-4" /> Reset Filters
              </button>
            </div>
          )}

          <div className="mt-12">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
            {totalPages > 1 && (
              <p className="mt-3 text-center text-xs text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="glass-strong fixed inset-y-0 left-0 z-[60] w-[85%] max-w-sm overflow-y-auto p-6 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-xl p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterPanel {...panelProps} />
              <button onClick={() => setDrawerOpen(false)} className="btn-primary mt-6 w-full">
                Show {filtered.length} results
              </button>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
