'use client';

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';

// szürke (#6E6E73) → fehér (#F5F5F7)
const mix = (t: number) => {
  const c = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `rgb(${c(110, 245)}, ${c(110, 245)}, ${c(115, 247)})`;
};

function Word({ w, i, n, p }: { w: string; i: number; n: number; p: MotionValue<number> }) {
  const start = i / n;
  const color = useTransform(p, (v) => mix(Math.min(1, Math.max(0, (v - start) * n * 0.8))));
  return <motion.span style={{ color }}>{w} </motion.span>;
}

/**
 * Görgetésre szavanként kivilágosodó szöveg (szürkéből fehérbe).
 * `progress` megadásával külső görgetési folyamathoz köthető; enélkül a saját helyzetét követi.
 */
export default function ScrollWords({ text, progress, className = '', as: Tag = 'p' }: { text: string; progress?: MotionValue<number>; className?: string; as?: 'p' | 'h2' }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 40%'] });
  const p = progress ?? scrollYProgress;
  const words = text.split(' ');
  if (reduced) return <Tag className={className}>{text}</Tag>;
  return (
    <Tag ref={ref as never} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Word key={i} w={w} i={i} n={words.length} p={p} />
        ))}
      </span>
    </Tag>
  );
}
