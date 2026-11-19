import { useEffect, useState } from 'react';

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

export function useReducedMotionPref(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return reduced;
}

/**
 * Returns true if the user has Save-Data enabled, prefers reduced motion,
 * or is on a slow cellular connection (slow-2g / 2g / 3g).
 */
export function useLowDataOrReducedMotion(): {
  reducedMotion: boolean;
  lowData: boolean;
  shouldUsePosterOnly: boolean;
} {
  const reducedMotion = useReducedMotionPref();
  const [lowData, setLowData] = useState(false);

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
    if (!conn) return;
    const check = () => {
      const save = Boolean(conn.saveData);
      const slow = conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g' || conn.effectiveType === '3g';
      setLowData(save || slow);
    };
    check();
    conn.addEventListener?.('change', check);
    return () => conn.removeEventListener?.('change', check);
  }, []);

  return {
    reducedMotion,
    lowData,
    shouldUsePosterOnly: reducedMotion || lowData,
  };
}

export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setFine(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return fine;
}
