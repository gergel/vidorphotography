'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { LoopId } from '@/lib/content';
import { LOOPS } from '@/lib/loops';
import { useSite } from '@/lib/site';
import { videoBudget } from '@/lib/video-budget';

type Props = {
  loop: LoopId;
  /** nagyobb szám = előbb kap helyet a videókeretben */
  priority?: number;
  /** rámutatásra induló loop (a kereten kívül, de csak ha a mozgás engedélyezett) */
  hoverPlay?: boolean;
  active?: boolean;
  position?: string;
  sizes?: string;
  preload?: boolean;
  className?: string;
  imgClassName?: string;
};

/**
 * Néma, végtelenített loop a saját fotókból. Előbb mindig a poszter látszik (LCP, üres csempe nincs);
 * a videó csak akkor töltődik és indul, ha látható és kap helyet a videókeretben.
 */
export default function LoopVideo({ loop, priority = 0, hoverPlay, active, position = '50% 50%', sizes = '50vw', preload, className = '', imgClassName = '' }: Props) {
  const { moving } = useSite();
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [granted, setGranted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [shown, setShown] = useState(false);
  const L = LOOPS[loop];

  // keretből kapott hely (csak a nem rámutatásra induló loopoknál)
  useEffect(() => {
    if (hoverPlay) return;
    const id = videoBudget.register(priority, setGranted);
    const el = box.current;
    const io = new IntersectionObserver(([e]) => videoBudget.setVisible(id, e.isIntersecting), { rootMargin: '80px' });
    if (el) io.observe(el);
    return () => {
      io.disconnect();
      videoBudget.unregister(id);
    };
  }, [hoverPlay, priority]);

  const play = hoverPlay ? !!active && moving : granted;

  useEffect(() => {
    if (play) setLoaded(true);
    const v = video.current;
    if (!v) return;
    if (play) v.play().catch(() => {});
    else {
      v.pause();
      if (hoverPlay) setShown(false);
    }
  }, [play, loaded, hoverPlay]);

  return (
    <div ref={box} className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <Image src={L.poster} alt="" fill sizes={sizes} preload={preload} fetchPriority={preload ? 'high' : undefined} className={`object-cover ${imgClassName}`} style={{ objectPosition: position }} />
      {loaded && (
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          onPlaying={() => setShown(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${shown ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
          style={{ objectPosition: position }}
        >
          <source src={L.webm} type="video/webm" />
          <source src={L.mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
