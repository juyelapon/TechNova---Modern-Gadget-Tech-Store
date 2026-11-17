import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lock, Minus, Plus, ShoppingBag, Tag, Trash2, Truck, X } from 'lucide-react';
import { useGlobal, TAX_RATE, FREE_SHIPPING_THRESHOLD } from '../context/GlobalContext';
import { formatPrice, products } from '../data/products';
import SmartImage from '../components/SmartImage';
import ProductCard from '../components/ProductCard';

export default function Cart() {
  const { cart, updateQty, removeFromCart, clearCart, totals, promo, applyPromo, removePromo, showToast } = useGlobal();
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const shippingProgress = Math.min(100, ((totals.subtotal - totals.discount) / FREE_SHIPPING_THRESHOLD) * 100);
  const suggestions = products.filter((p) => !cart.some((c) => c.id === p.id)).slice(0, 4);

  const handlePromo = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    if (applyPromo(code)) setCode('');
  };

  const handleClear = () => {
    clearCart();
    showToast('Cart cleared', { type: 'info' });
  };

  if (cart.length === 0) {
    return (
      <div className="container-x py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass mx-auto flex max-w-xl flex-col items-center rounded-3xl px-6 py-16 text-center"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-cyan-500/30 blur-2xl" />
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-gray-900">
              <ShoppingBag className="h-10 w-10 text-cyan-300" />
            </span>
          </div>
          <h1 className="mt-8 font-display text-3xl font-bold">Your cart is empty</h1>
          <p className="mt-3 max-w-sm text-gray-400">
            Looks like you haven’t added any gear yet. Explore our latest drops and find your next upgrade.
          </p>
          <Link to="/shop" className="btn-primary mt-8">
            Start Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <section className="mt-20">
          <h2 className="section-title mb-8">Trending Right Now</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="container-x py-10 lg:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">Your Cart</p>
          <h1 className="mt-2 font-display text-4xl font-bold">
            Shopping Cart <span className="text-gray-500">({totals.itemCount})</span>
          </h1>
        </div>
        <button onClick={handleClear} className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-rose-400">
          <Trash2 className="h-4 w-4" /> Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          {/* Free shipping progress */}
          <div className="glass mb-6 rounded-2xl p-5">
            <div className="flex items-center gap-3 text-sm">
              <Truck className="h-5 w-5 shrink-0 text-cyan-300" />
              {totals.remainingForFreeShipping > 0 ? (
                <p className="text-gray-300">
                  Add <span className="font-semibold text-cyan-300">{formatPrice(totals.remainingForFreeShipping)}</span> more for{' '}
                  <span className="font-semibold text-white">FREE express shipping</span>
                </p>
              ) : (
                <p className="font-semibold text-emerald-300">🎉 You’ve unlocked FREE express shipping!</p>
              )}
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-800">
              <motion.div
                animate={{ width: `${shippingProgress}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-glow-sm"
              />
            </div>
          </div>

          {/* Items */}
          <div className="glass overflow-hidden rounded-2xl">
            <div className="hidden grid-cols-12 gap-4 border-b border-white/10 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 md:grid">
              <span className="col-span-6">Product</span>
              <span className="col-span-3 text-center">Quantity</span>
              <span className="col-span-3 text-right">Total</span>
            </div>
            <ul>
              <AnimatePresence initial={false}>
                {cart.map((item) => (
                  <motion.li
                    key={item.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, x: -60, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden border-b border-white/5 last:border-b-0"
                  >
                    <div className="grid grid-cols-12 items-center gap-4 p-4 sm:p-6">
                      <div className="col-span-12 flex items-center gap-4 md:col-span-6">
                        <Link to={`/product/${item.id}`} className="shrink-0">
                          <SmartImage src={item.image} alt={item.name} className="h-20 w-20 rounded-xl border border-white/10 sm:h-24 sm:w-24" />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs uppercase tracking-wider text-purple-400">{item.category}</p>
                          <Link to={`/product/${item.id}`} className="line-clamp-2 font-semibold text-white transition hover:text-cyan-300">
                            {item.name}
                          </Link>
                          <p className="mt-1 text-sm text-gray-400">{formatPrice(item.price)} each</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="self-start rounded-lg p-2 text-gray-500 transition hover:bg-rose-500/10 hover:text-rose-400 md:hidden"
                          aria-label={`Remove ${item.name}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="col-span-6 flex justify-start md:col-span-3 md:justify-center">
                        <div className="flex items-center rounded-xl border border-white/10 bg-gray-900/60">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="p-2.5 text-gray-300 transition hover:text-cyan-300 disabled:opacity-30"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            type="number"
                            value={item.qty}
                            min={1}
                            max={item.stock}
                            onChange={(e) => updateQty(item.id, Number(e.target.value) || 1)}
                            className="w-10 bg-transparent text-center text-sm font-semibold outline-none"
                            aria-label="Quantity"
                          />
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            disabled={item.qty >= item.stock}
                            className="p-2.5 text-gray-300 transition hover:text-cyan-300 disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="col-span-6 flex items-center justify-end gap-3 md:col-span-3">
                        <motion.span key={item.qty} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="font-display text-lg font-bold text-white">
                          {formatPrice(item.price * item.qty)}
                        </motion.span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="hidden rounded-lg p-2 text-gray-500 transition hover:bg-rose-500/10 hover:text-rose-400 md:block"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>

          <Link to="/shop" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-cyan-300">
            <ArrowLeft className="h-4 w-4" /> Continue shopping
          </Link>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold">Order Summary</h2>

            <form onSubmit={handlePromo} className="mt-6">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">Promo code</label>
              {promo ? (
                <div className="flex items-center justify-between rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm">
                  <span className="flex items-center gap-2 font-semibold text-emerald-300">
                    <Tag className="h-4 w-4" /> {promo}
                  </span>
                  <button type="button" onClick={removePromo} className="text-gray-400 hover:text-white" aria-label="Remove promo">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="NOVA10" className="input-field uppercase" />
                  <button type="submit" className="btn-ghost shrink-0 px-4 py-2 text-sm">Apply</button>
                </div>
              )}
            </form>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-400">Subtotal ({totals.itemCount} items)</dt>
                <dd className="font-medium text-white">{formatPrice(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-300">
                  <dt>Discount ({promo})</dt>
                  <dd>−{formatPrice(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-400">Shipping</dt>
                <dd className="font-medium text-white">
                  {totals.shipping === 0 ? <span className="text-emerald-300">Free</span> : formatPrice(totals.shipping)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Estimated tax ({(TAX_RATE * 100).toFixed(0)}%)</dt>
                <dd className="font-medium text-white">{formatPrice(totals.tax)}</dd>
              </div>
              <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="flex items-end justify-between">
                <dt className="font-semibold text-white">Total</dt>
                <dd className="font-display text-3xl font-bold text-gradient">{formatPrice(totals.total)}</dd>
              </div>
            </dl>

            <button onClick={() => navigate('/checkout')} className="btn-primary mt-6 w-full py-4 text-base">
              <Lock className="h-4 w-4" /> Proceed to Checkout
            </button>
            <p className="mt-4 text-center text-xs text-gray-500">Secure 256-bit SSL encrypted checkout</p>
            <div className="mt-3 flex justify-center gap-2">
              {['VISA', 'MC', 'AMEX', 'PAYPAL'].map((b) => (
                <span key={b} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold tracking-wider text-gray-400">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {suggestions.length > 0 && (
        <section className="mt-20">
          <h2 className="section-title mb-8">Complete Your Setup</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
