'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import { EASE_OUT } from './Reveal';

const LINKS = [
  { href: '#munkak', label: 'Munkák' },
  { href: '#filmek', label: 'Filmek' },
  { href: '#rolam', label: 'Rólam' },
  { href: '#kapcsolat', label: 'Kapcsolat' },
];

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // A hero fölött átlátszó; ha a hero kigördült, tömör sötét hátteret kap (világos szekciók fölött is olvasható).
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight - 90);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
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
    <header
      className={`fixed inset-x-0 top-0 z-40 text-offwhite transition-[background-color,border-color] duration-300 ${
        solid && !open ? 'border-b border-line-dark bg-ink/95' : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* finom helyi sötétítés a hero tetején, hogy a menü a világos égen is olvasható legyen */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-[180px] bg-gradient-to-b from-black/45 to-transparent transition-opacity duration-300 ${
          solid ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <div className="container-site flex h-[72px] items-center">
        <a href="#top" aria-label="VIDOR Photo & Film — az oldal eleje" className="relative z-10 mr-auto inline-flex min-h-11 items-center">
          <Logo />
        </a>

        <nav aria-label="Főmenü" className="hidden md:block">
          <ul className="flex gap-[33px] text-[13px]">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a className="link-underline" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="relative z-10 flex min-h-11 items-center gap-2.5 pl-2 text-sm font-semibold md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Bezárás' : 'Menü'}
          <span aria-hidden className="relative block h-2.5 w-5">
            <span className={`absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-200 ${open ? 'top-[4px] rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 h-[1.5px] w-full bg-current transition-transform duration-200 ${open ? 'top-[4px] -rotate-45' : 'top-[8px]'}`} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobil menü"
            className="fixed inset-0 -z-0 bg-ink px-5 pt-[110px] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
          >
            <ul className="border-t border-line-dark">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  className="border-b border-line-dark"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: EASE_OUT, delay: 0.04 * i }}
                >
                  <a href={l.href} onClick={() => setOpen(false)} className="display flex min-h-[72px] items-center text-[40px] leading-none">
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
