'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { GalleryKey } from './content';
import { videoBudget } from './video-budget';

type Accent = GalleryKey | 'film' | null;

type Site = {
  /** a felhasználó a „Mozgás” gombbal megállította */
  paused: boolean;
  togglePaused: () => void;
  /** szabad-e bármi folyamatosan mozogjon (nincs szünet, nincs csökkentett mozgás) */
  moving: boolean;
  /** a háttérfény aktuális műfaja */
  accent: Accent;
  setAccent: (a: Accent) => void;
  /** a kapcsolati űrlap kiválasztott műfaja */
  inquiry: string;
  setInquiry: (v: string) => void;
  gallery: { key: GalleryKey; index: number } | null;
  openGallery: (key: GalleryKey, index?: number) => void;
  closeGallery: () => void;
};

const Ctx = createContext<Site | null>(null);

function saveData() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!c && (c.saveData === true || /(^|-)2g$/.test(c.effectiveType ?? ''));
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  const [paused, setPaused] = useState(false);
  const [lowData, setLowData] = useState(false);
  const [accent, setAccent] = useState<Accent>('eskuvo');
  const [inquiry, setInquiry] = useState('Esküvő');
  const [gallery, setGallery] = useState<Site['gallery']>(null);

  useEffect(() => {
    setLowData(saveData());
    try {
      if (localStorage.getItem('vidor-motion') === 'off') setPaused(true);
    } catch {}
  }, []);

  const moving = !paused && !reduced;
  useEffect(() => {
    videoBudget.setAllowed(moving && !lowData);
  }, [moving, lowData]);

  const togglePaused = useCallback(() => {
    setPaused((p) => {
      try {
        localStorage.setItem('vidor-motion', p ? 'on' : 'off');
      } catch {}
      return !p;
    });
  }, []);
  // a megnyitó elem (a galéria bezárásakor ide tér vissza a fókusz)
  const opener = useRef<HTMLElement | null>(null);
  const openGallery = useCallback((key: GalleryKey, index = -1) => {
    opener.current = document.activeElement as HTMLElement | null;
    setGallery({ key, index });
  }, []);
  const closeGallery = useCallback(() => {
    setGallery(null);
    opener.current?.focus({ preventScroll: true });
  }, []);

  const value = useMemo(
    () => ({ paused, togglePaused, moving, accent, setAccent, inquiry, setInquiry, gallery, openGallery, closeGallery }),
    [paused, togglePaused, moving, accent, inquiry, gallery, openGallery, closeGallery],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSite() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useSite: hiányzó SiteProvider');
  return s;
}
