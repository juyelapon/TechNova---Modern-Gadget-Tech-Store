import { AnimatePresence, motion } from 'framer-motion';
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

const STYLES = {
  success: { icon: CircleCheck, color: 'text-cyan-400', bar: 'from-cyan-400 to-purple-500', ring: 'shadow-glow-cyan' },
  info: { icon: Info, color: 'text-purple-400', bar: 'from-purple-400 to-pink-500', ring: 'shadow-glow-purple' },
  error: { icon: CircleAlert, color: 'text-rose-400', bar: 'from-rose-400 to-orange-400', ring: '' },
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useGlobal();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:bottom-6 sm:right-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const s = STYLES[t.type] || STYLES.success;
          const Icon = s.icon;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              className={`glass-strong pointer-events-auto relative overflow-hidden rounded-2xl p-3 pr-10 ${s.ring}`}
            >
              <div className="flex items-center gap-3">
                {t.image ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-white/10">
                    <img src={t.image} alt="" className="h-full w-full object-cover" />
                    <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-gray-950 p-0.5">
                      <Icon className={`h-4 w-4 ${s.color}`} />
                    </span>
                  </div>
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5">
                    <Icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{t.message}</p>
                  {t.description && <p className="truncate text-xs text-gray-400">{t.description}</p>}
                </div>
              </div>
              <button
                onClick={() => dismissToast(t.id)}
                className="absolute right-2 top-2 rounded-lg p-1 text-gray-500 transition hover:bg-white/10 hover:text-white"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
              <motion.div
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: t.duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r ${s.bar}`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
