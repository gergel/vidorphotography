'use client';

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import LoopVideo from './LoopVideo';
import { GENRE, type GalleryKey, type LoopId } from '@/lib/content';
import { useSite } from '@/lib/site';
import { useAccent } from './Spill';

const EASE = [0.23, 1, 0.32, 1] as const;

type TileDef = {
  id: string;
  area: string;
  gallery?: GalleryKey;
  loop?: LoopId;
  label: string;
  time?: string;
  /** térhatás: px elmozdulás a kurzor felé/elől */
  depth: number;
  priority: number;
  position?: string;
  mobile?: string;
  sizes: string;
  image?: string;
  films?: boolean;
};

// Asztali rács (12 oszlop × 6 sor): px-pontosan a design terv 04. oldala szerint.
const TILES: TileDef[] = [
  { id: 'a', area: 'lg:[grid-area:1/1/5/8]', gallery: 'eskuvo', loop: 'hero-eskuvo', label: 'Esküvő', time: '00:08', depth: 2, priority: 9, position: '50% 55%', mobile: 'col-span-2 aspect-[16/11]', sizes: '(min-width:1024px) 58vw, 100vw' },
  { id: 'b', area: 'lg:[grid-area:1/8/3/13]', gallery: 'koncert', loop: 'hero-koncert', label: 'Koncert', time: '00:06', depth: 4, priority: 8, position: '50% 40%', mobile: 'aspect-[4/5]', sizes: '(min-width:1024px) 40vw, 50vw' },
  { id: 'c', area: 'lg:[grid-area:3/8/7/10]', gallery: 'portre', loop: 'hero-portre', label: 'Portré', time: '00:08', depth: 6, priority: 7, position: '50% 35%', mobile: 'aspect-[4/5]', sizes: '(min-width:1024px) 17vw, 50vw' },
  { id: 'd', area: 'lg:[grid-area:3/10/5/13]', gallery: 'gastro', loop: 'hero-gasztro', label: 'Gasztro', time: '00:08', depth: 4, priority: 6, sizes: '23vw' },
  { id: 'g', area: 'lg:[grid-area:5/10/7/13]', label: 'Filmek · 3', depth: 6, priority: 0, films: true, image: '/images/web/film/dokumentumfilm-borito-960.webp', position: '50% 45%', sizes: '23vw' },
  { id: 'f', area: 'lg:[grid-area:5/6/7/8]', gallery: 'rendezveny', loop: 'hero-rendezveny', label: 'Rendezvény', time: '00:08', depth: 6, priority: 5, position: '40% 50%', sizes: '17vw' },
];

function Tile({ t, i, mx, my }: { t: TileDef; i: number; mx: MotionValue<number>; my: MotionValue<number> }) {
  const { openGallery, setAccent, moving } = useSite();
  const reduced = useReducedMotion();
  const x = useTransform(mx, (v) => (moving ? -v * t.depth : 0));
  const y = useTransform(my, (v) => (moving ? -v * t.depth : 0));
  const color = t.gallery ? GENRE[t.gallery].color : 'var(--color-cream)';
  const inner = (
    <>
      {t.loop ? (
        <LoopVideo loop={t.loop} priority={t.priority} position={t.position} sizes={t.sizes} preload={t.id === 'a'} imgClassName="tile-media" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.image} alt="" loading="lazy" className="tile-media absolute inset-0 h-full w-full object-cover" style={{ objectPosition: t.position }} />
      )}
      {t.films && (
        <span aria-hidden className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream/95">
          <span className="ml-1 h-0 w-0 border-y-[11px] border-l-[18px] border-y-transparent border-l-night" />
        </span>
      )}
      <span className="tag absolute bottom-3 left-3" style={{ ['--dot' as string]: color }}>
        {t.label}
        {t.time && <span className="text-mist"> · {t.time}</span>}
      </span>
    </>
  );
  return (
    <motion.div
      className={`relative ${t.mobile ?? 'max-lg:hidden'} ${t.area} lg:aspect-auto`}
      initial={reduced ? { opacity: 0 } : { clipPath: 'inset(50% 0% 50% 0% round 6px)' }}
      animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0% round 6px)' }}
      transition={{ duration: reduced ? 0.4 : 0.9, ease: EASE, delay: 0.25 + i * 0.08 }}
      style={{ x, y }}
    >
      {t.films ? (
        <a href="#filmek" className="tile group absolute inset-0 block overflow-hidden rounded-[6px] bg-black" style={{ ['--tc' as string]: color }} onMouseEnter={() => setAccent('film')}>
          <span className="sr-only">Filmek — ugrás a filmekhez</span>
          {inner}
        </a>
      ) : (
        <button
          type="button"
          className="tile absolute inset-0 block overflow-hidden rounded-[6px] bg-black text-left"
          style={{ ['--tc' as string]: color }}
          onMouseEnter={() => t.gallery && setAccent(t.gallery)}
          onFocus={() => t.gallery && setAccent(t.gallery)}
          onClick={() => t.gallery && openGallery(t.gallery)}
          aria-label={`${t.label} galéria megnyitása`}
        >
          {inner}
        </button>
      )}
    </motion.div>
  );
}

export default function HeroWall() {
  const { moving } = useSite();
  const reduced = useReducedMotion();
  const ref = useAccent('eskuvo');
  const wall = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useSpring(rx, { stiffness: 80, damping: 20 });
  const my = useSpring(ry, { stiffness: 80, damping: 20 });

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative pt-[88px] lg:h-svh lg:min-h-[680px]">
      <div
        ref={wall}
        className="wall grid grid-cols-2 gap-2.5 px-3 pb-3 lg:h-[calc(100%-10px)] lg:grid-cols-12 lg:grid-rows-6 lg:px-5 lg:pb-5"
        onPointerMove={(e) => {
          if (e.pointerType !== 'mouse' || !moving) return;
          const r = e.currentTarget.getBoundingClientRect();
          rx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
          ry.set(((e.clientY - r.top) / r.height - 0.5) * 2);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
      >
        {/* címsor tömör naparany csempén — a szöveg sosem kerül videóra */}
        <motion.div
          className="order-first col-span-2 flex flex-col justify-between gap-5 rounded-[6px] bg-sun p-6 text-night lg:order-none lg:gap-3 lg:[grid-area:5/1/7/6] lg:p-[clamp(18px,1.8vw,28px)]"
          initial={reduced ? { opacity: 0 } : { clipPath: 'inset(50% 0% 50% 0% round 6px)' }}
          animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0% 0% 0% 0% round 6px)' }}
          transition={{ duration: reduced ? 0.4 : 0.9, ease: EASE, delay: 0.1 }}
        >
          <p className="label text-[11px] text-night/75">Vidor Gergely — fotós &amp; operatőr · Budapest</p>
          <h1 id="hero-title" className="display text-[clamp(38px,min(3.6vw,6.2svh),58px)] leading-[0.94]">
            <span className="block">Fotók és filmek.</span>{' '}
            <span className="block">Saját látásmóddal.</span>
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <p className="max-w-[30ch] text-[15px] leading-snug text-night/80">Esküvők, emberek, események — ahogyan én látom.</p>
            <a href="#munkak" className="btn btn-night shrink-0">
              Munkáim <span aria-hidden>↓</span>
            </a>
          </div>
        </motion.div>
        {TILES.map((t, i) => (
          <Tile key={t.id} t={t} i={i} mx={mx} my={my} />
        ))}
      </div>
    </section>
  );
}
