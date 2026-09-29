'use client';

import { motion, useSpring } from 'framer-motion';
import { useState } from 'react';
import { GENRE, SERVICE_GENRE, SERVICES } from '@/lib/content';
import { LOOPS } from '@/lib/loops';
import { useSite } from '@/lib/site';
import { useAccent } from './Spill';

/**
 * Szolgáltatások: négy óriásbetűs sor. Rámutatáskor a sor műfajszínnel töltődik ki, és a kurzor mellett
 * kis előnézet lebeg. Az „Ezt kérem →” a kapcsolathoz görget, és előre kiválasztja a műfajt.
 * Mobilon a sorok lenyílók.
 */
export default function Services() {
  const ref = useAccent('portre');
  const { setInquiry, setAccent, moving } = useSite();
  const [hover, setHover] = useState<number | null>(null);
  const [open, setOpen] = useState<number>(0);
  const px = useSpring(0, { stiffness: 350, damping: 35 });
  const py = useSpring(0, { stiffness: 350, damping: 35 });

  const request = (i: number) => {
    const g = GENRE[SERVICE_GENRE[SERVICES[i].title]];
    setInquiry(g.inquiry);
    setAccent(g.key);
    document.getElementById('kapcsolat')?.scrollIntoView({ behavior: moving ? 'smooth' : 'auto' });
    setTimeout(() => document.getElementById('f-name')?.focus({ preventScroll: true }), moving ? 700 : 0);
  };

  const hovered = hover !== null ? GENRE[SERVICE_GENRE[SERVICES[hover].title]] : null;

  return (
    <section ref={ref} id="szolgaltatasok" aria-labelledby="services-title" className="py-20 md:py-28">
      <div className="container-site">
        <header className="mb-8 flex items-end justify-between gap-6 md:mb-12">
          <div>
            <p className="label mb-3 text-mist">Amiben segíthetek</p>
            <h2 id="services-title" className="display max-w-[16ch] text-[clamp(36px,4.4vw,64px)] leading-[0.95]">
              Személyre szabott vizuális megoldások, bármilyen műfajban.
            </h2>
          </div>
          <p className="label hidden text-mist md:block">Fotó és film</p>
        </header>

        <ul
          className="relative border-t border-rule"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            px.set(e.clientX - r.left + 28);
            py.set(e.clientY - r.top - 100);
          }}
          onPointerLeave={() => setHover(null)}
        >
          {SERVICES.map((s, i) => {
            const g = GENRE[SERVICE_GENRE[s.title]];
            const isOpen = open === i;
            return (
              <li
                key={s.title}
                className="group relative overflow-hidden border-b border-rule"
                style={{ ['--gc' as string]: g.color }}
                onMouseEnter={() => {
                  setHover(i);
                  setAccent(g.key);
                }}
              >
                {/* napszínű söprés: balról jobbra töltődik (csak egérnél) */}
                <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-[var(--gc)] transition-transform duration-300 ease-[var(--ease-out)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-x-100" />
                <div className="relative grid items-center gap-x-8 py-5 md:grid-cols-[48px_1fr_minmax(0,300px)_auto] md:py-6 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-night">
                  <span className="label hidden text-mist md:block [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-night/70">0{i + 1}</span>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`svc-${i}`}
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="display flex w-full items-center justify-between gap-4 text-left text-[clamp(30px,5.4vw,80px)] leading-[1] md:pointer-events-none md:cursor-default"
                      tabIndex={undefined}
                    >
                      {s.title}
                      <span aria-hidden className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-rule-strong text-[20px] transition-transform md:hidden ${isOpen ? 'rotate-45' : ''}`}>+</span>
                    </button>
                  </h3>
                  <div id={`svc-${i}`} className={`${isOpen ? 'grid' : 'hidden'} gap-4 pt-4 md:contents`}>
                    {/* mobilon kis állókép a lenyílóban */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={LOOPS[g.loop].poster} alt="" loading="lazy" className="aspect-[16/9] w-full rounded-[6px] object-cover md:hidden" />
                    <p className="text-[15px] leading-relaxed text-mist md:text-[14px] [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-night/80">{s.text}</p>
                    <button
                      type="button"
                      onClick={() => request(i)}
                      className="btn btn-ghost justify-self-start !min-h-11 !text-[14px] [@media(hover:hover)_and_(pointer:fine)]:group-hover:!border-night [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-night [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-cream"
                      aria-label={`Ezt kérem: ${s.title} — ugrás az ajánlatkéréshez`}
                    >
                      Ezt kérem <span aria-hidden>→</span>
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          {hovered && (
            <motion.li
              aria-hidden
              key={hovered.key}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ x: px, y: py }}
              className="pointer-events-none absolute left-0 top-0 z-10 hidden h-[150px] w-[240px] overflow-hidden rounded-[6px] shadow-[0_24px_60px_rgba(0,0,0,.55)] [@media(hover:hover)_and_(pointer:fine)]:block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOOPS[hovered.loop].poster} alt="" className="h-full w-full object-cover" />
              <span className="tag absolute bottom-2 left-2" style={{ ['--dot' as string]: hovered.color }}>{hovered.label}</span>
            </motion.li>
          )}
        </ul>
      </div>
    </section>
  );
}
