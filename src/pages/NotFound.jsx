import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Satellite } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] items-center justify-center py-20">
      <div className="text-center">
        <motion.div animate={{ y: [0, -12, 0], rotate: [0, 6, 0] }} transition={{ duration: 5, repeat: Infinity }}>
          <Satellite className="mx-auto h-20 w-20 text-cyan-300 drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]" />
        </motion.div>
        <h1 className="mt-8 font-display text-7xl font-bold text-gradient sm:text-8xl">404</h1>
        <p className="mt-4 text-xl font-semibold">Signal lost in deep space</p>
        <p className="mt-2 text-gray-400">The page or product you’re looking for doesn’t exist.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">
            <ArrowLeft className="h-4 w-4" /> Back Home
          </Link>
          <Link to="/shop" className="btn-ghost">Browse Shop</Link>
        </div>
      </div>
    </div>
  );
}
