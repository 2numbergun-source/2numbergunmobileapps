/**
 * src/lib/sosSiren.ts
 * नयाँ SOS आउँदा (अर्को कर्मचारीबाट) साइरन, कम्पन र सूचना देखाउने।
 * नोट: ब्राउजरको नियमले गर्दा प्रयोगकर्ताले एपमा एकपटक छोएपछि मात्र आवाज बज्छ।
 * फोन लक वा एप बन्द हुँदा यसले काम गर्दैन, त्यसका लागि Telegram प्रयोग हुन्छ।
 */
import { useEffect, useRef } from 'react';
import type { EmergencyAlert } from '../types/police';

let audioCtx: AudioContext | null = null;
let sirenTimer: any = null;

function getCtx(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

/** साइरन बजाउने (डिफल्ट १५ सेकेन्ड) */
export function playSiren(seconds = 15) {
  const ctx = getCtx();
  if (!ctx) return;
  stopSiren();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'square';
  gain.gain.value = 0.25;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  let high = false;
  const tick = () => {
    high = !high;
    osc.frequency.setValueAtTime(high ? 950 : 600, ctx.currentTime);
  };
  tick();
  const iv = setInterval(tick, 450);
  const end = setTimeout(() => stopSiren(), seconds * 1000);
  sirenTimer = { osc, gain, iv, end };
}

export function stopSiren() {
  if (!sirenTimer) return;
  try { clearInterval(sirenTimer.iv); clearTimeout(sirenTimer.end); } catch {}
  try { sirenTimer.osc.stop(); sirenTimer.osc.disconnect(); sirenTimer.gain.disconnect(); } catch {}
  sirenTimer = null;
}

export function useSosSiren(alerts: EmergencyAlert[], myOfficerId: string) {
  const seen = useRef<Set<string>>(new Set());
  const mountedAt = useRef<number>(Date.now());
  const askedPerm = useRef(false);

  // पहिलो स्पर्शमा आवाज र सूचना अनुमति खोल्ने
  useEffect(() => {
    const unlock = () => {
      getCtx();
      if (!askedPerm.current && 'Notification' in window && Notification.permission === 'default') {
        askedPerm.current = true;
        try { Notification.requestPermission(); } catch {}
      }
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    // एप खुलेको पहिलो ८ सेकेन्डमा आएका पुराना अलर्टमा आवाज नबजाउने
    const warmup = Date.now() - mountedAt.current < 8000;
    alerts.forEach((a) => {
      if (!a || !a.id || seen.current.has(a.id)) return;
      seen.current.add(a.id);
      if (warmup) return;
      if (a.officerId === myOfficerId) return; // आफैंले पठाएको SOS मा साइरन नबजाउने
      playSiren(15);
      try { navigator.vibrate?.([800, 300, 800, 300, 800, 300, 800]); } catch {}
      try {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('🚨 आपतकालीन SOS', {
            body: ((a as any).officerName || (a as any).name || 'कर्मचारी') + ' बाट SOS प्राप्त भयो',
            requireInteraction: true,
          });
        }
      } catch {}
    });
  }, [alerts, myOfficerId]);
}
