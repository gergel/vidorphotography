'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSite } from '@/lib/site';

const LINKS = [
  { href: '#munkak', label: 'Munkák' },
  { href: '#filmek', label: 'Filmek' },
  { href: '#szolgaltatasok', label: 'Szolgáltatások' },
  { href: '#rolam', label: 'Rólam' },
];
const EASE = [0.23, 1, 0.32, 1] as const;

export function Logo() {
  return (
    <span className="flex items-baseline gap-2.5">
      <b className="text-[19px] font-semibold leading-none tracking-[-0.02em]">VIDOR</b>
      <span className="text-[12px] font-medium tracking-[0.02em] text-mist">Photo &amp; Film</span>
    </span>
  );
}

export function PauseButton({ className = '' }: { className?: string }) {
  const { paused, togglePaused, moving } = useSite();
  return (
    <button
      type="button"
      onClick={togglePaused}
      aria-pressed={paused}
      aria-label={paused ? 'Mozgás indítása' : 'Mozgás szüneteltetése'}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-[12px] font-medium text-mist transition-colors hover:text-cream ${className}`}
    >
      {moving ? (
        <span aria-hidden className="inline-block h-[10px] w-[8px] border-x-[2.5px] border-current" />
      ) : (
        <span aria-hidden className="inline-block h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-current" />
      )}
      <span className="max-sm:sr-only">Mozgás</span>
    </button>
  );
}

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('lock', open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-300 ${solid && !open ? 'bg-night/72 backdrop-blur-xl backdrop-saturate-150' : ''}`}>
      <div className="mx-auto flex h-[60px] max-w-[1200px] items-center gap-6 px-5">
        <a href="#top" aria-label="VIDOR Photo & Film — az oldal eleje" className="relative z-10 mr-auto inline-flex min-h-11 items-center">
          <Logo />
        </a>
        <nav aria-label="Fő navigáció" className="hidden lg:block">
          <ul className="flex gap-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-11 items-center px-3 text-[13px] text-cream/80 transition-colors hover:text-cream">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="relative z-10 flex items-center gap-2">
          <PauseButton />
          <a href="#kapcsolat" className="btn btn-cream hidden !min-h-8 !px-4 !text-[13px] sm:inline-flex">
            Ajánlatkérés <span aria-hidden>→</span>
          </a>
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Menü bezárása' : 'Menü megnyitása'}
            onClick={() => setOpen((o) => !o)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cream lg:hidden"
          >
            <span aria-hidden className="relative block h-3 w-4">
              <span className={`absolute left-0 h-0.5 w-4 bg-current transition-transform duration-200 ${open ? 'top-[5px] rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 top-[5px] h-0.5 w-4 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute left-0 h-0.5 w-4 bg-current transition-transform duration-200 ${open ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobil navigáció"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-0 top-0 -z-0 flex flex-col bg-night px-6 pb-10 pt-[84px] lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {[...LINKS, { href: '#kapcsolat', label: 'Kapcsolat' }].map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE, delay: 0.04 * i }}>
                  <a href={l.href} onClick={() => setOpen(false)} className="display block py-2 text-[34px] leading-[1.1]">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a href="#kapcsolat" onClick={() => setOpen(false)} className="btn btn-cream mt-auto w-full">
              Ajánlatkérés <span aria-hidden>→</span>
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
