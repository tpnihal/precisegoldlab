import { useEffect, useState } from 'react';

export type GoldTickerData = {
  isDemo: boolean;
  label: string;
  symbol: string;
  currency: string;
  ouncePriceUsd: number;
  gram24kAed: number;
  gram22kAed: number;
  gram21kAed: number;
  gram18kAed: number;
  changePct: number;
  sparkline: number[];
  updatedNote: string;
};

const DEMO_SPARKLINE = [
  2684, 2689, 2686, 2692, 2698, 2695, 2704, 2709, 2706, 2714, 2718, 2715, 2722, 2726,
];

/**
 * Single swappable hook for the XAU/USD & AED/g indicative widget in Section 4.
 * Ships with unmistakable DEMO DATA by default so simulated figures are never
 * presented as live market quotes. Swap the fetch inside `useEffect` when a
 * licensed bullion feed endpoint is connected.
 */
export function useGoldTicker(): GoldTickerData {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % 5);
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  const jitter = (step - 2) * 0.45;
  const ouncePriceUsd = Number((2724.5 + jitter).toFixed(2));
  const gram24kAed = Number(((ouncePriceUsd / 31.1034768) * 3.6725).toFixed(2));

  return {
    isDemo: true,
    label: 'DEMO DATA — ILLUSTRATIVE TICKER ONLY',
    symbol: 'XAU / USD · AED / g',
    currency: 'AED',
    ouncePriceUsd,
    gram24kAed,
    gram22kAed: Number((gram24kAed * (916.6 / 999.9)).toFixed(2)),
    gram21kAed: Number((gram24kAed * (875.0 / 999.9)).toFixed(2)),
    gram18kAed: Number((gram24kAed * (750.0 / 999.9)).toFixed(2)),
    changePct: 0.42,
    sparkline: DEMO_SPARKLINE,
    updatedNote:
      'Illustrative demo display. Actual scrap gold payouts are calculated in-lab from your assayed fineness (‰) and live Dubai Gold Souq desk rates at the time of settlement.',
  };
}
