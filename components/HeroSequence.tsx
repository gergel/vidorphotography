'use client';

import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import LoopVideo from './LoopVideo';
import type { GalleryKey, LoopId } from '@/lib/content';
import { useSite } from '@/lib/site';

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

type T = { id: string; area: string; gallery?: GalleryKey; loop?: LoopId; label: string; priority: number; position?: string; sizes: string; image?: string; films?: boolean; mobile: string };

// a fal végső elrendezése (12 × 6-os rács asztalon)
const TILES: T[] = [
  { id: 'b', area: 'lg:[grid-area:1/8/3/13]', gallery: 'koncert', loop: 'hero-koncert', label: 'Koncert', priority: 8, position: '50% 40%', sizes: '(min-width:1024px) 40vw, 50vw', mobile: 'aspect-[4/5]' },
  { id: 'c', area: 'lg:[grid-area:3/8/7/10]', gallery: 'portre', loop: 'hero-portre', label: 'Portré', priority: 7, position: '50% 35%', sizes: '(min-width:1024px) 17vw, 50vw', mobile: 'aspect-[4/5]' },
  { id: 'd', area: 'lg:[grid-area:3/10/5/13]', gallery: 'gastro', loop: 'hero-gasztro', label: 'Gasztro', priority: 6, sizes: '(min-width:1024px) 23vw, 50vw', mobile: 'aspect-[4/5]' },
  { id: 'f', area: 'lg:[grid-area:5/6/7/8]', gallery: 'rendezveny', loop: 'hero-rendezveny', label: 'Rendezvény', priority: 5, position: '40% 50%', sizes: '(min-width:1024px) 17vw, 50vw', mobile: 'aspect-[4/5]' },
  { id: 'g', area: 'lg:[grid-area:5/10/7/13]', label: 'Filmek', priority: 0, films: true, image: '/images/web/film/dokumentumfilm-borito-960.webp', position: '50% 45%', sizes: '23vw', mobile: 'col-span-2 aspect-[16/9]' },
];

function Tile({ t, i, p, on }: { t: T; i: number; p: MotionValue<number>; on: boolean }) {
  const { openGallery } = useSite();
  const a = 0.42 + i * 0.05;
  const opacity = useTransform(p, (v) => (on ? ease(clamp((v - a) / 0.25)) : 1));
  const scale = useTransform(p, (v) => (on ? 0.9 + 0.1 * ease(clamp((v - a) / 0.3)) : 1));
  const media = (
    <>
      {t.loop ? (
        <LoopVideo loop={t.loop} priority={t.priority} position={t.position} sizes={t.sizes} imgClassName="tile-media" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={t.image} alt="" loading="lazy" className="tile-media absolute inset-0 h-full w-full object-cover" style={{ objectPosition: t.position }} />
      )}
      {t.films && (
        <span aria-hidden className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-cream/90">
          <span className="ml-1 h-0 w-0 border-y-[9px] border-l-[15px] border-y-transparent border-l-night" />
        </span>
      )}
      <span className="tag absolute bottom-3 left-3">{t.label}</span>
    </>
  );
  const cls = 'tile absolute inset-0 block overflow-hidden rounded-[14px] bg-night-2 text-left';
  return (
    <motion.div style={{ opacity, scale }} className={`relative ${t.mobile} ${t.area} lg:aspect-auto`}>
      {t.films ? (
        <a href="#filmek" className={cls}>
          <span className="sr-only">Filmek — ugrás a filmekhez</span>
          {media}
        </a>
      ) : (
        <button type="button" className={cls} onClick={() => t.gallery && openGallery(t.gallery)} aria-label={`${t.label} galéria megnyitása`}>
          {media}
        </button>
      )}
    </motion.div>
  );
}

/**
 * Nyitó jelenet (Apple-stílusú görgetés): a teljes képernyős esküvői loop fölött a cím; lefelé görgetve a cím
 * elhalványul, a videó összezsugorodik a helyére, és köré kirajzolódik a videófal.
 * Mobilon és csökkentett mozgásnál nincs rögzített jelenet: teljes képernyős nyitókép, alatta a fal.
 */
export default function HeroSequence() {
  const { openGallery } = useSite();
  const reduced = useReducedMotion();
  const outer = useRef<HTMLElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const [lg, setLg] = useState(false);
  const on = lg && !reduced;
  const { scrollYProgress: p } = useScroll({ target: outer, offset: ['start start', 'end end'] });

  useEffect(() => {
    const m = window.matchMedia('(min-width: 1024px)');
    const f = () => setLg(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);

  // a nagy csempe kiinduló (teljes képernyős) transzformációja a végső helyéből számolva
  const gs = useMotionValue(1);
  const gdx = useMotionValue(0);
  const gdy = useMotionValue(0);

  const t = useTransform(p, (v) => (on ? ease(clamp((v - 0.12) / 0.43)) : 1));
  // a geometria is bemenet, így méréskor (és átméretezéskor) azonnal frissül
  const aScale = useTransform([t, gs], ([k, g]: number[]) => g + (1 - g) * k);
  const aX = useTransform([t, gdx], ([k, g]: number[]) => g * (1 - k));
  const aY = useTransform([t, gdy], ([k, g]: number[]) => g * (1 - k));
  const aRadius = useTransform([t, aScale], ([k, sc]: number[]) => (14 * k) / Math.max(0.2, sc));
  // mérés a transzformációk feliratkozása UTÁN (a hookok sorrendjében), hogy az első érték is átmenjen
  useEffect(() => {
    const el = slot.current;
    if (!el || !on) return;
    const measure = () => {
      // offset* nem függ a transzformációtól → a végső hely mérete és helyzete a rögzített kereten belül
      const w = el.offsetWidth, h = el.offsetHeight;
      const vw = window.innerWidth, vh = window.innerHeight;
      gs.set(Math.max(vw / w, vh / h));
      gdx.set(vw / 2 - (el.offsetLeft + w / 2));
      gdy.set(vh / 2 - (el.offsetTop + h / 2));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [on]);
  const titleOpacity = useTransform(p, (v) => (on ? 1 - clamp((v - 0.04) / 0.14) : 1));
  const titleY = useTransform(p, (v) => (on ? -60 * clamp(v / 0.18) : 0));
  const scrim = useTransform(p, (v) => (on ? 1 - clamp((v - 0.04) / 0.16) : 1));
  const textOpacity = useTransform(p, (v) => (on ? ease(clamp((v - 0.62) / 0.2)) : 1));
  const textY = useTransform(p, (v) => (on ? 30 * (1 - ease(clamp((v - 0.62) / 0.2))) : 0));

  return (
    <section ref={outer} id="top" aria-labelledby="hero-title" className={on ? 'relative h-[320svh]' : 'relative'}>
      <div className={on ? 'sticky top-0 h-svh overflow-hidden' : 'relative'}>
        <div className="wall grid grid-cols-2 gap-3 px-3 pb-3 lg:h-full lg:grid-cols-12 lg:grid-rows-6 lg:px-5 lg:pb-5 lg:pt-[76px]">
          {/* nagy esküvői csempe: nyitóképből zsugorodik a helyére */}
          <motion.div
            ref={slot}
            style={{ scale: aScale, x: aX, y: aY, borderRadius: aRadius }}
            className="relative z-10 col-span-2 h-svh overflow-hidden rounded-[14px] max-lg:-mx-3 max-lg:rounded-none lg:h-auto lg:[grid-area:1/1/5/8]"
          >
            <button type="button" className="tile absolute inset-0 block" onClick={() => openGallery('eskuvo')} aria-label="Esküvő galéria megnyitása">
              <LoopVideo loop="hero-eskuvo" priority={9} position="50% 55%" sizes="100vw" preload imgClassName="tile-media" />
            </button>
            <motion.div aria-hidden style={{ opacity: scrim }} className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.55)_0%,rgba(0,0,0,.25)_45%,rgba(0,0,0,.6)_100%)]" />
          </motion.div>

          {/* nyitó cím a teljes képernyős videó fölött */}
          <motion.div
            style={{ opacity: titleOpacity, y: titleY }}
            className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-svh flex-col items-center justify-center px-6 text-center"
          >
            <p className="mb-4 text-[17px] font-semibold text-cream/85 md:text-[21px]">Vidor Gergely — fotós és operatőr</p>
            <h1 id="hero-title" className="display text-[clamp(48px,8vw,120px)] leading-[1.02] text-cream">
              <span className="block">Fotók és filmek.</span>{' '}
              <span className="block text-cream/70">Saját látásmóddal.</span>
            </h1>
            <p className="mt-8 text-[13px] text-cream/70" aria-hidden>
              Görgess lefelé ↓
            </p>
          </motion.div>

          {TILES.map((tt, i) => (
            <Tile key={tt.id} t={tt} i={i} p={p} on={on} />
          ))}

          {/* a fal szövegcsempéje (asztalon a végén tűnik fel) */}
          <motion.div
            style={{ opacity: textOpacity, y: textY }}
            className="col-span-2 flex flex-col justify-between gap-6 rounded-[14px] bg-night-2 p-6 max-lg:hidden lg:[grid-area:5/1/7/6] lg:p-8"
          >
            <p className="label">Budapest · 2015 óta</p>
            <div>
              <p className="display text-[clamp(28px,2.6vw,40px)] leading-[1.08]">Esküvők, emberek, események — ahogyan én látom.</p>
            </div>
            <div className="flex gap-3">
              <a href="#munkak" className="btn btn-cream !min-h-11 !text-[14px]">Munkáim</a>
              <a href="#kapcsolat" className="btn btn-ghost !min-h-11 !text-[14px]">Kapcsolat</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
