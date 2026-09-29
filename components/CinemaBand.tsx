'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import LoopVideo from './LoopVideo';
import { QUOTE } from '@/lib/content';
import ScrollWords from './ScrollWords';

/**
 * Mozisáv: görgetésre egy kártya széltől szélig érő, 21:9-es mozivászonná nyílik (≈1,5 képernyőnyi
 * görgetés, nincs hosszú beragadás). Alatta, a fekete sávon, az idézet szavanként kivilágosodik.
 */
export default function CinemaBand() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const inset = useTransform(scrollYProgress, [0, 0.45], [12, 0]);
  const insetY = useTransform(scrollYProgress, [0, 0.45], [9, 0]);
  const radius = useTransform(scrollYProgress, [0, 0.45], [18, 0]);
  const clipPath = useTransform([inset, insetY, radius], ([x, y, r]) => `inset(${y}% ${x}% ${y}% ${x}% round ${r}px)`);
  const quoteP = useTransform(scrollYProgress, (v) => Math.min(1, Math.max(0, (v - 0.35) / 0.55)));

  if (reduced) {
    return (
      <section aria-label="Idézet" className="py-16">
        <div className="relative aspect-[21/9] max-h-[70svh] w-full">
          <LoopVideo loop="mozisav" sizes="100vw" />
        </div>
        <blockquote className="container-site bg-night py-10 text-center">
          <p className="display mx-auto max-w-[24ch] text-[clamp(28px,3.6vw,56px)] leading-[1.1]">„{QUOTE}”</p>
        </blockquote>
      </section>
    );
  }

  return (
    <section aria-label="Idézet">
      <div ref={ref} className="relative h-[190svh]">
        <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden pt-[76px]">
          <motion.div style={{ clipPath }} className="relative aspect-[21/9] max-h-[58svh] w-full bg-black">
            <LoopVideo loop="mozisav" priority={3} sizes="100vw" />
          </motion.div>
          <blockquote className="bg-night px-5 py-8 text-center md:py-10">
            <ScrollWords progress={quoteP} text={`„${QUOTE}”`} className="display mx-auto max-w-[24ch] text-[clamp(28px,3.6vw,56px)] leading-[1.1]" />
          </blockquote>
        </div>
      </div>
    </section>
  );
}
