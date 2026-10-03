// Web Audio API Dual-Tone Emergency Siren & Vibration Dispatcher

let audioCtx: AudioContext | null = null;
let sirenOscillator: OscillatorNode | null = null;
let sirenGain: GainNode | null = null;
let sirenTimer: number | null = null;

export function playEmergencySiren(): void {
  try {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (!audioCtx) return;

    // Stop if already running
    stopEmergencySiren();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(650, audioCtx.currentTime);

    // Initial gain ramp
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.4, audioCtx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();

    sirenOscillator = osc;
    sirenGain = gain;

    // Siren frequency sweep simulation
    let isHigh = false;
    sirenTimer = window.setInterval(() => {
      if (!audioCtx || !sirenOscillator) return;
      isHigh = !isHigh;
      const targetFreq = isHigh ? 980 : 620;
      sirenOscillator.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.22);
    }, 400);

    // Trigger haptic vibration on devices that support it
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([400, 200, 400, 200, 800, 300, 800]);
    }
  } catch (err) {
    console.warn('Web Audio Siren not permitted or supported:', err);
  }
}

export function stopEmergencySiren(): void {
  if (sirenTimer !== null) {
    clearInterval(sirenTimer);
    sirenTimer = null;
  }
  if (sirenOscillator) {
    try {
      sirenOscillator.stop();
      sirenOscillator.disconnect();
    } catch {
      // ignore
    }
    sirenOscillator = null;
  }
  if (sirenGain) {
    try {
      sirenGain.disconnect();
    } catch {
      // ignore
    }
    sirenGain = null;
  }
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(0);
  }
}

// Distance calculation between two GPS coordinates in meters (Haversine Formula)
export function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}
