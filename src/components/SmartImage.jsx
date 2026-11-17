import { useState } from 'react';
import { ImageOff } from 'lucide-react';

/** Image with skeleton loading state and graceful fallback if the remote URL fails. */
export default function SmartImage({ src, alt, className = '', imgClassName = '', ...rest }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-gray-900 ${className}`}>
      {!loaded && !failed && (
        <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,#0f172a_8%,#1e293b_18%,#0f172a_33%)] bg-[length:200%_100%]" />
      )}
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-cyan-500/10 to-purple-600/10 text-gray-500">
          <ImageOff className="h-8 w-8" />
          <span className="text-xs">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
          {...rest}
        />
      )}
    </div>
  );
}
