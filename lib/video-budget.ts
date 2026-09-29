/**
 * Videókeret: egyszerre legfeljebb 4 loop fut asztali gépen, 2 mobilon, és egy sem, ha a mozgás
 * szünetel (gomb, csökkentett mozgás, adatkímélő mód), vagy a lap a háttérben van.
 * Csak a képernyőn látható csempék pályáznak; a magasabb prioritású nyer.
 */
type Entry = { priority: number; visible: boolean; set: (on: boolean) => void; on: boolean };

const entries = new Map<number, Entry>();
let nextId = 1;
let allowed = true;
let scheduled = false;

function max() {
  if (typeof window === 'undefined') return 0;
  return window.matchMedia('(min-width: 768px)').matches ? 4 : 2;
}

function recompute() {
  scheduled = false;
  const can = allowed && typeof document !== 'undefined' && !document.hidden;
  const ranked = [...entries.entries()]
    .filter(([, e]) => e.visible)
    .sort((a, b) => b[1].priority - a[1].priority || a[0] - b[0])
    .slice(0, can ? max() : 0)
    .map(([id]) => id);
  for (const [id, e] of entries) {
    const on = ranked.includes(id);
    if (on !== e.on) {
      e.on = on;
      e.set(on);
    }
  }
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(recompute);
}

export const videoBudget = {
  register(priority: number, set: (on: boolean) => void) {
    const id = nextId++;
    entries.set(id, { priority, visible: false, set, on: false });
    return id;
  },
  unregister(id: number) {
    entries.delete(id);
    schedule();
  },
  setVisible(id: number, visible: boolean) {
    const e = entries.get(id);
    if (e && e.visible !== visible) {
      e.visible = visible;
      schedule();
    }
  },
  setAllowed(v: boolean) {
    allowed = v;
    schedule();
  },
  refresh: schedule,
};

if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', schedule);
  window.matchMedia('(min-width: 768px)').addEventListener('change', schedule);
}
