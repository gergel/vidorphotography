import manifest from './video-manifest.json';
import type { LoopId } from './content';

type Loop = { w: number; h: number; mp4: string; webm: string; poster: string };
export const LOOPS = manifest as Record<LoopId, Loop>;
