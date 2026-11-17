import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Cpu, Headset, ShieldCheck, Zap } from 'lucide-react';
import HeroSlider from '../components/HeroSlider';
import BentoGrid from '../components/BentoGrid';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

export default function Home() {
  const scroller = useRef(null);
  const newArrivals = products.filter((p) => p.isNew);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  const scrollBy = (dir) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <>
      <div className="-mt-16 lg:-mt-20">
        <HeroSlider />
      </div>

      {/* Stats strip */}
      <section className="container-x relative z-10 -mt-6">
        <div className="glass grid grid-cols-2 gap-4 rounded-2xl p-5 sm:p-6 lg:grid-cols-4">
          {[
            { icon: Zap, value: '24h', label: 'Express dispatch' },
            { icon: ShieldCheck, value: '2 yrs', label: 'Warranty included' },
            { icon: Cpu, value: '120+', label: 'Premium brands' },
            { icon: Headset, value: '24/7', label: 'Expert support' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 text-cyan-300">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-white">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bento categories */}
      <section className="container-x mt-24">
        <motion.div {...fadeUp} className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">Categories</p>
            <h2 className="section-title">
              Explore the <span className="text-gradient">Nova Universe</span>
            </h2>
          </div>
          <Link to="/shop" className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-cyan-300">
            View all products <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </motion.div>
        <BentoGrid />
      </section>

      {/* New arrivals horizontal scroll */}
      <section className="mt-24">
        <div className="container-x">
          <motion.div {...fadeUp} className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-purple-400">Just Dropped</p>
              <h2 className="section-title">New Arrivals</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollBy(-1)}
                className="glass rounded-full p-3 transition hover:border-cyan-400/50 hover:text-cyan-300"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollBy(1)}
                className="glass rounded-full p-3 transition hover:border-cyan-400/50 hover:text-cyan-300"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>
        <div
          ref={scroller}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-6 pt-2 sm:px-6 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))]"
        >
          {newArrivals.map((p) => (
            <div key={p.id} className="w-[78%] shrink-0 snap-start sm:w-[45%] md:w-[34%] lg:w-[23%]">
              <ProductCard product={p} className="h-full" />
            </div>
          ))}
          <Link
            to="/shop"
            className="glass group flex w-[60%] shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-2xl text-center transition hover:border-cyan-400/50 sm:w-[30%] lg:w-[18%]"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 shadow-glow-cyan transition group-hover:scale-110">
              <ArrowRight className="h-6 w-6" />
            </span>
            <span className="font-semibold">View all products</span>
          </Link>
        </div>
      </section>

      {/* Promo banner */}
      <section className="container-x mt-20">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-500/10 via-gray-900 to-purple-600/20 p-8 sm:p-12"
        >
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-300">Limited Time</p>
              <h2 className="font-display text-3xl font-bold sm:text-5xl">
                Upgrade season. <span className="text-gradient">20% off</span> everything.
              </h2>
              <p className="mt-4 text-gray-300">
                Use code <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono font-semibold text-white">NEON20</span> at checkout. Valid on all categories while stocks last.
              </p>
              <Link to="/shop" className="btn-primary mt-8">
                Start Shopping <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {topRated.slice(0, 2).map((p, i) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className={`group overflow-hidden rounded-2xl border border-white/10 ${i === 1 ? 'mt-8' : ''}`}
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Top rated */}
      <section className="container-x mt-24">
        <motion.div {...fadeUp} className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">Community Favourites</p>
          <h2 className="section-title">Top Rated Gear</h2>
        </motion.div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topRated.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
