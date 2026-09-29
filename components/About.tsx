'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import LoopVideo from './LoopVideo';
import { APPROACH } from '@/lib/content';
import { photo } from '@/lib/images';

/**
 * Rólam: a portré-loop görgetésre finoman „beáll” (nagyításból a helyére).
 * Szemlélet: rögzített jelenet; lefelé görgetve a három lépés egymás után vált, a kép áttűnik.
 */
export default function About() {
  const reduced = useReducedMotion();
  const pic = useRef<HTMLDivElement>(null);
  const { scrollYProgress: pp } = useScroll({ target: pic, offset: ['start end', 'end start'] });
  const scale = useTransform(pp, (v) => (reduced ? 1 : 1.18 - 0.18 * Math.min(1, v * 1.6)));

  const steps = useRef<HTMLDivElement>(null);
  const { scrollYProgress: sp } = useScroll({ target: steps, offset: ['start start', 'end end'] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(sp, 'change', (v) => setActive(Math.min(2, Math.floor(v * 3))));
  const bar = useTransform(sp, (v) => `${Math.min(100, v * 100)}%`);

  return (
    <section id="rolam" aria-labelledby="about-title">
      <div className="container-site grid items-center gap-10 py-24 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-20 md:py-32">
        <div ref={pic} className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-night-2">
          <motion.div style={{ scale }} className="absolute inset-0">
            <LoopVideo loop="rolam" priority={2} position="50% 40%" sizes="(min-width:768px) 42vw, 100vw" />
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-15%' }} transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}>
          <p className="label mb-2">Rólam</p>
          <h2 id="about-title" className="display text-[clamp(40px,5.2vw,80px)] leading-[1.02]">Vidor Gergely, fotós és operatőr.</h2>
          <p className="mt-6 max-w-[54ch] text-[19px] leading-[1.6] text-mist">
            Budapesten élek és dolgozom. 2015 óta fotózom és filmezek — portrékat, eseményeket, márkákat, ételeket,
            koncerteket és történeteket. Nem számít a műfaj: a képeimben mindig az őszinteség és a személyes látásmód a közös.
          </p>
          <p className="mt-6 text-[15px] font-semibold text-cream">Budapest · 2015 óta</p>
        </motion.div>
      </div>

      {/* Szemlélet: rögzített, görgetésre váltó lépések */}
      <div ref={steps} className={reduced ? '' : 'relative h-[260svh]'}>
        <div className={reduced ? 'container-site py-20' : 'sticky top-0 flex h-svh items-center'}>
          <div className="container-site grid items-center gap-10 md:grid-cols-2 md:gap-20">
            <div>
              <p className="label mb-2">Szemlélet</p>
              <h2 className="display text-[clamp(36px,4.4vw,68px)] leading-[1.04]">{APPROACH.title}</h2>
              <ol className="mt-10 space-y-6">
                {APPROACH.steps.map((s, i) => (
                  <li key={s.n} className={`transition-opacity duration-500 ${reduced || active === i ? 'opacity-100' : 'opacity-30'}`} aria-current={active === i ? 'step' : undefined}>
                    <p className="text-[15px] font-semibold text-mist">
                      {s.n} · {s.title}
                    </p>
                    <p className="mt-1 text-[clamp(20px,1.8vw,26px)] font-semibold leading-snug tracking-[-0.01em]">{s.text}</p>
                  </li>
                ))}
              </ol>
              {!reduced && (
                <div aria-hidden className="mt-10 h-[3px] w-40 overflow-hidden rounded-full bg-rule">
                  <motion.div style={{ width: bar }} className="h-full bg-cream" />
                </div>
              )}
            </div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-night-2 max-md:hidden">
              <AnimatePresence initial={false}>
                <motion.div key={active} initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }} className="absolute inset-0">
                  <Image src={photo(APPROACH.steps[active].image, 1600).src} alt="" fill sizes="45vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
