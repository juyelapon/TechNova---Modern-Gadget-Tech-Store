import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, CircleCheck, CreditCard, Loader2, Lock, MapPin, ShieldCheck, Tag, Wifi } from 'lucide-react';
import { useGlobal, TAX_RATE } from '../context/GlobalContext';
import { formatPrice } from '../data/products';
import SmartImage from '../components/SmartImage';

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan', 'India'];

const detectBrand = (num) => {
  const n = num.replace(/\s/g, '');
  if (/^4/.test(n)) return 'VISA';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'MASTERCARD';
  if (/^3[47]/.test(n)) return 'AMEX';
  if (/^6(011|5)/.test(n)) return 'DISCOVER';
  return null;
};

const formatCard = (v) =>
  v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const luhn = (num) => {
  const digits = num.replace(/\D/g, '');
  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let d = Number(digits[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return digits.length >= 13 && sum % 10 === 0;
};

const INITIAL = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  apartment: '',
  city: '',
  state: '',
  zip: '',
  country: 'United States',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
};

function validate(f) {
  const e = {};
  if (!f.firstName.trim()) e.firstName = 'First name is required';
  if (!f.lastName.trim()) e.lastName = 'Last name is required';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email';
  if (f.phone && !/^[+\d\s()-]{7,}$/.test(f.phone)) e.phone = 'Enter a valid phone number';
  if (!f.address.trim()) e.address = 'Address is required';
  if (!f.city.trim()) e.city = 'City is required';
  if (!f.state.trim()) e.state = 'Required';
  if (!/^[A-Za-z0-9\s-]{3,10}$/.test(f.zip)) e.zip = 'Invalid ZIP';
  if (!f.cardName.trim()) e.cardName = 'Name on card is required';
  if (!luhn(f.cardNumber)) e.cardNumber = 'Enter a valid card number';
  const m = f.expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!m) e.expiry = 'Use MM/YY';
  else {
    const month = Number(m[1]);
    const year = 2000 + Number(m[2]);
    const now = new Date();
    if (month < 1 || month > 12) e.expiry = 'Invalid month';
    else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) e.expiry = 'Card expired';
  }
  if (!/^\d{3,4}$/.test(f.cvv)) e.cvv = '3–4 digits';
  return e;
}

function Field({ label, error, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-gray-400">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1 block text-xs text-rose-400"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

function CreditCardPreview({ name, number, expiry, cvv, flipped }) {
  const brand = detectBrand(number);
  const masked = (number || '')
    .replace(/\D/g, '')
    .padEnd(16, '•')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim();

  return (
    <div className="perspective mx-auto w-full max-w-sm">
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 80, damping: 15 }}
        className="preserve-3d relative aspect-[1.586] w-full"
      >
        {/* Front */}
        <div className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-700 p-5 shadow-glow-purple sm:p-6">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="h-9 w-12 rounded-md bg-gradient-to-br from-amber-200 to-amber-500 shadow-inner">
                <div className="grid h-full grid-cols-3 gap-px p-1 opacity-60">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i} className="rounded-sm border border-amber-700/40" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 rotate-90 text-white/80" />
                <span className="font-display text-lg font-bold italic tracking-wider text-white">{brand || 'NOVA'}</span>
              </div>
            </div>
            <p className="font-mono text-lg tracking-[0.15em] text-white drop-shadow sm:text-xl">{masked}</p>
            <div className="flex items-end justify-between gap-4 text-white">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-white/60">Card Holder</p>
                <p className="truncate font-medium uppercase tracking-wide">{name || 'Your Name'}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] uppercase tracking-widest text-white/60">Expires</p>
                <p className="font-mono font-medium">{expiry || 'MM/YY'}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Back */}
        <div
          className="backface-hidden absolute inset-0 overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-purple-700 via-indigo-700 to-cyan-600 shadow-glow-cyan"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="mt-6 h-11 w-full bg-gray-950/90" />
          <div className="mx-5 mt-5 flex items-center gap-3">
            <div className="h-9 flex-1 rounded bg-[repeating-linear-gradient(45deg,#e5e7eb,#e5e7eb_6px,#d1d5db_6px,#d1d5db_12px)]" />
            <div className="flex h-9 w-16 items-center justify-center rounded bg-white font-mono font-bold italic text-gray-900">
              {cvv || '•••'}
            </div>
          </div>
          <p className="mx-5 mt-4 text-[10px] leading-snug text-white/60">
            This card is property of TechNova Bank. Authorized signature required. Not valid unless signed.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function Checkout() {
  const { cart, totals, promo, clearCart } = useGlobal();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [flipped, setFlipped] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | processing | success
  const [order, setOrder] = useState(null);

  const set = (key, formatter) => (e) => {
    const value = formatter ? formatter(e.target.value) : e.target.value;
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (touched[key]) setErrors(validate(next));
      return next;
    });
  };
  const blur = (key) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validate(form));
  };
  const err = (key) => (touched[key] ? errors[key] : undefined);
  const inputCls = (key) => `input-field ${err(key) ? 'border-rose-500/60 focus:border-rose-500/70 focus:ring-rose-500/20' : ''}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    setTouched(Object.keys(INITIAL).reduce((a, k) => ({ ...a, [k]: true }), {}));
    if (Object.keys(v).length) {
      const first = document.querySelector(`[name="${Object.keys(v)[0]}"]`);
      first?.focus();
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setStatus('processing');
    setTimeout(() => {
      setOrder({
        id: `TN-${Date.now().toString(36).toUpperCase()}`,
        total: totals.total,
        items: totals.itemCount,
        email: form.email,
        last4: form.cardNumber.replace(/\s/g, '').slice(-4),
      });
      clearCart();
      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  if (status === 'success' && order) {
    return (
      <div className="container-x py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="glass mx-auto max-w-lg rounded-3xl p-8 text-center sm:p-12"
        >
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 shadow-glow-cyan"
          >
            <CircleCheck className="h-12 w-12 text-white" />
          </motion.div>
          <h1 className="mt-8 font-display text-3xl font-bold">Order Confirmed!</h1>
          <p className="mt-3 text-gray-400">
            Thank you for shopping with TechNova. A confirmation has been sent to{' '}
            <span className="text-white">{order.email}</span>.
          </p>
          <dl className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left text-sm">
            <div className="flex justify-between"><dt className="text-gray-400">Order number</dt><dd className="font-mono font-semibold text-cyan-300">{order.id}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Items</dt><dd>{order.items}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Paid with</dt><dd>•••• {order.last4}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Total charged</dt><dd className="font-bold text-white">{formatPrice(order.total)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-400">Estimated delivery</dt><dd>{new Date(Date.now() + 3 * 864e5).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</dd></div>
          </dl>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/shop" className="btn-primary flex-1">Continue Shopping</Link>
            <Link to="/" className="btn-ghost flex-1">Back Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container-x py-20">
        <div className="glass mx-auto max-w-md rounded-3xl p-10 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-gray-600" />
          <h1 className="mt-6 font-display text-2xl font-bold">Nothing to check out</h1>
          <p className="mt-2 text-gray-400">Your cart is empty. Add some gear before checking out.</p>
          <Link to="/shop" className="btn-primary mt-8">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-10 lg:py-14">
      <button onClick={() => navigate('/cart')} className="mb-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-300">
        <ArrowLeft className="h-4 w-4" /> Back to cart
      </button>
      <h1 className="font-display text-4xl font-bold">
        Secure <span className="text-gradient">Checkout</span>
      </h1>

      {/* Steps */}
      <ol className="mt-6 flex items-center gap-3 text-xs font-medium sm:text-sm">
        {['Cart', 'Details & Payment', 'Confirmation'].map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                i <= 1 ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-glow-sm' : 'border border-white/15 text-gray-500'
              }`}
            >
              {i + 1}
            </span>
            <span className={i <= 1 ? 'text-gray-200' : 'text-gray-500'}>{s}</span>
            {i < 2 && <span className="h-px w-6 bg-white/15 sm:w-12" />}
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit} noValidate className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Left column */}
        <div className="space-y-8">
          <section className="glass rounded-2xl p-6 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-xl font-bold">
              <MapPin className="h-5 w-5 text-cyan-300" /> Shipping Information
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="First name *" error={err('firstName')}>
                <input name="firstName" autoComplete="given-name" className={inputCls('firstName')} value={form.firstName} onChange={set('firstName')} onBlur={blur('firstName')} />
              </Field>
              <Field label="Last name *" error={err('lastName')}>
                <input name="lastName" autoComplete="family-name" className={inputCls('lastName')} value={form.lastName} onChange={set('lastName')} onBlur={blur('lastName')} />
              </Field>
              <Field label="Email *" error={err('email')}>
                <input name="email" type="email" autoComplete="email" className={inputCls('email')} value={form.email} onChange={set('email')} onBlur={blur('email')} placeholder="you@example.com" />
              </Field>
              <Field label="Phone" error={err('phone')}>
                <input name="phone" type="tel" autoComplete="tel" className={inputCls('phone')} value={form.phone} onChange={set('phone')} onBlur={blur('phone')} placeholder="+1 555 000 0000" />
              </Field>
              <Field label="Street address *" error={err('address')} className="sm:col-span-2">
                <input name="address" autoComplete="street-address" className={inputCls('address')} value={form.address} onChange={set('address')} onBlur={blur('address')} />
              </Field>
              <Field label="Apartment, suite, etc." className="sm:col-span-2">
                <input name="apartment" className="input-field" value={form.apartment} onChange={set('apartment')} />
              </Field>
              <Field label="City *" error={err('city')}>
                <input name="city" autoComplete="address-level2" className={inputCls('city')} value={form.city} onChange={set('city')} onBlur={blur('city')} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="State *" error={err('state')}>
                  <input name="state" autoComplete="address-level1" className={inputCls('state')} value={form.state} onChange={set('state')} onBlur={blur('state')} />
                </Field>
                <Field label="ZIP *" error={err('zip')}>
                  <input name="zip" autoComplete="postal-code" className={inputCls('zip')} value={form.zip} onChange={set('zip')} onBlur={blur('zip')} />
                </Field>
              </div>
              <Field label="Country" className="sm:col-span-2">
                <select name="country" className="input-field" value={form.country} onChange={set('country')}>
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
          </section>

          <section className="glass rounded-2xl p-6 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-xl font-bold">
              <CreditCard className="h-5 w-5 text-purple-400" /> Payment Details
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
              <Lock className="h-3 w-3" /> Demo only — try test card 4242 4242 4242 4242
            </p>

            <div className="mt-8 grid items-center gap-8 xl:grid-cols-2">
              <CreditCardPreview
                name={form.cardName}
                number={form.cardNumber}
                expiry={form.expiry}
                cvv={form.cvv}
                flipped={flipped}
              />
              <div className="grid gap-4">
                <Field label="Name on card *" error={err('cardName')}>
                  <input name="cardName" autoComplete="cc-name" className={inputCls('cardName')} value={form.cardName} onChange={set('cardName')} onBlur={blur('cardName')} onFocus={() => setFlipped(false)} />
                </Field>
                <Field label="Card number *" error={err('cardNumber')}>
                  <div className="relative">
                    <input
                      name="cardNumber"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 5678 9012 3456"
                      className={`${inputCls('cardNumber')} pr-24 font-mono tracking-wider`}
                      value={form.cardNumber}
                      onChange={set('cardNumber', formatCard)}
                      onBlur={blur('cardNumber')}
                      onFocus={() => setFlipped(false)}
                    />
                    {detectBrand(form.cardNumber) && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-white/10 px-2 py-1 text-[10px] font-bold tracking-wider text-cyan-300">
                        {detectBrand(form.cardNumber)}
                      </span>
                    )}
                  </div>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expiry *" error={err('expiry')}>
                    <input name="expiry" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" className={`${inputCls('expiry')} font-mono`} value={form.expiry} onChange={set('expiry', formatExpiry)} onBlur={blur('expiry')} onFocus={() => setFlipped(false)} />
                  </Field>
                  <Field label="CVV *" error={err('cvv')}>
                    <input
                      name="cvv"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="123"
                      className={`${inputCls('cvv')} font-mono`}
                      value={form.cvv}
                      onChange={set('cvv', (v) => v.replace(/\D/g, '').slice(0, 4))}
                      onFocus={() => setFlipped(true)}
                      onBlur={(e) => {
                        setFlipped(false);
                        blur('cvv')(e);
                      }}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right column — order summary */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl font-bold">Order Summary</h2>
            <ul className="mt-6 max-h-80 space-y-4 overflow-y-auto pr-1">
              {cart.map((item) => (
                <li key={item.id} className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <SmartImage src={item.image} alt={item.name} className="h-16 w-16 rounded-xl border border-white/10" />
                    <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 px-1 text-xs font-bold text-white">
                      {item.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium text-white">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</p>
                </li>
              ))}
            </ul>

            <div className="my-6 h-px bg-white/10" />

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-400">Subtotal</dt>
                <dd>{formatPrice(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-emerald-300">
                  <dt className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> {promo}</dt>
                  <dd>−{formatPrice(totals.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-400">Shipping</dt>
                <dd>{totals.shipping === 0 ? <span className="text-emerald-300">Free</span> : formatPrice(totals.shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Tax ({(TAX_RATE * 100).toFixed(0)}%)</dt>
                <dd>{formatPrice(totals.tax)}</dd>
              </div>
              <div className="flex items-end justify-between border-t border-white/10 pt-4">
                <dt className="font-semibold">Total</dt>
                <dd className="font-display text-3xl font-bold text-gradient">{formatPrice(totals.total)}</dd>
              </div>
            </dl>

            <button type="submit" disabled={status === 'processing'} className="btn-primary mt-6 w-full py-4 text-base">
              {status === 'processing' ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Processing payment…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Pay {formatPrice(totals.total)}
                </>
              )}
            </button>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Payments are encrypted and secure
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
