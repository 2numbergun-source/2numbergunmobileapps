// Google Sheet (Apps Script) सँग सम्पर्क गर्ने तह
const URL_ = import.meta.env.VITE_SCRIPT_URL as string;
const K = { dev: 'apf_device_id', tok: 'apf_token', role: 'apf_role', oid: 'apf_officer' };
export const deviceId = (): string => { let d = localStorage.getItem(K.dev); if (!d) { d = crypto.randomUUID(); localStorage.setItem(K.dev, d); } return d; };
export const session = () => ({ token: localStorage.getItem(K.tok) || '', role: localStorage.getItem(K.role) || '', officerId: localStorage.getItem(K.oid) || '' });
export const logout = () => { Object.values(K).forEach((k) => k !== K.dev && localStorage.removeItem(k)); location.reload(); };

async function call(body: Record<string, unknown>) {
  const r = await fetch(URL_, { method: 'POST', body: JSON.stringify({ ...body, token: session().token, deviceId: deviceId() }) }); // text/plain: CORS preflight नलाग्ने
  const j = await r.json(); if (j.auth === false) logout(); return j;
}
export async function login(p: { officerId?: string; pin: string; admin?: boolean }) {
  const j = await call({ action: 'login', ...p });
  if (j.ok) { localStorage.setItem(K.tok, j.token); localStorage.setItem(K.role, j.role); localStorage.setItem(K.oid, j.officerId); }
  return j;
}
export const loadAll = (keys: string[]) => call({ action: 'load', keys });
export const resetDevice = (officerId: string) => call({ action: 'resetDevice', officerId });
export const gpsCheck = (action: 'checkin' | 'checkout', extra: Record<string, unknown>) => call({ action, ...extra });

let ready = false; export const setCloudReady = () => { ready = true; };
const timers: Record<string, number> = {};
export function cloudSet(key: string, value: unknown) { // केवल Admin ले बचत गर्छ; हाजिरी चाहिँ gpsCheck मार्फत
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* cache */ }
  if (!ready || session().role !== 'admin') return;
  clearTimeout(timers[key]); timers[key] = window.setTimeout(() => call({ action: 'save', key, value }), 1500);
}
export function startPolling(fn: () => void, ms = 30000) { const t = setInterval(() => document.visibilityState === 'visible' && fn(), ms); return () => clearInterval(t); }
