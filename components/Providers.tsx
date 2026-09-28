'use client';

import { MotionConfig } from 'framer-motion';

/** Csökkentett mozgásnál a Framer Motion csak az áttűnést tartja meg, az elmozdulást elhagyja. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
