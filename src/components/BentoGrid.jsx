import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Truck } from 'lucide-react';
import { CATEGORIES, products } from '../data/products';
import { CATEGORY_ICONS } from './Navbar';

// Bento layout: each tile's span on md+ (4-col grid, 3 rows)
const LAYOUT = {
  Audio: 'md:col-span-2 md:row-span-2',
  Peripherals: 'sm:col-span-2 md:col-span-2',
  Wearables: 'md:col-span-1',
  'Smart Home': 'md:col-span-1',
  Drones: 'md:col-span-3',
};

export default function BentoGrid() {
  return (
    <div className="grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:auto-rows-[230px]">
      {CATEGORIES.map((cat, i) => {
        const Icon = CATEGORY_ICONS[cat.name];
        const count = products.filter((p) => p.category === cat.name).length;
        const large = cat.name === 'Audio';
        return (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className={`${LAYOUT[cat.name]} ${large ? 'sm:col-span-2 sm:row-span-2' : ''} ${
              cat.name === 'Drones' ? 'sm:col-span-2' : ''
            }`}
          >
            <Link
              to={`/shop?category=${encodeURIComponent(cat.name)}`}
              className="group relative flex h-full w-full overflow-hidden rounded-3xl border border-white/10 transition-all duration-500 hover:border-cyan-400/50 hover:shadow-glow-cyan"
            >
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-gray-950/10" />
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.accent} opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100`} />

              <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-5 sm:p-6">
                <div>
                  <span className="glass mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl text-cyan-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className={`font-display font-bold text-white ${large ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'}`}>
                    {cat.name}
                  </h3>
                  <p className={`mt-1 text-gray-300 ${large ? 'max-w-sm text-base' : 'text-sm'}`}>
                    {large ? cat.description : cat.tagline}
                  </p>
                  <p className="mt-2 text-xs font-medium text-cyan-300/80">{count} products</p>
                </div>
                <span className="glass flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-all duration-300 group-hover:rotate-45 group-hover:bg-cyan-400 group-hover:text-gray-950">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          </motion.div>
        );
      })}

      {/* Promo tile */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/20 via-gray-900 to-purple-600/30 p-6 sm:col-span-2 md:col-span-1"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-cyan-500/30 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between">
          <Truck className="h-8 w-8 text-cyan-300" />
          <div>
            <p className="font-display text-4xl font-bold text-gradient">FREE</p>
            <p className="mt-1 text-sm text-gray-300">Express shipping on all orders over $500. Code <span className="font-semibold text-white">NOVA10</span> saves 10%.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
