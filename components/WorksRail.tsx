'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import LoopVideo from './LoopVideo';
import ScrollWords from './ScrollWords';
import { GALLERIES, GENRE, WORKS, type GalleryKey } from '@/lib/content';
import { useSite } from '@/lib/site';

const ORDER: GalleryKey[] = ['eskuvo', 'koncert', 'portre', 'gastro', 'rendezveny'];

function Card({ k }: { k: GalleryKey }) {
  const { openGallery } = useSite();
  const w = WORKS.find((x) => x.gallery === k)!;
  const n = GALLERIES[k].images.length;
  return (
    <li className="w-[84vw] shrink-0 snap-center sm:w-[64vw] lg:w-[min(44vw,700px,calc((100svh-330px)*1.6))]">
      <button type="button" onClick={() => openGallery(k)} className="tile group block w-full text-left" aria-label={`${w.title} galéria megnyitása (${n} fotó)`}>
        <span className="relative block aspect-[4/5] overflow-hidden rounded-[18px] bg-night-2 sm:aspect-[16/10]">
          <LoopVideo loop={GENRE[k].loop} priority={4} position={w.position} sizes="(min-width:1024px) 58vw, 84vw" imgClassName="tile-media" />
        </span>
        <span className="mt-5 flex items-baseline justify-between gap-6 px-1">
          <span>
            <span className="display block text-[clamp(24px,2.4vw,34px)] leading-tight">{w.title}</span>
            <span className="mt-1 block text-[16px] text-mist">{w.description}</span>
          </span>
          <span className="shrink-0 text-[15px] text-mist transition-colors group-hover:text-cream">{n} fotó ›</span>
        </span>
      </button>
    </li>
  );
}

/**
 * Munkák: lefelé görgetve a műfajkártyák vízszintesen úsznak át (asztalon rögzített jelenet).
 * Mobilon és csökkentett mozgásnál sima vízszintes, húzható sor.
 */
export default function WorksRail() {
  const reduced = useReducedMotion();
  const outer = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [lg, setLg] = useState(false);
  const [dist, setDist] = useState(0);
  const on = lg && !reduced;
  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (v) => (on ? -dist * Math.min(1, Math.max(0, (v - 0.08) / 0.84)) : 0));

  useEffect(() => {
    const m = window.matchMedia('(min-width: 1024px)');
    const f = () => {
      setLg(m.matches);
      const t = track.current;
      if (t) setDist(Math.max(0, t.scrollWidth - window.innerWidth));
    };
    f();
    m.addEventListener('change', f);
    window.addEventListener('resize', f);
    return () => {
      m.removeEventListener('change', f);
      window.removeEventListener('resize', f);
    };
  }, []);

  return (
    <section ref={outer} id="munkak" aria-labelledby="works-title" style={on ? { height: `calc(100svh + ${dist}px + 40svh)` } : undefined} className="relative">
      <div className={on ? 'sticky top-0 flex h-svh flex-col justify-center overflow-hidden' : 'py-24'}>
        <div className="container-site mb-8 flex items-end justify-between gap-8 lg:pt-[60px]">
          <div>
            <p className="label mb-2">Válogatott munkák</p>
            <h2 id="works-title" className="display max-w-[18ch] text-[clamp(36px,4.2vw,64px)] leading-[1.04]">Képek, amelyek tovább élnek a pillanatnál.</h2>
          </div>
        </div>
        <motion.ul
          ref={track}
          onFocus={(e) => {
            // billentyűzettel a fókuszált kártya görgetéssel a képbe kerül
            if (!on || !outer.current) return;
            const li = (e.target as HTMLElement).closest('li');
            if (!li || !dist) return;
            const want = Math.min(dist, Math.max(0, li.offsetLeft - (window.innerWidth - li.offsetWidth) / 2));
            const v = 0.08 + 0.84 * (want / dist);
            const top = outer.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: top + v * (outer.current.offsetHeight - window.innerHeight), behavior: 'instant' });
          }}
          style={{ x }}
          aria-label="Műfajok"
          className={`flex gap-6 px-[clamp(20px,5vw,72px)] ${on ? 'w-max' : 'no-scrollbar snap-x snap-mandatory overflow-x-auto'}`}
        >
          {ORDER.map((k) => (
            <Card key={k} k={k} />
          ))}
          <li aria-hidden className="w-px shrink-0" />
        </motion.ul>
      </div>
    </section>
  );
}

/** Rövid bevezető a munkák előtt: görgetésre szavanként kivilágosodik. */
export function Intro() {
  return (
    <section aria-label="Bevezető" className="container-site py-[18svh]">
      <ScrollWords
        className="display mx-auto max-w-[22ch] text-center text-[clamp(34px,5vw,72px)] leading-[1.1]"
        text="Emberek, helyzetek és részletek — őszintén, érzékenyen, felesleges pózok nélkül."
      />
    </section>
  );
}
