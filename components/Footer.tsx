'use client';

import LoopVideo from './LoopVideo';
import { CONTACT } from '@/lib/content';

/** Lábléc: óriási „VIDOR” felirat, a betűiben loop fut (a sötét réteg multiply keverése csak a betűket hagyja át). */
export default function Footer() {
  const info = 'font-mono text-[11px] uppercase tracking-[0.14em] text-mist';
  return (
    <footer className="px-3 pb-6 md:px-5">
      <div className="relative mx-auto max-w-[1560px] overflow-hidden rounded-[10px] border border-rule">
        <div className="relative isolate">
          <LoopVideo loop="lablec" priority={0} sizes="100vw" />
          <p aria-hidden className="relative bg-night text-center font-display text-[clamp(96px,27vw,420px)] font-extrabold leading-[0.82] tracking-[-0.05em] text-white mix-blend-multiply select-none pt-[0.06em]">
            VIDOR
          </p>
          <span className="live absolute right-3 top-3">LOOP</span>
        </div>
        <div className="flex flex-col gap-6 bg-night px-5 py-6 md:flex-row md:items-end md:justify-between md:px-8">
          <div className="grid gap-5 sm:grid-cols-3 sm:gap-10">
            <div>
              <p className={info}>E-mail</p>
              <a className="inline-flex min-h-11 items-center text-[15px] hover:text-sun" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </div>
            <div>
              <p className={info}>Telefon</p>
              <a className="inline-flex min-h-11 items-center text-[15px] hover:text-sun" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
            </div>
            <div>
              <p className={info}>Instagram</p>
              <a className="inline-flex min-h-11 items-center text-[15px] hover:text-sun" href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">@vidorphotography1<span className="sr-only"> (új lapon nyílik meg)</span></a>
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <a href="#top" className="btn btn-ghost !min-h-11 !text-[14px]">Vissza a tetejére <span aria-hidden>↑</span></a>
            <p className={info}>© 2026 VIDOR Photo &amp; Film · Budapest</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
