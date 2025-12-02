import { useEffect, useState } from 'react';

// Hook that computes a scale factor so the referenced element fits within the viewport.
// Applies padding around edges so content does not touch borders.
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
