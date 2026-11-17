import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { getProductById, formatPrice } from '../data/products';

const SLIDES = [
  {
    productId: 4,
    eyebrow: 'Flagship Audio',
    title: 'Silence the World.',
    highlight: 'Hear Everything.',
    text: 'AuraSonic X9 with adaptive hybrid ANC, beryllium drivers and 40h battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1800&q=80',
    glow: 'from-cyan-500/40',
  },
  {
    productId: 9,
    eyebrow: 'Aerial Cinema',
    title: 'Shoot in 8K.',
    highlight: 'From the Sky.',
    text: 'SkyHawk Pro: 1" CMOS sensor, 46-minute flights and 15km crystal-clear transmission.',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1800&q=80',
    glow: 'from-purple-500/40',
  },
  {
    productId: 1,
    eyebrow: 'Pro Peripherals',
    title: 'Every Keystroke.',
    highlight: 'Engineered.',
    text: 'Nova K1 Pro: gasket-mounted, hot-swappable, CNC aluminium. Your endgame keyboard.',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1800&q=80',
    glow: 'from-fuchsia-500/40',
  },
  {
    productId: 7,
    eyebrow: 'Next-Gen Wearables',
    title: 'Your Health.',
    highlight: 'Decoded.',
    text: 'Chrono S3 Titanium: ECG, SpO₂, dual-frequency GPS and a 3000-nit AMOLED display.',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1800&q=80',
    glow: 'from-sky-500/40',
  },
];

const AUTOPLAY_MS = 5500;

const variants = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0.4 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-30%' : '30%', opacity: 0 }),
};

export default function HeroSlider() {
  const [[index, direction], setState] = useState([0, 1]);
  const [paused, setPaused] = useState(false);

  const paginate = useCallback((dir) => {
    setState(([i]) => [(i + dir + SLIDES.length) % SLIDES.length, dir]);
  }, []);

  const goTo = (i) => setState(([cur]) => [i, i > cur ? 1 : -1]);

  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => paginate(1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [index, paused, paginate]);

  const slide = SLIDES[index];
  const product = getProductById(slide.productId);

  return (
    <section
      className="relative h-[560px] overflow-hidden sm:h-[620px] lg:h-[calc(100vh-5rem)] lg:max-h-[780px] lg:min-h-[600px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: 'spring', stiffness: 260, damping: 32 }, opacity: { duration: 0.4 } }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = offset.x * velocity.x;
            if (swipe < -8000 || offset.x < -120) paginate(1);
            else if (swipe > 8000 || offset.x > 120) paginate(-1);
          }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          <motion.img
            src={slide.image}
            alt={slide.title}
            draggable={false}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: 'easeOut' }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-gray-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/30" />
          <div className={`absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-gradient-to-br ${slide.glow} to-transparent blur-3xl`} />
          <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          <div className="container-x relative flex h-full items-center">
            <div className="max-w-2xl">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-300"
              >
                <Sparkles className="h-3.5 w-3.5" /> {slide.eyebrow}
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
              >
                {slide.title}
                <br />
                <span className="text-gradient drop-shadow-[0_0_25px_rgba(34,211,238,0.35)]">{slide.highlight}</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-6 max-w-lg text-base text-gray-300 sm:text-lg"
              >
                {slide.text}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
              >
                <Link to={`/product/${product.id}`} className="btn-primary">
                  Shop Now — {formatPrice(product.price)} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/shop" className="btn-ghost">
                  Explore All
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="container-x pointer-events-none absolute inset-x-0 bottom-8 flex items-center justify-between">
        <div className="pointer-events-auto flex items-center gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.productId}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="relative h-1.5 overflow-hidden rounded-full bg-white/20 transition-all duration-300"
              style={{ width: i === index ? 48 : 16 }}
            >
              {i === index && (
                <motion.span
                  key={`${index}-${paused}`}
                  initial={{ width: '0%' }}
                  animate={{ width: paused ? '0%' : '100%' }}
                  transition={{ duration: paused ? 0 : AUTOPLAY_MS / 1000, ease: 'linear' }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-purple-500"
                />
              )}
            </button>
          ))}
        </div>
        <div className="pointer-events-auto flex gap-2">
          <button
            onClick={() => paginate(-1)}
            className="glass rounded-full p-3 text-gray-200 transition hover:border-cyan-400/50 hover:text-cyan-300 hover:shadow-glow-cyan"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="glass rounded-full p-3 text-gray-200 transition hover:border-cyan-400/50 hover:text-cyan-300 hover:shadow-glow-cyan"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
