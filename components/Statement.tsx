'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { VIDEOS } from '@/lib/content';
import { photo } from '@/lib/images';
import { EASE_OUT } from './Reveal';

const STILL = photo('/images/koncert.jpg');

export default function Statement() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // Parallax: a háttér lassabban mozog, mint az oldal (±12%).
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-12%', '12%']);
  // A videó csak akkor töltődik be, ha a szekció a közelbe ér.
  const near = useInView(ref, { once: true, margin: '600px 0px' });

  return (
    <section ref={ref} aria-label="Idézet" className="relative grid h-[520px] place-items-center overflow-hidden bg-[#1b1b1a] text-offwhite md:h-[clamp(420px,52.8vw,760px)]">
      <motion.div aria-hidden className="absolute inset-x-0 -inset-y-[14%]" style={{ y }}>
        <Image {...STILL} alt="" sizes="100vw" className="is-bw h-full w-full object-cover object-[50%_42%]" />
        {VIDEOS.statement && near && !reduce && (
          <video className="absolute inset-0 h-full w-full object-cover" src={VIDEOS.statement} autoPlay muted loop playsInline preload="none" />
        )}
      </motion.div>
      <div aria-hidden className="absolute inset-0 bg-black/[.48]" />
      <blockquote className="container-site relative max-w-[calc(1000px+2*clamp(20px,5vw,72px))] text-center">
        <motion.p
          className="display text-[clamp(34px,4.45vw,64px)] leading-[1.08]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 1, ease: EASE_OUT }}
        >
          „Nem csupán azt keresem, ami történik. <span className="md:block">Azt keresem, ami megmarad belőle.”</span>
        </motion.p>
      </blockquote>
    </section>
  );
}
