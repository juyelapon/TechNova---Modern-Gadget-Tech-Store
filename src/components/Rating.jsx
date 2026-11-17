import { Star } from 'lucide-react';

export default function Rating({ value, size = 'h-4 w-4', showValue = false, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex" aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, value - (i - 1)));
          return (
            <span key={i} className={`relative ${size}`}>
              <Star className={`absolute inset-0 ${size} text-gray-700`} fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={`${size} text-amber-400`} fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </div>
      {showValue && <span className="text-sm font-semibold text-gray-200">{value.toFixed(1)}</span>}
      {count !== undefined && <span className="text-xs text-gray-500">({count.toLocaleString()})</span>}
    </div>
  );
}
