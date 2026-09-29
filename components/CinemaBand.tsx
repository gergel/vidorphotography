'use client';

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import LoopVideo from './LoopVideo';
import { QUOTE } from '@/lib/content';
import { useAccent } from './Spill';

function Word({ w, i, n, p }: { w: string; i: number; n: number; p: MotionValue<number> }) {
  const start = 0.3 + (i / n) * 0.55;
  const step = 0.55 / n;
  // függvényes leképezés: JS-ben számol (a natív scroll-timeline gyorsítás itt pontatlan a sticky sáv miatt)
  const opacity = useTransform(p, (v) => 0.22 + 0.78 * Math.min(1, Math.max(0, (v - start) / step)));
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {w}&nbsp;
    </motion.span>
  );
}

/**
 * Mozisáv: görgetésre egy kártya széltől szélig érő, 21:9-es mozivászonná nyílik (≈1,5 képernyőnyi
 * görgetés, nincs hosszú beragadás). Alatta, a fekete sávon, az idézet szavanként kivilágosodik.
 */
export default function CinemaBand() {
  const reduced = useReducedMotion();
  const accentRef = useAccent('film');
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const inset = useTransform(scrollYProgress, [0, 0.45], [12, 0]);
  const insetY = useTransform(scrollYProgress, [0, 0.45], [9, 0]);
  const radius = useTransform(scrollYProgress, [0, 0.45], [10, 0]);
  const clipPath = useTransform([inset, insetY, radius], ([x, y, r]) => `inset(${y}% ${x}% ${y}% ${x}% round ${r}px)`);
  const words = QUOTE.split(' ');

  if (reduced) {
    return (
      <section ref={accentRef} aria-label="Idézet" className="py-16">
        <div className="relative aspect-[21/9] max-h-[70svh] w-full">
          <LoopVideo loop="mozisav" sizes="100vw" />
        </div>
        <blockquote className="container-site bg-night py-10 text-center">
          <p className="display mx-auto max-w-[22ch] text-[clamp(30px,4.2vw,64px)] leading-[1.05]">„{QUOTE}”</p>
        </blockquote>
      </section>
    );
  }

  return (
    <section ref={accentRef} aria-label="Idézet">
      <div ref={ref} className="relative h-[190svh]">
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-[76px]">
          <motion.div style={{ clipPath }} className="relative aspect-[21/9] max-h-[58svh] w-full bg-black">
            <LoopVideo loop="mozisav" priority={3} sizes="100vw" />
            <span className="tag absolute bottom-4 left-4" style={{ ['--dot' as string]: 'var(--color-cream)' }}>Film · 00:12</span>
          </motion.div>
          <blockquote className="bg-night px-5 py-8 text-center md:py-10">
            <p className="display mx-auto max-w-[24ch] text-[clamp(28px,4vw,60px)] leading-[1.06]">
              <span className="sr-only">„{QUOTE}”</span>
              <span aria-hidden>
                „
                {words.map((w, i) => (
                  <Word key={i} w={i === words.length - 1 ? `${w}”` : w} i={i} n={words.length} p={scrollYProgress} />
                ))}
              </span>
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
