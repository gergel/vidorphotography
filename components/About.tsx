'use client';

import Image from 'next/image';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import LoopVideo from './LoopVideo';
import { APPROACH } from '@/lib/content';
import { photo } from '@/lib/images';
import { useAccent } from './Spill';

/** Rólam + Szemlélet: lassan közelítő portré-loop és egy vágóprogram-idővonal, amelyen a lejátszófej görgetésre halad. */
export default function About() {
  const ref = useAccent('eskuvo');
  const tl = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: tl, offset: ['start 85%', 'end 35%'] });
  const left = useTransform(scrollYProgress, [0, 1], ['2%', '98%']);
  const [auto, setAuto] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setAuto(Math.min(2, Math.floor(v * 3)));
    setPicked(null);
  });
  const active = picked ?? auto;

  return (
    <section ref={ref} id="rolam" aria-labelledby="about-title" className="py-20 md:py-28">
      <div className="container-site">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-16">
          <div className="relative aspect-[9/10] overflow-hidden rounded-[6px] bg-black">
            <LoopVideo loop="rolam" priority={2} position="50% 40%" sizes="(min-width:768px) 42vw, 100vw" />
            <span className="tag absolute bottom-3 left-3">Rólam · 00:08</span>
          </div>
          <div>
            <p className="label mb-4 text-sun">Rólam</p>
            <h2 id="about-title" className="display text-[clamp(40px,5vw,76px)] leading-[0.95]">
              Vidor Gergely, fotós és operatőr.
            </h2>
            <p className="mt-6 max-w-[58ch] text-[17px] leading-[1.7] text-mist">
              Budapesten élek és dolgozom. 2015 óta fotózom és filmezek — portrékat, eseményeket, márkákat, ételeket,
              koncerteket és történeteket. Nem számít a műfaj: a képeimben mindig az őszinteség és a személyes látásmód a közös.
            </p>
            <p className="label mt-7 inline-flex items-center gap-2 rounded-full border border-sun/50 px-4 py-2 text-[11px] text-sun">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-sun" /> Budapest · 2015 óta
            </p>
          </div>
        </div>

        {/* Szemlélet: vágóasztal */}
        <div className="mt-20 md:mt-28">
          <p className="label mb-3 text-sun">Szemlélet</p>
          <h3 className="display text-[clamp(32px,4.4vw,64px)] leading-[0.98]">{APPROACH.title}</h3>

          <div ref={tl} className="mt-8 overflow-hidden rounded-[8px] border border-rule bg-night-2">
            <div className="flex items-center justify-between border-b border-rule px-4 py-2.5">
              <span className="label text-[11px] text-cream">Szemlélet · idővonal</span>
              <span className="label text-[11px] text-mist">3 klip</span>
            </div>
            <div className="relative px-4 pb-4 pt-8">
              {/* időkód-vonalzó */}
              <div aria-hidden className="absolute inset-x-4 top-3 h-3 bg-[repeating-linear-gradient(90deg,rgba(244,241,234,.35)_0_1px,transparent_1px_24px)] opacity-60" />
              <motion.div aria-hidden style={{ left }} className="absolute bottom-2 top-1 z-10 w-0.5 -translate-x-1/2 bg-[#FF4D4D]">
                <span className="absolute -left-[5px] top-0 h-3 w-3 rotate-45 bg-[#FF4D4D]" />
              </motion.div>
              <ol className="grid grid-cols-3 gap-1.5">
                {APPROACH.steps.map((s, i) => {
                  const on = active === i;
                  const p = photo(s.image, 960);
                  return (
                    <li key={s.n}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setPicked(i)}
                        className={`block w-full overflow-hidden rounded-[4px] border text-left transition-colors ${on ? 'border-sun bg-sun text-night' : 'border-rule bg-night-3 text-cream'}`}
                      >
                        <span className="flex items-center justify-between px-2.5 py-1.5">
                          <span className="font-mono text-[11px] uppercase tracking-[0.1em]">
                            {s.n}<span className="max-sm:sr-only"> {s.title}</span>
                          </span>
                        </span>
                        <span className="relative block h-16 md:h-24">
                          <Image src={p.src} alt="" fill sizes="30vw" className={`object-cover transition-opacity ${on ? 'opacity-100' : 'opacity-55'}`} />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div aria-live="polite" className="mt-3 rounded-[4px] bg-sun px-4 py-3 text-night">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em]">
                  {APPROACH.steps[active].n} · {APPROACH.steps[active].title}
                </span>
                <p className="mt-1 text-[16px] font-medium">{APPROACH.steps[active].text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
