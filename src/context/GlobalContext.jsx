import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const GlobalContext = createContext(null);

export const TAX_RATE = 0.08;
export const FREE_SHIPPING_THRESHOLD = 500;
export const SHIPPING_FEE = 14.99;
export const PROMO_CODES = { NOVA10: 0.1, NEON20: 0.2 };

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function GlobalProvider({ children }) {
  const [cart, setCart] = useState(() => load('technova-cart', []));
  const [wishlist, setWishlist] = useState(() => load('technova-wishlist', []));
  const [promo, setPromo] = useState(() => load('technova-promo', null));
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);

  useEffect(() => localStorage.setItem('technova-cart', JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem('technova-wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('technova-promo', JSON.stringify(promo)), [promo]);

  /* ---------------- Toasts ---------------- */
  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, { type = 'success', description, image, duration = 3200 } = {}) => {
      const id = ++toastId.current;
      setToasts((prev) => [...prev.slice(-3), { id, message, type, description, image, duration }]);
      setTimeout(() => dismissToast(id), duration);
    },
    [dismissToast]
  );

  /* ---------------- Cart ---------------- */
  const addToCart = useCallback(
    (product, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.id === product.id ? { ...i, qty: Math.min(i.qty + qty, product.stock ?? 99) } : i
          );
        }
        return [
          ...prev,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            category: product.category,
            stock: product.stock,
            qty,
          },
        ];
      });
      showToast('Added to Cart', {
        description: `${qty} × ${product.name}`,
        image: product.images[0],
      });
    },
    [showToast]
  );

  const removeFromCart = useCallback(
    (id) => {
      const item = cart.find((i) => i.id === id);
      if (item) showToast('Removed from Cart', { type: 'info', description: item.name, image: item.image });
      setCart((prev) => prev.filter((i) => i.id !== id));
    },
    [cart, showToast]
  );

  const updateQty = useCallback((id, qty) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock ?? 99)) } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setPromo(null);
  }, []);

  /* ---------------- Promo ---------------- */
  const applyPromo = useCallback(
    (code) => {
      const normalized = code.trim().toUpperCase();
      if (PROMO_CODES[normalized]) {
        setPromo(normalized);
        showToast('Promo code applied', {
          description: `${normalized} — ${PROMO_CODES[normalized] * 100}% off your order`,
        });
        return true;
      }
      showToast('Invalid promo code', { type: 'error', description: 'Try NOVA10 or NEON20' });
      return false;
    },
    [showToast]
  );

  const removePromo = useCallback(() => setPromo(null), []);

  /* ---------------- Wishlist ---------------- */
  const isWishlisted = useCallback((id) => wishlist.some((p) => p.id === id), [wishlist]);

  const toggleWishlist = useCallback(
    (product) => {
      const exists = wishlist.some((p) => p.id === product.id);
      if (exists) {
        setWishlist((prev) => prev.filter((p) => p.id !== product.id));
        showToast('Removed from Wishlist', { type: 'info', description: product.name, image: product.images[0] });
      } else {
        setWishlist((prev) => [...prev, product]);
        showToast('Saved to Wishlist', { description: product.name, image: product.images[0] });
      }
    },
    [wishlist, showToast]
  );

  /* ---------------- Totals ---------------- */
  const totals = useMemo(() => {
    const itemCount = cart.reduce((s, i) => s + i.qty, 0);
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const discount = promo ? subtotal * (PROMO_CODES[promo] || 0) : 0;
    const discounted = subtotal - discount;
    const shipping = subtotal === 0 || discounted >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const tax = discounted * TAX_RATE;
    const total = discounted + tax + shipping;
    const round = (n) => Math.round(n * 100) / 100;
    return {
      itemCount,
      subtotal: round(subtotal),
      discount: round(discount),
      shipping: round(shipping),
      tax: round(tax),
      total: round(total),
      remainingForFreeShipping: Math.max(0, round(FREE_SHIPPING_THRESHOLD - discounted)),
    };
  }, [cart, promo]);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    wishlist,
    toggleWishlist,
    isWishlisted,
    promo,
    applyPromo,
    removePromo,
    totals,
    toasts,
    showToast,
    dismissToast,
  };

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}

export function useGlobal() {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error('useGlobal must be used within a GlobalProvider');
  return ctx;
}
