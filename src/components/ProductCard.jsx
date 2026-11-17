import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';
import { formatPrice } from '../data/products';
import SmartImage from './SmartImage';
import Rating from './Rating';

const BADGE_STYLES = {
  Sale: 'bg-rose-500/90',
  New: 'bg-cyan-500/90',
  Hot: 'bg-orange-500/90',
  Limited: 'bg-purple-600/90',
  Bestseller: 'bg-amber-500/90',
};

const ProductCard = forwardRef(function ProductCard({ product, className = '' }, ref) {
  const { addToCart, toggleWishlist, isWishlisted } = useGlobal();
  const wished = isWishlisted(product.id);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={`glass group relative flex flex-col overflow-hidden rounded-2xl transition-shadow duration-300 hover:border-cyan-400/40 hover:shadow-glow-cyan ${className}`}
    >
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden">
        <SmartImage
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full"
          imgClassName="transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur ${
                BADGE_STYLES[product.badge] || 'bg-gray-800/90'
              }`}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-gray-950/80 px-2.5 py-1 text-[11px] font-bold text-cyan-300 backdrop-blur">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      <button
        onClick={() => toggleWishlist(product)}
        aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`absolute right-3 top-3 rounded-full border border-white/10 p-2 backdrop-blur-md transition ${
          wished ? 'bg-pink-500/20 text-pink-400' : 'bg-gray-950/60 text-gray-300 hover:text-pink-400'
        }`}
      >
        <Heart className="h-4 w-4" fill={wished ? 'currentColor' : 'none'} />
      </button>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-purple-400">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-white transition group-hover:text-cyan-300 sm:text-lg">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2">
          <Rating value={product.rating} count={product.reviewCount} size="h-3.5 w-3.5" />
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="text-xl font-bold text-white">{formatPrice(product.price)}</p>
            {product.oldPrice && (
              <p className="text-xs text-gray-500 line-through">{formatPrice(product.oldPrice)}</p>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-glow-sm transition hover:shadow-glow-purple"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
});

export default ProductCard;
