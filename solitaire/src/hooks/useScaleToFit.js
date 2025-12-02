import { useEffect, useState } from 'react';

/**
 * Hook that shrinks the game board to fit your screen
 * 
 * What it does:
 * 1. Measures how big the game board wants to be
 * 2. Checks how much room there actually is (accounting for padding and sidebars)
 * 3. Gives back a scale number to shrink things down if needed
 * 4. Updates when you resize the window
 * 
 * Options you can tweak:
 * - padding: breathing room around the edges (default 32px)
 * - maxScale: won't make things bigger than this (default 1 = original size max)
 * - reservedRight: save space for a sidebar on the right
 * - reservedBottom: save space for stuff at the bottom
 */
export default function useScaleToFit(ref, { padding = 32, maxScale = 1, reservedRight = 0, reservedBottom = 0 } = {}) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function recalc() {
      if (!ref.current) return;
      const el = ref.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const targetW = el.offsetWidth;
      const targetH = el.offsetHeight;
      if (!targetW || !targetH) return;
      const availW = Math.max(0, vw - padding * 2 - reservedRight);
      const availH = Math.max(0, vh - padding * 2 - reservedBottom);
      const s = Math.min(maxScale, Math.min(availW / targetW, availH / targetH));
      setScale(s <= 0 ? 1 : s);
    }
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [ref, padding, maxScale, reservedRight, reservedBottom]);

  return scale;
}
