'use client';

import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useRef, useState } from 'react';
import { GENRES, type Genre } from '@/lib/content';
import { LOOPS } from '@/lib/loops';
import { useSite } from '@/lib/site';

/**
 * Műfaj-szalag: óriási, lassan úszó felirat. Görgetéskor a görgetés irányába gyorsul (plafonnal),
 * majd visszalassul. Minden szó valódi gomb a galériához; rámutatáskor kis előnézet követi a kurzort.
 */
export default function GenreMarquee() {
  const { moving, openGallery, setAccent } = useSite();
  const x = useMotionValue(0);
  const track = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const factor = useTransform(vel, [-2500, 0, 2500], [-5, 0, 5], { clamp: true });
  const dir = useRef(-1);
  const [hover, setHover] = useState<Genre | null>(null);
  const px = useSpring(0, { stiffness: 400, damping: 40 });
  const py = useSpring(0, { stiffness: 400, damping: 40 });

  useAnimationFrame((_, delta) => {
    if (!moving || !track.current || track.current.contains(document.activeElement)) return;
    const f = factor.get();
    if (f < -0.05) dir.current = 1;
    else if (f > 0.05) dir.current = -1;
    const half = track.current.scrollWidth / 2;
    let next = x.get() + dir.current * (40 + Math.abs(f) * 90) * (delta / 1000);
    if (next <= -half) next += half;
    if (next > 0) next -= half;
    x.set(next);
  });

  const words = (copy: number) =>
    GENRES.map((g) => (
      <li key={`${copy}-${g.key}`} className="flex items-center" aria-hidden={copy > 0 || undefined}>
        <button
          type="button"
          tabIndex={copy > 0 ? -1 : 0}
          onClick={() => openGallery(g.key)}
          onMouseEnter={() => {
            setHover(g);
            setAccent(g.key);
          }}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setAccent(g.key)}
          className="display whitespace-nowrap px-[0.18em] text-[clamp(64px,10vw,150px)] uppercase leading-[1.05] tracking-[-0.035em] text-cream transition-colors duration-300 hover:text-[var(--gc)] focus-visible:text-[var(--gc)]"
          style={{ ['--gc' as string]: g.color }}
        >
          {g.label}
          <span className="sr-only"> galéria</span>
        </button>
        <span aria-hidden className="mx-[0.2em] inline-block h-[0.14em] w-[0.14em] rounded-full text-[clamp(64px,10vw,150px)]" style={{ background: g.color }} />
      </li>
    ));

  return (
    <section
      aria-label="Műfajok"
      className="relative overflow-hidden border-y border-rule py-6 md:py-8"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(e.clientX - r.left + 24);
        py.set(e.clientY - r.top - 90);
      }}
    >
      <motion.div ref={track} style={{ x }} className="flex w-max">
        <ul className="flex">{words(0)}</ul>
        <ul className="flex">{words(1)}</ul>
      </motion.div>
      {hover && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-10 hidden h-[130px] w-[210px] overflow-hidden rounded-[6px] shadow-[0_20px_50px_rgba(0,0,0,.5)] [@media(hover:hover)]:block"
          style={{ x: px, y: py, outline: `2px solid ${hover.color}` }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOOPS[hover.loop].poster} alt="" className="h-full w-full object-cover" />
          <span className="live absolute right-2 top-2">{hover.label.toUpperCase()}</span>
        </motion.div>
      )}
    </section>
  );
}
