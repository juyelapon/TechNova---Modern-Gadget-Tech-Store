import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { formatPrice } from '../data/products';
import SmartImage from '../components/SmartImage';
import Rating from '../components/Rating';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useGlobal();

  const moveAllToCart = () => {
    wishlist.forEach((p) => addToCart(p));
  };

  if (wishlist.length === 0) {
    return (
      <div className="container-x py-16">
        <div className="glass mx-auto flex max-w-xl flex-col items-center rounded-3xl px-6 py-16 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-pink-500/30 blur-2xl" />
            <span className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-gray-900">
              <Heart className="h-10 w-10 text-pink-400" />
            </span>
          </div>
          <h1 className="mt-8 font-display text-3xl font-bold">Your wishlist is empty</h1>
          <p className="mt-3 max-w-sm text-gray-400">Tap the heart on any product to save it for later.</p>
          <Link to="/shop" className="btn-primary mt-8">
            Discover Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10 lg:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-pink-400">Saved for later</p>
          <h1 className="mt-2 font-display text-4xl font-bold">
            Wishlist <span className="text-gray-500">({wishlist.length})</span>
          </h1>
        </div>
        <button onClick={moveAllToCart} className="btn-primary">
          <ShoppingCart className="h-4 w-4" /> Add all to cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {wishlist.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass flex gap-4 rounded-2xl p-4"
            >
              <Link to={`/product/${p.id}`} className="shrink-0">
                <SmartImage src={p.images[0]} alt={p.name} className="h-28 w-28 rounded-xl" />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-xs uppercase tracking-wider text-purple-400">{p.category}</p>
                <Link to={`/product/${p.id}`} className="line-clamp-2 font-semibold hover:text-cyan-300">
                  {p.name}
                </Link>
                <Rating value={p.rating} size="h-3 w-3" />
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <span className="font-bold">{formatPrice(p.price)}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleWishlist(p)}
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-rose-500/10 hover:text-rose-400"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => addToCart(p)}
                      className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 p-2 text-white shadow-glow-sm"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
