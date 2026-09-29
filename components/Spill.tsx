'use client';

import { useEffect, useRef } from 'react';
import { GENRES, type GalleryKey } from '@/lib/content';
import { useSite } from '@/lib/site';

const COLORS: Record<string, string> = {
  ...Object.fromEntries(GENRES.map((g) => [g.key, g.color])),
  film: 'var(--color-cream)',
};

/**
 * „Fényszivárgás”: fix, puha színfolt a tartalom mögött, a képernyőn lévő szekció (vagy a rámutatott
 * csempe) műfajszínében. Rétegenként áttűnik (opacity), így olcsó és akadásmentes.
 */
export default function Spill() {
  const { accent } = useSite();
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {Object.entries(COLORS).map(([k, c]) => (
        <div
          key={k}
          className="absolute inset-0 transition-opacity duration-[900ms] ease-[var(--ease-out)]"
          style={{
            opacity: accent === k ? 1 : 0,
            background: `radial-gradient(60vmax 50vmax at 12% 8%, color-mix(in oklab, ${c} 22%, transparent), transparent 70%), radial-gradient(50vmax 45vmax at 95% 90%, color-mix(in oklab, ${c} 14%, transparent), transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}

/** A szekció beállítja a háttérfény színét, amikor a képernyő közepére ér. */
export function useAccent(key: GalleryKey | 'film' | null) {
  const { setAccent } = useSite();
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !key) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setAccent(key), { rootMargin: '-45% 0px -45% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [key, setAccent]);
  return ref;
}
