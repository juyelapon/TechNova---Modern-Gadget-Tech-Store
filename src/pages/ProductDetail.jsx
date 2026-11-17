import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BadgeCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Zap,
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { getProductById, products, formatPrice } from '../data/products';
import SmartImage from '../components/SmartImage';
import Rating from '../components/Rating';
import ProductCard from '../components/ProductCard';
import NotFound from './NotFound';

function AccordionItem({ title, icon: Icon, open, onToggle, children }) {
  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="flex items-center gap-3 font-semibold text-white">
          <Icon className={`h-5 w-5 ${open ? 'text-cyan-300' : 'text-gray-500'}`} />
          {title}
        </span>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180 text-cyan-300' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);
  const { addToCart, toggleWishlist, isWishlisted, showToast } = useGlobal();

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [openSection, setOpenSection] = useState('specs');
  const [userReviews, setUserReviews] = useState([]);
  const [form, setForm] = useState({ name: '', rating: 5, title: '', text: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setActiveImage(0);
    setQty(1);
    setUserReviews([]);
    setShowForm(false);
  }, [id]);

  const related = useMemo(() => {
    if (!product) return [];
    const same = products.filter((p) => p.category === product.category && p.id !== product.id);
    const others = products.filter((p) => p.category !== product.category);
    return [...same, ...others].slice(0, 4);
  }, [product]);

  if (!product) return <NotFound />;

  const reviews = [...userReviews, ...product.reviews];
  const wished = isWishlisted(product.id);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    // Synthesised distribution from overall rating, blended with real reviews
    const base = { 5: 0.72, 4: 0.18, 3: 0.06, 2: 0.025, 1: 0.015 }[star];
    const adjust = (product.rating - 4.5) * (star === 5 ? 0.4 : star === 4 ? -0.25 : -0.05);
    return { star, pct: Math.max(1, Math.round((base + adjust) * 100)) };
  });

  const changeImage = (dir) => setActiveImage((i) => (i + dir + product.images.length) % product.images.length);

  const handleAdd = () => addToCart(product, qty);
  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Link copied', { type: 'info', description: 'Product URL copied to clipboard' });
    } catch {
      showToast('Could not copy link', { type: 'error' });
    }
  };

  const submitReview = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      showToast('Please fill in your name and review', { type: 'error' });
      return;
    }
    setUserReviews((prev) => [
      { ...form, name: form.name.trim(), date: new Date().toISOString().slice(0, 10), verified: false },
      ...prev,
    ]);
    setForm({ name: '', rating: 5, title: '', text: '' });
    setShowForm(false);
    showToast('Review submitted', { description: 'Thanks for sharing your experience!' });
  };

  return (
    <div className="container-x py-8 lg:py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-cyan-300">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/shop" className="hover:text-cyan-300">Shop</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-cyan-300">
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="line-clamp-1 text-gray-300">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass group relative aspect-square overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0"
              >
                <SmartImage
                  src={product.images[activeImage]}
                  alt={`${product.name} view ${activeImage + 1}`}
                  className="h-full w-full"
                  imgClassName="transition-transform duration-700 group-hover:scale-110"
                />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
            {product.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-glow-cyan">
                {product.badge}
              </span>
            )}
            <button
              onClick={() => changeImage(-1)}
              className="glass absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-2.5 opacity-100 transition hover:text-cyan-300 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => changeImage(1)}
              className="glass absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2.5 opacity-100 transition hover:text-cyan-300 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="glass absolute bottom-4 right-4 rounded-full px-3 py-1 text-xs text-gray-300">
              {activeImage + 1} / {product.images.length}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {product.images.map((src, i) => (
              <button
                key={src + i}
                onClick={() => setActiveImage(i)}
                className={`relative aspect-square overflow-hidden rounded-2xl border-2 transition ${
                  i === activeImage
                    ? 'border-cyan-400 shadow-glow-cyan'
                    : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <SmartImage src={src} alt="" className="h-full w-full" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-purple-400">
            {product.brand} · {product.category}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Rating value={product.rating} showValue count={product.reviewCount} />
            <a href="#reviews" className="text-sm text-cyan-300 hover:underline">
              Read reviews
            </a>
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <span className="font-display text-4xl font-bold text-white">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <>
                <span className="pb-1 text-lg text-gray-500 line-through">{formatPrice(product.oldPrice)}</span>
                <span className="mb-1 rounded-full bg-rose-500/15 px-2.5 py-1 text-xs font-bold text-rose-300">
                  Save {discount}%
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">Tax calculated at checkout. Or 4 interest-free payments of {formatPrice(product.price / 4)}.</p>

          <p className="mt-6 leading-relaxed text-gray-300">{product.description}</p>

          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                <Zap className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" /> {f}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center gap-2 text-sm">
            <span className={`h-2.5 w-2.5 rounded-full ${product.stock > 10 ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-amber-400 shadow-[0_0_10px_#fbbf24]'}`} />
            <span className={product.stock > 10 ? 'text-emerald-300' : 'text-amber-300'}>
              {product.stock > 10 ? 'In stock — ships within 24h' : `Only ${product.stock} left in stock`}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="glass flex items-center justify-between rounded-xl sm:justify-start">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                className="p-3.5 text-gray-300 transition hover:text-cyan-300 disabled:opacity-30"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                disabled={qty >= product.stock}
                className="p-3.5 text-gray-300 transition hover:text-cyan-300 disabled:opacity-30"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={handleAdd} className="btn-primary flex-1">
              <ShoppingCart className="h-5 w-5" /> Add to Cart — {formatPrice(product.price * qty)}
            </motion.button>
          </div>
          <div className="mt-3 flex gap-3">
            <button onClick={handleBuyNow} className="btn-ghost flex-1">
              Buy Now
            </button>
            <button
              onClick={() => toggleWishlist(product)}
              className={`btn-ghost px-4 ${wished ? 'border-pink-400/50 text-pink-400' : ''}`}
              aria-label="Toggle wishlist"
            >
              <Heart className="h-5 w-5" fill={wished ? 'currentColor' : 'none'} />
            </button>
            <button onClick={handleShare} className="btn-ghost px-4" aria-label="Share">
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, text: 'Free shipping $500+' },
              { icon: RotateCcw, text: '30-day returns' },
              { icon: ShieldCheck, text: '2-year warranty' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="glass flex flex-col items-center gap-2 rounded-xl p-3 text-center">
                <Icon className="h-5 w-5 text-cyan-300" />
                <span className="text-[11px] leading-tight text-gray-400 sm:text-xs">{text}</span>
              </div>
            ))}
          </div>

          {/* Accordion */}
          <div className="glass mt-8 rounded-2xl px-5 sm:px-6">
            <AccordionItem
              title="Technical Specifications"
              icon={Cpu}
              open={openSection === 'specs'}
              onToggle={() => setOpenSection((s) => (s === 'specs' ? null : 'specs'))}
            >
              <dl className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/5">
                {Object.entries(product.specs).map(([k, v], i) => (
                  <div key={k} className={`grid grid-cols-5 gap-4 px-4 py-3 text-sm ${i % 2 ? 'bg-white/[0.02]' : ''}`}>
                    <dt className="col-span-2 text-gray-500">{k}</dt>
                    <dd className="col-span-3 font-medium text-gray-200">{v}</dd>
                  </div>
                ))}
              </dl>
            </AccordionItem>
            <AccordionItem
              title="What's in the Box"
              icon={BadgeCheck}
              open={openSection === 'box'}
              onToggle={() => setOpenSection((s) => (s === 'box' ? null : 'box'))}
            >
              <ul className="list-inside list-disc space-y-1.5 text-sm text-gray-300 marker:text-cyan-400">
                <li>{product.name}</li>
                <li>USB-C to USB-C braided cable (1.5m)</li>
                <li>Quick start guide & warranty card</li>
                <li>TechNova premium carry pouch</li>
              </ul>
            </AccordionItem>
            <AccordionItem
              title="Shipping & Returns"
              icon={Truck}
              open={openSection === 'shipping'}
              onToggle={() => setOpenSection((s) => (s === 'shipping' ? null : 'shipping'))}
            >
              <p className="text-sm leading-relaxed text-gray-300">
                Orders placed before 3PM ship the same day. Free express shipping on orders over $500, otherwise a flat $14.99.
                Not in love? Return within 30 days for a full refund — we even cover return postage.
              </p>
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section id="reviews" className="mt-20 scroll-mt-28">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">Reviews</p>
            <h2 className="section-title">What Customers Say</h2>
          </div>
          <button onClick={() => setShowForm((s) => !s)} className="btn-ghost">
            <Star className="h-4 w-4" /> {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <div className="glass h-fit rounded-2xl p-6">
            <div className="flex items-end gap-3">
              <span className="font-display text-5xl font-bold text-gradient">{product.rating.toFixed(1)}</span>
              <span className="pb-2 text-sm text-gray-400">out of 5</span>
            </div>
            <div className="mt-2">
              <Rating value={product.rating} />
            </div>
            <p className="mt-1 text-sm text-gray-500">Based on {(product.reviewCount + userReviews.length).toLocaleString()} reviews</p>
            <div className="mt-6 space-y-2.5">
              {breakdown.map(({ star, pct }) => (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-3 text-gray-400">{star}</span>
                  <Star className="h-3.5 w-3.5 text-amber-400" fill="currentColor" strokeWidth={0} />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: (5 - star) * 0.08 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"
                    />
                  </div>
                  <span className="w-9 text-right text-xs text-gray-500">{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {showForm && (
                <motion.form
                  onSubmit={submitReview}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="glass space-y-4 rounded-2xl border-cyan-400/30 p-6">
                    <div>
                      <span className="mb-2 block text-sm text-gray-400">Your rating</span>
                      <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            type="button"
                            key={s}
                            onMouseEnter={() => setHoverRating(s)}
                            onClick={() => setForm((f) => ({ ...f, rating: s }))}
                            aria-label={`${s} stars`}
                          >
                            <Star
                              className={`h-7 w-7 transition ${
                                s <= (hoverRating || form.rating) ? 'text-amber-400' : 'text-gray-700'
                              }`}
                              fill="currentColor"
                              strokeWidth={0}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        className="input-field"
                        placeholder="Your name *"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      />
                      <input
                        className="input-field"
                        placeholder="Review title"
                        value={form.title}
                        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      />
                    </div>
                    <textarea
                      className="input-field min-h-[110px] resize-y"
                      placeholder="Share your experience *"
                      value={form.text}
                      onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
                    />
                    <button type="submit" className="btn-primary">Submit Review</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {reviews.map((rv, i) => (
              <motion.article
                key={`${rv.name}-${rv.date}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 font-bold text-white">
                      {rv.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{rv.name}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-500">
                        {rv.verified === false ? (
                          'Just now'
                        ) : (
                          <>
                            <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" /> Verified buyer
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Rating value={rv.rating} size="h-3.5 w-3.5" />
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(rv.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                {rv.title && <h4 className="mt-4 font-semibold text-gray-100">{rv.title}</h4>}
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{rv.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="mt-20">
        <h2 className="section-title mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
