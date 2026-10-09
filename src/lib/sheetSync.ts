/**
 * src/lib/sheetSync.ts  -  App.tsx ले प्रयोग गर्ने useSheetSync
 *
 * useSheetSync(table, rows, setRows, mode)
 *   mode 'replace' (पूर्वनिर्धारित): थप/सच्याइ/मेटाइ सबै Sheet मा जान्छ
 *   mode 'upsert'  : थप/सच्याइ मात्र (हाजिरी, SOS इतिहास कहिल्यै मेटिँदैन)
 *
 * Netlify (Site settings > Environment variables) र .env मा:
 *   VITE_SHEET_URL = Apps Script को /exec URL
 *   VITE_APP_TOKEN = Code.gs को APP_TOKEN
 * VITE_SHEET_URL नभए एप पहिले जस्तै यही डिभाइसमा मात्र (localStorage) चल्छ।
 */
import { useEffect, useRef } from 'react';

type Mode = 'replace' | 'upsert';
type AnyRow = { id: string; [k: string]: any };

const ENV = ((import.meta as any).env || {}) as Record<string, string | undefined>;
const URL_ = ENV.VITE_SHEET_URL || 'https://script.google.com/macros/s/AKfycbx3Ee6csxA12Wlc05Rd46MpTLoySFvK3I0OqW2HRUUvsQIqsD5AMQU7IdeeL5dQTbhF/exec';
const TOKEN = ENV.VITE_APP_TOKEN ?? '';
const POLL_MS = 90_000;      // हरेक ९० सेकेन्डमा नयाँ डाटा हेर्ने (स्क्रिन खुला हुँदा मात्र)
const DEBOUNCE_MS = 1_500;   // परिवर्तन गरेको १.५ सेकेन्डपछि Sheet मा पठाउने
const KEY_STORE = 'sheet_admin_key';
const KEY_EVENT = 'sheet-admin-key';

// ---------- एडमिन कुञ्जी (Code.gs को ADMIN_KEY) ----------
export function getAdminKey(): string {
  try { return localStorage.getItem(KEY_STORE) || ''; } catch { return ''; }
}
export function setAdminKey(k: string) {
  try { k ? localStorage.setItem(KEY_STORE, k) : localStorage.removeItem(KEY_STORE); } catch {}
  window.dispatchEvent(new Event(KEY_EVENT));
}
export function clearAdminKey() { setAdminKey(''); }
/** एडमिन मोडमा कुञ्जी छैन भने एक पटक सोध्छ */
export function ensureAdminKey() {
  if (!URL_ || getAdminKey()) return;
  const k = window.prompt('Google Sheet एडमिन कुञ्जी (Code.gs को ADMIN_KEY) हाल्नुहोस्:');
  if (k && k.trim()) setAdminKey(k.trim());
}

// ---------- सर्भर कल ----------
async function call(action: string, payload: Record<string, any> = {}) {
  // text/plain ले CORS preflight जोगाउँछ (Apps Script का लागि आवश्यक)
  const res = await fetch(URL_!, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ token: TOKEN, adminKey: getAdminKey(), action, ...payload }),
  });
  const j = await res.json();
  if (!j.ok) throw new Error(j.error || 'sheet error');
  return j;
}

// सबै हुकले एउटै अनुरोध साझा गर्छन् (८ तालिका = १ कल); ver उही भए सर्भरले केही पठाउँदैन
let cache: Record<string, AnyRow[]> = {};
let lastVer = '';
let lastFetch = 0;
let inflight: Promise<Record<string, AnyRow[]>> | null = null;

function invalidate() { lastVer = ''; lastFetch = 0; }

function getAll(maxAgeMs: number): Promise<Record<string, AnyRow[]>> {
  if (inflight) return inflight;
  if (Date.now() - lastFetch < maxAgeMs) return Promise.resolve(cache);
  inflight = (async () => {
    try {
      const j = await call('listAll', { ver: lastVer });
      if (!j.unchanged) cache = j.tables || {};
      lastVer = j.ver || '';
      lastFetch = Date.now();
      return cache;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

// कुञ्जीको क्रम नमिल्दा पनि बराबर ठान्न
function stable(v: any): string {
  if (Array.isArray(v)) return '[' + v.map(stable).join(',') + ']';
  if (v && typeof v === 'object') {
    return '{' + Object.keys(v).filter((k) => v[k] !== undefined).sort()
      .map((k) => JSON.stringify(k) + ':' + stable(v[k])).join(',') + '}';
  }
  return JSON.stringify(v) ?? 'null';
}

export function useSheetSync<T extends { id: string }>(
  table: string,
  rows: T[],
  setRows: (r: T[]) => void,
  mode: Mode = 'replace',
) {
  const rowsRef = useRef<AnyRow[]>(rows as any);
  rowsRef.current = rows as any;
  const setRef = useRef(setRows);
  setRef.current = setRows;

  const snap = useRef<Map<string, string>>(new Map());   // Sheet मा भएको अन्तिम अवस्था
  const ready = useRef(false);
  const busy = useRef(false);
  const seeding = useRef(false);
  const timer = useRef<any>(null);
  const scheduleRef = useRef<() => void>(() => {});

  // डाटा बदलिँदा Sheet मा पठाउन तालिका मिलाउने
  useEffect(() => {
    if (ready.current) scheduleRef.current();
  }, [rows]);

  useEffect(() => {
    if (!URL_) return;
    let alive = true;

    const diff = () => {
      const changed: AnyRow[] = [];
      const seen = new Set<string>();
      for (const r of rowsRef.current) {
        if (!r || !r.id) continue;
        seen.add(r.id);
        if (snap.current.get(r.id) !== stable(r)) changed.push(r);
      }
      const removed = mode === 'replace' ? Array.from(snap.current.keys()).filter((id) => !seen.has(id)) : [];
      return { changed, removed };
    };
    const hasPending = () => {
      const d = diff();
      return d.changed.length > 0 || d.removed.length > 0;
    };
    const schedule = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(flush, DEBOUNCE_MS);
    };
    scheduleRef.current = schedule;

    function applyRemote(remote: AnyRow[]) {
      let next = remote;
      if (mode === 'upsert') {
        const ids = new Set(remote.map((r) => r.id));
        next = [...rowsRef.current.filter((r) => r && r.id && !ids.has(r.id)), ...remote];
      }
      snap.current = new Map(remote.map((r) => [r.id, stable(r)] as [string, string]));
      if (stable(next) !== stable(rowsRef.current.filter((r) => r && r.id))) setRef.current(next as any);
    }

    async function flush() {
      if (!ready.current || busy.current) return;
      const { changed, removed } = diff();
      if (!changed.length && !removed.length) return;
      busy.current = true;
      let ok = false;
      try {
        let saved: AnyRow[] = [];
        if (changed.length) saved = (await call('upsertMany', { table, rows: changed })).rows || [];
        if (removed.length) await call('deleteMany', { table, ids: removed });
        invalidate();

        const sent = new Map(changed.map((r) => [r.id, stable(r)] as [string, string]));
        const savedBy = new Map(saved.map((r) => [r.id, r] as [string, AnyRow]));
        changed.forEach((r) => snap.current.set(r.id, stable(savedBy.get(r.id) ?? r)));
        removed.forEach((id) => snap.current.delete(id));

        // फोटो Drive लिङ्क भएर आएमा स्थानीय प्रतिलाई पनि लिङ्कले बदल्ने (base64 फेरि नपठाउन)
        const swap = new Map(
          saved.filter((s) => stable(s) !== sent.get(s.id)).map((s) => [s.id, s] as [string, AnyRow]),
        );
        if (swap.size) {
          setRef.current(
            rowsRef.current.map((r) => (r && swap.has(r.id) && stable(r) === sent.get(r.id) ? swap.get(r.id)! : r)) as any,
          );
        }
        ok = true;
      } catch (e: any) {
        console.warn('[sheet]', table, e?.message);
        if (String(e?.message).includes('forbidden')) {
          // अनुमति छैन: स्थानीय परिवर्तन फिर्ता गरी Sheet को डाटा देखाउने
          try {
            const remote = ((await getAll(0))[table] || []) as AnyRow[];
            if (remote.length) applyRemote(remote);
            else snap.current = new Map(rowsRef.current.filter((r) => r?.id).map((r) => [r.id, stable(r)] as [string, string]));
          } catch {}
        }
      } finally {
        busy.current = false;
        if (ok && alive && hasPending()) schedule();
      }
    }

    async function pull(maxAge = 4000) {
      try {
        const remote = (((await getAll(maxAge))[table]) || []) as AnyRow[];
        if (!alive) return;
        const seedKey = 'sheet_seeded_' + table;
        const local = rowsRef.current.filter((r) => r && r.id);

        if (remote.length === 0) {
          // Sheet खाली: एडमिन डिभाइसबाट पहिलो पटक अहिलेको डाटा Sheet मा सार्ने (एक पटक मात्र)
          if (getAdminKey() && local.length && !localStorage.getItem(seedKey) && !seeding.current) {
            seeding.current = true;
            try {
              await call('bulkReplace', { table, rows: local });
              localStorage.setItem(seedKey, '1');
              invalidate();
              const fresh = (((await getAll(0))[table]) || []) as AnyRow[];
              if (alive && fresh.length) applyRemote(fresh);
            } finally {
              seeding.current = false;
            }
          } else if (!ready.current) {
            snap.current = new Map(local.map((r) => [r.id, stable(r)] as [string, string]));
          }
          ready.current = true;
          return;
        }

        try { localStorage.setItem(seedKey, '1'); } catch {}
        // पहिलो पटक: Sheet नै सत्य। पछि: स्थानीय परिवर्तन पठाउन बाँकी भए पर्खने
        if (ready.current && (busy.current || hasPending())) return;
        applyRemote(remote);
        ready.current = true;
      } catch (e: any) {
        console.warn('[sheet]', table, e?.message);
      }
    }

    const tick = async (maxAge = 4000) => {
      await flush();
      await pull(maxAge);
      if (alive && hasPending()) schedule();
    };

    pull().then(() => { if (alive && hasPending()) schedule(); });

    const iv = setInterval(() => { if (document.visibilityState === 'visible') tick(); }, POLL_MS);
    const wake = () => { tick(1500); };
    const vis = () => { if (document.visibilityState === 'visible') tick(1500); };
    window.addEventListener('online', wake);
    window.addEventListener(KEY_EVENT, wake);
    document.addEventListener('visibilitychange', vis);

    return () => {
      alive = false;
      clearInterval(iv);
      clearTimeout(timer.current);
      window.removeEventListener('online', wake);
      window.removeEventListener(KEY_EVENT, wake);
      document.removeEventListener('visibilitychange', vis);
    };
  }, [table, mode]);
}
